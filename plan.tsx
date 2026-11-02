// plan.tsx — редактор плану дня і рядків шаблону.
import { h, Fragment, live } from './dom.ts';
import { icon } from './icons.ts';
import type { PlanLine, Template } from './types.ts';
import { Btn, Chip, IconBtn, MoneyInput, Note, Select, TextInput, confirmSheet, openSheet, toast } from './ui.tsx';
import { saveList, setDayPlan } from './store.ts';
import { derived } from './view.ts';
import { clone, uid } from './defaults.ts';
import { planTotal } from './ledger.ts';
import { fmt } from './money.ts';
import { fmtDate } from './time.ts';

/** Список рядків плану з назвою, категорією й сумою. */
export function LinesEditor(p: { lines: PlanLine[]; onChange: (lines: PlanLine[]) => void }): HTMLElement {
  const { data } = derived();
  const cats = data.categories.filter((c) => !c.hidden && c.id !== 'bills');
  const lines = p.lines;
  const total = live(() => <div class="lines-total"><span>Разом</span><b class="num">{fmt(planTotal(lines))}</b></div>);
  const list = live(() => (
    <div class="lines">
      {lines.map((l, i) => (
        <div class="line">
          <TextInput value={l.label} placeholder="Назва" label="Назва рядка" onChange={(v) => { l.label = v; p.onChange(lines); }} />
          <div class="line-row">
            <Select value={l.category} label="Категорія" options={cats.map((c) => ({ value: c.id, label: c.name }))} onChange={(v) => { l.category = v; p.onChange(lines); }} />
            <MoneyInput value={l.amount} label="Сума" onChange={(v) => { l.amount = v ?? 0; p.onChange(lines); total.refresh(); }} />
            <IconBtn icon="trash" label="Прибрати рядок" onClick={() => { lines.splice(i, 1); p.onChange(lines); list.refresh(); total.refresh(); }} />
          </div>
        </div>
      ))}
      {!lines.length ? <p class="hint">Рядків поки немає.</p> : null}
    </div>
  ));
  return (
    <div class="stack-sm">
      {list.el}
      <Btn kind="tinted" icon="plus" onClick={() => { lines.push({ id: uid('l-'), label: '', category: 'other', amount: 0 }); p.onChange(lines); list.refresh(); }}>Додати рядок</Btn>
      {total.el}
    </div>
  ) as HTMLElement;
}

export function openPlanEditor(date: string): void {
  const { data } = derived();
  const rec = data.days[date];
  let lines: PlanLine[] = clone(rec?.plan ?? []);
  let templateId = rec?.templateId;
  openSheet({
    title: `План на ${fmtDate(date)}`,
    tall: true,
    render: (close) => {
      const editor = live(() => <LinesEditor lines={lines} onChange={(l) => { lines = l; }} />);
      return (
        <div class="stack">
          <div>
            <p class="field-label">Почати з шаблону</p>
            <div class="chips chips-wrap">
              {data.templates.map((t) => (
                <Chip icon="list" onClick={() => { lines = clone(t.lines); templateId = t.id; editor.refresh(); }}>{t.name} · {fmt(planTotal(t.lines))}</Chip>
              ))}
            </div>
          </div>
          <p class="hint">Суми в шаблонах — приклад, а не актуальні ціни. Зміни їх під себе.</p>
          {editor.el}
          <Btn kind="primary" size="lg" full onClick={() => {
            const clean = lines.filter((l) => l.label.trim() || l.amount > 0).map((l) => ({ ...l, label: l.label.trim() || 'Без назви' }));
            setDayPlan(date, clean.length ? clean : null, templateId && sameAsTemplate(clean, templateId) ? 'template' : 'manual', templateId);
            close();
            toast(clean.length ? `План збережено: ${fmt(planTotal(clean))}` : 'План прибрано.');
          }}>Зберегти план</Btn>
          <Btn kind="ghost" size="md" full icon="copy" onClick={() => saveAsTemplate(lines)}>Зберегти як шаблон</Btn>
          {rec?.plan ? (
            <Btn kind="ghost" size="md" full icon="trash" onClick={() => confirmSheet({
              title: 'Прибрати план?',
              text: 'Записані витрати залишаться, зникне лише порівняння з планом.',
              confirm: 'Прибрати план',
              danger: true,
              onConfirm: () => { setDayPlan(date, null, undefined); close(); },
            })}>Прибрати план</Btn>
          ) : null}
        </div>
      );
    },
  });
}

