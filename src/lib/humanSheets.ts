/**
 * Human sprite loader — same contract as the creature sheet loader, and
 * deliberately NOT creature-only: every human in the game goes through
 * here, so a sheet arriving from the Human Characters lane is a file
 * swap, not a code change.
 *
 * Format (same as creatures, extended for humans): a sheet image plus a
 * manifest with 64x64 cells — world front/back/left/right, walk
 * up/down/left/right (walk frames reuse the standing frame until the
 * lane delivers walk cycles), battle back (player trainer) / front
 * (opponent trainer), and a menu/portrait icon cell.
 * Until a sheet arrives, the slot's sheetUrl is null and the loader
 * renders a marked human silhouette placeholder (original coloured
 * shape, not an emoji) in the slot's colour.
 *
 * Player A swap (2026-10-25, Mars-approved): Player A is a young Black
 * woman, teal/chrome jacket. The game has boy/girl slots only (no
 * A/B/C/D picker yet), so Player A is wired to the player_girl slot —
 * choosing GIRL shows Player A art in world + battle. Her atlas is a
 * 256x256 4-column grid (not a 192x64 strip): row 0 = world
 * front/back/left/right, rows 1-2 = walk idle/step frames, row 3 =
 * battle_back + portrait. Walk cells are wired by PixiWorldCanvas
 * for the moving player (see walk on HumanSlot); battle_back (cell
 * 12) is wired by BattleView's player figure and portrait (cell 13)
 * is wired by DialogueBox's speaker portrait (see battleCell /
 * portraitCell on HumanSlot) — except Player A's portrait, which is
 * deliberately WITHHELD below: her portrait cell carries the flagged
 * eye drift, so her dialogue keeps the row-0 front until the Human
 * lane delivers a corrected portrait or Mars decides.
 * Portrait eye drift, noted not fixed: portrait v1 eyes drifted to
 * teal/blue; model/walk eyes are brown and brown is canon. The atlas
 * was NOT hand-edited to fix eyes; correction is a full-stack edit
 * later, and portrait eye colour must not be locked as canon.
 */
