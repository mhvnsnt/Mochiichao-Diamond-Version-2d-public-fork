# Menus + wallpapers + uncapped storage — STAGED ONLY

No PR, no merge, no game-tree edits. Nothing in this folder is
imported by the game. The dirty work tree at
`~/workspace/mochiichao-work/fresh-start` was NOT edited and NOT
used as a source; current main (7f116702, 2026-10-27) was read
via the GitHub API helper, and decomp sources on disk were read
read-only. No deletions anywhere in this task.

Mars decisions applied (2026-10-27 ~07:46 CDT — these REPLACE
open questions, nothing here re-asks them):
1. Menu layout: NO single layout picked. All gen layouts are
   swappable entries, with one settings editor per menu type.
2. Bag/storage: Black 2 canonical, CAPS REMOVED (see §3).
3. PC wallpapers: all games + modding communities, PLUS
   user-uploadable original art from phone storage (see §4).

## 1. Files in this folder

| File | What it is | Tree target if a PR worker applies it (NEW files unless noted) |
|---|---|---|
| `menuLayoutCatalogue.ts` | Typed catalogue, imported nowhere yet | `src/lib/menuLayoutCatalogue.ts` (new) |
| `menuEditorSpec.md` | One editor per menu type: fields + persistence keys | Spec only; no tree file |
| `MenuLayoutEditorSkeleton.tsx` | Editor skeleton component, imported nowhere yet | New file under `src/components/game/` (PR worker picks the name/path); must NOT be merged into SettingsScreen or gameSettings.ts |
| `uncappedStorage.ts` | Uncapped constants/functions + save notes | `src/lib/uncappedStorage.ts` (new) |
| `wallpaperCatalogue.ts` | Preset catalogue + upload spec constants | `src/lib/wallpaperCatalogue.ts` (new) |
| `PcViewUncapped.patch` | PcView patch: box size/count via uncapped module + unlimited note | Edit to `src/components/views/PcView.tsx` |
| `ShopViewUncapped.patch` | ShopView patch: uncapped stack statement in the buy panel | Edit to `src/components/views/ShopView.tsx` |
| `PcViewWallpaper.patch` | PcView wallpaper row skeleton (preset select + upload input) | Edit to `src/components/views/PcView.tsx`, applies AFTER PcViewUncapped.patch |

## 2. Menu layouts wired swappable — COUNT: 45 (5 gens x 9 menu types)

Menu types: title, pause, battle, party, bag, pc, shop, dex,
settings. Every gen x type has exactly one catalogue entry
(`menuLayoutCatalogue.ts`), so 5 x 9 = 45 entries, all
selectable by id through `menuLayoutFor()` in the skeleton.
"Swappable" here means: the catalogue + editor spec + skeleton
exist and are typed; no view on main reads them yet (that
wiring is the PR worker's job, per the spec's checklist).

Evidence split (computed from the catalogue, verified by run):
- Verified geometry (numeric anchor read from a decomp file):
  **11 / 45** — gen1 battle (corner panel tiles x8 y12–x19 y17,
  2x2); gen2 pause (right-side list x10 y0–full); gen2 battle
  (x8 y12–full, 2x2, spacing 6); gen3 pause (row step 15px,
  help bar); gen3 bag (per-pocket cursor arrays); gen3 pc
  (14 boxes, 5x6 = 30, name length 8); gen4 bag (per-pocket
  cursor/view structs); gen4 pc (18 boxes x 30, 5-row grid,
  name length 20); gen5 pause (app-launcher field menu);
  gen5 bag (pocket order + per-pocket scroll/row + Free Space);
  gen5 pc (30/box, 8-then-+8-to-24 source unlock, wallpaper
  menu paged 4 per page).
- Family-only (arrangement family supported by the cited
  source, exact numbers NOT extracted in this pass): **34 / 45**.
  A view adopting a family-only entry must keep its current
  numeric spacing and adopt only the family — it must not
  invent numbers. This is stated in the catalogue header and
  in the editor spec, not buried.
- Arrangement families present: single-column list,
  two-column list (catalogue type only — no entry claims a
  verified two-column list in this pass), grid-2x2, grid-5x6,
  grid-3x5 (type only, same caveat), corner-panel-2x2,
  bottom-screen-touch-2x2, dual-screen-grid-plus-touch-menu,
  paged-4-per-page (wallpaper menu, inside gen5 pc), and
  full-screen list/grid variants. "Corners" in the task = the
  corner-panel-2x2 entries (gen1/gen2 battle, bottom-right
  panel) plus the bottom-screen touch buttons (gen4/gen5
  battle) — both are in the catalogue; exact touch-button
  rects are unfilled (see §5).

