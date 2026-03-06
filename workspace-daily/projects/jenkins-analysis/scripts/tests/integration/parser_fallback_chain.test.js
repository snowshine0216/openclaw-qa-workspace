const { extractFailuresFromLog } = require('../../parsing/parser');

describe('Parser integration - fallback chain', () => {
  it('uses the Jest parser before legacy fallback when FAIL blocks exist', () => {
    const consoleText = `
Random preamble
FAIL specs/integration/jest-format.spec.js
  Parser fallback
    ✕ [QAC-501] parses Jest fallback format (15 ms)

  ● Parser fallback > [QAC-501] parses Jest fallback format

    expect(received).toContain(expected)
    Expected substring: "OK"
    Received string: "ERROR"
`;

    const failures = extractFailuresFromLog(consoleText);

    expect(failures).toHaveLength(1);
    expect(failures[0]).toMatchObject({
      fileName: 'specs/integration/jest-format.spec.js',
      tcId: 'QAC-501',
      stepId: 'QAC-501',
      failureType: 'assertion_failure'
    });
  });
});
