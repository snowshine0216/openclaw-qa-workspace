# Jira normalized summary — BCIN-7289 report editor

## Scope conclusion
- **Authoritative issue:** `BCIN-7289`
- **Formal parent:** none populated in Jira
- **Formal linked issues:** none populated in Jira
- **Formal child that materially affects delivery/QA:** `BCIN-7603`
- **Supporting / precedent issues that materially affect QA scope:** `BCIN-7044`, `BCIN-7073`, `BCIN-7074`, `BCIN-7126`, `BCIN-1017`, `BCIN-7218`, `BCIN-7049`
- **Supporting-only lessons-learned analog:** `BCED-2416`

## QA-scope themes distilled from Jira evidence
1. **Editor replacement / parity risk** — Workstation is moving from an older native report-editor path toward embedded Library editor behavior.
2. **Preference + rollout gating** — Workstation needs an explicit preference or flag to adopt the new editor.
3. **Fallback resilience** — If the embedded editor path fails, Workstation must fall back to the next registered editor safely.
4. **Prompt / pause-mode behavior** — Prior report-editor work shows prompt resolution and pause-mode behavior are historically fragile and likely regression hotspots.
5. **Feature-flag / app-setting behavior** — Report-editor functionality can be hidden/shown based on combined feature flags and application settings.
6. **UI parity / visual regressions** — Even low-level icon and section rendering defects have already appeared in the report-editor area.
7. **Compatibility + security analogs** — Dashboard embedding precedent shows the need to verify version fallback, privilege parity, and ACL consistency.

---

## Material issue summaries

### 1) BCIN-7289 — Embed Library Report Editor into the Workstation report authoring
- **Relationship:** authoritative feature
- **Summary:** Replace or embed the Library report editor inside Workstation report authoring to reduce duplicate old-tech effort and align with the dashboard embedding pattern.
- **QA impact:**
  - Core end-to-end scope anchor for all report-authoring flows in Workstation.
  - QA must validate that Workstation authoring behavior matches Library editor expectations without breaking existing report flows.
- **Key risks:**
  - Hidden regressions where Workstation-specific behavior diverges from Library behavior.
  - Prompt handling, authoring initialization, object loading, and save/open flows may break because the editor implementation path changes.
- **Parity implications:** high; this is fundamentally a parity / unification feature.
- **Fallback implications:** implied by child implementation work; fallback path must be validated.
- **Performance implications:** editor boot/load/render latency may change due to embedding.
- **Security implications:** must preserve existing privilege enforcement and object access semantics when authoring through embedded web content.

### 2) BCIN-7603 — Enhancements in Workstation
- **Relationship:** only formal child of `BCIN-7289`
- **Summary:** Workstation enhancements needed to adopt the embedded report editor, including a preference toggle and sequential fallback when multiple editor registrations exist.
- **QA impact:**
  - Introduces explicit rollout-state permutations.
  - Creates concrete fallback scenarios that must be validated in addition to nominal editor launch.
- **Key risks:**
  - Preference toggle incorrectly enables/disables the editor.
  - Failure in primary editor registration could strand the user instead of falling back cleanly.
  - State persistence or migration issues for users switching between legacy and embedded editors.
- **Parity implications:** medium-high; toggle behavior must not create inconsistent capabilities across environments.
- **Fallback implications:** critical; fallback sequencing is explicitly required.
- **Performance implications:** editor selection / startup path may incur extra latency or repeated initialization.
- **Security implications:** fallback path must not bypass intended editor eligibility or entitlement checks.

### 3) BCIN-7044 — Add view mode option for user to select when create report based on report template
- **Relationship:** precedent feature in the same report-editor surface; materially relevant for regression scope
- **Summary:** Adds user-selectable entry mode (pause/design vs execution/data retrieval) when creating a report from a template, especially around prompt behavior.
- **QA impact:**
  - Signals that report creation entry mode is a sensitive workflow likely affected by editor replacement.
  - Template-based report creation should be part of regression coverage for `BCIN-7289`.
- **Key risks:**
  - Embedded editor launches directly into the wrong mode.
  - Prompt-first flows may skip, duplicate, or mishandle prompt resolution.
- **Parity implications:** high; the issue explicitly references parity gaps vs BI Web / Developer.
- **Fallback implications:** moderate; fallback editor may not preserve chosen mode.
- **Performance implications:** prompt initialization and data retrieval startup cost may differ by mode.
- **Security implications:** prompt-visible data and object access must remain scoped correctly.

### 4) BCIN-7073 — Spike | Report Editor support prompt resolve in pause mode
- **Relationship:** discovery / design predecessor under `BCIN-7044`
- **Summary:** Investigation focused on supporting prompt resolution in pause mode.
- **QA impact:**
  - Strong signal that prompt resolution in pause mode is non-trivial and should be targeted explicitly in QA.
- **Key risks:**
  - Pause mode may partially resolve prompts, stall, or open in inconsistent state.
