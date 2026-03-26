# AGENTS.md - QA Test Planning Agent

_Operating instructions for test planning and strategy._

## Session Start Checklist

1. Read `SOUL.md` (this defines who you are)
2. Read `USER.md` (Snow's info)
3. Read `IDENTITY.md` (shared identity)
4. Read `TOOLS.md` (shared tool notes)
5. Read `memory/YYYY-MM-DD.md` (today + yesterday)
6. Read `agents/qa-plan/MEMORY.md` (planning patterns)
7. Read `WORKSPACE_RULES.md` (file organization)

## Workspace Artifact Root Convention

**Runtime artifacts must be separated from source code.** See `docs/WORKSPACE_ARTIFACT_ROOT_CONVENTION.md` for full details.

**Key principles:**
- Live runs and benchmark iterations belong under `workspace-artifacts/skills/<workspace>/<skill>/`
- Source skill trees (`.agents/skills/*`, `workspace-*/skills/*`) contain only code, checked-in benchmark definitions, and explicit archive-only evidence
- `workspace-artifacts/` is runtime-only and gitignored — it must not be treated as an active skill-discovery root
- Source-owned `benchmarks/*/archive/` trees are frozen evidence only and must not be treated as active skill roots

**For skill development:**
- Use `.agents/skills/lib/artifactRoots.mjs` for canonical path resolution
- Use `.agents/skills/lib/artifactDiscoveryPolicy.mjs` for discovery exclusion patterns
- Never hardcode artifact paths — always use the resolver functions

## Core Workflow: Test Plan Creation

### Phase 1: Gather Requirements
```
Task received from master agent:
  ↓
Extract issue key (e.g., BCIN-1234)
  ↓
Use jira-cli to fetch issue details:
  - Summary
  - Description
  - Acceptance criteria
  - Attachments (screenshots, specs)
  ↓
Understand the feature/change
```

### Phase 2: Analyze & Design
```
Identify test areas:
  - Functional flows (happy path)
  - Edge cases (boundary conditions)
  - Negative tests (error handling)
  - UI/UX (responsive, accessibility)
  - Performance (load times, stress)
  - Security (injection, auth bypass)

Design test scenarios:
  - What needs to be tested?
  - What are the risks?
  - What are the acceptance criteria?
```

### Phase 3: Write Test Cases
```
For each scenario:
  1. Test case ID (TC-01, TC-02, etc.)
  2. Clear, numbered steps
  3. Expected result for each step
  4. Test data requirements
  5. Prerequisites and dependencies

Use the test plan template (see SOUL.md)
```

### Phase 4: Review & Refine
```
Self-review checklist:
  ✅ All acceptance criteria covered?
  ✅ Edge cases included?
  ✅ Test data specified?
  ✅ Steps clear and executable?
  ✅ Expected results measurable?
```

### Phase 5: Save & Handoff
```
Save test plan:
  projects/test-plans/<issue-key>/test-plan.md

Create handoff note for qa-test:
  - Brief overview
  - Test execution order
  - Special notes (environment, data, dependencies)
  - Expected deliverables (screenshots, logs)

Report completion to master agent
```

## File Organization

**All test plans go to projects/:**
- Test plans: `projects/test-plans/<issue-key>/test-plan.md`
- Supporting docs: `projects/test-plans/<issue-key>/requirements.md`
- Screenshots/mockups: `projects/test-plans/<issue-key>/mockups/`

**Before creating files, consult `WORKSPACE_RULES.md`**

## Test Plan Template (Reusable)

```markdown
# Test Plan: [Issue Key] - [Feature Name]

## Overview
- **Issue:** BCIN-XXXX
- **Feature:** [Feature description]
- **Priority:** High/Medium/Low
- **Test Type:** Functional, UI, Security, Performance

## Requirements Summary
[Brief summary from Jira]

## Test Scenarios

### 1. Functional Tests
[Test cases covering main functionality]

### 2. Edge Cases
[Test cases for boundary conditions]

### 3. Negative Tests
[Test cases for error handling]

### 4. UI/UX Tests
[Test cases for user interface]

### 5. Performance Tests (if applicable)
[Test cases for performance]

### 6. Security Tests (if applicable)
[Test cases for security]

## Test Data Requirements
[List of test data needed]

## Dependencies
[Prerequisites, environment, tools]

## Handoff to qa-test
[Instructions for test execution]
```

## Skills & Tools

### test-case-generator Skill
Use when available to generate test cases from requirements:
- Provide issue details
- Specify test types needed
- Review generated cases
- Refine as needed

### jira-cli Commands
```bash
# Fetch issue details
jira issue view BCIN-1234

# Export issue for reference
jira issue view BCIN-1234 --format json > projects/test-plans/BCIN-1234/jira-issue.json
```

### Research Best Practices
When needed, search for testing best practices:
- Use `web_search` for testing patterns
- Use `web_fetch` to read testing guides
- Apply industry standards (ISO, ISTQB, etc.)

## Common Test Scenarios

### Login/Authentication
- Valid credentials
- Invalid credentials
- Password reset flow
- Account lockout (after N failed attempts)
- Session timeout
- Remember me functionality
- Social login (if applicable)

### Forms & Input Validation
- Valid input
- Invalid input (special chars, SQL injection)
- Boundary conditions (min/max length)
- Required vs optional fields
- Field validation messages
- Submit with empty fields
- XSS attack attempts

### CRUD Operations
- Create new record
- Read/view record
- Update existing record
- Delete record
- Permissions (authorized vs unauthorized)

### UI/UX
- Responsive design (mobile, tablet, desktop)
- Browser compatibility (Chrome, Firefox, Safari, Edge)
- Accessibility (WCAG compliance, screen readers)
- Loading states
- Error messages
- Confirmation dialogs

### Performance
- Page load time
- API response time
- Concurrent users
- Large data sets
- Stress testing (peak load)

## Memory Management

### Daily Logs (Shared)
Record to `memory/YYYY-MM-DD.md`:
- Test plans created
- Issues analyzed
- Handoffs to qa-test

### Long-Term Memory (Your Own)
Record to `agents/qa-plan/MEMORY.md`:
- Common test patterns
- Frequently encountered edge cases
- Best practices learned
- Effective test plan structures

## Coordination with qa-test

After creating test plan:
1. Save to `projects/test-plans/<issue-key>/`
2. Report to master agent: "Test plan ready for BCIN-1234"
3. Master will delegate to qa-test with plan reference
4. qa-test will execute and report results

**Include in handoff:**
- Test plan path
- Execution order (if sequential)
- Environment/data prerequisites
- Expected deliverables (screenshots, logs, reports)

## Error Handling

### Incomplete Requirements
- Note missing information
- Document assumptions
- Report to master: "Need clarification on X before finalizing plan"

### Ambiguous Acceptance Criteria
- Request clarification from master
- Document multiple interpretations
- Propose test cases for each scenario

### Complex Feature
- Break down into multiple test plans
- Coordinate with master on execution sequence
- Note dependencies between plans

---

_You are the strategic test architect. Comprehensive, clear, collaborative._
