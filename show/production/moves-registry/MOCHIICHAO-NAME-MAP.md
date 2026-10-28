# Mochiichao Name Map — the complete machine-registry mapping

**Status:** Complete for all 352 registry rows (2026-10-27, full rename pass).
Names marked **owner-locked** are the owner's own picks or confirmed calls. All other
names were assigned under the owner's standing delegation (2026-10-27: after naming
~35 moves himself, he delegated renaming ALL remaining moves, in his demonstrated
style, with the instruction to study his picks and follow the pattern). Delegated
names are standing canon under that delegation; any single one can be swapped by
the owner with one word. Internal ids/keys never change — display names only.

This map supersedes `RENAME-WORKSHEET-BATCH-1.md` (see its header). The registry
itself is `machine-registry.json` in this folder; this document is its readable form.

## The style, read from the owner's own picks

Verified against his corpus — Hydro Rush, Leaf Blast, Dark Wave, Water Orb, Tremor,
Aqua Blast, Water Jet, Wave, Foam Burst, Tail Flick, Chrome Claw, Stare Down, Claw,
Vine Lash, Punch, Web Blast, Night Stealth, Small Flame, Mosquito Bite, Chrome
Screech, Chrome Guard, Shell Burst, Draco Tail, Frost Blast, Scoop Slam, Ascend,
Mighty Push, Slice, Rockfall, Rumble, Swift Movement, Wind Blast, Munch, Fire Stream:

1. **Near-synonym, meaning preserved.** A player who knows the source move recognises
   ours instantly. The swap is word-for-word where the name allows it (both words
   swapped when both have cooler twins: Fire Punch pattern, Metal Claw -> Chrome Claw).
2. **One to two words, punchy.** No three-word names in his corpus; none were coined here.
3. **House flavour words.** Chrome for steel/metal (Chrome Claw/Screech/Guard), Frost
   for ice, Aqua/Hydro for water, Draco for dragon, Terra for earth, Umbral/Shade for
   dark and ghost, Volt for electric, Flame/Pyro for fire, Leaf for grass.
4. **Energy suffixes.** Blast, Burst, Wave, Jet, Rush — the hit should sound like it lands.
5. **Occasionally playful-literal.** Mosquito Bite, Scoop Slam, Small Flame — when the
   literal description is funnier and clearer than a synonym, it wins.
