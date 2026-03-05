#!/usr/bin/env node
/**
 * Android Jenkins Webhook Server
 * Listens for Android build completion webhooks and triggers android_analyzer.sh
 * Runs on a separate port from the web CI server (jenkins-analysis).
 */

'use strict';

const http   = require('http');
const { spawn } = require('child_process');
const fs     = require('fs');
const path   = require('path');

const {
  ANDROID_PORT,
  ANDROID_ANALYSIS_SCRIPT,
  LOG_DIR,
  LOG_FILE,
  ANDROID_WATCHED_JOBS,
} = require('./config');

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

function log(message) {
  const logDir = path.dirname(LOG_FILE);
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
  const timestamp  = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(logMessage.trim());
  fs.appendFileSync(LOG_FILE, logMessage);
}

function triggerAndroidAnalysis(jobName, buildNumber) {
  log(`Triggering ANDROID analysis for ${jobName} #${buildNumber}`);
  const child = spawn('bash', [ANDROID_ANALYSIS_SCRIPT, jobName, buildNumber], {
    detached: true,
    stdio:    'ignore',
    env:      { ...process.env },
  });
  child.unref();
  log(`ANDROID analysis spawned for ${jobName} #${buildNumber} (PID: ${child.pid})`);
}

const server = http.createServer((req, res) => {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method Not Allowed\n');
    return;
  }

  let body = '';
  req.on('data', chunk => { body += chunk.toString(); });

  req.on('end', () => {
    try {
      const payload    = JSON.parse(body);
      log(`Webhook received: ${JSON.stringify(payload, null, 2)}`);

      const jobName     = payload.name || payload.job?.name;
      const buildNumber = payload.build?.number || payload.number;
      const buildStatus = payload.build?.status  || payload.status;
      const buildPhase  = payload.build?.phase   || payload.phase;

      if (buildPhase === 'COMPLETED' || buildPhase === 'FINALIZED') {
        if (ANDROID_WATCHED_JOBS.includes(jobName)) {
          log(`✓ Watched ANDROID job completed: ${jobName} #${buildNumber} (${buildStatus})`);
          triggerAndroidAnalysis(jobName, buildNumber);
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

if (require.main === module) {
  server.listen(ANDROID_PORT, () => {
    log(`🤖 Android webhook server listening on port ${ANDROID_PORT}`);
    log(`Watching Android jobs: ${ANDROID_WATCHED_JOBS.join(', ')}`);
  });

  process.on('SIGTERM', () => { log('SIGTERM received, shutting down...'); server.close(() => { log('Server closed'); process.exit(0); }); });
  process.on('SIGINT',  () => { log('SIGINT received, shutting down...');  server.close(() => { log('Server closed'); process.exit(0); }); });
}

module.exports = { server, log, triggerAndroidAnalysis };
