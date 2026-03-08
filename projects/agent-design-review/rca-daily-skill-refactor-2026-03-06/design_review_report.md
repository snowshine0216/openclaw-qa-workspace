# OpenClaw Design Review Report

- Design ID: `rca-daily-skill-refactor-2026-03-06`
- Reviewed artifact: `workspace-daily/docs/RCA_DAILY_SKILL_REFACTOR_DESIGN.md`
- Reviewer skill: `openclaw-agent-design-review`
- Status: `fail`

## Scope

- Reviewed skill package paths:
  - `.agents/skills/rca/` (docs-only)
  - `workspace-daily/skills/rca-orchestrator/` (script-bearing)

- Script-bearing vs docs-only classification:
  - Docs-only: `.agents/skills/rca/`
  - Script-bearing: `workspace-daily/skills/rca-orchestrator/`

- Script-to-test coverage summary:
  - Declared mapping coverage: `10/10` scripts/helpers have test stubs mapped.
  - Convention check: `FAIL` on OpenClaw script-test path convention (`scripts/test/` required; design uses `tests/`).

- `scripts/test/` convention verdict: `FAIL`

## Findings

1. **[P1] SKILL-010 — Missing `reference.md` content contracts for newly created skills**
   - Evidence: The design creates `.agents/skills/rca/reference.md` and `workspace-daily/skills/rca-orchestrator/reference.md` but does not specify required section content for either file.
   - Location: `workspace-daily/docs/RCA_DAILY_SKILL_REFACTOR_DESIGN.md:73`, `workspace-daily/docs/RCA_DAILY_SKILL_REFACTOR_DESIGN.md:75`
   - Required fix: Add explicit `reference.md` content specification for both skills (state invariants, field contracts, path conventions, validation commands, failure/recovery rules).

2. **[P1] TEST-002 — Script-bearing package violates OpenClaw test layout convention**
   - Evidence: Test paths are defined under `workspace-daily/skills/rca-orchestrator/tests/...`; OpenClaw design convention requires `scripts/test/`.
   - Location: `workspace-daily/docs/RCA_DAILY_SKILL_REFACTOR_DESIGN.md:91`, `workspace-daily/docs/RCA_DAILY_SKILL_REFACTOR_DESIGN.md:1328`
   - Required fix: Move declared test stubs to `workspace-daily/skills/rca-orchestrator/scripts/test/` and update all references/matrices.

3. **[P1] SKILL-008 — Phase 0 non-regression contract is not preserved**
   - Evidence: Skill contract says Phase 0 should present options and avoid overwrite without confirmation, but scripted behavior proceeds automatically for `DRAFT_EXISTS`/`CONTEXT_ONLY` and allows destructive modes without an explicit confirmation checkpoint in the workflow.
   - Location: `workspace-daily/docs/RCA_DAILY_SKILL_REFACTOR_DESIGN.md:182`, `workspace-daily/docs/RCA_DAILY_SKILL_REFACTOR_DESIGN.md:577`
   - Required fix: Define explicit stop-and-choose behavior for non-fresh states (or explicitly document intentional additive semantic change and its compatibility rationale).

4. **[P1] SHELL-001 — Phase handoff is internally inconsistent (Phase 3 completion vs Phase 4 start)**
   - Evidence: `phase3_generate_rcas.sh` says Phase 3 completion is done later by the orchestrator agent after sub-agents finish, but `run.sh` immediately evaluates and can execute Phase 4 in the same run.
   - Location: `workspace-daily/docs/RCA_DAILY_SKILL_REFACTOR_DESIGN.md:312`, `workspace-daily/docs/RCA_DAILY_SKILL_REFACTOR_DESIGN.md:940`
   - Required fix: Define one ownership model:
     - Either `run.sh` blocks until sub-agent completion and then marks phase complete, or
     - `run.sh` exits after phase-3 manifest generation and a separate orchestrator continuation explicitly gates phase 4.

5. **[P1] SHELL-004 — Publish status model is contradictory (`partial_success` is referenced but unreachable)**
   - Evidence: Phase 4 only writes `success` or `failed`, while Phase 5 summary and schema examples rely on `partial_success`.
   - Location: `workspace-daily/docs/RCA_DAILY_SKILL_REFACTOR_DESIGN.md:1155`, `workspace-daily/docs/RCA_DAILY_SKILL_REFACTOR_DESIGN.md:1211`, `workspace-daily/docs/RCA_DAILY_SKILL_REFACTOR_DESIGN.md:1443`
   - Required fix: Either implement `partial_success` state transitions in Phase 4 or remove it from summaries/schema and quality claims.

6. **[P1] SHELL-004 — Jira publish target is contradictory**
   - Evidence: The design alternates between updating `customfield_10050`, updating `description`, and claiming a legacy `curl PUT` path, which are not the same contract.
   - Location: `workspace-daily/docs/RCA_DAILY_SKILL_REFACTOR_DESIGN.md:186`, `workspace-daily/docs/RCA_DAILY_SKILL_REFACTOR_DESIGN.md:987`, `workspace-daily/docs/RCA_DAILY_SKILL_REFACTOR_DESIGN.md:1528`
   - Required fix: Normalize one canonical publish target and one implementation path, then align all phase text, script snippets, and quality gates.

7. **[P1] EVID-001 — Reviewer-gate outputs are incomplete**
   - Evidence: The design marks reviewer artifacts and reviewer status as unchecked but does not define required output artifact paths for the review gate.
   - Location: `workspace-daily/docs/RCA_DAILY_SKILL_REFACTOR_DESIGN.md:1536`
   - Required fix: Add explicit required review outputs:
     - `projects/agent-design-review/<design_id>/design_review_report.md`
     - `projects/agent-design-review/<design_id>/design_review_report.json`
     - final reviewer status (`pass` | `pass_with_advisories` | `fail`).

8. **[P2] PATH-001 — Ambiguous skill path in spawn template**
   - Evidence: Spawn task accepts either repo-local `.agents/skills/rca/SKILL.md` or `~/openclaw/skills/rca/SKILL.md`, which introduces non-deterministic path resolution.
   - Location: `workspace-daily/docs/RCA_DAILY_SKILL_REFACTOR_DESIGN.md:958`
   - Recommended fix: Use a single canonical repository-relative path.

## Decision

- Overall reviewer status: `fail`
- Blocking reason: P1 findings present.
