---
name: openclaw-agent-design
description: Designs OpenClaw agents and agent-function refactors as skill-first packages with preserved Phase 0 state-machine behavior, shared-vs-local skill placement, detailed SKILL.md/reference.md contracts, script inventory plus test-stub requirements, and mandatory reviewer gates. Must consult clawddocs, apply agent-idempotency, use skill-creator for new or materially redesigned skills, use code-structure-quality for skill boundaries, and invoke openclaw-agent-design-review before finalizing.
---

# OpenClaw Agent Design

## Purpose

Use this skill to design or redesign OpenClaw workflows as complete skill packages.

The output is a design artifact, not implementation. Designs must be decision-complete enough that an implementer does not have to guess:
- what each skill package contains,
- what `SKILL.md` and `reference.md` must say,
- which scripts exist and what each function does,
- where tests live for script-bearing skills,
- how Phase 0 / `REPORT_STATE` compatibility is preserved.

## 0. Design Process (Mandatory Steps)

Run these steps in order before finalizing any design doc:

1. **Consult `clawddocs`** — confirm current OpenClaw architecture, workspace conventions, and integration expectations.
2. **Invoke `agent-idempotency`** — preserve the current Phase 0 / `REPORT_STATE` model, resume behavior, archive-before-overwrite policy, and `task.json` / `run.json` compatibility.
3. **Use `skill-creator` for each new or materially redesigned skill** — shared and workspace-local skills both require this step. Use `skill-creator` best practices for trigger wording, input/output contracts, resource layout, and examples.
4. **Use `code-structure-quality`** — enforce clean ownership boundaries, direct reuse, and side-effect separation in the design.
5. **Invoke `openclaw-agent-design-review`** — resolve all P0/P1 findings before final output.

## 1. Design Doc Template

Every design output must follow this structure. Sections 8, 9, and 12 are mandatory only for script-bearing skills.

```markdown
# <Agent Name> — Agent Design

> **Design ID:** `<id>`
> **Date:** YYYY-MM-DD
> **Status:** Draft
> **Scope:** <one-line scope>
>
> **Constraint:** This is a design artifact. Do not implement until approved.

---

## 0. Environment Setup

## 1. Design Deliverables

## 2. AGENTS.md Sync

## 3. Skills Content Specification

## 4. reference.md Content Specification

## 5. Workflow Design

## 6. State Schemas

## 7. Implementation Layers

## 8. Script Inventory and Function Specifications

## 9. Script Test Stub Matrix

## 10. Files To Create / Update

## 11. README Impact

## 12. Backfill Coverage Table

## 13. Quality Gates

## 14. References
```

## 2. Key Rules

### Skill-First Default

All workflow designs should be expressed as skill entrypoints first. NLG phases and shell/Node helpers are supporting mechanisms inside the skill contract.

### Preserve Existing State-Machine Semantics

Start every output-writing workflow with the current Phase 0 existing-status check.

- Use `.agents/skills/openclaw-agent-design/reference.md` as the canonical `REPORT_STATE` source.
- Preserve existing `task.json` / `run.json` semantics by default.
- Any schema change must be additive, backward-compatible, and justified in both the design doc and reviewer report.

### Script-Bearing Skill Rule

A skill is **script-bearing** if either of these is true:
- the deliverables include `scripts/` under the skill package, or
- the Script Inventory contains one or more scripts.

Docs-only skills are exempt from the script-specific test-stub requirements.

### OpenClaw Test Layout Exception

For OpenClaw skill-package design work, `scripts/test/` is the canonical location for script tests. This is a domain-specific exception that overrides the generic top-level `tests/` preference from `code-quality-orchestrator` for these skill packages.

### Never Assume

In every workflow phase:
- If key context is missing or ambiguous, stop and ask.
- Never silently choose a destructive path.
- Record assumption policy explicitly in the design doc.

### Shared Skill Reuse

Before creating a new skill, check whether direct reuse is sufficient:
- `jira-cli`
- `confluence`
- `feishu-notify`

### Final Notification

If the workflow publishes, updates, or completes externally visible work, include a final notification phase and define fallback persistence in `run.json.notification_pending` when applicable.

## 3. Skills Content Specification

For each created or materially redesigned skill, specify the exact content expected in `SKILL.md`.

### Required subsection per skill

