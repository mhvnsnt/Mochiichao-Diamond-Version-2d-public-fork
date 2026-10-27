# UI-art docs ship — manifest 2026-10-27 (disc-to-repo lane)

Additions only, 0 deletions. Docs only — no code, no asset, no wiring change.
These reports were verified NOT on main (by git blob SHA against the main tree) at
2026-10-27; two press-start docs already on main are NOT duplicated here.

## Docs (docs/ui-art/) — 6 files
- fonts-status-20261027-report.md — font slots 16/25 shipped; pokemon-base is a structure/mapping slot only, never a font file
- intro-stale-closure-fix-20261027-report.md — intro stale-closure fix report
- skins-wiring-20261027-report.md — skins wiring verification (already wired on main via PR #156; report only)
- ui-lane-recount-20261027.md — UI lane recount: reconstructed 40-system count 24 done / 14 partial / 2 not started
- main-menu-need-list-100pct.md — main menu need list
- intro-title-scene-art-research-100pct.md — intro/title-scene art research

## Not in this batch (held, with reasons)
- menu-editor-pokemon-settings-trace-20261026.md — proprietary trace; private-mirror candidate / HELD per the 2026-10-25 boundary, never public.
- Title-bg v1 paintings — superseded by v2 files already on main (src/assets/title/).
- TitleScene v2 wiring in the title-bg-work clone — already on main (v2Streak / TITLE_CARD_ANIMATION_STYLES present; titleActionShots.ts blob SHA matches main exactly). Clone diff is stale, not shipped.
- UI iteration PNGs/GIFs/MP4s (menu v10–v31, cloudpos/cloudemblem takes, action videos) — superseded intermediates; locked v32 / v2 assets are already on main.
- ui-art/local-only/ — local-only by name; kept on disc.
