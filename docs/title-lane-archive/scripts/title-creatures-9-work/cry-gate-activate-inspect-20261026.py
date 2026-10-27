#!/usr/bin/env python3
"""Inspect live main for cry-gate activation task: gate files + 20 cry files.
No token printed. Read-only API calls."""
import base64, json, sys, urllib.request, urllib.error
sys.path.insert(0, "/opt/muse/skills/custom-connector-setup/bin")
from dynamic_credentials import add_surrogate_to_request
OWNER = "mhvnsnt"
REPO = "Mochiichao-Diamond-Version-2d-fresh-start"

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
print("main:", main["commit"]["sha"])
for path in ["src/lib/titleCryGate.ts", "src/components/game/TitleScene.tsx"]:
    status, obj = call("GET", f"/repos/{OWNER}/{REPO}/contents/{path}?ref=main")
    if status == 200:
        raw = base64.b64decode(obj["content"]).decode()
        open(f"/tmp/gate-activate-{path.split('/')[-1]}", "w").write(raw)
        print(f"{path}: sha={obj['sha']} lines={raw.count(chr(10))+1} bytes={len(raw)}")
    else:
        print(f"{path}: HTTP {status} {obj}")

names = ["mochii", "razorgater", "tyrage", "kittember", "sproutle", "dorowani",
         "gabu", "wispkin", "yogiferno", "mythar"]
for n in names:
    for suffix in ["", "-r1"]:
        p = f"public/audio/cries/{n}-cry{suffix}.wav"
        status, obj = call("GET", f"/repos/{OWNER}/{REPO}/contents/{p}?ref=main")
        print(f"{p}: HTTP {status} sha={obj.get('sha')}")
