/**
 * Reference-layer validation (mod layer, dev-time only).
 *
 * Cross-checks the canonical Mochiichao roster/moves against the SHAPE of
 * the reference JSONs (counts, ID resolution, stat ranges) WITHOUT copying
 * reference content into the game roster. Reference files are counted and
 * parsed, never imported as playable content — this script also fails if
 * any game source file imports from src/lib/generated/.
 *
 * Run: npm run validate:reference
 * Exit 0 = no hard errors. Warnings (open decisions) do not fail the run.
 */
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { SPECIES_DB } from './species';
import { MOVES_DB } from './moves';
import {
  BLACK2_ITEM_COUNT,
  BLACK2_ABILITY_COUNT,
  BLACK2_NATURE_COUNT,
  BLACK2_TYPE_COUNT,
  BLACK2_LIGHTING_SETS,
  BLACK2_ZONE_COUNT,
  BLACK2_ENCOUNTER_SET_COUNT,
  BLACK2_FACILITY_COUNT,
  BLACK2_KEPT_CLASS_COUNT,
  BLACK2_DROPPED_CLASS_COUNT,
  BLACK2_AI_STRATEGY_COUNT,
  BLACK2_NATURE_MODIFIERS,
  BLACK2_TYPE_EFFECTIVENESS_CHART,
  BLACK2_ABILITY_LOGIC,
  BLACK2_FACILITY_LEVEL_RANGE,
} from './black2Systems';
import {
  STAT_STAGE_RATIOS,
  ACCURACY_STAGE_RATIOS,
  CRIT_STAGE_DENOMINATORS,
  BAG_POCKETS_PER_GENERATION,
  STORAGE_RULES,
} from './playableWiring';
import {
  OPPONENT_MOVE_ROWS,
  OPPONENT_COUNTS,
  OPPONENT_VECTORS as OPPONENT_DIRECTION_VECTORS,
} from './opponentDirection';
// NOTE: spriteSheets.ts imports PNGs (Vite-only), so this script reads the
// sheet manifests from disk instead of importing that module.
const SHEET_DEFS: Record<string, { speciesId: string; name: string }> = {
  '147': { speciesId: '147', name: 'Dorowani' },
  '148': { speciesId: '148', name: 'Gabu' },
};

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(HERE, '..');
const GENERATED = path.join(SRC, 'lib', 'generated');
const SPRITES = path.join(SRC, 'assets', 'sprites');

const TRUE_ELEMENTS = ['Water', 'Chrome', 'Earth', 'Bug', 'Umbral', 'Aero', 'Core', 'Strike', 'Deep', 'Flame', 'Mythic', 'Normal'];
const errors: string[] = [];
const warnings: string[] = [];

function walk(dir: string, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.json')) out.push(p);
  }
  return out;
}

// 1. Canonical roster checks (hard errors on unresolved references).
const speciesIds = Object.keys(SPECIES_DB);
console.log(`Canonical species: ${speciesIds.length} (${speciesIds.join(', ')})`);
for (const [id, sp] of Object.entries(SPECIES_DB)) {
  if (!sp.name) errors.push(`Species ${id}: missing name`);
  if (!sp.types || sp.types.length === 0) errors.push(`Species ${id}: no types`);
  for (const [k, v] of Object.entries(sp.baseStats)) {
    if (!Number.isFinite(v) || v < 1 || v > 255) errors.push(`Species ${id}: stat ${k}=${v} out of range 1-255`);
  }
  for (const l of sp.learnset || []) {
    if (!MOVES_DB[l.moveId]) errors.push(`Species ${id} (${sp.name}): learnset move ${l.moveId} not in MOVES_DB`);
  }
  if (sp.evolution && !SPECIES_DB[sp.evolution.targetId]) {
    errors.push(`Species ${id} (${sp.name}): evolution target ${sp.evolution.targetId} not in SPECIES_DB`);
  }
  // Open decision, warning only: species.ts still uses Pokemon type names,
  // the 12 True Elements are the canonical vocabulary (unification-map).
  for (const t of sp.types || []) {
    if (!TRUE_ELEMENTS.includes(t)) warnings.push(`Species ${id} (${sp.name}): type ${t} is not one of the 12 True Elements (open unification decision)`);
  }
}
console.log(`Canonical moves: ${Object.keys(MOVES_DB).length}`);
for (const [id, m] of Object.entries(MOVES_DB)) {
  if (m.bp < 0 || m.bp > 250) warnings.push(`Move ${id}: power ${m.bp} unusual`);
  if (m.pp < 1 || m.pp > 40) warnings.push(`Move ${id}: PP ${m.pp} unusual`);
}

