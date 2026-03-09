# Conflicts & Gaps — Decisions Applied

## Conflicts (Resolved)

### CONFLICT-01: Error Handling ✅ RESOLVED
**Decision:** Show native error dialog. Click OK dismisses the error AND the editor is closed.
- Mojo/editor-level errors: native error dialog, OK dismisses, editor closes
- Library-level errors: native error dialog, OK dismisses, editor closes
- Session timeout: native error dialog (NOT Library login/homepage), OK dismisses, editor closes
- **QA implication:** All error OK paths must verify editor closes — added to Error Handling section

### CONFLICT-02: Save Dialog ✅ RESOLVED
**Decision:** Always use native Workstation dialog for all save paths (Save, Save As).
- **QA implication:** Every save variant explicitly tests native dialog appears and Library web dialog does NOT

### CONFLICT-03: Convert to Cube / Datamart ✅ RESOLVED
**Decision:** "Convert to cube" and "Convert to datamart" are Workstation-specific features that MUST be migrated to Library.
- **QA implication:** These are marked P1 with ⚠️ risk flags — critical migration verification

### CONFLICT-04: Toolbar / App Settings ✅ RESOLVED
**Decision:** No application-level settings should apply inside the WS embedded editor (not just toolbar — ALL app settings).
- **QA implication:** Toolbar isolation test broadened to cover ALL app-level settings bleeding into WS editor — added to Security section as P1

## Gaps (Resolved)

### GAP-02: Python Query Reports ✅ ADDED
- Full Python query report lifecycle added to Core Functionalities (P1)
- Also in EndToEnd section
- Cross-function test with report objects

### GAP-02: Freeform SQL Reports ✅ ADDED
- Full Freeform SQL lifecycle in Core Functionalities (P1)
- Convert to cube blocked path explicitly tested
- In EndToEnd section

### GAP-02: MDX Reports ✅ ADDED
- MDX Objects panel and MDX report tests in Core Functionalities (P2)
- MDX metric interaction cross-function test
- MDX → convert to cube blocked (P1)

### GAP-04: OAuth Coverage ✅ KEPT IN SCOPE
- Kept under Security section (all OAuth types: Snowflake/Azure, PingOne, Salesforce, SurveyMonkey, DB OAuth, CommunityConnector)
