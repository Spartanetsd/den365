// AnalyticsScreen.tsx — «Аналітика»: графіки, розподіл, план проти факту, транспорт, харчування, історія, поради.
import { h, Fragment, cx, live } from './dom.ts';
import { icon } from './icons.ts';
import { Btn, Chip, DateInput, Empty, Group, Note, Row, Seg, confirmSheet } from './ui.tsx';
import { BarChart, Donut, HBars, LineChart, type Bar } from './charts.tsx';
import { OpRow } from './forms.tsx';
import { AdviceCard } from './advice.tsx';
import { purgeOperation, restoreOperation } from './store.ts';
import { catOf, derived, go, setUI, ui, type PeriodId } from './view.ts';
import { calcPeriod, opTitle, savingsSeries, type PeriodCalc } from './ledger.ts';
import { comfortPrice, modeInfo, modeStats, publicRef } from './transport.ts';
import { canteenRef, isHomeMeal } from './meals.ts';
import { microTotals } from './insights.ts';
import { NECESSITY, NECESSITY_ORDER } from './defaults.ts';
import { count, DAYS, fmt, percent, TIMES, TRIPS } from './money.ts';
import { MONTHS_SHORT, WEEKDAYS_SHORT, addDays, diffDays, fmtDate, fmtShort, monthKey, startOfMonth, startOfWeek, weekday, ymd } from './time.ts';
import type { Operation } from './types.ts';

const PERIODS: { id: PeriodId; label: string }[] = [
  { id: 'today', label: 'Сьогодні' },
  { id: 'yesterday', label: 'Учора' },
  { id: '7d', label: '7 днів' },
  { id: '30d', label: '30 днів' },
  { id: 'month', label: 'Цей місяць' },
  { id: '182d', label: 'Пів року' },
  { id: '365d', label: 'Рік' },
  { id: 'custom', label: 'Свої дати' },
];

export function periodRange(id: PeriodId, today: string): { from: string; to: string } {
  switch (id) {
    case 'today': return { from: today, to: today };
    case 'yesterday': return { from: addDays(today, -1), to: addDays(today, -1) };
    case '7d': return { from: addDays(today, -6), to: today };
    case '30d': return { from: addDays(today, -29), to: today };
    case 'month': return { from: startOfMonth(today), to: today };
    case '182d': return { from: addDays(today, -181), to: today };
    case '365d': return { from: addDays(today, -364), to: today };
    default: {
      const from = ui.customFrom || addDays(today, -13);
      const to = ui.customTo || today;
      return from <= to ? { from, to } : { from: to, to: from };
    }
  }
}

function bars(period: PeriodCalc, today: string): Bar[] {
  const n = period.days.length;
  if (n <= 62) {
    return period.days.map((d) => ({
      key: d.date,
      label: n <= 7 ? WEEKDAYS_SHORT[weekday(d.date)] : String(ymd(d.date).d),
      value: d.counted ? d.calc.spent : 0,
      plan: d.counted && d.calc.plan ? d.calc.planTotal : null,
      missing: !d.counted,
      hl: d.date === today,
    }));
  }
  const weekly = n <= 200;
  const groups = new Map<string, Bar>();
  for (const d of period.days) {
    const key = weekly ? startOfWeek(d.date) : monthKey(d.date);
    const b = groups.get(key) ?? { key, label: weekly ? fmtShort(key) : MONTHS_SHORT[ymd(key + (weekly ? '' : '-01')).m - 1], value: 0, plan: null, missing: true };
    if (d.counted) {
      b.value += d.calc.spent;
      b.missing = false;
      if (d.calc.plan) b.plan = (b.plan ?? 0) + d.calc.planTotal;
    }
    groups.set(key, b);
  }
  return [...groups.values()];
}

export function AnalyticsScreen(): Node {
  return (
    <div class="screen stats">
      <header class="screen-head">
        <h1 class="h1">Аналітика</h1>
        <p class="kicker">Лише за даними, які ти вніс. Дні без записів не вважаються нульовими.</p>
      </header>
      <Seg value={ui.statsTab} label="Розділ аналітики" options={[
        { value: 'overview', label: 'Огляд' },
        { value: 'history', label: 'Історія' },
        { value: 'advice', label: 'Поради' },
      ]} onChange={(v) => setUI({ statsTab: v })} />
      {ui.statsTab === 'overview' ? <Overview /> : ui.statsTab === 'history' ? <History /> : <AdviceHistory />}
    </div>
  );
}

