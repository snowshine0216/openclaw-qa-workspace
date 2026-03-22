# Phase4a Replay Result — P4A-MISSING-SCENARIO-001

## Replay Verdict

**Source run status:** `not_satisfied`

The copied BCIN-7289 replay evidence shows that the original plan coverage missed the phase4a scenario-generation requirement for the benchmark focus:

- **Template-save path missing as a standalone scenario.**
  `BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md` Gap 3 states that "New Report from Template" was not an explicit scenario and ties the gap to **BCIN-7667**.
- **Report Builder loading path missing as a standalone scenario.**
  `BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md` Gap 2 states that no scenario covered Report Builder double-click loading of prompt elements and ties the gap to **BCIN-7727**.
- **Adjacent cross-feature combination also missing.**
  Gap 4 ties **BCIN-7730** to the untested combination of template-sourced creation plus pause-mode prompt behavior.

This artifact stays inside **phase4a** scope by generating the missing scenario drafts only. It does not add phase5+ audit, release, or execution content.

## Evidence Basis

| Evidence file | Relevant point |
|---|---|
| `benchmark_request.json` | Confirms case `P4A-MISSING-SCENARIO-001`, feature `BCIN-7289`, and primary phase `phase4a` |
| `source/BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md` | Gap 2, Gap 3, and Gap 4 explicitly describe the missing scenarios |
| `source/BCIN-7289_SELF_TEST_GAP_ANALYSIS.md` | Confirms Root Cause C = missing scenarios and ties phase4a to scenario generation behavior |
| `source/context/jira_issues/BCIN-7667.json` | Provides the concrete template-create then save reproduction path |
| `source/context/jira_issues/BCIN-7727.json` | Provides the concrete Report Builder prompt loading reproduction path |
| `source/context/jira_issues/BCIN-7730.json` | Provides the concrete template-plus-pause-mode reproduction path |

## Phase4a Corrective Scenario Drafts

### Capability Family: Core Functional Flows > Template Operations

**Scenario:** New report created from a template saves as a new report and does not overwrite the source template `[P1]`

- **Why phase4a must generate it:** Gap 3 identifies template-based creation as a distinct create path that was not promoted into a standalone scenario.
- **Defect replay anchors:** `BCIN-7667`
- **Merge policy:** `must_stand_alone`

**Steps**

1. Connect Workstation to the qualifying Library environment with the new report editor enabled.
2. Start `New Report` and choose a template such as `Product sales template`.
3. Accept the pre-filled report or make a small edit.
4. Click `Save`.
5. Complete the save flow if the editor asks for a target folder or name.

**Expected results**

- A **new report** is created.
- The **source template is not overwritten or modified**.
- The newly created report is visible in the target folder immediately after save.
- No overwrite of the source template occurs implicitly.

### Capability Family: Core Functional Flows > Report Builder / Prompt Authoring

**Scenario:** Report Builder loads attribute or metric elements correctly after double-click `[P1]`

- **Why phase4a must generate it:** Gap 2 identifies an uncovered authoring interaction that is not represented by save-side prompt scenarios.
- **Defect replay anchors:** `BCIN-7727`
- **Merge policy:** `must_stand_alone`

**Steps**

1. Open Workstation against the replay environment and begin a new report in `Report Builder`.
2. Open a prompt that requires attribute or metric element selection.
3. Expand a folder that contains selectable attributes or metrics.
4. Double-click an attribute or metric to load its elements.

**Expected results**

- The element list loads successfully.
- Elements are available for selection in the prompt UI.
- No empty list, loading stall, or visible error appears.
- The user can continue authoring the report without re-opening the prompt or editor.

### Capability Family: Core Functional Flows > Template Operations `[COMBINATION: Prompt Handling]`

**Scenario:** Template report with a pause-mode prompt executes correctly after creation `[P2][COMBINATION]`

- **Why phase4a should also generate it:** Gap 4 shows that template coverage and pause-mode coverage were both present separately, but the combined state was omitted.
- **Defect replay anchors:** `BCIN-7730`
- **Merge policy:** `must_stand_alone`

**Steps**

1. Open a report template that contains a prompt configured for pause mode.
2. Create a new report from that template.
3. Run the report.
4. Interact with the pause-mode prompt as presented.

**Expected results**

- The prompt is shown to the user at the correct point in the run flow.
- The report respects pause-mode behavior instead of skipping prompt handling.
- The run completes without hanging or entering an error state.

## Phase4a Alignment Check

| Check | Result |
|---|---|
| Case focus explicitly covered: template-save | Yes |
| Case focus explicitly covered: Report Builder loading | Yes |
| Adjacent missing combination scenario captured | Yes |
| Output stays in phase4a draft/scenario-generation scope | Yes |
| Output depends on later-phase review or release material | No |

## Benchmark Conclusion

The **source replay fails this benchmark case as-is** because the missing phase4a scenarios were not generated in the original plan coverage. The **corrective phase4a artifact above satisfies the benchmark focus** by adding explicit, standalone scenario drafts for:

1. Template-based report creation and save behavior.
2. Report Builder prompt element loading after double-click.
3. The related template-plus-pause-mode combination path.
