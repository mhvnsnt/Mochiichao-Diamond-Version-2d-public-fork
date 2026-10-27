#!/usr/bin/env python3
"""Generate one move script per MOVE from the real extracted move data.

Sources (read, never guessed):
  fresh-start/src/lib/generated/decomp_firered_moves.json  (354 moves)
  fresh-start/src/lib/generated/decomp_black2_moves.json   (560 moves)

Field names verified from the actual files:
  FireRed: sourceConstant, power, accuracy, pp, secondaryEffectChance,
    priority, effect, type, target, flags, derivedCategory
    (Gen 3 has no category field; derivedCategory is the file's own
    derivation: power 0 = Status, FIRE/WATER/GRASS/ELECTRIC/PSYCHIC/
    ICE/DRAGON/DARK = Special, otherwise Physical.)
  Black 2: sourceDir, sourceConstant, name, type (TYPE_*), category
    (MOVE_CATEGORY_*), power, accuracy, pp, priority, effect
    (BATTLE_EFFECT_*).
  NEITHER file has a `hits` field (verified: no hits key in any
  record), so multi-hit repeat counts CANNOT come from the data.
  The generator uses a documented generic default of 3 beats for
  multi-hit moves (labelled as an assumption, not data).
  Black 2 extracted data also has no `flags` field, so contact is
  known only where FireRed supplies MAKES_CONTACT; Black 2-only
  physical moves get the no-lunge physical template (see below).

Union rule: keyed by move name (sourceConstant minus MOVE_).
  351 names in both, 3 FireRed-only, 209 Black 2-only = 563 union.
  Where both exist, Black 2 wins for category (native Gen 5 split)
  and power/effect; FireRed wins for flags (contact). Category
  disagreements between the two sources (54 names, counted) are
  recorded per-move in `categoryDisagreement: true`.

Mapping (category x type x effect family x hits):
  Physical + MAKES_CONTACT  -> lunge + impact (sub_Lunge + sub_Impact)
  Physical, contact unknown -> impact only (no lunge claimed)
  Special                   -> projectile (type-keyed particle) + impact
  Status + stat pattern     -> sub_StatFlash (up/down from effect)
  Status + condition        -> sub_StatusPuff (9-type table)
  Status + heal pattern     -> status puff on user (generic heal cast)
  Multi-hit                 -> lunge? no: repeated sub_MultiHitBeat
                               x3 with alternating side (generic
                               default; see hits note above)
  Two-turn (FR SEMI_INVULNERABLE, BW2 DIG/FLY/DIVE/BOUNCE exact,
    or CHARGE_TURN in effect) -> variants {charge, unleash}
  Damaging + secondary      -> base + appended beats, in order:
                               status puff (condition *_HIT),
                               drain orb (ABSORB/RECOVER_HALF_DAMAGE),
                               recoil shake on attacker (RECOIL),
                               flinch flag (FLINCH, flag only, no pose),
                               faint slide (OHKO/ONE_HIT_KO),
                               recharge flag (RECHARGE)
  Power >= 120 damaging     -> Black 2-style camera save/shake/restore
                               (FireRed has no camera; labelled as such)
  Fallback                  -> any move whose effect family matches
                               NO rule above (mostly Status utility
                               moves: weather, trick, substitute-style
                               effects the data does not describe as
                               stat/status/heal). The fallback script
                               is a generic cast (puff + SE), NEVER a
                               guessed specific effect. Fallback moves
                               are listed in the output metadata.

Shake amplitude: Pokemon rule, power/12 clamped 1-16 px
  (FR battle_anim_mon_movement.c:872-901). Power 0 -> 3 px default.

Sound tokens: only SE_M_DOUBLE_SLAP (FR songs.h, cited in research)
  and SE_FAINT are claimed FireRed ids. All other SE_* tokens in
  generated scripts are GENERIC PLACEHOLDERS for the game's SE
  library, not claimed decomp ids.

Output: moveScripts.json in this directory (union-keyed, with
  per-move provenance + generation metadata + fallback list).
Re-run: python3 generate_move_scripts.py
"""

import json
import math
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
GEN_DIR = os.path.join(
    os.path.expanduser("~"),
    "workspace/mochiichao-work/fresh-start/src/lib/generated",
)

FR_PATH = os.path.join(GEN_DIR, "decomp_firered_moves.json")
BW_PATH = os.path.join(GEN_DIR, "decomp_black2_moves.json")

# 9-type FireRed status table (research §1A/§2A).
STATUS_CONDITIONS = [
    "Poison", "Confusion", "Burn", "Infatuation", "Sleep",
    "Paralysis", "Freeze", "Curse", "Nightmare",
]

