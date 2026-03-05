const { deduplicateRetries } = require('../../parsing/deduplication');

describe('Deduplication', () => {
  it('should take the last result if there are retries of the same test in the same file', () => {
    const rawFailures = [
      { fileName: 'login.js', tcId: 'TC-01', runLabel: '1', failureMsg: 'Error 1' },
      { fileName: 'login.js', tcId: 'TC-01', runLabel: '2', failureMsg: 'Error 2' },
      { fileName: 'api.js', tcId: 'TC-02', runLabel: '1', failureMsg: 'Error 3' }
    ];

    const result = deduplicateRetries(rawFailures);
    expect(result).toHaveLength(2);
    expect(result[0].retryCount).toBe(2);
    expect(result[0].failureMsg).toBe('Error 2');
    expect(result[1].retryCount).toBe(1);
  });

  it('should ignore false alarms or passed retries if handled differently (handled upstream)', () => {
    const rawFailures = [
      { fileName: 'test.js', tcId: 'TC-03', runLabel: '1', failureMsg: 'Fail' }
    ];

    const result = deduplicateRetries(rawFailures);
    expect(result).toHaveLength(1);
    expect(result[0].retryCount).toBe(1);
  });
});
