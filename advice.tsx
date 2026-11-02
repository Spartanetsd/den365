// advice.tsx — картка поради наставника і вечірній підсумок дня.
import { h, Fragment, cx } from './dom.ts';
import { icon } from './icons.ts';
import type { Advice } from './types.ts';
import { Btn, Group, Note, Row, openSheet } from './ui.tsx';
import { MoreForm, addedToast } from './forms.tsx';
import { catOf, derived, go } from './view.ts';
import { calcDay } from './ledger.ts';
import { budgetView } from './budget.ts';
import { bestAction, biggestCategory } from './insights.ts';
import { collectSamples, forecast, illustrate } from './forecast.ts';
import { fmt } from './money.ts';
import { fmtDate, relLabel } from './time.ts';

export function AdviceCard(p: { advice: Advice; compact?: boolean }): HTMLElement {
  const a = p.advice;
  return (
    <article class={cx('advice', `advice-${a.tone}`)} aria-label="Порада дня від фінансового наставника">
      <p class="advice-kicker">{icon('spark', 16)}Порада дня від фінансового наставника</p>
      <h3 class="advice-author">{a.author}</h3>
      <p class="advice-principle">{a.principle}</p>
      <p class="advice-source">Принцип за мотивами підходу {a.authorGen}</p>
      <div class="advice-block">
        <span class="advice-label">Чому саме сьогодні</span>
        <p>{a.why}</p>
      </div>
      <div class="advice-block">
        <span class="advice-label">Крок на завтра</span>
        <p>{a.step}</p>
      </div>
      {a.effect && !p.compact ? (
        <div class="advice-effect">
          {icon('sprout', 18)}
          <p>{a.effect}<span class="hint"> Це оцінка, а не гарантований результат.</span></p>
        </div>
      ) : null}
    </article>
  ) as HTMLElement;
}

/** Вечірній підсумок «Розумний вечір». */
export function openDaySummary(date: string): void {
  openSheet({
    title: 'Підсумок дня',
    tall: true,
    live: true,
    render: (close) => {
      const { data, ix, cats, today } = derived();
      const rec = data.days[date];
      const c = calcDay(ix, date, rec, cats);
      const big = biggestCategory(c, cats);
      const best = bestAction({ ix, days: data.days, cats, settings: data.settings, today, date, calc: c });
      const isToday = date === today;
      const bv = budgetView({ ix, settings: data.settings, days: data.days, today, todayCalc: calcDay(ix, today, data.days[today], cats), todayClosed: Boolean(data.days[today]?.closed) });
      const f = forecast(collectSamples(ix, data.days, cats, data.settings.calendar, today), data.settings.calendar, today, data.settings.forecastStayOnly);
      const base = f.scenarios.find((s) => s.id === 'base')!;
      const ill = c.economy && c.economy > 0 ? illustrate(c.economy, data.settings.calendar, today, data.settings.forecastStayOnly) : null;
      const rel = relLabel(date, today);
      const rows = Object.keys({ ...c.planByCat, ...c.byCat }).map((id) => ({ id, plan: c.planByCat[id] ?? 0, fact: c.byCat[id] ?? 0 }));
      return (
        <div class="stack">
          <p class="kicker">{rel ? `${rel}, ${fmtDate(date)}` : fmtDate(date, { weekday: true })}</p>
          <div class="summary-hero">
            <div>
              <span class="summary-k">Витрачено</span>
              <span class="summary-v num">{fmt(c.spent)}</span>
            </div>
            {c.plan ? (
              <div>
                <span class="summary-k">План</span>
                <span class="summary-v num muted">{fmt(c.planTotal)}</span>
              </div>
            ) : null}
            {c.plan ? (
              <div>
                <span class="summary-k">{c.over > 0 ? 'Понад план' : 'Економія'}</span>
                <span class={cx('summary-v num', c.over > 0 ? 'neg' : 'pos')}>{fmt(c.over > 0 ? c.over : c.economy ?? 0)}</span>
              </div>
            ) : null}
          </div>
          {c.plan ? (
            <Group title="План проти факту">
              {rows.map((r) => {
                const cat = catOf(cats, r.id);
                const d = r.plan - r.fact;
                return <Row icon={cat.icon} color={cat.color} title={cat.name} sub={`план ${fmt(r.plan)}`} value={fmt(r.fact)} right={<span class={cx('diff', d < 0 ? 'neg' : d > 0 ? 'pos' : 'muted')}>{d === 0 ? '0' : fmt(d, { sign: true })}</span>} />;
              })}
            </Group>
          ) : <Note tone="info">Цього дня плану не було — порівняння з планом немає.</Note>}
          <Group>
            {big ? <Row icon="bars" title="Найбільша категорія" value={`${big.name} · ${fmt(big.amount)}`} /> : null}
            {best ? <Row icon="star" title="Головна вдала дія" sub={best} /> : null}
            {c.saved !== 0 ? <Row icon="coins" title="Відкладено" value={fmt(c.saved)} valueTone="pos" /> : null}
            {c.foodCost > 0 ? <Row icon="utensils" title="Собівартість харчування" sub="Розрахунково, не рух грошей" value={fmt(c.foodCost)} /> : null}
            {bv.status === 'ok' ? <Row icon="shield" title="Доступний резерв" sub={`Вільні кошти після обовʼязкових платежів і потреб до ${fmtDate(bv.horizonEnd)}`} value={fmt(bv.free ?? 0)} />
              : bv.status === 'deficit' ? <Row icon="info" title="Резерв" sub="Бракує на обовʼязкові платежі" value={fmt(-bv.shortfall)} valueTone="neg" />
              : <Row icon="shield" title="Доступний резерв" sub="Вкажи залишок і доходи в налаштуваннях" value="—" />}
          </Group>
          <Group title="Оновлений прогноз накопичень">
            {f.enough
              ? <Row icon="sprout" title="30 днів, базовий сценарій" sub={`Днів спостережень: ${f.samples}`} value={fmt(base.totals[30])} valueTone={base.totals[30] >= 0 ? 'pos' : 'neg'} />
              : ill ? <Row icon="sprout" title="Якщо повторювати таку економію" sub={`У ${ill[30].work} робочих днів найближчого місяця, умовно`} value={fmt(ill[30].amount)} valueTone="pos" />
              : <Row icon="sprout" title="Прогноз" sub="Потрібно кілька днів із планом, щоб прогноз мав сенс" value="—" />}
          </Group>
          {rec?.advice ? <AdviceCard advice={rec.advice} /> : null}
          {isToday && bv.status === 'ok' && (bv.safe ?? 0) > 0 && c.saved <= 0 ? (
            <Btn kind="primary" size="lg" full icon="coins" onClick={() => openSaveSheet()}>Відкласти {fmt(bv.safe ?? 0)}</Btn>
          ) : null}
          <Btn kind="secondary" size="lg" full onClick={() => { close(); go('day'); }}>Готово</Btn>
        </div>
      );
    },
  });
}

export function openSaveSheet(): void {
  const { today } = derived();
  openSheet({
    title: 'Відкласти гроші',
    render: (close) => <MoreForm date={today} kind="saving" onDone={(op) => { close(); if (op) addedToast(op); }} />,
  });
}

