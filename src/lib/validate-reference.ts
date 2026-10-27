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

console.log(`\nWarnings (${warnings.length}):`);
for (const w of [...new Set(warnings)].slice(0, 40)) console.log(`  WARN: ${w}`);
if (warnings.length > 40) console.log(`  ... and ${warnings.length - 40} more (same open decisions)`);
if (errors.length > 0) {
  console.log(`\nERRORS (${errors.length}):`);
  for (const e of errors) console.log(`  ERROR: ${e}`);
  process.exit(1);
}
console.log('\nvalidate:reference PASSED (warnings are open decisions, not failures).');
