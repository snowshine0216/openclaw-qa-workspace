# Phase 4-6 Layering And Coverage Harness Remediation Design

## Status

- Status: Proposed
- Scope: design only
- Implementation: intentionally excluded from this document
- Runtime note: bounded reruns are orchestrator-driven through draft deltas (`accept`, `return phase5a`, `return phase5b`), not by an internal shell while-loop.

## Refactored Phase Reference Table

| Phase | References | Purpose |
| --- | --- | --- |
| Phase 4a | `references/phase4a-contract.md` | Subcategory-only XMindMark draft, atomic steps, embedded scaffold, embedded few shots |
| Phase 4b | `references/phase4b-contract.md` | Canonical top-layer grouping, embedded taxonomy, layered hierarchy scaffold |
| Phase 5a | `references/review-rubric-phase5a.md` | Context-backed review, no-leak audit, section-by-section checkpoints, refactor rules |
| Phase 5b | `references/review-rubric-phase5b.md` | Shipment-readiness checkpoint audit, targeted refactor, and release recommendation |
| Phase 6 | `references/review-rubric-phase6.md` | Final layering, E2E minimum, final quality cleanup after Phase 5b refactor |

## Single-Source Refactor

The design should reduce runtime reference sprawl by moving to one primary runtime contract file per phase.

Recommended runtime files:

- `references/phase4a-contract.md`
- `references/phase4b-contract.md`
- `references/review-rubric-phase5a.md`
- `references/review-rubric-phase5b.md`
- `references/review-rubric-phase6.md`

Recommended fold-in strategy:

- If `references/top-layer-taxonomy.md` or `references/qa-plan-few-shots.md` do not exist, the design embeds their content directly in the phase-specific files; no separate extraction step is needed.
- fold `references/executable-step-rubric.md` into Phase 4a, Phase 4b, Phase 5a, and Phase 6 phase-specific files
- fold `references/qa-plan-contract.md` into Phase 4b and Phase 5a phase-specific files
- fold `references/top-layer-taxonomy.md` into Phase 4b and Phase 6 phase-specific files
- fold `references/qa-plan-few-shots.md` into Phase 4a and Phase 6 phase-specific files
- fold `templates/qa-plan-template.md` into Phase 4a, Phase 4b, and Phase 6 phase-specific files

Recommended treatment of old shared files:

- keep them temporarily as compatibility stubs or short redirect docs during migration
- once all phase manifests and docs point to the phase-specific files, move to archive/ folder and mark as deprecated

## Why This Exists

The current script-driven workflow is the right direction, but the Phase 4-6 inputs and validators are still too loose in the places that matter most:

1. Phase 4a allows drafts to drift into top-category grouping too early.
2. Phase 4a step wording still allows compressed `A -> B -> C` chains instead of atomic nested actions.
3. Phase 4b says "top-category grouping" without defining a canonical top layer or fallback rule.
4. Phase 5 still leans too much on `coverage_ledger_<feature-id>.md` instead of reviewing the full `context/` artifact set.
5. Phase 5 lacks section-by-section checkpoints.
6. Phase 6 does not yet enforce a final layered output strongly enough, even though it is the last quality pass before promotion.

This design sharpens the inputs and gates while preserving the current script-oriented architecture.

## Design Goals

- Keep the workflow script-driven.
- Tighten Phase 4a into a strict subcategory-only draft phase.
- Make Phase 4b produce a canonical layered final taxonomy skeleton.
- Limit `coverage_ledger_<feature-id>.md` to Phase 4a and Phase 4b planning input only.
- Split Phase 5 into two script-defined stages so artifact review and shipment-checkpoint review do not collapse into one shallow pass.
- Use different phase-specific review rubrics for Phase 5a, Phase 5b, and Phase 6 because each stage reviews against a different intent.
- Allow Phase 5a and Phase 5b to run multiple bounded rounds instead of forcing a single review/refactor pass.
- Require Phase 5a and Phase 5b to use an internal self-loop of review -> refactor -> self-review until the phase reaches a pass result or returns upstream.
- Make Phase 5a review every intermediate artifact in `context/` and prove there is no coverage leak.
- Make Phase 5b apply explicit shipment-readiness checkpoints before the final quality pass.
- Add explicit section-by-section review checkpoints.
- Make Phase 6 enforce the final layered QA plan shape with few-shot guidance.
- Reflect all contract changes in `README.md`, `SKILL.md`, `reference.md`, the planning refs, the template, and validator inventory.

## Non-Goals

- No new non-script orchestration logic.
- No changes to Phase 0, 1, 2, 3, or 7 behavior beyond contract wording that supports later phases.
- No implementation details beyond file-by-file planned changes.

## External Checkpoint Source

This design adds a dedicated Phase 5b checkpoint audit based on:

- [checkpoints.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/feature-qa-planning-orchestrator/docs/checkpoints.md)
- Medium: “AI Builds Code Faster Than Ever. Here’s What QA Must Do Before It Ships.”, published February 24, 2026

Design rule:

- `docs/checkpoints.md` is a design/reference artifact, not the runtime-consumed phase reference
- real runtime usage should consume a normalized reference file under `references/`
- recommended runtime file: `references/review-rubric-phase5b.md`
- `references/review-rubric-phase5b.md` must be derived from `docs/checkpoints.md` and must not drift from it

Recommended refactor:

- keep `docs/checkpoints.md` as the long-form design/source document
- add `references/review-rubric-phase5b.md` as the execution-oriented contract for Phase 5b
- optional cleanup: rename `docs/checkpoints.md` to `docs/CHECKPOINTS_DESIGN_REFERENCE.md` in a later documentation pass if clearer naming is desired

Design decision:

- those checkpoints are too broad to be bolted onto the same pass that already performs context-artifact audit and draft refactor
- therefore the workflow should split Phase 5 into `5a` and `5b`

## Core Decision

The current architecture stays intact:

1. orchestrator calls `phaseN.sh`
2. script writes `phaseN_spawn_manifest.json`
3. subagent reads explicit references listed in the manifest task text
4. orchestrator waits
5. script runs `--post`
6. deterministic validators gate the phase

The remediation changes phase inputs, written artifact requirements, and validator behavior. It does not move phase logic back into the orchestrator.

## Draft Iteration Model

Draft filenames should not be fixed to one linear sequence such as `qa_plan_v1.md -> qa_plan_v2.md -> qa_plan_v3.md -> qa_plan_v4.md`.

Recommended model:

