# Phase 4a Contract

## Purpose

Write a subcategory-only QA draft.
Do not introduce canonical top-layer grouping in this phase.

## Required Inputs

- `context/artifact_lookup_<feature-id>.md`
- `context/coverage_ledger_<feature-id>.md`

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