// 2. Sheet manifests: frames inside the 192x64 sheet, files present.
for (const def of Object.values(SHEET_DEFS)) {
  const dir = path.join(SPRITES, def.name.toLowerCase());
  const manifestPath = path.join(dir, `${def.name.toLowerCase()}.manifest.json`);
  if (!fs.existsSync(manifestPath)) { warnings.push(`Sheet ${def.name}: manifest missing at ${manifestPath}`); continue; }
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  // Sheet geometry comes from the manifest itself, not a hardcoded
  // 192-wide sheet: locked atlases are 384 wide (dorowani 384x192,
  // gabu 384x256) and the old <name>_sheet.png files were deleted
  // 2026-10-26 per Mars order, so the old check flagged live art
  // as missing. Fall back to the old 192 / <name>_sheet.png check
  // only for manifests that name no sheet.
  const sheetWidth = manifest.sheet?.width ?? 192;
  const sheetFile = manifest.sheet?.file
    ? path.join(path.resolve(SRC, '..'), manifest.sheet.file)
    : path.join(dir, `${def.name.toLowerCase()}_sheet.png`);
  for (const f of manifest.frames || []) {
    const fw = f.width ?? 64;
    if (f.x < 0 || f.x + fw > sheetWidth) errors.push(`Sheet ${def.name}: frame ${f.view} x=${f.x} outside ${sheetWidth}-wide sheet`);
  }
  if (!fs.existsSync(sheetFile)) errors.push(`Sheet ${def.name}: sheet PNG missing at ${sheetFile}`);
  if (!SPECIES_DB[def.speciesId]) warnings.push(`Sheet ${def.name} (${def.speciesId}): art is original, but no species.ts entry yet — stats/types not set, not choosable in the lab (intentional, not an error)`);
}

// 3. Reference JSONs: parse + count only, never imported as content.
const refFiles = walk(GENERATED);
let refParsed = 0;
for (const f of refFiles) {
  try {
    const data = JSON.parse(fs.readFileSync(f, 'utf8'));
    refParsed++;
    const count = Array.isArray(data) ? data.length : Object.keys(data).length;
    console.log(`  reference OK: ${path.relative(SRC, f)} (${count} top-level entries)`);
  } catch (e) {
    errors.push(`Reference file unparsable: ${f}: ${(e as Error).message}`);
  }
}
console.log(`Reference JSON files parsed: ${refParsed}/${refFiles.length}`);

