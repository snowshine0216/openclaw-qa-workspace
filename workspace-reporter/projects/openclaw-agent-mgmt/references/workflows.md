# Agent Management Workflows

## Table of Contents

1. [Creating a New Agent](#creating-a-new-agent)
2. [Configuring Agent Identity](#configuring-agent-identity)
3. [Managing Multiple Workspaces](#managing-multiple-workspaces)
4. [Gateway Lifecycle](#gateway-lifecycle)
5. [Health Monitoring](#health-monitoring)
6. [Backup & Migration](#backup--migration)

---

## Creating a New Agent

### Basic Agent Creation

```bash
# Create agent with defaults
openclaw agents add <name>

# Create with specific model
openclaw agents add research --model claude-3-5-sonnet

# Create with custom workspace
openclaw agents add personal --workspace ~/.openclaw/workspace-personal
```

### Copy Configuration from Existing Agent

```bash
# Clone an existing agent's config
openclaw agents add staging --copy-from main
```

### Post-Creation Setup

1. Set identity:
   ```bash
   openclaw agents set-identity <name> --name "Display Name" --emoji "🤖"
   ```

2. Configure workspace files (optional):
   - Edit `~/.openclaw/agents/<name>/agent/SOUL.md` for personality
   - Edit `~/.openclaw/agents/<name>/agent/USER.md` for user context
   - Edit `~/.openclaw/agents/<name>/agent/IDENTITY.md` for identity

3. Install skills specific to this agent:
   ```bash
   npx clawhub install <skill> --dir ~/.openclaw/agents/<name>/agent/skills
   ```

---

## Configuring Agent Identity

### Identity Components

| Component | File | Purpose |
|-----------|------|---------|
| Name | IDENTITY.md | Display name and role |
| Personality | SOUL.md | Behavioral traits |
| User Context | USER.md | User information |
| Tools | TOOLS.md | Tool configurations |

### Update Identity via CLI

```bash
openclaw agents set-identity <name> \
  --name "Research Assistant" \
  --emoji "🔬" \
  --theme "dark"
```

### Manual Identity Edit

Edit `~/.openclaw/agents/<name>/agent/IDENTITY.md`:

```markdown
# <Name>

Role: <role description>
Theme: <visual theme>
Avatar: <emoji or image path>

## Traits
- <trait 1>
- <trait 2>
```

---

## Managing Multiple Workspaces

### Workspace Isolation

Each agent can have its own workspace with separate:
- Project files
- Memory logs
- Skills
- Configuration

### Switching Between Agents

When starting gateway:
```bash
# Gateway uses default agent
openclaw gateway

# To use different agent, specify in message routing
```

### Workspace Structure

```
~/.openclaw/
├── workspace/           # Default agent workspace
│   ├── AGENTS.md
│   ├── SOUL.md
│   ├── USER.md
│   ├── memory/
│   ├── projects/
│   └── skills/
│
├── agents/
│   ├── main/
│   │   └── agent/       # Main agent overrides
│   ├── work/
│   │   └── agent/
│   └── personal/
│       └── agent/
```

---

## Gateway Lifecycle

### Starting Gateway

```bash
# Standard start
openclaw gateway start

# Force restart (kill existing)
openclaw gateway start --force

# Dev mode (isolated config)
openclaw gateway start --dev

# With specific options
openclaw gateway start --port 19000 --auth token --token mysecret
```

### Stopping Gateway

```bash
openclaw gateway stop
```

### Checking Status

```bash
# Quick status
openclaw gateway status

# Detailed health
openclaw health

# Full diagnostics
openclaw doctor
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Port in use | `openclaw gateway start --force` |
| Auth failed | Check `gateway.token` in config |
| No channels | Run `openclaw channels login --verbose` |

---

## Health Monitoring

### Regular Health Checks

```bash
# Quick status
openclaw status

# With live probe
openclaw status --probe

# Run diagnostics
openclaw doctor
```

### Monitor Script

Run the included health script:
```bash
python3 scripts/agent_status.py
```

This outputs:
- All configured agents
- Gateway status
- Channel health
- Recent sessions

### Automated Monitoring

Set up a cron job for periodic checks:
```bash
openclaw cron add
# Select: health check script
# Schedule: every hour
```

---

## Backup & Migration

### Backup Agent

```bash
python3 scripts/backup_agent.py <agent-name> [--output <path>]
```

This creates a timestamped archive containing:
- Agent config
- Workspace files
- Memory logs
- Installed skills list

### Restore Agent

```bash
# Extract backup
unzip openclaw-agent-<name>-YYYYMMDD.zip -d /tmp/restore

# Copy to agent directory
cp -r /tmp/restore/agent/* ~/.openclaw/agents/<name>/

# Copy workspace
cp -r /tmp/restore/workspace/* ~/.openclaw/workspace-<name>/
```

### Migration to New Machine

1. Backup all agents:
   ```bash
   for agent in $(openclaw agents list | grep -E "^- " | awk '{print $2}'); do
     python3 scripts/backup_agent.py "$agent"
   done
   ```

2. Copy backups to new machine

3. Restore on new machine:
   ```bash
   openclaw setup  # Initialize OpenClaw
   # Then restore each agent backup
   ```
