/**
 * generate_android_report.mjs — Android Library CI Report Generator (v2)
 *
 * Output format mirrors the web library report (reporting/generator.js):
 *   Section 1: Executive Summary
 *     1a  Pass/Fail counts table
 *     1b  Failure Breakdown by Type
 *     1c  Failure Breakdown by Error Pattern
 *   Section 2: Failure Summary Table (one row per test failure)
 *   Section 3: Passed Jobs
 *   Section 4: Detailed Failure Sections (one per job)
 *
 * Usage:
 *   node generate_android_report.mjs <outputDir> <triggerJob> <triggerBuild>
 */

import fs   from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

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
  const total    = passedJobs.length + failedJobs.length;
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
    if (details.includes('screenshot') || details.includes('image comparison') || details.includes('does not match')) {
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

const buildFailureSummaryTable = (failureLog, triggerJob, triggerBuild) => {
  if (failureLog.length === 0) return '';

  let md = `## ⚠️ Failure Summary Table\n\n`;
  md += `| Job | TC ID | Test Name | Failure Type | Failed Step | Last Failed | Recurring |\n`;
  md += `|-----|-------|-----------|--------------|-------------|-------------|-----------|\n`;

  for (const entry of failureLog) {
    const t    = entry.testResult || {};
    const url  = buildLink(entry.jobName, entry.buildNum);
    const jobCell     = `[${entry.jobName}](${url})`;
    const tcId        = safe(t.tcId);
    const testName    = safe(t.testName).replace(/\|/g, '\\|');
    const typeLabel   = FAILURE_TYPE_LABELS[entry.failureType] || entry.failureType;
    const step        = safe(t.failedStepName);
    const lastFailed  = entry.lastFailed ? `#${entry.lastFailed}` : '🆕 First';
    const recurring   = entry.isRecurring ? '🔁 Yes' : '—';

    md += `| ${jobCell} | ${tcId} | ${testName} | ${typeLabel} | ${step} | ${lastFailed} | ${recurring} |\n`;
  }

  md += `\n**Legend:**  \n`;
  md += `- **Last Failed:** Build number if this failure was seen before, 🆕 First for new failures  \n`;
  md += `- **🔁 Yes:** Recurring failure across multiple builds  \n`;
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
    const url     = buildLink(fj.jobName, fj.buildNum);
    const extUrl  = extentLink(fj.jobName, fj.buildNum);

    // Job heading (H3 → clickable in DOCX via docx_converter)
    md += `### [${fj.jobName} #${fj.buildNum}](${url})\n\n`;

    // Re-run annotation
    if (fj.rerun) {
      const rerunUrl  = buildLink(fj.jobName, fj.rerun.buildNum);
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
      md += `| TC ID | Test Name | Failure Type | Failed Step | Last Failed | Recurring |\n`;
      md += `|-------|-----------|--------------|-------------|-------------|-----------|\n`;

      for (const entry of jobFailures) {
        const t = entry.testResult || {};
        const typeLabel  = FAILURE_TYPE_LABELS[entry.failureType] || entry.failureType;
        const lastFailed = entry.lastFailed ? `#${entry.lastFailed}` : '🆕 First';
        const recurring  = entry.isRecurring ? '🔁 Yes' : '—';
        md += `| ${safe(t.tcId)} | ${safe(t.testName).replace(/\|/g, '\\|')} | ${typeLabel} | ${safe(t.failedStepName)} | ${lastFailed} | ${recurring} |\n`;
      }

      md += `\n`;

      // Expandable details block per failing test
      for (const entry of jobFailures) {
        const t = entry.testResult || {};
        if (!t.testName) continue;

        md += `<details>\n<summary>${safe(t.testName)} — Failure Details</summary>\n\n`;
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
        md += `\n</details>\n\n`;
      }
    }

    md += `---\n\n`;
  }

  return md;
};

// ---------------------------------------------------------------------------
// Main report assembly
// ---------------------------------------------------------------------------

const generateReport = (outputDir, triggerJob, triggerBuild) => {
  const passedJobs  = loadJson(path.join(outputDir, 'passed_jobs.json'));
  const failedJobs  = loadJson(path.join(outputDir, 'failed_jobs.json'));
  const failureLog  = loadJson(path.join(outputDir, 'extent_failures.json'));

  const total    = passedJobs.length + failedJobs.length;
  const dateStr  = new Date().toLocaleString('en-US', { timeZone: 'Asia/Shanghai' });

  // Report header
  let md = `# [Android] Library CI Report — ${triggerJob} #${triggerBuild}\n\n`;
  md += `**Generated:** ${dateStr}  \n`;
  md += `**Build:** ${triggerJob} #${triggerBuild}  \n`;
  md += `**Total Jobs:** ${total}  \n`;
  md += `**Pass Rate:** ${pct(passedJobs.length, total)}%  \n`;
  md += `\n---\n\n`;

  // Section 1: Executive Summary
  md += buildSummarySection(passedJobs, failedJobs);
  md += buildFailureBreakdown(failureLog);

  // Section 2: Failure Summary Table
  md += buildFailureSummaryTable(failureLog, triggerJob, triggerBuild);

  // Section 3: Passed Jobs
  md += buildPassedSection(passedJobs);

  // Section 4: Detailed Failures
  md += buildDetailedSection(failedJobs, failureLog);

  // Write output
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
  generateReport(outputDir, triggerJob, triggerBuild);
} else {
  console.error('Usage: node generate_android_report.mjs <outputDir> <triggerJob> <triggerBuild>');
  process.exit(1);
}

export { generateReport };
