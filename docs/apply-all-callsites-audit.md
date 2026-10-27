# Call-site audit — staged patches only, no PR, no merge, no game-tree edits

Audit date: 2026-10-27. Authorisation in scope: Mars 2026-10-27 07:30 CDT
"get all of that stuff into the game 100%" — this audit stages only
what can honestly be wired; it does not claim the rest.

## Sources read (current main, via the GitHub API helper — NOT staged copies)

- `src/lib/playableWiring.ts` on main: 25,124 bytes, 400 lines.
  Verified byte-identical to the staged
  `black2-everything-else/wiring-playable/playable-wiring.ts`
  (`diff` exit 0). The 156 wireable rows below are exactly the staged
  map's W rows (Battle 20 + Menus 67 + Overworld 57 + Data 12).
- `src/lib/opponentDirection.ts` on main: 433,002 bytes, 71 lines.
  SHAPE DRIFT vs the PR #262 version, confirmed: `OPPONENT_VECTORS`
  is now `Record<BattleFormat, AttackVector>` with keys
  `single / doubles_left / doubles_right` (not the staged
  playableWiring keys). `OPPONENT_MOVE_ROWS` = 560 rows.
  `OPPONENT_COUNTS`: moves_total 560, opponent_travel_confirmed
  442 (78.9%), multi_target_geometry 13, no_opponent_travel 105,
  confirmed_origin_body_part 0, origin_unconfirmed 560 (100%).
  The staged playableWiring `OPPONENT_VECTORS` is imported by NONE
  of the 9 audited views on main; the live import is
  opponentDirection's table in PixiBattleCanvas.
