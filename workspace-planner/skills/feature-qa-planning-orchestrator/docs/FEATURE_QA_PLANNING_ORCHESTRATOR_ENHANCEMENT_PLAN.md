# Feature QA Planning Orchestrator Enhancement Plan

**Date:** 2026-03-10
**Status:** Proposed
**Scope:** `workspace-planner/skills/feature-qa-planning-orchestrator`

## 1. Why This Change Is Needed

The current orchestrator gets the pipeline shape mostly right, but the quality contract is too weak. The result is predictable:

1. Context is fetched, but not translated into a clear coverage model.
2. Test steps often look structured, but are still not reliably executable by a manual tester.
3. E2E coverage is inconsistent or missing.
4. Review does not materially improve the draft because the reviewer is not told what must be rejected.
5. The docs set mixes current rules with stale redesign notes, so the LLM does not get one clean source of truth.

### Evidence in current artifacts

- `workspace/projects/embedding-dashboard-editor-workstation/comapare-result.md` says Plan 1 is stronger on coverage, executable steps, and context usage, while Plan 2 under-translates report-editor research into test coverage.
- `workspace-planner/projects/feature-plan/BCED-2416/drafts/qa-plan-draft-v1.md` and `workspace-planner/projects/feature-plan/BCED-2416/drafts/qa-plan-draft-v2.md` show limited improvement between review rounds. The main visible delta is added sections, not a stronger execution contract.
- `workspace-planner/skills/feature-qa-planning-orchestrator/references/qa-plan-contract-simple.md` only defines high-level structure and priority markers.
- `workspace-planner/skills/feature-qa-planning-orchestrator/templates/qa-plan-template.md` is explicitly a soft contract.
- Current validation only checks artifact existence and XMindMark syntax. It does not check context coverage, step executability, or E2E minimums.

## 2. Goals

This enhancement should make the skill reliably produce a comprehensive, executable QA plan from large multi-source context.

### Goals

1. Treat the template as a real contract, not a loose example.
2. Tell the writer exactly how to turn context into coverage obligations and executable scenarios.
3. Tell the reviewer exactly what to reject, rewrite, and verify before approving a draft.
4. Require explicit E2E coverage for the feature's real lifecycle: entrypoint -> main workflow -> relevant completion/interruption/error/regression paths.
5. Add a context summary/index layer so large evidence sets can be used consistently.
6. Save every intermediate planning artifact to `context/` so the workflow is resumable, reviewable, and auditable.
7. Add evals that measure context extraction, context usage, executability, reviewer improvement, and E2E coverage.
8. Remove or archive stale docs so the skill has one current operating contract.
9. Add a lightweight doc-governance rule so docs stay aligned with the skill as it evolves.

### Non-goals

1. Changing the external user workflow for final approval.
2. Rewriting unrelated planner skills in this pass.
3. Implementing the skill refactor in this document. This doc is design only.

## 3. Current Failure Modes

## 3.1 Contract failure

The current contract defines formatting, but not behavior.

- It says output should be `Scenario -> Step 1 -> optional Step 2 -> expected result`.
- It does not define how the writer proves that all important context was converted into scenarios.
- It does not define what qualifies as an executable step.
- It does not define required E2E coverage families.
- It does not define what review must fail on beyond vague wording and missing markers.

Result: the model can satisfy the visible syntax while still producing shallow or non-actionable content.

## 3.2 Write-phase failure

The write phase has no required intermediate artifacts between "read context" and "write draft".

- There is no mandatory context inventory.
- There is no context-to-coverage matrix.
- There is no scenario ledger that proves each major source finding became a test family, an assumption, or an explicit exclusion.
- There is no rule separating manual user actions from implementation detail.

Result: the writer can over-index on whichever source is easiest to summarize.

## 3.3 Review-phase failure

The review phase is under-specified.

- It does not require comparison against the source context inventory.
- It does not require an executability audit.
- It does not require detection of implementation-level wording in manual steps.
- It does not require "v1 vs v2" improvement evidence.

Result: review tends to restate quality aspirations instead of forcing structural corrections.

## 3.4 Documentation failure

The skill has duplicated or stale guidance.

- `docs/xmind-refactor-plan-merged.md` is a large historical redesign document that still describes deprecated sub-skills and phase flows.
- `README.md` already contains stale references such as `check_resume.sh`, which is not present in this skill folder.
- `reference.md`, `SKILL.md`, `qa-plan-contract-simple.md`, and the template all overlap, but none is sufficiently authoritative on write/review behavior.

Result: the LLM sees multiple partially-correct documents and does not know which one to obey.

## 4. Proposed Design

## 4.1 Make the template the contract, not an example

Replace the current "soft contract" model with a two-layer contract:

1. **Hard contract**: exact mandatory sections, coverage obligations, review gates, and executability rules.
2. **Template scaffold**: XMindMark shape that mirrors the hard contract exactly.

### Proposed contract model

- `templates/qa-plan-template.md`
  - Becomes the canonical output scaffold.
  - Must define the required top-level sections and expected branch shape.
- `references/qa-plan-contract.md`
  - Replaces `references/qa-plan-contract-simple.md`.
  - Defines what each required section means and what must appear there.
- `references/executable-step-rubric.md`
  - Defines pass/fail rules for manual-step quality.
- `references/context-coverage-contract.md`
  - Defines how source evidence becomes coverage obligations.
- `references/review-rubric.md`
  - Defines what review must verify and when it must fail.

### Feature-shape neutrality rule

The contract must be strict about coverage quality, but neutral about feature shape.

Rules:

1. Do not hardcode authoring-style lifecycle assumptions such as `create/edit/save` into universal requirements.
2. Do not hardcode viewer-style, approval-style, or routing-style assumptions either.
3. Select journey types, scenario families, and completion states from the `context_index`, not from template examples.
4. Examples in the template, rubric, and reference files are illustrative only. They must never be treated as mandatory workflow shapes unless the context explicitly matches them.

### Required top-level plan sections

The template contract should require these sections unless explicitly marked "not applicable with reason":

1. `EndToEnd`
2. `Core Functional Flows`
3. `Error Handling / Recovery`
4. `Regression / Known Risks`
5. `Permissions / Security / Data Safety`
6. `Compatibility / Platform / Environment`
7. `Observability / Performance / UX Feedback`
8. `Out of Scope / Assumptions`

### Required section-level rules

- `EndToEnd` must contain at least:
  - one primary happy-path journey covering the feature's main user outcome
  - one interruption / exit / state-transition journey when the feature supports cancel, close, navigation away, pause/resume, or unsaved-state behavior
  - one failure/recovery journey when the feature has error handling or recoverable failure states
- `Core Functional Flows` must be derived from the context index, not from free-form brainstorming.
- `Regression / Known Risks` must map back to the actual risk evidence used for the run, such as tracked defects, code-change evidence, prior incidents, support escalations, release notes, or explicit parity gaps.
- `Out of Scope / Assumptions` must explain any omitted context item so missing coverage is visible.

