# Supporting Artifact Summarization And Deep Research Design

> **Design ID:** `qa-plan-orchestrator-supporting-artifact-and-deep-research-2026-03-11`
> **Date:** 2026-03-11
> **Status:** Proposed
> **Scope:** `workspace-planner/skills/qa-plan-orchestrator`
>
> **Constraint:** This is a design artifact. Do not implement until approved.

---

## 0. Environment Setup

This design applies to the existing script-driven `qa-plan-orchestrator` workflow and preserves current Phase 0 idempotency semantics.

Required shared skills and usage model:

1. Primary Jira evidence must use shared `jira-cli`.
2. Primary Confluence evidence must use shared `confluence`.
3. Bounded background research must use shared `tavily-search` first, then shared `confluence` only when Tavily coverage is insufficient.
4. Completion notification must use shared `feishu-notify` with `run.json.notification_pending` fallback.

Compatibility and idempotency baseline:

1. Preserve existing `REPORT_STATE` (`FINAL_EXISTS`, `DRAFT_EXISTS`, `CONTEXT_ONLY`, `FRESH`).
2. Preserve archive-before-overwrite behavior.
3. Keep `task.json` and `run.json` changes additive only.

## 1. Design Deliverables

This design proposes additive behavior and contract updates for `qa-plan-orchestrator` so support artifacts and deep research become first-class persisted inputs.

Deliverables:

1. Add a support-artifact intake and summarization contract for cases like:
   - primary feature: `BCIN-7289`
   - supporting issue: `BCED-2416`
2. Add a relation-aware supporting Jira digestion flow:
   - supporting issue description
   - parent chain
   - linked issues
   - persisted summary artifacts
3. Add deterministic deep-research policy for report-editor:
   - topic A: functionality in Workstation
   - topic B: gap between Library and Workstation
   - ordering: `tavily-search` first, `confluence` second only when needed
   - all outputs persisted under `context/`
4. Keep `BCED-2416` in support-only mode and explicitly forbid defect-analysis mode in this workflow.

## 2. AGENTS.md Sync

`workspace-planner/AGENTS.md` should be updated during implementation to state:

1. QA plan requests may include support-only Jira issue keys that must be digested and summarized into context artifacts.
2. Deep research for report-editor context follows strict `tavily-search` first, `confluence` second policy.
3. Supporting issues used by `qa-plan-orchestrator` are context evidence, not defect-analysis triggers.

## 3. Skills Content Specification

### 3.1 `workspace-planner/skills/qa-plan-orchestrator/SKILL.md`

Purpose:

1. Keep `qa-plan-orchestrator` as the skill entrypoint for feature QA planning.
2. Expand source intake beyond `design doc + feature id` to include support-only evidence bundles.

When to trigger:

1. Any request to generate feature QA plans from feature IDs and/or Confluence URLs.
2. Any request that says the feature plan must include supporting Jira context from additional issue keys.
3. Any request requiring report-editor deep context alignment across Workstation and Library.

Input contract additions:

1. `feature_id`: string, required, example `BCIN-7289`.
2. `seed_confluence_url`: string, optional.
3. `supporting_issue_keys`: string array, optional, example `["BCED-2416"]`.
4. `supporting_issue_policy`: enum, default `context_only_no_defect_analysis`.
5. `deep_research_topics`: enum array, default:
   - `report_editor_workstation_functionality`
   - `report_editor_library_vs_workstation_gap`

Output contract additions:

1. Persist support-issue relation and summary artifacts under `context/`.
2. Persist Tavily-first deep research artifacts under `context/`.
3. Persist optional Confluence fallback deep research artifacts under `context/`.
4. Ensure all new artifacts are indexed in `artifact_lookup_<feature-id>.md`.

Workflow/phase responsibilities:

1. Preserve existing 0-7 phase structure.
2. Extend Phase 0-3 contracts to include support issue handling and deep research artifacts.
3. Keep later drafting/review phases coverage-preserving with the new artifacts as mandatory inputs.

Error/ambiguity policy:

1. If supporting issue key scope is ambiguous, stop and ask before Phase 1 spawn.
2. If linked issue traversal exceeds safety bounds, stop and ask before continuing.
3. Never route supporting issues into defect-analysis behavior.

Quality rules:

1. Supporting issues are always evidence context, never defect-analysis output.
2. Deep research must record Tavily execution first for each topic before any Confluence fallback.
3. Every artifact that influences the draft must exist under `context/` and in `artifact_lookup`.

Classification:

1. `qa-plan-orchestrator`: `workspace-local`.
2. Reused source skills (`jira-cli`, `confluence`, `tavily-search`, `feishu-notify`): `shared`.

Why this placement:

1. Workflow sequencing and planner conventions are workspace-specific.
2. Source-system connectors remain reusable shared skills and should be reused directly.

Existing skills reused directly:

1. `jira-cli` for Jira issue retrieval and relation fetch.
2. `confluence` for primary Confluence evidence and deep-research fallback evidence.
3. `tavily-search` for first-pass deep background research.
4. `feishu-notify` for completion notification.

Direct reuse policy:

1. Direct reuse is sufficient for `jira-cli`, `confluence`, `tavily-search`, and `feishu-notify` in this design.
2. Wrapper skills are allowed only with explicit contract gap justification documented in the implementation PR and review report.

