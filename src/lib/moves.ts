import { Move } from "./types";

export const MOVES_DB: Record<string, Move> = {
  // ── WATER ─────────────────────────────────────────────────
  AQUA_SHOT:      { name:"Aqua Shot",       type:"WATER",    cat:"Special",  bp:40,  acc:100, pp:25, pri:0, effect:"NONE",        effectChance:0,   anim:"AQUA_SHOT",      desc:"A small ball of water hurled at the foe." },
  AQUA_CANNON:    { name:"Aqua Cannon",     type:"WATER",    cat:"Special",  bp:90,  acc:100, pp:15, pri:0, effect:"NONE",        effectChance:0,   anim:"AQUA_CANNON",    desc:"A powerful pressurized water blast." },
  HYDRO_SURGE:    { name:"Hydro Surge",     type:"WATER",    cat:"Special",  bp:120, acc:80,  pp:5,  pri:0, effect:"NONE",        effectChance:0,   anim:"HYDRO_SURGE",    desc:"An immense rush of water. Powerful but inaccurate." },
  AQUA_JET:       { name:"Aqua Jet",        type:"WATER",    cat:"Physical", bp:40,  acc:100, pp:20, pri:1, effect:"NONE",        effectChance:0,   anim:"AQUA_SHOT",      desc:"Moves first with a coating of water." },
  // ── FIRE ──────────────────────────────────────────────────
  EMBER_TOSS:     { name:"Ember Toss",      type:"FIRE",     cat:"Special",  bp:40,  acc:100, pp:25, pri:0, effect:"BURN",        effectChance:10,  anim:"EMBER_TOSS",     desc:"A weak fire attack. May cause burn." },
  FIRE_STREAM:    { name:"Fire Stream",     type:"FIRE",     cat:"Special",  bp:90,  acc:100, pp:15, pri:0, effect:"BURN",        effectChance:10,  anim:"FIRE_STREAM",    desc:"A sustained jet of fire. May burn." },
  INFERNO_WAVE:   { name:"Inferno Wave",    type:"FIRE",     cat:"Special",  bp:110, acc:85,  pp:10, pri:0, effect:"BURN",        effectChance:30,  anim:"INFERNO_WAVE",   desc:"Engulfs the target in a roaring inferno." },
  FIRE_PUNCH_MOVE:{ name:"Fire Punch",      type:"FIRE",     cat:"Physical", bp:75,  acc:100, pp:15, pri:0, effect:"BURN",        effectChance:10,  anim:"FIRE_PUNCH_MOVE",desc:"A fiery punch. May burn." },
  // ── GRASS ─────────────────────────────────────────────────
  PETAL_BARRAGE:  { name:"Petal Barrage",   type:"GRASS",    cat:"Special",  bp:80,  acc:100, pp:15, pri:0, effect:"NONE",        effectChance:0,   anim:"PETAL_BARRAGE",  desc:"Pelts the foe with a shower of petals." },
  SOLAR_BLAST:    { name:"Solar Blast",     type:"GRASS",    cat:"Special",  bp:120, acc:100, pp:10, pri:0, effect:"CHARGE_TURN", effectChance:100, anim:"SOLAR_BLAST",    desc:"Charges solar energy then fires a beam." },
  RAZOR_LEAF:     { name:"Razor Leaf",      type:"GRASS",    cat:"Physical", bp:55,  acc:95,  pp:25, pri:0, effect:"HIGH_CRIT",   effectChance:0,   anim:"PETAL_BARRAGE",  desc:"Launches sharp leaves. High critical-hit rate." },
  VINE_LASH:      { name:"Vine Lash",       type:"GRASS",    cat:"Physical", bp:45,  acc:100, pp:25, pri:0, effect:"NONE",        effectChance:0,   anim:"VINE_LASH",      desc:"Lashes the foe with long vines." },
  // ── ELECTRIC ──────────────────────────────────────────────
  SPARK_SHOT:     { name:"Spark Shot",      type:"ELECTRIC", cat:"Special",  bp:40,  acc:100, pp:25, pri:0, effect:"PARALYSIS",   effectChance:10,  anim:"SPARK_SHOT",     desc:"A small electric jolt. May paralyze." },
  THUNDER_BOLT:   { name:"Thunderbolt",     type:"ELECTRIC", cat:"Special",  bp:90,  acc:100, pp:15, pri:0, effect:"PARALYSIS",   effectChance:10,  anim:"THUNDER_BOLT",   desc:"A strong electric bolt. May paralyze." },
  WILD_CHARGE:    { name:"Wild Charge",     type:"ELECTRIC", cat:"Physical", bp:90,  acc:100, pp:15, pri:0, effect:"RECOIL_25",   effectChance:100, anim:"THUNDER_BOLT",   desc:"Charges with electric energy. Deals recoil." },
  // ── STEEL ─────────────────────────────────────────────────
  METAL_STRIKE:   { name:"Metal Strike",    type:"STEEL",    cat:"Physical", bp:50,  acc:100, pp:35, pri:0, effect:"NONE",        effectChance:0,   anim:"METAL_STRIKE",   desc:"A basic steel attack." },
  IRON_BARRAGE:   { name:"Iron Barrage",    type:"STEEL",    cat:"Physical", bp:35,  acc:100, pp:15, pri:0, effect:"MULTI_HIT",   effectChance:0,   anim:"IRON_BARRAGE",   desc:"Fires 2–5 iron shards." }, // changed to bp 35 standard
  FLASH_CANNON_MOVE:{ name:"Flash Cannon",  type:"STEEL",    cat:"Special",  bp:80,  acc:100, pp:10, pri:0, effect:"SPDEF_DOWN1", effectChance:10,  anim:"FLASH_CANNON_MOVE",desc:"Fires a flash of steel light. May lower Sp.Def." },
  // ── GROUND ────────────────────────────────────────────────
  EARTH_TREMOR:   { name:"Earth Tremor",    type:"GROUND",   cat:"Physical", bp:100, acc:100, pp:10, pri:0, effect:"NONE",        effectChance:0,   anim:"EARTH_TREMOR",   desc:"Shakes the ground to hit all adjacent foes." },
  MUD_BLAST:      { name:"Mud Blast",       type:"GROUND",   cat:"Physical", bp:55,  acc:95,  pp:15, pri:0, effect:"ACC_DOWN1",   effectChance:30,  anim:"MUD_BLAST",      desc:"Hurls mud at foe. May lower accuracy." },
  EARTH_POWER:    { name:"Earth Power",     type:"GROUND",   cat:"Special",  bp:90,  acc:100, pp:10, pri:0, effect:"SPDEF_DOWN1", effectChance:10,  anim:"EARTH_TREMOR",   desc:"Energy bursts from the earth. May lower Sp.Def." },
  BULLDOZE:       { name:"Bulldoze",        type:"GROUND",   cat:"Physical", bp:60,  acc:100, pp:20, pri:0, effect:"SPE_DOWN1",   effectChance:100, anim:"EARTH_TREMOR",   desc:"Stomps on the ground to lower foe's Speed." },
  // ── GHOST / DARK ──────────────────────────────────────────
  SHADOW_PULSE:   { name:"Shadow Pulse",    type:"GHOST",    cat:"Special",  bp:80,  acc:100, pp:15, pri:0, effect:"FLINCH",      effectChance:20,  anim:"SHADOW_PULSE",   desc:"Shadow ball that may cause flinch." },
  DARK_PULSE_MOVE:{ name:"Dark Pulse",      type:"DARK",     cat:"Special",  bp:80,  acc:100, pp:15, pri:0, effect:"FLINCH",      effectChance:20,  anim:"DARK_PULSE_MOVE",desc:"Pulse of dark energy. May flinch." },
  NIGHT_SLASH_MOVE:{ name:"Night Slash",    type:"DARK",     cat:"Physical", bp:70,  acc:100, pp:15, pri:0, effect:"HIGH_CRIT",   effectChance:0,   anim:"NIGHT_SLASH_MOVE",desc:"Slashes in darkness. High critical-hit ratio." },
  CRUNCH:         { name:"Crunch",          type:"DARK",     cat:"Physical", bp:80,  acc:100, pp:15, pri:0, effect:"DEF_DOWN1",   effectChance:20,  anim:"SHADOW_CLAW_MOVE",desc:"Crunches with fangs." },
  // ── FLYING ────────────────────────────────────────────────
  GUST_WAVE:      { name:"Gust Wave",       type:"FLYING",   cat:"Special",  bp:40,  acc:100, pp:35, pri:0, effect:"NONE",        effectChance:0,   anim:"GUST_WAVE",      desc:"Whips up gusts of wind with wings." },
  WING_ASSAULT:   { name:"Wing Assault",    type:"FLYING",   cat:"Physical", bp:85,  acc:100, pp:10, pri:0, effect:"NONE",        effectChance:0,   anim:"WING_ASSAULT",   desc:"Strikes foe hard with wings." },
  // ── NORMAL ────────────────────────────────────────────────
  TACKLE:         { name:"Tackle",          type:"NORMAL",   cat:"Physical", bp:40,  acc:100, pp:35, pri:0, effect:"NONE",        effectChance:0,   anim:"BODY_SLAM_MOVE", desc:"A physical charge." },
  QUICK_ATTACK:   { name:"Quick Attack",    type:"NORMAL",   cat:"Physical", bp:40,  acc:100, pp:30, pri:1, effect:"NONE",        effectChance:0,   anim:"MACH_STRIKE",    desc:"Extremely speedy blow. Always goes first." },
  BODY_SLAM_MOVE: { name:"Body Slam",       type:"NORMAL",   cat:"Physical", bp:85,  acc:100, pp:15, pri:0, effect:"PARALYSIS",   effectChance:30,  anim:"BODY_SLAM_MOVE", desc:"Slams foe with full body. May paralyze." },
  // ── PSYCHIC ───────────────────────────────────────────────
  MIND_BLAST:     { name:"Mind Blast",      type:"PSYCHIC",  cat:"Special",  bp:90,  acc:100, pp:10, pri:0, effect:"SPDEF_DOWN1", effectChance:10,  anim:"MIND_BLAST",     desc:"Mental blast. May lower Sp.Def." },
  // ── DRAGON ────────────────────────────────────────────────
  DRAGON_CLAW:    { name:"Dragon Claw",     type:"DRAGON",   cat:"Physical", bp:80,  acc:100, pp:15, pri:0, effect:"NONE",        effectChance:0,   anim:"SHADOW_CLAW_MOVE",desc:"Rakes foe with sharp claws." },
  // ── FIGHTING ──────────────────────────────────────────────
  POWER_STRIKE:   { name:"Power Strike",    type:"FIGHTING", cat:"Physical", bp:85,  acc:100, pp:15, pri:0, effect:"NONE",        effectChance:0,   anim:"POWER_STRIKE",   desc:"A mighty strike packed with fighting spirit." },
  // ── BUG ───────────────────────────────────────────────────
  SWARM_STRIKE:   { name:"Swarm Strike",    type:"BUG",      cat:"Physical", bp:25,  acc:95,  pp:10, pri:0, effect:"MULTI_HIT",   effectChance:100, anim:"SWARM_STRIKE",   desc:"Swarm attacks 2–5 times in a row." },
  // ── POISON ────────────────────────────────────────────────
  POISON_JAB:     { name:"Poison Jab",      type:"POISON",   cat:"Physical", bp:80,  acc:100, pp:20, pri:0, effect:"POISON",      effectChance:20,  anim:"VENOM_STRIKE",   desc:"Stabs with poison appendage. May poison." }
  // ── MYTHIC ────────────────────────────────────────────────
  ORIGIN_VERDICT: { name:"Origin Verdict",  type:"MYTHIC",   cat:"Special",  bp:100, acc:100, pp:10, pri:0, effect:"FORM_TYPE",   effectChance:0,   anim:"ORIGIN_VERDICT", desc:"Countless shots of prism light. Its light follows the form Mythar stands in." },
};
