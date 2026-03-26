import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm, chmod } from 'node:fs/promises';
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

test('falls back to codex when openclaw is unavailable and writes the requested output file', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-spawn-fallback-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  const manifestPath = join(runDir, 'phase4_spawn_manifest.json');
  const codexBin = join(runDir, 'fake-codex.sh');
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
  await writeFile(
    codexBin,
    `#!/usr/bin/env bash
set -euo pipefail
output=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    -o)
      output="$2"
      shift 2
      ;;
    *)
      shift
      ;;
  esac
done
[[ -n "$output" ]] || exit 1
mkdir -p "$(dirname "$output")"
cat <<'EOF' > "$output"
# Generated PR Impact

Repository: repo
Risk: Medium
Domains: api,ui
PR: https://github.com/org/repo/pull/12
EOF
`,
  );
  await chmod(codexBin, 0o755);

  const originalOpenclawBin = process.env.OPENCLAW_BIN;
  const originalCodexBin = process.env.CODEX_BIN;
  process.env.OPENCLAW_BIN = join(runDir, 'missing-openclaw-bin');
  process.env.CODEX_BIN = codexBin;

  try {
    const outcome = await runFromManifest(manifestPath, { cwd: runDir });
    const spawnResults = JSON.parse(
      await readFile(join(runDir, 'spawn_results.json'), 'utf8'),
    );
    const output = await readFile(join(runDir, 'context', 'prs', 'pr-1_impact.md'), 'utf8');

    assert.equal(outcome.failed, false);
    assert.equal(spawnResults.results[0]?.kind, 'openclaw_fallback_codex');
    assert.equal(spawnResults.results[0]?.status, 'completed');
    assert.match(output, /Generated PR Impact/);
  } finally {
    process.env.OPENCLAW_BIN = originalOpenclawBin;
    process.env.CODEX_BIN = originalCodexBin;
    await rm(runDir, { recursive: true, force: true });
  }
});
