// forms.tsx — форми внесення: витрата, поїздка, харчування, інші операції; швидкі дії й редагування.
import { h, Fragment, cx, live } from './dom.ts';
import { icon } from './icons.ts';
import type { CarInfo, Kop, MealKind, Necessity, Operation, PlanLine, TripDir, TripMode } from './types.ts';
import type { OpInput } from './actions.ts';
import { makeAmountPad, Btn, CatIcon, Chip, Row, DateInput, Field, MoneyInput, Note, NumInput, Seg, Select, Stars, Stepper, TextInput, Toggle, confirmSheet, openSheet, toast } from './ui.tsx';
import { addOperation, deleteOperation, purgeOperation, restoreOperation, updateOperation } from './store.ts';
import { catOf, derived } from './view.ts';
import { NECESSITY, NECESSITY_ORDER } from './defaults.ts';
import { DIRS, MODES, TAXI_JUSTIFIED, comfortPrice, modeInfo, publicRef, tripAmounts } from './transport.ts';
import { MEALS, canteenRef, homeMealRef, isHomeMeal, mealInfo, mealOpShape, mealProjection } from './meals.ts';
import { budgetView } from './budget.ts';
import { calcDay, opTitle } from './ledger.ts';
import { goalView } from './goals.ts';
import { workdaysAhead } from './calendar.ts';
import { count, fmt, WORKDAYS } from './money.ts';
import { addDays, fmtDate, relLabel, timeHM } from './time.ts';

type Done = (op: Operation | null) => void;

function saveOrUpdate(initial: Operation | undefined, input: OpInput): Operation | null {
  try {
    if (initial) {
      const patch: Partial<Operation> = { ...input };
      for (const k of ['category', 'title', 'note', 'necessity', 'micro', 'trip', 'meal', 'refundOf', 'obligationId', 'goalId', 'estimate'] as const) {
        if (!(k in input)) (patch as Record<string, unknown>)[k] = undefined;
      }
      return updateOperation(initial.id, patch);
    }
    return addOperation(input);
  } catch (e) {
    toast(e instanceof Error ? e.message : 'Не вдалося зберегти.');
    return null;
  }
}

function DateRow(p: { value: string; onChange: (v: string) => void }): HTMLElement {
  const { today } = derived();
  const rel = relLabel(p.value, today);
  return (
    <div class="date-row">
      <span class="date-row-label">{icon('calendar', 16)}{rel ? `${rel}, ${fmtDate(p.value)}` : fmtDate(p.value, { weekday: true })}</span>
      <DateInput value={p.value} max={addDays(today, 30)} onChange={p.onChange} label="Дата операції" />
    </div>
  ) as HTMLElement;
}

function DeleteBtn(p: { op: Operation; done: Done }): HTMLElement {
  return (
    <Btn kind="ghost" size="lg" full icon="trash" onClick={() => {
      deleteOperation(p.op.id);
      toast('Запис видалено.', [{ label: 'Відновити', run: () => restoreOperation(p.op.id) }]);
      p.done(null);
    }}>Видалити запис</Btn>
  ) as HTMLElement;
}

/** Додає поле, лише якщо значення непорожнє. */
function put<K extends keyof OpInput>(o: OpInput, key: K, v: OpInput[K] | null | '' | undefined): void {
  if (v !== null && v !== undefined && v !== '') o[key] = v as OpInput[K];
}

// ── Витрата ──────────────────────────────────────────────────────────────────

