# Trace: cloud exact-target + emblem slow speed + field + logo hearts

Mars orders 2026-10-26 19:54 CDT (on the fixed3 moving GIF) + 19:57 CDT
(acceptance bar: corrected cloud must look like TARGET exactly, not
close, not 99.9%). Branch stacks on PR #233 (cloud fixed3); PR base is
the PR #233 branch, NOT main, so this diff is only the changes below.
No merge, no publish, before Mars judges.

## 0. Checkpoint lock (done first, before any forward change)

- `docs/ui-art-options/cloud-fixed3-checkpoint-20261026-2015.md`
- `docs/ui-art-options/CHECKPOINT-LOG.md` (new append-only log)
- Registry: `docs/locked-versions.json` + `docs/locked-versions.md`
  (checkpoints section, cloud-fixed3 CURRENT-restorable, NOT perfect).
- Restore: `git checkout feature/cloud-shape-fix-20261026`
  (head fd2516c4) + the fixed3 renders in
  `~/workspace/mochiichao-work/ui-art/cloudpos-fixed3-*.png|gif`.
- Fixed3 state locked: frame (225,599,823x258), interior 258-942 x
  653-811 (app render) / 258-942 x 654-816 (isolated element),
  vs target 257-942 x 655-815. NOT exact — that is why the forward
  fix below exists.

## 1. Cloud exact-target — decomp check FIRST (Pokemon-first)

Searched FireRed first, then HeartGold, then Black 2, for a menu-cloud
placement (x/y/w/h) that the target box could have come from:

- FireRed `src/title_screen.c`: flame/leaf/slash sprites + background
  bitmaps/palettes. NO cloud sprite, NO cloud placement.
- FireRed `src/main_menu.c`: text window templates. NO cloud.
- FireRed other 'cloud' hits: battle anims, overworld weather stub
  (`WeatherCoordEvent_SunnyClouds` is an EMPTY function — no values),
  pokedex text. None is a menu cloud placement.
- HeartGold `src/title_screen.c`: ZERO 'cloud' matches. It is a 3D
  scene (camera, lights, textures); any clouds are baked into
  model/texture assets, not positioned values.
- Black 2 `src/`: no title/menu cloud placement (only encounter /
  weather / ability code mentions).

CONCLUSION, stated plainly: NO decomp pins a menu-cloud placement for
this element. The 250-950 x 648-828 box (centre (600,738), 700x180) is
the Mochiichao v21 spec value, NOT a decomp value. The frame below is
therefore tuned by isolated-element measurement — same file, same
`<svg><image preserveAspectRatio="none">` element as the game uses,
screenshot via the proven CDP route, measured with the same
white-interior flood method that reproduces the picture's target
interior exactly (largest enclosed white component in the v32 picture:
67,756 px, bbox 257-942 x 655-815 — identical to the worker's target
numbers, method validated).

## 2. Cloud frame tuning (isolated element, method-consistent)

Target interior (picture, flood method): 257-942 x 655-815 (685x160).

| frame (x,y,w,h) | isolated interior | vs target |
|---|---|---|
| (225,599,823x258) = fixed3 | 258-942 x 654-816 (684x162) | left +1, top -1, bottom +1, width -1, height +2 |
| (224,601,824x253) | 257-941 x 655-814 (684x159) | left 0, top 0, right -1, bottom -1 |
| (224,601,825x254) SHIPPED | 257-942 x 655-815 (685x160) | EXACT, all four edges |

Shipped frame: `{ x: 224, y: 601, w: 825, h: 254 }`.
Isolated stroke for shipped frame: 249-951 x 649-820, within 1px of
the picture's stroke (250-949 x 648-821) on every edge — that 1px is
edge-threshold, not shape: same file, same stretch mode, same shape.
File untouched: `src/assets/ui/puffy-cloud.svg` byte-identical
(597 bytes). Traced `mochiichao-main-cloud-v32.svg` BANNED, appears
nowhere in this change. Cloud bob (amp 6px, period 5s, PR #149, never
Mars-locked) is UNCHANGED: the frozen render proves exactness at
bob phase 0; the moving cloud still bobs +/-6px around target. If
Mars wants it dead static, that is a one-line follow-up, not snuck
in here.

