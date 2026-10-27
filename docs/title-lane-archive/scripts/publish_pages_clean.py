import base64, json, os, sys, urllib.request, urllib.error
sys.path.insert(0, "/opt/muse/skills/custom-connector-setup/bin")
from dynamic_credentials import add_surrogate_to_request
OWNER="mhvnsnt"; REPO="Mochiichao-Diamond-Version-2d-fresh-start"
DIST="/home/hatch/workspace/mochiichao-work/pages-build/main-clone/dist"
class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *a): raise RuntimeError("redirect refused")
def call(method, path, payload=None):
    data=json.dumps(payload).encode() if payload is not None else None
    req=urllib.request.Request("https://api.github.com"+path, data=data, method=method)
    req.add_header("Accept","application/vnd.github+json"); req.add_header("X-GitHub-Api-Version","2022-11-28"); req.add_header("User-Agent","Muse-GitHub-Api")
    if data: req.add_header("Content-Type","application/json")
    add_surrogate_to_request(req, "custom.github-api", allowed_hosts=["api.github.com"])
    try:
        with urllib.request.build_opener(NoRedirect()).open(req, timeout=180) as r:
            b=r.read().decode(); return r.status, json.loads(b) if b else {}
    except urllib.error.HTTPError as e:
        print(f"HTTP {e.code} {method} {path}: {e.read().decode()[:500]}", flush=True); raise
files=[]
for root, _, names in os.walk(DIST):
    for n in names:
        full=os.path.join(root,n); files.append((full, os.path.relpath(full, DIST)))
files.sort(key=lambda x: x[1])
tree=[]
for full, rel in files:
    raw=open(full,"rb").read()
    _, blob = call("POST", f"/repos/{OWNER}/{REPO}/git/blobs", {"content": base64.b64encode(raw).decode(), "encoding": "base64"})
    tree.append({"path": rel, "mode": "100644", "type": "blob", "sha": blob["sha"]})
    print("blob", rel, len(raw), flush=True)
_, blob = call("POST", f"/repos/{OWNER}/{REPO}/git/blobs", {"content": "", "encoding": "utf-8"})
tree.append({"path": ".nojekyll", "mode": "100644", "type": "blob", "sha": blob["sha"]})
_, treeobj = call("POST", f"/repos/{OWNER}/{REPO}/git/trees", {"tree": tree})
print("tree", treeobj["sha"], flush=True)
_, commit = call("POST", f"/repos/{OWNER}/{REPO}/git/commits", {"message": "Publish playable build (main 22e526ac, PR #56 v5.3) to GitHub Pages — dist only, boot-sounds preserved", "tree": treeobj["sha"], "parents": []})
print("commit", commit["sha"], flush=True)
_, ref = call("PATCH", f"/repos/{OWNER}/{REPO}/git/refs/heads/gh-pages", {"sha": commit["sha"], "force": True})
print("gh-pages now", ref["object"]["sha"], flush=True)
