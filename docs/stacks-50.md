# Stacks — List 5 (50 items, 2026-10-25)

Parallel things, horizontally (system layers) and vertically (full
stacks). Everything here is open-source, academic, or public-file
material, or a mod-community tool that is itself open source.
Licence notes say "check" where the licence must be verified before
wiring — do not guess a licence, and do not wire an item whose licence
forbids it.

What is NOT in this list, on purpose: official Pokemon / Digimon /
Sonic / Nintendo art, code, music, or ROM/game files, and purchased
Steam game files. Those are not open or public, and modifying them by
a percentage does not make them Mochiichao's own. The template value
from those games is already captured legally in the decomp reference
JSON (stat/move shapes), the public design research, and the
Mochiichao systems doc — that is the base template we modify to fit
our universe.

## A. Vertical full stacks (1–10)

1. Web stack — React + Vite + TypeScript + PixiJS + Zustand (current
   Mochiichao stack). WIRE: already in repo.
2. Godot stack — Godot engine + GDScript + Godot tilemaps + Godot
   animation, for a future native build. SPEC.
3. Phaser stack — Phaser + TypeScript + Vite, for a 2D web build
   alternative. SPEC.
4. Three.js / WebGL stack — Three.js + WebGL + glTF models, for 2.5D/3D
   presentation. SPEC.
5. Bevy stack — Bevy (Rust) + ECS, for a native 2.5D/3D experiment.
   SPEC.
6. Electron / desktop stack — web build wrapped for desktop, for
   offline play + save files. SPEC.
7. Mobile web stack — touch controls, responsive UI, PWA install,
   for phone play. SPEC.
8. Server stack — Netlify hosting + GitHub Actions-style CI + API
   for Mochi Link (trade validation, no player data sold). SPEC.
9. Data stack — JSON generated data + TypeScript types + validation
   scripts (already: decomp JSON, mochiichao-systems.ts). WIRE.
10. Test stack — Vitest + Playwright + build gate (already in
    pull-list part2). SPEC.

## B. Horizontal system layers (11–20)

11. Data layer — species, moves, learnsets, evolutions, trainers
    (decomp JSON on main). WIRE.
12. Battle layer — turn-based battle, type matrix, stat budget,
    move effects. SPEC, uses mochiichao-systems.ts shapes.
13. Garden layer — Mochi Garden: stats, alignment, Cocoon, breeding,
    farming, races. SPEC, see chao-garden-conversion.md.
14. Capture layer — Ring Capture (Ranger-style) + standard capture,
    catch-rate shapes. SPEC.
15. Trade layer — Mochi Link validation + trade evolution. SPEC.
16. World-gen layer — WFC + FastNoiseLite + rot.js (vendored). WIRE.
17. Audio layer — Tone.js + Web Audio, original music/SFX only.
    SPEC.
18. UI layer — React menus + Pixi canvas + shared palette. SPEC.
19. Save layer — save slots, save-states 1–4, export/import. SPEC.
20. Net layer — Mochi Link peer trade + leaderboard shapes, no
    account data beyond what a trade needs. SPEC.

## C. Creature + human makers (21–30)

21. Blender creature maker — Blender (GPL) for 3D creature models,
    rigs, and renders to 2.5D sprites. SPEC.
22. Blender human maker — Blender + human base meshes (public /
    CC-licenced bases only, check licence per base) for NPCs and
    trainers. SPEC, check licence.
23. MakeHuman human maker — MakeHuman (open source) for parametric
    human models, exported to Blender. SPEC, check licence version.
24. Modular sprite-part maker — shared-palette part system (ears,
    wings, tails, horns) from mochiichao-systems.ts. WIRE.
25. Palette maker — shared ~20-colour palette tool, for cohesion
    across creatures, humans, and world. SPEC.
26. Pixel art maker — LibreSprite (GPL fork) / Krita (GPL) for 2D
    sprites, tiles, and UI. SPEC.
