// forecast.ts — прогнози на 30, 182 і 365 днів у трьох сценаріях.
// Чесні правила:
//  • прогноз будується лише на днях із планом і даними (пропущені дні не вважаються нульовими);
//  • робочі й вихідні дні рахуються окремо за фактичним календарем;
//  • поки спостережень мало — показується лише умовна ілюстрація, а не прогноз;
//  • прогнозована економія — не накопичення: гроші стають заощадженнями лише після переказу.
import type { CalendarSettings, Category, DayRecord, Kop } from './types.ts';
import type { Index } from './ledger.ts';
import { calcDay } from './ledger.ts';
import { countDays, inStay, isWorkday } from './calendar.ts';
import { addDays } from './time.ts';

export const SPANS = [30, 182, 365] as const;
export type Span = (typeof SPANS)[number];
export const MIN_SAMPLES = 5;
export const MIN_WORK = 3;
export const MIN_OFF = 3;

export interface Sample {
  date: string;
  economy: Kop;
  plan: Kop;
  work: boolean;
  stay: boolean;
}

/** Дні-спостереження: є план і дані; сьогоднішній — лише якщо завершений. */
export function collectSamples(
  ix: Index,
  days: Record<string, DayRecord>,
  cats: Map<string, Category>,
  cal: CalendarSettings,
  today: string,
): Sample[] {
  const out: Sample[] = [];
  for (const rec of Object.values(days)) {
    if (!rec.plan || !rec.plan.length || rec.date > today) continue;
    if (rec.date === today && !rec.closed) continue;
    const c = calcDay(ix, rec.date, rec, cats);
    if (!c.hasData && !rec.closed) continue;
    out.push({ date: rec.date, economy: c.planTotal - c.spent, plan: c.planTotal, work: isWorkday(rec.date, cal), stay: inStay(rec.date, cal) });
  }
  return out.sort((a, b) => (a.date < b.date ? -1 : 1));
}

export function median(xs: readonly number[]): number {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : Math.round((s[mid - 1] + s[mid]) / 2);
}

export function mean(xs: readonly number[]): number {
  if (!xs.length) return 0;
  let s = 0;
  for (const x of xs) s += x;
  return Math.round(s / xs.length);
}

export type ScenarioId = 'conservative' | 'base' | 'optimistic';

export interface Scenario {
  id: ScenarioId;
  label: string;
  note: string;
  perWork: Kop;
  perOff: Kop;
  totals: Record<Span, Kop>;
}

export interface Forecast {
  enough: boolean;
  samples: number;
  work: number;
  off: number;
  adherence: number | null;
  counts: Record<Span, { work: number; off: number }>;
  scenarios: Scenario[];
  stayOnly: boolean;
}

function horizonCounts(cal: CalendarSettings, today: string, stayOnly: boolean): Record<Span, { work: number; off: number }> {
  const from = addDays(today, 1);
  return {
    30: countDays(from, 30, cal, stayOnly),
    182: countDays(from, 182, cal, stayOnly),
    365: countDays(from, 365, cal, stayOnly),
  };
}

function optimistic(xs: readonly number[]): number {
  if (!xs.length) return 0;
  const good = xs.filter((x) => x >= 0);
  const bad = xs.filter((x) => x < 0);
  const p = good.length / xs.length;
  const pOpt = Math.min(1, p + 0.2);
  return Math.round(pOpt * mean(good) + (1 - pOpt) * mean(bad));
}

export function forecast(samples: readonly Sample[], cal: CalendarSettings, today: string, stayOnly = false): Forecast {
  const pool = stayOnly && cal.stays.length ? samples.filter((s) => s.stay) : samples;
  const work = pool.filter((s) => s.work).map((s) => s.economy);
  const off = pool.filter((s) => !s.work).map((s) => s.economy);
  const counts = horizonCounts(cal, today, stayOnly);
  const enough = pool.length >= MIN_SAMPLES && work.length >= MIN_WORK;
  const offOk = off.length >= MIN_OFF;
  const adherence = pool.length ? Math.round((pool.filter((s) => s.economy >= 0).length * 100) / pool.length) : null;

  const baseWork = median(work);
  const baseOff = offOk ? median(off) : 0;
  const consWork = Math.min(baseWork, mean(work));
  const consOff = offOk ? Math.min(0, median(off)) : 0;
  const optWork = Math.max(baseWork, optimistic(work));
  const optOff = offOk ? Math.max(baseOff, optimistic(off)) : 0;

  const make = (id: ScenarioId, label: string, note: string, pw: Kop, po: Kop): Scenario => ({
    id, label, note, perWork: pw, perOff: po,
    totals: {
      30: pw * counts[30].work + po * counts[30].off,
      182: pw * counts[182].work + po * counts[182].off,
      365: pw * counts[365].work + po * counts[365].off,
    },
  });

  return {
    enough,
    samples: pool.length,
    work: work.length,
    off: off.length,
    adherence,
    counts,
    stayOnly: stayOnly && cal.stays.length > 0,
    scenarios: [
      make('conservative', 'Консервативний', 'Економія повторюється лише в робочі дні; перевитрати вихідних враховано, їхню економію — ні.', consWork, consOff),
      make('base', 'Базовий', 'Медіанний результат твоїх днів окремо для робочих і вихідних.', baseWork, baseOff),
      make('optimistic', 'Оптимістичний', 'Ти тримаєшся плану на 20 відсоткових пунктів частіше, ніж зараз.', optWork, optOff),
    ],
  };
}

/** Умовна ілюстрація: «якщо повторювати цю економію в робочі дні». Не прогноз. */
export function illustrate(daily: Kop, cal: CalendarSettings, today: string, stayOnly = false): Record<Span, { amount: Kop; work: number }> {
  const c = horizonCounts(cal, today, stayOnly);
  return {
    30: { amount: daily * c[30].work, work: c[30].work },
    182: { amount: daily * c[182].work, work: c[182].work },
    365: { amount: daily * c[365].work, work: c[365].work },
  };
}

export interface SavingsPace {
  perDay: Kop;
  transfers: number;
  span: number;
}

/** Темп реальних переказів у накопичення за останні 30 днів (потрібно ≥ 2 переказів і ≥ 14 днів історії). */
export function savingsPace(ix: Index, today: string, windowDays = 30): SavingsPace | null {
  const from = addDays(today, -(windowDays - 1));
  const list = ix.all.filter((o) => (o.type === 'saving' || o.type === 'withdrawal') && o.date >= from && o.date <= today);
  const transfers = list.filter((o) => o.type === 'saving').length;
  if (transfers < 2) return null;
  const first = ix.all.filter((o) => o.type === 'saving').reduce((m, o) => (o.date < m ? o.date : m), today);
  const spanStart = first > from ? first : from;
  const span = Math.round((Date.UTC(+today.slice(0, 4), +today.slice(5, 7) - 1, +today.slice(8, 10)) - Date.UTC(+spanStart.slice(0, 4), +spanStart.slice(5, 7) - 1, +spanStart.slice(8, 10))) / 86_400_000) + 1;
  if (span < 14) return null;
  const net = list.reduce((s, o) => s + (o.type === 'saving' ? o.amount : -o.amount), 0);
  return { perDay: Math.round(net / span), transfers, span };
}
