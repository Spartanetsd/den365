// DayScreen.tsx — головний екран «Мій день»: витрачено, залишок, шлях від економії до накопичень, план і факт.
import { h, Fragment, cx } from './dom.ts';
import { icon } from './icons.ts';
import { Btn, Chip, Group, IconBtn, InfoTip, Note, Num, Progress, Ring, Row, confirmSheet } from './ui.tsx';
import { BarChart, type Bar } from './charts.tsx';
import { OpRow, openOpEditor, openQuickAdd, quickMicro, recordPlanLine } from './forms.tsx';
import { AdviceCard, openDaySummary, openSaveSheet } from './advice.tsx';
import { TemplateChips, openPlanEditor } from './plan.tsx';
import { closeDayAction, reopenDayAction } from './store.ts';
import { catOf, derived, go, setUI, ui } from './view.ts';
import { calcDay, dayStatus, planLineFacts, type DayCalc } from './ledger.ts';
import { budgetView, type BudgetView } from './budget.ts';
import { illustrate } from './forecast.ts';
import { priceOfDecision } from './insights.ts';
import { goalView } from './goals.ts';
import { fmt } from './money.ts';
import { WEEKDAYS_SHORT, addDays, cap, fmtDate, relLabel, weekday, WEEKDAYS } from './time.ts';
import type { AppData } from './types.ts';

export function currentDayDate(): string {
  const { today } = derived();
  return ui.dayDate && ui.dayDate !== today ? ui.dayDate : today;
}

export function DayScreen(): Node {
  const { data, ix, cats, today, state } = derived();
  const date = currentDayDate();
  const rec = data.days[date];
  const c = calcDay(ix, date, rec, cats);
  const status = dayStatus(date, today, rec, c.hasData);
  const isToday = date === today;
  const future = date > today;
  const todayCalc = isToday ? c : calcDay(ix, today, data.days[today], cats);
  const bv = budgetView({ ix, settings: data.settings, days: data.days, today, todayCalc, todayClosed: Boolean(data.days[today]?.closed) });
  const rel = relLabel(date, today);
  const yesterday = addDays(today, -1);
  const yRec = data.days[yesterday];
  const showYesterday = isToday && !ui.dismissed['y:' + yesterday] && (ix.byDate.get(yesterday)?.length ?? 0) > 0 && !yRec?.closed;
  const statusText: Record<string, string> = {
    closed: 'День завершено',
    recorded: 'Є записи, підсумок не підбито',
    missing: 'Немає даних — це не те саме, що день без витрат',
    future: 'Майбутній день: можна скласти план',
  };

  return (
    <div class="screen day">
      <header class="day-head">
        <div class="day-top">
          <p class="kicker">{cap(WEEKDAYS[weekday(date)])}{state.demo ? <span class="demo-badge">Демо</span> : null}</p>
          <div class="day-nav">
            <IconBtn icon="chevronLeft" label="Попередній день" onClick={() => setUI({ dayDate: addDays(date, -1) })} />
            {!isToday ? <Btn kind="tinted" size="sm" onClick={() => setUI({ dayDate: null })}>Сьогодні</Btn> : null}
            <IconBtn icon="chevronRight" label="Наступний день" disabled={date >= addDays(today, 7)} onClick={() => setUI({ dayDate: addDays(date, 1) })} />
          </div>
        </div>
        <h1 class="h1">{rel ? `${rel}, ${fmtDate(date)}` : fmtDate(date)}</h1>
      </header>

      {!isToday && statusText[status] ? <p class={cx('day-status', `st-${status}`)}>{statusText[status]}</p> : null}

      {showYesterday ? (
        <div class="callout">
          {icon('moon', 18)}
          <span>Учора записи є, а підсумок не підбито.</span>
          <Btn kind="tinted" size="sm" onClick={() => { closeDayAction(yesterday); openDaySummary(yesterday); }}>Підбити</Btn>
          <IconBtn icon="x" label="Сховати" onClick={() => { ui.dismissed['y:' + yesterday] = true; setUI({}); }} />
        </div>
      ) : null}

      <Hero c={c} date={date} closed={Boolean(rec?.closed)} future={future} />

      {!future ? <Ladder c={c} bv={bv} isToday={isToday} closed={Boolean(rec?.closed)} /> : null}

      {!future ? <QuickBar date={date} c={c} data={data} /> : null}

      <Outlook c={c} date={date} data={data} closed={Boolean(rec?.closed)} future={future} />

      <Tiles c={c} date={date} future={future} data={data} />

      <PlanBlock c={c} date={date} />

      {!future ? <Insights date={date} c={c} /> : null}

      <WeekChart date={date} />

      {!future ? <OpsBlock c={c} date={date} isToday={isToday} /> : null}

      {!future && (c.foodCost > 0 || c.bills > 0) ? (
        <Group title="Окремо від денного бюджету">
          {c.foodCost > 0 ? <Row icon="utensils" title="Реальний рух грошей на їжу" sub="Продукти та їжа поза домом" value={fmt(c.foodCash)} /> : null}
          {c.foodCost > 0 ? <Row icon="lunchbox" title="Собівартість харчування" sub="Скільки коштувало те, що зʼїдено (розрахунково)" value={fmt(c.foodCost)} valueTone="muted" /> : null}
          {c.bills > 0 ? <Row icon="doc" title="Обовʼязкові платежі" sub="Резервуються окремо, план дня не псують" value={fmt(c.bills)} /> : null}
        </Group>
      ) : null}

      {!future ? <CloseBlock date={date} isToday={isToday} closed={Boolean(rec?.closed)} hasAdvice={Boolean(rec?.advice)} /> : null}
    </div>
  );
}

