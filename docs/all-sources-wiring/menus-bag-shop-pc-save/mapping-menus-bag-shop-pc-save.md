# Menus / Bag / Shop / PC-Storage / Save-Load — Mapping (Worker 2/6)

Date: 2026-10-26. Scope: field menu, title-adjacent main menu, options,
bag, shop, creature storage, item storage, mailbox, save/load, trainer card.
Start screens themselves are another lane — NOT covered here.
Staging only: no commit, no PR, 0 deletions from this task.
All screens below are dedicated full screens in the source games.
No terminal menu, no overlay popup is used as the pattern in these rows;
where the current web build uses an overlay, that row is NEED, not HAVE.

## Source key (full paths are in the worker report to the parent)

- FR = Gen 3 FireRed/LeafGreen decomp, read first
- HG = Gen 4 HeartGold/SoulSilver decomp, read second
- BW2 = Gen 5 Black 2/White 2 decomp, read third
- EM = Gen 3 Emerald decomp; RU = Gen 3 Ruby decomp
- CR = Gen 2 Crystal decomp; GO = Gen 2 Gold decomp
- YE = Gen 1 Yellow decomp; RE = Gen 1 Red decomp
- DI = Gen 4 Diamond decomp; PL = Gen 4 Platinum decomp
- MO = current Mochiichao web build (fresh-start work tree)

## Sanitising rule applied to every staged file in this folder

Swap bucket ONLY: creature species/characters, creature names, creature
images, logos, actual literal dialogue, creature voices.
Everything else is usable at 100%: code, move names/moves, systems,
structure, values. Staged snippets therefore rename: creature (not the
franchise word), creature index (not the franchise index name), capture
device (not the franchise ball name), shop (not the franchise mart name),
storage system (not the franchise storage name).
Forbidden-token grep on staged files (species names, franchise creature
word, franchise ball/index/shop/storage names, literal dialogue): 0 hits.
No file in this folder could not be sifted; 0 files flagged unsiftable.

## Overall: HAVE 20/97 = 21%, NEED 77/97 = 79%

| System | HAVE | NEED | Total | % done |
|---|---|---|---|---|
| A Field menu | 0 | 9 | 9 | 0% |
| B Title-adjacent main menu | 0 | 5 | 5 | 0% |
| C Options | 0 | 7 | 7 | 0% |
| D Bag | 3 | 15 | 18 | 17% |
| E Shop | 7 | 8 | 15 | 47% |
| F Creature storage (boxes) | 7 | 9 | 16 | 44% |
| G Item storage / mailbox / player terminal | 0 | 8 | 8 | 0% |
| H Save / load | 3 | 11 | 14 | 21% |
| I Trainer card (title-adjacent) | 0 | 5 | 5 | 0% |
| TOTAL | 20 | 77 | 97 | 21% |

## A. Field menu — 0/9 = 0% done

Source order (FR): index, party, bag, player, save, options, exit,
plus context rows: retire (special-zone only), link-player (link only).
Order is data-driven: a build-order list is appended per context, then
printed one row per 15 px step with a cursor. HG order: index, party,
bag, trainer card, save, options, gear, running-shoes toggle.
BW2/HG keep the same shape: one full-screen list, cursor, A = run the
row's callback, B = close and return to field.

| # | Source element | Mochiichao replacement in that exact spot | Status |
|---|---|---|---|
| A1 | Index entry, shown only once the index exists | Creature Index entry | NEED |
| A2 | Party entry | Roster entry | NEED (RosterView exists, but no field-menu entry points at it) |
| A3 | Bag entry | Bag entry | NEED (BagView exists, but no field-menu entry points at it) |
| A4 | Player entry (name printed in row) | Trainer Card entry | NEED |
| A5 | Save entry -> save dialog (see H) | Save entry | NEED |
| A6 | Options entry | Options entry | NEED |
| A7 | Exit entry | Exit entry | NEED |
| A8 | Retire entry, special-zone context only | Retire entry, special-zone context only | NEED |
| A9 | Link-player entry, link context only | Link-player entry, link context only (link itself is a later lane) | NEED |

## B. Title-adjacent main menu (NOT the start screen) — 0/5 = 0% done