No layout was picked as "the" layout. Defaults in the skeleton
are fallbacks only (gen5 per menu type, settings -> gen3),
changeable per menu type independently.

## 3. Bag / storage caps removed — YES/NO per cap

| Cap | Removed? | Evidence |
|---|---|---|
| Box count | YES — unbounded | `uncappedBoxCount(n) = max(1, ceil(n/30))`, no clamp. Run check: 721 creatures -> 25 boxes (past the source 24-box cap). Main PcView already computed this formula dynamically; the patch re-sources it through the uncapped module so the source 24 cannot be reintroduced. |
| PC total creatures | YES — unbounded | Same function; `MAX_PC_TOTAL = null`. Run check: 721 -> 25 boxes, no 720 stop. PC above 100 is therefore trivially satisfied (100 -> 4 boxes). |
| Item stacks | YES — unbounded | `addToStack` returns exactly old + qty, no truncation. Run check: 99 + 5 = 104 (past 99, past no cap at all). Main buyItem already increments with no cap check; the ShopView patch states this in the UI. Source general stack 999 is recorded for audit only, never enforced. |
| PC creatures (per-box slot count) | KEPT at 30 per box — by design | Mars decision keeps the Black 2 pockets/slots-per-box structure (30 per box) with the COUNT unbounded. 30 is a box shape, not a cap on totals. |
| Distinct items per pocket (slot maxima) | YES — unbounded | `MAX_POCKET_SLOTS = null`. Source maxima (items 310, key 83, move-machines 109, medicine 48, berries 64, Free Space 614) are recorded for audit only, never enforced. |
| Party size | NO — kept at 6 | A party rule, not a storage cap; not in this task's removal list. The PcView withdraw guard at 6 is untouched by these patches. |
| Item-terminal cap (30, main playableWiring) | NO — untouched, flagged | A separate system, not bag/PC storage; no decision in this task covers it. Named here so it is not mistaken for removed. |
| Box name lengths (gen3: 8, gen4/gen5: 20) | NO — untouched | Name-length limits, not count caps. |
| Move-machine stack 1 (source) | NO — untouched, flagged | Per-item semantic in source, not a bag stack cap. A machine-duplication rule would need its own decision. |

Save-shape consequences (explicit, from `uncappedStorage.ts`):
- Main save is whole-state JSON, so uncapped lists just grow
  that JSON linearly; no main save migration is needed and old
  saves stay valid.
- A future port back to Black 2 FIXED save blocks (24 x 30,
  fixed pocket arrays) would overflow and must NOT silently
  drop creatures/items — it needs an extended format or a
  documented rule. This is a blocker for any such port, not
  something this folder solves.
- Per-box wallpaper IS a save addition (main has no such
  field): staged as an OPTIONAL record (`pcWallpapers` /
  `mochiichao_pc_wallpapers_v1`), defaulting when absent.
  Old saves stay valid. Uploaded image bytes must NEVER go
  in the save JSON.

## 4. PC wallpapers — presets per source + upload path: YES

Distinct presets actually listed in `wallpaperCatalogue.ts`:
**97**. Per source (verified enum/define counts only):

| Source | Presets | Basis |
|---|---|---|
| gen3 FireRed | 16 | Enum ids 0–15 in `pokefirered-leafgreen/include/pokemon_storage_system.h`. CORRECTION: main playableWiring says 17 — that is not verified and is not repeated here. The PR worker should correct it when wiring this catalogue. |
| gen3 Emerald | 17 | Enum ids 0–16 in `pokeemerald/src/data/wallpapers.h`. |
| gen4 Diamond | 24 | Header defines: 16 default + 8 unlockable. |
| gen4 HeartGold | 24 | Header defines: 16 default (ids 0–15) + 8 bonus (ids 32–39). |
| gen5 Black 2 | 16 | Normal set define (16, cycled across boxes at init). |
| Modding communities (workspace files) | 0 verified | Searched `chao-modding-docs`, `fan-reference`, `menu-editor-tree`: no box-wallpaper preset catalogue exists there (only an unrelated research mention and icon-library files). Community presets are therefore NOT claimed as a count. The community contribution in this design is the upload slot itself (any user art) plus the preset pattern words, not an invented list. |
| Gen 1 / Gen 2 | 0 | Correctly zero: list-based storage has no wallpaper system. |
| Total listed | 97 | 16 + 17 + 24 + 24 + 16. |

