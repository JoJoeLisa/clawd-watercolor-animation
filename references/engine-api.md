# 引擎API参考

以下摘录随附MIT引擎的函数说明；创作流程以本Skill及用户当前要求为准。

## Engine

### Files

| file | what's in it |
|---|---|
| `src/config.js` | `PROJECT = { duration, bpm, offset, audio? }` |
| `src/core.js` | canvas, palette, timing and motion helpers, `paint()`, camera, full-frame effects, `glow()`, lettering, paper, render hooks |
| `src/clawd.js` | Clawd: views, emotions, eyes, mouths, hats, emotes, moves |
| `src/timeline.js` | `shots()`, `LOOPS`, `brushWipe()` |
| `src/sheets.js` | the model sheets as loops (`?loop=emotions`, `?loop=views`) |
| `src/scenes/demo.js` | an 11-second example. **Don't copy it** (see the end of this guide) |
| `studio.html` | open it in Chrome to scrub the video (`?t=2.5` jumps to a time, `?loop=emotions` shows a loop) |
| `render.mjs` | headless renderer: sheets, strips, crops, stills, PNG loops, MP4 |

### Frames are pure functions of time

- **Frames render in parallel and out of order.** A shot is `fn(t, lt, dur)` and must draw the same frame for the same `t`, every time. No state carried between frames, no counters, no `Math.random()`, no physics that integrates frame by frame. Compute everything from `t`, in closed form (the helpers below do this for you).
- Randomness: `hash(i)` for stable per-object values, and `jit(a)`/`random()` for boil (they change 12 times a second).
- **Seed each element with `boilSeed(key)`.** Each boil drawing holds for two frames, so anything that isn't moving must draw the same in both. But a moving thing uses a different amount of randomness each frame, which shifts the stream for everything drawn after it, and all of that re-boils every frame and looks jittery.
  - `boilSeed(key)` restarts the stream from the boil frame and a key that stays the same every frame (any string or number, unique within the frame).
  - Call it before each separate element: each background layer, prop and effect.
  - `clawd()` seeds itself and each of its parts, then reseeds when it's done, so nothing drawn after it depends on its pose. Its key is its call order; set `boilKey` if characters come and go mid-shot.
- **Each shot paints the whole frame,** background included. The paper texture is under everything and the grain is multiplied over the top, so leaving paper showing is a valid look.
- **Canvas:** 1920×1080, origin top-left, y down.
- `LOOPS.name = t => {...}; LOOPS.name.len = 4;` makes a standalone loop (tests, GIFs, sheets), rendered with `--loop=name`.

### Painting

`paint(pts, o)` paints one shape from a point list `[[x, y], ...]`:

| option | meaning |
|---|---|
| `wash, washOp` | flat colour (opacity 0–255, default 255). For characters, props, anything solid. |
| `fill, fillOp, bleed, tex, border` | watercolour fill with bleeding edges and pigment texture. For skies, hills, shading and shadows. `bleed` ~.05–.3, `tex` ~.3–.9. |
| `hatch: { d, a, o, b, c, w }` | hatching (distance, angle, `{rand, gradient}`, brush e.g. `'charcoal'`/`'HB'`, colour, weight). Texture, sparingly. |
| `ink, sw, br` | outline colour (default `PAL.ink`), weight (~.4–2), brush. **`ink: null` means no outline.** |
| `curv` | 0–1: smooth the outline through the points. |

- **Lines:** `inkLine(pts, sw, colour, brush = 'ink', curvature)`. The kit's brushes are `'ink'`, `'inkfine'` and `'dry'` (bristly). p5.brush's built-ins also work: `'2B'`, `'HB'`, `'charcoal'`, `'marker'`, `'pen'`, `'cpencil'`, `'rotring'`, `'spray'`.
- **Shapes:**
  - `rectPts(x, y, w, h, jitter)`
  - `ellPts(cx, cy, rx, ry, n, jitter, rot)`
  - `rrPts(x, y, w, h, r, jitter)`: a rounded rectangle
  - `starPts(cx, cy, r, inner, n, rot)`
  - `heartPts(cx, cy, r)`
  - `through(P)`: a smooth curve through the points
  - `ribbon(P, w0, w1)`: a tapered ribbon along a path, as one outline. Use it for tails, trails, vines and noodly arms.
