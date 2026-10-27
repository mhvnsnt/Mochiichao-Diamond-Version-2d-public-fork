# Battle core + opponent-direction inventory — WORKER 1/6 (code inventory ONLY)

Date: 2026-10-26. Owner for consumption: the combat coordinator (ordered 19:49 CDT, owns
all attacks / animations / origins / angles, front + back, player + opponent).
This worker does NOT build VFX assets, does NOT overwrite combat / VFX staging, and does
NOT duplicate the coordinator's build. No git commit, no PR, 0 deletions, from this file.

## 0. Read-this-first corrections (do not re-propose the stale swap)

- Live main BattleView does NOT use the stale work-clone damage function. Live main uses
  a resolver module (PR #107, another lane) that already holds accuracy, priority, speed,
  crit stages, effects, and turn order. Swapping live BattleView to the reference
  battle-math module would clobber that resolver and change crit / multi-hit behaviour
  (resolver: crit stage table {16, 8, 4, 3, 2} with x2; multi-hit 35 / 35 / 15 / 15;
  reference module: crit 1/24 with x1.5; multi-hit uniform 2-5).
  RULE FOR THIS MAPPING: every NEED item below is a diff / addition AGAINST the resolver,
  never a proposal to replace the resolver. The coordinator diff-verifies each HAVE*
  row against live main before wiring; this inventory was read from the work clone on
  branch feature/unified-data-sprites-2.5d (dirty tree, stale versus live main), so
  HAVE* means "replacement exists per the PR #107 correction, diff-verify owed", not
  "re-verified in live main by this worker".
- Reference module status: battle-math stays on main as a tested reference module,
  NOT as the live battle engine.
- True Elements cross-reference only (data worker's area, NOT duplicated here): locked
  list 19/19 = 100% per MEMORY 2026-10-26 21:13 CDT, Deep Option A chosen — Deep stays a
  separate mystical legendary, count 19 stands. Matchup values for Deep + new elements:
  0/19 rows = 0% — owed by the data worker, NOT invented here.
- Sanitisation rule applied (Mars 2026-10-26 20:39 CDT): swap out ONLY species /
  characters, species names, images, logos, and actual literal dialogue (creature cries
  sit in the swap bucket as a creature's voice). Literally everything else is usable
  at 100%: code, move names / moves, systems, structure, values. This file therefore
  names NO species, quotes NO source-game dialogue, and carries NO creature art.
  Source identifiers that are pure code (function / constant names) are kept for
  traceability; staged snippets in the companion file use renamed identifiers.
  Forbidden-grep result for this file + companion file: see section 7.

## 1. Sources verified on disk (counts match the task order)

| Source tree | Files counted | Battle-core read level |
|---|---|---|
| fresh-start/pokefirered-leafgreen | 9,858 | Deep read: battle_main, battle_util, battle_script_commands, battle_controller_player, battle_controller_opponent, battle_interface, battle_setup, battle_anim, battle_anim_mons, battle_anim_fight, battle_anim_bug, battle_anim_dark, battle_gfx_sfx_util, creature-data-module damage fn, constants/battle.h, constants/battle_move_effects.h |
| fresh-start/pokeheartgold | 14,776 | Read: src/battle/* (battle_command, battle_controller, battle_controller_player, battle_input, battle_system, battle_setup, battle_hp_bar, party_gauge, trainer_ai) |
| fresh-start/pokebw2 | 129,633 | Read: include/battle/* headers (btl_action_order, btl_calc, btl_server, btl_client, btlv_* view headers, battle menus b_bag / b_plist / b_choice) |
| decomps/pokeemerald | 11,586 | File-list verified: same battle file family as FireRed (battle_main, battle_anim_*, battle_controllers, battle_util) — line-level diff NOT done in this pass |
| decomps/pokeruby | 9,812 | File-list verified, same family — line-level diff NOT done |
| decomps/pokediamond | 33,283 | File count only — battle diff NOT done |
| decomps/pokeplatinum | 28,098 | File count only — battle diff NOT done |
| decomps/pokecrystal | 4,641 | File count only — battle diff NOT done |
| decomps/pokegold | 4,110 | File count only — battle diff NOT done |
| decomps/pokeyellow | 3,056 | File count only — battle diff NOT done |
| decomps/pokered | 2,904 | File count only — battle diff NOT done |

Deep-read gens: 3/11 trees = 27%. File-list / count-only gens: 8/11 trees = 73%.
Gap to 100% on source coverage: line-level battle diff owed for 8/11 trees (emerald,
ruby, diamond, platinum, crystal, gold, yellow, red). That gap is inventory depth, not
a wiring blocker for the Gen 3 core below — Gen 3 is the canonical base because the
work clone's decomp order is FireRed first, then HeartGold, then Black 2.

## 2. Battle flow order (Gen 3 canonical base, FireRed)

Order is a state machine, not a single function. Main callback runs one state fn per
frame from the chain below. Mochiichao replacement sits in the resolver + BattleView
turn driver, in this exact order:

1. Init battle (CB2_InitBattle): allocate battle resources, battle sprite data,
   creature sprite graphics; set intro scanline / background / palettes; set up battle
   variables. Source: src/battle_main.c CB2_InitBattle, CB2_InitBattleInternal.
2. Intro: terrain from setup, entry background, draw opposing + player creatures,
   print side banners / send-out lines, record seen creatures, switch-in sequence.
   Source: src/battle_main.c BattleIntro* chain; src/battle_setup.c.
3. Pre-first-turn events, fastest-to-slowest: initial turn-order sort IGNORING chosen
   moves (speed only), then switch-in abilities fastest-to-slowest, then switch-in
   items fastest-to-slowest, then clear turn values / special statuses / flinch flags,
   then go to action selection. Source: src/battle_main.c TryDoEventsBeforeFirstTurn.
4. Action selection (player side, dedicated screens — see section 5): action menu,
   then move menu, then target select, then party / bag screens as chosen.
   Source: src/battle_controller_player.c PlayerHandleChooseAction / ChooseMove /
   HandleInputChooseTarget.
5. Turn-order build (SetActionsAndBattlersTurnOrder): run action goes first alone;
   otherwise use-item and switch actions go before ALL move actions (in chooser order);
   move actions are then bubble-sorted by GetWhoStrikesFirst (priority, then speed).
   Source: src/battle_main.c SetActionsAndBattlersTurnOrder.
6. Execute actions in turn order from the action table (14 entries): use-move,
   use-item, switch, run, capture-park actions (4: watch carefully, throw capture
   device, throw bait, go near, run), tutorial throw, exec-script, try-finish,
   finished, nothing-fainted. Source: src/battle_main.c sTurnActionsFuncsTable.
7. Move execution script order (per move): attack line, PP deduct (Pressure adds +1
   where it applies), accuracy check, crit calc, damage calc, type modulation, HP bar
   update, secondary-effect rolls, faint checks. Source: src/battle_script_commands.c
   Cmd_attackstring / Cmd_ppreduce / Cmd_accuracycheck / Cmd_critcalc /
   Cmd_damagecalc / Cmd_adjustnormaldamage.
8. End of turn, in order: field end-turn effects, then per-battler end-turn effects in
   turn order (ingrain heal, end-turn abilities, items x2 passes, leech drain, poison,
   toxic, burn, nightmare, curse, wrap, plus wish / future-sight / perish-song /
   weather / terrain trackers in DoFieldEndTurnEffects). Source: src/battle_util.c
   DoBattlerEndTurnEffects (ENDTURN_* tracker order), DoFieldEndTurnEffects.
9. Outcome table (9 entries): continue, won, lost, drew (handled by the lost handler),
   ran, player-teleported, creature-fled, caught, out-of-capture-devices — each maps to
   its own end handler. Source: src/battle_main.c sEndTurnFuncsTable.
10. Faint handling: fainted-action state machine runs replacement selection before the
    next turn's action selection; a side with no able creatures ends the battle at
    step 9. Source: src/battle_main.c fainted-actions state + battle_util faint paths.

## 3. Mapping table — source element -> Mochiichao replacement in that exact spot

Status key: HAVE* = replacement exists per the PR #107 resolver correction (coordinator
diff-verifies against live main; NOT re-verified here). NEED TO MAKE = no replacement
confirmed by this inventory; wire as a diff against the resolver, never by replacing it.
Counts: HAVE* 6/28 = 21%, NEED TO MAKE 22/28 = 79%.

| # | Source element (file anchor) | Mochiichao replacement in that spot | Status |
|---|---|---|---|
| 1 | Init / state-machine chain (battle_main.c CB2_InitBattle, gBattleMainFunc) | Resolver + BattleView turn driver owns init; full CB2 chain (intro -> pre-turn -> selection -> execution -> end-turn -> outcome) ported as driver states | NEED TO MAKE |
| 2 | Intro / send-out sequence (battle_main.c BattleIntro*, battle_setup.c) | BattleView intro sequence (background, creature entry, side banners) in intro order | NEED TO MAKE |
| 3 | Action selection: action menu -> move menu -> target -> party/bag (battle_controller_player.c) | Dedicated full-screen views in section 5 order (BattleView action screen, move screen, target select, BagView, PcView/party screen) | NEED TO MAKE |
| 4 | Turn-order sort: priority first, then speed, random tie (battle_main.c GetWhoStrikesFirst, SetActionsAndBattlersTurnOrder) | Resolver turn order (speed + priority + random ties per correction) | HAVE* |
| 5 | End-turn sequence order (battle_util.c DoBattlerEndTurnEffects, DoFieldEndTurnEffects) | Resolver end-turn pass in the ENDTURN_* tracker order of section 2 step 8 | NEED TO MAKE |
| 6 | Base damage core (creature-data-module CalculateBaseDamage; battle_script_commands.c Cmd_damagecalc) | Resolver damage core: ((2*Level/5+2) * Power * Attack / Defense) / 50 + 2, then crit / STAB / type / screen / weather / spread adjustments in source order | HAVE* |
| 7 | Physical / special category rule (Gen 3: by element category; Gen 4+: per-move category) | Mochiichao move data already carries a per-move category — canonical = per-move category; coordinator confirms, Gen 3 type-split kept as reference only (NOT silently decided here beyond the existing data shape) | NEED TO MAKE (confirm owed) |
| 8 | STAB x1.5 (Cmd_damagecalc: same-element move bonus) | Resolver STAB x1.5 | HAVE* |
| 9 | Type multipliers 0 / 0.5 / 1 / 2 per defending element, applied per element then combined (Cmd_damagecalc ModulateDmgByType, floor 1 if non-zero) | Resolver type multiplier; chart VALUES are the True Elements chart (data worker's area — Deep row/column TBD, never invented here) | HAVE* |
| 10 | Crit stages + x2 (battle_script_commands.c Cmd_critcalc; table {16, 8, 4, 3, 2} = 1/16, 1/8, 1/4, 1/3, 1/2; crit ignores negative attacker stages and positive defender stages; blocked by armour abilities) | Resolver crit: same stage table x2 per correction (matches source exactly; reference module's 1/24 x1.5 is NOT the target) | HAVE* |
| 11 | Accuracy: move accuracy x accuracy-stage ratio, then modifiers (battle_script_commands.c Cmd_accuracycheck; stage table section 6) | Resolver accuracy check in the same order (protect -> always-hit / semi-invulnerable -> stage ratio -> ability / item / weather modifiers -> roll) | HAVE* |
| 12 | Random damage roll 85-100 inclusive (battle_script_commands.c ApplyRandomDmgMultiplier: 100 - (rand % 16)) | Resolver damage roll — diff-verify the exact 85-100 shape against the resolver; stale view already used 85-100 | NEED TO MAKE (diff owed) |
| 13 | Speed modifiers in turn order (battle_main.c GetWhoStrikesFirst): weather abilities x2, stage ratios, held-item halving / quick-claw max, paralysis /4, player-side badge boost x1.1 (non-link) | Resolver speed value — badge boost has NO Mochiichao counterpart confirmed: drop-or-map decision owed (Mars / coordinator), NOT decided here | NEED TO MAKE |
| 14 | Stat stages -6..+6 with ratio table (creature-data-module gStatStageRatios; section 6) applied to attack / defense / special / speed / accuracy / evasion | Resolver stat-stage application on every stat the source applies it to (not raw stats only) | NEED TO MAKE |
| 15 | Primary statuses, bit layout + end-turn fractions (constants/battle.h STATUS1_*; battle_util.c ENDTURN_*): sleep (turn-count bits 0-2), poison 1/8, toxic 1/16 x counter (counter increments, capped), burn 1/8, freeze, paralysis (speed /4 + action-fail chance in move scripts) | Resolver status engine with the same bit layout and fractions | NEED TO MAKE |
| 16 | Volatile statuses (STATUS2 / STATUS3): confusion (fixed 40-power self-hit), flinch (cleared each turn), substitute, protect, endure, nightmare 1/4, curse 1/4, wrap 1/16, leech 1/8, ingrain heal 1/16, uproar, recharge, multi-turn lock | Resolver volatile-status engine in move-script + end-turn order | NEED TO MAKE |
| 17 | Multi-hit moves (battle_move_effects.h EFFECT_MULTI_HIT) | Resolver multi-hit (distribution on file 35 / 35 / 15 / 15 per correction; source-distribution diff owed — do NOT overwrite with the reference module's uniform 2-5) | NEED TO MAKE (diff owed) |
| 18 | Charge / two-turn moves (EFFECT_CHARGE, solar-type two-turn, fly / dig / dive / bounce family: first turn charge / vanish, second turn strike; weather halves solar-type power) | Resolver two-turn state machine (charge flag + semi-invulnerable flags) | NEED TO MAKE |
| 19 | Recoil moves (EFFECT_RECOIL, EFFECT_RECOIL_IF_MISS: recoil fraction of damage dealt, or on miss) | Resolver recoil step after damage lands / on miss | NEED TO MAKE |
| 20 | Trapping / wrap family (EFFECT_TRAP: multi-turn 1/16 end-turn damage, escape ends it) | Resolver trapping state + end-turn wrap step | NEED TO MAKE |
| 21 | Protect / endure / substitute / false-swipe floor (Cmd_adjustnormaldamage: endure + focus-band + false-swipe leave target at 1 HP; substitute absorbs damage) | Resolver guard layer in accuracy + damage steps, in source order | NEED TO MAKE |
| 22 | Weather + field (battle_util.c weather paths; battle_main.c WEATHER_HAS_EFFECT): rain halves fire / boosts water x1.5; sun boosts fire x1.5 / halves water; sand / hail end-turn damage paths; reflect halves physical, light screen halves special (doubles with 2 alive: 2/3 instead of 1/2); spread moves halve in doubles | Resolver field / weather / screen layer in damage order | NEED TO MAKE |
| 23 | Healthbox + HP bar (battle_interface.c: healthbox = 2 sprites + 1 bar sprite; bar follows box at +16 / +8 x-offsets; doubles healthbox-as-bar variant) | BattleView healthbox + HP bar presentation, engine-added (never baked into creature art) | NEED TO MAKE |
| 24 | Opponent-direction vectors (section 4: single + doubles anchor tables) | Coordinator's origin / angle tables: vector = target anchor - attacker anchor, computed per pair, never a flat-right copy of player art | NEED TO MAKE (coordinator-owned) |
| 25 | Opponent-direction archetypes (section 4: 8 archetypes, code-anchored) | Coordinator's per-archetype origin rules + VFX worker's art side | NEED TO MAKE (coordinator-owned) |
| 26 | Battle windows, full-screen order (constants/battle.h B_WIN_* 0-24; section 5) | Dedicated full-screen views (BattleView / BagView / party screen) in source window order; NO overlay popups, NO terminal menus | NEED TO MAKE |
| 27 | Party / switch / faint outcomes (battle_controller_player.c switch prompt window; battle_main.c fainted-actions state) | Party screen + forced-switch flow before next action selection | NEED TO MAKE |
| 28 | Capture / run / flee rules (battle_main.c run precedence; battle_util.c flee / capture paths; capture-park action table) | BattleView run + RingCaptureView capture flow in source precedence (run first alone; capture-park actions as their own table) | NEED TO MAKE |

## 4. OPPONENT DIRECTION — code truth, not art guesswork (for the coordinator)

### 4.1 The coordinate rule (the whole fix in one sentence)

Every battle animation in the source code places its effect from the ATTACKER's sprite
anchor to the TARGET's sprite anchor using the same two accessor calls; there is no
separate "opponent art direction" — direction falls out of which side is the attacker.
An opponent attack therefore travels from the top-right anchor toward the
bottom-left anchor: leftward and downward on screen. Any opponent set drawn travelling
rightward is travelling AWAY from the player side and is wrong by construction.

Anchors (battle_anim_mons.c sBattlerCoords, 240x160 screen, y increases downward;
position order: 0 player-left, 1 opponent-left, 2 player-right, 3 opponent-right):

| Battle | Attacker -> target | Attacker anchor (x, y) | Target anchor (x, y) | Vector target - attacker (dx, dy) |
|---|---|---|---|---|
| Single | Opponent -> player | (176, 40) | (72, 80) | (-104, +40) — left + down |
| Single | Player -> opponent (mirror check) | (72, 80) | (176, 40) | (+104, -40) — right + up |
| Doubles | Opponent-left -> player-left | (200, 40) | (32, 80) | (-168, +40) — left + down |
| Doubles | Opponent-right -> player-right | (152, 32) | (90, 88) | (-62, +56) — left + down |
| Doubles | Player-left -> opponent-left | (32, 80) | (200, 40) | (+168, -40) — right + up |

Y detail: the Y used for effects is NOT the raw table Y. It is the picture-offset Y
(BATTLER_COORD_Y_PIC_OFFSET): table Y + per-creature front/back picture Y-offset,
minus elevation for the opposing side, +8 for the player side in the offset variant,
clamped to screen bottom. Source: battle_anim_mons.c GetBattlerSpriteCoord,
GetBattlerSpriteFinal_Y, GetBattlerYDelta, GetBattlerElevation. X detail: X and X_2
both read the same table X. Shadows sit at target X, target Y + 29 (battle_gfx_sfx_util.c
opponent shadow creation) — engine-added, never baked into art.

No degree angles are stated here on purpose: an angle is atan2(dy, dx) computed from
the dx / dy pair above per attacker-target pair. The coordinator computes it; this
inventory does not guess it, and no flat-right player angle may be reused for opponents.

### 4.2 What the code does NOT encode (plain gap, coordinator must build it)

The battle animation code encodes sprite-centre / sprite-edge anchors plus per-animation
numeric offsets (the animation script's argument slots). It does NOT encode body parts.
"Mouth / hands / cannons / whatever the move's origin is" is therefore NOT a value
readable from battle_anim code — it is an art-layer anchor on each creature's rig
(mouth point, hand point, launcher point) that the VFX worker must define per creature,
with the coordinator pinning each move's origin to: attacker anchor + animation offset,
then the rig point. Any table that claims a code file gives a mouth coordinate for a
specific move would be invented; this inventory does not make that claim.
Per-move origin / angle table: 0/1 tables = 0% in this worker — coordinator-owned
deliverable, built from (a) the vectors above, (b) each move's animation script
argument offsets, (c) the VFX rig points. This worker hands over (a) + the file anchors
for (b); it does not build (c) and does not duplicate the coordinator's table.

### 4.3 Opponent-direction archetypes inventoried: 8/8 = 100% (inventory); wiring 0/8 = 0% (coordinator / VFX)

| # | Archetype (code mechanism) | Code anchor (what the code actually does) | Opponent-side rule |
|---|---|---|---|
| A1 | Contact lunge: attacker sprite itself moves to the target | battle_anim_fight.c: effect spawns at attacker coord, ends at target coord (attacker X/Y -> target X/Y pair; attacker-to-target endpoint pair) | Opponent creature lunges left + down to the player anchor, then returns; never slides right |
| A2 | Projectile: effect spawns at attacker, travels to target | battle_anim_bug.c: spawn at attacker X_2 / picture-offset Y (+ script offsets), end at target X_2 / picture-offset Y | Opponent projectile starts top-right, travels left + down to the player anchor |
| A3 | Beam / line: endpoints are attacker + target anchors | battle_anim_dark.c: task stores target X, attacker X, target Y, attacker Y as the line's two endpoints | Opponent beam runs top-right -> bottom-left; line direction reverses versus the player beam |
| A4 | Target-anchored burst / status: effect placed by target sprite edges | battle_anim_dark.c: placement from target sprite left / right / top edge offsets (side-dependent branch) | Burst sits on the PLAYER-side creature (bottom-left), not on the opponent |
| A5 | Attacker-anchored self / field effect: effect spawns at attacker only | battle_anim_mons.c: spawn at attacker X_2 / picture-offset Y | Opponent self-effect sits on the top-right creature; it does not travel |
| A6 | Ground / shadow at target feet: effect at target X, target Y + 29 | battle_gfx_sfx_util.c opponent shadow creation (opponent-left + opponent-right branches) | Ground effect sits under the PLAYER-side creature for opponent attacks |
| A7 | Spread / multi-target: same effect evaluated per target battler, damage halved in doubles when 2 defenders alive | battle_script_commands.c damagecalc spread branch + creature-data-module CalculateBaseDamage doubles branch; target loop in battle_main turn execution | Each target gets its own attacker->target vector; no single shared direction |
| A8 | Target indicator (aim UI, not damage): bounce on the TARGET's healthbox; A confirms, B returns to move select | battle_controller_player.c HandleInputChooseTarget (bounce healthbox, confirm / back keys) | Opponent selection bounces the player-side healthbox when the player targets; the reverse applies for opponent AI targeting (AI path: battle_controller_opponent.c target selection) |

Side-dependent branching is explicit in the code: several animation tasks branch on
position (opponent-left / player-right versus the other two positions) to mirror
placement. The coordinator verifies the exact mirror flag per animation; this inventory
records the branch's existence, not a per-animation flag value it did not read.

## 5. Battle menus as dedicated full screens (NO popups, NO terminal menus)

Gen 3 window table (constants/battle.h B_WIN_*, 25 ids, 0-24): message (0),
action prompt (1), action menu (2), move names top-left / top-right / bottom-left /
bottom-right (3-6), PP (7), move element (8), PP remaining (9), dummy (10),
switch prompt (11), level-up box (12), level-up banner (13), yes/no (14),
versus player / opponent / multi 1-4 / outcome draw / left / right (15-23),
tutorial (24). Order of use in one turn:

1. Action prompt window, then action menu window: 2x2 cursor. Cursor index bits from
   battle_controller_player.c HandleInputChooseAction: bit 0 = left / right column,
   bit 1 = up / down row; A confirms (fight / bag / party / run in that grid order),
   B cancels back only in the doubles partner case, START swaps HP bars with HP text.
2. Move menu: 4 move-name windows in grid order + PP window + element window +
   PP-remaining window; move select cursor moves across the 4 slots; B returns to the
   action menu. Source: battle_controller_player.c HandleInputChooseMove.
3. Target select: bounce on the target healthbox (section 4, A8); A confirms with
   move slot + target packed together; B returns to move select.
4. Party switch: switch-prompt window, then the party screen as its own full screen;
   bag: bag screen as its own full screen; yes/no: yes/no window as its own prompt
   screen. These are screens, not overlays on the battle field — the field stays
   behind them, the menu owns input until it closes.
5. Message window owns all battle text during execution; the action menu is re-shown
   only after execution + end-turn + faint handling complete.

Gen 4 (HeartGold) menu states (battle_input.c, 21 entries): initial, main, numbered
states 3-8, capture-park initial + main, fight, target, yes/no, keep-or-forget-move,
give-up-on-move, switch-or-flee, switch-or-keep, recorder-playback, states 19-20.
Main-menu text-object positions (battle_input.c): fight (128, 83), bag (40, 169),
party (216, 168), run (128, 176) — a 4-corner layout, not the Gen 3 2x2 grid; the
Mochiichao replacement keeps ONE layout (coordinator picks Gen 3 grid vs Gen 4
corners — decision owed, NOT picked here), with the same input order.
Gen 5 (Black 2) menu split: bag UI (b_bag_*), party list UI (b_plist_*), choice UI
(b_choice_main), scenario UI (b_scenario_*) — separate modules per screen, matching
the dedicated-screen rule; battle logic (btl_server) is separate from battle view
(btlv_*) — the same split Mochiichao already has between resolver and canvas views.

Menu inventory: Gen 3 windows 25/25 = 100%, Gen 4 states 21/21 = 100%, Gen 5 modules
enumerated (bag / party / choice / scenario = 4/4 screens). Menu wiring into
Mochiichao views: 0/3 screen families = 0% — NEED TO MAKE (coordinator-owned order,
this worker only inventories).

## 6. Staged sanitized values (full snippets in the companion file)

- Stat-stage ratios, -6..+6: 10/40, 10/35, 10/30, 10/25, 10/20, 10/15, 10/10, 15/10,
  20/10, 25/10, 30/10, 35/10, 40/10.
- Accuracy-stage ratios, -6..+6: 33/100, 36/100, 43/100, 50/100, 60/100, 75/100, 1/1,
  133/100, 166/100, 2/1, 233/100, 133/50, 3/1.
- Crit-stage denominators, stage 0..4: 16, 8, 4, 3, 2 (chance = 1 / denominator).
- Crit-stage increments: focus-energy state +2 steps; high-crit move effects +1 step
  each (several move effects share this); scope-type held item +1 step; two further
  +2-step branches are species-locked held items — REPLACED in the snippet with a
  generic "roster-locked held-item branch (Mochiichao roster lock TBD)".
- Damage core (renamed, companion file): base = floor(floor(floor((2*Level/5+2) *
  Power * Attack / Defense) / 50)) + 2; then x crit (2 or 1), x STAB (1.5 or 1),
  x type multiplier / 10 per element, floor 1 if non-zero; burn halves physical
  (unless the grit-type ability applies); reflect / light screen halve (2/3 in
  doubles with 2 alive); spread moves halve in doubles; weather + explosion-defense
  adjustments in source order.
- Species-locked held-item branches in the source damage function (4 branches keyed
  to specific creatures): ALL replaced by the generic roster-lock note in the snippet.
  Nothing species-keyed ships in staged code.
- Turn-order sort (renamed, companion file): bubble sort over battler order with
  priority-first, speed-second, random tie — plus run-first-alone and
  switch/item-before-moves precedence.

## 7. Sanitisation check + gaps to 100%

Forbidden-grep on the two staged files (species-name sample list + source-game
trademark word + dialogue markers): 0 hits — verified by the worker before handoff
(see companion check note at the end of the snippets file). File paths in this
document are directory names required for traceability, not shipped strings.
Files that could not be sifted cleanly: 0/2 staged files = 0% — no file was left
unsifted; species-locked branches were replaced, not copied.

Gaps to 100% (every unfinished list carries its count):
- Mapping rows NEED TO MAKE: 22/28 = 79% (HAVE* 6/28 = 21%, diff-verify owed on all 6).
- Source-tree line-level diff: 8/11 trees = 73% owed (emerald, ruby, diamond,
  platinum, crystal, gold, yellow, red).
- Opponent per-move origin / angle table: 0/1 tables = 0% — coordinator-owned.
- Opponent archetype wiring: 0/8 = 0% — coordinator / VFX-owned.
- Menu wiring: 0/3 screen families = 0% — coordinator-owned order.
- True Elements matchups (data worker): 0/19 rows = 0% — NOT this worker's area.
- Mars-only decisions owed (NOT decided here): (a) Gen 3 grid vs Gen 4 corner menu
  layout; (b) badge-boost counterpart (drop or progression-bonus map); (c) physical /
  special canonical confirmation (per-move category, per existing Mochiichao data);
  (d) True Elements matchup values incl. Deep (data worker). Count: 4 decisions owed.
- What this worker did NOT touch (per task): black2-everything-else/stage2-pr/,
  wiring/, batch-* dirs, any combat / VFX staging, the dirty work tree's git state
  (no commit, no PR, 0 deletions — work-tree status left exactly as found).

## 8. Files read (traceability — paths as found on disk)

FireRed: src/battle_main.c (4,477 lines), src/battle_util.c (3,252),
src/battle_script_commands.c (9,886), src/battle_controller_opponent.c (1,777),
src/battle_controller_player.c (2,966), src/battle_interface.c (2,240),
src/battle_setup.c (1,070), src/battle_anim.c (1,725), src/battle_anim_mons.c,
src/battle_anim_fight.c, src/battle_anim_bug.c, src/battle_anim_dark.c,
src/battle_gfx_sfx_util.c, src/creature-data-module (damage fn + stage ratios),
include/battle.h, include/battle_controllers.h, include/battle_anim.h,
include/constants/battle.h, include/constants/battle_move_effects.h.
HeartGold: src/battle/battle_command.c (8,084), battle_controller.c (1,545),
battle_controller_player.c (4,005), battle_input.c (4,611), battle_system.c (1,959),
battle_setup.c (570), battle_hp_bar.c (1,479), party_gauge.c (675), trainer_ai.c (67).
Black 2: include/battle/btl_action_order.h, btl_calc.h, btl_server.h, btl_client.h,
btlv_*.h view headers, b_bag_* / b_plist_* / b_choice_main.h menu headers.
Work-clone Mochiichao read for the stale-clone note only: src/components/views/
BattleView.tsx (stale damage fn, lines 116-145) — superseded by the live-main
resolver correction; cited here only to record WHY the stale swap is not proposed.
