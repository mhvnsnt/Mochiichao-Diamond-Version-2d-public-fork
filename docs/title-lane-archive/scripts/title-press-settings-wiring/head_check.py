import json, sys, urllib.request, urllib.error
sys.path.insert(0, "/opt/muse/skills/custom-connector-setup/bin")
from dynamic_credentials import add_surrogate_to_request
class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *a): raise RuntimeError("redirect refused")
def call(method, path, payload=None):
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request("https://api.github.com"+path, data=data, method=method)
    req.add_header("Accept", "application/vnd.github+json"); req.add_header("X-GitHub-Api-Version", "2022-11-28"); req.add_header("User-Agent", "Muse-GitHub-Api")
    if data: req.add_header("Content-Type", "application/json")
    add_surrogate_to_request(req, "custom.github-api", allowed_hosts=["api.github.com"])
    with urllib.request.build_opener(NoRedirect()).open(req, timeout=180) as r:
        b=r.read().decode(); return r.status, json.loads(b) if b else {}
s, main = call("GET", "/repos/mhvnsnt/Mochiichao-Diamond-Version-2d-fresh-start/branches/main")
print("main_sha:", main["commit"]["sha"])
print("main_message:", main["commit"]["commit"]["message"][:200])
