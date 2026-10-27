# FRONT/BACK ROLE TABLE — Relabel + Swap + Pick A (2026-10-26)

Consolidated game-use roles for the 12 sets examined in the true-back pass.
Source records shipped alongside this table in the same PR:
- `RELABEL-MANIFEST-20261026.json` (relabel part a)
- `TRUEBACK-MANIFEST-20261026.json` (relabel + generation, complete)
- `FRONT-BACK-SWAP-MANIFEST-20261026.json` (Strikechamp + Shellguard swap)

## Authority (all confirmed by Mars, 2026-10-26 CDT)

- Relabel order ~16:44–16:46: front-facing "back" cells relabeled as NEW FRONT cells;
  true backs generated separately.
- All true backs confirmed 17:23–17:25, INCLUDING the 9 passing generated backs and
  both verified backs. FAILED Razorgater first attempt NOT covered by that confirmation.
- Front/back swap confirmed 17:35 ("those are backs") + 17:37–17:38 (true fronts in
  the front slots).
- Two-backs pick decided 18:23: PICK A FOR BOTH Strikechamp and Shellguard.
- Pick-A back sets confirmed 18:32.

## Rules this table enforces

- Relabel is a manifest entry only: source files are NOT renamed, moved, or deleted.
  Old back roles are marked SUPERSEDED, never silently reused.
- Generated backs for Strikechamp and Shellguard are SUPERSEDED for game use by
  Pick A. They are kept, not deleted.
- This PR covers ROLES/MANIFESTS ONLY. It does NOT ship hand overlays, pixel back
  cells, generated 1600x1600 back art, or any other art file. Those have separate
  verdicts and separate PRs.
- Pixel back cells (trueback-pixel-20261026) are REFERENCED below by staged path
  only. Mars's explicit final confirmation on the pixel cells as a standalone item
  is still owed, except where Pick-A sets built on them were confirmed 18:32.

## Per-creature role table

| Creature | Registered front (old) | Registered back (old) | NEW front (game use) | NEW back (game use) | Status |
|---|---|---|---|---|---|
| reaperdile | cell 1 | cell 2 | cell 2 (relabeled, was "back") | generated true back (pixel cell staged, final confirmation owed) | Relabel + generated back confirmed as look 17:23–17:25 |
| chromejaww | cell 1 | cell 0 | cell 0 (relabeled, was "back") | generated true back (pixel cell staged, final confirmation owed) | Relabel + generated back confirmed as look 17:23–17:25 |
| strikechamp (suited) | cell 4 — actually a BACK (gold back plate, no face) | cell 5 | cell 5 (relabeled, was "back"; verified front: face + visor) | cell 4 (relabeled, atlas 256,0 — PICK A, confirmed 18:23) | Swap + Pick A confirmed; generated strikechamp back SUPERSEDED for game use, kept not deleted |
| razorgater | cell 4 | cell 5 | cell 5 (relabeled, was "back") | generated true back RETRY (first attempt FAILED: open jaw/teeth visible, superseded; retry: genuine back, no face/jaw/teeth) | Relabel confirmed; retry back confirmed as look with pixel conversion condition |
| stormtalon | cell 2 | cell 0 | cell 0 (relabeled, was "back"; old manifest claim "true_back_no_face" was WRONG) | generated true back (pixel cell staged, final confirmation owed) | Relabel + generated back confirmed as look 17:23–17:25 |
| duskfiend | cell 0 | cell 1 | cell 1 (relabeled, was "back") | generated true back (pixel cell staged, final confirmation owed) | Relabel + generated back confirmed as look 17:23–17:25 |
| finblade | cell 1 | cell 2 | cell 2 (relabeled, was "back") | generated true back (pixel cell staged, final confirmation owed) | Relabel + generated back confirmed as look 17:23–17:25 |
| mechapion | cell 1 | cell 2 (overworld_back QA FALLBACK; no true battle_back existed) | cell 2 (relabeled, was fallback "back") | generated true back (pixel cell staged, final confirmation owed) | Relabel + generated back confirmed as look 17:23–17:25 |
| wispkin | cell 2 | cell 0 | cell 0 (relabeled, was "back"; mask untouched) | generated true back (pixel cell staged, final confirmation owed) | Relabel + generated back confirmed as look 17:23–17:25 |
| shellguard | cell 1 — actually a BACK (domed shell + red studs, no face) | cell 0 | cell 0 (relabeled, was "back"; verified front: face + belly plate) | cell 1 (relabeled, atlas 64,0 — PICK A, confirmed 18:23) | Swap + Pick A confirmed; generated shellguard back SUPERSEDED for game use, kept not deleted |
| strikechamp_unsuited | cell 5 | cell 4 | cell 5 (UNCHANGED) | cell 4 (UNCHANGED — verified true back) | Verified, no relabel, no new back |
| strikechamp_unsuited_full | cell 0 | cell 1 | cell 0 (UNCHANGED) | cell 1 (UNCHANGED — verified true back) | Verified, no relabel, no new back |

