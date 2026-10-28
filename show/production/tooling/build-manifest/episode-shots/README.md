# EP01 Per-Cut Shot Specs — Coverage (cuts 02–28)

**Deliverable:** 27 shot specs in `episode-shots/<scene>/shot-NN.json`
(composite_shot.py format) + `EP01-episode.json` (episode_build.py
format). Script of record: `EP01-SHOOTING-SCRIPT-v2.md` (LOCKED).
Durations: `EP01-manifest.json` / STORYBOARD-PLAN (identical numbers);
cuts 02–28 sum to 257s; with cut 01 (8s, pre-existing proof spec) the
episode totals the locked 265s.

**Schema conformance:** composite_shot.py consumes only `background`,
`duration_s`, `layers[] {clip,x,y,scale,start_s,loop}`, `audio`,
`wind_or_bed_gain`. Every spec carries exactly those (`audio: null`
per the episode_build convention — scene beds carry the audio).
Camera / wind_state / subtitle / flags ride in extension keys the
parser ignores; **composite_shot.py has no camera, wind, or subtitle
renderer** — those fields are board/layout metadata, stated honestly
in each spec, not faked as tool inputs.

**Audio beds (measured with ffprobe on the repo-add WAVs):**

| Scene | Cuts | Bed file | Bed length | Scene length | State |
|---|---|---|---|---|---|
| 1 gate-morning | 01–05 | EP01-SCENE-01-gate-morning.wav | 37.0s | 37s | ✅ gated −14.18 LUFS |
| 2 pond-tour | 06–09 | EP01-SCENE-02-pond-tour.wav | 33.0s | 33s | ✅ gated −13.98 LUFS |
| 3 green-day | 10–12 | — none built (deliberate; cut 12 HALT) | — | 27s | ⚠️ episode spec `audio_bed: null` → silence segment + SILENT SCENE flag from episode_build |
| 4 pond-dusk | 13–18 | EP01-SCENE-04-pond-dusk.wav | **46.8s** | 64s | ⚠️ gated −14.44 LUFS but SHORT: episode_build loops it; timed cry events (24/34/38.5/45s) would repeat — mix flag |
| 5 gate-night | 19–24 | EP01-SCENE-05-gate-night.wav | **53.2s** | 58s | ⚠️ gated −13.94 LUFS but SHORT: loop on last 4.8s — mix flag |
| Stinger forest | 25–28 | EP01-STINGER-forest.wav | 46.0s | 46s | ✅ engineered absence −51.85 LUFS, exempt by design |

Grouping follows the beds' own gate.json cut lists (Scene 5 bed =
cuts 19–24). The script narratively puts cut 19 in Scene 4; the
discrepancy is recorded in shot-19.json and the episode spec note.

## Per-cut coverage

Legend: ✅ exists · ❌ missing/MAKE (flagged in the spec, never invented)

