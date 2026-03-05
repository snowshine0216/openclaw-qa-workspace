---
name: qa-plan-synthesize
description: Synthesizes QA domain summaries from Figma, GitHub, and Atlassian sources into a single comprehensive user-facing QA plan. Generates the final test points table by mapping ACs to Code Changes. Use when the user asks to "consolidate QA plans", "merge QA analysis", or "create final QA plan" after running individual analysis skills.
---

# QA Plan Synthesize

Consolidate QA domain summaries from Figma design analysis, GitHub PR analysis, and Atlassian requirements analysis into a comprehensive, user-facing QA plan document.

## When to Use

- User has run multiple QA domain analysis skills (figma, github, atlassian)
- User asks to "consolidate QA plans" or "merge QA analysis"
- User wants a "comprehensive QA plan" combining all sources
- All domain summaries are ready for integration

## Prerequisites

At least ONE of the following domain summaries should exist:
- `projects/feature-plan/<feature-id>/context/qa_plan_figma_<feature_id>.md`
- `projects/feature-plan/<feature-id>/context/qa_plan_github_<feature_id>.md`
- `projects/feature-plan/<feature-id>/context/qa_plan_github_traceability_<feature_id>.md` (Optional but recommended when GitHub summary exists)
- `projects/feature-plan/<feature-id>/context/qa_plan_atlassian_<feature_id>.md`
- `projects/feature-plan/<feature-id>/context/qa_plan_background_<feature_id>.md` (Optional)
- `projects/feature-plan/<feature-id>/context/qa_plan_defect_analysis_<feature_id>.md` (Optional — from defect analysis sub-agent)

## Workflow

### Step 1: Gather Input Summaries

**Locate existing domain summaries**:
```bash
# Check default location
ls projects/feature-plan/<feature-id>/context/qa_plan_*
```

Ask user which summaries to consolidate if multiple exist, or auto-detect the most recent set based on `<feature_id>`.

### Step 2: Read and Parse All Summaries

Read each available domain summary file:
1. **Figma summary**: UI components, visual tests, E2E workflows
2. **GitHub summary**: User-facing code-change scenarios, risk areas, technical considerations
   - If present, read traceability companion file: `qa_plan_github_traceability_<feature_id>.md` (code refs for Related Code Change only)
3. **Atlassian summary**: Requirements, acceptance criteria, business context
4. **Background summary** (Optional): Additional domain knowledge gathered via web search
5. **Defect Analysis summary** (Optional): Read after Atlassian if `qa_plan_defect_analysis_<feature-id>.md` exists. Extract: Executive Summary, Risk Analysis by Functional Area, Recommended QA Focus Areas, Affected Customers field.

**Extract key data from each**:
- Summary metadata (URLs, dates, priorities)
- Test scenarios and key points
- Risk assessments
- Reference data
- Coverage metrics
- Domain context (to inform comprehensive generation and gap analysis)
- Test Scope from GitHub (`COMP` / `XFUNC`) and `E2E Scenarios to Add` rows

### Step 3: Consolidate Information

**Merge strategy**:

| Section | Consolidation Approach |
|---------|------------------------|
| **Summary** | Combine all sources into one table |
| **Background** | Use Atlassian (requirements) as primary; number subsections. **Defect Analysis:** If `Affected Customers` non-empty → inject `### 📢 Business Context`; if internal-only → inject `### 🩺 Defect Health`. If both apply, include both subheadings. |
| **QA Goals** | Merge all goals, deduplicate; use numbered sub-categories (1. E2E, 2. FUN, … 10. AUTO) with bullet items |
| **Test Key Points** | GENERATE tables here by mapping Atlassian ACs to GitHub Code Changes. **Organize by functional behavior category** (e.g., error recovery scenarios, prompt flows, scope/boundary), **NOT by repo or source**. Each table row MUST integrate ALL relevant code changes across repos inline (e.g., `shared-recover-from-error.ts; **biweb**: RWManipulationBuilder.java; **mojojs**: RootController.js`). Add `#` column for numbered row IDs (e.g., 1.1, 1.2). **Merge all defect-derived content here** (Risk Analysis by Functional Area, Recommended QA Focus Areas, Testing Focus checklists). Do **not** map defect findings to Risk & Mitigation. Columns MUST BE: # | Priority | Test Scope | Related Code Change | Acceptance Criteria | Test Key Points | Expected Results. Mark defect-derived rows with `[Regression]` or `[Defect Fix Verification]` in Related Code Change/AC column. **⚠️ ANTI-PATTERN: Do NOT create separate tables per repo** (e.g., "Server-Side API (from biweb)", "Mojo cmdMgr (from mojojs)"). Instead, merge repo-specific code changes into the functional scenario table where they are tested. |
| **Risk & Mitigation** | Merge risk tables; use numbered sub-sections (1. Technical, 2. Data, 3. UX); keep tables. Do **not** merge defect analysis findings into this section. |
| **Defect Analysis** | Merge all findings (Risk Analysis by Functional Area, Recommended QA Focus Areas, Testing Focus) into `## 🧪 Test Key Points` only. Do **not** map to Risk & Mitigation. See mapping rules below. |
| **Consolidated Reference Data** | Aggregate source docs, stakeholders, test data, dependencies; bullets only (no tables) |
| **Sign-off Checklist** | Checklists per team; use numbered subsections |
| **QA Summary** | Code Changes table only (columns: PR, Files Changed, PR Summary); placed at end of document |

## Test Key Points Quality Rules

Apply these rules before writing any manual Test Key Points row:

1. Rule R1: No internal function/flag/class names in `Test Key Points` or `Expected Results`.
   - WRONG: `Verify cancelRequests callback calls cmdMgr.reset()`
   - RIGHT: `After recovery, Undo is disabled in Edit menu.`
2. Rule R2: Every `Expected Results` sentence must be manually observable in browser UI or browser Network tab.
   - WRONG: `isModelingServiceManipulation=true`
   - RIGHT: `Grid returns to pause mode and Undo is disabled.`
   - FAIL condition: if verification needs breakpoints, console injection, source reading, or runtime state introspection.
3. Rule R3: Every P0/P1 manual row must have executable user actions (numbered steps or Given/When/Then).
4. Rule R4: Distinct user paths are separate rows (for example `OK` path and `Cancel` path).
5. Rule R5: Every P0/P1 manual row includes a `FAILS if:` sentence in `Expected Results`.
6. Rule R6: Unit/API-only checks go under `### AUTO: Automation-Only Tests`, not in manual tables.

### Translation Guide (Code Facts -> User-Facing Outcomes)

Use this guide during synthesis. Extend with inferred mappings when needed.

| Code Pattern | User-Facing Translation |
|--------------|-------------------------|
| `cmdMgr.reset()` called | Undo button is disabled / no undo history |
| `isReCreateReportInstance = true` | Second recovery attempt completes without stuck state |
| `mstrApp.appState = DEFAULT` | Grid shows pause-mode layout (no stale running rows) |
| `recoverReportFromError returns { handled: false }` | AUTO-only (not user-visible) |
| `PUT /model/reports` error | Error shown but grid remains usable (or specific pause-mode transition) |
| `stid=-1` + `noActionMode=true` | Report returns to pause mode and user stays in report view |

### Scope and E2E Routing Rules

- If scenario scope is `XFUNC`, keep in manual tables with user-facing action steps.
- If scope is `COMP` and not user-observable, move to `### AUTO: Automation-Only Tests`.
- Merge `E2E Scenarios to Add` from GitHub summary into the final manual scenarios (do not drop).
- Multi-repo aggregation rule: if one repo is `COMP` and another is `XFUNC` for the same scenario, use dominant scope `XFUNC`.

### Step 3b: Translation Pass (Before Writing Plan)