export function ExpenseForm(p: { date: string; category?: string; micro?: string; planLine?: PlanLine; initial?: Operation; onDone: Done }): HTMLElement {
  const { data } = derived();
  const init = p.initial;
  const st = {
    date: init?.date ?? p.date,
    amount: (init?.amount ?? p.planLine?.amount ?? null) as Kop | null,
    category: init?.category ?? p.planLine?.category ?? p.category ?? 'coffee',
    micro: init?.micro ?? p.micro,
    title: init?.title ?? p.planLine?.label ?? '',
    note: init?.note ?? '',
    necessity: (init?.necessity ?? null) as Necessity | null,
    obligationId: init?.obligationId ?? '',
    details: Boolean(init),
  };
  if (st.micro && st.amount === null) {
    const m = data.micro.find((x) => x.id === st.micro);
    if (m?.price) st.amount = m.price;
    if (m && !st.title) st.title = m.name;
  }
  const pad = makeAmountPad({ initial: st.amount, onChange: (v) => { st.amount = v; } });
  const visibleCats = data.categories.filter((c) => !c.hidden);

  const pick = live(() => {
    const micros = data.micro.filter((m) => m.category === st.category);
    return (
      <>
        <div class="cat-grid" role="radiogroup" aria-label="Категорія">
          {visibleCats.map((c) => (
            <button type="button" role="radio" aria-checked={c.id === st.category ? 'true' : 'false'} class={cx('cat-pick', c.id === st.category && 'on')} style={`--c:${c.color}`}
              onClick={() => { st.category = c.id; st.micro = undefined; st.necessity = null; pick.refresh(); details.refresh(); }}>
              {icon(c.icon, 22)}
              <span>{c.name}</span>
            </button>
          ))}
        </div>
        {micros.length ? (
          <div class="chips chips-scroll" aria-label="Що саме">
            {micros.map((m) => (
              <Chip on={st.micro === m.id} icon={m.icon} onClick={() => {
                st.micro = st.micro === m.id ? undefined : m.id;
                if (st.micro) {
                  st.title = m.name;
                  if (m.price) { st.amount = m.price; pad.set(m.price); }
                }
                pick.refresh();
                details.refresh();
              }}>{m.name}{m.price ? ` · ${fmt(m.price)}` : ''}</Chip>
            ))}
          </div>
        ) : null}
      </>
    );
  });

  const details = live(() => {
    const { cats } = derived();
    const cat = catOf(cats, st.category);
    const nec = st.necessity ?? cat.necessity;
    if (!st.details) {
      return <button type="button" class="link-btn" onClick={() => { st.details = true; details.refresh(); }}>{icon('edit', 15)} Назва, тип витрати, нотатка, дата</button>;
    }
    return (
      <div class="stack-sm">
        <Field label="Назва (необовʼязково)"><TextInput value={st.title} placeholder={cat.name} onChange={(v) => { st.title = v; }} /></Field>
        <Field label="Тип витрати">
          <Select value={nec} label="Тип витрати" options={NECESSITY_ORDER.map((n) => ({ value: n, label: NECESSITY[n].label }))} onChange={(v) => { st.necessity = v as Necessity; }} />
        </Field>
        {data.settings.budget.obligations.length ? (
          <Field label="Обовʼязковий платіж" hint="Платежі не входять у денний бюджет і знімають резерв у бюджеті.">
            <Select value={st.obligationId} label="Обовʼязковий платіж" options={[{ value: '', label: 'Ні' }, ...data.settings.budget.obligations.map((o) => ({ value: o.id, label: `${o.name} · ${fmt(o.amount)}` }))]}
              onChange={(v) => { st.obligationId = v; if (v) { st.category = 'bills'; const o = data.settings.budget.obligations.find((x) => x.id === v); if (o && !st.amount) { st.amount = o.amount; pad.set(o.amount); } pick.refresh(); } }} />
          </Field>
        ) : null}
        <Field label="Нотатка"><TextInput value={st.note} max={300} placeholder="Необовʼязково" onChange={(v) => { st.note = v; }} /></Field>
        <DateRow value={st.date} onChange={(v) => { st.date = v; }} />
      </div>
    );
  });

  const save = () => {
    if (!st.amount || st.amount <= 0) {
      toast('Вкажи суму більшу за нуль.');
      return;
    }
    const cat = catOf(derived().cats, st.category);
    const input: OpInput = { type: 'expense', date: st.date, amount: st.amount, category: st.category };
    put(input, 'title', st.title.trim());
    put(input, 'note', st.note.trim());
    put(input, 'necessity', st.necessity && st.necessity !== cat.necessity ? st.necessity : null);
    put(input, 'micro', st.micro);
    put(input, 'obligationId', st.obligationId);
    put(input, 'planLineId', init?.planLineId ?? p.planLine?.id);
    const op = saveOrUpdate(init, input);
    if (op) p.onDone(op);
  };

  return (
    <div class="form">
      {pad.display}
      {pick.el}
      {details.el}
      {pad.keypad}
      <div class="form-actions">
        <Btn kind="primary" size="lg" full onClick={save}>{init ? 'Зберегти зміни' : 'Зберегти витрату'}</Btn>
        {init ? <DeleteBtn op={init} done={p.onDone} /> : null}
      </div>
    </div>
  ) as HTMLElement;
}

// ── Поїздка ──────────────────────────────────────────────────────────────────

function lastCar(): CarInfo {
  const { ix } = derived();
  const prev = [...ix.all].reverse().find((o) => o.trip?.car);
  const c = prev?.trip?.car;
  return { km: 0, per100: c?.per100 ?? 0, fuelPrice: c?.fuelPrice ?? 0, parking: 0, wearPerKm: c?.wearPerKm ?? 0, other: 0, fuelPrepaid: c?.fuelPrepaid ?? false };
}

