# Holdout Regression Review

## Case

- Case ID: `HOLDOUT-REGRESSION-002`
- Feature: `BCIN-976`
- Feature family: `report-editor`
- Evidence mode: `holdout_regression`
- Holdout focus: promotion/finalization behavior remains stable on another feature
- Reviewed checkpoint: Phase 7 promotion/finalization behavior in the `qa-plan-orchestrator` snapshot

## Outcome

**Verdict: fail (blocking)**

The snapshot still preserves most Phase 7 safeguards that matter for a report-editor holdout feature: it promotes the latest available draft, blocks finalization when blocking request requirements are unsatisfied or when required evidence artifacts have disappeared, writes a finalization record with support/research lineage, generates `final_plan_summary_<feature-id>.md` and `developer_smoke_test_<feature-id>.md`, and downgrades Feishu send failures into `run.json.notification_pending` instead of rolling back the promotion. That behavior is visible in the contract and implementation at `skill_snapshot/SKILL.md:153-157`, `skill_snapshot/reference.md:205-208`, `skill_snapshot/reference.md:258-260`, `skill_snapshot/scripts/lib/runPhase.mjs:152-190`, `skill_snapshot/scripts/lib/runPhase.mjs:467-483`, `skill_snapshot/scripts/lib/runPhase.mjs:885-930`, `skill_snapshot/scripts/lib/finalPlanSummary.mjs:202-213`, and `skill_snapshot/scripts/test/phase7.test.sh:7-123`.

The blocking regression is the archive step. The runtime contract says Phase 7 archives prior finals under `archive/` and preserves them as `archive/qa_plan_final_<timestamp>.md` before promotion (`skill_snapshot/reference.md:21-34`). The current implementation renames the old final into the run root instead of the `archive/` directory (`skill_snapshot/scripts/lib/runPhase.mjs:156-160`). Because this case is specifically about promotion/finalization stability, that contract break is enough to fail the holdout case.

## Holdout Relevance

BCIN-976 is a valid same-family holdout. The copied fixture shows a `report-editor` feature with explicit customer scope and report-oriented labels (`inputs/fixtures/BCIN-976-blind-pre-defect-bundle/materials/BCIN-976.customer-scope.json:2-12`). The customer-scope export also shows multiple customer references and an accepting customer (`inputs/fixtures/BCIN-976-blind-pre-defect-bundle/materials/BCIN-976.customer-scope.json:12-40`). In the raw issue content, the feature is about exporting reports from Library edit mode without forcing a save first, and later scope discussion expands it toward Library-versus-Workstation parity and advanced export options. That makes the report-editor knowledge pack and finalization lineage requirements relevant for this holdout review.

The knowledge pack requires report-editor capabilities, analog gates, SDK-visible contracts, and interaction pairs to survive into scenarios, review gates, or explicit exclusions (`skill_snapshot/README.md:55-58`, `skill_snapshot/knowledge-packs/report-editor/pack.md:3-25`). Phase 7 summary generation still supports that family-level carry-through by deriving `developer_smoke_test_<feature-id>.md` from P1 and `[ANALOG-GATE]` scenarios (`skill_snapshot/README.md:21-23`, `skill_snapshot/scripts/lib/finalPlanSummary.mjs:202-213`).

## Phase 7 Check Matrix

| Check | Evidence | Status |
|---|---|---|
| Promote best available/latest draft | Contract says promote the best available draft; implementation prefers `task.latest_draft_path` then latest Phase 6/5b/5a/4b/4a draft (`skill_snapshot/SKILL.md:155-157`, `skill_snapshot/scripts/lib/runPhase.mjs:155-162`, `skill_snapshot/scripts/lib/runPhase.mjs:467-483`) | Pass |
| Block finalization on unsatisfied blocking requirements | Contract blocks promotion/finalization when blocking request requirements remain unsatisfied; implementation enforces that and tests cover both unsatisfied and waived states (`skill_snapshot/reference.md:258-260`, `skill_snapshot/scripts/lib/runPhase.mjs:885-915`, `skill_snapshot/scripts/test/phase7.test.sh:60-98`) | Pass |
| Block finalization when satisfied evidence artifacts were deleted | Implementation re-checks required evidence paths before promotion; tests cover deleted-artifact failure (`skill_snapshot/scripts/lib/runPhase.mjs:891-905`, `skill_snapshot/scripts/test/phase7.test.sh:100-123`) | Pass |
| Write finalization lineage and final summary artifacts | Contract requires finalization record and final summary; implementation writes lineage plus `final_plan_summary` and `developer_smoke_test` (`skill_snapshot/SKILL.md:155-157`, `skill_snapshot/reference.md:205-208`, `skill_snapshot/scripts/lib/runPhase.mjs:163-170`, `skill_snapshot/scripts/lib/finalPlanSummary.mjs:202-213`) | Pass |
| Preserve prior final under `archive/` before promotion | Runtime root contract and failure/recovery example require `archive/qa_plan_final_<timestamp>.md`; implementation moves the old final to `runDir/qa_plan_final_<timestamp>.md` instead (`skill_snapshot/reference.md:21-34`, `skill_snapshot/scripts/lib/runPhase.mjs:156-160`) | **Fail** |
| Persist notification fallback instead of undoing promotion | Contract/design requires `notification_pending` fallback; implementation and tests preserve that path (`skill_snapshot/scripts/lib/runPhase.mjs:176-189`, `skill_snapshot/scripts/test/phase7.test.sh:22-33`) | Pass |

## Benchmark Expectation Coverage

- `[holdout_regression][blocking] Case focus is explicitly covered: promotion/finalization behavior remains stable on another feature` -> covered directly by the Phase 7 review above for BCIN-976.
- `[holdout_regression][blocking] Output aligns with primary phase holdout` -> satisfied; this deliverable is a holdout regression review of the final promotion checkpoint rather than a full drafting artifact.

## Conclusion

The skill snapshot does **not** satisfy this blocking holdout regression case. Promotion/finalization behavior is mostly intact for another report-editor feature, but the archive-location regression breaks the authoritative Phase 7 contract and makes the holdout outcome fail.
