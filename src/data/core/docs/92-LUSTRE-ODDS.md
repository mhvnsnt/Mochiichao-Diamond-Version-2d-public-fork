# #92 — RARITY-ODDS ARCHITECTURE → lustre encounter odds spec (game lane)

**What was studied.** Shiny-odds-class systems in the public
record: a base probability per encounter, modified by *stacked,
auditable* factors (a charm item multiplying the roll count, a
chain/streak counter raising odds within a session, a method
bonus for how the encounter was produced). The documented
architecture's key property: odds are computed by **re-rolling a
hidden variant check N times**, never by editing the creature —
the variant is decided at encounter birth, and everything after
is presentation of a fact already fixed.

**The Mochiichao fact this plugs into.** Lustre is the palette
variant system (battle-presentation BUNDLE-FORMAT-LUSTRE-PROPOSAL):
one palette map per species, derived never drawn, identity locks
(outline/eyes/protected colours) never remapped, game and show
derive the identical lustre from the one map. **This spec changes
none of that.** It is only the game-lane question the proposal
doesn't answer: *how often does an encountered individual carry
the lustre variant?*

**Native spec — odds record (per region/method, data only):**

```
lustre_odds { scope, base_denominator, roll_modifiers[], status }
roll_modifier { kind, rolls_added, condition }
```

- `base_denominator` — the 1-in-N base. **OPEN:** no number is
  canon; the field ships null. (The reference family's historical
  values are public knowledge but they are *their* tuning, not
  ours — copying the famous denominator would be importing a
  number canon hasn't set.)
- `roll_modifiers[].kind` — `charm` (a held/owned item adds
  rolls), `chain` (consecutive encounters of the same species in
  one session add rolls, capped), `method` (encounter source —
  spawn-table method field, world-systems SPAWN-TABLES — carries
  its own modifier). All three kinds ship as vocabulary; **which
  exist in Mochiichao is OPEN** — a modifier kind with no canon
  item/method behind it stays unlisted in any shipped record.
- Resolution: at encounter generation (the spawn roll, not after),
  roll the lustre check `1 + sum(rolls_added)` times; any success
  marks the individual `variant_id: "lustre"` in its record — the
  exact field the bundle format already stamps. From that moment
  the individual *is* lustre in every system: Mochiioteca entry,
  tracking signs (#89 — a lustre's print is the same grid; lustre
  changes palette, never anatomy, per the identity locks), cry
  (unchanged — palette system only).
- **Show lane: no odds.** The show does not roll dice; a lustre
  individual appears when a script says so. This spec is game-lane
  only and says so in its own header wherever it is filed
  (two-lane law).

**Wiring.** Encounter generation: world-systems SPAWN-TABLES roll
sequence gains the lustre check as its final step. Variant
rendering: battle-presentation palette tool + bundle
`palette_variants` block, untouched. Discovery: a lustre
individual still sets the species' `seen/met` bits normally —
lustre is per-individual data, not a second dex entry
(MOCHIIOTECA-COMPLETION's derived counts are unaffected).

**Coverage.** Odds architecture (re-roll model, modifier stack):
fully documented publicly. Contents: all numbers and modifier
existence OPEN — the spec is the machine, canon supplies tuning.