function Hero(p: { c: DayCalc; date: string; closed: boolean; future: boolean }): HTMLElement {
  const { c, date } = p;
  const hasPlan = c.plan !== null;
  const frac = hasPlan && c.planTotal > 0 ? c.spent / c.planTotal : null;
  const tone = !hasPlan ? 'none' : c.over > 0 ? 'over' : (c.usedPct ?? 0) >= 85 ? 'warn' : 'ok';
  let msg: string;
  if (p.future) msg = hasPlan ? 'План на цей день уже готовий.' : 'Можна заздалегідь скласти план цього дня.';
  else if (!hasPlan) msg = c.spent > 0 ? 'План не складено, тож порівнювати нема з чим. Обери шаблон нижче — це один дотик.' : 'Обери шаблон плану нижче — і застосунок покаже, скільки лишилося.';
  else if (c.over > 0) msg = `План перевищено на ${fmt(c.over)}. Так буває — увечері подивимось, що можна врахувати.`;
  else msg = `Використано ${c.usedPct ?? 0}% бюджету. До запланованого ліміту — ${fmt(c.remaining ?? 0)}.`;

  return (
    <section class="hero" aria-label="Підсумок дня">
      <div class="hero-main">
        <div class="hero-text">
          <span class="hero-k">Витрачено фактично</span>
          <Num id={`spent:${date}`} value={c.spent} class="hero-big" />
          <span class="hero-sub">{hasPlan ? <>із <b class="num">{fmt(c.planTotal)}</b> запланованих</> : 'без плану'}</span>
        </div>
        <Ring id={`ring:${date}`} frac={frac} tone={tone}>
          {hasPlan
            ? <><span class="ring-pct num">{c.usedPct ?? 0}%</span><span class="ring-cap">{c.over > 0 ? 'понад план' : 'бюджету'}</span></>
            : <span class="ring-cap">без плану</span>}
        </Ring>
      </div>
      <p class={cx('hero-msg', c.over > 0 && 'calm-warn')}>{msg}</p>
      <div class="hero-row">
        <div class="stat">
          <span class="stat-k">Запланований бюджет</span>
          <span class="stat-v num">{hasPlan ? fmt(c.planTotal) : '—'}</span>
        </div>
        <div class="stat">
          <span class="stat-k">Залишок денного бюджету</span>
          {hasPlan ? <Num id={`left:${date}`} value={c.remaining ?? 0} class={cx('stat-v', (c.remaining ?? 0) < 0 && 'neg')} /> : <span class="stat-v num">—</span>}
        </div>
      </div>
    </section>
  ) as HTMLElement;
}

