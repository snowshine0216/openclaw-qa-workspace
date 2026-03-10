# Confluence Normalized Summary — BCED-2416

## Source and traceability
- Requested feature folder: **BCED-2416**
- Confluence source page: `BCIN-7289; Use Embedding report in Workstation Plugin`
- Source page ID: `5949096102`
- Traceability risk: the provided Confluence page appears to belong to **BCIN-7289**, not BCED-2416. The content may still be intentionally reused as upstream design context, but this linkage should be confirmed before final synthesis.

## 1) QA-relevant requirements distilled from the design

### Core business / product requirement
- Replace or consolidate the distinct Workstation report editor behavior with an embedded Library report authoring experience.
- Reduce code divergence and maintenance cost between Workstation and Library Web.
- Ensure new Library Web changes can take effect in Workstation automatically.

### Functional design requirements
- Workstation must be able to embed the **Library Report Authoring page** using iFrame embedding.
- Embedding SDK must support report authoring mode through:
  - new page type `EmbedReportAuthoring`
  - `ReportAuthoringService`
  - schema validation for embedding props
- Workstation plugin must choose between **classic editor** and **new embedded editor** based on:
  - Web/Library version
  - Workstation preference for new editor
- If conditions are met (**Web version >= 26.04** and new-editor preference enabled), embedding path is used and classic React app is not mounted.
- Otherwise classic editor path remains in use.
- Library must render report editor in **Workstation style** (`appHost=Workstation`).
- Workstation-native capabilities must still be invokable through provided plugin config APIs.

### Explicitly supported user workflows / entry points
- Edit report
- Create from template
- Create cube report
- Create MDX-source report
- New report from menu / plus icon
- New subset report from dataset / menu
- Link and drill flows
- Open report in Python / SQL editor
- Save / Save As / Set as Template / Unset as Template
- Close / cancel / back / go home / exit edit mode
- Convert to cube / datamart

## 2) Workflow model QA should preserve

### Editor-selection workflow
1. Workstation plugin starts render flow.
2. Before mounting classic React app, plugin checks:
   - Workstation preference
   - Web/Library version
3. If version >= 26.04 and preference selects new editor:
   - load embedding script
   - do not mount classic editor
4. Else:
   - mount classic editor

### Embedded interaction workflow
- Workstation provides lightweight/native integration functions.
- Library owns more business/UI logic.
- Communication occurs through:
  - event / msgRouter patterns for some actions
  - embedded/public API for others
- Library actions such as goBack / goHome / exitEditMode / cancel can close the Workstation editor window.

### Create/edit-context workflow clues
- Existing web-dossier create/edit workflows are reused to lower risk.
- When triggered from Workstation, embedding URL and parameters are dynamically adjusted.
- Create/edit flows include special handling for:
  - selectors consuming new URL parameters
  - drill payload including objectId
  - route changes from create → edit
  - Python query and FFSQL special handling

## 3) Constraints, gates, and assumptions

### Platform / exposure constraints
- Embedding report authoring is intentionally limited to **Workstation only**.
- Restriction is enforced by checking `window.origin`.
- New embedding authoring API should throw errors when used outside allowed platform scope.

### Version / rollout constraints
- New embedded editor path depends on **Web/Library version >= 26.04**.
- Older environments still require classic editor behavior.
- Design indicates classic editor may stop receiving latest feature upgrades from 26.04 onward.

### Deployment scope
Feature is marked as in-scope and enabled by default across all listed deployment offers in the template, including VM, container, on-prem, cloud, and Tanzu variants.

### Architecture assumption
- Using one plugin for both classic and embedding paths is preferred over maintaining separate plugins.
- This avoids duplicate menu entries and dual-plugin complexity when users connect to multiple environment versions.

## 4) Compatibility notes and test-scope clues

### Compatibility dimensions implied by the design
QA should treat these as matrix dimensions:
- Workstation classic editor vs embedded editor
- Web version < 26.04 vs >= 26.04
- Preference OFF vs ON for new editor
- Different deployment types (at least smoke-level validation if required by orchestrator)
- Legacy Workstation-native look/behavior vs Library-style embedded behavior

