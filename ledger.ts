// ledger.ts — облік: підсумки дня й періоду, план проти факту, повернення, накопичення.
// Правила:
//  • витрати дня рахуються лише з реальних грошових витрат (expense) мінус повернення (refund);
//  • повернення, привʼязане до витрати, коригує день і категорію початкової витрати;
//  • обовʼязкові платежі (оренда тощо) не входять у денний бюджет — вони резервуються окремо;
//  • собівартість уже куплених продуктів (consumption) не є рухом грошей;
//  • перекази в накопичення й між рахунками — не витрати;
//  • день без записів ≠ день без витрат.
import type { Category, DayRecord, DayStatus, Kop, Necessity, Operation, PlanLine } from './types.ts';
import { addDays, rangeKeys } from './time.ts';

export interface Index {
  /** Активні (не видалені) операції. */
  all: Operation[];
  byId: Map<string, Operation>;
  /** Операції за власною датою. */
  byDate: Map<string, Operation[]>;
  /** Витрати за датою + повернення за датою початкової витрати. */
  spendByDate: Map<string, Operation[]>;
}

function push<K, V>(map: Map<K, V[]>, k: K, v: V): void {
  const list = map.get(k);
  if (list) list.push(v);
  else map.set(k, [v]);
}

/** Дата, до якої відноситься повернення: дата початкової витрати або власна. */
export function refundDate(op: Operation, byId: Map<string, Operation>): string {
  if (op.type === 'refund' && op.refundOf) {
    const orig = byId.get(op.refundOf);
    if (orig && !orig.deletedAt) return orig.date;
  }
  return op.date;
}

export function buildIndex(ops: readonly Operation[]): Index {
  const all = ops.filter((o) => !o.deletedAt);
  const byId = new Map(all.map((o) => [o.id, o] as const));
  const byDate = new Map<string, Operation[]>();
  const spendByDate = new Map<string, Operation[]>();
  for (const o of all) {
    push(byDate, o.date, o);
    if (o.type === 'expense') push(spendByDate, o.date, o);
    else if (o.type === 'refund') push(spendByDate, refundDate(o, byId), o);
  }
  for (const list of byDate.values()) list.sort((a, b) => a.time - b.time);
  return { all, byId, byDate, spendByDate };
}

export function catMap(cats: readonly Category[]): Map<string, Category> {
  return new Map(cats.map((c) => [c.id, c] as const));
}

/** Обовʼязковий платіж (оренда, кредит…) — поза денним бюджетом. */
export function isBill(op: Operation): boolean {
  return op.type === 'expense' && (Boolean(op.obligationId) || op.category === 'bills');
}

function refundIsBill(op: Operation, byId: Map<string, Operation>): boolean {
  if (op.refundOf) {
    const orig = byId.get(op.refundOf);
    if (orig) return isBill(orig);
  }
  return op.category === 'bills';
}

export function necessityOf(op: Operation, cats: Map<string, Category>): Necessity {
  if (op.necessity) return op.necessity;
  return cats.get(op.category ?? 'other')?.necessity ?? 'flexible';
}

export function planTotal(plan: readonly PlanLine[] | null | undefined): Kop {
  if (!plan) return 0;
  let s = 0;
  for (const l of plan) s += l.amount;
  return s;
}

export function planByCategory(plan: readonly PlanLine[] | null | undefined): Record<string, Kop> {
  const out: Record<string, Kop> = {};
  for (const l of plan ?? []) out[l.category] = (out[l.category] ?? 0) + l.amount;
  return out;
}

export interface DayCalc {
  date: string;
  plan: PlanLine[] | null;
  planTotal: Kop;
  planByCat: Record<string, Kop>;
  /** Грошові витрати в межах денного бюджету (без обовʼязкових платежів). */
  gross: Kop;
  refunds: Kop;
  /** Фактично витрачено (gross − refunds). */
  spent: Kop;
  byCat: Record<string, Kop>;
  byNec: Record<Necessity, Kop>;
  /** Обовʼязкові платежі цього дня (поза денним бюджетом). */
  bills: Kop;
  /** Залишок денного бюджету (може бути відʼємним) або null, якщо плану немає. */
  remaining: Kop | null;
  /** Потенціал економії відносно плану (≥ 0) або null. */
  economy: Kop | null;
  over: Kop;
  usedPct: number | null;
  income: Kop;
  /** Переказано в накопичення мінус узято з накопичень. */
  saved: Kop;
  consumption: Kop;
  estimates: Kop;
  micro: Kop;
  /** Реальний рух грошей на їжу (продукти + їжа поза домом). */
  foodCash: Kop;
  /** Розрахункова собівартість харчування за день. */
  foodCost: Kop;
  ops: Operation[];
  hasData: boolean;
}

