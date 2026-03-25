# Benchmark P4B-LAYERING-001 — Phase 4b (BCED-2416)

## Determination
The **qa-plan-orchestrator Phase 4b contract** and workflow package **explicitly cover the case focus**: **canonical top-layer grouping without collapsing scenarios**.

This benchmark is **pass (advisory)** at the **phase-contract level** because the provided evidence includes a dedicated Phase 4b contract that:
- mandates **canonical top-layer taxonomy**
- mandates **anti-compression / scenario granularity preservation**
- blocks “few-shot cleanup” until Phase 6
- requires Phase 4b output to be a **grouped** version of Phase 4a **without silently shrinking coverage**

## Evidence-based checks (Phase 4b alignment)

### 1) Canonical top-layer grouping is defined and required
**Evidence:** `skill_snapshot/references/phase4b-contract.md`
- Purpose: “**Group** the Phase 4a draft into the **canonical top-layer taxonomy**…”
- Canonical Top Layer list is explicitly enumerated:
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

This directly satisfies the benchmark focus on “canonical top-layer grouping”.

### 2) “Without collapsing scenarios” is explicitly enforced (anti-compression)
**Evidence:** `skill_snapshot/references/phase4b-contract.md`
- Purpose: “…without **merging away scenario granularity**.”
- Output shape requires preservation of:
  - “**scenario nodes**, atomic action chains, and observable verification leaves”
- Explicit constraint: “**grouping and refactor may not silently shrink coverage**”
- **Anti-Compression Rule**:
  - “Do **not merge** distinct Workstation-only and Library-gap scenarios when their outcomes or risks differ.”
  - “Relation-map-derived support risks must remain visible after canonical grouping.”

This directly satisfies the benchmark focus on “without collapsing scenarios.”

### 3) Canonical layering/hierarchy is specified (phase4b-specific layering)
**Evidence:** `skill_snapshot/references/phase4b-contract.md`
- Layering Rules define the required hierarchy:
  - top category → subcategory → scenario → atomic action chain → observable verification leaves
- Output Shape requires preserving the **subcategory layer between top layer and scenario**.

This confirms Phase 4b is about restructuring layers, not rewriting scenarios.

### 4) Phase model alignment: Phase 4b is implemented as a dedicated scripted checkpoint
**Evidence:** `skill_snapshot/SKILL.md`, `skill_snapshot/reference.md`
- Phase 4b:
  - Entry: `scripts/phase4b.sh`
  - Work: “spawn the **canonical top-layer grouper**”
  - Output: `phase4b_spawn_manifest.json`
  - `--post` requires `drafts/qa_plan_phase4b_r<round>.md` and validates:
    - “coverage preservation against the Phase 4a input draft”
    - “canonical layering, hierarchy”
    - “E2E minimum”
    - “executable-step validators pass”

This matches the benchmark’s requirement that the output aligns to **primary phase: phase4b**.

### 5) Exception handling preserves meaning instead of forcing compression
**Evidence:** `skill_snapshot/references/phase4b-contract.md`
- If a scenario does not fit a canonical layer, the contract requires preserving original grouping and adding:
  - `<!-- top_layer_exception: kept under original grouping because no canonical layer fit without losing meaning -->`

This is a concrete mechanism to avoid collapsing/forcing scenarios into ill-fitting categories.

## Notes on fixture evidence (BCED-2416)
The fixture `BCED-2416-embedding-dashboard-editor-workstation.md` describes many distinct scenario areas (launch, save, cancel/close, auth, navigation, export, UI, performance, security/ACL, compatibility). Phase 4b’s contract would require grouping these into the canonical top-layer categories **while preserving each scenario’s granularity**.

However, the benchmark evidence provided does **not** include an actual Phase 4a draft or a produced Phase 4b draft artifact to validate runtime behavior. This benchmark case is therefore assessed strictly against the **phase-contract/workflow-package coverage**.

## Verdict
- **[phase_contract][advisory] Case focus explicitly covered:** Yes — Phase 4b contract defines canonical top-layer taxonomy and includes explicit anti-compression rules.
- **[phase_contract][advisory] Output aligns with phase4b:** Yes — Phase 4b is the canonical top-layer grouping phase with specified inputs/outputs and post validations.

**Overall: PASS (advisory, phase-contract level).**