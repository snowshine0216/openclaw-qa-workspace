---
name: openclaw-agent-design
description: Designs OpenClaw agents and agent-function refactors with skill-first workflows, preserved Phase 0 state-machine behavior, shared-vs-local skill placement, and mandatory reviewer gates. Must consult clawddocs, apply agent-idempotency, use skill-creator for new or materially redesigned skills, use code-structure-quality for skill boundaries, and invoke openclaw-agent-design-review before finalizing.
---

# OpenClaw Agent Design

## 0. Design Process (Mandatory Steps)

Run these steps in order before finalizing any design doc:

1. **Consult `clawddocs`** — confirm current OpenClaw architecture, workspace conventions, and integration expectations.
2. **Invoke `agent-idempotency`** — preserve the current Phase 0 / `REPORT_STATE` model, resume behavior, archive-before-overwrite policy, and `task.json` / `run.json` compatibility.
3. **Use `skill-creator` for each new or materially redesigned skill** — shared and workspace-local skills both require this step.
4. **Use `code-structure-quality`** — enforce clean ownership boundaries, direct reuse, and side-effect separation in the design.
5. **Invoke `openclaw-agent-design-review`** — resolve all P0/P1 findings before final output.



---

## 1. Design Doc Template

Every design output **must** follow this structure. Omit sections only when explicitly not applicable.

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

> List runtime env requirements: env vars, tools, credentials, CLI setup commands.
> If none: *No special setup required.*

---

## 1. Design Deliverables

| Action | Path | Notes |
|--------|------|-------|
| UPDATE | `.agents/skills/<entrypoint-skill>/SKILL.md` | entrypoint skill contract |
| UPDATE | `.agents/skills/<entrypoint-skill>/reference.md` | canonical behavior and state-machine notes |
| CREATE/UPDATE | `.agents/skills/<shared-skill>/SKILL.md` | shared reusable capability via `skill-creator` |
| CREATE/UPDATE | `<workspace>/skills/<local-skill>/SKILL.md` | workspace-local capability via `skill-creator` |
| UPDATE | `AGENTS.md` | sync placement, reuse, and workflow references |

---

## 2. AGENTS.md Sync

Sections to update:
- **Skills Reference**: add or revise canonical skill paths and purposes
- **Workflow/Design Routing**: update any design or orchestration references affected by this change
- **Shared vs Local Rules**: note whether capability belongs in `.agents/skills/` or `<workspace>/skills/`

---

## 3. Skills Design

> For each new or materially redesigned skill: use `skill-creator` to generate or revise the SKILL.md contract.

### 3.1 `<skill-name>` skill

Planned path: `<canonical-path>`

Classification:
- `shared` | `workspace-local`

Why this placement:
- <brief justification>

Inputs:
- `<field>`: <type>, example `<example>`

Outputs:
- `<artifact or handoff>`

Existing skills reused directly:
- `<skill-name>` — <why direct reuse is sufficient>

---

## 4. Workflow Design (Skill-First)

> Default: workflows are defined as skill entrypoints that may use NLG phases and internal shell/Node helpers.
> Shell scripts are implementation details under a skill's `scripts/` directory; they do not replace the skill abstraction.

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
3. Questions: choose the option appropriate to the current state (Use Existing / Smart Refresh / Full Regenerate / Resume / Generate from Cache / Re-fetch + Regenerate).
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
|------|-------|-----|
| `<status>` | <event> | `<status>` |
| any | unrecoverable error | `failed` |

---

## 5. State Schemas

### `task.json`

Path: `<skill-root>/scripts/task.json`

Fields:
- `run_key`: string
- `overall_status`: string
- `current_phase`: string
- `created_at`: ISO8601
- `updated_at`: ISO8601
- `phases`: object (preserve existing phase-status detail when present)

Write rule: preserve current semantics by default, including existing `phases` detail when present, update `updated_at` on every write, and use additive schema changes only when justified in the design doc and reviewer report.

### `run.json`

Path: `<skill-root>/scripts/run.json`

Fields:
- `data_fetched_at`: ISO8601 or null when used by the workflow
- `output_generated_at`: ISO8601 or null when used by the workflow
- `notification_pending`: string or null
- `updated_at`: ISO8601

Write rule: preserve current semantics by default, including existing timestamps already used by the workflow, keep changes additive and backward-compatible, and justify any extension in the design doc and reviewer report.

---

## 6. Implementation Layers

### Skill Placement Rules

- Shared reusable capability → `.agents/skills/<skill-name>/`
- Workspace-specific capability → `<workspace>/skills/<skill-name>/`
- Shell/Node helpers for a skill → `<skill-root>/scripts/`
- Pure shell helpers → `<skill-root>/scripts/lib/`
- Script tests → `<skill-root>/scripts/test/`

### Existing Shared Skills to Reuse Directly

