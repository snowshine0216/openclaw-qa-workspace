# Site Knowledge: Rwd Domain

## Overview

- **Domain key:** `rwd`
- **Components covered:** RWDAuthoringPage
- **Spec files scanned:** 1
- **POM files scanned:** 1

## Components

### RWDAuthoringPage
- **CSS root:** `#ribbonToolbarTabsListContainer > div:nth-child(4) .right.menu`
- **User-visible elements:**
  - Add Dataset Button (`#tbDatasetNew2Button`)
  - Authoring Close Menu Item (`.mstrd-RwdAuthoringCloseMenuItem`)
  - Close Menu Item (`.mnu-close`)
  - Dataset Dialog Search Input (`.mstrTextBoxWithIconCellInput input`)
  - Dataset Tree (`.mstrTree`)
  - Overwrite Dialog (`.mstrmojo-alert`)
  - Prompt Editor (`#mstrdossierPromptEditor, .mstrdossierPromptEditor, .mstrPromptEditor`)
  - Prompt Remove All Button (`.mstrBGIcon_tbRemoveAll`)
  - Prompt Run Button (`.mstrPromptEditorButtonRun`)
  - Save Dialog (`#mstr-rwd-save-as-editor`)
  - Save Menu Item (`.mnu-dSave`)
  - Toolbar Fourth Tab Right Menu Button (`#ribbonToolbarTabsListContainer > div:nth-child(4) .right.menu`)
- **Component actions:**
  - `addDatasetInRwdFrame(reportName = 'rwd_prompt_report')`
  - `clickWithFallbackAndVerifyAdvance({
        elementGetter, advanceCondition, actionLabel, timeout = 3000, interval = 200, })`
  - `closeAuthoringPage()`
  - `closeDocumentFromFileMenu()`
  - `getFirstVisibleMenuOption()`
  - `openRepromptFromFourthMenu()`
  - `removeAllSelectedObjectsInPrompt()`
  - `runPromptFromEditor()`
  - `saveDocumentFromFileMenu(documentName)`
  - `selectTemplate(templateName = '01 Blank Interactive Document')`
  - `switchBackToMainContext()`
  - `verifyDatasetAttributesInTree(attributes)`
  - `waitForRwdDocumentReadyInFrame()`
  - `waitForRwdIframeAndSwitch()`
- **Related components:** _none_

## Common Workflows (from spec.ts)

1. [BCSA-3968] RWD Authoring (used in 1 specs)
2. RWD - Authoring (used in 1 specs)

## Common Elements (from POM + spec.ts)

1. Add Dataset Button -- frequency: 1
2. Authoring Close Menu Item -- frequency: 1
3. Close Menu Item -- frequency: 1
4. Dataset Dialog Search Input -- frequency: 1
5. Dataset Tree -- frequency: 1
6. Overwrite Dialog -- frequency: 1
7. Prompt Editor -- frequency: 1
8. Prompt Remove All Button -- frequency: 1
9. Prompt Run Button -- frequency: 1
10. Save Dialog -- frequency: 1
11. Save Menu Item -- frequency: 1
12. Toolbar Fourth Tab Right Menu Button -- frequency: 1

## Key Actions

- `waitForRwdIframeAndSwitch()` -- used in 5 specs
- `isDossierPresent()` -- used in 4 specs
- `runPromptFromEditor()` -- used in 4 specs
- `switchBackToMainContext()` -- used in 4 specs
- `verifyDatasetAttributesInTree(attributes)` -- used in 4 specs
- `waitUntil()` -- used in 3 specs
- `openDossierInfoWindow()` -- used in 2 specs
- `addDatasetInRwdFrame(reportName = 'rwd_prompt_report')` -- used in 1 specs
- `closeAuthoringPage()` -- used in 1 specs
- `closeDocumentFromFileMenu()` -- used in 1 specs
- `createDocumentFromLibrary()` -- used in 1 specs
- `deleteItemFromInfoWindow()` -- used in 1 specs
- `login()` -- used in 1 specs
- `openCustomAppById()` -- used in 1 specs
- `openItemInAuthoring()` -- used in 1 specs
- `openRepromptFromFourthMenu()` -- used in 1 specs
- `removeAllSelectedObjectsInPrompt()` -- used in 1 specs
- `saveDocumentFromFileMenu(documentName)` -- used in 1 specs
- `selectTemplate(templateName = '01 Blank Interactive Document')` -- used in 1 specs
- `waitForRwdDocumentReadyInFrame()` -- used in 1 specs
- `clickWithFallbackAndVerifyAdvance({
        elementGetter, advanceCondition, actionLabel, timeout = 3000, interval = 200, })` -- used in 0 specs
- `getFirstVisibleMenuOption()` -- used in 0 specs

## Source Coverage

- `pageObjects/rwd/**/*.js`
- `specs/regression/rwd/**/*.{ts,js}`
