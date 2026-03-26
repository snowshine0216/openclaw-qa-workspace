<!-- /autoplan restore point: /Users/xuyin/.gstack/projects/snowshine0216-openclaw-qa-workspace/evolve-autoplan-restore-20260325-162747.md -->
# Consolidated Implementation Plan: Defects Analysis Report Richness Recovery and Release Fan-Out

Generated on 2026-03-25
Branch: `evolve`
Repo: `snowshine0216/openclaw-qa-workspace`
Status: APPROVED FOR IMPLEMENTATION

## Overview

The `workspace-reporter/skills/defects-analysis` skill has two linked regressions:

1. Feature reports regressed from decision-ready analysis to a generic 12-section shell.
2. Release-version input produces one monolithic report instead of one overall release report plus one folder per feature.

This plan consolidates the original design and deferred TODOs into one implementation-ready document. It favors the smallest correct architecture that fixes both regressions and is safe to land in one change set.

## Goal

Restore rich feature reporting, make release runs fan out into per-feature packets, and harden the quality gate so shallow output cannot silently pass again.

## Locked Defaults

These decisions are locked for the first landing so the implementer does not need to reopen design questions mid-flight.

1. `runs/<feature_key>/` remains the canonical feature run root.
2. `runs/release_<version>/` becomes a parent coordinator run, not a second canonical analysis root.
3. Release child execution is sequential in the first landing.
4. Release runs stay fail-fast in the first landing. Partial-output mode is deferred.
5. Release packets contain only:
   - final report
   - `feature_summary.json`
   - `packet_manifest.json`
6. `generate_report.mjs` stays for one transition as a thin dispatcher, then can be deleted in a follow-up.
7. `feature_summary.json` must align with the existing normalized summary concepts in `workspace-reporter/skills/qa-summary/scripts/lib/buildDefectSummary.mjs` where practical. Any intentional schema difference must be documented in `reference.md`.

## Problem Summary

## 1. Report richness regressed

Observed behavior:

- `runs/BCIN-976/BCIN-976_REPORT_FINAL.md` is mostly a generic shell.
- `runs/BCIN-7289/BCIN-7289_REPORT_FINAL.md` shows the expected quality bar: feature framing, functional grouping, explicit risk callouts, PR-aware analysis, and a real release recommendation.

Current root causes:

- `workspace-reporter/skills/defects-analysis/scripts/lib/generate_report.mjs` renders mostly from `context/jira_raw.json`.
- It ignores richer existing artifacts such as:
  - `context/defect_index.json`
  - `context/jira_issues/*.json`
  - `context/pr_impact_summary.json`
  - `context/prs/*_impact.md`
- `workspace-reporter/skills/report-quality-reviewer/scripts/review.mjs` only validates section headings, not report quality.

## 2. Release output shape is wrong

Observed behavior:

- `runs/release_26.04/` contains one giant aggregated report and one giant context bundle.

Required behavior:

- one overall release report
- one folder per feature
- traceable links between the release report and feature packets

Current root causes:

- `phase1.sh` expands features but assigns every feature `FRESH/proceed`.
- Later phases still treat the release as one flattened defect set.
- There is no first-class parent/child run model for release coordination.

## Target Outcome

After this work lands:

1. Single-feature runs generate rich feature reports from structured analysis inputs.
2. Release runs coordinate canonical child feature runs and materialize release-scoped feature packets under `runs/release_<version>/features/`.
3. The reviewer fails shallow reports even if all 12 headings exist.
4. Tests and evals block regressions in both content richness and release packet layout.

## Architecture

### Product Boundary

- Feature run = canonical analysis unit
- Release run = coordinator + aggregator + packet materializer

### Workflow

```text
release input
  -> runs/release_<version>/
    -> Phase 1: discover feature keys and compute per-feature state/action
    -> Phase 2: persist child-run plan
    -> Phase 3: execute or reuse canonical feature runs under runs/<feature_key>/
    -> Phase 4: collect feature summaries and materialize release packets
    -> Phase 5: generate overall release report and run review gate
```

