# Benchmark assessment — VIZ-P4A-DONUT-LABELS-001 (BCED-4860)

## Phase/contract alignment (phase4a)
This benchmark case targets **phase4a** of the `qa-plan-orchestrator` contract.

Per the **Phase 4a Contract** (skill snapshot), Phase 4a must produce a **subcategory-only QA draft** (`drafts/qa_plan_phase4a_r<round>.md`) with:

- Central topic → subcategory → scenario → atomic action chain → observable verification leaves
- **No canonical top-layer categories** (e.g., Security/Compatibility/EndToEnd/i18n)
- **No compressed steps** (e.g., `A -> B -> C`)
- Verification outcomes must be **separate leaf bullets** under actions

## Case focus coverage (advisory)
Benchmark focus to be explicitly covered in the Phase 4a output:

> **Donut-chart data label coverage distinguishes label visibility, density, and overlap-sensitive outcomes.**

### Evidence available in this benchmark bundle
The only provided feature evidence is Jira issue export metadata indicating the feature intent:

- **BCED-4860** summary: **"[Dev] Support data label for each slice in Donut chart."**
- Parent feature **BCED-4814** summary: **"[Auto Dash Requirement] Support data label for each slice in Donut chart."**

No additional acceptance criteria, UI behavior detail, or design notes are included in the provided evidence.

### What Phase 4a must therefore demonstrate
Even with limited evidence, the Phase 4a subcategory draft (were it produced) must contain scenarios that explicitly differentiate:

1. **Label visibility** outcomes
   - Labels shown/hidden behaviors for donut slices (e.g., on/off, default state, conditional visibility)
2. **Label density** outcomes
   - Many slices / small slices cases where labels may need rules for when to show
3. **Overlap-sensitive** outcomes
   - Collisions/overlaps: expected behavior when labels would overlap (e.g., hide some labels, truncate, reposition, leader lines, prioritize largest slices, etc.)

These distinctions must appear as **separate scenarios** with **observable leaves**, not as a single generic “labels display” scenario.

## Pass/Fail determination for this benchmark
**Fail (insufficient artifacts to evaluate phase4a requirements).**

Reason: The benchmark evidence provided does **not** include any Phase 4a output artifact (e.g., `drafts/qa_plan_phase4a_r1.md`) nor any run directory materials (coverage ledger, artifact lookup, spawn manifest, or draft) to verify that the orchestrator produced a Phase 4a subcategory plan that covers:

- donut data label **visibility**
- donut data label **density**
- donut data label **overlap-sensitive** behavior

With the current evidence set, we can only restate the required coverage focus and the Phase 4a contract expectations; we cannot confirm the skill satisfied them in an actual run.

## What would be required to convert to “Pass” (for this specific case)
Provide **any one** of the following Phase 4a artifacts for BCED-4860 so the benchmark can be evaluated:

- `drafts/qa_plan_phase4a_r1.md` (or later round)

And ideally also:

- `context/coverage_ledger_BCED-4860.md` (to confirm mapping from evidence to scenarios)
- `context/artifact_lookup_BCED-4860.md` (to confirm evidence trace)

Then we would verify that the Phase 4a draft includes explicit donut label scenarios distinguishing visibility vs density vs overlap outcomes and respects the “subcategory-only” structure.