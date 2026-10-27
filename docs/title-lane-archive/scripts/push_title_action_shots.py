#!/usr/bin/env python3
"""Push title action-shot drafts batch: 10 drafts + layering/setup + animation research + Gabu leaves.
Additions only as files: 12 new, 3 modified, 0 files deleted. No token printed."""
import base64, hashlib, json, sys, urllib.request, urllib.error
from urllib.parse import quote
sys.path.insert(0, "/opt/muse/skills/custom-connector-setup/bin")
from dynamic_credentials import add_surrogate_to_request
OWNER = "mhvnsnt"
REPO = "Mochiichao-Diamond-Version-2d-fresh-start"
BRANCH = "feature/title-action-shots-ship-1"
BASE = "main"
ROOT = "/home/hatch/workspace/mochiichao-work/title-bg-work"
FILES = [
    "src/assets/title/draft-yogiferno-action-shot-v1.png",
    "src/assets/title/draft-sproutle-action-shot-v1.png",
    "src/assets/title/draft-dorowani-action-shot-v1.png",
    "src/assets/title/draft-tyrage-action-shot-v2.png",
    "src/assets/title/draft-razorgater-action-shot-v1.png",
    "src/assets/title/draft-gabu-action-shot-v2.png",
    "src/assets/title/draft-mochii-action-shot-v1.png",
    "src/assets/title/draft-wispkin-action-shot-v1.png",
    "src/assets/title/draft-mythar-action-shot-v1.png",
    "src/assets/title/draft-kittember-action-shot-v1.png",
    "src/lib/titleActionShots.ts",
    "docs/title-action-shots-layer-setup.md",
    "src/lib/titleCardEffects.ts",
    "src/components/game/TitleScene.tsx",
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
        with urllib.request.build_opener(NoRedirect()).open(req, timeout=180) as resp:
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
    payload = {"message": "Title action shots: save 10 drafts + layering/setup + animation research, Gabu leaves\n\nDeletions: NONE (0 files deleted; 12 files new, 3 files modified)", "content": content, "branch": BRANCH}
    if sha:
        payload["sha"] = sha
    status, out = call("PUT", f"/repos/{OWNER}/{REPO}/contents/{enc_rel}", payload)
    print(f"{i}/{len(FILES)} uploaded: {rel} -> {out.get('commit', {}).get('sha')}", flush=True)
try:
    status, pr = call("POST", f"/repos/{OWNER}/{REPO}/pulls", {
        "title": "Title action shots: save 10 drafts + layering/setup + animation research, Gabu leaves",
        "head": BRANCH, "base": BASE,
        "body": "Additions only as files: 12 new, 3 modified, 0 files deleted.\n\nMars 2026-10-26 ~06:52-06:55 CDT:\n- Save the 10 action shots EXACTLY as shown, as DRAFTS, with their layering and setup, for future combat/battle/environment scenes (more detailed, more built, more interactive than Pokemon).\n- Gabu: LEAVES around him instead of bubbles (bubbles were a leftover from his old water placement).\n- Animated versions come next with DIFFERENT filenames, never overwriting drafts.\n- Animate like the Pokemon title screens: research the actual Pokemon game files, per-card individual placement and animation styles, centre entrance -> move to a side -> action loop while press-start blinks.\n\nFiles:\n- 10 draft PNGs (1600x900) under draft- filenames: Yogiferno v1, Sproutle v1, Dorowani v1, Tyrage v2 (v1 faint sand stays staging-only), Razorgater v1, Gabu v2 LEAVES (v1 bubbles stays staging-only), Mochii v1, Wispkin v1, Mythar v1, Kittember v1.\n- src/lib/titleActionShots.ts (new): draft table + per-card animation styles (rest sides left/right, Mythar stays centre).\n- docs/title-action-shots-layer-setup.md (new): L0 background -> L1 card effect -> L2 cutout only -> L3 burst at FireRed scene-3 frame 270 -> L4 foreground; Pokemon research (FireRed title state machine, BlinkPressStart 60 then 30 frames, intro scene entrance/pan is where creatures move, NOT title screen - centre->side is a Mochiichao adaptation, labelled as such); reuse template for combat/battle/environment scenes (not built here).\n- titleCardEffects.ts: Gabu burst bubbles -> leaves, colour 0x4ade80.\n- TitleScene.tsx: leaves burst drawn as green ellipses that flutter down and sway.\n- docs/title-backgrounds-layer-map.md: counts updated.\n\nGate: npm run build passed on live main + these files. Draft PNGs are repo data files, not yet imported by game code, so they are not bundled in dist - wiring is the next step, not claimed here.\n\nDeletions: NONE",
    })
    print("PR created:", pr.get("number"), pr.get("html_url"), flush=True)
except Exception:
    status, prs = call("GET", f"/repos/{OWNER}/{REPO}/pulls?state=open&head={OWNER}:{BRANCH}")
    print("existing open PRs:", [(p.get("number"), p.get("html_url")) for p in prs], flush=True)
