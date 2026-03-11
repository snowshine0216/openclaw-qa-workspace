---
name: openclaw-agent-design-review
description: Reviews OpenClaw agent and workflow designs for skill-first package architecture, canonical shared-vs-local placement, Phase 0 state-machine non-regression, direct reuse of existing shared skills, detailed SKILL.md/reference.md content contracts, script inventory plus test-stub completeness, and reviewer automation coverage. Emits blocking pass/fail review artifacts aligned with `.agents/skills/openclaw-agent-design/SKILL.md`.
---

# OpenClaw Agent Design Review

## Purpose

Provide the mandatory quality gate for OpenClaw design outputs before they are finalized.

This skill checks:
1. Canonical design-doc structure and output contract.
2. Shared-vs-local skill placement, placement justification, and path validity.
3. Skill-first workflow definition rather than script-first design.
4. Preservation of the current Phase 0 / `REPORT_STATE` model and `task.json` / `run.json` semantics unless additive changes are justified.
5. Direct reuse of existing shared skills such as `jira-cli`, `confluence`, and `feishu-notify` when they fit, or explicit contract-gap justification when wrappers are introduced.
6. Detailed `SKILL.md` and `reference.md` content specifications for every created or redesigned skill.
7. Script-bearing package completeness: package tree, script inventory, function details, test-stub mapping, and validation evidence.
8. Documentation completeness, reviewer artifacts, AGENTS.md sync coverage, and README impact.

## When To Use

- Reviewing a newly drafted OpenClaw agent or workflow design.
- Reviewing an existing-agent function redesign into skills.
- Reviewing updates to AGENTS.md, skill contracts, workflow contracts, or helper-script design.

## Mandatory Dependencies

Before final judgment:
- invoke `clawddocs` to confirm OpenClaw conventions,
- use `.agents/skills/openclaw-agent-design/SKILL.md` as the canonical design template,
- use `.agents/skills/openclaw-agent-design/reference.md` as the canonical `REPORT_STATE`, package-structure, and `scripts/test/` exception reference.

## Inputs

Required:
- `design_id`
- list of design artifacts to review

Optional:
- custom report output directory

## Review Process

1. **Collect artifacts** — confirm all target files exist and identify the primary design markdown.
2. **Check canonical template compliance** — verify the required sections from `.agents/skills/openclaw-agent-design/SKILL.md`.
3. **Run evidence checks** — use `scripts/check_design_evidence.sh` on the main design markdown.
4. **Run path checks** — use `scripts/validate_paths.sh` on the extracted path inventory when the design includes concrete artifact paths.
5. **Apply manual quality rubric** — use `reference.md` to classify findings and check placement, reuse, state-machine preservation, script-bearing/docs-only classification, and package completeness.
6. **Emit review report** — write both markdown and JSON outputs.

## Reviewer Output Contract

Required outputs:
- `projects/agent-design-review/<design_id>/design_review_report.md`
- `projects/agent-design-review/<design_id>/design_review_report.json`
- final status: `pass` | `pass_with_advisories` | `fail`

Required report fields:
- reviewed skill package paths
- script-bearing vs docs-only classification
- script-to-test coverage summary
- explicit pass/fail on the `scripts/test/` convention
- findings array with IDs, severity, evidence, and recommended fix

## Quality Gates

- [ ] Design doc follows the canonical template from `.agents/skills/openclaw-agent-design/SKILL.md`.
- [ ] Workflow entrypoints are modeled as skills, not only prose or script bundles.
- [ ] Shared capabilities are placed in `.agents/skills/` and workspace-specific capabilities in `<workspace>/skills/` unless explicitly justified.
- [ ] Existing `REPORT_STATE` / Phase 0 behavior is preserved.
- [ ] Existing `task.json` / `run.json` semantics are preserved unless additive changes are justified in both the design doc and review artifacts.
- [ ] `skill-creator` is required for new or materially redesigned skills.
- [ ] `code-structure-quality` is required for skill boundary and ownership design.
- [ ] Existing shared skills `jira-cli`, `confluence`, and `feishu-notify` are reused directly when they fit.
- [ ] Every created or redesigned skill has explicit `SKILL.md` content requirements (skill-SKILL.md detailed subsection).
- [ ] Every created or redesigned skill has explicit `reference.md` content requirements (skill-reference.md detailed subsection).
- [ ] Design includes `## Data Models` when state or artifact schemas exist.
- [ ] Design includes `## Functions in Scripts` with function inventory and functional design when script-bearing.
- [ ] Contract-heavy skills include `evals/evals.json` when behavioral validation is expected.
- [ ] Script-bearing skills include package structure, script inventory, function-level details, and one-to-one test-stub mapping under `scripts/test/`.
- [ ] Docs-only skills are not failed for omitting script-test sections.
- [ ] Script changes include executable validation evidence when non-trivial.
- [ ] AGENTS.md sync is explicitly listed.
- [ ] README impact is explicitly addressed.
- [ ] Output/handoff artifact paths and review artifacts are explicit.

## Additional Resources

- Detailed rubric: [reference.md](reference.md)
- Path checker: `scripts/validate_paths.sh`
- Evidence checker: `scripts/check_design_evidence.sh`
- Canonical design template: `.agents/skills/openclaw-agent-design/SKILL.md`
