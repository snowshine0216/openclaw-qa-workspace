#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizeSpawnInput } from './normalizeSpawnInput.mjs';
import {
  applyRequestModel,
  DEFAULT_DEEP_RESEARCH_POLICY,
  DEFAULT_DEEP_RESEARCH_TOPICS,
  fileExists,
  getNextPhaseRound,
  normalizeIssueKeys,
  normalizeRequestedSourceFamilies,
  readJson,
  syncTaskDraftState,
} from './workflowState.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = join(__dirname, '..', '..');

const DEFAULT_AGENT_ID = 'qa-plan-orchestrator';
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
- ${ref('references/review-rubric-phase5b.md')} — shipment-readiness checkpoints, bounded research rule, and pass/return rules derived from references/checkpoints.md`,
    phase6: `Required references (read before starting):
- ${ref('references/review-rubric-phase6.md')} — final layering, few-shot cleanup, and promotion-readiness checks
- ${ref('references/e2e-coverage-rules.md')} — mandatory E2E journey, minimum journey types`,
  };
  return blocks[phaseId] || '';
}

export async function writePhaseManifest(phaseId, featureId, runDir, outputPath) {
  const task = await readRequiredJson(join(runDir, 'task.json'), 'task.json');
  const run = await readRequiredJson(join(runDir, 'run.json'), 'run.json');
  applyRequestModel(task, featureId);
  await syncTaskDraftState(task, runDir);
  const manifestPath = outputPath || join(runDir, `${phaseId}_spawn_manifest.json`);
  const requests = await buildPhaseRequests(phaseId, featureId, runDir, task, run);
  const manifest = {
    version: 1,
    source_kind: 'feature-qa-planning',
    count: requests.length,
    requests,
  };

  await mkdir(runDir, { recursive: true });
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  return manifestPath;
}

export async function runManifestBuilderCli(phaseId, argv = process.argv.slice(2)) {
  const [featureId, runDir, outputPath] = argv;
  if (!featureId || !runDir) {
    console.error(`Usage: ${phaseId}_build_spawn_manifest.mjs <feature-id> <run-dir> [output-path]`);
    process.exit(1);
  }

  try {
    const manifestPath = await writePhaseManifest(phaseId, featureId, runDir, outputPath);
    console.log(`MANIFEST_WRITTEN: ${manifestPath}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

async function buildPhaseRequests(phaseId, featureId, runDir, task, run) {
  if (phaseId === 'phase1') {
    const requestedSources = normalizeRequestedSourceFamilies(task.requested_source_families);
    if (requestedSources.length === 0) {
      throw new Error('requested_source_families must contain at least one source.');
    }
    const sourceRequests = requestedSources.map((sourceFamily) => buildPhase1Request(sourceFamily, featureId, runDir, run, task));
    const supportingRequests = normalizeIssueKeys(task.supporting_issue_keys).map((supportingIssueKey) => {
      return buildSupportingIssueSpawnRequest({
        featureId,
        supportingIssueKey,
        runDir,
        requestRequirementIds: collectRequirementIds(task, 'phase1', [
          `supporting_issue_relation_map_${featureId}`,
          `supporting_issue_summary_${supportingIssueKey}_${featureId}`,
          `supporting_issue_summary_${featureId}`,
        ]),
      });
    });
    return [...sourceRequests, ...supportingRequests];
  }

  if (phaseId === 'phase3') {
    await assertPhasePrerequisites(phaseId, featureId, runDir);
    const request = buildSingleRequest(phaseId, featureId, runDir, task);
    const topics = Array.isArray(task.deep_research_topics) && task.deep_research_topics.length > 0
      ? task.deep_research_topics
      : [];
    const topicRequests = topics.map((topicSlug) => {
      return buildDeepResearchSpawnRequest({
        featureId,
        topicSlug,
        runDir,
        deepResearchPolicy: task.deep_research_policy || DEFAULT_DEEP_RESEARCH_POLICY,
        requestRequirementIds: collectRequirementIds(task, 'phase3', [
          researchArtifactPath('tavily', topicSlug, featureId),
          researchArtifactPath('confluence', topicSlug, featureId),
          `deep_research_synthesis_report_editor_${featureId}`,
        ]),
      }).source;
    });
    request.source.topic_requests = topicRequests;
    request.source.output_artifact_paths = [
      `context/coverage_ledger_${featureId}.md`,
      `context/coverage_ledger_${featureId}.json`,
      ...(task.knowledge_pack_key
        ? [
            `context/knowledge_pack_retrieval_${featureId}.md`,
            `context/knowledge_pack_retrieval_${featureId}.json`,
          ]
        : []),
      ...(topicRequests.length > 0
        ? [
            `context/deep_research_plan_${featureId}.md`,
            `context/deep_research_execution_${featureId}.json`,
            `context/deep_research_synthesis_report_editor_${featureId}.md`,
            ...topicRequests.flatMap((topicRequest) => topicRequest.output_artifact_paths || []),
          ]
        : []),
    ];
    return [request];
  }

  await assertPhasePrerequisites(phaseId, featureId, runDir);
  const request = buildSingleRequest(phaseId, featureId, runDir, task);
  return [request];
}