- **One shape, one outline.** Build a creature or prop from as few outlines as you can, so it doesn't look like glued-on stickers: a tail is one `ribbon`, not five circles.
- **Light:** `glow(x, y, r, colour, a)`. It's additive, so it stays warm on dark grounds and barely shows on light ones (as real light would). Draw it before the things that sit in front of the light.
- **Palette** `PAL`: `paper, ink, clay, clayDk, clayLt, night, indigo, rose, ochre, sap, teal, violet, cream, sky`. `mixCol(a, b, k)` mixes two hex colours in RGB. Any hex colour works: pick a small palette per video.
- **p5.brush quirks:**
  - Colours mix like pigment: yellow over blue makes green. Layer light colours over dark ones with a full-opacity `wash`, or use `glow()`.
  - `wash` at 255 is exact colour; lower opacities mix.
  - Strokes drawn far from the origin under a zoomed camera collapse: from zoom ~2, an outline or a line at large
    world coordinates leaves only a dot at its first vertex. `paint()` and `inkLine()` draw each shape around its own
    centre, which avoids it. A shape much bigger than the canvas can still lose its outline: draw long edges as
    `inkLine`s no bigger than the canvas.
  - Outline weight is in world units, so it grows with the camera's zoom: a fine outline on a small shape becomes a
    dark blob in a close-up. Scale `sw` down with the zoom for small shapes.
  - A NaN in a point list throws `Failed to construct 'OffscreenCanvas': Value is not of type 'unsigned long'`, with
    a stack pointing at your scene rather than the NaN. Guard geometry that can degenerate (`Math.acos` of a ratio > 1).
  - p5 `push()/pop()/translate()/rotate()/scale()` work with all brush calls.
  - Cost is the number of `fill` shapes and strokes: hundreds are fine, thousands are not. Aim for ≤ 1.5 s per frame. The render log prints ms/frame.
  - Some scenes make p5.brush log five `WebGL: INVALID_OPERATION ... not from the associated program` warnings once per page. They're harmless (frames come out identical). Any other page error is real.

### Time and motion (all pure functions of t)

- **Progress and keys:**
  - `seg(t, a, b)`: 0..1 progress through [a, b]
  - `kf(t, [[t0, v0], [t1, v1], ...], ease)`: keyframes; values may be arrays
  - `lerp`, `clamp`, `frac`, `wob(t, freq, phase)`, `TAU`
- **Easing:** `ease`, `easeIn`, `easeOut`, `backOut` (overshoot) and `elasticOut`.
- **Rhythm:** `BEAT` (seconds per beat), `bpOf(t)` (beat position), `beatN(t)` (beat number), and `pulse(t, k)` / `pulse2(t, k)`, which are 1 on each beat (or eighth) and then decay.
- **Acting:**
  - `jump(t, t0, t1, h)`: crouch, stretch, arc and squash-land. Returns `{dy, sq}`.
  - `take(t, t0, amt)`: a surprise take, returns `{sq, dy}`.
  - `stroll(t, t0, t1, x0, x1, u)`: an eased walk. Returns `{x, walk, view, flip, dy}`.
  - `spring(t, t0, k, w)`: a damped wobble after an event, for settles and follow-through.
  - `ring(t, [t0, t1, ...])`: one `spring` kick per event time.
  - `arcPt(p0, p1, h, k)`: a point on a thrown arc.
  - `onTwos(t)`: holds each drawing for two frames. Wrap a shot's `t` in it for a snappier, hand-drawn feel.
- **Camera:**
  - `camBegin(cx, cy, zoom, rot)` … `camEnd()`: world point (cx, cy) lands at screen centre. One level only; always pair them.
  - `toScreen(x, y)`: world → screen while a camera is active. Use it to aim an iris at a character.
  - `shakeXY(t, amount)`: [dx, dy] to add to the camera on impacts.
- **Full-frame effects** (screen space, after `camEnd()`):
  - `brushWipe(p, [c1, c2])`: fat strokes cover the frame (p 0 → .5) and then drag off (.5 → 1). Cut under full cover. Its comment in timeline.js shows the two calls.
  - `iris(cx, cy, r, colour)` and `irisShape(pts, colour)`: shaped reveals.
  - `flash(k, colour)`: a full-frame flash.
