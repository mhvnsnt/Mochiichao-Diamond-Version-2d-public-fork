/**
 * Phase 4 data shapes — personal tables, legality checklist, versioned
 * learnsets, DS binary-tooling descriptors, and Gen 1–9 aggregate
 * cross-checks (counts only, zero individual names).
 *
 * Provenance (shapes only — NO code copied here):
 * - PKHeX (workspace tools/pkhex, GPL-3.0): save-editor shapes — a
 *   per-generation entity with a common interface + per-generation
 *   serialisations, a personal-data table keyed by species, and
 *   legality as a data-driven checklist. GPL-3.0 means STUDY/SHAPE
 *   ONLY: this file is original TypeScript expressing those shapes
 *   against Mochiichao's own tables. No PKHeX code, no PKHeX data.
 * - pkNX (workspace tools/pknx, GPL-3.0): Switch ROM editing shapes —
 *   personal/learnset tables whose FORMAT CHANGES per generation
 *   (Gen 6 vs Gen 8 learnset tables differ). Lesson ported here:
 *   Mochiichao learnset tables carry a version field; a validator must
 *   never assume one generation's table layout fits another.
 * - dsdecmp (workspace tools/dsdecmp): DS compression/decompression
 *   tooling. Ported here: the compression-KIND enum + header-field
 *   spec, as an offline tooling descriptor. No decompression of game
 *   binaries happens in the game.
 * - ndstool (workspace tools/ndstool): NDS ROM container tooling.
 *   Ported here: the container header-field spec (offsets/sizes as a
 *   descriptor) + a safe header parser that rejects oversize input.
 *   No ROM bytes are shipped or read by the game.
 *
 * Pure types + validators, no imports, no battle code, no species/
 * character names, no dialogue, no cries, no logos, no art.
 * Local CPU only. Tables are PASSED IN by callers — this module never
 * hardcodes a roster, a move list, or a species record.
 */

export interface PersonalDataRow {
  speciesId: string;
  baseStats: { hp: number; attack: number; defense: number; specialAttack: number; specialDefense: number; speed: number };
  types: string[];
  abilities: string[];
  eggGroups: string[];
  growthRate: string;
}

export function validatePersonalRow(row: PersonalDataRow): { ok: boolean; problems: string[] } {
  const problems: string[] = [];
  const s = row.baseStats;
  const vals = [s.hp, s.attack, s.defense, s.specialAttack, s.specialDefense, s.speed];
  if (vals.some((v) => !Number.isFinite(v) || v < 1 || v > 255)) problems.push("base stat out of 1..255 range");
  if (row.types.length < 1 || row.types.length > 2) problems.push("types must be 1 or 2 entries");
  if (row.abilities.length === 0) problems.push("no abilities listed");
  if (row.eggGroups.length === 0) problems.push("no egg groups listed");
  return { ok: problems.length === 0, problems };
}

export interface LegalityInput {
  speciesId: string;
  encounterSource: string | null;
  moves: string[];
  learnableMoves: string[];
  ability: string;
  speciesAbilities: string[];
  ivs: number[];
  level: number;
}

/** Legality as a checklist (PKHeX shape, Mochiichao tables passed in):
 *  encounter source exists, every move is learnable, ability is in the
 *  species set, IVs in 0..31, level in 1..100. One failed check = illegal. */
export function legalityChecklist(input: LegalityInput): { legal: boolean; failed: string[] } {
  const failed: string[] = [];
  if (input.encounterSource === null || input.encounterSource === "") failed.push("no encounter source");
  for (const m of input.moves) if (input.learnableMoves.indexOf(m) === -1) failed.push("unlearnable move: " + m);
  if (input.speciesAbilities.indexOf(input.ability) === -1) failed.push("ability not in species set");
  if (input.ivs.some((v) => v < 0 || v > 31)) failed.push("IV out of 0..31 range");
  if (input.level < 1 || input.level > 100) failed.push("level out of 1..100 range");
  return { legal: failed.length === 0, failed };
}

/** Versioned learnset table (pkNX lesson): the version travels with the
 *  table, and a reader for one version must refuse another's layout. */
export interface VersionedLearnsetTable {
  version: string;
  speciesId: string;
  levelMoves: Array<{ level: number; moveId: string }>;
  tmMoves: string[];
  tutorMoves: string[];
  eggMoves: string[];
}

export function learnsetTableCompatible(table: VersionedLearnsetTable, expectedVersion: string): boolean {
  return table.version === expectedVersion;
}

export type DsCompressionKind = "none" | "lz77" | "huffman" | "rle" | "lzss-overlay" | "unknown";

export interface NdsHeaderSpec {
  title: string;
  gameCode: string;
  makerCode: string;
  arm9Offset: number;
  arm9Size: number;
}

/** Safe header parser: fixed-size header only, oversize rejected, no ROM
 *  payload read. Input is a byte array supplied by an OFFLINE tooling
 *  caller, never by the game at runtime. */
export function parseNdsHeaderSpec(bytes: number[]): { ok: boolean; spec: NdsHeaderSpec | null; problem: string | null } {
  if (bytes.length < 512) return { ok: false, spec: null, problem: "header too short (< 512 bytes)" };
  if (bytes.length > 512) return { ok: false, spec: null, problem: "header must be exactly the 512-byte header, not a ROM image" };
  const text = (off: number, len: number): string => {
    let out = "";
    for (let i = 0; i < len; i++) {
      const c = bytes[off + i];
      if (c === 0) break;
      out += String.fromCharCode(c);
    }
    return out;
  };
  const u32 = (off: number): number => (bytes[off] | (bytes[off + 1] << 8) | (bytes[off + 2] << 16) | (bytes[off + 3] << 24)) >>> 0;
  return {
    ok: true,
    spec: { title: text(0, 12), gameCode: text(12, 4), makerCode: text(16, 2), arm9Offset: u32(32), arm9Size: u32(36) },
    problem: null,
  };
}

/** Gen 1–9 aggregate cross-check constants (counts only — see
 *  generated/phase4-crosschecks-20261026.json for the full table).
 *  These are the numbers a future extraction pass must reproduce. */
export const PHASE4_CROSSCHECK_TOTALS: Record<string, { species: number; moves: number }> = {
  yellowGen1: { species: 151, moves: 165 },
  crystalGen2: { species: 251, moves: 251 },
  rubyEmeraldGen3: { species: 386, moves: 354 },
  diamondGen4: { species: 500, moves: 470 },
  fireredGen3: { species: 386, moves: 354 },
  heartgoldGen4: { species: 507, moves: 468 },
  black2Gen5: { species: 652, moves: 560 },
  gen5plusPokeapi: { species: 532, moves: 871 },
};

export function phase4DataShapesSelfCheck(): { personalOk: boolean; legalityCatches: boolean; headerRejectsOversize: boolean } {
  const personal = validatePersonalRow({
    speciesId: "test-001", baseStats: { hp: 50, attack: 50, defense: 50, specialAttack: 50, specialDefense: 50, speed: 50 },
    types: ["test-type"], abilities: ["test-ability"], eggGroups: ["test-group"], growthRate: "medium-fast",
  });
  const legal = legalityChecklist({
    speciesId: "test-001", encounterSource: "wild", moves: ["nope-move"], learnableMoves: ["tackle-shape"],
    ability: "other-ability", speciesAbilities: ["test-ability"], ivs: [31, 31, 31, 31, 31, 31], level: 5,
  });
  const header = parseNdsHeaderSpec(new Array(600).fill(0));
  return { personalOk: personal.ok, legalityCatches: !legal.legal && legal.failed.length === 2, headerRejectsOversize: !header.ok };
}
