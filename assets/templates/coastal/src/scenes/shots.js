// shots.js: 《成长的路口》— Clawd + backpack, seaside open → lonely dusk city walk → wish at crossroads.
(() => {
  const WD = [PAL.indigo, PAL.sky];       // dawn wipe
  const WC = [PAL.clayDk, PAL.ochre];     // city / dusk wipe
  const WN = [PAL.indigo, PAL.violet];    // night wipe
  const WF = ['#C45C6A', '#E8A878'];      // fantasy wipe

  // ---------- Ch.0 · 0–4.06 · seaside dawn intro ----------
  function shotIntro(t, lt, dur) {
    const L = LOOK.dawn;
    camBegin(960 + 20 * Math.sin(lt * .5), kf(lt, [[0, 560], [4, 540]]), kf(lt, [[0, .95], [4, 1.08]]));
    skyWash(L, t);
    sunDisk(1480, 220, 55, .7);
    seaBand(L, t, 600);
    mistLayer(t, .45);
    // shore road strip
    boilSeed('road');
    paint(rectPts(-300, GROUND - 40, W + 600, 80), {
      wash: L.road, fill: mixCol(L.road, PAL.ink, .2), fillOp: 70, tex: .5, ink: PAL.ink, sw: .6,
    });
    palmCrown(280, 520, 160, t, 1);
    palmCrown(1680, 500, 190, t, 2);
    // Clawd walks toward camera from far
    const k = easeOut(seg(lt, .4, 3.8));
    const u = lerp(14, 22, k);
    const x = lerp(960, 920, k) + 8 * Math.sin(lt * 2);
    const walk = stroll(lt, .5, 4.0, 960, 900, u);
    const mood = emotions(lt, [[0, 'sad', { lookX: .2 }], [2.2, 'sad', { lookX: -.1, lookY: .15 }]], { take: .5 });
    clawdPack(walk.x, GROUND - 20, u, {
      ...mood, view: 'q', walk: walk.walk, dy: (mood.dy || 0) * .35 + walk.dy,
    });
    // distant gull (not pelican) — tiny V
    boilSeed('gull');
    const gx = 400 + (t * 40) % 900, gy = 260 + 10 * Math.sin(t * 2);
    inkLine([[gx - 18, gy], [gx, gy - 8], [gx + 18, gy]], .6, mixCol(PAL.ink, L.sky, .3), 'inkfine', .3);
    const at = toScreen(walk.x, GROUND - 20 - 4 * u);
    camEnd();
    if (lt < .7) iris(...at, lerp(0, 1600, easeIn(lt / .7)), PAL.night);
    boilSeed('wipe');
    if (lt > dur - .35) brushWipe((lt - (dur - .35)) / .7, WD);
  }

  // ---------- Ch.1a · 4.06–7.06 · 特别不想 · face close ----------
  function shotDontWant(t, lt, dur) {
    const L = LOOK.dusk;
    camBegin(960 + 12 * Math.sin(lt * .7), 620, 1.35 + .04 * lt);
    skyWash(L, t);
    sunDisk(1600, 380, 70, 1);
    cityBlock(L, t, { baseY: 480 });
    sidewalk(L);
    lampPost(420, L, L.lamp);
    lampPost(1500, L, L.lamp * .8);
    bustleCars(L, t, .25);
    const mood = emotions(lt, [
      [0, 'sad', { lookX: -.4, lookY: .25, emote: null }],
      [1.4, 'sad', { lookX: -.2, lookY: .3, emote: null }],
    ], { take: .7 });
    const idle = feel('sad', t);
    clawdPack(980, GROUND, 38, {
      ...mood, view: 'q', flip: true,
      dy: (mood.dy || 0) + (idle.dy || 0) * .4,
      aL: -.35, aR: -.15,
    });
    // wind tug on strap — secondary line
    boilSeed('wind');
    inkLine([[1040, 700], [1080 + 10 * Math.sin(t * 5), 680], [1120 + 8 * Math.sin(t * 4 + 1), 720]], .5, mixCol(PAL.cream, L.sky, .4), 'inkfine', .4);
    camEnd();
    boilSeed('wipe');
    if (lt < .3) brushWipe(.5 + lt / .6, WD);
  }

  // ---------- Ch.1b · 7.06–12.06 · 一个人孤单寂寞 · wide lonely ----------
  function shotAlone(t, lt, dur) {
    const L = LOOK.dusk;
    camBegin(kf(lt, [[0, 1000], [5, 920]]), kf(lt, [[0, 560], [5, 540]]), kf(lt, [[0, 1.05], [1.2, .92], [5, .88]]));
    skyWash(L, t);
    sunDisk(1700, 340, 80, 1);
    cityBlock(L, t, { baseY: 500 });
    sidewalk(L);
    lampPost(280, L, L.lamp);
    lampPost(900, L, L.lamp * .9);
    lampPost(1600, L, L.lamp * .7);
    bustleCars(L, t, .5); // bustle present but soft — irrelevant
    const walk = stroll(lt, 0, 5, 600, 1300, 18);
    const mood = emotions(lt, [[0, 'sad', { lookX: .6 }], [2.5, 'sad', { lookX: .4, lookY: .2 }]], { take: .5 });
    clawdPack(walk.x, GROUND, 18, {
      ...mood, view: 'side', walk: walk.walk, dy: (mood.dy || 0) * .3 + walk.dy,
    });
    // long empty sidewalk ahead
    boilSeed('empty');
    for (let i = 0; i < 3; i++) {
      paint(ellPts(walk.x - 80 - i * 100, GROUND + 8, 18 - i * 3, 6, 12), {
        fill: PAL.ink, fillOp: 40, bleed: .3, ink: null,
      });
    }
    camEnd();
  }

  // ---------- Ch.1c · 12.06–15.06 · 但是人生 · try smile fail ----------
  function shotLife(t, lt, dur) {
    const L = LOOK.dusk;
    camBegin(960, 580, 1.15 + .03 * Math.sin(lt));
    skyWash(L, t);
    sunDisk(1550, 360, 65, .9);
    cityBlock(L, t, { baseY: 490 });
    sidewalk(L);
    lampPost(500, L, L.lamp);
    bustleCars(L, t, .3);
    const walk = stroll(lt, 0, 3, 700, 1100, 26);
    const mood = emotions(lt, [
      [0, 'hopeful', { lookX: .5 }],
      [1.1, 'sad', { lookX: .3, lookY: .2 }],
      [2.0, 'sad', { lookX: .2, lookY: .25, emote: 'cloud' }],
    ], { take: .85 });
    clawdPack(walk.x, GROUND, 26, {
      ...mood, view: 'side', walk: walk.walk, dy: (mood.dy || 0) * .4 + walk.dy,
      aL: -.2, aR: mood.emote === 'cloud' ? -.5 : -.1,
    });
    camEnd();
  }

  // ---------- Ch.1d · 15.06–20.84 · 难免会有些不快乐 · puddle + keep walking ----------
  function shotUnhappy(t, lt, dur) {
    const L = LOOK.dusk;
    camBegin(980 + 15 * Math.sin(lt * .6), 600, 1.1);
    skyWash(L, t);
    sunDisk(1500, 400, 55, .75);
    cityBlock(L, t, { baseY: 500 });
    sidewalk(L);
    lampPost(360, L, L.lamp);
    lampPost(1400, L, L.lamp * .85);
    bustleCars(L, t, .35);
    puddle(1180, GROUND + 40, 90, 28);
    const walk = stroll(lt, 0, 5.5, 500, 1400, 24);
    const mood = emotions(lt, [
      [0, 'sad', { lookX: .4, lookY: .35, emote: 'cloud' }],
      [2.2, 'bored', { lookX: .5, lookY: .1, emote: null }],
      [4.0, 'determined', { lookX: .7 }],
    ], { take: .6 });
    clawdPack(walk.x, GROUND, 24, {
      ...mood, view: 'side', walk: walk.walk, dy: (mood.dy || 0) * .35 + walk.dy,
    });
    // reflection hint in puddle when near
    if (Math.abs(walk.x - 1180) < 160) {
      boilSeed('refl');
      paint(ellPts(1180, GROUND + 42, 40, 10, 14), {
        fill: mixCol(PAL.clay, PAL.indigo, .4), fillOp: 90, ink: null,
      });
    }
    camEnd();
    boilSeed('wipe');
    if (lt > dur - .35) brushWipe((lt - (dur - .35)) / .7, WC);
  }

  // ---------- Ch.2a · 20.84–26.85 · 告别今天 / 失落 · look back at sunset ----------
  function shotFarewell(t, lt, dur) {
    const L = LOOK.dusk;
    camBegin(900 + 20 * Math.sin(lt * .4), 560, 1.05 + .02 * lt);
    skyWash(L, t);
    sunDisk(280, 360, 90, 1.1); // sun behind / left — looking back
    glow(280, 360, 220, '#FF8A5A', .35);
    cityBlock(L, t, { baseY: 510 });
    sidewalk(L);
    lampPost(1200, L, L.lamp);
    bustleCars(L, t, .2);
    const mood = emotions(lt, [
      [0, 'sad', { lookX: -.8, lookY: -.1 }],
      [1.5, 'sad', { lookX: -.9, lookY: .15, emote: null }],
      [3.5, 'bored', { lookX: -.6, lookY: .2 }],
      [5.0, 'thinking', { lookX: -.3 }],
    ], { take: .7 });
    // A drawn quarter view preserves both eyes while glancing back toward the sunset.
    const facing = {view:'q',flip:true};
    clawdPack(1050, GROUND, 28, {
      ...mood, ...facing,
      dy: (mood.dy || 0) * .5,
      aL: -.4, aR: -.25,
    });
    streetBarrier(L);
    camEnd();
    boilSeed('wipe');
    if (lt < .3) brushWipe(.5 + lt / .6, WC);
    boilSeed('continuity-wipe');
    if(lt>dur-.35)brushWipe((lt-(dur-.35))/.7,WC);
  }

  // ---------- Ch.2b · 26.85–34.82 · 看看明天 / 地平线招手 ----------
  function shotTomorrow(t, lt, dur) {
    const L = LOOK.dusk;
    const push = ease(seg(lt, 2.5, 7.5));
    camBegin(lerp(960, 1100, push), lerp(580, 520, push), lerp(1.1, 1.0, push));
    skyWash(L, t);
    // brightening horizon ahead (right)
    sunDisk(1680, 300, 75, 1);
    glow(1680, 320, 280, '#FFC766', .45 * seg(lt, 2, 5));
    horizonWave(1680, 280, t, ease(seg(lt, 4.2, 6.5)));
    cityBlock(L, t, { baseY: 500 });
    sidewalk(L);
    lampPost(400, L, L.lamp * .6);
    bustleCars(L, t, .25);
    const mood = emotions(lt, [
      [0, 'thinking', { lookX: .7, lookY: -.2 }],
      [2.0, 'hopeful', { lookX: .85, lookY: -.3 }],
      [5.0, 'excited', { lookX: .9, lookY: -.2 }],
    ], { take: .75 });
    const walk = stroll(lt, 4.5, 7.9, 880, 1300, 26);
    const pose = {view:'q',...(lt>=4.5?{walk:walk.walk,dy:walk.dy}:{})};
    const x = lt < 4.5 ? 880 : walk.x;
    clawdPack(x, GROUND, 26, {
      ...mood, ...pose,
      dy: (mood.dy || 0) * (lt < 4.5 ? .5 : .3) + (pose.dy || 0),
    });
    streetBarrier(L);
    camEnd();
    boilSeed('wipe');
    if (lt > dur - .35) brushWipe((lt - (dur - .35)) / .7, WF);
    boilSeed('continuity-wipe');
    if(lt<.3)brushWipe(.5+lt/.6,WC);
  }

  // ---------- Ch.3a · 34.82–42.93 · 日升日落 / 幻想 ----------
  function shotSunCycle(t, lt, dur) {
    const L = LOOK.fantasy;
    camBegin(960, kf(lt, [[0, 540], [8, 500]]), kf(lt, [[0, 1], [8, 1.08]]));
    // sky shifts with sun arc
    const sk = seg(lt, 0, 8);
    boilSeed('fsky');
    const skyA = mixCol('#F0C878', '#E87868', sk);
    const skyB = mixCol('#E8A878', '#6A4A78', sk);
    paint(rectPts(-400, -300, W + 800, H + 600), { wash: skyA, ink: null });
    paint(ellPts(W * .5, H * .2, W * .8, H * .4, 28, 14), { fill: skyB, fillOp: 130, bleed: .4, ink: null });
    // sun arc
    const ang = lerp(-.9, .9, sk);
    const sx = 960 + Math.sin(ang) * 700, sy = 520 - Math.cos(ang) * 280;
    sunDisk(sx, sy, 50 + 20 * Math.sin(sk * Math.PI), 1);
    // ground silhouette hill
    boilSeed('fhill');
    paint(ellPts(960, 1100, 1400, 320, 40, 3), {
      wash: mixCol(PAL.ink, PAL.indigo, .3), fill: PAL.ink, fillOp: 200, ink: null,
    });
    const mood = emotions(lt, [
      [0, 'starstruck', { lookX: 0, lookY: -.7 }],
      [3.0, 'starstruck', { lookX: .3, lookY: -.8 }],
      [6.0, 'hopeful', { lookX: .2, lookY: -.5 }],
    ], { take: .6 });
    clawdPack(960, 880, 30, {
      ...mood, view: 'q',
      dy: (mood.dy || 0) * .6,
      aL: .3, aR: .35,
    });
    // spark trails on beats
    if (pulse(t) > .7) {
      boilSeed('spark');
      paint(starPts(sx + jit(20), sy + jit(20), 12, .3, 4), { wash: PAL.cream, washOp: 200, ink: null });
    }
    camEnd();
    boilSeed('wipe');
    if (lt < .3) brushWipe(.5 + lt / .6, WF);
    boilSeed('continuity-wipe');
    if(lt>dur-.35)brushWipe((lt-(dur-.35))/.7,WF);
  }

  // ---------- Ch.3b · 42.93–48.49 · 期待每秒 ----------
  function shotExpect(t, lt, dur) {
    const L = LOOK.fantasy;
    camBegin(960 + 18 * Math.sin(lt * .8), 560, 1.12);
    skyWash(L, t);
    sunDisk(1400, 280, 70, 1);
    cityBlock(L, t, { baseY: 510 });
    sidewalk(L);
    lampPost(700, L, .5);
    const mood = emotions(lt, [
      [0, 'hopeful', { lookX: .4 }],
      [1.5, 'excited', { lookX: .5, emote: 'spark' }],
      [3.5, 'happy', { lookX: .3 }],
    ], { take: .7 });
    const hop = jump(lt, 2.0, 2.55, 2.2);
    const walk = stroll(lt, 0, 5.5, 700, 1200, 18);
    clawdPack(walk.x, GROUND, 18, {
      ...mood, view: 'q', walk: walk.walk,
      dy: (mood.dy || 0) * .3 + walk.dy + (hop.dy || 0),
      sq: (mood.sq || 0) + (hop.sq || 0),
      aL: .4 + .3 * pulse(t), aR: -.1,
    });
    // beat sparkles around
    for (let i = 0; i < 5; i++) {
      if (hash(i + (BOILN / 3 | 0)) > .55) continue;
      boilSeed('sp' + i);
      const a = t * 2 + i * 1.3;
      paint(starPts(walk.x + Math.cos(a) * 120, GROUND - 180 + Math.sin(a * 1.3) * 60, 8 + 4 * pulse(t), .3, 4), {
        wash: PAL.ochre, washOp: 180, ink: null,
      });
    }
    streetBarrier(L);
    camEnd();
    boilSeed('wipe');
    if (lt > dur - .35) brushWipe((lt - (dur - .35)) / .7, WC);
    boilSeed('continuity-wipe');
    if(lt<.3)brushWipe(.5+lt/.6,WF);
  }

  // ---------- Ch.4a · 48.49–57.34 · 眼睛 / 笑容 · face CU ----------
  function shotEyes(t, lt, dur) {
    const L = LOOK.dusk;
    camBegin(970, 640, 1.55 + .03 * Math.sin(lt * .5));
    skyWash(L, t);
    sunDisk(1500, 300, 90, 1.2);
    glow(1500, 320, 260, '#FFC766', .4);
    cityBlock(L,t);
    // soft out-of-focus city wash behind
    boilSeed('bokeh');
    paint(rectPts(-200, 400, W + 400, 700), { wash: mixCol(L.house, L.sky, .4), washOp: 180, ink: null });
    sidewalk(L);
    const mood = emotions(lt, [
      [0, 'starstruck', { lookX: .2, lookY: -.15 }],
      [1.2, 'happy', { lookX: .15, lookY: -.1, emote: 'spark' }],
      [4.0, 'love', { lookX: 0, lookY: -.05, blush: .7 }],
      [7.0, 'hopeful', { lookX: .2 }],
    ], { take: .8 });
    clawdPack(980, GROUND + 40, 34, {
      ...mood, view: 'front',
      dy: (mood.dy || 0) * .7,
      aL: .15, aR: .2,
    });
    // sun glint across face
    boilSeed('glint');
    paint(ellPts(980, 520, 200, 120, 20, 10), {
      fill: '#FFE9A8', fillOp: 40 + 30 * Math.sin(t * 2), bleed: .5, ink: null,
    });
    camEnd();
    boilSeed('wipe');
    if (lt < .3) brushWipe(.5 + lt / .6, WC);
    boilSeed('continuity-wipe');
    if(lt>dur-.35)brushWipe((lt-(dur-.35))/.7,WC);
  }

  // ---------- Ch.4b · 57.34–65.44 · 勇敢说出小小感动 ----------
  function shotBrave(t, lt, dur) {
    const L = LOOK.dusk;
    camBegin(960, 580, 1.2);
    skyWash(L, t);
    sunDisk(1450, 320, 70, 1);
    cityBlock(L, t, { baseY: 500 });
    sidewalk(L);
    lampPost(480, L, L.lamp);
    lampPost(1480, L, L.lamp);
    const mood = emotions(lt, [
      [0, 'nervous', { lookX: 0, lookY: .2 }],
      [1.8, 'determined', { lookX: .1, lookY: -.1 }],
      [3.5, 'determined', { lookX: 0, emote: 'heart' }],
      [5.5, 'love', { lookX: 0, blush: .5 }],
    ], { take: .9 });
    // anticipation breath then speak
    const sqExtra = .12 * ease(seg(lt, 1.5, 2.0)) * (1 - ease(seg(lt, 2.0, 2.4)));
    clawdPack(960, GROUND, 21, {
      ...mood, view: 'front',
      dy: (mood.dy || 0) * .6,
      sq: (mood.sq || 0) + sqExtra,
      aL: lerp(-.2, .6, ease(seg(lt, 3.2, 4.0))),
      aR: lerp(-.2, .55, ease(seg(lt, 3.4, 4.2))),
    });
    // heart glow from chest after brave moment
    const hk = ease(seg(lt, 3.6, 5.0));
    if (hk > .01) {
      glow(960, GROUND - 140, 80 * hk, '#E2476E', .45 * hk);
      boilSeed('hrt');
      paint(heartPts(960, GROUND - 200 - 20 * hk, 18 * hk * (1 + .08 * Math.sin(t * 8))), {
        wash: '#E2476E', ink: PAL.ink, sw: .5,
      });
    }
    streetBarrier(L);
    camEnd();
    boilSeed('wipe');
    if (lt > dur - .35) brushWipe((lt - (dur - .35)) / .7, WD);
    boilSeed('continuity-wipe');
    if(lt<.3)brushWipe(.5+lt/.6,WC);
  }

  // ---------- Ch.5a · 65.44–72.32 · 微风 / 心愿带走 ----------
  function shotBreeze(t, lt, dur) {
    const L = LOOK.dawn; // morning breeze — cooler wash returning
    // blend dusk→dawn
    camBegin(940 + 25 * Math.sin(lt * .6), 560, 1.08);
    skyWash(L, t);
    sunDisk(400, 260, 60, .8);
    cityBlock(LOOK.dusk, t, { baseY: 510 });
    sidewalk(LOOK.dusk);
    lampPost(600, LOOK.dusk, .4);
    mistLayer(t, .25);
    // wind lines
    boilSeed('breeze');
    for (let i = 0; i < 8; i++) {
      const y = 400 + i * 55 + 10 * Math.sin(t * 3 + i);
      const x0 = ((t * 180 + i * 90) % (W + 200)) - 100;
      inkLine([[x0, y], [x0 + 80, y - 6], [x0 + 140, y + 4]], .5, mixCol(PAL.cream, L.sky, .3), 'inkfine', .3);
    }
    const hero=breezeState(t);clawdPack(hero.x,hero.y,hero.u,hero.pose);
    const wish=wishFlightState(t);
    if(wish.visible){
      for(let i=5;i>=1;i--){const q=wishFlightState(t-i*.055);if(!q.visible)continue;boilSeed('wish-trail'+i);paint(starPts(q.x,q.y,6,.3,4),{wash:PAL.cream,washOp:140*(1-i/6),ink:null});}
      paperWish(wish.x,wish.y,wish.s,wish.angle,t,{glow:wish.glow,seed:1});
    }
    streetBarrier(L);
    camEnd();
    boilSeed('wipe');
    if (lt < .3) brushWipe(.5 + lt / .6, WD);
    boilSeed('continuity-wipe');
    if(lt>dur-.35)brushWipe((lt-(dur-.35))/.7,WC);
  }

  // ---------- Ch.5b · 72.32–80.33 · 种在成长的路口 ----------
  function shotPlant(t, lt, dur) {
    const L = LOOK.dusk;
    camBegin(kf(lt, [[0, 1100], [4, 960], [8, 960]]), 560, kf(lt, [[0, 1], [3, 1.12], [8, 1.05]]));
    skyWash(L, t);
    sunDisk(300, 400, 55, .6);
    cityBlock(L, t, { baseY: 500 });
    sidewalk(L);
    // crossroads: intersecting sidewalk suggestion
    boilSeed('cross');
    paint(rectPts(700, GROUND - 8, 520, 100), {
      wash: mixCol(L.top, PAL.cream, .15), fill: L.top, fillOp: 50, ink: PAL.ink, sw: .5,
    });
    lampPost(720, L, L.lamp);
    lampPost(1800, L, L.lamp);
    // wish arrives and lands
    const wish=wishFlightState(t);
    if(wish.visible)paperWish(wish.x,wish.y,wish.s,wish.angle,t,{glow:wish.glow,seed:1});
    const sprout = easeOut(seg(lt, 2.2, 4.5));
    if (sprout > .01) {
      glow(980, GROUND - 20, 120 * sprout, '#FFE9A8', .55 * sprout);
      seedGlow(980, GROUND - 8, t, sprout * 1.35);
    }
    const mood = emotions(lt, [
      [0, 'hopeful', { lookX: .5, lookY: .2 }],
      [2.5, 'starstruck', { lookX: 0, lookY: .4 }],
      [4.5, 'love', { lookX: 0, lookY: .2, blush: .4 }],
      [6.5, 'hopeful', { lookX: 0, lookY: .1 }],
    ], { take: .7 });
    const walk = stroll(lt, 0, 3.5, 1280, 1120, 16);
    clawdPack(lt < 3.5 ? walk.x : 1120, GROUND, 16, {
      ...mood,
      view:'q',flip:true,lookX:.45,
      ...(lt < 3.5 ? { walk: walk.walk, dy: walk.dy } : {}),
      dy: (mood.dy || 0) * .4 + (lt < 3.5 ? walk.dy : 0),
    });
    streetBarrier(L,{gaps:[[820,1080]]});
    camEnd();
    boilSeed('continuity-wipe');
    if(lt<.3)brushWipe(.5+lt/.6,WC);
    if(lt>dur-.35)brushWipe((lt-(dur-.35))/.7,WN);
  }

  // ---------- Ch.6 · 80.33–90.4 · outro rhyme + iris ----------
  function shotOutro(t, lt, dur) {
    const L = LOOK.night;
    camBegin(960 + 15 * Math.sin(lt * .4), kf(lt, [[0, 540], [10, 520]]), kf(lt, [[0, .95], [8, 1.02]]));
    skyWash(L, t);
    // moon
    boilSeed('moon');
    paint(ellPts(1500, 200, 55, 55, 22, 1), { wash: PAL.cream, fill: mixCol(PAL.cream, PAL.ochre, .3), fillOp: 50, ink: PAL.ink, sw: .6 });
    glow(1500, 200, 120, '#D8E8FF', .35);
    cityBlock(L, t, { baseY: 500 });
    sidewalk(L);
    lampPost(400, L, 1);
    lampPost(1550, L, .9);
    bustleCars(L, t, .2);
    seedGlow(980, GROUND - 8, t, 1);
    // Clawd tiny — rhyme with intro
    const walk = stroll(lt, 0, 8, 700, 1050, 12);
    const mood = emotions(lt, [
      [0, 'hopeful', { lookX: .3 }],
      [3.0, 'hopeful', { lookX: .2, lookY: -.1 }],
      [6.0, 'love', { lookX: 0, lookY: .1 }],
    ], { take: .4 });
    clawdPack(walk.x, GROUND, 12, {
      ...mood, view: 'q', walk: walk.walk, dy: (mood.dy || 0) * .3 + walk.dy,
    });
    const at = toScreen(walk.x, GROUND - 4 * 12);
    streetBarrier(L);
    camEnd();
    // iris close at end
    if (lt > dur - 2.2) {
      const r = lt < dur - .4
        ? lerp(1600, 220, ease(seg(lt, dur - 2.2, dur - .4)))
        : lerp(220, 0, easeIn(seg(lt, dur - .4, dur)));
      iris(...at, r, PAL.night);
    }
    boilSeed('continuity-wipe');
    if(lt<.3)brushWipe(.5+lt/.6,WN);
  }

  shots([
    [0.00,shotCoastStory],
    [34.82,shotWishBridge],
    [38.12,shotCityDaydream],
    [49.63,shotDreamReunion],
    [65.44,shotStarChase],
    [70.85,shotMoonTree],
  ]);
})();
