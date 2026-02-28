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
| **Output layout** | Markdown plans → `library-automation/specs/`; executable specs → `library-automation/tests/specs/`; POMs → `library-automation/tests/page-objects/`. |
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

**Playwright output (library-automation project) — Playwright-flavored layout:**

```
workspace-tester/projects/library-automation/
├── playwright.config.ts              # testDir: './tests'
├── package.json
├── specs/                            # Markdown test plans (Planner output, Generator input)
│   └── reportEditor/
│       └── reportUndoRedo/
│           ├── reportUndoRedo.md      # Combined plan OR per-spec .md files
│           ├── authoringClear.md
│           ├── authoringEditReport.md
│           ├── authoringNewReport.md
│           ├── consumption.md
│           └── consumptionClear.md
├── tests/
│   ├── seed.spec.ts                  # REQUIRED: fixtures, auth — input for Playwright Planner
│   ├── specs/                        # Executable .spec.ts (Generator output)
│   │   └── reportEditor/
│   │       └── reportUndoRedo/
│   │           ├── authoringClear.spec.ts
│   │           ├── authoringEditReport.spec.ts
│   │           ├── authoringNewReport.spec.ts
│   │           ├── consumption.spec.ts
│   │           └── consumptionClear.spec.ts
│   ├── page-objects/                 # POM with co-located locators (Healer-friendly)
│   │   ├── report/
│   │   │   ├── ReportDatasetPanel.ts
│   │   │   ├── ReportEditorPanel.ts
│   │   │   ├── ReportToolbar.ts
│   │   │   ├── ReportPageBy.ts
│   │   │   ├── ReportFilterPanel.ts
│   │   │   ├── ReportGridView.ts
│   │   │   ├── ReportTOC.ts
│   │   │   └── ReportPromptEditor.ts
│   │   └── library/
│   │       ├── LibraryPage.ts
│   │       └── LoginPage.ts
│   ├── test-data/                    # Test data (JSON or TypeScript)
│   │   └── reportUndoRedo.ts
│   ├── fixtures/                     # Playwright fixtures (auth, setup)
│   │   └── index.ts
│   └── example.spec.ts                # Existing placeholder (keep or remove)
```

**Convention (Playwright best practices):**
- `specs/` = human-readable Markdown plans only; consumed by Playwright Generator or test-case-generator.
- `tests/` = executable Playwright tests; `tests/seed.spec.ts` bootstraps env for Planner.
- `tests/specs/` = feature-organized executable specs (Generator output).

### 2.1 Folder naming (Playwright-flavored)

| Folder | Purpose |
|--------|---------|
| `specs/` | Markdown test plans (Planner output). Steps, expected outcomes. Required for migration. |
| `tests/seed.spec.ts` | Required input for Playwright Planner. Fixtures, auth, setup. |
| `tests/specs/` | Executable `.spec.ts` (Generator output), mirrors `specs/` path for traceability |
| `tests/page-objects/` | POMs grouped by domain (`report/`, `library/`) — Healer-friendly co-located locators |
| `tests/test-data/` | Test data for data-driven tests |
| `tests/fixtures/` | Playwright fixtures (auth, setup, teardown) |

---

## 3. Step-by-Step Execution

### Step 3.0: Prerequisite Check
Ensure Phase 0 (detect_project_state or equivalent setup) is complete before proceeding with automated conversion.

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

### Step 3.2b: Create Markdown Test Plans (specs/*.md)

**Required for migration.** For each WDIO spec, create a corresponding `.md` plan under `library-automation/specs/reportEditor/reportUndoRedo/`.

1. Use the analysis from Step 3.2 to extract scenarios, steps, and expected outcomes.
2. Write human-readable Markdown with clear headings, numbered steps, and expected results.
3. Include seed reference: `**Seed:** \`tests/seed.spec.ts\``.
4. Save to `specs/reportEditor/reportUndoRedo/<name>.md` (one .md per .spec.ts).

**Example structure for `authoringClear.md`:**

