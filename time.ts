// time.ts — календарні дати за київським часом (Europe/Kyiv) незалежно від налаштувань пристрою.
// Дата дня — рядок 'РРРР-ММ-ДД'. Арифметика днів ведеться в UTC над календарною датою, тому переходи
// на літній/зимовий час її не ламають.

export const DAY_MS = 86_400_000;

function pickKyiv(): string {
  for (const name of ['Europe/Kyiv', 'Europe/Kiev']) {
    try {
      new Intl.DateTimeFormat('en-GB', { timeZone: name }).format(0);
      return name;
    } catch {
      // старі бази часових поясів знають лише назву Europe/Kiev
    }
  }
  return 'Europe/Kiev';
}

export const KYIV = pickKyiv();

export interface KyivParts {
  y: number;
  m: number;
  d: number;
  hh: number;
  mm: number;
}

let partsFormat: Intl.DateTimeFormat | null = null;

/** Складові моменту часу (мс) у Києві. */
export function kyivParts(ms: number): KyivParts {
  partsFormat ??= new Intl.DateTimeFormat('en-GB', {
    timeZone: KYIV,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });
  const out: Record<string, number> = {};
  for (const p of partsFormat.formatToParts(new Date(ms))) {
    if (p.type !== 'literal') out[p.type] = Number(p.value);
  }
  return { y: out.year, m: out.month, d: out.day, hh: out.hour % 24, mm: out.minute };
}

const pad2 = (n: number): string => String(n).padStart(2, '0');

export function keyOf(y: number, m: number, d: number): string {
  return `${y}-${pad2(m)}-${pad2(d)}`;
}

/** Календарна дата моменту часу в Києві. */
export function dateKey(ms: number): string {
  const p = kyivParts(ms);
  return keyOf(p.y, p.m, p.d);
}

export function todayKey(now: number = Date.now()): string {
  return dateKey(now);
}

export function ymd(key: string): { y: number; m: number; d: number } {
  return { y: Number(key.slice(0, 4)), m: Number(key.slice(5, 7)), d: Number(key.slice(8, 10)) };
}

function utc(key: string): number {
  const { y, m, d } = ymd(key);
  return Date.UTC(y, m - 1, d);
}

export function isDateKey(key: unknown): key is string {
  if (typeof key !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(key)) return false;
  const t = new Date(utc(key));
  return keyOf(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate()) === key;
}

export function addDays(key: string, n: number): string {
  const t = new Date(utc(key) + n * DAY_MS);
  return keyOf(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate());
}

/** Кількість днів від from до to (to − from). */
export function diffDays(from: string, to: string): number {
  return Math.round((utc(to) - utc(from)) / DAY_MS);
}

/** День тижня: 0 — понеділок, 6 — неділя. */
export function weekday(key: string): number {
  return (new Date(utc(key)).getUTCDay() + 6) % 7;
}

export function daysInMonth(y: number, m: number): number {
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

export function monthKey(key: string): string {
  return key.slice(0, 7);
}

export function startOfWeek(key: string): string {
  return addDays(key, -weekday(key));
}

export function startOfMonth(key: string): string {
  return key.slice(0, 8) + '01';
}

export function startOfYear(key: string): string {
  return key.slice(0, 5) + '01-01';
}

/** Момент часу (мс) для київських дати й часу; враховує літній час. */
export function msAtKyiv(key: string, hh: number, mm: number): number {
  const { y, m, d } = ymd(key);
  const target = Date.UTC(y, m - 1, d, hh, mm);
  let guess = target - 2 * 3_600_000;
  for (let i = 0; i < 3; i++) {
    const p = kyivParts(guess);
    const diff = Date.UTC(p.y, p.m - 1, p.d, p.hh, p.mm) - target;
    if (diff === 0) break;
    guess -= diff;
  }
  return guess;
}

export function timeHM(ms: number): string {
  const p = kyivParts(ms);
  return `${pad2(p.hh)}:${pad2(p.mm)}`;
}

/** «2026-11-02 17:40» за київським часом — для файлів експорту. */
export function stamp(ms: number): string {
  const p = kyivParts(ms);
  return `${keyOf(p.y, p.m, p.d)} ${pad2(p.hh)}:${pad2(p.mm)}`;
}

export const MONTHS_GEN = [
  'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
  'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня',
] as const;
export const MONTHS_NOM = [
  'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
  'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень',
] as const;
export const MONTHS_SHORT = [
  'січ', 'лют', 'бер', 'квіт', 'трав', 'черв', 'лип', 'серп', 'вер', 'жовт', 'лист', 'груд',
] as const;
export const WEEKDAYS = [
  'понеділок', 'вівторок', 'середа', 'четвер', 'пʼятниця', 'субота', 'неділя',
] as const;
export const WEEKDAYS_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'] as const;

export function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** «2 листопада», «понеділок, 2 листопада 2026». */
export function fmtDate(key: string, o: { year?: boolean; weekday?: boolean } = {}): string {
  const { y, m, d } = ymd(key);
  let s = `${d} ${MONTHS_GEN[m - 1]}`;
  if (o.year) s += ` ${y}`;
  if (o.weekday) s = `${WEEKDAYS[weekday(key)]}, ${s}`;
  return s;
}

/** «02.11» */
export function fmtShort(key: string): string {
  const { m, d } = ymd(key);
  return `${pad2(d)}.${pad2(m)}`;
}

/** «Сьогодні» / «Учора» / «Завтра» або null. */
export function relLabel(key: string, today: string): string | null {
  const d = diffDays(today, key);
  if (d === 0) return 'Сьогодні';
  if (d === -1) return 'Учора';
  if (d === 1) return 'Завтра';
  return null;
}

export function rangeKeys(from: string, to: string): string[] {
  const out: string[] = [];
  for (let k = from; k <= to; k = addDays(k, 1)) out.push(k);
  return out;
}

export function minKey(a: string, b: string): string {
  return a < b ? a : b;
}

export function maxKey(a: string, b: string): string {
  return a > b ? a : b;
}
