# Research: Gap Analysis — Library Web vs Workstation Report Editor

_Last updated: 2026-03-09_

## Executive Summary

This document synthesizes all gathered evidence on the functional gap between the **MicroStrategy Library Web report/dashboard editor** and the **classic Workstation authoring experience**, and what has been (or is being) consolidated through the parity migration work (F43445 for dashboards; BCED-2416 for reports).

The research is based on:
1. Internal Confluence pages related to `F43445` dashboard parity migration.
2. Older Confluence design pages documenting specific gap/parity items.
3. Official public product help pages.
4. Tavily search results.

---

## 1. What Library Web had that the classic Workstation report editor lacked

### 1.1 Functional features not available in the classic Workstation editor

Based on the `F43445` parity docs and related evidence, classic Workstation's embedded dashboard/report editors historically lacked the following Library-side capabilities:

| Feature | Library Web | Classic Workstation | Notes |
|---|---|---|---|
| Custom fonts | ✅ Yes | ❌ No | Explicitly listed as newly added in new editor |
| Export visualization data to Excel | ✅ Yes | ❌ No | Added via new editor |
| Cancel button — initial execution | ✅ Yes (explicit button) | ❌ No/Weak | Close-button side effect only |
| Cancel button — manipulation execution | ✅ Yes | ❌ Limited | Some manipulation types only |
| Cancel during apply-prompts (dashboard) | ✅ Yes | ❌ No | No cancel-button parity |
| Cancel re-prompt flow — return to prompt state | ✅ Yes with answer preservation | ❌ Missing | |
| Selector panel / selector window with apply button | ✅ Yes | ❌ Not in classic | Added in new editor |
| Page-level Auto Narrative | ✅ Yes | ❌ Not in classic | Added in new editor |
| Scope filter | ✅ Preview | ❌ Not in classic | Added via new editor |
| Auto dashboard | ✅ Yes | ❌ Not in classic | Added via new editor |
| Generate embedding URL | ✅ Yes | ❌ No | Newly added |
| Pass value/element prompts via URL API | ✅ Yes | ❌ No | Newly added |
| Dashboard-level PDF export settings | ✅ Yes | ❌ No | Added via new editor menu |
| Toolbar icon consistency | ✅ Library icons | ❌ Older icons | Updated in new editor |
| Future Library features automatically available | ✅ Yes | ❌ No (required separate porting) | Key structural benefit of migration |

### 1.2 Cancel execution parity detail

The internal `F43454` cancel-execution doc gives the most detailed known mapping:

**Report without prompt:**
- Library: cancel button appears immediately; clicking cancels jobs and returns user to Library Home.
- Workstation: cancel button **was present** in at least some flows (edit → resume data / re-execute), but not universally.

**Report with prompt:**
- Library: cancel during prompt application → return to answer-prompt page with original input preserved; nested prompt → return to first page.
- Workstation: gap was present — exact behavior depended on flow.

**Dashboard without prompt (initial execution):**
- Library: cancel button shown; click → home; jobs cancelled.
- Workstation: **no cancel button** in classic editor; close-button might cancel job.

**Dashboard with prompt:**
- Library: cancel during apply → return to prompt page with original answers preserved.
- Workstation: **no corresponding cancel button**.

This directly affects report editor QA for BCED-2416: the same cancel-model gap that existed in dashboards was likely also present in classic report editor, and parity work should close it.

### 1.3 Export dialog consistency gap

Older internal design doc `[SE Design] Make Workstation Export Dialog Consistent with Library` (circa M2020 Update 2) shows that at that time:

- Library PDF export had been updated with smart defaults, revised strings, new tooltips, accessibility improvements.
- Workstation export dialog had **not** yet received these updates.
- The feature aimed to make Workstation export dialog match Library behavior by reusing BIWeb code/style.

This pattern — Library advancing export UX, Workstation lagging — has been a recurring theme. The new WebView-embedded editor closes this gap structurally by embedding the Library code directly.

### 1.4 Advanced/VLDB property features

The internal `Advanced Properties (VLDB settings)` design doc and the `TH4202/TH4203` graph formatting gap spike reveal a structural limitation in classic Workstation:

- Developer used COM APIs to configure many graph/grid/report properties.
- Workstation used XML APIs.
- Many COM API capabilities had **no XML API counterpart**, meaning Workstation could not expose them.
- Each capability had to be specifically identified, API-mapped, and implemented; this was slow and led to an ongoing gap list.

With the new WebView editor (Library embedded inside Workstation), this entire class of gap is eliminated for properties that the Library editor already exposes, since it runs the same code.

