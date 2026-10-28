# #153 — RARE WEATHER PHENOMENA → the sky, occasionally, does something

**Seat in the doctrine:** #61 built the weather machine
(WEATHER-STATE, a build-manifest global), #67 keyed
behaviour to it, #142 gave each region a climate — a
standing bias over the machine. Ordinary weather is
therefore fully owned. What none of them owns is the
*exception*: the storm that is an event, the aurora the
whole town comes out to watch — phenomena that are rare
by definition, announced, remembered, and (in the show)
worth a scene. This spec is the phenomenon layer: rare
weather as world events, not as more weather.

**What was studied.** Rare phenomena in the publicly
documented record: the reference games' legendary-
weather events (extreme weather as a story signal),
open-world event systems where a phenomenon is a
*scheduled scarcity* (it can be missed; that is what
makes it an event), and the production principle that a
phenomenon is weather plus *witnessing* — it exists
because someone is there to see it. The kit taken: a
phenomenon is a record with conditions, a window, and
an announcement — layered over #61's machine without
adding states to it.

## Native spec — `mochiichao/phenomenon/v1` (fragment beside this doc)

- **A phenomenon record:** `{phenomenonId, name
  (display, #23), class ∈ {storm, aurora, fall, bloom,
  stillness}, conditions {region/climate (#142 refs),
  phase (#19), weather-precondition (#61 states)},
  window, fx (#73 refs), behaviourEcho (#67 refs),
  announcement (#90 channel + copy class)}`. The class
  vocabulary is closed and small; a phenomenon is an
  *occurrence of* weather machinery, so its FX ride
  #73's `AMB-WX-*` cycle entries — a phenomenon with
  bespoke one-off FX plumbing is a defect.
- **Rarity is structural.** A phenomenon fires only
  when its full condition set holds (climate permits,
  phase matches, precondition weather is live). No
  phenomenon has a manual trigger in normal play; the
  system has no "make it happen" verb — authored
  set-pieces that need one declare it as a set-piece
  (the #52 authored-content rule), not as a phenomenon
  firing.
- **Witnessing is the payload.** Phenomena write no
  progression facts by existing. What they write is
  *witness records* — derived from presence (the Ranger
  was in an area under the phenomenon's footprint during
  its window), consumable by #90 media (the town talks
  about it), #104 honours (if the owner ever catalogues
  a witness honour — his slot), and show staging. A
  phenomenon nobody witnessed still happened; the world
  doesn't grade it.
- **The depths exclusion is absolute.** Dark Forest
  depths are weather NONE (#61) — escalation by
  subtraction is the depths' whole grammar, and no
  phenomenon record may name the depths in its footprint
  or conditions. `stillness`-class phenomena belong to
  the Forest's *surface* dread cycle if anywhere — and
  even there, instancing one is a canon act, not a
  content fill: this spec instances none.
- **Show mirror.** A phenomenon in an episode is a
  set-piece the arc must earn under #82 (it may not
  resolve a plot problem — weather is witness, not
  rescue); its announcement grammar (#90) gives the
  show its diegetic foreshadowing channel.

## Open slots (nothing invented)

Every phenomenon's identity, conditions, and window
(the catalogue is empty — phenomena are authored
content) · whether witness records feed any honour
(#104 owner's catalogue) · the `stillness` class's
relationship to the Forest surface dread cycle (a
canon question, recorded, not settled) · per-region
phenomenon eligibility beyond #142 exclusions.


**Landing note — List 32 (2026-10-27):** rare weather phenomena are spectacle staging material for the #308 (lightning) and #313 (ghost) family grammars; List 32 instances no phenomenon here.
