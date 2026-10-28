# PRODUCTION LOG — 2026-10-27 (the conversation of record)

Owner-directed: the decisions and philosophies from the production
conversations live IN the repo, for the show lane now and game
production later (same universe). This log is the index of rulings;
the governing text lives in the docs named. New rulings append new
dated logs; nothing here is silently rewritten.

## Identity & method
- Construction-kit rule (WORKING-METHOD.md): donors give systems,
  tools, materials, environments, props — never characters, names,
  logos. Backgrounds/environments/props may come over directly.
  Reuse-first: catalogue → select → assemble → make only gaps.
- RESEARCH DIRECTIVE: all future moves research-based only
  (RESEARCH-DIRECTIVE.md + INTEGRATIONS-MAP.md).
- Unified build: everything in ONE flow per scene — research,
  environments, animation (puppets + generative co-author), FX,
  camera, post, audio attached as the scene is built
  (UNIFIED-PIPELINE.md). Studio tools + generative AI combined.
- Wide frame first: design research is the full theory spine, not
  narrow slices (owner correction) — DESIGN-THEORY.md is the spine;
  COLOUR/POSING/PRINCIPLES are its chapters.

## Locked laws (bible §5 + systems docs)
- Voice Law: creatures = pure cries/sounds only. No word dialogue,
  no name-saying. Humans speak.
- Subtitle Law: silent-film intertitles at earned moments only
  (EP01 has exactly 3).
- Likeness Law: characters built from their actual repo art
  (canon title cutouts are the source of truth); generative work
  passes the likeness gate vs the model sheet before it is shown
  as production or shipped. Batch style consistency required.
- Animation Law: animatics/stills are timing proofs, never shipped
  or presented as animation. Frame-verified real motion only.
- Colour: Colour System v2 — four-slot species colourways, the
  Lustre Law, #a03436 discipline, per-location scripts.
- Lighting: the owner's own laws carried from cape-jones +
  Mochiichao (protected identity colours, rim-only environment
  colour, situational rim, takeover sources, overlay-layer shifts)
  — LIGHTING-SYSTEM.md L1–L7.
- Repaints: JoJo-style per-scene non-canon repaints are WELCOME,
  governed by REPAINT-PROTOCOL.md (light engine + lustre engine;
  protected anchors never move).

## Owner rulings & corrections (2026-10-27)
- EP01 "The Garden Has a Ghost" — title + direction approved;
  script v2 LOCKED; v1 deleted so no version confusion. Rule 12
  wording is exact (bible §5). Stinger: Dark Forest, daylight that
  doesn't reach in; something stops moving; never shown.
- Generative pilot batch REJECTED on likeness/style (batch record
  in clip-index + memory): Gabu converged to a Pokémon lookalike;
  Sproutle likewise; Mochii off-style; styles mutually
  inconsistent. Lesson wired in: seed from FULL canon art (title
  cutouts), one style anchor, gate before showing.
- Kittember: CLOSE but rejected — canon correction: the flame is
  ATTACHED TO THE TAIL TIP (never a floating orb); fixed in specs,
  rig scaffold, model sheet, bible, EP01 docs. A detached flame is
  now an automatic design-gate failure.
- Wispkin clip ACCEPTED FOR FLASHBACK ONLY: canon Wispkin wears a
  SKULL MASK; the maskless clip = pre-mask Wispkin; its different
  style is the flashback device. Asset: show/assets/flashback/.
  Wispkin model sheet corrected from the canon cutout.
- Garden Gate plate ACCEPTED as a background; its look is the
  theme anchor for environments going forward.
- Reference set for environments/camera/FX/post: Pokémon, Dragon
  Ball Z, JoJo, Gumball, Chowder (DBZ was the fifth the owner
  named). Chowder donor repo created (cn-gigaleak-chowder) for
  research + native kit under the construction-kit rule.
- LIVING WORLD requirement (owner, on the Scene 1 animatic): the
  animatic is the correct production start, and the finished show
  must live — swinging gate, swaying trees/grass/leaves, moving
  clouds, background creatures (bird-type Mochi in the sky, small
  Mochi crossing fore/background out of focus), B-roll between
  scenes, full ambient sound (rustles, gate shut, footsteps,
  run-throughs, ambience), lighting/after-effects life. Systems
  specced in LIVING-WORLD work (production/research) and wired
  into the next cuts; a still cut is a storyboard, not a scene.

## Open items (never filled silently)
Mochiko voice casting · keeper device design · what stopped
moving in the Dark Forest · the Forest's in-world name · season
length/runtime beyond pilot · the Manual's other Rules · GPU
endpoint for diffusion steps (owner's box via ComfyUI API vs
hosted) · first lustre appearance episode.


## Addendum — EP02–EP05 written (owner delegation 2026-10-27)
Owner delegated writing the first five episodes outright ("let me see what you do"). EP01 was already locked. EP02–EP05 packages (beat sheet + shooting script v1 DRAFT + storyboard plan + cue sheet) committed this date:
- EP02 "Choose, and Be Chosen" (PROPOSED title) — humans enter; Aeon presents the three starter lines; Mochiko chooses Mochii at cut 14 and THE SWITCH hands the protagonist role to Mochii; Hex button sets EP04.
- EP03 "One Ring Past the Gate" (PROPOSED) — first outing; ring game as play-ritual; Gabu featured; Zephling (roster 019, verified from species.json) ambient crossing; EP02/EP04 "tomorrow" tension resolved as a director's reading inside EP03 SS6 (no lines changed).
- EP04 "Dojo at Dusk" (PROPOSED) — Hex + Dorowani featured; dojo sparring; draw by custom (rule text = open item, none invented); the one hard grade spent at the turn (cut 20).
- EP05 "Leave the Light On" (PROPOSED) — night episode; Wispkin leads; the lantern; the Forest acknowledges with one turned leaf; its nature stays a deliberate open item.
All four: creatures cries-only, exactly 2 subtitles each, in-repo audio only on cue sheets, titles PROPOSED pending owner approval.
Owner rulings recorded this date: NAMING LAW (Mochii stays Mochii; Mochiko is the separate human character — never a nickname); VOICES = real voice-clone weights via his Wizard Gang method (Chatterbox + per-character reference audio + tuned params), not plain TTS; STAGING RULE (GitHub for what fits, TeraBox for what's too big, ration into repos in batches, never re-download).

## Addendum — Owner canon rename rulings (2026-10-27, later)
Three naming rulings, whole-canon scope, applied game + show:
1. BINARY WOODS -> THE DARK FOREST. One place, one name, in the
   canon, the whole repo, the whole game. Its contents (mist,
   wild Kittember, Aero Dojo + Cave of Echoes doors, NPCs, the
   humming beat line) carry under the new name; the EP01
   stinger's dread is this same Forest's depths.
2. LIGHT-PULSE -> ILLUMINATE. The world's Flash-equivalent is
   named Illuminate; "Light-Pulse" is retired everywhere.
3. CODEX -> MOCHIIOTECA. The world's Pokedex equivalent takes
   the name canon already held (MochiiMindService); settles the
   Codex/Mochiidex/mochiioteca drift.
Game-repo application: display-name strings renamed on a
dedicated branch off main; internal file/id keys (e.g.
binary_woods.json, story-flag ids) unchanged so wiring cannot
break. Show-side: SEASON-CANON-MAP carries all three rulings.

Rename EXECUTED same day: game repo PR #339 (branch
feature/canon-renames-1, commits 7a90142 + 0802b4e) - Dark
Forest (34 occurrences / 22 files) + Illuminate (2) +
Mochiioteca (6 files), verified at branch head; identifiers
(map ids, story flags) deliberately unchanged; PR open,
unmerged, awaiting the owner.

## Kaggle Wan 2.2 first generation test (2026-10-27)
Pipeline PROVEN end-to-end (Kaggle 2x T4 -> ComfyUI -> Wan 2.2
TI2V 5B -> downloaded MP4). Clip REJECTED at the likeness gate:
realistic 3D human skull + faint smoke; canon body/hands/flame
tip absent; style wrong. Registered in clip-index.json as
rejected_likeness_fail; file kept local, not shipped. Cause on
record: plain image-to-video only - the triple-lock (IP-Adapter
+ ControlNet) was installed but not engaged. Speed on record:
~28.5 min / 49 frames at 16fps on T4.

