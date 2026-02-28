---
description: Orchestration workflow for ReportEditor WDIO→Playwright migration. Executes per-phase migration (4.1–4.9), validation, and design doc updates. Use when user asks to migrate reportEditor phase 2c (or "next pending").
---

# ReportEditor Playwright Migration Workflow

Use this workflow to migrate a single phase of reportEditor specs from WDIO to Playwright. The agent follows the steps without needing reminders.

**Design doc reference:** [PLAYWRIGHT_MIGRATION_REPORTEDITOR_FULL_PLAN.md](../../docs/PLAYWRIGHT_MIGRATION_REPORTEDITOR_FULL_PLAN.md)

**Working directory:** `workspace-tester/projects/library-automation` (relative to repo root).

**WDIO source:** `workspace-tester/projects/wdio/specs/regression/reportEditor/`

---

## Phase-to-Feature Mapping

| Phase | Feature | WDIO Subfolder | File Count |
|-------|---------|----------------|------------|
| 2a | reportShortcutMetrics | reportShortcutMetrics/ | 6 |
| 2b | reportPageBySorting | reportPageBySorting/ | 8 |
| 2c | reportCreator | reportCreator/ | 6 |
| 2d | reportSubset | reportSubset/ | 3 |
| 2e | reportPageBy | reportPageBy/ | 3 |
| 2f | reportThreshold | reportThreshold/ | 2 |
| 2g | reportTheme | reportTheme/ | 3 |
| 2h | reportScopeFilter | reportScopeFilter/ | 4 |
| 2i | reportFormatting | reportFormatting/ | 8 |
| 2j | reportCancel | reportCancel/ | 2 |
| 2k | reportSqlView | reportSqlView/ | 5 |
| 2l | mdx | mdx/ | 5 |
| 2m | reportUICheck | reportUICheck/ | 8 |
| 2n | reportFolderBrowsing | reportFolderBrowsing/ | 1 |
| 2o | Root-level / Other | (root) | 16 |

---

## 0. Preparation (Idempotency)

1. **Accept target phase** from user: e.g. `2c`, `2d`, or "next pending" (first phase with status `pending` or `in_progress` in design doc Section 0).
2. **Determine feature name** from Phase-to-Feature Mapping above (e.g. 2c → reportCreator).
3. **Run check_resume** (if `migration/check_resume.sh` exists):
   ```bash
   cd workspace-tester/projects/library-automation && ./migration/check_resume.sh <phase>
   ```
   Parse `REPORT_STATE` and `resume_from` from output.
4. **If no check_resume script:** Read `migration/task.json`. Classify state:
   - **COMPLETED** (phase status `done`): STOP. Present: (A) Use Existing (B) Smart Refresh (C) Full Regenerate. Wait for user choice.
   - **IN_PROGRESS** (phase has `resume_from`): Skip to that step.
   - **FRESH**: Proceed to Phase 1.
5. **Initialize task.json** if starting fresh:
   - Set `current_phase` to target phase.
   - Set `overall_status` to `in_progress`.
   - Add phase entry with `status: in_progress`.
6. **Set cwd** to `workspace-tester/projects/library-automation` for all commands.

---

## 1. Per-Phase Execution (Steps 4.1–4.9)

For the selected phase, resolve WDIO spec list from design doc Section 2 (Target File Inventory). Example for 2c reportCreator:

- `ReportEditor_reportCreator.spec.js`
- `ReportEditor_createByCubePrivilege.spec.js`
- `ReportEditor_templateByExecutionMode.spec.js`
- `ReportEditor_template.spec.js`
- `ReportEditor_createByCube.spec.js`
- `ReportEditor_reportTemplateSecurity.spec.js`

### Step 4.1: Register Custom Commands

