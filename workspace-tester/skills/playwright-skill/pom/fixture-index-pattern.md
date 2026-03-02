# Combined Fixture Index Pattern

> **When to use**: When wiring page objects, auth state, and test-data exports for a mid-to-large Playwright project.
> **Prerequisites**: [pom-vs-fixtures-vs-helpers.md](pom-vs-fixtures-vs-helpers.md), [project-folder-structure.md](project-folder-structure.md)

## The Pattern in One Sentence

A single `tests/fixtures/index.ts` file that (1) wires every page object as a fixture, (2) defines an `authenticatedPage` root that handles login, and (3) re-exports `expect` and all test-data so spec files have **one import**.

## Why One Fixture Index?

Most guides recommend splitting fixtures into multiple files (`auth.fixture.ts`, `db.fixture.ts`, etc.). That works well for large teams with isolated ownership. For a single-app, single-team project that scales to 30+ page objects, **one index is simpler**:

| Consideration | Multiple files | Single index |
|---|---|---|
| Finding where a fixture lives | Search across files | Always `fixtures/index.ts` |
| Adding a new POM | Create fixture file + re-export | Add 3 lines to one file |
| Import in spec files | Must know which fixture file | Always one import |
| Circular dependency risk | Higher | Lower (all in one graph) |
| Works well when | Large team, distinct feature areas | One app, cohesive team |

## Full Example

### fixtures/index.ts

```typescript
import { test as base } from '@playwright/test';

// Config
import { getReportEnv } from '../config/env';

// Page objects — library layer
import { LoginPage } from '../page-objects/library/login-page';
import { LibraryPage } from '../page-objects/library/library-page';
import { DossierPage } from '../page-objects/library/dossier-page';
import { DossierCreator } from '../page-objects/library/dossier-creator';

// Page objects — report feature
import { ReportToolbar } from '../page-objects/report/report-toolbar';
import { ReportEditorPanel } from '../page-objects/report/report-editor-panel';
import { ReportGridView } from '../page-objects/report/report-grid-view';
import { ReportFilterPanel } from '../page-objects/report/report-filter-panel';
// ... import remaining report POMs

// Page objects — shared components
import { PromptEditor } from '../page-objects/common/prompt-editor';

// Test data
import { reportUndoRedoData } from '../test-data/report-editor/report-undo-redo';
import { reportCreatorData } from '../test-data/report-editor/report-creator';

// ─── Fixture type declaration ───────────────────────────────────────────────
export const test = base.extend<{
  // Root session fixture — all POMs depend on this
  authenticatedPage: import('@playwright/test').Page;

  // Library layer
  loginPage: LoginPage;
  libraryPage: LibraryPage;
  dossierPage: DossierPage;
  dossierCreator: DossierCreator;

  // Report feature
  reportToolbar: ReportToolbar;
  reportEditorPanel: ReportEditorPanel;
  reportGridView: ReportGridView;
  reportFilterPanel: ReportFilterPanel;

  // Shared components
  promptEditor: PromptEditor;
}>({
  // ─── Root: authenticated session ──────────────────────────────────────────
  authenticatedPage: async ({ page }, use) => {
    const env = getReportEnv();
    if (env.reportTestUrl && env.reportTestUser) {
      // 1. Navigate to the app
      await page.goto(env.reportTestUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

      // 2. Fast-fail on infrastructure misconfiguration
      const configError = page.getByText(/Configuration Error|Intelligence Server is not connected/i);
      if (await configError.isVisible().catch(() => false)) {
        throw new Error(
          'App shows "Configuration Error". Configure reportTestUrl in tests/config/.env.report.'
        );
      }

      // 3. Login
      const loginPage = new LoginPage(page);
      await loginPage.login({ username: env.reportTestUser, password: env.reportTestPassword });

      // 4. Wait for app shell to be ready
      await page.waitForURL(/(\\/app|\\/Home|\\/Dashboard)/i, { timeout: 90000, waitUntil: 'commit' });
      await page
        .locator('.mstrd-AppContainer, .library-home, [class*="DossierGallery"]')
        .first()
        .waitFor({ state: 'attached', timeout: 45000 })
        .catch(() => {});
      await page.waitForLoadState('domcontentloaded');
    }
    await use(page);
  },

  // ─── Library layer — all use authenticatedPage, NOT page ─────────────────
  loginPage: async ({ authenticatedPage }, use) => {
    await use(new LoginPage(authenticatedPage));
  },
  libraryPage: async ({ authenticatedPage }, use) => {
    await use(new LibraryPage(authenticatedPage));
  },
  dossierPage: async ({ authenticatedPage }, use) => {
    await use(new DossierPage(authenticatedPage));
  },
  dossierCreator: async ({ authenticatedPage }, use) => {
    await use(new DossierCreator(authenticatedPage));
  },

  // ─── Report feature ───────────────────────────────────────────────────────
  reportToolbar: async ({ authenticatedPage }, use) => {
    await use(new ReportToolbar(authenticatedPage));
  },
  reportEditorPanel: async ({ authenticatedPage }, use) => {
    await use(new ReportEditorPanel(authenticatedPage));
  },
  reportGridView: async ({ authenticatedPage }, use) => {
    await use(new ReportGridView(authenticatedPage));
  },
  reportFilterPanel: async ({ authenticatedPage }, use) => {
    await use(new ReportFilterPanel(authenticatedPage));
  },

  // ─── Shared components ────────────────────────────────────────────────────
  promptEditor: async ({ authenticatedPage }, use) => {
    await use(new PromptEditor(authenticatedPage));
  },
});

// ─── Re-exports ─────────────────────────────────────────────────────────────
// Tests get everything from one import: test, expect, and test-data constants
export { expect } from '@playwright/test';
export { reportUndoRedoData, reportCreatorData };
```

