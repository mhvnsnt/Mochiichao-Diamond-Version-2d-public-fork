Wire title-10 cry gate (title press → V1 cry → 90-frame wait → white fade)

Title 10 only, V1 cries, per Mars's 2026-10-26 decisions (title gate uses V1;
r1 files stay alongside, untouched). Press → playTitleCry(current figure) →
90 frames (1.5s) → existing Platinum 'normal' white fade, following the
Pokemon title structure (species-indexed table, one cry per creature).

Files (2 changed, 0 deletions, 0 other files):
- src/lib/titleCryGate.ts (NEW, 85 lines): species-indexed table for the
  10 confirmed title creatures → /audio/cries/<name>-cry.wav (V1 files
  shipped in PR #193, verified present on main). Pan 0 centre, SFX bus
  default volume, normal priority, no title-music ducking, fail-closed
  (unknown creature / missing file → false, never throws). Shared API
  note for title/battle/lab; battle/lab call sites are a later batch.
- src/components/game/TitleScene.tsx (modified, cry-gate lines only):
  press listener (keydown + pointerdown, once-only) active ONLY where
  TitleScene itself owns the prompt (startPrompt=true); explicit exitKind
  prop still wins; non-title-10 figure gets no cry and no exit.

Base drift handled (stated plainly): the original gate branch was based
on 2e17859 (PR #200). Live main has since gained Kittember glow
frame-cycle wiring in TitleScene (figureCycleUrls/figureCycleMs). The
uploaded TitleScene is a conflict-free 3-way merge (merge-file exit 0,
0 markers): main's cycle wiring preserved in full, gate lines added
only. Diff main→branch is gate lines only; no logo, subtitle, studio,
font, layout, shadow, or blink lines changed.

Dormant until opt-in (stated plainly): NO caller file is touched here
and no caller currently passes startPrompt=true, so pressing the title
does not play a cry yet. Activation (a caller passing startPrompt=true)
is a separate title-owner follow-up, not this PR.

Gates on the branch: lint (tsc --noEmit), build, validate:reference —
see gate log. Merged, not live until a Pages rebuild.
