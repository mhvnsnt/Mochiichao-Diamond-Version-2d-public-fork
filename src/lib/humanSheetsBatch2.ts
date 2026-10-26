// STAGED ONLY — Human sheet / atlas mapping, 2026-10-26. NOT in repo, NOT live, NOT wired.
// Pokemon per-character STRUCTURE pulled from decomp files (structure only, no names,
// art, sprites, cries, or dialogue copied):
// - FireRed overworld: 4 directions (south/north/west/east in file order; east reuses the
//   west frames h-flipped in FireRed). Mochiichao atlases do NOT mirror: they carry a
//   distinct right cell (see player-a atlas manifest: right = cell 3, not left mirrored).
// - FireRed walk: standing frame per direction + step cycle (step / idle / step-flipped /
//   idle in the reference anims). Mochiichao atlases carry idle + step per direction.
// - FireRed trainer pics: separate front-pic asset per trainer class; player back pics are
//   a small separate set (player back is NOT the overworld sheet). Same split here:
//   battle front = separate full-size front asset, battle back (player) = atlas cell 12
//   in chibi atlases / separate full-size back asset in Full proportion.
// - FireRed action variants (bike / surf / fish / vs-seeker) are STRUCTURE only: a slot
//   exists per action and stays null unless that character actually does that thing.
// - HeartGold trainer card: save struct carries badge shininess for 8 badges + a signature
//   area; the card surface is portrait + name + 8-badge row + signature. Mochiichao card
//   below uses that shape with Mochiichao badge names (8 Region 1 fragments).
// - Three-quarter battle views are a Mars extra on top of the 8-step checklist, counted
//   separately: 4 views (towards/away x left/right) as optional full-size assets.

export type WorldDirection = "down" | "up" | "left" | "right";
export type SheetProportion = "Full" | "Chibi";

// 64x64 atlas cell map, matching the delivered player-a atlas manifest exactly:
// row 0 = world front/back/left/right; rows 1-2 = walk idle/step per direction;
// row 3 = battle_back + portrait. Trainer battle FRONT has no cell in this atlas —
// it is a separate full-size front asset (see HumanSheet.frontAsset).
export interface AtlasCells {
  worldFront: number;
  worldBack: number;
  worldLeft: number;
  worldRight: number;
  walkDownIdle: number;
  walkDownStep: number;
  walkUpIdle: number;
  walkUpStep: number;
  walkLeftIdle: number;
  walkLeftStep: number;
  walkRightIdle: number;
  walkRightStep: number;
  battleBack: number;
  portrait: number;
}
export const STANDARD_ATLAS_CELLS: AtlasCells = {
  worldFront: 0, worldBack: 1, worldLeft: 2, worldRight: 3,
  walkDownIdle: 4, walkDownStep: 5, walkUpIdle: 6, walkUpStep: 7,
  walkLeftIdle: 8, walkLeftStep: 9, walkRightIdle: 10, walkRightStep: 11,
  battleBack: 12, portrait: 13,
};
export const ATLAS_CELL_SIZE = 64;
export const ATLAS_COLS = 4;
export const ATLAS_ROWS = 4;

export interface ActionSlots {
  bike: string | null;
  surf: string | null;
  fish: string | null;
  vsSeeker: string | null;
}
export const EMPTY_ACTION_SLOTS: ActionSlots = { bike: null, surf: null, fish: null, vsSeeker: null };

export interface ThreeQuarterViews {
  towardsLeft: string | null;
  towardsRight: string | null;
  awayLeft: string | null;
  awayRight: string | null;
}
export const EMPTY_THREEQUARTER: ThreeQuarterViews = {
  towardsLeft: null, towardsRight: null, awayLeft: null, awayRight: null,
};

export interface HumanSheet {
  slotId: string;
  label: string;
  role: string;
  proportion: SheetProportion;
  // Null until the Human Characters lane delivers the atlas. Never a placeholder URL.
  atlasFile: string | null;
  cells: AtlasCells;
  // Trainer battle front: separate full-size asset, null until delivered (not an atlas cell).
  frontAsset: string | null;
  // Player battle back in Full proportion: separate full-size asset; in Chibi, atlas cell 12.
  battleBackFullAsset: string | null;
  portraitCell: number; // 13 in the standard atlas
  actionSlots: ActionSlots;
  threeQuarter: ThreeQuarterViews;
  sheetStatus: "DELIVERED_ATLAS" | "STEP8_DRAFT" | "AWAITING_MARS";
}

