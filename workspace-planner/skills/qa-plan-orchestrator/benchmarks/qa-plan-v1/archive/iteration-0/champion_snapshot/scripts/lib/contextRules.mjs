export function normalizeIssueKey(key) {
  return String(key || '').trim().toUpperCase();
}

export const APPROVED_SOURCE_RULES = {
  jira: {
    approvedSkills: ['jira-cli'],
    allowsBrowserFetch: false,
    allowsGenericWebFetch: false,
    requiresDedicatedSpawn: true,
    requiresAvailabilityValidation: true,
    requiresAuthValidation: true,
  },
  confluence: {
    approvedSkills: ['confluence'],
    allowsBrowserFetch: false,
    allowsGenericWebFetch: false,
    requiresDedicatedSpawn: true,
    requiresAvailabilityValidation: true,
    requiresAuthValidation: true,
  },
  github: {
    approvedSkills: ['github'],
    allowsBrowserFetch: false,
    allowsGenericWebFetch: false,
    requiresDedicatedSpawn: true,
    requiresAvailabilityValidation: true,
    requiresAuthValidation: true,
  },
  figma: {
    approvedSkills: ['browser', 'approved_snapshot', 'browser-or-approved-local-snapshot'],
    allowsBrowserFetch: true,
    allowsGenericWebFetch: false,
    requiresDedicatedSpawn: true,
    requiresAvailabilityValidation: true,
    requiresAuthValidation: false,
  },
};

export function normalizeSourceFamily(sourceFamily) {
  return String(sourceFamily || '').trim().toLowerCase();
}

export function getApprovedSourceRule(sourceFamily) {
  return APPROVED_SOURCE_RULES[normalizeSourceFamily(sourceFamily)] || null;
}

function getField(record, camelKey, snakeKey) {
  return record?.[camelKey] ?? record?.[snakeKey];
}

function normalizeSkillName(value) {
  return String(value || '').trim().toLowerCase();
}

function normalizeStatus(value) {
  return String(value || '').trim().toLowerCase();
}

function hasTruthyFlag(record, camelKey, snakeKey) {
  const value = getField(record, camelKey, snakeKey);
  if (typeof value === 'boolean') return value;
  const normalized = normalizeStatus(value);
  return ['true', 'yes', 'y', '1', 'pass', 'passed', 'ok'].includes(normalized);
}

function hasNonEmptyField(record, camelKey, snakeKey) {
  return String(getField(record, camelKey, snakeKey) || '').trim().length > 0;
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (value == null || value === '') return [];
  return [value];
}

function getClassifications(entry) {
  return asArray(
    getField(entry, 'referenceClassifications', 'reference_classifications')
  ).map((item) => String(item || '').trim().toLowerCase()).filter(Boolean);
}

function includesClassification(entry, classification) {
  return getClassifications(entry).includes(String(classification || '').trim().toLowerCase());
}

function isApprovedSkill(expectedRule, approvedSkill) {
  const normalized = normalizeSkillName(approvedSkill);
  return expectedRule.approvedSkills.includes(normalized);
}

export function extractIssueKeysFromText(text, projectPrefixes = []) {
  const content = String(text || '');
  const matches = content.match(/[A-Z][A-Z0-9]+-\d+/g) || [];
  const allowed = projectPrefixes.map((prefix) => prefix.toUpperCase());
  const filtered = allowed.length
    ? matches.filter((match) => allowed.includes(match.split('-')[0]))
    : matches;
  return [...new Set(filtered.map(normalizeIssueKey))];
}

export function collectRequiredIssueKeys({ mainIssueKey, linkedIssues = [], comments = [], projectPrefixes = [] }) {
  const keys = new Set();
  if (mainIssueKey) keys.add(normalizeIssueKey(mainIssueKey));

  for (const linkedIssue of linkedIssues) {
    const inward = linkedIssue?.inwardIssue?.key;
    const outward = linkedIssue?.outwardIssue?.key;
    if (inward) keys.add(normalizeIssueKey(inward));
    if (outward) keys.add(normalizeIssueKey(outward));
  }

  for (const comment of comments) {
    const body = typeof comment === 'string' ? comment : comment?.body || '';
    for (const key of extractIssueKeysFromText(body, projectPrefixes)) {
      if (normalizeIssueKey(key) !== normalizeIssueKey(mainIssueKey)) {
        keys.add(normalizeIssueKey(key));
      }
    }
  }

  return [...keys];
}

