# Conflicts & Gaps Between Sources

## Conflicts

### CONFLICT-01: Error Handling Behavior
- **Confluence QA plan / Design doc says:** When error is caught in Library (new embedded), OK closes the editor dialog
- **BCED-2416 doc says:** Session timeout should show native error dialog (NOT Library login/homepage)
- **Conflict:** QA plan should explicitly distinguish between:
  1. General errors (OK closes editor) — Library-caught
  2. Session timeout (native dialog, NOT Library login) — must be intercepted at WS layer
- **Decision needed:** How should the QA plan treat these two as separate test cases?

### CONFLICT-02: Save Dialog Ownership
- **Design intent:** Save uses native Workstation dialog (not Library web dialog)
- **Risk:** Library web save dialog may surface in some code paths (e.g., Save As in certain scenarios)
- **Conflict with BCED-2416 child issues:** BCVE-1621 (Save As to folder shows item correctly) and BCED-3149 (newly saved dashboard appears without refresh) suggest edge cases exist
- **Decision needed:** Should all save paths (Save, Save As, Save Theme, Set as Template, Certify) be individually listed as test cases?

### CONFLICT-03: Workstation-Unique Features Scope
- **BCED-2416 doc:** Lists "Convert to cube" and "Convert to datamart" as Workstation-specific actions that must be migrated to Library
- **Library docs:** Convert to Cube is Workstation-only as of Oct 2025; Library has Create from Cube (Feb 2026)
- **Conflict:** Are "Convert to cube" and "Convert to datamart" fully supported in the new embedded editor? The design doc lists them as migration targets but doesn't confirm parity
- **Decision needed:** Should these be marked as "Workstation-only" test cases in the QA plan?

### CONFLICT-04: Toolbar Behavior
- **BCED-2907 (from BCED-2416):** "Disable toolbar" app-level setting should NOT apply in WS editor
- **Library behavior:** App settings CAN affect the toolbar in Library context
- **Conflict:** The embedded editor lives inside a Library iFrame — there's a risk the app-level settings bleed through
- **Decision needed:** Is BCED-2907 fully fixed and should we add regression test cases for it?

## Gaps (Items in BCED-2416 not covered in Confluence QA page 5949096102)

### GAP-01: Confluence page 5949096102 is a Design Template
The Confluence page returned is a design template/engineering doc — not a QA test plan. The actual QA test cases are at:
- https://microstrategy.atlassian.net/wiki/spaces/CQT/pages/5186127599/F43445+Enhance+Workstation+dashboard+authoring+experience+with+Library+capability+parity

**Action:** The XMind QA plan should be built from BCED-2416 doc + official WS/Library docs as primary sources, treating the design doc as supplementary.

### GAP-02: Python Query Reports
- BCED-2416 mentions "Open report in Python editor" and "New Python query report via main menu"
- No specific test cases found in research for this in Workstation embedded context
- Needs explicit test coverage

### GAP-03: Freeform SQL Reports in Embedded Context
- Freeform SQL available in Workstation; behavior in embedded context unclear
- Cannot convert Freeform SQL to cube — needs regression test

### GAP-04: OAuth / CommunityConnector
- BCED-2416 covers Snowflake/Azure, Snowflake/PingOne, Salesforce, SurveyMonkey OAuth
- Not typically part of Report Editor QA — more of dashboard/data source QA
- Should this be in scope for Report Editor QA plan? **Decision needed.**

### GAP-05: MDX Reports
- Library docs don't mention MDX in report editor context
- Workstation legacy has MDX Objects panel
- Status of MDX support in new embedded editor unclear
