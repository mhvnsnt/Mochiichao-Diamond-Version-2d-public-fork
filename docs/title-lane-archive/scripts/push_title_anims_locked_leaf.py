#!/usr/bin/env python3
"""Push locked per-card anims + leaf research + complex v2 spec.
Additions: 20 anim files (10 GIF + 10 keyframe PNG, Gabu v2, others v1)
+ 2 new docs; modified: titleActionShots.ts, TitleScene.tsx, 2 layer docs.
0 files deleted. No token printed. Run only after action-anims rebuild finishes."""
import base64, hashlib, json, sys, urllib.request, urllib.error
from urllib.parse import quote
sys.path.insert(0, "/opt/muse/skills/custom-connector-setup/bin")
from dynamic_credentials import add_surrogate_to_request
OWNER = "mhvnsnt"; REPO = "Mochiichao-Diamond-Version-2d-fresh-start"
BRANCH = "feature/title-anims-locked-leaf-1"; BASE = "main"
ROOT = "/home/hatch/workspace/mochiichao-work/title-bg-work"
ANIM = "/home/hatch/workspace/mochiichao-work/ui-art/title-backgrounds/action-anims"
CREATURES = ["yogiferno", "sproutle", "dorowani", "tyrage", "razorgater", "gabu", "mochii", "wispkin", "mythar", "kittember"]
FILES = []
for c in CREATURES:
    v = "v2" if c == "gabu" else "v1"
    FILES.append((f"{ANIM}/{c}-action-anim-{v}.gif", f"src/assets/title/{c}-action-anim-{v}.gif"))
    FILES.append((f"{ANIM}/{c}-action-anim-{v}.png", f"src/assets/title/{c}-action-anim-{v}.png"))
FILES += [
    (f"{ROOT}/docs/title-pokemon-leaf-research.md", "docs/title-pokemon-leaf-research.md"),
    (f"{ROOT}/docs/title-animation-v2-complex.md", "docs/title-animation-v2-complex.md"),
    (f"{ROOT}/src/lib/titleActionShots.ts", "src/lib/titleActionShots.ts"),
    (f"{ROOT}/src/components/game/TitleScene.tsx", "src/components/game/TitleScene.tsx"),
    (f"{ROOT}/docs/title-action-shots-layer-setup.md", "docs/title-action-shots-layer-setup.md"),
    (f"{ROOT}/docs/title-backgrounds-layer-map.md", "docs/title-backgrounds-layer-map.md"),
]
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
for _, rel in FILES:
    enc = "/".join(quote(p) for p in rel.split("/"))
    try:
        call("GET", f"/repos/{OWNER}/{REPO}/contents/{enc}?ref={BASE}"); print(f"on main: {rel}", flush=True)
    except Exception:
        print(f"404 on main (new): {rel}", flush=True)
try:
    status, ref = call("POST", f"/repos/{OWNER}/{REPO}/git/refs", {"ref": f"refs/heads/{BRANCH}", "sha": main_sha}); print("branch created:", ref.get("ref"), flush=True)
except Exception:
    print("branch may already exist, continuing", flush=True)
for i, (local, rel) in enumerate(FILES, 1):
    raw = open(local, "rb").read(); content = base64.b64encode(raw).decode()
    blob_sha = hashlib.sha1(b"blob %d\0" % len(raw) + raw).hexdigest()
    enc_rel = "/".join(quote(part) for part in rel.split("/")); sha = None
    try:
        status, existing = call("GET", f"/repos/{OWNER}/{REPO}/contents/{enc_rel}?ref={BRANCH}"); sha = existing.get("sha")
    except Exception:
        sha = None
    if sha == blob_sha:
        print(f"{i}/{len(FILES)} skipped (already uploaded): {rel}", flush=True); continue
    payload = {"message": "Title anims locked + Pokemon leaf research + complex animation v2 spec\n\nDeletions: NONE (0 files deleted)", "content": content, "branch": BRANCH}
    if sha: payload["sha"] = sha
    status, out = call("PUT", f"/repos/{OWNER}/{REPO}/contents/{enc_rel}", payload)
    print(f"{i}/{len(FILES)} uploaded: {rel} -> {out.get('commit', {}).get('sha')}", flush=True)
try:
    status, pr = call("POST", f"/repos/{OWNER}/{REPO}/pulls", {
        "title": "Title anims locked + Pokemon leaf research + complex animation v2 spec",
        "head": BRANCH, "base": BASE,
        "body": "Additions only as files: 22 new, 4 modified, 0 files deleted.\n\nMars 2026-10-26 ~07:07 CDT:\n- Per-card animation styles LOCKED (his words: lock those in, those are good) - recorded in titleActionShots.ts header.\n- Gabu leaves: use the actual leaves from the Pokemon game files. Research in docs/title-pokemon-leaf-research.md: LeafGreen leaves are 16x16, 11 tumbling frames (tiles 0..40 step 4, 8 frames each, loop 88 frames), spawn right edge y 32..119, move left 1-3 px/frame with small vertical drift, new leaf every 6..11 frames, plus streaks at 7 px/frame. Pokemon tile pixels NOT shipped (no Pokemon art in any PR, pull-then-swap rule); Gabu's leaf is a Mochiichao-original pointed blade + stem + vein in the same 3 greens, tumbling as it moves. Gabu anim is v2 with real, larger leaves; draft-gabu-action-shot-v2.png NOT overwritten. The v1 Gabu anim preview shown earlier (green-ellipse leaves) was staging-only and is NOT shipped - v2 supersedes it.\n- More detailed/complex animation than Pokemon's, built on Pokemon file structure: docs/title-animation-v2-complex.md - 9 moving layers (background drift, weather, streaks, entrance, action loop, burst, secondary ambient, foreground, camera, press-start blink tempo) vs Pokemon title's 2 tasks (blink + one spawner).\n- Anim files: 10 GIF previews (800x450, 36 frames, centre entrance -> locked rest side -> action loop) + 10 burst-moment keyframe PNGs, Gabu v2, others v1. Full-res anims + full v2 game wiring are next, after Mars okays these previews.\n- TitleScene.tsx: leaves burst + leaf weather now drawn as pointed leaf blade + stem, not ellipses.\n\nGate: npm run build passed on live main + these files. Anim GIFs/PNGs are repo preview assets, not yet imported by game code, so they are not bundled in dist - wiring is next, not claimed here.\n\nDeletions: NONE",
    })
    print("PR created:", pr.get("number"), pr.get("html_url"), flush=True)
except Exception:
    status, prs = call("GET", f"/repos/{OWNER}/{REPO}/pulls?state=open&head={OWNER}:{BRANCH}")
    print("existing open PRs:", [(p.get("number"), p.get("html_url")) for p in prs], flush=True)
