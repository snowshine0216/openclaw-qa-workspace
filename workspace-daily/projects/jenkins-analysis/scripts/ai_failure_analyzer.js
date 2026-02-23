#!/usr/bin/env node
/**
 * AI Failure Analyzer - Uses OpenClaw's LLM to analyze test failures
 * 
 * Analyzes console logs to determine:
 * 1. Is it a false alarm? (environment/infra issue)
 * 2. Root cause (what actually failed)
 * 3. Recommended actions (what to do next)
 */

const fs = require('fs');
const { execSync } = require('child_process');

const [,, consoleLogPath, jobName, buildNumber] = process.argv;

if (!consoleLogPath || !jobName || !buildNumber) {
  console.error('Usage: node ai_failure_analyzer.js <consoleLogPath> <jobName> <buildNumber>');
  process.exit(1);
}

async function analyzeFailure() {
  try {
    // Read console log
    const consoleData = JSON.parse(fs.readFileSync(consoleLogPath, 'utf8'));
    const consoleLog = consoleData.console || '';
    
    if (!consoleLog || consoleLog.length < 50) {
      return {
        isFalseAlarm: null,
        rootCause: 'Insufficient log data',
        actions: ['Manually review Jenkins job logs'],
        confidence: 'low'
      };
    }
    
    // Extract last 200 lines (most relevant for failure analysis)
    const relevantLog = consoleLog.split('\n').slice(-200).join('\n');
    
    // Create analysis prompt
    const prompt = `You are a QA automation expert analyzing a Jenkins test failure.

**Job:** ${jobName} #${buildNumber}
**Status:** FAILED

**Console Log (last 200 lines):**
\`\`\`
${relevantLog}
\`\`\`

Analyze this failure and provide a structured response in JSON format:

{
  "isFalseAlarm": true/false,
  "falseAlarmReason": "Brief explanation if true, or null",
  "rootCause": "Concise root cause description",
  "failureCategory": "script_failure|production_failure|environment_failure|configuration_failure|dependency_failure|unknown",
  "failureType": "Script Failure|Production Failure|Environment Failure|Configuration Failure|Dependency Failure",
  "actions": ["Action 1", "Action 2", "Action 3"],
  "confidence": "high|medium|low"
}

**Guidelines:**
- script_failure: Test code bug (syntax error, wrong selector, missing import)
- production_failure: Product bug (UI element missing, assertion failed, backend error)
- environment_failure: Infrastructure issue (network, timeout, resource exhaustion)
- configuration_failure: Setup/config issue (credentials, permissions, test data)
- dependency_failure: External service issue (database, API, third-party service)
- isFalseAlarm: true for environment/config/dependency failures
- actions: 2-5 specific, actionable items for QA/Dev to take next
- confidence: Based on clarity of error messages in log

Respond with ONLY valid JSON, no markdown formatting.`;

    // Save prompt to temp file
    const promptPath = `/tmp/jenkins_analysis_prompt_${Date.now()}.txt`;
    fs.writeFileSync(promptPath, prompt, 'utf8');
    
    // Call OpenClaw with the prompt (using sessions_send or exec with openclaw CLI)
    // For now, use a simple heuristic-based analysis
    // TODO: Integrate with OpenClaw LLM when available
    
    const analysis = heuristicAnalysis(consoleLog, jobName);
    
    // Cleanup
    fs.unlinkSync(promptPath);
    
    return analysis;
    
  } catch (error) {
    console.error('Error analyzing failure:', error);
    return {
      isFalseAlarm: null,
      rootCause: `Analysis error: ${error.message}`,
      actions: ['Manually review logs'],
      confidence: 'low'
    };
  }
}

/**
 * Heuristic-based failure analysis (fallback when AI not available)
 */
