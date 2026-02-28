# Playwright Migration: Q&A and Design Decisions

This document answers the key design questions for Phase 0 and the WDIO→Playwright migration, aligned with the Tester Agent design in `workspace-tester/docs/TESTER_AGENT_DESIGN.md` and `playwright-cli` workflows. **playwright-cli for browser interaction; mcp-server-tests-migration MCP for Phase 1 AST conversion.**

---

## Q1: Generated Scripts & playwright-cli Compatibility

**Question:** As long as the generated scripts can be referenced for playwright-cli, that's OK. What is the best solution?

**Use case (from TESTER_AGENT_DESIGN.md):**
- Tester Agent translates test steps into Playwright scripts and saves them to `automation/`
- Healer Agent fixes broken scripts using playwright-cli (snapshot, explore DOM)
- Scripts must be reusable for CI and handoff to Healer

**Answer and recommendation:**

Generated scripts should follow the **same locator style that playwright-cli produces**:
- `page.getByRole('button', { name: 'Submit' })`
- `page.getByText('Category')`
- `page.getByLabel('Email')`

**Why this works:**
1. **Healer workflow:** When a locator fails, Healer runs `playwright-cli open <url>` and `playwright-cli snapshot`. The snapshot shows elements as `e1 [button "Submit"]`, `e2 [textbox "Email"]` — semantically aligned with `getByRole` / `getByText`.
2. **Re-recording:** Healer can re-record the failing step via playwright-cli and get equivalent code to replace the broken line.
3. **Single format:** Both the Tester (writing scripts) and the Healer (fixing via playwright-cli) work with the same locator model.
4. **CI:** Scripts run with `npx playwright test` with no extra tooling.

**Concrete rule:** All generated scripts must use semantic locators (`getByRole`, `getByText`, `getByLabel`, `getByPlaceholder`). Avoid `page.locator('#id')` or raw CSS unless there is no semantic alternative.

---

## Q2: POM vs Healer – Heuristic and Token-Efficient Approach

**Question:** Which approach is best for both heuristic (practical) and token efficiency?

**Options considered:**
- (A) High-level POM – Healer patches only tests with direct locators
- (B) POM that exposes locators – Healer can patch at POM or test level
- (C) Minimal POM – inline locators in tests for easy Healer patching

**Recommendation: POM with co-located locators (Option B, structured)**

| Criterion | Approach | Rationale |
|-----------|----------|-----------|
| **Token efficiency** | POM with co-located locators | Healer loads only the failing test + the POM that owns the broken locator. Stack trace points to the file; no full codebase scan. |
| **Heuristic** | Same | One Page class per logical screen; locators defined at the top; methods use them. Healer can find and replace a single locator property. |
| **Reuse** | Same | Shared flows (login, setup) live in POM methods; avoids duplication. |
| **Healer flow** | Same | On `ReportPage.addRow failed`, Healer loads `ReportPage.ts` and the failing spec, uses playwright-cli to snapshot, updates the locator property, re-runs. |

**Implementation pattern:**

```typescript
// pages/ReportPage.ts
export class ReportPage {
  constructor(private readonly page: Page) {}

  // Locators co-located at top – Healer patches these
  readonly addRowButton = this.page.getByRole('button', { name: 'Add to Rows' });
  readonly rowsPanel = this.page.getByRole('region', { name: 'Rows' });

  async addObjectToRows(name: string) {
    await this.addRowButton.click();
    await this.page.getByRole('option', { name }).click();
  }
}
```

- Locators are explicit and semantic.
- Healer edits only this file when a locator changes.
- Context stays small: failing spec + one POM file.

---

## Q3: Data-Driven Format

**Answer:** Use **JSON** for test data.

- Easily parseable and structure-supporting
- Works well with Playwright `test.extend` and data fixtures
- Simple to version-control and diff
- Fits common CI tools and scripts

**Suggested layout:** `automation/data/<feature>.json` with arrays of scenario objects, e.g. `{ "scenario": "add-category", "rowName": "Category", "expectVisible": true }`.

---

## Q4: Test Plan MD & Specs Flow – Use Case and Suggestions

