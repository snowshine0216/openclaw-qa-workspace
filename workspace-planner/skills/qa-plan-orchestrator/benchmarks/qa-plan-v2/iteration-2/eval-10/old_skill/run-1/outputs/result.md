# Benchmark Evaluation — P6-QUALITY-POLISH-001 (BCIN-6709 / report-editor)

## Scope
Primary phase/checkpoint under test: **Phase 6** (final quality pass).

Case focus (must be explicit): **final quality pass preserves layering and executable wording**.

Evidence mode: **blind_pre_defect** (use only provided snapshot + fixture evidence; no claims about actual run outputs).

---

## Phase 6 contract alignment (from skill snapshot)

### What Phase 6 is required to do
Per **skill_snapshot/SKILL.md** and **skill_snapshot/reference.md**:

- **Entry:** `scripts/phase6.sh`
- **Work:** spawn the **final layering/search/few-shots quality pass**
- **Output manifest:** `phase6_spawn_manifest.json`
- **Post-gate required outputs:**
  - `drafts/qa_plan_phase6_r<round>.md`
  - `context/quality_delta_<feature-id>.md`
  - plus “final layering validators”

### Layering requirements are explicit
Per **skill_snapshot/references/review-rubric-phase6.md**:

Final layering must be:
1. central topic
2. canonical top category
3. subcategory
4. scenario
5. atomic action chain
6. observable verification leaves

And Phase 6 must “produce the final layered QA plan… and enforce final-quality structure before promotion.”

### Executable wording is enforced via validators
Per **skill_snapshot/reference.md** validator list and phase gates:

- Phase 6 gate includes **executable-step checks** (via `validate_executable_steps`) and hierarchy/layering checks (including `validate_final_layering`, `validate_xmindmark_hierarchy`).

This directly targets the benchmark’s “executable wording” requirement.

---

## Coverage preservation constraint (Phase 6 quality pass must not break prior coverage)

Although the benchmark focus is “layering + executable wording”, Phase 6 also has an explicit preservation rule:

- **review-rubric-phase6.md**: “preserve reviewed coverage scope from Phase 5b unless an explicit exclusion is carried with evidence” and “preserve support-derived scenarios… and Library-vs-Workstation gap scenarios through the final cleanup pass.”
- **reference.md** Phase 6 gate: “passes … reviewed coverage preservation, final layering, hierarchy, E2E minimum, and executable-step checks, and `quality_delta` exists.”

This matters because “quality polish” could otherwise remove scenarios during cleanup; the contract explicitly prevents that.

---

## Required quality delta structure (explicit audit trail)

Phase 6 requires `context/quality_delta_<feature-id>.md` with mandatory sections (review-rubric-phase6.md):

- `## Final Layer Audit`
- `## Few-Shot Rewrite Applications`
- `## Exceptions Preserved`
- `## Verdict`

Additionally: “The final layer audit must explicitly note that support-derived coverage and deep-research-backed coverage were preserved.”

This contract requirement is aligned with the benchmark’s “final quality pass preserves layering” by forcing an explicit audit of final layering and preservation.

---

## Benchmark expectation checks

### [phase_contract][advisory] Case focus explicitly covered
**Pass (by contract evidence).**

- “Final quality pass” is Phase 6’s stated purpose/work.
- “Preserves layering” is explicitly enforced by the **Final Layering** rules + **validate_final_layering** gate + mandatory **Final Layer Audit** section.
- “Executable wording” is enforced by Phase 6 gate including **validate_executable_steps**, and by the plan-format rules requiring nested atomic steps and observable verification leaves.

### [phase_contract][advisory] Output aligns with primary phase phase6
**Pass (by contract evidence).**

Phase 6 outputs and gates are explicitly defined:
- `phase6_spawn_manifest.json`
- `drafts/qa_plan_phase6_r<round>.md`
- `context/quality_delta_<feature-id>.md`
- final layering + executable-step validators

---

## Limitations / what cannot be verified in blind_pre_defect mode

No run directory artifacts (e.g., an actual `drafts/qa_plan_phase6_r1.md` or `context/quality_delta_BCIN-6709.md`) are provided in the fixture evidence, so this benchmark evaluation can only confirm that the **workflow package/contract** covers the required Phase 6 quality-polish behaviors, not that a specific execution produced compliant artifacts for BCIN-6709.

---

## Minimal Phase 6 compliance checklist (for this benchmark focus)

To satisfy the benchmark in an actual run, Phase 6 must produce artifacts where:

1. **Layering is correct** (central topic → category → subcategory → scenario → action chain → verification leaves).
2. **Steps are executable** (atomic actions; observable outcomes as leaves; no legacy Action/Expected labels).
3. **Quality delta explicitly audits** final layering and notes preservation of support/deep-research coverage.

---

# Short execution summary

Using only the provided skill snapshot evidence, Phase 6 is contractually defined as a final quality-polish pass that (a) enforces canonical layering through explicit layering rules and final-layer validators, and (b) enforces executable wording through executable-step validation. The required `quality_delta` structure further forces an explicit audit trail that the final pass preserved reviewed/support/research-backed coverage during cleanup.