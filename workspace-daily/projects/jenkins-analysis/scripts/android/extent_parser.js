/**
 * ExtentParser Module for Android CI (v2 — robust Extent Reports v4 parsing)
 *
 * Extent Reports v4 embeds all test data in a <script> block as a JS assignment.
 * The exact variable name / format varies across Extent versions:
 *
 *   - Modern v4:  testData = { report: { testList: [...] } }   (window.testData or plain var)
 *   - Older v4:   var testData = [...]
 *   - v3 compat:  window.TESTS = [...]
 *
 * Strategy (with fallbacks in order):
 *   1. Extract JSON from embedded <script> — covers all v4 variants
 *   2. JUnit API fallback (caller must set options.junitFallback = async fn)
 *   3. Regex HTML block extraction as last resort
 */

'use strict';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Strip HTML tags and collapse whitespace */
const cleanDetails = (str) => {
  if (!str) return '';
  return String(str).replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
};

/** Pull text from <pre> or raw text in a details string */
const extractPlainText = (str) => cleanDetails(str);

// ---------------------------------------------------------------------------
// JSON payload extraction — handles all known Extent v4 variants
// ---------------------------------------------------------------------------

/**
 * Try to pull a JSON string from the raw HTML source.
 * Returns parsed JS object or null.
 */
const extractJsonPayload = (html) => {
  // Pattern set: each entry is [description, regex, groupIndex]
  const patterns = [
    // v4 modern: testData = { report: { testList: [...] } }
    ['window.testData assignment (object)',
      /(?:window\.testData|var\s+testData|let\s+testData|const\s+testData)\s*=\s*(\{[\s\S]*?\});\s*(?:\/\/|<\/script)/i,
      1],
    // v4 array form: var testData = [ ... ]
    ['var testData array',
      /(?:window\.testData|var\s+testData|let\s+testData|const\s+testData)\s*=\s*(\[[\s\S]*?\]);\s*(?:\/\/|<\/script)/i,
      1],
    // window.TESTS = [...]
    ['window.TESTS',
      /window\.TESTS\s*=\s*(\[[\s\S]*?\]);\s*(?:\/\/|<\/script)/i,
      1],
    // Catch-all: any large JSON array assigned to a var in a script block
    ['generic var = [...] in script',
      /<script[^>]*>\s*(?:var|let|const)\s+\w+\s*=\s*(\[[\s\S]{500,}\])\s*;<\/script>/i,
      1],
  ];

  for (const [label, re, group] of patterns) {
    const m = html.match(re);
    if (!m || !m[group]) continue;
    try {
      // Remove trailing commas before ] or } which make JSON.parse choke
      const cleaned = m[group]
        .replace(/,\s*([}\]])/g, '$1');
      return JSON.parse(cleaned);
    } catch (e) {
      // Try again with a more relaxed extraction — take everything up to the last }
      try {
        const raw = m[group];
        const lastClose = Math.max(raw.lastIndexOf('}'), raw.lastIndexOf(']'));
        if (lastClose > 0) {
          const trimmed = raw.slice(0, lastClose + 1).replace(/,\s*([}\]])/g, '$1');
          return JSON.parse(trimmed);
        }
      } catch (_) { /* fall through */ }
    }
  }
  return null;
};

// ---------------------------------------------------------------------------
// Parse standard Extent v4 JSON structures → ExtentTestResult[]
// ---------------------------------------------------------------------------

/**
 * Walk one test node and build an ExtentTestResult.
 * Handles both flat arrays of tests and nested suite > test structures.
 */
