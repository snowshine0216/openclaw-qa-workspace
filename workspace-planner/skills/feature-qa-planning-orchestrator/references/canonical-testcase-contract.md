# Canonical Testcase Contract

Use this contract for every manual and XMind-style testcase artifact produced by the QA planning workflow.

## Canonical top-level headings

Preserve these semantic buckets in this exact order:

1. `## EndToEnd`
2. `## Functional`
3. `## xFunction`
4. `## Error handling / Special cases`
5. `## Accessibility`
6. `## i18n`
7. `## performance`
8. `## upgrade / compatability`
9. `## Embedding`
10. `## AUTO: Automation-Only Tests`
11. `## 📎 Artifacts Used`

## Rename rule

- Only `EndToEnd` and `Functional` may be renamed.
- A renamed heading must still map to the same semantic bucket.
- Default allowed aliases for `EndToEnd`: `End to End`, `End-to-End`, `E2E`, `User Journey`, `Primary User Flow`.
- Default allowed aliases for `Functional`: `Functionality`, `Functional Coverage`, `Core Functional Coverage`, `Core Scenarios`.
- All remaining top-level headings are fixed. Do not rename, merge, drop, or replace them.

## N/A rule for fixed headings

- Every fixed heading must remain present even when there is no meaningful coverage.
- If a fixed heading is not applicable, add one concise leaf node in the section:
  - `N/A — not applicable for this feature scope`
  - `N/A — no new accessibility impact introduced`
  - `N/A — no embedding surface in scope`

## Manual testcase executability contract

Every manual testcase must make these four items explicit:

1. **Surface / location** — where the tester is acting.
2. **Concrete trigger** — what exact branch, failure, or state is exercised.
3. **Concrete user action** — what exact UI action is performed.
4. **Observable expected result** — what visible state proves success.

If one of the four items is unknown:
- resolve it from cached context first
- then look up Confluence or background research
- if still unknown, leave `<!-- TODO: specify trigger/action/result -->`
- never replace the missing detail with vague wording

## Manual vs AUTO rule

- Keep manually executable checks in the manual sections.
- Move code-internal-only checks to `## AUTO: Automation-Only Tests`.
- A tester should not need to infer API payloads, internal flags, or hidden function behavior to execute a manual case.

## Vagueness blacklist

Do not use wording like:

- `Recover from a supported report execution or manipulation error`
- `Perform another valid editing action`
- `Observe the recovered state`
- `Verify correct recovery`
- `Matches documented branch behavior`

Rewrite them into explicit trigger/action/result language.

## Examples

### Bad

- `Recover from a supported report execution or manipulation error`

### Better

- `In Library Web authoring, open the report in pause mode, click Resume Data Retrieval, trigger the known Resume Data Retrieval failure branch, and verify the report returns to Data Pause Mode with the grid still on the same canvas`

### Bad

- `Perform another valid editing action`

### Better

- `In the report editor toolbar, remove one metric from the template grid and verify the grid refreshes without redirecting to Library home`

### Bad

- `Verify correct recovery`

### Better

- `Verify the prompt dialog reopens with the previous answers preserved and the user can submit a different value`
