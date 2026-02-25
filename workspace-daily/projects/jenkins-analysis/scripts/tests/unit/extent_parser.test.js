'use strict';
/**
 * Unit tests for android/extent_parser.js
 *
 * Covers:
 *  - Extent v3 static HTML parsing (primary path — real format)
 *  - extractReportPath: tab value → URL resolution
 *  - Extent v4 JSON payload parsing (secondary path)
 *  - TC ID / Config URL / failed step extraction
 *  - Empty / null input handling
 */

const {
  extractTestResultsFromHtml,
  extractJsonPayload,
  parseJsonPayload,
  extractReportPath,
} = require('../../../scripts/android/extent_parser');

// ---------------------------------------------------------------------------
// Fixtures — Extent v3 static HTML
// ---------------------------------------------------------------------------

/**
 * Minimal Extent v3 HTML with one FATAL test (has TC ID, config URL, failed step)
 * and one passing test. Matches the actual structure of Library_RSD_MultiMedia.
 */
const V3_HTML_MIXED = `
<!DOCTYPE html>
<html>
<body class='extent standard'>
<ul class='collection test-list'>

  <li class='collection-item test displayed active fatal' extentid='aaa-111'>
    <div class='test-head'>
      <span class='test-name'>DossierRSDMultiMedia07PanelStack </span>
      <span class='test-status label right capitalize outline fatal'>fatal</span>
    </div>
    <div class='test-body'>
      <table><tbody>
        <tr>
          <td class='status info' title='info'></td>
          <td class='timestamp'>08:52:47</td>
          <td class='step-name'>DossierRSDMultiMedia07PanelStack</td>
          <td class='step-details'>DossierRSDMultiMedia07PanelStack starts!<br/>
          Rally TC id=TC18072<br/>Config url = dossier://test?id=abc<br/>AuthMode = Standard<br/></td>
        </tr>
        <tr>
          <td class='status fatal' title='fatal'></td>
          <td class='timestamp'>08:52:49</td>
          <td class='step-name'>screenshot</td>
          <td class='step-details'>java.lang.RuntimeException: screenshot comparison failed<br/>at com.mstr.test</td>
        </tr>
      </tbody></table>
    </div>
  </li>

  <li class='collection-item test displayed active pass' extentid='bbb-222'>
    <div class='test-head'>
      <span class='test-name'>DossierRSDMultiMedia01Rendering </span>
      <span class='test-status label right capitalize outline pass'>pass</span>
    </div>
    <div class='test-body'>
      <table><tbody>
        <tr>
          <td class='status pass' title='pass'></td>
          <td class='timestamp'>08:53:00</td>
          <td class='step-name'>DossierRSDMultiMedia01Rendering</td>
          <td class='step-details'>Rally TC id=TC18073<br/>All steps passed</td>
        </tr>
      </tbody></table>
    </div>
  </li>

</ul>
</body>
</html>
`;

/** Only failing tests — two with different TC IDs */
const V3_HTML_TWO_FAILS = `
<html><body class='extent standard'>
<ul class='collection test-list'>
  <li class='collection-item test displayed active fail' extentid='c1'>
    <span class='test-name'>Test_Alpha</span>
    <table><tbody>
      <tr>
        <td class='status info'></td><td class='step-name'>init</td>
        <td class='step-details'>Rally TC id=TC99001<br/>Config url = dossier://alpha</td>
      </tr>
      <tr>
        <td class='status fail'></td><td class='step-name'>assertScreen</td>
        <td class='step-details'>Screenshot mismatch at step assertScreen</td>
      </tr>
    </tbody></table>
  </li>
  <li class='collection-item test displayed active fail' extentid='c2'>
    <span class='test-name'>Test_Beta</span>
    <table><tbody>
      <tr>
        <td class='status info'></td><td class='step-name'>setup</td>
        <td class='step-details'>Rally TC id=TC99002</td>
      </tr>
      <tr>
        <td class='status fail'></td><td class='step-name'>clickButton</td>
        <td class='step-details'>NoSuchElementException: button not found</td>
      </tr>
    </tbody></table>
  </li>
</ul>
</body></html>
`;

/** No test-list — should return empty or fall through to TC scan */
const V3_HTML_NO_TESTS = `<html><body class='extent standard'><p>No tests ran</p></body></html>`;

// ---------------------------------------------------------------------------
// Fixtures — Jenkins HTML Publisher directory listing
// ---------------------------------------------------------------------------

const LISTING_FLAT_FILE = `
<ul id="tabnav">
  <li id="tab1" value="newReportVersion2.0.html">newReportVersion2.0</li>
</ul>`;

const LISTING_SUBDIR = `
<ul id="tabnav">
  <li id="tab1" value="newReportVersion2.0/index.html">newReportVersion2.0</li>
</ul>`;

const LISTING_EMPTY = `<ul id="tabnav"></ul>`;

// ---------------------------------------------------------------------------
// Fixtures — Extent v4 JSON SPA (secondary path)
// ---------------------------------------------------------------------------

const V4_MODERN = {
  report: {
    testList: [
      {
        name: 'V4_FailTest', status: 'fail',
        logs: [
          { name: 'init',       status: 'pass', details: 'Rally TC id=TC12345' },
          { name: 'runScript',  status: 'fail', details: 'Assertion failed: expected true' },
        ],
      },
      { name: 'V4_PassTest', status: 'pass', logs: [] },
    ],
  },
};

