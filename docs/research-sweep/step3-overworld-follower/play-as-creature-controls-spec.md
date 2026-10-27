# Play-as-creature controls spec (Step 3 + Creature Mode lane) — NEW this pass
Source: public write-ups of commercial monster-taming / action-RPG titles
found this pass — STUDY-ONLY for those titles (their code, art, names,
sounds and dialogue are NOT staged and NOT copied). Only the generic
control mechanics below, restated in this lane's terms, are adopted.
Generic mechanics (technique, not any one game's property):
- Mid-fight character swap with no cooldown, so staging characters before
  a fight and swapping mid-fight are both viable tactics.
- The controlled creature fights with ITS OWN real move data and stats
  (this matches the existing FIGHT-AS-CREATURE-SPEC, PR #37 lineage) —
  possession/swap must never be a cosmetic skin over the human's moves.
- Positional combat: flying body plans avoid ground-targeted attacks but
  are weaker to ranged attacks; melee vs ranged vs support roles differ.
- Ultimate / charged attacks: a meter that charges during battle and is
  spent on one big attack, separate from the normal move cooldowns.
- Dodge as positioning, not invincibility: timing + position decide
  whether a hit lands; a dodge with no invincibility frames must still
  move the creature out of the attack's area.
- Dual-character orders (secondary pattern): the non-controlled partner
  keeps acting on issued move/attack orders while the player drives the
  main character — for later, after single-creature control is proven.
Licence/status: commercial titles = study-only, nothing staged from them.
Wiring target: Step 3 agent for overworld movement + Creature Mode lane
for real-time combat; turn-based battle (Step 2) is untouched by this spec.
Gate: swapping control between two creatures mid-fight keeps each
creature's own HP, moves and cooldowns intact, and the swapped-out
creature does not freeze in place with a stale animation.
Slots #047–#146: nothing designed or named here.
