#!/usr/bin/env python3
"""Upload full-res title videos to a new branch + open PR (no merge)."""
import sys, json, base64, urllib.request, subprocess

sys.path.insert(0, "/opt/muse/skills/custom-connector-setup/bin")
from dynamic_credentials import add_surrogate_to_request

REPO = "mhvnsnt/Mochiichao-Diamond-Version-2d-fresh-start"
API = f"https://api.github.com/repos/{REPO}"
STAGE = "/home/hatch/workspace/mochiichao-work/ui-art/title-backgrounds/action-videos-fullres"
BRANCH = "feature/title-fullres-videos-20261026"

def gh(url, method="GET", data=None):
    req = urllib.request.Request(url, method=method,
        data=json.dumps(data).encode() if data is not None else None,
        headers={"Content-Type": "application/json"} if data is not None else {})
    add_surrogate_to_request(req, "custom.github-api", allowed_hosts=["api.github.com"])
    try:
        with urllib.request.urlopen(req) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="replace")
        raise SystemExit(f"HTTP {e.code} {method} {url}: {body[:500]}")

main_sha = subprocess.check_output(
    ["git", "ls-remote", f"https://github.com/{REPO}.git", "HEAD"],
    text=True).split()[0]
print("live main:", main_sha)

files = {}
for c in ["yogiferno", "dorowani", "gabu", "wispkin", "sproutle",
          "tyrage", "mythar", "razorgater", "mochii", "kittember"]:
    with open(f"{STAGE}/{c}-title-anim-fullres.mp4", "rb") as fh:
        files[f"src/assets/title/videos-fullres/{c}-title-anim-fullres.mp4"] = fh.read()
with open(f"{STAGE}/title-fullres-videos.md", "rb") as fh:
    files["docs/title-fullres-videos.md"] = fh.read()

# 404-check destinations on main (404 = free, anything else = stop)
import urllib.error
for p in files:
    req = urllib.request.Request(f"{API}/contents/{p}?ref=main")
    add_surrogate_to_request(req, "custom.github-api", allowed_hosts=["api.github.com"])
    try:
        urllib.request.urlopen(req)
        raise SystemExit(f"DESTINATION EXISTS on main, refusing overwrite: {p}")
    except urllib.error.HTTPError as e:
        if e.code != 404:
            raise SystemExit(f"unexpected status {e.code} checking {p}")
print("404-check passed: all 11 destinations free on main")

gh(f"{API}/git/refs", "POST", {"ref": f"refs/heads/{BRANCH}", "sha": main_sha})
print("branch created:", BRANCH)

for p, data in files.items():
    r = gh(f"{API}/contents/{p}", "PUT", {
        "message": f"Title full-res video: {p}",
        "content": base64.b64encode(data).decode(),
        "branch": BRANCH})
    print("uploaded", p, len(data), r["content"]["sha"][:8])

pr = gh(f"{API}/pulls", "POST", {
    "title": "Title full-res videos 1600x900 (native re-renders)",
    "head": BRANCH, "base": "main",
    "body": "Native 1600x900, 30fps, 6s re-renders of the FINAL title video set "
            "(Yogiferno v6 blizzard, Razorgater/Mochii/Kittember v3, other six v2), "
            "geometry scaled 1.25x from the 1280x720 builders — not upscales. "
            "10 videos + doc, 0 deletions. Previews only, not imported by game code. "
            "No logo, no Pokemon art/sound."})
print("PR:", pr["html_url"], "number", pr["number"])
pr2 = gh(f"{API}/pulls/{pr['number']}")
print("mergeable:", pr2["mergeable"], "state:", pr2["state"])
cr = gh(f"{API}/commits/{pr2['head']['sha']}/check-runs")
print("checks:", [(c["name"], c["conclusion"]) for c in cr.get("check_runs", [])])