### Known / expected behavior differences vs legacy plugin
These are not necessarily bugs; they are likely expected deltas to validate intentionally:
- Menu structure differs; Format/View entries move to second-level placement.
- Embedded editor lacks FORMAT and VIEW menu categories in same form as legacy.
- Confirm dialogs differ.
- Initial loading / manipulation cancel behavior differs.
- Some error dialogs behave differently depending on whether error is handled in Mojo/report-editor or in Library.
- Fonts and component styling may differ because embedded flow uses Library components.

### Performance-related clues
- Even when embedding path is used, classic editor bundles still load.
- Design expects no significant performance degradation because bundles are local to Workstation.
- This is still a QA watchpoint for startup/load-time regression.

## 5) Important APIs / events / hooks that affect QA coverage

### ReportAuthoringService functions called out in design
- `deleteDossierInstance`
- `_closeWorkstationReportAuthoring`
- `cancelLoadingAndShowErrorDialog`
- `_getAuthoringPageState`

### Workstation integration event / functions
- Event: `onWorkstationDossierAuthoringClosed`
- Functions exposed/configured:
  - `errorHandler`
  - `getUserComments`
  - `openObjectEditor`
  - `openObjectProperties`
  - `openSaveAsDialog`
  - `closeWindow`
  - `setWindowTitle`

### Menu / visibility logic clues
- Separate classic-window and embedding-window entries are registered.
- Visibility / executability depend on `isVisible` / `canExecute` logic.
- Reused commands need new gating implementations.

## 6) High-risk QA areas inferred from the design
1. **Editor switching correctness**
   - right editor selected for version/preference combinations
   - no classic React mount when embedding path chosen
2. **Platform restriction enforcement**
   - embedding authoring only allowed in Workstation
   - improper origin/API usage produces correct errors
3. **Create/edit entry-point parity**
   - all create/edit/report-launch paths open the right editor and retain expected context
4. **Lifecycle / window management**
   - close, go back, go home, exit edit mode, cancel, instance cleanup
5. **Menu/context/object-editor gating**
   - correct items visible and executable in classic vs embedded mode
6. **Function parity for Workstation-native dialogs**
   - comments, object editor, properties, save as, close, title updates
7. **Error handling parity**
   - same or intentionally revised outcomes depending on where error is caught
8. **State bridging / context caching issues**
   - actions invoked from plugin context that need report state may fail if cache/reconnect logic is wrong
9. **UI parity / acceptable deltas**
   - intended style differences do not break usability or functional behavior
10. **Performance regression**
   - added embedding path plus classic bundles loading does not create unacceptable startup/render overhead

## 7) Explicit QA scope clues listed by the design author
The design’s Testing section specifically calls out these areas for attention:
- save
- save as
- set/unset as template
- show user comments dialog
- close button / close window
- convert to cube / datamart
- link drill
- links between report/document/dashboard
- open report in Python / SQL editor
- edit via context menu
- new report from plus icon
- new subset report from dataset
- new report / subset / free form SQL / Python query from Workstation main menu
- error handling in Mojo/report-editor vs Library
- Library navigation actions closing embedded editor window

## 8) Requirement gaps / blocker-level unknowns for downstream planning
The page leaves many NFR and implementation-verification sections incomplete. For QA planning, treat these as **unknowns**, not settled requirements:
- detailed security requirements
- detailed scalability targets
- explicit performance acceptance criteria
- detailed error taxonomy and automation strategy
- logging / telemetry requirements
- accessibility commitments
- internationalization expectations
- explicit compatibility commitments
- finalized feature-flag behavior/details
- admin/config-storage details
- CI/CD and automated test commitments

## 9) Recommended normalization outcome for orchestrator
Use this Confluence page as **design evidence for an embedded Workstation report-authoring migration/consolidation feature**, with strong focus on:
- conditional editor selection
- embedded vs classic compatibility behavior
- Workstation-only platform restriction
- lifecycle/dialog/native integration parity
- menu/function visibility gating
- create/edit path coverage
- UI/behavior deltas that may be intentional but still need verification

Also carry forward the **traceability mismatch** between requested key `BCED-2416` and source-page key `BCIN-7289` as an open validation item.