## 4. reference.md Content Specification

### 4.1 `workspace-planner/skills/qa-plan-orchestrator/reference.md`

Must include:

1. Additive state fields for support-issue context and deep-research policy.
2. Artifact naming contracts for:
   - support issue relation map
   - support issue summaries
   - deep research plan and outputs
3. Non-regression guarantees for `REPORT_STATE` and phase progression.
4. Validation commands and fail conditions for:
   - missing support summary artifacts
   - missing Tavily-first evidence
   - accidental defect-analysis routing

### 4.2 `workspace-planner/skills/qa-plan-orchestrator/references/context-coverage-contract.md`

Must include:

1. Supporting issue summary and relation artifacts as mandatory context candidates when provided.
2. Explicit policy that support issue artifacts are context-only and not defect-analysis outputs.
3. Tavily-first deep research provenance requirements for each required research topic.

## 5. Workflow Design

### 5.1 Overview

Current gap:

1. The workflow over-indexes on `feature id + design doc` and can ignore support-only Jira context.
2. The workflow does not enforce deterministic deep research ordering for report-editor domain gaps.

Target behavior:

1. Preserve primary feature ownership (`BCIN-7289`).
2. Digest support-only issue bundles (`BCED-2416` plus related issues) and save reusable summaries.
3. Require persisted Tavily-first deep research on Workstation functionality and Library-vs-Workstation gap.
4. Reuse persisted artifacts in drafting and review phases.

### 5.2 Architecture

#### Workflow Chart

```text
User request
  -> Phase 0: classify REPORT_STATE + parse support issue intent + lock policies
  -> Phase 1: collect primary evidence + supporting issue graph + summaries
  -> Phase 2: rebuild artifact_lookup with support/deep-research artifacts
  -> Phase 3: generate coverage ledger + deep-research outputs (Tavily-first, Confluence-fallback)
  -> Phase 4a/4b/5a/5b/6: draft/review/refactor with support + research artifacts as required inputs
  -> Phase 7: finalize + feishu notify + notification_pending fallback
```

#### Folder Structure

```text
runs/<feature-id>/
  context/
    supporting_issue_request_<feature-id>.md
    request_fulfillment_<feature-id>.md
    request_fulfillment_<feature-id>.json
    supporting_issue_relation_map_<feature-id>.md
    supporting_issue_summary_<feature-id>.md
    supporting_issue_summary_<issue-key>_<feature-id>.md
    deep_research_plan_<feature-id>.md
    deep_research_tavily_report_editor_workstation_<feature-id>.md
    deep_research_tavily_library_vs_workstation_gap_<feature-id>.md
    deep_research_confluence_report_editor_workstation_<feature-id>.md        # conditional
    deep_research_confluence_library_vs_workstation_gap_<feature-id>.md       # conditional
    deep_research_synthesis_report_editor_<feature-id>.md
    artifact_lookup_<feature-id>.md
    coverage_ledger_<feature-id>.md
  drafts/
  task.json
  run.json
```

### 5.3 Data Model

`task.json` additive fields:

1. `primary_feature_id` (string)
2. `supporting_issue_keys` (string array)
3. `supporting_issue_policy` (enum; default `context_only_no_defect_analysis`)
4. `deep_research_policy` (enum; fixed `tavily_first_confluence_second`)
5. `deep_research_topics` (string array)
6. `supporting_summary_required` (boolean)
7. `request_requirements` (array of structured obligation objects)
8. `request_materials` (array of structured material objects)
9. `request_commands` (array of structured command-policy objects)
10. `request_fulfillment_required` (boolean; default `true`)

`run.json` additive fields:

1. `supporting_context_generated_at` (timestamp or null)
2. `deep_research_generated_at` (timestamp or null)
3. `deep_research_fallback_used` (boolean)
4. `notification_pending` (existing behavior retained; payload required on failure)
5. `request_fulfillment_generated_at` (timestamp or null)
6. `request_execution_log` (array of structured execution records)
7. `unsatisfied_request_requirements` (array)

Support relation record shape:

1. `issue_key`
2. `relation_type` (`self` | `parent` | `linked_inward` | `linked_outward`)
3. `source_issue`
4. `depth`
5. `summary_line`
6. `planning_relevance`

Request requirement record shape:

1. `requirement_id`
2. `kind` (`read_material` | `summarize_material` | `run_command_policy` | `perform_research` | `preserve_mode`)
3. `user_text`
4. `required_phase`
5. `required_artifacts`
6. `success_predicate`
7. `blocking_on_missing`

Request material record shape:

1. `material_id`
2. `material_type` (`feature_id` | `confluence_url` | `jira_issue` | `research_topic`)
3. `source_value`
4. `role` (`primary_feature` | `primary_design_doc` | `supporting_issue` | `deep_research_topic`)
5. `must_read`
6. `must_summarize`

Request command-policy record shape:

1. `command_id`
2. `policy_type` (`tool_order` | `mode_guardrail` | `relation_expansion`)
3. `command_text`
4. `enforced_by_phase`
5. `failure_message`

### 5.4 Request Fulfillment Contract

This workflow must not rely on prompt memory to remember what the user asked for. Every user-provided material or command must be normalized into machine-checkable obligations during Phase 0 and validated before Phase 7 promotion.

### Required normalization rule

The user request:

