# Changelog

All notable repository-level changes are tracked in this file.

This repository uses a four-part version in [`VERSION`](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/VERSION): `MAJOR.MINOR.PATCH.MICRO`.

## [0.1.3.0] - 2026-03-26

### Fixed
- **defects-analysis: JQL query now captures all linked defects** — Replaced `text ~ "FEATURE_KEY"` with `issue in linkedIssues("X") OR parent = "X" OR "Parent Link" = "X"`, fixing missing defects (e.g. BCIN-150 case)
- **defects-analysis: False "Image Handling" classification** — Added `stripAdfArtifacts()` to remove ADF attachment filenames from description text before keyword matching; BCIN-7775 ("Discrepancy between Webstation and Workstation") no longer misclassified
- **defects-analysis: Area table inflated high-priority counts** — `groupByArea()` now only counts high-priority defects that are open; closed high-priority defects no longer inflate the "high" column

### Added
- **defects-analysis: Data-driven sections 8–10** — Section 8 now lists specific open defect keys per area; Section 9 calls `buildEnvRecommendations()` with open count and feature key; Section 10 generates per-defect `- [ ] KEY` checkboxes for all open high-priority and blocking defects
- **defects-analysis: Test suite for `derive_functional_area.mjs`** — New `derive_functional_area.test.js` with 18 cases covering ADF artifact stripping, keyword classification, explicit area precedence, and all AREA_RULES
- **defects-analysis: New tests for `generate_feature_report.mjs` and `phase2.sh`** — 5 additional test cases covering `groupByArea` high-count gating, section 8 key emission, section 9 open count, section 10 checkboxes, and JQL linkedIssues clause

### Added

- Added a descendant-activity pruning regression test for `qa-plan-evolution` so active runs are retained even when only nested artifacts change.
- Added split `ppt-agent` enrichment-plan draft docs for the reviewed Part 1 / Part 2 design.

### Changed

- Changed `qa-plan-evolution` run pruning to rank runs by the newest descendant artifact activity instead of top-level run directory mtime only.
- Changed `defects-analysis` manifest execution to fall back from `openclaw` to `codex` when local spawn runtime support is unavailable, with end-to-end scoped-release regression coverage.
- Expanded the skill-artifact-root extraction design and TODO backlog with the newly identified follow-up work.

## [0.1.1.0] - 2026-03-26

### Added

- Added scoped release run support in `defects-analysis` with `qa_owner` filters, scope-aware run keys, and release scope query metadata artifacts.
- Added pruning support for `qa-plan-evolution` run directories with dedicated script and test coverage.
- Added benchmark skill-path contract utilities and test coverage in `qa-plan-orchestrator`.

### Changed

- Expanded `defects-analysis` release/feature report generation and classification/test contracts, including stronger CLI/input validation behavior.
- Updated `qa-plan-orchestrator` benchmark prompts, execution selection, and grading harness behavior with aligned tests.
- Updated `ppt-agent` docs and references, and moved legacy design artifacts to archive paths.

### Removed

- Removed outdated top-level PPT agent design/review markdown/json artifacts from `docs/` now superseded by archived and in-skill sources.

## [0.1.0.0] - 2026-03-26

### Added

- Established canonical root release metadata files for repository shipping and release tracking.

### Changed

- Standardized repository release metadata ownership in the root so automated shipping and review workflows use one canonical convention.
