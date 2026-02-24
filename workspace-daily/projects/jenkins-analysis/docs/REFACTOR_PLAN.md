# Refactor Plan: Scripts Reorganization, Test Coverage, and Docs Consolidation

**Date:** 2026-02-24  
**Status:** Proposed  
**Scope:** 3 major workstreams

---

## Problem Statement

### 1. Flat Script Structure
All 13 scripts sit in a flat `scripts/` folder with no logical grouping. Functions are duplicated across files (e.g., `buildFingerprint` exists in both `parser_v2.js` and `db_writer.js`; `fetchSpectreData` and `classifySpectreResult` exist in both `db_writer.js` and `spectre_scraper.js`). There are also obsolete files (`db_writer.backup.js`, `test_parser_v2.js`, `diagnose_parser.js`).

### 2. Insufficient Test Coverage
Only 2 test files exist (`db_writer.test.js`, `md_to_docx.test.js`) covering ~5 functions. Most exported functions in `parser_v2.js` (8 exports), `db-adapter.js` (full class), `ai_failure_analyzer.js`, `report_generator.js`, `webhook_server.js`, `spectre_scraper.js`, and `check_previous_failures.js` have zero tests.

### 3. Documentation Chaos
29 doc files + 5 root-level markdown files (README.md, README_V2.1.md, DEPLOYMENT.md, REVIEW.md, CHANGELOG.md) contain massive overlap. Multiple "implementation complete" docs, multiple "fix plan" docs across versions, and information scattered with no single source of truth.

---

## Workstream 1: Scripts Reorganization

### Current Flat Structure (13 JS files + 15 SH/MJS scripts)

*Note: The `scripts/` directory also contains 15 `.sh` and `.mjs` scripts (e.g., `analyzer.sh`, `patch_analyzer.sh`, `generate_report.mjs`). These will remain at the root of `scripts/` but their internal `node` commands must be updated to reference the new nested JS module paths.*

```
scripts/
├── ai_failure_analyzer.js     # AI/heuristic failure analysis
├── check_previous_failures.js # Jenkins API historical check
├── db-adapter.js              # SQLite adapter (sql.js wrapper)
├── db_writer.backup.js        # OBSOLETE backup of V1
├── db_writer.js               # DB operations + Spectre fetch + main CLI
├── diagnose_parser.js         # OBSOLETE debug script
├── md_to_docx.js              # Markdown → DOCX conversion
├── migrate_v2.js              # DB migration script
├── parser_v2.js               # Console log parser
├── report_generator.js        # Markdown report builder
├── spectre_scraper.js         # Spectre HTML scraper CLI
├── test_parser_v2.js          # OBSOLETE integration test (belongs in tests/)
├── webhook_server.js          # HTTP webhook server
└── package.json
```

### Proposed Grouped Structure
```
scripts/
├── package.json
├── parsing/                   # Console log parsing
│   ├── index.js               # Re-export public API
│   ├── parser.js              # extractFailuresFromLog, legacy parser (from parser_v2.js)
│   ├── extractors.js          # extractTestCaseInfo, extractScreenshotInfo, extractSpectreUrl, extractFullError
│   └── deduplication.js       # deduplicateRetries, splitByFilePattern
│
├── database/                  # All database concerns
│   ├── index.js               # Re-export public API
│   ├── adapter.js             # Database class (from db-adapter.js)
│   ├── schema.js              # initSchema, openDb
│   ├── operations.js          # insertJobRun, insertFailedJob, insertFailedStep, enforceFiveRecordLimit, findLastFailedBuild
│   └── migrate.js             # V2 migration script (from migrate_v2.js)
│
├── analysis/                  # Failure analysis & classification
│   ├── index.js               # Re-export public API
│   ├── fingerprint.js         # buildFingerprint (single source, removes duplication)
│   ├── spectre.js             # fetchSpectreData, parseSpectreUrl, classifySpectreResult, parseSpectreData, fetchUrl (merged from db_writer.js + spectre_scraper.js)
│   ├── ai_analyzer.js         # heuristicAnalysis, buildAnalysisResult, extractFailureDetails (from ai_failure_analyzer.js)
│   └── history.js             # checkPreviousBuilds, countConsecutiveFailures (from check_previous_failures.js)
│
├── reporting/                 # Report generation & export
│   ├── index.js               # Re-export public API
│   ├── generator.js           # Report markdown builder (from report_generator.js)
│   ├── docx_converter.js      # MD → DOCX conversion (from md_to_docx.js)
│   └── sanitizer.js           # sanitizeConsoleLog, truncate (extracted from report_generator.js)
│
├── server/                    # Webhook HTTP server
│   ├── index.js               # Server entry point (from webhook_server.js)
│   └── config.js              # WATCHED_JOBS, PORT, paths configuration
│
└── pipeline/                  # Main orchestration / CLI entry points
    ├── process_build.js       # processStep, processJobFailed, main() (from db_writer.js main logic)
    └── spectre_cli.js         # CLI wrapper for spectre scraper (from spectre_scraper.js main())
```

