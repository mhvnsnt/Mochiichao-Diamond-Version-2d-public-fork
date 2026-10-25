## Open-source / experimental / academic pulls for Mochiichao

Web search only, public sources only. **No official Pokémon, Digimon, or Sonic code, art, music, ROMs, or leaked internal files are included.** Where a licence was not confirmed in search, I flagged it — do not vendor that item until the licence file in its repo is checked.

### Safest first pulls — licence confirmed in search

**1. Boids.jl — MIT**
What it does: Craig Reynolds-style flocking in Julia — separation, alignment, cohesion, with weights for view/repulsion/velocity.
Map to Mochiichao: **Critter behaviour.** Port the three rules (not the Julia code itself) to the web game for Garden Critters and ambient Creature Mode wildlife — flocks/schools that follow, flee, or scatter, with per-flock weights.

**2. nvjob-boids — MIT**
What it does: Unity “pseudo-Boids” — one script driving many flocks of birds, fish, and butterflies, with danger reactions and shader animation.
Map to Mochiichao: **Critter behaviour.** Reference for many simultaneous Garden flocks controlled by one system, plus a danger/flee reaction. Unity-specific, so port the rules to TypeScript/Pixi, don't copy the Unity asset.

**3. fish-schooling-simulation (rsyarsya) — MIT**
What it does: Unity Boids plus stochastic currents, obstacle avoidance, and live metrics: polarization, spread, nearest-neighbour distance, speed.
Map to Mochiichao: **Critter behaviour.** The metrics are the useful pull — use polarization/spread to score Garden races, herding, and Creature Mode swarm encounters, and currents as a Garden habitat modifier.

**4. Godot Engine — MIT**
What it does: Free, MIT-licensed 2D/3D engine with a scene/node system — a character is composed of reusable nodes.
Map to Mochiichao: **Parts.** Not a code pull for a React/Vite web game, but the architectural model for Mochiichao parts: body, ears, wings, tail, aura, and accessories as composable nodes with their own data, so breeding/growth can swap one part without redrawing the whole creature.

**5. EvolvedVirtualCreaturesRepo (Eric Laukien, Sims-inspired) — zlib, per GitPlanet listing — verify in repo before vendoring**
What it does: Block creatures controlled by neural networks in a voxel landscape, using Bullet physics and OpenGL, based on Karl Sims' evolved virtual creatures.
Map to Mochiichao: **Procedural variation + critter behaviour.** The model to copy in original code: genotype = body blocks + neural control, fitness = locomotion/reaching food. Use it as an offline experiment for Creature Mode movement styles, not as in-game art.

**6. Miconi / Channon virtual-creatures model (University of Birmingham) — GPL**
What it does: Academic Sims-style model with standard neural networks, limb dimensions/orientation/joints in the genome, and coevolution (e.g. box-grabbing).
Map to Mochiichao: **Procedural variation + co-evolution.** The genome schema is directly reusable as a design: limb size, angle, joint axis, reflection, plus neuron thresholds. Warning: GPL is copyleft — if its code is actually vendored into a public repo, the GPL terms travel with it. Design-reference use is safer than code vendoring.

### Flagged — do NOT vendor until licence is resolved

**7. ALIEN (chrxh/alien) — LICENCE CONFLICT, flag**
What it does: CUDA artificial-life sim — millions of particles, genomes that mutate and propagate, neural networks driving sensors, muscles, weapons, and constructors, with self-replicating machines.
Map to Mochiichao: **Procedural variation + co-evolution.** The best model found for emergent Garden ecosystems, but search returned both GPLv3 (GitPlanet) and BSD 3-Clause (DeepWiki) for the same project. Do not vendor until the repo's LICENSE file is read.

**8. Lenia (Bert Chan) — licence NOT confirmed in search, flag**
What it does: Continuous cellular-automata “mathematical life forms” — kernels and growth functions that evolve stable, moving, self-organising patterns; 500+ specimens, parameters μ, σ, β.
Map to Mochiichao: **Procedural variation.** Use the *idea* — kernel + growth function = a creature's growth/mutation signature — for Garden background critters and Data-Fruit patterns. Do not copy its code until its GitHub licence is confirmed.

