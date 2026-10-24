// Continuous opening: face -> full body -> sunset promenade -> modern city.
// Every mark uses the existing p5.brush medium, palette and paper compositor.
// Ordinary walking keeps both eyes visible in the original drawn quarter view.
function journeyState(t){
  const u=17,x=700+35*t,pull=ease(seg(t,.35,3.8));
  const heading={view:'q',flip:false,smear:0},walk=35*t/(4*u),armSwing=.13*Math.sin(walk*TAU);
  const mood=emotions(t,[[0,'sad',{emote:null,lookX:.15,lookY:.22}],[4.06,'sad',{emote:null,lookX:.35,lookY:.18}],
    [12.06,'hopeful',{emote:null,lookX:.55}],[13.2,'sad',{emote:null,lookY:.25}],
    [15.06,'sad',{emote:'cloud',lookY:.3}],[17.3,'bored',{emote:null}],[19.1,'determined',{emote:null,lookX:.65}]],{take:.45});
  return {x,y:GROUND,u,pull,cam:{cx:x+lerp(1.5*u,88,pull),cy:lerp(GROUND-5.2*u,614,pull),zoom:lerp(4.5,1.05,pull)},
    pose:{...mood,...heading,walk,dy:(mood.dy||0)*.28-.22*Math.abs(Math.sin(walk*Math.PI)),boilKey:"coast-hero",aL:-.32+armSwing,aR:-.32-armSwing,swMul:Math.min(1,1.8/lerp(4.5,1.05,pull))}};
}
function sunsetSky(t,L){
  skyWash(L,t);
  const left=CAM.cx-W/(2*CAM.zoom),sx=CAM.cx+W*.035/CAM.zoom,sy=320+3.4*t;
  // A low sun is the emotional centre of this opening; it belongs to the far sky layer.
  sunDisk(sx,sy,148,.98);
  boilSeed('sunset-islands');
  for(let i=0;i<3;i++)paint(ellPts(left+420+i*600,571+i*3,370,45-i*8,24,1.8),{wash:mixCol(L.far,L.sky,.36),fill:L.far,fillOp:48,bleed:.22,tex:.5,ink:null});
}
function paintedPalm(x,base,height,t,seed){
  const topX=x-24,topY=base-height,brown=mixCol(PAL.ochre,PAL.ink,.55);
  boilSeed('palm-trunk'+seed);
  const trunk=[[x,base],[x-4,base-height*.3],[x-14,base-height*.64],[topX,topY]];
  paint(ribbon(trunk,22,12),{wash:brown,fill:mixCol(brown,LOOK.dusk.far,.25),fillOp:60,tex:.75,bleed:.1,ink:PAL.ink,sw:.42});
  inkLine([[x-4,base-8],[x-13,base-height*.55],[topX-3,topY+8]],.65,mixCol(PAL.cream,brown,.57),'dry',.2);
  for(let i=1;i<8;i++){
    const q=i/8,cx=x-24*q,cy=base-height*q;boilSeed('palm-ring'+seed+'-'+i);
    inkLine([[cx-8+q*2,cy+3],[cx,cy+5],[cx+7-q*2,cy+2]],.6,mixCol(brown,PAL.ink,.22),'inkfine',.16);
  }
  const size=height*.54,leaf=mixCol(PAL.sap,PAL.ink,.22),directions=[[-1.19,.26],[-1.08,-.18],[-.80,-.59],[-.37,-.88],[.10,-.96],[.48,-.77],[.87,-.48],[1.12,-.05],[1.19,.30]];
  directions.forEach(([dx,dy],i)=>{
    const breeze=.024*Math.sin(t*.8+i*.7+seed),tip=[topX+size*(dx+breeze),topY+size*(dy+breeze*.8)],control=[topX+size*dx*.45,topY+size*(dy*.44-.27)];
    const at=q=>[(1-q)**2*topX+2*(1-q)*q*control[0]+q*q*tip[0],(1-q)**2*topY+2*(1-q)*q*control[1]+q*q*tip[1]],spine=Array.from({length:7},(_,k)=>at(k/6));
    const featherEdge=side=>Array.from({length:11},(_,j)=>{
      const q=j/10,p=at(q),a=at(Math.max(0,q-.025)),b=at(Math.min(1,q+.025)),vx=b[0]-a[0],vy=b[1]-a[1],len=Math.hypot(vx,vy),width=1+size*.073*Math.sin(q*Math.PI)**.78;
      return [p[0]-vy/len*width*side,p[1]+vx/len*width*side];
    });
    const outer=featherEdge(1),inner=featherEdge(-1);
    boilSeed('palm-frond'+seed+'-'+i);
    paint([...outer,...inner.slice(1,-1).reverse()],{wash:leaf,washOp:205,fill:mixCol(PAL.sap,PAL.cream,.08),fillOp:60,bleed:.10,tex:.75,ink:null,curv:.22});
    inkLine(spine,.48,mixCol(leaf,PAL.cream,.16),'inkfine',.12);
    for(let j=1;j<=5;j++){
      const q=j/6,p=at(q),a=at(q-.025),b=at(q+.025),vx=b[0]-a[0],vy=b[1]-a[1],len=Math.hypot(vx,vy),nx=-vy/len,ny=vx/len,l=size*.145*Math.sin(q*Math.PI)**.8;
      for(const side of[-1,1]){
        boilSeed('palm-leaflet'+seed+'-'+i+'-'+j+'-'+side);
        inkLine([p,[p[0]+nx*l*side*.62-vx*.5,p[1]+ny*l*side*.62-vy*.5],[p[0]+nx*l*side-vx,p[1]+ny*l*side-vy+3]],.58,mixCol(leaf,PAL.sap,.26+q*.1),'inkfine',.14);
      }
    }
  });
  for(let i=0;i<3;i++){
    boilSeed('coconut'+seed+'-'+i);
    paint(ellPts(topX+(i-1)*10,topY+10+(i%2)*5,8,10,14,.8),{wash:mixCol(PAL.ochre,PAL.ink,.48),fill:brown,fillOp:45,tex:.7,ink:PAL.ink,sw:.35});
  }
}

