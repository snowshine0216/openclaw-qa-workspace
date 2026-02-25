'use strict';
/**
 * ExtentParser Module — supports Extent Reports v3 (static HTML) and v4 (JS SPA)
 *
 * Extent v3 (this project's format) embeds data as rendered HTML:
 *   <li class='collection-item test fatal|pass|fail' ...>
 *     <span class='test-name'>TestName</span>
 *     <tr><td class='status fail'>...</td><td class='step-name'>...</td><td class='step-details'>Rally TC id=TC##### ...</td></tr>
 *
 * Extent v4 SPA embeds data as JSON in a <script> tag (kept as fallback).
 *
 * Strategy (in order):
 *   1. cheerio-based HTML parse (fast, handles v3 and any static HTML variant)
 *   2. JSON payload extraction (v4 SPA)
 *   3. Raw text regex fallback (TC ID scan)
 */

const cheerio = require('cheerio');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const stripHtml  = (s) => String(s || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const FAIL_STATUSES = new Set(['fail', 'fatal', 'error']);
const isFail = (status) => FAIL_STATUSES.has(String(status || '').toLowerCase());

// ---------------------------------------------------------------------------
// Extent v3 parser (cheerio — static rendered HTML)
// ---------------------------------------------------------------------------

/**
 * Parse Extent v3/legacy static HTML report.
 * Returns ExtentTestResult[] or empty array when not applicable.
 */
const parseV3Html = (html) => {
  if (!html || !html.includes('collection-item test')) return [];

  const $ = cheerio.load(html, { xmlMode: false });
  const results = [];

  $("li.collection-item.test").each((_, testEl) => {
    const $test = $(testEl);

    // Status from the li class list: 'collection-item test displayed active fatal '
    const rawClasses = $test.attr('class') || '';
    const statusWord = rawClasses.trim().split(/\s+/).find(c => isFail(c) || c === 'pass') || 'unknown';
    const testStatus  = isFail(statusWord) ? 'FAIL' : statusWord === 'pass' ? 'PASS' : 'UNKNOWN';

    // Test name
    const testName = $test.find('.test-name').first().text().trim() || 'Unknown';

    let tcId           = null;
    let configUrl      = null;
    let failedStepName = null;
    let failedDetails  = null;

    // Walk each step row
    $test.find('tr').each((_, rowEl) => {
      const $row     = $(rowEl);
      const stCls    = $row.find('td[class*="status"]').attr('class') || '';
      const rowFail  = stCls.split(/\s+/).some(c => isFail(c));

      const detailsRaw = $row.find("td.step-details").html() || '';
      if (!detailsRaw) return; // skip rows without step-details

      // Normalise: <br/> → newlines, strip remaining tags
      const details = detailsRaw
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .trim();

      // Extract TC ID (first occurrence wins)
      if (!tcId) {
        const m = details.match(/Rally\s+TC\s+id\s*=?\s*(TC\d+)/i);
        if (m) tcId = m[1];
      }

      // Extract Config URL (first occurrence wins)
      if (!configUrl) {
        const m = details.match(/Config\s+url\s*=\s*(\S+)/i);
        if (m) configUrl = m[1];
      }

      // Capture the first failing step
      if (rowFail && !failedStepName) {
        failedStepName = $row.find("td.step-name").text().trim() || null;
        failedDetails  = details.slice(0, 500);
      }
    });

    results.push({
      testName,
      status:           testStatus,
      tcId,
      configUrl,
      failedStepName,
      failedStepDetails: failedDetails,
      executionTimeMs:   0,
    });
  });

  return results;
};

// ---------------------------------------------------------------------------
// Extent v4 JSON extraction (kept as secondary path)
// ---------------------------------------------------------------------------

const extractJsonPayload = (html) => {
  const patterns = [
    /(?:window\.testData|var\s+testData|let\s+testData|const\s+testData)\s*=\s*(\{[\s\S]*?\});\s*(?:\/\/|<\/script>)/i,
    /(?:window\.testData|var\s+testData|let\s+testData|const\s+testData)\s*=\s*(\[[\s\S]*?\]);\s*(?:\/\/|<\/script>)/i,
    /window\.TESTS\s*=\s*(\[[\s\S]*?\]);\s*(?:\/\/|<\/script>)/i,
  ];

  for (const re of patterns) {
    const m = html.match(re);
    if (!m) continue;
    try {
      return JSON.parse(m[1].replace(/,\s*([}\]])/g, '$1'));
    } catch (_) { /* try next */ }
  }
  return null;
};