```markdown
### 3.x `<skill-path>/SKILL.md`

Purpose:
- <what the skill does>

When to trigger:
- <use `skill-creator` style trigger wording; include contexts, not just exact commands>

Input contract:
- `<field>`: <type>, example `<example>`, source <where it comes from>

Output contract:
- <artifact, status line, handoff payload, or side effect>

Workflow/phase responsibilities:
- <what the skill does in order>

Error/ambiguity policy:
- <when it must stop, ask, retry, or persist recovery state>

Quality rules:
- <format, idempotency, naming, or coverage expectations>

Classification:
- `shared` | `workspace-local`

Why this placement:
- <why `.agents/skills/` or `<workspace>/skills/` is correct>

Existing skills reused directly:
- `<skill-name>` — <why direct reuse is sufficient>
```

## 4. `reference.md` Content Specification

For each created or materially redesigned skill, specify what belongs in `reference.md`.

### Required subsection per skill

```markdown
### 4.x `<skill-path>/reference.md`

Must include:
- state machine / invariants
- schemas or field-level contracts
- path conventions
- validation commands
- failure examples and recovery rules
- package-specific exceptions or defaults
```

## 5. Workflow Design

Default: workflows are defined as skill entrypoints that may use NLG phases and internal shell/Node helpers. Shell scripts are implementation details under a skill package; they do not replace the skill abstraction.

Entrypoint skill path: `.agents/skills/<entrypoint-skill>/SKILL.md`

### Phase 0: Existing-State Check and Run Preparation

Actions:
1. Run the current Phase 0 existing-status check using the canonical `REPORT_STATE` model from `.agents/skills/openclaw-agent-design/reference.md`.
2. Present options by state (`FINAL_EXISTS`, `DRAFT_EXISTS`, `CONTEXT_ONLY`, `FRESH`).
3. Archive prior output if overwrite/regenerate is selected.
4. Initialize or update `task.json` and `run.json` without breaking existing semantics.

User Interaction:
1. Done: existing status classified and options presented.
2. Blocked: waiting for user choice when prior artifacts exist.
3. Questions: choose the option appropriate to the current state.
4. Assumption policy: never auto-pick a destructive option. Stop and ask if intent is ambiguous.

State Updates:
1. Preserve current `REPORT_STATE` handling.
2. Keep `task.json` / `run.json` changes additive and backward-compatible.
3. Update `updated_at` on every write.

Verification:
```bash
<skill-root>/scripts/check_resume.sh <key>
jq -r '.overall_status,.current_phase' projects/<type>/<key>/task.json
```

### Phase N: <Phase Name>

Actions:
1. <step>

User Interaction:
1. Done: <completed items>
2. Blocked: <blockers>
3. Questions: <open questions>
4. Assumption policy: if any key detail is unclear, stop and ask before continuing.

State Updates:
1. `task.json.current_phase = "phase_N_<name>"`

Verification:
```bash
# phase-specific verification command
```

### Status Transition Map

| From | Event | To |
|------|-------|----|
| `<status>` | <event> | `<status>` |
| any | unrecoverable error | `failed` |

## 6. State Schemas

### `task.json`

Path: `<skill-root>/scripts/task.json`

Fields:
- `run_key`: string
- `overall_status`: string
- `current_phase`: string
- `created_at`: ISO8601
- `updated_at`: ISO8601
- `phases`: object

Write rule: preserve current semantics by default, update `updated_at` on every write, and use additive schema changes only when justified in the design doc and reviewer report.

### `run.json`

Path: `<skill-root>/scripts/run.json`

Fields:
- `data_fetched_at`: ISO8601 or null when used by the workflow
- `output_generated_at`: ISO8601 or null when used by the workflow
- `notification_pending`: string or null
- `updated_at`: ISO8601

Write rule: preserve current semantics by default, keep changes additive and backward-compatible, and justify any extension in the design doc and reviewer report.

## 7. Implementation Layers

### Skill Placement Rules

- Shared reusable capability → `.agents/skills/<skill-name>/`
- Workspace-specific capability → `<workspace>/skills/<skill-name>/`
- Shell/Node helpers for a skill → `<skill-root>/scripts/`
- Pure helpers → `<skill-root>/scripts/lib/`
- Script tests → `<skill-root>/scripts/test/`

### Package Tree Requirement

#### Docs-only skill

