# MEMORY.md - QA Test Planning Agent Long-Term Memory

_Test planning patterns and best practices._

## Common Test Patterns

### Login/Authentication
- Always test valid/invalid credentials
- Include password reset flow
- Check session management
- Test account lockout after failed attempts
- Verify "remember me" functionality

### Forms & Input Validation
- Special characters (', ", <, >, &)
- SQL injection attempts
- XSS attempts (script tags)
- Boundary conditions (min/max length)
- Required field validation
- Email format validation

### CRUD Operations
- Create, Read, Update, Delete flows
- Permission checks (authorized vs unauthorized)
- Cascading deletes (if applicable)
- Data integrity checks

### UI/UX Standards
- Responsive design (320px mobile, 768px tablet, 1920px desktop)
- Browser compatibility (Chrome, Firefox, Safari, Edge)
- WCAG 2.1 AA compliance (accessibility)
- Loading states and spinners
- Error message clarity

## Effective Test Plan Structure

1. **Overview** - issue key, feature, priority, test types
2. **Requirements Summary** - brief context from Jira
3. **Test Scenarios** - grouped by category (functional, edge, UI, etc.)
4. **Test Data** - specific data needed for execution
5. **Dependencies** - prerequisites, environment, tools
6. **Handoff** - instructions for qa-test

## Lessons Learned

### What Works Well
- Numbered steps (easy to reference in bug reports)
- Expected results per step (clear pass/fail criteria)
- Screenshots/mockups in test plans (visual reference)
- Test data tables (reduces ambiguity)

### Common Gaps to Avoid
- Forgetting negative test cases
- Missing edge cases (empty strings, null values)
- Not specifying test data
- Ambiguous expected results ("system should work correctly")

### Critical Mistakes to NEVER Repeat

#### 🔴 Confluence Publishing - ALWAYS Convert Markdown First
**Mistake**: Published raw Markdown (.md) directly to Confluence  
**Result**: Ugly plain text with `#`, `**`, `|` visible instead of formatted content  
**Lesson**: Confluence uses HTML storage format, NOT Markdown. NEVER publish raw `.md` files directly.

**✅ Correct Process:**
Always follow the specific publication steps outlined in the Feature QA Planning Workflow (`.agents/workflows/feature-qa-planning.md`).

**Date Learned**: 2026-02-25  
**Context**: BCED-4198 QA plan published incorrectly, had to fix and republish

## Tool & Task Execution Rules

- **Atlassian Data (Jira & Confluence):** ALWAYS use the `jira-cli` skill and `confluence` skill to fetch data. NEVER use `web-fetch`.
- **Figma Data:** Use the browser to view Figma data. If it requires login, pause and ask the user to finish the login process, and then continue.
- **Background Research:** ALWAYS use the `tavily-search` skill for gathering background information when domain knowledge is lacking or context is needed.
- **Critical Thinking & Domain Knowledge:** ALWAYS be critical about your understanding of a feature. NEVER assume you know everything about the feature. You MUST raise questions and ask the user for clarification before writing a test plan if you are not fully confident about the domain knowledge or requirements.

## Industry Standards Reference

- **ISTQB:** International Software Testing Qualifications Board
- **ISO 29119:** Software testing standards
- **WCAG 2.1:** Web Content Accessibility Guidelines
- **OWASP Top 10:** Security testing checklist

## Test Case Naming Convention

- **TC-XX:** Test Case number (sequential)
- **Functional:** TC-01 to TC-20
- **Edge Cases:** TC-21 to TC-40
- **Negative:** TC-41 to TC-60
- **UI/UX:** TC-61 to TC-80
- **Performance:** TC-81 to TC-90
- **Security:** TC-91 to TC-99

---

*Last updated: 2026-02-23*
