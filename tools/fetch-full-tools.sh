#!/bin/sh
# Re-clone full upstream tool repos for study. The vendored core in
# tools/ is already in this repo; this script is only for the full
# upstream (docs, tests, sample images) when you need it.
# Usage: sh tools/fetch-full-tools.sh [target-dir, default: tools-full]
set -e
TARGET="${1:-tools-full}"
mkdir -p "$TARGET"
cd "$TARGET"
for repo in mxgmn/WaveFunctionCollapse ondras/rot.js Auburn/FastNoiseLite devkitPro/ndstool Barubary/dsdecmp; do
  name=$(basename "$repo")
  if [ ! -d "$name" ]; then
    git clone --depth 1 "https://github.com/$repo.git" "$name"
  else
    echo "$name already present, skipping"
  fi
done
echo "Done. Full tools in $TARGET (not committed to the repo)."
