#!/usr/bin/env python3
"""Post-merge verification for cry-gate PR #227: main HEAD, PR file list
(2 files, 0 deletions), both blobs on main, and content checks that the
merged TitleScene carries gate lines + Kittember cycle lines + bg-zoom
lines. Read-only. No token printed."""
import base64, json, sys, urllib.request, urllib.error
sys.path.insert(0, "/opt/muse/skills/custom-connector-setup/bin")
from dynamic_credentials import add_surrogate_to_request
OWNER = "mhvnsnt"
REPO = "Mochiichao-Diamond-Version-2d-fresh-start"
EXPECT_MERGE = "b398463ff0811195cfb2bf4e6df74c1db438336c"

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

status, pr = call("GET", f"/repos/{OWNER}/{REPO}/pulls/227")
print(f"PR 227: state={pr.get('state')}, merged={pr.get('merged')}, merge_sha={pr.get('merge_commit_sha')} (expected {EXPECT_MERGE})")
status, files = call("GET", f"/repos/{OWNER}/{REPO}/pulls/227/files?per_page=100")
for f in files:
    print(f"  file: {f['filename']} status={f['status']} +{f['additions']}/-{f['deletions']} sha={f['sha']}")
status, main = call("GET", f"/repos/{OWNER}/{REPO}/branches/main")
print(f"main HEAD now: {main['commit']['sha']}")
status, gate = call("GET", f"/repos/{OWNER}/{REPO}/contents/src/lib/titleCryGate.ts?ref=main")
print(f"main titleCryGate.ts: HTTP {status}, sha={gate.get('sha')} (branch upload fecaf85a7e84179fee100f208002ede2b3d3c575)")
status, ts = call("GET", f"/repos/{OWNER}/{REPO}/contents/src/components/game/TitleScene.tsx?ref=main")
print(f"main TitleScene.tsx: HTTP {status}, sha={ts.get('sha')} (branch upload 4026e548235d74f925de74995505fb69080a161b)")
if status == 200:
    content = base64.b64decode(ts["content"]).decode()
    checks = {
        "gate import playTitleCry": "playTitleCry" in content,
        "gate state cryExitKind": "cryExitKind" in content,
        "gate listener startPrompt": "cryGateFiredRef" in content,
        "gate wait TITLE_CRY_WAIT_MS": "TITLE_CRY_WAIT_MS" in content,
        "Kittember cycle figureCycleUrls": "figureCycleUrls" in content,
        "bg zoom bgBaseScale": "bgBaseScale" in content,
    }
    for k, v in checks.items():
        print(f"  content {k}: {v}")
    print(f"  main TitleScene lines: {content.count(chr(10))+1}")
print("VERIFY DONE")