function sheet(
  slotId: string, label: string, role: string, atlasFile: string | null,
  frontAsset: string | null, status: HumanSheet["sheetStatus"],
  threeQuarter: ThreeQuarterViews = EMPTY_THREEQUARTER,
): HumanSheet {
  return {
    slotId, label, role, proportion: "Chibi", atlasFile, cells: STANDARD_ATLAS_CELLS,
    frontAsset, battleBackFullAsset: null, portraitCell: 13,
    actionSlots: { ...EMPTY_ACTION_SLOTS }, threeQuarter, sheetStatus: status,
  };
}

// Atlas filenames below are files verified on disk in in-game-sheets/ at staging time.
// Everything else stays null — no atlas filename is invented for an undelivered character.
export const HUMAN_SHEETS: Record<string, HumanSheet> = {
  player_a: sheet("player_a", "Player A", "player", "player-a-atlas-64x64.png", null, "DELIVERED_ATLAS"),
  player_b: sheet("player_b", "Player B", "player", "player-b-atlas-64x64.png", null, "DELIVERED_ATLAS"),
  player_c: sheet("player_c", "Player C", "player", "player-c-atlas-64x64.png", null, "DELIVERED_ATLAS"),
  player_d: sheet("player_d", "Player D", "player", "player-d-atlas-64x64.png", null, "DELIVERED_ATLAS"),
  player_e: sheet("player_e", "Player preset E", "player", null, null, "AWAITING_MARS"),
  player_f: sheet("player_f", "Player preset F", "player", null, null, "AWAITING_MARS"),
  player_g: sheet("player_g", "Player preset G", "player", null, null, "AWAITING_MARS"),
  player_h: sheet("player_h", "Player preset H", "player", null, null, "AWAITING_MARS"),
  mom_black: sheet("mom_black", "Mom (Black variant)", "family", "mom-black-atlas-64x64.png", null, "DELIVERED_ATLAS"),
  mom_east_asian: sheet("mom_east_asian", "Mom (East Asian variant)", "family", "mom-east-asian-atlas-64x64.png", null, "DELIVERED_ATLAS"),
  mom_latina: sheet("mom_latina", "Mom (Latina variant)", "family", "mom-latina-atlas-64x64.png", null, "DELIVERED_ATLAS"),
  mom_white: sheet("mom_white", "Mom (White variant)", "family", "mom-white-atlas-64x64.png", null, "DELIVERED_ATLAS"),
  hex: sheet("hex", "Hex", "rival", "hex-atlas-64x64.png", null, "DELIVERED_ATLAS"),
  prof_aeon: sheet("prof_aeon", "Prof. Aeon", "professor", "aeon-atlas-64x64.png", null, "DELIVERED_ATLAS"),
  mochiko: sheet("mochiko", "Mochiko", "assistant", "mochiko-atlas-64x64.png", null, "DELIVERED_ATLAS"),
  dojo_student: sheet("dojo_student", "Dojo Student", "trainer", "dojo-student-atlas-64x64.png", null, "DELIVERED_ATLAS"),
  garden_keeper: sheet("garden_keeper", "Garden Keeper", "garden-staff", "garden-keeper-atlas-64x64.png", null, "DELIVERED_ATLAS"),
  tech_tinkerer: sheet("tech_tinkerer", "Tech Tinkerer", "trainer", "tech-tinkerer-atlas-64x64.png", null, "DELIVERED_ATLAS"),
  shopkeeper: sheet("shopkeeper", "Shopkeeper", "shop", "shopkeeper-atlas-64x64.png", null, "DELIVERED_ATLAS"),
  krix: sheet("krix", "Krix", "antagonist", "krix-atlas-64x64.png", null, "DELIVERED_ATLAS"),
  syndicate_grunt: sheet("syndicate_grunt", "Syndicate Grunt", "antagonist", "syndicate-grunt-atlas-64x64.png", null, "DELIVERED_ATLAS"),
  liberation_front: sheet("liberation_front", "Liberation Front Member", "antagonist", "liberation-front-atlas-64x64.png", null, "DELIVERED_ATLAS"),
  ferry_captain: sheet("ferry_captain", "Ferry Captain", "npc", null, null, "STEP8_DRAFT"),
  // Locked leaders / elite / admins / healer: names locked, art NOT delivered in this slice.
  dojo_1_lin: sheet("dojo_1_lin", "Lin", "dojo-leader", null, null, "AWAITING_MARS"),
  dojo_2_falk: sheet("dojo_2_falk", "Falk", "dojo-leader", null, null, "AWAITING_MARS"),
  dojo_3_tetsu: sheet("dojo_3_tetsu", "Tetsu", "dojo-leader", null, null, "AWAITING_MARS"),
  dojo_4_kenji: sheet("dojo_4_kenji", "Kenji", "dojo-leader", null, null, "AWAITING_MARS"),
  dojo_5_phantom: sheet("dojo_5_phantom", "PHANTOM", "dojo-leader", null, null, "AWAITING_MARS"),
  dojo_6_shizuku: sheet("dojo_6_shizuku", "Shizuku", "dojo-leader", null, null, "AWAITING_MARS"),
  dojo_7_homura: sheet("dojo_7_homura", "Homura", "dojo-leader", null, null, "AWAITING_MARS"),
  dojo_8_luigi: sheet("dojo_8_luigi", "Luigi", "dojo-leader", null, null, "AWAITING_MARS"),
  elite_1_umi: sheet("elite_1_umi", "Umi", "elite", null, null, "AWAITING_MARS"),
  elite_2_gin: sheet("elite_2_gin", "Gin", "elite", null, null, "AWAITING_MARS"),
  elite_3_hono: sheet("elite_3_hono", "Hono", "elite", null, null, "AWAITING_MARS"),
  elite_4_yoru: sheet("elite_4_yoru", "Yoru", "elite", null, null, "AWAITING_MARS"),
  named_healer: sheet("named_healer", "Named healer", "healer", null, null, "AWAITING_MARS"),
};

