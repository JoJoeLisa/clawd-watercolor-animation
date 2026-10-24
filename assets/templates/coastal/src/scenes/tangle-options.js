// User selected A and explicitly requested slightly thicker, messier loops. Pale colour and slow whole-knot rotation remain.
const TANGLE_SELECTION='A';
const TANGLE_OPTIONS={A:{name:'淡灰旋涡',col:'#A8A1A5',period:8},B:{name:'浅紫线团',col:'#AAA0B1',period:10},C:{name:'细线绕圈',col:'#A6ADB0',period:12}};
function softTanglePaths(u,t,style,seed=0){
  const a=t*TAU/TANGLE_OPTIONS[style].period+seed*.22,c=Math.cos(a),s=Math.sin(a),P=(x,y)=>[(x*c-y*s)*u,(-9.45+.47*(x*s+y*c))*u],paths=[];
  if(style==='A'){
    const pts=[];for(let i=0;i<=88;i++){const q=i/88,b=q*TAU*4,r=.28+q*1.42+.17*Math.sin(b*2.3);pts.push(P(r*Math.cos(b)+.17*Math.sin(b*1.7),r*Math.sin(b)));}paths.push(pts);
  }else if(style==='B'){
    const pts=[];for(let i=0;i<=76;i++){const b=i/76*TAU;pts.push(P(1.62*Math.sin(b*3),1.1*Math.cos(b*4)));}paths.push(pts);
  }else{
    for(let k=0;k<3;k++){const pts=[],r=1.65-k*.5;for(let i=0;i<=34;i++){const b=i/34*TAU*.83+k*.8;pts.push(P(r*Math.cos(b),r*Math.sin(b)));}paths.push(pts);}
  }return paths;
}
function drawSoftTangle(u,t,style='A',seed=0){
  const settle=1-ease(seg(t,27.1,28));if(settle<.02)return;
  const option=TANGLE_OPTIONS[style];boilSeed('soft-thought-knot'+style+seed);
  for(const pts of softTanglePaths(u,t,style,seed))inkLine(pts.map(([x,y])=>[x*settle,y]),(style==='A'?.82:.53)*settle,option.col,'inkfine',.48);
}
LOOPS.softTangles=t=>{
  boilSeed('comparison-paper');paint(rectPts(-60,-60,2040,1200),{wash:PAL.paper,ink:null});
  for(const [i,style]of['A','B','C'].entries()){
    const x=320+i*640,option=TANGLE_OPTIONS[style];
    if(i){boilSeed('comparison-divider'+i);inkLine([[i*640,170],[i*640,540],[i*640,900]],.5,mixCol(PAL.ink,PAL.paper,.83),'inkfine',.05);}
    letter(style+' · '+option.name,x,205,42,PAL.ink,{font:'42px "Ma Shan Zheng"',ink:false});
    letter(option.period+'秒一圈',x,270,28,mixCol(PAL.ink,PAL.paper,.35),{font:'28px "Ma Shan Zheng"',ink:false});
    clawdPack(x,765,34,{view:'q',eyes:'look',mouth:'wobble',lookY:-.15,aL:-.45,aR:-.45,boilKey:'comparison-clawd',draw:u=>drawSoftTangle(u,t+7,style)});
  }
  letter('同一画风 · 淡色细线 · 慢速规律旋转',960,960,32,mixCol(PAL.ink,PAL.paper,.35),{font:'32px "Ma Shan Zheng"',ink:false});
};LOOPS.softTangles.len=8;
