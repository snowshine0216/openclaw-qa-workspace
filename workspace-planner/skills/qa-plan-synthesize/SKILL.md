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
2. **GitHub summary**: Code changes, risk areas, technical considerations
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

### Step 3: Consolidate Information

**Merge strategy**:

| Section | Consolidation Approach |
|---------|------------------------|
| **Summary** | Combine all sources into one table |
| **Background** | Use Atlassian (requirements) as primary; number subsections. **Defect Analysis:** If `Affected Customers` non-empty → inject `### 📢 Business Context`; if internal-only → inject `### 🩺 Defect Health`. If both apply, include both subheadings. |
| **QA Goals** | Merge all goals, deduplicate; use numbered sub-categories (1. E2E, 2. FUN, … 10. AUTO) with bullet items |
| **Test Key Points** | GENERATE tables here by mapping Atlassian ACs to GitHub Code Changes. **Merge all defect-derived content here** (Risk Analysis by Functional Area, Recommended QA Focus Areas, Testing Focus checklists). Do **not** map defect findings to Risk & Mitigation. Columns MUST BE: Priority | Related Code Change | Test Key Points | Expected Results. Mark defect-derived rows with `[Regression]` or `[Defect Fix Verification]` in Related Code Change/AC column. |
| **Risk & Mitigation** | Merge risk tables; use numbered sub-sections (1. Technical, 2. Data, 3. UX); keep tables. Do **not** merge defect analysis findings into this section. |
| **Defect Analysis** | Merge all findings (Risk Analysis by Functional Area, Recommended QA Focus Areas, Testing Focus) into `## 🧪 Test Key Points` only. Do **not** map to Risk & Mitigation. See mapping rules below. |
| **Consolidated Reference Data** | Aggregate source docs, stakeholders, test data, dependencies; bullets only (no tables) |
| **Sign-off Checklist** | Checklists per team; use numbered subsections |
| **QA Summary** | Code Changes table only (columns: PR, Files Changed, PR Summary); placed at end of document |

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

### 1. UI Testing (from Figma)

#### Visual Components

