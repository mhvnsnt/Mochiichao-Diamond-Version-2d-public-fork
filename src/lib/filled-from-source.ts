// Filled-from-source constants — STAGED ONLY, imported nowhere yet.
// No PR, no merge, no game-tree edits, no edits to the dirty work
// tree, no edits to other lanes' staging. Black 2 (most recent gen
// on disk) is canonical where generations differ, per the Mars
// fill-from-source rule 2026-10-27 ~07:43 CDT. Values are source
// values as-is; where a Mars decision overrides a source cap, the
// override is a separate field marked MARS, never mixed into the
// source field. No species names, no character names, no literal
// dialogue, no images, no logos, no creature voices: identifiers
// below are numeric indices and generic terms only. Opponent
// body-part origins are NOT in this file (separate worker).
// See filled-from-source.json for the per-row source citations
// and fill-from-source-report.md for the counts.

export const MOVE_CATEGORY_STATUS = 0;
export const MOVE_CATEGORY_PHYSICAL = 1;
export const MOVE_CATEGORY_SPECIAL = 2;

// Per-move category, by move index in generated/moves.txt order.
// Index 0 is the placeholder move entry (data file carries category
// STATUS, power 0, pp 0 — not a playable move). Indices 1..559 are
// the playable moves. Counts: PHYSICAL 221, SPECIAL 143,
// STATUS 195 playable + 1 placeholder = 196 in the data files.
// Source: pokebw2/res/moves/*/data.json field "category";
// numeric values: pokebw2/include/constants/battle.h:77-79.
export const MOVE_CATEGORY_BY_INDEX: ReadonlyArray<number> = [
  0,1,1,1,1,1,1,1,1,1,1,1,1,2,0,1,2,1,0,1,
  1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,
  1,1,1,0,1,0,0,0,0,2,0,2,2,2,0,2,2,2,2,2,
  2,2,2,2,1,1,1,1,1,1,1,2,2,0,0,1,2,0,0,0,
  2,0,2,2,2,2,0,2,1,1,1,1,0,2,2,0,0,0,1,1,
  0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,
  1,1,1,2,2,1,2,1,1,2,1,1,1,0,0,0,1,0,2,0,
  1,1,0,1,0,2,1,0,0,2,0,0,1,1,1,1,0,1,1,0,
  0,2,1,1,0,1,0,1,1,0,0,0,1,2,0,1,0,2,0,1,
  0,2,0,1,0,1,0,0,2,2,2,0,2,0,0,0,2,0,1,0,
  1,0,2,0,0,1,1,0,0,1,1,1,0,0,0,0,1,1,1,0,
  0,1,1,1,1,2,0,0,1,1,0,1,1,1,0,0,0,2,1,2,
  0,0,1,2,0,1,2,2,2,1,2,1,1,2,0,2,0,2,0,0,
  0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,
  1,0,1,1,2,0,0,0,0,0,1,1,1,0,0,2,2,0,0,1,
  0,1,1,0,2,1,1,2,2,1,1,2,0,0,2,2,0,1,2,0,
  0,0,0,2,2,1,2,1,1,2,2,1,1,1,0,0,0,1,2,0,
  1,2,1,1,1,2,0,0,1,0,1,2,2,2,2,0,0,0,1,1,
  1,0,2,1,1,1,0,0,1,1,1,1,1,0,1,0,2,0,2,0,
  0,0,0,0,0,0,1,1,0,1,0,0,0,0,1,1,2,0,1,2,
  1,1,1,2,1,2,2,1,2,1,2,2,2,1,2,0,1,0,1,1,
  1,1,1,1,1,1,2,1,1,2,2,1,0,0,2,2,2,2,1,1,
  1,1,1,1,1,0,0,2,2,2,1,2,1,1,1,0,0,1,1,2,
  2,0,1,2,0,2,2,1,0,0,0,0,0,2,2,0,0,0,0,1,
  1,2,2,0,1,2,2,0,1,0,1,2,1,0,0,0,2,2,1,2,
  2,0,0,2,0,0,2,1,0,1,2,0,1,0,1,2,0,2,2,2,
  2,2,2,1,2,1,0,2,1,1,1,1,1,1,1,1,2,1,0,2,
  2,1,2,1,1,2,2,2,2,2,1,2,2,1,2,2,1,1,2,1,
];

