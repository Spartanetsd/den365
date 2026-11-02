// FutureScreen.tsx — «Майбутнє»: прогнози, симулятор «А що, якби?», цілі й накопичення, звички.
import { h, Fragment, cx, live } from './dom.ts';
import { icon } from './icons.ts';
import { Btn, Chip, Empty, Field, Group, MoneyInput, Note, Progress, Row, Seg, TextInput, Toggle, confirmSheet, openSheet, toast } from './ui.tsx';
import { MoreForm, OpRow, addedToast, openQuickAdd } from './forms.tsx';
import { openSaveSheet } from './advice.tsx';
import { saveList, saveSettings } from './store.ts';
import { derived, go, setUI, ui } from './view.ts';
import { calcDay, calcPeriod, savingsTotal } from './ledger.ts';
import { budgetView } from './budget.ts';
import { collectSamples, forecast, illustrate, savingsPace, SPANS, type Span } from './forecast.ts';
import { decisionImpacts, topCategories } from './insights.ts';
import { goalView, paceTable, unassigned, type GoalView } from './goals.ts';
import { computeHabits } from './habits.ts';
import { publicRef, taxiRef } from './transport.ts';
import { canteenRef, homeMealRef } from './meals.ts';
import { workdaysPerWeek } from './calendar.ts';
import { GOAL_PRESETS, OBLIGATION_KINDS, uid } from './defaults.ts';
import { count, DAYS, fmt, WORKDAYS } from './money.ts';
import { addDays, dateKey, fmtDate, startOfMonth } from './time.ts';
import type { Goal, Kop } from './types.ts';

const H_LABEL: Record<Span, string> = { 30: '30 днів', 182: '6 місяців', 365: '1 рік' };

export function FutureScreen(): Node {
  return (
    <div class="screen future">
      <header class="screen-head">
        <h1 class="h1">Майбутнє</h1>
        <p class="kicker">Прогнози — це оцінки, а не гарантований результат.</p>
      </header>
      <Seg value={ui.futureTab} label="Розділ" options={[
        { value: 'forecast', label: 'Прогноз' },
        { value: 'whatif', label: 'Що, якби' },
        { value: 'goals', label: 'Цілі' },
        { value: 'habits', label: 'Звички' },
      ]} onChange={(v) => setUI({ futureTab: v })} />
      {ui.futureTab === 'forecast' ? <Forecast /> : ui.futureTab === 'whatif' ? <WhatIf /> : ui.futureTab === 'goals' ? <Goals /> : <Habits />}
    </div>
  );
}

