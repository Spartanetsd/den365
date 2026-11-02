import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addDays, dateKey, diffDays, fmtDate, isDateKey, msAtKyiv, startOfWeek, timeHM, weekday } from './time.ts';

declare const process: { env: Record<string, string | undefined> };

test('дата за Києвом не залежить від часового поясу пристрою', () => {
  const saved = process.env.TZ;
  try {
    process.env.TZ = 'America/Los_Angeles';
    // 22:30 UTC 1 листопада = 00:30 2 листопада за Києвом (зимовий час, UTC+2)
    assert.equal(dateKey(Date.UTC(2026, 10, 1, 22, 30)), '2026-11-02');
    assert.equal(dateKey(Date.UTC(2026, 10, 1, 21, 30)), '2026-11-01');
  } finally {
    if (saved === undefined) delete process.env.TZ;
    else process.env.TZ = saved;
  }
});

test('літній час: межа доби зсувається на годину', () => {
  // 21:30 UTC 1 липня = 00:30 2 липня за Києвом (UTC+3)
  assert.equal(dateKey(Date.UTC(2026, 6, 1, 21, 30)), '2026-07-02');
  assert.equal(dateKey(Date.UTC(2026, 6, 1, 20, 30)), '2026-07-01');
});

test('момент часу за київськими датою і годиною', () => {
  for (const d of ['2026-01-15', '2026-03-29', '2026-07-01', '2026-10-25', '2026-11-02']) {
    const ms = msAtKyiv(d, 12, 5);
    assert.equal(dateKey(ms), d);
    assert.equal(timeHM(ms), '12:05');
  }
  assert.equal(dateKey(msAtKyiv('2026-11-02', 0, 10)), '2026-11-02');
  assert.equal(dateKey(msAtKyiv('2026-11-02', 23, 50)), '2026-11-02');
});

test('арифметика дат через межі місяця, року й високосного лютого', () => {
  assert.equal(addDays('2026-12-31', 1), '2027-01-01');
  assert.equal(addDays('2028-02-28', 1), '2028-02-29');
  assert.equal(addDays('2026-03-01', -1), '2026-02-28');
  assert.equal(diffDays('2026-11-02', '2027-11-02'), 365);
  assert.equal(addDays('2026-03-28', 2), '2026-03-30', 'перехід на літній час не губить день');
});

test('дні тижня і перевірка дат', () => {
  assert.equal(weekday('2026-11-02'), 0, 'понеділок');
  assert.equal(weekday('2026-11-08'), 6, 'неділя');
  assert.equal(startOfWeek('2026-11-05'), '2026-11-02');
  assert.equal(isDateKey('2026-02-30'), false);
  assert.equal(isDateKey('2026-11-02'), true);
});

test('українські назви дат', () => {
  assert.equal(fmtDate('2026-11-02', { weekday: true }), 'понеділок, 2 листопада');
  assert.equal(fmtDate('2026-01-01', { year: true }), '1 січня 2026');
});
