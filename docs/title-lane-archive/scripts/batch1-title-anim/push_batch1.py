#!/usr/bin/env python3
"""Batch 1 title animation system PR. Contents API only, no commit from any tree.
Base verified inside: aborts if main moved from EXPECTED_MAIN."""
import base64, hashlib, json, sys, urllib.request, urllib.error
from urllib.parse import quote
sys.path.insert(0, "/opt/muse/skills/custom-connector-setup/bin")
from dynamic_credentials import add_surrogate_to_request
OWNER="mhvnsnt"; REPO="Mochiichao-Diamond-Version-2d-fresh-start"
BRANCH="feature/title-animation-system-batch1"; BASE="main"
EXPECTED_MAIN="1027c6073bcb369c50f05fb88fcadac9cbba2b11"
WT="/home/hatch/workspace/mochiichao-work/batch1-title-anim/repo"
FILES=["src/lib/titleAnimations.ts","src/components/game/TitleScene.tsx"]
BODY="""Title scene animation system, Batch 1 — 5/5 Pokemon title systems translated to PixiJS v8, Mochiichao art only.

BASE: verified live main 1027c607 before branching (TitleScene, YogifernoTitleWalk, titleBiomes, package.json all identical to the tree the local gates ran on, so the gates below apply to this branch's content).

WHAT IS WIRED (5/5 = 100% of this batch's systems):
1. FireRed flame/leaf spawner (pokefirered-leafgreen/src/title_screen.c): flame burst every 18 frames — 1 random flame + 15 trail flames at sFlameXPositions [4,16,26,32,48,200,216,224,232,60,76,92,108,128,144] with tOffsetX cycling 0..3, xspeed rand%4-2, yspeed rand%8-16 (subpixel /16), kill x<-8 / y<16 / y>200; leaf spawner delay rand%6+6, xspeed 16/24/48, yspeed rand%4-2, y rand%88+32; streaks x-=7/frame, wrap to 256, y cycles [40,80,110,60,90,70,100,50]. Flames run when fireTrail is on (Yogiferno), leaves+streaks on grass/forest biomes.
2. HeartGold start flash (pokeheartgold/src/title_screen.c): shown at timer 0, hidden at 30, reset at 45, after initialDelay 30 — as an optional TitleScene startPrompt (default off). IntroSequence's existing press-blink (PR #28) is NOT replaced or touched; it already has the same 30-on/15-off shape.
3. Ruby shine (decomps/pokeruby/src/title_screen.c): band starts x=0, y=68 (scaled to canvas), x+=4/frame, destroyed at x>=272; flash shines brighten +2 twice/frame to 31 before x<120, darken -2 twice/frame to 0 after; Phase 1 counter starts 256 and re-fires with flash at exactly 160 and 64. First shine fires with flash off.
4. Black 2 camera + motion blur (pokebw2/src/ov162/title.c): camera steps one curve frame per VBlank (dropped-frame stepping honoured via ticker deltaTime), 7300-frame loop period kept, mapped to a slow closed pan/zoom (the binary NARC curve file itself is NOT copied — labelled translation); capture blend out of 16: init 12/4, exit 8/8, rendered as a one-frame figure ghost at alpha evb/16 (0.25 idle, 0.5 on exit).
5. Platinum fades (decomps/pokeplatinum/src/applications/title_screen.c): entry black overlay out over 48 frames (FADE_MAIN_FROM_BLACK); exit driver (prop-triggered, NOT yet hooked to input): delay 10 frames, then white out 6 + white in 6 (normal) or black out 6 (clear-save); BGM fade 60 frames is a documented duration only — no audio shipped (music/cries are LEAVE-OUT).

NEW FILE: src/lib/titleAnimations.ts — pure frame-step functions + constants for all 5 systems, with source citations and labelled translations (VRAM capture -> ghost, curve file -> period-preserving pan/zoom, Platinum event-gated exit -> phase driver).
CHANGED FILE: src/components/game/TitleScene.tsx — wires the 5 systems into the existing PR #33 scene (scene container for the camera; screen-space overlays for fades/shine so the camera cannot crop them). Props added, all optional with behaviour-preserving defaults: startPrompt (default false), exitKind (default 'none').

WHAT IS NOT CHANGED / NOT CLAIMED:
- IntroSequence, YogifernoTitleWalk, titleBiomes, rotation pool, fonts, main menu, saves, PR #28 title/press/settings wiring: untouched.
- No Pokemon sprites, dialogue, music, or cries; no creature art invented for the other 9/10 rotation creatures — they stay GAP (TitleScene still labels a missing figure as GAP).
- Platinum exit is prop-driven, not input-hooked: IntroSequence does not set exitKind yet, so no exit is claimed as input-triggered. Pages rebuild + live playtest + "playable": NOT done by this PR.
- package.json / package-lock: untouched.

GATES (local, clean clone): npm run lint (tsc --noEmit) PASS, npm run build PASS (main JS 1,045.02 kB, gzip 289.00 kB), npm run validate:reference PASSED (59/59 JSON, 22 warnings are pre-existing open decisions). Deletions: NONE (1 modified, 1 new). Manual secret check clean. Gitleaks not installed locally, not claimed as a formal run.
"""
class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self,*a): raise RuntimeError("redirect refused")
def call(method, path, payload=None):
    data=json.dumps(payload).encode() if payload is not None else None
    req=urllib.request.Request("https://api.github.com"+path, data=data, method=method)
    req.add_header("Accept","application/vnd.github+json"); req.add_header("X-GitHub-Api-Version","2022-11-28"); req.add_header("User-Agent","Muse-GitHub-Api")
    if data: req.add_header("Content-Type","application/json")
    add_surrogate_to_request(req,"custom.github-api",allowed_hosts=["api.github.com"])
    try:
        with urllib.request.build_opener(NoRedirect()).open(req,timeout=180) as r:
            b=r.read().decode(); return r.status, json.loads(b) if b else {}
    except urllib.error.HTTPError as e:
        print(f"HTTP {e.code} {method} {path}: {e.read().decode()[:800]}", flush=True); raise
