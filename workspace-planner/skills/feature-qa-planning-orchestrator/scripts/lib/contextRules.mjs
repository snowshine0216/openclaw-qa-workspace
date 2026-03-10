export function normalizeIssueKey(key) {
  return String(key || '').trim().toUpperCase();
}

export const APPROVED_SOURCE_RULES = {
  jira: {
    approvedSkill: 'jira-cli',
    allowsBrowserFetch: false,
    allowsGenericWebFetch: false,
  },
  confluence: {
    approvedSkill: 'confluence',
    allowsBrowserFetch: false,
    allowsGenericWebFetch: false,
  },
  github: {
    approvedSkill: 'github',
    allowsBrowserFetch: false,
    allowsGenericWebFetch: false,
  },
  figma: {
    approvedSkill: 'browser-or-approved-local-snapshot',
    allowsBrowserFetch: true,
    allowsGenericWebFetch: false,
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
  const normalizedEntries = new Map(
    setupEntries.map((entry) => [normalizeSourceFamily(getField(entry, 'sourceFamily', 'source_family')), entry])
  );

  for (const sourceFamily of requestedSourceFamilies.map(normalizeSourceFamily)) {
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
    const approvedSkill = getField(entry, 'approvedSkill', 'approved_skill');
    if (approvedSkill !== expectedRule.approvedSkill) {
      failures.push(
        `Source family ${sourceFamily} must use ${expectedRule.approvedSkill}, got ${approvedSkill || 'none'}`
      );
    }
    if (!String(entry.status || '').trim().match(/^pass$/i)) {
      failures.push(`Runtime setup for ${sourceFamily} must have pass status.`);
    }
  }

  return { ok: failures.length === 0, failures };
}

export function evaluateSpawnPolicy({ spawnHistory = [] }) {
  const failures = [];

  for (const entry of spawnHistory) {
    const sourceFamily = normalizeSourceFamily(getField(entry, 'sourceFamily', 'source_family'));
    const expectedRule = getApprovedSourceRule(sourceFamily);
    if (!expectedRule) {
      failures.push(`Spawn entry has unknown source family: ${getField(entry, 'sourceFamily', 'source_family')}`);
      continue;
    }

    const approvedSkill = getField(entry, 'approvedSkill', 'approved_skill');
    if (approvedSkill !== expectedRule.approvedSkill) {
      failures.push(
        `Spawn for ${sourceFamily} must declare approved skill ${expectedRule.approvedSkill}, got ${approvedSkill || 'none'}`
      );
    }

    const artifactPaths = getField(entry, 'artifactPaths', 'artifact_paths');
    if (!Array.isArray(artifactPaths) || artifactPaths.length === 0) {
      failures.push(`Spawn for ${sourceFamily} must declare at least one artifact path.`);
    }

    const disallowedTools = new Set(
      (getField(entry, 'disallowedTools', 'disallowed_tools') || []).map((tool) => String(tool).trim().toLowerCase())
    );
    if (!expectedRule.allowsBrowserFetch && !disallowedTools.has('browser')) {
      failures.push(`Spawn for ${sourceFamily} must explicitly disallow browser use.`);
    }
    if (!expectedRule.allowsGenericWebFetch && !disallowedTools.has('generic web fetch')) {
      failures.push(`Spawn for ${sourceFamily} must explicitly disallow generic web fetch.`);
    }
  }

  return { ok: failures.length === 0, failures };
}
