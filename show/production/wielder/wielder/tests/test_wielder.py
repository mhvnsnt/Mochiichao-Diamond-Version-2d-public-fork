"""WIELDER wiring tests — the constitution, executable.
Run: python -m pytest wielder/tests -q   (from the package parent dir)
"""
import sqlite3
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

import pytest

from wielder import constitution as C
from wielder import methods as M
from wielder import tools
from wielder.ledger import IllegalTransition, Ledger
from wielder.schemas import CriticNote, DiscoveryLog
from wielder.scrub import scrub


def test_state_machine_rejects_illegal_transition(tmp_path):
    led = Ledger(tmp_path / "t.sqlite")
    rid = led.open_run(1, "card", "t")
    with pytest.raises(IllegalTransition):
        led.transition(rid, "SUCCESS", "self-certification attempt")
    led.transition(rid, "PLANNING", "ok")
    led.transition(rid, "EXECUTING", "ok")
    led.transition(rid, "EVALUATING", "ok")
    led.transition(rid, "PARKED", "owner gate")
    led.transition(rid, "EVALUATING", "resume is legal from a park")


def test_superseded_method_hard_fails():
    with pytest.raises(M.SupersededMethodError):
        M.assert_accepted("M-RETIRED-WHOLESPRITE")
    with pytest.raises(M.UnregisteredMethodError):
        M.assert_accepted("M-DOES-NOT-EXIST")
    assert M.assert_accepted("M-ANIM-PARTPACK")["status"] == "Accepted"


def test_scorer_owned_paths_are_write_denied():
    with pytest.raises(tools.GuardError):
        tools.assert_not_scorer_owned(str(C.FINISH_GATE / "targets/x.json"))
    with pytest.raises(tools.GuardError):
        tools.assert_not_scorer_owned(str(C.FINISH_GATE / "evidence/x.json"))
    tools.assert_not_scorer_owned(str(C.DATA / "runs/x/packet.md"))  # own area: fine


def test_discovery_log_is_mandatory_and_shaped():
    with pytest.raises(Exception):
        DiscoveryLog(knowns=[], files_read=[])
    ok = DiscoveryLog(knowns=["k"], files_read=["f"])
    assert ok.unknowns == []


def test_critic_cannot_use_pass_language():
    with pytest.raises(Exception):
        CriticNote(failure_reasons=["the artifact looks good and passed review"])
    note = CriticNote(failure_reasons=["Clause AC-02 status FAIL — measured: 12 white frames"])
    assert note.advisory is True


def test_first_person_scrubbing():
    out = scrub("Great! Fix this code I wrote — my code has a bug in my episode")
    assert "I wrote" not in out and "my code" not in out
    assert out.startswith("Fix")


def test_tool_layer_rejects_unvalidated_payload():
    with pytest.raises(Exception):
        tools.call_tool("run_verifier", {"wrong_field": 1})
    res = tools.call_tool("no_such_tool", {})
    assert res.ok is False


def test_config_is_wielder_defaults():
    assert C.CONFIG["default_deny_completion"] is True
    assert C.CONFIG["wip_limit"] == 1
    assert C.CONFIG["raw_shell_allowed"] is False
    assert C.WIP_LIMIT == 1 and C.RETRY_CAP == 3


def test_claim_linter_rejects_bare_claims_and_owner_only():
    from wielder import linter
    with pytest.raises(linter.ClaimRejected):
        linter.lint("The scene is done and the wiring is proven.")
    linter.lint("Per manifest evidence/x.json the verdict stands, sha256 "
                "0123456789abcdef0123 — the run is complete as measured.")
    with pytest.raises(linter.ClaimRejected):
        linter.lint("This step is waiting on Kaggle to recover.")
    with pytest.raises(linter.ClaimRejected):
        linter.lint("Only the owner can do this upload in a browser.")
    linter.lint("Blocked: an unshared credential is required for this door.")


def test_rules_registry_check_cites_settled_rulings():
    from wielder import rules
    with pytest.raises(rules.RuleViolation):
        rules.check_text("composite the plate from the Binary Woods set")
    assert rules.check_text("a plain task with no settled terms") == []


def test_version_resolver_hard_fails_superseded():
    from wielder import versions
    with pytest.raises(versions.VersionError):
        versions.resolve_run_pieces({"method_ids": ["M-RETIRED-WHOLESPRITE"]})
    out = versions.resolve_run_pieces({"method_ids": ["M-ANIM-PARTPACK"]})
    assert out[0]["status"] == "Accepted (current)"


def test_doors_reroute_on_failure():
    from wielder.doors import attempt_with_doors
    run = attempt_with_doors("job", [("api", lambda: (False, "429")),
                                     ("cli", lambda: (True, "ok"))])
    assert run.ok and [a.door for a in run.attempts] == ["api", "cli"]


def test_judgment_headline_never_leads_with_a_passing_side_metric():
    from wielder import judgment
    man = {"clauses": [{"id": "AC-01", "measurer": "ffprobe_spec", "status": "PASS",
                        "measured": "spec ok", "threshold": "spec"},
                       {"id": "AC-03", "measurer": "frame1_anchor", "status": "FAIL",
                        "measured": "MAD 50.96", "threshold": "anchor"}],
           "owner_gate": {"status": "PENDING"}}
    assert judgment.headline(man).startswith("CORE RESULT: FAIL — AC-03")


def test_failure_taxonomy_counts_toward_three_strikes(tmp_path):
    led = Ledger(tmp_path / "t.sqlite")
    rid = led.open_run(1, "card", "tgt")
    assert led.record_failure(rid, "tgt", "AC-02", "resubmit") == 1
    assert led.record_failure(rid, "tgt", "AC-02", "resubmit") == 2
    assert led.count_failures("tgt", "resubmit") == 2
    assert led.count_failures("tgt", "other-class") == 0


def test_browser_job_is_a_routing_receipt_not_execution(tmp_path, monkeypatch):
    from wielder import authz
    monkeypatch.setattr(authz.C, "DATA", tmp_path)
    with pytest.raises(Exception):  # no standing grant yet -> not authorized
        tools.call_tool("request_browser_job", {"intent": "x", "steps": []})
    authz.grant("browser-actions", "*")
    res = tools.call_tool("request_browser_job",
                          {"intent": "collect the run output from the kernel page",
                           "steps": ["open the kernel page", "download outputs"]})
    assert res.ok and res.result["status"] == "QUEUED_FOR_BROWSER_LANE"
    assert "not execution" in res.result["note"]


def test_standing_authorization_ledger(tmp_path, monkeypatch):
    from wielder import authz
    monkeypatch.setattr(authz.C, "DATA", tmp_path)
    with pytest.raises(authz.NotAuthorized):
        authz.require("local-builds-renders", "verify something")
    gid = authz.grant("local-builds-renders", "*")
    g = authz.require("local-builds-renders", "verify something")
    assert g["id"] == gid  # the use was audit-logged on the way through
    with pytest.raises(authz.NotAuthorized):
        authz.grant("payment-approval", "*")  # honest exception set: never grantable
    authz.revoke(gid)
    with pytest.raises(authz.NotAuthorized):
        authz.require("local-builds-renders", "verify something")


def test_linter_rejects_environment_blockers_without_attempt():
    from wielder import linter
    with pytest.raises(Exception):
        linter.lint("The step is blocked: the tool is GUI only and this box is headless.")
    linter.lint("Blocked after trying. desktop attempt evidence: self_provision returned "
                "display up_now=false, bus=null (attempt logged in run W-x).")
