# #318 — THE RULED-DEVIATION REGISTER → one index of every exception the owner has personally ruled

**The gap this fills.** #80 already stores a ruled
deviation where it belongs — in the individual's own
record, as a `deviations[]` entry with `status:
RULED`, the ruling's date, and the consistency order
"MUST REPRODUCE in every generation of this
individual." What #80 does not give the programme is
the **view across individuals**: the one place a
casting director, a portrait artist, or an encounter
designer can look and see *every* exception that
exists, so none is forgotten, "fixed," or
accidentally handed to a second individual. This
spec founds that view. It is an **index, not a
second store** — every entry points at the #80
record that owns the fact.

**The doctrine (owner, standing).** Same-species
individuals are mostly alike with real deviations;
a deviation on a **named** individual, once the
owner rules it, is **character, not error** (#80's
doctrine seat). The register is that doctrine's
table of contents.

## Native spec — `mochiichao/deviation-register/v1` (fragment beside this doc)

- **Entry form (closed):** `{individual, species,
  trait, speciesPattern, individualValue,
  ownersWords, ruledOn, home}` —
  - `individual` — the #80 `individual_id` of the
    named individual (the record that carries the
    full `deviations[]` entry).
  - `trait` / `speciesPattern` / `individualValue` —
    copied verbatim from the #80 entry; the register
    never paraphrases the fact it indexes.
  - `ownersWords` — a pointer to where the ruling
    lives (the canon doc / MEMORY entry), in #80's
    `source` field's idiom. The register quotes the
    pointer, not a summary: a ruling is the owner's
    words, and a summary of them is how rulings
    drift.
  - `home` — the #80 record's seat (save record /
    show cast record), so a consumer lands on the
    owning record in one step.
- **The register's contents at founding (three,
  all owner-ruled 2026-10-27):**
  1. **Doro** (Dorowani) — `eyes.sclera`: species
     pattern is red + black eyes with **no** sclera;
     Doro **has** whites, kept in every generation
     of him (#80's worked example — the register's
     first entry by seniority).
  2. **The bipedal Kittember** — posture: the
     species default is quadrupedal; this one
     individual — the grey canon-pass Kittember, a
     named cast member — stands bipedal. (The black
     quadruped is a different, ordinary individual
     and is *not* a deviation: it follows the
     species pattern.)
  3. **The maskless Verdilance** — `face-cover`
     **absence**: the species standard carries the
     grown mouth-shield (#317); this one individual
     has no face mask at all. The register's first
     **absence-class** deviation — the trait is a
     part the individual *lacks*, which is why the
     entry's `individualValue` reads as an absence
     and #325's fidelity must render the lack, not
     quietly restore the standard part.
- **Binding, every lane.** A register entry binds
  portraits (#196 — whose own law already orders
  ruled deviations reproduced), encounter design
  (#323 standouts are read against it), casting
  (#326), rigs and generation (a generator told to
  draw a registered individual is told the
  deviation, in the entry's words — #80 rule 1).
  There is no lane in which a registered deviation
  is optional presentation.
- **The fence — deviations are ruled, never
  generated.** Entries are created by **owner
  ruling only**. #322's variation generator may not
  mint a register-class deviation: its table holds
  no absence-of-part entries, no posture-class
  changes, no feature the register's form could
  describe. A generated individual who *looks* like
  a candidate for the register is an unnamed
  individual with generated variation (#322) until
  the owner names and rules — the register has no
  intake but a ruling. `PROPOSED` entries (#80's
  status) live in the individual's record as
  discussion, and appear in the register **never**:
  the register indexes rulings, not conversations.

## Show lane

Casting and boards read the register as the cast's
exception sheet: three lines that keep three
characters themselves across every artist who draws
them. A board that "corrects" a registered deviation
has made a continuity error of the #53 class.

## Wiring

Register is a compiled view over #80 `deviations[]`
entries with `status: RULED`, seated beside #80's
package; consumers: #196, #322 (reads it as its
exclusion list), #323, #325, #326, #9/#53 continuity.
Writes: the register itself writes nothing to any
record — a new ruling lands in #80's record first,
and the register re-compiles.

## Open slots

Story/canon facts only: future entries, entire —
each is an owner ruling about a named individual,
arriving when the owner makes it. The register
founding with three entries is a fact of 2026-10-27,
not a quota.

## Coverage — honest

- Architecture: entry form, the index-not-store
  discipline, the binding list, and the generation
  fence — complete.
- Contents: the three founding entries are the
  three ruled deviations on record in canon at this
  build (Doro verified in #80's own worked example;
  the Kittember and Verdilance entries rest on the
  owner's 2026-10-27 rulings as recorded in canon).
