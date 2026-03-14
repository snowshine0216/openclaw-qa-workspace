import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { runFromManifest } from '../spawn_from_manifest.mjs';

test('passes output path instructions into spawned task payloads', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-spawn-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  const manifestPath = join(runDir, 'phase4_spawn_manifest.json');
  await writeFile(
    manifestPath,
    JSON.stringify({
      requests: [
        {
          openclaw: {
            args: {
              task: 'Analyze PR 12',
              label: 'pr-1',
              mode: 'run',
              runtime: 'subagent',
              output_file: 'context/prs/pr-1_impact.md',
            },
          },
        },
      ],
    }),
  );

  const captured = [];
  await runFromManifest(manifestPath, {
    cwd: runDir,
    spawnImpl: (bin, args) => {
      captured.push({ bin, args });
      return { status: 0, stderr: '' };
    },
  });

  assert.equal(captured.length, 1);
  const taskArgIndex = captured[0].args.indexOf('--task');
  assert.notEqual(taskArgIndex, -1);
  assert.match(captured[0].args[taskArgIndex + 1], /Write the analysis to:/);
  assert.match(captured[0].args[taskArgIndex + 1], /context\/prs\/pr-1_impact\.md/);

  await rm(runDir, { recursive: true, force: true });
});
