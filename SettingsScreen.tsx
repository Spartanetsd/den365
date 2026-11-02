// SettingsScreen.tsx — «Налаштування»: бюджет, план і шаблони, категорії, мікровитрати, календар, резервні копії.
import { h, Fragment, cx, live } from './dom.ts';
import { icon } from './icons.ts';
import { Btn, Chip, DateInput, Field, Group, IconBtn, MoneyInput, Note, NumInput, Row, Seg, Select, TextInput, Toggle, confirmSheet, openSheet, toast } from './ui.tsx';
import { openTemplateEditor } from './plan.tsx';
import { exportBackup, getState, importData, resetAll, restorePrevious, saveList, saveSettings, setDemoMode } from './store.ts';
import { derived, go, setUI, ui } from './view.ts';
import { budgetView, suggestedDaily } from './budget.ts';
import { calcDay, planTotal } from './ledger.ts';
import { daysCSV, opsCSV, previewMerge, validateBackup } from './backup.ts';
import { isPersisted, requestPersistence } from './db.ts';
import { saveFile, pickFile } from './share.ts';
import { makeStay } from './calendar.ts';
import { CATEGORY_COLORS, CATEGORY_ICONS, NECESSITY, NECESSITY_ORDER, OBLIGATION_KINDS, clone, uid } from './defaults.ts';
import { fmt } from './money.ts';
import { WEEKDAYS_SHORT, addDays, fmtDate, stamp } from './time.ts';
import type { BudgetSettings, Category, Income, Kop, MicroItem, Obligation, ObligationKind, Settings, Theme } from './types.ts';

export const APP_VERSION = '1.0.0';

function PageHead(p: { title: string; sub?: string }): HTMLElement {
  return (
    <header class="screen-head">
      <button type="button" class="back" onClick={() => setUI({ settingsPage: null })}>{icon('chevronLeft', 18)}Налаштування</button>
      <h1 class="h1">{p.title}</h1>
      {p.sub ? <p class="kicker">{p.sub}</p> : null}
    </header>
  ) as HTMLElement;
}

export function SettingsScreen(): Node {
  const page = ui.settingsPage;
  if (page === 'budget') return <BudgetPage />;
  if (page === 'plan') return <PlanPage />;
  if (page === 'categories') return <CategoriesPage />;
  if (page === 'micro') return <MicroPage />;
  if (page === 'travel') return <TravelPage />;
  if (page === 'calendar') return <CalendarPage />;
  if (page === 'backup') return <BackupPage />;
  if (page === 'about') return <AboutPage />;
  const { data, state } = derived();
  const s = data.settings;
  const b = s.budget;
  const open = (id: string) => () => { setUI({ settingsPage: id }); window.scrollTo(0, 0); };
  return (
    <div class="screen settings">
      <header class="screen-head">
        <h1 class="h1">Налаштування</h1>
        <p class="kicker">Усі дані — лише на цьому пристрої.</p>
      </header>
      <Group title="Оформлення">
        <div class="pad">
          <Seg value={s.theme} label="Тема" options={[{ value: 'system', label: 'Як у системі' }, { value: 'light', label: 'Світла' }, { value: 'dark', label: 'Темна' }]}
            onChange={(v: Theme) => saveSettings((x) => ({ ...x, theme: v }))} />
        </div>
      </Group>
      <Group title="Гроші">
        <Row icon="wallet" title="Бюджет і доходи" sub={b.balance ? `Залишок на ${fmtDate(b.balance.date)}: ${fmt(b.balance.amount)}` : 'Не налаштовано'} chevron onClick={open('budget')} />
        <Row icon="list" title="Денний план і шаблони" sub={`Шаблонів: ${data.templates.length}${s.autoPlan.work || s.autoPlan.off ? ', автоплан увімкнено' : ''}`} chevron onClick={open('plan')} />
        <Row icon="box" title="Категорії" sub={`${data.categories.filter((c) => !c.hidden).length} активних`} chevron onClick={open('categories')} />
        <Row icon="coffee" title="Кава й дрібні витрати" sub={s.joyBudget !== null ? `Бюджет радості ${fmt(s.joyBudget)} на день` : 'Швидкі кнопки і бюджет радості'} chevron onClick={open('micro')} />
        <Row icon="taxi" title="Транспорт і харчування" sub="Цінність години, типовий проїзд, обід у їдальні" chevron onClick={open('travel')} />
      </Group>
      <Group title="Час">
        <Row icon="calendar" title="Календар" sub={`Робочих днів на тиждень: ${s.calendar.workdays.filter(Boolean).length}${s.calendar.stays.length ? `, періодів у Дніпрі: ${s.calendar.stays.length}` : ''}`} chevron onClick={open('calendar')} />
      </Group>
      <Group title="Дані">
        <Row icon="shield" title="Резервні копії" sub="Експорт JSON і CSV, відновлення" chevron onClick={open('backup')} />
        <div class="row">
          <span class="row-icon">{icon('spark', 18)}</span>
          <span class="row-main"><span class="row-title">Демо-режим</span><span class="row-sub">Вигадані дані в окремій базі — особиста історія не змінюється</span></span>
          <Toggle checked={state.demo} label="Демо-режим" onChange={async (v) => { await setDemoMode(v); go('day', { dayDate: null }); toast(v ? 'Демо-режим: вигадані дані.' : 'Повернулися до твоїх даних.'); }} />
        </div>
        <Row icon="info" title="Про застосунок і конфіденційність" chevron onClick={open('about')} />
      </Group>
      <Group>
        <Row icon="trash" title="Скинути всі дані" sub={state.demo ? 'Недоступно в демо-режимі' : 'Перед скиданням буде збережено попередню копію'} onClick={state.demo ? undefined : () => confirmSheet({
          title: 'Скинути всі дані?',
          text: 'Операції, плани, цілі й налаштування буде очищено. Попередню копію можна буде повернути в «Резервних копіях». Радимо спершу зробити експорт.',
          confirm: 'Скинути',
          danger: true,
          onConfirm: async () => { await resetAll(); go('day', { dayDate: null }); },
        })} class="danger-row" />
      </Group>
      <p class="hint center">ДЕНЬ × 365 · версія {APP_VERSION}</p>
    </div>
  );
}

