# Feather audit — Title Creatures lane — 2026-10-26

AUDIT ONLY. No shipped file was modified, no feathered version was created,
no merge, no PR. This report is the deliverable; any fix is a separate
show-first step (see "Proposed next step" at the end).

Ordered by Mars 2026-10-26 ~14:26 CDT ("feather audit get it done").
Kittember is EXEMPT and was not audited: its shipped glow version (PR #162)
was approved WITHOUT a feather pass, and a feather pass there would be a new
version shown first.

## Source files (shipped versions on main, not local copies)

Downloaded from `main` via raw.githubusercontent.com, then md5-compared to
the local gate clone (all 9 matched exactly). Main moved during the audit
(d75a5e7 → 2fd418c8, a cry-ship landing); all 9 cutout blob SHAs were
re-checked against current main 2fd418c8 and are UNCHANGED, so this audit
is valid against current main.

| Creature | File | Size | md5 (main download) |
|---|---|---|---|
| Mochii | mochii-walk-cutout.png | 380×380 | aa95714f06b146c3464d139837b6cbab |
| Razorgater | razorgater-walk-cutout.png | 265×266 | 1a725ed596192efa8eb1baf0f9f6929a |
| Tyrage | tyrage-walk-cutout.png | 327×305 | 05e3253c5ffa318d0c25920db9529d0b |
| Sproutle | sproutle-walk-cutout.png | 259×333 | 6d002526c9e9ee127ebfa91a543397fe |
| Dorowani | dorowani-walk-cutout.png | 263×398 | 342315e9063e2fd9de348a434f07dc1f |
| Gabu | gabu-walk-cutout.png | 292×295 | bddcbfff8571ec8022083b9e87945259 |
| Wispkin | wispkin-walk-cutout.png | 288×609 | 4741bc9a97b80e99106a764d1aa6c3f8 |
| Mythar | mythar-walk-cutout.png | 434×350 | 474b1583464fe377fb32098781b37bcf |
| Yogiferno | yogiferno-walk-cutout.png | 145×190 | 0c3723787f03d743c1f6fbd1c03c0982 |

Note: `mythar-walk-cutout-20261026-u2netp.png` also exists on main but is NOT
the shipped file — the code references `mythar-walk-cutout.png`, which is
what was audited. Yogiferno's shipped file is referenced via its own wrapper
(`YogifernoTitleWalk.tsx`), not `TitleCreatureFigure.tsx`.

## Method (script + full numbers saved alongside this report)

- Alpha channel only. Figure mask = alpha > 10.
- Every row and column figure run gives boundary crossings (left/right,
  top/bottom). Window per crossing: 3 outside pixels + 8 inside pixels,
  always ordered outside → in.
- Opaque threshold 240, not 255: the u2netp outputs plateau at alpha
  245–254, so 255 would misclassify their solid interiors as transparent.
- Classification per crossing:
  - **feathered**: at least one intermediate alpha pixel (11–239) between
    the last ≤10 pixel and the first ≥240 pixel — a ramp, not a step.
  - **hard**: last outside pixel ≤10 and first figure pixel ≥240 with no
    intermediate pixel — a 0 → full step in one pixel.
  - **soft-design**: interior never reaches ≥240 in the window (wisp smoke,
    Mythar halo, Yogiferno fire, translucent leaf/crack regions) — not a
    decisive edge, excluded from the feathered fraction.
  - **skipped**: figure touches the canvas edge (no outside to judge from).
- Verdict: feather present = YES when feathered crossings are the majority
  of decisive (feathered + hard) crossings. Median ramp width (count of
  intermediate pixels in the transition) is reported separately.
- Method correction, disclosed: a first pass used a 3px interior window and
  a 245 threshold and misclassified the u2netp edges as "soft" (their ramps
  are ~5px wide, so the first 3 interior pixels never hit 245). The wider
  window + 240 threshold fixed that; the first-pass numbers are discarded
  and are not in this report.

## Results: 7/9 feathered (ramp present), 2/9 hard

| Creature | Feather? | Decisive crossings (feathered / hard) | Feathered fraction | Median ramp width | Intermediate-alpha pixels (1–254) in whole file |
|---|---|---|---|---|---|
| Mochii | NO | 2,040 (0 / 2,040) | 0.000 | 0 px | 0 |
| Razorgater | YES | 995 (995 / 0) | 1.000 | 5 px | 45,798 |
| Tyrage | YES | 1,205 (1,205 / 0) | 1.000 | 4 px | 57,949 |
| Sproutle | YES | 1,000 (1,000 / 0) | 1.000 | 5 px | 58,023 |
| Dorowani | YES | 1,662 (1,662 / 0) | 1.000 | 4 px | 10,397 |
| Gabu | YES | 1,404 (1,404 / 0) | 1.000 | 4 px | 7,817 |
| Wispkin | YES | 2,040 (2,040 / 0) | 1.000 | 4 px | 10,859 |
| Mythar | YES | 2,329 (2,329 / 0) | 1.000 | 4 px | 15,360 |
| Yogiferno | NO | 1,037 (0 / 1,037) | 0.000 | 0 px | 0 |

Excluded (not decisive) per creature — soft-design / edge-touch skipped:
Mochii 0 / 0; Razorgater 686 / 73; Tyrage 916 / 71; Sproutle 574 / 80;
Dorowani 431 / 213; Gabu 279 / 179; Wispkin 497 / 71; Mythar 692 / 127;
Yogiferno 0 / 189. Zero crossings fell into an "other"/ambiguous bucket
for any creature.

Example edge profiles (alpha values, outside → in, 3 outside + 8 inside):

- Mochii (hard): `[0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255]`
- Yogiferno (hard): `[0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255]`
- Razorgater (ramp): `[0, 0, 5, 28, 87, 170, 226, 242, 218, 147, 62]`
  (last values dip again — that sample crosses a neighbouring detail; the
  decisive ramp is the 5 → 226 rise)
- Tyrage (ramp): `[0, 1, 6, 18, 41, 83, 134, 177, 206, 225, 240]`
- Sproutle (ramp): `[0, 3, 8, 19, 41, 76, 120, 167, 205, 229, 242]`
- Dorowani (ramp): `[0, 1, 10, 43, 116, 201, 245, 254, 255, 254, 245]`
- Gabu (ramp): `[0, 0, 1, 14, 71, 172, 235, 251, 252, 245, 219]`
- Wispkin (ramp): `[0, 0, 1, 13, 59, 133, 188, 225, 245, 252, 245]`
- Mythar (ramp): `[0, 0, 5, 29, 87, 162, 215, 235, 240, 240, 240]`

## Two findings Mars should see plainly

1. **Mochii and Yogiferno have no feather at all.** Both shipped files are
   purely binary alpha (0 or 255, zero intermediate pixels in the whole
   file). Every decisive edge is a one-pixel 0 → 255 step. Note on Mochii:
   the PR #51 method description mentions a 1px alpha feather, but the
   shipped Mochii file on main does not contain one — the file fact is
   measured; why the described step is absent from the shipped file was
   not investigated in this audit and is not guessed here.
2. **The 7 feathered creatures do NOT have an exact 1px feather.**
   Their median ramp widths are 4–5px — a soft segmentation edge, wider
   than 1px. So under the audit's test (ramp vs hard cut) the count is
   7/9 feathered; under a strict "exactly 1px ramp" test the count is 0/9.
   Both numbers are stated here so the distinction is not hidden.

## Proposed next step (NOT done in this audit)

- New dated feathered versions for **Mochii and Yogiferno only**, built
  with a scripted feather pass, shown to Mars first (show-first rule),
  then shipped via a gate-checked PR if approved. No shipped file was
  changed to produce this report.
- Separate Mars call, not assumed: whether the 7 soft-edged creatures
  (4–5px ramps) should be tightened to an exact 1px feather, or left
  as-is. If tightened, those would also be new dated versions shown
  first, not silent replacements.

## Reproducibility

- Script: `feather-audit-20261026-script.py` (same directory as this report)
- Full per-creature numbers: `feather-audit-20261026-results.json`
- Audit scratch (main downloads): `/tmp/feather-audit-20261026/` (ephemeral)
- Repo state after audit: this audit added nothing to the repo. (The
  `public/audio/cries/` files visible in the gate clone's git status at
  audit time belong to the parallel cry-ship work, not to this audit.)
