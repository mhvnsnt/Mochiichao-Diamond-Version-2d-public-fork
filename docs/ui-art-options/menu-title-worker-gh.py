#!/usr/bin/env python3
"""Menu+Title readiness worker GitHub helper (Contents API only for commits).
Usage: menu-title-worker-gh.py <cmd> [args]
  main | prs | get <path> | getraw <path> <outfile> | put <branch> <path> <localfile> [sha]
  branch <name> | pr <branch> <title> <bodyfile> | prstate <n> | merge <n>
"""
import sys, json, urllib.request, urllib.error, base64
sys.path.insert(0, "/opt/muse/skills/custom-connector-setup/bin")
from dynamic_credentials import add_surrogate_to_request
R = "mhvnsnt/Mochiichao-Diamond-Version-2d-fresh-start"

class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args):
        raise RuntimeError("redirect refused")

def req(method, path, data=None):
    r = urllib.request.Request("https://api.github.com" + path, method=method,
        data=json.dumps(data).encode() if data is not None else None)
    r.add_header("Accept", "application/vnd.github+json")
    r.add_header("X-GitHub-Api-Version", "2022-11-28")
    r.add_header("User-Agent", "Muse-GitHub-Api")
    if data is not None:
        r.add_header("Content-Type", "application/json")
    add_surrogate_to_request(r, "custom.github-api", allowed_hosts=["api.github.com"])
    try:
        with urllib.request.build_opener(NoRedirect()).open(r, timeout=120) as resp:
            body = resp.read()
            return json.loads(body.decode()) if body else {}
    except urllib.error.HTTPError as e:
        print(json.dumps({"error": e.code, "body": e.read().decode(errors="replace")[:2000]}))
        sys.exit(1)

def main_sha():
    return req("GET", f"/repos/{R}/branches/main")["commit"]["sha"]

if __name__ == "__main__":
    cmd = sys.argv[1]
    if cmd == "main":
        m = req("GET", f"/repos/{R}/branches/main")
        print(m["commit"]["sha"], m["commit"]["commit"]["message"][:200])
    elif cmd == "prs":
        for p in req("GET", f"/repos/{R}/pulls?state=open&per_page=100"):
            print(f"#{p['number']} {p['title']} head={p['head']['ref']} sha={p['head']['sha'][:12]}")
    elif cmd == "get":
        d = req("GET", f"/repos/{R}/contents/{sys.argv[2]}?ref=main")
        sys.stdout.write(base64.b64decode(d["content"]).decode())
    elif cmd == "getinfo":
        d = req("GET", f"/repos/{R}/contents/{sys.argv[2]}?ref=main")
        raw = base64.b64decode(d["content"])
        import hashlib
        print(sys.argv[2], d["size"], d["sha"], hashlib.sha256(raw).hexdigest())
    elif cmd == "branch":
        sha = main_sha()
        d = req("POST", f"/repos/{R}/git/refs", {"ref": f"refs/heads/{sys.argv[2]}", "sha": sha})
        print("branch", sys.argv[2], "base", sha, "->", d["object"]["sha"])
    elif cmd == "put":
        branch, path, local = sys.argv[2], sys.argv[3], sys.argv[4]
        with open(local, "rb") as f:
            content = base64.b64encode(f.read()).decode()
        payload = {"message": sys.argv[5] if len(sys.argv) > 5 else f"Add {path}",
                   "content": content, "branch": branch}
        if len(sys.argv) > 6 and sys.argv[6] != "-":
            payload["sha"] = sys.argv[6]
        d = req("PUT", f"/repos/{R}/contents/{path}", payload)
        print("put", path, "->", d["content"]["sha"], d["commit"]["sha"])
    elif cmd == "getbranchfile":
        branch, path = sys.argv[2], sys.argv[3]
        d = req("GET", f"/repos/{R}/contents/{path}?ref={branch}")
        print(d["sha"], d["size"])
        sys.stdout.write(base64.b64decode(d["content"]).decode())
    elif cmd == "pr":
        branch, title = sys.argv[2], sys.argv[3]
        with open(sys.argv[4]) as f:
            body = f.read()
        d = req("POST", f"/repos/{R}/pulls", {"title": title, "head": branch, "base": "main", "body": body})
        print("PR", d["number"], d["html_url"], "mergeable:", d.get("mergeable"))
    elif cmd == "prstate":
        d = req("GET", f"/repos/{R}/pulls/{sys.argv[2]}")
        print(f"PR {d['number']} state={d['state']} merged={d.get('merged')} mergeable={d.get('mergeable')} mergeable_state={d.get('mergeable_state')} head={d['head']['sha']}")
        if d.get("merged"):
            print("merge_commit", d.get("merge_commit_sha"))
    elif cmd == "merge":
        d = req("PUT", f"/repos/{R}/pulls/{sys.argv[2]}/merge", {"merge_method": "merge"})
        print(json.dumps(d)[:1000])
    elif cmd == "prfiles":
        for f in req("GET", f"/repos/{R}/pulls/{sys.argv[2]}/files?per_page=100"):
            print(f["status"], f["filename"], f"+{f['additions']}/-{f['deletions']}")
