// ui.tsx — базові елементи інтерфейсу: кнопки, списки, поля, клавіатура суми, кільце, аркуші, сповіщення.
import { h, Fragment, cx, live, reducedMotion, type Child } from './dom.ts';
import { icon } from './icons.ts';
import { fmt, parseMoney, toInput } from './money.ts';
import type { Category, Kop } from './types.ts';

// ── Кнопки й перемикачі ──────────────────────────────────────────────────────

export function Btn(p: {
  kind?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'tinted';
  size?: 'lg' | 'md' | 'sm';
  icon?: string;
  full?: boolean;
  disabled?: boolean;
  label?: string;
  onClick?: (e: MouseEvent) => void;
  children?: Child;
}): HTMLElement {
  return (
    <button
      type="button"
      class={cx('btn', `btn-${p.kind ?? 'secondary'}`, `btn-${p.size ?? 'md'}`, p.full && 'btn-full')}
      disabled={p.disabled}
      aria-label={p.label}
      onClick={p.onClick}
    >
      {p.icon ? icon(p.icon, p.size === 'sm' ? 16 : 20) : null}
      {p.children !== undefined ? <span>{p.children}</span> : null}
    </button>
  ) as HTMLElement;
}

export function IconBtn(p: { icon: string; label: string; onClick: (e: MouseEvent) => void; disabled?: boolean }): HTMLElement {
  return (
    <button type="button" class="btn-icon" aria-label={p.label} title={p.label} disabled={p.disabled} onClick={p.onClick}>
      {icon(p.icon, 20)}
    </button>
  ) as HTMLElement;
}