// Ability placeholder resolution. ABILITY_NONE is index 0 in
// pokebw2/generated/abilities.txt. A slot holding it means the
// creature has no ability in that slot: resolve to null, never to
// a named placeholder ability. Counts over 652 data entries
// (2 regular slots + 1 hidden slot each = 1956 slots):
// placeholder slots resolved to null 353, filled with a named
// ability 0 (source gives absence, not a name — inventing one
// would violate the rule). Real ability slots 1603.
// Source: pokebw2/res/pokemon/*/data.json fields "abilities"
// and "hidden_ability"; pokebw2/res/abilities/none.json.
export const ABILITY_NONE_INDEX = 0;
export type AbilitySlot = number | null;
export function resolveAbilitySlot(abilityIndex: number): AbilitySlot {
  return abilityIndex === ABILITY_NONE_INDEX ? null : abilityIndex;
}
export const ABILITY_SLOT_COUNTS = {
  dataEntries: 652,
  slotsExamined: 1956,
  placeholderSlotsToNull: 353,
  placeholderSlotsToNamedAbility: 0,
  realAbilitySlots: 1603,
  secondRegularSlotNull: 276,
  hiddenSlotNull: 75,
  firstRegularSlotNull: 2,
} as const;

// Badge behaviour as coded in Black 2 (canonical gen).
// There is NO stat badge boost in Black 2 battle code: the only
// battle use of the badge count is the obedience cap
// (maxLevel = (badges + 1) * 10 while badges < 8).
// The Gen-3 stat boost (x110/100) is staged separately below
// as a cross-gen record, NOT as the Black 2 canonical value.
export const BLACK2_BADGE_OBEDIENCE = {
  maxLevelWhileBadgesBelow8: "(badges + 1) * 10",
  badgeCountCap: 8,
  statBadgeBoostInBlack2BattleCode: false,
} as const;
export const GEN3_BADGE_BOOST = {
  // pokefirered-leafgreen src/pokemon.c:2440-2446 + battle_main.c
  // speed block: player-side only, not in link battles.
  // badge1 -> attack, badge5 -> defense, badge7 -> sp.atk/sp.def,
  // badge3 -> speed; each multiplied by 110/100.
  multiplierNumerator: 110,
  multiplierDenominator: 100,
  playerSideOnly: true,
  excludedInLinkBattles: true,
} as const;

// Bag, Black 2 canonical (source caps, for the record).
// Mars decision 2026-10-27 ~07:46 CDT lifts every cap below for
// the game build (unlimited boxes, unlimited storage, stacks
// above the source maxima); the MARS fields carry that override
// and the SOURCE fields must never be wired as limits.
export const BLACK2_BAG_SOURCE = {
  pockets: [0, 1, 2, 3, 4, 5],
  pocketCount: 6,
  freeSpacePocketIndex: 5,
  slotsByPocket: { items: 310, medicine: 48, moveMachines: 109, berries: 64, keyItems: 83 },
  totalDistinctSlots: 614,
  stackMaxGeneral: 999,
  stackMaxMoveMachine: 1,
  battlePocketCount: 4,
  partyMax: 6,
} as const;
export const BLACK2_BOX_SOURCE = {
  boxesMax: 24,
  slotsPerBox: 30,
  sourceTotal: 720,
  boxesOpenAtStart: 8,
  boxesPerUnlock: 8,
  boxNameLength: 20,
  battleBoxCount: 1,
  battleBoxSlots: 6,
  dayCareSlots: 2,
} as const;
export const MARS_CAPS_LIFTED = {
  boxCount: "unbounded",
  totalPcStorage: "unbounded",
  itemStack: "above source maxima",
  pcCreatureCount: "above 100, unbounded",
  keepStructure: "Black 2 pockets + 30 slots per box",
} as const;

