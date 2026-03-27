#!/usr/bin/env node
/**
 * Resolve planner artifacts: plan path, summary path, and seed markdown.
 */

import { readFile, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveQaSummaryRepoRoot } from './resolveQaSummaryRepoRoot.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function fileExists(path) {
  if (!path) return false;
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function buildSeedMarkdown({ featureKey, planPath, summaryPath }) {
  const parts = [];
  if (planPath) {
    parts.push(`<!-- Planner plan: ${planPath} -->`);
  }
  if (summaryPath) {
    parts.push(`<!-- Planner summary: ${summaryPath} -->`);
  }
  parts.push(`# Feature: ${featureKey}`);
  parts.push('');
  parts.push('Planner context seed for QA Summary generation.');
  return parts.join('\n');
}

function mergeSeedMarkdown(baseSeed, summaryContent, planContent) {
  return [baseSeed, summaryContent, planContent].filter(Boolean).join('\n\n');
}

function resolvePlanPath(plannerPlanPath, repoRoot, runDirPlanner) {
  if (!plannerPlanPath) return resolve(runDirPlanner, 'qa_plan_final.md');
  if (plannerPlanPath.startsWith('/')) return resolve(plannerPlanPath);
  const repoRootForResolve = repoRoot || process.cwd();
  return resolve(repoRootForResolve, plannerPlanPath);
}

export async function resolvePlannerArtifact({ featureKey, plannerRunRoot, plannerPlanPath, runDir }) {
  if (!plannerRunRoot) throw new Error('plannerRunRoot is required');
  const repoRoot = runDir ? resolveQaSummaryRepoRoot(runDir) : process.cwd();
  const resolvedPlannerRoot = resolve(repoRoot, plannerRunRoot);
  const runDirPlanner = resolve(resolvedPlannerRoot, featureKey);
  const planPath = resolvePlanPath(plannerPlanPath, repoRoot, runDirPlanner);
  const summaryPath = resolve(runDirPlanner, 'context', `final_plan_summary_${featureKey}.md`);

  const planExists = await fileExists(planPath);
  const summaryExists = await fileExists(summaryPath);

  let seedMarkdown = buildSeedMarkdown({
    featureKey,
    planPath: planExists ? planPath : null,
    summaryPath: summaryExists ? summaryPath : null,
  });

  if (planExists) {
    try {
      const planContent = await readFile(planPath, 'utf8');
      let summaryContent = '';
      if (summaryExists) {
        try {
          summaryContent = await readFile(summaryPath, 'utf8');
        } catch {
          summaryContent = '';
        }
      }
      seedMarkdown = mergeSeedMarkdown(seedMarkdown, summaryContent, planContent);
    } catch {
      // keep fallback seed
    }
  } else if (summaryExists) {
    try {
      const summaryContent = await readFile(summaryPath, 'utf8');
      seedMarkdown = mergeSeedMarkdown(seedMarkdown, summaryContent, '');
    } catch {
      // keep fallback seed
    }
  }

  return {
    featureKey,
    plannerRunRoot: resolvedPlannerRoot,
    planPath: planExists ? planPath : null,
    summaryPath: summaryExists ? summaryPath : null,
    seedMarkdown,
  };
}
