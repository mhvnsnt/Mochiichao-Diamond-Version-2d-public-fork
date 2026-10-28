# LANDING RECORD — List 28 (items 267–276), 2026-10-27

This record is the landing lane's own account of the List 28 landing.
(The package's STAGING.md was not carried into the repo in this
landing: the coordinator's read of it was flagged by a safety check,
so the landing was executed from the owner's brief for the list —
both lanes wired, revisions written into the older files, drafted
data flagged as drafted, the steal-confirmation addendum landed with
#268/#269 — and from direct inspection of the repo files themselves.
Whether the package's STAGING.md itself should also land is the
owner's call.)

## Where things went

- `src/data/core/docs/` — 267, 269, 270, 271, 275 + their fragments
  (the game-data shelf, beside #106/#168 whose records they revise
  and extend).
- `show/production/battle/` — 268, 273 + their fragments (the real
  battle shelf; no `battle-systems/` folder exists in this repo).
- `show/production/world-systems/` — 272, 274 + their fragments, and
  this record.
- `show/production/` — 276 + its fragment, the research sources
  (as `list28-RESEARCH-SOURCES.md`), and the package index
  (`list28-systems-INDEX.md`).

## Wiring applied

- **#106 revised in its own file** (106-MOCHI-STORAGE.md): a dated
  revision section records that `location.kind` gains `wild`,
  release is a state change and not a deletion, the tombstone model
  is superseded (the append-only history entry now points at a
  living wild record), and the "permanent / no return" statements
  are corrected under the owner's 2026-10-27 ruling. The story-lock
  and the dex-permanence paragraphs stand unchanged — #267 verifies
  both still true under the new model.
- **#211 revised in its own file** (211-RELEASE-FAREWELL.md): a
  dated revision section completes the note the List 22 landing
  appended. The farewell presentation grammar stands entire
  (act-as-place; departure completes, then the record writes) — the
  record now writes a release entry instead of a deletion. The
  doctrine-seat claim that #106's model "does not change by a
  single field" is corrected (it changed by exactly the `wild`
  value and the release semantics). The lanes-split is rewritten
  per #267: both lanes hold that the individual continues, wild,
  with record continuity; the List 22 note's "show side stands as
  authored casting, not harmonised" is superseded by that ruling.
- **#201 superseded in its own file** (201-RANGER-REPUTATION.md): a
  dated completion of the List 21 supersession note, with the
  mapping table appended — #201's class output re-issued as a view:
  each class is a band range on #271's ladder with #270's
  fame-band × infamy-band tally shape; its input list is replaced
  by #270's witnessed-deed tallies; its derived-never-stored and
  never-currency laws are recorded as inherited by #270 verbatim.
  No #201 text was deleted; the file stands as history with the
  notes on top.
- **Proposals seated only in their owners' files, each cited:**
  the `theft` / `recovered` / `returned` history kinds → #168's
  transfer-history family (from #267/#268/#273); `keepingState` +
  `trueKeeper` → #80's individual model (from #273); the
  witness-ceiling refusal → #38's capture spec as a pre-roll
  evaluation beside the owned-block (from #268). The snag-class
  item flag's proposed home (#31's item registry) could not be
  confirmed in this pass — it is recorded here as UNVERIFIED and
  lives in #268's spec as a proposal, nowhere else.
- **The deed ledger's seat is recorded in #98's file:** #269's
  ledger (append-only deed entries) seats in the licence-record
  family beside #230's findings. #230's file records that its
  findings gain #272's landed reports as a grounds source (cited,
  not duplicated). Morale, reputation tallies, and wanted level
  are derivations over deeds, reports, and history — the landing
  was grep-checked for any stored field of the three; none exists.
- **The steal-confirmation addendum landed with the package:** the
  owner's prompt ("Are you sure you want to try and steal this
  person's Mochi?"), the free decline (No writes nothing), the
  attempted-theft ledger entry on Yes, and the rescue-shaped prompt
  against a closed-heart Mochi are in 268-SNAG-SYSTEM.md and
  269-MORALE-HONOR.md as written, with the `confirmationGate` field
  in snag-fragment.json.
- **Both lanes wired, per the owner's confirmation:** every item's
  game row and show row are stated in the package index; #276 is
  the list's show lane entire, with reciprocal notes in #82's and
  #136's files. #276's List 29 reference is a forward pointer only
  — nothing of List 29 is built or summarised here.
- Reciprocal one-line landing notes also landed in #99, #169,
  #180, #93, #164, #89, #109, and #118's files.

## Drafted data — flagged, not canon

Band names and wanted-level names are drafted vocabulary (renamable
by the owner); deed values, decay rates, thresholds, and weights
are drafted system data. They land as data with their draft labels
intact, per the package's own wording. The anti-hero's name exists
nowhere in this landing (grep-checked) — it is the owner's open
slot, as is the Dojo 8 Syndicate boss's name, carried open from #99.

## UNVERIFIED targets

- Game engine / runtime code (battle executor, encounter generator,
  save runtime): these specs' runtime behaviours are spec-level
  obligations on a future engine; no PR may describe them as
  working behaviour.
- Cross-player transport: the released-individual record shape is
  fixed against #146's one-world save and #168's provenance; no
  multiplayer layer exists in the repo, so catching by another
  player is designed at the world-pool data layer only.
- #31's item-registry home (the snag-class flag's seat).
- #164's band-gated posting contents and the black-market contents:
  kinds verified closed; the contents are unbuilt data passes.
