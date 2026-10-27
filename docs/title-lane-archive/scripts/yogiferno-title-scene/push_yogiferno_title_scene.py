#!/usr/bin/env python3
"""Yogiferno title/start scene PR, diffed vs verified main 88afa62c.
Additions/changes only, 0 file deletions. No git commit from any dirty
tree — files are read from the clean clone at
~/workspace/mochiichao-work/yogiferno-title-scene/repo (HEAD 88afa62c).
No Pokemon creature art, logo, names, dialogue, music, or texture
files. Generic terrain/weather only + our own Yogiferno cutout.
No package.json/package-lock changes. No token printed."""
import base64, hashlib, json, os, sys, time, urllib.request, urllib.error
from urllib.parse import quote
sys.path.insert(0, "/opt/muse/skills/custom-connector-setup/bin")
from dynamic_credentials import add_surrogate_to_request
OWNER = "mhvnsnt"
REPO = "Mochiichao-Diamond-Version-2d-fresh-start"
BRANCH = "feature/yogiferno-title-scene-1"
BASE = "main"
EXPECTED_MAIN = "88afa62c486bd878ff5a42c84ea01b60a817d552"
WT = "/home/hatch/workspace/mochiichao-work/yogiferno-title-scene/repo"
FILES = [
    "src/lib/titleBiomes.ts",
    "src/components/game/TitleScene.tsx",
    "src/components/game/YogifernoTitleWalk.tsx",
    "src/assets/title/yogiferno-walk-cutout.png",
]
BODY = """Yogiferno title/start scene, wired 100% in game code — clean cutout replaces the PR #28 placeholder, plus a shared biome scene system.

BASE: verified main 88afa62c (PR #32) before branching. Clean clone HEAD is 88afa62c itself, so no ancestry gap.

WHAT IS WIRED:
- Clean Yogiferno walking cutout shipped: src/assets/title/yogiferno-walk-cutout.png (145x190, transparent, single walking figure, fire halo baked in, flood-filled from Yogiferno's own sheet, no sheet neighbours). This is OUR character art, not a Pokemon file, and NOT the old sheet-crop test image.
- YogifernoTitleWalk.tsx rewritten as a thin wrapper: it now renders TitleScene with the cutout sprite, fireTrail on, biome snow (variant='snow') or night (variant='walk'). The PR #28 Pixi Graphics placeholder figure is GONE — no placeholder shapes remain in this component. IntroSequence usage is unchanged (same import, same variant prop), so PR #28 title/press/settings wiring is NOT clobbered.
- TitleScene.tsx (new, shared scene system): PixiJS v8 layers in Pokemon title layout order — sky background, ground band + ground line, figure sprite layer, weather/particle layer, fire trail layer. Motion is ticker + sine sway (offset = sine x amplitude on a base position), embers spawning behind the feet + fading scorch glow on the ground, clouds drifting. prefers-reduced-motion renders static. Fire halo is in the cutout, not re-drawn.
- titleBiomes.ts (new): 8 generic terrain/weather biomes, Pixi-drawn palettes only — snow (falling snow), grass (leaves + tufts), water (shimmer), sand (dust), stone (mountain rock), forest (leaves + tufts), rain (falling rain + shimmer), night (no weather). These are generic terrain/weather elements only. No Pokemon texture, creature, logo, name, dialogue or music is shipped in any of these files.

WHAT IS NOT CHANGED / NOT CLAIMED:
- IntroSequence, Settings, title rotation pool, fonts, main menu, saves, PR #30-32 atlases: untouched. Title rotation creature art for the other 9/10 creatures is still GAP — TitleScene renders a labelled GAP caption when no figure is supplied; no fake art is invented for them. Other biome screens are wired as an importable system (TitleScene + TITLE_BIOMES), not yet placed on non-Yogiferno title panels — that placement is the next step once those creatures' figures exist.
- Full snow scene background art (a painted scene, as opposed to the Pixi sky/ground/weather layers here), title music, and boot sound pick: still GAP, labelled, not faked.
- Pages rebuild + live playtest + "playable": NOT done by this PR — parent rebuilds Pages and playtests after merge.

GATES (local, clean clone at 88afa62c): npm run lint (tsc --noEmit) PASS, npm run build PASS (main JS 1,040.38 kB, gzip 287.13 kB, yogiferno-walk-cutout in dist), npm run validate:reference PASSED (warnings are pre-existing open decisions). Deletions: NONE (1 modified file, 3 new files). Manual secret check clean. Gitleaks not installed locally, not claimed as a formal run.
"""

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
        print(f"HTTP {e.code} {method} {path}: {body[:800]}", flush=True)
        raise

status, main = call("GET", f"/repos/{OWNER}/{REPO}/branches/{BASE}")
main_sha = main["commit"]["sha"]
print("main sha:", main_sha, flush=True)
assert main_sha == EXPECTED_MAIN, f"main moved: {main_sha} (expected {EXPECTED_MAIN}) — abort"
try:
    status, ref = call("POST", f"/repos/{OWNER}/{REPO}/git/refs", {"ref": f"refs/heads/{BRANCH}", "sha": main_sha})
    print("branch created:", ref.get("ref"), flush=True)
except Exception:
    print("branch may already exist, continuing", flush=True)
uploaded, skipped = [], []
for i, dest in enumerate(FILES, 1):
    with open(os.path.join(WT, dest), "rb") as f:
        raw = f.read()
    content = base64.b64encode(raw).decode()
    blob_sha = hashlib.sha1(b"blob %d\0" % len(raw) + raw).hexdigest()
    enc = "/".join(quote(part) for part in dest.split("/"))
    sha = None
    try:
        status, existing = call("GET", f"/repos/{OWNER}/{REPO}/contents/{enc}?ref={BRANCH}")
        sha = existing.get("sha")
    except Exception:
        sha = None
    if sha == blob_sha:
        print(f"{i}/{len(FILES)} skipped (identical on branch): {dest}", flush=True)
        skipped.append(dest); continue
    payload = {"message": "Yogiferno title/start scene — clean cutout + biome scene system\n\nDeletions: NONE", "content": content, "branch": BRANCH}
    if sha:
        payload["sha"] = sha
    call("PUT", f"/repos/{OWNER}/{REPO}/contents/{enc}", payload)
    print(f"{i}/{len(FILES)} uploaded: {dest} ({len(raw)} bytes)", flush=True)
    uploaded.append(dest)
print("uploaded:", len(uploaded), "skipped:", len(skipped), flush=True)
status, pr = call("POST", f"/repos/{OWNER}/{REPO}/pulls", {"title": "Yogiferno title/start scene — clean cutout + biome scene system", "head": BRANCH, "base": BASE, "body": BODY, "draft": False})
print("PR:", pr.get("html_url"), "number:", pr.get("number"), flush=True)
print(json.dumps({"pr_number": pr.get("number"), "pr_url": pr.get("html_url"), "uploaded": uploaded, "skipped": skipped}, indent=2))
