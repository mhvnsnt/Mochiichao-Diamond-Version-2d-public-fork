# #95 — SFX PITCH/VARIATION ENGINES → SFX variation layer spec

**What was studied.** Variation engines in the public game-audio
record: the middleware pattern (Wwise/FMOD-class, documented
openly) of *containers* — a logical sound maps to a set of takes
plus a randomisation layer (pitch range, volume range, no-repeat
window) so a repeated event never sounds identical twice; and the
older hardware pattern underneath it: one stored sample, playback
rate as the variation. Both layers exist because repetition is
what gives a sound away as a recording.

**Pairs with the cry synth (species-systems CRY-SYNTH).** The
synth already *parameterises* cries — a cry is a parameter block
(`base, pitch, length`, family-shared base with per-species
offsets), rendered deterministically and seeded. This spec adds
the layer the synth deliberately didn't: **performance-time
variation around the locked cry**, without touching the cry's
identity.

**Native spec — the variation envelope (per sound class):**

```
variation { class, pitch_jitter_st, gain_jitter_db,
            take_window, identity_floor }
```

- **Classes, not sounds.** Envelopes attach to classes:
  `cry-idle`, `cry-action`, `cry-hurt`, `footstep`, `ui`,
  `ambient-spot`. A species never carries its own envelope — the
  class system is what keeps 124+ species' audio coherent.
- `pitch_jitter_st` — semitone range, **asymmetric by class and
  small**: cries jitter in *cents-class* amounts (guideline
  ±35 cents for `cry-idle`), footsteps more, UI least. The exact
  numbers are mix decisions — the spec fixes the *shape* (class
  table, one row per class) and marks values PROPOSED until the
  audio gate passes them.
- `identity_floor` — the invariant: variation may never cross
  into another species' cry identity. Because family members
  share a base cry differentiated by (pitch, length), the floor
  is computed: jitter range must stay under half the distance to
  the nearest sibling's pitch offset in the same family. The
  synth's parameter table is the input; if a family's spacing is
  tighter than the class jitter, the family wins and the jitter
  clamps — stated as a rule here so no mix pass has to rediscover
  it.
- `take_window` — no-repeat rule for sampled classes (footsteps,
  spots): the same take may not recur within N plays.
- **Determinism where it matters.** Show audio is *rendered*, so
  variation there is a mix-time choice, baked and gated like
  every bed (−14 LUFS finish, audio-timing package). Game audio
  is runtime, so the envelope is runtime data with a seeded RNG —
  the same seed discipline as #94: a replayed scene sounds the
  same. One spec, two bindings, stated per class.
- **Cries at a distance** (LIVING-WORLD's SFX-CRY-DIST: ambient
  crossings carry distant cries) use `cry-idle` with an added
  distance row (low-pass + gain by focus class) — the envelope
  composes with the population class, it doesn't fork it.

**Wiring.** Cry side: species-systems `tools/cry_synth.py`
renders the locked cry; this layer never re-renders identity, it
jitters performance. Library side: List 6 #51 SFX taxonomy names
the classes this spec binds to — taxonomy is the shelf, this is
the playback rule. Timing side: audio-timing MUS stem system —
EVENT-lane spots declare their class; the envelope travels with
the stem manifest.

**Coverage.** Middleware container pattern: fully documented.
The identity-floor rule is native (derived from our synth's
family structure — it has no source-franchise counterpart because
their cries are samples, ours are parameters). Class values:
PROPOSED, pending the first gated mix that exercises them.
