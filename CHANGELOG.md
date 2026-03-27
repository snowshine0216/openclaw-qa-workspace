# Changelog

All notable repository-level changes are tracked in this file.

This repository uses a four-part version in [`VERSION`](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/VERSION): `MAJOR.MINOR.PATCH.MICRO`.

## [0.1.11.0] - 2026-03-27

### Added
- **Section 12 "Known Limitations" in `qa-summary` skill** — QA summaries now include a 12th section populated from `## Known Limitations` / `## Known Issues` headings in the QA plan, or from planner `outOfScopeLines`. Implemented in new `extractKnownLimitations.mjs` pure extraction module, `buildSummaryDraft.mjs`, and `phase1.mjs` (saves `context/known_limitations_seed.json` as a new intermediate artifact).
- **`extractKnownLimitations.mjs`** — new pure function `extractKnownLimitationsSeed(markdown, outOfScopeLines)` that scans QA plan markdown for Known Limitations headings, collects bullet items, strips `<P1>/<P2>` priority markers, and deduplicates case-insensitively. 10 unit tests.

### Changed
- **Rubric files synced to 12-section structure** — `summary-generation-rubric.md`, `summary-review-rubric.md`, and `summary-formatting.md` updated to reflect all 12 sections (Background & Solution section was in code but missing from rubrics; Known Limitations section is new). Review rubric now covers criteria C1–C12 (was C1–C10).
- **LLM spawn manifest prompts updated** — `build_summary_draft_spawn_manifest.mjs` now lists `known_limitations_seed.json` as a source artifact, references "all 12 numbered sections", and instructs the LLM subagent to self-review against C1–C12.
- **Canonical path resolution in `resolvePlannerArtifact.mjs`** — all `join()` calls replaced with `resolve()` for normalized absolute paths; added explicit null guard for `plannerRunRoot` (throws instead of crashing at `.startsWith()`).

### Fixed
- **BLOCKED message now includes expected path and recovery instructions** — when Phase 1 cannot find a QA plan for a feature key, the error now prints `Expected path: <path>` and instructs the user to run `qa-plan-orchestrator` or set `planner_plan_path`.
- **Known Limitations extraction uses raw plan markdown** — previously passed filtered `bgSeed.outOfScopeText` (which EXCLUSION_PATTERN had stripped of affirmative limitation text like "i18n deferred to Q3") to the extractor. Now passes raw plan markdown directly.

## [0.1.10.0] - 2026-03-27

### Added
- **`buildSlideFromStructuredSpec()` in `build-pptx-from-handoff.js`** — new function that takes a normalized structured spec (output of `buildStructuredSlideSpec()`) and renders a deterministic single-slide PPTX package via the shared `createDeckFromSpec` renderer. Supports dependency injection via `createDeckFromSpecImpl` for unit testing.
- **`executeStructuredRebuilds()` in `build-pptx-from-handoff.js`** — async orchestrator that processes all `structured_rebuild` jobs with `status: "planned"` from the edit handoff, renders each to its `artifact_path`, determines `replace_existing` vs `insert_after` action kind from the original slide index, calls `mergeRebuiltSlide()` to splice the rebuilt slide into the working unpacked deck, and returns updated jobs with `status: "applied"`. Fail-closed: throws immediately on any render or merge failure.
- **`build-pptx-structured-rebuild.test.js`** — 10 new TDD tests covering all paths for `buildSlideFromStructuredSpec` and `executeStructuredRebuilds`: happy path, image propagation, input validation, insert_after vs replace_existing, skip non-rebuild jobs, fail-closed on render failure, multi-job ordering.
- **Python environment documentation in `CLAUDE.md`** — added "Python Environment" section documenting `.venv` location (`repo-root/.venv`), `uv` package manager, `markitdown` CLI path, and shell invocation pattern.
- **new async job regression coverage** — added tests for per-phase spawn-results isolation, manifest-specific result writing, and legacy-job resume compatibility in `asyncJobStore.test.mjs` and `manifestRunner.test.mjs`.

