#!/usr/bin/env node
/**
 * Run evals for single-defect-analysis.
 *
 * 1. Creates workspace directory structure
 * 2. Writes eval_metadata.json for each eval
 * 3. Outputs a spawn manifest for running with/without skill
 *
 * Usage:
 *   node evals/run_evals.mjs [--workspace PATH] [--iteration N] [--dry-run]
 *
 * After spawning runs and grading, use evals/post_run.sh to aggregate and generate the viewer.
 */

import { readFileSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = join(__dirname, '..');
const WORKSPACE_DEFAULT = join(SKILL_ROOT, '..', 'single-defect-analysis-workspace');

function parseArgs() {
  const args = process.argv.slice(2);
  let workspace = WORKSPACE_DEFAULT;
  let iteration = 1;
  let dryRun = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--workspace' && args[i + 1]) {
      workspace = args[++i];
    } else if (args[i] === '--iteration' && args[i + 1]) {
      iteration = parseInt(args[++i], 10) || 1;
    } else if (args[i] === '--dry-run') {
      dryRun = true;
    }
  }

  return { workspace, iteration, dryRun };
}

function loadEvals() {
  const evalsPath = join(SKILL_ROOT, 'evals', 'evals.json');
  const raw = readFileSync(evalsPath, 'utf8');
  const data = JSON.parse(raw);
  if (!Array.isArray(data.evals) || data.evals.length === 0) {
    throw new Error('evals.json must contain a non-empty "evals" array');
  }
  return data;
}

function ensureDir(p) {
  if (!existsSync(p)) {
    mkdirSync(p, { recursive: true });
  }
}

function createWorkspace(workspace, iteration, evals, dryRun) {
  const iterDir = join(workspace, `iteration-${iteration}`);

  if (!dryRun) {
    ensureDir(iterDir);
  }

  const manifest = {
    skill_name: 'single-defect-analysis',
    skill_path: SKILL_ROOT,
    workspace,
    iteration,
    iteration_dir: iterDir,
    tasks: [],
  };

  for (const ev of evals) {
    const evalId = ev.id;
    const evalName = `eval-${evalId}`;
    const evalDir = join(iterDir, evalName);

    const metadata = {
      eval_id: evalId,
      eval_name: evalName,
      prompt: ev.prompt,
      assertions: ev.expectations || [],
    };

    const withSkillDir = join(evalDir, 'with_skill', 'run-1');
    const withoutSkillDir = join(evalDir, 'without_skill', 'run-1');

    if (!dryRun) {
      ensureDir(join(withSkillDir, 'outputs'));
      ensureDir(join(withoutSkillDir, 'outputs'));
      writeFileSync(join(evalDir, 'eval_metadata.json'), JSON.stringify(metadata, null, 2));
      writeFileSync(join(withSkillDir, 'eval_metadata.json'), JSON.stringify(metadata, null, 2));
      writeFileSync(join(withoutSkillDir, 'eval_metadata.json'), JSON.stringify(metadata, null, 2));
    }

    manifest.tasks.push({
      eval_id: evalId,
      eval_name: evalName,
      prompt: ev.prompt,
      with_skill_outputs: join(withSkillDir, 'outputs'),
      without_skill_outputs: join(withoutSkillDir, 'outputs'),
    });
  }

  if (!dryRun) {
    writeFileSync(join(iterDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  }

  return manifest;
}

function main() {
  const { workspace, iteration, dryRun } = parseArgs();
  const data = loadEvals();
  const manifest = createWorkspace(workspace, iteration, data.evals, dryRun);

  console.log('Workspace created:', manifest.iteration_dir);
  console.log('\nFor each eval, spawn TWO runs (with-skill and without-skill):\n');

  for (const t of manifest.tasks) {
    console.log(`--- Eval ${t.eval_id}: ${t.eval_name} ---`);
    console.log(`Prompt: ${t.prompt}`);
    console.log(`With-skill outputs: ${t.with_skill_outputs}`);
    console.log(`Without-skill outputs: ${t.without_skill_outputs}`);
    console.log('');
  }

  console.log('2. Run: ./evals/post_run.sh', manifest.iteration_dir);
  console.log('   (after grading each run with grading.json)');
}

main();
