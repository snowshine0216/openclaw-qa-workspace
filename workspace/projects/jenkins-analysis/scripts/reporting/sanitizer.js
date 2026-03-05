/**
 * Truncate text to max length
 */
const truncate = (text, maxLength = 80) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Remove noisy lines from raw console output before displaying in report.
 * Strips:
 *  - [allure-cleaner] scan/removal messages
 *  - [INFO] Automation data JSON dumps
 *  - Stack-trace lines beginning with "at " (e.g. "at async UserContext...")
 * Returns the last `maxLines` meaningful lines joined as a string.
 */
const sanitizeConsoleLog = (rawLog, maxLines = 50) => {
  const NOISE_PATTERNS = [
    /^\s*\[allure-cleaner\]/,
    /^\s*\[INFO\]\s+Automation data:/,
    /^\s*at\s+(?:async\s+)?\S+/,
  ];

  const isNoiseLine = (line) => NOISE_PATTERNS.some((re) => re.test(line));

  return rawLog
    .split('\n')
    .filter((line) => !isNoiseLine(line))
    .slice(-maxLines)
    .join('\n');
};

module.exports = {
  truncate,
  sanitizeConsoleLog
};
