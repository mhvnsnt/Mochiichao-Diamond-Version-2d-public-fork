#!/usr/bin/env python3
"""Validate the gap audit's claims against the LIVE repo (main branch).

Spot-check rule: every element marked "present" or "partial" in gap-audit.json
must have its cited evidence actually present in mhvnsnt/Mochiichao-Diamond-
Version-2d-fresh-start @ main right now. "missing" claims are absence claims —
they are checked where a single source decides them (bio_short vs species.json,
body_data vs cast.json) and otherwise reported as absence-claims (the audit
enumerates the sources searched).

Access: GitHub PAT connector, same pattern as the repo's own helpers
(/opt/muse/skills/custom-connector-setup/bin/dynamic_credentials.py,
provider custom.github-pat, host api.github.com). Read-only. Stdlib only.

Usage: python3 validate_gap_audit.py [--save]   (--save writes validate-output.txt)
Exit: 0 = every verifiable claim checks out; 1 = failures found.
"""
import base64, json, os, sys, urllib.request, urllib.parse

sys.path.insert(0, "/opt/muse/skills/custom-connector-setup/bin")
from dynamic_credentials import add_surrogate_to_request, read_response_body

REPO = "mhvnsnt/Mochiichao-Diamond-Version-2d-fresh-start"
HERE = os.path.dirname(os.path.abspath(__file__))

class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args):
        raise RuntimeError("redirect refused")

def get_json(url):
    req = urllib.request.Request(url, headers={
        "Accept": "application/vnd.github+json",
        "User-Agent": "muse-species-data-validator/1.0",
        "X-GitHub-Api-Version": "2022-11-28"})
    add_surrogate_to_request(req, "custom.github-pat", allowed_hosts=["api.github.com"])
    with urllib.request.build_opener(NoRedirect()).open(req, timeout=90) as r:
        return json.loads(read_response_body(r).decode())

def fetch_file(path):
    data = get_json("https://api.github.com/repos/%s/contents/%s" % (REPO, urllib.parse.quote(path)))
    if isinstance(data, list):
        return data
    return base64.b64decode(data["content"])

def fetch_json(path):
    return json.loads(fetch_file(path).decode())

def list_names(path):
    data = get_json("https://api.github.com/repos/%s/contents/%s" % (REPO, urllib.parse.quote(path)))
    return {d["name"] for d in data}

def main():
    audit = json.load(open(os.path.join(HERE, "gap-audit.json")))
    print("Fetching live sources from %s @ main ..." % REPO)
    species = {x["name"].lower(): x for x in fetch_json("src/data/core/species.json")["species"]}
    dex = fetch_json("src/lib/generated/dexEntryMedia-20261026.json")
    dex_by_folder = {v["folder"]: v for v in dex["entries"].values()}
    fp = fetch_json("sprite-art/animation/expanded-scope/footprints-real/FOOTPRINT-MANIFEST-51-20261026.json")
    sil = fetch_json("sprite-art/animation/expanded-scope/lane100/silhouettes/SILHOUETTE-MANIFEST.json")
    fp_files = list_names("sprite-art/animation/expanded-scope/footprints-real")
    sil_files = list_names("sprite-art/animation/expanded-scope/lane100/silhouettes")
    cry_files = list_names("public/audio/cries")
    cast = fetch_json("show/shared/cast.json")
    cast_ids = {m["id"] for m in cast["principal_cast"]}

    checks = passed = 0
    failures, absence = [], 0
    def check(ok, label):
        nonlocal checks, passed
        checks += 1
        if ok:
            passed += 1
        else:
            failures.append(label)

    for rec in audit["species"]:
        slug, el = rec["slug"], rec["elements"]
        for elem, claim in el.items():
            st = claim["status"]
            tag = f"{slug}.{elem}"
            if st == "present":
                if elem == "bio_short":
                    check(bool(species.get(slug, {}).get("dexText")), tag + " present but live species.json dexText empty/absent")
                elif elem == "footprint":
                    check(fp.get(slug, {}).get("status") == "FOOTPRINT" and f"{slug}_footprint.png" in fp_files,
                          tag + " present but live footprint manifest/file missing")
                elif elem == "silhouette":
                    check(slug in sil and f"{slug}_silhouette.png" in sil_files and slug in dex_by_folder,
                          tag + " present but live silhouette manifest/file/dex entry missing")
                elif elem == "cry":
                    check(f"{slug}-cry.wav" in cry_files, tag + " present but live cry file missing")
                elif elem == "type_description":
                    check(bool(species.get(slug, {}).get("types")), tag + " present but live species.json types empty/absent")
                else:
                    absence += 1
            elif st == "partial":
                if elem == "discovery":
                    check(slug in dex_by_folder, tag + " partial but no live dex-registry entry")
                elif elem == "body_data":
                    check(slug in cast_ids, tag + " partial but slug not in live show/shared/cast.json")
                elif elem == "type_description":
                    check(slug not in species and slug in dex_by_folder,
                          tag + " partial basis wrong (expected: absent from species.json, present in dex registry)")
                else:
                    absence += 1
            else:  # missing — absence claim; verify where one source decides it
                if elem == "bio_short":
                    check(not species.get(slug, {}).get("dexText"), tag + " claimed missing but live species.json HAS dexText")
                elif elem == "body_data":
                    check(slug not in cast_ids, tag + " claimed missing but slug IS in cast.json")
                else:
                    absence += 1

    lines = []
    lines.append(f"checks run: {checks} | passed: {passed} | failed: {len(failures)} | absence-claims not machine-verifiable: {absence}")
    if failures:
        lines.append("FAILURES:")
        lines += ["  - " + f for f in failures]
    else:
        lines.append("ALL VERIFIABLE CLAIMS IN gap-audit.json MATCH THE LIVE REPO.")
    out = "\n".join(lines)
    print(out)
    if "--save" in sys.argv:
        open(os.path.join(HERE, "validate-output.txt"), "w").write(out + "\n")
    return 0 if not failures else 1

if __name__ == "__main__":
    raise SystemExit(main())
