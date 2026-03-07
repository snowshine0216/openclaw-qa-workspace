---
name: qa-plan-atlassian
description: Generate QA domain summaries by analyzing Atlassian Confluence design documents and Jira issues to understand requirements and background. Sub-agent compatible — can be spawned by orchestrator for parallel context gathering. Always fetches linked Jira issues plus testing-relevant issue references surfaced in Jira comments; fails closed when required Jira issue content is missing.
---

# QA Plan Domain Summary Generator from Atlassian (Confluence & Jira)

Generate comprehensive QA domain summaries by analyzing Confluence design documents and Jira issues to understand requirements, acceptance criteria, and project context.

## When to Use

### Direct Invocation
- User provides Confluence page URL or Jira issue key
- User asks to "extract requirements for QA plan"
- User mentions "analyze design doc for testing" or "Jira ticket QA"

### Sub-Agent Spawning (NEW)
- Orchestrator spawns this skill as a sub-agent in Phase 1
- Receives context via `sessions_spawn` attachment:
  ```json
  {
    "feature_id": "BCIN-6709",
    "jira_key": "BCIN-6709",
    "confluence_url": "https://...",
    "search_enabled": false  // conditional search flag from orchestrator
  }
  ```

## Sub-Agent Contract (NEW)

**Input** (from orchestrator via attachment `context.json`):
```json
{
  "feature_id": "BCIN-6709",
  "jira_key": "BCIN-6709",
  "confluence_url": "https://microstrategy.atlassian.net/wiki/...",
  "search_enabled": false  // true if Jira has linked/child issues
}
```

**Output** (to standard location):
```
projects/feature-plan/<feature_id>/context/qa_plan_atlassian_<feature_id>.md
```

**Completion Signal**:
- Write output file
- Return success message with file path
- Orchestrator detects completion via `subagents(action=list)` status check

## Prerequisites

**Required shared skills for live fetches**:
- `~/.openclaw/skills/jira-cli` for Jira issue reads
- `~/.openclaw/skills/confluence` for Confluence page reads/searches when needed

Sub-agents handling Atlassian fetches MUST read those canonical shared skill files first and use their documented wrapper/entrypoint commands instead of bare local CLI.
If a workspace-level mirror exists, keep it synced with the shared source, but do not treat the workspace copy as the source of truth.

**Auth precheck is mandatory**:
- verify the Jira wrapper path can access the target issue before full fetch
- verify the Confluence wrapper/path can access the target page before broader search/fetch
- if either precheck fails, STOP and report the blocker
- when using workspace `.env`, check both `JIRA_BASE_URL` and `JIRA_SERVER` as possible Jira server/base-url keys before concluding config is missing

## Available Atlassian MCP Tools

**Confluence Tools**:
- `confluence_get_page` - Read page content by ID or title
- `confluence_search` - Search pages by keyword
- `confluence_get_page_children` - Get child pages

**Jira Tools**:
- `jira_get_issue` - Read issue details by key
- `jira_search` - Search issues by JQL
- `jira_get_project_issues` - Get all project issues

## Workflow

### Step 0: Jira Fetch Rules (Mandatory)

When a Jira ticket is provided, ALWAYS fetch:
- the main Jira issue
- all related issues discovered from the Jira skill query path for the feature
- any Jira issue references surfaced in Jira comments when they materially affect testing

Do NOT require subtasks for this workflow.

Do not rely only on `issuelinks` from a single issue view. Use the Jira skill's broader related-issue query example to discover the effective issue set for testing.

If any required Jira issue content cannot be fetched, or if a required issue is missing a usable summary/description, STOP and return a blocker to the orchestrator so the user can decide whether to continue.

### Step 0b: Conditional Search Decision

**When spawned as sub-agent**, check `search_enabled` flag from context:

```javascript
const context = JSON.parse(attachment_content); // from sessions_spawn
const { feature_id, jira_key, confluence_url, search_enabled } = context;

if (search_enabled) {
  // Jira has linked/child issues → search Confluence for related pages
  console.log("Linked issues detected — enabling Confluence search");
} else {
  // No linked issues → use only provided design doc URL
  console.log("No linked issues — skipping Confluence search");
}
```

**Search Decision Logic** (performed by orchestrator before spawning):
```javascript
// Orchestrator Phase 0:
const issue = await jira.getIssue(jira_key);
const hasLinkedIssues = issue.fields.issuelinks?.length > 0;
const search_enabled = hasLinkedIssues;
```

