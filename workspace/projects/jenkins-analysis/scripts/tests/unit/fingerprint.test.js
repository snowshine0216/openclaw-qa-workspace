const { buildFingerprint } = require('../../analysis/fingerprint');

describe('Fingerprint', () => {
  it('should generate a deterministic hash', () => {
    const hash1 = buildFingerprint('file1', 'TC1', 'S1', 'Step1', 'error');
    const hash2 = buildFingerprint('file1', 'TC1', 'S1', 'Step1', 'error');
    expect(hash1).toBe(hash2);
    expect(hash1).toHaveLength(64); // sha256 output is 64 hex chars
  });

  it('should generate different hashes for different inputs', () => {
    const hash1 = buildFingerprint('file1', 'TC1', 'S1', 'Step1', 'error');
    const hash2 = buildFingerprint('file2', 'TC1', 'S1', 'Step1', 'error');
    expect(hash1).not.toBe(hash2);
  });
});
