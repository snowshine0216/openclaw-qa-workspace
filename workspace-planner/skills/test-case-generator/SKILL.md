---
name: test-case-generator
description: Generate comprehensive test cases from an existing QA plan and requirements. Creates detailed Markdown (`.md`) specs in Playwright-compatible format for the Tester Agent to consume and auto-heal. Output in specs/<domain>/<feature>/ per TEST_CASE_GENERATION_DESIGN.md.
homepage: https://github.com/naodeng/awesome-qa-prompt
metadata: {"clawdbot":{"emoji":"📝","requires":{"bins":[]}}}
---

# Test Case Generator Skill

Generate structured, comprehensive test cases from requirements or feature descriptions.

## Input Format

### Option 1: User Story
```markdown
As a [role], I want to [action], so that [benefit].

Acceptance Criteria:
- Criterion 1
- Criterion 2
```

### Option 2: Feature Description
```markdown
Feature: [Name]
Description: [What it does]
Requirements:
- Requirement 1
- Requirement 2
```

### Option 3: Raw Requirements
Paste any documentation, specs, or descriptions about the feature.

## Test Case Categories

| Category | Purpose | Examples |
|----------|---------|----------|
| **Positive** | Happy path execution | Valid login, successful checkout |
| **Negative** | Invalid inputs/conditions | Wrong password, insufficient stock |
| **Boundary** | Edge values | Min/max lengths, zero values |
| **UI/UX** | Visual and interaction | Responsive design, accessibility |
| **Integration** | System interactions | API calls, database operations |
| **Security** | Authentication/authorization | SQL injection, XSS, permissions |

## Output Format: Markdown (Playwright-Compatible)

Generate each test case as a discrete `.md` file consumable by the Playwright Generator and Healer. Save to `specs/<domain>/<feature>/<scenario>.md` (e.g. `specs/report-editor/report-undo-redo/authoringClear.md`) per [TEST_CASE_GENERATION_DESIGN.md](../../docs/TEST_CASE_GENERATION_DESIGN.md).

**Required structure:** See `workspace-planner/docs/TEST_CASE_GENERATION_DESIGN.md` for full schema.

```markdown
# [Application/Feature] — [Scenario Name]

**Seed:** `tests/seed.spec.ts`

## Application Overview
[Brief scope and behaviors]

## Test Scenarios

### N. [Scenario Label]

**Steps:**
1. [Semantic action — use role/label/text, not IDs/CSS]
2. ...
3. ...

**Expected Results:**
- [Measurable outcome]
```

### Semantic Step Phrasing (Critical for Auto-Healing)

| Do | Don't |
|----|-------|
| Click the "Submit" button | Click #submit-btn |
| Type "user@test.com" in the Email field | Enter email |
| Verify the heading "Success" is visible | Verify success |
| Select "Q1 2024" from the Date dropdown | Use date picker |

## Generation Process

### Step 1: Analyze Requirements

**Extract key elements:**
- User actions (CRUD: Create, Read, Update, Delete)
- Input fields and validation rules
- Business logic and workflows
- User roles and permissions
- Integration points

### Step 2: Identify Test Scenarios

**Functional Coverage:**
- ✅ All user actions work correctly
- ✅ Invalid inputs rejected
- ✅ Error messages helpful
- ✅ Data persists correctly

**Non-Functional Coverage:**
- ⚡ Performance under load
- 🔒 Security vulnerabilities
- ♿ Accessibility compliance
- 📱 Cross-browser compatibility

### Step 3: Generate Test Cases

**Positive Cases:**
```
TC-001: Successful login with valid credentials
TC-002: Create new record with all required fields
TC-003: Search returns matching results
```

**Negative Cases:**
```
TC-010: Login with incorrect password
TC-011: Create record with missing required field
TC-012: Search with no matching results
TC-013: Input exceeds maximum length
```

**Boundary Cases:**
```
TC-020: Input at minimum length (1 char)
TC-021: Input at maximum length (N chars)
TC-022: Input exceeds maximum length
TC-023: Special characters in input
TC-024: SQL injection attempt
TC-025: XSS script in input
```

**UI Test Cases:**
```
TC-030: Responsive design on mobile
TC-031: Form validation error messages display
TC-032: Loading states display correctly
TC-033: Error states display properly
```

## Example Output

### Input:
```markdown
Feature: User Login
As a registered user, I want to log in so that I can access my dashboard.

Requirements:
- Email and password required
- Email must be valid format
- Password minimum 8 characters
- Show error for invalid credentials
- Remember me option available
```

### Generated Test Cases:

