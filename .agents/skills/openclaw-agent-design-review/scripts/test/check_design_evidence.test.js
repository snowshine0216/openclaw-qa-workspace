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

Review artifacts:
- projects/agent-design-review/example-design/design_review_report.md
- projects/agent-design-review/example-design/design_review_report.json

### Folder structure

- .agents/skills/example-skill/
- workspace-planner/skills/example-local/

## Skills Content Specification

### 3.1 \`.agents/skills/example-skill/SKILL.md\`

Purpose:
- Example design.

When to trigger:
- Use when the user asks for OpenClaw workflow design help.

Input contract:
- design_id: string

Output contract:
- design markdown artifact

Workflow/phase responsibilities:
- phase 0 preserves REPORT_STATE.

Error/ambiguity policy:
- Stop and ask when requirements are ambiguous.

Quality rules:
- Use skill-creator and code-structure-quality.

Classification:
- shared

Why this placement:
- shared across workspaces.

Existing skills reused directly:
- jira-cli — direct reuse is sufficient
- confluence — direct reuse is sufficient
- feishu-notify — direct reuse is sufficient

### 4.1 \`.agents/skills/example-skill/reference.md\`

- state machine / invariants
- schemas or field-level contracts
- path conventions
- validation commands
- failure examples and recovery rules

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

## Tests

| Script Path | Test Stub Path | Scenarios | Smoke Command |
|-------------|----------------|-----------|---------------|
| .agents/skills/example-skill/scripts/check_resume.sh | .agents/skills/example-skill/scripts/test/check_resume.test.js | success; required-arg failure; dependency error | \`node --test .agents/skills/example-skill/scripts/test/check_resume.test.js\` |

| Script Path | Test Stub Path | Failure-Path Stub |
|-------------|----------------|-------------------|
| .agents/skills/example-skill/scripts/check_resume.sh | .agents/skills/example-skill/scripts/test/check_resume.test.js | usage error |
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
