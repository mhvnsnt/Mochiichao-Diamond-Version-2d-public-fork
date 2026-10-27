# Balance math spec (Step 5, playtest + balance) — NEW this pass
Source: generic game-balance teaching material found this pass (formulas
are mathematics, no licence applies; no source text copied beyond the
formulas themselves).
- Expected damage = Base x (1 + CritChance x (CritMultiplier - 1)).
  Example from the teaching material: 40 base, 25% crit, x2 crit = 50
  expected — a flat-50 attack and this crit attack are equal on average
  but FEEL different; that feel is a design choice, record it.
- DPS = Damage per Hit x Attacks per Second. Compare within a category
  only (a 100-damage slow attack vs a 20-damage fast attack are not
  comparable by damage alone; the teaching example gives 50 vs 200 DPS).
- Time to Kill = Target HP / Effective DPS. TTK is the best single
  balance number because it connects math to feel: decide first "a basic
  wild should take 2–3 seconds" (lane target to confirm in playtest),
  then work backwards to HP/damage values.
- Workflow rule: one spreadsheet/table row per move with damage, rate,
  crit chance, crit multiplier, expected damage, DPS and TTK against
  2–3 standard targets; change ONE variable at a time and record what
  changed and why. A new move whose DPS is ~40% above its category with
  no drawback is flagged automatically.
Wiring target: Step 5 agent — balance table computed from the lane's own
move data (decomp-derived move powers + lane move DB) and species HP;
never from another game's roster. Gate: every move row has expected
damage, DPS and TTK filled before a balance PR.