1. feature or page to read,
2. supporting issues to read,
3. summaries to save,
4. research topics to investigate,
5. tool-order commands,
6. mode guardrails,

must be converted into `task.json.request_requirements`, `task.json.request_materials`, and `task.json.request_commands`.

### Required fulfillment rule

Every item in `request_requirements` must end in exactly one state:

1. `satisfied`
2. `blocked_with_reason`
3. `explicitly_waived_by_user`

No requirement may remain implicit or untracked by the time Phase 7 starts.

### Required audit artifacts

Add these runtime artifacts:

1. `context/request_fulfillment_<feature-id>.md`
2. `context/request_fulfillment_<feature-id>.json`

Each artifact must record:

1. `requirement_id`
2. user instruction text
3. enforcing phase
4. evidence artifacts produced
5. execution status
6. blocker or waiver reason

### Minimum obligations for the motivating request

For the user request behind this design, Phase 0 must generate requirement records for all of the following:

1. read the primary Confluence page URL
2. read Jira issue `BCED-2416`
3. read the `BCED-2416` description
4. read linked issues for `BCED-2416`
5. read parent issues for `BCED-2416`
6. summarize `BCED-2416` and its relations
7. save the support summary for future reference
8. research report-editor functionality in Workstation
9. research the Library vs Workstation report-editor gap
10. use `tavily-search` before `confluence`
11. keep `BCED-2416` in support-only mode
12. do not enter defect-analysis mode

### Promotion gate rule

Phase 7 must fail when any blocking request requirement is not `satisfied`.

### 5.5 Goal -> Required Change for Each Phase

### Phase 0 - Runtime Preparation and Intent Lock

Goal:

1. Preserve existing idempotent `REPORT_STATE` behavior.
2. Parse support-only issue instructions and lock policy before evidence collection.

Required changes:

1. Accept support issue keys from request context and save:
   - `context/supporting_issue_request_<feature-id>.md`
2. Parse all user-provided materials and commands into structured request obligations:
   - `request_requirements`
   - `request_materials`
   - `request_commands`
3. Set policy fields in `task.json`:
   - `supporting_issue_policy=context_only_no_defect_analysis`
   - `deep_research_policy=tavily_first_confluence_second`
4. Save initial fulfillment placeholders:
   - `context/request_fulfillment_<feature-id>.md`
   - `context/request_fulfillment_<feature-id>.json`
5. Keep existing user options for `FINAL_EXISTS`, `DRAFT_EXISTS`, `CONTEXT_ONLY`, `FRESH`.
6. Fail fast if user intent tries to combine support-only issue with defect-analysis mode.

User interaction checkpoint:

1. Done: state classified, policies displayed, support issue scope displayed.
2. Blocked: waiting for user choice on resume/regenerate and support issue scope confirmation.
3. Questions: if support issue keys are missing/ambiguous, ask for explicit list before Phase 1.
4. Assumption policy: never auto-assume a support issue key from similar text.

Validation expectations:

1. `runtime_setup_<feature-id>.md` includes support issue policy and deep research policy.
2. `task.json` includes additive fields without removing existing ones.
3. Phase 0 fails if the user asked for a material or command that was not converted into a structured request obligation.

### Phase 1 - Primary Evidence + Supporting Issue Digestion

Goal:

1. Collect primary system-of-record evidence and support issue graph artifacts.

Required changes:

1. Keep primary evidence collection via shared skills:
   - Jira: `jira-cli`
   - Confluence: `confluence`
2. For each support issue key:
   - read issue description
   - traverse parent chain
   - collect linked issues (inward/outward) with bounded depth
3. Persist relation map:
   - `context/supporting_issue_relation_map_<feature-id>.md`
4. Persist summaries:
   - `context/supporting_issue_summary_<issue-key>_<feature-id>.md`
   - `context/supporting_issue_summary_<feature-id>.md` (aggregate)
5. Enforce non-defect route:
   - no `qa_plan_defect_analysis_*` artifact creation
   - no defect-analysis sub-skill invocation
6. Update request fulfillment records for every completed support-material obligation.

User interaction checkpoint:

1. Done: support graph size and artifacts reported.
2. Blocked: relation traversal exceeds cap (default 60 issues) and needs user approval.
3. Questions: whether to include optional linked issue types beyond default set.
4. Assumption policy: default to parent chain + linked inward/outward; do not expand silently.

Validation expectations:

1. `phase1 --post` fails if requested support summary artifact is missing.
2. `phase1 --post` fails if non-defect policy is violated.
3. `phase1 --post` fails if any Phase 1 request requirement is still unexecuted without blocked/waived status.

### Phase 2 - Artifact Index Rebuild

Goal:

1. Ensure support and deep-research artifacts become first-class indexed inputs.

Required changes:

1. Extend `artifact_lookup_<feature-id>.md` schema with columns:
   - `artifact_kind`
   - `source_family`
   - `policy_tag`
   - `phase_required_by`
   - `requirement_ids`
   - `satisfies_user_request`
2. Mandatory indexed kinds:
   - `supporting_issue_request`
   - `supporting_issue_relation_map`
   - `supporting_issue_summary`
   - `deep_research_plan`
   - `deep_research_tavily`
   - `deep_research_confluence` (conditional)
   - `deep_research_synthesis`

User interaction checkpoint:

