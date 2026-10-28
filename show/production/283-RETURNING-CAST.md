# #283 — RETURNING CAST ACROSS PARTS → the old lead walks into the new part as a person, not a cameo

**The designed case (owner's structure, #277).** Parts
change leads; the world doesn't change hands. Sooner or
later a later part's story walks into a town and **the
Gen 1 lead is there** — older, established, carrying
everything their part did to the world and to them.
Pokémon and JoJo both live on this meeting (the earlier
lead returned as champion, mentor, legend, warning).
This spec makes it a system instead of a surprise: a
returning lead is **built from their recorded history**,
in both lanes, and never from a fresh sheet written as
if the intervening years were a rumour.

## Native spec — `mochiichao/returning-cast/v1` (fragment beside this doc)

- **The return record** (one per returning character
  per part, in the part's canon/planning docs):
  - `character` — the #98 identity. One identity
    across all parts, forever; a return never mints a
    "Gen 4 version" record that could drift from the
    person.
  - `historyBasis` — **the citations the return is built
    from**, and the list is the spec: their #126 Hall
    records if they ever cleared (with whom, when —
    the snapshot answers "what did their team look like
    at the summit" without touching the living record);
    their List 28 standing **as the world last knew it**
    (the part they left is where their reputation was
    left — #270's per-group facts and #269's ladder
    position are world facts about them, carried by
    #281's readings and #145's carriers, not re-rolled);
    their #80 individuals who are still theirs (the
    partner first — a returning lead without their
    partner beside them is a story fact the return
    record must state, not a default); their #104
    honours (stored stamps travel on the record, as
    they always have).
  - `presentationDelta` — how the years show: **life
    stage read per #243** (the derived presentation
    class — time kept + growth — applied to a person
    and their Mochi alike: looks, idles, cry colour,
    never stats, never a stored "age" field), wardrobe
    in #116's context sets (field/dojo/casual — the
    returned lead's *current* context is a fact the
    record states), and role: what they are in this
    part's world (dojo master, traveller #145, champion
    emeritus, cautionary tale — a role is content,
    OPEN per return; the record shape that carries it
    is this spec).
- **The never-fresh-sheet rule.** A returning character's
  human record stays under the same model-sheet standard
  every human record lives under (the discipline #145
  cites for travellers: one person, one sheet; wardrobe
  varies, the person doesn't). A return that redesigns
  the character from text, ignores the recorded team, or
  hands them a reputation the ladder never gave them is
  a continuity defect of the same class as an #82
  conservation break — the return record's citations
  exist so the defect is checkable, not arguable.
- **Meeting your earlier hero is a first-class case.**
  In the show, the new lead meets them as the audience's
  memory meets them: the return record is written so
  both readings hold (who they were, cited; who they
  are now, stated). In the game — a later-part campaign
  (#277's mirror) or postgame content in one continuing
  save (#146) — the returned lead is an **NPC built from
  the recorded history available to that save**: in a
  continuing save, quite literally the player's earlier
  Ranger as the save remembers them (identity, Hall
  snapshots, standing — read, never copied into a
  second record); in a fresh campaign, the canon
  return record stands in. Either way the build source
  is a record, and the STAGING check is the same: no
  field of the NPC may contradict its cited basis.

## Wiring

Reads: #98 (identity), #126 (snapshots), #80 (their
individuals), #104 (honours), #243 (life-stage read),
#116 (wardrobe contexts), #145 (a return may ride the
traveller machinery), List 28 #269/#270 (standing as
world fact — mid-build, cited by subject). Writes:
return records in part docs; no character record is
edited by a return — the person's own records evolve
by their own systems or not at all.

## Open slots

**Who returns, in which part, as what — canon and
casting, every instance.** Whether the Gen 1 lead's
eventual return is as mentor, obstacle, or something
the world warns the new lead about is exactly the
kind of fact this programme does not pre-write. The
machinery is complete with zero returns instanced.

## Coverage — honest

- Architecture: the citation discipline + record shape
  over verified history machinery (#126's snapshots
  were built to be read exactly this way — the past,
  stored on purpose).
- One honest dependency: a returned lead's *standing*
  cites List 28's ladder, which is mid-build; the
  citation is by subject and number, reconciled at
  landing (STAGING).