// PC release as coded in Black 2: offered, with blocks.
// Sequence: Box2Seq_Release -> ReleaseCheck -> (Yes/No) ->
// ReleaseCheckMoves -> ReleaseDo (slot cleared). Blocks:
// last usable party member, party member holding mail, unhatched
// flag, fused-form flag. The move-lock branch exists in the
// sequence but its trigger function returns -1 unconditionally
// in this decomp, so as coded no move blocks a release.
export const BLACK2_PC_RELEASE = {
  offered: true,
  blockedWhen: [
    "last usable party member (no other usable member with HP > 0; unhatched members do not count)",
    "party member holding mail",
    "unhatched flag set",
    "fused-form flag set",
  ],
  moveLockBranchTriggerInDecomp: "constant -1 (never triggers as coded)",
  confirmStep: "yes/no prompt before removal",
} as const;

// Save shape, Black 2 canonical. NOT the Gen-3 sector shape:
// Gen 3 (2 slots x 14 sectors x 3968 + 128 footer) is a different
// generation's medium and is recorded only as contrast below.
export const BLACK2_SAVE = {
  mainAddr: 0,
  backupAddr: 0x26000,
  saveSize: 0x26000,
  magic: 0x31053527,
  footerSize: 0x10,
  perBlockFooter: { countBytes: 2, crcBytes: 2 },
  crcAlgorithm: "CRC-16-CCITT, polynomial 0x1021",
  recovery: "newer-copy CRCs tried first; per-block bad blocks are recopied from the good copy; a block bad in both copies breaks the save",
  blockCountNote: "one block per subsystem (see save_table.c SAVEDATA_INIT); box trays are blocks 1..24 of the main save",
} as const;
export const GEN3_SAVE_CONTRAST_ONLY = {
  slots: 2,
  sectorsPerSlot: 14,
  sectorDataBytes: 3968,
  sectorFooterBytes: 128,
  sectorSizeBytes: 4096,
  notBlack2Canonical: true,
} as const;

// Options frame types as coded, per generation. Black 2 has NO
// user frame option in its config (see config.h): its frame
// system is a 9-piece window frame (corners + edges, middle not
// drawn) selected by archive type id, not by the player.
// FireRed: 10-entry table in this decomp (guard falls back at
// index >= 20; save field is 5 bits). HeartGold: 20 choices.
// Art for the frames is NOT staged here (original art owed).
export const OPTIONS_FRAME_TYPES = {
  black2UserFrameOption: false,
  black2FrameStructure: "9 pieces: 4 corners + 4 edges + middle (middle not drawn)",
  fireRedTableEntries: 10,
  fireRedSaveFieldBits: 5,
  fireRedGuardFallbackIndex: 20,
  heartGoldChoices: 20,
  heartGoldSaveFieldBits: 5,
} as const;

// Field weather, Black 2: 15 overlay entries, 2 transition
// functions (0 sequential, 1 crossfade), 2 background layers.
// Battle weather codes are a separate 4-code set.
export const BLACK2_FIELD_WEATHER = {
  overlayEntryCount: 15,
  overlayIds: [74, 75, 76, 77, 75, 75, 76, 76, 75, 78, 78, 78, 77, 78, 78],
  transitionFunctions: ["sequential", "crossfade"],
  backgroundLayers: 2,
  precedence: ["forced override", "linked-game override", "event-flag override", "birthday override", "seasonal-calendar override", "zone default"],
  noneSentinel: 0xffff,
} as const;
export const BLACK2_BATTLE_WEATHER = { sun: 1, rain: 2, hail: 3, sandstorm: 4 } as const;

