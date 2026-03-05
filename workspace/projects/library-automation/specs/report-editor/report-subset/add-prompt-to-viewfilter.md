# Add prompt to subset report VF

**Source:** WDIO `ReportEditor_add_prompt_to_viewfilter.spec.js`
**Seed:** `tests/seed.spec.ts`

## Scenarios

1. **[BCIN-6460_01]** not allow to add view filter by DnD multiple selection
2. **[BCIN-6460_02]** adding attribute metric to view filter on existing subset report
3. **[BCIN-6460_03]** DnD irrelevant qualification prompt to subset report
4. **[BCIN-6460_04]** DnD valid attribute qualification prompt to subset report
5. **[BCIN-6460_05]** DnD attribute elements prompt to subset report
6. **[BCIN-6460_06]** DnD metric qualification prompt to subset report
7. **[BCIN-6460_07]** DnD value prompt to subset report
8. **[BCIN-6460_08]** Check tooltip in view filter

## POMs

- `reportDatasetPanel`: dndByMultiSelectFromReportObjectsToViewFilter, dndFromObjectPanelToContainer, searchObjectInObjectBrowser, dndFromObjectBrowserToReportViewFilter
- `reportFilterPanel`, `reportFilter`, `reportPage` (getConfirmDialog, getConfirmMessage)
