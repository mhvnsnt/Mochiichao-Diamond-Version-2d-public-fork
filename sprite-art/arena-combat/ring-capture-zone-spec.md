# Ring capture zone spec — retro-arcade-themed zone, ring mechanic unchanged (Mars, 2026-10-25 ~19:49 + ~19:51 + ~19:54 CDT)

Status: SPEC + GATE CODE ONLY. No zone map, no shop UI, no art is built
here. The gate code lives in `captureLoop.js`
(`isRingCaptureUnlocked`, `consumeRingItem`); this spec is the design
that code gates. Standing scope rule applies: moves/animations come in
100%; the only exclusions are Pokemon creature names, sounds, art, and
dialogue — none of those appear here.

## 1. What changed, in order (so no earlier draft is mistaken for current)

- ~19:45 CDT: Mars said ring capture was NOT wanted; capture is normal
  Pokemon-style (Luigi Cubes in Mochiichao canon).
- ~19:49 CDT: refinement — ring capture RETURNS as an OPTIONAL,
  proprietary-to-Mochiichao system: a new zone introduces it, visiting
  + playing that zone unlocks it, shops then sell ring-capture items,
  and the player can ring-capture whenever they want afterwards.
  Default capture stays Luigi Cubes at all times.
- ~19:51 CDT: correction — the zone is NOT the Safari Zone. Mochiichao
  already has its own Safari/preserve area at Harbor City (five-region
  canon, Dojo 6 / Wave-Ride beat). The ring zone is a NEW, SEPARATE
  zone, and its name is arcade-evocative.