CONDITION_SUBSTRINGS = [
    ("SLEEP", "Sleep"), ("PARALYZ", "Paralysis"), ("BURN", "Burn"),
    ("POISON", "Poison"), ("TOXIC", "Poison"), ("FREEZE", "Freeze"),
    ("CONFUS", "Confusion"), ("ATTRACT", "Infatuation"),
    ("INFATUAT", "Infatuation"), ("CURSE", "Curse"),
    ("NIGHTMARE", "Nightmare"),
]

TYPE_PARTICLES = {
    "FIRE": "ember", "WATER": "water", "ELECTRIC": "spark",
    "GRASS": "seed", "ICE": "ice", "PSYCHIC": "psy",
    "DRAGON": "dragon", "DARK": "dark", "GHOST": "ghost",
    "POISON": "poison", "FLYING": "gust", "GROUND": "rock",
    "ROCK": "rock", "STEEL": "steel", "BUG": "bug",
    "FIGHTING": "fight", "NORMAL": "normal", "MYSTERY": "normal",
}

TWO_TURN_BW_EXACT = {
    "BATTLE_EFFECT_DIG", "BATTLE_EFFECT_FLY", "BATTLE_EFFECT_DIVE",
    "BATTLE_EFFECT_BOUNCE", "BATTLE_EFFECT_SKY_DROP",
}

MULTI_HIT_DEFAULT_BEATS = 3  # Assumption (no hits field in either file).


def move_key(rec):
    const = rec["sourceConstant"]
    return const[5:] if const.startswith("MOVE_") else const


def norm_category(rec):
    if "category" in rec:  # Black 2 native split
        return rec["category"].replace("MOVE_CATEGORY_", "").capitalize()
    return rec.get("derivedCategory")  # FireRed derivation


def norm_type(rec):
    t = rec.get("type", "")
    return t[5:] if t.startswith("TYPE_") else t


def shake_amp(power):
    if not power:
        return 3
    amp = int(round(power / 12))
    return max(1, min(16, amp))


def condition_in(effect):
    for sub, name in CONDITION_SUBSTRINGS:
        if sub in effect:
            return name
    return None


def is_two_turn(fr_effect, bw_effect):
    if fr_effect == "SEMI_INVULNERABLE":
        return True
    if bw_effect in TWO_TURN_BW_EXACT:
        return True
    if bw_effect and "CHARGE_TURN" in bw_effect:
        return True
    return False


def is_multi(effect):
    return ("MULTI_HIT" in effect or "HIT_TWICE" in effect
            or effect in ("BEAT_UP", "BATTLE_EFFECT_BEAT_UP"))


def stat_direction(effect):
    """Return 'up'/'down'/None from stat-change effect strings."""
    if "_UP" in effect or effect.endswith("_UP"):
        return "up"
    if "_DOWN" in effect or effect.endswith("_DOWN"):
        return "down"
    if "UP_2" in effect or "UP_1" in effect:
        return "up"
    if "DOWN_2" in effect or "DOWN_1" in effect:
        return "down"
    if "ACC" in effect or "EVA" in effect or "STAT" in effect:
        # Accuracy/evasion/stat changes: direction from UP/DOWN token.
        if "UP" in effect:
            return "up"
        if "DOWN" in effect:
            return "down"
    return None


