// store.ts — стан застосунку: дані в памʼяті + автоматичне збереження на пристрої.
// Інтерфейс оновлюється одразу, запис у сховище відбувається слідом.
import type { Advice, AppData, Category, DayRecord, Goal, MicroItem, Operation, PlanLine, Settings, Template } from './types.ts';
import * as A from './actions.ts';
import type { Habit } from './habits.ts';
import { openBackend, type Backend, type Snapshot } from './db.ts';
import { CATEGORIES, MICRO, TEMPLATES, clone, emptyData } from './defaults.ts';
import { buildDemo } from './demo.ts';
import { makeBackup, mergeData, normalizeSettings, type BackupFile, type MergeStats } from './backup.ts';
import { isWorkday } from './calendar.ts';
import { todayKey } from './time.ts';

export interface StoreState {
  ready: boolean;
  demo: boolean;
  backend: Backend['kind'];
  data: AppData;
  prevBackup: { at: number; ops: number } | null;
  error: string | null;
}

let state: StoreState = { ready: false, demo: false, backend: 'memory', data: emptyData(), prevBackup: null, error: null };
let backend: Backend | null = null;
const listeners = new Set<() => void>();
let habitListener: (h: Habit[]) => void = () => {};

export function getState(): StoreState {
  return state;
}

export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function onHabits(fn: (h: Habit[]) => void): void {
  habitListener = fn;
}

function emit(): void {
  for (const fn of listeners) fn();
}

const MODE_KEY = 'den365:mode';

function readMode(): 'demo' | 'main' {
  try {
    return globalThis.localStorage?.getItem(MODE_KEY) === 'demo' ? 'demo' : 'main';
  } catch {
    return 'main';
  }
}

function writeMode(m: 'demo' | 'main'): void {
  try {
    globalThis.localStorage?.setItem(MODE_KEY, m);
  } catch {
    // режим просто не запамʼятається між запусками
  }
}

const dbName = (demo: boolean) => (demo ? 'den365-demo' : 'den365');

function withBuiltins<T extends { id: string }>(list: T[] | undefined, builtins: T[]): T[] {
  const base = Array.isArray(list) && list.length ? list : clone(builtins);
  return [...base, ...builtins.filter((b) => !base.some((x) => x.id === b.id)).map(clone)];
}

function fromSnapshot(s: Snapshot): AppData {
  const kv = s.kv;
  return {
    ops: s.ops,
    days: Object.fromEntries(s.days.map((d) => [d.date, d])),
    settings: normalizeSettings(kv.settings),
    categories: withBuiltins(kv.categories as Category[] | undefined, CATEGORIES),
    templates: Array.isArray(kv.templates) ? (kv.templates as Template[]) : clone(TEMPLATES),
    goals: Array.isArray(kv.goals) ? (kv.goals as Goal[]) : [],
    micro: Array.isArray(kv.micro) ? (kv.micro as MicroItem[]) : clone(MICRO),
    habits: (kv.habits as Record<string, number> | undefined) ?? {},
  };
}

function toSnapshot(d: AppData): Snapshot {
  return {
    ops: d.ops,
    days: Object.values(d.days),
    kv: { settings: d.settings, categories: d.categories, templates: d.templates, goals: d.goals, micro: d.micro, habits: d.habits },
  };
}

async function load(demo: boolean, freshDemo: boolean): Promise<void> {
  backend = await openBackend(dbName(demo));
  let snap = await backend.load();
  if (demo && (freshDemo || !snap.ops.length)) {
    snap = toSnapshot(buildDemo(todayKey()));
    await backend.replace(snap);
  }
  const prev = (await backend.getBackup()) as { at: number; data: AppData } | undefined;
  state = {
    ready: true,
    demo,
    backend: backend.kind,
    data: fromSnapshot(snap),
    prevBackup: prev?.data ? { at: prev.at, ops: prev.data.ops.length } : null,
    error: null,
  };
  emit();
}

export async function initStore(): Promise<void> {
  await load(readMode() === 'demo', false);
  ensureToday();
}

function fail(e: unknown): void {
  console.error(e);
  state = { ...state, error: 'Не вдалося зберегти зміни на пристрої. Зроби резервну копію в налаштуваннях.' };
  emit();
}

