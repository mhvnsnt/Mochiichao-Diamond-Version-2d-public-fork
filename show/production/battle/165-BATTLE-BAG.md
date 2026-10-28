# #165 — BATTLE BAG SYSTEM → item use inside battle, at the price of the turn

**Doctrine seat:** in battle, an item is a command,
not a pause menu. The documented rule that gives
battle items their weight is that using one *costs
the turn* — the creature waits while the Ranger acts.
Mochiichao's flow already has the shape to honour
that: #10's `COMMAND_RING` chooses, `RESOLUTION`
resolves, and only commands affect health. This spec
puts the bag in the ring as a peer command and writes
the symmetry rules for the other side of the field.
It instances no items and sets no class values.

**What was studied.** In-battle item use in the
publicly documented record: item use consumes the
user's turn; only certain pockets are reachable in
battle; consumables deplete; AI trainers use healing
items under threshold behaviour (which #18's
S-SURVIVAL already models for "item-holding classes")
while wild creatures use none — they have no one to
use them. The kit taken: the turn-cost rule, the
context filter, depletion at use, and per-class AI
permission as a flag, not a behaviour baked into
classes ad hoc.

## Native spec — the bag as a command class (record shape in the fragment)

- **Reachability is #31's field, read verbatim:** an
  item is usable in battle iff its registry record
  carries `useContext.battle == true`. Categories are
  #31's closed vocabulary (`consumable | held | key |
  care | capture | material`) untouched — context, not
  category, gates the bag. (A capture instrument's
  context is how #38 attempts enter battle; see
  below.)
- **Turn cost:** an item command is issued from
  `COMMAND_RING` for the acting side's slot, exactly
  as a move command is; it resolves in `RESOLUTION`'s
  queue at its place; the slot's creature does not
  also move that turn. There is no free-action path
  and no parallel input. In #157 multi formats, each
  controller commands its own slots; the bag a command
  draws on belongs to that slot's **controller**.
- **Depletion at resolution:** a consumable's count
  decrements when its effect resolves. If the queue
  voids the use before resolution (the target is gone
  at `END_CHECK` ordering), the item is not consumed
  and the command is spent — the turn was the price,
  not the item. Stated as this spec's rule so landing
  implements one behaviour, not two.
- **Capture attempts are bag commands.** A #38 attempt
  is an item-class command under this model: it
  occupies the slot's turn, resolves through #38's
  staged checks in `RESOLUTION`, and depletes the
  instrument only as #38's own rules say. #158's
  thin-then-take legality check happens at command
  time, before the turn is spent.
- **AI symmetry — the `bagAccess` flag.** #18's class
  table gains a proposed per-class flag (proposed
  into #18's file; its home disposes): `bagAccess:
  none | threshold` (threshold = the class may spend
  items under S-SURVIVAL's existing threshold
  behaviour — no new scorer is minted). Per-class
  **values are OPEN** (owner balance), with one
  structural exception stated as fact, not balance:
  `wild` is `none` by construction — a wild Mochi has
  no Ranger and no bag; that is not a difficulty
  setting and may not be tuned away.
- **AI stocks are records, not wells.** An AI side's
  usable items are the item list on its encounter
  record (#30/#37 pattern), decremented in-battle as
  used; when the list is empty, S-SURVIVAL's item
  branch has nothing to score. Partner AI (#157) obeys
  the same flag against the **partner's own** stock —
  and, restated from #157 because bags tempt it: the
  partner never spends the Ranger's bag, and the
  Ranger never spends the partner's.

## Show lane

Items in show battles are choreography. A Ranger
throwing a remedy mid-fight is a staged beat under
the autonomous-action doctrine; the show reads no bag
state, decrements nothing, and a show item's effect
is whatever the story stages. The bag system is
game-lane only, and no turn-cost concept may leak
into show staging (show fights are continuous, not
turned — Battle Doctrine).

## Wiring

Items: #31 registry (`useContext.battle`); flow: #10
(command/queue semantics unchanged); AI: #18
(proposed flag; S-SURVIVAL unchanged); stocks: #30/
#37 encounter records; capture join: #38 (+ #158's
command-time legality); multi join: #157 controller
rule; care items used *outside* battle stay #31's
field context + #132's services — this spec governs
battle only.

## Coverage — honest

- **Architecture: fully specified** (reachability,
  turn cost, depletion point, AI flag and stocks).
- **Values: OPEN** — every class's `bagAccess` except
  the structural `wild: none`; all AI stock contents
  are encounter content. No item's `useContext` is
  edited by this package.