function beachPromenade(t,L){
  seaBand(L,t,560,{sunX:CAM.cx+W*.035/CAM.zoom,foam:false});coastalGulls(t,L);
  boilSeed('promenade-sand');
  paint(rectPts(-500,770,4000,145),{wash:L.sand,fill:mixCol(L.sand,PAL.ochre,.25),fillOp:55,tex:.65,bleed:.12,ink:null});
  shoreFoam(L,t,560);
  for(let i=0;i<7;i++){
    const x=120+i*185;if(x>1240)continue;boilSeed('beach-grass'+i);
    for(let j=0;j<3;j++)inkLine([[x+j*4,864],[x-7+j*7+3*Math.sin(t*.9+i),842-j*6]],.45,mixCol(PAL.sap,L.far,.4),'inkfine',.4);
  }
  paintedPalm(240,857,278,t,2);paintedPalm(1070,857,252,t,3);
  // One fixed railing separates the sand from the promenade, and the curb separates pedestrians from cars.
  boilSeed('sea-rail');
  for(let x=-200;x<1260;x+=150)inkLine([[x,858],[x,805]],1.2,mixCol(L.rail,L.sky,.25),'ink',.15);
  inkLine([[-200,805],[600,805],[1260,805]],.9,mixCol(L.rail,L.sky,.25),'ink',.05);
  inkLine([[-200,831],[600,831],[1260,831]],.75,mixCol(L.rail,L.sky,.25),'inkfine',.05);
}
const NEAR_TRAFFIC=[{start:2.6,duration:3.5,dir:-1,kind:'car',w:650,h:330},{start:9.3,duration:3.8,dir:1,kind:'van',w:650,h:380},
  {start:16.1,duration:4.0,dir:-1,kind:'car',w:620,h:330},{start:24.0,duration:3.3,dir:1,kind:'car',w:630,h:300},
  ...[40.6,49.0,57.8,67.8,77.5,85.0].map((start,i)=>({start,duration:3.4,dir:i%2?-1:1,kind:i%3?'car':'van',w:660,h:i%3?310:350}))];
