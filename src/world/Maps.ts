export interface NpcDef {
  id: string;
  x: number;
  y: number;
  sprite: string;
  name: string;
  dialog: string[];
  battle?: any;
}

export interface MapExit {
  x: number;
  y: number;
  to: string;
  enterAt: { x: number; y: number };
}

export interface Encounter {
  mochiId: number;
  rate: number;
  level: [number, number];
}

export interface EventDef {
  id: string;
  x: number;
  y: number;
  trigger: string;
  condition?: string;
  dialog: string[];
  once?: boolean;
}

export interface MapData {
  name: string;
  music: string;
  width: number;
  height: number;
  tiles: number[][];
  playerStart: { x: number; y: number };
  npcs: NpcDef[];
  exits: MapExit[];
  encounters: Encounter[];
  events: EventDef[];
}

function generateTiles(w: number, h: number, fill: number = 0) {
  return Array.from({ length: h }, () => Array(w).fill(fill));
}

// Generate Sector 0
const s0Tiles = generateTiles(30, 30, 0);
for(let y=0; y<30; y++) {
  for(let x=0; x<30; x++) {
    if(x===0 || x===29 || y===0 || y===29) s0Tiles[y][x] = 1; // borders
    if(y>20) s0Tiles[y][x] = 2; // ocean at bottom
    if(y===20) s0Tiles[y][x] = 7; // sand
  }
}
// Add paths
for(let x=10; x<=14; x++) {
  for(let y=5; y<=20; y++) s0Tiles[y][x] = 3;
}
for(let x=14; x<=25; x++) {
  for(let y=12; y<=14; y++) s0Tiles[y][x] = 3;
}
// Add buildings
s0Tiles[8][5] = 4; s0Tiles[8][6] = 4; s0Tiles[9][5] = 4; s0Tiles[9][6] = 5; // Lab
s0Tiles[12][20] = 4; s0Tiles[12][21] = 4; s0Tiles[13][20] = 4; s0Tiles[13][21] = 5; // Player house
// Add tall grass patch
for(let x=22; x<=26; x++) {
  for(let y=5; y<=8; y++) s0Tiles[y][x] = 6;
}
// Exits to Route 1.0 at the top
s0Tiles[0][11] = 3; s0Tiles[0][12] = 3; s0Tiles[0][13] = 3;

// Generate Route 1.0
const r1Tiles = generateTiles(30, 40, 0);
for(let y=0; y<40; y++) {
  for(let x=0; x<30; x++) {
    if(x<=5 || x>=24 || y===0 || y===39) r1Tiles[y][x] = 1; // trees border
    if(x>5 && x<24 && Math.random() < 0.3) r1Tiles[y][x] = 6; // random tall grass
  }
}
// clear a path winding through
let px = 12;
for(let y=38; y>=1; y--) {
  r1Tiles[y][px] = 3;
  r1Tiles[y][px+1] = 3;
  r1Tiles[y][px+2] = 3;
  if (y%5===0) px += (Math.random()>0.5 ? 2 : -2);
  px = Math.max(6, Math.min(px, 21));
}
// Exits
r1Tiles[39][11] = 3; r1Tiles[39][12] = 3; r1Tiles[39][13] = 3; // To Sector 0
r1Tiles[0][11] = 3; r1Tiles[0][12] = 3; r1Tiles[0][13] = 3; // To The Dark Forest

// Generate The Dark Forest
const bwTiles = generateTiles(30, 30, 1);
for(let y=5; y<25; y++) {
  for(let x=5; x<25; x++) {
    bwTiles[y][x] = Math.random() > 0.8 ? 1 : Math.random() > 0.6 ? 6 : 0;
  }
}
// clearing for dojo
for(let x=12; x<=18; x++) {
  for(let y=10; y<=15; y++) bwTiles[y][x] = 0;
}
bwTiles[11][14]=4; bwTiles[11][15]=4; bwTiles[11][16]=4; 
bwTiles[12][14]=4; bwTiles[12][15]=5; bwTiles[12][16]=4; // Dojo building
for(let x=14; x<=16; x++) {
  for(let y=16; y<=29; y++) bwTiles[y][x] = 3;
}

// Generate Route 4.0 (Quartz Caverns)
const r4Tiles = generateTiles(30, 40, 7); // sand / cave floor
for(let y=0; y<40; y++) {
  for(let x=0; x<30; x++) {
    if(x===0 || x===29 || y===0 || y===39) r4Tiles[y][x] = 1; // walls
    if(Math.random() < 0.2) r4Tiles[y][x] = Math.random() < 0.5 ? 1 : 6;
  }
}
// Clear path
for(let y=0; y<40; y++) {
  r4Tiles[y][14] = 3;
  r4Tiles[y][15] = 3;
}

