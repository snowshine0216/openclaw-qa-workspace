# OpenClaw Agent Design Review — Reference

## Severity Model

| Severity | Meaning | Blocks finalization |
|---|---|---|
| `P0` | Critical contract or correctness issue | Yes |
| `P1` | Major quality gate missing | Yes |
| `P2` | Advisory improvement | No |

## Check Matrix

### 1) Skill-First Workflow Contract

Pass conditions:
- Workflow entrypoints are defined as skills.
- Shell/Node helpers are described as implementation details under the skill, not the primary abstraction.
- The design identifies the canonical entrypoint skill path.

Typical failures:
- `P0`: Workflow is not modeled as a skill entrypoint.
- `P1`: Shell scripts are treated as the primary workflow abstraction.

### 2) Shared vs Local Skill Placement

Pass conditions:
- Shared reusable capabilities are placed in `.agents/skills/`.
- Workspace-specific capabilities are placed in `<workspace>/skills/`.
- Placement decisions are justified in the design doc.

Typical failures:
- `P1`: Shared capability proposed outside `.agents/skills/` without justification.
- `P1`: Workspace-local behavior proposed as shared without justification.

### 3) Existing Shared Skill Reuse

Pass conditions:
- Design checks direct reuse of `jira-cli`, `confluence`, and `feishu-notify`.
- New wrappers are introduced only when direct reuse cannot express the higher-level contract.
- Any wrapper proposal includes an explicit contract-gap justification.

Typical failures:
- `P1`: Existing shared skill reuse skipped without justified contract gap.
- `P1`: Wrapper skill proposed without explicit contract-gap justification.

### 4) State-Machine Non-Regression

Pass conditions:
- Design begins with the current Phase 0 existing-status check.
- The current `REPORT_STATE` contract remains the default behavior.
- Existing `task.json` / `run.json` semantics are preserved unless additive changes are explicitly justified in both the design doc and review report.

Typical failures:
- `P1`: Design bypasses the current existing-status check.
- `P1`: Design changes `task.json` / `run.json` semantics without additive justification.

### 5) Design Workflow Dependencies

Pass conditions:
- `clawddocs` is consulted.
- `agent-idempotency` is required.
- `skill-creator` is required for new or materially redesigned skills.
- `code-structure-quality` is required for skill boundary design.
- `openclaw-agent-design-review` remains a blocking gate.

Typical failures:
- `P1`: Missing `skill-creator` requirement.
- `P1`: Missing `code-structure-quality` requirement.
- `P1`: Missing blocking reviewer gate.

### 6) Documentation and Validation Completeness

Pass conditions:
- AGENTS.md sync is explicit.
- README impact is explicit.
- Non-trivial scripts include test, smoke, or validation evidence.
- Output and handoff artifact paths are explicit.

Typical failures:
- `P1`: No AGENTS.md sync section.
- `P1`: No README impact section.
- `P1`: Non-trivial script changes lack validation evidence.

## Finding IDs

- `SKILL-001` (`P0`): Workflow is not modeled as a skill entrypoint.
- `SKILL-002` (`P1`): Shared capability is placed outside `.agents/skills/` without justification.
- `SKILL-003` (`P1`): Workspace-specific capability is incorrectly proposed as shared.
- `SKILL-004` (`P1`): Existing shared skill reuse was skipped without justified contract gap.
- `SKILL-005` (`P1`): `skill-creator` was not required for new or materially redesigned skills.
- `SKILL-006` (`P1`): `code-structure-quality` was not applied to skill boundary design.
- `SKILL-007` (`P1`): Design ignores OpenClaw compatibility expectations from `clawddocs` or `agent-idempotency`.
- `SKILL-008` (`P1`): Design bypasses the current Phase 0 existing-status check or breaks `task.json` / `run.json` semantics without additive change justification recorded in the design doc and reviewer report.
- `SHELL-001` (`P1`): Shell or Node scripts are treated as the primary workflow abstraction instead of skill internals.
- `SHELL-002` (`P1`): Script design mixes orchestration, transformation, and side effects without clear boundaries.
- `SHELL-003` (`P2`): Non-trivial script behavior lacks test, smoke, or validation evidence.

## Suggested JSON Finding Shape

```json
{
  "id": "SKILL-002",
  "severity": "P1",
  "summary": "Shared capability is placed outside .agents/skills/ without justification",
  "evidence": "docs/example-design.md",
  "recommended_fix": "Move the shared capability under .agents/skills/ or add an explicit justification for why it is not shared."
}
```