- Phase 4b output pattern: `drafts/qa_plan_phase4b_r<round>.md`
- Phase 5a output pattern: `drafts/qa_plan_phase5a_r<round>.md`
- Phase 5b output pattern: `drafts/qa_plan_phase5b_r<round>.md`
- Phase 6 output pattern: `drafts/qa_plan_phase6_r<round>.md`

Recommended runtime tracking:

- `task.json.latest_draft_path`
- `task.json.latest_draft_phase`
- `task.json.phase5a_round`
- `task.json.phase5b_round`
- `task.json.phase6_round`

Loop rule:

- Phase 5a may trigger another Phase 5a round when context-backed review still finds unresolved coverage or structure issues
- Phase 5b may trigger another Phase 5a round when checkpoint review discovers missing foundational coverage
- Phase 5b may trigger another Phase 5b round when shipment-checkpoint fixes are still incomplete after one pass
- Phase 6 may trigger a return to Phase 5a or Phase 5b when final quality review finds unresolved upstream issues that Phase 6 should not silently patch over

Self-loop rule:

- Phase 5a subagent must review its own refactor result before finishing the phase
- Phase 5b subagent must review its own refactor result before finishing the phase
- a Phase 5a or Phase 5b pass is not complete just because it produced a rewritten draft
- the phase should only stop when the phase-specific review result is `pass`, or when the phase determines it must route upstream for missing evidence or unresolved prerequisite issues

The workflow should therefore be deterministic but not strictly single-pass.

## Bounded Supplemental Research Rule

Any of Phases 4a, 4b, 5a, 5b, or 6 may discover that existing intermediate artifacts are insufficient.

When that happens, the active phase subagent may perform one bounded supplemental research pass using approved shared skills:

- `confluence`
- `jira-cli`
- `tavily-search`

These should come from the shared skill folder, not ad-hoc substitutes.

Rules:

- research must be gap-driven, not open-ended
- each new research artifact must be saved under `context/`
- each new research artifact must be added to `artifact_lookup_<feature-id>.md`
- the draft/review/refactor output must cite the new artifact where relevant
- if the new research materially changes phase conclusions, the phase may require another round instead of forcing a brittle one-pass rewrite

Recommended research artifact pattern:

- `context/research_<phase>_<topic>_<feature-id>.md`

## Proposed Workflow Changes

## Phase 4a

### New Role

Phase 4a is a strict subcategory-oriented draft phase.

It must:

- read `artifact_lookup_<feature-id>.md`
- read `coverage_ledger_<feature-id>.md`
- read the writer contracts and few shots
- produce a phase-scoped draft such as `drafts/qa_plan_phase4a_r<round>.md`
- keep the draft below top-category grouping
- perform bounded supplemental research when current artifacts are insufficient, then save and index the new research artifacts before finishing

It must not:

- introduce `Security`, `Compatibility`, `i18n`, `EndToEnd`, or other top-category nodes as Phase 4a structure
- compress multiple actions into one bullet with arrows
- place verification points inside an action bullet

### Phase 4a Output Shape

Required shape:

- central topic
- subcategory node
- scenario node
- atomic nested action chain
- observable verification leaves

Phase 4a is intentionally not the final QA plan hierarchy.

### Phase 4a Good/Bad Examples

Bad: top-category leakage

```md
Feature QA Plan (BCIN-1)

- Security
    * Login <P1>
        - Incorrect password shows error
            - Open login page -> enter valid username -> enter wrong password
                - Error is shown
```

Good: subcategory-first draft

```md
Feature QA Plan (BCIN-1)

- Login <P1>
    * Incorrect password blocks sign-in
        - Open the login page
            - Enter a valid username
                - Enter an incorrect password
                    - Click Sign in
                        - Inline password error appears
                        - The user remains on the login page
```

Bad: non-atomic action chain

```md
- Login <P1>
    * Incorrect password blocks sign-in
        - Login -> input incorrect password
            - Error appears
```

Good: every arrow split into nested steps

```md
- Login <P1>
    * Incorrect password blocks sign-in
        - Open the login page
            - Enter a valid username
                - Enter an incorrect password
                    - Click Sign in
                        - Inline password error appears
```

### Phase 4a Gate

Replace the current loose gate with:

- `validate_phase4a_subcategory_draft`
- `validate_executable_steps`
- `validate_scenario_granularity`

`validate_phase4a_subcategory_draft` must fail when:

- a canonical top-category label appears as a structural node
- a scenario is directly nested under a top-category node
- a bullet contains `->`
- an action bullet compresses multiple user actions into one sentence
- an expected outcome is not a leaf bullet

## Phase 4b

### New Role

Phase 4b is no longer "do some grouping." It is the canonical layering phase.

It must:

- read the latest Phase 4a draft
- read the canonical top-layer taxonomy
- preserve Phase 4a scenario granularity
- group subcategories into canonical top layers
- produce a phase-scoped draft such as `drafts/qa_plan_phase4b_r<round>.md`
- perform bounded supplemental research when grouping decisions cannot be justified from current artifacts

### Canonical Top Layer

Phase 4b must use this fixed canonical top-layer set when a scenario fits:

- `EndToEnd`
- `Core Functional Flows`
- `Error Handling / Recovery`
- `Regression / Known Risks`
- `Compatibility`
- `Security`
- `i18n`
- `Accessibility`
- `Performance / Resilience`
- `Out of Scope / Assumptions`

Use the layers this way:

- `EndToEnd`: complete user journeys with visible completion, interruption, or recovery outcomes
- `Core Functional Flows`: feature actions and business paths that do not represent a full end-to-end journey
- `Error Handling / Recovery`: visible failure states, recovery prompts, retry paths, and rollback behavior
- `Regression / Known Risks`: scenarios explicitly justified by recent defects, risky diffs, or reviewer-called regressions
- `Compatibility`: browser, platform, device, version, or environment compatibility differences
- `Security`: auth, permission, session, access control, unsafe input, and data exposure behavior
- `i18n`: translation, locale formatting, truncation, bidi, language fallback, and locale-specific content rendering
- `Accessibility`: keyboard, focus order, semantics, assistive-technology-visible behavior, and visual access constraints when in scope
- `Performance / Resilience`: user-visible slowness, degraded-state handling, timeout tolerance, and resilience behavior
- `Out of Scope / Assumptions`: explicit exclusions, deferred scope, or unsupported paths with evidence

Rules:

- only emit categories that actually contain mapped content
- do not create empty categories
- do not rename the canonical labels
- if a scenario does not fit cleanly, keep the local grouping and add an explicit HTML comment explaining why the canonical taxonomy was not used

Recommended exception comment:

```md
<!-- top_layer_exception: kept under original grouping because no canonical layer fit without losing meaning -->
```

### Phase 4b Gate

