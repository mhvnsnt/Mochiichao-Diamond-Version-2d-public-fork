#!/bin/sh
# WIELDER launcher — run from anywhere; resolves the package root from
# this script's location. Uses the package virtualenv when present
# (.venv beside this file), else the system python3. The manager's
# surface is `./wielder-cli.sh <command>`; see wielder/cli.py.
set -e
ROOT=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
if [ -x "$ROOT/.venv/bin/python" ]; then PY="$ROOT/.venv/bin/python"; else PY=python3; fi
PYTHONPATH="$ROOT${PYTHONPATH:+:$PYTHONPATH}" exec "$PY" -m wielder.cli "$@"
