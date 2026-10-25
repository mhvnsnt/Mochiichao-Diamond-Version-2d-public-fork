# Local-only placeholder workflow — spec for Mochiichao

Status: spec only. Nothing built, nothing committed, nothing shipped. No ROMs, official art/music/code, or leaked source were downloaded or put in any file for this spec. It uses only material already in the repo (decomp reference JSON shapes in `src/lib/generated/`) and Mars's own Dorowani/Gabu descriptions as examples.

## 1. Where placeholders live — local only, excluded from public PRs

Principle: a placeholder must be impossible to ship by accident. Default builds must not contain it.

- Master copies live outside the repo clone: `~/workspace/mochiichao-work/placeholders-local/`
  - `placeholders-local/sprites/<creature>/`
  - `placeholders-local/data/` (local-only test data, if any)
  - `placeholders-local/PLACEHOLDER-MANIFEST.json` (the only index)
- Working copy, if the game needs files inside the tree to load them: inside the work clone only, a single directory `local-placeholders/` — and it is gitignored, always. Add to the work clone's `.gitignore` (this .gitignore change is itself clean — it contains no placeholder content):
  ```
  local-placeholders/
  *.placeholder.*
  ```
- Never in: `src/assets/`, `public/`, `src/lib/generated/`, or any committed sprite/data directory. If a placeholder file is in a committed directory, the workflow has already failed.
- PR gate (run before every PR, in addition to the existing gate — all-added/0 deletions, mergeable CLEAN, local build passes):
  1. `git status` shows no file under `local-placeholders/` and no `*.placeholder.*` file.
  2. `git diff` / PR file list contains zero placeholder files.
  3. A text scan of the PR diff for `PLACEHOLDER` returns only the gate code itself, never an asset reference.
  4. The release build below is run and passes with placeholders disabled.
  - If any check fails: stop, remove the file/reference, re-run. Do not merge around it.

### How code marks placeholders, without bundling them by default

- All placeholder loading goes through one committed gate module, e.g. `src/lib/placeholderGate.ts`. That module itself contains no official art or code — it is original glue code. Its rules:
  - Placeholder loading is off by default. It only activates with an explicit local flag, e.g. `VITE_USE_PLACEHOLDERS=true`, in local dev only.
  - It never statically imports a placeholder asset. It resolves them only when the flag is on and the local directory exists; otherwise it falls back to the committed original/empty state.
  - Every placeholder record carries: `placeholder: true`, `source: "placeholder-only"`, `replacement_status: "pending"`, and the creature's Mochiichao roster ID/name — never a National Dex number or an official species name as the creature identity.
- File naming (mandatory): `<creature-slug>_PLACEHOLDER_front.png`, `<creature-slug>_PLACEHOLDER_back.png`, `<creature-slug>_PLACEHOLDER_walk.png`, etc. No placeholder file may have a clean, shippable name.
- In-game marking (local placeholder builds only): title/dev banner `PLACEHOLDER BUILD — NOT FOR RELEASE`, a visible dev-only tag on any placeholder sprite, and a console warning listing every placeholder creature currently active.
- Build separation:
  - Placeholder test build (local only): `VITE_USE_PLACEHOLDERS=true npm run dev` / local `vite preview`. Never deployed.
  - Public release build: plain `npm run build` with the flag unset, from a clean tree. This is the only build that may go to a PR or to Netlify (`mochiichao-fresh-start.netlify.app`). A placeholder build must never be deployed there, or used for public screenshots, trailers, or a demo link.

## 2. What placeholder use is actually for

Placeholders are scaffolding, not content. Only for questions that do not depend on final art:
- Layout and scale: does the sprite fit its 64×64-based tile/battle frame, front and back, without clipping?
- Walk and battle flow: walk frames, turn order, move selection, catch (Luigi Cube / Ring Capture), save/reload end-to-end?
- Timing: animation durations, camera/scale changes, Garden/Arena presentation timing.
- Roster plumbing: does a creature with a given roster ID, element set, and move list load, battle, and save correctly?

Placeholders are NOT for: shipping, demoing, or showing the game publicly; judging art quality or creature identity; balancing (placeholder art carries no canon stats — stats come from the Mochiichao roster draft, not a decomp species entry copied in as canon).

## 3. Replacement rule — stated plainly

