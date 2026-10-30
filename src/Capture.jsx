import { useEffect, useRef, useState } from 'react';
import { Camera, Upload, RotateCcw, ArrowRight, ImagePlus } from 'lucide-react';
import { layouts, samplePhotos } from './data';
import PhotoStrip from './PhotoStrip';

export async function readPhoto(file) {
  if (!file.type.startsWith('image/')) throw new Error('Please choose a JPG, PNG, or another image file.');
  if (file.size > 25 * 1024 * 1024) throw new Error('That photo is a little large. Please choose one under 25 MB.');
  const source = await new Promise((resolve,reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = () => reject(new Error('This photo could not be read.')); reader.readAsDataURL(file); });
  const image = await new Promise((resolve,reject) => { const img = new Image(); img.onload = () => resolve(img); img.onerror = () => reject(new Error('This photo format could not be opened. Try JPG or PNG.')); img.src = source; });
  const ratio = Math.min(1, 1600 / Math.max(image.width,image.height));
  const canvas = document.createElement('canvas'); canvas.width = Math.round(image.width*ratio); canvas.height = Math.round(image.height*ratio);
  canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);
  return canvas.toDataURL('image/jpeg',.9);
}

export default function Capture({ draft, setDraft, mode, setMode, onNext, report }) {
  const count = layouts.find(l=>l.id===draft.layout).count;
  const [cameraReady,setCameraReady] = useState(false), [busy,setBusy] = useState(false), [countdown,setCountdown] = useState(null), [flash,setFlash] = useState(false);
  const input = useRef(), replaceIndex = useRef(null), video = useRef(), stream = useRef(), alive = useRef(true), activeMode = useRef(mode);
  activeMode.current = mode;
  useEffect(()=>{ alive.current = true; return ()=>{ alive.current = false; stream.current?.getTracks().forEach(t=>t.stop()); }; },[]);
  useEffect(()=>{ if(mode !== 'camera') { stream.current?.getTracks().forEach(t=>t.stop()); stream.current=null; setCameraReady(false); } },[mode]);
  async function startCamera() {
    try {
      if(!navigator.mediaDevices?.getUserMedia) throw new Error('No camera available');
      const media = await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:1280},audio:false});
      if(!alive.current || activeMode.current !== 'camera' || !video.current) { media.getTracks().forEach(t=>t.stop()); return; }
      stream.current = media; video.current.srcObject=media; await video.current.play(); setCameraReady(true);
    } catch { report('Your camera couldn’t open. You can still make something lovely with uploaded photos.'); setMode('upload'); }
  }
  async function upload(event) {
    const files = [...event.target.files]; event.target.value=''; if(!files.length) return;
    setBusy(true);
    try {
      const photos = await Promise.all(files.slice(0,replaceIndex.current !== null ? 1 : count-draft.photos.length).map(readPhoto));
      const index = replaceIndex.current;
      setDraft(d=>({...d,photos:index !== null ? d.photos.map((p,i)=>i===index?photos[0]:p) : [...d.photos,...photos].slice(0,count)}));
    } catch(e) { report(e.message); } finally { setBusy(false); replaceIndex.current=null; }
  }
  async function capture() {
    if(!cameraReady || busy) return; setBusy(true);
    const captured=[...draft.photos];
    for(let i=captured.length;i<count;i++) {
      for(let n=3;n>0;n--) { if(!alive.current) return; setCountdown(n); await new Promise(r=>setTimeout(r,1000)); }
      if(!alive.current || !video.current) return;
      setCountdown(null); setFlash(true);
      const canvas=document.createElement('canvas'); canvas.width=video.current.videoWidth; canvas.height=video.current.videoHeight;
      const ctx=canvas.getContext('2d'); ctx.translate(canvas.width,0);ctx.scale(-1,1);ctx.drawImage(video.current,0,0);
      captured.push(canvas.toDataURL('image/jpeg',.9)); setDraft(d=>({...d,photos:[...captured]}));
      await new Promise(r=>setTimeout(r,220)); if(!alive.current) return; setFlash(false);
    }
    setBusy(false);
  }
  function replace(i) { replaceIndex.current=i;input.current.click(); }
  return <div className="capture-layout"><div className="capture-main"><div className="segmented"><button className={mode==='upload'?'active':''} onClick={()=>setMode('upload')} disabled={busy}><Upload size={16}/> Upload photos</button><button className={mode==='camera'?'active':''} onClick={()=>setMode('camera')} disabled={busy}><Camera size={16}/> Take photos</button></div>
    <input ref={input} type="file" accept="image/*" multiple onChange={upload} hidden aria-label="Upload your photos"/>
    {mode==='upload'?<div className="upload-area" onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();upload({target:{files:e.dataTransfer.files,value:''}});}}><div className="upload-illustration"><ImagePlus size={48} strokeWidth={1.2}/><span className="handwritten">your favorite people,<br/>places & little things</span></div><h3>A few photos, a whole feeling.</h3><p>Drop your photos here, or pick them from your device.<br/>JPG, PNG and other browser-supported images · up to 25 MB each</p><button className="button primary" onClick={()=>{replaceIndex.current=null; input.current.click();}} disabled={busy || draft.photos.length>=count}><Upload size={17}/>{busy?'Opening photos…':'Choose photos'}</button><button className="text-button sample-button" onClick={()=>setDraft(d=>({...d,photos:samplePhotos.slice(0,count)}))}>Try with sample photos</button><small>Sample photos are for trying out the booth.</small></div>:<div className={`camera-area ${flash?'capture-flash':''}`}><video ref={video} muted playsInline autoPlay className="camera-video"/>{!cameraReady&&<div className="camera-prompt"><Camera size={45}/><h3>Ready for your close-up?</h3><p>Your camera stays right here in your browser.</p><button className="button primary" onClick={startCamera}>Enable camera</button></div>}{countdown&&<div className="countdown" aria-live="assertive">{countdown}</div>}{cameraReady&&<div className="camera-status">{draft.photos.length<count?`Photo ${Math.min(draft.photos.length+1,count)} of ${count}`:'All your moments, captured ♡'}</div>}</div>}
    {mode==='camera'&&cameraReady&&<button className="button primary capture-button" onClick={capture} disabled={busy||draft.photos.length>=count}><Camera size={18}/>{busy?'Hold that pose…':`Capture ${count-draft.photos.length} photo${count-draft.photos.length===1?'':'s'}`}</button>}
    </div><aside className="capture-preview"><span className="handwritten">your memories, taking shape</span><PhotoStrip draft={draft} onReplace={replace}/><div className="photo-progress" aria-live="polite">{draft.photos.length} of {count} photos added</div><button className="text-button" disabled={!draft.photos.length||busy} onClick={()=>setDraft(d=>({...d,photos:[]}))}><RotateCcw size={14}/> Start photos over</button><button className="button primary" onClick={onNext} disabled={draft.photos.length!==count||busy}>Make it yours <ArrowRight size={17}/></button></aside></div>;
}
