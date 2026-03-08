# OpenClaw Skill Package Standard — Sample Design

> **Design ID:** `openclaw-skill-package-standard-sample-2026-03-08`
> **Date:** 2026-03-08
> **Status:** Draft
> **Scope:** Demonstrate the upgraded OpenClaw skill-package design standard end-to-end using the existing design and review skill packages.
>
> **Constraint:** This is a design artifact. Do not implement until approved.

---

## 0. Environment Setup

No special setup required.

Validation commands used by the reviewer:
```bash
bash .agents/skills/openclaw-agent-design-review/scripts/check_design_evidence.sh projects/agent-design-review/openclaw-skill-package-standard-sample-2026-03-08/sample_design.md
bash .agents/skills/openclaw-agent-design-review/scripts/validate_paths.sh projects/agent-design-review/openclaw-skill-package-standard-sample-2026-03-08/path_inventory.txt
node --test .agents/skills/openclaw-agent-design-review/scripts/test/check_design_evidence.test.js .agents/skills/openclaw-agent-design-review/scripts/test/validate_paths.test.js
```

## 1. Design Deliverables

| Action | Path | Notes |
|--------|------|-------|
| UPDATE | `.agents/skills/openclaw-agent-design/SKILL.md` | Canonical package-design contract for OpenClaw agent work |
| UPDATE | `.agents/skills/openclaw-agent-design/reference.md` | Package templates, script-bearing rule, and `scripts/test/` exception |
| UPDATE | `.agents/skills/openclaw-agent-design-review/SKILL.md` | Reviewer contract for package completeness |
| UPDATE | `.agents/skills/openclaw-agent-design-review/reference.md` | Rubric and finding IDs for package-level review |
| UPDATE | `.agents/skills/openclaw-agent-design-review/scripts/check_design_evidence.sh` | Automated evidence checks for the new required sections |
| UPDATE | `.agents/skills/openclaw-agent-design-review/scripts/validate_paths.sh` | Path validation helper used by the review flow |
| UPDATE | `.agents/skills/openclaw-agent-design-review/scripts/test/check_design_evidence.test.js` | Test stub coverage for evidence checker |
| UPDATE | `.agents/skills/openclaw-agent-design-review/scripts/test/validate_paths.test.js` | Test stub coverage for path validator |
| UPDATE | `AGENTS.md` | No change required for this sample; current routing already points to these shared skills |

## 2. AGENTS.md Sync

- Skills Reference: no change required; `.agents/skills/openclaw-agent-design/` and `.agents/skills/openclaw-agent-design-review/` remain canonical shared skills.
- Workflow/Design Routing: no change required; the root contract already routes OpenClaw design work through designer → reviewer.
- Shared vs Local Rules: this sample keeps the reviewed capabilities in `.agents/skills/` because they are reused by multiple workspaces.
- Workspace-local comparison only: `workspace-planner/skills/feature-qa-planning-orchestrator/SKILL.md` remains workspace-local and is out of scope for this sample.

## 3. Skills Content Specification

### 3.1 `.agents/skills/openclaw-agent-design/SKILL.md`

Purpose:
- Define the canonical OpenClaw design-doc standard for new or materially redesigned skill packages.

When to trigger:
- Use when the user asks to design or redesign an OpenClaw skill, workflow, or agent-function refactor, especially when package structure, state-machine compatibility, reusable scripts, or reviewer gates must be specified explicitly.

Input contract:
- `design_request`: prose requirements for the workflow or skill package, source = user prompt or design brief.
- `existing_artifacts`: list of current skill files and docs, source = repository paths.
- `design_id`: string, example `openclaw-skill-package-standard-sample-2026-03-08`, source = design artifact metadata.

Output contract:
- A design markdown artifact with explicit sectioned requirements for `SKILL.md`, `reference.md`, package structure, scripts, tests, and reviewer handoff paths.

Workflow/phase responsibilities:
- Consult `clawddocs` and `agent-idempotency` first.
- Require `skill-creator` for new or materially redesigned skills.
- Require `code-structure-quality` for package boundaries.
- Define Phase 0 compatibility expectations.
- Hand off to `openclaw-agent-design-review` and stop on any `P0`/`P1` findings.

Error/ambiguity policy:
- Stop and ask when scope, placement, or compatibility expectations are ambiguous.
- Never assume destructive regeneration behavior.

Quality rules:
- Keep workflows skill-first.
- Preserve `REPORT_STATE`, `task.json`, and `run.json` semantics unless changes are additive and justified.
- Require package-local `scripts/test/` for script-bearing skills.