```text
<skill-root>/
├── SKILL.md
└── reference.md
```

#### Script-bearing skill

```text
<skill-root>/
├── SKILL.md
├── reference.md
└── scripts/
    ├── <entrypoint-or-helper>
    ├── lib/
    └── test/
```

### Standards Exception Note

Every script-bearing design must state that OpenClaw uses `scripts/test/` as a package-local exception instead of a top-level `tests/` directory.

## 8. Script Inventory and Function Specifications

Required only for script-bearing skills.

For each script, include:
- script purpose
- invocation and arguments
- inputs / outputs / artifacts
- a function inventory table

### Required function table format

```markdown
| function | responsibility | inputs | outputs | side effects | failure mode |
|----------|----------------|--------|---------|--------------|--------------|
| `main` | <orchestration summary> | argv | stdout / files | reads/writes files | exit code and condition |
```

## 9. Script Test Stub Matrix

Required only for script-bearing skills.

Every script must have at least one mapped test stub under `scripts/test/`.

### Required table format

```markdown
| Script Path | Test Stub Path | Scenarios | Smoke Command |
|-------------|----------------|-----------|---------------|
| `<skill-root>/scripts/foo.sh` | `<skill-root>/scripts/test/foo.test.js` | success; required-arg failure; dependency/error path | `node --test <skill-root>/scripts/test/foo.test.js` |
```

## 10. Files To Create / Update

Explicit inventory. Cross-reference with Section 1 (Deliverables).

1. `.agents/skills/<entrypoint-skill>/SKILL.md` — create/update
2. `.agents/skills/<entrypoint-skill>/reference.md` — create/update
3. `.agents/skills/<shared-skill>/SKILL.md` — create/update when shared capability is introduced or changed
4. `<workspace>/skills/<local-skill>/SKILL.md` — create/update when workspace-local capability is introduced or changed
5. `<skill-root>/scripts/` — create/update only when helper automation is required
6. `<skill-root>/scripts/test/` — create/update for every script-bearing skill
7. `AGENTS.md` — update to reflect the final contract

## 11. README Impact

User-facing README impact:
- `<path>/README.md`: `updated | no change | not applicable`
- Reason: <why>

## 12. Backfill Coverage Table

Required when redesigning an existing script-bearing skill package.

For each in-scope existing script, include:
- `script path`
- `test stub path`
- `at least one failure-path stub`

Docs-only skills may omit this section or mark it `Not applicable — no in-scope scripts`.

## 13. Quality Gates

- [ ] Design defines workflow entrypoints as skills, not only prose or scripts
- [ ] Shared vs workspace-local placement is explicit and justified
- [ ] `.agents/skills/` is treated as canonical for shared skills
- [ ] Existing `REPORT_STATE` / Phase 0 behavior is preserved
- [ ] Existing `task.json` / `run.json` semantics are preserved unless additive changes are justified in the design doc and reviewer report
- [ ] `skill-creator` is required for new or materially redesigned skills
- [ ] `code-structure-quality` is applied to placement and boundary design
- [ ] Existing shared skills `jira-cli`, `confluence`, and `feishu-notify` are reused directly by default
- [ ] Every created or redesigned skill has explicit `SKILL.md` content requirements
- [ ] Every created or redesigned skill has explicit `reference.md` content requirements
- [ ] Every script-bearing skill includes package structure, script inventory, and function-level details
- [ ] Every script-bearing skill includes one-to-one script test-stub mapping under `scripts/test/`
- [ ] Docs-only skills are not forced to carry script-test sections
- [ ] AGENTS.md sync is explicit
- [ ] README impact is explicitly addressed
- [ ] Reviewer report artifacts are explicit: `projects/agent-design-review/<design_id>/design_review_report.md` and `projects/agent-design-review/<design_id>/design_review_report.json`
- [ ] Reviewer status (`openclaw-agent-design-review`): `pass` or `pass_with_advisories`

## 14. References

- `.agents/skills/openclaw-agent-design/reference.md`
- `.agents/skills/openclaw-agent-design-review/SKILL.md`
- `.agents/skills/clawddocs/SKILL.md`
- `.agents/skills/code-structure-quality/SKILL.md`
- `skill-creator` (shared skill; use the environment-provided installation)
- `workspace-daily/docs/RCA_DAILY_SKILL_REFACTOR_DESIGN.md`