// ── Бюджет і доходи ──────────────────────────────────────────────────────────

function BudgetPage(): Node {
  const { data, today } = derived();
  const d: BudgetSettings = clone(data.settings.budget);
  const bal = { amount: d.balance?.amount ?? null as Kop | null, date: d.balance?.date ?? today };

  const preview = live(() => {
    const { ix, cats } = derived();
    const draft: Settings = { ...data.settings, budget: { ...d, balance: bal.amount !== null ? { amount: bal.amount, date: bal.date } : null } };
    const c = calcDay(ix, today, data.days[today], cats);
    const v = budgetView({ ix, settings: draft, days: data.days, today, todayCalc: c, todayClosed: Boolean(data.days[today]?.closed) });
    if (v.status === 'unknown') return <Note tone="info">Вкажи доступні кошти — і тут зʼявиться розрахунок вільних грошей.</Note>;
    return (
      <div class="budget-preview">
        <div class="kv"><span>Доступно зараз</span><b class="num">{fmt(v.available ?? 0)}</b></div>
        <div class="kv"><span>Обовʼязкові до {fmtDate(v.horizonEnd)}</span><b class="num">−{fmt(v.reserveObligations)}</b></div>
        <div class="kv"><span>Щоденні потреби ({v.dailyDays} дн.)</span><b class="num">−{fmt(v.reserveDaily + v.reserveToday)}</b></div>
        <div class="kv"><span>Запас безпеки</span><b class="num">−{fmt(v.buffer)}</b></div>
        <div class={cx('kv strong', v.status === 'deficit' ? 'neg' : 'pos')}><span>{v.status === 'deficit' ? 'Бракує' : 'Вільні кошти'}</span><b class="num">{fmt(v.free ?? 0)}</b></div>
      </div>
    );
  });

  const incomes = live(() => (
    <div class="list-edit">
      {d.incomes.map((inc: Income, i) => (
        <div class="list-item">
          <TextInput value={inc.name} placeholder="Назва доходу" label="Назва доходу" onChange={(v) => { inc.name = v; }} />
          <div class="line-row">
            <MoneyInput value={inc.amount || null} label="Сума на місяць" onChange={(v) => { inc.amount = v ?? 0; preview.refresh(); }} />
            <NumInput value={inc.day} suffix="число" label="День місяця" onChange={(v) => { inc.day = Math.min(31, Math.max(1, v ?? 1)); preview.refresh(); }} />
            <IconBtn icon="trash" label="Прибрати дохід" onClick={() => { d.incomes.splice(i, 1); incomes.refresh(); preview.refresh(); }} />
          </div>
        </div>
      ))}
      <Btn kind="tinted" icon="plus" onClick={() => { d.incomes.push({ id: uid('inc-'), name: d.incomes.length ? 'Інші надходження' : 'Місячний чистий дохід', amount: 0, day: 1 }); incomes.refresh(); }}>Додати дохід</Btn>
    </div>
  ));

  const obligations = live(() => (
    <div class="list-edit">
      {d.obligations.map((o: Obligation, i) => (
        <div class="list-item">
          <div class="line-row">
            <TextInput value={o.name} placeholder="Назва платежу" label="Назва платежу" onChange={(v) => { o.name = v; }} />
            <Select value={o.kind} label="Вид платежу" options={(Object.keys(OBLIGATION_KINDS) as ObligationKind[]).map((k) => ({ value: k, label: OBLIGATION_KINDS[k] }))} onChange={(v) => { o.kind = v as ObligationKind; }} />
          </div>
          <div class="line-row">
            <MoneyInput value={o.amount || null} label="Сума" onChange={(v) => { o.amount = v ?? 0; preview.refresh(); }} />
            <NumInput value={o.day} suffix="число" label="День місяця" onChange={(v) => { o.day = Math.min(31, Math.max(1, v ?? 1)); preview.refresh(); }} />
            <IconBtn icon="trash" label="Прибрати платіж" onClick={() => { d.obligations.splice(i, 1); obligations.refresh(); preview.refresh(); }} />
          </div>
        </div>
      ))}
      <div class="chips chips-wrap">
        {(Object.keys(OBLIGATION_KINDS) as ObligationKind[]).map((k) => (
          <Chip icon="plus" onClick={() => { d.obligations.push({ id: uid('obl-'), name: OBLIGATION_KINDS[k], kind: k, amount: 0, day: 1 }); obligations.refresh(); }}>{OBLIGATION_KINDS[k]}</Chip>
        ))}
      </div>
    </div>
  ));

  const suggest = suggestedDaily({ ...data.settings, budget: d }, today);
  const save = () => {
    d.incomes = d.incomes.filter((x) => x.amount > 0).map((x) => ({ ...x, name: x.name.trim() || 'Дохід' }));
    d.obligations = d.obligations.filter((x) => x.amount > 0).map((x) => ({ ...x, name: x.name.trim() || OBLIGATION_KINDS[x.kind] }));
    d.balance = bal.amount !== null ? { amount: bal.amount, date: bal.date } : null;
    saveSettings((s) => ({ ...s, budget: d }));
    toast('Бюджет збережено.');
  };

  return (
    <div class="screen settings">
      <PageHead title="Бюджет і доходи" sub="Усе необовʼязково й змінюється вручну. Цифри зберігаються лише на пристрої." />
      <Group title="Доступні кошти" foot="Сума на початок указаного дня. Операції цього дня й пізніше застосуються автоматично. Майбутні доходи сюди не входять.">
        <div class="pad grid2">
          <Field label="Сума"><MoneyInput value={bal.amount} onChange={(v) => { bal.amount = v; preview.refresh(); }} /></Field>
          <Field label="На початок дня"><DateInput value={bal.date} max={today} onChange={(v) => { bal.date = v; preview.refresh(); }} /></Field>
        </div>
      </Group>
      <Group title="Доходи" foot="Дата отримання потрібна, щоб резервувати платежі й щоденні витрати саме до наступного доходу.">
        <div class="pad">{incomes.el}</div>
      </Group>
      <Group title="Обовʼязкові платежі" foot="Оренда, комунальні, кредити й розстрочки. Вони не входять у денний бюджет.">
        <div class="pad">{obligations.el}</div>
      </Group>
      <Group title="Резерви й цілі">
        <div class="pad stack-sm">
          <Field label="Фінансова подушка — уже накопичено" hint="Стартова сума накопичень."><MoneyInput value={d.savingsStart || null} onChange={(v) => { d.savingsStart = v ?? 0; }} /></Field>
          <Field label="Мінімальний залишок безпеки" hint="Ця сума ніколи не пропонується до відкладання."><MoneyInput value={d.buffer || null} onChange={(v) => { d.buffer = v ?? 0; preview.refresh(); }} /></Field>
          <Field label="Місячна ціль заощаджень"><MoneyInput value={d.monthlyGoal} onChange={(v) => { d.monthlyGoal = v; }} /></Field>
          <Field label="Орієнтовні щоденні витрати" hint={suggest !== null ? `Підказка з доходів і платежів: ≈ ${fmt(suggest, { decimals: 'never' })} на день. Якщо не вказати — береться медіана твоїх днів.` : 'Якщо не вказати — береться медіана твоїх останніх днів або план.'}>
            <MoneyInput value={d.dailyEstimate} onChange={(v) => { d.dailyEstimate = v; preview.refresh(); }} />
          </Field>
          <div class="grid2">
            <Field label="Транспорт на місяць"><MoneyInput value={d.flexTransport} onChange={(v) => { d.flexTransport = v; }} /></Field>
            <Field label="Продукти на місяць"><MoneyInput value={d.flexGroceries} onChange={(v) => { d.flexGroceries = v; }} /></Field>
          </div>
        </div>
      </Group>
      <Group title="Що виходить">
        <div class="pad">{preview.el}</div>
      </Group>
      <div class="sticky-save"><Btn kind="primary" size="lg" full onClick={save}>Зберегти бюджет</Btn></div>
    </div>
  );
}