const parseTestNode = (node) => {
  const status  = String(node.status || node.result || '').toLowerCase();
  const rawLogs = node.logs || node.steps || node.nodes || node.children || [];
  const logs    = Array.isArray(rawLogs) ? rawLogs : [];

  let tcId = null, configUrl = null, failedStepName = null, failedStepDetails = null;

  for (const log of logs) {
    const d    = stripHtml(log.details || log.description || '');
    const name = String(log.name || '');
    const ls   = String(log.status || '').toLowerCase();

    if (!tcId)       { const m = d.match(/Rally\s+TC\s+id\s*=?\s*(TC\d+)/i); if (m) tcId = m[1]; }
    if (!configUrl)  { const m = d.match(/Config\s+url\s*=\s*(\S+)/i);       if (m) configUrl = m[1]; }
    if (isFail(ls) && !failedStepDetails) { failedStepName = name; failedStepDetails = d; }
  }

  if (!tcId) {
    const src = [node.name, node.description].filter(Boolean).join(' ');
    const m   = src.match(/Rally\s+TC\s+id\s*=?\s*(TC\d+)/i);
    if (m) tcId = m[1];
  }

  return {
    testName:          String(node.name || node.testName || 'Unknown'),
    status:            isFail(status) ? 'FAIL' : 'PASS',
    tcId, configUrl, failedStepName, failedStepDetails,
    executionTimeMs:   0,
  };
};

const parseJsonPayload = (data) => {
  if (data && data.report && Array.isArray(data.report.testList))
    return data.report.testList.map(parseTestNode);
  if (Array.isArray(data))
    return data.map(parseTestNode);
  return [];
};

// ---------------------------------------------------------------------------
// Last-resort: raw TC ID scan
// ---------------------------------------------------------------------------

const fallbackTcScan = (html) => {
  const tcMatches = [...html.matchAll(/Rally\s+TC\s+id\s*=?\s*(TC\d+)/gi)];
  return tcMatches.map(m => ({
    testName:         `TC_${m[1]}`,
    status:           'UNKNOWN',
    tcId:             m[1],
    configUrl:        null,
    failedStepName:   null,
    failedStepDetails: null,
    executionTimeMs:  0,
  }));
};

// ---------------------------------------------------------------------------
// Public: extract results from raw HTML
// ---------------------------------------------------------------------------

/**
 * Extract test results from raw ExtentReport HTML.
 * Cascade: cheerio v3 parse → JSON v4 parse → TC scan fallback
 *
 * @param {string} htmlSource
 * @returns {ExtentTestResult[]}
 */
const extractTestResultsFromHtml = (htmlSource) => {
  if (!htmlSource || htmlSource.length < 100) return [];

  // 1. Try cheerio v3 parse (this project's actual format)
  const v3 = parseV3Html(htmlSource);
  if (v3.length > 0) return v3;

  // 2. Try JSON v4 SPA payload
  const payload = extractJsonPayload(htmlSource);
  if (payload) {
    const v4 = parseJsonPayload(payload);
    if (v4.length > 0) return v4;
  }

  // 3. Raw TC ID scan
  console.warn('[ExtentParser] No structured data found, falling back to TC ID scan');
  return fallbackTcScan(htmlSource);
};

// ---------------------------------------------------------------------------
// Report URL discovery
// ---------------------------------------------------------------------------

