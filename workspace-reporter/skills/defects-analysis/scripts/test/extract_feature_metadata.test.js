import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { extractFeatureMetadata } from '../lib/extract_feature_metadata.mjs';

test('extractFeatureMetadata preserves Jira issue type from route_decision schema', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-feature-metadata-'));
  try {
    await mkdir(join(runDir, 'context'), { recursive: true });
    await writeFile(
      join(runDir, 'task.json'),
      JSON.stringify({
        run_key: 'BCIN-7289',
        route_kind: 'reporter_scope_single_key',
      }),
      'utf8',
    );
    await writeFile(
      join(runDir, 'context', 'route_decision.json'),
      JSON.stringify({
        run_key: 'BCIN-7289',
        route_kind: 'reporter_scope_single_key',
        jira_issue_type: 'Feature',
      }),
      'utf8',
    );

    const metadata = extractFeatureMetadata(runDir, 'BCIN-7289');

    assert.equal(metadata.issue_type, 'Feature');
    const persisted = JSON.parse(
      await readFile(join(runDir, 'context', 'feature_metadata.json'), 'utf8'),
    );
    assert.equal(persisted.issue_type, 'Feature');
  } finally {
    await rm(runDir, { recursive: true, force: true });
  }
});

test('extractFeatureMetadata preserves release version passed from a release coordinator run', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-feature-metadata-release-'));
  try {
    await mkdir(join(runDir, 'context'), { recursive: true });
    await writeFile(
      join(runDir, 'task.json'),
      JSON.stringify({
        run_key: 'BCIN-7289',
        route_kind: 'reporter_scope_single_key',
        release_version_context: '26.04',
      }),
      'utf8',
    );
    await writeFile(
      join(runDir, 'context', 'route_decision.json'),
      JSON.stringify({
        run_key: 'BCIN-7289',
        route_kind: 'reporter_scope_single_key',
        jira_issue_type: 'Feature',
      }),
      'utf8',
    );
    await writeFile(
      join(runDir, 'context', 'jira_raw.json'),
      JSON.stringify({
        issues: [
          {
            key: 'BCIN-7289',
            fields: {
              summary: 'Embed Library Report Editor into the Workstation Report Authoring',
            },
          },
        ],
      }),
      'utf8',
    );

    const metadata = extractFeatureMetadata(runDir, 'BCIN-7289');

    assert.equal(metadata.release_version, '26.04');
    const persisted = JSON.parse(
      await readFile(join(runDir, 'context', 'feature_metadata.json'), 'utf8'),
    );
    assert.equal(persisted.release_version, '26.04');
  } finally {
    await rm(runDir, { recursive: true, force: true });
  }
});
