#!/usr/bin/env python3
"""Disc-to-repo docs batch for the Title Creatures lane (PUSH-THEN-CLEAN /
PUSH-AND-CLEAN / DISC-TO-REPO RULE — same rule, three aliases).
Uploads 88 ADDITIONS-ONLY files to branch
feature/title-creatures-docs-batch-20261027 via GitHub Contents/Refs API
(git push has no credentials in this VM). 0 deletions, 0 game-code
changes. No token printed. Docs only + builders + data + logs, all under
docs/title-creatures/. Held back (NOT in this batch, with reasons in the
PR body): species-name docs, True wiring note/diff, evidence images,
MI-GAN binary, muse-links records, upload/push scripts, blink file
(separate worker owns it)."""
import base64, glob, json, os, sys, urllib.request, urllib.error
sys.path.insert(0, "/opt/muse/skills/custom-connector-setup/bin")
from dynamic_credentials import add_surrogate_to_request
OWNER = "mhvnsnt"
REPO = "Mochiichao-Diamond-Version-2d-fresh-start"
BRANCH = "feature/title-creatures-docs-batch-20261027"
LANE = "/home/hatch/workspace/mochiichao-work/title-creatures-9"
DOCS = [
    "work/cries/title-creature-cry-spec-20261026.md",
    "work/cries/cry-method-60-40-20261026.md",
    "work/cries/cry-method-60-40-20261026-update1.md",
    "work/cries/cry-rebuild-distinct-20261026.md",
    "work/cries/cry-rebuild-r1-verification-20261026.md",
    "work/feather-audit-20261026.md",
    "work/feather-preview-20261026-notes.md",
    "work/kittember-bubbles/KITTEMBER-BUBBLES-20261026.md",
    "work/kittember-bubbles/KITTEMBER-GLOW-TEMPLATE-V2.md",
    "work/kittember-bubbles/KITTEMBER-ILLUMINATION-CYCLE-20261026.md",
    "work/mythar-white-removed-20261026-notes.md",
    "work/mythar-white-removed-v2-20261026-notes.md",
    "work/mythar-white-removed-v3-20261026-notes.md",
    "work/mythar-leg-fill-v5-20261026-notes.md",
    "work/mythar-pearlescent-gap-fill-v4-20261026-notes.md",
    "work/mythar-leg-tool-v6-20261026-notes.md",
    "work/yogiferno-white-speck-clean-20261026-notes.md",
    "work/yogiferno-white-speck-clean-v2-20261026-notes.md",
    "work/yogiferno-white-speck-clean-v3-20261026-notes.md",
    "work/show-100/final-locks-show-20261026.md",
    "work/true-elements-side-by-side-20261026.md",
    "work/true-elements-decisions-20261026.md",
]
BUILDERS = [
    "work/cries/synth-all-47-20261026.py",
    "work/cries/synth-dorowani-gabu-20261026.py",
    "work/cries/synth-neon-v2-20261026.py",
    "work/cries/synth-rebuild-r1-20261026.py",
    "work/feather-audit-20261026-script.py",
    "work/feather-preview-20261026.py",
    "work/kittember-bubbles/build_glow_v2.py",
    "work/mythar-leg-fill-v5-20261026.py",
    "work/mythar-leg-fill-v5-show-20261026.py",
    "work/mythar-pearlescent-gap-fill-v4-20261026.py",
    "work/mythar-leg-tool-v6-20261026.py",
    "work/mythar-leg-tool-v6-show-20261026.py",
    "work/seg-test/razorgater_test.py",
    "work/seg-test/rembg_test.py",
    "clean_cutouts.py",
    "clean_cutouts_scripted.py",
    "fix_white_spots.py",
    "apply_patch.py",
]
DATA = [
    "work/feather-audit-20261026-results.json",
    "work/feather-preview-20261026.json",
    "work/mythar-white-removed-v3-20261026.json",
    "work/mythar-leg-fill-v5-20261026.json",
    "work/mythar-pearlescent-gap-fill-v4-20261026.json",
    "work/mythar-leg-tool-v6-20261026.json",
    "work/yogiferno-white-speck-clean-20261026.json",
    "work/yogiferno-white-speck-clean-v2-20261026.json",
    "work/yogiferno-white-speck-clean-v3-20261026.json",
    "work/kittember-bubbles/glow-v2-verification.json",
]
LOGS = sorted(
    [p for p in glob.glob(LANE + "/work/**/*.log", recursive=True)
     + glob.glob(LANE + "/work/**/*.txt", recursive=True)
     if "muse-links" not in p]
    + [LANE + "/yogiferno-feather-gates.log",
       LANE + "/yogiferno-feather-merge.log"]
)