### 1.5 Graph formatting properties gap

Specifically from the `TH4202/TH4203` spike:

The following graph property categories were identified as gaps in Workstation (not exhaustive — these are example categories):

- Axis alignment and rotation
- Show/hide gridlines per axis
- Disable fractional gridlines
- Grid style (regular, ticks, inner ticks, outer ticks)
- Minor gridlines
- Manual gridlines
- Label location (left/right, top/bottom, both)
- Dual-Y axis options
- Other formatting properties in the `Graph → Preferences / Axis / ...` menu tree

The root cause: many of these used COM API values that Workstation's XML API did not yet support.

This is relevant for BCED-2416 because the new report editor embedded from Library will either support these properties or surface them in a Library-consistent way — but any **per-property verification** between the new and old editors could surface unexpected regressions or differences.

---

## 2. Features unique to Workstation not available in Library Web

Even after the parity migration, Workstation retains certain desktop-specific features that Library Web cannot replicate.

### 2.1 Currently confirmed Workstation-specific retained features

From internal F43445 docs:

- **Switch editors/windows from the Window menu** — Workstation's native window management (ability to switch between multiple open dashboards from a native window-management UI). Library Web doesn't have multiple windows in the OS desktop sense.
- **Change journal recording** — Workstation-specific audit/change-tracking capability, retained even in new editor.

### 2.2 Legacy Workstation-specific features that Library did not historically offer

Based on the research, these are other known Workstation-specific capabilities:

- **Convert a Report to an Intelligent Cube** (explicitly documented in current public help: `Convert a Report to an Intelligent Cube`, available from Strategy One October 2025). Library Web does not appear to offer this directly.
- **Data Import / Super Cube creation from Excel** — Workstation supports importing data from Excel to create Super Cubes. This is a Workstation-specific data ingestion workflow.
- **Local mode execution** — Workstation can run in local mode without a server connection for certain workflows (though this is constrained and overlaps with DI/local data).
- **Native desktop file dialogs** — for local file access, OS-level save/open dialogs are used rather than browser-based alternatives.
- **Scripts / background automation** — Workstation supports scripts to automate tasks (e.g., the KB article on creating Super Cubes via scripts).
- **Admin console functions** — Workstation serves as an admin/operations console. These capabilities (server admin, security, project settings, etc.) are not replicated in Library Web.
- **Plugin architecture** — Workstation has a plugin app framework for extending functionality (Freeform SQL report editor plugin, Library Admin plugin, Distribution Service plugin, etc.). Library Web authoring does not have the same plugin model.
- **Change Journal** — mentioned explicitly above; provides a native audit trail for authoring changes.

### 2.3 DI (Data Import) and local data

The internal `Spike for Transform DataImport Editor to a Plugin in Workstation` doc references that Workstation supports **local mode data importing** which does not require iServer. This is a meaningful differentiation from Library Web, which always requires a server connection.

---

## 3. What was migrated/consolidated in F43445 (and by analogy BCED-2416)

### 3.1 What F43445 consolidated

F43445 migrated the Workstation **dashboard authoring editor** from a classic embedded/native-style editor to a **WebView-based editor** that embeds the Library Dashboard Editor. This brought:

- Most Library dashboard editor features into Workstation with no additional porting effort.
- Consistent UI (icons, menus, panel layouts).
- A structural path for future Library features to appear in Workstation automatically.

The specific gap items explicitly closed by F43445 (per internal docs):

- custom fonts
- generate embedding URL
- export visualization data to Excel
- page-level Auto Narrative
- selector panel / selector window with apply button
- scope filter (preview)
- cancel execution support
- auto dashboard
- pass value/element prompts via URL API
- dashboard PDF export settings/default settings menu
- toolbar icon parity

### 3.2 Expected scope for BCED-2416 (report editor migration)

By direct analogy:

- BCED-2416 is expected to apply the same WebView/Library-embedding migration pattern to the **report editor** in Workstation.
- This would close the same class of gap between classic Workstation report editor and Library Web report editor.
- Features that Library Web report editor supports would become available in Workstation's new report editor.

Based on what Library Web report editor currently supports (from official help and FAQs), the expected scope includes parity for:

- Report prompts (all types)
- Page-by
- SQL view in execution / paused modes
- Drilling
- Advanced Properties (VLDB/data properties)
- Custom groups
- Consolidations
- Transformations
- Formatted subtotals / customized subtotals
- Export to PDF / Excel
- Cancel execution
- Undo/redo
- Report templates (Library/Workstation shared template mechanism)
- Themes
- Full formatting toolset

---

## 4. What remains different or out of scope after migration

