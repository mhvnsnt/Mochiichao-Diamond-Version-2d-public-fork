#!/usr/bin/env python3
"""Resume the disc-to-repo docs batch after the first uploader died
mid-run (75 blobs printed, 76 files actually on the branch — one PUT
succeeded server-side but its response never printed). Uploads ONLY the
files missing from the branch; never re-PUTs an existing file. The
uploader's own log file is handled separately at the end (finalize step),
NOT by this script, to avoid uploading a log that is still being written.
No token printed."""
import base64, glob, json, os, sys, urllib.request, urllib.error
sys.path.insert(0, "/opt/muse/skills/custom-connector-setup/bin")
from dynamic_credentials import add_surrogate_to_request
sys.path.insert(0, "/home/hatch/workspace/mochiichao-work/title-creatures-9/work")
import importlib.util
_spec = importlib.util.spec_from_file_location(
    "up", "/home/hatch/workspace/mochiichao-work/title-creatures-9/work/disc-to-repo-upload-20261027.py")
# Reuse lists without running main(): read the file and exec only the list defs.
_src = open("/home/hatch/workspace/mochiichao-work/title-creatures-9/work/disc-to-repo-upload-20261027.py").read()
_ns = {}
for chunk in _src.split("class NoRedirect")[0].split("def main")[0].split("\n"):
    pass
exec(compile(_src.split("class NoRedirect")[0], "lists", "exec"), _ns)
OWNER, REPO, BRANCH, LANE = _ns["OWNER"], _ns["REPO"], _ns["BRANCH"], _ns["LANE"]
DOCS, BUILDERS, DATA = _ns["DOCS"], _ns["BUILDERS"], _ns["DATA"]

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
        with urllib.request.build_opener(NoRedirect()).open(req, timeout=120) as resp:
            body = resp.read().decode()
            return resp.status, json.loads(body) if body else {}
    except urllib.error.HTTPError as e:
        return e.code, {"error": e.read().decode()[:300]}

mapping = []
for src in DOCS:
    mapping.append((src, "docs/title-creatures/" + os.path.basename(src)))
for src in BUILDERS:
    mapping.append((src, "docs/title-creatures/builders/" + os.path.basename(src)))
for src in DATA:
    mapping.append((src, "docs/title-creatures/data/" + os.path.basename(src)))
logs = sorted(
    [p for p in glob.glob(LANE + "/work/**/*.log", recursive=True)
     + glob.glob(LANE + "/work/**/*.txt", recursive=True)
     if "muse-links" not in p and "disc-to-repo-upload-log" not in p]
    + [LANE + "/yogiferno-feather-gates.log",
       LANE + "/yogiferno-feather-merge.log"])
for abspath in logs:
    mapping.append((os.path.relpath(abspath, LANE),
                    "docs/title-creatures/logs/" + os.path.basename(abspath)))
status, tree = call("GET", f"/repos/{OWNER}/{REPO}/git/trees/{BRANCH}?recursive=1")
on_branch = {t["path"] for t in tree.get("tree", []) if t["type"] == "blob"}
missing = [(s, d) for s, d in mapping if d not in on_branch]
print(f"mapping: {len(mapping)}, on branch: {len(on_branch & {d for _, d in mapping})}, "
      f"missing: {len(missing)}", flush=True)
for src, dest in missing:
    print(f"missing: {dest}", flush=True)
    data = base64.b64encode(open(os.path.join(LANE, src), "rb").read()).decode()
    status, up = call("PUT", f"/repos/{OWNER}/{REPO}/contents/{dest}",
                      {"message": f"Title Creatures lane docs batch: add {dest} (additions only, 0 deletions)",
                       "content": data, "branch": BRANCH})
    blob = up.get("content", {}).get("sha")
    print(f"{dest}: HTTP {status} blob={blob}", flush=True)
    if status not in (200, 201) or not blob:
        print(f"FAIL upload {dest}: {up}", flush=True)
        sys.exit(4)
print("RESUME OK — all non-self-log files on branch", flush=True)
