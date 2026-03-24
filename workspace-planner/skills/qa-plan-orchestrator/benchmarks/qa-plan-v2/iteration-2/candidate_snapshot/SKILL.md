---
name: qa-plan-orchestrator
description: Master orchestrator for script-driven feature QA planning. The orchestrator only calls phase scripts, interacts with the user, and spawns from phase manifests.
---

# Feature QA Planning Orchestrator

This skill now follows a fully script-driven workflow.

The orchestrator has exactly three responsibilities:

1. Call `phaseN.sh`
2. Interact with the user when the workflow requires approval or a `REPORT_STATE` choice
3. Spawn subagents from `phaseN_spawn_manifest.json`, wait for completion, then call `phaseN.sh --post`

The orchestrator does not perform phase logic inline. It does not write artifacts, run validators directly, or make per-phase decisions outside the script contract.

Support context and deep research are now first-class runtime inputs:

- feature requests may include `supporting_issue_keys` that must stay in `context_only_no_defect_analysis` mode
- support issue summaries, relation maps, and request-fulfillment artifacts must be persisted under `context/`
- report-editor deep research must run `tavily-search` first and use `confluence` only as a recorded fallback

## Required References

Always read:

- `reference.md`
- `references/phase4a-contract.md`
- `references/phase4b-contract.md`
- `references/context-coverage-contract.md`
- `references/review-rubric-phase5a.md`
- `references/review-rubric-phase5b.md`
- `references/review-rubric-phase6.md`
- `references/e2e-coverage-rules.md`
- `references/subagent-quick-checklist.md`

## Runtime Layout

All artifacts for a run live under `<skill-root>/runs/<feature-id>/` (skill-root is derived from script location):

```text
<skill-root>/runs/<feature-id>/
  context/
  drafts/
  task.json
  run.json
  phase1_spawn_manifest.json
  phase3_spawn_manifest.json
  phase4a_spawn_manifest.json
  phase4b_spawn_manifest.json
  phase5a_spawn_manifest.json
  phase5b_spawn_manifest.json
  phase6_spawn_manifest.json
  qa_plan_final.md
```

## Orchestrator Loop

For each phase:

1. Run `scripts/phaseN.sh <feature-id> <run-dir>`
2. If stdout includes `SPAWN_MANIFEST: <path>`:
   - read `<path>`
   - spawn every `requests[].openclaw.args` (pass args as-is; do **not** add `streamTo` — it is only supported for `runtime: "acp"`, not for `runtime: "subagent"`)
   - wait for all spawned agents to finish
   - for Phase 1 only: run `scripts/record_spawn_completion.sh phase1 <feature-id> <run-dir>` to record completed spawns into `run.json.spawn_history`
   - run `scripts/phaseN.sh <feature-id> <run-dir> --post`
3. If the script exits non-zero, stop immediately

## Spawn Task Reference Instructions

Each spawn manifest embeds phase-specific "Required references" in the task text. Subagents are explicitly told which files to read and how to use them. The orchestrator does not pass references as attachments; the task text includes absolute paths and usage hints.

See `README.md` for the phase-to-reference mapping table.

## Phase Contract

### Phase 0

- Entry: `scripts/phase0.sh`
- Work: initialize runtime state, check requested source access, classify `REPORT_STATE`, normalize request materials/requirements/commands, and lock support/research policy
- Output:
  - `context/runtime_setup_<feature-id>.md`
  - `context/runtime_setup_<feature-id>.json`
  - `context/supporting_issue_request_<feature-id>.md`
  - `context/request_fulfillment_<feature-id>.md`
  - `context/request_fulfillment_<feature-id>.json`
- User interaction: when `REPORT_STATE` is `FINAL_EXISTS`, `DRAFT_EXISTS`, or `CONTEXT_ONLY`, present options (full_regenerate, smart_refresh, reuse). After user chooses, run `scripts/apply_user_choice.sh <mode> <feature-id> <run-dir>`. Then: full_regenerate → run phase0; smart_refresh → run phase2; reuse → continue from current phase.

### Phase 1

- Entry: `scripts/phase1.sh`
- Work: generate one spawn request per requested source family plus support-only Jira digestion requests when provided
- Output: `phase1_spawn_manifest.json`
- Contract note: supporting issue summaries must explicitly state the issues remain `context_only_no_defect_analysis` context evidence and are never defect-analysis triggers.
- `--post`: validate spawn policy, evidence completeness, support relation map, support summaries, and non-defect routing. If validation fails, the script exits `2` and prints `REMEDIATION_REQUIRED: <source_family>`

