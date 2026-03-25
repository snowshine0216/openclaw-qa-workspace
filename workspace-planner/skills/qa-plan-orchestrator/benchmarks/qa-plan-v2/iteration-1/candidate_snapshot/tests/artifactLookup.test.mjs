import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { writeArtifactLookup } from '../scripts/lib/artifactLookup.mjs';

test('writeArtifactLookup preserves legacy Phase 6 coverage without populating Phase 5b', async () => {
  const root = await mkdtemp(join(tmpdir(), 'artifact-lookup-'));
  const projectDir = join(root, 'workspace-planner', 'skills', 'qa-plan-orchestrator', 'runs', 'BCIN-LEGACY');
  const contextDir = join(projectDir, 'context');
  await mkdir(contextDir, { recursive: true });
  await writeFile(join(contextDir, 'jira_issue_BCIN-LEGACY.md'), '# Jira\n');
  await writeFile(
    join(contextDir, 'artifact_lookup_BCIN-LEGACY.md'),
    `# Artifact Lookup — BCIN-LEGACY

| # | Artifact Key | File Path | Source Phase | Phase 4a | Phase 4b | Phase 5 | Phase 6 |
|---|---|---|---|---|---|---|---|
| 1 | \`jira_context\` | \`context/jira_issue_BCIN-LEGACY.md\` | Phase 1 | ❌ | ❌ | ❌ | ✅ |
`,
    'utf8'
  );

  await writeArtifactLookup('BCIN-LEGACY', projectDir);
  const content = await readFile(join(contextDir, 'artifact_lookup_BCIN-LEGACY.md'), 'utf8');
  assert.match(content, /\| 1 \| `jira_context` \| `context\/jira_issue_BCIN-LEGACY\.md` \| jira_issue \| jira \| primary \| Phase 1 \| — \| `—` \| no \| ❌ \| ❌ \| ❌ \| ❌ \| ✅ \|/);

  await rm(root, { recursive: true, force: true });
});

test('writeArtifactLookup fails when a phase1 required support artifact is missing from the index', async () => {
  const root = await mkdtemp(join(tmpdir(), 'artifact-lookup-'));
  const projectDir = join(root, 'workspace-planner', 'skills', 'qa-plan-orchestrator', 'runs', 'BCIN-REQ');
  const contextDir = join(projectDir, 'context');
  await mkdir(contextDir, { recursive: true });
  await writeFile(join(contextDir, 'jira_issue_BCIN-REQ.md'), '# Jira\n');
  await writeFile(
    join(projectDir, 'task.json'),
    JSON.stringify({
      feature_id: 'BCIN-REQ',
      request_requirements: [
        {
          requirement_id: 'req-support-summary',
          required_phase: 'phase1',
          required_artifacts: ['context/supporting_issue_summary_BCIN-REQ.md'],
        },
      ],
    }, null, 2),
  );

  await assert.rejects(
    () => writeArtifactLookup('BCIN-REQ', projectDir),
    /missing required request artifacts/i,
  );

  await rm(root, { recursive: true, force: true });
});

test('writeArtifactLookup classifies knowledge-pack summary and retrieval artifacts as workflow context', async () => {
  const root = await mkdtemp(join(tmpdir(), 'artifact-lookup-'));
  const projectDir = join(root, 'workspace-planner', 'skills', 'qa-plan-orchestrator', 'runs', 'BCIN-PACK');
  const contextDir = join(projectDir, 'context');
  await mkdir(contextDir, { recursive: true });
  await writeFile(join(contextDir, 'jira_issue_BCIN-PACK.md'), '# Jira\n');
  await writeFile(join(contextDir, 'knowledge_pack_summary_BCIN-PACK.md'), '# Summary\n');
  await writeFile(join(contextDir, 'knowledge_pack_retrieval_BCIN-PACK.json'), '{}\n');
  await writeFile(join(contextDir, 'coverage_ledger_BCIN-PACK.json'), '{}\n');

  await writeArtifactLookup('BCIN-PACK', projectDir);
  const content = await readFile(join(contextDir, 'artifact_lookup_BCIN-PACK.md'), 'utf8');

  assert.match(content, /knowledge_pack_summary/);
  assert.match(content, /knowledge_pack_retrieval/);
  assert.match(content, /coverage_ledger_json/);

  await rm(root, { recursive: true, force: true });
});