export function TripForm(p: { date: string; initial?: Operation; onDone: Done }): HTMLElement {
  const { ix, data, today } = derived();
  const init = p.initial;
  const t = init?.trip;
  const st = {
    date: init?.date ?? p.date,
    mode: (t?.mode ?? 'bus') as TripMode,
    dir: (t?.dir ?? 'there') as TripDir,
    route: t?.route ?? '',
    cost: (init && t?.mode !== 'car' ? (t?.split && t.passengers > 1 ? t.full : init.amount) : null) as Kop | null,
    minutes: t?.minutes ?? null,
    wait: t?.wait ?? null,
    comfort: t?.comfort ?? null,
    passengers: t?.passengers ?? 1,
    split: t?.split ?? false,
    car: t?.car ? { ...t.car } : lastCar(),
    note: init?.note ?? '',
    why: false,
  };
  const routes = [...new Set([...ix.all].reverse().filter((o) => o.trip?.route).map((o) => o.trip!.route))].slice(0, 6);
  const pub = publicRef(ix, data.settings, today);

  const summary = live(() => {
    const a = tripAmounts({ mode: st.mode, cost: st.cost ?? 0, passengers: st.passengers, split: st.split, car: st.mode === 'car' ? st.car : undefined });
    const lines: HTMLElement[] = [];
    lines.push(<div class="kv"><span>Повна вартість поїздки</span><b class="num">{fmt(a.full)}</b></div> as HTMLElement);
    if (st.passengers > 1) lines.push(<div class="kv"><span>{st.split ? 'Твоя частка' : 'Ти платиш за всіх'}</span><b class="num">{fmt(a.share)}</b></div> as HTMLElement);
    if (a.estimate > 0) lines.push(<div class="kv"><span>З них гроші зараз</span><b class="num">{fmt(a.cash)}</b></div> as HTMLElement);
    if (a.estimate > 0) lines.push(<div class="kv muted"><span>Розрахункова частина (передплачене пальне, знос)</span><b class="num">{fmt(a.estimate)}</b></div> as HTMLElement);
    let comfort: HTMLElement | null = null;
    const minutes = st.minutes !== null ? st.minutes + (st.wait ?? 0) : null;
    if (pub && !modeInfo(st.mode).public && st.mode !== 'walk' && a.share > 0) {
      const cp = minutes !== null && pub.minutes !== null
        ? comfortPrice({ cost: a.share, minutes }, { cost: pub.cost, minutes: pub.minutes }, data.settings.hourValue)
        : null;
      const label = modeInfo(st.mode).label;
      const extra = a.share - pub.cost;
      const head = extra > 0
        ? `${label} дорожче за звичайну поїздку громадським транспортом на ${fmt(extra)}`
        : `${label} не дорожче за звичайну поїздку громадським транспортом`;
      let tail = '';
      if (cp && cp.saved > 0) tail = `, зате економить ${cp.saved} хв.`;
      else if (cp && cp.saved <= 0) tail = ', але часу не економить.';
      else tail = '.';
      let verdict = '';
      if (cp?.verdict === 'timeWorthIt') verdict = `За твоєю цінністю години ці хвилини варті ${fmt(cp.timeValue ?? 0)} — доплата виправдана.`;
      else if (cp?.verdict === 'comfortPremium') verdict = `Час вартує ${fmt(cp.timeValue ?? 0)}, решта ${fmt(cp.pureComfort ?? 0)} — плата за комфорт.`;
      else if (cp && data.settings.hourValue === null && cp.saved > 0) verdict = 'Вкажи цінність години в налаштуваннях — і застосунок порахує, чи варта доплата.';
      comfort = (
        <div class="comfort">
          <p class="comfort-head">{icon('clock', 16)}<b>Ціна комфорту</b></p>
          <p>{head}{tail} {verdict}</p>
          <p class="hint">Порівняння з {pub.source === 'setting' ? 'типовою вартістю з налаштувань' : 'медіаною твоїх поїздок'}: {fmt(pub.cost)}{pub.minutes !== null ? `, ${pub.minutes} хв` : ''}.</p>
        </div>
      ) as HTMLElement;
    }
    return <>{<div class="summary">{lines}</div>}{comfort}</>;
  });

  const body = live(() => (
    <>
      <div class="mode-grid" role="radiogroup" aria-label="Спосіб пересування">
        {MODES.map((m) => (
          <button type="button" role="radio" aria-checked={m.id === st.mode ? 'true' : 'false'} class={cx('mode-pick', m.id === st.mode && 'on')} onClick={() => { st.mode = m.id; body.refresh(); }}>
            {icon(m.icon, 22)}<span>{m.label}</span>
          </button>
        ))}
      </div>
      <Seg value={st.dir} label="Напрямок" options={DIRS.map((d) => ({ value: d.id, label: d.label }))} onChange={(v) => { st.dir = v; body.refresh(); }} />
      <Field label="Маршрут або зупинки"><TextInput value={st.route} placeholder="Наприклад: Дім → Навчання" onChange={(v) => { st.route = v; }} /></Field>
      {routes.length ? <div class="chips chips-scroll">{routes.map((r) => <Chip on={st.route === r} onClick={() => { st.route = r; body.refresh(); }}>{r}</Chip>)}</div> : null}
      {st.mode === 'car' ? (
        <div class="grid2">
          <Field label="Відстань"><NumInput value={st.car.km || null} decimals suffix="км" onChange={(v) => { st.car.km = v ?? 0; summary.refresh(); }} /></Field>
          <Field label="Витрата"><NumInput value={st.car.per100 || null} decimals suffix="л/100 км" onChange={(v) => { st.car.per100 = v ?? 0; summary.refresh(); }} /></Field>
          <Field label="Ціна літра"><MoneyInput value={st.car.fuelPrice || null} onChange={(v) => { st.car.fuelPrice = v ?? 0; summary.refresh(); }} /></Field>
          <Field label="Паркування"><MoneyInput value={st.car.parking || null} onChange={(v) => { st.car.parking = v ?? 0; summary.refresh(); }} /></Field>
          <Field label="Знос на 1 км" hint="Необовʼязково"><MoneyInput value={st.car.wearPerKm || null} onChange={(v) => { st.car.wearPerKm = v ?? 0; summary.refresh(); }} /></Field>
          <Field label="Інші витрати"><MoneyInput value={st.car.other || null} onChange={(v) => { st.car.other = v ?? 0; summary.refresh(); }} /></Field>
          <div class="toggle-row span2">
            <span>Пальне вже оплачене окремою заправкою<small>Тоді воно не рахується як нова витрата — лише як собівартість поїздки.</small></span>
            <Toggle checked={st.car.fuelPrepaid} label="Пальне вже оплачене" onChange={(v) => { st.car.fuelPrepaid = v; summary.refresh(); }} />
          </div>
        </div>
      ) : st.mode !== 'walk' ? (
        <Field label={st.passengers > 1 ? 'Вартість поїздки (за всіх)' : 'Вартість поїздки'}><MoneyInput value={st.cost} onChange={(v) => { st.cost = v; summary.refresh(); }} /></Field>
      ) : null}
      <div class="grid2">
        <Field label="Час у дорозі"><NumInput value={st.minutes} suffix="хв" onChange={(v) => { st.minutes = v; summary.refresh(); }} /></Field>
        <Field label="Очікування"><NumInput value={st.wait} suffix="хв" onChange={(v) => { st.wait = v; summary.refresh(); }} /></Field>
      </div>
      <div class="field"><span class="field-label">Комфорт</span><Stars value={st.comfort} onChange={(v) => { st.comfort = v; }} /></div>
      <div class="field-inline-row">
        <span class="field-label">Пасажирів</span>
        <Stepper value={st.passengers} min={1} max={8} label="Кількість пасажирів" onChange={(v) => { st.passengers = v; body.refresh(); }} />
      </div>
      {st.passengers > 1 ? (
        <div class="toggle-row">
          <span>Ділимо витрати порівну</span>
          <Toggle checked={st.split} label="Ділимо витрати" onChange={(v) => { st.split = v; summary.refresh(); }} />
        </div>
      ) : null}
      {summary.el}
      {st.mode === 'taxi' ? (
        <details class="why" open={st.why}>
          <summary onClick={() => { st.why = !st.why; }}>Коли таксі може бути виправданим</summary>
          <ul>{TAXI_JUSTIFIED.map((s) => <li>{s}</li>)}</ul>
          <p class="hint">Найдешевший спосіб — не завжди найкращий: важать час, втома, безпека й потреба прибути вчасно.</p>
        </details>
      ) : null}
      <Field label="Нотатка"><TextInput value={st.note} max={300} placeholder="Необовʼязково" onChange={(v) => { st.note = v; }} /></Field>
      <DateRow value={st.date} onChange={(v) => { st.date = v; }} />
    </>
  ));

  const save = () => {
    const a = tripAmounts({ mode: st.mode, cost: st.cost ?? 0, passengers: st.passengers, split: st.split, car: st.mode === 'car' ? st.car : undefined });
    if (st.mode === 'car' && st.car.km <= 0) return toast('Вкажи відстань поїздки.');
    if (st.mode !== 'walk' && st.mode !== 'car' && (!st.cost || st.cost <= 0)) return toast('Вкажи вартість поїздки.');
    const input: OpInput = {
      type: 'expense',
      date: st.date,
      amount: a.cash,
      category: 'transport',
      title: modeInfo(st.mode).label,
      trip: {
        mode: st.mode, dir: st.dir, route: st.route.trim(), minutes: st.minutes, wait: st.wait, comfort: st.comfort,
        passengers: st.passengers, split: st.passengers > 1 && st.split, full: a.full,
        ...(st.mode === 'car' ? { car: { ...st.car } } : {}),
      },
    };
    put(input, 'estimate', a.estimate > 0 ? a.estimate : null);
    put(input, 'note', st.note.trim());
    put(input, 'planLineId', init?.planLineId);
    const op = saveOrUpdate(init, input);
    if (op) p.onDone(op);
  };

  return (
    <div class="form">
      {body.el}
      <div class="form-actions">
        <Btn kind="primary" size="lg" full onClick={save}>{init ? 'Зберегти зміни' : 'Зберегти поїздку'}</Btn>
        {init ? <DeleteBtn op={init} done={p.onDone} /> : null}
      </div>
    </div>
  ) as HTMLElement;
}

