# Review Notes - BCIN-7289 Benchmark Replay

## Context Artifact Coverage Audit

- `BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md` explicitly identifies missing scenario coverage for save-override, Report Builder prompt element loading, template-sourced create-and-save, convert-dialog i18n, session-timeout recovery, and prompt-editor close variants.
- `BCIN-7289_SELF_TEST_GAP_ANALYSIS.md` traces the misses to workflow behavior, including SDK/API visible outcomes being silently dropped from scenario translation and combination scenarios not being operationalized.
- `BCIN-7289_REVIEW_SUMMARY.md` shows the historical review path ended in `pass_with_advisories`, which is the replay signal that this checkpoint must harden into a rewrite gate.
- `BCIN-7289_REPORT_DRAFT.md` and `BCIN-7289_REPORT_FINAL.md` are materially unchanged, so the historical advisories did not produce a coverage-preserving refactor loop.
- `run.json` and `task.json` confirm the replay source completed review while still sitting in a pre-Phase-6 state with no Phase 5a-style route-back artifact present.

## Supporting Artifact Coverage Audit

- none; the copied fixture does not include support-only Jira summaries or relation maps

## Deep Research Coverage Audit

- direct deep-research artifacts were not copied into the benchmark fixture
- retrospective replay still shows deep-research-backed obligations indirectly through `BCIN-7289_SELF_TEST_GAP_ANALYSIS.md`, which cites BCED analog lessons, synthesis, and coverage-ledger usage as sources for the missed nodes
- this is sufficient for replay-level preservation auditing, but not for re-validating Tavily/Confluence provenance

## Coverage Preservation Audit

- Core Functional Flows > Save and Save-As > Save overrides an existing report without error | required_from_context_artifacts | missing_in_reviewed_output | `BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md` Gap 1 (`BCIN-7669`, `BCIN-7724`) | rewrite_required | overwrite conflict handling is explicit retrospective evidence and cannot be implied by happy-path save coverage
- Core Functional Flows > Report Builder > Double-click loads attribute/metric prompt elements | required_from_context_artifacts | missing_in_reviewed_output | `BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md` Gap 2 (`BCIN-7727`) | rewrite_required | a high-priority authoring interaction was absent even though the defect history proves it is real user-facing coverage
- Core Functional Flows > Template Operations > New report created from a template saves as a new report | required_from_context_artifacts | missing_in_reviewed_output | `BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md` Gap 3 (`BCIN-7667`) | rewrite_required | template-origin save behavior is a distinct path and was not preserved as a standalone scenario
- Compatibility > Window Title > Window title is correct for create and edit modes | required_from_context_artifacts | silently_dropped_from_scenario_translation | `BCIN-7289_SELF_TEST_GAP_ANALYSIS.md` Root Cause D (`BCIN-7674`, `BCIN-7719`, `BCIN-7733`) | rewrite_required | SDK/API visible outcomes remained in evidence prose but were not preserved as executable scenario leaves
- Regression / Known Risks > Save Dialog Completeness > Save dialog fields are interactive, not just present | required_from_context_artifacts | acceptance_criteria_weakened | `BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md` Gap 6 (`BCIN-7688`) | rewrite_required | the analog-backed dialog check was reduced to presence-only coverage and no longer protects the real defect
- i18n > Convert to Intelligent Cube / Datamart > Dialog controls and titles localize correctly | required_from_context_artifacts | missing_in_reviewed_output | `BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md` Gap 7 (`BCIN-7720`, `BCIN-7721`, `BCIN-7722`) | rewrite_required | known locale-sensitive dialog coverage was not preserved through the reviewed artifact set
- Error Handling / Recovery > Close and Prompt State > Confirm-to-close appears when prompt editor is open | required_from_context_artifacts | missing_state_variant | `BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md` Gap 9 (`BCIN-7708`) | rewrite_required | the base close scenario did not preserve the prompt-editor-open state variant
- Performance / Resilience > Startup Performance > Embedded editor first-open time remains within accepted range | required_from_context_artifacts | preserved_in_reviewed_output | `BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md` (`BCIN-7675`) | pass | the retrospective evidence indicates this performance scenario remained visible rather than being silently dropped

## Knowledge Pack Coverage Audit

- report-editor capability pairs that must remain visible from the replay evidence: save x overwrite, template x save, prompt x Report Builder, convert x i18n, close x prompt-editor-open, SDK title-setting x create/edit modes
- the copied replay evidence shows multiple required capability pairs without a surviving scenario, gate, or explicit exclusion
- knowledge-pack coverage is therefore not safe for `accept`

## Cross-Section Interaction Audit

- Save x Template: missing standalone coverage for template-sourced save behavior
- Save x Prompt: prompt pause-mode combination remains absent in the retrospective gap analysis
- Close x Active Dialog: prompt-editor-open close behavior remains uncovered
- Convert x i18n: convert dialog localization and resulting window-title localization remain uncovered

## Section Review Checklist

- EndToEnd | partial | creation and edit journeys exist, but template-specific and title-verification coverage are incomplete
- Core Functional Flows | rewrite_required | overwrite save, template create-and-save, and Report Builder prompt loading are not preserved strongly enough
- Error Handling / Recovery | rewrite_required | session-recovery quality and prompt-editor close-state coverage remain weak or missing
- Regression / Known Risks | rewrite_required | analog-backed dialog completeness lost required interactivity checking
- Compatibility | rewrite_required | visible integration outcomes such as window titles were silently dropped
- Security | pass | no copied replay evidence shows a coverage-preservation failure in this area
- i18n | rewrite_required | convert-dialog and title-localization coverage remains missing
- Accessibility | advisory_only | no copied replay evidence proves a preservation regression here
- Performance / Resilience | pass | performance regression coverage remained visible
- Out of Scope / Assumptions | rewrite_required | evidence-backed nodes must not be treated as implicitly out of scope

## Blocking Findings

- BF1 | save-override overwrite path lacks preserved executable coverage despite direct defect evidence
- BF2 | Report Builder prompt element loading lacks preserved executable coverage despite direct defect evidence
- BF3 | template-sourced create-and-save path lacks preserved executable coverage despite direct defect evidence
- BF4 | window-title verification for create/edit modes was silently dropped from scenario translation
- BF5 | convert-dialog i18n coverage is missing despite direct defect evidence

## Advisory Findings

- AF1 | the copied fixture does not include raw Phase 3 deep-research artifacts, so replay relies on copied retrospective documents that cite them
- AF2 | the historical review summary caught some content quality issues, but those advisories did not enforce a rewrite loop
- AF3 | performance coverage appears preserved, which helps show the replay is distinguishing true drops from still-visible coverage

## Rewrite Requests

- RR1 | restore a standalone overwrite-save scenario with explicit overwrite confirmation and no JS or HTTP error acceptance criteria
- RR2 | add a standalone Report Builder double-click element-loading scenario for attribute and metric prompts
- RR3 | restore template-sourced create-and-save as a standalone scenario rather than implying it through generic create or save coverage
- RR4 | restore SDK/API visible outcomes as user-observable scenario leaves, especially window-title correctness across create/edit modes
- RR5 | strengthen analog-backed save-dialog completeness checks to verify interactivity, not just field presence
- RR6 | add convert-dialog i18n coverage for non-English locales and resulting window-title text
- RR7 | add the prompt-editor-open close-state variant and retain it through review