### Fixed
- **qa-plan-evolution async job result files are now manifest-scoped** — `asyncJobStore.mjs` and `manifestRunner.mjs` now derive per-manifest result files like `phase3_spawn_results.json` and `phase4_spawn_results.json`, preventing later phases in the same iteration from inheriting stale failure state from earlier phases.
- **legacy in-flight qa-plan-evolution jobs remain resumable after the result-path change** — `refreshJobs()` now accepts the persisted legacy `spawn_results.json` path or the new manifest-derived path, so older queued/running jobs do not get stranded during upgrade.
- **33 pre-existing test failures in ppt-agent test suite** — three root causes resolved: (1) `node_modules` empty in git worktree; `npm install` now required after worktree creation; (2) `spawnSync("node", ...)` fails when `node` is not in `PATH`; fixed to `spawnSync(process.execPath, ...)` in `build-pptx-from-handoff.test.js`, `evaluate-run.test.js`, `finalize-edit-run.test.js`, and `helper-cli-contract.test.js`; (3) design doc moved to `docs/archive/ppt-agent/` but 3 test files still referenced `docs/PPT_AGENT_SKILL_DESIGN.md`; paths updated in `evaluation-failure-paths.test.js`, `style-contract.test.js`, and `ppteval-rubric.test.js`.
- **`.venv` not found in worktree** — `findRepoRoot()` resolves to worktree root (via `AGENTS.md` marker) but `.venv` lives at main repo root; added symlink `.venv → /Users/xuyin/Documents/Repository/openclaw-qa-workspace/.venv` in worktree root.

### Changed
- **`apply-edit-run.js` main()** — converted from sync to async; after `applyEditRun()` returns, checks for pending `structured_rebuild` jobs and calls `executeStructuredRebuilds()`; writes updated job statuses back to `edit_handoff.json` on disk before emitting result to stdout.

## [0.1.9.0] - 2026-03-27

### Added
- **`structured-slide-spec.js`** — new `ppt-agent` module that converts a canonical slide brief to a normalized structured slide spec with layout mapping, body content, and design token resolution. Supports 10 composition families (PROCESS_FLOW, COMPARISON_MATRIX, TABLE_SUMMARY, EVIDENCE_PANEL, TITLE_HERO, SECTION_DIVIDER, CHECKLIST_CARDS, QA_TWO_COLUMN, TEXT_STATEMENT, CLOSING_STATEMENT) with fallback to `two_column` for unrecognized families.
- **`structured_rebuild` action type in `edit-handoff.js`** — `applyAction()` now dispatches `structured_rebuild` actions to `applyStructuredRebuildAction()`, which loads the canonical slide brief and source-theme-snapshot.json, builds a structured slide spec, and returns a planned job with `artifact_path` and `structured_spec` for downstream renderer wiring.
- **`merge-back.js` explicit step-function exports** — refactored from a single opaque orchestrator to six individually-exported, independently-testable functions: `extractSlidePackage`, `allocateNonConflictingIds`, `updatePresentationXml`, `updateContentTypes`, `copyMediaDependencies`, `validateNeighboringSlides`, plus the `mergeRebuiltSlide` orchestrator.
- **48 new tests** across 3 files: `merge-back.test.js` (22 unit tests), expanded `structured-slide-spec.test.js` (+13 tests), and `workflow-edit-structured-rebuild-e2e.test.js` (10 E2E tests) covering all 4 critical fail-closed paths (ID collision, missing Content_Types.xml, broken presentation order, neighbor drift).

### Changed
- **`update-plan.js` ACTIONS set** — added `structured_rebuild` so plans using this action type pass validation before reaching `applyAction`.
- **`structured-slide-spec.js` design token resolution** — uses `??` (nullish coalescing) instead of `||` for theme token fallback so explicitly set empty-string tokens are not silently overridden; default color tokens now uniformly include `#` prefix.
- **`structured-slide-spec.js` source_brief** — returned as a shallow copy instead of a direct reference, following project immutability rules.

## [0.1.8.0] - 2026-03-27

