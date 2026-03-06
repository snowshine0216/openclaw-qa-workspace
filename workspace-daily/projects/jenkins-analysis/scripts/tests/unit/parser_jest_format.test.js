const { extractFailuresFromLogJest } = require('../../parsing/parser');

describe('Parser - extractFailuresFromLogJest', () => {
  it('parses Jest assertion failures with TC metadata', () => {
    const consoleText = `
FAIL specs/auth/login.spec.js
  Login flow
    ✕ [TC7001] logs in with valid credentials (35 ms)

  ● Login flow > [TC7001] logs in with valid credentials

    expect(received).toEqual(expected)
    Expected: "Dashboard"
    Received: "Error"
      at Object.<anonymous> (specs/auth/login.spec.js:10:5)
`;

    const failures = extractFailuresFromLogJest(consoleText);

    expect(failures).toHaveLength(1);
    expect(failures[0]).toMatchObject({
      fileName: 'specs/auth/login.spec.js',
      tcId: 'TC7001',
      tcName: 'logs in with valid credentials',
      stepId: 'TC7001',
      stepName: 'logs in with valid credentials',
      failureType: 'assertion_failure',
      retryCount: 1
    });
    expect(failures[0].failureMsg).toContain('expect(received)');
  });

  it('parses Jest screenshot mismatch and extracts snapshot URL', () => {
    const consoleText = `
FAIL specs/report/grid.spec.js
  Grid view
    ✕ [TC86139_02] login screen visual check (42 ms)

  ● Grid view > [TC86139_02] login screen visual check

    Error: Screenshot "TC86139_02 - Login screen" doesn't match the baseline.
    Visit http://spectre-server:3000/projects/1/suites/2/runs/3#test_123 for details
      at Object.<anonymous> (specs/report/grid.spec.js:17:3)
`;

    const failures = extractFailuresFromLogJest(consoleText);

    expect(failures).toHaveLength(1);
    expect(failures[0]).toMatchObject({
      fileName: 'specs/report/grid.spec.js',
      tcId: 'TC86139_02',
      stepId: 'TC86139_02',
      stepName: 'Login screen',
      failureType: 'screenshot_mismatch',
      snapshotUrl: 'http://spectre-server:3000/projects/1/suites/2/runs/3#test_123'
    });
  });

  it('deduplicates repeated Jest failures as retries', () => {
    const consoleText = `
FAIL specs/retries/retry.spec.js
  Retry behavior
    ✕ [TC9001] retries are merged (20 ms)
    ✕ [TC9001] retries are merged (31 ms)

  ● Retry behavior > [TC9001] retries are merged

    Error: first failure
      at Object.<anonymous> (specs/retries/retry.spec.js:8:2)

  ● Retry behavior > [TC9001] retries are merged

    Error: second failure
      at Object.<anonymous> (specs/retries/retry.spec.js:9:2)
`;

    const failures = extractFailuresFromLogJest(consoleText);

    expect(failures).toHaveLength(1);
    expect(failures[0].retryCount).toBe(2);
    expect(failures[0].failureMsg.toLowerCase()).toContain('failure');
  });

  it('maps each failed case to its own detail block when multiple cases fail', () => {
    const consoleText = `
FAIL specs/multi/multi-fail.spec.js
  Multi failure suite
    ✕ [TC1001] first case fails (11 ms)
    ✕ [TC1002] second case fails (12 ms)

  ● Multi failure suite > [TC1001] first case fails

    expect(received).toEqual(expected)
    Expected: "A"
    Received: "B"
      at Object.<anonymous> (specs/multi/multi-fail.spec.js:10:5)

  ● Multi failure suite > [TC1002] second case fails

    Error: Timeout exceeded after 30000 ms
      at Object.<anonymous> (specs/multi/multi-fail.spec.js:20:7)
`;

    const failures = extractFailuresFromLogJest(consoleText);

    expect(failures).toHaveLength(2);

    const first = failures.find((item) => item.tcId === 'TC1001');
    const second = failures.find((item) => item.tcId === 'TC1002');

    expect(first.failureMsg).toContain('expect(received).toEqual(expected)');
    expect(first.failureType).toBe('assertion_failure');
    expect(second.failureMsg).toContain('Timeout exceeded');
    expect(second.failureType).toBe('timeout');
  });
});
