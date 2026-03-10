# Coverage Ledger — BCIN-7289

| Candidate ID | Capability / Journey | Coverage Type | Planned Section | Planned Scenario | Status |
|---|---|---|---|---|---|
| MC-01 | Create new report with embedded editor enabled | E2E | EndToEnd | Create a new report end-to-end in Workstation with new editor enabled | covered |
| MC-02 | Open/edit existing report with embedded editor enabled | E2E | EndToEnd | Open existing report, edit, save, reopen | covered |
| MC-03 | Preference disabled path uses legacy editor | Functional / Regression | Core Functional Flows / Regression | Toggle off new editor and verify legacy path | covered |
| MC-04 | Embedded editor initialization failure fallback | Error / Recovery | Error Handling / Recovery | Simulate embedded-editor startup failure and verify fallback sequencing | covered |
| MC-05 | Prompt-heavy report flow works | Functional / E2E | EndToEnd / Core Functional Flows | Prompt-heavy report open/answer/edit/save | covered |
| MC-06 | Native Workstation save / save-as integration | Functional / Regression | Core Functional Flows / Regression | Save/save-as via native WS dialog and verify metadata/UI sync | covered |
| MC-07 | Session timeout / re-auth handling | Error / Recovery / Regression | Error Handling / Recovery / Regression | Timeout during open edit session and verify recovery without Library dead-end | covered |
| MC-08 | Cancel / close during execution | Error / Recovery / Regression | Error Handling / Recovery | Cancel or close during execution/prompt flow | covered |
| MC-09 | Privilege / ACL parity | Security / Permissions | Permissions / Security / Data Safety | Unauthorized user cannot edit or save | covered |
| MC-10 | Performance cold start and subsequent open | Performance | Observability / Performance / UX Feedback | Measure first open and repeat open responsiveness | covered |
| MC-11 | Toolbar / shell integration and settings isolation | Regression / Compatibility | Regression / Known Risks / Compatibility | Verify no toolbar bleed or malformed embedded shell UI | covered |
| MC-12 | Report-specific advanced capabilities remain accessible or explicitly excluded | Compatibility / Functional | Compatibility / Platform / Environment / Out of Scope | Validate filter, advanced properties, SQL-related surfaces where applicable | covered |
