I will check the provided skill snapshot (SKILL.md) and then draft the required phase4a blind scenario artifacts using only the allowed customer-issue evidence.## ./outputs/result.md

# QA Plan Orchestrator — Phase 4a (Scenario Drafting)
**Benchmark case:** RE-P4A-SCENARIO-DRAFT-001  
**Primary feature:** BCIN-7289  
**Feature family / Knowledge pack:** report-editor  
**Primary phase under test:** phase4a (Scenario Drafting)  
**Evidence mode:** blind_pre_defect  
**Priority:** advisory  
**Benchmark profile:** global-cross-feature-v1  
**Fixture reference:** BCIN-7289-blind-pre-defect-bundle *(no local path provided)*  
**Blind evidence policy:** **all_customer_issues_only** (exclude non-customer issues)  

## Blocker: required benchmark evidence not provided locally
This phase4a deliverable must be drafted **only** from the benchmark evidence (customer issues) contained in the referenced fixture bundle. In this run, **no customer-issue evidence content is available** (fixture has no local path and no issue text/logs are provided), and the required workflow package **`./skill_snapshot/SKILL.md` is not accessible** in the provided context. Under the benchmark’s “use only provided benchmark evidence” rule, I cannot legitimately draft scenarios without that evidence.

Because of that, I’m providing a **phase4a-aligned scenario draft template** with explicit placeholders indicating where customer-issue evidence must be inserted. This keeps the output aligned to phase4a structure while avoiding fabrication.

---

## Phase 4a Output: Blind Scenario Drafts (Evidence-Backed Placeholders)

### Scenario 4a-1 — Prompt handling yields expected report title visibility
- **Intent / risk addressed:** Prompt handling in the report editor should produce a visible report title outcome (e.g., title shown in the report builder UI after generation/loading).
- **Customer-issue evidence anchor:** *(REQUIRED — insert customer issue ID/quote from fixture)*  
  - Evidence: `TBD_from_BCIN-7289-blind-pre-defect-bundle`

**Preconditions**
- User has access to Report Editor / Report Builder.
- A new report is being created or an existing draft is opened.
- *(Insert any customer-specific preconditions from issue: browser, role, org settings, etc.)*

**Steps**
1. Navigate to Report Editor entry point (e.g., “Create report” or open the report editor).
2. In the prompt input, enter the prompt text described in the customer issue.  
   - Prompt: *(TBD from evidence)*
3. Submit/generate the report content.
4. Allow the system to transition to/load the report builder view.

**Expected results**
- The report builder loads successfully.
- The report title is visible and matches the expected title behavior described in the customer issue:  
  - Title expectation: *(TBD from evidence; e.g., derived from prompt, default naming, preserved title, etc.)*
- No blank/placeholder/incorrect title is shown (as applicable to the customer issue).

**Notes / instrumentation (optional, phase4a)**
- Capture screenshot of the report builder header/title region.
- Capture console/network logs only if described/required by customer evidence.

---

### Scenario 4a-2 — Template save preserves report title and does not break subsequent loading
- **Intent / risk addressed:** Saving a template should persist key metadata (including title behavior) and the saved artifact should reopen/load in the report builder without regression.
- **Customer-issue evidence anchor:** *(REQUIRED — insert customer issue ID/quote from fixture)*  
  - Evidence: `TBD_from_BCIN-7289-blind-pre-defect-bundle`

**Preconditions**
- A report exists in the editor with prompt-generated or user-defined title state (per evidence).
- User has permissions to save templates.

**Steps**
1. Create/open a report in the report editor.
2. Ensure title state matches the scenario setup described by the customer issue.  
   - *(TBD from evidence: title set by prompt? manually edited? default?)*
3. Use “Save as template” (or equivalent) to save the report as a template.
4. Confirm save completion (toast/status) as per UI.
5. Navigate away (e.g., back to list/home).
6. Re-open the saved template (or create a report from that template).
7. Allow the report builder to load.

**Expected results**
- Template save succeeds with no error.
- Re-opening/instantiating from the template loads the report builder successfully.
- The visible report title outcome matches expectations described in the customer issue:  
  - *(TBD from evidence: preserved title, non-empty, correct value, etc.)*

---

### Scenario 4a-3 — Report builder loading after prompt submit is reliable (no stuck/blank state)
- **Intent / risk addressed:** After prompt submission, the transition into the report builder should complete, and the user should see the report (including title area), not an infinite spinner/blank canvas.
- **Customer-issue evidence anchor:** *(REQUIRED — insert customer issue ID/quote from fixture)*  
  - Evidence: `TBD_from_BCIN-7289-blind-pre-defect-bundle`

**Preconditions**
- User can access the report editor.
- Any environment constraints from evidence are met.

**Steps**
1. Start a new report (or open the relevant flow indicated by evidence).
2. Enter the prompt text from the customer issue and submit.
3. Observe the loading behavior into report builder.
4. If the customer issue involves refresh/back/forward/reopen, perform those actions exactly as described.  
   - *(TBD from evidence)*

**Expected results**
- Report builder loads within acceptable time bounds (use product standard or evidence-provided expectation).
- The report is interactive (no permanent loading state).
- The report title region is present and visible (even if default), consistent with evidence.

---

## Coverage check against benchmark focus
This phase4a draft explicitly targets the required focus areas:
- **Prompt handling:** Scenario 4a-1 and 4a-3
- **Template save:** Scenario 4a-2
- **Report builder loading:** Scenario 4a-1/2/3
- **Visible report title outcomes:** all scenarios include explicit title visibility assertions

---

## What’s needed to finalize (non-speculative) scenarios
To convert placeholders into evidence-backed scenarios compliant with **blind_pre_defect** and **all_customer_issues_only**, provide:
1. Customer issue text(s) from `BCIN-7289-blind-pre-defect-bundle` (IDs, repro steps, expected/actual).
2. Any screenshots/log snippets included in the customer evidence.
3. Access to `./skill_snapshot/SKILL.md` to ensure exact orchestrator phase4a formatting/contract.

---

## ./outputs/execution_notes.md

### Evidence used
- None. The referenced fixture `BCIN-7289-blind-pre-defect-bundle` was provided with **no local path** and no customer issue content was included in the prompt.
- `./skill_snapshot/SKILL.md` was referenced as required but is **not accessible** in the provided materials.

### Files produced
- `./outputs/result.md` (this phase4a scenario draft with evidence placeholders)
- `./outputs/execution_notes.md`

### Blockers
- Missing customer-issue evidence required by blind evidence policy (**all_customer_issues_only**).
- Missing skill workflow package `./skill_snapshot/SKILL.md` required as authoritative workflow reference.

---

# Execution summary
Created a phase4a-aligned scenario drafting artifact covering prompt handling, template save, report builder loading, and visible report title outcomes, but could not finalize evidence-backed scenarios because the required customer-issue fixture content and SKILL.md were not available; placeholders mark where fixture evidence must be inserted to comply with blind_pre_defect rules.