### Phase 2

- Entry: `scripts/phase2.sh`
- Work: scan `context/` and build `context/artifact_lookup_<feature-id>.md` with support/deep-research/request-trace metadata
- No spawn

### Phase 3

- Entry: `scripts/phase3.sh`
- Work: spawn Tavily-first deep-research requests for required topics and use the resulting artifacts to drive coverage mapping; when a knowledge pack is active, index pack rows via `@tobilu/qmd` BM25 (collection created at runtime, no manual `qmd collection add` required)
- Output: `phase3_spawn_manifest.json`
- Contract note: the written research artifacts must explicitly record Tavily-first ordering, and any Confluence usage must be framed as fallback-only with a recorded insufficiency reason.
- `--post`: validate `context/coverage_ledger_<feature-id>.md`, Tavily-first research artifacts, optional Confluence fallback ordering, synthesis output, and sync the artifact lookup

### Phase 4a

- Entry: `scripts/phase4a.sh`
- Work: spawn the subcategory-draft writer
- Output: `phase4a_spawn_manifest.json`
- `--post`: validate `drafts/qa_plan_phase4a_r<round>.md`

### Phase 4b

- Entry: `scripts/phase4b.sh`
- Work: spawn the canonical top-layer grouper
- Output: `phase4b_spawn_manifest.json`
- Notes: preserve scenario granularity, allow one bounded supplemental research pass only when grouping evidence is insufficient, and leave few-shot cleanup to Phase 6
- `--post`: require `drafts/qa_plan_phase4b_r<round>.md` plus round progression, coverage preservation against the Phase 4a input draft, canonical layering, hierarchy, E2E minimum, and executable-step validators pass

### Phase 5a

- Entry: `scripts/phase5a.sh`
- Work: spawn a full-context review + refactor pass
- Output: `phase5a_spawn_manifest.json`
- Notes: allow one bounded supplemental research pass only after prerequisites exist; successful rounds rewrite `artifact_lookup_<feature-id>.md`; Phase 5a audits round integrity and coverage preservation; `review_delta` must end with `accept` or `return phase5a`
- `--post`: require:
  - `context/review_notes_<feature-id>.md`
  - `context/review_delta_<feature-id>.md`
  - `drafts/qa_plan_phase5a_r<round>.md`
  - context coverage audit, Coverage Preservation Audit, round progression, Phase 5a acceptance gate, and section review checklist validators pass

### Phase 5b

- Entry: `scripts/phase5b.sh`
- Work: spawn the shipment-checkpoint review + refactor pass
- Output: `phase5b_spawn_manifest.json`
- Notes: allow one bounded supplemental research pass only after prerequisites exist; successful rounds rewrite `artifact_lookup_<feature-id>.md`; `checkpoint_delta` must end with `accept`, `return phase5a`, or `return phase5b`
- `--post`: require checkpoint audit, checkpoint delta, `drafts/qa_plan_phase5b_r<round>.md`, round progression, and reviewed-coverage-preservation validation against the Phase 5a input draft

### Phase 6

- Entry: `scripts/phase6.sh`
- Work: spawn the final layering/search/few-shots quality pass
- Output: `phase6_spawn_manifest.json`
- `--post`: require `drafts/qa_plan_phase6_r<round>.md`, `context/quality_delta_<feature-id>.md`, and final layering validators

### Phase 7

- Entry: `scripts/phase7.sh`
- Work: archive any existing final plan, promote the best available draft, write the finalization record, use `scripts/lib/finalPlanSummary.mjs` to generate `context/final_plan_summary_<feature-id>.md` from `qa_plan_final.md`, then attempt Feishu notification. The summary provides scenario counts, P1/P2 split, and section distribution for Feishu and audit.
- User interaction: explicit approval before running the script

## QA Plan Format

All drafts are valid XMindMark.

Rules:

- No `Setup:` sections
- No legacy `Action:` / `Expected:` labels
- Action steps are nested atomic bullet points
- Expected outcomes are deeper nested observable bullet leaves
- Optional notes use HTML comments
- The plan begins with a central topic line

Use `templates/qa-plan-template.md` as the required scaffold.