### Spec file — one import

```typescript
// tests/specs/report-editor/report-undo-redo/undo-redo.spec.ts
import { test, expect, reportUndoRedoData } from '../../fixtures';

test.describe('Report Undo/Redo', () => {
  test('undo after adding a metric removes it', async ({ reportToolbar, reportEditorPanel, libraryPage }) => {
    await libraryPage.editReportByUrl({
      dossierId: reportUndoRedoData.dossierId,
      projectId: reportUndoRedoData.projectId,
    });

    await reportEditorPanel.addMetric(reportUndoRedoData.metricName);
    await reportToolbar.clickUndo();

    await expect(reportEditorPanel.metricLocator(reportUndoRedoData.metricName)).not.toBeVisible();
  });
});
```

## The authenticatedPage Cascade

```
base.page (Playwright built-in)
    └── authenticatedPage  ← navigates, logs in, waits for app shell
            ├── loginPage        = new LoginPage(authenticatedPage)
            ├── libraryPage      = new LibraryPage(authenticatedPage)
            ├── reportToolbar    = new ReportToolbar(authenticatedPage)
            ├── reportEditorPanel
            ├── reportGridView
            └── ... all other POMs
```

Every POM shares the **same** browser page instance. They all act on the same tab, the same authenticated session. This is intentional — report tests don't need isolated contexts, they need a shared logged-in state that one test step advances for the next.

> **When NOT to cascade from `authenticatedPage`**: If you need a clean, unauthenticated page (e.g. testing the login page itself), depend on `page` directly. Playwright only instantiates a fixture when a test requests it, so unused fixtures don't run.

## MicroStrategy Library Login Sequence

The `authenticatedPage` fixture codifies several Library-specific nuances:

```typescript
// 1. Navigate with domcontentloaded — MicroStrategy's app bundle is large;
//    'load' or 'networkidle' frequently times out.
await page.goto(env.reportTestUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

// 2. Fast-fail on infra errors before wasting 90s on login.
//    "Configuration Error" means Intelligence Server is not connected — no point retrying.
const configError = page.getByText(/Configuration Error|Intelligence Server is not connected/i);
if (await configError.isVisible().catch(() => false)) {
  throw new Error('Infrastructure not ready');
}

// 3. LoginPage handles LDAP/SAML tab switching and password-optional flows.
await loginPage.login({ username, password });

// 4. waitForURL with 'commit' (not 'load') — the app URL changes before full render.
await page.waitForURL(/(\\/app|\\/Home|\\/Dashboard)/i, { timeout: 90000, waitUntil: 'commit' });

// 5. App Container selector confirms UI is attached (not just URL changed).
await page.locator('.mstrd-AppContainer, .library-home, [class*="DossierGallery"]')
  .first()
  .waitFor({ state: 'attached', timeout: 45000 })
  .catch(() => {});

// 6. Final domcontentloaded to ensure scripts have run.
await page.waitForLoadState('domcontentloaded');
```

