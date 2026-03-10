# Confluence Source Notes — BCED-2416

- Collection date: 2026-03-10
- Source URL: https://microstrategy.atlassian.net/wiki/spaces/~kawang/pages/edit-v2/5949096102
- Confluence page ID: 5949096102
- Confluence page title: `BCIN-7289; Use Embedding report in Workstation Plugin`
- Space: `Tec - PA - Applications - CTC (TPAC)`
- Access status: success via `confluence info` and `confluence read`
- Important traceability note: requested feature key is **BCED-2416**, but the target Confluence page content is for **BCIN-7289**. This should be confirmed by the orchestrator/user before final QA-plan synthesis if strict issue-key alignment is required.

## Raw QA-Relevant Extracts

### Purpose / problem statement
- Current report authoring editor exists in both Library and Workstation.
- Although most code is shared, there are still discrepancies between the two implementations.
- These discrepancies increase development and maintenance burden.
- Goal: consolidate the report editor in Workstation and Library Web so they share the same code, and Library Web changes automatically take effect in Workstation.

### Deployment scope
The page marks the feature as in scope and enabled by default for:
- MCE VM (AWS/Azure)
- MEP OnPrem
- MCG Container
- MCE GCP Container
- VMWare Tanzu Container
- Customer Managed Cloud Container
- MCP VM

### High-level design / workflow
- Adopt a similar solution to the new Dossier plugin using **iFrame embedding**.
- Embed the **Library Report Authoring page** inside the Workstation plugin.
- Workstation plugin acts as the customer JS in the embedding framework.

### Major component changes
1. **Embedding SDK changes**
   - Add entry in `EmbedPageManager`
   - Add new page type `EmbedReportAuthoring`
   - Add new `ReportAuthoringService`
   - Add schema validation file `jsonSchema/embedReportAuthoringProps.schema.json`

2. **Scope limitation / platform restriction**
   - Embedding report authoring is limited to **Workstation only** by checking `window.origin`.
   - No plan to expose embedding authoring mode to other platforms.
   - Using the new API in `EmbedPageManager` outside allowed scope should throw errors.

3. **ReportAuthoringService public functions called out**
   - `deleteDossierInstance`
   - `_closeWorkstationReportAuthoring`
   - `cancelLoadingAndShowErrorDialog`
   - `_getAuthoringPageState`

4. **Workstation plugin runtime decision**
   - Before loading React app, plugin checks **preference** and **web version**.
   - If web version >= 26.04 and preference chooses new editor, load embedding script and do not mount classic React app.
   - Otherwise use classic editor.

5. **Workstation ↔ Library integration APIs/events**
   - Event: `onWorkstationDossierAuthoringClosed`
   - Config SDKs/functions:
     - `errorHandler`
     - `getUserComments`
     - `openObjectEditor`
     - `openObjectProperties`
     - `openSaveAsDialog`
     - `closeWindow`
     - `setWindowTitle`

6. **Workstation JSON / menu model changes**
   - New embedding editor does not have FORMAT and VIEW menu categories.
   - Show/hide menu categories implemented by registering another window.
   - New duplicate menu/context/object editor entries added with different `isVisible` / `canExecute` logic.
   - Classic vs embedding entries listed for new report/subset report/edit report paths.
   - Some commands such as save/export do not map as new separate embedding entries.

7. **Create / edit contexts covered**
   - Create from template
   - Cube report
   - MDX source
   - Reuse existing web-dossier workflow
   - Dynamically change embedding library URL and apply parameters when triggered from Workstation
   - Additional notes on selectors, drill objectId, link routing, Python query / FFSQL special handling for create route to support editing existing report

8. **Library updates**
   - Render in Workstation style by setting `appHost` to Workstation.
   - Library `ReportEditorWrapper` provides functionality/state for report-editor.
   - Plugin should provide simple functions for native Workstation interaction; move more logic into Library.
   - Some behaviors routed through msgRouter/event; others through embedded/public API.
   - When plugin-side calls need report state, contexts may need caching/reconnection because report state lives in `dossier-common` while plugin execution may occur in `dossier-sdk`.

### Explicit UI / behavior differences vs legacy plugin
- Most components follow Library style and may differ from Workstation.
- Menu items in Format/View categories move down to second level.
- Confirm dialog differs.
- Library-style cancel is available during initial loading / manipulations; legacy had none.
- Some errors handled in Library behave differently from legacy plugin.
- Font and other components may differ due to Library components.

### Error handling / behavior notes
- `cancelLoadingAndShowErrorDialog` is used for session timeout / initial loading.
- Error handling notes in testing section:
  - If caught in Mojo / report editor, OK dismisses error dialog and follows previous behavior.
  - If caught in Library, OK closes the editor dialog.
- Library actions like go back, go home, exit edit mode, cancel (go back) will close the editor window.

### Performance / stability notes
- Single plugin supports both classic and embedding editors.
- Even when using embedding editor, classic editor bundles are still loaded.
- Design claims performance degradation should not be significant because bundles are located in Workstation.
- Alternative of separate plugin was considered and rejected due to dual-environment/dual-plugin UX and maintenance problems.

### Compatibility / versioning clues
- Requires Web version >= 26.04 for new embedded editor path.
- For older environments, user still needs legacy plugin/editor behavior.
- From 26.04 onward, report-editor module in Workstation should stop being upgraded.
- Latest features may not be available in classic editor.
- User should choose new report editor for latest experience.

### Feature-flag / conditional behavior clues
- Design does not provide a finalized feature-flag section.
- Runtime decision is based on:
  - Workstation preference choosing new editor
  - Library/Web version >= 26.04
- This is effectively a conditional rollout gate that QA should treat as a compatibility matrix.

### Testing section — explicitly called-out functional change areas
Functions / flows to pay attention to:
- save
- show user comments dialog
- save as
- set/unset as template
- save as theme
- close button / close window
- convert to cube / datamart
- link drill
- link to report/document/dashboard
- link from / to report
- open report in Python / SQL editor
- edit using context menu
- new report by + icon
- new subset report from dataset
- new report / subset / free form SQL / Python query report by Workstation main menu

Specific expected notes:
- save as uses Workstation save as dialog
- set/unset as template shows user comments dialog
- close flow should confirm dialog if changed and delete instance after close
- convert to cube/datamart uses Library-style confirm dialog
- drill opens newly created item in same window for now

### Missing / incomplete sections that matter to QA
The following sections are largely template placeholders or incomplete and should be treated as gaps rather than confirmed requirements:
- Security details
- Scalability details
- Performance criteria details
- Error/exception handling detail sections
- Logging details
- Monitoring/telemetry
- Internationalization
- Accessibility details
- Embedding SDK impact checklist details
- Compatibility section details
- Feature flag details
- Administration/configuration details
- CI/CD details
- Compliance details
- Unit/integration/error-testing details

## Initial QA Interpretation Notes
- This is primarily a **cross-platform editor convergence / embedding migration** feature.
- Highest-risk areas appear to be:
  - classic vs embedded editor switching logic
  - version gating (>= 26.04)
  - Workstation-only origin restriction
  - create/edit entry points
  - menu/context/object-editor visibility gating
  - error-handling parity
  - behavior/UI differences between legacy and embedded editor
  - lifecycle actions that should close or delete instances correctly
  - plugin/library state boundary issues
