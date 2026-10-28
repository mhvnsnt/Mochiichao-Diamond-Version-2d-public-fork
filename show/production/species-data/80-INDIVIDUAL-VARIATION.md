# #80 — INDIVIDUAL-VARIATION SYSTEMS → INDIVIDUAL VARIATION DATA MODEL

**What was studied.** How the reference games make two members of
one species differ: (1) **hidden per-individual numeric variance**
(the IV architecture: a small bounded integer per stat, rolled at
creation, invisible in the fiction but real in the math); (2)
**personality values** — a per-individual seed from which visible
and semi-visible traits (nature, characteristic, in later systems
size and marks) are *derived*, so one roll drives many reads;
(3) **inheritance** — breeding passes a bounded slice of the
parents' variance to the offspring, so lines drift without ever
leaving the species; (4) the anime's parallel truth: individuals of
a species are drawn mostly alike, with **specific, consistent
deviations** that mark *that* individual — and once established,
the deviation is part of the character.

## The doctrine this model must honour (owner, 2026-10-27)

> **Individual Variation Doctrine:** same-species individuals are
> mostly alike with real deviations (Pokémon/real-animal variation).
> A deviation on a named individual is **character, not error**,
> once the owner rules it so.

Canon instance, on record in MEMORY.md: **the Dorowani species'
eyes are red + black with NO white of the eye (no sclera). Doro —
the avatar/show Dorowani — HAS whites around his eyes.** Owner
ruling: keep him; the whites are *his* personal deviation and must
be kept consistent for him in every future generation of this
character. Other Dorowani follow the species pattern; some
individuals may carry black around the eyes instead, etc.

So the model has two halves, and the doctrine is the seam:

- **Variance** — unmarked, numeric, rolled: the mostly-alike half.
- **Deviations** — marked, visible, *ruled*: the character half.
  A visible deviation that is not in the registry is not "creative
  variation"; it is an **error** (the glossy-batch and eye-drift
  rejections are this failure). A deviation that IS in the registry,
  with its ruling, is **locked character** and generation must
  reproduce it, not "fix" it.

## Native spec: `mochiichao/individual/v1`

