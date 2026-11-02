// preview.mjs — локальний перегляд зібраного застосунку: http://localhost:4173/den365/
// Віддає корінь проєкту так само, як GitHub Pages віддає гілку main: з підкаталогом у адресі,
// щоб перевірити відносні шляхи й сервіс-воркер. Спершу виконай «npm run build».
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const base = '/den365/';
const port = Number(process.env.PORT) || 4173;
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
};

if (!existsSync(join(root, 'app.js'))) {
  console.error('Немає app.js. Спершу виконай «npm run build».');
  process.exit(1);
}

createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  if (!url.pathname.startsWith(base)) {
    res.writeHead(302, { Location: base });
    return res.end();
  }
  const rel = decodeURIComponent(url.pathname.slice(base.length)) || 'index.html';
  const file = normalize(join(root, rel));
  const hidden = rel.split('/').some((p) => p.startsWith('.') || p === 'node_modules');
  if (hidden || !file.startsWith(root + sep) || !existsSync(file) || statSync(file).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end('<!doctype html><title>404</title><h1>404</h1>');
  }
  res.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-cache' });
  res.end(readFileSync(file));
}).listen(port, () => console.log(`Перегляд: http://localhost:${port}${base}`));