/** «День × 365» і рух до цілі. */
function Outlook(p: { c: DayCalc; date: string; data: AppData; closed: boolean; future: boolean }): HTMLElement {
  const { c, date, data } = p;
  const { ix, today } = derived();
  const hasPlan = c.plan !== null;
  const cal = data.settings.calendar;
  let echo: HTMLElement | null = null;
  if (hasPlan && !p.future) {
    const realized = p.closed || date < today;
    if (realized && (c.economy ?? 0) > 0) {
      const ill = illustrate(c.economy ?? 0, cal, today, data.settings.forecastStayOnly);
      echo = (
        <button type="button" class="echo" onClick={() => go('future', { futureTab: 'forecast' })}>
          <span class="echo-mult" aria-hidden="true">×365</span>
          <span class="echo-text">Така економія в кожен робочий день — це ≈ <b class="num">{fmt(ill[365].amount)}</b> за рік. <span class="muted">Умовно, {ill[365].work} робочих днів, не прогноз.</span></span>
        </button>
      ) as HTMLElement;
    } else {
      const ill = illustrate(c.planTotal, cal, today, data.settings.forecastStayOnly);
      echo = (
        <button type="button" class="echo" onClick={() => go('future', { futureTab: 'whatif' })}>
          <span class="echo-mult" aria-hidden="true">×365</span>
          <span class="echo-text">Такий план у робочі дні року — це <b class="num">{fmt(ill[365].amount)}</b> витрат. <span class="muted">Кожні 10 грн на день ≈ {fmt(1000 * ill[365].work)} на рік.</span></span>
        </button>
      ) as HTMLElement;
    }
  }
  const goals = data.goals.map((g) => goalView(g, ix, today)).filter((g) => !g.done).sort((a, b) => b.pct - a.pct);
  const g = goals[0];
  return (
    <section class="outlook">
      {echo}
      {g ? (
        <button type="button" class="goal-line" onClick={() => go('future', { futureTab: 'goals' })}>
          <span class="goal-line-top"><span>{icon('target', 16)}Ціль «{g.goal.name}»</span><span class="num">{fmt(g.saved)} з {fmt(g.goal.target)}</span></span>
          <Progress value={g.pct / 100} tone="accent" label={`Прогрес цілі ${g.goal.name}`} />
        </button>
      ) : (
        <button type="button" class="goal-line goal-empty" onClick={() => go('future', { futureTab: 'goals' })}>
          {icon('target', 16)}<span>Додай фінансову ціль — тут буде видно рух до неї</span>{icon('chevronRight', 16)}
        </button>
      )}
    </section>
  ) as HTMLElement;
}

function QuickBar(p: { date: string; c: DayCalc; data: AppData }): HTMLElement {
  const items = p.data.micro.filter((m) => m.quick);
  const joy = p.data.settings.joyBudget;
  return (
    <section class="quick-wrap" aria-label="Швидкі витрати">
      <div class="quickbar">
        {items.map((m) => (
          <button type="button" class="quick" onClick={() => quickMicro(m.id, p.date)} aria-label={`Додати: ${m.name}${m.price ? `, ${fmt(m.price)}` : ''}`}>
            <span class="quick-plus">{icon('plus', 14)}</span>
            <span class="quick-name">{m.name}</span>
            <span class="quick-price num">{m.price ? fmt(m.price) : 'ціна?'}</span>
          </button>
        ))}
        <button type="button" class="quick quick-more" onClick={() => openQuickAdd({ date: p.date, mode: 'trip' })}>
          <span class="quick-plus">{icon('bus', 14)}</span><span class="quick-name">Поїздка</span><span class="quick-price">деталі</span>
        </button>
        <button type="button" class="quick quick-more" onClick={() => openQuickAdd({ date: p.date, mode: 'meal' })}>
          <span class="quick-plus">{icon('utensils', 14)}</span><span class="quick-name">Їжа</span><span class="quick-price">обід</span>
        </button>
      </div>
      {p.c.micro > 0 || joy !== null ? (
        <p class="quick-note">
          Дрібні приємності сьогодні: <b class="num">{fmt(p.c.micro)}</b>
          {joy !== null ? <> із бюджету радості {fmt(joy)}{p.c.micro <= joy ? ' — усе в межах' : ''}</> : null}
        </p>
      ) : null}
    </section>
  ) as HTMLElement;
}