Replace the current loose gate with:

- `validate_phase4b_category_layering`
- `validate_xmindmark_hierarchy`
- `validate_e2e_minimum`
- `validate_executable_steps`

`validate_phase4b_category_layering` must fail when:

- a top-layer label is not canonical
- a top-layer node contains scenarios directly without a subcategory layer
- Phase 4a subcategories are merged away without explicit rationale
- a scenario moved to a non-canonical layer without an exception comment

## Phase 5a

### New Role

Phase 5a is the context-backed review and refactor stage.

`coverage_ledger_<feature-id>.md` is no longer a sufficient coverage authority in Phase 5a.

Primary rubric:

- `references/review-rubric-phase5a.md`

Phase 5a must:

- read every intermediate artifact already present in `context/`
- read `artifact_lookup_<feature-id>.md`
- read the latest Phase 4b or latest returned draft
- review the draft section by section
- prove every relevant context artifact section is accounted for
- refactor the draft to address review findings
- self-review the refactored draft against the Phase 5a rubric
- write `review_notes_<feature-id>.md`
- write `review_delta_<feature-id>.md`
- write a refactored phase-scoped draft such as `drafts/qa_plan_phase5a_r<round>.md`
- perform bounded supplemental research when context evidence is insufficient, then save and index the new research artifacts before deciding whether another Phase 5a round is needed

Phase 5a should only stop when:

- the Phase 5a self-review result is `pass`
- or the phase determines it must route upstream or repeat due to missing evidence or unresolved prerequisite issues

### Coverage Harness Change

The coverage ledger becomes drafting input only:

- Phase 4a: yes
- Phase 4b: yes
- Phase 5a: no, except historical reference
- Phase 5b: no, except historical reference
- Phase 6: no, except historical reference

Instead, Phase 5a must rely on actual context artifact inspection.

### Required New Sections In `review_notes_<feature-id>.md`

```md
# Review Notes

## Context Artifact Coverage Audit
- artifact_path | artifact_section | disposition | mapped_plan_section | checkpoint | notes

## Section Review Checklist
- plan_section | checkpoint | status | evidence | required_action

## Blocking Findings
- finding_id | section | issue | why_blocking | required_action

## Advisory Findings
- finding_id | section | improvement | suggested_action

## Rewrite Requests
- request_id | scenario_ids | problem_type | required_action | status
```

### Phase 5a Review Rules

The `Context Artifact Coverage Audit` table must cover every relevant section from every intermediate context artifact with one of:

- `consumed`
- `deferred`
- `blocked`
- `out_of_scope`

The `Section Review Checklist` must inspect each active final-plan section that exists in the current input draft or is required by evidence:

- `EndToEnd`
- `Core Functional Flows`
- `Error Handling / Recovery`
- `Regression / Known Risks`
- `Compatibility`
- `Security`
- `i18n`
- `Accessibility`
- `Performance / Resilience`
- `Out of Scope / Assumptions`

Each section checkpoint row must say:

- what was checked
- whether it passed
- what evidence was used
- what rewrite is required when it fails

Recommended checkpoint examples:

```md
## Section Review Checklist
- EndToEnd | primary user journey reaches a visible completion or recovery outcome | pass | jira_issue_BCIN-1.md, current draft | none
- Security | permission or auth-sensitive flow remains explicitly split from generic functional coverage | fail | jira_issue_BCIN-1.md, github_diff_BCIN-1.md | add locked-account and expired-session scenarios
- Compatibility | environment-specific behavior called out when evidence mentions browser or platform variance | deferred | confluence_design_BCIN-1.md | wait for browser support confirmation
```

### Phase 5a Gate

Tighten the gate to require:

- `review_notes_<feature-id>.md`
- `review_delta_<feature-id>.md`
- latest Phase 5a draft exists
- latest Phase 5a draft differs from the input draft
- `review_notes_<feature-id>.md` passes `validate_context_coverage_audit`
- `review_notes_<feature-id>.md` passes `validate_section_review_checklist`
- `review_delta_<feature-id>.md` passes `validate_review_delta`

`validate_context_coverage_audit` must fail when:

- any intermediate `context/` file present before Phase 5a is absent from the audit
- any required section in a context artifact is absent from the audit
- any row lacks a disposition
- any row marked `consumed` lacks a mapped plan section

`validate_section_review_checklist` must fail when:

- an active plan section has no checkpoints
- a failed checkpoint has no required action
- a blocking finding exists without a matching rewrite request or delta expectation

## Phase 5b

### New Role

Phase 5b is the shipment-checkpoint review and refactor stage.

It exists because the production-readiness checkpoints are too broad to be trusted as an add-on inside the same pass that already performs:

- full `context/` audit
- section-by-section review
- rewrite planning
- draft refactor

Phase 5b must run as its own spawned subagent pass. Do not fold it into Phase 5a or Phase 6.

Phase 5b must:

- read the latest Phase 5a or latest returned draft
- read `review_notes_<feature-id>.md`
- read `review_delta_<feature-id>.md`
- read relevant `context/` artifacts when checkpoint evidence requires it
- apply explicit shipment-readiness checkpoints
- refactor the plan when checkpoint review finds fixable gaps
- self-review the refactored draft against the Phase 5b rubric
- write `checkpoint_audit_<feature-id>.md`
- write `checkpoint_delta_<feature-id>.md`
- write a refactored phase-scoped draft such as `drafts/qa_plan_phase5b_r<round>.md`
- perform bounded supplemental research when checkpoint evidence is insufficient, then save and index the new research artifacts before deciding whether another Phase 5a or Phase 5b round is needed

Phase 5b should only stop when:

- the Phase 5b self-review result is `pass`
- or the phase determines it must route back to Phase 5a or repeat due to missing evidence or unresolved prerequisite issues

### Phase 5b Checkpoint Categories

Primary rubric:

- `references/review-rubric-phase5b.md`

Phase 5b must align its checkpoint rows to `references/review-rubric-phase5b.md`, and that runtime reference must stay derived from `docs/checkpoints.md`.

Minimum required checkpoints:

- Checkpoint 1: Requirements Traceability
- Checkpoint 2: Black-Box Behavior Validation
- Checkpoint 3: Integration Validation
- Checkpoint 4: Environment Fidelity
- Checkpoint 5: Regression Impact
- Checkpoint 6: Non-Functional Quality
- Checkpoint 7: Test Data Quality
- Checkpoint 8: Exploratory Testing
- Checkpoint 9: Auditability
- Checkpoint 10: AI Hallucination Check
- Checkpoint 11: Mutation Testing
- Checkpoint 12: Contract Testing
- Checkpoint 13: Chaos and Resilience
- Checkpoint 14: Shift-Right Monitoring
- Checkpoint 15: Final Release Gate