### 4.1 Features structurally specific to Workstation (out of scope for Library parity)

- Convert to Intelligent Cube
- Data Import / local data ingestion
- Plugin architecture
- Change journal
- Window menu / multi-window switching
- Native OS-level file dialogs
- Scripts/automation via Workstation
- Admin console functions (server/project management)

### 4.2 Known remaining limitations

From internal docs for F43445 (and expected to apply similarly to BCED-2416):

- **Performance tradeoff** is not eliminated — the WebView-based editor has an inherent overhead vs the classic WinForms rendering path.
- **Scroll behavior** was still not smooth as of 25.09 (`DE331633`, deferred).
- **Local mode** support status for the embedded editor is unclear and likely limited/out-of-scope.
- **Older Library/server versions** will always fall back to the classic editor — this is by design, not a defect, but it means users connected to pre-threshold servers never see the new editor.

### 4.3 Features that may remain only in Library Web (not ported)

Based on available evidence:

- Report Services Documents (RSD/document authoring) — Library and Workstation handle these differently; full authoring parity was historically not a goal.
- Mobile-specific transaction service workflows — explicitly called out in community articles as not covered by report/dashboard authoring parity.
- Some deeply Developer/COM-only properties — properties with no XML API counterpart may still not surface in the embedded editor depending on whether Library Web has added them.

---

## 5. Upgrade and compatibility gaps

### 5.1 Version-based fallback behavior

The internal F43445 QA plan and docs document:

- **New editor available only** when connected to a Library of the threshold version or later.
- **Classic editor used automatically** when connected to an older Library/server.
- No workflow breaks across versions — server-version detection and transparent fallback are part of the feature design.

QA should test:

- Connecting to a supported server → new editor appears
- Connecting to an unsupported server → classic editor appears
- Switching environments within a session
- Upgrading the connected server mid-session

### 5.2 Pre-threshold server behavior for new features

Features added **only** to the new editor (e.g., cancel execution, custom fonts, embedding URL) will be **unavailable** when the user is connected to an older server. This is expected behavior but may confuse users who had the new editor toggled on with a newer server and then connect to an older one.

### 5.3 Save format compatibility

Items created with the new editor should save in a format compatible with older servers, because they leverage the same REST APIs/platform model. But any features that depend on newer server-side capabilities would not work when reconnecting to an older server (e.g., if a report uses scope filter created on new editor, behavior on old server may be undefined).

---

## 6. Authentication and privilege differences

### 6.1 Privileges required for report authoring

From official public Workstation help, the privilege set for report authoring includes:

| Action | Required Privileges |
|---|---|
| View an existing report | Use analytics, Use Report Editor, Web create new Report, Modify list of Report objects |
| Create a report | + Create application objects |
| Create from template | + Create Report, Browse/Execute permission on template |

### 6.2 ACL/privilege parity with Library Web

Internal QA plans for F43445 explicitly state:

> Security: **Privileges/ACL matches Library Web's behavior.**

This means the expected behavior for BCED-2416 should be:

- A user who cannot see/edit a report in Library Web should not be able to do so in the new Workstation report editor.
- The new editor should enforce the same ACL model as Library.
- HOWEVER — the classic Workstation editor may have previously enforced ACL differently; regression risk exists if any workflow gaps existed between classic and Library ACL enforcement.

QA edge cases to cover:

- User with Read-only access opens report in Workstation
- User with Execute but not Write access
- User with no access to specific objects within the report
- User without "Web create new Report" privilege
- ACL on save destination folder vs ACL on report object itself
- No access attribute/metric in dataset panels (the `Test Objects` Confluence page suggests these cases exist: `Dataset_01_AttNoAccess`, `Dataset_04_MetricNoAccess`)

### 6.3 Authentication and environment switching

The new editor's behavior depends on an active Library connection. This means:

- Session authentication state with Library matters.
- If a Library session expires mid-edit, the embedded editor behavior is undefined.
- Switching environments should cleanly reload the embedded editor context.

---

## 7. Performance gap summary

### 7.1 Key data from F43445 performance test

| Dashboard | 25.07 WS (s) | 25.08 WS (s) | Degradation |
|---|---|---|---|
| Government Administrative Policing | 34.96 | 39.75 | +13.7% |
| SLS.Leads | 21.19 | 23.36 | +9.7% |
| Adoption Redesign | 7.73 | 10.72 | +38.7% |
| TEC.PD | 7.36 | 8.61 | +17.0% |
| Employee Fitness | 7.28 | 9.32 | +28.0% |

**First-time create/open degradation: ~20s** (cached/warm improves this).

