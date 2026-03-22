# Benchmark Result — P5A-COVERAGE-PRESERVATION-001

Feature: `BCIN-7289`  
Feature family: `report-editor`  
Primary phase: `phase5a`  
Case focus explicitly assessed: `review loop does not silently drop evidence-backed nodes`

Benchmark judgment: `not satisfied`  
Phase disposition: `return phase5a`

## Context Artifact Coverage Audit

- `inputs/fixtures/BCIN-7289-defect-analysis-run/source/BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md` | gaps 2-7 | consumed | replay evidence | identifies evidence-backed nodes missing from the plan: report builder interaction, template-based creation, template + pause-mode interaction, window title correctness, save-dialog interactivity
- `inputs/fixtures/BCIN-7289-defect-analysis-run/source/BCIN-7289_SELF_TEST_GAP_ANALYSIS.md` | root causes D + enhancement 4 | consumed | replay evidence | shows SDK-visible contracts and cross-section interactions were historically dropped and recommends a stronger Phase 5a audit
- `skill_snapshot/knowledge-packs/report-editor/pack.md` | required capabilities + interaction pairs | consumed | authoritative pack input | names the exact capabilities and interaction pairs that match the BCIN-7289 replay gaps
- `skill_snapshot/references/review-rubric-phase5a.md` | required sections + acceptance gate | consumed | authoritative phase5a contract | requires `## Knowledge Pack Coverage Audit` and `## Cross-Section Interaction Audit` in addition to coverage preservation
- `skill_snapshot/scripts/lib/runPhase.mjs` | `postValidatePhase5a` | consumed | implementation review | validates context coverage audit, coverage preservation audit, section checklist, review delta, round progression, and acceptance gate
- `skill_snapshot/scripts/lib/qaPlanValidators.mjs` | phase5a validators | consumed | implementation review | enforces prior-draft preservation, but not knowledge-pack completeness or cross-section interaction completeness

## Knowledge Pack Coverage Audit

- `template-based creation` | replay evidence: BCIN-7667 gap in cross-analysis | current validator enforcement: none beyond prior-draft comparison | `rewrite_required` | phase5a can still accept if this capability never made it into the incoming draft
- `save override` | replay evidence: BCIN-7669 / BCIN-7724 save-override gap | current validator enforcement: only if a prior-round scenario already exists | `rewrite_required` | current guardrail catches removal, not absence against pack requirements
- `report builder interaction` | replay evidence: BCIN-7727 gap 2 | current validator enforcement: none beyond prior-draft comparison | `rewrite_required` | a context-backed authoring interaction can stay missing without tripping phase5a
- `window title correctness` | replay evidence: BCIN-7674 / BCIN-7719 / BCIN-7733 and `setWindowTitle` root cause | current validator enforcement: none beyond prior-draft comparison | `rewrite_required` | SDK-visible rendered outcomes are not explicitly checked in phase5a validation
- `i18n dialogs` | replay evidence: BCIN-7720 / BCIN-7721 / BCIN-7722 gap 7 | current validator enforcement: section checklist only | `rewrite_required` | section presence is checked, but capability completeness is not

## Cross-Section Interaction Audit

- `template-based creation + pause-mode prompts` | replay evidence: BCIN-7730 gap 4 | rubric status: required by pack and phase5a rubric | validator status: not enforced | `rewrite_required` | this is the clearest BCIN-7289 example of a context-backed interaction pair that can still be missed
- `close-confirmation + prompt editor open` | replay evidence: BCIN-7708 is cited in the replay enhancement recommendations | rubric status: required by pack and phase5a rubric | validator status: not enforced | `rewrite_required` | the snapshot names the interaction pair, but phase5a post-validation does not require an audit row for it

## Coverage Preservation Audit