APP CORRECTION (found by measuring the true 1200x1500 app render,
not the isolated rig): the isolated rig's interior bottom (815) is
the CENTRE bottom, which the CONTINUE panel hides in the game — so
in the app the visible interior bottom is the LOBES, and the
picture's lobes sit 6px lower than the element's (picture right-lobe
stroke 819 vs element 813, measured tight, same method; app
right-lobe stroke measured IDENTICAL to isolated, 813, same taper
— so the app element is exact and the picture's cloud is a uniform
vertical stretch x1.039 about the top: interior height 160 vs 154,
(819-649)/(813-649) = 1.037). One honest deviation remains: the
picture's cloud is asymmetric (left lobe visible bottom 812, right
819) while the svg path's lobes are symmetric, so NO frame-only
transform matches both lobes — the stretched frame below matches
the interior (within 1px) and the right lobe exactly, and overshoots
the left lobe's visible tail by 7px (819 vs 812; the overshoot sits
at x280-300, partly behind the Mochii). Redrawing the path to fix
the left tail is BANNED by Mars's own transform-only order
(2026-10-26 18:13 CDT) — so this is flagged for his call, not
silently "fixed" by breaking the other two measures. Frame SHIPPED
in the app: `{ x: 224, y: 599, w: 825, h: 264 }` (width unchanged,
top re-anchored: 599 + 0.191x264).

## 3. Emblem slow speed (verified in code, not assumed)

`MENU_ANIMATION_SPEEDS["slow-rise"]` in `src/lib/lockedV32Menu.ts`:
riseVyMin 8, riseVyMax 14 (px/s upward), swayMin 3, swayMax 8,
rotateDeg 4, periodSec [4,5,6]. This is the PR #163 speed saved as an
option Mars 2026-10-26 10:54 CDT ("really slow rise"). The matched-GIF
perfect speed (157.14 px/s) is ~11-19x faster and is NOT what Mars
ordered here — he said "slow speed". Change: `background.animationSpeed`
default `"perfect"` -> `"slow-rise"`; `"perfect"` kept as the option
(same union type, so the bundler still ships both branches — the
localStorage selector in MainMenuBackground is unchanged).
Per-symbol rise: vy = 8 + (i % 7) px/s, i.e. 8..14 across the field.

## 4. Emblem field widened both sides — what was actually wrong

Measured symbol DATA (`src/lib/mainMenuSymbols.ts`, 285 symbols):
x centres 20-1174, extent incl. radii 1-1198.2 — the field ALREADY
spans the full stage width in stage coords; per-100px columns are
17-29 (no hollow middle, no missing edges). The v32 picture's field:
x span 3-1195. The old fixed3 moving GIF's field: frame x span 62-1141
— but that GIF was captured at 1200x1357, and the 1200x1500 stage
scaled to that window is 1085 wide with ~57px letterbox margins on
EACH SIDE. The "white space on both sides of the emblems" Mars saw
was render letterbox, NOT the game field: widening the code
coordinates would only push edge symbols off-canvas (clipped), not
widen the image. So NO symbol positions were changed (count, shapes,
colours, sizes all untouched), and the deliverable renders are
captured at NATIVE aspect instead — stage 1200x1500 (frame = stage,
no side margins) and phone 390x844 (stage fills width, no side
margins). Field span before/after, stage coords: 1-1198.2 UNCHANGED
(already full-width); frame side space before/after: ~57px each side
(old 1200x1357 GIF) -> ~1-2px (new native renders, matching the
target picture's 3px left / 5px right). Verified in the native
moving frame f00: symbol palette span x 4-1199 (side space 4px
left / 1px right). If Mars meant the game field
itself to extend past the stage edges, that clips by construction —
he can correct this reading; the images now show the field reaching
the edges like the target.

## 5. Logo hearts — picture-measured, #214 corrected, exact layer

Yesterday's instructions (conversation log v28, Mars direction):
layer order white -> background symbols -> arcs/circles/hearts ->
logo -> cloud -> panels. The hearts sit in the arcs/circles/hearts
group: ABOVE arcs, BELOW logo. In code: MainMenuBackground's SVG is
rendered by IntroSequence BEFORE logo/cloud/panels, so hearts drawn
LAST in that SVG are above arcs + symbols and below logo + cloud +
panels — exactly that layer. Verified against the v32 picture crops:
both hearts occlude the arcs behind them (drawn over arcs) and do not
touch logo letters (under-vs-over logo indistinguishable in the
picture, so the written v28 order governs).

Placements MEASURED from the v32 picture (colour segmentation +
connected components + row scans), NOT copied from PR #214:

| heart | picture visible bbox | centre | size | fill |
|---|---|---|---|---|
| blue | 138-200 x 397-446 | (169, 421.5) | 63x50 | #8cd2ff (140,210,255) |
| pink | 204-256 x 621-660 | (230, 640.5) | 53x40 | #ff96c8 (255,150,200) |

PR #214's numbers were WRONG and are corrected here (its own comment
admits the blue crop bbox merged with the arc below): blue y 405 was
16.5px too high, pink y 637 was 3.5px high, pink h 37 was 3px short,
colours #95cbfe/#fe95c7 vs picture fills #8cd2ff/#ff96c8.
Rendering: same heart path geometry as the symbol hearts (100-box,
x5-95, y0-88, centre (50,44)), translate(-50,-44) scale(w/90,h/88),
so the visible box is exactly centre +/- (w/2,h/2): blue
137.5-200.5 x 396.5-446.5, pink 203.5-256.5 x 620.5-660.5 — within
0.5px of measured. Static (no refs, no animation), FULL opacity (the
pink heart sits at y640 inside the fade band but is SOLID in the
picture — no fade applies). ONLY these two hearts: no black stars,
no pink circle, no top sparkle (those are separate open decisions).

