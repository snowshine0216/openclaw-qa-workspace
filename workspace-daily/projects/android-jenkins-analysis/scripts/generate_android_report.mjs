/**
 * generate_android_report.mjs — Android Library CI Report Generator (v3)
 *
 * v3 adds LLM-powered screenshot comparison analysis:
 *   - For every screenshot_failure, calls screenshot_analyzer.js
 *   - Adds AI verdict (ignorable_drift / real_issue / crash) + metrics table to <details> block
 *   - Adds "AI Verdict" column to the Failure Summary Table for screenshot failures
 *
 * Output format:
 *   Section 1: Executive Summary (pass/fail, failure breakdown)
 *   Section 2: Failure Summary Table (one row per test failure)
 *   Section 3: Passed Jobs
 *   Section 4: Detailed Failure Sections (one per job)
 *
 * Usage:
 *   node generate_android_report.mjs <outputDir> <triggerJob> <triggerBuild>
 *
 * Options (env vars):
 *   SCREENSHOT_ANALYSIS_USE_LLM=false  — disable LLM, use heuristics only
 */

import fs   from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// ---------------------------------------------------------------------------
// Screenshot Analyzer (LLM-powered)
// ---------------------------------------------------------------------------

const {
  analyzeAllScreenshotFailures,
  renderScreenshotAnalysisMarkdown,
} = require('./android/screenshot_analyzer.js');

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const JENKINS_BASE = 'http://ci-master.labs.microstrategy.com:8011';

const FAILURE_TYPE_LABELS = {
  screenshot_failure:  '📸 Screenshot',
  script_play_failure: '🎬 Script Play',
  fixed_by_rerun:      '✅ Fixed by Re-run',
  unknown:             '❓ Unknown',
};

const VERDICT_SHORT_LABELS = {
  ignorable_drift: '✅ Ignorable',
  real_issue:      '🔴 Real Issue',
  crash:           '💥 Crash',
  unknown:         '❓ Unknown',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const safe = (v, fallback = 'N/A') => (v != null && String(v).length > 0 ? String(v) : fallback);

const pct = (n, total) =>
  total === 0 ? '0.0' : ((n / total) * 100).toFixed(1);

const buildLink = (jobName, buildNum) =>
  `${JENKINS_BASE}/job/${jobName}/${buildNum}/`;

const extentLink = (jobName, buildNum) =>
  `${buildLink(jobName, buildNum)}ExtentReport/`;

// ---------------------------------------------------------------------------
// Load JSON data files
// ---------------------------------------------------------------------------

const loadJson = (filePath) => {
  if (!fs.existsSync(filePath)) return [];
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    console.warn(`[report] Could not parse ${filePath}: ${e.message}`);
    return [];
  }
};

// ---------------------------------------------------------------------------
// Section 1a: Executive Summary table
// ---------------------------------------------------------------------------

const buildSummarySection = (passedJobs, failedJobs) => {
  const total     = passedJobs.length + failedJobs.length;
  const passCount = passedJobs.length;
  const failCount = failedJobs.length;

  let md = `## 📊 Executive Summary\n\n`;
  md += `| Status | Count | Percentage |\n`;
  md += `|--------|-------|------------|\n`;
  md += `| ✅ Passed | ${passCount} | ${pct(passCount, total)}% |\n`;
  md += `| ❌ Failed | ${failCount} | ${pct(failCount, total)}% |\n`;
  md += `\n`;
  return md;
};

// ---------------------------------------------------------------------------
// Section 1b+c: Failure Breakdown
// ---------------------------------------------------------------------------

