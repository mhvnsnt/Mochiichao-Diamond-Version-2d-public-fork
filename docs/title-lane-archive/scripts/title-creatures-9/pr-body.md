Title creatures 9/10 — clean cutouts + TitleScene wiring

BASE: verified main 680da18 before branching. Local gates on that tree: npm run lint (tsc --noEmit) PASS, npm run build PASS (JS ~1,046 kB, all 10 walk-cutouts in dist), npm run validate:reference PASS (warnings are pre-existing open decisions). Deletions: NONE (9 new PNGs, 1 new component, 3 modified files).

WHAT IS WIRED:
- Clean cutouts for the other 9/10 rotation creatures, in rotation order, each a single walking/standing figure, transparent background, no sheet neighbours, no white box:
  - Mochii (380x380) — the Mars-confirmed cutout, copied as-is, md5-identical to sprite-art/2d-sheets/mochii/mochii-title-cutout-clean.png
  - Razorgater (268x285), Tyrage (326x305), Kittember (289x312), Sproutle (261x337), Dorowani (269x409), Gabu (292x295), Wispkin V1 (288x609), Mythar (434x350)
- New TitleCreatureFigure.tsx: maps each of the 9 names to its cutout and renders TitleScene with it (no fire trail — Yogiferno keeps its own wrapper, PR #33). IntroSequence now renders TitleCreatureFigure for any non-Yogiferno rotation pick, and the featured panel no longer says GAP — it says clean cutout wired (10/10).
- TitleScene.tsx and titleRotation.ts: comment-only updates — the "other 9/10 stay GAP" notes are replaced with the shipped state. No behaviour change in TitleScene itself.

METHOD (scripted, auto, no hand-painting):
Border flood-fill from the crop, white-fringe decontamination, 1px alpha feather, trim to alpha bbox — the same pass Mars confirmed good for Mochii and that produced Yogiferno v2. rembg was NOT used for this batch: its U2-Net model download is ~1.02 GB at ~700 kB/s on this machine (killed at 22% in another lane), so the scripted pass is the auto route that finishes. Earlier v1 cuts with neighbour slivers/grid lines were superseded by v2/v3 cuts (tighter crops, Gabu grid-line inset); only the clean versions are shipped here.

WHAT IS NOT CHANGED / NOT CLAIMED:
- Yogiferno cutout and YogifernoTitleWalk: untouched. Title animation systems (PR #38), fonts, menus, saves, atlases: untouched.
- Wispkin is V1 only (white cracked skull face, black drop body, wisp smoke). Duskfiend is NOT in this pool and no Duskfiend file is shipped.
- Several cutouts still carry the soft ground shadow baked into their sheet cell (Razorgater, Kittember, Dorowani, Sproutle) — that is the sheet's shadow, not a new drawing. A shadow-separate pass (engine-drawn shadow, baked shadow stripped) is a later cleanup, not claimed here.
- Per-creature biome assignment is NOT done here — TitleCreatureFigure leaves TitleScene at its default biome; that assignment belongs to the title-backgrounds batch.
- Pages rebuild + live playtest + animation of these figures like Pokemon title screens: NOT done by this PR — Mars sees the cutouts first, then animation is the next step.
- No Pokemon creature art, logo, name, dialogue, music, or texture is shipped in any of these files.
