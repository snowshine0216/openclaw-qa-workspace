const { 
  heuristicAnalysis, 
  buildAnalysisResult, 
  extractFailureDetails 
} = require('../../analysis/ai_analyzer');

describe('AI Analyzer (Heuristics)', () => {

  describe('heuristicAnalysis', () => {
    it('should classify environment failures', () => {
      const log = 'Some trace... connection refused ... more noise FAILED';
      const result = heuristicAnalysis(log, 'TestJob');
      expect(result.failureCategory).toBe('environment_failure');
      expect(result.isFalseAlarm).toBe(true);
      expect(result.failureType).toBe('Environment Failure');
    });

    it('should classify script failures', () => {
      const log = 'SyntaxError: unexpected token at file.js ERROR';
      const result = heuristicAnalysis(log, 'TestJob');
      expect(result.failureCategory).toBe('script_failure');
      expect(result.isFalseAlarm).toBe(false);
      expect(result.failureType).toBe('Script Failure');
    });

    it('should classify production failures', () => {
      const log = 'Test failed: Element not found on page FAIL';
      const result = heuristicAnalysis(log, 'TestJob');
      expect(result.failureCategory).toBe('production_failure');
      expect(result.isFalseAlarm).toBe(false);
      expect(result.failureType).toBe('Production Failure');
    });

    it('should classify configuration failures', () => {
      const log = 'ERROR: Invalid credentials provided for login';
      const result = heuristicAnalysis(log, 'TestJob');
      expect(result.failureCategory).toBe('configuration_failure');
      expect(result.isFalseAlarm).toBe(true);
      expect(result.failureType).toBe('Configuration Failure');
    });

    it('should classify dependency failures', () => {
      const log = 'Database connection failed during test setup FAIL';
      const result = heuristicAnalysis(log, 'TestJob');
      expect(result.failureCategory).toBe('dependency_failure');
      expect(result.isFalseAlarm).toBe(true);
      expect(result.failureType).toBe('Dependency Failure');
    });

    it('should return unknown for unrecognized patterns', () => {
      const log = 'Just a weird crash with no recognizable keywords';
      const result = heuristicAnalysis(log, 'TestJob');
      expect(result.failureCategory).toBe('unknown');
      expect(result.isFalseAlarm).toBe(false);
      expect(result.failureType).toBe('Unknown Failure');
      expect(result.confidence).toBe('low');
    });
  });

  describe('buildAnalysisResult', () => {
    it('should return correct structure for known categories', () => {
      const result = buildAnalysisResult('script_failure', 'Reason', 'ERROR: msg');
      expect(result).toHaveProperty('actions');
      expect(Array.isArray(result.actions)).toBe(true);
      expect(result.failureCategory).toBe('script_failure');
      expect(result.isFalseAlarm).toBe(false);
    });

    it('should fallback to unknown if category is missing', () => {
      const result = buildAnalysisResult('invalid_category', 'Reason', 'ERROR: msg');
      // The code currently falls back to unknown logic if category is not found
      expect(result.failureCategory).toBe('invalid_category');
      expect(result.failureType).toBe('Unknown Failure');
    });
  });

  describe('extractFailureDetails', () => {
    it('should extract lines with FAIL/ERROR and their context', () => {
      const log = `Line 1
Line 2 ERROR occurs here
Line 3 context
Line 4 context
Line 5 independent`;
      const result = extractFailureDetails(log);
      expect(result).toHaveLength(3);
      expect(result[0]).toBe('Line 2 ERROR occurs here');
      expect(result[1]).toBe('Line 3 context');
      expect(result[2]).toBe('Line 4 context');
    });

    it('should limit to 10 lines of failures', () => {
      const log = Array(20).fill('ERROR line').join('\\n');
      const result = extractFailureDetails(log);
      expect(result.length).toBeLessThanOrEqual(10);
    });
    
    it('should return empty if no failures found', () => {
      expect(extractFailureDetails('All good \\n Nothing bad')).toEqual([]);
    });
  });
});