// 4. No game source imports reference data as content.
const srcFiles = walk(SRC).filter(f => !f.includes('generated') && !f.includes('validate-reference'));
for (const f of srcFiles) {
  if (!f.endsWith('.ts') && !f.endsWith('.tsx')) continue;
  const text = fs.readFileSync(f, 'utf8');
  if (/from ['"].*lib\/generated\//.test(text) || /require\(['"].*generated\//.test(text)) {
    errors.push(`Game source imports reference data: ${path.relative(SRC, f)}`);
  }
}

// 5. Black 2 everything-else reference counts (stage2 call site).
// These are reference-data counts only: the JSONs are parsed in §3,
// the lookup module's constants must match them, and the four gaps
// that were 0 in the source must still be null (not invented).
const black2Expected: Record<string, number> = {
  'decomp_black2_items.json': BLACK2_ITEM_COUNT,
  'decomp_black2_abilities.json': BLACK2_ABILITY_COUNT,
  'decomp_black2_natures.json': BLACK2_NATURE_COUNT,
  'decomp_black2_types.json': BLACK2_TYPE_COUNT,
  'decomp_black2_lighting.json': BLACK2_LIGHTING_SETS,
  'decomp_black2_zones.json': BLACK2_ZONE_COUNT,
  'decomp_black2_encounters.json': BLACK2_ENCOUNTER_SET_COUNT,
  'decomp_black2_trainer_facilities.json': BLACK2_FACILITY_COUNT,
  'decomp_black2_trainer_classes.json': BLACK2_KEPT_CLASS_COUNT,
};
for (const [file, expected] of Object.entries(black2Expected)) {
  const p = path.join(GENERATED, file);
  if (!fs.existsSync(p)) { warnings.push(`Black 2 reference missing: ${file} (expected count ${expected})`); continue; }
  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  // Each JSON stores its count under a different key; lighting uses
  // field/battle arrays, classes use keptGenericOrTitledClasses.
  const actual = file === 'decomp_black2_lighting.json'
    ? ((data.field?.length ?? 0) + (data.battle?.length ?? 0))
    : file === 'decomp_black2_trainer_classes.json'
      ? (data.keptGenericOrTitledClasses ?? -1)
      : typeof data.count === 'number' ? data.count
      : typeof data.facilityCount === 'number' ? data.facilityCount
      : -1;
  if (actual !== expected) errors.push(`Black 2 reference count mismatch: ${file} expected ${expected}, got ${actual}`);
  else console.log(`  black2 OK: ${file} count ${expected}`);
}
if (BLACK2_DROPPED_CLASS_COUNT + BLACK2_KEPT_CLASS_COUNT !== 237) errors.push(`Black 2 classes: kept ${BLACK2_KEPT_CLASS_COUNT} + dropped ${BLACK2_DROPPED_CLASS_COUNT} != 237`);
if (BLACK2_AI_STRATEGY_COUNT !== 14) errors.push(`Black 2 AI strategies: expected 14, got ${BLACK2_AI_STRATEGY_COUNT}`);
if (BLACK2_NATURE_MODIFIERS !== null) errors.push('Black 2 nature modifiers must stay null (not invented)');
if (BLACK2_TYPE_EFFECTIVENESS_CHART !== null) errors.push('Black 2 type chart must stay null (not invented)');
if (BLACK2_ABILITY_LOGIC !== null) errors.push('Black 2 ability logic must stay null (not invented)');
if (BLACK2_FACILITY_LEVEL_RANGE !== null) errors.push('Black 2 facility level range must stay null (not invented)');


// 6. Playable-wiring library checks (call-site pass, not stage2-display).
// Library presence only for most rows: in-game call sites are Shop sell
// price, PC storage rules, and the battle-canvas direction sign. Blocked
// rows (26) stay un-invented: no canonical bag pocket, no True chart,
// no map/roster assignment, no facility level rule is asserted here.
if (STAT_STAGE_RATIOS.length !== 13) errors.push(`Playable wiring: stat stages expected 13, got ${STAT_STAGE_RATIOS.length}`);
if (ACCURACY_STAGE_RATIOS.length !== 13) errors.push(`Playable wiring: accuracy stages expected 13, got ${ACCURACY_STAGE_RATIOS.length}`);
if (CRIT_STAGE_DENOMINATORS.length !== 5) errors.push(`Playable wiring: crit stages expected 5, got ${CRIT_STAGE_DENOMINATORS.length}`);
if (STORAGE_RULES.slotsPerBox !== 30 || STORAGE_RULES.partyMax !== 6) errors.push('Playable wiring: storage rules expected 30 slots / 6 party');
if (Object.keys(BAG_POCKETS_PER_GENERATION).length !== 3) errors.push('Playable wiring: bag pockets expected 3 generations, no canonical choice');
if (OPPONENT_COUNTS.moves_total !== 560) errors.push(`Opponent direction: moves expected 560, got ${OPPONENT_COUNTS.moves_total}`);
if (OPPONENT_COUNTS.moves_opponent_travel_confirmed !== 442) errors.push(`Opponent direction: confirmed vectors expected 442, got ${OPPONENT_COUNTS.moves_opponent_travel_confirmed}`);
if (OPPONENT_COUNTS.moves_confirmed_origin_body_part !== 0) errors.push('Opponent direction: body-part origins must stay 0 (not invented)');
if (OPPONENT_MOVE_ROWS.length !== 560) errors.push(`Opponent direction: move rows expected 560, got ${OPPONENT_MOVE_ROWS.length}`);
if (OPPONENT_MOVE_ROWS.some((r: any) => r.origin_label !== 'unconfirmed')) errors.push('Opponent direction: every move origin must stay unconfirmed');
if (Math.sign(OPPONENT_DIRECTION_VECTORS.single.dx) !== -1) errors.push('Opponent direction: single vector must travel left (dx < 0)');
else console.log('  playable OK: stat/accuracy/crit tables, storage rules, opponent 560/442/0');

console.log(`\nWarnings (${warnings.length}):`);
for (const w of [...new Set(warnings)].slice(0, 40)) console.log(`  WARN: ${w}`);
if (warnings.length > 40) console.log(`  ... and ${warnings.length - 40} more (same open decisions)`);
if (errors.length > 0) {
  console.log(`\nERRORS (${errors.length}):`);
  for (const e of errors) console.log(`  ERROR: ${e}`);
  process.exit(1);
}
console.log('\nvalidate:reference PASSED (warnings are open decisions, not failures).');