// Field camera, Black 2 (struct fields, not art).
export const BLACK2_FIELD_CAMERA = {
  transformTypes: ["target-relative", "camera-relative", "fixed-all"],
  boundaryFunctions: ["none", "restrict-rect", "restrict-circle", "repeal-rect"],
  boundarySlots: 4,
  createDefaults: { zoom: 120, yaw: 0, pitch: 0, useBoundary: true, boundaryId: 0xffff },
  followDelay: { ringCount: 7, maxDelay: 6, flags: 2 },
  defaultsFields: ["zoom", "pitch", "yaw", "unkC", "unk10", "swapMode", "fov", "zNear", "zFar", "bind", "target"],
  projectionFields: ["type", "param1", "param2", "param3", "param4", "near", "far", "ndcRangeOverride"],
} as const;

// Lighting lookup shape. Full numeric sets (210 sets x 15
// periods x 4 lights = 3150 periods, 12600 lights) are already
// staged in batch-b decomp_black2_lighting.json and are NOT
// duplicated here (disk is full); this table carries the shape
// + runtime so the staged sets are usable without re-reading.
export const BLACK2_LIGHTING_SHAPE = {
  fieldSets: 200,
  battleSets: 10,
  totalSets: 210,
  periodsPerSet: 15,
  lightsPerPeriod: 4,
  totalPeriods: 3150,
  totalLights: 12600,
  periodFields: ["end hour", "end minutes", "4 lights (enabled, colour rgb, direction xyz)", "diffuse", "ambient", "specular", "emission", "fog", "clear"],
  runtimeMaxEntries: 16,
  runtimePick: "entry by day-seconds; period end second adjusted by season; colour + direction interpolated; flash state supported",
  stagedNumericSource: "batch-b/decomp_black2_lighting.json",
} as const;

// Season clock as coded: device RTC cached date.
// season = (month - 1) % 4; 0 spring, 1 summer, 2 autumn,
// 3 winter. A stored-season force-sync flag overrides RTC.
export const BLACK2_SEASON_CLOCK = {
  source: "device RTC cached date",
  formula: "(month - 1) % 4",
  seasons: ["spring", "summer", "autumn", "winter"],
  monthsPerSeason: "Jan/May/Sep spring; Feb/Jun/Oct summer; Mar/Jul/Nov autumn; Apr/Aug/Dec winter",
  override: "force-season-sync flag: stored season wins over RTC while set",
  nextPrevious: "modulo 4 arithmetic",
} as const;

// Shop stock progression as coded (badge mart only; other
// shops use fileId + 6 with a per-file count table).
// BADGE_SHOP_DAT_IDS[badgeCount] for badgeCount 0..8.
export const BLACK2_SHOP_PROGRESSION = {
  badgeMartFileByBadgeCount: [0, 1, 1, 2, 2, 3, 3, 4, 5],
  nonBadgeMartFile: "fileId + 6",
  countSource: "per-file count table (shop item counts archive)",
  priceSource: "item price parameter, bargain modifier applied",
  listKinds: ["items", "move-machines with numbers", "tutor moves"],
  currencies: ["money", "battle points", "tutor shards"],
  perFileItemListsNote: "item lists live in the shop-items archive, not as decomp JSON on disk; the progression mapping above is the coded rule, the per-file lists are extraction work, not invented here",
} as const;

// Facility level rules: ABSENT from facility data as coded.
// 0/1285 facility trainer files and 0/6000 facility set files
// carry a level field (set fields: creature ref, moves,
// ev flags, nature, held item, form). The "level" variable in
// the subway picker code is a difficulty tier selecting a
// trainer range, not a creature level. No facility creature
// level rule is staged — inventing one (e.g. 50) is refused.
export const FACILITY_LEVEL_RULES = {
  facilityTrainerFiles: 1285,
  facilitySetFiles: 6000,
  filesCarryingLevelField: 0,
  levelRulePresentInFacilityData: false,
  subwayPickerLevelMeaning: "difficulty tier selecting a trainer range, not a creature level",
  regularTrainerLevelsNote: "non-facility trainer parties DO carry levels in res/trainers/data files; that is a different system, not a facility rule",
} as const;
