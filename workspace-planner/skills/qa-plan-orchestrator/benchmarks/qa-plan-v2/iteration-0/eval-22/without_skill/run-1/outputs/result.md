# RE-P4A-SCENARIO-DRAFT-001 — Phase 4a Scenario Draft (Blind, Pre‑Defect)
**Feature:** BCIN-7289  
**Feature family:** report-editor  
**Primary phase/checkpoint:** phase4a (scenario drafting)  
**Evidence mode:** blind_pre_defect  
**Priority:** advisory  
**Benchmark profile:** global-cross-feature-v1  
**Fixture reference:** BCIN-7289-blind-pre-defect-bundle (no local path provided)  
**Blind evidence policy:** all_customer_issues_only (exclude non-customer issues)  

## Phase 4a Contract: Scenario Drafting Output
This phase4a deliverable drafts *blind* test scenarios that explicitly cover the case focus:
- prompt handling
- template save
- report builder loading
- visible report title outcomes

**Constraint note (blind mode):** No customer-issue evidence content was provided in the fixtures (“no local path”). Therefore, scenarios are drafted generically to the feature intent and the required focus areas, without referencing any non-customer sources.

---

## Scenario Set (Draft)

### SCN-4A-01 — Prompt handling creates a report draft with expected title visibility
**Goal:** Validate prompt submission is accepted and results in a report draft where the report title is visible and correct.

- **Preconditions**
  - User has access to report editor and can start a new report.
  - User is in the report creation entry point that accepts a prompt (e.g., “Describe the report you want”).

- **Steps**
  1. Open report editor and choose “Create report” (or equivalent).
  2. Enter a prompt that includes an explicit title (e.g., “Create a report titled ‘Q4 Pipeline Summary’ …”).
  3. Submit the prompt.
  4. Wait for the editor to generate/load the initial report draft.

- **Expected results**
  - The prompt is accepted (no validation error unless prompt is empty/invalid).
  - A report draft is created and opened in the report builder/editor view.
  - The **visible report title** is displayed and matches the title specified in the prompt (“Q4 Pipeline Summary”) or follows the product’s documented title derivation rules.
  - No “Untitled”/fallback title appears if the prompt provided a title (unless explicitly expected by rules).

- **Coverage tags:** prompt_handling, report_builder_loading, visible_report_title

---

### SCN-4A-02 — Prompt handling with no explicit title results in consistent, visible default title
**Goal:** Validate a prompt without an explicit title results in a deterministic default title and it is visible after loading.

- **Preconditions**
  - Same as SCN-4A-01.

- **Steps**
  1. Start new report.
  2. Enter a prompt that does **not** specify a title (e.g., “Show monthly revenue by region for the last 12 months”).
  3. Submit prompt.
  4. Wait for the report builder/editor to load the generated report.

- **Expected results**
  - Report builder loads successfully.
  - A **visible report title** is present (not blank).
  - Title matches expected defaulting behavior (e.g., “Monthly revenue by region” or “Untitled report”) **consistently** with product rules.

- **Coverage tags:** prompt_handling, report_builder_loading, visible_report_title

---

### SCN-4A-03 — Template save persists and reloads with correct visible title
**Goal:** Ensure saving as a template preserves the report title and survives reload.

- **Preconditions**
  - A generated or manually created report exists in the editor with a known title.
  - User has permission to save templates.

- **Steps**
  1. In an open report, verify current visible report title (record value).
  2. Choose “Save as template” (or equivalent).
  3. Provide a template name and save.
  4. Navigate away (e.g., back to templates list / home).
  5. Re-open the saved template.
  6. Wait for the report builder/editor to load from the template.

- **Expected results**
  - Template save completes successfully (confirmation/entry in templates list).
  - When reopened, the report builder loads without errors.
  - The **visible report title** in the loaded builder matches the expected title:
    - either the original report title is preserved, or
    - title behavior follows the product’s defined mapping between template name vs report title.
  - No regression where title becomes blank/incorrect on reopen.

- **Coverage tags:** template_save, report_builder_loading, visible_report_title

---

### SCN-4A-04 — Report builder loading from template is resilient and shows correct title after load completes
**Goal:** Validate loading states do not produce incorrect transient/final title.

- **Preconditions**
  - A template exists that produces a report with a known expected title.

- **Steps**
  1. Open the template.
  2. Observe the report builder loading state (spinner/skeleton/etc.).
  3. Once loaded, observe the final visible report title.

- **Expected results**
  - During loading, title area behaves per UX spec (may show placeholder).
  - After loading completes, final visible report title equals expected title.
  - No flicker to an incorrect title that persists after load completes.

- **Coverage tags:** report_builder_loading, visible_report_title

---

### SCN-4A-05 — Negative: template save blocked/validated; no silent failure; title remains unchanged in editor
**Goal:** Confirm template save failure modes do not corrupt the current report or title.

- **Preconditions**
  - User in report editor with an existing report and visible title.

- **Steps**
  1. Initiate “Save as template”.
  2. Trigger a validation failure (e.g., blank template name) or simulate save failure condition (as supported by test environment).
  3. Observe UI response.
  4. Dismiss error and remain in report editor.

- **Expected results**
  - Validation error or save failure is clearly communicated.
  - No template is created when save fails.
  - The open report remains in a consistent state.
  - The **visible report title** remains correct and unchanged.

- **Coverage tags:** template_save, prompt_handling (indirect), visible_report_title

---

## Phase 4a Checklist Mapping (Case Focus)
- **Prompt handling:** SCN-4A-01, SCN-4A-02  
- **Template save:** SCN-4A-03, SCN-4A-05  
- **Report builder loading:** SCN-4A-01, SCN-4A-02, SCN-4A-03, SCN-4A-04  
- **Visible report title outcomes:** all scenarios  

---

## Notes / Open Items (Evidence-Dependent)
- No customer-issue artifacts were provided in the fixture bundle (no accessible local path).  
- If customer issues exist for BCIN-7289, expected-title rules and any known edge cases should be incorporated into scenario data (exact prompts, exact title derivation, exact template naming/title mapping).