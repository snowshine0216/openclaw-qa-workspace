# Script Migration Quality Check Plan

This document defines how to verify the quality of WDIO→Playwright script migration for **any script family** (ReportEditor, CustomApp, Dashboard, etc.). It serves as the **specification** consumed by the quality-check workflow and skill — agents should run the workflow or invoke the skill rather than following this plan directly.

**Related docs:**
- [PLAYWRIGHT_MIGRATION_PLAN.md](./PLAYWRIGHT_MIGRATION_PLAN.md) — Overall migration strategy
- [migration/script_families.json](../migration/script_families.json) — Script Families Registry (machine-readable)

---

## 0. How to Use This Plan (Agent Entry Points)

> **Do NOT follow this plan step-by-step as an agent.** Instead, use one of the automation entry points below. This plan is the spec; the workflow and skill are the executors.

### 0.1 Trigger Conditions — When to Run a Quality Check

Run a quality check in any of these situations:

| Trigger | Scope |
|---------|-------|
| A migration phase is marked `done` in the family workflow | Single phase, single family |
| User asks to "check migration quality", "audit migrated scripts", or "validate migration" | Family + phase from user intent |
| A phase suite fails on CI after previously passing | Single phase, single family |
| Before merging a migration PR | All phases in PR scope |
| When onboarding a new script family (`status: planned → active`) | All phases, new family |

### 0.2 Workflow Entry Point (Preferred)

```
/script-migration-quality-check
```

Workflow file: [.agents/workflows/script-migration-quality-check.md](../.agents/workflows/script-migration-quality-check.md)

Accepts:
- `family`: `reportEditor` | `customApp` | `dashboard` | `all`
- `phase`: `all` | `2a` | `2a,2h,2i` (comma-separated for multi-phase)

### 0.3 Skill Entry Point (Intent-Triggered)

Invoke the **`migration-quality-check`** skill when the user uses natural language like:

> "check migration quality for reportEditor 2a", "audit customApp migration", "validate wdio migration phase 2h"

Skill file: [`workspace-tester/skills/migration-quality-check/SKILL.md`](../../../skills/migration-quality-check/SKILL.md)

### 0.4 Deliverables Produced

For each quality check run, the workflow/skill produces:

| Artifact | Path | Description |
|----------|------|-------------|
| Quality Report | `migration/quality_report_<family>_<phase>.md` | Pass/fail per dimension, per phase |
| Updated progress | `migration/script_families.json` | Phase results, self-healing flags |

---

## 1. Scope: What Gets Checked

For each migrated phase within a script family, the quality check verifies:

| # | Dimension | What to Verify |
|---|-----------|----------------|
| 1 | **Phase & Script Inventory** | Correct phase mapping; all WDIO specs have corresponding Playwright specs |
| 2 | **Execution** | All specs run successfully (pass, or fail with clear actionable message) |
| 3 | **Snapshot Strategy** | WDIO `takeScreenshotByElement` replaced with assertions; documented in Appendix |
| 4 | **Spec MD Comprehensiveness** | Each spec has a `.md` plan with scenarios, steps, seed reference |
| 5 | **Env Handling** | Credentials in family-specific env file; `env.ts` extended; `ENV_MANAGEMENT.md` updated |
| 6 | **README Index** | README(s) index all related docs, suites, env vars, run commands |
| 7 | **Code Quality** | TypeScript compiles; ESLint passes; no WDIO-only APIs in POMs or specs |
| 8 | **Self-Healing** | Self-healing applied to first-run failures; updated selectors committed |

---

## 1.5 Script Family Configuration

A **Script Family** is a migration target (e.g. `reportEditor`, `customApp`, `dashboard`). Each family has its own configuration in [`migration/script_families.json`](../migration/script_families.json). The same 8 dimensions apply; only paths, env, and doc references vary.

### 1.5.1 Configuration Schema

| Config Key | Description | Example (reportEditor) |
|------------|-------------|------------------------|
| **specsBase** | Playwright specs directory | `tests/specs/reportEditor/` |
| **pomBase** | Page Object Model directory | `tests/page-objects/reportEditor/` |
| **specMdBase** | Spec MD plans directory | `specs/reportEditor/` |
| **designDoc** | Family design doc path | `docs/PLAYWRIGHT_MIGRATION_REPORTEDITOR_FULL_PLAN.md` |
| **envFile** | Env file name | `.env.report` |
| **envConfigInterface** | Env config in `env.ts` | `ReportEnvConfig` |
| **npmScriptPrefix** | Prefix for npm test scripts | `test:report` |
| **workflow** | Migration workflow path | `.agents/workflows/script-migration.md` |
| **phases** | Phase-to-feature map (see below) | `{ "2a": { "feature": "...", ... } }` |

