// goals.ts — «Фінансова свобода»: цілі, прогрес, прогнозована дата (лише за достатніх підстав).
import type { Goal, Kop } from './types.ts';
import type { Index } from './ledger.ts';
import { addDays, diffDays } from './time.ts';

export function goalSaved(goal: Goal, ix: Index): Kop {
  let s = goal.start;
  for (const o of ix.all) {
    if (o.goalId !== goal.id) continue;
    if (o.type === 'saving') s += o.amount;
    else if (o.type === 'withdrawal') s -= o.amount;
  }
  return s;
}

export interface GoalView {
  goal: Goal;
  saved: Kop;
  left: Kop;
  pct: number;
  done: boolean;
  projection: { date: string; perDay: Kop; days: number } | null;
  reason: string | null;
}

/**
 * Прогнозована дата досягнення — лише якщо є ≥ 2 перекази на ціль і ≥ 14 днів від першого.
 * Інакше дата не показується, а причина пояснюється.
 */
export function goalView(goal: Goal, ix: Index, today: string): GoalView {
  const saved = goalSaved(goal, ix);
  const left = Math.max(0, goal.target - saved);
  const pct = goal.target > 0 ? Math.min(100, Math.floor((Math.max(0, saved) * 100) / goal.target)) : 0;
  const done = goal.target > 0 && saved >= goal.target;
  if (done) return { goal, saved, left: 0, pct: 100, done, projection: null, reason: null };
  const transfers = ix.all.filter((o) => o.goalId === goal.id && (o.type === 'saving' || o.type === 'withdrawal'));
  const ins = transfers.filter((o) => o.type === 'saving');
  if (ins.length < 2) return { goal, saved, left, pct, done, projection: null, reason: 'Дата зʼявиться після кількох переказів на цю ціль.' };
  const first = ins.reduce((m, o) => (o.date < m ? o.date : m), ins[0].date);
  const span = diffDays(first, today) + 1;
  if (span < 14) return { goal, saved, left, pct, done, projection: null, reason: 'Потрібно щонайменше два тижні спостережень, щоб оцінити темп.' };
  const net = transfers.reduce((s, o) => s + (o.type === 'saving' ? o.amount : -o.amount), 0);
  const perDay = Math.round(net / span);
  if (perDay <= 0) return { goal, saved, left, pct, done, projection: null, reason: 'Поточний темп не наближає до цілі.' };
  const days = Math.ceil(left / perDay);
  if (days > 3650) return { goal, saved, left, pct, done, projection: null, reason: 'За поточного темпу ціль далі ніж за 10 років.' };
  return { goal, saved, left, pct, done, projection: { date: addDays(today, days), perDay, days }, reason: null };
}

/** Як дата залежить від темпу: умовні варіанти 50, 100 і 200 грн на день. */
export function paceTable(left: Kop, today: string, paces: Kop[] = [5_000, 10_000, 20_000]): { perDay: Kop; days: number; date: string }[] {
  if (left <= 0) return [];
  return paces.map((p) => {
    const days = Math.ceil(left / p);
    return { perDay: p, days, date: addDays(today, days) };
  });
}

/** Накопичення без привʼязки до цілі. */
export function unassigned(total: Kop, views: readonly GoalView[]): Kop {
  return total - views.reduce((s, v) => s + Math.max(0, v.saved), 0);
}
