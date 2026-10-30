import { test } from 'node:test';
import assert from 'node:assert/strict';
import 'fake-indexeddb/auto';
import { saveMemory, getMemories, deleteMemory } from '../src/storage.js';

test('photos, notes and board position survive reopening and updates', async () => {
  const memory = { id: 'keepsake', photos: ['data:image/jpeg;base64,abc'], caption: 'Us, always', note: '', x: 20, y: 30 };
  await saveMemory(memory);
  assert.deepEqual(await getMemories(), [memory]);
  await saveMemory({ ...memory, note: 'A lovely day', x: 47 });
  const [saved] = await getMemories();
  assert.equal(saved.note, 'A lovely day');
  assert.equal(saved.x, 47);
  assert.deepEqual(saved.photos, memory.photos);
});

test('deleting a memory removes its photo data', async () => {
  await deleteMemory('keepsake');
  assert.deepEqual(await getMemories(), []);
});
