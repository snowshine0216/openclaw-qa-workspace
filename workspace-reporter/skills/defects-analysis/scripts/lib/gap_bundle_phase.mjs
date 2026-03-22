#!/usr/bin/env node
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function writeJson(path, payload) {
  writeFileSync(path, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

function paths(runDir, runKey) {
  const contextDir = join(runDir, 'context');
  return {
    contextDir,
    jiraRawPath: join(contextDir, 'jira_raw.json'),
    finalReportPath: join(runDir, `${runKey}_REPORT_FINAL.md`),
    promptPath: join(contextDir, `gap_bundle_prompt_${runKey}.md`),
    responsePath: join(contextDir, `gap_bundle_response_${runKey}.json`),
    bundlePath: join(contextDir, `gap_bundle_${runKey}.json`),
    selfTestPath: join(runDir, `${runKey}_SELF_TEST_GAP_ANALYSIS.md`),
    crossAnalysisPath: join(runDir, `${runKey}_QA_PLAN_CROSS_ANALYSIS.md`),
    manifestPath: join(runDir, 'phase_gap_bundle_spawn_manifest.json'),
  };
}

function requireInvokedBy(runDir) {
  const taskPath = join(runDir, 'task.json');
  const taskInvokedBy = existsSync(taskPath) ? readJson(taskPath).invoked_by : null;
  const invokedBy = process.env.INVOKED_BY || taskInvokedBy;
  if (invokedBy !== 'qa-plan-evolution') {
    throw new Error('gap bundle phase is only available to qa-plan-evolution');
  }
}

function assertFinalReport(pathsForRun) {
  if (!existsSync(pathsForRun.finalReportPath)) {
    throw new Error(`Missing REPORT_FINAL artifact: ${pathsForRun.finalReportPath}`);
  }
}

function bundleIsFresh(pathsForRun) {
  if (!existsSync(pathsForRun.bundlePath)) {
    return false;
  }
  return statSync(pathsForRun.bundlePath).mtimeMs >= statSync(pathsForRun.finalReportPath).mtimeMs;
}

function issueSummaries(jiraRawPath) {
  if (!existsSync(jiraRawPath)) {
    return [];
  }
  const payload = readJson(jiraRawPath);
  return (payload.issues ?? []).map((issue) => ({
    key: issue.key,
    summary: issue.fields?.summary ?? issue.key,
  }));
}

function buildPrompt(runKey, finalReport, summaries, featureFamily) {
  const summaryLines = summaries.length
    ? summaries.map((issue) => `- ${issue.key}: ${issue.summary}`).join('\n')
    : '- No Jira issue summaries available';
  return [
    `# Gap Bundle Prompt (${runKey})`,
    '',
    'Return only a valid JSON object that matches the required gap bundle schema.',
    'Do not wrap the JSON in markdown fences or any prose.',
    '',
    'Use exactly these taxonomy values when classifying root causes:',
    '- missing_scenario',
    '- scenario_too_shallow',
    '- analog_risk_not_gated',
    '- interaction_gap',
    '- sdk_or_api_visible_contract_dropped',
    '- developer_artifact_missing',
    '- traceability_gap',
    '- knowledge_pack_gap',
    '',
    `Feature family: ${featureFamily || 'unknown'}`,
    '',
    'Defect summaries:',
    summaryLines,
    '',
    'Final report:',
    finalReport,
  ].join('\n');
}

function buildManifest(pathsForRun) {
  return {
    requests: [
      {
        openclaw: {
          args: {
            task: readFileSync(pathsForRun.promptPath, 'utf8'),
            label: 'gap-bundle',
            mode: 'run',
            runtime: 'subagent',
            output_file: relative(join(pathsForRun.contextDir, '..'), pathsForRun.responsePath),
            output_format: 'json',
          },
        },
      },
    ],
  };
}

function assertTopLevel(bundle) {
  const required = ['run_key', 'generated_at', 'feature_id', 'feature_family', 'source_artifacts', 'gaps'];
  for (const key of required) {
    if (!(key in bundle)) {
      throw new Error(`gap bundle missing top-level field: ${key}`);
    }
  }
  if (!Array.isArray(bundle.gaps)) {
    throw new Error('gap bundle field "gaps" must be an array');
  }
}

function assertGapShape(gap, index) {
  const required = [
    'gap_id',
    'root_cause_bucket',
    'severity',
    'title',
    'summary',
    'source_defects',
    'affected_phase',
    'recommended_target_files',
    'recommended_change_type',
    'generalization_scope',
    'feature_family',
  ];
  for (const key of required) {
    if (!(key in gap)) {
      throw new Error(`gap ${index + 1} missing field: ${key}`);
    }
  }
}

function validateBundle(bundle, runKey, featureFamily) {
  assertTopLevel(bundle);
  for (const [index, gap] of bundle.gaps.entries()) {
    assertGapShape(gap, index);
  }
  if (bundle.run_key !== runKey) {
    throw new Error(`gap bundle run_key mismatch: expected ${runKey}, received ${bundle.run_key}`);
  }
  if (!bundle.feature_family && featureFamily) {
    bundle.feature_family = featureFamily;
  }
  return bundle;
}

function renderSelfTestGapAnalysis(bundle) {
  const bullets = bundle.gaps.map((gap) => `- ${gap.title}: ${gap.summary}`);
  return [
    `# ${bundle.run_key} Self-Test Gap Analysis`,
    '',
    '## Key Gaps',
    bullets.join('\n') || '- none',
  ].join('\n');
}

function renderQaPlanCrossAnalysis(bundle) {
  const bullets = bundle.gaps.map((gap) => {
    const targets = (gap.recommended_target_files ?? []).join(', ');
    return `- ${gap.title}: target ${targets || 'none'} (${gap.root_cause_bucket})`;
  });
  return [
    `# ${bundle.run_key} QA Plan Cross Analysis`,
    '',
    '## QA Plan Misses',
    bullets.join('\n') || '- none',
  ].join('\n');
}

export function prepareGapBundle(runDir, runKey, featureFamily) {
  requireInvokedBy(runDir);
  const pathsForRun = paths(runDir, runKey);
  assertFinalReport(pathsForRun);
  if (bundleIsFresh(pathsForRun)) {
    return `GAP_BUNDLE_REUSED: ${pathsForRun.bundlePath}`;
  }
  const finalReport = readFileSync(pathsForRun.finalReportPath, 'utf8');
  const prompt = buildPrompt(runKey, finalReport, issueSummaries(pathsForRun.jiraRawPath), featureFamily);
  writeFileSync(pathsForRun.promptPath, `${prompt}\n`, 'utf8');
  writeJson(pathsForRun.manifestPath, buildManifest(pathsForRun));
  return `SPAWN_MANIFEST: ${pathsForRun.manifestPath}`;
}

export function finalizeGapBundle(runDir, runKey, featureFamily) {
  requireInvokedBy(runDir);
  const pathsForRun = paths(runDir, runKey);
  assertFinalReport(pathsForRun);
  if (!existsSync(pathsForRun.responsePath)) {
    throw new Error(`Missing gap bundle response: ${pathsForRun.responsePath}`);
  }
  const bundle = validateBundle(readJson(pathsForRun.responsePath), runKey, featureFamily);
  writeJson(pathsForRun.bundlePath, bundle);
  writeFileSync(pathsForRun.selfTestPath, `${renderSelfTestGapAnalysis(bundle)}\n`, 'utf8');
  writeFileSync(pathsForRun.crossAnalysisPath, `${renderQaPlanCrossAnalysis(bundle)}\n`, 'utf8');
  return `GAP_BUNDLE_DONE: ${pathsForRun.bundlePath}`;
}

function main() {
  const [mode, runDir, runKey, featureFamily] = process.argv.slice(2);
  if (!mode || !runDir || !runKey) {
    throw new Error('Usage: gap_bundle_phase.mjs <prepare|finalize> <run-dir> <run-key> [feature-family]');
  }
  const output = mode === 'finalize'
    ? finalizeGapBundle(runDir, runKey, featureFamily)
    : prepareGapBundle(runDir, runKey, featureFamily);
  process.stdout.write(`${output}\n`);
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
