import { test } from 'node:test';
import assert from 'node:assert/strict';
import { budgetView, nextIncome, nextOccurrence } from './budget.ts';
import { buildIndex, calcDay, catMap } from './ledger.ts';
import { buildContext, pickAdvice } from './mentor.ts';
import { CATEGORIES } from './defaults.ts';
import { uah } from './money.ts';
import { data, exp, op, plan, STUDY, TODAY } from './fixtures.test.ts';
import type { AppData } from './types.ts';

const cats = catMap(CATEGORIES);

function view(d: AppData, closed = false) {
  const ix = buildIndex(d.ops);
  const c = calcDay(ix, TODAY, d.days[TODAY], cats);
  return budgetView({ ix, settings: d.settings, days: d.days, today: TODAY, todayCalc: c, todayClosed: closed });
}

test('без залишку безпечна сума невідома', () => {
  const v = view(data());
  assert.equal(v.status, 'unknown');
  assert.equal(v.safe, null);
});

test('відсутність доходів: обережне вікно на 30 днів', () => {
  const d = data();
  d.settings.budget.balance = { amount: uah(20_000), date: TODAY };
  d.settings.budget.dailyEstimate = uah(300);
  const v = view(d);
  assert.equal(v.noIncome, true);
  assert.equal(v.nextIncome, null);
  assert.equal(v.dailyDays, 29);
  assert.equal(v.reserveDaily, uah(300 * 29));
  assert.equal(v.reserveToday, uah(300));
  assert.equal(v.free, uah(20_000 - 300 * 30));
  assert.equal(v.status, 'ok');
});

test('наступний дохід — найближча дата після сьогодні', () => {
  assert.equal(nextOccurrence(10, TODAY), '2026-11-10');
  assert.equal(nextOccurrence(4, TODAY), '2026-12-04', 'дохід сьогодні вважається вже отриманим або майбутнім наступного місяця');
  assert.equal(nextOccurrence(31, '2026-11-04'), '2026-11-30', 'короткий місяць');
  const n = nextIncome([{ id: 'a', name: 'Зарплата', amount: uah(30_000), day: 20 }, { id: 'b', name: 'Аванс', amount: uah(10_000), day: 7 }], TODAY);
  assert.equal(n?.id, 'b');
});

test('недостатньо коштів для обовʼязкових платежів — відкладати не рекомендується', () => {
  const d = data({ days: { [TODAY]: plan(TODAY, STUDY) } });
  d.settings.budget.balance = { amount: uah(5_000), date: TODAY };
  d.settings.budget.incomes = [{ id: 'inc', name: 'Зарплата', amount: uah(25_000), day: 15 }];
  d.settings.budget.obligations = [{ id: 'rent', name: 'Оренда', kind: 'rent', amount: uah(6_000), day: 8 }];
  d.settings.budget.dailyEstimate = uah(500);
  d.ops = [exp(TODAY, 200, 'groceries')];
  const v = view(d);
  assert.equal(v.status, 'deficit');
  assert.equal(v.safe, 0);
  assert.equal(v.reserveObligations, uah(6_000));
  assert.ok(v.shortfall > 0);
  const advice = pickAdvice(buildContext(d, TODAY, TODAY));
  assert.equal(advice.ruleId, 'deficit', 'порада ставить фінансову стійкість на перше місце');
});

test('сплачений обовʼязковий платіж не резервується вдруге', () => {
  const d = data();
  d.settings.budget.balance = { amount: uah(10_000), date: '2026-11-01' };
  d.settings.budget.incomes = [{ id: 'inc', name: 'Зарплата', amount: uah(25_000), day: 25 }];
  d.settings.budget.obligations = [{ id: 'rent', name: 'Оренда', kind: 'rent', amount: uah(6_000), day: 3 }];
  d.settings.budget.dailyEstimate = 0;
  const unpaid = view(d);
  assert.equal(unpaid.reserveObligations, uah(6_000), 'прострочений платіж після дати залишку ще потрібно сплатити');
  d.ops = [exp('2026-11-03', 6_000, 'bills', { obligationId: 'rent' })];
  const paid = view(d);
  assert.equal(paid.reserveObligations, 0);
  assert.equal(paid.available, uah(4_000));
  assert.equal(paid.free, uah(4_000));
});

test('безпечна сума не перевищує економію дня і вільні кошти', () => {
  const d = data({ days: { [TODAY]: plan(TODAY, STUDY) } });
  d.settings.budget.balance = { amount: uah(50_000), date: TODAY };
  d.settings.budget.incomes = [{ id: 'inc', name: 'Зарплата', amount: uah(25_000), day: 10 }];
  d.settings.budget.dailyEstimate = uah(650);
  d.ops = [exp(TODAY, 460, 'groceries')];
  assert.equal(view(d, true).safe, uah(190));
  d.settings.budget.balance = { amount: uah(3_800), date: TODAY };
  const tight = view(d, true);
  assert.equal(tight.free, uah(3_800 - 460 - 650 * 5));
  assert.equal(tight.safe, uah(90), 'обмежено вільними коштами');
});

test('майбутні заплановані доходи не є доступними коштами', () => {
  const d = data();
  d.settings.budget.balance = { amount: uah(1_000), date: TODAY };
  d.ops = [op({ type: 'income', date: '2026-11-10', amount: uah(30_000) })];
  assert.equal(view(d).available, uah(1_000));
});
