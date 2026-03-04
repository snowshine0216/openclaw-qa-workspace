---
name: openclaw-agent-design-review
description: Wrapper skill that delegates to .cursor/skills/openclaw-agent-design-review for OpenClaw design quality-gate review.
---

# OpenClaw Agent Design Review (Wrapper)

When invoked, follow the full workflow and quality standards defined in:
- `.cursor/skills/openclaw-agent-design-review/SKILL.md`
- `.cursor/agents/openclaw-agent-design-reviewer.md`

Execution rules:
- Treat those files as canonical.
- Produce both markdown and json review report artifacts.