import playerAAtlas from '../assets/human-characters/in-game-sheets/player-a-atlas-64x64.png';
// PR #100 atlas batch (Human Characters lane, merged on main): every atlas
// below is a 256x256 4x4 grid of 64x64 cells with the SAME row-0 layout
// as the Player A atlas — row 0 = world front/back/left/right, row 3 =
// battle (cell 12) + portrait (cell 13) — verified against each atlas's
// manifest (cells 0-3 world, 12 battle, 13 portrait) and by pixels
// (cell 13 differs from front cell 0, cell 12 differs from back cell 1,
// on every sampled atlas). Walk rows differ by batch (see ROWS_WALK
// vs PAIRS_WALK): PR #100 atlases are idle row then step row (idle
// 4-7, step 8-11), Player A is direction pairs (down 4/5, up 6/7,
// left 8/9, right 10/11). Row 3 is the SAME on both batches, so battle
// and portrait cells need no per-batch mapping. Battle cells are
// consumed by BattleView's player figure and portrait cells by
// DialogueBox's speaker portrait (see battleCell / portraitCell);
// Player A's portrait cell is withheld (eye drift, see below).
import shopkeeperAtlas from '../assets/human-characters/in-game-sheets/shopkeeper-atlas-64x64.png';
import krixAtlas from '../assets/human-characters/in-game-sheets/krix-atlas-64x64.png';
import syndicateAtlas from '../assets/human-characters/in-game-sheets/syndicate-grunt-atlas-64x64.png';
import liberationAtlas from '../assets/human-characters/in-game-sheets/liberation-front-atlas-64x64.png';
import dojoStudentAtlas from '../assets/human-characters/in-game-sheets/dojo-student-atlas-64x64.png';
import gardenKeeperAtlas from '../assets/human-characters/in-game-sheets/garden-keeper-atlas-64x64.png';
import techTinkererAtlas from '../assets/human-characters/in-game-sheets/tech-tinkerer-atlas-64x64.png';
import momBlackAtlas from '../assets/human-characters/in-game-sheets/mom-black-atlas-core100-2026-10-26.png';
import momEastAsianAtlas from '../assets/human-characters/in-game-sheets/mom-east-asian-atlas-core100-2026-10-26.png';
import momLatinaAtlas from '../assets/human-characters/in-game-sheets/mom-latina-atlas-core100-2026-10-26.png';
import momWhiteAtlas from '../assets/human-characters/in-game-sheets/mom-white-atlas-core100-2026-10-26.png';
// Human wiring PR (2026-10-26, art on main via PR #234 core/dojo closing
// delta + PR #238 Tamsen redesign): core100 atlases for the new core
// slots, undated 14-cell atlases for dojo/elite, dated atlases for
// admin. Every manifest below was read from main before import: world
// cells 0-3, walk idle 4-7, walk step 8-11, battle 12, portrait 13 —
// EXCEPT Tamsen (non-standard, see her slot) and the core100 partial-
// walk atlases (Hex/Aeon/Mochiko/Player B/Player C, see
// CORE100_PARTIAL_WALK). Old undated atlases for the PR #100 slots are
// left untouched on main; their slots keep the verified PR #100 imports.
import playerBAtlas from '../assets/human-characters/in-game-sheets/player-b-atlas-core100-2026-10-26.png';
import playerCAtlas from '../assets/human-characters/in-game-sheets/player-c-atlas-core100-2026-10-26.png';
import playerDAtlas from '../assets/human-characters/in-game-sheets/player-d-atlas-core100-2026-10-26.png';
import hexAtlas from '../assets/human-characters/in-game-sheets/hex-atlas-core100-2026-10-26.png';
import aeonAtlas from '../assets/human-characters/in-game-sheets/aeon-atlas-core100-2026-10-26.png';
import mochikoAtlas from '../assets/human-characters/in-game-sheets/mochiko-atlas-core100-2026-10-26.png';
import larkAtlas from '../assets/human-characters/in-game-sheets/lark-atlas-core100-2026-10-26.png';
import ginAtlas from '../assets/human-characters/in-game-sheets/gin-atlas-64x64.png';
import homuraAtlas from '../assets/human-characters/in-game-sheets/homura-atlas-64x64.png';
import honoAtlas from '../assets/human-characters/in-game-sheets/hono-atlas-64x64.png';
import kenjiAtlas from '../assets/human-characters/in-game-sheets/kenji-atlas-64x64.png';
import phantomAtlas from '../assets/human-characters/in-game-sheets/phantom-atlas-64x64.png';
import shizukuAtlas from '../assets/human-characters/in-game-sheets/shizuku-atlas-64x64.png';
import tetsuAtlas from '../assets/human-characters/in-game-sheets/tetsu-atlas-64x64.png';
import umiAtlas from '../assets/human-characters/in-game-sheets/umi-atlas-64x64.png';
import yoruAtlas from '../assets/human-characters/in-game-sheets/yoru-atlas-64x64.png';
import adminAldousAtlas from '../assets/human-characters/in-game-sheets/admin-aldous-atlas-64x64-2026-10-26.png';
import adminCassianAtlas from '../assets/human-characters/in-game-sheets/admin-cassian-atlas-64x64-2026-10-26.png';
import adminCorvinAtlas from '../assets/human-characters/in-game-sheets/admin-corvin-atlas-64x64-2026-10-26.png';
import adminFerrenAtlas from '../assets/human-characters/in-game-sheets/admin-ferren-atlas-64x64-2026-10-26.png';
import adminIlsaAtlas from '../assets/human-characters/in-game-sheets/admin-ilsa-atlas-64x64-2026-10-26.png';
import adminMarlowAtlas from '../assets/human-characters/in-game-sheets/admin-marlow-atlas-64x64-2026-10-26.png';
import adminMireilleAtlas from '../assets/human-characters/in-game-sheets/admin-mireille-atlas-64x64-2026-10-26.png';
import adminSorenAtlas from '../assets/human-characters/in-game-sheets/admin-soren-atlas-64x64-2026-10-26.png';
import adminTamsenAtlas from '../assets/human-characters/in-game-sheets/admin-tamsen-redesign-atlas-64x64-2026-10-26.png';
import adminVossAtlas from '../assets/human-characters/in-game-sheets/admin-voss-atlas-64x64-2026-10-26.png';


export type HumanView = 'front' | 'back' | 'left' | 'right';

/** Walk-cycle cells of a 4x4 human atlas, as cell indices (0-15) in
 *  the grid, per facing. The two atlas batches on main arrange walk
 *  cells differently — see ROWS_WALK / PAIRS_WALK below — so the
 *  mapping lives on the slot, taken from that atlas's own manifest,
 *  never assumed from another atlas. Pixel-verified 2026-10-26 for
 *  the PR #100 batch (walk idle cells are pixel-identical to the
 *  row-0 world cells; step cells differ, except Garden Keeper front,
 *  whose step cell is pixel-identical to its idle cell) and for
 *  Player A (all 8 walk cells distinct from each other and from row 0).
 *  Slots without walk data (old strips, null sheets, Mom variants as
 *  data) render exactly as before: row-0 standing frame + bob. */
