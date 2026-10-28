# #210 — FIELD DUELS → the informal challenge, under the world's manners

**Doctrine seat:** #109 founded the versus lobby —
the formal, validated, ruleset-bound way two Rangers
battle. Most Ranger-versus-Ranger battling in a
living world is not that: it is two Rangers on a
route, a challenge called and answered, a battle on
the spot. This package specifies that informal
layer — the **field duel** — as a social protocol
with a battle inside it. It is not a versus ruleset
and joins #109 only by contrast: no lobby, no team
validator, no ranked record. What it shares with
#109 is the battle machinery the duel borrows once
both Rangers have agreed to fight.

**What was studied.** Challenge/accept customs in
the publicly documented record (the reference games'
link-battle etiquette and their in-world trainer
challenges; fighting-game and sport challenge
conventions): a challenge is an *offer with stated
terms*, acceptance is free, refusal is complete and
costless, and the contest's stakes are agreed before
the first move or there are none. The kit taken:
offer/answer grammar, stakes fixed in advance, and
the refusal that leaves no trace.

## Native spec — `mochiichao/field-duels/v1` (fragment beside this doc)

- **The challenge.** A challenge is an offer record
  with exactly these terms: the challenger, the
  challenged, a format class from #157's multi-battle
  vocabulary (singles / doubles as data — no new
  format words), and the stakes class (below — one
  value, `honours`, or `none`). In person, the offer
  rides presence (#93's schedules determine who is
  actually there to be challenged). Remote challenges
  are **proposed into #90's home** as a media message
  class (see the registered clarification in
  STAGING: #90 is the in-world media system and no
  challenge grammar exists in its file today — the
  proposal lands there or the remote form does not
  exist).
- **The answer.** Accept starts the duel. Decline
  ends the exchange and **writes nothing** — no
  refusal record, no standing change, no shame
  ledger; a declined challenge is as if it were a
  conversation, because it was one. An unanswered
  challenge expires with the moment (presence ends,
  the offer lapses); expiry also writes nothing.
- **The battle.** A field duel runs the ordinary
  two-Ranger battle: #10's flow, #17's resolution,
  both parties the Rangers' own individuals (#80
  records). There is no validator — a Ranger fields
  who they field — and no normalisation: the field
  is informal, and its honesty is that both sides
  saw the terms and agreed. Gain follows #177's
  rules for Ranger battles as they stand; nothing
  here amends them.
- **Stakes — honours only.** The only stake a field
  duel may carry is an **honour occasion**: the
  participating individuals of the prevailing side
  may earn a duel stamp (proposed into #104's
  honours catalogue as an occasion — its home
  disposes; stamps are #104's stored facts on the
  individual record, as always). **Never items,
  never Mochi, never currency, never Fragments** —
  wagering creatures or goods on a battle is outside
  this world's ethics, stated as a hard exclusion in
  the format itself: the stakes field's vocabulary
  has no value that could name them, so an
  implementation cannot offer them by accident.
- **The record.** A fought duel appends one record
  (fragment beside this doc) under the append-only
  discipline #126 set for capstone history: ids and
  outcome facts, names resolved at read (#23), kept
  with the #12-history class of facts (the seat #106
  already uses for tombstones). No rating derives
  from duel records in this package — a ladder of
  informal wins would re-found the lobby this
  package exists to sit beneath; if a reputation
  surface ever reads them, that is #201's derived
  business, cited not built here.

## Show lane

The field duel is the show's bread-and-butter
challenge scene: a called challenge on a route, an
answer, a fight under the autonomous doctrine —
creatures fighting with their own agency, Rangers
sometimes commanding. The show duel's result is
story; it writes no record and needs no stakes, and
a depicted refusal is a character beat with the
same costless grammar (the show's manners are the
game's rules, drawn).

## Wiring

Format classes read #157's vocabulary; the battle
is #10/#17 unchanged; the honour occasion is
proposed into #104's catalogue; the remote-challenge
message class is proposed into #90's file; records
join the #12-history fact seat #106 uses; presence
reads #93. #109 is cited only as the contrast —
nothing in the lobby changes.

## Coverage — honest

- **Architecture: fully specified** — offer/answer/
  stakes/record over verified machinery.
- **Contents: no duel is instanced** (no NPC
  challenger cast, no route authored); the honour
  occasion and the remote message class are
  proposals into their owners' files, spec-level
  until accepted there.

## Open slots (nothing invented)

The duel honour's id and stamp text (#104's
catalogue owns it) · whether specific places forbid
duels (a #119/#110-class local rule would carry it —
none asserted) · rematch etiquette timing (a
customs question for #173's availability derivation
to read, not a rule here) · the remote challenge's
expiry window (#90's proposal carries it).

**Landing citation — List 36 #353 (2026-10-27).** Surrender & mercy (`show/production/battle/353-SURRENDER-MERCY.md`) lives under this file's honours-only stakes law: a surrender writes its outcomes through the ordinary defeat-ending path and never transfers a Mochi. The mercy deed rows themselves are proposed into #269's table in #269's home, not here.
