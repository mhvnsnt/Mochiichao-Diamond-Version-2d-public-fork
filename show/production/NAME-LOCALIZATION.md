# 55 — SPECIES-NAME LOCALIZATION PREP (name-adaptation pipeline)

Teardown List 6, item 55. Native prep format for Jamar's
Mochiichao project. Sources: the publicly documented *process* of
creature-name adaptation across locales (pun/portmanteau analysis,
sound-first checking, taboo/collision screening — as described in
published localization scholarship and practitioner accounts).
No franchise's name lists are reproduced; Mochiichao names are the
owner's originals, and this format prepares *them* for adaptation.

**Display-name law awareness (governing):** internal ids NEVER
change; display names are the adaptable layer (canon naming laws;
move rename-on-use precedent). Localization therefore touches
*only* display-name records — wiring cannot break, by construction.

---

## 1. Teardown — how name adaptation actually proceeds

Documented pipeline, generalised:

1. **Parse the source name** into its working parts: etymology
   (the animal/object/concept roots), the pun or portmanteau joint,
   syllable count and stress, and its sound character (hard/soft,
   cute/fierce register) — because what gets adapted is the *effect*,
   not the spelling.
2. **Screen before creating:** collision checks against existing
   creature names in the target market's franchises, ordinary-word
   meanings, and taboo/embarrassment readings in the target language.
3. **Draft per locale with the same recipe:** rebuild the pun from
   target-language roots, match syllable count ±1 and stress where
   possible, keep the register (a fierce name stays fierce).
4. **Record everything:** an adapted name without its rationale
   record cannot be maintained; the record *is* the deliverable
   that lets future species be adapted consistently (shared roots
   stay shared across a line — evolution lines keep a name thread).

## 2. Native format — per-species localization record

Lives in the species sheet's name block (extends NEW-SPECIES-SHEET-
TEMPLATE's `name` field; the sheet stays the single source):

```
name_record: {
  id:              <stable species id — never localized, never renamed>
  display_name:    <current canon display name>       // source of truth
  etymology:       [ { root: "…", gloss: "…" } ],     // owner/lane-authored at intake
  pun_joint:       "where the roots fuse + the joke/idea carried" | null,
  syllables:       n,  stress: "…",
  register:        cute | cool | fierce | eerie | comic | OPEN,
  sound_notes:     "phonetic character to preserve (e.g. plosive-heavy)",
  line_thread:     <shared root across the evolution line> | null,
  screens: { franchise_collision: pass|flag, ordinary_word: pass|flag,
             notes: "…" },
  locales: {       // per-locale slots — ALL OPEN until a locale is commissioned
    <locale>: { adapted_name: OPEN, adapter: null, rationale: null,
                status: "not_commissioned" }
  }
}
```

## 3. House rules

- **L1 — Etymology at intake.** New species get `etymology` +
  `pun_joint` filled at Gate 0/Gate 1 (while the owner locks the
  name) — retrofitting etymology after the fact is how name threads
  get lost. Existing roster: etymology fields are **TBD** (register
  in TBD-REGISTER), never reverse-guessed into canon.
- **L2 — The line thread is law.** If stages share a root, every
  locale adaptation must preserve a shared thread; an adaptation
  that breaks the thread is rejected at review, however good it is
  alone.
- **L3 — Signature/display consistency.** The same record governs
  species names everywhere they surface (game, show subtitles,
  packaging #54, cards #36): one adapted name per locale, all lanes.
- **L4 — Moves later, same machine.** Move display names (rename
  law) can reuse this record shape when move localization is
  commissioned; not in scope now, format reserved.
- **L5 — Nothing ships uncommissioned.** A locale slot at
  `not_commissioned` displays the canon source name — never a
  machine guess, never an unreviewed draft (TBD discipline).

## 4. Wiring points

- Species-sheet template: `name` becomes `name_record` (additive;
  existing sheets gain the block with etymology TBD at landing).
- Design lane: etymology/root fields double as design input (a
  name's roots are motif leads — already informal practice; the
  record makes it explicit).
- Registries: cast.json / species records carry `display_name` as
  today; localization records ride in the sheet, exported per
  locale at build time.

## 5. Coverage notes

The adaptation *process* (parse → screen → rebuild → record) is
well documented in localization literature and practitioner
writing — high confidence as process. Zero locale adaptations are
produced here: no locale is commissioned, and producing unvetted
names in languages the lane hasn't screened would violate the
pipeline's own step 2. Etymology of the existing roster is
owner/lane knowledge — left TBD rather than reconstructed.