#### phases schema (per entry)

| Key | Description | Example |
|-----|-------------|---------|
| **feature** | Playwright feature folder name | `reportShortcutMetrics` |
| **wdioSubfolder** | WDIO source subfolder | `reportShortcutMetrics/` |
| **fileCount** | Expected WDIO spec count | `6` |
| **status** | Phase status | `done` \| `in_progress` \| `pending` \| `skipped` |
| **snapshotMapping** | Array of WDIO snapshot → Playwright records | `[]` (empty if no snapshots) |

#### snapshotMapping entry schema

| Key | Values | Description |
|-----|--------|-------------|
| `wdioCall` | string | Original WDIO `takeScreenshotByElement(...)` call |
| `file` | string | Playwright spec file path |
| `strategy` | `"assertion"` \| `"toHaveScreenshot"` \| `"pending"` | How the snapshot was replaced |
| `assertionMethod` | string | The Playwright assertion used |
| `assertionAdequate` | `true` \| `false` \| `null` | Review result — `null` means unreviewed |
| `justification` | string \| null | Required when `assertionAdequate: false` or `strategy: "toHaveScreenshot"` |

### 1.5.2 Script Families Registry (Resolved Values)

**Source of truth:** [migration/script_families.json](../migration/script_families.json) — always load this file before executing any dimension. Phase → feature lookups are a direct JSON key access; no design doc reading required.

| Family | specsBase | specMdBase | pomBase | envFile | npmScriptPrefix | Status |
|--------|-----------|------------|---------|---------|-----------------|--------|
| **reportEditor** | `tests/specs/reportEditor/` | `specs/reportEditor/` | `tests/page-objects/reportEditor/` | `.env.report` | `test:report` | Active |
| **customApp** | `tests/specs/customApp/` | `specs/customApp/` | `tests/page-objects/customApp/` | `.env.customapp` | `test:customapp` | Planned |
| **dashboard** | `tests/specs/dashboard/` | `specs/dashboard/` | `tests/page-objects/dashboard/` | (TBD) | `test:dashboard` | Planned |

**Config loading step (mandatory before any dimension):**
```bash
# Load family config + resolve phase feature name in one step
cat migration/script_families.json | python3 -c "
import json, sys
data = json.load(sys.stdin)
fam = data['families']['FAMILY_NAME']
print('specsBase:', fam['specsBase'])
print('pomBase:', fam['pomBase'])
print('specMdBase:', fam['specMdBase'])
print('envFile:', fam['envFile'])
print('npmScriptPrefix:', fam['npmScriptPrefix'])
phase = fam['phases'].get('PHASE_ID')
if phase:
    print('feature:', phase['feature'])
    print('wdioSubfolder:', phase['wdioSubfolder'])
    print('fileCount:', phase['fileCount'])
    print('status:', phase['status'])
"
```

Replace `FAMILY_NAME` and `PHASE_ID` with actual values. For `phase=all`, iterate over all phases where `status != "skipped"`.

**To add a new phase to an existing family:** Add an entry to `phases` in `migration/script_families.json` with `status: "pending"`.

**To add a new family:** Add an entry to `migration/script_families.json`, create the design doc and workflow, then run the quality check using the family config.


---

## 2. Dimension 1: Phase & Script Inventory

**Config needed:** `specsBase`, `pomBase`, `designDoc`, `npmScriptPrefix` (from §1.5).

### 2.1 Phase-to-Feature Mapping (Source of Truth)

Use **`migration/script_families.json`** to resolve the phase-to-feature mapping — no design doc reading required:

| Phase | Feature | WDIO Path | Expected Playwright Output |
|-------|---------|-----------|----------------------------|
| (from JSON `phases` key) | (from `feature` field) | (from `wdioSubfolder`) | `{specsBase}<feature>/*.spec.ts` |
| *Example: 2a* | *reportShortcutMetrics* | *reportShortcutMetrics/* | *tests/specs/reportEditor/reportShortcutMetrics/*.spec.ts* |
| … | … | … | … |

### 2.2 Checklist Per Phase

- [ ] Phase entry exists in `script_families.json` with correct `feature`, `wdioSubfolder`, and `fileCount`
- [ ] `fileCount` in `script_families.json` matches actual `{specsBase}<feature>/*.spec.ts`
- [ ] `package.json` has `{npmScriptPrefix}<Feature>` script (e.g. `test:reportScopeFilter` for reportEditor)
- [ ] All POMs referenced by phase specs exist in `{pomBase}/`
- [ ] No POM method uses WDIO-only APIs (`$`, `$$`, `browser.*`, `waitForDisplayed`)

### 2.3 Agent Steps

```bash
# Step 1: Count Playwright specs for the phase
ls -1 {specsBase}<feature>/*.spec.ts | wc -l

# Step 2: Compare against fileCount in script_families.json

# Step 3: Verify npm script exists
cat package.json | grep "{npmScriptPrefix}<Feature>"

# Step 4: Check for WDIO-only APIs in POMs
grep -r '\b\$(\|browser\.\|waitForDisplayed\b' {pomBase}/
```

**Pass criteria:** All 4 commands return expected results with zero WDIO-only API hits.

---

## 3. Dimension 2: Execution Success

**Config needed:** `specsBase`, `npmScriptPrefix` (from §1.5).

### 3.1 Success Criteria

- [ ] `npx playwright test {specsBase}<feature>/ --list` succeeds (no config/import errors)
- [ ] All tests either:
  - **Pass** when env is configured, or
  - **Fail with actionable message** (e.g. family-specific: "REPORT_ENV not set", "reportTestUrl missing", "CUSTOMAPP_URL not set", login timeout)
- [ ] No early exit due to missing fixtures, imports, or syntax errors
- [ ] Failures are due to app behavior or flakiness, not migration artifacts (wrong locators, missing POM methods)
- [ ] Flaky tests on first run are tagged with `test.fixme()` and documented in `migration/script_families.json` with a `flakiness_reason`

### 3.2 Agent Steps

```bash
# Step 1: List tests (no env/network required — validates imports and config)
npx playwright test {specsBase}<feature>/ --list

# Step 2: Run phase (requires env to be configured)
npm run {npmScriptPrefix}<Feature>
# or equivalent:
npx playwright test {specsBase}<feature>/ --project={projectName}
```

**On failure:** Check if error is a migration artifact (locator, missing method) vs. app behavior. Migration artifacts must be fixed immediately. App failures are logged and tagged.

### 3.3 Record Results

Update the appropriate family/phase progress node in `migration/script_families.json` using `migration/scripts/update-phase-progress.sh`:
- `pass`, `fail`
- `last_run`: YYYY-MM-DD

Record progress in `migration/script_families.json` using `migration/scripts/update-phase-progress.sh`.

> **Optional:** If a family design doc exists, you may update Section 6.4 for human readability.

### 3.4 Seed Spec Dependency

- [ ] `tests/seed.spec.ts` is wired as `globalSetup` in `playwright.config.ts` or equivalent project setup
- [ ] Specs requiring seed data have their dependency documented in the spec `.md` plan

---

## 4. Dimension 3: Snapshot Strategy

**Config needed:** `specsBase` (from §1.5). **Source of truth:** `phases.<phase>.snapshotMapping` in `migration/script_families.json`.

**Design:** `snapshotMapping` is the single source of truth for all WDIO snapshot → Playwright conversion records. When running a quality check, **do not parse the design doc appendix** — read the JSON directly.

### 4.1 snapshotMapping Schema (per entry)

| Field | Values | Description |
|-------|--------|-------------|
| `wdioCall` | string | Original WDIO snapshot call |
| `file` | string | Playwright spec file path |
| `strategy` | `"assertion"` \| `"toHaveScreenshot"` \| `"pending"` | How the snapshot was replaced |
| `assertionMethod` | string | The Playwright assertion used |
| `assertionAdequate` | `true` \| `false` \| `null` | Review result: is the assertion sufficient? |
| `justification` | string \| null | Required when `assertionAdequate: false` or `strategy: "toHaveScreenshot"` |

**`assertionAdequate` meanings:**
- `true` — assertion fully covers what the snapshot verified (presence/content/state)
- `false` — assertion is too weak; `strategy` must be upgraded to `"toHaveScreenshot"` with a committed baseline
- `null` — **not yet reviewed**; quality check must evaluate and set to `true` or `false`

### 4.2 Agent Steps

```bash
# Step 1: Load snapshotMapping for the phase from JSON
cat migration/script_families.json | python3 -c "
import json, sys
data = json.load(sys.stdin)
mapping = data['families']['FAMILY_NAME']['phases']['PHASE_ID'].get('snapshotMapping', [])
for i, entry in enumerate(mapping):
    print(f'{i}: strategy={entry[\"strategy\"]} adequate={entry[\"assertionAdequate\"]} file={entry[\"file\"]}')
print(f'Total: {len(mapping)} entries')
"

# Step 2: Verify no takeScreenshotByElement left in Playwright output
grep -rn "takeScreenshotByElement" {specsBase}<feature>/

# Step 3: Check for unregistered toHaveScreenshot calls (not in snapshotMapping)
grep -rn "toHaveScreenshot" {specsBase}<feature>/

# Step 4: Find entries with assertionAdequate: null (needs review)
cat migration/script_families.json | python3 -c "
import json, sys
data = json.load(sys.stdin)
mapping = data['families']['FAMILY_NAME']['phases']['PHASE_ID'].get('snapshotMapping', [])
unreviewed = [e for e in mapping if e.get('assertionAdequate') is None]
for e in unreviewed:
    print('REVIEW NEEDED:', e['wdioCall'], '->', e['assertionMethod'], '|', e['file'])
"

# Step 5: Count WDIO snapshot calls in source vs. snapshotMapping entries
grep -rn "takeScreenshotByElement" workspace-tester/projects/wdio/specs/regression/<family>/<feature>/ | wc -l
```

**Step 4 — assertionAdequate review (for each `null` entry):** The agent reads the original WDIO call and the Playwright assertion side-by-side and evaluates:
- If the assertion verifies the **same intent** (element visible/text/state): set `assertionAdequate: true`
- If the assertion is **weaker** (e.g. `toBeTruthy()` on text where content matters, or visual layout cannot be expressed semantically): set `assertionAdequate: false` and upgrade `strategy` to `"toHaveScreenshot"` with a committed baseline and `justification`

**After review:** Update `snapshotMapping` entries in `migration/script_families.json` — this is the authoritative record. The design doc Section 10 appendix is now **derived from the JSON** and does not need to be independently maintained.

### 4.3 Finding Unmapped Snapshots

If Step 5 count > `snapshotMapping` array length: there are WDIO snapshots not yet registered. For each:
1. Find the corresponding Playwright spec
2. Identify what replaced it (or if it was omitted)
3. Add an entry to `snapshotMapping` with appropriate `strategy` and `assertionAdequate`

### 4.4 Checklist

- [ ] Step 2 returns 0 hits (no `takeScreenshotByElement` in Playwright output)
- [ ] Step 3 hits are all present in `snapshotMapping` with `strategy: "toHaveScreenshot"` and `justification`
- [ ] Step 4 returns 0 unreviewed entries (`assertionAdequate: null` = 0)
- [ ] No `assertionAdequate: false` entries remain without an upgraded `strategy: "toHaveScreenshot"` and committed baseline
- [ ] WDIO source count (Step 5) ≤ `snapshotMapping` length (all snapshots accounted for)
- [ ] All `strategy: "toHaveScreenshot"` entries have `justification` explaining why semantic assertion was insufficient

---


## 5. Dimension 4: Spec MD Comprehensiveness

**Config needed:** `specMdBase` (from §1.5).

**Automation note:** Verifying scenario steps are "meaningful" requires agent reading — this dimension cannot be fully automated by a bash script alone. The agent reads each `.md` file and validates the required elements.

### 5.1 Required Elements

| Element | Description | Example |
|--------|-------------|---------|
| **Title** | Human-readable scenario name | `Report Editor Advanced Banding Formatting` |
| **Seed** | Reference to seed spec | `**Seed:** \`tests/seed.spec.ts\`` (or family-specific seed) |
| **Source** | WDIO origin | `Migrated from WDIO: ReportEditor_advancedBanding.spec.js` |
| **Scenarios** | Test case IDs and steps | `### TC83064 - Functional …` with numbered steps |

### 5.2 Agent Steps

```bash
# Step 1: List all Playwright specs for the phase
ls -1 {specsBase}<feature>/*.spec.ts

# Step 2: For each spec, derive the expected MD path
#   reportEditor: ReportEditor_foo.spec.ts → {specMdBase}<feature>/foo.md
#   customApp:    CustomApp_foo.spec.ts    → {specMdBase}<feature>/foo.md

# Step 3: Check each expected MD exists
for spec in {specsBase}<feature>/*.spec.ts; do
  name=$(basename "$spec" .spec.ts)
  md="{specMdBase}<feature>/${name}.md"
  [ -f "$md" ] && echo "✅ $md" || echo "❌ MISSING: $md"
done

# Step 4: For each existing MD, check required elements
grep -l "Migrated from WDIO" {specMdBase}<feature>/*.md
grep -l "\*\*Seed:\*\*" {specMdBase}<feature>/*.md
grep -l "TC[0-9]" {specMdBase}<feature>/*.md
```

**Agent must also read** each `.md` file to confirm scenarios have enumerated steps (not just headings).

### 5.3 File Naming Convention

**reportEditor:** WDIO `ReportEditor_foo.spec.js` or `Report_foo.spec.js` → Spec MD: `foo.md`.

**Other families:** Map WDIO file naming to spec MD per family convention (e.g. `CustomApp_foo.spec.js` → `foo.md`).

---

## 6. Dimension 5: Env Handling

**Config needed:** `envFile`, `envConfigInterface` (from §1.5).

### 6.1 Reference

[ENV_MANAGEMENT.md](./ENV_MANAGEMENT.md) defines patterns. Per-family examples:

| Family | Required Keys (example) | Env File | Config Interface |
|--------|-------------------------|----------|------------------|
| reportEditor | `reportTestUrl`, `reportTestUser`, `reportTestPassword` | `.env.report` | `ReportEnvConfig`, `getReportEnv()` |
| customApp | (TBD: e.g. `customAppUrl`, API creds) | `.env.customapp` | (TBD) `CustomAppEnvConfig` |

### 6.2 Agent Steps

```bash
# Step 1: Check env interface exists in env.ts
grep -n "{envConfigInterface}" tests/config/env.ts

# Step 2: Check example file has all keys documented
cat tests/config/{envFile}.example

# Step 3: Check env file is gitignored
grep "{envFile}" .gitignore

# Step 4: Check specs use fallback pattern
grep -rn "|| testData\." {specsBase}<feature>/
```

### 6.3 Checklist

- [ ] `tests/config/env.ts` — Family config interface and getter include all keys used by migrated specs
- [ ] `tests/config/.env.<family>.example` — All optional keys documented (commented)
- [ ] Specs use fallback pattern when reading credentials
- [ ] `.env.<family>` is in `.gitignore`; no secrets in repo

### 6.4 Per-Spec Env Mapping

When a spec needs a new credential or URL:

1. Extend family config in `env.ts`
2. Add to `.env.<family>.example` (commented)
3. Add default to test-data (or feature-specific constants)
4. Use `env.xxxKey || testData.xxx.value` in spec

---

## 7. Dimension 6: README Index

**Config needed:** `specMdBase`, `npmScriptPrefix` (from §1.5).

**Automation note:** Verifying README *content quality* (e.g. correct suite descriptions, accurate run commands) requires agent reading — a bash script can only verify file existence. The agent reads the README sections and validates completeness.

### 7.1 Agent Steps

```bash
# Step 1: Verify root README exists and has run commands
grep -n "{npmScriptPrefix}" README.md

# Step 2: Verify feature-level README exists
ls -la {specMdBase}README.md

# Step 3: Verify docs README lists this plan
grep -n "SCRIPT_MIGRATION_QUALITY_CHECK_PLAN" docs/README.md 2>/dev/null || echo "docs/README.md missing or not indexed"
```

**Agent must also read** the `{specMdBase}README.md` to verify it has: Page Objects table, Test Suite Scopes table, How to Run commands, and ENV link.

### 7.2 Canonical README

**Primary:** [library-automation/README.md](../README.md)

Must index:

| Section | Content |
|---------|---------|
| **Table of Contents** | Prerequisites, Environment Setup, How to Run, Debugging, Self-Healing, Agents & Workflows, playwright-cli, Project Structure |
| **Run Commands** | `npm run {npmScriptPrefix}<Feature>` for each migrated phase (per family) |
| **Env Variables** | Link to [docs/ENV_MANAGEMENT.md](./ENV_MANAGEMENT.md) |
| **Project Structure** | `specs/` (MD plans), `tests/specs/` (executable specs), `tests/page-objects/`, `tests/test-data/`, `docs/` |
| **Related Docs** | Migration plan, family design docs, QA constraints, ENV_MANAGEMENT |

### 7.3 Feature-Level README

**`{specMdBase}README.md`** (e.g. `specs/reportEditor/README.md`, `specs/customApp/README.md`) — Must include:

| Section | Content |
|---------|---------|
| Page Objects | Table of POMs used by the family |
| Test Suite Scopes | Table: Suite, Path, Tests, Dossier/Data |
| How to Run | Commands for each suite |
| Environment | Link to ENV_MANAGEMENT |

### 7.4 Docs Index

Create or maintain `docs/README.md` that lists:

- PLAYWRIGHT_MIGRATION_PLAN.md
- Family design docs (e.g. PLAYWRIGHT_MIGRATION_REPORTEDITOR_FULL_PLAN.md)
- PLAYWRIGHT_MIGRATION_QA.md
- ENV_MANAGEMENT.md
- **SCRIPT_MIGRATION_QUALITY_CHECK_PLAN.md** (this doc)
- **migration/script_families.json** — Script Families Registry (machine-readable config)
- Workflows: `.agents/workflows/playwright-<family>-migration.md` per family

---

## 8. Dimension 7: Code Quality

**Config needed:** `specsBase`, `pomBase` (from §1.5).

### 8.1 Agent Steps

```bash
# Step 1: TypeScript compilation (run in library-automation project root)
npx tsc --noEmit

# Step 2: ESLint on migrated files
npx eslint {specsBase}<feature>/ {pomBase}/

# Step 3: Check for WDIO-only APIs in specs and POMs
grep -rn '\$(\|browser\.\|waitForDisplayed\|waitForExist\b' {specsBase}<feature>/ {pomBase}/
```

### 8.2 Checklist

- [ ] `npx tsc --noEmit` passes with zero errors for migrated files
- [ ] ESLint passes (no `@typescript-eslint/no-unused-vars`, `no-undef`, etc.)
- [ ] No WDIO-specific API calls (`$`, `$$`, `browser.*`, `waitForDisplayed`) in specs or POMs
- [ ] All `import` statements resolve to Playwright or project-local modules

---

## 9. Dimension 8: Self-Healing

**Config needed:** `specsBase` (from §1.5). **Skill required:** [`playwright-cli`](../../../skills/playwright-cli/SKILL.md).

**When self-healing is required:** When a spec fails on its first run due to stale or incorrect locators, the agent must activate the `playwright-cli` skill to inspect the DOM, derive updated selectors, and patch the POM or spec.

### 9.1 Agent Steps

```bash
# Step 1: Check self-healing log exists for phases with first-run failures
ls -la migration/self-healing/<family>/<phase>/ 2>/dev/null || echo "No self-healing log"

# Step 2: Check for residual WDIO locator patterns
grep -rn "\$('css=\|xpath=\|waitForDisplayed" {specsBase}<feature>/

# Step 3: Re-run spec after self-healing to confirm pass
npx playwright test {specsBase}<feature>/<name>.spec.ts
```

**For Step 2 hits:** The agent activates the `playwright-cli` skill:
1. Open the app page relevant to the failing spec
2. Run `playwright-cli snapshot` to get current DOM
3. Derive updated semantic locators
4. Patch the POM method; re-run to confirm

### 9.2 Checklist

- [ ] Self-healing log exists in `migration/self-healing/<family>/<phase>/` for specs that failed on first run
- [ ] Updated selectors are committed (no residual WDIO locator patterns like `$('css=...')`)
- [ ] Spec re-runs successfully after self-healing is applied
- [ ] Self-healing changes are noted in `script_families.json` under `progress.self_healed: true`

---

## 10. Output Format

After completing all 8 dimensions for a phase, produce a quality report at:

```
migration/quality_report_<family>_<phase>.md
```

### 10.1 Report Template

```markdown
# Quality Report: <Family> Phase <Phase>

**Date:** YYYY-MM-DD
**Family:** <family>
**Phase:** <phase>
**Feature:** <featureName>

## Summary

| Dimension | Status | Notes |
|-----------|--------|-------|
| 1. Phase & Script Inventory | ✅ Pass / ❌ Fail | <notes> |
| 2. Execution | ✅ Pass / ⚠️ Partial / ❌ Fail | <pass/fail counts> |
| 3. Snapshot Strategy | ✅ Pass / ❌ Fail | total=N adequate=N unreviewed=N upgraded-to-screenshot=N |
| 4. Spec MD | ✅ Pass / ❌ Fail | <missing MDs> |
| 5. Env Handling | ✅ Pass / ❌ Fail | <notes> |
| 6. README Index | ✅ Pass / ❌ Fail | <notes> |
| 7. Code Quality | ✅ Pass / ❌ Fail | <tsc/eslint errors> |
| 8. Self-Healing | ✅ Pass / N/A / ❌ Fail | <healed count> |

## Overall: ✅ Quality-Checked / ❌ Needs Fixes

## Action Items
- [ ] <item 1>
- [ ] <item 2>
```

### 10.2 Update script_families.json

After writing the report, update the progress object using `update-phase-progress.sh`:
```bash
./migration/scripts/update-phase-progress.sh <family> <phase> quality_checked true
```

---

## 11. Creating / Using the Workflow and Skill

### 11.1 Workflow

File: [`.agents/workflows/script-migration-quality-check.md`](../.agents/workflows/script-migration-quality-check.md)

**Structure:**
1. Accept `family` + `phase` from user
2. Load resolved config from `migration/script_families.json` (see §1.5.2)
3. For each target phase: run Dimensions 1–8 using the agent steps in §§2–9
4. Write quality report per §10

### 11.2 Skill

File: [`workspace-tester/skills/migration-quality-check/SKILL.md`](../../../skills/migration-quality-check/SKILL.md)

**Triggers:** "check migration quality", "audit migrated scripts", "validate wdio migration", "quality check customApp migration"

**Behavior:** Resolve family + phase from user intent → invoke workflow → return report summary.

### 11.3 Recommended Stack

| Layer | File | Purpose |
|-------|------|---------|
| **Skill** | `skills/migration-quality-check/SKILL.md` | Intent resolution; triggers workflow |
| **Workflow** | `.agents/workflows/script-migration-quality-check.md` | Step-by-step agent execution of 8 dimensions |
| **Config** | `migration/script_families.json` | Resolves family-specific paths |
| **Self-Healing** | `skills/playwright-cli/SKILL.md` | Activated by Dim 8 when locator fixes are needed |

---

## 12. Checklist Summary (Per Phase, Per Family)

Before marking a phase "quality-checked":

- [ ] **1. Phase & Script Inventory** — Phase registered in `script_families.json`; `fileCount` matches actual specs; npm script exists; POMs migrated
- [ ] **2. Execution** — `--list` succeeds; run recorded in `script_families.json` progress; flaky tests tagged
- [ ] **3. Snapshot Strategy** — All takeScreenshotByElement replaced and documented in `snapshotMapping` in `script_families.json`
- [ ] **4. Spec MD** — Every `.spec.ts` has corresponding `.md` with seed, source, scenarios
- [ ] **5. Env Handling** — env.ts, .env.\<family\>.example, fallback pattern in specs
- [ ] **6. README** — Root README and `{specMdBase}README.md` index suites and docs
- [ ] **7. Code Quality** — `tsc --noEmit` and ESLint pass; no WDIO-only APIs in specs or POMs
- [ ] **8. Self-Healing** — Self-healing applied and logged for any first-run failures
- [ ] **Quality Report** — `migration/quality_report_<family>_<phase>.md` written and script_families.json updated

---

## 13. References

- [migration/script_families.json](../migration/script_families.json) — Script Families Registry (machine-readable)
- [script-migration.md](../.agents/workflows/script-migration.md) — Generalized migration workflow
- [PLAYWRIGHT_MIGRATION_REPORTEDITOR_FULL_PLAN.md](./PLAYWRIGHT_MIGRATION_REPORTEDITOR_FULL_PLAN.md) — reportEditor design doc
- [PLAYWRIGHT_MIGRATION_PLAN.md](./PLAYWRIGHT_MIGRATION_PLAN.md) — Overall migration strategy
- [PLAYWRIGHT_MIGRATION_QA.md](./PLAYWRIGHT_MIGRATION_QA.md) — QA constraints
- [ENV_MANAGEMENT.md](./ENV_MANAGEMENT.md) — Env patterns
- [playwright-cli skill](../../../skills/playwright-cli/SKILL.md) — Browser automation for self-healing (Dimension 8)
- [migration-quality-check skill](../../../skills/migration-quality-check/SKILL.md) — Intent-triggered quality check skill
