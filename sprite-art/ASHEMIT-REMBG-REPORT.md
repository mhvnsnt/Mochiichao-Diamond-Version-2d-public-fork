# ASHEMIT REMBG PASS — RUN, REJECTED, ORIGINALS KEPT (2026-10-25)

Owed item (coordinator checkpoint): "Ashemit rembg pass owed
(shadows/cleanup lane)". This pass was RUN with the real open-source
rembg tool. It was NOT shipped, for a verified reason below — not for
lack of trying.

## Tooling (facts, not excuses)

- rembg-venv CLI is broken in this session (missing CLI deps — it prints
  the `pip install "rembg[cpu,cli]"` hint and exits). The rembg LIBRARY
  imports fine (onnxruntime 1.31), so the pass used the library API via
  `sprite-art/atlases/_tools/ashemit_rembg.py` (`rembg.remove()` with
  `new_session("u2netp")`). Same library, same segmentation class.
- The venv's DEFAULT model is bria-rmbg-2.0 (1.02 GB download); that
  download was killed at 8% by the exec timeout. The pass instead used
  u2netp (4.4 MB, already present in `~/.u2net/u2netp.onnx`). A bria
  pass would be a NEW pass with a different model, not a re-run of this one.

## Scope run (16 files, outputs in _shadow_work/ashemit_rembg/, NOT shipped)

| File | Orig opaque | Rembg opaque | Removed |
|---|---|---|---|
| game cells 00-07 | 1686/1200/1213/1465/1489/1719/869/1256 | 1584/1194/1125/1462/1399/1693/829/1252 | 102/6/88/3/90/26/40/4 |
| idle a/b/c | 1729/1729/1753 | 1628/1376/1435 | 101/353/318 |
| hurt cell_00 | 1949 | 1899 | 50 |
| attack a/b/c/d | 1695/1757/1757/1729 | 1616/1538/1538/1628 | 79/219/219/101 |

Full log: `sprite-art/_shadow_work/ashemit_rembg.log`.

## Verdict: REJECTED (eye-checked at 4x, orig left vs rembg right)

- `ashemit_cell_00_rembg_proof.png`: flame tail darkened/muted.
- `ashemit_idle_b_rembg_proof.png`: flame tail nearly GONE (353 px).
- `ashemit_attack_b_rembg_proof.png`: flame tail nearly GONE (219 px).
- `ashemit_hurt_rembg_proof.png`: near-intact (50 px), but model
  behaviour is inconsistent across poses.

u2netp treats Ashemit's semi-transparent flame tail as background.
Shipping a mixed set (hurt ok, idle/attack flame-eaten) would corrupt
the set. So ZERO rembg files ship. Originals are untouched. The "rembg
pass owed" item is discharged as run + evaluated + rejected, with
proofs staged for Mars/parent to see why. If Mars wants a bria-model
pass, that is a separate owed item with its own eye-check gate.