### Step 1: Extract Atlassian References

**From Confluence URL**: Extract page ID:
```
https://example.atlassian.net/wiki/spaces/TEAM/pages/123456789/Page+Title
→ page_id: 123456789, space_key: TEAM
```

**From Jira Issue URL**: Extract issue key:
```
https://example.atlassian.net/browse/PROJ-123
→ issue_key: PROJ-123
```

### Step 2: Read Design Document from Confluence

Preferred live-fetch path:
1. Read and follow the shared `confluence` skill
2. Use the skill-defined read/search workflow first
3. Run access precheck against the target page before broader searches

If the Confluence skill provides multiple read paths, prefer the canonical one documented there. Do not skip the skill and jump straight to ad-hoc local commands.

**Alternative**: Search by title if page ID unknown:
```
Tool: CallMcpTool
Server: user-mcp-atlassian
Tool Name: confluence_search
Arguments:
{
  "query": "User Authentication Design",
  "space_key": "TEAM",
  "limit": 5
}
```

### Step 3: Read Jira Issue Details

Preferred live-fetch path:
1. Read and follow the shared `jira-cli` skill
2. Use its wrapper/entrypoint path first, not bare `jira issue view`
3. Run auth precheck before bulk fetching

Example wrapper path from the shared skill (run from the workspace that owns the `.env`, such as `workspace-planner/`):
```bash
cd /path/to/workspace-planner
source ~/.openclaw/skills/jira-cli/scripts/lib/jira-env.sh
load_jira_env
jira issue view PROJ-123 --plain
```

Only if the skill-defined primary path is unavailable should you use an approved secondary path documented by that skill. Do not invent a raw fallback first.

**Extract from Jira**:
- Issue summary and description
- Acceptance criteria
- Related issues discovered from the Jira query path
- Comments (design clarifications)
- Issue references mentioned in comments when they materially affect testing
- Web links, including any Figma links
- Attachments (mockups, specs)
- Custom fields (story points, sprint, etc.)

Persist raw evidence into `context/` in addition to the summary:
- `jira_issue_<issue-key>.md` for the main issue
- `jira_issue_<issue-key>.md` for each required related/comment-discovered issue
- `jira_related_issues_<feature-id>.md` for the discovered issue-set listing
- `figma_link_<feature-id>.md` when a Figma URL is found in Jira or Confluence web links

Required gate before summary generation:
- every required issue must have usable summary + description evidence on disk
- if Jira or Confluence contains a Figma link, persist it explicitly for downstream Figma analysis
- otherwise stop and surface the blocker

### Step 4: Analyze Requirements

**From Confluence Design Doc**:
- Functional requirements
- Non-functional requirements (performance, security)
- Business rules
- User stories
- Technical architecture
- API specifications
- Database schema

**From Jira Issue**:
- User story format: "As a [user], I want [goal], so that [benefit]"
- Acceptance criteria (Given/When/Then format)
- Definition of Done
- Edge cases mentioned in comments
- Dependencies on other issues

### Step 5: Map Requirements to Test Cases

**For each requirement**:
1. **Identify testable conditions**
2. **Define positive test scenarios** (happy path)
3. **Define negative test scenarios** (error cases)
4. **Identify edge cases**
5. **Determine test data needs**
6. **Broader Focus for Non-Backend Features**: Do not be limited strictly to Jira Acceptance Criteria mechanically. If the feature touches the frontend or user interactions, deduce End-to-End and UX flows, and explicitly output test cases from a user-facing, behavioral perspective.

**Example Mapping**:
```
Requirement: User can reset password via email
→ Positive Tests:
  - Valid email receives reset link
  - Reset link works within 24 hours
→ Negative Tests:
  - Invalid email shows error
  - Expired link shows error message
  - Used link cannot be reused
→ Edge Cases:
  - Multiple reset requests
  - Email doesn't exist in system
  - Reset during active session
```

### Step 6: Generate QA Domain Summary

Create a markdown file containing free-form findings: `projects/feature-plan/<feature_id>/context/qa_plan_atlassian_<feature_id>.md`

*Note: You do NOT need to follow the strict 9-section template layout. Output the extracted requirements, testing scenarios, and data freely so it can be merged by `qa-plan-synthesize` later.*

