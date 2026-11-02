/* ДЕНЬ × 365 — зібраний застосунок. Згенеровано build.mjs із *.ts / *.tsx; не редагуй вручну — зміни вихідний файл і виконай «npm run build». */
(function () {
'use strict';
var defs = {};

// ── dom.ts
defs["dom.js"] = function (require, exports, module) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.append = append;
exports.h = h;
exports.Fragment = Fragment;
exports.cx = cx;
exports.live = live;
exports.reducedMotion = reducedMotion;
const SVG_NS = 'http://www.w3.org/2000/svg';
const SVG_TAGS = new Set([
    'svg', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'g', 'defs',
    'linearGradient', 'radialGradient', 'stop', 'ellipse', 'text', 'tspan', 'clipPath', 'mask', 'pattern',
]);
const PROPS = new Set(['checked', 'selected', 'disabled', 'hidden', 'multiple', 'readOnly', 'indeterminate']);
function append(parent, child) {
    if (child === null || child === undefined || child === false || child === true)
        return;
    if (Array.isArray(child)) {
        for (const c of child)
            append(parent, c);
        return;
    }
    parent.appendChild(child instanceof Node ? child : document.createTextNode(String(child)));
}
function h(tag, props, ...children) {
    if (typeof tag === 'function') {
        const out = tag({ ...(props ?? {}), children: children.length === 1 ? children[0] : children });
        return out ?? document.createComment('');
    }
    const svg = SVG_TAGS.has(tag);
    const el = svg ? document.createElementNS(SVG_NS, tag) : document.createElement(tag);
    let deferredValue;
    if (props) {
        for (const [k, v] of Object.entries(props)) {
            if (v === undefined || v === null || v === false)
                continue;
            if (k === 'ref') {
                v(el);
            }
            else if (k.startsWith('on') && typeof v === 'function') {
                el.addEventListener(k.slice(2).toLowerCase(), v);
            }
            else if (k === 'class' || k === 'className') {
                el.setAttribute('class', String(v));
            }
            else if (k === 'style') {
                if (typeof v === 'string')
                    el.setAttribute('style', v);
                else
                    Object.assign(el.style, v);
            }
            else if (k === 'value' && !svg) {
                deferredValue = v;
            }
            else if (!svg && PROPS.has(k)) {
                el[k] = Boolean(v);
            }
            else if (k === 'html') {
                el.innerHTML = String(v);
            }
            else {
                el.setAttribute(k, v === true ? '' : String(v));
            }
        }
    }
    for (const c of children)
        append(el, c);
    if (deferredValue !== undefined)
        el.value = String(deferredValue);
    return el;
}
function Fragment(props) {
    const f = document.createDocumentFragment();
    append(f, props.children);
    return f;
}
function cx(...list) {
    return list.filter(Boolean).join(' ');
}
function live(render) {
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
function reducedMotion() {
    return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}
};

// ── icons.ts
defs["icons.js"] = function (require, exports, module) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ICON_NAMES = void 0;
exports.icon = icon;
const SVG_NS = 'http://www.w3.org/2000/svg';
const P = {
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>',
    moon: '<path d="M20 14.6A8.2 8.2 0 0 1 9.4 4a7 7 0 1 0 10.6 10.6z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    plusCircle: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
    bars: '<rect x="4" y="11" width="4" height="9" rx="1.2"/><rect x="10" y="4" width="4" height="16" rx="1.2"/><rect x="16" y="14" width="4" height="6" rx="1.2"/>',
    sprout: '<path d="M12 21v-9"/><path d="M12 12c0-4-3-6.5-7.5-6.5 0 4.2 3.2 6.5 7.5 6.5z"/><path d="M12 10c0-3.3 2.6-5.5 6.5-5.5 0 3.6-2.8 5.5-6.5 5.5z"/><path d="M8 21h8"/>',
    sliders: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
    bus: '<rect x="5" y="3.5" width="14" height="14" rx="3"/><path d="M5 11h14M8.5 17.5v2.5M15.5 17.5v2.5M9 6.5h6"/><circle cx="8.5" cy="14.2" r=".9"/><circle cx="15.5" cy="14.2" r=".9"/>',
    tram: '<rect x="6" y="6.5" width="12" height="11.5" rx="3"/><path d="M6 12.5h12M9 3.5h6M12 3.5v3M9.5 18l-2 3M14.5 18l2 3"/><circle cx="9.5" cy="15.2" r=".8"/><circle cx="14.5" cy="15.2" r=".8"/>',
    trolley: '<rect x="4" y="8" width="16" height="9.5" rx="2.8"/><path d="M4 12.5h16M9 8l3-5M12.5 8l3-5"/><circle cx="8" cy="18.5" r="1.4"/><circle cx="16" cy="18.5" r="1.4"/>',
    metro: '<rect x="6" y="3" width="12" height="14" rx="3.5"/><path d="M6 10h12M8.5 21l2-4M15.5 21l-2-4"/><circle cx="9.2" cy="13.5" r=".9"/><circle cx="14.8" cy="13.5" r=".9"/>',
    car: '<path d="M4 16.5v-4l2.2-5.2A2 2 0 0 1 8 6h8a2 2 0 0 1 1.8 1.3l2.2 5.2v4"/><path d="M3 16.5h18M4 12.5h16"/><circle cx="7.5" cy="18" r="1.6"/><circle cx="16.5" cy="18" r="1.6"/>',
    taxi: '<path d="M4 17v-4l2.2-5.2A2 2 0 0 1 8 6.5h8a2 2 0 0 1 1.8 1.3L20 13v4"/><path d="M3 17h18M4 13h16"/><rect x="10" y="3" width="4" height="2.5" rx=".6"/><circle cx="7.5" cy="18.5" r="1.5"/><circle cx="16.5" cy="18.5" r="1.5"/>',
    walk: '<ellipse cx="9" cy="7.5" rx="2.4" ry="3.6"/><ellipse cx="15.5" cy="14" rx="2.4" ry="3.6"/><path d="M7.8 14h2.6M14.3 20.5h2.6"/>',
    route: '<circle cx="6" cy="18.5" r="2"/><circle cx="18" cy="5.5" r="2"/><path d="M6 16.5V12a3 3 0 0 1 3-3h6a3 3 0 0 0 3-3v-.5"/>',
    basket: '<path d="M3.5 10h17l-1.6 8.6a2 2 0 0 1-2 1.6H7.1a2 2 0 0 1-2-1.6z"/><path d="M8 10l3-6M16 10l-3-6M10 14v2.8M14 14v2.8"/>',
    utensils: '<path d="M7 3v6a2 2 0 0 0 4 0V3"/><path d="M9 11v10"/><path d="M17.5 21V3c-2 1.2-3.5 4-3.5 7.5h3.5"/>',
    coffee: '<path d="M5 9h11v4.5A5.5 5.5 0 0 1 10.5 19h0A5.5 5.5 0 0 1 5 13.5z"/><path d="M16 10.5h1.5a2.5 2.5 0 0 1 0 5H16M8 3.5v2.5M11.5 3.5v2.5M4 21h13"/>',
    cup: '<path d="M6 8h12l-1.3 10.2a2 2 0 0 1-2 1.8H9.3a2 2 0 0 1-2-1.8z"/><path d="M9 4.5c0 1.5 1.5 1.5 1.5 3M13.5 4.5c0 1.5 1.5 1.5 1.5 3"/>',
    drop: '<path d="M12 3.5c3.2 4 6 7.2 6 10.6a6 6 0 0 1-12 0C6 10.7 8.8 7.5 12 3.5z"/>',
    candy: '<circle cx="12" cy="12" r="4"/><path d="M8.3 10.2 4 7.5v9l4.3-2.7M15.7 10.2 20 7.5v9l-4.3-2.7"/>',
    cookie: '<circle cx="12" cy="12" r="8.5"/><circle cx="9" cy="9.5" r=".9"/><circle cx="14.5" cy="8.5" r=".9"/><circle cx="15" cy="14" r=".9"/><circle cx="9.5" cy="15" r=".9"/>',
    choco: '<rect x="6" y="3" width="12" height="18" rx="2"/><path d="M6 9h12M6 15h12M12 3v18"/>',
    pastry: '<path d="M4 15c0-5 3.6-8 8-8s8 3 8 8c-2 1.5-4.5 2-8 2s-6-.5-8-2z"/><path d="M9 8.5 10.5 16M15 8.5 13.5 16"/>',
    icecream: '<path d="M7.5 10a4.5 4.5 0 0 1 9 0z"/><path d="M7.5 10l4.5 11 4.5-11"/>',
    home: '<path d="M4 11l8-7 8 7"/><path d="M6 9.5V20h12V9.5"/><path d="M10 20v-5.5h4V20"/>',
    box: '<path d="M4 7.5 12 4l8 3.5v9L12 20l-8-3.5z"/><path d="M4 7.5 12 11l8-3.5M12 11v9"/>',
    doc: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 12h5M10 16h5"/>',
    gift: '<rect x="4" y="9" width="16" height="11" rx="1.5"/><path d="M3 9h18M12 9v11M12 9c-1.5-3-5-3.5-5-1.2C7 9 12 9 12 9zM12 9c1.5-3 5-3.5 5-1.2C17 9 12 9 12 9z"/>',
    heart: '<path d="M12 20s-7.5-4.4-7.5-10A4.3 4.3 0 0 1 12 7.3 4.3 4.3 0 0 1 19.5 10c0 5.6-7.5 10-7.5 10z"/>',
    book: '<path d="M5 4.5h5.5A2.5 2.5 0 0 1 13 7v13a2 2 0 0 0-2-2H5z"/><path d="M19 4.5h-3.5A2.5 2.5 0 0 0 13 7v13a2 2 0 0 1 2-2h4z"/>',
    shirt: '<path d="M8.5 4 4 6.5l1.8 4L8 9.6V20h8V9.6l2.2.9 1.8-4L15.5 4a3.5 3.5 0 0 1-7 0z"/>',
    pill: '<rect x="3.5" y="8.5" width="17" height="7" rx="3.5" transform="rotate(-35 12 12)"/><path d="M9.5 8.3l5 7.4"/>',
    phone: '<rect x="7" y="3" width="10" height="18" rx="2.5"/><path d="M11 18h2"/>',
    paw: '<circle cx="7" cy="10" r="1.7"/><circle cx="10.5" cy="6.5" r="1.7"/><circle cx="14.5" cy="6.5" r="1.7"/><circle cx="18" cy="10" r="1.7"/><path d="M12 11.5c-2.6 0-5 3.7-5 5.8 0 1.6 1.4 2.2 2.6 2.2 1 0 1.5-.7 2.4-.7s1.4.7 2.4.7c1.2 0 2.6-.6 2.6-2.2 0-2.1-2.4-5.8-5-5.8z"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    checkCircle: '<circle cx="12" cy="12" r="9"/><path d="M8 12.3l2.8 2.8L16.2 9.6"/>',
    circle: '<circle cx="12" cy="12" r="9"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    chevronLeft: '<path d="M15 5l-7 7 7 7"/>',
    chevronRight: '<path d="M9 5l7 7-7 7"/>',
    chevronDown: '<path d="M5 9l7 7 7-7"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    coins: '<ellipse cx="12" cy="6" rx="7" ry="2.5"/><path d="M5 6v4c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6"/><path d="M5 10v4c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-4"/><path d="M5 14v4c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-4"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
    flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
    star: '<path d="M12 3.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 16.9l-5.3 2.7 1-5.8-4.2-4.1 5.9-.9z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/>',
    users: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20a6 6 0 0 1 12 0"/><circle cx="17" cy="9" r="2.5"/><path d="M15.8 14.4A5 5 0 0 1 21 19.5"/>',
    fuel: '<path d="M5 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M3 21h14M5 10h10"/><path d="M15 8h2a2 2 0 0 1 2 2v6a1.5 1.5 0 0 0 3 0V9l-3-3"/>',
    parking: '<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M10 16.5V7.5h3a2.6 2.6 0 0 1 0 5.2h-3"/>',
    refund: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>',
    transfer: '<path d="M4 8h15M15 4l4 4-4 4M20 16H5M9 12l-4 4 4 4"/>',
    arrowDown: '<path d="M12 4v15M6 13l6 6 6-6"/>',
    arrowUp: '<path d="M12 20V5M6 11l6-6 6 6"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.3-4.3"/>',
    trash: '<path d="M4 7h16M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13M10 11v5M14 11v5"/>',
    edit: '<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
    download: '<path d="M12 4v11M7 10.5l5 5 5-5M5 20h14"/>',
    upload: '<path d="M12 15V4M7 8.5l5-5 5 5M5 20h14"/>',
    share: '<path d="M12 3v12M8 7l4-4 4 4M6 11v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6"/><circle cx="12" cy="7.7" r=".6" fill="currentColor"/>',
    spark: '<path d="M12 3c.6 4.2 2 5.6 6.2 6.2-4.2.6-5.6 2-6.2 6.2-.6-4.2-2-5.6-6.2-6.2C10 8.6 11.4 7.2 12 3z"/><path d="M18.5 15.5c.2 1.4.7 1.9 2 2-1.3.2-1.8.7-2 2-.2-1.3-.7-1.8-2-2 1.3-.1 1.8-.6 2-2z"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3.2 4M16 6h3a3 3 0 0 1-3.2 4M12 13v3.5M8.5 20.5h7M10 16.5h4v4h-4z"/>',
    smile: '<circle cx="12" cy="12" r="9"/><path d="M8.5 14a4 4 0 0 0 7 0"/><circle cx="9" cy="10" r=".7" fill="currentColor"/><circle cx="15" cy="10" r=".7" fill="currentColor"/>',
    bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1.1 1 1.8V16h5v-.3c0-.7.4-1.4 1-1.8A6 6 0 0 0 12 3z"/>',
    wallet: '<rect x="3" y="6" width="18" height="14" rx="3"/><path d="M3 10h18M16.5 15h1.5"/><path d="M6 6l9-2.8a1.5 1.5 0 0 1 1.9 1.4V6"/>',
    shield: '<path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6z"/><path d="M9 12l2 2 4-4"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
    more: '<circle cx="6" cy="12" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/><circle cx="18" cy="12" r="1.3" fill="currentColor"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1" fill="currentColor"/><circle cx="4.5" cy="12" r="1" fill="currentColor"/><circle cx="4.5" cy="18" r="1" fill="currentColor"/>',
    pen: '<path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19z"/>',
    chart: '<path d="M4 4v16h16"/><rect x="7.5" y="11" width="3" height="6" rx=".8"/><rect x="12.5" y="7" width="3" height="10" rx=".8"/><rect x="17.5" y="13" width="1.8" height="4" rx=".6"/>',
    sunrise: '<path d="M3 18h18M6.5 18a5.5 5.5 0 0 1 11 0M12 5v4M5.6 10.6l1.5 1.5M18.4 10.6l-1.5 1.5"/>',
    lunchbox: '<rect x="3.5" y="9" width="17" height="10.5" rx="2.5"/><path d="M3.5 13.5h17M9 9V6.5h6V9"/>',
    burger: '<path d="M4.5 11a7.5 5 0 0 1 15 0z"/><path d="M3.5 14h17"/><path d="M5 17h14v.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 5 17.5z"/>',
    truck: '<path d="M3 6.5h11v9.5H3zM14 9.5h4l3 3.5v3h-7"/><circle cx="7" cy="17.5" r="1.7"/><circle cx="17" cy="17.5" r="1.7"/>',
    repeat: '<path d="M20 11a8 8 0 0 0-14.3-4.9L4 8M4 4v4h4M4 13a8 8 0 0 0 14.3 4.9L20 16M20 20v-4h-4"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
    minus: '<path d="M5 12h14"/>',
    backspace: '<path d="M9 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-6-7z"/><path d="M12 9.5l5 5M17 9.5l-5 5"/>',
    map: '<path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6z"/><path d="M9 4v14M15 6v14"/>',
};
function icon(name, size = 22, cls = '') {
    const el = document.createElementNS(SVG_NS, 'svg');
    el.setAttribute('viewBox', '0 0 24 24');
    el.setAttribute('width', String(size));
    el.setAttribute('height', String(size));
    el.setAttribute('fill', 'none');
    el.setAttribute('stroke', 'currentColor');
    el.setAttribute('stroke-width', '1.8');
    el.setAttribute('stroke-linecap', 'round');
    el.setAttribute('stroke-linejoin', 'round');
    el.setAttribute('aria-hidden', 'true');
    el.setAttribute('class', cls ? `ic ${cls}` : 'ic');
    el.innerHTML = P[name] ?? P.box;
    return el;
}
exports.ICON_NAMES = Object.keys(P);
};

// ── money.ts
defs["money.js"] = function (require, exports, module) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TIMES = exports.TRIPS = exports.WORKDAYS = exports.DAYS = exports.MAX_KOP = exports.MINUS = exports.NBSP = void 0;
exports.uah = uah;
exports.parseMoney = parseMoney;
exports.groupDigits = groupDigits;
exports.fmt = fmt;
exports.toInput = toInput;
exports.compact = compact;
exports.roundDiv = roundDiv;
exports.sumKop = sumKop;
exports.percent = percent;
exports.plural = plural;
exports.count = count;
exports.NBSP = ' ';
exports.MINUS = '−';
exports.MAX_KOP = 1_000_000_000;
function uah(hryvnias) {
    return Math.round(hryvnias * 100);
}
function parseMoney(raw) {
    if (raw === null || raw === undefined)
        return null;
    let s = typeof raw === 'number' ? String(raw) : raw;
    s = s
        .replace(/[\s  ]/g, '')
        .replace(/(грн\.?|₴)$/i, '')
        .replace(',', '.');
    if (s === '' || s === '.')
        return null;
    if (!/^\d*(\.\d*)?$/.test(s))
        return null;
    const [intStr, fracStr = ''] = s.split('.');
    const intPart = intStr === '' ? 0 : Number(intStr);
    if (!Number.isSafeInteger(intPart))
        return null;
    const frac = (fracStr + '000').slice(0, 3);
    let kop = intPart * 100 + Number(frac.slice(0, 2));
    if (Number(frac[2]) >= 5)
        kop += 1;
    if (!Number.isSafeInteger(kop) || kop > exports.MAX_KOP)
        return null;
    return kop;
}
function groupDigits(n) {
    return String(Math.trunc(Math.abs(n))).replace(/\B(?=(\d{3})+(?!\d))/g, exports.NBSP);
}
function fmt(kop, o = {}) {
    const v = Math.round(kop);
    const neg = v < 0;
    const abs = Math.abs(v);
    let whole = Math.floor(abs / 100);
    let cents = abs % 100;
    const mode = o.decimals ?? 'auto';
    if (mode === 'never' && cents !== 0) {
        if (cents >= 50)
            whole += 1;
        cents = 0;
    }
    const showDec = mode === 'always' || (mode === 'auto' && cents !== 0);
    let s = groupDigits(whole) + (showDec ? ',' + String(cents).padStart(2, '0') : '');
    if (neg && (whole !== 0 || cents !== 0))
        s = exports.MINUS + s;
    else if (o.sign && v > 0)
        s = '+' + s;
    return o.currency === false ? s : s + exports.NBSP + 'грн';
}
function toInput(kop) {
    if (kop === null || kop === undefined)
        return '';
    const whole = Math.floor(Math.abs(kop) / 100);
    const cents = Math.abs(kop) % 100;
    if (cents === 0)
        return String(whole);
    return `${whole},${String(cents).padStart(2, '0').replace(/0$/, '')}`;
}
function trim1(x) {
    const r = Math.round(x * 10) / 10;
    return (Number.isInteger(r) ? String(r) : r.toFixed(1)).replace('.', ',');
}
function compact(kop) {
    const g = Math.abs(kop) / 100;
    const sign = kop < 0 ? exports.MINUS : '';
    if (g >= 1_000_000)
        return sign + trim1(g / 1_000_000) + exports.NBSP + 'млн';
    if (g >= 10_000)
        return sign + String(Math.round(g / 1000)) + exports.NBSP + 'тис.';
    if (g >= 1_000)
        return sign + trim1(g / 1000) + exports.NBSP + 'тис.';
    return sign + String(Math.round(g));
}
function roundDiv(n, d) {
    if (d === 0)
        return 0;
    const q = n / d;
    return q >= 0 ? Math.floor(q + 0.5) : -Math.floor(-q + 0.5);
}
function sumKop(list) {
    let s = 0;
    for (const v of list)
        s += v;
    return s;
}
function percent(part, whole) {
    if (whole <= 0)
        return null;
    return Math.round((part * 100) / whole);
}
function plural(n, forms) {
    const a = Math.abs(Math.trunc(n)) % 100;
    const b = a % 10;
    if (a > 10 && a < 20)
        return forms[2];
    if (b === 1)
        return forms[0];
    if (b >= 2 && b <= 4)
        return forms[1];
    return forms[2];
}
exports.DAYS = ['день', 'дні', 'днів'];
exports.WORKDAYS = ['робочий день', 'робочі дні', 'робочих днів'];
exports.TRIPS = ['поїздка', 'поїздки', 'поїздок'];
exports.TIMES = ['раз', 'рази', 'разів'];
function count(n, forms) {
    return `${n}${exports.NBSP}${plural(n, forms)}`;
}
};

// ── ui.tsx
defs["ui.js"] = function (require, exports, module) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Btn = Btn;
exports.IconBtn = IconBtn;
exports.Seg = Seg;
exports.Chip = Chip;
exports.Toggle = Toggle;
exports.Group = Group;
exports.Row = Row;
exports.CatIcon = CatIcon;
exports.Empty = Empty;
exports.Progress = Progress;
exports.Note = Note;
exports.Field = Field;
exports.MoneyInput = MoneyInput;
exports.NumInput = NumInput;
exports.TextInput = TextInput;
exports.DateInput = DateInput;
exports.Select = Select;
exports.Stepper = Stepper;
exports.Stars = Stars;
exports.makeAmountPad = makeAmountPad;
exports.Num = Num;
exports.Ring = Ring;
exports.openSheet = openSheet;
exports.refreshSheets = refreshSheets;
exports.closeTopSheet = closeTopSheet;
exports.confirmSheet = confirmSheet;
exports.InfoTip = InfoTip;
exports.toast = toast;
const dom_ts_1 = require("./dom.js");
const icons_ts_1 = require("./icons.js");
const money_ts_1 = require("./money.js");
function Btn(p) {
    return ((0, dom_ts_1.h)("button", { type: "button", class: (0, dom_ts_1.cx)('btn', `btn-${p.kind ?? 'secondary'}`, `btn-${p.size ?? 'md'}`, p.full && 'btn-full'), disabled: p.disabled, "aria-label": p.label, onClick: p.onClick },
        p.icon ? (0, icons_ts_1.icon)(p.icon, p.size === 'sm' ? 16 : 20) : null,
        p.children !== undefined ? (0, dom_ts_1.h)("span", null, p.children) : null));
}
function IconBtn(p) {
    return ((0, dom_ts_1.h)("button", { type: "button", class: "btn-icon", "aria-label": p.label, title: p.label, disabled: p.disabled, onClick: p.onClick }, (0, icons_ts_1.icon)(p.icon, 20)));
}
function Seg(p) {
    return ((0, dom_ts_1.h)("div", { class: (0, dom_ts_1.cx)('seg', p.small && 'seg-sm'), role: "tablist", "aria-label": p.label }, p.options.map((o) => ((0, dom_ts_1.h)("button", { type: "button", role: "tab", "aria-selected": o.value === p.value ? 'true' : 'false', class: (0, dom_ts_1.cx)('seg-opt', o.value === p.value && 'on'), onClick: () => p.onChange(o.value) }, o.label)))));
}
function Chip(p) {
    return ((0, dom_ts_1.h)("button", { type: "button", class: (0, dom_ts_1.cx)('chip', p.on && 'on'), "aria-pressed": p.on ? 'true' : 'false', "aria-label": p.label, onClick: p.onClick, style: p.color ? `--c:${p.color}` : undefined },
        p.icon ? (0, icons_ts_1.icon)(p.icon, 16) : null,
        (0, dom_ts_1.h)("span", null, p.children)));
}
function Toggle(p) {
    return ((0, dom_ts_1.h)("label", { class: "toggle" },
        (0, dom_ts_1.h)("input", { type: "checkbox", role: "switch", checked: p.checked, "aria-label": p.label, onChange: (e) => p.onChange(e.target.checked) }),
        (0, dom_ts_1.h)("span", { class: "toggle-track" },
            (0, dom_ts_1.h)("span", { class: "toggle-knob" }))));
}
function Group(p) {
    return ((0, dom_ts_1.h)("section", { class: (0, dom_ts_1.cx)('group', p.class) },
        p.title || p.action ? ((0, dom_ts_1.h)("div", { class: "group-head" },
            p.title ? (0, dom_ts_1.h)("h3", { class: "group-title" }, p.title) : (0, dom_ts_1.h)("span", null),
            p.action ?? null)) : null,
        (0, dom_ts_1.h)("div", { class: "group-body" }, p.children),
        p.foot ? (0, dom_ts_1.h)("p", { class: "group-foot" }, p.foot) : null));
}
function Row(p) {
    const inner = ((0, dom_ts_1.h)(dom_ts_1.Fragment, null,
        p.icon ? (0, dom_ts_1.h)("span", { class: "row-icon", style: p.color ? `--c:${p.color}` : undefined }, (0, icons_ts_1.icon)(p.icon, 18)) : null,
        (0, dom_ts_1.h)("span", { class: "row-main" },
            (0, dom_ts_1.h)("span", { class: "row-title" }, p.title),
            p.sub ? (0, dom_ts_1.h)("span", { class: "row-sub" }, p.sub) : null),
        p.value !== undefined && p.value !== null ? (0, dom_ts_1.h)("span", { class: (0, dom_ts_1.cx)('row-value', p.valueTone) }, p.value) : null,
        p.right ?? null,
        p.chevron ? (0, dom_ts_1.h)("span", { class: "row-chev" }, (0, icons_ts_1.icon)('chevronRight', 16)) : null));
    return (p.onClick
        ? (0, dom_ts_1.h)("button", { type: "button", class: (0, dom_ts_1.cx)('row', 'tap', p.class), onClick: p.onClick }, inner)
        : (0, dom_ts_1.h)("div", { class: (0, dom_ts_1.cx)('row', p.class) }, inner));
}
function CatIcon(p) {
    return (0, dom_ts_1.h)("span", { class: "cat-icon", style: `--c:${p.cat.color}` }, (0, icons_ts_1.icon)(p.cat.icon, p.size ?? 20));
}
function Empty(p) {
    return ((0, dom_ts_1.h)("div", { class: "empty" },
        (0, dom_ts_1.h)("span", { class: "empty-icon" }, (0, icons_ts_1.icon)(p.icon, 26)),
        (0, dom_ts_1.h)("p", { class: "empty-title" }, p.title),
        p.text ? (0, dom_ts_1.h)("p", { class: "empty-text" }, p.text) : null,
        p.action ?? null));
}
function Progress(p) {
    const v = Math.max(0, Math.min(1, p.value));
    return ((0, dom_ts_1.h)("div", { class: (0, dom_ts_1.cx)('progress', `tone-${p.tone ?? 'accent'}`), role: "progressbar", "aria-valuemin": "0", "aria-valuemax": "100", "aria-valuenow": String(Math.round(v * 100)), "aria-label": p.label },
        (0, dom_ts_1.h)("span", { style: `width:${(v * 100).toFixed(1)}%` })));
}
function Note(p) {
    return ((0, dom_ts_1.h)("div", { class: (0, dom_ts_1.cx)('note', `note-${p.tone ?? 'info'}`) },
        (0, icons_ts_1.icon)(p.icon ?? (p.tone === 'warn' ? 'info' : p.tone === 'good' ? 'checkCircle' : 'info'), 18),
        (0, dom_ts_1.h)("div", null, p.children)));
}
function Field(p) {
    return ((0, dom_ts_1.h)("label", { class: (0, dom_ts_1.cx)('field', p.inline && 'field-inline') },
        (0, dom_ts_1.h)("span", { class: "field-label" }, p.label),
        p.children,
        p.hint ? (0, dom_ts_1.h)("span", { class: "hint" }, p.hint) : null));
}
function MoneyInput(p) {
    return ((0, dom_ts_1.h)("span", { class: "input-wrap" },
        (0, dom_ts_1.h)("input", { class: "input", type: "text", inputmode: "decimal", autocomplete: "off", "aria-label": p.label, placeholder: p.placeholder ?? '0', value: (0, money_ts_1.toInput)(p.value), onInput: (e) => p.onChange((0, money_ts_1.parseMoney)(e.target.value)) }),
        (0, dom_ts_1.h)("span", { class: "input-suffix" }, "\u0433\u0440\u043D")));
}
function NumInput(p) {
    return ((0, dom_ts_1.h)("span", { class: "input-wrap" },
        (0, dom_ts_1.h)("input", { class: "input", type: "text", inputmode: p.decimals ? 'decimal' : 'numeric', autocomplete: "off", "aria-label": p.label, placeholder: p.placeholder ?? '', value: p.value === null ? '' : String(p.value).replace('.', ','), onInput: (e) => {
                const raw = e.target.value.replace(',', '.').replace(/\s/g, '');
                if (raw === '')
                    return p.onChange(null);
                const n = Number(raw);
                p.onChange(Number.isFinite(n) && n >= 0 ? (p.decimals ? n : Math.round(n)) : null);
            } }),
        p.suffix ? (0, dom_ts_1.h)("span", { class: "input-suffix" }, p.suffix) : null));
}
function TextInput(p) {
    return ((0, dom_ts_1.h)("input", { class: "input", type: "text", "aria-label": p.label, maxlength: String(p.max ?? 120), placeholder: p.placeholder ?? '', value: p.value, onInput: (e) => p.onChange(e.target.value) }));
}
function DateInput(p) {
    return ((0, dom_ts_1.h)("input", { class: "input input-date", type: "date", "aria-label": p.label, value: p.value, max: p.max, min: p.min, onChange: (e) => {
            const v = e.target.value;
            if (v)
                p.onChange(v);
        } }));
}
function Select(p) {
    return ((0, dom_ts_1.h)("span", { class: "select-wrap" },
        (0, dom_ts_1.h)("select", { class: "input", "aria-label": p.label, value: p.value, onChange: (e) => p.onChange(e.target.value) }, p.options.map((o) => (0, dom_ts_1.h)("option", { value: o.value }, o.label))),
        (0, icons_ts_1.icon)('chevronDown', 16)));
}
function Stepper(p) {
    const box = (0, dom_ts_1.live)(() => ((0, dom_ts_1.h)("div", { class: "stepper", role: "group", "aria-label": p.label },
        (0, dom_ts_1.h)("button", { type: "button", class: "stepper-btn", "aria-label": "\u041C\u0435\u043D\u0448\u0435", disabled: p.value <= p.min, onClick: () => { p.value = Math.max(p.min, p.value - 1); p.onChange(p.value); box.refresh(); } }, (0, icons_ts_1.icon)('minus', 18)),
        (0, dom_ts_1.h)("span", { class: "stepper-val num" }, p.value),
        (0, dom_ts_1.h)("button", { type: "button", class: "stepper-btn", "aria-label": "\u0411\u0456\u043B\u044C\u0448\u0435", disabled: p.value >= p.max, onClick: () => { p.value = Math.min(p.max, p.value + 1); p.onChange(p.value); box.refresh(); } }, (0, icons_ts_1.icon)('plus', 18)))));
    return box.el;
}
function Stars(p) {
    const box = (0, dom_ts_1.live)(() => ((0, dom_ts_1.h)("div", { class: "stars", role: "radiogroup", "aria-label": "\u041E\u0446\u0456\u043D\u043A\u0430 \u043A\u043E\u043C\u0444\u043E\u0440\u0442\u0443" }, [1, 2, 3, 4, 5].map((n) => ((0, dom_ts_1.h)("button", { type: "button", role: "radio", "aria-checked": p.value === n ? 'true' : 'false', "aria-label": `${n} з 5`, class: (0, dom_ts_1.cx)('star', p.value !== null && n <= p.value && 'on'), onClick: () => { p.value = p.value === n ? null : n; p.onChange(p.value); box.refresh(); } }, (0, icons_ts_1.icon)('star', 24)))))));
    return box.el;
}
function makeAmountPad(p) {
    let s = p.initial !== null && p.initial > 0 ? (0, money_ts_1.toInput)(p.initial) : '';
    const display = (0, dom_ts_1.h)("span", { class: "amount-value num" }, s || '0');
    const wrap = (0, dom_ts_1.h)("div", { class: (0, dom_ts_1.cx)('amount', !s && 'is-empty'), "aria-live": "polite" },
        display,
        (0, dom_ts_1.h)("span", { class: "amount-cur" }, "\u0433\u0440\u043D"));
    const show = () => {
        display.textContent = s || '0';
        wrap.classList.toggle('is-empty', !s);
    };
    const set = (next) => {
        s = next;
        show();
        p.onChange(s ? (0, money_ts_1.parseMoney)(s) : null);
    };
    const press = (k) => {
        if (k === 'del')
            return set(s.slice(0, -1));
        if (k === ',') {
            if (s.includes(','))
                return;
            return set((s || '0') + ',');
        }
        const [int, frac] = s.split(',');
        if (frac !== undefined && frac.length >= 2)
            return;
        if (frac === undefined && int.length >= 7)
            return;
        if (s === '0')
            return set(k);
        set(s + k);
    };
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', ',', '0', 'del'];
    const keypad = ((0, dom_ts_1.h)("div", { class: "keypad" }, keys.map((k) => ((0, dom_ts_1.h)("button", { type: "button", class: (0, dom_ts_1.cx)('key', k === 'del' && 'key-fn'), "aria-label": k === 'del' ? 'Стерти' : k, onClick: () => press(k) }, k === 'del' ? (0, icons_ts_1.icon)('backspace', 24) : k)))));
    return {
        display: wrap,
        keypad,
        set: (v) => {
            s = v !== null && v > 0 ? (0, money_ts_1.toInput)(v) : '';
            show();
        },
    };
}
const numPrev = new Map();
function Num(p) {
    const f = p.format ?? ((k) => (0, money_ts_1.fmt)(k));
    const el = (0, dom_ts_1.h)("span", { class: (0, dom_ts_1.cx)('num', p.class) }, f(p.value));
    const from = numPrev.get(p.id);
    numPrev.set(p.id, p.value);
    if (from !== undefined && from !== p.value && !(0, dom_ts_1.reducedMotion)()) {
        const start = performance.now();
        const dur = 480;
        el.textContent = f(from);
        const step = (t) => {
            const k = Math.min(1, (t - start) / dur);
            const e = 1 - Math.pow(1 - k, 3);
            if (k < 1) {
                el.textContent = f(Math.round((from + (p.value - from) * e) / 100) * 100);
                requestAnimationFrame(step);
            }
            else {
                el.textContent = f(p.value);
            }
        };
        requestAnimationFrame(step);
    }
    return el;
}
const ringPrev = new Map();
function Ring(p) {
    const R = 52;
    const C = 2 * Math.PI * R;
    const target = p.frac === null ? 0 : Math.max(0, Math.min(1, p.frac));
    const from = ringPrev.get(p.id) ?? 0;
    ringPrev.set(p.id, target);
    const bar = (0, dom_ts_1.h)("circle", { class: (0, dom_ts_1.cx)('ring-bar', `tone-${p.tone}`), cx: "60", cy: "60", r: String(R), transform: "rotate(-90 60 60)" });
    bar.style.strokeDasharray = `${C}`;
    bar.style.strokeDashoffset = `${C * (1 - ((0, dom_ts_1.reducedMotion)() ? target : from))}`;
    if (from !== target && !(0, dom_ts_1.reducedMotion)()) {
        requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.strokeDashoffset = `${C * (1 - target)}`; }));
    }
    const ticks = (0, dom_ts_1.h)("g", { class: "ring-ticks" });
    for (let i = 0; i < 60; i++) {
        const a = (i / 60) * Math.PI * 2;
        const r1 = 40.5;
        const r2 = i % 5 === 0 ? 37 : 38.6;
        ticks.appendChild((0, dom_ts_1.h)("line", { x1: String(60 + r1 * Math.sin(a)), y1: String(60 - r1 * Math.cos(a)), x2: String(60 + r2 * Math.sin(a)), y2: String(60 - r2 * Math.cos(a)) }));
    }
    return ((0, dom_ts_1.h)("div", { class: "ring", style: `--size:${p.size ?? 132}px` },
        (0, dom_ts_1.h)("svg", { viewBox: "0 0 120 120", "aria-hidden": "true" },
            ticks,
            (0, dom_ts_1.h)("circle", { class: "ring-track", cx: "60", cy: "60", r: String(R) }),
            bar),
        (0, dom_ts_1.h)("div", { class: "ring-center" }, p.children)));
}
const sheets = [];
function openSheet(o) {
    const layer = document.getElementById('sheets') ?? document.body;
    let closed = false;
    const body = (0, dom_ts_1.h)("div", { class: "sheet-body" });
    const backdrop = (0, dom_ts_1.h)("div", { class: "backdrop" });
    const close = () => {
        if (closed)
            return;
        closed = true;
        panel.classList.remove('in');
        backdrop.classList.remove('in');
        const i = sheets.indexOf(entry);
        if (i >= 0)
            sheets.splice(i, 1);
        if (!sheets.length)
            document.documentElement.classList.remove('sheet-open');
        setTimeout(() => wrap.remove(), (0, dom_ts_1.reducedMotion)() ? 0 : 280);
        o.onClose?.();
    };
    const panel = ((0, dom_ts_1.h)("section", { class: (0, dom_ts_1.cx)('sheet', o.tall && 'sheet-tall'), role: "dialog", "aria-modal": "true", "aria-label": o.title },
        (0, dom_ts_1.h)("div", { class: "sheet-grab" },
            (0, dom_ts_1.h)("span", { class: "sheet-handle" })),
        (0, dom_ts_1.h)("header", { class: "sheet-head" },
            (0, dom_ts_1.h)("h2", { class: "sheet-title" }, o.title),
            (0, dom_ts_1.h)(IconBtn, { icon: "x", label: "\u0417\u0430\u043A\u0440\u0438\u0442\u0438", onClick: close })),
        body));
    const wrap = (0, dom_ts_1.h)("div", { class: "sheet-wrap" },
        backdrop,
        panel);
    backdrop.addEventListener('click', close);
    const entry = { body, render: o.render, live: Boolean(o.live), close };
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
function toNodes(c) {
    const f = document.createDocumentFragment();
    const tmp = (0, dom_ts_1.h)("div", null, c);
    f.append(...Array.from(tmp.childNodes));
    return Array.from(f.childNodes);
}
function enableSwipe(panel, close) {
    const grab = panel.querySelector('.sheet-grab');
    const head = panel.querySelector('.sheet-head');
    let startY = 0;
    let dy = 0;
    let active = false;
    const down = (e) => {
        if (e.target.closest('button'))
            return;
        active = true;
        startY = e.clientY;
        dy = 0;
        panel.style.transition = 'none';
    };
    const move = (e) => {
        if (!active)
            return;
        dy = Math.max(0, e.clientY - startY);
        panel.style.transform = `translateY(${dy}px)`;
    };
    const up = () => {
        if (!active)
            return;
        active = false;
        panel.style.transition = '';
        panel.style.transform = '';
        if (dy > 90)
            close();
    };
    for (const el of [grab, head]) {
        el.addEventListener('pointerdown', down);
        el.addEventListener('pointermove', move);
        el.addEventListener('pointerup', up);
        el.addEventListener('pointercancel', up);
    }
}
function refreshSheets() {
    for (const s of sheets) {
        if (!s.live)
            continue;
        const top = s.body.scrollTop;
        s.body.replaceChildren(...toNodes(s.render(s.close)));
        s.body.scrollTop = top;
    }
}
function closeTopSheet() {
    const s = sheets[sheets.length - 1];
    if (!s)
        return false;
    s.close();
    return true;
}
function confirmSheet(o) {
    openSheet({
        title: o.title,
        render: (close) => ((0, dom_ts_1.h)("div", { class: "stack" },
            (0, dom_ts_1.h)("p", { class: "lead" }, o.text),
            (0, dom_ts_1.h)(Btn, { kind: o.danger ? 'danger' : 'primary', size: "lg", full: true, onClick: () => { close(); o.onConfirm(); } }, o.confirm),
            (0, dom_ts_1.h)(Btn, { kind: "ghost", size: "lg", full: true, onClick: close }, "\u0421\u043A\u0430\u0441\u0443\u0432\u0430\u0442\u0438"))),
    });
}
function InfoTip(p) {
    const content = p.children;
    return ((0, dom_ts_1.h)("button", { type: "button", class: "info-tip", "aria-label": `Що таке «${p.title}»`, onClick: (e) => {
            e.stopPropagation();
            openSheet({ title: p.title, render: () => (0, dom_ts_1.h)("div", { class: "prose" }, content) });
        } }, (0, icons_ts_1.icon)('info', 15)));
}
let toastTimer = 0;
function toast(msg, actions = [], ms = 4200) {
    const layer = document.getElementById('toasts');
    if (!layer)
        return;
    clearTimeout(toastTimer);
    const el = ((0, dom_ts_1.h)("div", { class: "toast", role: "status" },
        (0, dom_ts_1.h)("span", { class: "toast-text" }, msg),
        actions.map((a) => ((0, dom_ts_1.h)("button", { type: "button", class: "toast-btn", onClick: () => { a.run(); el.classList.remove('in'); setTimeout(() => el.remove(), 200); } }, a.label)))));
    layer.replaceChildren(el);
    requestAnimationFrame(() => el.classList.add('in'));
    toastTimer = window.setTimeout(() => {
        el.classList.remove('in');
        setTimeout(() => el.remove(), 250);
    }, ms);
}
};

// ── charts.tsx
defs["charts.js"] = function (require, exports, module) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarChart = BarChart;
exports.Donut = Donut;
exports.LineChart = LineChart;
exports.HBars = HBars;
const dom_ts_1 = require("./dom.js");
const money_ts_1 = require("./money.js");
function BarChart(p) {
    const W = 340;
    const H = p.height ?? 150;
    const top = 16;
    const bottom = 20;
    const n = p.bars.length;
    const max = Math.max(1, ...p.bars.map((b) => Math.max(b.value, b.plan ?? 0)));
    const slot = W / Math.max(1, n);
    const bw = Math.max(2, Math.min(24, slot * 0.6));
    const y = (v) => top + (H - top - bottom) * (1 - Math.max(0, v) / max);
    const every = Math.max(1, Math.ceil(n / 7));
    const svg = ((0, dom_ts_1.h)("svg", { viewBox: `0 0 ${W} ${H}`, class: "chart-svg", role: "img", "aria-label": p.label, preserveAspectRatio: "none" },
        (0, dom_ts_1.h)("line", { class: "axis", x1: "0", x2: String(W), y1: String(H - bottom), y2: String(H - bottom) }),
        (0, dom_ts_1.h)("text", { class: "chart-max", x: "0", y: "10" }, (0, money_ts_1.compact)(max)),
        p.bars.map((b, i) => {
            const cxp = slot * i + slot / 2;
            const bh = Math.max(b.value > 0 ? 2 : 0, H - bottom - y(b.value));
            return ((0, dom_ts_1.h)("g", { class: (0, dom_ts_1.cx)('bar', b.hl && 'hl', b.missing && 'missing', b.plan !== null && b.plan !== undefined && b.value > b.plan && 'over'), "data-key": b.key },
                b.missing
                    ? (0, dom_ts_1.h)("line", { class: "bar-missing", x1: String(cxp - bw / 2), x2: String(cxp + bw / 2), y1: String(H - bottom - 3), y2: String(H - bottom - 3) })
                    : (0, dom_ts_1.h)("rect", { x: String(cxp - bw / 2), y: String(H - bottom - bh), width: String(bw), height: String(bh), rx: String(Math.min(4, bw / 2)) }),
                b.plan ? (0, dom_ts_1.h)("line", { class: "bar-plan", x1: String(cxp - bw / 2 - 2), x2: String(cxp + bw / 2 + 2), y1: String(y(b.plan)), y2: String(y(b.plan)) }) : null,
                i % every === 0 || i === n - 1 ? (0, dom_ts_1.h)("text", { class: "chart-label", x: String(cxp), y: String(H - 5), "text-anchor": "middle" }, b.label) : null,
                (0, dom_ts_1.h)("rect", { class: "bar-hit", x: String(slot * i), y: "0", width: String(slot), height: String(H) })));
        })));
    if (p.onPick) {
        svg.addEventListener('click', (e) => {
            const g = e.target.closest('g.bar');
            const key = g?.getAttribute('data-key');
            if (key)
                p.onPick(key);
        });
    }
    return (0, dom_ts_1.h)("figure", { class: (0, dom_ts_1.cx)('chart', p.onPick && 'pickable') }, svg);
}
function Donut(p) {
    const R = 44;
    const C = 2 * Math.PI * R;
    const total = p.parts.reduce((s, x) => s + Math.max(0, x.value), 0);
    let acc = 0;
    const gap = p.parts.length > 1 ? 2 : 0;
    return ((0, dom_ts_1.h)("div", { class: "donut", style: `--size:${p.size ?? 150}px` },
        (0, dom_ts_1.h)("svg", { viewBox: "0 0 110 110", role: "img", "aria-label": `Розподіл: ${p.parts.map((x) => `${x.label} ${(0, money_ts_1.fmt)(x.value)}`).join(', ')}` },
            (0, dom_ts_1.h)("circle", { class: "donut-track", cx: "55", cy: "55", r: String(R) }),
            total > 0 ? p.parts.filter((x) => x.value > 0).map((x) => {
                const len = (x.value / total) * C;
                const seg = (0, dom_ts_1.h)("circle", { class: "donut-seg", cx: "55", cy: "55", r: String(R), transform: "rotate(-90 55 55)", style: `stroke:${x.color};stroke-dasharray:${Math.max(0, len - gap)} ${C};stroke-dashoffset:${-acc}` });
                acc += len;
                return seg;
            }) : null),
        (0, dom_ts_1.h)("div", { class: "donut-center" },
            (0, dom_ts_1.h)("span", { class: "donut-value num" }, p.center),
            p.sub ? (0, dom_ts_1.h)("span", { class: "donut-sub" }, p.sub) : null)));
}
function LineChart(p) {
    const W = 340;
    const H = p.height ?? 130;
    const top = 14;
    const bottom = 20;
    const n = p.points.length;
    if (n < 2)
        return (0, dom_ts_1.h)("div", { class: "chart-empty" }, "\u0417\u0430\u043C\u0430\u043B\u043E \u0442\u043E\u0447\u043E\u043A \u0434\u043B\u044F \u0433\u0440\u0430\u0444\u0456\u043A\u0430");
    const vals = p.points.map((x) => x.value);
    const min = Math.min(0, ...vals);
    const max = Math.max(1, ...vals);
    const xs = (i) => (W * i) / (n - 1);
    const ys = (v) => top + (H - top - bottom) * (1 - (v - min) / (max - min || 1));
    const d = p.points.map((pt, i) => `${i ? 'L' : 'M'}${xs(i).toFixed(1)} ${ys(pt.value).toFixed(1)}`).join(' ');
    const area = `${d} L${W} ${H - bottom} L0 ${H - bottom} z`;
    const every = Math.max(1, Math.ceil(n / 6));
    return ((0, dom_ts_1.h)("figure", { class: "chart" },
        (0, dom_ts_1.h)("svg", { viewBox: `0 0 ${W} ${H}`, class: "chart-svg", role: "img", "aria-label": p.label, preserveAspectRatio: "none" },
            (0, dom_ts_1.h)("path", { class: "line-area", d: area }),
            (0, dom_ts_1.h)("path", { class: "line", d: d }),
            (0, dom_ts_1.h)("text", { class: "chart-max", x: "0", y: "10" }, (0, money_ts_1.compact)(max)),
            (0, dom_ts_1.h)("circle", { class: "line-end", cx: String(xs(n - 1)), cy: String(ys(vals[n - 1])), r: "3.5" }),
            p.points.map((pt, i) => (i % every === 0 ? (0, dom_ts_1.h)("text", { class: "chart-label", x: String(Math.min(W - 14, Math.max(14, xs(i)))), y: String(H - 5), "text-anchor": "middle" }, pt.label) : null)))));
}
function HBars(p) {
    const max = Math.max(1, ...p.rows.map((r) => r.value));
    return ((0, dom_ts_1.h)("div", { class: "hbars" }, p.rows.map((r) => ((0, dom_ts_1.h)("div", { class: "hbar" },
        (0, dom_ts_1.h)("div", { class: "hbar-top" },
            (0, dom_ts_1.h)("span", { class: "hbar-label" }, r.label),
            (0, dom_ts_1.h)("span", { class: "hbar-value num" }, (0, money_ts_1.fmt)(r.value))),
        (0, dom_ts_1.h)("div", { class: "hbar-track" },
            (0, dom_ts_1.h)("span", { style: `width:${((r.value / max) * 100).toFixed(1)}%;${r.color ? `background:${r.color}` : ''}` })),
        r.note ? (0, dom_ts_1.h)("span", { class: "hbar-note" }, r.note) : null)))));
}
};

// ── time.ts
defs["time.js"] = function (require, exports, module) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WEEKDAYS_SHORT = exports.WEEKDAYS = exports.MONTHS_SHORT = exports.MONTHS_NOM = exports.MONTHS_GEN = exports.KYIV = exports.DAY_MS = void 0;
exports.kyivParts = kyivParts;
exports.keyOf = keyOf;
exports.dateKey = dateKey;
exports.todayKey = todayKey;
exports.ymd = ymd;
exports.isDateKey = isDateKey;
exports.addDays = addDays;
exports.diffDays = diffDays;
exports.weekday = weekday;
exports.daysInMonth = daysInMonth;
exports.monthKey = monthKey;
exports.startOfWeek = startOfWeek;
exports.startOfMonth = startOfMonth;
exports.startOfYear = startOfYear;
exports.msAtKyiv = msAtKyiv;
exports.timeHM = timeHM;
exports.stamp = stamp;
exports.cap = cap;
exports.fmtDate = fmtDate;
exports.fmtShort = fmtShort;
exports.relLabel = relLabel;
exports.rangeKeys = rangeKeys;
exports.minKey = minKey;
exports.maxKey = maxKey;
exports.DAY_MS = 86_400_000;
function pickKyiv() {
    for (const name of ['Europe/Kyiv', 'Europe/Kiev']) {
        try {
            new Intl.DateTimeFormat('en-GB', { timeZone: name }).format(0);
            return name;
        }
        catch {
        }
    }
    return 'Europe/Kiev';
}
exports.KYIV = pickKyiv();
let partsFormat = null;
function kyivParts(ms) {
    partsFormat ??= new Intl.DateTimeFormat('en-GB', {
        timeZone: exports.KYIV,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
    });
    const out = {};
    for (const p of partsFormat.formatToParts(new Date(ms))) {
        if (p.type !== 'literal')
            out[p.type] = Number(p.value);
    }
    return { y: out.year, m: out.month, d: out.day, hh: out.hour % 24, mm: out.minute };
}
const pad2 = (n) => String(n).padStart(2, '0');
function keyOf(y, m, d) {
    return `${y}-${pad2(m)}-${pad2(d)}`;
}
function dateKey(ms) {
    const p = kyivParts(ms);
    return keyOf(p.y, p.m, p.d);
}
function todayKey(now = Date.now()) {
    return dateKey(now);
}
function ymd(key) {
    return { y: Number(key.slice(0, 4)), m: Number(key.slice(5, 7)), d: Number(key.slice(8, 10)) };
}
function utc(key) {
    const { y, m, d } = ymd(key);
    return Date.UTC(y, m - 1, d);
}
function isDateKey(key) {
    if (typeof key !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(key))
        return false;
    const t = new Date(utc(key));
    return keyOf(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate()) === key;
}
function addDays(key, n) {
    const t = new Date(utc(key) + n * exports.DAY_MS);
    return keyOf(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate());
}
function diffDays(from, to) {
    return Math.round((utc(to) - utc(from)) / exports.DAY_MS);
}
function weekday(key) {
    return (new Date(utc(key)).getUTCDay() + 6) % 7;
}
function daysInMonth(y, m) {
    return new Date(Date.UTC(y, m, 0)).getUTCDate();
}
function monthKey(key) {
    return key.slice(0, 7);
}
function startOfWeek(key) {
    return addDays(key, -weekday(key));
}
function startOfMonth(key) {
    return key.slice(0, 8) + '01';
}
function startOfYear(key) {
    return key.slice(0, 5) + '01-01';
}
function msAtKyiv(key, hh, mm) {
    const { y, m, d } = ymd(key);
    const target = Date.UTC(y, m - 1, d, hh, mm);
    let guess = target - 2 * 3_600_000;
    for (let i = 0; i < 3; i++) {
        const p = kyivParts(guess);
        const diff = Date.UTC(p.y, p.m - 1, p.d, p.hh, p.mm) - target;
        if (diff === 0)
            break;
        guess -= diff;
    }
    return guess;
}
function timeHM(ms) {
    const p = kyivParts(ms);
    return `${pad2(p.hh)}:${pad2(p.mm)}`;
}
function stamp(ms) {
    const p = kyivParts(ms);
    return `${keyOf(p.y, p.m, p.d)} ${pad2(p.hh)}:${pad2(p.mm)}`;
}
exports.MONTHS_GEN = [
    'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
    'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня',
];
exports.MONTHS_NOM = [
    'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
    'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень',
];
exports.MONTHS_SHORT = [
    'січ', 'лют', 'бер', 'квіт', 'трав', 'черв', 'лип', 'серп', 'вер', 'жовт', 'лист', 'груд',
];
exports.WEEKDAYS = [
    'понеділок', 'вівторок', 'середа', 'четвер', 'пʼятниця', 'субота', 'неділя',
];
exports.WEEKDAYS_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];
function cap(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}
function fmtDate(key, o = {}) {
    const { y, m, d } = ymd(key);
    let s = `${d} ${exports.MONTHS_GEN[m - 1]}`;
    if (o.year)
        s += ` ${y}`;
    if (o.weekday)
        s = `${exports.WEEKDAYS[weekday(key)]}, ${s}`;
    return s;
}
function fmtShort(key) {
    const { m, d } = ymd(key);
    return `${pad2(d)}.${pad2(m)}`;
}
function relLabel(key, today) {
    const d = diffDays(today, key);
    if (d === 0)
        return 'Сьогодні';
    if (d === -1)
        return 'Учора';
    if (d === 1)
        return 'Завтра';
    return null;
}
function rangeKeys(from, to) {
    const out = [];
    for (let k = from; k <= to; k = addDays(k, 1))
        out.push(k);
    return out;
}
function minKey(a, b) {
    return a < b ? a : b;
}
function maxKey(a, b) {
    return a > b ? a : b;
}
};

// ── ledger.ts
defs["ledger.js"] = function (require, exports, module) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refundDate = refundDate;
exports.buildIndex = buildIndex;
exports.catMap = catMap;
exports.isBill = isBill;
exports.necessityOf = necessityOf;
exports.planTotal = planTotal;
exports.planByCategory = planByCategory;
exports.calcDay = calcDay;
exports.dayStatus = dayStatus;
exports.counted = counted;
exports.calcPeriod = calcPeriod;
exports.savingsTotal = savingsTotal;
exports.savingsSeries = savingsSeries;
exports.opTitle = opTitle;
exports.planLineFacts = planLineFacts;
exports.previousDays = previousDays;
const time_ts_1 = require("./time.js");
function push(map, k, v) {
    const list = map.get(k);
    if (list)
        list.push(v);
    else
        map.set(k, [v]);
}
function refundDate(op, byId) {
    if (op.type === 'refund' && op.refundOf) {
        const orig = byId.get(op.refundOf);
        if (orig && !orig.deletedAt)
            return orig.date;
    }
    return op.date;
}
function buildIndex(ops) {
    const all = ops.filter((o) => !o.deletedAt);
    const byId = new Map(all.map((o) => [o.id, o]));
    const byDate = new Map();
    const spendByDate = new Map();
    for (const o of all) {
        push(byDate, o.date, o);
        if (o.type === 'expense')
            push(spendByDate, o.date, o);
        else if (o.type === 'refund')
            push(spendByDate, refundDate(o, byId), o);
    }
    for (const list of byDate.values())
        list.sort((a, b) => a.time - b.time);
    return { all, byId, byDate, spendByDate };
}
function catMap(cats) {
    return new Map(cats.map((c) => [c.id, c]));
}
function isBill(op) {
    return op.type === 'expense' && (Boolean(op.obligationId) || op.category === 'bills');
}
function refundIsBill(op, byId) {
    if (op.refundOf) {
        const orig = byId.get(op.refundOf);
        if (orig)
            return isBill(orig);
    }
    return op.category === 'bills';
}
function necessityOf(op, cats) {
    if (op.necessity)
        return op.necessity;
    return cats.get(op.category ?? 'other')?.necessity ?? 'flexible';
}
function planTotal(plan) {
    if (!plan)
        return 0;
    let s = 0;
    for (const l of plan)
        s += l.amount;
    return s;
}
function planByCategory(plan) {
    const out = {};
    for (const l of plan ?? [])
        out[l.category] = (out[l.category] ?? 0) + l.amount;
    return out;
}
function calcDay(ix, date, rec, cats) {
    const own = ix.byDate.get(date) ?? [];
    const spend = ix.spendByDate.get(date) ?? [];
    let gross = 0;
    let refunds = 0;
    let bills = 0;
    let micro = 0;
    let foodCash = 0;
    let foodCost = 0;
    let estimates = 0;
    const byCat = {};
    const byNec = { required: 0, flexible: 0, optional: 0, unexpected: 0 };
    for (const o of spend) {
        const catId = o.category ?? 'other';
        const cat = cats.get(catId);
        const isFood = catId === 'groceries' || catId === 'lunch' || Boolean(o.meal);
        if (o.type === 'expense') {
            if (isBill(o)) {
                bills += o.amount;
                continue;
            }
            gross += o.amount;
            byCat[catId] = (byCat[catId] ?? 0) + o.amount;
            byNec[necessityOf(o, cats)] += o.amount;
            if (cat?.micro)
                micro += o.amount;
            if (isFood)
                foodCash += o.amount;
            if (o.meal)
                foodCost += o.amount;
            estimates += o.estimate ?? 0;
        }
        else {
            if (refundIsBill(o, ix.byId)) {
                bills -= o.amount;
                continue;
            }
            refunds += o.amount;
            byCat[catId] = (byCat[catId] ?? 0) - o.amount;
            const orig = o.refundOf ? ix.byId.get(o.refundOf) : undefined;
            byNec[necessityOf(orig ?? o, cats)] -= o.amount;
            if (cat?.micro)
                micro -= o.amount;
            if (isFood)
                foodCash -= o.amount;
        }
    }
    let income = 0;
    let saved = 0;
    let consumption = 0;
    for (const o of own) {
        if (o.type === 'income')
            income += o.amount;
        else if (o.type === 'saving')
            saved += o.amount;
        else if (o.type === 'withdrawal')
            saved -= o.amount;
        else if (o.type === 'consumption') {
            consumption += o.amount;
            if (o.meal)
                foodCost += o.amount;
        }
    }
    const plan = rec?.plan ?? null;
    const pTotal = planTotal(plan);
    const spent = gross - refunds;
    const hasPlan = plan !== null && plan.length > 0;
    return {
        date,
        plan: hasPlan ? plan : null,
        planTotal: pTotal,
        planByCat: planByCategory(plan),
        gross,
        refunds,
        spent,
        byCat,
        byNec,
        bills,
        remaining: hasPlan ? pTotal - spent : null,
        economy: hasPlan ? Math.max(0, pTotal - spent) : null,
        over: hasPlan ? Math.max(0, spent - pTotal) : 0,
        usedPct: hasPlan && pTotal > 0 ? Math.round((spent * 100) / pTotal) : null,
        income,
        saved,
        consumption,
        estimates,
        micro,
        foodCash,
        foodCost,
        ops: own,
        hasData: own.length > 0,
    };
}
function dayStatus(date, today, rec, hasData) {
    if (date > today)
        return 'future';
    if (rec?.closed)
        return 'closed';
    if (date === today)
        return 'open';
    return hasData ? 'recorded' : 'missing';
}
function counted(status, hasData) {
    return status === 'closed' || hasData;
}
function calcPeriod(ix, days, cats, from, to, today) {
    const end = to > today ? today : to;
    const res = {
        from, to: end, days: [], dataDays: 0, noSpendDays: 0, missingDays: 0, closedDays: 0,
        spent: 0, bills: 0, plan: 0, planDays: 0, economy: 0, byCat: {},
        byNec: { required: 0, flexible: 0, optional: 0, unexpected: 0 },
        income: 0, saved: 0, micro: 0, foodCash: 0, foodCost: 0, consumption: 0, avgPerDataDay: null,
    };
    if (from > end)
        return res;
    for (const date of (0, time_ts_1.rangeKeys)(from, end)) {
        const rec = days[date];
        const calc = calcDay(ix, date, rec, cats);
        const status = dayStatus(date, today, rec, calc.hasData);
        const isCounted = counted(status, calc.hasData);
        res.days.push({ date, status, calc, counted: isCounted });
        if (status === 'closed')
            res.closedDays++;
        if (!isCounted) {
            if (status === 'missing')
                res.missingDays++;
            continue;
        }
        res.dataDays++;
        if (calc.spent === 0)
            res.noSpendDays++;
        res.spent += calc.spent;
        res.bills += calc.bills;
        if (calc.plan) {
            res.plan += calc.planTotal;
            res.planDays++;
            res.economy += calc.planTotal - calc.spent;
        }
        for (const [k, v] of Object.entries(calc.byCat))
            res.byCat[k] = (res.byCat[k] ?? 0) + v;
        for (const k of Object.keys(res.byNec))
            res.byNec[k] += calc.byNec[k];
        res.income += calc.income;
        res.saved += calc.saved;
        res.micro += calc.micro;
        res.foodCash += calc.foodCash;
        res.foodCost += calc.foodCost;
        res.consumption += calc.consumption;
    }
    res.avgPerDataDay = res.dataDays > 0 ? Math.round(res.spent / res.dataDays) : null;
    return res;
}
function savingsTotal(ix, start, upTo) {
    let s = start;
    for (const o of ix.all) {
        if (upTo && o.date > upTo)
            continue;
        if (o.type === 'saving')
            s += o.amount;
        else if (o.type === 'withdrawal')
            s -= o.amount;
    }
    return s;
}
function savingsSeries(ix, start, from, to) {
    let base = start;
    const delta = new Map();
    for (const o of ix.all) {
        if (o.type !== 'saving' && o.type !== 'withdrawal')
            continue;
        const v = o.type === 'saving' ? o.amount : -o.amount;
        if (o.date < from)
            base += v;
        else if (o.date <= to)
            delta.set(o.date, (delta.get(o.date) ?? 0) + v);
    }
    const out = [];
    let run = base;
    for (const d of (0, time_ts_1.rangeKeys)(from, to)) {
        run += delta.get(d) ?? 0;
        out.push({ date: d, total: run });
    }
    return out;
}
function opTitle(op, cats) {
    if (op.title)
        return op.title;
    switch (op.type) {
        case 'income': return 'Дохід';
        case 'refund': return 'Повернення коштів';
        case 'saving': return 'Переказ у накопичення';
        case 'withdrawal': return 'Узято з накопичень';
        case 'transfer': return 'Переказ між своїми рахунками';
        case 'consumption': return 'Собівартість (продукти вже куплені)';
        default: return cats.get(op.category ?? 'other')?.name ?? 'Витрата';
    }
}
function planLineFacts(ix, date) {
    const out = new Map();
    for (const o of ix.byDate.get(date) ?? []) {
        if (!o.planLineId)
            continue;
        push(out, o.planLineId, o);
    }
    return out;
}
function previousDays(date, n) {
    const out = [];
    for (let i = n; i >= 1; i--)
        out.push((0, time_ts_1.addDays)(date, -i));
    return out;
}
};

// ── budget.ts
defs["budget.js"] = function (require, exports, module) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NO_INCOME_DAYS = void 0;
exports.availableNow = availableNow;
exports.occurrence = occurrence;
exports.nextOccurrence = nextOccurrence;
exports.nextIncome = nextIncome;
exports.obligationsDue = obligationsDue;
exports.dailyNeed = dailyNeed;
exports.budgetView = budgetView;
exports.suggestedDaily = suggestedDaily;
const ledger_ts_1 = require("./ledger.js");
const time_ts_1 = require("./time.js");
exports.NO_INCOME_DAYS = 30;
function availableNow(ix, balance, today) {
    if (!balance)
        return null;
    let a = balance.amount;
    for (const o of ix.all) {
        if (o.date < balance.date || o.date > today)
            continue;
        switch (o.type) {
            case 'income':
                a += o.amount;
                break;
            case 'expense':
                a -= o.amount;
                break;
            case 'refund':
                a += o.amount;
                break;
            case 'saving':
                a -= o.amount;
                break;
            case 'withdrawal':
                a += o.amount;
                break;
            default: break;
        }
    }
    return a;
}
function occurrence(y, m, day) {
    return (0, time_ts_1.keyOf)(y, m, Math.min(Math.max(1, day), (0, time_ts_1.daysInMonth)(y, m)));
}
function nextOccurrence(day, today) {
    const { y, m } = (0, time_ts_1.ymd)(today);
    const cur = occurrence(y, m, day);
    if (cur > today)
        return cur;
    return m === 12 ? occurrence(y + 1, 1, day) : occurrence(y, m + 1, day);
}
function nextIncome(incomes, today) {
    let best = null;
    for (const inc of incomes) {
        if (inc.amount <= 0)
            continue;
        const date = nextOccurrence(inc.day, today);
        if (!best || date < best.date)
            best = { id: inc.id, name: inc.name, date, amount: inc.amount };
    }
    return best;
}
function isPaid(ix, oblId, month) {
    return ix.all.some((o) => o.type === 'expense' && o.obligationId === oblId && (0, time_ts_1.monthKey)(o.date) === month);
}
function obligationsDue(ix, obligations, today, horizonEnd, balanceDate) {
    const out = [];
    const last = (0, time_ts_1.addDays)(horizonEnd, -1);
    let { y, m } = (0, time_ts_1.ymd)(today);
    const endMonth = (0, time_ts_1.monthKey)(last < today ? today : last);
    for (let guard = 0; guard < 24; guard++) {
        const month = `${y}-${String(m).padStart(2, '0')}`;
        if (month > endMonth)
            break;
        for (const ob of obligations) {
            if (ob.amount <= 0)
                continue;
            const date = occurrence(y, m, ob.day);
            const paid = isPaid(ix, ob.id, month);
            if (date >= today && date < horizonEnd) {
                out.push({ id: ob.id, name: ob.name, kind: ob.kind, date, amount: ob.amount, paid, overdue: false });
            }
            else if (date < today && month === (0, time_ts_1.monthKey)(today) && (!balanceDate || date >= balanceDate)) {
                out.push({ id: ob.id, name: ob.name, kind: ob.kind, date, amount: ob.amount, paid, overdue: !paid });
            }
        }
        m++;
        if (m > 12) {
            m = 1;
            y++;
        }
    }
    return out.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
}
function dailyNeed(ix, settings, days, today, todayPlan) {
    const est = settings.budget.dailyEstimate;
    if (est !== null && est >= 0)
        return { amount: est, source: 'setting' };
    const vals = [];
    for (let i = 1; i <= 21 && vals.length < 14; i++) {
        const d = (0, time_ts_1.addDays)(today, -i);
        const own = ix.byDate.get(d) ?? [];
        if (!own.length && !days[d]?.closed)
            continue;
        let spent = 0;
        for (const o of ix.spendByDate.get(d) ?? []) {
            if (o.type === 'expense' && !o.obligationId && o.category !== 'bills')
                spent += o.amount;
            else if (o.type === 'refund')
                spent -= o.amount;
        }
        vals.push(Math.max(0, spent));
    }
    if (vals.length >= 3) {
        const s = [...vals].sort((a, b) => a - b);
        const mid = Math.floor(s.length / 2);
        const med = s.length % 2 ? s[mid] : Math.round((s[mid - 1] + s[mid]) / 2);
        return { amount: med, source: 'history' };
    }
    if (todayPlan > 0)
        return { amount: todayPlan, source: 'plan' };
    return { amount: 0, source: 'none' };
}
function budgetView(input) {
    const { ix, settings, days, today, todayCalc, todayClosed } = input;
    const b = settings.budget;
    const available = availableNow(ix, b.balance, today);
    const ni = nextIncome(b.incomes, today);
    const horizonEnd = ni ? ni.date : (0, time_ts_1.addDays)(today, exports.NO_INCOME_DAYS);
    const obligations = obligationsDue(ix, b.obligations, today, horizonEnd, b.balance?.date ?? null);
    const reserveObligations = obligations.filter((o) => !o.paid).reduce((s, o) => s + o.amount, 0);
    const need = dailyNeed(ix, settings, days, today, todayCalc.planTotal);
    const dailyDays = Math.max(0, (0, time_ts_1.diffDays)(today, horizonEnd) - 1);
    let reserveDaily = 0;
    for (let i = 1; i <= dailyDays; i++) {
        const d = (0, time_ts_1.addDays)(today, i);
        const rec = days[d];
        reserveDaily += rec?.plan && rec.plan.length ? (0, ledger_ts_1.planTotal)(rec.plan) : need.amount;
    }
    const todayExpected = todayCalc.plan ? todayCalc.planTotal : need.amount;
    const reserveToday = todayClosed ? 0 : Math.max(0, todayExpected - todayCalc.spent);
    const buffer = Math.max(0, b.buffer);
    const hasCredits = b.obligations.some((o) => o.kind === 'credit' && o.amount > 0);
    const economy = todayCalc.economy;
    if (available === null) {
        return {
            status: 'unknown', available, nextIncome: ni, noIncome: !ni, horizonEnd, obligations,
            reserveObligations, reserveDaily, dailyDays, need, reserveToday, buffer,
            free: null, shortfall: 0, hasCredits, safe: null, economy,
        };
    }
    const free = available - reserveObligations - reserveDaily - reserveToday - buffer;
    if (free < 0) {
        return {
            status: 'deficit', available, nextIncome: ni, noIncome: !ni, horizonEnd, obligations,
            reserveObligations, reserveDaily, dailyDays, need, reserveToday, buffer,
            free, shortfall: -free, hasCredits, safe: 0, economy,
        };
    }
    const safe = economy !== null ? Math.min(economy, free) : free;
    return {
        status: 'ok', available, nextIncome: ni, noIncome: !ni, horizonEnd, obligations,
        reserveObligations, reserveDaily, dailyDays, need, reserveToday, buffer,
        free, shortfall: 0, hasCredits, safe, economy,
    };
}
function suggestedDaily(settings, today) {
    const b = settings.budget;
    const income = b.incomes.reduce((s, i) => s + i.amount, 0);
    if (income <= 0)
        return null;
    const must = b.obligations.reduce((s, o) => s + o.amount, 0);
    const goal = b.monthlyGoal ?? 0;
    const { y, m } = (0, time_ts_1.ymd)(today);
    const free = income - must - goal;
    if (free <= 0)
        return 0;
    return Math.floor(free / (0, time_ts_1.daysInMonth)(y, m));
}
};

// ── transport.ts
defs["transport.js"] = function (require, exports, module) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TAXI_JUSTIFIED = exports.DIRS = exports.MODES = void 0;
exports.modeInfo = modeInfo;
exports.isPublic = isPublic;
exports.fuelCost = fuelCost;
exports.carCost = carCost;
exports.tripAmounts = tripAmounts;
exports.comfortPrice = comfortPrice;
exports.tripsIn = tripsIn;
exports.modeStats = modeStats;
exports.publicRef = publicRef;
exports.taxiRef = taxiRef;
const money_ts_1 = require("./money.js");
const time_ts_1 = require("./time.js");
exports.MODES = [
    { id: 'bus', label: 'Автобус', icon: 'bus', public: true },
    { id: 'tram', label: 'Трамвай', icon: 'tram', public: true },
    { id: 'trolley', label: 'Тролейбус', icon: 'trolley', public: true },
    { id: 'metro', label: 'Метро', icon: 'metro', public: true },
    { id: 'taxi', label: 'Таксі', icon: 'taxi', public: false },
    { id: 'car', label: 'Власне авто', icon: 'car', public: false },
    { id: 'walk', label: 'Пішки', icon: 'walk', public: false },
    { id: 'combo', label: 'Комбінований', icon: 'route', public: false },
];
exports.DIRS = [
    { id: 'there', label: 'Туди' },
    { id: 'back', label: 'Назад' },
    { id: 'other', label: 'Інша поїздка' },
];
function modeInfo(mode) {
    return exports.MODES.find((m) => m.id === mode) ?? exports.MODES[0];
}
function isPublic(mode) {
    return modeInfo(mode).public;
}
function fuelCost(km, per100, priceKop) {
    const kmT = Math.round(km * 10);
    const cH = Math.round(per100 * 100);
    if (kmT <= 0 || cH <= 0 || priceKop <= 0)
        return 0;
    return Math.floor((kmT * cH * priceKop + 50_000) / 100_000);
}
function carCost(car) {
    const fuel = fuelCost(car.km, car.per100, car.fuelPrice);
    const wear = Math.round(Math.max(0, car.km) * Math.max(0, car.wearPerKm));
    const parking = Math.max(0, car.parking);
    const other = Math.max(0, car.other);
    const cash = (car.fuelPrepaid ? 0 : fuel) + parking + other;
    const estimate = (car.fuelPrepaid ? fuel : 0) + wear;
    return { fuel, wear, parking, other, cash, estimate, total: cash + estimate };
}
function tripAmounts(t) {
    let cashAll = 0;
    let estAll = 0;
    let car;
    if (t.mode === 'car' && t.car) {
        car = carCost(t.car);
        cashAll = car.cash;
        estAll = car.estimate;
    }
    else if (t.mode !== 'walk') {
        cashAll = Math.max(0, t.cost);
    }
    const n = Math.max(1, Math.floor(t.passengers || 1));
    const divide = t.split && n > 1;
    const cash = divide ? (0, money_ts_1.roundDiv)(cashAll, n) : cashAll;
    const estimate = divide ? (0, money_ts_1.roundDiv)(estAll, n) : estAll;
    return { full: cashAll + estAll, cash, estimate, share: cash + estimate, car };
}
function comfortPrice(fast, slow, hourValue) {
    const extra = fast.cost - slow.cost;
    const saved = Math.round(slow.minutes - fast.minutes);
    const timeValue = hourValue !== null && hourValue > 0 && saved > 0 ? (0, money_ts_1.roundDiv)(hourValue * saved, 60) : null;
    const pureComfort = timeValue !== null ? extra - timeValue : null;
    let verdict;
    if (extra <= 0 && saved >= 0)
        verdict = 'cheaperFaster';
    else if (saved <= 0)
        verdict = 'noTimeGain';
    else if (timeValue === null)
        verdict = 'unknown';
    else if (timeValue >= extra)
        verdict = 'timeWorthIt';
    else
        verdict = 'comfortPremium';
    return { extra, saved, timeValue, pureComfort, verdict };
}
function tripsIn(ix, from, to) {
    return ix.all.filter((o) => o.type === 'expense' && o.trip && o.date >= from && o.date <= to);
}
function modeStats(ix, from, to) {
    const acc = new Map();
    for (const o of tripsIn(ix, from, to)) {
        const t = o.trip;
        const a = acc.get(t.mode) ?? { trips: 0, cash: 0, share: 0, min: 0, minN: 0, com: 0, comN: 0 };
        a.trips++;
        a.cash += o.amount;
        a.share += o.amount + (o.estimate ?? 0);
        if (t.minutes !== null) {
            a.min += t.minutes + (t.wait ?? 0);
            a.minN++;
        }
        if (t.comfort !== null) {
            a.com += t.comfort;
            a.comN++;
        }
        acc.set(t.mode, a);
    }
    return exports.MODES.filter((m) => acc.has(m.id)).map((m) => {
        const a = acc.get(m.id);
        return {
            mode: m.id,
            trips: a.trips,
            cash: a.cash,
            share: a.share,
            avgShare: Math.round(a.share / a.trips),
            avgMinutes: a.minN ? Math.round(a.min / a.minN) : null,
            avgComfort: a.comN ? Math.round((a.com / a.comN) * 10) / 10 : null,
        };
    });
}
function median(xs) {
    if (!xs.length)
        return null;
    const s = [...xs].sort((a, b) => a - b);
    const mid = Math.floor(s.length / 2);
    return s.length % 2 ? s[mid] : Math.round((s[mid - 1] + s[mid]) / 2);
}
function publicRef(ix, settings, today) {
    const trips = tripsIn(ix, (0, time_ts_1.addDays)(today, -60), today).filter((o) => isPublic(o.trip.mode));
    const costs = trips.map((o) => o.amount + (o.estimate ?? 0)).filter((v) => v > 0);
    const mins = trips.filter((o) => o.trip.minutes !== null).map((o) => o.trip.minutes + (o.trip.wait ?? 0));
    const minutes = mins.length >= 2 ? median(mins) : null;
    if (settings.publicFare !== null && settings.publicFare > 0)
        return { cost: settings.publicFare, minutes, source: 'setting' };
    if (costs.length >= 2)
        return { cost: median(costs), minutes, source: 'history' };
    return null;
}
function taxiRef(ix, today) {
    const trips = tripsIn(ix, (0, time_ts_1.addDays)(today, -60), today).filter((o) => o.trip.mode === 'taxi');
    const costs = trips.map((o) => o.amount + (o.estimate ?? 0)).filter((v) => v > 0);
    if (costs.length < 1)
        return null;
    const mins = trips.filter((o) => o.trip.minutes !== null).map((o) => o.trip.minutes + (o.trip.wait ?? 0));
    return { cost: median(costs), minutes: mins.length ? median(mins) : null, source: 'history' };
}
exports.TAXI_JUSTIFIED = [
    'зекономлений час за твоєю оцінкою години вартує більше, ніж доплата;',
    'спізнення коштуватиме дорожче: важлива зустріч, іспит, зміна;',
    'пізно ввечері, тривога чи небезпечний маршрут — безпека важливіша за економію;',
    'важкі сумки, хвороба чи сильна втома;',
    'їдете втрьох-учотирьох і ділите вартість — частка може бути близькою до проїзду;',
    'погода або громадський транспорт не ходить.',
];
};

// ── meals.ts
defs["meals.js"] = function (require, exports, module) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MEALS = void 0;
exports.mealInfo = mealInfo;
exports.isHomeMeal = isHomeMeal;
exports.mealOpShape = mealOpShape;
exports.canteenRef = canteenRef;
exports.homeMealRef = homeMealRef;
exports.mealProjection = mealProjection;
const time_ts_1 = require("./time.js");
exports.MEALS = [
    { id: 'breakfastHome', label: 'Сніданок удома', icon: 'sunrise', home: true },
    { id: 'lunchBox', label: 'Домашній обід у контейнері', icon: 'lunchbox', home: true },
    { id: 'canteen', label: 'Їдальня', icon: 'utensils', home: false },
    { id: 'cafe', label: 'Кафе', icon: 'coffee', home: false },
    { id: 'fastfood', label: 'Фастфуд', icon: 'burger', home: false },
    { id: 'readyFood', label: 'Готова їжа із супермаркету', icon: 'basket', home: false },
    { id: 'delivery', label: 'Доставка', icon: 'truck', home: false },
    { id: 'dinnerHome', label: 'Вечеря вдома', icon: 'moon', home: true },
    { id: 'otherMeal', label: 'Інший варіант', icon: 'utensils', home: false },
];
function mealInfo(kind) {
    return exports.MEALS.find((m) => m.id === kind) ?? exports.MEALS[exports.MEALS.length - 1];
}
function isHomeMeal(kind) {
    return mealInfo(kind).home;
}
function mealOpShape(kind, prepaid) {
    if (isHomeMeal(kind))
        return prepaid ? { type: 'consumption', category: 'lunch' } : { type: 'expense', category: 'groceries' };
    return { type: 'expense', category: 'lunch' };
}
function median(xs) {
    if (!xs.length)
        return null;
    const s = [...xs].sort((a, b) => a - b);
    const mid = Math.floor(s.length / 2);
    return s.length % 2 ? s[mid] : Math.round((s[mid - 1] + s[mid]) / 2);
}
function mealOps(ix, today, days) {
    const from = (0, time_ts_1.addDays)(today, -days);
    return ix.all.filter((o) => o.meal && o.date >= from && o.date <= today && (o.type === 'expense' || o.type === 'consumption'));
}
function canteenRef(ix, settings, today) {
    if (settings.canteenPrice !== null && settings.canteenPrice > 0)
        return { amount: settings.canteenPrice, source: 'setting' };
    const vals = mealOps(ix, today, 90).filter((o) => o.meal.kind === 'canteen').map((o) => o.amount);
    if (vals.length >= 2)
        return { amount: median(vals), source: 'history' };
    return null;
}
function homeMealRef(ix, today) {
    const vals = mealOps(ix, today, 90)
        .filter((o) => o.meal.kind === 'lunchBox')
        .map((o) => o.amount);
    return vals.length >= 2 ? median(vals) : null;
}
function mealProjection(diff) {
    const d = Math.max(0, diff);
    return { d5: d * 5, d10: d * 10, d22: d * 22 };
}
};

// ── calendar.ts
defs["calendar.js"] = function (require, exports, module) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWorkday = isWorkday;
exports.inStay = inStay;
exports.stayOn = stayOn;
exports.countDays = countDays;
exports.workdaysAhead = workdaysAhead;
exports.workdaysPerWeek = workdaysPerWeek;
exports.makeStay = makeStay;
const time_ts_1 = require("./time.js");
function isWorkday(key, cal) {
    const o = cal.overrides[key];
    if (o)
        return o === 'work';
    return Boolean(cal.workdays[(0, time_ts_1.weekday)(key)]);
}
function inStay(key, cal) {
    return cal.stays.some((s) => key >= s.from && key <= s.to);
}
function stayOn(key, cal) {
    return cal.stays.find((s) => key >= s.from && key <= s.to) ?? null;
}
function countDays(from, n, cal, stayOnly = false) {
    const useStay = stayOnly && cal.stays.length > 0;
    let work = 0;
    let off = 0;
    for (let i = 0; i < n; i++) {
        const k = (0, time_ts_1.addDays)(from, i);
        if (useStay && !inStay(k, cal))
            continue;
        if (isWorkday(k, cal))
            work++;
        else
            off++;
    }
    return { work, off };
}
function workdaysAhead(today, n, cal, stayOnly = false) {
    return countDays((0, time_ts_1.addDays)(today, 1), n, cal, stayOnly).work;
}
function workdaysPerWeek(cal) {
    return cal.workdays.filter(Boolean).length;
}
function makeStay(id, from, days, label) {
    return { id, from, to: (0, time_ts_1.addDays)(from, Math.max(1, days) - 1), label };
}
};

// ── goals.ts
defs["goals.js"] = function (require, exports, module) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.goalSaved = goalSaved;
exports.goalView = goalView;
exports.paceTable = paceTable;
exports.unassigned = unassigned;
const time_ts_1 = require("./time.js");
function goalSaved(goal, ix) {
    let s = goal.start;
    for (const o of ix.all) {
        if (o.goalId !== goal.id)
            continue;
        if (o.type === 'saving')
            s += o.amount;
        else if (o.type === 'withdrawal')
            s -= o.amount;
    }
    return s;
}
function goalView(goal, ix, today) {
    const saved = goalSaved(goal, ix);
    const left = Math.max(0, goal.target - saved);
    const pct = goal.target > 0 ? Math.min(100, Math.floor((Math.max(0, saved) * 100) / goal.target)) : 0;
    const done = goal.target > 0 && saved >= goal.target;
    if (done)
        return { goal, saved, left: 0, pct: 100, done, projection: null, reason: null };
    const transfers = ix.all.filter((o) => o.goalId === goal.id && (o.type === 'saving' || o.type === 'withdrawal'));
    const ins = transfers.filter((o) => o.type === 'saving');
    if (ins.length < 2)
        return { goal, saved, left, pct, done, projection: null, reason: 'Дата зʼявиться після кількох переказів на цю ціль.' };
    const first = ins.reduce((m, o) => (o.date < m ? o.date : m), ins[0].date);
    const span = (0, time_ts_1.diffDays)(first, today) + 1;
    if (span < 14)
        return { goal, saved, left, pct, done, projection: null, reason: 'Потрібно щонайменше два тижні спостережень, щоб оцінити темп.' };
    const net = transfers.reduce((s, o) => s + (o.type === 'saving' ? o.amount : -o.amount), 0);
    const perDay = Math.round(net / span);
    if (perDay <= 0)
        return { goal, saved, left, pct, done, projection: null, reason: 'Поточний темп не наближає до цілі.' };
    const days = Math.ceil(left / perDay);
    if (days > 3650)
        return { goal, saved, left, pct, done, projection: null, reason: 'За поточного темпу ціль далі ніж за 10 років.' };
    return { goal, saved, left, pct, done, projection: { date: (0, time_ts_1.addDays)(today, days), perDay, days }, reason: null };
}
function paceTable(left, today, paces = [5_000, 10_000, 20_000]) {
    if (left <= 0)
        return [];
    return paces.map((p) => {
        const days = Math.ceil(left / p);
        return { perDay: p, days, date: (0, time_ts_1.addDays)(today, days) };
    });
}
function unassigned(total, views) {
    return total - views.reduce((s, v) => s + Math.max(0, v.saved), 0);
}
};

// ── mentor.ts
defs["mentor.js"] = function (require, exports, module) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULES = exports.AUTHORS = void 0;
exports.matchingRules = matchingRules;
exports.pickAdvice = pickAdvice;
exports.buildContext = buildContext;
exports.adviceFor = adviceFor;
const ledger_ts_1 = require("./ledger.js");
const budget_ts_1 = require("./budget.js");
const transport_ts_1 = require("./transport.js");
const meals_ts_1 = require("./meals.js");
const calendar_ts_1 = require("./calendar.js");
const goals_ts_1 = require("./goals.js");
const money_ts_1 = require("./money.js");
const time_ts_1 = require("./time.js");
exports.AUTHORS = {
    buffett: { name: 'Воррен Баффетт', gen: 'Воррена Баффетта' },
    munger: { name: 'Чарлі Мангер', gen: 'Чарлі Мангера' },
    graham: { name: 'Бенджамін Грем', gen: 'Бенджаміна Грема' },
    bogle: { name: 'Джон Богл', gen: 'Джона Богла' },
    lynch: { name: 'Пітер Лінч', gen: 'Пітера Лінча' },
    housel: { name: 'Морган Гаузел', gen: 'Моргана Гаузела' },
    sethi: { name: 'Раміт Сеті', gen: 'Раміта Сеті' },
    dalio: { name: 'Рей Даліо', gen: 'Рея Даліо' },
};
const upTen = (k) => Math.max(1_000, Math.ceil(k / 1_000) * 1_000);
const downTen = (k) => Math.floor(k / 1_000) * 1_000;
function taxiCalc(c) {
    if (c.taxi.cash <= 0 || !c.pub || c.pub.minutes === null || c.taxi.minutes === null || c.hourValue === null)
        return null;
    const trips = Math.max(1, c.taxi.trips);
    const cp = (0, transport_ts_1.comfortPrice)({ cost: c.taxi.cash, minutes: c.taxi.minutes }, { cost: c.pub.cost * trips, minutes: c.pub.minutes * trips }, c.hourValue);
    if (cp.timeValue === null)
        return null;
    return { extra: cp.extra, saved: cp.saved, timeValue: cp.timeValue, worth: cp.verdict === 'timeWorthIt' };
}
function taxiWorth(c) {
    return taxiCalc(c)?.worth === true;
}
exports.RULES = [
    {
        id: 'deficit', tier: 0, author: 'graham', principle: 'Запас міцності',
        when: (c) => c.budget.status === 'deficit',
        impact: (c) => c.budget.shortfall,
        build: (c) => ({
            tone: 'care',
            why: `До ${c.budget.nextIncome ? (0, time_ts_1.fmtDate)(c.budget.nextIncome) : 'кінця найближчих 30 днів'} бракує ${(0, money_ts_1.fmt)(c.budget.shortfall)} на обовʼязкові платежі й щоденні потреби.`,
            step: 'Завтра — лише необхідне. Накопичення почекають: спершу обовʼязкові платежі.',
            effectKop: c.budget.shortfall,
            effect: `Потрібно скоротити витрати або знайти ${(0, money_ts_1.fmt)(c.budget.shortfall)} до наступного доходу.`,
        }),
    },
    {
        id: 'credits', tier: 0, author: 'munger', principle: 'Уникати очевидних помилок',
        when: (c) => c.budget.credits && c.budget.status === 'ok' && (c.budget.free ?? 0) < 100_000,
        impact: (c) => 100_000 - (c.budget.free ?? 0),
        build: (c) => ({
            tone: 'care',
            why: `Є кредит або розстрочка, а вільний запас після всіх резервів — лише ${(0, money_ts_1.fmt)(c.budget.free ?? 0)}.`,
            step: 'Не бери нових розстрочок, доки не зʼявиться запас. Вільні гроші — спершу на борг.',
        }),
    },
    {
        id: 'over-optional', tier: 0, author: 'munger', principle: 'Уникати очевидних помилок',
        when: (c) => c.hasPlan && c.over >= 5_000 && c.overOptional * 2 >= c.over,
        impact: (c) => c.over,
        build: (c) => ({
            tone: 'calm',
            why: `План перевищено на ${(0, money_ts_1.fmt)(c.over)}, і здебільшого — через необовʼязкові покупки (${(0, money_ts_1.fmt)(c.nec.optional)} за день).`,
            step: `Завтра перед необовʼязковою покупкою дорожче ${(0, money_ts_1.fmt)(upTen(c.over / 2))} — пауза 10 хвилин і погляд на залишок дня.`,
        }),
    },
    {
        id: 'over-necessary', tier: 0, author: 'graham', principle: 'Резерв на непередбачене',
        when: (c) => c.hasPlan && c.over >= 5_000 && c.overOptional * 2 < c.over && !(c.taxi.cash > 0 && c.overTransport * 2 >= c.over),
        impact: (c) => c.over,
        build: (c) => ({
            tone: 'calm',
            why: `Бюджет перевищено на ${(0, money_ts_1.fmt)(c.over)} через потрібні покупки. Так буває — це не провал.`,
            step: `Додай до плану рядок «Непередбачені» приблизно на ${(0, money_ts_1.fmt)(upTen(c.over))}, щоб такі дні не вибивали з ритму.`,
        }),
    },
    {
        id: 'big-unexpected', tier: 0, author: 'graham', principle: 'Запас міцності',
        when: (c) => c.biggest !== null && c.biggest.necessity === 'unexpected' && c.biggest.amount >= Math.max(20_000, Math.round(c.plan * 0.3)),
        impact: (c) => c.biggest?.amount ?? 0,
        build: (c) => ({
            tone: 'calm',
            why: `Сьогодні була непередбачена витрата «${c.biggest.title}» — ${(0, money_ts_1.fmt)(c.biggest.amount)}.`,
            step: 'Створи ціль «Резерв» хоча б на одну таку суму — наступного разу вона не вдарить по плану.',
            effectKop: c.biggest.amount,
            effect: `Резерв ${(0, money_ts_1.fmt)(c.biggest.amount)} покриє подібний випадок без перевитрати.`,
        }),
    },
    {
        id: 'taxi-worth', tier: 1, author: 'sethi', principle: 'Свідомі витрати',
        when: (c) => taxiWorth(c),
        impact: (c) => c.taxi.cash,
        build: (c) => {
            const t = taxiCalc(c);
            return {
                tone: 'positive',
                why: `Таксі коштувало на ${(0, money_ts_1.fmt)(t.extra)} більше за звичайний проїзд, але зекономило близько ${t.saved} хв. За твоєю цінністю години цей час вартує ${(0, money_ts_1.fmt)(t.timeValue)}.`,
                step: 'Залишай таксі для таких випадків — коли час справді дорожчий за доплату.',
            };
        },
    },
    {
        id: 'taxi-over', tier: 1, author: 'sethi', principle: 'Свідомі витрати: гроші — на те, що справді важливо',
        when: (c) => c.taxi.cash > 0 && !taxiWorth(c) && (c.transportPlan > 0
            ? c.transportSpent > c.transportPlan + Math.max(5_000, Math.round(c.transportPlan / 2))
            : c.pub !== null && c.taxi.cash >= c.pub.cost * 3),
        impact: (c) => c.taxi.cash - (c.pub ? c.pub.cost * c.taxi.trips : 0),
        build: (c) => {
            const extra = c.pub ? Math.max(0, c.taxi.cash - c.pub.cost * c.taxi.trips) : null;
            const n = c.pub && c.pub.cost > 0 ? Math.round(c.taxi.cash / c.pub.cost) : null;
            const parts = [`Таксі сьогодні — ${(0, money_ts_1.fmt)(c.taxi.cash)}${n !== null && n >= 2 ? `, стільки ж, скільки ${n} ${(0, money_ts_1.plural)(n, ['поїздка', 'поїздки', 'поїздок'])} громадським транспортом` : ''}.`];
            if (c.transportPlan > 0)
                parts.push(`Транспорт вийшов за план на ${(0, money_ts_1.fmt)(c.transportSpent - c.transportPlan)}.`);
            const month = extra !== null && extra > 0 ? Math.round((extra * 30) / 7) : null;
            return {
                tone: 'calm',
                why: parts.join(' '),
                step: 'Вирішуй заздалегідь: таксі — коли поспішаєш, пізно ввечері чи з важкими речами. В інші дні — громадський транспорт.',
                effectKop: month,
                effect: month ? `Якщо замінити одну таку поїздку на тиждень — ≈ ${(0, money_ts_1.fmt)(month)} за місяць.` : null,
            };
        },
    },
    {
        id: 'car-shared', tier: 1, author: 'lynch', principle: 'Знати, за що платиш',
        when: (c) => c.carShared !== null,
        impact: (c) => (c.carShared ? c.carShared.full - c.carShared.share : 0),
        build: (c) => ({
            tone: 'positive',
            why: `Повна вартість поїздки авто — ${(0, money_ts_1.fmt)(c.carShared.full)}, твоя частка на ${c.carShared.passengers} пасажирів — ${(0, money_ts_1.fmt)(c.carShared.share)}.`,
            step: 'Домовляйтеся про розподіл витрат до поїздки й записуй свою частку одразу.',
        }),
    },
    {
        id: 'home-lunch', tier: 1, author: 'buffett', principle: 'Довгострокова дисципліна',
        when: (c) => c.homeMeal !== null && c.canteen !== null && c.canteen - c.homeMeal.cost >= 3_000,
        impact: (c) => (c.canteen - c.homeMeal.cost) * Math.max(1, c.workdays30),
        build: (c) => {
            const d = c.canteen - c.homeMeal.cost;
            const m = d * c.workdays30;
            return {
                tone: 'positive',
                why: `Домашній обід обійшовся в ${(0, money_ts_1.fmt)(c.homeMeal.cost)} проти ${(0, money_ts_1.fmt)(c.canteen)} у їдальні — на ${(0, money_ts_1.fmt)(d)} менше.`,
                step: 'Приготуй обід заздалегідь, якщо це зручно.',
                effectKop: m,
                effect: `Якщо повторювати це в робочі дні найближчих 30 днів (${c.workdays30}), потенційна різниця — ≈ ${(0, money_ts_1.fmt)(m)}.`,
            };
        },
    },
    {
        id: 'meals-out', tier: 1, author: 'lynch', principle: 'Розуміти, куди йдуть гроші',
        when: (c) => c.lunchPlan > 0 && c.mealsOut > c.lunchPlan + 3_000,
        impact: (c) => c.mealsOut - c.lunchPlan,
        build: (c) => {
            const diff = c.canteen !== null && c.homeRef !== null ? c.canteen - c.homeRef : null;
            const m = diff !== null && diff > 0 ? Math.round((diff * 2 * 30) / 7) : null;
            return {
                tone: 'calm',
                why: `Їжа поза домом — ${(0, money_ts_1.fmt)(c.mealsOut)} при плані ${(0, money_ts_1.fmt)(c.lunchPlan)}.`,
                step: 'Спробуй домашній обід хоча б двічі на тиждень.',
                effectKop: m,
                effect: m ? `Два домашні обіди на тиждень — ≈ ${(0, money_ts_1.fmt)(m)} за місяць.` : null,
            };
        },
    },
    {
        id: 'micro-over-joy', tier: 1, author: 'housel', principle: 'Маленькі звички — великі наслідки',
        when: (c) => c.joy !== null && c.micro > c.joy,
        impact: (c) => (c.micro - (c.joy ?? 0)) * Math.max(1, c.workdays30),
        build: (c) => {
            const m = c.coffeePrice ? c.coffeePrice * c.workdays30 : null;
            return {
                tone: 'calm',
                why: `Кава й смаколики — ${(0, money_ts_1.fmt)(c.micro)} при бюджеті радості ${(0, money_ts_1.fmt)(c.joy)}. За останні 7 днів — ${(0, money_ts_1.fmt)(c.microWeek)}.`,
                step: 'Залиш улюблене, прибери автоматичне: наприклад, одна кава замість двох.',
                effectKop: m,
                effect: m ? `На одну каву менше в робочі дні — ≈ ${(0, money_ts_1.fmt)(m)} за 30 днів.` : null,
            };
        },
    },
    {
        id: 'micro-heavy', tier: 1, author: 'housel', principle: 'Маленькі звички — великі наслідки',
        when: (c) => c.joy === null && c.micro >= 10_000 && c.spent > 0 && c.micro * 4 >= c.spent,
        impact: (c) => c.micro * Math.max(1, c.workdays30),
        build: (c) => ({
            tone: 'calm',
            why: `Дрібні покупки — ${(0, money_ts_1.percent)(c.micro, c.spent) ?? 0}% сьогоднішніх витрат (${(0, money_ts_1.fmt)(c.micro)}). За останні 7 днів — ${(0, money_ts_1.fmt)(c.microWeek)}.`,
            step: 'Встанови «Бюджет радості» — суму на приємності без докорів сумління.',
            effectKop: c.micro * c.workdays30,
            effect: `Якщо так у кожен робочий день — ≈ ${(0, money_ts_1.fmt)(c.micro * c.workdays30)} за 30 днів.`,
        }),
    },
    {
        id: 'joy-ok', tier: 1, author: 'sethi', principle: 'Витрачати на те, що радує',
        when: (c) => c.joy !== null && c.micro > 0 && c.micro <= c.joy,
        impact: (c) => c.micro,
        build: (c) => ({
            tone: 'positive',
            why: `Приємності — ${(0, money_ts_1.fmt)(c.micro)} із ${(0, money_ts_1.fmt)(c.joy)} бюджету радості. Ти в межах.`,
            step: 'Насолоджуйся без докорів: бюджет радості для того й існує.',
        }),
    },
    {
        id: 'groceries-over', tier: 1, author: 'lynch', principle: 'Розуміти, на що витрачаєш',
        when: (c) => c.groceriesPlan > 0 && c.groceries * 10 > c.groceriesPlan * 13 && c.groceries - c.groceriesPlan >= 5_000,
        impact: (c) => c.groceries - c.groceriesPlan,
        build: (c) => ({
            tone: 'calm',
            why: `Продукти — ${(0, money_ts_1.fmt)(c.groceries)} при плані ${(0, money_ts_1.fmt)(c.groceriesPlan)}.`,
            step: 'Перед магазином — список під конкретні страви на 2–3 дні.',
        }),
    },
    {
        id: 'refund', tier: 1, author: 'munger', principle: 'Вчитися на помилках',
        when: (c) => c.refunds > 0,
        impact: (c) => c.refunds,
        build: (c) => ({
            tone: 'calm',
            why: `Сьогодні повернулося ${(0, money_ts_1.fmt)(c.refunds)}.`,
            step: 'Запиши для себе, чому покупка виявилася зайвою, — це збереже гроші наступного разу.',
        }),
    },
    {
        id: 'save-now', tier: 2, author: 'buffett', principle: 'Спершу заплати собі',
        when: (c) => c.hasPlan && c.economy >= 3_000 && c.budget.status === 'ok' && (c.budget.safe ?? 0) >= 1_000 && c.saved <= 0,
        impact: (c) => c.budget.safe ?? 0,
        build: (c) => {
            const s = c.budget.safe ?? 0;
            return {
                tone: 'positive',
                why: `День у межах плану: економія ${(0, money_ts_1.fmt)(c.economy)}. Безпечно відкласти — ${(0, money_ts_1.fmt)(s)}.`,
                step: `Переведи ${(0, money_ts_1.fmt)(s)} у накопичення й зафіксуй це кнопкою «Відкласти гроші».`,
                effectKop: s * c.workdays30,
                effect: `Якщо відкладати так у робочі дні — ≈ ${(0, money_ts_1.fmt)(s * c.workdays30)} за 30 днів.`,
            };
        },
    },
    {
        id: 'setup-budget', tier: 2, author: 'bogle', principle: 'Простота',
        when: (c) => c.hasPlan && c.economy > 0 && c.budget.status === 'unknown',
        impact: (c) => c.economy,
        build: (c) => ({
            tone: 'calm',
            why: `Економія відносно плану — ${(0, money_ts_1.fmt)(c.economy)}. Але без доходів, платежів і залишку не видно, скільки з неї можна відкласти безпечно.`,
            step: 'Заповни «Бюджет і доходи» в налаштуваннях — це кілька хвилин.',
        }),
    },
    {
        id: 'saved-today', tier: 2, author: 'bogle', principle: 'Дисципліна і довгий горизонт',
        when: (c) => c.saved > 0,
        impact: (c) => c.saved,
        build: (c) => ({
            tone: 'positive',
            why: `Ти відклав ${(0, money_ts_1.fmt)(c.saved)} — це реальні гроші, а не економія на папері.`,
            step: 'Повтори наступного разу: невелика регулярна сума важить більше за рідкісну велику.',
            effectKop: c.saved * c.workdays30,
            effect: `Така сума в кожен робочий день — ≈ ${(0, money_ts_1.fmt)(c.saved * c.workdays30)} за 30 днів.`,
        }),
    },
    {
        id: 'savings-growing', tier: 2, author: 'bogle', principle: 'Тримати курс',
        when: (c) => c.transfers14 >= 3 && c.saved14 > c.savedPrev14,
        impact: (c) => c.saved14,
        build: (c) => ({
            tone: 'positive',
            why: `За 14 днів — ${c.transfers14} ${(0, money_ts_1.plural)(c.transfers14, ['переказ', 'перекази', 'переказів'])} у накопичення, разом ${(0, money_ts_1.fmt)(c.saved14)}.`,
            step: 'Не змінюй систему, яка працює: та сама сума, той самий ритм.',
        }),
    },
    {
        id: 'goal-near', tier: 2, author: 'dalio', principle: 'Цілі та правила',
        when: (c) => c.goalNear !== null,
        impact: (c) => c.goalNear?.left ?? 0,
        build: (c) => ({
            tone: 'positive',
            why: `До цілі «${c.goalNear.name}» лишилося ${(0, money_ts_1.fmt)(c.goalNear.left)} — ${c.goalNear.pct}% уже є.`,
            step: 'Визнач дату й суму завершального переказу та внеси їх у план.',
        }),
    },
    {
        id: 'plan-low', tier: 2, author: 'dalio', principle: 'Навчатися на результатах',
        when: (c) => c.recent.closed >= 4 && c.recent.overDays >= 3,
        impact: (c) => c.recent.avgOver,
        build: (c) => ({
            tone: 'calm',
            why: `У ${c.recent.overDays} з ${c.recent.closed} останніх завершених днів план перевищено, у середньому на ${(0, money_ts_1.fmt)(c.recent.avgOver)}.`,
            step: `Підніми план на ${(0, money_ts_1.fmt)(upTen(c.recent.avgOver))}: чесний план корисніший за ідеальний.`,
        }),
    },
    {
        id: 'plan-high', tier: 2, author: 'dalio', principle: 'Навчатися на результатах',
        when: (c) => c.recent.closed >= 4 && c.recent.bigUnderDays >= 3,
        impact: (c) => c.recent.avgUnder,
        build: (c) => {
            const cut = Math.max(1_000, downTen(c.recent.avgUnder / 2));
            return {
                tone: 'positive',
                why: `План стабільно залишає запас — у середньому ${(0, money_ts_1.fmt)(c.recent.avgUnder)} на день.`,
                step: `Зменш план на ${(0, money_ts_1.fmt)(cut)} і відкладай цю суму одразу — так економія стане реальною.`,
                effectKop: cut * c.workdays30,
                effect: `${(0, money_ts_1.fmt)(cut)} у робочі дні — ≈ ${(0, money_ts_1.fmt)(cut * c.workdays30)} за 30 днів.`,
            };
        },
    },
    {
        id: 'no-plan', tier: 2, author: 'dalio', principle: 'Система замість сили волі',
        when: (c) => !c.hasPlan && c.hasData && c.gross > 0,
        impact: (c) => c.spent,
        build: (c) => ({
            tone: 'calm',
            why: `Сьогодні без плану: витрачено ${(0, money_ts_1.fmt)(c.spent)}, але порівняти нема з чим.`,
            step: 'Завтра вранці обери шаблон дня — це один дотик.',
        }),
    },
    {
        id: 'no-spend', tier: 2, author: 'housel', principle: 'Свобода вибору',
        when: (c) => (c.closed || c.hasData) && c.gross === 0 && c.spent === 0,
        impact: () => 1,
        build: () => ({
            tone: 'positive',
            why: 'День без витрат.',
            step: 'Нічого не треба виправляти. Просто зауваж, що такі дні можливі.',
        }),
    },
    {
        id: 'missing', tier: 2, author: 'lynch', principle: 'Розуміти, куди йдуть гроші',
        when: (c) => c.missing7 >= 3,
        impact: () => 0,
        build: (c) => ({
            tone: 'calm',
            why: `За останні 7 днів ${c.missing7} ${(0, money_ts_1.plural)(c.missing7, ['день', 'дні', 'днів'])} без записів — аналітика стає менш точною.`,
            step: 'Достатньо внести підсумок дня хоча б одним записом.',
        }),
    },
    {
        id: 'little-data', tier: 3, author: 'bogle', principle: 'Почати просто',
        when: (c) => c.dataDays < 3 || !c.hasData,
        impact: () => 0,
        build: () => ({
            tone: 'calm',
            why: 'Даних поки мало, тож робити висновки зарано.',
            step: 'Записуй витрати кілька днів — і поради стануть конкретнішими.',
        }),
    },
    {
        id: 'in-budget', tier: 3, author: 'buffett', principle: 'Наступний фінансовий крок',
        when: (c) => c.hasPlan && c.over === 0,
        impact: () => 0,
        build: (c) => ({
            tone: 'positive',
            why: `День у межах плану: витрачено ${(0, money_ts_1.fmt)(c.spent)} із ${(0, money_ts_1.fmt)(c.plan)}.`,
            step: 'Наступний крок — вирішити, куди піде економія: у ціль чи в резерв.',
        }),
    },
    {
        id: 'over-small', tier: 3, author: 'graham', principle: 'Запас міцності',
        when: (c) => c.hasPlan && c.over > 0,
        impact: () => 0,
        build: (c) => ({
            tone: 'calm',
            why: `План перевищено на ${(0, money_ts_1.fmt)(c.over)} — невелике відхилення.`,
            step: 'Завтра заклади в план невеликий резерв на непередбачене.',
        }),
    },
    {
        id: 'fallback', tier: 3, author: 'bogle', principle: 'Дисципліна',
        when: () => true,
        impact: () => 0,
        build: () => ({
            tone: 'calm',
            why: 'Записи зроблено — це вже дисципліна.',
            step: 'Склади план на завтра.',
        }),
    },
];
function matchingRules(c) {
    return exports.RULES.filter((r) => r.when(c)).map((r) => r.id);
}
function pickAdvice(c, now = Date.now()) {
    let best = exports.RULES[exports.RULES.length - 1];
    let bestImpact = -Infinity;
    let found = false;
    for (const rule of exports.RULES) {
        if (!rule.when(c))
            continue;
        const impact = rule.impact(c);
        if (!found || rule.tier < best.tier || (rule.tier === best.tier && impact > bestImpact)) {
            best = rule;
            bestImpact = impact;
            found = true;
        }
    }
    const b = best.build(c);
    const a = exports.AUTHORS[best.author];
    return {
        ruleId: best.id,
        author: a.name,
        authorGen: a.gen,
        principle: best.principle,
        why: b.why,
        step: b.step,
        effect: b.effect ?? null,
        effectKop: b.effectKop ?? null,
        tone: b.tone ?? 'calm',
        createdAt: now,
    };
}
function buildContext(data, date, today) {
    const ix = (0, ledger_ts_1.buildIndex)(data.ops);
    const cats = (0, ledger_ts_1.catMap)(data.categories);
    const s = data.settings;
    const rec = data.days[date];
    const c = (0, ledger_ts_1.calcDay)(ix, date, rec, cats);
    const own = ix.byDate.get(date) ?? [];
    const exp = own.filter((o) => o.type === 'expense');
    const taxis = exp.filter((o) => o.trip?.mode === 'taxi');
    const taxiMinutes = taxis.length && taxis.every((o) => o.trip.minutes !== null)
        ? taxis.reduce((sum, o) => sum + o.trip.minutes + (o.trip.wait ?? 0), 0)
        : null;
    const pub = (0, transport_ts_1.publicRef)(ix, s, today);
    const car = exp.find((o) => o.trip?.mode === 'car' && o.trip.split && o.trip.passengers > 1);
    const homeLunches = own.filter((o) => o.meal?.kind === 'lunchBox' && (o.type === 'consumption' || o.type === 'expense'));
    const mealsOut = exp.filter((o) => o.meal && !(0, meals_ts_1.isHomeMeal)(o.meal.kind)).reduce((sum, o) => sum + o.amount, 0);
    let microWeek = 0;
    for (let i = 0; i < 7; i++)
        microWeek += (0, ledger_ts_1.calcDay)(ix, (0, time_ts_1.addDays)(date, -i), data.days[(0, time_ts_1.addDays)(date, -i)], cats).micro;
    const big = exp.filter((o) => !(0, ledger_ts_1.isBill)(o)).sort((a, b) => b.amount - a.amount)[0];
    const todayRec = data.days[today];
    const todayCalc = date === today ? c : (0, ledger_ts_1.calcDay)(ix, today, todayRec, cats);
    const bv = (0, budget_ts_1.budgetView)({ ix, settings: s, days: data.days, today, todayCalc, todayClosed: Boolean(todayRec?.closed) });
    const netSaved = (from, to) => {
        let n = 0;
        let sum = 0;
        for (const o of ix.all) {
            if (o.date < from || o.date > to)
                continue;
            if (o.type === 'saving') {
                n++;
                sum += o.amount;
            }
            else if (o.type === 'withdrawal')
                sum -= o.amount;
        }
        return { n, sum };
    };
    const last14 = netSaved((0, time_ts_1.addDays)(date, -13), date);
    const prev14 = netSaved((0, time_ts_1.addDays)(date, -27), (0, time_ts_1.addDays)(date, -14));
    const near = data.goals
        .map((g) => (0, goals_ts_1.goalView)(g, ix, today))
        .filter((v) => !v.done && v.pct >= 80)
        .sort((a, b) => b.pct - a.pct)[0];
    const prevClosed = Object.values(data.days)
        .filter((r) => r.date < date && r.closed && r.plan && r.plan.length)
        .sort((a, b) => (a.date < b.date ? 1 : -1))
        .slice(0, 5);
    let overDays = 0;
    let sumOver = 0;
    let bigUnderDays = 0;
    let sumUnder = 0;
    for (const r of prevClosed) {
        const rc = (0, ledger_ts_1.calcDay)(ix, r.date, r, cats);
        if (rc.spent > rc.planTotal) {
            overDays++;
            sumOver += rc.spent - rc.planTotal;
        }
        else if ((rc.planTotal - rc.spent) * 10 > rc.planTotal * 3) {
            bigUnderDays++;
            sumUnder += rc.planTotal - rc.spent;
        }
    }
    const dataDates = new Set();
    for (const o of ix.all)
        if (o.date <= date)
            dataDates.add(o.date);
    for (const r of Object.values(data.days))
        if (r.closed && r.date <= date)
            dataDates.add(r.date);
    let missing7 = 0;
    for (let i = 1; i <= 7; i++) {
        const d = (0, time_ts_1.addDays)(date, -i);
        if (!ix.byDate.has(d) && !data.days[d]?.closed)
            missing7++;
    }
    const coffee = data.micro.find((m) => m.id === 'q-coffee' && m.price !== null) ?? data.micro.find((m) => m.category === 'coffee' && m.price !== null);
    return {
        date,
        work: (0, calendar_ts_1.isWorkday)(date, s.calendar),
        hasData: c.hasData,
        closed: Boolean(rec?.closed),
        hasPlan: c.plan !== null,
        plan: c.planTotal,
        spent: c.spent,
        gross: c.gross,
        economy: c.plan ? c.planTotal - c.spent : 0,
        over: c.over,
        nec: c.byNec,
        overOptional: Object.entries(c.byCat).reduce((sum, [id, v]) => (cats.get(id)?.necessity === 'optional' ? sum + Math.max(0, v - (c.planByCat[id] ?? 0)) : sum), 0),
        overTransport: Math.max(0, (c.byCat.transport ?? 0) - (c.planByCat.transport ?? 0)),
        taxi: { cash: taxis.reduce((sum, o) => sum + o.amount, 0), trips: taxis.length, minutes: taxiMinutes },
        transportSpent: c.byCat.transport ?? 0,
        transportPlan: c.planByCat.transport ?? 0,
        pub: pub ? { cost: pub.cost, minutes: pub.minutes } : null,
        hourValue: s.hourValue,
        carShared: car ? { full: car.trip.full, share: car.amount + (car.estimate ?? 0), passengers: car.trip.passengers } : null,
        homeMeal: homeLunches.length ? { cost: Math.min(...homeLunches.map((o) => o.amount)) } : null,
        canteen: (0, meals_ts_1.canteenRef)(ix, s, today)?.amount ?? null,
        homeRef: (0, meals_ts_1.homeMealRef)(ix, today),
        mealsOut,
        lunchPlan: c.planByCat.lunch ?? 0,
        micro: c.micro,
        joy: s.joyBudget,
        microWeek,
        coffeePrice: coffee?.price ?? null,
        groceries: c.byCat.groceries ?? 0,
        groceriesPlan: c.planByCat.groceries ?? 0,
        refunds: c.refunds,
        saved: c.saved,
        biggest: big ? { amount: big.amount, necessity: (0, ledger_ts_1.necessityOf)(big, cats), title: big.title ?? cats.get(big.category ?? 'other')?.name ?? 'Витрата' } : null,
        budget: {
            status: bv.status,
            free: bv.free,
            shortfall: bv.shortfall,
            safe: bv.safe,
            credits: bv.hasCredits,
            nextIncome: bv.nextIncome?.date ?? null,
        },
        transfers14: last14.n,
        saved14: last14.sum,
        savedPrev14: prev14.sum,
        goalNear: near ? { name: near.goal.name, left: near.left, pct: near.pct } : null,
        recent: {
            closed: prevClosed.length,
            overDays,
            avgOver: overDays ? Math.round(sumOver / overDays) : 0,
            bigUnderDays,
            avgUnder: bigUnderDays ? Math.round(sumUnder / bigUnderDays) : 0,
        },
        dataDays: dataDates.size,
        missing7,
        workdays30: (0, calendar_ts_1.workdaysAhead)(date, 30, s.calendar),
    };
}
function adviceFor(data, date, today, now = Date.now()) {
    return pickAdvice(buildContext(data, date, today), now);
}
};

// ── habits.ts
defs["habits.js"] = function (require, exports, module) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeHabits = computeHabits;
exports.newlyDone = newlyDone;
const ledger_ts_1 = require("./ledger.js");
function computeHabits(data, today) {
    const ix = (0, ledger_ts_1.buildIndex)(data.ops);
    const cats = (0, ledger_ts_1.catMap)(data.categories);
    const logged = new Set();
    for (const o of ix.all)
        if (o.date <= today)
            logged.add(o.date);
    let planned = 0;
    let reviewed = 0;
    let disciplined = 0;
    for (const rec of Object.values(data.days)) {
        if (rec.date > today)
            continue;
        if (rec.plan && rec.plan.length && rec.planSource !== 'auto')
            planned++;
        if (rec.closed) {
            reviewed++;
            if (rec.plan && rec.plan.length) {
                const c = (0, ledger_ts_1.calcDay)(ix, rec.date, rec, cats);
                if (c.spent <= c.planTotal)
                    disciplined++;
            }
        }
    }
    const saves = ix.all.filter((o) => o.type === 'saving').length;
    const list = [
        { id: 'log3', title: '3 дні записів', desc: 'Дні, коли ти вносив витрати. Не обовʼязково поспіль.', icon: 'pen', need: 3, have: logged.size },
        { id: 'plan7', title: '7 днів усвідомленого планування', desc: 'Дні з планом, складеним тобою або обраним шаблоном.', icon: 'list', need: 7, have: planned },
        { id: 'review14', title: '14 днів аналізу', desc: 'Вечори, коли ти підбивав підсумок дня.', icon: 'chart', need: 14, have: reviewed },
        { id: 'discipline30', title: '30 днів фінансової дисципліни', desc: 'Завершені дні, що вклалися в план.', icon: 'trophy', need: 30, have: disciplined },
        { id: 'firstSave', title: 'Перший переказ у накопичення', desc: 'Гроші, які реально відкладено.', icon: 'coins', need: 1, have: saves },
        { id: 'firstGoal', title: 'Перша фінансова ціль', desc: 'Ціль, до якої видно прогрес.', icon: 'target', need: 1, have: data.goals.length },
    ];
    return list.map((h) => {
        const done = h.have >= h.need;
        return { ...h, have: Math.min(h.have, h.need), done, unlockedAt: data.habits[h.id] ?? null };
    });
}
function newlyDone(data, today) {
    return computeHabits(data, today).filter((h) => h.done && !data.habits[h.id]);
}
};

// ── defaults.ts
defs["defaults.js"] = function (require, exports, module) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PUBLIC_MODES = exports.GOAL_PRESETS = exports.OBLIGATION_KINDS = exports.NECESSITY_ORDER = exports.NECESSITY = exports.TEMPLATES = exports.MICRO = exports.CATEGORY_ICONS = exports.CATEGORY_COLORS = exports.CATEGORIES = void 0;
exports.defaultSettings = defaultSettings;
exports.clone = clone;
exports.emptyData = emptyData;
exports.uid = uid;
const money_ts_1 = require("./money.js");
exports.CATEGORIES = [
    { id: 'transport', name: 'Транспорт', icon: 'bus', color: '#3B76D6', necessity: 'flexible', micro: false, builtin: true },
    { id: 'groceries', name: 'Продукти', icon: 'basket', color: '#2C9561', necessity: 'flexible', micro: false, builtin: true },
    { id: 'lunch', name: 'Обід', icon: 'utensils', color: '#D9772B', necessity: 'flexible', micro: false, builtin: true },
    { id: 'coffee', name: 'Кава', icon: 'coffee', color: '#9A6B47', necessity: 'optional', micro: true, builtin: true },
    { id: 'treats', name: 'Смаколики', icon: 'candy', color: '#C9508A', necessity: 'optional', micro: true, builtin: true },
    { id: 'household', name: 'Побут', icon: 'home', color: '#7562CF', necessity: 'flexible', micro: false, builtin: true },
    { id: 'other', name: 'Інші витрати', icon: 'box', color: '#76808C', necessity: 'unexpected', micro: false, builtin: true },
    { id: 'bills', name: 'Обов’язкові платежі', icon: 'doc', color: '#4F6475', necessity: 'required', micro: false, builtin: true },
];
exports.CATEGORY_COLORS = ['#3B76D6', '#2C9561', '#D9772B', '#9A6B47', '#C9508A', '#7562CF', '#76808C', '#1E9A9A', '#B88A1E', '#5C6BC0'];
exports.CATEGORY_ICONS = ['box', 'basket', 'utensils', 'coffee', 'candy', 'home', 'bus', 'gift', 'heart', 'book', 'shirt', 'pill', 'phone', 'paw', 'doc'];
exports.MICRO = [
    { id: 'q-coffee', name: 'Кава', category: 'coffee', icon: 'coffee', price: (0, money_ts_1.uah)(60), quick: true },
    { id: 'q-treat', name: 'Смаколик', category: 'treats', icon: 'candy', price: (0, money_ts_1.uah)(45), quick: true },
    { id: 'q-water', name: 'Вода', category: 'coffee', icon: 'drop', price: (0, money_ts_1.uah)(25), quick: true },
    { id: 'espresso', name: 'Еспресо', category: 'coffee', icon: 'coffee', price: null, quick: false },
    { id: 'americano', name: 'Американо', category: 'coffee', icon: 'coffee', price: null, quick: false },
    { id: 'cappuccino', name: 'Капучино', category: 'coffee', icon: 'coffee', price: null, quick: false },
    { id: 'latte', name: 'Лате', category: 'coffee', icon: 'coffee', price: null, quick: false },
    { id: 'tea', name: 'Чай', category: 'coffee', icon: 'cup', price: null, quick: false },
    { id: 'cookies', name: 'Печиво', category: 'treats', icon: 'cookie', price: null, quick: false },
    { id: 'chocolate', name: 'Шоколад', category: 'treats', icon: 'choco', price: null, quick: false },
    { id: 'pastry', name: 'Випічка', category: 'treats', icon: 'pastry', price: null, quick: false },
    { id: 'snacks', name: 'Снеки', category: 'treats', icon: 'candy', price: null, quick: false },
    { id: 'icecream', name: 'Морозиво', category: 'treats', icon: 'icecream', price: null, quick: false },
    { id: 'micro-other', name: 'Інше', category: 'treats', icon: 'box', price: null, quick: false },
];
const line = (id, label, category, hryvnias) => ({
    id, label, category, amount: (0, money_ts_1.uah)(hryvnias),
});
exports.TEMPLATES = [
    {
        id: 'tpl-study', name: 'Навчання у Дніпрі', builtin: true,
        lines: [
            line('s1', 'Поїздка туди', 'transport', 30),
            line('s2', 'Кава', 'coffee', 70),
            line('s3', 'Обід', 'lunch', 180),
            line('s4', 'Поїздка назад', 'transport', 30),
            line('s5', 'Продукти на вечерю', 'groceries', 200),
            line('s6', 'Смаколики', 'treats', 50),
            line('s7', 'Непередбачені', 'other', 90),
        ],
    },
    {
        id: 'tpl-eco', name: 'Економний день', builtin: true,
        lines: [
            line('e1', 'Громадський транспорт', 'transport', 60),
            line('e2', 'Домашній обід', 'lunch', 0),
            line('e3', 'Мінімальні покупки', 'groceries', 120),
            line('e4', 'Резерв', 'other', 40),
        ],
    },
    {
        id: 'tpl-comfort', name: 'Комфортний день', builtin: true,
        lines: [
            line('c1', 'Таксі', 'transport', 300),
            line('c2', 'Обід у їдальні', 'lunch', 170),
            line('c3', 'Кава', 'coffee', 70),
            line('c4', 'Додаткові витрати', 'other', 150),
        ],
    },
    {
        id: 'tpl-weekend', name: 'Вихідний', builtin: true,
        lines: [
            line('w1', 'Продукти', 'groceries', 400),
            line('w2', 'Відпочинок', 'other', 300),
            line('w3', 'Сімейні витрати', 'household', 300),
        ],
    },
];
exports.NECESSITY = {
    required: { label: 'Обов’язкові', short: 'Обов’язкова' },
    flexible: { label: 'Потрібні, але гнучкі', short: 'Гнучка' },
    optional: { label: 'Необов’язкові', short: 'Необов’язкова' },
    unexpected: { label: 'Непередбачені', short: 'Непередбачена' },
};
exports.NECESSITY_ORDER = ['required', 'flexible', 'optional', 'unexpected'];
exports.OBLIGATION_KINDS = {
    rent: 'Оренда житла',
    utilities: 'Комунальні',
    credit: 'Кредит або розстрочка',
    other: 'Інший платіж',
};
exports.GOAL_PRESETS = [
    { kind: 'reserve', name: 'Резерв', target: (0, money_ts_1.uah)(10_000), icon: 'shield' },
    { kind: 'cushion', name: 'Фінансова подушка', target: (0, money_ts_1.uah)(30_000), icon: 'coins' },
    { kind: 'car', name: 'Автомобіль', target: null, icon: 'car' },
    { kind: 'vacation', name: 'Відпустка', target: null, icon: 'sun' },
    { kind: 'custom', name: 'Власна мета', target: null, icon: 'target' },
];
exports.PUBLIC_MODES = ['bus', 'tram', 'trolley', 'metro'];
function defaultSettings() {
    return {
        theme: 'system',
        onboarded: false,
        hourValue: null,
        canteenPrice: null,
        publicFare: null,
        joyBudget: null,
        autoPlan: { work: null, off: null },
        calendar: { workdays: [true, true, true, true, true, false, false], overrides: {}, stays: [] },
        budget: {
            incomes: [],
            obligations: [],
            balance: null,
            savingsStart: 0,
            buffer: 0,
            monthlyGoal: null,
            dailyEstimate: null,
            flexTransport: null,
            flexGroceries: null,
        },
        forecastStayOnly: false,
    };
}
function clone(x) {
    return typeof structuredClone === 'function' ? structuredClone(x) : JSON.parse(JSON.stringify(x));
}
function emptyData() {
    return {
        ops: [],
        days: {},
        settings: defaultSettings(),
        categories: clone(exports.CATEGORIES),
        templates: clone(exports.TEMPLATES),
        goals: [],
        micro: clone(exports.MICRO),
        habits: {},
    };
}
let counter = 0;
function uid(prefix = '') {
    const c = globalThis.crypto;
    if (c?.randomUUID)
        return prefix + c.randomUUID();
    counter = (counter + 1) % 1_000_000;
    return `${prefix}${Date.now().toString(36)}-${counter.toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
};

// ── actions.ts
defs["actions.js"] = function (require, exports, module) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OP_TYPES = void 0;
exports.validateOp = validateOp;
exports.settle = settle;
exports.addOp = addOp;
exports.updateOp = updateOp;
exports.deleteOp = deleteOp;
exports.restoreOp = restoreOp;
exports.purgeOp = purgeOp;
exports.setPlan = setPlan;
exports.closeDay = closeDay;
exports.reopenDay = reopenDay;
const mentor_ts_1 = require("./mentor.js");
const habits_ts_1 = require("./habits.js");
const defaults_ts_1 = require("./defaults.js");
const time_ts_1 = require("./time.js");
const money_ts_1 = require("./money.js");
exports.OP_TYPES = ['expense', 'income', 'refund', 'saving', 'withdrawal', 'transfer', 'consumption'];
const isKop = (v) => typeof v === 'number' && Number.isSafeInteger(v) && v >= 0 && v <= money_ts_1.MAX_KOP;
function validateOp(op) {
    if (!op.type || !exports.OP_TYPES.includes(op.type))
        return 'Невідомий тип операції.';
    if (!(0, time_ts_1.isDateKey)(op.date))
        return 'Некоректна дата.';
    if (!isKop(op.amount))
        return 'Сума має бути невідʼємною, у межах 10 млн грн.';
    if (op.estimate !== undefined && !isKop(op.estimate))
        return 'Розрахункова частина має бути невідʼємною.';
    const zeroAllowed = op.type === 'expense' && Boolean(op.trip);
    if (op.amount === 0 && !zeroAllowed)
        return 'Вкажи суму більшу за нуль.';
    return null;
}
function mergeChanges(a, b) {
    const days = new Map();
    for (const d of [...(a.putDays ?? []), ...(b.putDays ?? [])])
        days.set(d.date, d);
    return {
        putOps: [...(a.putOps ?? []), ...(b.putOps ?? [])],
        delOps: [...(a.delOps ?? []), ...(b.delOps ?? [])],
        putDays: [...days.values()],
        kv: { ...(a.kv ?? {}), ...(b.kv ?? {}) },
    };
}
function settle(data, dates, today, now) {
    let next = data;
    const putDays = [];
    const seen = new Set();
    for (const date of dates) {
        if (seen.has(date))
            continue;
        seen.add(date);
        const rec = next.days[date];
        if (!rec?.closed)
            continue;
        const updated = { ...rec, advice: (0, mentor_ts_1.adviceFor)(next, date, today, now), updatedAt: now };
        next = { ...next, days: { ...next.days, [date]: updated } };
        putDays.push(updated);
    }
    const fresh = (0, habits_ts_1.newlyDone)(next, today);
    const change = { putDays };
    if (fresh.length) {
        const habits = { ...next.habits };
        for (const h of fresh)
            habits[h.id] = now;
        next = { ...next, habits };
        change.kv = { habits };
    }
    return { data: next, change, habits: fresh };
}
function relatedDates(data, op) {
    const dates = [op.date];
    if (op.refundOf) {
        const orig = data.ops.find((o) => o.id === op.refundOf);
        if (orig)
            dates.push(orig.date);
    }
    for (const r of data.ops)
        if (r.refundOf === op.id)
            dates.push(r.date, op.date);
    return dates;
}
function addOp(data, input, today, now = Date.now()) {
    const op = { ...input, id: input.id ?? (0, defaults_ts_1.uid)(), time: input.time ?? now, updatedAt: now };
    const err = validateOp(op);
    if (err)
        throw new Error(err);
    const next = { ...data, ops: [...data.ops, op] };
    const s = settle(next, relatedDates(next, op), today, now);
    return { data: s.data, change: mergeChanges({ putOps: [op] }, s.change), value: op, habits: s.habits };
}
function updateOp(data, id, patch, today, now = Date.now()) {
    const old = data.ops.find((o) => o.id === id);
    if (!old)
        throw new Error('Операцію не знайдено.');
    const merged = { ...old, ...patch, id, updatedAt: now };
    for (const k of Object.keys(merged))
        if (merged[k] === undefined)
            delete merged[k];
    const err = validateOp(merged);
    if (err)
        throw new Error(err);
    const next = { ...data, ops: data.ops.map((o) => (o.id === id ? merged : o)) };
    const s = settle(next, [...relatedDates(data, old), ...relatedDates(next, merged)], today, now);
    return { data: s.data, change: mergeChanges({ putOps: [merged] }, s.change), value: merged, habits: s.habits };
}
function deleteOp(data, id, today, now = Date.now()) {
    const old = data.ops.find((o) => o.id === id);
    if (!old)
        throw new Error('Операцію не знайдено.');
    const gone = { ...old, deletedAt: now, updatedAt: now };
    const next = { ...data, ops: data.ops.map((o) => (o.id === id ? gone : o)) };
    const s = settle(next, relatedDates(data, old), today, now);
    return { data: s.data, change: mergeChanges({ putOps: [gone] }, s.change), value: gone, habits: s.habits };
}
function restoreOp(data, id, today, now = Date.now()) {
    const old = data.ops.find((o) => o.id === id);
    if (!old)
        throw new Error('Операцію не знайдено.');
    const back = { ...old, updatedAt: now };
    delete back.deletedAt;
    const next = { ...data, ops: data.ops.map((o) => (o.id === id ? back : o)) };
    const s = settle(next, relatedDates(next, back), today, now);
    return { data: s.data, change: mergeChanges({ putOps: [back] }, s.change), value: back, habits: s.habits };
}
function purgeOp(data, id, today, now = Date.now()) {
    const old = data.ops.find((o) => o.id === id);
    if (!old)
        return { data, change: {}, value: null, habits: [] };
    const next = { ...data, ops: data.ops.filter((o) => o.id !== id) };
    const s = settle(next, relatedDates(data, old), today, now);
    return { data: s.data, change: mergeChanges({ delOps: [id] }, s.change), value: null, habits: s.habits };
}
function dayOf(data, date, now) {
    return data.days[date] ?? { date, plan: null, closed: false, updatedAt: now };
}
function setPlan(data, date, lines, source, today, now = Date.now(), templateId) {
    if (!(0, time_ts_1.isDateKey)(date))
        throw new Error('Некоректна дата.');
    for (const l of lines ?? [])
        if (!isKop(l.amount))
            throw new Error('Сума в плані має бути невідʼємною.');
    const rec = { ...dayOf(data, date, now), plan: lines && lines.length ? lines : null, planSource: lines ? source : undefined, templateId, updatedAt: now };
    if (!rec.templateId)
        delete rec.templateId;
    if (!rec.planSource)
        delete rec.planSource;
    const next = { ...data, days: { ...data.days, [date]: rec } };
    const s = settle(next, [date], today, now);
    return { data: s.data, change: mergeChanges({ putDays: [rec] }, s.change), value: s.data.days[date], habits: s.habits };
}
function closeDay(data, date, today, now = Date.now()) {
    const rec = { ...dayOf(data, date, now), closed: true, closedAt: now, updatedAt: now };
    let next = { ...data, days: { ...data.days, [date]: rec } };
    const advice = (0, mentor_ts_1.adviceFor)(next, date, today, now);
    const closed = { ...rec, advice };
    next = { ...next, days: { ...next.days, [date]: closed } };
    const s = settle(next, [], today, now);
    return { data: s.data, change: mergeChanges({ putDays: [closed] }, s.change), value: advice, habits: s.habits };
}
function reopenDay(data, date, now = Date.now()) {
    const rec = { ...dayOf(data, date, now), closed: false, advice: null, updatedAt: now };
    delete rec.closedAt;
    return { data: { ...data, days: { ...data.days, [date]: rec } }, change: { putDays: [rec] }, value: rec, habits: [] };
}
};

// ── db.ts
defs["db.js"] = function (require, exports, module) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openBackend = openBackend;
exports.requestPersistence = requestPersistence;
exports.isPersisted = isPersisted;
function req(r) {
    return new Promise((resolve, reject) => {
        r.onsuccess = () => resolve(r.result);
        r.onerror = () => reject(r.error);
    });
}
function done(tx) {
    return new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error ?? new Error('Транзакцію перервано'));
    });
}
function openIdb(name) {
    return new Promise((resolve, reject) => {
        if (typeof indexedDB === 'undefined') {
            reject(new Error('IndexedDB недоступна'));
            return;
        }
        const r = indexedDB.open(name, 1);
        r.onupgradeneeded = () => {
            const db = r.result;
            if (!db.objectStoreNames.contains('ops'))
                db.createObjectStore('ops', { keyPath: 'id' });
            if (!db.objectStoreNames.contains('days'))
                db.createObjectStore('days', { keyPath: 'date' });
            if (!db.objectStoreNames.contains('kv'))
                db.createObjectStore('kv');
            if (!db.objectStoreNames.contains('backups'))
                db.createObjectStore('backups');
        };
        r.onsuccess = () => resolve(r.result);
        r.onerror = () => reject(r.error);
        r.onblocked = () => reject(new Error('База зайнята іншою вкладкою'));
    });
}
function idbBackend(db) {
    return {
        kind: 'idb',
        async load() {
            const tx = db.transaction(['ops', 'days', 'kv'], 'readonly');
            const kvStore = tx.objectStore('kv');
            const [ops, days, keys, vals] = await Promise.all([
                req(tx.objectStore('ops').getAll()),
                req(tx.objectStore('days').getAll()),
                req(kvStore.getAllKeys()),
                req(kvStore.getAll()),
            ]);
            const kv = {};
            keys.forEach((k, i) => { kv[String(k)] = vals[i]; });
            return { ops, days, kv };
        },
        async apply(c) {
            const tx = db.transaction(['ops', 'days', 'kv'], 'readwrite');
            const ops = tx.objectStore('ops');
            const days = tx.objectStore('days');
            const kv = tx.objectStore('kv');
            for (const o of c.putOps ?? [])
                ops.put(o);
            for (const id of c.delOps ?? [])
                ops.delete(id);
            for (const d of c.putDays ?? [])
                days.put(d);
            for (const [k, v] of Object.entries(c.kv ?? {}))
                kv.put(v, k);
            await done(tx);
        },
        async replace(s) {
            const tx = db.transaction(['ops', 'days', 'kv'], 'readwrite');
            const ops = tx.objectStore('ops');
            const days = tx.objectStore('days');
            const kv = tx.objectStore('kv');
            ops.clear();
            days.clear();
            kv.clear();
            for (const o of s.ops)
                ops.put(o);
            for (const d of s.days)
                days.put(d);
            for (const [k, v] of Object.entries(s.kv))
                kv.put(v, k);
            await done(tx);
        },
        async getBackup() {
            const tx = db.transaction('backups', 'readonly');
            return req(tx.objectStore('backups').get('prev'));
        },
        async setBackup(v) {
            const tx = db.transaction('backups', 'readwrite');
            tx.objectStore('backups').put(v, 'prev');
            await done(tx);
        },
    };
}
function localBackend(name, storage) {
    const read = (k, fallback) => {
        const raw = storage.getItem(`${name}:${k}`);
        return raw ? JSON.parse(raw) : fallback;
    };
    const write = (k, v) => storage.setItem(`${name}:${k}`, JSON.stringify(v));
    return {
        kind: 'local',
        async load() {
            return { ops: read('ops', []), days: read('days', []), kv: read('kv', {}) };
        },
        async apply(c) {
            if (c.putOps?.length || c.delOps?.length) {
                const map = new Map(read('ops', []).map((o) => [o.id, o]));
                for (const o of c.putOps ?? [])
                    map.set(o.id, o);
                for (const id of c.delOps ?? [])
                    map.delete(id);
                write('ops', [...map.values()]);
            }
            if (c.putDays?.length) {
                const map = new Map(read('days', []).map((d) => [d.date, d]));
                for (const d of c.putDays)
                    map.set(d.date, d);
                write('days', [...map.values()]);
            }
            if (c.kv && Object.keys(c.kv).length)
                write('kv', { ...read('kv', {}), ...c.kv });
        },
        async replace(s) {
            write('ops', s.ops);
            write('days', s.days);
            write('kv', s.kv);
        },
        async getBackup() {
            return read('backup', undefined);
        },
        async setBackup(v) {
            write('backup', v);
        },
    };
}
function memoryBackend() {
    let snap = { ops: [], days: [], kv: {} };
    let backup;
    return {
        kind: 'memory',
        async load() { return snap; },
        async apply(c) {
            const ops = new Map(snap.ops.map((o) => [o.id, o]));
            for (const o of c.putOps ?? [])
                ops.set(o.id, o);
            for (const id of c.delOps ?? [])
                ops.delete(id);
            const days = new Map(snap.days.map((d) => [d.date, d]));
            for (const d of c.putDays ?? [])
                days.set(d.date, d);
            snap = { ops: [...ops.values()], days: [...days.values()], kv: { ...snap.kv, ...(c.kv ?? {}) } };
        },
        async replace(s) { snap = s; },
        async getBackup() { return backup; },
        async setBackup(v) { backup = v; },
    };
}
async function openBackend(name) {
    try {
        const db = await openIdb(name);
        const b = idbBackend(db);
        await b.load();
        return b;
    }
    catch {
        try {
            const ls = globalThis.localStorage;
            ls.setItem(`${name}:probe`, '1');
            ls.removeItem(`${name}:probe`);
            return localBackend(name, ls);
        }
        catch {
            return memoryBackend();
        }
    }
}
async function requestPersistence() {
    try {
        const s = navigator.storage;
        if (!s?.persist)
            return null;
        if (s.persisted && (await s.persisted()))
            return true;
        return await s.persist();
    }
    catch {
        return null;
    }
}
async function isPersisted() {
    try {
        const s = navigator.storage;
        return s?.persisted ? await s.persisted() : null;
    }
    catch {
        return null;
    }
}
};

// ── demo.ts
defs["demo.js"] = function (require, exports, module) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEMO_TODAY = void 0;
exports.buildDemo = buildDemo;
const defaults_ts_1 = require("./defaults.js");
const money_ts_1 = require("./money.js");
const time_ts_1 = require("./time.js");
const calendar_ts_1 = require("./calendar.js");
const mentor_ts_1 = require("./mentor.js");
const transport_ts_1 = require("./transport.js");
const meals_ts_1 = require("./meals.js");
const habits_ts_1 = require("./habits.js");
exports.DEMO_TODAY = { plan: (0, money_ts_1.uah)(650), cash: (0, money_ts_1.uah)(460), economy: (0, money_ts_1.uah)(190), homeLunch: (0, money_ts_1.uah)(65) };
function buildDemo(today, now = Date.now()) {
    const data = (0, defaults_ts_1.emptyData)();
    const s = data.settings;
    s.onboarded = true;
    s.hourValue = (0, money_ts_1.uah)(150);
    s.canteenPrice = (0, money_ts_1.uah)(170);
    s.publicFare = (0, money_ts_1.uah)(30);
    s.joyBudget = (0, money_ts_1.uah)(150);
    const dom = (k) => (0, time_ts_1.ymd)(k).d;
    s.budget = {
        incomes: [{ id: 'demo-inc', name: 'Зарплата (приклад)', amount: (0, money_ts_1.uah)(25_000), day: dom((0, time_ts_1.addDays)(today, 8)) }],
        obligations: [
            { id: 'demo-rent', name: 'Оренда (приклад)', kind: 'rent', amount: (0, money_ts_1.uah)(9_000), day: dom((0, time_ts_1.addDays)(today, 12)) },
            { id: 'demo-util', name: 'Комунальні (приклад)', kind: 'utilities', amount: (0, money_ts_1.uah)(1_800), day: dom((0, time_ts_1.addDays)(today, 5)) },
            { id: 'demo-credit', name: 'Розстрочка (приклад)', kind: 'credit', amount: (0, money_ts_1.uah)(1_200), day: dom((0, time_ts_1.addDays)(today, 10)) },
        ],
        balance: { amount: (0, money_ts_1.uah)(12_000), date: today },
        savingsStart: (0, money_ts_1.uah)(7_000),
        buffer: (0, money_ts_1.uah)(1_000),
        monthlyGoal: (0, money_ts_1.uah)(3_000),
        dailyEstimate: (0, money_ts_1.uah)(650),
        flexTransport: (0, money_ts_1.uah)(1_800),
        flexGroceries: (0, money_ts_1.uah)(6_000),
    };
    s.calendar.stays = [{ id: 'demo-stay', from: (0, time_ts_1.addDays)(today, -13), to: (0, time_ts_1.addDays)(today, 16), label: 'Навчання у Дніпрі (приклад)' }];
    data.goals = [
        { id: 'demo-goal-reserve', name: 'Резерв', kind: 'reserve', target: (0, money_ts_1.uah)(10_000), start: (0, money_ts_1.uah)(2_000), createdAt: now - 20 * 86_400_000 },
        { id: 'demo-goal-cushion', name: 'Фінансова подушка', kind: 'cushion', target: (0, money_ts_1.uah)(30_000), start: (0, money_ts_1.uah)(5_000), createdAt: now - 20 * 86_400_000 },
    ];
    const ops = [];
    const days = {};
    let n = 0;
    const id = () => `demo-${++n}`;
    const at = (date, hh, mm) => (0, time_ts_1.msAtKyiv)(date, hh, mm);
    const route = (dir) => (dir === 'there' ? 'Дім → Навчання' : dir === 'back' ? 'Навчання → Дім' : 'Місто');
    const expense = (date, hh, mm, amount, category, extra = {}) => {
        ops.push({ id: id(), type: 'expense', date, time: at(date, hh, mm), amount, category, updatedAt: now, ...extra });
    };
    const trip = (date, hh, mm, mode, dir, cost, minutes, wait, comfort, line) => {
        const a = (0, transport_ts_1.tripAmounts)({ mode, cost, passengers: 1, split: false });
        expense(date, hh, mm, a.cash, 'transport', {
            title: (0, transport_ts_1.modeInfo)(mode).label,
            trip: { mode, dir, route: route(dir), minutes, wait, comfort, passengers: 1, split: false, full: a.full },
            ...(line ? { planLineId: line } : {}),
        });
    };
    const meal = (date, hh, mm, kind, amount, prepaid, line) => {
        const home = (0, meals_ts_1.isHomeMeal)(kind);
        if (home && prepaid) {
            ops.push({ id: id(), type: 'consumption', date, time: at(date, hh, mm), amount, category: 'lunch', title: (0, meals_ts_1.mealInfo)(kind).label, meal: { kind, prepaid: true }, updatedAt: now, ...(line ? { planLineId: line } : {}) });
        }
        else {
            expense(date, hh, mm, amount, home ? 'groceries' : 'lunch', { title: (0, meals_ts_1.mealInfo)(kind).label, meal: { kind, prepaid: false }, ...(line ? { planLineId: line } : {}) });
        }
    };
    const micro = (date, hh, mm, item, amount, line) => {
        const it = data.micro.find((m) => m.id === item);
        expense(date, hh, mm, amount, it.category, { micro: item, title: it.name, ...(line ? { planLineId: line } : {}) });
    };
    const save = (date, amount) => {
        ops.push({ id: id(), type: 'saving', date, time: at(date, 21, 10), amount, goalId: 'demo-goal-reserve', title: 'Переказ у накопичення', updatedAt: now });
    };
    const planOf = (tpl) => (0, defaults_ts_1.clone)(defaults_ts_1.TEMPLATES.find((t) => t.id === tpl).lines);
    const setDay = (date, tpl) => {
        days[date] = { date, plan: tpl ? planOf(tpl) : null, ...(tpl ? { planSource: 'template', templateId: tpl } : {}), closed: false, updatedAt: now };
    };
    setDay(today, 'tpl-study');
    trip(today, 8, 5, 'bus', 'there', (0, money_ts_1.uah)(30), 35, 7, 3, 's1');
    micro(today, 10, 30, 'q-coffee', (0, money_ts_1.uah)(60), 's2');
    meal(today, 13, 0, 'lunchBox', (0, money_ts_1.uah)(65), true, 's3');
    trip(today, 17, 40, 'bus', 'back', (0, money_ts_1.uah)(30), 40, 10, 3, 's4');
    expense(today, 18, 15, (0, money_ts_1.uah)(280), 'groceries', { title: 'Продукти на вечерю', planLineId: 's5' });
    micro(today, 18, 25, 'q-treat', (0, money_ts_1.uah)(60), 's6');
    const work = [
        (d) => { setDay(d, 'tpl-study'); trip(d, 8, 0, 'bus', 'there', (0, money_ts_1.uah)(30), 36, 6, 3, 's1'); micro(d, 10, 15, 'q-coffee', (0, money_ts_1.uah)(60), 's2'); meal(d, 13, 10, 'canteen', (0, money_ts_1.uah)(170), false, 's3'); trip(d, 17, 50, 'bus', 'back', (0, money_ts_1.uah)(30), 42, 8, 3, 's4'); expense(d, 18, 30, (0, money_ts_1.uah)(190), 'groceries', { title: 'Продукти', planLineId: 's5' }); micro(d, 18, 40, 'q-treat', (0, money_ts_1.uah)(45), 's6'); save(d, (0, money_ts_1.uah)(120)); },
        (d) => { setDay(d, 'tpl-study'); trip(d, 8, 10, 'bus', 'there', (0, money_ts_1.uah)(30), 35, 8, 3, 's1'); micro(d, 10, 20, 'q-coffee', (0, money_ts_1.uah)(60), 's2'); meal(d, 13, 0, 'lunchBox', (0, money_ts_1.uah)(70), true, 's3'); trip(d, 19, 20, 'taxi', 'back', (0, money_ts_1.uah)(210), 18, 4, 5, 's4'); expense(d, 19, 50, (0, money_ts_1.uah)(240), 'groceries', { title: 'Продукти', planLineId: 's5' }); micro(d, 20, 0, 'q-treat', (0, money_ts_1.uah)(50), 's6'); },
        (d) => { setDay(d, 'tpl-study'); trip(d, 7, 55, 'bus', 'there', (0, money_ts_1.uah)(30), 38, 9, 2, 's1'); micro(d, 9, 50, 'q-coffee', (0, money_ts_1.uah)(60), 's2'); micro(d, 15, 30, 'q-coffee', (0, money_ts_1.uah)(60)); meal(d, 13, 5, 'canteen', (0, money_ts_1.uah)(175), false, 's3'); trip(d, 17, 45, 'bus', 'back', (0, money_ts_1.uah)(30), 44, 12, 2, 's4'); expense(d, 18, 20, (0, money_ts_1.uah)(230), 'groceries', { title: 'Продукти', planLineId: 's5' }); micro(d, 18, 35, 'q-treat', (0, money_ts_1.uah)(90), 's6'); },
        (d) => { setDay(d, 'tpl-study'); trip(d, 8, 5, 'bus', 'there', (0, money_ts_1.uah)(30), 34, 6, 3, 's1'); micro(d, 10, 0, 'q-coffee', (0, money_ts_1.uah)(60), 's2'); meal(d, 13, 0, 'lunchBox', (0, money_ts_1.uah)(60), true, 's3'); trip(d, 17, 35, 'bus', 'back', (0, money_ts_1.uah)(30), 39, 7, 3, 's4'); expense(d, 18, 10, (0, money_ts_1.uah)(180), 'groceries', { title: 'Продукти', planLineId: 's5' }); expense(d, 18, 30, (0, money_ts_1.uah)(120), 'household', { title: 'Засоби для прибирання' }); save(d, (0, money_ts_1.uah)(200)); },
        (d) => { setDay(d, 'tpl-study'); trip(d, 8, 0, 'bus', 'there', (0, money_ts_1.uah)(30), 37, 7, 3, 's1'); micro(d, 10, 10, 'q-coffee', (0, money_ts_1.uah)(60), 's2'); meal(d, 13, 20, 'canteen', (0, money_ts_1.uah)(180), false, 's3'); trip(d, 20, 30, 'taxi', 'back', (0, money_ts_1.uah)(190), 20, 5, 5, 's4'); expense(d, 20, 50, (0, money_ts_1.uah)(260), 'groceries', { title: 'Продукти', planLineId: 's5' }); micro(d, 21, 0, 'q-treat', (0, money_ts_1.uah)(40), 's6'); },
    ];
    const weekend = [
        (d) => { setDay(d, 'tpl-weekend'); expense(d, 11, 0, (0, money_ts_1.uah)(420), 'groceries', { title: 'Продукти', planLineId: 'w1' }); expense(d, 16, 0, (0, money_ts_1.uah)(250), 'other', { title: 'Відпочинок', planLineId: 'w2' }); expense(d, 18, 0, (0, money_ts_1.uah)(180), 'household', { title: 'Сімейні витрати', planLineId: 'w3' }); save(d, (0, money_ts_1.uah)(150)); },
        (d) => { setDay(d, 'tpl-weekend'); expense(d, 10, 30, (0, money_ts_1.uah)(520), 'groceries', { title: 'Продукти', planLineId: 'w1' }); expense(d, 15, 0, (0, money_ts_1.uah)(380), 'other', { title: 'Відпочинок', planLineId: 'w2' }); expense(d, 19, 0, (0, money_ts_1.uah)(160), 'household', { title: 'Сімейні витрати', planLineId: 'w3' }); },
    ];
    let w = 0;
    let e = 0;
    let noSpendDone = false;
    for (let i = 1; i <= 13; i++) {
        const d = (0, time_ts_1.addDays)(today, -i);
        if (i === 4)
            continue;
        if (!(0, calendar_ts_1.isWorkday)(d, s.calendar)) {
            if (!noSpendDone && i >= 2) {
                noSpendDone = true;
                days[d] = { date: d, plan: null, closed: true, closedAt: at(d, 21, 0), updatedAt: now };
                continue;
            }
            weekend[e++ % weekend.length](d);
        }
        else {
            work[w++ % work.length](d);
        }
        if (i !== 1)
            days[d] = { ...days[d], closed: true, closedAt: at(d, 21, 0) };
    }
    data.ops = ops;
    data.days = days;
    for (const rec of Object.values(days)) {
        if (rec.closed)
            data.days[rec.date] = { ...rec, advice: (0, mentor_ts_1.adviceFor)(data, rec.date, today, rec.closedAt ?? now) };
    }
    for (const h of (0, habits_ts_1.newlyDone)(data, today))
        data.habits[h.id] = now;
    return data;
}
};

// ── backup.ts
defs["backup.js"] = function (require, exports, module) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BACKUP_VERSION = exports.BACKUP_FORMAT = void 0;
exports.makeBackup = makeBackup;
exports.normalizeSettings = normalizeSettings;
exports.validateBackup = validateBackup;
exports.fingerprint = fingerprint;
exports.mergeData = mergeData;
exports.previewMerge = previewMerge;
exports.opsCSV = opsCSV;
exports.daysCSV = daysCSV;
const defaults_ts_1 = require("./defaults.js");
const actions_ts_1 = require("./actions.js");
const money_ts_1 = require("./money.js");
const time_ts_1 = require("./time.js");
const ledger_ts_1 = require("./ledger.js");
const transport_ts_1 = require("./transport.js");
const meals_ts_1 = require("./meals.js");
const defaults_ts_2 = require("./defaults.js");
exports.BACKUP_FORMAT = 'den-365-backup';
exports.BACKUP_VERSION = 1;
function makeBackup(data, demo, now = Date.now()) {
    return {
        format: exports.BACKUP_FORMAT,
        version: exports.BACKUP_VERSION,
        app: 'ДЕНЬ × 365',
        exportedAt: now,
        exportedAtKyiv: (0, time_ts_1.stamp)(now),
        demo,
        data: (0, defaults_ts_1.clone)(data),
    };
}
const isObj = (v) => typeof v === 'object' && v !== null && !Array.isArray(v);
const isKop = (v) => typeof v === 'number' && Number.isSafeInteger(v) && v >= 0 && v <= money_ts_1.MAX_KOP;
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const str = (v, max = 200) => (typeof v === 'string' ? v.slice(0, max) : undefined);
const NEC = ['required', 'flexible', 'optional', 'unexpected'];
const MODES = ['bus', 'tram', 'trolley', 'metro', 'taxi', 'car', 'walk', 'combo'];
const MEALS = ['breakfastHome', 'lunchBox', 'canteen', 'cafe', 'fastfood', 'readyFood', 'delivery', 'dinnerHome', 'otherMeal'];
function cleanOp(raw) {
    if (!isObj(raw))
        return null;
    const id = str(raw.id, 80);
    const type = raw.type;
    if (!id || typeof type !== 'string' || !actions_ts_1.OP_TYPES.includes(type))
        return null;
    if (!(0, time_ts_1.isDateKey)(raw.date) || !isKop(raw.amount) || !isNum(raw.time))
        return null;
    const op = {
        id,
        type: type,
        date: raw.date,
        time: raw.time,
        amount: raw.amount,
        updatedAt: isNum(raw.updatedAt) ? raw.updatedAt : raw.time,
    };
    if (isKop(raw.estimate))
        op.estimate = raw.estimate;
    for (const k of ['category', 'title', 'note', 'micro', 'refundOf', 'obligationId', 'goalId', 'planLineId']) {
        const v = str(raw[k], k === 'note' ? 500 : 120);
        if (v !== undefined)
            op[k] = v;
    }
    if (typeof raw.necessity === 'string' && NEC.includes(raw.necessity))
        op.necessity = raw.necessity;
    if (isNum(raw.deletedAt))
        op.deletedAt = raw.deletedAt;
    if (isObj(raw.trip) && typeof raw.trip.mode === 'string' && MODES.includes(raw.trip.mode)) {
        const t = raw.trip;
        op.trip = {
            mode: t.mode,
            dir: t.dir === 'there' || t.dir === 'back' ? t.dir : 'other',
            route: str(t.route, 120) ?? '',
            minutes: isNum(t.minutes) ? t.minutes : null,
            wait: isNum(t.wait) ? t.wait : null,
            comfort: isNum(t.comfort) ? t.comfort : null,
            passengers: isNum(t.passengers) && t.passengers >= 1 ? Math.floor(t.passengers) : 1,
            split: t.split === true,
            full: isKop(t.full) ? t.full : op.amount + (op.estimate ?? 0),
        };
        if (isObj(t.car)) {
            const c = t.car;
            op.trip.car = {
                km: isNum(c.km) ? c.km : 0,
                per100: isNum(c.per100) ? c.per100 : 0,
                fuelPrice: isKop(c.fuelPrice) ? c.fuelPrice : 0,
                parking: isKop(c.parking) ? c.parking : 0,
                wearPerKm: isKop(c.wearPerKm) ? c.wearPerKm : 0,
                other: isKop(c.other) ? c.other : 0,
                fuelPrepaid: c.fuelPrepaid === true,
            };
        }
    }
    if (isObj(raw.meal) && typeof raw.meal.kind === 'string' && MEALS.includes(raw.meal.kind)) {
        op.meal = { kind: raw.meal.kind, prepaid: raw.meal.prepaid === true };
    }
    return op;
}
function cleanLines(raw) {
    if (!Array.isArray(raw))
        return null;
    const out = [];
    for (const l of raw) {
        if (!isObj(l) || !isKop(l.amount))
            continue;
        out.push({ id: str(l.id, 80) ?? `l${out.length}`, label: str(l.label, 120) ?? '', category: str(l.category, 80) ?? 'other', amount: l.amount });
    }
    return out;
}
function cleanAdvice(raw) {
    if (!isObj(raw) || typeof raw.why !== 'string' || typeof raw.step !== 'string')
        return null;
    return {
        ruleId: str(raw.ruleId, 60) ?? 'imported',
        author: str(raw.author, 80) ?? '',
        authorGen: str(raw.authorGen, 80) ?? str(raw.author, 80) ?? '',
        principle: str(raw.principle, 160) ?? '',
        why: raw.why.slice(0, 600),
        step: raw.step.slice(0, 600),
        effect: str(raw.effect, 400) ?? null,
        effectKop: isNum(raw.effectKop) ? raw.effectKop : null,
        tone: raw.tone === 'positive' || raw.tone === 'care' ? raw.tone : 'calm',
        createdAt: isNum(raw.createdAt) ? raw.createdAt : 0,
    };
}
function cleanDay(raw) {
    if (!isObj(raw) || !(0, time_ts_1.isDateKey)(raw.date))
        return null;
    const rec = {
        date: raw.date,
        plan: cleanLines(raw.plan),
        closed: raw.closed === true,
        updatedAt: isNum(raw.updatedAt) ? raw.updatedAt : 0,
    };
    if (rec.plan && !rec.plan.length)
        rec.plan = null;
    if (raw.planSource === 'manual' || raw.planSource === 'template' || raw.planSource === 'auto')
        rec.planSource = raw.planSource;
    const tid = str(raw.templateId, 80);
    if (tid)
        rec.templateId = tid;
    if (isNum(raw.closedAt))
        rec.closedAt = raw.closedAt;
    const adv = cleanAdvice(raw.advice);
    if (adv)
        rec.advice = adv;
    return rec;
}
function normalizeSettings(raw) {
    const base = (0, defaults_ts_1.defaultSettings)();
    if (!isObj(raw))
        return base;
    const out = { ...base };
    if (raw.theme === 'light' || raw.theme === 'dark' || raw.theme === 'system')
        out.theme = raw.theme;
    out.onboarded = raw.onboarded === true;
    for (const k of ['hourValue', 'canteenPrice', 'publicFare', 'joyBudget'])
        out[k] = isKop(raw[k]) ? raw[k] : null;
    if (isObj(raw.autoPlan))
        out.autoPlan = { work: str(raw.autoPlan.work, 80) ?? null, off: str(raw.autoPlan.off, 80) ?? null };
    out.forecastStayOnly = raw.forecastStayOnly === true;
    if (isObj(raw.calendar)) {
        const c = raw.calendar;
        const wd = Array.isArray(c.workdays) && c.workdays.length === 7 ? c.workdays.map((v) => v === true) : base.calendar.workdays;
        const overrides = {};
        if (isObj(c.overrides))
            for (const [k, v] of Object.entries(c.overrides))
                if ((0, time_ts_1.isDateKey)(k) && (v === 'work' || v === 'off'))
                    overrides[k] = v;
        const stays = Array.isArray(c.stays)
            ? c.stays.filter((s) => isObj(s) && (0, time_ts_1.isDateKey)(s.from) && (0, time_ts_1.isDateKey)(s.to)).map((s, i) => ({ id: str(s.id, 80) ?? `stay${i}`, from: s.from, to: s.to, label: str(s.label, 80) ?? '' }))
            : [];
        out.calendar = { workdays: wd, overrides, stays };
    }
    if (isObj(raw.budget)) {
        const b = raw.budget;
        const day = (v) => (isNum(v) && v >= 1 && v <= 31 ? Math.floor(v) : 1);
        out.budget = {
            incomes: Array.isArray(b.incomes) ? b.incomes.filter(isObj).filter((i) => isKop(i.amount)).map((i, n) => ({ id: str(i.id, 80) ?? `inc${n}`, name: str(i.name, 80) ?? 'Дохід', amount: i.amount, day: day(i.day) })) : [],
            obligations: Array.isArray(b.obligations)
                ? b.obligations.filter(isObj).filter((o) => isKop(o.amount)).map((o, n) => ({
                    id: str(o.id, 80) ?? `obl${n}`,
                    name: str(o.name, 80) ?? 'Платіж',
                    kind: o.kind === 'rent' || o.kind === 'utilities' || o.kind === 'credit' ? o.kind : 'other',
                    amount: o.amount,
                    day: day(o.day),
                }))
                : [],
            balance: isObj(b.balance) && typeof b.balance.amount === 'number' && Number.isSafeInteger(b.balance.amount) && (0, time_ts_1.isDateKey)(b.balance.date) ? { amount: b.balance.amount, date: b.balance.date } : null,
            savingsStart: isKop(b.savingsStart) ? b.savingsStart : 0,
            buffer: isKop(b.buffer) ? b.buffer : 0,
            monthlyGoal: isKop(b.monthlyGoal) ? b.monthlyGoal : null,
            dailyEstimate: isKop(b.dailyEstimate) ? b.dailyEstimate : null,
            flexTransport: isKop(b.flexTransport) ? b.flexTransport : null,
            flexGroceries: isKop(b.flexGroceries) ? b.flexGroceries : null,
        };
    }
    return out;
}
function cleanList(raw, fallback, pick) {
    if (!Array.isArray(raw))
        return (0, defaults_ts_1.clone)(fallback);
    const out = [];
    for (const r of raw) {
        if (!isObj(r))
            continue;
        const v = pick(r);
        if (v)
            out.push(v);
    }
    return out;
}
function validateBackup(raw) {
    if (!isObj(raw))
        return { ok: false, errors: ['Файл не є резервною копією ДЕНЬ × 365.'] };
    if (raw.format !== exports.BACKUP_FORMAT)
        return { ok: false, errors: ['Невідомий формат файлу — очікується резервна копія ДЕНЬ × 365.'] };
    if (!isNum(raw.version) || raw.version > exports.BACKUP_VERSION)
        return { ok: false, errors: ['Копію створено новішою версією застосунку. Онови застосунок і спробуй ще раз.'] };
    const d = raw.data;
    if (!isObj(d) || !Array.isArray(d.ops))
        return { ok: false, errors: ['У файлі немає списку операцій.'] };
    const warnings = [];
    const ops = [];
    const seen = new Set();
    let bad = 0;
    let dup = 0;
    for (const r of d.ops) {
        const op = cleanOp(r);
        if (!op) {
            bad++;
            continue;
        }
        if (seen.has(op.id)) {
            dup++;
            continue;
        }
        seen.add(op.id);
        ops.push(op);
    }
    if (bad)
        warnings.push(`Пропущено пошкоджених записів: ${bad}.`);
    if (dup)
        warnings.push(`Пропущено повторів усередині файлу: ${dup}.`);
    const days = {};
    const rawDays = Array.isArray(d.days) ? d.days : isObj(d.days) ? Object.values(d.days) : [];
    for (const r of rawDays) {
        const rec = cleanDay(r);
        if (rec)
            days[rec.date] = rec;
    }
    const categories = cleanList(d.categories, defaults_ts_1.CATEGORIES, (c) => (typeof c.id === 'string' && typeof c.name === 'string'
        ? {
            id: c.id.slice(0, 80), name: c.name.slice(0, 60), icon: str(c.icon, 40) ?? 'box', color: str(c.color, 20) ?? '#76808C',
            necessity: typeof c.necessity === 'string' && NEC.includes(c.necessity) ? c.necessity : 'flexible',
            micro: c.micro === true, hidden: c.hidden === true, builtin: c.builtin === true,
        }
        : null));
    for (const b of defaults_ts_1.CATEGORIES)
        if (!categories.some((c) => c.id === b.id))
            categories.push((0, defaults_ts_1.clone)(b));
    const templates = cleanList(d.templates, defaults_ts_1.TEMPLATES, (t) => (typeof t.id === 'string' && typeof t.name === 'string'
        ? { id: t.id.slice(0, 80), name: t.name.slice(0, 80), lines: cleanLines(t.lines) ?? [], builtin: t.builtin === true }
        : null));
    const goals = cleanList(d.goals, [], (g) => (typeof g.id === 'string' && typeof g.name === 'string' && isKop(g.target)
        ? {
            id: g.id.slice(0, 80), name: g.name.slice(0, 80),
            kind: g.kind === 'reserve' || g.kind === 'cushion' || g.kind === 'car' || g.kind === 'vacation' ? g.kind : 'custom',
            target: g.target, start: isKop(g.start) ? g.start : 0, createdAt: isNum(g.createdAt) ? g.createdAt : 0,
        }
        : null));
    const micro = cleanList(d.micro, defaults_ts_1.MICRO, (m) => (typeof m.id === 'string' && typeof m.name === 'string'
        ? { id: m.id.slice(0, 80), name: m.name.slice(0, 60), category: str(m.category, 80) ?? 'treats', icon: str(m.icon, 40) ?? 'box', price: isKop(m.price) ? m.price : null, quick: m.quick === true }
        : null));
    const habits = {};
    if (isObj(d.habits))
        for (const [k, v] of Object.entries(d.habits))
            if (isNum(v))
                habits[k] = v;
    return {
        ok: true,
        demo: raw.demo === true,
        warnings,
        data: { ops, days, settings: normalizeSettings(d.settings), categories, templates, goals, micro, habits },
    };
}
function fingerprint(o) {
    return [o.date, o.type, o.amount, o.category ?? '', o.time, o.title ?? ''].join('|');
}
function mergeData(cur, inc) {
    const stats = { added: 0, updated: 0, duplicates: 0, daysAdded: 0, daysUpdated: 0 };
    const byId = new Map(cur.ops.map((o) => [o.id, o]));
    const prints = new Set(cur.ops.map(fingerprint));
    for (const o of inc.ops) {
        const ex = byId.get(o.id);
        if (ex) {
            if (o.updatedAt > ex.updatedAt) {
                byId.set(o.id, o);
                stats.updated++;
            }
            else
                stats.duplicates++;
            continue;
        }
        const fp = fingerprint(o);
        if (prints.has(fp)) {
            stats.duplicates++;
            continue;
        }
        prints.add(fp);
        byId.set(o.id, o);
        stats.added++;
    }
    const days = { ...cur.days };
    for (const [date, r] of Object.entries(inc.days)) {
        const ex = days[date];
        if (!ex) {
            days[date] = r;
            stats.daysAdded++;
        }
        else if (r.updatedAt > ex.updatedAt) {
            days[date] = r;
            stats.daysUpdated++;
        }
    }
    const addMissing = (a, b) => [...a, ...b.filter((x) => !a.some((y) => y.id === x.id))];
    const habits = { ...inc.habits, ...cur.habits };
    return {
        data: {
            ops: [...byId.values()],
            days,
            settings: cur.settings,
            categories: addMissing(cur.categories, inc.categories),
            templates: addMissing(cur.templates, inc.templates),
            goals: addMissing(cur.goals, inc.goals),
            micro: addMissing(cur.micro, inc.micro),
            habits,
        },
        stats,
    };
}
function previewMerge(cur, inc) {
    return mergeData(cur, inc).stats;
}
const TYPE_LABEL = {
    expense: 'Витрата',
    income: 'Дохід',
    refund: 'Повернення',
    saving: 'У накопичення',
    withdrawal: 'З накопичень',
    transfer: 'Переказ між рахунками',
    consumption: 'Собівартість (не рух грошей)',
};
function cell(v) {
    if (v === null || v === undefined)
        return '';
    let s = String(v);
    if (typeof v === 'string' && /^[=+\-@]/.test(s))
        s = "'" + s;
    return /[;"\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
function money(k) {
    if (k === undefined)
        return '';
    const neg = k < 0;
    const a = Math.abs(k);
    return `${neg ? '-' : ''}${Math.floor(a / 100)},${String(a % 100).padStart(2, '0')}`;
}
function opsCSV(data) {
    const cats = (0, ledger_ts_1.catMap)(data.categories);
    const head = ['Дата', 'Час', 'Тип', 'Категорія', 'Назва', 'Сума, грн', 'Розрахункова частина, грн', 'Необхідність', 'Транспорт', 'Напрямок', 'Маршрут', 'Хвилин у дорозі', 'Пасажири', 'Харчування', 'Примітка'];
    const rows = data.ops
        .filter((o) => !o.deletedAt)
        .sort((a, b) => (a.date === b.date ? a.time - b.time : a.date < b.date ? -1 : 1))
        .map((o) => [
        o.date,
        (0, time_ts_1.timeHM)(o.time),
        TYPE_LABEL[o.type],
        o.category ? cats.get(o.category)?.name ?? o.category : '',
        o.title ?? '',
        money(o.amount),
        o.estimate ? money(o.estimate) : '',
        o.type === 'expense' ? defaults_ts_2.NECESSITY[o.necessity ?? cats.get(o.category ?? '')?.necessity ?? 'flexible'].label : '',
        o.trip ? (0, transport_ts_1.modeInfo)(o.trip.mode).label : '',
        o.trip ? (o.trip.dir === 'there' ? 'Туди' : o.trip.dir === 'back' ? 'Назад' : 'Інша') : '',
        o.trip?.route ?? '',
        o.trip?.minutes ?? '',
        o.trip?.passengers ?? '',
        o.meal ? (0, meals_ts_1.mealInfo)(o.meal.kind).label + (o.meal.prepaid ? ' (продукти вже куплені)' : '') : '',
        o.note ?? '',
    ].map(cell).join(';'));
    return '﻿' + [head.join(';'), ...rows].join('\r\n') + '\r\n';
}
function daysCSV(data, today) {
    const ix = (0, ledger_ts_1.buildIndex)(data.ops);
    const cats = (0, ledger_ts_1.catMap)(data.categories);
    const dates = new Set([...Object.keys(data.days), ...ix.byDate.keys()]);
    const head = ['Дата', 'Статус', 'План, грн', 'Витрачено, грн', 'План − факт, грн', 'Обовʼязкові платежі, грн', 'Відкладено, грн', 'Собівартість харчування, грн'];
    const label = { closed: 'Завершено', recorded: 'Є записи', open: 'Сьогодні', missing: 'Немає даних', future: 'Майбутній' };
    const rows = [...dates].filter((d) => d <= today).sort().map((d) => {
        const c = (0, ledger_ts_1.calcDay)(ix, d, data.days[d], cats);
        const st = (0, ledger_ts_1.dayStatus)(d, today, data.days[d], c.hasData);
        return [d, label[st], c.plan ? money(c.planTotal) : '', money(c.spent), c.plan ? money(c.planTotal - c.spent) : '', money(c.bills), money(c.saved), money(c.foodCost)].map(cell).join(';');
    });
    return '﻿' + [head.join(';'), ...rows].join('\r\n') + '\r\n';
}
};

// ── store.ts
defs["store.js"] = function (require, exports, module) {
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getState = getState;
exports.subscribe = subscribe;
exports.onHabits = onHabits;
exports.initStore = initStore;
exports.addOperation = addOperation;
exports.updateOperation = updateOperation;
exports.deleteOperation = deleteOperation;
exports.restoreOperation = restoreOperation;
exports.purgeOperation = purgeOperation;
exports.setDayPlan = setDayPlan;
exports.closeDayAction = closeDayAction;
exports.reopenDayAction = reopenDayAction;
exports.saveSettings = saveSettings;
exports.saveList = saveList;
exports.ensureToday = ensureToday;
exports.exportBackup = exportBackup;
exports.importData = importData;
exports.restorePrevious = restorePrevious;
exports.resetAll = resetAll;
exports.setDemoMode = setDemoMode;
const A = __importStar(require("./actions.js"));
const db_ts_1 = require("./db.js");
const defaults_ts_1 = require("./defaults.js");
const demo_ts_1 = require("./demo.js");
const backup_ts_1 = require("./backup.js");
const calendar_ts_1 = require("./calendar.js");
const time_ts_1 = require("./time.js");
let state = { ready: false, demo: false, backend: 'memory', data: (0, defaults_ts_1.emptyData)(), prevBackup: null, error: null };
let backend = null;
const listeners = new Set();
let habitListener = () => { };
function getState() {
    return state;
}
function subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
}
function onHabits(fn) {
    habitListener = fn;
}
function emit() {
    for (const fn of listeners)
        fn();
}
const MODE_KEY = 'den365:mode';
function readMode() {
    try {
        return globalThis.localStorage?.getItem(MODE_KEY) === 'demo' ? 'demo' : 'main';
    }
    catch {
        return 'main';
    }
}
function writeMode(m) {
    try {
        globalThis.localStorage?.setItem(MODE_KEY, m);
    }
    catch {
    }
}
const dbName = (demo) => (demo ? 'den365-demo' : 'den365');
function withBuiltins(list, builtins) {
    const base = Array.isArray(list) && list.length ? list : (0, defaults_ts_1.clone)(builtins);
    return [...base, ...builtins.filter((b) => !base.some((x) => x.id === b.id)).map(defaults_ts_1.clone)];
}
function fromSnapshot(s) {
    const kv = s.kv;
    return {
        ops: s.ops,
        days: Object.fromEntries(s.days.map((d) => [d.date, d])),
        settings: (0, backup_ts_1.normalizeSettings)(kv.settings),
        categories: withBuiltins(kv.categories, defaults_ts_1.CATEGORIES),
        templates: Array.isArray(kv.templates) ? kv.templates : (0, defaults_ts_1.clone)(defaults_ts_1.TEMPLATES),
        goals: Array.isArray(kv.goals) ? kv.goals : [],
        micro: Array.isArray(kv.micro) ? kv.micro : (0, defaults_ts_1.clone)(defaults_ts_1.MICRO),
        habits: kv.habits ?? {},
    };
}
function toSnapshot(d) {
    return {
        ops: d.ops,
        days: Object.values(d.days),
        kv: { settings: d.settings, categories: d.categories, templates: d.templates, goals: d.goals, micro: d.micro, habits: d.habits },
    };
}
async function load(demo, freshDemo) {
    backend = await (0, db_ts_1.openBackend)(dbName(demo));
    let snap = await backend.load();
    if (demo && (freshDemo || !snap.ops.length)) {
        snap = toSnapshot((0, demo_ts_1.buildDemo)((0, time_ts_1.todayKey)()));
        await backend.replace(snap);
    }
    const prev = (await backend.getBackup());
    state = {
        ready: true,
        demo,
        backend: backend.kind,
        data: fromSnapshot(snap),
        prevBackup: prev?.data ? { at: prev.at, ops: prev.data.ops.length } : null,
        error: null,
    };
    emit();
}
async function initStore() {
    await load(readMode() === 'demo', false);
    ensureToday();
}
function fail(e) {
    console.error(e);
    state = { ...state, error: 'Не вдалося зберегти зміни на пристрої. Зроби резервну копію в налаштуваннях.' };
    emit();
}
function commit(r) {
    state = { ...state, data: r.data, error: null };
    emit();
    backend?.apply(r.change).catch(fail);
    if (r.habits?.length)
        habitListener(r.habits);
}
const today = () => (0, time_ts_1.todayKey)();
function addOperation(input) {
    const r = A.addOp(state.data, input, today());
    commit(r);
    return r.value;
}
function updateOperation(id, patch) {
    const r = A.updateOp(state.data, id, patch, today());
    commit(r);
    return r.value;
}
function deleteOperation(id) {
    commit(A.deleteOp(state.data, id, today()));
}
function restoreOperation(id) {
    commit(A.restoreOp(state.data, id, today()));
}
function purgeOperation(id) {
    commit(A.purgeOp(state.data, id, today()));
}
function setDayPlan(date, lines, source, templateId) {
    commit(A.setPlan(state.data, date, lines, source, today(), Date.now(), templateId));
}
function closeDayAction(date) {
    const r = A.closeDay(state.data, date, today());
    commit(r);
    return r.value;
}
function reopenDayAction(date) {
    commit(A.reopenDay(state.data, date));
}
function saveSettings(fn) {
    const settings = fn((0, defaults_ts_1.clone)(state.data.settings));
    commit({ data: { ...state.data, settings }, change: { kv: { settings } } });
}
function saveList(key, list) {
    const data = { ...state.data, [key]: list };
    const r = A.settle(data, [], today(), Date.now());
    commit({ data: r.data, change: { kv: { [key]: list, ...(r.change.kv ?? {}) } }, habits: r.habits });
}
function ensureToday() {
    const t = today();
    const d = state.data;
    if (d.days[t])
        return;
    const tplId = (0, calendar_ts_1.isWorkday)(t, d.settings.calendar) ? d.settings.autoPlan.work : d.settings.autoPlan.off;
    const tpl = tplId ? d.templates.find((x) => x.id === tplId) : undefined;
    if (tpl && tpl.lines.length)
        setDayPlan(t, (0, defaults_ts_1.clone)(tpl.lines), 'auto', tpl.id);
}
function exportBackup() {
    return (0, backup_ts_1.makeBackup)(state.data, state.demo);
}
async function savePrevious() {
    if (!backend)
        return;
    const at = Date.now();
    await backend.setBackup({ at, data: state.data });
    state = { ...state, prevBackup: { at, ops: state.data.ops.length } };
}
async function replaceAll(data) {
    if (!backend)
        return;
    await backend.replace(toSnapshot(data));
    state = { ...state, data, error: null };
    emit();
}
async function importData(incoming, mode) {
    await savePrevious();
    if (mode === 'replace') {
        await replaceAll({ ...incoming, settings: { ...incoming.settings, onboarded: true } });
        return null;
    }
    const r = (0, backup_ts_1.mergeData)(state.data, incoming);
    await replaceAll(r.data);
    return r.stats;
}
async function restorePrevious() {
    if (!backend)
        return false;
    const prev = (await backend.getBackup());
    if (!prev?.data)
        return false;
    await savePrevious();
    await replaceAll(prev.data);
    return true;
}
async function resetAll() {
    await savePrevious();
    const fresh = (0, defaults_ts_1.emptyData)();
    fresh.settings.theme = state.data.settings.theme;
    await replaceAll(fresh);
}
async function setDemoMode(on) {
    writeMode(on ? 'demo' : 'main');
    await load(on, on);
    ensureToday();
}
};

// ── view.ts
defs["view.js"] = function (require, exports, module) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ui = void 0;
exports.setRenderer = setRenderer;
exports.rerender = rerender;
exports.setUI = setUI;
exports.go = go;
exports.derived = derived;
exports.catOf = catOf;
const ledger_ts_1 = require("./ledger.js");
const store_ts_1 = require("./store.js");
const time_ts_1 = require("./time.js");
exports.ui = {
    tab: 'day',
    dayDate: null,
    addMode: 'expense',
    addPreset: null,
    statsTab: 'overview',
    period: '30d',
    customFrom: '',
    customTo: '',
    histQuery: '',
    histType: 'all',
    showTrash: false,
    futureTab: 'forecast',
    scenario: 'base',
    whatIf: { taxi: 0, homeLunch: 0, coffee: 0, treatsPct: 0 },
    settingsPage: null,
    dismissed: {},
};
let renderer = () => { };
function setRenderer(fn) {
    renderer = fn;
}
function rerender() {
    renderer();
}
function setUI(patch) {
    Object.assign(exports.ui, patch);
    rerender();
}
function go(tab, patch = {}) {
    Object.assign(exports.ui, patch, { tab });
    if (location.hash !== '#' + tab)
        history.replaceState(null, '', '#' + tab);
    window.scrollTo(0, 0);
    rerender();
}
let memoData = null;
let memoIx = (0, ledger_ts_1.buildIndex)([]);
let memoCats = new Map();
function derived() {
    const state = (0, store_ts_1.getState)();
    if (state.data !== memoData) {
        memoData = state.data;
        memoIx = (0, ledger_ts_1.buildIndex)(state.data.ops);
        memoCats = (0, ledger_ts_1.catMap)(state.data.categories);
    }
    return { state, data: state.data, ix: memoIx, cats: memoCats, today: (0, time_ts_1.todayKey)() };
}
function catOf(cats, id) {
    return cats.get(id ?? 'other') ?? cats.get('other') ?? { id: 'other', name: 'Інші витрати', icon: 'box', color: '#76808C', necessity: 'unexpected', micro: false };
}
};

// ── forms.tsx
defs["forms.js"] = function (require, exports, module) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseForm = ExpenseForm;
exports.TripForm = TripForm;
exports.MealForm = MealForm;
exports.MoreForm = MoreForm;
exports.addedToast = addedToast;
exports.openQuickAdd = openQuickAdd;
exports.openOpEditor = openOpEditor;
exports.quickMicro = quickMicro;
exports.recordPlanLine = recordPlanLine;
exports.confirmDeleteForever = confirmDeleteForever;
exports.OpRow = OpRow;
exports.CatBadge = CatBadge;
const dom_ts_1 = require("./dom.js");
const icons_ts_1 = require("./icons.js");
const ui_tsx_1 = require("./ui.js");
const store_ts_1 = require("./store.js");
const view_ts_1 = require("./view.js");
const defaults_ts_1 = require("./defaults.js");
const transport_ts_1 = require("./transport.js");
const meals_ts_1 = require("./meals.js");
const budget_ts_1 = require("./budget.js");
const ledger_ts_1 = require("./ledger.js");
const goals_ts_1 = require("./goals.js");
const calendar_ts_1 = require("./calendar.js");
const money_ts_1 = require("./money.js");
const time_ts_1 = require("./time.js");
function saveOrUpdate(initial, input) {
    try {
        if (initial) {
            const patch = { ...input };
            for (const k of ['category', 'title', 'note', 'necessity', 'micro', 'trip', 'meal', 'refundOf', 'obligationId', 'goalId', 'estimate']) {
                if (!(k in input))
                    patch[k] = undefined;
            }
            return (0, store_ts_1.updateOperation)(initial.id, patch);
        }
        return (0, store_ts_1.addOperation)(input);
    }
    catch (e) {
        (0, ui_tsx_1.toast)(e instanceof Error ? e.message : 'Не вдалося зберегти.');
        return null;
    }
}
function DateRow(p) {
    const { today } = (0, view_ts_1.derived)();
    const rel = (0, time_ts_1.relLabel)(p.value, today);
    return ((0, dom_ts_1.h)("div", { class: "date-row" },
        (0, dom_ts_1.h)("span", { class: "date-row-label" },
            (0, icons_ts_1.icon)('calendar', 16),
            rel ? `${rel}, ${(0, time_ts_1.fmtDate)(p.value)}` : (0, time_ts_1.fmtDate)(p.value, { weekday: true })),
        (0, dom_ts_1.h)(ui_tsx_1.DateInput, { value: p.value, max: (0, time_ts_1.addDays)(today, 30), onChange: p.onChange, label: "\u0414\u0430\u0442\u0430 \u043E\u043F\u0435\u0440\u0430\u0446\u0456\u0457" })));
}
function DeleteBtn(p) {
    return ((0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "ghost", size: "lg", full: true, icon: "trash", onClick: () => {
            (0, store_ts_1.deleteOperation)(p.op.id);
            (0, ui_tsx_1.toast)('Запис видалено.', [{ label: 'Відновити', run: () => (0, store_ts_1.restoreOperation)(p.op.id) }]);
            p.done(null);
        } }, "\u0412\u0438\u0434\u0430\u043B\u0438\u0442\u0438 \u0437\u0430\u043F\u0438\u0441"));
}
function put(o, key, v) {
    if (v !== null && v !== undefined && v !== '')
        o[key] = v;
}
function ExpenseForm(p) {
    const { data } = (0, view_ts_1.derived)();
    const init = p.initial;
    const st = {
        date: init?.date ?? p.date,
        amount: (init?.amount ?? p.planLine?.amount ?? null),
        category: init?.category ?? p.planLine?.category ?? p.category ?? 'coffee',
        micro: init?.micro ?? p.micro,
        title: init?.title ?? p.planLine?.label ?? '',
        note: init?.note ?? '',
        necessity: (init?.necessity ?? null),
        obligationId: init?.obligationId ?? '',
        details: Boolean(init),
    };
    if (st.micro && st.amount === null) {
        const m = data.micro.find((x) => x.id === st.micro);
        if (m?.price)
            st.amount = m.price;
        if (m && !st.title)
            st.title = m.name;
    }
    const pad = (0, ui_tsx_1.makeAmountPad)({ initial: st.amount, onChange: (v) => { st.amount = v; } });
    const visibleCats = data.categories.filter((c) => !c.hidden);
    const pick = (0, dom_ts_1.live)(() => {
        const micros = data.micro.filter((m) => m.category === st.category);
        return ((0, dom_ts_1.h)(dom_ts_1.Fragment, null,
            (0, dom_ts_1.h)("div", { class: "cat-grid", role: "radiogroup", "aria-label": "\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0456\u044F" }, visibleCats.map((c) => ((0, dom_ts_1.h)("button", { type: "button", role: "radio", "aria-checked": c.id === st.category ? 'true' : 'false', class: (0, dom_ts_1.cx)('cat-pick', c.id === st.category && 'on'), style: `--c:${c.color}`, onClick: () => { st.category = c.id; st.micro = undefined; st.necessity = null; pick.refresh(); details.refresh(); } },
                (0, icons_ts_1.icon)(c.icon, 22),
                (0, dom_ts_1.h)("span", null, c.name))))),
            micros.length ? ((0, dom_ts_1.h)("div", { class: "chips chips-scroll", "aria-label": "\u0429\u043E \u0441\u0430\u043C\u0435" }, micros.map((m) => ((0, dom_ts_1.h)(ui_tsx_1.Chip, { on: st.micro === m.id, icon: m.icon, onClick: () => {
                    st.micro = st.micro === m.id ? undefined : m.id;
                    if (st.micro) {
                        st.title = m.name;
                        if (m.price) {
                            st.amount = m.price;
                            pad.set(m.price);
                        }
                    }
                    pick.refresh();
                    details.refresh();
                } },
                m.name,
                m.price ? ` · ${(0, money_ts_1.fmt)(m.price)}` : ''))))) : null));
    });
    const details = (0, dom_ts_1.live)(() => {
        const { cats } = (0, view_ts_1.derived)();
        const cat = (0, view_ts_1.catOf)(cats, st.category);
        const nec = st.necessity ?? cat.necessity;
        if (!st.details) {
            return (0, dom_ts_1.h)("button", { type: "button", class: "link-btn", onClick: () => { st.details = true; details.refresh(); } },
                (0, icons_ts_1.icon)('edit', 15),
                " \u041D\u0430\u0437\u0432\u0430, \u0442\u0438\u043F \u0432\u0438\u0442\u0440\u0430\u0442\u0438, \u043D\u043E\u0442\u0430\u0442\u043A\u0430, \u0434\u0430\u0442\u0430");
        }
        return ((0, dom_ts_1.h)("div", { class: "stack-sm" },
            (0, dom_ts_1.h)(ui_tsx_1.Field, { label: "\u041D\u0430\u0437\u0432\u0430 (\u043D\u0435\u043E\u0431\u043E\u0432\u02BC\u044F\u0437\u043A\u043E\u0432\u043E)" },
                (0, dom_ts_1.h)(ui_tsx_1.TextInput, { value: st.title, placeholder: cat.name, onChange: (v) => { st.title = v; } })),
            (0, dom_ts_1.h)(ui_tsx_1.Field, { label: "\u0422\u0438\u043F \u0432\u0438\u0442\u0440\u0430\u0442\u0438" },
                (0, dom_ts_1.h)(ui_tsx_1.Select, { value: nec, label: "\u0422\u0438\u043F \u0432\u0438\u0442\u0440\u0430\u0442\u0438", options: defaults_ts_1.NECESSITY_ORDER.map((n) => ({ value: n, label: defaults_ts_1.NECESSITY[n].label })), onChange: (v) => { st.necessity = v; } })),
            data.settings.budget.obligations.length ? ((0, dom_ts_1.h)(ui_tsx_1.Field, { label: "\u041E\u0431\u043E\u0432\u02BC\u044F\u0437\u043A\u043E\u0432\u0438\u0439 \u043F\u043B\u0430\u0442\u0456\u0436", hint: "\u041F\u043B\u0430\u0442\u0435\u0436\u0456 \u043D\u0435 \u0432\u0445\u043E\u0434\u044F\u0442\u044C \u0443 \u0434\u0435\u043D\u043D\u0438\u0439 \u0431\u044E\u0434\u0436\u0435\u0442 \u0456 \u0437\u043D\u0456\u043C\u0430\u044E\u0442\u044C \u0440\u0435\u0437\u0435\u0440\u0432 \u0443 \u0431\u044E\u0434\u0436\u0435\u0442\u0456." },
                (0, dom_ts_1.h)(ui_tsx_1.Select, { value: st.obligationId, label: "\u041E\u0431\u043E\u0432\u02BC\u044F\u0437\u043A\u043E\u0432\u0438\u0439 \u043F\u043B\u0430\u0442\u0456\u0436", options: [{ value: '', label: 'Ні' }, ...data.settings.budget.obligations.map((o) => ({ value: o.id, label: `${o.name} · ${(0, money_ts_1.fmt)(o.amount)}` }))], onChange: (v) => { st.obligationId = v; if (v) {
                        st.category = 'bills';
                        const o = data.settings.budget.obligations.find((x) => x.id === v);
                        if (o && !st.amount) {
                            st.amount = o.amount;
                            pad.set(o.amount);
                        }
                        pick.refresh();
                    } } }))) : null,
            (0, dom_ts_1.h)(ui_tsx_1.Field, { label: "\u041D\u043E\u0442\u0430\u0442\u043A\u0430" },
                (0, dom_ts_1.h)(ui_tsx_1.TextInput, { value: st.note, max: 300, placeholder: "\u041D\u0435\u043E\u0431\u043E\u0432\u02BC\u044F\u0437\u043A\u043E\u0432\u043E", onChange: (v) => { st.note = v; } })),
            (0, dom_ts_1.h)(DateRow, { value: st.date, onChange: (v) => { st.date = v; } })));
    });
    const save = () => {
        if (!st.amount || st.amount <= 0) {
            (0, ui_tsx_1.toast)('Вкажи суму більшу за нуль.');
            return;
        }
        const cat = (0, view_ts_1.catOf)((0, view_ts_1.derived)().cats, st.category);
        const input = { type: 'expense', date: st.date, amount: st.amount, category: st.category };
        put(input, 'title', st.title.trim());
        put(input, 'note', st.note.trim());
        put(input, 'necessity', st.necessity && st.necessity !== cat.necessity ? st.necessity : null);
        put(input, 'micro', st.micro);
        put(input, 'obligationId', st.obligationId);
        put(input, 'planLineId', init?.planLineId ?? p.planLine?.id);
        const op = saveOrUpdate(init, input);
        if (op)
            p.onDone(op);
    };
    return ((0, dom_ts_1.h)("div", { class: "form" },
        pad.display,
        pick.el,
        details.el,
        pad.keypad,
        (0, dom_ts_1.h)("div", { class: "form-actions" },
            (0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "primary", size: "lg", full: true, onClick: save }, init ? 'Зберегти зміни' : 'Зберегти витрату'),
            init ? (0, dom_ts_1.h)(DeleteBtn, { op: init, done: p.onDone }) : null)));
}
function lastCar() {
    const { ix } = (0, view_ts_1.derived)();
    const prev = [...ix.all].reverse().find((o) => o.trip?.car);
    const c = prev?.trip?.car;
    return { km: 0, per100: c?.per100 ?? 0, fuelPrice: c?.fuelPrice ?? 0, parking: 0, wearPerKm: c?.wearPerKm ?? 0, other: 0, fuelPrepaid: c?.fuelPrepaid ?? false };
}
function TripForm(p) {
    const { ix, data, today } = (0, view_ts_1.derived)();
    const init = p.initial;
    const t = init?.trip;
    const st = {
        date: init?.date ?? p.date,
        mode: (t?.mode ?? 'bus'),
        dir: (t?.dir ?? 'there'),
        route: t?.route ?? '',
        cost: (init && t?.mode !== 'car' ? (t?.split && t.passengers > 1 ? t.full : init.amount) : null),
        minutes: t?.minutes ?? null,
        wait: t?.wait ?? null,
        comfort: t?.comfort ?? null,
        passengers: t?.passengers ?? 1,
        split: t?.split ?? false,
        car: t?.car ? { ...t.car } : lastCar(),
        note: init?.note ?? '',
        why: false,
    };
    const routes = [...new Set([...ix.all].reverse().filter((o) => o.trip?.route).map((o) => o.trip.route))].slice(0, 6);
    const pub = (0, transport_ts_1.publicRef)(ix, data.settings, today);
    const summary = (0, dom_ts_1.live)(() => {
        const a = (0, transport_ts_1.tripAmounts)({ mode: st.mode, cost: st.cost ?? 0, passengers: st.passengers, split: st.split, car: st.mode === 'car' ? st.car : undefined });
        const lines = [];
        lines.push((0, dom_ts_1.h)("div", { class: "kv" },
            (0, dom_ts_1.h)("span", null, "\u041F\u043E\u0432\u043D\u0430 \u0432\u0430\u0440\u0442\u0456\u0441\u0442\u044C \u043F\u043E\u0457\u0437\u0434\u043A\u0438"),
            (0, dom_ts_1.h)("b", { class: "num" }, (0, money_ts_1.fmt)(a.full))));
        if (st.passengers > 1)
            lines.push((0, dom_ts_1.h)("div", { class: "kv" },
                (0, dom_ts_1.h)("span", null, st.split ? 'Твоя частка' : 'Ти платиш за всіх'),
                (0, dom_ts_1.h)("b", { class: "num" }, (0, money_ts_1.fmt)(a.share))));
        if (a.estimate > 0)
            lines.push((0, dom_ts_1.h)("div", { class: "kv" },
                (0, dom_ts_1.h)("span", null, "\u0417 \u043D\u0438\u0445 \u0433\u0440\u043E\u0448\u0456 \u0437\u0430\u0440\u0430\u0437"),
                (0, dom_ts_1.h)("b", { class: "num" }, (0, money_ts_1.fmt)(a.cash))));
        if (a.estimate > 0)
            lines.push((0, dom_ts_1.h)("div", { class: "kv muted" },
                (0, dom_ts_1.h)("span", null, "\u0420\u043E\u0437\u0440\u0430\u0445\u0443\u043D\u043A\u043E\u0432\u0430 \u0447\u0430\u0441\u0442\u0438\u043D\u0430 (\u043F\u0435\u0440\u0435\u0434\u043F\u043B\u0430\u0447\u0435\u043D\u0435 \u043F\u0430\u043B\u044C\u043D\u0435, \u0437\u043D\u043E\u0441)"),
                (0, dom_ts_1.h)("b", { class: "num" }, (0, money_ts_1.fmt)(a.estimate))));
        let comfort = null;
        const minutes = st.minutes !== null ? st.minutes + (st.wait ?? 0) : null;
        if (pub && !(0, transport_ts_1.modeInfo)(st.mode).public && st.mode !== 'walk' && a.share > 0) {
            const cp = minutes !== null && pub.minutes !== null
                ? (0, transport_ts_1.comfortPrice)({ cost: a.share, minutes }, { cost: pub.cost, minutes: pub.minutes }, data.settings.hourValue)
                : null;
            const label = (0, transport_ts_1.modeInfo)(st.mode).label;
            const extra = a.share - pub.cost;
            const head = extra > 0
                ? `${label} дорожче за звичайну поїздку громадським транспортом на ${(0, money_ts_1.fmt)(extra)}`
                : `${label} не дорожче за звичайну поїздку громадським транспортом`;
            let tail = '';
            if (cp && cp.saved > 0)
                tail = `, зате економить ${cp.saved} хв.`;
            else if (cp && cp.saved <= 0)
                tail = ', але часу не економить.';
            else
                tail = '.';
            let verdict = '';
            if (cp?.verdict === 'timeWorthIt')
                verdict = `За твоєю цінністю години ці хвилини варті ${(0, money_ts_1.fmt)(cp.timeValue ?? 0)} — доплата виправдана.`;
            else if (cp?.verdict === 'comfortPremium')
                verdict = `Час вартує ${(0, money_ts_1.fmt)(cp.timeValue ?? 0)}, решта ${(0, money_ts_1.fmt)(cp.pureComfort ?? 0)} — плата за комфорт.`;
            else if (cp && data.settings.hourValue === null && cp.saved > 0)
                verdict = 'Вкажи цінність години в налаштуваннях — і застосунок порахує, чи варта доплата.';
            comfort = ((0, dom_ts_1.h)("div", { class: "comfort" },
                (0, dom_ts_1.h)("p", { class: "comfort-head" },
                    (0, icons_ts_1.icon)('clock', 16),
                    (0, dom_ts_1.h)("b", null, "\u0426\u0456\u043D\u0430 \u043A\u043E\u043C\u0444\u043E\u0440\u0442\u0443")),
                (0, dom_ts_1.h)("p", null,
                    head,
                    tail,
                    " ",
                    verdict),
                (0, dom_ts_1.h)("p", { class: "hint" },
                    "\u041F\u043E\u0440\u0456\u0432\u043D\u044F\u043D\u043D\u044F \u0437 ",
                    pub.source === 'setting' ? 'типовою вартістю з налаштувань' : 'медіаною твоїх поїздок',
                    ": ",
                    (0, money_ts_1.fmt)(pub.cost),
                    pub.minutes !== null ? `, ${pub.minutes} хв` : '',
                    ".")));
        }
        return (0, dom_ts_1.h)(dom_ts_1.Fragment, null,
            (0, dom_ts_1.h)("div", { class: "summary" }, lines),
            comfort);
    });
    const body = (0, dom_ts_1.live)(() => ((0, dom_ts_1.h)(dom_ts_1.Fragment, null,
        (0, dom_ts_1.h)("div", { class: "mode-grid", role: "radiogroup", "aria-label": "\u0421\u043F\u043E\u0441\u0456\u0431 \u043F\u0435\u0440\u0435\u0441\u0443\u0432\u0430\u043D\u043D\u044F" }, transport_ts_1.MODES.map((m) => ((0, dom_ts_1.h)("button", { type: "button", role: "radio", "aria-checked": m.id === st.mode ? 'true' : 'false', class: (0, dom_ts_1.cx)('mode-pick', m.id === st.mode && 'on'), onClick: () => { st.mode = m.id; body.refresh(); } },
            (0, icons_ts_1.icon)(m.icon, 22),
            (0, dom_ts_1.h)("span", null, m.label))))),
        (0, dom_ts_1.h)(ui_tsx_1.Seg, { value: st.dir, label: "\u041D\u0430\u043F\u0440\u044F\u043C\u043E\u043A", options: transport_ts_1.DIRS.map((d) => ({ value: d.id, label: d.label })), onChange: (v) => { st.dir = v; body.refresh(); } }),
        (0, dom_ts_1.h)(ui_tsx_1.Field, { label: "\u041C\u0430\u0440\u0448\u0440\u0443\u0442 \u0430\u0431\u043E \u0437\u0443\u043F\u0438\u043D\u043A\u0438" },
            (0, dom_ts_1.h)(ui_tsx_1.TextInput, { value: st.route, placeholder: "\u041D\u0430\u043F\u0440\u0438\u043A\u043B\u0430\u0434: \u0414\u0456\u043C \u2192 \u041D\u0430\u0432\u0447\u0430\u043D\u043D\u044F", onChange: (v) => { st.route = v; } })),
        routes.length ? (0, dom_ts_1.h)("div", { class: "chips chips-scroll" }, routes.map((r) => (0, dom_ts_1.h)(ui_tsx_1.Chip, { on: st.route === r, onClick: () => { st.route = r; body.refresh(); } }, r))) : null,
        st.mode === 'car' ? ((0, dom_ts_1.h)("div", { class: "grid2" },
            (0, dom_ts_1.h)(ui_tsx_1.Field, { label: "\u0412\u0456\u0434\u0441\u0442\u0430\u043D\u044C" },
                (0, dom_ts_1.h)(ui_tsx_1.NumInput, { value: st.car.km || null, decimals: true, suffix: "\u043A\u043C", onChange: (v) => { st.car.km = v ?? 0; summary.refresh(); } })),
            (0, dom_ts_1.h)(ui_tsx_1.Field, { label: "\u0412\u0438\u0442\u0440\u0430\u0442\u0430" },
                (0, dom_ts_1.h)(ui_tsx_1.NumInput, { value: st.car.per100 || null, decimals: true, suffix: "\u043B/100 \u043A\u043C", onChange: (v) => { st.car.per100 = v ?? 0; summary.refresh(); } })),
            (0, dom_ts_1.h)(ui_tsx_1.Field, { label: "\u0426\u0456\u043D\u0430 \u043B\u0456\u0442\u0440\u0430" },
                (0, dom_ts_1.h)(ui_tsx_1.MoneyInput, { value: st.car.fuelPrice || null, onChange: (v) => { st.car.fuelPrice = v ?? 0; summary.refresh(); } })),
            (0, dom_ts_1.h)(ui_tsx_1.Field, { label: "\u041F\u0430\u0440\u043A\u0443\u0432\u0430\u043D\u043D\u044F" },
                (0, dom_ts_1.h)(ui_tsx_1.MoneyInput, { value: st.car.parking || null, onChange: (v) => { st.car.parking = v ?? 0; summary.refresh(); } })),
            (0, dom_ts_1.h)(ui_tsx_1.Field, { label: "\u0417\u043D\u043E\u0441 \u043D\u0430 1 \u043A\u043C", hint: "\u041D\u0435\u043E\u0431\u043E\u0432\u02BC\u044F\u0437\u043A\u043E\u0432\u043E" },
                (0, dom_ts_1.h)(ui_tsx_1.MoneyInput, { value: st.car.wearPerKm || null, onChange: (v) => { st.car.wearPerKm = v ?? 0; summary.refresh(); } })),
            (0, dom_ts_1.h)(ui_tsx_1.Field, { label: "\u0406\u043D\u0448\u0456 \u0432\u0438\u0442\u0440\u0430\u0442\u0438" },
                (0, dom_ts_1.h)(ui_tsx_1.MoneyInput, { value: st.car.other || null, onChange: (v) => { st.car.other = v ?? 0; summary.refresh(); } })),
            (0, dom_ts_1.h)("div", { class: "toggle-row span2" },
                (0, dom_ts_1.h)("span", null,
                    "\u041F\u0430\u043B\u044C\u043D\u0435 \u0432\u0436\u0435 \u043E\u043F\u043B\u0430\u0447\u0435\u043D\u0435 \u043E\u043A\u0440\u0435\u043C\u043E\u044E \u0437\u0430\u043F\u0440\u0430\u0432\u043A\u043E\u044E",
                    (0, dom_ts_1.h)("small", null, "\u0422\u043E\u0434\u0456 \u0432\u043E\u043D\u043E \u043D\u0435 \u0440\u0430\u0445\u0443\u0454\u0442\u044C\u0441\u044F \u044F\u043A \u043D\u043E\u0432\u0430 \u0432\u0438\u0442\u0440\u0430\u0442\u0430 \u2014 \u043B\u0438\u0448\u0435 \u044F\u043A \u0441\u043E\u0431\u0456\u0432\u0430\u0440\u0442\u0456\u0441\u0442\u044C \u043F\u043E\u0457\u0437\u0434\u043A\u0438.")),
                (0, dom_ts_1.h)(ui_tsx_1.Toggle, { checked: st.car.fuelPrepaid, label: "\u041F\u0430\u043B\u044C\u043D\u0435 \u0432\u0436\u0435 \u043E\u043F\u043B\u0430\u0447\u0435\u043D\u0435", onChange: (v) => { st.car.fuelPrepaid = v; summary.refresh(); } })))) : st.mode !== 'walk' ? ((0, dom_ts_1.h)(ui_tsx_1.Field, { label: st.passengers > 1 ? 'Вартість поїздки (за всіх)' : 'Вартість поїздки' },
            (0, dom_ts_1.h)(ui_tsx_1.MoneyInput, { value: st.cost, onChange: (v) => { st.cost = v; summary.refresh(); } }))) : null,
        (0, dom_ts_1.h)("div", { class: "grid2" },
            (0, dom_ts_1.h)(ui_tsx_1.Field, { label: "\u0427\u0430\u0441 \u0443 \u0434\u043E\u0440\u043E\u0437\u0456" },
                (0, dom_ts_1.h)(ui_tsx_1.NumInput, { value: st.minutes, suffix: "\u0445\u0432", onChange: (v) => { st.minutes = v; summary.refresh(); } })),
            (0, dom_ts_1.h)(ui_tsx_1.Field, { label: "\u041E\u0447\u0456\u043A\u0443\u0432\u0430\u043D\u043D\u044F" },
                (0, dom_ts_1.h)(ui_tsx_1.NumInput, { value: st.wait, suffix: "\u0445\u0432", onChange: (v) => { st.wait = v; summary.refresh(); } }))),
        (0, dom_ts_1.h)("div", { class: "field" },
            (0, dom_ts_1.h)("span", { class: "field-label" }, "\u041A\u043E\u043C\u0444\u043E\u0440\u0442"),
            (0, dom_ts_1.h)(ui_tsx_1.Stars, { value: st.comfort, onChange: (v) => { st.comfort = v; } })),
        (0, dom_ts_1.h)("div", { class: "field-inline-row" },
            (0, dom_ts_1.h)("span", { class: "field-label" }, "\u041F\u0430\u0441\u0430\u0436\u0438\u0440\u0456\u0432"),
            (0, dom_ts_1.h)(ui_tsx_1.Stepper, { value: st.passengers, min: 1, max: 8, label: "\u041A\u0456\u043B\u044C\u043A\u0456\u0441\u0442\u044C \u043F\u0430\u0441\u0430\u0436\u0438\u0440\u0456\u0432", onChange: (v) => { st.passengers = v; body.refresh(); } })),
        st.passengers > 1 ? ((0, dom_ts_1.h)("div", { class: "toggle-row" },
            (0, dom_ts_1.h)("span", null, "\u0414\u0456\u043B\u0438\u043C\u043E \u0432\u0438\u0442\u0440\u0430\u0442\u0438 \u043F\u043E\u0440\u0456\u0432\u043D\u0443"),
            (0, dom_ts_1.h)(ui_tsx_1.Toggle, { checked: st.split, label: "\u0414\u0456\u043B\u0438\u043C\u043E \u0432\u0438\u0442\u0440\u0430\u0442\u0438", onChange: (v) => { st.split = v; summary.refresh(); } }))) : null,
        summary.el,
        st.mode === 'taxi' ? ((0, dom_ts_1.h)("details", { class: "why", open: st.why },
            (0, dom_ts_1.h)("summary", { onClick: () => { st.why = !st.why; } }, "\u041A\u043E\u043B\u0438 \u0442\u0430\u043A\u0441\u0456 \u043C\u043E\u0436\u0435 \u0431\u0443\u0442\u0438 \u0432\u0438\u043F\u0440\u0430\u0432\u0434\u0430\u043D\u0438\u043C"),
            (0, dom_ts_1.h)("ul", null, transport_ts_1.TAXI_JUSTIFIED.map((s) => (0, dom_ts_1.h)("li", null, s))),
            (0, dom_ts_1.h)("p", { class: "hint" }, "\u041D\u0430\u0439\u0434\u0435\u0448\u0435\u0432\u0448\u0438\u0439 \u0441\u043F\u043E\u0441\u0456\u0431 \u2014 \u043D\u0435 \u0437\u0430\u0432\u0436\u0434\u0438 \u043D\u0430\u0439\u043A\u0440\u0430\u0449\u0438\u0439: \u0432\u0430\u0436\u0430\u0442\u044C \u0447\u0430\u0441, \u0432\u0442\u043E\u043C\u0430, \u0431\u0435\u0437\u043F\u0435\u043A\u0430 \u0439 \u043F\u043E\u0442\u0440\u0435\u0431\u0430 \u043F\u0440\u0438\u0431\u0443\u0442\u0438 \u0432\u0447\u0430\u0441\u043D\u043E."))) : null,
        (0, dom_ts_1.h)(ui_tsx_1.Field, { label: "\u041D\u043E\u0442\u0430\u0442\u043A\u0430" },
            (0, dom_ts_1.h)(ui_tsx_1.TextInput, { value: st.note, max: 300, placeholder: "\u041D\u0435\u043E\u0431\u043E\u0432\u02BC\u044F\u0437\u043A\u043E\u0432\u043E", onChange: (v) => { st.note = v; } })),
        (0, dom_ts_1.h)(DateRow, { value: st.date, onChange: (v) => { st.date = v; } }))));
    const save = () => {
        const a = (0, transport_ts_1.tripAmounts)({ mode: st.mode, cost: st.cost ?? 0, passengers: st.passengers, split: st.split, car: st.mode === 'car' ? st.car : undefined });
        if (st.mode === 'car' && st.car.km <= 0)
            return (0, ui_tsx_1.toast)('Вкажи відстань поїздки.');
        if (st.mode !== 'walk' && st.mode !== 'car' && (!st.cost || st.cost <= 0))
            return (0, ui_tsx_1.toast)('Вкажи вартість поїздки.');
        const input = {
            type: 'expense',
            date: st.date,
            amount: a.cash,
            category: 'transport',
            title: (0, transport_ts_1.modeInfo)(st.mode).label,
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
        if (op)
            p.onDone(op);
    };
    return ((0, dom_ts_1.h)("div", { class: "form" },
        body.el,
        (0, dom_ts_1.h)("div", { class: "form-actions" },
            (0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "primary", size: "lg", full: true, onClick: save }, init ? 'Зберегти зміни' : 'Зберегти поїздку'),
            init ? (0, dom_ts_1.h)(DeleteBtn, { op: init, done: p.onDone }) : null)));
}
function MealForm(p) {
    const { ix, data, today } = (0, view_ts_1.derived)();
    const init = p.initial;
    const st = {
        date: init?.date ?? p.date,
        kind: (init?.meal?.kind ?? 'lunchBox'),
        cost: (init?.amount ?? null),
        prepaid: init?.meal ? init.meal.prepaid : true,
        note: init?.note ?? '',
    };
    const canteen = (0, meals_ts_1.canteenRef)(ix, data.settings, today);
    const home = (0, meals_ts_1.homeMealRef)(ix, today);
    const work30 = derivedWork30();
    const compare = (0, dom_ts_1.live)(() => {
        if (st.cost === null || st.cost <= 0)
            return null;
        if ((0, meals_ts_1.isHomeMeal)(st.kind) && canteen) {
            const diff = canteen.amount - st.cost;
            if (diff <= 0)
                return (0, dom_ts_1.h)(ui_tsx_1.Note, { tone: "info" },
                    "\u0414\u043E\u043C\u0430\u0448\u043D\u044F \u0457\u0436\u0430 \u0446\u044C\u043E\u0433\u043E \u0440\u0430\u0437\u0443 \u043D\u0435 \u0434\u0435\u0448\u0435\u0432\u0448\u0430 \u0437\u0430 \u0457\u0434\u0430\u043B\u044C\u043D\u044E (",
                    (0, money_ts_1.fmt)(canteen.amount),
                    ").");
            const pr = (0, meals_ts_1.mealProjection)(diff);
            return ((0, dom_ts_1.h)("div", { class: "compare" },
                (0, dom_ts_1.h)("div", { class: "compare-row" },
                    (0, dom_ts_1.h)("span", null, "\u0414\u043E\u043C\u0430\u0448\u043D\u0456\u0439 \u043E\u0431\u0456\u0434"),
                    (0, dom_ts_1.h)("b", { class: "num" }, (0, money_ts_1.fmt)(st.cost))),
                (0, dom_ts_1.h)("div", { class: "compare-row" },
                    (0, dom_ts_1.h)("span", null,
                        "\u0407\u0434\u0430\u043B\u044C\u043D\u044F ",
                        canteen.source === 'setting' ? '(з налаштувань)' : '(твоя медіана)'),
                    (0, dom_ts_1.h)("b", { class: "num" }, (0, money_ts_1.fmt)(canteen.amount))),
                (0, dom_ts_1.h)("div", { class: "compare-row strong" },
                    (0, dom_ts_1.h)("span", null, "\u0420\u0456\u0437\u043D\u0438\u0446\u044F"),
                    (0, dom_ts_1.h)("b", { class: "num pos" }, (0, money_ts_1.fmt)(diff))),
                (0, dom_ts_1.h)("p", { class: "hint" },
                    "\u041F\u043E\u0442\u0435\u043D\u0446\u0456\u0439\u043D\u043E \u0437\u0430 5 / 10 / 22 \u0440\u043E\u0431\u043E\u0447\u0456 \u0434\u043D\u0456: ",
                    (0, dom_ts_1.h)("b", null, (0, money_ts_1.fmt)(pr.d5)),
                    " / ",
                    (0, dom_ts_1.h)("b", null, (0, money_ts_1.fmt)(pr.d10)),
                    " / ",
                    (0, dom_ts_1.h)("b", null, (0, money_ts_1.fmt)(pr.d22)),
                    ". \u0423 \u043D\u0430\u0439\u0431\u043B\u0438\u0436\u0447\u0456 30 \u0434\u043D\u0456\u0432 \u0443 \u0442\u0435\u0431\u0435 ",
                    (0, money_ts_1.count)(work30, money_ts_1.WORKDAYS),
                    ". \u0426\u0435 \u043C\u043E\u0436\u043B\u0438\u0432\u0456\u0441\u0442\u044C, \u0430 \u043D\u0435 \u0437\u0430\u043E\u0449\u0430\u0434\u0436\u0435\u043D\u043D\u044F.")));
        }
        if (!(0, meals_ts_1.isHomeMeal)(st.kind) && home) {
            const diff = st.cost - home;
            if (diff > 0)
                return (0, dom_ts_1.h)(ui_tsx_1.Note, { tone: "info" },
                    "\u0414\u043E\u043C\u0430\u0448\u043D\u0456\u0439 \u043E\u0431\u0456\u0434 \u0437\u0430\u0437\u0432\u0438\u0447\u0430\u0439 \u043E\u0431\u0445\u043E\u0434\u0438\u0442\u044C\u0441\u044F \u0442\u043E\u0431\u0456 \u0432 ",
                    (0, money_ts_1.fmt)(home),
                    " \u2014 \u0440\u0456\u0437\u043D\u0438\u0446\u044F ",
                    (0, money_ts_1.fmt)(diff),
                    ".");
        }
        return null;
    });
    const body = (0, dom_ts_1.live)(() => {
        const homeKind = (0, meals_ts_1.isHomeMeal)(st.kind);
        return ((0, dom_ts_1.h)(dom_ts_1.Fragment, null,
            (0, dom_ts_1.h)("div", { class: "meal-grid", role: "radiogroup", "aria-label": "\u0412\u0438\u0434 \u0445\u0430\u0440\u0447\u0443\u0432\u0430\u043D\u043D\u044F" }, meals_ts_1.MEALS.map((m) => ((0, dom_ts_1.h)("button", { type: "button", role: "radio", "aria-checked": m.id === st.kind ? 'true' : 'false', class: (0, dom_ts_1.cx)('mode-pick', m.id === st.kind && 'on'), onClick: () => { st.kind = m.id; body.refresh(); } },
                (0, icons_ts_1.icon)(m.icon, 22),
                (0, dom_ts_1.h)("span", null, m.label))))),
            (0, dom_ts_1.h)(ui_tsx_1.Field, { label: homeKind ? 'Вартість інгредієнтів на одну порцію' : 'Скільки коштувало' },
                (0, dom_ts_1.h)(ui_tsx_1.MoneyInput, { value: st.cost, onChange: (v) => { st.cost = v; compare.refresh(); } })),
            homeKind ? ((0, dom_ts_1.h)("div", { class: "stack-sm" },
                (0, dom_ts_1.h)(ui_tsx_1.Seg, { value: st.prepaid ? 'yes' : 'no', label: "\u041F\u0440\u043E\u0434\u0443\u043A\u0442\u0438", options: [{ value: 'yes', label: 'Продукти вже куплені' }, { value: 'no', label: 'Нова покупка' }], onChange: (v) => { st.prepaid = v === 'yes'; body.refresh(); } }),
                (0, dom_ts_1.h)("p", { class: "hint" }, st.prepaid
                    ? 'Покупку продуктів уже враховано — тут лише розрахункова собівартість, без повторного списання грошей.'
                    : 'Буде записано як витрату на продукти.'))) : null,
            compare.el,
            (0, dom_ts_1.h)(ui_tsx_1.Field, { label: "\u041D\u043E\u0442\u0430\u0442\u043A\u0430" },
                (0, dom_ts_1.h)(ui_tsx_1.TextInput, { value: st.note, max: 300, placeholder: "\u041D\u0435\u043E\u0431\u043E\u0432\u02BC\u044F\u0437\u043A\u043E\u0432\u043E", onChange: (v) => { st.note = v; } })),
            (0, dom_ts_1.h)(DateRow, { value: st.date, onChange: (v) => { st.date = v; } })));
    });
    const save = () => {
        if (!st.cost || st.cost <= 0)
            return (0, ui_tsx_1.toast)('Вкажи вартість.');
        const shape = (0, meals_ts_1.mealOpShape)(st.kind, st.prepaid);
        const input = {
            type: shape.type,
            date: st.date,
            amount: st.cost,
            category: shape.category,
            title: (0, meals_ts_1.mealInfo)(st.kind).label,
            meal: { kind: st.kind, prepaid: (0, meals_ts_1.isHomeMeal)(st.kind) && st.prepaid },
        };
        put(input, 'note', st.note.trim());
        put(input, 'planLineId', init?.planLineId ?? p.planLine?.id);
        if (init && init.type !== shape.type) {
            (0, store_ts_1.deleteOperation)(init.id);
            const op = saveOrUpdate(undefined, input);
            if (op)
                p.onDone(op);
            return;
        }
        const op = saveOrUpdate(init, input);
        if (op)
            p.onDone(op);
    };
    return ((0, dom_ts_1.h)("div", { class: "form" },
        body.el,
        (0, dom_ts_1.h)("div", { class: "form-actions" },
            (0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "primary", size: "lg", full: true, onClick: save }, init ? 'Зберегти зміни' : 'Зберегти'),
            init ? (0, dom_ts_1.h)(DeleteBtn, { op: init, done: p.onDone }) : null)));
}
function derivedWork30() {
    const { data, today } = (0, view_ts_1.derived)();
    return (0, calendar_ts_1.workdaysAhead)(today, 30, data.settings.calendar);
}
function MoreForm(p) {
    const { data, ix, cats, today } = (0, view_ts_1.derived)();
    const init = p.initial;
    const st = {
        kind: (init?.type ?? p.kind ?? 'saving'),
        date: init?.date ?? p.date,
        amount: (init?.amount ?? null),
        title: init?.title ?? '',
        note: init?.note ?? '',
        goalId: init?.goalId ?? p.goalId ?? '',
        refundOf: init?.refundOf ?? '',
        category: init?.category ?? 'other',
    };
    if (!init && st.kind === 'saving') {
        const c = (0, ledger_ts_1.calcDay)(ix, today, data.days[today], cats);
        const bv = (0, budget_ts_1.budgetView)({ ix, settings: data.settings, days: data.days, today, todayCalc: c, todayClosed: Boolean(data.days[today]?.closed) });
        if (bv.status === 'ok' && bv.safe && bv.safe > 0)
            st.amount = bv.safe;
    }
    const body = (0, dom_ts_1.live)(() => {
        const k = st.kind;
        const c = (0, ledger_ts_1.calcDay)(ix, today, data.days[today], cats);
        const bv = (0, budget_ts_1.budgetView)({ ix, settings: data.settings, days: data.days, today, todayCalc: c, todayClosed: Boolean(data.days[today]?.closed) });
        const goals = data.goals.map((g) => (0, goals_ts_1.goalView)(g, ix, today));
        const recent = ix.all.filter((o) => o.type === 'expense' && o.date >= (0, time_ts_1.addDays)(today, -45)).sort((a, b) => b.time - a.time).slice(0, 25);
        const refunded = (id) => ix.all.filter((o) => o.type === 'refund' && o.refundOf === id && o.id !== init?.id).reduce((s, o) => s + o.amount, 0);
        return ((0, dom_ts_1.h)(dom_ts_1.Fragment, null,
            !init ? ((0, dom_ts_1.h)("div", { class: "chips chips-wrap", role: "radiogroup", "aria-label": "\u0422\u0438\u043F \u043E\u043F\u0435\u0440\u0430\u0446\u0456\u0457" }, [['saving', 'Відкласти', 'coins'], ['income', 'Дохід', 'arrowDown'], ['refund', 'Повернення', 'refund'], ['withdrawal', 'З накопичень', 'arrowUp'], ['transfer', 'Між рахунками', 'transfer']].map(([id, label, ic]) => ((0, dom_ts_1.h)(ui_tsx_1.Chip, { on: k === id, icon: ic, onClick: () => { st.kind = id; body.refresh(); actions.refresh(); } }, label))))) : null,
            k === 'saving' ? ((0, dom_ts_1.h)("div", { class: "stack-sm" },
                bv.status === 'deficit' ? (0, dom_ts_1.h)(ui_tsx_1.Note, { tone: "warn" },
                    "\u0417\u0430\u0440\u0430\u0437 \u0431\u0440\u0430\u043A\u0443\u0454 ",
                    (0, money_ts_1.fmt)(bv.shortfall),
                    " \u043D\u0430 \u043E\u0431\u043E\u0432\u02BC\u044F\u0437\u043A\u043E\u0432\u0456 \u043F\u043B\u0430\u0442\u0435\u0436\u0456 \u0434\u043E ",
                    bv.nextIncome ? (0, time_ts_1.fmtDate)(bv.nextIncome.date) : 'кінця місяця',
                    ". \u041F\u0435\u0440\u0435\u043A\u0430\u0437 \u0443 \u043D\u0430\u043A\u043E\u043F\u0438\u0447\u0435\u043D\u043D\u044F \u043F\u043E\u043A\u0438 \u043D\u0435 \u0440\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0443\u0454\u0442\u044C\u0441\u044F.") : null,
                bv.status === 'ok' && bv.safe !== null ? (0, dom_ts_1.h)(ui_tsx_1.Note, { tone: "good" },
                    "\u0411\u0435\u0437\u043F\u0435\u0447\u043D\u043E \u0432\u0456\u0434\u043A\u043B\u0430\u0441\u0442\u0438 \u0441\u044C\u043E\u0433\u043E\u0434\u043D\u0456: ",
                    (0, dom_ts_1.h)("b", null, (0, money_ts_1.fmt)(bv.safe)),
                    ".") : null,
                (0, dom_ts_1.h)("p", { class: "hint" }, "\u041A\u043D\u043E\u043F\u043A\u0430 \u043B\u0438\u0448\u0435 \u0444\u0456\u043A\u0441\u0443\u0454 \u043F\u0435\u0440\u0435\u043A\u0430\u0437, \u044F\u043A\u0438\u0439 \u0442\u0438 \u0437\u0440\u043E\u0431\u0438\u0432 \u0441\u0430\u043C. \u0413\u0440\u043E\u0448\u0456 \u0437 \u0431\u0430\u043D\u043A\u0456\u0432\u0441\u044C\u043A\u043E\u0433\u043E \u0440\u0430\u0445\u0443\u043D\u043A\u0443 \u0437\u0430\u0441\u0442\u043E\u0441\u0443\u043D\u043E\u043A \u043D\u0435 \u0441\u043F\u0438\u0441\u0443\u0454."))) : null,
            k === 'withdrawal' ? (0, dom_ts_1.h)("p", { class: "hint" }, "\u041F\u043E\u0432\u0435\u0440\u043D\u0435\u043D\u043D\u044F \u0433\u0440\u043E\u0448\u0435\u0439 \u0456\u0437 \u043D\u0430\u043A\u043E\u043F\u0438\u0447\u0435\u043D\u044C \u2014 \u043D\u0435 \u0434\u043E\u0445\u0456\u0434. \u0417\u043C\u0435\u043D\u0448\u0443\u0454 \u043D\u0430\u043A\u043E\u043F\u0438\u0447\u0435\u043D\u043D\u044F \u0439 \u043F\u043E\u0432\u0435\u0440\u0442\u0430\u0454 \u043A\u043E\u0448\u0442\u0438 \u0432 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0456.") : null,
            k === 'transfer' ? (0, dom_ts_1.h)("p", { class: "hint" }, "\u041F\u0435\u0440\u0435\u043A\u0430\u0437 \u043C\u0456\u0436 \u0441\u0432\u043E\u0457\u043C\u0438 \u0440\u0430\u0445\u0443\u043D\u043A\u0430\u043C\u0438 (\u043A\u0430\u0440\u0442\u043A\u0430 \u2192 \u0433\u043E\u0442\u0456\u0432\u043A\u0430 \u0442\u043E\u0449\u043E) \u043D\u0435 \u0437\u043C\u0456\u043D\u044E\u0454 \u043D\u0456 \u0432\u0438\u0442\u0440\u0430\u0442, \u043D\u0456 \u0434\u043E\u0445\u043E\u0434\u0456\u0432, \u043D\u0456 \u043D\u0430\u043A\u043E\u043F\u0438\u0447\u0435\u043D\u044C.") : null,
            k === 'refund' ? ((0, dom_ts_1.h)("div", { class: "stack-sm" },
                (0, dom_ts_1.h)("p", { class: "hint" }, "\u041F\u043E\u0432\u0435\u0440\u043D\u0435\u043D\u043D\u044F \u2014 \u043E\u043A\u0440\u0435\u043C\u0430 \u043A\u043E\u0440\u0438\u0433\u0443\u0432\u0430\u043B\u044C\u043D\u0430 \u043E\u043F\u0435\u0440\u0430\u0446\u0456\u044F. \u041F\u0440\u0438\u0432\u02BC\u044F\u0436\u0438 \u0439\u043E\u0433\u043E \u0434\u043E \u043F\u043E\u043A\u0443\u043F\u043A\u0438, \u0456 \u0432\u0438\u0442\u0440\u0430\u0442\u0443 \u0442\u043E\u0433\u043E \u0434\u043D\u044F \u0431\u0443\u0434\u0435 \u0432\u0438\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043E."),
                (0, dom_ts_1.h)("div", { class: "pick-list", role: "radiogroup", "aria-label": "\u041F\u043E\u043A\u0443\u043F\u043A\u0430, \u0437\u0430 \u044F\u043A\u0443 \u043F\u043E\u0432\u0435\u0440\u043D\u0435\u043D\u043D\u044F" },
                    (0, dom_ts_1.h)("button", { type: "button", class: (0, dom_ts_1.cx)('pick', !st.refundOf && 'on'), onClick: () => { st.refundOf = ''; body.refresh(); } },
                        (0, dom_ts_1.h)("span", null, "\u0411\u0435\u0437 \u043F\u0440\u0438\u0432\u02BC\u044F\u0437\u043A\u0438 \u0434\u043E \u043F\u043E\u043A\u0443\u043F\u043A\u0438"),
                        !st.refundOf ? (0, icons_ts_1.icon)('check', 18) : null),
                    recent.map((o) => {
                        const left = o.amount - refunded(o.id);
                        return ((0, dom_ts_1.h)("button", { type: "button", class: (0, dom_ts_1.cx)('pick', st.refundOf === o.id && 'on'), disabled: left <= 0, onClick: () => { st.refundOf = o.id; st.category = o.category ?? 'other'; st.amount = left; body.refresh(); } },
                            (0, dom_ts_1.h)("span", null,
                                (0, ledger_ts_1.opTitle)(o, cats),
                                " \u00B7 ",
                                (0, time_ts_1.fmtDate)(o.date),
                                " \u00B7 ",
                                (0, money_ts_1.fmt)(o.amount),
                                left < o.amount ? ` (лишилось ${(0, money_ts_1.fmt)(left)})` : ''),
                            st.refundOf === o.id ? (0, icons_ts_1.icon)('check', 18) : null));
                    })),
                !st.refundOf ? ((0, dom_ts_1.h)(ui_tsx_1.Field, { label: "\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0456\u044F" },
                    (0, dom_ts_1.h)(ui_tsx_1.Select, { value: st.category, label: "\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0456\u044F", options: data.categories.filter((c) => !c.hidden).map((c) => ({ value: c.id, label: c.name })), onChange: (v) => { st.category = v; } }))) : null)) : null,
            (0, dom_ts_1.h)(ui_tsx_1.Field, { label: "\u0421\u0443\u043C\u0430" },
                (0, dom_ts_1.h)(ui_tsx_1.MoneyInput, { value: st.amount, onChange: (v) => { st.amount = v; } })),
            (k === 'saving' || k === 'withdrawal') && goals.length ? ((0, dom_ts_1.h)(ui_tsx_1.Field, { label: "\u0426\u0456\u043B\u044C" },
                (0, dom_ts_1.h)(ui_tsx_1.Select, { value: st.goalId, label: "\u0426\u0456\u043B\u044C", options: [{ value: '', label: 'Загальні накопичення' }, ...goals.map((g) => ({ value: g.goal.id, label: `${g.goal.name} · ${g.pct}%` }))], onChange: (v) => { st.goalId = v; } }))) : null,
            k === 'income' && data.settings.budget.incomes.length ? ((0, dom_ts_1.h)("div", { class: "chips chips-wrap" }, data.settings.budget.incomes.map((i) => (0, dom_ts_1.h)(ui_tsx_1.Chip, { on: st.title === i.name, onClick: () => { st.title = i.name; if (!st.amount)
                    st.amount = i.amount; body.refresh(); } }, i.name)))) : null,
            (0, dom_ts_1.h)(ui_tsx_1.Field, { label: k === 'transfer' ? 'Звідки → куди' : 'Назва' },
                (0, dom_ts_1.h)(ui_tsx_1.TextInput, { value: st.title, placeholder: k === 'transfer' ? 'Картка → готівка' : 'Необовʼязково', onChange: (v) => { st.title = v; } })),
            (0, dom_ts_1.h)(ui_tsx_1.Field, { label: "\u041D\u043E\u0442\u0430\u0442\u043A\u0430" },
                (0, dom_ts_1.h)(ui_tsx_1.TextInput, { value: st.note, max: 300, placeholder: "\u041D\u0435\u043E\u0431\u043E\u0432\u02BC\u044F\u0437\u043A\u043E\u0432\u043E", onChange: (v) => { st.note = v; } })),
            (0, dom_ts_1.h)(DateRow, { value: st.date, onChange: (v) => { st.date = v; } })));
    });
    const save = () => {
        if (!st.amount || st.amount <= 0)
            return (0, ui_tsx_1.toast)('Вкажи суму більшу за нуль.');
        if (st.kind === 'refund' && st.refundOf) {
            const orig = ix.byId.get(st.refundOf);
            const already = ix.all.filter((o) => o.type === 'refund' && o.refundOf === st.refundOf && o.id !== init?.id).reduce((s, o) => s + o.amount, 0);
            if (orig && st.amount > orig.amount - already)
                return (0, ui_tsx_1.toast)(`Повернення не може перевищувати покупку: максимум ${(0, money_ts_1.fmt)(orig.amount - already)}.`);
        }
        const input = { type: st.kind, date: st.date, amount: st.amount };
        put(input, 'title', st.title.trim());
        put(input, 'note', st.note.trim());
        put(input, 'goalId', st.kind === 'saving' || st.kind === 'withdrawal' ? st.goalId : null);
        put(input, 'refundOf', st.kind === 'refund' ? st.refundOf : null);
        put(input, 'category', st.kind === 'refund' ? st.category : null);
        const op = saveOrUpdate(init, input);
        if (op)
            p.onDone(op);
    };
    const labels = { saving: 'Зафіксувати переказ', income: 'Зберегти дохід', refund: 'Зберегти повернення', withdrawal: 'Зафіксувати зняття', transfer: 'Зберегти переказ' };
    const actions = (0, dom_ts_1.live)(() => ((0, dom_ts_1.h)("div", { class: "form-actions" },
        (0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "primary", size: "lg", full: true, onClick: save }, init ? 'Зберегти зміни' : labels[st.kind]),
        init ? (0, dom_ts_1.h)(DeleteBtn, { op: init, done: p.onDone }) : null)));
    return ((0, dom_ts_1.h)("div", { class: "form" },
        body.el,
        actions.el));
}
function addedToast(op) {
    const { cats } = (0, view_ts_1.derived)();
    const what = op.type === 'saving' ? 'Відкладено' : op.type === 'consumption' ? 'Записано собівартість' : 'Додано';
    (0, ui_tsx_1.toast)(`${what}: ${(0, ledger_ts_1.opTitle)(op, cats)} — ${(0, money_ts_1.fmt)(op.amount)}`, [{ label: 'Скасувати', run: () => (0, store_ts_1.purgeOperation)(op.id) }]);
}
function openQuickAdd(o) {
    const titles = { expense: 'Нова витрата', trip: 'Поїздка', meal: 'Харчування', more: 'Операція' };
    const mode = o.mode ?? 'expense';
    (0, ui_tsx_1.openSheet)({
        title: titles[mode],
        tall: mode !== 'expense',
        render: (close) => {
            const done = (op) => { close(); if (op)
                addedToast(op); };
            if (mode === 'trip')
                return (0, dom_ts_1.h)(TripForm, { date: o.date, onDone: done });
            if (mode === 'meal')
                return (0, dom_ts_1.h)(MealForm, { date: o.date, planLine: o.planLine, onDone: done });
            if (mode === 'more')
                return (0, dom_ts_1.h)(MoreForm, { date: o.date, kind: o.more, onDone: done });
            return (0, dom_ts_1.h)(ExpenseForm, { date: o.date, category: o.category, micro: o.micro, planLine: o.planLine, onDone: done });
        },
    });
}
function openOpEditor(op) {
    (0, ui_tsx_1.openSheet)({
        title: 'Редагування',
        tall: true,
        render: (close) => {
            const done = (saved) => { close(); if (saved && !saved.deletedAt)
                (0, ui_tsx_1.toast)('Зміни збережено. Підсумки перераховано.'); };
            if (op.trip)
                return (0, dom_ts_1.h)(TripForm, { date: op.date, initial: op, onDone: done });
            if (op.meal)
                return (0, dom_ts_1.h)(MealForm, { date: op.date, initial: op, onDone: done });
            if (op.type === 'expense')
                return (0, dom_ts_1.h)(ExpenseForm, { date: op.date, initial: op, onDone: done });
            if (op.type === 'consumption')
                return (0, dom_ts_1.h)(MealForm, { date: op.date, initial: op, onDone: done });
            return (0, dom_ts_1.h)(MoreForm, { date: op.date, initial: op, onDone: done });
        },
    });
}
function quickMicro(itemId, date) {
    const { data } = (0, view_ts_1.derived)();
    const m = data.micro.find((x) => x.id === itemId);
    if (!m)
        return;
    if (!m.price) {
        openQuickAdd({ date, category: m.category, micro: m.id });
        return;
    }
    const op = (0, store_ts_1.addOperation)({ type: 'expense', date, amount: m.price, category: m.category, micro: m.id, title: m.name });
    addedToast(op);
}
function recordPlanLine(line, date) {
    if (line.amount <= 0) {
        if (line.category === 'lunch')
            openQuickAdd({ date, mode: 'meal', planLine: line });
        else
            openQuickAdd({ date, category: line.category, planLine: line });
        return;
    }
    const op = (0, store_ts_1.addOperation)({ type: 'expense', date, amount: line.amount, category: line.category, title: line.label, planLineId: line.id });
    (0, ui_tsx_1.toast)(`Записано: ${line.label} — ${(0, money_ts_1.fmt)(line.amount)}`, [
        { label: 'Змінити', run: () => openOpEditor(op) },
        { label: 'Скасувати', run: () => (0, store_ts_1.purgeOperation)(op.id) },
    ]);
}
function confirmDeleteForever(op) {
    const { cats } = (0, view_ts_1.derived)();
    (0, ui_tsx_1.confirmSheet)({
        title: 'Видалити назавжди?',
        text: `«${(0, ledger_ts_1.opTitle)(op, cats)}» за ${(0, time_ts_1.fmtDate)(op.date)} (${(0, money_ts_1.fmt)(op.amount)}) буде видалено без можливості відновлення.`,
        confirm: 'Видалити назавжди',
        danger: true,
        onConfirm: () => (0, store_ts_1.purgeOperation)(op.id),
    });
}
function OpRow(p) {
    const { cats } = (0, view_ts_1.derived)();
    const o = p.op;
    const cat = (0, view_ts_1.catOf)(cats, o.category);
    const special = {
        income: { icon: 'arrowDown', color: '#2C9561' },
        saving: { icon: 'coins', color: '#1E8F72' },
        withdrawal: { icon: 'arrowUp', color: '#B88A1E' },
        transfer: { icon: 'transfer', color: '#76808C' },
        refund: { icon: 'refund', color: '#3B76D6' },
    };
    const look = special[o.type] ?? { icon: o.trip ? (0, transport_ts_1.modeInfo)(o.trip.mode).icon : o.meal ? (0, meals_ts_1.mealInfo)(o.meal.kind).icon : cat.icon, color: cat.color };
    const bits = [];
    if (p.showDate)
        bits.push((0, time_ts_1.fmtDate)(o.date));
    bits.push((0, time_ts_1.timeHM)(o.time));
    if (o.trip) {
        if (o.trip.route)
            bits.push(o.trip.route);
        if (o.trip.minutes !== null)
            bits.push(`${o.trip.minutes + (o.trip.wait ?? 0)} хв`);
        if (o.trip.passengers > 1)
            bits.push(`${o.trip.passengers} пас.`);
    }
    if (o.type === 'consumption')
        bits.push('не рух грошей');
    if (o.estimate)
        bits.push(`+ ${(0, money_ts_1.fmt)(o.estimate)} розрахунково`);
    if (o.obligationId)
        bits.push('обовʼязковий платіж');
    if (o.note)
        bits.push(o.note);
    const sign = o.type === 'income' || o.type === 'refund' || o.type === 'withdrawal' ? '+' : '';
    const tone = o.type === 'income' || o.type === 'refund' ? 'pos' : o.type === 'consumption' || o.type === 'transfer' ? 'muted' : '';
    return ((0, dom_ts_1.h)(ui_tsx_1.Row, { icon: look.icon, color: look.color, title: (0, ledger_ts_1.opTitle)(o, cats), sub: bits.join(' · '), value: `${sign}${(0, money_ts_1.fmt)(o.amount)}`, valueTone: tone, onClick: () => openOpEditor(o) }));
}
function CatBadge(p) {
    const { cats } = (0, view_ts_1.derived)();
    return (0, dom_ts_1.h)(ui_tsx_1.CatIcon, { cat: (0, view_ts_1.catOf)(cats, p.id), size: 18 });
}
};

// ── insights.ts
defs["insights.js"] = function (require, exports, module) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.microTotals = microTotals;
exports.priceOfDecision = priceOfDecision;
exports.decisionImpacts = decisionImpacts;
exports.topCategories = topCategories;
exports.biggestCategory = biggestCategory;
exports.bestAction = bestAction;
const ledger_ts_1 = require("./ledger.js");
const meals_ts_1 = require("./meals.js");
const transport_ts_1 = require("./transport.js");
const money_ts_1 = require("./money.js");
const time_ts_1 = require("./time.js");
function microTotals(ix, days, cats, today) {
    const sum = (from) => (0, ledger_ts_1.calcPeriod)(ix, days, cats, from, today, today);
    const y = sum((0, time_ts_1.startOfYear)(today));
    const last30 = sum((0, time_ts_1.addDays)(today, -29));
    const microOf = (from) => y.days.filter((d) => d.date >= from).reduce((s, d) => s + d.calc.micro, 0);
    return {
        day: microOf(today),
        week: microOf((0, time_ts_1.startOfWeek)(today)),
        month: microOf((0, time_ts_1.startOfMonth)(today)),
        year: y.micro,
        avgPerDataDay: last30.dataDays >= 7 ? Math.round(last30.micro / last30.dataDays) : null,
        dataDays: last30.dataDays,
    };
}
function priceOfDecision(p) {
    const out = [];
    const dayOps = p.ix.byDate.get(p.date) ?? [];
    const taxi = dayOps.filter((o) => o.type === 'expense' && o.trip?.mode === 'taxi').reduce((s, o) => s + o.amount, 0);
    const pub = (0, transport_ts_1.publicRef)(p.ix, p.settings, p.today);
    if (taxi > 0 && pub && pub.cost > 0) {
        const n = Math.round(taxi / pub.cost);
        if (n >= 2)
            out.push(`Таксі цього дня коштувало стільки ж, скільки ${n} ${(0, money_ts_1.plural)(n, ['звичайна поїздка', 'звичайні поїздки', 'звичайних поїздок'])} громадським транспортом.`);
    }
    const weekFrom = (0, time_ts_1.startOfWeek)(p.date);
    const week = (0, ledger_ts_1.calcPeriod)(p.ix, p.days, p.cats, weekFrom, p.date, p.today);
    const coffee = week.byCat.coffee ?? 0;
    const flexPlan = week.days.filter((d) => d.counted && d.calc.plan).reduce((s, d) => s + d.calc.planTotal, 0);
    if (coffee > 0 && flexPlan > 0) {
        const pc = (0, money_ts_1.percent)(coffee, flexPlan);
        if (pc !== null && pc >= 1)
            out.push(`Цього тижня кава — ${pc}% твого запланованого гнучкого бюджету.`);
    }
    const canteenToday = dayOps.filter((o) => o.type === 'expense' && o.meal && !(0, meals_ts_1.isHomeMeal)(o.meal.kind)).reduce((s, o) => s + o.amount, 0);
    const home = (0, meals_ts_1.homeMealRef)(p.ix, p.today);
    if (canteenToday > 0 && home && home > 0) {
        const n = Math.floor(canteenToday / home);
        if (n >= 2)
            out.push(`Обід поза домом коштував як ${n} ${(0, money_ts_1.plural)(n, ['домашній обід', 'домашні обіди', 'домашніх обідів'])}.`);
    }
    return out.slice(0, 2);
}
function decisionImpacts(ix, days, cats, settings, today) {
    const from = (0, time_ts_1.addDays)(today, -29);
    const out = [];
    const ops = ix.all.filter((o) => o.date >= from && o.date <= today && o.type === 'expense');
    const taxis = ops.filter((o) => o.trip?.mode === 'taxi');
    const pub = (0, transport_ts_1.publicRef)(ix, settings, today);
    if (taxis.length && pub) {
        const premium = taxis.reduce((s, o) => s + Math.max(0, o.amount + (o.estimate ?? 0) - pub.cost), 0);
        if (premium > 0)
            out.push({ id: 'taxi', label: 'Таксі замість громадського транспорту', amount: premium, detail: `${taxis.length} ${(0, money_ts_1.plural)(taxis.length, ['поїздка', 'поїздки', 'поїздок'])}, доплата порівняно зі звичайним проїздом` });
    }
    const outMeals = ops.filter((o) => o.meal && !(0, meals_ts_1.isHomeMeal)(o.meal.kind));
    const home = (0, meals_ts_1.homeMealRef)(ix, today);
    if (outMeals.length && home !== null) {
        const premium = outMeals.reduce((s, o) => s + Math.max(0, o.amount - home), 0);
        if (premium > 0)
            out.push({ id: 'meals', label: 'Їжа поза домом', amount: premium, detail: `${outMeals.length} ${(0, money_ts_1.plural)(outMeals.length, ['раз', 'рази', 'разів'])}, різниця з домашнім обідом` });
    }
    const period = (0, ledger_ts_1.calcPeriod)(ix, days, cats, from, today, today);
    if (period.micro > 0)
        out.push({ id: 'micro', label: 'Кава й смаколики', amount: period.micro, detail: 'Сума дрібних покупок за 30 днів' });
    const over = {};
    for (const d of period.days) {
        if (!d.counted || !d.calc.plan)
            continue;
        for (const [cat, v] of Object.entries(d.calc.byCat)) {
            const diff = v - (d.calc.planByCat[cat] ?? 0);
            if (diff > 0)
                over[cat] = (over[cat] ?? 0) + diff;
        }
    }
    for (const [cat, v] of Object.entries(over)) {
        if (v < 10_000 || cat === 'coffee' || cat === 'treats')
            continue;
        out.push({ id: 'over-' + cat, label: `Перевищення плану: ${cats.get(cat)?.name ?? cat}`, amount: v, detail: 'Сума перевитрат понад план у цій категорії' });
    }
    return out.sort((a, b) => b.amount - a.amount).slice(0, 4);
}
function topCategories(period, cats, limit = 3) {
    const total = Object.values(period.byCat).reduce((s, v) => s + Math.max(0, v), 0);
    return Object.entries(period.byCat)
        .filter(([, v]) => v > 0)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([id, amount]) => ({ id, name: cats.get(id)?.name ?? id, amount, share: total > 0 ? Math.round((amount * 100) / total) : 0 }));
}
function biggestCategory(calc, cats) {
    let best = null;
    for (const [id, v] of Object.entries(calc.byCat))
        if (v > 0 && (!best || v > best[1]))
            best = [id, v];
    return best ? { id: best[0], name: cats.get(best[0])?.name ?? best[0], amount: best[1] } : null;
}
function bestAction(p) {
    const cands = [];
    const dayOps = p.ix.byDate.get(p.date) ?? [];
    const canteen = (0, meals_ts_1.canteenRef)(p.ix, p.settings, p.today);
    for (const o of dayOps) {
        if (o.meal && (0, meals_ts_1.isHomeMeal)(o.meal.kind) && canteen && canteen.amount > o.amount) {
            cands.push({ text: `Домашня їжа замість їдальні: різниця ${(0, money_ts_1.fmt)(canteen.amount - o.amount)}.`, value: canteen.amount - o.amount });
        }
    }
    const tRef = (0, transport_ts_1.taxiRef)(p.ix, p.today);
    const pubTrips = dayOps.filter((o) => o.type === 'expense' && o.trip && ['bus', 'tram', 'trolley', 'metro', 'walk'].includes(o.trip.mode));
    if (tRef && pubTrips.length) {
        const saved = pubTrips.reduce((s, o) => s + Math.max(0, tRef.cost - o.amount), 0);
        if (saved > 0)
            cands.push({ text: `Громадський транспорт чи пішки замість таксі: умовно збережено ${(0, money_ts_1.fmt)(saved)}.`, value: saved });
    }
    if (p.calc.saved > 0)
        cands.push({ text: `Відкладено ${(0, money_ts_1.fmt)(p.calc.saved)} — це вже реальні заощадження.`, value: p.calc.saved * 2 });
    if (p.calc.plan && p.calc.economy !== null && p.calc.economy > 0) {
        cands.push({ text: `День у межах плану з запасом ${(0, money_ts_1.fmt)(p.calc.economy)}.`, value: p.calc.economy });
    }
    const joy = p.settings.joyBudget;
    if (joy !== null && p.calc.micro > 0 && p.calc.micro <= joy)
        cands.push({ text: 'Приємності вклалися в бюджет радості.', value: (0, money_ts_1.roundDiv)(joy - p.calc.micro, 2) });
    if (p.calc.hasData && p.calc.spent === 0)
        cands.push({ text: 'День без витрат.', value: 1 });
    cands.sort((a, b) => b.value - a.value);
    return cands[0]?.text ?? null;
}
};

// ── forecast.ts
defs["forecast.js"] = function (require, exports, module) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MIN_OFF = exports.MIN_WORK = exports.MIN_SAMPLES = exports.SPANS = void 0;
exports.collectSamples = collectSamples;
exports.median = median;
exports.mean = mean;
exports.forecast = forecast;
exports.illustrate = illustrate;
exports.savingsPace = savingsPace;
const ledger_ts_1 = require("./ledger.js");
const calendar_ts_1 = require("./calendar.js");
const time_ts_1 = require("./time.js");
exports.SPANS = [30, 182, 365];
exports.MIN_SAMPLES = 5;
exports.MIN_WORK = 3;
exports.MIN_OFF = 3;
function collectSamples(ix, days, cats, cal, today) {
    const out = [];
    for (const rec of Object.values(days)) {
        if (!rec.plan || !rec.plan.length || rec.date > today)
            continue;
        if (rec.date === today && !rec.closed)
            continue;
        const c = (0, ledger_ts_1.calcDay)(ix, rec.date, rec, cats);
        if (!c.hasData && !rec.closed)
            continue;
        out.push({ date: rec.date, economy: c.planTotal - c.spent, plan: c.planTotal, work: (0, calendar_ts_1.isWorkday)(rec.date, cal), stay: (0, calendar_ts_1.inStay)(rec.date, cal) });
    }
    return out.sort((a, b) => (a.date < b.date ? -1 : 1));
}
function median(xs) {
    if (!xs.length)
        return 0;
    const s = [...xs].sort((a, b) => a - b);
    const mid = Math.floor(s.length / 2);
    return s.length % 2 ? s[mid] : Math.round((s[mid - 1] + s[mid]) / 2);
}
function mean(xs) {
    if (!xs.length)
        return 0;
    let s = 0;
    for (const x of xs)
        s += x;
    return Math.round(s / xs.length);
}
function horizonCounts(cal, today, stayOnly) {
    const from = (0, time_ts_1.addDays)(today, 1);
    return {
        30: (0, calendar_ts_1.countDays)(from, 30, cal, stayOnly),
        182: (0, calendar_ts_1.countDays)(from, 182, cal, stayOnly),
        365: (0, calendar_ts_1.countDays)(from, 365, cal, stayOnly),
    };
}
function optimistic(xs) {
    if (!xs.length)
        return 0;
    const good = xs.filter((x) => x >= 0);
    const bad = xs.filter((x) => x < 0);
    const p = good.length / xs.length;
    const pOpt = Math.min(1, p + 0.2);
    return Math.round(pOpt * mean(good) + (1 - pOpt) * mean(bad));
}
function forecast(samples, cal, today, stayOnly = false) {
    const pool = stayOnly && cal.stays.length ? samples.filter((s) => s.stay) : samples;
    const work = pool.filter((s) => s.work).map((s) => s.economy);
    const off = pool.filter((s) => !s.work).map((s) => s.economy);
    const counts = horizonCounts(cal, today, stayOnly);
    const enough = pool.length >= exports.MIN_SAMPLES && work.length >= exports.MIN_WORK;
    const offOk = off.length >= exports.MIN_OFF;
    const adherence = pool.length ? Math.round((pool.filter((s) => s.economy >= 0).length * 100) / pool.length) : null;
    const baseWork = median(work);
    const baseOff = offOk ? median(off) : 0;
    const consWork = Math.min(baseWork, mean(work));
    const consOff = offOk ? Math.min(0, median(off)) : 0;
    const optWork = Math.max(baseWork, optimistic(work));
    const optOff = offOk ? Math.max(baseOff, optimistic(off)) : 0;
    const make = (id, label, note, pw, po) => ({
        id, label, note, perWork: pw, perOff: po,
        totals: {
            30: pw * counts[30].work + po * counts[30].off,
            182: pw * counts[182].work + po * counts[182].off,
            365: pw * counts[365].work + po * counts[365].off,
        },
    });
    return {
        enough,
        samples: pool.length,
        work: work.length,
        off: off.length,
        adherence,
        counts,
        stayOnly: stayOnly && cal.stays.length > 0,
        scenarios: [
            make('conservative', 'Консервативний', 'Економія повторюється лише в робочі дні; перевитрати вихідних враховано, їхню економію — ні.', consWork, consOff),
            make('base', 'Базовий', 'Медіанний результат твоїх днів окремо для робочих і вихідних.', baseWork, baseOff),
            make('optimistic', 'Оптимістичний', 'Ти тримаєшся плану на 20 відсоткових пунктів частіше, ніж зараз.', optWork, optOff),
        ],
    };
}
function illustrate(daily, cal, today, stayOnly = false) {
    const c = horizonCounts(cal, today, stayOnly);
    return {
        30: { amount: daily * c[30].work, work: c[30].work },
        182: { amount: daily * c[182].work, work: c[182].work },
        365: { amount: daily * c[365].work, work: c[365].work },
    };
}
function savingsPace(ix, today, windowDays = 30) {
    const from = (0, time_ts_1.addDays)(today, -(windowDays - 1));
    const list = ix.all.filter((o) => (o.type === 'saving' || o.type === 'withdrawal') && o.date >= from && o.date <= today);
    const transfers = list.filter((o) => o.type === 'saving').length;
    if (transfers < 2)
        return null;
    const first = ix.all.filter((o) => o.type === 'saving').reduce((m, o) => (o.date < m ? o.date : m), today);
    const spanStart = first > from ? first : from;
    const span = Math.round((Date.UTC(+today.slice(0, 4), +today.slice(5, 7) - 1, +today.slice(8, 10)) - Date.UTC(+spanStart.slice(0, 4), +spanStart.slice(5, 7) - 1, +spanStart.slice(8, 10))) / 86_400_000) + 1;
    if (span < 14)
        return null;
    const net = list.reduce((s, o) => s + (o.type === 'saving' ? o.amount : -o.amount), 0);
    return { perDay: Math.round(net / span), transfers, span };
}
};

// ── advice.tsx
defs["advice.js"] = function (require, exports, module) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdviceCard = AdviceCard;
exports.openDaySummary = openDaySummary;
exports.openSaveSheet = openSaveSheet;
const dom_ts_1 = require("./dom.js");
const icons_ts_1 = require("./icons.js");
const ui_tsx_1 = require("./ui.js");
const forms_tsx_1 = require("./forms.js");
const view_ts_1 = require("./view.js");
const ledger_ts_1 = require("./ledger.js");
const budget_ts_1 = require("./budget.js");
const insights_ts_1 = require("./insights.js");
const forecast_ts_1 = require("./forecast.js");
const money_ts_1 = require("./money.js");
const time_ts_1 = require("./time.js");
function AdviceCard(p) {
    const a = p.advice;
    return ((0, dom_ts_1.h)("article", { class: (0, dom_ts_1.cx)('advice', `advice-${a.tone}`), "aria-label": "\u041F\u043E\u0440\u0430\u0434\u0430 \u0434\u043D\u044F \u0432\u0456\u0434 \u0444\u0456\u043D\u0430\u043D\u0441\u043E\u0432\u043E\u0433\u043E \u043D\u0430\u0441\u0442\u0430\u0432\u043D\u0438\u043A\u0430" },
        (0, dom_ts_1.h)("p", { class: "advice-kicker" },
            (0, icons_ts_1.icon)('spark', 16),
            "\u041F\u043E\u0440\u0430\u0434\u0430 \u0434\u043D\u044F \u0432\u0456\u0434 \u0444\u0456\u043D\u0430\u043D\u0441\u043E\u0432\u043E\u0433\u043E \u043D\u0430\u0441\u0442\u0430\u0432\u043D\u0438\u043A\u0430"),
        (0, dom_ts_1.h)("h3", { class: "advice-author" }, a.author),
        (0, dom_ts_1.h)("p", { class: "advice-principle" }, a.principle),
        (0, dom_ts_1.h)("p", { class: "advice-source" },
            "\u041F\u0440\u0438\u043D\u0446\u0438\u043F \u0437\u0430 \u043C\u043E\u0442\u0438\u0432\u0430\u043C\u0438 \u043F\u0456\u0434\u0445\u043E\u0434\u0443 ",
            a.authorGen),
        (0, dom_ts_1.h)("div", { class: "advice-block" },
            (0, dom_ts_1.h)("span", { class: "advice-label" }, "\u0427\u043E\u043C\u0443 \u0441\u0430\u043C\u0435 \u0441\u044C\u043E\u0433\u043E\u0434\u043D\u0456"),
            (0, dom_ts_1.h)("p", null, a.why)),
        (0, dom_ts_1.h)("div", { class: "advice-block" },
            (0, dom_ts_1.h)("span", { class: "advice-label" }, "\u041A\u0440\u043E\u043A \u043D\u0430 \u0437\u0430\u0432\u0442\u0440\u0430"),
            (0, dom_ts_1.h)("p", null, a.step)),
        a.effect && !p.compact ? ((0, dom_ts_1.h)("div", { class: "advice-effect" },
            (0, icons_ts_1.icon)('sprout', 18),
            (0, dom_ts_1.h)("p", null,
                a.effect,
                (0, dom_ts_1.h)("span", { class: "hint" }, " \u0426\u0435 \u043E\u0446\u0456\u043D\u043A\u0430, \u0430 \u043D\u0435 \u0433\u0430\u0440\u0430\u043D\u0442\u043E\u0432\u0430\u043D\u0438\u0439 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442.")))) : null));
}
function openDaySummary(date) {
    (0, ui_tsx_1.openSheet)({
        title: 'Підсумок дня',
        tall: true,
        live: true,
        render: (close) => {
            const { data, ix, cats, today } = (0, view_ts_1.derived)();
            const rec = data.days[date];
            const c = (0, ledger_ts_1.calcDay)(ix, date, rec, cats);
            const big = (0, insights_ts_1.biggestCategory)(c, cats);
            const best = (0, insights_ts_1.bestAction)({ ix, days: data.days, cats, settings: data.settings, today, date, calc: c });
            const isToday = date === today;
            const bv = (0, budget_ts_1.budgetView)({ ix, settings: data.settings, days: data.days, today, todayCalc: (0, ledger_ts_1.calcDay)(ix, today, data.days[today], cats), todayClosed: Boolean(data.days[today]?.closed) });
            const f = (0, forecast_ts_1.forecast)((0, forecast_ts_1.collectSamples)(ix, data.days, cats, data.settings.calendar, today), data.settings.calendar, today, data.settings.forecastStayOnly);
            const base = f.scenarios.find((s) => s.id === 'base');
            const ill = c.economy && c.economy > 0 ? (0, forecast_ts_1.illustrate)(c.economy, data.settings.calendar, today, data.settings.forecastStayOnly) : null;
            const rel = (0, time_ts_1.relLabel)(date, today);
            const rows = Object.keys({ ...c.planByCat, ...c.byCat }).map((id) => ({ id, plan: c.planByCat[id] ?? 0, fact: c.byCat[id] ?? 0 }));
            return ((0, dom_ts_1.h)("div", { class: "stack" },
                (0, dom_ts_1.h)("p", { class: "kicker" }, rel ? `${rel}, ${(0, time_ts_1.fmtDate)(date)}` : (0, time_ts_1.fmtDate)(date, { weekday: true })),
                (0, dom_ts_1.h)("div", { class: "summary-hero" },
                    (0, dom_ts_1.h)("div", null,
                        (0, dom_ts_1.h)("span", { class: "summary-k" }, "\u0412\u0438\u0442\u0440\u0430\u0447\u0435\u043D\u043E"),
                        (0, dom_ts_1.h)("span", { class: "summary-v num" }, (0, money_ts_1.fmt)(c.spent))),
                    c.plan ? ((0, dom_ts_1.h)("div", null,
                        (0, dom_ts_1.h)("span", { class: "summary-k" }, "\u041F\u043B\u0430\u043D"),
                        (0, dom_ts_1.h)("span", { class: "summary-v num muted" }, (0, money_ts_1.fmt)(c.planTotal)))) : null,
                    c.plan ? ((0, dom_ts_1.h)("div", null,
                        (0, dom_ts_1.h)("span", { class: "summary-k" }, c.over > 0 ? 'Понад план' : 'Економія'),
                        (0, dom_ts_1.h)("span", { class: (0, dom_ts_1.cx)('summary-v num', c.over > 0 ? 'neg' : 'pos') }, (0, money_ts_1.fmt)(c.over > 0 ? c.over : c.economy ?? 0)))) : null),
                c.plan ? ((0, dom_ts_1.h)(ui_tsx_1.Group, { title: "\u041F\u043B\u0430\u043D \u043F\u0440\u043E\u0442\u0438 \u0444\u0430\u043A\u0442\u0443" }, rows.map((r) => {
                    const cat = (0, view_ts_1.catOf)(cats, r.id);
                    const d = r.plan - r.fact;
                    return (0, dom_ts_1.h)(ui_tsx_1.Row, { icon: cat.icon, color: cat.color, title: cat.name, sub: `план ${(0, money_ts_1.fmt)(r.plan)}`, value: (0, money_ts_1.fmt)(r.fact), right: (0, dom_ts_1.h)("span", { class: (0, dom_ts_1.cx)('diff', d < 0 ? 'neg' : d > 0 ? 'pos' : 'muted') }, d === 0 ? '0' : (0, money_ts_1.fmt)(d, { sign: true })) });
                }))) : (0, dom_ts_1.h)(ui_tsx_1.Note, { tone: "info" }, "\u0426\u044C\u043E\u0433\u043E \u0434\u043D\u044F \u043F\u043B\u0430\u043D\u0443 \u043D\u0435 \u0431\u0443\u043B\u043E \u2014 \u043F\u043E\u0440\u0456\u0432\u043D\u044F\u043D\u043D\u044F \u0437 \u043F\u043B\u0430\u043D\u043E\u043C \u043D\u0435\u043C\u0430\u0454."),
                (0, dom_ts_1.h)(ui_tsx_1.Group, null,
                    big ? (0, dom_ts_1.h)(ui_tsx_1.Row, { icon: "bars", title: "\u041D\u0430\u0439\u0431\u0456\u043B\u044C\u0448\u0430 \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0456\u044F", value: `${big.name} · ${(0, money_ts_1.fmt)(big.amount)}` }) : null,
                    best ? (0, dom_ts_1.h)(ui_tsx_1.Row, { icon: "star", title: "\u0413\u043E\u043B\u043E\u0432\u043D\u0430 \u0432\u0434\u0430\u043B\u0430 \u0434\u0456\u044F", sub: best }) : null,
                    c.saved !== 0 ? (0, dom_ts_1.h)(ui_tsx_1.Row, { icon: "coins", title: "\u0412\u0456\u0434\u043A\u043B\u0430\u0434\u0435\u043D\u043E", value: (0, money_ts_1.fmt)(c.saved), valueTone: "pos" }) : null,
                    c.foodCost > 0 ? (0, dom_ts_1.h)(ui_tsx_1.Row, { icon: "utensils", title: "\u0421\u043E\u0431\u0456\u0432\u0430\u0440\u0442\u0456\u0441\u0442\u044C \u0445\u0430\u0440\u0447\u0443\u0432\u0430\u043D\u043D\u044F", sub: "\u0420\u043E\u0437\u0440\u0430\u0445\u0443\u043D\u043A\u043E\u0432\u043E, \u043D\u0435 \u0440\u0443\u0445 \u0433\u0440\u043E\u0448\u0435\u0439", value: (0, money_ts_1.fmt)(c.foodCost) }) : null,
                    bv.status === 'ok' ? (0, dom_ts_1.h)(ui_tsx_1.Row, { icon: "shield", title: "\u0414\u043E\u0441\u0442\u0443\u043F\u043D\u0438\u0439 \u0440\u0435\u0437\u0435\u0440\u0432", sub: `Вільні кошти після обовʼязкових платежів і потреб до ${(0, time_ts_1.fmtDate)(bv.horizonEnd)}`, value: (0, money_ts_1.fmt)(bv.free ?? 0) })
                        : bv.status === 'deficit' ? (0, dom_ts_1.h)(ui_tsx_1.Row, { icon: "info", title: "\u0420\u0435\u0437\u0435\u0440\u0432", sub: "\u0411\u0440\u0430\u043A\u0443\u0454 \u043D\u0430 \u043E\u0431\u043E\u0432\u02BC\u044F\u0437\u043A\u043E\u0432\u0456 \u043F\u043B\u0430\u0442\u0435\u0436\u0456", value: (0, money_ts_1.fmt)(-bv.shortfall), valueTone: "neg" })
                            : (0, dom_ts_1.h)(ui_tsx_1.Row, { icon: "shield", title: "\u0414\u043E\u0441\u0442\u0443\u043F\u043D\u0438\u0439 \u0440\u0435\u0437\u0435\u0440\u0432", sub: "\u0412\u043A\u0430\u0436\u0438 \u0437\u0430\u043B\u0438\u0448\u043E\u043A \u0456 \u0434\u043E\u0445\u043E\u0434\u0438 \u0432 \u043D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F\u0445", value: "\u2014" })),
                (0, dom_ts_1.h)(ui_tsx_1.Group, { title: "\u041E\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0439 \u043F\u0440\u043E\u0433\u043D\u043E\u0437 \u043D\u0430\u043A\u043E\u043F\u0438\u0447\u0435\u043D\u044C" }, f.enough
                    ? (0, dom_ts_1.h)(ui_tsx_1.Row, { icon: "sprout", title: "30 \u0434\u043D\u0456\u0432, \u0431\u0430\u0437\u043E\u0432\u0438\u0439 \u0441\u0446\u0435\u043D\u0430\u0440\u0456\u0439", sub: `Днів спостережень: ${f.samples}`, value: (0, money_ts_1.fmt)(base.totals[30]), valueTone: base.totals[30] >= 0 ? 'pos' : 'neg' })
                    : ill ? (0, dom_ts_1.h)(ui_tsx_1.Row, { icon: "sprout", title: "\u042F\u043A\u0449\u043E \u043F\u043E\u0432\u0442\u043E\u0440\u044E\u0432\u0430\u0442\u0438 \u0442\u0430\u043A\u0443 \u0435\u043A\u043E\u043D\u043E\u043C\u0456\u044E", sub: `У ${ill[30].work} робочих днів найближчого місяця, умовно`, value: (0, money_ts_1.fmt)(ill[30].amount), valueTone: "pos" })
                        : (0, dom_ts_1.h)(ui_tsx_1.Row, { icon: "sprout", title: "\u041F\u0440\u043E\u0433\u043D\u043E\u0437", sub: "\u041F\u043E\u0442\u0440\u0456\u0431\u043D\u043E \u043A\u0456\u043B\u044C\u043A\u0430 \u0434\u043D\u0456\u0432 \u0456\u0437 \u043F\u043B\u0430\u043D\u043E\u043C, \u0449\u043E\u0431 \u043F\u0440\u043E\u0433\u043D\u043E\u0437 \u043C\u0430\u0432 \u0441\u0435\u043D\u0441", value: "\u2014" })),
                rec?.advice ? (0, dom_ts_1.h)(AdviceCard, { advice: rec.advice }) : null,
                isToday && bv.status === 'ok' && (bv.safe ?? 0) > 0 && c.saved <= 0 ? ((0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "primary", size: "lg", full: true, icon: "coins", onClick: () => openSaveSheet() },
                    "\u0412\u0456\u0434\u043A\u043B\u0430\u0441\u0442\u0438 ",
                    (0, money_ts_1.fmt)(bv.safe ?? 0))) : null,
                (0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "secondary", size: "lg", full: true, onClick: () => { close(); (0, view_ts_1.go)('day'); } }, "\u0413\u043E\u0442\u043E\u0432\u043E")));
        },
    });
}
function openSaveSheet() {
    const { today } = (0, view_ts_1.derived)();
    (0, ui_tsx_1.openSheet)({
        title: 'Відкласти гроші',
        render: (close) => (0, dom_ts_1.h)(forms_tsx_1.MoreForm, { date: today, kind: "saving", onDone: (op) => { close(); if (op)
                (0, forms_tsx_1.addedToast)(op); } }),
    });
}
};

// ── plan.tsx
defs["plan.js"] = function (require, exports, module) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinesEditor = LinesEditor;
exports.openPlanEditor = openPlanEditor;
exports.openTemplateEditor = openTemplateEditor;
exports.TemplateChips = TemplateChips;
const dom_ts_1 = require("./dom.js");
const icons_ts_1 = require("./icons.js");
const ui_tsx_1 = require("./ui.js");
const store_ts_1 = require("./store.js");
const view_ts_1 = require("./view.js");
const defaults_ts_1 = require("./defaults.js");
const ledger_ts_1 = require("./ledger.js");
const money_ts_1 = require("./money.js");
const time_ts_1 = require("./time.js");
function LinesEditor(p) {
    const { data } = (0, view_ts_1.derived)();
    const cats = data.categories.filter((c) => !c.hidden && c.id !== 'bills');
    const lines = p.lines;
    const total = (0, dom_ts_1.live)(() => (0, dom_ts_1.h)("div", { class: "lines-total" },
        (0, dom_ts_1.h)("span", null, "\u0420\u0430\u0437\u043E\u043C"),
        (0, dom_ts_1.h)("b", { class: "num" }, (0, money_ts_1.fmt)((0, ledger_ts_1.planTotal)(lines)))));
    const list = (0, dom_ts_1.live)(() => ((0, dom_ts_1.h)("div", { class: "lines" },
        lines.map((l, i) => ((0, dom_ts_1.h)("div", { class: "line" },
            (0, dom_ts_1.h)(ui_tsx_1.TextInput, { value: l.label, placeholder: "\u041D\u0430\u0437\u0432\u0430", label: "\u041D\u0430\u0437\u0432\u0430 \u0440\u044F\u0434\u043A\u0430", onChange: (v) => { l.label = v; p.onChange(lines); } }),
            (0, dom_ts_1.h)("div", { class: "line-row" },
                (0, dom_ts_1.h)(ui_tsx_1.Select, { value: l.category, label: "\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0456\u044F", options: cats.map((c) => ({ value: c.id, label: c.name })), onChange: (v) => { l.category = v; p.onChange(lines); } }),
                (0, dom_ts_1.h)(ui_tsx_1.MoneyInput, { value: l.amount, label: "\u0421\u0443\u043C\u0430", onChange: (v) => { l.amount = v ?? 0; p.onChange(lines); total.refresh(); } }),
                (0, dom_ts_1.h)(ui_tsx_1.IconBtn, { icon: "trash", label: "\u041F\u0440\u0438\u0431\u0440\u0430\u0442\u0438 \u0440\u044F\u0434\u043E\u043A", onClick: () => { lines.splice(i, 1); p.onChange(lines); list.refresh(); total.refresh(); } }))))),
        !lines.length ? (0, dom_ts_1.h)("p", { class: "hint" }, "\u0420\u044F\u0434\u043A\u0456\u0432 \u043F\u043E\u043A\u0438 \u043D\u0435\u043C\u0430\u0454.") : null)));
    return ((0, dom_ts_1.h)("div", { class: "stack-sm" },
        list.el,
        (0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "tinted", icon: "plus", onClick: () => { lines.push({ id: (0, defaults_ts_1.uid)('l-'), label: '', category: 'other', amount: 0 }); p.onChange(lines); list.refresh(); } }, "\u0414\u043E\u0434\u0430\u0442\u0438 \u0440\u044F\u0434\u043E\u043A"),
        total.el));
}
function openPlanEditor(date) {
    const { data } = (0, view_ts_1.derived)();
    const rec = data.days[date];
    let lines = (0, defaults_ts_1.clone)(rec?.plan ?? []);
    let templateId = rec?.templateId;
    (0, ui_tsx_1.openSheet)({
        title: `План на ${(0, time_ts_1.fmtDate)(date)}`,
        tall: true,
        render: (close) => {
            const editor = (0, dom_ts_1.live)(() => (0, dom_ts_1.h)(LinesEditor, { lines: lines, onChange: (l) => { lines = l; } }));
            return ((0, dom_ts_1.h)("div", { class: "stack" },
                (0, dom_ts_1.h)("div", null,
                    (0, dom_ts_1.h)("p", { class: "field-label" }, "\u041F\u043E\u0447\u0430\u0442\u0438 \u0437 \u0448\u0430\u0431\u043B\u043E\u043D\u0443"),
                    (0, dom_ts_1.h)("div", { class: "chips chips-wrap" }, data.templates.map((t) => ((0, dom_ts_1.h)(ui_tsx_1.Chip, { icon: "list", onClick: () => { lines = (0, defaults_ts_1.clone)(t.lines); templateId = t.id; editor.refresh(); } },
                        t.name,
                        " \u00B7 ",
                        (0, money_ts_1.fmt)((0, ledger_ts_1.planTotal)(t.lines))))))),
                (0, dom_ts_1.h)("p", { class: "hint" }, "\u0421\u0443\u043C\u0438 \u0432 \u0448\u0430\u0431\u043B\u043E\u043D\u0430\u0445 \u2014 \u043F\u0440\u0438\u043A\u043B\u0430\u0434, \u0430 \u043D\u0435 \u0430\u043A\u0442\u0443\u0430\u043B\u044C\u043D\u0456 \u0446\u0456\u043D\u0438. \u0417\u043C\u0456\u043D\u0438 \u0457\u0445 \u043F\u0456\u0434 \u0441\u0435\u0431\u0435."),
                editor.el,
                (0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "primary", size: "lg", full: true, onClick: () => {
                        const clean = lines.filter((l) => l.label.trim() || l.amount > 0).map((l) => ({ ...l, label: l.label.trim() || 'Без назви' }));
                        (0, store_ts_1.setDayPlan)(date, clean.length ? clean : null, templateId && sameAsTemplate(clean, templateId) ? 'template' : 'manual', templateId);
                        close();
                        (0, ui_tsx_1.toast)(clean.length ? `План збережено: ${(0, money_ts_1.fmt)((0, ledger_ts_1.planTotal)(clean))}` : 'План прибрано.');
                    } }, "\u0417\u0431\u0435\u0440\u0435\u0433\u0442\u0438 \u043F\u043B\u0430\u043D"),
                (0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "ghost", size: "md", full: true, icon: "copy", onClick: () => saveAsTemplate(lines) }, "\u0417\u0431\u0435\u0440\u0435\u0433\u0442\u0438 \u044F\u043A \u0448\u0430\u0431\u043B\u043E\u043D"),
                rec?.plan ? ((0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "ghost", size: "md", full: true, icon: "trash", onClick: () => (0, ui_tsx_1.confirmSheet)({
                        title: 'Прибрати план?',
                        text: 'Записані витрати залишаться, зникне лише порівняння з планом.',
                        confirm: 'Прибрати план',
                        danger: true,
                        onConfirm: () => { (0, store_ts_1.setDayPlan)(date, null, undefined); close(); },
                    }) }, "\u041F\u0440\u0438\u0431\u0440\u0430\u0442\u0438 \u043F\u043B\u0430\u043D")) : null));
        },
    });
}
function sameAsTemplate(lines, id) {
    const t = (0, view_ts_1.derived)().data.templates.find((x) => x.id === id);
    return Boolean(t) && JSON.stringify(t.lines) === JSON.stringify(lines);
}
function saveAsTemplate(lines) {
    let name = '';
    (0, ui_tsx_1.openSheet)({
        title: 'Новий шаблон',
        render: (close) => ((0, dom_ts_1.h)("div", { class: "stack" },
            (0, dom_ts_1.h)(ui_tsx_1.TextInput, { value: "", placeholder: "\u041D\u0430\u0437\u0432\u0430 \u0448\u0430\u0431\u043B\u043E\u043D\u0443", label: "\u041D\u0430\u0437\u0432\u0430 \u0448\u0430\u0431\u043B\u043E\u043D\u0443", onChange: (v) => { name = v; } }),
            (0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "primary", size: "lg", full: true, onClick: () => {
                    if (!name.trim())
                        return (0, ui_tsx_1.toast)('Вкажи назву шаблону.');
                    const { data } = (0, view_ts_1.derived)();
                    const t = { id: (0, defaults_ts_1.uid)('tpl-'), name: name.trim(), lines: (0, defaults_ts_1.clone)(lines).filter((l) => l.label.trim() || l.amount > 0) };
                    (0, store_ts_1.saveList)('templates', [...data.templates, t]);
                    close();
                    (0, ui_tsx_1.toast)(`Шаблон «${t.name}» збережено.`);
                } }, "\u0417\u0431\u0435\u0440\u0435\u0433\u0442\u0438 \u0448\u0430\u0431\u043B\u043E\u043D"))),
    });
}
function openTemplateEditor(t) {
    const { data } = (0, view_ts_1.derived)();
    const draft = t ? (0, defaults_ts_1.clone)(t) : { id: (0, defaults_ts_1.uid)('tpl-'), name: '', lines: [] };
    (0, ui_tsx_1.openSheet)({
        title: t ? 'Шаблон' : 'Новий шаблон',
        tall: true,
        render: (close) => ((0, dom_ts_1.h)("div", { class: "stack" },
            (0, dom_ts_1.h)(ui_tsx_1.TextInput, { value: draft.name, placeholder: "\u041D\u0430\u0437\u0432\u0430 \u0448\u0430\u0431\u043B\u043E\u043D\u0443", label: "\u041D\u0430\u0437\u0432\u0430 \u0448\u0430\u0431\u043B\u043E\u043D\u0443", onChange: (v) => { draft.name = v; } }),
            draft.builtin ? (0, dom_ts_1.h)(ui_tsx_1.Note, { tone: "info" }, "\u0421\u0443\u043C\u0438 \u2014 \u043B\u0438\u0448\u0435 \u043F\u0440\u0438\u043A\u043B\u0430\u0434. \u0417\u043C\u0456\u043D\u0438 \u0457\u0445 \u043F\u0456\u0434 \u0441\u0432\u043E\u0457 \u0440\u0435\u0430\u043B\u044C\u043D\u0456 \u0432\u0438\u0442\u0440\u0430\u0442\u0438.") : null,
            (0, dom_ts_1.h)(LinesEditor, { lines: draft.lines, onChange: (l) => { draft.lines = l; } }),
            (0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "primary", size: "lg", full: true, onClick: () => {
                    if (!draft.name.trim())
                        return (0, ui_tsx_1.toast)('Вкажи назву шаблону.');
                    draft.name = draft.name.trim();
                    draft.lines = draft.lines.filter((l) => l.label.trim() || l.amount > 0).map((l) => ({ ...l, label: l.label.trim() || 'Без назви' }));
                    const list = (0, view_ts_1.derived)().data.templates;
                    (0, store_ts_1.saveList)('templates', list.some((x) => x.id === draft.id) ? list.map((x) => (x.id === draft.id ? draft : x)) : [...list, draft]);
                    close();
                    (0, ui_tsx_1.toast)('Шаблон збережено.');
                } }, "\u0417\u0431\u0435\u0440\u0435\u0433\u0442\u0438"),
            t ? ((0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "ghost", full: true, icon: "trash", onClick: () => (0, ui_tsx_1.confirmSheet)({
                    title: 'Видалити шаблон?',
                    text: `Шаблон «${t.name}» зникне. Плани днів, складені з нього раніше, залишаться.`,
                    confirm: 'Видалити',
                    danger: true,
                    onConfirm: () => {
                        (0, store_ts_1.saveList)('templates', data.templates.filter((x) => x.id !== t.id));
                        close();
                    },
                }) }, "\u0412\u0438\u0434\u0430\u043B\u0438\u0442\u0438 \u0448\u0430\u0431\u043B\u043E\u043D")) : null)),
    });
}
function TemplateChips(p) {
    const { data } = (0, view_ts_1.derived)();
    return ((0, dom_ts_1.h)("div", { class: "tpl-grid" },
        data.templates.map((t) => ((0, dom_ts_1.h)("button", { type: "button", class: "tpl", onClick: () => { (0, store_ts_1.setDayPlan)(p.date, (0, defaults_ts_1.clone)(t.lines), 'template', t.id); (0, ui_tsx_1.toast)(`План «${t.name}» — ${(0, money_ts_1.fmt)((0, ledger_ts_1.planTotal)(t.lines))}`); } },
            (0, dom_ts_1.h)("span", { class: "tpl-name" }, t.name),
            (0, dom_ts_1.h)("span", { class: "tpl-sum num" }, (0, money_ts_1.fmt)((0, ledger_ts_1.planTotal)(t.lines)))))),
        (0, dom_ts_1.h)("button", { type: "button", class: "tpl tpl-own", onClick: () => openPlanEditor(p.date) },
            (0, icons_ts_1.icon)('edit', 18),
            (0, dom_ts_1.h)("span", { class: "tpl-name" }, "\u0412\u043B\u0430\u0441\u043D\u0438\u0439 \u043F\u043B\u0430\u043D"))));
}
};

// ── DayScreen.tsx
defs["DayScreen.js"] = function (require, exports, module) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentDayDate = currentDayDate;
exports.DayScreen = DayScreen;
const dom_ts_1 = require("./dom.js");
const icons_ts_1 = require("./icons.js");
const ui_tsx_1 = require("./ui.js");
const charts_tsx_1 = require("./charts.js");
const forms_tsx_1 = require("./forms.js");
const advice_tsx_1 = require("./advice.js");
const plan_tsx_1 = require("./plan.js");
const store_ts_1 = require("./store.js");
const view_ts_1 = require("./view.js");
const ledger_ts_1 = require("./ledger.js");
const budget_ts_1 = require("./budget.js");
const forecast_ts_1 = require("./forecast.js");
const insights_ts_1 = require("./insights.js");
const goals_ts_1 = require("./goals.js");
const money_ts_1 = require("./money.js");
const time_ts_1 = require("./time.js");
function currentDayDate() {
    const { today } = (0, view_ts_1.derived)();
    return view_ts_1.ui.dayDate && view_ts_1.ui.dayDate !== today ? view_ts_1.ui.dayDate : today;
}
function DayScreen() {
    const { data, ix, cats, today, state } = (0, view_ts_1.derived)();
    const date = currentDayDate();
    const rec = data.days[date];
    const c = (0, ledger_ts_1.calcDay)(ix, date, rec, cats);
    const status = (0, ledger_ts_1.dayStatus)(date, today, rec, c.hasData);
    const isToday = date === today;
    const future = date > today;
    const todayCalc = isToday ? c : (0, ledger_ts_1.calcDay)(ix, today, data.days[today], cats);
    const bv = (0, budget_ts_1.budgetView)({ ix, settings: data.settings, days: data.days, today, todayCalc, todayClosed: Boolean(data.days[today]?.closed) });
    const rel = (0, time_ts_1.relLabel)(date, today);
    const yesterday = (0, time_ts_1.addDays)(today, -1);
    const yRec = data.days[yesterday];
    const showYesterday = isToday && !view_ts_1.ui.dismissed['y:' + yesterday] && (ix.byDate.get(yesterday)?.length ?? 0) > 0 && !yRec?.closed;
    const statusText = {
        closed: 'День завершено',
        recorded: 'Є записи, підсумок не підбито',
        missing: 'Немає даних — це не те саме, що день без витрат',
        future: 'Майбутній день: можна скласти план',
    };
    return ((0, dom_ts_1.h)("div", { class: "screen day" },
        (0, dom_ts_1.h)("header", { class: "day-head" },
            (0, dom_ts_1.h)("div", { class: "day-top" },
                (0, dom_ts_1.h)("p", { class: "kicker" },
                    (0, time_ts_1.cap)(time_ts_1.WEEKDAYS[(0, time_ts_1.weekday)(date)]),
                    state.demo ? (0, dom_ts_1.h)("span", { class: "demo-badge" }, "\u0414\u0435\u043C\u043E") : null),
                (0, dom_ts_1.h)("div", { class: "day-nav" },
                    (0, dom_ts_1.h)(ui_tsx_1.IconBtn, { icon: "chevronLeft", label: "\u041F\u043E\u043F\u0435\u0440\u0435\u0434\u043D\u0456\u0439 \u0434\u0435\u043D\u044C", onClick: () => (0, view_ts_1.setUI)({ dayDate: (0, time_ts_1.addDays)(date, -1) }) }),
                    !isToday ? (0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "tinted", size: "sm", onClick: () => (0, view_ts_1.setUI)({ dayDate: null }) }, "\u0421\u044C\u043E\u0433\u043E\u0434\u043D\u0456") : null,
                    (0, dom_ts_1.h)(ui_tsx_1.IconBtn, { icon: "chevronRight", label: "\u041D\u0430\u0441\u0442\u0443\u043F\u043D\u0438\u0439 \u0434\u0435\u043D\u044C", disabled: date >= (0, time_ts_1.addDays)(today, 7), onClick: () => (0, view_ts_1.setUI)({ dayDate: (0, time_ts_1.addDays)(date, 1) }) }))),
            (0, dom_ts_1.h)("h1", { class: "h1" }, rel ? `${rel}, ${(0, time_ts_1.fmtDate)(date)}` : (0, time_ts_1.fmtDate)(date))),
        !isToday && statusText[status] ? (0, dom_ts_1.h)("p", { class: (0, dom_ts_1.cx)('day-status', `st-${status}`) }, statusText[status]) : null,
        showYesterday ? ((0, dom_ts_1.h)("div", { class: "callout" },
            (0, icons_ts_1.icon)('moon', 18),
            (0, dom_ts_1.h)("span", null, "\u0423\u0447\u043E\u0440\u0430 \u0437\u0430\u043F\u0438\u0441\u0438 \u0454, \u0430 \u043F\u0456\u0434\u0441\u0443\u043C\u043E\u043A \u043D\u0435 \u043F\u0456\u0434\u0431\u0438\u0442\u043E."),
            (0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "tinted", size: "sm", onClick: () => { (0, store_ts_1.closeDayAction)(yesterday); (0, advice_tsx_1.openDaySummary)(yesterday); } }, "\u041F\u0456\u0434\u0431\u0438\u0442\u0438"),
            (0, dom_ts_1.h)(ui_tsx_1.IconBtn, { icon: "x", label: "\u0421\u0445\u043E\u0432\u0430\u0442\u0438", onClick: () => { view_ts_1.ui.dismissed['y:' + yesterday] = true; (0, view_ts_1.setUI)({}); } }))) : null,
        (0, dom_ts_1.h)(Hero, { c: c, date: date, closed: Boolean(rec?.closed), future: future }),
        !future ? (0, dom_ts_1.h)(Ladder, { c: c, bv: bv, isToday: isToday, closed: Boolean(rec?.closed) }) : null,
        !future ? (0, dom_ts_1.h)(QuickBar, { date: date, c: c, data: data }) : null,
        (0, dom_ts_1.h)(Outlook, { c: c, date: date, data: data, closed: Boolean(rec?.closed), future: future }),
        (0, dom_ts_1.h)(Tiles, { c: c, date: date, future: future, data: data }),
        (0, dom_ts_1.h)(PlanBlock, { c: c, date: date }),
        !future ? (0, dom_ts_1.h)(Insights, { date: date, c: c }) : null,
        (0, dom_ts_1.h)(WeekChart, { date: date }),
        !future ? (0, dom_ts_1.h)(OpsBlock, { c: c, date: date, isToday: isToday }) : null,
        !future && (c.foodCost > 0 || c.bills > 0) ? ((0, dom_ts_1.h)(ui_tsx_1.Group, { title: "\u041E\u043A\u0440\u0435\u043C\u043E \u0432\u0456\u0434 \u0434\u0435\u043D\u043D\u043E\u0433\u043E \u0431\u044E\u0434\u0436\u0435\u0442\u0443" },
            c.foodCost > 0 ? (0, dom_ts_1.h)(ui_tsx_1.Row, { icon: "utensils", title: "\u0420\u0435\u0430\u043B\u044C\u043D\u0438\u0439 \u0440\u0443\u0445 \u0433\u0440\u043E\u0448\u0435\u0439 \u043D\u0430 \u0457\u0436\u0443", sub: "\u041F\u0440\u043E\u0434\u0443\u043A\u0442\u0438 \u0442\u0430 \u0457\u0436\u0430 \u043F\u043E\u0437\u0430 \u0434\u043E\u043C\u043E\u043C", value: (0, money_ts_1.fmt)(c.foodCash) }) : null,
            c.foodCost > 0 ? (0, dom_ts_1.h)(ui_tsx_1.Row, { icon: "lunchbox", title: "\u0421\u043E\u0431\u0456\u0432\u0430\u0440\u0442\u0456\u0441\u0442\u044C \u0445\u0430\u0440\u0447\u0443\u0432\u0430\u043D\u043D\u044F", sub: "\u0421\u043A\u0456\u043B\u044C\u043A\u0438 \u043A\u043E\u0448\u0442\u0443\u0432\u0430\u043B\u043E \u0442\u0435, \u0449\u043E \u0437\u02BC\u0457\u0434\u0435\u043D\u043E (\u0440\u043E\u0437\u0440\u0430\u0445\u0443\u043D\u043A\u043E\u0432\u043E)", value: (0, money_ts_1.fmt)(c.foodCost), valueTone: "muted" }) : null,
            c.bills > 0 ? (0, dom_ts_1.h)(ui_tsx_1.Row, { icon: "doc", title: "\u041E\u0431\u043E\u0432\u02BC\u044F\u0437\u043A\u043E\u0432\u0456 \u043F\u043B\u0430\u0442\u0435\u0436\u0456", sub: "\u0420\u0435\u0437\u0435\u0440\u0432\u0443\u044E\u0442\u044C\u0441\u044F \u043E\u043A\u0440\u0435\u043C\u043E, \u043F\u043B\u0430\u043D \u0434\u043D\u044F \u043D\u0435 \u043F\u0441\u0443\u044E\u0442\u044C", value: (0, money_ts_1.fmt)(c.bills) }) : null)) : null,
        !future ? (0, dom_ts_1.h)(CloseBlock, { date: date, isToday: isToday, closed: Boolean(rec?.closed), hasAdvice: Boolean(rec?.advice) }) : null));
}
function Hero(p) {
    const { c, date } = p;
    const hasPlan = c.plan !== null;
    const frac = hasPlan && c.planTotal > 0 ? c.spent / c.planTotal : null;
    const tone = !hasPlan ? 'none' : c.over > 0 ? 'over' : (c.usedPct ?? 0) >= 85 ? 'warn' : 'ok';
    let msg;
    if (p.future)
        msg = hasPlan ? 'План на цей день уже готовий.' : 'Можна заздалегідь скласти план цього дня.';
    else if (!hasPlan)
        msg = c.spent > 0 ? 'План не складено, тож порівнювати нема з чим. Обери шаблон нижче — це один дотик.' : 'Обери шаблон плану нижче — і застосунок покаже, скільки лишилося.';
    else if (c.over > 0)
        msg = `План перевищено на ${(0, money_ts_1.fmt)(c.over)}. Так буває — увечері подивимось, що можна врахувати.`;
    else
        msg = `Використано ${c.usedPct ?? 0}% бюджету. До запланованого ліміту — ${(0, money_ts_1.fmt)(c.remaining ?? 0)}.`;
    return ((0, dom_ts_1.h)("section", { class: "hero", "aria-label": "\u041F\u0456\u0434\u0441\u0443\u043C\u043E\u043A \u0434\u043D\u044F" },
        (0, dom_ts_1.h)("div", { class: "hero-main" },
            (0, dom_ts_1.h)("div", { class: "hero-text" },
                (0, dom_ts_1.h)("span", { class: "hero-k" }, "\u0412\u0438\u0442\u0440\u0430\u0447\u0435\u043D\u043E \u0444\u0430\u043A\u0442\u0438\u0447\u043D\u043E"),
                (0, dom_ts_1.h)(ui_tsx_1.Num, { id: `spent:${date}`, value: c.spent, class: "hero-big" }),
                (0, dom_ts_1.h)("span", { class: "hero-sub" }, hasPlan ? (0, dom_ts_1.h)(dom_ts_1.Fragment, null,
                    "\u0456\u0437 ",
                    (0, dom_ts_1.h)("b", { class: "num" }, (0, money_ts_1.fmt)(c.planTotal)),
                    " \u0437\u0430\u043F\u043B\u0430\u043D\u043E\u0432\u0430\u043D\u0438\u0445") : 'без плану')),
            (0, dom_ts_1.h)(ui_tsx_1.Ring, { id: `ring:${date}`, frac: frac, tone: tone }, hasPlan
                ? (0, dom_ts_1.h)(dom_ts_1.Fragment, null,
                    (0, dom_ts_1.h)("span", { class: "ring-pct num" },
                        c.usedPct ?? 0,
                        "%"),
                    (0, dom_ts_1.h)("span", { class: "ring-cap" }, c.over > 0 ? 'понад план' : 'бюджету'))
                : (0, dom_ts_1.h)("span", { class: "ring-cap" }, "\u0431\u0435\u0437 \u043F\u043B\u0430\u043D\u0443"))),
        (0, dom_ts_1.h)("p", { class: (0, dom_ts_1.cx)('hero-msg', c.over > 0 && 'calm-warn') }, msg),
        (0, dom_ts_1.h)("div", { class: "hero-row" },
            (0, dom_ts_1.h)("div", { class: "stat" },
                (0, dom_ts_1.h)("span", { class: "stat-k" }, "\u0417\u0430\u043F\u043B\u0430\u043D\u043E\u0432\u0430\u043D\u0438\u0439 \u0431\u044E\u0434\u0436\u0435\u0442"),
                (0, dom_ts_1.h)("span", { class: "stat-v num" }, hasPlan ? (0, money_ts_1.fmt)(c.planTotal) : '—')),
            (0, dom_ts_1.h)("div", { class: "stat" },
                (0, dom_ts_1.h)("span", { class: "stat-k" }, "\u0417\u0430\u043B\u0438\u0448\u043E\u043A \u0434\u0435\u043D\u043D\u043E\u0433\u043E \u0431\u044E\u0434\u0436\u0435\u0442\u0443"),
                hasPlan ? (0, dom_ts_1.h)(ui_tsx_1.Num, { id: `left:${date}`, value: c.remaining ?? 0, class: (0, dom_ts_1.cx)('stat-v', (c.remaining ?? 0) < 0 && 'neg') }) : (0, dom_ts_1.h)("span", { class: "stat-v num" }, "\u2014")))));
}
function Outlook(p) {
    const { c, date, data } = p;
    const { ix, today } = (0, view_ts_1.derived)();
    const hasPlan = c.plan !== null;
    const cal = data.settings.calendar;
    let echo = null;
    if (hasPlan && !p.future) {
        const realized = p.closed || date < today;
        if (realized && (c.economy ?? 0) > 0) {
            const ill = (0, forecast_ts_1.illustrate)(c.economy ?? 0, cal, today, data.settings.forecastStayOnly);
            echo = ((0, dom_ts_1.h)("button", { type: "button", class: "echo", onClick: () => (0, view_ts_1.go)('future', { futureTab: 'forecast' }) },
                (0, dom_ts_1.h)("span", { class: "echo-mult", "aria-hidden": "true" }, "\u00D7365"),
                (0, dom_ts_1.h)("span", { class: "echo-text" },
                    "\u0422\u0430\u043A\u0430 \u0435\u043A\u043E\u043D\u043E\u043C\u0456\u044F \u0432 \u043A\u043E\u0436\u0435\u043D \u0440\u043E\u0431\u043E\u0447\u0438\u0439 \u0434\u0435\u043D\u044C \u2014 \u0446\u0435 \u2248 ",
                    (0, dom_ts_1.h)("b", { class: "num" }, (0, money_ts_1.fmt)(ill[365].amount)),
                    " \u0437\u0430 \u0440\u0456\u043A. ",
                    (0, dom_ts_1.h)("span", { class: "muted" },
                        "\u0423\u043C\u043E\u0432\u043D\u043E, ",
                        ill[365].work,
                        " \u0440\u043E\u0431\u043E\u0447\u0438\u0445 \u0434\u043D\u0456\u0432, \u043D\u0435 \u043F\u0440\u043E\u0433\u043D\u043E\u0437."))));
        }
        else {
            const ill = (0, forecast_ts_1.illustrate)(c.planTotal, cal, today, data.settings.forecastStayOnly);
            echo = ((0, dom_ts_1.h)("button", { type: "button", class: "echo", onClick: () => (0, view_ts_1.go)('future', { futureTab: 'whatif' }) },
                (0, dom_ts_1.h)("span", { class: "echo-mult", "aria-hidden": "true" }, "\u00D7365"),
                (0, dom_ts_1.h)("span", { class: "echo-text" },
                    "\u0422\u0430\u043A\u0438\u0439 \u043F\u043B\u0430\u043D \u0443 \u0440\u043E\u0431\u043E\u0447\u0456 \u0434\u043D\u0456 \u0440\u043E\u043A\u0443 \u2014 \u0446\u0435 ",
                    (0, dom_ts_1.h)("b", { class: "num" }, (0, money_ts_1.fmt)(ill[365].amount)),
                    " \u0432\u0438\u0442\u0440\u0430\u0442. ",
                    (0, dom_ts_1.h)("span", { class: "muted" },
                        "\u041A\u043E\u0436\u043D\u0456 10 \u0433\u0440\u043D \u043D\u0430 \u0434\u0435\u043D\u044C \u2248 ",
                        (0, money_ts_1.fmt)(1000 * ill[365].work),
                        " \u043D\u0430 \u0440\u0456\u043A."))));
        }
    }
    const goals = data.goals.map((g) => (0, goals_ts_1.goalView)(g, ix, today)).filter((g) => !g.done).sort((a, b) => b.pct - a.pct);
    const g = goals[0];
    return ((0, dom_ts_1.h)("section", { class: "outlook" },
        echo,
        g ? ((0, dom_ts_1.h)("button", { type: "button", class: "goal-line", onClick: () => (0, view_ts_1.go)('future', { futureTab: 'goals' }) },
            (0, dom_ts_1.h)("span", { class: "goal-line-top" },
                (0, dom_ts_1.h)("span", null,
                    (0, icons_ts_1.icon)('target', 16),
                    "\u0426\u0456\u043B\u044C \u00AB",
                    g.goal.name,
                    "\u00BB"),
                (0, dom_ts_1.h)("span", { class: "num" },
                    (0, money_ts_1.fmt)(g.saved),
                    " \u0437 ",
                    (0, money_ts_1.fmt)(g.goal.target))),
            (0, dom_ts_1.h)(ui_tsx_1.Progress, { value: g.pct / 100, tone: "accent", label: `Прогрес цілі ${g.goal.name}` }))) : ((0, dom_ts_1.h)("button", { type: "button", class: "goal-line goal-empty", onClick: () => (0, view_ts_1.go)('future', { futureTab: 'goals' }) },
            (0, icons_ts_1.icon)('target', 16),
            (0, dom_ts_1.h)("span", null, "\u0414\u043E\u0434\u0430\u0439 \u0444\u0456\u043D\u0430\u043D\u0441\u043E\u0432\u0443 \u0446\u0456\u043B\u044C \u2014 \u0442\u0443\u0442 \u0431\u0443\u0434\u0435 \u0432\u0438\u0434\u043D\u043E \u0440\u0443\u0445 \u0434\u043E \u043D\u0435\u0457"),
            (0, icons_ts_1.icon)('chevronRight', 16)))));
}
function QuickBar(p) {
    const items = p.data.micro.filter((m) => m.quick);
    const joy = p.data.settings.joyBudget;
    return ((0, dom_ts_1.h)("section", { class: "quick-wrap", "aria-label": "\u0428\u0432\u0438\u0434\u043A\u0456 \u0432\u0438\u0442\u0440\u0430\u0442\u0438" },
        (0, dom_ts_1.h)("div", { class: "quickbar" },
            items.map((m) => ((0, dom_ts_1.h)("button", { type: "button", class: "quick", onClick: () => (0, forms_tsx_1.quickMicro)(m.id, p.date), "aria-label": `Додати: ${m.name}${m.price ? `, ${(0, money_ts_1.fmt)(m.price)}` : ''}` },
                (0, dom_ts_1.h)("span", { class: "quick-plus" }, (0, icons_ts_1.icon)('plus', 14)),
                (0, dom_ts_1.h)("span", { class: "quick-name" }, m.name),
                (0, dom_ts_1.h)("span", { class: "quick-price num" }, m.price ? (0, money_ts_1.fmt)(m.price) : 'ціна?')))),
            (0, dom_ts_1.h)("button", { type: "button", class: "quick quick-more", onClick: () => (0, forms_tsx_1.openQuickAdd)({ date: p.date, mode: 'trip' }) },
                (0, dom_ts_1.h)("span", { class: "quick-plus" }, (0, icons_ts_1.icon)('bus', 14)),
                (0, dom_ts_1.h)("span", { class: "quick-name" }, "\u041F\u043E\u0457\u0437\u0434\u043A\u0430"),
                (0, dom_ts_1.h)("span", { class: "quick-price" }, "\u0434\u0435\u0442\u0430\u043B\u0456")),
            (0, dom_ts_1.h)("button", { type: "button", class: "quick quick-more", onClick: () => (0, forms_tsx_1.openQuickAdd)({ date: p.date, mode: 'meal' }) },
                (0, dom_ts_1.h)("span", { class: "quick-plus" }, (0, icons_ts_1.icon)('utensils', 14)),
                (0, dom_ts_1.h)("span", { class: "quick-name" }, "\u0407\u0436\u0430"),
                (0, dom_ts_1.h)("span", { class: "quick-price" }, "\u043E\u0431\u0456\u0434"))),
        p.c.micro > 0 || joy !== null ? ((0, dom_ts_1.h)("p", { class: "quick-note" },
            "\u0414\u0440\u0456\u0431\u043D\u0456 \u043F\u0440\u0438\u0454\u043C\u043D\u043E\u0441\u0442\u0456 \u0441\u044C\u043E\u0433\u043E\u0434\u043D\u0456: ",
            (0, dom_ts_1.h)("b", { class: "num" }, (0, money_ts_1.fmt)(p.c.micro)),
            joy !== null ? (0, dom_ts_1.h)(dom_ts_1.Fragment, null,
                " \u0456\u0437 \u0431\u044E\u0434\u0436\u0435\u0442\u0443 \u0440\u0430\u0434\u043E\u0441\u0442\u0456 ",
                (0, money_ts_1.fmt)(joy),
                p.c.micro <= joy ? ' — усе в межах' : '') : null)) : null));
}
function Ladder(p) {
    const { c, bv } = p;
    let safeV = '—';
    let safeNote = '';
    if (!p.isToday)
        safeNote = 'Рахується лише для сьогодні';
    else if (bv.status === 'unknown') {
        safeNote = (0, dom_ts_1.h)("button", { type: "button", class: "inline-link", onClick: () => (0, view_ts_1.go)('settings', { settingsPage: 'budget' }) }, "\u0412\u043A\u0430\u0436\u0438 \u0434\u043E\u0445\u043E\u0434\u0438, \u043F\u043B\u0430\u0442\u0435\u0436\u0456 \u0439 \u0437\u0430\u043B\u0438\u0448\u043E\u043A");
    }
    else if (bv.status === 'deficit') {
        safeV = (0, money_ts_1.fmt)(0);
        safeNote = `Спершу обовʼязкові платежі: бракує ${(0, money_ts_1.fmt)(bv.shortfall)}`;
    }
    else {
        safeV = (0, money_ts_1.fmt)(bv.safe ?? 0);
        safeNote = bv.noIncome ? 'Доходи не вказано — резерв на 30 днів' : `Після платежів і потреб до ${(0, time_ts_1.fmtDate)(bv.nextIncome.date)}`;
    }
    return ((0, dom_ts_1.h)("section", { class: "ladder", "aria-label": "\u0412\u0456\u0434 \u0435\u043A\u043E\u043D\u043E\u043C\u0456\u0457 \u0434\u043E \u043D\u0430\u043A\u043E\u043F\u0438\u0447\u0435\u043D\u044C" },
        (0, dom_ts_1.h)("div", { class: "ladder-step" },
            (0, dom_ts_1.h)("span", { class: "ladder-k" },
                "\u041F\u043E\u0442\u0435\u043D\u0446\u0456\u0430\u043B \u0435\u043A\u043E\u043D\u043E\u043C\u0456\u0457",
                (0, dom_ts_1.h)(ui_tsx_1.InfoTip, { title: "\u041F\u043E\u0442\u0435\u043D\u0446\u0456\u0430\u043B \u0435\u043A\u043E\u043D\u043E\u043C\u0456\u0457" },
                    (0, dom_ts_1.h)("p", null,
                        "\u0420\u0456\u0437\u043D\u0438\u0446\u044F \u043C\u0456\u0436 \u043F\u043B\u0430\u043D\u043E\u043C \u0456 \u0444\u0430\u043A\u0442\u0438\u0447\u043D\u0438\u043C\u0438 \u0432\u0438\u0442\u0440\u0430\u0442\u0430\u043C\u0438 \u0434\u043D\u044F. ",
                        p.closed ? 'День завершено — це підсумкова економія відносно плану.' : 'Поки день не завершено, це сума, яка залишиться, якщо більше нічого не витрачати.'),
                    (0, dom_ts_1.h)("p", null, "\u0426\u0435 \u0449\u0435 \u043D\u0435 \u0437\u0430\u043E\u0449\u0430\u0434\u0436\u0435\u043D\u043D\u044F: \u0433\u0440\u043E\u0448\u0456 \u0441\u0442\u0430\u044E\u0442\u044C \u043D\u0430\u043A\u043E\u043F\u0438\u0447\u0435\u043D\u043D\u044F\u043C\u0438 \u043B\u0438\u0448\u0435 \u043F\u0456\u0441\u043B\u044F \u0440\u0435\u0430\u043B\u044C\u043D\u043E\u0433\u043E \u043F\u0435\u0440\u0435\u043A\u0430\u0437\u0443."))),
            (0, dom_ts_1.h)("span", { class: "ladder-v num" }, c.economy !== null ? (0, money_ts_1.fmt)(c.economy) : '—'),
            (0, dom_ts_1.h)("span", { class: "ladder-note" }, c.plan ? (p.closed ? 'Невитрачене відносно плану' : 'Якщо більше нічого не витрачати') : 'Потрібен план дня')),
        (0, dom_ts_1.h)("div", { class: "ladder-step" },
            (0, dom_ts_1.h)("span", { class: "ladder-k" },
                "\u0411\u0435\u0437\u043F\u0435\u0447\u043D\u043E \u0432\u0456\u0434\u043A\u043B\u0430\u0441\u0442\u0438",
                (0, dom_ts_1.h)(ui_tsx_1.InfoTip, { title: "\u0411\u0435\u0437\u043F\u0435\u0447\u043D\u043E \u0432\u0456\u0434\u043A\u043B\u0430\u0441\u0442\u0438" },
                    (0, dom_ts_1.h)("p", null, "\u0414\u043E\u0441\u0442\u0443\u043F\u043D\u0456 \u043A\u043E\u0448\u0442\u0438 \u043C\u0456\u043D\u0443\u0441 \u043E\u0431\u043E\u0432\u02BC\u044F\u0437\u043A\u043E\u0432\u0456 \u043F\u043B\u0430\u0442\u0435\u0436\u0456 \u0434\u043E \u043D\u0430\u0441\u0442\u0443\u043F\u043D\u043E\u0433\u043E \u0434\u043E\u0445\u043E\u0434\u0443, \u0449\u043E\u0434\u0435\u043D\u043D\u0456 \u043F\u043E\u0442\u0440\u0435\u0431\u0438 \u043D\u0430 \u0446\u0456 \u0434\u043D\u0456, \u0437\u0430\u043B\u0438\u0448\u043E\u043A \u043F\u043B\u0430\u043D\u0443 \u043D\u0430 \u0441\u044C\u043E\u0433\u043E\u0434\u043D\u0456 \u0439 \u0442\u0432\u0456\u0439 \u0437\u0430\u043F\u0430\u0441 \u0431\u0435\u0437\u043F\u0435\u043A\u0438."),
                    (0, dom_ts_1.h)("p", null, "\u042F\u043A\u0449\u043E \u0454 \u043F\u043B\u0430\u043D \u2014 \u043D\u0435 \u0431\u0456\u043B\u044C\u0448\u0435 \u0437\u0430 \u0441\u044C\u043E\u0433\u043E\u0434\u043D\u0456\u0448\u043D\u044E \u0435\u043A\u043E\u043D\u043E\u043C\u0456\u044E. \u042F\u043A\u0449\u043E \u043D\u0430 \u043E\u0431\u043E\u0432\u02BC\u044F\u0437\u043A\u043E\u0432\u0435 \u043D\u0435 \u0432\u0438\u0441\u0442\u0430\u0447\u0430\u0454, \u0437\u0430\u0441\u0442\u043E\u0441\u0443\u043D\u043E\u043A \u043D\u0435 \u0440\u0430\u0434\u0438\u0442\u044C \u0432\u0456\u0434\u043A\u043B\u0430\u0434\u0430\u0442\u0438."),
                    (0, dom_ts_1.h)("p", null, "\u041C\u0430\u0439\u0431\u0443\u0442\u043D\u0456 \u0434\u043E\u0445\u043E\u0434\u0438 \u043D\u0435 \u0432\u0440\u0430\u0445\u043E\u0432\u0443\u044E\u0442\u044C\u0441\u044F, \u0434\u043E\u043A\u0438 \u043D\u0435 \u043D\u0430\u0434\u0456\u0439\u0448\u043B\u0438."))),
            (0, dom_ts_1.h)("span", { class: "ladder-v num" }, safeV),
            (0, dom_ts_1.h)("span", { class: "ladder-note" }, safeNote)),
        (0, dom_ts_1.h)("div", { class: "ladder-step" },
            (0, dom_ts_1.h)("span", { class: "ladder-k" }, p.isToday ? 'Відкладено сьогодні' : 'Відкладено цього дня'),
            (0, dom_ts_1.h)("span", { class: (0, dom_ts_1.cx)('ladder-v num', c.saved > 0 && 'pos') }, (0, money_ts_1.fmt)(c.saved)),
            p.isToday ? (0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "tinted", size: "sm", icon: "coins", label: "\u0412\u0456\u0434\u043A\u043B\u0430\u0441\u0442\u0438 \u0433\u0440\u043E\u0448\u0456", onClick: () => (0, advice_tsx_1.openSaveSheet)() }, "\u0412\u0456\u0434\u043A\u043B\u0430\u0441\u0442\u0438") : (0, dom_ts_1.h)("span", { class: "ladder-note" }, "\u0424\u0430\u043A\u0442\u0438\u0447\u043D\u0456 \u043F\u0435\u0440\u0435\u043A\u0430\u0437\u0438"))));
}
function Tiles(p) {
    const cats = p.data.categories.filter((c) => !c.hidden && c.id !== 'bills');
    return ((0, dom_ts_1.h)("section", { class: "tiles", "aria-label": "\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0456\u0457" }, cats.map((cat) => {
        const fact = p.c.byCat[cat.id] ?? 0;
        const plan = p.c.planByCat[cat.id] ?? 0;
        const over = plan > 0 && fact > plan;
        const open = () => {
            if (p.future)
                return (0, plan_tsx_1.openPlanEditor)(p.date);
            if (cat.id === 'transport')
                return (0, forms_tsx_1.openQuickAdd)({ date: p.date, mode: 'trip' });
            if (cat.id === 'lunch')
                return (0, forms_tsx_1.openQuickAdd)({ date: p.date, mode: 'meal' });
            return (0, forms_tsx_1.openQuickAdd)({ date: p.date, category: cat.id });
        };
        return ((0, dom_ts_1.h)("button", { type: "button", class: (0, dom_ts_1.cx)('tile', fact > 0 && 'has', over && 'over'), style: `--c:${cat.color}`, onClick: open, "aria-label": `${cat.name}: ${(0, money_ts_1.fmt)(fact)}${plan ? ` з ${(0, money_ts_1.fmt)(plan)}` : ''}` },
            (0, dom_ts_1.h)("span", { class: "tile-icon" }, (0, icons_ts_1.icon)(cat.icon, 20)),
            (0, dom_ts_1.h)("span", { class: "tile-name" }, cat.name),
            (0, dom_ts_1.h)("span", { class: "tile-val num" }, (0, money_ts_1.fmt)(fact)),
            (0, dom_ts_1.h)("span", { class: "tile-plan" }, plan ? `план ${(0, money_ts_1.fmt)(plan)}` : ' '),
            plan ? (0, dom_ts_1.h)("span", { class: "tile-bar" },
                (0, dom_ts_1.h)("span", { style: `width:${Math.min(100, (fact / plan) * 100).toFixed(0)}%` })) : null));
    })));
}
function PlanBlock(p) {
    const { cats, ix } = (0, view_ts_1.derived)();
    const { c, date } = p;
    if (!c.plan) {
        return ((0, dom_ts_1.h)(ui_tsx_1.Group, { title: "\u041F\u043B\u0430\u043D \u043D\u0430 \u0434\u0435\u043D\u044C", foot: "\u0421\u0443\u043C\u0438 \u0432 \u0448\u0430\u0431\u043B\u043E\u043D\u0430\u0445 \u2014 \u043B\u0438\u0448\u0435 \u043F\u0440\u0438\u043A\u043B\u0430\u0434. \u0417\u043C\u0456\u043D\u0438 \u0457\u0445 \u0443 \u043D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F\u0445 \u0430\u0431\u043E \u0432 \u0441\u0430\u043C\u043E\u043C\u0443 \u043F\u043B\u0430\u043D\u0456." },
            (0, dom_ts_1.h)(plan_tsx_1.TemplateChips, { date: date })));
    }
    const facts = (0, ledger_ts_1.planLineFacts)(ix, date);
    const ids = [...new Set([...c.plan.map((l) => l.category), ...Object.keys(c.byCat).filter((k) => c.byCat[k] !== 0)])];
    const totalDiff = c.planTotal - c.spent;
    return ((0, dom_ts_1.h)(ui_tsx_1.Group, { title: "\u041F\u043B\u0430\u043D \u0456 \u0444\u0430\u043A\u0442", action: (0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "ghost", size: "sm", icon: "edit", onClick: () => (0, plan_tsx_1.openPlanEditor)(date) }, "\u0417\u043C\u0456\u043D\u0438\u0442\u0438 \u043F\u043B\u0430\u043D") },
        (0, dom_ts_1.h)("div", { class: "pf", role: "table", "aria-label": "\u041F\u043B\u0430\u043D \u043F\u0440\u043E\u0442\u0438 \u0444\u0430\u043A\u0442\u0443" },
            (0, dom_ts_1.h)("div", { class: "pf-row pf-head", role: "row" },
                (0, dom_ts_1.h)("span", { role: "columnheader" }, "\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0456\u044F"),
                (0, dom_ts_1.h)("span", { role: "columnheader" }, "\u041F\u043B\u0430\u043D"),
                (0, dom_ts_1.h)("span", { role: "columnheader" }, "\u0424\u0430\u043A\u0442"),
                (0, dom_ts_1.h)("span", { role: "columnheader" }, "\u0420\u0456\u0437\u043D\u0438\u0446\u044F")),
            ids.map((id) => {
                const cat = (0, view_ts_1.catOf)(cats, id);
                const plan = c.planByCat[id] ?? 0;
                const fact = c.byCat[id] ?? 0;
                const d = plan - fact;
                return ((0, dom_ts_1.h)("div", { class: (0, dom_ts_1.cx)('pf-row', d < 0 && 'over'), role: "row" },
                    (0, dom_ts_1.h)("span", { class: "pf-cat", role: "cell" },
                        (0, dom_ts_1.h)("span", { class: "dot", style: `--c:${cat.color}` }),
                        cat.name,
                        !plan ? (0, dom_ts_1.h)("small", null, " \u043F\u043E\u0437\u0430 \u043F\u043B\u0430\u043D\u043E\u043C") : null),
                    (0, dom_ts_1.h)("span", { class: "num", role: "cell" }, plan ? (0, money_ts_1.fmt)(plan, { currency: false }) : '—'),
                    (0, dom_ts_1.h)("span", { class: "num", role: "cell" }, (0, money_ts_1.fmt)(fact, { currency: false })),
                    (0, dom_ts_1.h)("span", { class: (0, dom_ts_1.cx)('num', d < 0 ? 'neg' : d > 0 ? 'pos' : 'muted'), role: "cell" }, d === 0 ? '0' : (0, money_ts_1.fmt)(d, { currency: false, sign: true }))));
            }),
            (0, dom_ts_1.h)("div", { class: (0, dom_ts_1.cx)('pf-row pf-total', totalDiff < 0 && 'over'), role: "row" },
                (0, dom_ts_1.h)("span", { role: "cell" }, "\u0420\u0430\u0437\u043E\u043C, \u0433\u0440\u043D"),
                (0, dom_ts_1.h)("span", { class: "num", role: "cell" }, (0, money_ts_1.fmt)(c.planTotal, { currency: false })),
                (0, dom_ts_1.h)("span", { class: "num", role: "cell" }, (0, money_ts_1.fmt)(c.spent, { currency: false })),
                (0, dom_ts_1.h)("span", { class: (0, dom_ts_1.cx)('num', totalDiff < 0 ? 'neg' : 'pos'), role: "cell" }, (0, money_ts_1.fmt)(totalDiff, { currency: false, sign: true })))),
        (0, dom_ts_1.h)("div", { class: "plan-lines" },
            (0, dom_ts_1.h)("p", { class: "field-label" }, "\u0417\u0430\u043F\u0438\u0441\u0430\u0442\u0438 \u0437 \u043F\u043B\u0430\u043D\u0443 \u043E\u0434\u043D\u0438\u043C \u0434\u043E\u0442\u0438\u043A\u043E\u043C"),
            (0, dom_ts_1.h)("div", { class: "chips chips-wrap" }, c.plan.map((l) => {
                const done = facts.get(l.id) ?? [];
                const cat = (0, view_ts_1.catOf)(cats, l.category);
                const sum = done.reduce((s, o) => s + o.amount, 0);
                const linked = [...facts.values()].flat().filter((o) => o.category === l.category && o.type === 'expense').reduce((s, o) => s + o.amount, 0);
                const unlinked = (c.byCat[l.category] ?? 0) - linked;
                const open = () => (unlinked > 0 ? (0, forms_tsx_1.openQuickAdd)({ date, category: l.category, planLine: l, mode: l.category === 'lunch' ? 'meal' : 'expense' }) : (0, forms_tsx_1.recordPlanLine)(l, date));
                return ((0, dom_ts_1.h)(ui_tsx_1.Chip, { on: done.length > 0, icon: done.length ? 'check' : cat.icon, color: cat.color, label: done.length ? `${l.label}: записано ${(0, money_ts_1.fmt)(sum)}. Відкрити запис` : `Записати ${l.label} на ${(0, money_ts_1.fmt)(l.amount)}`, onClick: () => (done.length ? (0, forms_tsx_1.openOpEditor)(done[0]) : open()) },
                    l.label,
                    " \u00B7 ",
                    (0, money_ts_1.fmt)(done.length ? sum : l.amount)));
            })))));
}
function Insights(p) {
    const { ix, data, cats, today } = (0, view_ts_1.derived)();
    const list = (0, insights_ts_1.priceOfDecision)({ ix, days: data.days, cats, settings: data.settings, today, date: p.date, calc: p.c });
    if (!list.length)
        return null;
    return ((0, dom_ts_1.h)("section", { class: "insights", "aria-label": "\u0426\u0456\u043D\u0430 \u0440\u0456\u0448\u0435\u043D\u043D\u044F" }, list.map((t) => (0, dom_ts_1.h)(ui_tsx_1.Note, { tone: "info", icon: "bulb" },
        (0, dom_ts_1.h)("b", null, "\u0426\u0456\u043D\u0430 \u0440\u0456\u0448\u0435\u043D\u043D\u044F. "),
        t))));
}
function WeekChart(p) {
    const { ix, data, cats, today } = (0, view_ts_1.derived)();
    const bars = [];
    for (let i = 6; i >= 0; i--) {
        const d = (0, time_ts_1.addDays)(p.date, -i);
        const rec = data.days[d];
        const calc = (0, ledger_ts_1.calcDay)(ix, d, rec, cats);
        const st = (0, ledger_ts_1.dayStatus)(d, today, rec, calc.hasData);
        bars.push({
            key: d,
            label: d === today ? 'сьогодні' : time_ts_1.WEEKDAYS_SHORT[(0, time_ts_1.weekday)(d)],
            value: calc.spent,
            plan: calc.plan ? calc.planTotal : null,
            missing: st === 'missing' || st === 'future',
            hl: d === p.date,
        });
    }
    return ((0, dom_ts_1.h)(ui_tsx_1.Group, { title: "\u041E\u0441\u0442\u0430\u043D\u043D\u0456 7 \u0434\u043D\u0456\u0432", foot: "\u0420\u0438\u0441\u043A\u0430 \u2014 \u043F\u043B\u0430\u043D \u0434\u043D\u044F. \u041F\u0443\u043D\u043A\u0442\u0438\u0440 \u2014 \u043D\u0435\u043C\u0430\u0454 \u0434\u0430\u043D\u0438\u0445 (\u0446\u0435 \u043D\u0435 \u043D\u0443\u043B\u044C\u043E\u0432\u0456 \u0432\u0438\u0442\u0440\u0430\u0442\u0438)." },
        (0, dom_ts_1.h)(charts_tsx_1.BarChart, { bars: bars, height: 130, label: "\u0412\u0438\u0442\u0440\u0430\u0442\u0438 \u0437\u0430 \u043E\u0441\u0442\u0430\u043D\u043D\u0456 7 \u0434\u043D\u0456\u0432", onPick: (k) => (0, view_ts_1.setUI)({ dayDate: k === today ? null : k }) })));
}
function OpsBlock(p) {
    const ops = [...p.c.ops].sort((a, b) => b.time - a.time);
    return ((0, dom_ts_1.h)(ui_tsx_1.Group, { title: "\u041E\u043F\u0435\u0440\u0430\u0446\u0456\u0457", action: (0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "ghost", size: "sm", icon: "plus", onClick: () => (0, forms_tsx_1.openQuickAdd)({ date: p.date, mode: 'more' }) }, "\u0406\u043D\u0448\u0430 \u043E\u043F\u0435\u0440\u0430\u0446\u0456\u044F") }, ops.length
        ? ops.map((o) => (0, dom_ts_1.h)(forms_tsx_1.OpRow, { op: o }))
        : (0, dom_ts_1.h)("div", { class: "empty-inline" }, p.isToday ? 'Записів ще немає. Кнопка «+ Витрата» — внизу праворуч.' : 'Цього дня записів немає.')));
}
function CloseBlock(p) {
    const { data } = (0, view_ts_1.derived)();
    const rec = data.days[p.date];
    if (p.closed) {
        return ((0, dom_ts_1.h)("section", { class: "close-block" },
            rec?.advice ? (0, dom_ts_1.h)(advice_tsx_1.AdviceCard, { advice: rec.advice }) : null,
            (0, dom_ts_1.h)("div", { class: "btn-row" },
                (0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "secondary", icon: "list", onClick: () => (0, advice_tsx_1.openDaySummary)(p.date) }, "\u041F\u0456\u0434\u0441\u0443\u043C\u043E\u043A \u0434\u043D\u044F"),
                (0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "ghost", icon: "repeat", onClick: () => (0, ui_tsx_1.confirmSheet)({
                        title: 'Відкрити день знову?',
                        text: 'Можна буде додати чи змінити записи. Поради й статистику буде перераховано, коли ти знову завершиш день.',
                        confirm: 'Відкрити день',
                        onConfirm: () => (0, store_ts_1.reopenDayAction)(p.date),
                    }) }, "\u0412\u0456\u0434\u043A\u0440\u0438\u0442\u0438 \u0437\u043D\u043E\u0432\u0443"))));
    }
    return ((0, dom_ts_1.h)("section", { class: "close-block" },
        (0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "primary", size: "lg", full: true, icon: "moon", onClick: () => { (0, store_ts_1.closeDayAction)(p.date); (0, advice_tsx_1.openDaySummary)(p.date); } }, p.isToday ? 'Завершити день' : 'Підбити підсумок дня'),
        (0, dom_ts_1.h)("p", { class: "hint center" }, "\u041F\u043E\u043A\u0430\u0436\u0435 \u043F\u0456\u0434\u0441\u0443\u043C\u043E\u043A, \u043E\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0439 \u043F\u0440\u043E\u0433\u043D\u043E\u0437 \u0456 \u043E\u0434\u043D\u0443 \u043F\u043E\u0440\u0430\u0434\u0443 \u043D\u0430\u0441\u0442\u0430\u0432\u043D\u0438\u043A\u0430. \u041D\u0430\u0441\u0442\u0443\u043F\u043D\u0438\u0439 \u0434\u0435\u043D\u044C \u043F\u043E\u0447\u043D\u0435\u0442\u044C\u0441\u044F \u0437 \u0447\u0438\u0441\u0442\u043E\u0433\u043E \u0436\u0443\u0440\u043D\u0430\u043B\u0443.")));
}
};

// ── AddScreen.tsx
defs["AddScreen.js"] = function (require, exports, module) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddScreen = AddScreen;
const dom_ts_1 = require("./dom.js");
const ui_tsx_1 = require("./ui.js");
const forms_tsx_1 = require("./forms.js");
const view_ts_1 = require("./view.js");
function AddScreen() {
    const { today } = (0, view_ts_1.derived)();
    const preset = view_ts_1.ui.addPreset;
    const mode = preset?.mode ?? view_ts_1.ui.addMode;
    const date = preset?.date ?? today;
    const done = (op) => {
        view_ts_1.ui.addPreset = null;
        if (!op)
            return;
        (0, forms_tsx_1.addedToast)(op);
        (0, view_ts_1.go)('day', { dayDate: op.date === today ? null : op.date });
    };
    const hints = {
        expense: 'Категорія, сума, «Зберегти» — три дотики.',
        trip: 'Спосіб, вартість і час — для порівняння «Як їхати вигідніше?».',
        meal: 'Домашній обід чи їдальня — без подвійного обліку продуктів.',
        more: 'Дохід, повернення, переказ у накопичення чи між рахунками.',
    };
    return ((0, dom_ts_1.h)("div", { class: "screen add" },
        (0, dom_ts_1.h)("header", { class: "screen-head" },
            (0, dom_ts_1.h)("h1", { class: "h1" }, "\u0414\u043E\u0434\u0430\u0442\u0438"),
            (0, dom_ts_1.h)("p", { class: "kicker" }, hints[mode])),
        (0, dom_ts_1.h)(ui_tsx_1.Seg, { value: mode, label: "\u0429\u043E \u0434\u043E\u0434\u0430\u0442\u0438", options: [
                { value: 'expense', label: 'Витрата' },
                { value: 'trip', label: 'Поїздка' },
                { value: 'meal', label: 'Їжа' },
                { value: 'more', label: 'Інше' },
            ], onChange: (v) => (0, view_ts_1.setUI)({ addMode: v, addPreset: null }) }),
        mode === 'expense' ? (0, dom_ts_1.h)(forms_tsx_1.ExpenseForm, { date: date, category: preset?.category, onDone: done })
            : mode === 'trip' ? (0, dom_ts_1.h)(forms_tsx_1.TripForm, { date: date, onDone: done })
                : mode === 'meal' ? (0, dom_ts_1.h)(forms_tsx_1.MealForm, { date: date, onDone: done })
                    : (0, dom_ts_1.h)(forms_tsx_1.MoreForm, { date: date, kind: preset?.more, onDone: done })));
}
};

// ── AnalyticsScreen.tsx
defs["AnalyticsScreen.js"] = function (require, exports, module) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.periodRange = periodRange;
exports.AnalyticsScreen = AnalyticsScreen;
const dom_ts_1 = require("./dom.js");
const icons_ts_1 = require("./icons.js");
const ui_tsx_1 = require("./ui.js");
const charts_tsx_1 = require("./charts.js");
const forms_tsx_1 = require("./forms.js");
const advice_tsx_1 = require("./advice.js");
const store_ts_1 = require("./store.js");
const view_ts_1 = require("./view.js");
const ledger_ts_1 = require("./ledger.js");
const transport_ts_1 = require("./transport.js");
const meals_ts_1 = require("./meals.js");
const insights_ts_1 = require("./insights.js");
const defaults_ts_1 = require("./defaults.js");
const money_ts_1 = require("./money.js");
const time_ts_1 = require("./time.js");
const PERIODS = [
    { id: 'today', label: 'Сьогодні' },
    { id: 'yesterday', label: 'Учора' },
    { id: '7d', label: '7 днів' },
    { id: '30d', label: '30 днів' },
    { id: 'month', label: 'Цей місяць' },
    { id: '182d', label: 'Пів року' },
    { id: '365d', label: 'Рік' },
    { id: 'custom', label: 'Свої дати' },
];
function periodRange(id, today) {
    switch (id) {
        case 'today': return { from: today, to: today };
        case 'yesterday': return { from: (0, time_ts_1.addDays)(today, -1), to: (0, time_ts_1.addDays)(today, -1) };
        case '7d': return { from: (0, time_ts_1.addDays)(today, -6), to: today };
        case '30d': return { from: (0, time_ts_1.addDays)(today, -29), to: today };
        case 'month': return { from: (0, time_ts_1.startOfMonth)(today), to: today };
        case '182d': return { from: (0, time_ts_1.addDays)(today, -181), to: today };
        case '365d': return { from: (0, time_ts_1.addDays)(today, -364), to: today };
        default: {
            const from = view_ts_1.ui.customFrom || (0, time_ts_1.addDays)(today, -13);
            const to = view_ts_1.ui.customTo || today;
            return from <= to ? { from, to } : { from: to, to: from };
        }
    }
}
function bars(period, today) {
    const n = period.days.length;
    if (n <= 62) {
        return period.days.map((d) => ({
            key: d.date,
            label: n <= 7 ? time_ts_1.WEEKDAYS_SHORT[(0, time_ts_1.weekday)(d.date)] : String((0, time_ts_1.ymd)(d.date).d),
            value: d.counted ? d.calc.spent : 0,
            plan: d.counted && d.calc.plan ? d.calc.planTotal : null,
            missing: !d.counted,
            hl: d.date === today,
        }));
    }
    const weekly = n <= 200;
    const groups = new Map();
    for (const d of period.days) {
        const key = weekly ? (0, time_ts_1.startOfWeek)(d.date) : (0, time_ts_1.monthKey)(d.date);
        const b = groups.get(key) ?? { key, label: weekly ? (0, time_ts_1.fmtShort)(key) : time_ts_1.MONTHS_SHORT[(0, time_ts_1.ymd)(key + (weekly ? '' : '-01')).m - 1], value: 0, plan: null, missing: true };
        if (d.counted) {
            b.value += d.calc.spent;
            b.missing = false;
            if (d.calc.plan)
                b.plan = (b.plan ?? 0) + d.calc.planTotal;
        }
        groups.set(key, b);
    }
    return [...groups.values()];
}
function AnalyticsScreen() {
    return ((0, dom_ts_1.h)("div", { class: "screen stats" },
        (0, dom_ts_1.h)("header", { class: "screen-head" },
            (0, dom_ts_1.h)("h1", { class: "h1" }, "\u0410\u043D\u0430\u043B\u0456\u0442\u0438\u043A\u0430"),
            (0, dom_ts_1.h)("p", { class: "kicker" }, "\u041B\u0438\u0448\u0435 \u0437\u0430 \u0434\u0430\u043D\u0438\u043C\u0438, \u044F\u043A\u0456 \u0442\u0438 \u0432\u043D\u0456\u0441. \u0414\u043D\u0456 \u0431\u0435\u0437 \u0437\u0430\u043F\u0438\u0441\u0456\u0432 \u043D\u0435 \u0432\u0432\u0430\u0436\u0430\u044E\u0442\u044C\u0441\u044F \u043D\u0443\u043B\u044C\u043E\u0432\u0438\u043C\u0438.")),
        (0, dom_ts_1.h)(ui_tsx_1.Seg, { value: view_ts_1.ui.statsTab, label: "\u0420\u043E\u0437\u0434\u0456\u043B \u0430\u043D\u0430\u043B\u0456\u0442\u0438\u043A\u0438", options: [
                { value: 'overview', label: 'Огляд' },
                { value: 'history', label: 'Історія' },
                { value: 'advice', label: 'Поради' },
            ], onChange: (v) => (0, view_ts_1.setUI)({ statsTab: v }) }),
        view_ts_1.ui.statsTab === 'overview' ? (0, dom_ts_1.h)(Overview, null) : view_ts_1.ui.statsTab === 'history' ? (0, dom_ts_1.h)(History, null) : (0, dom_ts_1.h)(AdviceHistory, null)));
}
function Overview() {
    const { data, ix, cats, today } = (0, view_ts_1.derived)();
    const { from, to } = periodRange(view_ts_1.ui.period, today);
    const p = (0, ledger_ts_1.calcPeriod)(ix, data.days, cats, from, to, today);
    const span = (0, time_ts_1.diffDays)(from, to) + 1;
    const catParts = Object.entries(p.byCat).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]).map(([id, v]) => {
        const c = (0, view_ts_1.catOf)(cats, id);
        return { key: id, label: c.name, value: v, color: c.color };
    });
    const totalCat = catParts.reduce((s, x) => s + x.value, 0);
    const planDays = p.days.filter((d) => d.counted && d.calc.plan);
    const pfCats = new Map();
    for (const d of planDays) {
        for (const id of new Set([...Object.keys(d.calc.planByCat), ...Object.keys(d.calc.byCat)])) {
            const e = pfCats.get(id) ?? { plan: 0, fact: 0 };
            e.plan += d.calc.planByCat[id] ?? 0;
            e.fact += d.calc.byCat[id] ?? 0;
            pfCats.set(id, e);
        }
    }
    const series = (0, ledger_ts_1.savingsSeries)(ix, data.settings.budget.savingsStart, from, p.to);
    const hasSavings = series.some((s) => s.total !== 0);
    const modes = (0, transport_ts_1.modeStats)(ix, from, p.to);
    const pub = (0, transport_ts_1.publicRef)(ix, data.settings, today);
    const taxi = modes.find((m) => m.mode === 'taxi');
    const pubStat = modes.filter((m) => (0, transport_ts_1.modeInfo)(m.mode).public).sort((a, b) => b.trips - a.trips)[0];
    const meals = ix.all.filter((o) => o.meal && o.date >= from && o.date <= p.to && (o.type === 'expense' || o.type === 'consumption'));
    const home = meals.filter((o) => (0, meals_ts_1.isHomeMeal)(o.meal.kind));
    const out = meals.filter((o) => !(0, meals_ts_1.isHomeMeal)(o.meal.kind));
    const avg = (l) => (l.length ? Math.round(l.reduce((s, o) => s + o.amount, 0) / l.length) : 0);
    const canteen = (0, meals_ts_1.canteenRef)(ix, data.settings, today);
    const micro = (0, insights_ts_1.microTotals)(ix, data.days, cats, today);
    const top = p.days.filter((d) => d.counted && d.calc.spent > 0).sort((a, b) => b.calc.spent - a.calc.spent).slice(0, 5);
    return ((0, dom_ts_1.h)("div", { class: "stack-lg" },
        (0, dom_ts_1.h)("div", { class: "chips chips-scroll", role: "tablist", "aria-label": "\u041F\u0435\u0440\u0456\u043E\u0434" }, PERIODS.map((x) => (0, dom_ts_1.h)(ui_tsx_1.Chip, { on: view_ts_1.ui.period === x.id, onClick: () => (0, view_ts_1.setUI)({ period: x.id }) }, x.label))),
        view_ts_1.ui.period === 'custom' ? ((0, dom_ts_1.h)("div", { class: "grid2" },
            (0, dom_ts_1.h)(ui_tsx_1.DateInput, { value: from, max: today, label: "\u0412\u0456\u0434", onChange: (v) => (0, view_ts_1.setUI)({ customFrom: v }) }),
            (0, dom_ts_1.h)(ui_tsx_1.DateInput, { value: to, max: today, label: "\u0414\u043E", onChange: (v) => (0, view_ts_1.setUI)({ customTo: v }) }))) : null,
        (0, dom_ts_1.h)("section", { class: "stat-grid" },
            (0, dom_ts_1.h)("div", { class: "stat-card" },
                (0, dom_ts_1.h)("span", { class: "stat-k" }, "\u0412\u0438\u0442\u0440\u0430\u0447\u0435\u043D\u043E"),
                (0, dom_ts_1.h)("span", { class: "stat-v num" }, (0, money_ts_1.fmt)(p.spent)),
                (0, dom_ts_1.h)("span", { class: "stat-s" }, span > 1 ? `${(0, time_ts_1.fmtDate)(from)} — ${(0, time_ts_1.fmtDate)(p.to)}` : (0, time_ts_1.fmtDate)(from))),
            (0, dom_ts_1.h)("div", { class: "stat-card" },
                (0, dom_ts_1.h)("span", { class: "stat-k" }, "\u0423 \u0441\u0435\u0440\u0435\u0434\u043D\u044C\u043E\u043C\u0443 \u0437\u0430 \u0434\u0435\u043D\u044C"),
                (0, dom_ts_1.h)("span", { class: "stat-v num" }, p.avgPerDataDay !== null ? (0, money_ts_1.fmt)(p.avgPerDataDay, { decimals: 'never' }) : '—'),
                (0, dom_ts_1.h)("span", { class: "stat-s" }, "\u0441\u0435\u0440\u0435\u0434 \u0434\u043D\u0456\u0432 \u0456\u0437 \u0434\u0430\u043D\u0438\u043C\u0438")),
            (0, dom_ts_1.h)("div", { class: "stat-card" },
                (0, dom_ts_1.h)("span", { class: "stat-k" }, "\u041F\u043B\u0430\u043D \u2212 \u0444\u0430\u043A\u0442"),
                (0, dom_ts_1.h)("span", { class: (0, dom_ts_1.cx)('stat-v num', p.economy < 0 ? 'neg' : p.economy > 0 ? 'pos' : '') }, p.planDays ? (0, money_ts_1.fmt)(p.economy, { sign: true }) : '—'),
                (0, dom_ts_1.h)("span", { class: "stat-s" }, p.planDays ? `на ${(0, money_ts_1.count)(p.planDays, money_ts_1.DAYS)} з планом` : 'днів із планом немає')),
            (0, dom_ts_1.h)("div", { class: "stat-card" },
                (0, dom_ts_1.h)("span", { class: "stat-k" }, "\u0412\u0456\u0434\u043A\u043B\u0430\u0434\u0435\u043D\u043E"),
                (0, dom_ts_1.h)("span", { class: (0, dom_ts_1.cx)('stat-v num', p.saved > 0 && 'pos') }, (0, money_ts_1.fmt)(p.saved)),
                (0, dom_ts_1.h)("span", { class: "stat-s" }, "\u0440\u0435\u0430\u043B\u044C\u043D\u0456 \u043F\u0435\u0440\u0435\u043A\u0430\u0437\u0438"))),
        (0, dom_ts_1.h)("div", { class: "coverage" },
            (0, dom_ts_1.h)("span", null,
                (0, dom_ts_1.h)("b", { class: "num" }, p.dataDays),
                " \u0437 \u0434\u0430\u043D\u0438\u043C\u0438"),
            (0, dom_ts_1.h)("span", null,
                (0, dom_ts_1.h)("b", { class: "num" }, p.noSpendDays),
                " \u0431\u0435\u0437 \u0432\u0438\u0442\u0440\u0430\u0442"),
            (0, dom_ts_1.h)("span", null,
                (0, dom_ts_1.h)("b", { class: "num" }, p.missingDays),
                " \u0431\u0435\u0437 \u0437\u0430\u043F\u0438\u0441\u0456\u0432"),
            p.bills ? (0, dom_ts_1.h)("span", null,
                (0, dom_ts_1.h)("b", { class: "num" }, (0, money_ts_1.fmt)(p.bills)),
                " \u043E\u0431\u043E\u0432\u02BC\u044F\u0437\u043A\u043E\u0432\u0456 \u043F\u043B\u0430\u0442\u0435\u0436\u0456") : null),
        p.dataDays === 0 ? (0, dom_ts_1.h)(ui_tsx_1.Empty, { icon: "bars", title: "\u0417\u0430 \u0446\u0435\u0439 \u043F\u0435\u0440\u0456\u043E\u0434 \u0434\u0430\u043D\u0438\u0445 \u043D\u0435\u043C\u0430\u0454", text: "\u0412\u043D\u0435\u0441\u0438 \u043A\u0456\u043B\u044C\u043A\u0430 \u0432\u0438\u0442\u0440\u0430\u0442 \u2014 \u0456 \u0442\u0443\u0442 \u0437\u02BC\u044F\u0432\u043B\u044F\u0442\u044C\u0441\u044F \u0433\u0440\u0430\u0444\u0456\u043A\u0438.", action: (0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "primary", onClick: () => (0, view_ts_1.go)('add') }, "\u0414\u043E\u0434\u0430\u0442\u0438 \u0432\u0438\u0442\u0440\u0430\u0442\u0443") }) : ((0, dom_ts_1.h)(dom_ts_1.Fragment, null,
            (0, dom_ts_1.h)(ui_tsx_1.Group, { title: "\u0412\u0438\u0442\u0440\u0430\u0442\u0438 \u043F\u043E \u0434\u043D\u044F\u0445", foot: p.days.length > 62 ? 'Стовпчики згруповано за тижнями або місяцями. Риска — план.' : 'Риска — план дня. Пунктир — днів без записів.' },
                (0, dom_ts_1.h)(charts_tsx_1.BarChart, { bars: bars(p, today), label: "\u0412\u0438\u0442\u0440\u0430\u0442\u0438 \u043F\u043E \u0434\u043D\u044F\u0445", onPick: p.days.length <= 62 ? (k) => (0, view_ts_1.go)('day', { dayDate: k === today ? null : k }) : undefined })),
            catParts.length ? ((0, dom_ts_1.h)(ui_tsx_1.Group, { title: "\u0420\u043E\u0437\u043F\u043E\u0434\u0456\u043B \u0437\u0430 \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0456\u044F\u043C\u0438" },
                (0, dom_ts_1.h)("div", { class: "donut-row" },
                    (0, dom_ts_1.h)(charts_tsx_1.Donut, { parts: catParts, center: (0, money_ts_1.fmt)(totalCat, { decimals: 'never' }), sub: "\u0440\u0430\u0437\u043E\u043C" }),
                    (0, dom_ts_1.h)("ul", { class: "legend" }, catParts.map((x) => (0, dom_ts_1.h)("li", null,
                        (0, dom_ts_1.h)("span", { class: "dot", style: `--c:${x.color}` }),
                        x.label,
                        (0, dom_ts_1.h)("b", { class: "num" },
                            (0, money_ts_1.percent)(x.value, totalCat) ?? 0,
                            "%"))))),
                (0, dom_ts_1.h)(charts_tsx_1.HBars, { rows: catParts.map((x) => ({ key: x.key, label: x.label, value: x.value, color: x.color })) }))) : null,
            (0, dom_ts_1.h)(ui_tsx_1.Group, { title: "\u041E\u0431\u043E\u0432\u02BC\u044F\u0437\u043A\u043E\u0432\u0456, \u0433\u043D\u0443\u0447\u043A\u0456, \u043D\u0435\u043E\u0431\u043E\u0432\u02BC\u044F\u0437\u043A\u043E\u0432\u0456" },
                (0, dom_ts_1.h)(charts_tsx_1.HBars, { rows: defaults_ts_1.NECESSITY_ORDER.map((n) => ({ key: n, label: defaults_ts_1.NECESSITY[n].label, value: Math.max(0, p.byNec[n]) + (n === 'required' ? p.bills : 0) })) })),
            pfCats.size ? ((0, dom_ts_1.h)(ui_tsx_1.Group, { title: "\u041F\u043B\u0430\u043D \u043F\u0440\u043E\u0442\u0438 \u0444\u0430\u043A\u0442\u0443", foot: `Лише дні з планом: ${planDays.length}.` }, [...pfCats.entries()].sort((a, b) => b[1].fact - a[1].fact).map(([id, v]) => {
                const c = (0, view_ts_1.catOf)(cats, id);
                const d = v.plan - v.fact;
                return (0, dom_ts_1.h)(ui_tsx_1.Row, { icon: c.icon, color: c.color, title: c.name, sub: `план ${(0, money_ts_1.fmt)(v.plan)} · факт ${(0, money_ts_1.fmt)(v.fact)}`, value: (0, money_ts_1.fmt)(d, { sign: true }), valueTone: d < 0 ? 'neg' : d > 0 ? 'pos' : 'muted' });
            }))) : null)),
        hasSavings ? ((0, dom_ts_1.h)(ui_tsx_1.Group, { title: "\u0414\u0438\u043D\u0430\u043C\u0456\u043A\u0430 \u0440\u0435\u0430\u043B\u044C\u043D\u0438\u0445 \u043D\u0430\u043A\u043E\u043F\u0438\u0447\u0435\u043D\u044C", foot: "\u041B\u0438\u0448\u0435 \u0444\u0430\u043A\u0442\u0438\u0447\u043D\u0456 \u043F\u0435\u0440\u0435\u043A\u0430\u0437\u0438 \u0439 \u0441\u0442\u0430\u0440\u0442\u043E\u0432\u0430 \u043F\u043E\u0434\u0443\u0448\u043A\u0430 \u2014 \u0431\u0435\u0437 \u0443\u043C\u043E\u0432\u043D\u043E\u0457 \u0435\u043A\u043E\u043D\u043E\u043C\u0456\u0457." },
            (0, dom_ts_1.h)(charts_tsx_1.LineChart, { points: series.map((s) => ({ label: (0, time_ts_1.fmtShort)(s.date), value: s.total })), label: "\u041D\u0430\u043A\u043E\u043F\u0438\u0447\u0435\u043D\u043D\u044F" }))) : null,
        modes.length ? ((0, dom_ts_1.h)(ui_tsx_1.Group, { title: "\u0422\u0440\u0430\u043D\u0441\u043F\u043E\u0440\u0442: \u043F\u043E\u0440\u0456\u0432\u043D\u044F\u043D\u043D\u044F" },
            modes.map((m) => {
                const info = (0, transport_ts_1.modeInfo)(m.mode);
                const bits = [(0, money_ts_1.count)(m.trips, money_ts_1.TRIPS), `у середньому ${(0, money_ts_1.fmt)(m.avgShare, { decimals: 'never' })}`];
                if (m.avgMinutes !== null)
                    bits.push(`${m.avgMinutes} хв`);
                if (m.avgComfort !== null)
                    bits.push(`комфорт ${String(m.avgComfort).replace('.', ',')}/5`);
                return (0, dom_ts_1.h)(ui_tsx_1.Row, { icon: info.icon, title: info.label, sub: bits.join(', '), value: (0, money_ts_1.fmt)(m.share) });
            }),
            taxi && (pubStat || pub) ? (() => {
                const base = pubStat ? { cost: pubStat.avgShare, minutes: pubStat.avgMinutes } : { cost: pub.cost, minutes: pub.minutes };
                const cp = taxi.avgMinutes !== null && base.minutes !== null ? (0, transport_ts_1.comfortPrice)({ cost: taxi.avgShare, minutes: taxi.avgMinutes }, { cost: base.cost, minutes: base.minutes }, data.settings.hourValue) : null;
                const diff = taxi.avgShare - base.cost;
                return ((0, dom_ts_1.h)("div", { class: "group-note" },
                    (0, dom_ts_1.h)("p", null,
                        (0, dom_ts_1.h)("b", null, "\u0426\u0456\u043D\u0430 \u043A\u043E\u043C\u0444\u043E\u0440\u0442\u0443."),
                        " \u0422\u0430\u043A\u0441\u0456 \u0432 \u0441\u0435\u0440\u0435\u0434\u043D\u044C\u043E\u043C\u0443 ",
                        diff >= 0 ? `дорожче на ${(0, money_ts_1.fmt)(diff, { decimals: 'never' })}` : `дешевше на ${(0, money_ts_1.fmt)(-diff, { decimals: 'never' })}`,
                        cp && cp.saved > 0 ? `, зате економить ${cp.saved} хв` : '',
                        "."),
                    cp?.timeValue !== null && cp?.timeValue !== undefined ? (0, dom_ts_1.h)("p", { class: "hint" },
                        "\u0417\u0430 \u0442\u0432\u043E\u0454\u044E \u0446\u0456\u043D\u043D\u0456\u0441\u0442\u044E \u0433\u043E\u0434\u0438\u043D\u0438 \u0446\u0435\u0439 \u0447\u0430\u0441 \u0432\u0430\u0440\u0442\u0443\u0454 ",
                        (0, money_ts_1.fmt)(cp.timeValue, { decimals: 'never' }),
                        cp.pureComfort !== null && cp.pureComfort > 0 ? `; решта ${(0, money_ts_1.fmt)(cp.pureComfort, { decimals: 'never' })} — плата за комфорт` : ' — доплата виправдана',
                        ".") : null));
            })() : null)) : null,
        meals.length ? ((0, dom_ts_1.h)(ui_tsx_1.Group, { title: "\u0414\u043E\u043C\u0430\u0448\u043D\u0456 \u043E\u0431\u0456\u0434\u0438 \u0447\u0438 \u0457\u0434\u0430\u043B\u044C\u043D\u044F" },
            (0, dom_ts_1.h)(ui_tsx_1.Row, { icon: "lunchbox", title: "\u0414\u043E\u043C\u0430\u0448\u043D\u044F \u0457\u0436\u0430", sub: `${(0, money_ts_1.count)(home.length, money_ts_1.TIMES)}, у середньому ${(0, money_ts_1.fmt)(avg(home), { decimals: 'never' })}`, value: (0, money_ts_1.fmt)(home.reduce((s, o) => s + o.amount, 0)) }),
            (0, dom_ts_1.h)(ui_tsx_1.Row, { icon: "utensils", title: "\u041F\u043E\u0437\u0430 \u0434\u043E\u043C\u043E\u043C", sub: `${(0, money_ts_1.count)(out.length, money_ts_1.TIMES)}, у середньому ${(0, money_ts_1.fmt)(avg(out), { decimals: 'never' })}`, value: (0, money_ts_1.fmt)(out.reduce((s, o) => s + o.amount, 0)) }),
            canteen && home.length ? (0, dom_ts_1.h)("div", { class: "group-note" },
                (0, dom_ts_1.h)("p", null,
                    "\u041A\u043E\u0436\u0435\u043D \u0434\u043E\u043C\u0430\u0448\u043D\u0456\u0439 \u043E\u0431\u0456\u0434 \u0437\u0430\u043C\u0456\u0441\u0442\u044C \u0457\u0434\u0430\u043B\u044C\u043D\u0456 (",
                    (0, money_ts_1.fmt)(canteen.amount),
                    ") \u2014 \u0446\u0435 \u0432 \u0441\u0435\u0440\u0435\u0434\u043D\u044C\u043E\u043C\u0443 ",
                    (0, dom_ts_1.h)("b", null, (0, money_ts_1.fmt)(Math.max(0, canteen.amount - avg(home)), { decimals: 'never' })),
                    " \u0440\u0456\u0437\u043D\u0438\u0446\u0456. \u0417\u0430 \u043F\u0435\u0440\u0456\u043E\u0434 \u043F\u043E\u0442\u0435\u043D\u0446\u0456\u0439\u043D\u043E: ",
                    (0, dom_ts_1.h)("b", null, (0, money_ts_1.fmt)(home.filter((o) => o.meal.kind === 'lunchBox').reduce((s, o) => s + Math.max(0, canteen.amount - o.amount), 0))),
                    ".")) : null)) : null,
        (0, dom_ts_1.h)(ui_tsx_1.Group, { title: "\u041C\u0430\u043B\u0435\u043D\u044C\u043A\u0456 \u0433\u0440\u043E\u0448\u0456 \u2014 \u0432\u0435\u043B\u0438\u043A\u0438\u0439 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442", foot: "\u041A\u0430\u0432\u0430, \u0441\u043C\u0430\u043A\u043E\u043B\u0438\u043A\u0438 \u0442\u0430 \u0456\u043D\u0448\u0456 \u0434\u0440\u0456\u0431\u043D\u0438\u0446\u0456. \u041F\u0440\u0438\u0454\u043C\u043D\u043E\u0441\u0442\u0456 \u2014 \u0446\u0435 \u043D\u043E\u0440\u043C\u0430\u043B\u044C\u043D\u043E; \u0432\u0430\u0436\u043B\u0438\u0432\u043E \u0431\u0430\u0447\u0438\u0442\u0438 \u0441\u0443\u043C\u0443." },
            (0, dom_ts_1.h)("div", { class: "micro-grid" },
                (0, dom_ts_1.h)("div", null,
                    (0, dom_ts_1.h)("span", { class: "stat-k" }, "\u0421\u044C\u043E\u0433\u043E\u0434\u043D\u0456"),
                    (0, dom_ts_1.h)("b", { class: "num" }, (0, money_ts_1.fmt)(micro.day))),
                (0, dom_ts_1.h)("div", null,
                    (0, dom_ts_1.h)("span", { class: "stat-k" }, "\u0426\u0435\u0439 \u0442\u0438\u0436\u0434\u0435\u043D\u044C"),
                    (0, dom_ts_1.h)("b", { class: "num" }, (0, money_ts_1.fmt)(micro.week))),
                (0, dom_ts_1.h)("div", null,
                    (0, dom_ts_1.h)("span", { class: "stat-k" }, "\u0426\u0435\u0439 \u043C\u0456\u0441\u044F\u0446\u044C"),
                    (0, dom_ts_1.h)("b", { class: "num" }, (0, money_ts_1.fmt)(micro.month))),
                (0, dom_ts_1.h)("div", null,
                    (0, dom_ts_1.h)("span", { class: "stat-k" }, "\u0426\u0435\u0439 \u0440\u0456\u043A"),
                    (0, dom_ts_1.h)("b", { class: "num" }, (0, money_ts_1.fmt)(micro.year)))),
            micro.avgPerDataDay !== null ? (0, dom_ts_1.h)("p", { class: "group-note" },
                "\u0423 \u0441\u0435\u0440\u0435\u0434\u043D\u044C\u043E\u043C\u0443 ",
                (0, money_ts_1.fmt)(micro.avgPerDataDay, { decimals: 'never' }),
                " \u043D\u0430 \u0434\u0435\u043D\u044C \u0456\u0437 \u0434\u0430\u043D\u0438\u043C\u0438 \u2014 \u0443 \u0442\u0430\u043A\u043E\u043C\u0443 \u0442\u0435\u043C\u043F\u0456 \u2248 ",
                (0, dom_ts_1.h)("b", null, (0, money_ts_1.fmt)(micro.avgPerDataDay * 365, { decimals: 'never' })),
                " \u0437\u0430 \u0440\u0456\u043A. \u0426\u0435 \u0442\u0435\u043C\u043F, \u0430 \u043D\u0435 \u0432\u0438\u0440\u043E\u043A.") : null),
        top.length ? ((0, dom_ts_1.h)(ui_tsx_1.Group, { title: "\u041D\u0430\u0439\u0432\u0438\u0442\u0440\u0430\u0442\u043D\u0456\u0448\u0456 \u0434\u043D\u0456" }, top.map((d) => (0, dom_ts_1.h)(ui_tsx_1.Row, { icon: "calendar", title: (0, time_ts_1.fmtDate)(d.date, { weekday: true }), sub: d.calc.plan ? `план ${(0, money_ts_1.fmt)(d.calc.planTotal)}` : 'без плану', value: (0, money_ts_1.fmt)(d.calc.spent), valueTone: d.calc.over > 0 ? 'neg' : '', chevron: true, onClick: () => (0, view_ts_1.go)('day', { dayDate: d.date === today ? null : d.date }) })))) : null));
}
const TYPES = [
    { id: 'all', label: 'Усі', test: () => true },
    { id: 'expense', label: 'Витрати', test: (o) => o.type === 'expense' && !o.trip },
    { id: 'trip', label: 'Поїздки', test: (o) => Boolean(o.trip) },
    { id: 'meal', label: 'Їжа', test: (o) => Boolean(o.meal) },
    { id: 'income', label: 'Доходи', test: (o) => o.type === 'income' },
    { id: 'saving', label: 'Накопичення', test: (o) => o.type === 'saving' || o.type === 'withdrawal' },
    { id: 'refund', label: 'Повернення', test: (o) => o.type === 'refund' },
    { id: 'transfer', label: 'Перекази', test: (o) => o.type === 'transfer' },
];
function History() {
    const { data, cats } = (0, view_ts_1.derived)();
    let limit = 120;
    const deleted = data.ops.filter((o) => o.deletedAt).sort((a, b) => (b.deletedAt ?? 0) - (a.deletedAt ?? 0));
    const list = (0, dom_ts_1.live)(() => {
        const q = view_ts_1.ui.histQuery.trim().toLowerCase();
        const type = TYPES.find((t) => t.id === view_ts_1.ui.histType) ?? TYPES[0];
        const items = data.ops
            .filter((o) => !o.deletedAt && type.test(o))
            .filter((o) => {
            if (!q)
                return true;
            const hay = [(0, ledger_ts_1.opTitle)(o, cats), o.note ?? '', (0, view_ts_1.catOf)(cats, o.category).name, o.trip?.route ?? '', o.date, (0, time_ts_1.fmtDate)(o.date)].join(' ').toLowerCase();
            return hay.includes(q) || (q.replace(',', '.').match(/^\d+(\.\d+)?$/) !== null && String(o.amount / 100).startsWith(q.replace(',', '.')));
        })
            .sort((a, b) => (a.date === b.date ? b.time - a.time : a.date < b.date ? 1 : -1));
        if (!items.length)
            return (0, dom_ts_1.h)(ui_tsx_1.Empty, { icon: "search", title: "\u041D\u0456\u0447\u043E\u0433\u043E \u043D\u0435 \u0437\u043D\u0430\u0439\u0434\u0435\u043D\u043E", text: q ? 'Спробуй іншу назву, суму чи дату.' : 'Записів цього типу ще немає.' });
        const shown = items.slice(0, limit);
        const groups = new Map();
        for (const o of shown)
            groups.set(o.date, [...(groups.get(o.date) ?? []), o]);
        return ((0, dom_ts_1.h)(dom_ts_1.Fragment, null,
            [...groups.entries()].map(([date, ops]) => ((0, dom_ts_1.h)(ui_tsx_1.Group, { title: (0, time_ts_1.fmtDate)(date, { weekday: true, year: date.slice(0, 4) !== (0, view_ts_1.derived)().today.slice(0, 4) }) }, ops.map((o) => (0, dom_ts_1.h)(forms_tsx_1.OpRow, { op: o }))))),
            items.length > limit ? (0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "secondary", full: true, onClick: () => { limit += 200; list.refresh(); } },
                "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u0438 \u0449\u0435 (",
                items.length - limit,
                ")") : null));
    });
    return ((0, dom_ts_1.h)("div", { class: "stack" },
        (0, dom_ts_1.h)("label", { class: "search" },
            (0, icons_ts_1.icon)('search', 18),
            (0, dom_ts_1.h)("input", { class: "input", type: "search", placeholder: "\u041F\u043E\u0448\u0443\u043A: \u043D\u0430\u0437\u0432\u0430, \u0441\u0443\u043C\u0430, \u043C\u0430\u0440\u0448\u0440\u0443\u0442, \u043D\u043E\u0442\u0430\u0442\u043A\u0430", value: view_ts_1.ui.histQuery, "aria-label": "\u041F\u043E\u0448\u0443\u043A \u0432 \u0456\u0441\u0442\u043E\u0440\u0456\u0457", onInput: (e) => { view_ts_1.ui.histQuery = e.target.value; list.refresh(); } })),
        (0, dom_ts_1.h)("div", { class: "chips chips-scroll" }, TYPES.map((t) => (0, dom_ts_1.h)(ui_tsx_1.Chip, { on: view_ts_1.ui.histType === t.id, onClick: () => (0, view_ts_1.setUI)({ histType: t.id }) }, t.label))),
        list.el,
        deleted.length ? ((0, dom_ts_1.h)(ui_tsx_1.Group, { title: `Видалені записи: ${deleted.length}`, action: (0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "ghost", size: "sm", onClick: () => (0, view_ts_1.setUI)({ showTrash: !view_ts_1.ui.showTrash }) }, view_ts_1.ui.showTrash ? 'Сховати' : 'Показати'), foot: "\u0412\u0438\u0434\u0430\u043B\u0435\u043D\u0456 \u0437\u0430\u043F\u0438\u0441\u0438 \u043D\u0435 \u0432\u0440\u0430\u0445\u043E\u0432\u0443\u044E\u0442\u044C\u0441\u044F \u0432 \u043F\u0456\u0434\u0441\u0443\u043C\u043A\u0430\u0445. \u0407\u0445 \u043C\u043E\u0436\u043D\u0430 \u0432\u0456\u0434\u043D\u043E\u0432\u0438\u0442\u0438." }, view_ts_1.ui.showTrash ? deleted.slice(0, 100).map((o) => ((0, dom_ts_1.h)("div", { class: "row trash-row" },
            (0, dom_ts_1.h)("span", { class: "row-main" },
                (0, dom_ts_1.h)("span", { class: "row-title" }, (0, ledger_ts_1.opTitle)(o, cats)),
                (0, dom_ts_1.h)("span", { class: "row-sub" },
                    (0, time_ts_1.fmtDate)(o.date),
                    " \u00B7 ",
                    (0, money_ts_1.fmt)(o.amount))),
            (0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "tinted", size: "sm", icon: "refund", onClick: () => (0, store_ts_1.restoreOperation)(o.id) }, "\u0412\u0456\u0434\u043D\u043E\u0432\u0438\u0442\u0438"),
            (0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "ghost", size: "sm", icon: "trash", label: "\u0412\u0438\u0434\u0430\u043B\u0438\u0442\u0438 \u043D\u0430\u0437\u0430\u0432\u0436\u0434\u0438", onClick: () => (0, ui_tsx_1.confirmSheet)({ title: 'Видалити назавжди?', text: 'Цей запис не можна буде відновити.', confirm: 'Видалити', danger: true, onConfirm: () => (0, store_ts_1.purgeOperation)(o.id) }) })))) : null)) : null));
}
function AdviceHistory() {
    const { data } = (0, view_ts_1.derived)();
    const list = Object.values(data.days).filter((d) => d.closed && d.advice).sort((a, b) => (a.date < b.date ? 1 : -1));
    if (!list.length)
        return (0, dom_ts_1.h)(ui_tsx_1.Empty, { icon: "spark", title: "\u041F\u043E\u0440\u0430\u0434 \u0449\u0435 \u043D\u0435\u043C\u0430\u0454", text: "\u041F\u043E\u0440\u0430\u0434\u0430 \u0437\u02BC\u044F\u0432\u043B\u044F\u0454\u0442\u044C\u0441\u044F, \u043A\u043E\u043B\u0438 \u0442\u0438 \u0437\u0430\u0432\u0435\u0440\u0448\u0443\u0454\u0448 \u0434\u0435\u043D\u044C \u043A\u043D\u043E\u043F\u043A\u043E\u044E \u00AB\u0417\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u0438 \u0434\u0435\u043D\u044C\u00BB." });
    return ((0, dom_ts_1.h)("div", { class: "stack" },
        (0, dom_ts_1.h)(ui_tsx_1.Note, { tone: "info" }, "\u041A\u043E\u0436\u043D\u0430 \u043F\u043E\u0440\u0430\u0434\u0430 \u043F\u0440\u0438\u0432\u02BC\u044F\u0437\u0430\u043D\u0430 \u0434\u043E \u0434\u0430\u043D\u0438\u0445 \u0441\u0432\u043E\u0433\u043E \u0434\u043D\u044F. \u042F\u043A\u0449\u043E \u0437\u043C\u0456\u043D\u0438\u0442\u0438 \u0437\u0430\u043F\u0438\u0441\u0438 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043E\u0433\u043E \u0434\u043D\u044F, \u043F\u043E\u0440\u0430\u0434\u0443 \u0431\u0443\u0434\u0435 \u043F\u0435\u0440\u0435\u0440\u0430\u0445\u043E\u0432\u0430\u043D\u043E."),
        list.map((d) => ((0, dom_ts_1.h)("section", { class: "advice-item" },
            (0, dom_ts_1.h)("button", { type: "button", class: "advice-date", onClick: () => (0, view_ts_1.go)('day', { dayDate: d.date === (0, view_ts_1.derived)().today ? null : d.date }) },
                (0, time_ts_1.fmtDate)(d.date, { weekday: true }),
                (0, icons_ts_1.icon)('chevronRight', 14)),
            (0, dom_ts_1.h)(advice_tsx_1.AdviceCard, { advice: d.advice, compact: true }))))));
}
};

// ── FutureScreen.tsx
defs["FutureScreen.js"] = function (require, exports, module) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FutureScreen = FutureScreen;
const dom_ts_1 = require("./dom.js");
const icons_ts_1 = require("./icons.js");
const ui_tsx_1 = require("./ui.js");
const forms_tsx_1 = require("./forms.js");
const advice_tsx_1 = require("./advice.js");
const store_ts_1 = require("./store.js");
const view_ts_1 = require("./view.js");
const ledger_ts_1 = require("./ledger.js");
const budget_ts_1 = require("./budget.js");
const forecast_ts_1 = require("./forecast.js");
const insights_ts_1 = require("./insights.js");
const goals_ts_1 = require("./goals.js");
const habits_ts_1 = require("./habits.js");
const transport_ts_1 = require("./transport.js");
const meals_ts_1 = require("./meals.js");
const calendar_ts_1 = require("./calendar.js");
const defaults_ts_1 = require("./defaults.js");
const money_ts_1 = require("./money.js");
const time_ts_1 = require("./time.js");
const H_LABEL = { 30: '30 днів', 182: '6 місяців', 365: '1 рік' };
function FutureScreen() {
    return ((0, dom_ts_1.h)("div", { class: "screen future" },
        (0, dom_ts_1.h)("header", { class: "screen-head" },
            (0, dom_ts_1.h)("h1", { class: "h1" }, "\u041C\u0430\u0439\u0431\u0443\u0442\u043D\u0454"),
            (0, dom_ts_1.h)("p", { class: "kicker" }, "\u041F\u0440\u043E\u0433\u043D\u043E\u0437\u0438 \u2014 \u0446\u0435 \u043E\u0446\u0456\u043D\u043A\u0438, \u0430 \u043D\u0435 \u0433\u0430\u0440\u0430\u043D\u0442\u043E\u0432\u0430\u043D\u0438\u0439 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442.")),
        (0, dom_ts_1.h)(ui_tsx_1.Seg, { value: view_ts_1.ui.futureTab, label: "\u0420\u043E\u0437\u0434\u0456\u043B", options: [
                { value: 'forecast', label: 'Прогноз' },
                { value: 'whatif', label: 'Що, якби' },
                { value: 'goals', label: 'Цілі' },
                { value: 'habits', label: 'Звички' },
            ], onChange: (v) => (0, view_ts_1.setUI)({ futureTab: v }) }),
        view_ts_1.ui.futureTab === 'forecast' ? (0, dom_ts_1.h)(Forecast, null) : view_ts_1.ui.futureTab === 'whatif' ? (0, dom_ts_1.h)(WhatIf, null) : view_ts_1.ui.futureTab === 'goals' ? (0, dom_ts_1.h)(Goals, null) : (0, dom_ts_1.h)(Habits, null)));
}
function Forecast() {
    const { data, ix, cats, today } = (0, view_ts_1.derived)();
    const s = data.settings;
    const samples = (0, forecast_ts_1.collectSamples)(ix, data.days, cats, s.calendar, today);
    const f = (0, forecast_ts_1.forecast)(samples, s.calendar, today, s.forecastStayOnly);
    const sc = f.scenarios.find((x) => x.id === view_ts_1.ui.scenario) ?? f.scenarios[1];
    const saved = (0, ledger_ts_1.savingsTotal)(ix, s.budget.savingsStart);
    const pace = (0, forecast_ts_1.savingsPace)(ix, today);
    const last = [...samples].reverse()[0];
    const ill = last && last.economy > 0 ? (0, forecast_ts_1.illustrate)(last.economy, s.calendar, today, s.forecastStayOnly) : null;
    const top = (0, insights_ts_1.topCategories)((0, ledger_ts_1.calcPeriod)(ix, data.days, cats, (0, time_ts_1.addDays)(today, -29), today, today), cats);
    const impacts = (0, insights_ts_1.decisionImpacts)(ix, data.days, cats, s, today);
    const goals = data.goals.map((g) => (0, goals_ts_1.goalView)(g, ix, today));
    return ((0, dom_ts_1.h)("div", { class: "stack-lg" },
        f.enough ? ((0, dom_ts_1.h)(dom_ts_1.Fragment, null,
            (0, dom_ts_1.h)(ui_tsx_1.Seg, { small: true, value: view_ts_1.ui.scenario, label: "\u0421\u0446\u0435\u043D\u0430\u0440\u0456\u0439", options: [
                    { value: 'conservative', label: 'Консервативний' },
                    { value: 'base', label: 'Базовий' },
                    { value: 'optimistic', label: 'Оптимістичний' },
                ], onChange: (v) => (0, view_ts_1.setUI)({ scenario: v }) }),
            (0, dom_ts_1.h)("p", { class: "hint" }, sc.note),
            (0, dom_ts_1.h)("section", { class: "horizons" }, forecast_ts_1.SPANS.map((hz) => ((0, dom_ts_1.h)("div", { class: "horizon" },
                (0, dom_ts_1.h)("span", { class: "horizon-k" }, H_LABEL[hz]),
                (0, dom_ts_1.h)("span", { class: (0, dom_ts_1.cx)('horizon-v num', sc.totals[hz] < 0 ? 'neg' : 'pos') }, (0, money_ts_1.fmt)(sc.totals[hz], { decimals: 'never' })),
                (0, dom_ts_1.h)("span", { class: "horizon-s" },
                    (0, money_ts_1.count)(f.counts[hz].work, money_ts_1.WORKDAYS),
                    sc.perOff ? `, ${f.counts[hz].off} вихідних` : ''))))),
            (0, dom_ts_1.h)("p", { class: "hint" },
                "\u041F\u043E\u0442\u0435\u043D\u0446\u0456\u0439\u043D\u0430 \u0435\u043A\u043E\u043D\u043E\u043C\u0456\u044F \u0432\u0456\u0434\u043D\u043E\u0441\u043D\u043E \u043F\u043B\u0430\u043D\u0443: ",
                (0, money_ts_1.fmt)(sc.perWork),
                " \u0443 \u0440\u043E\u0431\u043E\u0447\u0438\u0439 \u0434\u0435\u043D\u044C",
                sc.perOff ? `, ${(0, money_ts_1.fmt)(sc.perOff)} у вихідний` : '',
                ". \u0421\u043F\u043E\u0441\u0442\u0435\u0440\u0435\u0436\u0435\u043D\u044C: ",
                f.samples,
                " (",
                f.work,
                " \u0440\u043E\u0431\u043E\u0447\u0438\u0445, ",
                f.off,
                " \u0432\u0438\u0445\u0456\u0434\u043D\u0438\u0445). \u0414\u043E\u0442\u0440\u0438\u043C\u0430\u043D\u043D\u044F \u043F\u043B\u0430\u043D\u0443: ",
                f.adherence ?? 0,
                "% \u0434\u043D\u0456\u0432."))) : ((0, dom_ts_1.h)(dom_ts_1.Fragment, null,
            (0, dom_ts_1.h)(ui_tsx_1.Note, { tone: "info" },
                "\u0414\u043B\u044F \u043F\u0440\u043E\u0433\u043D\u043E\u0437\u0443 \u043F\u043E\u0442\u0440\u0456\u0431\u043D\u043E \u0449\u043E\u043D\u0430\u0439\u043C\u0435\u043D\u0448\u0435 5 \u0434\u043D\u0456\u0432 \u0456\u0437 \u043F\u043B\u0430\u043D\u043E\u043C \u0456 \u0437\u0430\u043F\u0438\u0441\u0430\u043C\u0438 (\u0437 \u043D\u0438\u0445 3 \u0440\u043E\u0431\u043E\u0447\u0456). \u0417\u0430\u0440\u0430\u0437: ",
                f.samples,
                ". \u041F\u043E\u043A\u0438 \u2014 \u043B\u0438\u0448\u0435 \u0443\u043C\u043E\u0432\u043D\u0430 \u0456\u043B\u044E\u0441\u0442\u0440\u0430\u0446\u0456\u044F, \u0430 \u043D\u0435 \u043F\u0440\u043E\u0433\u043D\u043E\u0437."),
            ill ? ((0, dom_ts_1.h)(ui_tsx_1.Group, { title: `Якщо повторювати економію ${(0, money_ts_1.fmt)(last.economy)} у робочі дні`, foot: "\u0423\u043C\u043E\u0432\u043D\u0438\u0439 \u0440\u043E\u0437\u0440\u0430\u0445\u0443\u043D\u043E\u043A \u0437\u0430 \u0442\u0432\u043E\u0457\u043C \u043A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u0435\u043C \u0440\u043E\u0431\u043E\u0447\u0438\u0445 \u0434\u043D\u0456\u0432. \u041E\u0434\u0438\u043D \u0434\u0435\u043D\u044C \u2014 \u043D\u0435 \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0430." }, forecast_ts_1.SPANS.map((hz) => (0, dom_ts_1.h)(ui_tsx_1.Row, { icon: "sprout", title: H_LABEL[hz], sub: (0, money_ts_1.count)(ill[hz].work, money_ts_1.WORKDAYS), value: (0, money_ts_1.fmt)(ill[hz].amount), valueTone: "pos" })))) : null)),
        s.calendar.stays.length ? ((0, dom_ts_1.h)("div", { class: "toggle-row card-row" },
            (0, dom_ts_1.h)("span", null,
                "\u0420\u0430\u0445\u0443\u0432\u0430\u0442\u0438 \u043B\u0438\u0448\u0435 \u0434\u043D\u0456 \u043F\u0435\u0440\u0435\u0431\u0443\u0432\u0430\u043D\u043D\u044F \u0432 \u0414\u043D\u0456\u043F\u0440\u0456",
                (0, dom_ts_1.h)("small", null, s.calendar.stays.map((x) => `${(0, time_ts_1.fmtDate)(x.from)} — ${(0, time_ts_1.fmtDate)(x.to)}`).join('; '))),
            (0, dom_ts_1.h)(ui_tsx_1.Toggle, { checked: s.forecastStayOnly, label: "\u041B\u0438\u0448\u0435 \u0434\u043D\u0456 \u043F\u0435\u0440\u0435\u0431\u0443\u0432\u0430\u043D\u043D\u044F", onChange: (v) => (0, store_ts_1.saveSettings)((st) => ({ ...st, forecastStayOnly: v })) }))) : null,
        (0, dom_ts_1.h)(ui_tsx_1.Group, { title: "\u041D\u0430\u043A\u043E\u043F\u0438\u0447\u0435\u043D\u043D\u044F" },
            (0, dom_ts_1.h)(ui_tsx_1.Row, { icon: "coins", title: "\u0420\u0435\u0430\u043B\u044C\u043D\u043E \u043D\u0430\u043A\u043E\u043F\u0438\u0447\u0435\u043D\u043E", sub: "\u0421\u0442\u0430\u0440\u0442\u043E\u0432\u0430 \u043F\u043E\u0434\u0443\u0448\u043A\u0430 + \u0444\u0430\u043A\u0442\u0438\u0447\u043D\u0456 \u043F\u0435\u0440\u0435\u043A\u0430\u0437\u0438", value: (0, money_ts_1.fmt)(saved), valueTone: "pos" }),
            f.enough ? (0, dom_ts_1.h)(ui_tsx_1.Row, { icon: "sprout", title: "\u042F\u043A\u0449\u043E \u0432\u0456\u0434\u043A\u043B\u0430\u0434\u0430\u0442\u0438 \u0432\u0441\u044E \u0435\u043A\u043E\u043D\u043E\u043C\u0456\u044E", sub: `${sc.label.toLowerCase()} сценарій, 1 рік`, value: (0, money_ts_1.fmt)(saved + Math.max(0, sc.totals[365])) }) : null,
            pace ? (0, dom_ts_1.h)(ui_tsx_1.Row, { icon: "repeat", title: "\u0417\u0430 \u0442\u0435\u043C\u043F\u043E\u043C \u0440\u0435\u0430\u043B\u044C\u043D\u0438\u0445 \u043F\u0435\u0440\u0435\u043A\u0430\u0437\u0456\u0432", sub: `${(0, money_ts_1.fmt)(pace.perDay)} на день; через рік`, value: (0, money_ts_1.fmt)(saved + pace.perDay * 365) }) : (0, dom_ts_1.h)(ui_tsx_1.Row, { icon: "repeat", title: "\u0422\u0435\u043C\u043F \u0440\u0435\u0430\u043B\u044C\u043D\u0438\u0445 \u043F\u0435\u0440\u0435\u043A\u0430\u0437\u0456\u0432", sub: "\u0417\u02BC\u044F\u0432\u0438\u0442\u044C\u0441\u044F \u043F\u0456\u0441\u043B\u044F \u043A\u0456\u043B\u044C\u043A\u043E\u0445 \u043F\u0435\u0440\u0435\u043A\u0430\u0437\u0456\u0432 \u0443\u043F\u0440\u043E\u0434\u043E\u0432\u0436 \u0434\u0432\u043E\u0445 \u0442\u0438\u0436\u043D\u0456\u0432", value: "\u2014" }),
            goals.length ? goals.slice(0, 3).map((g) => (0, dom_ts_1.h)(ui_tsx_1.Row, { icon: "target", title: g.goal.name, sub: g.done ? 'Досягнуто' : g.projection ? `орієнтовно до ${(0, time_ts_1.fmtDate)(g.projection.date, { year: true })}` : 'дата — коли буде достатньо даних', value: `${g.pct}%`, onClick: () => (0, view_ts_1.setUI)({ futureTab: 'goals' }), chevron: true })) : null,
            (0, dom_ts_1.h)("div", { class: "group-actions" },
                (0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "primary", icon: "coins", onClick: () => (0, advice_tsx_1.openSaveSheet)() }, "\u0412\u0456\u0434\u043A\u043B\u0430\u0441\u0442\u0438 \u0433\u0440\u043E\u0448\u0456"))),
        (0, dom_ts_1.h)(BudgetCard, null),
        top.length ? ((0, dom_ts_1.h)(ui_tsx_1.Group, { title: "\u041D\u0430 \u0449\u043E \u043D\u0430\u0439\u0431\u0456\u043B\u044C\u0448\u0435 \u0432\u0438\u0442\u0440\u0430\u0447\u0430\u044E\u0442\u044C\u0441\u044F \u0433\u0440\u043E\u0448\u0456", foot: "\u041E\u0441\u0442\u0430\u043D\u043D\u0456 30 \u0434\u043D\u0456\u0432." }, top.map((t) => (0, dom_ts_1.h)(ui_tsx_1.Row, { icon: "bars", title: t.name, sub: `${t.share}% витрат`, value: (0, money_ts_1.fmt)(t.amount) })))) : null,
        impacts.length ? ((0, dom_ts_1.h)(ui_tsx_1.Group, { title: "\u0420\u0456\u0448\u0435\u043D\u043D\u044F \u0437 \u043D\u0430\u0439\u0431\u0456\u043B\u044C\u0448\u0438\u043C \u0432\u043F\u043B\u0438\u0432\u043E\u043C", foot: "\u041E\u0441\u0442\u0430\u043D\u043D\u0456 30 \u0434\u043D\u0456\u0432. \u0421\u043A\u0456\u043B\u044C\u043A\u0438 \u043A\u043E\u0448\u0442\u0443\u0432\u0430\u043B\u0438 \u043E\u043A\u0440\u0435\u043C\u0456 \u0437\u0432\u0438\u0447\u043A\u0438 \u043F\u043E\u0440\u0456\u0432\u043D\u044F\u043D\u043E \u0437 \u0434\u0435\u0448\u0435\u0432\u0448\u043E\u044E \u0430\u043B\u044C\u0442\u0435\u0440\u043D\u0430\u0442\u0438\u0432\u043E\u044E." },
            impacts.map((i) => (0, dom_ts_1.h)(ui_tsx_1.Row, { icon: "bulb", title: i.label, sub: i.detail, value: (0, money_ts_1.fmt)(i.amount) })),
            (0, dom_ts_1.h)("div", { class: "group-actions" },
                (0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "tinted", icon: "spark", onClick: () => (0, view_ts_1.setUI)({ futureTab: 'whatif' }) }, "\u0417\u043C\u043E\u0434\u0435\u043B\u044E\u0432\u0430\u0442\u0438 \u0437\u043C\u0456\u043D\u0438")))) : null));
}
function BudgetCard() {
    const { data, ix, cats, today } = (0, view_ts_1.derived)();
    const s = data.settings;
    const c = (0, ledger_ts_1.calcDay)(ix, today, data.days[today], cats);
    const bv = (0, budget_ts_1.budgetView)({ ix, settings: s, days: data.days, today, todayCalc: c, todayClosed: Boolean(data.days[today]?.closed) });
    const month = (0, ledger_ts_1.calcPeriod)(ix, data.days, cats, (0, time_ts_1.startOfMonth)(today), today, today);
    const flex = [
        { label: 'Транспорт', limit: s.budget.flexTransport, spent: month.byCat.transport ?? 0 },
        { label: 'Продукти', limit: s.budget.flexGroceries, spent: month.byCat.groceries ?? 0 },
    ].filter((f) => f.limit !== null && f.limit > 0);
    if (bv.status === 'unknown') {
        return ((0, dom_ts_1.h)(ui_tsx_1.Group, { title: "\u041E\u0441\u043E\u0431\u0438\u0441\u0442\u0438\u0439 \u0431\u044E\u0434\u0436\u0435\u0442" },
            (0, dom_ts_1.h)(ui_tsx_1.Empty, { icon: "wallet", title: "\u0411\u044E\u0434\u0436\u0435\u0442 \u043D\u0435 \u043D\u0430\u043B\u0430\u0448\u0442\u043E\u0432\u0430\u043D\u043E", text: "\u0412\u043A\u0430\u0436\u0438 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0456 \u043A\u043E\u0448\u0442\u0438, \u0434\u043E\u0445\u043E\u0434\u0438 \u0439 \u043E\u0431\u043E\u0432\u02BC\u044F\u0437\u043A\u043E\u0432\u0456 \u043F\u043B\u0430\u0442\u0435\u0436\u0456 \u2014 \u0456 \u0437\u0430\u0441\u0442\u043E\u0441\u0443\u043D\u043E\u043A \u043F\u043E\u0440\u0430\u0445\u0443\u0454, \u0441\u043A\u0456\u043B\u044C\u043A\u0438 \u043C\u043E\u0436\u043D\u0430 \u0431\u0435\u0437\u043F\u0435\u0447\u043D\u043E \u0432\u0456\u0434\u043A\u043B\u0430\u0441\u0442\u0438.", action: (0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "primary", onClick: () => (0, view_ts_1.go)('settings', { settingsPage: 'budget' }) }, "\u041D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u0442\u0438") })));
    }
    return ((0, dom_ts_1.h)(ui_tsx_1.Group, { title: "\u041E\u0441\u043E\u0431\u0438\u0441\u0442\u0438\u0439 \u0431\u044E\u0434\u0436\u0435\u0442", foot: bv.noIncome ? 'Доходи не вказано — резерв рахується на 30 днів наперед.' : `Майбутній дохід ${(0, time_ts_1.fmtDate)(bv.nextIncome.date)} (${(0, money_ts_1.fmt)(bv.nextIncome.amount)}) ще не враховано в доступних коштах.` },
        (0, dom_ts_1.h)(ui_tsx_1.Row, { icon: "wallet", title: "\u0414\u043E\u0441\u0442\u0443\u043F\u043D\u043E \u0437\u0430\u0440\u0430\u0437", value: (0, money_ts_1.fmt)(bv.available ?? 0) }),
        bv.obligations.map((o) => ((0, dom_ts_1.h)(ui_tsx_1.Row, { icon: "doc", title: o.name, sub: `${defaults_ts_1.OBLIGATION_KINDS[o.kind]}, ${(0, time_ts_1.fmtDate)(o.date)}${o.overdue ? ' — прострочено' : ''}`, value: o.paid ? 'сплачено' : `−${(0, money_ts_1.fmt)(o.amount)}`, valueTone: o.paid ? 'muted' : o.overdue ? 'neg' : '', onClick: o.paid ? undefined : () => (0, forms_tsx_1.openQuickAdd)({ date: today, category: 'bills' }) }))),
        (0, dom_ts_1.h)(ui_tsx_1.Row, { icon: "calendar", title: "\u0429\u043E\u0434\u0435\u043D\u043D\u0456 \u043F\u043E\u0442\u0440\u0435\u0431\u0438", sub: `${(0, money_ts_1.count)(bv.dailyDays, money_ts_1.DAYS)} × ${(0, money_ts_1.fmt)(bv.need.amount)}${bv.need.source === 'history' ? ' (твоя медіана)' : bv.need.source === 'none' ? ' (не вказано)' : ''}${bv.reserveToday ? ` + сьогодні ${(0, money_ts_1.fmt)(bv.reserveToday)}` : ''}`, value: `−${(0, money_ts_1.fmt)(bv.reserveDaily + bv.reserveToday)}` }),
        bv.buffer ? (0, dom_ts_1.h)(ui_tsx_1.Row, { icon: "shield", title: "\u0417\u0430\u043F\u0430\u0441 \u0431\u0435\u0437\u043F\u0435\u043A\u0438", value: `−${(0, money_ts_1.fmt)(bv.buffer)}` }) : null,
        (0, dom_ts_1.h)(ui_tsx_1.Row, { icon: "coins", title: bv.status === 'deficit' ? 'Бракує' : 'Вільні кошти', value: (0, money_ts_1.fmt)(bv.free ?? 0), valueTone: bv.status === 'deficit' ? 'neg' : 'pos', class: "row-strong" }),
        flex.length ? ((0, dom_ts_1.h)("div", { class: "group-note" },
            (0, dom_ts_1.h)("p", { class: "field-label" }, "\u0413\u043D\u0443\u0447\u043A\u0456 \u0431\u044E\u0434\u0436\u0435\u0442\u0438 \u0446\u044C\u043E\u0433\u043E \u043C\u0456\u0441\u044F\u0446\u044F"),
            flex.map((f) => ((0, dom_ts_1.h)("div", { class: "flex-budget" },
                (0, dom_ts_1.h)("div", { class: "kv" },
                    (0, dom_ts_1.h)("span", null, f.label),
                    (0, dom_ts_1.h)("b", { class: "num" },
                        (0, money_ts_1.fmt)(f.spent, { decimals: 'never' }),
                        " \u0437 ",
                        (0, money_ts_1.fmt)(f.limit, { decimals: 'never' }))),
                (0, dom_ts_1.h)(ui_tsx_1.Progress, { value: f.spent / f.limit, tone: f.spent > f.limit ? 'over' : 'accent', label: f.label })))))) : null,
        bv.status === 'deficit' ? (0, dom_ts_1.h)("div", { class: "group-note" },
            (0, dom_ts_1.h)(ui_tsx_1.Note, { tone: "warn" },
                "\u0421\u043F\u0435\u0440\u0448\u0443 \u2014 \u043E\u0431\u043E\u0432\u02BC\u044F\u0437\u043A\u043E\u0432\u0456 \u043F\u043B\u0430\u0442\u0435\u0436\u0456. \u041F\u043E\u043A\u0438 \u0431\u0440\u0430\u043A\u0443\u0454 ",
                (0, money_ts_1.fmt)(bv.shortfall),
                ", \u043F\u0435\u0440\u0435\u043A\u0430\u0437\u0443\u0432\u0430\u0442\u0438 \u0433\u0440\u043E\u0448\u0456 \u0432 \u043D\u0430\u043A\u043E\u043F\u0438\u0447\u0435\u043D\u043D\u044F \u043D\u0435 \u0432\u0430\u0440\u0442\u043E.")) : null));
}
function WhatIf() {
    const { data, ix, cats, today } = (0, view_ts_1.derived)();
    const s = data.settings;
    const w = view_ts_1.ui.whatIf;
    const taxi = (0, transport_ts_1.taxiRef)(ix, today);
    const pub = (0, transport_ts_1.publicRef)(ix, s, today);
    const canteen = (0, meals_ts_1.canteenRef)(ix, s, today);
    const home = (0, meals_ts_1.homeMealRef)(ix, today);
    const coffee = data.micro.find((m) => m.id === 'q-coffee')?.price ?? null;
    const p30 = (0, ledger_ts_1.calcPeriod)(ix, data.days, cats, (0, time_ts_1.addDays)(today, -29), today, today);
    const treatsPerDay = p30.dataDays ? Math.round((p30.byCat.treats ?? 0) / p30.dataDays) : 0;
    const wpw = (0, calendar_ts_1.workdaysPerWeek)(s.calendar);
    const res = (0, dom_ts_1.live)(() => {
        const weekly = (taxi && pub ? Math.max(0, taxi.cost - pub.cost) * w.taxi : 0) +
            (canteen && home !== null ? Math.max(0, canteen.amount - home) * w.homeLunch : 0) +
            (coffee ? coffee * w.coffee * wpw : 0) +
            Math.round((treatsPerDay * 7 * w.treatsPct) / 100);
        const m = Math.round((weekly * 30) / 7);
        const hy = Math.round((weekly * 182) / 7);
        const y = Math.round((weekly * 365) / 7);
        return ((0, dom_ts_1.h)("section", { class: "whatif-res", "aria-live": "polite" },
            (0, dom_ts_1.h)("span", { class: "whatif-k" }, "\u041C\u043E\u0434\u0435\u043B\u044C\u043E\u0432\u0430\u043D\u0430 \u0435\u043A\u043E\u043D\u043E\u043C\u0456\u044F"),
            (0, dom_ts_1.h)("div", { class: "horizons" },
                (0, dom_ts_1.h)("div", { class: "horizon" },
                    (0, dom_ts_1.h)("span", { class: "horizon-k" }, "\u041C\u0456\u0441\u044F\u0446\u044C"),
                    (0, dom_ts_1.h)("span", { class: "horizon-v num pos" }, (0, money_ts_1.fmt)(m, { decimals: 'never' }))),
                (0, dom_ts_1.h)("div", { class: "horizon" },
                    (0, dom_ts_1.h)("span", { class: "horizon-k" }, "\u041F\u0456\u0432 \u0440\u043E\u043A\u0443"),
                    (0, dom_ts_1.h)("span", { class: "horizon-v num pos" }, (0, money_ts_1.fmt)(hy, { decimals: 'never' }))),
                (0, dom_ts_1.h)("div", { class: "horizon" },
                    (0, dom_ts_1.h)("span", { class: "horizon-k" }, "\u0420\u0456\u043A"),
                    (0, dom_ts_1.h)("span", { class: "horizon-v num pos" }, (0, money_ts_1.fmt)(y, { decimals: 'never' })))),
            (0, dom_ts_1.h)("p", { class: "hint" }, "\u0426\u0435 \u0430\u043B\u044C\u0442\u0435\u0440\u043D\u0430\u0442\u0438\u0432\u043D\u0456 \u0432\u0438\u0442\u0440\u0430\u0442\u0438 \u0437\u0430 \u043C\u043E\u0434\u0435\u043B\u043B\u044E, \u0430 \u043D\u0435 \u0444\u0430\u043A\u0442\u0438\u0447\u043D\u0456 \u0433\u0440\u043E\u0448\u0456. \u0412\u043E\u043D\u0438 \u0441\u0442\u0430\u043D\u0443\u0442\u044C \u0437\u0430\u043E\u0449\u0430\u0434\u0436\u0435\u043D\u043D\u044F\u043C\u0438, \u043B\u0438\u0448\u0435 \u044F\u043A\u0449\u043E \u0442\u0438 \u0457\u0445 \u0432\u0456\u0434\u043A\u043B\u0430\u0434\u0435\u0448.")));
    });
    const slider = (label, sub, key, max, step, unit, ok, need) => {
        const valueEl = (0, dom_ts_1.h)("b", { class: "num" }, unit(w[key]));
        return ((0, dom_ts_1.h)("div", { class: (0, dom_ts_1.cx)('slider', !ok && 'disabled') },
            (0, dom_ts_1.h)("div", { class: "slider-top" },
                (0, dom_ts_1.h)("span", null, label),
                valueEl),
            (0, dom_ts_1.h)("span", { class: "hint" }, ok ? sub : need),
            (0, dom_ts_1.h)("input", { type: "range", min: "0", max: String(max), step: String(step), value: String(w[key]), disabled: !ok, "aria-label": label, onInput: (e) => { w[key] = Number(e.target.value); valueEl.textContent = unit(w[key]); res.refresh(); } })));
    };
    return ((0, dom_ts_1.h)("div", { class: "stack-lg" },
        (0, dom_ts_1.h)("p", { class: "lead" }, "\u0417\u043C\u0456\u043D\u0438 \u0437\u0432\u0438\u0447\u043A\u0443 \u2014 \u0456 \u043F\u043E\u0434\u0438\u0432\u0438\u0441\u044C, \u044F\u043A \u0446\u0435 \u0432\u043F\u043B\u0438\u043D\u0435 \u043D\u0430 \u043C\u0456\u0441\u044F\u0446\u044C, \u043F\u0456\u0432 \u0440\u043E\u043A\u0443 \u0439 \u0440\u0456\u043A. \u0420\u043E\u0437\u0440\u0430\u0445\u0443\u043D\u043E\u043A \u0441\u043F\u0438\u0440\u0430\u0454\u0442\u044C\u0441\u044F \u043D\u0430 \u0442\u0432\u043E\u0457 \u0432\u043B\u0430\u0441\u043D\u0456 \u0434\u0430\u043D\u0456."),
        res.el,
        (0, dom_ts_1.h)(ui_tsx_1.Group, null,
            (0, dom_ts_1.h)("div", { class: "sliders" },
                slider('Автобус замість таксі', taxi && pub ? `Таксі ≈ ${(0, money_ts_1.fmt)(taxi.cost, { decimals: 'never' })}, громадський транспорт ≈ ${(0, money_ts_1.fmt)(pub.cost, { decimals: 'never' })} за поїздку` : '', 'taxi', 10, 1, (v) => `${v} на тиждень`, Boolean(taxi && pub), 'Потрібні хоча б одна поїздка таксі та дві громадським транспортом (або типова ціна в налаштуваннях).'),
                slider('Домашній обід замість їдальні', canteen && home !== null ? `Їдальня ≈ ${(0, money_ts_1.fmt)(canteen.amount, { decimals: 'never' })}, домашній ≈ ${(0, money_ts_1.fmt)(home, { decimals: 'never' })}` : '', 'homeLunch', 7, 1, (v) => `${v} на тиждень`, Boolean(canteen && home !== null), 'Потрібні ціна обіду в їдальні та щонайменше два записи домашнього обіду.'),
                slider('Менше кави', coffee ? `Типова кава — ${(0, money_ts_1.fmt)(coffee)}, ${wpw} робочих днів на тиждень` : '', 'coffee', 3, 1, (v) => (v ? `−${v} на день` : 'як є'), Boolean(coffee), 'Вкажи типову ціну кави в налаштуваннях швидких кнопок.'),
                slider('Скоротити смаколики', treatsPerDay ? `Зараз ≈ ${(0, money_ts_1.fmt)(treatsPerDay, { decimals: 'never' })} на день із даними` : '', 'treatsPct', 100, 10, (v) => `${v}%`, treatsPerDay > 0, 'Поки немає записів смаколиків за 30 днів.'))),
        (0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "secondary", full: true, icon: "smile", onClick: () => { view_ts_1.ui.whatIf = { taxi: 0, homeLunch: 0, coffee: 0, treatsPct: 0 }; (0, view_ts_1.setUI)({}); (0, ui_tsx_1.toast)('Комфорт без змін — теж свідомий вибір.'); } }, "\u0417\u0430\u043B\u0438\u0448\u0438\u0442\u0438 \u043F\u043E\u0442\u043E\u0447\u043D\u0438\u0439 \u043A\u043E\u043C\u0444\u043E\u0440\u0442")));
}
function Goals() {
    const { data, ix, today } = (0, view_ts_1.derived)();
    const total = (0, ledger_ts_1.savingsTotal)(ix, data.settings.budget.savingsStart);
    const views = data.goals.map((g) => (0, goals_ts_1.goalView)(g, ix, today));
    const free = (0, goals_ts_1.unassigned)(total, views);
    const monthlyGoal = data.settings.budget.monthlyGoal;
    const monthSaved = ix.all.filter((o) => o.date >= (0, time_ts_1.startOfMonth)(today) && o.date <= today).reduce((s, o) => s + (o.type === 'saving' ? o.amount : o.type === 'withdrawal' ? -o.amount : 0), 0);
    const transfers = ix.all.filter((o) => o.type === 'saving' || o.type === 'withdrawal').sort((a, b) => (a.date === b.date ? b.time - a.time : a.date < b.date ? 1 : -1)).slice(0, 12);
    return ((0, dom_ts_1.h)("div", { class: "stack-lg" },
        (0, dom_ts_1.h)("section", { class: "savings-hero" },
            (0, dom_ts_1.h)("span", { class: "hero-k" }, "\u0420\u0435\u0430\u043B\u044C\u043D\u043E \u043D\u0430\u043A\u043E\u043F\u0438\u0447\u0435\u043D\u043E"),
            (0, dom_ts_1.h)("span", { class: "hero-big num" }, (0, money_ts_1.fmt)(total)),
            (0, dom_ts_1.h)("span", { class: "hero-sub" }, data.settings.budget.savingsStart ? `з них стартова подушка ${(0, money_ts_1.fmt)(data.settings.budget.savingsStart)}` : 'лише фактичні перекази'),
            monthlyGoal ? ((0, dom_ts_1.h)("div", { class: "month-goal" },
                (0, dom_ts_1.h)("div", { class: "kv" },
                    (0, dom_ts_1.h)("span", null, "\u0426\u044C\u043E\u0433\u043E \u043C\u0456\u0441\u044F\u0446\u044F \u0432\u0456\u0434\u043A\u043B\u0430\u0434\u0435\u043D\u043E"),
                    (0, dom_ts_1.h)("b", { class: "num" },
                        (0, money_ts_1.fmt)(monthSaved),
                        " \u0437 ",
                        (0, money_ts_1.fmt)(monthlyGoal))),
                (0, dom_ts_1.h)(ui_tsx_1.Progress, { value: monthSaved / monthlyGoal, tone: monthSaved >= monthlyGoal ? 'ok' : 'accent', label: "\u041C\u0456\u0441\u044F\u0447\u043D\u0430 \u0446\u0456\u043B\u044C \u0437\u0430\u043E\u0449\u0430\u0434\u0436\u0435\u043D\u044C" }))) : null,
            (0, dom_ts_1.h)("div", { class: "btn-row" },
                (0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "primary", icon: "coins", onClick: () => (0, advice_tsx_1.openSaveSheet)() }, "\u0412\u0456\u0434\u043A\u043B\u0430\u0441\u0442\u0438"),
                (0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "secondary", icon: "arrowUp", onClick: () => (0, ui_tsx_1.openSheet)({ title: 'Узяти з накопичень', render: (close) => (0, dom_ts_1.h)(forms_tsx_1.MoreForm, { date: today, kind: "withdrawal", onDone: (op) => { close(); if (op)
                                (0, forms_tsx_1.addedToast)(op); } }) }) }, "\u0423\u0437\u044F\u0442\u0438"))),
        views.length ? ((0, dom_ts_1.h)(ui_tsx_1.Group, { title: "\u0424\u0456\u043D\u0430\u043D\u0441\u043E\u0432\u0456 \u0446\u0456\u043B\u0456" },
            views.map((v) => (0, dom_ts_1.h)(GoalRow, { v: v })),
            free > 0 && views.length ? (0, dom_ts_1.h)(ui_tsx_1.Row, { icon: "coins", title: "\u0411\u0435\u0437 \u043F\u0440\u0438\u0432\u02BC\u044F\u0437\u043A\u0438 \u0434\u043E \u0446\u0456\u043B\u0456", value: (0, money_ts_1.fmt)(free), valueTone: "muted" }) : null)) : (0, dom_ts_1.h)(ui_tsx_1.Empty, { icon: "target", title: "\u0426\u0456\u043B\u0435\u0439 \u043F\u043E\u043A\u0438 \u043D\u0435\u043C\u0430\u0454", text: "\u0420\u0435\u0437\u0435\u0440\u0432, \u043F\u043E\u0434\u0443\u0448\u043A\u0430, \u0432\u0456\u0434\u043F\u0443\u0441\u0442\u043A\u0430 \u0447\u0438 \u0432\u043B\u0430\u0441\u043D\u0430 \u043C\u0435\u0442\u0430 \u2014 \u0456\u0437 \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u043E\u043C \u0456 \u0434\u0430\u0442, \u043A\u043E\u043B\u0438 \u0434\u043B\u044F \u043D\u0435\u0457 \u0454 \u043F\u0456\u0434\u0441\u0442\u0430\u0432\u0438." }),
        (0, dom_ts_1.h)(ui_tsx_1.Group, { title: "\u041D\u043E\u0432\u0430 \u0446\u0456\u043B\u044C" },
            (0, dom_ts_1.h)("div", { class: "chips chips-wrap" }, defaults_ts_1.GOAL_PRESETS.map((p) => (0, dom_ts_1.h)(ui_tsx_1.Chip, { icon: p.icon, onClick: () => openGoalEditor(null, p) },
                p.name,
                p.target ? ` · ${(0, money_ts_1.fmt)(p.target, { decimals: 'never' })}` : '')))),
        transfers.length ? ((0, dom_ts_1.h)(ui_tsx_1.Group, { title: "\u041E\u0441\u0442\u0430\u043D\u043D\u0456 \u043F\u0435\u0440\u0435\u043A\u0430\u0437\u0438" }, transfers.map((o) => (0, dom_ts_1.h)(forms_tsx_1.OpRow, { op: o, showDate: true })))) : null));
}
function GoalRow(p) {
    const { v } = p;
    return ((0, dom_ts_1.h)("button", { type: "button", class: "goal", onClick: () => openGoalSheet(v.goal.id) },
        (0, dom_ts_1.h)("span", { class: "goal-top" },
            (0, dom_ts_1.h)("b", null, v.goal.name),
            (0, dom_ts_1.h)("span", { class: "num" },
                (0, money_ts_1.fmt)(v.saved),
                " / ",
                (0, money_ts_1.fmt)(v.goal.target))),
        (0, dom_ts_1.h)(ui_tsx_1.Progress, { value: v.pct / 100, tone: v.done ? 'ok' : 'accent', label: `Прогрес: ${v.pct}%` }),
        (0, dom_ts_1.h)("span", { class: "goal-sub" }, v.done ? 'Ціль досягнуто' : v.projection ? `Орієнтовно ${(0, time_ts_1.fmtDate)(v.projection.date, { year: true })} — за темпом ${(0, money_ts_1.fmt)(v.projection.perDay)} на день` : v.reason)));
}
function openGoalSheet(id) {
    (0, ui_tsx_1.openSheet)({
        title: 'Ціль',
        live: true,
        render: (close) => {
            const { data, ix, today } = (0, view_ts_1.derived)();
            const g = data.goals.find((x) => x.id === id);
            if (!g)
                return (0, dom_ts_1.h)("p", { class: "hint" }, "\u0426\u0456\u043B\u044C \u0432\u0438\u0434\u0430\u043B\u0435\u043D\u043E.");
            const v = (0, goals_ts_1.goalView)(g, ix, today);
            const pace = (0, goals_ts_1.paceTable)(v.left, today);
            return ((0, dom_ts_1.h)("div", { class: "stack" },
                (0, dom_ts_1.h)("div", { class: "goal-head" },
                    (0, dom_ts_1.h)("h3", { class: "h2" }, g.name),
                    (0, dom_ts_1.h)("span", { class: "num big" },
                        v.pct,
                        "%")),
                (0, dom_ts_1.h)(ui_tsx_1.Progress, { value: v.pct / 100, tone: v.done ? 'ok' : 'accent' }),
                (0, dom_ts_1.h)(ui_tsx_1.Group, null,
                    (0, dom_ts_1.h)(ui_tsx_1.Row, { title: "\u041D\u0430\u043A\u043E\u043F\u0438\u0447\u0435\u043D\u043E", value: (0, money_ts_1.fmt)(v.saved) }),
                    (0, dom_ts_1.h)(ui_tsx_1.Row, { title: "\u0426\u0456\u043B\u044C", value: (0, money_ts_1.fmt)(g.target) }),
                    (0, dom_ts_1.h)(ui_tsx_1.Row, { title: "\u0417\u0430\u043B\u0438\u0448\u0438\u043B\u043E\u0441\u044C", value: (0, money_ts_1.fmt)(v.left) }),
                    (0, dom_ts_1.h)(ui_tsx_1.Row, { title: "\u041F\u0440\u043E\u0433\u043D\u043E\u0437\u043E\u0432\u0430\u043D\u0430 \u0434\u0430\u0442\u0430", sub: v.projection ? `За темпом ${(0, money_ts_1.fmt)(v.projection.perDay)} на день` : v.reason ?? '', value: v.projection ? (0, time_ts_1.fmtDate)(v.projection.date, { year: true }) : '—' })),
                pace.length ? ((0, dom_ts_1.h)(ui_tsx_1.Group, { title: "\u042F\u043A \u0434\u0430\u0442\u0430 \u0437\u0430\u043B\u0435\u0436\u0438\u0442\u044C \u0432\u0456\u0434 \u0442\u0435\u043C\u043F\u0443", foot: "\u0423\u043C\u043E\u0432\u043D\u0456 \u0432\u0430\u0440\u0456\u0430\u043D\u0442\u0438, \u043D\u0435 \u043F\u0440\u043E\u0433\u043D\u043E\u0437." }, pace.map((x) => (0, dom_ts_1.h)(ui_tsx_1.Row, { title: `${(0, money_ts_1.fmt)(x.perDay)} на день`, sub: (0, money_ts_1.count)(x.days, money_ts_1.DAYS), value: (0, time_ts_1.fmtDate)(x.date, { year: true }) })))) : null,
                (0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "primary", size: "lg", full: true, icon: "coins", onClick: () => (0, ui_tsx_1.openSheet)({ title: `Відкласти на «${g.name}»`, render: (c2) => (0, dom_ts_1.h)(SaveToGoal, { goalId: g.id, close: c2 }) }) }, "\u0412\u0456\u0434\u043A\u043B\u0430\u0441\u0442\u0438 \u043D\u0430 \u0446\u044E \u0446\u0456\u043B\u044C"),
                (0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "ghost", full: true, icon: "edit", onClick: () => { close(); openGoalEditor(g, null); } }, "\u0417\u043C\u0456\u043D\u0438\u0442\u0438 \u0446\u0456\u043B\u044C")));
        },
    });
}
function SaveToGoal(p) {
    const { today } = (0, view_ts_1.derived)();
    return (0, forms_tsx_1.MoreForm)({ date: today, kind: 'saving', goalId: p.goalId, onDone: (op) => { p.close(); if (op)
            (0, forms_tsx_1.addedToast)(op); } });
}
function openGoalEditor(goal, preset) {
    const { data } = (0, view_ts_1.derived)();
    const draft = {
        name: goal?.name ?? preset?.name ?? '',
        target: (goal?.target ?? preset?.target ?? null),
        start: (goal?.start ?? 0),
    };
    (0, ui_tsx_1.openSheet)({
        title: goal ? 'Змінити ціль' : 'Нова ціль',
        render: (close) => ((0, dom_ts_1.h)("div", { class: "stack" },
            (0, dom_ts_1.h)(ui_tsx_1.Field, { label: "\u041D\u0430\u0437\u0432\u0430" },
                (0, dom_ts_1.h)(ui_tsx_1.TextInput, { value: draft.name, placeholder: "\u041D\u0430\u043F\u0440\u0438\u043A\u043B\u0430\u0434: \u0412\u0456\u0434\u043F\u0443\u0441\u0442\u043A\u0430", onChange: (v) => { draft.name = v; } })),
            (0, dom_ts_1.h)(ui_tsx_1.Field, { label: "\u0421\u0443\u043C\u0430 \u0446\u0456\u043B\u0456" },
                (0, dom_ts_1.h)(ui_tsx_1.MoneyInput, { value: draft.target, onChange: (v) => { draft.target = v; } })),
            (0, dom_ts_1.h)(ui_tsx_1.Field, { label: "\u0423\u0436\u0435 \u0454 \u043D\u0430 \u0446\u044E \u0446\u0456\u043B\u044C", hint: "\u041D\u0435\u043E\u0431\u043E\u0432\u02BC\u044F\u0437\u043A\u043E\u0432\u043E. \u041D\u0430\u043F\u0440\u0438\u043A\u043B\u0430\u0434, \u0447\u0430\u0441\u0442\u0438\u043D\u0430 \u043F\u043E\u0434\u0443\u0448\u043A\u0438, \u0432\u0456\u0434\u043A\u043B\u0430\u0434\u0435\u043D\u0430 \u0440\u0430\u043D\u0456\u0448\u0435." },
                (0, dom_ts_1.h)(ui_tsx_1.MoneyInput, { value: draft.start, onChange: (v) => { draft.start = v; } })),
            (0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "primary", size: "lg", full: true, onClick: () => {
                    if (!draft.name.trim())
                        return (0, ui_tsx_1.toast)('Вкажи назву цілі.');
                    if (!draft.target || draft.target <= 0)
                        return (0, ui_tsx_1.toast)('Вкажи суму цілі.');
                    const next = { id: goal?.id ?? (0, defaults_ts_1.uid)('goal-'), name: draft.name.trim(), kind: goal?.kind ?? preset?.kind ?? 'custom', target: draft.target, start: draft.start ?? 0, createdAt: goal?.createdAt ?? Date.now() };
                    (0, store_ts_1.saveList)('goals', goal ? data.goals.map((g) => (g.id === goal.id ? next : g)) : [...data.goals, next]);
                    close();
                    (0, ui_tsx_1.toast)(goal ? 'Ціль оновлено.' : `Ціль «${next.name}» створено.`);
                } }, "\u0417\u0431\u0435\u0440\u0435\u0433\u0442\u0438"),
            goal ? ((0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "ghost", full: true, icon: "trash", onClick: () => (0, ui_tsx_1.confirmSheet)({
                    title: 'Видалити ціль?',
                    text: 'Перекази залишаться в накопиченнях, лише без привʼязки до цієї цілі.',
                    confirm: 'Видалити ціль',
                    danger: true,
                    onConfirm: () => { (0, store_ts_1.saveList)('goals', data.goals.filter((g) => g.id !== goal.id)); close(); },
                }) }, "\u0412\u0438\u0434\u0430\u043B\u0438\u0442\u0438 \u0446\u0456\u043B\u044C")) : null)),
    });
}
function Habits() {
    const { data, today } = (0, view_ts_1.derived)();
    const list = (0, habits_ts_1.computeHabits)(data, today);
    return ((0, dom_ts_1.h)("div", { class: "stack-lg" },
        (0, dom_ts_1.h)("p", { class: "lead" }, "\u041C\u0430\u043B\u0435\u043D\u044C\u043A\u0456 \u0437\u0432\u0438\u0447\u043A\u0438, \u0437 \u044F\u043A\u0438\u0445 \u0441\u043A\u043B\u0430\u0434\u0430\u0454\u0442\u044C\u0441\u044F \u0444\u0456\u043D\u0430\u043D\u0441\u043E\u0432\u0430 \u0434\u0438\u0441\u0446\u0438\u043F\u043B\u0456\u043D\u0430. \u041B\u0456\u0447\u0438\u043B\u044C\u043D\u0438\u043A\u0438 \u043D\u0435 \u043E\u0431\u043D\u0443\u043B\u044F\u044E\u0442\u044C\u0441\u044F: \u043F\u0440\u043E\u043F\u0443\u0449\u0435\u043D\u0438\u0439 \u0434\u0435\u043D\u044C \u043D\u0456\u0447\u043E\u0433\u043E \u043D\u0435 \u0437\u0430\u0431\u0438\u0440\u0430\u0454."),
        (0, dom_ts_1.h)("div", { class: "habits" }, list.map((hb) => ((0, dom_ts_1.h)("div", { class: (0, dom_ts_1.cx)('habit', hb.done && 'done') },
            (0, dom_ts_1.h)("span", { class: "habit-icon" }, (0, icons_ts_1.icon)(hb.done ? 'trophy' : hb.icon, 22)),
            (0, dom_ts_1.h)("div", { class: "habit-main" },
                (0, dom_ts_1.h)("b", null, hb.title),
                (0, dom_ts_1.h)("span", { class: "hint" }, hb.desc),
                (0, dom_ts_1.h)(ui_tsx_1.Progress, { value: hb.have / hb.need, tone: hb.done ? 'ok' : 'accent', label: hb.title }),
                (0, dom_ts_1.h)("span", { class: "habit-count num" },
                    hb.have,
                    " / ",
                    hb.need,
                    hb.done && hb.unlockedAt ? `, ${(0, time_ts_1.fmtDate)((0, time_ts_1.dateKey)(hb.unlockedAt))}` : ''))))))));
}
};

// ── share.ts
defs["share.js"] = function (require, exports, module) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveFile = saveFile;
exports.pickFile = pickFile;
async function saveFile(name, type, content) {
    const blob = new Blob([content], { type });
    const nav = navigator;
    try {
        const file = new File([blob], name, { type });
        if (nav.share && nav.canShare?.({ files: [file] })) {
            await nav.share({ files: [file], title: name });
            return 'shared';
        }
    }
    catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError')
            return 'cancelled';
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.rel = 'noopener';
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    return 'downloaded';
}
function pickFile(accept) {
    return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = accept;
        input.style.display = 'none';
        input.addEventListener('change', () => {
            resolve(input.files?.[0] ?? null);
            input.remove();
        });
        document.body.append(input);
        input.click();
    });
}
};

// ── SettingsScreen.tsx
defs["SettingsScreen.js"] = function (require, exports, module) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APP_VERSION = void 0;
exports.SettingsScreen = SettingsScreen;
const dom_ts_1 = require("./dom.js");
const icons_ts_1 = require("./icons.js");
const ui_tsx_1 = require("./ui.js");
const plan_tsx_1 = require("./plan.js");
const store_ts_1 = require("./store.js");
const view_ts_1 = require("./view.js");
const budget_ts_1 = require("./budget.js");
const ledger_ts_1 = require("./ledger.js");
const backup_ts_1 = require("./backup.js");
const db_ts_1 = require("./db.js");
const share_ts_1 = require("./share.js");
const calendar_ts_1 = require("./calendar.js");
const defaults_ts_1 = require("./defaults.js");
const money_ts_1 = require("./money.js");
const time_ts_1 = require("./time.js");
exports.APP_VERSION = '1.0.1';
function PageHead(p) {
    return ((0, dom_ts_1.h)("header", { class: "screen-head" },
        (0, dom_ts_1.h)("button", { type: "button", class: "back", onClick: () => (0, view_ts_1.setUI)({ settingsPage: null }) },
            (0, icons_ts_1.icon)('chevronLeft', 18),
            "\u041D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F"),
        (0, dom_ts_1.h)("h1", { class: "h1" }, p.title),
        p.sub ? (0, dom_ts_1.h)("p", { class: "kicker" }, p.sub) : null));
}
function SettingsScreen() {
    const page = view_ts_1.ui.settingsPage;
    if (page === 'budget')
        return (0, dom_ts_1.h)(BudgetPage, null);
    if (page === 'plan')
        return (0, dom_ts_1.h)(PlanPage, null);
    if (page === 'categories')
        return (0, dom_ts_1.h)(CategoriesPage, null);
    if (page === 'micro')
        return (0, dom_ts_1.h)(MicroPage, null);
    if (page === 'travel')
        return (0, dom_ts_1.h)(TravelPage, null);
    if (page === 'calendar')
        return (0, dom_ts_1.h)(CalendarPage, null);
    if (page === 'backup')
        return (0, dom_ts_1.h)(BackupPage, null);
    if (page === 'about')
        return (0, dom_ts_1.h)(AboutPage, null);
    const { data, state } = (0, view_ts_1.derived)();
    const s = data.settings;
    const b = s.budget;
    const open = (id) => () => { (0, view_ts_1.setUI)({ settingsPage: id }); window.scrollTo(0, 0); };
    return ((0, dom_ts_1.h)("div", { class: "screen settings" },
        (0, dom_ts_1.h)("header", { class: "screen-head" },
            (0, dom_ts_1.h)("h1", { class: "h1" }, "\u041D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F"),
            (0, dom_ts_1.h)("p", { class: "kicker" }, "\u0423\u0441\u0456 \u0434\u0430\u043D\u0456 \u2014 \u043B\u0438\u0448\u0435 \u043D\u0430 \u0446\u044C\u043E\u043C\u0443 \u043F\u0440\u0438\u0441\u0442\u0440\u043E\u0457.")),
        (0, dom_ts_1.h)(ui_tsx_1.Group, { title: "\u041E\u0444\u043E\u0440\u043C\u043B\u0435\u043D\u043D\u044F" },
            (0, dom_ts_1.h)("div", { class: "pad" },
                (0, dom_ts_1.h)(ui_tsx_1.Seg, { value: s.theme, label: "\u0422\u0435\u043C\u0430", options: [{ value: 'system', label: 'Як у системі' }, { value: 'light', label: 'Світла' }, { value: 'dark', label: 'Темна' }], onChange: (v) => (0, store_ts_1.saveSettings)((x) => ({ ...x, theme: v })) }))),
        (0, dom_ts_1.h)(ui_tsx_1.Group, { title: "\u0413\u0440\u043E\u0448\u0456" },
            (0, dom_ts_1.h)(ui_tsx_1.Row, { icon: "wallet", title: "\u0411\u044E\u0434\u0436\u0435\u0442 \u0456 \u0434\u043E\u0445\u043E\u0434\u0438", sub: b.balance ? `Залишок на ${(0, time_ts_1.fmtDate)(b.balance.date)}: ${(0, money_ts_1.fmt)(b.balance.amount)}` : 'Не налаштовано', chevron: true, onClick: open('budget') }),
            (0, dom_ts_1.h)(ui_tsx_1.Row, { icon: "list", title: "\u0414\u0435\u043D\u043D\u0438\u0439 \u043F\u043B\u0430\u043D \u0456 \u0448\u0430\u0431\u043B\u043E\u043D\u0438", sub: `Шаблонів: ${data.templates.length}${s.autoPlan.work || s.autoPlan.off ? ', автоплан увімкнено' : ''}`, chevron: true, onClick: open('plan') }),
            (0, dom_ts_1.h)(ui_tsx_1.Row, { icon: "box", title: "\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0456\u0457", sub: `${data.categories.filter((c) => !c.hidden).length} активних`, chevron: true, onClick: open('categories') }),
            (0, dom_ts_1.h)(ui_tsx_1.Row, { icon: "coffee", title: "\u041A\u0430\u0432\u0430 \u0439 \u0434\u0440\u0456\u0431\u043D\u0456 \u0432\u0438\u0442\u0440\u0430\u0442\u0438", sub: s.joyBudget !== null ? `Бюджет радості ${(0, money_ts_1.fmt)(s.joyBudget)} на день` : 'Швидкі кнопки і бюджет радості', chevron: true, onClick: open('micro') }),
            (0, dom_ts_1.h)(ui_tsx_1.Row, { icon: "taxi", title: "\u0422\u0440\u0430\u043D\u0441\u043F\u043E\u0440\u0442 \u0456 \u0445\u0430\u0440\u0447\u0443\u0432\u0430\u043D\u043D\u044F", sub: "\u0426\u0456\u043D\u043D\u0456\u0441\u0442\u044C \u0433\u043E\u0434\u0438\u043D\u0438, \u0442\u0438\u043F\u043E\u0432\u0438\u0439 \u043F\u0440\u043E\u0457\u0437\u0434, \u043E\u0431\u0456\u0434 \u0443 \u0457\u0434\u0430\u043B\u044C\u043D\u0456", chevron: true, onClick: open('travel') })),
        (0, dom_ts_1.h)(ui_tsx_1.Group, { title: "\u0427\u0430\u0441" },
            (0, dom_ts_1.h)(ui_tsx_1.Row, { icon: "calendar", title: "\u041A\u0430\u043B\u0435\u043D\u0434\u0430\u0440", sub: `Робочих днів на тиждень: ${s.calendar.workdays.filter(Boolean).length}${s.calendar.stays.length ? `, періодів у Дніпрі: ${s.calendar.stays.length}` : ''}`, chevron: true, onClick: open('calendar') })),
        (0, dom_ts_1.h)(ui_tsx_1.Group, { title: "\u0414\u0430\u043D\u0456" },
            (0, dom_ts_1.h)(ui_tsx_1.Row, { icon: "shield", title: "\u0420\u0435\u0437\u0435\u0440\u0432\u043D\u0456 \u043A\u043E\u043F\u0456\u0457", sub: "\u0415\u043A\u0441\u043F\u043E\u0440\u0442 JSON \u0456 CSV, \u0432\u0456\u0434\u043D\u043E\u0432\u043B\u0435\u043D\u043D\u044F", chevron: true, onClick: open('backup') }),
            (0, dom_ts_1.h)("div", { class: "row" },
                (0, dom_ts_1.h)("span", { class: "row-icon" }, (0, icons_ts_1.icon)('spark', 18)),
                (0, dom_ts_1.h)("span", { class: "row-main" },
                    (0, dom_ts_1.h)("span", { class: "row-title" }, "\u0414\u0435\u043C\u043E-\u0440\u0435\u0436\u0438\u043C"),
                    (0, dom_ts_1.h)("span", { class: "row-sub" }, "\u0412\u0438\u0433\u0430\u0434\u0430\u043D\u0456 \u0434\u0430\u043D\u0456 \u0432 \u043E\u043A\u0440\u0435\u043C\u0456\u0439 \u0431\u0430\u0437\u0456 \u2014 \u043E\u0441\u043E\u0431\u0438\u0441\u0442\u0430 \u0456\u0441\u0442\u043E\u0440\u0456\u044F \u043D\u0435 \u0437\u043C\u0456\u043D\u044E\u0454\u0442\u044C\u0441\u044F")),
                (0, dom_ts_1.h)(ui_tsx_1.Toggle, { checked: state.demo, label: "\u0414\u0435\u043C\u043E-\u0440\u0435\u0436\u0438\u043C", onChange: async (v) => { await (0, store_ts_1.setDemoMode)(v); (0, view_ts_1.go)('day', { dayDate: null }); (0, ui_tsx_1.toast)(v ? 'Демо-режим: вигадані дані.' : 'Повернулися до твоїх даних.'); } })),
            (0, dom_ts_1.h)(ui_tsx_1.Row, { icon: "info", title: "\u041F\u0440\u043E \u0437\u0430\u0441\u0442\u043E\u0441\u0443\u043D\u043E\u043A \u0456 \u043A\u043E\u043D\u0444\u0456\u0434\u0435\u043D\u0446\u0456\u0439\u043D\u0456\u0441\u0442\u044C", chevron: true, onClick: open('about') })),
        (0, dom_ts_1.h)(ui_tsx_1.Group, null,
            (0, dom_ts_1.h)(ui_tsx_1.Row, { icon: "trash", title: "\u0421\u043A\u0438\u043D\u0443\u0442\u0438 \u0432\u0441\u0456 \u0434\u0430\u043D\u0456", sub: state.demo ? 'Недоступно в демо-режимі' : 'Перед скиданням буде збережено попередню копію', onClick: state.demo ? undefined : () => (0, ui_tsx_1.confirmSheet)({
                    title: 'Скинути всі дані?',
                    text: 'Операції, плани, цілі й налаштування буде очищено. Попередню копію можна буде повернути в «Резервних копіях». Радимо спершу зробити експорт.',
                    confirm: 'Скинути',
                    danger: true,
                    onConfirm: async () => { await (0, store_ts_1.resetAll)(); (0, view_ts_1.go)('day', { dayDate: null }); },
                }), class: "danger-row" })),
        (0, dom_ts_1.h)("p", { class: "hint center" },
            "\u0414\u0415\u041D\u042C \u00D7 365 \u00B7 \u0432\u0435\u0440\u0441\u0456\u044F ",
            exports.APP_VERSION)));
}
function BudgetPage() {
    const { data, today } = (0, view_ts_1.derived)();
    const d = (0, defaults_ts_1.clone)(data.settings.budget);
    const bal = { amount: d.balance?.amount ?? null, date: d.balance?.date ?? today };
    const preview = (0, dom_ts_1.live)(() => {
        const { ix, cats } = (0, view_ts_1.derived)();
        const draft = { ...data.settings, budget: { ...d, balance: bal.amount !== null ? { amount: bal.amount, date: bal.date } : null } };
        const c = (0, ledger_ts_1.calcDay)(ix, today, data.days[today], cats);
        const v = (0, budget_ts_1.budgetView)({ ix, settings: draft, days: data.days, today, todayCalc: c, todayClosed: Boolean(data.days[today]?.closed) });
        if (v.status === 'unknown')
            return (0, dom_ts_1.h)(ui_tsx_1.Note, { tone: "info" }, "\u0412\u043A\u0430\u0436\u0438 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0456 \u043A\u043E\u0448\u0442\u0438 \u2014 \u0456 \u0442\u0443\u0442 \u0437\u02BC\u044F\u0432\u0438\u0442\u044C\u0441\u044F \u0440\u043E\u0437\u0440\u0430\u0445\u0443\u043D\u043E\u043A \u0432\u0456\u043B\u044C\u043D\u0438\u0445 \u0433\u0440\u043E\u0448\u0435\u0439.");
        return ((0, dom_ts_1.h)("div", { class: "budget-preview" },
            (0, dom_ts_1.h)("div", { class: "kv" },
                (0, dom_ts_1.h)("span", null, "\u0414\u043E\u0441\u0442\u0443\u043F\u043D\u043E \u0437\u0430\u0440\u0430\u0437"),
                (0, dom_ts_1.h)("b", { class: "num" }, (0, money_ts_1.fmt)(v.available ?? 0))),
            (0, dom_ts_1.h)("div", { class: "kv" },
                (0, dom_ts_1.h)("span", null,
                    "\u041E\u0431\u043E\u0432\u02BC\u044F\u0437\u043A\u043E\u0432\u0456 \u0434\u043E ",
                    (0, time_ts_1.fmtDate)(v.horizonEnd)),
                (0, dom_ts_1.h)("b", { class: "num" },
                    "\u2212",
                    (0, money_ts_1.fmt)(v.reserveObligations))),
            (0, dom_ts_1.h)("div", { class: "kv" },
                (0, dom_ts_1.h)("span", null,
                    "\u0429\u043E\u0434\u0435\u043D\u043D\u0456 \u043F\u043E\u0442\u0440\u0435\u0431\u0438 (",
                    v.dailyDays,
                    " \u0434\u043D.)"),
                (0, dom_ts_1.h)("b", { class: "num" },
                    "\u2212",
                    (0, money_ts_1.fmt)(v.reserveDaily + v.reserveToday))),
            (0, dom_ts_1.h)("div", { class: "kv" },
                (0, dom_ts_1.h)("span", null, "\u0417\u0430\u043F\u0430\u0441 \u0431\u0435\u0437\u043F\u0435\u043A\u0438"),
                (0, dom_ts_1.h)("b", { class: "num" },
                    "\u2212",
                    (0, money_ts_1.fmt)(v.buffer))),
            (0, dom_ts_1.h)("div", { class: (0, dom_ts_1.cx)('kv strong', v.status === 'deficit' ? 'neg' : 'pos') },
                (0, dom_ts_1.h)("span", null, v.status === 'deficit' ? 'Бракує' : 'Вільні кошти'),
                (0, dom_ts_1.h)("b", { class: "num" }, (0, money_ts_1.fmt)(v.free ?? 0)))));
    });
    const incomes = (0, dom_ts_1.live)(() => ((0, dom_ts_1.h)("div", { class: "list-edit" },
        d.incomes.map((inc, i) => ((0, dom_ts_1.h)("div", { class: "list-item" },
            (0, dom_ts_1.h)(ui_tsx_1.TextInput, { value: inc.name, placeholder: "\u041D\u0430\u0437\u0432\u0430 \u0434\u043E\u0445\u043E\u0434\u0443", label: "\u041D\u0430\u0437\u0432\u0430 \u0434\u043E\u0445\u043E\u0434\u0443", onChange: (v) => { inc.name = v; } }),
            (0, dom_ts_1.h)("div", { class: "line-row" },
                (0, dom_ts_1.h)(ui_tsx_1.MoneyInput, { value: inc.amount || null, label: "\u0421\u0443\u043C\u0430 \u043D\u0430 \u043C\u0456\u0441\u044F\u0446\u044C", onChange: (v) => { inc.amount = v ?? 0; preview.refresh(); } }),
                (0, dom_ts_1.h)(ui_tsx_1.NumInput, { value: inc.day, suffix: "\u0447\u0438\u0441\u043B\u043E", label: "\u0414\u0435\u043D\u044C \u043C\u0456\u0441\u044F\u0446\u044F", onChange: (v) => { inc.day = Math.min(31, Math.max(1, v ?? 1)); preview.refresh(); } }),
                (0, dom_ts_1.h)(ui_tsx_1.IconBtn, { icon: "trash", label: "\u041F\u0440\u0438\u0431\u0440\u0430\u0442\u0438 \u0434\u043E\u0445\u0456\u0434", onClick: () => { d.incomes.splice(i, 1); incomes.refresh(); preview.refresh(); } }))))),
        (0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "tinted", icon: "plus", onClick: () => { d.incomes.push({ id: (0, defaults_ts_1.uid)('inc-'), name: d.incomes.length ? 'Інші надходження' : 'Місячний чистий дохід', amount: 0, day: 1 }); incomes.refresh(); } }, "\u0414\u043E\u0434\u0430\u0442\u0438 \u0434\u043E\u0445\u0456\u0434"))));
    const obligations = (0, dom_ts_1.live)(() => ((0, dom_ts_1.h)("div", { class: "list-edit" },
        d.obligations.map((o, i) => ((0, dom_ts_1.h)("div", { class: "list-item" },
            (0, dom_ts_1.h)("div", { class: "line-row" },
                (0, dom_ts_1.h)(ui_tsx_1.TextInput, { value: o.name, placeholder: "\u041D\u0430\u0437\u0432\u0430 \u043F\u043B\u0430\u0442\u0435\u0436\u0443", label: "\u041D\u0430\u0437\u0432\u0430 \u043F\u043B\u0430\u0442\u0435\u0436\u0443", onChange: (v) => { o.name = v; } }),
                (0, dom_ts_1.h)(ui_tsx_1.Select, { value: o.kind, label: "\u0412\u0438\u0434 \u043F\u043B\u0430\u0442\u0435\u0436\u0443", options: Object.keys(defaults_ts_1.OBLIGATION_KINDS).map((k) => ({ value: k, label: defaults_ts_1.OBLIGATION_KINDS[k] })), onChange: (v) => { o.kind = v; } })),
            (0, dom_ts_1.h)("div", { class: "line-row" },
                (0, dom_ts_1.h)(ui_tsx_1.MoneyInput, { value: o.amount || null, label: "\u0421\u0443\u043C\u0430", onChange: (v) => { o.amount = v ?? 0; preview.refresh(); } }),
                (0, dom_ts_1.h)(ui_tsx_1.NumInput, { value: o.day, suffix: "\u0447\u0438\u0441\u043B\u043E", label: "\u0414\u0435\u043D\u044C \u043C\u0456\u0441\u044F\u0446\u044F", onChange: (v) => { o.day = Math.min(31, Math.max(1, v ?? 1)); preview.refresh(); } }),
                (0, dom_ts_1.h)(ui_tsx_1.IconBtn, { icon: "trash", label: "\u041F\u0440\u0438\u0431\u0440\u0430\u0442\u0438 \u043F\u043B\u0430\u0442\u0456\u0436", onClick: () => { d.obligations.splice(i, 1); obligations.refresh(); preview.refresh(); } }))))),
        (0, dom_ts_1.h)("div", { class: "chips chips-wrap" }, Object.keys(defaults_ts_1.OBLIGATION_KINDS).map((k) => ((0, dom_ts_1.h)(ui_tsx_1.Chip, { icon: "plus", onClick: () => { d.obligations.push({ id: (0, defaults_ts_1.uid)('obl-'), name: defaults_ts_1.OBLIGATION_KINDS[k], kind: k, amount: 0, day: 1 }); obligations.refresh(); } }, defaults_ts_1.OBLIGATION_KINDS[k])))))));
    const suggest = (0, budget_ts_1.suggestedDaily)({ ...data.settings, budget: d }, today);
    const save = () => {
        d.incomes = d.incomes.filter((x) => x.amount > 0).map((x) => ({ ...x, name: x.name.trim() || 'Дохід' }));
        d.obligations = d.obligations.filter((x) => x.amount > 0).map((x) => ({ ...x, name: x.name.trim() || defaults_ts_1.OBLIGATION_KINDS[x.kind] }));
        d.balance = bal.amount !== null ? { amount: bal.amount, date: bal.date } : null;
        (0, store_ts_1.saveSettings)((s) => ({ ...s, budget: d }));
        (0, ui_tsx_1.toast)('Бюджет збережено.');
    };
    return ((0, dom_ts_1.h)("div", { class: "screen settings" },
        (0, dom_ts_1.h)(PageHead, { title: "\u0411\u044E\u0434\u0436\u0435\u0442 \u0456 \u0434\u043E\u0445\u043E\u0434\u0438", sub: "\u0423\u0441\u0435 \u043D\u0435\u043E\u0431\u043E\u0432\u02BC\u044F\u0437\u043A\u043E\u0432\u043E \u0439 \u0437\u043C\u0456\u043D\u044E\u0454\u0442\u044C\u0441\u044F \u0432\u0440\u0443\u0447\u043D\u0443. \u0426\u0438\u0444\u0440\u0438 \u0437\u0431\u0435\u0440\u0456\u0433\u0430\u044E\u0442\u044C\u0441\u044F \u043B\u0438\u0448\u0435 \u043D\u0430 \u043F\u0440\u0438\u0441\u0442\u0440\u043E\u0457." }),
        (0, dom_ts_1.h)(ui_tsx_1.Group, { title: "\u0414\u043E\u0441\u0442\u0443\u043F\u043D\u0456 \u043A\u043E\u0448\u0442\u0438", foot: "\u0421\u0443\u043C\u0430 \u043D\u0430 \u043F\u043E\u0447\u0430\u0442\u043E\u043A \u0443\u043A\u0430\u0437\u0430\u043D\u043E\u0433\u043E \u0434\u043D\u044F. \u041E\u043F\u0435\u0440\u0430\u0446\u0456\u0457 \u0446\u044C\u043E\u0433\u043E \u0434\u043D\u044F \u0439 \u043F\u0456\u0437\u043D\u0456\u0448\u0435 \u0437\u0430\u0441\u0442\u043E\u0441\u0443\u044E\u0442\u044C\u0441\u044F \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E. \u041C\u0430\u0439\u0431\u0443\u0442\u043D\u0456 \u0434\u043E\u0445\u043E\u0434\u0438 \u0441\u044E\u0434\u0438 \u043D\u0435 \u0432\u0445\u043E\u0434\u044F\u0442\u044C." },
            (0, dom_ts_1.h)("div", { class: "pad grid2" },
                (0, dom_ts_1.h)(ui_tsx_1.Field, { label: "\u0421\u0443\u043C\u0430" },
                    (0, dom_ts_1.h)(ui_tsx_1.MoneyInput, { value: bal.amount, onChange: (v) => { bal.amount = v; preview.refresh(); } })),
                (0, dom_ts_1.h)(ui_tsx_1.Field, { label: "\u041D\u0430 \u043F\u043E\u0447\u0430\u0442\u043E\u043A \u0434\u043D\u044F" },
                    (0, dom_ts_1.h)(ui_tsx_1.DateInput, { value: bal.date, max: today, onChange: (v) => { bal.date = v; preview.refresh(); } })))),
        (0, dom_ts_1.h)(ui_tsx_1.Group, { title: "\u0414\u043E\u0445\u043E\u0434\u0438", foot: "\u0414\u0430\u0442\u0430 \u043E\u0442\u0440\u0438\u043C\u0430\u043D\u043D\u044F \u043F\u043E\u0442\u0440\u0456\u0431\u043D\u0430, \u0449\u043E\u0431 \u0440\u0435\u0437\u0435\u0440\u0432\u0443\u0432\u0430\u0442\u0438 \u043F\u043B\u0430\u0442\u0435\u0436\u0456 \u0439 \u0449\u043E\u0434\u0435\u043D\u043D\u0456 \u0432\u0438\u0442\u0440\u0430\u0442\u0438 \u0441\u0430\u043C\u0435 \u0434\u043E \u043D\u0430\u0441\u0442\u0443\u043F\u043D\u043E\u0433\u043E \u0434\u043E\u0445\u043E\u0434\u0443." },
            (0, dom_ts_1.h)("div", { class: "pad" }, incomes.el)),
        (0, dom_ts_1.h)(ui_tsx_1.Group, { title: "\u041E\u0431\u043E\u0432\u02BC\u044F\u0437\u043A\u043E\u0432\u0456 \u043F\u043B\u0430\u0442\u0435\u0436\u0456", foot: "\u041E\u0440\u0435\u043D\u0434\u0430, \u043A\u043E\u043C\u0443\u043D\u0430\u043B\u044C\u043D\u0456, \u043A\u0440\u0435\u0434\u0438\u0442\u0438 \u0439 \u0440\u043E\u0437\u0441\u0442\u0440\u043E\u0447\u043A\u0438. \u0412\u043E\u043D\u0438 \u043D\u0435 \u0432\u0445\u043E\u0434\u044F\u0442\u044C \u0443 \u0434\u0435\u043D\u043D\u0438\u0439 \u0431\u044E\u0434\u0436\u0435\u0442." },
            (0, dom_ts_1.h)("div", { class: "pad" }, obligations.el)),
        (0, dom_ts_1.h)(ui_tsx_1.Group, { title: "\u0420\u0435\u0437\u0435\u0440\u0432\u0438 \u0439 \u0446\u0456\u043B\u0456" },
            (0, dom_ts_1.h)("div", { class: "pad stack-sm" },
                (0, dom_ts_1.h)(ui_tsx_1.Field, { label: "\u0424\u0456\u043D\u0430\u043D\u0441\u043E\u0432\u0430 \u043F\u043E\u0434\u0443\u0448\u043A\u0430 \u2014 \u0443\u0436\u0435 \u043D\u0430\u043A\u043E\u043F\u0438\u0447\u0435\u043D\u043E", hint: "\u0421\u0442\u0430\u0440\u0442\u043E\u0432\u0430 \u0441\u0443\u043C\u0430 \u043D\u0430\u043A\u043E\u043F\u0438\u0447\u0435\u043D\u044C." },
                    (0, dom_ts_1.h)(ui_tsx_1.MoneyInput, { value: d.savingsStart || null, onChange: (v) => { d.savingsStart = v ?? 0; } })),
                (0, dom_ts_1.h)(ui_tsx_1.Field, { label: "\u041C\u0456\u043D\u0456\u043C\u0430\u043B\u044C\u043D\u0438\u0439 \u0437\u0430\u043B\u0438\u0448\u043E\u043A \u0431\u0435\u0437\u043F\u0435\u043A\u0438", hint: "\u0426\u044F \u0441\u0443\u043C\u0430 \u043D\u0456\u043A\u043E\u043B\u0438 \u043D\u0435 \u043F\u0440\u043E\u043F\u043E\u043D\u0443\u0454\u0442\u044C\u0441\u044F \u0434\u043E \u0432\u0456\u0434\u043A\u043B\u0430\u0434\u0430\u043D\u043D\u044F." },
                    (0, dom_ts_1.h)(ui_tsx_1.MoneyInput, { value: d.buffer || null, onChange: (v) => { d.buffer = v ?? 0; preview.refresh(); } })),
                (0, dom_ts_1.h)(ui_tsx_1.Field, { label: "\u041C\u0456\u0441\u044F\u0447\u043D\u0430 \u0446\u0456\u043B\u044C \u0437\u0430\u043E\u0449\u0430\u0434\u0436\u0435\u043D\u044C" },
                    (0, dom_ts_1.h)(ui_tsx_1.MoneyInput, { value: d.monthlyGoal, onChange: (v) => { d.monthlyGoal = v; } })),
                (0, dom_ts_1.h)(ui_tsx_1.Field, { label: "\u041E\u0440\u0456\u0454\u043D\u0442\u043E\u0432\u043D\u0456 \u0449\u043E\u0434\u0435\u043D\u043D\u0456 \u0432\u0438\u0442\u0440\u0430\u0442\u0438", hint: suggest !== null ? `Підказка з доходів і платежів: ≈ ${(0, money_ts_1.fmt)(suggest, { decimals: 'never' })} на день. Якщо не вказати — береться медіана твоїх днів.` : 'Якщо не вказати — береться медіана твоїх останніх днів або план.' },
                    (0, dom_ts_1.h)(ui_tsx_1.MoneyInput, { value: d.dailyEstimate, onChange: (v) => { d.dailyEstimate = v; preview.refresh(); } })),
                (0, dom_ts_1.h)("div", { class: "grid2" },
                    (0, dom_ts_1.h)(ui_tsx_1.Field, { label: "\u0422\u0440\u0430\u043D\u0441\u043F\u043E\u0440\u0442 \u043D\u0430 \u043C\u0456\u0441\u044F\u0446\u044C" },
                        (0, dom_ts_1.h)(ui_tsx_1.MoneyInput, { value: d.flexTransport, onChange: (v) => { d.flexTransport = v; } })),
                    (0, dom_ts_1.h)(ui_tsx_1.Field, { label: "\u041F\u0440\u043E\u0434\u0443\u043A\u0442\u0438 \u043D\u0430 \u043C\u0456\u0441\u044F\u0446\u044C" },
                        (0, dom_ts_1.h)(ui_tsx_1.MoneyInput, { value: d.flexGroceries, onChange: (v) => { d.flexGroceries = v; } }))))),
        (0, dom_ts_1.h)(ui_tsx_1.Group, { title: "\u0429\u043E \u0432\u0438\u0445\u043E\u0434\u0438\u0442\u044C" },
            (0, dom_ts_1.h)("div", { class: "pad" }, preview.el)),
        (0, dom_ts_1.h)("div", { class: "sticky-save" },
            (0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "primary", size: "lg", full: true, onClick: save }, "\u0417\u0431\u0435\u0440\u0435\u0433\u0442\u0438 \u0431\u044E\u0434\u0436\u0435\u0442"))));
}
function PlanPage() {
    const { data } = (0, view_ts_1.derived)();
    const s = data.settings;
    const opts = [{ value: '', label: 'Не застосовувати' }, ...data.templates.map((t) => ({ value: t.id, label: `${t.name} · ${(0, money_ts_1.fmt)((0, ledger_ts_1.planTotal)(t.lines))}` }))];
    return ((0, dom_ts_1.h)("div", { class: "screen settings" },
        (0, dom_ts_1.h)(PageHead, { title: "\u0414\u0435\u043D\u043D\u0438\u0439 \u043F\u043B\u0430\u043D \u0456 \u0448\u0430\u0431\u043B\u043E\u043D\u0438" }),
        (0, dom_ts_1.h)(ui_tsx_1.Group, { title: "\u0410\u0432\u0442\u043E\u043F\u043B\u0430\u043D", foot: "\u042F\u043A\u0449\u043E \u0434\u043B\u044F \u043D\u043E\u0432\u043E\u0433\u043E \u0434\u043D\u044F \u0449\u0435 \u043D\u0435\u043C\u0430\u0454 \u043F\u043B\u0430\u043D\u0443, \u0437\u0430\u0441\u0442\u043E\u0441\u0443\u043D\u043E\u043A \u0441\u0430\u043C \u043F\u0456\u0434\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u0448\u0430\u0431\u043B\u043E\u043D. \u041C\u043E\u0436\u043D\u0430 \u0431\u0443\u0434\u044C-\u043A\u043E\u043B\u0438 \u0437\u043C\u0456\u043D\u0438\u0442\u0438." },
            (0, dom_ts_1.h)("div", { class: "pad stack-sm" },
                (0, dom_ts_1.h)(ui_tsx_1.Field, { label: "\u0420\u043E\u0431\u043E\u0447\u0456 \u0434\u043D\u0456" },
                    (0, dom_ts_1.h)(ui_tsx_1.Select, { value: s.autoPlan.work ?? '', label: "\u0428\u0430\u0431\u043B\u043E\u043D \u0434\u043B\u044F \u0440\u043E\u0431\u043E\u0447\u0438\u0445 \u0434\u043D\u0456\u0432", options: opts, onChange: (v) => (0, store_ts_1.saveSettings)((x) => ({ ...x, autoPlan: { ...x.autoPlan, work: v || null } })) })),
                (0, dom_ts_1.h)(ui_tsx_1.Field, { label: "\u0412\u0438\u0445\u0456\u0434\u043D\u0456" },
                    (0, dom_ts_1.h)(ui_tsx_1.Select, { value: s.autoPlan.off ?? '', label: "\u0428\u0430\u0431\u043B\u043E\u043D \u0434\u043B\u044F \u0432\u0438\u0445\u0456\u0434\u043D\u0438\u0445", options: opts, onChange: (v) => (0, store_ts_1.saveSettings)((x) => ({ ...x, autoPlan: { ...x.autoPlan, off: v || null } })) })))),
        (0, dom_ts_1.h)(ui_tsx_1.Group, { title: "\u0428\u0430\u0431\u043B\u043E\u043D\u0438", foot: "\u0421\u0443\u043C\u0438 \u0432 \u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u043D\u0438\u0445 \u0448\u0430\u0431\u043B\u043E\u043D\u0430\u0445 \u2014 \u043F\u0440\u0438\u043A\u043B\u0430\u0434, \u0430 \u043D\u0435 \u0430\u043A\u0442\u0443\u0430\u043B\u044C\u043D\u0456 \u0446\u0456\u043D\u0438 \u0432 \u0414\u043D\u0456\u043F\u0440\u0456." },
            data.templates.map((t) => (0, dom_ts_1.h)(ui_tsx_1.Row, { icon: "list", title: t.name, sub: t.lines.map((l) => l.label).join(', ') || 'порожній', value: (0, money_ts_1.fmt)((0, ledger_ts_1.planTotal)(t.lines)), chevron: true, onClick: () => (0, plan_tsx_1.openTemplateEditor)(t) })),
            (0, dom_ts_1.h)("div", { class: "group-actions" },
                (0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "tinted", icon: "plus", onClick: () => (0, plan_tsx_1.openTemplateEditor)(null) }, "\u041D\u043E\u0432\u0438\u0439 \u0448\u0430\u0431\u043B\u043E\u043D")))));
}
function CategoriesPage() {
    const { data, ix } = (0, view_ts_1.derived)();
    return ((0, dom_ts_1.h)("div", { class: "screen settings" },
        (0, dom_ts_1.h)(PageHead, { title: "\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0456\u0457", sub: "\u041D\u0430\u0437\u0432\u0438, \u043A\u043E\u043B\u044C\u043E\u0440\u0438, \u0437\u043D\u0430\u0447\u043A\u0438 \u0439 \u0442\u0438\u043F \u0432\u0438\u0442\u0440\u0430\u0442 \u0437\u0430 \u0437\u0430\u043C\u043E\u0432\u0447\u0443\u0432\u0430\u043D\u043D\u044F\u043C." }),
        (0, dom_ts_1.h)(ui_tsx_1.Group, null,
            data.categories.map((c) => ((0, dom_ts_1.h)(ui_tsx_1.Row, { icon: c.icon, color: c.color, title: c.name, sub: `${defaults_ts_1.NECESSITY[c.necessity].label}${c.hidden ? ', прихована' : ''}`, chevron: true, onClick: () => openCategoryEditor(c, ix.all.some((o) => o.category === c.id)) }))),
            (0, dom_ts_1.h)("div", { class: "group-actions" },
                (0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "tinted", icon: "plus", onClick: () => openCategoryEditor(null, false) }, "\u041D\u043E\u0432\u0430 \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0456\u044F")))));
}
function openCategoryEditor(cat, used) {
    const draft = cat ? (0, defaults_ts_1.clone)(cat) : { id: (0, defaults_ts_1.uid)('cat-'), name: '', icon: 'box', color: defaults_ts_1.CATEGORY_COLORS[7], necessity: 'flexible', micro: false };
    (0, ui_tsx_1.openSheet)({
        title: cat ? 'Категорія' : 'Нова категорія',
        tall: true,
        render: (close) => {
            const picks = (0, dom_ts_1.live)(() => ((0, dom_ts_1.h)("div", { class: "stack-sm" },
                (0, dom_ts_1.h)("p", { class: "field-label" }, "\u0417\u043D\u0430\u0447\u043E\u043A"),
                (0, dom_ts_1.h)("div", { class: "icon-grid" }, defaults_ts_1.CATEGORY_ICONS.map((i) => (0, dom_ts_1.h)("button", { type: "button", class: (0, dom_ts_1.cx)('icon-pick', draft.icon === i && 'on'), style: `--c:${draft.color}`, "aria-label": i, onClick: () => { draft.icon = i; picks.refresh(); } }, (0, icons_ts_1.icon)(i, 20)))),
                (0, dom_ts_1.h)("p", { class: "field-label" }, "\u041A\u043E\u043B\u0456\u0440"),
                (0, dom_ts_1.h)("div", { class: "color-grid" }, defaults_ts_1.CATEGORY_COLORS.map((c) => (0, dom_ts_1.h)("button", { type: "button", class: (0, dom_ts_1.cx)('color-pick', draft.color === c && 'on'), style: `--c:${c}`, "aria-label": `Колір ${c}`, onClick: () => { draft.color = c; picks.refresh(); } }))))));
            return ((0, dom_ts_1.h)("div", { class: "stack" },
                (0, dom_ts_1.h)(ui_tsx_1.Field, { label: "\u041D\u0430\u0437\u0432\u0430" },
                    (0, dom_ts_1.h)(ui_tsx_1.TextInput, { value: draft.name, max: 40, placeholder: "\u041D\u0430\u043F\u0440\u0438\u043A\u043B\u0430\u0434: \u0417\u0434\u043E\u0440\u043E\u0432\u02BC\u044F", onChange: (v) => { draft.name = v; } })),
                picks.el,
                (0, dom_ts_1.h)(ui_tsx_1.Field, { label: "\u0422\u0438\u043F \u0432\u0438\u0442\u0440\u0430\u0442 \u0437\u0430 \u0437\u0430\u043C\u043E\u0432\u0447\u0443\u0432\u0430\u043D\u043D\u044F\u043C" },
                    (0, dom_ts_1.h)(ui_tsx_1.Select, { value: draft.necessity, label: "\u0422\u0438\u043F \u0432\u0438\u0442\u0440\u0430\u0442", options: defaults_ts_1.NECESSITY_ORDER.map((n) => ({ value: n, label: defaults_ts_1.NECESSITY[n].label })), onChange: (v) => { draft.necessity = v; } })),
                (0, dom_ts_1.h)("div", { class: "toggle-row" },
                    (0, dom_ts_1.h)("span", null,
                        "\u0414\u0440\u0456\u0431\u043D\u0456 \u043F\u0440\u0438\u0454\u043C\u043D\u043E\u0441\u0442\u0456",
                        (0, dom_ts_1.h)("small", null, "\u0412\u0440\u0430\u0445\u043E\u0432\u0443\u0454\u0442\u044C\u0441\u044F \u0432 \u00AB\u041C\u0430\u043B\u0435\u043D\u044C\u043A\u0438\u0445 \u0433\u0440\u043E\u0448\u0430\u0445\u00BB \u0456 \u0431\u044E\u0434\u0436\u0435\u0442\u0456 \u0440\u0430\u0434\u043E\u0441\u0442\u0456.")),
                    (0, dom_ts_1.h)(ui_tsx_1.Toggle, { checked: draft.micro, label: "\u0414\u0440\u0456\u0431\u043D\u0456 \u043F\u0440\u0438\u0454\u043C\u043D\u043E\u0441\u0442\u0456", onChange: (v) => { draft.micro = v; } })),
                (0, dom_ts_1.h)("div", { class: "toggle-row" },
                    (0, dom_ts_1.h)("span", null,
                        "\u0421\u0445\u043E\u0432\u0430\u0442\u0438 \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0456\u044E",
                        (0, dom_ts_1.h)("small", null, "\u0421\u0442\u0430\u0440\u0456 \u0437\u0430\u043F\u0438\u0441\u0438 \u0437\u0430\u043B\u0438\u0448\u0430\u0442\u044C\u0441\u044F \u0432 \u0456\u0441\u0442\u043E\u0440\u0456\u0457.")),
                    (0, dom_ts_1.h)(ui_tsx_1.Toggle, { checked: Boolean(draft.hidden), label: "\u0421\u0445\u043E\u0432\u0430\u0442\u0438", onChange: (v) => { draft.hidden = v; } })),
                (0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "primary", size: "lg", full: true, onClick: () => {
                        if (!draft.name.trim())
                            return (0, ui_tsx_1.toast)('Вкажи назву.');
                        draft.name = draft.name.trim();
                        const list = (0, view_ts_1.derived)().data.categories;
                        (0, store_ts_1.saveList)('categories', list.some((x) => x.id === draft.id) ? list.map((x) => (x.id === draft.id ? draft : x)) : [...list, draft]);
                        close();
                    } }, "\u0417\u0431\u0435\u0440\u0435\u0433\u0442\u0438"),
                cat && !cat.builtin ? ((0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "ghost", full: true, icon: "trash", disabled: used, onClick: () => (0, ui_tsx_1.confirmSheet)({
                        title: 'Видалити категорію?', text: 'Категорія зникне зі списку.', confirm: 'Видалити', danger: true,
                        onConfirm: () => { (0, store_ts_1.saveList)('categories', (0, view_ts_1.derived)().data.categories.filter((x) => x.id !== cat.id)); close(); },
                    }) }, used ? 'Є записи — категорію можна лише сховати' : 'Видалити категорію')) : null));
        },
    });
}
function MicroPage() {
    const { data } = (0, view_ts_1.derived)();
    const items = (0, defaults_ts_1.clone)(data.micro);
    let joy = data.settings.joyBudget;
    const list = (0, dom_ts_1.live)(() => ((0, dom_ts_1.h)("div", { class: "list-edit" },
        items.map((m, i) => ((0, dom_ts_1.h)("div", { class: "micro-item" },
            (0, dom_ts_1.h)("span", { class: "row-icon", style: `--c:${data.categories.find((c) => c.id === m.category)?.color ?? '#888'}` }, (0, icons_ts_1.icon)(m.icon, 18)),
            (0, dom_ts_1.h)(ui_tsx_1.TextInput, { value: m.name, label: "\u041D\u0430\u0437\u0432\u0430", onChange: (v) => { m.name = v; } }),
            (0, dom_ts_1.h)(ui_tsx_1.MoneyInput, { value: m.price, label: `Типова ціна: ${m.name}`, placeholder: "\u0446\u0456\u043D\u0430", onChange: (v) => { m.price = v; } }),
            (0, dom_ts_1.h)("button", { type: "button", class: (0, dom_ts_1.cx)('star-toggle', m.quick && 'on'), "aria-pressed": m.quick ? 'true' : 'false', "aria-label": m.quick ? 'Прибрати зі швидких кнопок' : 'Додати до швидких кнопок', onClick: () => { m.quick = !m.quick; list.refresh(); } }, (0, icons_ts_1.icon)('star', 18)),
            !['q-coffee', 'q-treat', 'q-water'].includes(m.id) && m.id.startsWith('m-') ? (0, dom_ts_1.h)(ui_tsx_1.IconBtn, { icon: "trash", label: "\u041F\u0440\u0438\u0431\u0440\u0430\u0442\u0438", onClick: () => { items.splice(i, 1); list.refresh(); } }) : null))),
        (0, dom_ts_1.h)("div", { class: "chips chips-wrap" },
            (0, dom_ts_1.h)(ui_tsx_1.Chip, { icon: "plus", onClick: () => { items.push({ id: (0, defaults_ts_1.uid)('m-'), name: 'Нова позиція', category: 'treats', icon: 'candy', price: null, quick: true }); list.refresh(); } }, "\u0421\u043C\u0430\u043A\u043E\u043B\u0438\u043A"),
            (0, dom_ts_1.h)(ui_tsx_1.Chip, { icon: "plus", onClick: () => { items.push({ id: (0, defaults_ts_1.uid)('m-'), name: 'Новий напій', category: 'coffee', icon: 'cup', price: null, quick: true }); list.refresh(); } }, "\u041D\u0430\u043F\u0456\u0439")))));
    return ((0, dom_ts_1.h)("div", { class: "screen settings" },
        (0, dom_ts_1.h)(PageHead, { title: "\u041A\u0430\u0432\u0430 \u0439 \u0434\u0440\u0456\u0431\u043D\u0456 \u0432\u0438\u0442\u0440\u0430\u0442\u0438", sub: "\u0417\u0456\u0440\u043E\u0447\u043A\u0430 \u2014 \u043F\u043E\u043A\u0430\u0437\u0443\u0432\u0430\u0442\u0438 \u044F\u043A \u0448\u0432\u0438\u0434\u043A\u0443 \u043A\u043D\u043E\u043F\u043A\u0443 \u043D\u0430 \u0433\u043E\u043B\u043E\u0432\u043D\u043E\u043C\u0443 \u0435\u043A\u0440\u0430\u043D\u0456. \u0426\u0456\u043D\u0438 \u2014 \u0442\u0432\u043E\u0457, \u0430 \u043D\u0435 \u0434\u043E\u0432\u0456\u0434\u043A\u043E\u0432\u0456." }),
        (0, dom_ts_1.h)(ui_tsx_1.Group, { title: "\u0411\u044E\u0434\u0436\u0435\u0442 \u0440\u0430\u0434\u043E\u0441\u0442\u0456", foot: "\u0421\u0443\u043C\u0430 \u043D\u0430 \u043C\u0430\u043B\u0435\u043D\u044C\u043A\u0456 \u043F\u0440\u0438\u0454\u043C\u043D\u043E\u0441\u0442\u0456 \u0449\u043E\u0434\u043D\u044F. \u0423 \u0457\u0457 \u043C\u0435\u0436\u0430\u0445 \u0437\u0430\u0441\u0442\u043E\u0441\u0443\u043D\u043E\u043A \u043D\u0435 \u0440\u043E\u0431\u0438\u0442\u044C \u0437\u0430\u0443\u0432\u0430\u0436\u0435\u043D\u044C." },
            (0, dom_ts_1.h)("div", { class: "pad" },
                (0, dom_ts_1.h)(ui_tsx_1.MoneyInput, { value: joy, onChange: (v) => { joy = v; } }))),
        (0, dom_ts_1.h)(ui_tsx_1.Group, { title: "\u041F\u043E\u0437\u0438\u0446\u0456\u0457" },
            (0, dom_ts_1.h)("div", { class: "pad" }, list.el)),
        (0, dom_ts_1.h)("div", { class: "sticky-save" },
            (0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "primary", size: "lg", full: true, onClick: () => {
                    (0, store_ts_1.saveList)('micro', items.map((m) => ({ ...m, name: m.name.trim() || 'Без назви' })));
                    (0, store_ts_1.saveSettings)((s) => ({ ...s, joyBudget: joy }));
                    (0, ui_tsx_1.toast)('Збережено.');
                } }, "\u0417\u0431\u0435\u0440\u0435\u0433\u0442\u0438"))));
}
function TravelPage() {
    const { data } = (0, view_ts_1.derived)();
    const d = { hourValue: data.settings.hourValue, publicFare: data.settings.publicFare, canteenPrice: data.settings.canteenPrice };
    return ((0, dom_ts_1.h)("div", { class: "screen settings" },
        (0, dom_ts_1.h)(PageHead, { title: "\u0422\u0440\u0430\u043D\u0441\u043F\u043E\u0440\u0442 \u0456 \u0445\u0430\u0440\u0447\u0443\u0432\u0430\u043D\u043D\u044F", sub: "\u0417\u0430\u0441\u0442\u043E\u0441\u0443\u043D\u043E\u043A \u043D\u0435 \u0432\u0438\u0433\u0430\u0434\u0443\u0454 \u0442\u0430\u0440\u0438\u0444\u0456\u0432 \u2014 \u043B\u0438\u0448\u0435 \u0442\u0432\u043E\u0457 \u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F \u0439 \u0456\u0441\u0442\u043E\u0440\u0456\u044F." }),
        (0, dom_ts_1.h)(ui_tsx_1.Group, { foot: "\u0421\u043A\u0456\u043B\u044C\u043A\u0438 \u0434\u043B\u044F \u0442\u0435\u0431\u0435 \u0443\u043C\u043E\u0432\u043D\u043E \u043A\u043E\u0448\u0442\u0443\u0454 \u0433\u043E\u0434\u0438\u043D\u0430 \u0447\u0430\u0441\u0443. \u041F\u043E\u0442\u0440\u0456\u0431\u043D\u043E \u0434\u043B\u044F \u00AB\u0426\u0456\u043D\u0438 \u043A\u043E\u043C\u0444\u043E\u0440\u0442\u0443\u00BB: \u043A\u043E\u043B\u0438 \u0434\u043E\u043F\u043B\u0430\u0442\u0430 \u0437\u0430 \u0442\u0430\u043A\u0441\u0456 \u0441\u043F\u0440\u0430\u0432\u0434\u0456 \u043A\u0443\u043F\u0443\u0454 \u0447\u0430\u0441." },
            (0, dom_ts_1.h)("div", { class: "pad" },
                (0, dom_ts_1.h)(ui_tsx_1.Field, { label: "\u0426\u0456\u043D\u043D\u0456\u0441\u0442\u044C \u0433\u043E\u0434\u0438\u043D\u0438 \u0447\u0430\u0441\u0443" },
                    (0, dom_ts_1.h)(ui_tsx_1.MoneyInput, { value: d.hourValue, onChange: (v) => { d.hourValue = v; } })))),
        (0, dom_ts_1.h)(ui_tsx_1.Group, { foot: "\u042F\u043A\u0449\u043E \u043D\u0435 \u0432\u043A\u0430\u0437\u0430\u0442\u0438, \u0431\u0435\u0440\u0435\u0442\u044C\u0441\u044F \u043C\u0435\u0434\u0456\u0430\u043D\u0430 \u0442\u0432\u043E\u0457\u0445 \u043F\u043E\u0457\u0437\u0434\u043E\u043A \u0433\u0440\u043E\u043C\u0430\u0434\u0441\u044C\u043A\u0438\u043C \u0442\u0440\u0430\u043D\u0441\u043F\u043E\u0440\u0442\u043E\u043C." },
            (0, dom_ts_1.h)("div", { class: "pad" },
                (0, dom_ts_1.h)(ui_tsx_1.Field, { label: "\u0422\u0438\u043F\u043E\u0432\u0430 \u043F\u043E\u0457\u0437\u0434\u043A\u0430 \u0433\u0440\u043E\u043C\u0430\u0434\u0441\u044C\u043A\u0438\u043C \u0442\u0440\u0430\u043D\u0441\u043F\u043E\u0440\u0442\u043E\u043C" },
                    (0, dom_ts_1.h)(ui_tsx_1.MoneyInput, { value: d.publicFare, onChange: (v) => { d.publicFare = v; } })))),
        (0, dom_ts_1.h)(ui_tsx_1.Group, { foot: "\u0414\u043B\u044F \u043F\u043E\u0440\u0456\u0432\u043D\u044F\u043D\u043D\u044F \u00AB\u0414\u043E\u043C\u0430\u0448\u043D\u0456\u0439 \u043E\u0431\u0456\u0434 \u0447\u0438 \u0457\u0434\u0430\u043B\u044C\u043D\u044F?\u00BB. \u042F\u043A\u0449\u043E \u043D\u0435 \u0432\u043A\u0430\u0437\u0430\u0442\u0438 \u2014 \u043C\u0435\u0434\u0456\u0430\u043D\u0430 \u0442\u0432\u043E\u0457\u0445 \u043E\u0431\u0456\u0434\u0456\u0432 \u0443 \u0457\u0434\u0430\u043B\u044C\u043D\u0456." },
            (0, dom_ts_1.h)("div", { class: "pad" },
                (0, dom_ts_1.h)(ui_tsx_1.Field, { label: "\u041E\u0431\u0456\u0434 \u0443 \u0457\u0434\u0430\u043B\u044C\u043D\u0456" },
                    (0, dom_ts_1.h)(ui_tsx_1.MoneyInput, { value: d.canteenPrice, onChange: (v) => { d.canteenPrice = v; } })))),
        (0, dom_ts_1.h)("div", { class: "sticky-save" },
            (0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "primary", size: "lg", full: true, onClick: () => { (0, store_ts_1.saveSettings)((s) => ({ ...s, ...d })); (0, ui_tsx_1.toast)('Збережено.'); } }, "\u0417\u0431\u0435\u0440\u0435\u0433\u0442\u0438"))));
}
function CalendarPage() {
    const { data, today } = (0, view_ts_1.derived)();
    const cal = data.settings.calendar;
    const save = (fn) => (0, store_ts_1.saveSettings)((s) => ({ ...s, calendar: fn((0, defaults_ts_1.clone)(s.calendar)) }));
    const stay = { from: today, days: 14, label: 'Навчання у Дніпрі' };
    const ov = { date: (0, time_ts_1.addDays)(today, 1), kind: 'off' };
    const overrides = Object.entries(cal.overrides).sort((a, b) => (a[0] < b[0] ? -1 : 1));
    return ((0, dom_ts_1.h)("div", { class: "screen settings" },
        (0, dom_ts_1.h)(PageHead, { title: "\u041A\u0430\u043B\u0435\u043D\u0434\u0430\u0440", sub: "\u041F\u0440\u043E\u0433\u043D\u043E\u0437\u0438 \u0440\u0430\u0445\u0443\u044E\u0442\u044C \u0440\u043E\u0431\u043E\u0447\u0456 \u0439 \u0432\u0438\u0445\u0456\u0434\u043D\u0456 \u0434\u043D\u0456 \u043E\u043A\u0440\u0435\u043C\u043E \u2014 \u0437\u0430 \u0446\u0438\u043C \u043A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u0435\u043C." }),
        (0, dom_ts_1.h)(ui_tsx_1.Group, { title: "\u0420\u043E\u0431\u043E\u0447\u0456 \u0434\u043D\u0456 \u0442\u0438\u0436\u043D\u044F" },
            (0, dom_ts_1.h)("div", { class: "pad chips" }, time_ts_1.WEEKDAYS_SHORT.map((w, i) => (0, dom_ts_1.h)(ui_tsx_1.Chip, { on: cal.workdays[i], onClick: () => save((c) => { c.workdays[i] = !c.workdays[i]; return c; }) }, w)))),
        (0, dom_ts_1.h)(ui_tsx_1.Group, { title: "\u041F\u0435\u0440\u0435\u0431\u0443\u0432\u0430\u043D\u043D\u044F \u0432 \u0414\u043D\u0456\u043F\u0440\u0456", foot: "\u041C\u043E\u0436\u043D\u0430 \u0440\u0430\u0445\u0443\u0432\u0430\u0442\u0438 \u043F\u0440\u043E\u0433\u043D\u043E\u0437 \u043B\u0438\u0448\u0435 \u0434\u043B\u044F \u0446\u0438\u0445 \u0434\u043D\u0456\u0432." },
            cal.stays.map((s) => (0, dom_ts_1.h)(ui_tsx_1.Row, { icon: "map", title: s.label || 'Перебування', sub: `${(0, time_ts_1.fmtDate)(s.from)} — ${(0, time_ts_1.fmtDate)(s.to, { year: true })}`, right: (0, dom_ts_1.h)(ui_tsx_1.IconBtn, { icon: "trash", label: "\u041F\u0440\u0438\u0431\u0440\u0430\u0442\u0438 \u043F\u0435\u0440\u0456\u043E\u0434", onClick: () => save((c) => ({ ...c, stays: c.stays.filter((x) => x.id !== s.id) })) }) })),
            (0, dom_ts_1.h)("div", { class: "pad stack-sm" },
                (0, dom_ts_1.h)("div", { class: "grid2" },
                    (0, dom_ts_1.h)(ui_tsx_1.Field, { label: "\u0412\u0456\u0434" },
                        (0, dom_ts_1.h)(ui_tsx_1.DateInput, { value: stay.from, onChange: (v) => { stay.from = v; } })),
                    (0, dom_ts_1.h)(ui_tsx_1.Field, { label: "\u041D\u0430\u0437\u0432\u0430" },
                        (0, dom_ts_1.h)(ui_tsx_1.TextInput, { value: stay.label, onChange: (v) => { stay.label = v; } }))),
                (0, dom_ts_1.h)("div", { class: "chips chips-wrap" },
                    [5, 7, 14, 30].map((n) => (0, dom_ts_1.h)(ui_tsx_1.Chip, { icon: "plus", onClick: () => save((c) => ({ ...c, stays: [...c.stays, (0, calendar_ts_1.makeStay)((0, defaults_ts_1.uid)('stay-'), stay.from, n, stay.label)] })) }, n === 30 ? 'Місяць' : `${n} днів`)),
                    (0, dom_ts_1.h)(ui_tsx_1.Chip, { icon: "plus", onClick: () => openCustomStay(stay.from, stay.label) }, "\u0414\u043E\u0432\u0456\u043B\u044C\u043D\u0438\u0439 \u043F\u0435\u0440\u0456\u043E\u0434")))),
        (0, dom_ts_1.h)(ui_tsx_1.Group, { title: "\u0412\u0438\u043D\u044F\u0442\u043A\u0438", foot: "\u041D\u0430\u043F\u0440\u0438\u043A\u043B\u0430\u0434, \u0440\u043E\u0431\u043E\u0447\u0430 \u0441\u0443\u0431\u043E\u0442\u0430 \u0447\u0438 \u0432\u0438\u0445\u0456\u0434\u043D\u0438\u0439 \u043F\u043E\u0441\u0435\u0440\u0435\u0434 \u0442\u0438\u0436\u043D\u044F. \u041F\u0456\u0434 \u0447\u0430\u0441 \u0432\u043E\u0454\u043D\u043D\u043E\u0433\u043E \u0441\u0442\u0430\u043D\u0443 \u0441\u0432\u044F\u0442\u043A\u043E\u0432\u0456 \u0434\u043D\u0456 \u043C\u043E\u0436\u0443\u0442\u044C \u0431\u0443\u0442\u0438 \u0440\u043E\u0431\u043E\u0447\u0438\u043C\u0438 \u2014 \u043F\u043E\u0437\u043D\u0430\u0447 \u0457\u0445 \u0441\u0430\u043C\u043E\u0441\u0442\u0456\u0439\u043D\u043E." },
            overrides.map(([d, k]) => (0, dom_ts_1.h)(ui_tsx_1.Row, { icon: "calendar", title: (0, time_ts_1.fmtDate)(d, { weekday: true, year: true }), sub: k === 'work' ? 'робочий' : 'вихідний', right: (0, dom_ts_1.h)(ui_tsx_1.IconBtn, { icon: "trash", label: "\u041F\u0440\u0438\u0431\u0440\u0430\u0442\u0438 \u0432\u0438\u043D\u044F\u0442\u043E\u043A", onClick: () => save((c) => { delete c.overrides[d]; return c; }) }) })),
            (0, dom_ts_1.h)("div", { class: "pad grid2" },
                (0, dom_ts_1.h)(ui_tsx_1.DateInput, { value: ov.date, label: "\u0414\u0430\u0442\u0430 \u0432\u0438\u043D\u044F\u0442\u043A\u0443", onChange: (v) => { ov.date = v; } }),
                (0, dom_ts_1.h)(ui_tsx_1.Select, { value: ov.kind, label: "\u0422\u0438\u043F \u0434\u043D\u044F", options: [{ value: 'off', label: 'Вихідний' }, { value: 'work', label: 'Робочий' }], onChange: (v) => { ov.kind = v; } })),
            (0, dom_ts_1.h)("div", { class: "group-actions" },
                (0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "tinted", icon: "plus", onClick: () => save((c) => ({ ...c, overrides: { ...c.overrides, [ov.date]: ov.kind } })) }, "\u0414\u043E\u0434\u0430\u0442\u0438 \u0432\u0438\u043D\u044F\u0442\u043E\u043A")))));
}
function openCustomStay(from, label) {
    const st = { from, to: (0, time_ts_1.addDays)(from, 9), label };
    (0, ui_tsx_1.openSheet)({
        title: 'Довільний період',
        render: (close) => ((0, dom_ts_1.h)("div", { class: "stack" },
            (0, dom_ts_1.h)("div", { class: "grid2" },
                (0, dom_ts_1.h)(ui_tsx_1.Field, { label: "\u0412\u0456\u0434" },
                    (0, dom_ts_1.h)(ui_tsx_1.DateInput, { value: st.from, onChange: (v) => { st.from = v; } })),
                (0, dom_ts_1.h)(ui_tsx_1.Field, { label: "\u0414\u043E" },
                    (0, dom_ts_1.h)(ui_tsx_1.DateInput, { value: st.to, onChange: (v) => { st.to = v; } }))),
            (0, dom_ts_1.h)(ui_tsx_1.Field, { label: "\u041D\u0430\u0437\u0432\u0430" },
                (0, dom_ts_1.h)(ui_tsx_1.TextInput, { value: st.label, onChange: (v) => { st.label = v; } })),
            (0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "primary", size: "lg", full: true, onClick: () => {
                    if (st.to < st.from)
                        return (0, ui_tsx_1.toast)('Кінець не може бути раніше за початок.');
                    (0, store_ts_1.saveSettings)((s) => ({ ...s, calendar: { ...s.calendar, stays: [...s.calendar.stays, { id: (0, defaults_ts_1.uid)('stay-'), from: st.from, to: st.to, label: st.label.trim() }] } }));
                    close();
                } }, "\u0414\u043E\u0434\u0430\u0442\u0438 \u043F\u0435\u0440\u0456\u043E\u0434"))),
    });
}
function BackupPage() {
    const { state, today, data } = (0, view_ts_1.derived)();
    const kinds = { idb: 'IndexedDB у браузері', local: 'localStorage (резервний варіант)', memory: 'лише памʼять — дані зникнуть після закриття' };
    const persisted = (0, dom_ts_1.h)("span", { class: "hint" }, "\u043F\u0435\u0440\u0435\u0432\u0456\u0440\u044F\u044E\u2026");
    (0, db_ts_1.isPersisted)().then((v) => { persisted.textContent = v === true ? 'захищене від автоматичного очищення' : v === false ? 'браузер може очистити дані при нестачі місця' : 'інформація недоступна'; });
    const exportJSON = async () => {
        const r = await (0, share_ts_1.saveFile)(`den-365-backup-${today}${state.demo ? '-demo' : ''}.json`, 'application/json', JSON.stringify((0, store_ts_1.exportBackup)(), null, 1));
        if (r !== 'cancelled')
            (0, ui_tsx_1.toast)('Копію збережено.');
    };
    return ((0, dom_ts_1.h)("div", { class: "screen settings" },
        (0, dom_ts_1.h)(PageHead, { title: "\u0420\u0435\u0437\u0435\u0440\u0432\u043D\u0456 \u043A\u043E\u043F\u0456\u0457" }),
        (0, dom_ts_1.h)(ui_tsx_1.Note, { tone: "warn" },
            "\u0414\u0430\u043D\u0456 \u0437\u0431\u0435\u0440\u0456\u0433\u0430\u044E\u0442\u044C\u0441\u044F \u043B\u0438\u0448\u0435 \u043D\u0430 \u0446\u044C\u043E\u043C\u0443 \u043F\u0440\u0438\u0441\u0442\u0440\u043E\u0457 \u0439 \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E ",
            (0, dom_ts_1.h)("b", null, "\u043D\u0435 \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0456\u0437\u0443\u044E\u0442\u044C\u0441\u044F"),
            ". \u041E\u0447\u0438\u0449\u0435\u043D\u043D\u044F \u0434\u0430\u043D\u0438\u0445 Safari \u0430\u0431\u043E \u0432\u0438\u0434\u0430\u043B\u0435\u043D\u043D\u044F \u0437\u0430\u0441\u0442\u043E\u0441\u0443\u043D\u043A\u0443 \u0437 \u0435\u043A\u0440\u0430\u043D\u0430 \u00AB\u0414\u043E\u0434\u043E\u043C\u0443\u00BB \u043C\u043E\u0436\u0435 \u0457\u0445 \u0441\u0442\u0435\u0440\u0442\u0438. \u0420\u043E\u0431\u0438 \u043A\u043E\u043F\u0456\u044E \u0440\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u043E \u2014 \u043D\u0430\u043F\u0440\u0438\u043A\u043B\u0430\u0434, \u0449\u043E\u0442\u0438\u0436\u043D\u044F."),
        (0, dom_ts_1.h)(ui_tsx_1.Group, { title: "\u0415\u043A\u0441\u043F\u043E\u0440\u0442" },
            (0, dom_ts_1.h)(ui_tsx_1.Row, { icon: "download", title: "\u0420\u0435\u0437\u0435\u0440\u0432\u043D\u0430 \u043A\u043E\u043F\u0456\u044F (JSON)", sub: "\u041F\u043E\u0432\u043D\u0430 \u043A\u043E\u043F\u0456\u044F \u0434\u043B\u044F \u0432\u0456\u0434\u043D\u043E\u0432\u043B\u0435\u043D\u043D\u044F", chevron: true, onClick: exportJSON }),
            (0, dom_ts_1.h)(ui_tsx_1.Row, { icon: "bars", title: "\u041E\u043F\u0435\u0440\u0430\u0446\u0456\u0457 (CSV)", sub: "\u0414\u043B\u044F Excel \u0447\u0438 \u0422\u0430\u0431\u043B\u0438\u0446\u044C: \u00AB;\u00BB, \u043A\u043E\u043F\u0456\u0439\u043A\u0438 \u0447\u0435\u0440\u0435\u0437 \u043A\u043E\u043C\u0443", chevron: true, onClick: () => (0, share_ts_1.saveFile)(`den-365-operations-${today}.csv`, 'text/csv', (0, backup_ts_1.opsCSV)(data)) }),
            (0, dom_ts_1.h)(ui_tsx_1.Row, { icon: "calendar", title: "\u041F\u0456\u0434\u0441\u0443\u043C\u043A\u0438 \u0434\u043D\u0456\u0432 (CSV)", sub: "\u041F\u043B\u0430\u043D, \u0444\u0430\u043A\u0442, \u0440\u0456\u0437\u043D\u0438\u0446\u044F \u043F\u043E \u0434\u043D\u044F\u0445", chevron: true, onClick: () => (0, share_ts_1.saveFile)(`den-365-days-${today}.csv`, 'text/csv', (0, backup_ts_1.daysCSV)(data, today)) })),
        (0, dom_ts_1.h)(ui_tsx_1.Group, { title: "\u0412\u0456\u0434\u043D\u043E\u0432\u043B\u0435\u043D\u043D\u044F", foot: "\u041F\u0435\u0440\u0435\u0434 \u0456\u043C\u043F\u043E\u0440\u0442\u043E\u043C \u043F\u043E\u0442\u043E\u0447\u043D\u0456 \u0434\u0430\u043D\u0456 \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u0437\u0431\u0435\u0440\u0456\u0433\u0430\u044E\u0442\u044C\u0441\u044F \u044F\u043A \u043F\u043E\u043F\u0435\u0440\u0435\u0434\u043D\u044F \u043A\u043E\u043F\u0456\u044F." },
            (0, dom_ts_1.h)(ui_tsx_1.Row, { icon: "upload", title: "\u0412\u0456\u0434\u043D\u043E\u0432\u0438\u0442\u0438 \u0437 \u0444\u0430\u0439\u043B\u0443 JSON", sub: "\u041F\u0435\u0440\u0435\u0432\u0456\u0440\u043A\u0430 \u0441\u0442\u0440\u0443\u043A\u0442\u0443\u0440\u0438, \u0431\u0435\u0437 \u0434\u0443\u0431\u043B\u044E\u0432\u0430\u043D\u043D\u044F \u0437\u0430\u043F\u0438\u0441\u0456\u0432", chevron: true, onClick: importFlow }),
            state.prevBackup ? ((0, dom_ts_1.h)(ui_tsx_1.Row, { icon: "repeat", title: "\u041F\u043E\u0432\u0435\u0440\u043D\u0443\u0442\u0438 \u043F\u043E\u043F\u0435\u0440\u0435\u0434\u043D\u044E \u043A\u043E\u043F\u0456\u044E", sub: `Збережена ${(0, time_ts_1.stamp)(state.prevBackup.at)}, записів: ${state.prevBackup.ops}`, chevron: true, onClick: () => (0, ui_tsx_1.confirmSheet)({
                    title: 'Повернути попередню копію?',
                    text: 'Поточні дані теж буде збережено як попередню копію — це можна буде скасувати.',
                    confirm: 'Повернути',
                    onConfirm: async () => { if (await (0, store_ts_1.restorePrevious)())
                        (0, ui_tsx_1.toast)('Попередню копію відновлено.'); },
                }) })) : null),
        (0, dom_ts_1.h)(ui_tsx_1.Group, { title: "\u0421\u0445\u043E\u0432\u0438\u0449\u0435" },
            (0, dom_ts_1.h)(ui_tsx_1.Row, { icon: "lock", title: "\u0414\u0435 \u0437\u0431\u0435\u0440\u0456\u0433\u0430\u044E\u0442\u044C\u0441\u044F \u0434\u0430\u043D\u0456", sub: kinds[state.backend] }),
            (0, dom_ts_1.h)("div", { class: "row" },
                (0, dom_ts_1.h)("span", { class: "row-icon" }, (0, icons_ts_1.icon)('shield', 18)),
                (0, dom_ts_1.h)("span", { class: "row-main" },
                    (0, dom_ts_1.h)("span", { class: "row-title" }, "\u0421\u0442\u0430\u043D"),
                    persisted),
                (0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "tinted", size: "sm", onClick: async () => { const r = await (0, db_ts_1.requestPersistence)(); (0, ui_tsx_1.toast)(r ? 'Браузер погодився зберігати дані.' : 'Браузер не підтвердив. Встанови застосунок на екран «Додому» й роби копії.'); (0, view_ts_1.setUI)({}); } }, "\u041F\u043E\u043F\u0440\u043E\u0441\u0438\u0442\u0438")))));
}
async function importFlow() {
    const file = await (0, share_ts_1.pickFile)('application/json,.json');
    if (!file)
        return;
    let raw;
    try {
        raw = JSON.parse(await file.text());
    }
    catch {
        (0, ui_tsx_1.toast)('Файл пошкоджений або це не JSON.');
        return;
    }
    const v = (0, backup_ts_1.validateBackup)(raw);
    if (!v.ok) {
        (0, ui_tsx_1.openSheet)({ title: 'Не вдалося прочитати копію', render: () => (0, dom_ts_1.h)("div", { class: "stack" }, v.errors.map((e) => (0, dom_ts_1.h)(ui_tsx_1.Note, { tone: "warn" }, e))) });
        return;
    }
    const cur = (0, store_ts_1.getState)();
    const stats = (0, backup_ts_1.previewMerge)(cur.data, v.data);
    (0, ui_tsx_1.openSheet)({
        title: 'Відновлення з копії',
        render: (close) => ((0, dom_ts_1.h)("div", { class: "stack" },
            (0, dom_ts_1.h)("p", { class: "lead" },
                "\u0423 \u0444\u0430\u0439\u043B\u0456: ",
                v.data.ops.length,
                " \u0437\u0430\u043F\u0438\u0441\u0456\u0432, ",
                Object.keys(v.data.days).length,
                " \u0434\u043D\u0456\u0432, \u0446\u0456\u043B\u0435\u0439: ",
                v.data.goals.length,
                "."),
            v.demo ? (0, dom_ts_1.h)(ui_tsx_1.Note, { tone: "warn" }, "\u0426\u0435 \u043A\u043E\u043F\u0456\u044F \u0437 \u0434\u0435\u043C\u043E-\u0440\u0435\u0436\u0438\u043C\u0443 \u2014 \u0434\u0430\u043D\u0456 \u0432 \u043D\u0456\u0439 \u0432\u0438\u0433\u0430\u0434\u0430\u043D\u0456.") : null,
            cur.demo ? (0, dom_ts_1.h)(ui_tsx_1.Note, { tone: "warn" }, "\u0417\u0430\u0440\u0430\u0437 \u0443\u0432\u0456\u043C\u043A\u043D\u0435\u043D\u043E \u0434\u0435\u043C\u043E-\u0440\u0435\u0436\u0438\u043C: \u043A\u043E\u043F\u0456\u044E \u0431\u0443\u0434\u0435 \u0432\u0456\u0434\u043D\u043E\u0432\u043B\u0435\u043D\u043E \u0432 \u0434\u0435\u043C\u043E-\u0431\u0430\u0437\u0443. \u0429\u043E\u0431 \u0432\u0456\u0434\u043D\u043E\u0432\u0438\u0442\u0438 \u043E\u0441\u043E\u0431\u0438\u0441\u0442\u0456 \u0434\u0430\u043D\u0456, \u0441\u043F\u0435\u0440\u0448\u0443 \u0432\u0438\u043C\u043A\u043D\u0438 \u0434\u0435\u043C\u043E.") : null,
            v.warnings.map((w) => (0, dom_ts_1.h)(ui_tsx_1.Note, { tone: "info" }, w)),
            (0, dom_ts_1.h)(ui_tsx_1.Group, null,
                (0, dom_ts_1.h)(ui_tsx_1.Row, { title: "\u041D\u043E\u0432\u0438\u0445 \u0437\u0430\u043F\u0438\u0441\u0456\u0432", value: String(stats.added) }),
                (0, dom_ts_1.h)(ui_tsx_1.Row, { title: "\u041E\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0445 (\u043D\u043E\u0432\u0456\u0448\u0430 \u0432\u0435\u0440\u0441\u0456\u044F)", value: String(stats.updated) }),
                (0, dom_ts_1.h)(ui_tsx_1.Row, { title: "\u041F\u043E\u0432\u0442\u043E\u0440\u0456\u0432 \u2014 \u0431\u0443\u0434\u0435 \u043F\u0440\u043E\u043F\u0443\u0449\u0435\u043D\u043E", value: String(stats.duplicates), valueTone: "muted" }),
                (0, dom_ts_1.h)(ui_tsx_1.Row, { title: "\u041D\u043E\u0432\u0438\u0445 \u0434\u043D\u0456\u0432", value: String(stats.daysAdded + stats.daysUpdated) })),
            (0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "primary", size: "lg", full: true, onClick: async () => {
                    const r = await (0, store_ts_1.importData)(v.data, 'merge');
                    close();
                    (0, ui_tsx_1.toast)(r ? `Додано ${r.added}, оновлено ${r.updated}, повторів пропущено ${r.duplicates}.` : 'Готово.');
                } }, "\u041E\u0431\u02BC\u0454\u0434\u043D\u0430\u0442\u0438 \u0437 \u043F\u043E\u0442\u043E\u0447\u043D\u0438\u043C\u0438 \u0434\u0430\u043D\u0438\u043C\u0438"),
            (0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "secondary", size: "lg", full: true, onClick: () => (0, ui_tsx_1.confirmSheet)({
                    title: 'Замінити всі дані?',
                    text: 'Поточні дані буде замінено копією. Їх збережемо як попередню копію — повернути можна в цьому ж розділі.',
                    confirm: 'Замінити',
                    danger: true,
                    onConfirm: async () => { await (0, store_ts_1.importData)(v.data, 'replace'); close(); (0, ui_tsx_1.toast)('Дані замінено копією.'); },
                }) }, "\u0417\u0430\u043C\u0456\u043D\u0438\u0442\u0438 \u0432\u0441\u0456 \u0434\u0430\u043D\u0456 \u043A\u043E\u043F\u0456\u0454\u044E"))),
    });
}
function AboutPage() {
    return ((0, dom_ts_1.h)("div", { class: "screen settings" },
        (0, dom_ts_1.h)(PageHead, { title: "\u041F\u0440\u043E \u0437\u0430\u0441\u0442\u043E\u0441\u0443\u043D\u043E\u043A" }),
        (0, dom_ts_1.h)("div", { class: "prose" },
            (0, dom_ts_1.h)("p", null,
                (0, dom_ts_1.h)("b", null, "\u0414\u0415\u041D\u042C \u00D7 365"),
                " \u2014 \u043F\u0435\u0440\u0441\u043E\u043D\u0430\u043B\u044C\u043D\u0438\u0439 \u0444\u0456\u043D\u0430\u043D\u0441\u043E\u0432\u0438\u0439 \u0440\u0430\u0434\u043D\u0438\u043A \u0434\u043B\u044F \u0449\u043E\u0434\u0435\u043D\u043D\u0438\u0445 \u0440\u0456\u0448\u0435\u043D\u044C: \u043F\u043B\u0430\u043D \u0434\u043D\u044F, \u0448\u0432\u0438\u0434\u043A\u0438\u0439 \u043E\u0431\u043B\u0456\u043A, \u0431\u0435\u0437\u043F\u0435\u0447\u043D\u0430 \u0441\u0443\u043C\u0430 \u0434\u043B\u044F \u043D\u0430\u043A\u043E\u043F\u0438\u0447\u0435\u043D\u044C \u0456 \u043E\u0434\u043D\u0430 \u0434\u043E\u0440\u0435\u0447\u043D\u0430 \u043F\u043E\u0440\u0430\u0434\u0430 \u0432\u0432\u0435\u0447\u0435\u0440\u0456."),
            (0, dom_ts_1.h)("h3", null, "\u041A\u043E\u043D\u0444\u0456\u0434\u0435\u043D\u0446\u0456\u0439\u043D\u0456\u0441\u0442\u044C"),
            (0, dom_ts_1.h)("p", null, "\u0411\u0435\u0437 \u0440\u0435\u0454\u0441\u0442\u0440\u0430\u0446\u0456\u0457, \u0440\u0435\u043A\u043B\u0430\u043C\u0438, \u0430\u043D\u0430\u043B\u0456\u0442\u0438\u043A\u0438 \u0439 \u0441\u0435\u0440\u0432\u0435\u0440\u0456\u0432. \u041E\u0441\u043E\u0431\u0438\u0441\u0442\u0456 \u0444\u0456\u043D\u0430\u043D\u0441\u043E\u0432\u0456 \u0434\u0430\u043D\u0456 \u0437\u0431\u0435\u0440\u0456\u0433\u0430\u044E\u0442\u044C\u0441\u044F \u043B\u0438\u0448\u0435 \u043D\u0430 \u0446\u044C\u043E\u043C\u0443 \u043F\u0440\u0438\u0441\u0442\u0440\u043E\u0457 \u0456 \u043D\u0456\u043A\u0443\u0434\u0438 \u043D\u0435 \u043D\u0430\u0434\u0441\u0438\u043B\u0430\u044E\u0442\u044C\u0441\u044F. \u041F\u043E\u0440\u0430\u0434\u043D\u0438\u043A \u043F\u0440\u0430\u0446\u044E\u0454 \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u043E, \u0431\u0435\u0437 \u043F\u043B\u0430\u0442\u043D\u0438\u0445 \u0441\u0435\u0440\u0432\u0456\u0441\u0456\u0432 \u0456 \u0431\u0435\u0437 \u0456\u043D\u0442\u0435\u0440\u043D\u0435\u0442\u0443."),
            (0, dom_ts_1.h)("h3", null, "\u042F\u043A \u0440\u0430\u0445\u0443\u044E\u0442\u044C\u0441\u044F \u0433\u0440\u043E\u0448\u0456"),
            (0, dom_ts_1.h)("ul", null,
                (0, dom_ts_1.h)("li", null, "\u0423\u0441\u0456 \u0441\u0443\u043C\u0438 \u0437\u0431\u0435\u0440\u0456\u0433\u0430\u044E\u0442\u044C\u0441\u044F \u0432 \u0446\u0456\u043B\u0438\u0445 \u043A\u043E\u043F\u0456\u0439\u043A\u0430\u0445 \u2014 \u0431\u0435\u0437 \u043F\u043E\u0445\u0438\u0431\u043E\u043A \u043E\u043A\u0440\u0443\u0433\u043B\u0435\u043D\u043D\u044F."),
                (0, dom_ts_1.h)("li", null, "\u0412\u0438\u0442\u0440\u0430\u0442\u0438, \u0434\u043E\u0445\u043E\u0434\u0438, \u043F\u043E\u0432\u0435\u0440\u043D\u0435\u043D\u043D\u044F, \u043F\u0435\u0440\u0435\u043A\u0430\u0437\u0438 \u043C\u0456\u0436 \u0440\u0430\u0445\u0443\u043D\u043A\u0430\u043C\u0438 \u0439 \u0443 \u043D\u0430\u043A\u043E\u043F\u0438\u0447\u0435\u043D\u043D\u044F \u043E\u0431\u043B\u0456\u043A\u043E\u0432\u0443\u044E\u0442\u044C\u0441\u044F \u043E\u043A\u0440\u0435\u043C\u043E."),
                (0, dom_ts_1.h)("li", null, "\u041E\u0431\u0456\u0434 \u0456\u0437 \u0443\u0436\u0435 \u043A\u0443\u043F\u043B\u0435\u043D\u0438\u0445 \u043F\u0440\u043E\u0434\u0443\u043A\u0442\u0456\u0432 \u2014 \u043B\u0438\u0448\u0435 \u0441\u043E\u0431\u0456\u0432\u0430\u0440\u0442\u0456\u0441\u0442\u044C, \u0431\u0435\u0437 \u043F\u043E\u0432\u0442\u043E\u0440\u043D\u043E\u0433\u043E \u0441\u043F\u0438\u0441\u0430\u043D\u043D\u044F."),
                (0, dom_ts_1.h)("li", null, "\u041D\u0435\u0432\u0438\u0442\u0440\u0430\u0447\u0435\u043D\u0438\u0439 \u0431\u044E\u0434\u0436\u0435\u0442 \u2014 \u043D\u0435 \u0437\u0430\u043E\u0449\u0430\u0434\u0436\u0435\u043D\u043D\u044F, \u0434\u043E\u043A\u0438 \u0433\u0440\u043E\u0448\u0456 \u043D\u0435 \u0432\u0456\u0434\u043A\u043B\u0430\u0434\u0435\u043D\u043E."),
                (0, dom_ts_1.h)("li", null, "\u0414\u0435\u043D\u044C \u0431\u0435\u0437 \u0437\u0430\u043F\u0438\u0441\u0456\u0432 \u2014 \u0446\u0435 \u00AB\u043D\u0435\u043C\u0430\u0454 \u0434\u0430\u043D\u0438\u0445\u00BB, \u0430 \u043D\u0435 \u043D\u0443\u043B\u044C\u043E\u0432\u0456 \u0432\u0438\u0442\u0440\u0430\u0442\u0438."),
                (0, dom_ts_1.h)("li", null, "\u0414\u0430\u0442\u0438 \u2014 \u0437\u0430 \u043A\u0438\u0457\u0432\u0441\u044C\u043A\u0438\u043C \u0447\u0430\u0441\u043E\u043C, \u043D\u0435\u0437\u0430\u043B\u0435\u0436\u043D\u043E \u0432\u0456\u0434 \u043D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u044C \u043F\u0440\u0438\u0441\u0442\u0440\u043E\u044E.")),
            (0, dom_ts_1.h)("h3", null, "\u041F\u043E\u0440\u0430\u0434\u0438"),
            (0, dom_ts_1.h)("p", null, "\u041F\u043E\u0440\u0430\u0434\u0438 \u0441\u0444\u043E\u0440\u043C\u0443\u043B\u044C\u043E\u0432\u0430\u043D\u043E \u044F\u043A \u043F\u0440\u0438\u043D\u0446\u0438\u043F\u0438 \u00AB\u0437\u0430 \u043C\u043E\u0442\u0438\u0432\u0430\u043C\u0438 \u043F\u0456\u0434\u0445\u043E\u0434\u0443\u00BB \u0432\u0456\u0434\u043E\u043C\u0438\u0445 \u0456\u043D\u0432\u0435\u0441\u0442\u043E\u0440\u0456\u0432 \u0456 \u0430\u0432\u0442\u043E\u0440\u0456\u0432. \u0426\u0435 \u043D\u0435 \u0434\u043E\u0441\u043B\u0456\u0432\u043D\u0456 \u0446\u0438\u0442\u0430\u0442\u0438 \u0439 \u043D\u0435 \u0456\u043D\u0434\u0438\u0432\u0456\u0434\u0443\u0430\u043B\u044C\u043D\u0430 \u0456\u043D\u0432\u0435\u0441\u0442\u0438\u0446\u0456\u0439\u043D\u0430 \u043A\u043E\u043D\u0441\u0443\u043B\u044C\u0442\u0430\u0446\u0456\u044F."),
            (0, dom_ts_1.h)("p", { class: "hint" },
                "\u0412\u0435\u0440\u0441\u0456\u044F ",
                exports.APP_VERSION))));
}
};

// ── Onboarding.tsx
defs["Onboarding.js"] = function (require, exports, module) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Onboarding = Onboarding;
const dom_ts_1 = require("./dom.js");
const icons_ts_1 = require("./icons.js");
const ui_tsx_1 = require("./ui.js");
const store_ts_1 = require("./store.js");
const view_ts_1 = require("./view.js");
const STEPS = [
    { icon: 'list', title: 'Заплануй', text: 'Склади приблизний план дня одним дотиком — із шаблону «Навчання у Дніпрі», «Економний день» чи власного.' },
    { icon: 'plusCircle', title: 'Запиши', text: 'Кава, проїзд, обід, продукти — за кілька секунд. Великі кнопки, типові суми, жодної реєстрації.' },
    { icon: 'sprout', title: 'Примножуй', text: 'Бач економію, безпечну суму для накопичень і отримуй одну доречну пораду ввечері.' },
];
let dialPrev = 0;
function YearDial(p) {
    const c = 130;
    const ticks = (0, dom_ts_1.h)("g", { class: "dial-ticks" });
    for (let i = 0; i < 365; i++) {
        const a = (i / 365) * Math.PI * 2;
        const month = i % 30 === 0 && i < 345;
        const r1 = month ? 90 : 99;
        const r2 = 107;
        ticks.appendChild((0, dom_ts_1.h)("line", { class: month ? 'm' : undefined, x1: (c + r1 * Math.sin(a)).toFixed(2), y1: (c - r1 * Math.cos(a)).toFixed(2), x2: (c + r2 * Math.sin(a)).toFixed(2), y2: (c - r2 * Math.cos(a)).toFixed(2) }));
    }
    const R = 120;
    const C = 2 * Math.PI * R;
    const arc = (0, dom_ts_1.h)("circle", { class: "dial-arc", cx: String(c), cy: String(c), r: String(R), transform: `rotate(-90 ${c} ${c})` });
    arc.style.strokeDasharray = String(C);
    const from = (0, dom_ts_1.reducedMotion)() ? p.frac : dialPrev;
    arc.style.strokeDashoffset = String(C * (1 - from));
    dialPrev = p.frac;
    if (from !== p.frac)
        requestAnimationFrame(() => requestAnimationFrame(() => { arc.style.strokeDashoffset = String(C * (1 - p.frac)); }));
    return ((0, dom_ts_1.h)("div", { class: "dial", "aria-hidden": "true" },
        (0, dom_ts_1.h)("svg", { viewBox: "0 0 260 260" },
            ticks,
            (0, dom_ts_1.h)("circle", { class: "dial-track", cx: String(c), cy: String(c), r: String(R) }),
            arc,
            (0, dom_ts_1.h)("circle", { class: "dial-day", cx: String(c), cy: String(c), r: "30" }),
            (0, dom_ts_1.h)("circle", { class: "dial-core", cx: String(c), cy: String(c), r: "11" }))));
}
function Onboarding() {
    let step = 0;
    const finish = (then) => {
        (0, store_ts_1.saveSettings)((s) => ({ ...s, onboarded: true }));
        then?.();
    };
    const view = (0, dom_ts_1.live)(() => {
        const last = step === STEPS.length;
        return ((0, dom_ts_1.h)("div", { class: "onb" },
            (0, dom_ts_1.h)("div", { class: "onb-brand" },
                (0, dom_ts_1.h)("span", { class: "onb-mark", "aria-hidden": "true" }, (0, icons_ts_1.icon)('sun', 22)),
                (0, dom_ts_1.h)("span", { class: "onb-name" },
                    "\u0414\u0415\u041D\u042C ",
                    (0, dom_ts_1.h)("span", { class: "onb-x" }, "\u00D7"),
                    " 365")),
            (0, dom_ts_1.h)(YearDial, { frac: last ? 1 : (step + 1) / (STEPS.length + 1) }),
            (0, dom_ts_1.h)("ol", { class: "onb-steps", "aria-label": "\u0422\u0440\u0438 \u043A\u0440\u043E\u043A\u0438" }, STEPS.map((s, i) => ((0, dom_ts_1.h)("li", { class: (0, dom_ts_1.cx)('onb-step', i === step && 'on', (i < step || last) && 'done') },
                (0, icons_ts_1.icon)(i < step || last ? 'check' : s.icon, 16),
                (0, dom_ts_1.h)("span", null, s.title))))),
            last ? ((0, dom_ts_1.h)("div", { class: "onb-body" },
                (0, dom_ts_1.h)("h1", { class: "onb-title" }, "\u041F\u043E\u0447\u043D\u0456\u043C\u043E"),
                (0, dom_ts_1.h)("p", { class: "onb-text" }, "\u0411\u044E\u0434\u0436\u0435\u0442 \u043C\u043E\u0436\u043D\u0430 \u043D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u0442\u0438 \u0437\u0430\u0440\u0430\u0437 \u0430\u0431\u043E \u043F\u0456\u0437\u043D\u0456\u0448\u0435. \u0423\u0441\u0456 \u0434\u0430\u043D\u0456 \u0437\u0430\u043B\u0438\u0448\u0430\u044E\u0442\u044C\u0441\u044F \u043B\u0438\u0448\u0435 \u043D\u0430 \u0446\u044C\u043E\u043C\u0443 \u043F\u0440\u0438\u0441\u0442\u0440\u043E\u0457."),
                (0, dom_ts_1.h)("div", { class: "onb-actions" },
                    (0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "primary", size: "lg", full: true, onClick: () => finish(() => (0, view_ts_1.go)('day')) }, "\u041F\u043E\u0447\u0430\u0442\u0438 \u0437 \u0441\u044C\u043E\u0433\u043E\u0434\u043D\u0456\u0448\u043D\u044C\u043E\u0433\u043E \u0434\u043D\u044F"),
                    (0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "secondary", size: "lg", full: true, onClick: () => finish(() => (0, view_ts_1.go)('settings', { settingsPage: 'budget' })) }, "\u041D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u0442\u0438 \u0431\u044E\u0434\u0436\u0435\u0442"),
                    (0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "ghost", size: "lg", full: true, onClick: async () => { finish(); await (0, store_ts_1.setDemoMode)(true); (0, view_ts_1.go)('day'); } }, "\u041F\u043E\u0434\u0438\u0432\u0438\u0442\u0438\u0441\u044F \u0434\u0435\u043C\u043E \u0437 \u043F\u0440\u0438\u043A\u043B\u0430\u0434\u043E\u043C")))) : ((0, dom_ts_1.h)("div", { class: "onb-body" },
                (0, dom_ts_1.h)("h1", { class: "onb-title" }, STEPS[step].title),
                (0, dom_ts_1.h)("p", { class: "onb-text" }, STEPS[step].text),
                (0, dom_ts_1.h)("div", { class: "onb-actions" },
                    (0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "primary", size: "lg", full: true, onClick: () => { step++; view.refresh(); } }, "\u0414\u0430\u043B\u0456"),
                    (0, dom_ts_1.h)(ui_tsx_1.Btn, { kind: "ghost", size: "md", full: true, onClick: () => { step = STEPS.length; view.refresh(); } }, "\u041F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u0442\u0438"))))));
    });
    return view.el;
}
};

// ── pwa.ts
defs["pwa.js"] = function (require, exports, module) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerServiceWorker = registerServiceWorker;
function registerServiceWorker(onUpdate) {
    if (!('serviceWorker' in navigator) || location.protocol === 'file:')
        return;
    let requested = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (requested)
            location.reload();
    });
    navigator.serviceWorker
        .register('./sw.js')
        .then((reg) => {
        const offer = (w) => onUpdate(() => {
            requested = true;
            w.postMessage({ type: 'SKIP_WAITING' });
        });
        if (reg.waiting && navigator.serviceWorker.controller)
            offer(reg.waiting);
        reg.addEventListener('updatefound', () => {
            const w = reg.installing;
            if (!w)
                return;
            w.addEventListener('statechange', () => {
                if (w.state === 'installed' && navigator.serviceWorker.controller)
                    offer(w);
            });
        });
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible')
                reg.update().catch(() => { });
        });
    })
        .catch(() => {
    });
}
};

// ── App.tsx
defs["App.js"] = function (require, exports, module) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mountApp = mountApp;
const dom_ts_1 = require("./dom.js");
const icons_ts_1 = require("./icons.js");
const ui_tsx_1 = require("./ui.js");
const DayScreen_tsx_1 = require("./DayScreen.js");
const AddScreen_tsx_1 = require("./AddScreen.js");
const AnalyticsScreen_tsx_1 = require("./AnalyticsScreen.js");
const FutureScreen_tsx_1 = require("./FutureScreen.js");
const SettingsScreen_tsx_1 = require("./SettingsScreen.js");
const Onboarding_tsx_1 = require("./Onboarding.js");
const forms_tsx_1 = require("./forms.js");
const store_ts_1 = require("./store.js");
const view_ts_1 = require("./view.js");
const pwa_ts_1 = require("./pwa.js");
const time_ts_1 = require("./time.js");
const TABS = [
    { id: 'day', label: 'День', icon: 'sun' },
    { id: 'add', label: 'Додати', icon: 'plusCircle' },
    { id: 'stats', label: 'Аналітика', icon: 'bars' },
    { id: 'future', label: 'Майбутнє', icon: 'sprout' },
    { id: 'settings', label: 'Налаштування', icon: 'sliders' },
];
let screenEl;
let tabbarEl;
let fabEl;
let bannerEl;
let updateApply = null;
let lastToday = (0, time_ts_1.todayKey)();
let lastTab = null;
function applyTheme() {
    const theme = (0, store_ts_1.getState)().data.settings.theme;
    const root = document.documentElement;
    if (theme === 'system')
        delete root.dataset.theme;
    else
        root.dataset.theme = theme;
    try {
        localStorage.setItem('den365:theme', theme);
    }
    catch {
    }
    const dark = theme === 'dark' || (theme === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
    for (const m of document.querySelectorAll('meta[name="theme-color"]')) {
        m.content = dark ? '#000000' : '#F3F4F1';
        if (theme !== 'system')
            m.removeAttribute('media');
    }
}
function render() {
    const s = (0, store_ts_1.getState)();
    if (!s.ready)
        return;
    const onboarding = !s.data.settings.onboarded && !s.demo;
    document.body.classList.toggle('onboarding', onboarding);
    if (onboarding) {
        screenEl.replaceChildren((0, dom_ts_1.h)(Onboarding_tsx_1.Onboarding, null));
        tabbarEl.replaceChildren();
        fabEl.replaceChildren();
        bannerEl.replaceChildren();
        lastTab = null;
        return;
    }
    const screens = { day: DayScreen_tsx_1.DayScreen, add: AddScreen_tsx_1.AddScreen, stats: AnalyticsScreen_tsx_1.AnalyticsScreen, future: FutureScreen_tsx_1.FutureScreen, settings: SettingsScreen_tsx_1.SettingsScreen };
    const tabChanged = lastTab !== view_ts_1.ui.tab;
    lastTab = view_ts_1.ui.tab;
    const node = screens[view_ts_1.ui.tab]();
    screenEl.replaceChildren(node);
    if (tabChanged) {
        screenEl.classList.remove('enter');
        void screenEl.offsetWidth;
        screenEl.classList.add('enter');
    }
    tabbarEl.replaceChildren(...TABS.map((t) => ((0, dom_ts_1.h)("button", { type: "button", class: (0, dom_ts_1.cx)('tab', view_ts_1.ui.tab === t.id && 'on'), "aria-current": view_ts_1.ui.tab === t.id ? 'page' : undefined, onClick: () => {
            if (t.id === view_ts_1.ui.tab && t.id === 'settings')
                view_ts_1.ui.settingsPage = null;
            if (t.id === view_ts_1.ui.tab && t.id === 'day')
                view_ts_1.ui.dayDate = null;
            (0, view_ts_1.go)(t.id);
        } },
        (0, icons_ts_1.icon)(t.icon, 24),
        (0, dom_ts_1.h)("span", { class: "tab-label" }, t.label)))));
    const { today } = (0, view_ts_1.derived)();
    const date = (0, DayScreen_tsx_1.currentDayDate)();
    fabEl.replaceChildren(view_ts_1.ui.tab === 'day' && date <= today
        ? (0, dom_ts_1.h)("button", { type: "button", class: "fab", onClick: () => (0, forms_tsx_1.openQuickAdd)({ date }), "aria-label": "\u0414\u043E\u0434\u0430\u0442\u0438 \u0432\u0438\u0442\u0440\u0430\u0442\u0443" },
            (0, icons_ts_1.icon)('plus', 22),
            (0, dom_ts_1.h)("span", null, "\u0412\u0438\u0442\u0440\u0430\u0442\u0430"))
        : (0, dom_ts_1.h)("span", null));
    const banners = [];
    if (s.demo)
        banners.push((0, dom_ts_1.h)("div", { class: "banner banner-demo" },
            (0, icons_ts_1.icon)('spark', 16),
            (0, dom_ts_1.h)("span", null, "\u0414\u0435\u043C\u043E-\u0440\u0435\u0436\u0438\u043C: \u0432\u0438\u0433\u0430\u0434\u0430\u043D\u0456 \u0434\u0430\u043D\u0456 \u043E\u043A\u0440\u0435\u043C\u043E \u0432\u0456\u0434 \u0442\u0432\u043E\u0457\u0445."),
            (0, dom_ts_1.h)("button", { type: "button", class: "banner-btn", onClick: async () => { await (0, store_ts_1.setDemoMode)(false); (0, view_ts_1.go)('day', { dayDate: null }); } }, "\u0412\u0438\u0439\u0442\u0438")));
    if (s.error)
        banners.push((0, dom_ts_1.h)("div", { class: "banner banner-error" },
            (0, icons_ts_1.icon)('info', 16),
            (0, dom_ts_1.h)("span", null, s.error)));
    if (updateApply)
        banners.push((0, dom_ts_1.h)("div", { class: "banner banner-update" },
            (0, icons_ts_1.icon)('repeat', 16),
            (0, dom_ts_1.h)("span", null, "\u0414\u043E\u0441\u0442\u0443\u043F\u043D\u0430 \u043D\u043E\u0432\u0430 \u0432\u0435\u0440\u0441\u0456\u044F. \u0414\u0430\u043D\u0456 \u0437\u0431\u0435\u0440\u0435\u0436\u0443\u0442\u044C\u0441\u044F."),
            (0, dom_ts_1.h)("button", { type: "button", class: "banner-btn", onClick: () => updateApply?.() }, "\u041E\u043D\u043E\u0432\u0438\u0442\u0438")));
    bannerEl.replaceChildren(...banners);
}
function checkDay() {
    const t = (0, time_ts_1.todayKey)();
    if (t === lastToday)
        return;
    lastToday = t;
    (0, store_ts_1.ensureToday)();
    render();
}
function mountApp(root) {
    root.replaceChildren((0, dom_ts_1.h)("div", { class: "app" },
        (0, dom_ts_1.h)("div", { class: "banners", ref: (e) => { bannerEl = e; } }),
        (0, dom_ts_1.h)("main", { class: "main", id: "main", ref: (e) => { screenEl = e; } }),
        (0, dom_ts_1.h)("div", { class: "fab-slot", ref: (e) => { fabEl = e; } }),
        (0, dom_ts_1.h)("nav", { class: "tabbar", "aria-label": "\u0420\u043E\u0437\u0434\u0456\u043B\u0438", ref: (e) => { tabbarEl = e; } }),
        (0, dom_ts_1.h)("div", { id: "sheets" }),
        (0, dom_ts_1.h)("div", { id: "toasts", class: "toast-layer", "aria-live": "polite" })));
    const fromHash = location.hash.slice(1);
    if (TABS.some((t) => t.id === fromHash))
        view_ts_1.ui.tab = fromHash;
    (0, view_ts_1.setRenderer)(render);
    (0, store_ts_1.subscribe)(() => {
        applyTheme();
        render();
        (0, ui_tsx_1.refreshSheets)();
    });
    (0, store_ts_1.onHabits)((list) => (0, ui_tsx_1.toast)(`Нова звичка: ${list.map((x) => x.title).join(', ')}`, [{ label: 'Переглянути', run: () => (0, view_ts_1.go)('future', { futureTab: 'habits' }) }]));
    window.addEventListener('hashchange', () => {
        const t = location.hash.slice(1);
        if (TABS.some((x) => x.id === t) && t !== view_ts_1.ui.tab)
            (0, view_ts_1.go)(t);
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape')
            (0, ui_tsx_1.closeTopSheet)();
    });
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible')
            checkDay();
    });
    setInterval(checkDay, 30_000);
    matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', applyTheme);
    applyTheme();
    render();
    (0, pwa_ts_1.registerServiceWorker)((apply) => {
        updateApply = apply;
        render();
    });
}
};

// ── main.tsx
defs["main.js"] = function (require, exports, module) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const App_tsx_1 = require("./App.js");
const store_ts_1 = require("./store.js");
async function start() {
    const root = document.getElementById('app');
    if (!root)
        return;
    try {
        await (0, store_ts_1.initStore)();
    }
    catch (e) {
        console.error(e);
    }
    (0, App_tsx_1.mountApp)(root);
    window.den365Ready = true;
}
void start();
};

var cache = {};
function load(name) {
  var hit = cache[name];
  if (hit) return hit.exports;
  var def = defs[name];
  if (!def) throw new Error('Модуль не знайдено: ' + name);
  var module = (cache[name] = { exports: {} });
  def(function (dep) { return load(dep.replace(/^\.\//, '')); }, module.exports, module);
  return module.exports;
}
load('main.js');
})();
