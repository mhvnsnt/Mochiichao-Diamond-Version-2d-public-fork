# Wireable playable pass — STAGED ONLY

No PR, no merge, no game-file edits, no edits under the fresh-start
game tree, no edits to `stage2-pr/`, no edits to `wiring/` or any
`batch-*` directory. Everything in this folder is staging for a
future PR. Stage 2-display (PR #240) is display-only; this pass is
the playable split: what can be staged now from real source values
alone, and what is blocked on a Mars decision.

Sources for every row below (read, not re-extracted):
- `all-sources-wiring/battle/battle-core-mapping-20261026.md`
  (battle 22 NEED rows)
- `all-sources-wiring/menus-bag-shop-pc-save/mapping-menus-bag-shop-pc-save.md`
  (menus 77 NEED rows)
- `all-sources-wiring/overworld/overworld-crossgen-mapping.md`
  (overworld 63 NEED rows)
- `all-sources-wiring/data-systems/data-systems-mapping-20261026.md`
  (data 20 NEED items)
- `wiring/black2-wiring-map-whole-game.md` (whole-game owed
  mappings 1–26, Black 2-specific; NOT added to the 182-row
  denominator — see §5, overlaps are named there)
- Batches A–H staged JSONs (counts re-checked by
  `validate-playable.py`; see §6)

## Definitions (strict)

- WIREABLE NOW (W) = the whole row can be staged as a snippet
  from real source values alone, with no Mars decision, no
  roster/map assignment, and no original art/audio/dialogue.
  A W row's snippet lives in `playable-wiring.ts`.
- BLOCKED ON MARS (B) = the row cannot be completed without a
  decision only Mars can make (canonical generation choice,
  assignment, original-content ruling, or a value only Mars
  sets). The exact decision is named per row; nothing is
  invented. A B row may still have a wireable *sub-part*
  (e.g. a per-generation lookup table where the canonical
  choice is blocked) — sub-parts are staged and flagged
  "partial", and the row still counts as B, so the % below
  is conservative, never inflated.
- HAVE in the source mappings means a replacement already
  exists in the game; HAVE rows are NOT in the 182 NEED rows
  and are not re-counted here.
- "Playable" here means staged playable logic (formulas,
  orders, state machines, lookup structures). It does NOT mean
  wired into a game view — call-site wiring into game files
  is 0% for every new item in this pass (staged only).

## Summary counts

| Universe | WIREABLE NOW | BLOCKED ON MARS | Total |
|---|---:|---:|---:|
| Battle NEED rows | 20 | 2 | 22 |
| Menus NEED rows | 67 | 10 | 77 |
| Overworld NEED rows | 57 | 6 | 63 |
| Data NEED items | 12 | 8 | 20 |
| **All-sources NEED total** | **156** | **26** | **182** |
| **All-sources %** | **85.7%** | **14.3%** | 100% |
| Whole-game owed mappings (§5, separate, overlapping) | 5 | 21 | 26 |
| Whole-game new-category call sites | 0% (0/28 categories: 9 field + 16 src + 3 graphics/sound/text) | — | — |

So: 156/182 = 85.7% of the all-sources NEED rows can be staged
now without a Mars decision; 26/182 = 14.3% are blocked on one.
No row is counted in both buckets.

## 1. Battle — W 20/22, B 2/22

Snippet pointer: `playable-wiring.ts` §B (battle) unless noted.
Battle rows are diffs/additions against the live resolver, never
a proposal to replace it (per the battle mapping §0).

| Row | Source element | Status | Reason / decision |
|---|---|---|---|
| B1 | Init / state-machine chain | W | State order only; no values needed |
| B2 | Intro / send-out sequence | W | Sequence order only |
| B3 | Action selection order (action -> move -> target -> party/bag) | W | Order only; layout choice (grid vs corners) is a separate Mars decision, flagged, not decided |
| B5 | End-turn sequence order | W | ENDTURN tracker order from source |
| B7 | Physical / special category rule | B | Mars decision: canonical confirmation (per-move category vs generation rule) |
| B12 | Random damage roll 85–100 | W | Source formula 100 − (rand % 16); diff-verify vs resolver flagged, not a Mars decision |
| B13 | Speed modifiers incl. badge boost | B | Mars decision: badge-boost counterpart (drop or progression-bonus map). Speed modifiers themselves are staged as a partial sub-part |
| B14 | Stat stages −6..+6 ratio table | W | Source ratios, all 13 values |
| B15 | Primary statuses, bit layout + end-turn fractions | W | Source fractions (poison 1/8, toxic 1/16 × counter, burn 1/8, etc.) |
| B16 | Volatile statuses | W | Source list + order (confusion self-hit, flinch, substitute, protect, etc.) |
| B17 | Multi-hit distribution | W | Source distribution 35/35/15/15; diff-verify vs resolver flagged |
| B18 | Charge / two-turn moves | W | State machine (charge flag + semi-invulnerable flags) |
| B19 | Recoil moves | W | Rule: fraction of damage dealt, or on miss; fraction is a parameter, not invented |
| B20 | Trapping / wrap family | W | Multi-turn 1/16 end-turn damage, escape ends it |
| B21 | Protect / endure / substitute / 1-HP floor | W | Guard layer order in accuracy + damage steps |
| B22 | Weather + field (screens, spread, weather multipliers) | W | Source order + multipliers (rain/sun ×1.5, halving rules, doubles 2/3) |
| B23 | Healthbox + HP bar offsets | W | Bar follows box at +16 / +8 offsets |
| B24 | Opponent-direction vectors | W | Single + doubles anchors, left + down for opponent attacks (see §B24 in the TS file) |
| B25 | Opponent-direction archetypes (mechanisms) | W | Code mechanisms (lunge, projectile, beam, burst, self, ground, spread, indicator). Per-move body-part rig points are NOT in code — owed work for the combat/VFX coordinator, flagged, not a Mars row, not invented |
| B26 | Battle windows, full-screen order | W | Window order; dedicated full screens, no overlays |
| B27 | Party / switch / faint outcomes | W | Forced-switch flow before next action selection |
| B28 | Capture / run / flee rules | W | Precedence: run first alone; capture-park actions as their own table |

## 2. Menus / bag / shop / PC / save — W 67/77, B 10/77

### A. Field menu — W 8/9, B 1/9

| Row | Source element | Status | Reason / decision |
|---|---|---|---|
| A1 | Index entry (shown only once the index exists) | W | Conditional-row rule |
| A2 | Party entry | W | Routing to the roster screen |
| A3 | Bag entry | W | Routing to the bag screen |
| A4 | Player / trainer-card entry | W | Routing; the card screens themselves are §I (work, not Mars) |
| A5 | Save entry | W | Routing to the save dialog (§H) |
| A6 | Options entry | W | Routing to options (§C) |
| A7 | Exit entry | W | Close-and-return rule |
| A8 | Retire entry, special-zone context only | W | Context rule |
| A9 | Link-player entry, link context only | B | Mars/lane decision: link play is a later lane; row depends on it |

### B. Title-adjacent main menu — W 5/5, B 0/5

B1 New Game, B2 Continue, B3 Gift window (only when a gift
exists), B4 Error window, B5 Continue summary (player, location,
time) — all W: window set chosen by save state, cursor + confirm
rules, no Mars decision.

### C. Options — W 6/7, B 1/7

| Row | Source element | Status | Reason / decision |
|---|---|---|---|
| C1 | Text speed: 3 values | W | Value count from source |
| C2 | Battle scene: 2 values (on/off) | W | Value count |
| C3 | Battle style: 2 values (shift/set) | W | Value count |
| C4 | Sound: 2 values (mono/stereo) | W | Value count |
| C5 | Button mode: 3 values | W | Value count |
| C6 | Frame type: 10 values | B | Mars decision: frame art for the 10 types is original art, owed |
| C7 | Cancel row (0 values, closes) | W | Close rule |

### D. Bag — W 12/15, B 3/15

| Row | Source element | Status | Reason / decision |
|---|---|---|---|
| D1 | FireRed 5-pocket structure + 186 slots | B | Mars decision: canonical pocket generation (see D2/D3, one decision) |
| D2 | HeartGold 8-pocket structure + 486 slots | B | Same canonical-pocket decision as D1 |
| D3 | Black 2 5-pocket + Free Space, 614 slots | B | Same canonical-pocket decision as D1 |
| D4 | Stack caps per generation (999 / 99 / 1) | W | Per-generation lookup staged; canonical choice (above) picks which row applies |
| D5 | Cursor + scroll remembered per pocket | W | Per-pocket state shape |
| D6 | Field context | W | Context-action set, field variant |
| D7 | Party-give context | W | Context-action set |
| D8 | Shop-sell context (bag reused inside shop) | W | Context-action set |
| D9 | Item-terminal deposit context | W | Context-action set |
| D10 | Box-give context | W | Context-action set |
| D11 | Battle context (battle pocket filter) | W | Filter rule |
| D12 | Use action | W | Action structure; item-function dispatch is a data item (§4 DS8, W) |
| D13 | Toss action + how-many quantity | W | Quantity selector structure |
| D14 | Register action (field use) | W | Register rule |
| D15 | Give action (held item) | W | Held-item slot assignment structure; held-item save field is work, flagged |

### E. Shop — W 7/8, B 1/8

| Row | Source element | Status | Reason / decision |
|---|---|---|---|
| E8 | How-many quantity selector (buy + sell) | W | Quantity selector structure |
| E9 | Bag-full block on Buy | W | Block rule (needs a pocket-cap value — parameter, canonical choice above) |
| E10 | Transaction record + shop stat | W | Record shape |
| E11 | Move-machine shop type | W | Shop-type list entry |
| E12 | Decor shop types | W | Shop-type list entries |
| E13 | Seal / prize / data-card shop types | W | Shop-type list entries |
| E14 | Badge-growing stock | B | Mars decision: badge/progression mapping that grows stock — no Mochiichao counterpart confirmed |
| E15 | Battle-point / move-tutor shop types | W | Shop-type list entries; tutor move list is work from tutor data |

### F. Creature storage — W 6/9, B 3/9

| Row | Source element | Status | Reason / decision |
|---|---|---|---|
| F1 | Withdraw / Deposit / Move / Move Items / Exit main menu | W | Menu order + description lines |
| F9 | Move creatures within/across boxes (grab/place, multi-move) | W | Grab/place state machine |
| F10 | Box rename + wallpaper | B | Mars/art decision: wallpaper art is original art, owed (rename alone is staged as a partial sub-part) |
| F11 | Move Items mode (held items) | W | Mode structure |
| F12 | Release + egg block | B | Mars decision: whether Release is offered at all (game already states it is deliberately not offered) |
| F13 | Deposit-which-box prompt | W | Prompt structure |
| F14 | Deposit last-member block / empty-party guard | W | Guard rule (party size 6) |
| F15 | Summary view from a box slot | W | View routing |
| F16 | Box count: 14 / 18 / 24-unlocked | B | Mars decision: canonical box count |

### G. Item storage / mailbox / terminals — W 8/8, B 0/8

G1 Player terminal top menu (3 rows), G2 Item terminal
withdraw, G3 Item terminal deposit, G4 Item terminal cap 30,
G5 Withdraw how-many, G6 Mailbox read / move-to-bag / delete,
G7 Turn Off / exit, G8 Professor + hall-of-fame terminals —
all W: menu structures, caps, and action rules from source.

### H. Save / load — W 10/11, B 1/11

| Row | Source element | Status | Reason / decision |
|---|---|---|---|
| H4 | Block 1 field set | W | Field list (party, money, bag, flags, vars, stats, daycare, mail) |
| H5 | Block 2 field set | W | Field list (options, play time, trainer info) |
| H6 | Storage block separate from block 1/2 | W | Block split |
| H7 | 2 slots × 14 sectors, 3968 + 128 layout | B | Mars decision: save-shape medium (block-shaped vs sector-shaped payload) |
| H8 | Signature + checksum + counter per sector | W | Integrity shape (signature constant carried as a numeric value) |
| H9 | Rotating write start + damaged-sector skip + last-good restore | W | Write/recovery rules |
| H10 | Newest-valid-slot pick on load, backup fallback | W | Pick rule |
| H11 | Save dialog: ask -> Yes/No -> saving -> saved | W | Dialog steps |
| H12 | Save error full screen | W | Screen routing |
| H13 | Clear-save-data full screen | W | Screen routing |
| H14 | Delete-save screen | W | Screen routing |

### I. Trainer card — W 5/5, B 0/5

I1 Player name + id line, I2 Money line, I3 Badge count line,
I4 Play time line, I5 Party icons row — all W: display fields.
Badge *boost* is a separate battle Mars decision (B13); the
card line itself is only a count display.

## 3. Overworld — W 57/63, B 6/63

### Movement / field flow — W 13/13

1.5 Walk speeds (slow / normal / fast / faster), 1.6 Run +
run-slow states, 1.7 Bike state + camera pan-back flag, 1.8 Surf
state on water tiles (gated by the field-move requirement table,
already HAVE), 1.9 Water-current glide / ride, 1.10 Ledge jump,
1.11 Grid player vs no-grid player (two controller modes),
1.12 Field flow order (load map -> fade -> overworld loop ->
warp-out / warp-in), 1.13 Object-event / NPC movement types +
tracking-by-camera flag, 1.14 Field-move gating at the tile,
1.15 Step counters (repel steps, encounter-rate buff steps),
1.16 Terrain check before any encounter roll, 1.17 Warp kinds
(fixed, dynamic, escape, dive/hole, heal-location) — all W:
states, orders, and gating rules from source, no Mars decision.

### Encounters — W 15/16, B 1/16

| Row | Source element | Status | Reason / decision |
|---|---|---|---|
| 2.3 | FireRed rate test (0–1600 scale) | W | Formula: rate × 16, failed-roll buff + rate × 16 / 200, roll random % 1600 < rate, clamp at max |
| 2.4 | FireRed slot tables | W | Land 12 [20,20,10,10,10,10,5,5,4,4,1,1]; water/rock 5 [60,30,5,4,1]; fishing 10 [70,30,60,20,20,40,40,15,4,1] |
| 2.5 | FireRed rate modifiers | W | Item +50% / −50%, held-item modifier, lead-ability halving/doubling, repel suppression + step counter |
| 2.6 | HeartGold two-stage roll | W | Base 40; −20 walking; +40 very-tall grass; +30 cycling; step boost 0/30/40/60 at 0/2/3/4+ steps; audio modifier +25 / −25; clamp 100; second roll vs table rate |
| 2.7 | HeartGold land slot roll (12) | W | Same cumulative % as 2.4 land |
| 2.8 | HeartGold surf slot roll (5) | W | [60,30,5,4,1] |
| 2.9 | HeartGold fishing slot roll (5 per rod) | W | [40,30,15,10,5] |
| 2.10 | HeartGold rock-smash (2) + headbutt (6) | W | [80,20]; [50,15,15,10,5,5] |
| 2.11 | HeartGold time-of-day slot sets | W | One level list shared across morning / day / night sets; night-fishing swap for 2 rod tiers |
| 2.12 | HeartGold encounter data struct | W | 6 table rates + land/surf/rock/fishing slots + swarm + night-fishing slots |
| 2.13 | Black 2 encounter data struct | W | 7 terrain rates + flags + fishing-enable + slots grass 12 / dark grass 12 / shaking grass 12 / surf 5 / rare surf 5 / fishing 5 / rare fishing 5 |
| 2.14 | Black 2 climbing rate (12 configs) | W | {increase, threshold, max, steps} configs, block + step counters, roll gated by steps, random(100) <= rate, clamp 100 |
| 2.15 | Black 2 phenomena spots | W | Shaking-grass / dust-cloud / rippling-water / flying-shadow spots + steps-since-phenomenon counter |
| 2.16 | Crystal slot probabilities | W | Grass 7 [30,30,20,10,5,4,1]; water 3 [60,30,10] |
| 2.17 | Rod tiers + contexts | W | 3 rod tiers; special-area, contest, swarm contexts |
| 2.18 | Encounter-set -> map assignment + roster mapping | B | Mars decision: which staged set (Black 2 135 sets / 7,136 slots; FireRed 264 headers) goes on which Mochiichao map, and which roster slot each staged slot maps to |

### Weather — W 8/9, B 1/9

3.3 FireRed weather state machine, 3.4 FireRed weather ID set
(codes 0–15 + 20/21; sprite counts rain 24, clouds 3, fog 20,
ash 20, sandstorm 20 + swirl 5), 3.5 HeartGold ID set (0–13 +
date-gated override), 3.6 HeartGold weather runtime / particle
system (state stub; the field-system manager is an opaque
pointer in the code read — flagged, not invented), 3.7 Platinum
ID set (0–16 + 23/26–30 + yearly range of 5 from base 32 +
1001/1002), 3.8 Black 2 weather system (15 overlays; two-task
transitions sequential vs crossfade), 3.9 Black 2 zone-weather
precedence order (forced -> linked-game forest -> event-flag ->
birthday -> seasonal-calendar -> zone default; numeric codes
only), 3.10 Field-weather -> battle-weather conversion — all W.
3.11 Weather-code -> Mochiichao-state mapping — B (Mars
decision: what each numeric code means in Mochiichao states).

### Camera / projection — W 4/5, B 1/5

4.2 FireRed field camera (callback, pixel offsets, pan-ahead,
bike pan-back, tilemap scroll), 4.3 HeartGold camera (perspective
vs orthographic, field-of-view, aspect, near/far, look-at,
distance + angle, history buffer, translation-path interpolation),
4.4 Black 2 field camera (defaults, rect/circle boundaries,
entrance camera, event-camera animation, zoom task), 4.6 Black 2
zone camera-bound field (default 65535) + HeartGold 6-bit camera
type + Platinum camera-type byte — all W. 4.5 Black 2 zone
projection values (0 in 441/615 zones, 1 in 174/615) + camera
values (0 in 538/615, 30+ others) — B (Mars decision: what each
value means for Mochiichao camera/projection, per map).

### Lighting — W 4/5, B 1/5

5.3 Black 2 lighting-period lookup (210 sets, 15 periods, 4
lights per period; per period end hour/minutes + per-light
enabled/colour/direction + diffuse / ambient / specular /
emission / fog / clear triples), 5.4 Black 2 field-light runtime
(max 16 entries, picked by day-seconds, end second adjusted by
season, colour + direction interpolation, flash state), 5.6
HeartGold area-light manager + brightness transitions, 5.7
FireRed global tint mode + weather gamma application — all W.
5.5 Lighting-set -> location/time assignment — B (Mars
decision: which of the 210 staged sets belongs to which
Mochiichao location/time; staged zones carry no lighting link).

### Zones / map types — W 7/8, B 1/8

6.3 FireRed map header (layout, events, scripts, connections,
music, layout ID, region-map section ID, cave flag, weather,
map type, biking, escape/running/show-name flags, floor number,
battle type), 6.4 FireRed map types numeric 0–9, 6.5 HeartGold
map header, 6.6 HeartGold map types, 6.7 Platinum map header,
6.8 Black 2 zone header (615 zones, 14 kept fields; map-type
values 28 distinct; battle backgrounds 18 distinct), 6.10
Cross-generation matrix/layout layer (structure from batch E:
areas, matrices, scripts, events, actors, props, maps) — all W.
6.9 Zone -> Mochiichao-map assignment — B (Mars decision:
anonymous zone_000–zone_614 + 264 FireRed headers + 143
HeartGold table entries, no automatic link exists).

### Day / night / seasons — W 6/7, B 1/7

7.2 HeartGold RTC periods by hour (late 0–3, morning 4–9, day
10–16, evening 17–18, night 19–23; wild-encounter mapping
morning / day / night), 7.3 Day/night music split (per-map
day + night music fields; music itself is original work,
fields are W), 7.4 Crystal/Gold RTC (time-of-day palettes +
daily timers; palette step structure W), 7.5 Black 2 event-time
+ playtime (day, period, month, weekday, hour, minute, midnight
check; playtime h/m/s + last-saved date/time), 7.6 Black 2
seasons (season = (month − 1) % 4; spring / summer / autumn /
winter; next / previous; force-season-sync flag), 7.7 Seasonal
encounters (13 seasonal sets × 4 blocks + seasonal light-end
adjustment) — all W. 7.8 Season clock source — B (Mars
decision: real device clock vs in-game clock).

## 4. Data systems — W 12/20, B 8/20

| Row | Source element | Status | Reason / decision |
|---|---|---|---|
| DS1 | Species conversion table (decomp slot -> roster slot) | B | Mars decision: which decomp slot maps to which original creature (47 roster slots; 12 in species.ts) |
| DS2 | FireRed species JSON field-completeness pass (13 present vs ~22 in source) | W | Work pass from source files on disk |
| DS3 | HeartGold moves JSON | W | Extraction work from files on disk |
| DS4 | HeartGold learnsets JSON | W | Extraction work from files on disk |
| DS5 | Move effect dispatch module (EFFECT_* -> script) | W | Dispatch structure from source effect tables |
| DS6 | Ability effect dispatch module | W | Dispatch structure (per-ability branches in battle code) |
| DS7 | Mochiichao item catalogue display text | B | Mars decision: original descriptions for non-Mochiichao items (639 stage-1 items) |
| DS8 | Item field/battle function dispatch module | W | Function-ID dispatch (field_func / battle_func), no text |
| DS9 | Mochiichao nature assignments | B | Mars decision: which original creature / name gets which nature slot (table itself is W, see TS) |
| DS10 | True Elements lock inputs: Deep + new-element matchup values | B | Mars decision: matchup values for Deep + new elements (list locked at 19; values owed) |
| DS11 | True chart wiring (battle code -> True chart) | B | Blocked on DS10: chart switch is staged as a flagged stub only until Deep rows exist |
| DS12 | Unified learnset loader (TM resolution + tutor union) | W | Loader structure (4 channels, TM-code -> move map per generation). Tutor union mode is a parameter, flagged, not silently decided |
| DS13 | Evolution field widened to list + trigger module | W | Triple shape {method, param, target-slot} + level/item triggers. Trade/friendship equivalents are a blocked sub-item (see §7), not a row |
| DS14 | Black 2 generated-trainer backfill (ai_flags / items / heals / money / reward) | W | Fields exist in source files, missing in generated JSON — passthrough work |
| DS15 | Class / role rename table | B | Mars decision: Mochiichao role per source class |
| DS16 | Trainer personal-name swap table | B | Mars decision: Mochiichao character per source trainer |
| DS17 | Facility set counts verify (1,285 + 6,000 brief-claimed) | W | Verification work against batch C data |
| DS18 | Facility level rules | B | Mars decision: facility opponent level rule |
| DS19 | Black 2 facility trainer extraction | W | Consolidation/verification pass (batch C already staged facilities; overlap flagged, not double-counted) |
| DS20 | Deduped cross-gen class table + AI vocabulary unification + AI scoring module | W | Work: 3 sub-items (class table, AI vocab, scoring module). Raw class keys exceed 237 before dedup, so the 237 figure is flagged owed-verify, not claimed |

## 5. Whole-game owed mappings (separate universe, overlapping) — W 5/26, B 21/26

These 26 are the Black 2 whole-game map's owed list. They are
NOT added to the 182 denominator: several repeat an all-sources
row at Black 2 depth (e.g. WG4 repeats overworld 6.9/5.5/2.18).
Counts here are for the whole-game list alone.

| # | Owed mapping | Status | Reason |
|---|---|---|---|
| WG1 | Item descriptions, original, 639 items | B | Same Mars decision as DS7 |
| WG2 | Nature modifiers: table vs display-only | B | Mars decision (table structure itself is W in the TS file) |
| WG3 | Type -> True Elements mapping (17 -> 12 in stage-1 wording; 19 locked in data mapping) | B | Same Mars decision family as DS10/DS11 |
| WG4 | Zone / lighting / encounter / field-map assignments (incl. areas 0/409, matrices 0/416, events 0/615, maps 0/1,065) | B | Mars decisions: overworld 6.9, 5.5, 2.18 |
| WG5 | Facility level rules + venue mapping | B | Same as DS18 + venue decision |
| WG6 | Place-name mapping 0/154 | B | Original place names are original work, owed |
| WG7 | Script-flag mapping (59 flag + 2 work constants, 209 occurrences) | B | Mars decision: Mochiichao flag meaning per anonymous ref |
| WG8 | Warp-zone mapping (497 zone refs, 1,089 warps) | B | Mars decision: destination per anonymous zone ref |
| WG9 | Script trainer/trade refs (167 trainer, 7 trade) | B | Mars decision: target per ref |
| WG10 | Actor-model mapping (90 codes, 1,693 placements) | B | Mars decision: actor per anonymous model ref |
| WG11 | Matrix-model mapping (969 model constants, 2,347 cells) | B | Mars decision: model per anonymous index |
| WG12 | Prop resource mapping (459 resource ids, 6,331 records) | B | Mars decision: prop per resource id |
| WG13 | Trade roster mapping (23 offered + 8 wanted, 31 records) + trade view | B | Mapping is Mars; the trade view itself is work, flagged |
| WG14 | Palette / art replacement (palette colour values 0%; 3D interiors 590; opaque binaries 137; tilemap exceptions 16) | B | Original art owed, not a source value |
| WG15 | Sound replacement (all slots; no usable-audio split claimed) | B | Original audio owed, not a source value |
| WG16 | System-core sub-split (671-file remainder bucket by directory) | W | Work: directory classifier, no Mars input needed |
| WG17 | Season-to-form mapping | B | Mars decision: which form per season |
| WG18 | Weather durations + stat/accuracy effects + weather-code interpretation | B | Same Mars decision as overworld 3.11 |
| WG19 | Save block sizes, formats, checksums | W | Structure from batch F (medium decision itself is menus H7, B) |
| WG20 | Battle damage/accuracy formula constants as Mochiichao-original values | B | Mars decision: original values, not copied constants |
| WG21 | Shop stock lists + prices, Mochiichao-original catalogue | B | Mars decision: original catalogue |
| WG22 | Box counts, box sizes, deposit/withdraw rules | B | Box count canonical is Mars (menus F16); sizes/rules staged as partials |
| WG23 | Party slot layout, cursor behaviour, switch rules | W | Layout/state rules from source |
| WG24 | Camera positions, zoom values, follow rules | W | Structure from batch F + overworld §4 |
| WG25 | Movement speed, grid size, encounter rates for field movement | W | Covered by overworld §§1–2 snippets |
| WG26 | Dialogue content (46,553 message slots' worth of structure) | B | Original writing owed, not a source value |

Whole-game new-category call sites: field 9/9, src 16/16,
graphics/sound/text 3/3 — all 0% in-game (28/28 categories
staged only). Lookup structures for all 28 are staged in the
TS file (§F), but a lookup is not a call site.

## 6. Mars decision register (distinct decisions behind the 26 blocked rows)

Blocked rows group into these decisions (a decision may block
several rows; the row count stays 26, the decision count is
smaller — do not conflate them):

1. Physical/special canonical confirmation — B7
2. Badge-boost counterpart (drop or progression-bonus map) — B13
3. Link-player row / link play — A9
4. Options frame art (10 types) — C6
5. Bag pocket canonical generation (FR 5 / HG 8 / BW2 5+Free) — D1, D2, D3
6. Badge-growing stock progression mapping — E14
7. Storage wallpaper art — F10 (partial: rename staged)
8. Release offered + guards — F12
9. Box count canonical (14 / 18 / 24-unlocked) — F16, WG22
10. Save-shape medium (block vs sector payload) — H7
11. Encounter-set -> map + roster mapping — 2.18, WG4 (part)
12. Weather-code -> state mapping — 3.11, WG18
13. Projection / camera value meanings — 4.5
14. Lighting-set -> location/time assignment — 5.5, WG4 (part)
15. Zone / field-map assignment (zones, areas, matrices, events, maps) — 6.9, WG4 (part), WG7–WG12 (refs under this family are separate decisions below)
16. Season clock source (device vs in-game) — 7.8
17. Species conversion table — DS1
18. Item display text (original descriptions, 639) — DS7, WG1
19. Nature assignments (+ table-vs-display-only ruling) — DS9, WG2
20. True chart values incl. Deep + new elements, then chart wiring — DS10, DS11, WG3
21. Class / role renames — DS15
22. Trainer personal-name swap — DS16
23. Facility level rules + venue mapping — DS18, WG5
24. Placeholder ability maps to "no ability" — stage-1 decision, carried (not in the 182 rows; listed here so it is not lost)
25. Script / warp / actor / matrix / prop / trade ref targets — WG7, WG8, WG9, WG10, WG11, WG12, WG13 (grouped as ref-target decisions; each ref table is its own decision at PR time)
26. Original content rulings: place names (WG6), palettes/art (WG14), sound (WG15), dialogue (WG26), season-to-form (WG17), shop catalogue (WG21), battle constants as original values (WG20) — original work, not source values

## 7. Blocked sub-items (not rows — do not add to the 182 count)

- Evolution trade/friendship equivalents (under DS13): Mars decision, not auto-converted to level.
- Battle layout: Gen 3 grid vs Gen 4 corner menu layout (under B3/B26): Mars decision.
- Bag-full block cap value (under E9): needs the canonical pocket choice (decision 5).
- Held-item save field (under D15/F11): work owed, not a Mars row.
- HeartGold weather particle runtime internals (under 3.6): opaque pointer in the code read; state stub only, internals flagged.
- Per-move body-part rig points (under B25): coordinator/VFX work, not code values, not invented.
- Trade view itself (under WG13): work, mapping still blocked.
- Facility set-count 237 figure: owed-verify (raw cross-gen class keys exceed 237 before dedup).

## 8. What the next PR would contain (once Mars decides the blocked items)

Once decisions 1–26 above are made, the next PR (not created
here) would contain, in order:
1. `playable-wiring.ts` (this folder's TS file) moved into the
   game tree as a library module, plus the call-site patches
   that import it from the existing views (battle, bag, shop,
   storage, world, menus) — call sites are 0% today, so this
   is the bulk of the PR, not a copy of this staging folder.
2. The blocked-row resolutions as data tables only (assignments,
   renames, mappings, original text/art/audio slots) — each
   table gated on its decision in §6, never guessed.
3. The backfill/verification passes (DS2, DS3, DS4, DS14, DS17,
   DS19, DS20, WG16) as generated JSONs + their extractors,
   following the existing generated-data pattern on main.
4. A re-run of this folder's validator against the merged tree
   (counts must still reconcile; forbidden grep must still be
   0 hits) plus the full build gate (build + lint + validate)
   on a clean copy before any merge.
