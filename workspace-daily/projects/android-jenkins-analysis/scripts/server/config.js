const path = require('path');

// Import shared base config from jenkins-analysis (PORT, LOG_DIR, etc.)
const baseConfig = require('../../jenkins-analysis/scripts/server/config');

const ANDROID_PORT = process.env.ANDROID_WEBHOOK_PORT || 9091;
const ANDROID_ANALYSIS_SCRIPT = path.join(__dirname, '..', 'android_analyzer.sh');

// Android logs live in android-jenkins-analysis/logs/
const LOG_DIR  = path.join(__dirname, '..', '..', 'logs');
const LOG_FILE = path.join(LOG_DIR, 'android_webhook.log');

// Android Library Jenkins jobs to watch
const ANDROID_WATCHED_JOBS = [
  'Trigger_Library_Jobs'
];

module.exports = {
  ...baseConfig,             // makes WEB PORT, WATCHED_JOBS etc. accessible if needed
  ANDROID_PORT,
  ANDROID_ANALYSIS_SCRIPT,
  LOG_DIR,
  LOG_FILE,
  ANDROID_WATCHED_JOBS,
};
