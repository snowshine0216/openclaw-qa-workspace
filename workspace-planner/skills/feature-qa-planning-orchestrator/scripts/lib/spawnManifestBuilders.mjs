#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizeSpawnInput } from './normalizeSpawnInput.mjs';
import { fileExists, normalizeRequestedSourceFamilies, readJson } from './workflowState.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = join(__dirname, '..', '..');

const DEFAULT_AGENT_ID = 'feature-qa-planning-orchestrator';
const DEFAULT_RUNTIME = 'subagent';
const DEFAULT_MODE = 'run';

function getPhaseReferenceInstructions(phaseId, skillRoot) {
  const ref = (p) => join(skillRoot, p);
  const blocks = {
    phase1: `Required references (read before starting):
- ${ref('reference.md')} — runtime setup and artifact contract
- ${ref('references/context-coverage-contract.md')} — use "Approved Source Collection Paths"; jira→jira-cli, confluence→confluence, github→github, figma→browser/snapshots. Do not use web fetch for Jira/Confluence/GitHub.`,
    phase3: `Required references (read before starting):
- ${ref('references/context-coverage-contract.md')} — mandatory coverage candidate rules, silent-drop prohibition
- ${ref('references/context-index-schema.md')} — artifact lookup structure and columns`,
    phase4a: `Required references (read before starting):
- ${ref('references/qa-plan-contract.md')} — output shape, scenario contract, priority markers
- ${ref('references/executable-step-rubric.md')} — pass/fail criteria for action steps; avoid banned vague phrases
- ${ref('templates/qa-plan-template.md')} — required scaffold; use as structure`,
    phase4b: `Required references (read before starting):
- ${ref('references/qa-plan-contract.md')} — output shape, scenario contract, priority markers
- ${ref('references/executable-step-rubric.md')} — pass/fail criteria for action steps; avoid banned vague phrases
- ${ref('templates/qa-plan-template.md')} — required scaffold; use as structure`,
    phase5: `Required references (read before starting):
- ${ref('references/review-rubric.md')} — review inputs/outputs, blocking findings, scoring rules
- ${ref('references/qa-plan-contract.md')} — output shape, scenario contract, evidence usage
- ${ref('references/executable-step-rubric.md')} — pass/fail criteria for action steps; avoid banned vague phrases`,
    phase6: `Required references (read before starting):
- ${ref('references/executable-step-rubric.md')} — pass/fail criteria for action steps; avoid banned vague phrases
- ${ref('references/review-rubric.md')} — review dimensions and scoring
- ${ref('references/e2e-coverage-rules.md')} — mandatory E2E journey, minimum journey types
- ${ref('templates/qa-plan-template.md')} — required scaffold; use as structure`,
  };
  return blocks[phaseId] || '';
}

export async function writePhaseManifest(phaseId, featureId, projectDir, outputPath) {
  const task = await readRequiredJson(join(projectDir, 'task.json'), 'task.json');
  const run = await readRequiredJson(join(projectDir, 'run.json'), 'run.json');
  const manifestPath = outputPath || join(projectDir, `${phaseId}_spawn_manifest.json`);
  const requests = await buildPhaseRequests(phaseId, featureId, projectDir, task, run);
  const manifest = {
    version: 1,
    source_kind: 'feature-qa-planning',
    count: requests.length,
    requests,
  };

  await mkdir(projectDir, { recursive: true });
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  return manifestPath;
}

