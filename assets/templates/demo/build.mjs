import{spawn}from'node:child_process';import{readFileSync}from'node:fs';
const args=Object.fromEntries(process.argv.slice(2).map(a=>{const[k,...v]=a.replace(/^--/,'').split('=');return[k,v.join('=')];}));
const run=a=>new Promise((ok,bad)=>{const p=spawn(process.execPath,a,{stdio:'inherit'});p.on('error',bad);p.on('close',c=>c?bad(Error('Render exit '+c)):ok());});
const chrome=args.chrome||process.env.CHROME_PATH,extra=chrome?['--chrome='+chrome]:[],dur=Number(readFileSync('src/config.js','utf8').match(/duration:\s*([\d.]+)/)[1]),count=Math.ceil(dur*24),dir=args['frames-dir']||'out/frames';
for(let first=0;first<count;first+=144)await run(['render.mjs','--frames','--workers=2','--recycle-every=72','--frames-dir='+dir,'--range='+first/24+':'+Math.min(count,first+144)/24,...extra]);
await run(['render.mjs','--encode','--frames-dir='+dir,'--ffmpeg='+(args.ffmpeg||process.env.FFMPEG_PATH||'ffmpeg'),'--out='+(args.out||'out/video.mp4'),...(args.audio?['--audio='+args.audio]:[])]);