// Resolve which world cell to draw for a direction + walk phase (FireRed walk-cycle shape:
// idle frame, then step frame, alternating; standing = idle frame for that direction).
export function worldCellFor(sheetEntry: HumanSheet, dir: WorldDirection, stepping: boolean): number {
  const c = sheetEntry.cells;
  switch (dir) {
    case "down": return stepping ? c.walkDownStep : c.walkDownIdle;
    case "up": return stepping ? c.walkUpStep : c.walkUpIdle;
    case "left": return stepping ? c.walkLeftStep : c.walkLeftIdle;
    case "right": return stepping ? c.walkRightStep : c.walkRightIdle;
  }
}
// Battle resolution: player => battle back (atlas cell 12 chibi / full asset when Full);
// opponent trainer => separate front asset, never an atlas cell. Portrait => cell 13.
export function battleCellFor(sheetEntry: HumanSheet, isPlayer: boolean): number | string | null {
  if (isPlayer) return sheetEntry.battleBackFullAsset ?? sheetEntry.cells.battleBack;
  return sheetEntry.frontAsset;
}

// ---- Trainer-card portrait shape (HeartGold card structure, Mochiichao badges) ----
export const TRAINER_CARD_BADGES = [
  "Core Fragment", "Wind Fragment", "Neon Fragment", "Strike Fragment",
  "Umbral Fragment", "Water Fragment", "Flame Fragment", "Final Fragment",
] as const;
export interface TrainerCard {
  portraitCell: number;
  playerName: string;
  badges: { name: string; earned: boolean; shiny: boolean }[]; // 8 slots, shiny per HG badgeShininess
  signature: string | null; // signature area; content is player-entered, never copied
}
export function emptyTrainerCard(playerName: string, portraitCell = 13): TrainerCard {
  return {
    portraitCell, playerName,
    badges: TRAINER_CARD_BADGES.map((name) => ({ name, earned: false, shiny: false })),
    signature: null,
  };
}
