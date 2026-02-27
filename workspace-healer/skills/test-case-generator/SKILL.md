---
name: test-case-generator
description: Generate comprehensive test cases from requirements, user stories, or feature descriptions. Creates functional, edge case, boundary, and UI test cases. Use when designing tests for new features, writing test documentation, or preparing test plans.
homepage: https://github.com/naodeng/awesome-qa-prompt
metadata: {"clawdbot":{"emoji":"📝","requires":{"bins":["jira-cli"]}}}
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

## Test Case Template

```markdown
### TC-[ID]: [Test Case Name]
**Priority**: P0/P1/P2/P3
**Type**: Functional/UI/Integration/Security

**Preconditions:**
- Precondition 1
- Precondition 2

**Steps:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Result:**
[What should happen]

**Test Data:**
- Username: [data]
- Password: [data]
```

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

### Export to Jira Format
```bash
# Generate JIRA-compatible test cases
jira issue create --summary "TC-LOGIN-001: Successful Login" \
  --type Test \
  --priority P0 \
  --description "**Preconditions:**\n- User exists\n\n**Steps:**\n1. Navigate to login\n2. Enter credentials\n3. Click Login\n\n**Expected:** Dashboard loads"
```

### CSV Export Template
```csv
ID,Name,Priority,Type,Preconditions,Steps,Expected Result
TC-001,Login Success,P0,Functional,User exists,3 steps,Dashboard loads
TC-002,Invalid Password,P0,Functional,User exists,4 steps,Error message
```

## Priority Guidelines

| Priority | Description | When to Use |
|----------|-------------|-------------|
| **P0** | Critical path | Happy path, core functionality |
| **P1** | High importance | Common edge cases, key negative tests |
| **P2** | Medium importance | Boundary cases, UI tests |
| **P3** | Low importance | Nice-to-have, rare scenarios |

## Use Cases

### 1. New Feature Testing
1. Get feature requirements
2. Run `test-case-generator`
3. Review and refine test cases
4. Export to Jira/test management

### 2. Regression Testing
1. Identify features to test
2. Generate test suite
3. Prioritize by P0/P1
4. Execute and track in Jira

### 3. Test Coverage Analysis
1. Input: Current test suite
2. Identify gaps in coverage
3. Generate missing test cases
4. Add to suite

## Integration Points

- **qa-daily-workflow**: Use generated test cases in daily testing
- **jira-cli**: Export test cases to Jira
- **playwright-cli**: Execute UI test cases
- **microstrategy-testing**: Generate tests for MicroStrategy features

## Tips for Best Results

1. **Provide clear requirements** - More detail = better test cases
2. **Specify target users** - Help identify edge cases
3. **Mention integrations** - Include API/database tests
4. **Define priority levels** - Guide test execution order
5. **Review generated cases** - Validate against business logic
