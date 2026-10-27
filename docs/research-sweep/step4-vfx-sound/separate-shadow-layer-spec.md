# Shadows as a separate engine layer — spec (Step 4, VFX) — NEW this pass
Standing rule (Mars, 2026-10-25 ~20:12 CDT): shadows are NOT part of
character art. The engine adds shadows as a separate layer. This spec
records HOW, so no future batch re-bakes shadows into art.
- Every character / follower / overworld sprite gets a shadow object that
  is NOT in its PNG: an ellipse (or soft blob) drawn by the engine under
  the character, on its own layer, at the character's ground-contact point.
- The shadow scales with the character's height above ground (higher =
  smaller + fainter) and never with the character's squash/stretch pose.
- Battle arena and overworld use the same shadow object; only its size /
  opacity parameters differ per scene.
- QA consequence: any PNG containing a baked ground blob fails the Step 6
  gate (this is the same rule the spot-check v2 upgrade already enforces:
  ground blobs are cut from art, not kept as design).
- No shadow art is staged in this sweep. Any third-party shadow texture
  found later must be a separate, openly-licensed asset reviewed on its
  own, never a baked-in part of a character sheet.
Wiring target: Step 4 agent (VFX layer) + Step 2 agent (battle arena
rendering) + Step 3 agent (overworld rendering). Owning gate: Step 6.
