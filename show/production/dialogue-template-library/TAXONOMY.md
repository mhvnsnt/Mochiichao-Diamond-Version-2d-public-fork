# FUNCTIONAL TAXONOMY — SOURCE DIALOGUE BY JOB

Counts are measured from the banks present on disk in
`~/workspace/pokemon-dialogue-kit/_clones/` on 2026-10-27:

| Bank | Source | Dialogue-bearing units | Text blocks (approx.) |
|---|---|---|---|
| Gen 1 | pret/pokeyellow | 207 text files in `text/` | 2,040 labelled text blocks |
| Gen 2 | pret/pokecrystal | 388 map files in `maps/` (dialogue embedded) | ~2,660 labelled text blocks in maps |
| Gen 3 | pret/pokeemerald | 468 map scripts (`data/maps/*/scripts.inc`) + shared text in `data/text/`, `data/scripts/` | 3,873 `msgbox` calls in map scripts; 639 `trainerbattle` calls |
| Gen 3 (FR) | pret/pokefirered | 425 map scripts | 1,859 `msgbox` calls — corroborates the Emerald skeletons; not catalogued separately |
| Gen 4 | pret/pokediamond (+ pokeplatinum) | Text held as 623 encoded message archives (`files/msgdata/msg/*.gmm`) | **Present on disk, decode pending** — string counts to be measured when the kit job extracts them; skeletons expected to inherit F1–F12 as in Gens 1–3 |

Gen 5–9 and the Digimon / Monster Rancher banks have not landed yet; their
rows are marked *(slot designed — bank pending)* and inherit the skeletons
below, which are stable across all gens measured.

**How to read a skeleton.** "Beats" = text blocks in sequence. "Paras" =
paragraph breaks inside one block. Line counts are the source games' own
measured shapes, not targets imposed on our writers — our house style may
run one para longer when a specific prop or colour needs the room.

---

## F1 — Healer / clinic
*Gen 1: 11 Center files (one per town + route-houses) · Gen 2: inside the 58
Center/Mart maps · Gen 3: inside the 46 Center/Mart maps.*

- **Service sequence (the nurse/clerk): 6 beats.**
  1. Greeting + service named ("this is the clinic").
  2. Confirmation ask (yes/no prompt).
  3. Handover beat — the party is taken; a pause or jingle covers the work.
  4. Restoration report — what was cured, stated flatly.
  5. Farewell that doubles as a soft tutorial ("come back any time").
  6. *(Optional)* first-visit variant: the sequence plus one para explaining
     scope (status conditions cured, not just HP).
- **Ambient patients/waiters: ~3 blocks per Center**, skeleton:
  claim → scope → extra scope (three short paras, escalating information).
- **The calm-corner creature:** one creature NPC per Center whose whole text
  is a cry + one NPC's reaction to it. The gag is structural, not verbal.
- *Mochiichao home:* Aeon Clinic (Silicon Town), town clinics, Mom's heal at
  Sector 0, Garden rest corners.

## F2 — Shop / mart
*Gen 1: 14 Mart files · Gen 2–3: shared clerk sequences + per-town stock talk.*

- **Clerk sequence: 4 beats.** Greeting + "how may I serve" → menu (engine) →
  transaction confirmations (engine) → "please come again" farewell.
- **Second-clerk / floor talk: 1–2 blocks per shop** — a second voice whose
  job is one product family explained in-world ("we also carry X, for Y").
- **Shelf/sign objects inside shops:** 1-line object text (stock, prices as
  facts, never flavour paragraphs).
- **Ambient shoppers: 1–3 blocks per Mart** — window-shoppers state a want;
  the want is always satisfiable in that shop (the bark is a signpost).
- *Mochiichao home:* MochiiPlex clerk (canon stock: Capture Cubes, Mend
  Patches, Mochi Cards), Silicon Town Market stalls, Boot Harbor shopkeeper,
  dojo-town general stores.

## F3 — Signs & signposts
*Gen 1: 106 sign blocks · present at similar density in every gen.*

- **Route sign: 1 block, 2–3 lines.** PLACE NAME → the two endpoints it joins.
  Nothing else. The terseness is the function.
- **Town sign: 1 block, 2 lines.** PLACE NAME → one-line civic boast.
- **Warning sign: 1 block, 2–3 lines.** Hazard named → behaviour advised.
  Written by an implied keeper; never by the world itself.
- **Door/plaque sign: 1 line.** A name, a title, or a rule fragment.
- *Mochiichao home:* every map — the single highest-volume function in the
  fabric (see GAP-MAP.md).

## F4 — Route / city ambient barks
*Gen 1: 47 route & gate files, 34 house files; routes carry 2–6 ambient
blocks each · Gen 3: 3,873 map msgbox calls include this function's bulk.*

- **Ambient NPC: 1 block, 2–3 paras.** Observation (something specific in
  *this* place) → tip, warning, or want → local colour that closes the loop.
- **Tutorial-adjacent walker: 1 block, 3 paras.** "See those [features]?" →
  what they do → how it changes your route. The feature is always visible
  from where the speaker stands.
