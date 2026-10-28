# #198 — REGIONAL DEX PRESENTATION → one roster, regional views

**Seat in the doctrine:** a regional dex is a
**view** over the roster — never a second roster.
The roster is global and singular: its membership
is exactly #197's lock register. A region's dex
selects the members present in that region, orders
them for presentation, and renders them under the
viewing Ranger's discovery state (#14). Any build
in which a regional dex stores species facts is a
defect on its face: facts live on the species
record, once, and views only *arrange* them.

> **OWNER RULING (Jamar, 2026-10-27, incorporated):**
> (a) regional order — R2 #1–6 and its successors —
> is **view ordering only**; it is not the roster
> number, which is global and assigned in lock
> order (#197). (b) **Silhouette presentation:** a
> locked-but-undiscovered species displays as a
> **silhouette** in the Mochiioteca until discovered
> (Pokémon-style, the owner's words). The
> discovery-state axis joins the silhouette-discovery
> system (List 1, item 3): unseen = silhouette,
> discovered = visible.

**What was studied.** Regional-dex presentation in
the publicly documented record: one underlying
roster, per-region subsets with their own curatorial
order, per-player discovery states driving what an
entry shows (withheld → silhouette/ghost → full
entry). The kit taken: subset + order as view
configuration; discovery as a per-viewer axis over
shared facts; completion as a count *computed over
the view*, never a stored tally.

## Native spec — `mochiichao/regional-dex/v1` (fragment beside this doc)

- **Membership is derived, never listed.** Species
  ∈ region view iff present in the region —
  presence read from #144's cross-region presence
  projection (range maps #102 over habitat/spawn
  data #7) unioned with kept/story presence from
  the roster's own records. A species present in
  two regions appears in both views with **one**
  record — the views differ, the species doesn't.
- **Order is view configuration.** The view stores
  exactly one thing: an ordering list of roster ids
  (the region's curatorial sequence — R2 #1–6 is
  such a list). The list asserts nothing about
  presence and holds no species facts. Disagreement
  rule, stated so landing can test it: an ordered id
  the membership derivation excludes renders
  **nothing**; a present species missing from the
  order appends after the ordered rows in
  roster-number order. Either disagreement is a
  data-lane flag, never a crash and never a silent
  fix.
- **THE TWO AXES — stated once, binding on every
  consumer:**
  - **Axis 1 — ROSTER (global).** Locked (#197) or
    not in the world at all. One fact, true for
    everyone, changed only by a lock act.
  - **Axis 2 — DISCOVERY (per-Ranger).**
    never-met → seen → kept (#14's states), computed
    per Ranger from that Ranger's own facts.
  The axes are independent and no consumer may
  collapse them. Corollaries, each a testable rule:
  a locked species a Ranger has never met renders
  as a silhouette *to that Ranger* and as a full
  entry to a Ranger who has kept it; an **unlocked
  species appears in no Ranger's dex in any form —
  not even as a silhouette.** Silhouettes show the
  roster's locked shape to someone who hasn't met
  its members; they are never a teaser for content
  that isn't canon yet.
- **Silhouette rendering** joins List 1 item 3's
  system (SILHOUETTE-DISCOVERY — the silhouette
  asset family and its discovery grammar) rather
  than inventing a second one. The Mochiioteca
  screen classes (#149) read the **same** derivation
  as this view — one derivation, two presentations;
  the atlas's region pages (#137) cite the same
  membership and the same per-Ranger axis. A
  consumer computing discovery privately is a
  defect, wherever it is found.
- **Entry content by state** (following #3/#14's
  state grammar): never-met → the silhouette, the
  roster number, the regional position — a *shape*,
  not a name (the display law: an undiscovered
  entry shows no display name; the name arrives
  with the seen state). Seen/kept → the entry as
  #14's loop defines it, every visible string a
  display-name lookup (#23 family) under the
  display-layer naming law — regional display names
  included.
- **Counts are computed over the view.** Per-region
  completion (kept-in-view / locked-in-view) is
  derived at read time per #14's counts-are-computed
  law. The view stores no tallies; the roster stores
  no per-region anything.

## Wiring (proposed)

View records beside #14's home (MOCHIIOTECA
completion) with #137's atlas as co-consumer.
Reads: #197 register (membership universe), #144
presence, #14 states, #3 silhouette assets, #149
screen classes. Writes: the ordering lists only.

## Open slots (nothing invented)

Every region's ordering list beyond the inherited
Region 1 presentation (curation is design-lane
work) · whether the silhouette row shows the roster
number, the regional position, or both (a
presentation detail for the design lane — the
ruling fixes the silhouette, not its furniture) ·
the name-reveal beat's exact staging at `seen`
(owned by #3/#14's grammar, not restated here) ·
Regions 2–5 view curation entire (the regions
exist in canon; their dex views are authored when
their content is).