export function calcDay(ix: Index, date: string, rec: DayRecord | undefined, cats: Map<string, Category>): DayCalc {
  const own = ix.byDate.get(date) ?? [];
  const spend = ix.spendByDate.get(date) ?? [];
  let gross = 0;
  let refunds = 0;
  let bills = 0;
  let micro = 0;
  let foodCash = 0;
  let foodCost = 0;
  let estimates = 0;
  const byCat: Record<string, Kop> = {};
  const byNec: Record<Necessity, Kop> = { required: 0, flexible: 0, optional: 0, unexpected: 0 };

  for (const o of spend) {
    const catId = o.category ?? 'other';
    const cat = cats.get(catId);
    const isFood = catId === 'groceries' || catId === 'lunch' || Boolean(o.meal);
    if (o.type === 'expense') {
      if (isBill(o)) {
        bills += o.amount;
        continue;
      }
      gross += o.amount;
      byCat[catId] = (byCat[catId] ?? 0) + o.amount;
      byNec[necessityOf(o, cats)] += o.amount;
      if (cat?.micro) micro += o.amount;
      if (isFood) foodCash += o.amount;
      if (o.meal) foodCost += o.amount;
      estimates += o.estimate ?? 0;
    } else {
      if (refundIsBill(o, ix.byId)) {
        bills -= o.amount;
        continue;
      }
      refunds += o.amount;
      byCat[catId] = (byCat[catId] ?? 0) - o.amount;
      const orig = o.refundOf ? ix.byId.get(o.refundOf) : undefined;
      byNec[necessityOf(orig ?? o, cats)] -= o.amount;
      if (cat?.micro) micro -= o.amount;
      if (isFood) foodCash -= o.amount;
    }
  }

  let income = 0;
  let saved = 0;
  let consumption = 0;
  for (const o of own) {
    if (o.type === 'income') income += o.amount;
    else if (o.type === 'saving') saved += o.amount;
    else if (o.type === 'withdrawal') saved -= o.amount;
    else if (o.type === 'consumption') {
      consumption += o.amount;
      if (o.meal) foodCost += o.amount;
    }
  }

  const plan = rec?.plan ?? null;
  const pTotal = planTotal(plan);
  const spent = gross - refunds;
  const hasPlan = plan !== null && plan.length > 0;
  return {
    date,
    plan: hasPlan ? plan : null,
    planTotal: pTotal,
    planByCat: planByCategory(plan),
    gross,
    refunds,
    spent,
    byCat,
    byNec,
    bills,
    remaining: hasPlan ? pTotal - spent : null,
    economy: hasPlan ? Math.max(0, pTotal - spent) : null,
    over: hasPlan ? Math.max(0, spent - pTotal) : 0,
    usedPct: hasPlan && pTotal > 0 ? Math.round((spent * 100) / pTotal) : null,
    income,
    saved,
    consumption,
    estimates,
    micro,
    foodCash,
    foodCost,
    ops: own,
    hasData: own.length > 0,
  };
}

/**
 * Статус дня:
 *  future — майбутній; open — сьогодні, ще не завершений;
 *  closed — завершений користувачем (навіть без витрат — це день без витрат);
 *  recorded — минулий день із записами, але не завершений;
 *  missing — минулий день без жодних записів (даних немає — це НЕ нульові витрати).
 */
export function dayStatus(date: string, today: string, rec: DayRecord | undefined, hasData: boolean): DayStatus {
  if (date > today) return 'future';
  if (rec?.closed) return 'closed';
  if (date === today) return 'open';
  return hasData ? 'recorded' : 'missing';
}

/** Чи є в дня дані для статистики (завершений або має записи). */
export function counted(status: DayStatus, hasData: boolean): boolean {
  return status === 'closed' || hasData;
}

export interface PeriodDay {
  date: string;
  status: DayStatus;
  calc: DayCalc;
  counted: boolean;
}

export interface PeriodCalc {
  from: string;
  to: string;
  days: PeriodDay[];
  dataDays: number;
  noSpendDays: number;
  missingDays: number;
  closedDays: number;
  spent: Kop;
  bills: Kop;
  plan: Kop;
  planDays: number;
  /** Сума (план − факт) по днях із планом і даними; може бути відʼємною. */
  economy: Kop;
  byCat: Record<string, Kop>;
  byNec: Record<Necessity, Kop>;
  income: Kop;
  saved: Kop;
  micro: Kop;
  foodCash: Kop;
  foodCost: Kop;
  consumption: Kop;
  avgPerDataDay: Kop | null;
}

