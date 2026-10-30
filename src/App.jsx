import { useCallback, useEffect, useRef, useState } from 'react';
import { Camera, Heart, ArrowLeft, ArrowRight, Pin, Check, X, Home } from 'lucide-react';
import Entrance from './Entrance';
import Capture from './Capture';
import Editor from './Editor';
import PhotoStrip from './PhotoStrip';
import MemoryBoard, { MemoryDetail } from './MemoryBoard';
import { layouts, newDraft } from './data';
import { getMemories, saveMemory, deleteMemory } from './storage';

export default function App() {
  const [screen,setScreen]=useState('welcome'),[draft,setDraft]=useState(newDraft),[mode,setMode]=useState('upload'),[opening,setOpening]=useState(false),[memories,setMemories]=useState([]),[detailId,setDetailId]=useState(null),[freshId,setFreshId]=useState(null),[busy,setBusy]=useState(false),[message,setMessage]=useState(null),[exportDraft,setExportDraft]=useState(null);
  const exportRef=useRef(),messageTimer=useRef(),enterTimer=useRef();
  const report=useCallback((text,error=true)=>{setMessage({text,error});clearTimeout(messageTimer.current);messageTimer.current=setTimeout(()=>setMessage(null),6500);},[]);
  useEffect(()=>{getMemories().then(setMemories).catch(()=>report('Your saved board couldn’t open. Please enable browser storage and try again.'));return()=>{clearTimeout(messageTimer.current);clearTimeout(enterTimer.current);};},[report]);
  useEffect(()=>{window.scrollTo({top:0,behavior:'instant'});},[screen]);
  function enter() { if(opening)return;setOpening(true);enterTimer.current=setTimeout(()=>{setScreen('layout');setOpening(false);},window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:720); }
  function create() {setDraft(newDraft());setScreen('layout');setFreshId(null);}
  async function update(memory) {try{await saveMemory(memory);setMemories(items=>items.map(m=>m.id===memory.id?memory:m));return true;}catch{report('That change couldn’t be saved. Your browser storage may be full.');return false;} }
  async function pin() {setBusy(true);try{const memory={...draft,id:crypto.randomUUID(),note:'',x:8+(memories.length%4)*21,y:9+(Math.floor(memories.length/4)%3)*17,rotation:(memories.length%2?1:-1)*(2+Math.random()*3)};await saveMemory(memory);setMemories(items=>[...items,memory]);setFreshId(memory.id);setScreen('board');report('Another little moment worth keeping ♡',false);}catch{report('Your memory couldn’t be saved. Browser storage may be full. You can still download it.');}finally{setBusy(false);} }
  async function remove(id) {setBusy(true);try{await deleteMemory(id);setMemories(items=>items.filter(m=>m.id!==id));setDetailId(null);report('Memory removed from your board.',false);}catch{report('Your memory couldn’t be removed. Please try again.');}finally{setBusy(false);} }
  async function download(memory=draft) {setBusy(true);try{
    setExportDraft(memory);await new Promise(r=>setTimeout(r,80));await document.fonts.ready;
    const node=exportRef.current;if(!node)throw new Error('Preview unavailable');
    await Promise.all([...node.querySelectorAll('img')].map(img=>img.decode()));
    const {toPng}=await import('html-to-image');const data=await toPng(node,{pixelRatio:3,cacheBust:false,backgroundColor:memory.frame});
    const link=document.createElement('a');link.download=`little-moments-${memory.id?.slice(0,8)||'my-keepsake'}.png`;link.href=data;link.click();report('Your little keepsake is ready to download ♡',false);
  }catch(e){console.error('Export failed:',e);report('The download couldn’t finish. Please try again once your photos have loaded.');}finally{setBusy(false);setExportDraft(null);} }
  const closeDetail=useCallback(()=>setDetailId(null),[]), detail=memories.find(m=>m.id===detailId);
  const currentStep=screen==='layout'?0:screen==='capture'?1:2;
  return <div className="app-shell"><header className="site-header"><button className="brand" onClick={()=>setScreen('welcome')} aria-label="Little Moments home"><span className="brand-camera"><Camera size={22}/><Heart size={10} className="camera-heart"/></span><span>little moments<span className="brand-period">.</span></span></button><nav aria-label="Main navigation"><button className={screen!=='board'?'nav-link active':'nav-link'} onClick={()=>setScreen('welcome')}><Camera size={15}/> The photobooth</button><button className={screen==='board'?'nav-link active':'nav-link'} onClick={()=>setScreen('board')}><Pin size={15}/> My memory board{memories.length>0&&<span className="memory-count">{memories.length}</span>}</button></nav><span className="header-note handwritten">made for the memories ♡</span></header>
    {screen==='welcome'?<Entrance onEnter={enter} onBoard={()=>setScreen('board')} opening={opening}/>:screen==='board'?<MemoryBoard memories={memories} onCreate={create} onOpen={m=>setDetailId(m.id)} onUpdate={update} freshId={freshId}/>:<main className="studio"><div className="studio-top"><button className="text-button back-button" onClick={()=>setScreen(screen==='layout'?'welcome':screen==='capture'?'layout':'capture')}><ArrowLeft size={16}/> Back</button><ol className="flow-steps">{['Choose your layout','Capture a moment','Make it yours'].map((label,i)=><li key={label} className={i===currentStep?'current':i<currentStep?'complete':''}><span>{i<currentStep?<Check size={13}/>:i+1}</span>{label}</li>)}</ol><span className="studio-top-end"><Heart size={17}/></span></div>
      <div className="studio-title"><span className="handwritten">{screen==='layout'?'every story has a shape':screen==='capture'?'no perfect poses required':'a little more you'}</span><h1>{screen==='layout'?'Pick your little keepsake.':screen==='capture'?'Let’s make a moment.':'Make it yours.'}</h1><p>{screen==='layout'?'Four ways to hold onto a good day. Which one feels like you?':screen==='capture'?'Bring your favorite photos, or make a few new ones.':'A favorite color, a few stickers, a little something to say.'}</p></div>
      {screen==='layout'?<><div className="template-grid">{layouts.map((layout,i)=><button className={`template-card ${draft.layout===layout.id?'selected':''}`} aria-pressed={draft.layout===layout.id} key={layout.id} onClick={()=>setDraft(d=>({...d,layout:layout.id,photos:d.photos.slice(0,layout.count)}))}><span className="template-selected">{draft.layout===layout.id?<Check size={14}/>:null}</span><div className={`template-paper paper-${i}`}><PhotoStrip draft={{...draft,layout:layout.id,photos:[],caption:layout.id==='polaroid'?'one sweet moment':'little moments',frame:['#fffdf7','#e8a5b5','#dce8d2','#fffdf7'][i],showDate:false,stickers:[]}} miniature/></div><h3>{layout.name}</h3><p>{layout.description}</p><span className="photo-count">{layout.count} photo{layout.count>1?'s':''}</span></button>)}</div><div className="layout-bottom"><div><span className="handwritten">your story, your way ♡</span><p>{layouts.find(l=>l.id===draft.layout).count} photos · Unlimited little possibilities</p></div><div className="layout-actions"><button className="button secondary" onClick={()=>{setMode('camera');setScreen('capture');}}><Camera size={17}/> Take photos</button><button className="button primary" onClick={()=>{setMode('upload');setScreen('capture');}}>Upload photos <ArrowRight size={17}/></button></div></div></>:screen==='capture'?<Capture draft={draft} setDraft={setDraft} mode={mode} setMode={setMode} onNext={()=>setScreen('editor')} report={report}/>:<Editor draft={draft} setDraft={setDraft} onDownload={()=>download()} onPin={pin} busy={busy}/>}
    </main>}
    <footer className="site-footer"><span>a tiny space for the things that matter.</span><span>Made with a little love <Heart size={12}/></span></footer>
    {detail&&<MemoryDetail key={detail.id} memory={detail} onClose={closeDetail} onUpdate={update} onDelete={remove} onDownload={download} busy={busy}/>}
    {message&&<div className={`toast ${message.error?'error':''}`} role={message.error?'alert':'status'}>{message.error?<Camera size={18}/>:<Heart size={18}/>}<span>{message.text}</span><button aria-label="Dismiss message" onClick={()=>setMessage(null)}><X size={16}/></button></div>}
    {exportDraft&&<div className="export-stage" aria-hidden="true"><PhotoStrip ref={exportRef} draft={exportDraft}/></div>}
  </div>;
}
