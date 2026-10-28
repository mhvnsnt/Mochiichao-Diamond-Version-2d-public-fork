#!/usr/bin/env python3
"""Validate a mochiichao/move-animscript/v1 file.

Enforces the anatomy-variance doctrine at the format level:
- header carries the stable move_id and the current display name;
- beats are contiguous and cover the full duration;
- every cue sits inside the timeline and inside its beat order;
- every performance declares an anatomy profile, uses only anchors
  its body actually has, and logs its variance (overrides with
  reasons, or an explicit no_variance_reason).

Usage: validate_animscript.py <file.animscript.json> [...]
Exit 0 = all valid; 1 = errors printed.
"""
import json
import sys

BODY_PLANS = {
    "biped_small", "biped_large", "quadruped", "limbless_swimmer",
    "serpentine", "levitating", "winged", "sessile",
}
ALL_ANCHORS = {
    "centre", "mouth", "hand_l", "hand_r", "forelimb", "tail_tip",
    "dorsal", "crown", "whole_body", "ground_contact",
}
CUE_VERBS = {
    "spawn_layer", "fade", "scale", "translate", "rotate", "flash",
    "shake", "palette_pulse", "bg_swap", "cam_push", "cam_pan",
    "cam_cut", "sfx", "cry", "hold",
}
TRACKS = {
    "performer_fx", "projectile", "target_fx", "background", "screen",
    "camera", "audio", "subtitle",
}


def check_cues(cues, where, duration, errors, anchors_allowed=None):
    last_t = -1
    for c in cues:
        if c.get("cue") not in CUE_VERBS:
            errors.append(f"{where}: unknown cue verb {c.get('cue')!r}")
        t, dur = c.get("t", -1), c.get("dur", 0)
        if t < last_t:
            errors.append(f"{where}: cues out of order at t={t}")
        last_t = t
        if t < 0 or t + dur > duration:
            errors.append(f"{where}: cue at t={t} dur={dur} escapes timeline")
        if anchors_allowed is not None and c.get("anchor") not in anchors_allowed:
            errors.append(
                f"{where}: anchor {c.get('anchor')!r} not in performer's "
                f"anchors_available {sorted(anchors_allowed)}")


def validate(path):
    errors = []
    try:
        doc = json.load(open(path))
    except Exception as e:  # noqa: BLE001
        return [f"{path}: unreadable JSON: {e}"]
    if doc.get("schema") != "mochiichao/move-animscript/v1":
        errors.append("schema is not mochiichao/move-animscript/v1")
    for key in ("move_id", "display_name", "fps", "duration_frames",
                "beats", "base_tracks", "performances"):
        if key not in doc:
            errors.append(f"missing required field: {key}")
    if errors:
        return errors
    duration = doc["duration_frames"]
    # beats contiguous + covering
    expect_from = 0
    for b in doc["beats"]:
        if b["from"] != expect_from:
            errors.append(f"beat {b.get('beat')}: starts {b['from']}, expected {expect_from}")
        expect_from = b["to"]
    if expect_from != duration:
        errors.append(f"beats end at {expect_from}, duration is {duration}")
    # base tracks
    for name, cues in doc["base_tracks"].items():
        if name not in TRACKS:
            errors.append(f"unknown base track: {name}")
        check_cues(cues, f"base_tracks.{name}", duration, errors,
                   anchors_allowed=ALL_ANCHORS)
    # performances
    if not doc["performances"]:
        errors.append("no performances: a script with no anatomy is not a script")
    for p in doc["performances"]:
        where = f"performance[{p.get('species', '?')}]"
        prof = p.get("anatomy_profile", {})
        if prof.get("body_plan") not in BODY_PLANS:
            errors.append(f"{where}: body_plan {prof.get('body_plan')!r} not in closed list")
        anchors = set(prof.get("anchors_available", []))
        if not anchors or not anchors <= ALL_ANCHORS:
            errors.append(f"{where}: anchors_available invalid: {sorted(anchors)}")
        if prof.get("effector") not in anchors:
            errors.append(f"{where}: effector {prof.get('effector')!r} not in anchors_available")
        check_cues(p.get("body_track", []), f"{where}.body_track",
                   duration, errors, anchors_allowed=anchors)
        if not (p.get("variance_notes") or "").strip():
            errors.append(f"{where}: variance_notes is mandatory (anatomy-variance doctrine)")
        overrides = p.get("overrides", [])
        if not overrides and not (p.get("no_variance_reason") or "").strip():
            errors.append(
                f"{where}: needs overrides or an explicit no_variance_reason")
        for o in overrides:
            if not (o.get("reason") or "").strip():
                errors.append(f"{where}: override on {o.get('track')}@{o.get('t')} has no reason")
    return errors


def main(argv):
    bad = 0
    for path in argv[1:]:
        errs = validate(path)
        if errs:
            bad = 1
            print(f"INVALID {path}")
            for e in errs:
                print(f"  - {e}")
        else:
            print(f"VALID   {path}")
    return bad


if __name__ == "__main__":
    sys.exit(main(sys.argv))
