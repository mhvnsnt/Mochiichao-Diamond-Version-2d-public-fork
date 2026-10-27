import sys, json, base64, urllib.request, urllib.error
sys.path.insert(0, "/opt/muse/skills/custom-connector-setup/bin")
from dynamic_credentials import add_surrogate_to_request

REPO = "mhvnsnt/Mochiichao-Diamond-Version-2d-fresh-start"
API = "https://api.github.com/repos/" + REPO
BASE = "/home/hatch/workspace/mochiichao-work/ui-art/title-backgrounds"
BRANCH = "feature/title-final-videos-20261026"

FILES = [
    ("action-videos-v6/yogiferno-title-anim-v6.mp4", "yogiferno", "v6 (blizzard)"),
    ("action-videos-v3/razorgater-title-anim-v3.mp4", "razorgater", "v3"),
    ("action-videos-v3/mochii-title-anim-v3.mp4", "mochii", "v3"),
    ("action-videos-v3/kittember-title-anim-v3.mp4", "kittember", "v3"),
    ("action-videos-v2/dorowani-title-anim-v2.mp4", "dorowani", "v2"),
    ("action-videos-v2/gabu-title-anim-v2.mp4", "gabu", "v2"),
    ("action-videos-v2/wispkin-title-anim-v2.mp4", "wispkin", "v2"),
    ("action-videos-v2/sproutle-title-anim-v2.mp4", "sproutle", "v2"),
    ("action-videos-v2/tyrage-title-anim-v2.mp4", "tyrage", "v2"),
    ("action-videos-v2/mythar-title-anim-v2.mp4", "mythar", "v2"),
]

def gh(url, method="GET", data=None):
    req = urllib.request.Request(url, method=method,
        data=json.dumps(data).encode() if data is not None else None,
        headers={"Content-Type": "application/json"} if data is not None else {})
    add_surrogate_to_request(req, "custom.github-api", allowed_hosts=["api.github.com"])
    try:
        with urllib.request.urlopen(req) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        body = e.read().decode()[:500]
        raise RuntimeError(f"{method} {url} -> {e.code} {body}")

main = gh(API)
main_sha = main["default_branch"] and gh(API + "/commits/main")["sha"]
print("live main:", main_sha)

# create branch
try:
    ref = gh(API + "/git/refs", "POST", {"ref": "refs/heads/" + BRANCH, "sha": main_sha})
    print("branch created:", ref["ref"])
except RuntimeError as e:
    print("branch create note:", e)

uploaded = []
for staging, creature, ver in FILES:
    src = f"{BASE}/{staging}"
    with open(src, "rb") as f:
        content = base64.b64encode(f.read()).decode()
    import os
    size = os.path.getsize(src)
    dest = f"src/assets/title/videos/{creature}-title-anim-final.mp4"
    # 404-check on main
    try:
        gh(API + "/contents/" + dest + "?ref=main")
        print("WARN exists on main, skipping upload (would overwrite):", dest)
        continue
    except RuntimeError as e:
        if "404" not in str(e):
            raise
    gh(API + "/contents/" + dest, "PUT", {
        "message": f"Title final video: {creature} ({ver})",
        "content": content, "branch": BRANCH})
    print("uploaded:", dest, size)
    uploaded.append((creature, ver, staging, size))

lines = ["# Title final videos (final-for-now set)",
         "",
         "Preview assets only — NOT imported by game code, like the GIFs shipped in PR #139. "
         "Yogiferno's final lock still awaits the hand-drawn opposite-stride frame; "
         "v6 (blizzard) is the final-for-now Yogiferno, upgradeable later.",
         "",
         "| Creature | Source version | Staging path | Size (bytes) |",
         "|---|---|---|---|"]
for creature, ver, staging, size in uploaded:
    lines.append(f"| {creature} | {ver} | ui-art/title-backgrounds/{staging} | {size} |")
lines += ["",
          "Repo paths: `src/assets/title/videos/<creature>-title-anim-final.mp4` (10 files).",
          "All videos 1280x720, 30fps, 6.0s, no audio, no logo baked in, no Pokemon art or sounds."]
doc = "\n".join(lines) + "\n"
gh(API + "/contents/docs/title-final-videos.md", "PUT", {
    "message": "Title final videos doc",
    "content": base64.b64encode(doc.encode()).decode(), "branch": BRANCH})
print("doc uploaded")

pr = gh(API + "/pulls", "POST", {
    "title": "Title final videos (final-for-now set, 10 videos)",
    "head": BRANCH, "base": "main",
    "body": "Final-for-now title video set: Yogiferno v6 (blizzard), Razorgater/Mochii/Kittember v3, Dorowani/Gabu/Wispkin/Sproutle/Tyrage/Mythar v2. Previews only, not imported by game code. 11 files added, 0 deletions. No logo/font/menu/IntroSequence/player/game-code changes. No Pokemon art or sounds."})
print("PR:", pr["number"], pr["html_url"], "mergeable:", pr.get("mergeable"))
