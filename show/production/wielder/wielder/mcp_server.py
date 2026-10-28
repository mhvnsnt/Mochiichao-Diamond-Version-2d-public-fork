"""WIELDER tool surface over MCP (official modelcontextprotocol
python-sdk, MIT — see THIRD-PARTY-NOTICES). Exposes the same validated
tool layer the graph uses; schemas come from the Pydantic payload
models, so an MCP client gets identical guarantees.
Run: python -m wielder.mcp_server   (stdio transport)
"""
from __future__ import annotations

import json

try:  # mcp python-sdk 2.x name
    from mcp.server.mcpserver import MCPServer as _Server
except ImportError:  # mcp python-sdk 1.x name (Chainlit's dependency pins 1.x)
    from mcp.server.fastmcp import FastMCP as _Server

from . import tools

mcp = _Server("wielder")


@mcp.tool()
def wielder_tool(name: str, payload_json: str) -> str:
    """Call one Wielder tool by name with a JSON payload. The payload is
    validated against the tool's schema before anything executes."""
    res = tools.call_tool(name, json.loads(payload_json))
    return res.model_dump_json()


@mcp.tool()
def wielder_tools() -> str:
    """List the registered Wielder tools (schema-only execution layer)."""
    return json.dumps(sorted(tools.REGISTRY.keys()))


if __name__ == "__main__":
    mcp.run()
