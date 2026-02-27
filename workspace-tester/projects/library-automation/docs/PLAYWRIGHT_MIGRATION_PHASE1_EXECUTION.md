# Phase 1: AST-Based Automated Conversion — Execution Plan

This document describes how to execute Phase 1 of the Playwright migration, incorporating constraints and design decisions from [PLAYWRIGHT_MIGRATION_QA.md](./PLAYWRIGHT_MIGRATION_QA.md). It uses **mcp-server-tests-migration** (MCP) for AST conversion and **playwright-cli** for browser interaction and locator validation.

**Main entry for Playwright scripts:** `workspace-tester/projects/library-automation`

---

## 1. Constraints from PLAYWRIGHT_MIGRATION_QA.md

| Constraint | Implication for Phase 1 |
|------------|-------------------------|
| **Semantic locators only** | MCP output must use `getByRole`, `getByText`, `getByLabel`, `getByPlaceholder`. Post-process or manually fix any `page.locator('#id')` or raw CSS. |
| **POM with co-located locators** | `refactor_to_pom` output must place locators at the top of each Page class as readonly properties. |
| **JSON for data** | Extract test data (dossier IDs, project IDs, object names) into `library-automation/tests/test-data/reportUndoRedo.json`. |
| **Output layout** | Migrated specs go to `library-automation/tests/specs/`; POMs go to `library-automation/tests/page-objects/`. |
| **playwright-cli for browser validation** | Use playwright-cli to validate/refine locators for complex interactions (e.g., drag-and-drop) that MCP may not translate perfectly. |

---

## 2. Target Files and Scope

**WDIO source (wdio project):** `workspace-tester/projects/wdio/specs/regression/reportEditor/reportUndoRedo/`

**5 WDIO spec files:**

| # | File | Notes |
|---|------|------|
| 1 | `Report_undoredo_authoringClear.spec.js` | Join/prompt, filter, dnd, undo/redo |
| 2 | `Report_undoredo_authoringEditReport.spec.js` | |
| 3 | `Report_undoredo_authoringNewReport.spec.js` | |
| 4 | `Report_undoredo_consumption.spec.js` | |
| 5 | `Report_undoredo_consumptionClear.spec.js` | |

**Playwright output (library-automation project):**

```
workspace-tester/projects/library-automation/
├── playwright.config.ts              # testDir: './tests'
├── package.json
└── tests/
    ├── specs/                        # Feature specs (mirrors WDIO reportEditor path)
    │   └── reportEditor/
    │       └── reportUndoRedo/
    │           ├── authoringClear.spec.ts
    │           ├── authoringEditReport.spec.ts
    │           ├── authoringNewReport.spec.ts
    │           ├── consumption.spec.ts
    │           └── consumptionClear.spec.ts
    ├── page-objects/                 # POM with co-located locators (Healer-friendly)
    │   ├── report/
    │   │   ├── ReportDatasetPanel.ts
    │   │   ├── ReportEditorPanel.ts
    │   │   ├── ReportToolbar.ts
    │   │   ├── ReportPageBy.ts
    │   │   ├── ReportFilterPanel.ts
    │   │   ├── ReportGridView.ts
    │   │   ├── ReportTOC.ts
    │   │   └── ReportPromptEditor.ts
    │   └── library/
    │       ├── LibraryPage.ts
    │       └── LoginPage.ts
    ├── test-data/                    # JSON test data (data-driven)
    │   └── reportUndoRedo.json
    ├── fixtures/                     # Playwright fixtures (auth, setup)
    │   └── index.ts
    └── example.spec.ts               # Existing placeholder (keep or remove)
```

**Test plans (optional):** `workspace-tester/projects/wdio/specs/reportUndoRedo.md` — Planner output for traceability.

### 2.1 Folder naming (enhanced)

| Folder | Purpose |
|--------|---------|
| `tests/specs/` | Feature specs, mirrors WDIO path (`reportEditor/reportUndoRedo/`) for traceability |
| `tests/page-objects/` | POMs grouped by domain (`report/`, `library/`) — Healer-friendly co-located locators |
| `tests/test-data/` | JSON data for data-driven tests |
| `tests/fixtures/` | Playwright fixtures (auth, setup, teardown) |

---

## 3. Step-by-Step Execution

### Step 3.1: Register Custom Commands (MCP: `register_custom_commands`)

Before migration, register WDIO custom commands with their Playwright equivalents. Use the Migration MCP tool with a JSON mapping.

**Commands to register (from reportUndoRedo specs):**

| WDIO Pattern | Playwright Equivalent | Notes |
|--------------|----------------------|-------|
| `since('...').expect(x).toBe(y)` | `expect(x, 'message').toBe(y)` | Map to Playwright’s message parameter |
| `browser.pause(ms)` | `await page.waitForTimeout(ms)` or `await expect(locator).toBeVisible()` | Prefer semantic waits over fixed timeouts |
| `loginPage.login(reportConstants.undoUser)` | Custom fixture or `LoginPage.login(page, credentials)` | Preserve login flow; use fixtures |
| `reportDatasetPanel.dndFromObjectBrowserToReportFilter('Category')` | `page.dragAndDrop(source, target)` with semantic locators | Requires source/target locators; may need playwright-cli to derive |
| `reportEditorPanel.dndMetricsFromColumnsToRows()` | Same pattern | Complex dnd; validate with playwright-cli |