// ── Харчування ───────────────────────────────────────────────────────────────

export function MealForm(p: { date: string; initial?: Operation; planLine?: PlanLine; onDone: Done }): HTMLElement {
  const { ix, data, today } = derived();
  const init = p.initial;
  const st = {
    date: init?.date ?? p.date,
    kind: (init?.meal?.kind ?? 'lunchBox') as MealKind,
    cost: (init?.amount ?? null) as Kop | null,
    prepaid: init?.meal ? init.meal.prepaid : true,
    note: init?.note ?? '',
  };
  const canteen = canteenRef(ix, data.settings, today);
  const home = homeMealRef(ix, today);
  const work30 = derivedWork30();

  const compare = live(() => {
    if (st.cost === null || st.cost <= 0) return null;
    if (isHomeMeal(st.kind) && canteen) {
      const diff = canteen.amount - st.cost;
      if (diff <= 0) return <Note tone="info">Домашня їжа цього разу не дешевша за їдальню ({fmt(canteen.amount)}).</Note>;
      const pr = mealProjection(diff);
      return (
        <div class="compare">
          <div class="compare-row"><span>Домашній обід</span><b class="num">{fmt(st.cost)}</b></div>
          <div class="compare-row"><span>Їдальня {canteen.source === 'setting' ? '(з налаштувань)' : '(твоя медіана)'}</span><b class="num">{fmt(canteen.amount)}</b></div>
          <div class="compare-row strong"><span>Різниця</span><b class="num pos">{fmt(diff)}</b></div>
          <p class="hint">Потенційно за 5 / 10 / 22 робочі дні: <b>{fmt(pr.d5)}</b> / <b>{fmt(pr.d10)}</b> / <b>{fmt(pr.d22)}</b>. У найближчі 30 днів у тебе {count(work30, WORKDAYS)}. Це можливість, а не заощадження.</p>
        </div>
      );
    }
    if (!isHomeMeal(st.kind) && home) {
      const diff = st.cost - home;
      if (diff > 0) return <Note tone="info">Домашній обід зазвичай обходиться тобі в {fmt(home)} — різниця {fmt(diff)}.</Note>;
    }
    return null;
  });

  const body = live(() => {
    const homeKind = isHomeMeal(st.kind);
    return (
      <>
        <div class="meal-grid" role="radiogroup" aria-label="Вид харчування">
          {MEALS.map((m) => (
            <button type="button" role="radio" aria-checked={m.id === st.kind ? 'true' : 'false'} class={cx('mode-pick', m.id === st.kind && 'on')} onClick={() => { st.kind = m.id; body.refresh(); }}>
              {icon(m.icon, 22)}<span>{m.label}</span>
            </button>
          ))}
        </div>
        <Field label={homeKind ? 'Вартість інгредієнтів на одну порцію' : 'Скільки коштувало'}>
          <MoneyInput value={st.cost} onChange={(v) => { st.cost = v; compare.refresh(); }} />
        </Field>
        {homeKind ? (
          <div class="stack-sm">
            <Seg value={st.prepaid ? 'yes' : 'no'} label="Продукти" options={[{ value: 'yes', label: 'Продукти вже куплені' }, { value: 'no', label: 'Нова покупка' }]} onChange={(v) => { st.prepaid = v === 'yes'; body.refresh(); }} />
            <p class="hint">{st.prepaid
              ? 'Покупку продуктів уже враховано — тут лише розрахункова собівартість, без повторного списання грошей.'
              : 'Буде записано як витрату на продукти.'}</p>
          </div>
        ) : null}
        {compare.el}
        <Field label="Нотатка"><TextInput value={st.note} max={300} placeholder="Необовʼязково" onChange={(v) => { st.note = v; }} /></Field>
        <DateRow value={st.date} onChange={(v) => { st.date = v; }} />
      </>
    );
  });

  const save = () => {
    if (!st.cost || st.cost <= 0) return toast('Вкажи вартість.');
    const shape = mealOpShape(st.kind, st.prepaid);
    const input: OpInput = {
      type: shape.type,
      date: st.date,
      amount: st.cost,
      category: shape.category,
      title: mealInfo(st.kind).label,
      meal: { kind: st.kind, prepaid: isHomeMeal(st.kind) && st.prepaid },
    };
    put(input, 'note', st.note.trim());
    put(input, 'planLineId', init?.planLineId ?? p.planLine?.id);
    if (init && init.type !== shape.type) {
      deleteOperation(init.id);
      const op = saveOrUpdate(undefined, input);
      if (op) p.onDone(op);
      return;
    }
    const op = saveOrUpdate(init, input);
    if (op) p.onDone(op);
  };

  return (
    <div class="form">
      {body.el}
      <div class="form-actions">
        <Btn kind="primary" size="lg" full onClick={save}>{init ? 'Зберегти зміни' : 'Зберегти'}</Btn>
        {init ? <DeleteBtn op={init} done={p.onDone} /> : null}
      </div>
    </div>
  ) as HTMLElement;
}