## CORRECTION — composite proof v1 was defective (2026-10-27)
Owner caught it: COMPOSITE-PROOF-gate.mp4 v1 showed Dorowani
frozen inside a black rectangle — the build flattened the WebM's
alpha to black and the character did not perform. The v1 proof
claim is WITHDRAWN. Root cause: the overlay pipeline decoded the
VP9 WebM without its alpha. Rebuilt with explicit libvpx-vp9
alpha decode; frame-verified (poses differ across the clip, no
black box, plate visible around the character; source WebM
motion measured, an idle's gentle sway). v2 replaces v1 at the
same path.

## Pipeline scaffold + orchestrator landed (2026-10-27)
Owner ordered BOTH routes: scaffold files landed directly here +
the dedicated show-pipeline bot configured. Landed under
show/production/pipeline/: state.json + manifest.json (adapted
from the owner's scaffold package to REAL paths/statuses),
runners/kaggle_tier2_runner.py (a real ComfyUI-API runner whose
honesty contract forbids self-certifying the likeness gate - it
writes gate packets marked PENDING_VERIFICATION only), and
ORCHESTRATOR.md (the bot's standing configuration: bus rules,
canon enforcement incl. the Dark Forest rename, gates, takeover
loop with the owner's approved_auto latch for unattended GPU
jobs). The pasted draft runner was NOT landed as-is: it wrote
PASSED_TRIPLE_LOCK without generating or gating anything, and
its state claimed locks active that no executed graph has yet
contained. Also landed: Wispkin body direction (owner) at
show/production/rigs/builds/wispkin/BODY-SPEC-OWNER-DIRECTION.md.

## CORRECTION 3 - Correction 2's MP4 replacement never reached main (2026-10-27)
Forensics, plainly: Correction 2's replacement commit (17dfc9d)
was based on branch head edbd3af. Before its follow-up ran, the
branch head had advanced to the wiring commit 5cd3665, and the
deletion commit (9f3c652) stacked on THAT tree instead -
orphaning 17dfc9d. The twins/composite deletions landed; the
real-MP4 replacement and the poster/clip-index/log corrections
did not. The post-merge verification then listed filenames only
and wrongly reported the bundle as the real set. REDONE on
branch feature/dorowani-real-avatar-set-1: the 4 MP4s + poster
are byte-identical copies of the live avatar files (md5s in the
clip-index entry), verified this time by downloading every file
back from main after merge and comparing md5. Standing rule,
hardened: bundle verification is hash-level or it did not happen.
Transparent twins return via Robust Video Matting (RVM,
ResNet50) run on the REAL clips, frame-verified before shipping.

## TWINS LANDED - transparent WebMs re-derived from the REAL clips (2026-10-27)
Method, honestly: Robust Video Matting (RVM ResNet50 + MobileNetV3,
pulled into ~/opt/tools/rvm) was tried first and MEASURED A FAILURE
on this material - trained on human video, its alpha collapses on
the flat cartoon body (belly alpha 0.000; coverage 0.208 -> 0.024
across 60 frames). The shipped twins use white-field matting
(white_matte.py, now in show/production/tooling/avatar-stack/):
distance-from-white alpha + enclosed-region rescue (belly
highlight, jaw, teeth) + speckle floor + white un-premultiply.
Measured: belly 0.972 / jaw 0.963 / corners 0.0; recomposite over
white reproduces the source at mean abs diff 1.08; background
flicker <= 0.004 per clip. COMPOSITE-PROOF-gate-v3.mp4 = the real
idle twin over the accepted Garden Gate plate, frame-verified
(frame 60 vs 140: performed pose change, plate clean around the
character). The bundle is now complete and every video in it
derives from the owner's live avatar clips.

## CURRENT-VERSION LAW + composite v4 (2026-10-27)
Owner set the law after the Gate composites (v3 + the three
variant showings) were built on the v1 STILL plate: upgrades get
marked as the piece that gets used, and building on a regressed
file throws away built work. The current Garden Gate background
piece is the LIVING background (this folder's EP01 CUT01 life
proof: cloud-shadow drift, leaf drift, pollen, wind bed), now
registered as garden-gate-background in parts-catalog with the
version chain (v1-still SUPERSEDED as standalone, v2-living
CURRENT, upgrade path named) + a clip-index entry. COMPOSITE-
PROOF-gate-v4-living.mp4 = the real Dorowani idle twin over the
living background (wind bed carried) - the composite proof of
record; v3 is marked SUPERSEDED in clip-index. Verified: f60 vs
f140 sky-region diff 3.76 (background alive inside the composite).

## GATE PAIRINGS per owner direction (2026-10-27)
Shipped: COMPOSITE-PROOF-gate-making_something-living.mp4 +
COMPOSITE-PROOF-gate-milestone-living-reframed.mp4 (both on the
CURRENT living background, wind bed carried; milestone reframed
smaller/lower so the falling star reads against open sky).
Owner direction recorded in clip-index: idle + making_something
pair with the Gate; working pairs with an interior/room piece
(to be marked current when built/selected); milestone's future
upgrade is a night-context living background. The three variant
showings on the v1 still plate were a repeat of the regression
the Current-Version Law was set for - owned in the log.

## CANON - WATER ORB (2026-10-27)
Owner canon decision: the Dorowani making_something avatar
animation is the WATER ORB attack animation in the Mochiichao
game + show universe - he forms a water orb in his hands like
he is going to throw/blast it (Rasengan / Kamehameha-class orb
charge, Pokemon-style attack presentation). Registered in
clip-index canon_names on the dorowani-avatar-stack-set entry
(MP4 + alpha twin). Game-data move entry: none exists yet in
src/data/core/moves.json; stats are owner-TBD, not invented.

## CORRECTION 4 - licence wording (2026-10-27)
PR #350's backends.json entries for MuseTalk / LivePortrait
said their MIT licences were "verified via GitHub API". The
API actually returned NOASSERTION / no detection for both
repos. The LICENSE files were then read directly at source:
both are MIT (MuseTalk (c) Tencent Music Entertainment;
LivePortrait (c) Kuaishou VGIC). Substance unchanged; the
verification-method wording is corrected in backends.json.
Logged per the Licence Honesty Law: a wrong label is an error
in either direction, including a wrong method claim.

## WISPKIN REFERENCE OF RECORD (2026-10-27)
Owner confirmed the canon Wispkin cutout is exactly what the
character needs to look like. Recorded in the Wispkin body
spec; the cutout is the likeness reference of record for the
rig, the gate, and Wan test 2.

## CROPPED REFERENCES RETIRED + GATE SCRUBBED (2026-10-27)
Owner decision: the pose-matched cropped references
(<species>-upper.png, the 0.91 "Option A" crop) are RETIRED
and out of the pipeline. The crop sliced the bottom ~9% - the
feet - off a perfect full-body cutout; a feet-chopped reference
is not usable for production. The local -upper files are
deleted; likeness_gate.py is scrubbed back to full-body
references only (the --reference-mode argument, the
pose-matched reference branch, and the pose_matched packet
fields are removed; full-mode measurements reproduce the
published v1 numbers - Dorowani idle SSIM 0.3099 / IoU 0.7702 /
MAD 61.281, verdict FAIL). The pose-matched threshold proposal
(IoU>=0.75 + MAD<=65, SSIM reported-only) is NOT adopted - it
dies with the references. Shipped thresholds stand
(SSIM>=0.50 / IoU>=0.55 / MAD<=40). The pose-matched
measurements stay in AVATAR-STACK-PIPELINE.md as retired-
experiment history. Gate strategy confirmed by the owner:
full-body canon cutouts are the only references; the gate is an
honest measuring instrument; promotion is the human scorer's
call.

## SPROUTLE - BAKED SHADOW REMOVED + NO-BAKED-SHADOWS LAW (2026-10-27)
Sproutle's canon cutout carried a baked-in gray ground shadow
(ellipse under the feet). Removed by measurement: 2,803 warm
beige-gray ellipse pixels cleared in the bottom band; claw
pixels untouched (4,579 before and after); zero changes above
the shadow band. The cleaned cutout is the CURRENT usable
version; the old version is preserved locally as
sproutle-v1-baked-shadow.png and marked NOT USABLE. The rig
texture (show/production/rigs/builds/sproutle/sproutle_tex.png)
was verified byte-identical to the old shadowed cutout and is
replaced with the cleaned pixels; rig data (mesh/bones/
animations) unchanged. Standing law from the owner: shadows
are NEVER baked into art; shadows are added in post /
compositing only.

## STAGING LAW + CANON CUTOUTS STAGED (2026-10-27)
Owner standing rule (2026-10-27): nothing production-related
stays staged on local disk. Everything pulled in must be wired
up, usable, and staged in GitHub (what fits) or TeraBox (what
does not fit - weights, large media, archives). Local disk is a
workbench, not a warehouse; local-only production material is
staging debt. The law is written into
show/production/pipeline/ORCHESTRATOR.md (Staging law section).
First debt cleared under it: the canon cutouts existed only in
the local workspace (~/workspace/mochiichao-show/canon-cutouts/).
All seven files are now staged at show/production/canon-cutouts/
with a README marking currency: the six clean full-body cutouts
are CURRENT/usable (they are the likeness gate's ground-truth
references), and sproutle-v1-baked-shadow.png is SUPERSEDED /
NOT USABLE (baked ground shadow; the clean sproutle.png is
current). Every uploaded file was verified by downloading the
blob back and md5-matching the local file (hashes in the
folder README and the landing PR).

## STAGING FOLLOW-THROUGH (2026-10-27)
Follow-through on the staging audit (PR #358): the remaining
local-only production items that fit GitHub are now staged,
each verified by downloading the blob back and md5-matching
the local file (hashes in the folder READMEs and the landing
PR):
- Rig previews (idle GIFs + filmstrips, all six pilot
  species; renders of the committed TextRig rigs) ->
  show/production/rigs/previews/
- Clean-Sproutle composite finals (the no-baked-shadows
  proof: final MP4, character + post-shadow WebMs, shot
  spec, frame grabs, feet zoom) ->
  show/production/tooling/build-manifest/composite-tests/sproutle-clean/
- Rejected Wan test 1 evidence (Wispkin likeness fail) ->
  show/production/tooling/avatar-stack/rejected-tests/
  (marked REJECTED, gate evidence only, not production)
- Gate debug_alignment.png from the retired pose-matched
  calibration run ->
  show/production/tooling/avatar-stack/gate-debug/
  (calibration history only)
- gallery/persona-band.png -> show/production/model-sheets/
Remaining known local-only material is scratch by verdict
(composite-test frame intermediates and strips, superseded
still-plate composite variants, rejected avatar options) —
not production, and it stays off the repo.

## CHARACTER SHEETS - PILOT SIX CLIP BUNDLES (2026-10-27)
Character-sheet clip bundles for all six pilot species landed
under show/production/character-sheets/ (branch
feature/character-sheets-1): for each species, every animation
its TextRig rig carries (idle / signature animation /
expression animation, rig names verbatim), each as a
white-field MP4 + a transparent VP9-alpha WebM twin
(alpha_mode=1), a transparent poster PNG, a manifest.json
(ffprobe-measured spec + sha256, motion verification) and the
idle's likeness-gate packet. Motion source: the TextRig DEFORM
rigs over the canon cutouts (likeness by construction),
rendered with a transparent stage at 30 fps on a 512x512 sheet
canvas; motion verified per animation by frame checksums +
mesh vertex-buffer checksums (all animations deform; held
poses - head tilts, the Water Orb charge hold - show fewer
distinct states by design). Gate (full-body mode, shipped
thresholds) recommendations on the idles: mochii PASS
(0.5814/0.9126/26.76), gabu PASS (0.6543/0.9676/24.32),
kittember FAIL (0.4985/0.7520/53.45 - mid-loop pose phase vs
the rest-pose cutout; recorded as measured), sproutle PASS
(0.7711/0.9721/15.92), dorowani PASS (0.5122/0.9186/29.03),
wispkin PASS (0.6895/0.8253/20.64). All bundles
quality_status PENDING_GATE, promotion PENDING_OWNER - the
packets recommend, the owner promotes. Naming: rig animation
names kept exactly; signatures described neutrally (canon
attack naming layers in separately) - Dorowani's
water_orb_charge is his canon Water Orb attack animation, his
alone. Sproutle rendered from the shadow-free cutout.

## MOVE RENAME BATCH 1 (2026-10-27)
Owner MOVE RENAME LAW (Jamar, 2026-10-27, standing): rename-on-
use - every Pokemon-named move gets a Mochiichao name in game
canon + game code as moves are used/attached in the show and
the game. Display names change; internal ids/keys stay exactly
as they are so wiring cannot break.
Batch 1 landed in src/data/core/moves.json and its source
src/lib/moves.ts (display "name" values only - ids, stats,
effects, anims and descriptions untouched; verified diff = the
five name lines in each file; the two stay in sync):
- AQUA_JET: "Aqua Jet" -> "Hydro Rush" (Mochii's signature;
  AQUA_JET is learned by Mochii alone, 1 of 47)
- RAZOR_LEAF: "Razor Leaf" -> "Leaf Blast" (Sproutle's
  signature; learned by Sproutle alone)
- SHADOW_PULSE: "Shadow Pulse" -> "Dark Wave" (Wispkin's
  signature; Umbral family move, learnset provisional-flagged
  in the data)
- AQUA_SHOT: "Aqua Shot" -> "Water Orb" (Dorowani's
  signature). Owner resolution: Water Orb REPLACES the closest
  existing orb-like entry (its desc is literally "a small ball
  of water hurled at the foe") instead of waiting on a new
  entry - this SUPERSEDES the earlier "Water Orb has no
  moves.json entry / stats owner-TBD" state (PR #345 record).
  Stats inherited from AQUA_SHOT (WATER Special 40/100/25);
  nothing invented. NOTE: AQUA_SHOT is shared (11 learners), so
  per rename-on-use in game code the rename is game-wide.
- EARTH_TREMOR: "Earth Tremor" -> "Tremor" (Gabu's signature;
  replaces the game's Earthquake-equivalent - no EARTHQUAKE id
  exists. Stats inherited: GROUND Physical 100/100/10.)
Kittember's FIRE_STREAM was already an original Mochiichao
name - unchanged. Canon mapping + owner decision record landed
at show/production/CANON-SIGNATURE-ATTACKS.md. Stale display-
name references in game/show docs were swept and updated in
the same PR; historical log entries before this one keep the
old names as written (append-only history).

## BIREFNET — MEASURED, SPLIT VERDICT vs WHITE-MATTE (2026-10-27)
BiRefNet (catalogued as a matting candidate in
show/production/tooling/avatar-stack/backends.json) was wired up
locally and MEASURED on the show's own material — the first time
it has been run on any of it. Local artifacts (frames, mattes,
results.json, run_measure.py) are kept at
~/workspace/mochiichao-show/birefnet-measure/; this entry and the
backends.json update are the measurement landing in the repo
(no test media in the repo).

Weights + licence (licence honesty law): the weights used are
the STANDALONE Hugging Face checkpoint ZhengPeng7/BiRefNet,
loaded via transformers AutoModelForImageSegmentation
(trust_remote_code) in a venv at ~/opt/venvs-birefnet, weights
cached under HF_HOME=~/opt/hf-cache (tooling cache). Licence
VERIFIED AT SOURCE 2026-10-27: the upstream repo's LICENSE file
read via the GitHub API is the MIT License (Copyright (c)
2024 ZhengPeng), and the GitHub licence API reports key=mit /
spdx_id=MIT for ZhengPeng7/BiRefNet — open source, MIT, for
code and these weights. rembg was NOT used: it was not
installed, and its DEFAULT session weights (BRIA RMBG-2.0,
CC-BY-NC non-commercial) were deliberately avoided and never
downloaded. No BRIA weights were touched anywhere in this run.

Method: 6 frames, ours only. (A) Dorowani avatar idle clip
(~/workspace/avatars/, white field), frames 12/60/120 at
720x720. (B) Wispkin Wan test 1 clip (rejected-tests/
wispkin-wan-test-00001.mp4, NON-white beige field), frames
0/24/48 at 960x2048. BiRefNet inference at 1024x1024, CPU,
2 threads. The repo's wired white_matte.py matte_frame() was
run on the same frames as the comparator. Scores per frame:
alpha coverage (opaque >0.98 / clear <0.02 / soft band),
corner-patch alpha, a belly patch on Dorowani (48x48 at
0.50w/0.66h; white-matte's published clip scores are belly
0.972, corners 0.0), a skull patch on Wispkin, edge quality
inside a +-3px morphological band around the alpha>0.5
silhouette (soft fraction in band; halo = fraction of band
pixels whose magenta composite lands within distance 40 of
the source field colour at alpha <0.95), and — Dorowani only,
where the frame IS ground truth (FG over white) —
recomposite-over-white mean abs diff on the 0-255 scale, the
same definition as white-matte's published 1.08.

Numbers (3-frame means):
- Dorowani, BiRefNet: recomposite diff 1.79 (1.81/1.79/1.77),
  belly 0.996, corners 0.000, opaque 0.380, clear 0.600,
  band soft 0.600, halo 0.0004.
- Dorowani, white-matte (same frames): recomposite diff 1.083
  (1.11/1.08/1.06 — reproduces the published clip score 1.08),
  belly 0.974 (published 0.972), corners 0.000, opaque 0.377,
  clear 0.596, band soft 0.470, halo 0.0000.
- Wispkin, BiRefNet: clear 0.975, opaque 0.023, corners 0.000,
  skull-patch alpha 0.816 (0.886/0.787/0.775), band soft 0.743,
  halo 0.026 (confounded here — skull bone colour is close to
  the field colour; the magenta-composite visual check shows
  a clean skull cut-out, no beige fringe ring).
- Wispkin, white-matte (same frames): TOTAL FAILURE —
  opaque 1.000, clear 0.000, corners 1.000, mean alpha 1.000.
  Off a white field it declares the entire frame foreground.
- Cost: BiRefNet ~78-90 s/frame (720x720 sources) and
  ~103-115 s/frame (960x2048 sources) on this 2-vCPU VM.

VERDICT (split, no hype): BiRefNet LOSES to white-matte on
white-field avatar material (recomposite 1.79 vs 1.08 — its
fuller belly, 0.996 vs 0.974, does not offset its softer edge
band and the missing white un-premultiply), so white-matte
stays the wired twin path there. On non-white-field generated
frames BiRefNet wins by default — it is the only one of the
two that works at all (clear 0.975 / corners 0.000 vs
white-matte's 1.000-everywhere failure). Caveats recorded:
BiRefNet drops the faint smoke wisps under the Wispkin skull
(near-background smoke reads as background — soft-FX shots
need an eye check before use), and at CPU speeds it is an
offline/Kaggle-seat tool, not an interactive one. backends.json
status for birefnet is now "measured" with these numbers in
the entry; it is not wired into generate_bundle.py.

---

## 2026-10-27 — FULL MACHINE-SET IMPORT PROGRAMME, PHASE 1: MASTER REGISTRY LANDED

Owner programme (2026-10-27): import the complete multi-generation TM/HM move sets and their move
animations — from the games and modern public communities, wherever publicly available — into the
game, universe, and canon, as the reference library from which show moves and show move-animations
are built.

CANON NAMING (owner-locked): the TM-equivalent class is GENERAL MOVES; the HM-equivalent class is
RARE MOVES. Acquisition stays Pokemon-like: General Moves are obtained by searching and fighting
through the world; Rare Moves are the scarce class and may also arrive pre-known on a creature or
through alternate acquisition routes (owner's comparison: how Pokemon GO hands them out).

CLASS RULE (owner-locked): RARE WINS — a move that was an HM in any generation is a Rare Move even
where later generations list it as a TM (Rock Smash, Flash; Gen-9 TM listings of Fly/Surf/Waterfall
stay Rare). TM-only = General. Never-machine moves carry no machine class. Per-generation history is
preserved in every registry row.

TWO-LANE CANON (owner-locked): the SHOW handles moves the way the Pokemon anime does — moves are
skill, learned through training/practice/observation/tutors; Rare Moves arrive known or are innate
capability; machine discs are not routine on screen (an Origins-style physical machine is at most a
rare story object). The GAME handles moves the way the Pokemon games do — the General Moves / Rare
Moves machine system, found and fought through the world. Each lane follows its own medium's canon.

WHAT LANDED (show/production/moves-registry/):
- machine-registry.json — 352 unique moves that have ever been a TM/HM in Generations 1-9:
  341 General Moves + 11 Rare Moves (Cut, Defog, Dive, Flash, Fly, Rock Climb, Rock Smash, Strength,
  Surf, Waterfall, Whirlpool); rare-wins precedence applied to 7 dual-history rows. Built from 2,372
  fetched PokeAPI machine records (BSD-3-Clause) reconciled with the in-repo tables (gen5plus,
  Black 2 decomp); stats provenance recorded per row. 13 rows map onto our playable 36.
- INDEX.md — computed counts, doctrine (anatomy-variance: a move's animation depends on the
  performer's anatomy — shape, size, build, mythical/legendary class; one performance is never the
  universal animation; every registry row carries the variance field), reconciliation, Show Bible
  hook (incl. the anime move-count convention — no enforced four-move limit — and the two Rare Move
  precedents: field capability as body+job, and prestige techniques gated like Z-Moves / examined
  Terastallization), and the honest gaps list (BDSP records partial in source; Legends Z-A numbering
  PokeAPI-only for now; TRs counted — 100 — and excluded by scope).
- ANIMATION-SOURCE-CATALOGUE.md — public animation sources surveyed with licences verified at
  source. Verdicts: metadata is pullable (PokeAPI pulled this phase; Showdown server tables MIT,
  next phase); all animation choreography/appearance sources (pret decompilations,
  fuddlesworth/pokebw2, Showdown client AGPL-3.0, Spriters Resource, Bulbagarden Archives) are
  community-extracted reference — REFERENCE-ONLY. No animation assets were pulled.
- RENAME-WORKSHEET-BATCH-1.md — 40 drafted near-synonym names under the synonym-rename rule
  (coolest near-synonym, meaning preserved), DRAFT — OWNER APPROVAL PENDING. No game files changed.

RECONCILIATION (computed): owner's B2/W2 list — 101/101 slots match the fetched data exactly (and
the in-repo Black 2 item table holds exactly 101 TM/HM items). Owner's SV+DLC list — 227/229 slots
match; 2 discrepancies: TM106 is Drill Run (not Acrobatics) and TM116 is Stealth Rock (not Energy
Ball) — which explains the list's two internal duplicates (Acrobatics x2, Energy Ball x2; TM014
Acrobatics and TM119 Energy Ball are correct as listed). Registry follows the games' data;
discrepancies logged in INDEX.md, not silently corrected.

## EPISODE BUILDER - episode_build.py (2026-10-27)
One-command episode assembler landed at
show/production/tooling/build-manifest/episode_build.py, chaining
the tools already wired in that folder: it renders every cut via
composite_shot.py, concatenates the cuts in episode-spec order,
attaches/mixes the scene audio beds at their scene offsets (an
existing bed WAV per scene, or a "build" instruction in the shape
scene_audio_bed.py implements), finishes with the house two-pass
loudnorm (-14 LUFS / -1 dBTP, measured at the target, encoded-file
peak verification with pull-down retries - the composite_shot.py
approach), invokes episode_gate.py, and emits a build report JSON
(per-cut status, final measured loudness, gate results, flags).
Failure law: a failed cut halts the build with the named error
EPISODE_BUILD_CUT_FAILED and a non-zero exit - no cut is skipped
or substituted, and no partial output is left behind. An example
spec (EP01-SCENE-01-mini-episode.json, same folder) mirrors the
local test build.
LOCAL TEST (media stays local, never in the PR): EP01 Scene 1
mini-master, ~37s, built in ~/workspace/mochiichao-show/
episode-build-test/. Honest equivalent, stated plainly: no
per-cut shot specs exist for locked cuts 02-05, so all five cuts
used the proven gate-proof-shot.json setup (living Gate
background EP01-CUT01-composite-life-proof-v1.mp4 + Dorowani idle
transparent twin at x=422, y=266, scale 0.6, shot audio null) at
each cut's locked storyboard duration (8/6/5/8/10s), with the
gated Scene 1 bed WAV (EP01-SCENE-01-gate-morning.wav) as the
scene bed. Measured on the finished file (ffprobe + independent
loudnorm analysis, not the plan): duration 37.000s, integrated
-14.20 LUFS, true peak -1.00 dBTP, finish gates PASS
(duration / loudness within 1 LU / true peak), episode_gate.py
invoked (exit 0; all five EP01 audio gates PASS; HALT cut 12 and
the ambient GAP flag reported by the gate as designed). The
failure path was also tested: a spec pointing at a missing
background halts with EPISODE_BUILD_CUT_FAILED, exit 1, no output
file, and a HALTED build report.

## Addendum — Kaggle consistency kit staged (2026-10-27)
Workstream: making the next Kaggle session for Wan test 2
(notebook mochiichao-comfyui-wan, ComfyUI + Wan 2.2 TI2V-5B,
2x Tesla T4) one-attach-and-run. Kit landed under
show/production/tooling/avatar-stack/ (fetch_consistency_
models.py, wan21_vace_first_last_frame.json, build_sparse_flf_
control.py, train_character_lora.py, CHARACTER-LORA-PLAN.md,
KAGGLE-KIT.md). Scripts/docs in the repo; weights stage to two
named PRIVATE Kaggle Datasets (mochiichao-wan22-consistency-kit
for models, mochiichao-character-loras for trained LoRAs) —
nothing weight-sized in git, nothing left session-local.
RESEARCH CORRECTION recorded the same day, superseding the
kit's first draft AND the standing "lock stack" framing: deep
research confirmed NO IP-Adapter and NO ControlNet exists for
Wan 2.2 — those tools belong to the still-image/keyframe stage
only (the kit fetches IP-Adapter only under --stills-stage,
into STILLS_ONLY folders). Wan-native conditioning equivalents
are VACE, Phantom, Wan-Animate-14B, S2V-14B and first/last-
frame control — all Apache-2.0, all 14B-class = T4-marginal,
documented not wired. The kit's working eval is VACE-1.3B
(Wan 2.1 family, Apache-2.0, 480p per its card) including the
sparse-keyframe FLF workflow; TI2V-5B has no FLF mode of its
own. LoRA correction alongside: per-character IMAGE LoRA is
the T4-feasible consistency path (musubi-tuner, ~12 GB image
training; ai-toolkit MIT verified alternate) — VIDEO LoRA at
recommended settings (24 GB+) is NOT T4-feasible and is a
headline honest gap, not a plan. Also staged as commercial-
clean post/music components, licences verified at source
2026-10-27: ACE-Step 1.5 XL Turbo (MIT, music layer),
RIFE via ComfyUI-VFI (MIT, interpolation; staged from the
node's own auto-download — no direct URL was verified, so
none was invented), RealESRGAN_x4plus_anime_6B (BSD-3-Clause,
17.9 MB, upscale). Nothing in the kit has been run yet: the
VACE eval, FLF pair and first image LoRA still have to earn
gate packets in session; Wan backend status (motion proven /
likeness unproven) is unchanged. Follow-up owed: reword the
backends.json ip_adapter/controlnet lock entries at the next
backends update so they cannot be read as usable Wan locks.

## Addendum — BATTLE DOCTRINE (owner-locked 2026-10-27)
Jamar's ruling on how battles work in both lanes. SHOW lane:
Mochi fight with their own agency — a battle is a continuous
living fight, not creatures standing idle waiting to be told
each move; trainers sometimes command and direct, but the
fight runs between commands and without them. GAME lane:
battles stay command-driven like the Pokemon games — player
commands are what affect health and outcome — but between
commands the creatures visibly fight and move in an active
living fight instead of idling; the between-command action
is presentation only, non-scoring, and health does not move
until a command resolves. Shared truth across both lanes:
a battle is alive between its decisive beats. Landed at
SHOW-BIBLE §5 Law 8 (show statement, + §9 open item 7) and
docs/arena-battle-presentation-spec.md §9 (game statement +
mechanical boundary). OPEN ITEM recorded in both places:
the canon term for the human who commands in battle — game
data uses "trainers", "keeper" is the Garden role; no term
coined.

## GAMEDATA ISLAND RENAME — OWNER DICTATION COMPLETED (2026-10-27)

Final pass on PR #364 (src/world/GameData.ts + src/world/FullWorldMaps.ts).
The owner's dictation for the island is now COMPLETE. The four names
that were pending resolve as: Gust -> Wind Blast (supersedes the
interim Gust Wave live-canon application in the island), Growl ->
Rumble (Doro's delegated pick under the owner's "find a synonym"
instruction, confirmed), Quick Attack -> Swift Movement, Crunch ->
Munch. The owner resolved the live-table collisions as RENAME
EVERYWHERE (live table + island + show), so these are canon names,
not island-only variants; stats and move data never change, only
display names. Rock Slide -> Rockfall: the owner chose Rockfall in
the final pass; Avalanche — picked in an earlier round after the
collision flag (Avalanche is itself a Pokemon move name) — is
REJECTED and appears in the record only as the rejected option.
Tackle stays Tackle in the island code for now: status delegated,
to be named in the full rename pass. Every other island name stands
as OWNER-LOCKED; the full final table is the mapping record at
show/production/GAMEDATA-ISLAND-RENAME.md. Verified: scan of both
code files for every old Pokemon name in the table (exact quoted
strings) — zero occurrences, Tackle excepted by the delegation; both
files fetched back from the branch byte-identical to the verified
edits. NOTE on this log: the branch log had diverged from main, so
it was rebuilt onto main's current log content and this entry
appended; the two interim island entries from earlier commits of
this PR are superseded by this entry, and the mapping doc keeps the
full per-round history.

## APPROVED_AUTO LATCH — OWNER FLIPPED ON, WITH CONDITION (2026-10-27)

Owner decision (2026-10-27): unattended GPU renders are approved —
"as long as it doesn't waste all my hours … as long as it's
actually working." `state.json` `next_action.approved_auto`:
false → true, with a `gpu_hours_week` counter added for quota
tracking. The condition is written into
`show/production/pipeline/ORCHESTRATOR.md` ("Autonomous GPU
condition"): autonomous runs only for queued jobs with a defined
output artifact; every run verifies its output landed and passed
its gate, or logs the failure and stops — no speculative renders,
no re-render loops; cumulative autonomous GPU hours halt at
24 h/week of the ~30 h Kaggle quota, the remainder reserved for
owner-directed work; a job that fails twice autonomously is
parked for the owner, never retried unattended.

## MOVE RENAME BATCH 2 (2026-10-27)

Rename-on-use, batch 2 — the three live-table name collisions
the owner resolved as RENAME EVERYWHERE: live table, island,
and show all carry the same names; move data and stats never
change, only display names.
- QUICK_ATTACK: "Quick Attack" -> "Swift Movement"
- CRUNCH: "Crunch" -> "Munch"
- GUST_WAVE: "Gust Wave" -> "Wind Blast"
Applied to src/data/core/moves.json + src/lib/moves.ts —
name values only; ids, stats, effects, anims, descriptions
untouched (CRUNCH's desc "Crunches with fangs." is prose, not
the display name, and stays). Display-reference sweep updated
the creature-mode pass-3 cooldown table, the UI style
guide's moves.ts template list, and the canon signature
doc's FX family list. Left standing as records / source data
(dated learnset analyses, playtest records, decomp source
citations, generated tables, prototype island datasets) —
full accounting in the batch 2 PR. Tackle's synonym stays
open under the owner's rename delegation; Growl -> Rumble
stands as the delegated pick.

## FULL RENAME PASS - machine registry completed (2026-10-27)
The owner delegated the full rename pass (2026-10-27): after naming
~35 moves himself, he delegated renaming ALL remaining moves, in his
demonstrated style - near-synonym, meaning preserved; element/flavour
word kept or swapped to his house words (Chrome for steel/metal, Frost
for ice); punchy one-to-two words; energy words Blast/Burst/Wave/Jet;
occasional playful literal; NEVER an existing Pokemon move name.
Landed: machine-registry.json now carries a Mochiichao name on all
352 rows (rename.mochiichao_name + rename.status). 16 rows are
owner-locked (his own picks and confirmed calls, incl. Earthquake ->
Tremor, Crunch -> Munch, Cut -> Slice, Surf -> Wave, Fly -> Ascend,
Strength -> Mighty Push, Rock Slide -> Rockfall, Flash -> Illuminate
under the canon naming law); 336 are delegated names assigned under
the delegation. NO other registry field was altered - verified by
deep-diff: every non-rename field is identical to the phase-1 data.
Readable form: MOCHIICHAO-NAME-MAP.md in the registry folder (all 352,
grouped by class, style statement at top). RENAME-WORKSHEET-BATCH-1.md
is marked SUPERSEDED in its header, pointing at the map.
Checks (all machine-run, counts of record): coverage 352/352 rows
named; blocklist of 928 Pokemon move names built from the in-repo
gen5plus table + Black 2 / Crystal / Diamond decomp tables + the
registry's own source names - ZERO proposed names collide (six first
drafts that collided were caught and replaced: Grudge, Head Charge,
Hyper Fang, Psyblade, Psywave respaced, Wave Crash); ZERO duplicates
among all 352 names; ZERO collisions with names belonging to different
moves in the live table or the GameData island doc. The 11 Rare Moves
all carry plain, strong, field-capable names in the owner's register.
NOT done by this pass (follow-up batch, listed in the name map):
applying the 12 remaining live-table renames to the game files
(Thunderbolt -> Storm Bolt, Wild Charge -> Reckless Charge, Flash
Cannon -> Chrome Cannon, Earth Power -> Terra Burst, Bulldoze ->
Dozer Crush, Dark Pulse -> Umbral Pulse, Night Slash -> Dusk Rend,
Poison Jab -> Venom Jab, Fire Punch -> Flame Fist, Dragon Claw ->
Draconian Talon, Body Slam -> Bulk Slam, Tackle -> Blitz), together with
the owner's already-confirmed rename-everywhere calls (Crunch ->
Munch in the files, Quick Attack -> Swift Movement, Gust Wave ->
Wind Blast, Growl -> Rumble). Flagged in the map as thinnest ice:
Assurance -> Sure Blow, Bide -> Wait Strike, Poltergeist -> Object
Haunt, Protect -> Aegis. Tackle postscript, same day: the owner
closed the one name he had left open and picked Tackle -> BLITZ
himself (football terminology), superseding the pass's delegated
proposal (Barge); Blitz is owner-locked and recorded in the name
map's follow-up section (Tackle has no registry row - never a
machine move). Dragon Claw postscript, same day: the owner locked
Dragon Claw -> DRACONIAN TALON himself, superseding the pass's
delegated proposal (Draco Talon); the registry row's rename.status
is now locked (17 locked / 335 delegated across the 352) and the
follow-up list above carries the locked name. (Draco Tail, the
Dragon Tail island name, is a different move and is unchanged.)
machine move). Divergence recorded, not hidden: the island doc's
Rock Slide -> Avalanche stands as its own record; the registry
follows his later Rockfall call.

## REGISTRY COMPLETION AUDIT + RARE FIELD-EFFECTS SHEET (2026-10-27)

Data-quality audit of the master machine registry (352 rows, rename-pass
state: 17 owner-locked / 335 delegated after the owner's Draconian Talon
lock, applied to the rename packet pre-push and recorded in the audit doc):
every row re-derived field-by-field from the source table its stats_source
declares (in-repo gen5plus / Black 2 / Diamond / Crystal tables). RESULT:
352/352 named, 352/352 classed (341 General / 11 Rare), 352/352 provenance
tags, 1,572/1,572 non-null stat values match their declared source, ZERO
transcription gaps, ZERO values invented or interpolated. All 188 null stat
fields are source-faithful (91 Status moves with no power in the source
model; 21 variable/fixed-damage moves; 76 no-accuracy-check moves incl. 10
sure-hit attacks; Roar/Whirlwind null is the Gen 6+ always-hit change).
stats_status MISSING list: EMPTY — no row lacks a stat that exists in any
in-repo source. Documented, not changed: the 10 Black-2-sourced rows carry
Gen 5 values (Draco Meteor 140) and literal decomp sentinels (Metronome
0/101); Soft Boiled is the one PokeAPI-fetch-provenance row; 10 rows lack
pokeapi_move_id (no in-repo source carries the ids; not filled from memory).
No registry values were altered by the audit.
Also landed: RARE-FIELD-EFFECTS.md — DRAFT, OWNER REVIEW: for all 11 Rare
Moves, the source-games field function with registry machine history, a
draft game-lane gate rule built on the owner's search-and-fight /
pre-known / alternate-route acquisition model (extensions flagged), and
the show-lane handling per the anime study (capability as body + job,
obstacles as puzzles, never a hard gate) with one scene example each.
Owner lock/amend list at the foot of the sheet (obstacle sets, two soft
gates, boulder reset behaviour, Wave pairings, acquisition placement).

## CANON SWEEP - SHOW LANE ALIGNED TO THE CORRECTED CANON SPINE (2026-10-27)
Show-lane pass of the canon sweep. The show Bible
(show/bible/SHOW-BIBLE.md) gains two locked laws in
section 5: Law 9, THE SECRET - the world is a computer
that grew a wilderness; no inhabitant knows; Professor
Aeon knows secretly and covers with "the mainland";
Luigi has a hint, not knowledge; villain hacker-speak
is double-layered dramatic irony that no ordinary
character may decode; production documents may hold
the truth, in-world artifacts must not betray it - and
Law 10, the TWO-LANE CONSISTENCY LAW: every canon
change applies in both the game data and the show data
(names, settings, doctrines; display names change,
internal ids stay stable). The season canon map
(show/production/SEASON-CANON-MAP.md) is aligned to the
ruled display names: the first route is Route Topaz,
the region and its plateau read Iridescence /
Iridescence Plateau, and the post-game isles are the
Seven Mochii Isles (double i - the isles are the sole
double-i exception among the ruled M-names; Mochi
Fruit, Mochi Cocoon, and Mochi Cards keep one i).
Every episode file on main (show/episodes/, EP01-EP05:
scripts, beat sheets, cue sheets, storyboard plans)
was scanned against the full rename list and already
reads in canon - no episode file needed a change.
Sector names are unchanged, per owner ruling.
Deliberately untouched: section 5 Law 8 and section 9
item 7 - the pending Rangers amendment closes Law 8's
open term; this pass does not pre-empt it. In the
season map, the former names quoted inside the two
RENAMED-BY-OWNER-RULING records stay quoted as the
record of those rulings (with the stable internal
file ids); every display use aligns.

## APPROVED_AUTO LATCH — OWNER FLIPPED ON, WITH CONDITION (2026-10-27)

Owner decision (2026-10-27): unattended GPU renders are approved —
"as long as it doesn't waste all my hours … as long as it's
actually working." `state.json` `next_action.approved_auto`:
false → true, with a `gpu_hours_week` counter added for quota
tracking. The condition is written into
`show/production/pipeline/ORCHESTRATOR.md` ("Autonomous GPU
condition"): autonomous runs only for queued jobs with a defined
output artifact; every run verifies its output landed and passed
its gate, or logs the failure and stops — no speculative renders,
no re-render loops; cumulative autonomous GPU hours halt at
24 h/week of the ~30 h Kaggle quota, the remainder reserved for
owner-directed work; a job that fails twice autonomously is
parked for the owner, never retried unattended.

## MOVE RENAME BATCH 2 (2026-10-27)

Rename-on-use, batch 2 — the three live-table name collisions
the owner resolved as RENAME EVERYWHERE: live table, island,
and show all carry the same names; move data and stats never
change, only display names.
- QUICK_ATTACK: "Quick Attack" -> "Swift Movement"
- CRUNCH: "Crunch" -> "Munch"
- GUST_WAVE: "Gust Wave" -> "Wind Blast"
Applied to src/data/core/moves.json + src/lib/moves.ts —
name values only; ids, stats, effects, anims, descriptions
untouched (CRUNCH's desc "Crunches with fangs." is prose, not
the display name, and stays). Display-reference sweep updated
the creature-mode pass-3 cooldown table, the UI style
guide's moves.ts template list, and the canon signature
doc's FX family list. Left standing as records / source data
(dated learnset analyses, playtest records, decomp source
citations, generated tables, prototype island datasets) —
full accounting in the batch 2 PR. Tackle's synonym stays
open under the owner's rename delegation; Growl -> Rumble
stands as the delegated pick.

## CANON SWEEP — GAME LANE: dialogue + wiring maps (2026-10-27)

Surgical display-name/dialogue sweep of the game lane, per the owner's
canon rulings: src/lib/wiring/dialogue/region1-truck-start.ink,
region{1..5}-dialogue.json, and src/lib/wiring/maps/*.json (only where a
ruled display string lives). 52 ruled string replacements across 9 files,
verified by word-level diff against main — the diff contains ONLY the
ruled changes; internal ids/keys/flags/variable names/roles are unchanged
and there are zero deletions. Applied: regionName "Mainframe" ->
"Iridescence"; "Mainframe Plateau" -> "Iridescence Plateau" (6 places:
Region 1 kind + town, Regions 2–4 ascent towns, Region 5 town + kind);
"Binary Dojo" -> "Champions Dojo" (Silicon Town door label) and "BINARY
DOJO" -> "CHAMPIONS DOJO" (sign) — the Core Gate title keeps; "Route 1.0"
-> "Route Topaz" (ink line, Region 1 town field, route_1 map name + sign;
the "Greenfield Path" epithet keeps) and "Route 2.0" -> "Route Emerald"
(Region 1 beat kind, route_2 map name + sign; "Harbour Road" keeps);
"Data Cards" -> "Mochi Cards" (ONE i, MochiiPlex clerk line); "Seven Data
Isles" -> "Seven Mochii Isles" (TWO i's — the sole double-i exception;
beat kind + town); Silicon Town sign "The genesis of your digital
journey." -> "The genesis of your journey."; and the battle-role word
"trainer(s)" -> "Ranger(s)" throughout dialogue lines and speaker labels
in all five region files, plus two map signs (MOCHIIPLEX "All your Ranger
needs in one spot!", "TRAINER TIP:" -> "RANGER TIP:"). Already current on
main before this sweep, so no edit was needed: "The Dark Forest" (map
name + Region 1 kind/town), the device name "Mochiioteca" (ink, Regions 3
and 4), and "Illuminate" (Region 3 cave line). No occurrences exist in the
in-scope files for: "Binary Woods" display text, "Data Fruit", "Data
Cocoon", "Light-Pulse", "Codex"/"Mochiidex" display text, or any of the
11 ruled move names (Aqua Jet, Razor Leaf, Shadow Pulse, Aqua Shot, Earth
Tremor/Earthquake, Quick Attack, Crunch, Gust Wave, Growl, Tackle, Dragon
Claw) — those renames live in the move-data lane. Kept verbatim by owner
law: all Hacker/Syndicate lines (including the Syndicate boss's "across
the whole Mainframe" and "The data here flows where we say it flows") and
The Front's "Even from the Mainframe itself". Structural fields flagged,
NOT edited: NPC role "trainer" (21 map NPCs), trainer_* NPC ids (7),
the dialogue files' format/team meta notes ("trainer lane owns teams"),
map ids/mapKeys/flags (binary_woods, binary_fields, mainframe_plateau,
data_isle_1..7, data_cut, national_codex, r3_codex_upgrade) and the ink
variable codex_get. Unruled digital/data/mainframe/system hits were left
untouched and are listed verbatim in the PR body (e.g. "Data-Cut",
"Data Ferry captain", "Data Astrologer", "data-spring", the world-sense
"Mainframe" lore lines, "Sector 0" — Sectors are ruled KEEP, and no
Sector name in scope carries a binary/data word).

## DIALOGUE TEMPLATE LIBRARY LANDED (2026-10-27)

The dialogue template library (show/production/dialogue-template-library/) is in the repo: README, TAXONOMY, PILOT-BATCH (30 canon-ready templates across 12 functions, owner-approved lines), GAP-MAP. Taxonomy measured from Gens 1-3 readable banks + Gen 4 present-but-undecoded; Gen 5-9 + Digimon/Monster Rancher slots designed; refusal list included. One follow-up remains: a cross-reference line in its README pointing at the dialogue kit's repo path, to be added when the kit's own landing decides that path (kit owned by the text-bank lane). Landed by the lock-everything wave.

## ADAPTATION LIBRARY LANDED (2026-10-27)

The adaptation-source library (show/production/adaptation-library/, 23 files) is in the repo: source catalogue (owner's repos first, public transcript structure notes second), 48 templates (14 episode shapes, 12 scene templates, 15 gag mechanisms, 7 reference slots), 6 pilot adaptations slotted into EP02-EP05 beats with subtitle accounting, and the DO-NOT-ADAPT list (22 flagged groups). Construction-kit filter applied throughout: donor structure and craft only - no donor characters, names, logos, or iconic lines carried. Landed by the lock-everything wave.

## VOICE-WEIGHTS MANIFEST LANDED (2026-10-27)

show/production/tooling/VOICE-WEIGHTS-MANIFEST.md is in the repo: the byte-exact record of the voice-seat weights (Chatterbox set 3,191,966,992 B, MIT; Kokoro set 330,355,132 B, Apache-2.0; grand total 3,522,322,124 B). The weights themselves are too large for git and live in their staged homes per the staging law (manifest names every location + the owner's two remaining steps: the Kaggle dataset upload and the TeraBox copy). Casting reference slots remain EMPTY - awaiting owner casting. Landed by the lock-everything wave.

## REGION 4 KIT — source map + mecha register (owner-directed 2026-10-27)

Holdings verdict (Bakugan repo placeholder; five franchises not held), Bakugan deep-use map from public structure, R4 flavor law, region-building source map R2-R5 + AIRSHIP-AND-MILITARY design doc (owner's airship sentence discharged: the Lord, the Order, the flagship; names TBD, six forks listed for the owner). Landed by the lock-everything wave.

## REGIONAL SPECIES BRAINSTORM LANDED (2026-10-27)

REGIONAL SPECIES BRAINSTORM landed as FUTURE CONSIDERED IDEAS - flavor law R1-R5 (R5 owner-set: his own universe + MALAKOR, gap noted), 60 concepts + 6 light R5 sketches, collision-checked against the verified canon subset and the full Pokemon roster; canon roster unchanged at 47. Landing gate completed in the lock-everything wave: full-47 re-check against species.json found ZERO exact name collisions; two newly-visible canon base sharings (Mothrix/moth, Squirmite/worm) flagged in-file as owner's-call sharings with distinct seeds. Owner confirmed all 60 names in chat 2026-10-27; concepts remain ideas until he locks them individually.

## TRANSPLANT ROSTER LANDED (2026-10-27)

show/production/transplant-roster/TRANSPLANT-ROSTER.md is in the repo (verbatim). Three anchors: SUN RA -> R3 Festival volcano Mochichao (OWNER-DIRECTED) - PANTERA -> R2 species (OWNER-DIRECTED) - BANNON -> R5 League Champion (OWNER-LOCKED), with ASHES/BUFFALO BILL resolved from western-heart roster/buffalo-bill/CANON.md (same man: unrobed Buffalo Bill, robed Ashes). Pool counts: 69 named + 2 role figures Layer 1 (owner's own casts) - 65 Layer 2 (brainstorm candidates) - 134 combined named persons / 136 entries. Section 5 flag register (somebody-else's names flagged for the owner's call, never renamed/dropped) and the Phantom canon collision (R1 dojo leader vs Western Heart pool) are the owner's decisions, preserved as flagged. Pull-pending: private Bannon TXT bios (5 profiles), wizard-gang-voice-pipe and TRIPPEDD records. Landed by the lock-everything wave.

## EP01 SCRIPT v3 LANDED (2026-10-27)

show/episodes/EP01/EP01-SHOOTING-SCRIPT-v3.md is in the repo with MANUAL-RULES-DRAFT.md and V3-CHANGE-NOTE.md: the full 24-minute pilot (107 cuts / 1,260s story) expanded around the locked v2 spine after the owner answered the beat map's five questions (cameos Jack-style, five intertitles, scripts independent of casting, draft Manual rules permitted, frost = Wispkin's round-trace with the close-up colour-shift device). Pre-landing verification per the change note's recipe: main's v2 is byte-identical to the local copy v3 was built from (sha256 cd75f06085a7311c), and all six LOCKED-SPINE blocks were re-diffed character-for-character against main's v2 - verbatim. v2 untouched. Rule 3 ('Feed the helper first...') rides as DRAFT-RULE pending the owner's lock. Landed by the lock-everything wave.

## BIG-WEIGHTS STAGING TABLE LANDED (2026-10-27)

show/production/tooling/BIG-WEIGHTS-STAGING-TABLE.md is in the repo: the byte-exact staging record for 56,978,422,938 B of production weights (Wan 2.2 consistency kit, ACE-Step 1.5, voice sets, stragglers audit incl. the RIFE gap), each with licence bucket, current homes, durable home, and the one remaining action + whose it is. The Wan bundle is prepared for Route A (in-notebook assembly) once the owner places the Kaggle token; ACE-Step's pull runs unattended and self-verifies. Table only - no weight bytes in git. Landed by the lock-everything wave.

## MOCHICHAO DESIGN LANE LANDED (2026-10-27)

MOCHICHAO DESIGN lane stood up (owner-directed) - charter with canon feed, two-lane coding, proactive delivery; full-apparatus data complete for the 60 owner-confirmed concepts (124 stage sheets: Bio/Footprint/Silhouette/Cry/Discovery + base fields), coded as species-data-draft.json mirroring the species.json schema (ids + stat numbers null until lock). Canon roster unchanged at 47. Name-collision check vs full canon 47 re-run and closed: zero collisions. Landed by the lock-everything wave.

## NAME-GAP LOCKS APPLIED (2026-10-27)

Owner confirmed the name-gap brainstorm's five headline picks and added a sixth of his own; all six are canon as of 2026-10-27. Game lane (surgical placeholder replacements in the region dialogue files, speaker/leader fields only): Region 2 Champion "CHAMPION (NAME GAP — not Hex, not Mythar)" -> "CHAMPION — Rin & Ren (twins, joint holders)" (entry R2-13; the twins hold one title jointly) and Region 2 First Champion "FIRST CHAMPION (NAME GAP)" -> "FIRST CHAMPION — Shimo" (entry R2-14, Frost Peak) in region2-dialogue.json; "NAME GAP — leader who knew Aeon, personal name not canon" -> "Kairos" (entry R3-07, badge R3-5/8 — the knew-Aeon Dojo 5 slot is carried in region3-dialogue.json; the mining's "Region 2" label does not match the file, flagged in the season canon map) and Region 3 Champion -> "CHAMPION — Nagisa" (entry R3-12) in region3-dialogue.json; Region 4 Champion -> "CHAMPION — Delta" (entry R4-15) in region4-dialogue.json; Region 5 League Champion -> "CHAMPION — Bannon" (entry R5-15) in region5-dialogue.json. Grand Champion Mythar (entry R5-17) untouched; every other NAME GAP remains open. Show lane: show/production/FUTURE-CONSIDERED-IDEAS-NAME-GAPS.md filed with the six marked OWNER-LOCKED (Bannon is the owner's own character, superseding the C-5 candidates; the misdirection — a robed figure believed to be Ash of Wizard Gang, the true champion Bannon, Region 5 under Wizard Gang control — is recorded in the season canon map), and show/production/SEASON-CANON-MAP.md records all six locks in their slots.


## Dialogue wiring — Region 1 fabric landed (PR feature/dialogue-wiring-r1-1)

- 18 fabric line-sets from the dialogue template library pilot batch
  (P-01–P-30) and the wiring-pass supplement (S-01–S-21) were wired into
  Region 1 map data under `src/lib/wiring/maps/` (13 files), additively
  only: map NPC entries gained `dialog` / `dialogAfter` / `battleDialog`
  fields in the game's existing dialogue shapes, and five maps gained
  entrance signs/plaques in their existing `signs` shape. No pre-existing
  line was altered or deleted (machine-checked per file); the story spine
  (`region1-dialogue.json`, `region1-truck-start.ink`, the locked ink
  dialogue file) is untouched. Villain/hacker sets (P-24, S-13) keep their
  authored double-layer wording verbatim.
- Full trace — every wired set with function, source (P-/S- number), target
  file/NPC, plus the 33 draft sets left unwired with reasons (no matching
  map/NPC in the wiring set, already-covered signs, owner-class leader
  content) and P-27 delivered as spec text — lives in
  `show/production/DIALOGUE-WIRING-R1-MANIFEST.md`.
- Built on post-canon-sweep main (PR #371 merged): all wired lines use
  swept display names (The Dark Forest, Champions Dojo, Aero Dojo,
  Rangers; no "trainer" in wired display text).

## SEVENTH NAME LOCK — MERV, REGION 2 DOJO 5 (2026-10-27)

Owner-directed seventh lock, filling the one gap the six-lock wave's Kairos correction exposed: Region 2's own Dojo 5 leader (Olivine City, badge R2-5/8, lighthouse dojo) stayed a NAME GAP because the knew-Aeon leader the brainstorm had labelled "Region 2 Dojo 5" is carried in region3-dialogue.json (Kairos, entry R3-07). The owner's solution is a recurring-character reveal: the lighthouse dojo leader is the ferry captain — MERV. The name is canon's own, not coined today: src/lib/wiring/dialogue/ink-dialogue-locked-2026-10-26.json carries the character block "ferry_merv" ("Ferry Captain Merv"; display rule locked 2026-10-26: the name appears only in after-defeat lines — "My name is Merv. Ferry Captain Merv. Remember it, because from here on, my ferry is your ferry too."). In region2-dialogue.json his arrival speaker label at Dawnfield (entry R2-01) remains "Data Ferry captain". Game lane: region2-dialogue.json entry R2-08, dojo.leader "NAME GAP" -> "Merv" — the only leaf changed in the file (parsed leaf-diff verified). Show lane: show/production/SEASON-CANON-MAP.md records the lock beside the six earlier ones in the OWNER-LOCKED section. ("Murph" in the owner's first dictation of this lock was a speech-to-text artifact; the canon name is Merv, and Merv is what is recorded.)

## GENERATIVE RETRY BATCH — HOSTED AVATAR ROUTE RESTORED (2026-10-27)

- Owner order: retry the hosted generative route (the Muse avatar generator — the method that made Doro's avatar set) after the morning's total upstream failure, and create EP01's character animation with it. Probe = Dorowani idle from the canon cutout: **SUCCEEDED** — the service is answering again (the morning's `worker_job_failed` / downstream-500 class did not recur).
- Six full avatar-stack bundles produced at measured target spec (720x720, 8s, 24fps + transparent WebM twins + posters + manifests + gate packets), motion-verified by frame-differencing (mean diffs 19.3-34.1 vs the 1.2 slideshow floor): dorowani idle (probe), dorowani WATER ORB, gabu TREMOR, kittember FIRE STREAM, sproutle LEAF BLAST, wispkin DARK WAVE. Landed under `public/assets/show-bundles/gen-retry-2026-10-27/` with the batch README carrying the full record.
- **Mochii — Hydro Rush NOT produced**: the generation call was refused by the media service (integrity check) and was not retried or rephrased, per policy. First item in the next batch queue; EP01 is not blocked (rig-pipeline Mochii clips are on main, PR #360).
- Gate: every packet is a FAIL **recommendation** at the shipped thresholds and every bundle stays `PENDING_GATE` — the same position as the owner-accepted avatar set's own packets (SSIM 0.334-0.403 / IoU 0.768-0.884 / MAD 44.9-61.7 in calibration). The probe idle lands in that band on the discriminating metrics (IoU 0.885, MAD 41.4). Hero-motion packets are measured at FX-peak frames; per-clip readings + neutral-frame packets are in the batch README and bundle folders. Promotion is the owner/scorer's recorded verdict only — nothing self-promoted; the batch's dorowani idle does NOT supersede the production avatar idle.
- Style law: all six clips render in the canon Mochiichao grammar (hard cel, ink outlines, training-anime read) — no soft-gradient preschool finish. Identity spot-checks: Gabu has no back cannons; Kittember's flame is on the tail tip throughout; Wispkin's mask is held by both hands with smoke bottom (reference of record); Sproutle has no baked shadow. Wispkin FX includes rune-like glyph graphics — flagged for the scorer.
- Phase 2 (free equivalent) NOT built: Phase 1 succeeded. Assessment recorded in the batch README — the Kaggle Wan stack remains motion-proven / likeness-unproven (test 1 rejected_likeness_fail), not yet equivalent on measured evidence; equivalence path = the staged VACE + LoRA consistency kit (Wan test 2), sequenced behind the A/B rerun still running in the owner's browser session.

## HUMAN RIGS LANDED — Mochiko / Hex / Aeon (2026-10-27)

The show's first human rigs are in the repo at show/production/rigs/builds/<name>/: TextRig whole-image DEFORM sets (DragonBones ske/tex + RIG-NOTES) built from the canon cutouts (no redraw), each with its talking set (Preston Blair mouth swaps wired for Rhubarb viseme cues + TALKING-SET.md + mouth-swap-spec.json), build-inputs for reproducibility, and the shared TALKING-SEAT-SPEC at show/production/rigs/. Registry updates in the same PR: show/shared/cast.json gains the three humans (rig paths + Chatterbox voice entries — Mochiko 0.45/0.5, Hex 0.3/0.6, Aeon 0.4/0.55; reference casting AWAITING OWNER) and CAST-RIG-SPECS.md gains the three human specs (humanoid track). These v1 builds are CURRENT for the three characters (no prior human rig exists). parts-catalog.json carries no rig entries for any cast member (creature precedent), so no entry was added there. Gate before episode use: ROM battery is the v2 pass. Landed by the lock-everything wave.

## CHIBI CARD SYSTEM LANDED (2026-10-27)

CHIBI-CARD-SYSTEM.md landed at show/production/ (spec-only: 85-90% full-size band, caps table, never-change anchors ink #101010 / accent red #a03436; EP01 slots in its section 7, pointer added to the EP01 change note). Its section 8 Bible law (draft Law 11) is DRAFT - FOR OWNER LOCK and did NOT land in the Bible; the Bible is untouched until the owner locks the wording. No card art in this landing. Landed by the lock-everything wave.

## CANON RECORD - DOROWANI EYES + INDIVIDUAL VARIATION (owner ruling, 2026-10-27)

DOROWANI EYE CANON: the Dorowani species' eyes are red + black, no sclera whites. The avatar/show individual Dorowani (Doro) HAS eye-whites - owner ruling: KEEP him; the whites are his personal deviation and stay consistent for this individual in every future generation. Other Dorowanis follow the species pattern (some individuals may carry black around the eyes instead, etc.). General doctrine: same-species individuals are mostly alike with real deviations - a deviation on a named individual is character, not an error, once the owner rules it so. Also recorded in show/shared/clip-index.json canon_notes.dorowani_eyes.

## LIVING PLATES LANDED - PROVISIONAL SPEC PLATES (2026-10-27)

EP01 environment plates landed: PLATES-REGISTRY.md at show/shared/ (current-version record) + parts-catalog collection mochiichao-environment-plates-ep01; 8 plate files under show/assets/backgrounds/{pond,green,dark-forest}/ (all md5-verified against the registry at landing); builder at show/production/tooling/living-plates/build_plates.py; EP01 build manifest wired (cuts 06-09 pond-day, 10-12 green-day, 13/17 pond-dusk + AMB-POND-MIST-01, 25-28 forest STILL with the PROVISIONAL flag replacing the MAKE flag; per-cut wind_state / ambient / population / composite_life / bed fields added). STEP-0 FINDING: the in-repo candidates (battle-bg-lake-v3d / battle-bg-garden-v3d) are battle-scale battle-screen backdrops with a central battle-ring ellipse - NOT usable as cinematic plates; the finding is recorded in the registry GAP rows and the plates land labelled PROVISIONAL (canon painted Pond/Green/Forest plates remain MAKE/GAP). Forest plate is STILL by law (Cycles OFF, wind NONE). Landed by the lock-everything wave.

## EP01 SHOT SPECS LANDED (2026-10-27)

Per-cut shot specs landed at show/production/tooling/build-manifest/episode-shots/ (28 shots: the 27 delivered specs plus shot-01, the proven gate-proof spec with paths rewritten repo-relative, landed in the same PR so the full-episode build does not halt at cut 01) + EP01-episode.json + COVERAGE.md as episode-shots/README.md. Static validation: 0 errors. Plate paths in shots 06-28 updated at landing to the landed provisional plates from PR #393 (pond-day / pond-dusk / green-day living MP4s; Dark Forest still PNG at show/assets/backgrounds/dark-forest/EP01-PLATE-dark-forest-day-v1-still.png - note the specs originally referenced show/assets/backgrounds/dark-forest-stinger-day.png, which never existed; reconciled to the landed path). Mix flags carried in the PR body: Scene 4 bed 46.8s vs 64s scene; Scene 5 bed 53.2s vs 58s; Scene 3 silent-by-design; cut 12 HALT (keeper-device open item); Mochiko absence rollup. Landed by the lock-everything wave.

## SEASON MAP EP06-EP10 LANDED (2026-10-27)

Season-level direction docs landed: SEASON-MAP-EP06-EP10.md + SEASON-ARC-NOTE-EP01-EP10.md at show/production/; per-episode BEAT-SHEET.md extractions seeded show/episodes/EP06-EP10/ (extraction from the map, not a re-write; NO shooting scripts created - scripts follow owner approval of direction at the board pitch). Cross-refs: EP06-EP10 rows added to show/episodes/README.md (titles PROPOSED); pointer line appended to SEASON-CANON-MAP.md (canon content untouched). All five titles remain PROPOSED - landing preserves, does not lock. No EP01-EP05 files edited; shared manifests untouched; Bible untouched. Landed by the lock-everything wave.

## PROSODY SYSTEM LANDED (2026-10-27)

PROSODY-SYSTEM.md landed at show/production/ beside VOICE-DESIGN.md (companion: method + line-reading rules + timing integration; parameter sheets stay in VOICE-DESIGN.md, whose numbers were re-verified against live main at landing - Mochiko ex 0.45 / cfg 0.5, Hex ex 0.3 / cfg 0.6, Aeon ex 0.4 / cfg 0.55, chain unchanged - and were NOT changed by this landing; one pointer line added under its title). Synthesis of the three 2026-10-27 research inputs (industry report / repo mine / bible-craft study); the source map is folded in as the doc's appendix so the audit trail travels with it. Casting still PENDING for all three humans; no voice rendered, no casting made, no numbers changed. Landed by the lock-everything wave.

## GEN-1 GAP AUDIT LANDED (2026-10-27)

Species-data-system package landed at show/production/species-data-system/ (the folder carried no landing recipe of its own - its README assigns repo PRs to the design lane - so per the wave's fallback it lands as show/production documentation). Headline: Gen 1 reconciles to 49 species - Dorowani + Gabu exist in every asset/dex layer but had NO species.json records; footprints/silhouettes/cries 49/49; bio_long 0/49; bio_short 12/49; height/weight recorded nowhere; three numbering schemes live; package validator 343/343. The drafted fills (gap-fills/) ride in this PR as FLAGGED DRAFT files under a DRAFT-NOT-APPLIED marker - they were NOT applied to src/data/core/species.json or any live game data. Landed by the lock-everything wave.

## CANON RULINGS RECORD (owner rulings, 2026-10-27)

Recorded in the production log and in show/production/SEASON-CANON-MAP.md (rulings entry, same PR): (1) Falk's team LOCKED = Zephling / Aerobeak / Stormtalon (doc conflict resolved for the locked reading). (2) Representation names LOCKED: Wisteria Vale (short forms Wisteria / Vale), Tessa Bolt, Saffron Potts (short form Saffron). (3) The vitiligo cartographer IS Admin Voss - same person. (4) Phantom: canon Phantom is based on Western Heart's Phantom - basis, not collision. (5) The Airship Lord's name = MAXXIMUS. (6) Dorowani eye canon already logged in PR #391; Kittember's tail-tip flame ruling (flame attached to the tail tip, never a separate floating orb) restated in the same record.

## TEARDOWN LANDED - SPECIES-SYSTEMS (List items 1-3) (2026-10-27)

Species-systems teardown landed: MOCHIIOTECA-FORMATS.md, CRY-SYNTH.md, SILHOUETTE-DISCOVERY.md, species-sheet-schema-patch-cry.md, cry-schema-fragment.json, README.md at show/production/species-systems/; tools (cry_synth.py, discovery_assets.py, pilot_six_cries.json) at show/production/tooling/species-systems/. The auto-footprint in discovery_assets.py is labelled in-file as a CONTACT-PATCH PROXY and lands labelled exactly so. Test-output cry WAVs are NOT landed (they land at public/audio/cries/ on owner lock only); test-output discovery strips stay workspace-only evidence. The species.json cry-block data entry the package calls for is data-lane work in its own PR rhythm, not part of this landing. Landed by the lock-everything wave.

## TEARDOWN LANDED - VOICE-KIT (2026-10-27)

Voice-kit teardown landed at show/production/tooling/voice-kit/ per its WIRING.md section 3 (kit files preserving structure; VOICE-KIT.md at docs/; WIRING.md + TERABOX-MANIFEST.md at kit root; the Actions workflow at .github/workflows/voice-render-mochiichao.yml, the only place GitHub runs workflows). TERABOX-MANIFEST rides as PREPARED-NOT-STAGED - no weights land in the repo. One line added to TOOLING-INDEX.md and a pointer line in VOICE-DESIGN.md chain step 3. The one remaining manual step is the owner's: casting Mochiko's reference audio (the renderer refuses a CASTING_TBD slot by design). Landed by the lock-everything wave.

## TEARDOWN LANDED - RIG-AND-MOUTH SYSTEMS (2026-10-27)

Rig-and-mouth teardown landed per its STAGING.md: RIG-TEARDOWN.md at show/production/rigs/RIG-TEARDOWN-open-movies.md; biped/quadruped rig templates at show/production/rigs/templates/; MOUTH-DATA-FORMAT.md + rhubarb_to_mouthdata.py + examples/ at show/production/tooling/mouth-data/; STAGING.md at show/production/rigs/RIG-TEARDOWN-STAGING.md. The package's documentation of the VM Rhubarb binary fault + reinstall path lands as-is. Its cross-reference edits (rigs/README, TOOLING-INDEX, MATERIALS-INDEX) are marked side-lane PR in its STAGING and are NOT in this landing. Landed by the lock-everything wave.

## TEARDOWN LANDED - BATTLE-PRESENTATION (2026-10-27)

Battle-presentation teardown landed per its STAGING.md: MOVE-ANIM-SCRIPT-FORMAT.md + BATTLE-UI-FLOW.md at show/production/battle/; hydro-rush.animscript.json at show/production/battle/animscripts/ (first entry of the per-move animscript library); validate_animscript.py at show/production/tooling/battle/; BUNDLE-FORMAT-LUSTRE-PROPOSAL.md + palette_variant.py at show/production/tooling/avatar-stack/ (proposal, not adopted). The palette test outputs land at show/production/battle/examples/ as TEST EVIDENCE ONLY: the Flickfin palette is labelled in-file TEST-ONLY (its source is the owner-rejected batch-001 design - not production art, not a lustre exemplar) and the Mochii palette is a mechanics test (TESTONLY filename + in-file note; not a canon lustre map). Landed by the lock-everything wave.

## TEARDOWN LANDED - AUDIO-TIMING (2026-10-27)

Audio-timing teardown landed per its STAGING.md: ADAPTIVE-MUSIC.md + TIMING-SYSTEM.md at show/production/; Scene 4 stem manifest at show/episodes/EP01/audio/EP01-SCENE-04.stems.json; Scene 4 xsheet at show/episodes/EP01/timing/XSHEET-EP01-SCENE-04.md. FLAG F1 PRESERVED: the shipped Scene 4 bed's event timings drift a few seconds from the storyboard plan (the bed was timed to v1 beats); the xsheet anchors to the bed timeline verbatim and flags the drift for the animatic lock - both sources landed unfudged, flag intact. The Dark Forest depths score row in ADAPTIVE-MUSIC.md is PROPOSED, not canon, and lands labelled PROPOSED. Build-manifest score_state/stems compiler wiring and parts-catalogue mirroring are noted wiring points, not done by this teardown. Landed by the lock-everything wave.

## TEARDOWN LANDED - WORLD-SYSTEMS (final List-2 package) (2026-10-27)

World-systems teardown landed per its STAGING.md: six docs at show/production/world-systems/ (+ STAGING-2026-10-27.md as the landing record); three schemas at src/data/core/schemas/; spawn-table instances at src/data/core/encounters/ (new folder; encounters.json seed untouched); route graph at src/data/core/routes/; wave-1 evolution edges at show/production/species-data/. AUTHORISED LANDING EDIT: MOCHIIOTECA-COMPLETION.md gains one re-pointing paragraph - written before species-systems landed, its dex-registry / sheet-discovery references now point at the MOCHIIOTECA-FORMATS fields (PR #398). Flags landed intact: Dark Forest depths spawn table intentionally EMPTY (canon does not stock the depths); A9 Twinvow pair-merge edges flagged OWNER_DECISION; Victory Route fragment_count=8 flagged STRUCTURAL INFERENCE in the data; evolution triggers null by design. This completes teardown Lists 1+2 (items 1-16) - the main lane's teardown queue is empty. Landed by the lock-everything wave.

## KITTEMBER CANON-PASS REGENERATION - TWO CANDIDATE BUNDLES (2026-10-27)

- Owner order: PR #389's Kittember bundle was scored off-canon (black quadruped, pink ears, invented white chest patch, flame-plume tail) and a canon-pass regeneration was ordered against the canon cutout of record (kittember.png, sha256 f5b3e39f8752534bafcf7de4d9cb5babab9b3899a10cf92c45f8e5aff6f39430).
- Both variants were generated on the fresh owner authorisation via the hosted avatar route and bundled with the avatar full stack (720x720, 8s, 24fps + transparent WebM twins + posters + manifests + gate packets): the TAIL form is the primary form (~75% per owner canon - fire stream fires from the tail orb, mouth closed) and the MOUTH form is the variant (~25% - blast from the mouth with the orb burning on the tail tip throughout).
- Seven-trait canon direction for the pass: (1) coat dark GREY not black; (2) upright bipedal stance throughout; (3) NO white chest patch; (4) ear interiors DARK not pink; (5) eyes BIG, ROUND, forward-facing amber; (6) tail tip a ROUND ORANGE ORB (glowing sphere), never a teardrop flame plume; (7) SMOOTH coat, no fluff tufts.
- Trait check (frames 12/96/180 inspected; tail also 60/130/160 for form): TAIL passes the coat/stance/no-white-patch/dark-ears/smooth traits, its eyes are big round amber, and its tail tip is a clean round orange orb at f12/f180 (flame-wreathed at the f96 charge peak); the stream verifiably fires from the tail orb with the mouth closed (f130). Flag for the scorer: a light-grey belly oval is present in both variants (canon coat is solid) and the tail stem is dark where canon's is orange-gradient. MOUTH passes coat/stance/no-white-patch/dark-ears/smooth and its mouth blast is clear at f96, BUT its eyes are narrower/slanted rather than big-round and its tail tip is a teardrop flame plume at f12/f96 and a smoky flame blob at f180 - never the round orb, so the 'orb burning on the tail throughout' variant condition is not met.
- Gate (recommendations only, shipped thresholds SSIM>=0.50 / IoU>=0.55 / MAD<=40.0): TAIL middle frame 96: SSIM 0.3725 / IoU 0.5464 / MAD 99.619 - FAIL; frame 12: SSIM 0.3751 / IoU 0.5114 / MAD 102.347 - FAIL. MOUTH middle frame 96: SSIM 0.3884 / IoU 0.5357 / MAD 97.306 - FAIL; frame 12: SSIM 0.4284 / IoU 0.5751 / MAD 86.501 - FAIL. Both bundles stay PENDING_GATE; promotion is a recorded owner/scorer verdict only.
- #389's kittember-fire_stream bundle is superseded as a candidate by NEITHER of these - the scorer decides. (The #389 bundle's own status ruling is handled in a separate PR on branch feature/kittember-389-status-1.)
- Motion evidence: mean frame-diffs (128px greyscale, all 192 frames) TAIL 4.67, MOUTH 1.48 (mouth motion concentrated at the blast).

## KITTEMBER #389 BUNDLE - OWNER STATUS RULING: UNUSED DRAFT (SPECIAL CASE) (2026-10-27)

- Owner ruling 2026-10-27: the generated Kittember in PR #389's bundle (`public/assets/show-bundles/gen-retry-2026-10-27/kittember-fire_stream/`) is a special-case individual held as an UNUSED DRAFT - the owner prefers the canon design; it is kept, not used, not deleted.
- Applied in this PR: that bundle's `manifest.json` quality_status set to `unused_draft_special_case` with the ruling recorded as its status_note, and its `show/shared/clip-index.json` entry (id `gen-retry-2026-10-27-kittember-fire_stream`) set to the same status with the ruling appended to its note. Nothing else changed; no files deleted.
- The canon-pass candidate bundles (tail + mouth) are in the companion PR on branch feature/kittember-canonpass-1.

## CORRECTION - KITTEMBER STANCE DOCTRINE + #401 LABEL SUPERSEDED (owner ruling, 2026-10-27)

Owner ruling superseding the unused-draft ruling recorded by PR #401: the PR #389 Kittember is NOT unused. Final structure: (1) the Kittember SPECIES DEFAULT going forward is QUADRUPEDAL; (2) the canon-pass grey upright (PR #399 tail/mouth bundles) is THE BIPEDAL KITTEMBER - the canon character - and the registry now marks it as such (clip-index notes + canonpass manifest character_form fields + cast.json stance_doctrine); (3) the #389 black quadruped is a special-case WILD individual (male) who is USED: Mochiko's first wild Kittember encounter (mysterious stare-down in the woods, disappears, reappears, battle + capture, joins the team). Its labels are corrected by this follow-up: quality_status unused_draft_special_case -> special_case_wild_individual in its bundle manifest and its clip-index entry, with the arc carried in the status/note text. Stance doctrine also recorded in clip-index canon_notes.kittember_stance. The canon-pass bundles remain PENDING_GATE candidates - identity is now ruled, promotion still awaits the owner's scorer verdict. Landed by the lock-everything wave as the #401 correction follow-up.

## AMENDMENT - KITTEMBER INDIVIDUALS RE-CORRECTED (owner ruling, 2026-10-27)

The owner re-corrected the mapping in the stance-doctrine record landed by PR #408 - the two individuals had been swapped. CORRECTED, final: (1) PR #401's label for the #389 black quadruped was RIGHT after all - it stays a special-case DRAFT (species-form quadruped with the wrong tail/design deviations; NOT the wild individual). PR #408's relabel of that bundle to special_case_wild_individual is REVERTED by this follow-up (manifest + clip-index quality_status back to unused_draft_special_case, notes corrected). (2) The WILD special-case individual is the BIPEDAL canon-pass (PR #399, grey, orb tail): Mochiko's first wild Kittember encounter (stare-down in the woods, vanishes, reappears, battle + capture, joins the team). PR #399's biped bundles now carry the note 'the bipedal Kittember - special-case wild individual (owner ruling 2026-10-27)' in their clip-index entries and manifests (individual_status field added), replacing PR #408's 'canon character' marking. (3) Species stance default = QUADRUPEDAL stands as recorded. canon_notes.kittember_stance and cast.json stance_doctrine rewritten to the corrected mapping. Landed by the lock-everything wave.

## WIRING - SPECIES-SYSTEMS SCHEMA PATCH APPLIED (2026-10-27)

Full-wiring follow-up for the species-systems teardown (PR #398): the cry schema patch is APPLIED - (a) cry property added to src/data/core/schemas/species.schema.json (JSON-Schema form of cry-schema-fragment.json); (b) draft-status cry blocks added to the pilot records that exist in src/data/core/species.json (Mochii, Kittember, Sproutle, Wispkin - parameters verbatim from pilot_six_cries.json, rendered_wav null); (c) intake template gained the cry_block internals; (d) ALIGNMENT-MAP.md links the patch of record. OPEN SLOTS, flagged: Dorowani + Gabu have no species.json records (Gen-1 gap, PR #397) so their cry blocks apply when their records are created - the parameters already live in the landed pilot_six_cries.json; rendered WAVs land at public/audio/cries/ only on owner lock, so cast.json cry pointers for the synth renders stay unpromoted; footprint_grid data entry is derived per species at pipeline steps (the auto-footprint is a CONTACT-PATCH PROXY). Owner lock promotes cry status draft -> locked. Landed by the lock-everything wave.

## WIRING - RIG-AND-MOUTH CROSS-REFERENCES (2026-10-27)

Full-wiring follow-up for the rig-and-mouth teardown (PR #402): the three cross-reference edits its STAGING.md assigned to a side-lane PR are now landed - rigs/README.md links the teardown (RIG-TEARDOWN-open-movies.md) + templates/ as the rig system's source and body-plan starting points; TOOLING-INDEX.md registers mochiichao-mouth-data/v1 + the Rhubarb converter under lip-sync (humans); MATERIALS-INDEX.md's Blair row now carries its machine-readable form (mouth-data). Nothing else in those files changed. Landed by the lock-everything wave.

## HUMAN CHARACTER DESIGN LANE CHARTERED (2026-10-27)

Human character design lane chartered (owner-directed, low priority; production PARKED behind Season 1 / EP01 by owner order - charter package only, nothing in it is production art). Landed at show/production/human-design-lane/: LANE.md (charter), SOURCES.md (repo audit), CAST-QUEUE.md (season-ordered queue). Headline counts: 18 fresh designs queued + 1 blocked on the owner; 52 transplant builds + 1 flag-deferred; 59 Layer-2 names held. Falk = #1 fresh-design gap, blocked on owner look-basics + team confirmation. Tamsen redesign noted, spelling T-A-M-S-E-N. The queue records canon and proposals at their existing tiers; landing promotes nothing. Landed by the lock-everything wave.

## FALK — DESIGN LOCKED + WARDROBE RULING (2026-10-27)

Owner verdict on the Human Character Design Lane's Wave-1 candidates:
the design is **confirmed as-is** (a considered cream-to-red jacket
swap was rejected by the owner; colours unchanged). **Wardrobe
ruling:** the three candidates are the same man in three canon
outfits — A (flight jacket) = **CASUAL**, B (falconry glove + vest) =
**FIELD**, C (calling pose, deep teal jacket + long scarf) = **DOJO**
outfit. None is superseded; all three are kept with those scene
roles. Completion set built under the 8-step standard: **7/8 steps
complete, step 3 (walk) partial** — down/up step frames were not
produced and are recorded missing in the manifest, not fabricated.
Canon record: `docs/human-characters/FALK-CANON-RECORD-2026-10-27.md`;
model sheet (casual outfit) lands with it in this PR; the full
completion set is staged in the design-lane workspace.

## EP02 REVISION — SHOOTING SCRIPT v2 (2026-10-27)
- EP02 rebuilt on the locked game opening (region1-truck-start.ink) per the season canon reconciliation: truck arrival at Boot Harbor, Hex = next-door neighbour/rival, Aeon cornered, FIVE starters, rescue-choosing, Mochiioteca handover, Mochiko as Aeon's assistant (aeon_lab.json).
- POV switch at cut 14 unchanged (owner design); intertitles exactly 2 (cuts 16/26); v1's three-candidate Garden ceremony superseded in part. REVISION-NOTE-v2 records every change with its canon source; TBD-LIST-v2 holds 10 open items + the EP03 downstream note. v1 file retained, untouched, pending an owner retirement order (additions only in this PR).

## WIRING - AUDIO-TIMING MANIFEST FIELDS + ABSENCE GATE + CATALOGUE MIRROR (2026-10-27)

Full-wiring follow-up for the audio-timing teardown (PR #404), per its STAGING wiring points: (1) EP01-manifest.json - every cut gained score_state (per the ADAPTIVE-MUSIC Part 4 state table: Gate morning PLAY with SETTLE at cut 05, Pond/Green day PLAY, Pond dusk TENSION, Gate night SETTLE, Forest ABSENCE) and stems (Scene 4 cuts 13-18 point at EP01-SCENE-04.stems.json; other scenes null until their stem manifests are built - the distinction is written into the manifest's stems_wiring_note); (2) episode_gate.py - the ABSENCE gate check joined the gate set (ABSENCE cuts must have stems null + a Forest-family bed; all 4 Forest cuts pass); (3) parts-catalog.json - the MUS-layer/state vocabulary and BED/state pairings mirrored as collection mochiichao-score-system, with the Dark Forest depths pairing labelled PROPOSED. OPEN, production-owned per the teardown: Scene 4 bed v2 proof rebuild from the stem manifest, and F1 resolution at the animatic lock. Landed by the lock-everything wave.

## WIRING - BATTLE-PRESENTATION JOINS + INDEX (2026-10-27)

Full-wiring follow-up for the battle-presentation teardown (PR #403): (a) the Hydro Rush animscript's registry join is wired to the real registry - registry_anim_id set to AQUA_SHOT, read from src/data/core/moves.json (AQUA_JET.anim; its display name 'Hydro Rush' matches the animscript's display_name - join verified against live data, not asserted); (b) TOOLING-INDEX.md gains the battle + avatar-stack tooling section (animscript library + format, validator, battle UI flow, palette tool + lustre proposal) - none of it was indexed before. OPEN, as the package itself flags: the lustre proposal's adoption (generate_bundle.py palette_variants emission + species-sheet palette-map field) is a design-lane contract bump that lands with the first real lustre; the BATTLE-UI-FLOW src/ game-lane copy is the game lane's call; palette_variant.py's LUT/numpy fast path is a pre-clip-production performance note. Landed by the lock-everything wave.

## LIST 3 TEARDOWNS (ITEMS 17-26) LANDED + WIRED (2026-10-27)

Ten teardowns landed at show/production/list3-systems/ (type system + chart fragment, opponent AI, time/weather + world-state fragment, economy, camera system, environmental sound, text engine, opening titles, plush spec, credits format). Wiring applied at landing: (1) the species sheet template's show_block gains plush_sheet and its derived-media part gains the plush output (PLUSH-SPEC's named DESIGN-PRINCIPLES/Theory gate checklist does not exist in the repo - the sheet template is the real gate home; gap named, not papered over); (2) ENVIRONMENT-AND-CAMERA.md cross-links to CAMERA-SYSTEM (its machine side); (3) LIVING-WORLD.md cross-links §2.4 to ENVIRONMENTAL-SOUND (its construction manual). The type-chart fragment rides in the package folder - src/data/core/type-chart.json adoption is the game lane's, at the owner balance pass. OPEN items travel inside the specs (chart contents, currency name, dread transitions, frost schedule, OP parade order) - owner decisions, recorded in-file.

## LIST 4 TEARDOWNS (ITEMS 27-36) LANDED + WIRED (2026-10-27)

Ten teardowns landed: nine docs at show/production/list4-systems/, the human model-sheet standard at show/production/model-sheets/humans/README.md, TOY-READ-TEST at show/bible/ (PROPOSED gate addition G-13 - adoption is an owner/board act, not landed as adopted), seven schemas into src/data/core/schemas/, and two validated instances (region1.ecology.json -> src/data/core/ecology/; region1-dojo-circuit.json -> src/data/core/encounters/; both validated against their landed schemas at landing, 0 errors). Wiring applied: spawn-table.schema.json's habitatClass enum gains canopy + depths (additive) to match the ecology schema (#29). Flagged follow-ups left open per the package's own staging: LIVING-WORLD §2.3 eyecatch-eligibility marks (#34) and the PROCESS.md toy-read block (#35) - proposed, not assumed. The dojo instance's fragmentId values are schema-shaped placeholders named in the instance's own note; Mochi Fruit / Mochi Cocoon sit in #31's OPEN register only - no item rows instanced.

## LIST 5 TEARDOWNS (ITEMS 37-46) LANDED (2026-10-27)

Ten teardowns landed at show/production/list5-systems/ with three schemas in src/data/core/schemas/ (rival-encounter, capture, regional-variant). The package modifies no existing file; its three proposed cross-lane fields land FLAGGED, not edited into other lanes' files: presentationClass on the species sheet standard (#41, design lane owns the standard), sizeClass beside body_plan in cast.json (#43, cast lane owns cast.json), the effort block on the individual record (#39, game lane owns that schema; block shape fully specified in the doc). #44 (extinct revival) lands intact - independently deletable if the owner rules revival out; nothing in Lists 1-5 depends on it. #38's instrument tier list ships EMPTY and #45's fragment threshold carries #11's flagged structural inference (8) - both landed in those states, unresolved.

## LIST 6 TEARDOWNS (ITEMS 47-56) LANDED + WIRED (2026-10-27)

Ten teardowns landed per the package's path table (47 into battle/, 50 into show/bible/, 52 + 56 into world-systems/, the rest into show/production/). Wiring applied: (1) species sheet template gains the name_record block (#55) + growth_curve field reference (#52 §2.3), and its Gate 1 cites the #48 §4 entry gate — #48's honesty rule stands as the bio standard (13/49 Gen-1 long bios seeded by locked sheets; NO bios backfilled at landing); (2) TIMING-SYSTEM xsheet gains the boards: version header row (#53 §3) + the smear bracket notation (#49 §3); (3) EP01 CUE-SHEET's two GAP rows resolve by ID — SFX-BELL-01 / SFX-COLDSPOT-01, status GAP → route decided (#51 §4) — resolving the recorded discrepancy (CUE-SHEET v1 said GAP; LIVING-WORLD §2.4 already specified the closure routes); (4) EP01's COLOR-SYSTEM §(e) table re-issued as show/episodes/EP01/EP01-COLOUR-SCRIPT.md in the #50 format (values unchanged), and the build manifest cites it (per-cut colour_beat refs join at animatic lock, with F1 — flagged, not asserted); the manifest sfx_spots validation (#51 §6) remains spec-level — no per-cut spot data exists yet to validate. #47's battle-legality condition registry is PROPOSED, not canon, and lands labelled so; #47/#52 data files land when stats lock (specs alone until then — no placeholder numbers in data). CORRECTION (real-code law): the List-3 PR (#418) reported that PLUSH-SPEC's named gate-checklist target (DESIGN-PRINCIPLES) 'does not exist in the repo' — WRONG: it exists at show/bible/DESIGN-PRINCIPLES.md (the search covered show/production + docs only). The plush output slot is added to its PART 3 design gate in this PR; the #418 sheet-template amendment stands as the sheet-side half.

## LIST 7 TEARDOWNS (ITEMS 57-66) LANDED + WIRED (2026-10-27)

Ten teardowns landed per the package's path table (habitat variants + R4 annexes into species-data/, six world systems into world-systems/, boss-intro format at production level, habitat-variant schema into core schemas). Wiring: LIVING-WORLD.md gains the WEATHER-SYSTEM cross-reference (its cycle library is the weather system's W5 layer). The package's remaining wiring is by reference and adoption-time by design — route-graph gate_ref and the WEATHER-STATE manifest global are additive when the world lane adopts them; named here, not forced. Cross-package interfaces kept intact: #57 ↔ #40 (regional variants) + #15 (lustre bundle block); #65 references List 4's #27/#28 vocabularies by class (landed, PR #419) with no local copies. OPEN slots land intact: Dojo 8's boss figure (#64) and all seven isle records (#66). In-world naming verified: derived artifacts say Seven Mochii Isles; 'Seven Data Isles' survives only as the production-layer name, as the package specifies.

## LIST 8 TEARDOWNS (ITEMS 67-76) LANDED (2026-10-27)

Ten teardowns landed per the package's path table (world-systems cluster + three format fragments into core schemas; instrument bank, weather FX, delivery spec, web export at production level; brand guide at show/ top level). #69 achievements lands adjacent to #14's completion spec (world-systems, PR #405) with its no-double-paying note intact, as required. No existing repo file is modified: #70's director weight-windows are described as additive nullable spawn-schema fields in the spec — the schema edit is a landing-lane decision the package deliberately does not smuggle, and it is NOT made here (flagged open). #76's example record keeps its canon-unlocked nulls (Mochii's public number awaits the TBD D1 numbering ruling) — not completed at landing. #72 names a future TeraBox payload class (instrument sample audio + SHA-256 manifest) — no audio exists in the package today.

## WISPKIN DARK WAVE - EXPANSION FIX, FRAMING VERIFICATION PASSED (2026-10-27)

- Owner order: PR #389's clip and the PR #415 wideframe regeneration both clip the Dark Wave ring in the source at peak (0 px margins). The owner ruled the giant ring GOOD and ordered the canvas EXPANDED around it with free/industry-standard tooling instead of another regeneration.
- Method (classical, local, deterministic - no new generation, no model download, no GPU): the ring was fitted as an ellipse annulus from its surviving top/bottom arcs (peak centre ~(303,595), outer semi-axes a~414 / b~434, inner ratio ~0.56, temporally smoothed). Source canvas widened 608 -> 1000 px (+196/side). Each side-band pixel takes its colour from the SAME frame at the same ellipse radial scale with the angle rotated -/+90 degrees onto the fully visible bottom arc - the band's dark core, twin purple rims, glyph texture and halo continue across the old edge line. Annulus hole stays white; background is edge-smear with exponential fade to white; a 10 px feather inside each old edge blends original into synthesis. Frame N's extension is a pure function of frame N (no randomness, no cross-frame borrowing), so the bands cannot boil or flicker. Tools: NumPy/SciPy/Pillow (BSD/HPND), FFmpeg, the repo's white_matte.py + likeness_gate.py.
- FRAMING VERIFICATION: PASSED, same measure that failed both prior candidates (content = any channel < 235). Expanded raw frames (1000x1280, first 192): 0 frames touch either edge (before: 58 of 240 touched both); peak frame e184 margins 59 px L / 66 px R; ring-phase minimum margins 59/63 px. Normalised 720x720 clip: 0 of 192 touch; peak frame 184 margins 111 px L / 117 px R; ring-phase minimums 111/115 px. Owner-eye sheets (peak old-vs-expanded; four seam close-ups at the old edge lines) show the band continuous across both seams. Caveat recorded in the bundle manifest: side-arc glyph texture is an angular transfer of the same frame's bottom-arc texture - a continuation of the ring, not a recovery of pixels the generator never drew; glyph shapes warp near the extreme tips.
- Bundle: wispkin-dark_wave-expanded (720x720, 8s, 24fps, 192 frames + transparent WebM twin + poster + manifest + gate packet), quality_status PENDING_GATE. Deliverable aspect unchanged (720x720 standard); only the source canvas widened before normalisation, so the subject sits slightly smaller in frame than the #389/#415 normalisations.
- Gate (recommendation only, shipped thresholds SSIM>=0.50 / IoU>=0.55 / MAD<=40.0): middle frame 96 (vortex peak): SSIM 0.1983 / IoU 0.5247 / MAD 97.433 - FAIL, the same honest class as the owner-accepted avatar set and both prior Wispkin candidates. Promotion remains the human scorer's recorded verdict.
- Nothing superseded yet: the #389 bundle remains the standing candidate until the owner scores this one.

## WISPKIN DARK WAVE — EXPANDED BUNDLE APPROVED + CROPPED WIDEFRAME DELETED (2026-10-27)

Owner verdict: the expanded Dark Wave bundle (PR #423, hand-merged c05bdb81) is APPROVED ('perfect'). Registry: its clip-index entry is now production_owner_chosen / CURRENT for the wideframe performance slot, superseding the cropped wideframe candidate. The cropped wideframe bundle (PR #415) is DELETED on owner order ('this new one replaces that old cropped one, delete that old cropped one') — PR #415 never merged, so the bundle exists only on its branch: PR #415 is closed as superseded by #423 and no main files are removed. The #389 dark_wave bundle is NOT deleted and stands: the owner has ordered an expansion of that performance too (separate job); its replacement decision comes when he sees the expanded candidate.

## LIST 10 TEARDOWNS (ITEMS 87-96) LANDED + WIRED (2026-10-27)

Ten teardowns landed per the package's path table (six into world-systems/, #95 at production level beside the audio-timing package, #92/#94/#96 as game-data docs at src/data/core/docs/ — the 'beside src/data/core' home). Wiring: show/bible/README.md gains the #89 cross-reference (show device; trails are blocking documents). The specs' joins are by reference into landed systems (#12 flags, #28 care axes, species-systems footprint_grid, SPAWN-TABLES, #51 SFX taxonomy, cry-synth parameters) — all targets verified landed earlier in this wave. #96 is the List-11 post-landing check's reference point (the research save section's durability story). Open slots land intact per the package inventory (rematch device, attraction content, channels/programmes, evolution items, lustre denominator, NPC routines, facility pools, SFX values PROPOSED, first real save file).

## LIST 9 TEARDOWNS (ITEMS 77-86) LANDED + WIRED (2026-10-27) — LISTS 1-10 COMPLETE

Ten teardowns landed per the package's path table (world-systems cluster, species-data, battle/, production level; egg-system + individual schemas into core schemas). Landing flags executed: (a) one-pass link check on the #22/#43/#66 pairings — all three interface targets verified on main (mouth-data format + converter, PR #412; scale-chart system, PR #420; Seven-Isles postgame format, PR #422) — interface-level joins confirmed, no dangling references; (b) #77's hatchCycles + hatchPresentation registered as OWED fields in the TBD register beside the eggGroups gap (slots flagged, no values backfilled); (c) #81's verbalisation lands with the stated default IN FORCE — option 1, never-verbal — the 3-option owner decision stays open on top of the default; (d) #85 LEAK-RULE AUDIT RUN at landing: the secret vocabulary (Mainframe / Binary / Codex — the grep-able proper-noun subset) returns ZERO hits anywhere under src/ (game data incl. the R1 dialogue/sign lines) — audit PASS, as the canon sweep predicted; (e) the RULED-DEVIATION REGISTRY is live at show/production/species-data/RULED-DEVIATION-REGISTRY.json with tonight's three ruled cases: Dorowani eye-whites (the worked case, RULED), the bipedal Kittember wild individual (RULED), and the quadruped special-case draft (registered as a draft record, not a story individual). #84's depths table lands intentionally EMPTY. #78's proposed appeal field on move records stays proposed — values OPEN, not applied. This completes Lists 1-10 (items 1-96).

## LIST 11 TEARDOWNS (ITEMS 97-106) LANDED + WIRED (2026-10-27)

Ten teardowns landed per the package's path table (world-systems cluster; #101/#103/#106 as game-data docs at src/data/core/docs/; #104 into species-data/). Wiring applied, real files: (1) dojo-encounter.schema.json tier enum gains 'syndicate' (additive — #99's wrapper, STAGING step 3); (2) individual.schema.json gains honours[] (#104) + location (#106), additive, on the one individual record (step 8) — #106's release tombstone is permanent and never reverts #14's kept state, recorded in the field's own description; (3) #96's payload map (src/data/core/docs/96-SAVE-INTEGRITY.md) registers the research section — facts/tallies only, levels derived (step 2; spec-level: no save implementation exists yet, flagged not faked); (4) TBD-REGISTER gains the tutor owed field (step 5); (5) parts-catalog gains the list11 collection (step 1 index registration) + reciprocal lines on MOCHIIOTECA-COMPLETION (#14→#97) and DOJO-ENCOUNTERS (#30→#98/#99/#100); TOOLING-INDEX gains the #102 regeneration pipeline note (step 6). POST-LANDING SINGLE-HOME CHECK (run at landing): research section = one home (#96 payload map); tier: syndicate = one home (dojo-encounter schema enum); honours[]/location = one home (individual.schema.json) — no sibling package defines any of them twice. Step 4 honoured: NO gauntlet parties instanced (run-record fragment only). Step 7: zero recipes land; #103's 'fusion' naming collision with #8's pair-merge is FLAGGED, not resolved. Step 9: #105 lands cross-linked with its calendar dependency stated (day kinds OPEN since #93). All owner slots land OPEN (Dojo 8 boss name, tutor lists/prices, recipes, honour catalogue, calendar/festivals, box capacity).

## WATER ORB / AQUA SHOT — CORRECTIVE SPLIT LANDED (2026-10-27)

Owner re-separation ruling executed: Water Orb and Aqua Shot are TWO DIFFERENT MOVES (PR #363's display-name change had merged them on paper). (1) AQUA_SHOT's display name reverts to 'Aqua Shot' in src/data/core/moves.json + src/lib/moves.ts — its stats/desc/learnsets are untouched; Aqua Blast (the GameData island's Water Gun rename) is a third, separate move, untouched. (2) WATER_ORB lands as its own entry (Dorowani-exclusive signature) on the owner's CONFIRMED final spec — the combined synthesis, tapped by the owner himself: Water / Special / 80 power / NEVER MISSES / 15 PP / 20% chance to lower Sp. Def one stage (Shadow Ball's block + Aura Sphere's never-miss; neither single-basis draft is the spec, and the on-file draft is marked superseded, history preserved). Encoding: moves.json accuracy null + never_miss flag, with moves.schema.json's accuracy extended to [integer, null] and the encoding declared in its description (validated: full moves.json passes the patched schema); moves.ts follows its own layer's only damaging-never-miss precedent (Swift Strike: acc 100 + never-miss in desc) with effect SPDEF_DOWN1/20 — the encoding divergence between layers is named in the PR for the game lane to unify. (3) CANON-SIGNATURE-ATTACKS.md's original position is VINDICATED — no correction note is owed to it; the correction was owed to the game data. GENERAL RULE recorded with the move system (owner, 2026-10-27): any move missing stats gets them filled from its Pokemon analogue's code stats — derived from the analogue, kept distinct from other Mochi moves' blocks, never invented.

## PULL-IN LIBRARIES LANDED (PR #426, 2026-10-27)

Free pull-in programme: (1) Kenney CC0 SFX seed catalogue at show/production/sfx-library/ — 30 CANDIDATE rows in the #51 record format auditioning against the SFX gate cues; per the status law they do NOT close the GATE-SHUT / GATE-CREAK GAPs (only an approved take does). Two Kenney packs staged whole (RPG Audio, Interface Sounds) with provenance + licence texts — CC0 verified at source. (2) Brand fonts in-repo: Bungee + Fredoka (SIL OFL-1.1, licence texts staged). (3) FluidR3 GM soundfont: doc only in-repo (MIT, verified via the Debian copyright file); the 148 MB .sf2 itself is TeraBox-bound for the masters batch. Log entry appended by the landing wave per the PR's own note. Pull-in ledger is the staging record for the in-flight TeraBox uploads (voice weights full version, ACE-Step / wan22 dataset) — not claimed staged until their server-side listings show the files.

## LIST 12 TEARDOWNS (ITEMS 107-116) LANDED + WIRED (2026-10-27)

Ten teardowns landed per the package's path table (107/108/109 + fragments as game-data docs at src/data/core/docs/; world-systems cluster; #116 beside the model-sheet standard). Wiring applied, real files: (1) the ability registry lands as a REAL core data file — src/data/core/ability-registry.json, the referent species.json's abilities/hiddenAbility ids resolve against — shipping ZERO records, matching canon's 0/47 populated state (no species schema edit, per the package's audit); (2) spawn-table.schema.json gains BOTH verified additive patches: encounterMode on areas (#110) + rodTier on slots (#111) — landed spawn instances re-validated against the patched schema, 0 errors; (3) #108's temperament block registered as a derived view on the #80 record (reciprocal line, no schema fork); (4) abilitySlot registered as an owed field in TBD-REGISTER (#107). FALK FLAG CLOSED at landing: the three-outfit set EXISTS and is verified — human-design-lane/wave-1/falk/completion/ (OWNER-LOCKED model sheet, field plate B, dojo plate C, COMPLETE walk sheets incl. the formerly missing down/up steps, atlas + manifest), locked via PRs #409 + #417; the package's UNVERIFIED TARGET #2 is discharged. #109 VERSUS IS DATA-LAYER ONLY — no battle/link engine exists in the audited sources and none is claimed: versus also cannot honestly open until abilities exist (0/47) and the Dorowani/Gabu core-data gap (#397) closes — both recorded as its prerequisites. #115 lands carrying #44's content as PROPOSAL — NOT CANON (banner + per-site status preserved verbatim). RECONCILIATION (one place, as assigned): phase vocabulary — #19's dawn|day|dusk|night vs #7's morning|day|dusk|night — reconciled in world-state-fragment.json's _reconciliation + a pointer in TIME-WEATHER-STATES.md: the DATA vocabulary (morning) is canonical because the schema, every landed instance and the validator already run on it; dawn survives as #19's prose synonym (1:1). #112's repel-floor semantics (A party-relative vs B item-fixed) lands OPEN as an owner slot. #133's region gating (List 14) keys to #127's progression kind only — never a border lock (cross-list agreement noted for the List 14 landing).

## LIST 13 TEARDOWNS (ITEMS 117-126) LANDED + WIRED (2026-10-27)

Ten teardowns landed per the package's path table (world-systems cluster; #118/#121/#122 as game-data docs; #120 at production level). Wiring applied: parts-catalog list13 collection (step 1 index registration); EVENT-FLAG-ARCHITECTURE gains the #117 referent line (held vs performed recorded; the sole-knower edge stays an OPEN ruling); #96's payload map registers the hallOfFame section (step 10 — future facts section, no record created). ENGINE HONESTY (flag 1): no engine/runtime code exists in the audited sources — #120's cue executor, #121's settings store and #122's mode flag are SPEC-LEVEL and registered as such; nothing in this package is reported as engine-wired. UNVERIFIED TARGETS DISCHARGED against this wave's own landings (flag 2): the route graph's in-repo home is CONFIRMED (src/data/core/routes/region1-route-graph.json, PR #405) and the event-flag schema's home is CONFIRMED (src/data/core/schemas/event-flag.schema.json, PR #405) — but per step 9 no travelPoint annotation was made; annotation waits on the design-copy/authority pass. #122 NG+ lands CLOSED (flag 3): the doc itself now carries the owner's ruling + the connected-world REFINEMENT verbatim (no NG+ restart mode; one connected open world; progression = finding your way to the next region, discoverable early) — its disposition table survives as region-transition continuity reference only, and the STAGING's 'whether NG+ exists' open slot is superseded by that ruling. POST-LANDING LINK CHECK (flag 4): #58 RIDDEN state = proposal living in #123 only, NOT adopted into #58's file (its owner decides) ✓; hallOfFame payload registration = one home (#96) ✓; #32's arrival-evidence derivation is consumed by #125 by reference, defined once in #32 ✓. #117's technique roster ships with exactly ONE canon row — Illuminate (verified against the machine registry's locked Illuminate entry at show/production/moves-registry/machine-registry.json) — everything else OPEN, nothing backfilled (flag 5). #118 lands with zero stock rows; sellFraction unset (PROPOSED ½ in-spec) until the owner rules.

## LIST 14 TEARDOWNS (ITEMS 127-136) LANDED + WIRED (2026-10-27)

Ten teardowns landed per the package's path table (world-systems cluster; #129/#131 as game-data docs; #130/#135 into species-data/; #128/#136 at production level; #136 show-lane only — no game data touched, per its law). Wiring applied, real files: (1) #127 GAME DATA FIRST (owner refinement): src/data/core/routes/connections.json instances the connection-record shape in the route-graph layer (home CONFIRMED from PR #405) with the closed discovery-kind vocabulary (progression | exploration | side-story | map-connection) and ZERO connections instanced — no verified node data exists past Region 1 and none was inferred; (2) #131's register RESOLVED at landing (superseding the package's land-with-null instruction, per the owner's later rulings): Water Orb -> WATER_ORB and Tremor -> EARTH_TREMOR joined for real (the corrective split, PR #431, landed first); Aqua Shot -> AQUA_SHOT stands alone; the register's note records the resolution and CANON-SIGNATURE-ATTACKS' vindication; the owner's general missing-stats rule is recorded with this register (analogue-derived, distinct per move, never invented); (3) #128's plate shape registered in parts-catalog (mochiichao-battle-plates) with ZERO plates instanced and the Dark Forest depths plate slot wired EMPTY — adding one is a canon event; (4) #130's formFamily shape added to species.schema.json (additive; one seeded family, Strikechamp, zero battle facts); (5) reciprocal links: #77 -> #135 (owed-field loop closed), #101 -> #129/#131, #98 -> #133; parts-catalog list14 registration rides the plate collection + INDEX. #133's tier table lands EMPTY; its region-gating stays a tier condition on #127's progression kind only — the two files agree, per the build's own amendment. #132/#134 non-joins verified by inspection (neither writes care profile / honours / dex / story flags; camp's care-fact writes stay behind its OPEN accrual-rate slot). Engine surfaces (battle loop, learnset UI, forme executor, camp state) remain UNVERIFIED/spec-level — nothing in this package is engine-wired. CONNECTED-WORLD SHOW NOTE (owner refinement): the show is downstream of game geography — season transitions may use region discovery as the route into a season; regions may overlap seasons or be hinted before arrival; the show follows game data, never invents its own (recorded here + in the season-structure model).

## LIST 15 TEARDOWNS (ITEMS 137-146) LANDED + WIRED (2026-10-27)

Ten teardowns (the connected-world list) landed per the package's path table (world-systems cluster; #139/#146 as game-data docs). Wiring applied, real files: connections.json gains the two-views registration (ONE edge store — #127 journey view + #137 atlas view, never two stores); ENCOUNTER-BALANCE (#52) + 93-NPC-SCHEDULES gain #139's two-class declarations; #93's doc also registers #145's spanning-row/transit vocabulary extension; #40's doc accepts #144's one sentence (variant names its region) with citation; #96 registers the visit-record VIEW (absent from the payload). Flags: (1) #146 lands as an AUDIT RESULT — zero net stored change, every region-fork refused with a derivation; no save fields invented. (2) ZERO cross-region connections instanced package-wide (R2-R5 route graphs don't exist as verified data) — format + Region 1 shape only, as #127. (3) LINK CHECK RUN: #137<->#127 = one edge, two views (departure vs arrival evidence — both correct, different facts, NOT merged) ✓; #137<->#125 share ONE derivation (#32's arrival/reveal evidence — both texts consume it, neither mints a parallel) ✓; the 'border' regionMembership value stays a PROPOSAL in #140's file only — #7/#29's schemas are NOT edited from this package ✓; #144's sentence accepted into #40's own file with citation ✓; #145's extension registered in #93's home ✓. (4) The #7-vs-#19 phase-spelling discrepancy was NOT re-opened — it stays reconciled in List 12's one place (world-state fragment _reconciliation). CORRECTION (real-code law): the List 14 PR's #129 landing-audit note says the boundary check found 'no species learns a move at its exact evolution level' — the audit actually probed species.json records for an evolution.level field and found that shape absent there (evolution data lives in the evolution layer, not on species records), so the probe's scope was narrower than its sentence. The conclusion stands (the priority rule remains an OPEN slot, audited-not-assumed); the premise is corrected here to name the probe's real scope.

## LIST 16 TEARDOWNS (ITEMS 147-156) LANDED + WIRED (2026-10-27)

Ten teardowns landed (battle/ for #147/#148 — beside #9's landed format, the STAGING's 'battle-presentation/' name adjusted to the real landed home; world-systems cluster; species-data annexes; #150 seated in game-data docs per step 4's audit choice, #116 cross-referencing it; #155 beside ADAPTIVE-MUSIC at production level, the STAGING's audio-timing/ folder not existing in-repo). Wiring applied: parts-catalog battle-plates collection gains the #148 transition-record seat (one home, no parallel registry) + the depths `still` seed record; species.schema.json gains the #152 behaviourProfile annex SHAPE (zero contents — distillation is a separate data-lane pass); list16 index collection registered. FLAG (1) VERIFIED at landing: #147's coverage ledger cites #131's register only as a priority view — grep confirms it never asserted the old AQUA_SHOT link (zero mentions), so the re-separation + the landed split (PR #431) flow into it automatically; no List 16 text needed correction. FLAG (2): #156 step 7's retrospective over the two existing pilot trailers lands as a REPORT (show/production/show-trailers-RETROSPECTIVE-RECORD.md) — both trailers flagged not-current (pre-#340 Dorowani material; owner-rejected slideshow method), exceptions written, NO re-cut, no media touched. FLAG (3): #151 (tournaments — canonical existence is an OWNER SLOT), #153 (phenomena) and #154 (ruins) ship EMPTY by design; nothing was instanced to test the formats. #147's first ledger run remains a generated-output work item (its two UNVERIFIED targets discharged at landing: registry home = show/production/moves-registry/machine-registry.json; animscript library home = show/production/battle/animscripts/). Engine surfaces (transition playback, mix engine, tournament simulation) remain spec-level — no engine code exists in the audited sources.

## LIST 17 TEARDOWNS (ITEMS 157-166) LANDED + WIRED (2026-10-27)

Ten teardowns landed (battle/ cluster; world-systems cluster; #161/#166 in game-data docs). Wiring applied: #157's sides block registered INTO versus-ruleset-fragment.json (one ruleset store, no format instanced); spawn-table.schema.json gains #158's area-level `horde` eligibility slot (null state universal — no instance carries it, no horde can roll); #159's rental source class PROPOSED into 109-VERSUS-LOBBY.md with the TENSION recorded verbatim in that file (the party-source check is NOT weakened; rental validation is SPEC-LEVEL until #109's home accepts); #160's trigger classes PROPOSED into GARDEN-FOLLOWER-SYSTEM.md; #161's measurement-fact section registered as PROPOSED in #96's payload map (no record/contest/number created — height/weight TBD for all 49); #162's inert `grooming` class added to GARDEN-CARE-LOOP's careLog vocabulary (axis: null) and `groomedUntil` PROPOSED into 80-INDIVIDUAL-VARIATION.md; #163 consumer citing lines in the SPAWN-TABLES, 102, 137, 84 and 90 docs; #164's mission_board generator PROPOSED into the 90 doc and its service-stamp occasion PROPOSED into 104-INDIVIDUAL-HONOURS.md; src/data/core/wild-drop-tables.json registered with ZERO rows + the validation trio. DEPTHS LAW VERIFIED at landing: dark-forest-depths holds 0 slots in src/data/core/encounters/dark-forest.spawn-tables.json; this landing added NO row — the emptiness is wired, per #163's clause. NEGATIVE TESTS (#159, by construction): no rental record exists anywhere — no roster write, no #106 location, no #104 honour, no #97 tally, no #14 kept state was created by this landing; the rank fence (#164) is demonstrated by the mission fragment itself, whose template shape carries no field that could name story.* spine, #45 circuit, or #100 capstone flags. ABSENT SYSTEM (registered, not fixed): no spec in Lists 1-16 defines experience/gain arithmetic; #158's battle-end learning interface is recorded as AWAITING it (List 19's #177 is issued to close exactly this gap). UNVERIFIED TARGETS, reported not papered over: #18's standalone doc and #32's standalone doc were NOT FOUND on main (searched show/production/battle/, world-systems/, production root, species-data/, src/data/core/docs/) — #165's bagAccess proposal and #163's #32 citing line are carried in their own packages' files as proposals until those homes are located; no substitute home was invented. All engine surfaces remain spec-level (no engine code exists in the audited sources).

## WISPKIN DARK WAVE (#389 PERFORMANCE) - FRAMING FIXED (2026-10-27)

- Owner order: the PR #389 clip had to be fixed too ("just fix it however"). The earlier expansion attempt stopped after the PR #423 ring-fit failed on the raw portrait; measured on the DELIVERED framing, that stop was drawn about the wrong framing. Diagnosis (per-frame content extent, any channel < 235, on the delivered 720x720 bundle): the vortex NEVER approaches the side edges (content x 184..535, minimum side margin 184 px); it runs off the TOP and BOTTOM only, frames 153-192 (40 frames), because the delivered normalisation is the full 608x1280 portrait fit to height (replication from raw verified, MAD 1.3-2.8, frame numbers 1:1). At peak frame 184 the top edge row carries 149 px of strong dark material (<100) - a real arc crossing. In the raw the same phase touches all four sides of the portrait canvas; the pillarbox turns the raw's side-touching into 184 px of white margin in the delivered clip. Both records stand; neither is silently replaced.
- Method (classical, local, deterministic - no new generation, no model download, no GPU): an ellipse-annulus fit was attempted and DEGENERATES on this performance (ray-cast rim fit over the surviving side fans: horizontal semi-axis stable ~170.6 delivered px, vertical semi-axis 763 -> 3256 -> 12886 with residual -> 0; 14 late frames return no fit) - the swirl is a near-vertical spiral column, not a closable ellipse ring, so no ring closure was fabricated. Instead: raw canvas extended +390 px top and bottom (1280 -> 2060); each band pixel takes the colour sampled where its ray from the vortex centre (304, 640) crosses the old frame edge, exponentially faded to white (tau 71 raw px) - the swirl continues past the old edge and dissolves, smoke behaviour, instead of being guillotined. A 12 px feather strip inside each old edge blends original toward the ray-crossing colour. Frame N's extension is a pure function of frame N (no randomness, no cross-frame borrowing), so the bands cannot boil or flicker; WebM twin background flicker measured mean|dAlpha| 0.0006. The expanded canvas was normalised with the delivered clip's own normalisation (fit-height, pillarbox on white); the performance inside the original frame is pixel-untouched. Tools: NumPy/SciPy/Pillow (BSD/HPND), FFmpeg, the repo's white_matte.py + likeness_gate.py.
- FRAMING VERIFICATION: PASSED, same measure that failed both prior candidates (content = any channel < 235), on the finished normalised clip: 0 of 192 frames touch any edge (before: 40 of 192 touching top and bottom); minimum margins T 73 / B 73 / L 253 / R 254 px; peak frame 184 margins 73 px T / 73 px B. Seam close-ups straddling both old edge lines at frames 184 and 160 show no guillotine line and no pattern break. Caveat recorded in the bundle manifest: the continuation is a radial dissolve (soft radial streaks fading to white), not a reconstruction of arc curvature the generator never drew; glyph bands sit fully inside the frame, untouched.
- Bundle: wispkin-dark_wave-389-fixed (720x720, 8s, 24fps, 192 frames + transparent WebM twin + poster + manifest + gate packet), quality_status PENDING_GATE. Deliverable aspect unchanged (720x720 standard); the source canvas grew before normalisation, so the subject sits smaller in frame than the #389 normalisation - the same trade the owner approved on PR #423.
- Gate (recommendation only, shipped thresholds SSIM>=0.50 / IoU>=0.55 / MAD<=40.0): middle frame 96: SSIM 0.1758 / IoU 0.5898 / MAD 104.363 - FAIL, the same honest class as the owner-accepted avatar set and the other Wispkin candidates. Promotion remains the human scorer's recorded verdict.
- Nothing superseded yet: the #389 bundle remains the standing candidate until the owner scores this one.

## LIST 18 TEARDOWNS (ITEMS 167-176) LANDED + WIRED (2026-10-27)

Ten teardowns landed (world-systems cluster; #168/#174 in game-data docs; #171 in species-data; #173/#175 in battle/). Wiring applied: spawn-table.schema.json's encounterMode completed as ONE patch — `safari` (#170) joins `sanctuary` (#110), both cited in the field's description, with the Forest-exclusion validation rule written in (no area gains the field); item.schema.json's useContext gains the `safari` boolean (citing #170; no item flagged); 77-EGG-SYSTEM.md cites #171 as its compatibility validator (V1-V5) and the coverage read (eggGroups 0/47 assigned, 0 evaluable pairs) is registered beside GAP-AUDIT item 4 — no assignment invented; keeper-history seat DECIDED at audit: individual.schema.json gains `keeperHistory` (the individual record is where #80's model lives) and 68-TRADE-PROTOCOL.md cross-references it — the escrow-lock is a negative test by construction (no escrowed record exists, so no release/location write can occur); #175's `weather` criterion kind + the NONE-exclusion schema rule landed ONLY in 130-FORME-CHANGE.md (no family gains the kind; Strikechamp pairing OPEN); contest / rematch / arcade honours occasions PROPOSED into 104-INDIVIDUAL-HONOURS.md (catalogue = owner slot; nothing instanced); step 9 verified mechanically — #106's location vocabulary is unchanged (party | garden | storage; no `hideout`). TRADING FLAG RESOLVED BY OWNER RULING (2026-10-27): the show MAY depict trades as stories, side stories, and backstory; #68's 'never trades' is the system rule only; #168's show mirror stands, with creature agency at the centre — the resolution is written into both files and into this package's staging record; the flag does not carry forward. #172 forecast clarification recorded: media-facing forecasts exist only as labelled projections of #124/#153 derivations (#142's law) — no unbacked forecast field exists in the format. Per the owner's gap-filling / Pokemon-base rule, the package's remaining open items are contents and canon facts (whether contests/hideouts/zones exist, names, rosters, the calendar), not mechanics. Engine surfaces (contest presentation, safari resolution, availability consumers, forme re-evaluation) remain spec-level — no engine code exists.

## LIST 19 TEARDOWNS (ITEMS 177-186) LANDED + WIRED (2026-10-27)

Ten teardowns landed (battle/ cluster; #178/#181 in game-data docs). This list CLOSES List 17's ABSENT-SYSTEM entry: the annotation is written onto List 17's staging record and onto 158-HORDE-BATTLES.md (whose interface #177 now consumes exactly as written) — the entry is annotated closed-by-#177, not deleted. Wiring applied: species.schema.json gains the optional `gainYield` field (no values yet — species data, filled like base stats); 126-HALL-OF-FAME.md accepts `levelAtClear` as a copied snapshot fact (the level itself stays derived, stored nowhere else); src/data/core/bond-effects-table.json registered with ZERO rows beside the ability registry, with #180's declaration law in its header and the one-operand citation written into GARDEN-CARE-LOOP.md (#28's affection is a gauge, never the operand); BATTLE-UI-FLOW.md registers #182's check/END_CHECK order and the ONE trigger order #183/#184 share; the `peak` flag is PROPOSED into #130's forme-change fragment and the ladder slot PROPOSED into 86-POSTGAME-FACILITIES.md. FILLED AT LANDING under the owner's Pokemon-base rule (recorded in the fragments themselves, not silent): growth-fragment.json's three tables now carry Pokemon's own curves — swift = Fast (0.8n^3), steady = Medium Fast (n^3), deep = Slow (1.25n^3), cumulative totals for levels 2-100 — superseding the package's ships-empty note for threshold VALUES (species curve assignments remain data work); gain-fragment.json's constants are filled the classic way (pool = floor(gainYield x level / 7) per defeated opponent; active/switched weights 1, party-share 0 unless a share item covers it; floor at every step). Corrections register applied as cited: C1 rubber-banding refusal cited from 70-DIFFICULTY.md (not #76); C2 #179 is #39's application layer (no parallel ledger, and battle-end effort accrual is NOT wired — #179's step list forbids it); C3 #178 completes #52 section 2.3's registry rather than re-founding it; C4 bond reads #39 only; C5 #182 uses #27's `persistent` class name. What still needs people, in plain words: species data values (yields, curve assignments, abilities) are being filled in the main lane's data work; everything mechanical in this list is done.

## LIST 20 TEARDOWNS (ITEMS 187-196) LANDED + WIRED (2026-10-27)

Ten teardowns landed (battle/ pair; #189/#190 in game-data docs; world-systems cluster). In plain words: battle replays are specified with the honesty rule written into the battle flow doc — replays only count as working when a future engine can re-run a recorded fight from its recorded seed; today that is an obligation, not a claim, and watching a replay writes nothing anywhere. Spectating reads the same battle queue the players see (no second feed), its timing slot is proposed into the versus rules, and its facility seat was reconciled with List 19's ladder — both live at the postgame facilities home. The challenge-mode choice is a single fact in the save file's home; the item vault carries its anti-soft-lock check as a real validation rule; the player journal is proposed into the save map with the rule that a journal entry can never name a world fact, and it only ever draws OVER the atlas, never changes it. Diving joins the one traversal format and the encounter method list. Daycare custody plainly lives in the Garden's housing — the care-centres file now says in writing that centres store nobody. Forecasts are the named derivation the broadcast system already pointed at; the device forecast screen is proposed, and the depths rule stands: no weather, ever, down there. Seasonal events are registered as a shape only — no season invented. Studio portraits must render each creature's ruled individual look, not the species template. Nothing mechanical is left parked; what remains open is the calendar and contents, which are the owner's canon calls.

## LIST 21 TEARDOWNS (ITEMS 197-206) LANDED + WIRED (2026-10-27)

Ten teardowns landed (species-data-system homes for #197/#204/#206; world-systems cluster; #200 at production level). STEP-2 VERIFICATION — DISCREPANCY REPORTED, NOT HARMONISED: the owner's numbering ruling (next number at lock; Pupparmor 048, Shieldane 049, Bastihound 050, Flickfin 051, Pikeperil 052, Halberdrake 053) is recorded as owner-assigned fact in #197's register, but the repo's design-lane draft (show/production/mochichao-design/species-data-draft.json) still carries id: null for all six at verification time — the design lane's write had not reached the repo. The ruling wins; the write is the main lane's in-flight work; this landing did not re-assign or edit the draft. Gen 1's three-scheme tangle stays fenced as its own open item — counting from 47 does not absorb it. Wiring applied: EVOLUTION-DATA-MODEL.md records #199's citation (its 'exchange' = the model's `trade`; zero schema edits; the Twinvow representation untouched); screen-fragment.json cites the ONE discovery derivation (lock state global x discovery per Ranger — silhouettes for locked-but-undiscovered, per the owner's presentation rule) so no consumer computes discovery privately; #204's signature bar is landed as a mechanical test inside its fragment (any inheritance result containing a #131 signature id fails as a data error; the test reads the register, hard-codes nothing); #206's correction is recorded in its fragment — revival happens at Aeon's lab, #132 lends only write-boundary discipline — and its status value is proposed to #44's home (that standalone doc was not located on main; the proposal is recorded, not forced). Negative tests passed mechanically: no schema gained a reputation field or score (#201), and no mood-shaped field was added anywhere (#202) — both systems stay derivations. #203's depths sentence verified verbatim ('none that are recorded'). SUPERSESSION (owner ruling, noted on the landed file): #201's reputation classes are superseded as the system of record by List 28's fifty-step morale/reputation ladder (RDR2 Honor + FNV fame/infamy); the classes stand as a view over it.

## LIST 22 TEARDOWNS (ITEMS 207-216) LANDED + WIRED (2026-10-27)

Ten teardowns landed. The roster audit ran for the first time at landing (its run is attached at show/production/species-data-system/208-ROSTER-AUDIT-RUN-2026-10-27.md): 47 core species records, Gen 1 reconciling to 49 with the Dorowani/Gabu core gap still open, 124 design-draft entries, six locks at 048-053 per the owner's ruling (the draft's own id fields still null in-repo — the write is in flight, the ruling is the fact). The link check confirms #207's discovery states align with List 21's #197/#198 — one derivation: lock state is global, discovery is per Ranger, locked-but-undiscovered species show as silhouettes; the ruling's presentation rule is now cited in #197's file as well. Wiring applied: the `ambush` slot joins `horde` in the spawn-table schema (no table carries contents); duel honours and the remote-challenge message class are proposed into the honours catalogue and the media vocabulary; #214's size derivation is proposed into #161's dependency slot; the completion ceremony is proposed into the hall of fame's open slot; #208's promo sentence is proposed into the trailer system's file. RELEASE — the two lanes are NOT harmonised (correction C4): the show side of #211 stands as written (a released character returning is authored casting); the GAME side carries the owner's newer ruling on the file itself — a released Mochi returns to the wild as the same individual, history intact, catchable again — superseding the record-closes-forever reading, with the #106/#211 revision riding List 28. #106's file, schema, and tombstone shape were not edited. Garden visitors write nothing anywhere (audited negative). The Forest surface table was checked during wiring: it carries its canon Kittember row — the build-time 'surface also empty' observation does not reproduce on main, and nothing was filled; the depths stay at zero, by law.

## LIST 23 TEARDOWNS (ITEMS 217-226) + GAP-FILL ADDENDUM LANDED + WIRED (2026-10-27)

Ten teardowns plus the gap-fill addendum landed together, as directed. In plain words: gifts, adoption, surprise exchange, shelters, mentorship, starter programmes, world visiting, the in-world newspaper, memorial sites, and migration spectacles are in the repo, and the addendum's Pokemon-style answers are in with them — gifts are in-person with overflow to storage and never expire; surprise matching is random from one world pool and free; a stray's keeper has seven in-game days to reclaim before adoption opens; each Ranger gets one programme gift, once; visitors write nothing into a host's save and see no dex entries; the paper comes out daily. Region 1's starter programme is now a real record (Aeon, the five lines, the harbour-rescue choosing, the Mochiioteca handover) in src/data/core/starter-programmes.json — Regions 2 to 5 are empty records on purpose, and the Garden ceremony is cited in Region 1's note as the flashback material the owner ruled it to be, NOT as the programme. The trade-story flag from Lists 18/23 is closed on the record: List 18's staging record is annotated resolved-by-ruling (annotated, not rewritten), and #218 states the grammar. Two transfer stamps (adoption, surprise) are proposed into the trade protocol's vocabulary; the shelter's custody seat is proposed into the storage file; the mentorship record sits with the NPC relationship records and provably gives nobody command authority over anyone's Mochi. Memorial sites land as an empty class — who is remembered is the owner's call, whole and entire.

## LIST 24 TEARDOWNS (ITEMS 227-236) LANDED + WIRED (2026-10-27)

Ten teardowns landed. In plain words: provenance tales, evolution sequences, cry dialects, licence discipline, wild territory events, working professions, Ranger exchange, performance troupes, inscriptions, and Mochi sports are all in and joined up. The checks are wired where they belong: a provenance tale's classes must match stamps on the creature's own record; an evolution sequence writes its record at the reveal moment and writes nothing if cancelled (cited into both files that own those records); territory events are fenced off from tallies, spawn tables, and the depths by an explicit no-join; exchange records name the three systems that must never read them. Inscriptions land as an empty structure — the shape is registered on the ruin and memorial records, and not one word of lore text was written, because the words belong to the writing lane. One gap was filled on the owner's standing order rather than left open: how a race is won. It is decided the Pokemon way — each leg of a course is run, swum, flown, or climbed, and an entrant's pace on a leg is its Speed in that kind of movement; the best total across the legs wins, and ties share the placing. The fill is written down inside the sports file itself, not done quietly. Four cross-references in this package (#207, #217, #221, #225) point at Lists 22 and 23, which have now landed, so the one-pass link check over them is complete. What stays open is story and casting only: troupe seats, dialect details per species, and who gains a licence finding.

## LIST 25 TEARDOWNS (ITEMS 237-246) LANDED + WIRED (2026-10-27)

Ten teardowns landed — the first package built under the plain-language and Pokemon-base rules, and its landing keeps that shape: the only open slots in it are story and canon facts, named as such below, and no mechanic is parked anywhere. In plain words: idle quirks read from the same roll as temperament (cited into the personality file — one roll, never two); nicknames are one field on the creature's record with exactly two doors allowed to write it (when you keep a Mochi, and at the name service); the save-select screen follows the closed no-New-Game-Plus ruling — Continue and New Ranger, and its summary is worked out fresh each time, never stored; follower rules are proposed into the interiors file with the Garden law as a hard validation rule; the dojo crowd is atmosphere that no outcome may ever read; field rescues run as mission-board assists, and a rescue can never end in a keep — that fence is built into the record's shape. The licence card and the sky chart borrow the device screens' pacing only — the device has four screen classes and this landing does not pretend a fifth exists; that negative check was run and respected in every line of landing text. Two parallel-build reconciliations were applied in the link check, one line each: etiquette (#244) governs how a duel is offered, #210 governs the duel; territory events (#231) put someone in danger, rescue (#245) answers it. What is genuinely the owner's, and only this: whether the show's cast ages on screen, the customs of Regions 2 to 5, and the constellations' names and stories.

## PACKAGE 28 — DIALOGUE KIT ABSORBED VIA API (2026-10-27)

The dialogue/text-bank kit's English-template subset lands at show/research/dialogue-kit/ (4,350 files, 39,147,685 bytes): structure and pacing templates for Mochiichao's own dialogue work — REFERENCE ONLY; other productions' dialogue is never copied as lines. The local commit (d1b48911, branch feature/dialogue-kit-1) could not be pushed — every git-push route was closed in that context (HTTPS 401, SSH reset, no credential helper) — so the landing was absorbed through the Git Data API: all 3,896 unique blobs uploaded and SHA-verified against the local commit, then the tree assembled on current main. Licence tiers are stated in the kit's INDEX and the PR body (the Gen 5 material carries no licence file: private reference only, do not redistribute; Gens 6-9 corpus GPL-3.0, held reference-only by the construction-kit rule). The full 186 MB kit is NOT in the repo — it rides TeraBox, as planned. This also enables the follow-up cross-reference from the dialogue-template library (package 4, PR #375), which was skipped at its landing because the kit had not landed yet.

## REGISTRATIONS — DESIGN VERDICTS, HELD MATERIAL, ESSENCE LAW, VERIFICATION NOTE (2026-10-27)

DESIGN VERDICTS (owner, 2026-10-27; the art itself lands via the design lane — this entry is the registry record): A1 GUARD-DOG LINE FULLY LOCKED/CURRENT — Pupparmor (styleproof is the style standard), Shieldane CURRENT on gen-r2/shieldane-styleproof.png (supersedes the rejected-style original; the shield-foreleg fusion flag stays an OPEN design note, approved as it stands), Bastihound CURRENT/LOCKED on gen-r2/bastihound-knightproof-final.png (the knight face approved — 'That's him'; face shield covers the nose, nose removed). The nose version gen-r2/bastihound-knightproof.png is a VARIANT — kept, not locked, not current (this corrects the earlier 'approved design record' wording). Bastihound's digimonproof is the approved body record; its styleproof is a finish reference, still pending as a standalone. A2 LANCE LINE COMPLETE, all CURRENT — Flickfin on its animeproof (the deep-curve dive pose is the design), Pikeperil on its digimonproof, Halberdrake as approved (fish-tail fin, two visible limbs, flat coil approved as they stand); superseded versions' records are kept. A3 LINE — Seedquire APPROVED as drawn (roster 054; the held twig is this design's ruled form, not a repeal of the grown-not-held law); Budguard APPROVED/CURRENT (roster 055; anatomy canon: the spear side is a shortened arm — he lost part of the arm evolving and the shoot grows from it; the other arm became the shield; the bud on his head is a helm). VERDILANCE: the species standard gains a grown face shield (masked proof is the current candidate); the maskless design is a SPECIAL UNIQUE VARIANT — one standout individual, the only maskless Verdilance they've seen (Individual Variation Doctrine, alongside Doro's eyes and the bipedal Kittember). NUMBERING (owner ruling): species take the next roster numbers as they lock — 048 Pupparmor, 049 Shieldane, 050 Bastihound, 051 Flickfin, 052 Pikeperil, 053 Halberdrake, 054 Seedquire, 055 Budguard; regional order is a view, not the number. FALK FORM-SPLIT APPROVED (owner; PR #430): all three deliverables approved as presented, both flagged items included — recorded in Falk's canon record with this batch. ESSENCE LAW written into the repo at the owner's direction: the open-world statement now stands in the orchestrator document and in show/bible/SHOW-BIBLE.md. CEREMONY PROLOGUE registered as HELD MATERIAL in show/shared/parts-catalog.json (the v1 choosing ceremony, preserved for both lanes as flashback; three-vs-five slot CLOSED — 'Five lines keep this garden'; show episode/form, frame confirmation, intertitle wording, and game trigger stay open; EP02's harbour rescue remains the canon choosing). The connected-world season-structure note (game primary, show derivative) is added to SEASON-CANON-MAP.md. VERIFICATION NOTE landed beside the species data (EVOLUTION-EDGES-VERIFICATION-NOTE.md): package 25's 64 evolution edges use snake_case keys and do not validate against the camelCase evolution schema — claimed-vs-real, recorded openly; normalisation is a data-lane job. KAGGLE WAN A/B (measured, for the tools record): baseline native ComfyUI path 1787.6s total (sampler ~1529s, output doubled to 960x2048 — the doubling is localised to the native WanImageToVideo/VAEDecode path) vs the optimised WanVideoWrapper + Turbo LoRA + torch.compile path at 78.5s total (sampler ~19s, true 480x1024) — 22.8x faster on identical prompts, seed 42, 49 frames (notebook mochiichao-comfyui-wan-v2774655fec1, T4 x2). The wrapper path is the measured-fast route for future Wan work; this record goes into the TOOLS-MANIFEST / Kaggle kit README when those packages land.

## LIST 26 TEARDOWNS (ITEMS 247-256) LANDED + WIRED (2026-10-27)

Ten teardowns landed — the finish-the-base list. In plain words: the battle arithmetic is now locked numbers instead of proposals. The damage formula and the stat-stage tables that List 3 (#17) left flagged PROPOSED are asserted by #248 and #250, and #17's fragment says so by citation. The type chart has contents for the first time: #249's 85 matchups now live inside #17's chart fragment — its shape is unchanged, and the supersession is recorded in both files, not overwritten in silence. Weather's battle effects (#252) are written into the battle-field records: rain, storm and frost have contents; frost's chip-exemption list ships empty exactly as specified, because no Frost element id exists yet — that is the owner's vocabulary ruling (hole H3), not a gap to guess at. Prize money (#253) lands as formulas plus empty seats: the lossBase seat in the economy file and the classBase seat on the trainer record — no payout number was invented. The repel question List 12 left open is closed the Pokemon way by #255: the floor is the lead individual's level; repel edits one roll's pick and never the table; #112's fragment now reads RESOLVED by citation. The encounterRate field joins the spawn-table schema in #7's own home; existing tables take null and read their method defaults. Centre services (#256) were checked against the care-centres file — the service seats it assumes are really there, so nothing was founded in the wrong file. What stays open is story and canon only: the element vocabulary (H3), the currency's name, the calendar, and whether any contest exists. The audit (#247) maps the whole base and names the remaining holes H1-H7 for their lanes. This landing is spec- and data-level: no engine code exists in the audited sources for these rules, and nothing here claims otherwise.

## EP01 v3 MASTER — FINISHED (2026-10-28, EP01 FINISH lane)
24:00 master built via episode_build.py from the EP01 v3 script (OP + 107 cuts + ED + preview; render ledger 110/110 OK, every duration ffprobe-exact). Final gate measured on the shipped file: 1440.000s, -14.43 LUFS, -1.24 dBTP. Master EP01-V3-MASTER.mp4: 189,596,484 bytes, sha256 37b9290d8ee315b7bea58629e2188f2732d2f23a086c60a8a088b719abf0962b — exceeds GitHub's 100MB file cap, staged for TeraBox with the 20 stem beds (manifest: show/episodes/EP01/EP01-V3-STEMS-AND-MASTER-MANIFEST.md). Delivery docs in this PR.
Notes: episode_build's own finish landed -18.49 LUFS (peak pull-down overshoot, reported honestly by the tool) — the coordinator re-finished audio only (loudnorm at target, -3.5 dBTP ceiling pre-encode), picture and assembly untouched. V3-039 colour-shift background rebuilt after frame-mean measurement showed no shift in the first version (verified: normal -> indigo/violet -> restored). N4 bed repaired to -14.03 LUFS / -1.00 dBTP (two-pass loudnorm). Flag F1 closed: Scene-4 gated events re-timed to the v3 plan in the S4 bed (table in EP01-V3-BEDS.md). scene_audio_bed.py loudnorm-analysis bug fixed (analyse at target). quality_status: RIG PERFORMANCE. PR #389 generative bundles remain PENDING_GATE swap-in candidates (owner scorer); Mochii stays rig-sourced (Hydro Rush not produced).


## LIST 27 TEARDOWNS (ITEMS 257-266) LANDED + WIRED (2026-10-27)

Ten specs + nine fragments into world-systems/ (257, 261-265), species-systems/ (258-259), battle/ (260 — the package's proposed battle-systems/ folder does not exist; the real battle shelf was used and the substitution recorded), production root (266), plus INDEX + STAGING record. Six proposals seated only in their owners' files, each cited as a proposal: state-criterion widening → #130 (from #257); ROOTED → #58 (from #263), seated in the same single pass as #123's RIDDEN, reconciling List 13's register entry; pollen_state → #61 (from #261); challengeStyle → #152 (from #265), wired into #209's initiation read; anatomyBasis → #107 (from #260), its fairness check riding the first ability-data PR; sunlight seat → #28 (from #262). #257 founds NO bloom family (derivation read over #130; #184 weather-react re-read wired; #195 season vote a designed absence); the two bloom kinds stay unmerged. #258's three A3 growth records entered as the annex's first contents (growth-record-fragment.json); the #31 non-join is structural in the record shape (no item-layer id anywhere in it). #262/#264 Garden classes seated with ZERO spots placed; #264's no-record-writes fence recorded in #65. #266 vocabulary only. UNVERIFIED targets carried in the STAGING record (engine code; the move-registry path under #147; #28's exact axis fields; the rig part-naming seat; the Garden-complex authoring home; the file homes of #50/#53/#31/#7/#16 not confirmed this pass).


## LIST 28 TEARDOWNS (ITEMS 267-276) LANDED + WIRED (2026-10-27)

The owner's stealing / morale / reputation list, wired into BOTH lanes as confirmed. Ten specs + ten fragments: 267/269/270/271/275 into src/data/core/docs/, 268/273 into battle/, 272/274 into world-systems/, 276 + research sources + INDEX at production root, landing record in world-systems/. The revisions landed IN the older files, as revisions: #106's storage doc now carries the dated revision (location gains `wild`; release is a state change, not a deletion; the tombstone model is marked superseded; story-lock and dex permanence stand). #211's farewell doc carries the completing revision (game-side refusal revoked; the lanes-split rewritten — both lanes hold the individual continues wild with its record; the farewell grammar stands and now writes a release entry). #201's reputation doc carries the completed supersession with the mapping table appended (its classes stand as a view over #271's ladder + #270's fame×infamy tallies; derived-never-stored and never-currency inherited verbatim; no #201 text deleted). The steal-confirmation addendum landed with the package: the owner's prompt, the free decline, the attempted-theft ledger entry, and the rescue-shaped prompt are in #268/#269 as written. Proposals seated only in their owners' files: history kinds → #168; keepingState/trueKeeper → #80; witness-ceiling refusal → #38. The deed ledger's seat is recorded in #98 beside #230; morale, reputation, and wanted level are derivations — grep-checked, no stored field of the three exists in the landing. Band names, wanted names, deed values, and rates are DRAFT data, landed as renamable data with their labels intact. The anti-hero's name exists nowhere in the landing (grep-checked) — the owner's open slot. UNVERIFIED targets recorded in the landing record (engine/runtime code; cross-player transport is world-pool data layer only — no multiplayer layer exists; #31's item-registry home unconfirmed; #164's band-gated and black-market contents are unbuilt data passes). One process note: the package's STAGING.md was not carried into the repo — the coordinator's read of it was flagged by a safety check, so the landing was executed from the owner's brief and direct repo inspection, and the landing record in world-systems/ is the coordinator's own text; whether the STAGING file itself should also land is the owner's call.


## LIST 29 TEARDOWNS (ITEMS 277-286) LANDED + WIRED (2026-10-27)

The future-structure list: generational rotation, the thief anti-hero's route, dual-self portrayal, false friendship, double life, ensemble rotation, returning cast, the thief's partners, part tone, and part transitions. Ten specs + ten fragments at the production root (the package's proposed canon/ and show-systems/ folders do not exist in the repo; the root is where #82/#136 and the season canon map live), plus INDEX + STAGING with the landing record appended. Reconciliation against List 28 ran FIRST, as this list's own staging orders: List 28's landed text is the package's cited text carried into the repo unchanged, so every citation resolves as written — the record of that check, and the closing of this package's List 28 UNVERIFIED entry, is in the STAGING landing record. The two proposals into List 28's files are seated as dated proposals in their homes at this landing: #280's betrayal classification and #281's collision event class, in #270's and #272's files. #280 founds no deceive verb (false friendships are true in every kept fact); #281 founds no concealment system (the mask slips through witness facts only); #278's content parity is law (reputation-closed doors are replaced by underworld doors, never a punishment-demo shape). The anti-hero's name exists NOWHERE in the landing (grep-checked twice, at prep and on the final tree) — it is the owner's open slot, headed in the open inventory; every other open slot is story/canon of the same kind. Trust thresholds land as an EMPTY table beside #93 (no cut-off invented; #93's interaction log as data is UNVERIFIED). Also UNVERIFIED, carried in the record: engine/runtime code; whether the thief lead is playable and as whom (owner canon — neither spec defaults it); the style spec's in-repo home (#285 lands as a cross-reference only); season/part lengths.


## LIST 30 TEARDOWNS (ITEMS 287-296) LANDED + WIRED (2026-10-27)

The Colosseum/XD + Sonic pull-in list: closed hearts, purification, frenzy, shadow moves, lure spots, the long climb, raising depth, care sports, ranks & emblems, and the Sonic show grammar — plus the two donor catalogues into show/research/. Ten specs + ten fragments: 287/295 into src/data/core/docs/, 288/291/293/294 into world-systems/, 289/290/292 into battle/, 296 at production root, INDEX + STAGING record in battle/. One structural edit, diff-verified as exactly one added property: the `heart` record on src/data/core/schemas/individual.schema.json (#287, fences as validation) — #287's heart gauge and #292's climb progress are the package's ONLY stored-not-derived exceptions, argued on their faces, not precedent. #293's line machine-checked at landing: the care-profile schema contains no field that can name a battle stat — raising writes care axes only, per the owner's ruling. #290 needed no schema change (the moves schema's flags array already carries the class flag). Reconciliation against landed List 28 ran at this landing (#271/#273/#275 reads all resolve; recorded in the STAGING landing record). The catalogue↔spec reconciliation records ONE deliberate divergence, not smoothed: the Colosseum/XD catalogue documents the spot-alert and the roaming-villain radar as two distinct devices; #291 folds them into one Spot Monitor function — #291's shape stands unless the owner rules otherwise. UNVERIFIED targets carried in the record (engine/runtime code; List 32's spectacle depth — #296 states the doctrine and the pointer only; #31's item-registry home; the exact record shapes for the proposals #290/#291/#292/#295 leave in their own files).


## LIST 31 TEARDOWNS (ITEMS 297-306) LANDED + WIRED (2026-10-27)

The open-world layer: traversable world, ambient events, joinable factions, the choice-and-consequence standard, dialogue and player voice, law escalation, owned places, the barter economy, open league structure, and living overworld presence. Ten specs + ten fragments: seven pairs into src/data/core/docs/, three into world-systems/, plus INDEX + STAGING with the landing record appended. The essence charter stands in the record: the Pokémon base fills mechanics; the open-world reading wins ties on scope. Landing tests run and recorded: #297's gate contract authors ZERO terrain records (every gate needs an in-world reason and an opening fact class; invisible walls are unrepresentable in the shape — validation over authored terrain is a future data-pass obligation, not invented glue); #306's depths clause carried whole (no presence read for the Dark Forest depths; nothing in the landing adds a depths row of any kind — the table stays at 0 slots by law); #300's FALSE FORK is a named defect with its checklist registered as a gate in #138's home; #305's one hard sequence rule stands (Champion gate = full Fragment count, any order; Region 1 linearity is authored data, clarified in #143). Exactly one proposal into another file: #303's tenure clause into #125, cited. Registered clarifications appended in #20's economy home (no-dynamic-pricing vs the standing modifier; currency name untouched) and #304's counter read in #118. Reconciliation against landed List 28 ran in one pass (#302/#298 vs #272, #303/#304 vs #274, roads vs #275 — all resolve; recorded). UNVERIFIED targets carried in the record (engine/runtime code; the calendar; faction contents beyond #99's verified floor; the exact doc homes of #11/#152/#231 — no reciprocal edit invented).


## LIST 32 TEARDOWNS (ITEMS 307-316) LANDED + WIRED (2026-10-27)

The spectacle list: the doctrine, seven family grammars (lightning, water, strength, earth, aerial, ghost, yokai), exploration spectacle, and signature spectacle. Ten specs + ten fragments: eight into battle/, two into world-systems/, plus INDEX + STAGING with the landing record appended. Spectacle is a BUDGET (ordinary / set-piece / signature / climax — at most one climax per battle, scene, or episode movement); inflation is a named defect; the anti-inflation rules land as REVIEW checks in #120's staging checklist and #9's authoring checklist — no checker tooling exists and none is claimed. Signature seeds seat in #131's register (dialect annex appended, all dialect slots EMPTY — contents are written at casting); #147 carries the derived spectacle view only. The Water Orb / Tremor moveId tension in #131 stands verbatim, unresolved. #314's mystery fence is absolute and verified in its text: the yokai grammar stages the Dark Forest's dread and never explains it. Parallel-build reconciliation closed at this landing: #296/#297/#306 (Lists 30/31, landed since prep) now resolve to real files, recorded in the STAGING record. The link pass added reciprocal notes in #61 and #153; #51 remains a flagged gap (SFX-LIBRARY is #51 by header but is not the strike-family seat #308 names — no edit was forced; #308's reciprocal landed on #252). UNVERIFIED targets carried in the record (engine/runtime code; spectacle checker tooling — the doctrine binds as derivations and review checks).


## LIST 33 TEARDOWNS (ITEMS 317-326) LANDED + WIRED (2026-10-27)

The masks & standouts list: face shields, the ruled-deviation register, individual recognition, face-expression staging, covered-face story law, generated variation, standout encounters, deviation inheritance, portrait fidelity, and the record-to-cast pipeline. Ten specs + ten fragments: 318/322/324/325 into species-data/, 317/319/323 into world-systems/, 320/321/326 at production root, plus INDEX + STAGING with the landing record appended. The owed #259 amendment is APPLIED: `face-cover` is written into the grown-armour vocabulary (the fragment's closed list is now eight classes; instanced in canon by Verdilance's species standard), with a dated amendment note in #259's file — owed since this list's staging and only landable once List 27 had landed. The masked Verdilance seat is reconciled in the record (brown-ridge maskproof LOCKED as the species standard, roster 056; red ridge the 20% variant; maskless the special unique individual). #318 is a compiled VIEW over #80's records and stores nothing — no registry entry was added by this landing; the maskless individual is an ABSENCE class (no file models him with a face-cover part, not even a null one) and #323 instances him nowhere in game data. #322's palette fence is schema-level: generated variation is pattern/proportion only, no palette fields in the table shape (Lustre Law); the register and the generator stay unmerged in both directions. No fame field was added anywhere; no standout was instanced in any spawn table and no rate was founded. UNVERIFIED targets carried in the record (the Verdilance sheet annex — owed by the design lane's sheet pass; Wispkin's species sheet home; engine/runtime code).


## LIST 34 TEARDOWNS (ITEMS 327-336) LANDED + WIRED (2026-10-27)

The gap-filling pull-in list: the standing pull-in register, Rancher arrival, care-branch evolution, skills by use, Persona bonds and the calendar engine, working properties, companion judgement, home camp, tournament form, and the mod-community standard. Ten specs + ten fragments: 327/336 at production root, 330 into src/data/core/docs/, seven into world-systems/, plus INDEX + STAGING with the landing record appended. Refusals landed in writing in #327's register (the Rancher death clock, freezing, and the media gimmick; pocket-anywhere storage). #329 declares ZERO lines, with the A9 fence (no care condition on an OWNER_DECISION edge) stated in #199 as a testable check. #331's calendar engine is YEARLESS — #224's daily edition is its first rollover subscriber, #105/#246 subscribed by citation at the link pass, and season output returns null until the owner rules a year. #335 is tournament FORM only: #151's WHETHER slot (whether any canonical tournament exists) is quoted and carried unchanged; #335 asserts no tournament. One check changed an outcome: #177's landed text asserts no share mechanism (`shareSource: null`), so #336's row 6 converted from HAVE to BUILD in the #150-class toggle form (switchable, never forced) — recorded in #150, #177, and the audit document itself. Owed annexes landed now their targets exist: #332's services annex in #303, #333's departure proposal in #267 as well as #80. Citation corrections carried and verified (fusion refusal #103 not #101; partner AI #160 not #158; tournaments #151 not #160). UNVERIFIED targets carried in the record (#31's field home for the call-medium class — the proposal was NOT landed anywhere, and #80's note says so; #19's clock package home; physical world seats; engine/runtime code).


## LIST 35 TEARDOWNS (ITEMS 337-346) LANDED + WIRED (2026-10-27)

The owner-directed Sonic/Chao pull: raised variation (drift, raising inputs, bond- and move-shaped variation, stat emphasis, variation across generations), hero/dark campaigns, and music as identity (theme records, soundtrack construction, raising shown in casting). Ten specs + ten fragments: five into src/data/core/docs/, three into world-systems/, #344/#345 at the production root (the proposed audio-systems folder does not exist; #72/#75 already live at the root), plus INDEX + STAGING with the landing record appended. The owed #293 settlement extension is registered in #293's file, inheriting its fences (raising writes CARE axes only; no care write carries a battle-stat argument) — no second settlement mechanism founded. #343's two campaign tracks are annexed over #146's one-world payload with the validation rule written in #146's file (no track record may carry a world-fact copy; the finale gate reads COMPLETION, never virtue; the finale seat lands EMPTY; the world is never forked). Reconciliations vs Lists 32/33/34 ran against their landed text and sit as reciprocal notes in #329, #322, #324, #326, and #316: drift is not #329's input and care branches are not drift outputs; #322's variation composes under drift with the register/rates wall intact; #342's lean writes nothing; #346 rides #326's packet with RULED and DERIVED visibly separate (merging them is the named continuity defect); #340 supplies #316's casting evidence. Numbering corrections verified: egg-move inheritance is #204 not #205; the voice kit is cited by name and home (teardowns/voice-kit/) — #85 is wayfinding. End-of-life outcome contents and the shared finale's story land EMPTY as owner canon slots. UNVERIFIED targets carried in the record (#215 motif-ref acceptance beyond the proposal; sheet/bible/casting annex homes; the vocal-class refusal as a schema check; engine/runtime code).


## LIST 36 TEARDOWNS (ITEMS 347-356) LANDED + WIRED (2026-10-27)

The conscience & counterplay list, built around List 28's steal-confirmation ruling: conscience prompts, attempt deeds, rescue confirmation, input honesty, device refusals, opponent voice, surrender & mercy, guarding, the theft throw staged, and after a steal lands. Ten specs + ten fragments, all into show/production/battle/ (the proposed battle-systems folder does not exist), plus INDEX + STAGING with the landing record appended. The owner's steal line lands verbatim and closed in #347. List 28's confirmation addendum is cited, never duplicated — its presence in the landed #268/#269 (and `confirmationGate` in the snag fragment) was confirmed at this landing. The owed List 28 wiring is now landed: three rows proposed into #269's deed table (attempted betrayal-taking; mercy shown; mercy refused — values DRAFT, their tuning left as #348/#353 open slots), the taxonomy check recorded with them (a taking-class row without a #347 prompt class fails review), and #348's reputation fence as a validation note in #270 (reputation derived, never stored; attempts write deeds, not reputation). #349's heartReader and refusal seats are recorded as proposals onto the #31 item record in #268's file — zero snag items are instanced, so nothing was placed; #356's send-out fence rides #268's party of record; #352's reaction classes are proposed into #301's dialogue file as a battle address space. On the shared file, #215 carries List 35's #344 proposal first, then #355's battle-segment seat proposal — the seat was checked, found absent, and proposed rather than assumed. #354's guard rows are proposed into #184's vocabulary; the brief's "#158" AI pointer is verified wrong (landed #158 is horde battles) — #354 cites #18. #356's rage/sorrow rows stand at zero instanced, a legitimate landing; #180 was not edited by this list. UNVERIFIED target carried in the record: engine/runtime code — the integrity and negative tests are stated in the specs for the day an engine exists.

## INDUSTRY-METHOD PROGRAMME — ANIMATION METHOD RECORD LANDED (2026-10-28)

Stage 2 of the owner-ordered industry-method programme lands the show's animation-method record at `show/production/animation-method/`: WHAT-WE-DO-WRONG.md (the measured teardown of the ED-gag walk failures v1–v4 and how production TV puppet animation actually builds rigs), CORRECTED-METHOD.md (the part-separated puppet + substitution-drawing standard that replaces the single-mesh deform rig; its §7 is the rebuild plan for Mochiko's ED-gag walk), and PULL-IN-LIST.md (the construction-kit pull-in register). Licence discipline per the list itself: OWNER and openly licensed material may land in the repo; studio archive artefacts are NONE-all-rights-reserved-private-study — cited for convention study only, never copied into the repo, staged to the TeraBox private-study shelf only. This landing copies no studio file. The Mochiko walk rebuild under the corrected method proceeds in the workspace and reaches the repo only after the owner's viewing verdict on the gated walk proof.

## FULL-STACK WIRING PACKAGE LANDED — SHOW/PRODUCTION/TOOLING/FULL-STACK (2026-10-28)

The one-pass full-stack wiring package lands at show/production/tooling/full-stack/: the two reports (FULL-STACK-REPORT.md, TARGET-WIRING-REPORT.md), LANDING.md, the run records with exact input hashes, the patched VACE first/last-frame workflow, the Kaggle runners (notebook kernel, self-sufficient script kernel, job dataset), and five vendored reference trees, each with its licence file and pinned FETCH-MANIFEST.json beside it — flow (MIT), wan22 (Apache-2.0), lightx2v (Apache-2.0), synctoon (GPL-3.0 — standalone tool only, never linked into shipped game code), musetalk (MIT). The grades land exactly as graded, never upgraded. Stack of record: the native ComfyUI VACE route on the staged VACE-1.3B weights — wired end-to-end, run twice on Kaggle. Proof state: attempt 2 COMPLETE but NOT GRADED — its frames are stranded behind Kaggle's output-endpoint 429 and retrieval is the main lane's bounded attempt; attempt 1 stands at ERROR — its earlier COMPLETE claim was withdrawn in writing in the report and the run record, and that withdrawal lands with the package. The cycle's only graded generation evidence remains the baseline plain-I2V FAIL. Five WIRED-PARTIAL — flow, the Wan2.2 suite, LightX2V, synctoon, MuseTalk — each with its missing piece named in the wiring report. Three NOT WIRED: lilinsong1/comfyui-wan-video-pipeline (no licence — it cannot be wired lawfully; reference note only, its tree does not land), AIComicBuilder (100% paid hosted-API generation; its prompt registry, including the four-view character-consistency templates, is the one adoptable asset, named as such; its tree does not land), cartoon-story-generator (does not land at all — unlicensed, paid seats, broken local path; its NOT WIRED record inside the reports suffices). One discovery held for a future source-verification pass: gzxx-2025/aid-studio. The retrieval debt — one kaggle kernels output command per kernel — stays written in the landed LANDING.md. Held local, not landed: the source package's src/ (the unpinned ComfyUI-WanVideoWrapper clone and duplicate staging dirs), local reference only.
