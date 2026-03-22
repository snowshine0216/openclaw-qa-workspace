import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { dirname, join, relative } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = join(fileURLToPath(new URL('../../../../../', import.meta.url)));
const ORCHESTRATE = join(
  REPO_ROOT,
  '.agents/skills/qa-plan-evolution/scripts/orchestrate.sh',
);

async function writeJson(path, payload) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

test('orchestrate stops cleanly when phase2 produces no pending mutations', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'seo-orchestrate-repo-'));
  const runRoot = await mkdtemp(join(tmpdir(), 'seo-orchestrate-clean-'));
  const runKey = 'orchestrate-clean-stop';

  try {
    const targetRoot = join(repoRoot, 'target-skill');
    await mkdir(join(targetRoot, 'evals'), { recursive: true });
    await writeFile(join(targetRoot, 'SKILL.md'), '# Target Skill\n\nREPORT_STATE\n', 'utf8');
    await writeFile(join(targetRoot, 'reference.md'), '# Target Reference\n\nREPORT_STATE\n', 'utf8');
    await writeJson(join(targetRoot, 'evals', 'evals.json'), {
      eval_groups: [
        { id: 'core_contract', policy: 'blocking', prompt: 'keep contract coverage' },
      ],
    });

    const result = spawnSync('bash', [
      ORCHESTRATE,
      '--with-phase0',
      '--run-key', runKey,
      '--run-root', runRoot,
      '--repo-root', repoRoot,
      '--target-skill-path', relative(repoRoot, targetRoot),
      '--target-skill-name', 'target-skill',
      '--benchmark-profile', 'generic-skill-regression',
    ], {
      encoding: 'utf8',
    });

    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /STOP_RUN: no blocking gaps remain/i);
    assert.equal(
      existsSync(join(runRoot, 'candidates', 'iteration-1', 'validation_report.json')),
      false,
    );

    const task = JSON.parse(await readFile(join(runRoot, 'task.json'), 'utf8'));
    assert.equal(task.overall_status, 'completed');
    assert.equal(task.current_phase, 'phase3');

    const nextAction = JSON.parse(
      await readFile(join(runRoot, 'context', `next_action_${runKey}.json`), 'utf8'),
    );
    assert.equal(nextAction.next_action, 'stop_no_blocking_gaps');
    assert.equal(existsSync(join(runRoot, 'evolution_final.md')), true);
  } finally {
    await rm(repoRoot, { recursive: true, force: true });
    await rm(runRoot, { recursive: true, force: true });
  }
});
