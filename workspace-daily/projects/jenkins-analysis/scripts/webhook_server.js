#!/usr/bin/env node
/**
 * Jenkins Webhook Server
 * Listens for build completion webhooks and triggers analysis
 */

const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = process.env.WEBHOOK_PORT || 9090;
const ANALYSIS_SCRIPT = path.join(__dirname, 'analyzer.sh');
const LOG_DIR = path.join(__dirname, '../logs');
const LOG_FILE = path.join(LOG_DIR, 'webhook.log');

// Ensure logs directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Watched jobs configuration
const WATCHED_JOBS = [
  'Tanzu_Report_Env_Upgrade',
  'TanzuEnvPrepare'
];

function log(message) {
  const logDir = path.dirname(LOG_FILE);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(logMessage.trim());
  fs.appendFileSync(LOG_FILE, logMessage);
}

function triggerAnalysis(jobName, buildNumber) {
  log(`Triggering analysis for ${jobName} #${buildNumber}`);
  
  const child = spawn('bash', [ANALYSIS_SCRIPT, jobName, buildNumber], {
    detached: true,
    stdio: 'ignore',
    env: { ...process.env }
  });
  
  child.unref();
  log(`Analysis spawned for ${jobName} #${buildNumber} (PID: ${child.pid})`);
}

const server = http.createServer((req, res) => {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method Not Allowed\n');
    return;
  }

  let body = '';
  
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    try {
      // Parse webhook payload (Jenkins sends JSON)
      const payload = JSON.parse(body);
      
      log(`Webhook received: ${JSON.stringify(payload, null, 2)}`);

      // Extract job info
      const jobName = payload.name || payload.job?.name;
      const buildNumber = payload.build?.number || payload.number;
      const buildStatus = payload.build?.status || payload.status;
      const buildPhase = payload.build?.phase || payload.phase;

      // Check if this is a completion event for watched jobs
      if (buildPhase === 'COMPLETED' || buildPhase === 'FINALIZED') {
        if (WATCHED_JOBS.includes(jobName)) {
          log(`✓ Watched job completed: ${jobName} #${buildNumber} (${buildStatus})`);
          triggerAnalysis(jobName, buildNumber);
        } else {
          log(`✗ Ignoring non-watched job: ${jobName}`);
        }
      } else {
        log(`ℹ Job not completed yet: ${jobName} #${buildNumber} (phase: ${buildPhase})`);
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', message: 'Webhook received' }));
      
    } catch (error) {
      log(`ERROR parsing webhook: ${error.message}`);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'error', message: error.message }));
    }
  });
});

server.listen(PORT, () => {
  log(`🚀 Webhook server listening on port ${PORT}`);
  log(`Watching jobs: ${WATCHED_JOBS.join(', ')}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  log('SIGTERM received, shutting down...');
  server.close(() => {
    log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  log('SIGINT received, shutting down...');
  server.close(() => {
    log('Server closed');
    process.exit(0);
  });
});