1. Done: artifact index regenerated and mandatory rows present.
2. Blocked: missing mandatory support artifact rows.
3. Questions: none in normal path.
4. Assumption policy: if mandatory artifact is absent, stop instead of auto-skipping.

Validation expectations:

1. `validate_context_index` includes support and research row checks.
2. `validate_context_index` fails if a required artifact exists but is not mapped back to at least one `request_requirement`.

### Phase 3 - Coverage Ledger + Deep Research

Goal:

1. Convert support summaries and deep research into coverage obligations before drafting.

Required changes:

1. Generate `context/deep_research_plan_<feature-id>.md` with required topics:
   - `report_editor_workstation_functionality`
   - `report_editor_library_vs_workstation_gap`
2. For each topic execute Tavily first and persist:
   - `deep_research_tavily_report_editor_workstation_<feature-id>.md`
   - `deep_research_tavily_library_vs_workstation_gap_<feature-id>.md`
3. Use Confluence fallback only when Tavily evidence is insufficient, then persist:
   - `deep_research_confluence_report_editor_workstation_<feature-id>.md`
   - `deep_research_confluence_library_vs_workstation_gap_<feature-id>.md`
4. Synthesize final research brief:
   - `deep_research_synthesis_report_editor_<feature-id>.md`
5. Inject support + deep-research candidates into `coverage_ledger_<feature-id>.md`.
6. Update request fulfillment records for each research requirement and each tool-order requirement.

Tavily insufficiency criteria (must be machine-checkable):

1. fewer than 3 credible references for the topic (count distinct artifact references in the Tavily output), or
2. missing explicit behavior evidence for required checkpoints (e.g., no Workstation-specific behavior or no Library-vs-Workstation gap statement).
3. Record insufficiency in `run.json.deep_research_fallback_used` and in the Tavily artifact before invoking Confluence fallback.

User interaction checkpoint:

1. Done: research plan, Tavily artifacts, and coverage mapping completed.
2. Blocked: both Tavily and Confluence fallback fail to provide minimally usable evidence.
3. Questions: if fallback still ambiguous, ask user whether to proceed with explicit assumptions.
4. Assumption policy: no silent assumption for missing behavior gaps.

Validation expectations:

1. `phase3 --post` fails if Tavily-first artifacts for both topics are missing.
2. `phase3 --post` fails if synthesis artifact is missing.
3. `phase3 --post` fails if coverage ledger ignores support summary rows.
4. `phase3 --post` fails if a Confluence deep-research artifact exists without a preceding Tavily artifact for the same topic and no explicit user waiver.

### Phase 4a - Subcategory Drafting

Goal:

1. Draft with support and deep-research artifacts as mandatory evidence, not optional notes.

Required changes:

1. Writer task must include support aggregate summary and deep research synthesis as required references.
2. Draft must include explicit scenario coverage for:
   - Workstation behavior
   - Library vs Workstation gap implications
3. Keep existing Phase 4a subcategory constraints unchanged.

User interaction checkpoint:

1. Done: draft produced with evidence-backed coverage.
2. Blocked: missing required support/research citations.
3. Questions: if contradictions exist between support issue and feature doc, ask user for tie-breaker.
4. Assumption policy: do not resolve contradictory requirements silently.

Validation expectations:

1. `validate_phase4a_subcategory_draft` checks evidence trace tags for support and research artifacts.
2. `validate_phase4a_subcategory_draft` fails if a request-marked topic has no corresponding scenario branch or explicit exclusion.

### Phase 4b - Canonical Grouping

Goal:

1. Preserve scenario granularity while grouping support and gap-driven scenarios into canonical layers.

Required changes:

1. Grouping logic cannot merge distinct Workstation-only and Library-gap scenarios when outcomes differ.
2. Relation-map-derived risks must remain visible in grouped structure.

User interaction checkpoint:

1. Done: grouped draft keeps support/gap scenario distinctness.
2. Blocked: grouping requires unsupported merge.
3. Questions: none in normal path.
4. Assumption policy: when in doubt, keep scenarios split.

Validation expectations:

1. `validate_phase4b_category_layering` adds anti-compression checks for support/gap scenarios.
2. `validate_phase4b_category_layering` fails if grouped nodes break `request_requirement` traceability.

### Phase 5a - Full Context Review + Refactor

Goal:

1. Ensure support summary and deep research are fully represented and not dropped.

Required changes:

1. `review_notes` must contain:
   - `Supporting Artifact Coverage Audit`
   - `Deep Research Coverage Audit`
2. If gaps exist, refactor must preserve or increase coverage and update `review_delta`.

User interaction checkpoint:

1. Done: review and refactor completed with explicit audit sections.
2. Blocked: unresolved `rewrite_required` items.
3. Questions: when evidence conflicts remain unresolved after one bounded pass.
4. Assumption policy: no acceptance with unresolved support/research coverage failures.

Validation expectations:

1. `validate_context_coverage_audit` includes support and deep research audit sections.
2. `validate_phase5a_acceptance_gate` blocks `accept` when those audits fail.
3. `validate_phase5a_acceptance_gate` blocks `accept` when `request_fulfillment_<feature-id>.json` still contains unsatisfied blocking requirements.

### Phase 5b - Shipment Checkpoint Review

Goal:

1. Confirm release-readiness includes support-issue and gap-focused coverage.

