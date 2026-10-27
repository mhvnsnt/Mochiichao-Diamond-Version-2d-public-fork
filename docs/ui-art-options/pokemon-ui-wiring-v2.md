# Pokemon UI wiring v2 — party, shop, bag, PC (from the actual decomps, structure/rules only)

Sources: pokefirered-leafgreen/src/party_menu.c, shop.c,
pokemon_storage_system_menu.c; pokeheartgold/src/party_menu.c,
bag_view.c. No code/art copied.

## Party / Roster (party_menu.c)
- One box per party slot, with that creature's sprite, name, level, HP
  bar + HP numbers, status icon, held item icon. Cursor moves slot to
  slot, lastSelectedSlot is preserved when you leave and come back.
- Selecting a slot opens a context menu, NOT a new screen: Summary,
  Switch, Item / Give / Take, Mail / Read / Take Mail, Cancel — plus
  field-move / Send / Store / Register / Trade in the contexts where
  they apply. Mochiichao mapping: RosterView slot -> context menu
  Summary / Switch / Give Item / Take Item / Release? (only if Mars
  approves release — do NOT add release silently) / Cancel.
  Current RosterView already lists slots — add the context menu +
  preserved cursor, do not rebuild it as a grid of buttons.
- Message: party menu shows a messageId line ("Choose a POKéMON." etc.)
  at the top/bottom while choosing. Mochiichao: a message line in
  RosterView, not just a header.

## Shop (shop.c)
- First menu is always Buy / Sell / Quit (sShopMenuActions_BuySellQuit),
  NOT a direct item list.
- Buy list: ListMenu template, each row = item icon + item name +
  price printed in the list (BuyMenuPrintPriceInList), cursor printed
  at the row's Y (BuyMenuPrintCursorAtYPosition), scroll arrows when
  the list scrolls, item description + icon shown for the selected
  item (BuyMenuPrintItemDescriptionAndShowItemIcon).
- Confirm purchase window before money is taken (CreateBuyMenuConfirmPurchaseWindow,
  BuyMenuTryMakePurchase, BuyMenuSubtractMoney), then return to the
  item list (BuyMenuReturnToItemList), NOT back to the world.
  Mochiichao ShopView mapping: Buy/Sell/Quit first, then list with
  Luigi Cube / Mend Patch / etc. + CR price + description, confirm
  window, then back to list. Wallet/CR is the money, same flow.

## Bag (HeartGold bag_view.c + FireRed item_menu.c)
- Bag is pocketed (items grouped by pocket/type), list menu with
  cursor, item icon + description for the selected item, use/give/
  toss/quit context actions. Mochiichao: inventory is already in
  gameStore — show it as a pocketed list with description + icon,
  not as a bare count in the battle menu only.

## PC / Storage (pokemon_storage_system_menu.c)
- Storage is boxes, not one long list: box select, then a grid of
  slots in that box, move / deposit / withdraw / release (with
  confirm) actions, cursor preserved per box. Mochiichao PcView
  mapping: boxes (at least Box 1 to start, more as creatures are
  stored), grid slots, Deposit / Withdraw with confirm, cursor
  preserved. Do NOT add release without Mars's explicit say-so.

## 100% checklist — what is wired, what is NOT yet (honest, 2026-10-25)
WIRED (in game code, local or on main):
- Battle: Pixi arena, 2x2 move grid + PP/TYPE, HP panels, Luigi Cube +
  Flee, three-quarter cuts for Dorowani/Gabu (local, build-verified,
  NOT yet PR'd — see below).
- UI panels/buttons/bars: 48 SVGs on main via PR #14, 35/36 slots
  (title_art HELD, null fallback).
- Sheets on main: sprites-2d via PR #13 (43 sheets + 12 Kaggle PNGs).
- Data: FireRed/HeartGold/Black2 + pret Gen 1-4 extractions on main
  via PRs #7/#8/#10/#12, Gen 5+ substitutes via PR #11.
NOT YET WIRED / NOT YET DONE:
- Pokemon-UI v1 worker: RUNNING in main chat (started ~12:27 CDT),
  local only, not yet reported — battle message box, menu help lines,
  framed menus over world. Do NOT duplicate it in the same tree.
- Pokemon-UI v2 (this file): party context menu, shop Buy/Sell/Quit +
  confirm, bag pockets, PC boxes — SPEC only, to be wired after v1.
- Monster-tamer v1: SPEC only (Data Fusion, Mainframe Variants, Data
  Cards, Bonding quests, Guardian Training) — not coded yet.
- Human Characters: Player A in-game sheet is DRAFT only (needs walk
  frames, battle back view, portrait icon, 64x64 atlas + manifest);
  Player D in-game sheet needs redo; B/C need corrected model sheets.
  NOT wired into humanSheets.ts yet (20 slots are silhouettes).
- Sprite Art batch 2: Zephling angles, Aerobeak full set, Manticlaw
  special-variant bake, Stormtalon/Finblade angles — local, not PR'd.
- Title art: HELD (null, gradient fallback) — no corrected title PNG
  yet (no gold spikes, no gold arm band).
- DEPLOY BLOCKER (not code): Netlify team western-heart is on
  operational credits — production deploys + Agent Runners PAUSED.
  PR #14 main @2b645f1f deploy was Skipped 12:04 PM CDT; published
  deploy is still PR #11 @cbab97a (11:17 AM). Until that pause is
  resolved (Mars / Netlify account side, NOT a code change), NO new
  code — wired or not — reaches the playable live site, and the live
  site will NOT show the new UI/menus/characters. Local build can be
  verified, live playtest cannot, until the deploy unblocks.
  Do NOT claim "100% on the deployable build" until a post-PR deploy
  actually publishes and a live-browser playtest passes it.
