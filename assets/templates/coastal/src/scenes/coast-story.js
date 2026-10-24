// r4: a small shore walker, memories, and the sun materializing a wish before the bridge scene.
const COAST_END=34.82;
function crab(x,y,t,u=13,seed=0,water=false){
  boilSeed('crab'+seed);const col=mixCol(PAL.clay,PAL.ochre,.22),step=Math.sin(t*7+seed);
  paint(ellPts(x,y-5,u,u*.59,18,.6),{wash:col,washOp:water?160:235,fill:PAL.clayDk,fillOp:50,ink:PAL.ink,sw:.35});
  for(const side of[-1,1]){
    for(let j=0;j<3;j++)inkLine([[x+side*u*.55,y-j*3],[x+side*u*(1+.14*j),y-1-j*3],[x+side*u*(1.35+.14*j),y+4+step*(j%2?2:-2)]],.65,col,'inkfine',.16);
    inkLine([[x+side*u*.7,y-9],[x+side*u*1.35,y-16]],1.3,col,'ink',.2);
    paint(ellPts(x+side*u*1.4,y-18,u*.32,u*.39,12,.4),{wash:col,ink:PAL.ink,sw:.28});
    inkLine([[x+side*u*.4,y-10],[x+side*u*.4,y-16]],.65,col,'inkfine',0);
    paint(ellPts(x+side*u*.4,y-17,1.6,2,10,.1),{wash:PAL.ink,ink:null});
  }
}
function holidayBeach(t,L){
  const b=worldBounds();
  for(let i=Math.floor(b.left/800)-1;i<=Math.ceil(b.right/800);i++){
    const x=i*800+170;if(x<b.left-180||x>b.right+180)continue;
    paintedPalm(x,857,250+35*hash(i+97),t,i+20);
    const ux=x+290,uy=836;beachParasol(ux,uy,i,L);
    boilSeed('beach-blanket'+i);
    paint([[ux-75,uy+6],[ux+6,uy+6],[ux+26,uy+22],[ux-61,uy+22]],{wash:mixCol(L.sea,PAL.cream,.4),washOp:190,ink:null});
    crab(x+440+16*Math.sin(t*.24+i),838,t,12,i,false);
    crab(x+610+8*Math.sin(t*.35+i),743+3*Math.sin(t*.8),t,8,i+50,true);
  }
}
// Canopy, ribs and pole share one apex. Three-point strokes avoid the library's two-point spline dropout.
function beachParasol(ux,uy,i,L){
  const top=uy-150,rim=uy-108,col=i%2?mixCol(PAL.sap,PAL.cream,.35):mixCol(PAL.ochre,PAL.cream,.25);
  boilSeed('parasol-pole'+i);
  paint(rectPts(ux-1.7,top,3.4,uy-top,.1),{wash:mixCol(L.rail,PAL.ochre,.35),ink:null});
  paint(ellPts(ux,uy+1,14,2.8,16),{wash:L.rail,washOp:45,ink:null});
  for(let panel=0;panel<4;panel++){
    const l=ux-76+panel*38,r=l+38,pts=[[ux,top]];
    // Rounded outer dome to the edge, then a gently scalloped hem.
    for(let k=0;k<=6;k++){const q=k/6;pts.push([lerp(ux,r,q),lerp(top,rim,q)+7*Math.sin(q*Math.PI)]);}
    for(let k=1;k<=8;k++){const q=k/8;pts.push([lerp(r,l,q),rim+6*Math.sin(q*Math.PI)]);}
    for(let k=1;k<6;k++){const q=k/6;pts.push([lerp(l,ux,q),lerp(rim,top,q)+7*Math.sin(q*Math.PI)]);}
    boilSeed('parasol-panel'+i+'-'+panel);
    paint(pts,{wash:panel%2?mixCol(col,PAL.cream,.6):col,fill:PAL.cream,fillOp:32,tex:.7,ink:mixCol(col,L.rail,.4),sw:.33});
  }
  boilSeed('parasol-tip'+i);paint(ellPts(ux,top-1,2.8,3,12),{wash:PAL.ochre,ink:null});
}
function sunGreetingState(t,s){
  const wake=ease(seg(t,26.5,27.5));
  return {wake,x:s.cam.cx+220,y:t<26.85?340+2.6*t:410,r:lerp(100,65,wake)};
}
function friendlySun(t,s){
  const {wake,x,y,r}=sunGreetingState(t,s);
  sunDisk(x,y,r,.98);if(wake<.02)return;
  boilSeed('sun-personality');
  for(const side of[-1,1]){
    inkLine([[x+side*24-8,y-5],[x+side*24,y-11],[x+side*24+8,y-5]],1.4,PAL.ink,'inkfine',.5);
    paint(ellPts(x+side*38,y+15,8,4,12,.4),{wash:PAL.rose,washOp:120,ink:null});
  }
  const hello=sunHelloState(t);
  if(hello.open>.04){
    paint(ellPts(x,y+22,13,2+10*hello.open,18,.25),{wash:PAL.clayDk,ink:PAL.ink,sw:.55});
    paint(ellPts(x,y+25,7,2+2*hello.open,14),{wash:PAL.rose,washOp:175,ink:null});
  }else inkLine([[x-14,y+18],[x,y+27],[x+14,y+18]],1.2,PAL.ink,'inkfine',.7);
  if(hello.age>=0&&hello.age<.88)sfx('hey!',x-r-112,y-16,55,PAL.clayDk,hello.age,{life:.88,font:'55px "Permanent Marker"',stroke:PAL.cream,rot:-.12,ink:false});

  if(t>28.7&&t<30.55){
    const k=ease(seg(t,28.7,29.3))*(1-ease(seg(t,30.2,30.55)));
    glow(x,y-r-70,95,'#FFD96A',.32*k);
    for(let i=0;i<4;i++){
      const a=t*.8+i/4*TAU;boilSeed('sun-mind-spark'+i);
      paint(starPts(x+Math.cos(a)*85,y-r-75+Math.sin(a)*52,4+4*k,.34,4),{wash:PAL.cream,washOp:235*k,ink:null});
    }
  }
}
// Rounded cloud lobes, tessellated into a single closed watercolor silhouette (no angular frame).
function thoughtCloudPts(cx,cy,rx=570,ry=245){
  const pts=[],lobes=14;
  for(let i=0;i<lobes;i++)for(let j=0;j<10;j++){
    const q=j/10,a=(i+q)/lobes*TAU,bulge=(24+7*Math.sin(i*1.7)**2)*Math.sin(q*Math.PI);
    const nx=Math.cos(a)/rx,ny=Math.sin(a)/ry,n=Math.hypot(nx,ny);
    pts.push([cx+rx*Math.cos(a)+bulge*nx/n,cy+ry*Math.sin(a)+bulge*ny/n]);
  }
  return pts;
}
// Pose and hand matrix are shared by the airborne sheet and the held prop, so the catch has no jump.
function coastHeroPose(t,s){
  const pose={...s.pose,lookY:t>26.85?-.65:s.pose.lookY};
  if(t>=28.8){
    pose.emote=null;pose.gloom=0;pose.tintK=0;pose.lookX=.6;
    pose.eyes=t<31.7?'wide':'look';pose.squint=t<31.7?.25:0;pose.mouth=t<31.7?'o':'smile';
    pose.aR=lerp(-.32,.28,ease(seg(t,29.2,30.7)))-.12*ease(seg(t,30.2,31.2));
    pose.lookY=lerp(-.85,.05,ease(seg(t,30.2,31.25)));
  }
  return pose;
}
function wishHand(s,pose){
  const u=s.u,sq=(pose.sq||0)+(pose.take||0),sx=(1+sq*.6)*(pose.sx??1),sy=(1-sq)*(pose.sy??1),rot=pose.rot||0,side=pose.view==='side';
  const arm=side?VIEWS.side.arms[0]:VIEWS[pose.view||'q'].arms.find(v=>v[2]==='R'),[px,dir,which]=arm,a=pose[which==='R'?'aR':'aL']||0;
  const angle=side?.7-a:-a,root=(px+(side?0:dir*.55*clamp((Math.abs(a)-.7)/.9)))*u,tip=(side?2.1:2.2)*u,k=u/17;
  const local=[(root+Math.cos(angle)*(tip+36*k)+Math.sin(angle)*8*k)*sx,(-4.5*u+(side?.3*u:0)+Math.sin(angle)*(tip+36*k)-Math.cos(angle)*8*k)*sy];
  return {x:s.x+(pose.dx||0)*u+local[0]*Math.cos(rot)-local[1]*Math.sin(rot),y:s.y+(pose.dy||0)*u+local[0]*Math.sin(rot)+local[1]*Math.cos(rot),rot:rot+angle,w:74*k*sx,h:52*k*sy};
}
// The sun materializes the wish with its mind. One instant of handoff, no flying paper or reaching tentacle.
function childhoodWishState(t,s=journeyState(t),pose=coastHeroPose(t,s)){
  if(t<28.8)return null;
  const hand=wishHand(s,pose);if(t>=30.2)return {...hand,held:true,pop:backOut(seg(t,30.2,30.5))};
  const sun=sunGreetingState(t,s),k=backOut(seg(t,28.8,29.25));
  return {x:sun.x,y:sun.y-sun.r-75,rot:-.06,w:110*k,h:78*k,held:false,pop:k};
}
function wishSheetPaint(x,y,w,h,rot=0){
  push();translate(x,y);rotate(rot);boilSeed('childhood-wish-paper');
  paint(rectPts(-w/2,-h/2,w,h,.25),{wash:PAL.cream,fill:PAL.paper,fillOp:110,bleed:.04,tex:.7,ink:mixCol(PAL.ink,PAL.ochre,.4),sw:.5});
  inkLine([[w*.31,-h/2],[w*.31,-h*.23],[w/2,-h*.23]],.4,mixCol(PAL.ochre,PAL.paper,.4),'inkfine',0);
  inkLine([[-w*.30,h*.32],[0,h*.32],[w*.25,h*.32]],.35,mixCol(PAL.rose,PAL.ochre,.4),'inkfine',.15);
  pop();
}
function wishSheetLabel(p){
  const size=p.w*.19,c=Math.cos(p.rot),ss=Math.sin(p.rot);
  for(const [text,dy]of[['童年',-p.h*.15],['心愿',p.h*.12]])letter(text,p.x-dy*ss,p.y+dy*c,size,PAL.clayDk,{rot:p.rot,font:`${size}px "Ma Shan Zheng"`,ink:false});
}
function drawCoastHero(t,s,pose){
  const paper=childhoodWishState(t,s,pose),k=s.u/17;
  if(paper?.held){
    const grow=paper.pop??1,hook=()=>{push();translate(36*k,-8*k);scale(grow);wishSheetPaint(0,0,74*k,52*k,0);pop();};
    pose={...pose,[pose.view==='side'?'armL':'armR']:hook};
  }
  const draw=pose.draw;
  clawdPack(s.x,s.y,s.u,{...pose,draw:(u,sw)=>{if(draw)draw(u,sw);if(t<28)headTangle(u,t);}});
  if(paper&&!paper.held&&paper.w>1)wishSheetPaint(paper.x,paper.y,paper.w,paper.h,paper.rot);
  if(paper&&paper.w>1)wishSheetLabel({...paper,w:paper.w*(paper.held?(paper.pop??1):1),h:paper.h*(paper.held?(paper.pop??1):1)});
  wishTeleportSpark(t,s,pose);
}
function recollectionState(t){
  for(const item of[{kind:'criticism',start:4.6,end:10.5},{kind:'parting',start:11.0,end:17.1},{kind:'lonely',start:17.7,end:25.1}]){
    if(t>=item.start&&t<=item.end)return {...item,age:t-item.start,alpha:ease(seg(t,item.start,item.start+.65))*(1-ease(seg(t,item.end-.7,item.end)))};
  }
  return null;
}
// Complete stern teacher: angular paper-cut silhouette, black dress, bun, triangular eyes and a pointed rebuke.
function paperCritic(x,y,t){
  push();translate(x,y);rotate(-.08+.025*Math.sin(t*2));scale(1.24);
  const black=PAL.ink,skin=mixCol(PAL.cream,PAL.ochre,.16),jab=5*Math.sin(t*5);
  boilSeed('teacher-legs');
  for(const side of[-1,1]){
    paint(ribbon([[side*13,-59],[side*20,-13],[side*24,33]],8,6),{wash:black,ink:PAL.ink,sw:.6});
    paint([ [side*24-9,29],[side*24+10,29],[side*24+16,38],[side*24-10,38]],{wash:black,ink:PAL.ink,sw:.5});
  }
  boilSeed('teacher-neck');paint([[-9,-174],[12,-174],[12,-143],[-9,-141]],{wash:skin,ink:PAL.ink,sw:.5});
  boilSeed('teacher-dress');
  paint([[-23,-148],[20,-151],[28,-106],[44,-56],[-37,-56],[-17,-105]],{wash:black,ink:PAL.ink,sw:1});
  paint([[-16,-148],[1,-132],[15,-149],[6,-143],[0,-137],[-7,-144]],{wash:PAL.cream,ink:null});
  inkLine([[-9,-115],[-7,-97],[-18,-63]],.5,mixCol(PAL.cream,black,.78),'dry',.15);
  boilSeed('teacher-pointing-arm');
  paint(ribbon([[-19,-141],[-47,-123],[-85-jab,-144]],12,8),{wash:black,ink:PAL.ink,sw:.6});
  paint(ribbon([[-84-jab,-144],[-94-jab,-147],[-116-jab,-154]],6,2),{wash:skin,ink:PAL.ink,sw:.5});
  inkLine([[-95-jab,-147],[-103-jab,-139],[-108-jab,-140]],.7,PAL.ink,'inkfine',.15);
  boilSeed('teacher-other-arm');
  paint(ribbon([[18,-141],[55,-114],[65,-148]],11,7),{wash:black,ink:PAL.ink,sw:.5});
  paint(ellPts(65,-147,5,6,14),{wash:skin,ink:PAL.ink,sw:.45});
  paint([[53,-175],[88,-181],[99,-145],[66,-138]],{wash:PAL.cream,ink:PAL.ink,sw:.6});
  for(let i=0;i<3;i++)inkLine([[64+i*2,-166+i*7],[75+i*2,-168+i*7],[85+i*2,-169+i*7]],.45,PAL.clayDk,'inkfine',.08);
  boilSeed('teacher-head');
  paint([[-30,-222],[11,-236],[28,-202],[11,-169],[-25,-175],[-42,-199]],{wash:skin,ink:PAL.ink,sw:.75});
  paint([[-34,-219],[-29,-232],[13,-244],[29,-224],[30,-197],[16,-208],[9,-230],[-30,-215]],{wash:black,ink:PAL.ink,sw:.6});
  paint(ellPts(28,-229,13,15,18,.3),{wash:black,ink:PAL.ink,sw:.5});
  paint([[-39,-199],[-51,-187],[-33,-188]],{wash:skin,ink:PAL.ink,sw:.5});
  // Both eyes taper downwards; the leftward gaze and jab address Clawd, not the viewer.
  for(const [ex,ey]of[[-23,-204],[1,-210]])paint([[ex-6,ey-5],[ex+7,ey-5],[ex+1,ey+7]],{wash:PAL.ink,ink:null});
  const open=.8+.7*Math.sin(t*5)**2;
  paint(ellPts(-22,-180,6,3*open,12),{wash:PAL.clayDk,ink:PAL.ink,sw:.45});
  pop();
}
function withMemoryInk(alpha,fn){
  const p=paint,line=inkLine;
  paint=(pts,o={})=>p(pts,{...o,washOp:(o.washOp??200)*alpha,fillOp:(o.fillOp??90)*alpha,ink:o.ink?mixCol(o.ink,PAL.paper,1-alpha):o.ink});
  inkLine=(pts,sw=1,col=PAL.ink,br='ink',curv=.5)=>line(pts,sw,mixCol(col,PAL.paper,1-alpha),br,curv);
  try{fn();}finally{paint=p;inkLine=line;}
}
function memoryOverlay(t,head){
  const m=recollectionState(t);if(!m||m.alpha<.02)return;
  withMemoryInk(m.alpha,()=>{
    const cx=1020,cy=350;boilSeed('thought-cloud');
    for(let i=0;i<3;i++){const q=(i+1)/4;paint(ellPts(lerp(head[0],cx-270,q),lerp(head[1]-35,cy+240,q),6+i*5,6+i*5,14,.6),{wash:PAL.cream,washOp:210,ink:mixCol(PAL.ink,PAL.cream,.6),sw:.4});}
    paint(thoughtCloudPts(cx,cy),{wash:mixCol(PAL.paper,LOOK.dusk.sky,.09),washOp:248,fill:PAL.paper,fillOp:185,bleed:.2,tex:.8,ink:mixCol(PAL.ink,PAL.paper,.7),sw:.55,curv:.12});
    if(m.kind==='criticism'){
      paperCritic(1270,538,m.age);
      comicRebuke(t,m);
      clawd(780,565,21,{...feel('nervous',t),view:'q',aL:-.5,aR:-.5,lookX:.8,lookY:-.35,boilKey:'memory-self',draw:uu=>headTangle(uu,t,7)});
      for(let i=0;i<3;i++){boilSeed('sharp-words'+i);inkLine([[1040+i*35,355-i*8],[1020+i*35,365-i*8],[1032+i*35,380-i*8]],1.3,PAL.clayDk,'ink',.04);}
    }else if(m.kind==='parting'){
      const p=ease(seg(m.age,.6,5.2));
      clawd(765,560,20,{...feel('sad',t),view:'q',aR:lerp(.55,-.4,p),lookX:.9,boilKey:'memory-self'});
      withMemoryInk(1-.73*p,()=>clawd(1050+330*p,540,18,{...feel('sad',t),col:LOOK.dawn.sea,dk:LOOK.dawn.far,lt:mixCol(LOOK.dawn.sea,PAL.cream,.3),view:'q',walk:p*3,aL:.35,boilKey:'memory-friend'}));
      boilSeed('memory-heart');paint(heartPts(968,430-15*p,18*(1-p*.75)),{wash:mixCol(PAL.rose,PAL.paper,p*.75),ink:null});
    }else{
      const pushIn=ease(seg(m.age,1,5.8)),u=lerp(17,27,pushIn);
      // A generous empty seat, one small cup, and a shrinking pool of colour isolate the face.
      boilSeed('lonely-bench');paint(rrPts(650,551,740,18,5),{wash:mixCol(PAL.ochre,PAL.ink,.4),ink:PAL.ink,sw:.6});
      for(const x of[700,1330])inkLine([[x,565],[x,581],[x,600]],1.6,PAL.ink,'ink',.2);
      paint(ellPts(955,572,130,13,24,1),{fill:mixCol(PAL.indigo,PAL.paper,.65),fillOp:90,bleed:.4,ink:null});
      clawd(925,551+2*u,u,{noShadow:true,...feel('sad',t),view:'front',aL:-.6,aR:-.6,lookY:.4,boilKey:'memory-self'});
      lonelyLunch(1210,551,t);
    }
  });
}
function shotCoastStory(t,lt,dur){
  const L=LOOK.dusk,s=journeyState(t);camBegin(s.cam.cx,s.cam.cy,s.cam.zoom);
  skyWash(L,t);friendlySun(t,s);
  seaBand(L,t,560,{sunX:s.cam.cx+220,foam:false});coastalGulls(t,L);
  const b=worldBounds();boilSeed('open-beach-sand');paint(rectPts(b.left,770,b.right-b.left,145),{wash:L.sand,fillOp:55,tex:.7,ink:null});
  shoreFoam(L,t,560);holidayBeach(t,L);
  boilSeed('continuous-sea-rail');
  for(let x=Math.floor(b.left/190)*190;x<b.right;x+=190)inkLine([[x,858],[x,831],[x,805]],.95,mixCol(L.rail,L.sky,.25),'ink',.12);
  for(const y of[805,831])inkLine([[b.left,y],[s.cam.cx,y],[b.right,y]],.75,mixCol(L.rail,L.sky,.25),'inkfine',.05);
  sidewalk(L);for(const x of[350,1450,2550])if(x>b.left&&x<b.right)lampPost(x,L,.85);
  const pose=coastHeroPose(t,s);drawCoastHero(t,s,pose);foregroundTraffic(t,L);
  const head=toScreen(s.x,s.y-8*s.u);camEnd();memoryOverlay(t,head);
  flushLetters();
  if(t<.62)iris(...head,lerp(0,1550,easeOut(t/.62)),PAL.night);
  if(lt>dur-.35){boilSeed('wipe');brushWipe((lt-(dur-.35))/.7,['#C45C6A','#E8A878']);}
}