function Ladder(p: { c: DayCalc; bv: BudgetView; isToday: boolean; closed: boolean }): HTMLElement {
  const { c, bv } = p;
  let safeV: string = '—';
  let safeNote: HTMLElement | string = '';
  if (!p.isToday) safeNote = 'Рахується лише для сьогодні';
  else if (bv.status === 'unknown') {
    safeNote = <button type="button" class="inline-link" onClick={() => go('settings', { settingsPage: 'budget' })}>Вкажи доходи, платежі й залишок</button> as HTMLElement;
  } else if (bv.status === 'deficit') {
    safeV = fmt(0);
    safeNote = `Спершу обовʼязкові платежі: бракує ${fmt(bv.shortfall)}`;
  } else {
    safeV = fmt(bv.safe ?? 0);
    safeNote = bv.noIncome ? 'Доходи не вказано — резерв на 30 днів' : `Після платежів і потреб до ${fmtDate(bv.nextIncome!.date)}`;
  }
  return (
    <section class="ladder" aria-label="Від економії до накопичень">
      <div class="ladder-step">
        <span class="ladder-k">Потенціал економії<InfoTip title="Потенціал економії">
          <p>Різниця між планом і фактичними витратами дня. {p.closed ? 'День завершено — це підсумкова економія відносно плану.' : 'Поки день не завершено, це сума, яка залишиться, якщо більше нічого не витрачати.'}</p>
          <p>Це ще не заощадження: гроші стають накопиченнями лише після реального переказу.</p>
        </InfoTip></span>
        <span class="ladder-v num">{c.economy !== null ? fmt(c.economy) : '—'}</span>
        <span class="ladder-note">{c.plan ? (p.closed ? 'Невитрачене відносно плану' : 'Якщо більше нічого не витрачати') : 'Потрібен план дня'}</span>
      </div>
      <div class="ladder-step">
        <span class="ladder-k">Безпечно відкласти<InfoTip title="Безпечно відкласти">
          <p>Доступні кошти мінус обовʼязкові платежі до наступного доходу, щоденні потреби на ці дні, залишок плану на сьогодні й твій запас безпеки.</p>
          <p>Якщо є план — не більше за сьогоднішню економію. Якщо на обовʼязкове не вистачає, застосунок не радить відкладати.</p>
          <p>Майбутні доходи не враховуються, доки не надійшли.</p>
        </InfoTip></span>
        <span class="ladder-v num">{safeV}</span>
        <span class="ladder-note">{safeNote}</span>
      </div>
      <div class="ladder-step">
        <span class="ladder-k">{p.isToday ? 'Відкладено сьогодні' : 'Відкладено цього дня'}</span>
        <span class={cx('ladder-v num', c.saved > 0 && 'pos')}>{fmt(c.saved)}</span>
        {p.isToday ? <Btn kind="tinted" size="sm" icon="coins" label="Відкласти гроші" onClick={() => openSaveSheet()}>Відкласти</Btn> : <span class="ladder-note">Фактичні перекази</span>}
      </div>
    </section>
  ) as HTMLElement;
}

