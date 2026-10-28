#!/usr/bin/env python3
"""06-comfyui-pipeline-runner.py - headless ComfyUI job runner.

Patterns adopted from lilinsong1/comfyui-wan-video-pipeline (README claims
MIT but the repo ships NO LICENSE file - verified 2026-10-28 - so NO code
was copied; this is an original stdlib implementation of the same public
ComfyUI HTTP contract that repo uses):

  * submit_workflow.js : POST /prompt -> prompt_id, poll GET
    /history/{prompt_id}, collect output filenames from history outputs.
  * auto_pipeline.py   : a pipeline_status.json on disk, updated per step,
    so a crashed run resumes by reading state instead of restarting.
  * download step      : theirs downloads over SSH with a password in the
    script (do NOT copy that); ours uses ComfyUI's own GET /view endpoint.

Fit with our lane: this is the job-control half that generate_bundle.py
(step 3 of the avatar stack) assumes - a workflow JSON goes in, finished
clips come out, and the runner writes a run-report.json whose file entries
are MEASURED (bytes + sha256 on disk), the same honesty rule
generate_bundle.py applies to its manifest. Feed the downloaded clip to
generate_bundle.py unchanged.

Placeholders: workflow values written as "{{prompt}}", "{{seed}}",
"{{filename_prefix}}", "{{image}}" (any string, anywhere in the JSON) are
substituted from --set key=value pairs before submission.

Usage:
  06-comfyui-pipeline-runner.py WORKFLOW.json --out-dir DIR
      [--server http://127.0.0.1:8188] [--set prompt="..." seed=42 ...]
      [--poll-s 10] [--timeout-s 3600] [--retries 2] [--dry-run]

--dry-run validates + substitutes and writes the resolved workflow and a
run-report with status DRY_RUN; it contacts no server. Stdlib only.
"""
import argparse, hashlib, json, os, sys, time, urllib.request, urllib.error, uuid

STATUS_FILE = "pipeline_status.json"
REPORT_FILE = "run-report.json"


def sha256_of(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def substitute(node, values, missing):
    if isinstance(node, dict):
        return {k: substitute(v, values, missing) for k, v in node.items()}
    if isinstance(node, list):
        return [substitute(v, values, missing) for v in node]
    if isinstance(node, str) and node.startswith("{{") and node.endswith("}}"):
        key = node[2:-2].strip()
        if key in values:
            v = values[key]
            return int(v) if v.lstrip("-").isdigit() else v
        missing.append(key)
        return node
    return node


def http_json(url, payload=None, timeout=30):
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request(url, data=data,
                                 headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode())


def http_bytes(url, timeout=120):
    with urllib.request.urlopen(url, timeout=timeout) as r:
        return r.read()


def write_status(out_dir, status):
    status["last_update"] = time.strftime("%Y-%m-%dT%H:%M:%S")
    with open(os.path.join(out_dir, STATUS_FILE), "w", encoding="utf-8") as f:
        json.dump(status, f, indent=2)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("workflow")
    ap.add_argument("--out-dir", required=True)
    ap.add_argument("--server", default="http://127.0.0.1:8188")
    ap.add_argument("--set", action="append", default=[], metavar="KEY=VALUE")
    ap.add_argument("--poll-s", type=float, default=10)
    ap.add_argument("--timeout-s", type=float, default=3600)
    ap.add_argument("--retries", type=int, default=2)
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()

    values = {}
    for item in a.set:
        k, _, v = item.partition("=")
        values[k.strip()] = v
    with open(a.workflow, encoding="utf-8") as f:
        workflow = json.load(f)
    missing = []
    resolved = substitute(workflow, values, missing)
    if missing:
        sys.exit(f"unresolved placeholders: {sorted(set(missing))}")

    os.makedirs(a.out_dir, exist_ok=True)
    status = {"current_step": "init", "steps": {"submitted": False,
              "completed": False, "downloaded": False}, "prompt_id": None}
    write_status(a.out_dir, status)
    resolved_path = os.path.join(a.out_dir, "resolved_workflow.json")
    with open(resolved_path, "w", encoding="utf-8") as f:
        json.dump(resolved, f, indent=2)

    if a.dry_run:
        report = {"schema": "mochiichao-show/comfyui-run-report/v1",
                  "status": "DRY_RUN", "server": a.server,
                  "resolved_workflow": resolved_path, "outputs": []}
        with open(os.path.join(a.out_dir, REPORT_FILE), "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2)
        print("dry run ok:", resolved_path)
        return

    server = a.server.rstrip("/")
    prompt_id, last_err = None, None
    for attempt in range(a.retries + 1):
        try:
            resp = http_json(server + "/prompt",
                             {"prompt": resolved, "client_id": str(uuid.uuid4())})
            prompt_id = resp["prompt_id"]
            break
        except Exception as e:  # retry submit only; generation errors are not retried blindly
            last_err = e
            time.sleep(5 * (attempt + 1))
    if not prompt_id:
        sys.exit(f"submit failed after {a.retries + 1} attempts: {last_err}")
    status.update({"current_step": "submitted", "prompt_id": prompt_id})
    status["steps"]["submitted"] = True
    write_status(a.out_dir, status)
    print("prompt_id:", prompt_id)

    deadline = time.time() + a.timeout_s
    entry = None
    while time.time() < deadline:
        hist = http_json(f"{server}/history/{prompt_id}")
        if prompt_id in hist:
            entry = hist[prompt_id]
            st = entry.get("status", {})
            if st.get("completed") or st.get("status_str") == "success":
                break
            if st.get("status_str") == "error":
                sys.exit(f"generation error: {json.dumps(st)[:500]}")
        time.sleep(a.poll_s)
    if entry is None:
        sys.exit(f"timeout after {a.timeout_s}s waiting for {prompt_id}")
    status.update({"current_step": "completed"})
    status["steps"]["completed"] = True
    write_status(a.out_dir, status)

    outputs = []
    for node_out in entry.get("outputs", {}).values():
        for kind in ("videos", "gifs", "images"):
            for item in node_out.get(kind, []):
                name = item.get("filename")
                if not name:
                    continue
                q = urllib.request.quote(name)
                sub = urllib.request.quote(item.get("subfolder", ""))
                typ = urllib.request.quote(item.get("type", "output"))
                blob = http_bytes(f"{server}/view?filename={q}&subfolder={sub}&type={typ}")
                dst = os.path.join(a.out_dir, name)
                with open(dst, "wb") as f:
                    f.write(blob)
                outputs.append({"file": dst, "kind": kind,
                                "bytes": os.path.getsize(dst),
                                "sha256": sha256_of(dst)})
    status.update({"current_step": "downloaded"})
    status["steps"]["downloaded"] = True
    write_status(a.out_dir, status)
    report = {"schema": "mochiichao-show/comfyui-run-report/v1",
              "status": "COMPLETED", "server": server, "prompt_id": prompt_id,
              "resolved_workflow": resolved_path, "outputs": outputs,
              "next_step": "generate_bundle.py --source-clip <output> (avatar-stack packaging)"}
    with open(os.path.join(a.out_dir, REPORT_FILE), "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)
    print(f"done: {len(outputs)} outputs -> {a.out_dir}")


if __name__ == "__main__":
    main()
