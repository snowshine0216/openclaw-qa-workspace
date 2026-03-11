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
  assert.match(content, /\| 1 \| `jira_context` \| `context\/jira_issue_BCIN-LEGACY\.md` \| Phase 1 \| ❌ \| ❌ \| ❌ \| ❌ \| ✅ \|/);

  await rm(root, { recursive: true, force: true });
});