function Forecast(): Node {
  const { data, ix, cats, today } = derived();
  const s = data.settings;
  const samples = collectSamples(ix, data.days, cats, s.calendar, today);
  const f = forecast(samples, s.calendar, today, s.forecastStayOnly);
  const sc = f.scenarios.find((x) => x.id === ui.scenario) ?? f.scenarios[1];
  const saved = savingsTotal(ix, s.budget.savingsStart);
  const pace = savingsPace(ix, today);
  const last = [...samples].reverse()[0];
  const ill = last && last.economy > 0 ? illustrate(last.economy, s.calendar, today, s.forecastStayOnly) : null;
  const top = topCategories(calcPeriod(ix, data.days, cats, addDays(today, -29), today, today), cats);
  const impacts = decisionImpacts(ix, data.days, cats, s, today);
  const goals = data.goals.map((g) => goalView(g, ix, today));

  return (
    <div class="stack-lg">
      {f.enough ? (
        <>
          <Seg small value={ui.scenario} label="Сценарій" options={[
            { value: 'conservative', label: 'Консервативний' },
            { value: 'base', label: 'Базовий' },
            { value: 'optimistic', label: 'Оптимістичний' },
          ]} onChange={(v) => setUI({ scenario: v })} />
          <p class="hint">{sc.note}</p>
          <section class="horizons">
            {SPANS.map((hz) => (
              <div class="horizon">
                <span class="horizon-k">{H_LABEL[hz]}</span>
                <span class={cx('horizon-v num', sc.totals[hz] < 0 ? 'neg' : 'pos')}>{fmt(sc.totals[hz], { decimals: 'never' })}</span>
                <span class="horizon-s">{count(f.counts[hz].work, WORKDAYS)}{sc.perOff ? `, ${f.counts[hz].off} вихідних` : ''}</span>
              </div>
            ))}
          </section>
          <p class="hint">Потенційна економія відносно плану: {fmt(sc.perWork)} у робочий день{sc.perOff ? `, ${fmt(sc.perOff)} у вихідний` : ''}. Спостережень: {f.samples} ({f.work} робочих, {f.off} вихідних). Дотримання плану: {f.adherence ?? 0}% днів.</p>
        </>
      ) : (
        <>
          <Note tone="info">Для прогнозу потрібно щонайменше 5 днів із планом і записами (з них 3 робочі). Зараз: {f.samples}. Поки — лише умовна ілюстрація, а не прогноз.</Note>
          {ill ? (
            <Group title={`Якщо повторювати економію ${fmt(last!.economy)} у робочі дні`} foot="Умовний розрахунок за твоїм календарем робочих днів. Один день — не статистика.">
              {SPANS.map((hz) => <Row icon="sprout" title={H_LABEL[hz]} sub={count(ill[hz].work, WORKDAYS)} value={fmt(ill[hz].amount)} valueTone="pos" />)}
            </Group>
          ) : null}
        </>
      )}

      {s.calendar.stays.length ? (
        <div class="toggle-row card-row">
          <span>Рахувати лише дні перебування в Дніпрі<small>{s.calendar.stays.map((x) => `${fmtDate(x.from)} — ${fmtDate(x.to)}`).join('; ')}</small></span>
          <Toggle checked={s.forecastStayOnly} label="Лише дні перебування" onChange={(v) => saveSettings((st) => ({ ...st, forecastStayOnly: v }))} />
        </div>
      ) : null}

      <Group title="Накопичення">
        <Row icon="coins" title="Реально накопичено" sub="Стартова подушка + фактичні перекази" value={fmt(saved)} valueTone="pos" />
        {f.enough ? <Row icon="sprout" title="Якщо відкладати всю економію" sub={`${sc.label.toLowerCase()} сценарій, 1 рік`} value={fmt(saved + Math.max(0, sc.totals[365]))} /> : null}
        {pace ? <Row icon="repeat" title="За темпом реальних переказів" sub={`${fmt(pace.perDay)} на день; через рік`} value={fmt(saved + pace.perDay * 365)} /> : <Row icon="repeat" title="Темп реальних переказів" sub="Зʼявиться після кількох переказів упродовж двох тижнів" value="—" />}
        {goals.length ? goals.slice(0, 3).map((g) => <Row icon="target" title={g.goal.name} sub={g.done ? 'Досягнуто' : g.projection ? `орієнтовно до ${fmtDate(g.projection.date, { year: true })}` : 'дата — коли буде достатньо даних'} value={`${g.pct}%`} onClick={() => setUI({ futureTab: 'goals' })} chevron />) : null}
        <div class="group-actions"><Btn kind="primary" icon="coins" onClick={() => openSaveSheet()}>Відкласти гроші</Btn></div>
      </Group>

      <BudgetCard />

      {top.length ? (
        <Group title="На що найбільше витрачаються гроші" foot="Останні 30 днів.">
          {top.map((t) => <Row icon="bars" title={t.name} sub={`${t.share}% витрат`} value={fmt(t.amount)} />)}
        </Group>
      ) : null}

      {impacts.length ? (
        <Group title="Рішення з найбільшим впливом" foot="Останні 30 днів. Скільки коштували окремі звички порівняно з дешевшою альтернативою.">
          {impacts.map((i) => <Row icon="bulb" title={i.label} sub={i.detail} value={fmt(i.amount)} />)}
          <div class="group-actions"><Btn kind="tinted" icon="spark" onClick={() => setUI({ futureTab: 'whatif' })}>Змоделювати зміни</Btn></div>
        </Group>
      ) : null}
    </div>
  );
}

