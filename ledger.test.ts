import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildIndex, calcDay, calcPeriod, catMap, dayStatus, savingsTotal } from './ledger.ts';
import { addOp, closeDay, deleteOp, restoreOp, updateOp } from './actions.ts';
import { availableNow } from './budget.ts';
import { CATEGORIES } from './defaults.ts';
import { parseMoney, uah } from './money.ts';
import { addDays } from './time.ts';
import { data, exp, op, plan, STUDY, TODAY } from './fixtures.test.ts';

const cats = catMap(CATEGORIES);

test('правильне додавання витрат', () => {
  let d = data({ days: { [TODAY]: plan(TODAY, STUDY) } });
  for (const [amount, category] of [['30', 'transport'], ['60,50', 'coffee'], ['0,10', 'treats'], ['0,20', 'treats']] as const) {
    d = addOp(d, { type: 'expense', date: TODAY, amount: parseMoney(amount)!, category }, TODAY).data;
  }
  const c = calcDay(buildIndex(d.ops), TODAY, d.days[TODAY], cats);
  assert.equal(c.spent, 3000 + 6050 + 10 + 20);
  assert.equal(c.byCat.treats, 30);
  assert.equal(c.planTotal, uah(650));
  assert.equal(c.remaining, uah(650) - 9080);
  assert.equal(c.usedPct, 14);
});

test('нульові й відʼємні витрати в звичайному режимі відхиляються', () => {
  const d = data();
  assert.throws(() => addOp(d, { type: 'expense', date: TODAY, amount: 0, category: 'coffee' }, TODAY));
  assert.throws(() => addOp(d, { type: 'expense', date: TODAY, amount: -500, category: 'coffee' }, TODAY));
  assert.throws(() => addOp(d, { type: 'expense', date: TODAY, amount: 10.5, category: 'coffee' }, TODAY));
});

test('перевищення денного бюджету', () => {
  const ops = [exp(TODAY, 300, 'transport'), exp(TODAY, 250, 'lunch'), exp(TODAY, 150, 'groceries')];
  const c = calcDay(buildIndex(ops), TODAY, plan(TODAY, STUDY), cats);
  assert.equal(c.spent, uah(700));
  assert.equal(c.over, uah(50));
  assert.equal(c.remaining, uah(-50));
  assert.equal(c.economy, 0);
  assert.equal(c.usedPct, 108);
});

test('домашній обід із куплених продуктів не списується вдруге', () => {
  const ops = [
    exp(TODAY, 280, 'groceries'),
    op({ type: 'consumption', date: TODAY, amount: uah(65), category: 'lunch', meal: { kind: 'lunchBox', prepaid: true } }),
  ];
  const ix = buildIndex(ops);
  const c = calcDay(ix, TODAY, plan(TODAY, STUDY), cats);
  assert.equal(c.spent, uah(280), 'реальний рух грошей — лише покупка продуктів');
  assert.equal(c.foodCash, uah(280));
  assert.equal(c.foodCost, uah(65), 'собівартість харчування — окремий показник');
  assert.equal(c.consumption, uah(65));
  assert.equal(availableNow(ix, { amount: uah(1000), date: TODAY }, TODAY), uah(720));
});

test('домашній обід із нової покупки — одна витрата', () => {
  const ops = [exp(TODAY, 90, 'groceries', { meal: { kind: 'lunchBox', prepaid: false } })];
  const c = calcDay(buildIndex(ops), TODAY, undefined, cats);
  assert.equal(c.spent, uah(90));
  assert.equal(c.foodCost, uah(90));
  assert.equal(c.foodCash, uah(90));
});

test('пропущений день ≠ день без витрат', () => {
  const d1 = addDays(TODAY, -3);
  const d2 = addDays(TODAY, -2);
  const d3 = addDays(TODAY, -1);
  const days = { [d1]: { date: d1, plan: null, closed: true, updatedAt: 1 } };
  const ops = [exp(d3, 400, 'groceries')];
  const ix = buildIndex(ops);
  assert.equal(dayStatus(d1, TODAY, days[d1], false), 'closed');
  assert.equal(dayStatus(d2, TODAY, undefined, false), 'missing');
  const p = calcPeriod(ix, days, cats, d1, d3, TODAY);
  assert.equal(p.dataDays, 2, 'завершений день без витрат + день із записами');
  assert.equal(p.noSpendDays, 1);
  assert.equal(p.missingDays, 1);
  assert.equal(p.avgPerDataDay, uah(200), 'пропущений день не тягне середнє вниз');
});