### Runtime Layout

```text
workspace-reporter/skills/defects-analysis/runs/
  BCIN-7289/
    task.json
    run.json
    context/
      feature_metadata.json
      feature_summary.json
      defect_index.json
      pr_impact_summary.json
    BCIN-7289_REPORT_FINAL.md

  release_26.04/
    task.json
    run.json
    context/
      feature_state_matrix.json
      feature_runs.json
      release_summary_inputs.json
    features/
      BCIN-7289/
        packet_manifest.json
        BCIN-7289_REPORT_FINAL.md
        feature_summary.json
      BCIN-976/
        packet_manifest.json
        BCIN-976_REPORT_FINAL.md
        feature_summary.json
    release_26.04_REPORT_FINAL.md
```

## Contracts

## 1. Feature metadata

Create `runs/<feature_key>/context/feature_metadata.json`.

Required fields:

```json
{
  "feature_key": "BCIN-7289",
  "feature_title": "Embed Library Report Editor into the Workstation Report Authoring",
  "issue_type": "Feature",
  "release_version": "26.04"
}
```

Purpose:

- gives feature reports a real title and context
- keeps feature-vs-release rendering logic deterministic

## 2. Feature summary

Create `runs/<feature_key>/context/feature_summary.json`.

Minimum contract:

```json
{
  "feature_key": "BCIN-7289",
  "feature_title": "Embed Library Report Editor into the Workstation Report Authoring",
  "report_final_path": "workspace-reporter/skills/defects-analysis/runs/BCIN-7289/BCIN-7289_REPORT_FINAL.md",
  "risk_level": "HIGH",
  "total_defects": 26,
  "open_defects": 13,
  "open_high_defects": 5,
  "pr_count": 15,
  "repos_changed": ["web-dossier", "workstation-report-editor", "productstrings"],
  "top_risk_areas": [
    "Save / Save-As Flows",
    "Prompt Handling",
    "i18n / Localization"
  ],
  "blocking_defects": ["BCIN-7669", "BCIN-7727"],
  "generated_at": "2026-03-25T00:00:00Z"
}
```

Compatibility rule:

- Reuse field meanings already established by `workspace-reporter/skills/qa-summary/scripts/lib/buildDefectSummary.mjs` where possible.
- Any new release-only fields must be documented in `reference.md`.

## 3. Release feature matrix

Create or expand:

- `runs/release_<version>/context/feature_state_matrix.json`
- `runs/release_<version>/context/feature_runs.json`

Each matrix entry must include:

```json
{
  "feature_key": "BCIN-7289",
  "report_state": "FINAL_EXISTS",
  "default_action": "use_existing",
  "selected_action": "use_existing",
  "canonical_run_dir": "workspace-reporter/skills/defects-analysis/runs/BCIN-7289",
  "release_packet_dir": "workspace-reporter/skills/defects-analysis/runs/release_26.04/features/BCIN-7289"
}
```

## 4. Release packet manifest

Create `runs/release_<version>/features/<feature_key>/packet_manifest.json`.

Required fields:

- `feature_key`
- `source_run_dir`
- `copied_files`
- `materialized_at`

## Implementation Phases

## Phase 1. Add shared feature contracts and dispatcher split

### Goal

Prepare the data model and code boundaries so feature reports and release reports stop sharing one generic renderer.

### Files to change

- `workspace-reporter/skills/defects-analysis/scripts/lib/generate_report.mjs`
- `workspace-reporter/skills/defects-analysis/scripts/phase3.sh`
- `workspace-reporter/skills/defects-analysis/scripts/phase4.sh`
- `workspace-reporter/skills/defects-analysis/scripts/phase5.sh`

### Files to create

- `workspace-reporter/skills/defects-analysis/scripts/lib/extract_feature_metadata.mjs`
- `workspace-reporter/skills/defects-analysis/scripts/lib/build_feature_summary.mjs`
- `workspace-reporter/skills/defects-analysis/scripts/lib/generate_feature_report.mjs`
- `workspace-reporter/skills/defects-analysis/scripts/lib/generate_release_report.mjs`

