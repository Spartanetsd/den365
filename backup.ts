// backup.ts — резервні копії JSON (експорт, перевірка, обʼєднання без дублів) і експорт CSV.
import type {
  Advice, AppData, Category, DayRecord, Goal, MicroItem, Operation, PlanLine, Settings, Template,
} from './types.ts';
import { CATEGORIES, MICRO, TEMPLATES, clone, defaultSettings } from './defaults.ts';
import { OP_TYPES } from './actions.ts';
import { MAX_KOP } from './money.ts';
import { isDateKey, stamp, timeHM } from './time.ts';
import { buildIndex, calcDay, catMap, dayStatus } from './ledger.ts';
import { modeInfo } from './transport.ts';
import { mealInfo } from './meals.ts';
import { NECESSITY } from './defaults.ts';

export const BACKUP_FORMAT = 'den-365-backup';
export const BACKUP_VERSION = 1;

export interface BackupFile {
  format: string;
  version: number;
  app: string;
  exportedAt: number;
  exportedAtKyiv: string;
  demo: boolean;
  data: AppData;
}

export function makeBackup(data: AppData, demo: boolean, now: number = Date.now()): BackupFile {
  return {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    app: 'ДЕНЬ × 365',
    exportedAt: now,
    exportedAtKyiv: stamp(now),
    demo,
    data: clone(data),
  };
}

export type Validation =
  | { ok: true; data: AppData; demo: boolean; warnings: string[] }
  | { ok: false; errors: string[] };

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);
const isKop = (v: unknown): v is number => typeof v === 'number' && Number.isSafeInteger(v) && v >= 0 && v <= MAX_KOP;
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const str = (v: unknown, max = 200): string | undefined => (typeof v === 'string' ? v.slice(0, max) : undefined);
const NEC = ['required', 'flexible', 'optional', 'unexpected'];
const MODES = ['bus', 'tram', 'trolley', 'metro', 'taxi', 'car', 'walk', 'combo'];
const MEALS = ['breakfastHome', 'lunchBox', 'canteen', 'cafe', 'fastfood', 'readyFood', 'delivery', 'dinnerHome', 'otherMeal'];

function cleanOp(raw: unknown): Operation | null {
  if (!isObj(raw)) return null;
  const id = str(raw.id, 80);
  const type = raw.type;
  if (!id || typeof type !== 'string' || !OP_TYPES.includes(type as Operation['type'])) return null;
  if (!isDateKey(raw.date) || !isKop(raw.amount) || !isNum(raw.time)) return null;
  const op: Operation = {
    id,
    type: type as Operation['type'],
    date: raw.date,
    time: raw.time,
    amount: raw.amount,
    updatedAt: isNum(raw.updatedAt) ? raw.updatedAt : raw.time,
  };
  if (isKop(raw.estimate)) op.estimate = raw.estimate;
  for (const k of ['category', 'title', 'note', 'micro', 'refundOf', 'obligationId', 'goalId', 'planLineId'] as const) {
    const v = str(raw[k], k === 'note' ? 500 : 120);
    if (v !== undefined) op[k] = v;
  }
  if (typeof raw.necessity === 'string' && NEC.includes(raw.necessity)) op.necessity = raw.necessity as Operation['necessity'];
  if (isNum(raw.deletedAt)) op.deletedAt = raw.deletedAt;
  if (isObj(raw.trip) && typeof raw.trip.mode === 'string' && MODES.includes(raw.trip.mode)) {
    const t = raw.trip;
    op.trip = {
      mode: t.mode as NonNullable<Operation['trip']>['mode'],
      dir: t.dir === 'there' || t.dir === 'back' ? t.dir : 'other',
      route: str(t.route, 120) ?? '',
      minutes: isNum(t.minutes) ? t.minutes : null,
      wait: isNum(t.wait) ? t.wait : null,
      comfort: isNum(t.comfort) ? t.comfort : null,
      passengers: isNum(t.passengers) && t.passengers >= 1 ? Math.floor(t.passengers) : 1,
      split: t.split === true,
      full: isKop(t.full) ? t.full : op.amount + (op.estimate ?? 0),
    };
    if (isObj(t.car)) {
      const c = t.car;
      op.trip.car = {
        km: isNum(c.km) ? c.km : 0,
        per100: isNum(c.per100) ? c.per100 : 0,
        fuelPrice: isKop(c.fuelPrice) ? c.fuelPrice : 0,
        parking: isKop(c.parking) ? c.parking : 0,
        wearPerKm: isKop(c.wearPerKm) ? c.wearPerKm : 0,
        other: isKop(c.other) ? c.other : 0,
        fuelPrepaid: c.fuelPrepaid === true,
      };
    }
  }
  if (isObj(raw.meal) && typeof raw.meal.kind === 'string' && MEALS.includes(raw.meal.kind)) {
    op.meal = { kind: raw.meal.kind as NonNullable<Operation['meal']>['kind'], prepaid: raw.meal.prepaid === true };
  }
  return op;
}

