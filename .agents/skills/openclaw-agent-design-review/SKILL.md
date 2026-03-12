---
name: openclaw-agent-design-review
description: Reviews OpenClaw agent and workflow designs for skill-first package architecture, canonical shared-vs-local placement, Phase 0 state-machine non-regression, direct reuse of existing shared skills, detailed SKILL.md/reference.md content contracts, script inventory plus test-stub completeness, and reviewer automation coverage. Emits blocking pass/fail review artifacts aligned with `.agents/skills/openclaw-agent-design/SKILL.md`.
---

# OpenClaw Agent Design Review

## Purpose

Mandatory quality gate for OpenClaw design outputs before finalization. Checks: canonical template (Overview, Architecture, Skills Content Spec, Functional Design, Tests, Evals when applicable, Documentation Changes, Implementation Checklist, References), shared-vs-local placement, skill-first workflow, Phase 0 / `REPORT_STATE` preservation, direct reuse of `jira-cli`/`confluence`/`feishu-notify`/`github`, `SKILL.md`/`reference.md` specs, script-bearing completeness, and documentation coverage.

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

- [ ] Design doc follows the canonical template (Overview, Architecture, Skills Content Spec, Functional Design, Tests, Evals when applicable, Documentation Changes, Implementation Checklist, References).
- [ ] Workflow entrypoints are modeled as skills, not prose or script bundles.
- [ ] Shared capabilities in `.agents/skills/`, workspace-specific in `<workspace>/skills/` unless justified.
- [ ] Phase 0 / `REPORT_STATE` and `task.json` / `run.json` semantics preserved (additive changes justified).
- [ ] `skill-creator` and `code-structure-quality` required for new or redesigned skills.
- [ ] Direct reuse of `jira-cli`, `confluence`, `feishu-notify`, `github` when they fit.
- [ ] Every created or redesigned skill has explicit `SKILL.md` and `reference.md` content specs.
- [ ] Script-bearing skills: package structure, Functions, Tests (script-to-test mapping under `scripts/test/`).
- [ ] Evals section present when design creates or materially redesigns skills. Skill evals in `evals/` (skill-creator compatible).
- [ ] Docs-only skills not failed for omitting script-test sections.
- [ ] AGENTS.md and README impact explicit under Documentation Changes.
- [ ] Output/handoff artifact paths and review artifacts explicit.
- [ ] When design uses jira-cli, github, or confluence in Phase 0: env check and runtime_setup_*.json output must be specified.
- [ ] Script-bearing designs with runtime output: runs/<run-key>/ structure must be explicit.
- [ ] Final workflow includes Feishu send and notification_pending fallback when publishing externally visible work.

## Additional Resources

- Detailed rubric: [reference.md](reference.md)
- Path checker: `scripts/validate_paths.sh`
- Evidence checker: `scripts/check_design_evidence.sh`
- Canonical design template: `.agents/skills/openclaw-agent-design/SKILL.md`