function derivedWork30(): number {
  const { data, today } = derived();
  return workdaysAhead(today, 30, data.settings.calendar);
}

// ── Інші операції ────────────────────────────────────────────────────────────

type MoreKind = 'income' | 'refund' | 'saving' | 'withdrawal' | 'transfer';

export function MoreForm(p: { date: string; kind?: MoreKind; goalId?: string; initial?: Operation; onDone: Done }): HTMLElement {
  const { data, ix, cats, today } = derived();
  const init = p.initial;
  const st = {
    kind: ((init?.type as MoreKind | undefined) ?? p.kind ?? 'saving') as MoreKind,
    date: init?.date ?? p.date,
    amount: (init?.amount ?? null) as Kop | null,
    title: init?.title ?? '',
    note: init?.note ?? '',
    goalId: init?.goalId ?? p.goalId ?? '',
    refundOf: init?.refundOf ?? '',
    category: init?.category ?? 'other',
  };
  if (!init && st.kind === 'saving') {
    const c = calcDay(ix, today, data.days[today], cats);
    const bv = budgetView({ ix, settings: data.settings, days: data.days, today, todayCalc: c, todayClosed: Boolean(data.days[today]?.closed) });
    if (bv.status === 'ok' && bv.safe && bv.safe > 0) st.amount = bv.safe;
  }

  const body = live(() => {
    const k = st.kind;
    const c = calcDay(ix, today, data.days[today], cats);
    const bv = budgetView({ ix, settings: data.settings, days: data.days, today, todayCalc: c, todayClosed: Boolean(data.days[today]?.closed) });
    const goals = data.goals.map((g) => goalView(g, ix, today));
    const recent = ix.all.filter((o) => o.type === 'expense' && o.date >= addDays(today, -45)).sort((a, b) => b.time - a.time).slice(0, 25);
    const refunded = (id: string) => ix.all.filter((o) => o.type === 'refund' && o.refundOf === id && o.id !== init?.id).reduce((s, o) => s + o.amount, 0);
    return (
      <>
        {!init ? (
          <div class="chips chips-wrap" role="radiogroup" aria-label="Тип операції">
            {([['saving', 'Відкласти', 'coins'], ['income', 'Дохід', 'arrowDown'], ['refund', 'Повернення', 'refund'], ['withdrawal', 'З накопичень', 'arrowUp'], ['transfer', 'Між рахунками', 'transfer']] as const).map(([id, label, ic]) => (
              <Chip on={k === id} icon={ic} onClick={() => { st.kind = id; body.refresh(); actions.refresh(); }}>{label}</Chip>
            ))}
          </div>
        ) : null}
        {k === 'saving' ? (
          <div class="stack-sm">
            {bv.status === 'deficit' ? <Note tone="warn">Зараз бракує {fmt(bv.shortfall)} на обовʼязкові платежі до {bv.nextIncome ? fmtDate(bv.nextIncome.date) : 'кінця місяця'}. Переказ у накопичення поки не рекомендується.</Note> : null}
            {bv.status === 'ok' && bv.safe !== null ? <Note tone="good">Безпечно відкласти сьогодні: <b>{fmt(bv.safe)}</b>.</Note> : null}
            <p class="hint">Кнопка лише фіксує переказ, який ти зробив сам. Гроші з банківського рахунку застосунок не списує.</p>
          </div>
        ) : null}
        {k === 'withdrawal' ? <p class="hint">Повернення грошей із накопичень — не дохід. Зменшує накопичення й повертає кошти в доступні.</p> : null}
        {k === 'transfer' ? <p class="hint">Переказ між своїми рахунками (картка → готівка тощо) не змінює ні витрат, ні доходів, ні накопичень.</p> : null}
        {k === 'refund' ? (
          <div class="stack-sm">
            <p class="hint">Повернення — окрема коригувальна операція. Привʼяжи його до покупки, і витрату того дня буде виправлено.</p>
            <div class="pick-list" role="radiogroup" aria-label="Покупка, за яку повернення">
              <button type="button" class={cx('pick', !st.refundOf && 'on')} onClick={() => { st.refundOf = ''; body.refresh(); }}>
                <span>Без привʼязки до покупки</span>{!st.refundOf ? icon('check', 18) : null}
              </button>
              {recent.map((o) => {
                const left = o.amount - refunded(o.id);
                return (
                  <button type="button" class={cx('pick', st.refundOf === o.id && 'on')} disabled={left <= 0} onClick={() => { st.refundOf = o.id; st.category = o.category ?? 'other'; st.amount = left; body.refresh(); }}>
                    <span>{opTitle(o, cats)} · {fmtDate(o.date)} · {fmt(o.amount)}{left < o.amount ? ` (лишилось ${fmt(left)})` : ''}</span>
                    {st.refundOf === o.id ? icon('check', 18) : null}
                  </button>
                );
              })}
            </div>
            {!st.refundOf ? (
              <Field label="Категорія"><Select value={st.category} label="Категорія" options={data.categories.filter((c) => !c.hidden).map((c) => ({ value: c.id, label: c.name }))} onChange={(v) => { st.category = v; }} /></Field>
            ) : null}
          </div>
        ) : null}
        <Field label="Сума"><MoneyInput value={st.amount} onChange={(v) => { st.amount = v; }} /></Field>
        {(k === 'saving' || k === 'withdrawal') && goals.length ? (
          <Field label="Ціль">
            <Select value={st.goalId} label="Ціль" options={[{ value: '', label: 'Загальні накопичення' }, ...goals.map((g) => ({ value: g.goal.id, label: `${g.goal.name} · ${g.pct}%` }))]} onChange={(v) => { st.goalId = v; }} />
          </Field>
        ) : null}
        {k === 'income' && data.settings.budget.incomes.length ? (
          <div class="chips chips-wrap">{data.settings.budget.incomes.map((i) => <Chip on={st.title === i.name} onClick={() => { st.title = i.name; if (!st.amount) st.amount = i.amount; body.refresh(); }}>{i.name}</Chip>)}</div>
        ) : null}
        <Field label={k === 'transfer' ? 'Звідки → куди' : 'Назва'}>
          <TextInput value={st.title} placeholder={k === 'transfer' ? 'Картка → готівка' : 'Необовʼязково'} onChange={(v) => { st.title = v; }} />
        </Field>
        <Field label="Нотатка"><TextInput value={st.note} max={300} placeholder="Необовʼязково" onChange={(v) => { st.note = v; }} /></Field>
        <DateRow value={st.date} onChange={(v) => { st.date = v; }} />
      </>
    );
  });

  const save = () => {
    if (!st.amount || st.amount <= 0) return toast('Вкажи суму більшу за нуль.');
    if (st.kind === 'refund' && st.refundOf) {
      const orig = ix.byId.get(st.refundOf);
      const already = ix.all.filter((o) => o.type === 'refund' && o.refundOf === st.refundOf && o.id !== init?.id).reduce((s, o) => s + o.amount, 0);
      if (orig && st.amount > orig.amount - already) return toast(`Повернення не може перевищувати покупку: максимум ${fmt(orig.amount - already)}.`);
    }
    const input: OpInput = { type: st.kind, date: st.date, amount: st.amount };
    put(input, 'title', st.title.trim());
    put(input, 'note', st.note.trim());
    put(input, 'goalId', st.kind === 'saving' || st.kind === 'withdrawal' ? st.goalId : null);
    put(input, 'refundOf', st.kind === 'refund' ? st.refundOf : null);
    put(input, 'category', st.kind === 'refund' ? st.category : null);
    const op = saveOrUpdate(init, input);
    if (op) p.onDone(op);
  };

  const labels: Record<MoreKind, string> = { saving: 'Зафіксувати переказ', income: 'Зберегти дохід', refund: 'Зберегти повернення', withdrawal: 'Зафіксувати зняття', transfer: 'Зберегти переказ' };
  const actions = live(() => (
    <div class="form-actions">
      <Btn kind="primary" size="lg" full onClick={save}>{init ? 'Зберегти зміни' : labels[st.kind]}</Btn>
      {init ? <DeleteBtn op={init} done={p.onDone} /> : null}
    </div>
  ));
  return (
    <div class="form">
      {body.el}
      {actions.el}
    </div>
  ) as HTMLElement;
}

