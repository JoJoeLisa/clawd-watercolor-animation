// r6 additions use the supplied brush, pigment, paper and character model.
const SUN_HEY=27.75;
// r7 keeps the greeting lettering only; no voice and no speaking mouth.
function sunHelloState(t){return {age:t-SUN_HEY,open:0};}
function comicRebuke(t,m){
  const symbols=['#','@','*','&','¥','#','!'];
  for(let i=0;i<symbols.length;i++){
    const age=m.age-.25-i*.06;if(age<0)continue;
    const x=700+i*64+4*Math.sin(t*3+i),y=215+17*Math.sin(i*.7)+5*Math.sin(t*3.2+i*.8),size=68+8*Math.sin(i*1.3)**2;
    letter(symbols[i],x,y,size,PAL.clayDk,{pop:age*5,alpha:m.alpha,rot:-.09+.11*Math.sin(t*2+i),font:`${size}px "Permanent Marker"`,stroke:PAL.cream,ink:true});
  }
}
function lonelyLunch(x,y,t){
  boilSeed('lonely-lunch-lid');
  paint(rrPts(x-57,y-87,112,49,5,.6),{wash:mixCol(LOOK.dawn.sea,PAL.cream,.30),fill:PAL.cream,fillOp:55,ink:PAL.ink,sw:.6});
  paint(rrPts(x-48,y-78,94,29,4,.3),{wash:mixCol(LOOK.dawn.sea,PAL.cream,.55),washOp:150,ink:null});
  boilSeed('lonely-lunch-box');
  paint(rrPts(x-58,y-41,116,39,6,.4),{wash:mixCol(LOOK.dawn.sea,PAL.cream,.25),fill:LOOK.dawn.sea,fillOp:55,ink:PAL.ink,sw:.65});
  paint(rrPts(x-52,y-39,104,24,4,.35),{wash:PAL.cream,ink:mixCol(PAL.ink,PAL.paper,.3),sw:.4});
  inkLine([[x+7,y-38],[x+7,y-25],[x+7,y-16]],.45,LOOK.dawn.sea,'inkfine',.1);
  // A single serving of rice and vegetables, an open lid, one cup; the long remaining seat stays empty.
  paint(ellPts(x-20,y-27,24,8,18,.6),{wash:PAL.paper,fill:PAL.cream,fillOp:80,ink:mixCol(PAL.ink,PAL.paper,.7),sw:.3});
  for(let i=0;i<3;i++){boilSeed('lunch-veggie'+i);paint(ellPts(x+22+i*8,y-27+(i%2)*3,6,4,12,.4),{wash:i===1?PAL.clay:PAL.sap,ink:null});}
  boilSeed('lonely-lunch-cup');paint(rrPts(x+114,y-29,22,27,3,.3),{wash:PAL.cream,fill:PAL.ochre,fillOp:35,ink:PAL.ink,sw:.5});
  inkLine([[x+136,y-24],[x+144,y-20],[x+136,y-12]],.7,mixCol(PAL.ink,PAL.paper,.3),'inkfine',.4);
  boilSeed('lunch-fork');inkLine([[x-39,y-7],[x-5,y-9],[x+11,y-11]],.45,mixCol(PAL.ink,PAL.paper,.30),'inkfine',.1);
}
// Blossoming bouquets, with three flower heads rising from each shared clump.
const SUNFLOWER_CLUMPS=[{x:125,y:1002},{x:415,y:966},{x:675,y:1041},{x:955,y:1008},{x:1230,y:1005},{x:1510,y:977},{x:1790,y:1022}];
function sunflowerState(t,i){
  const group=Math.floor(i/3),stem=i%3,base=SUNFLOWER_CLUMPS[group],start=49.63+group*.18+stem*.13,beats=Math.max(0,(t-start)/BEAT),rise=ease(seg(beats,0,7));
  const breathe=1+.02*Math.sin(bpOf(t)*TAU+i*.3),height=[166,202,151][stem]+20*hash(i+70),r=[35,43,33][stem]+5*hash(i+11);
  return {x:base.x+(stem-1)*13,y:base.y+(stem===1?-3:0),growth:rise,height:height*rise,radius:r*rise*breathe,
    sway:8*Math.sin(t*.85+i)*rise,spread:(stem-1)*48*rise,group};
}
function reunionSunflowers(t){
  for(let i=0;i<SUNFLOWER_CLUMPS.length*3;i++){
    const s=sunflowerState(t,i);if(s.growth<.005)continue;
    const x=s.x+s.sway+s.spread,y=s.y-s.height;boilSeed('reunion-sunflower-stem'+i);
    inkLine([[s.x,s.y],[s.x+s.spread*.35+s.sway*.4,s.y-s.height*.48],[x,y]],1.05,mixCol(PAL.sap,PAL.ink,.24),'inkfine',.28);
    for(const side of[-1,1])paint(ellPts(s.x+s.spread*.32+side*16*s.growth,s.y-s.height*.42,24*s.growth,9*s.growth,16,.5,side*-.45),{wash:PAL.sap,fill:PAL.cream,fillOp:28,ink:null});
    const petals=[];for(let j=0;j<72;j++){const a=j/72*TAU,r=s.radius*(.73+.27*Math.cos(a*12));petals.push([x+Math.cos(a)*r,y+Math.sin(a)*r]);}
    boilSeed('sunflower-petals'+i);paint(petals,{wash:PAL.ochre,fill:PAL.cream,fillOp:58,ink:mixCol(PAL.ochre,PAL.clay,.18),sw:.30,curv:.22});
    boilSeed('sunflower-centre'+i);paint(ellPts(x,y,s.radius*.40,s.radius*.40,18,.3),{wash:mixCol(PAL.clayDk,PAL.ink,.33),fill:PAL.ochre,fillOp:25,ink:mixCol(PAL.clayDk,PAL.ink,.2),sw:.45});
  }
}
// R8: rooted, staggered rows build a full meadow; near blooms overlap the legs.
const FLOWER_SEA=Array.from({length:110},(_,i)=>{
  const row=Math.floor(i/22),col=i%22,x=-30+col*92+(row%2)*42+18*(hash(i+320)-.5);
  return {row,x,y:[859,930,1000,1080,1160][row]+12*(hash(i+610)-.5),
    start:49.85+row*.70+Math.abs(x-1040)/1920*2.7+hash(i+740)*1.4,
    height:[45,96,103,115,133][row]+15*hash(i+180),radius:[14,27,33,39,45][row]*(.85+.30*hash(i+270))};
});
function flowerSeaState(t,i){
  const f=FLOWER_SEA[i],age=t-f.start,growth=ease(seg(age,0,.95)),bloom=backOut(seg(age,.12,1));
  return {...f,age,growth,height:f.height*growth,radius:f.radius*bloom,
    headX:f.x+5*Math.sin(t*.85+i)*growth,headY:f.y-f.height*growth};
}
function flowerSea(t,front=false){
  for(let i=0;i<FLOWER_SEA.length;i++){
    const s=flowerSeaState(t,i);if((s.row>0)!==front||s.growth<.005)continue;
    if(s.age<.52){const k=seg(s.age,0,.52),r=24*Math.sin(k*Math.PI);boilSeed('flower-earth-pop'+i);
      if(r>1)paint(lumpy(s.x,s.y-5,r,r*.40,i),{wash:mixCol(PAL.cream,PAL.sap,.12),washOp:165*(1-k),bleed:.2,tex:.8,ink:null});}
    if(s.radius<1.2)continue;
    const x=s.headX,y=s.headY;boilSeed('flower-sea-stem'+i);
    inkLine([[s.x,s.y],[s.x+(x-s.x)*.3,s.y-s.height*.52],[x,y]],s.row===0?.5:.85,mixCol(PAL.sap,PAL.ink,.18),'inkfine',.12);
    if(s.row>0){boilSeed('flower-sea-leaf'+i);paint(ellPts(s.x-10*s.growth,s.y-s.height*.43,(16+3*s.row)*s.growth,6*s.growth,12,.35,-.2),{wash:PAL.sap,fill:PAL.cream,fillOp:20,ink:null});}
    const petals=[];for(let j=0;j<72;j++){const a=j/72*TAU,r=s.radius*(.73+.27*Math.cos(a*12));petals.push([x+Math.cos(a)*r,y+Math.sin(a)*r]);}
    boilSeed('flower-sea-petals'+i);paint(petals,{wash:PAL.ochre,fill:PAL.cream,fillOp:55,ink:mixCol(PAL.ochre,PAL.clay,.15),sw:.22,curv:.18});
    boilSeed('flower-sea-centre'+i);paint(ellPts(x,y,s.radius*.39,s.radius*.39,14,.2),{wash:mixCol(PAL.clayDk,PAL.ink,.30),fill:PAL.ochre,fillOp:22,ink:null});
  }
}
function wishCloudBurst(t,start,p,seed,scale=1){
  const age=t-start;if(age<0||age>.72)return;
  const k=seg(age,0,.72),expand=easeOut(k),fade=1-ease(seg(k,.35,1));
  for(let i=0;i<7;i++){
    const a=i/7*TAU,r=(8+52*expand)*scale,size=(16+15*Math.sin(k*Math.PI))*fade*scale;
    if(size<1)continue;
    boilSeed('wish-cloud-'+seed+'-'+i);
    paint(lumpy(p.x+Math.cos(a)*r,p.y+Math.sin(a)*r*.72,size,size*.76,i+seed),{wash:PAL.cream,washOp:235*fade,fill:PAL.paper,fillOp:70*fade,bleed:.3,tex:.75,ink:null});
  }
}
const TREE_STARS=[[1000,343],[1120,308],[1200,249],[1320,237],[1420,282],[1530,339],[1640,365],[1170,423],[1390,420],[1490,395],
  [960,384],[1070,379],[1260,337],[1380,335],[1580,410],[1730,370],[1290,454],[1460,225],[1100,243],[1340,385]];
function treeStarWhen(i){return i<7?74.3+i*.37:80.33+(i-7)*.12;}
function treeLightState(t){
  const growth=TREE_STARS.reduce((sum,p,i)=>sum+ease(seg(t,treeStarWhen(i),treeStarWhen(i)+.65)),0)/TREE_STARS.length;
  return {growth,face:ease(seg(growth,.02,1)),canopy:ease(growth)};
}
function climbingStarState(t){
  if(t<72.95||t>74.85)return null;
  return {x:kf(t,[[72.95,1320],[73.5,1320],[73.95,1190],[74.3,1000]]),y:kf(t,[[72.95,838],[73.5,590],[73.95,430],[74.3,343]]),
    r:lerp(18,8,ease(seg(t,72.95,74.3)))*(1-ease(seg(t,74.3,74.85)))};
}
function countryCam(t){
  const k=ease(seg(t,85,88.6)),zoom=lerp(1,7.2,k);return {cx:1015-55*(1-k)/zoom,cy:832-292*(1-k)/zoom,zoom};
}