export interface HumanWalkFrames {
  idle: Record<HumanView, number>;
  step: Record<HumanView, number>;
}

/** PR #100 atlas batch layout (shopkeeper, dojo-student,
 *  garden-keeper, tech-tinkerer, krix, syndicate, liberation, all
 *  Mom variants): rows 1-2 are idle row then step row — idle
 *  front/back/left/right = cells 4/5/6/7, step = cells 8/9/10/11.
 *  From each atlas's own manifest (cells list). */
export const ROWS_WALK: HumanWalkFrames = {
  idle: { front: 4, back: 5, left: 6, right: 7 },
  step: { front: 8, back: 9, left: 10, right: 11 },
};

/** Player A atlas layout (player-a-atlas-manifest.json): direction
 *  pairs — down(front) idle/step = cells 4/5, up(back) = 6/7,
 *  left = 8/9, right = 10/11. NOT the PR #100 rows layout: using the
 *  rows mapping on Player A would show the wrong frames (front step
 *  would be left_idle). */
export const PAIRS_WALK: HumanWalkFrames = {
  idle: { front: 4, back: 6, left: 8, right: 10 },
  step: { front: 5, back: 7, left: 9, right: 11 },
};

/** Core100 partial-walk layout (Hex, Aeon, Mochiko, Player B, Player C
 *  core100 manifests, read from main): idle 4-7 as usual, but the step
 *  row is front_step 8, left_step 9, left_step2 10, right_step 11 —
 *  there is NO distinct back_step cell (cell 9 is a left step, cell 10
 *  a second left step). Back step therefore reuses back idle (5):
 *  back walk shows no step change, rather than showing a left step
 *  as a back step (which ROWS_WALK would do). Flagged, not invented:
 *  a true back step is an art-lane item, not a wiring guess. */
export const CORE100_PARTIAL_WALK: HumanWalkFrames = {
  idle: { front: 4, back: 5, left: 6, right: 7 },
  step: { front: 8, back: 5, left: 9, right: 11 },
};

export interface HumanSlot {
  slotId: string;
  label: string;
  role: string;
  /** Null until the Human Characters lane delivers this sheet. */
  sheetUrl: string | null;
  /** x offset of each 64x64 cell when a sheet exists. Left mirrors right only when left === right (old strips). */
  frames: Record<HumanView, number>;
  /** Walk-cycle cells for this slot's atlas, when it has them.
   *  Consumed by PixiWorldCanvas for the moving player only: NPCs
   *  stand still in current maps, so their walk cells do not animate
   *  yet. Absent = render row-0 standing frame exactly as before. */
  walk?: HumanWalkFrames;
  /** Row-3 grid cell index (0-15) of the battle figure in this slot's
   *  4x4 atlas: 12 = (col 0, row 3). Consumed by BattleView's player
   *  figure. Absent = render the current row-0 view exactly as before
   *  (old strips, null sheets, and any slot whose battle cell is not
   *  verified from its own manifest). */
  battleCell?: number;
  /** Row-3 grid cell index (0-15) of the dialogue portrait in this
   *  slot's 4x4 atlas: 13 = (col 1, row 3). Consumed by DialogueBox's
   *  speaker portrait. Absent = render the current row-0 front exactly
   *  as before. Player A's portrait cell is deliberately absent (see
   *  player_girl below): her cell 13 carries the flagged eye drift. */
  portraitCell?: number;
  /** Number of 64x64 columns in the sheet image. Default 3 (strips); 4 for the Player A atlas. */
  sheetCols?: number;
  /** Number of 64x64 rows in the sheet image. Default 1 (strips); 4 for the Player A atlas. */
  sheetRows?: number;
  /** Variant sheets for a slot whose art varies (Mom): keyed by variant
   *  name, bundled with the slot so the bundler cannot tree-shake them
   *  away. No selection UI reads this yet — that is still owed. */
  variantSheets?: Record<string, string>;
  color: string;
}

const FRAMES: Record<HumanView, number> = { front: 0, back: 64, left: 128, right: 128 };

