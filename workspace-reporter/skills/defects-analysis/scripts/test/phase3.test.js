import test from 'node:test';
import assert from 'node:assert/strict';
import { chmod, mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

const SCRIPT = join(process.cwd(), 'workspace-reporter/skills/defects-analysis/scripts/phase3.sh');

test('normalizes defects and extracts unique pr links', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-phase3-'));
  await mkdir(join(runDir, 'context', 'jira_issues'), { recursive: true });
  await writeFile(
    join(runDir, 'context', 'jira_raw.json'),
    JSON.stringify({
      issues: [
        {
          key: 'BUG-1',
          fields: {
            summary: 'Panel hides unexpectedly',
            description: 'Fix in https://github.com/org/repo/pull/12',
            status: { name: 'Resolved' },
            priority: { name: 'High' },
            assignee: { displayName: 'Ada' },
            resolutiondate: '2026-03-10T12:00:00.000+0000',
            comment: {
              comments: [{ body: 'Duplicate mention https://github.com/org/repo/pull/12' }],
            },
          },
        },
      ],
    }),
  );

  const result = spawnSync('bash', [SCRIPT, 'BCIN-5809', runDir], { encoding: 'utf8' });

  assert.equal(result.status, 0);
  const index = JSON.parse(await readFile(join(runDir, 'context', 'defect_index.json'), 'utf8'));
  const links = JSON.parse(await readFile(join(runDir, 'context', 'pr_links.json'), 'utf8'));
  assert.equal(index.defects.length, 1);
  assert.deepEqual(links, ['https://github.com/org/repo/pull/12']);

  await rm(runDir, { recursive: true, force: true });
});

test('forces a real child refresh when a reused legacy final run lacks summary source context', async () => {
  const root = await mkdtemp(join(tmpdir(), 'defects-analysis-phase3-release-'));
  const skillRoot = join(root, 'workspace-reporter', 'skills', 'defects-analysis');
  const runsRoot = join(skillRoot, 'runs');
  const runDir = join(runsRoot, 'release_26.03');
  const featureRunDir = join(runsRoot, 'BCIN-5809');
  const orchestrateScript = join(root, 'stub-orchestrate.sh');
  const actionLog = join(root, 'child-actions.log');

  await mkdir(join(runDir, 'context'), { recursive: true });
  await mkdir(join(featureRunDir, 'context'), { recursive: true });
  await writeFile(
    join(runDir, 'context', 'route_decision.json'),
    JSON.stringify({ run_key: 'release_26.03', route_kind: 'reporter_scope_release' }),
  );
  await writeFile(
    join(runDir, 'context', 'feature_state_matrix.json'),
    JSON.stringify({
      features: [
        {
          feature_key: 'BCIN-5809',
          report_state: 'FINAL_EXISTS',
          default_action: 'use_existing',
          selected_action: 'use_existing',
          canonical_run_dir: featureRunDir,
          release_packet_dir: join(runDir, 'features', 'BCIN-5809'),
        },
      ],
    }),
  );
  await writeFile(join(runDir, 'task.json'), '{"processed_features":0,"current_phase":"phase2"}\n');
  await writeFile(join(featureRunDir, 'BCIN-5809_REPORT_FINAL.md'), '# Legacy final only\n');
  await writeFile(
    orchestrateScript,
    `#!/usr/bin/env bash
set -euo pipefail
feature_key="$1"
action="\${2:-}"
printf '%s\\n' "$action" >> "${actionLog}"
run_dir="${featureRunDir}"
mkdir -p "$run_dir/context"
if [[ "$action" == "smart_refresh" ]]; then
  cat <<'EOF' > "$run_dir/context/feature_summary.json"
{
  "feature_key": "BCIN-5809",
  "feature_title": "Refreshed legacy feature",
  "report_final_path": "${featureRunDir}/BCIN-5809_REPORT_FINAL.md",
  "risk_level": "HIGH",
  "total_defects": 1,
  "open_defects": 1,
  "open_high_defects": 1,
  "pr_count": 0,
  "repos_changed": [],
  "top_risk_areas": ["Legacy"],
  "blocking_defects": ["BUG-LEGACY-1"],
  "generated_at": "2026-03-25T00:00:00.000Z"
}
EOF
fi
echo "PHASE5_DONE"
`,
  );
  await chmod(orchestrateScript, 0o755);

  const result = spawnSync('bash', [SCRIPT, '26.03', runDir], {
    encoding: 'utf8',
    env: {
      ...process.env,
      REPO_ROOT: root,
      ORCHESTRATE_SCRIPT: orchestrateScript,
    },
  });

  assert.equal(result.status, 0, result.stdout + result.stderr);
  const featureRuns = JSON.parse(
    await readFile(join(runDir, 'context', 'feature_runs.json'), 'utf8'),
  );
  const featureSummary = JSON.parse(
    await readFile(join(featureRunDir, 'context', 'feature_summary.json'), 'utf8'),
  );
  const actions = (await readFile(actionLog, 'utf8')).trim().split('\n');
  assert.deepEqual(actions, ['use_existing', 'smart_refresh']);
  assert.equal(featureRuns.features[0].selected_action, 'smart_refresh');
  assert.equal(featureSummary.total_defects, 1);
  assert.equal(featureSummary.open_high_defects, 1);

  await rm(root, { recursive: true, force: true });
});