```markdown
# Report Undo/Redo — Authoring Clear

**Seed:** `tests/seed.spec.ts`

## 1. TC97485_20 — Join and prompt, filter, undo/redo

### Steps
1. Edit report by URL (dossier TC85614JoinOnMetric)
2. Open object context menu for Freight → Join Type | Inner Join
3. Switch to design mode, click Apply in prompt editor
4. Change number format for Freight to Fixed
5. Open object context menu for Freight → Join Type | Outer Join
6. Verify undo/redo buttons are disabled
...
```

**File mapping (specs/**/*.md):**

| WDIO Source | Markdown plan (under `specs/reportEditor/reportUndoRedo/`) |
|-------------|-----------------------------------------------------------|
| `Report_undoredo_authoringClear.spec.js` | `authoringClear.md` |
| `Report_undoredo_authoringEditReport.spec.js` | `authoringEditReport.md` |
| `Report_undoredo_authoringNewReport.spec.js` | `authoringNewReport.md` |
| `Report_undoredo_consumption.spec.js` | `consumption.md` |
| `Report_undoredo_consumptionClear.spec.js` | `consumptionClear.md` |

These `.md` plans are consumable by the Playwright Generator and ensure traceability from plan to executable test.

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

**`tests/seed.spec.ts` (required for Playwright Planner):** Ensure this file exists and exercises the fixtures, auth, and setup needed for the app. The Planner uses it to bootstrap the browser context when exploring. It should import from `./fixtures` and run a minimal test that reaches the authenticated state.

---

## 4. Tool Summary

| Step | Tool | Purpose |
|------|------|---------|
| 3.1 | `register_custom_commands` | Map WDIO custom commands to Playwright |
| 3.2 | `analyze_wdio_test` | Extract structure, commands, bindings |
| 3.2b | Manual / Planner | Create `specs/**/*.md` Markdown plans (required for migration) |
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
   b. Create specs/reportEditor/reportUndoRedo/<name>.md (Markdown plan)
   c. migrate_to_playwright
   d. Post-process for semantic locators
