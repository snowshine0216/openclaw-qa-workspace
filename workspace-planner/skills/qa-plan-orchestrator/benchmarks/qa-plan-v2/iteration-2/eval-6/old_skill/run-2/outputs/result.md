# P4B-LAYERING-001 — Phase 4b (BCED-2416) Contract Check

**Benchmark intent:** Verify the qa-plan-orchestrator Phase 4b output/behavior satisfies the *phase contract* for **canonical top-layer grouping without collapsing scenarios** (advisory priority), aligned to **Phase 4b**.

## Evidence-based Phase 4b contract coverage (canonical top-layer grouping without collapsing scenarios)

### What Phase 4b must do (per snapshot contract)
From `skill_snapshot/references/phase4b-contract.md`:
- **Purpose:** Group Phase 4a draft into the **canonical top-layer taxonomy** **without merging away scenario granularity**.
- **Required inputs:**
  - latest `drafts/qa_plan_phase4a_r<round>.md`
  - relevant `context/` artifacts
  - `context/artifact_lookup_<feature-id>.md`
- **Required output:** `drafts/qa_plan_phase4b_r<round>.md`
- **Output shape:**
  - preserve central topic line
  - group scenarios under canonical top-layer categories
  - preserve subcategory layer between top layer and scenario
  - preserve scenario nodes + atomic steps + verification leaves
  - no silent shrink of coverage
  - **do not apply few-shot cleanup** (Phase 6 owns it)
- **Canonical top-layer list:**
  - EndToEnd
  - Core Functional Flows
  - Error Handling / Recovery
  - Regression / Known Risks
  - Compatibility
  - Security
  - i18n
  - Accessibility
  - Performance / Resilience
  - Out of Scope / Assumptions
- **Anti-compression rule:**
  - Do not merge distinct Workstation-only vs Library-gap scenarios when outcomes/risks differ.
  - Support-risk visibility must remain after grouping.

### Case focus: “canonical top-layer grouping without collapsing scenarios”
The snapshot Phase 4b contract explicitly and directly encodes this benchmark’s focus:
- “**canonical top-layer taxonomy**” (required)
- “**without merging away scenario granularity**” + “**Anti-Compression Rule**” (required)

This satisfies the benchmark expectation that the case focus is explicitly covered.

## Alignment to primary phase under test: Phase 4b
The snapshot workflow places this requirement specifically in Phase 4b:
- `skill_snapshot/SKILL.md` Phase 4b: “spawn the canonical top-layer grouper” and “**preserve scenario granularity** … few-shot cleanup to Phase 6.”
- `skill_snapshot/reference.md` Phase 4b gate: post-validation requires coverage preservation against Phase 4a input + canonical layering + hierarchy + E2E minimum + executable-step validation.

This satisfies the benchmark expectation that the output aligns with Phase 4b.

## What cannot be demonstrated in blind_pre_defect evidence mode (blockers)
This benchmark bundle does **not** include any run artifacts:
- no `drafts/qa_plan_phase4a_r*.md`
- no `drafts/qa_plan_phase4b_r*.md`
- no `context/artifact_lookup_BCED-2416.md`
- no `phase4b_spawn_manifest.json`

Therefore, with the provided evidence only, we can **confirm the contract’s existence and explicit coverage of the benchmark focus**, but we **cannot verify an actual produced Phase 4b draft** preserved scenario granularity or used the canonical top-layer categories.

## Evidence used
- `skill_snapshot/SKILL.md`
- `skill_snapshot/reference.md`
- `skill_snapshot/README.md`
- `skill_snapshot/references/phase4b-contract.md`
- Fixture context (feature description only; not sufficient to prove Phase 4b outputs):
  - `fixture:BCED-2416-blind-pre-defect-bundle/BCED-2416-embedding-dashboard-editor-workstation.md`
  - `fixture:BCED-2416-blind-pre-defect-bundle/BCED-2416.issue.raw.json`
  - `fixture:BCED-2416-blind-pre-defect-bundle/BCED-2416.customer-scope.json`

---

## Short execution summary
- Checked the authoritative **Phase 4b contract** in the skill snapshot.
- Confirmed the benchmark focus (“canonical top-layer grouping without collapsing scenarios”) is **explicitly mandated** in Phase 4b via required canonical categories and an anti-compression rule.
- Noted a **blocker**: no Phase 4a/4b draft artifacts were provided, so actual compliance of generated drafts cannot be validated from this bundle alone.