function cleanLines(raw: unknown): PlanLine[] | null {
  if (!Array.isArray(raw)) return null;
  const out: PlanLine[] = [];
  for (const l of raw) {
    if (!isObj(l) || !isKop(l.amount)) continue;
    out.push({ id: str(l.id, 80) ?? `l${out.length}`, label: str(l.label, 120) ?? '', category: str(l.category, 80) ?? 'other', amount: l.amount });
  }
  return out;
}

function cleanAdvice(raw: unknown): Advice | null {
  if (!isObj(raw) || typeof raw.why !== 'string' || typeof raw.step !== 'string') return null;
  return {
    ruleId: str(raw.ruleId, 60) ?? 'imported',
    author: str(raw.author, 80) ?? '',
    authorGen: str(raw.authorGen, 80) ?? str(raw.author, 80) ?? '',
    principle: str(raw.principle, 160) ?? '',
    why: raw.why.slice(0, 600),
    step: raw.step.slice(0, 600),
    effect: str(raw.effect, 400) ?? null,
    effectKop: isNum(raw.effectKop) ? raw.effectKop : null,
    tone: raw.tone === 'positive' || raw.tone === 'care' ? raw.tone : 'calm',
    createdAt: isNum(raw.createdAt) ? raw.createdAt : 0,
  };
}

function cleanDay(raw: unknown): DayRecord | null {
  if (!isObj(raw) || !isDateKey(raw.date)) return null;
  const rec: DayRecord = {
    date: raw.date,
    plan: cleanLines(raw.plan),
    closed: raw.closed === true,
    updatedAt: isNum(raw.updatedAt) ? raw.updatedAt : 0,
  };
  if (rec.plan && !rec.plan.length) rec.plan = null;
  if (raw.planSource === 'manual' || raw.planSource === 'template' || raw.planSource === 'auto') rec.planSource = raw.planSource;
  const tid = str(raw.templateId, 80);
  if (tid) rec.templateId = tid;
  if (isNum(raw.closedAt)) rec.closedAt = raw.closedAt;
  const adv = cleanAdvice(raw.advice);
  if (adv) rec.advice = adv;
  return rec;
}

