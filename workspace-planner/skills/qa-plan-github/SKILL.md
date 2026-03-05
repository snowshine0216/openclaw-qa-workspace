---
name: qa-plan-github
description: Generate QA domain summaries by analyzing GitHub pull request diffs to identify code changes and risk areas. Use when the user asks to extract QA findings from PR, analyze code changes for testing, or mentions "QA summary from GitHub", "PR testing", or "code change analysis".
---

# QA Plan Domain Summary Generator from GitHub Pull Requests

Generate comprehensive QA domain summaries by analyzing GitHub PR diffs, identifying code changes, risk areas, and testing context.

## When to Use

- User provides a GitHub PR URL or PR number
- User asks to "extract QA context from GitHub PR"
- User mentions "analyze code changes for testing" or "PR risk analysis"
- Creating test findings based on code implementation

## Prerequisites

**GitHub MCP Server Required**: GitHub MCP server must be configured.

**Note**: If GitHub MCP is not available, use the GitHub CLI tool (`gh`) as fallback:
```bash
gh pr view <pr_number> --json files,additions,deletions,body,title
gh pr diff <pr_number>
```

## File Filtering Rules

**Exclude from analysis** (these files don't require functional testing):
- `*.json` (except `package.json` for dependency changes)
- `*.lock` files (`package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`)
- `*.md` files (documentation)
- `*.yaml` / `*.yml` (CI/CD configs, unless they affect deployment)
- `*.css` files (CSS files)

**Include for analysis**:
- Source code files (`.ts`, `.tsx`, `.js`, `.jsx`, `.py`, `.java`, etc.)
- Configuration that affects runtime (`.env.example`, config files)
- Database migrations
- API route definitions

## Workflow

### Step 1: Extract PR Information

**From PR URL**: Extract owner, repo, and PR number:
```
https://github.com/owner/repo/pull/123
→ owner: owner, repo: repo, pr_number: 123
```

**Required PR Data**:
- PR title and description
- Changed files list
- Diff content
- Commit messages
- Review comments (if available)

### Step 2: Read PR Changes

**Option A: Using GitHub MCP** (when available):
```
Tool: CallMcpTool
Server: github-mcp-server
Tool Name: pull_request_read
Arguments:
{
  "owner": "owner-name",
  "repo": "repo-name",
  "pull_number": 123
}
```

**Option B: Using GitHub CLI** (fallback):
```bash
# Get PR overview
gh pr view <pr_number> --repo owner/repo --json title,body,files,additions,deletions

# Get full diff
gh pr diff <pr_number> --repo owner/repo
```

### Step 3: Analyze Code Changes

**Categorize changes by risk level**:

| Risk Level | Indicators | Examples |
|------------|------------|----------|
| **High** | Database schema changes, auth changes, payment logic | Migration files, auth middleware, payment APIs |
| **Medium** | Business logic, API endpoints, state management | Service functions, API routes, Redux slices |
| **Low** | UI components, styling, type definitions | React components, CSS, TypeScript types |

**Identify change types**:
- New features (new files, new functions)
- Bug fixes (error handling, validation changes)
- Refactoring (code restructuring, no behavior change)
- Performance optimization
- Security improvements

### Step 4: Map Changes to Test Scenarios

**For each significant change**:
1. **Identify affected functionality**
2. **Determine test scope** (`COMP` or `XFUNC`)
3. **List user-facing test scenarios** (manual-observable outcomes first)
4. **Note edge cases and risks**
5. **Broader Focus for Non-Backend Features**: Transcend the raw code diffs. If the PR affects client-facing functionality, project those code changes into E2E user-experience impacts and express the scenarios in user-facing, behavioral terms.

**User-facing writing rule (mandatory)**:
- Scenario descriptions must be actionable for QA without source-code inspection.
- Internal function/flag/class names are allowed in traceability output only, not in scenario text.

### Multi-Repo Analysis

When analyzing multiple repos/PRs for the same feature:
- **Group findings by functional scenario**, not by repo. For example, if `react-report-editor`, `biweb`, and `mojojs` all contribute to "error recovery flow", output one scenario section that lists code changes from all three repos together.
- In the output, prefix cross-repo references with the repo name in bold (e.g., `**biweb**: RWManipulationBuilder.java → reCreateInstance()`).
- Do NOT create separate top-level sections per repo (e.g., "### biweb Changes", "### mojojs Changes"). Instead, organize by what the user will test (e.g., "### Pause Mode Error Recovery", "### Prompt Answer Error Handling").
- This ensures the downstream `qa-plan-synthesize` skill can directly map scenarios to integrated test tables without needing to re-merge repo-specific sections.

**Example Mapping**:
```
Change: Added email validation in src/utils/validation.ts
→ Test Scope: Unit + Integration
→ Scenarios:
  - Valid email formats accepted
  - Invalid formats rejected
  - Edge cases: empty, whitespace, special chars
→ Risk: Email validation may block legitimate addresses
```

### Step 5: Generate QA Domain Summary

Create a markdown file containing free-form findings: `projects/feature-plan/<feature_id>/context/qa_plan_github_<feature_id>.md`

*Note: You do NOT need to follow a strict 9-section template layout. Output extracted code changes, technical risks, and scenario mappings freely so it can be merged by `qa-plan-synthesize` later.*

### Step 5b: Dual Output Contract (Mandatory)

Produce two artifacts:

1. Main summary (user-facing only):
   - `projects/feature-plan/<feature_id>/context/qa_plan_github_<feature_id>.md`
   - Contains scenarios written as user actions + observable outcomes.
   - No internal verification wording in scenario text.

2. Traceability companion (code vocabulary allowed):
   - `projects/feature-plan/<feature_id>/context/qa_plan_github_traceability_<feature_id>.md`
   - Contains file/function/method/flag references used only for `Related Code Change` mapping in synthesis.

Traceability file minimum structure:
```markdown
# GitHub Traceability: [Feature]

| Scenario ID | Repo/File | Function/Method/Flag | Why It Matters |
|-------------|-----------|----------------------|----------------|
| T-1 | src/path/file.ts | functionName / flagName | [Mapping note for synthesis] |
```

Both artifacts are required when GitHub input is provided.

**Test Scope Classification** (required for each change):
| Scope | Definition | Where It Goes in QA Plan |
|-------|-------------|--------------------------|
| **COMP** (Component) | Single file/component; no cross-layer flow; verifiable by unit or narrow integration test | Manual table if user-observable; else AUTO |
| **XFUNC** (Cross-Functional / E2E) | Spans UI + API + state; user flow; requires browser or full stack | Manual Test Key Points (user-facing steps) |

**Rule**: If a change affects a user-visible flow (button click → API → UI update), mark **XFUNC**. If it is internal (e.g., `toHex()` utility, flag lifecycle), mark **COMP** and note "AUTO if not user-observable".

**Additional required section in main summary**:

```markdown
## 🔗 E2E Scenarios to Add (from Code Analysis)

| Scenario | Trigger (User Action) | Observable Outcome | Related Code |
|----------|------------------------|--------------------|--------------|
| [Scenario discovered from diff] | [How user triggers it] | [What QA can observe in UI/network] | [Short code traceability ref] |
```

For each XFUNC change, explicitly ask: "What user flow exercises this?" If not already covered by Jira ACs, add it to this section.

```markdown
# GitHub Domain Summary: [Feature Name] - PR Analysis

## 📊 Summary

| Field | Value |
|-------|-------|
| **PR URL** | [GitHub PR URL] |
| **PR Number** | #[Number] |
| **Date Generated** | [Current Date] |
| **Files Changed** | [Count] |
| **Lines Added** | +[Count] |
| **Lines Deleted** | -[Count] |
| **Risk Level** | [High/Medium/Low] |

## 📝 PR Overview

**Title**: [PR Title]

**Description**:
[PR Description / Body]

**Linked Issues**: [Issue references if any]

## 🔍 Code Changes Analysis

### High-Risk Changes

| File | Change Type | Risk | Test Scope | Priority |
|------|-------------|------|-------------|----------|
| src/auth/middleware.ts | Modified auth logic | High | XFUNC | P0 |
| db/migrations/001_add_user_roles.sql | Schema change | High | XFUNC | P0 |

### Medium-Risk Changes

| File | Change Type | Risk | Test Scope | Priority |
|------|-------------|------|-------------|----------|
| src/api/users.ts | New endpoint | Medium | XFUNC | P1 |
| src/services/email.ts | Email service update | Medium | COMP | P1 |

### Low-Risk Changes

| File | Change Type | Risk | Test Scope | Priority |
|------|-------------|------|-------------|----------|
| src/components/Button.tsx | UI update | Low | XFUNC | P2 |
| src/types/user.ts | Type definition | Low | COMP | P2 |

## 🧪 Test Scenarios by Functional User Flow

Use user-facing flow groupings (for example `Pause Mode Recovery`, `Prompt Error Handling`, `Scope Boundaries`), not implementation buckets. Keep code-level traceability in the separate traceability artifact.

### Backend Testing

#### API Endpoints

| Endpoint | Method | Test Scenario | Expected Result | Priority |
|----------|--------|---------------|-----------------|----------|
| /api/users | POST | Create user with valid data | 201 Created, user object returned | P0 |
| /api/users | POST | Create user with duplicate email | 409 Conflict, error message | P0 |
| /api/users/:id | GET | Fetch existing user | 200 OK, user data | P0 |
| /api/users/:id | GET | Fetch non-existent user | 404 Not Found | P1 |

#### Database Operations

| Operation | Test Scenario | Expected Result | Priority |
|-----------|---------------|-----------------|----------|
| User.create() | Insert with valid data | Record created, ID returned | P0 |
| User.create() | Insert with null required field | Error thrown, no record | P0 |
| Migration up | Run new migration | Schema updated, no data loss | P0 |
| Migration down | Rollback migration | Schema reverted, data preserved | P1 |

#### Business Logic

| Function | Test Scenario | Expected Result | Priority |
|----------|---------------|-----------------|----------|
| validateEmail() | Valid email format | Returns true | P0 |
| validateEmail() | Invalid format | Returns false + error message | P0 |
| calculateTotal() | Positive numbers | Correct sum | P0 |
| calculateTotal() | Negative numbers | Error or 0 (per spec) | P1 |

### Frontend Testing

#### Component Behavior

| Component | Test Scenario | Expected Result | Priority |
|-----------|---------------|-----------------|----------|
| UserForm | Submit with valid data | Form submits, success message | P0 |
| UserForm | Submit with invalid email | Validation error shown | P0 |
| UserList | Load with data | All users displayed | P0 |
| UserList | Load with empty data | "No users" message shown | P1 |

#### State Management

| Action | Test Scenario | Expected Result | Priority |
|--------|---------------|-----------------|----------|
| fetchUsers() | Successful API call | State updated with users | P0 |
| fetchUsers() | Failed API call | Error state set, error shown | P1 |
| createUser() | Success response | User added to list | P0 |
| createUser() | Error response | Error message displayed | P1 |

### Integration Testing

| Integration Point | Test Scenario | Expected Result | Priority |
|-------------------|---------------|-----------------|----------|
| Frontend → API | Form submit triggers API call | Data sent correctly | P0 |
| API → Database | API saves data to DB | Data persisted correctly | P0 |
| Auth → Protected Route | Unauthenticated access | Redirect to login | P0 |

## ⚠️ Risk Assessment & Mitigation

### Technical Risks

| Risk | Impact | Likelihood | Mitigation Strategy | Code Reference |
|------|--------|------------|---------------------|----------------|
| Migration breaks existing data | High | Medium | Test on staging, backup production | `db/migrations/001_add_user_roles.sql` |
| Auth bypass vulnerability | Critical | Low | Security audit, penetration testing | `src/auth/middleware.ts:45-67` |
| API rate limit not enforced | Medium | Medium | Load testing, monitor rate limiter | `src/middleware/rateLimit.ts:12` |

### Edge Cases Identified

| Edge Case | Code Location | Test Approach |
|-----------|---------------|---------------|
| Concurrent user creation with same email | `src/api/users.ts:34` | Race condition testing |
| Large file upload (>10MB) | `src/api/upload.ts:56` | Load testing with various sizes |
| Special characters in user input | `src/utils/sanitize.ts:23` | Fuzzing with special char sets |

## 📋 Test Key Points

### Unit Testing Requirements

- [ ] All new functions have unit tests
- [ ] Modified functions have updated tests
- [ ] Edge cases covered (null, undefined, empty)
- [ ] Error cases tested
- [ ] Mock dependencies properly

### Integration Testing Requirements

- [ ] API endpoints tested with real database
- [ ] Authentication flow tested end-to-end
- [ ] Error handling tested across layers
- [ ] Transaction rollback scenarios tested

### E2E Testing Requirements

- [ ] Happy path user flows
- [ ] Error recovery flows
- [ ] Cross-browser compatibility
- [ ] Mobile responsiveness

## 📊 Code Coverage Analysis

| Directory | Previous Coverage | Target Coverage | Priority |
|-----------|-------------------|-----------------|----------|
| src/auth/ | 75% | 90% | P0 |
| src/api/ | 60% | 85% | P0 |
| src/components/ | 80% | 85% | P1 |
| src/utils/ | 90% | 90% | P2 |

## 📎 Reference Data

### Changed Files List

```
src/auth/middleware.ts (+45, -12)
src/api/users.ts (+120, -5)
src/components/UserForm.tsx (+78, -23)
db/migrations/001_add_user_roles.sql (+30, -0)
src/types/user.ts (+15, -3)
```

### Commit Messages

1. `feat: add user role management`
2. `fix: validate email format in user creation`
3. `refactor: extract validation logic to utils`

### Dependencies Changed

| Package | Old Version | New Version | Impact |
|---------|-------------|-------------|--------|
| express | 4.18.0 | 4.19.2 | Security patch |
| zod | 3.21.0 | 3.22.4 | New validation features |

### Function Signatures Changed

```typescript
// Before
function createUser(email: string): User

// After
function createUser(email: string, role?: UserRole): User
```

## 🔗 Related Documentation

- Design Doc: [Link if available]
- API Spec: [Link if available]
- Architecture Decision: [Link if available]

## 🎯 Test Execution Checklist

- [ ] Unit tests pass locally
- [ ] Integration tests pass on staging
- [ ] E2E tests pass on test environment
- [ ] Performance tests (if applicable)
- [ ] Security scan (if applicable)
- [ ] Accessibility audit (for UI changes)
- [ ] Cross-browser testing (for frontend)
- [ ] Mobile testing (for responsive changes)
```

## Output File Handling

**Default Location**: Write to the feature context folder:
```
projects/feature-plan/<feature_id>/context/
```

**Naming Convention**:
```
qa_plan_github_<feature_id>.md
qa_plan_github_traceability_<feature_id>.md
```

## Advanced Analysis Techniques

### Identify Test Gaps

Look for changes without corresponding test updates:
```bash
# Find changed source files
Changed: src/services/payment.ts

# Check for test file
Missing: src/services/payment.test.ts

→ Flag: "New logic added without test coverage"
```

### Detect Breaking Changes

Look for:
- Function signature changes
- API endpoint modifications
- Database schema alterations
- Environment variable additions

### Security Scanning

Flag security-sensitive changes:
- Authentication/authorization logic
- Input validation
- SQL query construction
- File system operations
- Environment variable usage

## Integration with Other Skills

This skill outputs data consumed by:
- `qa-plan-synthesize`: Merges user-facing summary with traceability companion and Jira/Figma analysis
- `qa-plan-review`: Reviews test coverage completeness
- `xmind-generator`: Visualizes code change impact in mind map

## Error Handling

**If PR URL is invalid**:
1. Inform user the URL format is incorrect
2. Request correct format: `https://github.com/owner/repo/pull/123`

**If PR is not found**:
1. Verify repository access permissions
2. Check if PR number exists
3. Ask user for correct PR reference

**If diff is too large**:
1. Process files in batches
2. Focus on high-risk files first
3. Save intermediate analysis to temp file

**If GitHub MCP is unavailable**:
1. Fall back to `gh` CLI
2. If CLI unavailable, ask user to provide diff manually

## Best Practices

### Focus on Functional Changes

Ignore cosmetic changes unless they affect:
- User interaction
- Accessibility
- Performance
- Security

### Think About Dependencies

Consider:
- What other modules depend on changed code?
- What services are affected?
- What data flows through changed functions?

### Prioritize by Risk

Always test high-risk changes first:
1. Security-related code
2. Payment processing
3. Data integrity
4. Authentication/authorization

### Document Assumptions

If the PR description is vague, document:
- Assumptions made
- Questions for developers
- Areas needing clarification

## Example Usage

**User Request**:
> "Create QA plan from this PR: https://github.com/myorg/myapp/pull/456"

**Skill Actions**:
1. Extract owner: `myorg`, repo: `myapp`, PR: `456`
2. Read PR diff via GitHub MCP or `gh` CLI
3. Filter out `.lock`, `.json`, `.md` files
4. Analyze remaining code changes
5. Map changes to test scenarios
6. Identify risk areas
7. Generate user-facing summary: `projects/feature-plan/user-auth/context/qa_plan_github_user-auth.md`
8. Generate code traceability companion: `projects/feature-plan/user-auth/context/qa_plan_github_traceability_user-auth.md`

## Notes

- Always include line numbers for code references
- Link test scenarios to specific file paths
- Estimate test effort where possible
- Flag any security concerns immediately
