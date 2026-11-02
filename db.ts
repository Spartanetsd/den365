// db.ts — локальне сховище на пристрої: IndexedDB, а якщо воно недоступне — localStorage, далі — памʼять.
// Дані нікуди не надсилаються.
import type { DayRecord, Operation } from './types.ts';
import type { Change } from './actions.ts';

export interface Snapshot {
  ops: Operation[];
  days: DayRecord[];
  kv: Record<string, unknown>;
}

export interface Backend {
  kind: 'idb' | 'local' | 'memory';
  load(): Promise<Snapshot>;
  apply(c: Change): Promise<void>;
  replace(s: Snapshot): Promise<void>;
  getBackup(): Promise<unknown>;
  setBackup(v: unknown): Promise<void>;
}

function req<T>(r: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}

function done(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error ?? new Error('Транзакцію перервано'));
  });
}

function openIdb(name: string): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB недоступна'));
      return;
    }
    const r = indexedDB.open(name, 1);
    r.onupgradeneeded = () => {
      const db = r.result;
      if (!db.objectStoreNames.contains('ops')) db.createObjectStore('ops', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('days')) db.createObjectStore('days', { keyPath: 'date' });
      if (!db.objectStoreNames.contains('kv')) db.createObjectStore('kv');
      if (!db.objectStoreNames.contains('backups')) db.createObjectStore('backups');
    };
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
    r.onblocked = () => reject(new Error('База зайнята іншою вкладкою'));
  });
}

function idbBackend(db: IDBDatabase): Backend {
  return {
    kind: 'idb',
    async load() {
      const tx = db.transaction(['ops', 'days', 'kv'], 'readonly');
      const kvStore = tx.objectStore('kv');
      const [ops, days, keys, vals] = await Promise.all([
        req(tx.objectStore('ops').getAll() as IDBRequest<Operation[]>),
        req(tx.objectStore('days').getAll() as IDBRequest<DayRecord[]>),
        req(kvStore.getAllKeys()),
        req(kvStore.getAll()),
      ]);
      const kv: Record<string, unknown> = {};
      keys.forEach((k, i) => { kv[String(k)] = vals[i]; });
      return { ops, days, kv };
    },
    async apply(c) {
      const tx = db.transaction(['ops', 'days', 'kv'], 'readwrite');
      const ops = tx.objectStore('ops');
      const days = tx.objectStore('days');
      const kv = tx.objectStore('kv');
      for (const o of c.putOps ?? []) ops.put(o);
      for (const id of c.delOps ?? []) ops.delete(id);
      for (const d of c.putDays ?? []) days.put(d);
      for (const [k, v] of Object.entries(c.kv ?? {})) kv.put(v, k);
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
      for (const o of s.ops) ops.put(o);
      for (const d of s.days) days.put(d);
      for (const [k, v] of Object.entries(s.kv)) kv.put(v, k);
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

function localBackend(name: string, storage: Storage): Backend {
  const read = <T>(k: string, fallback: T): T => {
    const raw = storage.getItem(`${name}:${k}`);
    return raw ? (JSON.parse(raw) as T) : fallback;
  };
  const write = (k: string, v: unknown) => storage.setItem(`${name}:${k}`, JSON.stringify(v));
  return {
    kind: 'local',
    async load() {
      return { ops: read<Operation[]>('ops', []), days: read<DayRecord[]>('days', []), kv: read<Record<string, unknown>>('kv', {}) };
    },
    async apply(c) {
      if (c.putOps?.length || c.delOps?.length) {
        const map = new Map(read<Operation[]>('ops', []).map((o) => [o.id, o] as const));
        for (const o of c.putOps ?? []) map.set(o.id, o);
        for (const id of c.delOps ?? []) map.delete(id);
        write('ops', [...map.values()]);
      }
      if (c.putDays?.length) {
        const map = new Map(read<DayRecord[]>('days', []).map((d) => [d.date, d] as const));
        for (const d of c.putDays) map.set(d.date, d);
        write('days', [...map.values()]);
      }
      if (c.kv && Object.keys(c.kv).length) write('kv', { ...read<Record<string, unknown>>('kv', {}), ...c.kv });
    },
    async replace(s) {
      write('ops', s.ops);
      write('days', s.days);
      write('kv', s.kv);
    },
    async getBackup() {
      return read<unknown>('backup', undefined);
    },
    async setBackup(v) {
      write('backup', v);
    },
  };
}

function memoryBackend(): Backend {
  let snap: Snapshot = { ops: [], days: [], kv: {} };
  let backup: unknown;
  return {
    kind: 'memory',
    async load() { return snap; },
    async apply(c) {
      const ops = new Map(snap.ops.map((o) => [o.id, o] as const));
      for (const o of c.putOps ?? []) ops.set(o.id, o);
      for (const id of c.delOps ?? []) ops.delete(id);
      const days = new Map(snap.days.map((d) => [d.date, d] as const));
      for (const d of c.putDays ?? []) days.set(d.date, d);
      snap = { ops: [...ops.values()], days: [...days.values()], kv: { ...snap.kv, ...(c.kv ?? {}) } };
    },
    async replace(s) { snap = s; },
    async getBackup() { return backup; },
    async setBackup(v) { backup = v; },
  };
}

/** Відкриває найкраще доступне сховище. */
export async function openBackend(name: string): Promise<Backend> {
  try {
    const db = await openIdb(name);
    const b = idbBackend(db);
    await b.load();
    return b;
  } catch {
    try {
      const ls = globalThis.localStorage;
      ls.setItem(`${name}:probe`, '1');
      ls.removeItem(`${name}:probe`);
      return localBackend(name, ls);
    } catch {
      return memoryBackend();
    }
  }
}

/** Просить браузер не видаляти дані автоматично (коли це підтримується). */
export async function requestPersistence(): Promise<boolean | null> {
  try {
    const s = (navigator as Navigator & { storage?: StorageManager }).storage;
    if (!s?.persist) return null;
    if (s.persisted && (await s.persisted())) return true;
    return await s.persist();
  } catch {
    return null;
  }
}

export async function isPersisted(): Promise<boolean | null> {
  try {
    const s = (navigator as Navigator & { storage?: StorageManager }).storage;
    return s?.persisted ? await s.persisted() : null;
  } catch {
    return null;
  }
}