Merely tweaking official art or code does NOT automatically make it clean or proprietary. Recolouring, resizing, flipping, cropping, filtering, palette-swapping, tracing, or lightly editing an official sprite, model, or code file still leaves a derivative. Do not record any tweaked official file as "ours."

Replacement means: original art/data made for Mochiichao, from that creature's own manifest, saved as a new file under a clean name, swapped in per creature — and the placeholder file and every reference to it removed.

Per-creature checklist (a creature is not "done" until every box is checked): creature/roster ID, manifest source, placeholder in (local path + date, or "none — original first"), placeholder purpose tested, original in (new file path, format, date), placeholder removed (file deleted, references removed, `git status` clean), verified in game (front/back/side/walk/battle, 64×64 atlas + JSON manifest, save/reload), release-build check (plain `npm run build`, flag off, passes).

Manifest record shape (local manifest only):
```json
{
  "roster_id": "001",
  "creature": "Mochii",
  "placeholder": true,
  "placeholder_files": ["local-placeholders/sprites/mochii/mochii_PLACEHOLDER_front.png"],
  "replacement_status": "pending",
  "original_files": [],
  "placeholder_removed": false
}
```
When `replacement_status` becomes `"complete"`, `placeholder` must be `false`, `placeholder_files` empty, and `placeholder_removed` `true` — all three.

Release rule: a build is releasable only when the placeholder count is 0 across the whole manifest. No "mostly replaced" release.

## 4. How this connects to the art plan

### Dorowani and Gabu — first original-art proof (they skip the placeholder step)

Dorowani and Gabu are NOT placeholders. They are Mars's own original art (uploaded images + Tripo models), unnumbered, not in the 47-creature roster. Do not assign 047/048 without Mars's say-so, and do not give them placeholder naming/status.

Their chain, in order:
1. Obtain the GLB legitimately — still blocked, needs the parent/browser: Mars signs in to Tripo in the browser, or supplies a Tripo API key through the secure flow, and the GLB is obtained via Tripo's own Export or via a Tripo API/MCP download URL from his account. No page scrape past Export, no third-party downloader.
2. Western Heart tripo-intake (the step after download, not a downloader): drop the GLB at `tools/tripo-intake/inbox/<fighter>/attire<N>.glb`, run the intake, which faces/rigs it with Blender/GameRig and stages `model-rigged.glb`.
3. Bake, don't import 3D into the game: render the rigged model from front/back/side/walk angles in Blender and bake those renders into 2D sprite sheets in the game's one format — 64×64-based atlas + JSON manifest, per "looks 3D, runs 2D."
4. Verify as originals: both go through the §3 checklist with `placeholder: false` from the start, and their sheets become the format reference for the roster.

Note: both models are heavy (Gabu 1,909,230 faces / 987,147 vertices; Dorowani 1,955,752 faces / 1,008,079 vertices, both 4K PBR Tripo H3.1). That weight is fine for offline rendering to sprites, but is a reason to bake sheets rather than load raw models in the web game.

### Then the roster — 2D art masters, same format, same checklist

- Masters: for the 47 roster creatures (no Tripo model), a 2D drawing IS the sheet. No 3D model is made as well for the same creature in the game. If a roster creature later gets a 3D model, its sheet is re-baked and the file swapped — game code does not change.
- Order: starter base forms first (Mochii #001, Razorgater #004, Tyrage #007 — base forms settled; evolution names still an open Mars decision across three sets and must not be locked in by placeholder files), then remaining roster in manifest batches, each creature completing the §3 checklist before the next batch is called done.
- Placeholders during this phase: a roster creature may use a local placeholder only to keep battle/world testing moving while its original sheet is being made, under §1–§3. The placeholder never becomes the creature's art by editing, and it never appears in a PR or deploy.
- Still open and not blocking this spec, but blocking roster unify: starter evolution naming set, Pebblefist HP (45 is an unconfirmed guess — do not merge it as confirmed), and Beast/Flora/Neon element calls. Placeholder work must not silently resolve any of those.

## What is NOT in this spec (by design)

- No placeholder assets, and no instructions to obtain official art/code/ROMs.
- No change to the public repo, no Netlify deploy, and no claim that a placeholder system is built or shipped. Implementation is a separate step: add the gitignore entry + gate module (original code only), set up the local-only directory, and run the PR gate — all with zero placeholder content in the diff.
