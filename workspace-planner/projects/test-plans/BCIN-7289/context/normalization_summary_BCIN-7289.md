# Normalization Summary — BCIN-7289

## Unified interpretation
BCIN-7289 is a **desktop-shell + embedded-editor integration feature** for Workstation report authoring. The feature does not merely expose Library UI inside Workstation; it replaces the old editor path for supported cases while preserving Workstation-native integrations such as dialogs, title updates, window lifecycle, comments, object editing, and fallback routing.

## Dominant QA thesis
The central QA question is:
**Can users create, edit, save, prompt, cancel, recover, and close reports in the right state across the boundary between embedded Library authoring and Workstation-native shell behavior?**

## Highest-priority QA themes
- editor routing by version + preference
- fallback when embedded path is unavailable or fails
- create/edit entry-point parity
- save/save as/template continuity with native dialogs
- prompt / pause / running-state integrity
- close/cancel/back/home lifecycle and instance cleanup
- auth / ACL / session correctness
- title/object refresh and shell synchronization
- cold/warm performance and scroll responsiveness
- intentional UI deltas vs real regressions

## Planning consequence
The QA plan should concentrate P1 coverage on route correctness, report-state integrity, native-bridge continuity, and failure recovery. Visual and stylistic parity checks matter, but only after workflow and state integrity are covered.