### Key Decisions

| Decision | Rationale |
|----------|-----------|
| **Delete `db_writer.backup.js`** | Obsolete V1 backup; V1 code is in git history |
| **Delete `diagnose_parser.js`** | One-off debug script for a specific build; not reusable |
| **Move `test_parser_v2.js` → `tests/`** | It's an integration test, not a production script |
| **Merge Spectre logic** | `fetchSpectreData` + `classifySpectreResult` duplicated in `db_writer.js` and `spectre_scraper.js`; unify into `analysis/spectre.js` |
| **Extract `buildFingerprint`** | Duplicated in `parser_v2.js` and `db_writer.js`; single source in `analysis/fingerprint.js` |
| **Split `db_writer.js`** | Currently a 300-line monolith mixing DB schema, operations, Spectre logic, parsing imports, and CLI `main()`. Split into focused modules. |
| **Extract config** | `WATCHED_JOBS`, `PORT`, `JENKINS_URL`, etc. scattered across files; centralize in `server/config.js` |
| **Keep `package.json` at `scripts/`** | Maintains existing `npm install` workflow from `scripts/` directory |

### Migration Mapping

| Old File | New Location(s) | Functions Moved |
|----------|-----------------|-----------------|
| `parser_v2.js` | `parsing/parser.js`, `parsing/extractors.js`, `parsing/deduplication.js` | All 8 exported functions |
| `db-adapter.js` | `database/adapter.js` | `Database` class |
| `db_writer.js` | `database/schema.js`, `database/operations.js`, `analysis/fingerprint.js`, `analysis/spectre.js`, `pipeline/process_build.js` | Split across 5 files |
| `report_generator.js` | `reporting/generator.js`, `reporting/sanitizer.js` | Main report logic + extracted utilities |
| `md_to_docx.js` | `reporting/docx_converter.js` | All DOCX conversion logic |
| `ai_failure_analyzer.js` | `analysis/ai_analyzer.js` | All heuristic analysis |
| `check_previous_failures.js` | `analysis/history.js` | `checkPreviousBuilds`, `countConsecutiveFailures` |
| `spectre_scraper.js` | `analysis/spectre.js` (merged), `pipeline/spectre_cli.js` (CLI) | `parseSpectreData`, `fetchUrl` merged; CLI separated |
| `webhook_server.js` | `server/index.js`, `server/config.js` | Server logic + extracted config |
| `migrate_v2.js` | `database/migrate.js` | Migration script |
| `db_writer.backup.js` | **DELETED** | N/A |
| `diagnose_parser.js` | **DELETED** | N/A |
| `test_parser_v2.js` | `tests/parser_v2.integration.test.js` | Moved to test directory |

---

## Workstream 2: Enhanced Unit Tests

### Current Coverage

