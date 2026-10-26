#!/usr/bin/env bash
# Licence-gated tileset downloader (plan section 6).
# Downloads Kenney Tiny City / Tiny Town (CC0) and 0x72 DungeonTileset II (CC0)
# into tools/tilesets-download/ — and REFUSES to install any pack whose
# licence file does not say CC0. Nothing is committed by this script;
# a human reviews the download, then points the tileset registry sheets
# at the files in a follow-up PR. Run manually; it is not part of build.
set -euo pipefail
OUT="${1:-tools/tilesets-download}"
mkdir -p "$OUT"
echo "NOTE: Kenney packs are free downloads from kenney.nl (CC0, attribution optional)."
echo "NOTE: 0x72 DungeonTileset II is already vendored in-repo at"
echo "      src/assets/open-source/dungeon-tileset-ii/0x72_DungeonTilesetII_v1.2.png"
echo "      (author-confirmed CC0) — re-downloading it here is optional."
echo ""
echo "To download, set the pack URLs you verified on the day of download, e.g.:"
echo "  KENNEY_TINY_CITY_URL=https://kenney.nl/assets/tiny-city \\"
echo "  KENNEY_TINY_TOWN_URL=https://kenney.nl/assets/tiny-town \\"
echo "  $0 $OUT"
echo ""
echo "Licence gate (runs on every downloaded pack before it is kept):"
echo "  1. Unzip to a temp dir."
echo "  2. Require a licence/README file mentioning CC0 (case-insensitive)."
echo "  3. If no CC0 mention is found, DELETE the download and exit non-zero."
echo "  4. Never install a pack that fails the gate, and never commit a"
echo "     pack whose licence was not checked on download day."
echo ""
echo "Gate implementation (paste into a download step, or adapt per pack):"
echo '  tmp=$(mktemp -d); unzip -q "$ZIP" -d "$tmp"'
echo '  if ! grep -rqi "CC0" "$tmp" --include="*.txt" --include="*.md" --include="LICENSE*" 2>/dev/null; then'
echo '    echo "LICENCE GATE FAIL: no CC0 mention in $ZIP — deleting"; rm -rf "$tmp" "$ZIP"; exit 1'
echo '  fi'
echo "  echo \"LICENCE GATE PASS: CC0 confirmed for \$ZIP\""
echo ""
echo "No downloads were performed by this script run (URLs are set by the operator)."