NOT counted (recorded, not claimed): gen4 Platinum (same
16+8 structure as Diamond; header read fixed boxes/rows, not
wallpaper defines — adding it would double-count gen4
designs); gen5 Black 2 extra flag sets (2 sets recorded, but
their distinct design count could not be verified from the
message-id menu tables read); gen3 Emerald decorative
pattern-table variants (16 further named variants, selectable
status as box wallpapers unverified); gen3 Ruby (wallpaper
enum not verified in this pass — only a wallpaper-menu text
id was seen — so Ruby is NOT assumed equal to Emerald).

Upload path — YES, exact spec (implemented as a skeleton in
`PcViewWallpaper.patch`, constants in `wallpaperCatalogue.ts`):
- Path: phone file picker in the PC view's wallpaper row:
  `<input type="file" accept="image/*">` labelled "Upload your
  own art". No camera capture, no cloud import in this spec.
- Validation (before anything is stored): MIME must start
  with `image/`; size at most 5,000,000 bytes; image must
  decode to non-zero dimensions. Rejected files store nothing
  and show a plain message.
- Storage key: `mochiichao_pc_wallpaper_uploads_v1`
  (localStorage record: upload id -> { name, mime, dataUrl,
  width, height, createdAt }), OUTSIDE settings and OUTSIDE
  the save JSON.
- Assignment key: `mochiichao_pc_wallpapers_v1` (box index ->
  preset id or `upload:<id>`). If the PR worker moves this
  into the save JSON as additive `pcWallpapers`, the
  localStorage key must be dropped, not kept as a second truth.
- Fallback if no upload: the box's gen5-cycled preset default
  (box index mod 16, matching source init behaviour). Unknown
  id or missing upload -> same default. Quota refusal ->
  session-memory-only upload + a visible warning, never a
  silent fall back to a preset.
- No original art is shipped in this folder and no artwork
  bytes are catalogued: uploads are user-supplied at runtime,
  and preset visuals are ids + generic theme words only. A
  preset currently renders as its id label; shipping painted
  preset backgrounds is a separate art step, flagged in the
  patch header — not claimed here.

## 5. Unfilled / not invented (exact reasons)

- Gen4/gen5 bottom-screen touch battle button rects: not
  extracted (no rect table was read in this pass). Battle
  editor offers the touch-2x2 family with current sizing.
- Exact tile origins for most title/dex/shop lists and gen1
  pause: not extracted. Those editors offer family +
  alignment/spacing only.
- Gen5 pc grid rows/columns: source fixes 30 slots, not a row
  count, in the files read — left null in the catalogue.
- Gen3 Ruby wallpaper enum, gen4 Platinum wallpaper defines,
  gen5 Black 2 extra-set design count, Emerald pattern-table
  selectability: not verified (see §4 "NOT counted").
- Community wallpaper presets: 0 verified (see §4).
- Full build gate for the staged patches: the PR worker's job.
  The three pure-TS files typecheck clean under strict mode
  (run in this pass); the skeleton's JSX could not be fully
  typechecked in isolation because the borrowed tree lacks
  @types/react — that is an environment gap, not a logic
  error, and it must be closed by the in-tree build, not by
  assuming it passes.
- One transient blocker hit and recovered in this pass: the
  home disk reported 100% full (64K free) and one patch write
  failed with "No space left on device", leaving a 0-byte
  file. Nothing was deleted by this task to recover space;
  space freed by other activity (88M free at retry) and the
  file was rewritten in full and verified. If the disk fills
  again, staged writes will fail the same way — that is a
  host-capacity issue, not a content issue.

## 6. Forbidden-content check (this folder)

Spot-checked 2026-10-27: 0 hits for creature-derived and
faction-derived names that were deliberately withheld (the
grep list is in the work notes, not reproduced here to avoid
reintroducing the names). No images, no logos, no copied
artwork, no quoted source-game text, no creature names, no
cries are in this folder. Theme words in the wallpaper
catalogue are generic environment/pattern words only; where
a source name was not generic, the theme field is null and
the id is counted, not named. Source directory names in
citations (e.g. `pokebw2/...`) are repository paths, not
creature names, and match the citation style of the earlier
staged audit.