- Call MCP `user-tests-migration` tool **`register_custom_commands`** for any new WDIO custom commands in the phase's specs.
- Reference: [PLAYWRIGHT_MIGRATION_PHASE1_EXECUTION.md §3.1](../../docs/PLAYWRIGHT_MIGRATION_PHASE1_EXECUTION.md#step-31-register-custom-commands-mcp-register_custom_commands).
- Update `task.json` `subtask_timestamps` with `{phase}_register: <iso timestamp>`.

### Step 4.2: Analyze WDIO Tests

For each WDIO spec in the phase:

1. Read full file content from `workspace-tester/projects/wdio/specs/regression/reportEditor/<subfolder>/<file>.spec.js`.
2. Call MCP **`analyze_wdio_test`** with `testContent` and `filePath`.
3. Save analysis (in memory or temp) for use in 4.4 and 4.5.

Update `task.json`: `subtask_timestamps.{phase}_analyze: <iso timestamp>`.

### Step 4.3: Create Markdown Test Plans

For each spec:

1. Create `specs/reportEditor/<feature>/<name>.md`.
2. Extract scenarios, steps, expected outcomes from analysis.
3. Include: `**Seed:** \`tests/seed.spec.ts\``.

**File mapping:** `ReportEditor_foo.spec.js` → `foo.md`; `Report_foo.spec.js` → `foo.md`; `ReportPageBy1.spec.js` → `pageBy1.md`.

Update `task.json`: `subtask_timestamps.{phase}_specs: <iso timestamp>`.

### Step 4.3a: POM-First Migration (Strictly Required)

**Rule:** When analysis (4.2) reveals that specs depend on POMs or APIs that do not yet exist in `tests/page-objects/report/` or `tests/page-objects/library/`, **you MUST migrate or create those POMs first** before migrating the specs themselves.

1. From analysis, identify: page objects used (e.g. `ReportPageBy`, `ReportDatasetPanel`), methods called (e.g. `clickContextMenuOption`, `addMultipleObjectsToPageBy`), and shared APIs.
2. Create or extend the required POM classes **before** running `migrate_to_playwright`.
3. **POM precedes spec migration** — never migrate specs that call POM methods that do not yet exist.

Update `task.json`: `subtask_timestamps.{phase}_pom_first: <iso timestamp>`.

### Step 4.4: Migrate to Playwright

For each spec:

1. Call MCP **`migrate_to_playwright`** with:
   - `testContent` (WDIO content)
   - `analysisResult` (from 4.2)
   - `filePath` (original path)
   - `outputFormat: "typescript"`
2. Write output to `tests/specs/reportEditor/<feature>/<name>.spec.ts`.
3. **Post-process:**
   - Replace `page.locator('#...')` with semantic locators (`getByRole`, `getByText`, etc.).
   - Replace `since()` with `expect(..., 'message')`.
   - Replace `browser.pause` with `waitForTimeout` or `expect(locator).toBeVisible()`.

Update `task.json`: `subtask_timestamps.{phase}_migrate: <iso timestamp>`.

### Step 4.5: Refactor to POM

For each migrated spec:

1. Call MCP **`refactor_to_pom`** with:
   - `testContent` (migrated Playwright content)
   - `filePath` (output path)
   - `existingPageObjects` (JSON string of POMs from `tests/page-objects/report/` and `tests/page-objects/library/`)
2. Ensure locators are co-located at top of Page classes.
3. Reuse existing POMs; create new ones only when domain logic is distinct.

Update `task.json`: `subtask_timestamps.{phase}_pom: <iso timestamp>`.

### Step 4.6: Extract Test Data

1. Scan specs for dossier IDs, project IDs, object names.
2. Add to `tests/test-data/<feature>.ts` or extend shared file if applicable.
3. Wire via fixtures or direct import.

Update `task.json`: `subtask_timestamps.{phase}_testdata: <iso timestamp>`.

### Step 4.7: playwright-cli Validation (Complex Flows)

For drag-and-drop, context menus, custom dialogs:

1. Run `playwright-cli open <baseUrl>` (from tests/config).
2. Use `playwright-cli snapshot` to derive semantic locators.
3. Refine POM methods with validated locators.

Update `task.json`: `subtask_timestamps.{phase}_validate: <iso timestamp` (if performed).

### Step 4.8: Fixtures and Environment Config

1. Add project to `playwright.config.ts` if feature has unique timeout/env needs.
2. Extend `tests/fixtures/index.ts` with feature-specific fixtures.
3. Ensure `tests/seed.spec.ts` covers shared auth/setup.
4. **Environment Credentials:** If the spec needs new credentials for the report, you MUST update `tests/config/.env.report`, `tests/config/.env.report.example`, and `tests/config/env.ts` accordingly. Ensure the env files are ONLY put under the `config` folder. Reference [ENV_MANAGEMENT.md](../../docs/ENV_MANAGEMENT.md).

Update `task.json`: `subtask_timestamps.{phase}_fixtures: <iso timestamp>`.

### Step 4.9: Execution & Self-Healing (Per-Spec)

1. For each spec finished migration, **run the test locally**.
2. If the test fails, **perform self-healing immediately** before moving to the next spec. Use `playwright-cli` (or standard tools) to inspect the DOM, update locators, or adjust logic to try your best to make all the migrated tests pass.
3. Mark the test result (pass/fail/skipped) in your tracking once self-healing is exhausted.

Update `task.json`: `subtask_timestamps.{phase}_self_healing: <iso timestamp>`.

### Step 4.10: Snapshot → Assertion Mapping

For each `takeScreenshotByElement` replaced with an assertion:

1. Record in design doc **Section 10 (Appendix)**:
   - Phase
   - WDIO snapshot call
   - Assertion method
   - File path (e.g. `tests/specs/reportEditor/reportCreator/reportCreator.spec.ts:42`)

Update `task.json`: `subtask_timestamps.{phase}_snapshot_mapping: <iso timestamp>`.

---

## 2. Validation (Post Migration)

1. Call MCP **`compare_frameworks`** to surface edge cases. Document and fix gaps.
2. **Run phase suite:**
   ```bash
   cd workspace-tester/projects/library-automation
   npm run test:report<Feature>  # e.g. test:reportCreator, test:reportSubset
   ```
   If no phase-specific script exists, run:
   ```bash
   npx playwright test tests/specs/reportEditor/<feature>/
   ```
3. **Record results** in `migration/task.json`:
   - `phases.<phase>.pass`, `phases.<phase>.fail`
   - `phases.<phase>.last_run`: YYYY-MM-DD

---

## 3. Update Design Doc (Mandatory)

**CRITICAL:** The agent MUST update [PLAYWRIGHT_MIGRATION_REPORTEDITOR_FULL_PLAN.md](../../docs/PLAYWRIGHT_MIGRATION_REPORTEDITOR_FULL_PLAN.md) as follows:

### 3.1 Section 0 (Migration Progress table)

- Update the row for the completed phase:
  - Status: `✅ Done` or `🔄 Migrated, fixes in progress` (if failures remain)
  - Tests: e.g. `6/6` or `4 pass, 2 fail`
  - Last Run: date or `Run: npm run test:reportCreator`

### 3.2 Section 6.4 (Phase-by-Phase Validation Results)

- Add or update the row for the phase:
  - Phase, Suite, Last Run, Pass, Fail, Notes

### 3.3 Section 10 (Appendix: Snapshot → Assertion Mapping)

- Append any new mappings from Step 4.9 in the table format:
  - Phase | WDIO Snapshot | Assertion Method | File Path

### 3.4 Update task.json

- Set `phases.<phase>.status` to `done`.
- Set `overall_status` to `in_progress` (other phases pending) or `completed` (all phases done).
- Set `phases.<phase>.resume_from` to null (remove if present).

---

## 4. Completion Checklist

Before considering the phase complete:

- [ ] Markdown plans created in `specs/reportEditor/<feature>/`
- [ ] Required POMs created or migrated FIRST (POM precedes spec migration)
- [ ] Specs migrated to `tests/specs/reportEditor/<feature>/*.spec.ts`
- [ ] POMs created/updated
- [ ] Test data extracted to `tests/test-data/<feature>.ts`
- [ ] Semantic locators enforced (no `#id` only)
- [ ] Fixtures wired
- [ ] Execution & self-healing performed per-spec to maximize pass rate
- [ ] `npx playwright test tests/specs/reportEditor/<feature>/ --list` succeeds
- [ ] Phase suite run recorded in task.json and design doc
