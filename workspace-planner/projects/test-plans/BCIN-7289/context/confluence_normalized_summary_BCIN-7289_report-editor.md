# BCIN-7289 Normalized Confluence Summary for QA Context

## Source
- Primary design source: https://microstrategy.atlassian.net/wiki/spaces/~kawang/pages/edit-v2/5949096102
- Title: **BCIN-7289; Use Embedding report in Workstation Plugin**
- Target release: **26.04**
- Scope for this artifact: extract QA-relevant requirements, workflows, constraints, compatibility notes, integration boundaries, and test-scope clues for the **Workstation embedded report editor**.

## 1. Feature intent
BCIN-7289 replaces or bypasses the legacy Workstation-specific report-editor flow with an embedded Library report-authoring experience inside the Workstation plugin. The main product goal is to reduce divergence between Workstation and Library Web report editors so new Library authoring changes automatically benefit Workstation.

## 2. Normalized functional requirements
### FR-1 Editor selection / runtime gating
- Workstation must decide at runtime whether to use the classic editor or the embedded editor.
- Decision inputs:
  - Library/Web version
  - Workstation preference for the new editor
- Embedded mode is used only when **Web version >= 26.04** and the preference selects the new editor.
- Otherwise the classic React-app editor remains in use.

### FR-2 Embedded report authoring support in SDK
- Embedding SDK must support report authoring mode, not just viewing.
- Required SDK additions called out by design:
  - EmbedPageManager entry
  - `EmbedReportAuthoring` page type
  - `ReportAuthoringService`
  - props schema validation

### FR-3 Workstation-only support boundary
- Embedded report authoring is currently limited to **Workstation only**.
- Guardrail is enforced through **window origin checks**.
- If unsupported platforms attempt to use the new authoring embedding path/API, the design expects errors.

### FR-4 Native Workstation integration hooks
Library embedded authoring must be able to call native Workstation capabilities through plugin-provided config APIs/events, including:
- error dialog handling
- comments dialog
- object editor / properties dialogs
- save-as dialog
- close window
- set window title
- authoring-closed event handling

### FR-5 Workstation menu/window model updates
- Workstation must register a separate window for the embedded editor flow.
- Menu/context-menu/object-editor entries are duplicated or remapped so visibility/executability differs between classic and embedded windows.
- New embedded flow lacks some top-level categories such as **FORMAT** and **VIEW**.

### FR-6 Create/edit entry points must work in embedded flow
The design explicitly includes support for multiple entry points:
- File -> New report
- File -> New Intelligent Report
- Dataset -> New Intelligent Report
- Dataset -> New MDX Report
- Edit report
- Context-menu launches
- Plus-icon creation flow
- Python / free-form SQL related routes

### FR-7 Data/context translation into embedded route
Embedded authoring must receive/create the right route and context data, including where applicable:
- report ID
- subset ID
- `isSubset` flag
- cube ID / cube metadata
- selected-object-derived MDX cube info
- create-vs-edit route normalization
- drill object IDs

### FR-8 Library-side wrapper behavior overrides
Library/Web-dossier must behave in a Workstation-compatible way when rendered in embedded mode, including:
- Workstation-style host rendering (`appHost=Workstation`)
- adapted handlers for object properties/editing
- convert to cube / datamart
- error handling
- link opening
- cancel / close flows
- generated-report save/save-as behavior

## 3. Primary workflows to preserve or validate
### Workflow A: Open/edit existing report
1. User triggers report editing from Workstation.
2. Plugin evaluates Web version + preference.
3. If gating passes, embedding script loads instead of classic React app.
4. Library report-authoring page renders inside Workstation plugin container.
5. Plugin exposes native functions for save-as, comments, dialogs, closing, title updates, etc.
6. User authoring actions run through Library UI but integrate with Workstation-native affordances.

### Workflow B: Create new report / subset report
1. User invokes creation from file menu, dataset menu, plus icon, or other supported entry.
2. Workstation collects/create-route context.
3. Embedded URL/params are dynamically constructed.
4. Web-dossier selectors consume those params.
5. Embedded editor opens with correct create/edit state and source metadata.

### Workflow C: Dataset / MDX / subset creation
1. User creates report from dataset or MDX source.
2. Workstation determines cube info from selected objects or existing workflow context.
3. Embedded path receives cube/default subset data.
4. Existing web-dossier workflows are reused where possible to reduce risk.

### Workflow D: Drill and link flows
- Drill must add objectId info into `drillFn`.
- Link route changes from create to edit in certain cases.
- Drill-created result currently opens in the same window.
- Linking to report/document/dashboard remains in scope and impacts authoring window behavior.

### Workflow E: Close / exit / navigation actions
- Close button or close window should prompt for confirmation if there are unsaved changes.
- Close flow should delete the authoring instance after close.
- Library actions such as go back, go home, exit edit mode, and cancel/go back should close the Workstation editor window through the registered event/API bridge.

## 4. Behavioral deltas versus classic editor
These are not necessarily bugs; they are expected differences that QA should treat as intentional unless contradicted elsewhere.

- Embedded editor uses mostly **Library-style** UI/components.
- No top-level FORMAT/VIEW menu categories in the new editor window.
- Some actions move deeper into second-level menus.
- Confirm dialogs follow Library style.
- Initial loading now has cancellation/error behavior that legacy flow lacked.
- Error-dialog handling differs depending on whether the error originates/can be caught in Mojo/report-editor vs Library.
- Fonts and miscellaneous UI styling can differ from classic Workstation editor.

## 5. Compatibility and fallback rules
### Version compatibility
- Embedded authoring depends on Library/Web version **26.04+**.
- Older environments must continue using the classic editor path.

