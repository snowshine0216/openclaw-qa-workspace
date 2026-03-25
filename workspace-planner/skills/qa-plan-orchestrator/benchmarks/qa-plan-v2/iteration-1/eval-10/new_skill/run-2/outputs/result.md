# Benchmark Assessment — P6-QUALITY-POLISH-001 (BCIN-6709)

## Scope
This benchmark evaluates whether the **qa-plan-orchestrator** skill satisfies the **Phase 6 contract** emphasis: **a final quality pass that preserves canonical layering and executable wording**, producing the required Phase 6 artifacts and explicitly auditing preservation of reviewed/support/research/pack-backed coverage.

## Phase 6 Contract Alignment (from snapshot evidence)
### Phase 6 responsibilities (orchestrator-level)
Per `skill_snapshot/SKILL.md`, the orchestrator must:
1. Run `scripts/phase6.sh <feature-id> <run-dir>`
2. If stdout contains `SPAWN_MANIFEST: <path>`, read it and spawn each `requests[].openclaw.args` **exactly as-is** (no extra fields like `streamTo`), wait for completion
3. Run `scripts/phase6.sh ... --post`
4. Stop immediately on non-zero exit

### Required Phase 6 outputs (artifact contract)
Per `skill_snapshot/SKILL.md` / `skill_snapshot/reference.md` and Phase 6 rubric `skill_snapshot/references/review-rubric-phase6.md`, Phase 6 must produce:
- `phase6_spawn_manifest.json`
- `drafts/qa_plan_phase6_r<round>.md`
- `context/quality_delta_<feature-id>.md`

### Layering + executable wording requirements (Phase 6 rubric)
Per `skill_snapshot/references/review-rubric-phase6.md`, the final plan must preserve canonical layering:
1. central topic
2. canonical top category
3. subcategory
4. scenario
5. atomic action chain
6. observable verification leaves

And Phase 6 must preserve reviewed coverage scope from Phase 5b unless explicit evidence-backed exclusions are recorded.

### Required `quality_delta` sections
Per `skill_snapshot/references/review-rubric-phase6.md`, `context/quality_delta_<feature-id>.md` must include:
- `## Final Layer Audit`
- `## Few-Shot Rewrite Applications`
- `## Exceptions Preserved`
- `## Verdict`

It must also explicitly state that:
- support-derived coverage and deep-research-backed coverage were preserved
- when pack-backed candidates exist in `coverage_ledger_<feature-id>.json`, pack-backed scenarios were preserved

## Evidence Available in This Benchmark Bundle (blind_pre_defect)
Only the following benchmark evidence was provided:
- `skill_snapshot/SKILL.md`
- `skill_snapshot/reference.md`
- `skill_snapshot/README.md`
- `skill_snapshot/references/review-rubric-phase6.md`
- Fixture: `fixture:BCIN-6709-blind-pre-defect-bundle/BCIN-6709.issue.raw.json`
- Fixture: `fixture:BCIN-6709-blind-pre-defect-bundle/BCIN-6709.customer-scope.json`

## Determination for This Benchmark Case
### Can we verify Phase 6 “final quality pass preserves layering and executable wording” was performed?
**Not verifiable from provided evidence.**

Rationale: The Phase 6 benchmark expectation requires checking the Phase 6 outputs (especially `drafts/qa_plan_phase6_r<round>.md` and `context/quality_delta_BCIN-6709.md`) for:
- correct final layering
- executable, atomic nested steps + observable verification leaves
- explicit preservation statements in `quality_delta` (support/research/pack-backed)

However, the provided fixture bundle contains **no run artifacts** (no `phase6_spawn_manifest.json`, no Phase 6 draft, no `quality_delta`, no Phase 5b draft lineage, no coverage ledger). We only have the workflow contracts and the Jira feature JSON.

### What can be asserted (contract-level) for this skill snapshot?
From the snapshot evidence, the skill’s **Phase 6 contract is explicitly defined** to include:
- a “final layering/search/few-shots quality pass” (Phase 6 description)
- required outputs (`qa_plan_phase6_r<round>.md`, `quality_delta_<feature-id>.md`)
- a rubric that explicitly enforces canonical layering and requires an explicit preservation audit in `quality_delta`

So the workflow package **does include the necessary Phase 6 guardrails** to preserve layering and executable wording—but this benchmark run provides **no produced artifacts** to demonstrate they were applied to BCIN-6709.

## Benchmark Verdict (advisory)
**Blocked / Insufficient evidence to demonstrate Phase 6 compliance for BCIN-6709.**

### What would be needed to pass this benchmark demonstrably
To demonstrate the Phase 6 expectation for BCIN-6709 using the orchestrator contract, the evidence bundle would need to include at minimum:
- `phase6_spawn_manifest.json`
- `drafts/qa_plan_phase6_r1.md` (or later round)
- `context/quality_delta_BCIN-6709.md`

And to confirm “preserves layering and executable wording”, reviewers would check:
- plan structure follows the 6-layer model
- scenarios contain atomic action chains with observable verification leaves (no legacy labels)
- `quality_delta` contains the required sections and explicit preservation statements (support/deep research/pack-backed as applicable)