## LoginPage Patterns

The `LoginPage` class handles MicroStrategy-specific login complexity:

```typescript
// tests/page-objects/library/login-page.ts
import type { Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  // Use .or() to handle variations across Library versions
  readonly usernameInput = this.page
    .locator('#username')
    .or(this.page.getByLabel(/username|login|user/i));

  readonly passwordInput = this.page.locator(
    'input#password[type="password"], input.form-control[id="password"]'
  );

  readonly loginButton = this.page
    .locator('#loginButton')
    .or(this.page.getByRole('button', { name: /log in|sign in|login/i }));

  /** Wait for login form and dump debug info on timeout */
  async waitForLoginView(timeout = 60000): Promise<void> {
    const container = this.page
      .locator('.credsLoginContainer, #username, #StandardModeLabel, .login-modes-row')
      .first();
    try {
      await container.waitFor({ state: 'visible', timeout });
    } catch (e) {
      // Capture debug artifacts so CI failures are diagnosable
      const fs = require('fs');
      await this.page.screenshot({ path: '/tmp/login_timeout.png' }).catch(() => {});
      const html = await this.page.content().catch(() => '');
      fs.writeFileSync('/tmp/login_timeout.html', html);
      throw e;
    }
  }

  /** Some environments default to LDAP/SAML tab — switch to Standard if present */
  async switchToStandardTabIfNeeded(): Promise<void> {
    const standardTab = this.page.locator('#StandardModeLabel');
    if (await standardTab.isVisible().catch(() => false)) {
      await standardTab.click();
      await this.page.waitForTimeout(500);
    }
  }

  async login(credentials: { username: string; password: string }): Promise<void> {
    await this.waitForLoginView();
    await this.switchToStandardTabIfNeeded();

    const usernameEl = this.usernameInput.first();
    await usernameEl.scrollIntoViewIfNeeded();
    await usernameEl.waitFor({ state: 'visible', timeout: 10000 });
    await usernameEl.fill(credentials.username);

    // Password is optional in some MicroStrategy configurations
    const password = credentials.password ?? '';
    const hasPassword = password !== '' && password.toLowerCase() !== 'none';
    if (hasPassword) {
      const passwordEl = this.passwordInput.first();
      await passwordEl.scrollIntoViewIfNeeded();
      await passwordEl.waitFor({ state: 'visible', timeout: 5000 });
      await passwordEl.fill(password);
    }

    const loginEl = this.loginButton.first();
    await loginEl.scrollIntoViewIfNeeded();
    await loginEl.click({ force: true, noWaitAfter: true });
  }
}
```

## Re-exporting Test Data

Test-data re-exports in `fixtures/index.ts` let spec files get everything from one import:

```typescript
// In fixtures/index.ts
export { reportUndoRedoData } from '../test-data/report-editor/report-undo-redo';
export { reportCreatorData } from '../test-data/report-editor/report-creator';
// ... one line per data file
```

```typescript
// In spec file — single import for test, expect, AND data
import { test, expect, reportUndoRedoData } from '../../fixtures';
```

vs. the two-import alternative (avoid):

```typescript
// ❌ Two imports — more overhead, less discoverable
import { test, expect } from '../../fixtures';
import { reportUndoRedoData } from '../../test-data/report-editor/report-undo-redo';
```

## When to Split the Fixture Index

The single-index pattern works well up to ~50 fixtures. Consider splitting when:

- **Worker-scoped fixtures** needed — auth tokens shared across tests in a worker should be in a separate `auth.fixture.ts` with `scope: 'worker'`
- **Distinct teams** own distinct areas — split by team boundary (e.g. `report.fixture.ts`, `dossier.fixture.ts`)
- **Different base auth** — some tests use admin, others use guest — split into `admin.fixture.ts` and `guest.fixture.ts`

```typescript
// Splitting example: worker-scoped auth token
// fixtures/auth.fixture.ts
export const test = base.extend<{}, { authToken: string }>({
  authToken: [async ({}, use) => {
    const token = await fetchAuthToken();   // called once per worker, not per test
    await use(token);
  }, { scope: 'worker' }],
});
```

Then compose in index:
```typescript
// fixtures/index.ts
import { test as withAuth } from './auth.fixture';
export const test = withAuth.extend<{ /* page objects */ }>({ ... });
```