function slot(slotId: string, label: string, role: string, color: string): HumanSlot {
  return { slotId, label, role, sheetUrl: null, frames: FRAMES, color };
}

/** Atlas slot: same row-0 world frames as Player A (front 0, back 64,
 *  left 128, right 192 — distinct right cell, NOT mirrored left), 4x4
 *  grid, PR #100 rows walk layout (idle 4-7, step 8-11). Battle (12)
 *  and portrait (13) cells are verified from each atlas's own manifest
 *  and wired: BattleView's player figure (battleCell) and DialogueBox's
 *  speaker portrait (portraitCell). */
function atlasSlot(slotId: string, label: string, role: string, sheetUrl: string, color: string): HumanSlot {
  return { slotId, label, role, sheetUrl, frames: { front: 0, back: 64, left: 128, right: 192 }, walk: ROWS_WALK, battleCell: 12, portraitCell: 13, sheetCols: 4, sheetRows: 4, color };
}

/** Atlas slot with the core100 partial-walk layout (see
 *  CORE100_PARTIAL_WALK). Row-0 world, battle 12 and portrait 13 are
 *  the same as atlasSlot; only the walk step row differs. */
function partialAtlasSlot(slotId: string, label: string, role: string, sheetUrl: string, color: string): HumanSlot {
  return { slotId, label, role, sheetUrl, frames: { front: 0, back: 64, left: 128, right: 192 }, walk: CORE100_PARTIAL_WALK, battleCell: 12, portraitCell: 13, sheetCols: 4, sheetRows: 4, color };
}

/** Grid (col, row) of a 4x4 atlas cell index, for HumanPortrait's
 *  `cell` prop. Cell 12 -> (0, 3), cell 13 -> (1, 3). */
export function cellPos(cell: number): { col: number; row: number } {
  return { col: cell % 4, row: Math.floor(cell / 4) };
}

/**
 * Mom variant sheets (human wiring PR: switched from the PR #100
 * undated atlases to the core100 dated atlases — same 0-13 cell layout
 * per the core100 manifests, cell 14 = battle back; the undated files
 * stay on main untouched). Mom is VARIABLE by player pick, NOT fixed canon, and the
 * game has no variant-selection mechanism today — so the four variants
 * are bundled here as loadable data and the mom slot itself keeps
 * sheetUrl null (silhouette) until a selection UI exists. Picking one
 * variant as a default would invent a canon Mom the lane has NOT set.
 * Selection UI is still owed; it is NOT invented in this pass.
 * The record is attached to the mom slot as variantSheets so the
 * bundler keeps all four files (a bare unused export could be
 * tree-shaken away).
 */
export const MOM_VARIANT_SHEETS: Record<'black' | 'east-asian' | 'latina' | 'white', string> = {
  black: momBlackAtlas,
  'east-asian': momEastAsianAtlas,
  latina: momLatinaAtlas,
  white: momWhiteAtlas,
};