function BudgetCard(): Node {
  const { data, ix, cats, today } = derived();
  const s = data.settings;
  const c = calcDay(ix, today, data.days[today], cats);
  const bv = budgetView({ ix, settings: s, days: data.days, today, todayCalc: c, todayClosed: Boolean(data.days[today]?.closed) });
  const month = calcPeriod(ix, data.days, cats, startOfMonth(today), today, today);
  const flex = [
    { label: 'Транспорт', limit: s.budget.flexTransport, spent: month.byCat.transport ?? 0 },
    { label: 'Продукти', limit: s.budget.flexGroceries, spent: month.byCat.groceries ?? 0 },
  ].filter((f): f is { label: string; limit: number; spent: number } => f.limit !== null && f.limit > 0);
  if (bv.status === 'unknown') {
    return (
      <Group title="Особистий бюджет">
        <Empty icon="wallet" title="Бюджет не налаштовано" text="Вкажи доступні кошти, доходи й обовʼязкові платежі — і застосунок порахує, скільки можна безпечно відкласти." action={<Btn kind="primary" onClick={() => go('settings', { settingsPage: 'budget' })}>Налаштувати</Btn>} />
      </Group>
    ) as HTMLElement;
  }
  return (
    <Group title="Особистий бюджет" foot={bv.noIncome ? 'Доходи не вказано — резерв рахується на 30 днів наперед.' : `Майбутній дохід ${fmtDate(bv.nextIncome!.date)} (${fmt(bv.nextIncome!.amount)}) ще не враховано в доступних коштах.`}>
      <Row icon="wallet" title="Доступно зараз" value={fmt(bv.available ?? 0)} />
      {bv.obligations.map((o) => (
        <Row icon="doc" title={o.name} sub={`${OBLIGATION_KINDS[o.kind]}, ${fmtDate(o.date)}${o.overdue ? ' — прострочено' : ''}`} value={o.paid ? 'сплачено' : `−${fmt(o.amount)}`} valueTone={o.paid ? 'muted' : o.overdue ? 'neg' : ''}
          onClick={o.paid ? undefined : () => openQuickAdd({ date: today, category: 'bills' })} />
      ))}
      <Row icon="calendar" title="Щоденні потреби" sub={`${count(bv.dailyDays, DAYS)} × ${fmt(bv.need.amount)}${bv.need.source === 'history' ? ' (твоя медіана)' : bv.need.source === 'none' ? ' (не вказано)' : ''}${bv.reserveToday ? ` + сьогодні ${fmt(bv.reserveToday)}` : ''}`} value={`−${fmt(bv.reserveDaily + bv.reserveToday)}`} />
      {bv.buffer ? <Row icon="shield" title="Запас безпеки" value={`−${fmt(bv.buffer)}`} /> : null}
      <Row icon="coins" title={bv.status === 'deficit' ? 'Бракує' : 'Вільні кошти'} value={fmt(bv.free ?? 0)} valueTone={bv.status === 'deficit' ? 'neg' : 'pos'} class="row-strong" />
      {flex.length ? (
        <div class="group-note">
          <p class="field-label">Гнучкі бюджети цього місяця</p>
          {flex.map((f) => (
            <div class="flex-budget">
              <div class="kv"><span>{f.label}</span><b class="num">{fmt(f.spent, { decimals: 'never' })} з {fmt(f.limit, { decimals: 'never' })}</b></div>
              <Progress value={f.spent / f.limit} tone={f.spent > f.limit ? 'over' : 'accent'} label={f.label} />
            </div>
          ))}
        </div>
      ) : null}
      {bv.status === 'deficit' ? <div class="group-note"><Note tone="warn">Спершу — обовʼязкові платежі. Поки бракує {fmt(bv.shortfall)}, переказувати гроші в накопичення не варто.</Note></div> : null}
    </Group>
  ) as HTMLElement;
}

