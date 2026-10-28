# #38 — CAPTURE MECHANICS (teardown → ORIGINAL Mochiichao capture spec)

**What was studied.** The probability architecture of capture in
the reference games, as publicly documented: a per-species base
rate, modified by the target's remaining vitality, by status, and
by the capture device's tier; the roll resolves as a small number
of staged checks ("shakes") so failure is *legible* — you can see
how close you were. Nothing in this spec copies a device name, a
device look, or any branding from any reference work. The device
below is Mochiichao's own fiction, built on Mochiichao's own canon:
the Garden runs on care, and capture here is an act of *keeping*,
not of taking.

## The Mochiichao fiction (canon-grounded, gaps open)

- The keeper device of record is the **Mochiioteca** (canon name,
  DESIGN-BRIEF §1) — the device Aeon hands over with the partner
  in the opening. The Mochiioteca is the registry and the bond
  record. Whether it is also the capture instrument is **OPEN**
  (DESIGN-BRIEF §8 item 6: the device's physical design is
  undesigned in canon). This spec therefore defines capture in
  terms of a **keeper instrument** role, not a named gadget:
  whatever canon eventually designs, it fills this role and no
  other.
- The act is framed by Rule 12 and the Garden's care loop: a wild
  Mochi is *met*, then *kept* — kept Mochi live in the Garden
  under the Manual's care. The show's EP02 opening is a
  rescue-choosing, not a capture: canon's first bond is given,
  not taken. The capture system governs every bond after that one.
- In-world vocabulary law (THE SECRET, DESIGN-BRIEF §2.6): the
  instrument's fiction and UI copy carry no computer tells and no
  borrowed franchise terms. Terms used in data: `attempt`,
  `kept`, `released`, `bond` — plain words, ours.

## The probability model (native; parameters OPEN)

The roll, per attempt — same staged shape as the documented
reference architecture, all constants ours to set:

```
pBase      = species.catchRate / RATE_SCALE        (RATE_SCALE: OPEN)
pCondition = pBase × vitalityFactor × statusFactor × instrumentTier
checks     = CHECK_COUNT staged Bernoulli(pCheck)   (CHECK_COUNT: OPEN)
kept       = all checks pass
```

- `catchRate` is **already a core data field** (`species.json`;
  the species template carries it as `null` until owner-set —
  null means *not yet capturable in data*, never a default value).
- `vitalityFactor` — a curve over remaining vitality fraction:
  shape (monotonic, bounded) is specified; the curve's constants
  are OPEN.
- `statusFactor` — multiplier by the target's status condition
  (status system is a List-4 item; until it lands, the only legal
  value is the neutral factor, recorded as such).
- `instrumentTier` — multiplier by instrument tier. Tiers are a
  data list, not names in code: `{tierId, multiplier, status}`.
  **No tier instances are asserted** — canon has named no capture
  instruments or items; the list ships empty with the shape ready.
- **Legible failure is a requirement, not an effect:** each staged
  check maps to one visible beat in both lanes (game: check ticks;
  show: the bond nearly settles, then doesn't). A capture that
  fails on check 1 and one that fails on the last check must read
  differently. This is the "shakes" lesson, restated as a staging
  rule.
- **Release is first-class:** a kept Mochi can be released; the
  record persists as *met-and-released* (discovery state stays
  truthful — see wiring). There is no delete.

## The data model — `capture.schema.json`

Two record shapes:

1. **Instrument tier** (data list entry, above).
2. **Capture attempt record** — the audit trail every attempt
   writes, in both lanes:
   `{attemptId, speciesId, areaId, storyBeat, instrumentTier,
   vitalityFractionAtAttempt, statusAtAttempt, checksPassed,
   outcome: kept | released-later | not-kept, status}`.
   The show cites `attemptId` for scripted bonds exactly as it
   cites `encounterId` for rival battles (#37) — outcomes in
   scripts are *declared*, never rolled, and the record says so
   (`status: scripted`).

## Wiring

- Reads: species **`catchRate`** (core data), **spawn tables
  (#7)** for who can be met where, **event flags (#12)** for the
  beat that arms a scripted bond.
- Writes: the **discovery states** the Mochiioteca completion loop
  (**#14**) counts — unseen → seen (met) → kept; release moves
  kept → met-and-released without un-seeing. Footprint media
  unlocks at kept-only, cry at seen/kept (canon registry rules,
  MOCHIIOTECA-FORMATS).
- Show staging of attempts follows the state grammar (#42) and
  scale staging (#43) for the bond beat; the lab (#46) is where a
  first instrument, when canon designs one, gets revealed.

## Coverage — honest

- **Architecture: fully documented.** Base-rate × modifiers ×
  staged checks is the publicly documented capture pattern across
  the reference series; the staged-check legibility rule is its
  best-known design property.
- **Contents: deliberately thin.** Canon supplies the device
  name (Mochiioteca), the care framing, the first-bond exception,
  and `catchRate` as a field with mostly-null values. It supplies
  no instrument designs, no tiers, no constants, and no ruling
  that the Mochiioteca is the capture instrument. Every one of
  those is an OPEN slot in this spec — filling any of them is an
  owner decision, and this package does not pre-fill a single one.