VISIBILITY CONSEQUENCE, stated plainly (measured in the app render):
the hearts are placed exactly, on the exact under-logo layer — but
the app renders the real logo PNG (thick black orbit + tall M),
whose art covers parts the v32 picture's flatter logo art does not.
In the app render the blue heart's top lobes show (rows ~397-415)
and its lower portion sits behind the PNG's orbit band; the pink
heart sits almost fully behind the PNG's M (no #ff96c8 pixels at
y635-660 in its box; the pink shape nearby at y600-634 is a
background symbol heart, not the logo heart). In the v32 picture
both hearts are fully visible because that picture's orbit/M do not
reach those spots. The layer was NOT lifted above the logo to force
visibility — that would break the written v28 order Mars pointed
to. If Mars wants them visible like the picture, lifting them above
the logo is HIS call, not a silent change here.

## 6. Files changed (this PR, vs PR #233 branch)

- `src/lib/lockedV32Menu.ts` — cloud imgBox -> (224,599,825x264) +
  exact-target/decomp/app-lobe comment; animationSpeed default ->
  slow-rise; new `background.logoHearts` (2 entries).
- `src/components/game/MainMenuBackground.tsx` — heart renderer +
  hearts last in SVG; header/speed comments updated to slow-rise
  default.
- `src/lib/mainMenuSymbols.ts` — header comment only (slow-rise
  default); NO symbol data changed.
- `docs/ui-art-options/cloud-fixed3-checkpoint-20261026-2015.md` (new)
- `docs/ui-art-options/CHECKPOINT-LOG.md` (new)
- `docs/locked-versions.json` + `docs/locked-versions.md` (checkpoint
  registry entries)
- This trace file (new).
- 0 file deletions. 0 symbol positions changed. 0 cloud file bytes
  changed. Proof renders stay workspace-only per lane convention
  (referenced by path in the PR body, not committed as game files).

## 7. Renders + measurements (app build, true native sizes)

Renders (workspace `~/workspace/mochiichao-work/ui-art/`, new dated
names, nothing overwritten):

- `cloudemblem-20261026-stage3.png` — frozen stage, TRUE 1200x1500
  (window 1200x1643 compensates headless Chrome's fixed 143px
  vertical viewport deduction, found by experiment: window 1500 ->
  shot 1357, window 1700 -> shot 1557; width unaffected).
- `cloudemblem-20261026-moving3-moving.gif` + 28 frames
  `cloudemblem-20261026-moving3-frames/f00-f27.png` — TRUE 1200x1500,
  28 frames x 200ms = 5.6s loop (sampling; sine/speed parked except
  the explicit slow-rise order).
