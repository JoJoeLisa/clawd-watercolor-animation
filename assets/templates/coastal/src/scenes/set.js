// set.js: world, backpack, wish motif for 《成长的路口》— seaside dawn → dusk city → night crossroads.
// NO pelican, NO bicycle. Bustle is distant soft silhouettes only.

const GROUND = 900;          // sidewalk / ground y
const LOOK = {
  dawn: {
    sky: '#A8C4D8', sky2: '#E8D5B8', far: '#7A9A8E', near: '#6B8F72',
    sea: '#6A9BB0', sand: '#D8C4A0', road: '#8A8070',
    house: '#C4A890', roof: '#8B5A4A', win: '#F5D9A0',
    rail: '#5A5048', top: '#B8A890', face: '#8A7A68', edge: '#D0C0A0',
    winOn: 0, stars: 0, lamp: 0.15,
  },
  dusk: {
    sky: '#E8A878', sky2: '#C45C6A', far: '#8A6A78', near: '#6A5870',
    sea: '#6A7088', sand: '#C4A888', road: '#6A6058',
    house: '#C89878', roof: '#7A3A3A', win: '#FFE0A0',
    rail: '#4A4038', top: '#A89880', face: '#6A5A4A', edge: '#C8B898',
    winOn: 0.55, stars: 0, lamp: 0.7,
  },
  night: {
    sky: '#2A2848', sky2: '#1A1830', far: '#3A3858', near: '#2A2840',
    sea: '#2A3850', sand: '#4A4050', road: '#3A3848',
    house: '#4A4058', roof: '#2A2038', win: '#FFE3A0',
    rail: '#2A2838', top: '#4A4858', face: '#2A2838', edge: '#5A5868',
    winOn: 1, stars: 1, lamp: 1,
  },
  fantasy: {
    sky: '#F0C878', sky2: '#E87868', far: '#A88878', near: '#887868',
    sea: '#7898A8', sand: '#D8C090', road: '#7A7060',
    house: '#C8A888', roof: '#8A4A3A', win: '#FFE8B0',
    rail: '#5A5040', top: '#B8A880', face: '#7A6A58', edge: '#D0C090',
    winOn: 0.3, stars: 0, lamp: 0.4,
  },
};

function lumpy(cx, cy, rx, ry, seed, n = 22) {
  const p = [];
  for (let k = 0; k < n; k++) {
    const a = k / n * TAU, w = 1 + .13 * Math.sin(a * 5 + seed) + .07 * Math.sin(a * 9 + seed * 2);
    p.push([cx + Math.cos(a) * rx * w, cy + Math.sin(a) * ry * w]);
  }
  return p;
}

function skyWash(L, t) {
  boilSeed('sky');
  const bounds=worldBounds();
  paint(rectPts(bounds.left,bounds.top,bounds.right-bounds.left,bounds.bottom-bounds.top),{wash:L.sky,ink:null});
  paint(ellPts((CAM?CAM.cx:W/2)+W*.05, H * .15, W * .7, H * .35, 28, 12), { fill: L.sky2, fillOp: 140, bleed: .35, tex: .5, ink: null });
  // soft clouds (sparse at night so moon reads)
  const nCloud = L.stars ? 2 : 5;
  for (let i = 0; i < nCloud; i++) {
    boilSeed('cloud' + i);
    const x = ((hash(i) * W * 1.4 + t * (8 + 6 * hash(i + 3))) % (W + 500)) - 200;
    const y = 120 + 160 * hash(i + 10);
    paint(lumpy(x, y, 160 + 80 * hash(i + 2), 50 + 30 * hash(i + 5), i * 7), {
      fill: mixCol(PAL.cream, L.sky, .35), fillOp: L.stars ? 45 : 90, bleed: .4, tex: .4, ink: null,
    });
  }
  if (L.stars) {
    for (let i = 0; i < 18; i++) {
      boilSeed('st' + i);
      const tw = .55 + .45 * Math.sin(t * (2 + 2 * hash(i + 30)) + i);
      paint(starPts(hash(i) * W, hash(i + 40) * H * .45, (2 + 4 * hash(i + 20)) * tw, .35, 4), {
        wash: PAL.cream, washOp: Math.min(255, 120 + 90 * tw), ink: null,
      });
    }
  }
}