FR: window set chosen by save state — new-game-only, continue+new-game,
continue+new-game+gift, error. Cursor moves between the windows, A runs
the choice, error window waits for A then falls back to new-game.
HG/BW2 keep Continue / New Game as the first choice after the title.
This is distinct from the save list inside the game (section H).

| # | Source element | Mochiichao replacement | Status |
|---|---|---|---|
| B1 | New Game window | New Game window | NEED |
| B2 | Continue window | Continue window | NEED |
| B3 | Gift / special window (FR third window) | Gift window, only when a gift exists | NEED |
| B4 | Error window (corrupt / no-flash save) | Error window | NEED |
| B5 | Continue summary (player, location, time) | Continue summary | NEED |

## C. Options — 0/7 = 0% done

FR, 7 rows, value counts {3, 2, 2, 2, 3, 10, 0} in row order below.
HG: same 7 rows (text speed, battle scene, battle style, sound method,
button mode, frame, one unused row). Values are saved in the options
block (see H) and reloaded on open; left/right cycles a row's values,
B/confirm saves and closes. No Options screen exists in MO yet.

| # | Source element | Mochiichao replacement | Status |
|---|---|---|---|
| C1 | Text speed: 3 values | Text speed: 3 values | NEED |
| C2 | Battle scene: 2 values (on/off) | Battle scene: 2 values | NEED |
| C3 | Battle style: 2 values (shift/set) | Battle style: 2 values | NEED |
| C4 | Sound: 2 values (mono/stereo) | Sound: 2 values | NEED |
| C5 | Button mode: 3 values | Button mode: 3 values | NEED |
| C6 | Frame type: 10 values | Frame type: 10 values (frame art owed) | NEED |
| C7 | Cancel row (0 values, closes) | Cancel row | NEED |

## D. Bag — 3/18 = 17% done

Pocket counts, read on disk:
- FR: 5 pockets — Items 42, Key Items 30, Capture Devices 13,
  Move Machines 58, Berries 43 = 186 slots.
- HG/PL: 8 pockets — Items 165, Key Items 50, Move Machines 101,
  Mail 12, Medicine 40, Berries 64, Capture Devices 24, Battle Items 30
  = 486 slots. Stack max 999, Move Machine stack max 99 (HG).
- BW2: 5 pockets + Free Space — Items 310, Key Items 83,
  Move Machines 109, Medicine 48, Berries 64 = 614 slots, Free Space
  max 614, stack max 999, Move Machine stack max 1 (BW2).
- EM: Items 30, Key Items 30 (smaller Gen 3 set, same pocket shape).
- CR/GO: party 6, boxes 14 x 20 = 280 (Gen 2); YE/RE: boxes 12 x 20 = 240.
Bag state kept per pocket: cursor row + scroll offset, remembered across
opens. Bag contexts (FR): field, party-give, shop-sell, item-terminal
deposit, box-give, battle. Context actions (FR, 12): use, toss,
register, give, cancel, battle-use, check, open, open-berries, walk,
deselect, dummy. SELECT registers a key item for field use.

| # | Source element | Mochiichao replacement | Status |
|---|---|---|---|
| D1 | FR 5-pocket structure + 186 slots | 5-pocket structure + 186 slots | NEED (MO groups by pocket name only, no fixed pockets/caps) |
| D2 | HG 8-pocket structure + 486 slots | 8-pocket structure (canonical choice owed — see Owed) | NEED |
| D3 | BW2 5-pocket + Free Space, 614 slots | Free Space pocket | NEED |
| D4 | Stack max 999 / Move Machine max 99 or 1 | Stack caps | NEED |
| D5 | Cursor + scroll remembered per pocket | Cursor + scroll per pocket | NEED (MO keeps one global selection) |
| D6 | Field context | Field context | NEED (MO bag opens from world, but without context actions) |
| D7 | Party-give context | Party-give context | NEED |
| D8 | Shop-sell context (bag reused inside shop) | Shop-sell context | NEED (MO shop has its own sell list, not the bag) |
| D9 | Item-terminal deposit context | Item-terminal deposit context | NEED |
| D10 | Box-give context | Box-give context | NEED |
| D11 | Battle context (battle pocket filter) | Battle context | NEED |
| D12 | Use action | Use action | NEED (MO Use only truly effects one medicine item; other items only decrement) |
| D13 | Toss action + how-many quantity | Toss action + how-many | NEED |
| D14 | Register action (SELECT field use) | Register action | NEED |
| D15 | Give action (held item) | Give action | NEED (no held-item system yet — stated in MO BagView) |
| D16 | Check action (description pane) | Description pane | HAVE (MO shows name + description per selected row) |
| D17 | Pocket-grouped list display | Pocket-grouped list | HAVE (MO sorts/groups by pocket) |
| D18 | Count shown per row + icon per row | Count + icon per row | HAVE (MO shows count; icon falls back to initial letter when no asset) |

