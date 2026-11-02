// money.ts — гроші в цілих копійках: розбір введення, форматування в гривнях, безпечна арифметика.
import type { Kop } from './types.ts';

export const NBSP = ' ';
export const MINUS = '−';
/** Верхня межа однієї суми — 10 млн грн. */
export const MAX_KOP: Kop = 1_000_000_000;

/** Гривні → копійки. Лише для констант і тестів; у розрахунках використовуються тільки копійки. */
export function uah(hryvnias: number): Kop {
  return Math.round(hryvnias * 100);
}

/**
 * Розбирає суму, введену людиною: «60», «60,5», «60.50», «1 234,56», «45 грн».
 * Повертає копійки або null, якщо введення некоректне, від'ємне чи завелике.
 * Третій знак після коми округлюється за правилом «половина — вгору».
 */
export function parseMoney(raw: string | number | null | undefined): Kop | null {
  if (raw === null || raw === undefined) return null;
  let s = typeof raw === 'number' ? String(raw) : raw;
  s = s
    .replace(/[\s  ]/g, '')
    .replace(/(грн\.?|₴)$/i, '')
    .replace(',', '.');
  if (s === '' || s === '.') return null;
  if (!/^\d*(\.\d*)?$/.test(s)) return null;
  const [intStr, fracStr = ''] = s.split('.');
  const intPart = intStr === '' ? 0 : Number(intStr);
  if (!Number.isSafeInteger(intPart)) return null;
  const frac = (fracStr + '000').slice(0, 3);
  let kop = intPart * 100 + Number(frac.slice(0, 2));
  if (Number(frac[2]) >= 5) kop += 1;
  if (!Number.isSafeInteger(kop) || kop > MAX_KOP) return null;
  return kop;
}

/** Розбиває ціле число на групи по три цифри нерозривним пробілом. */
export function groupDigits(n: number): string {
  return String(Math.trunc(Math.abs(n))).replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
}

export interface FmtOptions {
  currency?: boolean;
  sign?: boolean;
  decimals?: 'auto' | 'always' | 'never';
}

/** Копійки → «1 234,50 грн». Копійки показуються лише тоді, коли вони є (режим auto). */
export function fmt(kop: Kop, o: FmtOptions = {}): string {
  const v = Math.round(kop);
  const neg = v < 0;
  const abs = Math.abs(v);
  let whole = Math.floor(abs / 100);
  let cents = abs % 100;
  const mode = o.decimals ?? 'auto';
  if (mode === 'never' && cents !== 0) {
    if (cents >= 50) whole += 1;
    cents = 0;
  }
  const showDec = mode === 'always' || (mode === 'auto' && cents !== 0);
  let s = groupDigits(whole) + (showDec ? ',' + String(cents).padStart(2, '0') : '');
  if (neg && (whole !== 0 || cents !== 0)) s = MINUS + s;
  else if (o.sign && v > 0) s = '+' + s;
  return o.currency === false ? s : s + NBSP + 'грн';
}

/** Сума для поля введення: «60» або «60,5». */
export function toInput(kop: Kop | null | undefined): string {
  if (kop === null || kop === undefined) return '';
  const whole = Math.floor(Math.abs(kop) / 100);
  const cents = Math.abs(kop) % 100;
  if (cents === 0) return String(whole);
  return `${whole},${String(cents).padStart(2, '0').replace(/0$/, '')}`;
}

function trim1(x: number): string {
  const r = Math.round(x * 10) / 10;
  return (Number.isInteger(r) ? String(r) : r.toFixed(1)).replace('.', ',');
}

/** Коротка форма для підписів графіків: «850», «4,2 тис.», «1,2 млн». */
export function compact(kop: Kop): string {
  const g = Math.abs(kop) / 100;
  const sign = kop < 0 ? MINUS : '';
  if (g >= 1_000_000) return sign + trim1(g / 1_000_000) + NBSP + 'млн';
  if (g >= 10_000) return sign + String(Math.round(g / 1000)) + NBSP + 'тис.';
  if (g >= 1_000) return sign + trim1(g / 1000) + NBSP + 'тис.';
  return sign + String(Math.round(g));
}

/** Цілочисельне ділення з округленням до найближчого (половина — від нуля). */
export function roundDiv(n: number, d: number): number {
  if (d === 0) return 0;
  const q = n / d;
  return q >= 0 ? Math.floor(q + 0.5) : -Math.floor(-q + 0.5);
}

export function sumKop(list: readonly Kop[]): Kop {
  let s = 0;
  for (const v of list) s += v;
  return s;
}

/** Частка у відсотках, округлена до цілого. null — якщо база нульова. */
export function percent(part: number, whole: number): number | null {
  if (whole <= 0) return null;
  return Math.round((part * 100) / whole);
}

/** Українська множина: plural(5, ['день', 'дні', 'днів']) → «днів». */
export function plural(n: number, forms: readonly [string, string, string]): string {
  const a = Math.abs(Math.trunc(n)) % 100;
  const b = a % 10;
  if (a > 10 && a < 20) return forms[2];
  if (b === 1) return forms[0];
  if (b >= 2 && b <= 4) return forms[1];
  return forms[2];
}

export const DAYS: readonly [string, string, string] = ['день', 'дні', 'днів'];
export const WORKDAYS: readonly [string, string, string] = ['робочий день', 'робочі дні', 'робочих днів'];
export const TRIPS: readonly [string, string, string] = ['поїздка', 'поїздки', 'поїздок'];
export const TIMES: readonly [string, string, string] = ['раз', 'рази', 'разів'];

/** «3 дні», «21 робочий день». */
export function count(n: number, forms: readonly [string, string, string]): string {
  return `${n}${NBSP}${plural(n, forms)}`;
}