Classification:
- `shared`

Why this placement:
- The design contract is reused by multiple OpenClaw workspaces and reviewer flows.

Existing skills reused directly:
- `clawddocs` — current OpenClaw conventions and docs lookup.
- `agent-idempotency` — Phase 0 / resume semantics.
- `skill-creator` — trigger-writing and skill-package best practices.
- `code-structure-quality` — package-boundary and script-ownership rules.
- `openclaw-agent-design-review` — blocking gate before finalization.

### 3.2 `.agents/skills/openclaw-agent-design-review/SKILL.md`

Purpose:
- Review OpenClaw skill-package designs for contract completeness, package structure, script-bearing behavior, and reviewer-automation coverage.

When to trigger:
- Use for every OpenClaw design artifact before approval, especially when new scripts, reusable helpers, or package-level quality gates are part of the proposed design.

Input contract:
- `design_id`: string, source = design artifact header.
- `design_artifacts`: list of markdown and supporting files to review.
- `optional_output_dir`: path for report artifacts.

Output contract:
- `design_review_report.md`
- `design_review_report.json`
- final status `pass`, `pass_with_advisories`, or `fail`

Workflow/phase responsibilities:
- Collect artifacts.
- Run evidence and path checks.
- Classify script-bearing vs docs-only scope.
- Apply rubric from `reference.md`.
- Emit report artifacts with severity summary and required fixes.

Error/ambiguity policy:
- Fail if the design omits a required blocking section.
- Use `pass_with_advisories` only when all findings are `P2`.

Quality rules:
- Use the canonical OpenClaw design template.
- Enforce `scripts/test/` only for script-bearing designs.
- Reject hardcoded user-home paths in reviewed path inventories.

Classification:
- `shared`

Why this placement:
- The review gate is shared across OpenClaw design work in multiple workspaces.

Existing skills reused directly:
- `openclaw-agent-design` — direct reuse is sufficient for canonical design structure and templates.
- `clawddocs` — direct reuse is sufficient for validation of current conventions.

Direct reuse is sufficient for the shared dependencies above; no wrapper contract gap exists in this sample.

## 4. reference.md Content Specification

### 4.1 `.agents/skills/openclaw-agent-design/reference.md`

Must include:
- state machine / invariants for `REPORT_STATE`
- schemas or field-level contracts for `task.json` and `run.json`
- path conventions for shared vs workspace-local skills
- validation commands for evidence checks and test runs
- failure examples and recovery rules
- package-specific defaults and the `scripts/test/` exception

### 4.2 `.agents/skills/openclaw-agent-design-review/reference.md`

Must include:
- severity model and blocking semantics
- check matrix for package completeness and script-bearing rules
- explicit finding IDs for missing `SKILL.md`, `reference.md`, package structure, tests, and validation evidence
- JSON finding shape for report artifacts

## 5. Workflow Design

Entrypoint skill path: `.agents/skills/openclaw-agent-design/SKILL.md`

### Phase 0: Existing-State Check and Run Preparation

Actions:
1. Use the canonical `REPORT_STATE` table from `.agents/skills/openclaw-agent-design/reference.md`.
2. Preserve current `task.json` and `run.json` semantics by default.
3. Treat this sample as documentation-only review work; no destructive run mode is exercised.

User Interaction:
1. Done: sample design is drafted and validated.
2. Blocked: reviewer fails if any package section is missing.
3. Questions: none in this sample.
4. Assumption policy: do not infer missing reviewer sections; they must be written explicitly.

State Updates:
1. `task.json` / `run.json` remain design references only for this sample.

Verification:
```bash
bash .agents/skills/openclaw-agent-design-review/scripts/check_design_evidence.sh projects/agent-design-review/openclaw-skill-package-standard-sample-2026-03-08/sample_design.md
```

### Phase 1: Reviewer Automation Validation

Actions:
1. Run `check_design_evidence.sh` against this design artifact.
2. Run `validate_paths.sh` against the sample path inventory.
3. Run the reviewer script tests under `scripts/test/`.

User Interaction:
1. Done: reviewer artifacts show a passing sample.
2. Blocked: any missing section or invalid path fails the sample.
3. Questions: none in this sample.
4. Assumption policy: do not skip script-specific checks because this design is script-bearing.

State Updates:
1. Review outputs are written under `projects/agent-design-review/openclaw-skill-package-standard-sample-2026-03-08/`.

