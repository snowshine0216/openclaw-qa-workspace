export function normalizeIssueKey(key) {
  return String(key || '').trim().toUpperCase();
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
