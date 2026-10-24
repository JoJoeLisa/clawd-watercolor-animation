// r5: a memory opens into reunion, a morning gust returns us to the street,
// and the same dream-star guides a small profile Clawd to a moonlit growing tree.
const REUNION_START=49.63,WIND_START=65.44,COUNTRY_START=70.85,STAR_PLANT=72.32;
function dreamReunionState(t){
  const a=t-REUNION_START,join=ease(seg(a,0,2.65)),skip=seg(a,5.5,10),watch=ease(seg(a,10,11.5));
  let x=lerp(490,858,join)+250*skip,idealX=lerp(1370,1052,join)+250*skip;
  const hop=a<5.5?.65*Math.abs(Math.sin(Math.max(0,a-2.65)*4.2)):.82*Math.abs(Math.sin((a-5.5)*5));
  const wave=a>13?1+.28*Math.sin((a-13)*7):.4;
  return {x,idealX,y:860,u:20,walk:a<2.65?a*1.3:a<5.5?0:(a-5.5)*1.1,
    pose:{view:'q',eyes:a<1?'wide':a<3.1?'shine':'happy',mouth:'smile',lookX:.75,lookY:lerp(-.15,-1,watch),blush:.32,
      dy:-hop*(1-.8*watch),sq:.04*Math.sin(a*7),rot:.025*Math.sin(a*4),aL:wave,aR:.65+.22*Math.sin(a*4),boilKey:'coast-hero'},
    idealPose:{view:'q',flip:a<5.5,col:mixCol(PAL.clay,PAL.ochre,.45),dk:mixCol(PAL.clayDk,PAL.ochre,.2),lt:mixCol(PAL.clayLt,PAL.cream,.35),
      eyes:'happy',mouth:'smile',blush:.34,dy:-hop*(1-.8*watch),sq:.04*Math.sin(a*7+.5),rot:-.025*Math.sin(a*4),aL:wave,aR:.67,boilKey:'ideal-self',hat:'flower'}};
}
function reunionStarState(t){
  const a=t-REUNION_START;
  return {x:kf(a,[[0,1510],[2.7,1230],[5.5,1200],[10,1480],[12,1510],[15.81,1590]]),
    y:kf(a,[[0,270],[2.7,400],[5.5,360],[10,430],[12,430],[15.81,760]])+14*Math.sin(a*2.6),r:30,rot:.1*Math.sin(a*2)};
}
function reunionWorld(t){
  const a=t-REUNION_START,s=dreamReunionState(t),L={...LOOK.fantasy,sky:mixCol(LOOK.fantasy.sky,PAL.cream,.24),sky2:mixCol(PAL.rose,PAL.cream,.5)};
  camBegin(960,540,1);skyWash(L,t);sunDisk(1090,263,131,.78);
  FALLEN_STAR.hill(1610,965,1180,330,mixCol(PAL.teal,PAL.cream,.16),t,0);
  FALLEN_STAR.hill(520,1160,1330,340,mixCol(PAL.sap,PAL.cream,.17),t,0);
  boilSeed('reunion-meadow');paint(rectPts(-100,838,2120,350,2),{wash:mixCol(PAL.sap,PAL.cream,.22),fill:PAL.ochre,fillOp:35,bleed:.15,tex:.7,ink:null});
  flowerSea(t,false);reunionSunflowers(t);
  // Both remain the original four-legged block model. The warmer self is an affectionate, possible future.
  clawd(s.idealX,s.y,s.u,{...s.idealPose,walk:s.walk});
  clawdPack(s.x,s.y,s.u,{...s.pose,walk:s.walk});
  // Foreground is planted in front of the feet, while both faces stay above the blossoms.
  flowerSea(t,true);
  if(a>2.65&&a<5.5){
    const k=Math.sin(seg(a,2.65,5.5)*Math.PI);boilSeed('reunion-heart');
    paint(heartPts((s.x+s.idealX)/2,650-90*k,22*k),{wash:PAL.rose,ink:null});
  }
  const star=reunionStarState(t);FALLEN_STAR.starling(star.x,star.y,star.r,{glow:1,rot:star.rot});
  // The wish becomes a constellation rather than a static picture: each new spark joins the trail.
  if(a>7.7)for(let i=0;i<7;i++){
    const k=ease(seg(a,7.7+i*.42,8.2+i*.42)),x=620+i*132,y=365-65*Math.sin(i/6*Math.PI);
    if(k<.01)continue;boilSeed('reunion-wish-star'+i);
    paint(starPts(x,y,(6+5*Math.sin(t*2+i)**2)*k,.38,5),{wash:PAL.cream,washOp:235,ink:null});
    if(i)inkLine([[x-132,y+20],[x-65,y-9],[x,y]],.4,mixCol(PAL.ochre,PAL.cream,.55),'inkfine',.25);
  }
  camEnd();
}
function cloudBurst(t){
  const a=t-REUNION_START;if(a<0||a>1.05)return;
  const k=seg(a,0,1.05),fade=1-ease(k),cx=1120,cy=370;
  for(let i=0;i<12;i++){
    const ang=i/12*TAU,travel=190+900*easeOut(k),x=cx+Math.cos(ang)*travel,y=cy+Math.sin(ang)*travel*.65;
    boilSeed('cloud-pop-puff'+i);paint(lumpy(x,y,(42+24*k)*fade,(32+18*k)*fade,i),{wash:PAL.cream,washOp:240*fade,fill:PAL.paper,fillOp:80*fade,bleed:.3,tex:.75,ink:null});
  }
  for(let i=0;i<9;i++){
    const ang=i/9*TAU,r=180+650*k;boilSeed('cloud-pop-spark'+i);
    paint(starPts(cx+Math.cos(ang)*r,cy+Math.sin(ang)*r*.65,19*Math.sin(k*Math.PI),.24,4,ang),{wash:PAL.cream,washOp:220*fade,ink:null});
  }
}
function shotDreamReunion(t,lt,dur){
  if(lt<.7){
    // Expand from precisely the same cloud location, so the cut belongs to Clawd's thought.
    shotCityDaydream(t,t-CITY_DREAM_START,11.51);flushLetters();flushBrush();
    const k=easeOut(seg(lt,0,.7)),outline=thoughtCloudPts(1120,370,lerp(630,2200,k),lerp(310,1550,k));
    push();beginClip();noStroke();fill(0,0);beginShape();for(const p of outline)vertex(...p);endShape(CLOSE);endClip();
    reunionWorld(t);flushBrush();pop();
  }else reunionWorld(t);
  cloudBurst(t);
}
function breeze(t,start,len=1){
  const p=seg(t,start,start+len);if(p<=0||p>=1)return;
  const k=Math.sin(p*Math.PI),x=lerp(-1100,2400,p);
  for(let i=0;i<5;i++){
    boilSeed('breeze-ribbon'+i);const y=140+i*190,pts=[];
    for(let j=0;j<8;j++)pts.push([x-950+j*230,y+25*Math.sin(j*.8+p*5+i)]);
    paint(ribbon(pts,12*k,5*k),{wash:PAL.cream,washOp:120*k,fill:PAL.cream,fillOp:40*k,bleed:.5,tex:.75,ink:null});
  }
  for(let i=0;i<6;i++){
    const xx=x-500+i*155,yy=340+(i%3)*190+30*Math.sin(p*9+i);boilSeed('breeze-leaf'+i);
    paint(ellPts(xx,yy,10*k,3*k,14,.4,p*6+i),{wash:mixCol(PAL.sap,PAL.cream,.32),washOp:220*k,ink:null});
  }
}
function chaseState(t){
  const a=seg(t,66.04,70.7),sx=450+1660*(a*.35+.65*a*a),x=sx+4500-960,u=14;
  const speed=(1660/(70.7-66.04))*(.35+1.30*a),walk=(sx-450)/(4*u);
  return {x,y:GROUND,u,screenX:sx,speed,cam:{cx:4500,cy:590,zoom:1},pose:{view:'side',quickPass:true,walk,
    eyes:'look',lookX:1,lookY:-.75,mouth:'smile',rot:.10,dy:-.25*Math.abs(Math.sin(walk*Math.PI)),aL:.6+.18*Math.sin(walk*TAU),boilKey:'coast-hero'}};
}
function streetStarState(t){
  const s=chaseState(t),r=24,bounce=86*Math.abs(Math.sin((t-66.04)*Math.PI*1.5));
  return {x:s.x+280,y:GROUND-r-8-bounce,r,rot:.12*Math.sin(t*5),ground:GROUND};
}
function chaseCity(t){
  const s=chaseState(t),L={...LOOK.night,sky:mixCol(LOOK.dusk.sky,LOOK.night.sky,.66),sky2:mixCol(LOOK.dusk.sky2,LOOK.night.sky2,.72),house:mixCol(LOOK.dusk.house,LOOK.night.house,.56)};
  camBegin(s.cam.cx,s.cam.cy,s.cam.zoom);skyWash(L,t);cityBlock(L,t,{waterfront:false});sidewalk(L);
  for(let x=3470;x<5700;x+=1050)lampPost(x,L,1);
  const star=streetStarState(t);
  // The star bounces above the pedestrian path; neither star nor hero runs in the traffic lane.
  boilSeed('guide-star-shadow');paint(ellPts(star.x,GROUND+3,22,3,18),{wash:PAL.ochre,washOp:80,ink:null});
  for(let i=1;i<5;i++){boilSeed('guide-star-trail'+i);paint(starPts(star.x-i*35,star.y+6*i,5-i*.7,.28,4),{wash:PAL.cream,washOp:120-i*20,ink:null});}
  FALLEN_STAR.starling(star.x,star.y,star.r,{glow:1,rot:star.rot});
  clawdPack(s.x,s.y,s.u,s.pose);streetBarrier(L);foregroundTraffic(t,L);camEnd();
}
function shotStarChase(t,lt,dur){
  if(t<65.94)reunionWorld(t);else chaseCity(t);
  breeze(t,WIND_START,1.1);
  // A painted gust conceals the reality change at its crest, after the lyric starts.
  if(t<66.44){boilSeed('wind-return-cover');brushWipe(seg(t,65.44,66.44),[mixCol(PAL.cream,PAL.sky,.28),mixCol(PAL.cream,PAL.sap,.12)]);}
  if(t>70.65){boilSeed('country-gust-cover');brushWipe(seg(t,70.65,71.05),[mixCol(PAL.night,PAL.violet,.32),mixCol(PAL.indigo,PAL.teal,.25)]);}
}
const TREE_ROOT={x:1320,y:852};
function countryHeroState(t){
  const travel=easeOut(seg(t,COUNTRY_START,73.9)),x=lerp(-150,1015,travel),u=13,walk=(x+150)/(4*u),dark=mixCol(PAL.ink,PAL.night,.28),lit=treeLightState(t).face;
  const facing=t<73.4?{view:'side'}:t<73.9?turn(t,73.4,73.9,.25,0):{view:'front'};
  return {x,y:900,u,pose:{...facing,quickPass:true,col:mixCol(dark,PAL.clay,lit),dk:mixCol(dark,PAL.clayDk,lit),lt:mixCol(dark,PAL.clayLt,lit),walk:t<73.9?walk:undefined,
    noShadow:true,eyes:t<83?'look':t<88.25?'shine':'happy',mouth:t<87.8?'smile':'laugh',lookX:t<73.9?.9:.2,lookY:-1.1,blush:.32*lit,rot:t<73.4?.08:0,aL:t<73.4?.6:.1,aR:.1,
    dy:t<73.9?-.22*Math.abs(Math.sin(walk*Math.PI)):-.08*Math.sin(t*1.2),boilKey:'coast-hero',noPack:true,
    drawBehind:(uu,sw)=>{boilSeed('moon-shadow-pack');paint(rrPts(-5.1*uu,-7.3*uu,3*uu,4.5*uu,.4*uu),{wash:mixCol(dark,'#5B7FA8',lit),ink:PAL.ink,sw:sw*.55});}}};
}
function countryStarState(t){
  const p=easeOut(seg(t,COUNTRY_START,STAR_PLANT)),planted=ease(seg(t,STAR_PLANT,STAR_PLANT+.65));
  return {x:lerp(-90,TREE_ROOT.x,p),y:lerp(812,TREE_ROOT.y-20,p)-70*Math.sin(p*Math.PI*3)*(1-p)+planted*35,
    r:24*(1-planted),planted,rot:.16*Math.sin(t*5)};
}
function moonTree(t){
  const light=treeLightState(t),dark=mixCol(mixCol(PAL.ink,PAL.night,.33),PAL.clayDk,.38*light.canopy),root=TREE_ROOT;
  boilSeed('moon-tree-trunk');paint([ [root.x-34,root.y],[root.x-22,590],[root.x-48,450],[root.x-27,356],[root.x+21,355],[root.x+35,620],[root.x+32,root.y]],{wash:dark,fill:PAL.night,fillOp:80,tex:.8,ink:dark,sw:.7});
  const branches=[[970,350],[1100,300],[1190,350],[1390,272],[1510,332],[1710,350],[1480,445],[1080,434]];
  for(let i=0;i<branches.length;i++){
    const [x,y]=branches[i];boilSeed('moon-tree-branch'+i);
    paint(ribbon([[root.x,590],[root.x+(x-root.x)*.32,490],[x,y]],11,3),{wash:dark,ink:null});
  }
  // Overlapping uneven foliage, rooted branches, and a broken moonlit rim retain the paint's paper edges.
  for(const [i,x,y,rx,ry]of[[0,1050,350,280,128],[1,1290,292,315,162],[2,1540,356,320,130],[3,1250,438,342,108]]){
    boilSeed('moon-tree-crown'+i);paint(lumpy(x,y,rx,ry,i*3.7),{wash:mixCol(dark,mixCol(PAL.sap,PAL.ochre,.12),.55*light.canopy),fill:mixCol(PAL.teal,dark,.78),fillOp:65,tex:.85,bleed:.09,ink:null});
  }
  boilSeed('moon-tree-backlit-edge');inkLine([[1040,204],[1180,168],[1300,132],[1460,169],[1515,201]],.8,mixCol(PAL.cream,PAL.indigo,.5),'dry',.4);
  const rootGlow=ease(seg(t,STAR_PLANT,STAR_PLANT+.7));
  if(rootGlow>0){glow(root.x,root.y-15,88,'#FFD96A',.32*rootGlow);boilSeed('dream-root');paint(ellPts(root.x,root.y,26,5,18),{wash:PAL.ochre,washOp:75*rootGlow,ink:null});}
  // Stars emerge from fixed points in the branches: first a few seedlings, then a canopy of wishes on the repeat.
  const stars=TREE_STARS;
  for(let i=0;i<stars.length;i++){
    const when=treeStarWhen(i),grow=backOut(seg(t,when,when+.65));if(grow<.01)continue;
    const [x,y]=stars[i],tw=.8+.2*Math.sin(t*3+i),r=(9+(i%4)*2)*grow*tw;boilSeed('tree-wish'+i);
    inkLine([[x,y-18],[x+1,y-9],[x,y-2]],.4,mixCol(PAL.ochre,PAL.night,.45),'inkfine',.1);
    glow(x,y,r*3.5,'#FFD96A',.32*grow);
    paint(starPts(x,y,r,.45,5,.06*Math.sin(t*.9+i)),{wash:PAL.cream,fill:PAL.ochre,fillOp:75,ink:mixCol(PAL.ochre,PAL.cream,.4),sw:.32});
  }
}
function countryLamp(t){
  const x=285,y=355,base=904,dark=mixCol(PAL.ink,PAL.night,.3);
  boilSeed('country-lamp-cone');paint([[x-25,y+29],[x+25,y+29],[x+160,base],[x-160,base]],{wash:PAL.ochre,washOp:38,fill:PAL.ochre,fillOp:45,bleed:.5,tex:.85,ink:null});
  glow(x,y+20,200,'#FFD58A',.6);glow(x,base-5,170,'#FFC766',.18);
  boilSeed('country-lamp-post');paint(rrPts(x-5,y+70,10,base-y-70,2),{wash:dark,ink:PAL.ink,sw:.5});
  paint(rrPts(x-20,base-10,40,12,3),{wash:dark,ink:null});
  paint([[x-26,y-17],[x+26,y-17],[x+18,y+60],[x-18,y+60]],{wash:PAL.cream,fill:PAL.ochre,fillOp:100,ink:dark,sw:1.2});
  for(const side of[-1,1])inkLine([[x+side*12,y+59],[x+side*13,y+81],[x,y+85]],1,dark,'inkfine',.2);
  paint([[x-38,y-17],[x,y-47],[x+38,y-17]],{wash:dark,ink:dark,sw:.7});
  paint(ellPts(x,y-49,3,4,12),{wash:dark,ink:null});
}
function pastoralWorld(t){
  const camera=countryCam(t);camBegin(camera.cx,camera.cy,camera.zoom);const L={...LOOK.night,sky:mixCol(PAL.night,PAL.violet,.16),sky2:mixCol(PAL.indigo,PAL.violet,.32)};skyWash(L,t);
  // Moonlight is behind everything; the tree and walker keep quiet, almost black silhouettes.
  boilSeed('pastoral-moon');glow(1130,230,450,'#DADAEF',.32);paint(ellPts(1130,230,143,143,32,1.5),{wash:PAL.cream,fill:PAL.sky,fillOp:30,ink:null});
  for(const [i,x,y,rx,ry,col]of[[0,400,1020,1200,375,mixCol(PAL.teal,PAL.night,.70)],[1,1510,1050,1100,410,mixCol(PAL.sap,PAL.night,.78)]]){
    boilSeed('pastoral-hill'+i);paint(lumpy(x,y,rx,ry,i,45),{wash:col,fill:PAL.indigo,fillOp:45,tex:.75,bleed:.13,ink:null});
  }
  boilSeed('country-path');paint([[-100,908],[700,857],[2000,852],[2020,980],[720,950],[-100,1040]],{wash:mixCol(PAL.night,PAL.violet,.15),fill:PAL.cream,fillOp:27,tex:.7,bleed:.1,ink:null});
  moonTree(t);countryLamp(t);
  const climb=climbingStarState(t);
  if(climb&&climb.r>.2){
    const trail=[];for(let i=4;i>=0;i--){const q=climbingStarState(Math.max(72.95,t-i*.045));if(q)trail.push([q.x,q.y]);}
    if(trail.length>2){boilSeed('wish-climbing-trail');paint(ribbon(trail,3,1),{wash:PAL.cream,washOp:145,fill:PAL.ochre,fillOp:45,bleed:.28,ink:null});}
    FALLEN_STAR.starling(climb.x,climb.y,climb.r,{glow:1,rot:.12*Math.sin(t*4)});
  }
  const lit=treeLightState(t).face;if(lit>.01){glow(1110,650,370,'#FFD58A',.24*lit);glow(1015,824,105,'#FFE9A8',.12*lit);}

  const s=countryHeroState(t);clawdPack(s.x,s.y,s.u,s.pose);const star=countryStarState(t);
  if(star.r>.5)FALLEN_STAR.starling(star.x,star.y,star.r,{glow:1,rot:star.rot});
  if(t>=STAR_PLANT&&t<STAR_PLANT+.8){const k=seg(t,STAR_PLANT,STAR_PLANT+.8);for(let i=0;i<6;i++){boilSeed('seed-spark'+i);const a=i/6*TAU;paint(starPts(TREE_ROOT.x+Math.cos(a)*60*k,TREE_ROOT.y-10+Math.sin(a)*45*k,8*Math.sin(k*Math.PI),.25,4),{wash:PAL.cream,ink:null});}}
  const dark=mixCol(PAL.ink,PAL.night,.25);
  for(let i=0;i<34;i++){
    const x=i*63-70,y=1055+22*hash(i+32),sway=7*Math.sin(t*.7+i);boilSeed('moon-grass'+i);
    for(let j=-1;j<=1;j++)inkLine([[x+j*4,y],[x+j*10+sway*.5,y-25],[x+j*17+sway,y-45-26*hash(i+4)]],.9,dark,'inkfine',.2);
  }
  camEnd();
}
function shotMoonTree(t,lt,dur){
  pastoralWorld(t);breeze(t,70.65,.65);
  if(t<71.05){boilSeed('country-gust-cover');brushWipe(seg(t,70.65,71.05),[mixCol(PAL.night,PAL.violet,.32),mixCol(PAL.indigo,PAL.teal,.25)]);}
  if(t>89.15){const s=countryHeroState(t),camera=countryCam(t),face=toScreen(s.x,s.y-5*s.u,{...camera,rot:0});boilSeed('smile-ending');iris(...face,lerp(1250,0,ease(seg(t,89.15,90.3))),PAL.night);}
}
