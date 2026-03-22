# HOLDOUT-REGRESSION-002

## Verdict

- Result: **FAIL**
- Severity: **blocking**
- Primary phase alignment: **holdout**
- Feature under holdout: **BCIN-976** (`report-editor`)

## Case Focus Coverage

- Focus explicitly reviewed: **promotion/finalization behavior on another feature**
- Output aligned to holdout: **yes**; this artifact is a holdout-phase contract/implementation review, not a drafting-phase QA plan
- Benchmark satisfaction: **no**

## Feature Evidence Used

- `BCIN-976` is a report-editor feature: "Ability to export reports from edit mode in Library."
- The Jira snapshot describes export-from-editor behavior for unsaved report edits in Library and shows explicit customer demand.
- The blind customer-scope export confirms customer signal is present and the bundle contains no linked supporting issues or subtasks.
- The report-editor knowledge pack remains applicable for this feature family, but the holdout check here is Phase 7 promotion/finalization stability, not earlier draft composition.

## Holdout Assessment

Phase 7 is the authoritative promotion/finalization gate in the skill package. The workflow contract says Phase 7 must archive any existing final plan, promote the best available draft, write a finalization record, generate a final-plan summary, and then attempt Feishu notification (`skill_snapshot/SKILL.md:153-157`).

The runtime/artifact contract is more specific: prior finals must be preserved under `archive/`, and the documented recovery behavior says an overwritten final should become `archive/qa_plan_final_<timestamp>.md` (`skill_snapshot/reference.md:19-34`). The package README is consistent that Phase 7 produces the promoted final plus derived summary/smoke artifacts (`skill_snapshot/README.md:13-23`).

The implementation preserves several important behaviors:

- It blocks finalization when `request_fulfillment_<feature-id>.json` is missing, when satisfied evidence artifacts have disappeared, or when blocking requirements remain unresolved (`skill_snapshot/scripts/lib/runPhase.mjs:152-170`, `884-915`).
- It promotes the best available draft in descending order from Phase 6 back through Phase 4a (`skill_snapshot/scripts/lib/runPhase.mjs:467-484`).
- It writes `finalization_record_<feature-id>.md` and triggers final-plan summary generation during Phase 7 (`skill_snapshot/scripts/lib/runPhase.mjs:162-170`).

However, the current Phase 7 implementation does **not** archive overwritten finals to `archive/`. It renames an existing `qa_plan_final.md` directly into the run root:

- documented contract: `archive/qa_plan_final_<timestamp>.md`
- implemented behavior: `join(runDir, archiveName)` (`skill_snapshot/scripts/lib/runPhase.mjs:157-159`)

That is a blocking regression against the authoritative contract. On BCIN-976, repeated finalization would not preserve prior finals in the documented archive location, so promotion/finalization behavior is **not stable** for this holdout feature.

## Conclusion

The skill snapshot does **not** satisfy this benchmark case. The holdout-phase review explicitly covers promotion/finalization behavior on BCIN-976 and finds a blocking Phase 7 regression: overwrite archival is implemented in the wrong location relative to the current orchestrator contract.

## Minimal Remediation

- Update Phase 7 overwrite handling to create/use `<run-dir>/archive/` and move prior `qa_plan_final.md` there before promoting the new final.
- Keep the existing request-fulfillment gate, promotion-source selection, finalization record, and summary-generation behavior unchanged.
