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
BRANCH = "feature/title-card-water-ripple-1"
BASE = "main"
ROOT = "/home/hatch/workspace/mochiichao-work/title-bg-work"
FILES = [
    "src/components/game/TitleScene.tsx",
    "src/lib/titleCardEffects.ts",
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
    payload = {"message": "Title card water ripple batch 4: Pixi DisplacementFilter on water card only (additions only as files)\n\nDeletions: NONE (0 files deleted; 3 files modified, 0 files new)", "content": content, "branch": BRANCH}
    if sha:
        payload["sha"] = sha
    status, out = call("PUT", f"/repos/{OWNER}/{REPO}/contents/{enc_rel}", payload)
    print(f"{i}/{len(FILES)} uploaded: {rel} -> {out.get('commit', {}).get('sha')}", flush=True)
try:
    status, pr = call("POST", f"/repos/{OWNER}/{REPO}/pulls", {
        "title": "Title card water ripple batch 4: Pixi DisplacementFilter on water card only",
        "head": BRANCH, "base": BASE,
        "body": "Additions only as files: 0 new, 3 modified, 0 files deleted.\n\nWater card only: PixiJS v8 DisplacementFilter ripple (official Pixi docs, red=horizontal, green=vertical), scale {x:14, y:10}. Displacement map generated in code (64x64 random grayscale upscaled with smoothing to 256x256, repeat wrap, scrolling 20px/s x / 12px/s y) — no texture asset shipped. Map sprite added to the scene with renderable=false (filter constructor sets that), so the map never draws. Ripple rings + shimmer stay as fallback; skipped under prefers-reduced-motion.\n\nAlso documents the researched rain-card candidate (NOT wired): Stormtalon #021, canon manifest 'summons dark clouds and lightning when it flaps' — not in the 10-creature title pool, no clean cutout, so adding him is a pool + art decision for Mars.\n\nGate: npm run build passed on live main + these files.\n\nDeletions: NONE",
    })
    print("PR created:", pr.get("number"), pr.get("html_url"), flush=True)
except Exception:
    status, prs = call("GET", f"/repos/{OWNER}/{REPO}/pulls?state=open&head={OWNER}:{BRANCH}")
    print("existing open PRs:", [(p.get("number"), p.get("html_url")) for p in prs], flush=True)
