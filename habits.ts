// habits.ts — «Звички багатства». Лічильники накопичувальні: пропущений день нічого не обнуляє,
// тож застосунок не тисне й не змушує постійно його перевіряти.
import type { AppData } from './types.ts';
import { buildIndex, catMap, calcDay } from './ledger.ts';

export interface Habit {
  id: string;
  title: string;
  desc: string;
  icon: string;
  need: number;
  have: number;
  done: boolean;
  unlockedAt: number | null;
}

export function computeHabits(data: AppData, today: string): Habit[] {
  const ix = buildIndex(data.ops);
  const cats = catMap(data.categories);
  const logged = new Set<string>();
  for (const o of ix.all) if (o.date <= today) logged.add(o.date);
  let planned = 0;
  let reviewed = 0;
  let disciplined = 0;
  for (const rec of Object.values(data.days)) {
    if (rec.date > today) continue;
    if (rec.plan && rec.plan.length && rec.planSource !== 'auto') planned++;
    if (rec.closed) {
      reviewed++;
      if (rec.plan && rec.plan.length) {
        const c = calcDay(ix, rec.date, rec, cats);
        if (c.spent <= c.planTotal) disciplined++;
      }
    }
  }
  const saves = ix.all.filter((o) => o.type === 'saving').length;
  const list: Omit<Habit, 'done' | 'unlockedAt'>[] = [
    { id: 'log3', title: '3 дні записів', desc: 'Дні, коли ти вносив витрати. Не обовʼязково поспіль.', icon: 'pen', need: 3, have: logged.size },
    { id: 'plan7', title: '7 днів усвідомленого планування', desc: 'Дні з планом, складеним тобою або обраним шаблоном.', icon: 'list', need: 7, have: planned },
    { id: 'review14', title: '14 днів аналізу', desc: 'Вечори, коли ти підбивав підсумок дня.', icon: 'chart', need: 14, have: reviewed },
    { id: 'discipline30', title: '30 днів фінансової дисципліни', desc: 'Завершені дні, що вклалися в план.', icon: 'trophy', need: 30, have: disciplined },
    { id: 'firstSave', title: 'Перший переказ у накопичення', desc: 'Гроші, які реально відкладено.', icon: 'coins', need: 1, have: saves },
    { id: 'firstGoal', title: 'Перша фінансова ціль', desc: 'Ціль, до якої видно прогрес.', icon: 'target', need: 1, have: data.goals.length },
  ];
  return list.map((h) => {
    const done = h.have >= h.need;
    return { ...h, have: Math.min(h.have, h.need), done, unlockedAt: data.habits[h.id] ?? null };
  });
}

/** Звички, які щойно виконано, але ще не позначено. */
export function newlyDone(data: AppData, today: string): Habit[] {
  return computeHabits(data, today).filter((h) => h.done && !data.habits[h.id]);
}
