# 56 — GARDEN MINIGAME SYSTEM (token-loop economies)

Teardown List 6, item 56. Native spec for Jamar's Mochiichao game
lane. Sources: publicly documented game-corner / token-loop design
in creature-collector and raising games (the Chao-garden half of
this project's own DNA included — care economies are documented
practice), re-expressed as an original Garden system. All economy
numbers are OPEN: no token values exist in canon, and inventing a
balanced economy without play data would be fabrication, not design.

Homes: the Mochi Garden (canon: opened by Assistant Mochiko at
R1-BEAT3) is the minigame venue; the system is game-lane only
(show lane may *depict* Garden games as life, never as mechanics —
two-lane discipline, cf. #52 B4).

---

## 1. Teardown — how token loops are structured

Documented loop anatomy, generalised:

- **Earn → hold → spend → sink.** A soft token currency is earned
  in small repeatable activities, held in a visible purse, spent on
  desirable non-essential goods, and *sunk* (removed from the
  economy) by consumables/repeat purchases — the sink is what keeps
  earning meaningful.
- **The token never buys power.** The documented game-corner
  discipline (and the raising-game care economy): tokens buy
  cosmetics, care items, convenience, and *chances at variety* —
  never stats, never story progress. The moment tokens gate power,
  the loop becomes a tax instead of a game.
- **Activities are short, skill- or chance-flavoured, and tied to
  the fiction's own verbs** (in a garden: tending, racing, fetching,
  sorting) — reskinned generic slots break the world; native verbs
  build it.
- **Prizes rotate on a schedule the player can learn** (daily/
  weekly tables), creating return visits without pressure mechanics.

## 2. Native spec — `garden-minigame/v1`

### 2.1 Token

```
token_id:    "garden_token"        // stable id
display:     OPEN — in-world name is an OWNER decision (candidates
             belong in the TBD register, not this spec; must pass
             the R4/#48 computer-vocabulary sweep: no "data" tells)
purse:       profile-level, derived display, cap: OPEN
```

### 2.2 Activity record (one per minigame)

```
activity_id, display_name,
venue:        "garden" (+ sub-area when canon provides),
verb:         tend | race | fetch | sort | care | OPEN (fiction verb first),
duration_class: short (<2 min) | session,
input:        care action / timing / matching / chance — format-level,
earn:         { token: OPEN, rate_shape: "per_run" | "per_score_band" },
cooldown:     OPEN (per-run | daily | none),
species_hook: which Garden life participates (ambient roster classes
              per LIVING-WORLD P2 binding — principals never ambient)
```

**Seed activities (structure only — mechanics design is game-lane
work, values OPEN):** a care/tending round (feeds the Chao-style
care axes, List 4 #28 when landed), a ring/fetch run on the Garden
paths, a berry-sort matching round (SFX-BERRY's world, as a game).
Each is a *slot in this format*, not a designed minigame.

### 2.3 Prize table (the spend side)

```
prize_table_id, rotates: daily | weekly | OPEN,
rows: [ { prize: { kind: cosmetic | care_item | variant_chance | decor,
                   ref: <item/decor id> }, cost: OPEN } ]
```

- `variant_chance` prizes touch LUSTRE only through the variant
  law (COLOR-SYSTEM §b): a prize may *grant access* to an authored
  lustre palette; it may never generate one (variants are authored
  species facts, §1.4 of the colour research — hand-picked, never
  algorithmic).
- Story items, Fragments, and progression goods are **excluded
  kinds** — the table format refuses them (law M1).

### 2.4 House laws

- **M1 — Tokens never buy power or progress.** No stats, no
  Fragments, no route gates, no Rare/General move access (machine
  system is world-found, per the move-system canon).
- **M2 — Every earn has a sink.** Consumable care items and rotating
  decor are the standing sinks; a prize row that is neither
  consumable nor rotating requires an owner exception, recorded.
- **M3 — Care is the real currency.** Token activities feed the
  Garden's care axes as their primary reward; tokens are the
  *visible* loop on top of the care loop, not a replacement for it.
- **M4 — No pressure mechanics.** No expiring purses, no streak
  punishment, no paid anything (there is no real-money layer in
  this project; the format has no field for one, deliberately).

## 3. Wiring points

- Game data: `src/data/core/` — activity + prize-table records
  beside encounters; purse state joins the profile/save flag
  architecture (EVENT-FLAG `vars.*` namespace, derived display).
- Garden systems: care axes (List 4 #28), completion loop
  (MOCHIIOTECA-COMPLETION — Garden participation is not dex
  completion; the systems link by profile only).
- Show: Garden minigames may appear as background life under
  LIVING-WORLD population rules; no token UI ever appears in-show.

## 4. Coverage notes

Token-loop anatomy (earn/hold/spend/sink, no-power discipline,
rotating prizes) is standard documented economy design — high
confidence as structure. Every rate, cost, cap, and the token's
very name are OPEN because canon and play data set none of them;
the seed activities are format demonstrations, not designed games.
This is intentionally the thinnest-numbers spec in List 6: the
format is the deliverable, the economy is owner's future tuning.