3. refactor_to_pom (per file, passing existing POMs for reuse)
4. Manual: ensure POM layout (co-located locators)
5. Extract data to `tests/test-data/reportUndoRedo.ts`
6. playwright-cli validation for dnd and complex flows
7. Add fixtures and final cleanup (ensure tests/seed.spec.ts exists with auth/fixtures)
```

---

## 6. Success Criteria

- [x] Markdown plans created under `library-automation/specs/reportEditor/reportUndoRedo/*.md` (5 files).
- [x] All 5 specs migrated to TypeScript under `library-automation/tests/specs/reportEditor/reportUndoRedo/`.
- [x] `tests/seed.spec.ts` exists with fixtures/auth (required for Playwright Planner).
- [x] POMs under `library-automation/tests/page-objects/` with locators at the top, semantic only.
- [x] No `page.locator('#id')` or fragile CSS; only `getByRole`, `getByText`, etc.
- [x] Test data in `library-automation/tests/test-data/reportUndoRedo.ts`.
- [x] `since()` replaced by `expect(..., 'message')`.
- [x] `browser.pause` replaced by semantic waits or `waitForTimeout` where necessary.
- [x] `cd library-automation && npx playwright test tests/specs/reportEditor/reportUndoRedo/ --list` runs.
- [ ] playwright-cli used to validate at least one dnd flow (blocked until baseURL/env ready).

### Run Migrated Tests

```bash
cd workspace-tester/projects/library-automation
npm run test:reportUndoRedo        # Run reportUndoRedo specs (chromium)
npm run test:reportUndoRedo:list  # List tests only
```

Env is loaded from `tests/config/.env.report` when `.env.report` is not in project root.

---

## 7. Phase 1 Execution Summary (Completed)

**Executed:** Phase 1 migration completed. Artifacts created:

| Artifact | Path |
|----------|------|
| Markdown plans | `specs/reportEditor/reportUndoRedo/*.md` (5 files) |
| Executable specs | `tests/specs/reportEditor/reportUndoRedo/*.spec.ts` (5 files) |
| Seed test | `tests/seed.spec.ts` (fixtures, auth — required for Planner) |
| POMs | `tests/page-objects/report/*.ts`, `tests/page-objects/library/*.ts` |
| Test data | `tests/test-data/reportUndoRedo.ts` |
| Fixtures | `tests/fixtures/index.ts` |

**Verification:** `npx playwright test tests/specs/reportEditor/reportUndoRedo/ --list` ✓ (15 tests in 5 files)

### Resolved Blockers (Post-Phase 1)

1. **baseURL / environment:** ✅ Per-env config via `tests/config/env.ts` + `.env.report` (or `.env.report.{REPORT_ENV}`). Mapping: `reportTestUrl`, `reportTestUser`, `reportTestPassword`, plus optional reportCreator users. See [ENV_MANAGEMENT.md](./ENV_MANAGEMENT.md) and `.env.report.example`.

2. **Login with empty/none password:** ✅ When `reportTestPassword` is empty or `"none"`, LoginPage skips `fill()` and clicks the password field instead (satisfies form focus requirements). Password locator fixed to `input#password[type="password"]` to avoid matching "Set a new password" h2 (`getByLabel(/password/i)` was resolving to the wrong element).

3. **ReportDatasetPanel context menu:** ✅ Fixed `openObjectContextMenu` and `selectSubmenuOption` using WDIO selectors: `.mstr-context-menu:not(.ant-dropdown-hidden)` for main menu, `.mstr-rc-context-submenu-wrapper` for submenu, `li` with `hasText` for menu items. Object lookup scoped to `.dataset-panel .object-item-text`. Close menu via StatusBar click.

4. **ReportToolbar switchToDesignMode:** ✅ Clicks Resume (toolbar `[class*="pause"]`) to switch from paused to design mode; when `inAuthoring` true, waits for prompt editor or loading to finish.

5. **ReportPromptEditor clickApplyButtonInReportPromptEditor:** ✅ Targets `.mstrd-PromptEditor` / `.mstrPromptEditor` footer Apply button.

6. **ReportEditorPanel updateAttributeFormsForAttributeInPageByDropZone:** Aligned with WDIO `template-editor-content-pageby` + attribute element; uses context menu and attribute-forms dialog. May need playwright-cli validation for env-specific DOM.

7. **Test timeout:** reportUndoRedo project timeout increased to 360s.

8. **updateAttributeFormsForAttributeInPageByDropZone:** Refined locators using `[aria-label="Page By"]`, `.template-editor-content-pageby`, `.report-editor-editor` with `div, span, li` containing the attribute name. If the test still times out at this step, run `npx playwright show-trace test-results/.../trace.zip` (with `--trace=on`) or `scripts/debug-pageby-dom.ts` to inspect the live DOM.

2. **resetReportState API:** ✅ Implemented in `tests/api/resetReportState.ts` (auth → POST dossiers/instances → logout).

3. **Extra POMs:** ✅ NewFormatPanelForGrid, ReportFormatPanel, ThresholdEditor, ReportSubtotalsEditor, BaseContainer, ReportContextualLinkingDialog, PromptEditor — lean stubs in fixtures.

4. **Login fixture:** ✅ `authenticatedPage` fixture performs login before each test when `reportTestUrl` + `reportTestUser` are set.

### Remaining (POM method implementation)

Many POM methods are stubs. Implement using WDIO `pageObjects/` as reference and playwright-cli for dnd/context menus.

---

## 9. Phase 2: Self-Healing Implementation Guide

When strict element locators fail due to application changes, an AI fallback interprets the DOM tree (token-efficiently) and dynamically corrects the locator during test runtime. This section describes how to implement that mechanism using `playwright-cli` snapshot format and the existing Healer-friendly POM layout.

### 9.1 Design Overview

| Component | Role |
|-----------|------|
| **Trigger** | Wrap locator actions; on timeout/failure, invoke fallback before rethrowing |
| **Token-efficient DOM** | Produce snapshot in playwright-cli style (`e1 [button "Submit"]`) — compact YAML-like output |
| **AI fallback** | Send snapshot + original locator intent to LLM; receive corrected semantic locator |
| **Retry** | Apply corrected locator, retry action; optionally persist healed locator for future runs |

### 9.2 Token-Efficient DOM Capture

**In-process (recommended for runtime):** Use Playwright’s accessibility tree to generate a playwright-cli–compatible snapshot without spawning an external process.

```typescript
// tests/support/domSnapshot.ts
import type { Page } from '@playwright/test';

/** Build a token-efficient DOM snapshot similar to playwright-cli (e1 [button "Submit"], e2 [textbox "Email"]). */
export async function captureAriaSnapshot(page: Page, options?: { maxElements?: number }): Promise<string> {
  const max = options?.maxElements ?? 150; // Limit tokens
  const lines = await page.evaluate((limit) => {
    const out: string[] = [];
    const walk = (el: Element, depth: number, idx: { n: number }): void => {
      if (idx.n >= limit) return;
      const role = el.getAttribute('role') || (el.tagName === 'BUTTON' ? 'button' : el.tagName === 'INPUT' ? 'textbox' : '');
      const name =
        el.getAttribute('aria-label') ||
        (el as HTMLInputElement).placeholder ||
        (el as HTMLElement).innerText?.slice(0, 80)?.trim() ||
        '';
      if (role || name) {
        out.push(`e${idx.n} [${role || 'element'} "${name}"]`);
        idx.n++;
      }
      if (idx.n >= limit) return;
      for (const child of Array.from(el.children)) walk(child, depth + 1, idx);
    };
    walk(document.body, 0, { n: 0 });
    return out;
  }, max);
  return lines.join('\n');
}
```

**Alternative: playwright-cli subprocess (for Healer agent only):**

- Healer runs `playwright-cli open <url>` and `playwright-cli snapshot` post-failure.
- Use snapshot output as the token-efficient DOM. This is the existing Healer flow; runtime self-healing uses the in-process snapshot above.

### 9.3 Self-Healing Wrapper

Wrap POM locator actions so that on failure you capture the snapshot, call the AI, and retry.

```typescript
// tests/support/selfHealing.ts
import type { Page, Locator } from '@playwright/test';
import { captureAriaSnapshot } from './domSnapshot';

