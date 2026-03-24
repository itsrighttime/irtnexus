const DB_NAME = "GenericFormDB";
const STORE_NAME = "formFiles";

const openDB = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const request: IDBOpenDBRequest = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

export const saveFile = async (
  key: string,
  file: Blob | File,
): Promise<boolean> => {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  tx.objectStore(STORE_NAME).put(file, key);

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
};

export const loadFile = async (key: string): Promise<Blob | File | null> => {
  const db = await openDB();

  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const request: IDBRequest = tx.objectStore(STORE_NAME).get(key);

    request.onsuccess = () => resolve(request.result ?? null);
    request.onerror = () => resolve(null);
  });
};

export const deleteFile = async (key: string): Promise<boolean> => {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  tx.objectStore(STORE_NAME).delete(key);

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
};
