#!/usr/bin/env python3
"""
Agent Status Summary - Display comprehensive status of all OpenClaw agents.

Usage:
    python3 agent_status.py [--json]

Options:
    --json    Output in JSON format for programmatic use
"""

import subprocess
import json
import sys
from datetime import datetime


def run_command(cmd: list) -> tuple:
    """Run a command and return (code, stdout, stderr)."""
    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=10
        )
        return result.returncode, result.stdout, result.stderr
    except subprocess.TimeoutExpired:
        return -1, "", "Command timed out"
    except Exception as e:
        return -1, "", str(e)


def get_agents() -> list:
    """Parse agents list output."""
    code, stdout, stderr = run_command(["openclaw", "agents", "list"])
    
    if code != 0:
        return [{"error": stderr or "Failed to list agents"}]
    
    agents = []
    current_agent = None
    
    for line in stdout.split("\n"):
        line = line.strip()
        if line.startswith("- "):
            if current_agent:
                agents.append(current_agent)
            
            # Parse agent header: "- main (default)" or "- work"
            name = line[2:].split("(")[0].strip()
            is_default = "(default)" in line
            current_agent = {
                "name": name,
                "default": is_default,
                "identity": None,
                "workspace": None,
                "model": None,
            }
        elif current_agent:
            if line.startswith("Identity:"):
                current_agent["identity"] = line.split(":", 1)[1].strip()
            elif line.startswith("Workspace:"):
                current_agent["workspace"] = line.split(":", 1)[1].strip()
            elif line.startswith("Model:"):
                current_agent["model"] = line.split(":", 1)[1].strip()
    
    if current_agent:
        agents.append(current_agent)
    
    return agents


def get_gateway_status() -> dict:
    """Check gateway status."""
    code, stdout, stderr = run_command(["openclaw", "gateway", "status"])
    
    return {
        "running": code == 0,
        "output": stdout.strip() if stdout else stderr.strip()
    }


def get_openclaw_version() -> str:
    """Get OpenClaw version."""
    code, stdout, _ = run_command(["openclaw", "--version"])
    if code == 0:
        return stdout.strip()
    return "unknown"


def format_status(agents: list, gateway: dict, version: str) -> str:
    """Format status as human-readable output."""
    lines = []
    lines.append("=" * 60)
    lines.append("🦞 OpenClaw Agent Status")
    lines.append(f"   Version: {version}")
    lines.append(f"   Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    lines.append("=" * 60)
    
    # Gateway
    lines.append("\n📡 Gateway:")
    status_icon = "✅" if gateway["running"] else "❌"
    lines.append(f"   {status_icon} {'Running' if gateway['running'] else 'Not running'}")
    if gateway["output"]:
        lines.append(f"   {gateway['output'][:100]}")
    
    # Agents
    lines.append("\n🤖 Agents:")
    for agent in agents:
        if "error" in agent:
            lines.append(f"   ❌ Error: {agent['error']}")
            continue
        
        default_marker = " (default)" if agent.get("default") else ""
        lines.append(f"   • {agent['name']}{default_marker}")
        if agent.get("model"):
            lines.append(f"     Model: {agent['model']}")
        if agent.get("workspace"):
            lines.append(f"     Workspace: {agent['workspace']}")
    
    lines.append("\n" + "=" * 60)
    
    return "\n".join(lines)


def main():
    output_json = "--json" in sys.argv
    
    agents = get_agents()
    gateway = get_gateway_status()
    version = get_openclaw_version()
    
    if output_json:
        result = {
            "timestamp": datetime.now().isoformat(),
            "version": version,
            "gateway": gateway,
            "agents": agents,
        }
        print(json.dumps(result, indent=2))
    else:
        print(format_status(agents, gateway, version))


if __name__ == "__main__":
    main()