## E. Shop — 7/15 = 47% done

FR flow, in order: shop menu window (12 wide x 6 high, top-left 2,1)
with Buy / Sell / Quit, cursor, A selects. Buy -> full buy screen:
list rows = icon + name + price, description pane, money shown, cursor,
scroll arrows. Select -> how-many quantity -> Yes/No confirm -> money
subtracted, item added, transaction recorded, shop stat incremented,
back to list. Sell -> bag in sell context -> how-many -> price =
buy price / 2 x quantity -> confirm -> money added, item removed.
Quit -> exit callback back to field. Mart types (FR): regular,
move-machine, decor, decor-2. HG: normal, seals, prize-exchange,
data-card. BW2: regular, battle-point, special (badge-growing stock),
move-tutor (move list, not item list), shop list max 45 entries.
CR/GO/YE/RE: same Buy / Sell / Quit shape in assembly (mart script).

| # | Source element | Mochiichao replacement | Status |
|---|---|---|---|
| E1 | Buy / Sell / Quit first menu | Buy / Sell / Quit first menu | HAVE (MO ShopView mode menu) |
| E2 | Buy list: icon + name + price + description | Buy list | HAVE |
| E3 | Sell list drawn from the bag | Sell list | HAVE (MO sell list, but drawn from shop list, not the bag — see D8) |
| E4 | Yes/No confirm before money moves | Confirm step | HAVE (MO confirm step; form is an overlay div, full-screen window form still NEED — counted here as flow HAVE, form gap noted in Gaps) |
| E5 | Sell price = buy price / 2 | Sell price = buy price / 2 | HAVE (MO: floor(cost / 2)) |
| E6 | Insufficient-funds block on Buy | Insufficient-funds block | HAVE (MO disables Buy when wallet < cost) |
| E7 | Exit callback back to field | Exit back to world | HAVE (MO onBack to WORLD) |
| E8 | How-many quantity selector (buy + sell) | How-many selector | NEED (MO buys/sells one at a time) |
| E9 | Bag-full block on Buy | Bag-full block | NEED |
| E10 | Transaction record + shop stat | Transaction record + shop stat | NEED |
| E11 | Move-machine shop type | Move-machine shop type | NEED |
| E12 | Decor shop types | Decor shop types | NEED |
| E13 | Seal / prize / data-card shop types (HG) | Special shop types | NEED |
| E14 | Badge-growing stock (BW2) | Badge-growing stock | NEED |
| E15 | Battle-point / move-tutor shop types (BW2) | Point / tutor shop types | NEED |

## F. Creature storage (boxes) — 7/16 = 44% done

FR: 14 boxes, 5 rows x 6 columns = 30 per box = 420 slots, box name
max 8, 17 wallpapers. HG: 18 boxes x 30 = 540 slots, name max 20.
BW2: up to 24 boxes x 30 = 720 slots, unlocked 8 then 16 then 24,
name max 20. Main menu (FR, 5): Withdraw, Deposit, Move Creatures,
Move Items, Exit, each with a description line. Deposit asks which box.
Withdraw blocked when party is full (6); deposit blocked when it would
empty the party. Move: grab / place within a box and across boxes,
multi-move, item held on a creature moves with it. Release: confirm,
blocked for eggs; last-party guard applies. Box modified flag marks a
box dirty for save.