export function evaluateIssueFetch({ requiredIssueKeys = [], fetchedIssues = [] }) {
  const fetchedMap = new Map(
    fetchedIssues.map((issue) => [normalizeIssueKey(issue.key), issue])
  );

  const missing = [];
  const invalid = [];

  for (const issueKey of requiredIssueKeys.map(normalizeIssueKey)) {
    const issue = fetchedMap.get(issueKey);
    if (!issue) {
      missing.push(issueKey);
      continue;
    }
    if (!String(issue.summary || '').trim() || !String(issue.description || '').trim()) {
      invalid.push(issueKey);
    }
  }

  return {
    ok: missing.length === 0 && invalid.length === 0,
    missing,
    invalid,
  };
}

export function extractGithubUrlsFromText(text) {
  const content = String(text || '');
  const matches = content.match(/https:\/\/github\.com\/[^\s)]+/g) || [];
  return [...new Set(matches)];
}

export function collectRequiredGithubUrls({ providedUrls = [], issueBodies = [], comments = [] }) {
  const urls = new Set(providedUrls);
  for (const body of issueBodies) {
    for (const url of extractGithubUrlsFromText(body)) urls.add(url);
  }
  for (const comment of comments) {
    const body = typeof comment === 'string' ? comment : comment?.body || '';
    for (const url of extractGithubUrlsFromText(body)) urls.add(url);
  }
  return [...urls];
}

export function evaluateGithubFetch({ requiredUrls = [], fetchedDiffs = [] }) {
  const fetchedSet = new Set(fetchedDiffs.map((item) => item.url));
  const missing = requiredUrls.filter((url) => !fetchedSet.has(url));
  return { ok: missing.length === 0, missing };
}

export function evaluateRuntimeSetup({ requestedSourceFamilies = [], setupEntries = [] }) {
  const failures = [];
  const requested = requestedSourceFamilies.map(normalizeSourceFamily).filter(Boolean);
  const normalizedEntries = new Map();
  let sawPrimary = false;
  let sawSupporting = false;

  for (const entry of setupEntries) {
    const sourceFamily = normalizeSourceFamily(getField(entry, 'sourceFamily', 'source_family'));
    if (!sourceFamily) {
      failures.push('Runtime setup entry missing source family.');
      continue;
    }
    if (normalizedEntries.has(sourceFamily)) {
      failures.push(`Duplicate runtime setup entry for source family: ${sourceFamily}`);
      continue;
    }
    normalizedEntries.set(sourceFamily, entry);

    if (includesClassification(entry, 'primary')) sawPrimary = true;
    if (includesClassification(entry, 'supporting')) sawSupporting = true;
  }

  for (const sourceFamily of requested) {
    const expectedRule = getApprovedSourceRule(sourceFamily);
    const entry = normalizedEntries.get(sourceFamily);
    if (!entry) {
      failures.push(`Missing runtime setup entry for source family: ${sourceFamily}`);
      continue;
    }
    if (!expectedRule) {
      failures.push(`No approved source rule defined for source family: ${sourceFamily}`);
      continue;
    }

    const approvedSkill = normalizeSkillName(getField(entry, 'approvedSkill', 'approved_skill'));
    if (!isApprovedSkill(expectedRule, approvedSkill)) {
      failures.push(
        `Source family ${sourceFamily} must use one of [${expectedRule.approvedSkills.join(', ')}], got ${approvedSkill || 'none'}`
      );
    }

    if (normalizeStatus(entry.status) !== 'pass') {
      failures.push(`Runtime setup for ${sourceFamily} must have pass status.`);
    }

    if (expectedRule.requiresAvailabilityValidation && !hasNonEmptyField(entry, 'availabilityValidation', 'availability_validation')) {
      failures.push(`Runtime setup for ${sourceFamily} must record how availability was validated.`);
    }

    if (expectedRule.requiresAuthValidation && !hasNonEmptyField(entry, 'authValidation', 'auth_validation')) {
      failures.push(`Runtime setup for ${sourceFamily} must record how auth/access was validated.`);
    }

    if (expectedRule.requiresAvailabilityValidation && !hasTruthyFlag(entry, 'routeApproved', 'route_approved')) {
      failures.push(`Runtime setup for ${sourceFamily} must explicitly mark the canonical route as approved.`);
    }

    const classifications = getClassifications(entry);
    if (classifications.length === 0) {
      failures.push(`Runtime setup for ${sourceFamily} must classify references as primary and/or supporting.`);
    }
    const invalidClassifications = classifications.filter((item) => !['primary', 'supporting'].includes(item));
    if (invalidClassifications.length > 0) {
      failures.push(`Runtime setup for ${sourceFamily} has invalid classifications: ${invalidClassifications.join(', ')}.`);
    }
  }

  if (!sawPrimary) {
    failures.push('Runtime setup must identify at least one primary reference across requested sources.');
  }

  return {
    ok: failures.length === 0,
    failures,
    hasSupportingArtifacts: sawSupporting,
  };
}

