# QA Test Key Points Interactive Page

Local-first app for visualizing and editing `## 🧪 Test Key Points` in:

- `workspace-planner/projects/feature-plan/<feature-id>/qa_plan_final.md`

The app reads markdown, renders an XMind-style graph, supports inline editing, and writes only the target section back with backup-on-change.

## Features

- Parse `## 🧪 Test Key Points` subsections and GFM tables
- Enforce required columns:
  - `Priority`
  - `Related Code Change`
  - `Test Key Points`
  - `Expected Results`
- Render graph as:
  - `Feature -> Category -> Check Point -> Verified Steps (bullet list) -> Expected Result`
- High-contrast directional edges between each relationship
- Edit case fields inline:
  - `Priority`
  - `Related Code Change`
  - `Acceptance Criteria`
  - `Test Key Points`
  - `Expected Results`
- Smart add behavior:
  - no selection/root selected: add top-level category
  - category/case selected: add subtopic in that category
- Move cases across categories
- Debounced auto-save (no manual save button)
- Backup only when file content changed
- Section-only rewrite (non-target sections preserved)

## Prerequisites

- Node.js `20+`
- npm `9+`
- macOS/Linux shell

## Setup

From repository root:

```bash
cd workspace-planner/projects/qa-test-keypoints-map
npm install
```

Install Playwright browser (one-time per machine):

```bash
npm run test:e2e:install
```

## Run Locally

```bash
npm run dev
```

- Client UI: `http://localhost:5174`
- API server: `http://localhost:4174`

Default loaded feature id: `BCIN-6709`

## How To Use

1. Enter a feature id and click `Load`.
2. Navigate graph from left to right:
   - Feature
   - Category
   - Check Point
   - Verified Steps (bullet list)
   - Expected Result
3. Select a checkpoint/steps/result node to edit its case in the right panel.
4. Use toolbar actions:
   - `Add Category` when nothing/root is selected
   - `Add Subtopic` when category/case is selected
   - `Delete Case`
   - `Zoom Out`, `Zoom In`, `Fit`
5. Edits auto-save after debounce and only backup on real changes.

## Validation and Reporting

```bash
npm run validate -- BCIN-6709
npm run report -- BCIN-6709
```

## Tests

Run static checks:

```bash
npm run typecheck
npm run build
```

Run unit tests:

```bash
npm run test:unit
```

Run E2E Playwright tests:

```bash
npm run test:e2e
```

Run E2E in headed mode:

```bash
npm run test:e2e:headed
```

## E2E Test Notes

- E2E tests run on an isolated fixture workspace under:
  - `tests/e2e/workspace/`
- Playwright starts server with:
  - `WORKSPACE_ROOT=tests/e2e/workspace`
  - `QA_KEYPOINTS_READ_ONLY_FEATURE_IDS=BCIN-6709`
- This means E2E tests do not modify real feature plan folders.
- Covered behaviors:
  - graph hierarchy and verified-step bullet-list rendering
  - add-category/add-subtopic behavior
  - bullet-list steps box
  - auto-save persistence via API

## Safety Rules

- feature id regex validation: `^[A-Za-z0-9._-]+$`
- path traversal guard: file operations restricted to `workspace-planner/projects/feature-plan`
- optional write guard via env var:
  - `QA_KEYPOINTS_READ_ONLY_FEATURE_IDS=BCIN-6709,OTHER-FEATURE`
- malformed/missing required columns block writes
- rewrite scope restricted to `## 🧪 Test Key Points`
