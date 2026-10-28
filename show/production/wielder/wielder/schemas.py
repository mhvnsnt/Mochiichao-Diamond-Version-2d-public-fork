"""WIELDER schemas — every inter-agent message and tool payload is a
validated Pydantic model (Constitution #6). There is no free-text
channel between nodes.
"""
from __future__ import annotations

from typing import Any, Literal, Optional

from pydantic import BaseModel, Field, field_validator

from . import constitution as C


class DiscoveryLog(BaseModel):
    """Mandatory Research & Discovery Log (anti-laziness 2a). The graph
    cannot reach EXECUTING without one — enforced by the plan node."""
    knowns: list[str] = Field(min_length=1)
    unknowns: list[str] = Field(default_factory=list)
    files_read: list[str] = Field(min_length=1)
    assumptions: list[str] = Field(default_factory=list)
    retrieval_hits: list[str] = Field(default_factory=list)


class PlanStep(BaseModel):
    tool: str
    payload: dict[str, Any] = Field(default_factory=dict)
    purpose: str  # measured purpose, e.g. "submit target to verifier"


class Plan(BaseModel):
    """Planner output is a plan + discovery log, never a patch (2d)."""
    target_id: str
    method_ids: list[str] = Field(min_length=1)
    discovery: DiscoveryLog
    steps: list[PlanStep] = Field(min_length=1)


class ToolResult(BaseModel):
    tool: str
    ok: bool
    exit_code: Optional[int] = None
    result: dict[str, Any] = Field(default_factory=dict)
    raw_output: str = ""  # unedited (exit-code truth: stack traces feed retry raw)


class CriticNote(BaseModel):
    """Advisory only. A CriticNote can never carry a pass (Constitution #4)."""
    advisory: Literal[True] = True
    failure_reasons: list[str] = Field(default_factory=list)
    fixtures_consulted: list[str] = Field(default_factory=list)

    @field_validator("failure_reasons")
    @classmethod
    def _no_pass_language(cls, v: list[str]) -> list[str]:
        for line in v:
            low = line.lower()
            for tok in C.CRITIC_BANNED_TOKENS:
                if tok in low:
                    raise ValueError(f"critic output contains banned token: {tok!r}")
        return v


class ParkNote(BaseModel):
    """Stop-on-fail (Constitution #9): a park requires the exact blocker."""
    blocker: str = Field(min_length=8)
    evidence_refs: list[str] = Field(default_factory=list)


class CardRef(BaseModel):
    card_id: int
    title: str
    description: str = ""
    column: str = ""
    target_id: Optional[str] = None
