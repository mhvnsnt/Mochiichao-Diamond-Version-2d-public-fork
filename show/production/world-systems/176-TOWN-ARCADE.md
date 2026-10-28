# #176 — TOWN ARCADE & MINIGAMES → play institutions, under the token ethics

**Seat in the doctrine:** #56 built the Garden
minigame loop — Garden venue, care verbs, the
`garden_token`, and the house laws M1–M4. #88 built
Garden attractions. A **town arcade** is a different
institution in a different place: play as a *town's*
content — a room in a town where games live, visited
the way a shop is visited. This spec is that
institution's record and its ethics. The games
themselves are content slots in the record, the same
posture #56 took with its seed activities: slots in a
format, not designed games.

**What was studied.** Arcade/game-corner institutions
in the publicly documented record — including the
cautionary half: the reference game corners began as
gambling halls (pay coins, chance pays prizes) and
were progressively redesigned across eras and regions
toward skill play and free play, because a wager loop
aimed at a young audience was recognised as the wrong
machine. The kit taken: the institution record
(place + game roster + prize table) — and, from that
history, the ethics below stated as format law, not
as taste. No game designs, prize lists, or venue
layouts are copied.

## Native spec — `mochiichao/arcade/v1` (fragment beside this doc)

- **The arcade record:** an interior (#119 record,
  hostNode in a town) plus a game roster. **The game
  record:** `{gameId, name (display, #23), arcadeRef,
  inputClass, price, prizeTable[], rotation}`.
  `inputClass ∈ {skill | chance | mixed}` — declared
  honestly per game, because the ethics below key off
  it. `rotation` entries (#124) may schedule featured
  games; availability derives at read time (#124's
  discipline). Scores and participation are facts in
  the run's #12 `vars.*` when a game writes any —
  nothing else is stored by this system.
- **The ethics — flat, and enforced by missing fields:**
  - **No gambling economy.** A chance-based game is
    **skill-priced or free**. Skill-priced means the
    price buys *play*: a fixed fee (in #20's one
    currency) for a session whose outcome is the
    player's performance. A game whose price buys a
    *random outcome* — pay, then chance decides what
    you received — is a **wager**, and the record has
    no wager field: `price` and `prizeTable` are never
    linked by chance. A purely chance game (a wheel, a
    drawing) must be **free to play**; its prizes then
    fall under the next rule in full.
  - **Prizes never buy power.** #56's M1, inherited as
    this system's own law: prize rows may name
    cosmetic / care / decor / material-class #31 items
    and **#104 honour-class stamps** (occasions
    proposed into #104's catalogue home — the catalogue
    is the owner's slot, per #151) — never stats, never
    Fragments, never move access, never progression
    goods (#56's excluded kinds, verbatim discipline).
  - **No second currency, no real money.** Prices
    denominate only in #20's single currency (#20
    forbids a second currency without an owner ruling).
    #56's `garden_token` is Garden-scoped and does not
    circulate in towns; an arcade that wants its own
    tokens wants a ruling this spec does not seek. And
    no real-money anything, ever (#56 M4): no field in
    this format denominates in anything outside the
    game.
  - **No pressure.** No expiring prizes, no streak
    punishment, no limited-time scarcity mechanics
    (#56 M4 / #124's no-pressure law): rotation makes
    games *return*, never *vanish*.
- **Show lane:** an arcade is a town set (bank reuse,
  #82). Episodes may depict play as life — a crowd
  around a game, a rivalry over a score — under #56's
  two-lane discipline: the show depicts games; it
  never runs them, and no token/score UI appears
  in-show.

## Open slots (nothing invented)

Every arcade instance and its town · every game's
actual design, input class ruling, and price · every
prize table's contents and the #104 stamp occasions ·
whether any chance-class game exists at all (a design
choice per game — the ethics bind whichever way it is
made) · whether an arcade interior ever doubles as a
social space for #93-scheduled NPCs (texture, not
system).