function buildKnowledgePackSource(task = {}, featureId) {
  const active = Boolean(task.knowledge_pack_key);
  return {
    knowledge_pack_key: task.knowledge_pack_key || null,
    knowledge_pack_version: task.knowledge_pack_version || null,
    knowledge_pack_summary_path: active ? `context/knowledge_pack_summary_${featureId}.md` : null,
    knowledge_pack_retrieval_path: active ? `context/knowledge_pack_retrieval_${featureId}.md` : null,
    knowledge_pack_active: active,
  };
}

function buildPhase1Request(sourceFamily, featureId, runDir, run, task) {
  const request = normalizeSpawnInput({
    agent_id: DEFAULT_AGENT_ID,
    mode: DEFAULT_MODE,
    runtime: DEFAULT_RUNTIME,
    label: `${sourceFamily}-${featureId}`,
    task: buildPhase1Task(sourceFamily, featureId, runDir, Boolean(run.has_supporting_artifacts), task),
    attachments: [],
    source_kind: 'feature-qa-planning',
    source: {
      kind: 'feature-qa-planning',
      source_family: sourceFamily,
      feature_id: featureId,
      ...buildKnowledgePackSource(task, featureId),
    },
  });
  return request.requests[0];
}

function buildSingleRequest(phaseId, featureId, runDir, task) {
  const label = `${phaseId}-${featureId}`;
  const taskText = buildPhaseTaskText(phaseId, featureId, runDir, task);
  const paths = resolvePhasePaths(phaseId, featureId, runDir, task);
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
      input_draft_path: paths.inputDraftPath || '',
      output_draft_path: paths.outputDraftPath || '',
      ...buildKnowledgePackSource(task, featureId),
    },
  });
  return request.requests[0];
}

