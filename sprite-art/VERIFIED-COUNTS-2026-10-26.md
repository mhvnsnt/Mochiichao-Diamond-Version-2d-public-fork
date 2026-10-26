# Sprite Art verified counts — 2026-10-26 (parent-verified on disk, NOT agent-reported)
Base: atlas dirs = 50 creature dirs + strikechamp_unsuited as the 51st set = 51 sets.
- game-ready: 51 sets, 1049 PNGs, icons present 51/51 = 100% (every game-ready/<c>/icons/ has a PNG)
- atlases: 50 dirs + _tools, 1736 PNGs (includes clean/ variants + cells + locked atlases)
- animation/idle: 51 dirs, 201 PNGs; animation/hurt: 51 dirs, 90 PNGs
- animation/attack: 51 dirs, 261 PNGs, 52 JSON; 0 dirs with 0 PNGs — 51/51 staging VERIFIED on disk
  (reconciles the old locked-index claim of extracted 1/51 = 2%: staging has since covered all 51)
- walk-frames: 36 creature dirs, 260 PNGs. Missing vs 50 atlas dirs: 14 dirs
  (chromejaww, cragarm, dreadtoise, duskfiend, gorokappa, mechapion, mythar, pupbble,
  pyromonk, strikechamp, tiidebiite, toxitacle, tyrage, yogiferno) = 36/50 = 72% dirs present.
  Partial dirs: sproutle 2 PNGs, strikechamp_unsuited 2 PNGs. Reaperdile PRESENT: 8 direction
  PNGs + 2 _clean variants + source webp/json (earlier "held out" was about shipping, not existence).
  Walk-gate remains BLOCKED on Mars's pick (QA-PASS locked-sheet vs walk-frames dirs) — recorded
  against both options, gate not decided here.
- overworld: 382 files; title: 39 files; vfx: 13 files; 2d-sheets: 50 dirs.
- Razorgater _clean2 adoption staged (stage-pr-clean2/): 111px/frame Gate C cut verified.
