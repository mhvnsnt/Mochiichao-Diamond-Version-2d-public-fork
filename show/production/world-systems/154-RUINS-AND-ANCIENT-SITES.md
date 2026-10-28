# #154 — RUINS & ANCIENT SITES → old places, explored honestly

**Seat in the doctrine:** the world has a past: extinct
species (#44), ancient moves' strata, places older than
the league. #119 built interiors as a layout grammar and
#115 built excavation — where remnants come from — under
its blanket PROPOSAL discipline. What neither owns is the
*site* as a content class: a ruin is not just an interior
with dust; it is a place whose meaning is that it is old,
and whose contents obey a stricter law than any dungeon's.
This spec is that class, and it inherits its neighbours'
discipline whole.

**What was studied.** Ruins in the publicly documented
record: the reference games' ancient sites are
*archaeology as level design* — inscriptions, sealed
chambers, relic items, and a hard line between what the
past left behind (objects, records) and what it did not
(living inhabitants of extinct kinds). Design writing on
environmental storytelling adds the second half: a ruin's
story is told by arrangement, not exposition. The kit
taken: a site record joining the interior grammar, a
contents law stricter than the item layer's, and the
exposition discipline the show already owns (#46's
five-beat lab grammar, generalised to old places).

## Native spec — `mochiichao/ruin-site/v1` (fragment beside this doc)

- **A site record:** `{siteId, name (display, #23),
  hostNode (#11), interior (#119 ref), strata[],
  contents[], exposition}` — `strata` are the site's
  layers of age (each stratum: what kind of past it is —
  the vocabulary is descriptive, not a timeline; the
  world's actual history is canon the owner hasn't
  written, and strata *names* are content, OPEN).
  `exposition` names which beats of the site's story are
  told where (arrangement first, per #46's PARTIAL →
  TRANSLATE discipline: a ruin that explains itself in a
  plaque has failed; a ruin may *withhold* — the Forest's
  lesson applies to old places too).
- **The contents law (the whole point):** a ruin may
  contain **item-class and remnant-class contents only**
  — relics (#31 records), crafting materials (#103),
  remnants (#44's records, sourced per #115). A ruin may
  NEVER contain a living encounter of an extinct species:
  #44's `extinctInWild` exclusion is absolute and #7's
  tables are the only encounter authority — a site record
  has no encounter field at all, by construction, so the
  violation is unrepresentable rather than merely
  forbidden. Living species found at a site arrive
  through the area's ordinary #7 table, like anywhere.
- **Excavation joins, with its discipline.** Diggable
  strata cite #115 — and inherit its labelling: until
  the owner rules otherwise, excavation-linked contents
  of any site are PROPOSAL-class, exactly as #115's own
  contents are. A site is not made canon by being old.
- **Discovery joins the connected world.** A site is
  found the way regions are (#127/#137): by travel,
  side-story, or map connection; its interior gates use
  #59's lock classes (a sealed chamber is a puzzle gate
  with an archaeology accent, not a new mechanism), and
  a site's first-arrival staging fires once, like any
  connection's.
- **Show mirror.** A ruin episode is #46's grammar at
  location scale: REVEAL IN → INSTRUMENT (the
  Mochiioteca reads what it may — #149's `identify`
  class at ruin scale, Leak rule binding: the device
  never prints the secret layer's words for old things
  either) → PARTIAL → TRANSLATE → OUT. What stopped
  moving, and questions like it, may be *approached* at
  a ruin; per #82, an arc may not answer what canon
  holds open.

## Open slots (nothing invented)

Every site's existence, name, place, and strata (the
class ships empty — no ruin is instanced) · the world's
history itself · which strata, if any, are diggable
(#115's proposal discipline) · inscription/record content
anywhere (records are authored text, owner-gated like
all canon writing) · any site's relationship to the
Dark Forest (a canon question — the Forest is old, and
this spec does not presume it is a ruin).
