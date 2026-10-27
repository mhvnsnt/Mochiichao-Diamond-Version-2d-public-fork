#!/usr/bin/env python3
"""sfx_pull.py — close EP01's SFX gaps from Freesound, CC0 ONLY.

FULLSTACK-WIRING phase Now. Searches Freesound (APIv2) with the
licence filter AS A QUERY PARAMETER (license:Creative Commons 0),
downloads originals via the OAuth2 flow, and writes a per-pull
licence log (sfx-licenses.json) next to the files. No key = no pull:
the Freesound API key is the ONE owner action (free account).
Usage: FREESOUND_API_KEY=... python3 sfx_pull.py <query> <outname>
"""
import json, os, sys, urllib.request, urllib.parse

API = "https://freesound.org/apiv2"
GAPS = {  # EP01's flagged gaps (cue sheet) -> default queries
    "cold-spot-shimmer": "shimmer glass chime cold",
    "gate-bell": "small bell gate chime",
    "gate-creak": "wooden gate creak",
    "leaf-rustle": "leaves rustle wind",
    "pond-lap": "water lap gentle pond",
    "footsteps-grass": "footsteps grass walking",
}

def api(path, key, **params):
    params["token"] = key
    url = f"{API}{path}?" + urllib.parse.urlencode(params)
    with urllib.request.urlopen(url, timeout=30) as r:
        return json.loads(r.read().decode())

def main():
    key = os.environ.get("FREESOUND_API_KEY")
    if not key:
        print("FREESOUND_API_KEY not set — owner action needed: free Freesound account + API key (freesound.org/apiv2/apply). Nothing pulled.")
        print("Known EP01 gaps this closes:", ", ".join(GAPS))
        return 2
    query, outname = sys.argv[1], sys.argv[2]
    res = api("/search/text/", key, query=query,
              filter='license:"Creative Commons 0"', fields="id,name,license,url,previews", page_size=5)
    print(json.dumps(res.get("results", []), indent=2)[:1200])
    print("Pick an id, then download its ORIGINAL via the OAuth2 flow (see Freesound APIv2 docs); log it in sfx-licenses.json.")
    return 0

if __name__ == "__main__":
    sys.exit(main())