export function normalizeSettings(raw: unknown): Settings {
  const base = defaultSettings();
  if (!isObj(raw)) return base;
  const out: Settings = { ...base };
  if (raw.theme === 'light' || raw.theme === 'dark' || raw.theme === 'system') out.theme = raw.theme;
  out.onboarded = raw.onboarded === true;
  for (const k of ['hourValue', 'canteenPrice', 'publicFare', 'joyBudget'] as const) out[k] = isKop(raw[k]) ? (raw[k] as number) : null;
  if (isObj(raw.autoPlan)) out.autoPlan = { work: str(raw.autoPlan.work, 80) ?? null, off: str(raw.autoPlan.off, 80) ?? null };
  out.forecastStayOnly = raw.forecastStayOnly === true;
  if (isObj(raw.calendar)) {
    const c = raw.calendar;
    const wd = Array.isArray(c.workdays) && c.workdays.length === 7 ? c.workdays.map((v) => v === true) : base.calendar.workdays;
    const overrides: Record<string, 'work' | 'off'> = {};
    if (isObj(c.overrides)) for (const [k, v] of Object.entries(c.overrides)) if (isDateKey(k) && (v === 'work' || v === 'off')) overrides[k] = v;
    const stays = Array.isArray(c.stays)
      ? c.stays.filter((s): s is Obj => isObj(s) && isDateKey(s.from) && isDateKey(s.to)).map((s, i) => ({ id: str(s.id, 80) ?? `stay${i}`, from: s.from as string, to: s.to as string, label: str(s.label, 80) ?? '' }))
      : [];
    out.calendar = { workdays: wd, overrides, stays };
  }
  if (isObj(raw.budget)) {
    const b = raw.budget;
    const day = (v: unknown) => (isNum(v) && v >= 1 && v <= 31 ? Math.floor(v) : 1);
    out.budget = {
      incomes: Array.isArray(b.incomes) ? b.incomes.filter(isObj).filter((i) => isKop(i.amount)).map((i, n) => ({ id: str(i.id, 80) ?? `inc${n}`, name: str(i.name, 80) ?? 'Дохід', amount: i.amount as number, day: day(i.day) })) : [],
      obligations: Array.isArray(b.obligations)
        ? b.obligations.filter(isObj).filter((o) => isKop(o.amount)).map((o, n) => ({
          id: str(o.id, 80) ?? `obl${n}`,
          name: str(o.name, 80) ?? 'Платіж',
          kind: o.kind === 'rent' || o.kind === 'utilities' || o.kind === 'credit' ? o.kind : 'other',
          amount: o.amount as number,
          day: day(o.day),
        }))
        : [],
      balance: isObj(b.balance) && typeof b.balance.amount === 'number' && Number.isSafeInteger(b.balance.amount) && isDateKey(b.balance.date) ? { amount: b.balance.amount, date: b.balance.date } : null,
      savingsStart: isKop(b.savingsStart) ? b.savingsStart : 0,
      buffer: isKop(b.buffer) ? b.buffer : 0,
      monthlyGoal: isKop(b.monthlyGoal) ? b.monthlyGoal : null,
      dailyEstimate: isKop(b.dailyEstimate) ? b.dailyEstimate : null,
      flexTransport: isKop(b.flexTransport) ? b.flexTransport : null,
      flexGroceries: isKop(b.flexGroceries) ? b.flexGroceries : null,
    };
  }
  return out;
}

function cleanList<T>(raw: unknown, fallback: T[], pick: (o: Obj) => T | null): T[] {
  if (!Array.isArray(raw)) return clone(fallback);
  const out: T[] = [];
  for (const r of raw) {
    if (!isObj(r)) continue;
    const v = pick(r);
    if (v) out.push(v);
  }
  return out;
}

