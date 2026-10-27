# Fixed-cell sprite contract (Step 6, QA lock) — NEW this pass
Source technique: public sprite-sheet write-ups found this pass (fixed-cell
contract + trimmed-animation jitter). Restated here; no source text, art
or tool code staged.
Contract fields, written down BEFORE export for every action:
- Cell width and height: identical for every frame in the action.
- Reading order: explicit (row-major, column-major, or named frames).
- Pivot meaning: a gameplay point, NOT "center" by default — grounded
  actions use bottom-center / foot-contact; flying body plans use torso
  root; attacks keep the body root stable while the limb extends.
- Baseline: shared for grounded actions.
- Alpha policy: real transparency, never a painted checkerboard.
- Trim metadata: if cells are packed, original size + X/Y offset MUST be
  kept — repacking cannot reconstruct discarded offsets.
- Playback: frame order, duration, loop policy.
Why it matters (measured example from the write-up): four frames in
identical 360x360 cells had visible widths 145–189 px while the lowest
alpha-bound varied by only 1 px — silhouette change is legitimate, root
drift is not. Independently trimming + re-centering those frames would
have invented movement the artist never drew.
Wiring target: Step 6 agent — QA gate checklist: every atlas manifest
carries cell size, pivot (x,y + meaning), trim offset or "untrimmed",
and playback; a manifest missing any field fails lock. This extends the
existing atlas cleanup / spot-check gates, it does not replace them.
