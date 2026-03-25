# NE-P1-CONTEXT-INTAKE-001 — Phase 1 (Context Intake) Contract Check

## Benchmark scope
- **Feature:** BCED-1719
- **Feature family / knowledge pack:** native-embedding
- **Primary phase under test:** **phase1**
- **Evidence mode:** blind_pre_defect
- **Priority:** advisory
- **Case focus:** Context intake must preserve:
  1) **component-stack constraints**
  2) **embedding lifecycle assumptions**
  3) **integration-sensitive customer expectations**

## Phase 1 contract alignment (per skill snapshot)
Phase 1 responsibilities (authoritative):
- Generate **one spawn request per requested source family** (plus support-only Jira digestion when provided).
- Output `phase1_spawn_manifest.json`.
- `--post` validates spawn policy, evidence completeness, support relation map/summaries (if applicable), and non-defect routing.

**What this benchmark can verify using provided evidence:**
- Whether the **Phase 1 context-intake design** (as specified by the skill snapshot contracts) is capable of preserving the case-focus constraints.
- Whether the benchmark’s focus items are **explicitly covered** as Phase 1 intake obligations (i.e., routed into source-family evidence collection and/or support/customer context capture) rather than being deferred implicitly.

## Evidence-derived context that Phase 1 must preserve
From fixture evidence for **BCED-1719**:
- **Integration / embedding context signals:**
  - Labels include **`Embedding_SDK`** and **`Library_and_Dashboards`** (BCED-1719.issue.raw.json; BCED-1719.customer-scope.json)
- **Integration-sensitive customer expectations:**
  - Explicit customer reference present: **“{ CVS Pharmacy, Inc. - CS0928640 }”** in Jira custom fields (BCED-1719.issue.raw.json; BCED-1719.customer-scope.json)
  - `customer_signal_present: true` and notes: “Feature carries explicit customer references in Jira custom fields.” (BCED-1719.customer-scope.json)

**Implication for Phase 1 intake:**
- Phase 1 must ensure evidence collection includes the **Jira feature issue** at minimum, and that context capture preserves:
  - embedding/integration stack identifiers (SDK/library/dashboard surfaces implied by labels)
  - customer-linked expectation sensitivity (customer reference + CS ticket pointer)

## Assessment vs benchmark expectations
### 1) Case focus explicitly covered? **Partially / not provably satisfied (advisory)**
Using only provided evidence, the skill snapshot Phase 1 contract:
- Explicitly covers *mechanics* of intake (spawn per source family; support-only Jira handling; validation for evidence completeness and non-defect routing).
- **Does not explicitly enumerate** preservation of:
  - component-stack constraints (e.g., SDK/runtime/version/platform splits)
  - embedding lifecycle assumptions (create/update/delete embeddings; refresh; caching; auth/session lifecycle)
  - integration-sensitive customer expectations (customer-specific constraints, escalation sensitivity)

However, the snapshot does establish a pathway for customer/support context to be persisted under `context/` **when supporting issues are provided**, and it recognizes customer signals/policy at a higher level (via Phase 0 runtime setup fields and support policies).

**Gap for this benchmark:** In the supplied evidence, there is **no Phase 1 spawn manifest** (nor Phase 0 runtime setup/task.json) demonstrating that Phase 1 actually routes collection to capture:
- Jira feature details + customer-field extraction as required context artifacts
- any additional source families needed for “component-stack constraints” and “embedding lifecycle assumptions” for a native-embedding feature

Therefore, the benchmark expectation “case focus is explicitly covered” cannot be confirmed from artifacts present.

### 2) Output aligns with primary phase phase1? **Aligned in principle; no produced Phase 1 artifact to verify**
The authoritative contract states Phase 1 must output `phase1_spawn_manifest.json`. In provided evidence, **no run directory artifacts** are present (no manifest, no context folder outputs). Thus, we can only confirm that the workflow definition is Phase-1-aligned, not that the required Phase 1 output was produced for BCED-1719 in this benchmark fixture.

## Advisory verdict
- **Phase 1 contract alignment:** Yes (per SKILL.md/reference.md).
- **Benchmark focus coverage:** **Not demonstrably satisfied with provided evidence** (missing Phase 1 manifest and any context-intake artifacts showing preservation of component-stack constraints, embedding lifecycle assumptions, and customer expectations).

## What would constitute a Phase 1 “pass” for this benchmark (evidence expectations)
To satisfy NE-P1-CONTEXT-INTAKE-001 under the current phase model, Phase 1 outputs for BCED-1719 should (at minimum) show:
- `phase1_spawn_manifest.json` containing spawn requests that ensure collection of:
  - **Jira feature issue** evidence (BCED-1719) sufficient to retain labels (`Embedding_SDK`, `Library_and_Dashboards`) and customer fields indicating CVS/CS0928640
  - any additional required source families for **native-embedding** that are needed to preserve:
    - component-stack constraints (SDK surface area; library vs dashboards integration)
    - embedding lifecycle assumptions (expected lifecycle flows that testing must cover)
- If customer/support artifacts are in scope by policy, Phase 1/Phase 1 post should ensure generation/validation of:
  - `context/supporting_issue_request_<feature-id>.md` and relation/summary artifacts **when supporting_issue_keys are provided**

Because this benchmark is **blind_pre_defect**, the absence of those concrete Phase 1 artifacts is treated as an inability to demonstrate compliance rather than proof of failure in execution.