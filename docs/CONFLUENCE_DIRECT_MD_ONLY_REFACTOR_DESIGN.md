# Confluence Direct Markdown Only Refactor Design

Date: 2026-03-05

## 1. Purpose

- **Remove** the `Markdown → HTML(storage) → confluence update` path for full-page publish workflows.
- **Standardize** full-page publishing on direct markdown:
  ```bash
  confluence update <page-id> --file <input.md> --format markdown
  ```
- **Delete** `workspace-planner/scripts/confluence/` (md-to-confluence.js, publish.sh, README, QUICK_REFERENCE).
- **Update** design docs, AGENTS.md, and workflow files to use direct markdown to Confluence.

## 2. Affected Files

| File | Change |
|------|--------|
| `workspace-planner/scripts/confluence/` | **Delete** entire directory |
| `workspace-reporter/scripts/confluence` | **Remove** symlink (points to deleted dir) |
| `workspace-planner/AGENTS.md` | Replace convert-then-publish with direct md publish |
| `workspace-planner/skills/feature-qa-planning-orchestrator/SKILL.md` | Use `--format markdown`; remove md-to-confluence step |
| `workspace-reporter/AGENTS.md` | Replace MD→HTML→publish with direct md publish |
| `workspace-reporter/.agents/workflows/defect-analysis.md` | Use `--format markdown`; remove md-to-confluence step |
| `workspace-planner/docs/workflow-updates-2026-02-25.md` | Update Confluence publish instructions |
| `workspace-planner/projects/feature-plan/docs/DESIGN_ENHANCEMENTS.md` | Update Confluence examples to `--format markdown` |

**QA Summary exception:** `qa-summary.md` does surgical merge (read HTML → replace section → write HTML). It cannot use direct markdown. Handle in a follow-up: either inline a minimal converter in workspace-reporter or redesign the merge flow.

## 3. How to Change

### 3.1 Remove scripts/confluence

1. Delete `workspace-planner/scripts/confluence/` (all files).
2. Remove symlink `workspace-reporter/scripts/confluence` (or the `confluence/` entry under `scripts/`).
3. Update `workspace-reporter/scripts/README.md` — remove the `confluence/` symlink row.

### 3.2 Update `feature-qa-planning-orchestrator`

In `workspace-planner/skills/feature-qa-planning-orchestrator/SKILL.md` Phase 5:

**Before:**
```bash
node ../../../scripts/confluence/md-to-confluence.js qa_plan_final.md qa_plan_confluence.html
confluence update <page-id> --file qa_plan_confluence.html --format storage
```

**After:**
```bash
confluence update <page-id> --file qa_plan_final.md --format markdown
```

Remove the "NEVER publish raw Markdown" warning. Add: "Publish markdown directly with `--format markdown`."

### 3.3 Update defect-analysis workflow

In `workspace-reporter/.agents/workflows/defect-analysis.md` Phase 6:

**Before:**
```bash
node scripts/confluence/md-to-confluence.js ... _REPORT_FINAL.md ... _confluence.html
confluence update <page-id> --file ... _confluence.html --format storage
```

**After:**
```bash
confluence update <page-id> --file projects/defects-analysis/<FEATURE_KEY>/<FEATURE_KEY>_REPORT_FINAL.md --format markdown
```

**Explicit requirement (postmortem full version):**
- If no existing Confluence page is available (missing/invalid page ID), create a new Confluence page and publish the **full postmortem final report** directly from:
  `projects/defects-analysis/<FEATURE_KEY>/<FEATURE_KEY>_REPORT_FINAL.md` with `--format markdown`.

Remove the "NEVER publish raw Markdown" warning.

### 3.4 Update AGENTS.md

- **workspace-planner/AGENTS.md:** Replace "Convert Markdown to Confluence HTML" / "node scripts/confluence/md-to-confluence.js" / "Publish with --format storage" with: "Publish with `confluence update <page-id> --file <input.md> --format markdown`." Remove "Never publish raw Markdown."
- **workspace-reporter/AGENTS.md:** Replace "convert MD→HTML → publish" with "publish via `confluence update ... --file <input.md> --format markdown`."

### 3.5 Update other docs

- `workspace-planner/docs/workflow-updates-2026-02-25.md`: Replace md-to-confluence + storage flow with direct markdown.
- `workspace-planner/projects/feature-plan/docs/DESIGN_ENHANCEMENTS.md`: Change Confluence update example from `--file ... --format storage` to `--file ... --format markdown`.

### 3.6 Verification

1. Publish a test QA plan: `confluence update <sandbox-page-id> --file qa_plan_final.md --format markdown`
2. `confluence read <page-id>` — confirm headings, tables, lists render correctly.
