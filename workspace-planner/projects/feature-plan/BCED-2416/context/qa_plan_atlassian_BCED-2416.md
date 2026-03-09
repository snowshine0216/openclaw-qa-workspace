# Atlassian Domain Summary: BCED-2416 — Enhance Workstation dashboard authoring experience with Library capability parity

## 📊 Summary

| Field | Value |
|---|---|
| Jira Issue | [BCED-2416](https://strategyagile.atlassian.net/browse/BCED-2416) |
| Parent Initiative | PRD-126 — Composable and Competitive Analytical Experiences with Dashboards |
| Confluence Page | [BCIN-7289](https://microstrategy.atlassian.net/wiki/spaces/~kawang/pages/edit-v2/5949096102) |
| Date Generated | 2026-03-09 |
| Feature Type | Enhancement / parity migration to embedded editor |
| Release Context | 25.08 initial ship, 25.09 guarded by Help-menu toggle; related design page targets 26.04 for report-authoring analogue |
| Primary Platforms | Workstation + Library Web / embedded iframe context |

## 📋 Background
BCED-2416 migrates Workstation dashboard authoring away from a separate native React implementation toward a **Library-based embedded authoring experience**. The stated business reason is to reduce maintenance cost and eliminate behavior drift between Workstation, Library, and Web.

The Jira feature is specifically about **dashboard authoring parity** in Workstation. The provided Confluence design page (BCIN-7289) is for the closely related **report authoring embedding pattern**. Even though it is not the exact dashboard feature doc, it is highly relevant because it documents the embedding architecture, feature-flag/version gating approach, Workstation plugin changes, menu duplication strategy, API/service hooks, and many of the same Workstation-vs-Library behavioral differences that also matter for dashboard QA planning.

## Problem Statement
Workstation had its own authoring behavior and UI differences versus Library, which created:
- extra development and maintenance burden,
- repeated parity work for features and bug fixes,
- regression risk when features landed in one surface but not the other,
- native/embedded behavior mismatches around dialogs, menus, close behavior, and loading.

## Solution Overview
- Use **embedded Library authoring in Workstation** instead of maintaining a fully separate authoring surface.
- Gate the new experience by **client-side Workstation preference** and **server version compatibility**.
- Reuse Library authoring behavior wherever possible.
- Keep Workstation-native dialogs / commands where required, especially for save flows and certain native integrations.
- Preserve fallback to the **legacy editor** when server support or runtime conditions do not allow the new flow.

## Business / Product Impact
- Reduced maintenance cost by consolidating authoring logic.
- Faster downstream parity: newly added Library features can flow into Workstation more automatically.
- Better long-term consistency for analyst users authoring dashboards in Workstation.
- Short-term risk accepted: some performance degradation and embedded-context defects were known during rollout.

---

## 🎯 Requirements Summary

### Functional Requirements

| ID | Requirement | Priority | Source |
|---|---|---:|---|
| FR-1 | User can enable the new dashboard editor from **Help → Enable New Dashboard Editor** | P0 | BCED-2416, CGWI-1544 |
| FR-2 | New dashboard flow opens dataset-select page, then opens Library-based editor | P0 | BCED-2416 |
| FR-3 | Edit dashboard from context menu opens new editor directly | P0 | BCED-2416 |
| FR-4 | **Edit without Data** enters pause mode | P0 | BCED-2416 |
| FR-5 | Create dashboard from dataset opens new editor with selected dataset context | P0 | BCED-2416 |
| FR-6 | Save / Save As use native Workstation save dialog | P0 | BCED-2416 |
| FR-7 | Presentation mode enters presentation view; Edit returns to authoring | P1 | BCED-2416 |
| FR-8 | Cancel button or close X cancels execution / closes correctly | P0 | BCED-2416, BCFR-46 |
| FR-9 | Legacy/local editor remains supported through 25.12 for local mode | P1 | BCED-2416 |
| FR-10 | Pre-supported server versions fall back to legacy editor; supported versions use new editor | P0 | BCED-2416, comments |
| FR-11 | Privileges / ACL must match Library Web behavior | P0 | BCED-2416 QA summary |
| FR-12 | Workstation-native integrations still work in embedded editor (save as template, export, comments, object editors, properties, close window) | P0 | CGWI-661, BCIN-7289 |
| FR-13 | Data Import, visualizations, export, auth, and custom fonts behave correctly in WS editor parity scope | P1 | BCSM-2114, BCVE-1534, BCVE-1535, BCSA-848, BCIN-1190 |

### Non-Functional Requirements

| ID | Requirement | Target / Expectation | Source |
|---|---|---|---|
| NFR-1 | Performance should not obviously degrade vs 25.07 Workstation | Qualitative target; known low-pass accepted | BCED-2416 QA goal |
| NFR-2 | Open dashboard overhead should be limited | Known observed degradation: +2s to +4s | BCED-2416 QA summary |
| NFR-3 | First-time create/open should be acceptable | Known issue: ~20s degradation depending on network in 25.09 | BCED-2416 QA summary |
| NFR-4 | Scroll / manipulation responsiveness should remain comparable | Known issue: scrolling not smooth | BCED-2416 QA summary |
| NFR-5 | Embedded editor should not break Workstation-native workflows | Required for save dialogs, close, comments, object editors | BCIN-7289 |
| NFR-6 | No privilege escalation via embedded authoring | Authorization must mirror Library Web | BCED-2416 QA summary, BCIN-7289 security section |
| NFR-7 | No major extra network overhead when bundles are packaged locally | Bundling into Workstation intended as mitigation | CGWI-1570, CGWI-1397, BCIN-7289 |

### Acceptance Criteria / Explicit Expected Behavior
- Given the user enables **Enable New Dashboard Editor**, when the user creates or edits a dashboard against a supported server, then the new embedded editor is used.
- Given the server is older than the supported version, when the user creates or edits a dashboard, then Workstation falls back to the legacy editor.
- Given the user creates a dashboard from the create menu or icon, when they select a dataset and click Create, then the new editor opens with the expected dataset context.
- Given the user right-clicks an existing dashboard and selects Edit, then the editor opens directly.
- Given the user selects **Edit without Data**, then the editor enters pause mode rather than executing with live data.
- Given the user clicks Save or Save As, then Workstation shows the native save dialog.
- Given the user enters presentation mode, then the UI switches to presentation view and can return to authoring through Edit.
- Given the user lacks proper privilege / ACL, then editing must be blocked consistently with Library Web.
- Given the user closes or cancels during execution, then execution should be canceled and window lifecycle should complete cleanly.

---

## 🧱 Architecture and Design Findings

## Embedded-authoring pattern from Confluence (BCIN-7289)
Although this page is for report authoring, it provides the clearest architectural evidence for the embedding approach being generalized in Workstation:

### High-level design
- Workstation plugin adopts **iframe embedding** of Library authoring page.
- A **single plugin** supports both classic and embedding editors.
- Before React app mount, Workstation checks:
  - **server/web version**,
  - **Workstation preference**.
- If compatible + preference enabled, Workstation loads embedding script and **does not mount classic editor**.
- Otherwise it mounts the classic editor.

### Important platform mechanics
- New embedding window is registered in `workstation.json`.
- Duplicate menu/context/object-editor entries are registered for old and new windows with different `isVisible` / `canExecute` conditions.
- Different menu categories may exist in the embedded editor; in the report design, **FORMAT** and **VIEW** menu categories are absent, which implies menu coverage differences are expected and should be tested explicitly in dashboard parity too.

### SDK / service hooks called out in design
The embedding pattern introduces or relies on API/service hooks such as:
- `deleteDossierInstance`
- `_closeWorkstationReportAuthoring`
- `cancelLoadingAndShowErrorDialog`
- `_getAuthoringPageState`
- config-driven functions like:
  - `errorHandler`
  - `getUserComments`
  - `openObjectEditor`
  - `openObjectProperties`
  - `openSaveAsDialog`
  - `closeWindow`
  - `setWindowTitle`

### Relevant embedded-context implications for dashboard QA
This pattern implies QA must verify not only page rendering, but also the contracts between:
- Workstation native shell,
- embedded Library authoring page,
- menu visibility conditions,
- dialog routing,
- close/error events,
- object/window lifecycle,
- platform-specific APIs.

---

## 🔍 Related Jira Evidence and What It Means for QA

### CGWI-1544 — Help-menu toggle / preference
- Adds **"Enable New Dashboard Editor"** under Help menu.
- Default is **unchecked**.
- Preference key exposed to plugins: **`new-dashboard-editor`**.

**QA significance**:
- test default-off behavior,
- preference persistence across restarts / reconnects,
- immediate routing change after toggle,
- behavior when toggle state changes while windows already exist.

### CGWI-661 — Workstation support for new dossier editor
Even though it references dossier, the behavior is clearly applicable to dashboard embedding patterns:
- Save dialog must expose **save as template** when applicable.
- Legacy **Edit without Data** menu needs visibility cleanup when preview/new-editor conditions apply.
- Avoid `WebError.html` leakage for internal dashboard errors.

**QA significance**:
- verify menu duplication / hiding logic,
- verify error handling remains Workstation-native and does not show raw fallback pages,
- verify template-related controls appear correctly in save flows.

### CGWI-1570 / CGWI-1397 — performance mitigation / native enhancements
- Bundle dashboard code into Workstation to reduce initial fetch cost.
- Explicitly created because performance degradation was already observed.

**QA significance**:
- performance testing is not optional; it is directly tied to acceptance risk.
- compare first open vs repeat open.
- compare online/network-sensitive behavior.

### BCSA-848 / BCSM-2114 / BCVE-1534 / BCVE-1535 / BCIN-1190
These stories show parity scope includes:
- authentication in ws editor,
- data import in ws editor,
- visualizations in ws editor,
- export in ws editor,
- custom font availability in Workstation.

**QA significance**:
- treat dashboard authoring as a composite surface touching multiple subsystems.
- do not stop at core create/edit/save; also validate secondary authoring capabilities.

### BCFR-46 — cancel SQL execution on close
- Customer expectation: closing report/dossier should cancel backend SQL execution.
- Strongly supports BCED-2416’s cancel/close requirement.

**QA significance**:
- validate cancel semantics, not just UI close.
- confirm backend execution truly stops where observable.
- validate partial-load and long-running-query scenarios.

---

## 🧪 Test Scenarios Derived from Atlassian Evidence

## A. Toggle / routing / version-gating scenarios

| Test ID | Scenario | Given | When | Then | Priority |
|---|---|---|---|---|---:|
| ATL-001 | Default-off in 25.09 | 25.09 WS, feature toggle untouched | User opens create/edit dashboard | Legacy editor is used by default | P0 |
| ATL-002 | Enable new editor | Supported server + Help menu toggle off | User enables toggle | Subsequent dashboard create/edit routes to new editor | P0 |
| ATL-003 | Toggle persistence | Toggle enabled | User restarts Workstation / reconnects | Same preference state persists as designed | P1 |
| ATL-004 | Unsupported server fallback | Pre-25.08 or pre-25.09 server | User tries create/edit with toggle on | Legacy editor opens, no broken workflow | P0 |
| ATL-005 | Supported server routing | 25.08+ / 25.09+ supported server | User create/edit dashboard | New embedded editor opens | P0 |
| ATL-006 | Mixed environment behavior | User connected to old and new environments | User creates/edits from each environment | Correct editor chosen per environment, no menu confusion | P1 |

## B. Core authoring flows

| Test ID | Scenario | Given | When | Then | Priority |
|---|---|---|---|---|---:|
| ATL-010 | New dashboard from create icon | Toggle on + supported server | User clicks create icon, selects dataset, clicks Create | New editor opens with selected dataset | P0 |
| ATL-011 | New dashboard from Workstation menu | Toggle on + supported server | User starts creation from menu | Same flow succeeds as icon entrypoint | P0 |
| ATL-012 | Edit existing dashboard | Existing dashboard visible | User right-clicks and selects Edit | New editor opens directly | P0 |
| ATL-013 | Edit without Data / pause mode | Existing dashboard supports edit without data | User selects Edit without Data | Editor enters pause mode, no unintended execution | P0 |
| ATL-014 | Create from dataset context menu | Dataset exists | User right-clicks dataset → Dashboard from dataset | New editor opens with correct source binding | P0 |
| ATL-015 | Presentation mode round trip | Editor open | User enters presentation mode then clicks Edit | Returns to authoring state without losing work | P1 |
| ATL-016 | Theme menu in menu bar | Editor open | User inspects menus and changes theme | Theme controls appear in intended location and work | P1 |

## C. Save / Save As / template / object visibility

| Test ID | Scenario | Given | When | Then | Priority |
|---|---|---|---|---|---:|
| ATL-020 | Save uses native dialog | Unsaved dashboard in new editor | User clicks Save | Native Workstation save dialog appears | P0 |
| ATL-021 | Save As uses native dialog | Saved dashboard in new editor | User clicks Save As | Native dialog appears with correct defaults | P0 |
| ATL-022 | Save-as template controls | Template/certify applicable environment | User saves new dashboard / save as | Template / certify controls appear where expected | P0 |
| ATL-023 | New object visible after create/save-as | Save/create into folder | User completes save | New dashboard appears without requiring manual refresh | P0 |
| ATL-024 | Window title updates | Save or rename occurs | User saves / changes name | Workstation window title updates appropriately | P1 |

## D. Cancel / close / error handling

| Test ID | Scenario | Given | When | Then | Priority |
|---|---|---|---|---|---:|
| ATL-030 | Cancel during execution | Dashboard executing | User clicks cancel button | Execution stops and UI reflects canceled state | P0 |
| ATL-031 | Close with X during execution | Long-running execution | User clicks window X | Execution is canceled; cleanup occurs | P0 |
| ATL-032 | Close with unsaved changes | Dirty authoring session | User closes window | Confirm dialog appears and chosen action is honored | P0 |
| ATL-033 | Internal editor error | Induced internal HTML / rendering error | Error occurs | Workstation error handling shown; no raw `WebError.html` | P0 |
| ATL-034 | Error dialog behavior in embedded context | Library-side caught error | User acknowledges error | Expected close/dismiss behavior occurs per embedded logic | P1 |
| ATL-035 | Library navigation action closes window correctly | Embedded editor triggers goBack/goHome/exit edit mode | Action fired | Workstation window closes or transitions correctly | P1 |

## E. Security / auth / privilege scenarios

| Test ID | Scenario | Given | When | Then | Priority |
|---|---|---|---|---|---:|
| ATL-040 | No edit privilege | User lacks edit privilege / ACL | User attempts Edit | Action blocked consistently with Library Web | P0 |
| ATL-041 | Save privilege denied | User can open but not save target | User attempts Save / Save As | Proper denial, no partial or misleading success | P0 |
| ATL-042 | Auth in embedded editor | Auth-required action/data source | User launches authoring flow | Auth works in embedded context | P0 |
| ATL-043 | OAuth/SDK/CC source workflow | Embedded authoring with OAuth/SDK/CC data source | Auth popup/window flow occurs | Context communication works; no showstopper failure like DE332662 | P0 |
| ATL-044 | Session timeout during load | Session expires while loading | User continues | Error handling shown and app recovers safely | P1 |

## F. Performance / responsiveness scenarios

| Test ID | Scenario | Given | When | Then | Priority |
|---|---|---|---|---|---:|
| ATL-050 | First-time blank dashboard creation | Fresh session, cold cache | User creates first dashboard | Measure observed first-load overhead; no catastrophic hang | P0 |
| ATL-051 | First-time existing dashboard open | Fresh session, cold cache | User opens existing dashboard | Measure first-open latency; compare to known ~20s defect risk | P0 |
| ATL-052 | Repeated open | Warm state | User reopens dashboard | Load materially better than first-open where expected | P1 |
| ATL-053 | General open degradation | Typical dashboard set | User opens dashboards | Verify overhead remains within known/accepted range (+2s to +4s risk area) | P1 |
| ATL-054 | Scroll responsiveness | Editor loaded with larger dashboard | User scrolls in editor | Scroll is usable; capture smoothness regression against DE331633 | P0 |
| ATL-055 | Manipulation parity | Typical authoring manipulations | User edits / rearranges / changes properties | Manipulations behave comparably to default editor / Library | P1 |
| ATL-056 | Network sensitivity | Varying network conditions | User first-opens dashboard | Quantify embedded dependency on network | P1 |

## G. Data source / subsystem / parity scenarios

| Test ID | Scenario | Given | When | Then | Priority |
|---|---|---|---|---|---:|
| ATL-060 | Data Import in new editor | DI-capable workflow | User invokes DI flow | Embedded editor supports it correctly | P1 |
| ATL-061 | Visualization authoring parity | Visualization-rich dashboard | User edits vis properties | Expected WS+Library parity preserved | P1 |
| ATL-062 | Export from ws editor | Export-capable dashboard | User exports | Export flow succeeds from embedded editor | P1 |
| ATL-063 | Custom fonts | Custom fonts available in environment | User opens font picker / renders text | Fonts available or rendered per supported parity scope | P2 |
| ATL-064 | Object editor / properties dialogs | Editable object selected | User opens object editor / properties | Workstation-native dialogs open and persist changes | P1 |
| ATL-065 | Comments dialog | Comments supported | User invokes comments flow | Comments dialog opens in expected native path | P2 |

## H. Local mode / compatibility / edge-case scenarios

| Test ID | Scenario | Given | When | Then | Priority |
|---|---|---|---|---|---:|
| ATL-070 | Local mode unaffected before retirement | Local mode enabled | User edits in local mode | Legacy/local behavior preserved through 25.12 | P1 |
| ATL-071 | Save-as to metadata from local mode | Local-mode authoring session | User saves as metadata | Current page behavior matches requirement; reopen shows new style | P1 |
| ATL-072 | Legacy/new menu duplication cleanup | Mixed state / preview state | User inspects context menus | No duplicate or stale menu entries | P0 |
| ATL-073 | Folder + connection editor message cleanup | Connection editor involved | User closes connection editor after prompt | No stale message remains (DE334755 regression) | P1 |
| ATL-074 | Mosaic-model-related workflow boundaries | Dataset/model involves Mosaic limitations | User reaches unsupported path | Unsupported paths are hidden or fail gracefully, not exposed incorrectly | P2 |

---

## ⚠️ Risk Assessment

### Technical Risks

| Risk | Impact | Likelihood | Evidence | QA Focus |
|---|---|---|---|---|
| First-load performance degradation | High | High | DE332080, CGWI-1570 | Cold-start timing, repeat-open comparison, network sensitivity |
| Scroll / manipulation lag | Medium | High | DE331633 | Large-dashboard interaction and scrolling |
| Save dialog / template parity gaps | High | Medium | DE331555, CGWI-661 | Save/Save As/template/certify coverage |
| New object not visible after save | High | Medium | DE332260 | Post-save folder refresh / object list update |
| OAuth/SDK/CC auth flow failure in embedded context | Critical | Medium | DE332662 comments | Auth popup / shared-context flows |
| Incorrect menu visibility or duplication | Medium | Medium | CGWI-661, BCIN-7289 | Context menu + Help/File menu matrix |
| Raw error-page fallback (`WebError.html`) | Medium | Medium | CGWI-661 | Forced error handling scenarios |
| Version-gating defects | High | Medium | BCED-2416 QA summaries | Old/new server routing matrix |
| Embedded/native close-event mismatch | High | Medium | BCIN-7289 event/service design | Close, cancel, unsaved changes, goBack/goHome |
| Privilege mismatch vs Library | Critical | Low-Med | BCED-2416 SEC summary | ACL-denied edit/save cases |

### Product / UX Risks
- Feature hidden by default in 25.09 can mask defects until explicit enablement.
- Behavior differences between embedded and classic menu structures may confuse users.
- Mixed-environment users may encounter routing inconsistency if preference and server gating interact poorly.
- Unsupported or partially supported subsystem paths (e.g. Mosaic, special data source auth flows) may produce high-severity escape defects.

---

## 🔗 Integration Points to Cover in QA

| Integration | What must be validated |
|---|---|
| Workstation Help menu preference | Toggle visibility, state persistence, plugin preference propagation |
| Server-version detection | Correct legacy/new editor routing |
| Workstation plugin ↔ embedded Library page | Window lifecycle, event handling, native dialog invocation |
| Native save dialog | Save, Save As, template, certify behavior |
| Error handling bridge | No raw fallback pages; proper Workstation dialog handling |
| Auth / OAuth / SDK / CC source windows | Context continuity, popup communication, failure recovery |
| Folder/object tree refresh | Newly created or save-as objects visible promptly |
| Data Import / visualization / export subsystems | Capability parity inside embedded authoring |
| Privilege / ACL enforcement | Same authorization result as Library Web |

---

## 📌 Explicit Defects / References Worth Carrying into QA Plan
- **DE331555** — missing Certify / Set as template checkbox on new-created dashboard save.
- **DE332260** — saved/new dashboard not shown under folder until refresh.
- **DE331633** — hard / unsmooth scrolling in dashboard.
- **DE332080** — obvious first-create / first-render performance degradation.
- **DE334755** — stale message after connection editor closes.
- **DE332662** — OAuth/SDK/CC sources fail in embedded dashboard mode because popup/window context is isolated.
- **DS2856** — defect tracking bucket referenced by QA summary.
- **US614013** — planned automation track.
- **US629449** — performance optimization follow-up.

---

## 📋 Test Data / Environment Considerations from Atlassian Evidence
- Need both **supported** and **unsupported older server versions**.
- Need datasets / dashboards suitable for:
  - create from dataset,
  - edit existing dashboard,
  - edit without data / pause mode,
  - presentation mode,
  - save-as to folder,
  - template/certify eligibility,
  - connection-editor prompts,
  - OAuth/SDK/CC source coverage,
  - large enough dashboards to expose scroll / performance regressions,
  - privilege-restricted objects/users,
  - local mode compatibility checks,
  - Mac + Windows Workstation.

## Cross-platform / environment notes
- User specifically asked to focus on **Mac and Windows Workstation**. Atlassian evidence does not call out OS-specific divergences, so this remains an **important inferred QA axis**, especially for:
  - native save dialogs,
  - Help-menu behavior,
  - popup/auth handling,
  - window close / focus behavior,
  - font availability and rendering,
  - performance perception.

---

## 💡 Open Questions / Ambiguities to Carry Forward
1. The supplied Confluence page is a **report-authoring** design, not the exact dashboard feature design. It is still useful because it documents the same embedding pattern, but downstream plan synthesis should note that some dashboard-specific details are inferred by analogy.
2. Jira migration output for several child stories is sparse; they confirm scope areas but do not fully document acceptance criteria.
3. Exact server-version boundary wording varies slightly in the issue text and QA summary (25.08 vs 25.09 framing) because 25.09 added default-off behavior. QA should treat this as a **matrix**:
   - server compatibility,
   - feature toggle state,
   - release-specific default.
4. Comments indicate **Mosaic model** support is intentionally limited / not ready for 25.09. Unsupported-path behavior should be explicitly validated, not assumed.

---

## ✅ Recommended QA Emphasis for Synthesis Phase
If this Atlassian summary is merged into the unified QA plan, the highest-value areas to preserve are:
1. **Toggle + version-gating matrix**
2. **Create / edit / edit-without-data / save / save-as / presentation round trip**
3. **Cancel / close / error handling / unsaved-changes behavior**
4. **Privilege and auth coverage, especially OAuth/SDK/CC**
5. **Performance on cold start and scroll/manipulation**
6. **Folder refresh and post-save state consistency**
7. **Cross-platform Workstation native-shell differences**
8. **Parity subsystems: export, DI, visualizations, fonts, template/certify**
