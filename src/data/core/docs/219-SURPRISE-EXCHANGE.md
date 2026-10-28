# #219 — SURPRISE EXCHANGE SYSTEM → the blind exchange, fairly pooled

**Seat in the doctrine:** #168 founded the directed
transfer — two known keepers, one known individual,
one seat rewritten. The surprise exchange is the
blind counterpart: a Ranger commits an individual to
an exchange pool **without knowing what returns**, and
receives another Ranger's committed individual in
return. It runs #68's protocol (escrow, atomic
commit) and lands on #168's record semantics
unchanged — blindness is a property of the *matching*,
never of the record: the received individual's full
history arrives with them, legible as always.

**What was studied.** Blind/wonder exchange systems
in the publicly documented record: commit-then-match
pools, the sender's information state (knows their
own commit, nothing of the return), and the known
failure modes — pools flooded with generated or
worthless stock, no-value extraction, signature or
story-critical creatures lost into anonymity. The kit
taken: commit-first matching, pool hygiene by
construction, exclusion by validation rather than by
moderation.

## Native spec — `mochiichao/surprise-exchange/v1` (fragment beside this doc)

- **The commit.** A Ranger escrows one individual to
  the pool (#68's escrow-by-reference; the record is
  escrow-locked exactly as in a directed trade — no
  moves, no release). Commitment is **irreversible
  once matched** and retractable only before matching
  (abort = escrow lifts, nothing changed — #168's
  atomicity). The sender's knowledge state is part of
  the format: the return is drawn from the pool as it
  stands at match time, and no field of the commit
  record names, filters, or preferences the return —
  a surprise exchange with a wishlist is a directed
  trade wearing a blindfold, and the format refuses
  to express it.
- **Fairness by pool construction.** The pool contains
  **only committed individuals** — real #80 records,
  escrowed by real keepers, each carrying its full
  history. **No generated stock exists in the pool:**
  #94's generator (facility parties, seeded, belonging
  to facilities) never mints trade stock, and no other
  generator is seated here. A pool can therefore be
  small, slow, or empty — all honest states the
  interface must show plainly — but it can never be
  padded. Matching is a pairing of two commits; the
  pairing rule (order, timing, cross-region reach via
  #144's world) is a policy slot, OPEN.
- **Abuse exclusions — by validation, not by review.**
  The commit validator refuses, at escrow time:
  - `story_locked` individuals (#68's lock, inherited
    — a partnered/principal individual can never enter
    the pool; this is #106/#68's rule, restated because
    the blind pool is exactly where it matters most);
  - **signature individuals** — any individual whose
    record carries a #131 signature designation (a
    signature is per-species canon made personal; the
    pool is for exchangeable lives, and the format
    names this class so landing implements one check,
    in #131's vocabulary);
  - egg/unhatched states (#68's exclusion, inherited);
  - `species_untradeable` species (values inherited
    OPEN from #68).
  A refusal is legible and final at commit time — the
  pool never holds a record it must later apologise
  for.
- **The return.** On match, both transfers complete
  under #168's semantics simultaneously (each record:
  one seat rewritten, one history entry
  `{met_via: surprise, from, to, beat}` — `surprise`
  proposed into #68's stamp vocabulary in its home).
  The receiver sets `location` on commit (#106 kinds).
  What arrives may be any species, any history, any
  temperament: that is the system's honest offer, and
  the chronicle (#224) and reputation (#201) systems
  never score a Ranger for what the pool gave them.
- **Show lane.** #218 governs: a surprise exchange is
  a system, and the show does not run systems. A story
  may depict a character who *once received* a partner
  by surprise exchange (backstory class, #218) — the
  not-knowing is remembered flavour; no episode stages
  a live blind draw as a mechanic.

## Open slots (nothing invented)

The matching/pairing rule (order, timing, regional
reach) · whether the pool is one world pool or
per-region pools (a #146 save-architecture question —
one world argued by #146's anti-fork discipline, not
decided here) · commit costs, if any exist (a gift is
never purchasable, #217 — a commit fee in currency is
an economy decision for #20, asserted neither way) ·
whether surprise exchange exists as a live feature at
all (inherited #68's design-only state).

## Coverage — honest

- **Architecture: fully documented** — blind matching
  over the verified escrow/semantics stack, hygiene
  and exclusions by construction.
- **Contents: zero** — no pool, no pairing, no match
  is instanced. The yield is a blind exchange that
  cannot be gamed with generated stock and cannot
  swallow a story.
