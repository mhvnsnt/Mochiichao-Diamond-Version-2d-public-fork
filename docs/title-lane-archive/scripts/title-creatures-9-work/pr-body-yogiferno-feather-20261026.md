Ship Yogiferno feathered preview as new locked cutout (Mars-approved 2026-10-26).

Replaces src/assets/title/yogiferno-walk-cutout.png (clean v3, PR #216) with the
feathered preview: 145x190 RGBA, 1px feather on clean v3 (outermost edge ring
at 50% alpha, 1,055 intermediate-alpha pixels; interior byte-identical to v3,
RGB unchanged). Mars approved the feathered previews in words 2026-10-26
~16:52 CDT ("barely feathered, so light they're not noticeable — those are
fine, those are perfect", re-affirmed ~16:57 CDT). Prerequisite satisfied:
clean v3 shipped as PR #216 (merge 1e0f70e5) and verified on main, so this
ship builds on v3 and does not clobber it.

Changes: 1 file replaced (yogiferno-walk-cutout.png, 40,129 -> 40,525 bytes).
0 other files, 0 deletions, no code touched, no Yogiferno file other than
this cutout touched. Gates on the branch: lint (tsc --noEmit) PASS, build
PASS, validate:reference PASS (warnings are pre-existing open decisions).
Feathered Yogiferno succeeds clean v3 as the locked Yogiferno cutout on main.
Merged, not live until a Pages rebuild.
