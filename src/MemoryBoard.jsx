import { useEffect, useRef, useState } from 'react';
import { Plus, Shuffle, X, Download, Trash2, Heart, Move, Check, ArrowRight } from 'lucide-react';
import PhotoStrip from './PhotoStrip';
import { StickerArt } from './Stickers';

export function MemoryDetail({ memory, onClose, onUpdate, onDelete, onDownload, busy }) {
  const dialog=useRef(); const [note,setNote]=useState(memory.note||''),[confirm,setConfirm]=useState(false),[saved,setSaved]=useState(false);
  useEffect(()=>{ const node=dialog.current;node.showModal(); const cancel=e=>{e.preventDefault();onClose();};node.addEventListener('cancel',cancel);return()=>{node.removeEventListener('cancel',cancel);node.close();}; },[onClose]);
  return <dialog ref={dialog} className="memory-dialog" onClick={e=>{if(e.target===e.currentTarget)onClose();}} aria-labelledby="memory-title"><button className="icon-button close-dialog" aria-label="Close memory" onClick={onClose}><X/></button><div className="detail-photo"><PhotoStrip draft={memory}/></div><div className="detail-copy"><span className="handwritten">a little piece of your story</span><h2 id="memory-title">{memory.caption||'A moment worth keeping'}</h2><p className="memory-date">{memory.date}</p><label className="field-label" htmlFor="memory-note">What do you want to remember?</label><textarea id="memory-note" maxLength={600} value={note} onChange={e=>{setNote(e.target.value);setSaved(false);}} placeholder="The place, the people, the feeling…"/><button className="text-button" disabled={busy} onClick={async()=>{if(await onUpdate({...memory,note}))setSaved(true);}}>{saved?<Check size={16}/>:<Plus size={16}/>} {saved?'Note saved':'Save my note'}</button><div className="position-controls"><span><Move size={14}/> Position on board</span><label>Across<input type="range" min="0" max="78" value={memory.x} onChange={e=>onUpdate({...memory,x:+e.target.value})}/></label><label>Down<input type="range" min="5" max="62" value={memory.y} onChange={e=>onUpdate({...memory,y:+e.target.value})}/></label></div><button className="button secondary" disabled={busy} onClick={()=>onDownload(memory)}><Download size={16}/> Download PNG</button>{confirm?<div className="delete-confirm"><p>Remove this memory from your board?<br/>This cannot be undone.</p><button className="button danger" disabled={busy} onClick={()=>onDelete(memory.id)}>Yes, remove it</button><button className="text-button" onClick={()=>setConfirm(false)}>Keep this memory</button></div>:<button className="text-button delete-button" onClick={()=>setConfirm(true)}><Trash2 size={14}/> Remove from board</button>}</div></dialog>;
}

function BoardMemory({ memory, onOpen, onUpdate, fresh }) {
  const drag=useRef(null), memoryNode=useRef(null);
  useEffect(()=>{
    const node=memoryNode.current;
    const observer=new ResizeObserver(()=>node.style.setProperty('--memory-height',`${node.offsetHeight}px`));
    observer.observe(node);
    return()=>observer.disconnect();
  },[]);
  function start(e) {
    if(e.button!==0)return;
    const node=e.currentTarget,bounds=node.parentElement.getBoundingClientRect();
    drag.current={x:e.clientX,y:e.clientY,moved:false}; node.setPointerCapture(e.pointerId);
    function move(event) {
      if(Math.hypot(event.clientX-drag.current.x,event.clientY-drag.current.y)>5)drag.current.moved=true;
      if(!drag.current.moved)return;
      const x=Math.max(0,Math.min((bounds.width-node.offsetWidth)/bounds.width*100,memory.x+(event.clientX-drag.current.x)/bounds.width*100));
      const y=Math.max(5,Math.min((bounds.height-node.offsetHeight)/bounds.height*100,memory.y+(event.clientY-drag.current.y)/bounds.height*100));
      node.style.left=`${x}%`;node.style.top=`${y}%`;
    }
    function stop(event) {
      node.removeEventListener('pointermove',move);node.removeEventListener('pointerup',stop);node.removeEventListener('pointercancel',stop);
      if(drag.current?.moved){onUpdate({...memory,x:parseFloat(node.style.left),y:parseFloat(node.style.top)});setTimeout(()=>{drag.current=null;},0);} else drag.current=null;
    }
    node.addEventListener('pointermove',move);node.addEventListener('pointerup',stop);node.addEventListener('pointercancel',stop);
  }
  return <button ref={memoryNode} className={`board-memory memory-${memory.layout} ${fresh?'freshly-pinned':''}`} style={{left:`clamp(8px, ${memory.x}%, calc(100% - var(--memory-width) - 8px))`,top:`clamp(25px, ${memory.y}%, calc(100% - var(--memory-height) - 20px))`,'--rotation':`${memory.rotation||-3}deg`}} onPointerDown={start} onClick={()=>{if(!drag.current?.moved)onOpen(memory);}} aria-label={`Open memory: ${memory.caption||memory.date}`}><span className="pushpin"/><PhotoStrip draft={memory} miniature/><span className="board-memory-hint">open this moment <ArrowRight size={12}/></span></button>;
}

export default function MemoryBoard({ memories, onCreate, onOpen, onUpdate, freshId }) {
  return <main className="board-page"><div className="board-heading"><div><span className="handwritten">the good days belong here</span><h1>My memory board</h1><p>A collection of little moments that mean a lot.</p></div><div className="board-actions"><button className="button secondary" disabled={!memories.length} onClick={()=>onOpen(memories[Math.floor(Math.random()*memories.length)])}><Shuffle size={16}/> Surprise me</button><button className="button primary" onClick={onCreate}><Plus size={18}/> Make a memory</button></div></div>
    <div className="board-frame"><div className="corkboard"><div className="board-string first-string"/><div className="board-string second-string"/><div className="board-note"><span className="tape"/><span>collect moments,<br/>not things.</span><Heart size={29}/></div><StickerArt type="Flower" className="board-flower"/><StickerArt type="Cherry" className="board-cherries"/>
    {!memories.length&&<div className="empty-board"><div className="empty-polaroid"><span className="wood-clip"/><Heart size={45} strokeWidth={1}/><span>your story starts here</span></div><h2>Room for your little moments.</h2><p>Make your first photo strip and pin it here.<br/>Someday, you’ll be glad you did.</p><button className="button primary" onClick={onCreate}><Plus size={17}/> Make my first memory</button></div>}
    {memories.map(memory=><BoardMemory key={memory.id} memory={memory} onOpen={onOpen} onUpdate={onUpdate} fresh={freshId===memory.id}/>)}</div></div><div className="board-footer"><span>{memories.length} little {memories.length===1?'memory':'memories'} kept close</span><span><Move size={14}/> Drag to rearrange · Click to remember</span><span>Saved on this browser <Heart size={13}/></span></div>
  </main>;
}
