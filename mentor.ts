// mentor.ts — «Розумний фінансовий наставник»: локальний детермінований механізм порад без ШІ та інтернету.
// Кожне правило має рівень пріоритету і «вагу» (вплив у гривнях). Обирається рівно одна порада:
//   рівень 0 — фінансова стійкість (дефіцит, борги, перевитрати);
//   рівень 1 — найвагоміше рішення дня (таксі, обід, мікровитрати…);
//   рівень 2 — наступний крок і система (відкласти, план, цілі);
//   рівень 3 — обережні загальні поради, коли даних мало.
// Формулювання — принципи «за мотивами підходу», а не цитати.
import type { Advice, AppData, Kop, Necessity } from './types.ts';
import { buildIndex, calcDay, catMap, isBill, necessityOf } from './ledger.ts';
import { budgetView } from './budget.ts';
import { comfortPrice, publicRef } from './transport.ts';
import { canteenRef, homeMealRef, isHomeMeal } from './meals.ts';
import { workdaysAhead, isWorkday } from './calendar.ts';
import { goalView } from './goals.ts';
import { fmt, percent, plural } from './money.ts';
import { addDays, fmtDate } from './time.ts';

export const AUTHORS = {
  buffett: { name: 'Воррен Баффетт', gen: 'Воррена Баффетта' },
  munger: { name: 'Чарлі Мангер', gen: 'Чарлі Мангера' },
  graham: { name: 'Бенджамін Грем', gen: 'Бенджаміна Грема' },
  bogle: { name: 'Джон Богл', gen: 'Джона Богла' },
  lynch: { name: 'Пітер Лінч', gen: 'Пітера Лінча' },
  housel: { name: 'Морган Гаузел', gen: 'Моргана Гаузела' },
  sethi: { name: 'Раміт Сеті', gen: 'Раміта Сеті' },
  dalio: { name: 'Рей Даліо', gen: 'Рея Даліо' },
} as const;
export type AuthorKey = keyof typeof AUTHORS;

export interface MentorCtx {
  date: string;
  work: boolean;
  hasData: boolean;
  closed: boolean;
  hasPlan: boolean;
  plan: Kop;
  spent: Kop;
  gross: Kop;
  /** План − факт (може бути відʼємним); 0, якщо плану немає. */
  economy: Kop;
  over: Kop;
  nec: Record<Necessity, Kop>;
  /** Перевитрати понад план у необовʼязкових категоріях (кава, смаколики…). */
  overOptional: Kop;
  /** Перевитрати понад план на транспорт. */
  overTransport: Kop;
  taxi: { cash: Kop; trips: number; minutes: number | null };
  transportSpent: Kop;
  transportPlan: Kop;
  pub: { cost: Kop; minutes: number | null } | null;
  hourValue: Kop | null;
  carShared: { full: Kop; share: Kop; passengers: number } | null;
  homeMeal: { cost: Kop } | null;
  canteen: Kop | null;
  homeRef: Kop | null;
  mealsOut: Kop;
  lunchPlan: Kop;
  micro: Kop;
  joy: Kop | null;
  microWeek: Kop;
  coffeePrice: Kop | null;
  groceries: Kop;
  groceriesPlan: Kop;
  refunds: Kop;
  saved: Kop;
  biggest: { amount: Kop; necessity: Necessity; title: string } | null;
  budget: {
    status: 'unknown' | 'deficit' | 'ok';
    free: Kop | null;
    shortfall: Kop;
    safe: Kop | null;
    credits: boolean;
    nextIncome: string | null;
  };
  transfers14: number;
  saved14: Kop;
  savedPrev14: Kop;
  goalNear: { name: string; left: Kop; pct: number } | null;
  recent: { closed: number; overDays: number; avgOver: Kop; bigUnderDays: number; avgUnder: Kop };
  dataDays: number;
  missing7: number;
  workdays30: number;
}

interface Built {
  why: string;
  step: string;
  effectKop?: Kop | null;
  effect?: string | null;
  tone?: Advice['tone'];
}

