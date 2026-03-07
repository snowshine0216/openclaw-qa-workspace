# MEMORY.md - Agent Development & Configuration Long-Term Memory

_Knowledge accumulated about agents, skills, code patterns, and configurations._

## Agent Design Patterns

*(To be filled as you design agents)*

### Workspace Structure Best Practices
- Always include: SOUL.md, AGENTS.md, IDENTITY.md, USER.md, TOOLS.md, MEMORY.md
- Create memory/ directory for daily logs
- Use skills/ for agent-specific skills

## Skills Creation Patterns

*(To be filled as you create skills)*

### Skill Triggers
- Be specific about when skill activates
- Include both positive (use when) and negative (do NOT use for) examples

### Skill Workflows
- Break into clear phases
- Document tools needed at each phase
- Include validation steps

## Code Quality Patterns

*(To be filled as you review code)*

### TDD Workflow
- Write test first, see it fail
- Implement minimal code to pass
- Refactor while tests stay green
- Coverage target: ≥80%

### Code Structure
- Functions ≤20 lines (document exceptions)
- Clear separation: pure logic vs side effects
- DRY principle applied
- Modular boundaries

## Configuration Patterns

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

*Last updated: 2026-03-07*