### Required change

1. Keep `generate_report.mjs` only as a thin entrypoint that dispatches to:
   - `generate_feature_report.mjs`
   - `generate_release_report.mjs`
2. Phase 3 must write `feature_metadata.json`.
3. Phase 4 must ensure `pr_impact_summary.json` contains enough structure for real reporting:
   - `pr_count`
   - repo names
   - merged/open counts
   - top risky PRs
   - top changed files or domains
4. Phase 5 must generate `feature_summary.json` whenever the run is a canonical feature run.

### Validation

- unit tests can instantiate both generator paths without a shell wrapper
- `feature_summary.json` is produced for feature runs and not guessed from final markdown

## Phase 2. Restore rich feature reports

### Goal

Make feature reports render from structured analysis instead of raw Jira-only data.

### Files to change

- `workspace-reporter/skills/defects-analysis/scripts/phase5.sh`

### Files to create

- none beyond Phase 1

### Required change

`generate_feature_report.mjs` must consume:

- `context/feature_metadata.json`
- `context/defect_index.json`
- `context/pr_impact_summary.json`
- `context/prs/*_impact.md`

The feature report must include:

1. real feature title in the header
2. functional-area table or grouped analysis derived from `defect_index.json`
3. explicit list of open high-priority defects
4. repo-aware PR impact summaries
5. release recommendation tied to blocking defects and computed risk

### Acceptance details

- reports like `BCIN-976` no longer degrade into generic filler
- reports like `BCIN-7289` remain within the expected richness bar

### Validation

- `generate_feature_report.test.js` asserts:
  - feature title rendering
  - functional risk grouping
  - explicit high-risk defect callouts
  - repo names in code-change analysis
  - conclusion contains release recommendation

## Phase 3. Convert release runs into parent coordinators

### Goal

Stop treating a release as one giant feature. Use the release run to coordinate canonical child feature runs and materialize packets.

### Files to change

- `workspace-reporter/skills/defects-analysis/scripts/orchestrate.sh`
- `workspace-reporter/skills/defects-analysis/scripts/phase1.sh`
- `workspace-reporter/skills/defects-analysis/scripts/phase5.sh`

### Files to create

- `workspace-reporter/skills/defects-analysis/scripts/lib/compute_feature_run_plan.mjs`
- `workspace-reporter/skills/defects-analysis/scripts/lib/collect_feature_summaries.mjs`
- `workspace-reporter/skills/defects-analysis/scripts/lib/materialize_release_packets.mjs`

### Required change

1. `phase1.sh` must compute real per-feature state:
   - `FINAL_EXISTS`
   - `DRAFT_EXISTS`
   - `CONTEXT_ONLY`
   - `FRESH`
2. Default action mapping must be:
   - `FINAL_EXISTS -> use_existing`
   - `DRAFT_EXISTS -> resume`
   - `CONTEXT_ONLY -> generate_from_cache`
   - `FRESH -> proceed`
3. `orchestrate.sh` must execute release child features sequentially in the first landing.
4. After child completion, materialize:
   - copied final report
   - copied `feature_summary.json`
   - `packet_manifest.json`
5. `generate_release_report.mjs` must build the overall release report from collected `feature_summary.json` files, not from one flattened defect bundle.

### Release report contents

The release report must include:

1. release overview
2. feature ranking by risk
3. aggregate defect totals
4. blocking features
5. top cross-feature hotspots
6. links or explicit paths to feature packets

### Validation

- `compute_feature_run_plan.test.js` covers mixed-state mapping
- `materialize_release_packets.test.js` verifies packet directories and copied files
- integration coverage proves `features/<feature_key>/` is created for all discovered features

## Phase 4. Harden the reviewer gate

### Goal

Upgrade the review gate from heading existence checks to content-quality enforcement.

### Files to change

- `workspace-reporter/skills/report-quality-reviewer/SKILL.md`
- `workspace-reporter/skills/report-quality-reviewer/scripts/review.mjs`
- `workspace-reporter/skills/defects-analysis/scripts/phase5.sh`