export function Seg<T extends string>(p: { value: T; options: { value: T; label: string }[]; onChange: (v: T) => void; small?: boolean; label?: string }): HTMLElement {
  return (
    <div class={cx('seg', p.small && 'seg-sm')} role="tablist" aria-label={p.label}>
      {p.options.map((o) => (
        <button type="button" role="tab" aria-selected={o.value === p.value ? 'true' : 'false'} class={cx('seg-opt', o.value === p.value && 'on')} onClick={() => p.onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  ) as HTMLElement;
}

export function Chip(p: { on?: boolean; icon?: string; color?: string; onClick?: () => void; children?: Child; label?: string }): HTMLElement {
  return (
    <button type="button" class={cx('chip', p.on && 'on')} aria-pressed={p.on ? 'true' : 'false'} aria-label={p.label} onClick={p.onClick} style={p.color ? `--c:${p.color}` : undefined}>
      {p.icon ? icon(p.icon, 16) : null}
      <span>{p.children}</span>
    </button>
  ) as HTMLElement;
}

export function Toggle(p: { checked: boolean; onChange: (v: boolean) => void; label: string }): HTMLElement {
  return (
    <label class="toggle">
      <input type="checkbox" role="switch" checked={p.checked} aria-label={p.label} onChange={(e: Event) => p.onChange((e.target as HTMLInputElement).checked)} />
      <span class="toggle-track"><span class="toggle-knob" /></span>
    </label>
  ) as HTMLElement;
}

// ── Списки ───────────────────────────────────────────────────────────────────

export function Group(p: { title?: string; foot?: Child; children?: Child; action?: Child; class?: string }): HTMLElement {
  return (
    <section class={cx('group', p.class)}>
      {p.title || p.action ? (
        <div class="group-head">
          {p.title ? <h3 class="group-title">{p.title}</h3> : <span />}
          {p.action ?? null}
        </div>
      ) : null}
      <div class="group-body">{p.children}</div>
      {p.foot ? <p class="group-foot">{p.foot}</p> : null}
    </section>
  ) as HTMLElement;
}

export function Row(p: {
  icon?: string;
  color?: string;
  title: Child;
  sub?: Child;
  value?: Child;
  valueTone?: 'pos' | 'neg' | 'muted' | '';
  chevron?: boolean;
  onClick?: () => void;
  right?: Child;
  class?: string;
}): HTMLElement {
  const inner = (
    <>
      {p.icon ? <span class="row-icon" style={p.color ? `--c:${p.color}` : undefined}>{icon(p.icon, 18)}</span> : null}
      <span class="row-main">
        <span class="row-title">{p.title}</span>
        {p.sub ? <span class="row-sub">{p.sub}</span> : null}
      </span>
      {p.value !== undefined && p.value !== null ? <span class={cx('row-value', p.valueTone)}>{p.value}</span> : null}
      {p.right ?? null}
      {p.chevron ? <span class="row-chev">{icon('chevronRight', 16)}</span> : null}
    </>
  );
  return (p.onClick
    ? <button type="button" class={cx('row', 'tap', p.class)} onClick={p.onClick}>{inner}</button>
    : <div class={cx('row', p.class)}>{inner}</div>) as HTMLElement;
}

export function CatIcon(p: { cat: Pick<Category, 'icon' | 'color'>; size?: number }): HTMLElement {
  return <span class="cat-icon" style={`--c:${p.cat.color}`}>{icon(p.cat.icon, p.size ?? 20)}</span> as HTMLElement;
}

export function Empty(p: { icon: string; title: string; text?: Child; action?: Child }): HTMLElement {
  return (
    <div class="empty">
      <span class="empty-icon">{icon(p.icon, 26)}</span>
      <p class="empty-title">{p.title}</p>
      {p.text ? <p class="empty-text">{p.text}</p> : null}
      {p.action ?? null}
    </div>
  ) as HTMLElement;
}

export function Progress(p: { value: number; tone?: 'ok' | 'warn' | 'over' | 'accent'; label?: string }): HTMLElement {
  const v = Math.max(0, Math.min(1, p.value));
  return (
    <div class={cx('progress', `tone-${p.tone ?? 'accent'}`)} role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={String(Math.round(v * 100))} aria-label={p.label}>
      <span style={`width:${(v * 100).toFixed(1)}%`} />
    </div>
  ) as HTMLElement;
}

export function Note(p: { tone?: 'info' | 'warn' | 'good'; icon?: string; children?: Child }): HTMLElement {
  return (
    <div class={cx('note', `note-${p.tone ?? 'info'}`)}>
      {icon(p.icon ?? (p.tone === 'warn' ? 'info' : p.tone === 'good' ? 'checkCircle' : 'info'), 18)}
      <div>{p.children}</div>
    </div>
  ) as HTMLElement;
}

// ── Поля ─────────────────────────────────────────────────────────────────────

export function Field(p: { label: string; hint?: Child; children?: Child; inline?: boolean }): HTMLElement {
  return (
    <label class={cx('field', p.inline && 'field-inline')}>
      <span class="field-label">{p.label}</span>
      {p.children}
      {p.hint ? <span class="hint">{p.hint}</span> : null}
    </label>
  ) as HTMLElement;
}

export function MoneyInput(p: { value: Kop | null; onChange: (v: Kop | null) => void; placeholder?: string; label?: string }): HTMLElement {
  return (
    <span class="input-wrap">
      <input
        class="input"
        type="text"
        inputmode="decimal"
        autocomplete="off"
        aria-label={p.label}
        placeholder={p.placeholder ?? '0'}
        value={toInput(p.value)}
        onInput={(e: Event) => p.onChange(parseMoney((e.target as HTMLInputElement).value))}
      />
      <span class="input-suffix">грн</span>
    </span>
  ) as HTMLElement;
}

export function NumInput(p: { value: number | null; onChange: (v: number | null) => void; suffix?: string; placeholder?: string; decimals?: boolean; label?: string }): HTMLElement {
  return (
    <span class="input-wrap">
      <input
        class="input"
        type="text"
        inputmode={p.decimals ? 'decimal' : 'numeric'}
        autocomplete="off"
        aria-label={p.label}
        placeholder={p.placeholder ?? ''}
        value={p.value === null ? '' : String(p.value).replace('.', ',')}
        onInput={(e: Event) => {
          const raw = (e.target as HTMLInputElement).value.replace(',', '.').replace(/\s/g, '');
          if (raw === '') return p.onChange(null);
          const n = Number(raw);
          p.onChange(Number.isFinite(n) && n >= 0 ? (p.decimals ? n : Math.round(n)) : null);
        }}
      />
      {p.suffix ? <span class="input-suffix">{p.suffix}</span> : null}
    </span>
  ) as HTMLElement;
}

export function TextInput(p: { value: string; onChange: (v: string) => void; placeholder?: string; max?: number; label?: string }): HTMLElement {
  return (
    <input
      class="input"
      type="text"
      aria-label={p.label}
      maxlength={String(p.max ?? 120)}
      placeholder={p.placeholder ?? ''}
      value={p.value}
      onInput={(e: Event) => p.onChange((e.target as HTMLInputElement).value)}
    />
  ) as HTMLElement;
}

export function DateInput(p: { value: string; onChange: (v: string) => void; max?: string; min?: string; label?: string }): HTMLElement {
  return (
    <input
      class="input input-date"
      type="date"
      aria-label={p.label}
      value={p.value}
      max={p.max}
      min={p.min}
      onChange={(e: Event) => {
        const v = (e.target as HTMLInputElement).value;
        if (v) p.onChange(v);
      }}
    />
  ) as HTMLElement;
}

export function Select(p: { value: string; options: { value: string; label: string }[]; onChange: (v: string) => void; label?: string }): HTMLElement {
  return (
    <span class="select-wrap">
      <select class="input" aria-label={p.label} value={p.value} onChange={(e: Event) => p.onChange((e.target as HTMLSelectElement).value)}>
        {p.options.map((o) => <option value={o.value}>{o.label}</option>)}
      </select>
      {icon('chevronDown', 16)}
    </span>
  ) as HTMLElement;
}

export function Stepper(p: { value: number; min: number; max: number; onChange: (v: number) => void; label: string }): HTMLElement {
  const box = live(() => (
    <div class="stepper" role="group" aria-label={p.label}>
      <button type="button" class="stepper-btn" aria-label="Менше" disabled={p.value <= p.min} onClick={() => { p.value = Math.max(p.min, p.value - 1); p.onChange(p.value); box.refresh(); }}>{icon('minus', 18)}</button>
      <span class="stepper-val num">{p.value}</span>
      <button type="button" class="stepper-btn" aria-label="Більше" disabled={p.value >= p.max} onClick={() => { p.value = Math.min(p.max, p.value + 1); p.onChange(p.value); box.refresh(); }}>{icon('plus', 18)}</button>
    </div>
  ));
  return box.el;
}

export function Stars(p: { value: number | null; onChange: (v: number | null) => void }): HTMLElement {
  const box = live(() => (
    <div class="stars" role="radiogroup" aria-label="Оцінка комфорту">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          type="button"
          role="radio"
          aria-checked={p.value === n ? 'true' : 'false'}
          aria-label={`${n} з 5`}
          class={cx('star', p.value !== null && n <= p.value && 'on')}
          onClick={() => { p.value = p.value === n ? null : n; p.onChange(p.value); box.refresh(); }}
        >
          {icon('star', 24)}
        </button>
      ))}
    </div>
  ));
  return box.el;
}

// ── Клавіатура суми ─────────────────────────────────────────────────────────

/** Велике поле суми з власною клавіатурою: без системної клавіатури й зайвих дотиків. */
export function makeAmountPad(p: { initial: Kop | null; onChange: (v: Kop | null) => void }): { display: HTMLElement; keypad: HTMLElement; set: (v: Kop | null) => void } {
  let s = p.initial !== null && p.initial > 0 ? toInput(p.initial) : '';
  const display = <span class="amount-value num">{s || '0'}</span> as HTMLElement;
  const wrap = <div class={cx('amount', !s && 'is-empty')} aria-live="polite">{display}<span class="amount-cur">грн</span></div> as HTMLElement;
  const show = () => {
    display.textContent = s || '0';
    wrap.classList.toggle('is-empty', !s);
  };
  const set = (next: string) => {
    s = next;
    show();
    p.onChange(s ? parseMoney(s) : null);
  };
  const press = (k: string) => {
    if (k === 'del') return set(s.slice(0, -1));
    if (k === ',') {
      if (s.includes(',')) return;
      return set((s || '0') + ',');
    }
    const [int, frac] = s.split(',');
    if (frac !== undefined && frac.length >= 2) return;
    if (frac === undefined && int.length >= 7) return;
    if (s === '0') return set(k);
    set(s + k);
  };
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', ',', '0', 'del'];
  const keypad = (
    <div class="keypad">
      {keys.map((k) => (
        <button type="button" class={cx('key', k === 'del' && 'key-fn')} aria-label={k === 'del' ? 'Стерти' : k} onClick={() => press(k)}>
          {k === 'del' ? icon('backspace', 24) : k}
        </button>
      ))}
    </div>
  ) as HTMLElement;
  return {
    display: wrap,
    keypad,
    set: (v) => {
      s = v !== null && v > 0 ? toInput(v) : '';
      show();
    },
  };
}

// ── Числа й кільце з анімацією ──────────────────────────────────────────────

const numPrev = new Map<string, number>();

/** Число, яке плавно змінюється від попереднього значення до нового. */
export function Num(p: { id: string; value: Kop; format?: (k: Kop) => string; class?: string }): HTMLElement {
  const f = p.format ?? ((k: Kop) => fmt(k));
  const el = <span class={cx('num', p.class)}>{f(p.value)}</span> as HTMLElement;
  const from = numPrev.get(p.id);
  numPrev.set(p.id, p.value);
  if (from !== undefined && from !== p.value && !reducedMotion()) {
    const start = performance.now();
    const dur = 480;
    el.textContent = f(from);
    const step = (t: number) => {
      const k = Math.min(1, (t - start) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      if (k < 1) {
        el.textContent = f(Math.round((from + (p.value - from) * e) / 100) * 100);
        requestAnimationFrame(step);
      } else {
        el.textContent = f(p.value);
      }
    };
    requestAnimationFrame(step);
  }
  return el;
}

const ringPrev = new Map<string, number>();

export function Ring(p: { id: string; frac: number | null; tone: 'ok' | 'warn' | 'over' | 'none'; size?: number; children?: Child }): HTMLElement {
  const R = 52;
  const C = 2 * Math.PI * R;
  const target = p.frac === null ? 0 : Math.max(0, Math.min(1, p.frac));
  const from = ringPrev.get(p.id) ?? 0;
  ringPrev.set(p.id, target);
  const bar = <circle class={cx('ring-bar', `tone-${p.tone}`)} cx="60" cy="60" r={String(R)} transform="rotate(-90 60 60)" /> as SVGCircleElement;
  bar.style.strokeDasharray = `${C}`;
  bar.style.strokeDashoffset = `${C * (1 - (reducedMotion() ? target : from))}`;
  if (from !== target && !reducedMotion()) {
    requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.strokeDashoffset = `${C * (1 - target)}`; }));
  }
  const ticks = <g class="ring-ticks" /> as SVGGElement;
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2;
    const r1 = 40.5;
    const r2 = i % 5 === 0 ? 37 : 38.6;
    ticks.appendChild(<line x1={String(60 + r1 * Math.sin(a))} y1={String(60 - r1 * Math.cos(a))} x2={String(60 + r2 * Math.sin(a))} y2={String(60 - r2 * Math.cos(a))} /> as SVGLineElement);
  }
  return (
    <div class="ring" style={`--size:${p.size ?? 132}px`}>
      <svg viewBox="0 0 120 120" aria-hidden="true">
        {ticks}
        <circle class="ring-track" cx="60" cy="60" r={String(R)} />
        {bar}
      </svg>
      <div class="ring-center">{p.children}</div>
    </div>
  ) as HTMLElement;
}

