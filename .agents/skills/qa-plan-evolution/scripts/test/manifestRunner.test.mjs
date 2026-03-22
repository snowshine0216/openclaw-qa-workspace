import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { runManifest } from '../lib/manifestRunner.mjs';

test('manifestRunner materializes declared output files in test mode', async () => {
  const root = await mkdtemp(join(tmpdir(), 'seo-manifest-'));
  const manifestPath = join(root, 'manifest.json');
  const outputFile = 'outputs/generated.md';
  try {
    await mkdir(root, { recursive: true });
    await writeFile(manifestPath, JSON.stringify({
      requests: [
        {
          openclaw: {
            args: {
              output_file: outputFile,
            },
          },
        },
      ],
    }), 'utf8');

    const originalMode = process.env.TEST_SPAWN_OUTPUT_MODE;
    process.env.TEST_SPAWN_OUTPUT_MODE = 'materialize';
    try {
      const outcome = await runManifest(manifestPath, { cwd: root });
      assert.equal(outcome.failed, false);
    } finally {
      process.env.TEST_SPAWN_OUTPUT_MODE = originalMode;
    }

    const materialized = await readFile(join(root, outputFile), 'utf8');
    assert.match(materialized, /Materialized output/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
