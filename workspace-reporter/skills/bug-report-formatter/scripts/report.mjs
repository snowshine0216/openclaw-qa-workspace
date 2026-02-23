#!/usr/bin/env node

/**
 * Bug Report Formatter Script
 * Generate standardized bug reports and create Jira issues
 * 
 * Usage:
 *   node scripts/report.mjs                    # Interactive mode
 *   node scripts/report.mjs --quick "summary"  # Quick report
 *   node scripts/report.mjs --file template.md  # From file
 *   node scripts/report.mjs --jira            # Create in Jira
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';

const args = process.argv.slice(2);

// Help
if (args[0] === '--help' || args[0] === '-h') {
  console.log(`
Bug Report Formatter

Usage:
  node scripts/report.mjs                    # Interactive mode
  node scripts/report.mjs --quick "summary"  # Quick bug report
  node scripts/report.mjs --file template.md  # From markdown file
  node scripts/report.mjs --jira             # Create in Jira

Options:
  --priority=P0|P1|P2|P3  Set priority
  --severity=S           Set severity (Critical/High/Medium/Low)
  --output=FILE          Save to file
  --dry-run              Show report without creating Jira

Interactive Mode:
  1. Enter bug summary
  2. Describe steps to reproduce
  3. Enter expected vs actual results
  4. Set severity/priority
  5. Capture environment info
`);
  process.exit(0);
}

// Parse options
let options = {
  mode: 'interactive',
  quick: null,
  file: null,
  createJira: false,
  priority: null,
  severity: null,
  output: null,
  dryRun: false
};

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--jira') options.createJira = true;
  else if (arg === '--dry-run') options.dryRun = true;
  else if (arg.startsWith('--quick=')) options.quick = arg.split('=')[1];
  else if (arg.startsWith('--file=')) options.file = arg.split('=')[1];
  else if (arg.startsWith('--priority=')) options.priority = arg.split('=')[1];
  else if (arg.startsWith('--severity=')) options.severity = arg.split('=')[1];
  else if (arg.startsWith('--output=')) options.output = arg.split('=')[1];
}

// Run in specified mode
if (options.quick) {
  generateQuickReport(options.quick);
} else if (options.file) {
  generateFromFile(options.file);
} else if (options.createJira) {
  createJiraIssue();
} else {
  interactiveMode();
}

function generateQuickReport(summary) {
  console.log('\n🐛 Quick Bug Report\n');
  console.log('═'.repeat(40));
  
  const bug = {
    summary: options summary,
    priority: options.priority || 'P2.quick ||',
    severity: options.severity || 'Medium',
    timestamp: new Date().toISOString()
  };
  
  const report = generateBugReport(bug);
  console.log(report);
  
  if (options.output) {
    writeFileSync(options.output, report);
    console.log(`\n✅ Saved to ${options.output}`);
  }
}

function generateFromFile(filePath) {
  console.log(`\n📄 Generating from ${filePath}...\n`);
  
  if (!existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    process.exit(1);
  }
  
  const content = readFileSync(filePath, 'utf-8');
  const bug = parseBugFromFile(content);
  const report = generateBugReport(bug);
  
  console.log(report);
  
  if (options.output) {
    writeFileSync(options.output, report);
    console.log(`\n✅ Saved to ${options.output}`);
  }
}

function interactiveMode() {
  console.log('\n🐛 Bug Report Generator\n');
  console.log('═'.repeat(40));
  
  const bug = {
    timestamp: new Date().toISOString(),
    environment: {}
  };
  
  // Summary
  console.log('\n1️⃣ Bug Summary');
  bug.summary = prompt('   Summary: ', '');
  bug.feature = prompt('   Feature/Module: ', '');
  
  // Steps
  console.log('\n2️⃣ Steps to Reproduce');
  bug.steps = [];
  let stepNum = 1;
  while (true) {
    const step = prompt(`   Step ${stepNum} (Enter to skip): `);
    if (!step) break;
    bug.steps.push(step);
    stepNum++;
  }
  
  // Results
  console.log('\n3️⃣ Expected vs Actual');
  bug.expected = prompt('   Expected result: ', '');
  bug.actual = prompt('   Actual result: ', '');
  
  // Severity/Priority
  console.log('\n4️⃣ Severity & Priority');
  bug.severity = prompt('   Severity (Critical/High/Medium/Low): ', options.severity || 'Medium');
  bug.priority = prompt('   Priority (P0/P1/P2/P3): ', options.priority || 'P2');
  
  // Environment
  console.log('\n5️⃣ Environment');
  bug.environment.url = prompt('   URL: ', '');
  bug.environment.browser = prompt('   Browser: ', '');
  bug.environment.os = prompt('   OS: ', '');
  
  // Screenshots
  console.log('\n6️⃣ Screenshots');
  bug.screenshots = [];
  let screenshotNum = 1;
  while (true) {
    const screenshot = prompt(`   Screenshot path ${screenshotNum} (Enter to skip): `);
    if (!screenshot) break;
    bug.screenshots.push(screenshot);
    screenshotNum++;
  }
  
  // Generate report
  const report = generateBugReport(bug);
  console.log('\n' + '═'.repeat(40));
  console.log('\n📋 Generated Bug Report:\n');
  console.log(report);
  
  // Jira option
  if (options.createJira && !options.dryRun) {
    console.log('\n🚀 Creating Jira issue...');
    createJiraFromReport(report);
  } else if (options.dryRun) {
    console.log('\n🔍 Dry run - not creating Jira issue');
  }
  
  if (options.output) {
    writeFileSync(options.output, report);
    console.log(`\n✅ Saved to ${options.output}`);
  }
}

function createJiraIssue() {
  console.log('\n🚀 Creating Jira Issue...\n');
  
  const summary = prompt('Bug Summary: ', '');
  const priority = prompt('Priority (P0/P1/P2/P3): ', 'P2');
  const description = prompt('Description (markdown): ', '');
  
  try {
    const issueKey = execSync(
      `jira issue create --summary "${summary}" --type Bug --priority ${priority} --description "${description.replace(/"/g, '\\"')}" --plain`,
      { encoding: 'utf-8' }
    );
    console.log(`\n✅ Jira issue created: ${issueKey}`);
  } catch (e) {
    console.log('\n❌ Failed to create Jira issue');
    console.log('Run with --dry-run to preview first');
  }
}

function createJiraFromReport(report) {
  const lines = report.split('\n');
  const summary = lines.find(l => l.startsWith('**Summary:**'))?.replace('**Summary:**', '').trim();
  
  if (summary) {
    try {
      const output = execSync(
        `jira issue create --summary "${summary}" --type Bug --priority ${options.priority || 'P2'} --description "${report.replace(/"/g, '\\"').substring(0, 500)}"`,
        { encoding: 'utf-8' }
      );
      console.log(`\n✅ Jira issue created: ${output}`);
    } catch (e) {
      console.log('\n❌ Jira creation failed:', e.message);
    }
  }
}

function parseBugFromFile(content) {
  const bug = {
    timestamp: new Date().toISOString(),
    steps: [],
    environment: {},
    screenshots: []
  };
  
  const lines = content.split('\n');
  let currentSection = '';
  
  for (const line of lines) {
    if (line.startsWith('**Summary:**')) {
      bug.summary = line.replace('**Summary:**', '').trim();
    } else if (line.startsWith('**Steps:**')) {
      currentSection = 'steps';
    } else if (line.startsWith('**Expected:**')) {
      bug.expected = line.replace('**Expected:**', '').trim();
    } else if (line.startsWith('**Actual:**')) {
      bug.actual = line.replace('**Actual:**', '').trim();
    } else if (line.startsWith('- ')) {
      if (currentSection === 'steps') {
        bug.steps.push(line.replace('- ', '').trim());
      }
    }
  }
  
  return bug;
}

function generateBugReport(bug) {
  let report = '';
  
  report += `**Summary:** ${bug.summary || 'Untitled Bug'}\n`;
  if (bug.feature) report += `**Feature:** ${bug.feature}\n`;
  report += `**Priority:** ${bug.priority || 'P2'} | **Severity:** ${bug.severity || 'Medium'}\n`;
  report += `**Date:** ${bug.timestamp || new Date().toISOString()}\n\n`;
  
  report += `## Description\n${bug.summary}\n\n`;
  
  report += `## Steps to Reproduce\n`;
  if (bug.steps && bug.steps.length > 0) {
    bug.steps.forEach((step, i) => {
      report += `${i + 1}. ${step}\n`;
    });
  } else {
    report += `1. [Step to reproduce]\n`;
  }
  report += '\n';
  
  report += `## Expected Result\n${bug.expected || '[Expected behavior]'}\n\n`;
  report += `## Actual Result\n${bug.actual || '[Actual behavior]'}\n\n`;
  
  if (bug.environment) {
    report += `## Environment\n`;
    report += `- **URL:** ${bug.environment.url || 'N/A'}\n`;
    report += `- **Browser:** ${bug.environment.browser || 'N/A'}\n`;
    report += `- **OS:** ${bug.environment.os || 'N/A'}\n\n`;
  }
  
  if (bug.screenshots && bug.screenshots.length > 0) {
    report += `## Screenshots\n`;
    bug.screenshots.forEach((screenshot, i) => {
      report += `![Screenshot ${i + 1}](${screenshot})\n`;
    });
    report += '\n';
  }
  
  report += `## Additional Info\n`;
  report += `- [ ] Console errors captured\n`;
  report += `- [ ] Test data documented\n`;
  report += `- [ ] Related tickets linked\n`;
  
  return report;
}

// Helper function
function prompt(question, defaultValue) {
  const readline = require('readline');
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  
  return new Promise((resolve) => {
    const questionText = defaultValue 
      ? `${question} [${defaultValue}]: `
      : `${question}: `;
    
    rl.question(questionText, (answer) => {
      rl.close();
      resolve(answer.trim() || defaultValue || '');
    });
  });
}