Required changes:

1. Checkpoint audit includes an explicit row:
   - `supporting_context_and_gap_readiness`
2. Route back to Phase 5a when support/gap context is not release-ready.

User interaction checkpoint:

1. Done: checkpoint audit completed and route decision recorded.
2. Blocked: release recommendation withheld due to support/gap missing coverage.
3. Questions: none in normal path.
4. Assumption policy: default to conservative route-back, not silent acceptance.

Validation expectations:

1. `review-rubric-phase5b` includes support/gap readiness checkpoint.
2. Phase 5b cannot recommend shipment while blocking request requirements remain unsatisfied.

### Phase 6 - Final Quality Pass

Goal:

1. Finalize plan quality without removing support or deep-research backed scenarios.

Required changes:

1. `quality_delta` must show preservation of:
   - support-derived scenarios
   - workstation functionality scenarios
   - library-vs-workstation gap scenarios
2. If cleanup attempts remove these scenarios, return to Phase 5a or 5b.

User interaction checkpoint:

1. Done: final-quality draft produced with preserved support/research coverage.
2. Blocked: cleanup causes coverage regression.
3. Questions: none in normal path.
4. Assumption policy: never trade away required coverage for formatting cleanup.

Validation expectations:

1. `review-rubric-phase6` and final validators include support/research preservation checks.
2. Phase 6 cannot mark quality pass complete if cleanup breaks a user-request trace.

### Phase 7 - Finalization and Notification

Goal:

1. Finalize only after explicit user approval and notify completion safely.

Required changes:

1. Keep existing explicit approval gate.
2. Finalization record must include support and deep-research artifact lineage summary.
3. Send Feishu notification with feature key and final artifact path.
4. On notification failure, persist full payload to `run.json.notification_pending`.
5. Generate final request-fulfillment audit from structured execution records.

User interaction checkpoint:

1. Done: user approved finalization and script completed.
2. Blocked: waiting for explicit user approval.
3. Questions: none in normal path.
4. Assumption policy: no auto-finalize without approval.

Validation expectations:

1. `phase7` fails if finalization record is missing support/research lineage section.
2. Notification fallback payload is mandatory when send fails.
3. `phase7` fails if `request_fulfillment_<feature-id>.json` contains any blocking requirement not marked `satisfied`.

## 6. State Schemas

### `task.json` (additive)

```json
{
  "primary_feature_id": "BCIN-7289",
  "supporting_issue_keys": ["BCED-2416"],
  "supporting_issue_policy": "context_only_no_defect_analysis",
  "deep_research_policy": "tavily_first_confluence_second",
  "deep_research_topics": [
    "report_editor_workstation_functionality",
    "report_editor_library_vs_workstation_gap"
  ],
  "supporting_summary_required": true,
  "request_fulfillment_required": true,
  "request_requirements": [
    {
      "requirement_id": "req-read-support-issue",
      "kind": "read_material",
      "user_text": "must read BCED-2416 carefully",
      "required_phase": "phase1",
      "required_artifacts": ["context/supporting_issue_summary_BCED-2416_BCIN-7289.md"],
      "success_predicate": "supporting issue summary exists",
      "blocking_on_missing": true
    },
    {
      "requirement_id": "req-tool-order-research",
      "kind": "run_command_policy",
      "user_text": "use tavily-search first and confluence second",
      "required_phase": "phase3",
      "required_artifacts": ["context/deep_research_synthesis_report_editor_BCIN-7289.md"],
      "success_predicate": "tavily evidence recorded before any confluence fallback",
      "blocking_on_missing": true
    }
  ]
}
```

### `run.json` (additive)

```json
{
  "supporting_context_generated_at": "2026-03-11T10:40:00Z",
  "deep_research_generated_at": "2026-03-11T10:55:00Z",
  "deep_research_fallback_used": true,
  "request_fulfillment_generated_at": "2026-03-11T11:05:00Z",
  "request_execution_log": [
    {
      "requirement_id": "req-read-support-issue",
      "phase": "phase1",
      "status": "satisfied",
      "artifacts": ["context/supporting_issue_summary_BCED-2416_BCIN-7289.md"]
    },
    {
      "requirement_id": "req-tool-order-research",
      "phase": "phase3",
      "status": "satisfied",
      "artifacts": [
        "context/deep_research_tavily_report_editor_workstation_BCIN-7289.md",
        "context/deep_research_synthesis_report_editor_BCIN-7289.md"
      ]
    }
  ],
  "unsatisfied_request_requirements": [],
  "notification_pending": null
}
```

## 7. Implementation Layers

1. Intake and policy layer:
   - parse primary vs support issue roles
   - lock non-defect policy
2. Evidence and relation layer:
   - collect issue graph and support summaries
3. Research enrichment layer:
   - Tavily-first background research with conditional Confluence fallback
4. Coverage normalization layer:
   - map support/research artifacts into ledger obligations
5. Draft/review quality layer:
   - preserve required support/gap coverage through Phase 4-6
6. Finalization and notification layer:
   - approved promotion plus Feishu fallback persistence

## 8. Script Inventory and Function Specifications

Standards Exception Note:

1. `qa-plan-orchestrator` is a script-bearing OpenClaw skill; script tests remain under `scripts/test/` by OpenClaw exception.

