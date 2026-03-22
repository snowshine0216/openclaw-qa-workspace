# qa-plan-evolution

Shared skill for **champion vs challenger** skill improvement with a hard iteration cap (≤10).

## Quick start

1. Ensure Node 18+ and optional `jq`.
2. From repo root:

```bash
./.agents/skills/qa-plan-evolution/scripts/check_runtime_env.sh
./.agents/skills/qa-plan-evolution/scripts/orchestrate.sh --with-phase0 \
  --run-key "my-run-$(date +%s)" \
  --target-skill-path workspace-planner/skills/qa-plan-orchestrator \
  --target-skill-name qa-plan-orchestrator \
  --benchmark-profile generic-skill-regression
```

**Evolving `qa-plan-orchestrator`:** use a `qa-plan-*` profile (typically `qa-plan-defect-recall`) so Phase 4 runs the `qa-plan-v2` iteration comparison workflow; see `evals/evals.json` and `workspace-planner/skills/qa-plan-orchestrator/docs/QA_PLAN_BENCHMARK_SPEC.md`.

```bash
./.agents/skills/qa-plan-evolution/scripts/orchestrate.sh --with-phase0 \
  --run-key "qa-plan-orchestrator__<FEATURE>__$(date -u +%Y%m%dT%H%M%SZ)" \
  --target-skill-path workspace-planner/skills/qa-plan-orchestrator \
  --target-skill-name qa-plan-orchestrator \
  --benchmark-profile qa-plan-defect-recall
```

Use `--run-root` and `--repo-root` when keeping runs outside the default `runs/<run-key>/` tree (for example CI temp dirs).

For `qa-plan-v2`, Phase 4 now prefers executed benchmark comparison through `benchmarks/qa-plan-v2/scripts/run_iteration_compare.mjs`. The older structural comparator in `scripts/lib/publishIterationComparison.mjs` remains a synthetic fallback only; it marks scorecards with `scoring_fidelity: "synthetic"` and blocks promotion.

## Knowledge Pack Behavior

- `--knowledge-pack-key` is optional for qa-plan runs.
- Phase 0 resolves a key in this order: explicit key -> `feature_family` -> `cases.json` lookup by `feature_id` -> `general`.
- If the resolved pack is missing, Phase 1 scaffolds `pack.json` + `pack.md`, writes a bootstrap artifact under `context/`, and blocks until `bootstrap_status` is set to `ready`.

## Promotion Behavior

- Accepted iteration + `--finalize` promotes candidate changes into the target skill tree and creates a local git commit.
- Add `--auto-push` (optional) to push the promotion commit.
- Rejected iterations restore candidate snapshot state from champion baseline before continuing.

## Cross-Feature Gate

- Replay remains feature-specific and opt-in.
- Blind/holdout checks enforce non-regression for non-target feature families in `qa-plan-v2` scorecards.

## Tests

```bash
cd .agents/skills/qa-plan-evolution && npm test
```

Integration tests use `scripts/test/fixtures/minimal-target-skill` so they do not depend on the full `qa-plan-orchestrator` npm suite.

## Profiles

See `evals/evals.json` for `qa-plan-defect-recall`, `qa-plan-knowledge-pack-coverage`, and `generic-skill-regression`.

Profiles now declare `gap_sources` so Phase 2 can remain shared while target-specific evidence stays in adapters.

- `generic-skill-regression` uses generic sources such as target eval failures and contract drift.
- `qa-plan-*` profiles add planner-specific sources such as defects cross-analysis and knowledge-pack coverage.

`scripts/orchestrate.sh` now honors `SPAWN_MANIFEST:` output by running `scripts/lib/manifestRunner.mjs` and rerunning the same phase with `--post`.

## Related docs

- `workspace-planner/skills/qa-plan-orchestrator/docs/QA_PLAN_EVOLUTION_DESIGN.md`
- `workspace-planner/skills/qa-plan-orchestrator/docs/QA_PLAN_BENCHMARK_SPEC.md`
- `docs/QA_PLAN_EVOLUTION_WORKFLOW_AND_EXAMPLE.md`
- `docs/QA_PLAN_V2_BENCHMARK_INTEGRATION_REMEDIATION_PLAN.md`
