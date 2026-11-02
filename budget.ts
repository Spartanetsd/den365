// budget.ts — особистий бюджет: доступні кошти, резерви до наступного доходу, безпечна сума для відкладання.
// Принципи:
//  • доступні кошти = залишок на початок указаної дати + рух грошей після неї (майбутні доходи не враховуються);
//  • спершу резервуються обовʼязкові платежі до наступного доходу, щоденні потреби й запас безпеки;
//  • якщо на обовʼязкове не вистачає — відкладати не рекомендується (безпечна сума = 0);
//  • невитрачений бюджет ≠ накопичення: безпечна сума лише підказує, скільки можна перевести.
import type { DayRecord, Kop, Obligation, Settings } from './types.ts';
import type { DayCalc, Index } from './ledger.ts';
import { planTotal } from './ledger.ts';
import { addDays, daysInMonth, diffDays, keyOf, monthKey, ymd } from './time.ts';

export const NO_INCOME_DAYS = 30;

/** Доступні кошти зараз або null, якщо залишок не вказано. */
export function availableNow(ix: Index, balance: Settings['budget']['balance'], today: string): Kop | null {
  if (!balance) return null;
  let a = balance.amount;
  for (const o of ix.all) {
    if (o.date < balance.date || o.date > today) continue;
    switch (o.type) {
      case 'income': a += o.amount; break;
      case 'expense': a -= o.amount; break;
      case 'refund': a += o.amount; break;
      case 'saving': a -= o.amount; break;
      case 'withdrawal': a += o.amount; break;
      default: break; // transfer і consumption не змінюють доступні кошти
    }
  }
  return a;
}

export function occurrence(y: number, m: number, day: number): string {
  return keyOf(y, m, Math.min(Math.max(1, day), daysInMonth(y, m)));
}

/** Найближча дата з цим днем місяця, строго після today. */
export function nextOccurrence(day: number, today: string): string {
  const { y, m } = ymd(today);
  const cur = occurrence(y, m, day);
  if (cur > today) return cur;
  return m === 12 ? occurrence(y + 1, 1, day) : occurrence(y, m + 1, day);
}

export interface NextIncome {
  id: string;
  name: string;
  date: string;
  amount: Kop;
}

export function nextIncome(incomes: Settings['budget']['incomes'], today: string): NextIncome | null {
  let best: NextIncome | null = null;
  for (const inc of incomes) {
    if (inc.amount <= 0) continue;
    const date = nextOccurrence(inc.day, today);
    if (!best || date < best.date) best = { id: inc.id, name: inc.name, date, amount: inc.amount };
  }
  return best;
}

export interface ObligationDue {
  id: string;
  name: string;
  kind: Obligation['kind'];
  date: string;
  amount: Kop;
  paid: boolean;
  overdue: boolean;
}

function isPaid(ix: Index, oblId: string, month: string): boolean {
  return ix.all.some((o) => o.type === 'expense' && o.obligationId === oblId && monthKey(o.date) === month);
}

/**
 * Обовʼязкові платежі у вікні [today, horizonEnd).
 * Прострочені в поточному місяці (після дати залишку) теж враховуються, поки не позначені сплаченими.
 */
export function obligationsDue(
  ix: Index,
  obligations: readonly Obligation[],
  today: string,
  horizonEnd: string,
  balanceDate: string | null,
): ObligationDue[] {
  const out: ObligationDue[] = [];
  const last = addDays(horizonEnd, -1);
  let { y, m } = ymd(today);
  const endMonth = monthKey(last < today ? today : last);
  for (let guard = 0; guard < 24; guard++) {
    const month = `${y}-${String(m).padStart(2, '0')}`;
    if (month > endMonth) break;
    for (const ob of obligations) {
      if (ob.amount <= 0) continue;
      const date = occurrence(y, m, ob.day);
      const paid = isPaid(ix, ob.id, month);
      if (date >= today && date < horizonEnd) {
        out.push({ id: ob.id, name: ob.name, kind: ob.kind, date, amount: ob.amount, paid, overdue: false });
      } else if (date < today && month === monthKey(today) && (!balanceDate || date >= balanceDate)) {
        out.push({ id: ob.id, name: ob.name, kind: ob.kind, date, amount: ob.amount, paid, overdue: !paid });
      }
    }
    m++;
    if (m > 12) { m = 1; y++; }
  }
  return out.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
}

export interface DailyNeed {
  amount: Kop;
  source: 'setting' | 'history' | 'plan' | 'none';
}