function Tiles(p: { c: DayCalc; date: string; future: boolean; data: AppData }): HTMLElement {
  const cats = p.data.categories.filter((c) => !c.hidden && c.id !== 'bills');
  return (
    <section class="tiles" aria-label="Категорії">
      {cats.map((cat) => {
        const fact = p.c.byCat[cat.id] ?? 0;
        const plan = p.c.planByCat[cat.id] ?? 0;
        const over = plan > 0 && fact > plan;
        const open = () => {
          if (p.future) return openPlanEditor(p.date);
          if (cat.id === 'transport') return openQuickAdd({ date: p.date, mode: 'trip' });
          if (cat.id === 'lunch') return openQuickAdd({ date: p.date, mode: 'meal' });
          return openQuickAdd({ date: p.date, category: cat.id });
        };
        return (
          <button type="button" class={cx('tile', fact > 0 && 'has', over && 'over')} style={`--c:${cat.color}`} onClick={open} aria-label={`${cat.name}: ${fmt(fact)}${plan ? ` з ${fmt(plan)}` : ''}`}>
            <span class="tile-icon">{icon(cat.icon, 20)}</span>
            <span class="tile-name">{cat.name}</span>
            <span class="tile-val num">{fmt(fact)}</span>
            <span class="tile-plan">{plan ? `план ${fmt(plan)}` : ' '}</span>
            {plan ? <span class="tile-bar"><span style={`width:${Math.min(100, (fact / plan) * 100).toFixed(0)}%`} /></span> : null}
          </button>
        );
      })}
    </section>
  ) as HTMLElement;
}

function PlanBlock(p: { c: DayCalc; date: string }): HTMLElement {
  const { cats, ix } = derived();
  const { c, date } = p;
  if (!c.plan) {
    return (
      <Group title="План на день" foot="Суми в шаблонах — лише приклад. Зміни їх у налаштуваннях або в самому плані.">
        <TemplateChips date={date} />
      </Group>
    ) as HTMLElement;
  }
  const facts = planLineFacts(ix, date);
  const ids = [...new Set([...c.plan.map((l) => l.category), ...Object.keys(c.byCat).filter((k) => c.byCat[k] !== 0)])];
  const totalDiff = c.planTotal - c.spent;
  return (
    <Group title="План і факт" action={<Btn kind="ghost" size="sm" icon="edit" onClick={() => openPlanEditor(date)}>Змінити план</Btn>}>
      <div class="pf" role="table" aria-label="План проти факту">
        <div class="pf-row pf-head" role="row"><span role="columnheader">Категорія</span><span role="columnheader">План</span><span role="columnheader">Факт</span><span role="columnheader">Різниця</span></div>
        {ids.map((id) => {
          const cat = catOf(cats, id);
          const plan = c.planByCat[id] ?? 0;
          const fact = c.byCat[id] ?? 0;
          const d = plan - fact;
          return (
            <div class={cx('pf-row', d < 0 && 'over')} role="row">
              <span class="pf-cat" role="cell"><span class="dot" style={`--c:${cat.color}`} />{cat.name}{!plan ? <small> поза планом</small> : null}</span>
              <span class="num" role="cell">{plan ? fmt(plan, { currency: false }) : '—'}</span>
              <span class="num" role="cell">{fmt(fact, { currency: false })}</span>
              <span class={cx('num', d < 0 ? 'neg' : d > 0 ? 'pos' : 'muted')} role="cell">{d === 0 ? '0' : fmt(d, { currency: false, sign: true })}</span>
            </div>
          );
        })}
        <div class={cx('pf-row pf-total', totalDiff < 0 && 'over')} role="row">
          <span role="cell">Разом, грн</span>
          <span class="num" role="cell">{fmt(c.planTotal, { currency: false })}</span>
          <span class="num" role="cell">{fmt(c.spent, { currency: false })}</span>
          <span class={cx('num', totalDiff < 0 ? 'neg' : 'pos')} role="cell">{fmt(totalDiff, { currency: false, sign: true })}</span>
        </div>
      </div>
      <div class="plan-lines">
        <p class="field-label">Записати з плану одним дотиком</p>
        <div class="chips chips-wrap">
          {c.plan.map((l) => {
            const done = facts.get(l.id) ?? [];
            const cat = catOf(cats, l.category);
            const sum = done.reduce((s, o) => s + o.amount, 0);
            // Якщо в категорії вже є записи поза планом — не записуємо миттєво, а відкриваємо форму, щоб уникнути дубля.
            const linked = [...facts.values()].flat().filter((o) => o.category === l.category && o.type === 'expense').reduce((s, o) => s + o.amount, 0);
            const unlinked = (c.byCat[l.category] ?? 0) - linked;
            const open = () => (unlinked > 0 ? openQuickAdd({ date, category: l.category, planLine: l, mode: l.category === 'lunch' ? 'meal' : 'expense' }) : recordPlanLine(l, date));
            return (
              <Chip on={done.length > 0} icon={done.length ? 'check' : cat.icon} color={cat.color} label={done.length ? `${l.label}: записано ${fmt(sum)}. Відкрити запис` : `Записати ${l.label} на ${fmt(l.amount)}`}
                onClick={() => (done.length ? openOpEditor(done[0]) : open())}>
                {l.label} · {fmt(done.length ? sum : l.amount)}
              </Chip>
            );
          })}
        </div>
      </div>
    </Group>
  ) as HTMLElement;
}

