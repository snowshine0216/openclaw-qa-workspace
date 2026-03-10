On that basis, Plan 1 is stronger overall.
  Use report-editor-workstation-qa-plan_v2.md as the base, and borrow a few migration-shell/regression sections from qa-plan-draft-
  v2.md.

  1. Coverage

  Plan 1 wins on report-editor coverage.

  Pros:

  - It covers the actual report-editor capability map in depth: objects, filters, prompts, data retrieval, SQL view, subtotals,
    formatting/themes, VLDB, page-by, derived objects, consolidations/custom groups, transformations, MDX, undo/redo, save/export,
    cube/datamart, Python, Freeform SQL, and upgrade compatibility. See report-editor-workstation-qa-plan_v2.md:84, report-editor-
    workstation-qa-plan_v2.md:324, 02-report-editor-workstation-features.md:8.
  - It also matches the second context’s report research better than Plan 2 does. The second context says expected report scope
    includes prompts, page-by, SQL view, drilling, Advanced Properties, custom groups, consolidations, transformations, subtotals,
    export, cancel, undo/redo, templates, themes research_library_vs_ws_gap.md:168, and Plan 1 actually has those families.

  Cons:

  - It is very large and has some duplication.
  - A few items still drift into dashboard wording or regression naming.

  Plan 2 is weaker on core report breadth.

  Pros:

  - It is strong on embedding-migration shell coverage: toggle, routing, save/save-as dialog ownership, cancel/close, perf, menu
    parity, auth/ACL, native integration, regression pool qa-plan-draft-v2.md:18, qa-plan-draft-v2.md:159, qa-plan-draft-v2.md:359.

  Cons:

  - It under-covers baseline report-editor capability families from its own report research. Missing or much thinner than Plan 1:
    filter modeling, SQL view, Advanced Properties, derived objects, subtotals, transformations, detailed prompt coverage, detailed
    object management, templates, undo/redo behavior under report operations.
  - Later sections add some report cases, but they are selective and not enough to cover the report editor end-to-end.

  Coverage result:

  1. Plan 1
  2. Plan 2

  2. Executable Steps

  Plan 1 is also better for manual execution.

  Pros:

  - Most scenarios are written as concrete UI actions with direct expected results. Example: report-editor-workstation-qa-
    plan_v2.md:147, report-editor-workstation-qa-plan_v2.md:190, report-editor-workstation-qa-plan_v2.md:388.
  - A tester can usually execute without interpreting product internals.

  Cons:

  - Some cases are over-nested and too long.
  - Some wording is inconsistent: report plan but mixed dashboard terms in a few places report-editor-workstation-qa-plan_v2.md:339,
    report-editor-workstation-qa-plan_v2.md:524.
  - Categories are easier to scan.
  - Risk markers are consistently applied.

  Cons:
  - Several scenarios rely on implementation/SDK concepts that manual QA would not directly validate, such as openObjectEditor,
    deleteDossierInstance, EmbedReportAuthoring, ReportAuthoringService qa-plan-draft-v2.md:262, qa-plan-draft-v2.md:403.
  - For a report-editor plan, it skips too many “do X in the editor, observe Y in the report” flows.

  Executable-steps result:

  1. Plan 1
  2. Plan 2

  3. Context Coverage


  - It clearly mines 02-report-editor-workstation-features.md almost end-to-end.
  - It also incorporates the first context’s explicit decisions for Python, Freeform SQL, MDX, OAuth, save dialog behavior, and
    Workstation-only cube/datamart coverage 04-conflicts-and-gaps.md:12, 04-conflicts-and-gaps.md:24.

  Cons:

  - It does not perfectly obey all context decisions. Biggest miss: error handling contradiction with 04-conflicts-and-gaps.md:5.
  - It still underuses some summary-level items like layers panel and broader add/replace dataset coverage 01-bced-2416-summary.md:24,
    01-bced-2416-summary.md:28.

  Plan 2 uses migration/regression context well, but report context less well.

  Pros:

  - It uses Atlassian/Jira child issues well for routing, save, cancel, auth, performance, and regressions qa_plan_atlassian_BCED-
    2416.md:46, jira_related_issues_BCED-2416.md:27.

  Cons:

  - It does not convert its own report research into corresponding test families. The report research is detailed
    research_ws_report_editor_functionality.md:21, research_library_vs_ws_gap.md:160, but the plan stays concentrated on shell behavior
    plus a few selected report cases.
  - So its context coverage is broad on evidence collection, but shallow on evidence translation into report-editor test coverage.

  Context-coverage result:

  1. Plan 1
  2. Plan 2

  Final ranking

  If the target is definitively BCED-2416 report-editor, then:

  1. Plan 1 is better on coverage
  2. Plan 1 is better on executable manual steps
  3. Plan 1 uses report context more completely

  Best practical direction:

  - Keep Plan 1 as the main report-editor QA plan.
  - Import only these strengths from Plan 2:
      - toggle/routing structure
      - regression grouping by known defects
      - performance section framing
      - native integration / menu parity emphasis

  Main fixes needed in Plan 1 before finalizing:

  - align error-handling behavior with 04-conflicts-and-gaps.md:5
  - remove unsupported browser/BI Web matrix items
  - add missing summary-derived items like layers panel and broader dataset add/replace flows

  If you want, I can turn this into a direct side-by-side comparison table with Plan 1 / Plan 2 / winner / why.