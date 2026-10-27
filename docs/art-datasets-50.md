# Art sets + datasets — List 4 (50 items, 2026-10-25)

All art is Mochiichao-original. Reference games are listed only to say
what kind of art/system is meant. No official Pokemon, Digimon, Sonic,
Genshin, Minecraft, or Splatoon art, sprites, music, or code is copied
in. "Trailblazers" is still not resolved to a specific title — item 36
uses it only as "seed/trail world" in the sense Mars described it.
"Genshin Splat" is read as Genshin-style open world + Splatoon-style
colour terrain — if that reading is wrong, Mars corrects it in chat.

Status key: SPEC = specification + manifest entry only, not yet
generated. GEN = to be generated from original Mochiichao art only,
GPU in the Kaggle lane when a dataset is defined. WIRE = manifest
entry in src/lib/art-sets.ts, so game code can reference it by id.

## A. Menu + UI art sets (1–10)

1. Title screen art set — MOCHII STUDIOS / MOCHIICHAO logo, press-key
   screen, Mainframe Region backdrop. SPEC, WIRE: title-screen.
2. Main menu UI set — buttons, panels, cursor, save/load slots,
   options. HeartGold-style clean menu, Mochiichao colours. SPEC.
3. Battle UI set — HP bars, type badges, move buttons, status icons,
   turn order. Pokemon-style battle UI, original layout. SPEC.
4. Roster / party UI set — party slots, Garden stat mini-bars,
   colorway swatch, alignment icon. SPEC.
5. Garden UI set — Mochi Garden panels, Data-Fruit inventory, Critter
   list, Cocoon progress ring. Chao Garden-style, original. SPEC.
6. Map / town UI set — minimap, sector labels, waypoint markers,
   fast-travel list. SPEC.
7. Shop / Market UI set — Silicon Town Market stalls, price tags,
   Data Shard icons. SPEC.
8. Dialogue UI set — Prof. Aeon / Mochiko / Hex dialogue boxes,
   nameplates, choice prompts. SPEC.
9. Settings / accessibility UI set — text size, colour-blind palettes,
   contrast, reduced-motion. SPEC.
10. Icon set — 64 icons: items, shards, berries, balls/rings, badges,
    dojo medals, in one shared palette. SPEC.

## B. Sprite sets — 2D, 2.5D, 3D (11–20)

11. Starter sprite set — Mochii / Razorgater / Tyrage lines, front +
    back, walk + idle, 2.5D style. SPEC, GPU: GEN from original art.
12. Full roster sprite set — all 47 roster creatures, front + back,
    1 base per species + palette/overlay/aura for Garden Forms. SPEC.
13. Garden Form sprite overlays — palette swaps, accessories, auras
    for Bright / Neutral / Umbral. SPEC.
14. Colorway sprite set — rare variant palettes per species, seeded
    from colorwayFor() in mochiichao-systems.ts. SPEC.
15. Parts sprite set — ears, wings, tails, horns, fins, antennae as
    modular overlays, shared palette. SPEC.
16. Trainer / NPC sprite set — Prof. Aeon, Mochiko, Hex, Mom, dojo
    leaders, shopkeepers, 2.5D walk cycles. SPEC.
17. Wild creature 2D sprite set — overworld walk sprites, encounter
    flash, flee animation. SPEC.
18. 3D-style model set — X/Y + 3DS-style 2.5D presentation: larger
    sprites, fake depth scaling, ground shadow, for Creature Mode. SPEC.
19. Battle effect sprite set — move flashes, type sparks, Burst aura,
    Cocoon burst, capture ring glow. SPEC.
20. Egg / Cocoon sprite set — Data Eggs, Data Cocoons Form I / II,
    hatching animation frames. SPEC.

## C. World + environment art sets (21–30)

21. Sector 0 world set — starting town, lab, houses, paths, trees.
    HeartGold-style top-down + 2.5D depth. SPEC.
22. Route world set — Route 1.0 / 4.0, tall grass equivalent, caves
    (Quartz Caverns), water, bridges. SPEC.
23. The Dark Forest set — digital forest, glowing data trees, glitch
    patches. SPEC.
