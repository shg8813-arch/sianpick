/**
 * Native IndexedDB Key-Value Store for SianPick
 * Provides large-scale storage (up to hundreds of megabytes / gigabytes)
 * bypassing browser localStorage 5MB quota restrictions.
 */

const DB_NAME = 'sianpick_storage_db';
const DB_VERSION = 1;
const STORE_NAME = 'project_store';

function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not available in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function idbGet<T>(key: string): Promise<T | null> {
  if (typeof window === 'undefined') return null;
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(key);

      request.onsuccess = () => resolve((request.result as T) ?? null);
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.warn('idbGet failed, falling back:', e);
    return null;
  }
}

export async function idbGetAll<T>(): Promise<T[]> {
  if (typeof window === 'undefined') return [];
  try {
    const db = await getDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve((request.result as T[]) || []);
      request.onerror = () => resolve([]);
    });
  } catch (e) {
    console.warn('idbGetAll warning:', e);
    return [];
  }
}

export async function idbSet(key: string, value: any): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(value, key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.warn('idbSet failed:', e);
  }
}

export async function idbDelete(key: string): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.warn('idbDelete failed:', e);
  }
}
