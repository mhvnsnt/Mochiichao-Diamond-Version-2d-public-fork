#!/usr/bin/env python3
"""Ship title-10 cry gate to branch feature/title-cry-gate-10-20261026 via
GitHub Contents/Refs API (git push has no credentials in this VM).
Source files read exactly from local branch 3a8007b, EXCEPT TitleScene:
live main drifted since gate base 2e17859 (Kittember glow frame-cycle
wiring), so the uploaded TitleScene is the conflict-free 3-way merge
(main + gate lines only, merge-file exit 0, 0 markers) built in
work/TitleScene-merged-20261026.tsx. Aborts if live main moved since
inspect, so no stale base is ever uploaded. 0 deletions. No token printed."""
import base64, json, sys, urllib.request, urllib.error
sys.path.insert(0, "/opt/muse/skills/custom-connector-setup/bin")
from dynamic_credentials import add_surrogate_to_request
OWNER = "mhvnsnt"
REPO = "Mochiichao-Diamond-Version-2d-fresh-start"
BRANCH = "feature/title-cry-gate-10-20261026"
EXPECT_MAIN = "a931294b3e0a6fab5f208d2554fa3aab19aa9daa"
EXPECT_TS_SHA = "ec54579a1594993cff7c70002c2c8399fa4b7d52"
WORK = "/home/hatch/workspace/mochiichao-work/title-creatures-9/work"
GATE = "/home/hatch/workspace/mochiichao-work/title-creatures-9/cry-gate"

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
print(f"live main: {live} (expected {EXPECT_MAIN})", flush=True)
if live != EXPECT_MAIN:
    print("ABORT: main moved since inspect; re-run inspect+merge first", flush=True)
    sys.exit(2)

status, ts = call("GET", f"/repos/{OWNER}/{REPO}/contents/src/components/game/TitleScene.tsx?ref=main")
print(f"main TitleScene sha: {ts.get('sha')} (expected {EXPECT_TS_SHA})", flush=True)
if status != 200 or ts.get("sha") != EXPECT_TS_SHA:
    print("ABORT: main TitleScene changed since inspect", flush=True)
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
    ("src/lib/titleCryGate.ts", f"{GATE}/src/lib/titleCryGate.ts", None,
     "Add title cry gate table+API (title 10 only, V1 cries, press -> cry -> 90-frame wait -> white fade). 0 deletions."),
    ("src/components/game/TitleScene.tsx", f"{WORK}/TitleScene-merged-20261026.tsx", EXPECT_TS_SHA,
     "Wire title cry gate into TitleScene (startPrompt=true only, cry-gate lines only; Kittember cycle wiring from main preserved). 0 deletions."),
]
for dest, src, sha, msg in uploads:
    status, cur = call("GET", f"/repos/{OWNER}/{REPO}/contents/{dest}?ref={BRANCH}")
    if sha is None:
        if status != 404:
            print(f"ABORT {dest}: expected 404 on branch, got {status}", flush=True)
            sys.exit(2)
    else:
        if status != 200 or cur.get("sha") != sha:
            print(f"ABORT {dest}: expected sha {sha} on branch, got {status} {cur.get('sha')}", flush=True)
            sys.exit(2)
    with open(src, "rb") as fh:
        content = base64.b64encode(fh.read()).decode()
    payload = {"message": msg, "content": content, "branch": BRANCH}
    if sha:
        payload["sha"] = sha
    status, resp = call("PUT", f"/repos/{OWNER}/{REPO}/contents/{dest}", payload)
    if status not in (200, 201):
        print(f"FAIL {dest}: HTTP {status} {resp}", flush=True)
        sys.exit(3)
    print(f"UPLOADED {dest} -> {resp['content']['sha']}", flush=True)
print("ALL 2 FILES UPLOADED", flush=True)