function sunDisk(x, y, r, warm = 1) {
  boilSeed('sun');
  glow(x, y, r * 2.4, '#FFC766', .35 * warm);
  paint(ellPts(x, y, r, r, 24, 1.5), { wash: mixCol(PAL.cream, PAL.ochre, .4), fill: PAL.ochre, fillOp: 80, ink: null });
}

// Broken watercolor ripples, slow rolling swells and transparent shore foam.
function seaBand(L,t,y0=620,o={}){
  const bounds=worldBounds();boilSeed('sea');
  paint(rectPts(bounds.left,y0,bounds.right-bounds.left,225),{wash:L.sea,fill:mixCol(L.sea,PAL.ink,.15),fillOp:70,bleed:.08,tex:.5,ink:null});
  for(let row=0;row<5;row++){
    const spacing=135+row*38,y=y0+17+row*row*6.5,drift=7+row*2;
    for(let i=Math.floor((bounds.left-t*drift)/spacing)-1;i<=Math.ceil((bounds.right-t*drift)/spacing);i++){
      const x=i*spacing+t*drift+30*(hash(i+row*29)-.5),len=22+row*13+hash(i+row*37+4)*38;
      boilSeed('water-ripple'+row+'-'+i);
      const yy=y+4*Math.sin(t*.7+i*1.3+row),pts=[];
      for(let j=0;j<5;j++)pts.push([x+j*len/4,yy+2.5*Math.sin(j*.8+t*.8+i)]);
      inkLine(pts,.32+row*.08,mixCol(PAL.cream,L.sea,.62-row*.04),'inkfine',.28);
    }
  }
  for(let row=0;row<2;row++){
    boilSeed('coastal-swell'+row);const pts=[];
    for(let x=bounds.left;x<=bounds.right+45;x+=45)pts.push([x,y0+139+row*37+5*Math.sin(x/115-t*.8-row)]);
    const underside=pts.map(([x,y])=>[x,y+9+row*4]).reverse();
    paint([...pts,...underside],{wash:mixCol(L.sea,L.sky,.28),washOp:105,fill:mixCol(L.sea,PAL.cream,.14),fillOp:28,bleed:.24,tex:.7,ink:null});
  }
  if(Number.isFinite(o.sunX)){
    for(let i=0;i<13;i++){
      const depth=i/12,y=y0+12+depth*155,x=o.sunX+15*Math.sin(t*.65+i*1.7),w=9+depth*53;
      boilSeed('sea-sun-glint'+i);
      paint(ellPts(x,y,w,1.7+depth*2.1,12,.7),{wash:mixCol(PAL.cream,PAL.ochre,.12),washOp:65+45*Math.sin(t*.75+i)**2,fillOp:30,bleed:.28,ink:null});
    }
  }
  // Far-scale boats belong to the water, bobbing gently rather than sliding with the street.
  for(let i=0;i<2;i++){
    const x=i?1870-3.2*t:540+5*t,y=y0+36+i*34+1.6*Math.sin(t*.8+i),w=26+i*12;
    if(x<bounds.left-50||x>bounds.right+50)continue;boilSeed('distant-coastal-boat'+i);
    paint([[x-w/2,y],[x+w/2,y],[x+w*.34,y+6],[x-w*.31,y+6]],{wash:mixCol(L.far,PAL.ink,.24),washOp:185,ink:null});
    inkLine([[x,y],[x,y-24]],.36,mixCol(L.far,PAL.cream,.12),'inkfine',.1);
    paint([[x+1,y-23],[x+1,y-3],[x+w*.36,y-3]],{wash:mixCol(PAL.cream,L.sky,.28),washOp:170,ink:null});
    inkLine([[x-w,y+9],[x+w*1.3,y+9]],.3,mixCol(PAL.cream,L.sea,.68),'inkfine',.1);
  }
  boilSeed('sand');
  paint(rectPts(bounds.left,y0+200,bounds.right-bounds.left,200),{wash:L.sand,fill:mixCol(L.sand,PAL.ink,.2),fillOp:60,tex:.6,ink:null});
  if(o.foam!==false)shoreFoam(L,t,y0);
}
function shoreFoam(L,t,y0){
  const bounds=worldBounds();
  for(let i=Math.floor(bounds.left/310)-1;i<=Math.ceil(bounds.right/310);i++){
    const x=i*310,phase=t*.62+i*.37,y=y0+191+8*Math.sin(phase),points=[];
    for(let j=0;j<8;j++)points.push([x+j*38,y+2.4*Math.sin(j*.65+phase)]);
    boilSeed('shore-wash'+i);
    paint(ribbon(points,4.8,1.8),{wash:mixCol(PAL.cream,L.sea,.13),washOp:110+35*Math.sin(phase)**2,fillOp:28,bleed:.35,tex:.8,ink:null});
    for(let j=0;j<3;j++){
      const xx=x+25+j*82;boilSeed('foam-fleck'+i+'-'+j);
      inkLine([[xx,y+6],[xx+15,y+8],[xx+34,y+7]],.42,mixCol(PAL.cream,L.sand,.15),'inkfine',.18);
    }
  }
}
function coastalGulls(t,L=LOOK.dusk){
  if(L.stars)return;
  for(let i=0;i<3;i++){
    const x=420+i*520+t*(12+i*2),y=458+i*32+7*Math.sin(t*.7+i),flap=5*Math.sin(t*2.5+i),w=12+i*2;
    boilSeed('coastal-gull'+i);
    inkLine([[x-w,y-2],[x-w*.42,y-5-flap],[x,y],[x+w*.45,y-4-flap],[x+w,y-2]],.48,mixCol(PAL.ink,L.sky,.45),'inkfine',.12);
  }
}

