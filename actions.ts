// actions.ts — чисті переходи стану без збереження й інтерфейсу.
// Кожна дія повертає нові дані, список змін для сховища та результат. Після змін операцій
// підсумки й поради завершених днів перераховуються автоматично.
import type { Advice, AppData, DayRecord, Operation, OpType, PlanLine } from './types.ts';
import { adviceFor } from './mentor.ts';
import { newlyDone, type Habit } from './habits.ts';
import { uid } from './defaults.ts';
import { isDateKey } from './time.ts';
import { MAX_KOP } from './money.ts';

export type KvKey = 'settings' | 'categories' | 'templates' | 'goals' | 'micro' | 'habits';

export interface Change {
  putOps?: Operation[];
  delOps?: string[];
  putDays?: DayRecord[];
  kv?: Partial<Record<KvKey, unknown>>;
}

export interface Result<T> {
  data: AppData;
  change: Change;
  value: T;
  habits: Habit[];
}

export const OP_TYPES: OpType[] = ['expense', 'income', 'refund', 'saving', 'withdrawal', 'transfer', 'consumption'];

export type OpInput = Omit<Operation, 'id' | 'time' | 'updatedAt' | 'deletedAt'> & { id?: string; time?: number };

const isKop = (v: unknown): v is number => typeof v === 'number' && Number.isSafeInteger(v) && v >= 0 && v <= MAX_KOP;

/** Перевірка операції: тип, дата, суми — цілі невідʼємні копійки. Повертає текст помилки або null. */
export function validateOp(op: Partial<Operation>): string | null {
  if (!op.type || !OP_TYPES.includes(op.type)) return 'Невідомий тип операції.';
  if (!isDateKey(op.date)) return 'Некоректна дата.';
  if (!isKop(op.amount)) return 'Сума має бути невідʼємною, у межах 10 млн грн.';
  if (op.estimate !== undefined && !isKop(op.estimate)) return 'Розрахункова частина має бути невідʼємною.';
  const zeroAllowed = op.type === 'expense' && Boolean(op.trip);
  if (op.amount === 0 && !zeroAllowed) return 'Вкажи суму більшу за нуль.';
  return null;
}

function mergeChanges(a: Change, b: Change): Change {
  const days = new Map<string, DayRecord>();
  for (const d of [...(a.putDays ?? []), ...(b.putDays ?? [])]) days.set(d.date, d);
  return {
    putOps: [...(a.putOps ?? []), ...(b.putOps ?? [])],
    delOps: [...(a.delOps ?? []), ...(b.delOps ?? [])],
    putDays: [...days.values()],
    kv: { ...(a.kv ?? {}), ...(b.kv ?? {}) },
  };
}

/** Перераховує поради для завершених днів і відмічає нові звички. */
export function settle(data: AppData, dates: Iterable<string>, today: string, now: number): { data: AppData; change: Change; habits: Habit[] } {
  let next = data;
  const putDays: DayRecord[] = [];
  const seen = new Set<string>();
  for (const date of dates) {
    if (seen.has(date)) continue;
    seen.add(date);
    const rec = next.days[date];
    if (!rec?.closed) continue;
    const updated: DayRecord = { ...rec, advice: adviceFor(next, date, today, now), updatedAt: now };
    next = { ...next, days: { ...next.days, [date]: updated } };
    putDays.push(updated);
  }
  const fresh = newlyDone(next, today);
  const change: Change = { putDays };
  if (fresh.length) {
    const habits = { ...next.habits };
    for (const h of fresh) habits[h.id] = now;
    next = { ...next, habits };
    change.kv = { habits };
  }
  return { data: next, change, habits: fresh };
}

function relatedDates(data: AppData, op: Operation): string[] {
  const dates = [op.date];
  if (op.refundOf) {
    const orig = data.ops.find((o) => o.id === op.refundOf);
    if (orig) dates.push(orig.date);
  }
  for (const r of data.ops) if (r.refundOf === op.id) dates.push(r.date, op.date);
  return dates;
}

export function addOp(data: AppData, input: OpInput, today: string, now: number = Date.now()): Result<Operation> {
  const op: Operation = { ...input, id: input.id ?? uid(), time: input.time ?? now, updatedAt: now };
  const err = validateOp(op);
  if (err) throw new Error(err);
  const next: AppData = { ...data, ops: [...data.ops, op] };
  const s = settle(next, relatedDates(next, op), today, now);
  return { data: s.data, change: mergeChanges({ putOps: [op] }, s.change), value: op, habits: s.habits };
}

