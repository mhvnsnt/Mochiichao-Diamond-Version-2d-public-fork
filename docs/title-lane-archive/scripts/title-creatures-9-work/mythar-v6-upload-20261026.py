#!/usr/bin/env python3
"""Ship confirmed Mythar leg-tool v6 to branch feature/mythar-leg-v6-20261026
via GitHub Contents/Refs API (git push has no credentials in this VM).
Pre-ship check: live main mythar blob must still be the shipped original
(blob c0daf3ba4d6c551286967feb1ec78e76dff99bf0, raw md5
474b1583464fe377fb32098781b37bcf). Aborts on any mismatch or main move.
1 file modified, 0 deletions. No token printed."""
import base64, json, sys, urllib.request, urllib.error
sys.path.insert(0, "/opt/muse/skills/custom-connector-setup/bin")
from dynamic_credentials import add_surrogate_to_request
OWNER = "mhvnsnt"
REPO = "Mochiichao-Diamond-Version-2d-fresh-start"
BRANCH = "feature/mythar-leg-v6-20261026"
EXPECT_MAIN = "615c59aa7137e46adff9f03b9235ff3adb0bedc6"
EXPECT_BLOB = "c0daf3ba4d6c551286967feb1ec78e76dff99bf0"
DEST = "src/assets/title/mythar-walk-cutout.png"
SRC = "/home/hatch/workspace/mochiichao-work/title-creatures-9/work/mythar-leg-tool-v6-20261026.png"

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
    print("ABORT: main moved since inspect", flush=True)
    sys.exit(2)

status, cur = call("GET", f"/repos/{OWNER}/{REPO}/contents/{DEST}?ref=main")
print(f"main mythar blob: {cur.get('sha')} (expected {EXPECT_BLOB})", flush=True)
if status != 200 or cur.get("sha") != EXPECT_BLOB:
    print("ABORT: main mythar blob changed since inspect", flush=True)
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

data = base64.b64encode(open(SRC, "rb").read()).decode()
status, up = call("PUT", f"/repos/{OWNER}/{REPO}/contents/{DEST}",
                  {"message": "Replace Mythar title cutout with confirmed leg-tool v6 (MI-GAN legs-only fill). 1 file modified, 0 deletions; supersedes shipped original + staged v1-v5.",
                   "content": data, "sha": EXPECT_BLOB, "branch": BRANCH})
print(f"upload: HTTP {status} blob={up.get('content', {}).get('sha')}", flush=True)
if status not in (200, 201):
    print(f"FAIL upload: {up}", flush=True)
    sys.exit(4)
print("UPLOAD OK", flush=True)
