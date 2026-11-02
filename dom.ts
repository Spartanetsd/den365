// dom.ts — мінімальний JSX-рушій: створює справжні DOM-вузли напряму, без віртуального DOM і бібліотек.

export type Child = Node | string | number | boolean | null | undefined | Child[];
type Component = (props: Record<string, unknown>) => Node | null;

declare global {
  namespace JSX {
    interface Element extends Node {}
    interface IntrinsicElements {
      [name: string]: any;
    }
    interface ElementChildrenAttribute {
      children: {};
    }
  }
}

const SVG_NS = 'http://www.w3.org/2000/svg';
const SVG_TAGS = new Set([
  'svg', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'g', 'defs',
  'linearGradient', 'radialGradient', 'stop', 'ellipse', 'text', 'tspan', 'clipPath', 'mask', 'pattern',
]);
const PROPS = new Set(['checked', 'selected', 'disabled', 'hidden', 'multiple', 'readOnly', 'indeterminate']);

export function append(parent: Node, child: Child): void {
  if (child === null || child === undefined || child === false || child === true) return;
  if (Array.isArray(child)) {
    for (const c of child) append(parent, c);
    return;
  }
  parent.appendChild(child instanceof Node ? child : document.createTextNode(String(child)));
}

export function h(tag: string | Component, props: Record<string, unknown> | null, ...children: Child[]): Node {
  if (typeof tag === 'function') {
    const out = tag({ ...(props ?? {}), children: children.length === 1 ? children[0] : children });
    return out ?? document.createComment('');
  }
  const svg = SVG_TAGS.has(tag);
  const el = svg ? document.createElementNS(SVG_NS, tag) : document.createElement(tag);
  let deferredValue: unknown;
  if (props) {
    for (const [k, v] of Object.entries(props)) {
      if (v === undefined || v === null || v === false) continue;
      if (k === 'ref') {
        (v as (e: Element) => void)(el);
      } else if (k.startsWith('on') && typeof v === 'function') {
        el.addEventListener(k.slice(2).toLowerCase(), v as EventListener);
      } else if (k === 'class' || k === 'className') {
        el.setAttribute('class', String(v));
      } else if (k === 'style') {
        if (typeof v === 'string') el.setAttribute('style', v);
        else Object.assign((el as HTMLElement).style, v);
      } else if (k === 'value' && !svg) {
        deferredValue = v;
      } else if (!svg && PROPS.has(k)) {
        (el as unknown as Record<string, unknown>)[k] = Boolean(v);
      } else if (k === 'html') {
        el.innerHTML = String(v);
      } else {
        el.setAttribute(k, v === true ? '' : String(v));
      }
    }
  }
  for (const c of children) append(el, c);
  if (deferredValue !== undefined) (el as HTMLInputElement).value = String(deferredValue);
  return el;
}

export function Fragment(props: { children?: Child }): Node {
  const f = document.createDocumentFragment();
  append(f, props.children);
  return f;
}

/** Обʼєднання класів: cx('a', cond && 'b'). */
export function cx(...list: (string | false | null | undefined)[]): string {
  return list.filter(Boolean).join(' ');
}

/** Блок, який можна перемалювати на місці, не чіпаючи решту екрана. */
export function live(render: () => Child): { el: HTMLElement; refresh: () => void } {
  const el = document.createElement('div');
  el.className = 'live';
  const refresh = () => {
    const f = document.createDocumentFragment();
    append(f, render());
    el.replaceChildren(f);
  };
  refresh();
  return { el, refresh };
}

export function reducedMotion(): boolean {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}
