// meals.ts — «Домашній обід чи їдальня?»: види харчування, порівняння, без подвійного обліку продуктів.
import type { Kop, MealKind, Operation, Settings } from './types.ts';
import type { Index } from './ledger.ts';
import { addDays } from './time.ts';

export const MEALS: { id: MealKind; label: string; icon: string; home: boolean }[] = [
  { id: 'breakfastHome', label: 'Сніданок удома', icon: 'sunrise', home: true },
  { id: 'lunchBox', label: 'Домашній обід у контейнері', icon: 'lunchbox', home: true },
  { id: 'canteen', label: 'Їдальня', icon: 'utensils', home: false },
  { id: 'cafe', label: 'Кафе', icon: 'coffee', home: false },
  { id: 'fastfood', label: 'Фастфуд', icon: 'burger', home: false },
  { id: 'readyFood', label: 'Готова їжа із супермаркету', icon: 'basket', home: false },
  { id: 'delivery', label: 'Доставка', icon: 'truck', home: false },
  { id: 'dinnerHome', label: 'Вечеря вдома', icon: 'moon', home: true },
  { id: 'otherMeal', label: 'Інший варіант', icon: 'utensils', home: false },
];

export function mealInfo(kind: MealKind): (typeof MEALS)[number] {
  return MEALS.find((m) => m.id === kind) ?? MEALS[MEALS.length - 1];
}

export function isHomeMeal(kind: MealKind): boolean {
  return mealInfo(kind).home;
}

/**
 * Як записати прийом їжі:
 *  • домашній із уже куплених продуктів → consumption (лише собівартість, без руху грошей);
 *  • домашній із новою покупкою → expense у категорії «Продукти»;
 *  • поза домом → expense у категорії «Обід».
 */
export function mealOpShape(kind: MealKind, prepaid: boolean): { type: 'expense' | 'consumption'; category: string } {
  if (isHomeMeal(kind)) return prepaid ? { type: 'consumption', category: 'lunch' } : { type: 'expense', category: 'groceries' };
  return { type: 'expense', category: 'lunch' };
}

function median(xs: number[]): number | null {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : Math.round((s[mid - 1] + s[mid]) / 2);
}

function mealOps(ix: Index, today: string, days: number): Operation[] {
  const from = addDays(today, -days);
  return ix.all.filter((o) => o.meal && o.date >= from && o.date <= today && (o.type === 'expense' || o.type === 'consumption'));
}

export interface Ref {
  amount: Kop;
  source: 'setting' | 'history';
}

/** Типова ціна обіду в їдальні: з налаштувань або медіана власних обідів у їдальні за 90 днів. */
export function canteenRef(ix: Index, settings: Settings, today: string): Ref | null {
  if (settings.canteenPrice !== null && settings.canteenPrice > 0) return { amount: settings.canteenPrice, source: 'setting' };
  const vals = mealOps(ix, today, 90).filter((o) => o.meal!.kind === 'canteen').map((o) => o.amount);
  if (vals.length >= 2) return { amount: median(vals)!, source: 'history' };
  return null;
}

/** Типова собівартість домашнього обіду з власної історії (≥ 2 записи). */
export function homeMealRef(ix: Index, today: string): Kop | null {
  const vals = mealOps(ix, today, 90)
    .filter((o) => o.meal!.kind === 'lunchBox')
    .map((o) => o.amount);
  return vals.length >= 2 ? median(vals) : null;
}

/** Потенційна економія за 5, 10 і 22 робочі дні. */
export function mealProjection(diff: Kop): { d5: Kop; d10: Kop; d22: Kop } {
  const d = Math.max(0, diff);
  return { d5: d * 5, d10: d * 10, d22: d * 22 };
}
