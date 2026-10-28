#!/usr/bin/env python3
"""Stage public repo source via the authenticated GitHub API + raw fetches.
Full-tree listing pinned to a commit sha; text/code files fetched and
write-verified; binaries/large files listed in FETCH-MANIFEST.json only."""
import base64, hashlib, json, pathlib, sys, time, urllib.request, urllib.error
sys.path.insert(0, "/opt/muse/skills/custom-connector-setup/bin")
from dynamic_credentials import add_surrogate_to_request, read_response_body

ROOT = pathlib.Path.home()/"workspace/ep01-rebuild/full-stack/src-api"
TEXT_EXT = {".py",".md",".txt",".json",".sh",".toml",".yaml",".yml",".js",".ts",".tsx",".jsx",".html",".css",".cfg",".ini",".bat",".ps1",".dockerfile",".gitignore",".example",".env",".csv",".xml",".jinja",".jinja2",".mustache",".hbs",".vue",".svelte",".c",".cpp",".h",".cu",".rs",".go",".java",".rb",".php",".lua",".r",".sql",".lock"}
MAX_FILE, MAX_FILES, MAX_BYTES = 900_000, 500, 40_000_000

def api(url):
    req = urllib.request.Request(url, headers={"Accept":"application/vnd.github+json","User-Agent":"muse-stage/1.0","X-GitHub-Api-Version":"2022-11-28"})
    add_surrogate_to_request(req, "custom.github-pat", allowed_hosts=["api.github.com"])
    with urllib.request.build_opener().open(req, timeout=60) as r:
        return json.loads(read_response_body(r).decode())

def raw(repo, sha, path):
    url = f"https://raw.githubusercontent.com/{repo}/{sha}/{urllib.request.quote(path)}"
    with urllib.request.urlopen(url, timeout=60) as r: return r.read()

def write_verified(dst, data):
    for attempt in range(6):
        try:
            dst.parent.mkdir(parents=True, exist_ok=True)
            dst.write_bytes(data)
            if dst.read_bytes() == data: return True
        except OSError:
            pass
        time.sleep(1 + attempt)
    return False

def stage(repo):
    name = repo.split("/")[1]
    out = ROOT/name; out.mkdir(parents=True, exist_ok=True)
    meta = api(f"https://api.github.com/repos/{repo}")
    branch = meta["default_branch"]
    tree = api(f"https://api.github.com/repos/{repo}/git/trees/{branch}?recursive=1")
    sha = tree["sha"]
    files = [t for t in tree["tree"] if t["type"] == "blob"]
    staged, skipped, total = [], [], 0
    for t in files:
        p, size = t["path"], t.get("size", 0)
        ext = pathlib.Path(p).suffix.lower()
        if len(staged) >= MAX_FILES or total > MAX_BYTES or size > MAX_FILE or (ext and ext not in TEXT_EXT):
            skipped.append({"path": p, "size": size}); continue
        try:
            data = raw(repo, sha, p)
        except Exception:
            try:
                c = api(f"https://api.github.com/repos/{repo}/contents/{urllib.request.quote(p)}?ref={sha}")
                data = base64.b64decode(c["content"])
            except Exception as e:
                skipped.append({"path": p, "size": size, "error": str(e)[:80]}); continue
        if write_verified(out/p, data):
            staged.append({"path": p, "size": len(data), "sha256": hashlib.sha256(data).hexdigest()}); total += len(data)
        else:
            skipped.append({"path": p, "size": size, "error": "write-verify failed"})
    manifest = {"repo": repo, "commit": sha, "default_branch": branch,
                "tree_files": len(files), "staged": staged, "skipped": skipped}
    write_verified(out/"FETCH-MANIFEST.json", json.dumps(manifest, indent=1).encode())
    print(f"{repo}: tree={len(files)} staged={len(staged)} skipped={len(skipped)} bytes={total} sha={sha[:12]}", flush=True)

for repo in sys.argv[1:]:
    try: stage(repo)
    except Exception as e: print(f"{repo}: FAILED {type(e).__name__} {str(e)[:160]}", flush=True)
print("STAGE_ALL_DONE")
