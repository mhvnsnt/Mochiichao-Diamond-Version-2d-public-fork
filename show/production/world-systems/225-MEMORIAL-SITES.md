# #225 — MEMORIAL SITES → places for the finished stories

**Seat in the doctrine:** #154 founded the ancient
site — authored world content whose contents obey
the strictest law in the programme (item/remnant
class only; **no encounter field exists in the
record, by construction**). Memorials are the
living world's sites of the same family: places a
community built to remember its own — past Rangers,
past champions, partners who are gone. This spec
seats memorials on #154's class and states the one
distinction that defines them: a ruin is what time
left; a memorial is what people *meant*.

**What was studied.** Memorial places in the publicly
documented record: the monument as authored content
(a named subject, an inscription, a tended place);
remembrance as the site's whole function (nothing is
taken from a memorial, nothing is fought there —
visiting *is* the activity); the counterpart relation
to living honours (a hall of fame celebrates the
standing; a memorial closes the story). The kit
taken: the site record with a remembrance payload,
the contents law inherited whole, and inscription as
the site's voice.

## Native spec — memorial records over `mochiichao/ruin-site/v1` (#154)

- **The record.** A memorial is a site record on
  #154's class, carrying the memorial payload:

  ```
  { siteId, hostNode, subjects: [<ref> ...],
    inscription: <text ref>, dedicatedBeat (#12 ref),
    tender: <role ref | null> }
  ```

  `subjects` names who is remembered (a Ranger, a
  champion, an individual Mochi, a team — refs, never
  prose, so the chronicle (#224) and the record agree
  about who). `inscription` is the site's text,
  displayed under the Leak rule (display names, #23).
  `tender` is who keeps the place, if anyone does —
  an untended memorial is a valid state, and in time
  an untended memorial *becomes* a #154 ruin by
  exactly nobody's decision; the class records the
  slide, it does not schedule it.
- **The contents law holds, absolutely.** A memorial
  contains **remembrance, not encounters**: the record
  has no encounter field (#154's construction — there
  is nothing to wire an encounter *to*). Nothing is
  excavated from a memorial (#115's discipline does
  not apply — a memorial is not a dig, and treating
  one as one is the kind of act the chronicle would
  print and reputation would remember). What a visitor
  does at a memorial is: arrive, read, remember,
  leave. The format refuses to express anything else
  happening there, and that refusal is the spec's
  centre.
- **The living counterpart.** The Hall of Fame
  (#126's snapshots; #216's completion ceremony —
  its package not in the workspace at build time,
  join registered UNVERIFIED in STAGING) is where the
  *standing* are celebrated: the team's portrait, the
  induction, the living record. Memorials are for
  **finished stories** — the champion whose circuit
  is history, the Ranger whose journeys ended, the
  partner a whole town still names. The two systems
  never merge: induction is not a death, and a
  memorial is not an honour — a subject passes from
  one to the other, if they ever do, by canon's
  decision, never by a system's derivation.
- **Authored, never derived.** A memorial is authored
  world content: someone in the fiction built it, and
  someone in the production placed it. No system
  generates memorials from records (a distinguished
  career does not auto-found a site; a famous
  individual's release does not raise a stone).
  Dedication is a canon act, stamped as a #12 beat
  by the story that performs it.

## Show lane

A memorial is a ready-made quiet scene: the cast at a
predecessor's stone, the inscription read under the
subtitle law (legible, chosen, brief), the past
entering the present tense without a flashback's
machinery. Continuity is #82's: a memorial, once
shown, stands in that place forever after — later
episodes pass it as a fact of the road.

## Open slots (nothing invented)

**Who is memorialised — the owner's canon call,
entire.** No canon memorial is instanced in this
package: no subject, no site, no inscription, no
region is named · memorial etiquette (offerings?
silence? — regional custom, content) · whether any
memorial stands in or near the Dark Forest (a site
at the edge is conceivable; nothing in the depths is
a memorial, because nothing in the depths is
recorded — #163) · tender roles and succession.

## Coverage — honest

- **Architecture: fully documented** — #154's class,
  its contents law, and its construction inherited;
  the remembrance payload and the Hall-of-Fame
  counterpart split are this package's yield.
- **Contents: deliberately, reverently zero.** A
  package that invented someone's memorial would be
  inventing someone's death. The shape waits for
  canon to finish a story first.

**Registration (List 24 #235, landing 2026-10-27):** inscription records (shape: 235-INSCRIPTIONS.md + inscription-fragment.json) seat on these site records as REFERENCES only — the record carries no text field anywhere; the words themselves are content-lane writing, and zero inscriptions exist.