- Current main views read in full or by import + logic grep:
  BattleView (618 lines), BagView (232), RosterView (239),
  WorldEngine (1791), ArenaBattleView (129), GameShell (105),
  ShopView (229), PcView (175), PixiBattleCanvas (568).
  Supporting evidence files read: gameStore.ts (no inventory caps,
  no held-item field), types.ts (no nature/ability/held-item on the
  instance type), gameSettings.ts (options value counts already
  live there: 3/2/2/2/3), saveSystem.ts (whole-state JSON, no
  block/sector shape, no dialog steps), WorldConstants.ts
  (getDayPhase dawn 6-10 / day 10-18 / dusk 18-21 / night;
  WEATHER_CONFIG string keys; HM_REQUIRED exists but is not
  checked by WorldEngine's move()).
- The dirty work tree at `~/workspace/mochiichao-work/fresh-start`
  was NOT edited and NOT used as a source; all main content came
  from the API. No other lane's staging was overwritten. No
  deletions anywhere. No logo/studio/title files touched.

## Status definitions (conservative — this is the whole point)

- **applied** = a real call site exists on main: the staged snippet
  (or its main successor, for B24) is imported AND used in a live
  code path implementing that row.
- **patch-staged** = this audit stages a concrete patch file under
  `callsites/` containing a real code change (import + use) for
  that row. Outcome-identical unless the patch file itself flags
  NEW BEHAVIOUR.
- **blocked** = no patch staged, with the exact reason. "Behaviour
  already present but not via the staged snippet" is counted as
  blocked with that reason, NOT as applied — an unused import
  would be dead code, and re-labelling existing code as a call
  site would inflate the count. A row is never silently dropped:
  every one of the 156 appears below.
- The 26 Mars-blocked rows from the staged map (item descriptions,
  nature assignments, True chart values, map assignments, facility
  rules, role renames, AI assignments, etc.) are NOT in the 156
  denominator and stay stubs/nulls here; they are listed in §3 so
  nothing is lost. Where a 156-row call site ALSO needs one of
  those decisions, the row is blocked and the decision is named.

## Totals (required counts)

| Measure | Count |
|---|---|
| Call sites already on main (live import + use, all views) | 4 sites: ShopView sellPrice; PcView box size 30; PcView party guard 6; PixiBattleCanvas opponent direction sign |
| Rows fully applied / 156 | **1 / 156 = 0.6%** (B24 only) |
| New patches staged / 156 | **1 / 156 = 0.6%** (F14 only; PcView.patch) |
| Blocked / 156 | **154 / 156 = 98.7%** |
| Check: 1 + 1 + 154 | 156 |
| Opponent format vectors applied / 1 | **1 / 1 = 100%** (single format live in PixiBattleCanvas; doubles vectors exist in the main table but the canvas is the single-battle path, so doubles has no canvas call site — not counted as a second format) |
| Opponent per-move joins / 442 | **0 / 442 = 0%** — DELIBERATELY NOT JOINED. Game move ids are the game's own; source move slugs are not a mapping. Joining by name similarity would be invented. |
| Body-part origins confirmed / 560 | **0 / 560 = 0%** — NOT INVENTED. Every main source row carries origin_label "unconfirmed"; the canvas uses battler-centre [0, 0] offsets. |

Why "4 live sites" but "1 applied row": sellPrice, box size 30
and party guard 6 are unnumbered helpers inside the staged
shop/storage sections, not numbered rows of the 156-row map.
Counting them as rows would invent a row mapping. They are
reported as live sites (above) and are NOT double-counted in
the row totals. B24 is both a live site and a numbered row.

Why so much is blocked: the staged map itself recorded call-site
wiring at 0% for every new item (staged only), and PR #262 added
exactly the 4 sites above. Almost every remaining snippet is
either (a) resolver/lib logic, not view logic, (b) a constant
whose view already behaves differently (different order, flat
cursor, placeholder damage, string weather keys, its own day
bands), so swapping it in changes behaviour, or (c) a rule that
needs a field, system, or assignment that does not exist yet.
Staging patches for those would either be dead imports or
invented behaviour. This audit stages the one genuine exception
(F14) and names the blocker for each of the rest.

## §1. Per-row table — Battle (20 rows)

| Row | Staged snippet | Status | Reason / patch |
|---|---|---|---|
| B1 Init / state-machine chain | (screen order, not a state chain) | blocked | No chain snippet exists: BATTLE_SCREEN_ORDER lists screens, BattleView's BattleState is its own union. Needs a state-machine diff, not a view patch. |
| B2 Intro / send-out sequence | (no sequence constant) | blocked | START -> PLAYER_TURN + 1000 ms delay (battleScene) is inline in an effect; no send-out order list to replace. Needs a presentation hook. |
| B3 Action selection order (action -> move -> target -> party/bag) | BATTLE_SCREEN_ORDER (partial) | blocked | BattleView PLAYER_TURN renders move grid + capture + flee only — NO party button, NO bag button. Order cannot drive a menu that lacks two of its steps. Needs battle party/bag UI (new UI). |
| B5 End-turn sequence order | END_TURN_ORDER | blocked | End-turn lives inside battleResolver resolveTurn, not BattleView. A BattleView import would be dead code. Needs a resolver diff. |
| B12 Random damage roll 85-100 | randomDamageRoll | blocked | Damage lives in battleResolver.calculateDamage via resolveTurn. Diff-verify vs the resolver is owed work (per the staged map), not a view patch. Needs a resolver diff. |
| B14 Stat stages -6..+6 ratio table | STAT_STAGE_RATIOS, applyStatStage | blocked | Stages live in the resolver's carried battler state. BattleView only displays stored stats. Needs a resolver diff. |
| B15 Primary statuses, bit layout + end-turn fractions | STATUS_END_TURN_FRACTIONS | blocked | Status ticks are resolver events synced to HP in BattleView's finish path. Needs a resolver diff. |
| B16 Volatile statuses | VOLATILE_STATUSES | blocked | Volatile state is resolver-carried (finalPlayerVolatile / finalFoeVolatile). Needs a resolver diff. |
| B17 Multi-hit distribution 35/35/15/15 | MULTI_HIT_DISTRIBUTION, multiHitCount | blocked | Hit-count logic is resolver-internal. Diff-verify owed, not a view patch. Needs a resolver diff. |
| B18 Charge / two-turn moves | (state machine, no constant) | blocked | Charging is resolver-carried state ("charging" in the carried comment). Needs a resolver diff. |
| B19 Recoil moves | (rule + fraction parameter) | blocked | Recoil suicide is handled as a resolver outcome edge (EXP skipped). Needs a resolver diff. |
| B20 Trapping / wrap family | (rule, 1/16 end-turn) | blocked | Wrap is a resolver volatile + end-turn tick. Needs a resolver diff. |
| B21 Protect / endure / substitute / 1-HP floor | (guard layer order) | blocked | Guard layers are resolver-internal accuracy/damage steps. Needs a resolver diff. |
| B22 Weather + field (screens, spread, multipliers) | WEATHER_DAMAGE, SCREEN_DIVISOR | blocked | BattleView has NO battle weather state and no screen state; there is nothing to attach the multipliers to. Needs a battle weather/field system. |
| B23 Healthbox + HP bar offsets | HEALTHBOX_BAR_OFFSETS [16, 8] | blocked | Offsets are 240x160 canvas pixels; BattleView healthboxes are React DOM above the canvas (positions from hudBattleLayout). No matching literal. Needs Pixi healthbox rendering. |
| B24 Opponent-direction vectors | OPPONENT_VECTORS (main opponentDirection shape) | **applied** | PixiBattleCanvas lines 10 + 261-270: sign(single.dx) for enemy, negated for player, fallback to aiming sign. See PixiBattleCanvas.patch (already-on-main note + shape-drift warning). |
| B25 Opponent-direction archetypes (mechanisms) | OPPONENT_ARCHETYPES (8 mechanisms, no per-move assignment) | blocked | Canvas art selection uses attackSetFor / buildHitTimeline treatment ids, which do not match the staged archetype ids, and the staged file has NO move -> archetype assignment. Needs a move -> archetype map + treatment-id mapping (work, not a Mars decision, but not a minimal patch). Per-move body-part origins stay 0/560. |
| B26 Battle windows, full-screen order | BATTLE_SCREEN_ORDER | blocked | BattleView has no party screen and no bag screen in battle (see B3). The order list cannot drive screens that do not exist. Needs battle party/bag routing. |
| B27 Party / switch / faint outcomes | BATTLE_OUTCOMES | blocked | BattleView's BattleState (incl. SWITCH_CHOICE, VICTORY, DEFEAT, CAUGHT, FLED) already covers outcomes, and BATTLE_OUTCOMES has no consumer in the finish path. Wiring it in without a consumer is dead code. Needs a resolver outcome return (lib diff). |
| B28 Capture / run / flee rules | (precedence rule: run first alone) | blocked | handleRun always leaves (BattleView props carry no trainer/wild flag, so no run-block can be wired) and handleCatch is immediate, not a resolver turn action — "run first alone" is a turn-order rule that cannot be expressed in this view. Needs a resolver turn-action model + a trainer/wild flag. |

## §1. Per-row table — Menus / bag / shop / PC / save (67 rows)

### A. Field menu (8)

| Row | Status | Reason / patch |
|---|---|---|
| A1 Index entry (shown only once the index exists) | blocked | PauseMenu shows Dex unconditionally; Dex is not literally the staged "index" row. Hiding it would change behaviour on an analogy. Needs an index-exists state + a ruling that Dex == the index row. |
| A2 Party entry | blocked | Behaviour present (PauseMenu "Team" -> RosterView) but PauseMenu order is a superset in a different order; FIELD_MENU_ROWS cannot drive it without reordering + dropping routes. Reason: behaviour present, no call. |
| A3 Bag entry | blocked | Same as A2 (PauseMenu "Bag" -> BagView). Behaviour present, no call. |
| A4 Player / trainer-card entry | blocked | No trainer-card entry exists in PauseMenu and no card screen exists in the listed views. Needs card-screen routing. |
| A5 Save entry | blocked | Behaviour present (PauseMenu Save Game -> saveGame). FIELD_MENU_ROWS is a list, not a callable snippet. Behaviour present, no call. |
| A6 Options entry | blocked | No options entry in PauseMenu. Needs options routing in the pause menu (work). |
| A7 Exit entry | blocked | Behaviour present (PauseMenu "Back to Game" -> onClose). No snippet to call. Behaviour present, no call. |
| A8 Retire entry, special-zone context only | blocked | No retire UI and no special-zone context state in the listed views. Needs a retire system + zone context. |

### B. Title-adjacent main menu (5)

| Row | Status | Reason |
|---|---|---|
| B1 New Game | blocked | Home view is a title screen, outside this 9-view patch set. MAIN_MENU_WINDOWS cannot be called from GameShell. PR worker: patch the title views separately; do not count these from this audit. |
| B2 Continue | blocked | Same title-scope reason as B1. |
| B3 Gift window (only when a gift exists) | blocked | Same title-scope reason as B1; no gift-exists state is read by any listed view. |
| B4 Error window | blocked | Same title-scope reason as B1. |
| B5 Continue summary (player, location, time) | blocked | Same title-scope reason as B1. |

### C. Options (6 of 7; C6 is a Mars-blocked row, not in the 156)

| Row | Status | Reason |
|---|---|---|
| C1 Text speed: 3 values | blocked | Value count already live in gameSettings.ts (TEXT_SPEEDS 3), NOT via playableWiring, and the settings screen is outside this 9-view set. No view patch staged here; PR worker must check the settings screen separately. Do NOT count this as applied from this audit. |
| C2 Battle scene: 2 values (on/off) | blocked | Same as C1 (BATTLE_SCENES 2 in gameSettings.ts). |
| C3 Battle style: 2 values (shift/set) | blocked | Same as C1 (BATTLE_STYLES 2 in gameSettings.ts). |
| C4 Sound: 2 values (mono/stereo) | blocked | Same as C1 (SOUNDS 2 in gameSettings.ts). |
| C5 Button mode: 3 values | blocked | Same as C1 (BUTTON_MODES 3 in gameSettings.ts). |
| C7 Cancel row (0 values, closes) | blocked | Same scope reason as C1-C5 (settings screen out of scope). |

### D. Bag (12 of 15; D1-D3 are Mars-blocked, not in the 156)

| Row | Status | Reason / patch |
|---|---|---|
| D4 Stack caps per generation (999 / 99 / 1) | blocked | gameStore buyItem/useItem keep unbounded count records; no cap is enforced anywhere. Needs a store cap + the canonical pocket generation (Mars decision D1-D3). |
| D5 Cursor + scroll remembered per pocket | blocked | BagView keeps ONE flat `selected` index across pockets. emptyBagCursorState cannot attach without changing navigation behaviour. Needs a cursor-model redesign. |
| D6 Field context | blocked | Behaviour present (BagView IS the field bag screen), but driving its buttons from BAG_CONTEXT_ACTIONS would reorder them (staged order use, toss, register, give, cancel vs live order Use, Give, Toss, Quit). Reordering is not outcome-identical; an unused import is dead code. See BagView.patch for the full rejection note. |
| D7 Party-give context | blocked | Give is rendered disabled in BagView because the instance type has no held-item field. Needs the held-item field (work). |
| D8 Shop-sell context (bag reused inside shop) | blocked | ShopView does NOT reuse BagView; its sell list is built from its own item table. BagView cannot be wired into a reuse that does not exist. |
| D9 Item-terminal deposit context | blocked | No item-terminal UI exists in the listed views (PcView's Data Card store is a different feature). Needs a terminal system/UI. |
| D10 Box-give context | blocked | Same held-item-field blocker as D7 (PcView has no item give). |
| D11 Battle context (battle pocket filter) | blocked | BattleView has no bag screen in battle. Needs a battle bag screen. |
| D12 Use action | blocked | Use behaviour present (incl. the Mend Patch heal flow), but the staged action list cannot drive the buttons outcome-identically (see D6 reorder note). Behaviour present, no call. |
| D13 Toss action + how-many quantity | blocked | BagView toss discards exactly ONE with a confirm dialog ("Toss one …?"). A how-many selector is new UI, not a literal swap. |
| D14 Register action (field use) | blocked | No registered-item system exists in the listed views. Needs that system. |
| D15 Give action (held item) | blocked | Same held-item-field blocker as D7/D10. The staged Give structure cannot execute without a field to write to. |

### E. Shop (7 of 8; E14 is Mars-blocked, not in the 156)

| Row | Status | Reason |
|---|---|---|
| E8 How-many quantity selector (buy + sell) | blocked | ShopView confirms exactly one item per transaction (buy + sell). A quantity selector is new UI. |
| E9 Bag-full block on Buy | blocked | Needs a pocket-cap value (see D4) + the canonical pocket choice (Mars decision D1-D3). Neither exists. |
| E10 Transaction record + shop stat | blocked | ShopView only sets a message string ("Bought …!" / "Sold … for … CR"); nothing persists a transaction record or a shop stat. Needs a store field. (The live sellPrice call is reported separately as a live site, not as this row — see Totals.) |
| E11 Move-machine shop type | blocked | Single shop, mode menu/buy/sell, no type routing; item table has no machines. Needs shop-type routing + a catalogue decision. |
| E12 Decor shop types | blocked | Same as E11; no decor offers, no type routing. |
| E13 Seal / prize / data-card shop types | blocked | A Data Card item IS sold, but SHOP_TYPES is not used to route it and there are no seal/prize offers. Type routing missing; partial item presence is not a call site. |
| E15 Battle-point / move-tutor shop types | blocked | No battle-point currency and no tutor offer list exist in the listed views. Needs both systems. |

### F. Creature storage (6 of 9; F10/F12/F16 are Mars-blocked, not in the 156)

| Row | Status | Reason / patch |
|---|---|---|
| F1 Withdraw / Deposit / Move / Move Items / Exit main menu | blocked | PcView has NO 5-item menu: Withdraw/Deposit are direct buttons (+ confirm), there is no Move-creatures control, no Move Items mode, and Exit is a Close button. Driving PcView from STORAGE_MAIN_MENU would be a menu restructure (new UI). |
| F9 Move creatures within/across boxes (grab/place, multi-move) | blocked | PcView boxes are derived chunks (`pc.slice(box * 30, …)`) of a flat list, not stored boxes; there is no grab/place state. Needs a stored-box model + grab/place state machine. |
| F11 Move Items mode (held items) | blocked | Held-item field missing (see D7). No mode can move items that cannot be held. |
| F13 Deposit-which-box prompt | blocked | Deposit appends to the flat pc list; boxes are derived, so there is no box to prompt for. Needs the stored-box model (see F9). |
| F14 Deposit last-member block / empty-party guard | **patch-staged** | PcView.patch: (1) outcome-identical — Party heading `/6` -> `STORAGE_RULES.partyMax`; (2) FLAGGED NEW BEHAVIOUR — moveToPc refuses a deposit at party size 1 + Deposit button disabled at size 1 (uses STORAGE_RULES.depositBlockedWhenItWouldEmptyParty). On main today the last member CAN be deposited. Withdraw side was already guarded on main; this completes the other half. PR worker must keep the new-behaviour flag. |
| F15 Summary view from a box slot | blocked | Behaviour present (PcView shows a summary panel for the selected box creature: name, Lv, HP, Data Card state), but no staged snippet describes summary routing — nothing to import. Behaviour present, no call. |

### G. Item storage / mailbox / terminals (8)

| Row | Status | Reason |
|---|---|---|
| G1 Player terminal top menu (3 rows) | blocked | No terminal UI exists in the listed views. TERMINAL_TOP_MENU has no screen to attach to. Needs terminal UI (work). |
| G2 Item terminal withdraw | blocked | Same terminal-UI blocker as G1. |
| G3 Item terminal deposit | blocked | Same terminal-UI blocker as G1. |
| G4 Item terminal cap 30 | blocked | Same terminal-UI blocker as G1 (ITEM_TERMINAL_CAP has no terminal to cap). |
| G5 Withdraw how-many | blocked | Same terminal-UI blocker as G1, plus a quantity selector (new UI). |
| G6 Mailbox read / move-to-bag / delete | blocked | No mailbox UI exists in the listed views. Needs mailbox UI (work). |
| G7 Turn Off / exit | blocked | Same terminal-UI blocker as G1. |
| G8 Professor + hall-of-fame terminals | blocked | Same terminal-UI blocker as G1. PcView's Data Card store is not an item terminal and must not be relabelled as one. |

### H. Save / load (10 of 11; H7 is Mars-blocked, not in the 156)

| Row | Status | Reason |
|---|---|---|
| H4 Block 1 field set | blocked | saveSystem.ts serialises the whole game state as one JSON blob (`data: any`), not blocks. SAVE_BLOCK_FIELDS lists fields the blob contains implicitly, but there is no block code to call the lists from. Needs a save-shape change (medium decision H7 is Mars-blocked) — not a view patch. |
| H5 Block 2 field set | blocked | Same save-shape blocker as H4. |
| H6 Storage block separate from block 1/2 | blocked | Same save-shape blocker as H4. |
| H8 Signature + checksum + counter per sector | blocked | No signature/checksum/counter code exists in saveSystem.ts. Needs the save-shape change (see H4). |
| H9 Rotating write start + damaged-sector skip + last-good restore | blocked | No sector write path exists (single localStorage/IndexedDB-mirror write). Needs the save-shape change. |
| H10 Newest-valid-slot pick on load, backup fallback | blocked | loadGame loads a chosen entry; there is no newest-valid/backup-fallback pick. Needs the save-shape change + load logic. |
| H11 Save dialog: ask -> Yes/No -> saving -> saved | blocked | GameShell's Save button sets a "Saved!" label for 2s; it shows no dialog steps. The dialog/screens live in the separate save-menu component, outside this view set. Needs save-dialog UI. |
| H12 Save error full screen | blocked | No such screen is routed from GameShell (or any listed view). Needs the screen + routing (out of scope). |
| H13 Clear-save-data full screen | blocked | Same as H12. |
| H14 Delete-save screen | blocked | Same as H12. |

### I. Trainer card (5)

| Row | Status | Reason |
|---|---|---|
| I1 Player name + id line | blocked | No trainer-card screen exists in the listed views. TRAINER_CARD_FIELDS has no screen to attach to. Needs a card screen (work). |
| I2 Money line | blocked | Same card-screen blocker as I1. |
| I3 Badge count line | blocked | Same card-screen blocker as I1. (Badge *boost* is a separate Mars decision, B13; the card count line itself is only a display field — but with no screen, there is still no call site.) |
| I4 Play time line | blocked | Same card-screen blocker as I1. |
| I5 Party icons row | blocked | Same card-screen blocker as I1. |

## §1. Per-row table — Overworld (57 rows)

### Movement / field flow (13)

| Row | Status | Reason |
|---|---|---|
| 1.5 Walk speeds (slow / normal / fast / faster) | blocked | WorldEngine's only speed variation is the held-direction interval (140 ms, 70 ms fast-forward). No walk-speed states exist. Needs a speed-state system. |
| 1.6 Run + run-slow states | blocked | No run toggle/state exists (fast-forward is not a run state). Needs a run system. |
| 1.7 Bike state + camera pan-back flag | blocked | No bike state exists. Needs a bike system. |
| 1.8 Surf state on water tiles | blocked | Water tiles (tile 2) simply block in move(); HM_REQUIRED exists in WorldConstants but is never checked, and no Surf state or HM-ownership state exists. Needs both. |
| 1.9 Water-current glide / ride | blocked | No current tiles or glide state exist. Needs a current system. |
| 1.10 Ledge jump | blocked | Ledge tiles (tile 9) are impassable (PASSABLE 9 = false) with no jump behaviour. Needs a ledge-jump system. |
| 1.11 Grid player vs no-grid player (two controller modes) | blocked | WorldEngine is grid-only (tile steps). No no-grid controller exists in this view. Needs a second controller mode. |
| 1.12 Field flow order (load map -> fade -> overworld loop -> warp-out / warp-in) | blocked | Transitions exist (setIsTransitioning + 400 ms timeouts, exits/doors) but there is no named flow state for FIELD_FLOW_ORDER to attach to. Behaviour present in outline, no call. |
| 1.13 Object-event / NPC movement types + tracking-by-camera flag | blocked | NPC wander exists (home positions, delay, step counters) but NPCs carry no movement-type field and no camera-tracking flag. Needs NPC movement-type data. |
| 1.14 Field-move gating at the tile | blocked | HM_REQUIRED is declared but never consulted by move(); tiles block unconditionally. Needs HM-ownership state + a gating check. |
| 1.15 Step counters (repel steps, encounter-rate buff steps) | blocked | No step counters exist in WorldEngine (no repel, no buff steps). Needs counter state. |
| 1.16 Terrain check before any encounter roll | blocked | Behaviour present: the tall-grass branch checks `tile === 6` before rolling. But no staged snippet describes the check itself — nothing to import. Behaviour present, no call. |
| 1.17 Warp kinds (fixed, dynamic, escape, dive/hole, heal-location) | blocked | Exits/doors in map data carry `to` + `enterAt` only, no kind field. Typing them is new map data. Needs a kind field per exit/door. |

### Encounters (15 of 16; 2.18 is Mars-blocked, not in the 156)

| Row | Status | Reason |
|---|---|---|
| 2.3 FireRed rate test (0-1600 scale) | blocked | Replacing the live 0.15 roll with fireRedEncounterRoll changes encounter behaviour, and the live roll has no failed-roll counter input. Needs the encounter-system rework (see 2.4). |
| 2.4 FireRed slot tables (land 12, water/rock 5, fishing 10) | blocked | Live pick is uniform over the map's first pool (`pool[Math.floor(random * pool.length)]`). Slot tables assume fixed slot counts; map pools vary in size, so pool entries cannot be mapped to slots without an invented per-map assignment. Needs slot <-> pool mapping per map. |
| 2.5 FireRed rate modifiers (item +-50%, held-item, lead-ability, repel) | blocked | No item-modifier, held-item, lead-ability, or repel state exists in WorldEngine. Needs those states. |
| 2.6 HeartGold two-stage roll | blocked | Same as 2.3/2.4: behaviour change + no step/audio/very-tall-grass inputs in WorldEngine. Needs the encounter-system rework + inputs. |
| 2.7 HeartGold land slot roll (12) | blocked | Same slot <-> pool mapping blocker as 2.4. |
| 2.8 HeartGold surf slot roll (5) | blocked | Same mapping blocker as 2.4, plus no surf encounter path exists in WorldEngine. Needs the path + mapping. |
| 2.9 HeartGold fishing slot roll (5 per rod) | blocked | Same mapping blocker as 2.4, plus no fishing path exists in WorldEngine. Needs the path + mapping. |
| 2.10 HeartGold rock-smash (2) + headbutt (6) | blocked | Same mapping blocker as 2.4, plus no rock-smash/headbutt encounter paths exist in WorldEngine. Needs the paths + mappings. |
| 2.11 HeartGold time-of-day slot sets | blocked | No time-of-day encounter sets exist; WorldEngine encounters ignore the day phase entirely. Needs time-of-day sets + the phase mapping. |
| 2.12 HeartGold encounter data struct | blocked | Data struct only; WorldEngine's encounter data is `mapData.encounters` pools, a different shape with no struct conversion. Needs a conversion + assignment. |
| 2.13 Black 2 encounter data struct | blocked | Same as 2.12, Black 2 shape (7 terrain rates, 12/12/12/5/5/5/5 slots). Needs a conversion + assignment. |
| 2.14 Black 2 climbing rate (12 configs) | blocked | No climbing system, no block/step counters, no climbing terrain in WorldEngine. Needs a climbing system. |
| 2.15 Black 2 phenomena spots + steps-since-phenomenon counter | blocked | No shaking-grass / dust-cloud / rippling-water / flying-shadow spots and no counter exist. Needs a phenomena system. |
| 2.16 Crystal slot probabilities (grass 7, water 3) | blocked | Same slot <-> pool mapping blocker as 2.4. |
| 2.17 Rod tiers + contexts | blocked | No rods, no fishing, no contest/swarm contexts exist in WorldEngine. Needs a fishing system. |

### Weather (8 of 9; 3.11 is Mars-blocked, not in the 156)

| Row | Status | Reason |
|---|---|---|
| 3.3 FireRed weather state machine | blocked | WorldEngine weather keys are strings via WEATHER_CONFIG (clear/mist/neon_rain/smog/jungle/snow). Numeric code tables cannot attach without the code -> state mapping, which is the blocked Mars decision (3.11 family). |
| 3.4 FireRed weather ID set (0-15 + 20/21) | blocked | Same 3.11 mapping blocker as 3.3. |
| 3.5 HeartGold ID set (0-13) | blocked | Same 3.11 mapping blocker as 3.3. |
| 3.7 Platinum ID set | blocked | Same 3.11 mapping blocker as 3.3. |
| 3.8 Black 2 weather system (15 overlays, transitions) | blocked | Same 3.11 mapping blocker as 3.3; transitions are sequential vs crossfade with no weather-transition system in WorldEngine. |
| 3.9 Black 2 zone-weather precedence | blocked | Same 3.11 mapping blocker as 3.3; precedence order has no zone-weather input (zones unassigned). |
| 3.10 Field-weather -> battle-weather conversion | blocked | No battle-weather target exists (see B22), so a conversion has nowhere to convert to. |
| 3.6 HeartGold weather runtime / particle system | blocked | The staged snippet is a state stub only — the source manager is an opaque pointer in the code read, internals flagged, not invented. A stub is not a call site. Needs the runtime internals (work) + the 3.11 mapping. |

### Camera / projection (4 of 5; 4.5 is Mars-blocked, not in the 156)

| Row | Status | Reason |
|---|---|---|
| 4.2 FireRed field camera | blocked | Camera lives in the Pixi world canvas, outside this 9-view set; WorldEngine itself holds no camera constants to replace. Needs a camera-system patch in the canvas view, not here. |
| 4.3 HeartGold camera | blocked | Same canvas-scope blocker as 4.2. |
| 4.4 Black 2 field camera | blocked | Same canvas-scope blocker as 4.2. |
| 4.6 Zone camera-bound field (65535) + camera-type fields | blocked | Same canvas-scope blocker as 4.2; zones are also unassigned (6.9 family). |

### Lighting (4 of 5; 5.5 is Mars-blocked, not in the 156)

| Row | Status | Reason |
|---|---|---|
| 5.3 Black 2 lighting-period lookup (210 sets) | blocked | WorldEngine has no lighting system beyond DAY_TINT/DAY_AMBIENT (different values, different structure). The lookup cannot attach without a lighting system + the set -> location/time assignment (blocked Mars decision 5.5 family). |
| 5.4 Black 2 field-light runtime | blocked | Same lighting-system + 5.5 assignment blockers as 5.3. |
| 5.6 HeartGold area-light manager | blocked | Same lighting-system + 5.5 assignment blockers as 5.3. |
| 5.7 FireRed global tint + weather gamma | blocked | Same lighting-system blocker as 5.3; DAY_TINT is a phase tint, not a weather-gamma application. |

### Zones / map types (7 of 8; 6.9 is Mars-blocked, not in the 156)

| Row | Status | Reason |
|---|---|---|
| 6.3 FireRed map header | blocked | FULL_WORLD maps carry no header fields at all, so header lists have nothing to attach to. Needs map-header fields + the zone -> map assignment (blocked Mars decision 6.9 family). |
| 6.4 FireRed map types 0-9 | blocked | Same header-field + 6.9 assignment blockers as 6.3. |
| 6.5 HeartGold map header | blocked | Same header-field + 6.9 assignment blockers as 6.3. |
| 6.6 HeartGold map types | blocked | Same header-field + 6.9 assignment blockers as 6.3. |
| 6.7 Platinum map header | blocked | Same header-field + 6.9 assignment blockers as 6.3. |
| 6.8 Black 2 zone header (615 zones) | blocked | Same header-field + 6.9 assignment blockers as 6.3. |
| 6.10 Cross-generation matrix/layout layer | blocked | Same header-field + 6.9 assignment blockers as 6.3. |

### Day / night / seasons (6 of 7; 7.8 is Mars-blocked, not in the 156)

| Row | Status | Reason |
|---|---|---|
| 7.2 HeartGold RTC periods by hour | blocked | Live bands (WorldConstants getDayPhase) differ from the staged bands; swapping them changes tint/phase behaviour and picks a canonical generation without a decision. Needs a canonical-period decision + a swap (behaviour change, not outcome-identical). |
| 7.3 Day/night music split (per-map day + night music fields) | blocked | Maps carry no day/night music fields, and music itself is original work. Needs per-map music fields. |
| 7.4 Crystal/Gold RTC (time-of-day palettes + daily timers) | blocked | DAY_TINT exists but is a different structure (4 live phases, not RTC palette steps); no daily timers exist. Needs a palette/timer system. |
| 7.5 Black 2 event-time + playtime | blocked | No event-time state exists in WorldEngine (gameHour is a ticking hour only; no day/period/month/weekday, no playtime h/m/s, no last-saved date/time). Needs event-time state. |
| 7.6 Black 2 seasons (season = (month - 1) % 4) | blocked | No month state exists, and the season clock source is a blocked Mars decision (7.8: device clock vs in-game clock). black2Season cannot be called without a month input. |
| 7.7 Seasonal encounters + seasonal light-end adjustment | blocked | Needs seasonal encounter sets (see 2.x assignment blocker) + a lighting system (see §Lighting). |

## §1. Per-row table — Data systems (12 of 20; DS1/DS7/DS9/DS10/DS11/DS15/DS16/DS18 are Mars-blocked, not in the 156)

| Row | Status | Reason |
|---|---|---|
| DS2 FireRed species JSON field-completeness pass (13 present vs ~22) | blocked | Extraction/backfill pass over generated JSON, not a view call site. No listed view loads species JSON fields directly (views read SPECIES_DB). Needs the data pass, then a data-layer load. |
| DS3 HeartGold moves JSON | blocked | Same as DS2: extraction pass, not a view call site. |
| DS4 HeartGold learnsets JSON | blocked | Same as DS2: extraction pass, not a view call site. |
| DS5 Move effect dispatch module (effect -> script) | blocked | Effect dispatch lives in the resolver/moves layer, not in any listed view. BattleView only passes move ids to resolveTurn. Needs a resolver/lib dispatch diff. |
| DS6 Ability effect dispatch module | blocked | No ability field exists on the instance type (verified in types.ts), so no dispatch can execute per creature. Needs the ability field first. |
| DS8 Item field/battle function dispatch module | blocked | Item functions live in gameStore.useItem (count-only + the BagView Mend Patch special case), not in a dispatch table any listed view calls. Needs a store dispatch diff. |
| DS12 Unified learnset loader (TM resolution + tutor union) | blocked | Data-layer loader shape (resolveTmCode takes a TM map parameter — no generation TM map is passed by any listed view). RosterView only displays already-loaded current.moves. Needs a data-layer load. |
| DS13 Evolution field widened to list + trigger module | blocked | No evolution UI or trigger call exists in any listed view (RosterView shows moves/stats only). EVOLUTION_METHODS has no caller here. Needs evolution UI + a trigger hook. (Trade/friendship equivalents are a blocked sub-item, not auto-converted.) |
| DS14 Black 2 generated-trainer backfill (ai_flags / items / heals / money / reward) | blocked | Backfill pass over generated trainer JSON, not a view call site. BattleView enemies arrive from WorldEngine event data, not from backfilled trainer JSON. Needs the data pass. |
| DS17 Facility set counts verify (1,285 + 6,000 brief-claimed) | blocked | Verification pass over batch data, not a view call site. ArenaBattleView is a placeholder doubles screen, not a facility. Needs the verification pass + a facility system. |
| DS19 Black 2 facility trainer extraction | blocked | Consolidation/verification pass, not a view call site. Same facility-system blocker as DS17. |
| DS20 Deduped cross-gen class table + AI vocabulary unification + AI scoring module | blocked | AI scoring lives in the resolver/enemy-move layer, not in any listed view. BattleView does not choose enemy moves. Needs a resolver/lib diff. (The 237 class figure itself is flagged owed-verify in the staged map — raw keys exceed 237 before dedup — and is NOT claimed here.) |

## §2. What was NOT patched, and why nothing was silently dropped

- Every blocked row above names its blocker: Mars decision, missing
  instance field (nature/ability/held-item — verified absent from
  the instance type; Give/Take buttons are disabled on main for
  exactly this reason), missing system (held-item Give, terminal,
  mailbox, fishing, climbing, phenomena, facility, battle weather,
  battle bag/party screens, trainer-card screen, save dialog),
  missing map/roster assignment (encounter sets, zones, lighting
  sets, weather codes), out-of-scope home view (title, settings,
  save-menu, Pixi world canvas, battleResolver), or "behaviour
  present, no call" (A2, A3, A5, A7, D6, D12, F15, 1.12, 1.16).
- Rows that look patchable at first glance but were rejected:
  BagView button driving (would reorder the UI — see BagView.patch),
  WorldEngine encounter swap (behaviour change + invented slot
  mapping — see WorldEngine.patch), day-band swap (behaviour
  change + unmade canonical choice), PauseMenu driving from
  FIELD_MENU_ROWS (would drop routes — see GameShell.patch),
  BattleView snippet imports (dead code without a resolver diff).
- The single staged patch (PcView.patch) is the only row where a
  real code change is both minimal and honest: one
  outcome-identical literal swap plus one flagged new-behaviour
  guard, both using an import already on main.

## §3. The 26 Mars-blocked rows — untouched, still stubs/nulls

From the staged map §6 (decisions, not rows — a decision may block
several rows): physical/special canonical confirmation (B7);
badge-boost counterpart (B13); link play (A9); options frame art
(C6); bag pocket canonical generation (D1-D3); badge-growing stock
(E14); storage wallpaper art (F10); Release offered (F12); box
count canonical (F16); save-shape medium (H7); encounter-set ->
map + roster mapping (2.18); weather-code -> state mapping
(3.11); projection/camera value meanings (4.5); lighting-set ->
location/time assignment (5.5); zone/field-map assignment (6.9);
season clock source (7.8); species conversion table (DS1); item
display text, original, 639 items (DS7); nature assignments
(DS9); True chart values incl. Deep + new elements, then chart
wiring (DS10/DS11); class/role renames (DS15); trainer
personal-name swap (DS16); facility level rules + venue mapping
(DS18); placeholder ability maps; script/warp/actor/matrix/prop/
trade ref targets (WG7-WG13 family); original-content rulings
(place names, palettes/art, sound, dialogue, season-to-form,
shop catalogue, battle constants as original values).
NOTHING in this audit guesses any of these. In particular: no
per-move join to game move ids (0/442), no body-part origin
(0/560), no item description, no nature assignment, no True
chart value, no map/roster assignment, and no shop price was
invented — ShopView prices remain the game's existing
placeholders, untouched.

## §4. Validation performed (no full build — PR worker gates)

- Main playableWiring.ts vs staged playable-wiring.ts: `diff`
  exit 0 (identical).
- Main opponentDirection.ts: OPPONENT_COUNTS read from the file
  (560 / 442 / 13 / 105 / 0 confirmed origins); .single.dx = -104
  confirmed as the value PixiBattleCanvas signs from.
- PcView.patch anchors: all three old-text strings occur exactly
  once each in main PcView.tsx; STORAGE_RULES import already
  present (line 8); fields partyMax (= 6), slotsPerBox (= 30),
  depositBlockedWhenItWouldEmptyParty (= true) verified in main
  playableWiring.ts; patched copy brace count 91/91, paren count
  89/89, old `/6` heading absent, guard present.
- Import resolution for staged patches: PcView.patch needs no new
  import (STORAGE_RULES already imported); the eight no-patch
  files add no imports. All patch files resolve to current main
  library modules (playableWiring, opponentDirection) — no staged
  copy is imported.
- Forbidden grep over `callsites/` + this audit file, with exact
  franchise character names, cry identifiers, logo marks, dialogue
  lines, and town names from the source games: 0 true hits. Two
  near-matches were checked and cleared, not counted: the English
  word "palettes" (matched by a loose substring pattern, not a
  place or character name) and the staged-map generation label in
  row 2.16's name (a generation label from the staged map itself,
  not a character, cry, logo, dialogue line, or town name). Only
  generic terms (creature, capture device, storage, index) and the
  game's own existing item/screen names appear, and no new
  forbidden identifier was introduced by this audit. (Note: the
  game's own existing strings inside quoted main-file evidence,
  e.g. button labels already on main, are quoted as evidence,
  not added.)
- NOT validated here (PR worker's job): full `npm run build` +
  lint + validate on a clean copy with PcView.patch applied;
  the flagged new-behaviour guard must be re-checked in play
  (depositing the last member is currently possible, so this
  patch changes a reachable behaviour — it must not be merged
  as "outcome-identical").

## §5. Files staged (this audit only — nothing in the game tree)

- `callsites/PcView.patch` — the only real patch (F14).
- `callsites/BattleView.patch`, `callsites/BagView.patch`,
  `callsites/RosterView.patch`, `callsites/WorldEngine.patch`,
  `callsites/ArenaBattleView.patch`, `callsites/GameShell.patch`,
  `callsites/ShopView.patch`, `callsites/PixiBattleCanvas.patch`
  — one file per view as required; each states NO PATCH STAGED
  (or, for ShopView/PixiBattleCanvas, ALREADY ON MAIN) with the
  exact evidence, so the PR worker skips them instead of
  guessing a patch.
- `callsites-audit.md` (this file) — the per-row table + totals.

## §6. Recommended next steps for the parent / PR worker (not done here)

1. Apply ONLY PcView.patch, behind the full build gate, keeping
   the NEW BEHAVIOUR flag on the deposit guard visible in the PR
   body. Do not merge it as outcome-identical.
2. Do NOT create a PR from the eight no-patch files; they are
   audit evidence, not changes.
3. The real unblocking work is NOT more view patches: it is (a)
   a battleResolver diff for B5/B12/B14-B21/B27/B28 + DS5/DS20,
   (b) instance/store fields for held-item/nature/ability,
   (c) Mars decisions for pockets, encounter/map/roster
   assignment, weather codes, and box count, and (d) new systems
   (battle bag/party screens, terminals, mailbox, fishing,
   facilities, battle weather, trainer card, save dialog).
   Each of those is a separate lane's work, not a call-site patch.
4. If a future lane re-counts, re-read main first: opponentDirection
   has already drifted once (PR #262 shape -> current
   BattleFormat shape). Never trust a staged copy over main.
