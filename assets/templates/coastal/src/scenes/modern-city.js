// Modern forms, the same watercolor pigment / ink / grain as the supplied animation.
function cityBlock(L,t,o={}){
  if(o.waterfront!==false){seaBand(L,t,575);coastalGulls(t,L);}
  const left=CAM?CAM.cx-W/(2*CAM.zoom)-120:-300,right=CAM?CAM.cx+W/(2*CAM.zoom)+120:W+300,
    top=CAM?CAM.cy-H/(2*CAM.zoom)-100:-150;
  for(let i=Math.floor(left/390)-1;i<=Math.ceil(right/390);i++){
    const x=i*390,h=590+280*hash(i+183);boilSeed('city-depth'+i);
    paint(rectPts(x,GROUND-h,430,h,1),{wash:mixCol(L.far,L.sky,.3),washOp:180,fill:L.far,fillOp:48,bleed:.12,tex:.7,ink:null});
  }
  const first=o.first??Math.floor(left/280)-1,last=o.last??Math.ceil(right/280)+1;
  for(let i=first;i<=last;i++){
    const x=i*280+16*(hash(i+70)-.5),w=310+55*hash(i+3),roof=GROUND-[820,1340,1020,760,1260][((i%5)+5)%5];
    if(x+w<left||x>right)continue;
    boilSeed('tower'+i);
    const clippedRoof=Math.max(roof,top-80);
    const col=mixCol(L.house,i%3===0?L.far:PAL.cream,i%3===0?.20:.11);
    paint(rectPts(x,clippedRoof,w,GROUND-clippedRoof+10,1.0),{wash:col,fill:mixCol(col,L.far,.22),fillOp:74,bleed:.045,tex:.55,ink:PAL.ink,sw:.65});
    paint(rectPts(x+w*.84,clippedRoof,w*.16,GROUND-clippedRoof,1),{wash:mixCol(col,L.rail,.24),fill:L.far,fillOp:45,bleed:.05,tex:.5,ink:null});
    // Narrow glass ribs echo contemporary office towers without digital gradients.
    for(let j=0;j<3;j++){
      const xx=x+25+j*(w-70)/3;
      paint(rectPts(xx,Math.max(roof,top),18,GROUND-130-Math.max(roof,top),.6),{wash:mixCol(L.far,L.sky,.22),washOp:95,ink:null});
    }
    for(let floor=0;floor<25;floor++){
      const y=GROUND-185-floor*70;if(y<Math.max(top,roof+25)||y>GROUND-140)continue;
      boilSeed('tower-floor'+i+'-'+floor);
      inkLine([[x+7,y+43],[x+w*.75,y+43]],.28,mixCol(col,L.rail,.15),'inkfine',.06);
      for(let j=0;j<3;j++){
        const xx=x+36+j*(w-105)/3,lit=hash(i*311+floor*17+j+9)<L.winOn*.18;
        boilSeed('tower-window'+i+'-'+floor+'-'+j);
        const windowCol=lit?L.win:mixCol(L.far,col,.17);
        paint(rectPts(xx,y,36,34,.7),{wash:windowCol,washOp:lit?235:130,ink:null});
        if(lit)glow(xx+18,y+17,25,'#FFC766',.12+.018*Math.sin(t*.65+i+floor));
      }
    }
    // Ground-floor glazing and a restrained doorway, rather than small-house roofs and awnings.
    boilSeed('tower-lobby'+i);
    paint(rectPts(x+35,GROUND-125,w*.64,125,.6),{wash:mixCol(L.far,L.house,.3),washOp:185,ink:PAL.ink,sw:.4});
    for(let j=1;j<4;j++)inkLine([[x+35+j*w*.16,GROUND-124],[x+35+j*w*.16,GROUND-4]],.5,mixCol(L.rail,L.house,.18),'inkfine',.05);
    inkLine([[x+31,GROUND-126],[x+w*.78,GROUND-126]],1.0,mixCol(L.rail,L.house,.2),'ink',.05);
  }
}
// A fixed curb-side pedestrian railing: drawn after the walker, before near-lane traffic.
function streetBarrier(L,o={}){
  const b=worldBounds(),left=Math.max(b.left,o.start??-Infinity),right=b.right,base=GROUND+64,top=GROUND-34;
  const gaps=o.gaps||[],col=mixCol(L.rail,L.sky,.35),clear=(a,z)=>!gaps.some(([g0,g1])=>z>g0&&a<g1);
  for(let i=Math.floor(left/220);i<Math.ceil(right/220);i++){
    const x=i*220;if(x<left||!clear(x,x+220))continue;boilSeed('curb-rail'+i);
    inkLine([[x,base],[x,(base+top)/2],[x,top]],1.15,col,'ink',.16);
    inkLine([[x,top],[x+110,top-1],[x+220,top]],.9,col,'ink',.14);
    inkLine([[x,top+56],[x+110,top+56],[x+220,top+56]],.65,col,'inkfine',.1);
    for(let j=1;j<4;j++)inkLine([[x+j*55,top+5],[x+j*55,(top+base)/2],[x+j*55,base-8]],.52,col,'inkfine',.11);
    paint(ellPts(x,top+3,3,4,10,.15),{wash:mixCol(PAL.cream,L.win,.18),ink:null});
  }
}
function lampPost(x,L,on=1){
  boilSeed('modern-lamp'+x);const top=415,col=mixCol(L.rail,L.face,.3),amber=mixCol(PAL.ochre,PAL.clay,.38);
  if(on>.05){
    boilSeed('lamp-amber-cone'+x);
    paint([[x+44,top+5],[x+98,top+5],[x+240,GROUND+14],[x-96,GROUND+14]],{wash:amber,washOp:32*on,fill:amber,fillOp:70*on,bleed:.5,tex:.8,border:.02,ink:null});
    paint([[x+57,top+7],[x+87,top+7],[x+163,GROUND+8],[x-19,GROUND+8]],{wash:amber,washOp:32*on,fill:mixCol(amber,PAL.cream,.2),fillOp:115*on,bleed:.5,tex:.8,border:.02,ink:null});
    paint(ellPts(x+72,GROUND+10,156,23,32,1),{wash:amber,washOp:25*on,fill:amber,fillOp:80*on,bleed:.55,tex:.7,ink:null});
    // The kit's existing soft glow texture supplies actual emitted light; pigment washes soften its cone edge.
    flushBrush();push();beginClip();noStroke();fill(0,0);beginShape();
    for(const [px,py]of[[x+44,top+5],[x+98,top+5],[x+240,GROUND+14],[x-96,GROUND+14]])vertex(px,py);
    endShape(CLOSE);endClip();translate(x+72,top+260);scale(.50,1);glow(0,0,256,'#FFB66C',.24*on);pop();

  }

  boilSeed('modern-lamp-body'+x);
  paint(rrPts(x-5,top+18,10,GROUND-top-18,3,.4),{wash:col,fill:mixCol(col,L.sky,.20),fillOp:45,tex:.45,ink:PAL.ink,sw:.55});
  paint(rrPts(x-15,GROUND-9,30,9,2,.4),{wash:col,ink:PAL.ink,sw:.4});
  inkLine([[x,top+36],[x+3,top+6],[x+30,top-2],[x+59,top-2]],2.1,col,'ink',.6);
  paint(rrPts(x+36,top-10,74,13,4,.5),{wash:col,fill:mixCol(col,L.sky,.12),fillOp:40,ink:PAL.ink,sw:.4});
  paint(rrPts(x+42,top,60,4,1,.25),{wash:mixCol(PAL.cream,PAL.ochre,.68*on),ink:null});
  if(on>.05)glow(x+72,top+7,99*on,'#FFC766',.44*on);
}
