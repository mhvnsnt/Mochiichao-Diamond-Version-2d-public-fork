# #238 — RANGER LICENCE CARD → the licence as an object you can hold and show

**The gap this fills.** The licence (#98) exists as a
record: it stores identity facts and nothing else —
`rangerId`, `displayName`, a partner reference, the
issuing beat, the origin place — and everything else it
shows (Fragments held, dex counts, standing) is worked
out fresh each time from the systems that own those
facts. But a record is not a thing. Rangers in the
world carry a **card**: they show it at dojo doors, at
gates, to each other. This spec is the card — the
licence as a presented object — and the rule that the
card is a *rendering*, never a second copy of anything.

**How Pokémon fills the same gap:** the trainer card is
a screen and an object at once — it shows the trainer's
name, id, start date, money, play time, and badges, and
it is shown, as a card, at league gates. Nothing on it
is stored on the card; it is the save, drawn. Mochiichao
keeps exactly that shape, under #98's stricter rule:
identity only is the record's; the rest is borrowed
light.

## Native spec — `mochiichao/licence-card/v1` (fragment beside this doc)

- **The card's contents, in two kinds and no third.**
  - **Identity (from #98's record, as stored):** the
    Ranger's display name (#23 lookup), `rangerId`,
    origin place (rendered by lookup), the issuing
    beat's mark. This is all the card *is*.
  - **Standing (worked out at the moment of showing):**
    Fragments held (the popcount over #12 progress
    flags), regions visited (#146's visit record),
    dex counts (#14's derivations), gauntlet standing
    (#100). The card calls the owning systems at render
    time, the way #98 already rules. A card rendered
    yesterday and screenshotted is a picture of
    yesterday — the live card can never disagree with
    the gates, because it reads the same facts the
    gates read (the Fragment case's own rule, #98).
- **Where the card is presented.**
  - **In person:** an interaction beat (#93's NPC layer)
    — a dojo door, a gate, a checkpoint. The presentation
    is a beat, not a transaction: showing the card
    writes nothing, and no gate tests the *card*; gates
    test the flags the card renders.
  - **On the Mochiioteca:** the device can draw the
    card. In the show, that drawing follows #149's
    screen grammar — light, assemble, settle — with the
    card's contents as the assembled content. **No new
    screen class is founded here:** #149's set
    (identify / map / scan / alert) is closed, and the
    licence card is a #98 rendering that borrows the
    device, not a fifth class. If the landing ever
    needs a class seat for it, that is a proposal into
    #149's file, in #149's home (STAGING step 2).
  - **In the game menus:** the card is one of the
    summary surfaces over the save — same rendering,
    no separate data.
- **A lost card.** Cards are objects, so they can be
  lost. Losing one is a **service event, never a
  progress loss**: the licence is the save's facts, not
  the plastic. A replacement is issued at a care-centre-
  family service point (#132's family of places — the
  reissue is a service act like theirs: it performs one
  defined thing and writes nothing else). The reissue
  is recorded as a service event in the save's history
  (the #12-kept record of what happened), and that is
  the whole cost: a trip, a small scene, a new card.
  No flag is cleared, no standing is dented, no
  Fragment is ever re-earned.
- **The card never carries:** money (the economy, #20,
  is not an identity fact), items, party state, or any
  fact another system owns. If it isn't identity or a
  live derivation, it isn't on the card.

## Wiring

Reads: #98 (the record), #12 / #146 / #14 / #100 (the
derivations it renders). Presented via: #93 (in
person), #149's grammar (device, in the show). Reissue
service: #132's family. Writes: one history event on
reissue; nothing else, ever.

## Open slots

The card's physical design (materials, layout, look) —
the same class of owner call as the Fragment case's
design and the Mochiioteca's body (#81/#98): how the
object *looks* is canon's to set. Behaviour and data
are fully specified here; nothing mechanical is parked.

## Coverage — honest

- Rendering-not-storage: #98's own verified rule,
  applied to the object.
- The device presentation borrows #149's pacing; the
  screen-class question is registered as a proposal,
  not silently resolved (STAGING, interface note 1).

---

**Landing citation — List 34 (2026-10-27), citing STAGING step 5.**

#330 skills by use (`src/data/core/docs/330-SKILLS-BY-USE.md`) renders its Ranger proficiency read beside this file's licence card and #98's licence record. The read is derived at read time from use-facts that already exist; per List 34 STAGING step 5, #98's record gains NO proficiency or rank field (identity only), and nothing in this file gains one either. Proficiency gates nothing, ever — it is not a second licence (#133's trials and #100's gauntlet are separate systems, cited distinctly).
