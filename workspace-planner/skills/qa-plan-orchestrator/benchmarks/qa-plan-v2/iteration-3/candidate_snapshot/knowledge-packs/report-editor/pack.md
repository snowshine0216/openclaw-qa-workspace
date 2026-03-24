# Report Editor Knowledge Pack

## Required Capabilities

- template-based creation
- save override
- prompt execution
- report builder interaction
- window title correctness
- i18n dialogs
- save-as-overwrite
- subset-report-save
- intelligent-cube-conversion
- session-timeout-handling

## Required Outcomes

- report builder becomes interactive after template-based save
- window title reflects current report context
- localized dialog actions remain complete and interactive
- report builder loads prompt elements correctly after double-click (BCIN-7727)
- edit report in workstation shows the correct title matching the current report (BCIN-7733)
- save-as to overwrite existing report completes without JS error (BCIN-7669)
- all dialog string keys added or changed in the release are translated for all supported locales (BCIN-7720/21/22)

## State Transitions

- template-based creation -> save override (trigger: save action; outcome: folder visibility refresh after save)
- prompt editor open -> close-confirmation (trigger: close action; outcome: pause-mode prompts and confirmation path)
- save-as initiated -> overwrite-confirmation (trigger: target report already exists; outcome: overwrite shown without crash, existing report replaced on confirm)
- template with prompt pause mode -> report running (trigger: template saved and opened; outcome: report runs correctly after creation)
- report list view -> edit report open (trigger: double-click on report in workstation; outcome: editor shows correct title)

## Analog Gates

- `[ANALOG-GATE]` folder visibility refresh after save (DE332260)
- `[ANALOG-GATE]` save dialog completeness and interactivity (DE331555)
- `[ANALOG-GATE]` report builder prompt element loading after interaction (BCIN-7727)
- `[ANALOG-GATE]` template with prompt pause mode running after creation (BCIN-7730)

## SDK Visible Contracts

- `setWindowTitle`
- `errorHandler`

## Interaction Pairs

- template-based creation + pause-mode prompts
- close-confirmation + prompt editor open
- save-as-overwrite + template-save (concurrent save path risk)
- prompt-pause-mode + report-builder-loading (BCIN-7727 + BCIN-7730)

## Interaction Matrices

- matrix-prompt-editor-safety:
  - template-based creation + pause-mode prompts
  - close-confirmation + prompt editor open
- matrix-save-and-template-risk:
  - save-as-overwrite + template-save
  - prompt-pause-mode + report-builder-loading

## Anti-Patterns

- implicit sdk contract wording without observable verification leaves
- silent drop of report-editor interaction coverage during review refactor
- multiple confirm-close dialogs from repeated X-button clicks without deduplication guard
- i18n string additions without coverage verification for all affected dialog locales

## Evidence Refs

- Jira DE332260: folder visibility refresh after save
- Jira DE331555: save dialog completeness and interactivity
- Jira BCIN-7669: save-as override throws JS crash
- Jira BCIN-7727: report builder fails to load prompt elements after double-click
- Jira BCIN-7730: template with prompt pause mode won't run after creation
- Jira BCIN-7733: double-click edit shows wrong title in workstation new editor
