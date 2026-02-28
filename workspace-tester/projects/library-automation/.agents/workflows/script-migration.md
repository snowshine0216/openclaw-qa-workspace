---
description: Generalized orchestration workflow for Playwright migration. Executes per-phase migration, validation, and script_families.json updates for any script family.
---

# Generalized Script Migration Workflow

Use this workflow to migrate a single phase of specs from WDIO to Playwright for any script family (e.g., `reportEditor`, `customApp`). The agent follows the steps without needing reminders.

**Working directory:** `workspace-tester/projects/library-automation` (relative to repo root).

---

## 0. Preparation (Idempotency)

1. **Accept target `family` and `phase`** from user. If the user provides a WDIO folder path instead of a phase ID, derive `feature` and `wdioSubfolder` from the path.
2. **Input Guard:** Validate that `family` exists in `migration/script_families.json`.
   ```bash
   FAMILY_EXISTS=$(jq -e ".families[\"$FAMILY\"]" migration/script_families.json > /dev/null 2>&1; echo $?)
   [ "$FAMILY_EXISTS" != "0" ] && echo "ERROR: Unknown family '$FAMILY'" && exit 1
   ```
3. **Register Phase (if missing):** If the phase does not yet exist in `script_families.json`, register it before proceeding:
   ```bash
   PHASE_EXISTS=$(jq -e ".families[\"$FAMILY\"].phases[\"$PHASE\"]" migration/script_families.json > /dev/null 2>&1; echo $?)
   if [ "$PHASE_EXISTS" != "0" ]; then
     # Determine next phase ID (e.g. 2p, 2q) or accept from user
     # Count WDIO spec files to set fileCount
     FILE_COUNT=$(ls -1 workspace-tester/projects/wdio/specs/regression/${FAMILY}/${FEATURE}/*.spec.* 2>/dev/null | wc -l | tr -d ' ')
     TMP=$(mktemp)
     jq ".families[\"$FAMILY\"].phases[\"$PHASE\"] = {
       \"feature\": \"$FEATURE\",
       \"wdioSubfolder\": \"${FEATURE}/\",
       \"fileCount\": $FILE_COUNT,
       \"status\": \"in_progress\",
       \"progress\": { \"notes\": \"registered\" },
       \"snapshotMapping\": []
     }" migration/script_families.json > "$TMP" && mv "$TMP" migration/script_families.json
     echo "Registered phase $PHASE ($FEATURE) under $FAMILY"
   fi
   ```
4. **Config Initialization:** Load dynamic paths and properties (`specsBase`, `pomBase`, `specMdBase`, `testDataBase`, `envFile`, `npmScriptPrefix`) and phase details (`feature`, `wdioSubfolder`) from `script_families.json`. All folder paths use kebab-case (e.g. `report-editor`, `report-cancel`).
5. **Determine State:** Read phase `status` and `progress` fields directly from `script_families.json`. Write updates via `migration/scripts/update-phase-progress.sh`.
   - **COMPLETED** (phase status `done`): STOP. Present choices to user.
   - **IN_PROGRESS** (phase has `progress` data): Continue or resume.
   - **FRESH** (`pending`): Set status to `in_progress` and proceed to Phase 1.
6. **Set cwd** to `workspace-tester/projects/library-automation` for all commands.
6. Make sure to define `FAMILY` and `PHASE` variables in your environment for the execution of the command lines.

---

## 1. Per-Phase Execution (Steps 4.1–4.9)

Resolve WDIO spec list from `script_families.json` (`wdioSubfolder` + filesystem scan). 
**WDIO source:** `workspace-tester/projects/wdio/specs/regression/${FAMILY}/${FEATURE}/`

### Step 4.1: Register Custom Commands

- Call MCP `user-tests-migration` tool **`register_custom_commands`** for any new WDIO custom commands in the phase's specs.
- Use `migration/scripts/update-phase-progress.sh $FAMILY $PHASE notes '"register_custom_commands done"'`.

### Step 4.2: Analyze WDIO Tests