function sameAsTemplate(lines: PlanLine[], id: string): boolean {
  const t = derived().data.templates.find((x) => x.id === id);
  return Boolean(t) && JSON.stringify(t!.lines) === JSON.stringify(lines);
}

function saveAsTemplate(lines: PlanLine[]): void {
  let name = '';
  openSheet({
    title: 'Новий шаблон',
    render: (close) => (
      <div class="stack">
        <TextInput value="" placeholder="Назва шаблону" label="Назва шаблону" onChange={(v) => { name = v; }} />
        <Btn kind="primary" size="lg" full onClick={() => {
          if (!name.trim()) return toast('Вкажи назву шаблону.');
          const { data } = derived();
          const t: Template = { id: uid('tpl-'), name: name.trim(), lines: clone(lines).filter((l) => l.label.trim() || l.amount > 0) };
          saveList('templates', [...data.templates, t]);
          close();
          toast(`Шаблон «${t.name}» збережено.`);
        }}>Зберегти шаблон</Btn>
      </div>
    ),
  });
}

export function openTemplateEditor(t: Template | null): void {
  const { data } = derived();
  const draft: Template = t ? clone(t) : { id: uid('tpl-'), name: '', lines: [] };
  openSheet({
    title: t ? 'Шаблон' : 'Новий шаблон',
    tall: true,
    render: (close) => (
      <div class="stack">
        <TextInput value={draft.name} placeholder="Назва шаблону" label="Назва шаблону" onChange={(v) => { draft.name = v; }} />
        {draft.builtin ? <Note tone="info">Суми — лише приклад. Зміни їх під свої реальні витрати.</Note> : null}
        <LinesEditor lines={draft.lines} onChange={(l) => { draft.lines = l; }} />
        <Btn kind="primary" size="lg" full onClick={() => {
          if (!draft.name.trim()) return toast('Вкажи назву шаблону.');
          draft.name = draft.name.trim();
          draft.lines = draft.lines.filter((l) => l.label.trim() || l.amount > 0).map((l) => ({ ...l, label: l.label.trim() || 'Без назви' }));
          const list = derived().data.templates;
          saveList('templates', list.some((x) => x.id === draft.id) ? list.map((x) => (x.id === draft.id ? draft : x)) : [...list, draft]);
          close();
          toast('Шаблон збережено.');
        }}>Зберегти</Btn>
        {t ? (
          <Btn kind="ghost" full icon="trash" onClick={() => confirmSheet({
            title: 'Видалити шаблон?',
            text: `Шаблон «${t.name}» зникне. Плани днів, складені з нього раніше, залишаться.`,
            confirm: 'Видалити',
            danger: true,
            onConfirm: () => {
              saveList('templates', data.templates.filter((x) => x.id !== t.id));
              close();
            },
          })}>Видалити шаблон</Btn>
        ) : null}
      </div>
    ),
  });
}

export function TemplateChips(p: { date: string }): HTMLElement {
  const { data } = derived();
  return (
    <div class="tpl-grid">
      {data.templates.map((t) => (
        <button type="button" class="tpl" onClick={() => { setDayPlan(p.date, clone(t.lines), 'template', t.id); toast(`План «${t.name}» — ${fmt(planTotal(t.lines))}`); }}>
          <span class="tpl-name">{t.name}</span>
          <span class="tpl-sum num">{fmt(planTotal(t.lines))}</span>
        </button>
      ))}
      <button type="button" class="tpl tpl-own" onClick={() => openPlanEditor(p.date)}>
        {icon('edit', 18)}
        <span class="tpl-name">Власний план</span>
      </button>
    </div>
  ) as HTMLElement;
}

