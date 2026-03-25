# Benchmark Result — VIZ-P4A-DONUT-LABELS-001 (BCED-4860)

## Phase alignment
**Target phase/checkpoint:** Phase 4a (subcategory-only draft writer).

**Phase 4a contract expectation:** The Phase 4a output is a **subcategory-only** scenario draft (no canonical top-layer grouping) with atomic nested steps and observable verification leaves.

## Evidence used (blind pre-defect)
- Fixture bundle: **BCED-4860-blind-pre-defect-bundle**
  - `BCED-4860.issue.raw.json`
  - `BCED-4860.customer-scope.json`
  - `BCED-4860.parent-feature.summary.json`
- Skill workflow/contract snapshot:
  - `skill_snapshot/SKILL.md`
  - `skill_snapshot/reference.md`
  - `skill_snapshot/references/phase4a-contract.md`

## Case focus coverage check (donut-chart data labels)
**Benchmark focus:** “donut-chart data label coverage distinguishes label visibility, density, and overlap-sensitive outcomes.”

### What the provided evidence says about the feature
From the Jira fixtures:
- BCED-4860 summary: **“[Dev] Support data label for each slice in Donut chart.”**
- Parent BCED-4814 summary: **“Support data label for each slice in Donut chart.”**

### What must be present in Phase 4a to satisfy this benchmark’s focus
Within a Phase 4a subcategory draft, the donut-chart data label scenario set must *explicitly* include scenarios that differentiate:
1. **Visibility rules** (when labels appear vs hide)
2. **Density behavior** (many slices vs few; small slices)
3. **Overlap-sensitive outcomes** (collision/overlap handling—e.g., hide, truncate, reposition, leader lines)

### Can this benchmark confirm the skill satisfies that focus in Phase 4a?
**Cannot be determined from provided evidence.**

Reason: The benchmark evidence contains **no Phase 4a output artifact** (e.g., `drafts/qa_plan_phase4a_r1.md`) and no `context/coverage_ledger_*.md` / `context/artifact_lookup_*.md` inputs that would show whether the Phase 4a draft includes overlap/density/visibility-distinguishing scenarios.

## Phase 4a output alignment check
**Cannot be assessed.**

Reason: No `drafts/qa_plan_phase4a_r<round>.md` artifact is included in the evidence, so we cannot verify:
- subcategory-only structure (no top-category leakage)
- atomic step nesting
- observable verification leaves
- inclusion of the donut-label density/overlap/visibility distinctions

## Advisory verdict
- **Phase 4a alignment:** **BLOCKED (missing Phase 4a draft evidence)**
- **Case focus coverage (donut label visibility/density/overlap):** **BLOCKED (missing Phase 4a draft evidence)**

## What would be required to pass this benchmark (advisory)
To demonstrate the skill satisfies this benchmark at Phase 4a, evidence must include:
- `drafts/qa_plan_phase4a_r1.md` (or later round)

And that draft should contain subcategory scenarios such as (examples of *required distinctions*, not prescribing exact wording):
- Labels visible for normal slice sizes; labels hidden when slice is below threshold
- Many-slice donut: label collision behavior (no overlap; deterministic hide/truncate/reposition)
- Overlap-sensitive behavior differences (e.g., inside vs outside placement; leader lines; truncation/ellipsis)
- Responsive behavior: resizing chart/container changes label visibility/collision outcomes predictably
- Mixed data magnitudes: tiny slices adjacent to large slices

These would need to be expressed as Phase 4a-compliant atomic steps with observable verification leaves, without introducing canonical top-layer categories.