// ── План і шаблони ───────────────────────────────────────────────────────────

function PlanPage(): Node {
  const { data } = derived();
  const s = data.settings;
  const opts = [{ value: '', label: 'Не застосовувати' }, ...data.templates.map((t) => ({ value: t.id, label: `${t.name} · ${fmt(planTotal(t.lines))}` }))];
  return (
    <div class="screen settings">
      <PageHead title="Денний план і шаблони" />
      <Group title="Автоплан" foot="Якщо для нового дня ще немає плану, застосунок сам підставить шаблон. Можна будь-коли змінити.">
        <div class="pad stack-sm">
          <Field label="Робочі дні"><Select value={s.autoPlan.work ?? ''} label="Шаблон для робочих днів" options={opts} onChange={(v) => saveSettings((x) => ({ ...x, autoPlan: { ...x.autoPlan, work: v || null } }))} /></Field>
          <Field label="Вихідні"><Select value={s.autoPlan.off ?? ''} label="Шаблон для вихідних" options={opts} onChange={(v) => saveSettings((x) => ({ ...x, autoPlan: { ...x.autoPlan, off: v || null } }))} /></Field>
        </div>
      </Group>
      <Group title="Шаблони" foot="Суми в стандартних шаблонах — приклад, а не актуальні ціни в Дніпрі.">
        {data.templates.map((t) => <Row icon="list" title={t.name} sub={t.lines.map((l) => l.label).join(', ') || 'порожній'} value={fmt(planTotal(t.lines))} chevron onClick={() => openTemplateEditor(t)} />)}
        <div class="group-actions"><Btn kind="tinted" icon="plus" onClick={() => openTemplateEditor(null)}>Новий шаблон</Btn></div>
      </Group>
    </div>
  );
}

