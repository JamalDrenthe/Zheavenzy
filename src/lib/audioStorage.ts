const DB_NAME = 'zheavenzy_audio_db';
const STORE_NAME = 'audio_files';
const DB_VERSION = 1;

// In-memory cache for synchronous, zero-latency access during click events
const memoryAudioUrlCache = new Map<string, string>();
const memoryBlobCache = new Map<string, Blob>();

let dbPromise: Promise<IDBDatabase> | null = null;

function openDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB niet beschikbaar'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => {
      dbPromise = null;
      reject(request.error);
    };
  });

  return dbPromise;
}

/**
 * Synchronous in-memory audio URL lookup for zero latency click events.
 */
export function getAudioUrlSync(trackId: string): string | null {
  return memoryAudioUrlCache.get(trackId) || null;
}

/**
 * Warms up audio storage cache on application startup.
 */
export async function initAudioStorage(): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.openCursor();

    request.onsuccess = () => {
      const cursor = request.result;
      if (cursor) {
        const trackId = String(cursor.key);
        const val = cursor.value;

        if (!memoryAudioUrlCache.has(trackId)) {
          if (val && typeof val === 'object' && 'buffer' in val) {
            const blob = new Blob([val.buffer], { type: val.type || 'audio/mpeg' });
            memoryBlobCache.set(trackId, blob);
            memoryAudioUrlCache.set(trackId, URL.createObjectURL(blob));
          } else if (val instanceof Blob) {
            memoryBlobCache.set(trackId, val);
            memoryAudioUrlCache.set(trackId, URL.createObjectURL(val));
          }
        }
        cursor.continue();
      }
    };
  } catch (err) {
    console.warn('Audio storage waarschuwing:', err);
  }
}

// Auto init in browser
if (typeof window !== 'undefined') {
  initAudioStorage().catch(() => {});
}

/**
 * Save user uploaded audio file to IndexedDB and cache in memory.
 */
export async function saveLocalAudioFile(trackId: string, file: File | Blob): Promise<string> {
  const db = await openDB();
  const buffer = await file.arrayBuffer();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const record = {
      buffer,
      type: file.type || 'audio/mpeg',
      savedAt: Date.now(),
    };
    const req = store.put(record, trackId);

    req.onsuccess = () => {
      const blob = new Blob([buffer], { type: record.type });
      memoryBlobCache.set(trackId, blob);
      const url = URL.createObjectURL(blob);
      memoryAudioUrlCache.set(trackId, url);
      resolve(url);
    };

    req.onerror = () => reject(req.error);
  });
}

/**
 * Retrieves local audio URL for a given track id.
 */
export async function getLocalAudioUrl(trackId: string): Promise<string | null> {
  if (memoryAudioUrlCache.has(trackId)) {
    return memoryAudioUrlCache.get(trackId)!;
  }

  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(trackId);

      req.onsuccess = () => {
        const val = req.result;
        if (!val) {
          resolve(null);
          return;
        }
        if (val && typeof val === 'object' && 'buffer' in val) {
          const blob = new Blob([val.buffer], { type: val.type || 'audio/mpeg' });
          memoryBlobCache.set(trackId, blob);
          const url = URL.createObjectURL(blob);
          memoryAudioUrlCache.set(trackId, url);
          resolve(url);
        } else if (val instanceof Blob) {
          memoryBlobCache.set(trackId, val);
          const url = URL.createObjectURL(val);
          memoryAudioUrlCache.set(trackId, url);
          resolve(url);
        } else {
          resolve(null);
        }
      };

      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Deletes local audio file by track id.
 */
export async function deleteLocalAudioFile(trackId: string): Promise<void> {
  try {
    if (memoryAudioUrlCache.has(trackId)) {
      URL.revokeObjectURL(memoryAudioUrlCache.get(trackId)!);
      memoryAudioUrlCache.delete(trackId);
      memoryBlobCache.delete(trackId);
    }
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(trackId);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // Ignore error
  }
}

export async function saveLocalCoverImage(_id: string, file: File | Blob): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}
