// App.tsx — каркас застосунку: нижня навігація з 5 вкладок, кнопка «+ Витрата», банери, тема.
import { h, Fragment, cx } from './dom.ts';
import { icon } from './icons.ts';
import { closeTopSheet, refreshSheets, toast } from './ui.tsx';
import { DayScreen, currentDayDate } from './DayScreen.tsx';
import { AddScreen } from './AddScreen.tsx';
import { AnalyticsScreen } from './AnalyticsScreen.tsx';
import { FutureScreen } from './FutureScreen.tsx';
import { SettingsScreen } from './SettingsScreen.tsx';
import { Onboarding } from './Onboarding.tsx';
import { openQuickAdd } from './forms.tsx';
import { ensureToday, getState, onHabits, setDemoMode, subscribe } from './store.ts';
import { derived, go, setRenderer, ui, type Tab } from './view.ts';
import { registerServiceWorker } from './pwa.ts';
import { todayKey } from './time.ts';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'day', label: 'День', icon: 'sun' },
  { id: 'add', label: 'Додати', icon: 'plusCircle' },
  { id: 'stats', label: 'Аналітика', icon: 'bars' },
  { id: 'future', label: 'Майбутнє', icon: 'sprout' },
  { id: 'settings', label: 'Налаштування', icon: 'sliders' },
];

let screenEl: HTMLElement;
let tabbarEl: HTMLElement;
let fabEl: HTMLElement;
let bannerEl: HTMLElement;
let updateApply: (() => void) | null = null;
let lastToday = todayKey();
let lastTab: Tab | null = null;

function applyTheme(): void {
  const theme = getState().data.settings.theme;
  const root = document.documentElement;
  if (theme === 'system') delete root.dataset.theme;
  else root.dataset.theme = theme;
  try {
    localStorage.setItem('den365:theme', theme);
  } catch {
    // тема просто не запамʼятається для раннього завантаження
  }
  const dark = theme === 'dark' || (theme === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
  for (const m of document.querySelectorAll('meta[name="theme-color"]')) {
    (m as HTMLMetaElement).content = dark ? '#000000' : '#F3F4F1';
    if (theme !== 'system') m.removeAttribute('media');
  }
}

function render(): void {
  const s = getState();
  if (!s.ready) return;
  const onboarding = !s.data.settings.onboarded && !s.demo;
  document.body.classList.toggle('onboarding', onboarding);
  if (onboarding) {
    screenEl.replaceChildren(<Onboarding />);
    tabbarEl.replaceChildren();
    fabEl.replaceChildren();
    bannerEl.replaceChildren();
    lastTab = null;
    return;
  }
  const screens: Record<Tab, () => Node> = { day: DayScreen, add: AddScreen, stats: AnalyticsScreen, future: FutureScreen, settings: SettingsScreen };
  const tabChanged = lastTab !== ui.tab;
  lastTab = ui.tab;
  const node = screens[ui.tab]();
  screenEl.replaceChildren(node);
  if (tabChanged) {
    screenEl.classList.remove('enter');
    void screenEl.offsetWidth;
    screenEl.classList.add('enter');
  }

  tabbarEl.replaceChildren(
    ...TABS.map((t) => (
      <button type="button" class={cx('tab', ui.tab === t.id && 'on')} aria-current={ui.tab === t.id ? 'page' : undefined} onClick={() => {
        if (t.id === ui.tab && t.id === 'settings') ui.settingsPage = null;
        if (t.id === ui.tab && t.id === 'day') ui.dayDate = null;
        go(t.id);
      }}>
        {icon(t.icon, 24)}
        <span class="tab-label">{t.label}</span>
      </button>
    )),
  );

  const { today } = derived();
  const date = currentDayDate();
  fabEl.replaceChildren(
    ui.tab === 'day' && date <= today
      ? <button type="button" class="fab" onClick={() => openQuickAdd({ date })} aria-label="Додати витрату">{icon('plus', 22)}<span>Витрата</span></button>
      : <span />,
  );

  const banners: Node[] = [];
  if (s.demo) banners.push(
    <div class="banner banner-demo">
      {icon('spark', 16)}<span>Демо-режим: вигадані дані окремо від твоїх.</span>
      <button type="button" class="banner-btn" onClick={async () => { await setDemoMode(false); go('day', { dayDate: null }); }}>Вийти</button>
    </div>,
  );
  if (s.error) banners.push(<div class="banner banner-error">{icon('info', 16)}<span>{s.error}</span></div>);
  if (updateApply) banners.push(
    <div class="banner banner-update">
      {icon('repeat', 16)}<span>Доступна нова версія. Дані збережуться.</span>
      <button type="button" class="banner-btn" onClick={() => updateApply?.()}>Оновити</button>
    </div>,
  );
  bannerEl.replaceChildren(...banners);
}

function checkDay(): void {
  const t = todayKey();
  if (t === lastToday) return;
  lastToday = t;
  ensureToday();
  render();
}

export function mountApp(root: HTMLElement): void {
  root.replaceChildren(
    <div class="app">
      <div class="banners" ref={(e: HTMLElement) => { bannerEl = e; }} />
      <main class="main" id="main" ref={(e: HTMLElement) => { screenEl = e; }} />
      <div class="fab-slot" ref={(e: HTMLElement) => { fabEl = e; }} />
      <nav class="tabbar" aria-label="Розділи" ref={(e: HTMLElement) => { tabbarEl = e; }} />
      <div id="sheets" />
      <div id="toasts" class="toast-layer" aria-live="polite" />
    </div>,
  );
  const fromHash = location.hash.slice(1) as Tab;
  if (TABS.some((t) => t.id === fromHash)) ui.tab = fromHash;
  setRenderer(render);
  subscribe(() => {
    applyTheme();
    render();
    refreshSheets();
  });
  onHabits((list) => toast(`Нова звичка: ${list.map((x) => x.title).join(', ')}`, [{ label: 'Переглянути', run: () => go('future', { futureTab: 'habits' }) }]));
  window.addEventListener('hashchange', () => {
    const t = location.hash.slice(1) as Tab;
    if (TABS.some((x) => x.id === t) && t !== ui.tab) go(t);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeTopSheet();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') checkDay();
  });
  setInterval(checkDay, 30_000);
  matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', applyTheme);
  applyTheme();
  render();
  registerServiceWorker((apply) => {
    updateApply = apply;
    render();
  });
}