Before generating any row:
1. Scan GitHub summaries for function names, method names, flags, and class identifiers.
2. Replace candidate internal terms in `Test Key Points` / `Expected Results` using the Translation Guide.
3. If mapping is missing, infer a user-observable behavior and use that phrasing; do not copy internal term into manual columns.
4. Keep code vocabulary only in `Related Code Change` column and traceability context.

### Step 3c: Pre-Save Self-Check (Soft Warning + Self-Healing)

Run this checklist on manual sections before saving draft:
- [ ] No internal code vocabulary in `Test Key Points` / `Expected Results`
- [ ] `Expected Results` browser-observable only
- [ ] P0/P1 rows include numbered steps
- [ ] Multi-path scenarios split into separate rows
- [ ] P0/P1 rows include `FAILS if:`
- [ ] Unit/API-only rows moved to `### AUTO: Automation-Only Tests`

If violations exist:
1. Annotate violations.
2. Auto-fix (translate wording, split rows, add `FAILS if:`, move to AUTO).
3. Re-run checklist up to 2 iterations.
4. If still failing after 2 iterations, emit a soft warning and continue; downstream review gate will block publication.

### Step 4: Generate Comprehensive Plan

**Dynamic versioning**: Determine the latest draft number N by reading `task.json` (`latest_draft_version`) or scanning `drafts/qa_plan_v*.md`. If no drafts exist, N=0. Write the new draft to `projects/feature-plan/<feature_id>/drafts/qa_plan_v<N+1>.md` (e.g., `qa_plan_v1.md` if starting fresh). Update `task.json` with `latest_draft_version: <N+1>`.