## 4.2 Add a context summary/index layer

The orchestrator currently saves raw context artifacts, but it does not normalize them into one planning model. Add a required context-index artifact before writing begins.

### Artifact persistence rule

All intermediate planning artifacts must be saved on disk under the feature run's `context/` folder before the next phase starts.

Rule:

1. If an artifact is evidence, normalization, analysis, review, or refactor guidance, it belongs in `context/`.
2. Only draft QA plan snapshots belong in `drafts/`.
3. Only the promoted final output belongs at the project root as the final artifact.

This means review output, context summaries, coverage mappings, gap lists, rewrite instructions, and validation summaries are all persisted under `context/`.

### Source-model neutrality rule

The workflow must be strict about source traceability, but neutral about which source families exist in a given run.

Rules:

1. Requested source families are mandatory for that run.
2. Unrequested source families are optional and must not be invented just to satisfy a template.
3. Source-specific artifacts listed in this document are canonical examples, not a universal minimum set.
4. Phase gates should validate the requested source set, not a hardcoded Jira/GitHub/Figma/Confluence bundle.

### Phase-by-phase artifact placement

1. Phase 1 evidence fetch:
   - save under `context/`
2. Context normalization:
   - save under `context/`
3. Coverage mapping / ledger:
   - save under `context/`
4. Review findings:
   - save under `context/`
5. Refactor instructions / delta summaries:
   - save under `context/`
6. Draft QA plans:
   - save under `drafts/`
7. Final approved QA plan:
   - save as final artifact only after promotion

### New artifact

- `context/context_index_<feature-id>.md`

### Purpose

The context index is the writer's mandatory input summary. It converts raw evidence into stable planning units.

### Required fields in the index

1. Feature summary
2. Primary user journeys
3. Entry points
4. Core capability families
5. Known risks and regressions
6. Permissions / auth / environment constraints
7. Data fixtures and setup requirements
8. Unsupported / deferred / ambiguous items
9. Traceability map:
   - source artifact
   - extracted fact
   - planning consequence

### Rule

No draft writing starts until the context index exists and passes validation.

## 4.3 Add a coverage ledger before drafting

Add a second required intermediate artifact:

- `context/coverage_ledger_<feature-id>.md`
- `context/coverage_gaps_<feature-id>.md` when the mapper finds unresolved or deferred items

This ledger forces the writer to explicitly decide what to do with each major fact from the context index.

### Required ledger columns

1. Context item
2. Source artifact
3. Coverage type:
   - `E2E`
   - `Functional`
   - `Error`
   - `Regression`
   - `Compatibility`
   - `OutOfScope`
3. Planned scenario name
4. Priority
5. Reason if excluded or deferred

### Why this matters

This is the missing bridge between "context gathered" and "plan written". It is the main mechanism for improving context usage.

## 4.4 Add explicit writer instructions

The writer needs stronger instructions than "use saved artifacts one by one".

### New writer responsibilities

The write phase should be required to do this in order:

1. Read `context_index_<feature-id>.md`
2. Build `coverage_ledger_<feature-id>.md`
3. Draft required E2E journeys first
4. Draft remaining scenario families from the ledger
5. Rewrite every step using the executability rubric
6. Validate:
   - XMindMark syntax
   - E2E presence
   - ledger-to-draft coverage completeness

### Writer prompt contract

The writer instructions should explicitly say:

- Do not write a scenario unless you can name the user action, entry point, and expected observable result.
- Prefer user-visible actions and results.
- Do not use internal API names, service names, or implementation hooks in manual steps unless they are the only observable way to verify the behavior. If used, place them in a verification note, not in the main action step.
- Every major capability family in the context index must land in one of:
  - an E2E scenario
  - a functional scenario
  - a regression scenario
  - an explicit out-of-scope note
- If a step is not executable because a trigger, failure mode, or product term is unclear, perform one bounded research pass before rewriting:
  - first use the `confluence` skill when internal product documentation is likely to exist
  - otherwise use `tavily-search`
  - save the result under `context/` before reusing it in the draft
- If one-shot research still cannot make the step executable, do not silently remove the step or scenario. Keep it with an explicit unresolved comment and route it into coverage gaps and review outputs.

### Executable-step rubric

Each scenario should pass this checklist:

1. Precondition is observable or setup-able by QA.
2. Action names a concrete UI/system action.
3. Object/target is named.
4. Expected result is observable without code reading.
5. Hidden implementation details are removed from the main step wording.
6. If verification requires logs, backend checks, or SDK hooks, that is called out as an additional verification note.
7. If an error-handling trigger is unclear, the scenario includes either a research-backed trigger description or an explicit unresolved comment with next action.

### One-shot research fallback for non-executable steps

This is required when the writer or reviewer encounters wording like:

- internal error names without clear repro actions
- ambiguous system failures
- unclear product terms
- error states that appear in context but do not include reproducible triggers

Required behavior:

1. perform one bounded research attempt
2. prefer internal documentation search via `confluence`
3. use `tavily-search` when internal documentation is absent or insufficient
4. save the research result to `context/research_executability_<slug>_<feature-id>.md`
5. rewrite the step using the saved research if the research is sufficient
6. if still unresolved, preserve the step with an explicit comment:
   - `Comment: trigger still unclear after one-shot research; see context/research_executability_<slug>_<feature-id>.md`
7. record the unresolved item in:
   - `context/coverage_gaps_<feature-id>.md`
   - `context/review_rewrite_requests_<feature-id>.md`
   - `context/review_qa_plan_<feature-id>.md`

Bound:

- at most 2 searches per unresolved step total
- prefer 1 internal-doc query first, then 1 external/product-doc query if still unresolved
- if both attempts fail, stop researching that step and preserve it as unresolved

## 4.5 Add explicit reviewer instructions

The reviewer should no longer be a general quality pass. It should be a contract audit.

### New review artifact

- `context/review_qa_plan_<feature-id>.md`
  - keep current path
  - strengthen required contents
- `context/review_rewrite_requests_<feature-id>.md`
  - optional separate file when blocking rewrites are extensive
- `context/review_delta_<feature-id>.md`
  - required after refactor to record which blocking findings were resolved, deferred, or still open

### Reviewer checks

The reviewer must score and comment on:

1. Context completeness
2. Context-to-coverage translation
3. E2E completeness
4. Step executability
5. Priority correctness
6. Source-backed regression coverage
7. Plan readability and deduplication

### Reviewer fail conditions

Phase 3 must fail if any of the following are true:

1. A core capability in `context_index` has no matching scenario or explicit exclusion.
2. `EndToEnd` section is missing required main-path coverage.
3. Any scenario uses non-executable wording such as "verify correct behavior", "test parity", "ensure it works", or "perform another valid action".
4. Manual steps rely mainly on implementation terms such as service names, bridge APIs, or internal function calls.
5. v2 does not materially address blocking review findings from v1.
6. A non-executable step was silently removed instead of being rewritten, researched, or preserved with an explicit unresolved comment.
7. An unclear error-handling scenario was left vague without either research-backed clarification or an explicit unresolved next action.

