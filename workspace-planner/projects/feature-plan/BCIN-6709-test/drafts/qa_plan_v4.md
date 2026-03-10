# Comprehensive QA Plan: BCIN-6709 — Improve Report Error Handling for Continued Editing

## 📊 Summary

| Field | Value |
|-------|-------|
| **Feature Link** | [BCIN-6709](https://strategyagile.atlassian.net/browse/BCIN-6709) |
| **Release Version** | 26.04 |
| **QA Owner** | Xue Yin |
| **SE Design Link** | [BCIN-6709 Design Doc](https://microstrategy.atlassian.net/wiki/spaces/~yuanli/pages/5901516841/BCIN-6709+Improve+the+behavior+for+end+user+to+allow+continued+operations+on+report+in+Library+after+error+happens) |
| **UX Design Link** | [Figma Design - provided input pending dedicated design extraction](https://www.figma.com/design/gzj8mez8AnHHm0u9tFJvFx/Report-enhancement?node-id=11-624&p=f&t=TnOBb83O2I1yNOQg-0) |
| **GitHub PR Links** | User-provided compare URLs plus Jira-comment PRs (`biweb#33041`, `mojojs#8873`, `web-dossier#22468`, `server#10905`, `productstrings#15008`, `productstrings#15012`) |
| **Date Generated** | 2026-03-07 |
| **Plan Status** | Draft v4 (post-review cleanup) |

## 📝 Background

### 1. Key Problem Statement

When report editing encounters execution or manipulation errors in Library authoring mode, users can lose progress, get stuck in loading states, be forced back to Library home, or lose the ability to continue editing. This pain is reflected not only in `BCIN-6709`, but also in closely related issues such as `BCEN-4843`, `BCIN-974`, `BCIN-6485`, `BCIN-6574`, and `BCIN-6706`.

### 2. Solution

The proposed solution is to recover the report authoring workflow instead of ejecting the user from it. The design and implementation evidence indicate a multi-layer recovery approach that:
- recreates the report instance after certain failures
- returns the user to pause mode or prompt when appropriate
- preserves prior work where possible
- resets undo/redo only for the failure classes where that is intended
- keeps the report view usable after recovery
- updates user-facing strings and statuses to support the new behavior

### 3. Business Context

This feature addresses repeated customer pain and escalation-sensitive report-authoring failures. The evidence set shows a cross-product impact area touching Library, Report Editor, Workstation-related parity expectations, prompt handling, and user-facing strings. Because the implementation spans multiple repos and recovery modes, QA must validate both correctness and user trust: users must be able to understand what happened and keep working.

## 🎯 QA Goals

### 1. E2E: End to End

- Verify a report author can continue editing after key report errors instead of being forced out.
- Verify recovery paths for pause-mode, running-mode, and prompt-related failures.
- Verify cross-repo behavior works as one coherent user flow.
- Verify related historical scenarios from linked issues are covered as regression targets.

### 2. FUN: Functionality

- Verify recreated-instance recovery works for the intended failure classes.
- Verify the report returns to the correct state after recovery.
- Verify undo/redo is preserved or reset according to the intended error type.
- Verify prompt-answer failures return the user to a usable prompt flow with prior answers preserved.
- Verify follow-up actions remain possible after recovery.

### 3. UX: User Experience

- Verify recovery states and error dialogs are understandable and actionable.
- Verify the report view does not remain blank, frozen, or confusing after recovery.
- Verify user-facing copy reflects the intended recovery behavior.
- Verify the user can tell whether they should retry, continue editing, or return to prompt.

### 4. PERF: Performance

- Verify recovery is responsive enough for real editing workflows.
- Verify repeated failures do not leave the editor in a degraded or endlessly loading state.
- Verify the recovered report remains usable for the next action.

### 5. SEC: Security

- Verify end users do not see internal implementation details in recovery/error messaging.
- Verify no sensitive system information is leaked in user-facing failure states.

### 6. ACC: Accessibility

- Verify error and recovery dialogs are keyboard accessible.
- Verify focus moves correctly during recovery and prompt-return flows.
- Verify critical recovery messaging is understandable to assistive technology users where applicable.

### 7. CER: Platform Certifications

- Verify recovery behavior is consistent in supported browsers.
- Verify platform-sensitive behavior remains stable for report authoring after recovery.

### 8. UPG: Upgrade and Compatibility

- Verify existing consumption-mode behavior is not regressed.
- Verify the feature behaves correctly in supported deployment environments.
- Verify older historical failure patterns represented by related issues are still covered after the new behavior lands.

### 9. INT: Integration

- Verify the recovery contract across editor, controller, backend, prompt flow, and string surfaces.
- Verify no-action / blocking-error refresh behavior is coordinated correctly across layers.
- Verify Workstation-related parity expectations are explicitly assessed where the evidence requires it.

### 10. AUTO: Automation

- Cover recovery behavior, prompt-return behavior, history policy, and status/copy surfaces with automated checks where feasible.
- Add regression coverage for the specific related-issue scenarios that materially shaped this feature.

## ⚠️ Risk & Mitigation

### 1. Technical Risks

| Risk | Impact | Likelihood | Mitigation Strategy | Code Reference |
|------|--------|------------|---------------------|----------------|
| Recovery flow differs by failure type and repo boundary | Users may lose work or be left in inconsistent states | High | Test each major recovery path separately and as a cross-repo end-to-end flow | `recreate-report-error.ts`, `RWManipulationImpl.java`, `RootController.js`, `ActionLinkContainer/index.js` |
| Missing or partial compare evidence for some repos | Full branch-level drift is not fully provable from compare URLs alone | Medium | Use fetched PR evidence, note remaining evidence gaps explicitly, and bias testing toward user-visible high-risk flows | `github_fetch_status_BCIN-6709.json` |
| Undo/redo policy split is easy to regress | Users may keep invalid history or lose valid history | High | Create explicit scenarios for preserved-history vs reset-history cases | `undo-redo-util.ts`, `UICmdMgr.js` |
| Prompt-specific recovery diverges from generic report recovery | Prompt failures may remain confusing or destructive | High | Test prompt-return flow as its own major scenario family | `promptActionCreators.js`, `ErrorObjectTransform.js` |
| Workstation-related parity expectations are under-tested | Important adjacent workflow gaps may be missed | Medium | Include dedicated Workstation coverage drawn from `BCIN-6706` evidence | `jira_issue_BCIN-6706.md` |

### 2. Data Risks

| Risk | Impact | Likelihood | Mitigation Strategy | Code Reference |
|------|--------|------------|---------------------|----------------|
| Prior edits are lost after recovery | Users lose productivity and confidence | High | Verify preserved-work expectations across pause-mode and running-mode flows | `report-def-slice.ts`, `report-property-slice.ts` |
| Prompt answers are lost during prompt-related recovery | Users must re-enter answers and may abandon the task | High | Validate prompt-answer preservation after failure | `promptActionCreators.js`, `ActionLinkContainer/index.js` |

### 3. UX Risks

| Risk | Impact | Likelihood | Mitigation Strategy | Code Reference |
|------|--------|------------|---------------------|----------------|
| Recovery UI remains blank, loading forever, or returns users home unexpectedly | Users cannot continue editing | High | Cover historical linked issues directly in manual and regression tests | `jira_issue_BCIN-974.md`, `jira_issue_BCIN-6485.md`, `document-view.tsx` |
| Messages and statuses do not match the new behavior | Users cannot tell what happened or what to do next | Medium | Validate updated strings from `productstrings` and editor statuses | `github_pr_productstrings_15008.json`, `github_pr_productstrings_15012.json` |

## 📎 Consolidated Reference Data

### 1. Source Documents

- [BCIN-6709 Jira Issue](https://strategyagile.atlassian.net/browse/BCIN-6709)
- [BCIN-6709 Design Doc](https://microstrategy.atlassian.net/wiki/spaces/~yuanli/pages/5901516841/BCIN-6709+Improve+the+behavior+for+end+user+to+allow+continued+operations+on+report+in+Library+after+error+happens)
- Related issues: `BCIN-7543`, `BCEN-4843`, `BCIN-6706`, `BCIN-6574`, `BCIN-6485`, `BCIN-974`, `BCEN-4129`
- User-provided Figma design input: `Report-enhancement` (dedicated Figma analysis still pending)
- User-provided GitHub compare links plus Jira-comment PR links

### 2. Intermediate Artifacts Used

- `workspace-planner/projects/feature-plan/BCIN-6709-test/context/confluence_design_doc_BCIN-6709.md`
- `workspace-planner/projects/feature-plan/BCIN-6709-test/context/jira_issue_BCIN-6709.md`
- `workspace-planner/projects/feature-plan/BCIN-6709-test/context/jira_issue_BCIN-7543.md`
- `workspace-planner/projects/feature-plan/BCIN-6709-test/context/jira_issue_BCEN-4843.md`
- `workspace-planner/projects/feature-plan/BCIN-6709-test/context/jira_issue_BCIN-6706.md`
- `workspace-planner/projects/feature-plan/BCIN-6709-test/context/jira_issue_BCIN-6574.md`
- `workspace-planner/projects/feature-plan/BCIN-6709-test/context/jira_issue_BCIN-6485.md`
- `workspace-planner/projects/feature-plan/BCIN-6709-test/context/jira_issue_BCIN-974.md`
- `workspace-planner/projects/feature-plan/BCIN-6709-test/context/jira_issue_BCEN-4129.md`
- `workspace-planner/projects/feature-plan/BCIN-6709-test/context/jira_related_issues_BCIN-6709.md`
- `workspace-planner/projects/feature-plan/BCIN-6709-test/context/jira_comment_pr_links_BCIN-6709.md`
- `workspace-planner/projects/feature-plan/BCIN-6709-test/context/jira_issue_refs_BCIN-6709.txt`
- `workspace-planner/projects/feature-plan/BCIN-6709-test/context/jira_urls_BCIN-6709.txt`
- `workspace-planner/projects/feature-plan/BCIN-6709-test/context/qa_plan_atlassian_BCIN-6709.md`
- `workspace-planner/projects/feature-plan/BCIN-6709-test/context/qa_plan_background_BCIN-6709.md`
- `workspace-planner/projects/feature-plan/BCIN-6709-test/context/github_diff_react-report-editor_compare.json`
- `workspace-planner/projects/feature-plan/BCIN-6709-test/context/github_diff_biweb_compare.json`
- `workspace-planner/projects/feature-plan/BCIN-6709-test/context/github_diff_react-report-editor.md`
- `workspace-planner/projects/feature-plan/BCIN-6709-test/context/github_diff_biweb.md`
- `workspace-planner/projects/feature-plan/BCIN-6709-test/context/github_diff_mojojs.md`
- `workspace-planner/projects/feature-plan/BCIN-6709-test/context/github_diff_web-dossier.md`
- `workspace-planner/projects/feature-plan/BCIN-6709-test/context/github_pr_biweb_33041.json`
- `workspace-planner/projects/feature-plan/BCIN-6709-test/context/github_pr_mojojs_8873.json`
- `workspace-planner/projects/feature-plan/BCIN-6709-test/context/github_pr_productstrings_15008.json`
- `workspace-planner/projects/feature-plan/BCIN-6709-test/context/github_pr_productstrings_15012.json`
- `workspace-planner/projects/feature-plan/BCIN-6709-test/context/github_pr_server_10905.json`
- `workspace-planner/projects/feature-plan/BCIN-6709-test/context/github_pr_web-dossier_22468.json`
- `workspace-planner/projects/feature-plan/BCIN-6709-test/context/github_fetch_status_BCIN-6709.json`
- `workspace-planner/projects/feature-plan/BCIN-6709-test/context/qa_plan_github_BCIN-6709.md`
- `workspace-planner/projects/feature-plan/BCIN-6709-test/context/qa_plan_github_traceability_BCIN-6709.md`
- `workspace-planner/projects/feature-plan/BCIN-6709-test/context/figma_link_BCIN-6709.md`

### 3. Stakeholders

- Product / feature owner: Wei (Irene) Jiang
- QA owner: Xue Yin
- Design / solution references: Yuan Li and linked design contributors in Confluence and Jira
- Impacted end users and customer pain appear across the main issue and related defects

### 4. Test Data

- Report scenarios that exceed row limits
- Prompted reports with answer/apply failure paths
- Reports that trigger loading-forever or blank-grid conditions from related issues
- Workstation scenarios tied to failed report execution and continued editing parity
- Recovery scenarios involving strings/status updates from `productstrings`

### 5. Dependencies

- Cross-repo recovery behavior depends on synchronized behavior across editor, controller, backend, prompt flow, and strings
- Some compare-url evidence remains partial; fetched PR evidence is used to close the most important gaps
- The user-provided Figma link is available, but design-derived context still needs a successful dedicated Figma analysis pass to enrich UI-specific detail beyond the current evidence set

## 🎯 Sign-off Checklist

### 1. Development Team

- [ ] Recovery behavior confirmed across all required repos
- [ ] Undo/redo policy confirmed for each intended error class
- [ ] Prompt-return logic confirmed
- [ ] Updated strings/statuses reviewed for release readiness

### 2. QA Team

- [ ] Historical related-issue scenarios mapped into coverage
- [ ] P0/P1 recovery scenarios executed and passed
- [ ] Workstation-related parity scenarios reviewed
- [ ] Cross-browser / environment validation completed

### 3. Product Team

- [ ] Customer pain scenarios addressed in manual coverage
- [ ] User-facing recovery flow and messages reviewed
- [ ] Expected continuation behavior agreed for affected report-authoring scenarios

### 4. Security Team

- [ ] Recovery/error messages do not leak internal implementation details
- [ ] Production-like error states reviewed for information leakage

### 5. Release Readiness

- [ ] Cross-repo dependency readiness reviewed
- [ ] Known evidence gaps documented and accepted if any remain
- [ ] Support / documentation teams aware of changed recovery behavior

## 📊 QA Summary

### 1. Code Changes

| Repo | PR / Evidence | Files Changed | PR Summary |
|------|---------------|---------------|------------|
| react-report-editor | `github_diff_react-report-editor_compare.json` | 17 files | Core recreate-report recovery, state handling, and re-render behavior |
| biweb | `github_pr_biweb_33041.json` | 3 files | Backend support for recreate report instance behavior |
| mojojs | `github_pr_mojojs_8873.json` | 2 files | Controller / command manager coordination for recovery |
| web-dossier | `github_pr_web-dossier_22468.json` | 6 files | Prompt-error recovery and error mapping |
| server | `github_pr_server_10905.json` | 1+ files | Backend support for blocking-error refresh behavior |
| productstrings | `github_pr_productstrings_15008.json`, `github_pr_productstrings_15012.json` | strings/status assets | User-facing copy and status updates |

### 2. Evidence Gaps Still Visible

- Fully gathered evidence exists for Jira, Confluence, the main React Report Editor compare, and the Jira-comment PR set.
- Compare-based evidence remains partial for some repos (`biweb`, `mojojs`, `web-dossier`) because the original compare URLs were not all fetchable in the same way as the React Report Editor compare.
- Jira-comment PR evidence for those repos is available and is being used for behavioral and traceability coverage.
- The user-provided Figma link is available as input, but the design has not yet been converted into a dedicated Figma context artifact for this draft.

### 3. Risk Level

**Overall Risk: High**
- multi-repo recovery feature
- multiple adjacent historical defects
- different behavior by failure class
- Workstation parity and user-facing string considerations

**QA posture:** comprehensive manual + integration + regression coverage required before calling the feature ready.
