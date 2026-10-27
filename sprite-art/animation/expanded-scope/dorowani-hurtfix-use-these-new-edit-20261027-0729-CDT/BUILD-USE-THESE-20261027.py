#!/usr/bin/env python3
"""Package Dorowani FIXED hurt + cleaned non-T-pose sets as USE-THESE new edits.

Mars verdicts 2026-10-27 ~07:26 CDT (replying to hurt-fix show sheets):
- FIXED hurt variant PICKED (light-blue belly, 486 tan px corrected).
- LIKENESS variant NOT picked: kept staged, marked NOT-PICKED, never shipped.
- Cleaned sets A/B/C/D CONFIRMED as replacement non-T-pose sets; C ships FIXED only.
- Old shadow/white-spot versions marked DO NOT USE. NOTHING deleted here.

This script copies (never moves) the picked files into a new dated dir,
renames old versions with -DO-NOT-USE markers, and verifies everything.
Run once. Safe to re-run only on a fresh tree (it aborts if outputs exist).
"""
import hashlib, json, os, shutil, sys
from datetime import datetime
from zoneinfo import ZoneInfo

BASE = os.path.expanduser("~/workspace/mochiichao-work/sprite-art")
EXP = os.path.join(BASE, "animation/expanded-scope")
HURTFIX = os.path.join(EXP, "dorowani-hurtfix-20261026")
NONTPOSE = os.path.join(EXP, "dorowani-non-tpose-20261026")
HURTDIR = os.path.join(BASE, "animation/hurt/dorowani")

STAMP = datetime.now(ZoneInfo("America/Chicago")).strftime("%Y%m%d-%H%M-CDT")
OUT = os.path.join(EXP, f"dorowani-hurtfix-use-these-new-edit-{STAMP}")
MARK = f"-use-these-new-edit-{STAMP[:8]}"