const parseTestNode = (node) => {
  const status = String(node.status || node.result || '').toLowerCase();
  const isFail = status === 'fail' || status === 'failed';

  let tcId = null;
  let configUrl = null;
  let failedStepName = null;
  let failedStepDetails = null;

  // Logs can be under .logs, .nodes, .children, .steps
  const rawLogs = node.logs || node.steps || node.nodes || node.children || [];
  const logs = Array.isArray(rawLogs) ? rawLogs : [];

  for (const log of logs) {
    const detailsRaw = log.details || log.description || log.body || '';
    const details = cleanDetails(detailsRaw);
    const name = String(log.name || log.stepName || log.status || '');
    const logStatus = String(log.status || '').toLowerCase();

    // TC ID
    if (!tcId) {
      const m = details.match(/Rally\s+TC\s+id\s*=\s*(TC\d+)/i)
             || details.match(/TC\s+id\s*=\s*(TC\d+)/i);
      if (m) tcId = m[1];
    }

    // Config URL
    if (!configUrl) {
      const m = details.match(/Config\s+url\s*=\s*([^\s<"']+)/i);
      if (m) configUrl = m[1];
    }

    // First failing step
    if (isFail && !failedStepDetails && logStatus === 'fail') {
      failedStepName = name || null;
      failedStepDetails = details || null;
    }
  }

  // Sometimes TC ID is directly on the node name or description
  if (!tcId) {
    const src = [node.name, node.description, node.fullName].filter(Boolean).join(' ');
    const m = src.match(/Rally\s+TC\s+id\s*=\s*(TC\d+)/i)
           || src.match(/TC\s+id\s*=\s*(TC\d+)/i);
    if (m) tcId = m[1];
  }

  // Duration
  const startMs = node.startTime || (node.time && node.time.start) || 0;
  const endMs   = node.endTime   || (node.time && node.time.end)   || 0;

  return {
    testName: String(node.name || node.testName || 'Unknown'),
    status: isFail ? 'FAIL' : 'PASS',
    tcId,
    configUrl,
    failedStepName,
    failedStepDetails,
    executionTimeMs: endMs - startMs,
  };
};

/**
 * Convert any known JSON payload shape to ExtentTestResult[].
 * Handles: object with report.testList, flat array, suite-wrapped array.
 */
const parseJsonPayload = (data) => {
  const results = [];

  // Shape A: { report: { testList: [...] } }
  if (data && data.report && Array.isArray(data.report.testList)) {
    for (const t of data.report.testList) {
      results.push(parseTestNode(t));
    }
    return results;
  }

  // Shape B: flat array [{ name, status, logs, ... }, ...]
  if (Array.isArray(data)) {
    for (const item of data) {
      // If item looks like a suite (has .tests or .children with sub-nodes)
      const subTests = item.tests || item.children || item.nodes;
      if (Array.isArray(subTests) && subTests.length > 0 && subTests[0].status !== undefined) {
        for (const t of subTests) results.push(parseTestNode(t));
      } else {
        results.push(parseTestNode(item));
      }
    }
    return results;
  }

  return results;
};

// ---------------------------------------------------------------------------
// Fallback: naive HTML regex extraction
// ---------------------------------------------------------------------------

const fallbackHtmlExtraction = (html) => {
  const results = [];

  // Look for rally TC id comments scattered in page to at least get test names + TC IDs
  const tcBlocks = [...html.matchAll(/Rally\s+TC\s+id\s*=\s*(TC\d+)/gi)];
  if (tcBlocks.length === 0) return results;

  // For each TC ID occurrence, grab surrounding context
  for (const m of tcBlocks) {
    const start = Math.max(0, m.index - 500);
    const block = html.slice(start, m.index + 500);

    const tcId = m[1];
    const nameMatch = block.match(/class="test-name[^"]*">\s*([^<]+)</)
                   || block.match(/data-test-name="([^"]+)"/);
    const testName = nameMatch ? nameMatch[1].trim() : `Test_${tcId}`;

    // Determine if failed by looking for fail status near this block
    const isFail = /status[=\s"']+fail/i.test(block);

    let failedStepName = null;
    let failedStepDetails = null;

    if (isFail) {
      const rowMatch = block.match(/<tr[^>]*status[=\s"']+fail[^>]*>([\s\S]*?)<\/tr>/i);
      if (rowMatch) {
        const cells = [...rowMatch[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)];
        if (cells.length >= 2) {
          failedStepName = cleanDetails(cells[cells.length - 2]?.[1] || '');
          failedStepDetails = cleanDetails(cells[cells.length - 1]?.[1] || '');
        }
      }
    }

    results.push({
      testName,
      status: isFail ? 'FAIL' : 'PASS',
      tcId,
      configUrl: null,
      failedStepName,
      failedStepDetails,
      executionTimeMs: 0,
    });
  }

  return results;
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Extract test results from raw ExtentReport HTML source.
 * Tries JSON extraction, then regex fallback.
 *
 * @param {string} htmlSource
 * @returns {ExtentTestResult[]}
 */
const extractTestResultsFromHtml = (htmlSource) => {
  if (!htmlSource || htmlSource.length < 100) return [];

  const payload = extractJsonPayload(htmlSource);
  if (payload !== null) {
    const results = parseJsonPayload(payload);
    if (results.length > 0) return results;
  }

  // JSON extraction yielded nothing — fall back to HTML regex
  console.warn('[ExtentParser] JSON payload not found or empty, using HTML fallback');
  return fallbackHtmlExtraction(htmlSource);
};

/**
 * Discover the ExtentReport subdirectory name (e.g. "newReportVersion2.0")
 * by fetching the Jenkins HTML Publisher directory listing.
 *
 * @param {string} jobName
 * @param {number} buildNum
 * @param {object} jenkinsClient  - must have .fetchRaw(endpoint) → Promise<string>
 * @returns {Promise<string>}
 */
const getReportDirectoryName = async (jobName, buildNum, jenkinsClient) => {
  const listingHtml = await jenkinsClient.fetchRaw(
    `/job/${jobName}/${buildNum}/ExtentReport/`
  );
  // Look for href pointing to a sub-directory (href="something/")
  const match = listingHtml.match(/href="([^">/][^"]*)\/"[^>]*>[^<]*Report/i)
             || listingHtml.match(/href="([^">/][^"]*)\//i);
  return match ? match[1] : 'newReportVersion2.0';
};

/**
 * Fetch and parse the ExtentReport for a given job build.
 *
 * @param {string} jobName
 * @param {number} buildNum
 * @param {object} jenkinsClient
 * @param {object} [options]
 * @param {Function} [options.junitFallback]  - async (jobName, buildNum) => ExtentTestResult[]
 * @returns {Promise<ExtentTestResult[]>}
 */
const parseExtentReport = async (jobName, buildNum, jenkinsClient, options = {}) => {
  let dirName;
  try {
    dirName = await getReportDirectoryName(jobName, buildNum, jenkinsClient);
  } catch (e) {
    console.warn(`[ExtentParser] Could not fetch directory listing for ${jobName}/${buildNum}: ${e.message}`);
    dirName = 'newReportVersion2.0';
  }

  // Try index.html first (HTML Publisher serves this as the entry point)
  const urlsToTry = [
    `/job/${jobName}/${buildNum}/ExtentReport/${dirName}/index.html`,
    `/job/${jobName}/${buildNum}/ExtentReport/${dirName}/`,
    `/job/${jobName}/${buildNum}/ExtentReport/`,
  ];

  for (const url of urlsToTry) {
    try {
      const html = await jenkinsClient.fetchRaw(url);
      if (html && html.length > 500) {
        const results = extractTestResultsFromHtml(html);
        if (results.length > 0) {
          console.log(`[ExtentParser] ${jobName}/${buildNum}: ${results.length} tests extracted from ${url}`);
          return results;
        }
      }
    } catch (e) {
      // try next URL
    }
  }

  // JUnit API fallback
  if (typeof options.junitFallback === 'function') {
    console.warn(`[ExtentParser] Falling back to JUnit API for ${jobName}/${buildNum}`);
    return options.junitFallback(jobName, buildNum);
  }

  console.warn(`[ExtentParser] No test results found for ${jobName}/${buildNum}`);
  return [];
};

module.exports = {
  extractTestResultsFromHtml,
  extractJsonPayload,
  parseJsonPayload,
  getReportDirectoryName,
  parseExtentReport,
};
