// build.mjs — збирання для GitHub Pages без сторонніх інструментів (лише компілятор TypeScript).
// Перед ним «npm run build» перевіряє типи (tsc). Далі цей скрипт:
//   • перекладає кожен потрібний *.ts / *.tsx у JavaScript і складає їх в один файл app.js;
//   • перевіряє, що кожен імпортований файл існує;
//   • обчислює версію за вмістом і проставляє її в index.html (?v=…) та в sw.js (назва кешу й перелік файлів).
// Після збирання корінь репозиторію — готовий сайт: GitHub Pages публікує його просто з гілки main.
// Оновлення з iPhone — лише app.js, index.html і sw.js (плюс змінені вихідні файли, якщо хочеш тримати їх актуальними).
// Повторний запуск дає той самий результат. «node build.mjs --site» ще й копіює сайт у _site/ (для GitHub Actions).
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = dirname(fileURLToPath(import.meta.url));
const at = (f) => join(root, f);
const read = (f) => readFileSync(at(f), 'utf8');
const fail = (msg) => {
  console.error(msg);
  process.exit(1);
};

const STATIC = [
  'styles.css',
  'manifest.webmanifest',
  'favicon.svg',
  'icon-192.png',
  'icon-512.png',
  'icon-maskable-512.png',
  'apple-touch-icon.png',
];
for (const f of [...STATIC, 'index.html', 'sw.js', 'main.tsx']) if (!existsSync(at(f))) fail(`Бракує файлу ${f}.`);

// Налаштування JSX і цільової версії JavaScript беремо з tsconfig.json, щоб не дублювати.
const { config, error } = ts.readConfigFile(at('tsconfig.json'), ts.sys.readFile);
if (error) fail(ts.flattenDiagnosticMessageText(error.messageText, '\n'));
const base = ts.parseJsonConfigFileContent(config, ts.sys, root).options;
const options = {
  target: base.target,
  jsx: base.jsx,
  jsxFactory: base.jsxFactory,
  jsxFragmentFactory: base.jsxFragmentFactory,
  module: ts.ModuleKind.CommonJS,
  rewriteRelativeImportExtensions: true,
  removeComments: true,
  isolatedModules: true,
  newLine: ts.NewLineKind.LineFeed,
};

// 1. Модулі, досяжні від main.tsx, у порядку залежностей.
const REQUIRE = /\brequire\("\.\/([^"/]+)\.js"\)/g;
const sourceOf = (name) => [`${name}.ts`, `${name}.tsx`].find((f) => existsSync(at(f)));
const modules = []; // { name, file, code }
const seen = new Set();
const visit = (name, from) => {
  if (seen.has(name)) return;
  seen.add(name);
  const file = sourceOf(name);
  if (!file) fail(`Бракує ${name}.ts або ${name}.tsx (його імпортує ${from}).`);
  const out = ts.transpileModule(read(file), { fileName: file, compilerOptions: options });
  const code = out.outputText.trim();
  for (const hit of code.matchAll(REQUIRE)) visit(hit[1], file);
  modules.push({ name, file, code });
};
visit('main', 'index.html');

// 2. Один файл: маленький завантажувач модулів + усі модулі в обгортках (як у CommonJS).
const app = [
  '/* ДЕНЬ × 365 — зібраний застосунок. Згенеровано build.mjs із *.ts / *.tsx; не редагуй вручну — зміни вихідний файл і виконай «npm run build». */',
  '(function () {',
  "'use strict';",
  'var defs = {};',
  ...modules.map((m) => `\n// ── ${m.file}\ndefs[${JSON.stringify(m.name + '.js')}] = function (require, exports, module) {\n${m.code}\n};`),
  '',
  'var cache = {};',
  'function load(name) {',
  '  var hit = cache[name];',
  '  if (hit) return hit.exports;',
  '  var def = defs[name];',
  "  if (!def) throw new Error('Модуль не знайдено: ' + name);",
  '  var module = (cache[name] = { exports: {} });',
  '  def(function (dep) { return load(dep.replace(/^\\.\\//, \'\')); }, module.exports, module);',
  '  return module.exports;',
  '}',
  "load('main.js');",
  '})();',
  '',
].join('\n');

// 3. Версія за вмістом (без уже проставлених міток — тому повторне збирання стабільне).
const VQ = /\?v=[0-9a-f]+/g;
const STYLE_REF = /href="\.\/styles\.css(?:\?v=[0-9a-f]+)?"/;
const APP_REF = /src="\.\/app\.js(?:\?v=[0-9a-f]+)?"/;
const SW_VERSION = /^const VERSION = .*;$/m;
const SW_ASSETS = /^const ASSETS = [\s\S]*?\];$/m;

let html = read('index.html');
let sw = read('sw.js');
if (!STYLE_REF.test(html) || !APP_REF.test(html)) fail('index.html: бракує посилань на ./styles.css або ./app.js.');
if (!SW_VERSION.test(sw) || !SW_ASSETS.test(sw)) fail('sw.js: бракує рядків «const VERSION = …;» і «const ASSETS = […];».');

const hash = createHash('sha256');
const feed = (name, data) => {
  hash.update(`${name}\0`);
  hash.update(data);
  hash.update('\0');
};
feed('app.js', app);
for (const f of STATIC) feed(f, readFileSync(at(f)));
feed('index.html', html.replace(VQ, ''));
feed('sw.js', sw.replace(SW_VERSION, '').replace(SW_ASSETS, ''));
const v = hash.digest('hex').slice(0, 10);
const withV = (p) => `${p}?v=${v}`;

// 4. Запис: app.js, index.html (посилання з версією), sw.js (назва кешу й перелік файлів для офлайну).
writeFileSync(at('app.js'), app);
html = html
  .replace(STYLE_REF, () => `href="${withV('./styles.css')}"`)
  .replace(APP_REF, () => `src="${withV('./app.js')}"`);
writeFileSync(at('index.html'), html);

const assets = [
  './',
  './index.html',
  withV('./app.js'),
  withV('./styles.css'),
  ...STATIC.filter((f) => f !== 'styles.css').map((f) => './' + f),
];
sw = sw
  .replace(SW_VERSION, () => `const VERSION = ${JSON.stringify('den365-' + v)};`)
  .replace(SW_ASSETS, () => `const ASSETS = ${JSON.stringify(assets, null, 2)};`);
writeFileSync(at('sw.js'), sw);

// GitHub Pages не має пропускати файли через Jekyll.
if (!existsSync(at('.nojekyll'))) writeFileSync(at('.nojekyll'), '');

const site = ['index.html', 'app.js', 'sw.js', '.nojekyll', ...STATIC];
if (process.argv.includes('--site')) {
  const out = at('_site');
  rmSync(out, { recursive: true, force: true });
  mkdirSync(out);
  for (const f of site) copyFileSync(at(f), join(out, f));
  console.log(`Скопійовано в _site/: ${site.length} файлів.`);
}

const kb = (n) => `${(n / 1024).toFixed(0)} КБ`;
const total = site.reduce((s, f) => s + readFileSync(at(f)).length, 0);
console.log(`Готово: app.js із ${modules.length} модулів (${kb(Buffer.byteLength(app))}), сайт — ${site.length} файлів, ${kb(total)}, версія ${v}.`);
