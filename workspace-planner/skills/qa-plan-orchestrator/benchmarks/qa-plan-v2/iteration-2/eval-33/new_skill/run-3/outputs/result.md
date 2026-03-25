# RE-DEFECT-FEEDBACKLOOP-001 — Phase 8 Contract Check (Advisory)

## Primary benchmark feature
- Feature: **BCIN-7289**
- Feature family: **report-editor**
- Primary phase/checkpoint under test: **phase8**
- Evidence mode: **blind_pre_defect**
- Benchmark focus: **defect feedback loop injects scenarios from prior defects into next feature QA plan**

## Phase-model alignment finding (Phase 8)
**Fail (contract gap):** The provided **qa-plan-orchestrator** workflow package defines phases **0–7 only**. There is **no Phase 8** entrypoint, contract, artifacts, spawn manifest, or validator gate described in the snapshot evidence.

### Evidence
From `skill_snapshot/SKILL.md`:
- Phase contracts listed: **Phase 0, 1, 2, 3, 4a, 4b, 5a, 5b, 6, 7**.
- No mention of **Phase 8**.

From `skill_snapshot/reference.md`:
- Artifact families enumerated through **Phase 7**.
- No runtime state fields for Phase 8, no Phase 8 outputs.

**Therefore, an output “aligned with primary phase phase8” cannot be produced under the current contract.**

## Defect feedback loop coverage finding (benchmark focus)
**Fail (focus not explicitly covered by contract):** The snapshot evidence includes policies for:
- supporting issues being **context_only_no_defect_analysis**
- deep research being **Tavily-first**
- coverage preservation across drafting/review phases

…but it **does not define any mechanism** to:
- ingest **prior defect learnings** (e.g., adjacent defects) as inputs,
- translate them into **regression scenarios**, or
- explicitly **inject** those scenarios into the QA plan for the next feature.

### Relevant blind pre-defect fixture evidence that would be the natural source for a defect-feedback loop
`fixture:BCIN-7289-blind-pre-defect-bundle/BCIN-7289.adjacent-issues.summary.json` shows **29 parented adjacent issues**, many of which are **Defects** (e.g., BCIN-7733, BCIN-7730, BCIN-7727, … BCIN-7667).

However, per the snapshot contract:
- Phase 1 “supporting issues” are explicitly constrained to **support-only Jira issues** and must remain `context_only_no_defect_analysis`.
- There is **no described phase** or step that converts “adjacent defects” into “defect-derived regression scenarios for the next plan”.

### Example defect-derived scenarios that a feedback loop would typically inject (not claimed as produced by this orchestrator)
If a defect feedback loop existed, the adjacent defect list suggests regression themes such as:
- Prompting flows: pause mode prompting (BCIN-7730), prompt answer persistence/discard (BCIN-7707), prompt editor close-confirm interactions (BCIN-7708)
- Save/Save As/Replace/Override: replace report 400 (BCIN-7724), override existing save null error (BCIN-7669)
- Workstation embedded editor UI: native menu empty on double-click edit (BCIN-7733), duplicate loaders (BCIN-7668), native toolbar menu removal expectations (BCIN-7704)
- i18n: multiple untranslated strings (BCIN-7722/7721/7720)
- Performance: blank report creation regression (BCIN-7675)

**But the current skill contract does not require or describe injecting these into BCIN-7289’s QA plan.**

## Overall benchmark verdict
- [phase_contract][advisory] **Case focus explicitly covered** (defect feedback loop injection): **No**
- [phase_contract][advisory] **Output aligns with primary phase phase8**: **No**

## What would need to exist to satisfy this benchmark (contract-level deltas)
*(Advisory; not implemented here because only benchmark evidence may be used.)*
1. A defined **Phase 8** contract that explicitly:
   - collects prior defects (e.g., adjacent defects to the feature or within feature family),
   - transforms them into regression scenarios, and
   - merges them into the plan without violating coverage-preservation rules.
2. A named artifact family (e.g., `context/defect_feedback_<feature-id>.md` and/or an injected section in the draft lineage) and a validator gate that asserts the defect-derived scenarios are present.

---

## Short execution summary
Using only the provided snapshot evidence and the blind pre-defect BCIN-7289 fixture bundle, Phase 8 cannot be assessed or produced because the orchestrator contract defines phases 0–7 only. Additionally, the contract does not explicitly cover a defect feedback loop that injects prior-defect scenarios into the next feature QA plan, even though the fixture includes a rich adjacent-defect set that would normally feed such a loop.