function mistLayer(t, a = .35) {
  boilSeed('mist');
  for (let i = 0; i < 4; i++) {
    const x = ((t * 12 + i * 400) % (W + 300)) - 100;
    paint(ellPts(x, 700 + i * 40, 280, 60, 20, 8), { fill: PAL.cream, fillOp: 55 * a, bleed: .5, ink: null });
  }
}

// Half-crop city block: buildings start mid-frame so we only see lower floors (reference composition).
function cityBlock(L, t, o = {}) {
  const base = o.baseY ?? 520;   // roof line crops above frame / or just into upper third
  boilSeed('cityfar');
  // far soft silhouettes
  for (let i = 0; i < 4; i++) {
    const x = -80 + i * 320 + 40 * hash(i);
    const h = 180 + 120 * hash(i + 2);
    paint(rectPts(x, base - h * .55, 200 + 80 * hash(i + 5), h * .55 + 40, 1), {
      wash: mixCol(L.far, L.sky, .25), fill: L.far, fillOp: 100, bleed: .05, tex: .4, ink: null,
    });
  }
  boilSeed('citynear');
  const houseCols = [L.house, mixCol(L.house, PAL.rose, .25), mixCol(L.house, PAL.ochre, .2), mixCol(L.house, PAL.cream, .15)];
  for (let i = 0; i < 4; i++) {
    boilSeed('bldg' + i);
    const x = -40 + i * 420 + 30 * (hash(i) - .5);
    const w = 240 + 130 * hash(i + 3);
    const col = houseCols[i % houseCols.length];
    paint(rectPts(x, base - 40, w, GROUND - (base - 40) + 20, 1.2), {
      wash: col, fill: mixCol(col, PAL.ink, .18), fillOp: 80, bleed: .04, tex: .55, ink: PAL.ink, sw: .7,
    });
    if (hash(i + 17) > .4) {
      const aw = mixCol(PAL.rose, PAL.ochre, hash(i + 19));
      paint([[x + 20, GROUND - 130], [x + w - 20, GROUND - 130], [x + w - 10, GROUND - 100], [x + 10, GROUND - 100]], {
        wash: aw, ink: PAL.ink, sw: .55,
      });
    }
    // windows — sparse, some lit
    for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) {
      if (hash(i * 20 + r * 5 + c) < .35) continue;
      const wx = x + 40 + c * (w - 80) / 2.2, wy = base + 30 + r * 70;
      if (wy > GROUND - 120) continue;
      const lit = L.winOn > 0 && hash(i * 11 + r + c) < L.winOn;
      paint(rectPts(wx, wy, 28, 36, .5), { wash: lit ? L.win : mixCol(L.house, PAL.ink, .35), ink: null });
      if (lit) glow(wx + 14, wy + 18, 40, '#FFC766', .25);
    }
    // door
    paint(rectPts(x + w * .4, GROUND - 110, w * .18, 110, .6), {
      wash: mixCol(L.roof, PAL.ink, .1), ink: PAL.ink, sw: .55,
    });
  }
}

