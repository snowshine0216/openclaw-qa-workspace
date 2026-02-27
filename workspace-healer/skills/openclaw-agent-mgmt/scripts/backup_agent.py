#!/usr/bin/env python3
"""
Backup Agent - Create a timestamped backup of an OpenClaw agent.

Usage:
    python3 backup_agent.py <agent-name> [--output <directory>]

Options:
    --output <dir>    Output directory for backup (default: current directory)
    --workspace       Include workspace files (default: True)
    --no-workspace    Exclude workspace files
    --skills          Include skills list (default: True)

Examples:
    python3 backup_agent.py main
    python3 backup_agent.py work --output ~/backups
    python3 backup_agent.py test --no-workspace
"""

import subprocess
import sys
import os
import json
import shutil
from datetime import datetime
from pathlib import Path
from argparse import ArgumentParser


OPENCLAW_DIR = Path.home() / ".openclaw"


def run_command(cmd: list) -> tuple[int, str, str]:
    """Run a command and return (code, stdout, stderr)."""
    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=30
        )
        return result.returncode, result.stdout, result.stderr
    except subprocess.TimeoutExpired:
        return -1, "", "Command timed out"
    except Exception as e:
        return -1, "", str(e)


def get_agent_info(agent_name: str) -> dict | None:
    """Get agent information from openclaw agents list."""
    code, stdout, stderr = run_command(["openclaw", "agents", "list"])
    
    if code != 0:
        return None
    
    current_agent = None
    
    for line in stdout.split("\n"):
        line = line.strip()
        if line.startswith("- "):
            name = line[2:].split("(")[0].strip()
            if name == agent_name:
                current_agent = {"name": name}
            else:
                current_agent = None
        elif current_agent:
            if line.startswith("Workspace:"):
                current_agent["workspace"] = line.split(":", 1)[1].strip()
            elif line.startswith("Agent dir:"):
                current_agent["agent_dir"] = line.split(":", 1)[1].strip()
    
    return current_agent


def backup_agent(
    agent_name: str,
    output_dir: Path,
    include_workspace: bool = True,
    include_skills: bool = True
) -> Path | None:
    """Create backup of an agent."""
    
    agent_info = get_agent_info(agent_name)
    if not agent_info:
        print(f"❌ Agent '{agent_name}' not found")
        return None
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_name = f"openclaw-agent-{agent_name}-{timestamp}"
    backup_dir = output_dir / backup_name
    
    print(f"🔄 Backing up agent: {agent_name}")
    print(f"   Output: {backup_dir}")
    
    # Create backup directory
    backup_dir.mkdir(parents=True, exist_ok=True)
    
    # Backup agent config
    agent_dir = Path(agent_info.get("agent_dir", OPENCLAW_DIR / "agents" / agent_name / "agent"))
    if agent_dir.exists():
        config_backup = backup_dir / "agent"
        shutil.copytree(agent_dir, config_backup, dirs_exist_ok=True)
        print(f"   ✅ Agent config backed up")
    else:
        print(f"   ⚠️ Agent directory not found: {agent_dir}")
    
    # Backup workspace
    if include_workspace:
        workspace = Path(agent_info.get("workspace", OPENCLAW_DIR / f"workspace-{agent_name}"))
        if workspace.exists():
            workspace_backup = backup_dir / "workspace"
            # Exclude large directories
            ignore_patterns = shutil.ignore_patterns(
                "node_modules", ".git", "__pycache__", "*.pyc",
                ".DS_Store", "tmp", "cache"
            )
            shutil.copytree(workspace, workspace_backup, ignore=ignore_patterns)
            print(f"   ✅ Workspace backed up")
        else:
            print(f"   ⚠️ Workspace not found: {workspace}")
    
    # Create manifest
    manifest = {
        "agent_name": agent_name,
        "backup_time": datetime.now().isoformat(),
        "agent_info": agent_info,
        "include_workspace": include_workspace,
        "include_skills": include_skills
    }
    
    # List skills if requested
    if include_skills:
        skills_dir = backup_dir / "agent" / "skills"
        if skills_dir.exists():
            manifest["skills"] = [d.name for d in skills_dir.iterdir() if d.is_dir()]
    
    manifest_path = backup_dir / "manifest.json"
    with open(manifest_path, "w") as f:
        json.dump(manifest, f, indent=2)
    
    print(f"   ✅ Manifest created")
    
    # Create zip archive
    zip_path = output_dir / f"{backup_name}.zip"
    shutil.make_archive(str(zip_path.with_suffix("")), 'zip', backup_dir)
    
    # Remove temporary directory
    shutil.rmtree(backup_dir)
    
    print(f"\n✅ Backup complete: {zip_path}")
    return zip_path


def main():
    parser = ArgumentParser(description="Backup OpenClaw agent")
    parser.add_argument("agent_name", help="Name of the agent to backup")
    parser.add_argument("--output", "-o", default=".", help="Output directory")
    parser.add_argument("--workspace", action="store_true", default=True, 
                       help="Include workspace (default: True)")
    parser.add_argument("--no-workspace", action="store_true", 
                       help="Exclude workspace")
    parser.add_argument("--skills", action="store_true", default=True,
                       help="Include skills list (default: True)")
    
    args = parser.parse_args()
    
    output_dir = Path(args.output).expanduser().resolve()
    output_dir.mkdir(parents=True, exist_ok=True)
    
    backup_agent(
        args.agent_name,
        output_dir,
        include_workspace=not args.no_workspace,
        include_skills=args.skills
    )


if __name__ == "__main__":
    main()
