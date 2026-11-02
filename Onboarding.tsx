// Onboarding.tsx — перший запуск: «Заплануй → Запиши → Примножуй».
import { h, Fragment, cx, live, reducedMotion } from './dom.ts';
import { icon } from './icons.ts';
import { Btn } from './ui.tsx';
import { saveSettings, setDemoMode } from './store.ts';
import { go } from './view.ts';

const STEPS = [
  { icon: 'list', title: 'Заплануй', text: 'Склади приблизний план дня одним дотиком — із шаблону «Навчання у Дніпрі», «Економний день» чи власного.' },
  { icon: 'plusCircle', title: 'Запиши', text: 'Кава, проїзд, обід, продукти — за кілька секунд. Великі кнопки, типові суми, жодної реєстрації.' },
  { icon: 'sprout', title: 'Примножуй', text: 'Бач економію, безпечну суму для накопичень і отримуй одну доречну пораду ввечері.' },
];

let dialPrev = 0;

/** Рік як циферблат: 365 рисок, кожен день — маленький крок. */
function YearDial(p: { frac: number }): HTMLElement {
  const c = 130;
  const ticks = <g class="dial-ticks" /> as SVGGElement;
  for (let i = 0; i < 365; i++) {
    const a = (i / 365) * Math.PI * 2;
    const month = i % 30 === 0 && i < 345;
    const r1 = month ? 90 : 99;
    const r2 = 107;
    ticks.appendChild(<line class={month ? 'm' : undefined} x1={(c + r1 * Math.sin(a)).toFixed(2)} y1={(c - r1 * Math.cos(a)).toFixed(2)} x2={(c + r2 * Math.sin(a)).toFixed(2)} y2={(c - r2 * Math.cos(a)).toFixed(2)} /> as SVGLineElement);
  }
  const R = 120;
  const C = 2 * Math.PI * R;
  const arc = <circle class="dial-arc" cx={String(c)} cy={String(c)} r={String(R)} transform={`rotate(-90 ${c} ${c})`} /> as SVGCircleElement;
  arc.style.strokeDasharray = String(C);
  const from = reducedMotion() ? p.frac : dialPrev;
  arc.style.strokeDashoffset = String(C * (1 - from));
  dialPrev = p.frac;
  if (from !== p.frac) requestAnimationFrame(() => requestAnimationFrame(() => { arc.style.strokeDashoffset = String(C * (1 - p.frac)); }));
  return (
    <div class="dial" aria-hidden="true">
      <svg viewBox="0 0 260 260">
        {ticks}
        <circle class="dial-track" cx={String(c)} cy={String(c)} r={String(R)} />
        {arc}
        <circle class="dial-day" cx={String(c)} cy={String(c)} r="30" />
        <circle class="dial-core" cx={String(c)} cy={String(c)} r="11" />
      </svg>
    </div>
  ) as HTMLElement;
}

export function Onboarding(): HTMLElement {
  let step = 0;
  const finish = (then?: () => void) => {
    saveSettings((s) => ({ ...s, onboarded: true }));
    then?.();
  };
  const view = live(() => {
    const last = step === STEPS.length;
    return (
      <div class="onb">
        <div class="onb-brand">
          <span class="onb-mark" aria-hidden="true">{icon('sun', 22)}</span>
          <span class="onb-name">ДЕНЬ <span class="onb-x">×</span> 365</span>
        </div>
        <YearDial frac={last ? 1 : (step + 1) / (STEPS.length + 1)} />
        <ol class="onb-steps" aria-label="Три кроки">
          {STEPS.map((s, i) => (
            <li class={cx('onb-step', i === step && 'on', (i < step || last) && 'done')}>
              {icon(i < step || last ? 'check' : s.icon, 16)}
              <span>{s.title}</span>
            </li>
          ))}
        </ol>
        {last ? (
          <div class="onb-body">
            <h1 class="onb-title">Почнімо</h1>
            <p class="onb-text">Бюджет можна налаштувати зараз або пізніше. Усі дані залишаються лише на цьому пристрої.</p>
            <div class="onb-actions">
              <Btn kind="primary" size="lg" full onClick={() => finish(() => go('day'))}>Почати з сьогоднішнього дня</Btn>
              <Btn kind="secondary" size="lg" full onClick={() => finish(() => go('settings', { settingsPage: 'budget' }))}>Налаштувати бюджет</Btn>
              <Btn kind="ghost" size="lg" full onClick={async () => { finish(); await setDemoMode(true); go('day'); }}>Подивитися демо з прикладом</Btn>
            </div>
          </div>
        ) : (
          <div class="onb-body">
            <h1 class="onb-title">{STEPS[step].title}</h1>
            <p class="onb-text">{STEPS[step].text}</p>
            <div class="onb-actions">
              <Btn kind="primary" size="lg" full onClick={() => { step++; view.refresh(); }}>Далі</Btn>
              <Btn kind="ghost" size="md" full onClick={() => { step = STEPS.length; view.refresh(); }}>Пропустити</Btn>
            </div>
          </div>
        )}
      </div>
    );
  });
  return view.el;
}
