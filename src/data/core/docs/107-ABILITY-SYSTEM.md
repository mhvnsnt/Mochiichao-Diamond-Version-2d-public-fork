# #107 — ABILITY SYSTEMS → ability system architecture

**What was studied.** The ability architecture of the reference
games, as publicly documented (encyclopaedic documentation and
the decomp literature): a species carries a small fixed set of
**ability slots** — typically one or two regular slots plus a
rarer hidden slot — and an ability is a passive trait record
with a **trigger point** in the battle sequence (on entry, on
dealing/taking a hit, at turn end, when weather changes, as a
standing stat modifier) plus, for some records, a **field
effect** outside battle (encounter-rate influence, traversal,
care-adjacent effects). The load-bearing properties: abilities
live in their **own registry** keyed by id; species records
only *point* at registry entries; and the battle/field split
is per-record data, not two systems.

## The real-code anchor (verified, not assumed)

The species record **already carries the slots**. Per the
read-only repo audit (`species-data-system/
AUDIT-WHAT-EXISTS.md`, against `main`): `src/data/core/
species.json` records hold `abilities` and `hiddenAbility`
fields, governed by `src/data/core/schemas/species.schema.json`
— and the core README's own coverage line reads
**abilities/eggGroups 0/47 (empty, owed)**. So this system is
the missing *referent* for fields that exist. It changes no
species schema, and — the discipline the core README sets and
this package follows — **it asserts zero abilities and zero
assignments.** A registry shape with no contents is the honest
yield for a field canon has left empty; the first assignment
is owner/lane work (#77's egg system is the same posture: the
system behind an empty field, contents owed).

## Native format — the ability registry

One registry beside the core data; species records keep
pointing at it by id (fragment beside this doc):

```
ability { abilityId, displayName, triggerClass,
          battle: {...} | null, field: {...} | null, status }
```

- `abilityId` — stable kebab key; `displayName` is a separate
  #23 text-engine lookup (rename law: names are never the key).
- `triggerClass` — closed vocabulary, the documented trigger
  points natively named: `entry` (on entering battle) ·
  `on-dealt` / `on-taken` (hit resolution) · `turn-end` ·
  `weather-react` (reads #19 world-state weather ids) ·
  `standing` (passive modifier while present) · `field-only`
  (no battle trigger at all).
- `battle` — the effect as a hook into systems that exist:
  damage hooks name a **stage** of #17's staged damage pipeline
  (the pipeline is where modifiers compose; abilities never
  carry their own damage math), status hooks name #27 condition
  ids or immunity classes, weather hooks name #19 state ids.
  All parameter values ship `null`.
- `field` — the effect as a hook into field systems: spawn
  influence joins the **shared roll-modifier interface** with
  #112 (an ability and a lure item speak the same transform
  language to the #7 roll; neither edits a table), care hooks
  name #28 activity ids. Mechanism only — no field effect is
  instanced.
- `status` — core provenance convention (`canon: <source>` /
  `seed` / `provisional` / `OPEN`).

**The individual side.** Which slot an individual carries is a
fact about the *individual*, so it belongs on the individual
record (#80, `mochiichao/individual/v1`) as a proposed
`abilitySlot: regular-1 | regular-2 | hidden` field. This
package **proposes** the field in the fragment; it does not
edit #80's spec — the registration is landing's, flagged in
STAGING.md. How a hidden slot unlocks (breeding, event, never)
is **OPEN** — no canon source rules it.

## Show lane

Abilities are never announced. Creatures are cries-only (voice
law), so an ability in the show is **behaviour the audience
reads**: staged through #9 animscript performance blocks (the
class/anatomy variance system already carries how a body does a
thing) and the #47 battle-field presentation. There is no
ability callout, no UI chime, no name card. If an ability's
battle hook would change a show fight's *outcome*, the battle
doctrine governs: show fights are autonomous-action; data hooks
describe the game lane's resolution only.

## Wiring

- Species side: **no schema change** — `species.schema.json`
  already holds the fields (verified above); the registry is
  the file those ids resolve against.
- Battle side: #17 pipeline stages, #27 status records, #18
  opponent AI reads the *public* half of an ability (what an
  opponent could know) — whether AI knowledge is full or
  partial is **OPEN**, flagged, since it changes AI fairness.
- Field side: #7 spawn roll (via #112's modifier interface),
  #28 care activities.
- Completion/dex: the Mochiioteca entry format (#48 style
  guide) may *describe* an ability once one is canon; this
  package writes no dex text.

## Coverage — honest

- **Architecture: fully documented.** Slot + registry + trigger
  + battle/field split is one of the most thoroughly documented
  systems in the reference record.
- **Contents: zero, deliberately.** Canon's ability fields are
  empty in the core data itself. Registry shape, trigger
  vocabulary, and hook discipline are the yield; every ability
  name, assignment, parameter, and the hidden-slot rule are
  OPEN.
