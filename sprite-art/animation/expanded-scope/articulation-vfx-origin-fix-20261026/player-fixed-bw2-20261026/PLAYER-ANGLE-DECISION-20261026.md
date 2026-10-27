# Player angle decision — 30° (Black 2 code-true)

Mars confirmed the BW2 player VFX set 2026-10-27 ~07:26 CDT, with the condition:
"if the Pokemon code says 30 degrees then we go for 30 degrees."

The condition is MET. The Black 2 code angle, recomputed from `pokebw2/src/ov168/`
(`btlv_mcss.c`, `btlv_camera.c`, `btlv_effect.c:1403` `BtlvEffTool_CalcStepVec`,
projected through the camera basis), is exactly **30.0° in cell space, up-right**
(29.997° computed; measured mean 29.9° across this set).

## Decision

- **Player VFX angle = 30° (BW2 code-true set, this directory).** This is the
  player set to use.
- **The 45° aimfix set (shipped via PR #263) is SUPERSEDED for the player side
  as of this decision.** Its files stay on main untouched — marked superseded
  in this document only. Never deleted, never renamed.
- The opponent code-true set (30° down-left) is a separate set and is unaffected
  by this decision.
- Note: the staged BW2 manifest/report flags written 2026-10-26 say the aimfix
  set was "NOT superseded" — that was true at staging time, when the BW2 set
  was an additional set. This decision doc supersedes that staging-time note.

## Set shipped in this PR

- 204/204 attack sets, 1,122 cells, 51 GIFs (one per creature)
- 58 show sheets: 51 per-creature before/after + 1 Dorowani direction proof +
  6 combined montages (the sheets Mars confirmed)
- Manifest + report, shipped verbatim from staging
- 0 deletions, add-only
