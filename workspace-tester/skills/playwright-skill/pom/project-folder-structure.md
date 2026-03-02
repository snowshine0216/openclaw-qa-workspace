# Project Folder Structure

> **When to use**: When setting up a new Playwright project or aligning an existing project to the established conventions in this workspace.
> **Prerequisites**: [pom-vs-fixtures-vs-helpers.md](pom-vs-fixtures-vs-helpers.md)

## Quick Reference

The `library-automation` project is the canonical reference for how Playwright test suites are structured in this workspace. All new projects should follow this layout.

## Canonical Layout

```
tests/
├── config/
│   ├── env.ts                      # Typed env config loader — never inline process.env in tests
│   ├── .env.report                 # Local env vars (gitignored)
│   └── .env.report.example         # Committed template for onboarding
│
├── fixtures/
│   └── index.ts                    # SINGLE combined fixture — wires all POMs + re-exports test-data
│                                   # Tests import ONLY from this file, never directly from page-objects/
│
├── page-objects/
│   ├── common/                     # Cross-domain components reused across multiple features
│   │   └── prompt-editor.ts        # e.g. a prompt editor used in both report and dossier flows
│   │
│   ├── library/                    # App shell / navigation layer
│   │   ├── login-page.ts           # Authentication UI
│   │   ├── library-page.ts         # Home page, navigation helpers
│   │   ├── dossier-page.ts         # Dossier consumption view
│   │   └── dossier-creator.ts      # Dossier creation wizard
│   │
│   ├── report/                     # Report editor feature area (largest domain)
│   │   ├── report-toolbar.ts       # Toolbar actions (undo, redo, mode switch)
│   │   ├── report-editor-panel.ts  # Dataset and editor panel
│   │   ├── report-grid-view.ts     # Grid/table component
│   │   ├── report-filter-panel.ts  # Filter sidebar
│   │   └── ...                     # One file per logical component
│   │
│   ├── dossier/                    # Dossier viewer components
│   │   └── bookmark.ts
│   │
│   └── prompt/                     # Prompt dialog components
│       ├── ae-prompt.ts
│       └── value-prompt.ts
│
├── test-data/
│   └── report-editor/              # Organized by feature, not by type
│       ├── report-undo-redo.ts     # Typed exported objects
│       ├── report-creator.ts
│       └── ...
│
└── specs/                          # Spec files mirror the test-data structure
    └── report-editor/
        ├── report-undo-redo/
        │   └── *.spec.ts
        └── report-creator/
            └── *.spec.ts

playwright.config.ts                # Per-suite testMatch projects + shared baseURL
tsconfig.json
package.json
```

## Why Domain-Grouped Page Objects?

**Flat structure (avoid):**
```
page-objects/
├── login-page.ts
├── library-page.ts
├── report-toolbar.ts
├── report-editor-panel.ts
├── report-filter-panel.ts
├── report-grid-view.ts     ← 30+ files at the same level = hard to navigate
├── bookmark.ts
├── ae-prompt.ts
└── ...
```

**Domain-grouped (preferred):**
```
page-objects/
├── common/     ← shared across 2+ domains
├── library/    ← app shell
├── report/     ← feature area (can have 20+ files — that's fine)
├── dossier/    ← another feature area
└── prompt/     ← dialog components
```

Domain grouping gives you:
- Immediate visual scope: "I'm working in the report feature" → look in `report/`
- Predictable import paths: all report POMs start with `../page-objects/report/`
- Easy onboarding: grouping mirrors the app's own navigation structure
- Scale: a flat list becomes unmanageable past ~15 files; domain groups stay readable at 30+

## config/ — Typed Env Loading

Never read `process.env` directly in tests or page objects. Instead:

```typescript
// tests/config/env.ts
import * as path from 'path';
import * as fs from 'fs';
import { config } from 'dotenv';

// Support REPORT_ENV=dev → loads .env.report.dev
const envSuffix = process.env.REPORT_ENV ? `.${process.env.REPORT_ENV}` : '';
const envFile = process.env.ENV_FILE || `.env.report${envSuffix}`;
const envPath = path.resolve(process.cwd(), envFile);
const altPath = path.resolve(process.cwd(), `tests/config/.env.report${envSuffix}`);
// Prefer tests/config/ when root path doesn't exist
const pathToLoad = envFile === `.env.report${envSuffix}` && !fs.existsSync(envPath) && fs.existsSync(altPath)
  ? altPath
  : envPath;
config({ path: pathToLoad });

export interface ReportEnvConfig {
  reportTestUrl: string;
  reportTestUser: string;
  reportTestPassword: string;
  // optional per-suite users
  reportCubePrivUser: string;
  reportSubsetUser: string;
}

export function getReportEnv(): ReportEnvConfig {
  return {
    reportTestUrl: parseBaseUrl(process.env.reportTestUrl || process.env.REPORT_TEST_URL || ''),
    reportTestUser: process.env.reportTestUser || 'tqmsuser',
    reportTestPassword: process.env.reportTestPassword ?? '',
    reportCubePrivUser: process.env.reportCubePrivUser || 're_nic',
    reportSubsetUser: process.env.reportSubsetUser || 're_ss',
  };
}

function parseBaseUrl(url: string): string {
  let u = url;
  if (u.includes('?')) u = u.substring(0, u.indexOf('?'));
  if (u.includes('#')) u = u.substring(0, u.indexOf('#'));
  if (!u.endsWith('/')) u += '/';
  return u;
}
```

Key points:
- The interface documents exactly which env vars are expected
- Fallback defaults prevent crashes in new environments
- `parseBaseUrl` normalises URLs so tests never deal with trailing-slash inconsistencies
- Load order: `ENV_FILE` > `.env.report.{REPORT_ENV}` > `tests/config/.env.report`

## test-data/ — Typed Scenario Data Objects

Test data is **typed exported objects**, not factory functions. Each file covers one test scenario.

```typescript
// tests/test-data/report-editor/report-undo-redo.ts
export const reportUndoRedoData = {
  projectId: 'B628A31F11E7BD953EAE0080EF0583BD',
  dossierId: 'ABC123',
  reportName: 'Undo Redo Test Report',
  steps: [
    { action: 'addMetric', metric: 'Revenue' },
    { action: 'undo' },
  ],
} as const;
```

Then in `fixtures/index.ts`:
```typescript
export { reportUndoRedoData } from '../test-data/report-editor/report-undo-redo';
```

Tests import data the same way they import POMs — **one import line from fixtures**:
```typescript
import { test, expect, reportUndoRedoData } from '../../fixtures';
```

## playwright.config.ts — Per-Suite Projects

The config uses `testMatch` to route test files to named projects. This allows:
- Running a single suite: `npx playwright test --project=report-undo-redo`
- Per-suite timeout overrides (report tests are long-running: 360 seconds)
- Shared `use.baseURL` from env config

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';
import { getReportEnv } from './tests/config/env';

const reportEnv = getReportEnv();

export default defineConfig({
  testDir: './tests',
  timeout: 120000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: reportEnv.reportTestUrl || undefined,  // consumed by all projects
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'report-undo-redo',
      testMatch: /report-editor\/report-undo-redo\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
      timeout: 360000,               // ← per-suite override
    },
    {
      name: 'report-creator',
      testMatch: /report-editor\/report-creator\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
      timeout: 360000,
    },
    // ... one entry per test suite
    {
      name: 'chromium',              // ← catch-all for unmatched specs
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

## Common Mistakes

| Mistake | Fix |
|---|---|
| Reading `process.env` directly in a test | Create a typed getter in `tests/config/env.ts` |
| Importing page objects directly in spec files | Import only from `tests/fixtures/index.ts` |
| One big `page-objects/` flat folder | Group by domain/feature area |
| Hardcoding URLs in `page.goto()` | Use `baseURL` from config + relative paths |
| One project in `playwright.config.ts` for all tests | Add per-suite `testMatch` projects for targeted runs |
| Putting test data inline in specs | Extract to `tests/test-data/<feature>/<scenario>.ts` |