/** Орієнтовні щоденні витрати: з налаштувань, інакше медіана останніх днів із даними, інакше сьогоднішній план. */
export function dailyNeed(ix: Index, settings: Settings, days: Record<string, DayRecord>, today: string, todayPlan: Kop): DailyNeed {
  const est = settings.budget.dailyEstimate;
  if (est !== null && est >= 0) return { amount: est, source: 'setting' };
  const vals: Kop[] = [];
  for (let i = 1; i <= 21 && vals.length < 14; i++) {
    const d = addDays(today, -i);
    const own = ix.byDate.get(d) ?? [];
    if (!own.length && !days[d]?.closed) continue;
    let spent = 0;
    for (const o of ix.spendByDate.get(d) ?? []) {
      if (o.type === 'expense' && !o.obligationId && o.category !== 'bills') spent += o.amount;
      else if (o.type === 'refund') spent -= o.amount;
    }
    vals.push(Math.max(0, spent));
  }
  if (vals.length >= 3) {
    const s = [...vals].sort((a, b) => a - b);
    const mid = Math.floor(s.length / 2);
    const med = s.length % 2 ? s[mid] : Math.round((s[mid - 1] + s[mid]) / 2);
    return { amount: med, source: 'history' };
  }
  if (todayPlan > 0) return { amount: todayPlan, source: 'plan' };
  return { amount: 0, source: 'none' };
}

export interface BudgetView {
  status: 'unknown' | 'deficit' | 'ok';
  available: Kop | null;
  nextIncome: NextIncome | null;
  noIncome: boolean;
  horizonEnd: string;
  obligations: ObligationDue[];
  reserveObligations: Kop;
  reserveDaily: Kop;
  dailyDays: number;
  need: DailyNeed;
  reserveToday: Kop;
  buffer: Kop;
  free: Kop | null;
  shortfall: Kop;
  hasCredits: boolean;
  /** Скільки безпечно відкласти сьогодні; null — недостатньо даних. */
  safe: Kop | null;
  /** Потенціал економії сьогодні (якщо є план). */
  economy: Kop | null;
}

export interface BudgetInput {
  ix: Index;
  settings: Settings;
  days: Record<string, DayRecord>;
  today: string;
  todayCalc: DayCalc;
  todayClosed: boolean;
}

export function budgetView(input: BudgetInput): BudgetView {
  const { ix, settings, days, today, todayCalc, todayClosed } = input;
  const b = settings.budget;
  const available = availableNow(ix, b.balance, today);
  const ni = nextIncome(b.incomes, today);
  const horizonEnd = ni ? ni.date : addDays(today, NO_INCOME_DAYS);
  const obligations = obligationsDue(ix, b.obligations, today, horizonEnd, b.balance?.date ?? null);
  const reserveObligations = obligations.filter((o) => !o.paid).reduce((s, o) => s + o.amount, 0);
  const need = dailyNeed(ix, settings, days, today, todayCalc.planTotal);

  const dailyDays = Math.max(0, diffDays(today, horizonEnd) - 1);
  let reserveDaily = 0;
  for (let i = 1; i <= dailyDays; i++) {
    const d = addDays(today, i);
    const rec = days[d];
    reserveDaily += rec?.plan && rec.plan.length ? planTotal(rec.plan) : need.amount;
  }

  const todayExpected = todayCalc.plan ? todayCalc.planTotal : need.amount;
  const reserveToday = todayClosed ? 0 : Math.max(0, todayExpected - todayCalc.spent);
  const buffer = Math.max(0, b.buffer);
  const hasCredits = b.obligations.some((o) => o.kind === 'credit' && o.amount > 0);
  const economy = todayCalc.economy;

  if (available === null) {
    return {
      status: 'unknown', available, nextIncome: ni, noIncome: !ni, horizonEnd, obligations,
      reserveObligations, reserveDaily, dailyDays, need, reserveToday, buffer,
      free: null, shortfall: 0, hasCredits, safe: null, economy,
    };
  }

  const free = available - reserveObligations - reserveDaily - reserveToday - buffer;
  if (free < 0) {
    return {
      status: 'deficit', available, nextIncome: ni, noIncome: !ni, horizonEnd, obligations,
      reserveObligations, reserveDaily, dailyDays, need, reserveToday, buffer,
      free, shortfall: -free, hasCredits, safe: 0, economy,
    };
  }
  const safe = economy !== null ? Math.min(economy, free) : free;
  return {
    status: 'ok', available, nextIncome: ni, noIncome: !ni, horizonEnd, obligations,
    reserveObligations, reserveDaily, dailyDays, need, reserveToday, buffer,
    free, shortfall: 0, hasCredits, safe, economy,
  };
}

/** Підказка денного бюджету з місячних налаштувань: (доходи − обовʼязкові − ціль заощаджень) / днів у місяці. */
export function suggestedDaily(settings: Settings, today: string): Kop | null {
  const b = settings.budget;
  const income = b.incomes.reduce((s, i) => s + i.amount, 0);
  if (income <= 0) return null;
  const must = b.obligations.reduce((s, o) => s + o.amount, 0);
  const goal = b.monthlyGoal ?? 0;
  const { y, m } = ymd(today);
  const free = income - must - goal;
  if (free <= 0) return 0;
  return Math.floor(free / daysInMonth(y, m));
}
