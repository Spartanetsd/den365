// insights.ts — «Ціна рішення», «Маленькі гроші — великий результат», рішення з найбільшим впливом.
// Порівняння показуються лише тоді, коли для них досить даних.
import type { Category, DayRecord, Kop, Settings } from './types.ts';
import type { DayCalc, Index, PeriodCalc } from './ledger.ts';
import { calcPeriod } from './ledger.ts';
import { canteenRef, homeMealRef, isHomeMeal } from './meals.ts';
import { publicRef, taxiRef } from './transport.ts';
import { fmt, percent, plural, roundDiv } from './money.ts';
import { addDays, startOfMonth, startOfWeek, startOfYear } from './time.ts';

export interface MicroTotals {
  day: Kop;
  week: Kop;
  month: Kop;
  year: Kop;
  avgPerDataDay: Kop | null;
  dataDays: number;
}

/** Мікровитрати за сьогодні, поточні тиждень, місяць і рік. */
export function microTotals(ix: Index, days: Record<string, DayRecord>, cats: Map<string, Category>, today: string): MicroTotals {
  const sum = (from: string) => calcPeriod(ix, days, cats, from, today, today);
  const y = sum(startOfYear(today));
  const last30 = sum(addDays(today, -29));
  const microOf = (from: string) => y.days.filter((d) => d.date >= from).reduce((s, d) => s + d.calc.micro, 0);
  return {
    day: microOf(today),
    week: microOf(startOfWeek(today)),
    month: microOf(startOfMonth(today)),
    year: y.micro,
    avgPerDataDay: last30.dataDays >= 7 ? Math.round(last30.micro / last30.dataDays) : null,
    dataDays: last30.dataDays,
  };
}

export interface PriceInput {
  ix: Index;
  days: Record<string, DayRecord>;
  cats: Map<string, Category>;
  settings: Settings;
  today: string;
  date: string;
  calc: DayCalc;
}

/** Короткі порівняння «Ціна рішення». */
export function priceOfDecision(p: PriceInput): string[] {
  const out: string[] = [];
  const dayOps = p.ix.byDate.get(p.date) ?? [];
  const taxi = dayOps.filter((o) => o.type === 'expense' && o.trip?.mode === 'taxi').reduce((s, o) => s + o.amount, 0);
  const pub = publicRef(p.ix, p.settings, p.today);
  if (taxi > 0 && pub && pub.cost > 0) {
    const n = Math.round(taxi / pub.cost);
    if (n >= 2) out.push(`Таксі цього дня коштувало стільки ж, скільки ${n} ${plural(n, ['звичайна поїздка', 'звичайні поїздки', 'звичайних поїздок'])} громадським транспортом.`);
  }
  const weekFrom = startOfWeek(p.date);
  const week = calcPeriod(p.ix, p.days, p.cats, weekFrom, p.date, p.today);
  const coffee = week.byCat.coffee ?? 0;
  const flexPlan = week.days.filter((d) => d.counted && d.calc.plan).reduce((s, d) => s + d.calc.planTotal, 0);
  if (coffee > 0 && flexPlan > 0) {
    const pc = percent(coffee, flexPlan);
    if (pc !== null && pc >= 1) out.push(`Цього тижня кава — ${pc}% твого запланованого гнучкого бюджету.`);
  }
  const canteenToday = dayOps.filter((o) => o.type === 'expense' && o.meal && !isHomeMeal(o.meal.kind)).reduce((s, o) => s + o.amount, 0);
  const home = homeMealRef(p.ix, p.today);
  if (canteenToday > 0 && home && home > 0) {
    const n = Math.floor(canteenToday / home);
    if (n >= 2) out.push(`Обід поза домом коштував як ${n} ${plural(n, ['домашній обід', 'домашні обіди', 'домашніх обідів'])}.`);
  }
  return out.slice(0, 2);
}

export interface Impact {
  id: string;
  label: string;
  amount: Kop;
  detail: string;
}