### Reviewer output contract

The review artifact should include:

1. Blocking findings
2. Non-blocking findings
3. Missing coverage matrix
4. Vague step rewrite requests
5. E2E gap list
6. `accept` or `reject`
7. concrete next action for every failed blocking item
8. linked research artifact or research recommendation for every unresolved executability item

All reviewer-generated outputs must be saved to `context/` before Phase 4 starts. No in-memory-only review is allowed.

## 4.6 Introduce targeted sub-agents for large-context planning

Yes: the design should use sub-agents, but only for bounded work where they improve context fidelity. The problem is not just "lack of instructions"; it is also that one LLM is being asked to gather, normalize, cover, write, and review large context in one chain.

### Proposed sub-agent use

Keep current source-fetch sub-agents, and add two bounded analysis roles:

1. **Context normalizer sub-agent**
   - Input: raw saved context for one source family
   - Output: normalized bullets for the context index
   - Responsibility: extract capabilities, risks, fixtures, and exclusions
2. **Coverage mapper sub-agent**
   - Input: merged context index
   - Output: coverage ledger proposal
   - Responsibility: identify E2E journeys, functional families, regressions, and gaps

### Keep these phases centralized

- Final unified plan writing should remain orchestrator-owned.
- Final review should remain orchestrator-owned.

This preserves one final voice while using sub-agents where context decomposition is the real bottleneck.

### Exact spawn policy for the orchestrator

The orchestrator should follow an explicit spawn policy rather than making ad-hoc spawn decisions.

### Spawn when

Spawn sub-agents only when the work is:

1. source-bounded
2. artifact-producing
3. parallelizable
4. not the final authoritative voice of the QA plan or review verdict

### Do not spawn when

Do not spawn sub-agents for:

1. final unified draft writing
2. final review verdict
3. final refactor acceptance decision
4. finalization / promotion
5. any step whose output is a single authoritative orchestration decision

### Phase-by-phase spawn matrix

| Phase | Task | Spawn? | Owner | Required saved output |
| --- | --- | --- | --- | --- |
| 0 | existing-state detection | no | orchestrator | `context/phase0_state_<feature-id>.md`, `task.json`, `run.json` |
| 0 | runtime capability check | no | orchestrator | `context/runtime_capabilities_<feature-id>.md` |
| 1 | fetch per requested source family | yes | source sub-agents | source artifacts + `source_summary_<domain>_<feature-id>.md` |
| 2 | normalize one source family into planning facts | yes | context-normalizer sub-agents | normalization notes or source-normalization artifacts under `context/` |
| 2 | merge normalized context into canonical index | no | orchestrator | `context/context_index_<feature-id>.md` |
| 3 | propose coverage mapping from context index | yes, when context is large or multi-family | coverage-mapper sub-agent | proposal artifacts under `context/` |
| 3 | finalize coverage ledger and E2E map | no | orchestrator | `context/coverage_ledger_<feature-id>.md`, `context/e2e_journey_map_<feature-id>.md` |
| 4 | final unified draft writing | no | orchestrator | `drafts/qa_plan_v<N>.md` |
| 4 | optional section-scoped rewrite suggestions for oversized drafts | yes, bounded and section-scoped only | rewrite helper sub-agent | rewrite notes under `context/` |
| 5 | final review verdict | no | orchestrator | `context/review_qa_plan_<feature-id>.md` |
| 5 | optional section-scoped audit helpers for very large drafts | yes, bounded and section-scoped only | review helper sub-agents | audit notes under `context/` |
| 6 | apply approved refactor actions | no | orchestrator | `drafts/qa_plan_v<N+1>.md`, `context/review_delta_<feature-id>.md` |
| 7 | finalization and promotion | no | orchestrator | `qa_plan_final.md`, `context/finalization_record_<feature-id>.md` |

### Spawn-output rule

If a sub-agent is spawned, its output is not usable until it is:

1. saved under `context/`
2. registered in `task.json.artifacts`
3. recorded in `run.json.spawn_history`

### Eval coverage for spawn behavior

The implementation should add evals that check:

1. source collection work is delegated when multiple source families are requested
2. final writing is not delegated
3. final review verdict is not delegated
4. optional helper sub-agents stay section-scoped and do not replace orchestrator ownership
5. every spawned task leaves a saved artifact trail in `context/` plus state-file updates

## 4.7 Add deterministic validators beyond XMindMark

The current validators only check file presence and XMind syntax. Add lightweight content validators.

### Proposed new validation checks

1. `validate_context_index`
   - confirms required headings/fields exist
2. `validate_coverage_ledger`
   - confirms every indexed capability is classified
3. `validate_e2e_minimum`
   - confirms the draft includes required E2E branches
4. `validate_executable_steps`
   - flags banned vague phrases and implementation-heavy wording
5. `validate_review_delta`
   - confirms Phase 4 addressed blocking findings from Phase 3
6. `validate_unresolved_step_handling`
   - confirms unresolved steps are preserved with comments, linked research, and next actions rather than silently removed

These can begin as simple heuristic scripts plus evals; they do not need perfect semantic understanding to provide value.

## 4.8 Detailed phase-by-phase artifact contract

This section is the exact artifact model the implementation should follow.

### Phase 0 - Runtime preparation and existing-state check

### Required outputs

1. `context/phase0_state_<feature-id>.md`
2. `context/runtime_capabilities_<feature-id>.md`
3. `task.json`
4. `run.json`

### Exact content: `task.json`

Required fields:

- `feature_id`
- `run_key`
- `overall_status`
- `current_phase`
- `report_state`
- `selected_mode`
- `requested_source_families`
- `completed_source_families`
- `spawn_plan`
- `artifacts`
- `latest_draft_version`
- `latest_review_version`
- `latest_validation_version`
- `created_at`
- `updated_at`

### Required field meanings for `task.json`

- `feature_id`
  - canonical feature identifier for the run
- `run_key`
  - stable run instance id
- `overall_status`
  - one of: `not_started` | `in_progress` | `blocked` | `awaiting_approval` | `completed`
- `current_phase`
  - one of the orchestrator phases from this design
- `report_state`
  - existing-state classification used by Phase 0
- `selected_mode`
  - user-safe execution choice for this run
- `requested_source_families`
  - array of source families actually required for this run
- `completed_source_families`
  - array of source families with saved outputs
- `spawn_plan`
  - current spawn decisions by phase
- `artifacts`
  - object mapping artifact role to saved path
- `latest_draft_version`
  - latest `qa_plan_v<N>` version number
- `latest_review_version`
  - latest review artifact version or cycle number
- `latest_validation_version`
  - latest saved validation cycle number

### Exact content: `run.json`

Required fields:

- `run_key`
- `started_at`
- `updated_at`
- `data_fetched_at`
- `context_index_generated_at`
- `coverage_ledger_generated_at`
- `draft_generated_at`
- `review_completed_at`
- `refactor_completed_at`
- `finalized_at`
- `notification_pending`
- `spawn_history`
- `validation_history`
- `blocking_issues`

