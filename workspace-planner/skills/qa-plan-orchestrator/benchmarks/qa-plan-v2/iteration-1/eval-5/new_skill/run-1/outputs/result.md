# Phase 4a advisory replay artifact — BCIN-7289 (report-editor)

**Benchmark case:** P4A-MISSING-SCENARIO-001  
**Primary phase under test:** **phase4a** (subcategory-only draft writer)  
**Evidence mode:** retrospective replay (from fixture artifacts)  
**Priority:** advisory  

## What this benchmark is checking
Whether **Phase 4a** scenario generation explicitly covers the case focus:

1. **Missing scenario generation for template-save** (template-based creation/save and template-related save behaviors)
2. **Missing scenario generation for report-builder loading** (prompt/report builder element loading behavior during edit / double-click / load cycles)

This is evaluated using only the provided fixture evidence of the prior miss.

---

## Evidence-backed Phase 4a scenario patches (subcategory-only)
The following scenarios are written in **Phase 4a style** (no top-layer canonical categories), and directly target the gaps called out in the defect replay evidence.

### Save / Save As / Template Save

- Save-As: overwrite existing report enters overwrite-conflict confirmation state (no JS crash) <P1>
    * Save-As a new report to an existing report name triggers overwrite flow and completes
        - Open Workstation with **new report editor** enabled
            - Log into Library backend as a valid user
                - Create a new blank report
                    - Make a visible edit (e.g., add an attribute to the grid) so the report becomes dirty
                        - Choose **Save As**
                            - Select a target folder
                                - Enter a name that already exists in that folder
                                    - Confirm to overwrite when prompted
                                        - No JS error appears (e.g., no `Cannot read properties of null (reading saveAs)`)
                                        - The overwrite confirmation appears exactly once (not duplicated)
                                        - The save completes and the report opens as the overwritten target
                                        - Re-opening the target report shows the latest changes are present

- Create from template: Save creates a new report instance (does not overwrite the template source) <P1>
    * Saving a report created from a template does not mutate the template object
        - Log into Workstation with the new report editor enabled
            - Create a report using a known template (e.g., Product sales template)
                - Without changing the template definition, click **Save**
                    - A new report object is created (new ID/name/path per UI behavior)
                    - The template source remains unchanged
                    - Returning to the template and creating a new report again produces the original template layout (not the previously saved result)

- New report Save dialog: “Set as template” checkbox is enabled when saving a newly created report (or explicit expected behavior is documented) <P2>
    * Saving a newly created report allows setting it as a template when expected
        - Create a new blank report in Workstation new report editor
            - Open Save dialog
                - Observe “Set as template” checkbox state
                    - Checkbox is enabled when the user has permission and the report is eligible
                    - If business rule says it must be disabled for specific report types, the UI provides a clear reason/tooltip (no silent disable)

### Prompt handling + Report Builder loading (double-click / edit cycles)

- Report Builder: prompt elements load and remain interactive after double-click during prompt edit <P1>
    * Double-click to edit prompts does not break Report Builder element rendering
        - Open a report that contains attribute/metric element prompts
            - Execute the report to show prompts
                - Enter the prompt editing flow
                    - Double-click into the prompt element area (the action that previously triggered the defect)
                        - Report Builder loads prompt elements successfully
                        - Elements are visible and interactive (expand/select/search as applicable)
                        - No empty panel / missing element list occurs
                        - No console-visible error is surfaced in the UI as an “unknown error”

- Loading indicator during create/edit cycles: only one loading spinner/indicator is shown <P2>
    * Create/edit report shows a single loading indicator
        - Create a blank report (new report editor)
            - Observe loading state during initialization
                - Only one loading indicator is shown at a time (no double loaders)
        - Open an existing report to edit
            - Observe loading state during editor mount
                - Only one loading indicator is shown at a time

- Workstation window title reflects the active report context after load/edit (including double-click) <P2>
    * Title updates correctly when opening/editing reports
        - From Workstation object list, double-click a report to edit
            - Observe window title
                - Title matches the opened report name/context (not stale, not a placeholder such as `newReportWithApplication`)

---

## Why these scenarios satisfy the benchmark focus (Phase 4a alignment)
- They are **Phase 4a compliant**: subcategory → scenario → atomic action chain → observable verification leaves; no canonical categories.
- They directly cover the two missing scenario clusters from the replay evidence:
  - **Template-save / save-as overwrite** (state transition coverage + crash absence + overwrite confirmation)
  - **Report Builder loading after double-click** (prompt element render + interactivity outcomes)

---

## Advisory conclusion (retrospective replay)
Based on the fixture’s gap analysis and cross analysis, the missed coverage was attributable to **Phase 4a scenario generation omissions** in:
- the **save-as overwrite confirmation state transition** (BCIN-7669)
- the **Report Builder prompt element loading outcome** after double-click (BCIN-7727)

The scenario patches above demonstrate the minimum Phase 4a scenario generation needed to satisfy this benchmark’s case focus.