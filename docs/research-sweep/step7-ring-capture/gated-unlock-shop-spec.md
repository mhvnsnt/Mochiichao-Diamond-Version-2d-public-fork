# Gated unlock + shop spec (Step 7, ring-capture zone) — NEW this pass
Status: extends the PR #37 gate with persistence + shop rules. No
mechanic change, no new economy.
- Unlock state (visited + played) persists in the save, not in session
  memory: a player who visited + played, saved, and reloaded must still
  be unlocked. Unlock is per-save, never per-device.
- Shop availability rule: ring items are purchasable in shops ONLY after
  unlock; before unlock the shop does not list them (not "listed but
  greyed out" — absent, so a locked player is never sold a useless item).
- After unlock, ring items are usable whenever (any zone, any time),
  exactly as the standing brief states; the zone is the unlock location,
  not the only use location.
- Pricing hooks (existing spec): standard/sturdy/prime/sure orb tiers
  keep their existing pricing; ring items price as a consumable tier
  above standard orbs (exact numbers are a Step 7 playtest decision,
  not set here — no price is invented in this file).
- Study-only note: commercial ring/throw games found this pass (ring
  toss, pass-through-rings, lasso-style titles) contributed NO mechanic
  here — their rules are either patented game descriptions or
  commercial titles, and nothing from them is staged. The ring mechanic
  in this lane remains Mochiichao's own version from PR #37.
Wiring target: Step 7 agent — save schema (unlock flag), shop inventory
filter, zone spec addendum. Gate: fresh save (locked) -> shop has no ring
items; visited+played save (unlocked) -> shop lists them; reloaded
unlocked save -> still unlocked, items still usable anywhere.
