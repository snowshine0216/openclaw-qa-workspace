# Phase 6 Static Validation

Validator basis: `skill_snapshot/scripts/lib/qaPlanValidators.mjs`, `skill_snapshot/scripts/lib/spawnManifestBuilders.mjs`, `skill_snapshot/references/review-rubric-phase6.md`, and `skill_snapshot/references/e2e-coverage-rules.md`.

## Result

- Overall: pass

## Checks Passed

- `phase6_spawn_manifest.json` count is `1`
- manifest `source.output_draft_path` matches `drafts/qa_plan_phase6_r1.md`
- manifest task text includes `review-rubric-phase6`
- manifest task text includes `e2e-coverage-rules`
- manifest task text includes `checkpoint_audit_BCIN-6709.md`
- manifest task text includes `qa_plan_phase6_r1.md`
- final draft starts with a central topic line
- final draft contains at least two top-level bullets and nested child bullets
- final draft uses canonical top layers with preserved subcategory and scenario layers
- final draft avoids compressed `->` chain wording
- final draft avoids `Setup:`, `Action:`, and `Expected:` legacy formatting
- final draft includes nested action steps and observable leaves
- final draft includes an `EndToEnd` section with deep observable result leaves
- phase5b scenario paths are preserved in phase6
- `quality_delta_BCIN-6709.md` includes `Final Layer Audit`, `Few-Shot Rewrite Applications`, `Exceptions Preserved`, and `Verdict`

## Execution Limitation

- Direct execution of `skill_snapshot/scripts/phase6.sh` and `--post` was blocked because no JavaScript runtime was available on `PATH` in this workspace (`node`, `nodejs`, `bun`, and `deno` were all absent).
