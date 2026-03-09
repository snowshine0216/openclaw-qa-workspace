# Research: Workstation Report Editor Functionality Deep Dive

_Last updated: 2026-03-09_

## Executive Summary

I ran all requested Tavily searches, searched internal Confluence for the requested terms, and fetched the most relevant Confluence pages. There was **no direct Confluence hit for `BCED-2416 report editor workstation`**, so this write-up relies on a combination of:

1. **Official public product help** for Workstation/Library report authoring.
2. **Internal Confluence pages for the closely related dashboard parity migration** (`F43445`) and shared Workstation WebView architecture, which are highly relevant because they document the same migration pattern now being applied to authoring experiences in Workstation.
3. **Older Confluence pages for report/document authoring parity gaps** (prompts, advanced properties, export dialog consistency, XML API limitations), which help explain what classic Workstation historically could and could not do.

## Confidence and Scope Notes

- **High confidence**: current public Workstation/Library report-authoring capabilities, privilege model, and official help-page behavior.
- **High confidence**: Workstation’s new WebView/dashboard-editor pattern, enablement toggle behavior, version fallback logic, and performance tradeoffs, from `F43445` internal docs.
- **Medium confidence**: applying the same exact implementation details from the dashboard-editor migration to the report-editor migration under `BCED-2416`. This is a strong architectural analogy, but I did **not** find a direct Confluence design page for BCED-2416 itself.

---

## 1. What the classic/new Workstation report editor can do today

### 1.1 Baseline authoring capabilities in Workstation

From the official Workstation help (`Create and Edit Reports`), Workstation report authoring supports:

- creating a new report from the Reports area
- opening and editing an existing report
- drag-and-drop / double-click object insertion
- placing attributes on rows/columns and metrics in the Metrics zone
- creating and editing report filters
- pausing and resuming data retrieval while authoring
- quick subtotaling / totals
- formatting the report
- save / save as
- undo / redo for supported manipulations
- editing objects while still in editor mode

Public help also says the shipped report-authoring feature set now includes, over time:

- prompts
- page-by
- SQL view in execution mode / while paused
- drilling
- Advanced Properties
- more formatting options
- customized subtotals
- transformations
- consolidations
- custom groups
- report templates (newer releases)
- theme application (newer releases)

### 1.2 Save / Save As behavior

Public Workstation help explicitly documents:

- **Save** from the toolbar
- naming the report in **Save As**
- choosing the destination folder/location
- optional user comments in newer releases
- after save, **data retrieval pauses again**

This is useful for QA because save state and execution state are coupled.

### 1.3 Export behavior

Evidence across sources indicates these export-related capabilities matter for parity:

- official Library FAQ says reports can be exported to **Excel and PDF**
- internal parity pages for the new Workstation editor emphasize parity with Library export-related functions
- internal `F43445` page explicitly lists newly available items in the new editor such as:
  - **exporting visualization data to Excel**
  - Library-style export/PDF menu options
- older design doc `[SE Design] Make Workstation Export Dialog Consistent with Library` shows a longstanding pattern of aligning Workstation export behavior/UI with Library/BIWeb code

### 1.4 Cancel execution

The internal doc `Draft Document of F43454 - Optimize the cancelling experience in dashboard and report execution in Library/Workstation` is especially relevant.

It documents that before parity work:

- **Library Web** had a stronger, explicit cancel model.
- **Workstation** had gaps, especially around:
  - no dedicated cancel button in some dashboard executions
  - prompt-related cancel gaps
  - some workflows relying on close-window side effects rather than a first-class cancel UX

For **report workflows**, the doc notes:

- report execution without prompts had cancel support in Workstation in some edit/resume/re-execute flows
- prompt-related workflows in Library had a clearer cancel/return-to-prompt experience
- dashboard parity work was intended to bring Workstation closer to Library behavior

For BCED-2416 QA, this strongly suggests **report-editor parity validation should explicitly cover cancel behavior** in:

- initial execution
- re-execution
- prompt answer / re-prompt
- manipulation-triggered execution
- cancel while execution is in progress
- whether previous prompt answers are preserved after cancel

### 1.5 Advanced/report data properties

