// view.ts — стан інтерфейсу (вкладки, фільтри) і кеш похідних обчислень.
import type { AppData, Category } from './types.ts';
import type { Index } from './ledger.ts';
import { buildIndex, catMap } from './ledger.ts';
import { getState, type StoreState } from './store.ts';
import { todayKey } from './time.ts';

export type Tab = 'day' | 'add' | 'stats' | 'future' | 'settings';
export type AddMode = 'expense' | 'trip' | 'meal' | 'more';
export type PeriodId = 'today' | 'yesterday' | '7d' | '30d' | 'month' | '182d' | '365d' | 'custom';

export interface AddPreset {
  mode: AddMode;
  date?: string;
  category?: string;
  more?: 'income' | 'refund' | 'saving' | 'withdrawal' | 'transfer';
}

export const ui = {
  tab: 'day' as Tab,
  dayDate: null as string | null,
  addMode: 'expense' as AddMode,
  addPreset: null as AddPreset | null,
  statsTab: 'overview' as 'overview' | 'history' | 'advice',
  period: '30d' as PeriodId,
  customFrom: '',
  customTo: '',
  histQuery: '',
  histType: 'all' as string,
  showTrash: false,
  futureTab: 'forecast' as 'forecast' | 'whatif' | 'goals' | 'habits',
  scenario: 'base' as 'conservative' | 'base' | 'optimistic',
  whatIf: { taxi: 0, homeLunch: 0, coffee: 0, treatsPct: 0 },
  settingsPage: null as string | null,
  dismissed: {} as Record<string, boolean>,
};

let renderer: () => void = () => {};

export function setRenderer(fn: () => void): void {
  renderer = fn;
}

export function rerender(): void {
  renderer();
}

export function setUI(patch: Partial<typeof ui>): void {
  Object.assign(ui, patch);
  rerender();
}

export function go(tab: Tab, patch: Partial<typeof ui> = {}): void {
  Object.assign(ui, patch, { tab });
  if (location.hash !== '#' + tab) history.replaceState(null, '', '#' + tab);
  window.scrollTo(0, 0);
  rerender();
}

let memoData: AppData | null = null;
let memoIx: Index = buildIndex([]);
let memoCats: Map<string, Category> = new Map();

export interface Derived {
  state: StoreState;
  data: AppData;
  ix: Index;
  cats: Map<string, Category>;
  today: string;
}

export function derived(): Derived {
  const state = getState();
  if (state.data !== memoData) {
    memoData = state.data;
    memoIx = buildIndex(state.data.ops);
    memoCats = catMap(state.data.categories);
  }
  return { state, data: state.data, ix: memoIx, cats: memoCats, today: todayKey() };
}

export function catOf(cats: Map<string, Category>, id: string | undefined): Category {
  return cats.get(id ?? 'other') ?? cats.get('other') ?? { id: 'other', name: 'Інші витрати', icon: 'box', color: '#76808C', necessity: 'unexpected', micro: false };
}
