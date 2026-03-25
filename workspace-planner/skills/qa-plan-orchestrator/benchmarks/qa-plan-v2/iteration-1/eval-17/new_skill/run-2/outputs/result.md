# Benchmark result — VIZ-P4A-DONUT-LABELS-001 (BCED-4860)

## Verdict (phase4a contract alignment)
**Not demonstrated / insufficient evidence** that the qa-plan-orchestrator skill satisfies this benchmark case for **Phase 4a**.

Reason: the provided benchmark evidence does **not** include any Phase 4a run artifacts (e.g., `phase4a_spawn_manifest.json` and `drafts/qa_plan_phase4a_r1.md`). Without those, we cannot verify that Phase 4a output:
- exists and is correctly produced by the phase4a workflow, and
- **explicitly covers the case focus**: donut-chart data label coverage that distinguishes **label visibility**, **label density**, and **overlap-sensitive outcomes**,
- while also respecting Phase 4a constraints (subcategory-first, atomic steps, no top-level canonical grouping).

## What must be present to pass this benchmark (Phase 4a expectations)
To satisfy `[phase_contract][advisory]` for this case, the Phase 4a draft (subcategory-only) must contain scenario coverage for **Donut chart data labels per slice** that clearly separates:

1. **Label visibility** outcomes
   - Scenarios where labels should be visible/hidden based on configuration and slice conditions.
   - Verification leaves should be explicitly observable (e.g., label renders for each slice, label not rendered when disabled, etc.).

2. **Label density** outcomes
   - Scenarios for many slices / small slices where label crowding is likely.
   - Verifications should distinguish what the product is expected to do under dense conditions (e.g., some labels omitted, truncated, or otherwise adjusted), without mixing action+verification in the same bullet.

3. **Overlap-sensitive** outcomes
   - Scenarios where labels could overlap due to small chart size, many slices, long labels, etc.
   - Verification leaves must assert the overlap-related expected behavior (e.g., overlap avoidance behavior, deterministic omission rules, readability constraints), in an observable manner.

Additionally, to align with **Phase 4a contract** the draft must:
- be **subcategory-only** (no canonical top-layer categories like “Compatibility”, “i18n”, “Security”, “EndToEnd”),
- use **atomic nested action chains** (no `A -> B -> C` compressed bullets),
- place **verification** only at leaf levels (not mixed into action bullets).

## Evidence check against provided bundle
The fixture provides only feature metadata:
- BCED-4860 summary: "[Dev] Support data label for each slice in Donut chart."
- Parent feature BCED-4814 summary: "[Auto Dash Requirement] Support data label for each slice in Donut chart."

This confirms the *topic* (donut chart slice data labels) but does **not** include any Phase 4a QA plan draft content to prove the required coverage distinctions (visibility vs density vs overlap) were included.

## Required artifacts to conclusively evaluate this benchmark
To evaluate (and potentially pass) this benchmark case in evidence mode `blind_pre_defect`, we would need at minimum:
- `phase4a_spawn_manifest.json` (to show the orchestrator is invoking Phase 4a correctly), and
- `drafts/qa_plan_phase4a_r1.md` (or later round) for BCED-4860 (to inspect scenario coverage and Phase 4a formatting/structure constraints).