// Generate Crag Peak City
const cragTiles = generateTiles(30, 30, 3);
for(let y=0; y<30; y++) {
  for(let x=0; x<30; x++) {
    if(x===0 || x===29 || y===0 || y===29) cragTiles[y][x] = 1; // walls
  }
}
// Dojo building
for(let y=10; y<=14; y++) {
  for(let x=12; x<=16; x++) {
    cragTiles[y][x] = 4;
  }
}
cragTiles[14][14] = 5;

// Export Maps
export const MAPS: Record<string, MapData> = {
  // ... existing maps

  "sector0": {
    name: "Sector 0 — Boot Harbor",
    music: "sector0",
    width: 30, height: 30,
    tiles: s0Tiles,
    playerStart: { x: 21, y: 14 },
    npcs: [
      { id: "prof", x: 6, y: 10, sprite: "🔬", name: "Prof. Aeon", dialog: ["Welcome to the Mainframe Region!", "I study Mochiichao — digital creatures that evolved in this virtual world.", "You'll need a partner to explore safely.", "Come to my lab and choose your first Mochiichao!"] },
      { id: "mom", x: 20, y: 14, sprite: "👩", name: "Your Mom", dialog: ["Be careful out there!", "Those Hackers have been causing trouble on the routes...", "Your Mochiimind will keep notes on everything you encounter."] },
      { id: "rival", x: 14, y: 10, sprite: "😤", name: "Hex", dialog: ["Hey! You must be the new trainer Prof. Aeon mentioned.", "I'm getting my starter TODAY. Don't think you can beat me!", "Name's Hex. Remember it."] },
      { id: "npc1", x: 19, y: 20, sprite: "👤", name: "Local Kid", dialog: ["I heard there's a branded Kittember in the tall grass near the woods...", "It had a glowing 'H' burned into its side. Creepy."] },
      { id: "npc2", x: 12, y: 22, sprite: "🎣", name: "Fisherman", dialog: ["The waters here are calm, but I've seen something HUGE moving deep below...", "The old-timers call it Astroleviathan. I call it my nightmare."] },
    ],
    exits: [
      { x: 11, y: 0, to: "route1", enterAt: { x: 11, y: 38 } },
      { x: 12, y: 0, to: "route1", enterAt: { x: 12, y: 38 } },
      { x: 13, y: 0, to: "route1", enterAt: { x: 13, y: 38 } },
    ],
    encounters: [],
    events: [
      { id: "branded_kittember", x: 24, y: 9, trigger: "step", condition: "hasStarter", dialog: ["You hear a faint cry from the tall grass...", "A KITTEMBER leaps out — but something is wrong.", "A glowing electric 'H' is burned painfully into its side!", "The Mochiimind records: 'Illegal branding detected. Hacker modification.'", "The Kittember flees before you can help it."], once: true },
    ]
  },
  "route1": {
    name: "Route 1.0 — Greenfield Path",
    music: "route1",
    width: 30, height: 40,
    tiles: r1Tiles,
    playerStart: { x: 12, y: 38 },
    npcs: [
      { id: "trainer1", x: 10, y: 25, sprite: "🧒", name: "Trainer Rex", dialog: ["Hey newcomer! You can't pass without battling me!"], battle: { name: "Trainer Rex", team: [{ id: 4, name: "Squirmite", type: "Bug", hp: 35, atk: 35, def: 35, spd: 50, color: "#c5e1a5", sprite: "🐛", moves: ["String Shot", "Tackle"] }], reward: 120 } },
      { id: "hacker1", x: 18, y: 15, sprite: "🕶️", name: "Hacker Grunt", dialog: ["The Dojos are CHAINS. We're breaking them ALL.", "The H is freedom. You'll understand... or you'll lose!"], battle: { name: "Hacker Grunt", team: [{ id: 6, name: "Kittember", type: "Umbral", hp: 42, atk: 50, def: 38, spd: 55, color: "#ce93d8", sprite: "🐱", moves: ["Scratch", "Growl"] }, { id: 7, name: "Pupbble", type: "Core", hp: 50, atk: 40, def: 50, spd: 35, color: "#ffcc80", sprite: "🐶", moves: ["Tackle", "Tail Whip"] }], reward: 200 } },
      { id: "trainer2", x: 15, y: 8, sprite: "🏃", name: "Data Miner", dialog: ["My Mochiichao was forged in the digital mantle!"], battle: { name: "Miner Pete", team: [{ id: 10, name: "Gearkid", type: "Chrome", hp: 44, atk: 48, def: 54, spd: 38, color: "#cfd8dc", sprite: "⚙️", moves: ["Metal Sound", "Tackle"] }], reward: 150 } },
    ],
    exits: [
      { x: 11, y: 39, to: "sector0", enterAt: { x: 11, y: 1 } },
      { x: 12, y: 39, to: "sector0", enterAt: { x: 12, y: 1 } },
      { x: 13, y: 39, to: "sector0", enterAt: { x: 13, y: 1 } },
      { x: 14, y: 39, to: "sector0", enterAt: { x: 13, y: 1 } },
      { x: 11, y: 0, to: "binarywoods", enterAt: { x: 14, y: 28 } },
      { x: 12, y: 0, to: "binarywoods", enterAt: { x: 15, y: 28 } },
      { x: 13, y: 0, to: "binarywoods", enterAt: { x: 16, y: 28 } },
    ],
    encounters: [
      { mochiId: 4, rate: 30, level: [3,5] },
      { mochiId: 5, rate: 25, level: [3,6] },
      { mochiId: 6, rate: 20, level: [4,6] },
      { mochiId: 7, rate: 25, level: [3,5] },
    ],
    events: []
  },
  "binarywoods": {
    name: "The Dark Forest",
    music: "woods",
    width: 30, height: 30,
    tiles: bwTiles,
    playerStart: { x: 15, y: 28 },
    npcs: [
      { id: "masterlin", x: 15, y: 13, sprite: "🥋", name: "Master Lin", dialog: ["I am Master Lin, keeper of the Dark Forest Dojo.", "The silk weavers and data-spinners are my domain.", "Defeat me and earn Root.Chop — then these brambles shall part before you!"], battle: { name: "Master Lin", isDojo: true, badge: "Silk Badge", team: [{ id: 17, name: "Cocoonode", type: "Bug", hp: 55, atk: 40, def: 85, spd: 30, color: "#c5e1a5", sprite: "🪲", moves: ["String Shot", "Iron Defense", "Bug Bite", "Tackle"] }, { id: 4, name: "Squirmite", type: "Bug", hp: 35, atk: 35, def: 35, spd: 50, color: "#c5e1a5", sprite: "🐛", moves: ["String Shot", "Tackle"] }], reward: 1200 } },
      { id: "woodsnpc", x: 20, y: 20, sprite: "🌲", name: "Forest Guide", dialog: ["These woods are alive with digital life.", "But lately... the Hackers patrol the eastern paths.", "Stay on the lit trails."] },
    ],
    exits: [
      { x: 14, y: 29, to: "route1", enterAt: { x: 11, y: 1 } },
      { x: 15, y: 29, to: "route1", enterAt: { x: 12, y: 1 } },
      { x: 16, y: 29, to: "route1", enterAt: { x: 13, y: 1 } },
      { x: 15, y: 0, to: "route4", enterAt: { x: 14, y: 38 } },
      { x: 14, y: 0, to: "route4", enterAt: { x: 14, y: 38 } },
      { x: 16, y: 0, to: "route4", enterAt: { x: 15, y: 38 } },
    ],
    encounters: [
      { mochiId: 4, rate: 35, level: [5,8] },
      { mochiId: 6, rate: 30, level: [5,9] },
      { mochiId: 7, rate: 20, level: [6,9] },
      { mochiId: 8, rate: 15, level: [5,8] },
    ],
    events: []
  },
  "route4": {
    name: "Route 4.0 — Quartz Caverns",
    music: "cave",
    width: 30, height: 40,
    tiles: r4Tiles,
    playerStart: { x: 14, y: 38 },
    npcs: [
      { id: "hacker2", x: 14, y: 20, sprite: "🕶️", name: "Hacker Block", dialog: ["Stop! This route is under Syndicate lockdown!"] }
    ],
    exits: [
      { x: 14, y: 39, to: "binarywoods", enterAt: { x: 15, y: 1 } },
      { x: 15, y: 39, to: "binarywoods", enterAt: { x: 15, y: 1 } },
      { x: 14, y: 0, to: "cragpeak", enterAt: { x: 14, y: 28 } },
      { x: 15, y: 0, to: "cragpeak", enterAt: { x: 15, y: 28 } },
    ],
    encounters: [
      { mochiId: 7, rate: 50, level: [8, 12] },
      { mochiId: 10, rate: 30, level: [8, 12] }
    ],
    events: []
  },
  "cragpeak": {
    name: "Crag-Peak City",
    music: "city",
    width: 30, height: 30,
    tiles: cragTiles,
    playerStart: { x: 14, y: 28 },
    npcs: [
      { 
        id: "masterterra", x: 14, y: 12, sprite: "🪨", name: "Master Terra", 
        dialog: ["Welcome to Crag-Peak Dojo.", "Our Mochiichao hit like an earthquake!"],
        battle: { 
          name: "Master Terra", 
          isDojo: true, 
          badge: "Quake Badge", 
          team: [
            { id: 8, name: "Duneclaw", type: "Earth", hp: 60, atk: 75, def: 55, spd: 55, color: "#d7ccc8", sprite: "🐊", moves: ["Earthquake", "Crunch"] }
          ], 
          reward: 2000 
        } 
      },
      { id: "cragguy", x: 10, y: 20, sprite: "🧗", name: "Climber", dialog: ["This city is built directly into the mountain's data blocks."] }
    ],
    exits: [
      { x: 14, y: 29, to: "route4", enterAt: { x: 14, y: 1 } },
      { x: 15, y: 29, to: "route4", enterAt: { x: 15, y: 1 } },
    ],
    encounters: [],
    events: []
  }
};
