#!/usr/bin/env python3
"""Pre-flight validation of a ComfyUI API-format workflow against the
EXACT node definitions of the installed server (its /object_info).

Why this exists: VACE attempt 2 (2026-10-28) burned a full Kaggle run
because the workflow template failed ComfyUI validation and generation
never started — the kernel died on the HTTP 400 and Kaggle still
labelled the run "successful". This validator refuses to let a GPU run
start on a graph that the installed nodes would reject.

Checks (mirroring ComfyUI's own validation failures):
  0. the parsed workflow is normalised first (normalize_workflow):
     non-dict top-level entries are documentation/metadata (e.g.
     "_comment"), never nodes — they are split out at parse time so
     neither validation nor the /prompt POST can trip over them;
  1. every node's class_type exists in object_info;
  2. every REQUIRED input of every node is present in the graph
     ("Required input is missing: <name>");
  3. every linked input's source output type is compatible with the
     input's declared type (IMAGE fed into a MASK input is an error —
     the exact attempt-2 WanVaceToVideo control_masks failure).

Usage:
  validate_workflow.py WORKFLOW.json OBJECT_INFO.json
  validate_workflow.py WORKFLOW.json --url http://127.0.0.1:8188
Exit code 0 + "VALIDATION_PASS" when clean; exit 1 listing every defect.
"""
import json, sys, urllib.request


def load_object_info(arg):
    if arg.startswith("http://") or arg.startswith("https://"):
        with urllib.request.urlopen(arg.rstrip("/") + "/object_info", timeout=60) as r:
            return json.loads(r.read())
    with open(arg) as f:
        return json.load(f)


def normalize_workflow(wf):
    """Split a parsed workflow into (nodes, metadata) at parse time.

    A workflow file is a graph of node objects, but authors also park
    documentation at the top level — e.g. "_comment": "..." (a plain
    string) in workflows/tooncrafter_inbetween_api.json. A non-dict
    top-level entry is metadata, not a node: it must never reach
    validate() or the /prompt POST, both of which treat every entry as
    a node. The 2026-10-28 ToonCrafter run died on exactly that:
    validate() reached the "_comment" string and crashed with
    AttributeError: 'str' object has no attribute 'get' — after setup,
    before any generation. Normalising here keeps validate() strict:
    after this split, every remaining entry must be a real node.
    """
    if isinstance(wf.get("nodes"), dict):
        wf = wf["nodes"]  # UI-format wrapper: {"nodes": {...}, "links": [...]}
    nodes, meta = {}, {}
    for key, val in wf.items():
        (nodes if isinstance(val, dict) else meta)[key] = val
    return nodes, meta


def type_set(t):
    """object_info serialises union types comma-joined ('IMAGE,LATENT')."""
    if isinstance(t, list):  # combo input: list of choices, not a link type
        return None
    return {x.strip() for x in str(t).split(",")}


def validate(wf, oi):
    errors = []
    for nid, node in wf.items():
        if not isinstance(node, dict):
            # Strict, but legible: metadata that survived to validation
            # is a defect to report, not a crash to die on (see
            # normalize_workflow — parse-time stripping is the fix).
            errors.append(f"entry {nid}: not a node object (got {type(node).__name__}); "
                          "metadata must be stripped by normalize_workflow() before validation")
            continue
        ct = node.get("class_type")
        if ct not in oi:
            errors.append(f"node {nid} ({ct}): unknown node class (not in object_info)")
            continue
        spec = oi[ct]
        inputs_spec = {}
        for section in ("required", "optional"):
            for name, tspec in spec.get("input", {}).get(section, {}).items():
                inputs_spec[name] = (tspec[0], section)
        present = node.get("inputs", {})
        for name, (t, section) in inputs_spec.items():
            if section == "required" and name not in present:
                errors.append(f"node {nid} ({ct}): Required input is missing: {name}")
        out_types_cache = {}
        for name, val in present.items():
            if not (isinstance(val, list) and len(val) == 2 and isinstance(val[0], (str, int))):
                continue  # widget value, not a link
            src_id, slot = str(val[0]), int(val[1])
            if name not in inputs_spec:
                continue  # extra input the class doesn't declare; ComfyUI ignores/warns
            expected = type_set(inputs_spec[name][0])
            if expected is None:
                errors.append(f"node {nid} ({ct}): input {name} is a combo, cannot be linked")
                continue
            if src_id not in wf:
                errors.append(f"node {nid} ({ct}): input {name} links from missing node {src_id}")
                continue
            src_node = wf[src_id]
            if not isinstance(src_node, dict):
                continue  # already reported above as a non-node entry
            src_ct = src_node.get("class_type")
            if src_ct not in oi:
                continue  # already reported above
            if src_id not in out_types_cache:
                out_types_cache[src_id] = oi[src_ct].get("output", [])
            outs = out_types_cache[src_id]
            if slot >= len(outs):
                errors.append(f"node {nid} ({ct}): input {name} links slot {slot} but {src_ct} has {len(outs)} outputs")
                continue
            actual = outs[slot]
            if "*" not in expected and "*" != actual and actual not in expected:
                errors.append(
                    f"node {nid} ({ct}): Return type mismatch: {name}, "
                    f"received_type({actual}) mismatch input_type({','.join(sorted(expected))})")
    return errors


def main():
    if len(sys.argv) != 3:
        print(__doc__)
        return 2
    with open(sys.argv[1]) as f:
        wf = json.load(f)
    wf, meta = normalize_workflow(wf)
    if meta:
        print(f"note: stripped {len(meta)} non-node metadata entr"
              f"{'y' if len(meta) == 1 else 'ies'}: {', '.join(sorted(meta))}")
    oi = load_object_info(sys.argv[2])
    errors = validate(wf, oi)
    if errors:
        print("VALIDATION_FAILED")
        for e in errors:
            print(" -", e)
        return 1
    print(f"VALIDATION_PASS ({len(wf)} nodes checked against object_info)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