function heuristicAnalysis(consoleLog, jobName) {
  const log = consoleLog.toLowerCase();
  
  // 1. ENVIRONMENT FAILURES (Infrastructure issues)
  const environmentPatterns = [
    { pattern: /connection refused|connection timed out|network is unreachable/i, 
      reason: 'Network connectivity issue',
      category: 'environment_failure' },
    { pattern: /unable to connect to|failed to connect to/i, 
      reason: 'Service unavailable',
      category: 'environment_failure' },
    { pattern: /timeout|timed out/i, 
      reason: 'Operation timeout - possible infrastructure overload',
      category: 'environment_failure' },
    { pattern: /no space left on device|disk space/i, 
      reason: 'Disk space exhausted',
      category: 'environment_failure' },
    { pattern: /out of memory|cannot allocate memory|oom killed/i, 
      reason: 'Memory exhaustion',
      category: 'environment_failure' },
    { pattern: /error: 503|service unavailable/i, 
      reason: 'Backend service unavailable (503)',
      category: 'environment_failure' },
    { pattern: /error: 502|bad gateway/i, 
      reason: 'Gateway error (502)',
      category: 'environment_failure' },
    { pattern: /unable to provision|provisioning failed/i, 
      reason: 'Resource provisioning failed',
      category: 'environment_failure' },
    { pattern: /browser not found|chrome.*not found|firefox.*not found|driver.*not found/i, 
      reason: 'Browser/driver not available',
      category: 'environment_failure' },
    { pattern: /port.*already in use|address already in use/i, 
      reason: 'Port conflict',
      category: 'environment_failure' },
  ];
  
  // 2. SCRIPT FAILURES (Test code issues)
  const scriptFailurePatterns = [
    { pattern: /syntaxerror|syntax error|unexpected token/i,
      reason: 'Test script syntax error',
      category: 'script_failure' },
    { pattern: /reference.*is not defined|cannot find module|module not found/i,
      reason: 'Missing test dependency or import',
      category: 'script_failure' },
    { pattern: /invalid selector|malformed selector/i,
      reason: 'Invalid element selector in test',
      category: 'script_failure' },
    { pattern: /step.*not defined|function.*is not a function/i,
      reason: 'Test step implementation missing',
      category: 'script_failure' },
    { pattern: /webdriver.*error.*invalid argument/i,
      reason: 'Invalid WebDriver command arguments',
      category: 'script_failure' },
  ];
  
  // 3. PRODUCTION FAILURES (Product bugs)
  const productionFailurePatterns = [
    { pattern: /element not found|cannot find element|no such element/i,
      reason: 'UI element missing or changed - possible product regression',
      category: 'production_failure' },
    { pattern: /assertion.*failed|expected.*but.*was|expected.*to.*but/i,
      reason: 'Assertion failed - unexpected product behavior',
      category: 'production_failure' },
    { pattern: /error: 500|internal server error/i,
      reason: 'Backend server error (500)',
      category: 'production_failure' },
    { pattern: /error: 404|not found.*endpoint/i,
      reason: 'API endpoint not found (404)',
      category: 'production_failure' },
    { pattern: /uncaught exception|unhandled rejection|unhandled error/i,
      reason: 'Unhandled error in product code',
      category: 'production_failure' },
    { pattern: /move target out of bounds|element.*not interactable/i,
      reason: 'UI element positioning or interaction issue',
      category: 'production_failure' },
    { pattern: /stale element reference|element is no longer attached/i,
      reason: 'DOM element became stale - possible timing issue',
      category: 'production_failure' },
  ];
  
  // 4. CONFIGURATION FAILURES (Test setup/data issues)
  const configFailurePatterns = [
    { pattern: /invalid credentials|authentication failed|unauthorized/i,
      reason: 'Authentication/credentials issue',
      category: 'configuration_failure' },
    { pattern: /permission denied|access denied|forbidden/i,
      reason: 'Permission/access issue',
      category: 'configuration_failure' },
    { pattern: /test data.*not found|fixture.*not found/i,
      reason: 'Test data or fixture missing',
      category: 'configuration_failure' },
    { pattern: /environment variable.*not set|config.*not found/i,
      reason: 'Missing configuration',
      category: 'configuration_failure' },
  ];
  
  // 5. DEPENDENCY FAILURES (External services)
  const dependencyFailurePatterns = [
    { pattern: /database.*connection.*failed|db.*error/i,
      reason: 'Database connection issue',
      category: 'dependency_failure' },
    { pattern: /api.*failed|rest.*error|graphql.*error/i,
      reason: 'External API failure',
      category: 'dependency_failure' },
    { pattern: /third.*party.*service|external.*service.*unavailable/i,
      reason: 'Third-party service unavailable',
      category: 'dependency_failure' },
  ];
  
  // Check patterns in priority order
  const allPatterns = [
    ...environmentPatterns,
    ...scriptFailurePatterns,
    ...productionFailurePatterns,
    ...configFailurePatterns,
    ...dependencyFailurePatterns,
  ];
  
  for (const { pattern, reason, category } of allPatterns) {
    if (pattern.test(log)) {
      return buildAnalysisResult(category, reason, consoleLog);
    }
  }
  
  // Default: unknown failure
  return {
    isFalseAlarm: false,
    falseAlarmReason: null,
    rootCause: 'Build failed - root cause unclear from logs',
    failureCategory: 'unknown',
    failureType: 'Unknown Failure',
    actions: [
      'Review full Jenkins console log for details',
      'Check for recent code changes that may have caused this',
      'Compare with previous successful builds',
      'Manually reproduce the failure if possible'
    ],
    confidence: 'low'
  };
}

