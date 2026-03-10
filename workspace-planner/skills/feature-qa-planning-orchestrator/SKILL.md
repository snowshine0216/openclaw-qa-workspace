---
name: feature-qa-planning-orchestrator
description: Master orchestrator for feature QA planning. Use whenever creating QA plans, test plans, or test strategies from Jira/Confluence/GitHub/Figma evidence. Covers runtime preparation and state check, evidence gathering, context normalization, coverage mapping, unified draft writing, structured review, deterministic refactor, and final publication with Feishu notification. Prefer this skill for artifact-first, multi-source QA planning even if the user only says "write a test plan" or "create QA coverage."
---

# Feature QA Planning Orchestrator

This skill owns the full QA-plan workflow end to end.
Spawned sub-agents always use `skill: feature-qa-planning-orchestrator` — never the deprecated qa-plan-write, qa-plan-review, or qa-plan-refactor skills.

## Always-read references

Always use:
- `reference.md`
- `references/qa-plan-contract.md`
- `references/context-coverage-contract.md`
- `references/executable-step-rubric.md`
- `references/review-rubric.md`
- `references/context-index-schema.md`
- `references/e2e-coverage-rules.md`
- `templates/qa-plan-template.md`

## Core invariants

- Final output is a unified QA plan in valid XMindMark.
- `markxmind` is mandatory for final plan structure validation.
- Evidence influences the plan only after it is saved under `context/`.
- Phase 7 is the only user approval checkpoint before promotion to `qa_plan_final.md`.
- Runtime state, artifact naming, phase gates, and source-routing rules are owned by `reference.md`.
- All artifacts live under `projects/feature-plan/<feature-id>/`.

## Required inputs

- `feature_id`
- one or more requested source families
- Jira key and/or equivalent source-of-truth issue reference when applicable
- optional Confluence URL
- optional GitHub PR or compare URLs
- optional Figma URL or approved snapshots

## Canonical output path

All artifacts for a run live under:

```
projects/feature-plan/<feature-id>/
  context/
  drafts/
  task.json
  run.json
  qa_plan_final.md        ← promotion only
```

Runtime scripts are deployed to `projects/feature-plan/scripts/` once in Phase 0 and reused by every subsequent phase.

---

## Phase 0 — Runtime preparation and state check

### Actions

1. Read `projects/feature-plan/<feature-id>/task.json` and `run.json`. Create them fresh if absent.
2. Classify `REPORT_STATE` per `reference.md`:
   - `FINAL_EXISTS` — `qa_plan_final.md` is present
   - `DRAFT_EXISTS` — a draft exists under `drafts/`, no final
   - `CONTEXT_ONLY` — saved context exists, no draft or final
   - `FRESH` — no existing artifacts
3. Present options to the user and block until a choice is made when prior artifacts exist. Never auto-select a destructive option.
4. Deploy runtime scripts to `projects/feature-plan/scripts/`:

   ```bash
   bash workspace-planner/skills/feature-qa-planning-orchestrator/scripts/lib/deploy_runtime_context_tools.sh \
     projects/feature-plan/scripts/
   ```

   Stop immediately if any script is missing from the deployed directory after this step.

5. Validate each requested source family using `contextRules.mjs` `evaluateRuntimeSetup`. Load the module and call:

   ```js
   import { evaluateRuntimeSetup } from 'projects/feature-plan/scripts/contextRules.mjs';
   const result = evaluateRuntimeSetup({ requestedSourceFamilies, setupEntries });
   ```

   If `result.ok` is false, mark `task.json.overall_status = "blocked"` and stop. Do not enter Phase 1.

6. Write `context/runtime_setup_<feature-id>.md` recording: requested source families, approved skill or access path per family, validation method used, pass/fail result, and any blockers.
7. Update `task.json.current_phase = "phase_0_runtime_setup"` and `task.json.report_state`. Update `updated_at` on every write.

### Phase gate

Do not enter Phase 1 unless:
- `runtime_setup_<feature-id>.md` exists
- `requested_source_families` is non-empty
- runtime blockers are absent

---

## Phase 1 — Evidence gathering

