# SEVEN ISLES POSTGAME — postgame content format (List 7, #66)

Teardown: postgame structure in creature-collector games — the
content layer that opens when the championship falls: a new map
region with its own circuit logic, rematch/escalation ladders,
and completion systems finally given room to finish. Public
architecture: postgame is a *second contract* — the main game
taught the systems; the postgame trusts the player with all of
them at once, and gates by accomplishment, never by new currency.

## Naming (two-lane law, applied before anything else)

- **Display name (in-world):** the **Seven Mochii Isles** — the
  canon sweep's display form (Seven Data Isles → Seven Mochii
  Isles). This is the only name that may appear in game text,
  signage, dialogue, scripts, or any in-world artifact.
- **Production name:** "Seven Data Isles" survives in
  production-layer documents only (the Bible, this spec, planning
  docs) under THE SECRET's layer rule — production docs may hold
  the hidden truth; in-world artifacts must not betray it.
- Internal ids/keys are unchanged by either name (canon precedent:
  display names change, wiring cannot break).

## Canon frame (all of it, and no more)

Season canon gives: the Seven Isles are the **post-game** leg of
Region 1's spine — after Champion Hex (Mainframe Plateau;
display: Iridescence Plateau). That is the whole of the canon:
their position in the spine and their name. **No isle names, no
isle contents, no isle order, no postgame story beats exist in
canon.** This format structures the slots; it fills none of them.

## The format — an isle circuit

**Unlock:** derived, not stored — `progress.champion_hex_beaten`
(the event-flag architecture's derived-state rule, #12) opens the
circuit; there is no postgame flag of its own.

**Isle record (one per isle, seven slots):**

```json
{
  "isle_slot": 1,
  "display_name": "OPEN",
  "production_name": "OPEN",
  "theme": "OPEN",
  "circuit_role": "opener | escalation | rest | convergence | finale | OPEN",
  "encounter_table_ref": null,
  "escalation_ref": null,
  "completion_hooks": []
}
```

**Circuit rules (structure, not contents):**
- The circuit is a *set with a recommended order*, not a corridor:
  postgame trusts the player; hard sequential gating between
  isles needs a story reason recorded on the record, or it
  doesn't ship.
- Each isle carries one `circuit_role`; the set as a whole wants
  exactly one `finale` and at most one `rest` — checked at review,
  assigned when canon arrives.
- Encounter tables for isles are spawn tables (List 2 #7 format)
  keyed to postgame discovery states; a species' first postgame
  appearance is a discovery event like any other (the two-bitset
  law doesn't care which side of the championship a meeting
  happens on).
- Escalation (rematches, raised ladders) references the systems
  that own escalation (opponent/team systems, List 5 #37 class) —
  this format holds refs, never copies of their data.
- **Completion hooks** point at the Mochiioteca completion system
  (List 2 #14): postgame is where long completion ladders are
  allowed to finish; reward *kinds* stay device-shaped and never
  route-gating, per that system's law.

## Show lane

A postgame season (or season arc) reads the same records: an
isle's `theme` + `circuit_role` are the episode-brief seeds when
the owner opens that season. Production documents for such a
season use production names internally and display names in every
script artifact, per the layer rule above. No episode content is
implied by this format — season count and shape remain
production decisions (season canon map).

## Coverage

Postgame architecture: standard, publicly documented. Contents:
explicitly and entirely OPEN — seven named slots, zero invented
isles. The format is the deliverable; canon fills it when the
owner's season work reaches the Isles.