### Files to create

- `workspace-reporter/skills/report-quality-reviewer/scripts/test/review.test.js`

### Required change

The reviewer must fail when any of the following are true:

1. core sections still contain generic placeholder text
2. `feature_title` is missing for a feature report
3. functional-area analysis is empty despite existing defects
4. open high-priority defects exist but there is no explicit blocking callout
5. PRs exist but Code Change Analysis only points to `context/prs/` without synthesis
6. a release report exists but no per-feature packets were produced

### Auto-fix policy

- auto-fix is allowed for deterministic formatting repairs only
- missing analytical content is a hard fail

### Validation

- reviewer test cases cover:
  - fail on generic filler text
  - pass on rich feature report
  - fail on release report missing feature packet links

## Phase 5. Tests, evals, and documentation

### Goal

Lock the new behavior with automated coverage and update the skill contracts.

### Files to change

- `workspace-reporter/skills/defects-analysis/scripts/test/generate_report.test.js`
- `workspace-reporter/skills/defects-analysis/scripts/test/phase1.test.js`
- `workspace-reporter/skills/defects-analysis/scripts/test/orchestrate.integration.test.js`
- `workspace-reporter/skills/defects-analysis/scripts/test/phase5.test.js`
- `workspace-reporter/skills/defects-analysis/evals/evals.json`
- `workspace-reporter/skills/defects-analysis/evals/README.md`
- `workspace-reporter/skills/defects-analysis/SKILL.md`
- `workspace-reporter/skills/defects-analysis/reference.md`

### Files to create

- `workspace-reporter/skills/defects-analysis/scripts/test/generate_feature_report.test.js`
- `workspace-reporter/skills/defects-analysis/scripts/test/generate_release_report.test.js`
- `workspace-reporter/skills/defects-analysis/scripts/test/compute_feature_run_plan.test.js`
- `workspace-reporter/skills/defects-analysis/scripts/test/materialize_release_packets.test.js`

### Required change

#### Script tests

- Retire or rewrite `generate_report.test.js` so it validates dispatcher behavior instead of old monolithic rendering.
- `phase1.test.js` must assert real mixed state mapping for release runs.
- `orchestrate.integration.test.js` must cover release mode with child feature outputs.
- `phase5.test.js` must verify that shallow boilerplate output cannot be promoted to final.

#### Evals

Add or rewrite these evals:

1. Feature richness parity
2. Generic fallback rejection
3. Release fan-out
4. Reuse behavior with mixed feature states
5. Reviewer regression guard

#### Documentation

Update `SKILL.md` and `reference.md` to document:

- feature-report vs release-report split
- release parent/child coordination model
- `feature_summary.json` contract
- release packet directory layout
- reviewer failure conditions

### Validation commands

- `node --test workspace-reporter/skills/defects-analysis/scripts/test/*.test.js`
- `node --test workspace-reporter/skills/report-quality-reviewer/scripts/test/*.test.js`

## Detailed Landing Order

Use this order to minimize churn and keep the repo runnable between commits:

1. Add feature metadata and summary builders plus generator dispatcher split.
2. Update feature report rendering and its unit tests.
3. Add release run planning, child-run collection, and packet materialization.
4. Update release integration tests.
5. Upgrade reviewer logic and reviewer tests.
6. Update evals and written contracts.

## Suggested PR Slices

If this lands across multiple commits or PR-sized checkpoints, use these slices.

### Slice 1. Generator split and feature contracts

Change:

- add `extract_feature_metadata.mjs`
- add `build_feature_summary.mjs`
- split `generate_report.mjs` into dispatcher + feature/release renderers
- update Phase 3 and Phase 5 to persist `feature_metadata.json` and `feature_summary.json`

Validation:

- `node --test workspace-reporter/skills/defects-analysis/scripts/test/generate_report.test.js`
- `node --test workspace-reporter/skills/defects-analysis/scripts/test/generate_feature_report.test.js`

