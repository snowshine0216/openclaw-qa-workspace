# NE-P4A-COMPONENT-STACK-001 — Phase 4a Contract Check (BCED-1719)

## Benchmark intent (advisory)
Demonstrate that **Phase 4a** planning for **BCED-1719** (feature family: **native-embedding**) explicitly covers the case focus:
- **Single embedding component planning**
- **Panel-stack composition**
- **Embedding lifecycle**
- **Regression-sensitive integration states**

## Evidence available (blind pre-defect)
From the provided fixture bundle, only Jira metadata is available:
- BCED-1719 is a **Feature** under initiative **PRD-125: “Enhance Embedding & Integration Capabilities”**.
- Labels include **Embedding_SDK** and **Library_and_Dashboards**.
- FixVersion present: **26.04**.
- Customer signal present (CVS reference in custom fields).

## Phase alignment requirement
Per the skill snapshot, **Phase 4a output must be a subcategory-only draft** and must be validated via:
- Output artifact: `drafts/qa_plan_phase4a_r<round>.md`
- Structure constraints (subcategory → scenario → atomic steps → observable verifications)
- Forbidden: canonical top-layer categories (e.g., Security/Compatibility/EndToEnd/i18n)

## Determination for this benchmark run
### Can we demonstrate Phase 4a compliance from the provided evidence?
**No.** The benchmark requires evidence of Phase 4a deliverables (a Phase 4a draft and its phase4a post-validation outcome) and explicit coverage of panel-stack composition + embedding lifecycle + regression-sensitive integration states.

However, the provided benchmark evidence does **not** include any of the required Phase 4a runtime artifacts (e.g., `context/artifact_lookup_*.md`, `context/coverage_ledger_*.md`, `phase4a_spawn_manifest.json`, or `drafts/qa_plan_phase4a_r1.md`). With only Jira metadata and no feature description or technical acceptance criteria content, we cannot legitimately generate a Phase 4a scenario draft that is evidence-backed and contract-aligned.

### What is missing to satisfy the advisory focus (Phase 4a)
To assert the orchestrator/skill satisfies this case, the run would need at minimum:
- `context/coverage_ledger_BCED-1719.md` (showing required capability mapping relevant to embedding component + panel-stack + lifecycle)
- `context/artifact_lookup_BCED-1719.md` (evidence index)
- `phase4a_spawn_manifest.json` (showing the Phase 4a writer spawn)
- `drafts/qa_plan_phase4a_r1.md` (showing subcategory-only structure with scenarios that explicitly include):
  - panel-stack composition flows (e.g., embed in stack, stack changes, resize/layout)
  - embedding lifecycle (init → load → render → update → dispose/recreate)
  - regression-sensitive integration states (cross-host navigation, refresh, auth/session edge states)

## Outcome
- **Benchmark expectation: not verifiable with provided blind pre-defect evidence.**
- **Blocker:** No Phase 4a artifacts or sufficient feature requirements text were included, so Phase 4a contract alignment and the case focus coverage cannot be demonstrated.