# #73 — 2D ANIME WEATHER FX → show weather-FX library

**Teardown (public documentation).** Hand-drawn and TV anime weather
is a **banked cycle discipline**, not a particle simulation (the
LIVING-WORLD research already established the layer model from Blair
and the HB/Pokémon BANK economy; this spec applies it to weather
specifically). The documented grammar: (1) **rain** = 2–3 overlay
levels of streak cycles at different speeds/scales (near level fast
and sparse, far level slow and dense), looped on short cycles,
plus a *ground-response* cycle (splash crowns, ripple rings) on the
plate level; slant encodes wind — rain angle is a WIND-STATE readout.
(2) **snow** = drifting flake cycles on 2 levels with phase-offset
loops (prime lengths so the drift never visibly repeats), density as
the only intensity dial. (3) **fog/mist** = held soft plates sliding
at near-zero speed on overlay levels — fog is a *plate*, not a
particle system, in 2D practice. (4) **leaves/petals/debris** =
small-count hero cycles (a handful of drawn paths, banked and
re-timed), never mass simulation — EP01's scripted single leaf is
already this grammar. (5) Every effect is a **level in the xsheet**
with a cycle id, so weather is scheduled like any other cycle
(#16 timing system), and onset/offset are *level fades*, not cuts.
No footage, cycles, or drawings are copied — the library below starts
as named slots with construction rules.

**Native spec — weather FX as LIVING-WORLD ambient cycles.** Each
effect registers in the Ambient Cycle Library with the library's own
id discipline (`AMB-…` class ids) and the C2 prime-length/phase law:

| Slot id | Effect | Levels | Keys off | Construction rule |
|---|---|---|---|---|
| `AMB-WX-RAIN-NEAR` / `-FAR` | rain streaks | 2 overlay | weather=rain (#19), slant = WIND-STATE | streak cycles, 2 lengths, non-commensurate |
| `AMB-WX-SPLASH` | ground response | plate | rain + surface tag on plate | splash/ripple cycles matched to plate's ground material — plate-specific, banked per location |
| `AMB-WX-SNOW-DRIFT` | snow | 2 overlay | weather=snow (area vocab permitting) | prime-length drift cycles; density dial only |
| `AMB-WX-MIST` | fog/mist plates | 1–2 overlay | Forest dread + Garden dawn | held plates, near-zero slide; in the Forest this is *the* weather (see below) |
| `AMB-WX-LEAF` | hero leaf/debris | 1 hero cycle | script only | single drawn path, re-timed per use; never ambient in the Forest depths |
| `AMB-WX-FROST` | frost formation | plate-level art | `frost-trace` state (#19) | frost grows on plate edges as a timed plate variant — pairs the FROST CLOSE-UP COLOUR SHIFT render flag |

**The Forest rule (canon, not style).** In the Dark Forest, weather
FX obey the dread cycle, not the sky: mist is present at surface
states; at STILLED **all cycles stop — including weather** (the
scripted leaf falls straight down because nothing carries it;
LIVING-WORLD's one permitted stillness). A weather library that kept
raining in the STILLED depths would break the show's central horror
device, so the library's Forest entries carry `stilled: HOLD-ALL`
as data, and #67's behaviour table reads the same key.

**Wiring.** State producer: #19 world-state (+ WIND-STATE for slant).
Registry: LIVING-WORLD Ambient Cycle Library (new `AMB-WX-*` family).
Scheduling: #16 xsheet cycle notation (`AMB-… ⟳frames φphase`).
Composite: levels ride the existing Natron/FFmpeg spine
(UNIFIED-PIPELINE) — overlays are separable levels by construction,
never baked into plates (and per the no-baked-shadows family of laws,
never baked into character art either).

**Coverage.** Grammar: fully documented TV/2D practice. Contents:
slot architecture + construction rules complete; **no cycle art
exists yet** — each slot is a build item for the art lane (banked
once, reused forever, per the BANK economy), and which locations get
rain/snow variants beyond the Garden is OPEN (area weather
vocabularies are #19's to grow).
