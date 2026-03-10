# BCIN-7289 Confluence Source Notes

- Source URL: https://microstrategy.atlassian.net/wiki/spaces/~kawang/pages/edit-v2/5949096102
- Confluence page ID: 5949096102
- Page title: BCIN-7289; Use Embedding report in Workstation Plugin
- Release target: 26.04
- Source access method: `confluence read 5949096102`
- Source role in planning: authoritative primary design source for Workstation embedded report editor

## Core problem statement
- Workstation and Library Web report editors currently share some code through `react-report-editor`, but still diverge in behavior and capabilities.
- The divergence increases development and maintenance cost and creates platform gaps.
- Goal: consolidate report editor behavior by embedding the Library Report Authoring page inside the Workstation plugin so new Library Web changes flow into Workstation automatically.

## High-level design direction
- Adopt an iFrame embedding approach similar to the new dossier plugin.
- Embed Library report authoring inside the Workstation plugin instead of continuing with the classic Workstation React-app editor path.
- Workstation decides between classic editor and new embedded editor at runtime based on:
  - Library/Web version
  - Workstation preference for the new editor
- If Web version is `>= 26.04` and preference selects the new editor, load embedding script and skip mounting classic React app.

## Scope and deployment clues
- Deployment table marks all listed deployment types as in-scope and enabled by default.
- Explicit scope limitation: report authoring embedding is limited to Workstation only.
- Restriction mechanism: check window origin. If other platforms use the new EmbedPageManager API for authoring mode, errors should be thrown.

## Existing-vs-new editor differences called out by design
### Existing disparities the design is trying to remove or minimize
- Workstation-only functions: convert to cube/datamart, export PDF/Excel, etc.
- Workstation uses legacy prompt editor.
- Workstation lacks Cancel button during initial loading.
- UI/component differences between Workstation and Library styles.

### Known UI/behavior differences after switching to embedding
- Most components follow Library style and may differ from legacy Workstation UI.
- Format and View menu categories are not present in the new embedded editor.
- Some menu items move to second-level menus.
- Confirm dialogs use Library style.
- Cancel behavior during initial loading/manipulations now exists in Library flow whereas legacy plugin had none.
- Some error dialogs differ depending on whether errors are caught by Mojo/report-editor or by Library.
- Fonts and several UI components differ due to Library rendering.

## Embedding SDK changes explicitly described
- Add entry in `EmbedPageManager`.
- Add new page type `EmbedReportAuthoring`.
- Add `ReportAuthoringService` to provide common functions.
- Add schema validation file `jsonSchema/embedReportAuthoringProps.schema.json`.

## ReportAuthoringService public functions listed
- `deleteDossierInstance` — delete report instance; same as dossier.
- `_closeWorkstationReportAuthoring` — handle Workstation close event.
- `cancelLoadingAndShowErrorDialog` — error handling for session-out / initial loading.
- `_getAuthoringPageState` — get page state; doc notes it may not be useful.

## Workstation plugin responsibilities and changes
- Workstation report editor itself is already a plugin.
- Feature enhances render workflow so Workstation can embed report authoring.
- Plugin must choose editor solution based on preference + web version.
- Plugin provides APIs in embedding config so Library can invoke native Workstation functions.

### Plugin events/APIs called out
#### Event
- `onWorkstationDossierAuthoringClosed`
  - Reuses dossier registered event.
  - Library sends it when performing actions such as `goBack`, `goHome`, `exitEditMode`.

#### SDKs/functions in config
- `errorHandler` — show Workstation error dialog.
- `getUserComments` — open user comments dialog.
- `openObjectEditor` — open object editor.
- `openObjectProperties` — open object properties dialog.
- `openSaveAsDialog` — open save-as dialog.
- `closeWindow` — close report window.
- `setWindowTitle` — set window title.

## workstation.json changes and menu-routing implications
- New embedded editor uses different menu categories; no FORMAT/VIEW categories.
- Solution chosen: register another window in Workstation.
- Duplicate entries added for menus/context menus/object editors, targeting the new window with different `isVisible` / `canExecute` logic.
- Existing commands are reused where possible, with new visibility/executability logic.
- Mapped examples include:
  - `newReport` -> `newEmbeddingReport`
  - `newSubsetReport` -> `newEmbeddingSubsetReport`
  - `createNewReportFromMenu` -> `createNewEmbeddingReportFromMenu`
  - `editReport` -> `editEmbeddedReport`
- Some items such as save/save as/set-unset template/export actions are marked not applicable in the classic-vs-embedding duplicate-entry table, implying different handling.

## Performance / architecture trade-off notes
- Single plugin will serve both classic and embedding editors.
- Even in embedded mode, classic editor bundles still load.
- Design claims performance impact should not be significant because bundles are local in Workstation.
- Rejected alternative: separate plugin.
  - Reason: users may connect to both old and new environments and would need both plugins simultaneously.
  - That would duplicate menu entries and complicate UX.
- From 26.04 onward, report-editor module in Workstation should stop upgrading.
- Latest features may not be available in classic editor.
- Users should choose new report editor for latest experience.

## Create/edit workflow details
### File / dataset entry points mentioned
- File -> New Intelligent Report
- File -> New report
- Dataset -> New Intelligent Report
- Dataset -> New Mdx Report