```markdown
# Comprehensive QA Plan: [Feature Name]

## 📊 Summary

| Field | Value |
|-------|-------|
| **Feature Link** | [Jira/Confluence URL] |
| **Release Version** | [Version] |
| **QA Owner** | [Name/Team] |
| **SE Design Link** | [Confluence Design Doc] |
| **UX Design Link** | [Figma URL] |
| **GitHub PR Link** | [PR URL] |
| **Date Generated** | [Current Date] |
| **Plan Status** | Draft / In Review / Approved |

## 📝 Background

### 1. Key Problem Statement

[From Atlassian requirements - What problem are we solving?]

### 2. Solution

[High-level solution approach combining design, implementation, and requirements]

### 3. Business Context

- **User Impact**: [Who benefits and how]
- **Technical Scope**: [What systems/components affected]
- **Dependencies**: [What this relies on]

## 🎯 QA Goals

### 1. E2E: End to End

- Verify complete user workflows from entry to completion
- Validate data flow across all system layers
- Test integration between frontend, backend, and external services
- Confirm session management and state persistence

### 2. FUN: Functionality

- Validate all functional requirements from [Jira issue]
- Verify business logic correctness
- Test API endpoints with various inputs
- Confirm database operations (CRUD)
- Validate error handling and edge cases

### 3. UX: User Experience

- Verify UI matches Figma designs with pixel-perfect accuracy
- Test responsive design across devices (mobile, tablet, desktop)
- Validate interactive elements (hover, focus, active states)
- Test loading states and transitions
- Verify error messages are user-friendly
- Confirm accessibility features (keyboard navigation, screen readers)

### 4. PERF: Performance

- Measure page load time (target: < 3s)
- Test API response times (target: < 2s for critical endpoints)
- Validate rendering performance (60fps for animations)
- Load test concurrent users (target: [X] CCU)
- Monitor memory usage and potential leaks

### 5. SEC: Security

- Verify authentication and authorization mechanisms
- Test input validation and sanitization
- Check for XSS, CSRF, SQL injection vulnerabilities
- Validate secure data transmission (HTTPS)
- Test session timeout and invalidation
- Verify sensitive data encryption

### 6. ACC: Accessibility

- Validate WCAG 2.1 Level AA compliance
- Test keyboard-only navigation
- Verify screen reader compatibility
- Check color contrast ratios
- Test focus indicators
- Validate ARIA labels and roles

### 7. CER: Platform Certifications

- [If applicable: Verify compliance with platform standards]
- [E.g., Apple App Store guidelines, Google Play policies]
- [Browser compatibility: Chrome, Firefox, Safari, Edge]

### 8. UPG: Upgrade and Compatibility

- Test database migration scripts (up and down)
- Verify backward compatibility with previous version
- Test rollback procedures
- Validate data migration integrity
- Check API version compatibility

### 9. INT: Internationalization

- Verify all user-facing text is translatable
- Test RTL language support (if applicable)
- Validate date/time formatting for different locales
- Test currency formatting
- Verify timezone handling

### 10. AUTO: Automation

- Create automated unit tests (target: 80%+ coverage)
- Develop integration test suite
- Build E2E test automation for critical paths
- Set up CI/CD pipeline tests
- Configure regression test suite

## 🧪 Test Key Points

> **Organizing principle**: Group by **functional behavior / test scenario category** derived from the design doc (e.g., "Error Recovery — Pause Mode", "Prompt Answer Errors", "Scope & Boundary"). Do NOT group by source (Figma/GitHub/Atlassian) or by repo (react-report-editor/biweb/mojojs). Each row integrates ALL cross-repo code changes relevant to that test point.

### 1. [Functional Scenario Category Name]

| # | Priority | Test Scope | Related Code Change | Acceptance Criteria | Test Key Points | Expected Results |
|---|----------|------------|---------------------|---------------------|-----------------|------------------|
| 1.1 | P0 | XFUNC | `frontend/component.ts` → function(); **backend**: `ApiHandler.java` → method(); **shared-lib**: `util.js` → helper() | Given [precondition], when [action], then [outcome] | 1. [User action] 2. [User action] 3. [User action] | [Observable result covering full stack]. FAILS if: [clear failure signature] |
| 1.2 | P1 | COMP/XFUNC | ... | ... | ... | ... |

### 2. [Another Functional Scenario Category]

| # | Priority | Test Scope | Related Code Change | Acceptance Criteria | Test Key Points | Expected Results |
|---|----------|------------|---------------------|---------------------|-----------------|------------------|
| 2.1 | P0 | XFUNC | ... | ... | ... | ... |

### N. Edge Cases & Negative Tests

| # | Priority | Test Scope | Related Code Change | Acceptance Criteria | Test Key Points | Expected Results |
|---|----------|------------|---------------------|---------------------|-----------------|------------------|
| N.1 | P1 | XFUNC | ... | ... | ... | ... |

### AUTO: Automation-Only Tests

| # | Priority | Test Scope | Test Type | Related Code Change | Automation Focus |
|---|----------|------------|-----------|---------------------|------------------|
| A.1 | P1 | COMP | Unit/API/Integration | `shared/utility.ts` → helper() | [Programmatic verification that is not manually observable] |

> **⚠️ ANTI-PATTERN — Do NOT do this:**
> ```
> ### 5. Error Dialog UI & Behavior (from react-report-editor)   ← BAD: per-repo table
> ### 6. Server-Side API — reCreateInstance (from biweb)          ← BAD: per-repo table
> ### 7. Mojo cmdMgr Reset Guard (from mojojs)                    ← BAD: per-repo table
> ```
> Instead, merge these code changes into the functional scenario tables (e.g., "Error Recovery — Pause Mode") where they are actually tested together.

## ⚠️ Risk & Mitigation

### 1. Technical Risks

| Risk | Impact | Likelihood | Mitigation Strategy | Code/Design Reference |
|------|--------|------------|---------------------|----------------------|
| Password reset emails go to spam | High | Medium | Test with multiple email providers, add SPF/DKIM | `src/services/email.ts`, [Design Doc §4.2] |
| Session fixation vulnerability | Critical | Low | Regenerate session ID on login | `src/middleware/session.ts:34`, [Security Review] |
| Database migration fails in production | Critical | Low | Test on staging, backup before migration, rollback plan | `db/migrations/001_add_users.sql` |
| UI breaks on older browsers | Medium | Medium | Cross-browser testing, polyfills | [Figma: Browser Support] |
| API rate limit bypass | High | Medium | Implement rate limiting with Redis | `src/middleware/rateLimit.ts`, [PROJ-125] |

### 2. Data Risks

| Risk | Impact | Likelihood | Mitigation Strategy | Code/Design Reference |
|------|--------|------------|---------------------|----------------------|
| User enumeration via error messages | Medium | Medium | Use generic error messages | `src/api/auth/login.ts:67`, [Design Doc §5.1] |
| Sensitive data in logs | High | Low | Sanitize logs, audit log configuration | `src/utils/logger.ts` |

### 3. UX Risks

| Risk | Impact | Likelihood | Mitigation Strategy | Design Reference |
|------|--------|------------|---------------------|------------------|
| Confusing error messages | Medium | High | UX review of all error states | [Figma: Error States] |
| Slow page load on mobile | High | Medium | Performance optimization, lazy loading | [Design Doc: Performance] |

## 📎 Consolidated Reference Data

### 1. Source Documents

**Design & Requirements**:
- [Figma Design](figma-url)
- [Confluence Design Doc](confluence-url)
- [API Specification](confluence-url)

**Implementation**:
- [GitHub PR #456](github-pr-url)
- [Commit History](github-commits-url)

**Project Management**:
- [Jira Epic: PROJ-100](jira-url)
- [User Story: PROJ-123](jira-url)
- [Related Issues](jira-filter-url)

### 2. Stakeholders

- **Product Owner**: [Name] — Requirements approval (@username)
- **Tech Lead**: [Name] — Technical design (@username)
- **QA Lead**: [Name] — Test strategy (@username)
- **UX Designer**: [Name] — Design validation (@username)
- **Security**: [Name] — Security review (@username)

### 3. Test Data

**User Accounts** (Test Environment):
- Test User: `testuser@example.com` / `TestPass123!`
- Admin User: `admin@example.com` / `AdminPass123!`
- Locked Account: `locked@example.com` / `LockedPass123!`

**API Endpoints**:
- Base URL: `https://staging.example.com/api`
- Auth: JWT token in `Authorization: Bearer <token>` header