const buildV4Html = (data) =>
  `<html><body><script>\nwindow.testData = ${JSON.stringify(data)};\n</script></body></html>`;

// ---------------------------------------------------------------------------
// Test runner
// ---------------------------------------------------------------------------

describe('extractReportPath', () => {
  test('extracts flat filename (newReportVersion2.0.html)', () => {
    const { file, dir } = extractReportPath(LISTING_FLAT_FILE);
    expect(file).toBe('newReportVersion2.0.html');
    expect(dir).toBeNull();
  });

  test('extracts subdirectory path (newReportVersion2.0/index.html)', () => {
    const { file, dir } = extractReportPath(LISTING_SUBDIR);
    expect(file).toBe('newReportVersion2.0/index.html');
    expect(dir).toBe('newReportVersion2.0');
  });

  test('returns nulls for empty listing', () => {
    const { file, dir } = extractReportPath(LISTING_EMPTY);
    expect(file).toBeNull();
    expect(dir).toBeNull();
  });
});

// ---------------------------------------------------------------------------

describe('extractTestResultsFromHtml — Extent v3 static HTML', () => {
  test('correctly finds 2 tests (1 fatal, 1 pass)', () => {
    const results = extractTestResultsFromHtml(V3_HTML_MIXED);
    expect(results.length).toBe(2);
  });

  test('fatal test has status FAIL', () => {
    const results = extractTestResultsFromHtml(V3_HTML_MIXED);
    const fail = results.find(r => r.testName.includes('PanelStack'));
    expect(fail).toBeDefined();
    expect(fail.status).toBe('FAIL');
  });

  test('pass test has status PASS', () => {
    const results = extractTestResultsFromHtml(V3_HTML_MIXED);
    const pass = results.find(r => r.testName.includes('Rendering'));
    expect(pass).toBeDefined();
    expect(pass.status).toBe('PASS');
  });

  test('extracts TC ID from step-details', () => {
    const results = extractTestResultsFromHtml(V3_HTML_MIXED);
    const fail = results.find(r => r.status === 'FAIL');
    expect(fail.tcId).toBe('TC18072');
  });

  test('extracts Config URL from step-details', () => {
    const results = extractTestResultsFromHtml(V3_HTML_MIXED);
    const fail = results.find(r => r.status === 'FAIL');
    expect(fail.configUrl).toBe('dossier://test?id=abc');
  });

  test('captures first failing step name', () => {
    const results = extractTestResultsFromHtml(V3_HTML_MIXED);
    const fail = results.find(r => r.status === 'FAIL');
    expect(fail.failedStepName).toBe('screenshot');
  });

  test('captures failing step details text', () => {
    const results = extractTestResultsFromHtml(V3_HTML_MIXED);
    const fail = results.find(r => r.status === 'FAIL');
    expect(fail.failedStepDetails).toContain('RuntimeException');
  });

  test('handles two failing tests independently', () => {
    const results = extractTestResultsFromHtml(V3_HTML_TWO_FAILS);
    expect(results.length).toBe(2);
    expect(results[0].tcId).toBe('TC99001');
    expect(results[0].failedStepName).toBe('assertScreen');
    expect(results[1].tcId).toBe('TC99002');
    expect(results[1].failedStepName).toBe('clickButton');
  });

  test('returns empty array for HTML with no test-list', () => {
    // v3 parse returns empty → falls through to TC scan → also empty
    const results = extractTestResultsFromHtml(V3_HTML_NO_TESTS);
    expect(results.length).toBe(0);
  });

  test('returns empty array for null / empty input', () => {
    expect(extractTestResultsFromHtml(null)).toHaveLength(0);
    expect(extractTestResultsFromHtml('')).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------

describe('extractTestResultsFromHtml — Extent v4 JSON (secondary path)', () => {
  test('falls through to v4 JSON when no v3 test-list present', () => {
    const html = buildV4Html(V4_MODERN);
    // v3 parse → 0 results (no collection-item test); v4 JSON → 2 results
    const results = extractTestResultsFromHtml(html);
    expect(results.length).toBe(2);
  });

  test('v4 path extracts TC ID from logs', () => {
    const html    = buildV4Html(V4_MODERN);
    const results = extractTestResultsFromHtml(html);
    const fail    = results.find(r => r.status === 'FAIL');
    expect(fail.tcId).toBe('TC12345');
  });
});

// ---------------------------------------------------------------------------

describe('extractJsonPayload', () => {
  test('extracts window.testData object', () => {
    const html   = buildV4Html(V4_MODERN);
    const result = extractJsonPayload(html);
    expect(result).not.toBeNull();
    expect(result.report.testList.length).toBe(2);
  });

  test('returns null when no JSON payload present', () => {
    expect(extractJsonPayload('<html><body>no script</body></html>')).toBeNull();
  });
});

// ---------------------------------------------------------------------------

describe('parseJsonPayload', () => {
  test('handles { report: { testList } } shape', () => {
    const results = parseJsonPayload(V4_MODERN);
    expect(results.length).toBe(2);
    expect(results.find(r => r.status === 'FAIL').failedStepName).toBe('runScript');
  });

  test('handles flat array shape', () => {
    const data = [{ name: 'ArrTest', status: 'fail', logs: [] }];
    expect(parseJsonPayload(data)).toHaveLength(1);
  });

  test('returns empty for unknown shape', () => {
    expect(parseJsonPayload({ unknown: true })).toHaveLength(0);
  });
});