def build_script(name, category, mtype, power, effect, contact, fr_effect,
                 bw_effect):
    """Return (template, family, steps_or_variants, is_fallback, notes)."""
    notes = []
    amp = shake_amp(power)
    impact = {"op": "call", "sub": "sub_Impact",
              "args": {"amplitudePx": amp}}
    camera_open = [
        {"op": "camera_save"},
        {"op": "camera_shake", "dir": "horizontal",
         "amplitudePx": amp, "frames": 12, "count": 2},
    ]
    camera_close = [{"op": "camera_restore"}]
    heavy_camera = bool(power and power >= 120)
    if heavy_camera:
        notes.append("Black 2-style camera shake (power>=120; "
                     "FireRed has no camera)")

    # ---- two-turn: variants, not one flat script ----
    if is_two_turn(fr_effect, bw_effect):
        base = base_steps(category, mtype, power, effect, contact, notes)
        return ("two_turn", "two_turn",
                {"charge": [{"op": "call", "sub": "sub_ChargeUp"}],
                 "unleash": base},
                False, notes)

    # ---- multi-hit ----
    if is_multi(effect):
        steps = []
        if category == "Physical" and contact:
            steps.append({"op": "call", "sub": "sub_Lunge"})
        for i in range(MULTI_HIT_DEFAULT_BEATS):
            side = "left" if i % 2 == 0 else "right"
            steps.append({"op": "call", "sub": "sub_MultiHitBeat",
                          "args": {"side": side, "amplitudePx": amp,
                                   "xOff": -8 if side == "left" else 8}})
        steps.append({"op": "end"})
        notes.append("Multi-hit beats=%d (generic default; no hits "
                     "field in extracted data)" % MULTI_HIT_DEFAULT_BEATS)
        return ("multi_hit", "multi_hit", steps, False, notes)

    # ---- damaging moves ----
    if category in ("Physical", "Special"):
        steps = base_steps(category, mtype, power, effect, contact, notes)
        # Secondary beats, in fixed order.
        cond = condition_in(effect)
        if cond:
            steps.append({"op": "call", "sub": "sub_StatusPuff",
                          "args": {"status": cond.lower()}})
            notes.append("Secondary status beat (conditional on proc): "
                         + cond)
        if "ABSORB" in effect or "RECOVER_HALF_DAMAGE" in effect \
                or "DRAIN" in effect:
            steps.append({"op": "call", "sub": "sub_DrainOrb"})
        if "RECOIL" in effect:
            steps.append({"op": "createvisualtask", "task": "ShakeMon",
                          "battler": "attacker", "xPx": 3, "yPx": 0,
                          "shakes": 6, "frameDelay": 1})
            steps.append({"op": "waitforvisualfinish"})
        if "FLINCH" in effect:
            # Flag only, no pose — exactly as Pokemon does flinch.
            steps.append({"op": "setarg", "name": "flinch",
                          "value": True})
        if "ONE_HIT_KO" in effect or effect == "OHKO":
            steps.append({"op": "call", "sub": "sub_FaintSlide"})
        if "RECHARGE" in effect:
            steps.append({"op": "setarg", "name": "recharge_next_turn",
                          "value": True})
        if heavy_camera:
            steps = camera_open + steps + camera_close
        steps.append({"op": "end"})
        family = "damage"
        if cond:
            family = "damage_with_status"
        return ("physical_contact" if (category == "Physical" and contact)
                else ("physical" if category == "Physical"
                      else "special_projectile"),
                family, steps, False, notes)

    # ---- status-category moves ----
    if category == "Status":
        direction = stat_direction(effect)
        if direction:
            steps = [{"op": "call", "sub": "sub_StatFlash",
                      "args": {"direction": direction}},
                     {"op": "end"}]
            return ("stat_change", "stat_change", steps, False, notes)
        cond = condition_in(effect)
        if cond:
            steps = [{"op": "call", "sub": "sub_StatusPuff",
                      "args": {"status": cond.lower()}},
                     {"op": "end"}]
            return ("status_condition", "status_condition", steps,
                    False, notes)
        if "RESTORE" in effect or "RECOVER" in effect or "HEAL" in effect:
            steps = [{"op": "call", "sub": "sub_StatusPuff",
                      "args": {"status": "heal"}},
                     {"op": "end"}]
            return ("status_heal", "status_heal", steps, False, notes)
        # Utility effect the data does not describe as stat/status/
        # heal: generic cast fallback, never a guessed specific effect.
        steps = [{"op": "call", "sub": "sub_StatusPuff",
                  "args": {"status": "generic"}},
                 {"op": "playsewithpan", "se": "SE_M_STATUS_GENERIC",
                  "pan": "target"},
                 {"op": "end"}]
        notes.append("Fallback: Status utility effect not modelled "
                     "(effect=%s); generic cast, not a guessed effect"
                     % effect)
        return ("generic_fallback", "fallback_utility", steps, True, notes)

    # ---- unknown category: cannot happen with current data, but the
    # fallback path exists and is reported, never silently mapped. ----
    steps = [{"op": "call", "sub": "sub_StatusPuff",
              "args": {"status": "generic"}},
             {"op": "end"}]
    notes.append("Fallback: no mappable category (category=%r)" % category)
    return ("generic_fallback", "fallback_unknown_category", steps,
            True, notes)


def base_steps(category, mtype, power, effect, contact, notes):
    amp = shake_amp(power)
    if category == "Physical" and contact:
        return [{"op": "call", "sub": "sub_Lunge"},
                {"op": "call", "sub": "sub_Impact",
                 "args": {"amplitudePx": amp}}]
    if category == "Physical":
        # Contact unknown (Black 2-only moves have no flags in the
        # extracted data): impact only, no lunge claimed.
        notes.append("Physical, contact unknown (no flags in Black 2 "
                     "extracted data): no lunge claimed")
        return [{"op": "call", "sub": "sub_Impact",
                 "args": {"amplitudePx": amp}}]
    # Special: type-keyed projectile + impact.
    particle = TYPE_PARTICLES.get(mtype, "normal")
    return [{"op": "call", "sub": "sub_Projectile",
             "args": {"particle": particle}},
            {"op": "call", "sub": "sub_Impact",
             "args": {"amplitudePx": amp}}]