function buildPhase1ArtifactRequirements(sourceFamily, featureId, runDir, hasSupportingArtifacts) {
  const ctx = (name) => `${runDir}/context/${name}`;
  const normalized = String(sourceFamily || '').trim().toLowerCase();
  if (normalized === 'jira') {
    const required = [
      `1. Main issue: ${ctx(`jira_issue_${featureId}.md`)} — fetch the primary feature issue.`,
      `2. Related issues: ${ctx(`jira_related_issues_${featureId}.md`)} — linked, parent, child, and blocks/blocked-by issues relevant to ${featureId}. Include concise summaries for future reuse.`,
    ];
    if (hasSupportingArtifacts) {
      required.push(
        `3. Supporting summary: ${ctx(`supporting_issue_summary_${featureId}.md`)} — when supporting Jira docs (e.g. BCED-2416) are requested, write a concise summary of supporting issues and how they inform scope/risk.`,
        `4. Supporting relation map: ${ctx(`supporting_issue_relation_map_${featureId}.md`)} — record the parent chain plus linked inward and linked outward issues that were digested.`
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

function buildPhase1Task(sourceFamily, featureId, runDir, hasSupportingArtifacts, task = {}) {
  const refBlock = getPhaseReferenceInstructions('phase1', SKILL_ROOT);
  const artifactReqs = buildPhase1ArtifactRequirements(sourceFamily, featureId, runDir, hasSupportingArtifacts);
  const knowledgePackNote = task.knowledge_pack_key
    ? `Knowledge pack is active: ${task.knowledge_pack_key}@${task.knowledge_pack_version || 'unknown'}.
- Read ${runDir}/context/knowledge_pack_summary_${featureId}.md for pack-aware coverage obligations.
- Do not read raw knowledge-packs/${task.knowledge_pack_key}/pack.json directly in Phase 1.`
    : 'No active knowledge pack is resolved for this run.';
  return `Role: ${sourceFamily} evidence sub-agent for feature QA planning.

Feature ID: ${featureId}
Run directory: ${runDir}
Requested source family: ${sourceFamily}
Supporting artifacts declared: ${hasSupportingArtifacts ? 'yes' : 'no'}
${knowledgePackNote}

${refBlock}

Requirements:
- Read and use only the approved source route for ${sourceFamily}.
- Save required artifacts under ${runDir}/context before returning.
- Return the saved artifact paths in the session result.

Required artifacts (must write all):
${artifactReqs}`;
}

export function buildSupportingIssueSpawnRequest({
  featureId,
  supportingIssueKey,
  runDir,
  requestRequirementIds = [],
}) {
  if (!supportingIssueKey) {
    throw new Error('Supporting issue spawn request requires supportingIssueKey.');
  }
  const outputArtifactPaths = [
    `context/supporting_issue_relation_map_${featureId}.md`,
    `context/supporting_issue_summary_${supportingIssueKey}_${featureId}.md`,
    `context/supporting_issue_summary_${featureId}.md`,
  ];
  const request = normalizeSpawnInput({
    agent_id: DEFAULT_AGENT_ID,
    mode: DEFAULT_MODE,
    runtime: DEFAULT_RUNTIME,
    label: `supporting-${supportingIssueKey}-${featureId}`,
    task: `Role: supporting issue context sub-agent for feature QA planning.

Feature ID: ${featureId}
Supporting issue key: ${supportingIssueKey}
Run directory: ${runDir}

Requirements:
- Keep the supporting issue in ${'context_only_no_defect_analysis'} mode.
- Read the issue description, parent chain, linked inward issues, and linked outward issues.
- Save the relation map and both summary artifacts under ${runDir}/context.
- Do not create defect-analysis artifacts or route this work into defect-analysis behavior.
- The aggregate support summary must explicitly say the supporting issues remain context evidence only in ${'context_only_no_defect_analysis'} mode and never become defect-analysis triggers.
- The returned write-up must stay phase-1 scoped: supporting context digestion, relation mapping, and summary output only.
- Return the written artifact paths in the session result.`,
    attachments: [],
    source_kind: 'feature-qa-planning',
    source: {
      kind: 'supporting-issue-context',
      feature_id: featureId,
      supporting_issue_key: supportingIssueKey,
      request_requirement_ids: requestRequirementIds,
      output_artifact_paths: outputArtifactPaths,
    },
  });
  return request.requests[0];
}

export function buildDeepResearchSpawnRequest({
  featureId,
  topicSlug,
  runDir,
  deepResearchPolicy,
  requestRequirementIds = [],
}) {
  if (deepResearchPolicy !== DEFAULT_DEEP_RESEARCH_POLICY) {
    throw new Error(`Deep research policy must be ${DEFAULT_DEEP_RESEARCH_POLICY}.`);
  }
  const outputArtifactPaths = [
    `context/${researchArtifactPath('tavily', topicSlug, featureId)}.md`,
    `context/${researchArtifactPath('confluence', topicSlug, featureId)}.md`,
  ];
  const request = normalizeSpawnInput({
    agent_id: DEFAULT_AGENT_ID,
    mode: DEFAULT_MODE,
    runtime: DEFAULT_RUNTIME,
    label: `deep-research-${topicSlug}-${featureId}`,
    task: `Role: deep research sub-agent for feature QA planning.

Feature ID: ${featureId}
Research topic: ${topicSlug}
Run directory: ${runDir}

${getPhaseReferenceInstructions('phase3', SKILL_ROOT)}

Requirements:
- Run Tavily first and persist the Tavily artifact under ${runDir}/${outputArtifactPaths[0]}.
- Use Confluence fallback only when Tavily evidence is insufficient, and record that insufficiency in the Tavily artifact before writing ${runDir}/${outputArtifactPaths[1]}.
- Do not skip the Tavily pass or swap the tool order.
- Explicitly record Tavily-first ordering and any Confluence fallback reason in the written research artifacts, not only in execution metadata.
- The returned synthesis must stay phase-3 scoped: Tavily-first research, optional fallback reasoning, and evidence saved under context/.
- Return the written artifact paths in the session result.`,
    attachments: [],
    source_kind: 'feature-qa-planning',
    source: {
      kind: 'deep-research',
      feature_id: featureId,
      topic_slug: topicSlug,
      request_requirement_ids: requestRequirementIds,
      output_artifact_paths: outputArtifactPaths,
    },
  });
  return request.requests[0];
}

function buildPhaseTaskText(phaseId, featureId, runDir, task) {
  const paths = resolvePhasePaths(phaseId, featureId, runDir, task);
  const checklistPath = join(SKILL_ROOT, 'references', 'subagent-quick-checklist.md');
  const descriptions = {
    phase3: buildPhase3Description(featureId, runDir, task),
    phase4a: `Read current context artifacts, stay below canonical top-layer grouping, and write ${paths.outputDraftPath}. You may do one bounded supplemental research pass with shared skills when evidence is insufficient, save any new artifact under ${runDir}/context, and update artifact lookup references before finishing.`,
    phase4b: `Read ${paths.inputDraftPath}, group Phase 4a output into canonical top-layer labels, preserve subcategory and scenario granularity, and write ${paths.outputDraftPath}. Grouping and refactor may not silently shrink coverage. If a scenario does not fit a canonical layer, keep the local grouping and add an explicit HTML exception comment. Few-shot cleanup belongs to Phase 6, not this phase. You may do one bounded supplemental research pass when grouping evidence is insufficient.`,
    phase5a: `Read every intermediate context artifact already present under ${runDir}/context, audit ${runDir}/context/artifact_lookup_${featureId}.md with a section-by-section review, refactor ${paths.inputDraftPath}, and write ${runDir}/context/review_notes_${featureId}.md, ${runDir}/context/review_delta_${featureId}.md, and ${paths.outputDraftPath}. Do not remove, defer, or move a concern to Out of Scope unless source evidence or explicit user direction requires it. The pass must preserve or enrich evidence-backed coverage, self-review against the Phase 5a rubric, may do one bounded supplemental research pass when evidence is insufficient, and must end with an explicit review_delta disposition of either accept or return phase5a.`,
    phase5b: `Read ${paths.inputDraftPath}, ${runDir}/context/review_notes_${featureId}.md, and ${runDir}/context/review_delta_${featureId}.md. Evaluate every checkpoint from ${join(SKILL_ROOT, 'references', 'review-rubric-phase5b.md')}, refactor the plan when checkpoint gaps are fixable, and write ${runDir}/context/checkpoint_audit_${featureId}.md, ${runDir}/context/checkpoint_delta_${featureId}.md, and ${paths.outputDraftPath}. Do not remove, defer, or move a concern to Out of Scope unless source evidence or explicit user direction requires it. Include a Release Recommendation, use one bounded supplemental research pass only when checkpoint evidence is insufficient, and end checkpoint_delta with one of: accept, return phase5a, or return phase5b.`,
    phase6: `Read ${paths.inputDraftPath}, ${runDir}/context/review_notes_${featureId}.md, ${runDir}/context/review_delta_${featureId}.md, ${runDir}/context/checkpoint_audit_${featureId}.md, and ${runDir}/context/checkpoint_delta_${featureId}.md. Produce ${paths.outputDraftPath} plus ${runDir}/context/quality_delta_${featureId}.md. The final draft must preserve reviewed coverage scope, canonical top-layer grouping, subcategory layering, atomic nested steps, and final few-shot cleanup. One bounded supplemental research pass is allowed only when final-quality evidence is insufficient.`,
  };

  const description = descriptions[phaseId];
  if (!description) {
    throw new Error(`Unsupported phase manifest builder: ${phaseId}`);
  }

  const refBlock = getPhaseReferenceInstructions(phaseId, SKILL_ROOT);
  return `Role: ${phaseId} sub-agent for feature QA planning.

Feature ID: ${featureId}
Run directory: ${runDir}

${refBlock}

Requirements:
- Follow the script-driven artifact contract.
- Update artifact lookup columns for artifacts you read when applicable.
- Use only the shared skills \`confluence\`, \`jira-cli\`, and \`tavily-search\` for any bounded supplemental research.
- Return the written artifact paths in the session result.

Preflight before you write or return any artifact:
- Read ${checklistPath} and apply it as a short validator-safe self-check.
- Do not tag grouping/subcategory bullets with \`<P1>\` / \`<P2>\`.
- Deduplicate only when trigger, risk, and observable outcome are materially the same.
- When a user explicitly promoted a coverage area, do not leave it as a deferred-only stub.
- Prefer user-observable wording over implementation-heavy wording in executable scenarios.

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

async function assertPhasePrerequisites(phaseId, featureId, runDir) {
  const task = await readRequiredJson(join(runDir, 'task.json'), 'task.json');
  const paths = resolvePhasePaths(phaseId, featureId, runDir, task);
  const requiredFiles = {
    phase3: [join(runDir, 'context', `artifact_lookup_${featureId}.md`)],
    phase4a: [join(runDir, 'context', `artifact_lookup_${featureId}.md`)],
    phase4b: [paths.inputDraftPath],
    phase5a: [
      join(runDir, 'context', `artifact_lookup_${featureId}.md`),
      paths.inputDraftPath,
    ],
    phase5b: [
      join(runDir, 'context', `artifact_lookup_${featureId}.md`),
      join(runDir, 'context', `review_notes_${featureId}.md`),
      join(runDir, 'context', `review_delta_${featureId}.md`),
      paths.inputDraftPath,
    ],
    phase6: [
      join(runDir, 'context', `artifact_lookup_${featureId}.md`),
      join(runDir, 'context', `review_notes_${featureId}.md`),
      join(runDir, 'context', `review_delta_${featureId}.md`),
      join(runDir, 'context', `checkpoint_audit_${featureId}.md`),
      join(runDir, 'context', `checkpoint_delta_${featureId}.md`),
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

function resolvePhasePaths(phaseId, featureId, runDir, task = {}) {
  const currentDraft = resolveLatestDraftPath(task, runDir);
  const outputDrafts = {
    phase4a: join(runDir, 'drafts', `qa_plan_phase4a_r${getNextPhaseRound(task, 'phase4a')}.md`),
    phase4b: join(runDir, 'drafts', `qa_plan_phase4b_r${getNextPhaseRound(task, 'phase4b')}.md`),
    phase5a: join(runDir, 'drafts', `qa_plan_phase5a_r${getNextPhaseRound(task, 'phase5a')}.md`),
    phase5b: join(runDir, 'drafts', `qa_plan_phase5b_r${getNextPhaseRound(task, 'phase5b')}.md`),
    phase6: join(runDir, 'drafts', `qa_plan_phase6_r${getNextPhaseRound(task, 'phase6')}.md`),
  };

  return {
    inputDraftPath: currentDraft || fallbackInputDraft(phaseId, featureId, runDir),
    outputDraftPath: outputDrafts[phaseId] || null,
  };
}

function resolveLatestDraftPath(task, runDir) {
  const draftPath = String(task?.latest_draft_path || '').trim();
  if (!draftPath) return '';
  return draftPath.startsWith(runDir) ? draftPath : join(runDir, draftPath);
}

function fallbackInputDraft(phaseId, featureId, runDir) {
  if (phaseId === 'phase4b') {
    return join(runDir, 'drafts', `qa_plan_phase4a_r1.md`);
  }
  if (phaseId === 'phase5a') {
    return join(runDir, 'drafts', `qa_plan_phase4b_r1.md`);
  }
  if (phaseId === 'phase5b') {
    return join(runDir, 'drafts', `qa_plan_phase5a_r1.md`);
  }
  if (phaseId === 'phase6') {
    return join(runDir, 'drafts', `qa_plan_phase5b_r1.md`);
  }
  return '';
}

function collectRequirementIds(task, phaseId, artifactNeedles = []) {
  const requirements = Array.isArray(task.request_requirements) ? task.request_requirements : [];
  return requirements
    .filter((requirement) => String(requirement.required_phase || '').trim().toLowerCase() === phaseId)
    .filter((requirement) => {
      const artifacts = Array.isArray(requirement.required_artifacts) ? requirement.required_artifacts : [];
      return artifactNeedles.some((needle) => artifacts.some((artifact) => String(artifact || '').includes(needle)));
    })
    .map((requirement) => String(requirement.requirement_id || '').trim())
    .filter(Boolean);
}

function researchArtifactPath(kind, topicSlug, featureId) {
  const topicKey = topicSlug
    .replace(/^report_editor_/, '')
    .replace(/_functionality$/, '')
    .replace(/_gap$/, '_gap')
    .replace(/library_vs_workstation/, 'library_vs_workstation_gap');
  const mapping = {
    report_editor_workstation_functionality: 'report_editor_workstation',
    report_editor_library_vs_workstation_gap: 'library_vs_workstation_gap',
  };
  const slug = mapping[topicSlug] || topicKey || topicSlug;
  return `deep_research_${kind}_${slug}_${featureId}`;
}

function buildPhase3Description(featureId, runDir, task) {
  const topics = Array.isArray(task.deep_research_topics) && task.deep_research_topics.length > 0
    ? task.deep_research_topics
    : [];
  const packPrelude = task.knowledge_pack_key
    ? `Read ${runDir}/context/knowledge_pack_summary_${featureId}.md, ${runDir}/context/knowledge_pack_retrieval_${featureId}.md, and keep ${runDir}/context/coverage_ledger_${featureId}.json aligned with any pack-backed mapping changes. `
    : '';
  if (topics.length === 0) {
    return `${packPrelude}Read ${runDir}/context/artifact_lookup_${featureId}.md and write ${runDir}/context/coverage_ledger_${featureId}.md. Do not invent deep research unless the user request explicitly required it.`;
  }
  const topicList = topics.join(' and ');
  return `${packPrelude}Read ${runDir}/context/artifact_lookup_${featureId}.md, write ${runDir}/context/deep_research_plan_${featureId}.md, perform Tavily-first deep research for ${topicList}, record the actual execution order in ${runDir}/context/deep_research_execution_${featureId}.json, use Confluence fallback only when the Tavily artifact records insufficiency, write ${runDir}/context/deep_research_synthesis_report_editor_${featureId}.md, and then write ${runDir}/context/coverage_ledger_${featureId}.md and ${runDir}/context/coverage_ledger_${featureId}.json.`;
}
