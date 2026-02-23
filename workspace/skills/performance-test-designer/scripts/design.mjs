#!/usr/bin/env node

/**
 * Performance Test Designer Script
 * Generate performance test specifications and monitor results
 * 
 * Usage:
 *   node scripts/design.mjs <test-type> [options]
 *   node scripts/design.mjs load --users=100 --duration=10
 *   node scripts/design.mjs stress --users=200 --ramp=5
 *   node scripts/design.mjs spike --users=500
 *   node scripts/design.mjs endurance --users=50 --duration=24
 */

const args = process.argv.slice(2);
const testType = args[0] || 'load';

if (args[0] === '--help' || args[0] === '-h') {
  console.log(`
Performance Test Designer

Usage: node scripts/design.mjs <test-type> [options]

Test Types:
  load       Normal expected load test
  stress     Beyond normal capacity test
  spike      Sudden traffic burst test
  endurance  Long-term stability test

Options:
  --users=N        Number of concurrent users (default: 50)
  --duration=N     Test duration in minutes (default: 10)
  --ramp=N         Ramp up time in minutes (default: 2)
  --target=URL     Target URL to test
  --output=FILE    Output file (default: stdout)
  --template=TYPE Output format (json|markdown|jira)

Examples:
  node scripts/design.mjs load --users=100 --duration=15
  node scripts/design.mjs stress --users=200 --ramp=5 --output=stress-test.json
  node scripts/design.mjs spike --users=500 --template=jira
  node scripts/design.mjs endurance --users=50 --duration=1440
`);
  process.exit(0);
}

// Parse options
let options = {
  testType,
  users: 50,
  duration: 10,
  ramp: 2,
  target: null,
  output: null,
  template: 'markdown'
};

for (let i = 1; i < args.length; i++) {
  const arg = args[i];
  if (arg.startsWith('--users=')) {
    options.users = parseInt(arg.split('=')[1]);
  } else if (arg.startsWith('--duration=')) {
    options.duration = parseInt(arg.split('=')[1]);
  } else if (arg.startsWith('--ramp=')) {
    options.ramp = parseInt(arg.split('=')[1]);
  } else if (arg.startsWith('--target=')) {
    options.target = arg.split('=')[1];
  } else if (arg.startsWith('--output=')) {
    options.output = arg.split('=')[1];
  } else if (arg.startsWith('--template=')) {
    options.template = arg.split('=')[1];
  }
}

// Generate test specification
const spec = generateTestSpec(options);

// Output
let output;
switch (options.template) {
  case 'json':
    output = JSON.stringify(spec, null, 2);
    break;
  case 'jira':
    output = generateJiraFormat(spec);
    break;
  default:
    output = generateMarkdownFormat(spec);
}

if (options.output) {
  import('fs').then(fs => fs.writeFileSync(options.output, output));
  console.log(`✅ Test specification saved to ${options.output}`);
} else {
  console.log(output);
}

function generateTestSpec(opts) {
  const testNames = {
    load: 'Load Test',
    stress: 'Stress Test',
    spike: 'Spike Test',
    endurance: 'Endurance Test'
  };
  
  return {
    testName: testNames[opts.testType] || 'Performance Test',
    testType: opts.testType,
    target: opts.target || 'https://target-application.com',
    configuration: {
      users: opts.users,
      duration: opts.duration,
      rampUp: opts.ramp,
      unit: 'minutes'
    },
    scenarios: generateScenarios(opts),
    metrics: defineMetrics(opts),
    checkpoints: generateCheckpoints(opts),
    thresholds: defineThresholds(opts)
  };
}

function generateScenarios(opts) {
  const scenarios = [];
  
  if (opts.testType === 'load') {
    scenarios.push(
      { phase: 'Warm up', users: Math.floor(opts.users * 0.1), duration: opts.ramp },
      { phase: 'Steady state', users: opts.users, duration: opts.duration },
      { phase: 'Cool down', users: 0, duration: 1 }
    );
  } else if (opts.testType === 'stress') {
    scenarios.push(
      { phase: 'Baseline', users: opts.users * 0.5, duration: opts.ramp },
      { phase: 'Peak expected', users: opts.users, duration: opts.duration },
      { phase: 'Beyond limit', users: opts.users * 2, duration: opts.ramp },
      { phase: 'Recovery', users: 0, duration: 1 }
    );
  } else if (opts.testType === 'spike') {
    scenarios.push(
      { phase: 'Normal', users: opts.users * 0.1, duration: 2 },
      { phase: 'Spike', users: opts.users, duration: 1 },
      { phase: 'Recovery', users: opts.users * 0.1, duration: 2 }
    );
  } else if (opts.testType === 'endurance') {
    scenarios.push(
      { phase: 'Sustained load', users: opts.users, duration: opts.duration }
    );
  }
  
  return scenarios;
}

