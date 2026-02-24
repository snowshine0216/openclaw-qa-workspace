#!/usr/bin/env node
/**
 * Report Generator - Creates consolidated markdown report with DB-backed failure table
 */

const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

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
try {
  db = new Database(dbPath, { fileMustExist: true });
} catch (e) {
  console.error("No database found or error connecting:", e.message);
}

/**
 * Truncate text to max length
 */
function truncate(text, maxLength = 80) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

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

---

`;

// Add failure summary table if there are failures
if (failedJobs.length > 0) {
  report += `## ⚠️ Failure Summary Table

| Job | TC ID | Step ID | Category | Root Cause | Last Failed Build | Snapshot | Suggestion |
|-----|-------|---------|----------|------------|-------------------|----------|------------|
`;

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

    const category = analysis ? analysis.failureType : 'Unknown';
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
      steps.forEach(step => {
        let snapshotCell = 'N/A';
        if (step.snapshot_url) {
          const badge = step.false_alarm ? ' ⚠️ FA' : '';
          snapshotCell = `[📸 View](${step.snapshot_url})${badge}`;
        }
        
        let lastFailedCell = 'First failure';
        if (step.last_failed_build) {
          lastFailedCell = `#${step.last_failed_build}`;
        }

        report += `| ${jobLinkDocx} | ${step.tc_id} | ${step.step_id} | ${categoryIcon} ${category} | ${rootCause} | ${lastFailedCell} | ${snapshotCell} | ${suggestion} |\n`;
      });
    } else {
      // Fallback if no steps found in DB
      let lastFailedCell = 'Unknown';
      report += `| ${jobLinkDocx} | N/A | N/A | ${categoryIcon} ${category} | ${rootCause} | ${lastFailedCell} | N/A | ${suggestion} |\n`;
    }
  });
  
  report += `\n**Legend:**  \n`;
  report += `- **Last Failed Build:** Shows build number if this step failed in previous builds  \n`;
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
    
    report += `### ${jobName} #${buildNumber}\n\n`;
    
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
    
    const consoleLogPath = path.join(outputDir, `${jobName}_${buildNumber}_console.json`);
    if (fs.existsSync(consoleLogPath)) {
      try {
        const consoleData = JSON.parse(fs.readFileSync(consoleLogPath, 'utf8'));
        const consoleLog = consoleData.console || '';
        report += `<details>\n<summary>📋 Console Log (last 50 lines)</summary>\n\n\`\`\`\n`;
        report += consoleLog.split('\n').slice(-50).join('\n');
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
