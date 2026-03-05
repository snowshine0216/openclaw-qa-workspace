const { expect } = require('@jest/globals');
const { countConsecutiveFailures } = require('../../analysis/history');

describe('History Analysis', () => {
  describe('countConsecutiveFailures', () => {
    it('should return 1 when there are no previous failures', () => {
      // Current build failed (which means count is 1)
      expect(countConsecutiveFailures(10, [])).toBe(1);
    });

    it('should return 2 when previous build failed', () => {
      // current is 10, 9 failed
      expect(countConsecutiveFailures(10, [9])).toBe(2);
    });

    it('should return 3 for 10, 9, 8 failing', () => {
      // current is 10, 9 & 8 failed
      expect(countConsecutiveFailures(10, [9, 8])).toBe(3);
    });

    it('should stop counting when there is a success gap', () => {
      // current is 10, 9 failed, 8 success, 7 failed
      // Should count 10 & 9 = 2 consecutive
      expect(countConsecutiveFailures(10, [9, 7])).toBe(2);
    });

    it('should handle unordered failure arrays properly', () => {
      // even if input is unordered, our logic just does includes:
      // it checks 10-1 (9), 10-2 (8), 10-3 (7).
      expect(countConsecutiveFailures(10, [7, 9, 8])).toBe(4); // 10,9,8,7 failed
    });
  });
});
