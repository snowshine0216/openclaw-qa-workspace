const {
  parseSpectreData,
  parseSpectreUrl,
  classifySpectreResult
} = require('../../analysis/spectre');

describe('Spectre Analysis', () => {
  describe('parseSpectreUrl', () => {
    it('should extract project, suite, run, and test IDs', () => {
      const url = 'http://10.23.33.4:3000/projects/MSTR/suites/Auto/runs/456#test_789';
      const result = parseSpectreUrl(url);
      expect(result).toEqual({ project: 'MSTR', suite: 'Auto', runId: 456, testId: 789 });
    });

    it('should return null for invalid URLs', () => {
      expect(parseSpectreUrl('invalid_url')).toBeNull();
      expect(parseSpectreUrl(undefined)).toBeNull();
    });
  });

  describe('classifySpectreResult', () => {
    it('should handle missing data', () => {
      const result = classifySpectreResult(null);
      expect(result).toEqual({ verified: 0, falseAlarm: 0, reason: "Spectre data unavailable" });
    });

    it('should classify passed tests as false alarms', () => {
      const result = classifySpectreResult({ pass: true, diff: 0, diff_threshold: 0.1 });
      expect(result).toEqual({ verified: 2, falseAlarm: 1, reason: "Spectre pass=true — baseline already updated or test fluke" });
    });

    it('should classify below 1% diff as false alarm', () => {
      const result = classifySpectreResult({ pass: false, diff: 0.5, diff_threshold: 0.1 });
      expect(result).toEqual({ verified: 2, falseAlarm: 1, reason: "diff=0.5% below 1% margin — likely cosmetic noise" });
    });

    it('should classify diff exceeding threshold as confirmed regression', () => {
      const result = classifySpectreResult({ pass: false, diff: 2.5, diff_threshold: 0.1 });
      expect(result).toEqual({ verified: 1, falseAlarm: 0, reason: "diff=2.5% exceeds threshold 0.1% — confirmed visual regression" });
    });

    it('should classify diff between threshold and 1% as false alarm', () => {
      const result = classifySpectreResult({ pass: false, diff: 0.8, diff_threshold: 0.1 });
      expect(result).toEqual({ verified: 2, falseAlarm: 1, reason: "diff=0.8% below 1% margin — likely cosmetic noise" });
    });
  });

  describe('parseSpectreData', () => {
    it('should parse valid HTML correctly', () => {
      const html = `
        <div id="test_123">
          <span class="test__name">Login Form</span>
          <a class="test__image" href="baseline.png"></a>
          <a class="test__image" href="actual.png"></a>
          <a class="test__image" href="diff.png"></a>
          <div class="test--failed"></div>
          <div>2.5% difference</div>
          <div>0.1% tolerance</div>
        </div>
      `;
      const result = parseSpectreData(html, '123');
      expect(result).toEqual({
        id: '123',
        name: 'Login Form',
        diff: 2.5,
        diff_threshold: 0.1,
        pass: false,
        baselineUrl: 'baseline.png',
        actualUrl: 'actual.png',
        diffUrl: 'diff.png' // note the implementation actually takes them in order
      });
    });

    it('should return null if test block is not found', () => {
      expect(parseSpectreData('<html></html>', '999')).toBeNull();
    });
  });
});