class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args):
        raise RuntimeError("redirect refused")

def call(method, path, payload=None):
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request("https://api.github.com" + path, data=data, method=method)
    req.add_header("Accept", "application/vnd.github+json")
    req.add_header("X-GitHub-Api-Version", "2022-11-28")
    req.add_header("User-Agent", "Muse-GitHub-Api")
    if data:
        req.add_header("Content-Type", "application/json")
    add_surrogate_to_request(req, "custom.github-api", allowed_hosts=["api.github.com"])
    try:
        with urllib.request.build_opener(NoRedirect()).open(req, timeout=180) as resp:
            body = resp.read().decode()
            return resp.status, json.loads(body) if body else {}
    except urllib.error.HTTPError as e:
        return e.code, {"error": e.read().decode()[:300]}

def main():
    mapping = []
    for src in DOCS:
        mapping.append((src, "docs/title-creatures/" + os.path.basename(src)))
    for src in BUILDERS:
        mapping.append((src, "docs/title-creatures/builders/" + os.path.basename(src)))
    for src in DATA:
        mapping.append((src, "docs/title-creatures/data/" + os.path.basename(src)))
    for abspath in LOGS:
        mapping.append((os.path.relpath(abspath, LANE),
                        "docs/title-creatures/logs/" + os.path.basename(abspath)))
    dests = [d for _, d in mapping]
    assert len(dests) == len(set(dests)), "DEST BASENAME COLLISION"
    for src, _ in mapping:
        p = os.path.join(LANE, src)
        assert os.path.isfile(p), f"MISSING SOURCE: {p}"
    total = sum(os.path.getsize(os.path.join(LANE, s)) for s, _ in mapping)
    print(f"files: {len(mapping)} (docs {len(DOCS)}, builders {len(BUILDERS)}, "
          f"data {len(DATA)}, logs {len(LOGS)}), total bytes: {total}", flush=True)
    status, main = call("GET", f"/repos/{OWNER}/{REPO}/branches/main")
    live = main["commit"]["sha"]
    print(f"live main: {live}", flush=True)
    status, ref = call("POST", f"/repos/{OWNER}/{REPO}/git/refs",
                        {"ref": f"refs/heads/{BRANCH}", "sha": live})
    if status == 422:
        status, ref = call("GET", f"/repos/{OWNER}/{REPO}/git/ref/heads/{BRANCH}")
        if status != 200 or ref["object"]["sha"] != live:
            print(f"ABORT: branch exists at unexpected state: {status} {ref}", flush=True)
            sys.exit(2)
        print("branch already exists at live main, proceeding", flush=True)
    elif status not in (200, 201):
        print(f"FAIL creating branch: HTTP {status} {ref}", flush=True)
        sys.exit(3)
    print(f"branch {BRANCH} -> {live}", flush=True)
    for src, dest in mapping:
        data = base64.b64encode(open(os.path.join(LANE, src), "rb").read()).decode()
        status, up = call("PUT", f"/repos/{OWNER}/{REPO}/contents/{dest}",
                          {"message": f"Title Creatures lane docs batch: add {dest} (additions only, 0 deletions)",
                           "content": data, "branch": BRANCH})
        blob = up.get("content", {}).get("sha")
        print(f"{dest}: HTTP {status} blob={blob}", flush=True)
        if status not in (200, 201) or not blob:
            print(f"FAIL upload {dest}: {up}", flush=True)
            sys.exit(4)
    print("UPLOAD OK — all files on branch", flush=True)

if __name__ == "__main__":
    main()
