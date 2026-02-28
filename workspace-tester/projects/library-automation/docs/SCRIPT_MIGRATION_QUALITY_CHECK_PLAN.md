# Script Migration Quality Check Plan

This document defines how to verify the quality of WDIO→Playwright script migration for ReportEditor specs. It supports both **manual audits** and **workflow/skill automation** so agents can run end-to-end quality checks.

**Related docs:**
- [playwright-reporteditor-migration.md](../.agents/workflows/playwright-reporteditor-migration.md) — Per-phase migration workflow
- [PLAYWRIGHT_MIGRATION_REPORTEDITOR_FULL_PLAN.md](./PLAYWRIGHT_MIGRATION_REPORTEDITOR_FULL_PLAN.md) — Design doc, phases, target inventory, snapshot mapping
- [PLAYWRIGHT_MIGRATION_PLAN.md](./PLAYWRIGHT_MIGRATION_PLAN.md) — Overall migration strategy

---

## 1. Scope: What Gets Checked

For each migrated phase (2a–2o), the quality check verifies:

| # | Dimension | What to Verify |
|---|-----------|----------------|
| 1 | **Phase & Script Inventory** | Correct phase mapping; all WDIO specs have corresponding Playwright specs |
| 2 | **Execution** | All specs run successfully (pass, or fail with clear actionable message) |
| 3 | **Snapshot Strategy** | WDIO `takeScreenshotByElement` replaced with assertions; documented in Appendix |
| 4 | **Spec MD Comprehensiveness** | Each spec has a `.md` plan with scenarios, steps, seed reference |
| 5 | **Env Handling** | Credentials in `.env.report`; `env.ts` extended; `ENV_MANAGEMENT.md` updated |
| 6 | **README Index** | README(s) index all related docs, suites, env vars, run commands |
| 7 | **Code Quality** | TypeScript compiles; ESLint passes; no WDIO-only APIs in POMs or specs |
| 8 | **Self-Healing** | Self-healing applied to first-run failures; updated selectors committed |

---

## 2. Dimension 1: Phase & Script Inventory

### 2.1 Phase-to-Feature Mapping (Source of Truth)

Use **Section 0** and **Section 2** of [PLAYWRIGHT_MIGRATION_REPORTEDITOR_FULL_PLAN.md](./PLAYWRIGHT_MIGRATION_REPORTEDITOR_FULL_PLAN.md):

| Phase | Feature | WDIO Path | Expected Playwright Output |
|-------|---------|-----------|----------------------------|
| 2a | reportShortcutMetrics | `reportShortcutMetrics/` | `tests/specs/reportEditor/reportShortcutMetrics/*.spec.ts` |
| 2b | reportPageBySorting | `reportPageBySorting/` | `tests/specs/reportEditor/reportPageBySorting/*.spec.ts` |
| … | … | … | … |

### 2.2 Checklist Per Phase

- [ ] Phase row exists in design doc Section 0 (Migration Progress)
- [ ] Section 2 lists every WDIO file with its Playwright output path
- [ ] File count in Section 2 matches actual `tests/specs/reportEditor/<feature>/*.spec.ts`
- [ ] `package.json` has `test:report<Feature>` script (e.g. `test:reportScopeFilter`)
- [ ] All POMs referenced by phase specs exist in `tests/page-objects/reportEditor/`
- [ ] No POM method uses WDIO-only APIs (`$`, `$$`, `browser.*`, `waitForDisplayed`)

### 2.3 Commands to Run Per Phase

```bash
# List tests (no env/network required)
npx playwright test tests/specs/reportEditor/<feature>/ --list

# Run phase (requires env)
npm run test:report<Feature>
# or
npx playwright test tests/specs/reportEditor/<feature>/ --project=report<Feature>
```