| Cut | s | Script beat | Spec | Layers (clips) | Missing assets (flagged in spec) |
|---|---|---|---|---|---|
| 02 | 6 | Mochiko arrives, too-big backpack | EP01-SCENE-01/shot-02 | — (none possible) | ❌ Mochiko rig/clip (no human bundle exists), backpack prop |
| 03 | 5 | Gate swings; Mochii bouncing on it | shot-03 | mochii-squash_hop ✅ | ❌ gate-door ridden-swing level (plate gate is at rest) |
| 04 | 8 | Mochii circles her at speed; her line; wind GUST | shot-04 | mochii-squash_hop ✅, mochii-tip_wiggle ✅ | ❌ Mochiko; circling motion path (static overlays only); distant_cry_faint_GAP sound |
| 05 | 10 | Dorowani + Manual, gavel-tap, Rule 1; wind CALM | shot-05 | dorowani-idle_breathe ✅ | ❌ Manual prop, Mochiko |
| 06 | 12 | Pond tour; Mochii stacks berry pyramid | EP01-SCENE-02/shot-06 | mochii-idle_bob ✅ | ❌ berry pyramid prop/cycle, Mochiko; ⚠️ living Pond plate in parallel build (parts-catalog still referenced) |
| 07 | 8 | Berries un-stack, unseen hands | shot-07 | — (by design: un-stacker never seen) | ❌ berry un-stack cycle (the cut's whole action) |
| 08 | 6 | Toy duck rolls uphill; both watch | shot-08 | mochii-idle_bob ✅ | ❌ duck prop + roll cycle, Mochiko |
| 09 | 7 | Kittember flame flickers at empty air; wind dies | shot-09 | kittember-tail_flame_wave ✅ | ❌ ears-flat pose; cold-spot SFX GAP. ⚠️ Kittember idle gate measured FAIL (pose-phase) — owner/scorer call |
| 10 | 9 | Gabu stomps in, net-cape, chest-beat bellow | EP01-SCENE-03/shot-10 | gabu-idle_breathe ✅ | ❌ Gabu stomp/chest-beat anim, net-cape prop, grass-wave cycle; ⚠️ no Scene 3 bed |
| 11 | 10 | Sproutle ground-level: frost-patch trail | shot-11 | sproutle-head_tilt ✅ | ❌ frost FX decals (the trail), cheek-to-grass exact pose; frost-crackle SFX GAP |
| 12 | 8 | Trail points at pond; device check-in eyecatch | shot-12 | sproutle-idle_breathe ✅, gabu-head_tilt ✅ | ❌ **KEEPER DEVICE — script OPEN ITEM → HALT**, Mochiko |
| 13 | 14 | Pond dusk stakeout, five heads, mist | EP01-SCENE-04/shot-13 | mochii/gabu/dorowani/kittember/sproutle idles ✅ ×5 | ❌ pond dusk grade, bush FG level, mist cycle AMB-POND-MIST-01, Mochiko |
| 14 | 10 | Gabu LUNGES — splash — smoke through fingers (Beat A) | shot-14 | gabu-jaw_chomp ✅ (loop:false) | ❌ true lunge anim (jaw_chomp is closest; RIG-NOTES: subtle), splash FX, smoke-through-fingers FX, dusk grade |
| 15 | 8 | Tail-flame FLARES; giant spiky shadow on mist | shot-15 | kittember-tail_flame_wave ✅ | ❌ shadow-gag layout (post layer, no-baked-shadows law), mist cycle, dusk grade |
| 16 | 6 | Gag reveal: Sproutle's sprout silhouette | shot-16 | sproutle-sprout_wiggle ✅ | ❌ backlit rim grade, dusk grade, Mochiko |
| 17 | 12 | Mist parts: Wispkin, shaking, holding the duck | shot-17 | wispkin-float_idle ✅ | ❌ duck prop, mist-parting move, dusk grade |
| 18 | 14 | The shy wail; **SUBTITLE 1/3** "...I keep the garden at night." | shot-18 | wispkin-mask_tilt_left ✅ | ❌ intertitle card composite layer, dusk grade |
| 19 | 10 | Mochiko kneels to its level; "Then let's do it properly." | EP01-SCENE-05/shot-19 | wispkin-float_idle ✅ | ❌ Mochiko (the kneel IS the cut), dusk grade |
| 20 | 12 | Keeper board, fresh paint: WISPKIN — NIGHT KEEPER | shot-20 | — | ❌ night board plate variant (the cut's subject), Mochiko |
| 21 | 12 | Rule 12 read aloud (exact wording); cricket beat | shot-21 | dorowani-idle_breathe ✅, wispkin-float_idle ✅, mochii-idle_bob ✅ | ❌ Mochiko (the reader), Manual prop, Gate night grade |
| 22 | 8 | **SUBTITLE 2/3** "...not alone anymore." over the board | shot-22 | wispkin-float_idle ✅ | ❌ intertitle card layer, night board plate |
| 23 | 10 | Wispkin floats UP first time; rings gate bell (Beat B) | shot-23 | wispkin-float_up ✅ | ❌ bell ring visual, Gate night grade; bell SFX GAP. ⚠️ float_up is one-shot 2.4s — rise-then-hold split flagged for layout |
| 24 | 6 | TAG: Gabu tips the net-hat; her line | shot-24 | gabu-head_tilt ✅ | ❌ net-hat prop, Mochiko |
| 25 | 20 | STINGER: Dark Forest, day; light doesn't reach in | EP01-STINGER/shot-25 | — (Forest law: cycles OFF) | ❌ Dark Forest plate (MAKE, parallel build) |
| 26 | 10 | Something stops moving; never shown | shot-26 | — (by law/design) | ❌ Dark Forest plate; NO "what stopped" layer may be added (script open item 1) |
| 27 | 12 | **SUBTITLE 3/3**: Rule 12 burns in low, holds | shot-27 | — | ❌ Dark Forest plate, forest-grade intertitle card layer |
| 28 | 4 | One leaf falls straight down; SMASH TO BLACK | shot-28 | — | ❌ single-leaf asset (non-looping), Dark Forest plate; smash-to-black is episode-level (no per-cut mechanism) |

## Cross-cutting missing assets (rollup)

1. **Mochiko** — no rig/clip bundle at all (casting OPEN + no human
   puppet yet): blocks her action in cuts 02, 04, 05, 06, 08, 11(line
   only), 12, 13, 16, 19, 20, 21, 24. All her dialogue is
   VOICE-SCRATCH in the beds by design.
2. **Plates** — Garden Gate living plate ✅ (life-proof file, registry
   garden-gate-v2-living CURRENT); Gate NIGHT grade ❌; Pond day =
   parts-catalog still referenced, living plate in parallel build;
   Pond DUSK grade ❌; Green = parts-catalog still referenced, living
   plate in parallel build; Dark Forest ❌ MAKE (parallel build).
3. **Props** — Manual, backpack, berry pyramid + cycles, toy duck,
   net (cape/hat), keeper device (**HALT**), keeper board night
   variant, gate bell ring: none exist as assets.
4. **FX/ambient layers** — mist AMB-POND-MIST-01, grass wave
   AMB-GREEN-GRASSWAVE-01, frost decals, splash, shadow-gag layout,
   smoke-through-fingers, single Forest leaf: none built.
5. **Intertitle cards** — style lives in IDENTITY-KIT; no composite
   layer asset exists for cuts 18/22/27.
6. **Action animations beyond rig sets** — Gabu stomp/chest-beat and
   lunge, Mochii circling path, Kittember ears-flat, Sproutle
   cheek-to-grass: rig sets cover idles/signatures/expressions only.

## Canon checks performed

- Subtitles: exactly cuts 18/22/27, texts verbatim from locked
  script; cut 21's Rule 12 is marked SPOKEN dialogue, not a subtitle.
- Rule 12 wording verbatim (script §0.3) in cuts 21 and 27.
- Names: The Dark Forest only; no Binary Woods / Codex / Light-Pulse
  strings anywhere (validator greps for them).
- Forest cuts: layers empty, wind OFF, STILL-FOREST camera — by law.
- Creatures: cries live in the beds; no creature dialogue anywhere.
