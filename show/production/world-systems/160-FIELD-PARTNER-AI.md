# #160 — FIELD PARTNER AI → the partner Mochi's behaviour in the field

**Doctrine seat:** the partner in the field is the
follower of #58, grown helpful — not a second player
character and not an AI Ranger. Everything it does is
presentation and indication: it notices, it alerts, it
leads the eye. It sets no flags, collects nothing,
decides nothing the Ranger's own systems own. That
boundary — inherited verbatim from #58 ("reactions read
state; the follower sets none") — is the spec.

**What was studied.** Companion behaviour in the
publicly documented record: following partners who
react to places and weather; exploration partners who
point out tracks, hidden items, and danger (the partner
perceives, the player acts); assistance behaviours in
raising games, where the companion's species and
temperament shape what it notices. The kit taken: one
state machine (#58's), one reaction vocabulary extended
by trigger class, and perception gated by the species'
own behaviour profile (#152) — a wary species notices
differently from a bold one, as presentation, never as
power.

## Native spec — an annex on #58, `mochiichao/field-partner/v1` (fragment beside this doc)

- **No new states.** Assistance behaviours are
  `REACT` entries in #58's per-species reaction set,
  under three proposed trigger classes added to #58's
  trigger vocabulary (the vocabulary is #58's; these
  are proposed into its file, not forked here):
  - `sign:<kind>` — a #89 sign (footprint / frost /
    trace) is present and unread or partially read;
    the partner alerts and moves toward it. The READ
    stays #89's: read gates, freshness, and the
    literacy progression are the Ranger's. The partner
    brings the Ranger to the sign; it does not read it
    for them.
  - `find:<itemClass>` — authored world content in the
    area (a #31 material/care-class item presence)
    exists uncollected; the partner indicates it. The
    partner never creates the item, never collects it,
    and its indication writes nothing — collection is
    the Ranger's act under the item's own rules.
  - `danger:<threatClass>` — the area's stocked
    population (#7) includes a species whose #152 wild
    view makes it a presence worth marking (e.g.
    `threatResponse: charge` at close range); the
    partner's alert is staging — posture, cry (#2's
    domain), position between Ranger and source. It
    changes no encounter probability and no band.
- **Perception is profile-shaped.** Whether and how
  readily a partner fires an assistance trigger reads
  the individual's species profile (#152 wild view:
  `curiosity`, `threatResponse`) as modified by the
  individual's temperament (#108) — presentation
  frequency and flavour only. A partner that fails to
  notice is a character beat, never a lockout: every
  trigger's content is fully available to a Ranger who
  finds it unaided. Assistance can never be the only
  path to anything.
- **Who the partner is.** The PRINCIPAL individual
  under #58's roster-binding (#106 `location.kind`:
  party/garden residence as #58 already reads it). This
  spec proposes no second follower and no rotation
  mid-field; the camp/Garden systems own who is
  present (#134/#58's PARKED rules apply unchanged).
- **Battle adjacency, stated once:** field partner ≠
  battle partner. #157's partner AI is battle-scoped
  and scorer-driven; this system is field-scoped and
  scorer-free. Where the two meet (a partner who
  follows in the field joins a multi battle), each
  system governs its own side of #10's `INTRO` line,
  and the game's between-command presentation law
  (#10: the living field has no write path) covers the
  partner in battle exactly as it covers everyone.

## Show lane

#58 already makes FOLLOW / IDLE / REACT board language
(the xsheet carries the follower's state per cut).
Assistance beats board as REACT entries with the same
trigger classes: Mochiko's partner noticing Frost sign
before she does is the show's own canon shape (#89's
device, staged). The show stages these as autonomous
behaviour — no AI vocabulary crosses into the boards.

## Wiring

State machine, reaction-set home, roster-binding: #58
(trigger classes proposed into its vocabulary);
perception inputs: #152 (wild view) + #108; sign
content: #89; indicated content: #31 items as authored
in areas (#7/#29); cries: #2; show boards: #16/#53
carry REACT as they already do.

## Coverage — honest

- **Architecture: fully specified** (trigger classes,
  perception shaping, the no-flags/no-collection
  boundary, principal-only scope).
- **Instances: zero.** No species' reaction set yet
  carries the assistance triggers — reaction sets are
  content distilled with #152's profiles (a data-lane
  pass, OPEN there too); trigger sensitivity values are
  unset data.

---

**Landing note — List 34 (2026-10-27), citing STAGING step 8.**

#333 companion judgement (`world-systems/333-COMPANION-JUDGEMENT.md`) lands beside this file — the field-partner behaviour seat it reads over. Its affinity read and threshold behaviours derive from WITNESSED List 28 facts only. The partner-departure event class is PROPOSED into #80/#267's homes and lands only there; it is not founded here. Field-partner AI is #160 (not #158, horde battles): the correction registered in List 34's STAGING is carried here.
