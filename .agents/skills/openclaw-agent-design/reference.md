# OpenClaw Agent Design — Reference

## State Machine: `REPORT_STATE` Handling

| `REPORT_STATE` | Action |
|---|---|
| `FINAL_EXISTS` | Show freshness. STOP. Options: (A) Use Existing (B) Smart Refresh (C) Full Regenerate. If (C), archive first. |
| `DRAFT_EXISTS` | STOP. Options: (A) Resume (B) Smart Refresh (C) Full Regenerate. |
| `CONTEXT_ONLY` | STOP. Options: (A) Generate from Cache (B) Re-fetch + Regenerate. |
| `FRESH` | Proceed. Initialize `task.json`. |

This table is the canonical Phase 0 contract for designs that produce persistent artifacts.

## Non-Regression Rules

When redesigning a workflow into skill-first form:

- Start with the existing Phase 0 check before creating new artifacts.
- Preserve current `REPORT_STATE` semantics by default.
- Preserve existing `task.json` / `run.json` semantics by default.
- Any schema or transition change must be additive, backward-compatible, and justified in both the design doc and reviewer report.

## Shared vs Local Skill Placement

| Capability Type | Canonical Path | Rule |
|---|---|---|
| Shared reusable skill | `.agents/skills/<skill-name>/` | Use when multiple agents or workspaces can reuse it |
| Workspace-local skill | `<workspace>/skills/<skill-name>/` | Use when behavior is tightly coupled to one workspace or agent family |
| Skill helper automation | `<skill-root>/scripts/` | Shell/Node helpers that implement the skill contract |

## Existing Shared Skills to Reuse Directly

Use these existing shared skills directly when they fit:

- `jira-cli`
- `confluence`
- `feishu-notify`

Create a wrapper only when direct reuse cannot express the needed higher-level contract.

## Script-Bearing Skill Rule

A skill is script-bearing if either of these is true:
- the deliverables include `scripts/` under the skill package, or
- the Script Inventory contains one or more scripts.

Docs-only skills are exempt from script-specific test-stub requirements.

## OpenClaw Test Layout Exception

For OpenClaw skill-package design work, `scripts/test/` is the canonical test location for script-bearing skills. This is a domain-specific exception that overrides the generic top-level `tests/` preference from `code-quality-orchestrator` for this design domain.

## `agent-idempotency` Mapping

| `agent-idempotency` State | `check_resume.sh` `REPORT_STATE` |
|---|---|
| Final output exists | `FINAL_EXISTS` |
| Draft exists, no final | `DRAFT_EXISTS` |
| Cache only | `CONTEXT_ONLY` |
| Fresh | `FRESH` |

## `task.json` Example

```json
{
  "run_key": "BCIN-1234",
  "overall_status": "in_progress",
  "current_phase": "context_gathering",
  "updated_at": "2026-03-05T02:00:00Z",
  "phases": {
    "context_gathering": { "status": "in_progress" },
    "plan_generation": { "status": "pending" }
  }
}
```

## `run.json` Example

```json
{
  "data_fetched_at": "2026-03-05T01:00:00Z",
  "output_generated_at": "2026-03-05T02:30:00Z",
  "notification_pending": null,
  "updated_at": "2026-03-05T02:31:00Z"
}
```

## Design Doc Deliverables Table Format

```markdown
| Action | Path | Notes |
|--------|------|-------|
| UPDATE | `.agents/skills/<entrypoint-skill>/SKILL.md` | entrypoint skill contract |
| UPDATE | `.agents/skills/<entrypoint-skill>/reference.md` | canonical behavior notes |
| CREATE/UPDATE | `.agents/skills/<shared-skill>/SKILL.md` | shared capability via skill-creator |
| CREATE/UPDATE | `<workspace>/skills/<local-skill>/SKILL.md` | workspace-local capability via skill-creator |
| UPDATE | `AGENTS.md` | sync design and skill references |
```

## Skills Content Template

```markdown
### 3.x `<skill-path>/SKILL.md`

Purpose:
- <what the skill does>

When to trigger:
- <skill-creator style trigger wording>

Input contract:
- `<field>`: <type>, example `<example>`, source <where it comes from>

Output contract:
- <artifact, status line, handoff payload>

Workflow/phase responsibilities:
- <ordered responsibilities>

Error/ambiguity policy:
- <stop / ask / retry / persist>

Quality rules:
- <formatting, invariants, review requirements>

Classification:
- `shared` | `workspace-local`

Why this placement:
- <placement justification>

Existing skills reused directly:
- `<skill-name>` — <why direct reuse is sufficient>
```

## `reference.md` Content Template

```markdown
### 4.x `<skill-path>/reference.md`

Must include:
- state machine / invariants
- schemas or field-level contracts
- path conventions
- validation commands
- failure examples and recovery rules
- package-specific defaults or exceptions
```

## Script Function Spec Template

```markdown
### 8.x `<script-path>`

Invocation:
- `<command>`

Inputs / outputs / artifacts:
- <list>

| function | responsibility | inputs | outputs | side effects | failure mode |
|----------|----------------|--------|---------|--------------|--------------|
| `main` | <summary> | argv | stdout / files | <side effects> | <error condition> |
```

## Script Test Stub Matrix Template

```markdown
| Script Path | Test Stub Path | Scenarios | Smoke Command |
|-------------|----------------|-----------|---------------|
| `<skill-root>/scripts/foo.sh` | `<skill-root>/scripts/test/foo.test.js` | success; required-arg failure; dependency/error path | `node --test <skill-root>/scripts/test/foo.test.js` |
```

## Backfill Coverage Table Template

```markdown
| Script Path | Test Stub Path | Failure-Path Stub |
|-------------|----------------|-------------------|
| `<skill-root>/scripts/foo.sh` | `<skill-root>/scripts/test/foo.test.js` | required-arg failure |
```

## Final Notification Template

```text
✅ <Workflow> completed
  Key:      <ISSUE_KEY>
  Output:   <path or URL>
  Updated:  <UTC TIME>
Published by <Agent Name>.
```
