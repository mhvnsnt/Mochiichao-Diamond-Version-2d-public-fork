import base64, json, sys, urllib.request, urllib.error
sys.path.insert(0, "/opt/muse/skills/custom-connector-setup/bin")
from dynamic_credentials import add_surrogate_to_request
OWNER="mhvnsnt"; REPO="Mochiichao-Diamond-Version-2d-fresh-start"
class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *a): raise RuntimeError("redirect refused")
def call(method, path, payload=None, raw=False):
    data=json.dumps(payload).encode() if payload is not None else None
    req=urllib.request.Request("https://api.github.com"+path, data=data, method=method)
    req.add_header("Accept","application/vnd.github+json"); req.add_header("X-GitHub-Api-Version","2022-11-28"); req.add_header("User-Agent","Muse-GitHub-Api")
    if data: req.add_header("Content-Type","application/json")
    add_surrogate_to_request(req, "custom.github-api", allowed_hosts=["api.github.com"])
    try:
        with urllib.request.build_opener(NoRedirect()).open(req, timeout=180) as r:
            b=r.read().decode(); return (r.status, json.loads(b) if b else {})
    except urllib.error.HTTPError as e:
        body=e.read().decode()
        print(f"HTTP {e.code} {method} {path}: {body[:300]}", flush=True); raise
BASE="/home/hatch/workspace/mochiichao-work/ui-art/title-backgrounds/pullin-staging"
FILES=[
 ("docs/title-pull-in-inventory.md", f"{BASE}/pull-in-inventory.md"),
 ("tools/title_manifest.py", f"{BASE}/tools/title_manifest.py"),
 ("tools/title_verify.py", f"{BASE}/tools/title_verify.py"),
 ("tools/title_atlas.py", f"{BASE}/tools/title_atlas.py"),
 ("tools/title_phone.py", f"{BASE}/tools/title_phone.py"),
 ("src/assets/title/title-poses-v2-atlas.png", f"{BASE}/atlas/title-poses-v2-atlas.png"),
 ("src/assets/title/title-poses-v2-atlas.json", f"{BASE}/atlas/title-poses-v2-atlas.json"),
]
for b in ["snow","grass","water","sand","stone","forest","rain","night","mythar","lantern"]:
    FILES.append((f"src/assets/title/phone/title-bg-{b}-phone-390x844.png", f"{BASE}/phone/title-bg-{b}-phone-390x844.png"))
_, main = call("GET", f"/repos/{OWNER}/{REPO}/branches/main")
main_sha = main["commit"]["sha"]; print("live main:", main_sha, flush=True)
BRANCH="feature/title-pullin-pipeline-1"
try:
    call("POST", f"/repos/{OWNER}/{REPO}/git/refs", {"ref": f"refs/heads/{BRANCH}", "sha": main_sha})
    print("branch created", BRANCH, flush=True)
except Exception:
    print("branch may already exist, continuing", flush=True)
import urllib.parse
for rel, local in FILES:
    # 404-check on main
    try:
        call("GET", f"/repos/{OWNER}/{REPO}/contents/{urllib.parse.quote(rel, safe='/')}?ref=main")
        print("EXISTS ON MAIN (not new, abort check):", rel, flush=True); sys.exit(2)
    except urllib.error.HTTPError as e:
        if e.code != 404: raise
    raw = open(local, "rb").read()
    _, out = call("PUT", f"/repos/{OWNER}/{REPO}/contents/{urllib.parse.quote(rel, safe='/')}",
        {"message": "Title pull-in pipeline: inventory + manifest/verify/atlas/phone tools + previews", "content": base64.b64encode(raw).decode(), "branch": BRANCH})
    print("uploaded", rel, len(raw), out.get("commit", {}).get("sha"), flush=True)
_, pr = call("POST", f"/repos/{OWNER}/{REPO}/pulls", {"title": "Title pull-in: pipeline tools + inventory + pose atlas + phone previews",
    "head": BRANCH, "base": "main",
    "body": "Title Backgrounds lane pull-in batch (pipeline only, no game behaviour change).\n\n- docs/title-pull-in-inventory.md: Pokemon element -> Mochiichao replacement -> HAVE/WIRED/NEED/REJECTED per item (13 items evaluated).\n- tools/title_manifest.py, tools/title_verify.py (frame-diff + SHA gate), tools/title_atlas.py, tools/title_phone.py.\n- src/assets/title/title-poses-v2-atlas.png + .json: 40 v2 pose cells, 2048x3059.\n- src/assets/title/phone/title-bg-*-phone-390x844.png: 10 phone-size background previews, no text.\n\nNOT in this PR (plainly): final title videos (parent call: repo save waits on hand-drawn Yogiferno stride + v5 flip fix), TitleScene intro-zoom patch (staged in inventory, build gate blocked this turn), full fieldWeather step swap, WebM VP9 (CPU encode timed out), FastNoise/WFC (rejected, see inventory).\n\n0 file deletions, no logo/font/menu/IntroSequence/player changes, no Pokemon art/sound."})
print("PR:", pr.get("number"), pr.get("html_url"), flush=True)
_, pr2 = call("GET", f"/repos/{OWNER}/{REPO}/pulls/{pr['number']}")
print("mergeable:", pr2.get("mergeable"), "add:", pr2.get("additions"), "del:", pr2.get("deletions"), flush=True)
_, runs = call("GET", f"/repos/{OWNER}/{REPO}/commits/{pr2['head']['sha']}/check-runs")
print("checks:", [(r["name"], r["conclusion"] or r["status"]) for r in runs.get("check_runs", [])], flush=True)
