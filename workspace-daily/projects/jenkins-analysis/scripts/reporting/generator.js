#!/usr/bin/env node
/**
 * Report Generator - Creates consolidated markdown report with DB-backed failure table
 */

const fs = require('fs');
const path = require('path');
const { Database } = require('../database');
const { truncate, sanitizeConsoleLog } = require('./sanitizer');

const [,, reportFolder, failedJobsPath, passedJobsPath, outputDir] = process.argv;

if (!reportFolder || !failedJobsPath || !passedJobsPath || !outputDir) {
  console.error('Usage: node report_generator.js <reportFolder> <failedJobsPath> <passedJobsPath> <outputDir>');
  process.exit(1);
}

const JENKINS_URL = 'http://tec-l-1081462.labs.microstrategy.com:8080';
const failedJobs = JSON.parse(fs.readFileSync(failedJobsPath, 'utf8'));
const passedJobs = JSON.parse(fs.readFileSync(passedJobsPath, 'utf8'));

const totalJobs = failedJobs.length + passedJobs.length;
const passRate = totalJobs > 0 ? ((passedJobs.length / totalJobs) * 100).toFixed(1) : 0;

// Connect to DB
const dbPath = path.resolve(__dirname, '..', 'data', 'jenkins_history.db');
let db;

async function initDb() {
  try {
    if (fs.existsSync(dbPath)) {
      db = await Database.create(dbPath);
    }
  } catch (e) {
    console.error("No database found or error connecting:", e.message);
  }
}