const buildFailureBreakdown = (failureLog) => {
  if (failureLog.length === 0) return '';

  const byType  = {};
  const byError = {};

  for (const entry of failureLog) {
    const t = entry.failureType || 'unknown';
    byType[t] = (byType[t] || 0) + 1;

    const details = String((entry.testResult && entry.testResult.failedStepDetails) || '').toLowerCase();
    let errorBucket = 'Other';
    if (details.includes('screenshot') || details.includes('image comparison') || details.includes('does not match') || details.includes('diffpercentage')) {
      errorBucket = 'Screenshot Diff';
    } else if (details.includes('nosuchelementexception') || details.includes('element')) {
      errorBucket = 'Element Not Found';
    } else if (details.includes('timeout')) {
      errorBucket = 'Timeout';
    } else if (details.includes('appium') || details.includes('webdriver')) {
      errorBucket = 'Appium/Driver';
    } else if (details.includes('exception')) {
      errorBucket = 'Exception';
    }
    byError[errorBucket] = (byError[errorBucket] || 0) + 1;
  }

  const total = failureLog.length;

  let md = `### 📊 Failure Breakdown\n\n`;
  md += `#### By Failure Type\n`;
  md += `| Type | Count | Percentage |\n`;
  md += `|------|-------|------------|\n`;
  Object.entries(byType).sort((a, b) => b[1] - a[1]).forEach(([type, count]) => {
    md += `| ${FAILURE_TYPE_LABELS[type] || type} | ${count} | ${pct(count, total)}% |\n`;
  });
  md += `\n`;

  // Screenshot verdict summary if any screenshot failures exist
  const screenshotEntries = failureLog.filter(e => e.failureType === 'screenshot_failure' && e.screenshotAnalysis);
  if (screenshotEntries.length > 0) {
    const verdictCounts = {};
    screenshotEntries.forEach(e => {
      const v = e.screenshotAnalysis.verdict || 'unknown';
      verdictCounts[v] = (verdictCounts[v] || 0) + 1;
    });
    md += `#### 🤖 AI Screenshot Verdict Summary\n`;
    md += `| Verdict | Count |\n`;
    md += `|---------|-------|\n`;
    Object.entries(verdictCounts).sort((a, b) => b[1] - a[1]).forEach(([verdict, count]) => {
      md += `| ${VERDICT_SHORT_LABELS[verdict] || verdict} | ${count} |\n`;
    });
    md += `\n`;
  }

  md += `#### By Error Pattern\n`;
  md += `| Error Pattern | Count |\n`;
  md += `|---------------|-------|\n`;
  Object.entries(byError).sort((a, b) => b[1] - a[1]).forEach(([label, count]) => {
    md += `| ${label} | ${count} |\n`;
  });
  md += `\n---\n\n`;

  return md;
};

// ---------------------------------------------------------------------------
// Section 2: Failure Summary Table
// ---------------------------------------------------------------------------

const buildFailureSummaryTable = (failureLog) => {
  if (failureLog.length === 0) return '';

  // Check if any screenshot analysis is available
  const hasAnalysis = failureLog.some(e => e.screenshotAnalysis != null);

  let md = `## ⚠️ Failure Summary Table\n\n`;

  if (hasAnalysis) {
    md += `| Job | TC ID | Test Name | Failure Type | Failed Step | AI Verdict | Last Failed | Recurring |\n`;
    md += `|-----|-------|-----------|--------------|-------------|-----------|-------------|----------|\n`;
  } else {
    md += `| Job | TC ID | Test Name | Failure Type | Failed Step | Last Failed | Recurring |\n`;
    md += `|-----|-------|-----------|--------------|-------------|-------------|----------|\n`;
  }

  for (const entry of failureLog) {
    const t         = entry.testResult || {};
    const url       = buildLink(entry.jobName, entry.buildNum);
    const jobCell   = `[${entry.jobName}](${url})`;
    const tcId      = safe(t.tcId);
    const testName  = safe(t.testName).replace(/\|/g, '\\|');
    const typeLabel = FAILURE_TYPE_LABELS[entry.failureType] || entry.failureType;
    const step      = safe(t.failedStepName);
    const lastFailed = entry.lastFailed ? `#${entry.lastFailed}` : '🆕 First';
    const recurring  = entry.isRecurring ? '🔁 Yes' : '—';

    if (hasAnalysis) {
      const verdict = entry.screenshotAnalysis
        ? VERDICT_SHORT_LABELS[entry.screenshotAnalysis.verdict] || '—'
        : '—';
      md += `| ${jobCell} | ${tcId} | ${testName} | ${typeLabel} | ${step} | ${verdict} | ${lastFailed} | ${recurring} |\n`;
    } else {
      md += `| ${jobCell} | ${tcId} | ${testName} | ${typeLabel} | ${step} | ${lastFailed} | ${recurring} |\n`;
    }
  }

  md += `\n**Legend:**  \n`;
  md += `- **Last Failed:** Build number if this failure was seen before, 🆕 First for new failures  \n`;
  md += `- **🔁 Yes:** Recurring failure across multiple builds  \n`;
  if (hasAnalysis) {
    md += `- **AI Verdict:** ✅ Ignorable = pixel noise; 🔴 Real Issue = investigate; 💥 Crash = test infra error  \n`;
  }
  md += `\n---\n\n`;

  return md;
};

