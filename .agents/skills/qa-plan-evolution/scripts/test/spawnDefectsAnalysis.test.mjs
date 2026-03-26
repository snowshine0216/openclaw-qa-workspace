import test from 'node:test';
import assert from 'node:assert/strict';
import { chmod, cp, mkdtemp, mkdir, readFile, realpath, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = join(fileURLToPath(new URL('../../../../../', import.meta.url)));
const SPAWN_DEFECTS_ANALYSIS = join(
  REPO_ROOT,
  '.agents/skills/qa-plan-evolution/scripts/spawn_defects_analysis.sh',
);

async function writeExecutable(path, contents) {
  await writeFile(path, contents, 'utf8');
  await chmod(path, 0o755);
}

test('spawn_defects_analysis uses the reporter run key for gap-bundle refresh', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'seo-defects-helper-'));
  const evolutionRunKey = 'evolution-20260321';
  const reporterRunKey = 'BCIN-7289';
  const reporterRoot = join(repoRoot, 'workspace-reporter', 'skills', 'defects-analysis');
  const artifactResolverRoot = join(repoRoot, '.agents', 'skills', 'lib');
  const scriptsRoot = join(reporterRoot, 'scripts');
  const reporterRunRoot = join(
    repoRoot,
    'workspace-artifacts',
    'skills',
    'workspace-reporter',
    'defects-analysis',
    'runs',
    reporterRunKey,
  );

  try {
    await mkdir(scriptsRoot, { recursive: true });
    await mkdir(artifactResolverRoot, { recursive: true });
    await cp(
      join(REPO_ROOT, '.agents/skills/lib/artifactRoots.mjs'),
      join(artifactResolverRoot, 'artifactRoots.mjs'),
    );
    await writeExecutable(
      join(scriptsRoot, 'orchestrate.sh'),
      `#!/usr/bin/env bash
set -euo pipefail
exit 0
`,
    );
    await writeExecutable(
      join(scriptsRoot, 'phase_gap_bundle.sh'),
      `#!/usr/bin/env bash
set -euo pipefail
RUN_KEY="$1"
RUN_ROOT="$2"
mkdir -p "$RUN_ROOT/context"
printf '%s\n%s\n%s\n' "$RUN_KEY" "$RUN_ROOT" "$INVOKED_BY" > "$RUN_ROOT/context/gap_bundle_args.txt"
`,
    );
    await writeFile(
      join(scriptsRoot, 'spawn_from_manifest.mjs'),
      'process.exit(0);\n',
      'utf8',
    );

    const result = spawnSync('bash', [
      SPAWN_DEFECTS_ANALYSIS,
      '--repo-root', repoRoot,
      '--run-key', evolutionRunKey,
      '--defect-analysis-run-key', reporterRunKey,
      '--feature-id', reporterRunKey,
      '--feature-family', 'report-editor',
    ], {
      encoding: 'utf8',
    });

    assert.equal(result.status, 0, result.stderr);
    const argsPath = join(
      reporterRunRoot,
      'context',
      'gap_bundle_args.txt',
    );
    const recordedArgs = (await readFile(argsPath, 'utf8')).trim().split('\n');
    assert.deepEqual(recordedArgs, [
      reporterRunKey,
      await realpath(reporterRunRoot),
      'qa-plan-evolution',
    ]);
    assert.equal(
      existsSync(join(reporterRoot, 'runs', evolutionRunKey, 'context', 'gap_bundle_args.txt')),
      false,
    );
  } finally {
    await rm(repoRoot, { recursive: true, force: true });
  }
});
