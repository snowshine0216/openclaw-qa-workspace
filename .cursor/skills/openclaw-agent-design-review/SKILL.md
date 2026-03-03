---
name: openclaw-agent-design-review
description: Reviews OpenClaw agent/workflow designs for path validity, test-evidence coverage, and documentation completeness. Uses clawddocs conventions and emits a blocking pass/fail report with P0/P1/P2 findings.
---

# OpenClaw Agent Design Review

## Purpose

Provide a mandatory quality gate for OpenClaw agent design outputs before they are finalized.

This skill checks:
1. Path validity and OpenClaw pathing best practices.
2. Test evidence for newly introduced scripts and workflows.
3. Documentation completeness, including explicit user-facing README mention.
4. Per-phase user interaction contract (Done / Blocked / Questions + no silent assumptions).
5. Final workflow notification contract (Feishu send + notification_pending fallback + verification command).
6. Additional design hygiene (idempotency, confirmation gates, explicit handoffs).

## When To Use

Use this skill when:
- Reviewing a newly drafted OpenClaw agent/workflow design.
- Updating AGENTS/workflow/skill contracts.
- Finalizing a design that introduces scripts, output artifacts, or orchestration steps.

## Mandatory Dependencies

Before final judgment:
- Invoke `clawddocs` to confirm OpenClaw conventions.

## Inputs

Required:
- `design_id`
- list of design artifacts to review

Optional:
- custom report output directory

## Review Process

1. **Collect artifacts**
   - Confirm all target files exist.
   - Build a candidate list of referenced paths found in the design docs.
2. **Run path checks**
   - Use `scripts/validate_paths.sh` for explicit path existence and anti-pattern checks.
3. **Run evidence checks**
   - Use `scripts/check_design_evidence.sh` on the main design markdown.
4. **Apply manual quality rubric**
   - Use the matrix in `reference.md` to classify findings.
5. **Emit review report**
   - Write both markdown and JSON outputs.
   - Include required fixes and advisory suggestions.

## Output Contract

Default output path:
- `projects/agent-design-review/<design_id>/design_review_report.md`
- `projects/agent-design-review/<design_id>/design_review_report.json`

`overall_status` rule:
- `fail` if any `P0` or `P1` finding exists.
- `pass_with_advisories` if only `P2` findings exist.
- `pass` if no findings.

## Quality Gates

- [ ] All required paths are explicit, resolvable, and convention-aligned.
- [ ] No unsupported implicit discovery assumptions in pathing claims.
- [ ] New scripts/workflows include test or smoke evidence.
- [ ] Every workflow phase includes Done/Blocked/Questions user interaction details.
- [ ] Design explicitly requires asking user questions when context is ambiguous.
- [ ] Final workflow includes Feishu send and `run.json.notification_pending` fallback.
- [ ] Notification fallback verification command is present.
- [ ] Documentation updates are explicitly listed.
- [ ] User-facing README impact is explicitly mentioned.
- [ ] Output/handoff artifacts and paths are explicit.

## Additional Resources

- Detailed rubric: [reference.md](reference.md)
- Sample reports: [examples.md](examples.md)
- Path checker: `scripts/validate_paths.sh`
- Evidence checker: `scripts/check_design_evidence.sh`
