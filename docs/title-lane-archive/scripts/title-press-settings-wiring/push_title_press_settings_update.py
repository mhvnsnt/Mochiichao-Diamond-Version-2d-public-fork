#!/usr/bin/env python3
"""Title/Press/Settings code wiring PR, diffed vs verified main 3a65442b.
Additions/changes only, 0 file deletions. No git commit from any dirty
tree — files are read from the clean clone at
~/workspace/mochiichao-work/title-press-settings-wiring/repo (HEAD c731bdfd,
verified: PR #27 to 3a65442b touched only 2 docs files, none of these paths).
No Pokemon files, art, music, dialogue, or copied decomp code.
No package.json/package-lock changes. No token printed."""
import base64, hashlib, json, os, sys, time, urllib.request, urllib.error
from urllib.parse import quote
sys.path.insert(0, "/opt/muse/skills/custom-connector-setup/bin")
from dynamic_credentials import add_surrogate_to_request
OWNER = "mhvnsnt"
REPO = "Mochiichao-Diamond-Version-2d-fresh-start"
BRANCH = "feature/title-press-settings-wiring-1"
BASE = "main"
EXPECTED_MAIN = "3a65442bf24bb0836d08cd6cd53e8809a7d7a213"
WT = "/home/hatch/workspace/mochiichao-work/title-press-settings-wiring/repo"
FILES = [
    "index.html",
    "src/components/IntroSequence.tsx",
    "src/components/game/DialogueBox.tsx",
    "src/components/game/StdWindow.tsx",
    "src/components/views/BattleView.tsx",
    "src/index.css",
    "src/main.tsx",
    "src/store/gameStore.ts",
    "src/assets/fonts/yagiza.woff",
    "src/assets/fonts/yagiza.ttf",
    "src/assets/fonts/01-digitall.ttf",
    "src/assets/ui/m-heavensent-studios-logo.png",
    "src/components/game/SettingsScreen.tsx",
    "src/lib/fonts.ts",
    "src/lib/gameSettings.ts",
]
BODY = """Title / Press / Settings wiring in game code — real Settings screen, phi title, intro GAP scenes, two-font placements.

BASE: verified main 3a65442b (PR #27) before branching. The clean clone used for the build was c731bdfd (PR #26); PR #27 touched only 2 docs files, none of the paths in this PR, so these files apply cleanly to 3a65442b.

WHAT IS WIRED IN CODE (all in this PR, build/lint/validate passed locally):
- Real Settings full screen (SettingsScreen.tsx, NOT a note, NOT a popup): Pokemon full-screen layout (header/list/help bar, label left / value right, UP/DOWN wraps, LEFT/RIGHT cycles, CANCEL saves+exits), Y2K skin. Rows in FireRed order: TEXT SPEED SLOW/MID/FAST, BATTLE SCENE ON/OFF, BATTLE STYLE SHIFT/SET, SOUND MONO/STEREO, BUTTON MODE NORMAL/LR/L=EQUALS=A, FRAME 1-20, FONT SETTINGS, MENU CREATOR, CANCEL. Settings persist in the zustand state (so SaveMenu/GameShell saves carry them, no second save system) AND in localStorage, so a pre-save choice survives reload. Changing settings never erases a save.
- Settings -> Menu Creator -> UI Creator / Layout Editor / Cursor Creator / Panel Frame Editor / Font Settings, all full screens, B: BACK to the previous screen, presets only, Reset to Locked Default (v32) present, Export preset as JSON (layout-as-data idea, our own JSON, not Tuxemon code). Presets never overwrite locked v32 until Mars locks a new one.
- Effects wired honestly: TEXT SPEED -> DialogueBox interval (SLOW 45 / MID 18 / FAST 6 ms; MID 18ms is the pre-existing interval, kept exactly). BATTLE SCENE OFF -> BattleView skips the intro delay and applies damage directly (no Pixi animation frame); ON keeps the existing animation path untouched. BATTLE STYLE SHIFT -> BattleView shows a switch-choice panel when a creature faints (choose the next creature); SET keeps the pre-existing auto-send. FRAME -> frameAccent() border colour on real StdWindows, live on return (original Mochiichao Y2K frame variants in Pokemon frame slots, not Pokemon tiles; frames 1-3 reuse in-repo panel shapes, 4-20 are Y2K accent variants). SOUND is a stored flag only — there is no audio engine in this build to route yet (map music fields are names only), labelled NEED in the UI, not faked. BUTTON MODE is honoured in Settings (LEFT/RIGHT cycle, L confirms when L=EQUALS=A); wider control remapping is NEED, labelled.
- Title/Press upgraded IN PLACE in IntroSequence (no duplicate title/main-menu/save system): BOOT (black screen, Mars's own M Heavensent Studios logo alone, 2.5s hold is an implementation choice, any key skips) -> INTRO (4 GAP scenes: Heavensent scene, world close-up, world pan + creature close-ups, fight beat; any key advances/skips; each scene shows its GAP label, never Pokemon art/music/dialogue) -> TITLE (phi layout: MOCHIICHAO, DIAMOND VERSION banner slide, shine sweep twice, logo slide up, PRESS ANY KEY blink 30 on / 15 off = 750ms cycle, Heavensent logo in the copyright slot, white fade to Main Menu, any key skips phases).
- Fonts, two independent placements (Mars font-role update, licence gate REMOVED by Mars — no payment made, no paid licence bought, not re-imposed here): MAIN FONT = Yagiza (titles/menus/headings/UI labels, via --game-font), DIALOGUE FONT = 01 Digitall (dialogue boxes, NPC talk, battle text, body text, via --dialogue-font). Font list (src/lib/fonts.ts, single extensible file, cycles in Mars's order): Yagiza, 01 Digitall, Behance Y2K Typeface (FILE PENDING row, falls back, never dropped), Pokemon font slots Small/Normal/Bold/Male-style/Female-style/Braille-style (structure only, mapped to open lookalikes, never Pokemon font files), then open-source Y2K Google Fonts Bungee, Titan One, Fredoka, Coiny, Dangrek, Sniglet, Rubik Bubbles, Orbitron, Audiowide, Michroma, Turret Road, Rajdhani, Exo 2, Press Start 2P (pixel, sparingly). Settings > Menu Creator > Font Settings (also reachable from Settings) has MAIN FONT, DIALOGUE FONT, RESET FONTS (MAIN=Yagiza, DIALOGUE=01 Digitall), ORIGINAL DEFAULTS (Bungee main / Fredoka dialogue, open fonts only). Future custom logo font is NOT built, not claimed.
- Font files shipped in this PR (Mars-requested downloads, no payment): src/assets/fonts/yagiza.woff (5,100 bytes), yagiza.ttf (19,544 bytes), 01-digitall.ttf (48,832 bytes); Heavensent logo src/assets/ui/m-heavensent-studios-logo.png (881,109 bytes, Mars's own upload, transparent PNG). Behance Y2K Typeface file has NOT arrived — its row is FILE PENDING, not claimed shipped.
- Open-source helpers, licence-clean only: PixiJS v8 already in game (unchanged); Kenney CC0-style rounded/square panel shapes as Frame options (existing in-repo panel SVGs, no Kenney file copied in); game-icons.net CC BY 3.0 noted as attribution in Cursor Creator (game-icons SVG files themselves are NOT shipped here — NEED, current cursor shapes are glyphs); Tuxemon layout-as-data IDEA only (preset export JSON, our own JSON).

WHAT IS NOT CHANGED (main menu, saves, other menus):
- Main Menu: CONTINUE (only if save exists, stats only from save, no invented play time/total), NEW GAME (overwrite confirm first), SETTINGS, BACK TO TITLE control stay in that order. StdWindow framed windows kept — NOT reverted to PR #14 SVG UiPanel panels (that loading behaviour caused the one-list-panel playtest bug). Main-menu v32 spec lock is unchanged by this code PR. Frame accent + cursor colour/glyph from Settings are applied to main-menu windows only.
- Saves: no save erased, no second save system, loadState merges settings defaults for old saves.
- Other menus (already in main, verified present, NOT rewritten here): Shop Buy/Sell/Quit + confirm before money moves, Bag pockets (Capture/Medicine/Storage/Other), PC boxes + Deposit/Withdraw with confirm, Party one-box-per-slot + Summary/Switch context menu, Save slots + overwrite confirm, Battle healthboxes + 2x2 + PP/TYPE + message window, Dialogue bottom full-width. Their structure is Pokemon order with the game's shared frame; per-menu colours (Roster pink, Shop yellow, etc.) as distinct skins are NEED, not claimed here.

GAPS, labelled in game and in this PR (code cannot honestly finish these):
- Original intro scene art, title background scene art, boot sound composition, title music: GAP panels/labels in game, no art/music invented to fake them.
- Behance Y2K Typeface file: FILE PENDING row.
- Diamond title content search, HeartGold intro scene details: not in code, still owed by the UI Art lane.
- Sound audio routing, wider button-mode remapping, title logo art from a Menu Creator preset, symbol-layer animation in game, layout-as-data application to views, game-icons SVG files: NEED, labelled in code/UI, not faked.
- Pages rebuild + live playtest: NOT done by this PR — parent rebuilds Pages and playtests after merge. Do NOT claim playtest passed, playable, or a VICTORY! banner until that playtest actually sees one.

GATES (local, clean clone): npm run lint (tsc --noEmit) PASS, npm run build PASS (838 modules, main JS 1,004.05 kB, fonts + Heavensent logo in dist), npm run validate:reference PASS 59/59 (warnings are pre-existing open decisions). Deletions: NONE (8 modified files are replaced lines only, 7 new files). Manual secret check: no tokens, no signed URLs. Gitleaks not installed locally, not claimed as a formal run.
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
assert main_sha == EXPECTED_MAIN, f"main moved: {main_sha} (expected {EXPECTED_MAIN}) — abort, do not branch from a moved head blindly"
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
    payload = {"message": "Title / Press / Settings wiring in game code\n\nDeletions: NONE", "content": content, "branch": BRANCH}
    if sha:
        payload["sha"] = sha
    call("PUT", f"/repos/{OWNER}/{REPO}/contents/{enc}", payload)
    print(f"{i}/{len(FILES)} uploaded: {dest} ({len(raw)} bytes)", flush=True)
    uploaded.append(dest)
print("uploaded:", len(uploaded), "skipped:", len(skipped), flush=True)
status, pr = call("POST", f"/repos/{OWNER}/{REPO}/pulls", {"title": "Title / Press / Settings wiring in game code", "head": BRANCH, "base": BASE, "body": BODY, "draft": False})
print("PR:", pr.get("html_url"), "number:", pr.get("number"), flush=True)
print(json.dumps({"pr_number": pr.get("number"), "pr_url": pr.get("html_url"), "uploaded": uploaded, "skipped": skipped}, indent=2))
