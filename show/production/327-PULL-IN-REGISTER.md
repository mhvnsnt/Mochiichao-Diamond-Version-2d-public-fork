# #327 — THE PULL-IN REGISTER → the standing scout document

**Seat in the doctrine:** the owner's pull-in
principle, stated in full (2026-10-27): *if a system
is already built somewhere — another game, a modding
community — and it fills a gap in ours or adds to
what we've built, pull it in and wire it 100%.* His
reason the programme works at all: "it's already all
built." This spec makes that principle a maintained
system instead of a habit: one register where every
candidate pull-in is scouted, judged against a named
gap, and tracked to a landing or a refusal. Lists
1–33 pulled in constantly (Pokémon's base, Colosseum,
Chao World, RDR2, FNV, Sonic grammar) but kept the
scouting in their heads and their STAGING files.
#327 is the book those scouts now write in.

**What a pull-in is, in this programme's law.** A
pull-in is never an asset, a character, a name, or a
logo (the construction-kit rule): it is a *system* —
a mechanic, a grammar, a format — rebuilt natively
and wired into real code. A candidate that can only
arrive as copied content is not a candidate; it is
refused at scouting, in writing, and the refusal is
kept (below).

## Native spec — `mochiichao/pull-in-register/v1` (fragment beside this doc)

- **One entry per candidate.** `{entryId, candidate
  (the system, in plain words), donor (the game or
  community + the specific mechanic taken — never a
  vague "from X"), fillsOrAdds (the Mochiichao gap
  it fills, cited by system number — or the named
  addition it makes to a built system), translation
  (what survives the crossing, and what is refused
  on the way), status, home (the package/system it
  lands in)}`.
- **Statuses (closed):** `scouted` (named, not yet
  judged) · `building` (a package owns it) ·
  `landed` (wired, with the landing PR named) ·
  `refused` (with the reason, in the entry, forever).
- **The two tests every entry must pass before it
  leaves `scouted`:** (1) *the gap test* — name the
  gap it fills (a system number that lacks the
  thing) or the addition it makes (a built system it
  measurably deepens). "It would be cool" is not a
  gap and not an addition. (2) *the translation
  test* — state what survives as a native system
  under the construction-kit rule, and what stays
  behind. An entry that cannot state its translation
  is not ready to build.
- **Refusals are knowledge and stay on the
  register.** The founding precedents, carried in as
  the register's first refused entries by citation:
  individual fusion, refused in #103's item-crafting
  spec (fusion of *individuals* collides with the
  pair-merge evolution edges, whose representation
  is an owner decision in #8/#199 — the refusal was
  written there and the word reassigned); dynamic
  difficulty by rubber-banding, refused in #70
  (adopted instead: pre-authored bands + player-
  chosen modes, #189); a restart-plus mode, closed
  by the connected-world ruling (#122) — a donor
  shape the world itself refused. Each refusal names
  the lawful translation that took its place, when
  one exists — a refusal with no translation is a
  closed door; a refusal with one is a signpost.
- **Landed precedents, carried by citation** (the
  register's proof the method works): the snag/
  stealing family (#268, from Colosseum + the cheat-
  code tradition + the mod community's Thief Ball
  and Rocket Edition work, documented in List 28's
  RESEARCH-SOURCES); purification (#288, Colosseum/
  XD); Chao raising depth (#293) and the Chao
  alignment-made-visible grammar (List 30's Sonic
  catalogue); RDR2 honour + FNV reputation (#269/
  #270). These land as `landed` entries pointing at
  their packages — the register indexes; it does not
  re-describe.
- **Feeding rule.** Every future list's STAGING adds
  its newly scouted donors to the register (donor,
  mechanic, status) as part of its landing paperwork,
  and every list's commissioning reads the register
  first: scout before building, so two lists never
  pull the same system twice or refuse what another
  landed. This list's #328–#336 are the register's
  first native entries (fragment beside this doc).

## Wiring (proposed)

The register is a living document in the teardown
programme's home, versioned with the packages; each
landing lane PR that wires a register entry updates
its status and names the PR. No game runtime reads
it — it is production law, not data. Reads: every
package's STAGING. Writes: one entry per candidate,
status transitions only.

## Open slots (nothing invented)

Future candidates themselves (the register is a
book, not a prophecy — entries arrive by scouting,
not by this spec) · the register's in-repo seat
(proposed beside the production research INDEX;
final seat is the landing lane's call under the
real-code law).
