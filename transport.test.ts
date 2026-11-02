import { test } from 'node:test';
import assert from 'node:assert/strict';
import { carCost, comfortPrice, fuelCost, tripAmounts } from './transport.ts';
import { validateOp } from './actions.ts';
import { uah } from './money.ts';
import { TODAY } from './fixtures.test.ts';

test('вартість поїздки автомобілем: (км × л/100 км / 100) × ціна', () => {
  assert.equal(fuelCost(12, 8, uah(60)), uah(57.6));
  assert.equal(fuelCost(12.5, 7.8, 5899), 5752, '57,51525 грн → 57,52 грн');
  assert.equal(fuelCost(0, 8, uah(60)), 0);
  const car = { km: 12, per100: 8, fuelPrice: uah(60), parking: uah(20), wearPerKm: 50, other: 0, fuelPrepaid: false };
  const c = carCost(car);
  assert.equal(c.cash, uah(77.6));
  assert.equal(c.wear, uah(6));
  assert.equal(c.estimate, uah(6), 'знос — розрахункова, а не грошова частина');
  const prepaid = carCost({ ...car, fuelPrepaid: true });
  assert.equal(prepaid.cash, uah(20), 'передплачене пальне не є новим рухом грошей');
  assert.equal(prepaid.estimate, uah(63.6));
  assert.equal(prepaid.total, c.total);
});

test('повна вартість і частка на людину', () => {
  const shared = tripAmounts({ mode: 'taxi', cost: uah(300), passengers: 3, split: true });
  assert.equal(shared.full, uah(300));
  assert.equal(shared.cash, uah(100));
  const notShared = tripAmounts({ mode: 'taxi', cost: uah(300), passengers: 3, split: false });
  assert.equal(notShared.cash, uah(300));
  const car = tripAmounts({ mode: 'car', cost: 0, passengers: 3, split: true, car: { km: 12, per100: 8, fuelPrice: uah(60), parking: uah(20), wearPerKm: 0, other: 0, fuelPrepaid: false } });
  assert.equal(car.full, uah(77.6));
  assert.equal(car.cash, 2587, '77,60 / 3 = 25,87 грн');
  const walk = tripAmounts({ mode: 'walk', cost: uah(50), passengers: 1, split: false });
  assert.equal(walk.cash, 0);
});

test('порівняння таксі й автобуса: ціна комфорту', () => {
  const taxi = { cost: uah(180), minutes: 20 };
  const bus = { cost: uah(30), minutes: 55 };
  const cp = comfortPrice(taxi, bus, uah(200));
  assert.equal(cp.extra, uah(150));
  assert.equal(cp.saved, 35);
  assert.equal(cp.timeValue, 11667, '35 хв × 200 грн/год');
  assert.equal(cp.pureComfort, uah(150) - 11667);
  assert.equal(cp.verdict, 'comfortPremium');
  assert.equal(comfortPrice(taxi, bus, uah(300)).verdict, 'timeWorthIt', 'дорогий час виправдовує таксі');
  assert.equal(comfortPrice(taxi, bus, null).verdict, 'unknown', 'без цінності години висновку немає');
  assert.equal(comfortPrice({ cost: uah(180), minutes: 60 }, bus, uah(200)).verdict, 'noTimeGain');
  assert.equal(comfortPrice({ cost: uah(25), minutes: 40 }, bus, uah(200)).verdict, 'cheaperFaster');
});

test('пішохідна поїздка з нульовою сумою — допустимий запис', () => {
  const walk = { id: 'w', type: 'expense' as const, date: TODAY, time: 1, updatedAt: 1, amount: 0, category: 'transport', trip: { mode: 'walk' as const, dir: 'there' as const, route: '', minutes: 25, wait: null, comfort: 4, passengers: 1, split: false, full: 0 } };
  assert.equal(validateOp(walk), null);
});