### 8.1 `workspace-planner/skills/qa-plan-orchestrator/scripts/phase0.sh`

Invocation:

1. `bash scripts/phase0.sh <feature-id> <run-dir>`

| function | responsibility | inputs | outputs | side effects | failure mode |
|----------|----------------|--------|---------|--------------|--------------|
| `main` | classify state and lock support/research policy | feature-id, run-dir, incoming task fields | runtime setup artifacts, updated task.json | writes policy fields and runtime setup files | exits non-zero on ambiguous support scope or incompatible mode |

Required implementation updates:

1. Parse raw user request text into `request_materials`, `request_requirements`, and `request_commands`.
2. Write `context/supporting_issue_request_<feature-id>.md`.
3. Write `context/request_fulfillment_<feature-id>.md` and `.json` with placeholder rows for every requirement.
4. Reject runs where an explicit user command is not representable in the structured model.

Supporting modules to update:

1. `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/workflowState.mjs`
2. `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/contextRules.mjs`

### 8.2 `workspace-planner/skills/qa-plan-orchestrator/scripts/phase1.sh`

Invocation:

1. `bash scripts/phase1.sh <feature-id> <run-dir> [--post]`

| function | responsibility | inputs | outputs | side effects | failure mode |
|----------|----------------|--------|---------|--------------|--------------|
| `main` | spawn primary evidence collection and support issue digestion | feature-id, run-dir, supporting issue keys | support relation map, support summaries, spawn manifest | writes context artifacts and run/task timestamps | exits non-zero when required summary artifacts are missing |

Required implementation updates:

1. Add spawn-manifest entries for support-issue relation expansion and summary generation.
2. Record exact artifact outputs per request requirement.
3. Update fulfillment artifacts after `--post`.

Supporting modules to update:

1. `workspace-planner/skills/qa-plan-orchestrator/scripts/phase1_build_spawn_manifest.mjs`
2. `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/recordSpawnCompletion.mjs`
3. `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/save_context.sh`

### 8.3 `workspace-planner/skills/qa-plan-orchestrator/scripts/phase2.sh`

Invocation:

1. `bash scripts/phase2.sh <feature-id> <run-dir>`

| function | responsibility | inputs | outputs | side effects | failure mode |
|----------|----------------|--------|---------|--------------|--------------|
| `main` | rebuild artifact lookup with support/research kinds | feature-id, run-dir, context directory | artifact_lookup_<feature-id>.md | rewrites artifact index | exits non-zero if mandatory support rows are absent |

Required implementation updates:

1. Add `requirement_ids` and `satisfies_user_request` columns.
2. Fail when an artifact required by a request requirement is not indexed.

Supporting modules to update:

1. `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/artifactLookup.mjs`

### 8.4 `workspace-planner/skills/qa-plan-orchestrator/scripts/phase3.sh`

Invocation:

1. `bash scripts/phase3.sh <feature-id> <run-dir> [--post]`

| function | responsibility | inputs | outputs | side effects | failure mode |
|----------|----------------|--------|---------|--------------|--------------|
| `main` | produce coverage ledger plus Tavily-first research artifacts | feature-id, run-dir, indexed context artifacts | deep research artifacts, synthesis artifact, coverage ledger | writes context research files and ledger | exits non-zero when Tavily-first proof or synthesis is missing |

Required implementation updates:

1. Emit research obligations directly from `request_requirements`.
2. Persist tool-order evidence in the execution log.
3. Refuse Confluence fallback when Tavily proof for the same topic does not exist.

Supporting modules to update:

1. `workspace-planner/skills/qa-plan-orchestrator/scripts/phase3_build_spawn_manifest.mjs`
2. `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/spawnManifestBuilders.mjs`

### 8.4a `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/spawnManifestBuilders.mjs`

Invocation:

1. imported by phase manifest builders

| function | responsibility | inputs | outputs | side effects | failure mode |
|----------|----------------|--------|---------|--------------|--------------|
| `buildSupportingIssueSpawnRequest` | build normalized Phase 1 spawn entries for support issue read, relation expansion, and summary generation | feature-id, support issue key, run-dir, request requirement ids | manifest request object with artifact targets and requirement trace ids | none | throws when support issue artifact targets or requirement ids are missing |
| `buildDeepResearchSpawnRequest` | build normalized Phase 3 spawn entries for Tavily-first topic research and conditional Confluence fallback | feature-id, topic slug, run-dir, deep research policy, request requirement ids | manifest request object with ordered research steps and required artifact targets | none | throws when policy is not `tavily_first_confluence_second` or when Confluence fallback is requested without Tavily prerequisite |

Required implementation updates:

1. Emit `request_requirement_ids` into manifest metadata for every support and research spawn.
2. Emit exact output artifact targets into manifest metadata so `--post` validation can prove requirement satisfaction.
3. Reject manifests that allow Confluence fallback without Tavily prerequisite evidence.

### 8.5 `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/validate_plan_artifact.mjs`

Invocation:

1. `node scripts/lib/validate_plan_artifact.mjs <validator-name> <artifact-path>`

| function | responsibility | inputs | outputs | side effects | failure mode |
|----------|----------------|--------|---------|--------------|--------------|
| `validate_supporting_context_integrity` | verify support summary/research invariants | artifact path, feature-id context artifacts | pass/fail result | none | fails when support-only non-defect policy or Tavily-first policy is violated |