### Added
- **`qa-summary` Phase 2 now uses LLM-driven defect-summary subagent** — replaces `buildDefectSummary.mjs` with a two-step spawn pattern tracked via `task.phase2_step`: (1) spawn `defects-analysis` when needed, (2) spawn a defect-summary subagent that reads raw Jira/PR artifacts and writes `context/defect_summary.json` or `context/no_defects.json`.
- **`qa-summary` Phase 3 now uses LLM-driven draft generation with exit gate** — replaces `buildSummaryDraft.mjs` with a spawn-manifest pattern: `phase3.sh` emits `phase3_spawn_manifest.json`; the subagent reads planner/defect context against `summary-generation-rubric.md`, self-reviews against `summary-review-rubric.md`, writes verdict to `context/phase3_review_delta.md`; retry loop up to 3 rounds.
- **`qa-summary` Phase 4 now uses internal LLM review subagent** — removes dependency on `qa-summary-review` skill and `applyReviewRefactor.mjs`; replaced with `phase4_spawn_manifest.json` driving a review subagent that applies structural fixes in-place and writes `context/phase4_review_delta.md`; retry loop up to 3 rounds.
- **new `references/summary-generation-rubric.md`** — 10-section hard constraints for the Phase 3 draft-generation subagent (tables, bullets, placeholder policy, prohibited filler).
- **new `references/summary-review-rubric.md`** — 10 self-review criteria (C1–C10) covering sections, tables, defect counts, and filler detection; used by both Phase 3 and Phase 4 subagents.
- **new `scripts/lib/build_defect_summary_spawn_manifest.mjs`** — reads defects-analysis run dir artifacts and builds a spawn manifest instructing the LLM to produce `defect_summary.json`.
- **new `scripts/lib/build_summary_draft_spawn_manifest.mjs`** — builds Phase 3 spawn manifest for LLM draft generation + self-review; includes prior review notes on retry rounds.
- **new `scripts/lib/build_summary_review_spawn_manifest.mjs`** — builds Phase 4 spawn manifest for internal review subagent; replaces the `qa-summary-review` external skill spawn.
- **new `scripts/lib/validate_summary_review.mjs`** — shared verdict parser for Phase 3 and Phase 4; parameterized by phase name; `accept` clears `return_to_phase`; `return phaseN` increments round counter.

### Changed
- **`scripts/phase3.sh` now passes `--post` flag** — added `MODE` variable and `${MODE:+"$MODE"}` passthrough to `phase3.mjs`.
- **`SKILL.md` updated** — removed `qa-summary-review` and `report-quality-reviewer` from skill reuse list; updated Phase 2/3/4 descriptions to reflect LLM-driven spawn pattern; added `summary-generation-rubric.md` and `summary-review-rubric.md` to Required References.

### Removed
- `buildDefectSummary.mjs`, `buildSummaryDraft.mjs`, `applyReviewRefactor.mjs`, `generateSummaryDraftArtifacts.mjs` are retired (kept in place but no longer called).
- Dependency on `qa-summary-review` skill removed from Phase 4.
- Dependency on `report-quality-reviewer` removed.

## [0.1.7.1] - 2026-03-27

### Fixed
- **defects-analysis: Priority Breakdown, Defect Breakdown by Status, and Defect Analysis by Priority sections always showed zero counts** — `buildRawDefectFacts` in `build_report_spawn_manifest.mjs` read `jiraRaw.issues` (Jira API format) but `defect_index.json` stores normalized defects under `jiraRaw.defects` with flat fields. The empty defect table caused the LLM to correctly generate all-zero placeholders. Now detects both formats: `{ defects: [...] }` and `{ issues: [...] }`.
- **defects-analysis review rubric C2 now rejects all-zero placeholder tables** — previously "Table present with data rows" was vacuously satisfied by zero-value rows. Updated to require at least one row with a non-zero Total or Open count when defects were provided in the task input.

### Added
- **Two new unit tests for `buildRawDefectFacts`** — covers `defect_index.json` format (flat `defects` array) and the empty-object edge case (neither `issues` nor `defects` property).

## [0.1.7.0] - 2026-03-27

### Added
- **defects-analysis Phase 5 now uses LLM-driven subagent spawn** — `phase5.sh` replaced static script-driven report generation and broken review loop with a spawn manifest pattern: pre-spawn builds `phase5_spawn_manifest.json` via `build_report_spawn_manifest.mjs`; SKILL.md orchestrator spawns the subagent; post-phase validates `context/report_review_delta.md` via `validate_report_review.mjs`.
- **new `build_report_spawn_manifest.mjs`** — reads `jira_raw.json`, `pr_impact_summary.json`, and `task.json` to emit tabular raw facts (defects + PRs) and instruct the subagent via `references/report-generation-rubric.md` and `references/report-review-rubric.md`. On round > 1, includes path to prior `context/report_review_notes.md`.
- **new `validate_report_review.mjs`** — parses `context/report_review_delta.md` verdict; `accept` clears `return_to_phase`; `return phase5` increments `phase5_round` and sets `return_to_phase: "phase5"` for orchestrator loop; exits 1 on missing/invalid delta.
- **new `references/report-generation-rubric.md`** — 12-section quality spec and data contract for the subagent report generator.
- **new `references/report-review-rubric.md`** — 12 self-review criteria (C1–C12) with pass/fail rules; subagent writes `context/report_review_notes.md` and `context/report_review_delta.md`.
- **Phase 5 review loop contract in SKILL.md** — orchestrator reads `task.json` after `--post`; loops up to 3 rounds on `return_to_phase === "phase5"`; stops with error after 3 rounds.

