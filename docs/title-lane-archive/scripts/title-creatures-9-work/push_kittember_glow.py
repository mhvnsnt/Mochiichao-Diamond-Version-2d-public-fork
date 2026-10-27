import json, sys, base64, urllib.request, urllib.error
sys.path.insert(0, "/opt/muse/skills/custom-connector-setup/bin")
from dynamic_credentials import add_surrogate_to_request
OWNER="mhvnsnt"; REPO="Mochiichao-Diamond-Version-2d-fresh-start"
BRANCH="feature/title-creatures-kittember-glow-1"; BASE="281960960b5321e0e93fd105d58cc8ff80285f58"
def call(method, path, payload=None):
    data=json.dumps(payload).encode() if payload is not None else None
    req=urllib.request.Request("https://api.github.com"+path, data=data, method=method)
    req.add_header("Accept","application/vnd.github+json"); req.add_header("User-Agent","Muse-GitHub-Api")
    if data: req.add_header("Content-Type","application/json")
    add_surrogate_to_request(req, "custom.github-api", allowed_hosts=["api.github.com"])
    try:
        with urllib.request.urlopen(req, timeout=180) as r:
            b=r.read().decode(); return r.status, json.loads(b) if b else {}
    except urllib.error.HTTPError as e:
        print(f"HTTP {e.code} {method} {path}: {e.read().decode()[:400]}", flush=True); raise
try:
    st, ref = call("POST", f"/repos/{OWNER}/{REPO}/git/refs", {"ref": f"refs/heads/{BRANCH}", "sha": BASE})
    print("branch created:", ref.get("ref"))
except urllib.error.HTTPError:
    print("branch already exists, continuing")
st, cur = call("GET", f"/repos/{OWNER}/{REPO}/contents/src/assets/title/kittember-walk-cutout.png?ref={BRANCH}")
print("current kittember sha:", cur["sha"][:8])
files = [
    ("src/assets/title/kittember-walk-cutout.png", "/home/hatch/workspace/mochiichao-work/title-creatures-9/repo/src/assets/title/kittember-walk-cutout.png", True, cur["sha"]),
    ("docs/title-cutout-white-background-glow-method.md", "/home/hatch/workspace/mochiichao-work/title-creatures-9/repo/docs/title-cutout-white-background-glow-method.md", False, None),
]
for repo_path, local, binary, sha in files:
    raw = open(local, "rb").read()
    content = base64.b64encode(raw).decode() if binary else raw.decode()
    payload = {"message": f"Kittember glow ship: {repo_path}", "content": content, "branch": BRANCH}
    if sha: payload["sha"] = sha
    st, res = call("PUT", f"/repos/{OWNER}/{REPO}/contents/{repo_path}", payload)
    print("uploaded:", repo_path, res["content"]["sha"][:8], res["content"]["size"])
print("BRANCH READY:", BRANCH)
