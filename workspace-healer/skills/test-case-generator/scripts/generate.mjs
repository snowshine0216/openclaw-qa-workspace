#!/usr/bin/env node

/**
 * Test Case Generator Script
 * Generate test cases from requirements file or raw input
 * 
 * Usage:
 *   node scripts/generate.mjs <input-file|raw-text>
 *   node scripts/generate.mjs feature.txt --format jira
 *   node scripts/generate.mjs "As a user, I want to login..." --category positive
 */

import { readFileSync } from 'fs';

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: generate.mjs <input-file|raw-text> [options]');
  console.error('Options:');
  console.error('  --format jira|csv|markdown  Output format (default: markdown)');
  console.error('  --category all|positive|negative|boundary|ui|security  Filter category');
  console.error('  --priority P0|P1|P2|P3  Minimum priority to include');
  console.error('  --output <file>  Save to file instead of stdout');
  process.exit(1);
}

// Parse options
let input = args[0];
let format = 'markdown';
let category = 'all';
let priority = 'P3';
let outputFile = null;

for (let i = 1; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--format' && args[i + 1]) {
    format = args[i + 1];
    i++;
  } else if (arg === '--category' && args[i + 1]) {
    category = args[i + 1];
    i++;
  } else if (arg === '--priority' && args[i + 1]) {
    priority = args[i + 1];
    i++;
  } else if (arg === '--output' && args[i + 1]) {
    outputFile = args[i + 1];
    i++;
  }
}

// Read input file if exists
let requirementsText = input;
try {
  requirementsText = readFileSync(input, 'utf-8');
} catch (e) {
  // Not a file, use as raw text
}

// Generate test cases
const testCases = generateTestCases(requirementsText);

// Filter by category and priority
const filteredCases = testCases.filter(tc => {
  const categoryMatch = category === 'all' || tc.type.toLowerCase().includes(category);
  const priorityMatch = ['P0', 'P1', 'P2', 'P3'].indexOf(tc.priority) <= ['P0', 'P1', 'P2', 'P3'].indexOf(priority);
  return categoryMatch && priorityMatch;
});

// Output
let output;
switch (format) {
  case 'jira':
    output = generateJiraFormat(filteredCases);
    break;
  case 'csv':
    output = generateCSVFormat(filteredCases);
    break;
  default:
    output = generateMarkdownFormat(filteredCases);
}

if (outputFile) {
  import('fs').then(fs => fs.writeFileSync(outputFile, output));
  console.log(`✅ Test cases saved to ${outputFile}`);
} else {
  console.log(output);
}

console.log(`\n📊 Generated ${filteredCases.length} test cases`);

/**
 * Generate test cases from requirements text
 */
