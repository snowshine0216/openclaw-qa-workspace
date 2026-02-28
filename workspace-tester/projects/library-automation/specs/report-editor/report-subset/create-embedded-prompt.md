# Create embedded prompt to subset report VF

**Source:** WDIO `ReportEditor_create_embedded_prompt.spec.js`
**Seed:** `tests/seed.spec.ts`

## Scenarios

1. **[BCIN-6468_01]** create attribute element in list prompt on view filter
2. **[BCIN-6468_02]** create attribute element not in list prompt on view filter
3. **[BCIN-6468_03]** run report with attribute element in list prompt on view filter
4. **[BCIN-6468_04]** run report with attribute element not in list prompt on view filter
5. **[BCIN-6468_05]** create value prompt in metric filter
6. **[BCIN-6468_06]** no prompt icon for MDTI cube report
7. **[BCIN-6468_07]** create embedded attribute prompt in normal report
8. **[BCIN-6468_08]** run subset report with prompt in view filter on consumption mode

## POMs

- `reportFilterPanel`: newQual, attributeFilter, metricFilter, switchToViewFilterTab, openNewViewFilterPanel
- `reportPage`: embedPromptEditor
- `aePrompt`, `valuePrompt`, `promptEditor`