```markdown
# Atlassian Domain Summary: [Feature Name]

## 📊 Summary

| Field | Value |
|-------|-------|
| **Jira Issue** | [PROJ-123](jira-url) |
| **Confluence Page** | [Design Doc](confluence-url) |
| **Date Generated** | [Current Date] |
| **Feature Type** | [New Feature / Bug Fix / Enhancement] |
| **Priority** | [P0 / P1 / P2] |
| **Target Release** | [Version] |

## 📋 Background

### Problem Statement

[Describe the problem this feature solves]

### Solution Overview

[High-level description of the solution approach]

### Business Impact

- **User Benefit**: [How users benefit]
- **Business Value**: [Revenue, efficiency, compliance, etc.]
- **Success Metrics**: [How success is measured]

## 🎯 Requirements Summary

### Functional Requirements

| ID | Requirement | Priority | Source |
|----|-------------|----------|--------|
| FR-1 | User can log in with email and password | P0 | [PROJ-123] |
| FR-2 | System validates email format | P0 | [Design Doc] |
| FR-3 | Failed login shows error message | P0 | [PROJ-123] |

### Non-Functional Requirements

| ID | Requirement | Target | Source |
|----|-------------|--------|--------|
| NFR-1 | Login response time < 2s | < 2000ms | [Design Doc] |
| NFR-2 | Support 1000 concurrent users | 1000 CCU | [Design Doc] |
| NFR-3 | 99.9% uptime | 99.9% | [SLA] |

### Acceptance Criteria

**From Jira Issue [PROJ-123]**:

- [ ] Given valid credentials, when user logs in, then user is redirected to dashboard
- [ ] Given invalid credentials, when user logs in, then error message is displayed
- [ ] Given user is already logged in, when accessing login page, then redirect to dashboard
- [ ] Given password reset requested, when user clicks email link, then password reset form appears

## 🧪 Test Scenarios

### Feature: User Authentication

#### Positive Scenarios (Happy Path)

| Test ID | Scenario | Given | When | Then | Priority |
|---------|----------|-------|------|------|----------|
| AUTH-001 | Successful login | User has valid credentials | User enters email and password and clicks "Login" | User is redirected to dashboard, session created | P0 |
| AUTH-002 | Logout | User is logged in | User clicks "Logout" | User is logged out, redirected to login page | P0 |

#### Negative Scenarios (Error Cases)

| Test ID | Scenario | Given | When | Then | Priority |
|---------|----------|-------|------|------|----------|
| AUTH-003 | Invalid email | User enters invalid email format | User submits form | Error message: "Invalid email format" | P0 |
| AUTH-004 | Wrong password | User enters wrong password | User submits form | Error message: "Invalid credentials" | P0 |
| AUTH-005 | Account locked | User account is locked | User tries to login | Error message: "Account locked" | P1 |

#### Edge Cases

| Test ID | Scenario | Given | When | Then | Priority |
|---------|----------|-------|------|------|----------|
| AUTH-006 | Concurrent logins | User logged in on device A | User logs in on device B | Session on device A terminated or both active (per spec) | P1 |
| AUTH-007 | Session timeout | User inactive for 30 minutes | User tries to perform action | Redirect to login with message | P1 |
| AUTH-008 | Special characters in password | Password contains special chars | User logs in | Login succeeds if correct | P2 |

### Feature: Password Reset

#### Positive Scenarios

| Test ID | Scenario | Given | When | Then | Priority |
|---------|----------|-------|------|------|----------|
| RESET-001 | Request reset | User has registered email | User enters email and clicks "Reset" | Reset email sent | P0 |
| RESET-002 | Use reset link | User received reset email | User clicks link | Password reset form appears | P0 |

#### Negative Scenarios

| Test ID | Scenario | Given | When | Then | Priority |
|---------|----------|-------|------|------|----------|
| RESET-003 | Expired link | Reset link is >24 hours old | User clicks link | Error: "Link expired" | P1 |
| RESET-004 | Reused link | Link already used | User clicks link again | Error: "Link invalid" | P1 |

## 🔍 Integration Points

| Integration | Description | Test Requirement |
|-------------|-------------|------------------|
| Email Service | Send password reset emails | Verify email delivery, content, timing |
| Database | Store user credentials securely | Verify hashing, salting, storage |
| Session Management | Maintain user sessions | Test session creation, expiration, invalidation |
| Audit Log | Log authentication events | Verify all login attempts logged |

## ⚠️ Risk Assessment

### Technical Risks

| Risk | Impact | Likelihood | Mitigation | Reference |
|------|--------|------------|------------|-----------|
| Password reset emails go to spam | High | Medium | Test with multiple email providers | [Design Doc §4.2] |
| Session fixation attack | Critical | Low | Regenerate session ID on login | [Security Review] |
| Brute force attacks | High | High | Implement rate limiting | [PROJ-125] |

### Data Risks

| Risk | Impact | Likelihood | Mitigation | Reference |
|------|--------|------------|------------|-----------|
| Plain text password storage | Critical | Low | Code review, security scan | [Security Standards] |
| User enumeration via error messages | Medium | Medium | Generic error messages | [Design Doc §5.1] |

## 📊 Test Coverage Matrix

### By Requirement

| Requirement | Test IDs | Coverage |
|-------------|----------|----------|
| FR-1: Login | AUTH-001 to AUTH-008 | 100% |
| FR-2: Email validation | AUTH-003 | 100% |
| FR-3: Error messages | AUTH-004, AUTH-005 | 100% |

### By Component

| Component | Test Type | Test IDs | Priority |
|-----------|-----------|----------|----------|
| Login Form | Unit | UNIT-001 to UNIT-005 | P0 |
| Auth Service | Integration | INT-001 to INT-003 | P0 |
| Email Service | Integration | INT-004 to INT-006 | P1 |
| User Flow | E2E | E2E-001 to E2E-003 | P0 |

## 📋 Test Data Requirements

### User Accounts

| Account Type | Email | Password | Role | Purpose |
|--------------|-------|----------|------|---------|
| Valid user | test@example.com | ValidPass123! | User | Happy path testing |
| Admin user | admin@example.com | AdminPass123! | Admin | Admin functionality |
| Locked account | locked@example.com | LockedPass123! | User | Locked account testing |
| Inactive account | inactive@example.com | InactivePass123! | User | Inactive account testing |

### Test Inputs

| Input Field | Valid Values | Invalid Values | Edge Cases |
|-------------|--------------|----------------|------------|
| Email | user@example.com | invalid-email, @example.com | email+tag@example.com |
| Password | Pass123! | 123, short | 255 char password |

## 📎 Reference Data

### Source Documents

**Confluence Pages**:
- [User Authentication Design](confluence-url) - Main design doc
- [API Specification](confluence-url) - API endpoints
- [Security Requirements](confluence-url) - Security standards

**Jira Issues**:
- [PROJ-123](jira-url) - Main user story
- [PROJ-124](jira-url) - Related: Password reset
- [PROJ-125](jira-url) - Dependency: Rate limiting

### Related Issues

| Issue Key | Type | Status | Relationship |
|-----------|------|--------|--------------|
| PROJ-124 | Story | In Progress | Related |
| PROJ-125 | Task | Done | Blocks |
| PROJ-126 | Bug | Open | Related |

### Design Artifacts

- Architecture Diagram: [Link or attachment]
- Database Schema: [Link or attachment]
- API Spec: [Link or attachment]
- Mockups: [Link or attachment]

### Stakeholders

| Role | Name | Responsibility |
|------|------|----------------|
| Product Owner | [Name] | Requirements approval |
| Tech Lead | [Name] | Technical design |
| QA Lead | [Name] | Test strategy |
| Security | [Name] | Security review |

## 🎯 Definition of Done

### Development Done

- [ ] All acceptance criteria met
- [ ] Unit tests written and passing
- [ ] Code review completed
- [ ] Documentation updated

### QA Done

- [ ] All P0 test cases executed
- [ ] All P1 test cases executed (if time permits)
- [ ] No critical or high severity bugs open
- [ ] Regression testing completed
- [ ] Performance testing passed (if applicable)

### Release Ready

- [ ] Sign-off from Product Owner
- [ ] Sign-off from QA Lead
- [ ] Deployment plan reviewed
- [ ] Rollback plan documented

## 🔄 Dependencies

### Upstream Dependencies

| Dependency | Status | Impact | Contact |
|------------|--------|--------|---------|
| Rate limiting service | In Dev | Blocks testing of rate limits | [Team] |
| Email service upgrade | Done | Required for testing emails | [Team] |

### Downstream Impact

| Affected Feature | Impact | Action Required |
|------------------|--------|-----------------|
| User profile | Session changes may affect profile | Regression test profile |
| Admin dashboard | Auth changes may affect admin access | Test admin workflows |

## 📈 Test Execution Plan

### Phase 1: Unit Testing (Dev Environment)

- Timeline: Week 1
- Owner: Development Team
- Focus: Individual functions and components

### Phase 2: Integration Testing (Test Environment)

- Timeline: Week 2
- Owner: QA Team
- Focus: Service interactions and data flow

### Phase 3: E2E Testing (Staging Environment)

- Timeline: Week 3
- Owner: QA Team
- Focus: User workflows and acceptance criteria

### Phase 4: UAT (Staging Environment)

- Timeline: Week 4
- Owner: Product Team + QA
- Focus: Business requirements validation

## 💡 Notes & Clarifications

### Open Questions

1. What happens if user changes email during password reset?
2. Should we allow social login (Google, GitHub)?
3. What is the password complexity requirement?

**Action**: Follow up on Jira issue or Confluence page comments.

### Assumptions

1. Email service is reliable and available
2. Database has appropriate indexes on email field
3. HTTPS is enforced for all auth endpoints

### Out of Scope

- Social login integration (deferred to [PROJ-200])
- Multi-factor authentication (deferred to [PROJ-201])
- Password strength meter (nice-to-have)
```

