# XSHEET — EP01 SCENE 04 (Pond, dusk: stakeout → reveal)

Filled example for TIMING-SYSTEM.md Part 4. Notation per
TIMING-SYSTEM §2.3 (hold ranges, cycle `⟳frames φphase`, BANK
lines, events `@sec / f#`). Sources: board seconds from
`show/episodes/EP01/STORYBOARD-PLAN.md` (LOCKED script v2 package);
audio events from the shipped bed's gate record
(`EP01-SCENE-04-pond-dusk.gate.json`, measured −14.44 LUFS /
−1.00 dBTP, PASS); system IDs from LIVING-WORLD §§2.1–2.4, 3.3.

## Header

| Field | Value |
|---|---|
| scene | EP01-SCENE-04-pond-dusk |
| fps | 24 |
| length | 64 s = 1,536 frames (f1–f1536) |
| cuts | 13 (14 s) · 14 (10 s) · 15 (8 s) · 16 (6 s) · 17 (12 s) · 18 (14 s) |
| bed | BED-POND-DUSK (file: EP01-SCENE-04-pond-dusk.wav) — emptying automation over cuts 13–15 (insect layer thins) |
| stems | stems-ep01-scene-04.json — MUS-BASS −8 dB, MUS-HARM −11 dB; LEAD/TEXT absent |
| score_state | TENSION (cuts 13–16) → SETTLE (17–18) |
| wind_state | BREEZE at f1 → dies across 13–15 → CALM (17–18); mist stills as wind dies |
| finish | −14 LUFS / −1 dBTP (gate PASS on shipped bed) |
| flags | **F1** — bed event labels vs board frame ranges drift a few seconds (see Audio events note). Reconcile at animatic lock; audio events below are anchored to the bed timeline verbatim. |

Frame ranges (board seconds × 24): **13** f1–336 (0–14 s) ·
**14** f337–576 (14–24 s) · **15** f577–768 (24–32 s) ·
**16** f769–912 (32–38 s) · **17** f913–1200 (38–50 s) ·
**18** f1201–1536 (50–64 s).

## Columns (composite order, top first)

FG · CHAR:Gabu · CHAR:Kittember · CHAR:Sproutle · CHAR:Mochii ·
CHAR:Mochiko · FX · AMB:mist · AMB:ripple · AMB:reed · POP · BG ·
CAM · AUDIO

## Cut 13 — f1–336 · stakeout, five heads behind the bush

| Column | Exposure |
|---|---|
| BG | f1–336 `BANK:BR-POND-03` (dusk B-roll plate state) H▸plate |
| AMB:mist | f1–336 `AMB-POND-MIST-01 ⟳264 φ+0` (11 s drift; built for cuts 13–17) |
| AMB:ripple | f1–336 `AMB-POND-RIPPLE-01 ⟳89 φ+23` (2–3 motivated emitters) |
| AMB:reed | f1–336 `AMB-POND-REED-01 ⟳70 φ+41` (WIND-keyed; amplitude decays with wind_state) |
| AMB:shimmer | OFF whole scene — AMB-POND-SHIMMER-01 dies as the Stakeout lighting key takes the rim |
| POP | f~50 one `POP-WATER-SURFACE-01` surface break (last one; population withdraws for the scene) |
| CHAR ×5 | f1–336 holds with PERCH-class micro-motion only (blink 3–5 s random, one weight shift each) — stakeout stillness is the performance; twos for the two scripted head-turns |
| CAM | H▸locked (stakeout frame does not move) |
| AUDIO | BED-POND-DUSK in; emptying automation starts (insect layer −3 dB by f336); stems BASS/HARM at TENSION gains |

## Cut 14 — f337–576 · Gabu LUNGES (ACTION BEAT A)

