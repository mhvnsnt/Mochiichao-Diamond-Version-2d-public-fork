# #179 — TRAINING VALUES → the earned layer, applied (completes #39)

**Doctrine seat:** #39 already founded this system's
substance — the per-individual **effort ledger**: typed
accrual from Garden care activities (feeding rounds,
check-ins, work & play, outings, sparring), per-family
and total caps as null data fields, an OPEN `familyMap`
onto the six core stats, and an append-only history
citing #12 flags. #39 also stated its effect in one
unmechanised sentence: effort "only shows as a steeper
growth curve." This package is the missing application
layer — where the ledger enters battle math, and the
law that keeps the earned layer and the rolled layer
(#80) from ever being conflated. **It founds no
accrual, changes no #39 field, and sets no value.** A
second effort system beside #39's would be a fake
join; this is #39, completed.

**What was studied.** Earned-variance systems in the
publicly documented record (the effort-value
architecture): accrued points per stat, hard caps
per-stat and in total, converted into stat growth at a
fixed rate, invisible in the fiction but auditable in
the data — and, load-bearing for us, *separate* from
the rolled per-individual variance, which no amount of
training can alter. The kit taken: the conversion seat,
the cap-bounded contribution, and the two-layer
distinction as a stated law.

## Native spec — application of the effort ledger (record shape in #39; no fragment)

- **The seat in the stat computation.** #17's pipeline
  consumes effective stats in its `base(level, power,
  atk, def)` term. The effective stat is a function of
  four terms, and this spec fixes **which terms exist
  and their order of authority** — not their arithmetic
  (the base formula's constants remain #17's PROPOSED /
  OPEN state):
  1. species base (core data),
  2. level (#178's derivation),
  3. **rolled variance** (#80: seed-derived, 0–15 band),
  4. **earned contribution** (#39's ledger, converted).
- **The conversion.** Per stat, the earned contribution
  is a conversion of `accrued[family]` for the family
  `familyMap` assigns to that stat: a bounded, monotone
  step function of the accrued amount, its domain
  bounded by #39's `perFamilyCap`. The conversion's
  rate/step constants live **with `familyMap` in #39's
  block** and ship OPEN with it — one owner pass sets
  the mapping and its rates together. The contribution
  is computed at read time from the ledger; nothing
  derived is stored back onto the record.
- **Rolled vs earned — the load-bearing table.**

  | | rolled variance (#80) | earned values (#39 + this) |
  |---|---|---|
  | source | the creation roll (`personality_seed`) | accrued care activities |
  | mutability | never re-rolled, never overwritten | grows, append-only, to the caps |
  | audit | the seed itself | `history[]`, each entry citing its #12 flag |
  | ceiling | the 0–15 band | `perFamilyCap` / `totalCap` (data, OPEN) |
  | inheritance | a bounded slice passes at hatch (#80/#77) | **never inherited** — a hatched individual starts at zero accrued; raising is its own |

  Training records can never write the seed, the
  variance block, or `deviations[]`. A fully-raised
  individual and a fresh one of the same species differ
  **only** in the earned term — that sentence is the
  system's testable claim.
- **Battle does not accrue.** #39's founding decision
  governs: effort is "earned in care vocabulary, not
  combat vocabulary." The only combat-adjacent source
  is **sparring**, a Garden activity in #39's own
  table. Landing must not wire battle-end → effort:
  the battle-end channel is #177 gain → #178 level.
  Mochiichao has two growth channels — level
  (battle-earned) and effort (care-earned) — and stats
  read both; conflating them is a defect.
- **The ceiling state.** #39's derived `fullyRaised`
  (total accrued ≥ totalCap, once set) is the earned
  layer's completion: past it, the conversion reads
  the capped ledger and nothing further accrues. The
  state is story-visible in #39's terms; this spec
  adds no second marker.

## Show lane

#39's line stands: the show depicts the care the
ledger counts (feeding, check-ins, play, outings,
sparring as autonomous practice), never the numbers.

## Wiring

Reads #39's ledger block (in the individual record,
#80's home) and #80's variance; feeds #17's stat
computation at the seat above; audit joins #12 via
#39's history. No new store, no new field — the
landing work is the conversion function's seat in the
stat computation and a test of the table's central
claim (same seed, different ledgers → difference only
in the earned term).

## Coverage — honest

- **Architecture: fully documented** (typed ledgers,
  caps, conversion, the rolled/earned split are the
  published effort-training pattern).
- **Contents: conversion constants OPEN**, riding
  #39's `familyMap` slot — set by the same owner pass
  that names the mapping. The yield is the application
  seat and the distinction law; #39's ledger is
  untouched and remains the single accrual source.