function generateTestCases(text) {
  const cases = [];
  let tcId = 1;
  
  // Extract feature name
  const featureMatch = text.match(/(?:Feature|feature)[:\s]+([^\n]+)/);
  const featureName = featureMatch ? featureMatch[1].trim() : 'Unknown Feature';
  
  // Detect key elements
  const hasValidation = /validation|valid|invalid|error/i.test(text);
  const hasAuth = /login|auth|password|credential/i.test(text);
  const hasSearch = /search|find|query/i.test(text);
  const hasCreate = /create|add|new|register/i.test(text);
  const hasDelete = /delete|remove|remove/i.test(text);
  const hasUpdate = /update|edit|modify/i.test(text);
  const hasUpload = /upload|file|import/i.test(text);
  
  // Generate positive cases
  if (hasAuth) {
    cases.push({
      id: `TC-${String(tcId++).padStart(3, '0')}`,
      name: 'Successful authentication with valid credentials',
      priority: 'P0',
      type: 'Functional',
      preconditions: 'User account exists with valid credentials',
      steps: '1. Navigate to login page\n2. Enter valid email and password\n3. Click login button',
      expected: 'User authenticated successfully, dashboard loads'
    });
  }
  
  if (hasCreate) {
    cases.push({
      id: `TC-${String(tcId++).padStart(3, '0')}`,
      name: 'Create new record with all required fields',
      priority: 'P0',
      type: 'Functional',
      preconditions: 'User has create permissions',
      steps: '1. Navigate to create page\n2. Fill all required fields with valid data\n3. Click submit button',
      expected: 'Record created successfully, confirmation displayed'
    });
  }
  
  if (hasSearch) {
    cases.push({
      id: `TC-${String(tcId++).padStart(3, '0')}`,
      name: 'Search returns matching results',
      priority: 'P0',
      type: 'Functional',
      preconditions: 'Data exists in system',
      steps: '1. Enter valid search term\n2. Click search button',
      expected: 'Results matching search term displayed'
    });
  }
  
  // Generate negative cases
  cases.push({
    id: `TC-${String(tcId++).padStart(3, '0')}`,
    name: 'Operation with missing required field',
    priority: 'P0',
    type: 'Functional',
    preconditions: 'Form has required fields',
    steps: '1. Leave required field empty\n2. Attempt to submit',
    expected: 'Error message displayed, submission prevented'
  });
  
  if (hasValidation) {
    cases.push({
      id: `TC-${String(tcId++).padStart(3, '0')}`,
      name: 'Invalid input format rejected',
      priority: 'P1',
      type: 'Functional',
      preconditions: 'Field has validation rules',
      steps: '1. Enter invalid format data\n2. Attempt to submit',
      expected: 'Validation error displayed'
    });
  }
  
  // Generate boundary cases
  cases.push({
    id: `TC-${String(tcId++).padStart(3, '0')}`,
    name: 'Input at minimum length',
    priority: 'P2',
    type: 'Boundary',
    preconditions: 'Field has minimum length requirement',
    steps: '1. Enter exactly minimum allowed characters\n2. Attempt to submit',
    expected: 'Input accepted (if all other fields valid)'
  });
  
  cases.push({
    id: `TC-${String(tcId++).padStart(3, '0')}`,
    name: 'Input exceeds maximum length',
    priority: 'P2',
    type: 'Boundary',
    preconditions: 'Field has maximum length requirement',
    steps: '1. Enter more than maximum allowed characters\n2. Attempt to submit',
    expected: 'Input truncated or error displayed'
  });
  
  cases.push({
    id: `TC-${String(tcId++).padStart(3, '0')}`,
    name: 'Special characters in input',
    priority: 'P2',
    type: 'Boundary',
    preconditions: 'Text input field',
    steps: '1. Enter special characters (!@#$%^&*)\n2. Attempt to submit',
    expected: 'Special characters handled correctly'
  });
  
  // Generate security cases
  cases.push({
    id: `TC-${String(tcId++).padStart(3, '0')}`,
    name: 'SQL injection attempt sanitized',
    priority: 'P1',
    type: 'Security',
    preconditions: 'Input field accepts user text',
    steps: '1. Enter SQL injection payload\n2. Attempt to submit',
    expected: 'Input sanitized, no database error exposed'
  });
  
  cases.push({
    id: `TC-${String(tcId++).padStart(3, '0')}`,
    name: 'XSS script in input',
    priority: 'P1',
    type: 'Security',
    preconditions: 'Input field displays user content',
    steps: '1. Enter XSS script <script>alert(1)</script>\n2. Submit and view content',
    expected: 'Script escaped, no alert triggered'
  });
  
  // Generate UI cases
  cases.push({
    id: `TC-${String(tcId++).padStart(3, '0')}`,
    name: 'Loading state displays during operation',
    priority: 'P2',
    type: 'UI',
    preconditions: 'Operation takes > 1 second',
    steps: '1. Perform async operation',
    expected: 'Loading indicator displayed'
  });
  
  cases.push({
    id: `TC-${String(tcId++).padStart(3, '0')}`,
    name: 'Error message displays clearly',
    priority: 'P2',
    type: 'UI',
    preconditions: 'Validation or system error',
    steps: '1. Trigger error condition',
    expected: 'Error message visible and readable'
  });
  
  return cases;
}

function generateMarkdownFormat(cases) {
  let md = `# Test Cases: Auto-Generated\n\n`;
  md += `Generated: ${new Date().toISOString()}\n`;
  md += `Total: ${cases.length} test cases\n\n`;
  
  for (const tc of cases) {
    md += `### ${tc.id}: ${tc.name}\n`;
    md += `**Priority**: ${tc.priority} | **Type**: ${tc.type}\n\n`;
    md += `**Preconditions:**\n${tc.preconditions}\n\n`;
    md += `**Steps:**\n${tc.steps}\n\n`;
    md += `**Expected Result:**\n${tc.expected}\n\n`;
    md += `---\n\n`;
  }
  
  return md;
}

function generateJiraFormat(cases) {
  let jira = '';
  for (const tc of cases) {
    jira += `h3. ${tc.id}: ${tc.name}\n`;
    jira += `*Priority:* ${tc.priority}\n`;
    jira += `*Type:* ${tc.type}\n\n`;
    jira += `h4. Preconditions\n${tc.preconditions}\n\n`;
    jira += `h4. Steps\n${tc.steps}\n\n`;
    jira += `h4. Expected Result\n${tc.expected}\n\n`;
  }
  return jira;
}

function generateCSVFormat(cases) {
  let csv = 'ID,Name,Priority,Type,Preconditions,Steps,Expected Result\n';
  for (const tc of cases) {
    const row = [
      tc.id,
      tc.name,
      tc.priority,
      tc.type,
      `"${tc.preconditions.replace(/"/g, '""')}"`,
      `"${tc.steps.replace(/"/g, '""')}"`,
      `"${tc.expected.replace(/"/g, '""')}"`
    ];
    csv += row.join(',') + '\n';
  }
  return csv;
}
