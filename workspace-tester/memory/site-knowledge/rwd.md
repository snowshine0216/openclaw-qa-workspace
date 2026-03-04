# Site Knowledge: rwd

> Components: 1

### RWDAuthoringPage
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `AddDatasetButton` | `#tbDatasetNew2Button` | button |
| `DatasetDialogSearchInput` | `.mstrTextBoxWithIconCellInput input` | input |
| `PromptEditor` | `#mstrdossierPromptEditor, .mstrdossierPromptEditor, .mstrPromptEditor` | element |
| `PromptRunButton` | `.mstrPromptEditorButtonRun` | button |
| `DatasetTree` | `.mstrTree` | element |
| `SaveMenuItem` | `.mnu-dSave` | element |
| `CloseMenuItem` | `.mnu-close` | element |
| `SaveDialog` | `#mstr-rwd-save-as-editor` | element |
| `OverwriteDialog` | `.mstrmojo-alert` | element |
| `AuthoringCloseMenuItem` | `.mstrd-RwdAuthoringCloseMenuItem` | element |
| `ToolbarFourthTabRightMenuButton` | `#ribbonToolbarTabsListContainer > div:nth-child(4) .right.menu` | element |
| `PromptRemoveAllButton` | `.mstrBGIcon_tbRemoveAll` | element |

**Actions**
| Signature |
|-----------|
| `getFirstVisibleMenuOption()` |
| `clickWithFallbackAndVerifyAdvance({
        elementGetter, advanceCondition, actionLabel, timeout = 3000, interval = 200, })` |
| `waitForRwdIframeAndSwitch()` |
| `switchBackToMainContext()` |
| `selectTemplate(templateName = '01 Blank Interactive Document')` |
| `waitForRwdDocumentReadyInFrame()` |
| `addDatasetInRwdFrame(reportName = 'rwd_prompt_report')` |
| `runPromptFromEditor()` |
| `verifyDatasetAttributesInTree(attributes)` |
| `saveDocumentFromFileMenu(documentName)` |
| `closeDocumentFromFileMenu()` |
| `closeAuthoringPage()` |
| `openRepromptFromFourthMenu()` |
| `removeAllSelectedObjectsInPrompt()` |

**Sub-components**
_none_