// Make main async
const main = async () => {

  await initDb();

// Build report header
let report = `# Jenkins Daily QA Report - ${reportFolder}

**Generated:** ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Shanghai' })}  
**Build:** ${reportFolder}  
**Total Jobs:** ${totalJobs}  
**Pass Rate:** ${passRate}%  

---

## 📊 Executive Summary

| Status | Count | Percentage |
|--------|-------|------------|
| ✅ Passed | ${passedJobs.length} | ${passRate}% |
| ❌ Failed | ${failedJobs.length} | ${(100 - passRate).toFixed(1)}% |

`;

// V2.3: Build failure summary table FIRST, then generate breakdown from table data
const tableCategoryCounts = {};
const tableErrorTypeCounts = {};
const tableRows = [];

if (failedJobs.length > 0) {
  failedJobs.forEach(job => {
    const jobName = job.name;
    const buildNumber = job.number;
    const jobUrl = `${JENKINS_URL}/job/${jobName}/${buildNumber}/`;
    const jobLinkDocx = `[${jobName}](${jobUrl})`;
    
    // Load AI analysis
    const analysisPath = path.join(outputDir, `${jobName}_${buildNumber}_analysis.json`);
    let analysis = null;
    if (fs.existsSync(analysisPath)) {
      try {
        analysis = JSON.parse(fs.readFileSync(analysisPath, 'utf8'));
      } catch (error) {}
    }

    const category = analysis ? (analysis.failureType || 'Unknown Failure') : 'Unknown Failure';
    const categoryIcon = {
      'Script Failure': '📝',
      'Production Failure': '🚨',
      'Environment Failure': '⚙️',
      'Configuration Failure': '⚙️',
      'Dependency Failure': '🔗',
      'Unknown Failure': '❓'
    }[category] || '❓';
    
    const rootCause = analysis ? truncate(analysis.rootCause, 60) : 'Unknown';
    const suggestion = analysis && analysis.actions && analysis.actions.length > 0 
      ? truncate(analysis.actions[0], 45)
      : 'See details below';

    // Retrieve steps from DB
    let steps = [];
    if (db) {
      try {
        steps = db.prepare(`
          SELECT fs.* FROM failed_steps fs
          JOIN failed_jobs fj ON fs.failed_job_id = fj.id
          WHERE fj.job_name = ? AND fj.job_build = ?
        `).all(jobName, buildNumber);
      } catch (e) {
        console.error("Error querying db:", e.message);
      }
    }

    if (steps.length > 0) {
      // V2.2: Deduplicate by TC ID
      const uniqueSteps = {};
      steps.forEach(step => {
        const key = step.tc_id;
        if (!uniqueSteps[key]) {
          uniqueSteps[key] = step;
        } else {
          if (step.last_failed_build && !uniqueSteps[key].last_failed_build) {
            uniqueSteps[key] = step;
          }
          if (step.snapshot_url && !uniqueSteps[key].snapshot_url) {
            uniqueSteps[key] = step;
          }
          if (step.retry_count > (uniqueSteps[key].retry_count || 0)) {
            uniqueSteps[key].retry_count = step.retry_count;
          }
        }
      });
      
      Object.values(uniqueSteps).forEach(step => {
        const fileName = step.file_name || 'unknown.spec.js';
        const shortFileName = fileName.split('/').pop().replace('.spec.js', '');
        
        const tcName = step.tc_name ? step.tc_name.replace(/\|/g, '\\|') : '';
        const tcDisplay = tcName ? `${step.tc_id} - ${tcName}` : step.tc_id;
        
        let snapshotCell = 'N/A';
        if (step.snapshot_url) {
          const badge = step.false_alarm ? ' ⚠️ FA' : '';
          snapshotCell = `[📸 View](${step.snapshot_url})${badge}`;
        }
        
        // V2.3: Plain emoji for first failures (no bold)
        let lastFailedCell = step.last_failed_build ? `#${step.last_failed_build}` : '🆕 First';

        // V2.3: Build table row (removed Retries column)
        const rowString = `| ${jobLinkDocx} | ${shortFileName} | ${tcDisplay} | ${categoryIcon} ${category} | ${rootCause} | ${lastFailedCell} | ${snapshotCell} | ${suggestion} |\n`;
        tableRows.push(rowString);
        
        // V2.3: Count categories from actual table (single source of truth)
        tableCategoryCounts[category] = (tableCategoryCounts[category] || 0) + 1;
        
        // Count error types
        const msg = step.failure_msg || '';
        let errorType = 'Other';
        if (msg.includes('webdriver') || msg.includes('Request fail')) {
          errorType = 'Webdriver/Network';
        } else if (step.snapshot_url) {
          errorType = 'Snapshot Diff';
        } else if (msg.includes('element') && msg.includes('not displayed')) {
          errorType = 'Element Not Found';
        } else if (msg.includes('timeout') || (msg.includes('after') && msg.includes('ms'))) {
          errorType = 'Timeout';
        }
        tableErrorTypeCounts[errorType] = (tableErrorTypeCounts[errorType] || 0) + 1;
      });
    } else {
      // Fallback if no steps found
      let lastFailedCell = 'Unknown';
      const rowString = `| ${jobLinkDocx} | N/A | N/A | ${categoryIcon} ${category} | ${rootCause} | ${lastFailedCell} | N/A | ${suggestion} |\n`;
      tableRows.push(rowString);
      tableCategoryCounts[category] = (tableCategoryCounts[category] || 0) + 1;
    }
  });

  // V2.3: Generate breakdown from table counts
  const totalTableRows = tableRows.length;
  
  report += `
### 📊 Failure Breakdown

#### By Category (from Summary Table)
| Category | Count | Percentage |
|----------|-------|------------|
`;
  
  Object.entries(tableCategoryCounts).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
    const pct = ((count / totalTableRows) * 100).toFixed(0);
    const icon = {
      'Script Failure': '📝',
      'Production Failure': '🚨',
      'Environment Failure': '⚙️',
      'Configuration Failure': '⚙️',
      'Dependency Failure': '🔗',
      'Unknown Failure': '❓'
    }[cat] || '❓';
    report += `| ${icon} ${cat} | ${count} | ${pct}% |\n`;
  });
  
  report += `
#### By Error Type (Pattern Detection)
| Error Type | Count | Example |
|------------|-------|---------|
`;
  
  Object.entries(tableErrorTypeCounts).sort((a, b) => b[1] - a[1]).forEach(([type, count]) => {
    report += `| ${type} | ${count} | - |\n`;
  });
  
  report += `
---

`;

  // V2.3: Append the pre-built table
  report += `## ⚠️ Failure Summary Table

| Job | File | TC ID | Category | Root Cause | Last Failed | Snapshot | Suggestion |
|-----|------|-------|----------|------------|-------------|----------|------------|
`;
  
  report += tableRows.join('');
  
  report += `\n**Legend:**  \n`;
  report += `- **File:** Test file name (short version, see details for full path)  \n`;
  report += `- **Last Failed:** Build number if this step failed in previous builds, 🆕 First for new failures  \n`;
  report += `- **⚠️ FA:** Marks a False Alarm (e.g. minor visual diff confirmed by Spectre)  \n`;
  report += `\n---\n\n`;
}

