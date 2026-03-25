# NE-P4A-COMPONENT-STACK-001 — Phase 4a Phase-Contract Check (BCED-1719)

## Benchmark scope
- **Case**: NE-P4A-COMPONENT-STACK-001
- **Primary feature**: **BCED-1719**
- **Feature family / knowledge pack**: **native-embedding** (requested)
- **Primary phase under test**: **phase4a**
- **Evidence mode**: **blind_pre_defect**
- **Priority**: advisory
- **Case family**: phase contract
- **Focus requirement (must be explicitly covered in Phase 4a draft planning)**:
  1) **Panel-stack composition**
  2) **Embedding lifecycle**
  3) **Regression-sensitive integration states**
  …all within **single embedding component** planning.

## What Phase 4a is required to produce (contract expectations)
Per `skill_snapshot/references/phase4a-contract.md`, Phase 4a must yield a **subcategory-only** XMindMark draft with:
- Central topic: `Feature QA Plan (BCED-1719)`
- **Subcategory → scenario → atomic action chain → observable verification leaves**
- **No canonical top-layer categories** (e.g., “Compatibility”, “Security”, “EndToEnd”, “i18n”)
- No compressed steps (no `A -> B -> C`)
- Verification must be separated from action bullets (verification as deeper nested leaves)

Additionally, for this benchmark’s focus, the Phase 4a draft content must explicitly plan scenarios that cover:
- Panel-stack composition (how panels are stacked/combined/ordered/updated)
- Embedding lifecycle (init/load/mount/render/refresh/dispose; state transitions)
- Regression-sensitive integration states (integration boundaries and states likely to regress)

## Evidence available in this benchmark bundle
Only the following fixture evidence is provided:
- `fixture:BCED-1719-blind-pre-defect-bundle/BCED-1719.issue.raw.json` (Jira raw issue export; truncated in the benchmark evidence)
- `fixture:BCED-1719-blind-pre-defect-bundle/BCED-1719.customer-scope.json`

No Phase 4a runtime artifacts are included (e.g., **no** `context/artifact_lookup_BCED-1719.md`, **no** `context/coverage_ledger_BCED-1719.md`, **no** `phase4a_spawn_manifest.json`, **no** `drafts/qa_plan_phase4a_r1.md`).

## Phase 4a alignment assessment for this benchmark
### Contract alignment (phase4a)
- **Cannot be demonstrated from provided evidence.** The benchmark evidence does not include:
  - Phase 4a spawn manifest (`phase4a_spawn_manifest.json`), nor
  - The required Phase 4a output draft (`drafts/qa_plan_phase4a_r<round>.md`).

Therefore, there is no artifact to inspect for:
- subcategory-only structure compliance,
- absence of forbidden top-layer categories,
- atomic action chains and observable verification leaves,
- and (critically for this case) explicit coverage of panel-stack composition, embedding lifecycle, and regression-sensitive integration states.

### Case focus coverage (panel-stack composition, embedding lifecycle, regression-sensitive integration states)
- **Not verifiable with the provided evidence.** The only provided items are Jira metadata and a customer-scope flag; neither contains a Phase 4a plan or scenario set.

## Benchmark outcome (advisory)
- **Status**: **BLOCKED (insufficient evidence to evaluate phase4a output)**
- **Reason**: Phase 4a contract requires a draft artifact (`drafts/qa_plan_phase4a_r<round>.md`) and Phase 4a prerequisites (artifact lookup + coverage ledger) to confirm the required planning focus. These are not present in the blind_pre_defect bundle evidence provided to this benchmark run.

## What would be needed to pass this benchmark (minimum artifacts)
To demonstrate the skill satisfies **NE-P4A-COMPONENT-STACK-001** under **phase4a**, the evidence set would need to include at least:
1) `context/artifact_lookup_BCED-1719.md`
2) `context/coverage_ledger_BCED-1719.md` (and `.json` if a knowledge pack is active)
3) `phase4a_spawn_manifest.json`
4) `drafts/qa_plan_phase4a_r1.md` (or higher round)

With (4), reviewers can check that the Phase 4a draft includes subcategories and scenarios explicitly covering:
- panel-stack composition behaviors,
- embedding lifecycle state transitions,
- regression-sensitive integration states,
while remaining subcategory-only and structurally valid per the Phase 4a contract.