**Example `register_custom_commands` payload:**

```json
{
  "commands": {
    "since": {
      "method": "expect",
      "description": "Translate since('msg').expect(x).toBe(y) → expect(x, 'msg').toBe(y)"
    },
    "browser.pause": {
      "method": "page.waitForTimeout",
      "description": "Replace with waitForTimeout; prefer expect().toBeVisible() where possible"
    }
  }
}
```

Note: `since` and `browser.pause` may need AST-level handling; the MCP `migrate_to_playwright` tool may already support common patterns. Verify with `compare_frameworks` if unsure.

---

### Step 3.2: Analyze Each WDIO Test (MCP: `analyze_wdio_test`)

For each of the 5 spec files:

1. Read the full file content.
2. Call `analyze_wdio_test` with `testContent` and `filePath`.
3. Save the analysis result for reuse in the next step.

**Extract from analysis:**
- Imports and their Playwright equivalents
- Custom commands (`dndFromObjectBrowserToReportFilter`, `dndMetricsFromColumnsToRows`, etc.)
- POM object bindings (`reportDatasetPanel`, `reportToolbar`, …)
- Assertions (`since(...).expect().toBe()`, `toContain`, `not.toContain`)

---

### Step 3.3: Migrate to Playwright (MCP: `migrate_to_playwright`)

For each spec:

1. Call `migrate_to_playwright` with:
   - `testContent`: full WDIO spec content
   - `analysisResult`: optional JSON from Step 3.2
   - `filePath`: e.g. `workspace-tester/projects/wdio/specs/regression/reportEditor/reportUndoRedo/Report_undoredo_authoringClear.spec.js`
   - `outputFormat`: `"typescript"`

2. Write the output to `library-automation/tests/specs/reportEditor/reportUndoRedo/<name>.spec.ts` (rename per mapping below).

3. Post-process for QA constraints:
   - Replace any `page.locator('#...')` or CSS with semantic locators.
   - Ensure `expect(x, 'msg').toBe(y)` for migrated `since()` assertions.
   - Replace `browser.pause` with `waitForTimeout` or semantic waits where feasible.

**File mapping:**

| WDIO Source | Output (under `library-automation/tests/specs/reportEditor/reportUndoRedo/`) |
|-------------|---------------------------------------------------------------------------|
| `Report_undoredo_authoringClear.spec.js` | `authoringClear.spec.ts` |
| `Report_undoredo_authoringEditReport.spec.js` | `authoringEditReport.spec.ts` |
| `Report_undoredo_authoringNewReport.spec.js` | `authoringNewReport.spec.ts` |
| `Report_undoredo_consumption.spec.js` | `consumption.spec.ts` |
| `Report_undoredo_consumptionClear.spec.js` | `consumptionClear.spec.ts` |

---

### Step 3.4: Refactor to POM (MCP: `refactor_to_pom`)

For each migrated spec from Step 3.3:

1. Call `refactor_to_pom` with:
   - `testContent`: content of the migrated spec
   - `filePath`: e.g. `library-automation/tests/specs/reportEditor/reportUndoRedo/authoringClear.spec.ts`
   - `existingPageObjects`: optional JSON of previously created POMs to reuse

2. Apply POM layout per QA doc:
   - Locators as readonly properties at the top of each Page class.
   - Use semantic locators only.
   - Methods call these locators, e.g. `await this.addRowButton.click()`.

3. If MCP produces inline locators in tests, refactor into Page classes manually so locators are co-located at the top.

**POM structure template (from QA doc):**

```typescript
// library-automation/tests/page-objects/report/ReportDatasetPanel.ts
import type { Page } from '@playwright/test';

export class ReportDatasetPanel {
  constructor(private readonly page: Page) {}

  // Locators co-located at top – Healer patches these
  readonly objectList = this.page.getByRole('list', { name: 'Objects' });
  readonly addToFilterButton = this.page.getByRole('button', { name: 'Add to Filter' });

  async dndFromObjectBrowserToReportFilter(objectName: string) {
    const source = this.objectList.getByText(objectName);
    const target = this.page.getByRole('region', { name: 'Report Filter' });
    await source.dragTo(target);
  }
}
```

---

### Step 3.5: Extract Test Data to JSON

Scan migrated specs for:
- `reportConstants.TC85614JoinOnMetric.id`, `reportConstants.ObjectsPanelTest.id`, etc.
- Project IDs, object names (Category, Subcategory, Freight, Year, …)
- Any scenario-specific values

Create `library-automation/tests/test-data/reportUndoRedo.json`:

```json
{
  "dossiers": {
    "TC85614JoinOnMetric": { "id": "...", "projectId": "..." },
    "ObjectsPanelTest": { "id": "...", "projectId": "..." }
  },
  "scenarios": [
    { "id": "TC97485_20", "dossier": "TC85614JoinOnMetric", "objects": ["Freight", "Customer"] },
    { "id": "TC97485_21", "dossier": "ObjectsPanelTest", "objects": ["Category", "Subcategory"] }
  ]
}
```

Update specs to load from this JSON (e.g. via `test.extend` or `require`).

---

### Step 3.6: playwright-cli Validation for Complex Interactions

For drag-and-drop and other non-trivial interactions:

1. Start the app (or use a static URL if possible).
2. Run `playwright-cli open <baseUrl>`.
3. Navigate to the relevant report/dataset panel.
4. Run `playwright-cli snapshot` to inspect elements.
5. Identify semantic descriptors for source and target (e.g. `[button "Category"]`, `[region "Report Filter"]`).
6. Translate to `getByRole` / `getByText` in the POM.
7. Optionally record the sequence with playwright-cli and copy generated code into the POM method.

**playwright-cli flow for dnd:**

```bash
playwright-cli open https://<env>/MicroStrategyLibrary/
# Login if needed
playwright-cli snapshot
# Find e.g. e5 [listitem "Category"], e12 [region "Report Filter"]
playwright-cli drag e5 e12
# Output: await page.locator(...).dragTo(...)
# Convert to semantic: page.getByRole('listitem', { name: 'Category' }).dragTo(...)
```

Use this to fix or refine `dndFromObjectBrowserToReportFilter`, `dndMetricsFromColumnsToRows`, and similar methods.

---

### Step 3.7: Fixtures and Setup

Migrate `beforeAll`/`afterEach`/`afterAll` to Playwright fixtures:

- **Login:** Use a fixture or `test.beforeEach` that calls `LoginPage.login()`.
- **Window size:** Use `playwright.config.ts` or `page.setViewportSize()`.
- **Teardown:** Map `logoutFromCurrentBrowser` to a fixture or `test.afterAll`.
- **libraryPage.openDefaultApp():** Keep as a `beforeEach` or fixture.

Create `library-automation/tests/fixtures/index.ts` if needed, and import in specs.

---

## 4. Tool Summary

| Step | Tool | Purpose |
|------|------|---------|
| 3.1 | `register_custom_commands` | Map WDIO custom commands to Playwright |
| 3.2 | `analyze_wdio_test` | Extract structure, commands, bindings |
| 3.3 | `migrate_to_playwright` | AST conversion to Playwright syntax |
| 3.4 | `refactor_to_pom` | Extract inline code into Page classes |
| 3.5 | Manual + scripts | Extract data to JSON |
| 3.6 | playwright-cli | Validate and derive locators for dnd etc. |
| 3.7 | Manual | Fixtures and setup |

Optional:
- `compare_frameworks` — Look up Playwright equivalents for specific WDIO patterns.
- `generate_migration_report` — Produce a summary of migrated tests (use after Step 3.4).

---

## 5. Order of Operations

```
1. register_custom_commands (once, with full command map)
2. For each of 5 files:
   a. analyze_wdio_test
   b. migrate_to_playwright
   c. Post-process for semantic locators
3. refactor_to_pom (per file, passing existing POMs for reuse)
4. Manual: ensure POM layout (co-located locators)
5. Extract data to `tests/test-data/reportUndoRedo.json`
6. playwright-cli validation for dnd and complex flows
7. Add fixtures and final cleanup
```

---

## 6. Success Criteria

- [ ] All 5 specs migrated to TypeScript under `library-automation/tests/specs/reportEditor/reportUndoRedo/`.
- [ ] POMs under `library-automation/tests/page-objects/` with locators at the top, semantic only.
- [ ] No `page.locator('#id')` or fragile CSS; only `getByRole`, `getByText`, etc.
- [ ] Test data in `library-automation/tests/test-data/reportUndoRedo.json`.
- [ ] `since()` replaced by `expect(..., 'message')`.
- [ ] `browser.pause` replaced by semantic waits or `waitForTimeout` where necessary.
- [ ] `cd library-automation && npx playwright test tests/specs/reportEditor/reportUndoRedo/` runs (may require env/config).
- [ ] playwright-cli used to validate at least one dnd flow.

---

## 7. References

- [PLAYWRIGHT_MIGRATION_PLAN.md](./PLAYWRIGHT_MIGRATION_PLAN.md) — Overall migration plan
- [PLAYWRIGHT_MIGRATION_QA.md](./PLAYWRIGHT_MIGRATION_QA.md) — Design decisions and constraints
- [TESTER_AGENT_DESIGN.md](../../../docs/TESTER_AGENT_DESIGN.md) — Tester Agent and Healer workflows
- **Main Playwright project:** `workspace-tester/projects/library-automation/`
- playwright-cli skill: `workspace-tester/skills/playwright-cli/SKILL.md`
- MCP: `user-tests-migration` (detect_project_state, analyze_wdio_test, migrate_to_playwright, refactor_to_pom, register_custom_commands, compare_frameworks, generate_migration_report)
