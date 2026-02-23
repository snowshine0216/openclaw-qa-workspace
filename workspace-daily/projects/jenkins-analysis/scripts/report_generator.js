#!/usr/bin/env node
/**
 * Report Generator - Creates consolidated markdown report with failure table
 */

const fs = require('fs');
const path = require('path');

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

/**
 * Extract failed test count from console log
 */
function extractFailedTestCount(consoleLog) {
  if (!consoleLog) return 'N/A';
  
  // Look for pattern: "X failed, Y passed"
  const match = consoleLog.match(/(\d+)\s+failed.*?(\d+)\s+passed/i);
  if (match) {
    return match[1]; // Failed count
  }
  
  // Look for "Spec Files: X passed, Y failed"
  const specMatch = consoleLog.match(/Spec Files:.*?(\d+)\s+failed/i);
  if (specMatch) {
    return specMatch[1];
  }
  
  return '1'; // Default to 1 if we can't parse
}

/**
 * Extract screenshot/snapshot links from console log
 */
function extractSnapshotLinks(consoleLog, jobName, buildNumber) {
  if (!consoleLog) return null;
  
  // Look for Allure report path
  const allureMatch = consoleLog.match(/Allure report.*generated to (.+)/i);
  if (allureMatch) {
    return `${JENKINS_URL}/job/${jobName}/${buildNumber}/allure/`;
  }
  
  // Check if screenshots mentioned
  if (/screenshot|snapshot|allure/i.test(consoleLog)) {
    return `${JENKINS_URL}/job/${jobName}/${buildNumber}/artifact/`;
  }
  
  return null;
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

| Job | Failed Steps | Category | Root Cause | Last Failed | Snapshot | Suggestion |
|-----|-------------|----------|------------|-------------|----------|------------|
`;

  failedJobs.forEach(job => {
    const jobName = job.name;
    const buildNumber = job.number;
    const jobLink = `[${jobName} #${buildNumber}](${JENKINS_URL}/job/${jobName}/${buildNumber}/)`;
    
    // Load analysis
    const analysisPath = path.join(outputDir, `${jobName}_${buildNumber}_analysis.json`);
    let analysis = null;
    if (fs.existsSync(analysisPath)) {
      try {
        analysis = JSON.parse(fs.readFileSync(analysisPath, 'utf8'));
      } catch (error) {
        console.error(`Error reading analysis: ${error.message}`);
      }
    }
    
    // Load history
    const historyPath = path.join(outputDir, `${jobName}_${buildNumber}_history.json`);
    let history = null;
    if (fs.existsSync(historyPath)) {
      try {
        history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
      } catch (error) {
        console.error(`Error reading history: ${error.message}`);
      }
    }
    
    // Load console log
    const consoleLogPath = path.join(outputDir, `${jobName}_${buildNumber}_console.json`);
    let consoleLog = '';
    if (fs.existsSync(consoleLogPath)) {
      try {
        const consoleData = JSON.parse(fs.readFileSync(consoleLogPath, 'utf8'));
        consoleLog = consoleData.console || '';
      } catch (error) {
        console.error(`Error reading console log: ${error.message}`);
      }
    }
    
    // Extract data
    const failedSteps = extractFailedTestCount(consoleLog);
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
    
    // Format last failed info
    let lastFailedCell = 'First failure';
    if (history && history.previousFailures && history.previousFailures.length > 0) {
      const lastFailed = history.previousFailures[0];
      const consecutiveCount = history.consecutiveFailures || 1;
      const failureList = history.previousFailures.slice(0, 3).join(', ');
      
      if (consecutiveCount > 1) {
        lastFailedCell = `🔴 #${lastFailed} (${consecutiveCount}x consecutive)`;
      } else {
        lastFailedCell = `#${lastFailed} (also: ${failureList})`;
      }
    }
    
    const snapshotLink = extractSnapshotLinks(consoleLog, jobName, buildNumber);
    const snapshotCell = snapshotLink ? `[📸 View](${snapshotLink})` : 'N/A';
    
    // Get first action as suggestion
    const suggestion = analysis && analysis.actions && analysis.actions.length > 0 
      ? truncate(analysis.actions[0], 45)
      : 'See details below';
    
    report += `| ${jobLink} | ${failedSteps} | ${categoryIcon} ${category} | ${rootCause} | ${lastFailedCell} | ${snapshotCell} | ${suggestion} |\n`;
  });
  
  report += `\n**Legend:**  \n`;
  report += `- **Last Failed:** Shows if this job also failed in previous builds (checks last 5 builds)  \n`;
  report += `- **🔴 Consecutive:** Job failed multiple times in a row (indicates ongoing issue)  \n`;
  report += `- **First failure:** Job hasn't failed in the last 5 builds  \n`;
  report += `\n---\n\n`;
}