function WhatIf(): Node {
  const { data, ix, cats, today } = derived();
  const s = data.settings;
  const w = ui.whatIf;
  const taxi = taxiRef(ix, today);
  const pub = publicRef(ix, s, today);
  const canteen = canteenRef(ix, s, today);
  const home = homeMealRef(ix, today);
  const coffee = data.micro.find((m) => m.id === 'q-coffee')?.price ?? null;
  const p30 = calcPeriod(ix, data.days, cats, addDays(today, -29), today, today);
  const treatsPerDay = p30.dataDays ? Math.round((p30.byCat.treats ?? 0) / p30.dataDays) : 0;
  const wpw = workdaysPerWeek(s.calendar);

  const res = live(() => {
    const weekly =
      (taxi && pub ? Math.max(0, taxi.cost - pub.cost) * w.taxi : 0) +
      (canteen && home !== null ? Math.max(0, canteen.amount - home) * w.homeLunch : 0) +
      (coffee ? coffee * w.coffee * wpw : 0) +
      Math.round((treatsPerDay * 7 * w.treatsPct) / 100);
    const m = Math.round((weekly * 30) / 7);
    const hy = Math.round((weekly * 182) / 7);
    const y = Math.round((weekly * 365) / 7);
    return (
      <section class="whatif-res" aria-live="polite">
        <span class="whatif-k">Модельована економія</span>
        <div class="horizons">
          <div class="horizon"><span class="horizon-k">Місяць</span><span class="horizon-v num pos">{fmt(m, { decimals: 'never' })}</span></div>
          <div class="horizon"><span class="horizon-k">Пів року</span><span class="horizon-v num pos">{fmt(hy, { decimals: 'never' })}</span></div>
          <div class="horizon"><span class="horizon-k">Рік</span><span class="horizon-v num pos">{fmt(y, { decimals: 'never' })}</span></div>
        </div>
        <p class="hint">Це альтернативні витрати за моделлю, а не фактичні гроші. Вони стануть заощадженнями, лише якщо ти їх відкладеш.</p>
      </section>
    );
  });

  const slider = (label: string, sub: string, key: keyof typeof w, max: number, step: number, unit: (v: number) => string, ok: boolean, need: string) => {
    const valueEl = <b class="num">{unit(w[key])}</b> as HTMLElement;
    return (
      <div class={cx('slider', !ok && 'disabled')}>
        <div class="slider-top"><span>{label}</span>{valueEl}</div>
        <span class="hint">{ok ? sub : need}</span>
        <input type="range" min="0" max={String(max)} step={String(step)} value={String(w[key])} disabled={!ok} aria-label={label}
          onInput={(e: Event) => { w[key] = Number((e.target as HTMLInputElement).value); valueEl.textContent = unit(w[key]); res.refresh(); }} />
      </div>
    );
  };

  return (
    <div class="stack-lg">
      <p class="lead">Зміни звичку — і подивись, як це вплине на місяць, пів року й рік. Розрахунок спирається на твої власні дані.</p>
      {res.el}
      <Group>
        <div class="sliders">
          {slider('Автобус замість таксі', taxi && pub ? `Таксі ≈ ${fmt(taxi.cost, { decimals: 'never' })}, громадський транспорт ≈ ${fmt(pub.cost, { decimals: 'never' })} за поїздку` : '', 'taxi', 10, 1, (v) => `${v} на тиждень`, Boolean(taxi && pub), 'Потрібні хоча б одна поїздка таксі та дві громадським транспортом (або типова ціна в налаштуваннях).')}
          {slider('Домашній обід замість їдальні', canteen && home !== null ? `Їдальня ≈ ${fmt(canteen.amount, { decimals: 'never' })}, домашній ≈ ${fmt(home, { decimals: 'never' })}` : '', 'homeLunch', 7, 1, (v) => `${v} на тиждень`, Boolean(canteen && home !== null), 'Потрібні ціна обіду в їдальні та щонайменше два записи домашнього обіду.')}
          {slider('Менше кави', coffee ? `Типова кава — ${fmt(coffee)}, ${wpw} робочих днів на тиждень` : '', 'coffee', 3, 1, (v) => (v ? `−${v} на день` : 'як є'), Boolean(coffee), 'Вкажи типову ціну кави в налаштуваннях швидких кнопок.')}
          {slider('Скоротити смаколики', treatsPerDay ? `Зараз ≈ ${fmt(treatsPerDay, { decimals: 'never' })} на день із даними` : '', 'treatsPct', 100, 10, (v) => `${v}%`, treatsPerDay > 0, 'Поки немає записів смаколиків за 30 днів.')}
        </div>
      </Group>
      <Btn kind="secondary" full icon="smile" onClick={() => { ui.whatIf = { taxi: 0, homeLunch: 0, coffee: 0, treatsPct: 0 }; setUI({}); toast('Комфорт без змін — теж свідомий вибір.'); }}>Залишити поточний комфорт</Btn>
    </div>
  );
}

