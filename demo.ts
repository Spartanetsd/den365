// demo.ts — демонстраційний режим із вигаданими даними. Живе в окремій базі й ніколи не змішується
// з особистою історією. Сьогоднішній день відтворює приклад: план 650 грн, фактично 460 грн, різниця 190 грн.
import type { AppData, DayRecord, MealKind, Operation, TripDir, TripMode } from './types.ts';
import { TEMPLATES, clone, emptyData } from './defaults.ts';
import { uah } from './money.ts';
import { addDays, msAtKyiv, ymd } from './time.ts';
import { isWorkday } from './calendar.ts';
import { adviceFor } from './mentor.ts';
import { modeInfo, tripAmounts } from './transport.ts';
import { isHomeMeal, mealInfo } from './meals.ts';
import { newlyDone } from './habits.ts';

export const DEMO_TODAY = { plan: uah(650), cash: uah(460), economy: uah(190), homeLunch: uah(65) };

export function buildDemo(today: string, now: number = Date.now()): AppData {
  const data = emptyData();
  const s = data.settings;
  s.onboarded = true;
  s.hourValue = uah(150);
  s.canteenPrice = uah(170);
  s.publicFare = uah(30);
  s.joyBudget = uah(150);
  const dom = (k: string) => ymd(k).d;
  s.budget = {
    incomes: [{ id: 'demo-inc', name: 'Зарплата (приклад)', amount: uah(25_000), day: dom(addDays(today, 8)) }],
    obligations: [
      { id: 'demo-rent', name: 'Оренда (приклад)', kind: 'rent', amount: uah(9_000), day: dom(addDays(today, 12)) },
      { id: 'demo-util', name: 'Комунальні (приклад)', kind: 'utilities', amount: uah(1_800), day: dom(addDays(today, 5)) },
      { id: 'demo-credit', name: 'Розстрочка (приклад)', kind: 'credit', amount: uah(1_200), day: dom(addDays(today, 10)) },
    ],
    balance: { amount: uah(12_000), date: today },
    savingsStart: uah(7_000),
    buffer: uah(1_000),
    monthlyGoal: uah(3_000),
    dailyEstimate: uah(650),
    flexTransport: uah(1_800),
    flexGroceries: uah(6_000),
  };
  s.calendar.stays = [{ id: 'demo-stay', from: addDays(today, -13), to: addDays(today, 16), label: 'Навчання у Дніпрі (приклад)' }];
  data.goals = [
    { id: 'demo-goal-reserve', name: 'Резерв', kind: 'reserve', target: uah(10_000), start: uah(2_000), createdAt: now - 20 * 86_400_000 },
    { id: 'demo-goal-cushion', name: 'Фінансова подушка', kind: 'cushion', target: uah(30_000), start: uah(5_000), createdAt: now - 20 * 86_400_000 },
  ];

  const ops: Operation[] = [];
  const days: Record<string, DayRecord> = {};
  let n = 0;
  const id = () => `demo-${++n}`;
  const at = (date: string, hh: number, mm: number) => msAtKyiv(date, hh, mm);
  const route = (dir: TripDir) => (dir === 'there' ? 'Дім → Навчання' : dir === 'back' ? 'Навчання → Дім' : 'Місто');

  const expense = (date: string, hh: number, mm: number, amount: number, category: string, extra: Partial<Operation> = {}) => {
    ops.push({ id: id(), type: 'expense', date, time: at(date, hh, mm), amount, category, updatedAt: now, ...extra });
  };
  const trip = (date: string, hh: number, mm: number, mode: TripMode, dir: TripDir, cost: number, minutes: number, wait: number, comfort: number, line?: string) => {
    const a = tripAmounts({ mode, cost, passengers: 1, split: false });
    expense(date, hh, mm, a.cash, 'transport', {
      title: modeInfo(mode).label,
      trip: { mode, dir, route: route(dir), minutes, wait, comfort, passengers: 1, split: false, full: a.full },
      ...(line ? { planLineId: line } : {}),
    });
  };
  const meal = (date: string, hh: number, mm: number, kind: MealKind, amount: number, prepaid: boolean, line?: string) => {
    const home = isHomeMeal(kind);
    if (home && prepaid) {
      ops.push({ id: id(), type: 'consumption', date, time: at(date, hh, mm), amount, category: 'lunch', title: mealInfo(kind).label, meal: { kind, prepaid: true }, updatedAt: now, ...(line ? { planLineId: line } : {}) });
    } else {
      expense(date, hh, mm, amount, home ? 'groceries' : 'lunch', { title: mealInfo(kind).label, meal: { kind, prepaid: false }, ...(line ? { planLineId: line } : {}) });
    }
  };
  const micro = (date: string, hh: number, mm: number, item: 'q-coffee' | 'q-treat', amount: number, line?: string) => {
    const it = data.micro.find((m) => m.id === item)!;
    expense(date, hh, mm, amount, it.category, { micro: item, title: it.name, ...(line ? { planLineId: line } : {}) });
  };
  const save = (date: string, amount: number) => {
    ops.push({ id: id(), type: 'saving', date, time: at(date, 21, 10), amount, goalId: 'demo-goal-reserve', title: 'Переказ у накопичення', updatedAt: now });
  };
  const planOf = (tpl: string) => clone(TEMPLATES.find((t) => t.id === tpl)!.lines);
  const setDay = (date: string, tpl: string | null) => {
    days[date] = { date, plan: tpl ? planOf(tpl) : null, ...(tpl ? { planSource: 'template' as const, templateId: tpl } : {}), closed: false, updatedAt: now };
  };

  // ── Сьогодні: приклад із технічного завдання ───────────────────────────
  setDay(today, 'tpl-study');
  trip(today, 8, 5, 'bus', 'there', uah(30), 35, 7, 3, 's1');
  micro(today, 10, 30, 'q-coffee', uah(60), 's2');
  meal(today, 13, 0, 'lunchBox', uah(65), true, 's3');
  trip(today, 17, 40, 'bus', 'back', uah(30), 40, 10, 3, 's4');
  expense(today, 18, 15, uah(280), 'groceries', { title: 'Продукти на вечерю', planLineId: 's5' });
  micro(today, 18, 25, 'q-treat', uah(60), 's6');

  // ── Попередні дні: різні ситуації для графіків і прогнозів ─────────────
  const work: ((d: string) => void)[] = [
    (d) => { setDay(d, 'tpl-study'); trip(d, 8, 0, 'bus', 'there', uah(30), 36, 6, 3, 's1'); micro(d, 10, 15, 'q-coffee', uah(60), 's2'); meal(d, 13, 10, 'canteen', uah(170), false, 's3'); trip(d, 17, 50, 'bus', 'back', uah(30), 42, 8, 3, 's4'); expense(d, 18, 30, uah(190), 'groceries', { title: 'Продукти', planLineId: 's5' }); micro(d, 18, 40, 'q-treat', uah(45), 's6'); save(d, uah(120)); },
    (d) => { setDay(d, 'tpl-study'); trip(d, 8, 10, 'bus', 'there', uah(30), 35, 8, 3, 's1'); micro(d, 10, 20, 'q-coffee', uah(60), 's2'); meal(d, 13, 0, 'lunchBox', uah(70), true, 's3'); trip(d, 19, 20, 'taxi', 'back', uah(210), 18, 4, 5, 's4'); expense(d, 19, 50, uah(240), 'groceries', { title: 'Продукти', planLineId: 's5' }); micro(d, 20, 0, 'q-treat', uah(50), 's6'); },
    (d) => { setDay(d, 'tpl-study'); trip(d, 7, 55, 'bus', 'there', uah(30), 38, 9, 2, 's1'); micro(d, 9, 50, 'q-coffee', uah(60), 's2'); micro(d, 15, 30, 'q-coffee', uah(60)); meal(d, 13, 5, 'canteen', uah(175), false, 's3'); trip(d, 17, 45, 'bus', 'back', uah(30), 44, 12, 2, 's4'); expense(d, 18, 20, uah(230), 'groceries', { title: 'Продукти', planLineId: 's5' }); micro(d, 18, 35, 'q-treat', uah(90), 's6'); },
    (d) => { setDay(d, 'tpl-study'); trip(d, 8, 5, 'bus', 'there', uah(30), 34, 6, 3, 's1'); micro(d, 10, 0, 'q-coffee', uah(60), 's2'); meal(d, 13, 0, 'lunchBox', uah(60), true, 's3'); trip(d, 17, 35, 'bus', 'back', uah(30), 39, 7, 3, 's4'); expense(d, 18, 10, uah(180), 'groceries', { title: 'Продукти', planLineId: 's5' }); expense(d, 18, 30, uah(120), 'household', { title: 'Засоби для прибирання' }); save(d, uah(200)); },
    (d) => { setDay(d, 'tpl-study'); trip(d, 8, 0, 'bus', 'there', uah(30), 37, 7, 3, 's1'); micro(d, 10, 10, 'q-coffee', uah(60), 's2'); meal(d, 13, 20, 'canteen', uah(180), false, 's3'); trip(d, 20, 30, 'taxi', 'back', uah(190), 20, 5, 5, 's4'); expense(d, 20, 50, uah(260), 'groceries', { title: 'Продукти', planLineId: 's5' }); micro(d, 21, 0, 'q-treat', uah(40), 's6'); },
  ];
  const weekend: ((d: string) => void)[] = [
    (d) => { setDay(d, 'tpl-weekend'); expense(d, 11, 0, uah(420), 'groceries', { title: 'Продукти', planLineId: 'w1' }); expense(d, 16, 0, uah(250), 'other', { title: 'Відпочинок', planLineId: 'w2' }); expense(d, 18, 0, uah(180), 'household', { title: 'Сімейні витрати', planLineId: 'w3' }); save(d, uah(150)); },
    (d) => { setDay(d, 'tpl-weekend'); expense(d, 10, 30, uah(520), 'groceries', { title: 'Продукти', planLineId: 'w1' }); expense(d, 15, 0, uah(380), 'other', { title: 'Відпочинок', planLineId: 'w2' }); expense(d, 19, 0, uah(160), 'household', { title: 'Сімейні витрати', planLineId: 'w3' }); },
  ];
  let w = 0;
  let e = 0;
  let noSpendDone = false;
  for (let i = 1; i <= 13; i++) {
    const d = addDays(today, -i);
    if (i === 4) continue; // день без записів — щоб показати різницю між «немає даних» і «без витрат»
    if (!isWorkday(d, s.calendar)) {
      if (!noSpendDone && i >= 2) {
        noSpendDone = true;
        days[d] = { date: d, plan: null, closed: true, closedAt: at(d, 21, 0), updatedAt: now };
        continue;
      }
      weekend[e++ % weekend.length](d);
    } else {
      work[w++ % work.length](d);
    }
    if (i !== 1) days[d] = { ...days[d], closed: true, closedAt: at(d, 21, 0) };
  }

  data.ops = ops;
  data.days = days;
  for (const rec of Object.values(days)) {
    if (rec.closed) data.days[rec.date] = { ...rec, advice: adviceFor(data, rec.date, today, rec.closedAt ?? now) };
  }
  for (const h of newlyDone(data, today)) data.habits[h.id] = now;
  return data;
}