// ── Відкривачі ───────────────────────────────────────────────────────────────

export function addedToast(op: Operation): void {
  const { cats } = derived();
  const what = op.type === 'saving' ? 'Відкладено' : op.type === 'consumption' ? 'Записано собівартість' : 'Додано';
  toast(`${what}: ${opTitle(op, cats)} — ${fmt(op.amount)}`, [{ label: 'Скасувати', run: () => purgeOperation(op.id) }]);
}

export function openQuickAdd(o: { date: string; category?: string; micro?: string; planLine?: PlanLine; mode?: 'expense' | 'trip' | 'meal' | 'more'; more?: MoreKind }): void {
  const titles = { expense: 'Нова витрата', trip: 'Поїздка', meal: 'Харчування', more: 'Операція' };
  const mode = o.mode ?? 'expense';
  openSheet({
    title: titles[mode],
    tall: mode !== 'expense',
    render: (close) => {
      const done: Done = (op) => { close(); if (op) addedToast(op); };
      if (mode === 'trip') return <TripForm date={o.date} onDone={done} />;
      if (mode === 'meal') return <MealForm date={o.date} planLine={o.planLine} onDone={done} />;
      if (mode === 'more') return <MoreForm date={o.date} kind={o.more} onDone={done} />;
      return <ExpenseForm date={o.date} category={o.category} micro={o.micro} planLine={o.planLine} onDone={done} />;
    },
  });
}