27. 3D-to-2.5D render maker — render 3D models to 2.5D sprite sheets
    with ground shadow and fake depth. SPEC.
28. Animation maker — sprite animation / skeletal animation tools
    in Blender / Godot, for walk, idle, battle, Garden animations. SPEC.
29. Creature variation maker — seeded parts + colorways + type
    variants (art-datasets-50 items 38, 42, 43). SPEC.
30. Human variation maker — seeded NPC faces, clothes, colours,
    and roles (trainer, shopkeeper, dojo leader, gardener). SPEC.

## D. Academic / experimental stacks (31–40)

31. A-Life stack — genetic stat tuning from the start, so Garden
    creatures do not collapse to one type (Chao A-Life lesson). SPEC.
32. Boids / flock stack — flocking critters in gardens and wild
    zones. SPEC.
33. Lenia / continuous cellular automata stack — for living terrain
    / data-field effects. SPEC.
34. ALIEN artificial-life stack — for Garden Critter behaviour.
    SPEC.
35. NEAT / neuroevolution stack — experimental critter AI tuning,
    research only, not shipped balance. SPEC.
36. Procedural animation stack — IK + procedural walk / idle, for
    Creature Mode. SPEC.
37. Procedural quest stack — seeded quests, encounters, and Garden
    events, from trainer shapes. SPEC.
38. Balance-data stack — live balance via playtest metrics (Temtem
    public patch method: rescale when steps are too coarse). SPEC.
39. Silent playtest stack — watch non-expert players, log what they
    miss, cut what they do not understand (Nintendo public method). SPEC.
40. Canon-bible stack — 2–4 page universe rules + contradictions
    log, retrospective canon (Zelda public method), not 100 pages
    pre-launch. SPEC.

## E. Public files + mod community (41–50)

41. pret decomp stack — pokeheartgold, pokefirered, pokebw2
    (already submodules, already extracted). WIRE.
42. Mod-community tool stack, open source only — PPRE, AdvanceMap,
    SkyTemple, Tinke, SDSME, DSDecmp, ndstool (tools/README). WIRE
    where vendored, SPEC where not yet vendored, check licence.
43. OpenGameArt stack — CC-licenced art, check each asset's licence
    before use, no official game art. SPEC, check licence.
44. Kenney assets stack — CC0 public-domain game assets, for
    placeholder UI / tiles until original art replaces them. SPEC.
45. itch.io open assets stack — CC0 / MIT assets only, check each.
    SPEC, check licence.
46. PokeAPI data-shape stack — API data shapes for reference only
    (types, stats, moves), NOT sprites or official art. SPEC.
47. Public-domain music / SFX stack — CC0 music/SFX for placeholder
    audio until original audio is made. SPEC, check licence.
48. Font stack — OFL open fonts for UI / dialogue. SPEC.
49. Docs / wiki stack — public wikis and guides for Chao, Digimon,
    and Pokemon system design (guides, not game files). SPEC.
50. Steam open stack — Steam's free / open-source games and tools
    section ONLY, sign-in + Steam Guard required, and only items
    with an open licence are pulled. Purchased commercial game files
    are NOT pulled. SPEC, sign-in not yet done: no Steam login is
    saved, and no Steam username was supplied, so this item cannot
    start until Mars signs in via the browser secure flow.

## Wiring

- Manifest: src/lib/stacks.ts in the work clone lists all 50 by id,
  layer, status, and licence-check flag.
- Rule adopted from Mars (2026-10-25, as modified to legal material
  only): stop leaving legal stuff out — find a way to use every
  open / public / academic item above, modified to fit the
  Mochiichao universe and world, instead of skipping it. Official
  art / code / ROMs / purchased game files are excluded from that
  rule, because modifying them does not make them proprietary.
- Next in order: vertical web stack (already), horizontal layers
  11–20, creature/human makers 21–30, then academic stacks 31–40.