### Required field meanings for `run.json`

- `spawn_history`
  - append-only list of sub-agent usage decisions and outcomes
- `validation_history`
  - append-only list of saved validation results by phase
- `blocking_issues`
  - active blockers that prevented the next phase

### State-file rule

`task.json` is the resumable planning state. `run.json` is the execution log for the current run. If the workflow changes phase, spawn decisions, or saved artifacts, both files must be updated before the phase is considered complete.

### Exact content: `context/phase0_state_<feature-id>.md`

Required headings:

1. `# Phase 0 State`
2. `## Feature`
3. `## Existing Outputs Detected`
4. `## REPORT_STATE`
5. `## User-Safe Options`
6. `## Selected Mode`
7. `## Resume Constraints`

Required fields:

- feature id
- timestamp
- detected draft files
- detected final files
- detected context cache presence
- resolved `REPORT_STATE`
- allowed next actions
- destructive actions explicitly not auto-selected

### Exact content: `context/runtime_capabilities_<feature-id>.md`

Required headings:

1. `# Runtime Capabilities`
2. `## Required Commands`
3. `## Available Validators`
4. `## Missing Dependencies`
5. `## Blocking Issues`

Required fields:

- node availability
- markxmind validator path
- context validator paths
- runtime script deployment result
- blocker status

### Phase 0 gate

Do not enter Phase 1 unless both Phase 0 context artifacts exist.

## Phase 1 - Evidence gathering

### Required outputs under `context/`

1. raw/source artifacts for each requested source family:
   - canonical examples:
     - `jira_issue_<issue-key>.md`
     - `jira_related_issues_<feature-id>.md`
     - `qa_plan_atlassian_<feature-id>.md`
     - `github_diff_<slug>.md`
     - `qa_plan_github_<feature-id>.md`
     - `qa_plan_github_traceability_<feature-id>.md`
     - `figma_link_<feature-id>.md`
     - `qa_plan_figma_<feature-id>.md`
     - `confluence_page_<page-id>.md`
2. source manifests:
   - `evidence_manifest_<feature-id>.md`
3. fetch summaries:
   - `source_summary_<domain>_<feature-id>.md` for each requested source domain

### Exact content: `context/evidence_manifest_<feature-id>.md`

Required headings:

1. `# Evidence Manifest`
2. `## Feature`
3. `## Sources Requested`
4. `## Sources Retrieved`
5. `## Missing Sources`
6. `## Saved Artifact Paths`
7. `## Source Freshness`
8. `## Notes`

Required row fields for each artifact:

- source family
- source identifier
- artifact filename
- fetched timestamp
- short purpose
- required/optional
- status: `retrieved` | `missing` | `partial` | `auth_failed` | `access_denied` | `fetch_failed`

### Exact content: `context/source_fetch_failures_<feature-id>.md`

Required headings:

1. `# Source Fetch Failures`
2. `## Failed Source Families`
3. `## Failure Reasons`
4. `## Blocking Assessment`
5. `## User Decision Required`
6. `## Recommended Next Actions`

Each failure row must include:

- source family
- source identifier when available
- failure type: `auth_failed` | `access_denied` | `network_failed` | `tool_failed` | `unknown`
- whether the source is required for the run
- saved evidence of the failure
- recommended user action

### Exact content: `context/source_summary_<domain>_<feature-id>.md`

Required headings:

1. `# Source Summary`
2. `## Domain`
3. `## High-Value Facts`
4. `## User Journeys Found`
5. `## Risks / Regressions Found`
6. `## Setup / Fixture Clues`
7. `## Ambiguities`
8. `## Must-Carry-Forward Items`

Required bullet shape:

- `Fact:`
- `Evidence:`
- `Planning consequence:`

### Phase 1 gate

Do not enter Phase 2 unless:

1. the evidence manifest exists
2. each requested source family has either a saved summary or a saved explicit missing-source note
3. any requested code-traceability or defect-traceability artifacts exist when those evidence families were part of the run

Stop the workflow and require user intervention when either of these is true:

1. all requested source families failed or are missing
2. any required source family has status `auth_failed`, `access_denied`, or `fetch_failed`

When this happens, the orchestrator must:

1. save `context/source_fetch_failures_<feature-id>.md`
2. set `task.json.overall_status = "blocked"`
3. keep `task.json.current_phase = "phase_1_evidence_gathering"`
4. append the failure to `run.json.blocking_issues`
5. stop before Phase 2
6. ask the user which path to take next:
   - fix the source issue and continue Phase 1
   - explicitly reduce scope by removing or downgrading the failed source family
   - stop the run

The orchestrator must not silently continue to later phases when a required source family failed to fetch because of auth, access, or other blocking issues.

## Phase 2 - Context normalization

### Required outputs under `context/`

1. `context_index_<feature-id>.md`
2. `context_normalization_notes_<feature-id>.md`
3. `context_open_questions_<feature-id>.md`

### Exact content: `context/context_index_<feature-id>.md`

Required headings:

1. `# Context Index`
2. `## Feature Summary`
3. `## Source Inventory`
4. `## Primary User Journeys`
5. `## Entry Points`
6. `## Core Capability Families`
7. `## Error / Recovery Behaviors`
8. `## Known Risks / Regressions`
9. `## Permissions / Auth / Data Constraints`
10. `## Environment / Platform Constraints`
11. `## Setup / Fixtures Needed`
12. `## Unsupported / Deferred / Ambiguous`
13. `## Mandatory Coverage Candidates`
14. `## Traceability Map`

### Exact content requirements per heading

`## Feature Summary`
- one-paragraph plain-language summary
- affected user type
- business intent

`## Source Inventory`
- one table row per saved source artifact
- columns: artifact, source family, why it matters, confidence

`## Primary User Journeys`
- journey name
- trigger/entry
- user goal
- completion signal

`## Entry Points`
- menu/button/context-menu/API entry points if relevant
- each with source evidence

`## Core Capability Families`
- one bullet per capability family
- must not copy raw source wording without normalization

`## Error / Recovery Behaviors`
- explicit error triggers
- expected recovery path
- evidence source
- trigger status: `known` | `partially_known` | `unknown`
- required fallback when trigger status is not `known`: linked research artifact or unresolved comment path

`## Known Risks / Regressions`
- risk source id when available
- risk summary
- coverage implication

`## Permissions / Auth / Data Constraints`
- access or permission prerequisites
- auth flows
- restricted-object or environment constraints

`## Environment / Platform Constraints`
- platform/version/environment gates when relevant
- environment differences when relevant
- integration boundaries when relevant

`## Setup / Fixtures Needed`
- test data
- roles/accounts when relevant
- domain fixtures or reusable objects when relevant
- environment prerequisites

`## Unsupported / Deferred / Ambiguous`
- context item
- reason unresolved
- proposed treatment: cover / defer / ask / out-of-scope

`## Mandatory Coverage Candidates`
- each row must include:
  - candidate id
  - capability/journey name
  - recommended coverage type
  - source artifacts

