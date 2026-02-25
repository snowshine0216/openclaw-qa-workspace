const path = require('path');

const PORT = process.env.WEBHOOK_PORT || 9090;
const ANALYSIS_SCRIPT = path.join(__dirname, '..', 'analyzer.sh');
const LOG_DIR = path.join(__dirname, '..', '..', 'logs');
const LOG_FILE = path.join(LOG_DIR, 'webhook.log');

// Watched jobs configuration
const WATCHED_JOBS = [
  'Tanzu_Report_Env_Upgrade',
  'TanzuEnvPrepare'
];

module.exports = {
  PORT,
  ANALYSIS_SCRIPT,
  LOG_DIR,
  LOG_FILE,
  WATCHED_JOBS
};
