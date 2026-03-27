import test from 'node:test';
import assert from 'node:assert/strict';
import { chmod, mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { defaultSpawnResultsPathForManifest } from '../lib/asyncJobStore.mjs';
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

test('manifestRunner writes manifest-specific spawn results by default', async () => {
  const root = await mkdtemp(join(tmpdir(), 'seo-manifest-results-path-'));
  const manifestPath = join(root, 'phase4_spawn_manifest.json');
  try {
    await mkdir(root, { recursive: true });
    await writeFile(manifestPath, JSON.stringify({ requests: [] }), 'utf8');

    const originalMode = process.env.TEST_SPAWN_OUTPUT_MODE;
    process.env.TEST_SPAWN_OUTPUT_MODE = 'materialize';
    try {
      const outcome = await runManifest(manifestPath, { cwd: root });
      assert.equal(outcome.failed, false);
    } finally {
      process.env.TEST_SPAWN_OUTPUT_MODE = originalMode;
    }

    const results = JSON.parse(
      await readFile(defaultSpawnResultsPathForManifest(manifestPath), 'utf8'),
    );
    assert.deepEqual(results, { results: [] });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('manifestRunner falls back to codex when openclaw is unavailable', async () => {
  const root = await mkdtemp(join(tmpdir(), 'seo-manifest-fallback-'));
  const manifestPath = join(root, 'manifest.json');
  const codexBin = join(root, 'fake-codex.sh');
  const codexLog = join(root, 'codex.log');
  const outputFile = 'outputs/fallback.md';
  try {
    await writeFile(
      codexBin,
      `#!/usr/bin/env bash
set -euo pipefail
printf "%s\\n" "$*" >> "${codexLog}"
out=""
while [ "$#" -gt 0 ]; do
  if [ "$1" = "-o" ]; then
    shift
    out="$1"
  fi
  shift || true
done
if [ -n "$out" ]; then
  mkdir -p "$(dirname "$out")"
  printf "fallback output\\n" > "$out"
fi
exit 0
`,
      'utf8',
    );
    await chmod(codexBin, 0o755);
    await mkdir(join(root, 'outputs'), { recursive: true });
    await writeFile(manifestPath, JSON.stringify({
      requests: [
        {
          openclaw: {
            args: {
              task: 'Run fallback test task',
              output_file: outputFile,
            },
          },
        },
      ],
    }), 'utf8');

    const originalOpenclaw = process.env.OPENCLAW_BIN;
    const originalCodex = process.env.CODEX_BIN;
    process.env.OPENCLAW_BIN = join(root, 'missing-openclaw-bin');
    process.env.CODEX_BIN = codexBin;
    try {
      const outcome = await runManifest(manifestPath, { cwd: root });
      assert.equal(outcome.failed, false);
      assert.equal(outcome.results[0]?.kind, 'openclaw_fallback_codex');
      assert.equal(outcome.results[0]?.status, 'completed');
    } finally {
      process.env.OPENCLAW_BIN = originalOpenclaw;
      process.env.CODEX_BIN = originalCodex;
    }

    const materialized = await readFile(join(root, outputFile), 'utf8');
    assert.match(materialized, /fallback output/);
    const log = await readFile(codexLog, 'utf8');
    assert.match(log, /exec --full-auto --sandbox workspace-write/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('manifestRunner does not hide real openclaw task failures behind codex fallback', async () => {
  const root = await mkdtemp(join(tmpdir(), 'seo-manifest-openclaw-fail-'));
  const manifestPath = join(root, 'manifest.json');
  const openclawBin = join(root, 'fake-openclaw.sh');
  const codexBin = join(root, 'fake-codex.sh');
  const codexLog = join(root, 'codex.log');
  try {
    await writeFile(
      openclawBin,
      `#!/usr/bin/env bash
set -euo pipefail
printf "real task failure\\n" >&2
exit 17
`,
      'utf8',
    );
    await writeFile(
      codexBin,
      `#!/usr/bin/env bash
set -euo pipefail
printf "codex should not run\\n" >> "${codexLog}"
exit 0
`,
      'utf8',
    );
    await chmod(openclawBin, 0o755);
    await chmod(codexBin, 0o755);
    await writeFile(manifestPath, JSON.stringify({
      requests: [
        {
          openclaw: {
            args: {
              task: 'Run task that should fail in openclaw',
            },
          },
        },
      ],
    }), 'utf8');

    const originalOpenclaw = process.env.OPENCLAW_BIN;
    const originalCodex = process.env.CODEX_BIN;
    process.env.OPENCLAW_BIN = openclawBin;
    process.env.CODEX_BIN = codexBin;
    try {
      const outcome = await runManifest(manifestPath, { cwd: root });
      assert.equal(outcome.failed, true);
      assert.equal(outcome.results[0]?.kind, 'openclaw');
      assert.equal(outcome.results[0]?.status, 'failed');
      assert.match(outcome.results[0]?.stderr || '', /exit_status=17/);
    } finally {
      process.env.OPENCLAW_BIN = originalOpenclaw;
      process.env.CODEX_BIN = originalCodex;
    }

    await assert.rejects(() => readFile(codexLog, 'utf8'));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