// Add passed jobs section
report += `## ✅ Passed Jobs (${passedJobs.length})\n\n`;
if (passedJobs.length > 0) {
  passedJobs.forEach(job => {
    report += `- [${job.name} #${job.number}](${JENKINS_URL}/job/${job.name}/${job.number}/)\n`;
  });
} else {
  report += `*No passed jobs*\n`;
}

report += `\n---\n\n## 📋 Detailed Failure Analysis\n\n`;

if (failedJobs.length > 0) {
  failedJobs.forEach(job => {
    const jobName = job.name;
    const buildNumber = job.number;
    const jobUrl = `${JENKINS_URL}/job/${jobName}/${buildNumber}/`;
    
    // Each job gets a Heading 2 with a clickable link (rendered by md_to_docx as HEADING_2)
    report += `## [${jobName} #${buildNumber}](${jobUrl})\n\n`;
    
    const analysisPath = path.join(outputDir, `${jobName}_${buildNumber}_analysis.json`);
    let analysis = null;
    if (fs.existsSync(analysisPath)) {
      try {
        analysis = JSON.parse(fs.readFileSync(analysisPath, 'utf8'));
      } catch (error) {}
    }
    
    if (analysis) {
      const typeEmoji = {
        'Script Failure': '📝',
        'Production Failure': '🚨',
        'Environment Failure': '⚙️',
        'Configuration Failure': '⚙️',
        'Dependency Failure': '🔗',
        'Unknown Failure': '❓'
      };
      const failureType = analysis.failureType || 'Unknown Failure';
      const emoji = typeEmoji[failureType] || '❓';
      
      report += `**Status:** ${emoji} **${failureType}**`;
      if (analysis.confidence) report += ` (Confidence: ${analysis.confidence})`;
      report += `\n\n`;

      if (analysis.isFalseAlarm && analysis.falseAlarmReason) {
        report += `> ⚠️ **Note:** This appears to be a false alarm - not a product issue.\n\n`;
        report += `**Reason:** ${analysis.falseAlarmReason}\n\n`;
      }
      
      report += `**Root Cause:** ${analysis.rootCause || 'Unknown'}\n\n`;
      if (analysis.actions && analysis.actions.length > 0) {
        report += `**Recommended Actions:**\n`;
        analysis.actions.forEach((action, idx) => {
          report += `${idx + 1}. ${action}\n`;
        });
        report += `\n`;
      }
    } else {
      report += `**Status:** ❓ Unknown Failure (analysis not available)\n\n`;
    }
    
    // V2: Add detailed error information from database
    let stepDetails = [];
    if (db) {
      try {
        stepDetails = db.prepare(`
          SELECT * FROM failed_steps fs
          JOIN failed_jobs fj ON fs.failed_job_id = fj.id
          WHERE fj.job_name = ? AND fj.job_build = ?
        `).all(jobName, buildNumber);
      } catch (e) {}
    }
    
    if (stepDetails.length > 0) {
      // V2.2: Deduplicate by TC ID (same as summary table)
      const uniqueStepDetails = {};
      stepDetails.forEach(step => {
        const key = step.tc_id;
        if (!uniqueStepDetails[key]) {
          uniqueStepDetails[key] = step;
        } else {
          // Prefer entry with more detail
          if (step.last_failed_build && !uniqueStepDetails[key].last_failed_build) {
            uniqueStepDetails[key] = step;
          }
          if (step.full_error_msg && step.full_error_msg.length > (uniqueStepDetails[key].full_error_msg || '').length) {
            uniqueStepDetails[key].full_error_msg = step.full_error_msg;
          }
          // Aggregate retry count
          if (step.retry_count > (uniqueStepDetails[key].retry_count || 0)) {
            uniqueStepDetails[key].retry_count = step.retry_count;
          }
        }
      });
      
      report += `**Test Failures:**\n\n`;
      Object.values(uniqueStepDetails).forEach((step, idx) => {
        report += `${idx + 1}. **${step.tc_id}** - ${step.tc_name}\n`;
        report += `   - File: \`${step.file_name || 'unknown.spec.js'}\`\n`;
        report += `   - Step: ${step.step_id} - ${step.step_name}\n`;
        if (step.retry_count > 1) {
          report += `   - Retries: ${step.retry_count}x\n`;
        }
        if (step.last_failed_build) {
          report += `   - Last Failed: Build #${step.last_failed_build} (recurring issue)\n`;
        } else {
          report += `   - 🆕 First occurrence\n`;
        }
        
        // Add snapshot URL if available
        if (step.snapshot_url) {
          const badge = step.false_alarm ? ' ⚠️ False Alarm' : '';
          report += `   - 📸 Snapshot: [View Diff](${step.snapshot_url})${badge}\n`;
        }
        
        // V2: Add concise error message (first line only, not full stack trace)
        if (step.full_error_msg) {
          // Extract only the first line (the actual error message)
          const firstLine = step.full_error_msg.split('\n')[0].replace(/^- Failed:/, '').trim();
          report += `   - ❌ Error: ${firstLine}\n\n`;
        } else if (step.failure_msg) {
          report += `   - ❌ Error: ${step.failure_msg}\n\n`;
        }
      });
    }
    
    const consoleLogPath = path.join(outputDir, `${jobName}_${buildNumber}_console.json`);
    if (fs.existsSync(consoleLogPath)) {
      try {
        const consoleData = JSON.parse(fs.readFileSync(consoleLogPath, 'utf8'));
        const consoleLog = consoleData.console || '';
        const cleanLog = sanitizeConsoleLog(consoleLog, 50);
        report += `<details>\n<summary>📋 Console Log (last 50 lines)</summary>\n\n\`\`\`\n`;
        report += cleanLog;
        report += `\n\`\`\`\n</details>\n\n`;
      } catch (error) {}
    }
    
    report += `[View in Jenkins](${JENKINS_URL}/job/${jobName}/${buildNumber}/)\n\n---\n\n`;
  });
} else {
  report += `*No failed jobs* 🎉\n\n`;
}

report += `\n---\n\n## 📝 Notes
- This report was automatically generated by the Jenkins QA Daily Agent
- **Failure Summary Table** provides quick overview of all failures
- **Detailed Analysis** section contains full investigation for each failure
- Report saved to: \`${outputDir}\`
---
**Legend:**
- 🚨 Production Failure = Product bug, file bug report
- 📝 Script Failure = Test code bug, fix test script
- ⚙️ Environment Failure = Infrastructure issue, retry after fix
- ⚙️ Configuration Failure = Setup issue, check config
- 🔗 Dependency Failure = External service issue, check dependencies
`;

const reportPath = path.join(outputDir, `${reportFolder}.md`);
fs.writeFileSync(reportPath, report, 'utf8');
if(db) db.close();

console.log(`✓ Report generated: ${reportPath}`);
};

if (require.main === module) { main().catch(console.error); }

module.exports = { main };