Public `Report FAQs` and internal `Advanced Properties (VLDB settings and others)` show that modern authoring is expected to support a more centralized property editing model.

Notable supported/property areas include:

- Evaluation Order
- drilling-related settings
- null values
- SQL generation settings
- report data properties formerly accessed via Developer/VLDB dialogs

This is important because classic Workstation historically lagged Developer/Web in some of these areas, while modern authoring is consolidating them into **Advanced Properties**.

### 1.6 Prompts

Prompt support is crucial for report-authoring parity.

Evidence:

- public Workstation help: prompt support was added during preview evolution
- internal `Prompt Page` doc describes prompt types and explicitly notes broad Library Web support
- prompt flows are closely tied to execution, save, and cancel behavior

Prompt-related areas to consider in functionality coverage:

- attribute element prompts
- object prompts
- metric qualification prompts
- hierarchy qualification prompts
- date/time, numeric, text, big decimal prompts
- nested prompts
- prompts as part of filters vs stand-alone prompt objects
- prompt answer preservation on cancel/re-prompt

---

## 2. How the new WebView-based editor works

## 2.1 Evidence from the dashboard-editor migration

The best internal evidence comes from `F43445: Enhance Workstation dashboard authoring experience with Library capability parity` and `F43445 WorkStation New Dashboard Editor Performance Test`.

These pages say Workstation introduced a **new WebView-based editor** that:

- incorporates **most features from the Library editor**
- is used when connected to a sufficiently new Library version
- falls back to the legacy editor when connected to older Library versions
- makes new Library-side features naturally available in Workstation

The same internal pattern is consistent with the older Workstation architecture doc `Introduction of Plugin App Test Framework`, which explains:

- Workstation is a mixed native + embedded web app
- Windows uses **CEF/Chromium Embedded Framework**
- macOS uses **native macOS WebView**
- the embedded “WebView” parts are web apps hosted inside the native container

## 2.2 Public evidence from the current new editor help page

The official public page `New Dashboard Editor in Workstation` states:

- the new editor increases parity with Library capabilities
- it is enabled from **Help → Enable New Dashboard Editor**
- it requires Workstation to be connected to **Library Strategy One (September 2025) or later**
- otherwise Workstation uses the **classic** editor

It also lists features newly available in the new editor, such as:

- custom fonts
- prompt via URL API support
- export-related functionality
- Library-style dashboard menu options

## 2.3 Likely architectural model for BCED-2416 report editor migration

Based on all evidence, the most plausible report-editor architecture is:

1. **Native Workstation shell** remains the desktop host.
2. A **Library/Web authoring experience** is embedded inside Workstation via WebView.
3. Workstation-specific desktop affordances remain outside/around that embedded editor.
4. Capability set is primarily determined by the underlying **Library/Web editor**, while Workstation adds desktop-specific integration points.

The Tavily search results also surfaced official Embedding SDK material (`microstrategy.dossier.create(...)`, embedded report page docs), which is not direct proof of BCED-2416’s exact implementation, but it reinforces the general Strategy pattern of **embedding web authoring/consumption experiences inside another host container**.

---

## 3. Help-menu toggle / preference behavior

## 3.1 What is directly evidenced

For the dashboard parity migration, internal and public docs clearly say:

- users go to **Help → Enable New Dashboard Editor**
- in 25.09 it was **disabled by default** and user-enabled
- older servers trigger fallback to the legacy editor

The user asked specifically to cover preference names `new-dashboard-editor` / `new-report-editor`.

### What I found

- I found strong evidence for the **menu entry** and the **dashboard toggle concept**.
- I **did not** find a direct internal/public page spelling out the exact persisted preference key string for report editor (`new-report-editor`) during this research run.
- Because of that, I recommend treating the key-name statement as a **verification target**, not a confirmed fact, unless a direct BCED-2416 design page or implementation diff later confirms it.

## 3.2 Practical QA implication

For the report-editor feature, verify:

- whether enablement is under **Help**
- whether the toggle is session-local or persisted
- exact persisted preference key name(s)
- whether the toggle is visible only when connected to supported server/library versions
- behavior after app restart / reconnect / environment switch

---

## 4. Version-based switching logic

## 4.1 Strongly evidenced pattern from dashboard parity work