export interface Rule {
  id: string;
  tier: 0 | 1 | 2 | 3;
  author: AuthorKey;
  principle: string;
  when: (c: MentorCtx) => boolean;
  impact: (c: MentorCtx) => number;
  build: (c: MentorCtx) => Built;
}

/** Округлення вгору / вниз до цілих 10 грн. */
const upTen = (k: number): Kop => Math.max(1_000, Math.ceil(k / 1_000) * 1_000);
const downTen = (k: number): Kop => Math.floor(k / 1_000) * 1_000;

interface TaxiCalc {
  extra: Kop;
  saved: number;
  timeValue: Kop;
  worth: boolean;
}

function taxiCalc(c: MentorCtx): TaxiCalc | null {
  if (c.taxi.cash <= 0 || !c.pub || c.pub.minutes === null || c.taxi.minutes === null || c.hourValue === null) return null;
  const trips = Math.max(1, c.taxi.trips);
  const cp = comfortPrice(
    { cost: c.taxi.cash, minutes: c.taxi.minutes },
    { cost: c.pub.cost * trips, minutes: c.pub.minutes * trips },
    c.hourValue,
  );
  if (cp.timeValue === null) return null;
  return { extra: cp.extra, saved: cp.saved, timeValue: cp.timeValue, worth: cp.verdict === 'timeWorthIt' };
}

function taxiWorth(c: MentorCtx): boolean {
  return taxiCalc(c)?.worth === true;
}

