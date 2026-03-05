---
name: openclaw-agent-design-review
description: Reviews OpenClaw agent/workflow designs for path validity, test-evidence coverage, and documentation completeness. Uses clawddocs conventions. Emits a blocking pass/fail report with P0/P1/P2 findings. Validates that the design doc follows the canonical template from openclaw-agent-design SKILL.md.
---

# OpenClaw Agent Design Review

## Purpose

Provide a mandatory quality gate for OpenClaw agent design outputs before they are finalized.

This skill checks:
1. Design doc structure — canonical template sections present (Environment Setup, Deliverables table, AGENTS.md sync, Skills, Workflow, State Schemas, Scripts, Files To Create/Update, README Impact, Quality Gates).
2. Path validity and OpenClaw pathing best practices.
3. Test evidence for newly introduced scripts and workflows.
4. Per-phase user interaction contract (Done / Blocked / Questions / Assumption policy).
5. Final workflow notification contract (Feishu send + `notification_pending` fallback + verification command).
6. Design hygiene (idempotency, confirmation gates, explicit handoffs).

## When To Use

- Reviewing a newly drafted OpenClaw agent/workflow design.
- Updating AGENTS.md, workflow, or skill contracts.
- Finalizing a design that introduces scripts, output artifacts, or orchestration steps.

## Mandatory Dependencies

Before final judgment: invoke `clawddocs` to confirm OpenClaw conventions.

## Inputs

Required:
- `design_id`
- list of design artifacts to review

Optional:
- custom report output directory

## Review Process

1. **Collect artifacts** — confirm all target files exist; build candidate list of referenced paths.
2. **Check design doc template compliance** — verify all canonical sections are present.
3. **Run path checks** — use `scripts/validate_paths.sh` for path existence and anti-pattern checks.
4. **Run evidence checks** — use `scripts/check_design_evidence.sh` on the main design markdown.
5. **Apply manual quality rubric** — use the matrix in `reference.md` to classify findings.
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

- [ ] Design doc follows canonical template (Environment Setup → Deliverables → AGENTS.md Sync → Skills → Workflow → State Schemas → Scripts → Files To Create/Update → README Impact → Quality Gates → References).
- [ ] All required paths are explicit, resolvable, and convention-aligned.
- [ ] No unsupported implicit discovery assumptions in pathing claims.
- [ ] New scripts/workflows include test or smoke evidence.
- [ ] Every workflow phase includes Done / Blocked / Questions / Assumption policy.
- [ ] Design explicitly requires asking user questions when context is ambiguous.
- [ ] Final workflow includes Feishu send and `notification_pending` fallback.
- [ ] Notification fallback verification command is present.
- [ ] Deliverables table complete with action (CREATE/UPDATE/DELETE) and path.
- [ ] AGENTS.md sync explicitly listed.
- [ ] README impact explicitly addressed.
- [ ] Output/handoff artifacts and paths are explicit.

## Additional Resources

- Detailed rubric: [reference.md](reference.md)
- Sample reports: [examples.md](examples.md)
- Path checker: `scripts/validate_paths.sh`
- Evidence checker: `scripts/check_design_evidence.sh`
- Canonical design template: `workspace-planner/skills/openclaw-agent-design/SKILL.md`