// ── Категорії ────────────────────────────────────────────────────────────────

function CategoriesPage(): Node {
  const { data, ix } = derived();
  return (
    <div class="screen settings">
      <PageHead title="Категорії" sub="Назви, кольори, значки й тип витрат за замовчуванням." />
      <Group>
        {data.categories.map((c) => (
          <Row icon={c.icon} color={c.color} title={c.name} sub={`${NECESSITY[c.necessity].label}${c.hidden ? ', прихована' : ''}`} chevron onClick={() => openCategoryEditor(c, ix.all.some((o) => o.category === c.id))} />
        ))}
        <div class="group-actions"><Btn kind="tinted" icon="plus" onClick={() => openCategoryEditor(null, false)}>Нова категорія</Btn></div>
      </Group>
    </div>
  );
}

function openCategoryEditor(cat: Category | null, used: boolean): void {
  const draft: Category = cat ? clone(cat) : { id: uid('cat-'), name: '', icon: 'box', color: CATEGORY_COLORS[7], necessity: 'flexible', micro: false };
  openSheet({
    title: cat ? 'Категорія' : 'Нова категорія',
    tall: true,
    render: (close) => {
      const picks = live(() => (
        <div class="stack-sm">
          <p class="field-label">Значок</p>
          <div class="icon-grid">{CATEGORY_ICONS.map((i) => <button type="button" class={cx('icon-pick', draft.icon === i && 'on')} style={`--c:${draft.color}`} aria-label={i} onClick={() => { draft.icon = i; picks.refresh(); }}>{icon(i, 20)}</button>)}</div>
          <p class="field-label">Колір</p>
          <div class="color-grid">{CATEGORY_COLORS.map((c) => <button type="button" class={cx('color-pick', draft.color === c && 'on')} style={`--c:${c}`} aria-label={`Колір ${c}`} onClick={() => { draft.color = c; picks.refresh(); }} />)}</div>
        </div>
      ));
      return (
        <div class="stack">
          <Field label="Назва"><TextInput value={draft.name} max={40} placeholder="Наприклад: Здоровʼя" onChange={(v) => { draft.name = v; }} /></Field>
          {picks.el}
          <Field label="Тип витрат за замовчуванням"><Select value={draft.necessity} label="Тип витрат" options={NECESSITY_ORDER.map((n) => ({ value: n, label: NECESSITY[n].label }))} onChange={(v) => { draft.necessity = v as Category['necessity']; }} /></Field>
          <div class="toggle-row"><span>Дрібні приємності<small>Враховується в «Маленьких грошах» і бюджеті радості.</small></span><Toggle checked={draft.micro} label="Дрібні приємності" onChange={(v) => { draft.micro = v; }} /></div>
          <div class="toggle-row"><span>Сховати категорію<small>Старі записи залишаться в історії.</small></span><Toggle checked={Boolean(draft.hidden)} label="Сховати" onChange={(v) => { draft.hidden = v; }} /></div>
          <Btn kind="primary" size="lg" full onClick={() => {
            if (!draft.name.trim()) return toast('Вкажи назву.');
            draft.name = draft.name.trim();
            const list = derived().data.categories;
            saveList('categories', list.some((x) => x.id === draft.id) ? list.map((x) => (x.id === draft.id ? draft : x)) : [...list, draft]);
            close();
          }}>Зберегти</Btn>
          {cat && !cat.builtin ? (
            <Btn kind="ghost" full icon="trash" disabled={used} onClick={() => confirmSheet({
              title: 'Видалити категорію?', text: 'Категорія зникне зі списку.', confirm: 'Видалити', danger: true,
              onConfirm: () => { saveList('categories', derived().data.categories.filter((x) => x.id !== cat.id)); close(); },
            })}>{used ? 'Є записи — категорію можна лише сховати' : 'Видалити категорію'}</Btn>
          ) : null}
        </div>
      );
    },
  });
}

