#!/usr/bin/env node

/**
 * QA Daily Workflow Script
 * Automate daily QA tasks: morning check, test execution, bug logging, end-of-day summary
 * 
 * Usage:
 *   node scripts/daily.mjs morning          # Morning routine
 *   node scripts/daily.mjs bugs             # Log pending bugs
 *   node scripts/daily.mjs summary          # End of day summary
 *   node scripts/daily.mjs all             # Full daily workflow
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';

const args = process.argv.slice(2);
const action = args[0] || 'all';
const date = new Date().toISOString().split('T')[0];

// Colors for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

console.log(`${colors.cyan}╔══════════════════════════════════════╗${colors.reset}`);
console.log(`${colors.cyan}║     QA Daily Workflow - ${date}       ║${colors.reset}`);
console.log(`${colors.cyan}╚══════════════════════════════════════╝${colors.reset}\n`);

switch (action) {
  case 'morning':
    morningRoutine();
    break;
  case 'bugs':
    logPendingBugs();
    break;
  case 'summary':
    endOfDaySummary();
    break;
  case 'all':
    morningRoutine();
    console.log('\n');
    endOfDaySummary();
    break;
  default:
    console.log('Usage: daily.mjs <morning|bugs|summary|all>');
}

function morningRoutine() {
  console.log(`${colors.blue}🌅 Morning Routine${colors.reset}\n`);
  
  console.log('1️⃣  Checking Jira for assigned issues...');
  try {
    const issues = execSync('jira issue list -a$(jira me) -s"To Do,In Progress" --plain 2>/dev/null || echo "No issues found"', { encoding: 'utf-8' });
    console.log(issues || 'No assigned issues found');
  } catch (e) {
    console.log(`${colors.yellow}⚠️  Unable to fetch Jira issues${colors.reset}`);
  }
  
  console.log('\n2️⃣  Reviewing yesterday\'s completed work...');
  try {
    const completed = execSync('jira issue list -sDone --created day -r$(jira me) --plain 2>/dev/null || echo "No completed issues"', { encoding: 'utf-8' });
    console.log(completed || 'No completed issues');
  } catch (e) {
    console.log(`${colors.yellow}⚠️  Unable to fetch completed issues${colors.reset}`);
  }
  
  console.log('\n3️⃣  Today\'s priority checklist:');
  console.log('   [ ] Feature tests due this week');
  console.log('   [ ] Regression coverage needed');
  console.log('   [ ] Bug fixes to verify');
  console.log('   [ ] Performance tests if needed');
  
  console.log(`\n${colors.green}✅ Morning routine complete${colors.reset}`);
}

function logPendingBugs() {
  console.log(`${colors.red}🐛 Pending Bug Review${colors.reset}\n`);
  
  console.log('Recent bugs created by you:');
  try {
    const bugs = execSync('jira issue list -tBug -r$(jira me) --created week --plain 2>/dev/null || echo "No recent bugs"', { encoding: 'utf-8' });
    console.log(bugs || 'No recent bugs');
  } catch (e) {
    console.log(`${colors.yellow}⚠️  Unable to fetch bugs${colors.reset}`);
  }
  
  console.log('\nOpen bugs waiting for fix:');
  try {
    const open = execSync('jira issue list -tBug -s"Open" -r$(jira me) --plain 2>/dev/null || echo "No open bugs"', { encoding: 'utf-8' });
    console.log(open || 'No open bugs');
  } catch (e) {
    console.log(`${colors.yellow}⚠️  Unable to fetch open bugs${colors.reset}`);
  }
}

function endOfDaySummary() {
  console.log(`${colors.blue}🌙 End of Day Summary${colors.reset}\n`);
  
  console.log('📊 Today\'s completed work:');
  try {
    const completed = execSync('jira issue list -sDone --created day -r$(jira me) --plain 2>/dev/null || echo "No completed today"', { encoding: 'utf-8' });
    console.log(completed || 'No completed today');
  } catch (e) {
    console.log(`${colors.yellow}⚠️  Unable to fetch completed issues${colors.reset}`);
  }
  
  console.log('\n📋 Open items for tomorrow:');
  try {
    const open = execSync('jira issue list -s"To Do,In Progress" -a$(jira me) --plain 2>/dev/null || echo "No open items"', { encoding: 'utf-8' });
    console.log(open || 'No open items');
  } catch (e) {
    console.log(`${colors.yellow}⚠️  Unable to fetch open items${colors.reset}`);
  }
  
  console.log('\n📝 Notes for tomorrow:');
  console.log('   - ________________________________');
  console.log('   - ________________________________');
  console.log('   - ________________________________');
  
  console.log('\n✅ End of day summary complete');
}

// Export for use in other scripts
export function getTodayIssues() {
  try {
    return execSync('jira issue list --created day -r$(jira me) --plain', { encoding: 'utf-8' });
  } catch (e) {
    return null;
  }
}

export function getCompletedToday() {
  try {
    return execSync('jira issue list -sDone --created day -r$(jira me) --plain', { encoding: 'utf-8' });
  } catch (e) {
    return null;
  }
}