// ── Аркуші (bottom sheets) ───────────────────────────────────────────────────

interface SheetEntry {
  body: HTMLElement;
  render: (close: () => void) => Child;
  live: boolean;
  close: () => void;
}

const sheets: SheetEntry[] = [];

export function openSheet(o: { title: string; render: (close: () => void) => Child; live?: boolean; onClose?: () => void; tall?: boolean }): () => void {
  const layer = document.getElementById('sheets') ?? document.body;
  let closed = false;
  const body = <div class="sheet-body" /> as HTMLElement;
  const backdrop = <div class="backdrop" /> as HTMLElement;
  const close = () => {
    if (closed) return;
    closed = true;
    panel.classList.remove('in');
    backdrop.classList.remove('in');
    const i = sheets.indexOf(entry);
    if (i >= 0) sheets.splice(i, 1);
    if (!sheets.length) document.documentElement.classList.remove('sheet-open');
    setTimeout(() => wrap.remove(), reducedMotion() ? 0 : 280);
    o.onClose?.();
  };
  const panel = (
    <section class={cx('sheet', o.tall && 'sheet-tall')} role="dialog" aria-modal="true" aria-label={o.title}>
      <div class="sheet-grab"><span class="sheet-handle" /></div>
      <header class="sheet-head">
        <h2 class="sheet-title">{o.title}</h2>
        <IconBtn icon="x" label="Закрити" onClick={close} />
      </header>
      {body}
    </section>
  ) as HTMLElement;
  const wrap = <div class="sheet-wrap">{backdrop}{panel}</div> as HTMLElement;
  backdrop.addEventListener('click', close);
  const entry: SheetEntry = { body, render: o.render, live: Boolean(o.live), close };
  const f = document.createDocumentFragment();
  f.append(...toNodes(o.render(close)));
  body.append(f);
  layer.append(wrap);
  sheets.push(entry);
  document.documentElement.classList.add('sheet-open');
  requestAnimationFrame(() => requestAnimationFrame(() => {
    panel.classList.add('in');
    backdrop.classList.add('in');
  }));
  enableSwipe(panel, close);
  return close;
}

