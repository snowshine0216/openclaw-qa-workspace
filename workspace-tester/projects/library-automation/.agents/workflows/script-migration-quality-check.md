---
description: End-to-end quality check for WDIO→Playwright script migration. Verifies 8 dimensions (inventory, execution, snapshot, spec MD, env, README, code quality, self-healing) for a given script family and phase. Use when user asks to "check migration quality", "audit migration", or "validate phase".
---

# Script Migration Quality Check Workflow

Use this workflow to run a full quality check on one or more migrated phases for a script family.

**Spec reference:** [`docs/SCRIPT_MIGRATION_QUALITY_CHECK_PLAN.md`](../../docs/SCRIPT_MIGRATION_QUALITY_CHECK_PLAN.md)

**Working directory:** `workspace-tester/projects/library-automation` for all commands.

---

## 0. Accept Inputs & Load Config

### 0.1 Accept Inputs

Accept from user or calling skill:
- **family**: `reportEditor` | `customApp` | `dashboard` | `all`
- **phase**: `all` | `2a` | `2b,2h` (comma-separated)

If not provided, ask: _"Which family and phase(s) would you like to quality-check?"_

### 0.2 Load Family Config

Read `migration/script_families.json` and resolve values for the target family:

```bash
cd workspace-tester/projects/library-automation
cat migration/script_families.json
```

Extract for the selected family:
- `specsBase` — e.g. `tests/specs/report-editor/`
- `pomBase` — e.g. `tests/page-objects/report/`
- `specMdBase` — e.g. `specs/report-editor/`
- `testDataBase` — e.g. `tests/test-data/report-editor/`
- `designDoc` — e.g. `docs/PLAYWRIGHT_MIGRATION_REPORTEDITOR_FULL_PLAN.md`
- `envFile` — e.g. `.env.report`
- `envConfigInterface` — e.g. `ReportEnvConfig`
- `npmScriptPrefix` — e.g. `test:report`

Use these resolved values in all steps below (replace `{specsBase}`, `{pomBase}`, etc.).

### 0.3 Resolve Phase Feature Name

Look up the phase directly from `migration/script_families.json` — no need to read the design doc:

```bash
cat migration/script_families.json | python3 -c "
import json, sys
data = json.load(sys.stdin)
phases = data['families']['FAMILY_NAME']['phases']
phase = phases.get('PHASE_ID')
if phase:
    print('feature:', phase['feature'])
    print('wdioSubfolder:', phase['wdioSubfolder'])
    print('fileCount:', phase['fileCount'])
    print('status:', phase['status'])
else:
    print('Phase not found in config')
"
```

For `phase=all`, iterate over all keys in `phases` whose `status` is not `"skipped"`.

**Status values:** `done` | `pending` | `in_progress` | `skipped`

---

## 1. Dimension 1: Phase & Script Inventory

```bash
# 1a. Count Playwright specs for the phase
ls -1 {specsBase}<feature>/*.spec.ts | wc -l

# 1b. Check npm script exists in package.json
grep "{npmScriptPrefix}<Feature>" package.json

# 1c. Detect WDIO-only APIs in POMs
grep -rn '\$(\|browser\.\|waitForDisplayed' {pomBase}/
```

**Check:**
- [ ] Spec count matches `fileCount` in `script_families.json`
- [ ] npm script `{npmScriptPrefix}<Feature>` exists
- [ ] No WDIO-only APIs in POMs (zero hits on 1c)
- [ ] All POMs referenced by specs exist in `{pomBase}/`

---

## 2. Dimension 2: Execution

```bash
# 2a. List tests — no env required (validates imports/config)
npx playwright test {specsBase}<feature>/ --list

# 2b. Run phase suite — requires env to be configured
npm run {npmScriptPrefix}<Feature>
```

**On failure:**
- If error is a **migration artifact** (missing method, wrong locator): fix immediately.
- If error is **env missing**: log and skip running; note in report.
- If error is **app behavior/flakiness**: tag with `test.fixme()` and log `flakiness_reason` in `script_families.json` progress notes.

**Record in `migration/script_families.json`** using the atomic update script:
```bash
./migration/scripts/update-phase-progress.sh $FAMILY $PHASE pass <n>
./migration/scripts/update-phase-progress.sh $FAMILY $PHASE fail <n>
./migration/scripts/update-phase-progress.sh $FAMILY $PHASE last_run '"YYYY-MM-DD"'
```