| File | Functions Tested | Functions Untested |
|------|------------------|--------------------|
| `db_writer.js` | `buildFingerprint` (partial - V1 signature), `parseSpectreUrl`, `classifySpectreResult` | `initSchema`, `openDb`, `insertJobRun`, `enforceFiveRecordLimit`, `insertFailedJob`, `insertFailedStep`, `findLastFailedBuild`, `fetchSpectreData`, `processStep`, `processJobFailed` |
| `md_to_docx.js` | 1 integration test (runs script) | `parseMarkdownLink`, `parseInlineContent`, `createTable`, `processTokens` |
| `parser_v2.js` | **NONE** | `extractFailuresFromLog`, `buildFingerprint`, `extractFullError`, `splitByFilePattern`, `deduplicateRetries`, `extractTestCaseInfo`, `extractScreenshotInfo`, `extractSpectreUrl` |
| `db-adapter.js` | **NONE** | `Database` class (create, exec, prepare, run, get, all, close) |
| `ai_failure_analyzer.js` | **NONE** | `heuristicAnalysis`, `buildAnalysisResult`, `extractFailureDetails` |
| `report_generator.js` | **NONE** | `truncate`, `sanitizeConsoleLog` + report building |
| `spectre_scraper.js` | **NONE** | `fetchUrl`, `parseSpectreData` |
| `check_previous_failures.js` | **NONE** | `checkPreviousBuilds`, `countConsecutiveFailures` |
| `webhook_server.js` | **NONE** | Server handler, `triggerAnalysis`, `log` |

### Proposed Test Structure

```
tests/
├── parsing/
│   ├── parser.test.js              # extractFailuresFromLog (normal + legacy + empty input)
│   ├── extractors.test.js          # extractTestCaseInfo, extractScreenshotInfo, extractSpectreUrl, extractFullError
│   └── deduplication.test.js       # deduplicateRetries, splitByFilePattern
│
├── database/
│   ├── adapter.test.js             # Database class CRUD operations
│   ├── schema.test.js              # initSchema, openDb
│   └── operations.test.js          # insertJobRun, enforceFiveRecordLimit, insertFailedJob, insertFailedStep, findLastFailedBuild
│
├── analysis/
│   ├── fingerprint.test.js         # buildFingerprint uniqueness and determinism
│   ├── spectre.test.js             # parseSpectreUrl, classifySpectreResult, parseSpectreData
│   ├── ai_analyzer.test.js         # heuristicAnalysis (all 5 categories + unknown), buildAnalysisResult, extractFailureDetails
│   └── history.test.js             # countConsecutiveFailures
│
├── reporting/
│   ├── sanitizer.test.js           # sanitizeConsoleLog, truncate
│   ├── docx_converter.test.js      # parseMarkdownLink, parseInlineContent (unit) + integration test
│   └── generator.test.js           # Report building with mock DB data
│
├── server/
│   └── webhook.test.js             # HTTP handler (POST/non-POST), payload parsing, watched job filtering
│
├── integration/
│   └── parser_v2.integration.test.js  # End-to-end parser test (moved from scripts/test_parser_v2.js)
│
└── fixtures/
    ├── sample_console_log.txt      # Real console log snippet for parser tests
    ├── sample_spectre.html         # Spectre HTML snippet for scraper tests
    └── sample_analysis.json        # AI analysis output fixture
```

### Test Counts per Module

| Module | Unit Tests | Functions Covered |
|--------|-----------|-------------------|
| `parsing/` | ~20 tests | 8 functions |
| `database/` | ~15 tests | 7 functions + Database class |
| `analysis/` | ~25 tests | 10 functions |
| `reporting/` | ~12 tests | 6 functions |
| `server/` | ~8 tests | 3 functions |
| **Total** | **~80 tests** | **34+ functions** |

### Testing Framework

Use Node.js built-in `assert` module (already used in existing tests) plus `node:test` (Node 18+) for better test runner support. No additional dependencies needed.

```javascript
const { describe, it } = require('node:test');
const assert = require('assert');
```

### Key Test Cases to Add

**Parser (highest priority - core logic):**
- `extractFailuresFromLog` with real console text containing TC, QAC-, BCIN- prefixes
- `extractFailuresFromLog` with empty/garbage input returns `[]`
- `splitByFilePattern` with multiple spec files
- `deduplicateRetries` combines run_1/run_2/run_3 into single entry with retryCount=3
- `extractTestCaseInfo` with each supported prefix (TC, QAC-, BCIN-, TSTR-, BUG-, TASK-)
- `extractScreenshotInfo` with various screenshot patterns
- `extractSpectreUrl` with valid and invalid URLs
- `extractFullError` captures from "- Failed:" to "at <Jasmine>"