export function openOpEditor(op: Operation): void {
  openSheet({
    title: 'Редагування',
    tall: true,
    render: (close) => {
      const done: Done = (saved) => { close(); if (saved && !saved.deletedAt) toast('Зміни збережено. Підсумки перераховано.'); };
      if (op.trip) return <TripForm date={op.date} initial={op} onDone={done} />;
      if (op.meal) return <MealForm date={op.date} initial={op} onDone={done} />;
      if (op.type === 'expense') return <ExpenseForm date={op.date} initial={op} onDone={done} />;
      if (op.type === 'consumption') return <MealForm date={op.date} initial={op} onDone={done} />;
      return <MoreForm date={op.date} initial={op} onDone={done} />;
    },
  });
}

/** Миттєвий запис мікровитрати з типовою ціною (один дотик) або відкриття форми, якщо ціни немає. */
export function quickMicro(itemId: string, date: string): void {
  const { data } = derived();
  const m = data.micro.find((x) => x.id === itemId);
  if (!m) return;
  if (!m.price) {
    openQuickAdd({ date, category: m.category, micro: m.id });
    return;
  }
  const op = addOperation({ type: 'expense', date, amount: m.price, category: m.category, micro: m.id, title: m.name });
  addedToast(op);
}

/** Один дотик по рядку плану: записати витрату на заплановану суму. */
export function recordPlanLine(line: PlanLine, date: string): void {
  if (line.amount <= 0) {
    if (line.category === 'lunch') openQuickAdd({ date, mode: 'meal', planLine: line });
    else openQuickAdd({ date, category: line.category, planLine: line });
    return;
  }
  const op = addOperation({ type: 'expense', date, amount: line.amount, category: line.category, title: line.label, planLineId: line.id });
  toast(`Записано: ${line.label} — ${fmt(line.amount)}`, [
    { label: 'Змінити', run: () => openOpEditor(op) },
    { label: 'Скасувати', run: () => purgeOperation(op.id) },
  ]);
}

