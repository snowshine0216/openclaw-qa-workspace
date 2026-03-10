---
name: feature-qa-planning-orchestrator
description: Master orchestrator for script-driven feature QA planning. The orchestrator only calls phase scripts, interacts with the user, and spawns from phase manifests.
---

# Feature QA Planning Orchestrator

This skill now follows a fully script-driven workflow.

The orchestrator has exactly three responsibilities:

1. Call `phaseN.sh`
2. Interact with the user when the workflow requires approval or a `REPORT_STATE` choice
3. Spawn subagents from `phaseN_spawn_manifest.json`, wait for completion, then call `phaseN.sh --post`

The orchestrator does not perform phase logic inline. It does not write artifacts, run validators directly, or make per-phase decisions outside the script contract.

## Required References

Always read:

- `reference.md`
- `references/qa-plan-contract.md`
- `references/context-coverage-contract.md`
- `references/executable-step-rubric.md`
- `references/review-rubric.md`
- `references/e2e-coverage-rules.md`
- `templates/qa-plan-template.md`

## Runtime Layout

All artifacts for a run live under:

```text
projects/feature-plan/<feature-id>/
  context/
  drafts/
  task.json
  run.json
  phase1_spawn_manifest.json
  phase3_spawn_manifest.json
  phase4a_spawn_manifest.json
  phase4b_spawn_manifest.json
  phase5_spawn_manifest.json
  phase6_spawn_manifest.json
  qa_plan_final.md
```

## Orchestrator Loop

For each phase:

1. Run `scripts/phaseN.sh <feature-id> <project-dir>`
2. If stdout includes `SPAWN_MANIFEST: <path>`:
   - read `<path>`
   - spawn every `requests[].openclaw.args` (pass args as-is; do **not** add `streamTo` — it is only supported for `runtime: "acp"`, not for `runtime: "subagent"`)
   - wait for all spawned agents to finish
   - run `scripts/phaseN.sh <feature-id> <project-dir> --post`
3. If the script exits non-zero, stop immediately

## Spawn Task Reference Instructions

Each spawn manifest embeds phase-specific "Required references" in the task text. Subagents are explicitly told which files to read and how to use them. The orchestrator does not pass references as attachments; the task text includes absolute paths and usage hints.

See `README.md` for the phase-to-reference mapping table.

## Phase Contract

### Phase 0

- Entry: `scripts/phase0.sh`
- Work: initialize runtime state, check requested source access, classify `REPORT_STATE`
- Output:
  - `context/runtime_setup_<feature-id>.md`
  - `context/runtime_setup_<feature-id>.json`
- User interaction: when `REPORT_STATE` is `FINAL_EXISTS`, `DRAFT_EXISTS`, or `CONTEXT_ONLY`, present options (full_regenerate, smart_refresh, reuse). After user chooses, run `scripts/apply_user_choice.sh <mode> <feature-id> <project-dir>`. Then: full_regenerate → run phase0; smart_refresh → run phase2; reuse → continue from current phase.

### Phase 1

- Entry: `scripts/phase1.sh`
- Work: generate one spawn request per requested source family
- Output: `phase1_spawn_manifest.json`
- `--post`: validate spawn policy and evidence completeness. If validation fails, the script exits `2` and prints `REMEDIATION_REQUIRED: <source_family>`

### Phase 2

- Entry: `scripts/phase2.sh`
- Work: scan `context/` and build `context/artifact_lookup_<feature-id>.md`
- No spawn

### Phase 3

- Entry: `scripts/phase3.sh`
- Work: spawn the coverage subagent
- Output: `phase3_spawn_manifest.json`
- `--post`: validate `context/coverage_ledger_<feature-id>.md` and sync the artifact lookup

### Phase 4a

- Entry: `scripts/phase4a.sh`
- Work: spawn the subcategory-draft writer
- Output: `phase4a_spawn_manifest.json`
- `--post`: validate `drafts/qa_plan_subcategory_<feature-id>.md`

### Phase 4b

- Entry: `scripts/phase4b.sh`
- Work: spawn the top-category grouper
- Output: `phase4b_spawn_manifest.json`
- `--post`: validate `drafts/qa_plan_v1.md`

### Phase 5

- Entry: `scripts/phase5.sh`
- Work: spawn a combined review + refactor pass
- Output: `phase5_spawn_manifest.json`
- `--post`: require:
  - `context/review_notes_<feature-id>.md`
  - `context/review_delta_<feature-id>.md`
  - `drafts/qa_plan_v2.md`
  - `qa_plan_v2.md` differs from `qa_plan_v1.md`

### Phase 6

- Entry: `scripts/phase6.sh`
- Work: spawn the format/search/few-shots quality pass
- Output: `phase6_spawn_manifest.json`
- `--post`: require:
  - `drafts/qa_plan_v3.md`
  - `context/quality_delta_<feature-id>.md`
  - valid XMindMark hierarchy
  - executable nested steps

### Phase 7

- Entry: `scripts/phase7.sh`
- Work: archive any existing final plan, promote the best available draft, write the finalization record, attempt Feishu notification
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