| Priority | Related Code Change | Test Key Points | Expected Results |
|----------|---------------------|-----------------|------------------|
| P0 | `src/components/LoginForm.tsx` | Login form renders with correct styling | Form matches Figma design: email field, password field, submit button with primary color |
| P0 | `src/components/Button.tsx` | Button hover state | Background changes to hover color (#1A73E8 → #1557B0) |
| P0 | `src/components/Input.tsx` | Input validation error state | Red border (#D93025), error message appears below field |
| P1 | `src/layouts/AppLayout.tsx` | Responsive layout at 768px breakpoint | Layout switches to mobile view, navigation collapses |

#### Interactive Elements

| Priority | Related Code Change | Test Key Points | Expected Results |
|----------|---------------------|-----------------|------------------|
| P0 | `src/components/Form.tsx` | Form submission flow | On submit, loading state → success message → redirect |
| P0 | `src/components/Modal.tsx` | Modal open/close | Modal opens on trigger, closes on X click or overlay click |
| P1 | `src/components/Dropdown.tsx` | Dropdown selection | Options display, selection highlights, value updates |

### 2. Backend Testing (from GitHub)

#### API Endpoints

| Priority | Related Code Change | Test Key Points | Expected Results |
|----------|---------------------|-----------------|------------------|
| P0 | `src/api/auth/login.ts` | POST /api/auth/login with valid credentials | 200 OK, JWT token returned, user object in response |
| P0 | `src/api/auth/login.ts` | POST /api/auth/login with invalid credentials | 401 Unauthorized, error message: "Invalid credentials" |
| P0 | `src/api/users/create.ts` | POST /api/users with valid data | 201 Created, user ID returned |
| P1 | `src/api/users/create.ts` | POST /api/users with duplicate email | 409 Conflict, error message: "Email already exists" |

#### Database Operations

| Priority | Related Code Change | Test Key Points | Expected Results |
|----------|---------------------|-----------------|------------------|
| P0 | `db/migrations/001_add_users.sql` | Migration up executes | Users table created with correct schema |
| P0 | `src/models/User.ts` | User.create() with valid data | Record inserted, ID generated, timestamps set |
| P1 | `src/models/User.ts` | User.findByEmail() | Returns user if exists, null if not |

#### Business Logic

| Priority | Related Code Change | Test Key Points | Expected Results |
|----------|---------------------|-----------------|------------------|
| P0 | `src/services/auth.ts:validatePassword()` | Password validation with valid password | Returns true |
| P0 | `src/services/auth.ts:validatePassword()` | Password validation with incorrect password | Returns false |
| P0 | `src/services/email.ts:sendPasswordReset()` | Send password reset email | Email sent with reset link, link expires in 24h |

### 3. E2E Workflow Testing (from Figma + GitHub)

#### User Registration & Login Flow

| Priority | Related Code Change | Test Key Points | Expected Results |
|----------|---------------------|-----------------|------------------|
| P0 | Full flow: UI + API + DB | User visits signup, fills form, submits | Account created, confirmation email sent, redirect to login |
| P0 | Full flow: UI + API + DB | User logs in with new credentials | Session created, redirect to dashboard, user data displayed |
| P0 | Full flow: UI + API + DB | User logs out | Session destroyed, redirect to login page |

#### Password Reset Flow

| Priority | Related Code Change | Test Key Points | Expected Results |
|----------|---------------------|-----------------|------------------|
| P0 | Full flow: UI + Email + API | User requests password reset | Reset email sent with valid link |
| P0 | Full flow: Email + UI + API | User clicks reset link | Redirected to reset form, token validated |
| P0 | Full flow: UI + API + DB | User submits new password | Password updated, auto-login, redirect to dashboard |

### 4. Functional Requirements Testing (from Atlassian)

#### Acceptance Criteria from [JIRA-123]

| Priority | Related Code Change | Acceptance Criteria | Test Key Points | Expected Results |
|----------|---------------------|---------------------|-----------------|------------------|
| P0 | `src/api/auth/login.ts` | Given valid credentials, when user logs in, then redirect to dashboard | Login flow with test user | User redirected to `/dashboard`, session active |
| P0 | `src/api/auth/login.ts` | Given invalid credentials, when user logs in, then show error | Login with wrong password | Error message displayed, no redirect |
| P1 | `src/middleware/auth.ts` | Given user is logged in, when accessing login page, then redirect to dashboard | Navigate to `/login` while logged in | Auto-redirect to `/dashboard` |

### 5. Performance Testing

| Priority | Test Key Points | Expected Results | Measurement Method |
|----------|-----------------|------------------|-------------------|
| P0 | Login API response time | < 2 seconds (p95) | Load test with 100 concurrent users |
| P1 | Page load time (dashboard) | < 3 seconds (p95) | Lighthouse CI |
| P1 | Database query time (user lookup) | < 100ms (p95) | APM monitoring |

### 6. Security Testing

| Priority | Test Key Points | Expected Results | Reference |
|----------|-----------------|------------------|-----------|
| P0 | Password stored securely | Bcrypt hashing, salted | Code: `src/services/auth.ts:42` |
| P0 | SQL injection prevention | Parameterized queries used | Code: `src/models/User.ts` |
| P0 | XSS prevention | Input sanitized, output escaped | Code: `src/utils/sanitize.ts` |
| P1 | CSRF protection | CSRF token validated | Code: `src/middleware/csrf.ts` |

### 7. Accessibility Testing

| Priority | Test Key Points | Expected Results | WCAG Criterion |
|----------|-----------------|------------------|----------------|
| P0 | Keyboard navigation | All interactive elements accessible via Tab | 2.1.1 Keyboard |
| P0 | Screen reader labels | All form fields have labels | 4.1.2 Name, Role, Value |
| P1 | Color contrast | Text contrast ratio ≥ 4.5:1 | 1.4.3 Contrast |

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