6. **Never an existing Pokemon move name.** The owner rejected Intimidate and Avalanche
   on exactly this ground. Every name in this pass was machine-checked against a
   928-name blocklist of Pokemon moves (gen5plus table + Black 2 / Crystal / Diamond
   decomp tables + this registry's own source names): **zero collisions**. Six first
   drafts that collided (Grudge, Head Charge, Hyper Fang, Psyblade-spacing, Psywave-
   spacing, Wave Crash) were caught by the check and replaced.
7. **No duplicates.** All 352 names are unique, and none collides with a name belonging
   to a different move in the live table or the GameData island doc (machine-checked).

## Rare Moves (11) — the scarce class

Owner's Rare picks set the weight: Wave, Ascend, Mighty Push, Slice — plain, strong,
field-capable words. The six delegated Rare names follow that register exactly.

| Source Name | Mochiichao Name | Basis |
|---|---|---|
| Cut | **Slice** | Owner-locked |
| Defog | **Mist Clear** | Delegated |
| Dive | **Deep Dive** | Delegated |
| Flash | **Illuminate** | Owner-locked (canon naming law: the Flash-equivalent technique is Illuminate) |
| Fly | **Ascend** | Owner-locked |
| Rock Climb | **Crag Climb** | Delegated |
| Rock Smash | **Boulder Break** | Delegated |
| Strength | **Mighty Push** | Owner-locked |
| Surf | **Wave** | Owner-locked |
| Waterfall | **Cascade** | Delegated |
| Whirlpool | **Vortex** | Delegated |

## General Moves (341)

### Bug

| Source Name | Mochiichao Name | Basis |
|---|---|---|
| Bug Bite | **Mosquito Bite** | Owner-locked |
| Bug Buzz | **Cicada Drone** | Delegated |
| First Impression | **Ambush** | Delegated |
| Fury Cutter | **Wrath Cutter** | Delegated |
| Infestation | **Swarm Trap** | Delegated |
| Leech Life | **Siphon Bite** | Delegated |
| Lunge | **Leap Strike** | Delegated |
| Megahorn | **Titan Horn** | Delegated |
| Pin Missile | **Needle Volley** | Delegated |
| Pollen Puff | **Pollen Cloud** | Delegated |
| Pounce | **Prey Pounce** | Delegated |
| Silver Wind | **Scale Wind** | Delegated |
| Skitter Smack | **Scuttle Smack** | Delegated |
| Struggle Bug | **Squirm Bug** | Delegated |
| U Turn | **Swift Turn** | Delegated |
| X Scissor | **X Shears** | Delegated |

### Dark

| Source Name | Mochiichao Name | Basis |
|---|---|---|
| Assurance | **Sure Blow** | Delegated |
| Beat Up | **Gang Up** | Delegated |
| Brutal Swing | **Savage Swing** | Delegated |
| Crunch | **Munch** | Owner-locked — maps to our playable set |
| Dark Pulse | **Umbral Pulse** | Delegated — maps to our playable set |
| Embargo | **Blockade** | Delegated |
| Fake Tears | **Crocodile Tears** | Delegated |
| Fling | **Hurl** | Delegated |
| Foul Play | **Cheap Shot** | Delegated |
| Hone Claws | **Talon Hone** | Delegated |
| Knock Off | **Bat Away** | Delegated |
| Lash Out | **Rage Lash** | Delegated |
| Nasty Plot | **Evil Scheme** | Delegated |
| Night Slash | **Dusk Rend** | Delegated — maps to our playable set |
| Payback | **Get Even** | Delegated |
| Quash | **Suppress** | Delegated |
| Snarl | **Feral Bark** | Delegated |
| Snatch | **Pilfer** | Delegated |
| Taunt | **Provoke** | Delegated |
| Thief | **Steal** | Delegated |
| Throat Chop | **Throat Strike** | Delegated |
| Torment | **Vex** | Delegated |

### Dragon

| Source Name | Mochiichao Name | Basis |
|---|---|---|
| Breaking Swipe | **Shatter Swipe** | Delegated |
| Draco Meteor | **Draco Barrage** | Delegated |
| Dragon Breath | **Draco Breath** | Delegated |
| Dragon Cheer | **Draco Rally** | Delegated |
| Dragon Claw | **Draconian Talon** | Owner-locked — maps to our playable set |
| Dragon Dance | **Draco Dance** | Delegated |
| Dragon Pulse | **Draco Pulse** | Delegated |
| Dragon Rage | **Draco Rage** | Delegated |
| Dragon Tail | **Draco Tail** | Owner-locked |
| Dual Chop | **Twin Chop** | Delegated |
| Outrage | **Rampage** | Delegated |
| Scale Shot | **Scale Volley** | Delegated |

### Electric

| Source Name | Mochiichao Name | Basis |
|---|---|---|
| Charge | **Amp Up** | Delegated |
| Charge Beam | **Volt Beam** | Delegated |
| Discharge | **Volt Burst** | Delegated |
| Eerie Impulse | **Weird Pulse** | Delegated |
| Electric Terrain | **Volt Terrain** | Delegated |
| Electro Ball | **Volt Orb** | Delegated |
| Electroweb | **Volt Web** | Delegated |
| Shock Wave | **Jolt Wave** | Delegated |
| Supercell Slam | **Superstorm Slam** | Delegated |
| Thunder | **Thunderstrike** | Delegated |
| Thunder Fang | **Volt Fang** | Delegated |
| Thunder Punch | **Volt Fist** | Delegated |
| Thunder Wave | **Static Wave** | Delegated |
| Thunderbolt | **Storm Bolt** | Delegated — maps to our playable set |
| Volt Switch | **Volt Swap** | Delegated |
| Wild Charge | **Reckless Charge** | Delegated — maps to our playable set |
| Zap Cannon | **Volt Cannon** | Delegated |

### Fairy

| Source Name | Mochiichao Name | Basis |
|---|---|---|
| Alluring Voice | **Siren Song** | Delegated |
| Charm | **Cute Pose** | Delegated |
| Dazzling Gleam | **Glitter Gleam** | Delegated |
| Disarming Voice | **Gentle Voice** | Delegated |
| Draining Kiss | **Drain Kiss** | Delegated |
| Misty Explosion | **Fog Burst** | Delegated |
| Misty Terrain | **Mist Terrain** | Delegated |
| Play Rough | **Roughhouse** | Delegated |

### Fighting

| Source Name | Mochiichao Name | Basis |
|---|---|---|
| Aura Sphere | **Aura Orb** | Delegated |
| Body Press | **Bulk Press** | Delegated |
| Brick Break | **Brick Smash** | Delegated |
| Bulk Up | **Pump Up** | Delegated |
| Circle Throw | **Ring Throw** | Delegated |
| Close Combat | **Close Brawl** | Delegated |
| Coaching | **Pep Talk** | Delegated |
| Counter | **Riposte** | Delegated |
| Detect | **Foresee** | Delegated |
| Drain Punch | **Drain Fist** | Delegated |
| Dynamic Punch | **Haymaker** | Delegated |
| Focus Blast | **Focus Burst** | Delegated |
| Focus Punch | **Windup Punch** | Delegated |
| Low Kick | **Trip Kick** | Delegated |
| Low Sweep | **Leg Sweep** | Delegated |
| Power Up Punch | **Power Punch** | Delegated |
| Revenge | **Vendetta** | Delegated |
| Reversal | **Last Stand** | Delegated |
| Seismic Toss | **Quake Toss** | Delegated |
| Storm Throw | **Tempest Throw** | Delegated |
| Submission | **Grapple** | Delegated |
| Superpower | **Brute Force** | Delegated |
| Upper Hand | **Preempt** | Delegated |
| Vacuum Wave | **Void Wave** | Delegated |

### Fire

| Source Name | Mochiichao Name | Basis |
|---|---|---|
| Blast Burn | **Pyro Burst** | Delegated |
| Blaze Kick | **Flame Kick** | Delegated |
| Burning Jealousy | **Burning Envy** | Delegated |
| Fire Blast | **Pyro Blast** | Delegated |
| Fire Fang | **Flame Fang** | Delegated |
| Fire Pledge | **Flame Pledge** | Delegated |
| Fire Punch | **Flame Fist** | Delegated — maps to our playable set |
| Fire Spin | **Flame Spin** | Delegated |
| Flame Charge | **Flame Rush** | Delegated |
| Flamethrower | **Flame Jet** | Delegated |
| Flare Blitz | **Flare Crash** | Delegated |
| Heat Crash | **Heat Slam** | Delegated |
| Heat Wave | **Scorch Wave** | Delegated |
| Incinerate | **Ash Blast** | Delegated |
| Mystical Fire | **Mystic Flame** | Delegated |
| Overheat | **Meltdown** | Delegated |
| Sunny Day | **Clear Skies** | Delegated |
| Temper Flare | **Flare Up** | Delegated |
| Will O Wisp | **Ghost Light** | Delegated |

### Flying

| Source Name | Mochiichao Name | Basis |
|---|---|---|
| Acrobatics | **Acro Stunts** | Delegated |
| Aerial Ace | **Sky Ace** | Delegated |
| Air Cutter | **Wind Blade** | Delegated |
| Air Slash | **Wind Slash** | Delegated |
| Bounce | **Spring Leap** | Delegated |
| Brave Bird | **Daring Dive** | Delegated |
| Dual Wingbeat | **Twin Wingbeat** | Delegated |
| Feather Dance | **Plume Dance** | Delegated |
| Hurricane | **Typhoon** | Delegated |
| Pluck | **Berry Peck** | Delegated |
| Roost | **Perch** | Delegated |
| Sky Attack | **Sky Assault** | Delegated |
| Sky Drop | **Air Drop** | Delegated |
| Tailwind | **Rush Wind** | Delegated |

### Ghost

| Source Name | Mochiichao Name | Basis |
|---|---|---|
| Confuse Ray | **Dizzy Ray** | Delegated |
| Curse | **Jinx** | Delegated |
| Hex | **Evil Eye** | Delegated |
| Night Shade | **Dark Shade** | Delegated |
| Nightmare | **Bad Dream** | Delegated |
| Ominous Wind | **Eerie Wind** | Delegated |
| Phantom Force | **Vanish Strike** | Delegated |
| Poltergeist | **Object Haunt** | Delegated |
| Shadow Ball | **Shade Sphere** | Delegated |
| Shadow Claw | **Shade Claw** | Delegated |
| Shadow Punch | **Shade Fist** | Delegated |
| Spite | **Malice** | Delegated |

### Grass

| Source Name | Mochiichao Name | Basis |
|---|---|---|
| Bullet Seed | **Seed Burst** | Delegated |
| Energy Ball | **Energy Orb** | Delegated |
| Frenzy Plant | **Root Frenzy** | Delegated |
| Giga Drain | **Grand Drain** | Delegated |
| Grass Knot | **Grass Snare** | Delegated |
| Grass Pledge | **Leaf Pledge** | Delegated |
| Grassy Glide | **Leaf Glide** | Delegated |
| Grassy Terrain | **Meadow Terrain** | Delegated |
| Leaf Storm | **Leaf Cyclone** | Delegated |
| Magical Leaf | **Magic Leaf** | Delegated |
| Mega Drain | **Super Drain** | Delegated |
| Petal Blizzard | **Petal Storm** | Delegated |
| Petal Dance | **Petal Spin** | Delegated |
| Seed Bomb | **Seed Blast** | Delegated |
| Solar Beam | **Sun Lance** | Delegated |
| Solar Blade | **Sun Blade** | Delegated |
| Trailblaze | **Trail Dash** | Delegated |

### Ground

| Source Name | Mochiichao Name | Basis |
|---|---|---|
| Bulldoze | **Dozer Crush** | Delegated — maps to our playable set |
| Dig | **Burrow** | Delegated |
| Drill Run | **Drill Rush** | Delegated |
| Earth Power | **Terra Burst** | Delegated — maps to our playable set |
| Earthquake | **Tremor** | Owner-locked — maps to our playable set |
| Fissure | **Chasm** | Delegated |
| High Horsepower | **Max Horsepower** | Delegated |
| Mud Shot | **Mud Spray** | Delegated |
| Mud Slap | **Mud Smack** | Delegated |
| Sand Tomb | **Sand Trap** | Delegated |
| Scorching Sands | **Seared Sands** | Delegated |
| Spikes | **Spike Field** | Delegated |
| Stomping Tantrum | **Stomp Tantrum** | Delegated |

### Ice

| Source Name | Mochiichao Name | Basis |
|---|---|---|
| Aurora Veil | **Aurora Curtain** | Delegated |
| Avalanche | **Snowslide** | Delegated |
| Blizzard | **Whiteout** | Delegated |
| Frost Breath | **Chill Breath** | Delegated |
| Hail | **Hailstorm** | Delegated |
| Haze | **Pale Mist** | Delegated |
| Ice Beam | **Frost Blast** | Owner-locked |
| Ice Fang | **Frost Fang** | Delegated |
| Ice Punch | **Frost Fist** | Delegated |
| Ice Spinner | **Frost Spin** | Delegated |
| Icicle Spear | **Icicle Lance** | Delegated |
| Icy Wind | **Frost Wind** | Delegated |
| Sheer Cold | **Deep Freeze** | Delegated |
| Snowscape | **Snowfield** | Delegated |
| Triple Axel | **Triple Spin** | Delegated |

### Normal

| Source Name | Mochiichao Name | Basis |
|---|---|---|
| Attract | **Allure** | Delegated |
| Baton Pass | **Relay** | Delegated |
| Bide | **Wait Strike** | Delegated |
| Body Slam | **Bulk Slam** | Delegated — maps to our playable set |
| Captivate | **Dazzle** | Delegated |
| Comet Punch | **Comet Fists** | Delegated |
| Confide | **Whisper** | Delegated |
| Defense Curl | **Curl Up** | Delegated |
| Double Edge | **Dual Edge** | Delegated |
| Double Hit | **Twin Hit** | Delegated |
| Double Team | **Afterimage** | Delegated |
| Echoed Voice | **Echo Voice** | Delegated |
| Egg Bomb | **Egg Blast** | Delegated |
| Encore | **Repeat Act** | Delegated |
| Endeavor | **Even Out** | Delegated |
| Endure | **Withstand** | Delegated |
| Explosion | **Detonation** | Delegated |
| Facade | **False Front** | Delegated |
| Fake Out | **Bluff Hit** | Delegated |
| False Swipe | **Mercy Swipe** | Delegated |
| Frustration | **Bad Mood** | Delegated |
| Giga Impact | **Titan Impact** | Delegated |
| Headbutt | **Head Bash** | Delegated |
| Helping Hand | **Aid Hand** | Delegated |
| Hidden Power | **Latent Power** | Delegated |
| Horn Drill | **Spiral Horn** | Delegated |
| Hyper Beam | **Ultra Beam** | Delegated |
| Hyper Voice | **Ultra Voice** | Delegated |
| Mega Kick | **Grand Kick** | Delegated |
| Mega Punch | **Grand Punch** | Delegated |
| Metronome | **Finger Wag** | Delegated |
| Mimic | **Imitate** | Delegated |
| Natural Gift | **Berry Throw** | Delegated |
| Nature Power | **Wild Power** | Delegated |
| Pain Split | **Pain Share** | Delegated |
| Pay Day | **Coin Toss** | Delegated |
| Protect | **Aegis** | Delegated |
| Psych Up | **Mind Copy** | Delegated |
| Rage | **Fury** | Delegated |
| Razor Wind | **Blade Wind** | Delegated |
| Recycle | **Reuse** | Delegated |
| Retaliate | **Avenge** | Delegated |
| Return | **Bond Bash** | Delegated |
| Roar | **Bellow** | Delegated |
| Round | **Chorus** | Delegated |
| Safeguard | **Safe Veil** | Delegated |
| Scary Face | **Fright Face** | Delegated |
| Screech | **Shriek** | Delegated |
| Secret Power | **Secret Strike** | Delegated |
| Self Destruct | **Self Burst** | Delegated |
| Sing | **Lullaby** | Delegated |
| Skull Bash | **Skull Slam** | Delegated |
| Sleep Talk | **Dream Babble** | Delegated |
| Snore | **Snore Blast** | Delegated |
| Soft Boiled | **Egg Heal** | Delegated |
| Substitute | **Decoy** | Delegated |
| Super Fang | **Ultra Fang** | Delegated |
| Swagger | **Boast** | Delegated |
| Sweet Scent | **Sweet Aroma** | Delegated |
| Swift | **Star Ray** | Delegated |
| Swords Dance | **Blade Dance** | Delegated |
| Tail Slap | **Tail Lash** | Delegated |
| Take Down | **Bring Down** | Delegated |
| Tera Blast | **Crystal Blast** | Delegated |
| Tri Attack | **Triple Beam** | Delegated |
| Uproar | **Ruckus** | Delegated |
| Weather Ball | **Weather Orb** | Delegated |
| Whirlwind | **Cyclone** | Delegated |
| Work Up | **Fire Up** | Delegated |

### Poison

| Source Name | Mochiichao Name | Basis |
|---|---|---|
| Acid Spray | **Acid Shower** | Delegated |
| Cross Poison | **Cross Venom** | Delegated |
| Gunk Shot | **Gunk Cannon** | Delegated |
| Poison Fang | **Venom Fang** | Delegated |
| Poison Jab | **Venom Jab** | Delegated — maps to our playable set |
| Poison Tail | **Venom Tail** | Delegated |
| Sludge Bomb | **Sludge Blast** | Delegated |
| Sludge Wave | **Sludge Tide** | Delegated |
| Toxic | **Toxin** | Delegated |
| Toxic Spikes | **Venom Spikes** | Delegated |
| Venoshock | **Venom Shock** | Delegated |

### Psychic

| Source Name | Mochiichao Name | Basis |
|---|---|---|
| Agility | **Fleet Step** | Delegated |
| Ally Switch | **Ally Trade** | Delegated |
| Amnesia | **Mind Blank** | Delegated |
| Calm Mind | **Serene Mind** | Delegated |
| Dream Eater | **Dream Feast** | Delegated |
| Expanding Force | **Spread Force** | Delegated |
| Future Sight | **Future Glimpse** | Delegated |
| Gravity | **Gravity Well** | Delegated |
| Guard Swap | **Guard Trade** | Delegated |
| Heal Block | **Heal Ban** | Delegated |
| Imprison | **Seal** | Delegated |
| Light Screen | **Light Wall** | Delegated |
| Magic Room | **Null Room** | Delegated |
| Power Swap | **Power Trade** | Delegated |
| Psybeam | **Psy Ray** | Delegated |
| Psychic | **Esper Force** | Delegated |
| Psychic Fangs | **Psy Fangs** | Delegated |
| Psychic Noise | **Mind Noise** | Delegated |
| Psychic Terrain | **Mind Terrain** | Delegated |
| Psycho Cut | **Mind Blade** | Delegated |
| Psyshock | **Psy Jolt** | Delegated |
| Psywave | **Mind Wave** | Delegated |
| Reflect | **Mirror Wall** | Delegated |
| Rest | **Deep Rest** | Delegated |
| Skill Swap | **Skill Trade** | Delegated |
| Speed Swap | **Speed Trade** | Delegated |
| Stored Power | **Banked Power** | Delegated |
| Telekinesis | **Mind Lift** | Delegated |
| Teleport | **Warp** | Delegated |
| Trick | **Prank** | Delegated |
| Trick Room | **Reverse Room** | Delegated |
| Wonder Room | **Swap Room** | Delegated |
| Zen Headbutt | **Zen Slam** | Delegated |

### Rock

| Source Name | Mochiichao Name | Basis |
|---|---|---|
| Ancient Power | **Relic Power** | Delegated |
| Meteor Beam | **Comet Beam** | Delegated |
| Power Gem | **Jewel Beam** | Delegated |
| Rock Blast | **Rock Burst** | Delegated |
| Rock Polish | **Stone Polish** | Delegated |
| Rock Slide | **Rockfall** | Owner-locked |
| Rock Tomb | **Rock Cage** | Delegated |
| Rollout | **Roll Rush** | Delegated |
| Sandstorm | **Dust Storm** | Delegated |
| Smack Down | **Ground Smack** | Delegated |
| Stealth Rock | **Hover Rocks** | Delegated |
| Stone Edge | **Stone Blade** | Delegated |

### Steel

| Source Name | Mochiichao Name | Basis |
|---|---|---|
| Flash Cannon | **Chrome Cannon** | Delegated — maps to our playable set |
| Gyro Ball | **Spin Ball** | Delegated |
| Hard Press | **Hard Crush** | Delegated |
| Heavy Slam | **Weight Slam** | Delegated |
| Iron Defense | **Chrome Guard** | Owner-locked |
| Iron Head | **Chrome Head** | Delegated |
| Iron Tail | **Chrome Tail** | Delegated |
| Magnet Bomb | **Magnet Blast** | Delegated |
| Metal Claw | **Chrome Claw** | Owner-locked |
| Metal Sound | **Chrome Screech** | Owner-locked |
| Smart Strike | **Keen Strike** | Delegated |
| Steel Beam | **Chrome Beam** | Delegated |
| Steel Wing | **Chrome Wing** | Delegated |

### Water

| Source Name | Mochiichao Name | Basis |
|---|---|---|
| Brine | **Salt Water** | Delegated |
| Bubble Beam | **Foam Beam** | Delegated |
| Chilling Water | **Chill Water** | Delegated |
| Flip Turn | **Somersault** | Delegated |
| Hydro Cannon | **Hydro Blast** | Delegated |
| Hydro Pump | **Water Jet** | Owner-locked |
| Liquidation | **Tidal Crash** | Delegated |
| Muddy Water | **Murky Water** | Delegated |
| Rain Dance | **Downpour Dance** | Delegated |
| Razor Shell | **Shell Blade** | Delegated |
| Scald | **Hot Water** | Delegated |
| Water Gun | **Aqua Blast** | Owner-locked |
| Water Pledge | **Aqua Pledge** | Delegated |
| Water Pulse | **Aqua Pulse** | Delegated |

## Follow-up live batch — proposals for the live move table (NOT applied by this pass)

This pass changed **registry data only**. Twelve Pokemon-named moves remain in the
live table (`src/data/core/moves.json` / `src/lib/moves.ts`). Eleven of them are
registry rows and carry their proposed names above; the twelfth, Tackle, was never
a machine move and has no registry row — its name is recorded here. Applying these
to the game files is the follow-up batch.

| Live display name (current) | Proposed Mochiichao name | Note |
|---|---|---|
| Thunderbolt | **Storm Bolt** | Registry row (General) |
| Wild Charge | **Reckless Charge** | Registry row (General) |
| Flash Cannon | **Chrome Cannon** | Registry row (General) — Chrome, the house steel word |
| Earth Power | **Terra Burst** | Registry row (General) |
| Bulldoze | **Dozer Crush** | Registry row (General) |
| Dark Pulse | **Umbral Pulse** | Registry row (General) — kept distinct from Dark Wave (Shadow Pulse) |
| Night Slash | **Dusk Rend** | Registry row (General) |
| Poison Jab | **Venom Jab** | Registry row (General) |
| Fire Punch | **Flame Fist** | Registry row (General) |
| Dragon Claw | **Draconian Talon** | Registry row (General) — **OWNER-LOCKED**: the owner's own pick, superseding the pass's delegated proposal (Draco Talon) |
| Body Slam | **Bulk Slam** | Registry row (General) |
| Tackle | **Blitz** | No registry row — **OWNER-LOCKED**: the owner's own pick (football terminology), given after the pass; supersedes the pass's delegated proposal (Barge) |

Three further live renames are already **owner-confirmed** (his "rename everywhere"
call, 2026-10-27) and ride the same follow-up batch for the game files: Crunch ->
**Munch** (locked in this registry), Quick Attack -> **Swift Movement**, and
Gust Wave -> **Wind Blast** (neither is a registry row; recorded here so the batch
cannot lose them). Growl -> **Rumble** (his delegated pick) is likewise recorded:
Growl is not a registry row.

## Flags and honest edges

- **Tackle -> Blitz is OWNER-LOCKED.** The owner first left Tackle's synonym open
  and delegated it; the pass proposed Barge — then the owner picked **Blitz**
  himself, from football terminology (the all-out rush at the ball-carrier: the
  same shoulder-first collision, said his way). Blitz supersedes Barge everywhere
  in this map. Tackle has no registry row (never a machine move), so the lock is
  recorded here and in the production log; it applies with the follow-up live batch.
- **Light-touch names (kept near-identical on purpose).** Single generic words with
  no cooler true synonym were restated, not disguised — the worksheet's light-touch
  doctrine, kept: Toxic -> Toxin, Rest -> Deep Rest, Thunder -> Thunderstrike,
  Hyper Beam -> Ultra Beam, Draining Kiss -> Drain Kiss, Echoed Voice -> Echo Voice,
  Magical Leaf -> Magic Leaf, Defense Curl -> Curl Up, Stomping Tantrum -> Stomp
  Tantrum, Chilling Water -> Chill Water, Muddy Water -> Murky Water, Rock Polish ->
  Stone Polish, Venoshock -> Venom Shock, Fire Spin -> Flame Spin, and the three
  Pledges (element word swapped only).
- **Thinnest ice (style genuinely ran short; flagged rather than forced):**
  Assurance -> Sure Blow, Bide -> Wait Strike, Poltergeist -> Object Haunt,
  Protect -> Aegis. Each is meaning-true and collision-free, but none has the snap
  of his best picks; they are the first candidates if he wants another pass.
- **Rock Slide, aligned:** this registry carries Rockfall (the owner's final
  call, and the only legal pick — Avalanche is an existing Pokemon move name).
  The GameData island now carries Rockfall too (PR #364, merged): the island
  doc records Avalanche only as the rejected option, and the island code
  contains zero Avalanche occurrences. No divergence remains. The Ice move
  Avalanche itself is named **Snowslide** here.
- **Rare register check:** all 11 Rare names are plain, strong, field-capable words
  in the owner's register (Slice, Wave, Ascend, Mighty Push, Illuminate, Mist Clear,
  Deep Dive, Crag Climb, Boulder Break, Cascade, Vortex). No Rare Move got a
  playful or jokey name.

*End of map. Registry data: `machine-registry.json` (rename.mochiichao_name +
rename.status per row: `locked` = owner's own, `delegated` = named under his
delegation). No game files were edited by this pass.*