function toNodes(c: Child): Node[] {
  const f = document.createDocumentFragment();
  const tmp = <div>{c}</div> as HTMLElement;
  f.append(...Array.from(tmp.childNodes));
  return Array.from(f.childNodes);
}

function enableSwipe(panel: HTMLElement, close: () => void): void {
  const grab = panel.querySelector('.sheet-grab') as HTMLElement;
  const head = panel.querySelector('.sheet-head') as HTMLElement;
  let startY = 0;
  let dy = 0;
  let active = false;
  const down = (e: PointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    active = true;
    startY = e.clientY;
    dy = 0;
    panel.style.transition = 'none';
  };
  const move = (e: PointerEvent) => {
    if (!active) return;
    dy = Math.max(0, e.clientY - startY);
    panel.style.transform = `translateY(${dy}px)`;
  };
  const up = () => {
    if (!active) return;
    active = false;
    panel.style.transition = '';
    panel.style.transform = '';
    if (dy > 90) close();
  };
  for (const el of [grab, head]) {
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
  }
}

export function refreshSheets(): void {
  for (const s of sheets) {
    if (!s.live) continue;
    const top = s.body.scrollTop;
    s.body.replaceChildren(...toNodes(s.render(s.close)));
    s.body.scrollTop = top;
  }
}

