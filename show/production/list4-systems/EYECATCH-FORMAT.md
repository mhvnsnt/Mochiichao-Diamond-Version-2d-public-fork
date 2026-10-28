# #34 — EYECATCH / BUMPER GRAMMAR → show eyecatch format for the BANK

**What was studied.** The eyecatch as a documented TV form
(Animanga Wiki's production record, already cited in
LIVING-WORLD §1.3): a 2–6 second production-made segment at
segment breaks, part of the programme itself; children's
programmes run longer/more elaborate; some carry world
information the main content doesn't. Plus the bank-system
evidence (Evangelion production study, LIVING-WORLD §1.3):
reuse itself builds place-identity. This package formalises
what LIVING-WORLD already rules in prose into a castable,
manifest-ready format.

## What canon already rules (formalised, not re-decided)

- The eyecatch is **a life shot with a device frame**, not a
  logo card (LIVING-WORLD §1.3).
- EP01's eyecatch-energy beat is the **cut-12 Mochiioteca
  check-in**; from EP02 the eyecatch is **cast from the BANK**:
  a `BR-*` shot + device frame (§2.3).
- **BR-FOREST-01 does not exist** — the Forest gets no B-roll,
  ever. Consequence for this format: **there is no Forest
  eyecatch.** A segment break adjacent to a Forest scene uses
  the *outgoing* location's eyecatch or the device-only form
  (below); you are never eased across the Forest threshold.

## The native format — eyecatch record

Eyecatches are manifest assets, cast per episode like B-roll:

- `eyecatchId` — `EC-<LOCATION>-<nn>` (device-only form:
  `EC-DEVICE-<nn>`)
- `sourceShot` — a BANK id (`BR-*`) or `device-only`; original
  animation is never shot *for* an eyecatch (bank discipline —
  an eyecatch is a casting decision, not a production item)
- `deviceFrame` — the Mochiioteca check-in frame treatment
  (abstract light+icons per EP01 cut 12 until the device's
  physical design locks — the frame is a slot, OPEN by canon)
- `duration` — 2–6s (the documented form); the source shot's
  trim window is recorded, never re-timed invisibly
- `audio` — the source shot's bed slice ships with it (B-roll
  pair rule, §2.4); no eyecatch-specific music exists or is
  commissioned per episode
- `worldInfo` — optional one-line world fact the segment may
  carry (the documented children's-form trait); text follows
  the subtitle law — rationed, owner-ruled lines only; default
  is none
- `pairing` — `{in: <segment it closes>, out: <segment it
  opens>}` per episode manifest; an eyecatch is cast for a
  *pair* of neighbours, not dropped between arbitrary scenes

**Variants:** A-form (into break) and B-form (return from
break) are the same record with `side: A|B`; the B-form may
re-dress (overlay key) but never re-cast — the pair must read
as one place remembered across the break (bank-identity rule).

## Wiring

- **BANK (LIVING-WORLD §2.3)** — stock list gains an eyecatch
  eligibility mark per `BR-*` shot at landing; eligibility is
  a property of the shot (self-contained, no story info), not
  a new asset class.
- **Episode build** — the timing system (#16 xsheets) reserves
  the break slots; the episode manifest cites `eyecatchId`s,
  so an episode's eyecatches are data, auditable like its beds.
- **Timing/audio** — durations ride the existing bed-slice
  exports; the −14 LUFS finish is unchanged.

## Coverage — honest

- **Form: fully documented**, and unusually for this wave,
  most of the *content* rulings already exist in canon
  (LIVING-WORLD). What remains OPEN: the device frame's final
  art (waits on the device design) and the world-info line
  roster (owner-ruled per episode). No instances are cast
  here — casting is per-episode production.
