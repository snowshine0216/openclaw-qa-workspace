# Library Automation (Playwright)

Playwright-based end-to-end tests for MicroStrategy Library, migrated from WDIO. Includes environment configuration, fixtures, Page Object Model (POM), and integration with self-healing agents and `playwright-cli`.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [How to Run Tests](#how-to-run-tests)
4. [Debugging](#debugging)
5. [Self-Healing & Locator Updates](#self-healing--locator-updates)
6. [Agents & Workflows](#agents--workflows)
7. [playwright-cli Integration](#playwright-cli-integration)
8. [Project Structure](#project-structure)

---

## Prerequisites

- **Node.js** 18+
- **MicroStrategy Library** instance accessible (dev/QA/staging URL)
- **Credentials** for the test user (e.g. `tqmsuser` or `undo`)

---

## Environment Setup

### Step 1: Install Dependencies

```bash
cd workspace-tester/projects/library-automation
npm install
npx playwright install
```

### Step 2: Configure Environment

Configuration is **per-environment** via `.env.report` files. No credentials go in `playwright.config.ts` or code.

#### Where to Put `.env.report`

You can put the env file in **either** of these locations:

| Location | When to use |
|----------|-------------|
| **Project root** `library-automation/.env.report` | Preferred for new setups. Matches `.env.report.example`. |
| **tests/config/** `tests/config/.env.report` | Migration layout. Use if your config already lives here or when co-locating with other test config. |

**Resolution order:** `tests/config/env.ts` first checks the project root. If `.env.report` is missing there but `tests/config/.env.report` exists, it uses the latter. You do **not** need to modify `env.ts` — it handles both paths automatically.

#### What `tests/config/env.ts` Does

| Purpose | Description |
|---------|-------------|
| **Loads** `.env.report` (or `.env.report.{REPORT_ENV}`) | Injects `reportTestUrl`, `reportTestUser`, `reportTestPassword` into `process.env`. |
| **Provides** `getReportEnv()` | Returns `{ reportTestUrl, reportTestUser, reportTestPassword }` plus optional report-creator users (`reportCubePrivUser`, `reportSubsetUser`, `reportTemplateNoExecuteUser`, `reportTemplateUser`). |
| **Parse base URL** | Normalizes URLs (removes fragments, ensures trailing slash). |

**Optional report-creator users:** See [docs/ENV_MANAGEMENT.md](docs/ENV_MANAGEMENT.md) for adding new users and spec usage pattern.

#### Where to Put Future `.env` Files

| File | Location | Notes |
|------|----------|-------|
| `.env.report` | Project root or `tests/config/` | Current supported paths. |
| `.env.report.dev`, `.env.report.qa` | Same directory as `.env.report` | Loaded when `REPORT_ENV=dev` or `REPORT_ENV=qa`. |
| Custom name | Any path | Set `ENV_FILE=path/to/your.env` before running tests. |

All `.env*` files with secrets should be in `.gitignore` — **never commit credentials**.

#### Create and Edit Your Env File

1. Copy the example:

   ```bash
   cp .env.report.example .env.report
   # OR, for migration layout:
   cp .env.report.example tests/config/.env.report
   ```

2. Edit with your values:

   ```
   reportTestUrl=https://your-env.hypernow.microstrategy.com/MicroStrategyLibrary
   reportTestUser=tqmsuser
   reportTestPassword=
   ```

3. **Environment variables** (what they mean):

   | Variable | Required | Description | Example |
   |----------|----------|-------------|---------|
   | `reportTestUrl` | Yes | Base URL for MicroStrategy Library | `https://mci-xxx-dev.../MicroStrategyLibrary` |
   | `reportTestUser` | Yes | Default test user for login | `tqmsuser` |
   | `reportTestPassword` | Yes | Password (shared for all users; empty if SSO) | `` |
   | `reportCubePrivUser` | No | report-creator: createByCubePrivilege | `re_nic` |
   | `reportSubsetUser` | No | report-creator: createByCube | `re_ss` |
   | `reportTemplateNoExecuteUser` | No | report-creator: reportTemplateSecurity | `ret_ne` |
   | `reportTemplateUser` | No | report-creator: reportTemplateSecurity | `re_template` |

   See [docs/ENV_MANAGEMENT.md](docs/ENV_MANAGEMENT.md) for spec usage and adding new users.

### Step 3: Verify

```bash
npm run test:report-undo-redo:list
# or: npx playwright test tests/specs/report-editor/report-undo-redo/ --list
```

If env is correct, tests are listed. If `.env.report` is missing or empty, `baseURL` will be unset and navigation will fail at runtime.

---

## How to Run Tests

### Quick Commands (npm scripts)

| Command | Description |
|---------|-------------|
| `npm run test` | Run all Playwright tests. |
| `npm run test:report-undo-redo` | Run **only** migrated report-undo-redo specs (uses chromium, fastest). |
| `npm run test:report-undo-redo:list` | List report-undo-redo tests (no network, no browser). |
| `npm run test:report-shortcut-metrics` | Run report-shortcut-metrics specs (Phase 2a). |
| `npm run test:report-page-by-sorting` | Run report-page-by-sorting specs (Phase 2b). |
| `npm run test:report-editor:list` | List all report-editor tests. |

```bash
cd workspace-tester/projects/library-automation

# List migrated tests (quick check)
npm run test:report-undo-redo:list
npm run test:report-editor:list

# Run migrated tests (requires MicroStrategy env)
npm run test:report-undo-redo
npm run test:report-shortcut-metrics
```

### Run all report undo/redo specs (all browsers)

```bash
npx playwright test tests/specs/report-editor/report-undo-redo/
```

### Run a specific file

```bash
npx playwright test tests/specs/report-editor/report-undo-redo/authoringClear.spec.ts
```

### Run a specific test (by title)

```bash
npx playwright test -g "Undo/Redo for join and prompt"
```

### Run a specific test case (by tag or TC ID)

Tests use tags like `@tc97485_20`. Use `-g` to run by tag or partial title:

```bash
# By tag (e.g. @tc97485_20)
npx playwright test -g "@tc97485_20"

# By TC ID substring
npx playwright test -g "TC97485_20"

# With project filter (report-undo-redo only)
npx playwright test tests/specs/report-editor/report-undo-redo/ --project=report-undo-redo -g "TC97485_20"
```

### Run with trace enabled (for debugging failures)

Traces capture DOM snapshots, screenshots, and network at each action. Use when investigating locator or timing issues:

```bash
# Trace on every run (generates trace.zip per test)
npx playwright test tests/specs/report-editor/report-undo-redo/ --trace=on

# Trace only on first retry (default in config for retries)
npx playwright test tests/specs/report-editor/report-undo-redo/ --trace=on-first-retry

# Run a single TC with trace
npx playwright test tests/specs/report-editor/report-undo-redo/ -g "TC97485_20" --trace=on
```

After a failure, open the trace:

```bash
npx playwright show-trace test-results/.../trace.zip
```

The CLI prints the exact path when a test fails.

### Use a different environment

```bash
REPORT_ENV=qa npm run test:report-undo-redo
# Loads .env.report.qa from the same directory as .env.report
```

### Run in headed mode (see the browser)

```bash
npx playwright test tests/specs/report-editor/report-undo-redo/ --headed
```

### Run in debug mode (step through)

```bash
npx playwright test tests/specs/report-editor/report-undo-redo/ --debug
```

### Run with UI

```bash
npx playwright test --ui
```

---

## Debugging

### Where to Find Test Reports

| Output | Location | How to View |
|--------|----------|-------------|
| **HTML report** | `playwright-report/` | `npx playwright show-report` (opens last run) |
| **Traces** (on failure) | `test-results/<run>/.../trace.zip` | `npx playwright show-trace test-results/.../trace.zip` |

After a test run, the CLI prints the path. To open the latest HTML report:

```bash
npx playwright show-report
```

### 1. View Trace

To capture traces, run with `--trace=on` (see [Run with trace enabled](#run-with-trace-enabled-for-debugging-failures) above). On failure, Playwright saves a trace. Open it:

```bash
npx playwright show-trace test-results/.../trace.zip
```

### 2. Headed + SlowMo

```bash
npx playwright test --headed --project=chromium --debug
```

### 3. Use `page.pause()`

Insert temporarily in a test:

```ts
await page.pause();
```

### 4. Inspect Locators

If a locator fails, use `playwright-cli` to explore the DOM:

```bash
playwright-cli open https://your-env.../MicroStrategyLibrary
# Login manually if needed
playwright-cli snapshot
# Shows elements as e1 [button "Submit"], e2 [textbox "Email"], etc.
```

### 5. Debug API Calls

`resetReportState` and auth use the Library Server API. Check:

- `reportTestUrl` ends correctly (no double slash)
- Credentials are correct
- Network access to the env

---

## Self-Healing & Locator Updates

When tests fail because the UI changed (e.g. button label, structure), use the **Healer workflow** to update locators.

### POM Layout (Healer-Friendly)

Locators are **co-located at the top** of each Page class:

```typescript
// tests/page-objects/report/ReportToolbar.ts
export class ReportToolbar {
  readonly undoButton = this.page.getByRole('button', { name: /undo/i });
  readonly redoButton = this.page.getByRole('button', { name: /redo/i });
  // ...
}
```

When a locator breaks, the stack trace points to the POM file; Healer loads only that file plus the failing spec.

### Healer Flow

1. **Identify failure** – CI or local run fails on a locator (e.g. `ReportToolbar.undoButton`).
2. **Open the app** – `playwright-cli open <reportTestUrl>`.
3. **Snapshot** – `playwright-cli snapshot` to see current elements.
4. **Map element** – Match the old locator to a new semantic descriptor (e.g. `e5 [button "Undo"]`).
5. **Update POM** – Change the locator in the Page class to the new semantic form (e.g. `getByRole('button', { name: 'Undo' })`).
6. **Re-run** – Confirm the test passes.

### Semantic Locators Only

Use `getByRole`, `getByText`, `getByLabel`, `getByPlaceholder`. Avoid `page.locator('#id')` or raw CSS so Healer can align with `playwright-cli` output.

---

## Agents & Workflows

### Tester Agent (Executor)

- **Role:** Run tests, capture failures, save Playwright scripts.
- **Input:** Test plans or execution commands.
- **Output:** Pass/fail and, on failure, error logs and snapshots.

### Healer Agent

- **Role:** Fix broken scripts when CI fails.
- **Flow:**
  - **Flake/timing** → Add waits.
  - **DOM/locator change** → Update locators in POM (with `playwright-cli`).
  - **Application bug** → Route to Reporter Agent for Jira defect.

### Orchestrator (Main Agent)

Routes tasks between Tester, Healer, Planner, and Reporter. The Tester focuses on execution and script generation; the Healer focuses on locator and timing fixes.

---

## playwright-cli Integration

`playwright-cli` is used for:

- **DOM exploration** – `playwright-cli snapshot` shows elements in a semantic format compatible with our locators.
- **Locator derivation** – Actions produce code like `page.getByRole('button', { name: 'Submit' }).click()`.
- **Re-recording** – Healer can re-record a failing step and replace the broken line.

### Quick Reference

```bash
# Open app and snapshot
playwright-cli open https://your-env.../MicroStrategyLibrary
playwright-cli snapshot

# Interact (generates Playwright code)
playwright-cli click e5
playwright-cli fill e3 "text"
playwright-cli drag e2 e8
```

### Test Generation

Each `playwright-cli` action outputs equivalent Playwright code. Copy this into POM methods or specs when implementing new steps. See `workspace-tester/skills/playwright-cli/SKILL.md` for full commands.

---

## Project Structure

Playwright-flavored layout: `specs/` = Markdown plans; `tests/` = executable specs.

```
library-automation/
├── playwright.config.ts        # Config (baseURL from env)
├── .env.report.example         # Example env file
├── specs/                      # Markdown test plans (Planner output, Generator input)
│   └── report-editor/report-undo-redo/
│       └── *.md               # authoringClear.md, consumption.md, ...
├── tests/
│   ├── seed.spec.ts            # Required for Playwright Planner (fixtures, auth)
│   ├── config/
│   │   └── env.ts              # Load .env.report, getReportEnv()
│   ├── api/
│   │   └── resetReportState.ts
│   ├── fixtures/
│   │   └── index.ts            # Login fixture, POM fixtures
│   ├── page-objects/           # POMs (co-located locators)
│   │   ├── library/            # LoginPage, LibraryPage
│   │   ├── report/             # ReportToolbar, ReportEditorPanel, etc.
│   │   └── common/             # PromptEditor
│   ├── test-data/
│   │   └── reportUndoRedo.ts
│   └── specs/                  # Executable .spec.ts (Generator output)
│       └── report-editor/report-undo-redo/
└── docs/                       # Migration docs (internal)
```

---

## Troubleshooting

| Issue | What to check |
|-------|---------------|
| "baseURL is undefined" | Create `.env.report` (project root or `tests/config/`) from `.env.report.example` and set `reportTestUrl`. |
| Login fails | Verify `reportTestUser` and `reportTestPassword` in `.env.report`. |
| resetReportState fails | Ensure `reportTestUrl` is correct and the env is reachable. |
| Locator timeout | Use `playwright-cli snapshot` to inspect the current DOM and update the POM. |
| Tests pass locally, fail in CI | Set `REPORT_ENV` or `ENV_FILE` in CI to load the correct env file (e.g. `ENV_FILE=tests/config/.env.report`). |