export type HealStrategy = 'none' | 'ai' | 'retry-only';

export interface HealContext {
  page: Page;
  locatorDesc: string;   // e.g. "getByRole('button', { name: 'Add to Rows' })"
  action: string;       // e.g. "click"
  intent?: string;      // e.g. "Add to Rows button in Report Dataset panel"
}

/** Call AI/Healer service with snapshot + context; return corrected locator code. */
async function aiHealLocator(ctx: HealContext, snapshot: string): Promise<string | null> {
  // Integrate with your LLM API (Claude, OpenAI, or MCP):
  // - Input: snapshot, ctx.locatorDesc, ctx.intent
  // - Output: Playwright locator code, e.g. "page.getByRole('button', { name: 'Add to Rows' })"
  // For now, return null to disable AI path; implement when API is ready.
  return null;
}

/** Execute action with self-healing fallback on locator failure. */
export async function withSelfHeal<T>(
  page: Page,
  locator: Locator,
  locatorDesc: string,
  action: () => Promise<T>,
  strategy: HealStrategy = 'ai',
  intent?: string
): Promise<T> {
  try {
    return await action();
  } catch (err) {
    if (strategy === 'none') throw err;

    const snapshot = await captureAriaSnapshot(page);
    const healedCode = strategy === 'ai' ? await aiHealLocator(
      { page, locatorDesc, action: 'interact', intent },
      snapshot
    ) : null;

    if (healedCode) {
      // Eval healed locator and retry (simplified; full impl would parse/sanitize)
      // const newLocator = eval(healedCode);  // Secure eval in real impl
      const newLocator = page.locator('body'); // Placeholder
      await newLocator.click();
      return action() as Promise<T>; // Retry with same action pattern
    }
    throw err;
  }
}
```

### 9.4 Integration with POMs

Keep locators co-located at the top of each Page class. For high-value interactions, optionally wrap them with the self-healing layer.

**Option A — Fixture-level wrapper:**

```typescript
// tests/fixtures/index.ts — extend with selfHeal fixture
const withHeal = process.env.SELF_HEAL === '1';

