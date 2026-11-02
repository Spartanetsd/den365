// defaults.ts — початкові категорії, шаблони, мікровитрати й налаштування.
// Особистих фінансових значень тут немає: доходи, платежі й залишки користувач вводить сам.
// Суми в шаблонах і швидких кнопках — лише приклад, усі вони редагуються.
import type {
  AppData, Category, GoalKind, MicroItem, Necessity, ObligationKind, PlanLine, Settings, Template, TripMode,
} from './types.ts';
import { uah } from './money.ts';

export const CATEGORIES: Category[] = [
  { id: 'transport', name: 'Транспорт', icon: 'bus', color: '#3B76D6', necessity: 'flexible', micro: false, builtin: true },
  { id: 'groceries', name: 'Продукти', icon: 'basket', color: '#2C9561', necessity: 'flexible', micro: false, builtin: true },
  { id: 'lunch', name: 'Обід', icon: 'utensils', color: '#D9772B', necessity: 'flexible', micro: false, builtin: true },
  { id: 'coffee', name: 'Кава', icon: 'coffee', color: '#9A6B47', necessity: 'optional', micro: true, builtin: true },
  { id: 'treats', name: 'Смаколики', icon: 'candy', color: '#C9508A', necessity: 'optional', micro: true, builtin: true },
  { id: 'household', name: 'Побут', icon: 'home', color: '#7562CF', necessity: 'flexible', micro: false, builtin: true },
  { id: 'other', name: 'Інші витрати', icon: 'box', color: '#76808C', necessity: 'unexpected', micro: false, builtin: true },
  { id: 'bills', name: 'Обов’язкові платежі', icon: 'doc', color: '#4F6475', necessity: 'required', micro: false, builtin: true },
];

/** Кольори й значки для власних категорій. */
export const CATEGORY_COLORS = ['#3B76D6', '#2C9561', '#D9772B', '#9A6B47', '#C9508A', '#7562CF', '#76808C', '#1E9A9A', '#B88A1E', '#5C6BC0'];
export const CATEGORY_ICONS = ['box', 'basket', 'utensils', 'coffee', 'candy', 'home', 'bus', 'gift', 'heart', 'book', 'shirt', 'pill', 'phone', 'paw', 'doc'];

export const MICRO: MicroItem[] = [
  { id: 'q-coffee', name: 'Кава', category: 'coffee', icon: 'coffee', price: uah(60), quick: true },
  { id: 'q-treat', name: 'Смаколик', category: 'treats', icon: 'candy', price: uah(45), quick: true },
  { id: 'q-water', name: 'Вода', category: 'coffee', icon: 'drop', price: uah(25), quick: true },
  { id: 'espresso', name: 'Еспресо', category: 'coffee', icon: 'coffee', price: null, quick: false },
  { id: 'americano', name: 'Американо', category: 'coffee', icon: 'coffee', price: null, quick: false },
  { id: 'cappuccino', name: 'Капучино', category: 'coffee', icon: 'coffee', price: null, quick: false },
  { id: 'latte', name: 'Лате', category: 'coffee', icon: 'coffee', price: null, quick: false },
  { id: 'tea', name: 'Чай', category: 'coffee', icon: 'cup', price: null, quick: false },
  { id: 'cookies', name: 'Печиво', category: 'treats', icon: 'cookie', price: null, quick: false },
  { id: 'chocolate', name: 'Шоколад', category: 'treats', icon: 'choco', price: null, quick: false },
  { id: 'pastry', name: 'Випічка', category: 'treats', icon: 'pastry', price: null, quick: false },
  { id: 'snacks', name: 'Снеки', category: 'treats', icon: 'candy', price: null, quick: false },
  { id: 'icecream', name: 'Морозиво', category: 'treats', icon: 'icecream', price: null, quick: false },
  { id: 'micro-other', name: 'Інше', category: 'treats', icon: 'box', price: null, quick: false },
];

const line = (id: string, label: string, category: string, hryvnias: number): PlanLine => ({
  id, label, category, amount: uah(hryvnias),
});

