const database = () => new Promise((resolve, reject) => {
  const request = indexedDB.open('little-moments', 1);
  request.onupgradeneeded = () => request.result.createObjectStore('memories', { keyPath: 'id' });
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error);
});

async function transaction(mode, operation) {
  const db = await database();
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction('memories', mode);
      const request = operation(tx.objectStore('memories'));
      tx.oncomplete = () => resolve(request.result);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error || new Error('Saving was interrupted.'));
    });
  } finally { db.close(); }
}

export const getMemories = () => transaction('readonly', store => store.getAll());
export const saveMemory = memory => transaction('readwrite', store => store.put(memory));
export const deleteMemory = id => transaction('readwrite', store => store.delete(id));