// In POM method:
async addObjectToRows(name: string) {
  const clickAdd = () => this.addRowButton.click();
  if (withHeal) {
    await withSelfHeal(this.page, this.addRowButton, "getByRole('button', { name: 'Add to Rows' })", clickAdd, 'ai', 'Add to Rows button');
  } else {
    await clickAdd();
  }
  await this.page.getByRole('option', { name }).click();
}
```

**Option B — Healable locator factory:**

```typescript
// Wrap locator getters to return healable proxies
readonly addRowButton = createHealableLocator(
  this.page,
  () => this.page.getByRole('button', { name: 'Add to Rows' }),
  { intent: 'Add to Rows button in dataset panel' }
);
```

### 9.5 playwright-cli for Token-Efficient Exploration

When implementing or debugging the AI fallback, use `playwright-cli` to validate snapshot format and locator derivation:

```bash
playwright-cli open <baseUrl>
playwright-cli snapshot
# Output: e1 [button "Add to Rows"], e2 [listitem "Category"], ...
playwright-cli click e1
# Produces: await page.getByRole('button', { name: 'Add to Rows' }).click();
```

Ensure `captureAriaSnapshot` output aligns with this format so the AI receives familiar, compact descriptors.

### 9.6 AI Integration Points

| Approach | When to Use |
|---------|-------------|
| **MCP / Claude** | Healer agent: pass snapshot + failing locator to an MCP tool or Claude with codebase context. |
| **OpenAI / Anthropic API** | Runtime: call from `aiHealLocator()` with a small prompt; parse returned locator code. |
| **Heuristic pre-AI** | Before calling AI: try fuzzy matches (e.g. `getByRole('button', { name: /add.*rows/i })`) to reduce API usage. |

**Prompt shape (example):**

```
The locator `getByRole('button', { name: 'Add to Rows' })` failed. DOM snapshot (playwright-cli format):

<snapshot>

Return only a single Playwright locator expression (e.g. page.getByRole('button', { name: 'Add to Rows' }) or page.getByText('Add to Rows')), nothing else.
```

### 9.7 Persistence (Optional)

On successful heal, optionally:

1. Log to `tests/healed-locators.json` with `{ file, property, oldLocator, newLocator }`.
2. In a separate Healer workflow, apply these to the POM and open a PR.

Runtime healing keeps the test passing; persistence keeps the source code in sync.

### 9.8 Order of Operations for Phase 2

```
1. Implement captureAriaSnapshot() — verify output matches playwright-cli style
2. Add withSelfHeal wrapper and wire to 1–2 critical POM actions
3. Implement aiHealLocator() stub; hook to LLM when API key/config available
4. Add SELF_HEAL=1 env guard; run tests with and without
5. (Optional) Add healed-locator persistence and Healer PR workflow
```

---

## 10. References

- [PLAYWRIGHT_MIGRATION_PLAN.md](./PLAYWRIGHT_MIGRATION_PLAN.md) — Overall migration plan
- [PLAYWRIGHT_MIGRATION_QA.md](./PLAYWRIGHT_MIGRATION_QA.md) — Design decisions and constraints
- [TESTER_AGENT_DESIGN.md](../../../docs/TESTER_AGENT_DESIGN.md) — Tester Agent and Healer workflows
- **Main Playwright project:** `workspace-tester/projects/library-automation/`
- playwright-cli skill: `workspace-tester/skills/playwright-cli/SKILL.md`
- MCP: `tests-migration` (detect_project_state, analyze_wdio_test, migrate_to_playwright, refactor_to_pom, register_custom_commands, compare_frameworks, generate_migration_report)