export function evaluateSpawnPolicy({ requestedSourceFamilies = [], spawnHistory = [] }) {
  const failures = [];
  const requested = requestedSourceFamilies.map(normalizeSourceFamily).filter(Boolean);
  const seenBySource = new Map();

  for (const entry of spawnHistory) {
    const sourceFamily = normalizeSourceFamily(getField(entry, 'sourceFamily', 'source_family'));
    const expectedRule = getApprovedSourceRule(sourceFamily);
    if (!expectedRule) {
      failures.push(`Spawn entry has unknown source family: ${getField(entry, 'sourceFamily', 'source_family')}`);
      continue;
    }

    seenBySource.set(sourceFamily, (seenBySource.get(sourceFamily) || 0) + 1);

    const approvedSkill = normalizeSkillName(getField(entry, 'approvedSkill', 'approved_skill'));
    if (!isApprovedSkill(expectedRule, approvedSkill)) {
      failures.push(
        `Spawn for ${sourceFamily} must declare approved skill in [${expectedRule.approvedSkills.join(', ')}], got ${approvedSkill || 'none'}`
      );
    }

    const artifactPaths = getField(entry, 'artifactPaths', 'artifact_paths');
    if (!Array.isArray(artifactPaths) || artifactPaths.length === 0) {
      failures.push(`Spawn for ${sourceFamily} must declare at least one artifact path.`);
    }

    const status = normalizeStatus(entry.status);
    if (status && !['completed', 'complete', 'success', 'succeeded', 'pass'].includes(status)) {
      failures.push(`Spawn for ${sourceFamily} must end in a completed status, got ${status}.`);
    }

    const disallowedTools = new Set(
      (getField(entry, 'disallowedTools', 'disallowed_tools') || []).map((tool) => String(tool).trim().toLowerCase())
    );
    if (!expectedRule.allowsBrowserFetch) {
      const blocksBrowser = disallowedTools.has('browser') || disallowedTools.has('browser fetch') || disallowedTools.has('browser scraping');
      if (!blocksBrowser) {
        failures.push(`Spawn for ${sourceFamily} must explicitly disallow browser fetch/scraping.`);
      }
    }
    if (!expectedRule.allowsGenericWebFetch) {
      const blocksWebFetch = disallowedTools.has('generic web fetch') || disallowedTools.has('web fetch') || disallowedTools.has('web_fetch');
      if (!blocksWebFetch) {
        failures.push(`Spawn for ${sourceFamily} must explicitly disallow generic web fetch.`);
      }
    }
  }

  for (const sourceFamily of requested) {
    const expectedRule = getApprovedSourceRule(sourceFamily);
    if (!expectedRule) {
      failures.push(`Requested source family has no approved rule: ${sourceFamily}`);
      continue;
    }
    const count = seenBySource.get(sourceFamily) || 0;
    if (expectedRule.requiresDedicatedSpawn && count !== 1) {
      failures.push(`Requested source family ${sourceFamily} must have exactly one dedicated spawn, got ${count}.`);
    }
  }

  return { ok: failures.length === 0, failures };
}