Reuse existing shared skills these by default when they satisfy the need:
- `jira-cli`
- `confluence`
- `feishu-notify`

Do not create wrapper skills by default. Only add a wrapper when direct reuse cannot express the required higher-level contract.

### `scripts/check_resume.sh`

Usage: `scripts/check_resume.sh <key>`

Must preserve the current Phase 0 contract and emit:
- `REPORT_STATE=<FINAL_EXISTS|DRAFT_EXISTS|CONTEXT_ONLY|FRESH>`
- `TASK_STATE=<status>`

---

## 7. Files To Create / Update

> Explicit inventory. Cross-reference with Section 1 (Deliverables).

1. `.agents/skills/<entrypoint-skill>/SKILL.md` — create/update
2. `.agents/skills/<entrypoint-skill>/reference.md` — create/update
3. `.agents/skills/<shared-skill>/SKILL.md` — create/update when shared capability is introduced or changed
4. `<workspace>/skills/<local-skill>/SKILL.md` — create/update when workspace-local capability is introduced or changed
5. `<skill-root>/scripts/` — create/update only when helper automation is required
6. `AGENTS.md` — update to reflect the final contract

---

## 8. README Impact

User-facing README impact:
- `<path>/README.md`: **updated | no change | not applicable**
- Reason: <why>

---

## 9. Quality Gates

- [ ] Design defines workflow entrypoints as skills, not only prose or scripts
- [ ] Shared vs workspace-local placement is explicit and justified
- [ ] `.agents/skills/` is treated as canonical for shared skills
- [ ] Existing `REPORT_STATE` / Phase 0 behavior is preserved
- [ ] Existing `task.json` / `run.json` semantics are preserved unless additive changes are justified in the design doc and reviewer report
- [ ] `skill-creator` is required for new or materially redesigned skills
- [ ] `code-structure-quality` is applied to placement and boundary design
- [ ] Existing shared skills `jira-cli`, `confluence`, and `feishu-notify` are reused directly by default
- [ ] AGENTS.md sync is explicit
- [ ] README impact is explicitly addressed
- [ ] Reviewer report artifacts are explicit: `projects/agent-design-review/<design_id>/design_review_report.md` and `projects/agent-design-review/<design_id>/design_review_report.json`
- [ ] Reviewer status (`openclaw-agent-design-review`): `pass` or `pass_with_advisories`

---

## 10. References

- `.agents/skills/openclaw-agent-design/reference.md`
- `.agents/skills/openclaw-agent-design-review/SKILL.md`
- `.agents/skills/clawddocs/SKILL.md`
- `.agents/skills/code-structure-quality/SKILL.md`
- `docs/SKILL_SHELL_WORKFLOW_ENHANCEMENT_DESIGN.md`
- `docs/bestpractice-openclaw.md`


---

## 2. Key Rules

### Skill-First Default

All workflow designs should be expressed as skill entrypoints first. NLG phases and shell/Node helpers are supporting mechanisms inside the skill contract.

### Preserve Existing State-Machine Semantics

Start every output-writing workflow with the current Phase 0 existing-status check.

- Use `.agents/skills/openclaw-agent-design/reference.md` as the canonical `REPORT_STATE` source.
- Preserve existing `task.json` / `run.json` semantics by default.
- Any schema change must be additive, backward-compatible, and justified in both the design doc and reviewer report.

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

---

## 3. State Machine Quick Reference

See `.agents/skills/openclaw-agent-design/reference.md` for the canonical `REPORT_STATE` table, `task.json` example, `run.json` example, and design-doc deliverable format.

---

## 4. Quick Checklist

Before finalizing a design doc:

- [ ] `clawddocs` consulted for OpenClaw conventions
- [ ] `agent-idempotency` applied to Phase 0
- [ ] `skill-creator` invoked for each new or materially redesigned skill
- [ ] `code-structure-quality` applied to placement and module boundaries
- [ ] `openclaw-agent-design-review` executed → `pass` or `pass_with_advisories`
- [ ] Reviewer report path captured in handoff output
- [ ] Design doc follows canonical template (Sections 0–10)
- [ ] Shared vs workspace-local placement justified
- [ ] Existing Phase 0 / `REPORT_STATE` behavior preserved
- [ ] `task.json` / `run.json` compatibility preserved or additive change justified
- [ ] Existing shared skill reuse checked before creating new wrappers
- [ ] AGENTS.md sync explicitly listed
- [ ] README impact explicitly addressed

## Additional Resources

- `agent-idempotency`: `.agents/skills/agent-idempotency/SKILL.md`
- `skill-creator`: `/Users/xuyin/.agents/skills/skill-creator/SKILL.md`
- `code-structure-quality`: `.agents/skills/code-structure-quality/SKILL.md`
- Canonical state-machine notes: [reference.md](reference.md)
