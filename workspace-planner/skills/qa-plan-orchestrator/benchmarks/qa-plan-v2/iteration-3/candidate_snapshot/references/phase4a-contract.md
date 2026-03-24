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
- When the active knowledge pack declares `i18n dialogs` as a required capability, each dialog whose string keys are added or changed in the release must have locale-aware verification leaves in the scenario set.

## Report-Editor Replay Anchor

- When the active knowledge pack is `report-editor`, Phase 4a must add a report-editor replay anchor instead of broadening generic family wording.
- The report-editor replay anchor must map `setWindowTitle` and any other replay-relevant SDK-visible outcomes to visible scenario leaves with `knowledge_pack_row_id` traceability.
- Required report-editor replay scenario coverage must explicitly include:
  - prompt-editor and report-builder interaction coverage
  - template-save, prompt-pause, and builder-loading chains
  - workstation title correctness on edit
- Report-editor replay scenarios must keep visible scenario leaves tied to the concrete user-visible outcomes rather than generic API mentions.
- These replay-anchor rules are report-editor-specific and must not become generic obligations for unrelated families such as `docs`, `export`, or `native-embedding`.