function sidewalk(L) {
  boilSeed('sidewalk');const bounds=worldBounds();
  paint(rectPts(bounds.left,GROUND-8,bounds.right-bounds.left,220), {
    wash: L.top, fill: mixCol(L.top, PAL.ink, .22), fillOp: 55, tex: .55, bleed: .03, ink: null,
  });
  inkLine([[bounds.left,GROUND-6],[(bounds.left+bounds.right)/2,GROUND-10],[bounds.right,GROUND-5]], 1.1, PAL.ink, 'ink', .4);
  // Pavement joints stay fixed in the world as the camera tracks the character.
  for(let i=Math.floor(bounds.left/160);i<Math.ceil(bounds.right/160);i++){
    boilSeed('paving-joint'+i);const x=i*160;
    inkLine([[x,GROUND-4],[x+24,GROUND+68]],.38,mixCol(L.top,L.rail,.28),'inkfine',.16);
  }
  // curb / road below
  paint(rectPts(bounds.left,GROUND+70,bounds.right-bounds.left,200), {
    wash: L.road, fill: mixCol(L.road, PAL.ink, .25), fillOp: 70, tex: .5, ink: null,
  });
  inkLine([[bounds.left,GROUND+69],[bounds.right,GROUND+69]],.7,mixCol(L.edge,L.top,.35),'inkfine',.12);
  // dashed road center
  for(let i=Math.floor(bounds.left/180)-1;i<Math.ceil(bounds.right/180)+1;i++){
    const x = i * 180 + 40;
    paint(rectPts(x, GROUND + 140, 70, 10, .4), { wash: mixCol(PAL.cream, L.road, .5), washOp: 160, ink: null });
  }
}

function lampPost(x, L, on = 1) {
  boilSeed('lamp' + x);
  const top = 380, col = mixCol(L.rail, L.face, .3);
  paint(rectPts(x - 8, top, 16, GROUND - top), { wash: col, ink: PAL.ink, sw: .7 });
  paint(rectPts(x - 22, GROUND - 14, 44, 14), { wash: col, ink: PAL.ink, sw: .7 });
  inkLine([[x, top + 16], [x + 36, top - 8], [x + 64, top + 8]], 2.6, col, 'ink', .5);
  paint([[x + 44, top + 4], [x + 86, top + 4], [x + 78, top + 52], [x + 52, top + 52]], {
    wash: on ? '#FFE3A0' : mixCol(L.face, PAL.cream, .3), ink: PAL.ink, sw: .7,
  });
  paint([[x + 40, top - 2], [x + 90, top - 2], [x + 65, top - 16]], { wash: col, ink: PAL.ink, sw: .7 });
  if (on > .05) glow(x + 65, top + 30, 150 * on, '#FFC766', .75 * on);
}

// Distant soft car blurs — city bustle, never interacting with Clawd.
function bustleCars(L, t, a = .45) {
  for (let i = 0; i < 2; i++) {
    boilSeed('car' + i);
    const speed = 90 + 60 * hash(i);
    const x = ((t * speed + i * 500 + hash(i) * 200) % (W + 400)) - 200;
    const y = GROUND + 110 + 18 * hash(i + 2);
    const w = 90 + 40 * hash(i + 4), h = 28 + 10 * hash(i + 6);
    paint(rrPts(x, y - h, w, h, 8), {
      wash: i ? mixCol(PAL.clay,PAL.ochre,.3) : mixCol(PAL.sap,L.sea,.42), washOp: 220 * a, fill: L.far, fillOp: 60 * a, bleed: .15, ink: null,
    });
    if (L.lamp > .4) {
      glow(x + 8, y - h * .4, 28, '#FFE0A0', .25 * a);
      glow(x + w - 8, y - h * .4, 22, '#E07060', .2 * a);
    }
  }
}