export function updateOp(data: AppData, id: string, patch: Partial<Operation>, today: string, now: number = Date.now()): Result<Operation> {
  const old = data.ops.find((o) => o.id === id);
  if (!old) throw new Error('Операцію не знайдено.');
  const merged: Operation = { ...old, ...patch, id, updatedAt: now };
  for (const k of Object.keys(merged) as (keyof Operation)[]) if (merged[k] === undefined) delete merged[k];
  const err = validateOp(merged);
  if (err) throw new Error(err);
  const next: AppData = { ...data, ops: data.ops.map((o) => (o.id === id ? merged : o)) };
  const s = settle(next, [...relatedDates(data, old), ...relatedDates(next, merged)], today, now);
  return { data: s.data, change: mergeChanges({ putOps: [merged] }, s.change), value: merged, habits: s.habits };
}

/** Мʼяке видалення: операцію можна відновити з кошика. */
export function deleteOp(data: AppData, id: string, today: string, now: number = Date.now()): Result<Operation> {
  const old = data.ops.find((o) => o.id === id);
  if (!old) throw new Error('Операцію не знайдено.');
  const gone: Operation = { ...old, deletedAt: now, updatedAt: now };
  const next: AppData = { ...data, ops: data.ops.map((o) => (o.id === id ? gone : o)) };
  const s = settle(next, relatedDates(data, old), today, now);
  return { data: s.data, change: mergeChanges({ putOps: [gone] }, s.change), value: gone, habits: s.habits };
}

export function restoreOp(data: AppData, id: string, today: string, now: number = Date.now()): Result<Operation> {
  const old = data.ops.find((o) => o.id === id);
  if (!old) throw new Error('Операцію не знайдено.');
  const back: Operation = { ...old, updatedAt: now };
  delete back.deletedAt;
  const next: AppData = { ...data, ops: data.ops.map((o) => (o.id === id ? back : o)) };
  const s = settle(next, relatedDates(next, back), today, now);
  return { data: s.data, change: mergeChanges({ putOps: [back] }, s.change), value: back, habits: s.habits };
}

/** Остаточне видалення (з кошика або скасування щойно доданого запису). */
export function purgeOp(data: AppData, id: string, today: string, now: number = Date.now()): Result<null> {
  const old = data.ops.find((o) => o.id === id);
  if (!old) return { data, change: {}, value: null, habits: [] };
  const next: AppData = { ...data, ops: data.ops.filter((o) => o.id !== id) };
  const s = settle(next, relatedDates(data, old), today, now);
  return { data: s.data, change: mergeChanges({ delOps: [id] }, s.change), value: null, habits: s.habits };
}

function dayOf(data: AppData, date: string, now: number): DayRecord {
  return data.days[date] ?? { date, plan: null, closed: false, updatedAt: now };
}

export function setPlan(
  data: AppData,
  date: string,
  lines: PlanLine[] | null,
  source: DayRecord['planSource'],
  today: string,
  now: number = Date.now(),
  templateId?: string,
): Result<DayRecord> {
  if (!isDateKey(date)) throw new Error('Некоректна дата.');
  for (const l of lines ?? []) if (!isKop(l.amount)) throw new Error('Сума в плані має бути невідʼємною.');
  const rec: DayRecord = { ...dayOf(data, date, now), plan: lines && lines.length ? lines : null, planSource: lines ? source : undefined, templateId, updatedAt: now };
  if (!rec.templateId) delete rec.templateId;
  if (!rec.planSource) delete rec.planSource;
  const next: AppData = { ...data, days: { ...data.days, [date]: rec } };
  const s = settle(next, [date], today, now);
  return { data: s.data, change: mergeChanges({ putDays: [rec] }, s.change), value: s.data.days[date], habits: s.habits };
}

export function closeDay(data: AppData, date: string, today: string, now: number = Date.now()): Result<Advice> {
  const rec: DayRecord = { ...dayOf(data, date, now), closed: true, closedAt: now, updatedAt: now };
  let next: AppData = { ...data, days: { ...data.days, [date]: rec } };
  const advice = adviceFor(next, date, today, now);
  const closed: DayRecord = { ...rec, advice };
  next = { ...next, days: { ...next.days, [date]: closed } };
  const s = settle(next, [], today, now);
  return { data: s.data, change: mergeChanges({ putDays: [closed] }, s.change), value: advice, habits: s.habits };
}

export function reopenDay(data: AppData, date: string, now: number = Date.now()): Result<DayRecord> {
  const rec: DayRecord = { ...dayOf(data, date, now), closed: false, advice: null, updatedAt: now };
  delete rec.closedAt;
  return { data: { ...data, days: { ...data.days, [date]: rec } }, change: { putDays: [rec] }, value: rec, habits: [] };
}
