---
name: openclaw-agent-design-review
description: Reviews OpenClaw agent/workflow designs for skill-first architecture, canonical shared-vs-local skill placement, Phase 0 state-machine non-regression, direct reuse of existing shared skills, and documentation completeness. Emits blocking pass/fail review artifacts aligned with the canonical template in `.agents/skills/openclaw-agent-design/SKILL.md`.
---

# OpenClaw Agent Design Review

## Purpose

Provide a mandatory quality gate for OpenClaw design outputs before they are finalized.

This skill checks:
1. Canonical design-doc structure and output contract.
2. Shared-vs-local skill placement, placement justification, and path validity.
3. Skill-first workflow definition rather than script-first design.
4. Preservation of the current Phase 0 / `REPORT_STATE` model and `task.json` / `run.json` semantics unless additive changes are justified.
5. Direct reuse of existing shared skills such as `jira-cli`, `confluence`, and `feishu-notify` when they fit, or explicit contract-gap justification when wrappers are introduced.
6. Documentation completeness, reviewer artifacts, and AGENTS.md sync coverage.

## When To Use

- Reviewing a newly drafted OpenClaw agent or workflow design.
- Reviewing an existing-agent function redesign into skills.
- Reviewing updates to AGENTS.md, skill contracts, workflow contracts, or helper-script design.

## Mandatory Dependencies

Before final judgment:
- invoke `clawddocs` to confirm OpenClaw conventions,
- use `.agents/skills/openclaw-agent-design/SKILL.md` as the canonical design template,
- use `.agents/skills/openclaw-agent-design/reference.md` as the canonical `REPORT_STATE` and state-schema reference.

## Inputs

Required:
- `design_id`
- list of design artifacts to review

Optional:
- custom report output directory

## Review Process

1. **Collect artifacts** — confirm all target files exist and identify the primary design markdown.
2. **Check canonical template compliance** — verify the design follows the structure from `.agents/skills/openclaw-agent-design/SKILL.md`.
3. **Run path checks** — use `scripts/validate_paths.sh` for existence and path anti-pattern checks.
4. **Run evidence checks** — use `scripts/check_design_evidence.sh` on the main design markdown.
5. **Apply manual quality rubric** — use `reference.md` to classify findings and check placement, reuse, and state-machine preservation.
6. **Emit review report** — write both markdown and JSON outputs.

## Output Contract

Default output path:
- `projects/agent-design-review/<design_id>/design_review_report.md`
- `projects/agent-design-review/<design_id>/design_review_report.json`

`overall_status` rule:
- `fail` — any `P0` or `P1` finding
- `pass_with_advisories` — only `P2` findings
- `pass` — no findings

## Quality Gates

- [ ] Design doc follows the canonical template from `.agents/skills/openclaw-agent-design/SKILL.md`.
- [ ] Workflow entrypoints are modeled as skills, not only prose or script bundles.
- [ ] Shared capabilities are placed in `.agents/skills/` and workspace-specific capabilities in `<workspace>/skills/` unless explicitly justified.
- [ ] Existing `REPORT_STATE` / Phase 0 behavior is preserved.
- [ ] Existing `task.json` / `run.json` semantics are preserved unless additive changes are justified in both the design doc and review artifacts.
- [ ] `skill-creator` is required for new or materially redesigned skills.
- [ ] `code-structure-quality` is required for skill boundary and ownership design.
- [ ] Existing shared skills `jira-cli`, `confluence`, and `feishu-notify` are reused directly when they fit.
- [ ] Script changes include test, smoke, or validation evidence when non-trivial.
- [ ] AGENTS.md sync is explicitly listed.
- [ ] README impact is explicitly addressed.
- [ ] Output/handoff artifact paths and review artifacts are explicit.

## Additional Resources

- Detailed rubric: [reference.md](reference.md)
- Path checker: `scripts/validate_paths.sh`
- Evidence checker: `scripts/check_design_evidence.sh`
- Canonical design template: `.agents/skills/openclaw-agent-design/SKILL.md`
