#!/usr/bin/env python3
"""Inspect live main for the title-10 cry gate ship: main HEAD, current
TitleScene.tsx (blob SHA + content), the 10 v1 cry WAVs, and confirm
titleCryGate.ts is absent on main. No writes. No token printed."""
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
live = main["commit"]["sha"]
print(f"live main HEAD: {live}")

status, ts = call("GET", f"/repos/{OWNER}/{REPO}/contents/src/components/game/TitleScene.tsx?ref=main")
print(f"main TitleScene.tsx: HTTP {status}, sha={ts.get('sha')}, size={ts.get('size')}")
if status == 200:
    content = base64.b64decode(ts["content"]).decode()
    open("/home/hatch/workspace/mochiichao-work/title-creatures-9/work/TitleScene-main-20261026.tsx", "w").write(content)
    print(f"saved main TitleScene, {len(content)} chars, {content.count(chr(10))+1} lines")

status, gate = call("GET", f"/repos/{OWNER}/{REPO}/contents/src/lib/titleCryGate.ts?ref=main")
print(f"main titleCryGate.ts: HTTP {status} (expect 404)")

names = ["mochii", "razorgater", "tyrage", "kittember", "sproutle",
         "dorowani", "gabu", "wispkin", "yogiferno", "mythar"]
for n in names:
    status, f = call("GET", f"/repos/{OWNER}/{REPO}/contents/public/audio/cries/{n}-cry.wav?ref=main")
    print(f"v1 {n}-cry.wav: HTTP {status}, sha={f.get('sha')}, size={f.get('size')}")
print("INSPECT DONE")
