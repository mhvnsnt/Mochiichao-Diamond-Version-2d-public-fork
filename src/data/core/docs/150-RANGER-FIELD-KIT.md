# #150 — RANGER FIELD KIT → what a Ranger carries, and what carrying means

**Seat in the doctrine:** a Ranger is defined partly by
what they carry: the Mochiioteca (#81/#149), their
partner, and a working kit for the road — capture
instruments (#38), encounter modifiers (#112), medicine
and food (the #31 item layer), camp gear (#134), an
outfit for the context (#116). Until now each of those
lived in its own system and "the kit" was an assumption.
This spec makes the kit a real, small thing: a loadout
record over records that already exist, with a discipline
about what a kit may *not* do.

**What was studied.** Field-kit design in the publicly
documented record: the reference games' bag is a passive
inventory; the interesting designs (ranger/spy/adventurer
fiction generally) treat the kit as *character* — what
you packed says how you travel, and fiction solves
problems with preparation, not with new powers appearing
in pockets. The kit taken: the loadout is a curated view
over the inventory, and a kit entry can only ever point
at a capability some other system already owns.

## Native spec — `mochiichao/field-kit/v1` (fragment beside this doc)

- **A kit record** is per Ranger: `{rangerId, slots[]}`
  where each slot is `{itemId (#31 ref), role}` and
  `role ∈ {capture, remedy, provision, camp, tool,
  keepsake}` — a closed vocabulary of *carrying reasons*,
  not capabilities. The Mochiioteca is not a slot: it is
  the Ranger's instrument, recorded separately (#81),
  and the partner is not a slot either (#106's location
  field says where individuals are; a kit holds things).
- **The no-invention law.** A kit slot grants nothing.
  If an item's effect exists, it exists in its home
  system (#38's capture maths, #112's transforms, #31's
  effect records). A "gadget" whose capability canon
  hasn't named is not a kit item — it is an owner
  decision wearing a costume. In particular:
  techniques are not gadgets — Illuminate and its class
  are performed by Mochi (#117), never carried as tools,
  and no kit record may express one.
- **Kit ↔ wardrobe.** The kit is what the outfit carries:
  loadout changes are recorded against #116 outfit sets
  (field set carries the road kit; dojo set carries the
  formal minimum; casual carries keepsakes) — the join
  is a reference from the kit record to the outfit-set
  id, so art (#116 breakdown pages) and data never
  disagree about what a Ranger has on their person.
- **Show use.** In episodes, the kit is a staging fact:
  what a Ranger can plausibly produce on screen is what
  their kit record holds (the show's version of the same
  law — no pocket-inventions in scripts either; a needed
  item not in the kit is a story beat about not having
  it, which is better drama anyway). Kit changes on
  screen follow #82's conservation: what leaves an
  episode in the kit entered it on screen or by a stated
  acquisition.
- **NPC Rangers** hold kit records in the same shape
  (named Rangers are authored, never generated — #94's
  law); a rival's kit is readable design: #37's
  appearance records may cite it, so growth between
  appearances can be told in equipment as well as teams.

## Open slots (nothing invented)

Slot counts per role (carrying capacity is a balance
fact, OPEN) · every actual kit item beyond what the item
layer already instances · any Ranger's specific loadout
beyond canon-named possessions · whether keepsakes may
ever carry an effect record (the spec's reading: no —
a keepsake with an effect is a tool; recorded as a
proposal for owner confirmation, not a rule taken).

No UNVERIFIED TARGET of its own: #31's schema and #116's
outfit-set shape are verified workspace specs; the kit
record lands beside whichever of them the landing audit
seats it with (STAGING names the choice as a landing
step, not a fact).

---

**Landing annexes — List 34 (2026-10-27), citing STAGING step 10.**

(1) **Repel toggle (BUILD row of #336).** A reusable-utility toggle in this file's kit home, reading #255's encounter-rate rule — the toggle is this file's to carry; #255's rule itself does not change. (2) **Party-wide share (List 34 STAGING step 10, row 6 conversion).** Checked at this landing against #177's landed text (`battle/177-EXPERIENCE-GAIN.md`): #177 earns non-participants ONLY through a share mechanism, and asserts none (`shareSource: null`). Row 6 therefore converts to **BUILD in this toggle's form** — a switchable share, never forced — not HAVE. The conversion and its date (2026-10-27) are recorded here and in #177's landing note; #336's audit document carries the same conversion in its landing record.
