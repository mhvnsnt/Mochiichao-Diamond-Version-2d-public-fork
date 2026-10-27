#!/usr/bin/env python3
"""Upload BiRefNet 20261026-v1 title cutout DRAFTS to a new branch + open PR.
Additions only, 0 deletions, NO wiring changes: the 7 new dated PNGs land
in src/assets/title/ as options/drafts ONLY, unconfirmed, NOT imported by
TitleCreatureFigure.tsx or YogifernoTitleWalk.tsx. Mars confirms each
cutout individually before any wiring.
Files are read from title-biref-20261026/final/ (BiRefNet-general, MIT).
Base = latest main at upload time (re-verified here, not assumed).
Branch: feature/title-creatures-birefnet-20261026-1
No token printed. Contents API only; dirty work clone never used.
"""
import base64, hashlib, json, os, sys
from urllib.parse import quote
sys.path.insert(0, "/opt/muse/skills/custom-connector-setup/bin")
from dynamic_credentials import add_surrogate_to_request
import urllib.request, urllib.error

OWNER = "mhvnsnt"
REPO = "Mochiichao-Diamond-Version-2d-fresh-start"
BRANCH = "feature/title-creatures-birefnet-20261026-1"
BASE_DIR = "/home/hatch/workspace/mochiichao-work/title-biref-20261026/final"
NAMES = ["wispkin", "tyrage", "kittember", "sproutle", "dorowani", "gabu", "mythar"]

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
        body = e.read().decode()
        print(f"HTTP {e.code} {method} {path}: {body[:800]}", flush=True)
        raise

def main():
    files = []
    for name in NAMES:
        fn = f"{name}-title-cutout-20261026-v1.png"
        p = os.path.join(BASE_DIR, fn)
        if not os.path.exists(p):
            print(f"ABORT: missing final {p}")
            return 2
        files.append((f"src/assets/title/{fn}", p))
    status, main = call("GET", f"/repos/{OWNER}/{REPO}/branches/main")
    main_sha = main["commit"]["sha"]
    print("main sha at branch time:", main_sha, flush=True)
    try:
        status, ref = call("GET", f"/repos/{OWNER}/{REPO}/git/refs/heads/{BRANCH}")
        print("ABORT: branch already exists:", ref.get("ref"), flush=True)
        return 2
    except SystemExit:
        raise
    except Exception:
        pass
    status, ref = call("POST", f"/repos/{OWNER}/{REPO}/git/refs", {"ref": f"refs/heads/{BRANCH}", "sha": main_sha})
    print("branch created:", ref.get("ref"), flush=True)
    for i, (dest, src) in enumerate(files, 1):
        with open(src, "rb") as f:
            raw = f.read()
        content = base64.b64encode(raw).decode()
        blob_sha = hashlib.sha1(b"blob %d\0" % len(raw) + raw).hexdigest()
        enc = "/".join(quote(part) for part in dest.split("/"))
        sha = None
        try:
            status, existing = call("GET", f"/repos/{OWNER}/{REPO}/contents/{enc}?ref={BRANCH}")
            sha = existing.get("sha")
        except Exception:
            sha = None
        if sha == blob_sha:
            print(f"{i}/{len(files)} skipped (identical on branch): {dest}", flush=True)
            continue
        payload = {"message": f"Title cutout DRAFT (BiRefNet): {os.path.basename(dest)}\n\nDRAFT ONLY - unconfirmed, NOT wired into title rotation.\nDeletions: NONE", "content": content, "branch": BRANCH}
        if sha:
            payload["sha"] = sha
        call("PUT", f"/repos/{OWNER}/{REPO}/contents/{enc}", payload)
        print(f"{i}/{len(files)} uploaded: {dest} ({len(raw)} bytes)", flush=True)
    body = (
        "## Title cutout DRAFTS — BiRefNet 20261026-v1 (7 files, additions only)\n\n"
        "DRAFTS ONLY — none of these files is wired into the title rotation. "
        "TitleCreatureFigure.tsx and YogifernoTitleWalk.tsx are UNCHANGED in this PR. "
        "Mars confirms each cutout individually before any wiring worker swaps it in.\n\n"
        "Method (per task): each cutout is ONE figure cropped from that creature's own "
        "Mochiichao 2D sheet in sprite-art/2d-sheets/ (Wispkin V1 sheet only; Duskfiend "
        "and Tiidebiite are NOT in the pool), background removed with rembg + "
        "BiRefNet-general (MIT), then auto edge cleanup only (corner-background "
        "decontamination + 1px alpha feather + trim to alpha bbox). No BRIA/RMBG-2.0, "
        "no hand-painted pixels, no generated likeness, no Pokemon commercial art.\n\n"
        "Files (all NEW dated names, nothing overwritten):\n"
        "- wispkin-title-cutout-20261026-v1.png — skull-face ghost, black drop body, wisp smoke (design, not a shadow)\n"
        "- tyrage-title-cutout-20261026-v1.png — front, ground cracks from the sheet remain\n"
        "- kittember-title-cutout-20261026-v1.png — front, ember tail orb\n"
        "- sproutle-title-cutout-20261026-v1.png — front, goggles + shell\n"
        "- dorowani-title-cutout-20261026-v1.png — front, tall head fin\n"
        "- gabu-title-cutout-20261026-v1.png — front, spiky crown\n"
        "- mythar-title-cutout-20261026-v1.png — front, stained-glass wings + halo ring (design, not a shadow)\n\n"
        "NOT in this PR: Razorgater — already Mars-approved and merged (PR #95, "
        "razorgater-walk-cutout.png 265x266 on main), so it is NOT re-cut here. "
        "Confirmed Mochii v1 / Yogiferno v2 dated files are also NOT in this PR; "
        "their import-swap wiring is a separate step (Yogiferno v2 differs from main's "
        "v1 and still needs its swap re-applied to latest main).\n\n"
        "Gate (before merge): build PASS, lint PASS, validate:reference PASS if present, "
        "mergeable + CLEAN after settle, 0 file deletions, manual secret check, no force-push.\n"
    )
    status, pr = call("POST", f"/repos/{OWNER}/{REPO}/pulls", {
        "title": "Title cutout DRAFTS (BiRefNet 20261026-v1): 7 creatures, unwired",
        "head": BRANCH, "base": "main", "body": body,
    })
    print("PR:", pr.get("html_url"), "number:", pr.get("number"), flush=True)
    print(json.dumps({"branch": BRANCH, "base": main_sha, "pr": pr.get("html_url"), "number": pr.get("number")}, indent=2))
    return 0

if __name__ == "__main__":
    sys.exit(main())
