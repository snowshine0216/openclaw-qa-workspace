# Benchmark Evaluation — P4B-LAYERING-001 (phase4b)

**Primary feature:** BCED-2416  
**Feature family / knowledge pack:** report-editor  
**Primary phase under test:** phase4b  
**Evidence mode:** blind_pre_defect  
**Priority:** advisory  
**Case focus:** canonical top-layer grouping **without collapsing scenarios**

## Determination (phase4b contract alignment)

### What phase4b must do (per provided contract)
Using `references/phase4b-contract.md` as the authoritative phase definition, Phase 4b is responsible for:

- **Grouping** a Phase 4a draft into the **canonical top-layer taxonomy**:
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
- **Preserving scenario granularity (anti-compression):**
  - do **not** merge scenarios in ways that lose distinct risks/outcomes
  - explicitly calls out not merging **Workstation-only vs Library-gap** scenarios when outcomes/risks differ
- **Preserving required layering shape:** top category → subcategory → scenario → atomic action chain → observable verification leaves
- **Not doing few-shot cleanup** (Phase 6 owns that)
- Producing `drafts/qa_plan_phase4b_r<round>.md` from the latest `drafts/qa_plan_phase4a_r<round>.md`
- Optional: at most **one bounded supplemental research pass** if grouping evidence is insufficient, saving artifacts under `context/` as `research_phase4b_<feature-id>_*.md`

### What evidence is available in this benchmark bundle
The fixture bundle provides:
- Jira raw issue JSON for BCED-2416
- A customer-scope extract
- A narrative/worked QA note document: `BCED-2416-embedding-dashboard-editor-workstation.md`

### Gaps that prevent demonstrating phase4b success/failure
This benchmark case is explicitly about **whether phase4b’s output demonstrates canonical top-layer grouping without collapsing scenarios**.

However, the provided evidence bundle does **not** include the minimum artifacts required to evaluate phase4b output correctness:

1. **Missing required input to phase4b:**
   - No `drafts/qa_plan_phase4a_r<round>.md` is provided.
2. **Missing required output of phase4b:**
   - No `drafts/qa_plan_phase4b_r<round>.md` is provided.
3. **Missing phase4b execution/spawn evidence:**
   - No `phase4b_spawn_manifest.json` is provided.
4. **Missing artifact index/lookup evidence used by phase4b:**
   - No `context/artifact_lookup_<feature-id>.md` is provided.

Because the benchmark is in **blind_pre_defect** mode and we are constrained to the provided evidence only, we cannot reconstruct the phase4a draft or infer the exact scenario node set that must be preserved through canonical grouping.

## Conclusion for this benchmark case

### Case focus coverage: canonical top-layer grouping without collapsing scenarios
- **Not demonstrable with provided evidence.**
- The phase4b contract clearly defines the canonical top-layer categories and anti-compression rule, but there is **no phase4b artifact** to verify that scenarios were grouped canonically **and** not collapsed.

### Alignment with primary phase: phase4b
- **Contractually aligned in description only.**
- The evidence includes the authoritative phase4b contract, but does not include phase4b runtime outputs to confirm the skill behavior (spawn + draft + preservation).

## What would be needed (to make this benchmark decidable)
To evaluate phase4b layering behavior for BCED-2416, the fixture would need at least:
- `drafts/qa_plan_phase4a_r1.md` (or latest)
- `drafts/qa_plan_phase4b_r1.md` (or latest)
- (optional but strong) `phase4b_spawn_manifest.json`
- (optional but strong) `context/artifact_lookup_BCED-2416.md`

With those, this benchmark could check:
- presence and correctness of the canonical top layer
- preservation of subcategory layer
- scenario count preservation / no collapsing of distinct scenarios
- no few-shot cleanup done in phase4b