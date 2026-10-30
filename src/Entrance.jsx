import { ArrowRight, Heart, Camera, Sparkles, Pin } from 'lucide-react';
import PhotoStrip from './PhotoStrip';
import { newDraft, samplePhotos } from './data';
import { StickerArt } from './Stickers';

export default function Entrance({ onEnter, onBoard, opening }) {
  const sample = { ...newDraft(), photos: samplePhotos, frame: '#e8a5b5', caption: 'the good little things', showDate: false };
  return <main className="entrance">
    <div className="welcome-heading"><span className="handwritten welcome-whisper">a place for your favorite days</span><h1>Little moments.<br className="mobile-break"/> Lasting memories.</h1><p>Capture the moment. Make it yours. Keep it close.</p></div>
    <div className="booth-stage">
      <div className="stage-left" aria-hidden="true"><span className="hanging-string"/><div className="hanging-polaroid"><span className="wood-clip"/><img src={samplePhotos[1]} alt=""/><span>the days we’ll remember</span></div><div className="little-note"><span className="tape"/>no occasion needed.<br/>just you, being you.<Heart size={23}/></div><svg className="curly-arrow" viewBox="0 0 150 70"><path d="M8 12C49 78 124 57 107 27C92 1 66 56 140 46m-14-10 16 11-16 10"/></svg></div>
      <div className={`physical-booth ${opening ? 'opening' : ''}`}>
        <div className="booth-sign"><span className="sign-stars">✦</span><div>LITTLE MOMENTS<small>PHOTO BOOTH · MADE FOR YOU</small></div><span className="sign-stars">✦</span><div className="bulbs">{Array.from({length:11},(_,i)=><i key={i}/>)}</div></div>
        <div className="booth-body"><div className="booth-side left"><div className="booth-photo one"><img src={samplePhotos[0]} alt="Decorative sample portrait"/></div><div className="booth-photo two"><img src={samplePhotos[1]} alt="Decorative sample of time together"/></div><span className="welcome-label">welcome ♡</span></div><button className="curtain-door" onClick={onEnter} aria-label="Open the curtains and enter the photobooth"><span className="curtain left-curtain"/><span className="curtain right-curtain"/><span className="door-invite"><Camera size={26}/><span>Come on in</span><small>A memory awaits <ArrowRight size={13}/></small></span></button><div className="booth-side right"><div className="price-note">ADMIT ONE<span>you + your<br/>favorite people</span><Heart size={16}/></div><div className="coin-slot"/><span className="booth-side-text">GOOD TIMES<br/>THIS WAY</span></div></div>
        <div className="booth-base"><div className="print-slot"/><span>TAKE A LITTLE MEMORY HOME</span></div><div className="booth-feet"><i/><i/></div>
      </div>
      <div className="stage-right" aria-hidden="true"><span className="handwritten strip-label">a little strip of happiness</span><div className="sample-strip"><span className="tape"/><PhotoStrip draft={sample} miniature/></div><StickerArt type="Bow" className="stage-bow"/><span className="handwritten right-note">made by you.<br/>kept forever.</span><Sparkles className="stage-sparkles" size={34}/></div>
    </div>
    <div className="entrance-actions"><button className="button primary enter-button" onClick={onEnter} disabled={opening}>Enter the booth <ArrowRight size={18}/></button><button className="text-button" onClick={onBoard}><Pin size={16}/> Visit my memory board</button><span className="handwritten enter-caption">Step inside, a memory awaits ♡</span></div>
    <div className="how-it-works"><span><Camera size={19}/> Strike a pose</span><i/><span><Sparkles size={19}/> Make it yours</span><i/><span><Heart size={19}/> Keep it close</span></div>
  </main>;
}
