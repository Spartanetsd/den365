import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildDemo, DEMO_TODAY } from './demo.ts';
import { buildIndex, calcDay, catMap, dayStatus, savingsTotal } from './ledger.ts';
import { closeDay } from './actions.ts';
import { illustrate } from './forecast.ts';
import { countDays } from './calendar.ts';
import { uah } from './money.ts';
import { addDays } from './time.ts';
import { TODAY } from './fixtures.test.ts';

const demo = buildDemo(TODAY, 1_000);
const ix = buildIndex(demo.ops);
const cats = catMap(demo.categories);

test('демо-день: план 650, фактично 460, різниця 190', () => {
  const c = calcDay(ix, TODAY, demo.days[TODAY], cats);
  assert.equal(c.planTotal, DEMO_TODAY.plan);
  assert.equal(c.spent, DEMO_TODAY.cash);
  assert.equal(c.economy, DEMO_TODAY.economy);
  assert.equal(c.byCat.transport, uah(60));
  assert.equal(c.byCat.coffee, uah(60));
  assert.equal(c.byCat.groceries, uah(280));
  assert.equal(c.byCat.treats, uah(60));
});

test('домашній обід 65 грн не додається вдруге до фактичних витрат', () => {
  const c = calcDay(ix, TODAY, demo.days[TODAY], cats);
  assert.equal(c.consumption, DEMO_TODAY.homeLunch);
  assert.equal(c.foodCost, DEMO_TODAY.homeLunch);
  assert.equal(c.byCat.lunch ?? 0, 0);
});

test('прогноз на основі 190 грн не записується в реальні накопичення', () => {
  const c = calcDay(ix, TODAY, demo.days[TODAY], cats);
  assert.equal(c.saved, 0);
  const before = savingsTotal(ix, demo.settings.budget.savingsStart);
  const ill = illustrate(c.economy!, demo.settings.calendar, TODAY);
  assert.equal(ill[30].amount, uah(190) * countDays(addDays(TODAY, 1), 30, demo.settings.calendar).work);
  assert.equal(savingsTotal(buildIndex(demo.ops), demo.settings.budget.savingsStart), before);
});

test('порада демо-дня — Воррен Баффетт про домашній обід', () => {
  const r = closeDay(demo, TODAY, TODAY, 2_000);
  assert.equal(r.value.ruleId, 'home-lunch');
  assert.equal(r.value.author, 'Воррен Баффетт');
  assert.match(r.value.why, /65/);
  assert.match(r.value.why, /170/);
});

test('демо містить пропущений день, день без витрат і незавершений учорашній день', () => {
  const statuses = [];
  for (let i = 1; i <= 13; i++) {
    const d = addDays(TODAY, -i);
    statuses.push(dayStatus(d, TODAY, demo.days[d], ix.byDate.has(d)));
  }
  assert.ok(statuses.includes('missing'));
  assert.equal(statuses[0], 'recorded');
  const noSpend = Object.values(demo.days).find((r) => r.closed && !r.plan && !ix.byDate.has(r.date));
  assert.ok(noSpend, 'є завершений день без витрат');
});

test('демо-записи мають власний префікс і не зачіпають особисті дані', () => {
  assert.ok(demo.ops.every((o) => o.id.startsWith('demo-')));
  assert.ok(demo.settings.budget.incomes.every((i) => i.name.includes('приклад')));
});