- **Lettering** (use when requested or useful for this story):
  - `letter(txt, x, y, size, colour, {pop, rot, alpha, screen})`
  - `sfx(txt, x, y, size, colour, age)`
  - Both are composited at `flushLetters()`, after the shot. If a wipe or iris must cover them, call it yourself first.

---

## Clawd

Clawd is the Claude Code mascot: a terracotta block (`PAL.clay`), 10 units wide and 6 tall, with four stubby legs, two little arm nubs and two tall slit eyes. There's no mouth at rest. It's drawn in flat wash with an ink outline and boils like everything else. That's the default design, not a rule: change it if the idea needs it. Within one video, though, keep every character on model, with the same shape and features in every shot.

```js
clawd(x, y, u, options)   // (x, y) = ground point between the feet; u = size unit
```

**Sizes:** Clawd is 10u × 8u (legs included).

| shot | u | on screen |
|---|---|---|
| wide | 10–16 | small in the landscape |
| medium | 20–28 | the usual acting size |
| close-up | 40–70 | face acting |
| extreme close-up | 90+ | camera pushed in on the eyes |

### Options

| group | options |
|---|---|
| pose | `dx`, `dy` (in u; −dy = up), `sq` (squash; negative stretches), `rot` (pivots at the feet), `flip`, `sx`, `sy`, `aL`, `aR` (arm angle: 0 = straight out, + = up, − = down; ±1.5 is vertical), `walk` (leg phase), `noLegs`, `noShadow` |
| view | `view`: front, q, side, qback, back. `smear` 0..1 + `smearDir` ±1 (0 = both sides) for fast moves |
| face | `eyes`, `mouth`, `lookX`/`lookY` (−1..1), `squint` 0..1, `blush` 0..1, `gloom` 0..1, `lid` 0..1, `seed` (blink timing) |
| colour | `tint` (pale, flush, blue, rosy, green, gold, or any hex) + `tintK`, or `col`/`dk`/`lt` directly |
| extras | `hat`, `emote` + `emoteK` (0..1 pop) + `emoteAge`, `draw(u, sw)`, `armL(u, sw)`, `armR(u, sw)` |
| boil | `boilKey`: a stable id for its boil seeds (default: call order) |

Options compose by spreading: `clawd(x, y, u, { ...feel('happy', t), ...turn(t, 1, 1.15, 0, .25), hat: 'party' })`. Later spreads win, so put the emotion first and the pose after it. If both an emotion and a pose move the same field (`dy`, `sq`), add them together rather than letting one silently replace the other.

### Views and turns

These are drawn key views. Every view faces screen-right; add `flip: true` to face left.

| view | what you see |
|---|---|
| `front` | the face, both arms, four legs |
| `q` | 3/4: the face shifted toward the heading, the side face as a darker strip behind it |
| `side` | profile: one eye near the leading edge, one arm |
| `qback` | 3/4 from behind: no face |
| `back` | no face |

- **Turn with `turn(t, t0, t1, a0, a1)`.** Headings are in turns: 0 = front, .25 = facing right, .5 = back, −.25 = facing left. It steps through the key views over 0.12–0.25 s with smears, like a drawn turn. For a single heading, use `spinView(a)`.
- **Walks across the screen** read best in `side` view with `walk` driving the legs. `stroll()` gives `q`; override it with `view: 'side'` for a trot.
- **Facing right, `aL` is the near arm** (drawn in front of the body), and the far arm is behind and darker.

### Emotions

31 emotions. Each is a face, a colour and a way of moving, all locked to the beat. `feel(name, t, over)` returns all of it at time t:

```js
clawd(x, y, u, feel('happy', t));                                   // one emotion, alive
clawd(x, y, u, feel('sad', t, { view: 'q', lookX: -1 }));             // with overrides
clawd(x, y, u, emotions(t, [[0, 'sleepy'], [1.9, 'surprised', { lookX: .8 }], [2.5, 'idea']]));   // acted changes
```

| family | emotions |
|---|---|
| joy | happy, excited, laugh, love, proud, starstruck, playful, hopeful, relieved |
| sly | smug, cool, mischief, suspicious |
| low | sad, cry, bored, sleepy, ko |
| hot | angry, furious (the lunchbox lid opens), determined, disgusted |
| alarm | scared, nervous, surprised, confused, dizzy |
| mind | neutral, thinking, idea, shy |