- **House NPC: 1 block, 1–2 paras.** Domestic scale: a meal, a chore, a
  relative elsewhere. The world is lived-in because houses are boring in
  specific ways.
- **Child NPC: 1 block, 1–2 paras.** One want, one rumour, zero exposition.
- *Mochiichao home:* Route Topaz / Route Emerald walkers, Neon City and
  Stoneport streets, Boot Harbor porches, Dark Forest walkers.

## F5 — Ranger battle lines (intro / end / after)
*Gen 1: 924 battle-structure labels across 67 files ≈ 308 complete triples ·
Gen 3: 639 `trainerbattle` calls, same triple structure.*

- **Intro: 1 block, 1–2 paras.** An identity claim staked on the speaker's
  obsession, trade, or collection — the challenge is the claim's proof.
- **End (on defeat): 1 block, 1–3 lines, prompt-ended.** A reaction, never a
  recap: surprise, a joke at the speaker's own expense, a grudge forming.
- **After (post-battle ambient): 1 block, 1–2 paras.** The worldview survives
  the loss — the speaker re-frames, boasts about what you didn't see, or
  gives the one real hint (an item, a path, a name).
- The triple is a *character in three exposures*: claim, crack, core.
- *Mochiichao home:* every route Ranger, dojo underling, arena hopeful,
  sailor, walker, grunt (F8 borrows this skeleton at menace register).

## F6 — Dojo / gate talk
*Gen 1: 8 gym files, ~15–25 blocks each · Gen 2: 51 gym maps · Gen 3: 10 gym
maps + puzzle rooms.*

- **Leader set: 5 blocks.**
  1. Pre-battle (2–3 paras): name + place → creed in one sentence → challenge.
  2. Defeat line (1 block, short).
  3. Award grant (the badge/fragment beat — object first, speech second).
  4. Award explained (2 paras: what it proves → what it unlocks).
  5. Post-battle advice (2 paras: a worldview → a mechanical hint).
- **Guide NPC (the fan by the door): 2 blocks.** Pre-badge: who the leader
  is, one type/custom warning wrapped in admiration. Post-badge: awe, and
  the road onward named.
- **Underlings:** F5 triples at house register — their claims orbit the
  leader's creed from below.
- **Statues/plaques:** F3 door-sign shape carrying the house custom.
- *Mochiichao home:* 8 dojos × 5 regions. Leaders' key lines already exist in
  the spine for Region 1 (Lin, Falk et al.); this function supplies guides,
  underlings, advice variants, and rematch texture. Region 1 customs on
  record: Lin — "A dojo is a machine. Every part has a place."; the forest
  dojo — "A forest dojo is a dojo of patience."

## F7 — Garden / keeper talk
*No direct Gen 1–3 Pokémon equivalent at full size — the nearest source
skeletons are the Day Care couple (Gen 1: 1 file, ~12 blocks; Gen 3: day-care
script, 35 msgbox calls) and Gen 2's expanded raising talk. Digimon /
Monster Rancher banks, when they land, are this function's primary donors —
ranch/farm talk is their core fabric. (Slot designed — primary bank pending;
skeleton below is built from the Day Care shape + our own Garden canon.)*

- **Keeper greeting: 2 beats.** Welcome naming the garden → the creature(s)
  present acknowledged by behaviour, not by name-shouting.
- **Service talk (feed / race / sparring / cocoon): 3 beats.** What the
  service does → what it costs or asks → one specific observed detail about
  *your* creature (the detail is a slot, filled from state).