24. Silicon Town set — market, academy, dojo, Mainframe Gardens
    entrances. SPEC.
25. Castagnoli Island set — island, harbour, boss arena. SPEC.
26. Mochi Garden world set — Mainframe Gardens: Hero/Bright garden,
    Neutral garden, Umbral garden, kindergarten, race track. SPEC.
27. Dojo world set — dojo interiors, sparring rings, banners. SPEC.
28. Weather / time set — day/night, rain, data-storm, season tints
    that also drive Garden / evolution timing. SPEC.
29. Interior set — houses, labs, shops, PC / storage equivalent
    (Mochi Vault). SPEC.
30. Boss arena set — Champion Mythar arena, Junk Warlord Krix arena,
    Syndicate / Liberation Front bases. SPEC.

## D. Generative + seeded world systems (31–40)

31. Seed world generator — one seed → whole world layout, like
    Minecraft world seeding. WFC + FastNoiseLite already vendored. SPEC.
32. Minecraft-style voxel / block world set — block terrain, caves,
    ore/data nodes, for a procedural zone. SPEC.
33. Genshin-style open world set — large open zones, climbing,
    gliding, elemental terrain, for Creature Mode open world. SPEC.
34. Splatoon-style colour terrain set — paintable ground, colour
    zones that change Garden stats / movement. SPEC.
35. WFC tile set — Wave Function Collapse tiles for towns, routes,
    gardens (vendored WFC samples/tilesets as reference only). SPEC.
36. Trailblazers-style seed/trail world set — seeded trails, waypoints,
    and exploration routes that regenerate per seed. Title unresolved,
    system only. SPEC.
37. Procedural dungeon set — seeded caves / towers, room + corridor
    generation with rot.js (vendored). SPEC.
38. Procedural creature variation set — seeded parts + colorways +
    type variants, so no two wild creatures look identical. SPEC.
39. Procedural quest / encounter set — seeded trainers, wild
    encounters, and Garden events from the decomp trainer shapes. SPEC.
40. Seeded weather / season set — seed-driven weather and season
    cycles that feed Garden growth and evolution timing. SPEC.

## E. Datasets for training, validation, and testing (41–50)

41. Original sprite dataset — Mochiichao-original sprites only, with
    labels: species, form, colorway, parts, direction. For Kaggle GPU
    training. SPEC, GPU: yes, when defined in the Kaggle lane.
42. Colorway dataset — palette + alignment + Garden stat labels per
    sprite, for colorway generation validation. SPEC, GPU: yes.
43. Parts dataset — modular part overlays with species compatibility
    labels. SPEC, GPU: yes.
44. World tile dataset — original tiles + WFC rules, for seeded
    world generation. SPEC, GPU: no (CPU WFC/FastNoise).
45. Move / battle dataset — moves, learnsets, evolutions from
    decomp JSON (already on main, PR #7/#8) as reference shapes for
    balance testing, not as Mochiichao canon. WIRE: decomp JSON.
46. Garden growth dataset — Garden stats, care, alignment, and
    resulting Form / colorway, for tuning growth curves. SPEC.
47. Capture dataset — Ring Capture loops, breaks, bond, and outcome,
    for tuning capture chance. SPEC.
48. Trade dataset — Mochi Link trades and trade-evolution outcomes,
    for validation. SPEC.
49. Playtest dataset — silent playtest logs: where players get stuck,
    what they miss, balance outliers. SPEC, GPU: no.
50. UI / menu dataset — menu, dialogue, and icon variants with
    accessibility labels, for UI generation and testing. SPEC, GPU: yes.

## Wiring

- Manifest: src/lib/art-sets.ts in the work clone lists all 50 by id,
  category, status, and GPU need. Game code references art by id, never
  by a copied asset path or a PokeAPI URL.
- Next steps in order: (1) roster sprite spec + starter set, (2) Garden
  world + UI sets, (3) seeded world generator with WFC/FastNoiseLite,
  (4) Kaggle GPU training only after an original-art dataset is defined
  in the Kaggle lane. Playable build does not change until a set moves
  from SPEC to generated and is wired into a screen.