export const RULES: Rule[] = [
  // ── Рівень 0: фінансова стійкість ────────────────────────────────────────
  {
    id: 'deficit', tier: 0, author: 'graham', principle: 'Запас міцності',
    when: (c) => c.budget.status === 'deficit',
    impact: (c) => c.budget.shortfall,
    build: (c) => ({
      tone: 'care',
      why: `До ${c.budget.nextIncome ? fmtDate(c.budget.nextIncome) : 'кінця найближчих 30 днів'} бракує ${fmt(c.budget.shortfall)} на обовʼязкові платежі й щоденні потреби.`,
      step: 'Завтра — лише необхідне. Накопичення почекають: спершу обовʼязкові платежі.',
      effectKop: c.budget.shortfall,
      effect: `Потрібно скоротити витрати або знайти ${fmt(c.budget.shortfall)} до наступного доходу.`,
    }),
  },
  {
    id: 'credits', tier: 0, author: 'munger', principle: 'Уникати очевидних помилок',
    when: (c) => c.budget.credits && c.budget.status === 'ok' && (c.budget.free ?? 0) < 100_000,
    impact: (c) => 100_000 - (c.budget.free ?? 0),
    build: (c) => ({
      tone: 'care',
      why: `Є кредит або розстрочка, а вільний запас після всіх резервів — лише ${fmt(c.budget.free ?? 0)}.`,
      step: 'Не бери нових розстрочок, доки не зʼявиться запас. Вільні гроші — спершу на борг.',
    }),
  },
  {
    id: 'over-optional', tier: 0, author: 'munger', principle: 'Уникати очевидних помилок',
    when: (c) => c.hasPlan && c.over >= 5_000 && c.overOptional * 2 >= c.over,
    impact: (c) => c.over,
    build: (c) => ({
      tone: 'calm',
      why: `План перевищено на ${fmt(c.over)}, і здебільшого — через необовʼязкові покупки (${fmt(c.nec.optional)} за день).`,
      step: `Завтра перед необовʼязковою покупкою дорожче ${fmt(upTen(c.over / 2))} — пауза 10 хвилин і погляд на залишок дня.`,
    }),
  },
  {
    id: 'over-necessary', tier: 0, author: 'graham', principle: 'Резерв на непередбачене',
    // Якщо перевитрату спричинило таксі, вирішальною буде порада про ціну комфорту (рівень 1).
    when: (c) => c.hasPlan && c.over >= 5_000 && c.overOptional * 2 < c.over && !(c.taxi.cash > 0 && c.overTransport * 2 >= c.over),
    impact: (c) => c.over,
    build: (c) => ({
      tone: 'calm',
      why: `Бюджет перевищено на ${fmt(c.over)} через потрібні покупки. Так буває — це не провал.`,
      step: `Додай до плану рядок «Непередбачені» приблизно на ${fmt(upTen(c.over))}, щоб такі дні не вибивали з ритму.`,
    }),
  },
  {
    id: 'big-unexpected', tier: 0, author: 'graham', principle: 'Запас міцності',
    when: (c) => c.biggest !== null && c.biggest.necessity === 'unexpected' && c.biggest.amount >= Math.max(20_000, Math.round(c.plan * 0.3)),
    impact: (c) => c.biggest?.amount ?? 0,
    build: (c) => ({
      tone: 'calm',
      why: `Сьогодні була непередбачена витрата «${c.biggest!.title}» — ${fmt(c.biggest!.amount)}.`,
      step: 'Створи ціль «Резерв» хоча б на одну таку суму — наступного разу вона не вдарить по плану.',
      effectKop: c.biggest!.amount,
      effect: `Резерв ${fmt(c.biggest!.amount)} покриє подібний випадок без перевитрати.`,
    }),
  },

  // ── Рівень 1: найвагоміше рішення дня ───────────────────────────────────
  {
    id: 'taxi-worth', tier: 1, author: 'sethi', principle: 'Свідомі витрати',
    when: (c) => taxiWorth(c),
    impact: (c) => c.taxi.cash,
    build: (c) => {
      const t = taxiCalc(c)!;
      return {
        tone: 'positive',
        why: `Таксі коштувало на ${fmt(t.extra)} більше за звичайний проїзд, але зекономило близько ${t.saved} хв. За твоєю цінністю години цей час вартує ${fmt(t.timeValue)}.`,
        step: 'Залишай таксі для таких випадків — коли час справді дорожчий за доплату.',
      };
    },
  },
  {
    id: 'taxi-over', tier: 1, author: 'sethi', principle: 'Свідомі витрати: гроші — на те, що справді важливо',
    when: (c) => c.taxi.cash > 0 && !taxiWorth(c) && (c.transportPlan > 0
      ? c.transportSpent > c.transportPlan + Math.max(5_000, Math.round(c.transportPlan / 2))
      : c.pub !== null && c.taxi.cash >= c.pub.cost * 3),
    impact: (c) => c.taxi.cash - (c.pub ? c.pub.cost * c.taxi.trips : 0),
    build: (c) => {
      const extra = c.pub ? Math.max(0, c.taxi.cash - c.pub.cost * c.taxi.trips) : null;
      const n = c.pub && c.pub.cost > 0 ? Math.round(c.taxi.cash / c.pub.cost) : null;
      const parts = [`Таксі сьогодні — ${fmt(c.taxi.cash)}${n !== null && n >= 2 ? `, стільки ж, скільки ${n} ${plural(n, ['поїздка', 'поїздки', 'поїздок'])} громадським транспортом` : ''}.`];
      if (c.transportPlan > 0) parts.push(`Транспорт вийшов за план на ${fmt(c.transportSpent - c.transportPlan)}.`);
      const month = extra !== null && extra > 0 ? Math.round((extra * 30) / 7) : null;
      return {
        tone: 'calm',
        why: parts.join(' '),
        step: 'Вирішуй заздалегідь: таксі — коли поспішаєш, пізно ввечері чи з важкими речами. В інші дні — громадський транспорт.',
        effectKop: month,
        effect: month ? `Якщо замінити одну таку поїздку на тиждень — ≈ ${fmt(month)} за місяць.` : null,
      };
    },
  },
  {
    id: 'car-shared', tier: 1, author: 'lynch', principle: 'Знати, за що платиш',
    when: (c) => c.carShared !== null,
    impact: (c) => (c.carShared ? c.carShared.full - c.carShared.share : 0),
    build: (c) => ({
      tone: 'positive',
      why: `Повна вартість поїздки авто — ${fmt(c.carShared!.full)}, твоя частка на ${c.carShared!.passengers} пасажирів — ${fmt(c.carShared!.share)}.`,
      step: 'Домовляйтеся про розподіл витрат до поїздки й записуй свою частку одразу.',
    }),
  },
  {
    id: 'home-lunch', tier: 1, author: 'buffett', principle: 'Довгострокова дисципліна',
    when: (c) => c.homeMeal !== null && c.canteen !== null && c.canteen - c.homeMeal.cost >= 3_000,
    impact: (c) => (c.canteen! - c.homeMeal!.cost) * Math.max(1, c.workdays30),
    build: (c) => {
      const d = c.canteen! - c.homeMeal!.cost;
      const m = d * c.workdays30;
      return {
        tone: 'positive',
        why: `Домашній обід обійшовся в ${fmt(c.homeMeal!.cost)} проти ${fmt(c.canteen!)} у їдальні — на ${fmt(d)} менше.`,
        step: 'Приготуй обід заздалегідь, якщо це зручно.',
        effectKop: m,
        effect: `Якщо повторювати це в робочі дні найближчих 30 днів (${c.workdays30}), потенційна різниця — ≈ ${fmt(m)}.`,
      };
    },
  },
  {
    id: 'meals-out', tier: 1, author: 'lynch', principle: 'Розуміти, куди йдуть гроші',
    when: (c) => c.lunchPlan > 0 && c.mealsOut > c.lunchPlan + 3_000,
    impact: (c) => c.mealsOut - c.lunchPlan,
    build: (c) => {
      const diff = c.canteen !== null && c.homeRef !== null ? c.canteen - c.homeRef : null;
      const m = diff !== null && diff > 0 ? Math.round((diff * 2 * 30) / 7) : null;
      return {
        tone: 'calm',
        why: `Їжа поза домом — ${fmt(c.mealsOut)} при плані ${fmt(c.lunchPlan)}.`,
        step: 'Спробуй домашній обід хоча б двічі на тиждень.',
        effectKop: m,
        effect: m ? `Два домашні обіди на тиждень — ≈ ${fmt(m)} за місяць.` : null,
      };
    },
  },
  {
    id: 'micro-over-joy', tier: 1, author: 'housel', principle: 'Маленькі звички — великі наслідки',
    when: (c) => c.joy !== null && c.micro > c.joy,
    impact: (c) => (c.micro - (c.joy ?? 0)) * Math.max(1, c.workdays30),
    build: (c) => {
      const m = c.coffeePrice ? c.coffeePrice * c.workdays30 : null;
      return {
        tone: 'calm',
        why: `Кава й смаколики — ${fmt(c.micro)} при бюджеті радості ${fmt(c.joy!)}. За останні 7 днів — ${fmt(c.microWeek)}.`,
        step: 'Залиш улюблене, прибери автоматичне: наприклад, одна кава замість двох.',
        effectKop: m,
        effect: m ? `На одну каву менше в робочі дні — ≈ ${fmt(m)} за 30 днів.` : null,
      };
    },
  },
  {
    id: 'micro-heavy', tier: 1, author: 'housel', principle: 'Маленькі звички — великі наслідки',
    when: (c) => c.joy === null && c.micro >= 10_000 && c.spent > 0 && c.micro * 4 >= c.spent,
    impact: (c) => c.micro * Math.max(1, c.workdays30),
    build: (c) => ({
      tone: 'calm',
      why: `Дрібні покупки — ${percent(c.micro, c.spent) ?? 0}% сьогоднішніх витрат (${fmt(c.micro)}). За останні 7 днів — ${fmt(c.microWeek)}.`,
      step: 'Встанови «Бюджет радості» — суму на приємності без докорів сумління.',
      effectKop: c.micro * c.workdays30,
      effect: `Якщо так у кожен робочий день — ≈ ${fmt(c.micro * c.workdays30)} за 30 днів.`,
    }),
  },
  {
    id: 'joy-ok', tier: 1, author: 'sethi', principle: 'Витрачати на те, що радує',
    when: (c) => c.joy !== null && c.micro > 0 && c.micro <= c.joy,
    impact: (c) => c.micro,
    build: (c) => ({
      tone: 'positive',
      why: `Приємності — ${fmt(c.micro)} із ${fmt(c.joy!)} бюджету радості. Ти в межах.`,
      step: 'Насолоджуйся без докорів: бюджет радості для того й існує.',
    }),
  },
  {
    id: 'groceries-over', tier: 1, author: 'lynch', principle: 'Розуміти, на що витрачаєш',
    when: (c) => c.groceriesPlan > 0 && c.groceries * 10 > c.groceriesPlan * 13 && c.groceries - c.groceriesPlan >= 5_000,
    impact: (c) => c.groceries - c.groceriesPlan,
    build: (c) => ({
      tone: 'calm',
      why: `Продукти — ${fmt(c.groceries)} при плані ${fmt(c.groceriesPlan)}.`,
      step: 'Перед магазином — список під конкретні страви на 2–3 дні.',
    }),
  },
  {
    id: 'refund', tier: 1, author: 'munger', principle: 'Вчитися на помилках',
    when: (c) => c.refunds > 0,
    impact: (c) => c.refunds,
    build: (c) => ({
      tone: 'calm',
      why: `Сьогодні повернулося ${fmt(c.refunds)}.`,
      step: 'Запиши для себе, чому покупка виявилася зайвою, — це збереже гроші наступного разу.',
    }),
  },

  // ── Рівень 2: наступний крок і система ──────────────────────────────────
  {
    id: 'save-now', tier: 2, author: 'buffett', principle: 'Спершу заплати собі',
    when: (c) => c.hasPlan && c.economy >= 3_000 && c.budget.status === 'ok' && (c.budget.safe ?? 0) >= 1_000 && c.saved <= 0,
    impact: (c) => c.budget.safe ?? 0,
    build: (c) => {
      const s = c.budget.safe ?? 0;
      return {
        tone: 'positive',
        why: `День у межах плану: економія ${fmt(c.economy)}. Безпечно відкласти — ${fmt(s)}.`,
        step: `Переведи ${fmt(s)} у накопичення й зафіксуй це кнопкою «Відкласти гроші».`,
        effectKop: s * c.workdays30,
        effect: `Якщо відкладати так у робочі дні — ≈ ${fmt(s * c.workdays30)} за 30 днів.`,
      };
    },
  },
  {
    id: 'setup-budget', tier: 2, author: 'bogle', principle: 'Простота',
    when: (c) => c.hasPlan && c.economy > 0 && c.budget.status === 'unknown',
    impact: (c) => c.economy,
    build: (c) => ({
      tone: 'calm',
      why: `Економія відносно плану — ${fmt(c.economy)}. Але без доходів, платежів і залишку не видно, скільки з неї можна відкласти безпечно.`,
      step: 'Заповни «Бюджет і доходи» в налаштуваннях — це кілька хвилин.',
    }),
  },
  {
    id: 'saved-today', tier: 2, author: 'bogle', principle: 'Дисципліна і довгий горизонт',
    when: (c) => c.saved > 0,
    impact: (c) => c.saved,
    build: (c) => ({
      tone: 'positive',
      why: `Ти відклав ${fmt(c.saved)} — це реальні гроші, а не економія на папері.`,
      step: 'Повтори наступного разу: невелика регулярна сума важить більше за рідкісну велику.',
      effectKop: c.saved * c.workdays30,
      effect: `Така сума в кожен робочий день — ≈ ${fmt(c.saved * c.workdays30)} за 30 днів.`,
    }),
  },
  {
    id: 'savings-growing', tier: 2, author: 'bogle', principle: 'Тримати курс',
    when: (c) => c.transfers14 >= 3 && c.saved14 > c.savedPrev14,
    impact: (c) => c.saved14,
    build: (c) => ({
      tone: 'positive',
      why: `За 14 днів — ${c.transfers14} ${plural(c.transfers14, ['переказ', 'перекази', 'переказів'])} у накопичення, разом ${fmt(c.saved14)}.`,
      step: 'Не змінюй систему, яка працює: та сама сума, той самий ритм.',
    }),
  },
  {
    id: 'goal-near', tier: 2, author: 'dalio', principle: 'Цілі та правила',
    when: (c) => c.goalNear !== null,
    impact: (c) => c.goalNear?.left ?? 0,
    build: (c) => ({
      tone: 'positive',
      why: `До цілі «${c.goalNear!.name}» лишилося ${fmt(c.goalNear!.left)} — ${c.goalNear!.pct}% уже є.`,
      step: 'Визнач дату й суму завершального переказу та внеси їх у план.',
    }),
  },
  {
    id: 'plan-low', tier: 2, author: 'dalio', principle: 'Навчатися на результатах',
    when: (c) => c.recent.closed >= 4 && c.recent.overDays >= 3,
    impact: (c) => c.recent.avgOver,
    build: (c) => ({
      tone: 'calm',
      why: `У ${c.recent.overDays} з ${c.recent.closed} останніх завершених днів план перевищено, у середньому на ${fmt(c.recent.avgOver)}.`,
      step: `Підніми план на ${fmt(upTen(c.recent.avgOver))}: чесний план корисніший за ідеальний.`,
    }),
  },
  {
    id: 'plan-high', tier: 2, author: 'dalio', principle: 'Навчатися на результатах',
    when: (c) => c.recent.closed >= 4 && c.recent.bigUnderDays >= 3,
    impact: (c) => c.recent.avgUnder,
    build: (c) => {
      const cut = Math.max(1_000, downTen(c.recent.avgUnder / 2));
      return {
        tone: 'positive',
        why: `План стабільно залишає запас — у середньому ${fmt(c.recent.avgUnder)} на день.`,
        step: `Зменш план на ${fmt(cut)} і відкладай цю суму одразу — так економія стане реальною.`,
        effectKop: cut * c.workdays30,
        effect: `${fmt(cut)} у робочі дні — ≈ ${fmt(cut * c.workdays30)} за 30 днів.`,
      };
    },
  },
  {
    id: 'no-plan', tier: 2, author: 'dalio', principle: 'Система замість сили волі',
    when: (c) => !c.hasPlan && c.hasData && c.gross > 0,
    impact: (c) => c.spent,
    build: (c) => ({
      tone: 'calm',
      why: `Сьогодні без плану: витрачено ${fmt(c.spent)}, але порівняти нема з чим.`,
      step: 'Завтра вранці обери шаблон дня — це один дотик.',
    }),
  },
  {
    id: 'no-spend', tier: 2, author: 'housel', principle: 'Свобода вибору',
    when: (c) => (c.closed || c.hasData) && c.gross === 0 && c.spent === 0,
    impact: () => 1,
    build: () => ({
      tone: 'positive',
      why: 'День без витрат.',
      step: 'Нічого не треба виправляти. Просто зауваж, що такі дні можливі.',
    }),
  },
  {
    id: 'missing', tier: 2, author: 'lynch', principle: 'Розуміти, куди йдуть гроші',
    when: (c) => c.missing7 >= 3,
    impact: () => 0,
    build: (c) => ({
      tone: 'calm',
      why: `За останні 7 днів ${c.missing7} ${plural(c.missing7, ['день', 'дні', 'днів'])} без записів — аналітика стає менш точною.`,
      step: 'Достатньо внести підсумок дня хоча б одним записом.',
    }),
  },

  // ── Рівень 3: обережні загальні поради ──────────────────────────────────
  {
    id: 'little-data', tier: 3, author: 'bogle', principle: 'Почати просто',
    when: (c) => c.dataDays < 3 || !c.hasData,
    impact: () => 0,
    build: () => ({
      tone: 'calm',
      why: 'Даних поки мало, тож робити висновки зарано.',
      step: 'Записуй витрати кілька днів — і поради стануть конкретнішими.',
    }),
  },
  {
    id: 'in-budget', tier: 3, author: 'buffett', principle: 'Наступний фінансовий крок',
    when: (c) => c.hasPlan && c.over === 0,
    impact: () => 0,
    build: (c) => ({
      tone: 'positive',
      why: `День у межах плану: витрачено ${fmt(c.spent)} із ${fmt(c.plan)}.`,
      step: 'Наступний крок — вирішити, куди піде економія: у ціль чи в резерв.',
    }),
  },
  {
    id: 'over-small', tier: 3, author: 'graham', principle: 'Запас міцності',
    when: (c) => c.hasPlan && c.over > 0,
    impact: () => 0,
    build: (c) => ({
      tone: 'calm',
      why: `План перевищено на ${fmt(c.over)} — невелике відхилення.`,
      step: 'Завтра заклади в план невеликий резерв на непередбачене.',
    }),
  },
  {
    id: 'fallback', tier: 3, author: 'bogle', principle: 'Дисципліна',
    when: () => true,
    impact: () => 0,
    build: () => ({
      tone: 'calm',
      why: 'Записи зроблено — це вже дисципліна.',
      step: 'Склади план на завтра.',
    }),
  },
];

