/**
 * Failure Classifier Module for Android CI
 */

/**
 * Classify a test failure as screenshot or script_play
 * @param {object} testResult - Parsed ExtentResult { tcId, failedStepName, failedStepDetails }
 * @param {string} junitTestName - Test name, might end with .screenshot
 * @returns {"screenshot_failure" | "script_play_failure" | "unknown"}
 */
function classifyFailure(testResult, junitTestName) {
  const failedStepName = String(testResult.failedStepName || '').toLowerCase();
  const failedStepDetails = String(testResult.failedStepDetails || '').toLowerCase();
  const testName = String(junitTestName || '').toLowerCase();

  // Condition 1: Screenshot specific
  if (
    testName.endsWith('.screenshot') ||
    failedStepName.includes('screenshot') ||
    failedStepDetails.includes('does not match') ||
    failedStepDetails.includes('image comparison')
  ) {
    return "screenshot_failure";
  }

  // Condition 2: Script crash specific
  if (
    failedStepDetails.includes('nosuchelementexception') ||
    failedStepDetails.includes('timeoutexception') ||
    failedStepDetails.includes('script play failed') ||
    failedStepDetails.includes('appium') ||
    failedStepDetails.includes('exception:') ||
    failedStepName.includes('uncaught exception')
  ) {
    return "script_play_failure";
  }

  // Fallback
  return "unknown";
}

module.exports = {
  classifyFailure
};
