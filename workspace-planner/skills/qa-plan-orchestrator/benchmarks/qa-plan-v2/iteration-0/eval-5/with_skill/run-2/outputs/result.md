# P4A-MISSING-SCENARIO-001

## Scope

Phase under review: `phase4a` only.

This replay checks whether the current `qa-plan-orchestrator` snapshot would explicitly generate or enforce the missing BCIN-7289 scenarios for:

- template-save
- report-builder loading

## Verdict

Advisory verdict: **not fully satisfied**.

The snapshot contains the right remediation intent in the Phase 4a contract, but the executable Phase 4a path still does not explicitly enforce the two missing scenarios that this replay is about.

## Replay Evidence

- The retrospective gap analysis says Phase 4a missed scenario generation for Report Builder interaction and combination-path coverage, and that SDK/API-visible outcomes were silently dropped by the Phase 4a writer (`inputs/fixtures/BCIN-7289-defect-analysis-run/source/BCIN-7289_SELF_TEST_GAP_ANALYSIS.md:40-60`, `inputs/fixtures/BCIN-7289-defect-analysis-run/source/BCIN-7289_SELF_TEST_GAP_ANALYSIS.md:127-149`).
- The cross-analysis identifies a missing scenario for Report Builder prompt element loading after double-click (`inputs/fixtures/BCIN-7289-defect-analysis-run/source/BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md:86-100`).
- The cross-analysis separately identifies a missing scenario for template-sourced report creation plus save, where saving must create a new report instead of overwriting the template (`inputs/fixtures/BCIN-7289-defect-analysis-run/source/BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md:104-120`).

## Current Phase4a Coverage

- The current Phase 4a contract now says required knowledge-pack capabilities must map to a scenario, release gate, or explicit exclusion, and SDK/API visible outcomes must stay testable in scenario leaves (`skill_snapshot/references/phase4a-contract.md:68-73`).
- The report-editor knowledge pack includes `template-based creation` and `report builder interaction` as required capabilities (`skill_snapshot/knowledge-packs/report-editor/pack.md:3-10`).

These are the right remediation signals for this case.

## Why The Case Still Fails

- The Phase 4a spawn instructions only require `references/phase4a-contract.md` as a formal Phase 4a reference. They do not explicitly require the report-editor knowledge pack to be read by the Phase 4a writer (`skill_snapshot/scripts/lib/spawnManifestBuilders.mjs:34-35`, `skill_snapshot/scripts/lib/spawnManifestBuilders.mjs:341-363`).
- The Phase 4a task text is generic: it tells the writer to read current context artifacts and produce a subcategory draft, but it does not enumerate template-save or report-builder loading as mandatory outputs for BCIN-7289 (`skill_snapshot/scripts/lib/spawnManifestBuilders.mjs:324-363`).
- Phase 4a post-validation only runs `validatePhase4aSubcategoryDraft` plus executable-step validation (`skill_snapshot/scripts/lib/runPhase.mjs:301-307`).
- `buildDesignValidationContext` passes only support-trace and deep-research-topic data into the Phase 4a validator; it does not pass knowledge-pack required capabilities, interaction pairs, or feature-family-specific obligations (`skill_snapshot/scripts/lib/runPhase.mjs:794-801`).
- `validatePhase4aSubcategoryDraft` checks structure, support/research trace, and broad report-editor topic mentions, but it does not verify template-based creation as a scenario-or-exclusion obligation, does not verify report builder interaction as a scenario-or-exclusion obligation, and does not verify that the specific BCIN-7289 missing scenarios were generated (`skill_snapshot/scripts/lib/qaPlanValidators.mjs:854-892`).

## Expectation Check

| Benchmark expectation | Status | Assessment |
|---|---|---|
| Case focus is explicitly covered: missing scenario generation for template-save and report-builder loading | No | The contract and knowledge pack mention the needed concepts, but the live Phase 4a spawn and validation path do not explicitly enforce those scenarios. |
| Output aligns with primary phase `phase4a` | Yes | This review is limited to the Phase 4a contract, Phase 4a spawn instructions, and Phase 4a post-validation behavior. |

## Minimal Remediation Needed

- Add the report-editor knowledge-pack artifact as an explicit Phase 4a required reference or required input for the Phase 4a writer.
- Extend Phase 4a validation so required knowledge-pack capabilities are checked as scenario-or-exclusion obligations, not just prose guidance.
- For this replay family, require explicit Phase 4a coverage for template-based creation and save-as-new behavior.
- For this replay family, require explicit Phase 4a coverage for report-builder element loading interaction.
