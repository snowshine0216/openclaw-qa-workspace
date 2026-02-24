const {
  extractFullError,
  extractTestCaseInfo,
  extractScreenshotInfo,
  extractSpectreUrl
} = require('../../parsing/extractors');

describe('Extractors', () => {
  describe('extractFullError', () => {
    it('should extract error from - Failed: until <Jasmine>', () => {
      const runBlock = `Some noise
- Failed: Expected true to be false.
    at userContext (file.js:1:1)
    at <Jasmine>
    more trace`;
      const expected = `- Failed: Expected true to be false.\n    at userContext (file.js:1:1)\n    at <Jasmine>`;
      expect(extractFullError(runBlock)).toBe(expected);
    });

    it('should stop at runMicrotasks', () => {
      const runBlock = `Some noise
- Failed: Expected 1 to be 2.
    at something (file.js:2:2)
    at runMicrotasks
    more things`;
      const expected = `- Failed: Expected 1 to be 2.\n    at something (file.js:2:2)\n    at runMicrotasks`;
      expect(extractFullError(runBlock)).toBe(expected);
    });

    it('should return null if "- Failed:" is not present', () => {
      expect(extractFullError('No failures')).toBeNull();
    });
  });

  describe('extractTestCaseInfo', () => {
    it('should extract standard TC IDs', () => {
      const header = `[TC86139_02] Verify user login`;
      expect(extractTestCaseInfo(header)).toEqual({
        id: 'TC86139_02',
        name: 'Verify user login'
      });
    });

    it('should extract QAC prefixed IDs', () => {
      const header = `[QAC-487_3] Verify logout`;
      expect(extractTestCaseInfo(header)).toEqual({
        id: 'QAC-487_3',
        name: 'Verify logout'
      });
    });

    it('should return null for unmatched headers', () => {
      const header = `Just a weird header`;
      expect(extractTestCaseInfo(header)).toBeNull();
    });
  });

  describe('extractScreenshotInfo', () => {
    it('should extract screenshot info with TC IDs', () => {
      const runBlock = `Testing something
Screenshot "TC86139_02 - Login screen" doesn't match
Error detail`;
      expect(extractScreenshotInfo(runBlock)).toEqual({
        stepId: 'TC86139_02',
        stepName: 'Login screen'
      });
    });

    it('should extract screenshot info with QAC IDs', () => {
      const runBlock = `Screenshot "QAC-123 - Modal popup" doesn't match`;
      expect(extractScreenshotInfo(runBlock)).toEqual({
        stepId: 'QAC-123',
        stepName: 'Modal popup'
      });
    });

    it('should return null if not matched', () => {
      expect(extractScreenshotInfo('No screenshot failure here')).toBeNull();
    });
  });

  describe('extractSpectreUrl', () => {
    it('should extract a valid spectre URL', () => {
      const runBlock = `Something failed
Visit http://spectre-server:3000/projects/1/suites/2/runs/3#test_123 for details`;
      expect(extractSpectreUrl(runBlock)).toBe('http://spectre-server:3000/projects/1/suites/2/runs/3#test_123');
    });

    it('should return null if no url', () => {
      expect(extractSpectreUrl('No URL here')).toBeNull();
    });
  });
});
