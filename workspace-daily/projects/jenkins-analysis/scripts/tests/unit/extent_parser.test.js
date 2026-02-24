'use strict';
/**
 * Unit tests for android/extent_parser.js (Jest format)
 */

const { extractJsonPayload, parseJsonPayload, extractTestResultsFromHtml } =
  require('../../../scripts/android/extent_parser');

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const MODERN_SHAPE = {
  report: {
    testList: [
      {
        name: '06_GM_NGM_PositionCustomize',
        status: 'fail',
        logs: [
          { name: 'setup',      status: 'pass', details: 'Rally TC id=TC79556\nConfig url = dossier://test' },
          { name: 'screenshot', status: 'fail', details: 'Screenshot comparison failed: image does not match baseline' },
        ],
      },
      { name: '01_OpenDossier', status: 'pass', logs: [] },
    ],
  },
};

const ARRAY_SHAPE = [
  {
    name: '07_GM_PositionFix',
    status: 'fail',
    logs: [
      { name: 'init',      status: 'pass', details: 'Rally TC id=TC79557' },
      { name: 'runScript', status: 'fail', details: 'NoSuchElementException: Cannot find element by id' },
    ],
  },
];

const buildHtmlModern = (data) =>
  `<html><body><script>\nwindow.testData = ${JSON.stringify(data)};\n</script></body></html>`;

const buildHtmlArray = (data) =>
  `<html><body><script>\nvar testData = ${JSON.stringify(data)};\n</script></body></html>`;

const HTML_NO_JSON = `<html><body><div class="test-item FAIL"><!-- Rally TC id=TC99999 --></div></body></html>`;

// ---------------------------------------------------------------------------
// extractJsonPayload
// ---------------------------------------------------------------------------

describe('extractJsonPayload', () => {
  test('extracts window.testData (object) from HTML', () => {
    const result = extractJsonPayload(buildHtmlModern(MODERN_SHAPE));
    expect(result).not.toBeNull();
    expect(result.report).toBeDefined();
    expect(Array.isArray(result.report.testList)).toBe(true);
    expect(result.report.testList.length).toBe(2);
  });

  test('extracts var testData (array) from HTML', () => {
    const result = extractJsonPayload(buildHtmlArray(ARRAY_SHAPE));
    expect(result).not.toBeNull();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(1);
  });

  test('returns null for HTML without JSON payload', () => {
    expect(extractJsonPayload('<html><body>No script</body></html>')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// parseJsonPayload
// ---------------------------------------------------------------------------

describe('parseJsonPayload', () => {
  test('parses modern shape { report: { testList } }', () => {
    const results = parseJsonPayload(MODERN_SHAPE);
    expect(results.length).toBe(2);

    const fail = results.find(r => r.testName.includes('PositionCustomize'));
    expect(fail).toBeDefined();
    expect(fail.status).toBe('FAIL');
    expect(fail.tcId).toBe('TC79556');
    expect(fail.failedStepName).toBe('screenshot');
    expect(fail.failedStepDetails).toContain('does not match');

    const pass = results.find(r => r.testName.includes('OpenDossier'));
    expect(pass).toBeDefined();
    expect(pass.status).toBe('PASS');
  });

  test('parses flat array shape', () => {
    const results = parseJsonPayload(ARRAY_SHAPE);
    expect(results.length).toBe(1);
    expect(results[0].status).toBe('FAIL');
    expect(results[0].tcId).toBe('TC79557');
    expect(results[0].failedStepName).toBe('runScript');
    expect(results[0].failedStepDetails).toContain('NoSuchElementException');
  });

  test('returns empty array for unexpected shape', () => {
    expect(parseJsonPayload({ foo: 'bar' })).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// extractTestResultsFromHtml
// ---------------------------------------------------------------------------

describe('extractTestResultsFromHtml', () => {
  test('correctly parses HTML with window.testData (modern shape)', () => {
    const results = extractTestResultsFromHtml(buildHtmlModern(MODERN_SHAPE));
    expect(results.length).toBe(2);
    expect(results.find(r => r.status === 'FAIL').tcId).toBe('TC79556');
  });

  test('correctly parses HTML with var testData array', () => {
    const results = extractTestResultsFromHtml(buildHtmlArray(ARRAY_SHAPE));
    expect(results.length).toBe(1);
    expect(results[0].tcId).toBe('TC79557');
  });

  test('returns empty array for empty input', () => {
    expect(extractTestResultsFromHtml('')).toHaveLength(0);
    expect(extractTestResultsFromHtml(null)).toHaveLength(0);
  });

  test('falls back to HTML regex when no JSON found (no throw)', () => {
    expect(() => extractTestResultsFromHtml(HTML_NO_JSON)).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// TC ID edge cases
// ---------------------------------------------------------------------------

describe('TC ID extraction edge cases', () => {
  test('extracts TC ID from "Rally TC id=TC12345"', () => {
    const data = {
      report: {
        testList: [{
          name: 'SomeTest', status: 'fail',
          logs: [{ name: 'init', status: 'pass', details: 'Rally TC id=TC12345' }],
        }],
      },
    };
    const [result] = parseJsonPayload(data);
    expect(result.tcId).toBe('TC12345');
  });

  test('handles test with no TC ID (returns null)', () => {
    const data = { report: { testList: [{ name: 'NoTcTest', status: 'pass', logs: [] }] } };
    const [result] = parseJsonPayload(data);
    expect(result.tcId).toBeNull();
  });
});
