# MEMORY.md - QA Test Execution Agent Long-Term Memory

_Test execution patterns and automation tips._

## Common Failure Patterns

### UI Timing Issues
- Element not found: Wait longer (increase timeout)
- Stale element reference: Re-query element after page update
- Click intercepted: Wait for loading overlay to disappear

### Browser Automation Tips
- Use explicit waits over implicit waits
- Take screenshots before AND after key actions
- Capture console logs immediately after errors
- Use unique selectors (IDs > classes > XPath)

### MicroStrategy Specific
- Wait for dashboard rendering (spinner disappears)
- Handle pop-ups and modals (close before proceeding)
- Verify data loaded before interacting
- Screenshots of full dashboard (not just viewport)

## Effective Screenshot Strategy

**When to screenshot:**
1. Before key action (baseline)
2. After key action (result)
3. On error (evidence)
4. Final state (completion)

**What to capture:**
- Full page (not just viewport) when possible
- Error messages (zoom if needed)
- Console logs (separate file)
- Network tab (HAR export for failures)

## Test Data Best Practices

- Use consistent test accounts (test@example.com)
- Reset test data before each run (if needed)
- Document test data in test plan
- Don't hardcode credentials (use TOOLS.md reference)

## Browser Tools Comparison

| Tool | Use Case | Pros | Cons |
|------|----------|------|------|
| microstrategy-ui-test | MicroStrategy testing | Domain-specific, optimized | Limited to MicroStrategy |
| playwright-cli | General automation | Cross-browser, stable | Setup overhead |
| browser (native) | Quick checks | Built-in, fast | Less powerful |

## Lessons Learned

### What Works Well
- Clear test case IDs (easy to reference)
- Screenshots with descriptive names
- Console logs captured immediately
- Execution reports with summary tables

### Common Pitfalls to Avoid
- Not waiting for elements to load
- Missing screenshots on failures
- Vague error descriptions
- Not capturing console logs

## Automation Patterns

### Login Flow
```
1. Navigate to URL
2. Wait for login form (selector: #login-form)
3. Fill username (selector: #username)
4. Fill password (selector: #password)
4. Click login (selector: #login-btn)
5. Wait for dashboard (selector: #dashboard)
6. Screenshot success
```

### Form Validation
```
1. Navigate to form
2. Leave required field empty
3. Submit form
4. Wait for error message (selector: .error)
5. Screenshot error
6. Verify error message text
```

### CRUD Operations
```
1. Create: POST /api/items {name: "test"}
2. Verify: GET /api/items (check for "test")
3. Update: PUT /api/items/1 {name: "updated"}
4. Verify: GET /api/items/1 (check for "updated")
5. Delete: DELETE /api/items/1
6. Verify: GET /api/items (check "test" is gone)
```

## Test Environment Notes

- **Staging URL:** (to be filled when configured)
- **Test credentials:** Stored in TOOLS.md
- **Browser version:** Chrome latest (recommended)
- **Headless mode:** Available for CI integration

---

*Last updated: 2026-02-23*
