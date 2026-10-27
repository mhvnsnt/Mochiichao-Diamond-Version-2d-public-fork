#!/usr/bin/env python3
"""Push title backgrounds batch 2: stone, forest, rain, night.
Additions only as files: 4 new files, 1 modified file, 0 files deleted.
No token printed."""
import base64, hashlib, json, sys, urllib.request, urllib.error
from urllib.parse import quote
sys.path.insert(0, "/opt/muse/skills/custom-connector-setup/bin")
from dynamic_credentials import add_surrogate_to_request
OWNER = "mhvnsnt"
REPO = "Mochiichao-Diamond-Version-2d-fresh-start"
BRANCH = "feature/title-card-motion-1"
BASE = "main"
ROOT = "/home/hatch/workspace/mochiichao-work/title-bg-work"
FILES = [
    "src/lib/titleCardEffects.ts",
    "src/components/game/TitleScene.tsx",
    "src/components/game/TitleCreatureFigure.tsx",
    "src/components/game/YogifernoTitleWalk.tsx",
    "docs/title-backgrounds-layer-map.md",
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
    payload = {"message": "Title card motion batch 3: per-biome drift, foreground frame, per-card effects, creature actions (additions only as files)\n\nDeletions: NONE (0 files deleted; 4 files modified, 1 file new)", "content": content, "branch": BRANCH}
    if sha:
        payload["sha"] = sha
    status, out = call("PUT", f"/repos/{OWNER}/{REPO}/contents/{enc_rel}", payload)
    print(f"{i}/{len(FILES)} uploaded: {rel} -> {out.get('commit', {}).get('sha')}", flush=True)
try:
    status, pr = call("POST", f"/repos/{OWNER}/{REPO}/pulls", {
        "title": "Title card motion batch 3: per-biome drift, foreground frame, per-card effects, creature actions",
        "head": BRANCH, "base": BASE,
        "body": "Additions only as files: 1 new, 4 modified, 0 files deleted.\n\nPer-biome background motion + layering + effects per title card, per Mars 2026-10-25 order (all 8 static v2 backgrounds already approved).\n\n- NEW src/lib/titleCardEffects.ts: per-biome drift (HeartGold flyover speed order, far layer slowest), per-card signature effect, creature-to-card assignment with sources labelled, per-creature action + burst (FireRed intro scene 3 order: idle -> hop -> burst -> recoil, 360-frame cycle)\n- src/components/game/TitleScene.tsx: painted background drifts inside 1.06 cover overscan (no edge reveal), foreground frame in front of the figure feet, card effect layer (snow twinkle, grass pollen, water ripple rings, sand motes, stone scan-line for Razorgater, forest fireflies, rain lightning every 420 frames + splashes, night star twinkle), creature action bursts (bubbles/sparks/sand/smoke/fire/shield/sparkle)\n- src/components/game/TitleCreatureFigure.tsx: each creature now shows on its own card (primaryCardForCreature) + figureName for its action\n- src/components/game/YogifernoTitleWalk.tsx: figureName=Yogiferno for its roar + fire burst\n- docs/title-backgrounds-layer-map.md: updated layer order + drift table + assignment table\n\nAssignment sources: 8/10 from canon-vfx/title-vibe/canon-habitat, 2/10 PROPOSED (Gabu -> water, Kittember -> night) and labelled as such in the data file for Mars to correct; rain card has no primary creature yet.\n\nNOT claimed: Pixi DisplacementFilter water ripple (researched, needs a displacement texture asset, later one-filter addition); full-screen TITLE phase swap; live animated playback needs a Pages rebuild.\n\nGate: npm run build passed on live main + these files, all 8 title-bg PNGs in dist bundle.\n\nDeletions: NONE",
    })
    print("PR created:", pr.get("number"), pr.get("html_url"), flush=True)
except Exception:
    status, prs = call("GET", f"/repos/{OWNER}/{REPO}/pulls?state=open&head={OWNER}:{BRANCH}")
    print("existing open PRs:", [(p.get("number"), p.get("html_url")) for p in prs], flush=True)
