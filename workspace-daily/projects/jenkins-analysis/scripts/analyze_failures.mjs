#!/usr/bin/env node

import fs from 'fs';

const JENKINS_URL = process.env.WEB_JENKINS_URL?.replace(/\/$/, "");
const JENKINS_USER = process.env.WEB_JENKINS_USER;
const JENKINS_API_TOKEN = process.env.WEB_JENKINS_API_TOKEN;

const auth = Buffer.from(`${JENKINS_USER}:${JENKINS_API_TOKEN}`).toString("base64");

const headers = {
  "Authorization": `Basic ${auth}`,
};

async function getConsoleLog(jobName, buildNumber) {
  const url = `${JENKINS_URL}/job/${encodeURIComponent(jobName)}/${buildNumber}/consoleText`;
  const res = await fetch(url, { headers });
  
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }
  
  return await res.text();
}

function analyzeLog(consoleLog) {
  const lines = consoleLog.split('\n');
  const analysis = {
    errorLines: [],
    failedTests: [],
    exceptionTraces: [],
    summary: ''
  };
  
  // Find ERROR lines
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('ERROR') || line.includes('FAILED') || line.includes('FAILURE')) {
      analysis.errorLines.push(line.trim());
    }
    
    // Find test failures
    if (line.includes('FAILED') && (line.includes('.spec.ts') || line.includes('.test.'))) {
      analysis.failedTests.push(line.trim());
    }
    
    // Find exception traces
    if (line.includes('Exception:') || line.includes('Error:') || line.includes('at ')) {
      const context = [];
      for (let j = Math.max(0, i - 2); j <= Math.min(lines.length - 1, i + 5); j++) {
        context.push(lines[j]);
      }
      analysis.exceptionTraces.push(context.join('\n'));
    }
  }
  
  // Generate summary from last 100 lines
  const lastLines = lines.slice(-100);
  const summaryKeywords = ['Tests:', 'Specs:', 'passed', 'failed', 'FAILED', 'ERROR', 'Exception'];
  
  const summaryLines = lastLines.filter(line => 
    summaryKeywords.some(kw => line.includes(kw))
  );
  
  analysis.summary = summaryLines.join('\n');
  
  // Deduplicate
  analysis.errorLines = [...new Set(analysis.errorLines)];
  analysis.failedTests = [...new Set(analysis.failedTests)];
  
  return analysis;
}

function formatTimestamp(ts) {
  return new Date(ts).toISOString().replace('T', ' ').substring(0, 19);
}

async function analyzeFailedJob(job) {
  console.log(`\nAnalyzing: ${job.name} (Build #${job.buildNumber})...`);
  
  try {
    const consoleLog = await getConsoleLog(job.name, job.buildNumber);
    const analysis = analyzeLog(consoleLog);
    
    // Create markdown report
    let report = `# ${job.name} - Build #${job.buildNumber} Analysis\n\n`;
    report += `**Source:** ${job.source}\n`;
    report += `**Result:** ${job.result}\n`;
    report += `**Build Number:** ${job.buildNumber}\n`;
    report += `**Timestamp:** ${formatTimestamp(job.timestamp)}\n`;
    report += `**URL:** ${job.url}${job.buildNumber}/\n\n`;
    
    report += `## Summary\n\n`;
    if (analysis.summary) {
      report += `\`\`\`\n${analysis.summary}\n\`\`\`\n\n`;
    } else {
      report += `No summary information found.\n\n`;
    }
    
    if (analysis.failedTests.length > 0) {
      report += `## Failed Tests (${analysis.failedTests.length})\n\n`;
      analysis.failedTests.slice(0, 20).forEach(test => {
        report += `- ${test}\n`;
      });
      if (analysis.failedTests.length > 20) {
        report += `\n... and ${analysis.failedTests.length - 20} more\n`;
      }
      report += `\n`;
    }
    
    if (analysis.errorLines.length > 0) {
      report += `## Error Lines (${analysis.errorLines.length})\n\n`;
      analysis.errorLines.slice(0, 30).forEach(err => {
        report += `- ${err}\n`;
      });
      if (analysis.errorLines.length > 30) {
        report += `\n... and ${analysis.errorLines.length - 30} more\n`;
      }
      report += `\n`;
    }
    
    if (analysis.exceptionTraces.length > 0) {
      report += `## Exception Traces\n\n`;
      analysis.exceptionTraces.slice(0, 3).forEach((trace, idx) => {
        report += `### Exception ${idx + 1}\n\n\`\`\`\n${trace}\n\`\`\`\n\n`;
      });
    }
    
    report += `## Console Log Tail (Last 200 lines)\n\n`;
    const logLines = consoleLog.split('\n');
    report += `\`\`\`\n${logLines.slice(-200).join('\n')}\n\`\`\`\n`;
    
    // Save report
    const filename = `${job.name}_${job.buildNumber}_analysis.md`;
    fs.writeFileSync(filename, report);
    console.log(`  ✓ Saved to: ${filename}`);
    
    return {
      job: job.name,
      buildNumber: job.buildNumber,
      filename,
      failedTestsCount: analysis.failedTests.length,
      errorLinesCount: analysis.errorLines.length
    };
    
  } catch (err) {
    console.error(`  ✗ Error analyzing ${job.name}:`, err.message);
    return {
      job: job.name,
      buildNumber: job.buildNumber,
      error: err.message
    };
  }
}

async function main() {
  const failedJobs = JSON.parse(fs.readFileSync('./failed_jobs.json', 'utf8'));
  
  console.log(`Analyzing ${failedJobs.length} failed jobs...\n`);
  
  const results = [];
  
  for (const job of failedJobs) {
    const result = await analyzeFailedJob(job);
    results.push(result);
    
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Save analysis summary
  fs.writeFileSync('./analysis_summary.json', JSON.stringify(results, null, 2));
  console.log(`\n✓ Analysis complete! Summary saved to: analysis_summary.json`);
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
