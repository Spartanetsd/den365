// icons.ts — власний набір контурних значків 24×24 (без сторонніх бібліотек).

const SVG_NS = 'http://www.w3.org/2000/svg';

const P: Record<string, string> = {
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

export function icon(name: string, size = 22, cls = ''): SVGSVGElement {
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

export const ICON_NAMES = Object.keys(P);
