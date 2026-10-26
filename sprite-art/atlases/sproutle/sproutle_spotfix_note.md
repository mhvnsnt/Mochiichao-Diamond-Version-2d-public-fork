# Sproutle between-feet spot fix — note

Mars-approved 2026-10-26 ~08:45 EDT ("Perfect, that's perfect").

**The spot:** a distinct ground-level white component between Sproutle's
feet in the atlas cells — front cells 13px at x28–34, y55–56 (side cells
similar at y54–56). It is NOT a claw, NOT body shading, and NOT the
contact shadow (filled shadows are untouched).

**The fix:** removed ONLY that component, per cell, by connected-component
matching (tool: `sprite-art/atlases/_tools/remove_ground_spot.py`).
14/23 Sproutle cells changed, 173px total removed, feet/claws untouched.
Cell_00 before/after was eye-checked by the parent before approval.

**Files in this batch:** `sproutle_cell_XX_spotfree.png` (14 files, NEW
files only). The original cells are NOT deleted or replaced — they are
kept, and these spotfree versions sit alongside them.

**Title art:** no title-art fix file is included. The parent verified
the Sproutle main sheet has NO between-feet spot (the gap shows plain
sheet background, no white blob) — the spot was an atlas-cell artifact
only.

**History:** the earlier correct-edit sample had wrongly claimed
Sproutle needed "nothing", because it scanned the atlas montage rather
than checking per-cell ground components. Per-cell component checks are
now the standard for spot claims.