// ── Мікровитрати ─────────────────────────────────────────────────────────────

function MicroPage(): Node {
  const { data } = derived();
  const items: MicroItem[] = clone(data.micro);
  let joy = data.settings.joyBudget;
  const list = live(() => (
    <div class="list-edit">
      {items.map((m, i) => (
        <div class="micro-item">
          <span class="row-icon" style={`--c:${data.categories.find((c) => c.id === m.category)?.color ?? '#888'}`}>{icon(m.icon, 18)}</span>
          <TextInput value={m.name} label="Назва" onChange={(v) => { m.name = v; }} />
          <MoneyInput value={m.price} label={`Типова ціна: ${m.name}`} placeholder="ціна" onChange={(v) => { m.price = v; }} />
          <button type="button" class={cx('star-toggle', m.quick && 'on')} aria-pressed={m.quick ? 'true' : 'false'} aria-label={m.quick ? 'Прибрати зі швидких кнопок' : 'Додати до швидких кнопок'} onClick={() => { m.quick = !m.quick; list.refresh(); }}>{icon('star', 18)}</button>
          {!['q-coffee', 'q-treat', 'q-water'].includes(m.id) && m.id.startsWith('m-') ? <IconBtn icon="trash" label="Прибрати" onClick={() => { items.splice(i, 1); list.refresh(); }} /> : null}
        </div>
      ))}
      <div class="chips chips-wrap">
        <Chip icon="plus" onClick={() => { items.push({ id: uid('m-'), name: 'Нова позиція', category: 'treats', icon: 'candy', price: null, quick: true }); list.refresh(); }}>Смаколик</Chip>
        <Chip icon="plus" onClick={() => { items.push({ id: uid('m-'), name: 'Новий напій', category: 'coffee', icon: 'cup', price: null, quick: true }); list.refresh(); }}>Напій</Chip>
      </div>
    </div>
  ));
  return (
    <div class="screen settings">
      <PageHead title="Кава й дрібні витрати" sub="Зірочка — показувати як швидку кнопку на головному екрані. Ціни — твої, а не довідкові." />
      <Group title="Бюджет радості" foot="Сума на маленькі приємності щодня. У її межах застосунок не робить зауважень.">
        <div class="pad"><MoneyInput value={joy} onChange={(v) => { joy = v; }} /></div>
      </Group>
      <Group title="Позиції">
        <div class="pad">{list.el}</div>
      </Group>
      <div class="sticky-save"><Btn kind="primary" size="lg" full onClick={() => {
        saveList('micro', items.map((m) => ({ ...m, name: m.name.trim() || 'Без назви' })));
        saveSettings((s) => ({ ...s, joyBudget: joy }));
        toast('Збережено.');
      }}>Зберегти</Btn></div>
    </div>
  );
}

