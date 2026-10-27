import base64, json, os, sys, urllib.request, urllib.error
sys.path.insert(0, "/opt/muse/skills/custom-connector-setup/bin")
from dynamic_credentials import add_surrogate_to_request
OWNER="mhvnsnt"; REPO="Mochiichao-Diamond-Version-2d-fresh-start"; BRANCH="gh-pages"
DIST="/home/hatch/workspace/mochiichao-work/pages-build/main-clone-preset/dist"
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
_, main = call("GET", f"/repos/{OWNER}/{REPO}/branches/main")
print("main:", main["commit"]["sha"], flush=True)
try:
    _, ref = call("POST", f"/repos/{OWNER}/{REPO}/git/refs", {"ref": f"refs/heads/{BRANCH}", "sha": main["commit"]["sha"]})
    print("gh-pages branch created", flush=True)
except Exception:
    print("gh-pages branch already exists, continuing", flush=True)
files=[]
for root, _, names in os.walk(DIST):
    for n in names:
        full=os.path.join(root,n); rel=os.path.relpath(full, DIST); files.append((full, rel))
files.append((None, ".nojekyll"))
from urllib.parse import quote
for i,(full, rel) in enumerate(sorted(files, key=lambda x: x[1]),1):
    raw=b"" if full is None else open(full,"rb").read()
    enc="/".join(quote(p) for p in rel.split("/"))
    sha=None
    try:
        _, ex = call("GET", f"/repos/{OWNER}/{REPO}/contents/{enc}?ref={BRANCH}"); sha=ex.get("sha")
    except Exception: sha=None
    payload={"message":"Publish playable build (PR #259 start screens, main 53c1ea9f) to GitHub Pages\n\nDeletions: NONE (gh-pages dist only)","content":base64.b64encode(raw).decode(),"branch":BRANCH}
    if sha: payload["sha"]=sha
    _, out = call("PUT", f"/repos/{OWNER}/{REPO}/contents/{enc}", payload)
    print(f"{i}/{len(files)} {rel} ({len(raw)} bytes) -> {out.get('commit',{}).get('sha')}", flush=True)
# Enable Pages
try:
    _, pages = call("POST", f"/repos/{OWNER}/{REPO}/pages", {"source": {"branch": BRANCH, "path": "/"}})
    print("PAGES ENABLED:", pages.get("html_url"), pages.get("status"), flush=True)
except Exception as e:
    print("PAGES ENABLE FAILED, checking existing:", e, flush=True)
    try:
        _, pages = call("GET", f"/repos/{OWNER}/{REPO}/pages")
        print("PAGES EXISTING:", pages.get("html_url"), pages.get("status"), pages.get("source"), flush=True)
    except Exception as e2:
        print("PAGES GET FAILED:", e2, flush=True)
