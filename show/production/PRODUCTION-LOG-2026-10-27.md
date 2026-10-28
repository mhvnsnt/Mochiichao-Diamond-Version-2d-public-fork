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
