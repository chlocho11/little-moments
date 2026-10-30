export const stickerNames = ['Heart', 'Star', 'Bow', 'Flower', 'Sparkle', 'Cherry'];
export function StickerArt({ type, ...props }) {
  return <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" {...props}>
    {type === 'Heart' && <path d="M32 53C20 44 7 35 9 22C11 9 27 9 32 21C39 8 55 10 56 24C57 37 42 46 32 53Z" fill="#d98094" stroke="#8b3f43" strokeWidth="2"/>}
    {type === 'Star' && <path d="m32 6 7 17 19 2-15 13 5 19-16-10-17 10 5-19L5 25l19-2Z" fill="#efd088" stroke="#a37c3c" strokeWidth="2"/>}
    {type === 'Bow' && <g stroke="#9c586b" strokeWidth="2"><path d="M28 29C5 6 1 29 9 38c5 4 14 0 20-3M36 29C59 6 63 29 55 38c-5 4-14 0-20-3" fill="#e8a5b5"/><path d="m28 33-8 23-6-6-6 2 16-22m12 3 8 23 6-6 6 2-16-22" fill="#e8a5b5"/><ellipse cx="32" cy="32" rx="7" ry="6" fill="#f0c0cc"/></g>}
    {type === 'Flower' && <g fill="#e8a5b5" stroke="#ae7380" strokeWidth="1.5">{[0,60,120,180,240,300].map(a=><ellipse key={a} cx="32" cy="17" rx="9" ry="13" transform={`rotate(${a} 32 32)`}/>)}<circle cx="32" cy="32" r="8" fill="#efd088"/></g>}
    {type === 'Sparkle' && <g fill="#eac168" stroke="#ac8546" strokeWidth="1.5"><path d="M29 6q2 22 19 25-17 3-19 26-2-23-19-26Q27 28 29 6Z"/><path d="M51 5q1 9 8 11-7 1-8 10-1-9-8-10 7-2 8-11Z"/></g>}
    {type === 'Cherry' && <g strokeWidth="2"><path d="M20 40Q23 8 43 8Q48 27 45 43M43 8q-17-3-20 8 13 4 20-8" stroke="#68815a"/><circle cx="18" cy="45" r="11" fill="#ae5055" stroke="#803b40"/><circle cx="45" cy="47" r="11" fill="#c06369" stroke="#803b40"/><path d="m12 40 4-3m23 5 4-3" stroke="#f4c7c2" strokeLinecap="round"/></g>}
  </svg>;
}