function Overview(): Node {
  const { data, ix, cats, today } = derived();
  const { from, to } = periodRange(ui.period, today);
  const p = calcPeriod(ix, data.days, cats, from, to, today);
  const span = diffDays(from, to) + 1;
  const catParts = Object.entries(p.byCat).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]).map(([id, v]) => {
    const c = catOf(cats, id);
    return { key: id, label: c.name, value: v, color: c.color };
  });
  const totalCat = catParts.reduce((s, x) => s + x.value, 0);

  const planDays = p.days.filter((d) => d.counted && d.calc.plan);
  const pfCats = new Map<string, { plan: number; fact: number }>();
  for (const d of planDays) {
    for (const id of new Set([...Object.keys(d.calc.planByCat), ...Object.keys(d.calc.byCat)])) {
      const e = pfCats.get(id) ?? { plan: 0, fact: 0 };
      e.plan += d.calc.planByCat[id] ?? 0;
      e.fact += d.calc.byCat[id] ?? 0;
      pfCats.set(id, e);
    }
  }
  const series = savingsSeries(ix, data.settings.budget.savingsStart, from, p.to);
  const hasSavings = series.some((s) => s.total !== 0);
  const modes = modeStats(ix, from, p.to);
  const pub = publicRef(ix, data.settings, today);
  const taxi = modes.find((m) => m.mode === 'taxi');
  const pubStat = modes.filter((m) => modeInfo(m.mode).public).sort((a, b) => b.trips - a.trips)[0];
  const meals = ix.all.filter((o) => o.meal && o.date >= from && o.date <= p.to && (o.type === 'expense' || o.type === 'consumption'));
  const home = meals.filter((o) => isHomeMeal(o.meal!.kind));
  const out = meals.filter((o) => !isHomeMeal(o.meal!.kind));
  const avg = (l: Operation[]) => (l.length ? Math.round(l.reduce((s, o) => s + o.amount, 0) / l.length) : 0);
  const canteen = canteenRef(ix, data.settings, today);
  const micro = microTotals(ix, data.days, cats, today);
  const top = p.days.filter((d) => d.counted && d.calc.spent > 0).sort((a, b) => b.calc.spent - a.calc.spent).slice(0, 5);

  return (
    <div class="stack-lg">
      <div class="chips chips-scroll" role="tablist" aria-label="Період">
        {PERIODS.map((x) => <Chip on={ui.period === x.id} onClick={() => setUI({ period: x.id })}>{x.label}</Chip>)}
      </div>
      {ui.period === 'custom' ? (
        <div class="grid2">
          <DateInput value={from} max={today} label="Від" onChange={(v) => setUI({ customFrom: v })} />
          <DateInput value={to} max={today} label="До" onChange={(v) => setUI({ customTo: v })} />
        </div>
      ) : null}

      <section class="stat-grid">
        <div class="stat-card"><span class="stat-k">Витрачено</span><span class="stat-v num">{fmt(p.spent)}</span><span class="stat-s">{span > 1 ? `${fmtDate(from)} — ${fmtDate(p.to)}` : fmtDate(from)}</span></div>
        <div class="stat-card"><span class="stat-k">У середньому за день</span><span class="stat-v num">{p.avgPerDataDay !== null ? fmt(p.avgPerDataDay, { decimals: 'never' }) : '—'}</span><span class="stat-s">серед днів із даними</span></div>
        <div class="stat-card"><span class="stat-k">План − факт</span><span class={cx('stat-v num', p.economy < 0 ? 'neg' : p.economy > 0 ? 'pos' : '')}>{p.planDays ? fmt(p.economy, { sign: true }) : '—'}</span><span class="stat-s">{p.planDays ? `на ${count(p.planDays, DAYS)} з планом` : 'днів із планом немає'}</span></div>
        <div class="stat-card"><span class="stat-k">Відкладено</span><span class={cx('stat-v num', p.saved > 0 && 'pos')}>{fmt(p.saved)}</span><span class="stat-s">реальні перекази</span></div>
      </section>
      <div class="coverage">
        <span><b class="num">{p.dataDays}</b> з даними</span>
        <span><b class="num">{p.noSpendDays}</b> без витрат</span>
        <span><b class="num">{p.missingDays}</b> без записів</span>
        {p.bills ? <span><b class="num">{fmt(p.bills)}</b> обовʼязкові платежі</span> : null}
      </div>

      {p.dataDays === 0 ? <Empty icon="bars" title="За цей період даних немає" text="Внеси кілька витрат — і тут зʼявляться графіки." action={<Btn kind="primary" onClick={() => go('add')}>Додати витрату</Btn>} /> : (
        <>
          <Group title="Витрати по днях" foot={p.days.length > 62 ? 'Стовпчики згруповано за тижнями або місяцями. Риска — план.' : 'Риска — план дня. Пунктир — днів без записів.'}>
            <BarChart bars={bars(p, today)} label="Витрати по днях" onPick={p.days.length <= 62 ? (k) => go('day', { dayDate: k === today ? null : k }) : undefined} />
          </Group>

          {catParts.length ? (
            <Group title="Розподіл за категоріями">
              <div class="donut-row">
                <Donut parts={catParts} center={fmt(totalCat, { decimals: 'never' })} sub="разом" />
                <ul class="legend">
                  {catParts.map((x) => <li><span class="dot" style={`--c:${x.color}`} />{x.label}<b class="num">{percent(x.value, totalCat) ?? 0}%</b></li>)}
                </ul>
              </div>
              <HBars rows={catParts.map((x) => ({ key: x.key, label: x.label, value: x.value, color: x.color }))} />
            </Group>
          ) : null}

          <Group title="Обовʼязкові, гнучкі, необовʼязкові">
            <HBars rows={NECESSITY_ORDER.map((n) => ({ key: n, label: NECESSITY[n].label, value: Math.max(0, p.byNec[n]) + (n === 'required' ? p.bills : 0) }))} />
          </Group>

          {pfCats.size ? (
            <Group title="План проти факту" foot={`Лише дні з планом: ${planDays.length}.`}>
              {[...pfCats.entries()].sort((a, b) => b[1].fact - a[1].fact).map(([id, v]) => {
                const c = catOf(cats, id);
                const d = v.plan - v.fact;
                return <Row icon={c.icon} color={c.color} title={c.name} sub={`план ${fmt(v.plan)} · факт ${fmt(v.fact)}`} value={fmt(d, { sign: true })} valueTone={d < 0 ? 'neg' : d > 0 ? 'pos' : 'muted'} />;
              })}
            </Group>
          ) : null}
        </>
      )}

      {hasSavings ? (
        <Group title="Динаміка реальних накопичень" foot="Лише фактичні перекази й стартова подушка — без умовної економії.">
          <LineChart points={series.map((s) => ({ label: fmtShort(s.date), value: s.total }))} label="Накопичення" />
        </Group>
      ) : null}

      {modes.length ? (
        <Group title="Транспорт: порівняння">
          {modes.map((m) => {
            const info = modeInfo(m.mode);
            const bits = [count(m.trips, TRIPS), `у середньому ${fmt(m.avgShare, { decimals: 'never' })}`];
            if (m.avgMinutes !== null) bits.push(`${m.avgMinutes} хв`);
            if (m.avgComfort !== null) bits.push(`комфорт ${String(m.avgComfort).replace('.', ',')}/5`);
            return <Row icon={info.icon} title={info.label} sub={bits.join(', ')} value={fmt(m.share)} />;
          })}
          {taxi && (pubStat || pub) ? (() => {
            const base = pubStat ? { cost: pubStat.avgShare, minutes: pubStat.avgMinutes } : { cost: pub!.cost, minutes: pub!.minutes };
            const cp = taxi.avgMinutes !== null && base.minutes !== null ? comfortPrice({ cost: taxi.avgShare, minutes: taxi.avgMinutes }, { cost: base.cost, minutes: base.minutes }, data.settings.hourValue) : null;
            const diff = taxi.avgShare - base.cost;
            return (
              <div class="group-note">
                <p><b>Ціна комфорту.</b> Таксі в середньому {diff >= 0 ? `дорожче на ${fmt(diff, { decimals: 'never' })}` : `дешевше на ${fmt(-diff, { decimals: 'never' })}`}{cp && cp.saved > 0 ? `, зате економить ${cp.saved} хв` : ''}.</p>
                {cp?.timeValue !== null && cp?.timeValue !== undefined ? <p class="hint">За твоєю цінністю години цей час вартує {fmt(cp.timeValue, { decimals: 'never' })}{cp.pureComfort !== null && cp.pureComfort > 0 ? `; решта ${fmt(cp.pureComfort, { decimals: 'never' })} — плата за комфорт` : ' — доплата виправдана'}.</p> : null}
              </div>
            );
          })() : null}
        </Group>
      ) : null}

      {meals.length ? (
        <Group title="Домашні обіди чи їдальня">
          <Row icon="lunchbox" title="Домашня їжа" sub={`${count(home.length, TIMES)}, у середньому ${fmt(avg(home), { decimals: 'never' })}`} value={fmt(home.reduce((s, o) => s + o.amount, 0))} />
          <Row icon="utensils" title="Поза домом" sub={`${count(out.length, TIMES)}, у середньому ${fmt(avg(out), { decimals: 'never' })}`} value={fmt(out.reduce((s, o) => s + o.amount, 0))} />
          {canteen && home.length ? <div class="group-note"><p>Кожен домашній обід замість їдальні ({fmt(canteen.amount)}) — це в середньому <b>{fmt(Math.max(0, canteen.amount - avg(home)), { decimals: 'never' })}</b> різниці. За період потенційно: <b>{fmt(home.filter((o) => o.meal!.kind === 'lunchBox').reduce((s, o) => s + Math.max(0, canteen.amount - o.amount), 0))}</b>.</p></div> : null}
        </Group>
      ) : null}

      <Group title="Маленькі гроші — великий результат" foot="Кава, смаколики та інші дрібниці. Приємності — це нормально; важливо бачити суму.">
        <div class="micro-grid">
          <div><span class="stat-k">Сьогодні</span><b class="num">{fmt(micro.day)}</b></div>
          <div><span class="stat-k">Цей тиждень</span><b class="num">{fmt(micro.week)}</b></div>
          <div><span class="stat-k">Цей місяць</span><b class="num">{fmt(micro.month)}</b></div>
          <div><span class="stat-k">Цей рік</span><b class="num">{fmt(micro.year)}</b></div>
        </div>
        {micro.avgPerDataDay !== null ? <p class="group-note">У середньому {fmt(micro.avgPerDataDay, { decimals: 'never' })} на день із даними — у такому темпі ≈ <b>{fmt(micro.avgPerDataDay * 365, { decimals: 'never' })}</b> за рік. Це темп, а не вирок.</p> : null}
      </Group>

      {top.length ? (
        <Group title="Найвитратніші дні">
          {top.map((d) => <Row icon="calendar" title={fmtDate(d.date, { weekday: true })} sub={d.calc.plan ? `план ${fmt(d.calc.planTotal)}` : 'без плану'} value={fmt(d.calc.spent)} valueTone={d.calc.over > 0 ? 'neg' : ''} chevron onClick={() => go('day', { dayDate: d.date === today ? null : d.date })} />)}
        </Group>
      ) : null}
    </div>
  );
}

