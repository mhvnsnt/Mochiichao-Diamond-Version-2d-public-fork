#!/usr/bin/env python3
"""Publish pages-rebuild-pass8/dist to gh-pages via GitHub Git Data API.
- No git push (no credentials in this VM), no force-push, main untouched.
- Base tree = current gh-pages tree, so boot-sounds/, quickest-2026-ways/,
  and all unchanged files are preserved; only new/changed dist files are
  added as new blobs, in a single new commit whose parent is the old
  gh-pages head. Ref update is fast-forward only (force=False).
- If gh-pages head moved since the diff was computed, abort before
  creating anything, so another lane's publish is never overwritten.
"""
import sys, os, json, base64, time, urllib.request, urllib.error
sys.path.insert(0, "/opt/muse/skills/custom-connector-setup/bin")
from dynamic_credentials import add_surrogate_to_request

OWNER = "mhvnsnt"; REPO = "Mochiichao-Diamond-Version-2d-fresh-start"
DIST = "/home/hatch/workspace/mochiichao-work/pages-rebuild-pass8/dist"
EXPECTED_GHPAGES_HEAD = "5f8034b76a805788411744f73e08942b3a0375f0"
MAIN_SHA = "615c59aa7137e46adff9f03b9235ff3adb0bedc6"

def call(method, path, payload=None):
    for attempt in range(5):
        data = json.dumps(payload).encode() if payload is not None else None
        req = urllib.request.Request("https://api.github.com" + path, data=data, method=method)
        req.add_header("Accept", "application/vnd.github+json")
        req.add_header("User-Agent", "Muse-Pages-Publish")
        if data: req.add_header("Content-Type", "application/json")
        add_surrogate_to_request(req, "custom.github-api", allowed_hosts=["api.github.com"])
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                body = r.read().decode()
                return json.loads(body) if body else {}
        except urllib.error.HTTPError as e:
            txt = e.read().decode()[:400]
            if e.code in (403, 429, 500, 502, 503) and attempt < 4:
                print(f"retry {e.code} {method} {path} (attempt {attempt+1})", flush=True)
                time.sleep(10 * (attempt + 1)); continue
            print(f"HTTP {e.code} {method} {path}: {txt}", flush=True); raise
        except Exception as e:
            if attempt < 4:
                print(f"retry error {e} (attempt {attempt+1})", flush=True)
                time.sleep(10 * (attempt + 1)); continue
            raise

def main():
    head = call("GET", f"/repos/{OWNER}/{REPO}/branches/gh-pages")
    head_sha = head["commit"]["sha"]
    print("gh-pages head now:", head_sha, flush=True)
    if head_sha != EXPECTED_GHPAGES_HEAD:
        print("ABORT: gh-pages head moved since diff computed; not overwriting another lane's publish.", flush=True)
        return 2
    base_tree = head["commit"]["commit"]["tree"]["sha"]
    diff = json.load(open("/tmp/dist_diff.json"))
    items = [(p, s) for p, s, *_ in diff["changed"]] + [(p, s) for p, s, *_ in diff["new"]]
    print(f"blobs to create: {len(items)}", flush=True)
    from concurrent.futures import ThreadPoolExecutor
    def make_blob(item):
        rel, size = item
        data = open(os.path.join(DIST, rel), "rb").read()
        blob = call("POST", f"/repos/{OWNER}/{REPO}/git/blobs",
                    {"content": base64.b64encode(data).decode(), "encoding": "base64"})
        return {"path": rel, "mode": "100644", "type": "blob", "sha": blob["sha"]}
    entries = []
    with ThreadPoolExecutor(max_workers=8) as ex:
        for i, entry in enumerate(ex.map(make_blob, items), 1):
            entries.append(entry)
            if i % 100 == 0 or i == len(items):
                print(f"blobs {i}/{len(items)}", flush=True)
    tree = call("POST", f"/repos/{OWNER}/{REPO}/git/trees",
                {"base_tree": base_tree, "tree": entries})
    print("new tree:", tree["sha"], flush=True)
    commit = call("POST", f"/repos/{OWNER}/{REPO}/git/commits",
                  {"message": f"Pages build from main {MAIN_SHA} (Creature Mode Pass 8, PR #230)\n\nDist-only gh-pages update. Main branch untouched. Boot-sounds and quickest-2026-ways trees preserved via base tree.",
                   "tree": tree["sha"], "parents": [head_sha]})
    print("new commit:", commit["sha"], flush=True)
    ref = call("PATCH", f"/repos/{OWNER}/{REPO}/git/refs/heads/gh-pages",
               {"sha": commit["sha"], "force": False})
    print("gh-pages ref now:", ref["object"]["sha"], flush=True)
    print("PUBLISHED", commit["sha"], flush=True)
    return 0

if __name__ == "__main__":
    sys.exit(main())
