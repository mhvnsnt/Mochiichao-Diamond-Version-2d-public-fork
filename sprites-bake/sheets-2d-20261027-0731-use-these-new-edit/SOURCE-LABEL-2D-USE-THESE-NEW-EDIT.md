# 2D-SOURCED SHEETS — CLEANED — USE THESE — NEW EDIT (2026-10-27 07:31 CDT)

**THIS IS THE NEW VERSION. USE THESE FILES.**

These are the cleaned, updated, edited versions of the 2D-sourced Dorowani (#147) +
Gabu (#148) sheets, per Mars 2026-10-27 ~07:26 CDT. Every little white spot between
the legs and every shadow underneath the feet has been cut out (alpha-only removal).

- Source: locked 2D front-facing sheets ONLY. NOT 3D renders. NOT the 3D-bake set.
- What changed vs `sheets-2d-20261027/`: 2,523 px removed net across 34 cells —
  92 leg-gap whites, 812 grey ground-shadow px, 676 + 393 + 142 + 292 grid-line /
  border / fringe artifact px, 112 newly-detached fragments, 4 surgical px.
  See `CLEANING-REPORT-20261027-0731-use-these-new-edit.md` for per-cell counts.
- Kept: eye highlights, body shading, foot outline, and 3 body-colour micro-fragments
  at the feet/tail (plausibly tail-tip/toe — not removed to avoid nicking body).
- One attempted pass (iterative floating-dark, 427 px) was REVERTED in full because it
  trimmed real extremities (snout tip, hand/fingertips, head-spike tips). 0 pass-8
  pixels remain here. The revert is documented in the cleaning report.
- Files: 34 cells + 12 strips + 2 manifests, every filename carrying
  `-use-these-new-edit`. Manifests resolve every file; strips are byte-exact
  concatenations of their cells.
- Old versions: `sheets-2d-20261027/` — every art/manifest file renamed
  `-DO-NOT-USE` and covered by `SUPERSEDED-DO-NOT-USE.md` there. Do NOT use the old
  ones. Nothing was deleted anywhere.

Status: LOCAL STAGING ONLY. No PR, no push, no wiring, no game-code change.
