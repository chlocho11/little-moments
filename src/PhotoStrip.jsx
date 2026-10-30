import { forwardRef } from 'react';
import { Camera, X } from 'lucide-react';
import { layouts, filters } from './data';
import { StickerArt } from './Stickers';

const PhotoStrip = forwardRef(function PhotoStrip({ draft, miniature = false, editable = false, onStickers, onReplace }, ref) {
  const layout = layouts.find(l => l.id === draft.layout) || layouts[0];
  const dark = ['#8b3f43', '#292522'].includes(draft.frame);
  function moveSticker(event, sticker) {
    if (!editable || event.target.closest('.remove-sticker')) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const bounds = event.currentTarget.parentElement.getBoundingClientRect();
    const startX = event.clientX, startY = event.clientY;
    const node = event.currentTarget;
    function move(e) {
      const x = Math.max(3, Math.min(97, sticker.x + (e.clientX - startX) / bounds.width * 100));
      const y = Math.max(3, Math.min(97, sticker.y + (e.clientY - startY) / bounds.height * 100));
      onStickers(items => items.map(s => s.id === sticker.id ? { ...s, x, y } : s));
    }
    function stop() { node.removeEventListener('pointermove', move); node.removeEventListener('pointerup', stop); node.removeEventListener('pointercancel', stop); }
    node.addEventListener('pointermove', move); node.addEventListener('pointerup', stop); node.addEventListener('pointercancel', stop);
  }
  return <div ref={ref} className={`photo-strip ${draft.layout} ${miniature ? 'miniature' : ''} ${dark ? 'dark-frame' : ''}`} style={{ background: draft.frame, color: dark ? '#fff9ee' : '#49352f' }}>
    <div className="strip-top">little moments <span>♡</span></div>
    <div className="photo-slots">{Array.from({ length: layout.count }, (_, i) => <div className="photo-slot" key={i}>
      {draft.photos[i] ? <img src={draft.photos[i]} alt={`Moment ${i + 1}`} style={{ filter: filters[draft.filter] }} draggable="false"/> : <div className="empty-slot"><Camera size={miniature ? 14 : 25}/>{!miniature && <span>Your moment {i+1}</span>}</div>}
      {onReplace && draft.photos[i] && <button className="replace-photo" onClick={() => onReplace(i)} aria-label={`Replace photo ${i+1}`}>Replace</button>}
    </div>)}</div>
    <div className={`strip-caption ${draft.textStyle}`}>{draft.caption || '\u00a0'}</div>
    {draft.showDate && <div className="strip-date">{draft.date}</div>}
    {draft.stickers.map(s => <div className={`placed-sticker ${editable ? 'is-editable' : ''}`} key={s.id} style={{ left: `${s.x}%`, top: `${s.y}%`, transform: `translate(-50%,-50%) rotate(${s.rotate || 0}deg)` }} onPointerDown={e => moveSticker(e, s)}>
      <StickerArt type={s.type}/>{editable && <button className="remove-sticker" aria-label={`Remove ${s.type} sticker`} onClick={() => onStickers(items => items.filter(item => item.id !== s.id))}><X size={11}/></button>}
    </div>)}
  </div>;
});
export default PhotoStrip;
