#!/usr/bin/env python3
"""Push TitleScene v2 wiring: entrance + locked rest + wind streaks. 2 modified files, 0 deletions. No token printed."""
import base64, hashlib, json, sys, urllib.request, urllib.error
from urllib.parse import quote
sys.path.insert(0, "/opt/muse/skills/custom-connector-setup/bin")
from dynamic_credentials import add_surrogate_to_request
OWNER = "mhvnsnt"; REPO = "Mochiichao-Diamond-Version-2d-fresh-start"
BRANCH = "feature/title-scene-v2-wiring-1"; BASE = "main"
ROOT = "/home/hatch/workspace/mochiichao-work/title-bg-work"
FILES = ["src/components/game/TitleScene.tsx", "docs/title-backgrounds-layer-map.md"]
class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args):
        raise RuntimeError("redirect refused")
def call(method, path, payload=None):
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request("https://api.github.com" + path, data=data, method=method)
    req.add_header("Accept", "application/vnd.github+json"); req.add_header("X-GitHub-Api-Version", "2022-11-28"); req.add_header("User-Agent", "Muse-GitHub-Api")
    if data: req.add_header("Content-Type", "application/json")
    add_surrogate_to_request(req, "custom.github-api", allowed_hosts=["api.github.com"])
    try:
        with urllib.request.build_opener(NoRedirect()).open(req, timeout=180) as resp:
            body = resp.read().decode(); return resp.status, json.loads(body) if body else {}
    except urllib.error.HTTPError as e:
        print(f"HTTP {e.code} {method} {path}: {e.read().decode()[:500]}", flush=True); raise
status, main = call("GET", f"/repos/{OWNER}/{REPO}/branches/{BASE}")
main_sha = main["commit"]["sha"]; print("main sha:", main_sha, flush=True)
for rel in FILES:
    enc = "/".join(quote(p) for p in rel.split("/"))
    try:
        call("GET", f"/repos/{OWNER}/{REPO}/contents/{enc}?ref={BASE}"); print(f"on main: {rel}", flush=True)
    except Exception:
        print(f"404 on main (new): {rel}", flush=True)
try:
    status, ref = call("POST", f"/repos/{OWNER}/{REPO}/git/refs", {"ref": f"refs/heads/{BRANCH}", "sha": main_sha}); print("branch created:", ref.get("ref"), flush=True)
except Exception:
    print("branch may already exist, continuing", flush=True)
for i, rel in enumerate(FILES, 1):
    raw = open(f"{ROOT}/{rel}", "rb").read(); content = base64.b64encode(raw).decode()
    blob_sha = hashlib.sha1(b"blob %d\0" % len(raw) + raw).hexdigest()
    enc_rel = "/".join(quote(part) for part in rel.split("/")); sha = None
    try:
        status, existing = call("GET", f"/repos/{OWNER}/{REPO}/contents/{enc_rel}?ref={BRANCH}"); sha = existing.get("sha")
    except Exception:
        sha = None
    if sha == blob_sha:
        print(f"{i}/{len(FILES)} skipped (already uploaded): {rel}", flush=True); continue
    payload = {"message": "TitleScene v2 wiring: locked entrance + rest + wind streaks\n\nDeletions: NONE (0 files deleted; 2 files modified)", "content": content, "branch": BRANCH}
    if sha: payload["sha"] = sha
    status, out = call("PUT", f"/repos/{OWNER}/{REPO}/contents/{enc_rel}", payload)
    print(f"{i}/{len(FILES)} uploaded: {rel} -> {out.get('commit', {}).get('sha')}", flush=True)
try:
    status, pr = call("POST", f"/repos/{OWNER}/{REPO}/pulls", {
        "title": "TitleScene v2 wiring: locked entrance + rest side + wind streaks",
        "head": BRANCH, "base": BASE,
        "body": "Wiring only: 2 files modified, 0 files deleted.\n\nLocked styles (Mars 2026-10-26 ~07:07 CDT, titleActionShots.ts TITLE_CARD_ANIMATION_STYLES, restX in 1600-wide draft px):\n- Entrance: figure fades in at centre for frames 0-59, then eases out (cubic) to its locked rest offset over frames 60-119. Rest offset in scene px = restX * (W/1600). Left -140: Yogiferno, Dorowani, Razorgater, Gabu, Wispkin. Right +140: Sproutle, Tyrage, Mochii, Kittember. Centre 0: Mythar, stays centre, never grounds (existing orbit -18 still applies).\n- After entrance, the existing 360-frame action loop runs at the rest position (figure.x = rest + existing sway/recoil). The old endless walk across the screen is replaced for styled figures ONLY; unset figures keep the old walk unchanged, no action claimed. Shadow follows figure.x and stays on the ground, unchanged. Fire trail now spawns from figure.x (same feet position, works for both paths).\n- Wind streaks (LeafGreen streak idea, docs/title-pokemon-leaf-research.md): 4 thin lines, moving left at 7 px/frame at the 1600 reference scaled by W/1600, wrapping to the right edge, heights cycling (0.25/0.5/0.68/0.4 of H), alpha 0.3, created BEFORE the figure so they sit behind it. Separate from the existing FireRed streak spawner (leaf biomes only, alpha 0.7, in front), which is untouched.\n- Unchanged: bursts (including Gabu leaves as pointed blade + stem), card effects, background drift, Black 2 camera, foreground frame, shadow behaviour, reduced-motion static path. No logo, font, subtitle, main-menu, IntroSequence, StartScreenPlayer, or IntroVideoPlayer changes in this PR.\n\nGate: npm run build passed on live main + these files. Git status: 2 modified files, 0 file deletions, no other lane's files touched.\n\nDeletions: NONE",
    })
    print("PR created:", pr.get("number"), pr.get("html_url"), flush=True)
except Exception:
    status, prs = call("GET", f"/repos/{OWNER}/{REPO}/pulls?state=open&head={OWNER}:{BRANCH}")
    print("existing open PRs:", [(p.get("number"), p.get("html_url")) for p in prs], flush=True)