For each WDIO spec in the phase:
1. Read full file content.
2. Call MCP **`analyze_wdio_test`** with `testContent` and `filePath`.
3. Save analysis (in memory or temp) for use in 4.4 and 4.5.

### Step 4.3: Create Markdown Test Plans

For each spec:
1. Create `${specMdBase}${FEATURE}/<name>.md`.
2. Extract scenarios, steps, expected outcomes from analysis. Include `**Seed:** \`tests/seed.spec.ts\``.

### Step 4.3a: POM-First Migration (Strictly Required)

**Rule:** When analysis (4.2) reveals that specs depend on POMs or APIs that do not yet exist, **you MUST migrate or create those POMs first** before migrating the specs themselves.
1. POM precedes spec migration — never migrate specs that call POM methods that do not yet exist.

### Step 4.4: Migrate to Playwright

For each spec:
1. Call MCP **`migrate_to_playwright`** with `testContent`, `analysisResult`, `filePath`, and `outputFormat: "typescript"`.
2. Write output to `${specsBase}${FEATURE}/<name>.spec.ts`.
3. **Post-process:** Locators, since(), and pause replacements.

### Step 4.5: Refactor to POM

For each migrated spec:
1. Call MCP **`refactor_to_pom`**. Ensure locators are co-located at top of Page classes.
2. Reuse existing POMs; create new ones only when domain logic is distinct.

### Step 4.6: Extract Test Data

1. Resolve `testDataBase` from `script_families.json` (kebab-case path, e.g. `tests/test-data/report-editor/`).
2. Create or extend `${testDataBase}${FEATURE}.ts` (kebab-case filename, e.g. `report-cancel.ts`).
3. Scan specs for dossier IDs, project IDs, object names. Add to the file.
4. **Rule:** Family folder (testDataBase) MUST be kebab-case. Feature files may be flat (.ts). All folders and .ts/.js files in library-automation MUST use kebab-case.

### Step 4.7: playwright-cli Validation (Complex Flows)

1. Use `playwright-cli open <baseUrl>` and `snapshot` to derive semantic locators for complex flows.

### Step 4.8: Fixtures and Environment Config

1. Add project to `playwright.config.ts` if needed.
2. Extend `tests/fixtures/index.ts` with feature-specific fixtures.
3. **Environment Credentials:** Update config if new credentials are required.

### Step 4.9: Execution & Self-Healing (Per-Spec)

1. **run the test locally**. If failed, **perform self-healing immediately**. Use `playwright-cli`.
2. Use `migration/scripts/update-phase-progress.sh $FAMILY $PHASE pass <num>` and `fail <num>` or `self_healed true`.

### Step 4.10: Snapshot → Assertion Mapping

Update the snapshot mappings directly in `script_families.json` under `phases.${PHASE}.snapshotMapping`. 

---

## 2. Validation (Post Migration)

1. Call MCP **`compare_frameworks`** to surface edge cases.
2. **Run phase suite:**
   ```bash
   npm run ${npmScriptPrefix}${FEATURE}
   ```
   Or `npx playwright test ${specsBase}${FEATURE}/`
3. **Record results** using atomic script:
   ```bash
   ./migration/scripts/update-phase-progress.sh $FAMILY $PHASE last_run '"YYYY-MM-DD"'
   ```

---

## 3. Update script_families.json (Mandatory)

Update `script_families.json` status to `done` and record final progress:
```bash
./migration/scripts/update-phase-progress.sh $FAMILY $PHASE status '"done"'
./migration/scripts/update-phase-progress.sh $FAMILY $PHASE last_run '"YYYY-MM-DD"'
```

> **Optional:** If a family design doc (`${designDoc}`) exists, you may update its progress table and validation results section for human readability, but this is not required.

---

## 4. Completion Checklist

- [ ] Markdown plans created
- [ ] Required POMs created or migrated FIRST
- [ ] Specs migrated
- [ ] Self-healing performed
- [ ] Phase suite run recorded in `script_families.json` progress
- [ ] Phase status set to `done` in `script_families.json`
