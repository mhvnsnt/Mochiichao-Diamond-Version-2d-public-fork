# #23 — TEXT / LOCALIZATION ENGINES → game text-engine spec

**Teardown (public documentation, decomp-documented).** The classic
text engine is three layers: (1) **string tables** — all text lives
outside code, addressed by (bank, index) or named id, so writers and
translators never touch the binary; (2) **control codes** inside the
strings — a small inline markup: wait-for-button, pause, clear box,
variable substitution (names, items, numbers), colour/emphasis spans,
and branch hooks that call back into the event system; (3) a
**renderer** — fixed box geometry, glyph-at-a-time reveal with a
per-string speed, and the rule that control codes cost zero reveal
time. Localization readiness is a consequence of layer 1: a locale
is a parallel table with the same ids, plus a text-direction/width
budget the box enforces.

**Native spec — `mochiichao/text/v1`** — pairs with the dialogue kit
(the template library that already landed): the kit holds *what
lines say*; this engine is *how lines are stored, addressed and
rendered*.

- Addressing: every string has a stable id
  (`<region>.<place>.<npc-or-object>.<beat>`, matching the dialogue
  wiring's F-function map ids), stored in per-region table files —
  the shape the game's existing `region{1..5}-dialogue.json` already
  approximates; this spec names the convergence target rather than
  demanding a rewrite.
- Control-code set (closed, small, house-named): `{name}` /
  `{species}` / `{item}` substitution, `[wait]` (button), `[pause:n]`,
  `[clear]`, `[em]` emphasis span, `[rule]` (Manual-rule burn-in
  style — show lane borrows the same token), `[goto:<flag-test>]`
  branch hook into #12 flags. No other codes; new codes need a spec
  amendment, so tables stay portable.
- Renderer contract: box geometry + reveal speeds are engine
  constants; codes execute in zero reveal time; substitution happens
  before reveal so lengths are honest. The Ink opening
  (`region1-truck-start.ink`) is grandfathered: Ink knots are
  addressed by the same ids through the event system's pointer
  fields (world-systems #12 already specifies pointer-only pairing).
- Localization: tables are locale-parallel from day one
  (`tables/<locale>/<region>.json`, `en` canonical); a string id may
  never be deleted, only deprecated — the same stability law as move
  ids under the rename law. Species/move/item **display names are
  data lookups, never literals in strings** — which is what makes
  rename-on-use safe: the string says `{species:147}`, the table
  says Dorowani.
- Show lane borrow: subtitle cards and intertitles use the same id
  discipline and the `[rule]` token, so a Rule line is one artefact
  in both lanes (two-lane law).

**Coverage.** Architecture: fully documented pattern. The control
set and id grammar are house design (PROPOSED as the standard);
migration of the existing five region files onto the grammar is a
data-lane job, scoped but not performed here.