- `report-editor > template-based creation` | `evidence-backed in pack and replay` | `not guaranteed by phase5a validator` | `skill_snapshot/knowledge-packs/report-editor/pack.md; BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md` | `rewrite_required` | Phase 5a only proves preservation against the input draft, not against pack-backed capability coverage
- `report-editor > report builder interaction` | `evidence-backed in pack and replay` | `not guaranteed by phase5a validator` | `skill_snapshot/knowledge-packs/report-editor/pack.md; BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md` | `rewrite_required` | BCIN-7727 shows a missing evidence-backed node that current validation would not force back in unless it already existed in the previous draft
- `report-editor > window title correctness` | `evidence-backed in pack and replay` | `not guaranteed by phase5a validator` | `skill_snapshot/knowledge-packs/report-editor/pack.md; BCIN-7289_SELF_TEST_GAP_ANALYSIS.md` | `rewrite_required` | the replay explicitly attributes this loss to silently dropped SDK-visible contracts
- `report-editor > template-based creation + pause-mode prompts` | `evidence-backed interaction pair` | `not guaranteed by phase5a validator` | `skill_snapshot/knowledge-packs/report-editor/pack.md; BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md` | `rewrite_required` | missing interaction-pair enforcement leaves a silent-drop path open

## Blocking Findings

- `BF-1` | `phase5a contract vs implementation` | The rubric requires `## Knowledge Pack Coverage Audit` and `## Cross-Section Interaction Audit`, but `postValidatePhase5a` does not validate either section and no targeted tests cover them. | This leaves evidence-backed nodes outside the prior-draft diff unguarded. | Add explicit validators and tests for both sections.
- `BF-2` | `phase5a acceptance gate` | The rubric says `accept` is forbidden while any knowledge-pack capability or required interaction pair lacks a mapped scenario, gate, or exclusion, but `validatePhase5aAcceptanceGate` only checks unresolved coverage rows, round-integrity failures, and unsatisfied blocking request requirements. | A phase5a round can still accept with BCIN-7289-style omissions if they never appeared in the input draft. | Extend the acceptance gate to enforce pack capabilities and interaction pairs.
- `BF-3` | `case focus` | The current snapshot prevents silent removal of already-rendered prior-round scenarios, but it does not fully prevent silent loss of evidence-backed nodes discovered through context, SDK-visible contracts, or interaction-pair rules. | The benchmark focus is broader than prior-draft diff preservation. | Treat the case as unresolved and route back to phase5a.

## Advisory Findings

- `AF-1` | `implemented strength` | The snapshot materially improves over the replay baseline by requiring a coverage-preservation audit and by rejecting `accept` when a dropped node remains `rewrite_required`. | `skill_snapshot/scripts/lib/qaPlanValidators.mjs` and `skill_snapshot/scripts/test/phase5a.test.sh` show this guardrail is implemented in source.
- `AF-2` | `implemented strength` | The validator also rejects inconsistent audit claims where review notes say a scenario was preserved but the rewritten draft does not actually preserve it. | This reduces false-positive review deltas for classic draft-to-draft regressions.
- `AF-3` | `verification blocker` | Runtime verification could not be executed in this workspace because `node` is unavailable, so the assessment relies on static source review plus the retrospective replay evidence. | The missing runtime does not change the implementation gap identified above.

## Rewrite Requests

- `RR-1` | `phase5a validator` | Add a validator for `## Knowledge Pack Coverage Audit` that requires rows for every active `required_capability`, `analog_gate`, and `sdk_visible_contract` in the selected knowledge pack. | `BF-1`
- `RR-2` | `phase5a validator` | Add a validator for `## Cross-Section Interaction Audit` that requires one row per required interaction pair and a mapped scenario, gate, or explicit exclusion. | `BF-1`
- `RR-3` | `phase5a acceptance gate` | Fail `accept` when any knowledge-pack capability or interaction pair remains unmapped, even if there is no prior-draft removal row. | `BF-2`
- `RR-4` | `phase5a regression tests` | Add BCIN-7289-shaped tests covering `setWindowTitle`, template-based creation, report builder interaction, and template + pause-mode prompts. | `BF-1`, `BF-2`

## Verdict After Refactor

- `return phase5a`
- Benchmark expectation status: the output aligns to `phase5a`, but the case focus is not yet satisfied because evidence-backed nodes can still be silently absent unless they already existed in the prior draft.