`## Traceability Map`
- one row per extracted fact
- columns:
  - fact id
  - artifact source
  - extracted fact
  - normalized interpretation
  - planning consequence

### Exact content: `context/context_normalization_notes_<feature-id>.md`

Required headings:

1. `# Context Normalization Notes`
2. `## Conflicts Between Sources`
3. `## Resolution Decisions`
4. `## Deferred Interpretation`

`## Deferred Interpretation` must explicitly capture:

1. unclear error triggers
2. ambiguous recovery expectations
3. terminology that blocks executable steps
4. whether one-shot research is required before drafting

### Exact content: `context/context_open_questions_<feature-id>.md`

Required headings:

1. `# Context Open Questions`
2. `## Blocking Questions`
3. `## Non-Blocking Questions`
4. `## Temporary Defaults Used`

### Phase 2 gate

Do not enter Phase 3 unless `context_index_<feature-id>.md` exists and contains all required headings.

## Phase 3 - Coverage mapping

### Required outputs under `context/`

1. `coverage_ledger_<feature-id>.md`
2. `coverage_gaps_<feature-id>.md`
3. `e2e_journey_map_<feature-id>.md`

### Exact content: `context/coverage_ledger_<feature-id>.md`

Required headings:

1. `# Coverage Ledger`
2. `## Coverage Rules Used`
3. `## Scenario Mapping Table`
4. `## Coverage Distribution Summary`
5. `## Explicit Exclusions`

### Exact content: `## Scenario Mapping Table`

Required columns:

1. `candidate_id`
2. `context_item`
3. `source_artifacts`
4. `coverage_type`
5. `planned_section`
6. `planned_scenario_name`
7. `priority`
8. `status`
9. `notes`

Allowed `coverage_type` values:

- `E2E`
- `Functional`
- `Error`
- `Regression`
- `Compatibility`
- `Security`
- `Performance`
- `OutOfScope`

Allowed `status` values:

- `covered`
- `deferred`
- `blocked`
- `out_of_scope`

### Exact content: `context/coverage_gaps_<feature-id>.md`

Required headings:

1. `# Coverage Gaps`
2. `## Missing Evidence`
3. `## Missing Coverage`
4. `## Deferred Coverage`
5. `## Required Follow-Up`
6. `## Unresolved Executability Gaps`

Each gap row must include:

- gap id
- gap type
- impacted capability/journey
- why it matters
- blocker owner
- next action
- suggested research path when applicable
- linked research artifact when applicable

### Exact content: `context/e2e_journey_map_<feature-id>.md`

Required headings:

1. `# E2E Journey Map`
2. `## Required E2E Journeys`
3. `## Journey-to-Scenario Mapping`
4. `## Missing E2E Coverage`

Minimum required journeys:

1. primary happy path
2. interruption / exit / state-transition path when applicable
3. error/recovery path when applicable

### Phase 3 gate

Do not enter Phase 4 unless:

1. the coverage ledger exists
2. the E2E journey map exists
3. every mandatory coverage candidate is classified

## Phase 4 - Unified draft writing

### Required outputs

1. `drafts/qa_plan_v<N>.md`
2. `context/draft_traceability_<feature-id>_v<N>.md`
3. `context/draft_validation_<feature-id>_v<N>.md`

### Exact content: `context/draft_traceability_<feature-id>_v<N>.md`

Required headings:

1. `# Draft Traceability`
2. `## Inputs Used`
3. `## Scenario-to-Ledger Mapping`
4. `## Scenario-to-Evidence Mapping`
5. `## Unused Context Items`

### Exact content: `context/draft_validation_<feature-id>_v<N>.md`

Required headings:

1. `# Draft Validation`
2. `## XMindMark Validation`
3. `## E2E Validation`
4. `## Executable Step Validation`
5. `## Coverage Completeness Validation`
6. `## Blocking Failures`
7. `## Research Used For Executability`
8. `## Unresolved Executability Items`

Allowed status values per validation:

- `pass`
- `fail`
- `warn`

Every failed validation item must include:

1. failure reason
2. exact impacted section/scenario when applicable
3. recommended next action
4. linked research artifact when applicable
5. preserve-with-comment instruction when rewrite is still not possible

### Exact content: `drafts/qa_plan_v<N>.md`

The draft itself must follow the future hard template exactly.

Minimum branch shape:

1. central topic = feature QA plan title
2. top-level sections = required sections from the contract
3. each scenario branch must include:
   - scenario title
   - setup/precondition step when needed
   - user action step(s)
   - expected result
   - optional verification note
   - priority marker
   - optional risk marker

### Phase 4 gate

Do not enter Phase 5 unless the draft validation artifact exists and has no blocking failures.

## Phase 5 - Structured review

### Required outputs under `context/`

1. `review_qa_plan_<feature-id>.md`
2. `review_rewrite_requests_<feature-id>.md`
3. `review_scorecard_<feature-id>.md`

### Exact content: `context/review_qa_plan_<feature-id>.md`

Required headings:

1. `# QA Plan Review`
2. `## Reviewed Draft`
3. `## Review Verdict`
4. `## Blocking Findings`
5. `## Non-Blocking Findings`
6. `## Missing Coverage Matrix`
7. `## E2E Audit`
8. `## Executability Audit`
9. `## Priority Audit`
10. `## Evidence Usage Audit`
11. `## Required Refactor Actions`
12. `## Unresolved Executability Items`
13. `## Research Recommended Or Used`

### Exact content: `context/review_rewrite_requests_<feature-id>.md`

Required headings:

1. `# Review Rewrite Requests`
2. `## Scenario-Level Rewrites`
3. `## Section-Level Rewrites`
4. `## Forbidden Phrases Found`
5. `## Implementation-Heavy Wording Found`
6. `## Research-Required Rewrites`
7. `## Preserve-With-Comment Cases`

Each rewrite request row must include:

- target section/scenario
- original wording
- why it fails
- required rewrite direction
- required fallback if rewrite is not possible in one pass
- linked research artifact when applicable

### Exact content: `context/review_scorecard_<feature-id>.md`

Required headings:

1. `# Review Scorecard`
2. `## Scoring Rubric`
3. `## Scores`
4. `## Pass / Fail Threshold`

Scored dimensions:

- context completeness
- coverage translation
- e2e completeness
- executability
- evidence usage
- readability
- unresolved-gap handling

Score scale:

- `0 = missing`
- `1 = weak`
- `2 = acceptable`
- `3 = strong`

Rule:

- low-complexity or low-evidence features may legitimately have fewer scored comments, but the scorecard dimensions themselves must remain present so omissions stay explicit

### Phase 5 gate

Do not enter Phase 6 unless the review verdict is explicitly saved as one of:

- `accept`
- `accept_with_advisories`
- `reject`

## Phase 6 - Deterministic refactor

### Required outputs

1. `drafts/qa_plan_v<N+1>.md`
2. `context/review_delta_<feature-id>.md`
3. `context/refactor_actions_<feature-id>.md`
4. `context/draft_validation_<feature-id>_v<N+1>.md`