/**
 * Parse the Jenkins HTML Publisher directory page and find the actual report
 * file/directory name from the tab's `value` attribute.
 *
 * Directory listing example:
 *   <li id="tab1" ... value="newReportVersion2.0.html">newReportVersion2.0</li>
 *   (file) OR
 *   <li id="tab1" ... value="newReportVersion2.0/index.html">
 *   (subdirectory)
 *
 * @returns {{ file: string|null, dir: string|null }}
 *   file: full value as stored (e.g. "newReportVersion2.0.html")
 *   dir:  just the directory portion if it's inside a subdir
 */
const extractReportPath = (listingHtml) => {
  // Match: value="something"
  const m = listingHtml.match(/value="([^"]+\.html?)"/i)
         || listingHtml.match(/value="([^"]+)"/i);
  if (!m) return { file: null, dir: null };

  const val = m[1]; // e.g. "newReportVersion2.0.html" or "newReportVersion2.0/index.html"
  const slashIdx = val.indexOf('/');
  if (slashIdx === -1) {
    // It's a flat file in the root of ExtentReport/
    return { file: val, dir: null };
  } else {
    // It's inside a subdirectory
    return { file: val, dir: val.slice(0, slashIdx) };
  }
};

/**
 * Fetch the Jenkins HTML Publisher listing page and return candidate URLs
 * for the actual ExtentReport HTML content.
 *
 * @param {string} jobName
 * @param {number} buildNum
 * @param {object} jenkinsClient  - must have .fetchRaw(endpoint) → Promise<string>
 * @returns {Promise<string[]>}  ordered list of URLs to try
 */
const resolveReportUrls = async (jobName, buildNum, jenkinsClient) => {
  const base = `/job/${jobName}/${buildNum}/ExtentReport`;

  try {
    const listingHtml = await jenkinsClient.fetchRaw(`${base}/`);
    const { file, dir } = extractReportPath(listingHtml);

    if (file) {
      const urls = [`${base}/${file}`];
      if (dir) urls.push(`${base}/${dir}/`, `${base}/${dir}/index.html`);
      urls.push(`${base}/`); // fallback to listing page itself
      return urls;
    }
  } catch (e) {
    console.warn(`[ExtentParser] Could not fetch directory listing: ${e.message}`);
  }

  // Hard-coded fallbacks
  return [
    `${base}/newReportVersion2.0.html`,
    `${base}/newReportVersion2.0/`,
    `${base}/newReportVersion2.0/index.html`,
    `${base}/`,
  ];
};

// ---------------------------------------------------------------------------
// Public: fetch + parse
// ---------------------------------------------------------------------------

/**
 * Fetch and parse the ExtentReport for a given Jenkins job build.
 *
 * @param {string} jobName
 * @param {number} buildNum
 * @param {object} jenkinsClient
 * @param {object} [options]
 * @param {Function} [options.junitFallback]  async (jobName, buildNum) => ExtentTestResult[]
 * @returns {Promise<ExtentTestResult[]>}
 */
const parseExtentReport = async (jobName, buildNum, jenkinsClient, options = {}) => {
  const urls = await resolveReportUrls(jobName, buildNum, jenkinsClient);

  for (const url of urls) {
    try {
      const html = await jenkinsClient.fetchRaw(url);
      if (!html || html.length < 200) continue;

      const results = extractTestResultsFromHtml(html);
      if (results.length > 0) {
        console.log(`[ExtentParser] ${jobName}/${buildNum}: ${results.length} tests from ${url}`);
        return results;
      }
    } catch (e) {
      // try next URL
    }
  }

  if (typeof options.junitFallback === 'function') {
    console.warn(`[ExtentParser] All URLs failed, trying JUnit API for ${jobName}/${buildNum}`);
    return options.junitFallback(jobName, buildNum);
  }

  console.warn(`[ExtentParser] No results for ${jobName}/${buildNum}`);
  return [];
};

module.exports = {
  extractTestResultsFromHtml,
  extractJsonPayload,
  parseJsonPayload,
  extractReportPath,
  parseExtentReport,
};
