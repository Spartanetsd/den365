// pwa.ts — сервіс-воркер: офлайн-робота й оновлення без втрати даних (дані живуть в IndexedDB, не в кеші).

export function registerServiceWorker(onUpdate: (apply: () => void) => void): void {
  if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
  let requested = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (requested) location.reload();
  });
  navigator.serviceWorker
    .register('./sw.js')
    .then((reg) => {
      const offer = (w: ServiceWorker) =>
        onUpdate(() => {
          requested = true;
          w.postMessage({ type: 'SKIP_WAITING' });
        });
      if (reg.waiting && navigator.serviceWorker.controller) offer(reg.waiting);
      reg.addEventListener('updatefound', () => {
        const w = reg.installing;
        if (!w) return;
        w.addEventListener('statechange', () => {
          if (w.state === 'installed' && navigator.serviceWorker.controller) offer(w);
        });
      });
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') reg.update().catch(() => {});
      });
    })
    .catch(() => {
      // без сервіс-воркера застосунок теж працює, лише без офлайн-режиму
    });
}
