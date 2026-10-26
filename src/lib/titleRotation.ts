// Title silhouette rotation (Mars, 2026-10-25 18:26/18:28 CDT):
// rotates every startup and every return to main menu (BACK TO
// TITLE), never the same creature twice in a row, each creature
// with its own vibe/theme like FireRed/HeartGold/LeafGreen/
// Sapphire/Ruby title screens. Final pool, 10 creatures.
// CORRECTION: the ghost is WISPKIN (#042, black drop body, white
// cracked skull face, black wisp smoke, V1 sheet is default/base)
// — Duskfiend is NOT in this pool at all. Mythar stays until Mars
// says otherwise.
// SWAP (Mars, 2026-10-25 18:31 CDT): Mochii STAYS, Tiidebiite is
// OUT of title rotation, replaced by YOGIFERNO (white yeti/
// gorilla, blue tribal markings, fire halo + fire staff, sheet in
// 2d-sheets/yogiferno/). Pool stays 10.
// Creature ART is now shipped: src/assets/title/<name>-walk-
// cutout.png for all 10 pool creatures (Yogiferno PR #33 + the
// other 9 in this batch), wired via TitleCreatureFigure in
// IntroSequence. Rotation logic + theme wiring are unchanged.
// YOGIFERNO HABITAT CANON (Mars 18:33-18:34 CDT, for later, NOT
// title code): desert (Fire/Ground), forest, rain, Safari-type,
// mountain, snow/ice regions — deeper/later regions. Snow
// encounter level/route NOT locked — do not invent one.
// Biome pull: list 100% named, biome-to-region placement 0%
// (World Builder lane, after v5.2 playtest + win).
export interface TitleCreature {
  name: string;
  dex: string;
  primary: string;
  accent: string;
  vibe: string;
}
export const TITLE_ROTATION_POOL: TitleCreature[] = [
  { name: 'Mochii', dex: '#001', primary: '#38bdf8', accent: '#e0f2fe', vibe: 'Blue water drop — Boot Harbor dawn' },
  { name: 'Razorgater', dex: '', primary: '#94a3b8', accent: '#e2e8f0', vibe: 'Steel / water starter — chrome edge' },
  { name: 'Tyrage', dex: '', primary: '#d97706', accent: '#fef3c7', vibe: 'Ground starter — ember dust' },
  { name: 'Kittember', dex: '', primary: '#f97316', accent: '#ffedd5', vibe: 'Fire starter — warm glow' },
  { name: 'Sproutle', dex: '', primary: '#4ade80', accent: '#dcfce7', vibe: 'Grass starter — fresh sprout' },
  { name: 'Dorowani', dex: '#147', primary: '#60a5fa', accent: '#dbeafe', vibe: 'Blue water starter — tall head fin' },
  { name: 'Gabu', dex: '#148', primary: '#2dd4bf', accent: '#ccfbf1', vibe: 'Teal starter — spiky crown' },
  { name: 'Wispkin', dex: '#042', primary: '#a855f7', accent: '#f3e8ff', vibe: 'Ghost — black drop, white cracked skull face, black wisp smoke, purple theme (V1 default/base)' },
  { name: 'Yogiferno', dex: '', primary: '#f97316', accent: '#dbeafe', vibe: 'White yeti / gorilla — blue tribal markings, fire halo + fire staff' },
  { name: 'Mythar', dex: '', primary: '#e2e8f0', accent: '#fdf4ff', vibe: 'Pearl / diamond iridescent — sine-wave rings, diamond sparkles' },
];
/** Pick a creature not in `exclude` (previous pick, last stored
 *  pick). Pool is 10, exclude is at most 2, so a fresh pick always
 *  exists; fallback is the first pool entry only if every entry
 *  were excluded, which cannot happen with 2 exclusions. */
export function pickRotation(exclude: string[]): TitleCreature {
  const fresh = TITLE_ROTATION_POOL.filter(c => !exclude.includes(c.name));
  const pool = fresh.length > 0 ? fresh : TITLE_ROTATION_POOL;
  return pool[Math.floor(Math.random() * pool.length)];
}
const LAST_KEY = 'mochiichao_last_title_creature';
export function readLastTitleCreature(): string | null {
  try { return localStorage.getItem(LAST_KEY); } catch { return null; }
}
export function writeLastTitleCreature(name: string): void {
  try { localStorage.setItem(LAST_KEY, name); } catch { /* private mode: rotation still works in-session */ }
}
