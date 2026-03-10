# Normalization Summary — BCED-2416

## Unified interpretation
BCED-2416 is treated as the system-of-record feature for QA planning. The provided Confluence page is treated as supporting design evidence for the same embedded parity architecture pattern, despite the key mismatch. Across Jira, Confluence, and background research, the dominant theme is consistent:
- Workstation is moving from a distinct/legacy authoring experience toward an embedded Library-based authoring path.
- Workstation still owns native shell concerns such as entry points, window management, save dialogs, preference/toggle behavior, and fallback routing.
- Therefore the most important QA objective is **state continuity across shell + embedded editor boundaries**, not UI appearance parity alone.

## Normalized feature intent
1. Give Workstation users a Library-parity authoring experience for primary create/edit/save workflows.
2. Preserve Workstation-native entry points and desktop-shell behavior.
3. Route safely between new embedded path and legacy path based on release/version/toggle constraints.
4. Preserve ACL/privilege behavior in line with Library Web expectations.
5. Avoid unacceptable open-time, first-load, and interaction regressions.

## Highest-priority QA themes
- editor selection and fallback correctness
- create/edit/save continuity
- cancel/close/recovery behavior
- OAuth / connector / auth handoff
- shell synchronization after save or navigation
- performance cold vs warm behavior
- privilege parity with Library Web

## Planning consequence
The draft QA plan must emphasize executable scenario coverage over implementation detail, with strong P1 concentration in routing/fallback, save/edit continuity, close/cancel lifecycle, auth compatibility, and performance-sensitive first-use flows.
