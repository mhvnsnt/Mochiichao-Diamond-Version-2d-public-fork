# Yellow intro structure — Mochiichao translation notes

Source files read (structure/order/timing only, no Pokemon art, dialogue, music, or code copied):
pokeyellow `engine/movie/intro_yellow.asm` (PlayIntroScene + 18-scene jumptable),
`engine/movie/title_yellow.asm` (title graphics placement), and the Yellow path of
`engine/movie/title.asm` (DisplayTitleScreen / logo bounce / title loop).
Date of pull: 2026-10-26. This closes the last open game in the intro/title research
count: intro/title research 12/12 games = 100% for game-structure coverage (the
remaining partial item in the 2026-10-25 checklist, Platinum options details, is a
separate item and is NOT claimed here).

## 1. The outer loop (PlayIntroScene) — the shape Mochiichao copies

- One loop, one frame at a time: read the current scene index, run that scene's
  step, run object animations, advance one frame, repeat.
- Exit conditions, checked every frame: scene index bit 7 set (scene 17 sets it
  after a 64-frame wait), OR A / B / START pressed (low-sensitivity joypad read).
  Either way the intro blanks palettes, clears object buffers and the tilemap,
  waits 3 frames, and hands over to the title screen. No scene is unskippable.
- Per-frame palette swaps: while the scene index is 7 the surfing palette
  alternate is applied; while it is 11 (0xb) the flying palette alternate is
  applied. In Mochiichao terms: a scene-index-driven palette hook, not a
  per-sprite flag.
- Music is stepped, not restarted per scene: scenes 2, 4, 6, 8, 10, 12 call
  UpdateMusicCTimes with a channel count (8 for scene 2, 5 for the rest) as
  they blank palettes and disable the LCD for the cut. Mochiichao translation:
  one intro music track, advanced at scene cuts.

Mochiichao translation table — outer loop:

| Pokemon element | Mochiichao replacement | HAVE / NEED TO MAKE |
|---|---|---|
| PlayIntroScene frame loop + scene-index jumptable | IntroSequence step-timer state machine (already the pattern in the game) | HAVE (pattern) |
| A/B/START skip, any frame | Same skip on any key / tap, blank + 3-frame settle before title | HAVE (pattern) / NEED TO MAKE (verify the 3-frame settle is in IntroSequence) |
| Scene-index palette hooks (scenes 7, 11) | Scene-index palette hook for the surfing / flying equivalents | NEED TO MAKE |
| Music stepped at cuts | One intro track, stepped at cuts, fades out on skip | NEED TO MAKE (track not picked) |

## 2. The 18 scenes, in order (jumptable order = play order)

Scenes come in action/hold pairs: an action scene sets the picture and a frame
timer, the following "wait last" scene counts the timer down and then masks
(hides) the current animated object and advances. Timers are frame counts at
60 fps: 128 frames (~2.1 s) is the standard hold, 88 frames (~1.5 s) is the
short hold, scene 0 uses 130 frames, scene 14's thunder hold uses 40 frames
(0x28), scene 17 waits 64 frames then sets the exit bit.

| # | Pokemon scene (structural label only) | What happens, structurally | Timer | Mochiichao replacement | HAVE / NEED |
|---|---|---|---|---|---|
| 0 | running creature, far | Small distant animated object spawned at (0x58, 0x58); palettes set; letterbox-style framing via window | 130 | Partner creature running in, far/small, letterboxed | NEED TO MAKE |
| 1 | wait last | Count down, mask object, advance | — | Hold + clear | NEED TO MAKE |
| 2 | creature kick | Palettes blanked, LCD off for the cut; a 6x6 tile graphic placed at (20, 6); speed-bar object spawned; music step (channel 8) | 128 | Mascot kick / impact beat, 6x6 tile block in that slot | NEED TO MAKE |
| 3 | wait last | As scene 1 | — | Hold + clear | NEED TO MAKE |
| 4 | running creature, mid | Letterbox running frame again; mid-distance frameset; on colour hardware, a 6x6 attribute block is written first, then the object | 128 | Partner running, mid distance | NEED TO MAKE |
| 5 | wait last | As scene 1 | — | Hold + clear | NEED TO MAKE |
| 6 | surfing creature | Scroll register (SCY) driven by an 8-bit sine-wave copy; top 3 tile rows blank, a 2-row wave band, then 24 rows of water tiles; surfing frameset spawned at (0x40, 0xf8) | 88 | Partner surfing / gliding on a sine-wave scroll, short hold | NEED TO MAKE |
| 7 | wait last, scrolling | While the timer runs, SCX increments by 2/frame and the scanline-override buffer is rotated (the wave scrolls); then mask + advance | — | Scroll continues during the hold, then clear | NEED TO MAKE |
| 8 | running creature, near | Letterbox running frame, near-distance frameset | 128 | Partner running, near/large | NEED TO MAKE |
| 9 | wait last | As scene 1 | — | Hold + clear | NEED TO MAKE |
| 10 | flying creature | Full tilemap cleared; 8 top rows filled, then a 20x6 cloud tilemap, a 4x3 cloud pair, a 2x2 small cloud; flying frameset at (0x98, 0x58) | 128 | Partner flying over clouds (3 cloud layers, same sizes) | NEED TO MAKE |
| 11 | wait last, cloud swap | Every 8th timer frame (timer & 7 == 0), cloud graphics are swapped in 4-tile chunks by VBlank copy, alternating by timer bit 3 — clouds shimmer while held | — | Cloud shimmer swap on the same 8-frame cadence | NEED TO MAKE |
| 12 | creature close-up | Top 4 + bottom 4 tile rows filled, middle 10 cleared; a 12x8 tile graphic at (5, 6) with 3 single-tile accents; eyes frameset at (0x60, 0x58) | 128 | Mascot close-up, eyes frame, same letterbox bands | NEED TO MAKE |
| 13 | wait last, sparks | On timer expiry, spawn a cheek-spark object at (0x68, 0x58) and advance immediately (no extra hold) | — | Spark burst on the close-up, then cut | NEED TO MAKE |
| 14 | thunderbolt flash | A fixed palette sequence is stepped through (repeated light/dark pairs, ending on a terminator value); on expiry the tilemap bands are rebuilt, palettes reset, and the thunder frameset is spawned | 40 | Flash sequence (palette steps, not a video flash), then strike pose | NEED TO MAKE |
| 15 | wait last, flicker | While the timer runs, every 4th frame (timer & 3 == 0) the sprite/background palettes are inverted (XOR) — a flicker; on expiry palettes are restored and the scene advances | — | Flicker on the same 4-frame cadence | NEED TO MAKE |
| 16 | fade to white | A short palette sequence steps toward white (values stepping down to 0, then terminator); on expiry advance | — | Fade-to-white palette ramp | NEED TO MAKE |
| 17 | wait and quit | Wait 64 frames, set bit 7 of the scene index — the outer loop's exit condition — and return to title | 64 | 64-frame settle, then title | NEED TO MAKE |