function defineMetrics(opts) {
  const baseMetrics = {
    responseTime: { unit: 'ms', p50: null, p95: null, p99: null },
    throughput: { unit: 'RPS', target: null },
    errorRate: { unit: '%', threshold: 1.0 },
    resourceUtilization: { cpu: null, memory: null }
  };
  
  // Set targets based on test type
  if (opts.testType === 'load' || opts.testType === 'endurance') {
    baseMetrics.responseTime.p95 = 3000;
    baseMetrics.responseTime.p99 = 5000;
    baseMetrics.throughput.target = opts.users * 0.5;
  } else if (opts.testType === 'stress') {
    baseMetrics.responseTime.p95 = 5000;
    baseMetrics.responseTime.p99 = 10000;
    baseMetrics.errorRate.threshold = 5.0;
  } else if (opts.testType === 'spike') {
    baseMetrics.responseTime.p95 = 5000;
    baseMetrics.throughput.target = opts.users * 2;
  }
  
  return baseMetrics;
}

function generateCheckpoints(opts) {
  const checkpoints = [];
  
  checkpoints.push({
    name: 'System Stability',
    criteria: 'No crashes or 503 errors',
    timing: 'Throughout test'
  });
  
  if (opts.testType !== 'spike') {
    checkpoints.push({
      name: 'Response Time',
      criteria: `p95 < ${defineMetrics(opts).responseTime.p95}ms`,
      timing: 'Every 5 minutes'
    });
  }
  
  checkpoints.push({
    name: 'Error Rate',
    criteria: `Errors < ${defineMetrics(opts).errorRate.threshold}%`,
    timing: 'Throughout test'
  });
  
  if (opts.testType === 'endurance') {
    checkpoints.push({
      name: 'Memory Leak',
      criteria: 'No continuous memory increase',
      timing: 'Every 30 minutes'
    });
  }
  
  return checkpoints;
}

function defineThresholds(opts) {
  const thresholds = {
    responseTime: {
      green: '< 1000ms',
      yellow: '1000-3000ms',
      red: '> 3000ms'
    },
    errorRate: {
      green: '< 0.1%',
      yellow: '0.1-1%',
      red: '> 1%'
    }
  };
  
  if (opts.testType === 'stress') {
    thresholds.responseTime.red = '> 5000ms';
  }
  
  return thresholds;
}

function generateMarkdownFormat(spec) {
  let md = `# ${spec.testName} Specification\n\n`;
  md += `**Date:** ${new Date().toISOString().split('T')[0]}\n`;
  md += `**Target:** ${spec.target}\n\n`;
  
  md += `## Configuration\n\n`;
  md += `| Parameter | Value |\n`;
  md += `|-----------|-------|\n`;
  md += `| Concurrent Users | ${spec.configuration.users} |\n`;
  md += `| Duration | ${spec.configuration.duration} min |\n`;
  md += `| Ramp Up | ${spec.configuration.ramp} min |\n\n`;
  
  md += `## Scenarios\n\n`;
  md += `| Phase | Users | Duration |\n`;
  md += `|-------|-------|----------|\n`;
  for (const s of spec.scenarios) {
    md += `| ${s.phase} | ${s.users} | ${s.duration} min |\n`;
  }
  
  md += `\n## Metrics Targets\n\n`;
  md += `| Metric | Target | Threshold |\n`;
  md += `|--------|--------|----------|\n`;
  md += `| p95 Response Time | < ${spec.metrics.responseTime.p95 || 'N/A'}ms | ${spec.thresholds.responseTime.red} |\n`;
  md += `| Throughput | > ${spec.metrics.throughput.target || 'N/A'} RPS | - |\n`;
  md += `| Error Rate | < ${spec.metrics.errorRate.threshold}% | ${spec.thresholds.errorRate.red} |\n\n`;
  
  md += `## Checkpoints\n\n`;
  for (const cp of spec.checkpoints) {
    md += `- **${cp.name}**: ${cp.criteria} (${cp.timing})\n`;
  }
  
  return md;
}

function generateJiraFormat(spec) {
  let jira = `h2. ${spec.testName} Specification\n\n`;
  jira += `*Target:* ${spec.target}\n`;
  jira += `*Users:* ${spec.configuration.users}\n`;
  jira += `*Duration:* ${spec.configuration.duration} min\n\n`;
  
  jira += `h3. Scenarios\n`;
  for (const s of spec.scenarios) {
    jira += `* ${s.phase}: ${s.users} users for ${s.duration} min\n`;
  }
  
  jira += `\nh3. Success Criteria\n`;
  for (const cp of spec.checkpoints) {
    jira += `* ${cp.name}: ${cp.criteria}\n`;
  }
  
  return jira;
}
