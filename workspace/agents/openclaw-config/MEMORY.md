# MEMORY.md - OpenClaw Config Agent Long-Term Memory

_Configuration knowledge and lessons learned._

## Common Config Patterns

### Multi-Agent Setup
- Shared workspace: multiple agents, same workspace path
- Per-agent SOUL.md: `agents/<id>/SOUL.md`
- Per-agent AGENTS.md: `agents/<id>/AGENTS.md`
- Per-agent state: `~/.openclaw/agents/<id>/agent`

### Routing Best Practices
- Most specific bindings first (peer → guild → account → channel)
- Default agent via `default: true` or first in list
- Test routing with: `openclaw agents list --bindings`

## Useful Documentation Paths

- Multi-agent: `/concepts/multi-agent.md`
- Agent workspace: `/concepts/agent-workspace.md`
- Configuration: `/gateway/configuration`
- Sandbox: `/tools/sandbox`
- Channel routing: `/channels/channel-routing`

## Lessons Learned

*(To be filled as you solve config issues)*

## Config Backup Strategy

- Before changes: `cp ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.backup-$(date +%Y%m%d-%H%M%S)`
- Keep last 5 backups, delete older
- Document what each backup was for

---

*Last updated: 2026-02-23*
