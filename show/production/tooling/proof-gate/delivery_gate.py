#!/usr/bin/env python3
"""Pre-delivery gate for the Mochiichao show pipeline.

Owner's order (2026-10-28): "wire up everything you need to
achieve that every turn every time" — first-time-right, measured
before delivery, judgment stated first, wrong stated by the
agent before the owner has to find it. The rules of record are
show/production/WORKING-RULES.md; this script is their machine
enforcement. NO GATE RECORD, NO DELIVERY: a deliverable goes to
the owner only with a passing gate record written beside it.

This gate does not re-measure what the existing checker already
measures. For video it reads (or runs) verify_proof.py — the
proof-gate checker beside this script, whose CLI is:

    verify_proof.py <clip.mp4> [--json-out result.json]
                    [--register scene|credits] [--likeness ...]

verify_proof.py MEASURES and always exits 0; the verdict lives
here. Likeness remains verify_proof.py's --likeness mode + the
run records in likeness-runs.json (a JSON array); this gate
checks that a COMPLETE likeness run record exists for the
deliverable — it never duplicates the measurement.

INPUT — a delivery manifest JSON:

    {
      "deliverable": "walk-retimed.mp4",   // path (relative to
                                           // the manifest file)
      "sha256": "<hex>",                   // of the deliverable
      "kind": "video" | "image-set" | "image" | "doc",
      "register": "scene" | "credits",     // video: required
      "character_work": true | false,
      "claims_file": "claims.md",          // first section MUST
                                           // be the self-judgment
      "timing_record": "verify-out.json",  // video, optional:
                                           // verify_proof.py
                                           // --json-out output;
                                           // if absent the gate
                                           // runs the checker
      "likeness_runs": "likeness-runs.json", // character video:
                                           // a record with
                                           // clip_sha256 == the
                                           // deliverable sha256
                                           // and record_status
                                           // COMPLETE is required
      "likeness": {                        // character image /
                        // image-set: verified against files
        "reference": "canon.png",
        "reference_sha256": "<hex>",
        "comparison_sheet": "comparison.png"
      },
      "members": [{"path": "...", "sha256": "..."}],  // image-set:
                                           // EVERY member; the
                                           // gate hashes them all
      "audit": [{"id": 0, "result": "pass" | "fail" | "na",
                 "note": "what was inspected"}],       // character
                                           // work: every item of
                                           // audit-checklist.json
    }

CHECKS (any failure = gate FAIL, exit 1):
  * the deliverable exists and its sha256 matches the manifest;
    for image-set, every listed member exists and matches.
  * the claims file's first section is the self-judgment (a
    heading containing "judgment"; a lone document title may
    precede it; a measurements section, if present, must come
    after), and the judgment has a real body, not a token line.
  * video: a timing record exists (supplied, integrity-checked
    against the deliverable's sha256, or produced by running
    verify_proof.py) and the measured new drawings per second
    is NOT in the failed class for the declared register:
    at or below ~3/sec fails; an interpolation signature
    (verify_proof.py's below-bar flag) fails; below the
    register floor (scene 12/sec, credits 8/sec) fails.
  * character work: every audit-checklist item is marked
    pass/fail/na with an inspecting note; every item marked
    fail is NAMED in the self-judgment text (by the item's
    name from the checklist, or by "item N"). A fail the
    judgment does not name fails the gate: the gate enforces
    honesty, not perfection — a named failure ships with its
    judgment stated; an unnamed one does not ship.
  * character work: a likeness run reference exists and is
    COMPLETE (video: a matching record in likeness-runs.json;
    image kinds: the reference file hashes to the manifest's
    reference_sha256 and the comparison sheet exists).

OUTPUT: a gate record JSON — default <deliverable>.gate.json
beside the deliverable (--out to override) — carrying every
check's result and the violations list. Exit 0 = pass,
1 = fail (violations printed), 2 = the gate itself could not
run (bad manifest, missing checker).

Self-test: delivery_gate_selftest.py beside this script builds
a synthetic passing delivery and a synthetic failing one
(unmarked audit item) and runs this gate on both.
"""
import hashlib, json, re, subprocess, sys, tempfile
from datetime import datetime
from pathlib import Path

REGISTER_FLOORS = {"scene": 12.0, "credits": 8.0}  # verify_proof.py's floors
FAILED_CLASS_RATE = 3.0  # at or below ~3 new drawings/sec = FAILED class
GATE_VERSION = "delivery_gate.py v1 (2026-10-28)"