### Multi-environment customer scenario
- Design explicitly accounts for users connected to both old and new environments.
- This is why a separate plugin was rejected: users might otherwise need two plugins and duplicated menu entries.
- QA should expect mixed behavior depending on environment version.

### Future compatibility implication
- From 26.04 onward, the Workstation classic `report-editor` module is expected to stop receiving new upgrades.
- New feature parity will increasingly favor embedded mode.

## 6. Integration / API-boundary implications
This feature appears to be mainly a **client integration boundary** change rather than a new backend-service feature.

### Main boundaries
1. **Workstation plugin -> Embedding SDK**
2. **Embedding SDK -> Library/Web-dossier report authoring**
3. **Library -> Workstation native APIs/events**
4. **Cross-bundle state boundary** between `dossier-common` and `dossier-sdk`

### API / communication patterns explicitly mentioned
- **msgRouter / event-based communication**
  - example use case: comments dialog
- **embedded public API communication**
  - example use case: close window

### Cross-bundle state risk
- Some report state lives only in `dossier-common`.
- Plugin-side API calls may run in `dossier-sdk` where that state is absent.
- Design expects state/proxy/store caching + reconnection when needed.
- QA implication: actions that depend on current report state may be fragile at bundle-boundary transitions.

## 7. Constraints and risk clues
### Explicit constraints
- Embedded authoring support is Workstation-only.
- New editor activation is gated by both preference and server/web version.
- Plugin should stay thin/simple; more logic is intentionally moved into Library.
- Single-plugin architecture is retained even though classic bundles still load.

### Risk clues from the design
- Runtime path split between classic and embedded editors can cause regression gaps.
- Menu duplication and `isVisible/canExecute` logic create discoverability and privilege-routing risk.
- Create/edit parameter mapping is complex across report, subset, MDX, FFSQL, Python, drill, and link routes.
- Cross-context state access may break close/save/navigation flows.
- UI parity is intentionally incomplete; regression criteria must distinguish intended differences from defects.
- Error-handling ownership changes between Library and report-editor/Mojo may create inconsistent dismissal/closure behavior.

## 8. NFR and checklist signal extraction
The design contains many NFR template sections that are still largely unfilled. That means the source provides **signals**, not completed decisions.

### What is actually inferable
- Performance concern acknowledged: classic bundles still load even in embedded mode.
- Claimed impact: should be limited because bundles are local to Workstation.
- Security concern exists because new embedding authoring path is intentionally restricted by origin and unsupported calls should error.
- Accessibility/i18n/theme/embedding checklist impacts exist because UI is changing to Library components.

### What is missing / not concretely specified
- No quantitative performance SLA/latency target.
- No completed security checklist details.
- No finalized accessibility acceptance criteria.
- No completed telemetry/logging plan.
- No explicit feature-flag storage details in visible design text.
- No final API-spec child pages included in the fetched source.

## 9. QA scope clues extracted from the design
### Must-cover functional surfaces
- Editor selection logic by version + preference
- Edit existing report in embedded mode
- New report flows
- New subset report flows
- Dataset-origin report creation
- MDX-origin report creation
- Save / Save As / Set-Unset Template flows
- Convert to cube / datamart flows
- Link / drill flows
- Open object editor / object properties
- Python query / FFSQL route handling
- Close/cancel/back/home/exit-edit-mode flows
- Window title updates
- Error handling and session/initial-loading failure paths

### Must-cover compatibility surfaces
- Same Workstation client against pre-26.04 environment vs 26.04+ environment
- Preference toggle on vs off
- Users with mixed environment connections
- Unsupported origin / unsupported platform calls returning expected errors

### Must-cover UI/UX comparison surfaces
- Menu presence/absence in embedded window
- Menu visibility/executability mapping for duplicated commands
- Library-style confirm dialogs and error dialogs
- Cancel during initial loading
- Same-window behavior for drill-opened report
- Font/styling differences that are acceptable vs broken

### Must-cover integration boundary surfaces
- Event bridge for authoring close
- msgRouter-based function invocation
- embedded public API invocation
- plugin -> library callbacks for dialogs and native actions
- state-dependent actions after bundle/context transitions

## 10. Specific source-derived test-scope clues
The design’s Testing section explicitly tells QA to pay attention to:
- save -> user comments dialog
- save as -> Workstation save-as dialog
- set/unset as template -> user comments dialog
- close button/window -> confirm if changed + delete instance after close
- convert to cube/datamart -> Library-style confirm dialog
- link drill -> opens newly created item in same window for now
- classic defect fix: drilled report can now be saved
- links to/from report/document/dashboard
- open report in Python / SQL editor
- context-menu edit
- plus-icon creation
- dataset subset creation
- Workstation main-menu creation for report/subset/free-form-SQL/Python report
- error handling split:
  - Mojo/report-editor caught error => OK dismisses dialog
  - Library caught error => OK closes editor dialog

## 11. Recommended downstream planning notes for orchestrator
- Treat the Confluence page as the **system-of-record design source** for expected behavior and known deltas.
- Do **not** assume UI parity with classic editor; many differences are intentional.
- Add explicit test design for **fallback/compatibility matrix** because environment version and user preference are primary gates.
- Add explicit test design for **bridge failures** between Library and Workstation native APIs.
- Add explicit coverage for **create/edit route normalization** across report/subset/MDX/Python/FFSQL/link/drill paths.
- Flag unresolved NFR areas as documentation gaps rather than confirmed requirements.

## 12. Open questions / ambiguities from source
- Exact user-facing preference name/location for choosing new editor is not stated.
- Exact error text and UX for unsupported-origin attempts is not stated.
- Final feature-flag/runtime config storage is not clearly specified.
- Performance impact is asserted qualitatively but not quantified.
- Accessibility acceptance details are absent even though UI structure changes.
- API specification details are referenced structurally but not actually provided in the fetched content.
