import test from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { join } from 'node:path';

const SCRIPT_DIR = join(import.meta.dirname, '..');

test('exits with usage when feature_key is missing', () => {
  try {
    execSync(`bash "${SCRIPT_DIR}/orchestrate.sh"`, {
      encoding: 'utf8',
      stdio: 'pipe',
    });
    assert.fail('Expected non-zero exit');
  } catch (e) {
    assert.ok(e.status > 0);
    assert.match(e.stderr || e.stdout || '', /Usage|feature-key/i);
  }
});

test('creates run dir structure when run with feature_key', async () => {
  const { mkdtemp } = await import('node:fs/promises');
  const { existsSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-orchestrate-'));
  const repoRoot = join(SCRIPT_DIR, '..', '..', '..');
  try {
    execSync(`bash "${SCRIPT_DIR}/orchestrate.sh" BCIN-9999 "${runDir}"`, {
      encoding: 'utf8',
      stdio: 'pipe',
      timeout: 5000,
      cwd: repoRoot,
    });
    assert.fail('Expected planner resolution to block');
  } catch (e) {
    if (e.status !== 2) throw e;
    assert.match(e.stdout || '', /PHASE0_DONE/);
    assert.match(
      e.stdout || e.stderr || '',
      /BLOCKED: Provide QA plan markdown for BCIN-9999/
    );
  }
  assert.ok(existsSync(join(runDir, 'context')));
  assert.ok(existsSync(join(runDir, 'drafts')));
  assert.ok(existsSync(join(runDir, 'archive')));
  assert.ok(existsSync(join(runDir, 'task.json')), 'task.json should exist after phase0');
  assert.ok(existsSync(join(runDir, 'run.json')), 'run.json should exist after phase0');
});

test('consumes APPROVE input and completes the remaining phases from awaiting_approval', async () => {
  const { mkdtemp, mkdir, writeFile, readFile } = await import('node:fs/promises');
  const { existsSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-orchestrate-approval-'));
  const repoRoot = join(SCRIPT_DIR, '..', '..', '..');

  await mkdir(join(runDir, 'drafts'), { recursive: true });
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(join(runDir, 'drafts', 'BCIN-9999_QA_SUMMARY_DRAFT.md'), '# Reviewed Draft');
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({
      overall_status: 'awaiting_approval',
      current_phase: 'phase4',
      publish_mode: 'skip',
    })
  );
  await writeFile(join(runDir, 'run.json'), JSON.stringify({ notification_pending: null }));

  execSync(`bash "${SCRIPT_DIR}/orchestrate.sh" BCIN-9999 "${runDir}"`, {
    encoding: 'utf8',
    stdio: 'pipe',
    cwd: repoRoot,
    env: { ...process.env, QA_SUMMARY_APPROVAL_DECISION: 'APPROVE', FEISHU_CHAT_ID: '' },
  });

  assert.ok(existsSync(join(runDir, 'BCIN-9999_QA_SUMMARY_FINAL.md')));
  const task = JSON.parse(await readFile(join(runDir, 'task.json'), 'utf8'));
  assert.equal(task.overall_status, 'completed');
  assert.equal(task.current_phase, 'phase6');
});

test('short-circuits completed use_existing runs instead of re-running phase6', async () => {
  const { mkdtemp, writeFile, readFile } = await import('node:fs/promises');
  const { tmpdir } = await import('node:os');
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-orchestrate-existing-'));
  const repoRoot = join(SCRIPT_DIR, '..', '..', '..');
  const finalPath = join(runDir, 'BCIN-9999_QA_SUMMARY_FINAL.md');

  await writeFile(finalPath, '# Existing Final Summary');
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({
      overall_status: 'completed',
      selected_mode: 'use_existing',
      current_phase: 'phase6',
    })
  );

  const output = execSync(`bash "${SCRIPT_DIR}/orchestrate.sh" BCIN-9999 "${runDir}"`, {
    encoding: 'utf8',
    stdio: 'pipe',
    cwd: repoRoot,
  });

  assert.match(output, /PHASE0_USE_EXISTING/);
  const final = await readFile(finalPath, 'utf8');
  assert.equal(final, '# Existing Final Summary');
});