export const TEMPLATES: Template[] = [
  {
    id: 'tpl-study', name: 'Навчання у Дніпрі', builtin: true,
    lines: [
      line('s1', 'Поїздка туди', 'transport', 30),
      line('s2', 'Кава', 'coffee', 70),
      line('s3', 'Обід', 'lunch', 180),
      line('s4', 'Поїздка назад', 'transport', 30),
      line('s5', 'Продукти на вечерю', 'groceries', 200),
      line('s6', 'Смаколики', 'treats', 50),
      line('s7', 'Непередбачені', 'other', 90),
    ],
  },
  {
    id: 'tpl-eco', name: 'Економний день', builtin: true,
    lines: [
      line('e1', 'Громадський транспорт', 'transport', 60),
      line('e2', 'Домашній обід', 'lunch', 0),
      line('e3', 'Мінімальні покупки', 'groceries', 120),
      line('e4', 'Резерв', 'other', 40),
    ],
  },
  {
    id: 'tpl-comfort', name: 'Комфортний день', builtin: true,
    lines: [
      line('c1', 'Таксі', 'transport', 300),
      line('c2', 'Обід у їдальні', 'lunch', 170),
      line('c3', 'Кава', 'coffee', 70),
      line('c4', 'Додаткові витрати', 'other', 150),
    ],
  },
  {
    id: 'tpl-weekend', name: 'Вихідний', builtin: true,
    lines: [
      line('w1', 'Продукти', 'groceries', 400),
      line('w2', 'Відпочинок', 'other', 300),
      line('w3', 'Сімейні витрати', 'household', 300),
    ],
  },
];

export const NECESSITY: Record<Necessity, { label: string; short: string }> = {
  required: { label: 'Обов’язкові', short: 'Обов’язкова' },
  flexible: { label: 'Потрібні, але гнучкі', short: 'Гнучка' },
  optional: { label: 'Необов’язкові', short: 'Необов’язкова' },
  unexpected: { label: 'Непередбачені', short: 'Непередбачена' },
};
export const NECESSITY_ORDER: Necessity[] = ['required', 'flexible', 'optional', 'unexpected'];

export const OBLIGATION_KINDS: Record<ObligationKind, string> = {
  rent: 'Оренда житла',
  utilities: 'Комунальні',
  credit: 'Кредит або розстрочка',
  other: 'Інший платіж',
};

export const GOAL_PRESETS: { kind: GoalKind; name: string; target: number | null; icon: string }[] = [
  { kind: 'reserve', name: 'Резерв', target: uah(10_000), icon: 'shield' },
  { kind: 'cushion', name: 'Фінансова подушка', target: uah(30_000), icon: 'coins' },
  { kind: 'car', name: 'Автомобіль', target: null, icon: 'car' },
  { kind: 'vacation', name: 'Відпустка', target: null, icon: 'sun' },
  { kind: 'custom', name: 'Власна мета', target: null, icon: 'target' },
];

export const PUBLIC_MODES: TripMode[] = ['bus', 'tram', 'trolley', 'metro'];

export function defaultSettings(): Settings {
  return {
    theme: 'system',
    onboarded: false,
    hourValue: null,
    canteenPrice: null,
    publicFare: null,
    joyBudget: null,
    autoPlan: { work: null, off: null },
    calendar: { workdays: [true, true, true, true, true, false, false], overrides: {}, stays: [] },
    budget: {
      incomes: [],
      obligations: [],
      balance: null,
      savingsStart: 0,
      buffer: 0,
      monthlyGoal: null,
      dailyEstimate: null,
      flexTransport: null,
      flexGroceries: null,
    },
    forecastStayOnly: false,
  };
}

export function clone<T>(x: T): T {
  return typeof structuredClone === 'function' ? structuredClone(x) : (JSON.parse(JSON.stringify(x)) as T);
}

export function emptyData(): AppData {
  return {
    ops: [],
    days: {},
    settings: defaultSettings(),
    categories: clone(CATEGORIES),
    templates: clone(TEMPLATES),
    goals: [],
    micro: clone(MICRO),
    habits: {},
  };
}

let counter = 0;
export function uid(prefix = ''): string {
  const c = (globalThis as { crypto?: { randomUUID?: () => string } }).crypto;
  if (c?.randomUUID) return prefix + c.randomUUID();
  counter = (counter + 1) % 1_000_000;
  return `${prefix}${Date.now().toString(36)}-${counter.toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
