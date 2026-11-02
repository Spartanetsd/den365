// main.tsx — точка входу: відкрити локальне сховище й показати застосунок.
import { mountApp } from './App.tsx';
import { initStore } from './store.ts';

async function start(): Promise<void> {
  const root = document.getElementById('app');
  if (!root) return;
  try {
    await initStore();
  } catch (e) {
    console.error(e);
  }
  mountApp(root);
}

void start();
