import { test } from 'node:test';
import assert from 'node:assert/strict';
import { daysCSV, makeBackup, mergeData, opsCSV, validateBackup } from './backup.ts';
import { buildDemo } from './demo.ts';
import { data, exp, TODAY } from './fixtures.test.ts';

test('відновлення резервної копії: дані повертаються без втрат', () => {
  const demo = buildDemo(TODAY, 1_000);
  const file = JSON.parse(JSON.stringify(makeBackup(demo, true, 2_000)));
  const v = validateBackup(file);
  assert.ok(v.ok);
  if (!v.ok) return;
  assert.equal(v.demo, true);
  assert.deepEqual(v.warnings, []);
  assert.deepEqual(v.data.ops, demo.ops);
  assert.deepEqual(v.data.days, demo.days);
  assert.deepEqual(v.data.goals, demo.goals);
  assert.deepEqual(v.data.settings, demo.settings);
});

test('імпорт не дублює записи', () => {
  const cur = data({ ops: [exp(TODAY, 60, 'coffee', { id: 'a', updatedAt: 5 }), exp(TODAY, 30, 'transport', { id: 'b', updatedAt: 5 })] });
  const same = mergeData(cur, cur);
  assert.equal(same.stats.added, 0);
  assert.equal(same.stats.duplicates, 2);
  assert.equal(same.data.ops.length, 2);

  const newer = { ...cur.ops[0], amount: 7000, updatedAt: 9 };
  const copyOtherId = { ...cur.ops[1], id: 'другий-пристрій' };
  const fresh = exp(TODAY, 45, 'treats', { id: 'c' });
  const r = mergeData(cur, data({ ops: [newer, copyOtherId, fresh] }));
  assert.equal(r.stats.updated, 1, 'новіша версія того самого запису перемагає');
  assert.equal(r.stats.duplicates, 1, 'той самий запис з іншим id розпізнано за відбитком');
  assert.equal(r.stats.added, 1);
  assert.equal(r.data.ops.find((o) => o.id === 'a')!.amount, 7000);
});

test('пошкоджені файли відхиляються, пошкоджені записи — пропускаються', () => {
  assert.equal(validateBackup({ hello: 1 }).ok, false);
  assert.equal(validateBackup({ format: 'den-365-backup', version: 99, data: { ops: [] } }).ok, false);
  const v = validateBackup({
    format: 'den-365-backup', version: 1,
    data: { ops: [{ id: 'x', type: 'expense', date: TODAY, time: 1, amount: -100 }, { id: 'y', type: 'expense', date: TODAY, time: 1, amount: 100, category: 'coffee' }, { id: 'y', type: 'expense', date: TODAY, time: 1, amount: 100 }] },
  });
  assert.ok(v.ok);
  if (!v.ok) return;
  assert.equal(v.data.ops.length, 1);
  assert.equal(v.warnings.length, 2);
  assert.ok(v.data.categories.some((c) => c.id === 'bills'), 'вбудовані категорії відновлюються');
});

test('мітки часу в копії — київський час без ISO-рядків', () => {
  const json = JSON.stringify(makeBackup(data(), false, Date.UTC(2026, 10, 2, 15, 40)));
  assert.match(json, /"exportedAtKyiv":"2026-11-02 17:40"/);
  assert.doesNotMatch(json, /\d{2}:\d{2}:\d{2}\.\d{3}[A-Za-z]/);
});

test('CSV: крапка з комою, копійки через кому, екранування', () => {
  const d = data({ ops: [exp(TODAY, 60.5, 'coffee', { title: 'Кава "з собою"', note: '=СУМ(1)' })] });
  const csv = opsCSV(d);
  assert.ok(csv.startsWith('﻿'));
  assert.match(csv, /;60,50;/);
  assert.match(csv, /"Кава ""з собою"""/);
  assert.match(csv, /'=СУМ\(1\)/, 'формули в нотатках нейтралізуються');
  assert.match(daysCSV(d, TODAY), /2026-11-04;Сьогодні;;60,50;/);
});
