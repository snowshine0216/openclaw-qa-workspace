# QA Plan Orchestrator — Phase 1 (Context Intake) Contract Check
Benchmark: **GRID-P1-CONTEXT-INTAKE-001**  
Primary feature: **BCIN-7231**  
Feature family / knowledge pack: **modern-grid**  
Primary phase under test: **phase1 (context intake)**  
Evidence mode: **blind_pre_defect** (customer issues only; exclude non-customer issues)  
Priority: **advisory**  
Benchmark profile: **global-cross-feature-v1**  
Focus: **context intake preserves banding requirements, style constraints, and rendering assumptions before scenario drafting**

## 1) Evidence Allowed / Evidence Provided
### Allowed by policy
- Customer issues only (per `all_customer_issues_only`)
- Exclude non-customer issues

### Provided in this run
- `./skill_snapshot/SKILL.md` was referenced by instruction, but **no file content was provided in the benchmark evidence list**.
- Fixture reference: `BCIN-7231-blind-pre-defect-bundle` (**no local path; no accessible contents in provided evidence**).
- **No customer issue artifacts were provided** (no tickets, bug reports, screenshots, logs, repro steps, or user narratives).

**Resulting constraint:** There is **insufficient admissible evidence** to perform Phase 1 context intake for BCIN-7231 while complying with the blind evidence policy.

## 2) Phase 1 Contract Expectations (What must be demonstrated)
To satisfy this benchmark’s Phase 1 contract, the context intake output must explicitly preserve and capture—*before any scenario drafting*—the following for BCIN-7231:
1. **Banding requirements** (e.g., row/column banding rules, alternating patterns, grouping banding, pinned/frozen sections interactions).
2. **Style constraints** (e.g., CSS/theming constraints, typography, spacing, color tokens, hover/focus/selection visuals).
3. **Rendering assumptions** (e.g., virtualization, sticky headers/columns, pixel snapping, subpixel behavior, layout measurements, RTL, zoom, DPR).

And it must remain aligned to **phase1**: intake/constraints/assumptions only, not scenarios/test cases.

## 3) Observed Output Artifacts
No Phase 1 artifacts could be generated or reviewed, because:
- No admissible customer-issue evidence was supplied to intake.
- The referenced fixture bundle is not accessible in the provided evidence.
- The required workflow package (`SKILL.md`) is not available as provided evidence in this run, so its phase model and required Phase 1 artifact structure cannot be followed without violating “work only with provided benchmark evidence”.

## 4) Contract Assessment (Phase 1 Alignment + Focus Coverage)
### Phase alignment: phase1
- **Status: BLOCKED / NOT DEMONSTRABLE**
- Reason: Cannot produce a phase1 intake artifact without the authoritative phase model (`SKILL.md`) and without customer evidence to intake.

### Focus coverage: banding + style constraints + rendering assumptions preserved before scenario drafting
- **Status: BLOCKED / NOT DEMONSTRABLE**
- Reason: No customer-issue content exists to extract banding/style/rendering constraints from, and no baseline template/rubric from the skill snapshot is available to structure the intake.

## 5) What is required to complete this benchmark (minimal admissible inputs)
To proceed while complying with the blind policy, provide **customer-issue-only** evidence for BCIN-7231 such as:
- A customer ticket/issue narrative describing the grid banding/style/rendering problem
- Screenshots or screen recordings showing banding/style/rendering discrepancies
- Environment details (browser, OS, zoom, DPR, RTL, theme) referenced by customer
- Any customer-provided acceptance expectations for banding and styling

And provide access to:
- `./skill_snapshot/SKILL.md` contents (authoritative phase workflow), or include it as benchmark evidence.

## 6) Final Determination
**Benchmark GRID-P1-CONTEXT-INTAKE-001 cannot be evaluated in this run** due to missing admissible evidence and missing access to the authoritative skill workflow document and fixture contents.

- Phase 1 contract compliance: **Not determinable (blocked)**
- Focus area coverage (banding/style/rendering preserved at intake): **Not determinable (blocked)**