# How to Fix Stale `feature-qa-planning-orchestrator` References

The skill was renamed from `feature-qa-planning-orchestrator` to `qa-plan-orchestrator`. Many docs still reference the old name. Use this guide to fix them.

## Replacement Rules

| Old | New |
|-----|-----|
| `feature-qa-planning-orchestrator` | `qa-plan-orchestrator` |
| `workspace-planner/skills/feature-qa-planning-orchestrator/` | `workspace-planner/skills/qa-plan-orchestrator/` |
| `skills/feature-qa-planning-orchestrator/` | `skills/qa-plan-orchestrator/` |

## Fix Strategy by Doc Type

### 1. Active / Living Docs — Update In Place

Replace all occurrences. These docs should point to the current skill:

- `workspace-planner/docs/BCIN-6709_QA_PLAN_SKILL_TIGHTENING_REFACTOR_PLAN.md`
- `workspace-planner/docs/qa-plan-fix/QA_PLAN_QUALITY_GATE_DESIGN.md`
- `workspace-planner/docs/qa-plan-fix-v5.md`
- `workspace-planner/docs/QA_PLAN_DEFECT_ANALYSIS_INTEGRATION_DESIGN.md`
- `workspace-planner/docs/QA_PLAN_UNIFIED_WORKFLOW_REDESIGN.md`
- `workspace-planner/docs/TEST_CASE_GENERATION_DESIGN.md`
- `workspace-planner/docs/PROGRESS_TRACKER.md`
- `workspace-planner/docs/WORKFLOW_UPDATE_SUMMARY.md`
- `workspace-planner/docs/QA_PLAN_WORKFLOW_ENHANCEMENT_2026-02-27.md`
- `workspace-planner/docs/bcin-6709-skill-tightening-notes.md`
- `docs/CONFLUENCE_DIRECT_MD_ONLY_REFACTOR_DESIGN.md`
- `docs/review.md`
- `workspace-planner/projects/feature-plan/scripts/check_resume.sh`
- `workspace-healer/docs/DELIVERY_SUMMARY.md`
- `workspace-healer/docs/E2E_TEST_SUMMARY.md`
- `workspace-healer/docs/feature-qa-planning-evolution-plan.md`

**Command (from repo root):**
```bash
rg -l 'feature-qa-planning-orchestrator' --type-add 'md:*.md' -t md
# Then for each file, replace:
#   feature-qa-planning-orchestrator → qa-plan-orchestrator
```

### 2. Historical / Design Docs — Add Superseded Note or Archive

These describe past designs. Options:

- **Option A:** Add a one-line note at the top:  
  `> **Note:** The skill was renamed to `qa-plan-orchestrator`. Paths in this doc are historical.`
- **Option B:** Move to `docs/archive/` and keep content as-is for history.

**Candidates:**
- `workspace-planner/docs/FEATURE_QA_PLANNING_REDESIGN_2026-03-06.md` — design doc; add superseded note
- `workspace-planner/docs/workflow-updates-2026-02-25.md` — historical; add note or archive

### 3. Design Review Artifacts — Leave As-Is

Review reports reference the design artifact path at review time. Do **not** change:

- `projects/agent-design-review/qa-plan-orchestrator-rename-runs-relayout-2026-03-11/`
- `projects/agent-design-review/feature-qa-planning-redesign-2026-03-06/`
- `projects/agent-design-review/openclaw-skill-package-standard-sample-2026-03-08/`

These are historical records; the "Current package" / "Target package" wording reflects the review context.

### 4. Cursor Plans — Update or Regenerate

- `.cursor/plans/simplify_qa_template_and_validation_9addcd07.plan.md` — update paths if the plan is still in use; otherwise leave as historical.

## Bulk Replace (Optional)

From repo root, for non-archived, non-review files:

```bash
# Dry run first
rg 'feature-qa-planning-orchestrator' --files-with-matches

# Replace in specific directories (exclude projects/agent-design-review, .cursor)
find workspace-planner/docs workspace-healer/docs docs -name '*.md' -exec grep -l 'feature-qa-planning-orchestrator' {} \; | \
  xargs -I {} sed -i '' 's/feature-qa-planning-orchestrator/qa-plan-orchestrator/g' {}
```

## Verification

After fixes:

```bash
rg 'feature-qa-planning-orchestrator' --glob '!*.json' --glob '!*design_review*'
# Should return only: design review artifacts, archive docs, or explicitly historical files
```
