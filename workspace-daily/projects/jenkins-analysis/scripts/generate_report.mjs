#!/usr/bin/env node

import fs from 'fs';

function formatTimestamp(ts) {
  return new Date(ts).toISOString().replace('T', ' ').substring(0, 19);
}

function getDate() {
  return new Date().toISOString().split('T')[0];
}

async function main() {
  const allJobsData = JSON.parse(fs.readFileSync('./jobs_data.json', 'utf8'));
  const failedJobs = JSON.parse(fs.readFileSync('./failed_jobs.json', 'utf8'));
  const passedJobs = JSON.parse(fs.readFileSync('./passed_jobs.json', 'utf8'));
  const analysisSummary = JSON.parse(fs.readFileSync('./analysis_summary.json', 'utf8'));
  
  const reportDate = getDate();
  let report = `# Jenkins Daily QA Report - ${reportDate}\n\n`;
  
  // Executive Summary
  report += `## 📊 Executive Summary\n\n`;
  
  const sources = ['ReportEditor', 'SubscriptionWebTest', 'CustomAppWebTest', 'Dashboard_TemplateCreator'];
  let totalJobs = 0;
  let totalPassed = 0;
  let totalFailed = 0;
  let totalNotBuilt = 0;
  
  report += `| View/Job | Total | Passed | Failed | Not Built |\n`;
  report += `|----------|-------|--------|--------|-----------|\n`;
  
  for (const source of sources) {
    const jobs = allJobsData[source] || [];
    const sourceTotal = jobs.length;
    const sourcePassed = jobs.filter(j => j.lastBuild?.result === 'SUCCESS').length;
    const sourceFailed = jobs.filter(j => j.lastBuild && ['FAILURE', 'UNSTABLE'].includes(j.lastBuild.result)).length;
    const sourceNotBuilt = jobs.filter(j => !j.lastBuild).length;
    
    report += `| ${source} | ${sourceTotal} | ${sourcePassed} | ${sourceFailed} | ${sourceNotBuilt} |\n`;
    
    totalJobs += sourceTotal;
    totalPassed += sourcePassed;
    totalFailed += sourceFailed;
    totalNotBuilt += sourceNotBuilt;
  }
  
  report += `| **TOTAL** | **${totalJobs}** | **${totalPassed}** | **${totalFailed}** | **${totalNotBuilt}** |\n\n`;
  
  const passRate = ((totalPassed / (totalJobs - totalNotBuilt)) * 100).toFixed(1);
  report += `**Overall Pass Rate:** ${passRate}% (${totalPassed}/${totalJobs - totalNotBuilt} builds)\n\n`;
  
  // Quick Status
  report += `### 🚦 Quick Status\n\n`;
  report += `- ✅ **Passed Jobs:** ${totalPassed}\n`;
  report += `- ❌ **Failed Jobs:** ${totalFailed}\n`;
  report += `- ⚪ **Not Built:** ${totalNotBuilt}\n\n`;
  
  // Passed Jobs List
  report += `## ✅ Passed Jobs (${passedJobs.length})\n\n`;
  
  for (const source of sources) {
    const sourcePassedJobs = passedJobs.filter(j => j.source === source);
    if (sourcePassedJobs.length > 0) {
      report += `### ${source} (${sourcePassedJobs.length} passed)\n\n`;
      sourcePassedJobs.forEach(job => {
        report += `- **${job.name}** - Build #${job.buildNumber}\n`;
      });
      report += `\n`;
    }
  }
  
  // Failed Jobs with Details
  report += `## ❌ Failed Jobs (${failedJobs.length})\n\n`;
  
  for (const source of sources) {
    const sourceFailedJobs = failedJobs.filter(j => j.source === source);
    if (sourceFailedJobs.length > 0) {
      report += `### ${source} (${sourceFailedJobs.length} failed)\n\n`;
      
      for (const job of sourceFailedJobs) {
        const analysis = analysisSummary.find(a => a.job === job.name && a.buildNumber === job.buildNumber);
        
        report += `#### ${job.name}\n\n`;
        report += `- **Build:** #${job.buildNumber}\n`;
        report += `- **Result:** ${job.result}\n`;
        report += `- **Timestamp:** ${formatTimestamp(job.timestamp)}\n`;
        report += `- **URL:** [View Build](${job.url}${job.buildNumber}/)\n`;
        
        if (analysis && !analysis.error) {
          report += `- **Failed Tests:** ${analysis.failedTestsCount}\n`;
          report += `- **Error Lines:** ${analysis.errorLinesCount}\n`;
          report += `- **Detailed Analysis:** [${analysis.filename}](./${analysis.filename})\n`;
        } else if (analysis && analysis.error) {
          report += `- **Analysis Error:** ${analysis.error}\n`;
        }
        
        report += `\n`;
      }
    }
  }
  
  // Not Built Jobs
  const notBuiltJobs = [];
  for (const source of sources) {
    const jobs = allJobsData[source] || [];
    const sourceNotBuilt = jobs.filter(j => !j.lastBuild || j.color === 'notbuilt' || j.color === 'disabled');
    sourceNotBuilt.forEach(j => {
      notBuiltJobs.push({ source, name: j.name, color: j.color, url: j.url });
    });
  }
  
  if (notBuiltJobs.length > 0) {
    report += `## ⚪ Not Built / Disabled Jobs (${notBuiltJobs.length})\n\n`;
    for (const job of notBuiltJobs) {
      report += `- **${job.name}** (${job.source}) - Status: ${job.color}\n`;
    }
    report += `\n`;
  }
  
  // Action Items
  report += `## 🎯 Action Items\n\n`;
  report += `1. **Priority 1:** Investigate and fix ${totalFailed} failed jobs\n`;
  report += `2. **Priority 2:** Review detailed analysis files for each failure\n`;
  report += `3. **Priority 3:** Re-run or enable ${totalNotBuilt} not-built jobs if needed\n\n`;
  
  // Report Generation Info
  report += `---\n\n`;
  report += `**Report Generated:** ${new Date().toISOString()}\n`;
  report += `**Jenkins Server:** ${process.env.WEB_JENKINS_URL}\n`;
  report += `**Analysis Files Location:** \`${process.cwd()}\`\n`;
  
  // Save main report
  const reportFilename = `jenkins_daily_report_${reportDate}.md`;
  fs.writeFileSync(reportFilename, report);
  
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📋 JENKINS DAILY QA REPORT GENERATED`);
  console.log(`${'='.repeat(60)}`);
  console.log(`\nReport Date: ${reportDate}`);
  console.log(`Report File: ${reportFilename}`);
  console.log(`\nSummary:`);
  console.log(`  Total Jobs: ${totalJobs}`);
  console.log(`  ✅ Passed: ${totalPassed}`);
  console.log(`  ❌ Failed: ${totalFailed}`);
  console.log(`  ⚪ Not Built: ${totalNotBuilt}`);
  console.log(`  Pass Rate: ${passRate}%`);
  console.log(`\nDetailed analysis files created: ${analysisSummary.length}`);
  console.log(`\n${'='.repeat(60)}\n`);
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
