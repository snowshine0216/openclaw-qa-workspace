# OpenClaw Agent Design Review - Examples

## Example: Good Design Input (v2 format)

This is what a high-quality design doc looks like — the kind that passes review:

```markdown
# My Agent — Agent Design

> **Design ID:** `my-agent-v1`
> **Date:** 2026-03-05
> **Status:** Draft
> **Scope:** Orchestrates X and Y to produce Z for issue key input.

---

## 0. Environment Setup

Requires `gh` CLI authenticated: `gh auth login`
Requires `qmd` installed: `pip install qmd`

---

## 1. Design Deliverables

| Action | Path | Notes |
|--------|------|-------|
| CREATE | `.agents/workflows/my-agent.md` | NLG workflow |
| CREATE | `skills/my-skill/SKILL.md` | via skill-creator |
| UPDATE | `AGENTS.md` | sync skill + workflow refs |
| CREATE | `scripts/check_resume.sh` | idempotency |

---

## 2. AGENTS.md Sync

- Skills Reference: add `my-skill` → `skills/my-skill/SKILL.md`
- Workflow routing: add `/my-agent` → `.agents/workflows/my-agent.md`

---

## 3. Skills Design

### 3.1 `my-skill` skill

Planned path: `skills/my-skill/SKILL.md`

Inputs: `key` (string), `domains` (string array)
Output: `projects/runs/<key>/output.md`

---

## 4. Workflow Design (NLG)

### Phase 0: Idempotency and Run Preparation

Actions:
1. Run `scripts/check_resume.sh <key>`. Classify `REPORT_STATE`.
2. Present options by state.

User Interaction:
1. Done: state classified, options presented.
2. Blocked: waiting for user choice.
3. Questions: Use Existing / Smart Refresh / Full Regenerate?
4. Assumption policy: stop and ask if intent is ambiguous.

State Updates:
1. `task.json.current_phase = "phase_0_prepare"`

Verification:
```bash
scripts/check_resume.sh BCIN-1234
```

---

## 7. Files To Create / Update

1. `.agents/workflows/my-agent.md` — create
2. `skills/my-skill/SKILL.md` — create
3. `scripts/check_resume.sh` — create
4. `AGENTS.md` — update

---

## 8. README Impact

- `tools/my-tool/README.md`: **no change in this design-only commit**

---

## 9. Quality Gates

- [x] Deliverables table complete
- [x] AGENTS.md sync listed
- [x] Per-phase user interaction contract included
- [x] Feishu + notification_pending fallback defined
```

---

## Example Review Report (Markdown)

```markdown
# Agent Design Review Report

- Design ID: my-agent-v1
- Status: pass_with_advisories
- Reviewed At (UTC): 2026-03-05T02:30:00Z

## Severity Summary
- P0: 0
- P1: 0
- P2: 2

## Advisories
1. [P2] QUALITY-001 - Add explicit JSON schema for task.json fields.
2. [P2] QUALITY-002 - Section 10 References is missing.
```

---

## Example Review Report (JSON)

```json
{
  "design_id": "my-agent-v1",
  "overall_status": "pass_with_advisories",
  "severity_counts": { "P0": 0, "P1": 0, "P2": 2 },
  "findings": [
    {
      "id": "QUALITY-001",
      "severity": "P2",
      "summary": "task.json schema not shown as explicit field list",
      "recommended_fix": "Add fields table or JSON snippet to State Schemas section."
    },
    {
      "id": "QUALITY-002",
      "severity": "P2",
      "summary": "Section 10 References missing",
      "recommended_fix": "Add References section with links to parent design and related skills."
    }
  ],
  "required_fixes": [],
  "advisories": ["QUALITY-001", "QUALITY-002"],
  "reviewed_paths": [
    ".agents/workflows/my-agent.md",
    "skills/my-skill/SKILL.md"
  ],
  "timestamp_utc": "2026-03-05T02:30:00Z"
}
```
