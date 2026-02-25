# OpenClaw CLI Reference for Agent Management

## Agent Commands

### List Agents

```bash
openclaw agents list
openclaw agents list --bindings  # Show full routing rules
```

Output includes:
- Agent name (default marked)
- Identity (name, emoji, IDENTITY.md path)
- Workspace path
- Agent directory
- Model
- Routing rules count

### Add Agent

```bash
openclaw agents add <name> [options]

Options:
  --workspace <path>     Custom workspace directory
  --model <model>        Default model (e.g., zai/glm-5, claude-3-5-sonnet)
  --copy-from <agent>    Copy config from existing agent
```

Example:
```bash
openclaw agents add work --workspace ~/.openclaw/workspace-work
openclaw agents add test --model claude-3-5-sonnet
```

### Delete Agent

```bash
openclaw agents delete <name> [options]

Options:
  --force    Skip confirmation prompt
  --keep-workspace    Preserve workspace directory
```

Warning: Deletes agent config, state, and by default the workspace directory.

### Set Identity

```bash
openclaw agents set-identity <name> [options]

Options:
  --name <name>         Display name
  --emoji <emoji>       Avatar emoji
  --theme <theme>       Visual theme
  --avatar <path>       Avatar image path
```

Example:
```bash
openclaw agents set-identity work --name "WorkBot" --emoji "💼"
```

## Gateway Commands

### Start Gateway

```bash
openclaw gateway start [options]

Options:
  --port <port>              WebSocket port (default: 18080)
  --auth <mode>              "token" or "password"
  --token <token>            Auth token
  --bind <mode>              loopback|lan|tailnet|auto|custom
  --force                    Kill existing process on port
  --verbose                  Detailed logging
  --dev                      Dev mode (isolated config)
```

### Stop Gateway

```bash
openclaw gateway stop
```

### Gateway Status

```bash
openclaw gateway status
openclaw health              # Health check from running gateway
```

## Status & Health

```bash
openclaw status              # Channel health + recent sessions
openclaw status --probe      # Live health probe
openclaw doctor              # Health checks + quick fixes
```

## Config Management

```bash
openclaw config get <key>
openclaw config set <key> <value>
openclaw config unset <key>
openclaw config               # Interactive wizard
```

Common config keys:
- `gateway.mode` - Gateway mode (local/remote)
- `gateway.port` - Default port
- `gateway.bind` - Bind mode
- `default_model` - Default model for agents

## Skills Management

```bash
openclaw skills list         # List installed skills
openclaw skills install <path>   # Install from path
openclaw skills remove <name>    # Remove skill
```

## Sessions

```bash
openclaw sessions            # List stored conversation sessions
```

## Channels

```bash
openclaw channels status     # Channel connection status
openclaw channels login --verbose   # Login to channel
openclaw channels logout <channel>  # Logout from channel
```

## Cron Jobs

```bash
openclaw cron list           # List scheduled jobs
openclaw cron add            # Add new job (interactive)
openclaw cron remove <id>    # Remove job
```

## Directory Locations

| Path | Purpose |
|------|---------|
| `~/.openclaw/` | Main config directory |
| `~/.openclaw/openclaw.json` | Main config file |
| `~/.openclaw/workspace/` | Default workspace |
| `~/.openclaw/agents/<name>/` | Agent-specific config |
| `~/.openclaw/agents/<name>/agent/` | Agent identity files |
| `~/.openclaw/skills/` | Globally installed skills |