// ── Транспорт і харчування ──────────────────────────────────────────────────

function TravelPage(): Node {
  const { data } = derived();
  const d = { hourValue: data.settings.hourValue, publicFare: data.settings.publicFare, canteenPrice: data.settings.canteenPrice };
  return (
    <div class="screen settings">
      <PageHead title="Транспорт і харчування" sub="Застосунок не вигадує тарифів — лише твої значення й історія." />
      <Group foot="Скільки для тебе умовно коштує година часу. Потрібно для «Ціни комфорту»: коли доплата за таксі справді купує час.">
        <div class="pad"><Field label="Цінність години часу"><MoneyInput value={d.hourValue} onChange={(v) => { d.hourValue = v; }} /></Field></div>
      </Group>
      <Group foot="Якщо не вказати, береться медіана твоїх поїздок громадським транспортом.">
        <div class="pad"><Field label="Типова поїздка громадським транспортом"><MoneyInput value={d.publicFare} onChange={(v) => { d.publicFare = v; }} /></Field></div>
      </Group>
      <Group foot="Для порівняння «Домашній обід чи їдальня?». Якщо не вказати — медіана твоїх обідів у їдальні.">
        <div class="pad"><Field label="Обід у їдальні"><MoneyInput value={d.canteenPrice} onChange={(v) => { d.canteenPrice = v; }} /></Field></div>
      </Group>
      <div class="sticky-save"><Btn kind="primary" size="lg" full onClick={() => { saveSettings((s) => ({ ...s, ...d })); toast('Збережено.'); }}>Зберегти</Btn></div>
    </div>
  );
}

// ── Календар ─────────────────────────────────────────────────────────────────

function CalendarPage(): Node {
  const { data, today } = derived();
  const cal = data.settings.calendar;
  const save = (fn: (c: Settings['calendar']) => Settings['calendar']) => saveSettings((s) => ({ ...s, calendar: fn(clone(s.calendar)) }));
  const stay = { from: today, days: 14, label: 'Навчання у Дніпрі' };
  const ov = { date: addDays(today, 1), kind: 'off' as 'work' | 'off' };
  const overrides = Object.entries(cal.overrides).sort((a, b) => (a[0] < b[0] ? -1 : 1));
  return (
    <div class="screen settings">
      <PageHead title="Календар" sub="Прогнози рахують робочі й вихідні дні окремо — за цим календарем." />
      <Group title="Робочі дні тижня">
        <div class="pad chips">
          {WEEKDAYS_SHORT.map((w, i) => <Chip on={cal.workdays[i]} onClick={() => save((c) => { c.workdays[i] = !c.workdays[i]; return c; })}>{w}</Chip>)}
        </div>
      </Group>
      <Group title="Перебування в Дніпрі" foot="Можна рахувати прогноз лише для цих днів.">
        {cal.stays.map((s) => <Row icon="map" title={s.label || 'Перебування'} sub={`${fmtDate(s.from)} — ${fmtDate(s.to, { year: true })}`} right={<IconBtn icon="trash" label="Прибрати період" onClick={() => save((c) => ({ ...c, stays: c.stays.filter((x) => x.id !== s.id) }))} />} />)}
        <div class="pad stack-sm">
          <div class="grid2">
            <Field label="Від"><DateInput value={stay.from} onChange={(v) => { stay.from = v; }} /></Field>
            <Field label="Назва"><TextInput value={stay.label} onChange={(v) => { stay.label = v; }} /></Field>
          </div>
          <div class="chips chips-wrap">
            {[5, 7, 14, 30].map((n) => <Chip icon="plus" onClick={() => save((c) => ({ ...c, stays: [...c.stays, makeStay(uid('stay-'), stay.from, n, stay.label)] }))}>{n === 30 ? 'Місяць' : `${n} днів`}</Chip>)}
            <Chip icon="plus" onClick={() => openCustomStay(stay.from, stay.label)}>Довільний період</Chip>
          </div>
        </div>
      </Group>
      <Group title="Винятки" foot="Наприклад, робоча субота чи вихідний посеред тижня. Під час воєнного стану святкові дні можуть бути робочими — познач їх самостійно.">
        {overrides.map(([d, k]) => <Row icon="calendar" title={fmtDate(d, { weekday: true, year: true })} sub={k === 'work' ? 'робочий' : 'вихідний'} right={<IconBtn icon="trash" label="Прибрати виняток" onClick={() => save((c) => { delete c.overrides[d]; return c; })} />} />)}
        <div class="pad grid2">
          <DateInput value={ov.date} label="Дата винятку" onChange={(v) => { ov.date = v; }} />
          <Select value={ov.kind} label="Тип дня" options={[{ value: 'off', label: 'Вихідний' }, { value: 'work', label: 'Робочий' }]} onChange={(v) => { ov.kind = v as 'work' | 'off'; }} />
        </div>
        <div class="group-actions"><Btn kind="tinted" icon="plus" onClick={() => save((c) => ({ ...c, overrides: { ...c.overrides, [ov.date]: ov.kind } }))}>Додати виняток</Btn></div>
      </Group>
    </div>
  );
}

