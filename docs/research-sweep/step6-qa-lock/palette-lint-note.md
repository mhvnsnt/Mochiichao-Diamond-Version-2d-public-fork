# Palette lint note (Step 6, QA lock) — NEW this pass
Source technique: public pixel-art lint write-up found this pass
(pixelartlint-style config). Technique only; no linter code staged.
Idea: a per-project palette ground truth, enforced automatically instead
of by eye. Config shape (authored here, same fields as the write-up):
- palette colours: the exact allowed RGBA list for a set (per biome or
  per creature family where palettes legitimately differ — a set with a
  unique palette gets its own subfolder + override config, never a global
  exception).
- colour mode: indexed (256-colour) where the lane uses indexed art.
- severity: error (a palette violation fails the gate, it is not a
  warning to scroll past).
Why it fits this lane: the lane already sweeps 1,111 files for white
spots with spot_check; palette lint is the same gate one level up — it
catches a wrong-colour pixel the spot check cannot see, and it catches
it before the PR, not after Mars sees it in game.
Wiring target: Step 6 agent — add a palette-lint pass to the preflight
script set (same --fail-on-flagged contract as spot_check v2). No new
dependency is vendored here; the Step 6 agent picks an implementation
or writes the check in the existing Python tooling.
