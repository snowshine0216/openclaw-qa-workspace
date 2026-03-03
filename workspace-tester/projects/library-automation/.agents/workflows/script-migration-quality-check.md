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
- `specsBase` — e.g. `tests/specs/reportEditor/`
- `pomBase` — e.g. `tests/page-objects/reportEditor/`
- `specMdBase` — e.g. `specs/reportEditor/`
- `designDoc` — e.g. `docs/PLAYWRIGHT_MIGRATION_REPORTEDITOR_FULL_PLAN.md`
- `envFile` — e.g. `.env.report`
- `envConfigInterface` — e.g. `ReportEnvConfig`
- `npmScriptPrefix` — e.g. `test:report`

Use these resolved values in all steps below (replace `{specsBase}`, `{pomBase}`, etc.).

### 0.3 Framework Profile Preflight (required before generation/healing)

Generate and load framework profile so generator/healer do not drift from project conventions:

```bash
cd workspace-tester/projects/library-automation
npm run preflight:framework-profile
cat .agents/context/framework-profile.json
```

Use the profile values as constraints in later steps:
- `framework.runner`
- `templates.generated_spec_output`
- `generation.fixture_import_path`
- `reuse_contract.rules`

### 0.4 Resolve Phase Feature Name and WDIO Path

Read the family design doc **Section 0 (Migration Progress)** to resolve phase → feature name mapping. Also read `wdioSubfolder` from `script_families.json` for the target phase (`families.<family>.phases.<phase>.wdioSubfolder`).

**WDIO source path** (when WDIO spec exists): `workspace-tester/projects/wdio/specs/regression/<family>/<wdioSubfolder>` (e.g. `report-editor/report-shortcut-metrics/`).

Example for `reportEditor`:

| Phase | Feature |
|-------|---------|
| 2a | reportShortcutMetrics |
| 2b | reportPageBySorting |
| 2c | reportCreator |
| 2d | reportSubset |
| 2e | reportPageBy |
| 2f | reportThreshold |
| 2g | reportTheme |
| 2h | reportScopeFilter |
| 2i | reportFormatting |
| 2j | reportCancel |

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
- [ ] Spec count matches design doc Section 2 file list
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
1. **Env missing** (e.g. "REPORT_ENV not set", "reportTestUrl missing"): Log and skip running; note in report. Do NOT invoke healer.
2. **Tests ran but some failed** (migration artifact, locator, or unknown): Invoke healer loop (max 3 rounds):
   - **Before first healer invocation:** For each failing spec, resolve the corresponding WDIO source file (by name mapping or spec MD `**Migrated from WDIO:**` field). If the WDIO file exists at `workspace-tester/projects/wdio/specs/regression/<family>/<wdioSubfolder>/`, pass `wdioSourcePath` and per-spec mapping to the healer. If it does not exist, pass `wdioSourcePath: null` or omit; healer skips the original-script check.
   - **Round 1–3**: Invoke [playwright-test-healer](../../.claude/agents/playwright-test-healer.md) with: family, phase, spec path `{specsBase}<feature>/`, error output, round number, working dir `workspace-tester/projects/library-automation`, npm command `npm run {npmScriptPrefix}<Feature>`, `wdioSourcePath` (path or null), `specMdPath` `{specMdBase}<feature>/`, `frameworkProfilePath` `.agents/context/framework-profile.json`
   - **Healer constraints (mandatory):** (1) If `wdioSourcePath` is provided and the corresponding WDIO spec file exists, read it and the spec MD before applying any fix; ensure fixes preserve the original test intent and step sequence. If no WDIO spec exists, proceed without this check. (2) Do not remove, skip, or reorder steps without explicit user permission. Do not use `test.fixme()` or similar to skip tests without permission; if a fix would require skipping or altering steps, document the suggestion in the healing report and stop.
   - After each round: re-run `npm run {npmScriptPrefix}<Feature>`. If all pass → stop and update status.
   - If still failing after round N (N=1,2): invoke healer again for round N+1.
   - **Stop after round 3**: Do not invoke healer again. Write healing report (see format below) and update status.
3. **Healing report** (per failed script, 7 fields): (1) Script path, (2) URL used, (3) Step that failed, (4) Why it fails, (5) Fixes applied, (6) Suggestion to next step, (7) Original step alignment. Output: `migration/self-healing/<family>/<phase>/healing_report.md`
4. **Update** `migration/script_families.json` under `families.<family>.phases.<phase>.progress`:
   - `pass`, `fail` from final re-run
   - `self_healed: true` if healer was invoked
   - `healer_rounds`: 1–3 (number of rounds attempted)
   - `healing_report`: path to `migration/self-healing/<family>/<phase>/healing_report.md`
   - `last_run`, `notes`

