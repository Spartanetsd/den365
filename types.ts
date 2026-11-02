// types.ts — спільні типи даних застосунку «ДЕНЬ × 365».
// Усі грошові суми — цілі копійки (Kop). Дати — рядки 'РРРР-ММ-ДД' за київським часом.

export type Kop = number;

/**
 * Типи операцій:
 * expense     — реальна витрата грошей;
 * income      — надходження;
 * refund      — повернення коштів (коригувальна операція до витрати);
 * saving      — переказ власних коштів у накопичення (не витрата);
 * withdrawal  — повернення грошей із накопичень (не дохід);
 * transfer    — переказ між власними рахунками (не впливає на витрати й доходи);
 * consumption — розрахункова собівартість уже купленого (наприклад, обід із куплених продуктів): не рух грошей.
 */
export type OpType = 'expense' | 'income' | 'refund' | 'saving' | 'withdrawal' | 'transfer' | 'consumption';
export type Necessity = 'required' | 'flexible' | 'optional' | 'unexpected';
export type TripMode = 'bus' | 'tram' | 'trolley' | 'metro' | 'taxi' | 'car' | 'walk' | 'combo';
export type TripDir = 'there' | 'back' | 'other';
export type MealKind =
  | 'breakfastHome' | 'lunchBox' | 'canteen' | 'cafe' | 'fastfood'
  | 'readyFood' | 'delivery' | 'dinnerHome' | 'otherMeal';
export type DayStatus = 'future' | 'open' | 'closed' | 'recorded' | 'missing';
export type Theme = 'system' | 'light' | 'dark';
export type GoalKind = 'reserve' | 'cushion' | 'car' | 'vacation' | 'custom';
export type ObligationKind = 'rent' | 'utilities' | 'credit' | 'other';

export interface CarInfo {
  km: number;
  per100: number;
  fuelPrice: Kop;
  parking: Kop;
  wearPerKm: Kop;
  other: Kop;
  /** Пальне вже оплачене окремою заправкою — тоді воно не є новим рухом грошей. */
  fuelPrepaid: boolean;
}

export interface TripInfo {
  mode: TripMode;
  dir: TripDir;
  route: string;
  minutes: number | null;
  wait: number | null;
  comfort: number | null;
  passengers: number;
  /** Витрати діляться між пасажирами. */
  split: boolean;
  /** Повна вартість поїздки для всіх пасажирів (гроші + розрахункова частина). */
  full: Kop;
  car?: CarInfo;
}

export interface MealInfo {
  kind: MealKind;
  /** Продукти вже куплені (враховані раніше) — без повторного списання. */
  prepaid: boolean;
}

export interface Operation {
  id: string;
  type: OpType;
  date: string;
  time: number;
  /** Основна сума операції. Для consumption — розрахункова собівартість. */
  amount: Kop;
  /** Негрошова (розрахункова) частина витрати: передплачене пальне, знос авто. */
  estimate?: Kop;
  category?: string;
  title?: string;
  note?: string;
  necessity?: Necessity;
  micro?: string;
  trip?: TripInfo;
  meal?: MealInfo;
  refundOf?: string;
  obligationId?: string;
  goalId?: string;
  planLineId?: string;
  updatedAt: number;
  deletedAt?: number;
}

export interface PlanLine {
  id: string;
  label: string;
  category: string;
  amount: Kop;
}

export interface Advice {
  ruleId: string;
  author: string;
  authorGen: string;
  principle: string;
  why: string;
  step: string;
  effect: string | null;
  effectKop: Kop | null;
  tone: 'calm' | 'positive' | 'care';
  createdAt: number;
}

export interface DayRecord {
  date: string;
  plan: PlanLine[] | null;
  planSource?: 'manual' | 'template' | 'auto';
  templateId?: string;
  closed: boolean;
  closedAt?: number;
  advice?: Advice | null;
  updatedAt: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  necessity: Necessity;
  micro: boolean;
  hidden?: boolean;
  builtin?: boolean;
}

export interface MicroItem {
  id: string;
  name: string;
  category: string;
  icon: string;
  price: Kop | null;
  quick: boolean;
}

export interface Template {
  id: string;
  name: string;
  lines: PlanLine[];
  builtin?: boolean;
}

export interface Goal {
  id: string;
  name: string;
  kind: GoalKind;
  target: Kop;
  /** Сума, яка вже була на цю ціль на момент створення. */
  start: Kop;
  createdAt: number;
}

export interface Income {
  id: string;
  name: string;
  amount: Kop;
  /** День місяця (1–31). */
  day: number;
}

export interface Obligation {
  id: string;
  name: string;
  kind: ObligationKind;
  amount: Kop;
  day: number;
}

export interface Stay {
  id: string;
  from: string;
  to: string;
  label: string;
}

export interface CalendarSettings {
  /** Робочі дні тижня, з понеділка по неділю. */
  workdays: boolean[];
  /** Винятки: конкретна дата — робоча чи вихідна. */
  overrides: Record<string, 'work' | 'off'>;
  /** Періоди перебування в Дніпрі. */
  stays: Stay[];
}

export interface BudgetSettings {
  incomes: Income[];
  obligations: Obligation[];
  /** Доступні кошти на початок указаної дати. */
  balance: { amount: Kop; date: string } | null;
  /** Уже накопичено (фінансова подушка) на старті. */
  savingsStart: Kop;
  /** Мінімальний залишок безпеки, який не можна відкладати. */
  buffer: Kop;
  monthlyGoal: Kop | null;
  /** Орієнтовні щоденні витрати для резервування до наступного доходу. */
  dailyEstimate: Kop | null;
  flexTransport: Kop | null;
  flexGroceries: Kop | null;
}

export interface Settings {
  theme: Theme;
  onboarded: boolean;
  /** Умовна цінність години часу. */
  hourValue: Kop | null;
  /** Типова ціна обіду в їдальні. */
  canteenPrice: Kop | null;
  /** Типова вартість однієї поїздки громадським транспортом. */
  publicFare: Kop | null;
  /** Бюджет радості на день. */
  joyBudget: Kop | null;
  autoPlan: { work: string | null; off: string | null };
  calendar: CalendarSettings;
  budget: BudgetSettings;
  /** Прогноз лише для днів перебування в Дніпрі. */
  forecastStayOnly: boolean;
}

export interface AppData {
  ops: Operation[];
  days: Record<string, DayRecord>;
  settings: Settings;
  categories: Category[];
  templates: Template[];
  goals: Goal[];
  micro: MicroItem[];
  habits: Record<string, number>;
}