function Goals(): Node {
  const { data, ix, today } = derived();
  const total = savingsTotal(ix, data.settings.budget.savingsStart);
  const views = data.goals.map((g) => goalView(g, ix, today));
  const free = unassigned(total, views);
  const monthlyGoal = data.settings.budget.monthlyGoal;
  const monthSaved = ix.all.filter((o) => o.date >= startOfMonth(today) && o.date <= today).reduce((s, o) => s + (o.type === 'saving' ? o.amount : o.type === 'withdrawal' ? -o.amount : 0), 0);
  const transfers = ix.all.filter((o) => o.type === 'saving' || o.type === 'withdrawal').sort((a, b) => (a.date === b.date ? b.time - a.time : a.date < b.date ? 1 : -1)).slice(0, 12);
  return (
    <div class="stack-lg">
      <section class="savings-hero">
        <span class="hero-k">Реально накопичено</span>
        <span class="hero-big num">{fmt(total)}</span>
        <span class="hero-sub">{data.settings.budget.savingsStart ? `з них стартова подушка ${fmt(data.settings.budget.savingsStart)}` : 'лише фактичні перекази'}</span>
        {monthlyGoal ? (
          <div class="month-goal">
            <div class="kv"><span>Цього місяця відкладено</span><b class="num">{fmt(monthSaved)} з {fmt(monthlyGoal)}</b></div>
            <Progress value={monthSaved / monthlyGoal} tone={monthSaved >= monthlyGoal ? 'ok' : 'accent'} label="Місячна ціль заощаджень" />
          </div>
        ) : null}
        <div class="btn-row">
          <Btn kind="primary" icon="coins" onClick={() => openSaveSheet()}>Відкласти</Btn>
          <Btn kind="secondary" icon="arrowUp" onClick={() => openSheet({ title: 'Узяти з накопичень', render: (close) => <MoreForm date={today} kind="withdrawal" onDone={(op) => { close(); if (op) addedToast(op); }} /> })}>Узяти</Btn>
        </div>
      </section>

      {views.length ? (
        <Group title="Фінансові цілі">
          {views.map((v) => <GoalRow v={v} />)}
          {free > 0 && views.length ? <Row icon="coins" title="Без привʼязки до цілі" value={fmt(free)} valueTone="muted" /> : null}
        </Group>
      ) : <Empty icon="target" title="Цілей поки немає" text="Резерв, подушка, відпустка чи власна мета — із прогресом і дат, коли для неї є підстави." />}

      <Group title="Нова ціль">
        <div class="chips chips-wrap">
          {GOAL_PRESETS.map((p) => <Chip icon={p.icon} onClick={() => openGoalEditor(null, p)}>{p.name}{p.target ? ` · ${fmt(p.target, { decimals: 'never' })}` : ''}</Chip>)}
        </div>
      </Group>

      {transfers.length ? (
        <Group title="Останні перекази">
          {transfers.map((o) => <OpRow op={o} showDate />)}
        </Group>
      ) : null}
    </div>
  );
}

function GoalRow(p: { v: GoalView }): HTMLElement {
  const { v } = p;
  return (
    <button type="button" class="goal" onClick={() => openGoalSheet(v.goal.id)}>
      <span class="goal-top"><b>{v.goal.name}</b><span class="num">{fmt(v.saved)} / {fmt(v.goal.target)}</span></span>
      <Progress value={v.pct / 100} tone={v.done ? 'ok' : 'accent'} label={`Прогрес: ${v.pct}%`} />
      <span class="goal-sub">{v.done ? 'Ціль досягнуто' : v.projection ? `Орієнтовно ${fmtDate(v.projection.date, { year: true })} — за темпом ${fmt(v.projection.perDay)} на день` : v.reason}</span>
    </button>
  ) as HTMLElement;
}

function openGoalSheet(id: string): void {
  openSheet({
    title: 'Ціль',
    live: true,
    render: (close) => {
      const { data, ix, today } = derived();
      const g = data.goals.find((x) => x.id === id);
      if (!g) return <p class="hint">Ціль видалено.</p>;
      const v = goalView(g, ix, today);
      const pace = paceTable(v.left, today);
      return (
        <div class="stack">
          <div class="goal-head">
            <h3 class="h2">{g.name}</h3>
            <span class="num big">{v.pct}%</span>
          </div>
          <Progress value={v.pct / 100} tone={v.done ? 'ok' : 'accent'} />
          <Group>
            <Row title="Накопичено" value={fmt(v.saved)} />
            <Row title="Ціль" value={fmt(g.target)} />
            <Row title="Залишилось" value={fmt(v.left)} />
            <Row title="Прогнозована дата" sub={v.projection ? `За темпом ${fmt(v.projection.perDay)} на день` : v.reason ?? ''} value={v.projection ? fmtDate(v.projection.date, { year: true }) : '—'} />
          </Group>
          {pace.length ? (
            <Group title="Як дата залежить від темпу" foot="Умовні варіанти, не прогноз.">
              {pace.map((x) => <Row title={`${fmt(x.perDay)} на день`} sub={count(x.days, DAYS)} value={fmtDate(x.date, { year: true })} />)}
            </Group>
          ) : null}
          <Btn kind="primary" size="lg" full icon="coins" onClick={() => openSheet({ title: `Відкласти на «${g.name}»`, render: (c2) => <SaveToGoal goalId={g.id} close={c2} /> })}>Відкласти на цю ціль</Btn>
          <Btn kind="ghost" full icon="edit" onClick={() => { close(); openGoalEditor(g, null); }}>Змінити ціль</Btn>
        </div>
      );
    },
  });
}