- **`emotions(t, keys)`** is how moods change in a shot. Around each key it squints and squashes just before the change (anticipation), swaps the face under the squint, and fires a take sized to the new emotion. The body then settles into the new motion with overshoot, colour cross-fades and the new emote pops in.
  - `emotions(t, keys, { take: .5 })` scales every take.
  - The third element of a key overrides fields for that stretch (e.g. `{ lookX: .8, emote: 'music' }`).
- To make a new emotion, add an entry to `EMO` in clawd.js. It needs eyes, mouth, optional tint/blush/gloom/lid/emote, `take` (reaction size) and `body(t)` (its idle motion, locked to the beat through `_b(t)`).

### Parts

- **Eyes:** normal, look, wide, happy, closed, sleepy, wink, narrow, angry, determined, sad, teary, cry, squeeze, shine, scared, blank, spark, red, heart, x, swirl, dot, shades.
  - A pair gives mismatched eyes, e.g. `['narrow', 'wide']`.
  - `lookX`/`lookY` aim the pupils, and `squint` closes the eyes from any shape.
- **Mouths:** o, O, smile, grin, flat, wobble, cat, frown, smirk, laugh, open, wail, teeth, tongue, pout, yawn. Use `null` for none (Clawd's resting face).
- **Lunchbox lid:** `lid` 0..1 hinges the top of the body open, with teeth pointing into the mouth. It's for fury, chomping and shouting, in the front view only.
- **Hats:** party, hard, crown, halo, wizard, hood, top, fedora, band, sweatband, beanie, bow, flower, headphones, cat (ears and whiskers). Face pieces: masq, mask, bowtie.
- **Emotes** are painted marks that pop in by the head: `!` `?` `!!` `!?` zzz, sweat, spark, heart, hearts, anger, steam, bulb, dots, scribble, music, swirl, stars, cloud.
  - `emoteK` is the 0..1 pop and `emoteAge` drives the looping ones; `emotions()` sets both.
  - `emote(kind, x, y, s, k, age)` draws one anywhere, for example over a prop.
- **Body colour:**
  - `tint` shifts it with the mood: pale (fear), flush (anger), blue (sadness), rosy (love), green (disgust), gold (pride).
  - `gloom` adds a dark forehead with hanging lines, and `blush` adds cheeks (hatched when above .6).

### Hooks: props and accessories

- **`draw(u, sw)`** paints in body-local space, on top of everything else on the body (face, hat, near arm). It squashes, flips and rotates with Clawd. Front-view coordinates:
  - the body spans x −5u..5u and y −8u..−2u
  - the eyes are at (±2.5u, −6u)
  - the mouth is near (0, −4.3u)
- **`armL(u, sw)` / `armR(u, sw)`** are called at the arm tip, in arm space (+x runs outward along the arm), so a held prop just draws around (0, 0) and follows the arm automatically:

```js
clawd(x, y, 24, { ...feel('proud', t), aR: 1.2, armR: (u, sw) => paint(starPts(u * .8, 0, u * 1.4, .5, 5), { wash: '#FFE27A', sw }) });
```

- Anything the arms can't carry, like a big object overhead, is drawn separately at a point computed from the same pose. The demo's star does this. Make sure it touches: check it with a crop.

### Dances

`move(style, t, seed)` returns beat-locked pose offsets. The styles are bounce, hop, roof (arms up), sway, spin (a drawn spin through the key views once a bar), wave, walk, run, idle, stomp and shimmy. `mix` changes style every two bars. `dancer(x, y, u, style, t, extra)` is `clawd` + `move`. You can combine a dance with a face: `{ ...move('bounce', t), eyes: 'happy', mouth: 'grin' }`.

---

## Music (optional)

The kit doesn't need music, but it's built for it:

1. Set `bpm` to the song's tempo in `src/config.js`, and set `offset` to the time of its first downbeat in seconds. Every idle, dance and `pulse()` then locks to the song.
2. Put the audio in `assets/` and set `PROJECT.audio` (or pass `--audio=`). `--clip` and `--encode` mux it in.
3. Land hits, cuts and takes on beats (`beatN`, `pulse`). Cut on bar lines for big changes, and give each musical phrase its own visual.
4. **Lyrics are not text.** Don't put words on screen. Act the meaning of a line instead.