---

## 3. Dimension 3: Snapshot Strategy

> **Source of truth:** `phases.<phase>.snapshotMapping` in `migration/script_families.json`

```bash
# 3a. Load snapshotMapping and check for unreviewed entries
cat migration/script_families.json | python3 -c "
import json, sys
data = json.load(sys.stdin)
mapping = data['families']['FAMILY_NAME']['phases']['PHASE_ID'].get('snapshotMapping', [])
unreviewed = [e for e in mapping if e.get('assertionAdequate') is None]
inadequate = [e for e in mapping if e.get('assertionAdequate') is False]
screenshot = [e for e in mapping if e.get('strategy') == 'toHaveScreenshot']
print(f'Total mappings: {len(mapping)}')
print(f'Unreviewed (assertionAdequate=null): {len(unreviewed)}')
print(f'Inadequate (assertionAdequate=false): {len(inadequate)}')
print(f'Visual screenshot retained: {len(screenshot)}')
for e in unreviewed:
    print('  REVIEW:', e['wdioCall'], '->', e['assertionMethod'])
"

# 3b. Verify no takeScreenshotByElement remains in Playwright output
grep -rn "takeScreenshotByElement" {specsBase}<feature>/

# 3c. Find unregistered toHaveScreenshot (not tracked in snapshotMapping)
grep -rn "toHaveScreenshot" {specsBase}<feature>/

# 3d. Count WDIO snapshot calls in source to detect unmapped entries
grep -rn "takeScreenshotByElement" workspace-tester/projects/wdio/specs/regression/<family>/<feature>/ | wc -l
```

