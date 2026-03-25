# NE-P4A-COMPONENT-STACK-001 — Phase 4a advisory check (BCED-1719 / native-embedding)

## Benchmark intent (what must be demonstrated)
This benchmark checks that **Phase 4a planning** for **a single embedding component** explicitly covers the case focus:
- **panel-stack composition**
- **embedding lifecycle**
- **regression-sensitive integration states**

And that the output stays within the **Phase 4a contract**: a **subcategory-only** QA draft (no canonical top-layer grouping).

## Evidence available (blind pre-defect)
Only the following benchmark evidence was provided:
- Jira export: `BCED-1719.issue.raw.json` (partial / truncated)
- Customer scope summary: `BCED-1719.customer-scope.json`
- Skill workflow/contract snapshot (Phase model + Phase 4a contract)

No Phase 0–3 runtime artifacts (e.g., `context/artifact_lookup_*.md`, `context/coverage_ledger_*.md`) and no Phase 4a draft (`drafts/qa_plan_phase4a_r1.md`) were provided in the fixture.

## Phase 4a contract alignment (what Phase 4a output must look like)
From the provided `references/phase4a-contract.md` (authoritative):
- Output must be a **Phase 4a subcategory-only draft** with:
  - central topic
  - subcategory
  - scenario
  - atomic action chain
  - observable verification leaves
- Must **not** introduce canonical top categories (examples forbidden: `Security`, `Compatibility`, `EndToEnd`, `i18n`).
- If evidence is insufficient, Phase 4a allows **one bounded supplemental research pass**, saved under `context/`, and `artifact_lookup_<feature-id>.md` must be updated before finalizing.

## Advisory benchmark assessment
### 1) Case focus coverage (panel-stack composition, embedding lifecycle, regression-sensitive integration states)
**Not verifiable from provided evidence.**
- The benchmark requires that Phase 4a planning covers these topics.
- However, the fixture does **not** include the required Phase 4a inputs (`context/artifact_lookup_*.md`, `context/coverage_ledger_*.md`) nor the Phase 4a output draft itself.
- The Jira/customer-scope exports establish the feature identity (BCED-1719) and that it is in the embedding/integration initiative area, but do not provide scenario-level QA planning content to validate that panel-stack composition / lifecycle / integration-state regressions are planned.

**Result:** advisory expectation **cannot be confirmed** (insufficient artifacts).

### 2) Output aligns with primary phase (phase4a)
**Not verifiable from provided evidence.**
- Phase 4a alignment requires checking that the produced artifact is a **subcategory-only** XMindMark draft, without top-layer category leakage, and with atomic steps.
- No `drafts/qa_plan_phase4a_r<round>.md` was provided.

**Result:** advisory expectation **cannot be confirmed** (missing Phase 4a draft artifact).

## Conclusion
Given blind pre-defect evidence, this benchmark case cannot be fully evaluated because the **Phase 4a deliverable artifact** (and its prerequisite runtime context artifacts) are not included. The provided evidence is sufficient to restate the Phase 4a contract expectations, but **insufficient to demonstrate** that the orchestrator/plan satisfies the required **panel-stack composition / embedding lifecycle / regression-sensitive integration states** coverage focus.

## Blockers to completing the benchmark verification
To assess this benchmark as intended, the following artifacts are needed (per the skill snapshot phase model):
- `context/artifact_lookup_BCED-1719.md`
- `context/coverage_ledger_BCED-1719.md` (and `.json` if a knowledge pack is active)
- `drafts/qa_plan_phase4a_r1.md` (or latest Phase 4a round)

With those, verification would check:
- Phase 4a structure constraints (subcategory-only, atomic steps, observable leaves)
- Presence of scenarios explicitly covering:
  - panel-stack composition (stacking rules, interactions, layout/resize, z-order/focus)
  - embedding lifecycle (init/mount, load, render, refresh, dispose/unmount, re-embed)
  - regression-sensitive integration states (host navigation, auth/session transitions, error/retry, network/offline, multi-embed coexistence)