### Exact content: `context/review_delta_<feature-id>.md`

Required headings:

1. `# Review Delta`
2. `## Source Review`
3. `## Blocking Findings Resolution`
4. `## Non-Blocking Findings Resolution`
5. `## Still Open`
6. `## Evidence Added / Removed`
7. `## Verdict After Refactor`

Each blocking finding row must include:

- finding id
- original problem
- action taken
- artifact or scenario changed
- status: `resolved` | `partially_resolved` | `deferred_with_approval` | `not_resolved`

### Exact content: `context/refactor_actions_<feature-id>.md`

Required headings:

1. `# Refactor Actions`
2. `## Allowed Changes`
3. `## Disallowed Changes`
4. `## Section Updates Made`
5. `## Traceability Notes`

### Phase 6 gate

Do not finalize unless:

1. blocking findings are all `resolved` or explicitly `deferred_with_approval`
2. validation passes
3. no mandatory coverage candidate was dropped

## Phase 7 - Finalization

### Required outputs

1. `qa_plan_final.md`
2. `context/finalization_record_<feature-id>.md`
3. archived prior final artifact when overwrite occurs

### Exact content: `context/finalization_record_<feature-id>.md`

Required headings:

1. `# Finalization Record`
2. `## Final Draft Promoted`
3. `## Artifacts Used`
4. `## Approval State`
5. `## Archived Outputs`
6. `## Notification State`

## 4.9 Exact content changes for each enhancement

This section defines what the new or revised docs should actually say.

## Enhancement A - Hard contract file

### Target file

- `references/qa-plan-contract.md`

### Exact content requirements

This file should contain these sections in this order:

1. `# QA Plan Contract`
2. `## Who Must Obey This Contract`
3. `## Output Shape`
4. `## Required Top-Level Sections`
5. `## Scenario Contract`
6. `## E2E Minimum`
7. `## Priority Contract`
8. `## Evidence Usage Contract`
9. `## Out-of-Scope Contract`
10. `## Review Fail Conditions`
11. `## Validation Expectations`

### Exact rules that must appear

- "The template is not advisory. It is the required scaffold."
- "Every mandatory coverage candidate from `context_index` must be represented in the draft or explicitly excluded."
- "EndToEnd is mandatory unless the feature is explicitly non-user-facing, and the reason must be written under Out of Scope / Assumptions."
- "EndToEnd journey types must be selected based on the feature lifecycle. Do not force create/edit/save when the feature's primary workflow is view-only, approval-only, routing-only, background-processing, or otherwise uses a different user outcome."
- "A scenario is invalid if it lacks an observable user action or observable expected result."
- "Internal APIs, services, bridge functions, and implementation hooks do not belong in main manual step wording."

## Enhancement B - Executable step rubric

### Target file

- `references/executable-step-rubric.md`

### Exact content requirements

This file should contain:

1. `# Executable Step Rubric`
2. `## Purpose`
3. `## Pass Criteria`
4. `## Fail Criteria`
5. `## Banned Vague Phrases`
6. `## Allowed Technical Verification Notes`
7. `## One-Shot Research Fallback`
8. `## Preserve-With-Comment Rule`
9. `## Rewrite Examples`

### Exact banned phrase list to seed the file

- `verify correct behavior`
- `verify expected behavior`
- `ensure it works`
- `test parity`
- `perform another valid action`
- `confirm functionality`
- `validate integration`
- `check the feature`

### Exact rewrite pattern to include

Bad:
- `Verify the main flow works correctly`

Good:
- `Open the feature from the primary entry point, complete the user action with fixture A, and confirm the expected completion result appears in the intended destination or state without extra manual recovery`

### Exact fallback rule text

- "When a step is not executable because the trigger or product behavior is unclear, do one bounded research pass before rewriting."
- "Prefer `confluence` for internal product documentation; use `tavily-search` when internal documentation is absent or insufficient."
- "Save the research output under `context/` before reusing it."
- "If the step still cannot be made executable, preserve it with an explicit comment and next action. Do not silently remove it."

## Enhancement C - Context coverage contract

### Target file

- `references/context-coverage-contract.md`

### Exact content requirements

Sections:

1. `# Context Coverage Contract`
2. `## Source Families`
3. `## Required Normalization Outputs`
4. `## Mandatory Coverage Candidate Rules`
5. `## Silent-Drop Prohibition`
6. `## Example Mapping`

### Exact rule text that must appear

- "No source artifact may influence the draft unless it is first represented in `context_index`."
- "No context index item may disappear between normalization and drafting without appearing in `coverage_ledger` as covered, deferred, blocked, or out_of_scope."
- "If a source introduces a known regression or risk, the draft must include either a regression scenario or a written out-of-scope reason."
- "Requested source families are mandatory for the run. Unrequested source families are optional and must not be fabricated into the workflow."

## Enhancement D - Review rubric

### Target file

- `references/review-rubric.md`

### Exact content requirements

Sections:

1. `# Review Rubric`
2. `## Review Inputs`
3. `## Blocking Findings`
4. `## Non-Blocking Findings`
5. `## Scoring Rules`
6. `## Required Review Outputs`
7. `## Approval Contract`
8. `## Unresolved Executability Handling`

### Exact approval rule text

- "Review cannot approve a draft that is structurally valid but not executable."
- "Review cannot approve a draft that loses E2E coverage present in the context index."
- "Review cannot approve a draft with blocking findings left unresolved in `review_delta`."
- "`accept_with_advisories` is allowed only when no blocking finding remains and advisories are explicitly documented."
- "Review cannot silently drop an unclear step; it must be rewritten, researched, or preserved with a comment and next action."

## Enhancement E - Context index schema

### Target file

- `references/context-index-schema.md`

### Exact content requirements

This file should mirror the exact headings listed in Phase 2 and give one mini-example under each heading.

## Enhancement F - E2E coverage rules

### Target file

- `references/e2e-coverage-rules.md`

### Exact content requirements

Sections:

1. `# E2E Coverage Rules`
2. `## When E2E Is Mandatory`
3. `## Minimum Journey Types`
4. `## Journey Structure`
5. `## Common E2E Anti-Patterns`
6. `## Examples`

### Exact anti-patterns to call out

1. "Top-level EndToEnd section exists but contains only one-line labels"
2. "Journey covers only entry and not completion"
3. "Journey omits the relevant completion, exit, or interruption outcome for the feature lifecycle"
4. "Journey duplicates functional cases without describing a user-complete workflow"

## Enhancement G - Template scaffold

### Target file

- `templates/qa-plan-template.md`

### Exact content requirements

The template should contain:

1. one central topic line
2. required top-level branches only
3. one example scenario branch per section
4. placeholder markers for:
   - scenario title
   - setup
   - action
   - expected result
   - verification note
   - priority
   - risk

### Exact example branch shape