const TYPES: { id: string; label: string; test: (o: Operation) => boolean }[] = [
  { id: 'all', label: 'Усі', test: () => true },
  { id: 'expense', label: 'Витрати', test: (o) => o.type === 'expense' && !o.trip },
  { id: 'trip', label: 'Поїздки', test: (o) => Boolean(o.trip) },
  { id: 'meal', label: 'Їжа', test: (o) => Boolean(o.meal) },
  { id: 'income', label: 'Доходи', test: (o) => o.type === 'income' },
  { id: 'saving', label: 'Накопичення', test: (o) => o.type === 'saving' || o.type === 'withdrawal' },
  { id: 'refund', label: 'Повернення', test: (o) => o.type === 'refund' },
  { id: 'transfer', label: 'Перекази', test: (o) => o.type === 'transfer' },
];

function History(): Node {
  const { data, cats } = derived();
  let limit = 120;
  const deleted = data.ops.filter((o) => o.deletedAt).sort((a, b) => (b.deletedAt ?? 0) - (a.deletedAt ?? 0));
  const list = live(() => {
    const q = ui.histQuery.trim().toLowerCase();
    const type = TYPES.find((t) => t.id === ui.histType) ?? TYPES[0];
    const items = data.ops
      .filter((o) => !o.deletedAt && type.test(o))
      .filter((o) => {
        if (!q) return true;
        const hay = [opTitle(o, cats), o.note ?? '', catOf(cats, o.category).name, o.trip?.route ?? '', o.date, fmtDate(o.date)].join(' ').toLowerCase();
        return hay.includes(q) || (q.replace(',', '.').match(/^\d+(\.\d+)?$/) !== null && String(o.amount / 100).startsWith(q.replace(',', '.')));
      })
      .sort((a, b) => (a.date === b.date ? b.time - a.time : a.date < b.date ? 1 : -1));
    if (!items.length) return <Empty icon="search" title="Нічого не знайдено" text={q ? 'Спробуй іншу назву, суму чи дату.' : 'Записів цього типу ще немає.'} />;
    const shown = items.slice(0, limit);
    const groups = new Map<string, Operation[]>();
    for (const o of shown) groups.set(o.date, [...(groups.get(o.date) ?? []), o]);
    return (
      <>
        {[...groups.entries()].map(([date, ops]) => (
          <Group title={fmtDate(date, { weekday: true, year: date.slice(0, 4) !== derived().today.slice(0, 4) })}>
            {ops.map((o) => <OpRow op={o} />)}
          </Group>
        ))}
        {items.length > limit ? <Btn kind="secondary" full onClick={() => { limit += 200; list.refresh(); }}>Показати ще ({items.length - limit})</Btn> : null}
      </>
    );
  });
  return (
    <div class="stack">
      <label class="search">
        {icon('search', 18)}
        <input class="input" type="search" placeholder="Пошук: назва, сума, маршрут, нотатка" value={ui.histQuery} aria-label="Пошук в історії"
          onInput={(e: Event) => { ui.histQuery = (e.target as HTMLInputElement).value; list.refresh(); }} />
      </label>
      <div class="chips chips-scroll">
        {TYPES.map((t) => <Chip on={ui.histType === t.id} onClick={() => setUI({ histType: t.id })}>{t.label}</Chip>)}
      </div>
      {list.el}
      {deleted.length ? (
        <Group title={`Видалені записи: ${deleted.length}`} action={<Btn kind="ghost" size="sm" onClick={() => setUI({ showTrash: !ui.showTrash })}>{ui.showTrash ? 'Сховати' : 'Показати'}</Btn>} foot="Видалені записи не враховуються в підсумках. Їх можна відновити.">
          {ui.showTrash ? deleted.slice(0, 100).map((o) => (
            <div class="row trash-row">
              <span class="row-main"><span class="row-title">{opTitle(o, cats)}</span><span class="row-sub">{fmtDate(o.date)} · {fmt(o.amount)}</span></span>
              <Btn kind="tinted" size="sm" icon="refund" onClick={() => restoreOperation(o.id)}>Відновити</Btn>
              <Btn kind="ghost" size="sm" icon="trash" label="Видалити назавжди" onClick={() => confirmSheet({ title: 'Видалити назавжди?', text: 'Цей запис не можна буде відновити.', confirm: 'Видалити', danger: true, onConfirm: () => purgeOperation(o.id) })} />
            </div>
          )) : null}
        </Group>
      ) : null}
    </div>
  );
}

function AdviceHistory(): Node {
  const { data } = derived();
  const list = Object.values(data.days).filter((d) => d.closed && d.advice).sort((a, b) => (a.date < b.date ? 1 : -1));
  if (!list.length) return <Empty icon="spark" title="Порад ще немає" text="Порада зʼявляється, коли ти завершуєш день кнопкою «Завершити день»." />;
  return (
    <div class="stack">
      <Note tone="info">Кожна порада привʼязана до даних свого дня. Якщо змінити записи завершеного дня, пораду буде перераховано.</Note>
      {list.map((d) => (
        <section class="advice-item">
          <button type="button" class="advice-date" onClick={() => go('day', { dayDate: d.date === derived().today ? null : d.date })}>{fmtDate(d.date, { weekday: true })}{icon('chevronRight', 14)}</button>
          <AdviceCard advice={d.advice!} compact />
        </section>
      ))}
    </div>
  );
}
