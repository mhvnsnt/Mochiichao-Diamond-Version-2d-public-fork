# LANDING STEPS — region4-kit → repo
Target: `show/production/region4-kit/` in
mhvnsnt/Mochiichao-Diamond-Version-2d-fresh-start, one additions-only
PR, branch `feature/region4-kit-1`, DO NOT MERGE (parent reviews).

## Preconditions
1. GitHub API window open (core quota reset 2026-10-28T00:45:05Z was
   the last known wall; verify with one rate-limit check, no retries
   against a closed gate).
2. Build on LIVE main: fetch main's tree first; if
   `show/production/region4-kit/` already exists (a sibling job may
   have landed a same-named folder), stop and report instead of
   overwriting.

## Steps
1. Create branch `feature/region4-kit-1` from live main head.
2. Add all 11 kit files verbatim from ~/workspace/region4-kit/
   (README.md, HOLDINGS-CHECK.md, BAKUGAN-DEEP-USE-MAP.md,
   R4-FLAVOR-LAW.md, REGION-BUILDING-SOURCE-MAP.md,
   AIRSHIP-AND-MILITARY.md, LANDING-STEPS.md,
   sources/bakugan-structure.md, sources/bionicle-structure.md,
   sources/beyblade-structure.md,
   sources/transformers-gundam-evangelion-structure.md).
   Zero deletions, zero edits to existing files except step 3.
3. Production log: append ONE entry to
   show/production/PRODUCTION-LOG-2026-10-27.md built on main's
   CURRENT log content (diff the log's deletions before committing —
   the stale-base trap is documented; append-only, entry = "REGION 4
   KIT — source map + mecha register (owner-directed 2026-10-27):
   holdings verdict (Bakugan repo placeholder; five franchises not
   held), Bakugan deep-use map from public structure, R4 flavor law,
   region-building source map R2–R5 + AIRSHIP-AND-MILITARY design doc
   (owner's airship sentence discharged: the Lord, the Order, the
   flagship; names TBD, six forks listed for the owner).").
4. Open the PR (title: "Region 4 kit: source map + mecha flavor law";
   body: the coordinator's report summary + the holdings verdict
   verbatim + a line noting AIRSHIP-AND-MILITARY.md fills the
   flavor law's pending airship slot on the owner's definition).
   Do not merge.
