"""Method registry resolver — Wielder binds work to the finish-gate
method registry (methods/INDEX.json). Exactly one Accepted method per
problem; a Superseded or unregistered method hard-fails at PLANNING
(Constitution #5; fixes donor defect D10 — after-the-fact checking).
"""
from __future__ import annotations

import json
from typing import Any

from . import constitution as C


class MethodError(RuntimeError):
    pass


class SupersededMethodError(MethodError):
    pass


class UnregisteredMethodError(MethodError):
    pass


def load_registry() -> dict[str, Any]:
    with open(C.FINISH_GATE / "methods/INDEX.json") as f:
        return json.load(f)


def get_method(method_id: str) -> dict[str, Any]:
    for m in load_registry()["methods"]:
        if m["id"] == method_id:
            return m
    raise UnregisteredMethodError(f"method {method_id} is not in the registry")


def assert_accepted(method_id: str) -> dict[str, Any]:
    m = get_method(method_id)
    if m["status"] == "Superseded":
        raise SupersededMethodError(f"method {method_id} is Superseded — hard fail")
    if m["status"] != "Accepted":
        raise MethodError(f"method {method_id} status is {m['status']}, not Accepted")
    return m


def load_target(target_id: str) -> dict[str, Any]:
    with open(C.FINISH_GATE / "targets" / f"{target_id}.json") as f:
        return json.load(f)
