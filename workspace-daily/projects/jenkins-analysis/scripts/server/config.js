const path = require('path');

const PORT = process.env.WEBHOOK_PORT || 9090;
const ANALYSIS_SCRIPT = path.join(__dirname, '..', 'analyzer.sh');
const ANDROID_ANALYSIS_SCRIPT = path.join(__dirname, '..', 'android_analyzer.sh');
const LOG_DIR = path.join(__dirname, '..', '..', 'logs');
const LOG_FILE = path.join(LOG_DIR, 'webhook.log');

// Watched jobs configuration for Core Web Jenkins Jobs
const WATCHED_JOBS = [
  'Tanzu_Report_Env_Upgrade',
  'TanzuEnvPrepare'
];

// Watched jobs configuration for Android Library Jenkins Jobs
const ANDROID_WATCHED_JOBS = [
  'Trigger_Library_Jobs'
];

module.exports = {
  PORT,
  ANALYSIS_SCRIPT,
  ANDROID_ANALYSIS_SCRIPT,
  LOG_DIR,
  LOG_FILE,
  WATCHED_JOBS,
  ANDROID_WATCHED_JOBS
};
