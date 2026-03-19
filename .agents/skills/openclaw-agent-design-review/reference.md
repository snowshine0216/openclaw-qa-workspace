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
- Design checks direct reuse of `jira-cli`, `confluence`, `feishu-notify`, and `github`.
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

### 5) Skill Package Content Completeness

Pass conditions:
- Every created or redesigned skill has an explicit `SKILL.md` content specification (Skills Content Specification > 3.x) with **exact content** — full frontmatter, main sections (e.g. `## Required References`, `## Runtime Layout`, `## Phase Contract`), per-phase entry/work/output/user interaction. Reference: `workspace-planner/skills/qa-plan-orchestrator/SKILL.md`.
- Every created or redesigned skill has an explicit `reference.md` content specification (Skills Content Specification > 4.x) with **exact content** — write the actual content, not "Must include" bullets.
- The design includes package structure expectations (Architecture > Folder structure).
- **Exception:** When the design only updates functions (no skill creation or material redesign), Skills Content Spec is not required — skip this check.

Typical failures:
- `P1`: Missing detailed `SKILL.md` content specification.
- `P1`: Missing detailed `reference.md` content specification.
- `P1`: Skills Content uses outline-style (Target path:, Purpose:, Input contract: alone) instead of exact content.
- `P1`: reference.md spec uses "Must include" bullets instead of actual content.
- `P1`: Package structure is incomplete or underspecified.

### 6) Script-Bearing Package Completeness

Pass conditions:
- The design uses the deterministic script-bearing rule from `.agents/skills/openclaw-agent-design/reference.md`.
- Script-bearing skills declare `scripts/test/` as the OpenClaw exception (Folder structure).
- Every script has function-level details (Functional Design or Functions) including implementation detail (algorithm, pseudocode, or step-by-step logic).
- Every script has a one-to-one mapped test stub (Tests section) with **detailed test stub functions** — actual `test('...', () => { ... })` or `describe` blocks with concrete names, setup/teardown skeleton, and assertion placeholder. Reference: `workspace-planner/skills/qa-plan-orchestrator/scripts/test/spawnManifestBuilders.test.mjs`.
- Docs-only skills are not failed for omitting script-test sections.

Typical failures:
- `P1`: Missing script inventory or function-level details for a script-bearing skill.
- `P1`: Missing one-to-one script-to-test mapping.
- `P1`: Tests have only "Stub scenarios:" bullet list without `test()` or `describe` blocks.
- `P1`: Wrong test layout for a script-bearing skill.
- `P1`: Docs-only skill is incorrectly failed for lacking script-test sections.

### 7) Design Workflow Dependencies

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

### 8) Documentation and Validation Completeness

Pass conditions:
- AGENTS.md sync is explicit (Documentation Changes > AGENTS.md).
- README impact is explicit (Documentation Changes > README).
- Non-trivial scripts include test, smoke, or validation evidence.
- Evals section present when design creates or materially redesigns skills.
- Output and handoff artifact paths are explicit.

Typical failures:
- `P1`: No AGENTS.md sync under Documentation Changes.
- `P1`: No README impact under Documentation Changes.
- `P1`: Non-trivial script changes lack validation evidence.
- `P1`: Evals section missing when skills are created or materially redesigned.
- `P2`: Reviewer automation checks lag behind the documented standard.

### 9) Phase 0 Environment Check (when integrations used)

Pass conditions:
- When design uses jira-cli, github, or confluence in Phase 0 or before spawn, design mentions env check and `runtime_setup_*.json` output.

Typical failures:
- `P1`: Design uses jira/github/confluence in Phase 0 but omits env check or runtime_setup output.

### 10) Runtime Output Location

Pass conditions:
- Script-bearing designs with runtime output specify `runs/<run-key>/` structure.

Typical failures:
- `P1`: Script-bearing design with runtime output omits runs/ convention.

### 11) Skill Path Resolution (script-bearing, when invoking shared skills)

Pass conditions:
- Scripts that invoke shared skills (jira-cli, feishu-notify, etc.) use skill-path-registrar — no hardcoded `.agents/skills` or `workspace-*/skills` paths.
- Design documents fallback order and user-confirmation flow when script not found.

Typical failures:
- `P1` (`PATH-001`): Script or design contains hardcoded `.agents/skills` or `workspace-*/skills` path instead of using skill-path-registrar.
- `P2` (`PATH-002`): Shared skill script resolution lacks fallback order or user-confirmation flow when not found.

