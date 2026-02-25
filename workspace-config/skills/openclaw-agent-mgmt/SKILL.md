---
name: openclaw-agent-mgmt
description: Manage OpenClaw agents, gateways, and workspaces. Use when working with isolated agent configurations, creating or deleting agents, setting agent identities, managing gateway lifecycle (start/stop/status), checking system health, or backing up agent configurations. Triggers for tasks like "create a new agent", "list my agents", "backup agent config", "start the gateway", "check agent health", or "configure agent routing".
---

# OpenClaw Agent Management

Manage isolated agents with separate workspaces, identities, and configurations.

## Quick Reference

| Task | Command |
|------|---------|
| List agents | `openclaw agents list` |
| Create agent | `openclaw agents add <name>` |
| Delete agent | `openclaw agents delete <name>` |
| Update identity | `openclaw agents set-identity <name> --name "X" --emoji "🤖"` |
| Gateway status | `openclaw gateway status` |
| Start gateway | `openclaw gateway start` |
| System health | `openclaw doctor` |
| Full status | `python3 scripts/agent_status.py` |

## Core Workflows

### Creating a New Agent

```bash
# Basic creation
openclaw agents add <name>

# With specific model
openclaw agents add research --model claude-3-5-sonnet

# Copy from existing
openclaw agents add staging --copy-from main
```

Then configure identity:
```bash
openclaw agents set-identity <name> --name "Research Bot" --emoji "🔬"
```

### Managing Gateway

```bash
# Start
openclaw gateway start

# Force restart (kill existing)
openclaw gateway start --force

# Stop
openclaw gateway stop

# Status
openclaw gateway status
openclaw health
```

### Health Monitoring

```bash
# Quick check
openclaw status

# Full diagnostics
openclaw doctor

# Comprehensive status with agent_status.py
python3 scripts/agent_status.py
```

### Backup Agent

```bash
# Backup to current directory
python3 scripts/backup_agent.py main

# Backup to specific location
python3 scripts/backup_agent.py work --output ~/backups
```

## Key Concepts

### Agent Isolation

Each agent has:
- **Workspace** - Separate directory for projects, memory, files
- **Identity** - Name, emoji, personality (SOUL.md)
- **Config** - Model selection, routing rules
- **Skills** - Agent-specific skill installations

### Directory Structure

```
~/.openclaw/
├── workspace/           # Default agent workspace
├── agents/
│   ├── main/agent/      # Main agent config
│   └── work/agent/      # Work agent config
├── skills/              # Global skills
└── openclaw.json        # Main config
```

### Routing

Agents can route messages based on:
- Channel (WhatsApp, Discord, Telegram)
- Account/peer
- Time-based rules

Use `openclaw agents list --bindings` to view routing rules.

## Scripts

### agent_status.py

Comprehensive status summary:
```bash
python3 scripts/agent_status.py        # Human-readable
python3 scripts/agent_status.py --json  # JSON output
```

### backup_agent.py

Create timestamped backups:
```bash
python3 scripts/backup_agent.py <name> [--output <dir>] [--no-workspace]
```

## References

- **[cli-reference.md](references/cli-reference.md)** - Complete CLI command reference
- **[workflows.md](references/workflows.md)** - Detailed workflow guides for common tasks

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port in use | `openclaw gateway start --force` |
| Agent not found | Check with `openclaw agents list` |
| Config errors | Run `openclaw doctor` |
| Channel issues | `openclaw channels login --verbose` |
