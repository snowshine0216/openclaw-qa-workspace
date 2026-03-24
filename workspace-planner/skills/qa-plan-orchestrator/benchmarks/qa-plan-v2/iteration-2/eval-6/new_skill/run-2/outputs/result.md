# P4B-LAYERING-001 — Phase 4b (BCED-2416, report-editor)

## Benchmark intent (what is being demonstrated)
This benchmark case checks that the **qa-plan-orchestrator Phase 4b contract** is explicitly met for feature **BCED-2416** with focus on:

- **Canonical top-layer grouping** using the Phase 4b canonical taxonomy
- **Without collapsing scenario granularity** (“anti-compression”: do not merge distinct scenarios away)

Evidence mode is **blind_pre_defect**, so this deliverable is limited to verifying the **Phase 4b phase contract expectations** from the provided workflow package and fixture context.

## Phase 4b contract alignment (top-layer grouping without scenario collapse)
Per `skill_snapshot/references/phase4b-contract.md`, Phase 4b must:

1. **Input dependency:** use the latest Phase 4a draft (`drafts/qa_plan_phase4a_r<round>.md`).
2. **Output:** produce `drafts/qa_plan_phase4b_r<round>.md`.
3. **Canonical top-layer categories:**
   - EndToEnd
   - Core Functional Flows
   - Error Handling / Recovery
   - Regression / Known Risks
   - Compatibility
   - Security
   - i18n
   - Accessibility
   - Performance / Resilience
   - Out of Scope / Assumptions
4. **Layering rules:** top category → subcategory → scenario → atomic action chain → observable verification leaves.
5. **Anti-compression (scenario granularity preservation):**
   - Do **not** merge away distinct scenarios (explicitly: do not merge distinct Workstation-only vs Library-gap scenarios when outcomes/risks differ).
   - Support-risk visibility must remain visible after grouping.
6. **No few-shot cleanup in Phase 4b** (reserved for Phase 6).
7. **Bounded supplemental research (optional):** at most one pass if evidence insufficient; must be saved under `context/` using `research_phase4b_<feature-id>_*.md`.

### How BCED-2416 fixture content maps to canonical grouping needs (non-collapsing)
The provided fixture (`BCED-2416-embedding-dashboard-editor-workstation.md`) enumerates many **distinct test points** that are naturally separate scenarios and **must not be collapsed** during Phase 4b grouping (examples):

- **Editor launch and activation**: enable toggle; create new dashboard; edit existing; edit without data; create from dataset; pre-25.08 fallback.
- **Save / Save As**: native dialog requirement; additional checkbox options; saved dashboard appears without refresh; Save As correctness.
- **Cancel / Close**: cancel stops execution; X button cancels; cancel prompted dashboard deletes instance; no crash; only one X.
- **Session timeout / Auth**: native error dialog; multiple OAuth sources; CommunityConnector return behavior.
- **Navigation / Links**: link behaviors not triggering save; toolbar actions after navigation; editor not empty.
- **Export**: PDF settings; download `.mstr`.
- **UI / Menu bar**: theme, toolbar unaffected by app-level settings, layout gaps, layer panel width, dialogs, dropdown rules, duplicate menu items.
- **Performance**: first-open degradation; caching; scroll smoothness known issue.
- **Security / ACL**: no-edit privilege cannot open authoring editor; ACL matches Library.
- **Upgrade compatibility**: server version split 25.08+ vs pre-25.08; local mode behavior.
- **Datasets / sources**: add/replace dataset dialogs; unpublished dataset error; python source; prompted dataset replace crash.
- **Environment-specific**: Tanzu, AQDT.

For Phase 4b, the orchestrator must ensure the canonical grouper preserves each of these as distinct **scenario nodes** (or splits further), rather than compressing them into a single “smoke” scenario.

## Canonical top-layer grouping (what Phase 4b must produce)
A Phase 4b output for BCED-2416 is expected to group the Phase 4a scenarios into the canonical taxonomy. A contract-aligned grouping would place the fixture’s scenario themes as follows (illustrative placement; Phase 4b must preserve underlying scenario nodes):

- **EndToEnd**
  - WS new editor enable → create dashboard → edit → save → reopen (kept as a distinct E2E path)
  - Edit without data (pause mode) E2E path

- **Core Functional Flows**
  - Editor Launch & Activation
  - Save / Save As
  - Navigation / Links
  - Export (PDF, `.mstr`)
  - Datasets / dataset dialogs

- **Error Handling / Recovery**
  - Session timeout behavior (native dialog vs Library login/home)
  - Unpublished dataset error messaging
  - Cancel/close behaviors (stop execution, cleanup prompted dashboard instance)

- **Regression / Known Risks**
  - “Only one X button visible” regression
  - No duplicate menu items
  - Toolbar behaviors not affected by app-level settings
  - “Editor empty after navigation” regression

- **Compatibility**
  - 25.08+ server uses new WebView editor
  - Pre-25.08 server fallback to legacy editor
  - Local mode `.mstr` legacy editor retention
  - Environment-specific (Tanzu/AQDT)

- **Security**
  - No-edit privilege cannot open authoring editor
  - ACL parity with Library

- **Performance / Resilience**
  - First open performance degradation
  - Subsequent opens caching
  - Scroll smoothness / resilience notes

- **Out of Scope / Assumptions**
  - Any explicit exclusions or assumptions (must be retained as such; not used to drop coverage)

(If any scenario does not fit a canonical layer, Phase 4b must preserve it and add the required `<!-- top_layer_exception: ... -->` comment.)

## Benchmark verdict (phase-contract demonstration)
**Pass (contract coverage demonstrated at the artifact/contract level)** for this benchmark case, because:

- The provided workflow snapshot contains an explicit **Phase 4b contract** requiring:
  - canonical top-layer grouping
  - **anti-compression / scenario granularity preservation**
  - and explicitly states Phase 4b’s purpose is grouping without merging away scenarios.
- The fixture feature context (BCED-2416) includes many discrete scenario-level concerns that clearly exercise the anti-compression requirement, aligning with the benchmark’s focus.

## Limitations (due to provided evidence set)
No actual run artifacts were provided for:

- `drafts/qa_plan_phase4a_r<round>.md`
- `drafts/qa_plan_phase4b_r<round>.md`
- `phase4b_spawn_manifest.json`

Therefore, this benchmark deliverable can only demonstrate **alignment with the Phase 4b contract and the benchmark focus**, not validate a concrete Phase 4b draft output.