function Insights(p: { date: string; c: DayCalc }): HTMLElement | null {
  const { ix, data, cats, today } = derived();
  const list = priceOfDecision({ ix, days: data.days, cats, settings: data.settings, today, date: p.date, calc: p.c });
  if (!list.length) return null;
  return (
    <section class="insights" aria-label="Ціна рішення">
      {list.map((t) => <Note tone="info" icon="bulb"><b>Ціна рішення. </b>{t}</Note>)}
    </section>
  ) as HTMLElement;
}

function WeekChart(p: { date: string }): HTMLElement {
  const { ix, data, cats, today } = derived();
  const bars: Bar[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = addDays(p.date, -i);
    const rec = data.days[d];
    const calc = calcDay(ix, d, rec, cats);
    const st = dayStatus(d, today, rec, calc.hasData);
    bars.push({
      key: d,
      label: d === today ? 'сьогодні' : WEEKDAYS_SHORT[weekday(d)],
      value: calc.spent,
      plan: calc.plan ? calc.planTotal : null,
      missing: st === 'missing' || st === 'future',
      hl: d === p.date,
    });
  }
  return (
    <Group title="Останні 7 днів" foot="Риска — план дня. Пунктир — немає даних (це не нульові витрати).">
      <BarChart bars={bars} height={130} label="Витрати за останні 7 днів" onPick={(k) => setUI({ dayDate: k === today ? null : k })} />
    </Group>
  ) as HTMLElement;
}

function OpsBlock(p: { c: DayCalc; date: string; isToday: boolean }): HTMLElement {
  const ops = [...p.c.ops].sort((a, b) => b.time - a.time);
  return (
    <Group title="Операції" action={<Btn kind="ghost" size="sm" icon="plus" onClick={() => openQuickAdd({ date: p.date, mode: 'more' })}>Інша операція</Btn>}>
      {ops.length
        ? ops.map((o) => <OpRow op={o} />)
        : <div class="empty-inline">{p.isToday ? 'Записів ще немає. Кнопка «+ Витрата» — внизу праворуч.' : 'Цього дня записів немає.'}</div>}
    </Group>
  ) as HTMLElement;
}

function CloseBlock(p: { date: string; isToday: boolean; closed: boolean; hasAdvice: boolean }): HTMLElement {
  const { data } = derived();
  const rec = data.days[p.date];
  if (p.closed) {
    return (
      <section class="close-block">
        {rec?.advice ? <AdviceCard advice={rec.advice} /> : null}
        <div class="btn-row">
          <Btn kind="secondary" icon="list" onClick={() => openDaySummary(p.date)}>Підсумок дня</Btn>
          <Btn kind="ghost" icon="repeat" onClick={() => confirmSheet({
            title: 'Відкрити день знову?',
            text: 'Можна буде додати чи змінити записи. Поради й статистику буде перераховано, коли ти знову завершиш день.',
            confirm: 'Відкрити день',
            onConfirm: () => reopenDayAction(p.date),
          })}>Відкрити знову</Btn>
        </div>
      </section>
    ) as HTMLElement;
  }
  return (
    <section class="close-block">
      <Btn kind="primary" size="lg" full icon="moon" onClick={() => { closeDayAction(p.date); openDaySummary(p.date); }}>
        {p.isToday ? 'Завершити день' : 'Підбити підсумок дня'}
      </Btn>
      <p class="hint center">Покаже підсумок, оновлений прогноз і одну пораду наставника. Наступний день почнеться з чистого журналу.</p>
    </section>
  ) as HTMLElement;
}