export function closeTopSheet(): boolean {
  const s = sheets[sheets.length - 1];
  if (!s) return false;
  s.close();
  return true;
}

export function confirmSheet(o: { title: string; text: Child; confirm: string; danger?: boolean; onConfirm: () => void }): void {
  openSheet({
    title: o.title,
    render: (close) => (
      <div class="stack">
        <p class="lead">{o.text}</p>
        <Btn kind={o.danger ? 'danger' : 'primary'} size="lg" full onClick={() => { close(); o.onConfirm(); }}>{o.confirm}</Btn>
        <Btn kind="ghost" size="lg" full onClick={close}>Скасувати</Btn>
      </div>
    ),
  });
}

/** Пояснення показника: невеликий значок «i», що відкриває аркуш із текстом. */
export function InfoTip(p: { title: string; children?: Child }): HTMLElement {
  const content = p.children;
  return (
    <button type="button" class="info-tip" aria-label={`Що таке «${p.title}»`} onClick={(e: MouseEvent) => {
      e.stopPropagation();
      openSheet({ title: p.title, render: () => <div class="prose">{content}</div> });
    }}>
      {icon('info', 15)}
    </button>
  ) as HTMLElement;
}

// ── Сповіщення ───────────────────────────────────────────────────────────────

let toastTimer = 0;

export function toast(msg: string, actions: { label: string; run: () => void }[] = [], ms = 4200): void {
  const layer = document.getElementById('toasts');
  if (!layer) return;
  clearTimeout(toastTimer);
  const el = (
    <div class="toast" role="status">
      <span class="toast-text">{msg}</span>
      {actions.map((a) => (
        <button type="button" class="toast-btn" onClick={() => { a.run(); el.classList.remove('in'); setTimeout(() => el.remove(), 200); }}>{a.label}</button>
      ))}
    </div>
  ) as HTMLElement;
  layer.replaceChildren(el);
  requestAnimationFrame(() => el.classList.add('in'));
  toastTimer = window.setTimeout(() => {
    el.classList.remove('in');
    setTimeout(() => el.remove(), 250);
  }, ms);
}

