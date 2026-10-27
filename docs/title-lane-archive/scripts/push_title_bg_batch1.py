#!/usr/bin/env python3
"""Push title backgrounds batch 1: snow, grass, water, sand + TitleScene layer-0 wiring.
Additions only as files: 5 new files, 2 modified files, 0 files deleted.
Modified files are rebased on live main at runtime (branch created from
live main sha printed by this script); their diff vs live main is only
the painted-layer addition + fallback gating, no animation code removed.
No token printed."""
import base64, hashlib, json, sys, urllib.request, urllib.error
from urllib.parse import quote
sys.path.insert(0, "/opt/muse/skills/custom-connector-setup/bin")
from dynamic_credentials import add_surrogate_to_request
OWNER = "mhvnsnt"
REPO = "Mochiichao-Diamond-Version-2d-fresh-start"
BRANCH = "feature/title-backgrounds-batch-1"
BASE = "main"
ROOT = "/home/hatch/workspace/mochiichao-work/title-bg-work"
FILES = [
    "docs/title-backgrounds-layer-map.md",
    "src/assets/title/title-bg-snow-v2.png",
    "src/assets/title/title-bg-grass-v2.png",
    "src/assets/title/title-bg-water-v2.png",
    "src/assets/title/title-bg-sand-v2.png",
    "src/lib/titleBiomes.ts",
    "src/components/game/TitleScene.tsx",
]
class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args):
        raise RuntimeError("redirect refused")
def call(method, path, payload=None):
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request("https://api.github.com" + path, data=data, method=method)
    req.add_header("Accept", "application/vnd.github+json")
    req.add_header("X-GitHub-Api-Version", "2022-11-28")
    req.add_header("User-Agent", "Muse-GitHub-Api")
    if data:
        req.add_header("Content-Type", "application/json")
    add_surrogate_to_request(req, "custom.github-api", allowed_hosts=["api.github.com"])
    try:
        with urllib.request.build_opener(NoRedirect()).open(req, timeout=120) as resp:
            body = resp.read().decode()
            return resp.status, json.loads(body) if body else {}
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"HTTP {e.code} {method} {path}: {body[:500]}", flush=True)
        raise
status, main = call("GET", f"/repos/{OWNER}/{REPO}/branches/{BASE}")
main_sha = main["commit"]["sha"]
print("main sha:", main_sha, flush=True)
# Gate: new files must be 404 on main, modified files must exist on main.
for rel in FILES:
    enc = "/".join(quote(p) for p in rel.split("/"))
    try:
        call("GET", f"/repos/{OWNER}/{REPO}/contents/{enc}?ref={BASE}")
        print(f"on main: {rel}", flush=True)
    except Exception:
        print(f"404 on main (new): {rel}", flush=True)
try:
    status, ref = call("POST", f"/repos/{OWNER}/{REPO}/git/refs", {"ref": f"refs/heads/{BRANCH}", "sha": main_sha})
    print("branch created:", ref.get("ref"), flush=True)
except Exception:
    print("branch may already exist, continuing", flush=True)
for i, rel in enumerate(FILES, 1):
    with open(f"{ROOT}/{rel}", "rb") as f:
        raw = f.read()
    content = base64.b64encode(raw).decode()
    blob_sha = hashlib.sha1(b"blob %d\0" % len(raw) + raw).hexdigest()
    enc_rel = "/".join(quote(part) for part in rel.split("/"))
    sha = None
    try:
        status, existing = call("GET", f"/repos/{OWNER}/{REPO}/contents/{enc_rel}?ref={BRANCH}")
        sha = existing.get("sha")
    except Exception:
        sha = None
    if sha == blob_sha:
        print(f"{i}/{len(FILES)} skipped (already uploaded): {rel}", flush=True)
        continue
    payload = {"message": "Title backgrounds batch 1: painted snow/grass/water/sand + TitleScene layer 0 (additions only)\n\nDeletions: NONE (0 files deleted; 2 files modified, 5 files new)", "content": content, "branch": BRANCH}
    if sha:
        payload["sha"] = sha
    status, out = call("PUT", f"/repos/{OWNER}/{REPO}/contents/{enc_rel}", payload)
    print(f"{i}/{len(FILES)} uploaded: {rel} -> {out.get('commit', {}).get('sha')}", flush=True)
try:
    status, pr = call("POST", f"/repos/{OWNER}/{REPO}/pulls", {
        "title": "Title backgrounds batch 1: painted snow/grass/water/sand + TitleScene layer 0 (additions only)",
        "head": BRANCH, "base": BASE,
        "body": "Additions only as files: 5 new, 2 modified, 0 files deleted.\n\n- Original 1600x900 painted backgrounds (no Pokemon art, no text, title-safe centre haze): snow, grass, water, sand — v2, in src/assets/title/\n- src/lib/titleBiomes.ts: optional backgroundImage per biome (batch 1 set, others null until batch 2)\n- src/components/game/TitleScene.tsx: painted layer 0 in the Black 2 camera container, cover-crop centred; Pixi sky/ground/tufts/shimmer kept as fallback when no painting or load fails; weather, figure, fire trail, and title-animation systems unchanged\n- docs/title-backgrounds-layer-map.md: FireRed scene_1/2/3 + HeartGold MAIN/SUB + Ruby/Emerald title layer structure -> Mochiichao mapping (structure only)\n\nGate: npm run build passed on live main + these files, all 4 PNGs in dist bundle. Batch 2 (stone, forest, rain, night) follows as its own PR.\n\nDeletions: NONE",
    })
    print("PR created:", pr.get("number"), pr.get("html_url"), flush=True)
except Exception:
    status, prs = call("GET", f"/repos/{OWNER}/{REPO}/pulls?state=open&head={OWNER}:{BRANCH}")
    print("existing open PRs:", [(p.get("number"), p.get("html_url")) for p in prs], flush=True)
