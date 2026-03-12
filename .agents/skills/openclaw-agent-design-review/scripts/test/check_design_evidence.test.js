const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const repoRoot = path.resolve(__dirname, '../../../../..');
const scriptPath = path.join(
  repoRoot,
  '.agents/skills/openclaw-agent-design-review/scripts/check_design_evidence.sh',
);

function makeTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'openclaw-design-evidence-'));
}

function writeDesignFile(content) {
  const tempDir = makeTempDir();
  const designPath = path.join(tempDir, 'design.md');
  fs.writeFileSync(designPath, content, 'utf8');
  return designPath;
}

function runEvidenceCheck(designContent) {
  const designPath = writeDesignFile(designContent);
  return spawnSync('/bin/bash', [scriptPath, designPath], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
}

function buildBaseSections() {
  return `# Example Agent Design

> **Design ID:** \`example-design\`
> **Date:** 2026-03-08
> **Status:** Draft
> **Scope:** Example scope

## Overview

| Action | Path | Notes |
|--------|------|-------|
| UPDATE | .agents/skills/example-skill/SKILL.md | entrypoint skill contract |
| UPDATE | .agents/skills/example-skill/reference.md | canonical behavior notes |
| UPDATE | workspace-planner/skills/example-local/SKILL.md | workspace-local alternative |
| UPDATE | AGENTS.md | sync design and skill references |

## Architecture

### Workflow chart

Entrypoint skill path: .agents/skills/example-skill/SKILL.md

Phase 0: Existing-State Check
- Preserve REPORT_STATE.
- Preserve task.json and run.json.
- Use skill-creator and code-structure-quality.
- If using jira-cli/confluence: run env check, output runtime_setup_*.json

Review artifacts:
- projects/agent-design-review/example-design/design_review_report.md
- projects/agent-design-review/example-design/design_review_report.json

### Folder structure

- .agents/skills/example-skill/
- workspace-planner/skills/example-local/

Why this placement: shared across workspaces. jira-cli, confluence, feishu-notify — direct reuse is sufficient.

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
- Work: initialize runtime state, classify REPORT_STATE
- Output: context/runtime_setup_*.json
- User interaction: present options when FINAL_EXISTS, DRAFT_EXISTS, or CONTEXT_ONLY

### 4.1 \`.agents/skills/example-skill/reference.md\`

State machine / invariants, schemas, path conventions, validation commands, failure examples.

## Data Models

- task.json
- run.json

## Documentation Changes

### AGENTS.md

- Update AGENTS.md skill routing.
- Note workspace-planner/skills/example-local/ as the workspace-local counterpart.

### README

- README.md: no change

## Implementation Checklist

- .agents/skills/example-skill/SKILL.md
- .agents/skills/example-skill/reference.md

## References

- .agents/skills/openclaw-agent-design/reference.md
`;
}

function buildScriptBearingDesign() {
  return `${buildBaseSections()}## Functional Design 1

Package structure for script-bearing skill:

- .agents/skills/example-skill/
- .agents/skills/example-skill/runs/
- .agents/skills/example-skill/runs/<run-key>/
- .agents/skills/example-skill/scripts/
- .agents/skills/example-skill/scripts/lib/
- .agents/skills/example-skill/scripts/test/

Standards Exception Note:
- OpenClaw skill-package designs use \`scripts/test/\` as a domain-specific exception instead of a top-level \`tests/\` folder.

### Functions

### 8.1 \`.agents/skills/example-skill/scripts/check_resume.sh\`

Invocation:
- \`scripts/check_resume.sh <run-key>\`

Artifacts:
- task.json status output

| function | responsibility | inputs | outputs | side effects | failure mode |
|----------|----------------|--------|---------|--------------|--------------|
| main | Validate args and run checks | argv | stdout status | reads workspace files | exits 2 on bad usage |
| read_report_state | Classify REPORT_STATE | task.json | REPORT_STATE | none | exits 1 when task is unreadable |

Implementation detail: step 1 parse run-key from argv; step 2 read task.json and context/; step 3 classify state; step 4 print REPORT_STATE to stdout.

## Tests

| Script Path | Test Stub Path | Scenarios | Smoke Command |
|-------------|----------------|-----------|---------------|
| .agents/skills/example-skill/scripts/check_resume.sh | .agents/skills/example-skill/scripts/test/check_resume.test.js | success; required-arg failure; dependency error | \`node --test .agents/skills/example-skill/scripts/test/check_resume.test.js\` |

test('returns FINAL_EXISTS when final plan is present', () => {
  const runDir = '/tmp/test-run';
  const result = runCheckResume(runDir);
  assert.equal(result, 'FINAL_EXISTS');
});

test('exits 2 on missing run-key', () => {
  const result = runCheckResume();
  assert.equal(result.code, 2);
});
`;
}

function buildDocsOnlyDesign() {
  return `${buildBaseSections()}## Functional Design 1

Package structure for docs-only skill:

- .agents/skills/example-skill/
- .agents/skills/example-skill/reference.md

Standards Exception Note:
- This design is docs-only. No script deliverables are in scope, so \`scripts/test/\` is not required.
`;
}

test('passes a script-bearing design with package content and script test matrix', () => {
  const result = runEvidenceCheck(buildScriptBearingDesign());

  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /OK: skills content specification section is present/i);
  assert.match(result.stdout, /OK: Tests section is present/i);
});

