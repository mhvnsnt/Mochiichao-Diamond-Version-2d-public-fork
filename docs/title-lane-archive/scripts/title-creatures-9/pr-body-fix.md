Title creatures white-spot + shadow fix — Mars feedback on PR #51, 2026-10-25

What Mars flagged (20:53–20:55 CDT, on the PR #51 cutouts):
- Sproutle, Dorowani and Gabu have a white spot underneath them.
- Tyrage is the one with the cracks — the green cracks STAY, but the
  white spots between his feet, his lower body and the cracks come out.
- Kittember has a white spot between head and tail, and between
  whiskers and tail.
- Shadows: remove them where clean, leave them where not clean.
- Correction 21:08 CDT: Gabu is FINE, Mars was wrong about that one.
  Gabu is NOT touched in this PR.

What this PR does (5 files, 0 file deletions):
- Sproutle 259x333 (was 261x337): white spot between feet removed,
  baked shadow removed — rembg u2netp (open source, MIT).
- Dorowani 263x398 (was 269x409): white spot between legs removed,
  baked shadow removed — OpenCV GrabCut (open source, Apache-2.0).
  u2netp was tried for her first and REJECTED: it put a black hole
  in her pale belly. GrabCut was clean for her, so GrabCut ships.
- Tyrage 327x305 (was 326x305): white spots between feet / lower
  body / cracks removed, GREEN CRACKS STAY — rembg u2netp.
- Kittember 287x304 (was 289x312): white wedge between head, whiskers
  and tail removed, baked shadow removed — rembg u2netp.
  Known minor model note: two tiny satellite bubbles around the
  tail orb lost their orange fill in the model pass. Main figure,
  head, whiskers, tail and orb are intact.
- src/components/game/TitleCreatureFigure.tsx: size strings updated
  to the new PNG sizes, shadow note updated. No other code change.

Method, no hand-painting:
- Pokemon-first, verified from the decomp files: FireRed draws
  shadow as a SEPARATE 32x8 sprite (gEnemyMonShadow_Gfx from
  graphics/battle_interface/enemy_mon_shadow.4bpp.lz, PALTAG_SHADOW,
  sOamData_EnemyShadow, SetBattlerShadowSpriteCallback in
  battle_gfx_sfx_util.c:935) — character art carries no baked shadow.
  Engine-drawn shadow is a later layer, not claimed here.
- Grey-threshold shadow removal was tried first and REVERTED:
  it ate Kittember body shading (14,280px), Sproutle feet/claws and
  Tyrage claws. That trial was deleted, not shipped.
- The shipped cuts are model segmentation (u2netp / GrabCut) on the
  original Mochiichao sheets only, plus the earlier scripted
  white-spot island removal for verification. No Pokemon creature
  art, no generated likeness, no hand-painted pixels.

Not in this PR:
- Gabu, Mochii (Mars-confirmed), Razorgater, Wispkin, Mythar:
  untouched. Razorgater still carries his sheet shadow.
- Per-creature biome assignment: belongs to the title-backgrounds
  batch, not this one.
- Animation: TitleScene already walks every figure across the
  scene (sine bob + Black 2 camera + FireRed spawners + Ruby shine
  + HeartGold flash + Platinum fades), so no new animation code
  is needed for these 4.

Gates (local, on the verified main tree): lint, build,
validate:reference — results in the lane log. Deletions: NONE.
