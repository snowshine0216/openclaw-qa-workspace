/**
 * ExtentParser Module for Android CI
 *
 * Scrapes ExtentReport v4 HTML looking for the JSON object in the embedded <script> tags
 * Returns a list of ExtentTestResult items.
 */

/**
 * Clean up HTML artifacts from Extent JSON structure
 */
function cleanDetails(detailsStr) {
  if (!detailsStr) return '';
  return detailsStr.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Attempt to extract and parse the JSON payload from the raw ExtentReport HTML
 * @param {string} htmlSource 
 * @returns {Array} Array of Test result objects
 */
function extractTestResultsFromHtml(htmlSource) {
  // Try finding embedded test payload (window.TESTS or var testData)
  // Look for something like data: [ { name: "TC...", status: "fail" } ] 
  // We'll use regex to isolate the chunk since we don't have a full V8 engine running
  let payloadStr = '';
  
  // Pattern 1: JSON payload array encoded in a single script variable
  const testsMatch = htmlSource.match(/var\s+testData\s*=\s*(\[[^;]+\]);/i) || 
                     htmlSource.match(/window\.TESTS\s*=\s*(\[[^;]+\]);/);
  
  if (testsMatch && testsMatch[1]) {
    try {
      payloadStr = testsMatch[1];
      // Try to parse it securely
      // Need to clean potential dangling trailing commas if it isn't strict JSON
      const cleanPayload = payloadStr.replace(/,(?!\s*?[{["'\w])/g, '');
      const data = JSON.parse(cleanPayload);
      return parseJsonData(data);
    } catch(e) {
      console.warn("ExtentParser JSON parse error, falling back to regex block parsing", e);
    }
  }

  // Fallback: Regex Regex chunking for missing JS variables 
  return fallbackRegexExtraction(htmlSource);
}

/**
 * Standardize JSON data into ExtentTestResult objects
 */
function parseJsonData(dataList) {
  const results = [];
  
  for (const group of dataList) {
    // Handling Extent V4 format which often groups by Suite > Test
    const tests = Array.isArray(group.children) && group.children.length > 0 ? group.children : [group];

    for (const t of tests) {
      const isFail = String(t.status || t.result || '').toLowerCase() === 'fail';
      
      let failedStepName = null;
      let failedStepDetails = null;
      let configUrl = null;
      let tcId = null;

      // Scan steps for failure details and known TC IDs
      (t.logs || t.steps || []).forEach(step => {
        const stepDetails = String(step.details || '');
        const stepName = String(step.name || step.stepName || '');
        const stepStatus = String(step.status || '').toLowerCase();

        // Try extracting TC ID
        const tcMatch = stepDetails.match(/Rally TC id=(TC\d+)/i);
        if (tcMatch) tcId = tcMatch[1];
        
        // Try extracting Config
        const urlMatch = stepDetails.match(/Config url = ([^\s<]+)/i);
        if (urlMatch) configUrl = urlMatch[1];

        // Capture first fail
        if (stepStatus === 'fail' && !failedStepDetails) {
          failedStepName = stepName;
          failedStepDetails = cleanDetails(stepDetails);
        }
      });

      results.push({
        testName: t.name,
        status: isFail ? 'FAIL' : 'PASS',
        tcId: tcId,
        configUrl: configUrl,
        failedStepName: failedStepName,
        failedStepDetails: failedStepDetails,
        executionTimeMs: t.time ? t.time.endTime - t.time.startTime : 0
      });
    }
  }
  
  return results;
}

/**
 * Fallback to RegExp scraping on individual blocks when JSON isn't explicit
 */
function fallbackRegexExtraction(htmlSource) {
  const results = [];
  // Basic slice up by "test-item"
  const blocks = htmlSource.split('class="test-item"');
  // Drop first prefix chunk
  blocks.shift();

  for (const block of blocks) {
    const isFail = block.includes('status="fail"') || block.includes('status fail');
    const nameMatch = block.match(/test-name">([^<]+)<\/span>/);
    if (!nameMatch) continue;
    
    let tcId = null;
    let failedStepName = null;
    let failedStepDetails = null;
    let configUrl = null;

    const tcMatch = block.match(/Rally TC id=(TC\d+)/i);
    if (tcMatch) tcId = tcMatch[1];

    const confMatch = block.match(/Config url = ([^\s<"']+)/i);
    if (confMatch) configUrl = confMatch[1];

    if (isFail) {
      // Find the row that has failing status
      // A typical extent row: <tr status="fail"><td...>StepName</td><td...>Details</td></tr>
      const failRowMatch = block.match(/<tr[^>]*status="fail"[^>]*>([\s\S]*?)<\/tr>/i);
      if (failRowMatch) {
        const trHtml = failRowMatch[1];
        // naive extraction
        const tdMatches = [...trHtml.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)];
        if (tdMatches.length >= 2) {
           failedStepName = cleanDetails(tdMatches[tdMatches.length - 2][1]);
           failedStepDetails = cleanDetails(tdMatches[tdMatches.length - 1][1]);
        }
      }
    }

    results.push({
      testName: nameMatch[1].trim(),
      status: isFail ? 'FAIL' : 'PASS',
      tcId: tcId,
      configUrl: configUrl,
      failedStepName: failedStepName,
      failedStepDetails: failedStepDetails,
      executionTimeMs: 0
    });
  }

  return results;
}

/**
 * Extract the reports dynamically based on Directory enumeration 
 */
async function getReportDirectoryName(jobName, buildNum, jenkinsClient) {
  const listingHtml = await jenkinsClient.fetchRaw(`/job/${jobName}/${buildNum}/ExtentReport/`);
  const match = listingHtml.match(/href="([^">]*Report[^">]*)\/"/i);
  return match ? match[1] : 'newReportVersion2.0';
}

/**
 * Parse directly from Jenkins client
 */
async function parseExtentReport(jobName, buildNum, jenkinsClient) {
  const dirName = await getReportDirectoryName(jobName, buildNum, jenkinsClient);
  
  const reportIndexHtml = await jenkinsClient.fetchRaw(`/job/${jobName}/${buildNum}/ExtentReport/${dirName}/index.html`);
  if (!reportIndexHtml) {
    console.warn(`Could not fetch ExtentReport for ${jobName}/${buildNum}`);
    return [];
  }
  
  return extractTestResultsFromHtml(reportIndexHtml);
}

module.exports = {
  extractTestResultsFromHtml,
  getReportDirectoryName,
  parseExtentReport
};