```md
Feature QA Plan (<FEATURE_ID>)

- EndToEnd
    * Primary user journey <P1/P2/P3>
        - Setup: user is in <REQUIRED_STATE> and meets the required prerequisites
        - Action: open the feature from <ENTRY_POINT> and complete the main workflow until <EXPECTED_COMPLETION_POINT>
            - Expected: the user reaches <EXPECTED_OUTCOME> and the resulting state/output/notification is visible in <TARGET_LOCATION>
        - Verification note: confirm any supporting log/server effect only if user-visible confirmation is insufficient
```

## Enhancement H - SKILL.md rewrite

### Target file

- `SKILL.md`

### Exact content requirements

Keep it short. It should contain:

1. required references list
2. phase list
3. artifact persistence rule
4. do/do-not rules for sub-agent usage
5. phase gates
6. completion gate

It must explicitly say:

- which phases may spawn sub-agents
- which phases must remain orchestrator-owned
- that spawned outputs are invalid until saved under `context/` and recorded in state files

It should not duplicate long rubrics that belong in `references/`.

## Enhancement I - reference.md rewrite

### Target file

- `reference.md`

### Exact content requirements

It should contain:

1. canonical runtime state contract
2. exact artifact directories
3. naming rules for `context/`, `drafts/`, and final outputs
4. field names for `task.json` and `run.json`
5. validator inventory
6. failure-handling contract

It must explicitly define:

- the required `task.json` fields from this design
- the required `run.json` fields from this design
- when those files must be updated during phase transitions
- how spawned work is recorded in `task.json.artifacts` and `run.json.spawn_history`
- how research artifacts for non-executable steps are named and persisted under `context/`
- that unresolved executable gaps are preserved with comments and tracked artifacts rather than deleted

### Exact naming rule text

- "`context/` stores every intermediate artifact that another phase may need to read, review, or resume from."
- "`drafts/` stores only candidate QA-plan outputs."
- "The final artifact is promotion-only and must never be used as a scratch draft."

## Enhancement J - Eval expansion

### Target file

- `evals/evals.json`

### Exact content requirements

Add eval groups for:

1. context extraction
2. context usage
3. executable-step rejection
4. e2e minimum
5. review delta
6. stale-doc sync expectations
7. unresolved-step handling

Each eval should specify:

- prompt
- fixture files
- expected pass/fail behavior
- expected blocking phrases or required headings
- expected remediation output when the eval fails

## 4.10 Example validator behaviors

These validators may start heuristic-first. The design still needs explicit expected behavior.

### `validate_executable_steps`

Should fail when:

1. banned vague phrases are present
2. a scenario has no concrete action verb
3. expected result is missing
4. internal API names dominate the action step
5. an unclear error-handling step has neither research-backed clarification nor an unresolved comment with next action

### `validate_e2e_minimum`

Should fail when:

1. `EndToEnd` section is absent
2. fewer than the minimum required journey types are present
3. a journey lacks a completion/result condition

### `validate_context_index`

Should fail when:

1. required headings are missing
2. no traceability map exists
3. no mandatory coverage candidates are listed

### `validate_review_delta`

Should fail when:

1. any blocking finding has no disposition
2. a blocking finding remains unresolved without explicit approval to defer
3. a scenario removed during refactor is not explained

### `validate_unresolved_step_handling`

Should fail when:

1. a previously identified non-executable step disappears without explanation
2. an unresolved step is kept without a clear comment
3. no next action is recorded for an unresolved executability item
4. required research was performed but not saved under `context/`

## 5. Documentation Restructure

## 5.1 Files to change

The implementation phase should update these files:

1. `workspace-planner/skills/feature-qa-planning-orchestrator/SKILL.md`
2. `workspace-planner/skills/feature-qa-planning-orchestrator/reference.md`
3. `workspace-planner/skills/feature-qa-planning-orchestrator/templates/qa-plan-template.md`
4. `workspace-planner/skills/feature-qa-planning-orchestrator/README.md`
5. `workspace-planner/skills/feature-qa-planning-orchestrator/evals/evals.json`

`README.md` refactor is required, not optional. It must reflect the latest workflow, latest artifact model, latest state-file behavior, and the latest spawn policy.

`reference.md` synchronization is required, not optional. It must be updated in the same implementation change so its runtime/state contract matches the actual workflow and scripts.

## 5.2 Files to create

The implementation phase should create:

1. `workspace-planner/skills/feature-qa-planning-orchestrator/references/qa-plan-contract.md`
2. `workspace-planner/skills/feature-qa-planning-orchestrator/references/context-coverage-contract.md`
3. `workspace-planner/skills/feature-qa-planning-orchestrator/references/executable-step-rubric.md`
4. `workspace-planner/skills/feature-qa-planning-orchestrator/references/review-rubric.md`
5. `workspace-planner/skills/feature-qa-planning-orchestrator/references/context-index-schema.md`
6. `workspace-planner/skills/feature-qa-planning-orchestrator/references/e2e-coverage-rules.md`
7. `workspace-planner/skills/feature-qa-planning-orchestrator/docs/DOCS_GOVERNANCE.md`

## 5.3 Files to remove

These look like dead or stale docs and should be explicitly handled during implementation:

1. `workspace-planner/skills/feature-qa-planning-orchestrator/docs/xmind-refactor-plan-merged.md`
   - remove
   - migrate any still-valid rules into `references/qa-plan-contract.md`, `reference.md`, or this design's implementation artifacts before deletion
   - reason: large historical redesign doc with deprecated phase/sub-skill descriptions and an output model that conflicts with the current orchestrator docs
2. `workspace-planner/skills/feature-qa-planning-orchestrator/references/qa-plan-contract-simple.md`
   - replace with `qa-plan-contract.md`
3. `workspace-planner/skills/feature-qa-planning-orchestrator/docs/priority-assignment-rules.md`
   - remove
   - migrate its surviving priority rules into `references/qa-plan-contract.md`
   - do not keep a duplicate standalone priority doc
4. `workspace-planner/skills/feature-qa-planning-orchestrator/README.md`
   - refactor in place
   - current problem: it describes artifact names and phase outputs that do not match the runtime idempotency script
   - required outcome: short entrypoint doc aligned with the latest workflow, latest artifact contract, latest spawn policy, and latest `task.json` / `run.json` behavior
5. `workspace-planner/skills/feature-qa-planning-orchestrator/reference.md`
   - keep, but treat as a required sync fix
   - current problem: it is still a live contract surface, but parts of its state-field naming are out of sync with the runtime scripts
   - required outcome: synchronized runtime/state contract that matches the latest workflow and no longer contradicts `README.md`, `SKILL.md`, or the runtime scripts

## 5.3.1 Migration map for removed docs

This section defines exactly what should happen to the rules currently living in removed docs.

### `docs/xmind-refactor-plan-merged.md`

Do not preserve this file as a living doc. Extract only still-valid rules and relocate them as follows:

1. artifact persistence and phase-output rules
   - move to `reference.md`
2. writer/reviewer/refactor behavioral rules
   - move to `references/qa-plan-contract.md`
