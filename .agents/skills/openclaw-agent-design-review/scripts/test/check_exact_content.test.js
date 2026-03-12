const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const repoRoot = path.resolve(__dirname, '../../../../..');
const scriptPath = path.join(
  repoRoot,
  '.agents/skills/openclaw-agent-design-review/scripts/check_exact_content.sh',
);

function makeTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'openclaw-exact-content-'));
}

function writeDesignFile(content) {
  const tempDir = makeTempDir();
  const designPath = path.join(tempDir, 'design.md');
  fs.writeFileSync(designPath, content, 'utf8');
  return designPath;
}

function runExactContentCheck(designContent) {
  const designPath = writeDesignFile(designContent);
  return spawnSync('/bin/bash', [scriptPath, designPath], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
}

test('passes design with exact SKILL.md content and detailed test stubs', () => {
  const content = `# Example Design

## Skills Content Specification

### 3.1 \`.agents/skills/example-skill/SKILL.md\`

---
name: example-skill
description: Example skill for design review.
---

# Example Skill

The orchestrator has exactly three responsibilities.

## Required References

- reference.md
- references/phase4a-contract.md

## Runtime Layout

All artifacts live under runs/<feature-id>/

## Phase Contract

### Phase 0
- Entry: scripts/phase0.sh
- Work: initialize runtime state
- Output: context/runtime_setup_*.json

## Functions

Implementation detail: step 1 parse args, step 2 run check_resume, step 3 output state.

## Tests

| Script Path | Test Stub Path |
|-------------|----------------|
| scripts/check_resume.sh | scripts/test/check_resume.test.js |

test('returns FINAL_EXISTS when final plan is present', () => {
  const runDir = '/tmp/test-run';
  const result = runCheckResume(runDir);
  assert.equal(result, 'FINAL_EXISTS');
});
`;
  const result = runExactContentCheck(content);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /OK: exact-content contract satisfied/i);
});

test('passes design with canonical Skills Content Specification (optional) heading', () => {
  const content = `# Example Design

## Skills Content Specification (optional)

### 3.1 \`.agents/skills/example-skill/SKILL.md\`

---
name: example-skill
description: Example skill.
---

## Required References

- reference.md

## Phase Contract

### Phase 0
- Entry: scripts/phase0.sh

## Functions

Implementation detail: step 1, step 2.

## Tests

| Script Path | Test Stub Path |
|-------------|----------------|
| scripts/phase0.sh | scripts/test/phase0.test.js |

test('initializes', () => {});
`;
  const result = runExactContentCheck(content);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /OK: exact-content contract satisfied/i);
});

test('fails design with outline-style Skills Content (Target path: only)', () => {
  const content = `# Example Design

## Skills Content Specification

### 3.1 \`.agents/skills/example-skill/SKILL.md\`

Target path:
- .agents/skills/example-skill/SKILL.md

Purpose:
- Example design.

Input contract:
- design_id: string

Output contract:
- design markdown
`;
  const result = runExactContentCheck(content);
  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /FAIL:.*outline-style|FAIL:.*Target path/i);
});

test('passes function-only design (no Skills Content Spec)', () => {
  const content = `# Example Design

## Functions

### scripts/lib/foo.sh

Invocation: bash scripts/lib/foo.sh

Implementation detail: parse input, validate schema, emit JSON.

## Tests

| Script Path | Test Stub Path |
|-------------|----------------|
| scripts/lib/foo.sh | scripts/test/foo.test.js |

test('validates schema correctly', () => {
  const result = runFoo(validInput);
  assert.equal(result.code, 0);
});
`;
  const result = runExactContentCheck(content);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /OK: function-only design|OK: exact-content contract satisfied/i);
});

test('fails design with Stub scenarios but no test( blocks', () => {
  const content = `# Example Design

## Functions

### scripts/check_resume.sh

Invocation: bash scripts/check_resume.sh

## Tests

| Script Path | Test Stub Path |
|-------------|----------------|
| scripts/check_resume.sh | scripts/test/check_resume.test.js |

Stub scenarios:
- returns FINAL_EXISTS when final plan is present
- returns DRAFT_EXISTS when draft exists
`;
  const result = runExactContentCheck(content);
  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /FAIL:.*Stub scenarios|FAIL:.*test\(|FAIL:.*describe\(/i);
});

test('reports usage errors cleanly', () => {
  const result = spawnSync('/bin/bash', [scriptPath], {
    cwd: repoRoot,
    encoding: 'utf8',
  });

  assert.equal(result.status, 2);
  assert.match(result.stderr, /Usage: .*check_exact_content\.sh <design-markdown-file>/i);
});

test('skips checks when design has no Skills Content Spec, Functions, or Tests', () => {
  const content = `# Example Design

## Overview

## Architecture

## Documentation Changes
`;
  const result = runExactContentCheck(content);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /skip exact-content checks/i);
});

test('passes design with Functional Design (no Functions section) and Detailed Implementation', () => {
  const content = `# Example Design

## Functional Design 1

### 1. scripts/phase0.sh

1. Script Path: scripts/phase0.sh
2. Script Purpose: Prepare run directory
3. Script Inputs: runDir
4. Script Outputs: context/run_dir.json
5. Script User Interaction: none
2. Detailed Implementation: function phase0(runDir) { ... }

## Tests

| Script Path | Test Stub Path |
|-------------|----------------|
| scripts/phase0.sh | scripts/test/phase0.test.js |

test('initializes run directory', () => {
  const result = phase0('/tmp/run');
  assert.equal(result.code, 0);
});
`;
  const result = runExactContentCheck(content);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /OK: exact-content contract satisfied|OK: function-only/i);
});

test('fails design with reference.md Must include bullets only (no actual content)', () => {
  const content = `# Example Design

## Skills Content Specification

### 3.1 \`.agents/skills/example/SKILL.md\`

Target path: .agents/skills/example/SKILL.md

Purpose: Example skill.

### 4.1 \`.agents/skills/example/reference.md\`

Must include:
- State machine
- Schemas
- Path conventions
`;
  const result = runExactContentCheck(content);
  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /FAIL:.*outline-style|FAIL:.*Target path|FAIL:.*Must include|FAIL:.*section headers/i);
});