**Phase-to-run mapping:** See workflow [Phase-to-Feature Mapping](../.agents/workflows/playwright-reporteditor-migration.md#phase-to-feature-mapping).

---

## 3. Dimension 2: Execution Success

### 3.1 Success Criteria

- [ ] `npx playwright test tests/specs/reportEditor/<feature>/ --list` succeeds (no config/import errors)
- [ ] All tests either:
  - **Pass** when env is configured, or
  - **Fail with actionable message** (e.g. "REPORT_ENV not set", "reportTestUrl missing", login timeout)
- [ ] No early exit due to missing fixtures, imports, or syntax errors
- [ ] Failures are due to app behavior or flakiness, not migration artifacts (wrong locators, missing POM methods)
- [ ] Flaky tests on first run are tagged with `test.fixme()` and documented in `task.json` with a `flakiness_reason`

### 3.2 Run Order (Recommended)

Run phases in order; skip phases with known env blockers only after documenting:

1. `npm run test:reportUndoRedo` (baseline)
2. `npm run test:reportShortcutMetrics` … through `npm run test:reportCancel`
3. For phases 2k–2o: run when migrated

### 3.3 Record Results

Update `migration/task.json`:
- `phases.<phase>.pass`, `phases.<phase>.fail`
- `phases.<phase>.last_run`: YYYY-MM-DD

Update design doc **Section 6.4** (Phase-by-Phase Validation Results).

### 3.4 Seed Spec Dependency

- [ ] `tests/seed.spec.ts` is wired as `globalSetup` in `playwright.config.ts` or equivalent project setup
- [ ] Specs requiring seed data have their dependency documented in the spec `.md` plan

---

## 4. Dimension 3: Snapshot Strategy

### 4.1 WDIO vs Playwright

| WDIO | Playwright (default) |
|------|----------------------|
| `takeScreenshotByElement(elem, 'TC', 'name')` | `expect(locator).toBeVisible()` or `expect(locator).toHaveText(...)` |
| Spectre image comparison | Semantic assertion |

### 4.2 Verification Steps

1. **Inspect WDIO source** — Find all `takeScreenshotByElement` (or similar) calls.
2. **Check Playwright spec** — Each call should be replaced with an assertion (Option A in design doc §4.10).
3. **Design doc Section 10** — Each replacement must be documented:
   - Phase
   - WDIO snapshot call
   - Assertion method
   - File path (e.g. `tests/specs/reportEditor/reportPageBySorting/pageBySorting1.spec.ts:42`)

### 4.3 Checklist

- [ ] No `takeScreenshotByElement` left in migrated Playwright specs
- [ ] No orphan Spectre/visual assertions unless explicitly Option B (`toHaveScreenshot`)
- [ ] Section 10 (Appendix) has a row for every replaced snapshot in the phase
- [ ] **Option B** (`toHaveScreenshot`) is used only when: (a) semantic assertions are insufficient, (b) snapshot baseline is committed, (c) rationale is documented in Section 10 with explicit justification

---

## 5. Dimension 4: Spec MD Comprehensiveness

Each migrated spec must have a corresponding Markdown plan in `specs/reportEditor/<feature>/<name>.md`.

### 5.1 Required Elements

| Element | Description | Example |
|--------|-------------|---------|
| **Title** | Human-readable scenario name | `Report Editor Advanced Banding Formatting` |
| **Seed** | Reference to seed spec | `**Seed:** \`tests/seed.spec.ts\`` |
| **Source** | WDIO origin | `Migrated from WDIO: ReportEditor_advancedBanding.spec.js` |
| **Scenarios** | Test case IDs and steps | `### TC83064 - Functional …` with numbered steps |

### 5.2 Checklist Per Spec

- [ ] `specs/reportEditor/<feature>/<name>.md` exists
- [ ] Contains `**Seed:** \`tests/seed.spec.ts\``
- [ ] Contains `Migrated from WDIO: <WDIO file>.spec.js`
- [ ] Scenarios listed with IDs (e.g. TC83064)
- [ ] Steps are enumerated and meaningful

### 5.3 File Naming Convention

- WDIO: `ReportEditor_foo.spec.js` → Spec MD: `foo.md`
- WDIO: `Report_foo.spec.js` → Spec MD: `foo.md`

---

## 6. Dimension 5: Env Handling

### 6.1 Reference

[ENV_MANAGEMENT.md](./ENV_MANAGEMENT.md) defines:
- Required keys: `reportTestUrl`, `reportTestUser`, `reportTestPassword`
- Optional keys per spec: `reportCubePrivUser`, `reportSubsetUser`, etc.
- File locations: project root or `tests/config/`
- Fallback pattern: `env.reportXxxUser || reportCreatorData.xxx.username`

### 6.2 Verification

- [ ] `tests/config/env.ts` — `ReportEnvConfig` and `getReportEnv()` include all keys used by migrated specs
- [ ] `tests/config/.env.report.example` — All optional keys documented (commented)
- [ ] Specs use fallback pattern when reading user credentials
- [ ] `.env.report` is in `.gitignore`; no secrets in repo

### 6.3 Per-Spec Env Mapping

When a spec needs a new user:

1. Extend `ReportEnvConfig` in `env.ts`
2. Add to `.env.report.example` (commented)
3. Add default to `reportCreatorData` (or feature-specific test-data)
4. Use `env.reportXxxUser || reportCreatorData.xxx.username` in spec

---

## 7. Dimension 6: README Index

### 7.1 Canonical README

**Primary:** [library-automation/README.md](../README.md)

Must index:

| Section | Content |
|---------|---------|
| **Table of Contents** | Prerequisites, Environment Setup, How to Run, Debugging, Self-Healing, Agents & Workflows, playwright-cli, Project Structure |
| **Run Commands** | `npm run test:report<Feature>` for each migrated phase |
| **Env Variables** | Link to [docs/ENV_MANAGEMENT.md](./ENV_MANAGEMENT.md) |
| **Project Structure** | `specs/` (MD plans), `tests/specs/` (executable specs), `tests/page-objects/`, `tests/test-data/`, `docs/` |
| **Related Docs** | Migration plan, QA constraints, Phase 1 execution, ENV_MANAGEMENT |

### 7.2 Feature-Level README

**specs/reportEditor/README.md** — Must include:

| Section | Content |
|---------|---------|
| Page Objects | Table of POMs used by reportEditor |
| Test Suite Scopes | Table: Suite, Path, Tests, Dossier/Data |
| How to Run | Commands for each suite |
| Environment | Link to ENV_MANAGEMENT |

### 7.3 Docs Index

Create or maintain `docs/README.md` (or a section in root README) that lists:

- PLAYWRIGHT_MIGRATION_PLAN.md
- PLAYWRIGHT_MIGRATION_REPORTEDITOR_FULL_PLAN.md
- PLAYWRIGHT_MIGRATION_QA.md
- PLAYWRIGHT_MIGRATION_PHASE1_EXECUTION.md
- ENV_MANAGEMENT.md
- **SCRIPT_MIGRATION_QUALITY_CHECK_PLAN.md** (this doc)
- Workflow: `.agents/workflows/playwright-reporteditor-migration.md`

---

## 8. Dimension 7: Code Quality

### 8.1 TypeScript Compilation

```bash
# Run in library-automation project root
npx tsc --noEmit
```

All migrated spec files and POMs must compile without errors.

### 8.2 ESLint

```bash
npx eslint tests/specs/reportEditor/<feature>/ tests/page-objects/reportEditor/
```

### 8.3 Checklist

- [ ] `npx tsc --noEmit` passes with zero errors for migrated files
- [ ] ESLint passes (no `@typescript-eslint/no-unused-vars`, `no-undef`, etc.)
- [ ] No WDIO-specific API calls (`$`, `$$`, `browser.*`, `waitForDisplayed`) in specs or POMs
- [ ] All `import` statements resolve to Playwright or project-local modules

---

## 9. Dimension 8: Self-Healing

### 9.1 When Self-Healing Is Required

Self-healing must be applied when a spec fails on its first run due to stale or incorrect locators.

### 9.2 Verification

- [ ] Self-healing log exists in `migration/self-healing/<phase>/` for specs that failed on first run
- [ ] Updated selectors are committed (no residual WDIO locator patterns like `$('css=...')`)
- [ ] Spec re-runs successfully after self-healing is applied
- [ ] Self-healing changes are noted in `task.json` under `phases.<phase>.self_healed: true`

---

## 10. Creating a Workflow or Skill for End-to-End Quality Check

### 10.1 Option A: Cursor Workflow

Create `.agents/workflows/script-migration-quality-check.md` that an agent can follow:

**Structure:**
1. Accept target: `all`, `phase 2a`, or `phases 2a, 2h, 2i`
2. For each target phase:
   - Run Dimension 1 (inventory)
   - Run Dimension 2 (execution)
   - Run Dimension 3 (snapshot mapping)
   - Run Dimension 4 (spec MD)
   - Run Dimension 5 (env)
   - Run Dimension 6 (README)
3. Produce a summary report (pass/fail per dimension per phase)

**Reference:** Follow the format of [playwright-reporteditor-migration.md](../.agents/workflows/playwright-reporteditor-migration.md).

### 10.2 Option B: Agent Skill

Create `.cursor/skills/script-migration-quality-check/SKILL.md`:

**Triggers:** When user asks to "check migration quality", "audit migrated scripts", or "validate ReportEditor migration".

**Content:**
1. Load this plan (`SCRIPT_MIGRATION_QUALITY_CHECK_PLAN.md`)
2. Load design doc Section 0 and Section 2 for phase mapping
3. Execute each dimension in order
4. Output checklist results and a summary table

### 10.3 Option C: Executable Script

Create `migration/quality_check.sh` (or `quality_check.ts`):

```bash
#!/bin/bash
# Usage: ./migration/quality_check.sh [phase|all]
# 1. Lists tests per phase
# 2. Runs tests (optional, requires env)
# 3. Checks spec MD existence
# 4. Outputs pass/fail per dimension
```

The script can call `npx playwright test ... --list` and parse outputs; it cannot fully automate snapshot mapping or README content checks without additional tooling.

### 10.4 Recommended Combination

| Layer | Purpose |
|-------|---------|
| **Workflow** | Step-by-step agent instructions; references this plan |
| **Skill** | Teaches agent when and how to run the check |
| **Script** | Automates `--list` and execution; provides raw data for agent |

---

## 11. Checklist Summary (Per Phase)

Before marking a phase "quality-checked":

- [ ] **1. Phase & Script Inventory** — Design doc Section 2 up to date; npm script exists; POMs migrated
- [ ] **2. Execution** — `--list` succeeds; run recorded in task.json and Section 6.4; flaky tests tagged
- [ ] **3. Snapshot Strategy** — All takeScreenshotByElement replaced and documented in Section 10
- [ ] **4. Spec MD** — Every `.spec.ts` has corresponding `.md` with seed, source, scenarios
- [ ] **5. Env Handling** — env.ts, .env.report.example, fallback pattern in specs
- [ ] **6. README** — Root README and specs/reportEditor/README index suites and docs
- [ ] **7. Code Quality** — `tsc --noEmit` and ESLint pass; no WDIO-only APIs in specs or POMs
- [ ] **8. Self-Healing** — Self-healing applied and logged for any first-run failures

---

## 12. References

- [playwright-reporteditor-migration.md](../.agents/workflows/playwright-reporteditor-migration.md)
- [PLAYWRIGHT_MIGRATION_REPORTEDITOR_FULL_PLAN.md](./PLAYWRIGHT_MIGRATION_REPORTEDITOR_FULL_PLAN.md)
- [PLAYWRIGHT_MIGRATION_PLAN.md](./PLAYWRIGHT_MIGRATION_PLAN.md)
- [PLAYWRIGHT_MIGRATION_QA.md](./PLAYWRIGHT_MIGRATION_QA.md)
- [ENV_MANAGEMENT.md](./ENV_MANAGEMENT.md)
- docs-organization-governance skill (`.cursor/skills/docs-organization-governance/`) — README/index structure
