# 53 — STORYBOARD PIPELINE RULES (revision workflow & pin-up)

Teardown List 6, item 53. Native production rules for the
Mochiichao show. Sources: publicly documented TV-animation board
practice (board-driven production, revision colour conventions,
pin-up/壁打ち-style review) generalised into house rules that fit
this show's existing machinery — the currency law, the anim gate,
TIMING-SYSTEM xsheets, and the version discipline already used by
the avatar stack (never overwrite; new version = new file).

---

## 1. Teardown — how board revision workflows run

- **The board is the script's visual master** in board-driven TV
  production: boards are drawn per scene, *pinned up* in sequence
  for a full-episode read, revised in passes, and only locked when
  the pinned wall reads end-to-end. Timing is extracted from the
  locked board (here: into the xsheet), not before.
- **Revisions are colour-coded and layered, never redrawn over.**
  Documented convention: revision marks/drawings ride on a distinct
  revision colour per pass, on separate sheets/layers, so any state
  of the board can be reconstructed and any note traced to its pass.
- **Versioning is by scene, lock is by episode.** Individual scenes
  iterate freely; the *episode* locks when all scenes pass the
  wall read — after which changes are re-issues, not edits.

## 2. Native rules — `board-pipeline/v1`

### 2.1 Naming & versions (extends existing house discipline)

```
show/episodes/EP##/boards/
  EP##-SC##-boards-v<N>.pdf        // per-scene board, N from 1
  EP##-boards-WALL-v<N>.pdf        // the pinned full-episode read
  EP##-SC##-boards-v<N>.notes.md   // pass notes, one file per version
```

- **Never overwrite** (currency law): a revision = vN+1 file; the
  registry (clip-index / episode manifest) marks the CURRENT
  version; superseded versions stay, named, never silently used.
- Board versions and script versions are **independent counters**
  with a cross-ref line in the notes file (`boards v3 ↔ script v2`)
  — the F1 lesson from List 2 #16 (bed timed to v1 beats vs board
  on v2 timings) is exactly the failure this cross-ref exists to
  catch: any artefact citing a script/board version must name it.

### 2.2 Revision passes (colour = pass, on layers)

| Pass | Colour (house) | Scope |
|---|---|---|
| P0 | graphite (base) | first board, from locked beat sheet |
| P1 | blue | staging/clarity: reads at thumbnail, silhouette staging ladder honoured |
| P2 | red | action/timing: smear devices (#49) bracketed, holds marked, cycle/bank calls |
| P3 | green | canon pass: likeness vs model sheets, naming-law sweep, THE SECRET display sweep on any in-board text/signs |
| LOCK | — | wall read passed; xsheet issued from this version only |

Revision drawings ride as overlay layers in the board file
(Tahoma2D levels on export) — a pass never paints into the base.

### 2.3 The pin-up (wall read) — the episode's board gate

Run in order, whole episode pinned (or the WALL pdf paged) — no
scene locks alone:

1. **Silent read:** episode must read with no script in hand —
   story, staging, and the subtitle-rationing beats land as
   pictures. (Silent-film law applied to boards.)
2. **Cast read:** every principal's likeness checks against its
   model sheet *at board scale* (likeness law; boards are where
   drift is cheapest to kill).
3. **Colour/light cite check:** every scene cites its colour-script
   beat + lighting key (#50 §2.3) — uncited scenes don't lock.
4. **Dread check (Forest scenes):** stillness rules — no ambient
   cycles/population boarded inside the Forest (LIVING-WORLD P5);
   a boarded Forest motion is a defect, not a choice.
5. **Timing extraction:** only after 1–4 pass — xsheet issued,
   animatic assembled against beds (existing EP01 pattern).

### 2.4 Change control after LOCK

Post-lock changes are **re-issues**: board vN+1 + notes naming the
trigger (owner note / gate failure / script re-issue), and any
downstream artefact built from the old version (xsheet, animatic,
bed timings) is flagged STALE in the episode manifest until rebuilt
against the new CURRENT version.

## 3. Wiring points

- Episode packages gain `boards/` beside `audio/` and `timing/`
  (List 2 #16's folder pattern).
- TIMING-SYSTEM: xsheet header records `boards: EP##-SC##-boards-v<N>
  (CURRENT at issue)` — closes the F1 class of drift mechanically.
- Registries: clip-index.json entries for board artefacts carry
  `version` + `current: true/false`, same convention as show bundles.
- The anim gate (cape-jones ANIM-GATE pattern in the pipeline) adds
  the §2.3 checks 2–4 as board-stage gates, upstream of frame checks.

## 4. Coverage notes

Board-driven workflow, revision-colour layering, and the wall read
are standard documented TV-animation practice — high confidence as
*practice*; the specific pass colours, folder grammar, and gate
order here are **house settings**, chosen to interlock with this
project's existing laws (currency, likeness, THE SECRET sweep)
rather than recovered from any single studio's manual. No studio's
proprietary board templates or files are used or reproduced.