**9. Framsticks (Komosinski / Ulatowski) — NOT open-source, study only**
What it does: 3D freeware A-Life simulator — bodies from sticks, hinges, muscles, receptors, plus neural “brains”; directed, open-ended, and spontaneous evolution; gene pools can be exported.
Map to Mochiichao: **Garden growth + co-evolution.** The strongest published reference for genotype → body + brain, and for letting a population evolve against a fitness landscape. Because later sources describe it as a proprietary platform with a “full” licence for exports, do **not** pull its code — use it only as a design reference for Mochiichao's growth/evolution data model.

**10. Simsulator (Finn et al., Artificial Life 2026) — licence NOT confirmed in search, flag**
What it does: Open-source Unity/DOTS platform for Sims-style evolved virtual creatures, claiming 10–40× speedup over legacy implementations and populations of 10,000+, with genotype editing and headless batch mode.
Map to Mochiichao: **Procedural variation.** The scale model for offline Creature Mode experiments — evolve thousands of movement/body variants, then import only the winning parameters into Mochiichao. Do not vendor until its licence is confirmed.

**11. Genesis — Godot evolution simulator (BUKKBEEK) — licence NOT confirmed in search, flag**
What it does: Real-time Godot sim where digital organisms compete for food, reproduce, pass traits to offspring with mutations, and shift in prevalence under natural selection (recommended under ~500 units for performance).
Map to Mochiichao: **Garden growth + breeding.** The closest simple model for Mochiichao breeding: trait inheritance + mutation + selection pressure in a Garden, rather than fixed evolution tables. Verify its repo licence before reusing code.

**12. Bunbons (Kazooo100) — CC BY-NC-SA 4.0**
What it does: A p5.js virtual-pet game about raising bunny-like creatures in space, with background art and music credited under CC licences.
Map to Mochiichao: **Garden growth.** Design reference only for raising loops, moods, and space/Garden presentation. The **NonCommercial** term bars use in a game that may later be sold — do not vendor its code or art into Mochiichao if selling is ever on the table.

**13. Swatchsmith (Lospec) — tool licence NOT confirmed, flag — use as workflow, not code**
What it does: Single-file offline HTML tool that batch-recolours PNG sprite folders: lists every colour, locks colours, shifts hue/saturation/brightness, maps by brightness or nearest colour, paints region masks so a colour changes only inside/outside a region, and exports a ZIP with recoloured PNGs, palettes, and a palette lookup texture with Godot 4 / GLSL shaders.
Map to Mochiichao: **Colorway.** This is the direct template for Mochiichao's colour system: one base sprite + a palette-mapping JSON + region masks = Bright / Neutral / Umbral, element, and seasonal colorways without repainting frames. Build Mochiichao's own mapping in that format; do not redistribute Swatchsmith itself until its licence is checked.

**14. anyCreature (Ariescar) — licence NOT confirmed in search, flag**
What it does: A JSON-spec creature engine — one spec in, one skinned GLB out, with a parts manifest embedded in the GLB and a tool to graft parts between creatures.
Map to Mochiichao: **Parts + procedural variation.** The spec format is the model to copy for Mochiichao's own 2.5D manifest: species base + part list + colour ramp + rig/animation claims, with part-grafting as the breeding/growth mechanic. Verify its licence before using its engine code.

### Bottom line for the parent

- **Pull first, after a licence-file check:** Boids rules, fish-schooling metrics, Godot's node/part composition, and the Sims-style genotype schema.
- **Design-reference only, do not vendor code/art:** Framsticks, Lenia (until licence confirmed), Bunbons (NC term).
- **Blocked on a licence check:** ALIEN (conflicting GPLv3 vs BSD 3-Clause), Simsulator, Genesis, Swatchsmith, anyCreature.
- **Nothing in this list is official Pokémon, Digimon, or Sonic material, and nothing came from a leak.**