export function calcPeriod(
  ix: Index,
  days: Record<string, DayRecord>,
  cats: Map<string, Category>,
  from: string,
  to: string,
  today: string,
): PeriodCalc {
  const end = to > today ? today : to;
  const res: PeriodCalc = {
    from, to: end, days: [], dataDays: 0, noSpendDays: 0, missingDays: 0, closedDays: 0,
    spent: 0, bills: 0, plan: 0, planDays: 0, economy: 0, byCat: {},
    byNec: { required: 0, flexible: 0, optional: 0, unexpected: 0 },
    income: 0, saved: 0, micro: 0, foodCash: 0, foodCost: 0, consumption: 0, avgPerDataDay: null,
  };
  if (from > end) return res;
  for (const date of rangeKeys(from, end)) {
    const rec = days[date];
    const calc = calcDay(ix, date, rec, cats);
    const status = dayStatus(date, today, rec, calc.hasData);
    const isCounted = counted(status, calc.hasData);
    res.days.push({ date, status, calc, counted: isCounted });
    if (status === 'closed') res.closedDays++;
    if (!isCounted) {
      if (status === 'missing') res.missingDays++;
      continue;
    }
    res.dataDays++;
    if (calc.spent === 0) res.noSpendDays++;
    res.spent += calc.spent;
    res.bills += calc.bills;
    if (calc.plan) {
      res.plan += calc.planTotal;
      res.planDays++;
      res.economy += calc.planTotal - calc.spent;
    }
    for (const [k, v] of Object.entries(calc.byCat)) res.byCat[k] = (res.byCat[k] ?? 0) + v;
    for (const k of Object.keys(res.byNec) as Necessity[]) res.byNec[k] += calc.byNec[k];
    res.income += calc.income;
    res.saved += calc.saved;
    res.micro += calc.micro;
    res.foodCash += calc.foodCash;
    res.foodCost += calc.foodCost;
    res.consumption += calc.consumption;
  }
  res.avgPerDataDay = res.dataDays > 0 ? Math.round(res.spent / res.dataDays) : null;
  return res;
}

/** Загальна сума накопичень: стартова подушка + перекази − зняття (до дати включно). */
export function savingsTotal(ix: Index, start: Kop, upTo?: string): Kop {
  let s = start;
  for (const o of ix.all) {
    if (upTo && o.date > upTo) continue;
    if (o.type === 'saving') s += o.amount;
    else if (o.type === 'withdrawal') s -= o.amount;
  }
  return s;
}

export function savingsSeries(ix: Index, start: Kop, from: string, to: string): { date: string; total: Kop }[] {
  let base = start;
  const delta = new Map<string, Kop>();
  for (const o of ix.all) {
    if (o.type !== 'saving' && o.type !== 'withdrawal') continue;
    const v = o.type === 'saving' ? o.amount : -o.amount;
    if (o.date < from) base += v;
    else if (o.date <= to) delta.set(o.date, (delta.get(o.date) ?? 0) + v);
  }
  const out: { date: string; total: Kop }[] = [];
  let run = base;
  for (const d of rangeKeys(from, to)) {
    run += delta.get(d) ?? 0;
    out.push({ date: d, total: run });
  }
  return out;
}

/** Опис операції для списків. */
export function opTitle(op: Operation, cats: Map<string, Category>): string {
  if (op.title) return op.title;
  switch (op.type) {
    case 'income': return 'Дохід';
    case 'refund': return 'Повернення коштів';
    case 'saving': return 'Переказ у накопичення';
    case 'withdrawal': return 'Узято з накопичень';
    case 'transfer': return 'Переказ між своїми рахунками';
    case 'consumption': return 'Собівартість (продукти вже куплені)';
    default: return cats.get(op.category ?? 'other')?.name ?? 'Витрата';
  }
}

/** Знайти операції плану: які рядки плану вже виконані (є привʼязані записи). */
export function planLineFacts(ix: Index, date: string): Map<string, Operation[]> {
  const out = new Map<string, Operation[]>();
  for (const o of ix.byDate.get(date) ?? []) {
    if (!o.planLineId) continue;
    push(out, o.planLineId, o);
  }
  return out;
}

/** Останні n днів до дати (не включаючи її). */
export function previousDays(date: string, n: number): string[] {
  const out: string[] = [];
  for (let i = n; i >= 1; i--) out.push(addDays(date, -i));
  return out;
}
