# #240 — SAVE-SELECT PRESENTATION → the face of the one-world save

**The gap this fills.** The save itself is settled:
one payload, no region forks, no cycle counter, zero
stored change from the whole connected-world doctrine
(#146 over #96). What the player actually *meets* is a
screen — the save-select. This spec is that screen: what
it shows, where every line on it comes from, and what
it can offer. Two things about it are law before any
design starts: **the summary is a reading, not a
record** (it shows only facts worked out at that
moment and stores nothing), and **there is no
"restart-plus"** — #122's ruling closed NG+ for good
("it's just continue"), so the screen never offers it.

**How Pokémon fills the same gap:** the continue
screen shows the trainer's name, where they are, their
badges, their play time, and how many creatures they've
caught — a postcard of the save, all of it read off the
save's own facts at that moment. Mochiichao's screen is
that postcard, drawn from this programme's derivations.

## Native spec — `mochiichao/save-select/v1` (fragment beside this doc)

- **The summary (every line a live derivation):**
  - **Who:** the Ranger's name (#23 lookup over #98's
    identity) and their partner (#80 reference, drawn
    as the individual — nickname per #239, deviations
    per #80, the portrait rule of #196).
  - **Where:** the current place (the #11 node the
    save's session state names), rendered by lookup —
    and beneath it, the regions visited, from #146's
    visit record (the derived view whose home is #146:
    visited is a reading over #12 flags and encounter
    facts, never a stored list).
  - **How far:** Fragments held (popcount over #12
    progress flags, the #98/#45 derivation), dex counts
    (#14's seen/met derivations).
  - **The world's clock:** the save's world time shown
    as the #19 phase it will resume into (dawn / day /
    dusk / night) with the place's weather read (#61
    through #142, as all weather consumers must) — the
    postcard shows the world as it will be when you
    step back into it.
  - **Time played:** #96's `meta` playtime, the one
    stored number on the screen, shown as stored.
  Nothing else is shown, because nothing else is needed
  to recognise a save — and every addition would be a
  new derivation to keep honest.
- **The two flows, and only two.**
  - **Continue:** load the save; the world resumes as
    the connected world it is (#127's doctrine — no
    crossing ever reset anything, and loading resets
    nothing either).
  - **New Ranger:** begin a new save in a free slot
    (#96's slot id). A new Ranger is a new save — a
    different person starting in Boot Harbor — not the
    old save restarted, and the old save is untouched
    by the offer existing.
  - **Never offered:** any form of restart-plus,
    carry-over, or "start over keeping something". #122
    is closed; the screen's honesty is that it doesn't
    pretend otherwise. If a player wants their first
    Ranger's world again, Continue is where it lives —
    it never went anywhere.
- **Multiple saves:** slots are #96's business (slot id
  in `meta`); each slot's card is drawn by the same
  summary derivation. An empty slot shows as empty —
  the screen invents no placeholder Ranger.

## Wiring

Reads: #96 (payload + `meta`), #98 (identity), #80
(partner), #146 (visit record), #12 (Fragments), #14
(dex counts), #19 + #61/#142 (resumed world state).
Writes: nothing — the screen is a consumer; loading and
creating are #96-runtime acts, not summary acts.

## Open slots

The screen's visual design (layout, art) is production
design, the Persona-grammar layer's business (#10's
grammar family) — not a canon decision parked here.
No owner story/canon slot; no mechanic is left open:
the flows are two, by ruling.

## Coverage — honest

- Summary-from-derivations: the documented continue-
  screen shape, seated entirely on verified
  derivations (#146/#98/#14/#12).
- The no-restart-plus rule is #122's OWNER RULING,
  restated at the one screen where a player would
  look for it.
