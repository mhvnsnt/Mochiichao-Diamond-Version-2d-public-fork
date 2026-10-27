#!/usr/bin/env python3
"""Ship title cry gate activation + per-creature variant rotation to a
branch via GitHub Contents/Refs API (git push has no credentials in
this VM). Branch from LIVE main; abort unless the 3 edited files on
live main still match the base this work was built against
(bb21e8fb) — if any blob moved, the edit must be re-based first.
0 deletions. No audio file touched. No token printed."""
import base64, json, sys, urllib.request, urllib.error
sys.path.insert(0, "/opt/muse/skills/custom-connector-setup/bin")
from dynamic_credentials import add_surrogate_to_request
OWNER = "mhvnsnt"
REPO = "Mochiichao-Diamond-Version-2d-fresh-start"
BRANCH = "feature/title-cry-activate-rotation-20261026"
WT = "/home/hatch/workspace/mochiichao-work/title-creatures-9/cry-gate-activate"
EXPECT = {
    "src/lib/titleCryGate.ts": "fecaf85a7e84179fee100f208002ede2b3d3c575",
    "src/components/game/TitleCreatureFigure.tsx": "04c192e858ef85a2f3ed82560f6260a966cd3d85",
    "src/components/game/YogifernoTitleWalk.tsx": "71fa43c75cd1807a5a4488f2e76f80f858113a07",
}

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
        return e.code, {"error": e.read().decode()[:300]}

status, main = call("GET", f"/repos/{OWNER}/{REPO}/branches/main")
live = main["commit"]["sha"]
print(f"live main: {live}", flush=True)
for dest, sha in EXPECT.items():
    status, cur = call("GET", f"/repos/{OWNER}/{REPO}/contents/{dest}?ref=main")
    print(f"main {dest}: {cur.get('sha')} (expected {sha})", flush=True)
    if status != 200 or cur.get("sha") != sha:
        print(f"ABORT: {dest} moved on main since base; re-base first", flush=True)
        sys.exit(2)

status, ref = call("POST", f"/repos/{OWNER}/{REPO}/git/refs",
                    {"ref": f"refs/heads/{BRANCH}", "sha": live})
if status == 422:
    status, ref = call("GET", f"/repos/{OWNER}/{REPO}/git/ref/heads/{BRANCH}")
    if status != 200 or ref["object"]["sha"] != live:
        print(f"ABORT: branch exists at unexpected state: {status} {ref}", flush=True)
        sys.exit(2)
    print("branch already exists at live main, proceeding", flush=True)
elif status not in (200, 201):
    print(f"FAIL creating branch: HTTP {status} {ref}", flush=True)
    sys.exit(3)
print(f"branch {BRANCH} -> {live}", flush=True)

uploads = [
    ("src/lib/titleCryGate.ts", f"{WT}/src/lib/titleCryGate.ts", EXPECT["src/lib/titleCryGate.ts"],
     "Title cry gate: per-creature variant rotation (own v1+r1 lists, deterministic rotation). 0 deletions, no audio touched."),
    ("src/components/game/TitleCreatureFigure.tsx", f"{WT}/src/components/game/TitleCreatureFigure.tsx", EXPECT["src/components/game/TitleCreatureFigure.tsx"],
     "Title card activation: TitleCreatureFigure opts into the cry gate (startPrompt). 0 deletions."),
    ("src/components/game/YogifernoTitleWalk.tsx", f"{WT}/src/components/game/YogifernoTitleWalk.tsx", EXPECT["src/components/game/YogifernoTitleWalk.tsx"],
     "Title card activation: YogifernoTitleWalk opts into the cry gate (startPrompt). 0 deletions."),
]
for dest, src, sha, msg in uploads:
    status, cur = call("GET", f"/repos/{OWNER}/{REPO}/contents/{dest}?ref={BRANCH}")
    if status != 200 or cur.get("sha") != sha:
        print(f"ABORT {dest}: expected sha {sha} on branch, got {status} {cur.get('sha')}", flush=True)
        sys.exit(2)
    with open(src, "rb") as fh:
        content = base64.b64encode(fh.read()).decode()
    payload = {"message": msg, "content": content, "branch": BRANCH, "sha": sha}
    status, resp = call("PUT", f"/repos/{OWNER}/{REPO}/contents/{dest}", payload)
    if status not in (200, 201):
        print(f"FAIL {dest}: HTTP {status} {resp}", flush=True)
        sys.exit(3)
    print(f"UPLOADED {dest} -> {resp['content']['sha']}", flush=True)
print("ALL 3 FILES UPLOADED", flush=True)