- **Raising wisdom: 1 block, 2 paras.** A practice → its reason, stated as
  garden law without numbering (Mochiko's spine line is the register: "A
  creature you raise is stronger than a creature you only catch.").
- **Bonding Season talk: crowd-adjacent** — see F11; the season is announced,
  never explained to death.
- *Mochiichao home:* Mochiko at the Garden gate, Sector 0 Plaza, Aeon Spire
  Garden, Deep Sector Garden, Mochiko Academy grounds, Data-Fruit—**Mochi
  Fruit** farm plots, race track staff.

## F8 — Villain scenes (Syndicate / hacker)
*Gen 1: Silph Co. 11 files, Rocket Hideout ~4, Pokémon Tower takeover,
S.S. Anne arc · Gen 2: Radio Tower broadcast takeover · Gen 3: twin-team
(Magma/Aqua) hideouts and facility seizures.*

- **Grunt ambient: 1 block.** Territory claim in the present tense — "the
  docks are ours now" is *our own spine's* version of this beat — plus one
  operational detail an ordinary listener hears as work talk.
- **Grunt battle lines:** F5 triple at menace register; the End line leaks
  one fact upward (a boss, a place, a timetable).
- **Boss scene: 4–6 blocks.** Ideology stated as a gift being offered → the
  hero's refusal assumed, not argued → battle as punctuation.
- **Takeover texture:** bystanders under occupation speak in F4 shape with
  the volume turned down — shorter paras, no wants, one eye on the door.
- *Mochiichao home:* Syndicate cells (docks, Dojo 8's shadow, the Forest
  hacker), Region 3's land/sea factions, Region 4's institute, Region 5's
  Front. **This is the only function licensed for double-layered
  hacker-speak** (README Rule 3): the source skeletons' "network/computer"
  vocabulary maps onto it directly, reworded — and onto nothing else.

## F9 — Tutorial / system prompts
*Gen 1: professor's opening lecture, the Viridian catching demonstration,
Teachy TV · Gen 2: phone system, Mom's prompts · Gen 3: opening speech,
the Wally catching sequence, Match Call.*

- **Opening lecture: 5 beats.** World named → creatures named → the player's
  role offered → a choice (name/appearance) → release into the world.
  *(Ours is already written — the locked opening .ink owns this slot.)*
- **Demonstration loop: 4 beats.** An elder performs the skill badly or
  slowly → the system states the rule once → the player performs it → the
  elder confirms with the rule restated as praise.
- **System prompt: 1 line, engine voice.** No speaker, no flavour: a fact
  and a state change. ("Recorded in the Mochiioteca." is our register.)
- **Academy lesson: 3 beats.** Practice named → why it works → send-off to
  try it on the training ground.
- *Mochiichao home:* Mochiko Academy lessons, Mochiioteca prompts, Sprint
  Boots / gate / Fragment explanations, Garden systems onboarding.

## F10 — Ferry / transport
*Gen 1: S.S. Anne, 9 files (~90 blocks — a ship is a town that moves) ·
Gen 3: the Slateport–Lilycove ferry and a certain captain's boat.*

- **Gatekeeper check: 2 beats.** Vessel + destination named → ticket,
  badge, or favour verified (the check is always *shown*, never skipped).
- **Crossing ambient:** passengers speak F4 shape at sea register — every
  cabin is a house (F4) with a porthole.
- **Arrival: 1 beat.** Landfall named, one landmark pointed at, goodbye.
- *Mochiichao home:* Boot Bay crossings (Castagnoli Island / Luigi's
  Reserve), Region 3's sea lanes, the airship route into Region 4 (flag
  `r4_airship_route_open` exists in canon before its dialogue does).

## F11 — Festival / crowd
*Gen 1: Game Corner crowds, the S.S. Anne deck party · Gen 2: Bug-Catching
Contest (a full scheduled crowd event) · Gen 3: Contests (a complete
announcer + crowd system), Battle Frontier lobbies.*

- **Announcer: 3 beats.** Hype the house → state the one rule that matters
  today → start signal. The announcer never explains the whole system.
- **Crowd bark: 1 line each, 3–6 voices.** Reactions, allegiances, snacks.
  Nobody in a crowd gives a tutorial.
- **Contestant/entrant talk: F5 After-shape** — worldview in one block,
  win or lose.
- **Queue/waiting talk: F4 shape** with anticipation replacing the want.
- *Mochiichao home:* Garden Races (MochiiPlex Circuit: Dive / Glide /
  Sprint / Might + Grand Circuit), Bonding Season gatherings, the Gauntlet
  at Mauveville Arena, Grand Tournament crowds (Region 5).

## F12 — Elder / legend talk
*Gen 1: Elite Four antechambers, the Cinnabar journals *(see refusals —
function may be templated, those texts may not)*, legendary-bird rumours ·
Gen 2: the shrine keeper and the legendary-chaser (a recurring NPC whose
whole function is wanting to witness) · Gen 3: cave elders, weather lore,
the sealed-chamber braille *(function: writing that is also a lock)*.*

- **Withholding shape: 3 beats.** A partial statement → a refusal, a riddle,
  or a condition ("Beasts do not stay for crowds.") → a benediction or a
  warning that is also directions.
- **Lore-keeper service talk:** F1/F2 service shape, slowed: the elder
  performs the small service (a record read, a name confirmed) while the
  lore leaks around its edges.
- **Rumor chain:** the same legend in three mouths across three towns,
  degrading and improving by turns — no single teller owns it.
- *Mochiichao home:* Ilex shrine keeper (canon), the Cave of Echoes guide
  (canon: "The cave is dark, but it is not empty."), Hall of Records staff,
  Frost Peak and Mythar lore-keepers.

---

## Slots designed for banks not yet landed
- **Gen 4–9:** inherit F1–F12; expected additions on landing: vehicle/ride
  services (F10 expansion), photo/atelier talk, café small talk (F4
  sub-function), tournament-lobby systems (F11 expansion). Counts to be
  measured, not assumed.
- **Digimon banks:** expected primary donor for F7 (partner/ranch talk) and
  a second villain register (F8) — digital vocabulary in those banks routes
  *only* to F8 and to Aeon's licensed slips, per Rule 3.
- **Monster Rancher banks:** expected primary donor for F7 (raising,
  training, combining/rebirth talk — the Mochi Cocoon's nearest structural
  cousin) and F11 (tournament circuits).
