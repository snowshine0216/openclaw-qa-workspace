# Benchmark P3-RESEARCH-ORDER-001 (BCIN-7289) — Phase 3 Contract Check

## Verdict (blocking)
**PASS** — The qa-plan-orchestrator workflow package **explicitly** requires **Tavily-first deep research** with **Confluence as a recorded fallback**, and this requirement is anchored in **Phase 3** (the primary phase under test).

## What this benchmark validates
### 1) Case focus explicitly covered: “Tavily-first then Confluence fallback ordering”
Evidence from the skill snapshot shows an explicit ordering rule tied to report-editor deep research:

- **SKILL.md (Support context and deep research inputs):**
  - “**report-editor deep research must run `tavily-search` first and use `confluence` only as a recorded fallback**”

- **reference.md (Deep research policy field):**
  - `deep_research_policy` is defined as: **`tavily_first_confluence_second`**

- **reference.md (Bounded Supplemental Research rule reiteration):**
  - “For report-editor topics introduced during Phase 3, `tavily-search` must run before any `confluence` fallback and the fallback reason must be recorded.”

This satisfies the benchmark’s focus requirement: the ordering is stated as a hard rule and includes the “recorded fallback” requirement.

### 2) Output aligns with primary phase: **phase3**
The ordering requirement is not generic; it is **Phase 3 work and Phase 3 validation**:

- **SKILL.md (Phase 3 description):**
  - “Work: **spawn Tavily-first deep-research requests** for required topics…”
  - “`--post`: validate … **Tavily-first research artifacts, optional Confluence fallback ordering**, synthesis output …”

- **reference.md (Phase 3 artifact family explicitly includes Tavily and conditional Confluence artifacts):**
  - Tavily artifacts:
    - `context/deep_research_tavily_report_editor_workstation_<feature-id>.md`
    - `context/deep_research_tavily_library_vs_workstation_gap_<feature-id>.md`
  - Conditional Confluence fallback artifacts:
    - `context/deep_research_confluence_report_editor_workstation_<feature-id>.md` *(conditional)*
    - `context/deep_research_confluence_library_vs_workstation_gap_<feature-id>.md` *(conditional)*
  - Synthesis:
    - `context/deep_research_synthesis_report_editor_<feature-id>.md`

This demonstrates phase3 alignment: Phase 3 is where the research is spawned, where the ordering is required, and where the `--post` gate validates it.

## Notes on evidence mode (“blind_pre_defect”)
The fixture bundle contains the feature issue export and adjacency summaries, but this benchmark’s blocking check is about the **orchestrator’s Phase 3 contract**, not about feature content correctness. The workflow package provides explicit Phase 3 ordering and validation requirements without requiring additional runtime artifacts.

## Benchmark conclusion
- **[phase_contract][blocking] Tavily-first then Confluence fallback ordering:** **Covered explicitly** in SKILL.md and reference.md.
- **[phase_contract][blocking] Output aligns with Phase 3:** **Covered explicitly**: Phase 3 work + Phase 3 `--post` validation includes the ordering requirement and the expected artifacts.