Verification:
```bash
bash .agents/skills/openclaw-agent-design-review/scripts/validate_paths.sh projects/agent-design-review/openclaw-skill-package-standard-sample-2026-03-08/path_inventory.txt
node --test .agents/skills/openclaw-agent-design-review/scripts/test/check_design_evidence.test.js .agents/skills/openclaw-agent-design-review/scripts/test/validate_paths.test.js
```

### Status Transition Map

| From | Event | To |
|------|-------|----|
| `draft` | evidence + path + test checks pass | `review_ready` |
| `review_ready` | report artifacts written | `pass` |
| any | blocking review finding | `fail` |

## 6. State Schemas

### `task.json`

Path: not applicable for this sample artifact; referenced canonically from `.agents/skills/openclaw-agent-design/reference.md`

Fields:
- `run_key`: string
- `overall_status`: string
- `current_phase`: string
- `created_at`: ISO8601
- `updated_at`: ISO8601
- `phases`: object

Write rule:
- Preserve current semantics by default.

### `run.json`

Path: not applicable for this sample artifact; referenced canonically from `.agents/skills/openclaw-agent-design/reference.md`

Fields:
- `data_fetched_at`: ISO8601 or null
- `output_generated_at`: ISO8601 or null
- `notification_pending`: string or null
- `updated_at`: ISO8601

Write rule:
- Preserve current semantics by default.

## 7. Implementation Layers

- `.agents/skills/openclaw-agent-design/`
- `.agents/skills/openclaw-agent-design/reference.md`
- `.agents/skills/openclaw-agent-design-review/`
- `.agents/skills/openclaw-agent-design-review/scripts/`
- `.agents/skills/openclaw-agent-design-review/scripts/test/`

Standards Exception Note:
- OpenClaw skill-package designs use `scripts/test/` as a domain-specific exception instead of a top-level `tests/` folder.

## 8. Script Inventory and Function Specifications

### 8.1 `.agents/skills/openclaw-agent-design-review/scripts/check_design_evidence.sh`

Invocation:
- `bash .agents/skills/openclaw-agent-design-review/scripts/check_design_evidence.sh <design-markdown-file>`

Inputs / outputs / artifacts:
- input design markdown path
- stdout check summary
- exit status `0` on success, `1` on missing required sections, `2` on usage/file errors

| function | responsibility | inputs | outputs | side effects | failure mode |
|----------|----------------|--------|---------|--------------|--------------|
| `usage` | Print CLI usage for invalid invocation | argv | stderr usage text | none | exits 2 |
| `require_design_file` | Validate argument count and file existence | argv, file path | exported `DESIGN_FILE` | reads filesystem | exits 2 on missing input |
| `check_required_pattern` | Evaluate a required regex gate | regex, message | stdout status line | reads design file | increments failure counter |
| `has_script_deliverables` | Detect script-bearing designs from explicit package paths | design markdown | shell status | none | false negative if paths are omitted |
| `has_script_inventory_entries` | Detect script-bearing designs from inventory/table content | design markdown | shell status | none | false negative if inventory is absent |
| `is_script_bearing_design` | Combine the script-bearing heuristics | design markdown | shell status | none | inherits detection limits |
| `check_common_sections` | Validate required design sections and shared rules | design markdown | stdout status lines | none | increments failure counter |
| `check_script_specific_sections` | Validate script-bearing-only sections and evidence | design markdown | stdout status lines | none | increments failure counter |
| `main` | Orchestrate validation and exit with summary | argv | stdout/stderr, exit code | reads design file | exits 1 on failures |

### 8.2 `.agents/skills/openclaw-agent-design-review/scripts/validate_paths.sh`

Invocation:
- `bash .agents/skills/openclaw-agent-design-review/scripts/validate_paths.sh <path-list-file> [repo-root]`

Inputs / outputs / artifacts:
- path-list file
- optional repo-root override
- stdout path validation summary
- exit status `0` on success, `1` on failed checks, `2` on usage/input errors

| function | responsibility | inputs | outputs | side effects | failure mode |
|----------|----------------|--------|---------|--------------|--------------|
| `usage` | Print CLI usage for invalid invocation | argv | stderr usage text | none | exits 2 |
| `trim` | Remove leading/trailing whitespace | raw string | trimmed string | none | none |
| `require_inputs` | Validate CLI arguments and required files | argv | exported path variables | reads filesystem | exits 2 on missing inputs |
| `normalize_line` | Strip comments, markdown link wrappers, and backticks | raw path entry | normalized path entry | none | none |
| `validate_entry` | Validate a single path or URL | raw line, normalized line | stdout status line | reads filesystem | increments failure counter |
| `main` | Iterate entries and emit summary | argv | stdout/stderr, exit code | reads path list | exits 1 on failures |