function palmCrown(x, y, s, t, seed = 0) {
  boilSeed('palm' + seed);
  for (let i = 0; i < 7; i++) {
    const a = -Math.PI / 2 + (i - 3) * .28 + .04 * Math.sin(t * 1.5 + i);
    const len = s * (0.9 + .25 * hash(seed + i));
    const tip = [x + Math.cos(a) * len, y + Math.sin(a) * len + 8 * Math.sin(t * 1.2 + i)];
    inkLine([[x, y], [lerp(x, tip[0], .5) + 10 * Math.sin(a), lerp(y, tip[1], .45)], tip], 1.1, mixCol(PAL.sap, PAL.ink, .15), 'ink', .5);
    // thin leaflets
    for (let k = 1; k < 5; k++) {
      const q = k / 5;
      const px = lerp(x, tip[0], q), py = lerp(y, tip[1], q);
      const nx = -Math.sin(a), ny = Math.cos(a);
      inkLine([[px, py], [px + nx * s * .22 * (1 - q), py + ny * s * .22 * (1 - q)]], .45, mixCol(PAL.sap, PAL.cream, .2), 'inkfine', 0);
    }
  }
}

// Front/q: straps only (never cover the face). Full bag on back / side (world).
function backpackStraps(flip = false) {
  return (u, sw) => {
    boilSeed('packstraps');
    const s = flip ? -1 : 1;
    inkLine([[s * -3.4 * u, -7.6 * u], [s * -4.8 * u, -5.4 * u], [s * -4.5 * u, -3.0 * u]], sw * .85, mixCol('#3E5F86', PAL.ink, .2), 'ink', .35);
    inkLine([[s * 3.4 * u, -7.6 * u], [s * 4.8 * u, -5.4 * u], [s * 4.5 * u, -3.0 * u]], sw * .85, mixCol('#3E5F86', PAL.ink, .2), 'ink', .35);
    paint(rrPts(s * -0.2 * u - 1.6 * u, -7.9 * u, 3.2 * u, 1.1 * u, .25 * u), {
      wash: '#5B7FA8', ink: PAL.ink, sw: sw * .5,
    });
  };
}
function backpackBack(flip = false) {
  return (u, sw) => {
    boilSeed('packback');
    paint(rrPts(-2.2 * u, -7.4 * u, 4.4 * u, 4.8 * u, .5 * u), {
      wash: '#5B7FA8', fill: mixCol('#5B7FA8', PAL.ink, .25), fillOp: 70, ink: PAL.ink, sw: sw * .7,
    });
    paint(rrPts(-2.0 * u, -7.6 * u, 4.0 * u, 1.4 * u, .35 * u), {
      wash: '#3E5F86', ink: PAL.ink, sw: sw * .55,
    });
    paint(rrPts(-1.4 * u, -4.6 * u, 2.8 * u, 1.5 * u, .3 * u), {
      wash: mixCol('#5B7FA8', PAL.cream, .15), ink: PAL.ink, sw: sw * .45,
    });
  };
}

// World-space backpack for side view (behind the body).
function backpackSide(x, y, u, flip, bob = 0) {
  boilSeed('packside');
  const dir = flip ? -1 : 1;
  const bx = x - dir * 3.2 * u, by = y - 5.5 * u + bob;
  paint(rrPts(bx - 1.6 * u, by - 2.2 * u, 3.2 * u, 4.0 * u, .4 * u), {
    wash: '#5B7FA8', fill: mixCol('#5B7FA8', PAL.ink, .22), fillOp: 75, ink: PAL.ink, sw: clamp(u / 18, .5, 1.2),
  });
  paint(rrPts(bx - 1.4 * u, by - 2.4 * u, 2.8 * u, 1.2 * u, .3 * u), {
    wash: '#3E5F86', ink: PAL.ink, sw: clamp(u / 20, .4, 1),
  });
  inkLine([[bx, by - 2.0 * u], [bx + dir * 2.2 * u, by + .4 * u]], .7, PAL.ink, 'inkfine', .3);
}

