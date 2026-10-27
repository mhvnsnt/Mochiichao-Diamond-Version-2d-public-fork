export const GAME_DATA = {
  starters: [
    { id: 1, name: "Mochii", type: "Water", hp: 44, atk: 48, def: 65, spd: 43, color: "#4fc3f7", sprite: "🌊", desc: "A soft, wave-patterned creature that absorbs moisture from the air to power itself.", moves: ["Foam Burst", "Tackle", "Aqua Blast", "Tail Flick"] },
    { id: 2, name: "Razorgater", type: "Chrome", hp: 45, atk: 60, def: 40, spd: 55, color: "#b0bec5", sprite: "⚙️", desc: "Its razor-edged chrome plating deflects data attacks. Razor-sharp and relentless.", moves: ["Chrome Claw", "Tackle", "Stare Down", "Claw"] },
    { id: 3, name: "Tyrage", type: "Earth", hp: 55, atk: 69, def: 45, spd: 34, color: "#a5d6a7", sprite: "🌿", desc: "A ground-shaking brute whose footsteps leave glowing cracks in digital terrain.", moves: ["Punch", "Stare Down", "Vine Lash", "Rumble"] },
  ],
  mochiichao: [
    { id: 4, name: "Squirmite", type: "Bug", hp: 35, atk: 35, def: 35, spd: 50, color: "#c5e1a5", sprite: "🐛", moves: ["Web Blast", "Tackle"] },
    { id: 5, name: "Zephling", type: "Aero", hp: 40, atk: 45, def: 30, spd: 65, color: "#b3e5fc", sprite: "💨", moves: ["Wind Blast", "Tackle"] },
    { id: 6, name: "Kittember", type: "Umbral", hp: 42, atk: 50, def: 38, spd: 55, color: "#ce93d8", sprite: "🐱", moves: ["Claw", "Rumble"] },
    { id: 7, name: "Pupbble", type: "Core", hp: 50, atk: 40, def: 50, spd: 35, color: "#ffcc80", sprite: "🐶", moves: ["Tackle", "Tail Flick"] },
    { id: 8, name: "Inklet", type: "Water", hp: 38, atk: 52, def: 32, spd: 60, color: "#80deea", sprite: "🦑", moves: ["Ink Splash", "Tackle"] },
    { id: 9, name: "Wispkin", type: "Umbral", hp: 36, atk: 55, def: 28, spd: 68, color: "#b39ddb", sprite: "👻", moves: ["Night Stealth", "Stare Down"] },
    { id: 10, name: "Gearkid", type: "Chrome", hp: 44, atk: 48, def: 54, spd: 38, color: "#cfd8dc", sprite: "⚙️", moves: ["Chrome Screech", "Tackle"] },
    { id: 11, name: "Punchkid", type: "Strike", hp: 50, atk: 60, def: 40, spd: 50, color: "#ffab91", sprite: "👊", moves: ["Jab", "Stare Down"] },
    { id: 12, name: "Krakenox", type: "Deep", hp: 70, atk: 75, def: 55, spd: 45, color: "#1a237e", sprite: "🐙", moves: ["Crush", "Water Surge", "Dark Tide", "Scoop Slam"] },
    { id: 13, name: "Dreadtoise", type: "Core", hp: 80, atk: 55, def: 90, spd: 25, color: "#37474f", sprite: "🐢", moves: ["Chrome Guard", "Tackle", "Shell Burst", "Rockfall"] },
    { id: 14, name: "Reaperdile", type: "Earth", hp: 95, atk: 105, def: 65, spd: 70, color: "#1b5e20", sprite: "🐊", moves: ["Reap Claw", "Tremor", "Draco Tail", "Munch"] },
    { id: 15, name: "AquariiOS", type: "Water", hp: 85, atk: 70, def: 85, spd: 95, color: "#01579b", sprite: "🌊", moves: ["Water Jet", "Hydro Rush", "Wave", "Frost Blast"] },
    { id: 16, name: "Mythar", type: "Mythic", hp: 110, atk: 120, def: 90, spd: 100, color: "#ffd700", sprite: "✨", moves: ["Mythic Pulse", "Data Rend", "Quantum Strike", "Aura Burst"] },
    { id: 17, name: "Cocoonode", type: "Bug", hp: 55, atk: 40, def: 85, spd: 30, color: "#c5e1a5", sprite: "🪲", moves: ["Web Blast", "Chrome Guard", "Mosquito Bite", "Tackle"] },
  ],
  moves: {
    "Tackle": { power: 40, type: "Normal", acc: 95 },
    "Foam Burst": { power: 40, type: "Water", acc: 100 },
    "Aqua Blast": { power: 65, type: "Water", acc: 100 },
    "Tail Flick": { power: 0, type: "Normal", acc: 100, effect: "def-1" },
    "Chrome Claw": { power: 50, type: "Chrome", acc: 95 },
    "Stare Down": { power: 0, type: "Normal", acc: 100, effect: "def-1" },
    "Claw": { power: 40, type: "Normal", acc: 100 },
    "Vine Lash": { power: 45, type: "Earth", acc: 100 },
    "Rumble": { power: 0, type: "Normal", acc: 100, effect: "atk-1" },
    "Punch": { power: 40, type: "Normal", acc: 100 },
    "Web Blast": { power: 0, type: "Bug", acc: 95, effect: "spd-2" },
    "Wind Blast": { power: 40, type: "Aero", acc: 100 },
    "Ink Splash": { power: 55, type: "Water", acc: 100 },
    "Night Stealth": { power: 40, type: "Umbral", acc: 100 },
    "Chrome Screech": { power: 0, type: "Chrome", acc: 85, effect: "def-2" },
    "Jab": { power: 40, type: "Strike", acc: 100 },
    "Crush": { power: 80, type: "Deep", acc: 90 },
    "Water Surge": { power: 70, type: "Water", acc: 95 },
    "Dark Tide": { power: 90, type: "Umbral", acc: 85 },
    "Scoop Slam": { power: 80, type: "Normal", acc: 75 },
    "Chrome Guard": { power: 0, type: "Chrome", acc: 100, effect: "def+2" },
    "Shell Burst": { power: 0, type: "Normal", acc: 100, effect: "mixed" },
    "Rockfall": { power: 75, type: "Core", acc: 90 },
    "Reap Claw": { power: 100, type: "Earth", acc: 90 },
    "Tremor": { power: 100, type: "Earth", acc: 100 },
    "Draco Tail": { power: 60, type: "Earth", acc: 90 },
    "Munch": { power: 80, type: "Umbral", acc: 100 },
    "Water Jet": { power: 110, type: "Water", acc: 80 },
    "Hydro Rush": { power: 40, type: "Water", acc: 100 },
    "Wave": { power: 90, type: "Water", acc: 100 },
    "Frost Blast": { power: 90, type: "Water", acc: 100 },
    "Mythic Pulse": { power: 120, type: "Mythic", acc: 95 },
    "Data Rend": { power: 100, type: "Mythic", acc: 100 },
    "Quantum Strike": { power: 90, type: "Mythic", acc: 100 },
    "Aura Burst": { power: 110, type: "Mythic", acc: 90 },
    "Mosquito Bite": { power: 60, type: "Bug", acc: 100 },
  },
};

