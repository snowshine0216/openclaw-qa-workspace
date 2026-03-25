# QA Plan Evolution Simplification — Implementation Plan

## Overview

Fix ~90% of BCIN-7289 qa-plan gaps by enriching the knowledge pack and strengthening phase rubrics, then document a simplified 3-phase evolution model.

Supporting scope on this branch also includes:

- request-driven `qa-plan-v2` benchmark runner/grader changes
- qmd-backed knowledge-pack retrieval and coverage-ledger runtime plumbing
- the benchmark manifest/history updates needed to exercise the new validation path

---

## Step 1: Enrich Knowledge Pack

### Knowledge Pack

#### [MODIFY] [pack.json](../workspace-planner/skills/qa-plan-orchestrator/knowledge-packs/report-editor/pack.json)

Add the following items derived from the 26 BCIN-7289 defects:

**New required_capabilities** (4 additions):
- `save-as-overwrite` — save-as to overwrite existing report (BCIN-7669, BCIN-7724)
- `subset-report-save` — save-as on subset report (BCIN-7687)
- `intelligent-cube-conversion` — convert report to Intelligent Cube (BCIN-7673)
- `session-timeout-handling` — session timeout UX redirect (BCIN-7693)

**New required_outcomes** (5 additions):
- Report Builder loads prompt elements after double-click (BCIN-7727)
- Edit report title matches current report context in workstation (BCIN-7733)
- Save-as overwrite does not throw JS error (BCIN-7669)
- i18n dialog actions translated for all locales (BCIN-7720, 7721, 7722)
- Single loading indicator during report creation/edit (BCIN-7668)

**New state_transitions** (3 additions):
- `save-as → overwrite-conflict → confirmation` (BCIN-7669)
- `prompt-pause-mode → template-creation → running` (BCIN-7730)
- `double-click-edit → load-report → show-correct-title` (BCIN-7733)

**New analog_gates** (2 additions):
- `BCIN-7727`: Report Builder prompt element loading after interaction
- `BCIN-7730`: Template with prompt pause mode running after creation

**New interaction_pairs** (2 additions):
- `save-as-overwrite` + `template-save` (concurrent save path risk)
- `prompt-pause-mode` + `report-builder-loading` (BCIN-7727 + BCIN-7730)

**New anti_patterns** (2 additions):
- Multiple confirm-close popups from repeated X-button clicks (BCIN-7709)
- i18n string additions without coverage of all dialogs (BCIN-7720/21/22 pattern)

**New evidence_refs** (4 additions):
- BCIN-7669, BCIN-7727, BCIN-7730, BCIN-7733

#### [MODIFY] [pack.md](../workspace-planner/skills/qa-plan-orchestrator/knowledge-packs/report-editor/pack.md)

Mirror all changes from pack.json in human-readable markdown format.

---

## Step 2: Edit Phase Rubrics

### Phase 4a Contract

#### [MODIFY] [phase4a-contract.md](../workspace-planner/skills/qa-plan-orchestrator/references/phase4a-contract.md)

Add to `## Support And Gap Coverage`:

```diff
+- SDK/API visible outcomes (e.g. `setWindowTitle`, `errorHandler`) must each map to at least one scenario with an observable verification leaf. Implicit mentions without testable outcomes are insufficient.
+- State transitions declared in the active knowledge pack must each appear as a scenario chain (from-state → trigger → to-state → observable outcome).
+- i18n-critical dialogs must have explicit locale-aware verification leaves when the knowledge pack declares `i18n dialogs` as a capability.
```

### Phase 5a Rubric

#### [MODIFY] [review-rubric-phase5a.md](../workspace-planner/skills/qa-plan-orchestrator/references/review-rubric-phase5a.md)

Add to `## Request Fulfillment Gate`:

```diff
+- `accept` is forbidden while any `interaction_pairs` entry from the active knowledge pack lacks a cross-section scenario audit entry.
+- `accept` is forbidden while any `state_transitions` entry from the active knowledge pack lacks a mapped scenario chain in the plan.
```

### Phase 5b Rubric

#### [MODIFY] [review-rubric-phase5b.md](../workspace-planner/skills/qa-plan-orchestrator/references/review-rubric-phase5b.md)

Add new checkpoint after Checkpoint 15:

```diff
+- `Checkpoint 16` i18n Dialog Coverage
+  - All dialogs that add/modify `productstrings` entries must have locale-aware verification in the plan
+  - Analog gates referencing i18n defects must be enumerated in the release recommendation
```

---

## Step 3: Slim Evolution to 3 Phases

### 3a. Design Doc

#### [NEW] [SIMPLIFIED_EVOLUTION_MODEL.md](../.agents/skills/qa-plan-evolution/docs/SIMPLIFIED_EVOLUTION_MODEL.md)

- **Phase A: Collect Evidence** — read defect report, map to knowledge pack gaps
- **Phase B: Apply Mutation** — update knowledge pack or phase rubric, verify planner output
- **Phase C: Benchmark Gate** — run `npm run benchmark:v2:run`, compare scorecard
- Include a decision table: simple path (1-2 families, manual) vs full 7-phase automation (3+ families)

