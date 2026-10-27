#!/usr/bin/env python3
"""Apply the 9-creature TitleScene wiring patch to a fresh main clone.

Aborts (non-zero, no writes) if any anchor is missing or appears
more than once — that means main moved under us and the patch
needs a human re-check, not a blind edit.
Files are also copied from staging/ by the caller, not here.
"""
import os, sys

REPO = sys.argv[1]

def replace(path, old, new):
    with open(path, encoding="utf-8") as f:
        text = f.read()
    n = text.count(old)
    assert n == 1, f"{path}: anchor count {n} (expected 1) for: {old[:80]!r}"
    with open(path, "w", encoding="utf-8") as f:
        f.write(text.replace(old, new))
    print(f"patched {path}")

# --- IntroSequence.tsx ---
p = os.path.join(REPO, "src/components/IntroSequence.tsx")
replace(p,
    'import YogifernoTitleWalk from "./game/YogifernoTitleWalk";',
    'import YogifernoTitleWalk from "./game/YogifernoTitleWalk";\nimport TitleCreatureFigure from "./game/TitleCreatureFigure";')
replace(p,
    '<div className="text-[10px] text-gray-500 mt-1">Title creature art: GAP — silhouette art needed</div>',
    '<div className="text-[10px] text-gray-500 mt-1">Title creature art: clean cutout wired (10/10)</div>')
replace(p,
    "              <YogifernoTitleWalk variant={titleVariant} />\n            </div>\n          )}",
    "              <YogifernoTitleWalk variant={titleVariant} />\n            </div>\n          )}\n"
    "          {titleCreature.name !== 'Yogiferno' && (\n"
    "            <div className=\"mt-4 w-full max-w-md\">\n"
    "              <div className=\"text-center text-[11px] mb-1\" style={{ color: titleCreature.accent }}>\n"
    "                {titleCreature.name} — clean cutout title figure\n"
    "              </div>\n"
    "              <TitleCreatureFigure name={titleCreature.name} />\n"
    "            </div>\n"
    "          )}")

# --- TitleScene.tsx (comments only) ---
p = os.path.join(REPO, "src/components/game/TitleScene.tsx")
replace(p,
    " *   3. optional figure sprite (Yogiferno clean cutout only, shipped\n *      in this PR — NO Pokemon creature art, NO placeholder figure)",
    " *   3. figure sprite, supplied by the caller (Yogiferno PR #33\n *      + the other 9 cutouts in this batch — NO Pokemon art)")
replace(p,
    " * no audio is shipped). The other 9/10 title creatures stay GAP:\n * no creature art is invented for them here.",
    " * no audio is shipped). All 10/10 title creatures now have\n * clean cutouts: Yogiferno (PR #33) + the other 9 in this\n * batch, wired via TitleCreatureFigure. No art is invented here.")

# --- titleRotation.ts (comment only) ---
p = os.path.join(REPO, "src/lib/titleRotation.ts")
replace(p,
    "// Creature ART for the title silhouette is GAP (not shipped in\n// this code PR); rotation logic + theme wiring are real, the\n// title screen shows the featured creature's name/theme panel\n// with a GAP label for the silhouette art itself.",
    "// Creature ART is now shipped: src/assets/title/<name>-walk-\n// cutout.png for all 10 pool creatures (Yogiferno PR #33 + the\n// other 9 in this batch), wired via TitleCreatureFigure in\n// IntroSequence. Rotation logic + theme wiring are unchanged.")
print("patch applied cleanly")
