import { TILE, buildMap } from "./WorldConstants";

function buildEdgeExits(xStart: number, xEnd: number, y: number, to: string, enterY: number, dir: string) {
  const exits = [];
  for (let x = xStart; x <= xEnd; x++) {
    exits.push({ x, y, to, enterAt: { x, y: enterY }, dir });
  }
  return exits;
}

function buildVertExits(x: number, yStart: number, yEnd: number, to: string, enterX: number, dir: string) {
  const exits = [];
  for (let y = yStart; y <= yEnd; y++) {
    exits.push({ x, y, to, enterAt: { x: enterX, y }, dir });
  }
  return exits;
}

export const SECTOR_0: any = {
  name: "Sector 0 — Boot Harbor",
  music: "sector0_theme",
  weather: "clear",
  width: 32, height: 28,
  playerStart: { x:15, y:18 },
  tiles: [
    // v5: Route 1.0 gate corridor at x=15. Before v5 the north edge
    // (y=0) and the gap between the two north buildings (x=14-17,
    // y=1-4) were all wall/building tiles, so the sector0 -> route_1
    // exit at (13-17, 0) was unreachable no matter how the player
    // walked — that, not a missing exit, is why Route 1.0 was never
    // reached in the v4 playtest. The x=15 column is now PATH from
    // the y=5 path row up to the y=0 exit row. The block_route_1
    // events at y=1 still gate it: with no starter the player is
    // stepped back with the "go see Prof. Aeon first" message.
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,4,4,4,4,4,4,1,3,1,1,4,4,4,4,4,4,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,4,4,4,4,4,4,1,3,1,1,4,4,4,4,4,4,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,4,4,5,4,4,4,1,3,1,1,4,5,4,4,4,4,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,3,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1],
    [1,1,1,1,0,0,0,0,0,0,3,3,3,0,0,3,3,3,0,0,3,3,0,0,0,0,0,1,1,1,1,1],
    [1,1,1,1,0,1,1,0,0,0,3,0,3,0,0,3,0,3,0,0,3,3,0,0,0,1,1,1,1,1,1,1],
    [1,1,1,1,4,4,5,4,0,0,3,0,3,0,0,3,0,3,0,0,0,0,0,0,4,4,5,4,1,1,1,1],
    [1,1,1,1,4,4,3,4,0,0,3,3,3,0,0,3,3,3,0,0,0,0,0,0,4,4,3,4,1,1,1,1],
    [1,1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,10,0,0,0,0,0,0,0,0,10,0,0,0,0,0,0,0,10,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,6,6,6,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,6,6,6,0,0,0,0,0,1],
    [1,0,0,0,6,6,6,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,6,6,6,0,0,0,0,0,1],
    [1,0,0,0,6,6,6,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,6,6,6,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,0,0,0,0,0,1],
    [1,0,0,0,0,0,22,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,22,0,0,0,0,0,1],
    [1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  npcs: [
    // v5.2 home heal (implementation choice, NOT Mars canon): no
    // home interior or heal point existed in Sector 0 — the
    // playtest found no Mom/home heal anywhere — so talking to
    // Mom now fully heals the party (finishDialog's existing
    // npc.isHeal path, already used by the MochiiPlex nurse).
    // The first-time Mom intro dialogue is a separate event
    // (v4_mom_intro, no isHeal flag) and is unaffected.
    // v5.3 Mom findability: Mom used to sit at (5,7), which is a
    // BUILDING tile inside the west house block (rows 7-8, cols
    // 4-7), with wall/building/door-with-no-doors-entry neighbours
    // — no walkable tile is ever adjacent, so the facing-tile
    // interact prompt could never fire and the v5.2 playtest found
    // a "yellow figure at the west house" with no prompt. Mom now
    // stands at (5,9), on the path row directly in front of that
    // house, facing down; the player approaches from the row-10
    // grass and faces her. Dialogue, name and isHeal are unchanged;
    // the first-time v4_mom_intro event is separate and untouched.
    // This placement is an implementation addition, NOT Mars canon.
    { id:"mom", x:5, y:9, sprite:"👩", name:"Your Mom", facing:"down", movement:"wander", wanderRadius:1, isHeal: true, dialog:["There you are! The truck beat us here.","Come inside. Your room is upstairs. The boxes can wait. Go set the clock first — a new home needs a correct time.","Good. Now go say hello next door. Hex's family just moved in too. You two will need each other out there.","Wait. Before you run off — here. Sprint Boots. Hold B and you can run. A trainer who cannot run will always be late."] },
    { id:"rival_hex", x:15, y:10, sprite:"😤", name:"Hex", facing:"down", dialog:["You again? I already picked my starter. Razorgater, obviously.","Don't think I'll go easy on you just because we grew up here.","Next time we meet, we BATTLE. Count on it."], battle: { team:[{ id:"004", name:"Razorgater", hp:50, maxHp:50, atk:65, def:64, spd:48, moves:["Metal Claw","Tackle"], type:"Water", level:5 }], reward:100, badge:null } },
    { id:"fat_guy", x:9, y:13, sprite:"🧑‍🦲", name:"Technology Enthusiast", facing:"down", movement:"wander", wanderRadius:1, dialog:["Technology is incredible!", "You can now store up to 6 Mochiichao in your party!", "Any more you catch are instantly sent to your PC!"] },
  ],
  signs: [
    // v5: Sector 0 had sign TILES (tile 10) but an empty signs array,
    // so facing them did nothing in the playtest. These are real
    // interactable sign objects now (interact() checks signs).
    { x:2, y:11, text:"BOOT HARBOR\nProf. Aeon's Lab is north — walk into the door." },
    { x:11, y:11, text:"TALL GRASS\nWild Mochiichao live here — bring a partner first!" },
    { x:19, y:11, text:"BOOT HARBOR\nThe lab is north of here. Route 1.0 is north past the lab." },
    { x:15, y:5, text:"ROUTE 1.0 GATE\nNorth to Route 1.0 and Silicon Town.\nNo partner yet? Go to Prof. Aeon's Lab first." },
  ],
  exits: [
    ...buildEdgeExits(13, 17, 0, "route_1", 38, "up"),
    { x:15, y:27, to:"boot_bay", enterAt:{x:15, y:0}, dir:"down", hmNeeded:"Surf" },
  ],
  doors: [
    { x:10, y:3, to:"aeon_lab", enterAt:{x:6, y:12}, label:"Prof. Aeon's Lab" },
    // Truck/house maps: (6,7) and (26,7) were DOOR tiles with no door
    // entry and no walkable approach. The y=8 tiles below them are
    // now PATH, so the player can step (6,9)->(6,8)->(6,7) and
    // (26,9)->(26,8)->(26,7) into the houses.
    { x:6, y:7, to:"sector0_house_1f", enterAt:{x:6, y:10}, label:"Your House" },
    { x:26, y:7, to:"sector0_rival_house", enterAt:{x:6, y:10}, label:"Hex's House" }
  ],
  events: [
    { id: "block_route_1", x:13, y:1, dialog:["Wait! It's dangerous to go into the tall grass without a partner!","Go see Prof. Aeon at his lab first!"], condition: "noStarter" },
    { id: "block_route_1", x:14, y:1, dialog:["Wait! It's dangerous to go into the tall grass without a partner!","Go see Prof. Aeon at his lab first!"], condition: "noStarter" },
    { id: "block_route_1", x:15, y:1, dialog:["Wait! It's dangerous to go into the tall grass without a partner!","Go see Prof. Aeon at his lab first!"], condition: "noStarter" },
    { id: "block_route_1", x:16, y:1, dialog:["Wait! It's dangerous to go into the tall grass without a partner!","Go see Prof. Aeon at his lab first!"], condition: "noStarter" },
    { id: "block_route_1", x:17, y:1, dialog:["Wait! It's dangerous to go into the tall grass without a partner!","Go see Prof. Aeon at his lab first!"], condition: "noStarter" }
  ],
  encounters: []
};

export const AEON_LAB: any = {
  name: "Aeon's Lab",
  music: "sector0_theme",
  weather: "clear",
  width: 13, height: 14,
  playerStart: { x:6, y:12 },
  tiles: (() => {
    return buildMap(13, 14, (x, y) => {
      if (x===6&&y===13) return TILE.DOOR;
      if (x===0||x===12||y===0||y===13) return TILE.WALL;
      if (y>=1&&y<=3) return TILE.BUILDING; // computers / books
      return TILE.PATH; // inside
    });
  })(),
  npcs: [
    { id:"prof_aeon", x:6, y:4, sprite:"🔬", name:"Prof. Aeon", facing:"down", movement:"wander", wanderRadius:1, dialog:["Welcome! I'm glad you could make it.","These five Mochiichao are ready for a partner.","Go ahead, pick one!","This is the Codex. It records every Mochiichao you meet. Keep it safe.","And these are Capture Cubes. Throw one at a wild Mochiichao, and if it stays, it travels with you. That is the whole job, really."] },
    { id:"asst_mochiko", x:9, y:4, sprite:"👩‍🔬", name:"Assistant Mochiko", facing:"down", movement:"wander", wanderRadius:1, dialog:["I'm Professor Aeon's assistant, Mochiko!","He's been waiting for you to choose your first partner."] },
    // v4: in-lab Hex is dialogue-only. The FIRST battle is the
    // lab-exit event (hex_battle_event, dynamic team, rival name),
    // not this NPC — keeping both would give three Hex battles
    // (lab NPC + exit event + Boot Harbor rival) and the lab NPC's
    // fixed Razorgater contradicted the player's pick.
    { id:"hex_lab_battle", x:4, y:8, sprite:"😤", name:"Hex", facing:"right", dialog:["I already have my starter. I will be waiting at the door when you leave — do not keep me waiting."] },
    { id:"starter_mochii", x:2, y:6, sprite:"🔵", name:"Mochii Ball", facing:"down", dialog:["Mochii! (A bouncy water-type)","Are you sure you want to choose Mochii?", ""], isChoice: true, eventId: "pick_starter_001" },
    { id:"starter_razorgater", x:4, y:6, sprite:"🐊", name:"Razorgater Ball", facing:"down", dialog:["Razorgater! (A strong, metallic crocodile)","Are you sure you want to choose Razorgater?", ""], isChoice: true, eventId: "pick_starter_004" },
    { id:"starter_tyrage", x:6, y:6, sprite:"🪨", name:"Tyrage Ball", facing:"down", dialog:["Tyrage! (An earthy dinosaur)","Are you sure you want to choose Tyrage?", ""], isChoice: true, eventId: "pick_starter_007" },
    { id:"starter_kittember", x:8, y:6, sprite:"😼", name:"Kittember Ball", facing:"down", dialog:["Kittember! (A fast and fiery feline)","Are you sure you want to choose Kittember?", ""], isChoice: true, eventId: "pick_starter_010" },
    { id:"starter_sproutle", x:10, y:6, sprite:"🐢", name:"Sproutle Ball", facing:"down", dialog:["Sproutle! (A grassy plant turtle)","Are you sure you want to choose Sproutle?", ""], isChoice: true, eventId: "pick_starter_038" },
    { id:"dorowani_display", x:3, y:10, sprite:"", creatureId:"147", name:"Dorowani", facing:"down", dialog:["Dorowani! A Gen 2 starter.","Dorowani arrives later in the journey."] },
    { id:"gabu_display", x:9, y:10, sprite:"", creatureId:"148", name:"Gabu", facing:"down", dialog:["Gabu! A Gen 2 starter.","Gabu arrives later in the journey."] }
  ],
  signs: [],
  exits: [],
  doors: [
    { x:6, y:13, to:"sector0", enterAt:{x:10, y:4}, label:"Boot Harbor" }
  ],
  events: [
    { id: "hex_battle_event", condition: "hasStarter", x:6, y:12, dialog:["Hex: Hold up! Before you leave, let's see what your partner can do!"], npc: { name: "Hex", sprite: "😤" }, battle: { team:[{id:"004",name:"Razorgater",hp:45,maxHp:45,atk:60,def:40,spd:55,moves:["Metal Claw","Tackle"],type:"Steel", level:5}], reward:100, badge:null } },
    { id: "prof_speech_event", condition: "hasStarter", x:6, y:7, dialog:["Prof. Aeon: Excellent choice! Your adventure begins now!","Take good care of your new partner!"] }
  ]
};

export const ROUTE_1: any = {
  name: "Route 1.0 — Greenfield Path",
  music: "route1_theme",
  weather: "clear",
  width: 28, height: 40,
  playerStart: { x:14, y:37 },
  tiles: (() => {
    const W=28, H=40;
    const m = buildMap(W, H, (x,y) => {
      if (x===0 || x===W-1) return TILE.WALL;
      if ((x>=2&&x<=7&&y>=5&&y<=10)||(x>=18&&x<=24&&y>=5&&y<=10)) return TILE.TALL_GRASS;
      if ((x>=8&&x<=13&&y>=18&&y<=24)||(x>=15&&x<=20&&y>=18&&y<=24)) return TILE.TALL_GRASS;
      if ((x===13||x===14||x===15)&&y>=0&&y<=38) return TILE.PATH;
      if (y===15&&x>=3&&x<=24) return TILE.PATH;
      if (y===28&&x>=2&&x<=26&&(x<13||x>15)) return TILE.LEDGE;
      if (x>=22&&x<=26&&y>=30&&y<=38) return TILE.WATER;
      if (x===22&&y===15) return TILE.HM_CUT;
      if ((x>=4&&x<=6&&y>=2&&y<=4)||(x>=20&&x<=22&&y>=2&&y<=4)) return TILE.FLOWER;
      if (x<=1||x>=W-2) return TILE.WALL;
      if (x>=21&&x<=26&&y>=28&&y<=29) return TILE.SAND;
      return TILE.GRASS;
    });
    m[20][9] = TILE.HM_ROCK;
    m[1][0] = TILE.SIGN;
    m[1][15] = TILE.SIGN;
    m[30][24] = TILE.HM_WATERFALL;
    return m;
  })(),
  npcs: [
    { id:"trainer_youngster", x:8, y:7, sprite:"👦", name:"Youngster Jay", facing:"down", dialog:["Hey! You're a trainer, right?", "Sproutle's defenses are rock solid!", "Let's go!"], postBattleDialog: ["Looks like defense isn't everything.", "I need to train harder..."], battle:{ team:[{id:"038",name:"Sproutle",hp:35,maxHp:35,atk:35,def:35,spd:50,moves:["String Shot","Tackle"],type:"Grass", level:5}], reward:120, badge:null } },
    { id:"trainer_lass", x:19, y:20, sprite:"👧", name:"Lass Amy", facing:"left", dialog:["My Mochiichao is the cutest!", "It's super bouncy! Watch out!"], postBattleDialog: ["Aww, my cute Mochii...", "You're really strong!"], battle:{ team:[{id:"001",name:"Mochii",hp:38,maxHp:38,atk:35,def:35,spd:45,moves:["Bubble","Tackle"],type:"Water", level:4}], reward:100, badge:null } },
    { id:"trainer_hiker", x:14, y:30, sprite:"⛏️", name:"Hiker Dan", facing:"up", dialog:["This path is rough, but my partner is tough!", "Tyrage, show them your earth-shattering power!"], postBattleDialog: ["We crumbled like rocks...", "I'll carve a new path to victory next time."], battle:{ team:[{id:"007",name:"Tyrage",hp:45,maxHp:45,atk:40,def:40,spd:35,moves:["Pound","Tackle"],type:"Earth", level:6}], reward:180, badge:null } },
    { id:"trainer_bugcatcher", x:4, y:6, sprite:"🐛", name:"Bug Catcher Rick", facing:"right", dialog:["I use the tall grass to find bug Mochiichao!"], postBattleDialog: ["I should've caught stronger bugs!"], battle:{ team:[{id:"016",name:"Squirmite",hp:30,maxHp:30,atk:35,def:35,spd:50,moves:["String Shot","Tackle"],type:"Bug", level:3}], reward:80, badge:null } },
  ],
  signs: [
    { x:15, y:35, text:"ROUTE 1.0\nNorth to Silicon Town" },
    { x:12, y:12, text:"TRAINER TIP:\nTap Mochiichao in the wild to encounter them!" }
  ],
  exits: [
    ...buildEdgeExits(13, 17, 39, "sector0", 1, "down"),
    ...buildEdgeExits(13, 17, 0, "binary_fields", 33, "up")
  ],
  doors: [],
  events: [],
  encounters: [
    { mapZone:"tall_grass", rate:0.15, pool:[ 
        {id:"038",name:"Sproutle",hp:35,maxHp:35,atk:35,def:35,spd:50,moves:["Tackle"],type:"Grass",level:3},
        {id:"001",name:"Mochii",hp:38,maxHp:38,atk:35,def:35,spd:45,moves:["Bubble","Tackle"],type:"Water",level:3},
        {id:"010",name:"Kittember",hp:34,maxHp:34,atk:42,def:28,spd:55,moves:["Scratch","Tackle"],type:"Fire",level:4},
        {id:"016",name:"Zephling",hp:30,maxHp:30,atk:35,def:30,spd:65,moves:["Gust"],type:"Flying",level:4}
    ]}
  ]
};

export const MOCHIIPLEX_1: any = {
  name: "Silicon Town MochiiPlex",
  music: "route1_theme",
  interior: true,
  weather: "clear",
  width: 15, height: 12,
  playerStart: { x: 7, y: 10 },
  tiles: (() => {
    return buildMap(15, 12, (x, y) => {
      if ((x===7||x===8)&&y===11) return TILE.DOOR;
      if (x===0||x===14||y===0||y===11) return TILE.WALL;
      if (y===1||y===2) return TILE.BUILDING;
      return TILE.PATH;
    });
  })(),
  npcs: [
    { id: "healer_1", x: 7, y: 3, sprite: "👩‍⚕️", name: "Center Nurse", facing: "down", movement: "wander", wanderRadius: 1, dialog: ["Welcome to the MochiiPlex. Your team is tired? Rest here. It is free, and it is always free."], isHeal: true },
    { id: "shop_1", x: 3, y: 3, sprite: "🛒", name: "Clerk", facing: "down", movement: "wander", wanderRadius: 1, dialog: ["Capture Cubes, Mend Patches, and a few Data Cards. Come back when you have more CR — the good stock comes with the badges."], isShop: true }
  ],
  signs: [],
  exits: [],
  doors: [
    { x:7, y:11, to:"binary_fields", enterAt:{x:24, y:7}, label:"Exit" },
    { x:8, y:11, to:"binary_fields", enterAt:{x:24, y:7}, label:"Exit" }
  ],
  events: [],
  encounters: []
};

export const BINARY_FIELDS: any = {
  name: "Silicon Town",
  music: "fields_theme",
  weather: "clear",
  width: 30, height: 35,
  playerStart: { x:14, y:32 },
  tiles: (() => {
    const W=30, H=35;
    return buildMap(W, H, (x,y) => {
      if (x===0||x===W-1||y===0) return TILE.WALL;
      if (x>=10&&x<=19&&y>=2&&y<=8) return TILE.BUILDING;
      if (x===14&&y===8) return TILE.DOOR;
      if (x===15&&y===8) return TILE.DOOR;
      if (x>=22&&x<=27&&y>=2&&y<=6) return TILE.BUILDING;
      if (x===24&&y===6) return TILE.DOOR;
      if ((x===14||x===15)&&y>8&&y<35) return TILE.PATH;
      if (y===20&&x>=2&&x<=27) return TILE.PATH;
      if ((x>=2&&x<=9&&y>=10&&y<=18)||(x>=20&&x<=27&&y>=10&&y<=18)) return TILE.TALL_GRASS;
      if ((x>=2&&x<=9&&y>=22&&y<=30)) return TILE.TALL_GRASS;
      if (y===19&&x>=2&&x<=13) return TILE.LEDGE;
      if (x===6&&y===20) return TILE.HM_ROCK;
      if ((x>=11&&x<=13&&y===9)||(x>=16&&x<=18&&y===9)) return TILE.FLOWER;
      if (x>=2&&x<=5&&y>=24&&y<=30) return TILE.WATER;
      return TILE.GRASS;
    });
  })(),
  npcs: [
    { id:"dojo1_guard", x:14, y:9, sprite:"🥋", name:"Dojo Acolyte", facing:"down", movement:"wander", wanderRadius:1, dialog:["The Binary Dojo awaits within!", "Master Lin is the strongest trainer in Silicon Town."] },
    { id:"town_lass", x:10, y:20, sprite:"👧", name:"Town Girl", facing:"down", movement:"wander", wanderRadius:1, dialog:["This is Silicon Town! It's a bustling hub of commerce.", "You should check out the MochiiPlex to the East!"] },
    { id:"town_oldman", x:23, y:12, sprite:"👴", name:"Old Man", facing:"left", movement:"wander", wanderRadius:1, dialog:["They say before the Mainframe Region was made...", "There was a glowing ethereal creator named Mythar...", "He's the origin of all Mochiichao. A true mythical deity!"] }
  ],
  signs: [
    { x:12, y:8, text:"BINARY DOJO\nMaster Lin - The Unbreakable Core" },
    { x:22, y:6, text:"MOCHIIPLEX\nAll your trainer needs in one spot!" },
    { x:16, y:30, text:"SILICON TOWN\nThe genesis of your digital journey." }
  ],
  exits: [
    ...buildEdgeExits(13, 17, 34, "route_1", 1, "down"),
    ...buildVertExits(0, 15, 25, "binary_woods", 30, "left"),
  ],
  doors: [
    { x:14, y:8, to:"dojo_1", enterAt:{x:7, y:16}, label:"Binary Dojo — Core Gate" },
    { x:24, y:6, to:"mochiiplex_1", enterAt:{x:7, y:10}, label:"MochiiPlex" }
  ],
  events: [],
  encounters: []
};

export const DOJO_1: any = {
  name: "Dojo 1 — The Core Gate",
  music: "dojo_theme",
  interior: true,
  width: 16, height: 18,
  playerStart: { x:7, y:16 },
  tiles: (() => {
    const W=16, H=18;
    return buildMap(W, H, (x,y) => {
      if (x===0||x===W-1||y===0) return TILE.BUILDING;
      if ((x+y)%4===0) return TILE.PATH;
      if (y===7&&(x===3||x===7||x===11)) return TILE.HM_ROCK;
      if (y<=3&&x>=4&&x<=11) return TILE.WARP;
      if ((x===7||x===8)&&y===17) return TILE.DOOR;
      return TILE.CAVE;
    });
  })(),
  npcs: [
    { id:"dojo_acolyte_1", x:7, y:12, sprite:"🥋", name:"Acolyte Ken", dialog:["Master Lin does not shout. He builds. Watch how his creatures stand."], battle:{ team:[{id:"007",name:"Tyrage",hp:45,maxHp:45,atk:60,def:40,spd:35,moves:["Pound","Tackle"],type:"Earth",level:8}], reward:300, badge:null } },
    { id:"dojo_acolyte_2", x:4, y:8, sprite:"🥷", name:"Acolyte Ren", dialog:["Feel the power of the Core!"], battle:{ team:[{id:"004",name:"Razorgater",hp:50,maxHp:50,atk:65,def:64,spd:48,moves:["Metal Claw","Tackle"],type:"Steel",level:9}], reward:350, badge:null } },
    { id:"dojo_acolyte_3", x:11, y:8, sprite:"🤺", name:"Acolyte Shin", dialog:["Speed and precision. Can you handle it?"], battle:{ team:[{id:"001",name:"Mochii",hp:40,maxHp:40,atk:45,def:35,spd:50,moves:["Aqua Shot","Quick Attack"],type:"Water",level:10}], reward:400, badge:null } },
    { id:"dojo_acolyte_4", x:8, y:5, sprite:"💂", name:"Acolyte Ryu", dialog:["You must have an iron will to pass me!"], battle:{ team:[{id:"038",name:"Sproutle",hp:55,maxHp:55,atk:45,def:60,spd:30,moves:["Vine Lash","Tackle"],type:"Grass",level:11}], reward:450, badge:null } },
    { id:"master_lin", x:8, y:2, sprite:"🥋", name:"Master Lin", dialog:["A dojo is a machine. Every part has a place. Show me where you fit."], postBattleDialog:["You fit. Take the Core Fragment. It opens roads that only a steady trainer can open."], battle:{ team:[{id:"039",name:"Shellguard",hp:90,maxHp:90,atk:55,def:95,spd:25,moves:["Iron Defense","Tackle","Shell Smash","Rock Slide"],type:"Grass",level:14}], reward:1500, badge:"Core Fragment", hmReward:"Strength" }, isDojoBoss: true },
  ],
  signs: [],
  exits: [
    { x:7, y:17, to:"binary_fields", enterAt:{x:14, y:9}, dir:"down" },
    { x:8, y:17, to:"binary_fields", enterAt:{x:14, y:9}, dir:"down" }
  ],
  doors: [],
  events: [
    { id: "dojo_acolyte_1_event", x:6, y:13, dialog:["Acolyte Ken: Stop right there! You must prove yourself!"], npc: { name: "Acolyte Ken", sprite: "🥋" }, battle: { team:[{id:"007",name:"Tyrage",hp:45,maxHp:45,atk:60,def:40,spd:35,moves:["Pound","Tackle"],type:"Earth",level:8}], reward:300, badge:null } },
    { id: "dojo_acolyte_1_event", x:7, y:13, dialog:["Acolyte Ken: Stop right there! You must prove yourself!"], npc: { name: "Acolyte Ken", sprite: "🥋" }, battle: { team:[{id:"007",name:"Tyrage",hp:45,maxHp:45,atk:60,def:40,spd:35,moves:["Pound","Tackle"],type:"Earth",level:8}], reward:300, badge:null } },
    { id: "dojo_acolyte_1_event", x:8, y:13, dialog:["Acolyte Ken: Stop right there! You must prove yourself!"], npc: { name: "Acolyte Ken", sprite: "🥋" }, battle: { team:[{id:"007",name:"Tyrage",hp:45,maxHp:45,atk:60,def:40,spd:35,moves:["Pound","Tackle"],type:"Earth",level:8}], reward:300, badge:null } },
    { id: "dojo_acolyte_2_event", x:3, y:9, dialog:["Acolyte Ren: Feel the power of the Core!"], npc: { name: "Acolyte Ren", sprite: "🥷" }, battle: { team:[{id:"004",name:"Razorgater",hp:50,maxHp:50,atk:65,def:64,spd:48,moves:["Metal Claw","Tackle"],type:"Steel",level:9}], reward:350, badge:null } },
    { id: "dojo_acolyte_2_event", x:4, y:9, dialog:["Acolyte Ren: Feel the power of the Core!"], npc: { name: "Acolyte Ren", sprite: "🥷" }, battle: { team:[{id:"004",name:"Razorgater",hp:50,maxHp:50,atk:65,def:64,spd:48,moves:["Metal Claw","Tackle"],type:"Steel",level:9}], reward:350, badge:null } },
    { id: "dojo_acolyte_2_event", x:5, y:9, dialog:["Acolyte Ren: Feel the power of the Core!"], npc: { name: "Acolyte Ren", sprite: "🥷" }, battle: { team:[{id:"004",name:"Razorgater",hp:50,maxHp:50,atk:65,def:64,spd:48,moves:["Metal Claw","Tackle"],type:"Steel",level:9}], reward:350, badge:null } }
  ],
  encounters: []
};

// Additional Maps
export const BINARY_WOODS: any = {
  name: "Binary Woods",
  music: "woods_theme",
  weather: "mist",
  width: 32, height: 45,
  playerStart: { x:28, y:22 },
  tiles: (() => {
    const W=32, H=45;
    return buildMap(W, H, (x,y) => {
      if (x===0||x===W-1||y===0||y===H-1) return TILE.WALL;
      if (x>=12&&x<=14&&y>=0&&y<=15) return TILE.PATH;
      if (x>=8&&x<=14&&y===15) return TILE.PATH;
      if (x>=8&&x<=10&&y>=15&&y<=28) return TILE.PATH;
      if (x>=8&&x<=22&&y===28) return TILE.PATH;
      if (x>=20&&x<=22&&y>=8&&y<=28) return TILE.PATH;
      if (x>=20&&x<=28&&y===8) return TILE.PATH;
      
      if ((x>=2&&x<=7&&y>=2&&y<=14)||(x>=15&&x<=19&&y>=2&&y<=14)) return TILE.WALL;
      if ((x>=2&&x<=7&&y>=16&&y<=27)||(x>=11&&x<=19&&y>=16&&y<=27)) return TILE.WALL;
      if ((x>=23&&x<=29&&y>=2&&y<=7)||(x>=23&&x<=29&&y>=9&&y<=22)) return TILE.WALL;
      
      if (y>=2&&y<=14&&x>=12&&x<=14) return TILE.PATH; 
      if (x===11&&y>=2&&y<=14) return TILE.TALL_GRASS;
      if (x===15&&y>=2&&y<=14) return TILE.TALL_GRASS;
      if (x>=4&&x<=10&&y>=30&&y<=38) return TILE.BUILDING;
      if (x===7&&y===38) return TILE.DOOR;
      if (x>=26&&x<=28&&y>=38&&y<=42) return TILE.CAVE;
      if (x===27&&y===38) return TILE.DOOR;
      if (x===19&&y===22) return TILE.HM_CUT;
      if (x===8&&y===5) return TILE.HM_CUT;
      if (x>=13&&x<=18&&y>=30&&y<=36) return TILE.WATER;
      if (x>=14&&x<=18&&y>=16&&y<=20) return TILE.FLOWER;
      if (x>=26&&x<=30&&y>=20&&y<=24) return TILE.PATH;
      return TILE.GRASS;
    });
  })(),
  npcs: [
    { id:"hacker_grunt2", x:13, y:10, sprite:"🕶️", name:"Hacker Grunt", facing:"down", dialog:["The woods belong to the Liberation Front now!"], battle:{ team:[{id:"010",name:"Kittember",hp:36,maxHp:36,atk:55,def:28,spd:68,moves:["Shadow Sneak","Leer"],type:"Fire",level:12}], reward:350, badge:null } },
    { id:"trainer_bugcatcher_mira", x:9, y:20, sprite:"🐛", name:"Bug Catcher Mira", facing:"down", dialog:["The woods hum. Listen, and you will hear where the wild ones are."], battle:{ team:[{id:"016",name:"Squirmite",hp:30,maxHp:30,atk:35,def:30,spd:50,moves:["Tackle","Quick Attack"],type:"Bug",level:10},{id:"017",name:"Cocoonode",hp:50,maxHp:50,atk:20,def:55,spd:30,moves:["Tackle","Quick Attack"],type:"Bug",level:11}], reward:220, badge:null } },
    { id:"trainer_woodswalker_tess", x:21, y:15, sprite:"🌲", name:"Woods Walker Tess", facing:"down", dialog:["The woods are deep. Watch your step."], battle:{ team:[{id:"038",name:"Sproutle",hp:55,maxHp:55,atk:68,def:64,spd:31,moves:["Tackle","Quick Attack"],type:"Grass",level:11},{id:"041",name:"Pixilite",hp:40,maxHp:40,atk:30,def:30,spd:70,moves:["Tackle","Quick Attack"],type:"Grass",level:11}], reward:280, badge:null } },
  ],
  exits: [
    ...buildVertExits(31, 15, 25, "binary_fields", 1, "right"),
  ],
  doors: [
    { x:7, y:38, to:"dojo_2", enterAt:{x:5, y:14}, label:"Aero Dojo — Wind Wing" },
    { x:27, y:38, to:"cave_of_echoes", enterAt:{x:5, y:0}, label:"Cave of Echoes" }
  ],
  events: [
    { id: "hacker_grunt2_event", x:12, y:11, dialog:["Hacker Grunt: The woods belong to the Liberation Front now!"], npc: { name: "Hacker Grunt", sprite: "🕶️" }, battle: { team:[{id:"010",name:"Kittember",hp:36,maxHp:36,atk:55,def:28,spd:68,moves:["Scratch","Leer"],type:"Fire",level:12}], reward:350, badge:null } },
    { id: "hacker_grunt2_event", x:13, y:11, dialog:["Hacker Grunt: The woods belong to the Liberation Front now!"], npc: { name: "Hacker Grunt", sprite: "🕶️" }, battle: { team:[{id:"010",name:"Kittember",hp:36,maxHp:36,atk:55,def:28,spd:68,moves:["Scratch","Leer"],type:"Fire",level:12}], reward:350, badge:null } },
    { id: "hacker_grunt2_event", x:14, y:11, dialog:["Hacker Grunt: The woods belong to the Liberation Front now!"], npc: { name: "Hacker Grunt", sprite: "🕶️" }, battle: { team:[{id:"010",name:"Kittember",hp:36,maxHp:36,atk:55,def:28,spd:68,moves:["Scratch","Leer"],type:"Fire",level:12}], reward:350, badge:null } }
  ],
  encounters: [
    { mapZone:"tall_grass", rate:0.22, pool:[ {id:"010",name:"Kittember",hp:42,maxHp:42,atk:50,def:38,spd:55,moves:["Scratch"],type:"Fire",level:10} ]}
  ]
};

export const CAVE_OF_ECHOES: any = {
  name: "Cave of Echoes — B1F",
  music: "cave_theme",
  interior: true,
  width: 28, height: 30,
  playerStart: { x:5, y:1 },
  tiles: (() => {
    const W=28, H=30;
    return buildMap(W, H, (x,y) => {
      if (x===0||x===W-1||y===0||y===H-1) return TILE.BUILDING;
      if (x>=3&&x<=7&&y>=1&&y<=8) return TILE.CAVE;
      if (x>=3&&x<=20&&y===8) return TILE.CAVE;
      if (x>=18&&x<=20&&y>=8&&y<=20) return TILE.CAVE;
      if (x>=10&&x<=20&&y===20) return TILE.CAVE;
      if (x>=10&&x<=12&&y>=20&&y<=28) return TILE.CAVE;
      if (x>=8&&x<=14&&y>=12&&y<=16) return TILE.CAVE;
      if (x>=14&&x<=22&&y>=22&&y<=26) return TILE.WATER;
      if (x===15&&y===8) return TILE.HM_ROCK;
      if (x===10&&y===16) return TILE.HM_ROCK;
      if (x===11&&y===27) return TILE.STAIRS_DOWN;
      if (x===5&&y===2) return TILE.STAIRS_UP;
      return TILE.BUILDING;
    });
  })(),
  npcs: [
    { id:"miner_npc", x:12, y:13, sprite:"🧗", name:"Miner Cleff", movement:"wander", wanderRadius:1, dialog:["This cave runs DEEP."], battle:{ team:[{id:"007",name:"Tyrage",hp:45,maxHp:45,atk:60,def:40,spd:50,moves:["Tackle","Quick Attack"],type:"Earth",level:16}], reward:340, badge:null } },
    { id:"trainer_caverunner_pike", x:19, y:10, sprite:"🏃", name:"Cave Runner Pike", facing:"down", dialog:["I run these tunnels every day."], battle:{ team:[{id:"013",name:"Pupbble",hp:45,maxHp:45,atk:60,def:50,spd:50,moves:["Tackle","Quick Attack"],type:"Earth",level:16},{id:"036",name:"Cragarm",hp:65,maxHp:65,atk:105,def:130,spd:30,moves:["Tackle","Quick Attack"],type:"Steel",level:17}], reward:380, badge:null } },
  ],
  exits: [
    { x:5, y:0, to:"binary_woods", enterAt:{x:27, y:38}, dir:"up" },
    // Phase A: STAIRS_DOWN tile at (11,27) was a dead end — no exit.
    // It now leads to Neon City at its STAIRS_DOWN tile (18,35).
    { x:11, y:27, to:"neon_city", enterAt:{x:18, y:35}, dir:"down" }
  ],
  doors: [],
  events: [],
  encounters: [
    { mapZone:"cave", rate:0.25, pool:[ {id:"004",name:"Razorgater",hp:44,maxHp:44,atk:48,def:54,spd:38,moves:["Metal Sound","Tackle"],type:"Steel",level:15} ] }
  ]
};

export const NEON_CITY: any = {
  name: "Neon City",
  music: "neon_theme",
  weather: "neon_rain",
  width: 36, height: 38,
  playerStart: { x:18, y:35 },
  tiles: (() => {
    const W=36, H=38;
    return buildMap(W, H, (x,y) => {
      if (x===0||x===W-1||y===0||y===H-1) return TILE.BUILDING;
      if (y===10||y===20||y===30) return TILE.NEON_PATH;
      if (x===8||x===18||x===28) return TILE.NEON_PATH;
      if (x>=2&&x<=6&&y>=2&&y<=8) return TILE.BUILDING;
      if (x>=10&&x<=16&&y>=2&&y<=8) return TILE.BUILDING;
      if (x>=20&&x<=26&&y>=2&&y<=8) return TILE.BUILDING;
      if (x>=30&&x<=34&&y>=2&&y<=8) return TILE.BUILDING;
      if (x>=2&&x<=6&&y>=12&&y<=18) return TILE.BUILDING;
      if (x>=10&&x<=16&&y>=12&&y<=18) return TILE.BUILDING;
      if (x>=20&&x<=26&&y>=12&&y<=18) return TILE.BUILDING;
      if (x>=30&&x<=34&&y>=12&&y<=18) return TILE.BUILDING;
      if (x>=2&&x<=6&&y>=22&&y<=28) return TILE.BUILDING;
      if (x>=10&&x<=16&&y>=22&&y<=28) return TILE.BUILDING;
      if (x>=20&&x<=26&&y>=22&&y<=28) return TILE.BUILDING;
      if (x>=30&&x<=34&&y>=22&&y<=28) return TILE.BUILDING;
      
      if (x===4&&y===8) return TILE.DOOR; 
      if (x===13&&y===28) return TILE.DOOR;
      if (x===23&&y===28) return TILE.DOOR;
      if (x===33&&y===28) return TILE.DOOR;
      if (x===13&&y===18) return TILE.DOOR;
      if (x>=12&&x<=24&&y>=2&&y<=6) return TILE.WARP;
      if (x===18&&y===6) return TILE.DOOR;
      
      if ((x>=7&&x<=9&&y>=12&&y<=18)||(x>=27&&x<=29&&y>=12&&y<=18)) return TILE.TALL_GRASS;
      if (x===18&&y===35) return TILE.STAIRS_DOWN;
      
      return TILE.NEON_PATH;
    });
  })(),
  npcs: [
    { id:"neon_astrologer", x:14, y:30, sprite:"🔮", name:"Data Astrologer", facing:"down", movement:"wander", wanderRadius:1, dialog:["The stars are aligning in the Mainframe.", "I have sensed legendary beings, built from raw data, myth, and stars!"] },
    { id:"neon_shaman", x:24, y:20, sprite:"📿", name:"Cyber Shaman", facing:"left", movement:"wander", wanderRadius:1, dialog:["Mythar, the first legend... he slumbers deep in the digital cosmos.", "But numerology and myths say more celestial Mochiichao will awaken soon."] }
  ],
  exits: [
    ...buildVertExits(0, 15, 25, "scrap_junkyard", 32, "left"),
    ...buildVertExits(35, 15, 25, "coral_approach", 1, "right"),
    // Phase A return: WorldEngine checks exits before the solid-tile
    // return, so this border tile (18,37) fires even though it renders
    // as BUILDING. It returns to the Cave STAIRS_DOWN tile (11,27).
    { x:18, y:37, to:"cave_of_echoes", enterAt:{x:11, y:27}, dir:"down" }
  ],
  doors: [
    { x:18, y:6, to:"mauveville_arena", enterAt:{x:8, y:18}, label:"Mauveville Arena", condition:"ciphers>=10" }
  ],
  events: [],
  encounters: []
};

// Additional Maps 2
export const SCRAP_JUNKYARD: any = {
  name: "The Scrap Junkyard",
  music: "junkyard_theme",
  weather: "smog",
  width: 34, height: 36,
  playerStart: { x:30, y:18 },
  tiles: (() => {
    const W=34, H=36;
    return buildMap(W, H, (x,y) => {
      if (x===0||x===W-1||y===0||y===H-1) return TILE.WALL;
      if (y>=2&&y<=6&&x>=2&&x<=6) return TILE.WALL;
      if (y>=2&&y<=6&&x>=28&&x<=32) return TILE.WALL;
      if ((x+y)%6===0) return TILE.WALL;
      if (x===15||x===16) return TILE.INDUSTRIAL;
      if (y===18) return TILE.INDUSTRIAL;
      if (x>=8&&x<=12&&y>=8&&y<=14) return TILE.LAVA;
      if (x>=22&&x<=26&&y>=22&&y<=28) return TILE.LAVA;
      if (x===20&&y===10) return TILE.HM_ROCK;
      if (x===10&&y===24) return TILE.HM_ROCK;
      if (x===26&&y===15) return TILE.HM_ROCK;
      if (x>=6&&x<=12&&y>=28&&y<=34) return TILE.BUILDING;
      if (x===9&&y===34) return TILE.DOOR;
      if (y>=30&&y<=34&&x>=2&&x<=4) return TILE.HM_ROCK;
      if (x>=14&&x<=20&&y>=24&&y<=30) return TILE.LAVA;
      if (x>=22&&x<=30&&y>=6&&y<=10) return TILE.HM_CUT;
      if (x>=15&&x<=17&&y>=6&&y<=12) return TILE.PATH;
      return TILE.INDUSTRIAL;
    });
  })(),
  npcs: [
    { id:"junk_boss", x:16, y:9, sprite:"🏭", name:"Junk Warlord Krix", dialog:["Think you can survive the Junkyard?"], battle:{ team:[{id:"005",name:"Chromejaww",hp:75,maxHp:75,atk:72,def:80,spd:48,moves:["Metal Claw"],type:"Steel",level:24}], reward:750, badge:null } }
  ],
  exits: [
    ...buildVertExits(33, 15, 25, "neon_city", 1, "right")
  ],
  doors: [],
  events: [],
  encounters: [
    { mapZone:"tall_grass", rate:0.22, pool:[ {id:"005",name:"Chromejaww",hp:58,maxHp:58,atk:62,def:72,spd:40,moves:["Metal Sound"],type:"Steel",level:20} ]}
  ]
};

export const CORAL_APPROACH: any = {
  name: "Coral Reef Approach",
  music: "water_theme",
  weather: "clear",
  width: 30, height: 35,
  playerStart: { x:0, y:20 },
  tiles: (() => {
    const W=30, H=35;
    return buildMap(W, H, (x,y) => {
      if (x===29||y===0||y===34||x===0) return TILE.WALL;
      if (x>=2&&x<=10&&y>=2&&y<=12) return TILE.SAND;
      if (x>=1&&x<=10&&y>=13&&y<=32) return TILE.SAND;
      if (x>=8&&x<=14&&y>=18&&y<=28) return TILE.SHALLOW;
      if (x>=12&&x<=28&&y>=10&&y<=32) return TILE.WATER;
      if (x>=12&&x<=28&&y>=2&&y<=8) return TILE.WATER;
      if (y===20&&x<=10) return TILE.DOCK;
      if (x>=8&&x<=10&&y>=8&&y<=12) return TILE.TALL_GRASS;
      if (x>=6&&x<=8&&y>=26&&y<=30) return TILE.TALL_GRASS;
      if (y===20&&x===12) return TILE.HM_WATERFALL;
      if (x>=18&&x<=22&&y>=16&&y<=20) return TILE.SHALLOW;
      if (x===20&&y===18) return TILE.SAND;
      return TILE.SAND;
    });
  })(),
  npcs: [
    { id:"boat_captain", x:4, y:20, sprite:"⛵", name:"Capt. Neri", movement:"wander", wanderRadius:1, dialog:["My boat can take you to Castagnoli Island"] }
  ],
  exits: [
    ...buildVertExits(0, 15, 25, "neon_city", 34, "left"),
    ...buildEdgeExits(13, 17, 34, "castagnoli_island", 1, "down")
  ],
  doors: [],
  events: [],
  encounters: []
};

export const CASTAGNOLI_ISLAND: any = {
  name: "Castagnoli Island — Luigi's Reserve",
  music: "island_theme",
  weather: "jungle",
  width: 40, height: 45,
  playerStart: { x:20, y:2 },
  tiles: (() => {
    const W=40, H=45;
    return buildMap(W, H, (x,y) => {
      if (x===0||x===W-1||y===0||y===H-1) return TILE.WATER;
      if (x>=2&&x<=37&&y>=2&&y<=42) return TILE.SAND;
      if (x>=4&&x<=35&&y>=4&&y<=40) return TILE.GRASS;
      if (x>=6&&x<=33&&y>=6&&y<=38) return TILE.TALL_GRASS;
      if (x>=16&&x<=24&&y>=6&&y<=14) return TILE.BUILDING;
      if (x===20&&y===14) return TILE.DOOR;
      if (x>=18&&x<=22&&y>=15&&y<=42) return TILE.PATH;
      if (x===20&&y===42) return TILE.DOCK;
      
      if (x>=8&&x<=12&&y>=20&&y<=24) return TILE.WATER;
      if (x>=28&&x<=32&&y>=20&&y<=24) return TILE.WATER;
      if (x===10&&y===22) return TILE.HM_WATERFALL;
      if (x===30&&y===22) return TILE.HM_WATERFALL;
      
      if (x>=12&&x<=16&&y>=30&&y<=34) return TILE.FLOWER;
      if (x>=24&&x<=28&&y>=30&&y<=34) return TILE.FLOWER;
      
      return TILE.TALL_GRASS;
    });
  })(),
  npcs: [
    { id:"luigi_castagnoli", x:20, y:22, sprite:"🤵", name:"Luigi Castagnoli", dialog:["Ah, the famous trainer. I've heard SO much about you."], battle:{ team:[{id:"009",name:"Oblivirex",hp:110,maxHp:110,atk:90,def:70,spd:55,moves:["Crush"],type:"Water",level:48}], reward:5000, badge:"Island Key", isVillainBoss:true } }
  ],
  exits: [
    ...buildEdgeExits(13, 17, 0, "coral_approach", 33, "up")
  ],
  doors: [
    { x:20, y:14, to:"luigi_mansion", enterAt:{x:5, y:12}, label:"Luigi's Mansion" }
  ],
  events: [],
  encounters: []
};

export const MAUVEVILLE_ARENA: any = {
  name: "Mauveville Arena — The Gauntlet",
  music: "arena_theme",
  weather: "neon_rain",
  interior: true,
  width: 20, height: 28,
  playerStart: { x:9, y:26 },
  tiles: (() => {
    return buildMap(20, 28, (x,y) => {
      if (x===0||x===19) return TILE.BUILDING;
      if (y===0||y===27) return TILE.BUILDING;
      if (x>=3&&x<=16&&y>=4&&y<=20) return TILE.WARP;
      if (x>=8&&x<=11&&y>=20&&y<=27) return TILE.NEON_PATH;
      return TILE.NEON_PATH;
    });
  })(),
  npcs: [
    { id:"champion_mythar", x:9, y:4, sprite:"✨", name:"Champion — MYTHAR", dialog:["I am Mythar. The end of all challengers."], battle:{ team:[{id:"003",name:"AquariiOS",hp:120,maxHp:120,atk:130,def:100,spd:110,moves:["Mythic Pulse"],type:"Water",level:65}], reward:10000, badge:"Champion", isChampion:true } }
  ],
  exits: [
    { x:9, y:27, to:"neon_city", enterAt:{x:18, y:6}, dir:"down" }
  ],
  doors: [],
  events: [],
  encounters: []
};

export const BOOT_BAY: any = {
  name: "Boot Bay",
  music: "water_theme",
  weather: "clear",
  width: 32, height: 20,
  playerStart: { x:15, y:1 },
  tiles: (() => {
    return buildMap(32, 20, (x, y) => {
      if (x===0||x===31||y===19) return TILE.WALL;
      return TILE.WATER;
    });
  })(),
  npcs: [], exits: [{ x:15, y:0, to:"sector0", enterAt:{x:15, y:27}, dir:"up" }], doors: [], events: [], encounters: []
};

export const LUIGI_MANSION: any = {
  name: "Luigi's Mansion",
  music: "dojo_theme",
  interior: true,
  width: 11, height: 14,
  playerStart: { x:5, y:12 },
  tiles: (() => {
    return buildMap(11, 14, (x,y) => {
      if (x===0||x===10||y===0||y===13) return TILE.BUILDING;
      if (x===5&&y===13) return TILE.DOOR;
      return TILE.PATH;
    });
  })(),
  npcs: [
    { id:"luigi_indoor", x:5, y:4, sprite:"🤵", name:"Luigi", dialog:["This is my sanctuary!"], battle:{ team:[{id:"009",name:"Oblivirex",hp:110,maxHp:110,atk:90,def:70,spd:55,moves:["Crush"],type:"Water",level:48}], reward:5000, badge:"Island Key", isVillainBoss:true } }
  ],
  exits: [{ x:5, y:13, to:"castagnoli_island", enterAt:{x:20, y:14}, dir:"down" }], doors: [], events: [], encounters: []
};

export const DOJO_2: any = {
  name: "Aero Dojo — Wind Wing",
  music: "dojo_theme",
  interior: true,
  width: 11, height: 16,
  playerStart: { x:5, y:14 },
  tiles: (() => {
    return buildMap(11, 16, (x,y) => {
      if (x===0||x===10||y===0||y===15) return TILE.BUILDING;
      if (x===5&&y===15) return TILE.DOOR;
      return TILE.PATH;
    });
  })(),
  npcs: [
    { id:"master_falk", x:5, y:2, sprite:"🥋", name:"Master Falk", dialog:["Hey, hey, welcome up here. I'm Master Falk, and I'm high as a kite today, so you better keep up.","You made it to my Dojo? Good. I live free like a bird up here, no cage, no chain, just wind.","The winds favor the swift! So show me you're swift, or get blown right back down."], postBattleDialog:["Ha! Okay, okay, you clipped my wings. I'm high as a kite, but you flew higher.","Free like a bird, and today that bird is you. Take the wind with you.","Here's your Wind Fragment. Hold it tight, or the wind will take it.","Next Dojo's down the road, not up in the clouds. Don't get too comfortable on the ground, though. Stay free, stay fast."], battle:{ team:[{id:"019",name:"Zephling",hp:40,maxHp:40,atk:55,def:35,spd:60,moves:["Tackle","Quick Attack"],type:"Aero",level:18},{id:"020",name:"Aerobeak",hp:60,maxHp:60,atk:75,def:55,spd:80,moves:["Tackle","Quick Attack"],type:"Aero",level:19},{id:"021",name:"Stormtalon",hp:80,maxHp:80,atk:105,def:75,spd:110,moves:["Tackle","Quick Attack"],type:"Aero",level:20}], reward:1500, badge:"Wind Fragment", hmReward:"Cut" }, isDojoBoss: true },
    { id:"dojo_acolyte_gale", x:3, y:6, sprite:"🥋", name:"Acolyte Gale", facing:"down", dialog:["The wind tests everyone who climbs."], battle:{ team:[{id:"019",name:"Zephling",hp:40,maxHp:40,atk:55,def:35,spd:60,moves:["Tackle","Quick Attack"],type:"Aero",level:17}], reward:500, badge:null } },
    { id:"dojo_acolyte_skye", x:7, y:6, sprite:"🥋", name:"Acolyte Skye", facing:"down", dialog:["Master Falk's wind shows no mercy."], battle:{ team:[{id:"019",name:"Zephling",hp:40,maxHp:40,atk:55,def:35,spd:60,moves:["Tackle","Quick Attack"],type:"Aero",level:18},{id:"020",name:"Aerobeak",hp:60,maxHp:60,atk:75,def:55,spd:80,moves:["Tackle","Quick Attack"],type:"Aero",level:18}], reward:600, badge:null } },
  ],
  exits: [{ x:5, y:15, to:"binary_woods", enterAt:{x:7, y:37}, dir:"down" }], doors: [], events: [], encounters: []
};


export const SECTOR0_TRUCK: any = {
  name: "Moving Truck — Sector 0",
  music: "sector0_theme",
  weather: "clear",
  interior: true,
  width: 12, height: 10,
  playerStart: { x:6, y:8 },
  tiles: (() => {
    return buildMap(12, 10, (x, y) => {
      if (x===6&&y===9) return TILE.DOOR;
      if (x===0||x===11||y===0||y===9) return TILE.WALL;
      if (y>=1&&y<=3) return TILE.BUILDING; // stacked boxes
      return TILE.PATH;
    });
  })(),
  npcs: [
    { id:"mover_1", x:3, y:5, sprite:"📦", name:"Mover", facing:"down", dialog:["Careful with that one — it is the clock. A new home needs a correct time."] },
    { id:"mover_2", x:8, y:5, sprite:"📦", name:"Mover", facing:"down", dialog:["Last box out, then we are done. Your room is upstairs."] },
  ],
  signs: [
    { x:6, y:2, text:"MOVING BOXES\\nMom's things, your things, and one very important clock." },
  ],
  exits: [],
  doors: [
    { x:6, y:9, to:"sector0", enterAt:{x:15, y:10}, label:"Step off the truck" }
  ],
  events: [],
  encounters: []
};

export const SECTOR0_HOUSE_1F: any = {
  name: "Your House — 1F",
  music: "sector0_theme",
  weather: "clear",
  interior: true,
  width: 13, height: 12,
  playerStart: { x:6, y:10 },
  tiles: (() => {
    return buildMap(13, 12, (x, y) => {
      if (x===6&&y===11) return TILE.DOOR;
      if (x===6&&y===1) return TILE.STAIRS_UP;
      if (x===6&&y===2) return TILE.PATH; // stair approach, else the stair is unreachable
      if (x===0||x===12||y===0||y===11) return TILE.WALL;
      if (y>=1&&y<=2) return TILE.BUILDING; // kitchen counter / table
      return TILE.PATH;
    });
  })(),
  npcs: [
    { id:"mom_house", x:5, y:8, sprite:"👩", name:"Your Mom", facing:"down", isHeal: true, dialog:["There you are! The truck beat us here.","Come inside. Your room is upstairs. The boxes can wait. Go set the clock first — a new home needs a correct time.","Good. Now go say hello next door. Hex's family just moved in too. You two will need each other out there.","Wait. Before you run off — here. Sprint Boots. Hold B and you can run. A trainer who cannot run will always be late."] },
  ],
  signs: [
    { x:10, y:2, text:"KITCHEN\\nMom's cooking smells like a new start." },
  ],
  exits: [
    { x:6, y:1, to:"sector0_house_2f", enterAt:{x:6, y:10}, dir:"up" }
  ],
  doors: [
    { x:6, y:11, to:"sector0", enterAt:{x:6, y:9}, label:"Boot Harbor" }
  ],
  events: [],
  encounters: []
};

export const SECTOR0_HOUSE_2F: any = {
  name: "Your House — 2F",
  music: "sector0_theme",
  weather: "clear",
  interior: true,
  width: 13, height: 12,
  playerStart: { x:6, y:10 },
  tiles: (() => {
    return buildMap(13, 12, (x, y) => {
      if (x===6&&y===11) return TILE.STAIRS_DOWN;
      if (x===0||x===12||y===0||y===11) return TILE.WALL;
      if (x>=2&&x<=4&&y>=2&&y<=3) return TILE.BUILDING; // PC desk
      if (x>=8&&x<=10&&y>=2&&y<=3) return TILE.BUILDING; // bed
      return TILE.PATH;
    });
  })(),
  npcs: [],
  signs: [
    { x:3, y:2, text:"PC\\nYour PC. Items and Mochiichao storage live here." },
    { x:6, y:5, text:"CLOCK\\nSet the clock. A new home needs a correct time." },
    { x:9, y:2, text:"POSTER\\nA poster of a legendary Mochiichao. One day." },
  ],
  exits: [
    { x:6, y:11, to:"sector0_house_1f", enterAt:{x:6, y:2}, dir:"down" }
  ],
  doors: [],
  events: [],
  encounters: []
};

export const SECTOR0_RIVAL_HOUSE: any = {
  name: "Hex's House",
  music: "sector0_theme",
  weather: "clear",
  interior: true,
  width: 13, height: 12,
  playerStart: { x:6, y:10 },
  tiles: (() => {
    return buildMap(13, 12, (x, y) => {
      if (x===6&&y===11) return TILE.DOOR;
      if (x===0||x===12||y===0||y===11) return TILE.WALL;
      if (y>=1&&y<=2) return TILE.BUILDING;
      return TILE.PATH;
    });
  })(),
  npcs: [
    { id:"hex_mom", x:5, y:8, sprite:"👩", name:"Hex's Mom", facing:"down", dialog:["Hex just moved in too. You two will need each other out there.","Go say hello — he is already talking about his starter."] },
    { id:"rival_hex_home", x:8, y:5, sprite:"😤", name:"Hex", facing:"down", dialog:["You again? I already picked my starter. Razorgater, obviously.","Don't think I'll go easy on you just because we grew up here.","Next time we meet, we BATTLE. Count on it."] },
  ],
  signs: [],
  exits: [],
  doors: [
    { x:6, y:11, to:"sector0", enterAt:{x:26, y:9}, label:"Boot Harbor" }
  ],
  events: [],
  encounters: []
};

export const FULL_WORLD: Record<string, any> = {
  aeon_lab: AEON_LAB,
  sector0: SECTOR_0,
  route_1: ROUTE_1,
  mochiiplex_1: MOCHIIPLEX_1,
  binary_fields: BINARY_FIELDS,
  dojo_1: DOJO_1,
  binary_woods: BINARY_WOODS,
  cave_of_echoes: CAVE_OF_ECHOES,
  neon_city: NEON_CITY,
  scrap_junkyard: SCRAP_JUNKYARD,
  coral_approach: CORAL_APPROACH,
  castagnoli_island: CASTAGNOLI_ISLAND,
  mauveville_arena: MAUVEVILLE_ARENA,
  boot_bay: BOOT_BAY,
  luigi_mansion: LUIGI_MANSION,
  dojo_2: DOJO_2,
  sector0_truck: SECTOR0_TRUCK,
  sector0_house_1f: SECTOR0_HOUSE_1F,
  sector0_house_2f: SECTOR0_HOUSE_2F,
  sector0_rival_house: SECTOR0_RIVAL_HOUSE
};