export async function runManifestBuilderCli(phaseId, argv = process.argv.slice(2)) {
  const [featureId, projectDir, outputPath] = argv;
  if (!featureId || !projectDir) {
    console.error(`Usage: ${phaseId}_build_spawn_manifest.mjs <feature-id> <project-dir> [output-path]`);
    process.exit(1);
  }

  try {
    const manifestPath = await writePhaseManifest(phaseId, featureId, projectDir, outputPath);
    console.log(`MANIFEST_WRITTEN: ${manifestPath}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

async function buildPhaseRequests(phaseId, featureId, projectDir, task, run) {
  if (phaseId === 'phase1') {
    const requestedSources = normalizeRequestedSourceFamilies(task.requested_source_families);
    if (requestedSources.length === 0) {
      throw new Error('requested_source_families must contain at least one source.');
    }
    return requestedSources.map((sourceFamily) => buildPhase1Request(sourceFamily, featureId, projectDir, run));
  }

  await assertPhasePrerequisites(phaseId, featureId, projectDir);
  const request = buildSingleRequest(phaseId, featureId, projectDir);
  return [request];
}

function buildPhase1Request(sourceFamily, featureId, projectDir, run) {
  const request = normalizeSpawnInput({
    agent_id: DEFAULT_AGENT_ID,
    mode: DEFAULT_MODE,
    runtime: DEFAULT_RUNTIME,
    label: `${sourceFamily}-${featureId}`,
    task: buildPhase1Task(sourceFamily, featureId, projectDir, Boolean(run.has_supporting_artifacts)),
    attachments: [],
    source_kind: 'feature-qa-planning',
    source: {
      kind: 'feature-qa-planning',
      source_family: sourceFamily,
      feature_id: featureId,
    },
  });
  return request.requests[0];
}

function buildSingleRequest(phaseId, featureId, projectDir) {
  const label = `${phaseId}-${featureId}`;
  const task = buildPhaseTaskText(phaseId, featureId, projectDir);
  const request = normalizeSpawnInput({
    agent_id: DEFAULT_AGENT_ID,
    mode: DEFAULT_MODE,
    runtime: DEFAULT_RUNTIME,
    label,
    task,
    attachments: [],
    source_kind: 'feature-qa-planning',
    source: {
      kind: 'feature-qa-planning',
      phase: phaseId,
      feature_id: featureId,
    },
  });
  return request.requests[0];
}

function buildPhase1Task(sourceFamily, featureId, projectDir, hasSupportingArtifacts) {
  const refBlock = getPhaseReferenceInstructions('phase1', SKILL_ROOT);
  return `Role: ${sourceFamily} evidence sub-agent for feature QA planning.

Feature ID: ${featureId}
Project directory: ${projectDir}
Requested source family: ${sourceFamily}
Supporting artifacts declared: ${hasSupportingArtifacts ? 'yes' : 'no'}

${refBlock}

Requirements:
- Read and use only the approved source route for ${sourceFamily}.
- Save required artifacts under ${projectDir}/context before returning.
- Return the saved artifact paths in the session result.`;
}

function buildPhaseTaskText(phaseId, featureId, projectDir) {
  const descriptions = {
    phase3: `Read ${projectDir}/context/artifact_lookup_${featureId}.md and write ${projectDir}/context/coverage_ledger_${featureId}.md.`,
    phase4a: `Read context artifacts and write ${projectDir}/drafts/qa_plan_subcategory_${featureId}.md in XMindMark subcategory format.`,
    phase4b: `Read ${projectDir}/drafts/qa_plan_subcategory_${featureId}.md and write ${projectDir}/drafts/qa_plan_v1.md with grouped top-level categories.`,
    phase5: `Read ${projectDir}/context/artifact_lookup_${featureId}.md, write ${projectDir}/context/review_notes_${featureId}.md, ${projectDir}/context/review_delta_${featureId}.md, and ${projectDir}/drafts/qa_plan_v2.md.`,
    phase6: `Read ${projectDir}/drafts/qa_plan_v2.md and write ${projectDir}/drafts/qa_plan_v3.md plus ${projectDir}/context/quality_delta_${featureId}.md.`,
  };

  const description = descriptions[phaseId];
  if (!description) {
    throw new Error(`Unsupported phase manifest builder: ${phaseId}`);
  }

  const refBlock = getPhaseReferenceInstructions(phaseId, SKILL_ROOT);
  return `Role: ${phaseId} sub-agent for feature QA planning.

Feature ID: ${featureId}
Project directory: ${projectDir}

${refBlock}

Requirements:
- Follow the script-driven artifact contract.
- Update artifact lookup columns for artifacts you read when applicable.
- Return the written artifact paths in the session result.

Task:
${description}`;
}

async function readRequiredJson(path, label) {
  const parsed = await readJson(path, null);
  if (!parsed) {
    throw new Error(`Missing required ${label} at ${path}`);
  }
  return parsed;
}

async function assertPhasePrerequisites(phaseId, featureId, projectDir) {
  const requiredFiles = {
    phase3: [join(projectDir, 'context', `artifact_lookup_${featureId}.md`)],
    phase4a: [join(projectDir, 'context', `artifact_lookup_${featureId}.md`)],
    phase4b: [join(projectDir, 'drafts', `qa_plan_subcategory_${featureId}.md`)],
    phase5: [
      join(projectDir, 'context', `artifact_lookup_${featureId}.md`),
      join(projectDir, 'drafts', 'qa_plan_v1.md'),
    ],
    phase6: [
      join(projectDir, 'context', `artifact_lookup_${featureId}.md`),
      join(projectDir, 'drafts', 'qa_plan_v2.md'),
    ],
  };

  const files = requiredFiles[phaseId] || [];
  for (const filePath of files) {
    if (!(await fileExists(filePath))) {
      throw new Error(`Missing required prerequisite for ${phaseId}: ${filePath}`);
    }
  }
}