test('synthesizes missing feature summary before rerunning an explicit refresh child with an existing final report', async () => {
  const root = await mkdtemp(join(tmpdir(), 'defects-analysis-phase3-release-synthesize-'));
  const skillRoot = join(root, 'workspace-reporter', 'skills', 'defects-analysis');
  const runsRoot = join(skillRoot, 'runs');
  const runDir = join(runsRoot, 'release_26.03');
  const featureRunDir = join(runsRoot, 'BCIN-5810');
  const orchestrateScript = join(root, 'stub-orchestrate.sh');
  const actionLog = join(root, 'child-actions.log');

  await mkdir(join(runDir, 'context'), { recursive: true });
  await mkdir(join(featureRunDir, 'context'), { recursive: true });
  await writeFile(
    join(runDir, 'context', 'route_decision.json'),
    JSON.stringify({ run_key: 'release_26.03', route_kind: 'reporter_scope_release' }),
  );
  await writeFile(
    join(runDir, 'context', 'feature_state_matrix.json'),
    JSON.stringify({
      features: [
        {
          feature_key: 'BCIN-5810',
          report_state: 'FINAL_EXISTS',
          default_action: 'use_existing',
          selected_action: 'smart_refresh',
          canonical_run_dir: featureRunDir,
          release_packet_dir: join(runDir, 'features', 'BCIN-5810'),
        },
      ],
    }),
  );
  await writeFile(join(runDir, 'task.json'), '{"processed_features":0,"current_phase":"phase2"}\n');
  await writeFile(join(featureRunDir, 'BCIN-5810_REPORT_FINAL.md'), '# Existing final\n');
  await writeFile(
    join(featureRunDir, 'context', 'feature_metadata.json'),
    JSON.stringify({
      feature_key: 'BCIN-5810',
      feature_title: 'Existing final feature',
      issue_type: 'Feature',
      release_version: '26.03',
    }),
  );
  await writeFile(
    join(featureRunDir, 'context', 'defect_index.json'),
    JSON.stringify({
      defects: [
        {
          key: 'BUG-EXISTING-1',
          summary: 'Existing defect',
          status: 'Open',
          priority: 'High',
          area: 'General',
          pr_links: [],
        },
      ],
    }),
  );
  await writeFile(
    join(featureRunDir, 'context', 'pr_impact_summary.json'),
    JSON.stringify({
      pr_count: 1,
      repos_changed: ['web-dossier'],
      top_risky_prs: [{ repository: 'web-dossier' }],
    }),
  );
  await writeFile(
    orchestrateScript,
    `#!/usr/bin/env bash
set -euo pipefail
printf '%s\\n' "\${2:-}" >> "${actionLog}"
echo "unexpected child rerun"
exit 99
`,
  );
  await chmod(orchestrateScript, 0o755);

  const result = spawnSync('bash', [SCRIPT, '26.03', runDir], {
    encoding: 'utf8',
    env: {
      ...process.env,
      REPO_ROOT: root,
      ORCHESTRATE_SCRIPT: orchestrateScript,
    },
  });

  assert.equal(result.status, 0, result.stdout + result.stderr);
  const featureRuns = JSON.parse(
    await readFile(join(runDir, 'context', 'feature_runs.json'), 'utf8'),
  );
  const featureSummary = JSON.parse(
    await readFile(join(featureRunDir, 'context', 'feature_summary.json'), 'utf8'),
  );
  await assert.rejects(readFile(actionLog, 'utf8'), /ENOENT/);
  assert.equal(featureRuns.features[0].selected_action, 'use_existing');
  assert.equal(featureSummary.total_defects, 1);
  assert.equal(featureSummary.pr_count, 1);

  await rm(root, { recursive: true, force: true });
});