/** Ідентифікатори всіх правил, що спрацювали (для тестів і пояснень). */
export function matchingRules(c: MentorCtx): string[] {
  return RULES.filter((r) => r.when(c)).map((r) => r.id);
}

/** Обирає ОДНУ пораду: найвищий пріоритет, далі — найбільший вплив, далі — порядок правил. */
export function pickAdvice(c: MentorCtx, now: number = Date.now()): Advice {
  let best: Rule = RULES[RULES.length - 1];
  let bestImpact = -Infinity;
  let found = false;
  for (const rule of RULES) {
    if (!rule.when(c)) continue;
    const impact = rule.impact(c);
    if (!found || rule.tier < best.tier || (rule.tier === best.tier && impact > bestImpact)) {
      best = rule;
      bestImpact = impact;
      found = true;
    }
  }
  const b = best.build(c);
  const a = AUTHORS[best.author];
  return {
    ruleId: best.id,
    author: a.name,
    authorGen: a.gen,
    principle: best.principle,
    why: b.why,
    step: b.step,
    effect: b.effect ?? null,
    effectKop: b.effectKop ?? null,
    tone: b.tone ?? 'calm',
    createdAt: now,
  };
}

/** Збирає контекст для поради з даних застосунку. */
export function buildContext(data: AppData, date: string, today: string): MentorCtx {
  const ix = buildIndex(data.ops);
  const cats = catMap(data.categories);
  const s = data.settings;
  const rec = data.days[date];
  const c = calcDay(ix, date, rec, cats);
  const own = ix.byDate.get(date) ?? [];
  const exp = own.filter((o) => o.type === 'expense');

  const taxis = exp.filter((o) => o.trip?.mode === 'taxi');
  const taxiMinutes = taxis.length && taxis.every((o) => o.trip!.minutes !== null)
    ? taxis.reduce((sum, o) => sum + o.trip!.minutes! + (o.trip!.wait ?? 0), 0)
    : null;
  const pub = publicRef(ix, s, today);
  const car = exp.find((o) => o.trip?.mode === 'car' && o.trip.split && o.trip.passengers > 1);
  const homeLunches = own.filter((o) => o.meal?.kind === 'lunchBox' && (o.type === 'consumption' || o.type === 'expense'));
  const mealsOut = exp.filter((o) => o.meal && !isHomeMeal(o.meal.kind)).reduce((sum, o) => sum + o.amount, 0);

  let microWeek = 0;
  for (let i = 0; i < 7; i++) microWeek += calcDay(ix, addDays(date, -i), data.days[addDays(date, -i)], cats).micro;

  const big = exp.filter((o) => !isBill(o)).sort((a, b) => b.amount - a.amount)[0];

  const todayRec = data.days[today];
  const todayCalc = date === today ? c : calcDay(ix, today, todayRec, cats);
  const bv = budgetView({ ix, settings: s, days: data.days, today, todayCalc, todayClosed: Boolean(todayRec?.closed) });

  const netSaved = (from: string, to: string): { n: number; sum: Kop } => {
    let n = 0;
    let sum = 0;
    for (const o of ix.all) {
      if (o.date < from || o.date > to) continue;
      if (o.type === 'saving') { n++; sum += o.amount; } else if (o.type === 'withdrawal') sum -= o.amount;
    }
    return { n, sum };
  };
  const last14 = netSaved(addDays(date, -13), date);
  const prev14 = netSaved(addDays(date, -27), addDays(date, -14));

  const near = data.goals
    .map((g) => goalView(g, ix, today))
    .filter((v) => !v.done && v.pct >= 80)
    .sort((a, b) => b.pct - a.pct)[0];

  const prevClosed = Object.values(data.days)
    .filter((r) => r.date < date && r.closed && r.plan && r.plan.length)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 5);
  let overDays = 0;
  let sumOver = 0;
  let bigUnderDays = 0;
  let sumUnder = 0;
  for (const r of prevClosed) {
    const rc = calcDay(ix, r.date, r, cats);
    if (rc.spent > rc.planTotal) { overDays++; sumOver += rc.spent - rc.planTotal; }
    else if ((rc.planTotal - rc.spent) * 10 > rc.planTotal * 3) { bigUnderDays++; sumUnder += rc.planTotal - rc.spent; }
  }

  const dataDates = new Set<string>();
  for (const o of ix.all) if (o.date <= date) dataDates.add(o.date);
  for (const r of Object.values(data.days)) if (r.closed && r.date <= date) dataDates.add(r.date);
  let missing7 = 0;
  for (let i = 1; i <= 7; i++) {
    const d = addDays(date, -i);
    if (!ix.byDate.has(d) && !data.days[d]?.closed) missing7++;
  }

  const coffee = data.micro.find((m) => m.id === 'q-coffee' && m.price !== null) ?? data.micro.find((m) => m.category === 'coffee' && m.price !== null);

  return {
    date,
    work: isWorkday(date, s.calendar),
    hasData: c.hasData,
    closed: Boolean(rec?.closed),
    hasPlan: c.plan !== null,
    plan: c.planTotal,
    spent: c.spent,
    gross: c.gross,
    economy: c.plan ? c.planTotal - c.spent : 0,
    over: c.over,
    nec: c.byNec,
    overOptional: Object.entries(c.byCat).reduce((sum, [id, v]) => (cats.get(id)?.necessity === 'optional' ? sum + Math.max(0, v - (c.planByCat[id] ?? 0)) : sum), 0),
    overTransport: Math.max(0, (c.byCat.transport ?? 0) - (c.planByCat.transport ?? 0)),
    taxi: { cash: taxis.reduce((sum, o) => sum + o.amount, 0), trips: taxis.length, minutes: taxiMinutes },
    transportSpent: c.byCat.transport ?? 0,
    transportPlan: c.planByCat.transport ?? 0,
    pub: pub ? { cost: pub.cost, minutes: pub.minutes } : null,
    hourValue: s.hourValue,
    carShared: car ? { full: car.trip!.full, share: car.amount + (car.estimate ?? 0), passengers: car.trip!.passengers } : null,
    homeMeal: homeLunches.length ? { cost: Math.min(...homeLunches.map((o) => o.amount)) } : null,
    canteen: canteenRef(ix, s, today)?.amount ?? null,
    homeRef: homeMealRef(ix, today),
    mealsOut,
    lunchPlan: c.planByCat.lunch ?? 0,
    micro: c.micro,
    joy: s.joyBudget,
    microWeek,
    coffeePrice: coffee?.price ?? null,
    groceries: c.byCat.groceries ?? 0,
    groceriesPlan: c.planByCat.groceries ?? 0,
    refunds: c.refunds,
    saved: c.saved,
    biggest: big ? { amount: big.amount, necessity: necessityOf(big, cats), title: big.title ?? cats.get(big.category ?? 'other')?.name ?? 'Витрата' } : null,
    budget: {
      status: bv.status,
      free: bv.free,
      shortfall: bv.shortfall,
      safe: bv.safe,
      credits: bv.hasCredits,
      nextIncome: bv.nextIncome?.date ?? null,
    },
    transfers14: last14.n,
    saved14: last14.sum,
    savedPrev14: prev14.sum,
    goalNear: near ? { name: near.goal.name, left: near.left, pct: near.pct } : null,
    recent: {
      closed: prevClosed.length,
      overDays,
      avgOver: overDays ? Math.round(sumOver / overDays) : 0,
      bigUnderDays,
      avgUnder: bigUnderDays ? Math.round(sumUnder / bigUnderDays) : 0,
    },
    dataDays: dataDates.size,
    missing7,
    workdays30: workdaysAhead(date, 30, s.calendar),
  };
}

export function adviceFor(data: AppData, date: string, today: string, now: number = Date.now()): Advice {
  return pickAdvice(buildContext(data, date, today), now);
}
