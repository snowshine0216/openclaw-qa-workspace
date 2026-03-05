# Workflow Documentation Updates - 2026-03-05

## Summary

Refactored Confluence publishing from Markdown->HTML storage conversion to direct markdown publishing.

New standard for full-page updates:

```bash
confluence update <page-id> --file <input.md> --format markdown
```

For reporter postmortem outputs, when no existing page is available, create a new Confluence page from the full postmortem final markdown.

---

## Files Updated

### 1. `.agents/workflows/feature-qa-planning.md`
**Section**: Phase 4 - Publication

**Changes**:
- Removed `md-to-confluence.js` conversion step
- Replaced storage-format publish with direct markdown publish
- Kept publication verification step

**After**:
```bash
confluence update <page-id> --file qa_plan_final.md --format markdown
```

### 2. `AGENTS.md`
**Section**: Core Workflow: Feature QA Planning (Master Orchestrator)

**Changes**:
- Replaced convert-then-publish instructions with direct markdown publishing
- Removed warnings that required HTML storage conversion
- Clarified fallback: create page if no existing Confluence page ID is available

### 3. `workspace-reporter/.agents/workflows/defect-analysis.md`
**Section**: Phase 6 - Publish

**Changes**:
- Replaced MD->HTML->storage flow with direct markdown publish
- Added explicit rule: if no existing target page is available, create a Confluence page with the full postmortem final report markdown

**After**:
```bash
confluence update <page-id> --file projects/defects-analysis/<KEY>/<KEY>_REPORT_FINAL.md --format markdown
```

Fallback:
```bash
confluence create "<KEY> QA Postmortem" <SPACEKEY> --file projects/defects-analysis/<KEY>/<KEY>_REPORT_FINAL.md --format markdown
```

### 4. `workspace-reporter/AGENTS.md`
**Section**: Defect-analysis phase table

**Changes**:
- Replaced convert MD->HTML wording with direct markdown publishing
- Explicitly states full postmortem page creation when no page exists

### 5. `workspace-reporter/scripts/README.md`
**Changes**:
- Removed `confluence/` symlink row (obsolete after converter removal)

### 6. `projects/feature-plan/docs/DESIGN_ENHANCEMENTS.md`
**Changes**:
- Updated Confluence create/update examples from HTML storage to markdown format

---

## Removed Assets

The legacy converter path was removed:

- `workspace-planner/scripts/confluence/` (deleted)
- `workspace-reporter/scripts/confluence` symlink (removed)

---

## Key Principles

1. Author and publish directly in Markdown for full-page workflows.
2. Verify rendered Confluence output after publish.
3. Reporter publish path must explicitly support creating a new page with the full postmortem final report when no page exists.

---

## Validation Checklist

- [ ] Publish a QA plan with `--format markdown`
- [ ] Publish a defect postmortem report with `--format markdown`
- [ ] Validate rendering via `confluence read <page-id>`
- [ ] Confirm no workflow references the removed converter path

---

**Updated by**: QA Planner Agent
**Date**: 2026-03-05
**Status**: Complete