Additional validators required:

1. `validate_request_fulfillment_manifest`
   - fails when a user instruction was not converted into a structured requirement
2. `validate_request_fulfillment_status`
   - fails when a blocking requirement is still unsatisfied
3. `validate_research_order`
   - fails when Confluence fallback appears before Tavily evidence

## 9. Script Test Stub Matrix

| Script Path | Test Stub Path | Scenarios | Smoke Command |
|-------------|----------------|-----------|---------------|
| `workspace-planner/skills/qa-plan-orchestrator/scripts/phase0.sh` | `workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase0.test.sh` | support-policy lock; ambiguous support scope; REPORT_STATE compatibility; user request normalized into requirement rows | `bash workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase0.test.sh` |
| `workspace-planner/skills/qa-plan-orchestrator/scripts/phase1.sh` | `workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase1.test.sh` | support graph digest; summary artifact required; non-defect guard; Phase 1 request requirements satisfied | `bash workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase1.test.sh` |
| `workspace-planner/skills/qa-plan-orchestrator/scripts/phase2.sh` | `workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase2_artifact_index.test.sh` | support/research artifact kinds indexed; request requirement to artifact mapping preserved | `bash workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase2_artifact_index.test.sh` |
| `workspace-planner/skills/qa-plan-orchestrator/scripts/phase3.sh` | `workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase3.test.sh` | Tavily-first evidence required; Confluence fallback gating; synthesis required; tool-order request requirement satisfied | `bash workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase3.test.sh` |
| `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/spawnManifestBuilders.mjs` | `workspace-planner/skills/qa-plan-orchestrator/scripts/test/spawnManifestBuilders.test.mjs` | support issue spawn request trace ids; deep research ordering; Confluence fallback rejection without Tavily prerequisite | `node --test workspace-planner/skills/qa-plan-orchestrator/scripts/test/spawnManifestBuilders.test.mjs` |
| `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/validate_plan_artifact.mjs` | `workspace-planner/skills/qa-plan-orchestrator/scripts/test/validate_plan_artifact.test.mjs` | support context integrity; request fulfillment; research order validator cases | `node --test workspace-planner/skills/qa-plan-orchestrator/scripts/test/validate_plan_artifact.test.mjs` |

When Phase 4a/4b/5a/5b/6 contracts are updated, the corresponding test stubs (`phase4a.test.sh`, `phase4b.test.sh`, `phase5a.test.sh`, `phase5b.test.sh`, `phase6.test.sh`) must be updated to cover the new support/research validation expectations.

## 10. Files To Create / Update

Planned updates for implementation (not part of this design-only change):

1. Update `workspace-planner/skills/qa-plan-orchestrator/SKILL.md`
2. Update `workspace-planner/skills/qa-plan-orchestrator/reference.md`
3. Update `workspace-planner/skills/qa-plan-orchestrator/references/context-coverage-contract.md`
4. Update `workspace-planner/skills/qa-plan-orchestrator/references/context-index-schema.md`
5. Update `workspace-planner/skills/qa-plan-orchestrator/references/phase4a-contract.md`
6. Update `workspace-planner/skills/qa-plan-orchestrator/references/phase4b-contract.md`
7. Update `workspace-planner/skills/qa-plan-orchestrator/references/review-rubric-phase5a.md`
8. Update `workspace-planner/skills/qa-plan-orchestrator/references/review-rubric-phase5b.md`
9. Update `workspace-planner/skills/qa-plan-orchestrator/references/review-rubric-phase6.md`
10. Update `workspace-planner/skills/qa-plan-orchestrator/scripts/phase0.sh`
11. Update `workspace-planner/skills/qa-plan-orchestrator/scripts/phase1.sh`
12. Update `workspace-planner/skills/qa-plan-orchestrator/scripts/phase1_build_spawn_manifest.mjs`
13. Update `workspace-planner/skills/qa-plan-orchestrator/scripts/phase2.sh`
14. Update `workspace-planner/skills/qa-plan-orchestrator/scripts/phase3.sh`
15. Update `workspace-planner/skills/qa-plan-orchestrator/scripts/phase3_build_spawn_manifest.mjs`
16. Update `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/validate_plan_artifact.mjs`
17. Update `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/spawnManifestBuilders.mjs`
18. Update `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/workflowState.mjs`
19. Update `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/contextRules.mjs`
20. Update `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/artifactLookup.mjs`
21. Update `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/recordSpawnCompletion.mjs`
22. Update `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/save_context.sh`
23. Add `workspace-planner/skills/qa-plan-orchestrator/scripts/test/validate_plan_artifact.test.mjs`
24. Add `workspace-planner/skills/qa-plan-orchestrator/scripts/test/spawnManifestBuilders.test.mjs`
25. Update `workspace-planner/skills/qa-plan-orchestrator/evals/evals.json`
26. Update `workspace-planner/skills/qa-plan-orchestrator/evals/README.md`
27. Update `workspace-planner/skills/qa-plan-orchestrator/tests/docsContract.test.mjs`

## 11. README Impact

`workspace-planner/skills/qa-plan-orchestrator/README.md` should be updated to add:

1. Support-issue context handling contract.
2. Deep research policy (`tavily-search` first, `confluence` second).
3. Support-only non-defect-analysis guardrail explanation.
4. New context artifact map.

