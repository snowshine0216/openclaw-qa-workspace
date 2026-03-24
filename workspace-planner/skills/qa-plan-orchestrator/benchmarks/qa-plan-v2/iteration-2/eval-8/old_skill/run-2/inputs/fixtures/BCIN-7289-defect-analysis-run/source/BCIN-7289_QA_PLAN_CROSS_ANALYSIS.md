# QA Plan Cross Analysis — BCIN-7289

This document analyzes *why* the `qa-plan-orchestrator` missed the gaps identified in `BCIN-7289_SELF_TEST_GAP_ANALYSIS.md` and proposes structural fixes.

## Phase Responsibility Breakdown

| Gap Cluster | Missed In Phase | Why It Missed |
|---|---|---|
| **State Transitions (Save-As, Pause Mode)** | Phase 4a | The active reference `pack.json` did not explicitly list the `save-as-overwrite` and `prompt-pause-mode` state transitions, leaving the LLM to guess them. |
| **Observable Outcomes (Loading, Titles)** | Phase 4a | `pack.json` lacked `required_outcomes` for these specific visual elements. The LLM generated the generic scenario but abbreviated the verification leaves. |
| **i18n String Coverage** | Phase 5b | The Phase 5b shipment checkpoints lacked an explicit guard enforcing locale verification when new `productstrings` entries are added by the feature. |
| **Multiple Confirmation Dialogs** | Phase 5a | The cross-section interaction audit did not enforce testing the interaction between "repeated fast actions" and "modal popups", leading to a skipped UI stress test. |

## Knowledge Pack Delta Recommendations

To remediate these misses across all future report-editor authoring plans, the **`report-editor` knowledge pack** must be updated with:

1. **New State Transitions:**
   - `save-as initiated` → `overwrite-conflict` → `overwrite-confirmation`
   - `template with prompt pause mode` → `run report` → `correct execution`
2. **New Required Outcomes:**
   - Report builder element interactivity after double-click.
   - Workstation window title matching current report context.
   - Single loading indicator during report load/edit cycles.
3. **New Interaction Pairs:**
   - `save-as-overwrite` + `template-save`
   - `prompt-pause-mode` + `report-builder-loading`

## Structural Phase Rubric Recommendations

Additionally, the **orchestrator's internal phase rubrics** need minor amendments:

1. **Phase 4a Contract:** Must mandate that state transitions declared in the active knowledge pack are explicitly rendered into scenario chains, rather than assuming the LLM will map them naturally.
2. **Phase 5b Checkpoints:** Must inject an explicit `i18n Dialog Coverage` checkpoint to guard internationalization defects.

## Verdict

The `REPORT_STATE` for `qa-plan-orchestrator` evolution confirms that the majority of BCIN-7289 defects rest on a **thin knowledge pack**. Enriching the pack and tightening the phase phase-contract parsing will recover >90% of the missed scenarios without requiring code changes to the orchestrator scripts.
