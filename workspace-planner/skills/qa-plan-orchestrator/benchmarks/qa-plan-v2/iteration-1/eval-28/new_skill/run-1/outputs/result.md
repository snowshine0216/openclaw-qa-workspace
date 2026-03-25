# VIZ-P1-CONTEXT-INTAKE-001 — Phase 1 Contract Check (BCED-4860)

## Benchmark scope
- **Benchmark case**: VIZ-P1-CONTEXT-INTAKE-001
- **Primary feature**: **BCED-4860**
- **Feature family / knowledge pack**: **visualization**
- **Primary phase under test**: **Phase 1 (context intake spawn planning)**
- **Evidence mode**: **blind_pre_defect**
- **Priority**: advisory
- **Case focus to be explicitly covered**: *context intake preserves donut-label assumptions for label visibility, density limits, and overlap-sensitive presentation*

## What Phase 1 is required to do (per skill contract)
Phase 1 in this orchestrator is **script-driven** and must:
1. Run `scripts/phase1.sh <feature-id> <run-dir>`.
2. Produce **one spawn request per requested source family** (e.g., Jira/GitHub/Confluence/Figma as applicable) plus any support-only Jira digestion requests.
3. Output `phase1_spawn_manifest.json`.
4. After subagent completion, run Phase 1 post-validation (`phase1.sh --post`) which checks spawn policy/evidence completeness/non-defect routing and may require remediation.

## Evidence available in this benchmark bundle
Only the following fixture evidence is provided for BCED-4860:
- `BCED-4860.issue.raw.json`
- `BCED-4860.customer-scope.json`
- `BCED-4860.parent-feature.summary.json`

From the provided Jira export:
- **Summary**: "[Dev] Support data label for each slice in Donut chart."
- **Parent feature**: BCED-4814 "[Auto Dash Requirement] Support data label for each slice in Donut chart."
- **No description content** is present in the raw JSON (description is `null` in provided excerpt).
- A Jira comment references a **GitHub PR** link (product strings), indicating at least one non-Jira source may be relevant, but the bundle does not include GitHub content.

## Phase 1 context-intake requirement vs. benchmark focus (donut label assumptions)
### What the benchmark expects Phase 1 to preserve
For this case, Phase 1 context intake must explicitly preserve assumptions/requirements around donut slice data labels, specifically:
- **Label visibility rules** (when labels show/hide)
- **Density limits** (how many slices/labels can be shown before suppression or alternative presentation)
- **Overlap-sensitive presentation** (collision handling, leader lines, label placement priority)

### Can the benchmark focus be explicitly covered using *only* the provided evidence?
**No.** The provided fixture evidence does not contain acceptance criteria, requirements text, UI spec, or design notes describing:
- exact rules for label visibility,
- what constitutes “too dense,”
- overlap/collision behaviors,
- any explicit constraints or expected fallback behavior.

The only clearly evidenced requirement is the high-level intent: **support data label for each slice** in a donut chart.

## Phase 1 deliverable status in this benchmark
### Required Phase 1 artifact for contract alignment
- `phase1_spawn_manifest.json` is the required Phase 1 artifact.

### Is `phase1_spawn_manifest.json` present in the provided benchmark evidence?
**No.** The benchmark evidence bundle does not include any run directory, Phase 1 manifest, or Phase 1 post-validation output.

### Determination
- **Phase 1 alignment cannot be demonstrated** from the provided evidence because the Phase 1 output artifact(s) that would prove correct context intake/spawn planning are not included.
- **The benchmark’s explicit focus (donut label visibility/density/overlap assumptions)** cannot be shown as “preserved in context intake” because no Phase 1 context intake artifact (manifest/tasks) is available, and the Jira fixture does not itself contain those assumptions.

## Advisory verdict (phase_contract / advisory)
- **Expectation: case focus explicitly covered** → **Not verifiable / not satisfied with provided evidence**.
  - Reason: the evidence does not contain the donut label visibility/density/overlap assumptions, nor the Phase 1 spawn/task text that would demonstrate they were captured for downstream phases.
- **Expectation: output aligns with Phase 1** → **Not verifiable / not satisfied with provided evidence**.
  - Reason: missing `phase1_spawn_manifest.json` (and any Phase 1 script stdout/post-validation results).

## What would be needed (within Phase 1) to satisfy this benchmark focus
To meet the benchmark, Phase 1 spawn/task content (in `phase1_spawn_manifest.json`) would need to ensure Jira/context intake captures, at minimum:
- explicit requirements or questions for **label show/hide** criteria (e.g., min slice angle/size threshold, user toggles)
- explicit requirements or questions for **dense donuts** (e.g., max label count, grouping/“Others”, tooltip fallback)
- explicit requirements or questions for **collision/overlap handling** (priority rules, leader lines, truncation/ellipsis, hide-on-overlap)

But these items cannot be confirmed or assessed here because the relevant Phase 1 artifacts are absent from the benchmark evidence.