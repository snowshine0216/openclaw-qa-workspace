# Deep Research: Workstation Report Editor — Functionality & Library vs Workstation Gap

_Saved for future reference. Source: MicroStrategy official docs + Jira evidence._

---

## 1. Workstation Report Editor — Current Functionality (as of Strategy One Jan 2026)

### Access & Entry Points
- Open existing report: Workstation window → Navigation pane → Reports → double-click
- Create new report: Navigation pane → click `+` next to Reports → select environment/project
- Create from template (Nov 2025+): select template or click "Blank Report"
- From Jan 2026: drag objects from Workstation window (Projects, Objects, Global Search, Report Editor panels) directly into Report/Filter editor

### Editor Capabilities
- **Objects panel**: search/navigate attributes, metrics, filters; drag to Editor panel row/column drop zones
- **Filter panel**: apply existing filters or create inline report-level filters; view filters distinct from report filters
- **Pause/Resume Data Retrieval**: paused by default for performance; resume to see results
- **Subtotals**: right-click attribute header → Show Totals; customizable by position
- **Undo/Redo** (Apr 2025+): undo/redo report manipulations (excludes Resume/Pause Data Retrieval transitions)
- **Advanced Properties panel** (Jul 7+): VLDB properties, joins, null display, pre/post SQL
- **SQL View**: visible in execution mode (paused); also available when report is running
- **Transformations, consolidations, custom groups** (Update 7+)
- **Themes** (Dec 2025+): apply predefined grid format (Template Style, Color, Banding, Merge Headers, Spacing, Cell formatting)
- **Report Templates** (Nov 2025+): base report on a template
- **Prompts**: supported via filters; prompt answers visible in Report Filters summary
- **Drilling**: configurable via Report Properties
- **Page-by**: Library keeps per-user selections; reset available
- **Export**: PDF and Excel via File menu or Share button
- **Freeform SQL Reports**: create SQL-based reports in Workstation; can run in Library
- **Privilege requirements**: Use Analytics, Use Report Editor, Web create new Report, Modify list of Report objects, Create application objects

### Infrastructure Requirements
- Modeling service must be enabled in Intelligence Server (`modelingservice.featureflag.report.enabled = true`)
- Modeling service must be running before using Report Editor

---

## 2. Library Web Report Editor — Key Capabilities (as of Strategy One)
- Same core authoring: Objects panel, Editor panel (rows/columns), Filter panel, Pause/Resume Data Retrieval
- Advanced Properties panel, SQL view, Transformations, Consolidations, Custom Groups
- Themes (Dec 2025+), Templates (Nov 2025+)
- Prompts, Drilling, Page-by, Subtotals, Undo/Redo
- **Create Report from Cube** (Feb 2026) — Library only, Workstation parity unclear
- Accessibility: full compliance in Library for consumption mode
- Embedding support via Embedding SDK (`embeddingContexts.embedReportPage`)

---

## 3. Workstation vs Library Report Editor — Gap Analysis

| Dimension | Workstation (Legacy Native Editor) | Library Web Report Editor | Gap / Risk for BCIN-7289 |
|-----------|-----------------------------------|--------------------------|--------------------------|
| **Prompt Technology** | Old/legacy code tech; different prompt engine | Modern unified prompt engine | **Critical** — BCIN-7289 core motivation; embedding Library editor resolves this |
| **New Feature Support** | Every new prompt/report feature needs separate WS effort | New features land in Library first | **Critical** — embedding eliminates this duplication |
| **Code Maintenance** | Separate WS-specific codebase; regression risk | Single codebase | Risk: during transition, both editors exist |
| **WebView/iFrame Embedding** | Not yet (this is the feature) | Already used for Dashboard (BCED-2416) | Validated pattern from BCED-2416 |
| **Preference / Feature Flag** | Legacy editor is default; new editor opt-in (BCIN-7603) | N/A | Feature gating is a test axis |
| **Fallback Editor** | BCIN-7603: fallback to legacy if new editor fails | N/A | Fallback path is a test axis |
| **Save Dialog** | Must use Workstation-native save dialog | Library-native save dialog | **Known gap from BCED-2416**: save dialog, certify/template checkboxes, folder refresh |
| **Session Timeout** | Native WS session handling | Library session (separate) | **Known gap from BCED-2416**: login page shown inside editor on timeout |
| **Cancel Execution** | Native WS cancel | Library cancel may redirect to Library home | **Known gap from BCED-2416** |
| **Application Settings** | WS application settings | Library application settings (must NOT apply in WS mode) | **Known gap from BCED-2416** |
| **Toolbar** | WS toolbar (1st layer) + embedded editor toolbar (2nd layer) | Single Library toolbar | UI gap: dual toolbar complexity, extra buttons (BCED-2906 analog) |
| **Export** | WS-native export | Library export | **Known gap from BCED-2416**: export settings regression, PDF crash |
| **OAuth / Data Sources** | WS-native connection handling | Library connection handling inside WebView | **Known gap from BCED-2416**: OAuth failures in server-based mode |
| **Performance** | Native WS rendering | WebView cold start +20s, subsequent +2-4s | Performance regression risk on first open |
| **Create Report from Cube** | Unclear | Feb 2026 Library feature | Potential Library-only capability gap |
| **Offline / Local Mode** | Was supported; deprecated in Q4 2025 | Not applicable | Local mode deprecated; no overlap |
| **Accessibility** | Partial | Full in Library consumption mode | Check authoring mode accessibility |

---

## 4. Embedding Architecture — Workstation Pattern (from BCED-2416)
- Workstation uses **embedded iFrame** to open Library Web editor inside WS window
- Dashboard: when user clicks Create/Edit dashboard → WS opens Library WebView dashboard editor
- Report analog (BCIN-7289): when user clicks Create/Edit report → WS will open Library WebView report editor
- The Workstation "outer shell" handles: native save dialog, close/cancel bridge, session management bridge, fallback to legacy
- The embedded Library editor handles: all report authoring UI, prompts, filters, execution

---

## 5. Key Risk Areas Unique to Report (vs Dashboard BCED-2416)
1. **Report-specific prompt complexity**: reports have more complex prompt structures than dashboards (nested prompts, object prompts, attribute element prompts) — the old WS prompt engine is entirely different
2. **Report Details / Advanced Properties**: mapping from legacy "Report Details" to new Advanced Properties panel must be verified
3. **Freeform SQL Reports**: freeform SQL editing must work inside embedded Library editor
4. **Modeling Service dependency**: Report Editor requires Modeling service to be running — a server-config prerequisite not present for dashboards
5. **Report vs Dashboard save semantics**: report save has different metadata (certify, template, ACL) vs dashboard