- `cloudemblem-20261026-phone390.png` — TRUE 390x844: the stage3
  render scaled to width 390 (488 tall) and centred in 844 white
  (178 top/bottom — the game's phone framing is stage-fills-width +
  vertical letterbox). A live 390-wide browser screenshot is NOT
  achievable in this Chrome (minimum window width clamps to 500 —
  the METRICS-emulation attempt came out 500x844, height right,
  width clamped); the post-processed frame is the faithful phone
  image, method stated here, not hidden. Earlier letterboxed
  versions (stage-frozen 1200x1357, phone 500x701, moving 1200x1357)
  are superseded evidence, kept, not overwritten.
- `cloudemblem-20261026-closeup.png` — TARGET crop vs NEW crop,
  same region (x100-1100, y600-920), labels carry the measured
  interior numbers.

Measurement table, stage coords, stage3 frozen render (bob phase 0
via reduced-motion):

| element | TARGET | NEW (stage3) | verdict |
|---|---|---|---|
| cloud interior (flood method) | 257-942 x 655-815 (685x160) | 257-942 x 655-816 (685x161) | left/right/top EXACT, bottom +1 (edge-threshold) |
| cloud right-lobe stroke (tight) | 819 | 819 | EXACT |
| cloud left-lobe stroke, visible (tight) | 812 | 819 | +7, see section 2 asymmetry note — Mars's call |
| cloud frame | — | (224,599,825x264) | transform only, file byte-identical |
| emblem field span (moving f00, palette mask) | picture 3-1195 | 4-1199 | side space 4px left / 1px right (target 3/5); field UNCHANGED in code, letterbox removed by native capture |
| emblem rise speed | slow-rise 8-14 px/s (code) | [TRACK RESULT TO FILL] | code-verified; GIF blob proof below |
| blue logo heart (placed) | centre (169,421.5), 63x50, #8cd2ff, under logo | same box, same layer | placed exact; lower part behind PNG orbit (see section 5) |
| pink logo heart (placed) | centre (230,640.5), 53x40, #ff96c8, under logo | same box, same layer | placed exact; ~fully behind PNG M (see section 5) |
| panels | CONTINUE y788-898, x300-900 | dense fill y791, x303-896 (3px border) | exact |
| cloud bob | +/-6px, 5s | UNCHANGED | still bobs; dead-static is a Mars-ordered follow-up only |

Slow-speed GIF proof: [TO FILL from the f00-f27 isolated-blob
track — per-symbol slopes vs the code's 8-14 px/s, plus the
order-of-magnitude contrast with perfect 157.14 px/s.]

Slow-speed GIF proof (measured, same-sampling comparison):
consecutive-frame magenta-blob matching (nearest within 40px,
0-120px rise, area >= 40px) over all 27 frame pairs:

- NEW moving3 (slow-rise dist): 534 matched pairs, median rise
  10.9 stage-px per frame interval.
- OLD fixed3 moving GIF (perfect-speed dist, same script):
  207 matched pairs, median rise 59.8 stage-px per frame interval
  (scale-corrected x0.90467 for its 1200x1357 letterbox).
- Ratio: 5.5x slower per frame in the new GIF. That ratio is a
  LOWER bound: the 120px match window understates the old speed
  (perfect symbols move ~110px+ per capture interval, so many true
  matches exceed the window and are lost or mismatched short),
  while the code ratio is ~157/11 = ~14x.
- Caveat, stated plainly: a GIF frame interval is NOT 200ms of
  game time — it is 200ms sleep PLUS screenshot capture overhead
  (unlogged by the script), so per-frame px must NOT be divided by
  0.2s to get px/s. The px/s claim rests on the CODE (vy 8-14,
  rAF real-dt, read from source above) plus this same-sampling
  comparison, not on the GIF's nominal frame duration.
- A 28-frame single-blob track that read 44.8 px/s is NOT used as
  evidence: a true slow-rise symbol cannot exceed 14 px/s, so that
  track necessarily hopped between symbols in the dense field
  (failed method, reported, not hidden).