## Output File Handling

**Default Location**: Write the domain summary to the feature context folder:
```
projects/feature-plan/<feature_id>/context/
```

**Naming Convention**:
```
qa_plan_atlassian_<feature_id>.md
```

## Advanced Analysis Techniques

### Extract Acceptance Criteria

Look for common formats in Jira:
- **Given/When/Then** (BDD format)
- Bulleted lists starting with "User can..."
- Checklist items in description or comments

### Identify Implicit Requirements

Read between the lines:
- Performance expectations (if "real-time" mentioned)
- Security needs (if handling PII)
- Scalability (if "many users" mentioned)

### Find Related Context

Use `confluence_search` to find:
- Related design documents
- Architecture decisions
- Previous similar features
- Security guidelines

Use `jira_search` to find:
- Linked issues
- Similar past issues
- Known bugs in the area

### Process Large Documents

If Confluence page is very large:
1. Save full content to temp file
2. Extract key sections (Requirements, Acceptance Criteria, Technical Design)
3. Process each section separately
4. Consolidate findings

## Integration with Other Skills

This skill outputs data consumed by:
- `qa-plan-synthesize`: Merges with Figma and GitHub analysis
- `qa-plan-review`: Reviews requirements coverage completeness
- `xmind-generator`: Visualizes requirement dependencies in mind map