### 4. Dependencies

- **Node.js** 22.x ✅ — Required runtime
- **PostgreSQL** 15.x ✅ — Database
- **Redis** 7.x ✅ — Session store
- **Email Service** Sendgrid v3 ✅ — Email delivery

## 🎯 Sign-off Checklist

### 1. Development Team

- [x] All code reviewed and merged
- [x] Unit tests passing (85% coverage)
- [x] Documentation updated
- [x] No high-severity linter errors

### 2. QA Team

- [ ] All P0 tests executed and passed
- [ ] All P1 tests executed (90%+ passed)
- [ ] No critical bugs open
- [ ] Regression testing completed
- [ ] Performance benchmarks met

### 3. Product Team

- [ ] All acceptance criteria validated
- [ ] UX reviewed and approved
- [ ] Documentation reviewed
- [ ] Release notes drafted

### 4. Security Team

- [ ] Security scan completed
- [ ] No critical vulnerabilities
- [ ] Penetration testing passed (if required)

### 5. Release Readiness

- [ ] Deployment plan reviewed
- [ ] Rollback plan documented
- [ ] Monitoring alerts configured
- [ ] Support team notified

## 📝 Notes

**Generated by**: QA Plan Synthesize Agent  
**Sources**: Figma + GitHub + Atlassian  
**Last Updated**: [Timestamp]  
**Version**: 1.0

**Next Steps**:
- Complete pending automation tests
- Address internationalization gaps
- Schedule accessibility audit
- Final security review
- Obtain stakeholder sign-offs

## 📊 QA Summary

### 1. Code Changes