**Healing report format** (each failed script entry):
| # | Field | Description |
|---|-------|-------------|
| 1 | Script | Path to the failing spec |
| 2 | URL | The URL used to run the test (from env, baseURL, or page.goto) |
| 3 | Step | Which step/test/line failed |
| 4 | Why it fails | Root cause (locator, timeout, assertion, etc.) |
| 5 | Fixes applied | What the healer changed |
| 6 | Suggestion to next step | Recommended follow-up |
| 7 | Original step alignment | If WDIO spec existed: whether healer verified against it; any steps that could not be preserved and require user decision. If no WDIO spec: "N/A (no original)" |

Also update design doc **Section 6.4** (Phase-by-Phase Validation Results).

---

## 3. Dimension 3: Snapshot Strategy

```bash
# 3a. Find all snapshot calls in WDIO source
grep -rn "takeScreenshotByElement" workspace-tester/projects/wdio/specs/regression/<family>/<feature>/

# 3b. Verify none remain in Playwright output
grep -rn "takeScreenshotByElement" {specsBase}<feature>/

# 3c. Check for orphan visual assertions
grep -rn "toHaveScreenshot\|Spectre" {specsBase}<feature>/
```

For each hit in 3a: read the corresponding Playwright spec and verify a semantic assertion (`toBeVisible`, `toHaveText`, etc.) replaces it.

**Check:**
- [ ] 3b returns 0 hits
- [ ] Any `toHaveScreenshot` in 3c has documented justification in design doc Section 10
- [ ] Design doc Section 10 has a row for every replaced snapshot

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

> **Note:** Dimension 2 now invokes the [playwright-test-healer](../../.claude/agents/playwright-test-healer.md) subagent on execution failure (max 3 rounds). Dimension 8 remains for residual WDIO patterns and self-healing log verification. If healer was invoked in Dimension 2, check `self_healed: true` in `script_families.json` and verify no residual WDIO patterns. **Same constraints apply:** re-check original WDIO spec when it exists; do not change or skip original steps without permission.

> **Requires `playwright-cli` skill** for any manual locator updates when 8b has hits.

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
4. If the spec was migrated from WDIO and the original WDIO file exists, re-read it and the spec MD before updating locators to ensure the fix preserves the original step sequence.
5. Update POM method with new locator
6. Repeat 8c until spec passes

**Check:**
- [ ] 8b returns 0 hits after self-healing
- [ ] Self-healing log written to `migration/self-healing/<family>/<phase>/`
- [ ] `script_families.json` has `phases.<phase>.progress.self_healed: true` (if healing was needed)
- [ ] Healer did not change or skip original steps without permission; any such suggestions are documented in the healing report
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
| 2. Execution | ✅ Pass / ⚠️ Partial / ❌ Fail | <pass/fail counts>; if healer invoked: rounds (1–3), outcome (e.g. "healer fixed N specs; M test.fixme()"), link to [healing_report](migration/self-healing/<family>/<phase>/healing_report.md) |
| 3. Snapshot Strategy | ✅ Pass / ❌ Fail | <count replaced> |
| 4. Spec MD | ✅ Pass / ❌ Fail | <missing MDs> |
| 5. Env Handling | ✅ Pass / ❌ Fail | |
| 6. README Index | ✅ Pass / ❌ Fail | |
| 7. Code Quality | ✅ Pass / ❌ Fail | <tsc/eslint errors> |
| 8. Self-Healing | ✅ Pass / N/A / ❌ Fail | <healed count>; if self_healed from Dimension 2, verify no residual WDIO patterns |

## Overall: ✅ Quality-Checked / ❌ Needs Fixes

## Action Items
- [ ] <item 1>
```

**If healer was invoked and stopped after round 3:** Include a "Healing Report Summary" section with path to `migration/self-healing/<family>/<phase>/healing_report.md` and summary of remaining failures (scripts still failing, suggestions to next step).

Then update `migration/script_families.json` under `families.<family>.phases.<phase>.progress`:
```json
{
  "quality_checked": true,
  "quality_report": "migration/quality_report_<family>_<phase>.md",
  "quality_date": "YYYY-MM-DD"
}
```

Present the report summary to the user.
