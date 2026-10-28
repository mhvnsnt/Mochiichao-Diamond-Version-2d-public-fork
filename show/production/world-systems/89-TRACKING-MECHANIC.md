# #89 — TRACKING GAMEPLAY SYSTEMS → tracking mechanic spec (game + show)

**What was studied.** Track-reading as a mechanic in the public
record: footprint-identification systems (the dex footprint itself
began as one), hunting-sim trail reading (sign → direction → age →
identity inference chains), and the adventure-game "follow the
trail" structure where each sign is a placed node the player reads
with a tool or a skill check. The shared architecture: a trail is
a *sequence of sign records*, each sign carries less than the full
answer, and identification is the player's assembly of the chain —
the system never prints the species name at the first print.

**The canon device this serves.** FROST IS CANON (design brief
§Wispkin): Wispkin's nightly trace is a frost path, and **Mochiko
learns to read it** — that learning is a show device. This spec is
that device, formalised once and used by both lanes.

**Native format — a trail is data:**

```
trail { trail_id, layer: "game"|"show", signs[] }
sign  { sign_id, kind, species_ref?, grid?, freshness, read_gate }
```

- `kind` — `footprint` | `frost` | `trace` (species whose sheet
  `foot_type` is `none` leave traces, not prints — the footprint
  system's all-zero bitmap rule, species-systems §1.3, is the same
  fact seen from the other side).
- `grid` — for `footprint` signs, the species' actual
  `footprint_grid` (16×16 1bpp, base64, species-systems
  MOCHIIOTECA-FORMATS §3). The game shows the *real derived print*;
  the player matches it against the Mochiioteca entry — which only
  carries the footprint once the species is kept (discovery
  gating, species-systems §1.2). An unmet species' print is
  therefore genuinely unreadable until the chain teaches it.
- `species_ref` — present in the data, **masked by `read_gate`**:
  the record knows; the presentation doesn't say. Gates are:
  `unread` (sign visible, no info), `partial` (kind + one trait —
  gait or weight class from `footprint_spec`), `read` (identity).
  Progression between gates is the mechanic: game-side by
  discovery state + tracking skill events; show-side by story —
  Mochiko's gates open across episodes as she learns, which is a
  script fact, not a stat.
- `freshness` — sign age band; frost signs invert it (a frost path
  is *freshest at dawn's end* — Wispkin walks at night; canon
  night-keeper behaviour, brief §Wispkin).

**Show wiring.** A show-layer trail is a *blocking document*: the
sign sequence is the path the camera and Mochiko follow, each sign
a beat. The frost path's black-purple spirit-aura (canon) is a
presentation field on the sign, not a kind. Episode scripts cite
`trail_id` instead of re-describing the path.

**Game wiring.** Trail generation reads world-systems SPAWN-TABLES
(which species are present, by habitat class) and the species
sheets' `footprint_spec`/`footprint_grid`; a trail is only laid
for species whose spawn row exists. Discovery bitsets
(`seen_bits`/`met_bits`, species-systems) set the starting
`read_gate` per species.

**Coverage.** Inference-chain architecture: documented across
hunting/tracking titles at the structural level used here.
Contents: the format is complete; the only canon trail is
Wispkin's frost path (show), and no game trail instance is
authored yet — flagged, not filled.
