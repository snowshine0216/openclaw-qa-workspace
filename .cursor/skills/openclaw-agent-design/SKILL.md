---
name: openclaw-agent-design
description: Designs OpenClaw agents with state-machine-driven workflows, resume capability, user confirmation gates, and Feishu notification. Produces a structured design doc following the canonical NLG template. Must invoke agent-idempotency for Phase 0, skill-creator for new skills, and openclaw-agent-design-review before finalizing. Use when designing new OpenClaw agents, workflows, or when creating/updating AGENTS.md, .agents/workflows/, or agent skills.
---

# OpenClaw Agent Design

## 0. Design Process (Mandatory Steps)

Run these steps in order before finalizing any design doc:

1. **Consult clawddocs** — understand agent architecture, workspace conventions, session tools, Feishu integration.
2. **Invoke agent-idempotency** — apply to Phase 0: classify states, define options, archive-before-overwrite, task.json/run.json schema.
3. **For each new skill** — invoke **skill-creator** to produce the SKILL.md stub.
4. **Invoke openclaw-agent-design-review** — resolve all P0/P1 findings before final output.

Reference workflows (canonical Phase 0 examples):
- `workspace-reporter/.agents/workflows/qa-summary.md`
- `workspace-planner/.agents/workflows/feature-qa-planning.md`

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
| CREATE | `.agents/workflows/<name>.md` | NLG workflow |
| CREATE | `skills/<name>/SKILL.md` | via skill-creator |
| UPDATE | `AGENTS.md` | sync workflow + skill refs |
| CREATE | `scripts/check_resume.sh` | idempotency |

---

## 2. AGENTS.md Sync

Sections to update:
- **Skills Reference**: add `<skill-name>` with path and purpose
- **Workflow routing**: add `/<slash-command>` → workflow path mapping

---

## 3. Skills Design

> For each new skill: use `skill-creator` to generate SKILL.md stub.

### 3.1 `<skill-name>` skill

Planned path: `skills/<skill-name>/SKILL.md`

Inputs:
- `<field>`: <type>, example `<example>`

Output:
- `<output path>`

---

## 4. Workflow Design (NLG)

> Default: NLG workflow. Phases are plain-language instructions.
> Use bash scripts only when the design explicitly requires automation.

Workflow path: `.agents/workflows/<name>.md`

### Phase 0: Idempotency and Run Preparation

Actions:
1. Run `scripts/check_resume.sh <key>`. Classify `REPORT_STATE`.
2. Present options by state (see State Machine section).
3. Archive prior output if overwrite/regenerate selected.
4. Initialize or update `task.json` and `run.json`.

User Interaction:
1. Done: state classification completed, options presented.
2. Blocked: waiting for user choice when prior artifacts exist.
3. Questions: choose one option (Use Existing / Smart Refresh / Full Regenerate / Resume).
4. Assumption policy: never auto-pick a destructive option. Stop and ask if intent is ambiguous.

State Updates:
1. `task.json.current_phase = "phase_0_prepare"`
2. `task.json.overall_status = "<initial_status>"`
3. Update `updated_at` in both state files.

Verification:
```bash
scripts/check_resume.sh <key>
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

### task.json

Path: `projects/<type>/<key>/task.json`

Fields:
- `run_key`: string
- `overall_status`: string
- `current_phase`: string
- `created_at`: ISO8601
- `updated_at`: ISO8601

Write rule: every write must update `updated_at`. Use atomic write (tmp → rename).

### run.json

Path: `projects/<type>/<key>/run.json`

Fields:
- `notification_pending`: string or null (full Feishu payload on send failure)
- `updated_at`: ISO8601

---

## 6. Scripts

### `scripts/check_resume.sh`

Usage: `scripts/check_resume.sh <key>`

Must emit:
- `REPORT_STATE=<FINAL_EXISTS|DRAFT_EXISTS|CONTEXT_ONLY|FRESH>`
- `TASK_STATE=<status>` (parsed from task.json)

---

## 7. Files To Create / Update

> Explicit inventory. Cross-reference with Section 1 (Deliverables).

1. `.agents/workflows/<name>.md` — create
2. `skills/<skill-name>/SKILL.md` — create
3. `scripts/check_resume.sh` — create/update
4. `AGENTS.md` — update (sync to this design)

---

## 8. README Impact

User-facing README impact:
- `<tool>/README.md`: **<updated | no change | not applicable>**
- Reason: <why>

---

## 9. Quality Gates

- [ ] Deliverables table complete with explicit paths
- [ ] AGENTS.md sync sections listed
- [ ] Environment setup addressed (or explicitly N/A)
- [ ] Per-phase user interaction contract (Done / Blocked / Questions / Assumption policy)
- [ ] Feishu notification + `notification_pending` fallback defined
- [ ] README impact explicitly addressed
- [ ] Reviewer status (openclaw-agent-design-review): pass or pass_with_advisories

---

## 10. References

- <related design docs, skills, workflows>
```

---

## 2. Key Rules

### NLG Workflow Default

All workflow phases use **NLG (natural language instructions)** by default. This means:
- Phase blocks use: **Actions / User Interaction / State Updates / Verification**
- No code execution in phase bodies unless the design explicitly calls for a script
- Verification blocks use bash for spot-checking only, not execution logic

### Never Assume

In every workflow phase:
- **Confirm requirements** with the user before external API calls, publishes, or overwrites
- **Stop and ask** when context is ambiguous — never silently guess
- **Document impact** — state AGENTS.md updates and README impact explicitly in every design

### Final Feishu Notification

All workflows must include a completion notification phase:
1. Send Feishu message (use `feishu` skill template)
2. On failure: persist full payload to `run.json.notification_pending`
3. On next resume: retry notification before starting any phase

Verification (gate-required canonical command):
```bash
jq -r '.notification_pending // empty' memory/tester-flow/runs/<work_item_key>/run.json
```

---

## 3. State Machine Quick Reference

| REPORT_STATE | Action |
|---|---|
| `FINAL_EXISTS` | Show freshness. STOP. Options: Use Existing / Smart Refresh / Full Regenerate |
| `DRAFT_EXISTS` | STOP. Options: Resume / Smart Refresh / Full Regenerate |
| `CONTEXT_ONLY` | STOP. Options: Generate from Cache / Re-fetch + Regenerate |
| `FRESH` | Proceed. Initialize task.json |

Archive rule: never overwrite an existing final artifact directly. Move prior output to `archive/` under run root before regeneration.

---

## 4. Quick Checklist

Before finalizing a design doc:

- [ ] **clawddocs** consulted for agent concepts
- [ ] **agent-idempotency** applied to Phase 0
- [ ] **skill-creator** invoked for each new skill
- [ ] **openclaw-agent-design-review** executed → `pass` or `pass_with_advisories`
- [ ] Reviewer report path captured in handoff output
- [ ] Design doc follows canonical template (Sections 0–10)
- [ ] Deliverables table complete
- [ ] task.json / run.json schemas defined with concrete paths
- [ ] check_resume.sh contract defined
- [ ] Per-phase user interaction included (Done / Blocked / Questions / Assumption policy)
- [ ] Status transition map present
- [ ] Feishu + `notification_pending` fallback defined
- [ ] README impact explicitly addressed

## Additional Resources

- agent-idempotency: `.cursor/skills/agent-idempotency/SKILL.md`
- skill-creator: `.cursor/skills/skill-creator/SKILL.md`
- State machine examples and Feishu template: [reference.md](reference.md)