Implementation note:

- Phase 5b does not need to force every checkpoint to `pass`
- Phase 5b must force every checkpoint to be explicitly assessed with evidence, blocker status, and required action when not ready

### Required New Sections In `checkpoint_audit_<feature-id>.md`

```md
# Checkpoint Audit

## Checkpoint Summary
- checkpoint_group | checkpoint | status | evidence | required_action

## Blocking Checkpoints
- checkpoint_id | issue | why_blocking | required_action

## Advisory Checkpoints
- checkpoint_id | issue | suggested_action

## Release Recommendation
- verdict | rationale
```

### Phase 5b Review Rules

Every checkpoint row must answer:

- was this checkpoint explicitly checked
- what artifact or draft evidence supports the judgment
- whether the gap blocks shipment readiness
- whether Phase 5b can rewrite the plan to close the gap
- what Phase 5b changed in the draft when it addressed the gap

Recommended minimum checkpoint prompts:

- Does Checkpoint 1 prove requirement-to-test traceability for important coverage?
- Does Checkpoint 2 prove user-facing and API-consumer behavior, not just implementation-aware assumptions?
- Does Checkpoint 3 prove real integration behavior and failure boundaries?
- Does Checkpoint 4 prove environment-fidelity beyond local or mocked execution?
- Does Checkpoint 5 prove adjacent regression impact was considered?
- Does Checkpoint 6 prove non-functional ship-readiness where relevant?
- Does Checkpoint 7 prove realistic test data was considered?
- Does Checkpoint 8 prove exploratory gaps are visible?
- Does Checkpoint 9 prove test evidence is auditable?
- Does Checkpoint 10 prove the plan is not built on hallucinated requirements, dependencies, or behaviors?
- Does Checkpoint 11 identify whether mutation testing is required, expected, deferred, or out of scope?
- Does Checkpoint 12 identify provider-consumer contract risk where relevant?
- Does Checkpoint 13 identify resilience and degraded-state risk where relevant?
- Does Checkpoint 14 identify production observability and rollback readiness?
- Does Checkpoint 15 end with a real release recommendation instead of vague optimism?

### Phase 5b Gate

Require:

- `checkpoint_audit_<feature-id>.md`
- `checkpoint_delta_<feature-id>.md`
- latest Phase 5b draft exists
- latest Phase 5b draft differs from the input draft
- `checkpoint_audit_<feature-id>.md` passes `validate_checkpoint_audit`
- `checkpoint_delta_<feature-id>.md` passes `validate_checkpoint_delta`

`validate_checkpoint_audit` must fail when:

- any required checkpoint category is missing
- a checkpoint row lacks evidence
- a blocking checkpoint lacks a required action
- the release recommendation is missing

`validate_checkpoint_delta` must fail when:

- a blocking checkpoint marked fixed has no recorded change
- the latest Phase 5b draft does not reflect the claimed checkpoint-driven refactor
- the delta lacks a final disposition for each blocking checkpoint

## Phase 6

### New Role

Phase 6 remains the final quality pass, but now it has a stricter output contract:

Primary rubric:

- `references/review-rubric-phase6.md`

- read the latest Phase 5b or latest returned draft
- read `review_notes_<feature-id>.md`
- read `review_delta_<feature-id>.md`
- read `checkpoint_audit_<feature-id>.md`
- read `checkpoint_delta_<feature-id>.md`
- read the few-shot reference
- read the top-layer taxonomy reference
- produce a final phase-scoped draft such as `drafts/qa_plan_phase6_r<round>.md`
- write `quality_delta_<feature-id>.md`
- perform bounded supplemental research when final-quality decisions still require missing evidence

### Final Layered Output Rule

Phase 6 must ensure the final plan is layered exactly as:

1. central topic
2. canonical top category
3. subcategory
4. scenario
5. atomic action chain
6. observable verification leaves

### Required New Sections In `quality_delta_<feature-id>.md`

```md
# Quality Delta

## Final Layer Audit
- layer_path | checkpoint | status | note

## Few-Shot Rewrite Applications
- example_id | target_path | before_summary | after_summary | status

## Exceptions Preserved
- target_path | reason | preservation_comment

## Verdict
- accept | reject
```

### Phase 6 Few-Shot Focus

The few shots used in Phase 6 should target:

- vague scenario wording to concrete scenario wording
- compressed action chain to nested atomic actions
- mixed action-plus-verification bullets to clean leaf verification bullets
- flat or weak grouping to canonical top-layer grouping

### Phase 6 Gate

Tighten the gate to require:

- `validate_final_layering`
- `validate_executable_steps`
- `validate_xmindmark_hierarchy`
- `validate_e2e_minimum`
- `validate_quality_delta`

`validate_final_layering` must fail when:

- the final draft skips the subcategory layer
- scenarios sit directly under the top category
- a verification point appears at the same level as an action step
- the final draft uses non-canonical top-layer labels without exception comments
- an atomic step still contains `->`

## Exact New File Contents

This section gives the exact planned content shape for new runtime reference files and new scripts. These are design targets, not implemented files.

### `references/phase4a-contract.md`

```md
# Phase 4a Contract

## Purpose

Write a subcategory-only QA draft.
Do not introduce canonical top-layer grouping in this phase.

## Required Inputs

- `context/artifact_lookup_<feature-id>.md`
- `context/coverage_ledger_<feature-id>.md`

## Output

- latest Phase 4a draft path, for example `drafts/qa_plan_phase4a_r<round>.md`

## Required Structure

- central topic
- subcategory
- scenario
- atomic action chain
- observable verification leaves

## Forbidden Structure

- top-layer categories such as `Security`, `Compatibility`, `EndToEnd`, `i18n`
- arrow-chain bullets such as `A -> B -> C`
- verification text mixed into the action bullet

## Atomic Step Rules

- one user-visible action per action bullet
- each follow-up action becomes a nested child bullet
- expected outcomes must be leaf bullets

## Embedded Scaffold

Feature QA Plan (<FEATURE_ID>)

- Login <P1>
    * Incorrect password blocks sign-in
        - Open the login page
            - Enter a valid username
                - Enter an incorrect password
                    - Click Sign in
                        - Inline password error appears
                        - The user remains on the login page

## Embedded Few Shots

Bad:
- Security
    * Login <P1>
        - Login -> input wrong password
            - Error appears

Good:
- Login <P1>
    * Incorrect password blocks sign-in
        - Open the login page
            - Enter a valid username
                - Enter an incorrect password
                    - Click Sign in
                        - Inline password error appears

## Validation Expectations

- `validate_phase4a_subcategory_draft`
- `validate_executable_steps`
- `validate_scenario_granularity`

## Supplemental Research Rule

If current evidence is insufficient, do one bounded research pass with `confluence`, `jira-cli`, or `tavily-search`, save the artifact under `context/`, and update `artifact_lookup_<feature-id>.md` before finalizing the draft.
```

