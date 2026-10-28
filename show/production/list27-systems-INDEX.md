# LIST 27 TEARDOWNS (items 257–266) — package index

Auto-dispatched under Jamar's AUTO-WIRE RULE (the list
IS the order, 2026-10-27). Same standard as Lists
1–26: public documentation / open sources → **native**
Mochiichao specs/formats, staged repo-ready **and
wired** to the systems already built. No copied game
assets, data tables, or text.

**This is the PLANT & GROWN-ARMOUR list.** It grew
out of the A3 line's design work — Seedquire and
Budguard locked, Verdilance directed — and out of one
owner reading that turns out to be load-bearing far
beyond one line: **grown weapon anatomy can replace a
limb as a line evolves** (Budguard's spear arm is a
shortened arm ending in the grown shoot; his other
arm became the shield; his bud is a helm). Once grown
anatomy can *replace* limbs, the programme needs
words and records for growth (#258), for the parts
themselves (#259), for how flowering comes and goes
(#257), for what thorns do in a fight (#260), for
what's in the air (#261), for how a plant eats and
rests (#262, #263), for where a plant lives in the
Garden (#264), for how a formal species says hello
before it says fight (#265), and for what the show's
crew means when they put a flower in the frame
(#266).

**Built under the PLAIN-LANGUAGE + GAP-FILLING +
POKÉMON-BASE RULES (Jamar, 2026-10-27):** mechanics
are filled from canon first, then from how Pokémon
does it (weather-keyed forms, contact abilities,
annexed sheet data), with the source of each fill
named in the spec. What stays open is only
story/canon-fact class — and this list happens to
carry almost none of it: its opens are *contents*
(the sheets haven't declared certain things yet),
named honestly as contents states, not questions
parked for the owner.

**Built under the REAL-CODE WIRING LAW (Jamar,
2026-10-27):** every cross-reference below was
checked against the actual earlier packages before
being cited (#130's axis table and criterion kinds,
#61's closed weather enum and scene record, #58's
verified state machine and standing boundary, #152's
profile annex, #147's ledger inputs, #184's trigger
vocabulary, #134's closed verb set, #65's seat
discipline, the A3 sheets read in full in
`~/workspace/mochichao-design/SPECIES-DATA-R2.md`).
Where a target could not be verified, STAGING.md
registers it as an **UNVERIFIED TARGET**. Four of
this list's yields are **proposals into another
package's home** — the `state`-criterion widening
(#130), the ROOTED state (#58), the pollen scene
field (#61), the etiquette profile field (#152),
plus two field definitions (`anatomyBasis` → #107,
the sunlight axis seat → #28) — each landing only in
its home, with citation (the `RIDDEN` precedent).

| # | File | Yield in one line |
|---|---|---|
| 257 | `257-BLOOM-STATES.md` + `bloom-fragment.json` | Bloom as a read, not a record: a #130 form family whose active form is derived from weather + phase (+ season when a calendar exists); permanent evolved bloom (Verdilance) is anatomy, never a bloom family; zero families in canon today |
| 258 | `258-GROWN-WEAPON-GROWTH.md` + `growth-record-fragment.json` | Per-stage growth records with a closed `limbRelation` vocabulary (extension / broadening / replacement-partial / replacement-full) — the A3 line recorded in full from its sheets + the owner's reading; #147/#9 read it; grown weapons can never exist in #31's item layer |
| 259 | `259-GROWN-ARMOUR-ANATOMY.md` + `parts-vocabulary-fragment.json` | The parts index every consumer shares: shield / helm / crown / plate / shell / crest / weapon-part, per-species part records with `stageFirst`; the helm law — a grown helm never comes off, and injury is not a system |
| 260 | `260-CONTACT-DEFENCE-ANATOMY.md` + `contact-citation-fragment.json` | Pokémon's contact-ability pattern with the body cited: one field (`anatomyBasis`) on ability data, resolution entirely #184's; the fairness rule — the cited anatomy must be visibly drawn, or the effect is a data error |
| 261 | `261-POLLEN-SCENT.md` + `pollen-fragment.json` | Pollen as a sourced presentation state (none / drift / bloom-cloud) riding beside weather, never inside it; never a battle input; in the show, scent is shown through pollen and reactions, never narrated |
| 262 | `262-SUNLIGHT-REST.md` + `sunlight-care-fragment.json` | Sunlight as a care input for species whose sheets declare sun-feeding — a place and a time, not an item; camp rest stays three verbs; the Garden gains sun spots as a feature class |
| 263 | `263-ROOTING-MODE.md` + `rooting-fragment.json` | `ROOTED`, proposed into #58's machine beside `RIDDEN`: plant rest + braced posture + staying, at the state's one plain cost — no travel until the roots lift; never a battle state |
| 264 | `264-GARDEN-PLANTING-SPOTS.md` + `planting-spot-fragment.json` | Garden soil a resident can be planted in — rooted posture, spot sun, bloom reads — with the hard fence: no custody, no record change, no residue when the resident leaves |
| 265 | `265-WILD-DUEL-ETIQUETTE.md` + `duel-etiquette-fragment.json` | `challengeStyle` on #152's profile: a formal species' challenge runs display → wait → answer, replaces the ambush charge with manners, binds the challenger, and costs the decliner nothing |
| 266 | `266-FLOWER-SYMBOLISM.md` (prose only) | The show crew's flower vocabulary: a five-state bloom scale × three seats (species- / place- / carried-flower), two continuity rules, and zero assignments instanced — symbolism is episode writing, forever |

Shared conventions: format ids are
`mochiichao/<name>/v1`; display names are always #23
lookups; anything countable is derived at read time,
never stored (#14/#96 law); proposals into another
package's file land only in that file, with citation
(the #58 `RIDDEN` precedent); under the gap-filling
rule, an OPEN slot in this list is a story/canon fact
or authored content — never a mechanic nobody decided.
