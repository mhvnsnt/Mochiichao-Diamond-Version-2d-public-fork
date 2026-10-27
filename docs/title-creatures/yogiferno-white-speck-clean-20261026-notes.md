# Yogiferno white-speck cleanup — notes 2026-10-26

Base: shipped in-game Yogiferno cutout 145x190 (PR #33), gate clone repo/src/assets/title/yogiferno-walk-cutout.png, read-only.
Method: scripted open-source component analysis (8-connected alpha mask). Main figure = largest component (14,410 px).
Removed: ONLY pixels in the 50 disconnected components that are near-white (R,G,B > 235) — sheet-background specks outside the outline.
Guardrail verification: changed pixels == removed speck set exactly (113 px). Main-component changed: 0. Non-speck changed: 0.
Cream fur inside the figure was NOT touched (2,311 near-white pixels belong to the main component and are untouched).
v2 (134x190) NOT used as base, NOT shipped. No standalone v2 cutout file was found in lane work dirs (only show/choice composites),
so v2 speck status is unverified from a source file in this task — not guessed.

Largest speck clusters (x range, y range, px):
- comp 1: x 13-17, y 172-181, 19 px, mean RGB [243.8, 244.2, 241.4]
- comp 2: x 13-14, y 164-169, 10 px, mean RGB [245.1, 245.2, 241.3]
- comp 3: x 133-137, y 127-129, 6 px, mean RGB [245.0, 243.3, 241.3]
- comp 4: x 132-133, y 29-32, 5 px, mean RGB [241.0, 242.6, 241.4]
- comp 5: x 46-47, y 120-121, 4 px, mean RGB [241.5, 241.5, 241.5]
- comp 6: x 144-144, y 6-8, 3 px, mean RGB [243.3, 244.0, 241.0]
- comp 7: x 61-61, y 42-44, 3 px, mean RGB [244.7, 241.7, 246.0]
- comp 8: x 128-128, y 88-90, 3 px, mean RGB [246.0, 244.0, 242.0]
- comp 9: x 139-140, y 125-126, 3 px, mean RGB [244.3, 245.3, 242.0]
- comp 10: x 123-124, y 135-137, 3 px, mean RGB [247.0, 246.0, 242.0]

Total: 50 clusters, 113 px removed, 0 speck px left untouched.
Deliverables: work/yogiferno-white-speck-clean-20261026.png, work/show-100/yogiferno-white-speck-clean-show-20261026.png, this notes file + JSON.
Status: STAGED ONLY. No repo edit, no merge, no PR, no deletion. Ships only after Mars confirms in words.

## Addendum — v2 speck check (same method, after the broad search completed)
- v2 source found: workspace/mochiichao-work/sprite-art/2d-sheets/yogiferno/yogiferno-walk-cutout-20261025-v2.png (134x190).
- v2 result: opaque 16,315 px, exactly 1 connected component, 0 disconnected speck components, 0 near-white speck pixels.
- Correction to the earlier "v2 unverified" note: v2 does NOT have the current version's speck problem. This does not change this task's scope — the clean version above is on the current 145x190 base, v2 was not used and is not shipped here; Mars's Yogiferno pick (clean current vs v2 vs keep current) is still his call.