/** Рішення, які за останні 30 днів найбільше вплинули на бюджет. */
export function decisionImpacts(ix: Index, days: Record<string, DayRecord>, cats: Map<string, Category>, settings: Settings, today: string): Impact[] {
  const from = addDays(today, -29);
  const out: Impact[] = [];
  const ops = ix.all.filter((o) => o.date >= from && o.date <= today && o.type === 'expense');
  const taxis = ops.filter((o) => o.trip?.mode === 'taxi');
  const pub = publicRef(ix, settings, today);
  if (taxis.length && pub) {
    const premium = taxis.reduce((s, o) => s + Math.max(0, o.amount + (o.estimate ?? 0) - pub.cost), 0);
    if (premium > 0) out.push({ id: 'taxi', label: 'Таксі замість громадського транспорту', amount: premium, detail: `${taxis.length} ${plural(taxis.length, ['поїздка', 'поїздки', 'поїздок'])}, доплата порівняно зі звичайним проїздом` });
  }
  const outMeals = ops.filter((o) => o.meal && !isHomeMeal(o.meal.kind));
  const home = homeMealRef(ix, today);
  if (outMeals.length && home !== null) {
    const premium = outMeals.reduce((s, o) => s + Math.max(0, o.amount - home), 0);
    if (premium > 0) out.push({ id: 'meals', label: 'Їжа поза домом', amount: premium, detail: `${outMeals.length} ${plural(outMeals.length, ['раз', 'рази', 'разів'])}, різниця з домашнім обідом` });
  }
  const period = calcPeriod(ix, days, cats, from, today, today);
  if (period.micro > 0) out.push({ id: 'micro', label: 'Кава й смаколики', amount: period.micro, detail: 'Сума дрібних покупок за 30 днів' });
  const over: Record<string, Kop> = {};
  for (const d of period.days) {
    if (!d.counted || !d.calc.plan) continue;
    for (const [cat, v] of Object.entries(d.calc.byCat)) {
      const diff = v - (d.calc.planByCat[cat] ?? 0);
      if (diff > 0) over[cat] = (over[cat] ?? 0) + diff;
    }
  }
  for (const [cat, v] of Object.entries(over)) {
    if (v < 10_000 || cat === 'coffee' || cat === 'treats') continue;
    out.push({ id: 'over-' + cat, label: `Перевищення плану: ${cats.get(cat)?.name ?? cat}`, amount: v, detail: 'Сума перевитрат понад план у цій категорії' });
  }
  return out.sort((a, b) => b.amount - a.amount).slice(0, 4);
}

export function topCategories(period: PeriodCalc, cats: Map<string, Category>, limit = 3): { id: string; name: string; amount: Kop; share: number }[] {
  const total = Object.values(period.byCat).reduce((s, v) => s + Math.max(0, v), 0);
  return Object.entries(period.byCat)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id, amount]) => ({ id, name: cats.get(id)?.name ?? id, amount, share: total > 0 ? Math.round((amount * 100) / total) : 0 }));
}

export function biggestCategory(calc: DayCalc, cats: Map<string, Category>): { id: string; name: string; amount: Kop } | null {
  let best: [string, Kop] | null = null;
  for (const [id, v] of Object.entries(calc.byCat)) if (v > 0 && (!best || v > best[1])) best = [id, v];
  return best ? { id: best[0], name: cats.get(best[0])?.name ?? best[0], amount: best[1] } : null;
}

/** Головна вдала фінансова дія дня — найвагоміше позитивне рішення. */
export function bestAction(p: PriceInput): string | null {
  const cands: { text: string; value: Kop }[] = [];
  const dayOps = p.ix.byDate.get(p.date) ?? [];
  const canteen = canteenRef(p.ix, p.settings, p.today);
  for (const o of dayOps) {
    if (o.meal && isHomeMeal(o.meal.kind) && canteen && canteen.amount > o.amount) {
      cands.push({ text: `Домашня їжа замість їдальні: різниця ${fmt(canteen.amount - o.amount)}.`, value: canteen.amount - o.amount });
    }
  }
  const tRef = taxiRef(p.ix, p.today);
  const pubTrips = dayOps.filter((o) => o.type === 'expense' && o.trip && ['bus', 'tram', 'trolley', 'metro', 'walk'].includes(o.trip.mode));
  if (tRef && pubTrips.length) {
    const saved = pubTrips.reduce((s, o) => s + Math.max(0, tRef.cost - o.amount), 0);
    if (saved > 0) cands.push({ text: `Громадський транспорт чи пішки замість таксі: умовно збережено ${fmt(saved)}.`, value: saved });
  }
  if (p.calc.saved > 0) cands.push({ text: `Відкладено ${fmt(p.calc.saved)} — це вже реальні заощадження.`, value: p.calc.saved * 2 });
  if (p.calc.plan && p.calc.economy !== null && p.calc.economy > 0) {
    cands.push({ text: `День у межах плану з запасом ${fmt(p.calc.economy)}.`, value: p.calc.economy });
  }
  const joy = p.settings.joyBudget;
  if (joy !== null && p.calc.micro > 0 && p.calc.micro <= joy) cands.push({ text: 'Приємності вклалися в бюджет радості.', value: roundDiv(joy - p.calc.micro, 2) });
  if (p.calc.hasData && p.calc.spent === 0) cands.push({ text: 'День без витрат.', value: 1 });
  cands.sort((a, b) => b.value - a.value);
  return cands[0]?.text ?? null;
}
