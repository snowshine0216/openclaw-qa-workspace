# MEMORY.md - OpenClaw Config Agent Long-Term Memory

_Configuration knowledge and lessons learned._

## Common Config Patterns

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

- Snow preference: when I update shared skills that exist in both the workspace and `~/.agents`, sync both copies by default, but record this convention only in memory unless explicitly asked to document it elsewhere.

## Config Backup Strategy

- Before changes: `cp ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.backup-$(date +%Y%m%d-%H%M%S)`
- Keep last 5 backups, delete older
- Document what each backup was for

---

*Last updated: 2026-02-23*
