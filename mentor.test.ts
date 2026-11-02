import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AUTHORS, matchingRules, pickAdvice, RULES, type MentorCtx } from './mentor.ts';
import { addOp, closeDay } from './actions.ts';
import { uah } from './money.ts';
import { data, plan, STUDY, TODAY } from './fixtures.test.ts';

function ctx(p: Partial<MentorCtx> = {}): MentorCtx {
  return {
    date: TODAY, work: true, hasData: true, closed: true, hasPlan: true,
    plan: uah(650), spent: uah(600), gross: uah(600), economy: uah(50), over: 0,
    nec: { required: 0, flexible: uah(600), optional: 0, unexpected: 0 }, overOptional: 0, overTransport: 0,
    taxi: { cash: 0, trips: 0, minutes: null }, transportSpent: uah(60), transportPlan: uah(60),
    pub: null, hourValue: null, carShared: null, homeMeal: null, canteen: null, homeRef: null,
    mealsOut: 0, lunchPlan: uah(180), micro: 0, joy: null, microWeek: 0, coffeePrice: null,
    groceries: uah(200), groceriesPlan: uah(200), refunds: 0, saved: 0, biggest: null,
    budget: { status: 'unknown', free: null, shortfall: 0, safe: null, credits: false, nextIncome: null },
    transfers14: 0, saved14: 0, savedPrev14: 0, goalNear: null,
    recent: { closed: 0, overDays: 0, avgOver: 0, bigUnderDays: 0, avgUnder: 0 },
    dataDays: 10, missing7: 0, workdays30: 21,
    ...p,
  };
}

test('щонайменше 20 сценаріїв порад з унікальними ідентифікаторами', () => {
  assert.ok(RULES.length >= 20, `правил: ${RULES.length}`);
  assert.equal(new Set(RULES.map((r) => r.id)).size, RULES.length);
  for (const r of RULES) {
    assert.ok(r.author in AUTHORS);
    assert.ok(r.principle.length > 3);
  }
  assert.equal(RULES[RULES.length - 1].id, 'fallback');
});

test('завжди рівно одна порада, і вона детермінована', () => {
  const variants: Partial<MentorCtx>[] = [
    {}, { hasPlan: false, economy: 0 }, { hasData: false, gross: 0, spent: 0 }, { over: uah(100), spent: uah(750), economy: uah(-100) },
    { micro: uah(150), joy: uah(100) }, { saved: uah(200) }, { dataDays: 1 },
  ];
  for (const v of variants) {
    const a = pickAdvice(ctx(v), 5);
    const b = pickAdvice(ctx(v), 5);
    assert.deepEqual(a, b);
    assert.ok(RULES.some((r) => r.id === a.ruleId));
    assert.ok(a.why.length > 0 && a.step.length > 0);
  }
});

test('дефіцит на обовʼязкові платежі переважує всі інші сигнали', () => {
  const c = ctx({
    budget: { status: 'deficit', free: uah(-800), shortfall: uah(800), safe: 0, credits: true, nextIncome: '2026-11-10' },
    homeMeal: { cost: uah(65) }, canteen: uah(170), saved: uah(100),
  });
  assert.ok(matchingRules(c).includes('home-lunch'));
  const a = pickAdvice(c);
  assert.equal(a.ruleId, 'deficit');
  assert.equal(a.author, 'Бенджамін Грем');
  assert.equal(a.effectKop, uah(800));
});

test('домашній обід → принцип Баффетта з ефектом у гривнях', () => {
  const a = pickAdvice(ctx({ homeMeal: { cost: uah(65) }, canteen: uah(170), workdays30: 22 }));
  assert.equal(a.ruleId, 'home-lunch');
  assert.equal(a.authorGen, 'Воррена Баффетта');
  assert.equal(a.effectKop, uah(105) * 22);
  assert.match(a.why, /105/);
});

test('таксі значно понад транспортний план → порада про комфорт, час і гроші', () => {
  const c = ctx({ taxi: { cash: uah(220), trips: 1, minutes: 20 }, transportSpent: uah(250), transportPlan: uah(60), pub: { cost: uah(30), minutes: 50 }, hourValue: uah(100), spent: uah(840), gross: uah(840), over: uah(190), economy: uah(-190), overTransport: uah(190) });
  assert.ok(!matchingRules(c).includes('over-necessary'), 'перевитрату через таксі пояснює порада про таксі');
  const a = pickAdvice(c);
  assert.equal(a.ruleId, 'taxi-over');
  assert.equal(a.author, 'Раміт Сеті');
  const worth = pickAdvice({ ...c, hourValue: uah(500) });
  assert.equal(worth.ruleId, 'taxi-worth', 'коли час дорожчий за доплату — таксі виправдане');
  assert.equal(worth.tone, 'positive');
});

test('найважливіша порада не губиться серед дрібниць', () => {
  const c = ctx({ homeMeal: { cost: uah(65) }, canteen: uah(170), micro: uah(40), joy: uah(100), refunds: uah(20) });
  assert.ok(matchingRules(c).includes('joy-ok'));
  assert.ok(matchingRules(c).includes('refund'));
  assert.equal(pickAdvice(c).ruleId, 'home-lunch', 'обирається рішення з найбільшим впливом');
});

test('перевищення через необхідні покупки — спокійно й без осуду', () => {
  const a = pickAdvice(ctx({ spent: uah(900), gross: uah(900), over: uah(250), economy: uah(-250), nec: { required: uah(300), flexible: uah(600), optional: 0, unexpected: 0 } }));
  assert.equal(a.ruleId, 'over-necessary');
  assert.equal(a.tone, 'calm');
  assert.doesNotMatch(a.why, /погано|марнотрат|провалив/i);
});

test('мікровитрати в межах бюджету радості не засуджуються', () => {
  const a = pickAdvice(ctx({ micro: uah(90), joy: uah(150) }));
  assert.equal(a.ruleId, 'joy-ok');
  assert.equal(a.tone, 'positive');
});

test('мало даних — обережна порада без висновків', () => {
  const a = pickAdvice(ctx({ hasPlan: false, hasData: false, gross: 0, spent: 0, economy: 0, closed: false, dataDays: 0 }));
  assert.equal(a.ruleId, 'little-data');
  assert.equal(a.effectKop, null);
});

test('порада з реальних даних при завершенні дня', () => {
  let d = data({ days: { [TODAY]: plan(TODAY, STUDY) } });
  d.settings.canteenPrice = uah(170);
  d = addOp(d, { type: 'consumption', date: TODAY, amount: uah(65), category: 'lunch', meal: { kind: 'lunchBox', prepaid: true } }, TODAY).data;
  d = addOp(d, { type: 'expense', date: TODAY, amount: uah(280), category: 'groceries' }, TODAY).data;
  const r = closeDay(d, TODAY, TODAY, 42);
  assert.equal(r.value.ruleId, 'home-lunch');
  assert.equal(r.data.days[TODAY].closed, true);
  assert.equal(r.data.days[TODAY].advice?.createdAt, 42);
});