---

### 3b. Update [SKILL.md](../.agents/skills/qa-plan-evolution/SKILL.md)

#### [MODIFY] [SKILL.md](../.agents/skills/qa-plan-evolution/SKILL.md)

Add a **Quick Start** block at the very top (before `## Required References`), routing new operators to the 3-phase path:

```markdown
## Quick Start (Recommended for 1–2 Feature Families)

If you only have one or two feature families and defect evidence is manually available:

1. **Phase A** — Enrich the feature family knowledge pack with defect-derived gaps
2. **Phase B** — Run `qa-plan-orchestrator` and verify planner output covers those gaps
3. **Phase C** — Run `npm run benchmark:v2:run` against the benchmark; accept if non-regressing

See `docs/SIMPLIFIED_EVOLUTION_MODEL.md` for a detailed walkthrough.

Use the full 7-phase automated pipeline when:
- You have 3+ feature families with real knowledge packs
- Automated defect evidence refresh is required across multiple runs
- Replay evidence must be gated automatically
```

The existing full 7-phase body stays intact underneath — no deletion.

---

### 3c. Add New [evals.json](../.agents/skills/qa-plan-evolution/evals/evals.json) Profile

#### [MODIFY] [evals.json](../.agents/skills/qa-plan-evolution/evals/evals.json)

Add a new `qa-plan-pack-only` profile for simple-path runs (no defect refresh, no replay evals):

```json
{
  "id": "qa-plan-pack-only",
  "description": "Lightweight QA plan evolution for knowledge-pack mutations only. No defect evidence refresh, no replay evals. Use for the simple 3-phase operator path.",
  "target_skill_hint": "qa-plan-orchestrator",
  "gap_sources": [
    { "id": "knowledge_pack_coverage", "required": true },
    "contract_drift"
  ],
  "evidence_hooks": {
    "inspect_target_artifacts": true,
    "defects_analysis_refresh": "none",
    "knowledge_pack_version_check": true,
    "defect_replay_evals": false,
    "holdout_evals": true
  },
  "scoring_dimensions": [
    "knowledge_pack_coverage_score",
    "contract_compliance_score",
    "regression_count"
  ],
  "canonical_benchmark_spec": "workspace-planner/skills/qa-plan-orchestrator/references/qa-plan-benchmark-spec.md"
}
```

---

### 3d. Populate Gap Analysis Stubs

The two BCIN-7289 stubs are currently `# self` and `# cross` — they are referenced as primary evidence sources in the automation design doc but contain no content.

#### [MODIFY] [BCIN-7289_SELF_TEST_GAP_ANALYSIS.md](../workspace-reporter/skills/defects-analysis/runs/BCIN-7289/BCIN-7289_SELF_TEST_GAP_ANALYSIS.md)

Populate from the existing BCIN-7289 defect report with:
- Gap taxonomy table (8 buckets)
- Per-defect gap classification for the 13 open defects
- Summary of root-cause bucket distribution

#### [MODIFY] [BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md](../workspace-reporter/skills/defects-analysis/runs/BCIN-7289/BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md)

Populate with:
- For each defect: which QA-plan phase should have caught it, and why it didn't
- Knowledge-pack delta recommendation per gap cluster
- Overall cross-analysis verdict

---

### 3e. Update [reference.md](../.agents/skills/qa-plan-evolution/reference.md) Operator Note

#### [MODIFY] [reference.md](../.agents/skills/qa-plan-evolution/reference.md)

Add a note under `## Runtime State` → `REPORT_STATE` table:

```markdown
> **Simple-path note:** When using the 3-phase model (`qa-plan-pack-only` profile),
> operators typically start with `CONTEXT_ONLY` state — freshness and backlog exist
> but no iteration has completed. This is the expected starting state; continue
> without treating it as an error.
```

---

## Verification Plan

### Automated Tests

**qa-plan-evolution tests** (existing, 13 test files):
```bash
cd .agents/skills/qa-plan-evolution && npm test
```

These tests validate that phase0 knowledge-pack resolution, gap taxonomy, and scoring still work after our knowledge pack changes. The enriched pack.json must remain valid JSON with the same schema.

### Manual Verification

1. **Knowledge pack schema check** — After editing pack.json, verify it parses as valid JSON:
   ```bash
   node -e "JSON.parse(require('fs').readFileSync('workspace-planner/skills/qa-plan-orchestrator/knowledge-packs/report-editor/pack.json'))"
   ```

2. **Rubric review** — The rubric changes are additive text (new rules in existing sections). They are consumed as LLM context during qa-plan planning runs, so wording must stay explicit and deterministic.

3. **Benchmark validation** — This branch does modify benchmark infrastructure code. Re-run the targeted benchmark/test slices that exercise the new runner, grader, retrieval, and coverage-ledger paths before relying on updated `qa-plan-v2` outputs.
