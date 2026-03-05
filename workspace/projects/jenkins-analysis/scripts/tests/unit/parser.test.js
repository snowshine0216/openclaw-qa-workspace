const { extractFailuresFromLog } = require('../../parsing/parser');

describe('Parser - extractFailuresFromLog', () => {
  it('should parse valid console text with file blocks properly', () => {
    const consoleText = `
specs/login.spec.js(1 failed)
[TC86139_02] Verify user login
✗ run_1
Screenshot "TC86139_02 - Login screen" doesn't match
Visit http://spectre/1 for details
- Failed: image differ
    at <Jasmine>

✗ run_2
Screenshot "TC86139_02 - Login screen" doesn't match
Visit http://spectre/2 for details
- Failed: image differ 2
    at <Jasmine>
`;
    const failures = extractFailuresFromLog(consoleText);
    expect(failures).toHaveLength(1); // deduplicated
    expect(failures[0].fileName).toBe('specs/login.spec.js');
    expect(failures[0].tcId).toBe('TC86139_02');
    expect(failures[0].tcName).toBe('Verify user login');
    expect(failures[0].stepId).toBe('TC86139_02');
    expect(failures[0].stepName).toBe('Login screen');
    expect(failures[0].retryCount).toBe(2);
    expect(failures[0].failureType).toBe('screenshot_mismatch');
  });

  it('should fallback to legacy parser if no file block is found', () => {
    const consoleTextLegacy = `
[QAC-487_3] Verify logout :
✗ run_1
Screenshot "QAC-487 - Logout btn" doesn't match
- Failed: error msg
    at <Jasmine>
`;
    // The legacy fallback matches: [QAC-487_3] Verify logout : (note the colon)
    const failures = extractFailuresFromLog(consoleTextLegacy);
    expect(failures).toHaveLength(1);
    expect(failures[0].fileName).toBe('unknown.spec.js');
    expect(failures[0].tcId).toBe('QAC-487_3');
    expect(failures[0].retryCount).toBe(1);
  });

  it('should return empty array for empty or unparseable text', () => {
    const failures = extractFailuresFromLog('Some random console log with no errors');
    expect(failures).toEqual([]);
  });

  it('should handle assertion failures', () => {
    const consoleText = `
specs/api.spec.js(1 failed)
[BCIN-5296] Verify endpoints
✗ run_1
expected { a: 1 } to equal { b: 2 }
- Failed: expected something else
    at <Jasmine>
`;
    const failures = extractFailuresFromLog(consoleText);
    expect(failures).toHaveLength(1);
    expect(failures[0].failureType).toBe('assertion_failure');
    expect(failures[0].fileName).toBe('specs/api.spec.js');
  });

  it('should handle generic failures', () => {
    const consoleText = `
specs/generic.spec.js(1 failed)
[TASK-123] Generic task
✗ run_1
- Failed: some generic error occurred
    at <Jasmine>
`;
    const failures = extractFailuresFromLog(consoleText);
    expect(failures).toHaveLength(1);
    expect(failures[0].failureType).toBe('generic_failure');
    expect(failures[0].failureMsg).toBe('some generic error occurred');
  });
});