s,main=call("GET",f"/repos/{OWNER}/{REPO}/branches/{BASE}")
sha=main["commit"]["sha"]; print("main sha:",sha,flush=True)
assert sha==EXPECTED_MAIN, f"main moved: {sha} — abort, re-verify"
try:
    s,ref=call("POST",f"/repos/{OWNER}/{REPO}/git/refs",{"ref":f"refs/heads/{BRANCH}","sha":sha}); print("branch created:",ref.get("ref"),flush=True)
except Exception: print("branch may already exist, continuing",flush=True)
for i,dest in enumerate(FILES,1):
    raw=open(f"{WT}/{dest}","rb").read(); content=base64.b64encode(raw).decode()
    blob=hashlib.sha1(b"blob %d\0"%len(raw)+raw).hexdigest()
    enc="/".join(quote(part) for part in dest.split("/"))
    sha2=None
    try:
        s,ex=call("GET",f"/repos/{OWNER}/{REPO}/contents/{enc}?ref={BRANCH}"); sha2=ex.get("sha")
    except Exception: sha2=None
    if sha2==blob: print(f"{i} skipped identical: {dest}",flush=True); continue
    payload={"message":"Title scene animation system Batch 1 — 5 Pokemon title systems in Pixi, Mochiichao art only\n\nDeletions: NONE","content":content,"branch":BRANCH}
    if sha2: payload["sha"]=sha2
    call("PUT",f"/repos/{OWNER}/{REPO}/contents/{enc}",payload); print(f"{i} uploaded: {dest} ({len(raw)} bytes)",flush=True)
s,pr=call("POST",f"/repos/{OWNER}/{REPO}/pulls",{"title":"Title scene animation system Batch 1 — FireRed/HeartGold/Ruby/Black 2/Platinum systems in Pixi","head":BRANCH,"base":BASE,"body":BODY,"draft":False})
print("PR:",pr.get("html_url"),"number:",pr.get("number"),flush=True)
print(json.dumps({"pr_number":pr.get("number"),"pr_url":pr.get("html_url")},indent=2))
