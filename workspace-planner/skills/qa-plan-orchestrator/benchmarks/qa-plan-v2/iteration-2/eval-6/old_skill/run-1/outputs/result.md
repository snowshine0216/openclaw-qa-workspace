# P4B-LAYERING-001 — Phase 4b Phase-Contract Check (BCED-2416, report-editor)

## Scope (per benchmark)
- **Primary phase under test:** Phase **4b**
- **Case focus:** **Canonical top-layer grouping without collapsing scenarios**
- **Evidence mode:** blind_pre_defect (use only provided evidence)
- **Priority:** advisory

## Phase 4b contract requirements (authoritative)
From `skill_snapshot/references/phase4b-contract.md`:
- Purpose: **Group the Phase 4a draft into canonical top-layer taxonomy** **without merging away scenario granularity**.
- Required inputs:
  - latest `drafts/qa_plan_phase4a_r<round>.md`
  - supporting `context/` artifacts needed to justify grouping
  - `context/artifact_lookup_<feature-id>.md`
- Required output:
  - `drafts/qa_plan_phase4b_r<round>.md`
- Canonical top layer must be used:
  - `EndToEnd`
  - `Core Functional Flows`
  - `Error Handling / Recovery`
  - `Regression / Known Risks`
  - `Compatibility`
  - `Security`
  - `i18n`
  - `Accessibility`
  - `Performance / Resilience`
  - `Out of Scope / Assumptions`
- Rules that directly match benchmark focus:
  - **Preserve scenario nodes** and **do not shrink coverage**
  - **Preserve the subcategory layer** between top layer and scenario
  - **Anti-compression:** do not merge distinct Workstation-only vs Library-gap scenarios when outcomes/risks differ

## Evidence available in this benchmark bundle
Provided fixture artifacts include:
- `BCED-2416-embedding-dashboard-editor-workstation.md` (feature summary + extensive test key points)
- Jira raw JSON and customer-scope JSON for BCED-2416

Not provided (but required by phase4b contract to perform/verify actual Phase 4b work):
- `drafts/qa_plan_phase4a_r<round>.md` (Phase 4a input)
- `context/artifact_lookup_BCED-2416.md`
- `drafts/qa_plan_phase4b_r<round>.md` (Phase 4b output)
- `phase4b_spawn_manifest.json` and any `--post` validation output

## Assessment: does the workflow/artifact set demonstrate Phase 4b compliance?
### 1) Alignment with Phase 4b (primary phase)
- **Cannot be demonstrated from provided evidence.**
- Reason: Phase 4b is explicitly about transforming a **Phase 4a draft plan** into a **Phase 4b layered plan**. No Phase 4a/4b plan drafts are present in evidence, so there is nothing to evaluate for:
  - canonical top-layer categories
  - preservation of scenario granularity
  - preservation of subcategory layer
  - coverage-preservation vs Phase 4a

### 2) Case focus: canonical top-layer grouping without collapsing scenarios
- **Not verifiable with current evidence.**
- We can see many *potential* scenario themes in `BCED-2416-embedding-dashboard-editor-workstation.md` (launch/activation, save, cancel/close, auth timeout, navigation/links, export, UI/menu, performance, security/ACL, upgrade compatibility, data sources).
- However, the benchmark expectation is about **how** those scenarios are grouped into Phase 4b’s canonical taxonomy **without collapsing** distinct scenarios.
- Without the Phase 4a draft and Phase 4b regrouped draft, we cannot confirm:
  - scenarios were not merged/flattened
  - Workstation-only vs Library-parity-gap scenarios stayed distinct (anti-compression rule)
  - top-layer taxonomy matches the contract

## Conclusion (benchmark verdict)
- **Blocker:** Insufficient phase4b artifacts to demonstrate the required Phase 4b contract behavior.
- Therefore, this benchmark run cannot show that the skill satisfies:
  - **[phase_contract][advisory] canonical top-layer grouping without collapsing scenarios**
  - **[phase_contract][advisory] output aligns with primary phase phase4b**

## What would be needed to complete this Phase 4b benchmark (artifact checklist)
To evaluate the benchmark focus using only run artifacts, the evidence set must include:
1. `drafts/qa_plan_phase4a_r1.md` (or latest round) for BCED-2416
2. `context/artifact_lookup_BCED-2416.md`
3. `drafts/qa_plan_phase4b_r1.md` (or latest round)
4. Any Phase 4b `--post` validator results (or at least presence of passing gates implied by produced draft), specifically covering:
   - `validate_phase4b_category_layering`
   - `validate_draft_coverage_preservation` (against Phase 4a)
   - `validate_scenario_granularity`
   - `validate_xmindmark_hierarchy`
   - `validate_e2e_minimum`
   - `validate_executable_steps`

---

## Execution summary
- Reviewed the **Phase 4b contract** and compared it against the **available blind_pre_defect fixture bundle**.
- The fixture includes feature description and test-point notes, but **does not include Phase 4a/4b draft plan artifacts**, so Phase 4b canonical layering and anti-compression requirements cannot be validated.