test('fails a script-bearing design that omits Tests section', () => {
  const fullContent = buildScriptBearingDesign();
  const contentWithoutTests = fullContent.replace(/## Tests[\s\S]*$/m, '');
  const result = runEvidenceCheck(contentWithoutTests);

  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /FAIL: Tests section is present/i);
});

test('allows docs-only designs to omit script sections', () => {
  const result = runEvidenceCheck(buildDocsOnlyDesign());

  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /INFO: no script deliverables detected; skipping script-specific gates/i);
});

test('reports usage errors cleanly', () => {
  const result = spawnSync('/bin/bash', [scriptPath], {
    cwd: repoRoot,
    encoding: 'utf8',
  });

  assert.equal(result.status, 2);
  assert.match(result.stderr, /Usage: .*check_design_evidence\.sh <design-markdown-file>/i);
});

test('emits INFO (advisory) when jira/confluence used but env check omitted', () => {
  const baseWithEnvCheck = buildBaseSections();
  const contentNoEnvCheck = baseWithEnvCheck
    .replace(/- If using jira-cli\/confluence: run env check, output runtime_setup_[*]\.json\n?/, '')
    .replace(/Output: context\/runtime_setup_\*\.json/, 'Output: context/setup.json');
  const result = runEvidenceCheck(contentNoEnvCheck);

  assert.equal(result.status, 0);
  assert.match(
    result.stdout,
    /INFO:.*Phase 0 env check.*runtime_setup.*\(advisory\)/i,
  );
});

test('emits INFO (advisory) when script-bearing but runs/ omitted', () => {
  const scriptBearingWithRuns = buildScriptBearingDesign();
  const contentNoRuns = scriptBearingWithRuns
    .replace(/- \.agents\/skills\/example-skill\/runs\/\n- \.agents\/skills\/example-skill\/runs\/<run-key>\/\n/, '')
    .replace(/All artifacts live under runs\/<feature-id>\/\n/, '');
  const result = runEvidenceCheck(contentNoRuns);

  assert.equal(result.status, 0);
  assert.match(
    result.stdout,
    /INFO:.*Runtime output under runs.*\(advisory\)/i,
  );
});

test('passes design with Functional Design and Script Path fields (no Functions subsection)', () => {
  const content = `${buildBaseSections()}## Functional Design 1

1. Script Path: scripts/phase0.sh
2. Script Purpose: Prepare run directory
3. Script Inputs: runDir
4. Script Outputs: context/run_dir.json
5. Script User Interaction: none
2. Detailed Implementation: function phase0(runDir) { ... }

## Tests

| Script Path | Test Stub Path | Smoke Command |
|-------------|----------------|---------------|
| scripts/phase0.sh | scripts/test/phase0.test.js | \`node --test scripts/test/phase0.test.js\` |

test('returns FINAL_EXISTS when final plan is present', () => {
  const runDir = '/tmp/test-run';
  const result = runCheckResume(runDir);
  assert.equal(result, 'FINAL_EXISTS');
});

## Documentation Changes

### AGENTS.md
- Update skill routing

### README
- README.md: no change

## Implementation Checklist

## References
`;
  const result = runEvidenceCheck(content);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /OK:.*Functions or Functional Design/i);
});

test('fails when design has outline-style Skills Content', () => {
  const outlineContent = `# Example Design

> **Design ID:** outline-test
> **Scope:** Test outline-style rejection

## Overview

| Action | Path | Notes |
|--------|------|-------|
| UPDATE | .agents/skills/example-skill/SKILL.md | entrypoint |
| UPDATE | workspace-planner/skills/example-local/SKILL.md | workspace-local |

## Architecture

### Workflow chart

Entrypoint: .agents/skills/example-skill/SKILL.md
Phase 0: REPORT_STATE, task.json, run.json
skill-creator, code-structure-quality
jira-cli, confluence, feishu-notify — direct reuse is sufficient
Why this placement: shared across workspaces

## Skills Content Specification

### 3.1 \`.agents/skills/example-skill/SKILL.md\`

Target path:
- .agents/skills/example-skill/SKILL.md

Purpose:
- Example design.

Input contract:
- design_id: string

## Functions

| function | responsibility | inputs | outputs | side effects | failure mode |
|----------|----------------|--------|---------|--------------|--------------|
| main | run checks | argv | stdout | reads files | exits 2 |

## Tests

| Script Path | Test Stub Path |
|-------------|----------------|
| scripts/check_resume.sh | scripts/test/check_resume.test.js |

Stub scenarios:
- returns FINAL_EXISTS when final plan present

## Documentation Changes

### AGENTS.md
- Update skill routing

### README
- README.md: no change

## Implementation Checklist

## References

design_review_report.md
`;
  const result = runEvidenceCheck(outlineContent);
  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /FAIL:.*outline-style|FAIL:.*Target path|Exact-content failures|FAIL:.*Stub scenarios/i);
});
