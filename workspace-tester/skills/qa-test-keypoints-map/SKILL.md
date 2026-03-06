---
name: qa-test-keypoints-map
description: Manage interactive Test Key Points visualization and safe markdown round-trip write-back for feature QA plans.
metadata: {"openclaw":{"requires":{"bins":["node"]}}}
---

# QA Test Key Points Map

Use this skill when the task is to visualize or edit `## 🧪 Test Key Points` in:

- `workspace-planner/projects/feature-plan/<feature-id>/qa_plan_final.md`

The implementation is app-first and enforces section-only rewrite plus backup-on-change.

## Project Location

- App root: `workspace-planner/projects/qa-test-keypoints-map`

## Commands

```bash
cd workspace-planner/projects/qa-test-keypoints-map
npm install
npm run dev
```

## Validation / Reporting

```bash
cd workspace-planner/projects/qa-test-keypoints-map
npm run validate -- <feature-id>
npm run report -- <feature-id>
```

## Guardrails

1. Validate `feature-id` with `^[A-Za-z0-9._-]+$`.
2. Restrict file access to `workspace-planner/projects/feature-plan`.
3. Block writes when table schema is malformed or required columns are missing.
4. Rewrite only `## 🧪 Test Key Points`.
5. Create archive backup only when content changed.

## Output Artifacts

For each successful write, capture:

- source path
- backup path (if changed)
- write timestamp
- row count before/after