// Paper wish — small folded paper bird / scrap that flies.
function paperWish(x, y, s, ang, t, o = {}) {
  boilSeed('wish' + (o.seed || 0));
  push(); translate(x, y); rotate(ang + .08 * Math.sin(t * 6));
  const flutter = 1 + .06 * Math.sin(t * 10);
  paint([[-s * flutter, 0], [s * .2, -s * .55], [s * flutter, 0], [s * .15, s * .4]], {
    wash: mixCol(PAL.cream, PAL.ochre, .2), fill: PAL.cream, fillOp: 90, ink: PAL.ink, sw: .55, curv: .3,
  });
  paint(ellPts(0, -s * .1, s * .18, s * .18, 8), { wash: PAL.rose, ink: null });
  pop();
  if (o.glow) glow(x, y, s * 2.2, '#FFE9A8', .35 * o.glow);
}

function seedGlow(x, y, t, k = 1) {
  boilSeed('seed');
  glow(x, y, 70 + 90 * k, '#FFE9A8', .65 * k);
  glow(x, y - 30 * k, 50 * k, '#FFC766', .35 * k);
  paint(ellPts(x, y, 14 * k, 11 * k, 14), { wash: mixCol(PAL.ochre, PAL.cream, .35), fill: PAL.cream, fillOp: 70, ink: PAL.ink, sw: .6 });
  const sway = 5 * Math.sin(t * 2);
  inkLine([[x, y - 6], [x + sway * .3, y - 28 * k], [x + sway, y - 52 * k]], 1.1, PAL.sap, 'ink', .5);
  paint(ellPts(x + sway - 8, y - 54 * k, 10 * k, 6 * k, 10), { wash: PAL.sap, fill: mixCol(PAL.sap, PAL.cream, .3), fillOp: 90, ink: PAL.ink, sw: .45 });
  paint(ellPts(x + sway + 10, y - 48 * k, 9 * k, 5 * k, 10), { wash: mixCol(PAL.sap, PAL.ochre, .2), fill: PAL.sap, fillOp: 70, ink: PAL.ink, sw: .4 });
}

function puddle(x, y, rx, ry) {
  boilSeed('puddle');
  paint(ellPts(x, y, rx, ry, 24, 2), {
    wash: mixCol(PAL.sky, PAL.ink, .15), fill: mixCol(PAL.indigo, PAL.cream, .3), fillOp: 90, bleed: .2, tex: .3, ink: PAL.ink, sw: .45,
  });
}

function horizonWave(x, y, t, k) {
  if (k < .02) return;
  boilSeed('hzwave');
  glow(x, y, 80 * k, '#FFC766', .4 * k);
  const wob = 6 * Math.sin(t * 4);
  inkLine([[x - 30, y + 10], [x - 10, y - 20 + wob], [x + 15, y - 5], [x + 35, y - 25 + wob]], 1.4 * k, mixCol(PAL.ochre, PAL.cream, .3), 'ink', .5);
}

function clawdPack(x, y, u, o = {}) {
  const view = o.view || 'front';
  const flip = !!o.flip;
  const noPack = !!o.noPack;
  if (!noPack && (view === 'side' || view === 'qback')) {
    backpackSide(x, y, u, flip, (o.dy || 0) * u * .15);
  }
  let packHook = null;
  if (!noPack) {
    if (view === 'back') packHook = backpackBack(flip);
    else if (view === 'front' || view === 'q') packHook = backpackStraps(flip);
  }
  clawd(x, y, u, {
    ...o,
    draw: packHook
      ? (uu, sw) => { packHook(uu, sw); if (o.draw) o.draw(uu, sw); }
      : o.draw,
  });
}
