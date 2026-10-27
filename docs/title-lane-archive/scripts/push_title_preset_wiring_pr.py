#!/usr/bin/env python3
"""Title preset SELECTABLE wiring: upload to a branch stacking on PR #157,
then open ONE PR targeting the #157 branch (NOT main, NOT a merge).
Gate-checked: base SHA verified, new-file 404 on base, update targets
exist on base, PR left open. No token printed."""
import base64, json, sys, time, urllib.error, urllib.request
from urllib.parse import quote
sys.path.insert(0, "/opt/muse/skills/custom-connector-setup/bin")
from dynamic_credentials import add_surrogate_to_request

OWNER = "mhvnsnt"
REPO = "Mochiichao-Diamond-Version-2d-fresh-start"
BASE_BRANCH = "feature/title-screen-presets-2026-10-26"
BASE_SHA = "3adf59b78a510205b6d196e3fa25f619dfc88e43"
BRANCH = "feature/title-preset-selectable-wiring"
CLONE = "/home/hatch/workspace/mochiichao-work/preset-wiring-20261026"
BUNDLE = [
    ("src/lib/titleScreenPresetSelection.ts", "new"),
    ("src/components/IntroSequence.tsx", "update"),
    ("src/components/game/SettingsScreen.tsx", "update"),
    ("src/components/game/TitleScene.tsx", "update"),
    ("docs/ui-art/title-screen-presets-seam.md", "update"),
]
BODY = """UI Art: title-screen presets SELECTABLE — wiring only, stacks on #157 (DO NOT merge to main).

PR #157 shipped the 10 title-screen preset DEFINITIONS only (no selector, no wiring). This PR is the wiring: the 10 presets are now selectable in-game. It targets the #157 branch, NOT main, and is BLOCKED on #157 merging first — do not merge this into main on its own.

What lands (5 files, 0 files deleted):
- NEW src/lib/titleScreenPresetSelection.ts — the player choice, mirroring titlePlayerPreference.ts storage: localStorage key `mochiichao_player_title_screen_preset`, try/catch fallback to the locked default. The key is PLAYER-scoped, not creator preset storage, so it cannot collide with PR #155's storage. Unknown/stale ids read back as null (locked default), never a broken scene.
- UPDATED src/components/game/SettingsScreen.tsx — TITLE SCREEN row after the skin rows, same LEFT/RIGHT cycle pattern: Locked Default + 10 presets, saved immediately on cycling (like skins). RESET TO LOCKED DEFAULT clears the pick, so a reset always restores the locked default title. A TitleScene preview strip below the rows shows the picked preset (the seam's own render step); Locked Default shows no strip, because the phi stage is not a TitleScene.
- UPDATED src/components/IntroSequence.tsx — TITLE phase hook only: a pick renders the preset scene (TitleScene, full viewport) + the PRESS ANY KEY prompt owned here (TitleScene startPrompt stays false for presets, per the seam, so there is no double prompt). No pick renders the locked phi stage, whose code is untouched. Press behaviour is the existing path (M3 chirp, white fade 350ms, MAIN_MENU) — reused, not redefined.
- UPDATED src/components/game/TitleScene.tsx — additive optional `fullHeight` prop only (default false): the in-game TITLE phase passes it; every other caller keeps the 180px preview strip exactly as before.
- UPDATED docs/ui-art/title-screen-presets-seam.md — wiring section + status corrected (in-game selection done here; creator-screen plumbing still owed after #155).

Guards (unchanged):
- DEFAULT UNTOUCHED: with no user choice made, the game shows exactly the current locked default title/menu. The preset choice is opt-in only and never rewrites the default preset files or the default selection. The preset table itself is unchanged (status stays 'defined', as validateTitleScreenPresets() requires).
- Logo stays PNG, never font text. No changes to other lanes' pieces (backgrounds, cutouts, music, sprites, human art, cry audio). No merge, no publish, no playtest in this PR (playtest is LAST per the finish-first order).

Honest limits / Mars decisions flagged, not silently decided:
- Preset title scenes carry NO logo overlay in this wiring: the seam defines a preset as background + creature + particles + press prompt, with no logo slot, and inventing a logo position would guess at the locked title's layout. Whether presets should also carry the logo PNG is a Mars call.
- Press-blink tempo on this branch matches its #157 base (the base's 30-on/15-off CSS cycle, same for default and presets). Main has since moved the tempo (PR #196: 60 first, then 30/30) — when #157 merges to current main, the tempo on the preset prompt should be re-checked so preset and default stay identical.
- Live visual confirmation (picking a preset in Settings and seeing the TITLE phase) is for Mars/coordinator playtest after publish; this PR verifies build + typecheck statically, not a played session.

Verification (own clone, branched from #157 head 3adf59b, never the shared dirty work clone):
- Base re-verified current before upload (remote #157 head == 3adf59b).
- npm run build PASSES (Vite, 1m29s). npx tsc --noEmit (npm run lint): exit 0, no errors.
- Diff: 5 files, +239/-11 lines, 0 files deleted (line replacements only, all inside the wiring hook).

Deletions: NONE (0 files deleted).
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
    if data: req.add_header("Content-Type", "application/json")
    add_surrogate_to_request(req, "custom.github-api", allowed_hosts=["api.github.com"])
    try:
        with urllib.request.build_opener(NoRedirect()).open(req, timeout=120) as resp:
            raw = resp.read().decode()
            return resp.status, json.loads(raw) if raw else {}
    except urllib.error.HTTPError as err:
        raw = err.read().decode()
        return err.code, json.loads(raw) if raw else {"raw": raw[:300]}

def enc(rel):
    return "/".join(quote(p) for p in rel.split("/"))

_, base = call("GET", f"/repos/{OWNER}/{REPO}/branches/{BASE_BRANCH}")
base_sha = base["commit"]["sha"]
print("base_sha:", base_sha, flush=True)
if base_sha != BASE_SHA:
    print(f"ABORT: base moved (expected {BASE_SHA})", flush=True); sys.exit(2)
shas = {}
for rel, kind in BUNDLE:
    status, data = call("GET", f"/repos/{OWNER}/{REPO}/contents/{enc(rel)}?ref={BASE_BRANCH}")
    if kind == "new":
        if status != 404:
            print(f"ABORT: new path already exists on base: {rel} (HTTP {status})", flush=True); sys.exit(2)
        print(f"404 OK (new): {rel}", flush=True)
    else:
        if status != 200 or "sha" not in data:
            print(f"ABORT: update target missing on base: {rel} (HTTP {status})", flush=True); sys.exit(2)
        shas[rel] = data["sha"]
        print(f"update target OK: {rel}", flush=True)
status, ref = call("POST", f"/repos/{OWNER}/{REPO}/git/refs", {"ref": f"refs/heads/{BRANCH}", "sha": BASE_SHA})
if status == 422:
    _, existing = call("GET", f"/repos/{OWNER}/{REPO}/branches/{BRANCH}")
    if existing.get("commit", {}).get("sha") != BASE_SHA:
        print("ABORT: branch exists off a different base", flush=True); sys.exit(2)
    print(f"branch {BRANCH} already exists at base_sha, reusing", flush=True)
elif status not in (200, 201):
    print(f"ABORT: branch create HTTP {status}: {ref}", flush=True); sys.exit(2)
else:
    print(f"branch created: {BRANCH} from {BASE_SHA}", flush=True)
for rel, kind in BUNDLE:
    with open(f"{CLONE}/{rel}", "rb") as fh: raw = fh.read()
    payload = {"message": f"UI Art: title preset selectable wiring — {'add' if kind == 'new' else 'update'} {rel}",
               "content": base64.b64encode(raw).decode(), "branch": BRANCH}
    if kind == "update": payload["sha"] = shas[rel]
    status, data = call("PUT", f"/repos/{OWNER}/{REPO}/contents/{enc(rel)}", payload)
    if status not in (200, 201):
        print(f"ABORT: upload {rel} HTTP {status}: {data}", flush=True); sys.exit(2)
    print(f"uploaded {rel} ({len(raw)} bytes)", flush=True)
status, pr = call("POST", f"/repos/{OWNER}/{REPO}/pulls", {
    "title": "UI Art: title-screen presets selectable — wiring only, stacks on #157",
    "head": BRANCH, "base": BASE_BRANCH, "body": BODY})
if status not in (200, 201):
    print(f"ABORT: PR create HTTP {status}: {pr}", flush=True); sys.exit(2)
pr_number = pr["number"]
print(f"PR #{pr_number}: {pr.get('html_url')}", flush=True)
pr = None
for attempt in range(12):
    _, pr = call("GET", f"/repos/{OWNER}/{REPO}/pulls/{pr_number}")
    print(f"gate attempt {attempt+1}: mergeable={pr.get('mergeable')} state={pr.get('mergeable_state')} additions={pr.get('additions')} deletions={pr.get('deletions')} changed={pr.get('changed_files')}", flush=True)
    if pr.get("mergeable") is True and pr.get("mergeable_state") == "clean": break
    time.sleep(15)
print(f"PR_OPEN: {pr.get('html_url')} mergeable={pr.get('mergeable')} state={pr.get('mergeable_state')} additions={pr.get('additions')} deletions={pr.get('deletions')} changed={pr.get('changed_files')}", flush=True)
with open("/home/hatch/workspace/mochiichao-work/title_preset_wiring_result.json", "w") as fh:
    json.dump({"pr": pr_number, "url": pr.get("html_url"), "mergeable": pr.get("mergeable"),
               "mergeable_state": pr.get("mergeable_state"), "additions": pr.get("additions"),
               "deletions": pr.get("deletions"), "changed_files": pr.get("changed_files")}, fh)
print("PUSH_PR_DONE_NOT_MERGED", flush=True)
