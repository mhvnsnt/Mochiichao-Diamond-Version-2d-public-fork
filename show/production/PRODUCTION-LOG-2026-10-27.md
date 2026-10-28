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
