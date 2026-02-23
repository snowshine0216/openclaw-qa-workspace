#!/usr/bin/env node

/**
 * MicroStrategy QA Workflow Script
 * Automate MicroStrategy testing tasks: dashboard testing, report validation, data checks
 * 
 * Usage:
 *   node scripts/mstr.mjs test-dashboard --url=URL [--output=FILE]
 *   node scripts/mstr.mjs validate-report --id=REPORT_ID
 *   node scripts/mstr.mjs checklist --type=dashboard
 *   node scripts/mstr.mjs report --summary
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';

const args = process.argv.slice(2);
const action = args[0] || 'help';

// Colors
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

if (action === 'help' || action === '-h') {
  console.log(`
MicroStrategy QA Workflow

Usage: node scripts/mstr.mjs <command> [options]

Commands:
  test-dashboard    Test a MicroStrategy dashboard
  validate-report    Validate a specific report
  checklist         Generate testing checklist
  report            Generate test summary report
  health            Check MicroStrategy system health

Options:
  --url=URL         Dashboard/Report URL
  --id=ID           Report ID
  --output=FILE     Output file
  --format=FORMAT   Output format (markdown|json)

Examples:
  node scripts/mstr.mjs test-dashboard --url="https://mstr.example.com/dashboard/sales"
  node scripts/mstr.mjs validate-report --id=RPT12345 --output=report.json
  node scripts/mstr.mjs checklist --type=dashboard
  node scripts/mstr.mjs report --summary --output=daily-summary.md
`);
  process.exit(0);
}

// Parse common options
const options = {
  url: getArg('--url'),
  id: getArg('--id'),
  output: getArg('--output'),
  format: getArg('--format') || 'markdown'
};

function getArg(prefix) {
  const arg = args.find(a => a.startsWith(prefix + '='));
  return arg ? arg.split('=')[1] : null;
}

// Execute action
switch (action) {
  case 'test-dashboard':
    testDashboard(options);
    break;
  case 'validate-report':
    validateReport(options);
    break;
  case 'checklist':
    generateChecklist(args[1]);
    break;
  case 'report':
    generateSummary();
    break;
  case 'health':
    checkHealth();
    break;
  default:
    console.log(`Unknown command: ${action}`);
    console.log('Use --help for usage information');
}

function testDashboard(opts) {
  console.log(`${colors.cyan}╔════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║  MicroStrategy Dashboard Test Generator  ║${colors.reset}`);
  console.log(`${colors.cyan}╚════════════════════════════════════════╝${colors.reset}\n`);
  
  const url = opts.url;
  if (!url) {
    console.log(`${colors.red}❌ Error: --url required${colors.reset}`);
    console.log('Usage: node scripts/mstr.mjs test-dashboard --url=URL');
    process.exit(1);
  }
  
  // Generate test spec
  const spec = {
    feature: 'MicroStrategy Dashboard Test',
    url: url,
    timestamp: new Date().toISOString(),
    testCases: generateDashboardTestCases(url)
  };
  
  // Output
  let output;
  switch (opts.format) {
    case 'json':
      output = JSON.stringify(spec, null, 2);
      break;
    default:
      output = generateMarkdownTestSpec(spec);
  }
  
  if (opts.output) {
    writeFileSync(opts.output, output);
    console.log(`✅ Test spec saved to ${opts.output}`);
  } else {
    console.log(output);
  }
  
  // Playwright CLI commands
  console.log(`\n${colors.yellow}📋 Playwright CLI Commands:${colors.reset}\n`);
  console.log(`# Open dashboard`);
  console.log(`playwright-cli open ${url} --headed\n`);
  console.log(`# Take screenshot`);
  console.log(`playwright-cli screenshot --filename=dashboard-baseline.png\n`);
  console.log(`# Test filter`);
  console.log(`playwright-cli click "[data-testid='filter-panel']"`);
}

function generateDashboardTestCases(url) {
  const dashboardId = url.split('/').pop() || 'UNKNOWN';
  
  return [
    {
      id: 'TC-MSTR-001',
      name: 'Dashboard loads successfully',
      category: 'Functional',
      priority: 'P0',
      steps: [
        'Navigate to dashboard URL',
        'Wait for page to fully load (5s)',
        'Verify dashboard header displays'
      ],
      checkpoints: [
        'No JavaScript errors in console',
        'All visualizations rendered',
        'Filter panel accessible'
      ]
    },
    {
      id: 'TC-MSTR-002',
      name: 'Dashboard filters work correctly',
      category: 'Functional',
      priority: 'P0',
      steps: [
        'Click on filter panel',
        'Select a filter value',
        'Click Apply',
        'Observe data updates'
      ],
      checkpoints: [
        'Filter dropdown opens',
        'Selection applies correctly',
        'Charts update within 3s',
        'No error messages'
      ]
    },
    {
      id: 'TC-MSTR-003',
      name: 'Chart tooltips display on hover',
      category: 'UI',
      priority: 'P2',
      steps: [
        'Hover over data visualization',
        'Observe tooltip'
      ],
      checkpoints: [
        'Tooltip displays',
        'Correct data shown',
        'Positioning is accurate'
      ]
    },
    {
      id: 'TC-MSTR-004',
      name: 'Export to PDF works',
      category: 'Export',
      priority: 'P1',
      steps: [
        'Click Export button',
        'Select PDF format',
        'Confirm export',
        'Wait for download'
      ],
      checkpoints: [
        'Export dialog opens',
        'PDF downloads',
        'All charts rendered in PDF'
      ]
    },
    {
      id: 'TC-MSTR-005',
      name: 'Drill-down navigation works',
      category: 'Navigation',
      priority: 'P1',
      steps: [
        'Click on data point with drill-down',
        'Observe navigation',
        'Return to original dashboard'
      ],
      checkpoints: [
        'Drill-down view loads',
        'Breadcrumb navigation works',
        'Back button returns correctly'
      ]
    },
    {
      id: 'TC-MSTR-006',
      name: 'Responsive design on mobile',
      category: 'UI',
      priority: 'P2',
      steps: [
        'Resize browser to mobile width',
        'Test dashboard on mobile'
      ],
      checkpoints: [
        'Layout adapts to screen',
        'Scroll works correctly',
        'Touch interactions work'
      ]
    }
  ];
}

function generateMarkdownTestSpec(spec) {
  let md = `# MicroStrategy Dashboard Test Specification\n\n`;
  md += `**Date:** ${spec.timestamp.split('T')[0]}\n`;
  md += `**URL:** ${spec.url}\n\n`;
  
  md += `## Test Cases\n\n`;
  
  for (const tc of spec.testCases) {
    md += `### ${tc.id}: ${tc.name}\n`;
    md += `**Priority:** ${tc.priority} | **Category:** ${tc.category}\n\n`;
    
    md += `**Steps:**\n`;
    tc.steps.forEach((step, i) => {
      md += `${i + 1}. ${step}\n`;
    });
    md += '\n';
    
    md += `**Checkpoints:**\n`;
    tc.checkpoints.forEach(cp => {
      md += `- [ ] ${cp}\n`;
    });
    md += '\n';
  }
  
  return md;
}

function validateReport(opts) {
  console.log(`${colors.cyan}╔══════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║    MicroStrategy Report Validation     ║${colors.reset}`);
  console.log(`${colors.cyan}╚══════════════════════════════════════╝${colors.reset}\n`);
  
  const reportId = opts.id;
  if (!reportId) {
    console.log(`${colors.red}❌ Error: --id required${colors.reset}`);
    process.exit(1);
  }
  
  const validation = {
    reportId,
    timestamp: new Date().toISOString(),
    checks: [
      { name: 'Report loads', status: 'pending', details: '' },
      { name: 'Data renders correctly', status: 'pending', details: '' },
      { name: 'Formatting is correct', status: 'pending', details: '' },
      { name: 'Export works', status: 'pending', details: '' },
      { name: 'No console errors', status: 'pending', details: '' }
    ]
  };
  
  const output = JSON.stringify(validation, null, 2);
  
  if (opts.output) {
    writeFileSync(opts.output, output);
    console.log(`✅ Validation saved to ${opts.output}`);
  } else {
    console.log(output);
  }
}

function generateChecklist(type) {
  console.log(`${colors.cyan}╔════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║     MicroStrategy Testing Checklist     ║${colors.reset}`);
  console.log(`${colors.cyan}╚════════════════════════════════════════╝${colors.reset}\n`);
  
  const checklists = {
    dashboard: {
      name: 'Dashboard Testing Checklist',
      items: [
        '✅ Dashboard loads without errors',
        '✅ All visualizations display correctly',
        '✅ Filter panel opens and applies filters',
        '✅ Multi-select filters work',
        '✅ Date range filters handle edge cases',
        '✅ Hover tooltips display correct data',
        '✅ Drill-down navigation works',
        '✅ Export to PDF/Excel works',
        '✅ Print functionality works',
        '✅ Responsive design on mobile',
        '✅ No overlapping elements',
        '✅ Loading states display properly',
        '✅ Session timeout handled correctly'
      ]
    },
    report: {
      name: 'Report Testing Checklist',
      items: [
        '✅ Report opens without errors',
        '✅ Data matches source system',
        '✅ Aggregations are correct',
        '✅ Date formatting consistent',
        '✅ Null/empty values handled',
        '✅ Column widths appropriate',
        '✅ Header row visible',
        '✅ Footer with metadata',
        '✅ PDF export renders correctly',
        '✅ Excel export maintains formatting',
        '✅ Large reports dont timeout',
        '✅ No duplicate rows'
      ]
    },
    integration: {
      name: 'Integration Testing Checklist',
      items: [
        '✅ Data source connection works',
        '✅ Authentication/authorization',
        '✅ API calls succeed',
        '✅ No CORS errors',
        '✅ Session management works',
        '✅ Cache behavior correct',
        '✅ Real-time updates work',
        '✅ Mobile access works',
        '✅ Performance within SLA'
      ]
    }
  };
  
  const checklist = checklists[type] || checklists.dashboard;
  
  console.log(`## ${checklist.name}\n`);
  checklist.items.forEach(item => {
    console.log(item);
  });
  
  console.log(`\n${colors.yellow}📝 Run tests and mark items${colors.reset}`);
}

function generateSummary() {
  console.log(`${colors.cyan}╔════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║    MicroStrategy QA Daily Summary       ║${colors.reset}`);
  console.log(`${colors.cyan}╚════════════════════════════════════════╝${colors.reset}\n`);
  
  const summary = {
    date: new Date().toISOString().split('T')[0],
    dashboards: { tested: 0, passed: 0, failed: 0 },
    reports: { validated: 0, passed: 0, failed: 0 },
    bugs: { found: 0, filed: 0 },
    performance: {}
  };
  
  let md = `# MicroStrategy QA Daily Summary\n\n`;
  md += `**Date:** ${summary.date}\n\n`;
  
  md += `## Summary\n`;
  md += `- Dashboards Tested: ${summary.dashboards.tested}\n`;
  md += `- Reports Validated: ${summary.reports.validated}\n`;
  md += `- Bugs Found: ${summary.bugs.found}\n`;
  
  md += `\n## Dashboards\n`;
  md += `| Dashboard | Status | Notes |\n`;
  md += `|-----------|--------|-------|\n`;
  md += `| [Name] | ✅ Passed | All tests passed |\n`;
  
  md += `\n## Reports\n`;
  md += `| Report | Status | Notes |\n`;
  md += `|--------|--------|-------|\n`;
  md += `| [Name] | ✅ Validated | Data accurate |\n`;
  
  md += `\n## Bugs\n`;
  md += `- [ ] Bug 1: [Description]\n`;
  md += `- [ ] Bug 2: [Description]\n`;
  
  md += `\n## Performance\n`;
  md += `- Dashboard Load: [time]\n`;
  md += `- Report Generation: [time]\n`;
  md += `- Export Time: [time]\n`;
  
  md += `\n## Tomorrow's Plan\n`;
  md += `- [ ] Task 1\n`;
  md += `- [ ] Task 2\n`;
  
  console.log(md);
  
  if (options.output) {
    writeFileSync(options.output, md);
    console.log(`\n✅ Summary saved to ${options.output}`);
  }
}

function checkHealth() {
  console.log(`${colors.cyan}╔════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║    MicroStrategy System Health Check    ║${colors.reset}`);
  console.log(`${colors.cyan}╚════════════════════════════════════════╝${colors.reset}\n`);
  
  const checks = [
    { name: 'MicroStrategy Library', status: 'unknown', url: '/MicroStrategyLibrary/servlet/mstrWeb' },
    { name: 'Intelligence Server', status: 'unknown', port: 34952 },
    { name: 'Web Server', status: 'unknown', port: 80 }
  ];
  
  console.log('Health Check Results:\n');
  
  checks.forEach(check => {
    console.log(`${colors.yellow}⏳ ${check.name}${colors.reset}`);
    console.log(`   URL/Port: ${check.url || check.port}`);
    console.log('');
  });
  
  console.log(`${colors.yellow}📝 Manual verification needed for health checks${colors.reset}`);
  console.log('Check: https://your-mstr-instance/MicroStrategyLibrary\n');
}
