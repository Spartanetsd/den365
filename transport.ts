// transport.ts — «Як їхати вигідніше?»: вартість поїздок, авто, частка пасажирів, ціна комфорту.
// Тарифів і маршрутів ми не вигадуємо: усі значення — від користувача або з його власної історії.
import type { CarInfo, Kop, Operation, Settings, TripDir, TripMode } from './types.ts';
import type { Index } from './ledger.ts';
import { roundDiv } from './money.ts';
import { addDays } from './time.ts';

export const MODES: { id: TripMode; label: string; icon: string; public: boolean }[] = [
  { id: 'bus', label: 'Автобус', icon: 'bus', public: true },
  { id: 'tram', label: 'Трамвай', icon: 'tram', public: true },
  { id: 'trolley', label: 'Тролейбус', icon: 'trolley', public: true },
  { id: 'metro', label: 'Метро', icon: 'metro', public: true },
  { id: 'taxi', label: 'Таксі', icon: 'taxi', public: false },
  { id: 'car', label: 'Власне авто', icon: 'car', public: false },
  { id: 'walk', label: 'Пішки', icon: 'walk', public: false },
  { id: 'combo', label: 'Комбінований', icon: 'route', public: false },
];

export const DIRS: { id: TripDir; label: string }[] = [
  { id: 'there', label: 'Туди' },
  { id: 'back', label: 'Назад' },
  { id: 'other', label: 'Інша поїздка' },
];

export function modeInfo(mode: TripMode): (typeof MODES)[number] {
  return MODES.find((m) => m.id === mode) ?? MODES[0];
}

export function isPublic(mode: TripMode): boolean {
  return modeInfo(mode).public;
}

/**
 * Вартість пального: (відстань × витрата на 100 км / 100) × ціна літра.
 * Рахується в цілих числах: км до 0,1, витрата до 0,01 л — без похибок плаваючої коми.
 */
export function fuelCost(km: number, per100: number, priceKop: Kop): Kop {
  const kmT = Math.round(km * 10);
  const cH = Math.round(per100 * 100);
  if (kmT <= 0 || cH <= 0 || priceKop <= 0) return 0;
  return Math.floor((kmT * cH * priceKop + 50_000) / 100_000);
}

export interface CarCost {
  fuel: Kop;
  wear: Kop;
  parking: Kop;
  other: Kop;
  /** Нові гроші, витрачені саме на цю поїздку. */
  cash: Kop;
  /** Розрахункова частина: передплачене пальне + знос. */
  estimate: Kop;
  total: Kop;
}

export function carCost(car: CarInfo): CarCost {
  const fuel = fuelCost(car.km, car.per100, car.fuelPrice);
  const wear = Math.round(Math.max(0, car.km) * Math.max(0, car.wearPerKm));
  const parking = Math.max(0, car.parking);
  const other = Math.max(0, car.other);
  const cash = (car.fuelPrepaid ? 0 : fuel) + parking + other;
  const estimate = (car.fuelPrepaid ? fuel : 0) + wear;
  return { fuel, wear, parking, other, cash, estimate, total: cash + estimate };
}

export interface TripInput {
  mode: TripMode;
  /** Ціна поїздки (для всіх, хто їде разом), якщо це не власне авто. */
  cost: Kop;
  passengers: number;
  split: boolean;
  car?: CarInfo;
}

export interface TripAmounts {
  /** Повна вартість поїздки для всіх. */
  full: Kop;
  /** Твій грошовий видаток. */
  cash: Kop;
  /** Твоя розрахункова (негрошова) частина. */
  estimate: Kop;
  /** Твоя частка повної вартості. */
  share: Kop;
  car?: CarCost;
}

export function tripAmounts(t: TripInput): TripAmounts {
  let cashAll = 0;
  let estAll = 0;
  let car: CarCost | undefined;
  if (t.mode === 'car' && t.car) {
    car = carCost(t.car);
    cashAll = car.cash;
    estAll = car.estimate;
  } else if (t.mode !== 'walk') {
    cashAll = Math.max(0, t.cost);
  }
  const n = Math.max(1, Math.floor(t.passengers || 1));
  const divide = t.split && n > 1;
  const cash = divide ? roundDiv(cashAll, n) : cashAll;
  const estimate = divide ? roundDiv(estAll, n) : estAll;
  return { full: cashAll + estAll, cash, estimate, share: cash + estimate, car };
}

export interface ComfortPrice {
  /** Наскільки дорожчий швидший варіант. */
  extra: Kop;
  /** Скільки хвилин він економить. */
  saved: number;
  /** Вартість зекономленого часу за цінністю години користувача. */
  timeValue: Kop | null;
  /** Чиста плата за комфорт (доплата мінус вартість часу). */
  pureComfort: Kop | null;
  verdict: 'cheaperFaster' | 'noTimeGain' | 'timeWorthIt' | 'comfortPremium' | 'unknown';
}

