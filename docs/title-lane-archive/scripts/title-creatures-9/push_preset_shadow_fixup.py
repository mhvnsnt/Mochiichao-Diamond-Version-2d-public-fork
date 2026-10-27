#!/usr/bin/env python3
"""Fix-up commit on the preset-shadow branch: restore the blink-tempo
change (PR #196) that the first upload briefly overwrote on the branch
only (never merged), keeping the shadow. Normal second commit, NOT a
force-push, NOT a history rewrite. No token printed.
"""
import base64, json, os, sys, urllib.request, urllib.error
from urllib.parse import quote
sys.path.insert(0, "/opt/muse/skills/custom-connector-setup/bin")
from dynamic_credentials import add_surrogate_to_request
OWNER = "mhvnsnt"
REPO = "Mochiichao-Diamond-Version-2d-fresh-start"
BRANCH = "feature/preset-shadow-start-screen-player"
WT = "/home/hatch/workspace/mochiichao-work/title-creatures-9/repo-preset-shadow"
DEST = "src/components/game/StartScreenPlayer.tsx"
TIP_SHA = "5da9a808c25d39a0d38c048541e73207b3291a11"

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
        print(f"HTTP {e.code} {method} {path}: {e.read().decode()[:800]}", flush=True)
        raise

with open(os.path.join(WT, DEST), "rb") as f:
    raw = f.read()
content = base64.b64encode(raw).decode()
enc = "/".join(quote(part) for part in DEST.split("/"))
payload = {"message": "StartScreenPlayer shadow — restore blink-tempo change (PR #196) on current main, keep shadow\n\nDeletions: NONE",
           "content": content, "branch": BRANCH, "sha": TIP_SHA}
status, out = call("PUT", f"/repos/{OWNER}/{REPO}/contents/{enc}", payload)
print("fix-up uploaded:", out["content"]["path"], "sha:", out["content"]["sha"], flush=True)
