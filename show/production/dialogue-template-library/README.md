# MOCHIICHAO DIALOGUE TEMPLATE LIBRARY

**What this is.** A template library for filling the unwritten everyday fabric of
the Mochiichao game — ambient NPC lines, signs, service dialogue, Ranger battle
intros/outros, system and tutorial prompts — built by adapting the *functional
skeletons* of the source games' text banks (Pokémon Gens 1–9, plus Digimon and
Monster Rancher banks as they land) into Mochiichao canon. Templates are
starting shapes, not finished text: every use is rewritten into canon before it
ships (see the Adaptation Rules, which are the law of this library).

**Why it exists.** Measured 2026-10-27: the game's story spine (~70 beats
across five region dialogue files plus the locked opening) is written, but the
everyday fabric around it is only ~10–20% written. This library exists so the
fabric can be filled fast *without* inventing from zero and *without* drifting
off canon — the same way the spine itself was built from the games.

**Contents.**
- `TAXONOMY.md` — the functional catalogue of source dialogue: what functions
  exist, how many examples the banks hold, and each function's structural
  skeleton (line counts, beat shape, information carried).
- `PILOT-BATCH.md` — 30 fully adapted, canon-ready templates across 11
  functions, each shown as *source function + skeleton → finished Mochiichao
  lines*, placed by region/location.
- `GAP-MAP.md` — what the game still needs per region, by function, once the
  library is applied, in production order.

Source banks live in `~/workspace/pokemon-dialogue-kit/` and are REFERENCE
ONLY: skeletons, structures, and functional phrasing patterns are the kit;
wording is never carried over.

---

## THE ADAPTATION RULES

*Front page. Binding on every template in this library and every line adapted
from it.*

### Rule 1 — Skeleton only, never wording.
What transfers from a source bank is the *shape*: how many beats, what
information each beat carries, where the pause falls. No source sentence,
catchphrase, or line rhythm distinctive enough to recognise is carried over.
If a player who knows the source games could point at one of our lines and
name the original, the adaptation failed.

### Rule 2 — Canon names, always.
Every adapted line uses current canon display names, and only those:
**Rangers** (never "trainers" for the humans who command in battle),
**Mochiioteca** (the records device), **Iridescence** (the region) and the
**Iridescence Plateau**, **The Dark Forest**, **Route Topaz**, **Route
Emerald** (routes are gemstones from here on), **Champions Dojo** (its Core
Gate title kept), **Mochi Fruit**, **Mochi Cocoon**, **Mochi Cards**,
**Mochii Isles** (two i's — the lone exception), **Illuminate** (the light
technique). Internal ids and keys never appear in dialogue. Silicon Town,
Boot Harbor, Boot Bay, Sector 0, Neon City, the Core Gate and the Chrome
Gate keep their names — they were ruled innocent.

### Rule 3 — THE SECRET is enforced in every mouth.
The world is a computer that grew a wilderness, and no inhabitant knows.
Ordinary dialogue therefore contains **no computer tells**: no "data",
"binary", "program", "system", "digital", "mainframe" in the mouths of
ordinary people, on signs, or in system text. Templates whose source skeleton
carries digital vocabulary (storage PCs, networks, downloads) are re-housed
in in-world objects before use — a ledger, a shelf, a keeper's book, a bell.
**One exception, by design: the villain/hacker function.** Syndicate and
hacker lines keep double-layered hacker-speak, because in-world listeners
hear only mundane talk about data and hacking while the second layer passes
over their heads. No ordinary character may ever decode that second layer,
react to it, or repeat it knowingly. Aeon may slip and say "the Mainframe" —
and corrects himself to "the mainland" in the same breath; nobody else gets
the slip.

### Rule 4 — Creatures never speak words.
Mochi vocalise: pure cries and sounds only — no word-dialogue, no name-saying,
not even their own names. A creature text block is written as sound (a crackle,
a hum, a two-note call), never as a sentence and never as its species name
shouted. Humans speak words. In the show lane, creature meaning is carried by
silent-film subtitles at earned moments only; in the game lane, by action and
context.

### Rule 5 — No source people, no source places.
No source character names, no source place names, no source organisations.
A source gym leader's *beat shape* (creed → challenge) is kit; his name, his
town, his badge, and his creed's wording are not. Our cast only: the dojo
masters (Lin, Falk, Tetsu, Kenji, Phantom, Shizuku, Homura), the Elite Four
(Umi, Gin, Hono, Yoru), Hex, Aeon, Mochiko, Mom, and the unnamed fabric —
walkers, clerks, ferrymen, dockers — who are ours to name or leave unnamed.

### Rule 6 — House style or it doesn't ship.
Adapted lines are voiced in the owner's house style, the one the spine
already speaks: rules-first, canon-sourced beats; specific props and colours
(a red bucket, a blue rope, chalk on the gate boards); gag *mechanisms*, not
quips (a ferryman who restarts his gull-count from zero every time he loses
it); silence used as a tool (the walker who says nothing for one whole text
box while the Forest hums); TBDs never silently filled — a template with an
open slot ships with the slot visible and named, or doesn't ship.

### Rule 7 — Famous lines are refused, not adapted.
Anything a general audience would recognise as *that line* is flagged
**DO-NOT-ADAPT** and excluded from the pilot batch and from production use,
even as a skeleton with new words, when the beat itself is the fame. The
current refusal list lives at the end of `PILOT-BATCH.md` and grows whenever
a reviewer spots another. Refusing is a feature: the fabric should feel like
*our* world remembered, not theirs quoted.

### Rule 8 — Placement is part of the template.
Every adapted template states where it lives (region, map kind, speaker role)
and which canon facts it may touch. A template may not introduce a new canon
fact; it may only furnish facts the spine, the registries, or an owner ruling
already established. Genuinely new facts route back to the owner as TBDs.

### Rule 9 — Two lanes, one text.
The game lane and the show lane draw from the same adapted templates. A line
written for a game NPC that the show later dramatises keeps its wording
unless a lane-specific law (subtitle law, voice law) governs the change —
and that change is recorded, not silent.

---

*Status: pilot issue, 2026-10-27. Counts in TAXONOMY.md are measured from the
banks present on disk (Gens 1–3 decompilations, readable text; the Gen 4 bank
is present as encoded message archives, decode pending); Gen 5–9 and Digimon /
Monster Rancher slots are designed and await their banks.*