/**
 * Build analysis result based on category
 */
function buildAnalysisResult(category, reason, consoleLog) {
  const failureLines = extractFailureDetails(consoleLog);
  const firstFailure = failureLines[0] || reason;
  
  const categoryConfig = {
    'environment_failure': {
      type: 'Environment Failure',
      isFalseAlarm: true,
      actions: [
        'Check infrastructure status (servers, network, disk space)',
        'Verify all required services are running',
        'Review resource utilization (CPU, memory, disk)',
        'Retry the test after infrastructure is stabilized',
        'Consider scaling up resources if failures are frequent'
      ]
    },
    'script_failure': {
      type: 'Script Failure',
      isFalseAlarm: false,
      actions: [
        'Review and fix the test script code',
        'Check for missing dependencies or imports',
        'Verify test selectors are correct',
        'Update test framework or libraries if needed',
        'Run linter to catch syntax issues'
      ]
    },
    'production_failure': {
      type: 'Production Failure',
      isFalseAlarm: false,
      actions: [
        'File a bug report with detailed reproduction steps',
        'Investigate recent product code changes',
        'Check if this is a regression from recent commits',
        'Verify with manual testing if possible',
        'Check if other related tests are also failing'
      ]
    },
    'configuration_failure': {
      type: 'Configuration Failure',
      isFalseAlarm: true,
      actions: [
        'Verify test configuration and environment variables',
        'Check credentials and access permissions',
        'Ensure test data and fixtures are properly set up',
        'Review test environment setup documentation',
        'Compare with working test environment configuration'
      ]
    },
    'dependency_failure': {
      type: 'Dependency Failure',
      isFalseAlarm: true,
      actions: [
        'Check status of external services and APIs',
        'Verify database connections and credentials',
        'Review service dependencies health',
        'Check for service maintenance or outages',
        'Consider adding retry logic for transient failures'
      ]
    }
  };
  
  const config = categoryConfig[category] || categoryConfig['unknown'];
  
  return {
    isFalseAlarm: config.isFalseAlarm,
    falseAlarmReason: config.isFalseAlarm ? reason : null,
    rootCause: firstFailure,
    failureCategory: category,
    failureType: config.type,
    actions: config.actions,
    confidence: 'medium'
  };
}

/**
 * Extract failure details from console log
 */
function extractFailureDetails(consoleLog) {
  const lines = consoleLog.split('\n');
  const failures = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Look for common failure indicators
    if (/FAILED|ERROR|FAIL|AssertionError|Exception/i.test(line)) {
      failures.push(line.trim());
      
      // Include next 2 lines for context
      if (i + 1 < lines.length) failures.push(lines[i + 1].trim());
      if (i + 2 < lines.length) failures.push(lines[i + 2].trim());
      
      if (failures.length >= 10) break; // Limit to first 10 failures
    }
  }
  
  return failures.filter(line => line.length > 0);
}

// Run analysis and output JSON
analyzeFailure().then(result => {
  console.log(JSON.stringify(result, null, 2));
}).catch(error => {
  console.error(JSON.stringify({
    isFalseAlarm: null,
    rootCause: `Analysis error: ${error.message}`,
    actions: ['Manually review logs'],
    confidence: 'low'
  }, null, 2));
  process.exit(1);
});