export const TYPE_COLORS: Record<string, string> = {
  Water: "#4fc3f7", Chrome: "#90a4ae", Earth: "#81c784", Bug: "#aed581",
  Umbral: "#9575cd", Aero: "#80deea", Core: "#ffb74d", Strike: "#ef9a9a",
  Deep: "#283593", Flame: "#ff7043", Mythic: "#ffd700", Normal: "#bcaaa4",
};

export function calcDamage(moveObj: any, attacker: any, defender: any) {
  if (!moveObj.power) return 0;
  const base = moveObj.power;
  const atkStat = attacker.atk || 50;
  const defStat = defender.def || 50;
  const lvlMod = (attacker.level || 5) * 2 / 5 + 2;
  const dmg = Math.floor(lvlMod * base * (atkStat / defStat) / 50) + 2;
  const roll = (Math.floor(Math.random() * 16) + 85) / 100;
  return Math.max(1, Math.floor(dmg * roll));
}

export function makeBattleMon(template: any, levelRange: [number, number] | number) {
  const lvl = Array.isArray(levelRange) 
    ? Math.floor(Math.random() * (levelRange[1] - levelRange[0] + 1)) + levelRange[0]
    : levelRange;
  const hp = Math.floor(template.hp * lvl / 10) + 20;
  return { ...template, level: lvl, maxHp: hp, currentHp: hp };
}