function openCustomStay(from: string, label: string): void {
  const st = { from, to: addDays(from, 9), label };
  openSheet({
    title: 'Довільний період',
    render: (close) => (
      <div class="stack">
        <div class="grid2">
          <Field label="Від"><DateInput value={st.from} onChange={(v) => { st.from = v; }} /></Field>
          <Field label="До"><DateInput value={st.to} onChange={(v) => { st.to = v; }} /></Field>
        </div>
        <Field label="Назва"><TextInput value={st.label} onChange={(v) => { st.label = v; }} /></Field>
        <Btn kind="primary" size="lg" full onClick={() => {
          if (st.to < st.from) return toast('Кінець не може бути раніше за початок.');
          saveSettings((s) => ({ ...s, calendar: { ...s.calendar, stays: [...s.calendar.stays, { id: uid('stay-'), from: st.from, to: st.to, label: st.label.trim() }] } }));
          close();
        }}>Додати період</Btn>
      </div>
    ),
  });
}

// ── Резервні копії ───────────────────────────────────────────────────────────

function BackupPage(): Node {
  const { state, today, data } = derived();
  const kinds = { idb: 'IndexedDB у браузері', local: 'localStorage (резервний варіант)', memory: 'лише памʼять — дані зникнуть після закриття' };
  const persisted = <span class="hint">перевіряю…</span> as HTMLElement;
  isPersisted().then((v) => { persisted.textContent = v === true ? 'захищене від автоматичного очищення' : v === false ? 'браузер може очистити дані при нестачі місця' : 'інформація недоступна'; });
  const exportJSON = async () => {
    const r = await saveFile(`den-365-backup-${today}${state.demo ? '-demo' : ''}.json`, 'application/json', JSON.stringify(exportBackup(), null, 1));
    if (r !== 'cancelled') toast('Копію збережено.');
  };
  return (
    <div class="screen settings">
      <PageHead title="Резервні копії" />
      <Note tone="warn">Дані зберігаються лише на цьому пристрої й автоматично <b>не синхронізуються</b>. Очищення даних Safari або видалення застосунку з екрана «Додому» може їх стерти. Роби копію регулярно — наприклад, щотижня.</Note>
      <Group title="Експорт">
        <Row icon="download" title="Резервна копія (JSON)" sub="Повна копія для відновлення" chevron onClick={exportJSON} />
        <Row icon="bars" title="Операції (CSV)" sub="Для Excel чи Таблиць: «;», копійки через кому" chevron onClick={() => saveFile(`den-365-operations-${today}.csv`, 'text/csv', opsCSV(data))} />
        <Row icon="calendar" title="Підсумки днів (CSV)" sub="План, факт, різниця по днях" chevron onClick={() => saveFile(`den-365-days-${today}.csv`, 'text/csv', daysCSV(data, today))} />
      </Group>
      <Group title="Відновлення" foot="Перед імпортом поточні дані автоматично зберігаються як попередня копія.">
        <Row icon="upload" title="Відновити з файлу JSON" sub="Перевірка структури, без дублювання записів" chevron onClick={importFlow} />
        {state.prevBackup ? (
          <Row icon="repeat" title="Повернути попередню копію" sub={`Збережена ${stamp(state.prevBackup.at)}, записів: ${state.prevBackup.ops}`} chevron onClick={() => confirmSheet({
            title: 'Повернути попередню копію?',
            text: 'Поточні дані теж буде збережено як попередню копію — це можна буде скасувати.',
            confirm: 'Повернути',
            onConfirm: async () => { if (await restorePrevious()) toast('Попередню копію відновлено.'); },
          })} />
        ) : null}
      </Group>
      <Group title="Сховище">
        <Row icon="lock" title="Де зберігаються дані" sub={kinds[state.backend]} />
        <div class="row"><span class="row-icon">{icon('shield', 18)}</span><span class="row-main"><span class="row-title">Стан</span>{persisted}</span>
          <Btn kind="tinted" size="sm" onClick={async () => { const r = await requestPersistence(); toast(r ? 'Браузер погодився зберігати дані.' : 'Браузер не підтвердив. Встанови застосунок на екран «Додому» й роби копії.'); setUI({}); }}>Попросити</Btn>
        </div>
      </Group>
    </div>
  );
}