def md5(p):
    h = hashlib.md5()
    with open(p, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()

def marked_name(p, marker):
    stem, ext = os.path.splitext(p)
    return stem + marker + ext

def tree_files(d):
    out = []
    for root, _, files in os.walk(d):
        for f in files:
            out.append(os.path.join(root, f))
    return sorted(out)

def main():
    if os.path.exists(OUT):
        sys.exit(f"ABORT: output dir already exists: {OUT}")

    # ---- sources (assert all exist before mutating anything) ----
    fixed_src = os.path.join(HURTFIX, "dorowani_hurt_fixed_lightblue-20261026.png")
    likeness_src = os.path.join(HURTFIX, "dorowani_hurt_likeness-20261026.png")
    cleaned_src = {
        "A-clean": os.path.join(HURTFIX, "cleaned-sets-20261026", "A_clean"),
        "B-clean": os.path.join(HURTFIX, "cleaned-sets-20261026", "B_clean"),
        "C-clean-fixed": os.path.join(HURTFIX, "cleaned-sets-20261026", "C_clean_fixed"),
        "D-clean": os.path.join(HURTFIX, "cleaned-sets-20261026", "D_clean"),
    }
    old_set_dirs = ["A_out_of_tpose_idle", "B_front_walk_cycle",
                    "C_tpose_reaction_recover", "D_weight_shift_no_tpose"]
    hurt_src = os.path.join(HURTDIR, "dorowani_hurt_cell_00.png")
    for p in [fixed_src, likeness_src, hurt_src] + list(cleaned_src.values()):
        assert os.path.exists(p), f"missing source: {p}"

    # ---- pre-state snapshot (counts only; renames preserve counts) ----
    pre = {
        "nontpose_files": len(tree_files(NONTPOSE)),
        "hurtdir_files": len(tree_files(HURTDIR)),
        "hurtfix_files": len(tree_files(HURTFIX)),
    }

    # ---- old set files to mark: 21 frame PNGs + 4 top-level GIFs ----
    old_files = []
    for d in old_set_dirs:
        dpath = os.path.join(NONTPOSE, d)
        assert os.path.isdir(dpath), f"missing old set dir: {dpath}"
        old_files += sorted(f for f in tree_files(dpath)
                            if f.endswith((".png", ".gif")))
    old_files += sorted(os.path.join(NONTPOSE, f) for f in os.listdir(NONTPOSE)
                        if f.endswith(".gif"))
    old_files = sorted(set(old_files))
    assert len(old_files) == 25, f"expected 25 old set files, got {len(old_files)}"
    old_md5 = {p: md5(p) for p in old_files}
    hurt_md5_before = md5(hurt_src)

    # ---- build new USE-THESE dir (copies, byte-verified) ----
    manifest_entries = []
    os.makedirs(OUT)
    # picked hurt cell
    sub = os.path.join(OUT, "hurt-use-these-new-edit")
    os.makedirs(sub)
    dst = os.path.join(sub, marked_name(os.path.basename(fixed_src), MARK))
    shutil.copy2(fixed_src, dst)
    assert md5(dst) == md5(fixed_src)
    manifest_entries.append({"role": "picked_hurt_cell_FIXED", "file": os.path.relpath(dst, OUT),
                             "source": os.path.relpath(fixed_src, BASE), "md5": md5(dst)})
    # cleaned sets A/B/C-fixed/D
    for subname, srcdir in cleaned_src.items():
        sub = os.path.join(OUT, subname + "-use-these-new-edit")
        os.makedirs(sub)
        for f in sorted(os.listdir(srcdir)):
            src = os.path.join(srcdir, f)
            if not os.path.isfile(src):
                continue
            dst = os.path.join(sub, marked_name(f, MARK))
            shutil.copy2(src, dst)
            assert md5(dst) == md5(src), f"byte mismatch: {dst}"
            manifest_entries.append({"role": f"cleaned_set_{subname}", "file": os.path.relpath(dst, OUT),
                                     "source": os.path.relpath(src, BASE), "md5": md5(dst)})

    n_png = sum(1 for e in manifest_entries if e["file"].endswith(".png"))
    n_gif = sum(1 for e in manifest_entries if e["file"].endswith(".gif"))
    print(f"COPIED: {len(manifest_entries)} media files ({n_png} PNG + {n_gif} GIF), all md5-verified")

    # ---- mark old versions DO NOT USE (renames only, 0 deletions) ----
    renamed = []
    for p in old_files:
        new = marked_name(p, "-DO-NOT-USE")
        os.rename(p, new)
        assert md5(new) == old_md5[p]
        renamed.append(new)
    for d in old_set_dirs:
        os.rename(os.path.join(NONTPOSE, d), os.path.join(NONTPOSE, d + "-DO-NOT-USE"))
    hurt_new = marked_name(hurt_src, "-DO-NOT-USE")
    os.rename(hurt_src, hurt_new)
    assert md5(hurt_new) == hurt_md5_before
    print(f"MARKED DO NOT USE: {len(renamed)} old set files + 1 hurt source cell + 4 set dirs")

    # ---- mark LIKENESS not-picked (rename + note; kept staged, not shipped) ----
    likeness_new = marked_name(likeness_src, "-NOT-PICKED")
    os.rename(likeness_src, likeness_new)
    print(f"LIKENESS MARKED NOT-PICKED: {os.path.basename(likeness_new)}")

    # ---- notes ----
    nontpose_note = os.path.join(NONTPOSE, f"SUPERSEDED-DO-NOT-USE-{STAMP[:8]}.md")
    with open(nontpose_note, "w") as f:
        f.write(f"""# SUPERSEDED — DO NOT USE — Dorowani old non-T-pose sets ({STAMP})

Mars verdict 2026-10-27 ~07:26 CDT: the cleaned non-T-pose sets A/B/C/D are
the replacement sets. Every frame PNG and GIF in the four old set dirs below
was renamed with a `-DO-NOT-USE` marker on {STAMP}; the set dirs themselves
were renamed with a `-DO-NOT-USE` suffix. NOTHING was deleted.

Old set dirs (renamed):
- A_out_of_tpose_idle-DO-NOT-USE/ (was A_out_of_tpose_idle/, 8 frames)
- B_front_walk_cycle-DO-NOT-USE/ (was B_front_walk_cycle/, 5 frames)
- C_tpose_reaction_recover-DO-NOT-USE/ (was C_tpose_reaction_recover/, 3 frames;
  frame01 was already deleted 2026-10-26 per DELETION-RECORD-20261026.md)
- D_weight_shift_no_tpose-DO-NOT-USE/ (was D_weight_shift_no_tpose/, 5 frames)
- Top-level GIFs A/B/C/D renamed with -DO-NOT-USE (4 GIFs)
- Total marked here: 25 files (21 frames + 4 GIFs).

Why superseded: these carry the shadow underneath and the little white spot
between the legs. The cleaned replacements (alpha-only cleanup, 184px removed,
0 leg-gap white px) live in the new USE-THESE package:
  {os.path.relpath(OUT, BASE)}

Show sheets, manifest, and audit doc in this dir are historical records of the
old sets and are left untouched; they are NOT the versions to use.
""")
    hurt_note = os.path.join(HURTDIR, f"SUPERSEDED-DO-NOT-USE-{STAMP[:8]}.md")
    with open(hurt_note, "w") as f:
        f.write(f"""# SUPERSEDED — DO NOT USE — Dorowani original tan-belly hurt cell ({STAMP})

Mars verdict 2026-10-27 ~07:26 CDT: the FIXED hurt variant (light-blue belly)
is the picked hurt version. The original tan-belly hurt cell was renamed with
a `-DO-NOT-USE` marker on {STAMP} and is NOT deleted (archive copy kept).

- Old: dorowani_hurt_cell_00-DO-NOT-USE.png (was dorowani_hurt_cell_00.png)
- Picked replacement: {os.path.relpath(OUT, BASE)}/hurt-use-these-new-edit/
  dorowani_hurt_fixed_lightblue{ MARK }.png
  (486 tan belly pixels recolored to the locked front cell_00 pale
  light-blue palette, 0 other pixels changed.)

Note: dorowani.hurt.json in this dir still names the pre-rename filename;
that JSON is a staging record and was left untouched. Read this note first.
""")
    likeness_note = os.path.join(HURTFIX, f"LIKENESS-NOT-PICKED-{STAMP[:8]}.md")
    with open(likeness_note, "w") as f:
        f.write(f"""# NOT PICKED — Dorowani hurt LIKENESS variant ({STAMP})

Mars verdict 2026-10-27 ~07:26 CDT: the FIXED hurt variant is the picked hurt
version. The LIKENESS variant is NOT picked. It stays staged here, clearly
marked, and must NEVER be shipped as the hurt version.

- Standalone file renamed: dorowani_hurt_likeness-20261026-NOT-PICKED.png
  (was dorowani_hurt_likeness-20261026.png)
- C_clean_likeness/ set (4 frames + GIF) in cleaned-sets-20261026/ is likewise
  NOT picked and is NOT included in the USE-THESE package. C ships in FIXED
  only: cleaned-sets-20261026/C_clean_fixed/.

Picked hurt version lives in:
  {os.path.relpath(OUT, BASE)}/hurt-use-these-new-edit/
""")

    # ---- manifest ----
    manifest = {
        "package": "Dorowani picked hurt (FIXED) + cleaned non-T-pose sets A/B/C/D",
        "verdict": "Mars 2026-10-27 ~07:26 CDT, replying to hurt-fix show sheets",
        "picked_hurt": "FIXED variant (light-blue belly). LIKENESS variant NOT picked, kept staged.",
        "replacement_sets": "Cleaned A/B/C/D (alpha-only cleanup, 184px removed, 0 leg-gap white px). C ships in FIXED only.",
        "old_versions": "Original non-T-pose sets + original tan-belly hurt cell marked -DO-NOT-USE. 0 deletions in this job.",
        "prior_deletion_stands": "C frame01-N_hurt (md5 89c5ed8d8cb3043b975aa32448c40819) deleted 2026-10-26 per DELETION-RECORD-20261026.md; remains the only deletion.",
        "created_cdt": STAMP,
        "files": manifest_entries,
        "counts": {"media_total": len(manifest_entries), "png": n_png, "gif": n_gif},
    }
    mpath = os.path.join(OUT, f"MANIFEST-use-these-new-edit-{STAMP[:8]}.json")
    with open(mpath, "w") as f:
        json.dump(manifest, f, indent=2)
    readme = os.path.join(OUT, f"README-USE-THESE-NEW-EDIT-{STAMP[:8]}.md")
    with open(readme, "w") as f:
        f.write(f"""# USE THESE — Dorowani hurt FIXED + cleaned non-T-pose sets — NEW EDIT ({STAMP})

This is the newest version to use, per Mars's 2026-10-27 ~07:26 CDT verdicts.
Every file here carries a `-use-these-new-edit` marker. Old versions are marked
`-DO-NOT-USE` in their original dirs and must not be used.

- **Picked hurt cell** (`hurt-use-these-new-edit/`): FIXED variant — 486 tan
  belly pixels recolored to locked front cell_00 pale light-blue, 0 other
  pixels changed. The LIKENESS variant was NOT picked and is NOT in this package.
- **Cleaned sets** (`A/B/C/D-clean-use-these-new-edit/`): A 8 frames + GIF,
  B 5 + GIF, C-fixed 4 + GIF, D 5 + GIF. Alpha-only cleanup, 184px removed,
  0 leg-gap white px remaining. C ships in FIXED only.
- **Manifest**: `MANIFEST-use-these-new-edit-{STAMP[:8]}.json` resolves every
  file to its hurtfix source with md5. All copies byte-verified.

Local staging only. No PR, no work-clone changes, no game-code changes.
""")

    # ---- final verification ----
    for e in manifest_entries:
        assert os.path.isfile(os.path.join(OUT, e["file"])), f"manifest ref missing: {e['file']}"
    post = {
        "nontpose_files": len(tree_files(NONTPOSE)),
        "hurtdir_files": len(tree_files(HURTDIR)),
        "hurtfix_files": len(tree_files(HURTDIR)) and len(tree_files(HURTFIX)),
    }
    assert post["nontpose_files"] == pre["nontpose_files"] + 1, "non-tpose count changed (note added = +1 only)"
    assert post["hurtdir_files"] == pre["hurtdir_files"] + 1, "hurt dir count changed (note added = +1 only)"
    assert post["hurtfix_files"] == pre["hurtfix_files"] + 1, "hurtfix count changed (note added = +1 only)"
    leftovers = [f for f in tree_files(NONTPOSE)
                 if f.endswith((".png", ".gif")) and "-DO-NOT-USE" not in f
                 and "show-sheet" not in f and "shadowfree" not in f
                 and "pose-audit" not in f and "pose-zoom" not in f
                 and "pivot-attack" not in f]
    assert not leftovers, f"unmarked old set files remain: {leftovers}"
    print(f"VERIFY OK: manifest refs resolve ({len(manifest_entries)}/{len(manifest_entries)}); "
          f"file counts preserved +1 note each dir; 0 unmarked old set files; 0 deletions.")
    print(f"OUT: {OUT}")

if __name__ == "__main__":
    main()