- ~19:54 CDT: theme correction, SUPERSEDING the arcade-as-mechanic
  reading — the arcade part is NAME AND THEME ONLY. The zone FEELS
  like walking into a game arcade full of retro games (cabinets, neon,
  retro-game scenery as the SETTING and VIBE), but it is called
  something DIFFERENT from "Arcade Zone". The ring capture MECHANIC
  itself STAYS ring capture (Mochiichao's own version), played inside
  that retro-arcade-themed zone. There is NO token economy, NO cabinet
  mini-game layer, and NO high-score scoring mechanic in this design —
  any earlier draft containing those is superseded and must not be
  implemented from.

## 2. Zone name — CANDIDATES FOR MARS TO PICK (nothing locked)

The exact name is Mars's pick. All three are arcade-evocative WITHOUT
literally being "Arcade Zone":

1. **The Ringcade** — the tightest ring + arcade blend; reads instantly,
   shortest signage, easiest to say in dialogue. Risk: it sounds like a
   single cabinet rather than a whole zone.
2. **Neon Loop Hall** — neon (the arcade vibe) + loop (the ring action)
   + hall (a place, not a game). Reads as a venue you walk into.
   Risk: "loop" is slightly less obvious than "ring" at a glance.
3. **Pixel Ring Hall** — pixel (retro-game vibe) + ring (the mechanic)
   + hall (a venue). Most explicit that the setting is retro.
   Risk: longest of the three; "pixel" dates the theme to one era.

Until Mars picks, code and docs refer to it only as "the arcade ring
zone". Do NOT silently lock any candidate into a map label, shop sign,
or dialogue line.

## 3. Zone purpose, theme, and layout (concept, not a map)

- A standalone zone, separate from Harbor City's preserve. No preserve
  rules apply here (no step limits, no preserve-only creatures, no
  Wave-Ride gating).
- Purpose in one line: teach ring capture by playing it, then let the
  player take it outside.
- **Theme (setting only):** walking in feels like walking into a retro
  game arcade — rows of cabinets, neon signage, retro-game scenery and
  decor, arcade ambience. The cabinets are SCENERY: they are not
  playable mini-games, they cost nothing, they award nothing, and
  they do not teach or gate anything. If a player examines one, the
  most it does is describe the decor.
- Layout concept (for the overworld agent to build, not built here):
  an entrance, a practice area where the tutorial ring capture happens
  (§5), open floor space dressed with cabinet rows and neon, and an
  exit. No prize counter, no token exchange, no scoreboard — those
  belonged to the superseded mechanic reading and are NOT part of
  this zone.

## 4. Ring-capture items and shops

- **Ring-capture items** are ordinary shop stock, bought with regular
  currency — exactly like Luigi Cubes, not a zone currency. They are
  the physical items spent to attempt ring capture (§5).
- **Shops (outside the zone):** once unlocked (§6), ordinary shops
  stock ring-capture items alongside Luigi Cubes. Pricing hooks for
  the shop builder: a ring item should price ABOVE a standard Luigi
  Cube (it buys a second capture system, not a better ball — it does
  not raise capture rate) and BELOW a prime-tier cube (it must never
  become the strictly-best purchase). Exact prices are the shop
  builder's call; the gate code deliberately carries no prices.
- The zone itself does not need to sell anything. If the overworld
  agent places a shop inside the zone, that shop follows the same
  post-unlock stocking rule as every other shop.

## 5. How a ring-capture attempt works (mechanic unchanged)

1. The player opts into ring capture for an encounter (UI choice, not
   default). Starting the attempt spends 1 ring item
   (`consumeRingItem`) — exactly like throwing a ball spends a ball.
   If the player owns 0 ring items, or the zone unlock is absent, the
   option does not appear / is greyed out; normal capture is offered.
2. The attempt IS ring capture, Mochiichao's own version: the player
   traces rings around the wild creature. Each completed closed loop
   fills the capture gauge; the creature struggles, draining the
   gauge and breaking the in-progress ring; a matching-affinity ally
   assist multiplies loop gain (1.5x). A full gauge captures.
3. A broken attempt (gauge drained to 0 by struggles, or the player
   backing out) ends the attempt; the spent ring item is NOT refunded
   (same as a failed ball throw). The player may then throw a Luigi
   Cube or try again with another ring item.
4. Nothing about the attempt is scored, tokenised, or turned into a
   cabinet game. The retro arcade around it is where it happens,
   not what it is.

## 6. Unlock + shop flow (the gate, end to end)

```
visit zone            -> zoneVisited = true
complete tutorial     -> zonePlayed = true   (one full practice capture)
buy items in shops    -> ringItems > 0
ALL THREE             -> isRingCaptureUnlocked() = true -> ring option live
any one missing       -> ring option unavailable; Luigi Cubes unaffected
```

- The tutorial is mandatory the first visit: the player cannot leave
  with the unlock until they have completed one full practice capture
  in the zone's practice area (practice captures never enter the
  party — they are teaching only).
- Flags persist on the save (same save fields the game already uses
  for unlocks; the field names above are the code's `unlock` object
  keys, not a save-format mandate).
- The unlock is permanent once earned. It is never revoked by leaving
  the zone, spending down to 0 items (the option simply greys out
  until restocked), or entering the Harbor City preserve.
- Default capture never changes: at every step above, including
  before the zone exists in the player's path, Luigi Cube capture
  works exactly as before and is the only capture offered.

## 7. What is NOT in this batch (separate work, not silently assumed)

- The zone map, arcade dressing/art, tutorial script, shop UI and
  shop prices, and any creature roster for the zone. The overworld
  agent owns the zone; the shop builder owns prices; the Creature
  Mode lane owns real-time fight-as-creature wiring
  (see `follower/FIGHT-AS-CREATURE-SPEC.md`).
- No franchise names, sounds, art, or dialogue are used anywhere in
  this spec or the gate code. "Safari" above refers only to
  Mochiichao's own Harbor City preserve, to say the ring zone is
  NOT it.
- Explicitly NOT built, per the ~19:54 correction: token economy,
  token-to-item exchange, cabinet mini-games, cabinet fees, and
  high-score scoring. If any of those appear in another lane's work
  as part of ring capture, that work conflicts with this spec and
  needs Mars's call before it ships.
