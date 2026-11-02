import { test } from 'node:test';
import assert from 'node:assert/strict';
import { collectSamples, forecast, illustrate, type Sample } from './forecast.ts';
import { countDays, isWorkday } from './calendar.ts';
import { buildIndex, catMap } from './ledger.ts';
import { CATEGORIES, defaultSettings } from './defaults.ts';
import { uah } from './money.ts';
import { addDays } from './time.ts';
import { exp, plan, STUDY, TODAY } from './fixtures.test.ts';

const cal = defaultSettings().calendar;

function sample(date: string, hryvnias: number): Sample {
  return { date, economy: uah(hryvnias), plan: uah(650), work: isWorkday(date, cal), stay: false };
}

function independentWorkdays(n: number): number {
  let w = 0;
  for (let i = 1; i <= n; i++) if (isWorkday(addDays(TODAY, i), cal)) w++;
  return w;
}

test('консервативний прогноз — економія лише в робочі дні за фактичним календарем', () => {
  const samples: Sample[] = [];
  for (let i = 1; samples.length < 8; i++) {
    const d = addDays(TODAY, -i);
    samples.push(sample(d, isWorkday(d, cal) ? 190 : 300));
  }
  const f = forecast(samples, cal, TODAY);
  assert.equal(f.enough, true);
  const cons = f.scenarios.find((s) => s.id === 'conservative')!;
  const base = f.scenarios.find((s) => s.id === 'base')!;
  assert.equal(f.counts[30].work, independentWorkdays(30));
  assert.equal(cons.totals[30], uah(190) * independentWorkdays(30), 'вихідні з економією не додаються');
  assert.equal(cons.totals[365], uah(190) * independentWorkdays(365));
  assert.equal(base.perOff, 0, 'для вихідних замало спостережень — враховано 0');
  const opt = f.scenarios.find((s) => s.id === 'optimistic')!;
  assert.ok(cons.totals[182] <= base.totals[182] && base.totals[182] <= opt.totals[182]);
});

test('вихідні враховуються окремо, коли спостережень досить', () => {
  const samples: Sample[] = [];
  for (let i = 1; i <= 21; i++) {
    const d = addDays(TODAY, -i);
    samples.push(sample(d, isWorkday(d, cal) ? 100 : -50));
  }
  const f = forecast(samples, cal, TODAY);
  const base = f.scenarios.find((s) => s.id === 'base')!;
  const cons = f.scenarios.find((s) => s.id === 'conservative')!;
  assert.equal(base.perOff, uah(-50));
  assert.equal(cons.perOff, uah(-50), 'перевитрати вихідних не ховаються');
  assert.equal(base.totals[30], uah(100) * f.counts[30].work + uah(-50) * f.counts[30].off);
});

test('мало спостережень — прогнозу немає, лише ілюстрація', () => {
  const f = forecast([sample(addDays(TODAY, -1), 190), sample(addDays(TODAY, -2), 190)], cal, TODAY);
  assert.equal(f.enough, false);
  const ill = illustrate(uah(190), cal, TODAY);
  assert.equal(ill[30].amount, uah(190) * countDays(addDays(TODAY, 1), 30, cal).work);
  assert.equal(ill[365].work, independentWorkdays(365));
});

test('пропущені дні не стають нульовими спостереженнями', () => {
  const d1 = addDays(TODAY, -1);
  const d2 = addDays(TODAY, -2);
  const d3 = addDays(TODAY, -3);
  const days = { [d1]: plan(d1, STUDY), [d2]: plan(d2, STUDY, true), [d3]: plan(d3, STUDY) };
  const ix = buildIndex([exp(d1, 460, 'groceries')]);
  const s = collectSamples(ix, days, catMap(CATEGORIES), cal, TODAY);
  assert.deepEqual(s.map((x) => x.date).sort(), [d2, d1].sort(), 'd3 без записів і не завершений — не спостереження');
  assert.equal(s.find((x) => x.date === d2)!.economy, uah(650), 'завершений день без витрат — реальна нульова витрата');
});

test('винятки календаря: субота як робочий день', () => {
  const sat = '2026-11-07';
  const c2 = { ...cal, overrides: { [sat]: 'work' as const } };
  assert.equal(isWorkday(sat, cal), false);
  assert.equal(isWorkday(sat, c2), true);
  assert.equal(countDays('2026-11-02', 7, c2).work, 6);
});

test('прогноз лише для днів перебування в Дніпрі', () => {
  const c2 = { ...cal, stays: [{ id: 's', from: addDays(TODAY, 1), to: addDays(TODAY, 14), label: 'Дніпро' }] };
  const samples = Array.from({ length: 10 }, (_, i) => ({ ...sample(addDays(TODAY, -i - 1), 100), stay: true }));
  const f = forecast(samples, c2, TODAY, true);
  assert.equal(f.counts[365].work + f.counts[365].off, 14);
});
