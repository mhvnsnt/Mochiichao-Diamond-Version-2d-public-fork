# #21 — 2D CAMERA GRAMMAR → show camera system for Tahoma2D

**Teardown (published animation craft; Blair/HB sources in his own
playbook + the repo's ENVIRONMENT-AND-CAMERA.md, which this spec
extends rather than replaces).** Classical 2D camera work is a small
closed vocabulary executed on a field guide: **static** (the default;
limited animation lives here), **pan** (constant-rate travel across a
longer-than-frame background), **truck/track** (pan with parallax
layers separating), **zoom** (field-size change — in cel practice a
camera move, not a lens), **tilt**, and the **multiplane** stack
(FG/MG/BG levels at different pan rates = depth). TV economics added
the discipline: camera moves are rationed, pans reuse one long plate,
and a move is spent only where the story turns.

**Native spec — `mochiichao/camera/v1`** (xsheet camera column is the
record; timing-system teardown already reserves it).

- Move vocabulary as data on every cut: `{type: static|pan|truck|
  zoom_in|zoom_out|tilt|handheld_micro, from_field, to_field, dur_f,
  ease: linear|ease_in|ease_out|held, parallax: [fg,mg,bg rates]}`.
  Field sizes use the house staging ladder (Palm/Knee/Waist/Tower
  from the design-principles work) as named fields, not numbers.
- House rules (each checkable at the board stage):
  1. Static is the default; a move needs a story reason named in the
     board's camera note (rationing law).
  2. Pans travel on living plates only (current-version law — the
     plate registry's marked-current background, never the v1 still).
  3. Parallax rates are ratios of the BG rate (FG 1.6 / MG 1.25 /
     BG 1.0 PROPOSED starting ratios, tune per location) and levels
     must be separate Tahoma2D levels — a flattened plate cannot
     truck; the xsheet flags it.
  4. The Forest rule: inside the Dark Forest the camera does not
     travel — static and held frames only; dread is built from
     stillness + the #19 STILLED state. (EP01 precedent: the camera
     never enters moving; the stinger's power is a locked frame.)
  5. Frost close-ups (#19) are `zoom_in` to Palm field with the
     colour-shift render flag set — the device is a camera entry in
     data, not a post afterthought.
- Tahoma2D execution: camera column entries compile to the scene's
  camera keyframes; `tcomposer` render ranges already come from the
  xsheet header (timing teardown), so camera, cycles and timing ship
  in one document per cut.

**Wiring.** ENVIRONMENT-AND-CAMERA.md remains the design doc; this is
its machine side. LIVING-WORLD cycles declare which levels they ride
(AMB IDs), POSING-SYSTEM staging reads the field ladder, #24's OP
spec spends its move budget from this vocabulary.

**Coverage.** Grammar: standard published craft, high confidence.
Ratios and the field-ladder mapping are house proposals (PROPOSED),
to be proven on the next animated scene; no claim they are final.