function nearTrafficState(t){
  return NEAR_TRAFFIC.filter(e=>t>=e.start&&t<=e.start+e.duration).map((e,i)=>{
    const p=(t-e.start)/e.duration,left=CAM.cx-W/(2*CAM.zoom),span=W/CAM.zoom;
    return {...e,i:NEAR_TRAFFIC.indexOf(e),p,x:e.dir>0?left-e.w-180+p*(span+e.w+360):left+span+180-p*(span+e.w+360),y:1058};
  });
}
function foregroundTraffic(t,L){
  for(const e of nearTrafficState(t)){
    boilSeed('near-traffic'+e.start);const x=e.x,y=e.y,w=e.w,h=e.h,shadow=mixCol(PAL.ink,L.road,.27),body=mixCol(PAL.ink,L.road,.08);
    // Wet pigment bleed and soft outlines give depth without replacing the watercolor with digital graphics.
    paint(ellPts(x+w*.5,y+3,w*.55,14,20,2),{fill:shadow,fillOp:78,bleed:.4,tex:.55,ink:null});
    const roof=e.kind==='van'?[[x+w*.17,y-h*.4],[x+w*.2,y-h],[x+w*.77,y-h],[x+w*.87,y-h*.4]]:
      [[x+w*.12,y-h*.42],[x+w*.3,y-h],[x+w*.66,y-h],[x+w*.86,y-h*.42]];
    paint(roof,{wash:body,washOp:140,fill:body,fillOp:130,bleed:.55,tex:.75,border:.06,ink:null,curv:.2});
    paint(rrPts(x,y-h*.47,w,h*.43,18,2),{wash:body,washOp:145,fill:body,fillOp:135,bleed:.52,tex:.75,border:.06,ink:null});
    for(const wx of[x+w*.22,x+w*.78])paint(ellPts(wx,y-15,46,44,20,1.5),{wash:body,washOp:130,fill:mixCol(shadow,PAL.ink,.15),fillOp:110,bleed:.5,ink:null});
    const glass=mixCol(body,L.road,.16);
    paint([[x+w*.34,y-h*.85],[x+w*.61,y-h*.85],[x+w*.73,y-h*.53],[x+w*.29,y-h*.53]],{fill:glass,fillOp:65,bleed:.4,ink:null});
    const head=e.dir>0?x+w-22:x+22;glow(head,y-h*.22,26,'#FFE3A0',.16);
  }
}
function shotJourney(t,lt,dur){
  const L=LOOK.dusk,s=journeyState(t);camBegin(s.cam.cx,s.cam.cy,s.cam.zoom);
  sunsetSky(t,L);beachPromenade(t,L);
  cityBlock(L,t,{first:3,last:10,waterfront:false});sidewalk(L);
  // Fixed fixtures advance only because the camera follows the walker.
  for(const x of[350,1450,2550])if(x>CAM.cx-W/CAM.zoom&&x<CAM.cx+W/CAM.zoom)lampPost(x,L,.5);
  bustleCars(L,t,.22);clawdPack(s.x,s.y,s.u,s.pose);streetBarrier(L,{start:1240});foregroundTraffic(t,L);
  const at=toScreen(s.x,s.y-5.5*s.u);camEnd();
  if(t<.62)iris(...at,lerp(0,1550,easeOut(t/.62)),PAL.night);
  boilSeed('wipe');if(lt>dur-.35)brushWipe((lt-(dur-.35))/.7,[PAL.clayDk,PAL.ochre]);
}
