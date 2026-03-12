# Single Defect Analysis — Reference

## Ownership

- `SKILL.md` defines orchestrator behavior.
- `reference.md` defines runtime state, artifacts, manifests, and phase gates.

## State Machine: REPORT_STATE

| REPORT_STATE | Meaning | User interaction |
|---|---|---|
| FINAL_EXISTS | `<issue_key>_TESTING_PLAN.md` exists | choose `use_existing` / `smart_refresh` / `full_regenerate` |
| DRAFT_EXISTS | drafts exist without final plan | choose `resume` / `smart_refresh` / `full_regenerate` |
| CONTEXT_ONLY | only context artifacts exist | choose `generate_from_cache` / `full_regenerate` |
| FRESH | no prior artifacts | proceed |

## Runtime Root Convention

All artifacts live under:

```text
<skill-root>/runs/<issue_key>/
```

## Additive State Schemas

`task.json` required fields:
- `run_key`
- `overall_status`
- `current_phase`
- `analysis_ready_at`
- `testing_plan_generated_at`
- `updated_at`

`run.json` required fields:
- `data_fetched_at`
- `output_generated_at`
- `spawn_history`
- `notification_pending`
- `analysis_scope = "phase0_to_phase4_only"`
- `updated_at`

## Spawn/Post Contract (Phase 2)

- `phase2_spawn_manifest.json` format:
  - `{ "requests": [ { "openclaw": { "args": { "task": "...", "label": "...", "output_file": "..." }}}]}`
- each request represents one PR analysis output artifact.
- `phase2.sh --post` must verify required output files before consolidation.

## Final Notification Fallback

- success: set `run.json.notification_pending = null`
- failure: persist pending payload object in `run.json.notification_pending`

## Validation Commands

- `node --test .agents/skills/single-defect-analysis/scripts/test/check_resume.test.js`
- `node --test .agents/skills/single-defect-analysis/scripts/test/check_runtime_env_mjs.test.js`
- `node --test .agents/skills/single-defect-analysis/scripts/test/phase4.test.js`

## Skill-Level Evals

- `evals/evals.json` — test prompts and expectations per skill-creator
- `node evals/run_evals.mjs` — create workspace, output spawn manifest
- `./evals/post_run.sh <iteration-dir>` — aggregate benchmark, generate viewer (requires skill-creator)