Internal `F43445` docs provide a very clear pattern:

- **25.08 server** → use new WebView editor
- **pre-25.08 server** → fall back to legacy editor
- in **25.09**, feature can be disabled by default and turned on from Help
- public current docs later restate the model in branded terms: supported only with sufficiently recent Library; otherwise classic editor is used

## 4.2 How this maps to the requested “≥25.08/26.04” note

From the evidence gathered here, I can confidently state:

- **25.08** is the key internal threshold for the dashboard WebView migration.
- later public help documents the feature as requiring **Strategy One Sep 2025+** (rebranded/public release terminology).
- I did **not** find a direct Confluence page proving the exact **26.04** threshold for the report editor specifically.

So the safest wording is:

- **Confirmed pattern**: newer Library versions use the new embedded editor; older Library versions fall back to legacy.
- **Confirmed internal milestone for analogous dashboard parity**: 25.08.
- **Unconfirmed in this research run**: the exact report-editor threshold value `26.04`.

---

## 5. Platform-specific behavior: Windows, Mac, local mode

## 5.1 Windows vs Mac

Internal WebView framework documentation shows:

- **Windows Workstation**: CEF / Chromium Embedded Framework
- **Mac Workstation**: native macOS WebView

This means the same web authoring content may have different host/container behavior across platforms, especially in:

- focus handling
- keyboard shortcuts
- scrolling smoothness
- file picker dialogs
- drag/drop integration
- native menu/window behavior

## 5.2 Workstation-specific retained behaviors

Internal parity docs say some Workstation-specific features remain available even after migration, including:

- switching editors/windows from the **Window** menu
- **change journal** recording

These are important because parity is not pure replacement; it is **Library editor inside Workstation**, not just Library in a browser.

## 5.3 Local mode

The evidence collected here does **not** directly confirm that the new embedded authoring experience works in Workstation local mode.

In fact, the architecture and parity docs repeatedly emphasize dependence on a **Library** connection/version, which suggests local/offline or purely local-mode behavior may remain on legacy paths or be unsupported for the new editor.

For QA, local mode should be treated as a high-risk compatibility surface and explicitly tested for:

- absence/presence of the new editor toggle
- fallback behavior
- save/export behavior
- prompt execution / cancel behavior

---

## 6. Known performance characteristics

The most concrete performance evidence comes from `F43445 WorkStation New Dashboard Editor Performance Test` and the QA summary page.

## 6.1 Observed performance tradeoffs in the WebView migration

Internal docs report:

- ~**20s slower first create/open** in some first-time blank/open scenarios
- **2s–4s slower** opening for many dashboards vs prior Workstation/Library baselines
- most manipulations comparable to prior behavior, except **scrolling**
- **scroll not smooth enough** defect logged (`DE331633`)

## 6.2 Root-cause explanation documented internally

The internal performance doc explains the change from:

- **older WinForms/native rendering**, where Chromium can render more directly

to

- **WPF off-screen rendering (OSR)**, where Chromium paints to a bitmap and WPF copies that bitmap onto the UI repeatedly

It also notes extra time caused by:

- fetching more web resources from Library
- inability to persist some resources locally the same way as Library/browser flows

## 6.3 Relevance to report editor

Even though these measurements are for the dashboard editor, they are highly relevant to BCED-2416 because the report editor migration appears to follow the same desktop-host + embedded-web architecture.

Expected report-editor risks therefore include:

- slower first open than legacy editor
- extra dependency on Library/network round-trips
- potential scroll/input/focus regressions
- more pronounced performance differences on Windows than on a pure browser session

---

## 7. Known defects, limitations, and edge cases

## 7.1 Historical gaps between Library/Web and classic Workstation/Developer-style editors

Older parity/gap docs show repeated classes of missing capability in legacy/native flows:

- graph formatting gaps because **COM APIs** existed in Developer but equivalent **XML APIs** were missing for Workstation/web-based clients
- export dialog inconsistencies between Workstation and Library
- prompt and cancel inconsistencies
- some advanced property / VLDB settings distributed across older UIs or not yet surfaced

## 7.2 Specific defects surfaced in parity docs

From the `F43445` QA/performance pages:

