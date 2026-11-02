// calendar.ts — робочі й вихідні дні, винятки та періоди перебування в Дніпрі.
import type { CalendarSettings, Stay } from './types.ts';
import { addDays, weekday } from './time.ts';

export function isWorkday(key: string, cal: CalendarSettings): boolean {
  const o = cal.overrides[key];
  if (o) return o === 'work';
  return Boolean(cal.workdays[weekday(key)]);
}

export function inStay(key: string, cal: CalendarSettings): boolean {
  return cal.stays.some((s) => key >= s.from && key <= s.to);
}

export function stayOn(key: string, cal: CalendarSettings): Stay | null {
  return cal.stays.find((s) => key >= s.from && key <= s.to) ?? null;
}

export interface DayCounts {
  work: number;
  off: number;
}

/**
 * Рахує робочі й вихідні дні у проміжку з from довжиною n днів.
 * stayOnly — лише дні перебування в Дніпрі (ігнорується, якщо періодів не задано).
 */
export function countDays(from: string, n: number, cal: CalendarSettings, stayOnly = false): DayCounts {
  const useStay = stayOnly && cal.stays.length > 0;
  let work = 0;
  let off = 0;
  for (let i = 0; i < n; i++) {
    const k = addDays(from, i);
    if (useStay && !inStay(k, cal)) continue;
    if (isWorkday(k, cal)) work++;
    else off++;
  }
  return { work, off };
}

/** Кількість робочих днів у найближчі n днів, починаючи із завтра. */
export function workdaysAhead(today: string, n: number, cal: CalendarSettings, stayOnly = false): number {
  return countDays(addDays(today, 1), n, cal, stayOnly).work;
}

export function workdaysPerWeek(cal: CalendarSettings): number {
  return cal.workdays.filter(Boolean).length;
}

export function makeStay(id: string, from: string, days: number, label: string): Stay {
  return { id, from, to: addDays(from, Math.max(1, days) - 1), label };
}
