# NE-P1-CONTEXT-INTAKE-001 — Phase 1 Context Intake Contract Check (BCED-1719)

## Scope of this benchmark artifact
This benchmark case evaluates whether the **qa-plan-orchestrator** skill’s **Phase 1** contract (context intake / spawn planning) preserves:
1) **component-stack constraints** (source routing and evidence skill boundaries),
2) **embedding lifecycle assumptions** (native-embedding family context needs),
3) **integration-sensitive customer expectations** (customer-linked expectations must be carried into Phase 1 intake and downstream evidence capture),

…under **blind_pre_defect** evidence mode for **Feature: BCED-1719** (Feature family: **native-embedding**, knowledge pack: **native-embedding**).

This is an **advisory** phase-contract check: it validates Phase 1’s *intake/orchestration behavior*, not the downstream content quality of drafts.

---

## Evidence reviewed (authoritative)
From the provided benchmark evidence:
- `skill_snapshot/SKILL.md`
- `skill_snapshot/reference.md`
- `skill_snapshot/README.md`
- `fixture:BCED-1719-blind-pre-defect-bundle/BCED-1719.issue.raw.json`
- `fixture:BCED-1719-blind-pre-defect-bundle/BCED-1719.customer-scope.json`

No additional sources were used.

---

## Phase 1 contract alignment (what Phase 1 must do)
Per `skill_snapshot/SKILL.md` and `skill_snapshot/reference.md`:
- **Phase 1 entry:** `scripts/phase1.sh`
- **Phase 1 work:** *generate one spawn request per requested source family* plus support-only Jira digestion requests when provided.
- **Phase 1 output:** `phase1_spawn_manifest.json`
- **Phase 1 --post:** validate spawn policy, evidence completeness, support relation map / summaries, and **non-defect routing**; on failure exits `2` with `REMEDIATION_REQUIRED: <source_family>`.

**Spawn policy constraints that must be preserved by context intake:**
- Evidence must be routed via approved evidence skills (Jira/Confluence/GitHub; no generic web fetch substitution).
- Supporting Jira issues must stay in `context_only_no_defect_analysis` mode.
- Orchestrator must pass `requests[].openclaw.args` to `sessions_spawn` **exactly as-is** (no `streamTo` for `runtime:"subagent"`).

---

## Benchmark focus coverage
### 1) Component-stack constraints are preserved (PASS — contract-level)
Evidence in `reference.md` defines hard source routing:
- Use primary evidence skills: `jira-cli` for Jira, `confluence` for Confluence, `github` for GitHub.
- Do not substitute browser/generic fetch for Jira/Confluence/GitHub.

Evidence in `SKILL.md` defines orchestrator responsibilities strictly:
- Orchestrator only calls phase scripts and spawns from manifests; it does not inline logic.
- Orchestrator must not modify spawn args (explicitly: **no `streamTo`**).

**Why this satisfies the benchmark focus (Phase 1 intake):**
- Phase 1 intake is explicitly constrained to generate spawn requests per source family and validate policy in `--post`.
- The separation of concerns (phase scripts decide; orchestrator executes) preserves stack constraints by design.

**Residual advisory note:** The evidence set does not include the actual `scripts/phase1.sh` or a generated `phase1_spawn_manifest.json`, so this is a *contract compliance assessment*, not an execution proof.

### 2) Embedding lifecycle assumptions are preserved (PARTIAL — limited by blind pre-defect evidence)
The benchmark states feature family **native-embedding** and knowledge pack key **native-embedding**.

Contract evidence supports lifecycle assumption preservation in Phase 1 in the following way:
- `reference.md` Spawn Manifest Contract: Phase 1 manifests may carry pack-aware metadata including:
  - `knowledge_pack_key`, `knowledge_pack_version`, and **must include** `knowledge_pack_summary_path` when pack is active.
- `reference.md` `task.json` and `run.json` include fields to persist:
  - feature family, knowledge pack resolution, pack path/version, and retrieval mode.

**What cannot be confirmed from provided evidence:**
- No `task.json` / `run.json` for this run is provided.
- No `context/knowledge_pack_summary_<feature-id>.md` is provided.
- No proof that Phase 1 would request the correct source families specifically for *embedding lifecycle* (SDK + integration surfaces) is available in this blind bundle.

**Assessment:** The Phase 1 contract provides the correct mechanism to carry lifecycle assumptions via pack identity and structured state, but this benchmark bundle does not contain run artifacts to prove it occurred for BCED-1719.

### 3) Integration-sensitive customer expectations are preserved (PASS — intake has the required signals to carry forward)
Fixture evidence shows BCED-1719 has explicit customer signal:
- `BCED-1719.customer-scope.json`:
  - `customer_signal_present: true`
  - customer references: `{ CVS Pharmacy, Inc. - CS0928640 }`
  - `customer_issue_policy: "all_customer_issues_only"`
  - note: “Feature carries explicit customer references in Jira custom fields.”

Phase 1 contract supports preserving such expectations as context evidence because:
- Phase 1 is the point where evidence collection is instantiated (spawn per requested source family).
- `reference.md` defines storage locations under `context/` for supporting artifacts and request fulfillment; Phase 1 `--post` validates evidence completeness and non-defect routing.

**Advisory gap:** The contract does not explicitly enumerate a “customer-scope ingestion” artifact name in Phase 1; it relies on source-family Jira digestion to capture these custom fields into context. With only the blind fixture, we cannot confirm the spawn manifest includes a Jira digestion request that explicitly calls out customer custom fields.

---

## Phase 1 alignment verdict (primary checkpoint)
**Overall:** 
- **Phase 1 contract alignment:** PASS (the provided skill snapshot defines Phase 1 responsibilities and guardrails consistent with context-intake requirements).
- **Benchmark focus coverage:**
  - Component-stack constraints: PASS (explicit routing + spawn arg immutability).
  - Embedding lifecycle assumptions: PARTIAL (mechanism exists, execution evidence absent).
  - Integration-sensitive customer expectations: PASS (customer signal is present in Jira fixture; Phase 1’s Jira evidence spawn mechanism is the correct intake path, but no manifest proof in bundle).

---

## Advisory remediation suggestions (non-blocking, Phase 1 only)
To strengthen Phase 1’s demonstrability for this benchmark family (native-embedding, integration-sensitive customers):
1) Ensure Phase 1 Jira digestion tasks explicitly instruct the subagent to extract and persist customer custom fields (e.g., `customfield_10355`, `customfield_10586`) into a named context artifact under `context/`.
2) When a knowledge pack is active (native-embedding), ensure Phase 1 manifests always include `knowledge_pack_key` and `knowledge_pack_summary_path` so downstream phases can preserve embedding lifecycle assumptions reliably.

---

## Short execution summary
- Reviewed only the provided skill snapshot contracts and the BCED-1719 blind pre-defect fixture.
- Verified Phase 1 contract includes strict source routing, spawn arg immutability, and non-defect routing validation.
- Confirmed BCED-1719 carries explicit customer signals; Phase 1’s intended Jira evidence intake path is appropriate, though this bundle does not include generated run artifacts to prove manifest contents.