export function evaluateSourceArtifactCompleteness({ sourceFamily, artifactPaths = [] }) {
  const failures = [];
  const normalizedSource = normalizeSourceFamily(sourceFamily);
  const paths = artifactPaths.map((path) => String(path || '').trim()).filter(Boolean);
  const lowerPaths = paths.map((path) => path.toLowerCase());

  const hasPathIncluding = (needle) => lowerPaths.some((path) => path.includes(needle));

  if (!normalizedSource) {
    failures.push('Artifact completeness check requires a source family.');
    return { ok: false, failures };
  }

  if (paths.length === 0) {
    failures.push(`Artifact completeness for ${normalizedSource} requires at least one artifact path.`);
    return { ok: false, failures };
  }

  if (normalizedSource === 'jira') {
    if (!hasPathIncluding('jira_issue_')) {
      failures.push('Jira evidence must include jira_issue_<FEATURE_ID>.md.');
    }
    if (!hasPathIncluding('jira_related_issues_')) {
      failures.push('Jira evidence must include jira_related_issues_<FEATURE_ID>.md.');
    }
  } else if (normalizedSource === 'confluence') {
    if (!hasPathIncluding('confluence_design_')) {
      failures.push('Confluence evidence must include confluence_design_<FEATURE_ID>.md.');
    }
  } else if (normalizedSource === 'github') {
    if (!hasPathIncluding('github_diff_')) {
      failures.push('GitHub evidence must include github_diff_<FEATURE_ID>.md.');
    }
    if (!hasPathIncluding('github_traceability_')) {
      failures.push('GitHub evidence must include github_traceability_<FEATURE_ID>.md.');
    }
  } else if (normalizedSource === 'figma') {
    if (!hasPathIncluding('figma_metadata_')) {
      failures.push('Figma evidence must include figma_metadata_<FEATURE_ID>.md.');
    }
  }

  return { ok: failures.length === 0, failures };
}

export function evaluateEvidenceCompleteness({ requestedSourceFamilies = [], spawnHistory = [], hasSupportingArtifacts = false, contextArtifactPaths = [] }) {
  const failures = [];
  const requested = requestedSourceFamilies.map(normalizeSourceFamily).filter(Boolean);
  const entriesBySource = new Map();
  const allArtifactPaths = [];

  for (const entry of spawnHistory) {
    const sourceFamily = normalizeSourceFamily(getField(entry, 'sourceFamily', 'source_family'));
    if (!sourceFamily) continue;
    if (!entriesBySource.has(sourceFamily)) entriesBySource.set(sourceFamily, []);
    entriesBySource.get(sourceFamily).push(entry);
    allArtifactPaths.push(...asArray(getField(entry, 'artifactPaths', 'artifact_paths')).map((p) => String(p || '').trim()).filter(Boolean));
  }

  for (const sourceFamily of requested) {
    const entries = entriesBySource.get(sourceFamily) || [];
    if (entries.length !== 1) {
      failures.push(`Cannot evaluate artifact completeness for ${sourceFamily}: expected exactly one spawn entry, got ${entries.length}.`);
      continue;
    }
    const artifactPaths = getField(entries[0], 'artifactPaths', 'artifact_paths') || [];
    const result = evaluateSourceArtifactCompleteness({ sourceFamily, artifactPaths });
    failures.push(...result.failures);
  }

  if (hasSupportingArtifacts) {
    const supportingArtifacts = [...allArtifactPaths, ...contextArtifactPaths.map((path) => String(path || '').trim())];
    const hasSupportingSummary = supportingArtifacts.some((path) => {
      const lower = path.toLowerCase();
      return lower.includes('supporting_issue_summary_') || lower.includes('supporting_artifact_summary_');
    });
    if (!hasSupportingSummary) {
      failures.push('Supporting artifacts were declared, so evidence must include supporting_issue_summary_<FEATURE_ID>.md.');
    }
  }

  return { ok: failures.length === 0, failures };
}