/** Перевіряє структуру файлу резервної копії й повертає очищені дані або перелік помилок. */
export function validateBackup(raw: unknown): Validation {
  if (!isObj(raw)) return { ok: false, errors: ['Файл не є резервною копією ДЕНЬ × 365.'] };
  if (raw.format !== BACKUP_FORMAT) return { ok: false, errors: ['Невідомий формат файлу — очікується резервна копія ДЕНЬ × 365.'] };
  if (!isNum(raw.version) || raw.version > BACKUP_VERSION) return { ok: false, errors: ['Копію створено новішою версією застосунку. Онови застосунок і спробуй ще раз.'] };
  const d = raw.data;
  if (!isObj(d) || !Array.isArray(d.ops)) return { ok: false, errors: ['У файлі немає списку операцій.'] };
  const warnings: string[] = [];
  const ops: Operation[] = [];
  const seen = new Set<string>();
  let bad = 0;
  let dup = 0;
  for (const r of d.ops) {
    const op = cleanOp(r);
    if (!op) { bad++; continue; }
    if (seen.has(op.id)) { dup++; continue; }
    seen.add(op.id);
    ops.push(op);
  }
  if (bad) warnings.push(`Пропущено пошкоджених записів: ${bad}.`);
  if (dup) warnings.push(`Пропущено повторів усередині файлу: ${dup}.`);
  const days: Record<string, DayRecord> = {};
  const rawDays = Array.isArray(d.days) ? d.days : isObj(d.days) ? Object.values(d.days) : [];
  for (const r of rawDays) {
    const rec = cleanDay(r);
    if (rec) days[rec.date] = rec;
  }
  const categories = cleanList<Category>(d.categories, CATEGORIES, (c) => (typeof c.id === 'string' && typeof c.name === 'string'
    ? {
      id: c.id.slice(0, 80), name: c.name.slice(0, 60), icon: str(c.icon, 40) ?? 'box', color: str(c.color, 20) ?? '#76808C',
      necessity: typeof c.necessity === 'string' && NEC.includes(c.necessity) ? (c.necessity as Category['necessity']) : 'flexible',
      micro: c.micro === true, hidden: c.hidden === true, builtin: c.builtin === true,
    }
    : null));
  for (const b of CATEGORIES) if (!categories.some((c) => c.id === b.id)) categories.push(clone(b));
  const templates = cleanList<Template>(d.templates, TEMPLATES, (t) => (typeof t.id === 'string' && typeof t.name === 'string'
    ? { id: t.id.slice(0, 80), name: t.name.slice(0, 80), lines: cleanLines(t.lines) ?? [], builtin: t.builtin === true }
    : null));
  const goals = cleanList<Goal>(d.goals, [], (g) => (typeof g.id === 'string' && typeof g.name === 'string' && isKop(g.target)
    ? {
      id: g.id.slice(0, 80), name: g.name.slice(0, 80),
      kind: g.kind === 'reserve' || g.kind === 'cushion' || g.kind === 'car' || g.kind === 'vacation' ? g.kind : 'custom',
      target: g.target, start: isKop(g.start) ? g.start : 0, createdAt: isNum(g.createdAt) ? g.createdAt : 0,
    }
    : null));
  const micro = cleanList<MicroItem>(d.micro, MICRO, (m) => (typeof m.id === 'string' && typeof m.name === 'string'
    ? { id: m.id.slice(0, 80), name: m.name.slice(0, 60), category: str(m.category, 80) ?? 'treats', icon: str(m.icon, 40) ?? 'box', price: isKop(m.price) ? m.price : null, quick: m.quick === true }
    : null));
  const habits: Record<string, number> = {};
  if (isObj(d.habits)) for (const [k, v] of Object.entries(d.habits)) if (isNum(v)) habits[k] = v;
  return {
    ok: true,
    demo: raw.demo === true,
    warnings,
    data: { ops, days, settings: normalizeSettings(d.settings), categories, templates, goals, micro, habits },
  };
}

export interface MergeStats {
  added: number;
  updated: number;
  duplicates: number;
  daysAdded: number;
  daysUpdated: number;
}

/** Відбиток операції для пошуку дублів, коли ідентифікатори різні. */
export function fingerprint(o: Operation): string {
  return [o.date, o.type, o.amount, o.category ?? '', o.time, o.title ?? ''].join('|');
}

/**
 * Обʼєднання: нові записи додаються, повтори (за id або відбитком) пропускаються,
 * для того самого id перемагає новіша версія. Налаштування лишаються поточні.
 */
export function mergeData(cur: AppData, inc: AppData): { data: AppData; stats: MergeStats } {
  const stats: MergeStats = { added: 0, updated: 0, duplicates: 0, daysAdded: 0, daysUpdated: 0 };
  const byId = new Map(cur.ops.map((o) => [o.id, o] as const));
  const prints = new Set(cur.ops.map(fingerprint));
  for (const o of inc.ops) {
    const ex = byId.get(o.id);
    if (ex) {
      if (o.updatedAt > ex.updatedAt) { byId.set(o.id, o); stats.updated++; } else stats.duplicates++;
      continue;
    }
    const fp = fingerprint(o);
    if (prints.has(fp)) { stats.duplicates++; continue; }
    prints.add(fp);
    byId.set(o.id, o);
    stats.added++;
  }
  const days = { ...cur.days };
  for (const [date, r] of Object.entries(inc.days)) {
    const ex = days[date];
    if (!ex) { days[date] = r; stats.daysAdded++; } else if (r.updatedAt > ex.updatedAt) { days[date] = r; stats.daysUpdated++; }
  }
  const addMissing = <T extends { id: string }>(a: T[], b: T[]): T[] => [...a, ...b.filter((x) => !a.some((y) => y.id === x.id))];
  const habits = { ...inc.habits, ...cur.habits };
  return {
    data: {
      ops: [...byId.values()],
      days,
      settings: cur.settings,
      categories: addMissing(cur.categories, inc.categories),
      templates: addMissing(cur.templates, inc.templates),
      goals: addMissing(cur.goals, inc.goals),
      micro: addMissing(cur.micro, inc.micro),
      habits,
    },
    stats,
  };
}

