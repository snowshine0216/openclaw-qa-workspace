# Report Editor Knowledge Pack

## Required Capabilities

- template-based creation
- save override
- prompt execution
- report builder interaction
- window title correctness
- i18n dialogs

## Required Outcomes

- report builder becomes interactive after template-based save
- window title reflects current report context
- localized dialog actions remain complete and interactive

## State Transitions

- template-based creation -> save override (trigger: save action; outcome: folder visibility refresh after save)
- prompt editor open -> close-confirmation (trigger: close action; outcome: pause-mode prompts and confirmation path)

## Analog Gates

- `[ANALOG-GATE]` folder visibility refresh after save
- `[ANALOG-GATE]` save dialog completeness and interactivity

## SDK Visible Contracts

- `setWindowTitle`
- `errorHandler`

## Interaction Pairs

- template-based creation + pause-mode prompts
- close-confirmation + prompt editor open

## Interaction Matrices

- matrix-prompt-editor-safety:
  - template-based creation + pause-mode prompts
  - close-confirmation + prompt editor open

## Anti-Patterns

- implicit sdk contract wording without observable verification leaves
- silent drop of report-editor interaction coverage during review refactor

## Evidence Refs

- Jira DE332260: folder visibility refresh after save
- Jira DE331555: save dialog completeness and interactivity