- **Parity implications:** high; pause-mode semantics must stay aligned across surfaces.
- **Fallback implications:** moderate; fallback editor may behave differently for unresolved prompts.
- **Performance implications:** prompt resolution timing and UI responsiveness are likely sensitive.
- **Security implications:** prompt answers may expose governed data if access checks drift.

### 5) BCIN-7074 — Implementation | Report Editor enhancement
- **Relationship:** implementation follow-through under `BCIN-7044`
- **Summary:** Delivery issue for the report-editor enhancement tied to the mode/prompt feature area.
- **QA impact:**
  - Confirms the prompt/mode space has had dedicated implementation work and should be part of regression coverage.
- **Key risks:**
  - Implementation-specific edge cases may reappear when the editor foundation changes again.
- **Parity implications:** medium-high.
- **Fallback implications:** moderate.
- **Performance implications:** moderate.
- **Security implications:** low-medium, mostly around preserving expected mode-specific permissions/data access.

### 6) BCIN-7126 — Spike | Report Editor support prompt resolve in pause mode
- **Relationship:** additional open artifact in the same problem area
- **Summary:** Open test-set issue for the same pause-mode prompt-resolution space.
- **QA impact:**
  - Reinforces that this area is still considered important enough to track independently.
  - Good candidate source for negative / exploratory regression scenarios.
- **Key risks:**
  - Known-unknowns may still exist around prompt behavior in embedded flows.
- **Parity implications:** high.
- **Fallback implications:** moderate.
- **Performance implications:** moderate.
- **Security implications:** medium where prompts gate secured data.

### 7) BCIN-1017 — Library web | Enhance library web and report editor to respect both feature flag and application setting for report view filter
- **Relationship:** precedent gating behavior in report editor
- **Summary:** Report-editor behavior depends on both feature flag and application setting, with Library web alignment.
- **QA impact:**
  - `BCIN-7289` regression matrix should include feature-flag/app-setting permutations, not just a single enabled state.
- **Key risks:**
  - Embedded editor ignores one gate and shows/hides functionality incorrectly.
- **Parity implications:** high; settings parity is the main concern.
- **Fallback implications:** moderate; legacy fallback may expose different filter behavior.
- **Performance implications:** low.
- **Security implications:** medium; gated functionality can become an accidental exposure vector.

### 8) BCIN-7218 — implement on report editor to show/hide view filter by application setting and feature flag
- **Relationship:** concrete implementation child of `BCIN-1017`
- **Summary:** Implements report-editor show/hide behavior for the view filter under application-setting and feature-flag control.
- **QA impact:**
  - Specific regression target for UI visibility and behavior consistency under configuration permutations.
- **Key risks:**
  - Hidden controls remain actionable indirectly.
  - Control state differs between embedded and fallback editors.
- **Parity implications:** high.
- **Fallback implications:** moderate.
- **Performance implications:** low.
- **Security implications:** medium if hidden UI still exposes protected actions.

### 9) BCIN-7049 — [Report editor] Attribute metric icon in report page by section is old
- **Relationship:** visual/UI defect precedent in the same editor surface
- **Summary:** Report-editor UI iconography in section/page area was stale / inconsistent.
- **QA impact:**
  - Visual parity checks should be included; not all risk is functional.
  - Embedded editor adoption may fix or reintroduce styling mismatches.
- **Key risks:**
  - Icon, style, or section affordance regressions slip through if QA only covers behavior.
- **Parity implications:** medium-high for visual parity.
- **Fallback implications:** low.
- **Performance implications:** low.
- **Security implications:** low.

### 10) BCED-2416 — Enhance Workstation dashboard authoring experience with Library capability parity
- **Relationship:** supporting-only analog; not authoritative report-editor scope
- **Summary:** Prior Workstation dashboard authoring migration to embedded Library experience, including preference toggle, compatibility fallback, and privilege parity expectations.
- **QA impact:**
  - Useful migration analog for rollout strategy, server-version compatibility, and ACL validation.
  - Should inform test heuristics, not expand authoritative product scope.
- **Key risks:**
  - Same embedding pattern could reproduce dashboard-class rollout bugs in report authoring.
- **Parity implications:** very high as lessons learned.
- **Fallback implications:** critical lesson; older server / unsupported cases must fall back gracefully.
- **Performance implications:** medium; webview-based editor startup and interaction cost should be compared.
- **Security implications:** high lesson value; preserve Library-Web-equivalent privileges and ACL behavior.

---

## Practical takeaways for the orchestrator
- Treat `BCIN-7603` as the must-cover implementation companion to `BCIN-7289`.
- Treat prompt-mode issues (`BCIN-7044`, `BCIN-7073`, `BCIN-7074`, `BCIN-7126`) as **high-probability regression areas**.
- Treat config gating issues (`BCIN-1017`, `BCIN-7218`) as **matrix-expansion drivers**.
- Treat `BCIN-7049` as a signal to include **visual/UI parity checks**, not only workflow checks.
- Use `BCED-2416` only to import **fallback / compatibility / ACL lessons**, not as formal scope.