export function validateRequestFulfillmentManifest(task = {}) {
  const requirements = Array.isArray(task.request_requirements) ? task.request_requirements : [];
  const failures = [];
  const seenIds = new Set();
  for (const requirement of requirements) {
    const requirementId = String(requirement.requirement_id || '').trim();
    if (!requirementId) {
      failures.push('Every request requirement must include requirement_id.');
      continue;
    }
    if (seenIds.has(requirementId)) {
      failures.push(`Duplicate request requirement id: ${requirementId}`);
    }
    seenIds.add(requirementId);
    if (!String(requirement.kind || '').trim()) {
      failures.push(`Request requirement ${requirementId} must include kind.`);
    }
    if (!String(requirement.required_phase || '').trim()) {
      failures.push(`Request requirement ${requirementId} must include required_phase.`);
    }
    if (!Array.isArray(requirement.required_artifacts) || requirement.required_artifacts.length === 0) {
      failures.push(`Request requirement ${requirementId} must include required_artifacts.`);
    }
  }
  return { ok: failures.length === 0, failures };
}

export function validateRequestFulfillmentStatus(document = {}) {
  const requirements = Array.isArray(document.requirements) ? document.requirements : [];
  const failures = [];
  for (const requirement of requirements) {
    if (!requirement.blocking_on_missing) continue;
    const status = String(requirement.status || '').trim().toLowerCase();
    if (!['satisfied', 'blocked_with_reason', 'explicitly_waived_by_user'].includes(status)) {
      failures.push(`Blocking request requirement remains unresolved: ${requirement.requirement_id || 'unknown'}`);
    }
  }
  return { ok: failures.length === 0, failures };
}

export function validateResearchOrder(doc = {}) {
  const steps = Array.isArray(doc.steps) ? doc.steps : Array.isArray(doc.request_execution_log) ? doc.request_execution_log : [];
  const failures = [];
  const byTopic = new Map();
  for (const entry of steps) {
    const topic = String(entry.topic_slug || '').trim();
    if (!topic) continue;
    if (!byTopic.has(topic)) byTopic.set(topic, []);
    byTopic.get(topic).push(String(entry.tool || '').trim().toLowerCase());
  }
  for (const [topic, tools] of byTopic.entries()) {
    const confluenceIndex = tools.indexOf('confluence');
    if (confluenceIndex === -1) continue;
    const tavilyIndex = tools.findIndex((tool) => tool === 'tavily-search' || tool === 'tavily');
    if (tavilyIndex === -1 || tavilyIndex > confluenceIndex) {
      failures.push(`Tavily must run before Confluence fallback for ${topic}.`);
    }
  }
  return { ok: failures.length === 0, failures };
}

export function validateSupportingContextIntegrity(document = {}) {
  const requirements = Array.isArray(document.requirements) ? document.requirements : [];
  const failures = [];
  const supportSummaryArtifacts = requirements.flatMap((requirement) => {
    return asArray(requirement.evidence_artifacts || requirement.required_artifacts)
      .map((artifact) => String(artifact || '').trim());
  }).filter((artifact) => artifact.includes('supporting_issue_summary_'));

  if (supportSummaryArtifacts.length === 0) {
    failures.push('Supporting context integrity requires at least one supporting_issue_summary artifact.');
  }

  for (const requirement of requirements) {
    const artifacts = asArray(requirement.evidence_artifacts || requirement.required_artifacts)
      .map((artifact) => String(artifact || '').toLowerCase());
    if (artifacts.some((artifact) => artifact.includes('defect_analysis'))) {
      failures.push(`Supporting context artifact path violates non-defect policy: ${artifacts.find((artifact) => artifact.includes('defect_analysis'))}`);
    }
  }
  return { ok: failures.length === 0, failures };
}
