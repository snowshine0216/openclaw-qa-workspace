# QA Test Key Points Interactive Page

Local-first app for visualizing and editing `## 🧪 Test Key Points` in QA plan finals:

- Plans live under a runs root (set via `QA_PLAN_RUNS_ROOT` or `FQPO_RUNS_ROOT`): `<runs-root>/<feature-id>/qa_plan_final.md`
- The skill root can be anywhere; the runs root is `<skill-root>/runs/` by default

The app reads markdown, renders an XMind-style graph, supports inline editing, and writes only the target section back with backup-on-change.

## Features

- Parse `## 🧪 Test Key Points` subsections and GFM tables
- Enforce required columns:
  - `Priority`
  - `Related Code Change`
  - `Test Key Points`
  - `Expected Results`
- Render graph as:
  - `Feature -> Category -> Check Point -> Expected Result`
- High-contrast directional edges between each relationship
- Edit case fields inline:
  - `Priority`
  - `Related Code Change`
  - `Acceptance Criteria`
  - `Test Key Points`
  - `Expected Results`
- Delete behavior:
  - deleting a case also removes its category when that category becomes empty
- Smart add behavior:
  - no selection/root selected: add top-level category
  - category/case selected: add subtopic in that category
- Move cases across categories
- Manual save via `Save` button only
- Backup only when `Save` is clicked and file content changed
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
   - Expected Result
3. Select a checkpoint/result node to edit its case in the right panel.
4. Use toolbar actions:
   - `Add Category` when nothing/root is selected
   - `Add Subtopic` when category/case is selected
   - `Save` to persist current edits
   - `Delete Case`
   - `Zoom Out`, `Zoom In`, `Fit`
5. Edits remain local until you click `Save`; backup is created only if the saved content changed.

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
- This means E2E tests do not modify real qa-plan orchestrator run folders.
- Covered behaviors:
  - graph hierarchy rendering
  - add-category/add-subtopic behavior
  - auto-remove empty category after deleting its last case
  - manual-save persistence via API

## Safety Rules

- feature id regex validation: `^[A-Za-z0-9._-]+$`
- path traversal guard: file operations restricted to the configured runs root
- optional write guard via env var:
  - `QA_KEYPOINTS_READ_ONLY_FEATURE_IDS=BCIN-6709,OTHER-FEATURE`
- malformed/missing required columns block writes
- rewrite scope restricted to `## 🧪 Test Key Points`
