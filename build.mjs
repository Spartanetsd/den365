// build.mjs — збирання для GitHub Pages без сторонніх інструментів.
// Перед ним TypeScript компілює *.ts / *.tsx у dist/ (див. "build" у package.json).
// Тут: копіюються статичні файли, обчислюється версія за вмістом, до імпортів додається ?v=версія
// (щоб браузер не змішав старі й нові файли), генерується сервіс-воркер зі списком файлів.
import { copyFileSync, existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, 'dist');

if (!existsSync(join(dist, 'main.js'))) {
  console.error('dist/main.js не знайдено. Запусти «npm run build» — він спершу компілює TypeScript.');
  process.exit(1);
}

const STATIC = [
  'index.html',
  'styles.css',
  'manifest.webmanifest',
  'favicon.svg',
  'icon-192.png',
  'icon-512.png',
  'icon-maskable-512.png',
  'apple-touch-icon.png',
];
for (const f of STATIC) {
  if (!existsSync(join(root, f))) {
    console.error(`Бракує файлу ${f}`);
    process.exit(1);
  }
  copyFileSync(join(root, f), join(dist, f));
}

const files = readdirSync(dist)
  .filter((f) => statSync(join(dist, f)).isFile() && f !== 'sw.js')
  .sort();

const hash = createHash('sha256');
for (const f of files) {
  hash.update(f);
  hash.update(readFileSync(join(dist, f)));
}
const v = hash.digest('hex').slice(0, 10);

const jsFiles = files.filter((f) => f.endsWith('.js'));
const withV = (p) => `${p}?v=${v}`;
for (const f of jsFiles) {
  const p = join(dist, f);
  const src = readFileSync(p, 'utf8');
  const out = src.replace(/(\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)(["'])(\.\/[^"']+\.js)\2/g, (_m, lead, q, path) => `${lead}${q}${withV(path)}${q}`);
  writeFileSync(p, out);
}

let html = readFileSync(join(dist, 'index.html'), 'utf8');
const preload = jsFiles.map((f) => `  <link rel="modulepreload" href="${withV('./' + f)}">`).join('\n');
html = html
  .replace('href="./styles.css"', `href="${withV('./styles.css')}"`)
  .replace('src="./main.js"', `src="${withV('./main.js')}"`)
  .replace('</head>', `${preload}\n</head>`);
writeFileSync(join(dist, 'index.html'), html);

const assets = [
  './',
  './index.html',
  withV('./styles.css'),
  ...jsFiles.map((f) => withV('./' + f)),
  ...files.filter((f) => !f.endsWith('.js') && f !== 'index.html' && f !== 'styles.css').map((f) => './' + f),
];
const sw = readFileSync(join(root, 'sw.js'), 'utf8')
  .replace("'__VERSION__'", JSON.stringify('den365-' + v))
  .replace('__ASSETS__', JSON.stringify(assets, null, 2));
writeFileSync(join(dist, 'sw.js'), sw);

const size = files.reduce((s, f) => s + statSync(join(dist, f)).size, 0);
console.log(`Готово: dist/ — ${files.length + 1} файлів, ${(size / 1024).toFixed(0)} КБ, версія ${v}.`);