## Why only Strikechamp + Shellguard needed a pick

Every other creature ended with exactly ONE back candidate. Only Strikechamp and
Shellguard ended with TWO genuine backs (relabeled cell + generated back), so only
those two needed a pick. Pick A = the relabeled cell for both.

## Generated-back file references (staged, NOT shipped in this PR)

- reaperdile: `trueback-20261026/gen/media-generation-truebacka-reaperdile-20261026-0-6d5db02b-c68a-4620-8ec8-e96b5acae73c.webp` → pixel `trueback-pixel-20261026/cells/reaperdile-back-pixel-20261026.png`
- chromejaww: `trueback-20261026/gen/media-generation-truebacka-chromejaww-20261026-0-391858d7-415b-44e2-a591-f4606464d370.webp` → pixel `trueback-pixel-20261026/cells/chromejaww-back-pixel-20261026.png`
- strikechamp (SUPERSEDED by Pick A): `trueback-20261026/gen/media-generation-truebacka-strikechamp-20261026-0-ef4681ed-627e-4eb0-b582-cfdda85c1951.webp`
- razorgater retry: `trueback-20261026/retry/media-generation-razorgater-trueback-retry-2026-0-b1f32a30-4c5e-4a6e-8daa-c005ce106288.webp` → pixel `trueback-pixel-20261026/cells/razorgater-back-pixel-20261026.png` (first attempt `trueback-20261026/gen/media-generation-truebacka-razorgater-20261026-0-bdf7c42a-b553-4b58-bab8-1e3a7b5fd408.webp` FAILED, kept)
- stormtalon: `trueback-20261026/gen/media-generation-truebackb-stormtalon-20261026-0-f8dde49d-ae07-466d-bc25-65a0bf1922fa.webp` → pixel `trueback-pixel-20261026/cells/stormtalon-back-pixel-20261026.png`
- duskfiend: `trueback-20261026/gen/media-generation-truebackb-duskfiend-20261026-0-3750a2e5-dccb-4ac6-afa2-b4c9ab13214d.webp` → pixel `trueback-pixel-20261026/cells/duskfiend-back-pixel-20261026.png`
- finblade: `trueback-20261026/gen/media-generation-truebackb-finblade-20261026-0-6a36c531-5f02-467a-a9fc-037afc31747a.webp` → pixel `trueback-pixel-20261026/cells/finblade-back-pixel-20261026.png`
- mechapion: `trueback-20261026/gen/media-generation-truebackb-mechapion-20261026-0-9f331043-2faa-4ccf-a68f-ebdcabeb208d.webp` → pixel `trueback-pixel-20261026/cells/mechapion-back-pixel-20261026.png`
- wispkin: `trueback-20261026/gen/truebackC-wispkin-20261026.webp` → pixel `trueback-pixel-20261026/cells/wispkin-back-pixel-20261026.png`
- shellguard (SUPERSEDED by Pick A): `trueback-20261026/gen/truebackC-shellguard-20261026.webp`

## Untouched by this PR

- Gearkid + Toxitacle (not named in the relabel order).
- All atlas PNGs, cell PNGs, locked manifests, hand overlays, back-view sets,
  walk frames, and every other creature's roles.
- Zero deletions, zero overwrites, zero game-code changes.
