// r4: a tangled head -> the sun's mental magic -> a profile silhouette on a great bridge -> city daydream.
const CITY_DREAM_START=38.12;
// Each curl is rebuilt from time, so the thought knot actively churns instead of merely boiling like hair.
function tanglePoints(u,t,seed=0){
  const pts=[];
  for(let i=0;i<73;i++){
    const a=i*.67+t*3.4,phase=i*.19+seed,rx=1.6+.52*Math.sin(t*5.3+phase),ry=.58+.23*Math.sin(t*4.7-phase);
    pts.push([(rx*Math.sin(a)+.55*Math.sin(a*2.3-t*6.2)+.3*Math.sin(t*7+phase))*u,
      (-9.4+ry*Math.cos(a*1.7+t*2.9)+.19*Math.sin(t*8+i*.46))*u]);
  }return pts;
}
function headTangle(u,t,seed=0){
  if(TANGLE_SELECTION!=='pending'){drawSoftTangle(u,t,TANGLE_SELECTION,seed);return;}
  const settle=1-ease(seg(t,27.1,28));if(settle<.02)return;
  boilSeed('head-tangle'+seed);const pts=tanglePoints(u,t,seed).map(([x,y])=>[x*settle,y]);
  inkLine(pts,.8*settle,mixCol(PAL.ink,PAL.indigo,.13),'inkfine',.16);
  for(let i=0;i<3;i++){
    const x=(-2.3+i*2.3)*u,y=(-9.2+.15*Math.sin(t*6+i))*u;
    inkLine([[x,y],[x+(.3+.23*Math.sin(t*9+i))*u,y-(.6+.22*Math.sin(t*7+i))*u],[x+.55*u,y-.14*u]],.58*settle,PAL.ink,'inkfine',.1);
  }
}
function wishTeleportSpark(t,s,pose){
  if(t>=28.8&&t<=30.92){
    const sun=sunGreetingState(t,journeyState(t)),p={x:sun.x,y:sun.y-sun.r-75};
    wishCloudBurst(t,28.8,p,21,1);
    wishCloudBurst(t,30.2,p,22,.85);
    wishCloudBurst(t,30.2,wishHand(s,pose),23,.8);
  }
  if(t<30.12||t>30.67)return;
  const a=seg(t,30.12,30.67),hand=wishHand(s,pose),sun=sunGreetingState(t,journeyState(t)),k=Math.sin(a*Math.PI);
  for(const [j,p]of[[0,hand],[1,{x:sun.x,y:sun.y-sun.r-75}]]){
    boilSeed('wish-teleport'+j);
    glow(p.x,p.y,95*k,'#FFE9A8',.35*k);
    for(let i=0;i<6;i++){
      const ang=i/6*TAU+.16*t,r=12+66*a;
      paint(starPts(p.x+Math.cos(ang)*r,p.y+Math.sin(ang)*r,3+9*k,.3,4),{wash:PAL.cream,washOp:235*(1-a),ink:null});
    }
  }
}
function bridgeWalkerState(t){
  const lt=t-34.82,u=13,dark=mixCol(PAL.ink,PAL.clayDk,.14);
  return {x:610+76*lt,y:810,u,cam:{cx:960,cy:540,zoom:1},
    pose:{view:'side',quickPass:true,col:dark,dk:dark,lt:dark,noShadow:true,noPack:true,walk:76*lt/(4*u),aL:.84,aR:0,
      dy:-.10*Math.abs(Math.sin(76*lt/(4*u)*Math.PI)),rot:.045,eyes:'closed',mouth:'line',lookY:.4,boilKey:'coast-hero',swMul:.75,
      drawBehind:(uu,sw)=>{boilSeed('bridge-shadow-pack');paint(rrPts(-4.85*uu,-7.2*uu,2.5*uu,4.3*uu,.35*uu),{wash:dark,ink:dark,sw:sw*.55});}}};
}
function suspensionBridge(t){
  const dark=mixCol(PAL.ink,PAL.clayDk,.16),deck=810,towers=[320,1600],cableY=x=>x<320?180+(320-x)*.62:x>1600?180+(x-1600)*.62:180+310*(1-((x-960)/640)**2);
  const pts=[];for(let x=-100;x<=2020;x+=25)pts.push([x,cableY(x)]);
  boilSeed('suspension-cable');inkLine(pts,1.3,dark,'inkfine',.08);inkLine(pts.map(([x,y])=>[x,y+13]),.8,dark,'inkfine',.08);
  for(let x=-70;x<1990;x+=52){boilSeed('bridge-hanger'+x);const top=cableY(x);inkLine([[x,top+13],[x,(top+13+deck)/2],[x,deck]],.44,dark,'inkfine',0);}
  for(const [i,x]of towers.entries()){
    boilSeed('bridge-tower'+i);
    for(const dx of[-31,31])paint(rectPts(x+dx-10,142,20,deck-142,.5),{wash:dark,ink:null});
    for(const y of[164,270,410,600])paint(rectPts(x-41,y,82,17,.3),{wash:dark,ink:null});
    paint(rectPts(x-47,deck-20,94,29,.4),{wash:dark,ink:null});
  }
  // Deck and supports form one stationary structure. The walker moves across it.
  boilSeed('bridge-deck');paint(rectPts(-60,deck,2040,59),{wash:dark,ink:null});
  inkLine([[-60,deck-8],[960,deck-8],[1980,deck-8]],.7,mixCol(PAL.cream,dark,.62),'inkfine',0);
  for(const x of[320,970,1600]){
    boilSeed('bridge-pier'+x);paint(rectPts(x-35,deck+58,70,260),{wash:dark,ink:null});paint(rrPts(x-62,1060,124,18,4),{wash:dark,ink:null});
  }
  for(let x=130;x<1920;x+=250){
    boilSeed('bridge-small-lamp'+x);inkLine([[x,deck],[x,deck-42],[x+9,deck-44]],.7,dark,'inkfine',.05);
    paint([[x+4,deck-42],[x+12,deck-42],[x+29,deck-3],[x-12,deck-3]],{fill:PAL.ochre,fillOp:75,bleed:.45,tex:.7,ink:null});
    glow(x+9,deck-42,14,'#FFC766',.18);
  }
}
function shotWishBridge(t,lt,dur){
  const s=bridgeWalkerState(t),L={...LOOK.dusk,sky:mixCol(LOOK.fantasy.sky,LOOK.dusk.sky,.32),sea:mixCol(LOOK.dusk.sea,LOOK.dusk.sky,.55)};
  camBegin(960,540,1);skyWash(L,t);sunDisk(960,lerp(419,452,ease(seg(lt,0,dur))),258,.98);
  for(let i=0;i<3;i++){
    boilSeed('bridge-sunset-cloud'+i);paint(ellPts(450+i*440,245+i*80,185,10,32,1),{fill:LOOK.dusk.far,fillOp:55,bleed:.35,tex:.8,ink:null});
  }
  seaBand(L,t,650,{sunX:960,foam:false});
  // Extend water below the high deck; distant coast is behind the suspension structure.
  boilSeed('bridge-water-under');paint(rectPts(-60,850,2040,290),{wash:L.sea,fill:L.far,fillOp:30,tex:.7,ink:null});
  for(let i=0;i<16;i++){
    const y=880+i*12;boilSeed('bridge-under-ripple'+i);inkLine([[-60,y],[960,y+2*Math.sin(t*.6+i)],[1980,y]],.3,mixCol(PAL.cream,L.sea,.7),'inkfine',.06);
  }
  suspensionBridge(t);drawCoastHero(t,s,s.pose);camEnd();flushLetters();
  boilSeed('wipe');if(lt<.35)brushWipe(.5+lt/.7,['#C45C6A','#E8A878']);if(lt>dur-.35)brushWipe((lt-(dur-.35))/.7,['#C45C6A','#E8A878']);
}
// 38.63–49.63 = exactly 11 seconds at the original example's speed, with no time warp.
const DREAM_START=38.63,DREAM_END=49.63;
function dreamTime(t){return clamp(t-DREAM_START,0,11);}
function cityDreamState(t){
  const u=17,x=2130+35*(t-CITY_DREAM_START),walk=35*(t-CITY_DREAM_START)/(4*u),fade=1-ease(seg(t,89.8,90.4));
  return {x,y:GROUND,u,cam:{cx:x+88,cy:614,zoom:1.05},
    pose:{view:'q',walk,aL:-.24+.16*Math.sin(walk*TAU),aR:.18,dy:-.18*Math.abs(Math.sin(walk*Math.PI)),
      eyes:'look',mouth:'smile',lookX:.55,lookY:-1.1,blush:.10,boilKey:'coast-hero',swMul:.8}};
}
function cloudDream(t,head){
  if(t<DREAM_START||t>=DREAM_END)return;
  const k=backOut(seg(t,DREAM_START,DREAM_START+.65)),cx=1120,cy=370,rx=630*k,ry=310*k;
  if(k<.01)return;
  const outline=thoughtCloudPts(cx,cy,630,310).map(([x,y])=>[cx+(x-cx)*k,cy+(y-cy)*k]);
  for(let i=0;i<3;i++){
    const q=(i+1)/4;boilSeed('dream-link'+i);
    paint(ellPts(lerp(head[0]+20,cx-290,q),lerp(head[1]-20,cy+330,q),(6+i*5)*k,(6+i*5)*k,14,.25),{wash:PAL.cream,washOp:205,ink:mixCol(PAL.ink,PAL.cream,.5),sw:.4});
  }
  boilSeed('night-cloud-border');paint(outline,{wash:PAL.cream,ink:mixCol(PAL.ink,PAL.paper,.5),sw:.65,curv:.12});flushBrush();
  // Stencil clipping includes watercolor fills, ink AND glow. All original example drawing remains native.
  push();beginClip();noStroke();fill(255);beginShape();for(const p of outline)vertex(...p);endShape(CLOSE);endClip();
  const scaleK=.53*k;translate(cx-W*scaleK/2,cy-H*scaleK/2);scale(scaleK);
  const oldT=T,oldCam=CAM,oldLast=LAST_CAM,oldN=CLAWD_N;
  try{T=dreamTime(t);FALLEN_STAR.draw(T);flushBrush();}
  finally{T=oldT;CAM=oldCam;LAST_CAM=oldLast;CLAWD_N=oldN;pop();}
  // A cream rim follows the cloud contour, distinct from the city but painted with the same ink.
  boilSeed('night-cloud-rim');paint(outline,{ink:PAL.cream,sw:1.2,curv:.12});
}
function shotCityDaydream(t,lt,dur){
  const s=cityDreamState(t),night=ease(seg(t,72,88)),L=Object.fromEntries(Object.entries(LOOK.dusk).map(([key,v])=>[key,typeof v==='string'?mixCol(v,LOOK.night[key],night):lerp(v,LOOK.night[key],night)]));
  camBegin(s.cam.cx,s.cam.cy,s.cam.zoom);skyWash(L,t);cityBlock(L,t,{waterfront:false});sidewalk(L);
  const bounds=worldBounds();for(let x=Math.floor(bounds.left/1050)*1050+320;x<bounds.right;x+=1050)lampPost(x,L,.9);
  drawCoastHero(t,s,s.pose);streetBarrier(L);foregroundTraffic(t,L);
  const head=toScreen(s.x,s.y-8*s.u);camEnd();cloudDream(t,head);flushLetters();
  boilSeed('wipe');if(lt<.35)brushWipe(.5+lt/.7,['#C45C6A','#E8A878']);

}