Total intro shape: 9 action beats (far run, kick, mid run, surf, near run, fly,
close-up, thunder, fade) separated by holds, ending in a white fade to title.
That is the Yellow-specific lesson versus FireRed/HeartGold: Yellow's intro is
a single-creature showcase reel (same creature, growing closer, changing
activity), not a world tour or a multi-creature fight.

## 3. Title screen, Yellow path (title_yellow.asm + title.asm)

Order in DisplayTitleScreen:
1. Load title music bank; white-out; clear screen; load font tiles.
2. Copy studio/copyright logo tiles into VRAM, then LoadYellowTitleScreenGFX:
   logo graphics, logo corner graphics, creature background graphics, creature
   object graphics — four separate copies, in that order.
3. Place, in order: logo tilemap 16 wide x 7 high at (2, 1); speech-bubble
   tilemap 7x4 at (6, 4) with 2 extra tiles at (9, 8); creature tilemap 12x9
   at (4, 8) with 4 extra tiles down the right edge (16, 10..13); creature
   eyes as 8 OAM entries (two eyes x two frames x two palettes).
4. Copyright tiles written, screen buffers saved/restored, palettes run.
5. Logo bounce: a scroll table drives background Y — (-4 x16), (+3 x4),
   (-3 x4), (+2 x2), (-2 x2), (+1 x2), (-1 x2), terminated by 0 — with a crash
   sound effect on the -3 step. The logo settles; it does not loop forever.
6. After the bounce: 36-frame delay, a whoosh sound, speech bubble placed,
   creature cry played, all music stopped, title music started.
7. Title loop, per frame: increment a reset counter (on overflow, fade out
   and restart from Init — the title times out back to boot); check held
   buttons: UP + SELECT + B together goes to the clear-save dialogue;
   A / START goes to the main menu (cry, white-out, clear sprites/screen);
   otherwise run the per-frame title function. The creature cry index
   advances through a cry list on a separate unreferenced path; the live
   loop keeps one cry per title entry.

Mochiichao translation table — title:

| Pokemon element | Mochiichao replacement | HAVE / NEED TO MAKE |
|---|---|---|
| Logo 16x7 at (2, 1), creature 12x9 at (4, 8), bubble 7x4 at (6, 4) | Locked title layout slots (logo PNG top, figure, bubble) — same relative stacking, Mochiichao art only | HAVE (locked title layout) |
| Creature eyes as separate OAM (animated independently of body) | Eyes as a separate animated layer over the figure | NEED TO MAKE |
| Logo bounce table (-4/16, +3/4, -3/4, +2/2, -2/2, +1/2, -1/2) + crash SFX on the -3 step | Same damped bounce on the logo, same beat for the impact sound | NEED TO MAKE |
| 36-frame delay + whoosh, then bubble + cry + title music | Same beat: settle, whoosh, bubble, mascot call, title music | NEED TO MAKE |
| Title timeout: reset counter overflow restarts from Init | Title idle timeout back to boot (duration = Mars decision, not copied as a number) | NEED TO MAKE |
| UP + SELECT + B = clear-save dialogue; A / START = main menu | Secret key combo for clear-save (Mars decision whether to keep one at all) + press-to-continue | NEED TO MAKE (decision) |
| Cry on title entry (PCM) | Mascot cry / call on title entry | NEED TO MAKE (sound not picked) |
| Copyright tiles after logo | Mochiichao studio copyright line after logo | HAVE (pattern) |

## 4. What this does NOT change

- No Pokemon art, dialogue, music, or code is copied into the repo by this
  document. Tile sizes, coordinates, timers, and function names above are
  structural facts (the same class of fact the 2026-10-25 research document
  already records for the other 11 games).
- The locked default title / v32 menu is untouched by this research. This is
  a translation-notes document only; wiring it into the game is a separate,
  Mars-approved step.
- The one remaining partial item from the 2026-10-25 checklist — Platinum
  options details — is NOT closed by this document and stays owed (1 item).

## 5. Counts

- Yellow intro scenes documented: 18/18 = 100%.
- Yellow title placement blocks documented: 4/4 copies, 3/3 tilemaps,
  1/1 bounce table, 1/1 title loop = 100%.
- Intro/title research overall: 12/12 games = 100% for game-structure coverage;
  Platinum options details remain the single partial sub-item (see §4).