/** Порівняння двох варіантів: fast — дорожчий/швидший (таксі), slow — базовий (автобус). */
export function comfortPrice(
  fast: { cost: Kop; minutes: number },
  slow: { cost: Kop; minutes: number },
  hourValue: Kop | null,
): ComfortPrice {
  const extra = fast.cost - slow.cost;
  const saved = Math.round(slow.minutes - fast.minutes);
  const timeValue = hourValue !== null && hourValue > 0 && saved > 0 ? roundDiv(hourValue * saved, 60) : null;
  const pureComfort = timeValue !== null ? extra - timeValue : null;
  let verdict: ComfortPrice['verdict'];
  if (extra <= 0 && saved >= 0) verdict = 'cheaperFaster';
  else if (saved <= 0) verdict = 'noTimeGain';
  else if (timeValue === null) verdict = 'unknown';
  else if (timeValue >= extra) verdict = 'timeWorthIt';
  else verdict = 'comfortPremium';
  return { extra, saved, timeValue, pureComfort, verdict };
}

export interface ModeStat {
  mode: TripMode;
  trips: number;
  cash: Kop;
  share: Kop;
  avgShare: Kop;
  avgMinutes: number | null;
  avgComfort: number | null;
}

export function tripsIn(ix: Index, from: string, to: string): Operation[] {
  return ix.all.filter((o) => o.type === 'expense' && o.trip && o.date >= from && o.date <= to);
}

export function modeStats(ix: Index, from: string, to: string): ModeStat[] {
  const acc = new Map<TripMode, { trips: number; cash: Kop; share: Kop; min: number; minN: number; com: number; comN: number }>();
  for (const o of tripsIn(ix, from, to)) {
    const t = o.trip!;
    const a = acc.get(t.mode) ?? { trips: 0, cash: 0, share: 0, min: 0, minN: 0, com: 0, comN: 0 };
    a.trips++;
    a.cash += o.amount;
    a.share += o.amount + (o.estimate ?? 0);
    if (t.minutes !== null) {
      a.min += t.minutes + (t.wait ?? 0);
      a.minN++;
    }
    if (t.comfort !== null) {
      a.com += t.comfort;
      a.comN++;
    }
    acc.set(t.mode, a);
  }
  return MODES.filter((m) => acc.has(m.id)).map((m) => {
    const a = acc.get(m.id)!;
    return {
      mode: m.id,
      trips: a.trips,
      cash: a.cash,
      share: a.share,
      avgShare: Math.round(a.share / a.trips),
      avgMinutes: a.minN ? Math.round(a.min / a.minN) : null,
      avgComfort: a.comN ? Math.round((a.com / a.comN) * 10) / 10 : null,
    };
  });
}

function median(xs: number[]): number | null {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : Math.round((s[mid - 1] + s[mid]) / 2);
}

export interface TripRef {
  cost: Kop;
  minutes: number | null;
  source: 'setting' | 'history';
}

/** Типова поїздка громадським транспортом: з налаштувань або медіана власних поїздок за 60 днів. */
export function publicRef(ix: Index, settings: Settings, today: string): TripRef | null {
  const trips = tripsIn(ix, addDays(today, -60), today).filter((o) => isPublic(o.trip!.mode));
  const costs = trips.map((o) => o.amount + (o.estimate ?? 0)).filter((v) => v > 0);
  const mins = trips.filter((o) => o.trip!.minutes !== null).map((o) => o.trip!.minutes! + (o.trip!.wait ?? 0));
  const minutes = mins.length >= 2 ? median(mins) : null;
  if (settings.publicFare !== null && settings.publicFare > 0) return { cost: settings.publicFare, minutes, source: 'setting' };
  if (costs.length >= 2) return { cost: median(costs)!, minutes, source: 'history' };
  return null;
}

export function taxiRef(ix: Index, today: string): TripRef | null {
  const trips = tripsIn(ix, addDays(today, -60), today).filter((o) => o.trip!.mode === 'taxi');
  const costs = trips.map((o) => o.amount + (o.estimate ?? 0)).filter((v) => v > 0);
  if (costs.length < 1) return null;
  const mins = trips.filter((o) => o.trip!.minutes !== null).map((o) => o.trip!.minutes! + (o.trip!.wait ?? 0));
  return { cost: median(costs)!, minutes: mins.length ? median(mins) : null, source: 'history' };
}

/** Коли доплата за таксі може бути виправданою. */
export const TAXI_JUSTIFIED: string[] = [
  'зекономлений час за твоєю оцінкою години вартує більше, ніж доплата;',
  'спізнення коштуватиме дорожче: важлива зустріч, іспит, зміна;',
  'пізно ввечері, тривога чи небезпечний маршрут — безпека важливіша за економію;',
  'важкі сумки, хвороба чи сильна втома;',
  'їдете втрьох-учотирьох і ділите вартість — частка може бути близькою до проїзду;',
  'погода або громадський транспорт не ходить.',
];
