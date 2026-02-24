/**
 * Android Report Generator Module
 * Formats the DB payload into the Executive Summary and detailed Android Report 
 */

import fs from 'fs';
import path from 'path';

/**
 * Format markdown structure for Android CI
 */
function generateMarkdown(outputDir, triggerJob, triggerBuild) {
  const failedJobsPath = path.join(outputDir, 'failed_jobs.json');
  const passedJobsPath = path.join(outputDir, 'passed_jobs.json');

  let failedJobs = [];
  let passedJobs = [];

  try {
    if (fs.existsSync(failedJobsPath)) {
      failedJobs = JSON.parse(fs.readFileSync(failedJobsPath, 'utf8'));
    }
    if (fs.existsSync(passedJobsPath)) {
      passedJobs = JSON.parse(fs.readFileSync(passedJobsPath, 'utf8'));
    }
  } catch(e) {
    console.warn("Failed retrieving job metrics during reporting", e);
  }

  const totalRuns = failedJobs.length + passedJobs.length;
  // Calculate reruns internally
  const rerunsAttempted = failedJobs.filter(j => j.rerun !== null).length;
  const rerunStillFailing = failedJobs.filter(j => j.rerun && j.rerun.result !== 'SUCCESS').length;

  const dateStr = new Date().toISOString().split('T')[0];

  let md = `# Android Library CI Report — ${triggerJob} #${triggerBuild}\n`;
  md += `**Date:** ${dateStr}  **Build:** #${triggerBuild}  **Triggered by:** Timer\n\n`;

  md += `## Executive Summary\n`;
  md += `- Total Library jobs: ${totalRuns}\n`;
  md += `- Passed: ${passedJobs.length} (${((passedJobs.length / totalRuns) * 100).toFixed(1)}%)\n`;
  md += `- Failed: ${failedJobs.length} (${((failedJobs.length / totalRuns) * 100).toFixed(1)}%)\n`;
  md += `  - Of which re-runs attempted: ${rerunsAttempted}\n`;
  md += `    - Re-run fixed: ${rerunsAttempted - rerunStillFailing} (excluded from failure details)\n`;
  md += `    - Re-run still failing: ${rerunStillFailing}\n\n`;

  md += `## Passed Jobs (${passedJobs.length})\n`;
  if (passedJobs.length > 0) {
    passedJobs.forEach(pj => {
      md += `- ${pj.jobName} #${pj.buildNum}\n`;
    });
  } else {
    md += `- None\n`;
  }
  md += `\n`;

  md += `## Failed Jobs (${failedJobs.length})\n\n`;

  // Attach failures with detailed table
  const failuresExtentPath = path.join(outputDir, 'extent_failures.json');
  let loadedFailures = [];
  if (fs.existsSync(failuresExtentPath)) {
    loadedFailures = JSON.parse(fs.readFileSync(failuresExtentPath, 'utf8'));
  }

  failedJobs.forEach(fj => {
    const isRerun = fj.rerun;
    let titleLine = `### ${fj.jobName} #${fj.buildNum}`;
    
    // Add Re-run markup if matched
    if (isRerun) {
      const icon = isRerun.result === 'SUCCESS' ? '✅ FIXED' : '❌ STILL FAILING';
      titleLine += ` ⟳ Re-run #${isRerun.buildNum} ${icon}`;
    }

    md += `${titleLine}\n`;

    const jobURL = `http://ci-master.labs.microstrategy.com:8011/job/${fj.jobName}/${fj.buildNum}/`;
    if (isRerun) {
      const rerunURL = `http://ci-master.labs.microstrategy.com:8011/job/${fj.jobName}/${isRerun.buildNum}/`;
      md += `**ExtentReport:** [Run #${fj.buildNum}](${jobURL}ExtentReport/) | [Re-run #${isRerun.buildNum}](${rerunURL}ExtentReport/)\n\n`;
    } else {
      md += `**ExtentReport:** [View](${jobURL}ExtentReport/)  \n`;
      md += `**Build:** [View in Jenkins](${jobURL})\n\n`;
    }

    const jobFails = loadedFailures.filter(lf => lf.jobName === fj.jobName);
    
    if (jobFails.length > 0) {
      md += `| TC ID | Test Name | Failure Type | Failed Step | Last Failed | Recurring |\n`;
      md += `|-------|-----------|--------------|-------------|-------------|-----------|\n`;
      
      jobFails.forEach(jf => {
         const t = jf.testResult;
         // Assume this data maps loosely 
         const recurrSymbol = '🔁 Yes'; 
         md += `| ${t.tcId || 'N/A'} | ${t.testName} | ${jf.failureType} | ${t.failedStepName} | #--- | ${recurrSymbol} |\n`;
      });
      md += `\n`;

      // Expandable details block
      jobFails.forEach(jf => {
        const t = jf.testResult;
        md += `<details>\n<summary>${t.testName} — Failure Details</summary>\n\n`;
        md += `**TC ID:** ${t.tcId || 'N/A'}  \n`;
        md += `**Config URL:** \`${t.configUrl || 'Unknown'}\`  \n`;
        md += `**Failed Step:** \`${t.failedStepName || 'Unknown step'}\`  \n`;
        md += `**Details:** ${(t.failedStepDetails || '').slice(0, 300)}...  \n`;
        md += `\n</details>\n\n`;
      });
    } else {
       md += `> _Failure context could not be extracted explicitly from ExtentReport._ \n\n`;
    }
    
    md += `---\n\n`;
  });

  const mdFile = path.join(outputDir, 'android_report.md');
  fs.writeFileSync(mdFile, md, 'utf8');
}

const args = process.argv.slice(2);
if (args.length >= 3) {
  const [outputDir, triggerJob, triggerBuild] = args;
  generateMarkdown(outputDir, triggerJob, triggerBuild);
} else {
  console.log('Usage: node generate_android_report.mjs <outputDir> <triggerJob> <triggerBuild>');
}