| PR | Files Changed | PR Summary |
|----|---------------|------------|
| [PR #NNN](url) | `path/to/file1.ts`, `path/to/file2.ts` | Brief description of what the PR changes |
| [PR #NNN](url) | `path/to/file3.ts` | Brief description of what the PR changes |
```

## Output File Handling

**Default Location**: Write to the drafts folder of the feature plan:
```
projects/feature-plan/<feature_id>/drafts/
```

**Naming Convention**:
```
qa_plan_v<N>.md (use latest version per task.json or drafts/ scan)
```

## Consolidation Best Practices

### Avoid Duplication

When merging test scenarios:
- If Figma and GitHub both mention "button click", merge into one test
- Keep the most specific version (e.g., GitHub's technical details + Figma's visual details)

### Maintain Traceability

Always link back to sources:
- Test scenarios → Original file (Figma/GitHub/Atlassian)
- Risk items → Code references or design sections
- Requirements → Jira issue keys

### Prioritize Consistently

Use a unified priority system:
- **P0 (Critical)**: Must work for release, blocks production
- **P1 (High)**: Important for user experience, should be fixed
- **P2 (Medium)**: Nice-to-have, can be deferred
- **P3 (Low)**: Minor issues, future improvement

### Fill Gaps

Identify and address gaps between sources:
- **Code without design**: Flag for UX review
- **Design without code**: Flag as not implemented
- **Requirements without tests**: Create missing test scenarios

### Cross-Reference Risks

Correlate risks across sources:
- **Design risk**: "Button too small" + **Code risk**: "No click handler validation" → **Combined risk**: "User may accidentally trigger actions"

## Integration with Other Skills

This skill outputs data consumed by:
- `qa-plan-review`: Reviews the consolidated plan for completeness
- `qa-plan-refactor`: Updates the plan based on review feedback
- `xmind-generator`: Creates visual representation of the entire plan

**Input from**:
- `qa-plan-figma`: UI and visual testing requirements
- `qa-plan-github`: Code change analysis and technical testing
- `qa-plan-atlassian`: Requirements and acceptance criteria

## Error Handling

**If no partial plans found**:
1. Ask user to run individual QA plan generation skills first
2. Provide guidance on which skill to use for each source

**If plans are inconsistent**:
1. Document the inconsistencies in "Notes" section
2. Flag for clarification
3. Use most recent or most detailed information

**If critical data is missing**:
1. Document as "TODO" or "Pending"
2. List in "Open Questions" section
3. Assign action items for follow-up

## Advanced Features

### Smart Merging

Detect and merge similar test scenarios:
```
Figma: "Test button hover state changes color"
GitHub: "Button.tsx hover changes background to #1557B0"
→ Merged: "Button hover state changes background color to #1557B0 (from Figma design)"
```

### Gap Detection

Identify missing coverage:
- Requirements in Jira without test scenarios
- Code changes without corresponding tests
- Design components without implementation

### Risk Correlation

Link related risks:
```
Design: "Password field not masked"
Code: "Password sent in plain text"
→ Combined Critical Risk: "Password security vulnerability"
```

## Example Usage

**User Request**:
> "Consolidate all QA plans for the login feature"

**Skill Actions**:
1. Find all domain summary files in `projects/feature-plan/<feature-id>/context/`
2. Read `qa_plan_figma_<feature-id>.md`
3. Read `qa_plan_github_<feature-id>.md`
4. Read `qa_plan_atlassian_<feature-id>.md`
5. Extract and merge all test scenarios, building the Test Key Points tables with mapping.
6. Consolidate risks and mitigations
7. Create summary tables with aggregate data
8. Generate `drafts/qa_plan_v<N+1>.md` (determine N from task.json or drafts/ scan)
9. Present summary to user

## Notes

- This is the **final QA plan** document for stakeholder review
- Ensure all sections align with the format in `@.cursor/commands/qa-plan-architect.md`
- The plan should be ready for review by `qa-plan-review` skill
- Include enough detail for engineers to understand test scope
- Keep language professional and user-facing