## Error Handling

**If Confluence page not found**:
1. Verify page ID or title
2. Check space key is correct
3. Verify user has access permissions
4. Try searching for the page by keyword

**If Jira issue not found**:
1. Verify issue key format (PROJ-123)
2. Check if issue exists and is accessible
3. Verify user has project access

**If MCP server is unavailable**:
1. Ask user to provide Confluence content manually
2. Ask user to copy Jira issue details
3. Process provided text content

**If content is too large**:
1. Process in chunks
2. Save to temp file for context management
3. Focus on most relevant sections first

## Best Practices

### Focus on Testable Requirements

Convert vague requirements into testable conditions:
- Vague: "System should be fast"
- Testable: "Login response time < 2 seconds"

### Think Like a Product Owner

Consider:
- What is the user trying to achieve?
- What could go wrong from user's perspective?
- What are the business rules?
- What are regulatory/compliance needs?

### Map to Test Pyramid

For each requirement, determine:
- **Unit tests**: Individual function behavior
- **Integration tests**: Component interactions
- **E2E tests**: Complete user workflows

### Document Ambiguities

If requirements are unclear:
1. Document the ambiguity
2. List possible interpretations
3. Flag for clarification
4. Propose default assumption for testing

## Example Usage

**User Request**:
> "Create QA plan from this Jira ticket: PROJ-456 and the design doc in Confluence"

**Skill Actions**:
1. Read Jira issue PROJ-456 via Atlassian MCP
2. Extract Confluence link from issue or ask user
3. Read Confluence page via Atlassian MCP
4. Extract requirements, acceptance criteria
5. Map to test scenarios
6. Identify dependencies and risks
7. Generate `projects/feature-plan/user-auth/context/qa_plan_atlassian_user-auth.md`
8. Save reference data for synthesize agent

## Notes

- Always extract acceptance criteria verbatim from Jira
- Link each test scenario back to specific requirement
- Preserve Jira issue keys for traceability
- Include all stakeholder information for collaboration
- Flag any security-sensitive requirements
