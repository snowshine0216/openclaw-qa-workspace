# QA Test Key Points Interactive Page

Local-first SPA for visualizing and editing `## 🧪 Test Key Points` in:

- `workspace-planner/projects/feature-plan/<feature-id>/qa_plan_final.md`

The app reads markdown, maps section/table rows into an interactive graph, supports inline case edits, and writes only the target section back with backup-on-change.

## What It Implements

- Parse `## 🧪 Test Key Points` subsections and GFM tables
- Enforce required columns:
  - `Priority`
  - `Related Code Change`
  - `Test Key Points`
  - `Expected Results`
- Render graph with root, section, and case nodes
- Hide `Related Code Change` by default in case nodes (toggle to view)
- Edit case fields inline (Priority, Related Code Change, Acceptance Criteria, Test Key Points, Expected Results)
- Move cases between sections
- Add/delete cases
- Debounced auto-save (no manual save button)
- Backup only when file content changed
- Section-only markdown rewrite (non-target sections preserved)

## Project Layout

- `src/shared/parser/testKeyPointsParser.ts`
- `src/shared/model/testKeyPointTypes.ts`
- `src/shared/graph/toGraphModel.ts`
- `src/shared/graph/fromGraphEdits.ts`
- `src/shared/markdown/sectionRewriter.ts`
- `src/shared/io/fileRepository.ts`
- `src/shared/validation/testKeyPointSchema.ts`
- `src/server/index.ts`
- `src/client/App.tsx`

## Run

From this folder:

```bash
npm install
npm run dev
```

- Client: `http://localhost:5174`
- API server: `http://localhost:4174`

Default loaded feature: `BCIN-6709`

## Validation & Reporting Scripts

```bash
npm run validate -- BCIN-6709
npm run report -- BCIN-6709
```

## Tests

```bash
npm test
```

Coverage includes:

- parser round-trip and deterministic rewrite checks
- missing-column and malformed-table failures
- repository save behavior (backup on change, no backup on no-op)

## Safety Rules Implemented

- feature id regex validation (`^[A-Za-z0-9._-]+$`)
- path traversal guard against escaping `workspace-planner/projects/feature-plan`
- fail-safe write blocking on malformed/missing required columns
- replace only `## 🧪 Test Key Points` section in markdown
