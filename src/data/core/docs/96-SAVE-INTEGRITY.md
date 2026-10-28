# #96 — SAVE-INTEGRITY SYSTEMS → game save integrity spec

**What was studied.** Checksum/anti-corruption architecture in
the public record: cartridge-era saves (dual-slot + checksum +
magic header — write the new copy to the *other* slot, verify,
then flip; a torn write loses one slot, never the save), and the
modern form (per-section checksums, version fields, migration on
load, atomic rename on filesystems). The invariant across eras:
**a save is either the old valid one or the new valid one — a
half-written state must be unreachable.**

**The payload this protects (already designed, scattered across
the teardown packages — this spec is where they become one
file):**

| Section | Contents | Home spec |
|---|---|---|
| `dex` | `seen_bits` / `met_bits` bitsets | species-systems MOCHIIOTECA-FORMATS §1.2 |
| `flags` | story/progress/tech/vars namespaces | world-systems EVENT-FLAG-ARCHITECTURE (#12) |
| `party` / `roster` | individuals (incl. `variant_id: lustre`, #92) | game data core |
| `world` | schedule overrides in force, spawn/session state | #93 / SPAWN-TABLES |
| `meta` | save version, playtime, slot id | this spec |

**Native spec:**

- **Layout:** header `{magic, schema_version, slot, sequence}` +
  sections, each section independently checksummed (CRC-32 per
  section; whole-file hash optional and *not* a substitute — a
  corrupt `meta` must not orphan a good `dex`).
- **Dual-slot rotation:** two slots, alternating writes,
  `sequence` increments per successful save. Load picks the
  *highest-sequence slot that verifies*. A failed verify falls
  back one generation and **says so in the UI** (silent rollback
  is how players lose hours without knowing why).
- **Atomic section writes:** within a save operation, sections
  write to a scratch copy of the target slot; the slot flips to
  `valid` only after every section checksum is written. The
  bitsets are small (32 bytes per 256 species… the footprint
  math's cousin: 1 bit/species is why the dex section is the
  cheapest thing in the file) — there is no performance excuse
  for partial dex writes.
- **Versioning & migration:** `schema_version` is the *save*
  version, independent of any content version. Loaders migrate
  forward one version at a time, on a copy; a failed migration
  leaves the original untouched and loadable by its own version.
  New sections (e.g. a future facility streak record, #86/#94)
  arrive as *absent = default*, never as a version bump that
  orphans older saves.
- **What integrity is not:** this is anti-*corruption*, not
  anti-*tamper*. No encryption, no signing, no play policing —
  a single-player world's save is the player's file. Stated
  plainly so no later pass "hardens" it into a DRM shape canon
  never asked for.
- **Derived data is never saved:** completion counts
  (MOCHIIOTECA-COMPLETION — derived from the bitsets by
  popcount), schedule positions (derived from #93 tables +
  clock), and lustre *presentation* (derived from the palette
  map) are recomputed on load. The save stores facts; everything
  countable is counted fresh. This is the rule that keeps the
  sections above from desyncing each other.

**Wiring.** This is the capstone of the data packages: it names
the payload sections owned by species-systems, world-systems,
and List 10's #92/#93, and gives them one durability story.
Game-side only — the show has no saves; show "state" is the
production log and registries, governed by their own rules.

**Coverage.** Architectures: cartridge dual-slot/checksum and
modern sectioned formats are both fully documented publicly.
Contents: the section map is complete against the systems built
to date; `schema_version` starts at 1 when the game first writes
a save — until then this is a spec with zero files to protect,
flagged as such.

## Registered section — `research` (List 11 #97, landing 2026-10-27)

The payload map gains a `research` section: FACTS ONLY (tallies); research levels are derived, never stored. Registered here as the section's one home. No save implementation exists in the repo yet — this registration is spec-level, recorded as such (real-code law), and binds the first save build.

## Registered section — `hallOfFame` (List 13 #126, landing 2026-10-27)

A future FACTS section in this payload map (absent = default). No record is created at landing; the write hook arms when #100's capstone is instanced in real encounter records. One home: this registration. (#122's disposition over these sections is reference-only — NG+ is CLOSED by owner ruling; see src/data/core/docs/122-NEW-GAME-PLUS.md.)

## Registered view — `visit-record` (List 15 #146, landing 2026-10-27)

#146's audit conclusion lands as an AUDIT RESULT, not a schema patch: the one-world save needs ZERO net stored change — every region-fork was refused with a derivation, and 'visited' has exactly one derived home: this visit-record VIEW (derived from #12 arrival evidence; consumed by #98 + #137). The view is a definition registered here; it is ABSENT from the payload itself. No runtime save implementation exists in the repo (verified) — this registration is architecture-level and binds the first save build; it is not engine wiring.

**PROPOSED section (List 17 #161, registered at its landing, 2026-10-27):** a `sizeRecords` measurement-fact section in this payload map (shape: src/data/core/docs/size-records-fragment.json). Absent = no facts, per this map's own convention. NO record, contest, or number is created: height/weight are TBD for all 49 Gen-1 species (species-data audit), and the measurement derivation is #161's registered open dependency.