### `references/phase4b-contract.md`

```md
# Phase 4b Contract

## Purpose

Convert the Phase 4a subcategory draft into the canonical layered QA hierarchy.

## Required Inputs

- latest Phase 4a draft path (from `task.json.latest_draft_path`; e.g. `drafts/qa_plan_phase4a_r1.md`)

## Output

- latest Phase 4b draft path, for example `drafts/qa_plan_phase4b_r<round>.md`

## Required Structure

- central topic
- canonical top category
- subcategory
- scenario
- atomic action chain
- observable verification leaves

## Canonical Top Layers

- `EndToEnd`
- `Core Functional Flows`
- `Error Handling / Recovery`
- `Regression / Known Risks`
- `Compatibility`
- `Security`
- `i18n`
- `Accessibility`
- `Performance / Resilience`
- `Out of Scope / Assumptions`

## Placement Rules

- `EndToEnd`: full user journeys with visible completion or recovery
- `Core Functional Flows`: feature behavior that is not a full end-to-end journey
- `Error Handling / Recovery`: failure and recovery behavior
- `Regression / Known Risks`: known risky paths, bug-backed flows, reviewer-called regressions
- `Compatibility`: browser, platform, device, or version variance
- `Security`: auth, permissions, session, unsafe input, or exposure behavior
- `i18n`: locale, translation, truncation, formatting, bidi, fallback behavior
- `Accessibility`: keyboard, focus, semantics, AT-visible behavior
- `Performance / Resilience`: degraded-state and latency-visible behavior
- `Out of Scope / Assumptions`: explicit exclusions or deferred scope with evidence

## Exception Rule

If no canonical layer fits without losing meaning, keep the original grouping and add:

<!-- top_layer_exception: kept under original grouping because no canonical layer fit without losing meaning -->

## Embedded Scaffold

Feature QA Plan (<FEATURE_ID>)

- EndToEnd
    * Authentication <P1>
        - Incorrect password blocks sign-in
            - Open the login page
                - Enter a valid username
                    - Enter an incorrect password
                        - Click Sign in
                            - Inline password error appears
                            - The user remains on the login page

- Security
    * Authentication guardrails <P1>
        - Locked account blocks sign-in
            - Open the login page
                - Enter credentials for a locked account
                    - Click Sign in
                        - Account locked messaging appears
                        - No authenticated session is created

## Validation Expectations

- `validate_phase4b_category_layering`
- `validate_xmindmark_hierarchy`
- `validate_e2e_minimum`
- `validate_executable_steps`

## Supplemental Research Rule

If current evidence is insufficient to justify canonical grouping, do one bounded research pass with `confluence`, `jira-cli`, or `tavily-search`, save the artifact under `context/`, and update `artifact_lookup_<feature-id>.md` before finalizing the draft.
```

### `references/review-rubric-phase5a.md`

