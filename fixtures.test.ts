// fixtures.test.ts — спільні допоміжні функції для тестів.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { AppData, DayRecord, Operation } from './types.ts';
import { emptyData } from './defaults.ts';
import { uah } from './money.ts';
import { msAtKyiv } from './time.ts';
import { validateOp } from './actions.ts';

/** Середа, 4 листопада 2026 року. */
export const TODAY = '2026-11-04';

let seq = 0;

export function op(p: Partial<Operation> & Pick<Operation, 'type' | 'date' | 'amount'>): Operation {
  seq++;
  return { id: `t${seq}`, time: msAtKyiv(p.date, 9, seq % 60), updatedAt: 1, ...p };
}

export function exp(date: string, hryvnias: number, category: string, extra: Partial<Operation> = {}): Operation {
  return op({ type: 'expense', date, amount: uah(hryvnias), category, ...extra });
}

export function plan(date: string, lines: [string, string, number][], closed = false): DayRecord {
  return {
    date,
    plan: lines.map(([label, category, hryvnias], i) => ({ id: `p${i}`, label, category, amount: uah(hryvnias) })),
    planSource: 'manual',
    closed,
    updatedAt: 1,
  };
}

export const STUDY: [string, string, number][] = [
  ['Поїздка туди', 'transport', 30],
  ['Кава', 'coffee', 70],
  ['Обід', 'lunch', 180],
  ['Поїздка назад', 'transport', 30],
  ['Продукти на вечерю', 'groceries', 200],
  ['Смаколики', 'treats', 50],
  ['Непередбачені', 'other', 90],
];

export function data(patch: Partial<AppData> = {}): AppData {
  return { ...emptyData(), ...patch };
}

test('фікстури створюють коректні операції', () => {
  assert.equal(validateOp(exp(TODAY, 60, 'coffee')), null);
  assert.equal(plan(TODAY, STUDY).plan!.reduce((s, l) => s + l.amount, 0), uah(650));
});