def main():
    with open(FR_PATH) as f:
        fr_data = json.load(f)
    with open(BW_PATH) as f:
        bw_data = json.load(f)
    fr_moves = fr_data["moves"]
    bw_moves = bw_data["moves"]

    fr_by_key = {move_key(m): m for m in fr_moves}
    bw_by_key = {move_key(m): m for m in bw_moves}
    union_keys = sorted(set(fr_by_key) | set(bw_by_key))

    scripts = {}
    fallback_names = []
    template_counts = {}
    family_counts = {}
    category_disagreements = []
    for key in union_keys:
        fr = fr_by_key.get(key)
        bw = bw_by_key.get(key)
        sources = []
        if fr:
            sources.append("firered")
        if bw:
            sources.append("black2")
        # Black 2 wins for category/power/effect (native split);
        # FireRed wins for flags (contact).
        primary = bw if bw else fr
        category = norm_category(primary)
        mtype = norm_type(primary)
        power = primary.get("power", 0)
        effect = primary.get("effect", "")
        contact = bool(fr and "MAKES_CONTACT" in (fr.get("flags") or []))
        if fr and bw:
            fr_cat = norm_category(fr)
            bw_cat = norm_category(bw)
            if fr_cat != bw_cat:
                category_disagreements.append(key)
        template, family, body, is_fallback, notes = build_script(
            key, category, mtype, power, effect, contact,
            fr["effect"] if fr else None,
            bw["effect"] if bw else None)
        entry = {
            "move": key,
            "sources": sources,
            "category": category,
            "type": mtype,
            "power": power,
            "effect": effect,
            "fireredEffect": fr["effect"] if fr else None,
            "black2Effect": bw["effect"] if bw else None,
            "contact": contact,
            "template": template,
            "family": family,
            "fallback": is_fallback,
            "notes": notes,
        }
        if isinstance(body, dict):  # two-turn variants
            entry["variants"] = body
        else:
            entry["steps"] = body
        scripts[key] = entry
        template_counts[template] = template_counts.get(template, 0) + 1
        family_counts[family] = family_counts.get(family, 0) + 1
        if is_fallback:
            fallback_names.append(key)

    out = {
        "generator": "generate_move_scripts.py",
        "sources": {
            "firered": {"file": "decomp_firered_moves.json",
                        "moves": len(fr_moves)},
            "black2": {"file": "decomp_black2_moves.json",
                       "moves": len(bw_moves)},
        },
        "unionMoves": len(scripts),
        "bothSources": len(set(fr_by_key) & set(bw_by_key)),
        "fireredOnly": sorted(set(fr_by_key) - set(bw_by_key)),
        "black2OnlyCount": len(set(bw_by_key) - set(fr_by_key)),
        "categoryDisagreements": len(category_disagreements),
        "categoryDisagreementMoves": sorted(category_disagreements),
        "templateCounts": template_counts,
        "familyCounts": family_counts,
        "fallbackCount": len(fallback_names),
        "fallbackMoves": sorted(fallback_names),
        "assumptions": [
            "Multi-hit beats default to 3: neither extracted file has "
            "a hits field (verified).",
            "Black 2-only physical moves: contact unknown (no flags "
            "field in Black 2 extracted data) -> no-lunge template.",
            "Where both sources exist, Black 2 wins for category/power/"
            "effect, FireRed wins for flags.",
            "SE tokens other than SE_M_DOUBLE_SLAP and SE_FAINT are "
            "generic placeholders, not claimed decomp ids.",
            "Camera steps are Black 2-style; FireRed has no camera.",
        ],
        "scripts": scripts,
    }
    out_path = os.path.join(HERE, "moveScripts.json")
    with open(out_path, "w") as f:
        json.dump(out, f, indent=1, sort_keys=True)
        f.write("\n")
    print("wrote %s" % out_path)
    print("firered=%d black2=%d union=%d both=%d frOnly=%d bwOnly=%d"
          % (len(fr_moves), len(bw_moves), len(scripts),
             len(set(fr_by_key) & set(bw_by_key)),
             len(set(fr_by_key) - set(bw_by_key)),
             len(set(bw_by_key) - set(fr_by_key))))
    print("templates:", template_counts)
    print("families:", family_counts)
    print("fallback=%d categoryDisagreements=%d"
          % (len(fallback_names), len(category_disagreements)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