### Slice 2. Rich feature report output

Change:

- make `generate_feature_report.mjs` consume structured inputs
- enrich `pr_impact_summary.json` generation in Phase 4
- update Phase 5 promotion logic for feature runs

Validation:

- `node --test workspace-reporter/skills/defects-analysis/scripts/test/phase4.test.js`
- `node --test workspace-reporter/skills/defects-analysis/scripts/test/phase5.test.js`

### Slice 3. Release parent/child coordination

Change:

- add `compute_feature_run_plan.mjs`
- update `phase1.sh` mixed-state mapping
- update `orchestrate.sh` to run child features sequentially
- add `collect_feature_summaries.mjs` and `materialize_release_packets.mjs`
- generate overall release report from feature summaries

Validation:

- `node --test workspace-reporter/skills/defects-analysis/scripts/test/phase1.test.js`
- `node --test workspace-reporter/skills/defects-analysis/scripts/test/compute_feature_run_plan.test.js`
- `node --test workspace-reporter/skills/defects-analysis/scripts/test/materialize_release_packets.test.js`
- `node --test workspace-reporter/skills/defects-analysis/scripts/test/orchestrate.integration.test.js`

### Slice 4. Reviewer hardening

Change:

- expand `report-quality-reviewer/scripts/review.mjs`
- wire reviewer failure conditions into Phase 5
- add reviewer tests

Validation:

- `node --test workspace-reporter/skills/report-quality-reviewer/scripts/test/*.test.js`
- `node --test workspace-reporter/skills/defects-analysis/scripts/test/phase5.test.js`

### Slice 5. Evals and contract docs

Change:

- update `evals/evals.json`
- update `evals/README.md`
- update `SKILL.md`
- update `reference.md`

Validation:

- run the updated defects-analysis eval suite
- confirm the documented artifact layout matches the generated run structure

## Deferred Until After First Correct Landing

These items came from `TODOS.md` and stay intentionally out of the first implementation unless something blocks correctness.

1. Add explicit partial-output mode for release parent runs instead of fail-fast behavior.
2. Evaluate bounded batching or parallel child-run execution once sequential correctness is stable.
3. Revisit whether release packets should copy richer evidence bundles beyond report, summary, and manifest.
4. Plan downstream consumer updates if the release packet layout becomes a shared contract outside `defects-analysis`.
5. Remove the temporary `generate_report.mjs` dispatcher after the split has stabilized.

## Acceptance Criteria

The implementation is complete only when all of the following are true:

1. A `BCIN-976`-style fixture produces a report with real analytical content.
2. A release run such as `26.04` produces:
   - one overall release report
   - one packet directory per feature under `features/`
3. The reviewer fails a shallow 12-heading report.
4. Script tests pass.
5. Reviewer tests pass.
6. Updated evals pass.

## Implementation Checklist

- [ ] Add `feature_metadata.json` generation.
- [ ] Add `feature_summary.json` generation and document its contract.
- [ ] Split feature and release rendering paths.
- [ ] Enrich PR summary inputs for reporting.
- [ ] Compute real release per-feature state and action.
- [ ] Reuse or run canonical child feature runs from the release parent.
- [ ] Materialize release packet folders.
- [ ] Generate overall release report from feature summaries.
- [ ] Upgrade reviewer pass/fail logic.
- [ ] Add unit, integration, and reviewer tests.
- [ ] Update evals and docs.

## References

- `workspace-reporter/skills/defects-analysis/scripts/lib/generate_report.mjs`
- `workspace-reporter/skills/defects-analysis/scripts/phase1.sh`
- `workspace-reporter/skills/defects-analysis/scripts/phase3.sh`
- `workspace-reporter/skills/defects-analysis/scripts/phase4.sh`
- `workspace-reporter/skills/defects-analysis/scripts/phase5.sh`
- `workspace-reporter/skills/report-quality-reviewer/scripts/review.mjs`
- `workspace-reporter/skills/qa-summary/scripts/lib/buildDefectSummary.mjs`