export function confirmDeleteForever(op: Operation): void {
  const { cats } = derived();
  confirmSheet({
    title: 'Видалити назавжди?',
    text: `«${opTitle(op, cats)}» за ${fmtDate(op.date)} (${fmt(op.amount)}) буде видалено без можливості відновлення.`,
    confirm: 'Видалити назавжди',
    danger: true,
    onConfirm: () => purgeOperation(op.id),
  });
}

/** Рядок операції для списків. */
export function OpRow(p: { op: Operation; showDate?: boolean }): HTMLElement {
  const { cats } = derived();
  const o = p.op;
  const cat = catOf(cats, o.category);
  const special: Record<string, { icon: string; color: string }> = {
    income: { icon: 'arrowDown', color: '#2C9561' },
    saving: { icon: 'coins', color: '#1E8F72' },
    withdrawal: { icon: 'arrowUp', color: '#B88A1E' },
    transfer: { icon: 'transfer', color: '#76808C' },
    refund: { icon: 'refund', color: '#3B76D6' },
  };
  const look = special[o.type] ?? { icon: o.trip ? modeInfo(o.trip.mode).icon : o.meal ? mealInfo(o.meal.kind).icon : cat.icon, color: cat.color };
  const bits: string[] = [];
  if (p.showDate) bits.push(fmtDate(o.date));
  bits.push(timeHM(o.time));
  if (o.trip) {
    if (o.trip.route) bits.push(o.trip.route);
    if (o.trip.minutes !== null) bits.push(`${o.trip.minutes + (o.trip.wait ?? 0)} хв`);
    if (o.trip.passengers > 1) bits.push(`${o.trip.passengers} пас.`);
  }
  if (o.type === 'consumption') bits.push('не рух грошей');
  if (o.estimate) bits.push(`+ ${fmt(o.estimate)} розрахунково`);
  if (o.obligationId) bits.push('обовʼязковий платіж');
  if (o.note) bits.push(o.note);
  const sign = o.type === 'income' || o.type === 'refund' || o.type === 'withdrawal' ? '+' : '';
  const tone = o.type === 'income' || o.type === 'refund' ? 'pos' : o.type === 'consumption' || o.type === 'transfer' ? 'muted' : '';
  return (
    <Row icon={look.icon} color={look.color} title={opTitle(o, cats)} sub={bits.join(' · ')} value={`${sign}${fmt(o.amount)}`} valueTone={tone} onClick={() => openOpEditor(o)} />
  ) as HTMLElement;
}

export function CatBadge(p: { id: string }): HTMLElement {
  const { cats } = derived();
  return <CatIcon cat={catOf(cats, p.id)} size={18} /> as HTMLElement;
}
