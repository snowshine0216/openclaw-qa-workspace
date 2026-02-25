const path = require('path');

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
  ANDROID_PORT,
  ANDROID_ANALYSIS_SCRIPT,
  LOG_DIR,
  LOG_FILE,
  ANDROID_WATCHED_JOBS,
};