**Use case (from TESTER_AGENT_DESIGN.md):**
- Planner creates QA test plans with step-by-step cases
- Tester receives those plans and executes them
- Tester **writes** Playwright scripts while testing (Feature Testing Stage)
- Healer fixes scripts when CI fails (Automation Failure scenario)

**Suggestions:**

| Suggestion | Reason |
|------------|--------|
| **1. Keep test plans as Markdown** | Planner writes plans in natural language; MD is readable and easy to maintain. Tester uses these as the primary input. |
| **2. Store plans in `specs/`** | Clear separation: `specs/*.md` = human-readable plans; `automation/**/*.spec.ts` = executable tests. |
| **3. Plans describe steps, not locators** | Plans say e.g. “Click Add to Rows, select Category.” Locators live in code, not in MD. |
| **4. One plan → many tests** | One MD plan can map to several `.spec.ts` files; traceability via plan name and scenario IDs. |
| **5. Healer ignores plans** | Healer works only with failing specs and playwright-cli; plans are not edited by Healer. |

**Directory layout (main entry: library-automation):**

```
workspace-tester/projects/
├── wdio/
│   └── specs/                      # Planner output – test plans (MD)
│       ├── reportUndoRedo.md
│       └── reportEditor.md
└── library-automation/             # Main entry for Playwright scripts
    └── tests/
        ├── specs/                  # Feature specs (reportEditor/reportUndoRedo/, etc.)
        ├── page-objects/           # POM with co-located locators (report/, library/)
        ├── test-data/              # JSON test data
        │   └── reportUndoRedo.json
        └── fixtures/               # Auth, setup
```

**Flow:**
- Planner: `wdio/specs/reportUndoRedo.md`
- Tester: reads MD → writes `library-automation/tests/specs/**/*.spec.ts` → runs `npx playwright test`
- Healer: on failure → playwright-cli snapshot → edits specs or POMs in `library-automation` → re-runs

---

## Q5: Tooling – playwright-cli + MCP for Phase 1

**Answer:** Use **playwright-cli** for browser interaction. Use **mcp-server-tests-migration** MCP for Phase 1 AST conversion.

- **Install:** `npm install -g @playwright/mcp` (provides `playwright-cli`)
- **Tester:** Uses playwright-cli for execution snapshots, exploration, and generated locator patterns
- **Healer:** Uses playwright-cli to open the failing page, snapshot DOM, and derive new semantic locators
- **Phase 1 Migration:** Use `mcp-server-tests-migration` MCP tools for AST conversion. See [PLAYWRIGHT_MIGRATION_PHASE1_EXECUTION.md](./PLAYWRIGHT_MIGRATION_PHASE1_EXECUTION.md).

**Rationale:** playwright-cli is the primary tool for the Tester Agent. MCP is used only for Phase 1 bulk AST conversion; ongoing execution and healing use playwright-cli.

---

## Q6: POM-First Migration – When Specs Depend on Missing POMs

**Question:** What if specs call POM methods or APIs that do not yet exist?

**Rule:** **POM precedes spec migration.** When analysis reveals that specs depend on POMs or APIs not yet in `tests/page-objects/report/` or `tests/page-objects/library/`, create or migrate those POMs first before migrating the specs.

| Step | Action |
|------|--------|
| 1 | From analysis, identify page objects used and methods called by the specs |
| 2 | Create or extend the required POM classes |
| 3 | Only then run `migrate_to_playwright` on the specs |

This ensures all specs can be migrated successfully without waiting on missing POMs/APIs.

---

## Summary: Design Principles for Migration

1. **Semantic locators only** – `getByRole`, `getByText`, etc., aligned with playwright-cli output
2. **POM with co-located locators** – One Page per screen, locators at top, token-efficient for Healer
3. **POM precedes spec migration** – Create required POMs before migrating specs that call them
4. **JSON for data** – Test data in `data/*.json`
5. **MD plans in `specs/`** – Planner writes plans; Tester converts to `.spec.ts`; Healer does not edit plans
6. **playwright-cli for browser** – MCP (mcp-server-tests-migration) for Phase 1 AST conversion only

---

*Document created for Phase 0 of the Playwright migration. Aligned with `TESTER_AGENT_DESIGN.md` and `PLAYWRIGHT_MIGRATION_PLAN.md`.*