/** Попередній перегляд імпорту: скільки нового і скільки повторів. */
export function previewMerge(cur: AppData, inc: AppData): MergeStats {
  return mergeData(cur, inc).stats;
}

// ── CSV ───────────────────────────────────────────────────────────────────────

const TYPE_LABEL: Record<Operation['type'], string> = {
  expense: 'Витрата',
  income: 'Дохід',
  refund: 'Повернення',
  saving: 'У накопичення',
  withdrawal: 'З накопичень',
  transfer: 'Переказ між рахунками',
  consumption: 'Собівартість (не рух грошей)',
};

function cell(v: string | number | null | undefined): string {
  if (v === null || v === undefined) return '';
  let s = String(v);
  if (typeof v === 'string' && /^[=+\-@]/.test(s)) s = "'" + s;
  return /[;"\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function money(k: number | undefined): string {
  if (k === undefined) return '';
  const neg = k < 0;
  const a = Math.abs(k);
  return `${neg ? '-' : ''}${Math.floor(a / 100)},${String(a % 100).padStart(2, '0')}`;
}

export function opsCSV(data: AppData): string {
  const cats = catMap(data.categories);
  const head = ['Дата', 'Час', 'Тип', 'Категорія', 'Назва', 'Сума, грн', 'Розрахункова частина, грн', 'Необхідність', 'Транспорт', 'Напрямок', 'Маршрут', 'Хвилин у дорозі', 'Пасажири', 'Харчування', 'Примітка'];
  const rows = data.ops
    .filter((o) => !o.deletedAt)
    .sort((a, b) => (a.date === b.date ? a.time - b.time : a.date < b.date ? -1 : 1))
    .map((o) => [
      o.date,
      timeHM(o.time),
      TYPE_LABEL[o.type],
      o.category ? cats.get(o.category)?.name ?? o.category : '',
      o.title ?? '',
      money(o.amount),
      o.estimate ? money(o.estimate) : '',
      o.type === 'expense' ? NECESSITY[o.necessity ?? cats.get(o.category ?? '')?.necessity ?? 'flexible'].label : '',
      o.trip ? modeInfo(o.trip.mode).label : '',
      o.trip ? (o.trip.dir === 'there' ? 'Туди' : o.trip.dir === 'back' ? 'Назад' : 'Інша') : '',
      o.trip?.route ?? '',
      o.trip?.minutes ?? '',
      o.trip?.passengers ?? '',
      o.meal ? mealInfo(o.meal.kind).label + (o.meal.prepaid ? ' (продукти вже куплені)' : '') : '',
      o.note ?? '',
    ].map(cell).join(';'));
  return '﻿' + [head.join(';'), ...rows].join('\r\n') + '\r\n';
}

export function daysCSV(data: AppData, today: string): string {
  const ix = buildIndex(data.ops);
  const cats = catMap(data.categories);
  const dates = new Set<string>([...Object.keys(data.days), ...ix.byDate.keys()]);
  const head = ['Дата', 'Статус', 'План, грн', 'Витрачено, грн', 'План − факт, грн', 'Обовʼязкові платежі, грн', 'Відкладено, грн', 'Собівартість харчування, грн'];
  const label = { closed: 'Завершено', recorded: 'Є записи', open: 'Сьогодні', missing: 'Немає даних', future: 'Майбутній' } as const;
  const rows = [...dates].filter((d) => d <= today).sort().map((d) => {
    const c = calcDay(ix, d, data.days[d], cats);
    const st = dayStatus(d, today, data.days[d], c.hasData);
    return [d, label[st], c.plan ? money(c.planTotal) : '', money(c.spent), c.plan ? money(c.planTotal - c.spent) : '', money(c.bills), money(c.saved), money(c.foodCost)].map(cell).join(';');
  });
  return '﻿' + [head.join(';'), ...rows].join('\r\n') + '\r\n';
}