One individual record per creature instance (party member, named
NPC's partner, show character). Species data stays on the species
record; this record *references* it and adds only what varies.

```json
{
  "individual_id": "<save/show id>",
  "species": "<core species id>",
  "personality_seed": "<uint32 — rolled once at creation, never re-rolled>",
  "variance": {
    "stats": { "hp": 0, "atk": 0, "def": 0, "spa": 0, "spd": 0, "spe": 0 },
    "size_class": "small | standard | large",
    "temperament_read": "<derived label — see derivation>"
  },
  "deviations": [
    {
      "trait": "<feature path, e.g. eyes.sclera>",
      "species_pattern": "<the species default, quoted from the sheet>",
      "individual_value": "<what THIS individual has>",
      "status": "RULED | PROPOSED | SPECIES-TYPICAL",
      "ruled_by": "Jamar",
      "ruled_on": "2026-10-27",
      "consistency": "MUST REPRODUCE in every generation of this individual",
      "source": "<where the ruling lives — MEMORY.md / canon doc pointer>"
    }
  ]
}
```

### Variance rules

- Each stat variance is a bounded integer **0–15** (half the
  reference architecture's 0–31: our register is "mostly alike",
  so the band is deliberately narrower). Rolled from
  `personality_seed`; never hand-set for unnamed individuals.
- `size_class` derives from the seed (small/standard/large, weighted
  to standard) and must stay inside the species' design-gate
  silhouette tolerance — size variance never rescues or breaks a
  silhouette read (List 5 #43 scale chart consumes `size_class`).
- `temperament_read` derives from the seed and is a *fiction* label
  (how this individual plays in the Garden/show), not a stat
  modifier — the show lane uses it; the game lane may ignore it.
- Variance is **invisible to the design gate**: two individuals of a
  species with different variance produce the *same* model sheet.
  Only `deviations[]` may change what a generator is told.

### Deviation rules (the doctrine, encoded)

1. A deviation entry requires `status: RULED` + `ruled_by` +
   `ruled_on` + `source` before any art, rig or bundle for that
   individual may treat it as input. `PROPOSED` entries are
   discussion records only — generators never read them.
2. **Consistency is directional:** a RULED deviation binds *future*
   generations of that individual (reproduce it exactly). It never
   propagates to the species pattern or to other individuals.
3. Deviations are **feature-level, never palette-level.**
   Canon constraint (Lustre Law, COLOR-SYSTEM): colourways never
   vary per individual — lustre is per-species. An eye-whites
   deviation is a feature; a "bluer Doro" would be a palette change
   and is out of bounds for this system entirely.
4. The species pattern quoted in a deviation entry must match the
   species sheet *as locked*; if the sheet's pattern is itself
   undecided, the deviation cannot be ruled (nothing to deviate
   from) — it waits as PROPOSED.

### Worked example — the one canon case

```json
{
  "individual_id": "doro",
  "species": "dorowani",
  "deviations": [
    {
      "trait": "eyes.sclera",
      "species_pattern": "red + black eyes, NO sclera (species canon)",
      "individual_value": "white sclera present around the eyes",
      "status": "RULED",
      "ruled_by": "Jamar",
      "ruled_on": "2026-10-27",
      "consistency": "MUST REPRODUCE in every generation of this individual",
      "source": "MEMORY.md — Dorowani eye canon + Individual Variation Doctrine"
    }
  ]
}
```

### Inheritance (consumed from #77)

At hatch, the offspring's `personality_seed` is fresh-rolled, then a
**bounded slice** of parental variance overwrites it: up to **3**
stat variances are inherited (one parent contributes up to 2, the
other up to 1 — the reference architecture's bounded pass, narrowed
to our band). Deviations are **never inherited**: a deviation is a
ruling about a person, not a gene. If an offspring is later to carry
a similar trait, it needs its own ruling.

## Wiring

- **Species data system:** the model consumes the species sheet's
  locked pattern fields (eyes, palette locks, silhouette) — it adds
  no species fields. Pairs with Sideline A's gap-fill: nothing in
  the 49 sheets changes.
- **Egg system (#77):** `inherited.variation_seed` is exactly the
  bounded slice above; the egg record stays ignorant of the details.
- **Art/animation lanes:** generators and rigs for a *named*
  individual read `deviations[status=RULED]` as mandatory input,
  with the same standing as the model sheet (Likeness Law). The
  style gate gains one check: *unregistered visible deviation =
  fail; registered deviation missing = fail.*
- **Cry system:** cries are species-level (Sideline D cry synth
  parameterises per species); individual cry pitch offset MAY derive
  from `personality_seed` within a narrow band — proposed here,
  marked PROPOSED until the cry lane rules it.
- **Game save layer:** `individual_id` + seed + variance are save
  data; deviations for game individuals follow the same registry
  (a player's partner can earn a RULED deviation only by owner
  ruling — in practice this serves named/story individuals).

## Open slots (not invented)

- The registry's repo home (proposed in STAGING) — until it lands,
  MEMORY.md remains the ruling record of the one canon case.
- Whether `temperament_read` gets a fixed vocabulary or stays
  free-text per sheet — lane call.
- The cry-pitch-offset proposal — unruled.
- Any second canon deviation — none exists; none is drafted here.

**Derived view registered (List 12 #108, 2026-10-27):** the personality/temperament system (`src/data/core/docs/108-PERSONALITY-SYSTEM.md`) reads this record's personality_seed / variance / temperament_read as a DERIVED view — no new roll, no schema fork.

**PROPOSAL from List 17 #162 (registered at its landing, 2026-10-27):** a `presentation.groomedUntil` field on the individual record, written by #162's grooming services. Until this home accepts it, the presentation state is SPEC-LEVEL.

**Citation (List 24 #228, landing 2026-10-27):** evolution-sequence record timing per 228-EVOLUTION-SEQUENCE.md — the record update lands REVEAL-timed, and a cancelled sequence writes nothing.


**PROPOSAL from List 28 #273 (registered at its landing, 2026-10-27):** two fields on this file's individual record: `keepingState` (how the individual is currently kept — including the stolen states #273 defines) and `trueKeeper` (the keeper the record itself regards as its own, through a theft). Obedience's reads of them run through #98's tiers and #39's bond values as *reads*, under #180's law — no new store is proposed. Proposal discipline: the fields take effect only as carried here; the ruled-deviation register above is untouched by this proposal (keeping state is circumstance, not a deviation).
