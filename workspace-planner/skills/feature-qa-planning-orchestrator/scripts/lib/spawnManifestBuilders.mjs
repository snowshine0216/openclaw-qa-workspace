#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizeSpawnInput } from './normalizeSpawnInput.mjs';
import { fileExists, getNextPhaseRound, normalizeRequestedSourceFamilies, readJson } from './workflowState.mjs';

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
- ${ref('references/context-coverage-contract.md')} — use approved skills: jira→jira-cli, confluence→confluence, github→github, figma→browser/snapshots. Do not use web fetch for Jira/Confluence/GitHub.`,
    phase3: `Required references (read before starting):
- ${ref('references/context-coverage-contract.md')} — mandatory coverage candidate rules, silent-drop prohibition
- ${ref('references/context-index-schema.md')} — artifact lookup structure and columns`,
    phase4a: `Required references (read before starting):
- ${ref('references/phase4a-contract.md')} — subcategory-only draft contract, embedded scaffold, and few-shot rules`,
    phase4b: `Required references (read before starting):
- ${ref('references/phase4b-contract.md')} — canonical top-layer taxonomy, bounded research rule, Phase 6 few-shot ownership, and final scaffold`,
    phase5a: `Required references (read before starting):
- ${ref('references/review-rubric-phase5a.md')} — context-artifact audit, section review checklist, bounded research rule, and pass/return rules`,
    phase5b: `Required references (read before starting):
- ${ref('references/review-rubric-phase5b.md')} — shipment-readiness checkpoints, bounded research rule, and pass/return rules derived from docs/checkpoints.md`,
    phase6: `Required references (read before starting):
- ${ref('references/review-rubric-phase6.md')} — final layering, few-shot cleanup, and promotion-readiness checks
- ${ref('references/e2e-coverage-rules.md')} — mandatory E2E journey, minimum journey types`,
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
  const request = buildSingleRequest(phaseId, featureId, projectDir, task);
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

function buildSingleRequest(phaseId, featureId, projectDir, task) {
  const label = `${phaseId}-${featureId}`;
  const taskText = buildPhaseTaskText(phaseId, featureId, projectDir, task);
  const request = normalizeSpawnInput({
    agent_id: DEFAULT_AGENT_ID,
    mode: DEFAULT_MODE,
    runtime: DEFAULT_RUNTIME,
    label,
    task: taskText,
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

function buildPhase1ArtifactRequirements(sourceFamily, featureId, projectDir, hasSupportingArtifacts) {
  const ctx = (name) => `${projectDir}/context/${name}`;
  const normalized = String(sourceFamily || '').trim().toLowerCase();
  if (normalized === 'jira') {
    const required = [
      `1. Main issue: ${ctx(`jira_issue_${featureId}.md`)} — fetch the primary feature issue.`,
      `2. Related issues: ${ctx(`jira_related_issues_${featureId}.md`)} — linked, parent, child, and blocks/blocked-by issues relevant to ${featureId}. Include concise summaries for future reuse.`,
    ];
    if (hasSupportingArtifacts) {
      required.push(
        `3. Supporting summary: ${ctx(`supporting_artifact_summary_${featureId}.md`)} — when supporting Jira docs (e.g. BCED-2416) are requested, write a concise summary of supporting issues and how they inform scope/risk.`
      );
    }
    return required.join('\n');
  }
  if (normalized === 'confluence') {
    return `Required: ${ctx(`confluence_design_${featureId}.md`)}`;
  }
  if (normalized === 'github') {
    return `Required: ${ctx(`github_diff_${featureId}.md`)} and ${ctx(`github_traceability_${featureId}.md`)}`;
  }
  if (normalized === 'figma') {
    return `Required: ${ctx(`figma_metadata_${featureId}.md`)}`;
  }
  return 'Save required artifacts under context/ per the context-coverage-contract.';
}

function buildPhase1Task(sourceFamily, featureId, projectDir, hasSupportingArtifacts) {
  const refBlock = getPhaseReferenceInstructions('phase1', SKILL_ROOT);
  const artifactReqs = buildPhase1ArtifactRequirements(sourceFamily, featureId, projectDir, hasSupportingArtifacts);
  return `Role: ${sourceFamily} evidence sub-agent for feature QA planning.

Feature ID: ${featureId}
Project directory: ${projectDir}
Requested source family: ${sourceFamily}
Supporting artifacts declared: ${hasSupportingArtifacts ? 'yes' : 'no'}

${refBlock}

Requirements:
- Read and use only the approved source route for ${sourceFamily}.
- Save required artifacts under ${projectDir}/context before returning.
- Return the saved artifact paths in the session result.

