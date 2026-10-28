# #90 — IN-WORLD RADIO/MEDIA SYSTEMS → Iridescence media system spec

**What was studied.** In-world broadcast systems in the public game
record: radio stations with scheduled programming blocks that
double as gameplay channels (summoning, luck, information), TV
spots that report the player's own deeds back, and phone/news
feeds that carry world state. The common architecture: a *channel
grid* (channel × time block), where each block is a content
generator reading live game state — the medium is a presentation
layer over systems that already exist (spawns, events, discovery).

**Naming — canon sweep discipline.** The region's **display name
is Iridescence**; "Mainframe" is the secret true name and the
production-layer word (two-lane canon: sweep PRs #370/#371;
design brief §2). Everything in this spec is display-layer, so it
is the **Iridescence media system**; production docs may file it
under the region's production name, audience-facing text never
does. Aeon's slip-and-correct behaviour (says "the Mainframe",
corrects to "the mainland") is a *character* beat — media copy in
this system never makes that slip; the system's speakers don't
know.

**Native format — channel grid:**

```
channel { channel_id, kind, blocks[] }
block   { block_id, time_band, generator, state_inputs[] }
```

- `kind` — `broadcast` (scheduled, world-facing) | `feed`
  (personal, Ranger-facing) | `bulletin` (place-bound signage/
  announcement). Kinds are presentation shapes, not technologies;
  the in-world device fiction is **OPEN** (canon names no radio,
  no network brand — none invented here).
- `generator` — the content source, one of: `spawn_report` (reads
  SPAWN-TABLES: what was seen where — feeds #89 tracking rumours),
  `event_echo` (reads #12 flags: deeds reported back),
  `discovery_count` (reads `seen_bits`/`met_bits` popcounts —
  the Mochiioteca counters, species-systems §1.2, as public
  celebration, never naming unmet species), `schedule_notice`
  (reads #93 NPC schedules: who is where, as community notice).
- `state_inputs[]` — the exact systems each block reads. A block
  with no state input is flavour text and must be authored as
  script, not generated — the format forbids a generator with an
  empty input list.

**Canon state, honestly.** No channel, programme, or media
personality is canon. What exists: the display/production naming
split (settled) and the state systems above (built). This spec is
the grid those would plug into; zero channels asserted.

**Wiring.** Pure consumer: reads #12 flags, spawn tables, #93
schedules, discovery bitsets; writes nothing back. Show-side, a
`bulletin` block is a background detail the LIVING-WORLD beds can
carry as distant audio texture — population rules (P1–P5) still
govern: media voices are never principals in their own scene by
accident.

**Coverage.** Architecture: standard and publicly documented.
Contents: none canon; format + naming discipline are the yield.