**Database (data integrity):**
- `insertJobRun` creates and returns ID
- `insertJobRun` upserts on conflict
- `enforceFiveRecordLimit` keeps only 5 latest
- `findLastFailedBuild` returns correct history
- `insertFailedStep` rejects undefined values

**Analysis:**
- `buildFingerprint` is deterministic (same input → same hash)
- `buildFingerprint` includes fileName (V2 vs V1 difference)
- `classifySpectreResult` handles all 4 branches (pass, low diff, over threshold, under threshold)
- `heuristicAnalysis` classifies all 5 failure categories correctly
- `heuristicAnalysis` returns 'unknown' for unrecognized patterns

---

## Workstream 3: Documentation Consolidation

### Current State: 34 Markdown Files

**Root level (5 files):**
| File | Content | Overlap With |
|------|---------|-------------|
| `README.md` | V2 comprehensive readme (537 lines) | Everything |
| `README_V2.1.md` | V2.1 release notes | `docs/V2.1_IMPLEMENTATION_SUMMARY.md` |
| `DEPLOYMENT.md` | Deployment guide (Phase 1) | `docs/IMPLEMENTATION_SUMMARY.md`, `docs/AUTO_START.md` |
| `REVIEW.md` | Review checklist | `docs/IMPLEMENTATION_COMPLETE.md` |
| `CHANGELOG.md` | Change log | Multiple `FIX_*` docs |

**docs/ folder (29 files):**

| Category | Files | Status |
|----------|-------|--------|
| **Fix Plans** (6) | `FIX_PLAN.md`, `FIX_PLAN_V2.1.md`, `FIX_PLAN_V2.2.md`, `FIX_PLAN_V2.3.md`, `FIX_DESIGN_V2.md`, `FIX_EMPTY_REPORTS.md` | Obsolete - all implemented |
| **Fix Summaries** (4) | `FIX_SUMMARY.md`, `FIX_SUMMARY_2026-02-24.md`, `FIX_SORT_SUBTOTALS.md`, `FIX_MULTIJOB_2026-02-24.md` | Obsolete - captured in CHANGELOG |
| **Version Completion** (5) | `IMPLEMENTATION_COMPLETE.md`, `V2.1_IMPLEMENTATION_SUMMARY.md`, `V2.2_COMPLETE.md`, `V2.3_COMPLETE.md`, `V2.3_FINAL.md` | Obsolete - consolidated into CHANGELOG |
| **Summaries** (2) | `IMPLEMENTATION_SUMMARY.md`, `V2_FINAL_SUMMARY.md` | Overlap with README |
| **Design** (3) | `DESIGN.md`, `DATA_FLOW_V2.md`, `ENHANCED_CATEGORIZATION.md` | Consolidate into ARCHITECTURE.md |
| **Setup Guides** (2) | `WEBHOOK_SETUP.md`, `AUTO_START.md` | Consolidate into DEPLOYMENT.md |
| **Reference** (3) | `FAQ.md`, `QUESTIONS.md`, `APPROVED_DECISIONS.md` | FAQ stays; others obsolete |
| **Testing** (2) | `TEST_MANUAL.md`, `PARSING_EXAMPLE.md` | Consolidate into TESTING.md |
| **Integration** (1) | `PHASE_4_SPECTRE_INTEGRATION.md` | Obsolete - captured in CHANGELOG |
| **Bug Fixes** (1) | `BUG_FIXES.md` | Merge into CHANGELOG |

### Proposed Documentation (Single Source of Truth)

