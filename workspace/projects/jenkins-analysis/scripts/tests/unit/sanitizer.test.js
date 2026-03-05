const { truncate, sanitizeConsoleLog } = require('../../reporting/sanitizer');

describe('Reporting Sanitizer', () => {
  describe('truncate', () => {
    it('should not truncate short strings', () => {
      expect(truncate('hello', 10)).toBe('hello');
    });

    it('should truncate strings exceeding maxLength', () => {
      expect(truncate('hello world', 5)).toBe('hello...');
    });

    it('should fallback to default length 80', () => {
      const longText = 'a'.repeat(90);
      expect(truncate(longText)).toBe('a'.repeat(80) + '...');
    });

    it('should handle falsy values', () => {
      expect(truncate(null)).toBeNull();
      expect(truncate('')).toBe('');
    });
  });

  describe('sanitizeConsoleLog', () => {
    it('should remove noise patterns and keep useful lines', () => {
      const rawLog = `Useful line 1
[allure-cleaner] scanned 500 files
Useful line 2
[INFO] Automation data: {"metrics": 1}
  at async UserContext.test (file:1:2)
Useful line 3`;
      
      const expected = `Useful line 1
Useful line 2
Useful line 3`;
      expect(sanitizeConsoleLog(rawLog)).toBe(expected);
    });

    it('should keep maxLines only', () => {
      const longLog = Array(60).fill('Valid line').map((v, i) => `${v} ${i}`).join('\n');
      const result = sanitizeConsoleLog(longLog, 5);
      const lines = result.split('\n');
      expect(lines).toHaveLength(5);
      expect(lines[0]).toBe('Valid line 55');
      expect(lines[4]).toBe('Valid line 59');
    });
  });
});