export const HUMAN_SLOTS: Record<string, HumanSlot> = {
  player_boy: slot('player_boy', 'Player (boy)', 'player', '#4fc3f7'),
  // Player A (young Black woman, teal/chrome jacket, chibi atlas, Mars-approved
  // 2026-10-25) wired to player_girl — the game has boy/girl slots only, no
  // A/B/C/D picker yet. Row-0 world cells: front 0, back 64, left 128,
  // right 192 (distinct right cell, NOT mirrored left). Walk cells use
  // Player A's own pairs layout (PAIRS_WALK), NOT the PR #100 rows
  // layout — see PAIRS_WALK. Battle_back (12) IS wired (BattleView's
  // player figure — a back view, so the eye drift cannot show).
  // Portrait (13) is deliberately NOT wired: her portrait cell differs
  // from her front cell (pixel mean abs diff 66.2) and carries the
  // flagged teal/blue eye drift, while her row-0 front carries the
  // canon brown eyes. Switching dialogue to cell 13 would put the
  // drifted eyes in every Player A dialogue portrait, so her dialogue
  // keeps the row-0 front until the Human lane delivers a corrected
  // portrait or Mars decides otherwise. This is a flagged decision,
  // not a silent swap and not a hand-fix: the atlas is untouched.
  player_girl: { slotId: 'player_girl', label: 'Player (girl)', role: 'player', sheetUrl: playerAAtlas, frames: { front: 0, back: 64, left: 128, right: 192 }, walk: PAIRS_WALK, battleCell: 12, sheetCols: 4, sheetRows: 4, color: '#f48fb1' },
  // Hex (core100 atlas, wired in the human wiring PR): battle 12 is
  // her battle_back_fullsize cell, portrait 13, partial walk (see
  // CORE100_PARTIAL_WALK — no distinct back step).
  hex: partialAtlasSlot('hex', 'Hex (rival)', 'rival', hexAtlas, '#b388ff'),
  // Prof. Aeon (core100 atlas, wired in the human wiring PR): battle
  // 12 is his battle_front_fullsize cell, portrait 13, partial walk.
  // His battle back is cell 14, queued for character-select.
  prof_aeon: partialAtlasSlot('prof_aeon', 'Prof. Aeon', 'professor', aeonAtlas, '#e0e0e0'),
  // Assistant Mochiko (core100 atlas, wired in the human wiring PR):
  // battle 12 is her battle_front_fullsize cell, portrait 13, partial
  // walk. Her battle back is cell 14, queued for character-select.
  mochiko: partialAtlasSlot('mochiko', 'Assistant Mochiko', 'assistant', mochikoAtlas, '#80cbc4'),
  mom: { ...slot('mom', 'Mom', 'family', '#ffcc80'), variantSheets: MOM_VARIANT_SHEETS },
  dojo_trainer: slot('dojo_trainer', 'Dojo Trainer', 'trainer', '#ef9a9a'),
  // Dojo Student (PR #100 atlas): routed by slotForNpc below to the
  // dojo acolyte NPCs (dojo_acolyte_1-4, dojo1_guard "Dojo Acolyte"),
  // who ARE dojo students in the map data. Dojo bosses (Master Lin,
  // Master Falk, isDojoBoss) keep the dojo_trainer slot, which stays
  // null — student art is NOT put on the bosses, whose own sheets are
  // still owed.
  dojo_student: atlasSlot('dojo_student', 'Dojo Student', 'trainer', dojoStudentAtlas, '#ef9a9a'),
  // Garden Keeper (PR #100 atlas, battle front v2): exact-key route
  // added by the wiring PR (garden_keeper id / 'garden keeper' name) —
  // but no Garden NPC exists in the maps today and GardenView does not
  // use humanSheets, so the art still shows only once a Garden NPC is
  // added to map data. FLAG, preserved honestly: her manifest's
  // front step reuses the front idle cell (steps "0:0,0:3,1:1,1:3"),
  // pixel-verified 2026-10-26: her front step cell (8) is
  // pixel-identical to her front idle cell (4) and to her world
  // front cell (0), so front walk animation shows no change; no
  // front-step frame is invented here. Her back step is
  // near-identical to back idle (mean abs diff 1.7); left/right
  // steps are distinct. This only matters when a Garden NPC is
  // routed here; row-0 world cells consumed today are unaffected.
  garden_keeper: atlasSlot('garden_keeper', 'Garden Keeper', 'garden-staff', gardenKeeperAtlas, '#a5d6a7'),
  // Tech Tinkerer (PR #100 atlas): exact-key route added by the wiring
  // PR (tech_tinkerer id / 'tech tinkerer' name) — but no Tech NPC
  // exists in the maps today (the Sector 0 "Technology Enthusiast",
  // id fat_guy, is NOT evidenced as the Tech Tinkerer, so it is NOT
  // routed here). The art shows once a Tech NPC is added to map data.
  tech_tinkerer: atlasSlot('tech_tinkerer', 'Tech Tinkerer', 'trainer', techTinkererAtlas, '#90caf9'),
  // Shopkeeper (PR #100 atlas, portrait v2 cel): routed by slotForNpc
  // below — shop_1 "Clerk" isShop in Silicon Town MochiiPlex.
  shopkeeper: atlasSlot('shopkeeper', 'Shopkeeper', 'shop', shopkeeperAtlas, '#ffe082'),
  academy_staff: slot('academy_staff', 'Academy Staff', 'garden-staff', '#a5d6a7'),
  market_staff: slot('market_staff', 'Market Staff', 'garden-staff', '#ffab91'),
  race_staff: slot('race_staff', 'Race Staff', 'garden-staff', '#90caf9'),
  sparring_staff: slot('sparring_staff', 'Sparring Staff', 'garden-staff', '#ce93d8'),
  hacker: slot('hacker', 'Hacker Grunt', 'antagonist', '#ef5350'),
  // Syndicate Grunt (PR #100 atlas): routed by slotForNpc below
  // (id includes 'syndicate'). No syndicate-id NPC exists in the
  // maps today, so this art shows once one does — the slot mapping
  // itself is name-verified, not guessed.
  syndicate: atlasSlot('syndicate', 'Syndicate Member', 'antagonist', syndicateAtlas, '#8d6e63'),
  // Liberation Front (PR #100 atlas, current = v2): routed by
  // slotForNpc below (id includes 'liberation'). NOTE: Binary Woods'
  // hacker_grunt2 ("Hacker Grunt", dialogue "The woods belong to the
  // Liberation Front now!") does NOT route here — its id/name are
  // Hacker Grunt, so it keeps the hacker slot (no atlas yet). The
  // liberation art shows once a liberation-id NPC exists.
  liberation: atlasSlot('liberation', 'Liberation Front Member', 'antagonist', liberationAtlas, '#66bb6a'),
  // Junk Warlord Krix (PR #100 atlas, walk v2 — dreadlocks + gold
  // tooth are canon going forward): routed by slotForNpc below
  // (id or name includes 'krix') — junk_boss 'Junk Warlord Krix' in
  // FullWorldMaps now routes here (wiring PR name check).
  krix: atlasSlot('krix', 'Junk Warlord Krix', 'antagonist', krixAtlas, '#ff7043'),
  castagnoli: slot('castagnoli', 'Luigi Castagnoli', 'antagonist', '#5c6bc0'),
  mythar: slot('mythar', 'Champion Mythar', 'champion', '#ffd54f'),
  // Player variants B/C/D (core100 atlases, wired in the human wiring
  // PR as slots only): playerSlot() still returns boy/girl only — there
  // is NO A/B/C/D picker UI yet, so these slots render only once a
  // picker routes to them. That picker is a separate owed item; it is
  // NOT claimed here. B/C use the partial walk (no distinct back
  // step); D uses the pairs walk (its manifest is pairs, like Player A).
  // Battle 12 on B/C/D is the battle_back_fullsize cell; battle front
  // is cell 14, queued for the opponent consumer.
  player_b: partialAtlasSlot('player_b', 'Player B', 'player', playerBAtlas, '#81d4fa'),
  player_c: partialAtlasSlot('player_c', 'Player C', 'player', playerCAtlas, '#f48fb1'),
  player_d: { slotId: 'player_d', label: 'Player D', role: 'player', sheetUrl: playerDAtlas, frames: { front: 0, back: 64, left: 128, right: 192 }, walk: PAIRS_WALK, battleCell: 12, portraitCell: 13, sheetCols: 4, sheetRows: 4, color: '#ffe082' },
  // Lark (core100 atlas, wired in the human wiring PR): Harbor City
  // ferry-dock dispatcher, the unnamed 35th core character — never a
  // rename of anyone. No Lark-id NPC exists in the maps today, so this
  // slot shows once a Lark NPC is added to map data (map-data lane,
  // not invented here). Battle 12 is battle_front_fullsize; her back
  // is cell 14, queued.
  lark: atlasSlot('lark', 'Lark', 'npc', larkAtlas, '#80deea'),
  // Dojo leaders 3-7 + Elite 1-4 (undated 14-cell atlases, wired in the
  // human wiring PR, standard ROWS walk, battle_front 12, portrait 13).
  // Their battle backs are the #245 webps, QUEUED for character-select
  // (not wired as player backs here — BattleView's player figure only
  // ever renders playerSlot(), and none of these is a player today).
  // Tetsu is the only one with a map NPC today (dojo3_leader, routed
  // below); the rest show once their NPCs exist in map data.
  tetsu: atlasSlot('tetsu', 'Tetsu', 'dojo', tetsuAtlas, '#90a4ae'),
  kenji: atlasSlot('kenji', 'Kenji', 'dojo', kenjiAtlas, '#ef9a9a'),
  phantom: atlasSlot('phantom', 'Phantom', 'dojo', phantomAtlas, '#b39ddb'),
  shizuku: atlasSlot('shizuku', 'Shizuku', 'dojo', shizukuAtlas, '#80cbc4'),
  homura: atlasSlot('homura', 'Homura', 'dojo', homuraAtlas, '#ffab91'),
  umi: atlasSlot('umi', 'Umi', 'elite', umiAtlas, '#81d4fa'),
  gin: atlasSlot('gin', 'Gin', 'elite', ginAtlas, '#b0bec5'),
  hono: atlasSlot('hono', 'Hono', 'elite', honoAtlas, '#ffcc80'),
  yoru: atlasSlot('yoru', 'Yoru', 'elite', yoruAtlas, '#ce93d8'),
  // Admins (dated atlases, wired in the human wiring PR, standard ROWS
  // walk, battle 12 = battle_front source per each manifest, portrait
  // 13). Their battle backs are separate media-generation webps on
  // main, QUEUED for character-select, not wired here. No admin NPC
  // exists in the maps today; these slots show once their NPCs do.
  admin_aldous: atlasSlot('admin_aldous', 'Aldous', 'admin', adminAldousAtlas, '#bcaaa4'),
  admin_cassian: atlasSlot('admin_cassian', 'Cassian', 'admin', adminCassianAtlas, '#a5d6a7'),
  admin_corvin: atlasSlot('admin_corvin', 'Corvin', 'admin', adminCorvinAtlas, '#90caf9'),
  admin_ferren: atlasSlot('admin_ferren', 'Ferren', 'admin', adminFerrenAtlas, '#ffab91'),
  admin_ilsa: atlasSlot('admin_ilsa', 'Ilsa', 'admin', adminIlsaAtlas, '#f48fb1'),
  admin_marlow: atlasSlot('admin_marlow', 'Marlow', 'admin', adminMarlowAtlas, '#ffe082'),
  admin_mireille: atlasSlot('admin_mireille', 'Mireille', 'admin', adminMireilleAtlas, '#ce93d8'),
  admin_soren: atlasSlot('admin_soren', 'Soren', 'admin', adminSorenAtlas, '#81d4fa'),
  // Tamsen redesign (NON-STANDARD atlas — do NOT use atlasSlot here):
  // her manifest (read from main) is world 0-3, walk stride steps 4-7
  // (no per-direction idle/step bands), battle_front 8, portrait 9,
  // battle_back 10, model 11, blanks 12-15. A standard atlasSlot would
  // render BLANK battle (12) and portrait (13) cells. So: no walk
  // (stride steps are undifferentiated — mapping them to directions
  // would be a guess), battleCell 8 = the front (the opponent-side
  // figure, matching the NPC atlasSlot precedent), portraitCell 9.
  // Her battle_back (10) is QUEUED for character-select: a single
  // battleCell cannot hold both front and back, and no player-back
  // consumer exists for her today.
  admin_tamsen: { slotId: 'admin_tamsen', label: 'Tamsen', role: 'admin', sheetUrl: adminTamsenAtlas, frames: { front: 0, back: 64, left: 128, right: 192 }, battleCell: 8, portraitCell: 9, sheetCols: 4, sheetRows: 4, color: '#ef9a9a' },
  admin_voss: atlasSlot('admin_voss', 'Voss', 'admin', adminVossAtlas, '#a1887f'),
  trainer_generic: slot('trainer_generic', 'Trainer', 'trainer', '#9e9e9e'),
  townspeople: slot('townspeople', 'Townspeople', 'npc', '#bcaaa4'),
};