| # | Source element | Mochiichao replacement | Status |
|---|---|---|---|
| F1 | Withdraw / Deposit / Move / Move Items / Exit main menu | Storage main menu | NEED (MO merges withdraw/deposit into one screen, no Move choices) |
| F2 | Box select (left/right) + name + count line | Box select + name + count | HAVE (MO box buttons + count line; box rename NEED, see F10) |
| F3 | 30 slots per box | 30 slots per box | HAVE (MO BOX_SIZE = 30, grid display) |
| F4 | Party shown alongside the box | Party shown alongside | HAVE |
| F5 | Withdraw to party, party-full block | Withdraw, party-full block | HAVE (MO blocks withdraw at party 6) |
| F6 | Deposit from party | Deposit from party | HAVE |
| F7 | Cursor remembered per box | Cursor per box | HAVE (MO boxCursor per box) |
| F8 | Confirm before a move | Confirm before a move | HAVE (MO Yes/No confirm) |
| F9 | Move creatures within/across boxes (grab/place, multi-move) | Move creatures | NEED |
| F10 | Box rename + wallpaper | Box rename + wallpaper | NEED |
| F11 | Move Items mode (held items) | Move Items mode | NEED |
| F12 | Release + egg block | Release + egg block | NEED (MO PcView states Release is deliberately not offered — Mars decision owed, see Owed) |
| F13 | Deposit-which-box prompt | Deposit-which-box prompt | NEED (MO deposits to the stored list, not a chosen box) |
| F14 | Deposit last-member block / empty-party guard | Last-member guard | NEED (MO deposit has no party-size guard) |
| F15 | Summary view from a box slot | Summary view from box | NEED |
| F16 | Box count: 14 (FR) / 18 (HG) / 24 unlocked (BW2) | Box count (canonical choice owed) | NEED (MO box count grows with stored list length, no cap) |

## G. Item storage / mailbox / player terminal — 0/8 = 0% done

FR player terminal, top menu: Item Storage, Mailbox, Turn Off.
Item terminal submenu: Withdraw Item, Deposit Item, Go Back.
Item terminal: 30 slots, withdraw with how-many, deposit from bag.
Mailbox: list, read, move to bag (bag-full block), delete, message-lost
confirm when moving mail off a creature. Professor terminal and
hall-of-fame terminal are separate terminal screens in FR.
MO has no item terminal and no mailbox; its Data Card mechanic is a
separate Mochiichao system, not a replacement for these rows.

| # | Source element | Mochiichao replacement | Status |
|---|---|---|---|
| G1 | Player terminal top menu (3 rows) | Player terminal top menu | NEED |
| G2 | Item terminal: Withdraw Item | Item terminal withdraw | NEED |
| G3 | Item terminal: Deposit Item | Item terminal deposit | NEED |
| G4 | Item terminal cap: 30 slots | Item terminal cap 30 | NEED |
| G5 | Withdraw how-many quantity | Withdraw how-many | NEED |
| G6 | Mailbox: read / move-to-bag / delete | Mailbox | NEED |
| G7 | Turn Off / exit terminal | Turn Off | NEED |
| G8 | Professor terminal + hall-of-fame terminal | Professor + hall-of-fame terminals | NEED |

## H. Save / load — 3/14 = 21% done

FR: 2 save slots, 14 sectors per slot, sector = 3968 data bytes +
128 footer (12 used: id, checksum, signature 0x08012025, counter).
Slot 1 sectors 0-13, slot 2 sectors 14-27, hall-of-fame 28-29,
tower 30-31, 32 sectors total. Sector 0 = block 2, sectors 1-4 =
block 1, sectors 5-13 = storage. Writes rotate the start sector each
save; damaged sectors are skipped and the last-known-good sector is
restored. Block 1 holds: position, warps, party (6), money, coins,
registered item, item-terminal items (30), all bag pockets, flags,
vars, game stats, daycare, mail. Block 2 holds: options, play time,
trainer info, encryption key. Load: validate signature/checksum,
pick the newer valid slot, fall back to the backup slot, continue
warp restores position. Save dialog (field menu / script): ask ->
Yes/No -> saving -> saved, or error screen on failure; clear-save
screen and delete-save screen are separate full screens.
HG: same shape with chunk footers, magic + slot id per chunk, two
flash pages compared for newest. BW2: per-block save tables, box
blocks 0 (main) + 1-24 (one per box).
MO today: browser local storage, slots 1-3, up to 8 manual saves +
1 autosave per slot, label = map + lead level, timestamp, load
confirm. That is a save list, not the source block structure.