// ---------------------------------------------------------------------------
// Section 3: Passed Jobs
// ---------------------------------------------------------------------------

const buildPassedSection = (passedJobs) => {
  let md = `## ✅ Passed Jobs (${passedJobs.length})\n\n`;
  if (passedJobs.length === 0) {
    md += `*No passed jobs*\n`;
  } else {
    for (const j of passedJobs) {
      md += `- [${j.jobName} #${j.buildNum}](${buildLink(j.jobName, j.buildNum)})\n`;
    }
  }
  md += `\n---\n\n`;
  return md;
};

// ---------------------------------------------------------------------------
// Section 4: Detailed Failure Analysis
// ---------------------------------------------------------------------------

const buildDetailsBlock = (entry) => {
  const t = entry.testResult || {};
  if (!t.testName) return '';

  let md = `<details>\n<summary>${safe(t.testName)} — Failure Details</summary>\n\n`;
  md += `**TC ID:** ${safe(t.tcId)}  \n`;
  if (t.configUrl) {
    md += `**Config URL:** \`${t.configUrl}\`  \n`;
  }
  md += `**Failed Step:** \`${safe(t.failedStepName, 'unknown')}\`  \n`;
  if (t.failedStepDetails) {
    const snippet = String(t.failedStepDetails).slice(0, 400);
    md += `**Details:**\n\`\`\`\n${snippet}\n\`\`\`\n`;
  }
  if (entry.rerunNum) {
    md += `**Re-run Build:** #${entry.rerunNum} (${entry.rerunRes || 'unknown result'})  \n`;
  }

  // Inject screenshot analysis block (only for screenshot_failure with analysis)
  if (entry.failureType === 'screenshot_failure' && entry.screenshotAnalysis) {
    md += renderScreenshotAnalysisMarkdown(entry.screenshotAnalysis);
  }

  md += `\n</details>\n\n`;
  return md;
};

const buildDetailedSection = (failedJobs, failureLog) => {
  if (failedJobs.length === 0) return `## 📋 Detailed Failure Analysis\n\n*No failed jobs* 🎉\n`;

  // Group failureLog entries by jobName
  const byJob = {};
  for (const entry of failureLog) {
    if (!byJob[entry.jobName]) byJob[entry.jobName] = [];
    byJob[entry.jobName].push(entry);
  }

  let md = `## 📋 Detailed Failure Analysis\n\n`;

  for (const fj of failedJobs) {
    const url    = buildLink(fj.jobName, fj.buildNum);
    const extUrl = extentLink(fj.jobName, fj.buildNum);

    md += `### [${fj.jobName} #${fj.buildNum}](${url})\n\n`;

    // Re-run annotation
    if (fj.rerun) {
      const rerunIcon = fj.rerun.result === 'SUCCESS' ? '✅ FIXED' : '❌ STILL FAILING';
      md += `> ⟳ Re-run #${fj.rerun.buildNum} ${rerunIcon}  \n`;
      md += `> [ExtentReport Run #${fj.buildNum}](${extUrl}) | [Re-run #${fj.rerun.buildNum}](${buildLink(fj.jobName, fj.rerun.buildNum)}ExtentReport/)  \n\n`;
    } else {
      md += `**ExtentReport:** [View](${extUrl})  \n`;
      md += `**Build:** [View in Jenkins](${url})  \n\n`;
    }

    const jobFailures = byJob[fj.jobName] || [];
    if (jobFailures.length === 0) {
      md += `> _Failure details could not be extracted from ExtentReport._\n\n`;
    } else {
      // Summary mini-table per job
      const hasAnalysis = jobFailures.some(e => e.screenshotAnalysis != null);

      if (hasAnalysis) {
        md += `| TC ID | Test Name | Failure Type | Failed Step | AI Verdict | Last Failed | Recurring |\n`;
        md += `|-------|-----------|--------------|-------------|-----------|-------------|----------|\n`;
      } else {
        md += `| TC ID | Test Name | Failure Type | Failed Step | Last Failed | Recurring |\n`;
        md += `|-------|-----------|--------------|-------------|-------------|----------|\n`;
      }

      for (const entry of jobFailures) {
        const t          = entry.testResult || {};
        const typeLabel  = FAILURE_TYPE_LABELS[entry.failureType] || entry.failureType;
        const lastFailed = entry.lastFailed ? `#${entry.lastFailed}` : '🆕 First';
        const recurring  = entry.isRecurring ? '🔁 Yes' : '—';

        if (hasAnalysis) {
          const verdict = entry.screenshotAnalysis
            ? VERDICT_SHORT_LABELS[entry.screenshotAnalysis.verdict] || '—'
            : '—';
          md += `| ${safe(t.tcId)} | ${safe(t.testName).replace(/\|/g, '\\|')} | ${typeLabel} | ${safe(t.failedStepName)} | ${verdict} | ${lastFailed} | ${recurring} |\n`;
        } else {
          md += `| ${safe(t.tcId)} | ${safe(t.testName).replace(/\|/g, '\\|')} | ${typeLabel} | ${safe(t.failedStepName)} | ${lastFailed} | ${recurring} |\n`;
        }
      }

      md += `\n`;

      // Expandable details blocks — one per test
      for (const entry of jobFailures) {
        md += buildDetailsBlock(entry);
      }
    }

    md += `---\n\n`;
  }

  return md;
};