export function playerSlot(gender: 'boy' | 'girl'): HumanSlot {
  return HUMAN_SLOTS[gender === 'girl' ? 'player_girl' : 'player_boy'];
}

/** Map a FullWorldMaps NPC to a human slot. Creature display NPCs (Dorowani/Gabu) are handled by the caller first. */
export function slotForNpc(npc: any): HumanSlot {
  const id = String(npc?.id || '').toLowerCase();
  const name = String(npc?.name || '').toLowerCase();
  if (id.includes('mom') || name.includes('mom')) return HUMAN_SLOTS.mom;
  if (id.includes('aeon') || name.includes('aeon')) return HUMAN_SLOTS.prof_aeon;
  if (id.includes('mochiko')) return HUMAN_SLOTS.mochiko;
  if (id.includes('hex') || name === 'hex') return HUMAN_SLOTS.hex;
  if (id.includes('krix') || name.includes('krix')) return HUMAN_SLOTS.krix; // junk_boss is named 'Junk Warlord Krix' with no krix id — name check added by the wiring PR
  if (id.includes('castagnoli') || name.includes('castagnoli')) return HUMAN_SLOTS.castagnoli;
  if (id.includes('mythar') || name.includes('mythar')) return HUMAN_SLOTS.mythar;
  if (id.includes('hacker') || id.includes('grunt')) return HUMAN_SLOTS.hacker;
  // Human wiring PR exact-key routes (432 batch): these run before the
  // substring fallbacks below. Short stems (gin, umi) use delimited
  // matches only — a bare 'gin' substring would false-positive on
  // words like 'engineer'. No route is invented for an NPC that does
  // not exist: garden_keeper / tech_tinkerer branches match only a
  // garden_keeper / tech_tinkerer id or name — no Garden or Tech NPC
  // exists in the maps today, and the Sector 0 'Technology
  // Enthusiast' (fat_guy) is NOT evidenced as the Tech Tinkerer, so it
  // is deliberately NOT routed here. Likewise boat_captain 'Capt.
  // Neri' is NOT the Ferry Captain and dockhand_juno is NOT Lark, so
  // neither is routed to a 432 character. Player B/C/D get NO
  // slotForNpc route: they are player variants, and only a picker UI
  // (separate owed item) may route to them.
  if (id.includes('garden_keeper') || name.includes('garden keeper')) return HUMAN_SLOTS.garden_keeper;
  if (id.includes('tech_tinkerer') || name.includes('tech tinkerer')) return HUMAN_SLOTS.tech_tinkerer;
  if (id === 'dojo3_leader') return HUMAN_SLOTS.tetsu; // Dojo 3 Chrome / Neon Fragment leader (dialogue: 'Chrome is the Mainframe's spine', acolytes: Neon Fragment) — Tetsu's step-8 record is Dojo 3, Chrome, Neon City, Neon Fragment.
  if (id.includes('tetsu') || name === 'tetsu') return HUMAN_SLOTS.tetsu;
  if (id.includes('kenji') || name === 'kenji') return HUMAN_SLOTS.kenji;
  if (id.includes('phantom') || name === 'phantom') return HUMAN_SLOTS.phantom;
  if (id.includes('shizuku') || name === 'shizuku') return HUMAN_SLOTS.shizuku;
  if (id.includes('homura') || name === 'homura') return HUMAN_SLOTS.homura;
  if (id.includes('hono') || name === 'hono') return HUMAN_SLOTS.hono;
  if (id.includes('yoru') || name === 'yoru') return HUMAN_SLOTS.yoru;
  if (id.includes('_umi') || id.startsWith('umi_') || id === 'umi' || name === 'umi') return HUMAN_SLOTS.umi;
  if (id.includes('_gin') || id.startsWith('gin_') || id === 'gin' || name === 'gin') return HUMAN_SLOTS.gin;
  if (id.includes('lark') || name === 'lark') return HUMAN_SLOTS.lark;
  if (id.includes('aldous') || name === 'aldous') return HUMAN_SLOTS.admin_aldous;
  if (id.includes('cassian') || name === 'cassian') return HUMAN_SLOTS.admin_cassian;
  if (id.includes('corvin') || name === 'corvin') return HUMAN_SLOTS.admin_corvin;
  if (id.includes('ferren') || name === 'ferren') return HUMAN_SLOTS.admin_ferren;
  if (id.includes('ilsa') || name === 'ilsa') return HUMAN_SLOTS.admin_ilsa;
  if (id.includes('marlow') || name === 'marlow') return HUMAN_SLOTS.admin_marlow;
  if (id.includes('mireille') || name === 'mireille') return HUMAN_SLOTS.admin_mireille;
  if (id.includes('soren') || name === 'soren') return HUMAN_SLOTS.admin_soren;
  if (id.includes('tamsen') || name === 'tamsen') return HUMAN_SLOTS.admin_tamsen;
  if (id.includes('voss') || name === 'voss') return HUMAN_SLOTS.admin_voss;
  if (id.includes('syndicate')) return HUMAN_SLOTS.syndicate;
  if (id.includes('liberation')) return HUMAN_SLOTS.liberation;
  if (npc?.isShop) return HUMAN_SLOTS.shopkeeper;
  if (npc?.isHeal) return HUMAN_SLOTS.academy_staff;
  if (npc?.isDojoBoss) return HUMAN_SLOTS.dojo_trainer;
  // Dojo acolytes are dojo students (map ids dojo_acolyte_1-4,
  // dojo1_guard; event NPCs carry the name "Acolyte Ken" /
  // "Dojo Acolyte" with no id). Bosses are handled above and never
  // reach this branch.
  if (id.includes('dojo_acolyte') || id === 'dojo1_guard' || name.includes('acolyte')) return HUMAN_SLOTS.dojo_student;
  if (id.includes('trainer') || npc?.battle) return HUMAN_SLOTS.trainer_generic;
  return HUMAN_SLOTS.townspeople;
}