```md
# Phase 5a Review Rubric

## Purpose

Review the draft against actual context artifacts, prove no coverage leak, and drive the current input draft -> current Phase 5a refactor.

## Required Inputs

- `context/*`
- `context/artifact_lookup_<feature-id>.md`
- current input draft path

## Required Outputs

- `context/review_notes_<feature-id>.md`
- `context/review_delta_<feature-id>.md`
- latest Phase 5a draft path, for example `drafts/qa_plan_phase5a_r<round>.md`

## Required Sections In Review Notes

### Context Artifact Coverage Audit
- artifact_path | artifact_section | disposition | mapped_plan_section | checkpoint | notes

### Section Review Checklist
- plan_section | checkpoint | status | evidence | required_action

### Blocking Findings
- finding_id | section | issue | why_blocking | required_action

### Advisory Findings
- finding_id | section | improvement | suggested_action

### Rewrite Requests
- request_id | scenario_ids | problem_type | required_action | status

## Review Emphasis

- every intermediate context artifact is accounted for
- every active plan section has explicit checkpoints
- executable-step quality is preserved during refactor
- no scenario split required by evidence is silently merged
- review output is not final until the refactored draft is self-reviewed and reaches `pass`

## Blocking Conditions

- missing context-artifact audit coverage
- missing section checklist coverage
- unresolved executable-step problems
- unresolved scenario split requirements
- any coverage leak between context and the latest Phase 5a draft

## Supplemental Research Rule

If current evidence is insufficient, do one bounded research pass with `confluence`, `jira-cli`, or `tavily-search`, save the artifact under `context/`, update `artifact_lookup_<feature-id>.md`, and decide whether another Phase 5a round is required.

## Completion Rule

Do not stop after writing a refactored draft.
Review the refactored draft again against this rubric.
Only stop when the review result is `pass`, or when the phase must route out because prerequisite evidence is still missing.
```

### `references/review-rubric-phase5b.md`

```md
# Phase 5b Review Rubric

## Purpose

Run a shipment-readiness checkpoint audit after Phase 5a review/refactor.

## Source Of Truth

This file is the runtime-normalized version of `docs/checkpoints.md`.
It must not drift from that document.

## Required Inputs

- current input draft path
- `context/review_notes_<feature-id>.md`
- `context/review_delta_<feature-id>.md`
- relevant `context/*` evidence when checkpoint evidence is needed

## Required Outputs

- `context/checkpoint_audit_<feature-id>.md`
- `context/checkpoint_delta_<feature-id>.md`
- latest Phase 5b draft path, for example `drafts/qa_plan_phase5b_r<round>.md`

## Required Checkpoints

- C1 | Requirements Traceability
- C2 | Black-Box Behavior Validation
- C3 | Integration Validation
- C4 | Environment Fidelity
- C5 | Regression Impact
- C6 | Non-Functional Quality
- C7 | Test Data Quality
- C8 | Exploratory Testing
- C9 | Auditability
- C10 | AI Hallucination Check
- C11 | Mutation Testing
- C12 | Contract Testing
- C13 | Chaos and Resilience
- C14 | Shift-Right Monitoring
- C15 | Final Release Gate

## Required Sections In Checkpoint Audit

### Checkpoint Summary
- checkpoint_id | checkpoint | status | evidence | blocker | required_action

### Blocking Checkpoints
- checkpoint_id | issue | why_blocking | required_action

### Advisory Checkpoints
- checkpoint_id | issue | suggested_action

### Release Recommendation
- verdict | rationale

## Review Emphasis

- explicit assessment of every checkpoint
- evidence-backed status for every checkpoint
- clear blocker versus advisory separation
- real release recommendation, not vague confidence wording
- checkpoint-driven changes must be reflected in the latest Phase 5b draft
- checkpoint-driven refactor is not final until the updated draft is self-reviewed and reaches `pass`

## Required Sections In Checkpoint Delta

### Blocking Checkpoint Resolution
- checkpoint_id | old_plan_area | new_plan_area | change_summary | status

### Advisory Checkpoint Resolution
- checkpoint_id | change_summary | status

### Final Disposition
- verdict | rationale

## Supplemental Research Rule

If current evidence is insufficient for checkpoint judgment, do one bounded research pass with `confluence`, `jira-cli`, or `tavily-search`, save the artifact under `context/`, update `artifact_lookup_<feature-id>.md`, and decide whether another Phase 5a or Phase 5b round is required.

## Completion Rule

Do not stop after writing a checkpoint-driven refactored draft.
Review the updated draft again against this rubric.
Only stop when the review result is `pass`, or when the phase must route back because prerequisite evidence is still missing.
```

### `references/review-rubric-phase6.md`

```md
# Phase 6 Review Rubric

## Purpose

Finalize the QA plan after Phase 5a and Phase 5b using final layering, E2E, and rewrite quality gates.

## Required Inputs

- current input draft path
- `context/review_notes_<feature-id>.md`
- `context/review_delta_<feature-id>.md`
- `context/checkpoint_audit_<feature-id>.md`
- `context/checkpoint_delta_<feature-id>.md`

## Output

- latest Phase 6 draft path, for example `drafts/qa_plan_phase6_r<round>.md`
- `context/quality_delta_<feature-id>.md`

## Final Layer Rules

- central topic
- canonical top category
- subcategory
- scenario
- atomic action chain
- observable verification leaves

## E2E Minimum

- at least one visible end-to-end journey when the feature is user-facing
- complete journey must reach a visible completion, interruption, or recovery outcome

## Embedded Few Shots

Bad:
- Security
    * Authentication <P1>
        - Enter invalid credentials and confirm the correct behavior

Good:
- Security
    * Authentication guardrails <P1>
        - Invalid credentials do not create a session
            - Open the login page
                - Enter a valid username
                    - Enter an incorrect password
                        - Click Sign in
                            - Inline password error appears
                            - No authenticated session is created

## Embedded Final Scaffold

Feature QA Plan (<FEATURE_ID>)

- EndToEnd
    * Authentication <P1>
        - Incorrect password blocks sign-in
            - Open the login page
                - Enter a valid username
                    - Enter an incorrect password
                        - Click Sign in
                            - Inline password error appears
                            - The user remains on the login page

## Validation Expectations

- `validate_final_layering`
- `validate_executable_steps`
- `validate_xmindmark_hierarchy`
- `validate_e2e_minimum`
- `validate_quality_delta`

## Supplemental Research Rule

If current evidence is insufficient for final-quality decisions, do one bounded research pass with `confluence`, `jira-cli`, or `tavily-search`, save the artifact under `context/`, update `artifact_lookup_<feature-id>.md`, and decide whether Phase 6 can complete or must return to Phase 5a or Phase 5b.
```

### New Scripts To Add

#### `scripts/phase5a.sh`

```bash
#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
node "$SCRIPT_DIR/lib/runPhase.mjs" phase5a "$@"
```

#### `scripts/phase5b.sh`

```bash
#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
node "$SCRIPT_DIR/lib/runPhase.mjs" phase5b "$@"
```

#### `scripts/phase5a_build_spawn_manifest.mjs`

```js
#!/usr/bin/env node
import { runManifestBuilderCli } from './lib/spawnManifestBuilders.mjs';

runManifestBuilderCli('phase5a');
```

#### `scripts/phase5b_build_spawn_manifest.mjs`

```js
#!/usr/bin/env node
import { runManifestBuilderCli } from './lib/spawnManifestBuilders.mjs';

runManifestBuilderCli('phase5b');
```

## Required Changes By Phase

The required follow-up changes should be implemented phase-by-phase, not file-by-file.

Design rule for tests:

- this design only requires test update stubs to be planned
- detailed test-case bodies do not need to be fully designed here
- each changed phase still needs at least one script-test stub and one validator-test stub updated in implementation

### Phase 4a Required Changes

#### Docs and contracts

- `README.md`
  Change the Phase 4a row so it points to `references/phase4a-contract.md` and describes Phase 4a as subcategory-only drafting.
- `SKILL.md`
  Change the Phase 4a contract so `--post` validates a subcategory-only draft with atomic nested steps.
- `reference.md`
  Change the Phase 4a gate so it names the new subcategory-draft validator.
- `references/phase4a-contract.md`
  Create this as the single runtime source of truth for Phase 4a. It should contain structure rules, step rules, scaffold, and few shots in one file.

#### Script/runtime changes

- `scripts/lib/spawnManifestBuilders.mjs`
  Change Phase 4a task text so the subagent is instructed to stay below canonical top-layer grouping and may do one bounded supplemental research pass with shared skills when evidence is insufficient.
- `scripts/lib/runPhase.mjs`
  Change the Phase 4a post-validation branch to call `validate_phase4a_subcategory_draft` in addition to existing step-quality checks, and persist the latest Phase 4a draft path.
- `scripts/lib/qaPlanValidators.mjs`
  Add `validate_phase4a_subcategory_draft`.
- `scripts/lib/validate_plan_artifact.mjs`
  Wire the new CLI validator name.

#### Test stubs to update

- `tests/planValidators.test.mjs`
  Add a stub block for the new Phase 4a validator.
- `scripts/test/phase4a.test.sh`
  Add a stub covering the stricter Phase 4a post gate.

### Phase 4b Required Changes

#### Docs and contracts

- `README.md`
  Change the Phase 4b row so it references `references/phase4b-contract.md` and describes canonical grouping rather than vague "top-category grouping".
- `SKILL.md`
  Change the Phase 4b contract so `--post` validates canonical layered hierarchy, not just generic grouping.
- `reference.md`
  Add the canonical-layer validator to the Phase 4b gate.
- `references/phase4b-contract.md`
  Create this as the single runtime source of truth for Phase 4b. It should contain layered hierarchy rules, canonical top-layer taxonomy, exception handling, and the final scaffold.

#### Script/runtime changes

- `scripts/lib/spawnManifestBuilders.mjs`
  Change Phase 4b task text so the subagent must group Phase 4a output into canonical top-layer labels and may do one bounded supplemental research pass with shared skills when grouping evidence is insufficient.
- `scripts/lib/runPhase.mjs`
  Change the Phase 4b post-validation branch to call `validate_phase4b_category_layering` and persist the latest Phase 4b draft path.
- `scripts/lib/qaPlanValidators.mjs`
  Add `validate_phase4b_category_layering`.
- `scripts/lib/validate_plan_artifact.mjs`
  Wire the new CLI validator name.

#### Test stubs to update

- `tests/planValidators.test.mjs`
  Add a stub block for canonical top-layer validation.
- `scripts/test/phase4b.test.sh`
  Add a stub covering the stricter Phase 4b post gate.

### Phase 5a Required Changes

#### Docs and contracts

- `README.md`
  Replace the old Phase 5 row with a Phase 5a row describing full-context review, no-leak audit, and refactor.
- `SKILL.md`
  Replace the old Phase 5 text with Phase 5a text that reads all `context/` artifacts and performs section-by-section review.
- `reference.md`
  Add Phase 5a artifacts, manifest name, and phase gate details.
- `references/review-rubric-phase5a.md`
  Create this as the single runtime source of truth for Phase 5a. It should absorb review rules, refactor rules, executable-step expectations, and context-audit rules.
- `workspace-planner/AGENTS.md`
  Replace the single Phase 5 summary with a Phase 5a workflow step.

#### Script/runtime changes

- `scripts/phase5a.sh`
  Add a new Phase 5a entry script.
- `scripts/phase5a_build_spawn_manifest.mjs`
  Add a new manifest builder entrypoint for Phase 5a.
- `scripts/lib/spawnManifestBuilders.mjs`
  Add Phase 5a task text that requires context-artifact audit plus section checklist plus rewrite/refactor, and allows one bounded supplemental research pass with shared skills when evidence is insufficient.
- `scripts/lib/runPhase.mjs`
  Add a Phase 5a runtime branch and Phase 5a post-validation logic, persist the latest Phase 5a draft path, and support another Phase 5a round when self-review does not yet pass.
- `scripts/lib/qaPlanValidators.mjs`
  Add `validate_context_coverage_audit` and `validate_section_review_checklist`.
- `scripts/lib/validate_plan_artifact.mjs`
  Wire the new CLI validator names.

#### Test stubs to update

- `tests/planValidators.test.mjs`
  Add stub blocks for context-coverage-audit and section-review-checklist validation.
- `scripts/test/phase5a.test.sh`
  Add a stub covering the new Phase 5a post gate.

### Phase 5b Required Changes

#### Docs and contracts

- `docs/checkpoints.md`
  Treat this file as the Phase 5b checkpoint source-of-truth. The implementation must not invent a different checkpoint set.
- `README.md`
  Add a Phase 5b row that points to `references/review-rubric-phase5b.md` and describes shipment-checkpoint review, targeted refactor, and release recommendation.
- `SKILL.md`
  Add Phase 5b as a distinct stage after Phase 5a and before Phase 6.
- `reference.md`
  Add Phase 5b artifacts, manifest name, and gate details.
- `references/review-rubric-phase5b.md`
  Create this as the single runtime source of truth for Phase 5b. It must normalize and integrate the checkpoints from `docs/checkpoints.md` into a runtime checkpoint-review rubric.
- `workspace-planner/AGENTS.md`
  Update the workflow summary to show `Phase 5a` and `Phase 5b` separately and forbid collapsing them.

The implementation must treat `references/review-rubric-phase5b.md` as a normalized derivative of `docs/checkpoints.md`, not as an independent checklist.

#### Script/runtime changes

- `scripts/phase5b.sh`
  Add a new Phase 5b entry script.
- `scripts/phase5b_build_spawn_manifest.mjs`
  Add a new manifest builder entrypoint for Phase 5b.
- `scripts/lib/spawnManifestBuilders.mjs`
  Add Phase 5b task text that requires explicit evaluation of all checkpoints from `references/review-rubric-phase5b.md`, checkpoint-driven refactor of the plan, evidence-backed statuses, a release recommendation, and one bounded supplemental research pass when checkpoint evidence is insufficient.
- `scripts/lib/runPhase.mjs`
  Add a Phase 5b runtime branch and Phase 5b post-validation logic, persist the latest Phase 5b draft path, and support routing back to Phase 5a or another Phase 5b round when self-review does not yet pass.
- `scripts/lib/qaPlanValidators.mjs`
  Add `validate_checkpoint_audit` and `validate_checkpoint_delta`.
- `scripts/lib/validate_plan_artifact.mjs`
  Wire the new CLI validator names.

#### Test stubs to update

- `tests/planValidators.test.mjs`
  Add stub blocks for checkpoint-audit and checkpoint-delta validation.
- `scripts/test/phase5b.test.sh`
  Add a stub covering the new Phase 5b post gate.

### Phase 6 Required Changes

#### Docs and contracts

- `README.md`
  Change the Phase 6 row so it explicitly consumes the Phase 5b refactored draft and checkpoint outputs.
- `SKILL.md`
  Change the Phase 6 contract so it reads checkpoint artifacts before final rewrite.
- `reference.md`
  Add Phase 6 dependence on the latest Phase 5b draft path, `checkpoint_audit_<feature-id>.md`, and `checkpoint_delta_<feature-id>.md`.
- `references/review-rubric-phase6.md`
  Create this as the single runtime source of truth for Phase 6. It should absorb final layering rules, E2E minimum, few shots, final scaffold, and promotion-readiness checks.

#### Script/runtime changes

- `scripts/lib/spawnManifestBuilders.mjs`
  Change Phase 6 task text so the subagent must consume Phase 5b checkpoint outputs, not just Phase 5a review outputs, and may do one bounded supplemental research pass when final-quality evidence is still insufficient.
- `scripts/lib/runPhase.mjs`
  Change the Phase 6 post-validation branch to require `validate_final_layering` and `validate_quality_delta`, persist the latest Phase 6 draft path, and support return-to-Phase-5 routing when final-quality review exposes upstream gaps.
- `scripts/lib/qaPlanValidators.mjs`
  Add `validate_final_layering` and `validate_quality_delta`.
- `scripts/lib/validate_plan_artifact.mjs`
  Wire the new CLI validator names.

#### Test stubs to update

- `tests/planValidators.test.mjs`
  Add stub blocks for final-layering and quality-delta validation.
- `scripts/test/phase6.test.sh`
  Add a stub covering the stricter Phase 6 post gate.

### Cross-Phase Runtime And Documentation Changes

These changes are shared across multiple phases and should be implemented once.

#### Runtime chain

- `scripts/lib/runPhase.mjs`
  Update the phase chain to support `phase4a -> phase4b -> phase5a -> phase5b -> phase6`, plus controlled returns from `phase5a -> phase5a`, `phase5b -> phase5a`, `phase5b -> phase5b`, and `phase6 -> phase5a|phase5b` when self-review outcomes require another round.
- `scripts/lib/spawnManifestBuilders.mjs`
  Update phase reference instructions and required artifact text for all affected phases, including bounded supplemental research with `confluence`, `jira-cli`, and `tavily-search`.

#### Artifact lookup and state

- `scripts/lib/artifactLookup.mjs`
  Update the lookup flow so new research artifacts discovered during Phases 4a, 4b, 5a, 5b, or 6 are appended and phase-read columns remain accurate.
- `scripts/lib/workflowState.mjs`
  Update state handling to persist latest draft path, phase round counters, and return-routing decisions.

#### Workflow summaries

- `README.md`
  Replace the old phase table rows so the package map reflects `4a`, `4b`, `5a`, `5b`, and `6`.
- `SKILL.md`
  Replace the old Phase 5 wording and keep the workflow script-oriented.
- `reference.md`
  Update runtime layout, manifest names, validator inventory, and phase gates.
- `workspace-planner/AGENTS.md`
  Update the canonical workflow list and add the explicit anti-collapse rule for Phase 5.

#### Evals and contract tests

- `evals/README.md`
  Update the smoke-check and grading guidance so it reflects:
  phase-specific runtime contract files,
  phase-scoped/round-scoped draft artifacts,
  Phase 5a and Phase 5b split,
  and loop-capable review/refactor behavior.
- `evals/evals.json`
  Update prompts and expectations so they no longer assume:
  fixed `qa_plan_v1/v2/v3/v4` naming,
  one shared `review-rubric.md`,
  or a single Phase 5.
  Add expectations for:
  phase-specific runtime references,
  bounded supplemental research,
  Phase 5a pass-gated self-loop,
  Phase 5b pass-gated self-loop,
  and checkpoint-delta artifacts.
- `evals/run_evals.mjs`
  Update generated instructions so with-skill runs save:
  latest draft path metadata,
  phase-scoped draft outputs,
  review/checkpoint delta artifacts,
  and any supplemental research artifacts.
- `tests/docsContract.test.mjs`
  Update required-file assertions so they point to the new phase-specific runtime reference files instead of the old shared references.
  Update content assertions so they check:
  `phase5a`,
  `phase5b`,
  phase-specific review rubrics,
  and loop-capable draft progression.

#### Old shared references

- `references/review-rubric.md`
  Do not keep this as the active shared rubric for Phases 5a, 5b, and 6.
  Recommended follow-up:
  either replace it with a short pointer document that redirects to the phase-specific rubrics,
  or mark it as superseded once downstream references are migrated.
- `references/executable-step-rubric.md`
  Supersede after its runtime rules are folded into the phase-specific files.
- `references/qa-plan-contract.md`
  Supersede after its runtime rules are folded into the phase-specific files.
- `references/top-layer-taxonomy.md`
  Supersede after its runtime rules are folded into `references/phase4b-contract.md` and `references/review-rubric-phase6.md`.
- `references/qa-plan-few-shots.md`
  Supersede after its runtime examples are folded into `references/phase4a-contract.md` and `references/review-rubric-phase6.md`.
- `templates/qa-plan-template.md`
  Supersede after its runtime scaffolds are folded into `references/phase4a-contract.md`, `references/phase4b-contract.md`, and `references/review-rubric-phase6.md`.

#### Shared new reference files

- `references/phase4a-contract.md`
  Single-source runtime contract for Phase 4a.
- `references/phase4b-contract.md`
  Single-source runtime contract for Phase 4b.
- `references/review-rubric-phase5a.md`
  Phase 5a-specific review rubric for context-backed audit and refactor.
- `references/review-rubric-phase5b.md`
  Phase 5b-specific checkpoint audit rubric derived from `docs/checkpoints.md`.
- `references/review-rubric-phase6.md`
  Phase 6-specific final quality rubric.

## Acceptance Criteria For The Future Implementation

- The workflow remains script-driven end to end.
- Draft artifacts are phase-scoped and round-scoped, not forced into a fixed `v1/v2/v3/v4` naming chain.
- `README.md`, `SKILL.md`, `reference.md`, the phase-specific runtime reference files, and `workspace-planner/AGENTS.md` all describe the same Phase 4a/4b/5a/5b/6 contracts.
- Phase 4a produces a strict subcategory-only draft.
- Phase 4b enforces canonical top-layer grouping with explicit exception comments.
- Phase 5a proves no coverage leak by auditing the actual `context/` artifact set.
- Phase 5b produces an explicit shipment-readiness checkpoint audit, checkpoint delta, and refactored draft.
- Phase 6 consumes the Phase 5b refactored draft and enforces the final layered QA plan shape.
- Few-shot guidance exists for both Phase 4a and Phase 6.
- Any of Phases 4a, 4b, 5a, 5b, or 6 can perform one bounded supplemental research pass with approved shared skills and update `artifact_lookup_<feature-id>.md`.
- Phase 5a, Phase 5b, and Phase 6 can route into another bounded review/refactor round instead of forcing a brittle one-pass progression.

## Recommended Implementation Order

1. Create the single-source phase runtime files: `references/phase4a-contract.md`, `references/phase4b-contract.md`, `references/review-rubric-phase5a.md`, `references/review-rubric-phase5b.md`, and `references/review-rubric-phase6.md`.
2. Align `references/review-rubric-phase5b.md` to `docs/checkpoints.md`.
3. Update `README.md`, `SKILL.md`, `reference.md`, and `workspace-planner/AGENTS.md` to point to the new per-phase files and the new phase-scoped draft progression (`qa_plan_phase4a_r<round>.md` through `qa_plan_phase6_r<round>.md`).
4. Add the new runtime scripts and manifest builders for `phase5a` and `phase5b`.
5. Update spawn-task text in `spawnManifestBuilders.mjs`.
6. Add and wire new validators, including checkpoint-delta validation.
7. Tighten `runPhase.mjs` post-phase gates.
8. Convert old shared reference files into redirect stubs or mark them superseded.
9. Update `evals/README.md`, `evals/evals.json`, `evals/run_evals.mjs`, and `tests/docsContract.test.mjs` so the eval harness matches the new phase contracts.
10. Add tests for each new gate.

This order preserves the script-oriented design and keeps the contract changes readable before validator behavior is tightened.