Required artifacts (must write all):
${artifactReqs}`;
}

function buildPhaseTaskText(phaseId, featureId, projectDir, task) {
  const paths = resolvePhasePaths(phaseId, featureId, projectDir, task);
  const descriptions = {
    phase3: `Read ${projectDir}/context/artifact_lookup_${featureId}.md and write ${projectDir}/context/coverage_ledger_${featureId}.md.`,
    phase4a: `Read current context artifacts, stay below canonical top-layer grouping, and write ${paths.outputDraftPath}. You may do one bounded supplemental research pass with shared skills when evidence is insufficient, save any new artifact under ${projectDir}/context, and update artifact lookup references before finishing.`,
    phase4b: `Read ${paths.inputDraftPath}, group Phase 4a output into canonical top-layer labels, preserve subcategory and scenario granularity, and write ${paths.outputDraftPath}. If a scenario does not fit a canonical layer, keep the local grouping and add an explicit HTML exception comment. Few-shot cleanup belongs to Phase 6, not this phase. You may do one bounded supplemental research pass when grouping evidence is insufficient.`,
    phase5a: `Read every intermediate context artifact already present under ${projectDir}/context, audit ${projectDir}/context/artifact_lookup_${featureId}.md with a section-by-section review, refactor ${paths.inputDraftPath}, and write ${projectDir}/context/review_notes_${featureId}.md, ${projectDir}/context/review_delta_${featureId}.md, and ${paths.outputDraftPath}. The pass must be self-reviewed against the Phase 5a rubric, may do one bounded supplemental research pass when evidence is insufficient, and must end with an explicit review_delta disposition of either accept or return phase5a.`,
    phase5b: `Read ${paths.inputDraftPath}, ${projectDir}/context/review_notes_${featureId}.md, and ${projectDir}/context/review_delta_${featureId}.md. Evaluate every checkpoint from ${join(SKILL_ROOT, 'references', 'review-rubric-phase5b.md')}, refactor the plan when checkpoint gaps are fixable, and write ${projectDir}/context/checkpoint_audit_${featureId}.md, ${projectDir}/context/checkpoint_delta_${featureId}.md, and ${paths.outputDraftPath}. Include a Release Recommendation, use one bounded supplemental research pass only when checkpoint evidence is insufficient, and end checkpoint_delta with one of: accept, return phase5a, or return phase5b.`,
    phase6: `Read ${paths.inputDraftPath}, ${projectDir}/context/review_notes_${featureId}.md, ${projectDir}/context/review_delta_${featureId}.md, ${projectDir}/context/checkpoint_audit_${featureId}.md, and ${projectDir}/context/checkpoint_delta_${featureId}.md. Produce ${paths.outputDraftPath} plus ${projectDir}/context/quality_delta_${featureId}.md. The final draft must preserve canonical top-layer grouping, subcategory layering, atomic nested steps, and final few-shot cleanup. One bounded supplemental research pass is allowed only when final-quality evidence is insufficient.`,
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
- Use only the shared skills \`confluence\`, \`jira-cli\`, and \`tavily-search\` for any bounded supplemental research.
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
  const task = await readRequiredJson(join(projectDir, 'task.json'), 'task.json');
  const paths = resolvePhasePaths(phaseId, featureId, projectDir, task);
  const requiredFiles = {
    phase3: [join(projectDir, 'context', `artifact_lookup_${featureId}.md`)],
    phase4a: [join(projectDir, 'context', `artifact_lookup_${featureId}.md`)],
    phase4b: [paths.inputDraftPath],
    phase5a: [
      join(projectDir, 'context', `artifact_lookup_${featureId}.md`),
      paths.inputDraftPath,
    ],
    phase5b: [
      join(projectDir, 'context', `artifact_lookup_${featureId}.md`),
      join(projectDir, 'context', `review_notes_${featureId}.md`),
      join(projectDir, 'context', `review_delta_${featureId}.md`),
      paths.inputDraftPath,
    ],
    phase6: [
      join(projectDir, 'context', `artifact_lookup_${featureId}.md`),
      join(projectDir, 'context', `review_notes_${featureId}.md`),
      join(projectDir, 'context', `review_delta_${featureId}.md`),
      join(projectDir, 'context', `checkpoint_audit_${featureId}.md`),
      join(projectDir, 'context', `checkpoint_delta_${featureId}.md`),
      paths.inputDraftPath,
    ],
  };

  const files = requiredFiles[phaseId] || [];
  for (const filePath of files) {
    if (!(await fileExists(filePath))) {
      throw new Error(`Missing required prerequisite for ${phaseId}: ${filePath}`);
    }
  }
}

function resolvePhasePaths(phaseId, featureId, projectDir, task = {}) {
  const currentDraft = resolveLatestDraftPath(task, projectDir);
  const outputDrafts = {
    phase4a: join(projectDir, 'drafts', `qa_plan_phase4a_r${getNextPhaseRound(task, 'phase4a')}.md`),
    phase4b: join(projectDir, 'drafts', `qa_plan_phase4b_r${getNextPhaseRound(task, 'phase4b')}.md`),
    phase5a: join(projectDir, 'drafts', `qa_plan_phase5a_r${getNextPhaseRound(task, 'phase5a')}.md`),
    phase5b: join(projectDir, 'drafts', `qa_plan_phase5b_r${getNextPhaseRound(task, 'phase5b')}.md`),
    phase6: join(projectDir, 'drafts', `qa_plan_phase6_r${getNextPhaseRound(task, 'phase6')}.md`),
  };

  return {
    inputDraftPath: currentDraft || fallbackInputDraft(phaseId, featureId, projectDir),
    outputDraftPath: outputDrafts[phaseId] || null,
  };
}

function resolveLatestDraftPath(task, projectDir) {
  const draftPath = String(task?.latest_draft_path || '').trim();
  if (!draftPath) return '';
  return draftPath.startsWith(projectDir) ? draftPath : join(projectDir, draftPath);
}

function fallbackInputDraft(phaseId, featureId, projectDir) {
  if (phaseId === 'phase4b') {
    return join(projectDir, 'drafts', `qa_plan_phase4a_r1.md`);
  }
  if (phaseId === 'phase5a') {
    return join(projectDir, 'drafts', `qa_plan_phase4b_r1.md`);
  }
  if (phaseId === 'phase5b') {
    return join(projectDir, 'drafts', `qa_plan_phase5a_r1.md`);
  }
  if (phaseId === 'phase6') {
    return join(projectDir, 'drafts', `qa_plan_phase5b_r1.md`);
  }
  return '';
}