```
README.md                      # Project overview, quick start, folder structure (keep at root, update)
CHANGELOG.md                   # All version history (keep at root, consolidate)

docs/
├── ARCHITECTURE.md            # System design, data flow, component diagram
│                              # (merged from: DESIGN.md, DATA_FLOW_V2.md, ENHANCED_CATEGORIZATION.md)
│
├── DEPLOYMENT.md              # How to deploy, auto-start, PM2 setup
│                              # (merged from: root DEPLOYMENT.md, WEBHOOK_SETUP.md, AUTO_START.md, IMPLEMENTATION_SUMMARY.md)
│
├── TESTING.md                 # How to run tests, test structure, fixtures
│                              # (merged from: TEST_MANUAL.md, PARSING_EXAMPLE.md)
│
├── FAQ.md                     # Common questions and answers (keep, update)
│
└── REFACTOR_PLAN.md           # This document
```

### Files to Archive/Delete

**Move to `docs/archive/` (historical reference, not active docs):**
- All 6 `FIX_PLAN*.md` files
- All 4 `FIX_SUMMARY*.md` files
- All 5 version completion files (`*COMPLETE*.md`, `*FINAL*.md`)
- `QUESTIONS.md`, `APPROVED_DECISIONS.md`
- `BUG_FIXES.md` (content merged into CHANGELOG)
- `PHASE_4_SPECTRE_INTEGRATION.md`

**Delete from root (content merged elsewhere):**
- `README_V2.1.md` → content in CHANGELOG
- `REVIEW.md` → obsolete review checklist
- Root `DEPLOYMENT.md` → merged into `docs/DEPLOYMENT.md`

**Total: 29 docs → 5 active docs** (README, CHANGELOG, ARCHITECTURE, DEPLOYMENT, TESTING, FAQ, REFACTOR_PLAN)

---

## Execution Order

### Phase 1: Scripts Reorganization
1. Create directory structure (`parsing/`, `database/`, `analysis/`, `reporting/`, `server/`, `pipeline/`)
2. Extract and move functions to new modules (with proper `require` paths)
3. Create `index.js` barrel exports for each group
4. Update all internal `require()` references in JS files
5. Update internal `node` references in all `.sh` and `.mjs` scripts (e.g., `analyzer.sh`, `patch_analyzer.sh`) to point to the new nested paths
6. Update `package.json` (`"main": "server/index.js"` and `"start": "node server/index.js"`)
7. Update root `test.sh` to reflect the new file paths and updated documentation
8. Delete obsolete files (`db_writer.backup.js`, `diagnose_parser.js`)
9. Move `test_parser_v2.js` to `tests/integration/`
10. Update PM2 auto-start config: `pm2 delete jenkins-webhook && pm2 start scripts/server/index.js --name jenkins-webhook && pm2 save`
11. Verify existing tests and scripts still pass

### Phase 2: Enhanced Unit Tests
1. Create test directory structure
2. Create test fixtures
3. Write parser tests (highest priority)
4. Write analysis tests
5. Write database tests
6. Write reporting tests
7. Write server tests
8. Add `npm test` script to `package.json`
9. Verify all tests pass

### Phase 3: Docs Consolidation
1. Create `docs/archive/`
2. Create consolidated `docs/ARCHITECTURE.md`
3. Create consolidated `docs/DEPLOYMENT.md`
4. Create consolidated `docs/TESTING.md`
5. Update `docs/FAQ.md`
6. Update root `README.md` with new structure
7. Update root `CHANGELOG.md` with consolidated history
8. Move obsolete docs to `docs/archive/`
9. Delete redundant root-level files

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Breaking file paths in shell scripts and test.sh | Search all shell scripts for `node scripts/*.js` calls and update paths. Also update `test.sh` file checks. |
| Breaking webhook server startup | Keep `scripts/server/index.js` as entry; update PM2 config |
| Losing information from archived docs | Archive only, never delete docs content |
| Test failures during migration | Run tests after each module extraction |

---

## Approval

Please review this plan and confirm:
1. **Script grouping** - Are the 6 groups (parsing, database, analysis, reporting, server, pipeline) logical?
2. **Docs consolidation** - Agree with keeping 5 active docs + archive?
3. **Test coverage** - 80+ tests targeting ~34 functions sufficient?
4. **Execution order** - Scripts first, then tests, then docs?

Once approved, I will execute all three phases.
