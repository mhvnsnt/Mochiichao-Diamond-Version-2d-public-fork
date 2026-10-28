# Generative retry batch — 2026-10-27 (avatar stack, hosted backend)

Produced under the owner's standing order (2026-10-27): retry the hosted
generative route — the Muse avatar generator, the same method that made
Doro's avatar set — after the morning's total upstream failure, and create
the episode's character animation with it.

## What happened

- **Probe (Dorowani idle, from `canon-cutouts/dorowani.png`): SUCCEEDED.**
  The hosted service is answering again. The morning failure
  (`worker_job_failed`, downstream 500, `origin_stage: worker_inference`)
  did not recur.
- Six full avatar-stack bundles were produced (MP4 + transparent WebM twin
  + poster + manifest + gate packets), all measured at the target spec:
  **720x720, 8 s, 24 fps, 192 frames**. Raw generator output
  (aspect-preserved, 10 s, with audio) was normalised to spec by the
  intake recipe; motion was verified by frame-differencing (mean frame
  diffs 19.3–34.1, far above the 1.2 slideshow floor) — these are real
  performed clips, not pans over stills.
- **Mochii — Hydro Rush: NOT produced.** The generation call was refused
  by the media service (integrity check) and per policy it was not
  retried or rephrased. Mochii's hero motion is the first item in the
  next batch queue. (Mochii already has rig-pipeline clips on main,
  PR #360, so EP01 is not blocked on this.)

## Bundles

| bundle | variant | canon basis |
|---|---|---|
| dorowani-idle | idle (probe) | Dorowani idle performance |
| dorowani-water_orb | water_orb | WATER ORB, Dorowani's signature (canon: the making_something avatar animation) |
| gabu-tremor | tremor | TREMOR, Gabu's signature |
| kittember-fire_stream | fire_stream | FIRE STREAM, Kittember's signature |
| sproutle-leaf_blast | leaf_blast | LEAF BLAST, Sproutle's signature |
| wispkin-dark_wave | dark_wave | DARK WAVE, Wispkin's signature — generated from the REFERENCE OF RECORD cutout (mask held by both hands, smoke bottom) |

## Likeness gate (shipped thresholds: SSIM ≥ 0.50, IoU ≥ 0.55, MAD ≤ 40)

Every packet is a **FAIL recommendation** and every bundle stays
`PENDING_GATE`. That is the honest state, and it needs the calibration
context the scorer already knows: **the owner-accepted Dorowani avatar
set also fails the shipped thresholds** (full-body refs: SSIM 0.334 /
IoU 0.768 / MAD 61.7; pose-matched: 0.403 / 0.884 / 44.9). SSIM does not
discriminate on this material; IoU and MAD do.

| clip | frame | SSIM | IoU | MAD | reading |
|---|---|---|---|---|---|
| dorowani idle | mid | 0.416 | **0.885** | 41.4 | In the accepted avatar set's own band on both discriminating metrics (IoU matches its 0.884; MAD is better than its 44.9–61.7) |
| dorowani water_orb | mid | 0.255 | 0.669 | 76.4 | Mid-frame is the orb-charge FX peak — the glow is what is measured |
| dorowani water_orb | 12 | 0.352 | 0.665 | 70.7 | |
| gabu tremor | mid | 0.284 | 0.613 | 87.1 | Mid-frame mid-stomp, dust/ground FX in frame |
| gabu tremor | 12 | 0.318 | **0.832** | 70.5 | Neutral frame: silhouette strongly on-model |
| kittember fire_stream | mid | 0.327 | 0.502 | 96.3 | Weakest packet: fire plume + crouch reshape the silhouette at every sampled frame |
| kittember fire_stream | 12 | 0.343 | 0.497 | 115.3 | |
| sproutle leaf_blast | mid | 0.375 | 0.674 | 91.4 | Mid-frame mid-spin with leaf FX |
| sproutle leaf_blast | 12 | 0.377 | 0.650 | 84.8 | |
| wispkin dark_wave | mid | 0.174 | 0.573 | 105.2 | Mid-frame is the pulse peak — the character is engulfed by its own effect |
| wispkin dark_wave | 12 | 0.159 | 0.630 | 96.3 | |

Frame-level identity spot-checks (contact sheets, neutral frames):
Gabu has **no back cannons** (not the rejected batch's Blastoise failure);
Kittember's flame is **on the tail tip** in every frame (canon);
Wispkin's **mask is held by both hands, smoke trailing from the bottom**
(reference of record honoured at neutral frames); Sproutle carries **no
baked shadow**. Wispkin scorer note: the dark-wave FX includes glowing
rune-like glyph graphics at the pulse's edge — an effect-layer intrusion
the scorer may want rejected independently of the character render.

## Style law assessment (Mochiichao art style — standing owner law)

The style of record is the repo's canon art: hard cel shading, ink
outlines, creature-catcher / training-anime read — creatures that look
like they can fight. Soft/plush/pastel preschool rendering is an
automatic style failure. **All six clips render in the canon grammar**:
flat cel bodies, hard shadow shapes, edged anime eyes — none shows the
soft-gradient preschool finish that failed in the design lane. Attack FX
(water glow, fire, leaves, the dark pulse) are effect layers over that
finish, not a change of finish. Style consistency across the batch:
consistent. (This judgement anchors to the canon cutouts and the accepted
avatar set only — never to an external franchise's finish.)

## Promotion

Nothing here is promoted. `quality_status` stays `PENDING_GATE` in every
manifest and clip-index entry; promotion is the owner/scorer's recorded
verdict, per orchestrator law. The dorowani-idle in this batch does NOT
supersede the production avatar idle in `../dorowani/` — it is a second
candidate for the same variant slot, and the Current-Version Law registry
entry changes only if the scorer says so.

## Phase 2 wiring assessment (free equivalent — note only, not built)

Phase 1 succeeded, so the free-equivalent build was NOT triggered. State
of the free stack, honestly: the Kaggle Wan 2.2 backend is
**motion-proven, likeness-unproven** — its one gated test (Wispkin,
2026-10-27) failed likeness outright (drift to a realistic 3D skull;
registered `rejected_likeness_fail`), so on today's measured evidence it
is **not yet equivalent** to the hosted route: hosted probe IoU 0.885 /
MAD 41.4 vs no Wan clip inside the accepted band at all. The equivalence
path is the already-staged consistency kit (VACE-1.3B reference
conditioning + first/last-frame + per-character musubi-tuner image LoRAs,
`show/production/tooling/avatar-stack/`), i.e. Wan test 2. That work is
notebook-side and must sequence behind the timed A/B rerun still running
in the owner's browser session — it was not fought for the session. If
the hosted route fails again, Phase 2 builds in this order: (1) wire the
Wan backend behind `generate_bundle.py`'s backend interface, (2) train
the six per-character LoRAs from the canon cutouts, (3) run Wan test 2
(Wispkin, reference of record) and publish the side-by-side gate numbers.
