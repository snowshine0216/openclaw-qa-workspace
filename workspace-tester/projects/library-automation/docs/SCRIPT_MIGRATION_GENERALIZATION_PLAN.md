# Refactoring Plan: Generalize Playwright Migration Workflow

## Goal Description
The objective is to generalize the reportEditor-specific migration workflow (`playwright-reporteditor-migration.md`) into a unified `script-migration.md` workflow. This workflow will handle any script family (`reportEditor`, `customApp`, `dashboard`, etc.) by dynamically loading properties from `migration/script_families.json`. Furthermore, all state tracking and progress metrics previously stored in `task.json` are now consolidated into `script_families.json`, establishing it as the absolute single source of truth.

> [!NOTE]
> **Data migration completed (2026-02-28):** All `task.json` progress data (`pass`, `fail`, `notes`, `self_healed`, `last_run`) has been merged into the `progress` field of each phase in `script_families.json`. `task.json` can be safely deleted.

---

## Proposed Changes

---

### Workflows Layer
#### [NEW] `.agents/workflows/script-migration.md`
- **Inputs:** Requires `[family]` and `[phase]` as explicit parameters.
- **Input Guard (new):** At startup, validate that `[family]` exists in `script_families.json` and that `[phase]` exists under that family. On failure, print a descriptive error and exit non-zero before making any changes.
  ```bash
  FAMILY_EXISTS=$(jq -e ".families[\"$FAMILY\"]" migration/script_families.json > /dev/null 2>&1; echo $?)
  PHASE_EXISTS=$(jq -e ".families[\"$FAMILY\"].phases[\"$PHASE\"]" migration/script_families.json > /dev/null 2>&1; echo $?)
  [ "$FAMILY_EXISTS" != "0" ] && echo "ERROR: Unknown family '$FAMILY'" && exit 1
  [ "$PHASE_EXISTS" != "0" ] && echo "ERROR: Unknown phase '$PHASE' under family '$FAMILY'" && exit 1
  ```
- **Config Initialization:** Load dynamic paths and properties (`specsBase`, `pomBase`, `envFile`, etc.) from `script_families.json` at startup.
- **Remove Hardcoding:** The existing "Phase-to-Feature Mapping" table will be deleted. The workflow will rely entirely on the `phases` object in the JSON config.
- **Idempotency & State Tracking:** Read phase `status` and `progress` fields directly from `script_families.json`. Write updates via the atomic update script below.

#### [DELETE] `.agents/workflows/playwright-reporteditor-migration.md`
- Removed in favor of the generalized `script-migration.md` workflow.

#### [DELETE] `.agents/workflows/playwright-customapp-migration.md` (confirm existence before deleting)
- Removed in favor of the generalized `script-migration.md` workflow.

---

### Configuration Layer
#### [MODIFY] `migration/script_families.json`
- **Status:** ✅ Schema expanded. Each phase now includes a `progress` object with `pass`, `fail`, `notes`, `self_healed`, `self_healed_at`, `quality_checked`, and `last_run`.
- **Atomic JSON update mechanism:** Use the following pattern to safely write progress updates. Always write to a `.tmp` file and `mv` atomically to prevent corruption mid-write.
  ```bash
  # update-phase-progress.sh <family> <phase> <field> <value>
  FAMILY=$1 PHASE=$2 FIELD=$3 VALUE=$4
  TMP=$(mktemp)
  jq ".families[\"$FAMILY\"].phases[\"$PHASE\"].progress.$FIELD = $VALUE" \
    migration/script_families.json > "$TMP" && mv "$TMP" migration/script_families.json
  ```
  Store this script at `migration/scripts/update-phase-progress.sh`.
- **Expected phase schema:**
  ```json
  "2d": {
    "feature": "reportSubset",
    "wdioSubfolder": "reportSubset/",
    "fileCount": 3,
    "status": "in_progress",
    "progress": {
      "last_run": "2026-02-28",
      "pass": 1,
      "fail": 0,
      "self_healed": false,
      "quality_checked": false,
      "notes": "replaceCube migrated, BCIN-6422_01 run, 9 skipped"
    },
    "snapshotMapping": []
  }
  ```

#### [DELETE] `migration/task.json`
- All data has been migrated to `script_families.json`. This file is now obsolete.

---

### Documentation Layer
#### [MODIFY] `docs/SCRIPT_MIGRATION_QUALITY_CHECK_PLAN.md`
- Remove all references to `task.json`.
- Update sections 3.3, 9.2, 10.2, and 12 to instruct agents to write quality results (`pass`, `fail`, `flakiness_reason`, `quality_checked`) into the appropriate family/phase `progress` node in `migration/script_families.json` using `update-phase-progress.sh`.

---

### Skills Layer
#### [MODIFY] `skills/migration-quality-check/SKILL.md` (and other related skills)
- Eliminate all references to `task.json`.
- Direct agents to use the generalized `.agents/workflows/script-migration.md` for any migration execution intent.
- For progress writes, reference `migration/scripts/update-phase-progress.sh`.

---

## Verification Plan

### Automated Tests
- Validate `script_families.json` syntax: `jq . migration/script_families.json`
- Dry-run the input guard against a valid phase (`reportEditor/2k`) and an invalid one (`fakefamily/99`) to confirm correct exit behavior.
- Run `update-phase-progress.sh` against a pending phase and verify JSON integrity afterward.

### Manual Verification
- Execute a dry-run of `script-migration.md` against `reportEditor/2k` (next pending phase) to confirm paths like `{specsBase}<feature>` resolve accurately from the config.
- Verify that `task.json` is deleted and no remaining workflow/skill references point to it.
