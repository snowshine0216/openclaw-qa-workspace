---
name: migration-quality-check
description: |
  End-to-end quality check for WDIO→Playwright script migration.
  Use when user asks to "check migration quality", "audit migrated scripts",
  "validate wdio migration", or "quality check <family> migration".
  Supports any script family (reportEditor, customApp, dashboard) and any
  phase scope (single phase, multi-phase, or all).
---

# Migration Quality Check Skill

## 1. Intent Resolution

Parse the user's request to extract:

| Parameter | Source | Default |
|-----------|--------|---------|
| **family** | Explicit ("reportEditor", "customApp") or inferred from context | `reportEditor` |
| **phase** | Explicit ("2a", "phase 2h") or "all" | `all` |

**Examples:**
- "check migration quality for reportEditor 2a" → `family=reportEditor, phase=2a`
- "audit customApp migration" → `family=customApp, phase=all`
- "validate wdio migration phase 2h and 2i" → `family=reportEditor, phase=2h,2i`
- "quality check migration" → ask user for family, default phase=all

If family is ambiguous, ask: _"Which script family? (reportEditor / customApp / dashboard)"_

## 2. Family Validation

Before proceeding, read `migration/script_families.json` (in `workspace-tester/projects/library-automation/`):

```bash
cat workspace-tester/projects/library-automation/migration/script_families.json
```

- If family `status` is `"planned"` and no specs/design doc exist yet, notify user: _"Family `<family>` is planned but not yet active. No specs to check."_ Stop.
- If family `status` is `"active"`, proceed.

## 3. Invoke Workflow

Invoke the quality check workflow:

**Workflow:** `.agents/workflows/script-migration-quality-check.md`
(relative to `workspace-tester/projects/library-automation/`)

Pass resolved `family` and `phase` to the workflow. Follow the workflow steps exactly (Steps 0–9).

## 4. Return Summary

After the workflow completes, present a concise summary to the user:

```
Quality Check Complete: <family> Phase <phase>

| Dimension | Status |
|-----------|--------|
| 1. Inventory | ✅ / ❌ |
| 2. Execution | ✅ / ⚠️ / ❌ |
| 3. Snapshot | ✅ / ❌ |
| 4. Spec MD | ✅ / ❌ |
| 5. Env | ✅ / ❌ |
| 6. README | ✅ / ❌ |
| 7. Code Quality | ✅ / ❌ |
| 8. Self-Healing | ✅ / N/A / ❌ |

Overall: ✅ Quality-Checked / ❌ Needs Fixes

Report: migration/quality_report_<family>_<phase>.md
```

List any action items that need user attention.
