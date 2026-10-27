#!/usr/bin/env python3
"""Push title backgrounds batch 6: Mythar own pearl card + Kittember own lantern card.
Additions only as files: 2 new PNGs, 4 modified files, 0 files deleted.
No token printed."""
import base64, hashlib, json, sys, urllib.request, urllib.error
from urllib.parse import quote
sys.path.insert(0, "/opt/muse/skills/custom-connector-setup/bin")
from dynamic_credentials import add_surrogate_to_request
OWNER = "mhvnsnt"
REPO = "Mochiichao-Diamond-Version-2d-fresh-start"
BRANCH = "feature/title-new-cards-mythar-lantern-1"
BASE = "main"
ROOT = "/home/hatch/workspace/mochiichao-work/title-bg-work"
FILES = [
    "src/assets/title/title-bg-mythar-v2.png",
    "src/assets/title/title-bg-lantern-v2.png",
    "src/lib/titleBiomes.ts",
    "src/lib/titleCardEffects.ts",
    "src/components/game/TitleCreatureFigure.tsx",
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
    payload = {"message": "Title backgrounds batch 6: Mythar own pearl card + Kittember own lantern card (additions only as files)\n\nDeletions: NONE (0 files deleted; 2 files new, 4 files modified)", "content": content, "branch": BRANCH}
    if sha:
        payload["sha"] = sha
    status, out = call("PUT", f"/repos/{OWNER}/{REPO}/contents/{enc_rel}", payload)
    print(f"{i}/{len(FILES)} uploaded: {rel} -> {out.get('commit', {}).get('sha')}", flush=True)
try:
    status, pr = call("POST", f"/repos/{OWNER}/{REPO}/pulls", {
        "title": "Title backgrounds batch 6: Mythar own pearl card + Kittember own lantern card, Gabu forest confirmed",
        "head": BRANCH, "base": BASE,
        "body": "Additions only as files: 2 new, 4 modified, 0 files deleted.\n\nMars corrections 2026-10-26 ~00:14 CDT (data + 2 new paintings, no existing painting overwritten, no text in either painting):\n- Mythar gets his OWN card: pearlescent iridescent diamond-pearl background with sparkles and sine waves, real sparkly and diamond-like (Mars's 2026-10-25 description, recovered from memory: 'pearl / diamond iridescent - sine-wave rings, diamond sparkles'). New file title-bg-mythar-v2.png, biome id 'mythar', diamond-sparkle twinkle effect, slow prism drift -2/2 @0.15.\n- Kittember gets his OWN card: a night card with lanterns surrounding it, illuminating the area, while Kittember's ember also illuminates the area. New file title-bg-lantern-v2.png, biome id 'lantern', warm-amber lantern glow pulse effect, night-slow drift -3/1 @0.12.\n- Night keeps Wispkin only. The old '8 cards, night holds 3' model is superseded.\n- Gabu forest CONFIRMED (Mars 2026-10-26 ~00:15 CDT: 'Gabu is good for forest'), no longer a proposed fill; source 'mars-confirmed' added to titleCardEffects.ts.\n\nCount: 10 cards, 10 title-pool creatures, one per card, 0/10 PROPOSED, no card empty.\n\nGate: npm run build passed on live main + these files; both new PNGs bundled in dist.\n\nDeletions: NONE",
    })
    print("PR created:", pr.get("number"), pr.get("html_url"), flush=True)
except Exception:
    status, prs = call("GET", f"/repos/{OWNER}/{REPO}/pulls?state=open&head={OWNER}:{BRANCH}")
    print("existing open PRs:", [(p.get("number"), p.get("html_url")) for p in prs], flush=True)