function commit(r: { data: AppData; change: A.Change; habits?: Habit[] }): void {
  state = { ...state, data: r.data, error: null };
  emit();
  backend?.apply(r.change).catch(fail);
  if (r.habits?.length) habitListener(r.habits);
}

const today = () => todayKey();

export function addOperation(input: A.OpInput): Operation {
  const r = A.addOp(state.data, input, today());
  commit(r);
  return r.value;
}

export function updateOperation(id: string, patch: Partial<Operation>): Operation {
  const r = A.updateOp(state.data, id, patch, today());
  commit(r);
  return r.value;
}

export function deleteOperation(id: string): void {
  commit(A.deleteOp(state.data, id, today()));
}

export function restoreOperation(id: string): void {
  commit(A.restoreOp(state.data, id, today()));
}

export function purgeOperation(id: string): void {
  commit(A.purgeOp(state.data, id, today()));
}

export function setDayPlan(date: string, lines: PlanLine[] | null, source: DayRecord['planSource'], templateId?: string): void {
  commit(A.setPlan(state.data, date, lines, source, today(), Date.now(), templateId));
}

export function closeDayAction(date: string): Advice {
  const r = A.closeDay(state.data, date, today());
  commit(r);
  return r.value;
}

export function reopenDayAction(date: string): void {
  commit(A.reopenDay(state.data, date));
}

export function saveSettings(fn: (s: Settings) => Settings): void {
  const settings = fn(clone(state.data.settings));
  commit({ data: { ...state.data, settings }, change: { kv: { settings } } });
}

export function saveList(key: 'categories' | 'templates' | 'goals' | 'micro', list: unknown[]): void {
  const data = { ...state.data, [key]: list } as AppData;
  const r = A.settle(data, [], today(), Date.now());
  commit({ data: r.data, change: { kv: { [key]: list, ...(r.change.kv ?? {}) } }, habits: r.habits });
}

/** Автоплан: якщо для сьогодні ще немає запису і в налаштуваннях обрано шаблон. */
export function ensureToday(): void {
  const t = today();
  const d = state.data;
  if (d.days[t]) return;
  const tplId = isWorkday(t, d.settings.calendar) ? d.settings.autoPlan.work : d.settings.autoPlan.off;
  const tpl = tplId ? d.templates.find((x) => x.id === tplId) : undefined;
  if (tpl && tpl.lines.length) setDayPlan(t, clone(tpl.lines), 'auto', tpl.id);
}

export function exportBackup(): BackupFile {
  return makeBackup(state.data, state.demo);
}

async function savePrevious(): Promise<void> {
  if (!backend) return;
  const at = Date.now();
  await backend.setBackup({ at, data: state.data });
  state = { ...state, prevBackup: { at, ops: state.data.ops.length } };
}

async function replaceAll(data: AppData): Promise<void> {
  if (!backend) return;
  await backend.replace(toSnapshot(data));
  state = { ...state, data, error: null };
  emit();
}

/** Імпорт резервної копії: перед будь-якою зміною зберігається попередня копія даних. */
export async function importData(incoming: AppData, mode: 'merge' | 'replace'): Promise<MergeStats | null> {
  await savePrevious();
  if (mode === 'replace') {
    await replaceAll({ ...incoming, settings: { ...incoming.settings, onboarded: true } });
    return null;
  }
  const r = mergeData(state.data, incoming);
  await replaceAll(r.data);
  return r.stats;
}

/** Повернути дані, що були до останнього імпорту чи скидання (поточні при цьому теж зберігаються). */
export async function restorePrevious(): Promise<boolean> {
  if (!backend) return false;
  const prev = (await backend.getBackup()) as { at: number; data: AppData } | undefined;
  if (!prev?.data) return false;
  await savePrevious();
  await replaceAll(prev.data);
  return true;
}

export async function resetAll(): Promise<void> {
  await savePrevious();
  const fresh = emptyData();
  fresh.settings.theme = state.data.settings.theme;
  await replaceAll(fresh);
}

export async function setDemoMode(on: boolean): Promise<void> {
  writeMode(on ? 'demo' : 'main');
  await load(on, on);
  ensureToday();
}