async function importFlow(): Promise<void> {
  const file = await pickFile('application/json,.json');
  if (!file) return;
  let raw: unknown;
  try {
    raw = JSON.parse(await file.text());
  } catch {
    toast('Файл пошкоджений або це не JSON.');
    return;
  }
  const v = validateBackup(raw);
  if (!v.ok) {
    openSheet({ title: 'Не вдалося прочитати копію', render: () => <div class="stack">{v.errors.map((e) => <Note tone="warn">{e}</Note>)}</div> });
    return;
  }
  const cur = getState();
  const stats = previewMerge(cur.data, v.data);
  openSheet({
    title: 'Відновлення з копії',
    render: (close) => (
      <div class="stack">
        <p class="lead">У файлі: {v.data.ops.length} записів, {Object.keys(v.data.days).length} днів, цілей: {v.data.goals.length}.</p>
        {v.demo ? <Note tone="warn">Це копія з демо-режиму — дані в ній вигадані.</Note> : null}
        {cur.demo ? <Note tone="warn">Зараз увімкнено демо-режим: копію буде відновлено в демо-базу. Щоб відновити особисті дані, спершу вимкни демо.</Note> : null}
        {v.warnings.map((w) => <Note tone="info">{w}</Note>)}
        <Group>
          <Row title="Нових записів" value={String(stats.added)} />
          <Row title="Оновлених (новіша версія)" value={String(stats.updated)} />
          <Row title="Повторів — буде пропущено" value={String(stats.duplicates)} valueTone="muted" />
          <Row title="Нових днів" value={String(stats.daysAdded + stats.daysUpdated)} />
        </Group>
        <Btn kind="primary" size="lg" full onClick={async () => {
          const r = await importData(v.data, 'merge');
          close();
          toast(r ? `Додано ${r.added}, оновлено ${r.updated}, повторів пропущено ${r.duplicates}.` : 'Готово.');
        }}>Обʼєднати з поточними даними</Btn>
        <Btn kind="secondary" size="lg" full onClick={() => confirmSheet({
          title: 'Замінити всі дані?',
          text: 'Поточні дані буде замінено копією. Їх збережемо як попередню копію — повернути можна в цьому ж розділі.',
          confirm: 'Замінити',
          danger: true,
          onConfirm: async () => { await importData(v.data, 'replace'); close(); toast('Дані замінено копією.'); },
        })}>Замінити всі дані копією</Btn>
      </div>
    ),
  });
}

// ── Про застосунок ───────────────────────────────────────────────────────────

function AboutPage(): Node {
  return (
    <div class="screen settings">
      <PageHead title="Про застосунок" />
      <div class="prose">
        <p><b>ДЕНЬ × 365</b> — персональний фінансовий радник для щоденних рішень: план дня, швидкий облік, безпечна сума для накопичень і одна доречна порада ввечері.</p>
        <h3>Конфіденційність</h3>
        <p>Без реєстрації, реклами, аналітики й серверів. Особисті фінансові дані зберігаються лише на цьому пристрої і нікуди не надсилаються. Порадник працює локально, без платних сервісів і без інтернету.</p>
        <h3>Як рахуються гроші</h3>
        <ul>
          <li>Усі суми зберігаються в цілих копійках — без похибок округлення.</li>
          <li>Витрати, доходи, повернення, перекази між рахунками й у накопичення обліковуються окремо.</li>
          <li>Обід із уже куплених продуктів — лише собівартість, без повторного списання.</li>
          <li>Невитрачений бюджет — не заощадження, доки гроші не відкладено.</li>
          <li>День без записів — це «немає даних», а не нульові витрати.</li>
          <li>Дати — за київським часом, незалежно від налаштувань пристрою.</li>
        </ul>
        <h3>Поради</h3>
        <p>Поради сформульовано як принципи «за мотивами підходу» відомих інвесторів і авторів. Це не дослівні цитати й не індивідуальна інвестиційна консультація.</p>
        <p class="hint">Версія {APP_VERSION}</p>
      </div>
    </div>
  );
}