// Add passed jobs section
report += `## ✅ Passed Jobs (${passedJobs.length})

`;

if (passedJobs.length > 0) {
  passedJobs.forEach(job => {
    const jobLink = `[${job.name} #${job.number}](${JENKINS_URL}/job/${job.name}/${job.number}/)`;
    report += `- ${jobLink}\n`;
  });
} else {
  report += `*No passed jobs*\n`;
}

report += `\n---\n\n## 📋 Detailed Failure Analysis\n\n`;

// Add detailed analysis for each failed job
if (failedJobs.length > 0) {
  failedJobs.forEach(job => {
    const jobName = job.name;
    const buildNumber = job.number;
    
    report += `### ${jobName} #${buildNumber}\n\n`;
    
    // Load AI analysis
    const analysisPath = path.join(outputDir, `${jobName}_${buildNumber}_analysis.json`);
    let analysis = null;
    
    if (fs.existsSync(analysisPath)) {
      try {
        analysis = JSON.parse(fs.readFileSync(analysisPath, 'utf8'));
      } catch (error) {
        console.error(`Error reading analysis for ${jobName}: ${error.message}`);
      }
    }
    
    if (analysis) {
      // Display AI analysis results
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
      if (analysis.confidence) {
        report += ` (Confidence: ${analysis.confidence})`;
      }
      report += `\n\n`;
      
      // Add historical context
      const historyPath = path.join(outputDir, `${jobName}_${buildNumber}_history.json`);
      let history = null;
      if (fs.existsSync(historyPath)) {
        try {
          history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
        } catch (error) {
          // Ignore
        }
      }
      
      if (history && history.previousFailures && history.previousFailures.length > 0) {
        const consecutiveCount = history.consecutiveFailures || 1;
        const totalFails = history.failureCount;
        const failedBuilds = history.previousFailures.join(', ');
        
        if (consecutiveCount > 2) {
          report += `> 🔴 **RECURRING ISSUE**: Failed ${consecutiveCount} times consecutively (current + builds: ${failedBuilds})\n`;
          report += `> **Action Required:** This is an ongoing problem that needs immediate attention.\n\n`;
        } else if (totalFails > 0) {
          report += `> ⚠️ **Historical Context**: Also failed in builds: ${failedBuilds}\n\n`;
        }
      } else {
        report += `> ℹ️ **First occurrence** in the last 5 builds\n\n`;
      }
      
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
    
    // Console log
    const consoleLogPath = path.join(outputDir, `${jobName}_${buildNumber}_console.json`);
    if (fs.existsSync(consoleLogPath)) {
      try {
        const consoleData = JSON.parse(fs.readFileSync(consoleLogPath, 'utf8'));
        const consoleLog = consoleData.console || '';
        
        report += `<details>\n<summary>📋 Console Log (last 50 lines)</summary>\n\n\`\`\`\n`;
        report += consoleLog.split('\n').slice(-50).join('\n');
        report += `\n\`\`\`\n</details>\n\n`;
        
      } catch (error) {
        report += `*Error reading console log: ${error.message}*\n\n`;
      }
    }
    
    report += `[View in Jenkins](${JENKINS_URL}/job/${jobName}/${buildNumber}/)\n\n`;
    report += `---\n\n`;
  });
} else {
  report += `*No failed jobs* 🎉\n\n`;
}

// Footer
report += `\n---\n\n## 📝 Notes

- This report was automatically generated by the Jenkins QA Daily Agent
- **Failure Summary Table** provides quick overview of all failures
- **Detailed Analysis** section contains full investigation for each failure
- For console logs and artifacts, click the job links
- Report saved to: \`${outputDir}\`

---

**Legend:**
- 🚨 Production Failure = Product bug, file bug report
- 📝 Script Failure = Test code bug, fix test script
- ⚙️ Environment Failure = Infrastructure issue, retry after fix
- ⚙️ Configuration Failure = Setup issue, check config
- 🔗 Dependency Failure = External service issue, check dependencies
`;

// Write report
const reportPath = path.join(outputDir, `${reportFolder}.md`);
fs.writeFileSync(reportPath, report, 'utf8');

console.log(`✓ Report generated: ${reportPath}`);
