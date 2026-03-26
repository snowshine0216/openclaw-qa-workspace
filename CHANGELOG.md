# Changelog

All notable repository-level changes are tracked in this file.

This repository uses a four-part version in [`VERSION`](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/VERSION): `MAJOR.MINOR.PATCH.MICRO`.

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