3. any still-valid validator expectations
   - move to `reference.md` or validator docs referenced from `SKILL.md`
4. any obsolete sub-skill flow, XMind-only-only redesign notes, or deprecated output naming
   - delete, do not migrate

### `docs/priority-assignment-rules.md`

Do not preserve this file as a living doc. Merge its surviving rules into `references/qa-plan-contract.md` under the priority contract section.

The surviving content to migrate is:

1. priority definitions for `P1` / `P2` / `P3`
2. assignment logic based on direct change, affected area, and exploratory/deferred coverage
3. red-flag guidance when priority distribution is obviously suspicious

Do not migrate:

1. any wording that depends on stale sub-skill flows
2. any references that require this file to remain standalone

## 5.3.2 Required sync checklist for `README.md` and `reference.md`

### `README.md` must be updated to reflect

1. current phase list
2. current artifact placement:
   - `context/` for intermediate artifacts
   - `drafts/` for draft plans only
   - final artifact promotion model
3. current `task.json` / `run.json` behavior
4. current spawn policy
5. current review/refactor loop
6. removal of deprecated doc references

### `reference.md` must be updated to reflect

1. current phase/state contract
2. current artifact naming and directories
3. exact required `task.json` fields
4. exact required `run.json` fields
5. current validator inventory
6. current review verdict options
7. current spawn recording requirements

### Sync rule

`README.md` and `reference.md` must be reviewed together. An implementation is incomplete if one is updated without the other and they describe different workflows, artifacts, or state fields.

## 5.4 Documentation ownership model

Use this documentation split:

1. `SKILL.md`
   - workflow only
   - short, operational, no deep examples
2. `reference.md`
   - artifact/state/runtime contracts only
3. `references/*.md`
   - detailed write/review rubrics and schemas
4. `docs/*.md`
   - design docs and governance only

Rule: if a file changes the operational behavior of the skill, `SKILL.md`, `reference.md`, the relevant `references/*.md`, and `evals/evals.json` must be reviewed together.

## 6. Keep Docs Up To Date

Add a small governance rule so docs do not drift again.

## 6.1 Required freshness table

Add a `Docs Freshness` table to `DOCS_GOVERNANCE.md`:

| File | Role | Owner Trigger |
| --- | --- | --- |
| `SKILL.md` | workflow entrypoint | any phase change |
| `reference.md` | runtime/artifact contract | any artifact/state change |
| `templates/qa-plan-template.md` | output scaffold | any section/shape change |
| `references/qa-plan-contract.md` | hard planning contract | any write/review rule change |
| `evals/evals.json` | behavior checks | any contract change |

## 6.2 Update rule

Any future change to plan structure, write instructions, review instructions, or validators is incomplete unless the matching doc and eval entry are updated in the same change.

## 7. Eval Strategy

The current evals are not sufficient. They mostly check style and flexibility. New evals must check the actual failure modes.

## 7.1 Eval categories to add

1. **Context extraction eval**
   - given multi-source artifacts, verify that the context index captures required capability families, risks, and exclusions
2. **Context usage eval**
   - given a context index and draft, verify the draft covers the indexed capability families
3. **Executable-step eval**
   - reject vague steps and implementation-heavy manual actions
4. **E2E eval**
   - reject user-facing drafts with no real end-to-end journeys
   - reject non-user-facing drafts that omit an explicit reason for no `EndToEnd` coverage
5. **Review delta eval**
   - given v1 plus review findings, verify v2 materially improves the flagged problems
6. **Out-of-scope accountability eval**
   - reject silent drops from context to final draft

## 7.2 Concrete eval fixtures

Use BCED-2416 as a primary regression fixture because it already exposes the gap between research quality and plan quality.

### Recommended fixture set

1. `comapare-result.md`
   - use as review-quality expectation input
2. `qa-plan-draft-v1.md`
   - use as "needs improvement" fixture
3. `qa-plan-draft-v2.md`
   - use as "insufficient delta" fixture
4. a small synthetic feature with obvious E2E flow
   - use to verify minimal-path enforcement

## 7.3 Example new eval assertions

1. User-facing drafts must include at least one `EndToEnd` journey with setup, action, and observable result; non-user-facing drafts must explicitly justify the absence of `EndToEnd`.
2. Draft must not contain banned phrases like:
   - `verify correct behavior`
   - `test parity`
   - `perform another valid action`
   - `ensure it works`
3. Draft must not use internal API names in the main action step unless the scenario is explicitly technical verification.
4. Review output must identify missing coverage when the context index includes uncovered capability families.
5. Refactor output must reduce or eliminate blocking findings from the review artifact.
6. When a draft still contains a non-executable step after one rewrite pass, the output must include either:
   - a saved research artifact reference plus rewritten step
   - or a preserved unresolved comment plus next action

## 8. Implementation Plan

This is the recommended implementation order.

## Phase A - Contract cleanup

1. Replace `qa-plan-contract-simple.md` with a real hard contract.
2. Rewrite the template so its sections map exactly to the hard contract.
3. Shorten `SKILL.md` and move detailed writing/review rules into references.

## Phase B - Context translation

1. Add the context index artifact.
2. Add the coverage ledger artifact.
3. Add gap/deferred-item artifacts for unresolved context translation.
4. Update the write phase so all of these saved `context/` artifacts are mandatory inputs to drafting.

## Phase C - Write/review enforcement

1. Add writer instructions and executable-step rubric.
2. Add reviewer rubric and fail conditions.
3. Add review-delta expectations for v2+ drafts.
4. Persist review results, rewrite requests, and delta summaries under `context/`.

## Phase D - Validation and evals

1. Add heuristic validators for context index, E2E minimum, and vague wording.
2. Expand `evals/evals.json` with context extraction, usage, E2E, and review-delta checks.
3. Use BCED-2416 fixtures as the first regression suite.

## Phase E - Doc cleanup and governance

1. Archive or delete stale docs.
2. Add `DOCS_GOVERNANCE.md`.
3. Ensure all remaining docs have one clear role and no duplicate authority.

## 9. Validation Expectations

The implementation work should not be considered complete until all of the following are true:

1. The skill can explain, from docs alone, how raw context becomes a final plan.
2. A draft cannot pass with only XMindMark-valid but vague content.
3. Missing E2E coverage causes a deterministic review failure.
4. Review produces materially better v2 output against the BCED-2416 fixture.
5. Every intermediate artifact except draft snapshots is saved under `context/`.
6. Stale docs no longer describe deprecated orchestrator behavior.

## 10. Expected Outcome

After this redesign, the orchestrator should behave like a QA planning system with explicit planning contracts, not like a generic summarization prompt with a template attached.

The expected quality shift is:

1. Better context usage because evidence must be indexed and classified before drafting.
2. More executable steps because manual wording is validated against a rubric.
3. Reliable E2E coverage because it becomes a mandatory section with minimum journeys.
4. Better review quality because reviewers must audit against the index, ledger, and fail criteria.
5. Less doc confusion because the skill has a smaller, current, role-based documentation set.