### 12) Feishu Notification (when publishing externally)

Pass conditions:
- When workflow publishes externally visible work, design includes Feishu notification.
- When agent-orchestrated: design uses marker-based pattern — phase script emits `FEISHU_NOTIFY: chat_id=<id> issue=<key> risk=<level> plan=<path>` when `FEISHU_CHAT_ID` is set; agent reads `chat_id` from workspace `TOOLS.md`, catches marker, sends via gateway `message` tool (not CLI subprocess).
- `chat_id` is not hardcoded; always from `TOOLS.md`.

Typical failures:
- `P1`: Agent-orchestrated workflow uses `openclaw message send` CLI subprocess for Feishu (unreliable for group chats).
- `P1`: `chat_id` hardcoded or not sourced from `TOOLS.md`.

## Finding IDs

- `SKILL-001` (`P0`): Workflow is not modeled as a skill entrypoint.
- `SKILL-002` (`P1`): Shared capability is placed outside `.agents/skills/` without justification.
- `SKILL-003` (`P1`): Workspace-specific capability is incorrectly proposed as shared.
- `SKILL-004` (`P1`): Existing shared skill reuse was skipped without justified contract gap.
- `SKILL-005` (`P1`): `skill-creator` was not required for new or materially redesigned skills.
- `SKILL-006` (`P1`): `code-structure-quality` was not applied to skill boundary design.
- `SKILL-007` (`P1`): Design ignores OpenClaw compatibility expectations from `clawddocs` or `agent-idempotency`.
- `SKILL-008` (`P1`): Design bypasses the current Phase 0 existing-status check or breaks `task.json` / `run.json` semantics without additive change justification recorded in the design doc and reviewer report.
- `SKILL-009` (`P1`): Missing detailed `SKILL.md` content specification for one or more designed skills.
- `SKILL-010` (`P1`): Missing detailed `reference.md` content specification for one or more designed skills.
- `PKG-001` (`P1`): Skill package folder structure is incomplete or does not include required directories.
- `TEST-001` (`P1`): Script deliverables lack one-to-one test stub mapping.
- `TEST-002` (`P1`): Script-bearing skill violates the canonical `scripts/test/` layout.
- `SHELL-001` (`P1`): Shell or Node scripts are treated as the primary workflow abstraction instead of skill internals.
- `SHELL-002` (`P1`): Script design mixes orchestration, transformation, and side effects without clear boundaries.
- `SHELL-003` (`P2`): Non-trivial script behavior lacks strong enough test, smoke, or validation evidence.
- `SHELL-004` (`P1`): Script function-level responsibilities, IO, or failure details are missing.
- `EVID-001` (`P1`): No executable validation evidence plan exists for script or test behavior.
- `EVID-002` (`P2`): Reviewer automation does not yet validate the documented required sections.
- `EVAL-001` (`P1`): Evals section missing when design creates or materially redesigns skills.
- `ENV-001` (`P1`): Design uses jira-cli/github/confluence in Phase 0 but omits env check or runtime_setup output.
- `RUNTIME-001` (`P1`): Script-bearing design with runtime output omits runs/ convention.
- `FEISHU-001` (`P1`): Agent-orchestrated workflow uses CLI subprocess for Feishu instead of marker-based pattern (emit `FEISHU_NOTIFY:`, agent sends via gateway `message` tool).
- `FEISHU-002` (`P1`): Feishu `chat_id` hardcoded or not sourced from `TOOLS.md`.
- `PATH-001` (`P1`): Script or design contains hardcoded `.agents/skills` or `workspace-*/skills` path instead of using skill-path-registrar.
- `PATH-002` (`P2`): Shared skill script resolution lacks fallback order or user-confirmation flow when not found.
- `CONTENT-001` (`P0`): Skills Content Specification uses outline-style labels without exact content.
- `CONTENT-002` (`P1`): Functions lack implementation detail for lib scripts.
- `CONTENT-003` (`P1`): Tests lack detailed test stub functions.

## Suggested JSON Finding Shape

```json
{
  "id": "SKILL-009",
  "severity": "P1",
  "summary": "Missing detailed SKILL.md content specification for a redesigned skill package",
  "evidence": "docs/example-design.md",
  "recommended_fix": "Add a Skills Content Specification subsection that defines purpose, trigger conditions, input/output contracts, workflow responsibilities, error policy, quality rules, classification, placement justification, and reused shared skills."
}
```