// The wish carries into a wide sunset tableau. Same brushes, paper, block character and pigments as the MV.
function wishSunsetState(t){
  const lt=t-34.82,u=17;
  return {x:520+82*lt,y:836,u,cam:{cx:960,cy:540,zoom:1},
    pose:{view:'q',walk:(82*lt)/(4*u),dy:-.18*Math.abs(Math.sin(82*lt/(4*u)*Math.PI)),aL:-.25,aR:.16,
      eyes:'look',mouth:'smile',lookX:.6,lookY:.12,boilKey:'coast-hero',swMul:.8}};
}
function sunsetGrass(t){
  const dark=mixCol(PAL.ink,PAL.clayDk,.27);
  boilSeed('sunset-verge');paint(rectPts(-60,877,2040,260),{wash:dark,fill:PAL.ink,fillOp:55,tex:.8,ink:null});
  for(let i=0;i<36;i++){
    const x=i*58+hash(i+180)*35,y=878+hash(i+182)*17,height=25+hash(i+190)*65,breeze=3*Math.sin(t*.7+i);
    boilSeed('sunset-grass'+i);
    for(let j=0;j<3;j++)inkLine([[x+j*3,y],[x+(j-1)*7+breeze,y-height*.55],[x+(j-1)*13+breeze,y-height]],.7+hash(i)*.4,dark,'inkfine',.2);
    if(i%4===0){
      const fx=x+breeze,fy=y-height-8;
      paint(ellPts(fx,fy,3,4,12),{wash:dark,ink:null});
      for(let k=0;k<5;k++){const a=k/5*TAU;paint(ellPts(fx+5*Math.cos(a),fy+5*Math.sin(a),2,3,10,0,a),{wash:dark,ink:null});}
    }
  }
}
function shotWishSunset(t,lt,dur){
  const s=wishSunsetState(t),L={...LOOK.dusk,sky:mixCol(LOOK.fantasy.sky,LOOK.dusk.sky,.32),sky2:mixCol(PAL.clay,LOOK.dusk.sky2,.45),sea:mixCol(LOOK.dusk.sea,LOOK.dusk.sky,.55),sand:LOOK.dusk.sand};
  camBegin(s.cam.cx,s.cam.cy,s.cam.zoom);skyWash(L,t);
  // A centred low sun descends behind the water; the horizon masks its lower edge naturally.
  sunDisk(960,lerp(414,539,ease(seg(lt,0,dur))),258,.98);
  for(let i=0;i<4;i++){
    boilSeed('sunset-cloud-ribbon'+i);
    paint(ellPts(410+i*380+8*Math.sin(t*.15+i),258+i*53,140+i*20,8+hash(i+170)*7,32,1),{fill:mixCol(LOOK.dusk.far,PAL.clay,.35),fillOp:65,bleed:.35,tex:.8,ink:null});
  }
  boilSeed('sunset-distant-island');
  paint([[-60,647],[70,631],[170,608],[290,601],[415,627],[510,622],[630,650]],{wash:mixCol(LOOK.dusk.far,L.sky,.35),fillOp:45,ink:null});
  paint([[1330,650],[1440,625],[1520,615],[1620,638],[1740,618],[1820,631],[1980,645]],{wash:mixCol(LOOK.dusk.far,L.sky,.4),ink:null});
  seaBand(L,t,650,{sunX:960,foam:false});
  // Small sailing boats sit on the distant water, not on the promenade.
  for(const [i,[x,y,w]]of[[390+lt*2,707,37],[1470-lt*2,697,28]].entries()){
    boilSeed('sunset-sail'+i);
    paint([[x-w/2,y],[x+w/2,y],[x+w*.3,y+6],[x-w*.3,y+6]],{wash:mixCol(L.sea,PAL.ink,.35),ink:null});
    paint([[x,y-48],[x,y-3],[x+w*.6,y-3]],{wash:mixCol(PAL.cream,L.sky,.22),washOp:155,ink:null});
    inkLine([[x,y],[x,y-24],[x,y-49]],.45,LOOK.dusk.far,'inkfine',0);
  }
  boilSeed('sunset-promenade');
  paint(rectPts(-60,817,2040,75),{wash:mixCol(PAL.clayDk,PAL.ink,.58),fill:PAL.ink,fillOp:48,tex:.8,ink:null});
  inkLine([[-60,817],[960,817],[1980,817]],.75,mixCol(PAL.cream,L.sky,.25),'dry',0);
  drawCoastHero(t,s,s.pose);sunsetGrass(t);camEnd();flushLetters();
  boilSeed('wipe');
  if(lt<.35)brushWipe(.5+lt/.7,['#C45C6A','#E8A878']);
  if(lt>dur-.35)brushWipe((lt-(dur-.35))/.7,['#C45C6A','#E8A878']);
}
