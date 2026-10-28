# #79 — FARMING LOOPS → MOCHI FRUIT FARM SYSTEM

**What was studied.** The berry-farming architecture of the
reference games: (1) **plant → grow → harvest cycles** on a plot
grid — a planted item passes through timed growth stages
(sprout → taller → bloom → fruit), stage lengths are per-species
data, and yield at harvest is a range, not a point; (2) **care
inputs during growth** — watering at stages multiplies yield;
mulch-class items modify rate/yield trade-offs; neglect doesn't
kill the plant in later systems, it only shrinks the crop —
farming as a *return-and-tend* loop, not a fail state; (3) **the
loop's economy role** — farmed items feed the healing/status/
crafting systems, so the farm is a *supplier* to other systems,
never a self-contained minigame; (4) placement: farms sit on
routes and at care facilities, tended in passing — the loop is
woven into travel, not teleported to.

**Canon ground.** **Mochi Fruit** is a canon display name (final
spelling: Mochi Fruit, one i — Jamar's spelling ruling
2026-10-27), and a Mochi Fruit farm plot already exists in Region 1
game writing (the R1 dialogue pool carries farm-plot talk). The
Garden is the world's care register and the natural farm home.
This spec gives the farm its system; **which fruits exist is
content, and stays OPEN** — no fruit species, effects or yields
are invented here.

## Native spec: `mochiichao/mochi-fruit-farm/v1`

### Plot model

```json
{
  "plot_id": "<site id + index>",
  "site": "garden | <route site id>",
  "state": "empty | planted | growing | ripe | spent",
  "fruit": "<fruit item id — from the fruit table (OPEN)>",
  "stage": 0,
  "stage_count": "<from fruit data>",
  "planted_at": "<world-clock stamp>",
  "tended": { "waterings": 0, "last_tended": "<stamp>" },
  "yield_pending": null
}
```

- **Stage clock:** growth advances on the world clock (the day/
  night + weather state system, List 3 #19) — a fruit's
  `stage_hours[]` array is its data; weather may pause or hasten a
  stage only where the fruit's data declares a weather affinity
  (field defined; affinities OPEN per fruit).
- **Yield:** `yield = base_range(fruit data) + tend bonus` —
  each growth stage watered at least once adds +1 up to the fruit's
  `yield_max`. No watering → base minimum, never zero, never a dead
  plant (care register: the Garden does not punish).
- **Harvest** returns fruit items to inventory and returns the plot
  to `spent` → `empty` after clearing; replanting is immediate.

### The fruit table (schema only — contents OPEN)

| field | meaning |
|---|---|
| `fruit_id` | item id |
| `display_name` | "Mochi Fruit" family naming — per-fruit names are content decisions |
| `stage_hours[]` | per-stage durations |
| `yield_base` / `yield_max` | harvest range |
| `weather_affinity` | optional; one weather state + direction |
| `effect_ref` | pointer into the item system (List 4 #31) — the farm never defines effects |
| `tree_silhouette` | the ripe-stage visual key (show/Garden art reads this) |

### Where farms live

- **The Garden plot row** — the teaching farm: few plots, tended
  with Mochiko's beats; show episodes can stage a whole growth arc
  here across a season (planted EP-early, ripe at a later beat —
  the farm as a season clock).
- **Route plots** — small plot clusters at route sites, tended in
  passing; site ids come from the Region 1 route graph
  (REGION1-ROUTE-GRAPH) — no new locations are created by this spec.

## Wiring

- **Items (List 4 #31):** fruit are items; `effect_ref` points
  there. The farm defines growth, never effects.
- **Economy (List 3 #20):** fruit yields are an economy *source*;
  sale prices live in the economy spec, not here.
- **World clock (List 3 #19):** stage advancement consumes the
  day/night + weather state machine; the farm owns no clock.
- **Garden systems:** plots are Garden residents like day-care
  residents (#77) and care-loop charges (List 7 #65) — one Garden
  state namespace (`vars.garden_*`, #12 architecture).
- **Show:** the ripe-stage `tree_silhouette` is an environment-art
  key; a ripe tree at the Gate/Garden is a background state, drawn
  from the parts catalog like any environment variant (currency
  law: the ripe variant is a registered version, not a redraw).

## Open slots (not invented)

- The fruit table's contents — every fruit, name, effect and yield.
- Weather affinities per fruit.
- Plot counts per site (Garden row size; route sites beyond the
  farm-plot reference already in R1 writing).
- Whether fruit trees exist as wild encounters (shake-tree style
  gathering) — a spawn-table question (#7), not assumed here.
