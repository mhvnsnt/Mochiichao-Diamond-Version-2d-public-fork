# Shop buy-selection fix (found by live playtest, 2026-10-27)

## Bug, reproduced 4 times in the playtest

Syndicate Kiosk buy list: selecting Revive Core (or Mend Patch),
then clicking Buy, switched the selection to Data Card and prompted
"Buy Data Card for 300 CR?" — every time, all prompts declined,
CR stayed 900, nothing bought. This blocked reviving a fainted
Mochii, which in turn blocked Creature Mode Pass 4 and Pass 8.3.

## Cause

Buy/sell list rows changed selection on hover (`onMouseEnter`).
The Buy button sits in a detail panel below the list, so moving
the mouse from a selected row down to Buy crosses every row
below it — ending on Data Card (last row), whose hover fired
before the click landed. The click then confirmed whatever row
the mouse crossed last, not the row the player selected.

## Fix (ShopView.tsx only)

- Removed `onMouseEnter` selection from both buy and sell lists.
- Selection now changes on click or keyboard focus only.
- No price, item order, confirm window, or sell behaviour changed.

## Playtest to re-verify (on a Pages build containing this fix)

1. Open Syndicate Kiosk, select Revive Core, move the mouse
   straight down to Buy, click — confirm prompt must read
   Revive Core 500 CR, not Data Card.
2. Repeat for Mend Patch 150 CR.
3. Confirm Yes once: CR drops by the selected item's price only,
   and that item (not Data Card) enters the bag.
