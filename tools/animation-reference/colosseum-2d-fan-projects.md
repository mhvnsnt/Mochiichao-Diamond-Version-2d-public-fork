# Colosseum 2D / Arena 2D fan project search (2026-10-25)

Mars cited a Pokemon Colosseum 2D fan project with good fighting
presentation. This file records what was found publicly and why nothing
from those projects was pulled.

## Found (public, but NOT pulled)

- `Freakyy-11/Arena-2D` — "Pokemon 2D arena real time battle game".
  Licence: NONE (no licence file). Skipped: no redistribution licence,
  and its content is Pokemon character content.
- `sunsunyul2014-ai/pokemon-arena` — "Pokemon Arena 2D" web game.
  Licence: NONE. Skipped: no licence, Pokemon content.
- `Blynch17/poke-arena` — "Poke Arena: arena 2D" (Phaser + TypeScript).
  Licence: NONE. Skipped: no licence, Pokemon content.
- `lcheng871118-glitch/Empress-iOS` — unofficial iOS port of the
  fan-made Pokemon 2D Arena (Empress). Licence: NOASSERTION.
  Skipped: licence unclear, and it is a port of a Pokemon fan game.
- `hiro-s-2000/pokemon_arena_2d` — Apache-2.0 licence on file, but the
  repository tree exposes only LICENSE + README while reporting ~420 MB
  of content (asset-heavy). Skipped: no animation code reachable via
  the tree, and pulling the bulk content blind would risk pulling
  Pokemon art, which is excluded.
- `BerserkLove/PokemonColosseum` — "Pokemon Colosseum Fan Game".
  Licence: NONE. Skipped: no licence, Pokemon content.

## Conclusion

No Colosseum 2D / Arena 2D fan project was found with BOTH a clear
open licence AND pullable animation code free of Pokemon character
content. The fighting presentation from those projects is therefore
used as observed movement/timing reference only (recreated in
Mochiichao's own art), while this directory pulls the openly-licensed
equivalents that ARE redistributable: the CC0 fantasy-creature clip
code and the GPL-3.0 Tuxemon battle-animation system.