| # | Source element | Mochiichao replacement | Status |
|---|---|---|---|
| H1 | Save list (multiple saves per slot) | Save list | HAVE (MO list per slot) |
| H2 | Load confirm before overwriting progress | Load confirm | HAVE (MO CONFIRM_LOAD step; form is an overlay div, full-screen form still NEED — see Gaps) |
| H3 | Slot summary (player, map, timestamp) | Slot summary | HAVE (MO slot summaries: player, map, timestamp) |
| H4 | Block 1 field set (party, money, bag, flags, vars, stats, daycare, mail) | Block 1 field set | NEED (MO serialises the whole store, not a block-1 shape) |
| H5 | Block 2 field set (options, play time, trainer info) | Block 2 field set | NEED |
| H6 | Storage block separate from block 1/2 | Storage block | NEED |
| H7 | 2 slots x 14 sectors, 3968 + 128 layout | Sector layout | NEED (MO has 3 slots, no sectors) |
| H8 | Signature + checksum + counter per sector | Signature + checksum + counter | NEED |
| H9 | Rotating write start + damaged-sector skip + last-good restore | Rotating write + damage recovery | NEED |
| H10 | Newest-valid-slot pick on load, backup fallback | Newest-valid pick + fallback | NEED |
| H11 | Save dialog: ask -> Yes/No -> saving -> saved | Save dialog | NEED (MO save is one click, no ask/saving/saved steps) |
| H12 | Save error full screen | Save error screen | NEED |
| H13 | Clear-save-data full screen | Clear-save screen | NEED |
| H14 | Delete-save screen | Delete-save screen | NEED |

## I. Trainer card (title-adjacent) — 0/5 = 0% done

FR trainer card, shown from the field menu player row and from link:
player name, trainer id, money, badge count, play time, party icons,
with a front/back flip in later generations. HG adds the card as a
field-menu row with its own screen. No trainer card screen exists in MO.

| # | Source element | Mochiichao replacement | Status |
|---|---|---|---|
| I1 | Player name + id line | Player name + id line | NEED |
| I2 | Money line | Money line | NEED |
| I3 | Badge count line | Badge count line | NEED |
| I4 | Play time line | Play time line | NEED |
| I5 | Party icons row | Party icons row | NEED |

## Gaps to 100% (77 rows), in build order

1. Field menu screen itself (A1-A9, 9 rows) — the hub everything else
   hangs off; without it, Bag/Roster/Save are reachable only by other
   routes, not the source route.
2. Options screen (C1-C7, 7 rows) + options block in save (H5).
3. Bag pockets/caps/cursors/contexts/actions (D1-D15, 15 rows).
4. Shop quantity, bag-full block, transaction record, special shop
   types (E8-E15, 8 rows).
5. Storage move/release/rename/wallpaper/summary/guards (F1, F9-F16
   except F2-F8 HAVE, 9 rows).
6. Item terminal + mailbox + other terminals (G1-G8, 8 rows).
7. Save block structure, sector/checksum/rotation, dialog, error,
   clear, delete (H4, H6-H14, 11 rows).
8. Main menu + trainer card (B1-B5, I1-I5, 10 rows).
9. Full-screen window forms for the two confirm steps that MO today
   renders as overlay divs (E4, H2 form gap; flows already HAVE).
Total: 9 + 7 + 15 + 8 + 9 + 8 + 11 + 10 + 1 form gap counted inside
E4/H2 = 77 NEED rows (form gap is not a separate row).

## Owed — Mars-only decisions, NOT invented here

1. Canonical box count for Mochiichao: 14 (FR) vs 18 (HG) vs 24
   unlocked 8/16/24 (BW2). MO today has no cap.
2. Canonical bag pockets: FR 5 vs HG 8 vs BW2 5 + Free Space.
   Pocket names for Mochiichao items are Mars's call where no MO
   item exists yet.
3. Release: MO PcView already states Release is deliberately not
   offered. Whether Release is added at all, and its guards, is
   Mars's call.
4. Item descriptions and shop prices for any item that is not already
   a MO item. Existing MO shop prices are kept as-is; no source-game
   item price is copied into a MO price here.
5. Save-shape change: whether the web build keeps browser local
   storage with a block-shaped payload, or moves to a sector-shaped
   payload. The mapping gives the block shape; the storage medium
   choice is Mars's.
6. Frame art for the 10 options frame types (C6).
7. Link-player field-menu row (A9) depends on link play, a later lane.
