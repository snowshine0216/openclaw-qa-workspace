# GRID-P1-CONTEXT-INTAKE-001 — Phase 1 Contract Check (Advisory)

## Benchmark focus
**Context intake preserves banding requirements, style constraints, and rendering assumptions before scenario drafting** for **BCIN-7231** (feature family: **modern-grid**) in **phase1**.

## Evidence available (blind pre-defect)
From the provided Jira fixture for **BCIN-7231**, the feature description states Modern Grid currently lacks:
- ability to **format banding colors**
- ability to **enable banding in columns**
- ability to **apply banding color by row/column header**

It also frames these as “all support in Report” and requests bringing “all the banding functions” to Modern Grid in dashboards.

## Phase 1 orchestrator contract alignment
Per the skill snapshot, **Phase 1** is strictly responsible for:
- generating a **spawn request per requested source family** (plus support-only Jira digestion requests when provided)
- producing **`phase1_spawn_manifest.json`**
- running a `--post` gate that validates spawn policy, evidence completeness, support relation map/summaries, and non-defect routing.

### What Phase 1 must preserve for later drafting
To satisfy the benchmark focus, Phase 1 context intake should ensure that evidence collection (via spawns) captures and persists, under `context/`, the following *before* any Phase 4 scenario drafting:

#### A) Banding requirements (functional)
At minimum, context should explicitly retain the requirement set implied by BCIN-7231:
- row banding (existing) vs **column banding (missing)**
- **banding color formatting** (missing)
- **banding application scope**: by row header / column header (missing)

#### B) Style constraints (formatting + theming)
The intake should treat “format the colors” as a styling surface area, and ensure later phases have evidence about:
- where banding colors are configured (UI surface)
- whether colors derive from theme/palette, custom color pickers, conditional formatting interactions, etc.

#### C) Rendering assumptions
The intake should capture assumptions/requirements that affect rendering and correctness, such as:
- how banding is rendered when headers are present (row/column headers)
- dashboard embedding constraints for Modern Grid

## Pass/Concern assessment (advisory)
### Pass (contract-level)
- The skill snapshot defines Phase 1 as a **spawn-manifest-only phase** with a `--post` validation gate. This is compatible with the benchmark’s intent: Phase 1’s job is to **set up evidence capture** so later phases can draft scenarios with preserved constraints.

### Concern (cannot be fully demonstrated with provided evidence)
- The benchmark requires demonstrating that **context intake preserves** banding requirements/style constraints/rendering assumptions.
- The provided evidence bundle does **not** include:
  - an actual `phase1_spawn_manifest.json` output for BCIN-7231
  - any Phase 1 spawn task text showing explicit capture directives
  - any `context/` artifacts created as a result of Phase 1 spawns
- Therefore, with blind pre-defect evidence, we can only confirm **the Phase 1 contract supports** preserving this information (by collecting evidence into `context/` via source-family spawns), but we **cannot verify** that the produced manifest/tasks actually encode these preservation needs.

## Required Phase 1 deliverable for full verification (not available in this benchmark)
To conclusively satisfy the benchmark focus, Phase 1 would need to produce (and we would need to review) **`phase1_spawn_manifest.json`** showing spawn requests for the relevant source families (at least Jira; possibly docs/specs if configured) whose task text explicitly calls out capturing:
- banding rows vs columns
- banding color formatting options
- header-based banding behavior
- any dashboard/Modern Grid rendering constraints

---

# Short execution summary
- Checked Phase 1 responsibilities and gates from `skill_snapshot/SKILL.md` and `skill_snapshot/reference.md` against benchmark focus.
- Extracted banding-related requirements directly from the BCIN-7231 Jira fixture.
- Determination: **Phase 1 contract is compatible**, but **evidence is insufficient to verify** that Phase 1 context intake actually preserves banding/style/rendering assumptions (no manifest/context outputs provided).