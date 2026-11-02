// main.tsx — точка входу: відкрити локальне сховище й показати застосунок.
import { mountApp } from './App.tsx';
import { initStore } from './store.ts';

declare global {
  interface Window {
    /** Позначка для сторожа запуску в index.html: застосунок стартував. */
    den365Ready?: boolean;
  }
}

async function start(): Promise<void> {
  const root = document.getElementById('app');
  if (!root) return;
  try {
    await initStore();
  } catch (e) {
    console.error(e);
  }
  mountApp(root);
  window.den365Ready = true;
}

void start();
