const { extractFailuresFromLog } = require('./parser');
const {
  extractFullError,
  extractTestCaseInfo,
  extractScreenshotInfo,
  extractSpectreUrl
} = require('./extractors');

const {
  splitByFilePattern,
  deduplicateRetries
} = require('./deduplication');

module.exports = {
  extractFailuresFromLog,
  extractFullError,
  extractTestCaseInfo,
  extractScreenshotInfo,
  extractSpectreUrl,
  splitByFilePattern,
  deduplicateRetries
};
