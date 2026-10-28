# #175 — WEATHER-TRIGGERED FORMES → a criterion kind on #130's axis

**Seat in the doctrine:** #130 built the forme axis —
the third form axis, never to be merged with #40's
regional variants or #15's lustre — and gave it a
closed criterion vocabulary: `move-use | state | held
| command`. Weather-triggered formes are **not a new
axis and not a new forme system**: they are one new
criterion *kind* on #130's axis, proposed into #130's
vocabulary in #130's home (the proposal discipline —
this package states the kind's semantics; the
vocabulary edit lands only in #130's file, citing this
package). Everything else about formes — `formFamily`
on the species record, deltas listed only where they
change, the #9 presentation hook, forms-met folding
into the species' dex entry — stays #130's, untouched.

**What was studied.** Weather-form mechanics in the
publicly documented record: the canonical case is a
creature whose battle body follows the sky — one form
per weather state, shifting as the weather shifts,
reverting when it clears — where the forme is a *read
of the world*, not a decision anyone stores. The kit
taken: criterion as pure function of world state;
reversion by the same function, not by an undo. No
species, form designs, or stat lines are copied.

## Native spec — the `weather` criterion kind (proposed into #130)

- **The kind:** `{kind: weather, weatherState,
  direction: reversible}` where `weatherState` ∈
  **#61's vocabulary minus NONE**:
  `CLEAR | OVERCAST | RAIN | STORM | MIST | FROST`.
  While the *effective* weather matches the family's
  declared state, the individual carries the weather
  forme; when it stops matching, they don't. Effective
  weather means #61's producer output **filtered
  through #142's climate** — consumers read through
  the climate, never around it (#142's rule,
  inherited).
- **Read-time; stored nowhere.** The active forme
  under a weather criterion is a pure function of
  (family rule, current effective weather), evaluated
  when read. #130 holds `forme` as *battle state*; a
  weather forme's value at battle entry is computed
  from the weather at battle start, and re-evaluated
  if the weather changes mid-battle (weather change is
  a #61/#67 state event — the forme follows the state;
  it does not latch). No save field is written, no
  roster record changes: **reversion is automatic
  because there is nothing stored to revert.** This is
  deliberately stricter than #130's `persistAfterBattle`
  per-family question — a weather family does not get
  to persist, because persistence would contradict the
  criterion's meaning. (A family wanting weather-entry
  *plus* persistence is asking for a criterion pairing
  that doesn't exist; that is an owner ruling, not
  this proposal.)
- **The depths clause — stated, not special-cased.**
  The Dark Forest depths are weather **NONE** (#61's
  escalation-by-subtraction; #142's hard exclusion).
  NONE is excluded from the kind's input alphabet —
  a criterion naming NONE is a **schema error**, because
  NONE means the weather system is *off*, and a forme
  cannot trigger on a system being off. It follows
  without any exception table that **no weather forme
  can ever trigger in the depths** — and the same logic
  covers any future NONE place with no new rules. The
  exclusion is a property of the alphabet, not a patch
  on the Forest.
- **Form data is #130's, and none is asserted.** A
  weather pairing lives in a family's `formFamily`
  entry with #130's delta discipline (only what
  changes is listed; zero deltas asserted here). **No
  weather-forme family is instanced**: whether
  Strikechamp's `unsuited` / `unsuited_full` — the one
  canon family — has any weather relationship is OPEN,
  and nothing in its canon (which fixes existence only)
  suggests one. FROST as a trigger state is flagged,
  not decided: FROST in canon is a *trace* phenomenon
  (Wispkin's nightly trace, #61) — a family keyed to it
  would be keyed to a trace, and whether that is a
  weather read or a #41 presentation matter is an
  owner/design question.

## Wiring (proposed)

Criterion vocabulary edit → #130's file only. Reads:
#61 producer, #142 climate filter, #130 family data,
#9 shift performances. Writes: nothing — battle-state
`forme` is computed, per above. Save impact: none, by
construction.

## Open slots (nothing invented)

The kind's acceptance into #130's vocabulary (the
proposal itself) · every family's weather pairing and
deltas · the FROST question above · whether mid-battle
weather change is frequent enough for the re-evaluation
rule to matter in play (a #67/#18 consumption
question) · any second canon form family (existence
itself is design content, #130).