test('stops immediately when a phase exits non-zero without a block marker', async () => {
  const { mkdtemp, writeFile, chmod } = await import('node:fs/promises');
  const { tmpdir } = await import('node:os');
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-orchestrate-failfast-'));
  const fakeBinDir = await mkdtemp(join(tmpdir(), 'qa-summary-fake-node-'));
  const repoRoot = join(SCRIPT_DIR, '..', '..', '..');
  const fakeNodePath = join(fakeBinDir, 'node');

  await writeFile(
    fakeNodePath,
    `#!/usr/bin/env bash
if [[ "$1" == *"/phase1.mjs" ]]; then
  echo "TypeError: simulated crash" >&2
  exit 1
fi
exec "${process.execPath}" "$@"
`,
    'utf8'
  );
  await chmod(fakeNodePath, 0o755);

  try {
    execSync(`bash "${SCRIPT_DIR}/orchestrate.sh" BCIN-0001 "${runDir}"`, {
      encoding: 'utf8',
      stdio: 'pipe',
      cwd: repoRoot,
      env: { ...process.env, PATH: `${fakeBinDir}:${process.env.PATH}` },
    });
    assert.fail('Expected orchestrator to exit non-zero');
  } catch (e) {
    assert.equal(e.status, 1);
    assert.match(e.stdout || '', /PHASE0_DONE/);
    assert.match(e.stdout || e.stderr || '', /TypeError: simulated crash/);
    assert.doesNotMatch(e.stdout || '', /SPAWN_MANIFEST:/);
  }
});

test('re-runs phase post-processing when review emits a second manifest', async () => {
  const { mkdtemp, writeFile, chmod, mkdir, readFile } = await import('node:fs/promises');
  const { tmpdir } = await import('node:os');
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-orchestrate-review-loop-'));
  const fakeBinDir = await mkdtemp(join(tmpdir(), 'qa-summary-fake-node-'));
  const repoRoot = join(SCRIPT_DIR, '..', '..', '..');
  const fakeNodePath = join(fakeBinDir, 'node');

  await mkdir(join(runDir, 'context'), { recursive: true });
  await mkdir(join(runDir, 'drafts'), { recursive: true });
  await writeFile(
    fakeNodePath,
    `#!/usr/bin/env bash
script="$1"
feature_key="$2"
run_dir="$3"
mode="$4"
case "$script" in
  *"/spawn_from_manifest.mjs")
    printf '%s\\n' "$2" >> "$4/spawned_manifests.log"
    exit 0
    ;;
  *"/phase0.mjs")
    mkdir -p "$run_dir/context" "$run_dir/drafts"
    cat > "$run_dir/task.json" <<EOF
{"overall_status":"in_progress","current_phase":"phase0"}
EOF
    cat > "$run_dir/run.json" <<EOF
{}
EOF
    echo "PHASE0_DONE"
    exit 0
    ;;
  *"/phase1.mjs")
    echo "PHASE1_DONE"
    exit 0
    ;;
  *"/phase2.mjs")
    echo "PHASE2_DONE"
    exit 0
    ;;
  *"/phase3.mjs")
    echo "# Draft" > "$run_dir/drafts/\${feature_key}_QA_SUMMARY_DRAFT.md"
    echo "PHASE3_DONE"
    exit 0
    ;;
  *"/phase4.mjs")
    if [[ "$mode" == "--post" ]]; then
      count_file="$run_dir/phase4-post-count"
      count="$(cat "$count_file" 2>/dev/null || echo 0)"
      if [[ "$count" == "0" ]]; then
        echo 1 > "$count_file"
        cat > "$run_dir/phase4-second-manifest.json" <<EOF
{"version":1,"phase":"phase4","requests":[]}
EOF
        echo "SPAWN_MANIFEST: $run_dir/phase4-second-manifest.json"
        exit 0
      fi
      echo "# Reviewed Draft"
      echo "Awaiting APPROVE or revision feedback" >&2
      exit 2
    fi
    cat > "$run_dir/phase4-first-manifest.json" <<EOF
{"version":1,"phase":"phase4","requests":[]}
EOF
    echo "SPAWN_MANIFEST: $run_dir/phase4-first-manifest.json"
    exit 0
    ;;
  *"/phase5.mjs")
    echo "PHASE5_DONE"
    exit 0
    ;;
  *"/phase6.mjs")
    echo "PHASE6_DONE"
    exit 0
    ;;
esac
exec "${process.execPath}" "$@"
`,
    'utf8'
  );
  await chmod(fakeNodePath, 0o755);

  try {
    execSync(`bash "${SCRIPT_DIR}/orchestrate.sh" BCIN-1111 "${runDir}"`, {
      encoding: 'utf8',
      stdio: 'pipe',
      cwd: repoRoot,
      env: { ...process.env, PATH: `${fakeBinDir}:${process.env.PATH}` },
    });
    assert.fail('Expected approval gate to block execution');
  } catch (e) {
    assert.equal(e.status, 2);
    assert.match(e.stdout || '', /phase4-first-manifest\.json/);
    assert.match(e.stdout || '', /phase4-second-manifest\.json/);
    assert.doesNotMatch(e.stdout || '', /PHASE5_DONE/);

    const spawned = (await readFile(join(runDir, 'spawned_manifests.log'), 'utf8'))
      .trim()
      .split('\n');
    assert.deepEqual(spawned.map((line) => line.trim()), [
      join(runDir, 'phase4-first-manifest.json'),
      join(runDir, 'phase4-second-manifest.json'),
    ]);
  }
});