- `DE331633` – hard/not-smooth scroll in Workstation new editor
- `DE332080` – obvious first-render / first-create performance degradation
- `DE331555` – missing “Certify” / “Set as template” checkbox on save for newly created dashboard
- `DE332260` – new dashboard/save-as folder visibility refresh issue
- `DE334755` – lingering message from Database Connections window in Workstation

These are dashboard examples, but they describe **the kinds of regressions to watch for** in report-editor migration:

- save dialog parity
n- refresh/state propagation after save/save-as
- embedded-window focus/state leakage
- scroll and rendering responsiveness
- feature visibility mismatch vs Library

## 7.3 Authentication / privilege edge cases

Public Workstation report-authoring help states required privileges include combinations of:

- Use analytics
- Use Report Editor
- Web create new Report
- Modify list of report objects / object browser usage
- Create application objects / Create Report
- template browse/execute permissions when using templates

Internal parity QA docs also state ACL/privilege behavior should match Library Web.

QA edge cases should therefore include:

- read-only user opens editor
- user can execute but not save
- user can save existing but not create new
- template visible but not executable
- prompted report opened by underprivileged user
- mixed privilege behavior after switching environments

---

## 8. Recommended QA focus areas for BCED-2416

Given the evidence, BCED-2416 should likely validate the following areas end-to-end:

1. **Editor selection/fallback**
   - supported Library version → new editor
   - unsupported/older Library version → legacy editor
   - Help-menu toggle on/off behavior

2. **Core report authoring**
   - create
   - edit existing
   - save
   - save as
   - reopen saved report
   - folder placement / refresh behavior

3. **Advanced authoring features**
   - prompts
   - drilling
   - page-by
   - SQL view
   - advanced properties
   - subtotals/custom groups/consolidations/transformations

4. **Exports / output actions**
   - export to PDF
   - export to Excel
   - menu consistency vs Library

5. **Execution control**
   - pause/resume data retrieval
   - cancel initial execution
   - cancel re-execution
   - cancel prompt apply/re-prompt

6. **Platform and host integration**
   - Windows vs Mac behavior
   - window switching
   - focus handling
   - scroll behavior
   - file dialogs

7. **Performance**
   - first open
   - reopen with warm cache
   - manipulation latency
   - prompt submission latency

---

## 9. Source list

### Internal Confluence pages read

- `F43445: Enhance Workstation dashboard authoring experience with Library capability parity` (ID: 5197529587)
- `F43445 WorkStation New Dashboard Editor Performance Test` (ID: 5190221884)
- `F43445: Enhance Workstation dashboard authoring experience with Library capability parity` QA page (ID: 5186127599)
- `Draft Document of F43454 - Optimize the cancelling experience in dashboard and report execution in Library/Workstation` (ID: 5208899625)
- `0 - Introduction of Plugin App Test Framework` (ID: 841884307)
- `Prompt Page` (ID: 997528663)
- `[SE Design] Make Workstation Export Dialog Consistent with Library` (ID: 997434170)
- `Advanced Properties (VLDB settings and others)` (ID: 993460550)
- `F23459 RSD Enhancement / Support XML APIs for RSD enhancement (Developer Parity)` (ID: 756220137)
- `TH4202 and TH4203 Spike and Grooming` (ID: 988451845)

### Public sources

- Workstation help: `Create and Edit Reports`
  - https://www2.microstrategy.com/producthelp/Current/workstation/en-us/Content/create_static_reports.htm
- Workstation help: `New Dashboard Editor in Workstation`
  - https://www2.microstrategy.com/producthelp/Current/Workstation/en-us/Content/new_dashboard_editor.htm
- Library help: `Create Reports in Library Web`
  - https://www2.microstrategy.com/producthelp/Current/Library/en-us/Content/create_reports.htm
- Library help: `Report FAQs`
  - https://www2.microstrategy.com/producthelp/Current/Library/en-us/Content/report_faqs.htm
- Embedding SDK docs
  - https://microstrategy.github.io/embedding-sdk-docs/
  - https://microstrategy.github.io/embedding-sdk-docs/embed-report-page/

### Raw evidence files

- Tavily outputs: `context/raw/tavily/`
- Confluence search and page fetch outputs: `context/raw/confluence/`