For each requested source family, spawn one bounded context-gathering sub-agent:

```
skill: feature-qa-planning-orchestrator
instructions: |
  Role: context-gathering agent for source family <SOURCE_FAMILY>.

  Approved skill path: <jira-cli | confluence | github | browser-use>.
  Disallowed tools for jira/confluence/github: browser fetch, generic web fetch.

  Task:
  - Use only the approved skill path to fetch evidence for feature_id: <FEATURE_ID>.
  - Save every raw artifact immediately after fetch using:
      bash projects/feature-plan/scripts/save_context.sh <FEATURE_ID> <artifact-name> <content>
  - Save per-source summaries to context/:
      jira   → jira_issue_<FEATURE_ID>.md (main + linked issues)
      confluence → confluence_design_<FEATURE_ID>.md
      github → github_diff_<FEATURE_ID>.md, github_traceability_<FEATURE_ID>.md
      figma  → figma/figma_metadata_<FEATURE_ID>.md
  - Do not hand off until all required artifacts for this source family exist on disk under context/.
  - Forbidden: do not produce or return analysis before artifacts are saved.

  Output contract: return the list of saved artifact paths when done.
```

After all spawns complete:
- Record each spawn in `run.json.spawn_history` with `spawn_id`, `phase`, `source_family`, `approved_skill`, `artifact_paths`, `status`.
- Validate spawn policy using `contextRules.mjs` `evaluateSpawnPolicy`:

  ```js
  import { evaluateSpawnPolicy } from 'projects/feature-plan/scripts/contextRules.mjs';
  const result = evaluateSpawnPolicy({ spawnHistory });
  ```

  If `result.ok` is false, stop and report failures.

### Phase gate

Do not enter Phase 2 unless every required source family is retrieved through its approved access path and persisted under `context/`.

---

## Phase 2 — Context normalization

Orchestrator directly produces two artifacts using only saved `context/` files:

1. **`context/context_index_<feature-id>.md`** — capability families, feature classification, mandatory coverage candidates, traceability map. Follow `references/context-index-schema.md`.
2. **`context/scenario_units_<feature-id>.md`** — one row per distinct user-visible flow:
   `scenario_id | family_id | scenario_title | trigger | visible_outcome | recommended_section | priority | source_artifacts | merge_policy`
   `merge_policy` must be `must_stand_alone | may_merge_with_same_outcome | out_of_scope_only_with_reason`.

Save each artifact using `save_context.sh`.

Validate:

```bash
node projects/feature-plan/scripts/validate_plan_artifact.mjs validate_context_index \
  projects/feature-plan/<feature-id>/context/context_index_<feature-id>.md
```

Update `task.json.current_phase = "phase_2_context_normalization"`.

### Phase gate

Do not enter Phase 3 unless both artifacts exist and `validate_context_index` passes.

---

## Phase 3 — Coverage mapping

Orchestrator directly produces **`context/coverage_ledger_<feature-id>.md`** mapping every `must_stand_alone` scenario unit:

`scenario_id | draft_section | draft_scenario_title | resolution_type | status`

`resolution_type` must be `standalone | approved_merge | explicit_exclusion`.

Save using `save_context.sh`.

Validate:

```bash
node projects/feature-plan/scripts/validate_plan_artifact.mjs validate_coverage_ledger \
  projects/feature-plan/<feature-id>/context/coverage_ledger_<feature-id>.md \
  [candidate-id ...]
```

Candidate ids come from `context_index` `## Mandatory Coverage Candidates` when the feature is `user_facing`.

Update `task.json.current_phase = "phase_3_coverage_mapping"`.

### Phase gate

Do not enter Phase 4 unless every mandatory coverage candidate and every `must_stand_alone` scenario unit is classified in the coverage ledger.

---

## Phase 4 — Unified draft writing

Spawn a **write sub-agent**:

