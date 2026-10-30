export const layouts = [
  { id: 'classic', name: 'The classic', count: 4, description: 'Four poses. Endless memories.' },
  { id: 'grid', name: 'Better together', count: 4, description: 'A little square of happiness.' },
  { id: 'duo', name: 'Just the two', count: 2, description: 'Some things come in pairs.' },
  { id: 'polaroid', name: 'One sweet moment', count: 1, description: 'One photo, a whole feeling.' },
];
export const frames = [ ['Paper white', '#fffdf7'], ['Dusty pink', '#e8a5b5'], ['Vintage red', '#8b3f43'], ['Sage green', '#dce8d2'], ['Midnight', '#292522'], ['Lavender', '#d9c9e9'] ];
export const filters = { Original: 'none', 'Black & White': 'grayscale(1)', Sepia: 'sepia(.8)', Warm: 'sepia(.25) saturate(1.25)', Vintage: 'sepia(.35) contrast(.88) saturate(.75)' };
export const samplePhotos = [1,2,3,4].map(n => `/photos/moment-${n}.jpg`);
export const newDraft = () => ({ layout: 'classic', photos: [], frame: '#fffdf7', filter: 'Original', caption: 'a little moment, forever', textStyle: 'handwritten', date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }), showDate: true, stickers: [] });
