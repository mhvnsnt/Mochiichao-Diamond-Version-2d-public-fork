# #82 — ANIME ORIGINAL-ARC STRUCTURE → SHOW ARC-PLANNING FORMAT

**What was studied.** How long-running creature anime build
**anime-original arcs** (the "filler arc" grammar, studied as
structure, not as a slur): (1) **placement** — original arcs sit
*between* canon arcs, never inside one; they begin from the status
quo the last canon arc left and must hand back *exactly* that
status quo; (2) **the self-contained cast** — an arc-local
character/place/problem is introduced, developed and resolved
inside the arc, so nothing dangles into canon; (3) **the
conservation rules** — no canon character may gain a permanent
power, partner, item or knowledge inside an original arc; growth
is emotional/experiential only; spotlight rotation gives
under-used cast members the lead without changing their canon
state; (4) **the exit beat** — the final episode restores the
board and re-aims at the next canon arc (a journey beat: the road
onward is the last shot's content).

**Our situation.** The show's canon spine is the season canon map
(game opening, Region 1 / Iridescence, 8 dojos, Elite Four,
Champion Hex, post-game isles). EP01 is locked; EP02–EP05 exist as
packages in the show lane. Original arcs are how the season fills
between dojo beats without touching that spine — this format is
the planning instrument. It plans **no specific arc here**: arc
subjects are story decisions, and canon TBDs are never silently
filled.

## Native spec: `mochiichao/arc-plan/v1`

### The arc-plan record (one file per proposed arc)

```markdown
# ARC-PLAN: <arc id> — <working title, PROPOSED until owner locks>
- span: EP<nn>–EP<nn> (or "unplaced — between <canon beat> and <canon beat>")
- placement anchor: after <canon beat id> / before <canon beat id>
- entry state: <the status quo inherited — quoted from the canon map>
- exit state: <must equal entry state, or name the canon beat that
  legitimately changes it — an original arc may not>
- arc-local material:
  - place: <new or revisited — OPEN until owner approves>
  - guest cast: <arc-local characters — species from the locked
    roster only; humans arc-local or returning>
  - problem: <the arc's question, one line>
- spotlight: <which principal(s) lead — rotation record>
- conservation checklist: (all must be NO)
  - permanent partner/keep gained? 
  - permanent move learned? (show lane: moves are skill — an arc
    may show PRACTICE toward a canon move; mastery lands only
    where canon places it)
  - permanent item/token gained?
  - canon secret revealed early? (THE SECRET discipline applies:
    secret-keepers may slip per canon rules; an original arc
    never advances the secret's reveal schedule)
  - relationship state changed vs canon map?
- species usage: <roster species featured — from sheets; a species'
  first appearance (discovery) is a canon beat, not an arc
  invention, unless the arc is itself the canon introduction>
- production notes: <new locations/props needed vs BANK reuse;
  living-world cycles engaged>
```

### Grammar rules the format enforces

1. **Entry = exit.** The checklist is the gate: an arc plan with
   any conservation item unresolved does not proceed to beat
   sheets.
2. **Discovery is canon.** First meetings with a species
   (Mochiioteca seen/kept beats) belong to the canon spine or to
   owner-ruled introductions; an original arc may feature species
   already discovered, freely.
3. **Dojo order is spine.** Arcs may sit between dojos; they never
   reorder, replace or pre-empt one (route graph gates, #11).
4. **The dread register is rationed.** Dark Forest material
   follows the Forest's own laws (the camera discipline, the
   stopped-thing stays unanswered — "what stopped moving" is an
   open canon question, not an arc reveal). An original arc may
   approach the treeline; it may not answer the Forest.
5. **Length discipline.** Original arcs are planned at 1–4
   episodes; longer proposals must argue why they are not a canon
   arc wearing a false moustache (owner decision).

## Wiring

- **Season canon map / SEASON-CANON-MAP:** placement anchors are
  its beat ids; the arc plan quotes entry state from it.
- **Episode packages:** an approved arc plan spawns episode
  packages in the house format (beat sheet + shooting script +
  storyboard plan + cue sheet) — same as EP02–EP05's shape.
- **Design lane:** arc-local places/props enter the parts catalog
  through the normal gate; arc-local *species* do not exist —
  species come only from the locked roster/sheets.
- **Showcase/Garden systems:** a Garden showcase (#78) or farm arc
  beat (#79) is a natural original-arc citizen — care-register
  arcs that conserve the board by construction.
- **Continuity record:** approved arcs are logged in the show
  production log with their conservation checklist attached, so a
  later audit can verify entry = exit.

## Open slots (not invented)

- Every arc subject, guest and place — none proposed here.
- Season length (how many original arcs the season even wants) —
  standing owner decision from the design brief's open list.
- Whether original arcs may introduce *transplant* cast (the
  transplant programme's landings are canon beats when they
  happen; an arc may feature a transplant only after their canon
  introduction) — stated as a rule proposal, owner to confirm.


**Landing note — List 28 #276 (2026-10-27):** the show lane for the stealing/morale/reputation list lands in 276-SHOW-MORALE-REPUTATION.md: principals' personal bands are carried on this file's arc sheets, a group's standing is staged before the character enters, and unseen deeds are staged as conscience. #276 also records the List 29 forward pointer (items 277–286, the anti-hero arc's structure systems) — a pointer only; nothing of List 29 is built here. The anti-hero's name is the owner's open slot and appears nowhere in the landing.