// ---------------------------------------------------------------------------
// Main report assembly
// ---------------------------------------------------------------------------

const generateReport = async (outputDir, triggerJob, triggerBuild) => {
  const passedJobs = loadJson(path.join(outputDir, 'passed_jobs.json'));
  const failedJobs = loadJson(path.join(outputDir, 'failed_jobs.json'));
  const rawFailureLog = loadJson(path.join(outputDir, 'extent_failures.json'));

  // -------------------------------------------------------------------------
  // Run screenshot analysis (LLM-powered)
  // -------------------------------------------------------------------------
  const useLlm = process.env.SCREENSHOT_ANALYSIS_USE_LLM !== 'false';
  const screenshotCount = rawFailureLog.filter(e => e.failureType === 'screenshot_failure').length;

  let failureLog = rawFailureLog;
  if (screenshotCount > 0) {
    console.log(`[report] 🤖 Running screenshot analysis on ${screenshotCount} screenshot failure(s)... (LLM: ${useLlm})`);
    try {
      failureLog = await analyzeAllScreenshotFailures(rawFailureLog, { useLlm });
      const analyzed = failureLog.filter(e => e.screenshotAnalysis != null);
      console.log(`[report] ✅ Screenshot analysis complete: ${analyzed.length} analyzed`);
      analyzed.forEach(e => {
        const a = e.screenshotAnalysis;
        console.log(`  • ${e.testResult?.testName || '?'} → ${a.verdict} (${a.confidence}, ${a.source})`);
      });
    } catch (err) {
      console.warn(`[report] ⚠️  Screenshot analysis failed: ${err.message}. Continuing without analysis.`);
      failureLog = rawFailureLog.map(e => ({ ...e, screenshotAnalysis: null }));
    }
  }

  // -------------------------------------------------------------------------
  // Build report
  // -------------------------------------------------------------------------
  const total   = passedJobs.length + failedJobs.length;
  const dateStr = new Date().toLocaleString('en-US', { timeZone: 'Asia/Shanghai' });

  let md = `# [Android] Library CI Report — ${triggerJob} #${triggerBuild}\n\n`;
  md += `**Generated:** ${dateStr}  \n`;
  md += `**Build:** ${triggerJob} #${triggerBuild}  \n`;
  md += `**Total Jobs:** ${total}  \n`;
  md += `**Pass Rate:** ${pct(passedJobs.length, total)}%  \n`;
  if (screenshotCount > 0) {
    md += `**Screenshot Analysis:** 🤖 AI-powered (${useLlm ? 'LLM + Heuristics' : 'Heuristics Only'})  \n`;
  }
  md += `\n---\n\n`;

  md += buildSummarySection(passedJobs, failedJobs);
  md += buildFailureBreakdown(failureLog);
  md += buildFailureSummaryTable(failureLog);
  md += buildPassedSection(passedJobs);
  md += buildDetailedSection(failedJobs, failureLog);

  const reportName = `${triggerJob}_${triggerBuild}.md`;
  const mdPath = path.join(outputDir, reportName);
  fs.writeFileSync(mdPath, md, 'utf8');
  console.log(`✅ Android report written to: ${mdPath}`);
  return mdPath;
};

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
if (args.length >= 3) {
  const [outputDir, triggerJob, triggerBuild] = args;
  generateReport(outputDir, triggerJob, triggerBuild)
    .then(() => process.exit(0))
    .catch(err => { console.error(err); process.exit(1); });
} else {
  console.error('Usage: node generate_android_report.mjs <outputDir> <triggerJob> <triggerBuild>');
  process.exit(1);
}

export { generateReport };