```markdown
## Test Cases: User Login

### TC-LOGIN-001: Successful Login
**Priority**: P0
**Type**: Functional

**Preconditions:**
- User account exists with email=user@test.com, password=Password123

**Steps:**
1. Navigate to login page
2. Enter email: user@test.com
3. Enter password: Password123
4. Click "Login" button

**Expected Result:**
- Dashboard page loads
- User email displayed in header
- Session created successfully

---

### TC-LOGIN-002: Login with Invalid Password
**Priority**: P0
**Type**: Functional

**Preconditions:**
- User account exists

**Steps:**
1. Navigate to login page
2. Enter valid email
3. Enter wrong password: WrongPass123
4. Click "Login" button

**Expected Result:**
- Error message displayed: "Invalid email or password"
- User remains on login page
- No session created

---

### TC-LOGIN-003: Login with Invalid Email Format
**Priority**: P1
**Type**: Functional

**Steps:**
1. Navigate to login page
2. Enter invalid email: notanemail
3. Enter any password
4. Click "Login" button

**Expected Result:**
- Inline validation error: "Please enter a valid email address"
- Login button disabled

---

### TC-LOGIN-010: Boundary - Password at Minimum Length
**Priority**: P2
**Type**: Boundary

**Steps:**
1. Navigate to login page
2. Enter email: user@test.com
3. Enter password: 8 chars (Pass1234)
4. Click "Login" button

**Expected Result:**
- Login successful (if credentials valid)

---

### TC-LOGIN-011: Boundary - Password Below Minimum Length
**Priority**: P1
**Type**: Boundary

**Steps:**
1. Navigate to login page
2. Enter email: user@test.com
3. Enter password: 7 chars (Pass123)
4. Click "Login" button

**Expected Result:**
- Error message: "Password must be at least 8 characters"

---

### TC-LOGIN-020: Security - SQL Injection in Email
**Priority**: P1
**Type**: Security

**Steps:**
1. Navigate to login page
2. Enter email: ' OR 1=1 --
3. Enter any password
4. Click "Login" button

**Expected Result:**
- Input sanitized
- Error message: "Invalid email or password"
- No database error exposed

---

### TC-LOGIN-030: UI - Remember Me Checkbox
**Priority**: P2
**Type**: UI

**Preconditions:**
- User account exists

**Steps:**
1. Navigate to login page
2. Enter valid credentials
3. Check "Remember me" checkbox
4. Click "Login" button
5. Close browser
6. Reopen browser to login page

**Expected Result:**
- User session persisted
- Email pre-filled
- User can login without re-entering credentials
```

## Test Case Management

All generated test cases must be saved as Markdown files under `specs/<domain>/<feature>/` (e.g. `specs/report-editor/report-undo-redo/`). Each spec must include `**Seed:** \`tests/seed.spec.ts\`` and use semantic step phrasing so the Tester Agent can translate to Playwright and the Healer can auto-fix locators.

**State tracking:** Use `testcase_task.json` (not `task.json`) to track generation progress. Update `subtask_timestamps["spec:<scenario>"]` after each file is written. Task file lives at: `projects/feature-plan/<feature-id>/testcase_task.json`.

## Priority Guidelines

| Priority | Description | When to Use |
|----------|-------------|-------------|
| **P0** | Critical path | Happy path, core functionality |
| **P1** | High importance | Common edge cases, key negative tests |
| **P2** | Medium importance | Boundary cases, UI tests |
| **P3** | Low importance | Nice-to-have, rare scenarios |

## Use Cases

### 1. New Feature Testing
1. Look up the existing QA plan / feature requirements. Use `tavily-search` or `confluence` for project context. Use `clawddocs` only for OpenClaw-specific plans.
2. **Never assume detailed steps** — when steps or flows are unclear, research first: `tavily-search` for official docs, `confluence` for internal product docs.
3. Run `test-case-generator` to identify scenarios
4. Serialize detailed Markdown specs one by one under `specs/<domain>/<feature>/` (e.g. `specs/report-editor/report-undo-redo/`). Use **only** these action verbs: `Click`, `Type`, `Fill`, `Select`, `Check`, `Uncheck`, `Press`, `Hover`, `Drag`, `Verify`, `Wait for`, `Navigate to`. Steps referencing IDs or CSS classes break auto-healing.
5. Handoff specs to Tester Agent to generate scripts and run (via Playwright CLI and Playwright Generator)

### 2. Regression Testing
1. Identify features to test against existing coverage
2. Generate additional or missing test cases incrementally
3. Prioritize by P0/P1
4. Handoff to Tester Agent

### 3. Test Coverage Analysis
1. Input: Current test suite
2. Identify gaps in coverage
3. Generate missing test cases
4. Add to suite

## Integration Points

- **test-case-generation workflow**: This skill is invoked by `.agents/workflows/test-case-generation.md` Phase 4. Do not invoke it standalone outside that workflow unless the user explicitly requests ad-hoc generation.
- **qa-daily-workflow**: Use generated specs in daily testing
- **tester-agent**: Consumes Markdown specs, translates to `tests/specs/**/*.spec.ts` via Playwright Generator, runs via `npx playwright test`. Uses **Playwright CLI** (not MCP) — see [playwright-cli](https://github.com/microsoft/playwright-cli), [Playwright Test Agents](https://playwright.dev/docs/test-agents)
- **playwright-cli**: Execute UI tests; Healer uses `playwright-cli snapshot` to derive semantic locators for auto-healing
- **tavily-search** / **confluence**: Research exact steps when uncertain. Never assume. `clawddocs` only for OpenClaw-specific plans.

## Tips for Best Results

1. **Provide clear requirements** - More detail = better test cases
2. **Specify target users** - Help identify edge cases
3. **Mention integrations** - Include API/database tests
4. **Define priority levels** - Guide test execution order
5. **Review generated cases** - Validate against business logic
