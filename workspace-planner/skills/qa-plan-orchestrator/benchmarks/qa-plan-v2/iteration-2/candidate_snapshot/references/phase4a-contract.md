# Phase 4a Contract

## Purpose

Write a subcategory-only QA draft.
Do not introduce canonical top-layer grouping in this phase.

## Required Inputs

- `context/artifact_lookup_<feature-id>.md`
- `context/coverage_ledger_<feature-id>.md`
- `context/coverage_ledger_<feature-id>.json` when a knowledge pack is active
- `context/knowledge_pack_summary_<feature-id>.md` when a knowledge pack is active
- `context/knowledge_pack_retrieval_<feature-id>.md` when a knowledge pack is active
- `context/supporting_issue_summary_<feature-id>.md` when support-only Jira keys were requested
- `context/deep_research_synthesis_report_editor_<feature-id>.md` for report-editor planning

## Output

- `drafts/qa_plan_phase4a_r<round>.md`
- reruns must advance to the next real round instead of reusing `r1`

## Required Structure

- central topic
- subcategory
- scenario
- atomic action chain
- observable verification leaves

## Forbidden Structure

- canonical top-layer categories such as `Security`, `Compatibility`, `EndToEnd`, `i18n`
- compressed `A -> B -> C` bullets
- verification text mixed into action bullets

## Embedded Scaffold

Feature QA Plan (<FEATURE_ID>)

- Authentication
    * Incorrect password blocks sign-in
        - Open the login page
            - Enter a valid username
                - Enter an incorrect password
                    - Click Sign in
                        - Inline password error appears
                        - The user remains on the login page

## Embedded Few Shots

Bad (top-category leakage, compressed steps):
- Security
    * Login <P1>
        - Login -> input wrong password
            - Error appears

Good (subcategory-first, atomic nested steps):
- Login <P1>
    * Incorrect password blocks sign-in
        - Open the login page
            - Enter a valid username
                - Enter an incorrect password
                    - Click Sign in
                        - Inline password error appears

## Supplemental Research Rule

If current evidence is insufficient, do one bounded research pass with `confluence`, `jira-cli`, or `tavily-search`, save the artifact under `context/`, and update `artifact_lookup_<feature-id>.md` before finalizing the draft.

## Support And Gap Coverage

- Support-derived risks must remain visible in the Phase 4a scenario set.
- Report-editor Workstation behavior and Library-vs-Workstation gap implications must be represented as evidence-backed scenarios or explicit exclusions.
- When a knowledge pack applies, each required capability must map to a scenario, a release gate, or an explicit exclusion.
- Pack-backed mappings must preserve the source `knowledge_pack_row_id` from `coverage_ledger_<feature-id>.json` whenever a draft scenario, explicit exclusion, or release gate is seeded from a retrieved row.
- SDK/API visible outcomes declared in the active knowledge pack (e.g. `setWindowTitle`, `errorHandler`) must each map to at least one scenario with a testable, observable verification leaf. Implicit mentions without explicit observable outcomes are insufficient.
- State transitions declared in the active knowledge pack must each appear as a scenario chain (from-state → trigger → to-state → observable outcome). A transition that has no scenario chain is a coverage gap.
- For report-editor planning, the Phase 4a draft must preserve explicit scenario chains for these transition ids when they are present in the active knowledge pack:
  - `transition-template-draft-to-saved`: `template-based creation` -> `save action` -> `save override` -> `folder visibility refresh after save`
  - `transition-prompt-editor-close-confirmation`: `prompt editor open` -> `close action` -> `close-confirmation` -> `pause-mode prompts and confirmation path are explicit`
  - `transition-save-as-overwrite-conflict`: `save-as initiated` -> `target report already exists` -> `overwrite-confirmation` -> `overwrite confirmation shown without JS error; existing report replaced on confirm`
  - `transition-prompt-pause-mode-template-run`: `template-based creation with prompt pause mode` -> `template saved and opened` -> `report running` -> `report with prompt pause mode runs correctly after template creation`
  - `transition-double-click-edit-title`: `report list view` -> `double-click on report in workstation` -> `edit report open` -> `editor opens with the correct report title (not stale/wrong title)`
- When the active knowledge pack declares `i18n dialogs` as a required capability, each dialog whose string keys are added or changed in the release must have locale-aware verification leaves in the scenario set.