### Context/data requirements mentioned
- Need `isSubset=true` in subset workflows.
- Need default subset ID.
- Need cube ID / cube info depending on route.
- Dataset-based workflows may fetch cube information from selected objects / `workstation.selectedObject`.
- MDX source detection involves first object being an MDX cube (`DssTypeFolder` with virtualType CUBE or QUERY CUBE).
- To reduce risk, reuse existing `web-dossier` workflow for different create/edit cases.
- When triggered from Workstation, dynamically change embedding Library URL and apply parameters.

### Web-dossier/library-side updates explicitly named
- Existing selectors consume new parameters through embedding URL parameters:
  - `selectCurrentDossierReportEditorInfo`
  - `selectCurrentDossierCreatorInfo`
- Drill flow: add objectId info into `drillFn`.
- Link flow: change hash route from create to edit.
- Python query & FFSQL need special handling for create route to support editing an existing report.

## Library rendering / override details
- Render in Workstation style by setting `appHost` to Workstation.
- Library-side wrapper `ReportEditorWrapper` already provides functionality/state to report-editor.
- Web-dossier handlers listed for embedding path:
  - `onViewObjectProperties` -> `handleViewObjectProperties`
  - `onEditObject` -> `handleEditObject`
  - `convertToDataMart` -> `handleConvertToDataMart`
  - `convertToCube` -> `handleConvertToCube`
  - `ffsqlFn` / `pythonFn` -> `handleEditorFn`
  - `drillFn` -> same as Library, opens in same tab for now
  - `openReportLink` -> `handleLinkFn`
  - `onCancelFromTemplate` -> `handleClose`
  - `onError` -> `handleWorkstationError`
  - `isGeneratedReport` used during save; if true, save uses save-as
- Design preference: keep plugin JS simple and move more logic into Library because plugin lacks utilities like i18n.
- Plugin should mainly expose primitive functions that interact with native Workstation capabilities.

## Cross-bundle/global-state constraint
- Report is bundled in `dossier-common`.
- Global state such as `reportAppProxy`, `mstrAppProxy`, `ReportModule` is only available there.
- Plugin methods like `closeWindow` execute in `dossier-sdk` bundle where report state is empty.
- For actions that require current report state, design expects caching contexts/store/proxy and reconnecting when needed.

## API-boundary / integration clues
- This feature is primarily SDK/embedding/config integration, not a new REST-heavy backend feature in the visible design text.
- Main boundaries appear to be:
  - Workstation plugin <-> Embedding SDK
  - Embedding SDK <-> Library/Web-dossier authoring page
  - Plugin config APIs / msgRouter / embedded public APIs
- Two explicit communication patterns are documented:
  1. Through msgRouter/event (example: `getUserComments`)
  2. Through Embedded API/public API (example: `closeWindow`)
- Library actions such as go back, go home, exit edit mode, and cancel should close the Workstation editor window.

## Error-handling notes from source
- `cancelLoadingAndShowErrorDialog` supports session-out / initial-loading failures.
- If error is caught in Mojo/report editor, OK dismisses dialog and follows prior behavior.
- If error is caught in Library, OK closes the editor dialog.
- Library-originated navigation actions should close editor window.
- Testing section calls out explicit attention to configuration/deployment/user error handling categories, but details remain mostly template placeholders.

## Compatibility / gating clues
- Compatibility with older environments is central:
  - new embedded editor only when Web version >= 26.04 and preference enabled
  - otherwise classic editor remains
- Users connected to multiple environments may need both old and new behavior within the same Workstation installation.
- Classic editor will lag future features after 26.04.
- Workstation-only scope is enforced by origin check.

## QA-relevant testing clues explicitly listed in source section 4
### Function changes / behaviors to pay attention to
- Save: show user comments dialog.
- Save as: use Workstation save-as dialog.
- Set/unset as template: show user comments dialog.
- Close button / Close window:
  - confirmation dialog if changed
  - delete instance after close
- Convert to cube/datamart:
  - uses Library-style confirmation dialog
- Link drill:
  - opens new created report in same window for now
  - also fixes classic-editor issue where saving drilled report was unsupported
- Link to report/document/dashboard.
- Link from / to report.
- Open report in Python / SQL editor.
- Edit via context menu.
- New report by plus icon.
- New subset report from dataset.
- New report / subset / free form SQL / Python query report via Workstation main menu.

### Error handling cases to test from source
- Errors caught in Mojo/report-editor: OK dismisses dialog and preserves prior behavior.
- Errors caught in Library: OK closes editor dialog.
- Initial loading cancellation path exists in embedding flow.

## Gaps / unresolved / template-heavy sections
- Security, scalability, performance, logging, monitoring, i18n, accessibility, embedding-SDK checklist, feature flags, admin/config, CI/CD, compliance, and many detailed NFR sections are mostly template placeholders without completed project-specific decisions.
- No detailed explicit API spec is attached in the source text.
- No explicit feature-flag mechanism is finalized in the visible content.
- No explicit accessibility requirements are filled in, despite UI changes.
- No quantitative performance targets are provided beyond a qualitative statement that bundle-loading overhead should be minor.
