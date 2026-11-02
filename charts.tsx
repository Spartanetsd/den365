// charts.tsx — легкі SVG-графіки без бібліотек: стовпчики з планом, кільцева діаграма, лінія, смуги.
import { h, Fragment, cx } from './dom.ts';
import { compact, fmt } from './money.ts';
import type { Kop } from './types.ts';

export interface Bar {
  key: string;
  label: string;
  value: Kop;
  plan?: Kop | null;
  missing?: boolean;
  hl?: boolean;
  title?: string;
}

/** Стовпчики витрат; риска — план дня; пунктир — день без даних. */
export function BarChart(p: { bars: Bar[]; height?: number; label: string; onPick?: (key: string) => void }): HTMLElement {
  const W = 340;
  const H = p.height ?? 150;
  const top = 16;
  const bottom = 20;
  const n = p.bars.length;
  const max = Math.max(1, ...p.bars.map((b) => Math.max(b.value, b.plan ?? 0)));
  const slot = W / Math.max(1, n);
  const bw = Math.max(2, Math.min(24, slot * 0.6));
  const y = (v: number) => top + (H - top - bottom) * (1 - Math.max(0, v) / max);
  const every = Math.max(1, Math.ceil(n / 7));
  const svg = (
    <svg viewBox={`0 0 ${W} ${H}`} class="chart-svg" role="img" aria-label={p.label} preserveAspectRatio="none">
      <line class="axis" x1="0" x2={String(W)} y1={String(H - bottom)} y2={String(H - bottom)} />
      <text class="chart-max" x="0" y="10">{compact(max)}</text>
      {p.bars.map((b, i) => {
        const cxp = slot * i + slot / 2;
        const bh = Math.max(b.value > 0 ? 2 : 0, H - bottom - y(b.value));
        return (
          <g class={cx('bar', b.hl && 'hl', b.missing && 'missing', b.plan !== null && b.plan !== undefined && b.value > b.plan && 'over')} data-key={b.key}>
            {b.missing
              ? <line class="bar-missing" x1={String(cxp - bw / 2)} x2={String(cxp + bw / 2)} y1={String(H - bottom - 3)} y2={String(H - bottom - 3)} />
              : <rect x={String(cxp - bw / 2)} y={String(H - bottom - bh)} width={String(bw)} height={String(bh)} rx={String(Math.min(4, bw / 2))} />}
            {b.plan ? <line class="bar-plan" x1={String(cxp - bw / 2 - 2)} x2={String(cxp + bw / 2 + 2)} y1={String(y(b.plan))} y2={String(y(b.plan))} /> : null}
            {i % every === 0 || i === n - 1 ? <text class="chart-label" x={String(cxp)} y={String(H - 5)} text-anchor="middle">{b.label}</text> : null}
            <rect class="bar-hit" x={String(slot * i)} y="0" width={String(slot)} height={String(H)}>
            </rect>
          </g>
        );
      })}
    </svg>
  ) as SVGSVGElement;
  if (p.onPick) {
    svg.addEventListener('click', (e) => {
      const g = (e.target as Element).closest('g.bar');
      const key = g?.getAttribute('data-key');
      if (key) p.onPick!(key);
    });
  }
  return <figure class={cx('chart', p.onPick && 'pickable')}>{svg}</figure> as HTMLElement;
}

export interface Part {
  key: string;
  label: string;
  value: Kop;
  color: string;
}

export function Donut(p: { parts: Part[]; center: string; sub?: string; size?: number }): HTMLElement {
  const R = 44;
  const C = 2 * Math.PI * R;
  const total = p.parts.reduce((s, x) => s + Math.max(0, x.value), 0);
  let acc = 0;
  const gap = p.parts.length > 1 ? 2 : 0;
  return (
    <div class="donut" style={`--size:${p.size ?? 150}px`}>
      <svg viewBox="0 0 110 110" role="img" aria-label={`Розподіл: ${p.parts.map((x) => `${x.label} ${fmt(x.value)}`).join(', ')}`}>
        <circle class="donut-track" cx="55" cy="55" r={String(R)} />
        {total > 0 ? p.parts.filter((x) => x.value > 0).map((x) => {
          const len = (x.value / total) * C;
          const seg = <circle class="donut-seg" cx="55" cy="55" r={String(R)} transform="rotate(-90 55 55)" style={`stroke:${x.color};stroke-dasharray:${Math.max(0, len - gap)} ${C};stroke-dashoffset:${-acc}`} />;
          acc += len;
          return seg;
        }) : null}
      </svg>
      <div class="donut-center">
        <span class="donut-value num">{p.center}</span>
        {p.sub ? <span class="donut-sub">{p.sub}</span> : null}
      </div>
    </div>
  ) as HTMLElement;
}

export function LineChart(p: { points: { label: string; value: Kop }[]; height?: number; label: string }): HTMLElement {
  const W = 340;
  const H = p.height ?? 130;
  const top = 14;
  const bottom = 20;
  const n = p.points.length;
  if (n < 2) return <div class="chart-empty">Замало точок для графіка</div> as HTMLElement;
  const vals = p.points.map((x) => x.value);
  const min = Math.min(0, ...vals);
  const max = Math.max(1, ...vals);
  const xs = (i: number) => (W * i) / (n - 1);
  const ys = (v: number) => top + (H - top - bottom) * (1 - (v - min) / (max - min || 1));
  const d = p.points.map((pt, i) => `${i ? 'L' : 'M'}${xs(i).toFixed(1)} ${ys(pt.value).toFixed(1)}`).join(' ');
  const area = `${d} L${W} ${H - bottom} L0 ${H - bottom} z`;
  const every = Math.max(1, Math.ceil(n / 6));
  return (
    <figure class="chart">
      <svg viewBox={`0 0 ${W} ${H}`} class="chart-svg" role="img" aria-label={p.label} preserveAspectRatio="none">
        <path class="line-area" d={area} />
        <path class="line" d={d} />
        <text class="chart-max" x="0" y="10">{compact(max)}</text>
        <circle class="line-end" cx={String(xs(n - 1))} cy={String(ys(vals[n - 1]))} r="3.5" />
        {p.points.map((pt, i) => (i % every === 0 ? <text class="chart-label" x={String(Math.min(W - 14, Math.max(14, xs(i))))} y={String(H - 5)} text-anchor="middle">{pt.label}</text> : null))}
      </svg>
    </figure>
  ) as HTMLElement;
}

/** Горизонтальні смуги для порівнянь (категорії, види транспорту). */
export function HBars(p: { rows: { key: string; label: string; value: Kop; color?: string; note?: string }[]; total?: Kop }): HTMLElement {
  const max = Math.max(1, ...p.rows.map((r) => r.value));
  return (
    <div class="hbars">
      {p.rows.map((r) => (
        <div class="hbar">
          <div class="hbar-top">
            <span class="hbar-label">{r.label}</span>
            <span class="hbar-value num">{fmt(r.value)}</span>
          </div>
          <div class="hbar-track"><span style={`width:${((r.value / max) * 100).toFixed(1)}%;${r.color ? `background:${r.color}` : ''}`} /></div>
          {r.note ? <span class="hbar-note">{r.note}</span> : null}
        </div>
      ))}
    </div>
  ) as HTMLElement;
}