### Changed
- **`report_bundle_validator.mjs` now checks `context/report_review_delta.md`** — replaced `_REVIEW_SUMMARY.md` + `## Review Result: pass` check with `context/report_review_delta.md` + `context/report_review_notes.md` existence and `- accept` verdict regex.
- **`phase5.sh` removes `report-quality-reviewer` dependency** — `REPORTER_SCRIPT`, `REVIEWER_SCRIPT`, `AUTO_FIX_SCRIPT` variables and the bash while loop are gone; replaced by `MANIFEST_SCRIPT` and `VALIDATE_SCRIPT` env-overridable variables.

## [0.1.6.0] - 2026-03-27

### Fixed
- **qa-plan benchmark comparison is now executed-only** — `qa-plan-evolution` Phase 4 now requires `run_iteration_compare.mjs`, hard-fails when executed compare is missing or errors, and rejects any non-`executed` benchmark scorecard at scoring time instead of silently degrading to synthetic output.
- **qa-plan benchmark scoring now enforces real scorecard fidelity** — `scoreBenchmarkV2` rejects unsupported scoring fidelity, and the promotion path no longer carries synthetic-only acceptance branches.
- **qa-plan evolution now seeds qa-plan benchmark runtime baseline state when missing** — Phase 1 creates the canonical runtime `history.json` and `champion_snapshot` under `workspace-artifacts` so replay/compare phases can start from a valid executed benchmark baseline.

### Changed
- **qa-plan benchmark and evolution docs now describe executed-only compare semantics** — active skill and benchmark docs no longer advertise synthetic fallback behavior.
- **executed benchmark regression coverage was tightened across both skills** — updated phase4/phase5/phase6 evolution tests plus qa-plan benchmark iteration/scorer tests now assert executed compare success or hard failure only.

### Removed
- **qa-plan synthetic structural compare implementation** — removed `publishIterationComparison.mjs` and the direct synthetic-compare benchmark tests that depended on it.
- **stale defects-analysis fix-plan note** — removed the obsolete reporter-side `workspace-reporter/skills/defects-analysis/docs/fix-plan.md` document.

## [0.1.5.0] - 2026-03-26

### Fixed
- **artifact-root runtime helpers now honor explicit repo roots through the shared contract** — shared artifact-root resolution now supports repo-root-aware run and benchmark runtime paths, and `qa-plan-evolution` resume/progress utilities continue to preserve `ARTIFACT_ROOT`, `REPO_ROOT`, and explicit run-dir overrides.
- **qa-plan-evolution now keeps qa-plan benchmark runtime state entirely under `workspace-artifacts`** — Phase 4 compare outputs, Phase 6 champion promotion, and replay-gap analysis now read source benchmark definitions from the skill tree while writing and reading live benchmark history, scorecards, and iteration snapshots from the canonical runtime root.
- **qa-plan-orchestrator benchmark/bootstrap path coverage now matches the runtime split** — benchmark runners, bootstrap argument builders, and runtime-env shell fixtures now forward benchmark definition roots explicitly and assert the `workspace-artifacts` output contract in both Node and shell regression tests.
- **artifact-root regression coverage is now complete and deterministic** — strengthened `qa-plan-evolution` and `qa-plan-orchestrator` tests now cover canonical artifact-root defaults, scratch/canonical resume behavior, runtime benchmark path updates, and deterministic fixture setup across temp workspaces.

## [0.1.3.1] - 2026-03-26

### Fixed
- **ppt-agent: documentation quality issues** — Fixed six documentation gaps: aligned `research.md` section names with actual `speaker-script.js` output, added four new Phase 2 fields (`composition_family`, `component_list`, `primary_visual_anchor`, `render_strategy`) to `docs/README.md` update-plan schema, removed resolved Tavily strategy open question, renamed duplicate SKILL.md heading, updated stale text-only-slides caveat, and added inline "reuse-first" definition

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
