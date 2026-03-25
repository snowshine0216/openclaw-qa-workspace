# NE-P1-CONTEXT-INTAKE-001 — Phase 1 contract check (BCED-1719 / native-embedding)

## Scope of this benchmark artifact
This benchmark case evaluates **phase1** behavior for the `qa-plan-orchestrator` skill: whether **context intake** (as designed/contracted for Phase 1) preserves:
- **component-stack constraints**
- **embedding lifecycle assumptions**
- **integration-sensitive customer expectations**

Evidence mode is **blind_pre_defect**. This artifact therefore assesses the **Phase 1 contract and inputs available** (from the provided fixture), and whether Phase 1 is specified to capture/preserve the required context dimensions.

## Evidence-derived context that Phase 1 must preserve (BCED-1719)
From the provided Jira fixture bundle:
- Feature: **BCED-1719**
- Feature family: **native-embedding**
- Labels indicate integration surfaces / product areas: **`Embedding_SDK`**, **`Library_and_Dashboards`**
- Customer signal is explicitly present:
  - Customer reference: **CVS Pharmacy, Inc. – CS0928640** appears in customer fields (customfield_10355 and customfield_10586)
  - Fixture explicitly flags: `customer_signal_present: true` and notes customer references exist.

Implications for Phase 1 context intake (what must not be lost):
- **Component stack constraints:** at minimum, this feature touches Embedding SDK and Library/Dashboards surfaces (multi-component integration).
- **Embedding lifecycle assumptions:** implied by “Embedding_SDK” label; lifecycle expectations likely include embedding initialization/auth/session, runtime interactions, and upgrade/compatibility behaviors.
- **Integration-sensitive customer expectations:** explicit customer reference (CVS / CS0928640) indicates customer-driven requirements/expectations must be captured into context artifacts and carried forward.

## Phase 1 contract alignment (authoritative skill snapshot)
Per `skill_snapshot/SKILL.md` and `skill_snapshot/reference.md`, Phase 1 is strictly:
- **Entry:** `scripts/phase1.sh`
- **Work:** “generate one spawn request per requested source family plus support-only Jira digestion requests when provided”
- **Output:** `phase1_spawn_manifest.json`
- **Post step:** validates spawn policy, evidence completeness, support relation map/summaries (when applicable), and non-defect routing.

### Does Phase 1 explicitly preserve the case focus dimensions?
**Partially / indirectly.** Based on the provided Phase 1 contract text:
- Phase 1 is a **routing + spawning** phase; it does **not** itself synthesize or persist interpreted “component-stack constraints” or “embedding lifecycle assumptions.”
- However, Phase 1 is responsible for ensuring **the right evidence collection tasks are spawned** (one per requested source family), and for validating evidence completeness in `--post`.

So whether the case focus is covered at Phase 1 depends on whether the **spawn manifest** would include source families capable of capturing:
- component stack and integration constraints (e.g., Jira, GitHub, Confluence, design docs)
- embedding lifecycle assumptions (likely in specs/docs or code)
- customer expectations (Jira fields already show customer presence; supporting issues may exist but fixture shows no linked issues)

### Gap vs benchmark expectation
The benchmark expectation says: “**Case focus is explicitly covered: context intake preserves component-stack constraints, embedding lifecycle assumptions, and integration-sensitive customer expectations**.”

In the provided snapshot, Phase 1 contract:
- **does not explicitly mention** these three dimensions.
- focuses on “requested source families” and support-only Jira handling.

Therefore, with **only the provided evidence**, we cannot demonstrate that Phase 1 has explicit mechanisms to preserve these dimensions (beyond spawning generic evidence collection).

## Verdict for this benchmark case (Phase 1)
- **Output aligns with primary phase `phase1`:** **Yes** (this artifact evaluates Phase 1 contract and inputs; Phase 1’s defined deliverable is `phase1_spawn_manifest.json`).
- **Case focus explicitly covered by Phase 1 context intake contract:** **Not explicitly demonstrated** from provided evidence.
  - Customer expectation sensitivity is present in the fixture (CVS / CS0928640), but Phase 1 contract does not specify explicit capture/preservation steps for customer expectations beyond evidence routing.
  - Component-stack constraints and embedding lifecycle assumptions are implied by labels, but not explicitly preserved by the Phase 1 contract as written.

## What Phase 1 would need (contract-level) to satisfy this advisory benchmark more directly
Within Phase 1’s scope (spawn manifest generation), an explicit “context intake preservation” mapping would need to be represented by:
- ensuring **requested source families** include at least:
  - **Jira** (for customer signals/requirements, integration constraints described in issue)
  - **GitHub** and/or **Confluence** (for SDK lifecycle contracts, integration docs, component boundaries)
- encoding in Phase 1 spawn tasks (task text) explicit prompts to extract/persist:
  - component stack / surfaces involved (Embedding SDK + Library/Dashboards)
  - embedding lifecycle assumptions
  - customer-specific expectations/constraints for CVS (CS0928640)

No such Phase 1 spawn manifest is included in the benchmark evidence bundle, so this cannot be verified here.