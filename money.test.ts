import { test } from 'node:test';
import assert from 'node:assert/strict';
import { compact, count, fmt, NBSP, parseMoney, plural, roundDiv, toInput, uah, WORKDAYS } from './money.ts';

test('розбір сум: кома, крапка, пробіли, «грн»', () => {
  assert.equal(parseMoney('60'), 6000);
  assert.equal(parseMoney('60,5'), 6050);
  assert.equal(parseMoney('60.50'), 6050);
  assert.equal(parseMoney('1 234,56'), 123456);
  assert.equal(parseMoney('45 грн'), 4500);
  assert.equal(parseMoney(',5'), 50);
  assert.equal(parseMoney('12,345'), 1235, 'третій знак округлюється вгору');
  assert.equal(parseMoney('12,344'), 1234);
});

test('відʼємні й некоректні суми не приймаються', () => {
  assert.equal(parseMoney('-5'), null);
  assert.equal(parseMoney('abc'), null);
  assert.equal(parseMoney(''), null);
  assert.equal(parseMoney('1,2,3'), null);
  assert.equal(parseMoney('99999999'), null, 'понад 10 млн грн');
});

test('копійки не втрачаються: 0,1 + 0,2 = 0,3', () => {
  assert.equal(parseMoney('0,1')! + parseMoney('0,2')!, parseMoney('0,3'));
  let s = 0;
  for (let i = 0; i < 1000; i++) s += parseMoney('0,07')!;
  assert.equal(s, 7000);
});

test('форматування в гривнях', () => {
  assert.equal(fmt(uah(4180)), `4${NBSP}180${NBSP}грн`);
  assert.equal(fmt(12345), `123,45${NBSP}грн`);
  assert.equal(fmt(uah(-50)), `−50${NBSP}грн`);
  assert.equal(fmt(uah(50), { sign: true }), `+50${NBSP}грн`);
  assert.equal(fmt(0), `0${NBSP}грн`);
  assert.equal(fmt(12345, { currency: false, decimals: 'never' }), '123');
  assert.equal(toInput(6050), '60,5');
  assert.equal(toInput(6000), '60');
});

test('цілочисельне ділення з округленням', () => {
  assert.equal(roundDiv(7760, 3), 2587);
  assert.equal(roundDiv(5, 2), 3);
  assert.equal(roundDiv(-5, 2), -3);
  assert.equal(roundDiv(10, 0), 0);
});

test('українська множина', () => {
  assert.equal(plural(1, ['день', 'дні', 'днів']), 'день');
  assert.equal(plural(3, ['день', 'дні', 'днів']), 'дні');
  assert.equal(plural(5, ['день', 'дні', 'днів']), 'днів');
  assert.equal(plural(11, ['день', 'дні', 'днів']), 'днів');
  assert.equal(plural(21, ['день', 'дні', 'днів']), 'день');
  assert.equal(count(22, WORKDAYS), `22${NBSP}робочі дні`);
});

test('коротка форма для графіків', () => {
  assert.equal(compact(uah(4180)), `4,2${NBSP}тис.`);
  assert.equal(compact(uah(25080)), `25${NBSP}тис.`);
  assert.equal(compact(uah(850)), '850');
});