test('повернення грошей коригує день і категорію початкової витрати', () => {
  const d1 = addDays(TODAY, -2);
  const buy = exp(d1, 400, 'household', { id: 'buy' });
  const back = op({ type: 'refund', date: TODAY, amount: uah(400), category: 'household', refundOf: 'buy' });
  const free = op({ type: 'refund', date: TODAY, amount: uah(50), category: 'coffee' });
  const ix = buildIndex([buy, back, free, exp(TODAY, 120, 'coffee')]);
  const day1 = calcDay(ix, d1, undefined, cats);
  const day3 = calcDay(ix, TODAY, undefined, cats);
  assert.equal(day1.spent, 0, 'привʼязане повернення анулює покупку в її дні');
  assert.equal(day1.refunds, uah(400));
  assert.equal(day3.spent, uah(70), 'непривʼязане повернення — у день надходження');
  assert.equal(day3.income, 0, 'повернення — не дохід');
  assert.equal(availableNow(ix, { amount: uah(1000), date: d1 }, TODAY), uah(1000 - 400 + 400 + 50 - 120));
});

test('переказ у накопичення — не витрата', () => {
  const ops = [
    exp(TODAY, 460, 'groceries'),
    op({ type: 'saving', date: TODAY, amount: uah(190) }),
    op({ type: 'withdrawal', date: TODAY, amount: uah(40) }),
    op({ type: 'transfer', date: TODAY, amount: uah(500) }),
  ];
  const ix = buildIndex(ops);
  const c = calcDay(ix, TODAY, plan(TODAY, STUDY), cats);
  assert.equal(c.spent, uah(460));
  assert.equal(c.saved, uah(150));
  assert.equal(c.economy, uah(190), 'економія відносно плану не залежить від переказів');
  assert.equal(savingsTotal(ix, uah(1000)), uah(1150));
  assert.equal(availableNow(ix, { amount: uah(2000), date: TODAY }, TODAY), uah(2000 - 460 - 190 + 40), 'переказ між рахунками нейтральний');
});

test('обовʼязкові платежі не входять у денний бюджет', () => {
  const ops = [exp(TODAY, 9000, 'bills', { obligationId: 'rent' }), exp(TODAY, 60, 'coffee')];
  const c = calcDay(buildIndex(ops), TODAY, plan(TODAY, STUDY), cats);
  assert.equal(c.spent, uah(60));
  assert.equal(c.bills, uah(9000));
  assert.equal(c.over, 0);
});

test('перерахунок показників після редагування, видалення й відновлення', () => {
  const t0 = 1_000;
  let d = data({ days: { [TODAY]: plan(TODAY, STUDY) } });
  const add = addOp(d, { type: 'expense', date: TODAY, amount: uah(300), category: 'lunch' }, TODAY, t0);
  d = closeDay(add.data, TODAY, TODAY, t0 + 1).data;
  const before = d.days[TODAY].advice!;
  const calc = () => calcDay(buildIndex(d.ops), TODAY, d.days[TODAY], cats);
  assert.equal(calc().spent, uah(300));

  d = updateOp(d, add.value.id, { amount: uah(900) }, TODAY, t0 + 2).data;
  assert.equal(calc().spent, uah(900));
  assert.equal(calc().over, uah(250));
  const after = d.days[TODAY].advice!;
  assert.notEqual(after.why, before.why, 'порада завершеного дня перерахована');
  assert.equal(after.createdAt, t0 + 2);

  d = deleteOp(d, add.value.id, TODAY, t0 + 3).data;
  assert.equal(calc().spent, 0);
  d = restoreOp(d, add.value.id, TODAY, t0 + 4).data;
  assert.equal(calc().spent, uah(900));
});
