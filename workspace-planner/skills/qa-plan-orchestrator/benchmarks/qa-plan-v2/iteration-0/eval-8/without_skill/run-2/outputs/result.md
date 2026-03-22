# Phase 5a Coverage Preservation Review

Feature: `BCIN-7289`  
Feature family: `report-editor`  
Primary checkpoint: `phase5a`  
Evidence mode: `retrospective_replay`  
Priority: `advisory`

## Verdict

`Does not satisfy this benchmark case.`

The replay evidence shows that phase5a did not reliably preserve all evidence-backed review nodes. Two nodes survive as explicit review findings, but several other nodes are either weakened into generic risk buckets or absent from the phase5a review surface entirely. That means the review loop can silently lose concrete, evidence-backed coverage obligations instead of preserving them as explicit advisories.

## Evidence Basis

- `BCIN-7289_SELF_TEST_GAP_ANALYSIS.md:206-231` states that current phase5a behavior reviews sections independently and misses cross-section interaction coverage. It names required interaction pairs: `Save x Prompt`, `Save x Template`, `Close x Active Dialog`, `Error x Session State`, and `Convert x i18n`.
- `BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md:67-220` enumerates concrete missing or underpowered scenario nodes backed by actual filed defects.
- `BCIN-7289_REVIEW_SUMMARY.md:52-113` is the replay's review-loop artifact and therefore the primary phase5a surface to audit.
- `BCIN-7289_REPORT_FINAL.md:183-224` shows what survived downstream into recommended focus/checklist items.

## Preservation Audit

| Evidence-backed node | Source evidence | Phase5a review surface | Downstream carry-forward | Assessment |
|---|---|---|---|---|
| Save overrides existing report without error | Cross-analysis Gap 1 (`67-81`) | Explicitly preserved as risk/advisory for `BCIN-7669` (`54-55`, `90-91`) | Preserved in QA focus/checklist (`183`, `216`) | Preserved |
| Report Builder double-click loads prompt elements | Cross-analysis Gap 2 (`86-100`) | Explicitly preserved as risk/advisory for `BCIN-7727` (`58-60`, `93-94`) | Preserved in QA focus/checklist (`185`, `217`) | Preserved |
| Template-sourced report saves as a new report | Cross-analysis Gap 3 (`104-119`) | No explicit phase5a finding | Appears only later as QA focus item (`184`) | Dropped from phase5a review |
| Template x prompt pause-mode interaction | Cross-analysis Gap 4 (`124-137`); Self-test phase5a gap (`212-231`) | Reduced to generic "pause mode broken" (`58-60`); no joint-state finding | Checklist mentions `BCIN-7730` (`222`) | Weakened |
| Window title correctness across blank, IC, and edit modes | Cross-analysis Gap 5 (`142-155`) | Not reviewed as a coverage node; only `BCIN-7733` status mismatch is mentioned (`102-103`) | Only edit-title verification survives (`191`, `218`) | Weakened |
| Convert dialog localization and localized window title | Cross-analysis Gap 7 (`174-188`); Self-test required pair `Convert x i18n` (`229`) | Collapsed into generic i18n advisory (`99-100`) | Generic locale check only (`190`, `220`) | Weakened |
| Session-expiry recovery quality and re-login path | Cross-analysis Gap 8 (`192-201`); Self-test required pair `Error x Session State` (`228`) | No explicit phase5a finding | Present only as an open-defect summary line (`72`) | Dropped from phase5a review |
| Confirm-close while prompt editor is open | Cross-analysis Gap 9 (`206-220`); Self-test required pair `Close x Active Dialog` (`227`) | No explicit phase5a finding | Reduced to generic confirm-close verification (`199`, `221`) | Dropped from phase5a review |

Summary: `2 preserved`, `3 weakened`, `3 dropped from phase5a review`.

## Why This Fails The Benchmark

The case focus is not just whether the underlying defects remain visible somewhere in the replay. The phase5a checkpoint must preserve the evidence-backed review nodes themselves, or explicitly mark them out of scope. This replay does not do that:

1. Cross-section interaction nodes identified in the evidence are not emitted as explicit review findings.
2. Rendered-outcome nodes such as window-title correctness and localized dialog labels are weakened into generic risk language.
3. Some nodes survive only in the downstream final report, which means phase5a already allowed them to fall out of the review artifact.

## Checkpoint-Aligned Requirement

To satisfy this case, phase5a should have emitted explicit advisory findings for the missing or weakened nodes instead of allowing them to disappear into broad categories. At minimum, the review artifact needed explicit preservation for:

- `Save x Template`: template-sourced new report save path
- `Close x Active Dialog`: prompt-editor-open close behavior
- `Error x Session State`: human-readable session-expiry recovery
- `Window title correctness`: blank create, IC create, edit, and template-derived paths
- `Convert x i18n`: localized confirm/cancel controls and localized IC title
