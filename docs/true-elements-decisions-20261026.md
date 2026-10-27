# True Elements — Mars's rulings, 2026-10-26 ~21:01–21:02 CDT

Staged doc, NOT canon until Mars firms the open questions at the bottom.
Supersedes nothing by itself; the proposal doc
`true-elements-side-by-side-20261026.md` §6 stays the prior record.
Repo main is PR-only, so this doc reaches the repo via a PR, not a direct edit.

## Mars's rulings (his words, cleaned up only for spelling)

- **Neon = Electric.** "Neon is electric in our world." Decided.
- **Flora = Grass.** Decided.
- **Aero = Wind.** ("Arrow is wind" = Aero is Wind.) Wind folds into Aero. Decided.
- **Beast = Normal, probably.** "Beast is probably normal yes." Recorded as his
  ruling with his qualifier — Normal stays, filled by the 6 Beast creatures
  (Kittember line + canine line), NOT replaced by another type.
- **Ice = Frost. Poison = Toxic. Fairy = Cryptid.** Decided (Cryptid picked
  with a hesitation — "can be um cryptid" — firm it if you want it locked).
- **Umbral = Dark ONLY.** Split: Umbral is just Dark, NOT Dark + Ghost.
- **Mythic = Dragon ONLY.** Split: Mythic is just Dragon, NOT Psychic + Dragon.
- **Ghost = Paranormal** (new element). **Psychic = Clairvoyant** (new element,
  name TENTATIVE — Mars said "I don't know clairvoyant").

## Water question — answered

- **Yes, we have a water equivalent: Water itself.** Roster word **Aqua** =
  Water, rename only, 10 creatures (Mochii, Tiidebiite, AquariiOS, Finblade,
  Megalochrome, Floatcalf, Astroleviathan, Inklet, Toxitacle, Krakenox).
- **Deep is NOT water.** Deep is a separate canonical element with zero
  creatures and all of its chart cells owed. It was never defined before
  this conversation — just a name in the 12.

## Deep = Ground hypothesis (Mars's "might be", NOT decided)

Mars: "Deep might be ground if we don't have a ground... there's rock and
Pokemon and then there's ground in Pokemon, deep might be our ground version."
Conflict this creates: the old proposal already mapped **Earth → Ground**
(partial — Rock went to Core). If Deep IS Ground, Earth needs a new answer
(retire? merge? become something else?). The 3 Earth creatures (Pupbble,
Terradog, Quakehound — all Beast + Earth, and Beast → Normal) would also
need retyping under any Earth change. Open, Mars's call.

## Count check — his rulings land at 19, not 18 (flagged, not fixed)

Start 12: Water, Chrome, Earth, Bug, Umbral, Aero, Core, Strike, Deep,
Flame, Mythic, Normal.
Add: Electric (Neon) +1, Grass (Flora) +1, Frost +1, Toxic +1, Cryptid +1,
Paranormal (Ghost split) +1, Clairvoyant (Psychic split) +1 = **19**.
Umbral→Dark and Mythic→Dragon add 0 (they keep their slots); Aero/Wind
and Beast/Normal folds add 0.
Mars's target was 18 ("so we have 18"). Clean reconciliation, offered not
decided: if Deep = Ground AND Earth steps aside (−1), the count is exactly
18. Otherwise one of the 19 folds or 19 is the real number. Mars's call.

## Electric + Flying creature question — answered by mapping logic

Under his rulings, a Pokemon-style Electric + Flying creature is
**Neon + Aero** in ours — Flying PLUS Neon, not Neon alone (Neon = Electric,
Aero = Wind/Flying). No current roster creature is typed that way; this is
the mapping rule for when one appears. (No creature was guessed here.)

## Gen 2 rule (Mars, standing)

**Everything made next is Gen 2 and forward.** All creatures not yet named
or made are Gen 2+. The current 47 are Gen 1 by implication. This rule is
recorded here and in MEMORY.md.

## Type-adjacent creatures + later evolutions (Mars's plan, NOT done)

Type-adjacent creatures (e.g. Inklet / Toxitacle / Krakenox sounding
poison-adjacent while typed Aqua/Umbral) are NOT retyped now. Instead,
later evolutions introduce secondary and tertiary types, in Gen 2+ (and
later generations). Tertiary = a third type slot, beyond Pokemon's two —
a Mochiichao system direction, not implemented by this doc.

## "True chart isn't wired in" — what that means, plainly

BattleView today reads `src/lib/constants.ts` — the modern Pokemon 18-type
chart. The True chart file (`src/lib/battleTypeChart.ts`, True elements +
owed cells) exists, but no battle code imports or uses it, and
`src/lib/species.ts` still types its 12 species with Pokemon words.
Wiring = making BattleView use the True chart and True typings. Mars's
plan: expand the True list to 18 (see count question above), then wire it.
Wiring is NOT done by this doc — it needs the locked 18 list first, and
matchup values for the new elements (Frost, Toxic, Cryptid, Paranormal,
Clairvoyant, Deep-as-whatever) are still undefined.

## Decisions now settled vs still owed

Settled by this message (7-decision list from the proposal doc):
1. Neon → Electric — DECIDED (Neon IS Electric, own slot).
2. Flora → Grass — DECIDED (Flora IS Grass; old GRASS → Earth mapping
   retired by this ruling unless Mars says otherwise).
3. Wind → Aero/Flying — DECIDED (Aero IS Wind, folded).
4. Beast → Normal — DECIDED with Mars's "probably" qualifier.
5. Ice / Poison / Fairy — DECIDED (Frost / Toxic / Cryptid).
6. 2-to-1 merges — SPLIT, both (Umbral = Dark only, Mythic = Dragon only;
   Ghost → Paranormal, Psychic → Clairvoyant tentative).
7. Deep — STILL OWED (Ground hypothesis open; see conflict above).

Still owed (only these, everything else in this message is ruled):
- Deep = Ground? And if so, what happens to Earth?
- 18 or 19? (Or Deep = Ground + Earth steps aside = exactly 18?)
- Is "Clairvoyant" the firm Psychic name, or a placeholder?
- (Non-decision, his step later) True chart wiring, after the list locks.