**For each unreviewed entry (`assertionAdequate: null`) — agent must evaluate:**
1. Read the original `wdioCall` — what was the screenshot verifying? (visual layout? element presence? text content?)
2. Read the `assertionMethod` in the Playwright spec
3. Judge adequacy:
   - **`true`** — assertion captures the same intent (element visible, text correct, state valid) → update JSON
   - **`false`** — assertion is weaker (e.g. `toBeTruthy()` when text content matters; visual layout that can't be expressed semantically) → update JSON, upgrade `strategy` to `"toHaveScreenshot"`, add `justification`, commit a baseline with `playwright-cli screenshot`

**After reviewing all entries:** write updated `assertionAdequate` values back to `migration/script_families.json`.

**For unmapped WDIO snapshots** (Step 3d count > snapshotMapping length): add missing entries with `strategy: "pending"` and `assertionAdequate: null` then review.

**Check:**
- [ ] 3b returns 0 hits
- [ ] 3c hits all exist in `snapshotMapping` with `strategy: "toHaveScreenshot"` + `justification`
- [ ] No `assertionAdequate: null` entries remain after review
- [ ] No `assertionAdequate: false` entries without an associated `toHaveScreenshot` baseline

---


## 4. Dimension 4: Spec MD Comprehensiveness

```bash
# 4a. List specs and check corresponding MDs exist
for spec in {specsBase}<feature>/*.spec.ts; do
  name=$(basename "$spec" .spec.ts)
  md="{specMdBase}<feature>/${name}.md"
  [ -f "$md" ] && echo "✅ $md" || echo "❌ MISSING: $md"
done

# 4b. Check required elements in existing MDs
grep -l "Migrated from WDIO" {specMdBase}<feature>/*.md
grep -l "\*\*Seed:\*\*" {specMdBase}<feature>/*.md
grep -l "TC[0-9]" {specMdBase}<feature>/*.md
```

**Agent must also read** each `.md` to confirm scenarios have enumerated steps (not just headings).

**Check:**
- [ ] Every `.spec.ts` has a corresponding `.md`
- [ ] Each `.md` has `**Seed:**`, `Migrated from WDIO:`, and TC-numbered scenarios with steps

---

## 5. Dimension 5: Env Handling

```bash
# 5a. Check env interface in env.ts
grep -n "{envConfigInterface}" tests/config/env.ts

# 5b. Check example file
cat tests/config/{envFile}.example

# 5c. Check gitignore
grep "{envFile}" .gitignore

# 5d. Check fallback pattern in specs
grep -rn "|| testData\." {specsBase}<feature>/
```

**Check:**
- [ ] `{envConfigInterface}` found in `env.ts`
- [ ] `{envFile}.example` exists and documents all keys
- [ ] `{envFile}` is in `.gitignore`
- [ ] Specs use `envKey || testData.x` fallback pattern

---

## 6. Dimension 6: README Index

```bash
# 6a. Root README has run commands for this phase
grep -n "{npmScriptPrefix}" README.md

# 6b. Feature-level README exists
ls -la {specMdBase}README.md

# 6c. Docs index references this plan
grep -n "SCRIPT_MIGRATION_QUALITY_CHECK_PLAN" docs/README.md 2>/dev/null || echo "⚠️ Not indexed in docs/README.md"
```

**Agent must also read** `{specMdBase}README.md` to verify it has: Page Objects table, Test Suite Scopes table, How to Run commands, and ENV link.

**Check:**
- [ ] Root README has `{npmScriptPrefix}<Feature>` command
- [ ] `{specMdBase}README.md` exists with all required sections
- [ ] `docs/README.md` references this plan

---

## 7. Dimension 7: Code Quality

```bash
# 7a. TypeScript compilation
npx tsc --noEmit

# 7b. ESLint
npx eslint {specsBase}<feature>/ {pomBase}/

# 7c. WDIO-only APIs in specs and POMs
grep -rn '\$(\|browser\.\|waitForDisplayed\|waitForExist' {specsBase}<feature>/ {pomBase}/
```

**Check:**
- [ ] `tsc --noEmit` exits with code 0
- [ ] ESLint exits with code 0
- [ ] 7c returns 0 hits

---

## 8. Dimension 8: Self-Healing

> **Requires `playwright-cli` skill** for any locator updates.

```bash
# 8a. Check self-healing log
ls -la migration/self-healing/<family>/<phase>/ 2>/dev/null || echo "No self-healing log"

# 8b. Look for residual WDIO locator patterns
grep -rn "\$('css=\|xpath=\|waitForDisplayed" {specsBase}<feature>/

# 8c. Re-run after healing
npx playwright test {specsBase}<feature>/<name>.spec.ts
```

**If 8b has hits:** Activate the `playwright-cli` skill:
1. `playwright-cli open <appUrl>`
2. `playwright-cli goto <target page URL>`
3. `playwright-cli snapshot` — derive semantic locator
4. Update POM method with new locator
5. Repeat 8c until spec passes

**Check:**
- [ ] 8b returns 0 hits after self-healing
- [ ] Self-healing log written to `migration/self-healing/<family>/<phase>/`
- [ ] `script_families.json` has `progress.self_healed: true` (if healing was needed)
- [ ] Spec passes after healing

---

## 9. Write Quality Report

Write report to `migration/quality_report_<family>_<phase>.md`:

```markdown
# Quality Report: <Family> Phase <Phase>

**Date:** YYYY-MM-DD
**Family:** <family>
**Phase:** <phase>
**Feature:** <featureName>

## Summary

| Dimension | Status | Notes |
|-----------|--------|-------|
| 1. Phase & Script Inventory | ✅ Pass / ❌ Fail | |
| 2. Execution | ✅ Pass / ⚠️ Partial / ❌ Fail | <pass/fail counts> |
| 3. Snapshot Strategy | ✅ Pass / ❌ Fail | <count replaced> |
| 4. Spec MD | ✅ Pass / ❌ Fail | <missing MDs> |
| 5. Env Handling | ✅ Pass / ❌ Fail | |
| 6. README Index | ✅ Pass / ❌ Fail | |
| 7. Code Quality | ✅ Pass / ❌ Fail | <tsc/eslint errors> |
| 8. Self-Healing | ✅ Pass / N/A / ❌ Fail | <healed count> |

## Overall: ✅ Quality-Checked / ❌ Needs Fixes

## Action Items
- [ ] <item 1>
```

Then update `migration/script_families.json`:
```bash
./migration/scripts/update-phase-progress.sh $FAMILY $PHASE quality_checked true
./migration/scripts/update-phase-progress.sh $FAMILY $PHASE quality_report '"migration/quality_report_<family>_<phase>.md"'
./migration/scripts/update-phase-progress.sh $FAMILY $PHASE quality_date '"YYYY-MM-DD"'
```

Present the report summary to the user.