| Column | Exposure |
|---|---|
| BG | f337–576 H▸plate (BR-POND-03 continues) |
| AMB:mist | f337–576 `⟳264 φ+12` — at the splash frames the mist level **splits** (two sub-levels separate early, so cut 17's parting is a level move, not a redraw) |
| AMB:ripple | f337–~470 `⟳89 φ+23` → splash **destroys the field**: ripple column blank ~20 f → re-forms f~490–576 with new emitter at the lunge point |
| CHAR:Gabu | wind-up TWOS → **lunge ONES** (the scene's ones spend — action beat) → recovery TWOS |
| CHAR others | holds + one flinch micro-beat each at the splash frame |
| FX | splash: `SFX-SPLASH-01` visual pair (droplet tail); splash is a hero BG-animation spend — puppet levels + drawn FX, generative re-flatten flagged option per LIVING-WORLD Part 4 |
| AUDIO | bed continues (emptying step 2); **EVENT @24.0 s / f577 Gabu cry lunge sting** — see F1 note: the bed places the sting on the cut's final frame boundary; on this sheet it is exposed as the last AUDIO frame of cut 14 per the gate record's own labelling |

## Cut 15 — f577–768 · tail-flame FLARES; giant spiky shadow on mist

| Column | Exposure |
|---|---|
| AMB:mist | f577–768 `⟳264 φ+31` — mist is now a **projection surface**: the shadow gag is exposed *on* this level (TK-1 takeover: the flame is the scene's light while it flares) |
| FX | tail-flame flare cycle (Kittember tail-tip flame, canon form) + spiky-shadow gag shape, held for the laugh, then released |
| CHAR:Kittember | ears/flame acting on twos; body hold |
| CHAR others | holds; eyes to the shadow (one blink-class beat) |
| AUDIO | **EVENT @34.0 s / f817 Kittember cry** at the flare; `SFX-COLDSPOT-01` second pass under the flare (GAP class — designed-sound build; bed v2 item, not yet an approved take) |

## Cut 16 — f769–912 · reveal of the gag: Sproutle's sprout silhouette

| Column | Exposure |
|---|---|
| FX/CHAR:Sproutle | the "giant spiky shadow" resolves to Sproutle's sprout silhouette — gag geometry exposed plainly, no new spend (the laugh is a re-read, not a new drawing set) |
| AMB | mist `⟳264 φ+52`; ripple minimal (one emitter); reeds near-still (wind now CALM) |
| AUDIO | **EVENT @38.5 s / f925 Sproutle cry** (silhouette-gag reveal) — F1: bed timeline places this just past the board's cut-16 end (f912); exposed here per the gate record's labelling |

## Cut 17 — f913–1200 · mist parts; Wispkin, small, shaking, holding the duck

| Column | Exposure |
|---|---|
| AMB:mist | the two sub-levels (split in cut 14) **part**: slow translate apart across the cut — a level move, the cheapest reveal in the episode |
| CHAR:Wispkin | float rig entrance; shaking = small-amplitude high-rate hold-offset cycle (a tremble, not a redraw set); duck prop in hands |
| AMB:ripple | exactly **one** ripple ring, early — the world returns at the volume of Wispkin's shyness (LIVING-WORLD §3.3) |
| AMB:reed | barely moving (CALM amplitude floor) |
| AUDIO | SCORE-STATE → SETTLE at f913; **EVENT @45.0 s / f1081 Wispkin soft cry** into the reveal |

## Cut 18 — f1201–1536 · the shy wail · SUBTITLE 1

| Column | Exposure |
|---|---|
| CHAR:Wispkin | wail pose held; tremble decays to still across the subtitle (the stillness *is* the emotion beat) |
| CHAR others | holds — nobody upstages the subtitle |
| POP/FG | **none** — subtitle zone protected (focus gate: no crossings f1201–1536) |
| AMB | minimum: mist nearly still, no new ripple emitters |
| CAM | H▸locked |
| AUDIO | **SUB f~1240–1500** — subtitle card: *"…I keep the garden at night."* (earned moment 1); bed **−6 dB momentary duck** under the wail (scripted absence class); stems at SETTLE gains; bed carries out to scene end |

## Audio events — consolidated (bed timeline, gate-verified)

| @s | frame | Event | Gate label |
|---|---|---|---|
| 24.0 | f577 | Gabu cry — lunge sting (ACTION BEAT A) | cut 14 |
| 34.0 | f817 | Kittember cry — tail-flame flare | cut 15 |
| 38.5 | f925 | Sproutle cry — gag reveal | cut 16 |
| 45.0 | f1081 | Wispkin cry (soft) — reveal/wail into SUBTITLE 1 | cuts 17–18 |

**F1 reconciliation note:** by board-second frame math, f577 is
the first frame of cut 15 and f925 falls inside cut 17's range —
the shipped bed was timed to v1 beat timings, and the board
(STORYBOARD-PLAN) states timings lock at the animatic, not before.
This sheet does not split the difference: picture follows the
board, audio follows the bed, and the animatic lock is where one
of them moves. Whichever way it resolves, the *events and their
order* are locked canon; only their frame addresses change.