```
skill: feature-qa-planning-orchestrator
instructions: |
  Role: QA plan writer.

  Read only saved artifacts from projects/feature-plan/<FEATURE_ID>/context/.
  Follow these contracts in order:
    - references/qa-plan-contract.md
    - references/executable-step-rubric.md
    - references/e2e-coverage-rules.md
    - templates/qa-plan-template.md
    - references/context-index-schema.md (for scenario unit alignment)

  Source priority for drafting each section:
    Confluence → main behavior and workflow
    Jira       → repro fixtures and missing coverage
    GitHub     → edge cases, boundaries, performance-sensitive risk
    Figma      → copy, visible state, user-flow detail

  Rules:
  - Do not merge must_stand_alone scenario units from scenario_units_<FEATURE_ID>.md.
  - Produce: projects/feature-plan/<FEATURE_ID>/drafts/qa_plan_v1.md in valid XMindMark.
  - Do not save the draft until markxmind structure validation passes.
  - If validation fails, rewrite once and validate again before saving.
  - If still failing, stop and report violations instead of saving a weak draft.

  Output contract: return the saved draft path when done.
```

After the spawn returns, orchestrator validates the draft:

```bash
bash projects/feature-plan/scripts/validate_testcase_structure.sh \
  projects/feature-plan/<feature-id>/drafts/qa_plan_v1.md

node projects/feature-plan/scripts/validate_plan_artifact.mjs validate_e2e_minimum \
  projects/feature-plan/<feature-id>/drafts/qa_plan_v1.md user_facing

node projects/feature-plan/scripts/validate_plan_artifact.mjs validate_executable_steps \
  projects/feature-plan/<feature-id>/drafts/qa_plan_v1.md
```

Record spawn in `run.json.spawn_history`. Update `task.json.current_phase = "phase_4_draft_writing"`.

### Phase gate

Do not enter Phase 5 unless all three validators above pass on `drafts/qa_plan_v1.md`.

---

## Phase 5 — Structured review

Spawn a **review sub-agent**:

```
skill: feature-qa-planning-orchestrator
instructions: |
  Role: QA plan reviewer.

  Review: projects/feature-plan/<FEATURE_ID>/drafts/qa_plan_v1.md

  Review against (read all before reviewing):
    - references/review-rubric.md
    - references/context-coverage-contract.md
    - references/qa-plan-contract.md
    - context/scenario_units_<FEATURE_ID>.md
    - context/context_index_<FEATURE_ID>.md

  Produce and save via save_context.sh:

  1. context/review_qa_plan_<FEATURE_ID>.md — structured review artifact with:
       ## Status: Pass | Pass with Findings | Fail
       ## Per-Section Checkpoint Summary
       ## Structural Findings (ST-1..ST-4)
       ## Coverage Findings (CV-1..CV-7)
       ## Executability Findings (EX-1..EX-4)
       ## Quality Findings (QL-1..QL-3)
       ## Evidence Gaps
       ## Required Refactors
       ## Unresolved Executability Items
       ## Pass/Fail Summary

  2. context/review_rewrite_requests_<FEATURE_ID>.md — one row per required rewrite:
       ## Rewrite Requests
       - request_id | scenario_ids | problem_type | required_action | status
       problem_type: split_required | expected_result_too_vague | wrong_section |
                     missing_visible_outcome | missing_source_traceability

  Save both artifacts. Return both saved paths when done.
```

Record spawn in `run.json.spawn_history`. Update `task.json.current_phase = "phase_5_review"`.

### Phase gate

Do not enter Phase 6 unless both `review_qa_plan_<feature-id>.md` and `review_rewrite_requests_<feature-id>.md` exist and the review verdict is saved.

---

## Phase 6 — Deterministic refactor

Spawn a **refactor sub-agent**:

```
skill: feature-qa-planning-orchestrator
instructions: |
  Role: QA plan refactor agent.

  Inputs (read all before refactoring):
    - projects/feature-plan/<FEATURE_ID>/drafts/qa_plan_v1.md     ← reviewed draft
    - context/review_rewrite_requests_<FEATURE_ID>.md              ← required rewrites
    - context/review_qa_plan_<FEATURE_ID>.md                       ← full review
    - context/scenario_units_<FEATURE_ID>.md                       ← scenario granularity
    - context/coverage_ledger_<FEATURE_ID>.md                      ← standalone mapping

  Rules:
  - Apply ONLY the required rewrites from review_rewrite_requests. Do not redesign.
  - Never remove required coverage without moving ownership to a clearer section.
  - Never invent a branch when saved evidence is missing.
  - Do NOT overwrite qa_plan_v1.md.

  Produce and save via save_context.sh / direct write:

  1. projects/feature-plan/<FEATURE_ID>/drafts/qa_plan_v2.md
     — refactored draft; must differ from v1 when any required rewrite existed.

  2. context/review_delta_<FEATURE_ID>.md — one row per resolved rewrite:
       ## Blocking Findings Resolution
       - request_id | old_scenario_title | new_scenario_title(s) | change_summary | status
       status must be: resolved | blocked

  Return both saved paths when done.
```

After the spawn returns, orchestrator validates:

```bash
node projects/feature-plan/scripts/validate_plan_artifact.mjs validate_review_delta \
  projects/feature-plan/<feature-id>/context/review_delta_<feature-id>.md

node projects/feature-plan/scripts/validate_plan_artifact.mjs validate_scenario_granularity \
  projects/feature-plan/<feature-id>/context/scenario_units_<feature-id>.md \
  projects/feature-plan/<feature-id>/context/coverage_ledger_<feature-id>.md \
  projects/feature-plan/<feature-id>/drafts/qa_plan_v2.md \
  projects/feature-plan/<feature-id>/context/review_rewrite_requests_<feature-id>.md \
  projects/feature-plan/<feature-id>/context/review_delta_<feature-id>.md
```

Record spawn in `run.json.spawn_history`. Update `task.json.current_phase = "phase_6_refactor"`.

### Phase gate

Do not enter Phase 7 unless:
- `validate_review_delta` passes
- `validate_scenario_granularity` passes
- All `split_required` rewrite requests are `resolved`
- `drafts/qa_plan_v2.md` differs from `drafts/qa_plan_v1.md` when any required rewrite existed

---

## Phase 7 — Finalization

1. Present the user with a structured pre-approval summary:
   - `feature_id`
   - Source families used
   - Scenario unit count (total / `must_stand_alone` / excluded)
   - Required rewrites resolved vs total
   - Validator outcomes (structure, e2e_minimum, executable_steps, review_delta, scenario_granularity)
   - Draft path to be promoted
2. Block until the user explicitly approves. Do not promote without approval. On rejection, return to Phase 5 for a fresh review/refactor cycle.
3. On approval:
   - Archive any prior `qa_plan_final.md` before overwrite.
   - Promote `drafts/qa_plan_v2.md` to `projects/feature-plan/<feature-id>/qa_plan_final.md`.
   - Write `context/finalization_record_<feature-id>.md`:
     - `promoted_source`: path of promoted draft
     - `reviewed_draft`: path of reviewed v1 draft
     - `required_rewrites_existed`: true/false
     - `candidate_changed_from_reviewed_draft`: true/false
     - `validator_outcomes`: map of validator name → pass/fail
     - `promotion_reason`: user approval note
   - Update `task.json.overall_status = "completed"` and `run.json.finalized_at`.
4. Send a structured notification via `feishu-notify`:

   ```
   QA Plan Ready — <feature_id>

   Plan: projects/feature-plan/<feature-id>/qa_plan_final.md
   Source families: <list>
   Scenario units: <total> total, <standalone> standalone, <excluded> excluded
   Rewrites resolved: <N> / <total>
   Validators: structure ✓ | e2e_minimum ✓ | executable_steps ✓ | review_delta ✓ | scenario_granularity ✓
   Run duration: <started_at> → <finalized_at>
   ```

---

## Spawned output validity contract

Spawned outputs are invalid until:
- saved under `context/` (or `drafts/` for draft artifacts)
- recorded in `task.json.artifacts`
- recorded in `run.json.spawn_history`

---

## Completion gate

Do not finalize the workflow unless:
- required source evidence is saved to `context/`
- no mandatory coverage candidate was silently dropped
- manual cases are concrete enough to execute
- `validate_testcase_structure` passed on the promoted draft
- `validate_scenario_granularity` passed on the promoted draft
- all reused evidence was saved to `context/`