### 7.2 Root cause

- WinForms → WPF off-screen rendering change
- More resources fetched from Library (web assets)
- Cannot persist/cache resources locally the same way

### 7.3 Expected report editor impact

These performance impacts will likely also apply to the new Workstation report editor, since the same architecture change is expected. Key risk areas:

- First open of a new report (blank or template-based)
- First open of an existing report
- Prompt answer submission (network round-trip to Library)
- Execution resume/pause toggle latency

---

## 8. Summary: Gap Closure Matrix

| Category | Classic WS Gap | Closed in Migration? | Still Open / Workstation Only |
|---|---|---|---|
| Custom fonts | Yes (missing) | ✅ New editor | — |
| Cancel execution | Yes (missing/weak) | ✅ New editor | — |
| Cancel during prompts | Yes (missing) | ✅ New editor | — |
| Export to Excel/PDF | Partial | ✅ New editor improves | — |
| Selector panel / apply button | Yes | ✅ New editor | — |
| Auto Narrative | Yes | ✅ New editor | — |
| Embedding URL generation | Yes | ✅ New editor | — |
| Pass prompts via URL API | Yes | ✅ New editor | — |
| Toolbar icon consistency | Yes | ✅ New editor | — |
| New Library features going forward | Structural gap | ✅ Automatically available | — |
| Convert report to Intelligent Cube | N/A | — | ✅ Workstation only |
| Data Import / Super Cube from Excel | N/A | — | ✅ Workstation only |
| Change journal | N/A | — | ✅ Workstation only |
| Window/editor switching menu | N/A | — | ✅ Workstation only |
| Plugin architecture | N/A | — | ✅ Workstation only |
| Admin console | N/A | — | ✅ Workstation only |
| Local mode authoring | N/A | — | ✅ Workstation only (unclear scope for new editor) |
| Performance parity with old editor | — | ❌ Some degradation accepted | — |
| Scroll smoothness | — | ❌ Deferred (DE331633) | — |
| Pre-threshold server support | By design | ❌ Classic editor used (fallback) | — |
| RSD / Document authoring | N/A | Out of scope | — |
| Mobile-specific workflows | N/A | Out of scope | — |
| COM-only graph properties (some) | Yes (gap) | Partially (Library exposes subset) | Some may remain gaps |

---

## 9. Source list

### Internal Confluence pages read

- `F43445: Enhance Workstation dashboard authoring experience with Library capability parity` (ID: 5197529587)
- `F43445 WorkStation New Dashboard Editor Performance Test` (ID: 5190221884)
- `F43445 QA Plan page` (ID: 5186127599)
- `Draft Document of F43454 - Optimize the cancelling experience in dashboard and report execution in Library/Workstation` (ID: 5208899625)
- `[SE Design] Make Workstation Export Dialog Consistent with Library` (ID: 997434170)
- `Advanced Properties (VLDB settings and others)` (ID: 993460550)
- `TH4202 and TH4203 Spike and Grooming` (ID: 988451845) — graph formatting XML/COM API gap
- `F23459 RSD Enhancement — Support XML APIs for RSD enhancement (Developer Parity)` (ID: 756220137)
- `0 - Introduction of Plugin App Test Framework` (ID: 841884307)
- `Library Desktop Roadmap to MVP` (ID: 925434761)

### Public sources

- Workstation help: `Create and Edit Reports`
  - https://www2.microstrategy.com/producthelp/Current/workstation/en-us/Content/create_static_reports.htm
- Workstation help: `New Dashboard Editor in Workstation`
  - https://www2.microstrategy.com/producthelp/Current/Workstation/en-us/Content/new_dashboard_editor.htm
- Workstation help: `Convert a Report to an Intelligent Cube`
  - https://www2.microstrategy.com/producthelp/Current/Workstation/en-us/Content/report_to_cube.htm
- Library help: `Create Reports in Library Web`
  - https://www2.microstrategy.com/producthelp/Current/Library/en-us/Content/create_reports.htm
- Library help: `Report FAQs`
  - https://www2.microstrategy.com/producthelp/Current/Library/en-us/Content/report_faqs.htm
- Community: `Report Services Documents and MicroStrategy Library`
  - https://community.strategy.com/article/Report-Services-Documents-via-MicroStrategy-Library
- Workstation help: `Workstation vs Legacy Tools Feature Parity`
  - https://www2.microstrategy.com/producthelp/current/workstation/en-us/content/workstation_legacy_features.htm

### Raw evidence files

- Tavily outputs: `context/raw/tavily/`
- Confluence search and page fetch outputs: `context/raw/confluence/`