def sha256_of(path):
    h = hashlib.sha256()
    with open(path, "rb") as fh:
        for chunk in iter(lambda: fh.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def parse_claims(text):
    """Split a claims file into (heading, body) sections.

    Returns (sections, judgment_index, measurement_index,
    judgment_body). A section starts at a markdown heading
    line; text before the first heading is section None.
    """
    sections = []  # (heading_text_or_None, body_text)
    heading, body = None, []
    for line in text.splitlines():
        m = re.match(r"^#{1,6}\s+(.*)$", line)
        if m:
            sections.append((heading, "\n".join(body)))
            heading, body = m.group(1).strip(), []
        else:
            body.append(line)
    sections.append((heading, "\n".join(body)))
    # Drop a leading None section if it is only blank lines.
    if sections and sections[0][0] is None and not sections[0][1].strip():
        sections = sections[1:]
    j_idx = m_idx = None
    for i, (h, _) in enumerate(sections):
        if h is None:
            continue
        low = h.lower()
        if j_idx is None and "judgment" in low or (j_idx is None and "judgement" in low):
            j_idx = i
        if m_idx is None and ("measur" in low or "timing record" in low):
            m_idx = i
    j_body = sections[j_idx][1] if j_idx is not None else ""
    return sections, j_idx, m_idx, j_body


def main(argv):
    if len(argv) < 2:
        print(__doc__)
        return 2
    manifest_path = Path(argv[1]).resolve()
    out_path = None
    checklist_path = Path(__file__).with_name("audit-checklist.json")
    checker_path = Path(__file__).with_name("verify_proof.py")
    i = 2
    while i < len(argv):
        if argv[i] == "--out":
            out_path = Path(argv[i + 1]); i += 2
        elif argv[i] == "--checklist":
            checklist_path = Path(argv[i + 1]); i += 2
        elif argv[i] == "--verify-proof":
            checker_path = Path(argv[i + 1]); i += 2
        else:
            print(f"unknown argument: {argv[i]}", file=sys.stderr)
            return 2
    if not manifest_path.exists():
        print(f"no such manifest: {manifest_path}", file=sys.stderr)
        return 2
    try:
        manifest = json.loads(manifest_path.read_text())
    except Exception as e:
        print(f"manifest is not valid JSON: {e}", file=sys.stderr)
        return 2
    base = manifest_path.parent

    def resolve(p):
        p = Path(p)
        return p if p.is_absolute() else (base / p)

    checks = []
    violations = []

    def check(name, ok, detail):
        checks.append({"check": name, "ok": bool(ok), "detail": detail})
        if not ok:
            violations.append(f"{name}: {detail}")

    kind = manifest.get("kind")
    check("manifest-kind", kind in ("video", "image-set", "image", "doc"),
          f"kind is {kind!r}; must be video, image-set, image or doc")

    # --- the artifact itself: existence + sha256 ---------------
    deliverable = resolve(manifest.get("deliverable", ""))
    d_sha = None
    if not manifest.get("deliverable") or not deliverable.exists():
        check("artifact-exists", False, f"deliverable not found: {deliverable}")
    else:
        check("artifact-exists", True, str(deliverable))
        d_sha = sha256_of(deliverable)
        check("artifact-sha256", d_sha == manifest.get("sha256"),
              f"manifest sha256 {manifest.get('sha256')!r} vs measured {d_sha}")
    if kind == "image-set":
        members = manifest.get("members") or []
        check("image-set-members-listed", len(members) > 0,
              f"{len(members)} member(s) listed; a set delivery must list every member")
        for m in members:
            mp = resolve(m.get("path", ""))
            if not mp.exists():
                check("image-set-member", False, f"member not found: {mp}")
            else:
                ms = sha256_of(mp)
                check("image-set-member", ms == m.get("sha256"),
                      f"{mp.name}: manifest {m.get('sha256')!r} vs measured {ms}")

    # --- the claims file: judgment first ------------------------
    judgment_text = ""
    claims_rel = manifest.get("claims_file")
    if not claims_rel:
        check("claims-file", False, "manifest names no claims_file")
    else:
        claims_path = resolve(claims_rel)
        if not claims_path.exists():
            check("claims-file", False, f"claims file not found: {claims_path}")
        else:
            sections, j_idx, m_idx, j_body = parse_claims(
                claims_path.read_text(errors="replace"))
            judgment_text = j_body
            if j_idx is None:
                check("self-judgment-first", False,
                      "no section heading contains 'judgment' — the claims "
                      "file must open with the self-judgment")
            else:
                before = sections[:j_idx]
                # A lone title heading (level-1, first line block) may
                # precede; any other section before the judgment fails.
                extra = [h for (h, b) in before
                         if h is not None or b.strip()]
                title_only = (len(before) == 1 and before[0][0] is not None
                              and not before[0][1].strip())
                check("self-judgment-first",
                      j_idx == 0 or title_only,
                      f"self-judgment is section {j_idx}; sections before it: "
                      f"{[h for h, _ in before]!r}")
                if m_idx is not None:
                    check("judgment-before-measurements", j_idx < m_idx,
                          f"judgment section {j_idx}, measurements section {m_idx}")
                check("self-judgment-body", len(j_body.strip()) >= 20,
                      f"self-judgment body is {len(j_body.strip())} chars; "
                      "a real judgment statement is required, not a token line")

    # --- video: timing record + failed-class rule ---------------
    if kind == "video":
        register = manifest.get("register")
        check("register-declared", register in REGISTER_FLOORS,
              f"register is {register!r}; must be scene or credits")
        timing = None
        tr_rel = manifest.get("timing_record")
        if tr_rel:
            tr_path = resolve(tr_rel)
            if not tr_path.exists():
                check("timing-record", False, f"timing record not found: {tr_path}")
            else:
                try:
                    timing = json.loads(tr_path.read_text())
                except Exception as e:
                    check("timing-record", False, f"timing record unreadable: {e}")
        if timing is None and not tr_rel and deliverable.exists():
            if not checker_path.exists():
                check("timing-record", False,
                      f"no timing record supplied and checker not found: {checker_path}")
            else:
                tmp = tempfile.NamedTemporaryFile(
                    mode="w", suffix=".json", dir=str(deliverable.parent),
                    delete=False)
                tmp.close()
                try:
                    proc = subprocess.run(
                        [sys.executable, str(checker_path), str(deliverable),
                         "--json-out", tmp.name,
                         "--register", register or "scene"],
                        capture_output=True, text=True)
                    if proc.returncode != 0:
                        check("timing-record", False,
                              f"verify_proof.py failed: {proc.stderr.strip()[-400:]}")
                    else:
                        timing = json.loads(Path(tmp.name).read_text())
                except Exception as e:
                    check("timing-record", False, f"running the checker failed: {e}")
                finally:
                    Path(tmp.name).unlink(missing_ok=True)
        if timing is not None:
            check("timing-record-integrity", timing.get("sha256") == d_sha,
                  "timing record's clip sha256 "
                  f"{timing.get('sha256')!r} vs deliverable {d_sha!r} — the "
                  "record must measure THIS file")
            profile = timing.get("timing_profile") or {}
            headline = profile.get("headline") or {}
            rate = headline.get("effective_new_drawings_per_second")
            hclass = headline.get("class") or ""
            interp = bool((profile.get("below_bar_signatures") or {})
                          .get("interpolation_profile"))
            check("timing-rate-measured", rate is not None,
                  f"effective new drawings/sec: {rate}")
            if rate is not None:
                check("timing-not-failed-class",
                      rate > FAILED_CLASS_RATE and "FAILED class" not in hclass,
                      f"{rate} new drawings/sec — headline class: {hclass}")
                check("timing-no-interpolation-signature", not interp,
                      "verify_proof.py below-bar signature "
                      f"interpolation_profile={interp} (interpolation noise "
                      "is the FAILED class, not authored drawings)")
                floor = REGISTER_FLOORS.get(register)
                if floor is not None:
                    check("timing-at-register-floor", rate >= floor,
                          f"{rate} new drawings/sec vs the {register} floor "
                          f"of {floor}/sec")

    # --- character work: the 20-point audit + likeness ----------
    if manifest.get("character_work"):
        try:
            checklist = json.loads(checklist_path.read_text())
            items = {it["id"]: it for it in checklist["items"]}
        except Exception as e:
            items = {}
            check("audit-checklist-readable", False,
                  f"cannot read checklist {checklist_path}: {e}")
        if items:
            marked = {}
            for entry in manifest.get("audit") or []:
                marked[entry.get("id")] = entry
            for iid, item in sorted(items.items()):
                entry = marked.get(iid)
                if entry is None:
                    check("audit-marked", False,
                          f"audit item {iid} ({item['name']}) is UNMARKED")
                    continue
                res = entry.get("result")
                note = (entry.get("note") or "").strip()
                if res not in ("pass", "fail", "na"):
                    check("audit-marked", False,
                          f"audit item {iid} ({item['name']}) has result "
                          f"{res!r}; must be pass, fail or na")
                elif not note:
                    check("audit-marked", False,
                          f"audit item {iid} ({item['name']}) has no "
                          "inspecting note — a mark without the looking "
                          "is not an audit")
                elif res == "fail":
                    named = (item["name"].lower() in judgment_text.lower()
                             or re.search(r"item\s*#?\s*%d\b" % iid,
                                          judgment_text, re.IGNORECASE))
                    check("audit-fail-named-in-judgment", bool(named),
                          f"audit item {iid} ({item['name']}) is marked FAIL "
                          "but the self-judgment does not name it — an "
                          "unnamed failure does not ship")
        # likeness run reference
        if kind == "video":
            runs_rel = manifest.get("likeness_runs")
            found = None
            if runs_rel:
                runs_path = resolve(runs_rel)
                if runs_path.exists():
                    try:
                        runs = json.loads(runs_path.read_text())
                        for rec in runs if isinstance(runs, list) else []:
                            if rec.get("clip_sha256") == d_sha:
                                found = rec
                    except Exception:
                        found = None
            ok = bool(found) and found.get("record_status") == "COMPLETE"
            detail = ("COMPLETE likeness run record for this clip sha256"
                      if ok else
                      "no COMPLETE likeness-runs record whose clip_sha256 "
                      "matches this deliverable (record_status must be "
                      "COMPLETE — a run without a comparison sheet is "
                      "INCOMPLETE and does not satisfy the delivery "
                      "requirement)")
            check("likeness-run-complete", ok, detail)
        elif kind in ("image", "image-set"):
            lik = manifest.get("likeness") or {}
            ref_rel = lik.get("reference")
            sheet_rel = lik.get("comparison_sheet")
            if not ref_rel:
                check("likeness-reference", False,
                      "character image work requires a likeness block "
                      "(canon reference + comparison sheet)")
            else:
                ref_path = resolve(ref_rel)
                if not ref_path.exists():
                    check("likeness-reference", False,
                          f"canon reference not found: {ref_path}")
                else:
                    rs = sha256_of(ref_path)
                    check("likeness-reference", rs == lik.get("reference_sha256"),
                          f"reference sha256 manifest {lik.get('reference_sha256')!r} "
                          f"vs measured {rs}")
                if not sheet_rel or not resolve(sheet_rel).exists():
                    check("likeness-comparison-sheet", False,
                          "comparison sheet missing — the sheet must sit "
                          "beside the delivery (reference beside the work)")

    verdict = "pass" if not violations else "fail"
    record = {
        "gate": GATE_VERSION,
        "recorded_at": datetime.now().astimezone().isoformat(timespec="seconds"),
        "manifest": str(manifest_path),
        "deliverable": str(deliverable),
        "kind": kind,
        "register": manifest.get("register"),
        "character_work": bool(manifest.get("character_work")),
        "deliverable_sha256_measured": d_sha,
        "checks": checks,
        "violations": violations,
        "verdict": verdict,
        "note": "A passing gate means the delivery CARRIES what the working "
                "rules require: the artifact checked itself, its measurement, "
                "its judgment stated first, its audit complete and honest. "
                "The grade of the work itself remains the owner's eye "
                "(grading law) — the gate never promotes anything.",
    }
    if out_path is None:
        out_path = Path(str(deliverable) + ".gate.json")
    out_path = out_path if out_path.is_absolute() else (base / out_path)
    out_path.write_text(json.dumps(record, indent=2) + "\n")
    print(f"GATE {verdict.upper()}: {deliverable} "
          f"({len(checks)} checks, {len(violations)} violation(s)) "
          f"-> {out_path}")
    for v in violations:
        print(f"  VIOLATION: {v}")
    return 0 if verdict == "pass" else 1


if __name__ == "__main__":
    sys.exit(main(sys.argv))
