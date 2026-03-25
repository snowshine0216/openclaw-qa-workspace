# Self Test Gap Analysis — BCIN-7289

This document categorizes the 13 open defects from the BCIN-7289 defect report into the standard QA Plan Evolution gap taxonomy buckets.

## Gap Taxonomy Distribution

| Taxonomy Bucket | Defect Count | Primary Defect Keys |
|---|---|---|
| **Observable Outcome Omission** | 3 | BCIN-7668, BCIN-7727, BCIN-7733 |
| **State Transition Omission** | 4 | BCIN-7669, BCIN-7693, BCIN-7708, BCIN-7730 |
| **SDK/Contract Isolation Leak** | 0 | |
| **Interaction Pair Disconnect** | 1 | BCIN-7709 |
| **i18n/L10n Coverage Gap** | 3 | BCIN-7720, BCIN-7721, BCIN-7722 |
| **Edge Case / Unholy State** | 1 | BCIN-7688 |
| **Cosmetic / Micro UX** | 1 | BCIN-7695 |

## Detailed Gap Classification

### Observable Outcome Omission
*Gaps where the QA plan generated the right scenario but missed verifying a crucial observable detail.*
- **BCIN-7668 (Two loading icons):** The test plan covers "Create/Edit report" but fails to mandate a check for exactly one loading indicator.
- **BCIN-7727 (Report Builder fails to load elements):** The plan dictates double-clicking to edit prompts but misses the specific outcome that Report Builder sub-elements must render interactively.
- **BCIN-7733 (Wrong title on double-click):** The plan tests opening a report from workstation but lacks the verification leaf ensuring the window title exactly matches the clicked report's context.

### State Transition Omission
*Gaps where a specific sequence of actions moving between states was not generated.*
- **BCIN-7669 (Save-as override JS error):** The transition from "Save-As" to "Overwrite Conflict Confirmation" is a core state transition that the plan wholly missed. 
- **BCIN-7693 (Session timeout error):** The transition from any "Active" state to "Session Expired" lacks a scenario covering the required redirect routing.
- **BCIN-7708 (Confirm-close not shown):** The transition off the prompt editor state lacks an explicit "attempt to close without saving" trigger resulting in a confirmation dialog.
- **BCIN-7730 (Template + pause won't run):** The transition from "Create Template with Pause Mode" directly to "Run Result" was missing from the generated paths.

### Interaction Pair Disconnect
*Gaps where two features logically interact but were not tested together.*
- **BCIN-7709 (Multiple confirm popups on fast clicks):** The interaction between the generic "Close Window" action and the "Unsaved Changes" guard state wasn't tested for concurrent click stress.

### i18n/L10n Coverage Gap
*Gaps where translated text or locale-specific rendering was ignored.*
- **BCIN-7720, BCIN-7721, BCIN-7722:** The test plan treats dialog generation as a generic functional test without mandating verification of string translation mapping across supported locales.

### Edge Case / Unholy State
*Gaps involving states that shouldn't occur or represent disjoint feature sets.*
- **BCIN-7688 (Set as template disabled):** A complex edge case depending on the precise timing of the "newly created" flag vs the "save" action.

### Cosmetic / Micro UX
*Low impact UI/UX misses.*
- **BCIN-7695 (Copy SQL tooltip):** A purely cosmetic tooltip oversight, likely untestable without specific DOM assertions.