## 12. Backfill Coverage Table

| Script Path | Test Stub Path | Failure-Path Stub |
|-------------|----------------|-------------------|
| `workspace-planner/skills/qa-plan-orchestrator/scripts/phase0.sh` | `workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase0.test.sh` | ambiguous support issue scope |
| `workspace-planner/skills/qa-plan-orchestrator/scripts/phase1.sh` | `workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase1.test.sh` | support summary missing or defect-mode contamination |
| `workspace-planner/skills/qa-plan-orchestrator/scripts/phase2.sh` | `workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase2_artifact_index.test.sh` | support/research rows missing in artifact lookup |
| `workspace-planner/skills/qa-plan-orchestrator/scripts/phase3.sh` | `workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase3.test.sh` | missing Tavily-first artifacts or synthesis |
| `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/spawnManifestBuilders.mjs` | `workspace-planner/skills/qa-plan-orchestrator/scripts/test/spawnManifestBuilders.test.mjs` | missing request requirement ids or illegal Confluence-first fallback manifest |
| `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/validate_plan_artifact.mjs` | `workspace-planner/skills/qa-plan-orchestrator/scripts/test/validate_plan_artifact.test.mjs` | support-context integrity validator rejects invalid artifacts |

## 13. Quality Gates

Implementation must not be considered complete unless all are true:

1. Phase 0 keeps existing `REPORT_STATE` behavior with additive support/research policy fields.
2. Support issues are summarized from description + parent + linked relations and saved under `context/`.
3. `BCED-2416`-style support issues remain `context_only_no_defect_analysis`.
4. Deep research records Tavily-first artifacts for both required report-editor topics.
5. Confluence deep-research fallback occurs only after Tavily insufficiency is recorded.
6. `artifact_lookup` and `coverage_ledger` include support + deep-research artifacts.
7. Phase 4-6 validators enforce support/research coverage preservation.
8. Phase 7 writes Feishu failure payload to `run.json.notification_pending` when notify fails.
9. Every user-provided material and command is represented in `task.json.request_requirements`.
10. Every blocking request requirement is represented in `context/request_fulfillment_<feature-id>.json`.
11. Promotion is blocked when any blocking request requirement is unsatisfied.
12. Evals (and eval_groups) cover support context integrity, deep research ordering, and request fulfillment (Section 14).

Mandatory design review artifacts for this design:

1. `projects/agent-design-review/qa-plan-orchestrator-supporting-artifact-and-deep-research-2026-03-11/design_review_report.md`
2. `projects/agent-design-review/qa-plan-orchestrator-supporting-artifact-and-deep-research-2026-03-11/design_review_report.json`

## 14. Evals Updates

`evals/evals.json` must be updated to cover the new validation contracts introduced by this design.

### 14.1 New eval_groups (or extend existing)

1. **support_context_integrity** (blocking)
   - prompt: Verify support-only issues are not routed into defect-analysis; support summaries exist under `context/`.
   - expected_failure_signals: defect-analysis routing, missing support summary artifact
   - expected_remediation_output: corrected policy or regenerated support summary

2. **deep_research_ordering** (blocking)
   - prompt: Verify Tavily-first research ordering; Confluence fallback only after Tavily insufficiency is recorded.
   - expected_failure_signals: Confluence artifact without preceding Tavily artifact, tavily_first violation
   - expected_remediation_output: corrected research order or explicit user waiver

3. **request_fulfillment** (blocking)
   - prompt: Verify every user-provided material/command is normalized into `request_requirements` and satisfied before Phase 7.
   - expected_failure_signals: unsatisfied blocking requirement, missing requirement_id
   - expected_remediation_output: updated `request_fulfillment_<feature-id>.json` or Phase 7 block

### 14.2 Files to update

- `evals/evals.json` — add eval_groups above
- `evals/README.md` — add smoke commands for support/research flows if applicable
- `tests/docsContract.test.mjs` — add assertions for new eval_groups if they become mandatory contract checks

## 15. References

Implementation note:

1. Home-directory skill references in this section are environment-specific design references only.
2. Implementation must not hardcode user-home skill paths into scripts, validators, or runtime state.

1. `workspace-planner/skills/qa-plan-orchestrator/SKILL.md`
2. `workspace-planner/skills/qa-plan-orchestrator/reference.md`
3. `workspace-planner/skills/qa-plan-orchestrator/references/context-coverage-contract.md`
4. `workspace-planner/skills/qa-plan-orchestrator/docs/PHASE4_LAYERING_AND_COVERAGE_HARNESS_REMEDIATION_DESIGN.md`
5. `.agents/skills/openclaw-agent-design/SKILL.md`
6. `.agents/skills/openclaw-agent-design/reference.md`
7. `.agents/skills/agent-idempotency/SKILL.md`
8. `.agents/skills/openclaw-agent-design-review/SKILL.md`
9. `.agents/skills/openclaw-agent-design-review/reference.md`
10. `.agents/skills/clawddocs/SKILL.md`
11. `.agents/skills/code-structure-quality/SKILL.md`
12. `$HOME/.agents/skills/skill-creator/SKILL.md` (user-level shared skill; external to repo; documentation reference only)
13. `$HOME/.codex/skills/.system/skill-creator/SKILL.md` (workspace-available system skill reference for validation context)
