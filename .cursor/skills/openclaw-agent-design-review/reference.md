# OpenClaw Agent Design Review - Reference

## Severity Model

| Severity | Meaning | Blocks finalization |
|---|---|---|
| `P0` | Critical contract/correctness issue | Yes |
| `P1` | Major quality gate missing | Yes |
| `P2` | Advisory improvement | No |

## Check Matrix

### 1) Path Validity and Best Practice

Pass conditions:
- Every path referenced by the design can be resolved in repo.
- Path references are explicit (exact file paths), not implied.
- No unresolved placeholders in final contract paths.
- No hardcoded user-home absolute paths in reusable artifacts.
- `.agents/*` references are explicit and invoked by path, not assumed auto-discovery.

Typical failures:
- `P0`: Required config/workflow path does not exist.
- `P0`: Design relies on implicit auto-discovery behavior without explicit invocation.
- `P1`: Reusable docs/configs use machine-specific absolute paths.

### 2) Test Evidence for Scripts/Workflows

Pass conditions:
- Newly introduced scripts include evidence of test or smoke validation.
- Workflow additions include at least one concrete validation scenario.

Typical failures:
- `P1`: New script/workflow introduced with no test/smoke evidence.

### 3) Documentation Completeness

Pass conditions:
- Design explicitly lists documentation updates.
- Design explicitly mentions user-facing README impact (`updated`, `no change`, or `not applicable` with reason).

Typical failures:
- `P1`: No README mention.
- `P1`: No documentation impact section.

### 4) Additional Quality Signals

Check for:
- Idempotency expectations for output-writing workflows.
- Confirmation gates before external calls/publication.
- Explicit handoff artifact paths and output contract.
- Per-phase user interaction coverage (`Done`, `Blocked`, `Questions`).
- Explicit anti-assumption behavior: ask user questions when context is ambiguous.
- Final workflow notification contract includes Feishu send + fallback persistence.
- Notification fallback verification command is present.

Typical failures:
- `P1`: Output-writing workflow without idempotency strategy.
- `P1`: Missing per-phase user interaction contract.
- `P1`: Ambiguous requirements handled without explicit user question.
- `P1`: Missing final Feishu notification + `notification_pending` fallback step.
- `P1`: Missing `notification_pending` verification command.
- `P2`: Missing optional quality improvement details.

## Finding IDs for New Gates

- `PHASE-UX-001` (`P1`): Missing per-phase user interaction details (`Done`, `Blocked`, `Questions`).
- `PHASE-UX-002` (`P1`): Design allows silent assumptions instead of explicit user questions.
- `NOTIFY-001` (`P1`): Final workflow steps missing Feishu send or `run.json.notification_pending` fallback.
- `NOTIFY-002` (`P1`): Notification fallback verification command missing.
- `SHELL-001` (`P0`): Design uses `sessions_spawn` instead of `spawn-agents.js`.
- `SHELL-002` (`P1`): Shell script function exceeds 20-line limit.
- `SHELL-003` (`P1`): No `lib/feishu.sh` fallback for notification.
- `SHELL-004` (`P1`): Missing `run.json.notification_pending` write on Feishu failure.
- `SHELL-005` (`P1`): Missing TDD test stubs for new scripts.
- `SHELL-006` (`P2`): Main workflow script mixes orchestration and business logic.
- `SHELL-007` (`P2`): Tests use heavy mocks instead of minimal mocks.

## Suggested JSON Finding Shape

```json
{
  "id": "PATH-001",
  "severity": "P0",
  "summary": "Referenced workflow path does not exist",
  "evidence": ".agents/workflows/agent-design-review.md",
  "recommended_fix": "Create the workflow at the referenced path or update the design to the correct existing path."
}
```