function SaveToGoal(p: { goalId: string; close: () => void }): HTMLElement {
  const { today } = derived();
  return MoreForm({ date: today, kind: 'saving', goalId: p.goalId, onDone: (op) => { p.close(); if (op) addedToast(op); } });
}

function openGoalEditor(goal: Goal | null, preset: (typeof GOAL_PRESETS)[number] | null): void {
  const { data } = derived();
  const draft = {
    name: goal?.name ?? preset?.name ?? '',
    target: (goal?.target ?? preset?.target ?? null) as Kop | null,
    start: (goal?.start ?? 0) as Kop | null,
  };
  openSheet({
    title: goal ? 'Змінити ціль' : 'Нова ціль',
    render: (close) => (
      <div class="stack">
        <Field label="Назва"><TextInput value={draft.name} placeholder="Наприклад: Відпустка" onChange={(v) => { draft.name = v; }} /></Field>
        <Field label="Сума цілі"><MoneyInput value={draft.target} onChange={(v) => { draft.target = v; }} /></Field>
        <Field label="Уже є на цю ціль" hint="Необовʼязково. Наприклад, частина подушки, відкладена раніше."><MoneyInput value={draft.start} onChange={(v) => { draft.start = v; }} /></Field>
        <Btn kind="primary" size="lg" full onClick={() => {
          if (!draft.name.trim()) return toast('Вкажи назву цілі.');
          if (!draft.target || draft.target <= 0) return toast('Вкажи суму цілі.');
          const next: Goal = { id: goal?.id ?? uid('goal-'), name: draft.name.trim(), kind: goal?.kind ?? preset?.kind ?? 'custom', target: draft.target, start: draft.start ?? 0, createdAt: goal?.createdAt ?? Date.now() };
          saveList('goals', goal ? data.goals.map((g) => (g.id === goal.id ? next : g)) : [...data.goals, next]);
          close();
          toast(goal ? 'Ціль оновлено.' : `Ціль «${next.name}» створено.`);
        }}>Зберегти</Btn>
        {goal ? (
          <Btn kind="ghost" full icon="trash" onClick={() => confirmSheet({
            title: 'Видалити ціль?',
            text: 'Перекази залишаться в накопиченнях, лише без привʼязки до цієї цілі.',
            confirm: 'Видалити ціль',
            danger: true,
            onConfirm: () => { saveList('goals', data.goals.filter((g) => g.id !== goal.id)); close(); },
          })}>Видалити ціль</Btn>
        ) : null}
      </div>
    ),
  });
}

function Habits(): Node {
  const { data, today } = derived();
  const list = computeHabits(data, today);
  return (
    <div class="stack-lg">
      <p class="lead">Маленькі звички, з яких складається фінансова дисципліна. Лічильники не обнуляються: пропущений день нічого не забирає.</p>
      <div class="habits">
        {list.map((hb) => (
          <div class={cx('habit', hb.done && 'done')}>
            <span class="habit-icon">{icon(hb.done ? 'trophy' : hb.icon, 22)}</span>
            <div class="habit-main">
              <b>{hb.title}</b>
              <span class="hint">{hb.desc}</span>
              <Progress value={hb.have / hb.need} tone={hb.done ? 'ok' : 'accent'} label={hb.title} />
              <span class="habit-count num">{hb.have} / {hb.need}{hb.done && hb.unlockedAt ? `, ${fmtDate(dateKey(hb.unlockedAt))}` : ''}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
