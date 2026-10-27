# Sprite QA checklist (Step 6, QA lock) — NEW this pass
Source technique: public sprite-sheet QA write-ups found this pass
(grid / loop / transparency / final-size checks). Restated as this
lane's checklist; no source material staged.
Per sheet, before lock:
1. One clear action per sheet (idle OR walk OR attack — mixed-action
   sheets are not inspected, they are split).
2. Frame grid: every frame the same dimensions; character inside the
   frame; no scale/position/appearance jump between frames.
3. Loop check: first and last frames previewed TOGETHER; no sudden
   change, no unnecessary motion at the loop seam.
4. Transparency: background + edges inspected on a DARK background
   (a white page hides alpha holes — this is the same lesson as the
   lane's own white-spot sweep: eye-check on black). Real alpha only.
5. Pivot + trim: fixed-cell contract fields present (see
   fixed-cell-contract.md); a trimmed frame without its offset fails.
6. Final-size preview: silhouettes checked at the size actually used in
   game (64 px for icons, battle size for battle art), not only enlarged.
7. Shadow check: no baked ground blob in any frame (separate-layer rule,
   step4 spec); a blob fails even if everything else passes.
8. Licence check: no third-party art, sound, name or dialogue in the
   sheet or its manifest; moves/timing/techniques only.
Wiring target: Step 6 agent — the lock checklist; items 2/4/5/7 are
scripted where the lane already has scripts (spot_check, atlas cleanup),
items 1/3/6/8 stay human eye-checks with a recorded pass/fail per sheet.
