#!/usr/bin/env python3
"""Ship the feathered Mochii preview as the new locked Mochii cutout.
Mars approved the feathered previews 2026-10-26 ~16:52 CDT ('barely feathered,
so light they're not noticeable — those are fine, those are perfect').
Files only: src/assets/title/mochii-walk-cutout.png replaced, nothing else.
Yogiferno NOT touched (its feather ships separately after clean-v3 lands).
Route: GitHub Contents/Refs API (git push has no credentials in this VM),
same established route as prior lane PRs. No token printed."""
import base64, json, sys, urllib.request, urllib.error
sys.path.insert(0, "/opt/muse/skills/custom-connector-setup/bin")
from dynamic_credentials import add_surrogate_to_request
OWNER = "mhvnsnt"
REPO = "Mochiichao-Diamond-Version-2d-fresh-start"
BRANCH = "feature/mochii-feather-20261026"
DEST = "src/assets/title/mochii-walk-cutout.png"
SRC = "/home/hatch/workspace/mochiichao-work/title-creatures-9/work/mochii-feather-preview-20261026.png"

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

# 1. Live main HEAD (recorded, not assumed)
status, main = call("GET", f"/repos/{OWNER}/{REPO}/branches/main")
live = main["commit"]["sha"]
print(f"live main: {live}", flush=True)

# 2. Create branch from live main
status, ref = call("POST", f"/repos/{OWNER}/{REPO}/git/refs",
                    {"ref": f"refs/heads/{BRANCH}", "sha": live})
if status == 422:
    status, ref = call("GET", f"/repos/{OWNER}/{REPO}/git/ref/heads/{BRANCH}")
    if status != 200 or ref["object"]["sha"] != live:
        print(f"ABORT: branch already exists at unexpected state: {status} {ref}", flush=True)
        sys.exit(2)
    print("branch already exists at live main, proceeding", flush=True)
elif status not in (200, 201):
    print(f"FAIL creating branch: HTTP {status} {ref}", flush=True)
    sys.exit(3)
print(f"branch {BRANCH} -> {live}", flush=True)

# 3. Existing file on branch: must exist (replace, not add); capture blob SHA
status, cur = call("GET", f"/repos/{OWNER}/{REPO}/contents/{DEST}?ref={BRANCH}")
if status != 200:
    print(f"ABORT: expected existing {DEST} on branch, got {status} {cur}", flush=True)
    sys.exit(2)
old_sha = cur["sha"]
print(f"existing {DEST} blob sha: {old_sha} size: {cur.get('size')}", flush=True)

# 4. Sanity: current file on main must be the hard-cut shipped Mochii
#    (380x380, zero intermediate alpha) — not an already-feathered file.
from PIL import Image
import io, collections
raw = base64.b64decode(cur["content"])
im = Image.open(io.BytesIO(raw))
vals = collections.Counter(im.getchannel("A").getdata())
print(f"current on branch: {im.size} {im.mode} alpha128={vals[128]}", flush=True)
if im.size != (380, 380) or vals[128] != 0:
    print("ABORT: current file is not the expected hard-cut shipped Mochii", flush=True)
    sys.exit(2)

# 5. Sanity: preview must be 380x380 with the 1px feather, RGB == shipped RGB
with open(SRC, "rb") as fh:
    new_bytes = fh.read()
pim = Image.open(io.BytesIO(new_bytes))
pvals = collections.Counter(pim.getchannel("A").getdata())
print(f"preview: {pim.size} {pim.mode} alpha128={pvals[128]}", flush=True)
assert pim.size == (380, 380) and pvals[128] == 2047, "preview mismatch"
# RGB identical everywhere (feather is alpha-only)
import numpy as np
old_rgb = np.array(im.convert("RGB"))
new_rgb = np.array(pim.convert("RGB"))
assert (old_rgb == new_rgb).all(), "RGB differs — abort"
print("preview RGB identical to shipped, alpha-only change confirmed", flush=True)

# 6. Upload (PUT requires the existing blob SHA for a replace)
content = base64.b64encode(new_bytes).decode()
status, resp = call("PUT", f"/repos/{OWNER}/{REPO}/contents/{DEST}",
                    {"message": "Ship feathered Mochii preview as new locked cutout (Mars-approved 2026-10-26: barely feathered, perfect) — 1px feather, interior/RGB unchanged, files only",
                     "content": content, "branch": BRANCH, "sha": old_sha})
if status not in (200, 201):
    print(f"FAIL upload: HTTP {status} {resp}", flush=True)
    sys.exit(3)
print(f"UPLOADED {DEST} -> new blob {resp['content']['sha']}", flush=True)
