# Dorowani rig build v1

Segmentation + pivot proof built from the show bundle transparent master (1600px). Parts (head/torso/base), pivots (neck/hip/root): `rig-build.json`. Proof: `rom-proof-v1.png`.

**Gate status (honest, frame-checked 2026-10-27):**
- Squash (0.88), stretch (1.08), lean (5 deg): clean, silhouette holds.
- Head rotation +/-10 deg around the neck pivot: the pivot works, BUT the proof caught two real findings: (1) a seam gap opens at the neck at extremes - standard fix is an overlap skirt drawn under the head at assembly; (2) the master art has thin white streak elements extending from both fin cheeks (invisible on white in neutral) which sweep across the face when the head rotates - at cleanup they are painted out of the puppet master or split off as separate symbols. This is what the proof stage exists to catch.
- **Not yet a finished puppet:** Graphic-symbol mouth/eye/hand frames + overlap skirt + streak cleanup are authored at Tahoma2D assembly (PIPELINE.md). No animation ships from this rig until the full ROM battery in the rig standard passes.

**Also in the game repo already:** a rigged 3D Dorowani exists at `sprite-art/3d-checkpoint-2026-10-26/rigged/dorowani/` (bake scripts + CHECKPOINT-V2-VERIFICATION.md) - the 2D puppet and the 3D rig share this build's pivot spec.