## 9. Script Test Stub Matrix

| Script Path | Test Stub Path | Scenarios | Smoke Command |
|-------------|----------------|-----------|---------------|
| `.agents/skills/openclaw-agent-design-review/scripts/check_design_evidence.sh` | `.agents/skills/openclaw-agent-design-review/scripts/test/check_design_evidence.test.js` | script-bearing pass; missing script test matrix failure; docs-only exemption; usage error | `node --test .agents/skills/openclaw-agent-design-review/scripts/test/check_design_evidence.test.js` |
| `.agents/skills/openclaw-agent-design-review/scripts/validate_paths.sh` | `.agents/skills/openclaw-agent-design-review/scripts/test/validate_paths.test.js` | markdown-link success; URL skip; unresolved placeholder failure; hardcoded home-path failure; usage error | `node --test .agents/skills/openclaw-agent-design-review/scripts/test/validate_paths.test.js` |

## 10. Files To Create / Update

- `.agents/skills/openclaw-agent-design/SKILL.md`
- `.agents/skills/openclaw-agent-design/reference.md`
- `.agents/skills/openclaw-agent-design-review/SKILL.md`
- `.agents/skills/openclaw-agent-design-review/reference.md`
- `.agents/skills/openclaw-agent-design-review/scripts/check_design_evidence.sh`
- `.agents/skills/openclaw-agent-design-review/scripts/validate_paths.sh`
- `.agents/skills/openclaw-agent-design-review/scripts/test/check_design_evidence.test.js`
- `.agents/skills/openclaw-agent-design-review/scripts/test/validate_paths.test.js`
- `projects/agent-design-review/openclaw-skill-package-standard-sample-2026-03-08/sample_design.md`
- `projects/agent-design-review/openclaw-skill-package-standard-sample-2026-03-08/path_inventory.txt`
- `projects/agent-design-review/openclaw-skill-package-standard-sample-2026-03-08/design_review_report.md`
- `projects/agent-design-review/openclaw-skill-package-standard-sample-2026-03-08/design_review_report.json`

## 11. README Impact

- `README.md`: not applicable
- Reason: this sample exercises internal skill-design standards only.

## 12. Backfill Coverage Table

| Script Path | Test Stub Path | Failure-Path Stub |
|-------------|----------------|-------------------|
| `.agents/skills/openclaw-agent-design-review/scripts/check_design_evidence.sh` | `.agents/skills/openclaw-agent-design-review/scripts/test/check_design_evidence.test.js` | script-bearing design missing `Script Test Stub Matrix` |
| `.agents/skills/openclaw-agent-design-review/scripts/validate_paths.sh` | `.agents/skills/openclaw-agent-design-review/scripts/test/validate_paths.test.js` | unresolved placeholder path / hardcoded `/Users/...` path |

## 13. Quality Gates

- [x] Design defines workflow entrypoints as skills, not only prose or scripts.
- [x] Shared vs workspace-local placement is explicit and justified.
- [x] `.agents/skills/` is treated as canonical for shared skills.
- [x] Existing `REPORT_STATE` / Phase 0 behavior is preserved.
- [x] Existing `task.json` / `run.json` semantics are preserved unless additive changes are justified.
- [x] `skill-creator` is required for new or materially redesigned skills.
- [x] `code-structure-quality` is applied to placement and boundary design.
- [x] Existing shared skills `jira-cli`, `confluence`, and `feishu-notify` are reused directly by default.
- [x] Every created or redesigned skill has explicit `SKILL.md` content requirements.
- [x] Every created or redesigned skill has explicit `reference.md` content requirements.
- [x] Every script-bearing skill includes package structure, script inventory, and function-level details.
- [x] Every script-bearing skill includes one-to-one script test-stub mapping under `scripts/test/`.
- [x] Docs-only skills are not forced to carry script-test sections.
- [x] AGENTS.md sync is explicit.
- [x] README impact is explicitly addressed.
- [x] Reviewer report artifacts are explicit.

## 14. References

- `.agents/skills/openclaw-agent-design/SKILL.md`
- `.agents/skills/openclaw-agent-design/reference.md`
- `.agents/skills/openclaw-agent-design-review/SKILL.md`
- `.agents/skills/openclaw-agent-design-review/reference.md`
- `workspace-daily/docs/RCA_DAILY_SKILL_REFACTOR_DESIGN.md`
- `workspace-planner/skills/feature-qa-planning-orchestrator/SKILL.md`
