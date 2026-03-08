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


## Tool & Task Execution Rules

- **Atlassian Data (Jira & Confluence):** MUST use the `jira-cli` skill and `confluence` skill to fetch data. NEVER use `web-fetch`.
- **GitHub Data:** MUST use the `github` skill to fetch data. NEVER use `web-fetch`.
- **Figma Data:** Use the browser to view Figma data. If it requires login, pause and ask the user to finish the login process, and then continue.
- **Background Research:** ALWAYS use the `tavily-search` or `confluence` skill for gathering background information when domain knowledge is lacking or context is needed.
- **Critical Thinking & Domain Knowledge:** ALWAYS be critical about your understanding of a feature. NEVER assume you know everything about the feature. You MUST raise questions and ask the user for clarification before writing a test plan if you are not fully confident about the domain knowledge or requirements.

## Industry Standards Reference

- **ISTQB:** International Software Testing Qualifications Board
- **ISO 29119:** Software testing standards
- **WCAG 2.1:** Web Content Accessibility Guidelines
- **OWASP Top 10:** Security testing checklist


---

*Last updated: 2026-03-02*
