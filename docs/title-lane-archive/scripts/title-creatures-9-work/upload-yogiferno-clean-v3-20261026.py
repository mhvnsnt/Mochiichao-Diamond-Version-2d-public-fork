#!/usr/bin/env python3
"""Ship Yogiferno clean v3 as the new locked cutout (Mars-confirmed 2026-10-26 ~16:35 CDT).
Via GitHub Contents/Refs API (git push has no credentials in this VM) — the lane's
established route. Branch from live main, replace ONE file only:
src/assets/title/yogiferno-walk-cutout.png <- yogiferno-white-speck-clean-v3-20261026.png.
No other file touched, no deletions. No token printed."""
import base64, json, sys, urllib.request, urllib.error
sys.path.insert(0, "/opt/muse/skills/custom-connector-setup/bin")
from dynamic_credentials import add_surrogate_to_request
OWNER="mhvnsnt"; REPO="Mochiichao-Diamond-Version-2d-fresh-start"
BRANCH="feature/yogiferno-clean-v3-20261026"
DEST="src/assets/title/yogiferno-walk-cutout.png"
SRC="/home/hatch/workspace/mochiichao-work/title-creatures-9/work/yogiferno-white-speck-clean-v3-20261026.png"
class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self,*a): raise RuntimeError("redirect refused")
def call(method,path,payload=None):
    data=json.dumps(payload).encode() if payload is not None else None
    req=urllib.request.Request("https://api.github.com"+path,data=data,method=method)
    req.add_header("Accept","application/vnd.github+json"); req.add_header("X-GitHub-Api-Version","2022-11-28"); req.add_header("User-Agent","Muse-GitHub-Api")
    if data: req.add_header("Content-Type","application/json")
    add_surrogate_to_request(req,"custom.github-api",allowed_hosts=["api.github.com"])
    try:
        with urllib.request.build_opener(NoRedirect()).open(req,timeout=180) as r:
            b=r.read().decode(); return r.status, json.loads(b) if b else {}
    except urllib.error.HTTPError as e: return e.code, {"error": e.read().decode()[:600]}
s,main=call("GET",f"/repos/{OWNER}/{REPO}/branches/main")
live=main["commit"]["sha"]; print("live main:",live,flush=True)
s,cur=call("GET",f"/repos/{OWNER}/{REPO}/contents/{DEST}?ref=main")
print("current blob:",cur.get("sha"),"size:",cur.get("size"),flush=True)
s,ref=call("POST",f"/repos/{OWNER}/{REPO}/git/refs",{"ref":f"refs/heads/{BRANCH}","sha":live})
if s==422:
    s,ref=call("GET",f"/repos/{OWNER}/{REPO}/git/ref/heads/{BRANCH}")
    if s!=200 or ref["object"]["sha"]!=live:
        print("ABORT: branch exists at unexpected state",s,ref,flush=True); sys.exit(2)
    print("branch already exists at live main, proceeding",flush=True)
elif s not in (200,201):
    print("FAIL creating branch:",s,ref,flush=True); sys.exit(3)
print(f"branch {BRANCH} -> {live}",flush=True)
content=base64.b64encode(open(SRC,"rb").read()).decode()
s,resp=call("PUT",f"/repos/{OWNER}/{REPO}/contents/{DEST}",
    {"message":"Ship Yogiferno white-speck clean v3 as new locked cutout (Mars-confirmed 2026-10-26): halo specks gone, body perfect; replaces shipped current, supersedes clean v2/v1 and 134x190 version",
     "content":content,"branch":BRANCH,"sha":cur["sha"]})
if s not in (200,201):
    print("FAIL upload:",s,resp,flush=True); sys.exit(3)
print("uploaded blob:",resp["content"]["sha"],flush=True)
s,cmp=call("GET",f"/repos/{OWNER}/{REPO}/compare/main...{BRANCH}")
print("compare files:",[(f["filename"],f["status"]) for f in cmp.get("files",[])],flush=True)
assert len(cmp.get("files",[]))==1 and cmp["files"][0]["filename"]==DEST and cmp["files"][0]["status"]=="modified", cmp
print("UPLOAD OK: exactly 1 file modified",flush=True)
