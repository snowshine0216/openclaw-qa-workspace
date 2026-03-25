# NE-P1-CONTEXT-INTAKE-001 — Phase 1 Context Intake Contract Check (BCED-1719)

## Benchmark intent (phase_contract • advisory)
Validate that **Phase 1 context intake** (spawn-manifest generation scope) preserves:
1) **component-stack constraints**
2) **embedding lifecycle assumptions**
3) **integration-sensitive customer expectations**

…and that the output expectation is aligned with **Phase 1** (i.e., produce a Phase 1-oriented intake summary and the implied spawn/evidence routing expectations, not later-phase artifacts).

---

## Evidence-derived context for BCED-1719 (native-embedding)

### 1) Component / stack constraints that must be preserved in intake
From fixture evidence:
- Feature labels: **Embedding_SDK**, **Library_and_Dashboards** (indicates SDK embedding + Library/Dashboards surface area; cross-component integration risk).
- Deliverable hint: `customfield_10045` includes **"REST API Doc"** (implies contract-level API behavior expectations; phase1 should route to authoritative primary sources rather than generic web fetch).

**Phase 1 intake implication:** requested source families should include the primary systems needed to cover SDK + UI + API contracts (at minimum Jira; likely GitHub and/or Confluence depending on where REST/API contract and embedding SDK details live—Phase 1 is the place to spawn those digestions).

### 2) Embedding lifecycle assumptions to carry forward
From fixture evidence:
- Feature family: **native-embedding** (benchmark-provided).
- Parent initiative: **"Enhance Embedding & Integration Capabilities"** (suggests end-to-end embedding flow considerations; lifecycle spans authoring/publishing to consumption/embedding and runtime access).

**Phase 1 intake implication:** the intake must not collapse the feature into a single component; it must preserve that the QA plan will need lifecycle coverage across:
- creation/configuration of embedded assets
- publish/share permissions & access
- embedding consumption in host context
- interaction between Library/Dashboards and embedding SDK

(Phase 1 doesn’t draft scenarios, but it must route evidence collection so lifecycle assumptions remain testable later.)

### 3) Integration-sensitive customer expectations
From fixture evidence:
- Explicit customer reference present: **CVS Pharmacy, Inc. — CS0928640** (in two customer custom fields)
- `customer_signal_present: true` and policy note: “Feature carries explicit customer references in Jira custom fields.”

**Phase 1 intake implication:** treat as integration-sensitive and customer-impacting; evidence collection should ensure:
- no loss of customer expectation signals during intake
- any supporting/customer-linked issues (if later provided) remain under **support-only context policy** (no defect analysis)

---

## Phase 1 contract alignment (what Phase 1 must do, per skill snapshot)

### Required Phase 1 behavior (from SKILL snapshot)
- Phase 1 generates **one spawn request per requested source family** plus **support-only Jira digestion** when `supporting_issue_keys` exist.
- Phase 1 output is **`phase1_spawn_manifest.json`**.
- Phase 1 `--post` validates: spawn policy, evidence completeness, support relation map/summaries, and **non-defect routing**; on failure exits `2` and prints `REMEDIATION_REQUIRED: <source_family>`.

### Context-intake preservation checks (pass/fail against contract intent)
This benchmark is **blind_pre_defect** and provides only fixture + skill snapshot, not an actual produced manifest. Therefore, this benchmark can only assess whether the **workflow contract** (as defined in snapshot) is sufficient to preserve the required context elements in Phase 1.

**Check A — Component-stack constraints preservation:**
- The snapshot requires Phase 1 to spawn per “requested source family”, but the evidence provided does not show how “requested_source_families” gets derived for BCED-1719 in this run.
- However, the contract *does* enforce correct source routing (Jira/Confluence/GitHub only via approved skills) and persists evidence under `context/`.

**Assessment:** *Partially supported by contract; run-specific adequacy cannot be proven without the actual Phase 1 spawn manifest.*

**Check B — Embedding lifecycle assumptions preservation:**
- The contract does not explicitly mention embedding lifecycle, but it enforces a mechanism to gather evidence across multiple systems and preserves it in `context/` for Phase 2/3 indexing.

**Assessment:** *Supported indirectly by contract; run-specific coverage depends on whether Phase 1 spawns the right source families for SDK + UI/API documentation.*

**Check C — Integration-sensitive customer expectations preservation:**
- Fixture shows explicit customer signal.
- Snapshot includes support-only Jira policy and persistent context artifacts for supporting issues, but the fixture bundle provides **no linked issues** and no `supporting_issue_keys` list.

**Assessment:** *Customer signal is detectable from Jira fields (fixture). Contract supports preserving it as context; support-only pathways exist if supporting issues are supplied. Run-specific spawns cannot be verified without the manifest.*

---

## Phase 1 deliverable expectation for this benchmark (what should exist after Phase 1)
To satisfy the benchmark focus for BCED-1719 in Phase 1, the orchestrated Phase 1 output (not present in evidence) would need to reflect:

1) **Requested source families** include, at minimum:
   - **jira** (authoritative feature definition + customer fields)
   - plus whatever system holds embedding SDK + REST/API contract + Library/Dashboards integration detail (often **github** and/or **confluence**; exact choice cannot be asserted from evidence).

2) **Customer expectation signal** is not dropped:
   - captured from Jira custom fields referencing **CVS Pharmacy, Inc. (CS0928640)**

3) **Support-only policy readiness**:
   - if supporting issues are later attached, Phase 1 must spawn support-only digestion and ensure `context_only_no_defect_analysis` routing.

4) **Constraints are carried forward as context**, enabling later phases to build scenarios around:
   - Embedding_SDK × Library_and_Dashboards integration seams
   - REST API documentation expectations
   - embedding lifecycle across authoring → publish/share → embed/consume

---

## Benchmark verdict (advisory)
- **Phase alignment:** PASS (this artifact stays within Phase 1 contract/intake expectations; no later-phase drafting claims).
- **Case focus coverage:** PARTIAL (the contract supports preserving constraints/assumptions/expectations, but the benchmark evidence set does not include the actual Phase 1 spawn manifest or derived requested source families; therefore we cannot confirm the run’s concrete context-intake preservation beyond what’s implied by the contract and fixture fields).

---

## Short execution summary
Used only provided skill snapshot + fixture bundle evidence to evaluate Phase 1 context-intake contract fit for BCED-1719. Confirmed customer signal (CVS/CS0928640) and cross-component labels (Embedding_SDK, Library_and_Dashboards) that Phase 1 intake must preserve via appropriate source-family spawns and context artifact retention. Could not fully verify Phase 1 execution correctness because the actual `phase1_spawn_manifest.json` output is not included in evidence.