#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ISSUE_CLASS_TYPES = new Set(['issue', 'bug', 'defect']);
const REPORTER_CLASS_TYPES = new Set(['story', 'feature', 'epic', 'task', 'sub-task', 'subtask']);
const JQL_TOKENS = ['project', 'issuetype', 'order by', ' and ', ' or ', ' in ', '='];
const DEFAULT_QA_OWNER_FIELD = 'QA Owner';
const CURRENT_USER_ALIASES = new Set([
  'me',
  'myself',
  'current_user',
  'currentuser',
  'currentuser()',
  'current_user()',
]);

function normalizeIssueKey(rawInput) {
  if (!rawInput) {
    return null;
  }
  if (/^[A-Z][A-Z0-9]{1,10}-\d+$/.test(rawInput)) {
    return rawInput;
  }
  const match = rawInput.match(/\/browse\/([A-Z][A-Z0-9]{1,10}-\d+)(?:[/?#].*)?$/i);
  return match ? match[1].toUpperCase() : null;
}

function isReleaseVersion(rawInput) {
  return /^\d+(?:\.\d+)*$/.test(rawInput ?? '');
}

function isJql(rawInput) {
  const haystack = ` ${String(rawInput ?? '').toLowerCase()} `;
  return JQL_TOKENS.some((token) => haystack.includes(token));
}

function buildJqlKey(rawInput) {
  const digest = createHash('sha1').update(rawInput).digest('hex').slice(0, 12);
  return `jql_${digest}`;
}

function valueOrNull(value) {
  const normalized = String(value ?? '').trim();
  return normalized.length > 0 ? normalized : null;
}

function normalizeQaOwner(qaOwner) {
  const value = valueOrNull(qaOwner);
  if (!value) {
    return null;
  }
  const normalized = value.toLowerCase();
  if (CURRENT_USER_ALIASES.has(normalized)) {
    return { qa_owner_mode: 'current_user', qa_owner_value: null };
  }
  return { qa_owner_mode: 'explicit', qa_owner_value: value };
}

function normalizeQaOwnerField(qaOwnerField) {
  return valueOrNull(qaOwnerField) ?? DEFAULT_QA_OWNER_FIELD;
}

function buildReleaseScope({ releaseVersion, qaOwner, qaOwnerField }) {
  const normalizedOwner = normalizeQaOwner(qaOwner);
  if (!normalizedOwner) {
    return null;
  }
  return {
    release_version: releaseVersion,
    qa_owner_field: normalizeQaOwnerField(qaOwnerField),
    ...normalizedOwner,
  };
}

function buildReleaseRunKey(releaseVersion, releaseScope) {
  if (!releaseScope) {
    return `release_${releaseVersion}`;
  }
  const scopeFingerprint = {
    release_version: releaseScope.release_version,
    qa_owner_field: releaseScope.qa_owner_field,
    qa_owner_mode: releaseScope.qa_owner_mode,
    qa_owner_value: releaseScope.qa_owner_value,
  };
  const scopeDigest = createHash('sha1')
    .update(JSON.stringify(scopeFingerprint))
    .digest('hex')
    .slice(0, 8);
  return `release_${releaseVersion}__scope_${scopeDigest}`;
}

function buildRoute({
  rawInput,
  runKey,
  routeKind,
  jiraIssueType = null,
  delegatesTo = null,
  reason,
  extra = {},
}) {
  return {
    run_key: runKey,
    raw_input: rawInput,
    route_kind: routeKind,
    jira_issue_type: jiraIssueType,
    issue_key: normalizeIssueKey(rawInput),
    delegates_to: delegatesTo,
    reason,
    ...extra,
  };
}

export function deriveRouteDecision({
  rawInput,
  jiraIssueType = null,
  featureKey = null,
  releaseVersion = null,
  jqlQuery = null,
  qaOwner = null,
  qaOwnerField = null,
}) {
  const effectiveInput = rawInput ?? featureKey ?? releaseVersion ?? jqlQuery;
  if (!effectiveInput) {
    throw new Error('rawInput is required');
  }

  if (featureKey) {
    return buildRoute({
      rawInput: featureKey,
      runKey: featureKey,
      routeKind: 'reporter_scope_single_key',
      jiraIssueType: 'Feature',
      reason: 'Explicit feature_key input stays in reporter scope',
    });
  }

  if (releaseVersion && !isReleaseVersion(releaseVersion)) {
    throw new Error(`Invalid release version: ${releaseVersion}`);
  }

  if (releaseVersion || isReleaseVersion(effectiveInput)) {
    const value = releaseVersion ?? effectiveInput;
    const releaseScope = buildReleaseScope({
      releaseVersion: value,
      qaOwner,
      qaOwnerField,
    });
    return buildRoute({
      rawInput: value,
      runKey: buildReleaseRunKey(value, releaseScope),
      routeKind: 'reporter_scope_release',
      reason: 'Release version inputs stay in reporter scope',
      extra: {
        release_version: value,
        release_scope: releaseScope,
      },
    });
  }

  if (jqlQuery || isJql(effectiveInput)) {
    const value = jqlQuery ?? effectiveInput;
    return buildRoute({
      rawInput: value,
      runKey: buildJqlKey(value),
      routeKind: 'reporter_scope_jql',
      reason: 'JQL inputs stay in reporter scope',
    });
  }

  const issueKey = normalizeIssueKey(effectiveInput);
  if (!issueKey) {
    throw new Error(`Unable to classify input: ${effectiveInput}`);
  }

  const issueType = String(jiraIssueType ?? '').trim();
  if (!issueType) {
    throw new Error(`Jira issue type is required to classify ${issueKey}`);
  }

  const normalizedType = issueType.toLowerCase();
  if (ISSUE_CLASS_TYPES.has(normalizedType)) {
    return buildRoute({
      rawInput: effectiveInput,
      runKey: issueKey,
      routeKind: 'issue_class',
      jiraIssueType: issueType,
      delegatesTo: '.agents/skills/single-defect-analysis',
      reason: `${issueType} inputs delegate to shared single-defect-analysis`,
    });
  }

  if (REPORTER_CLASS_TYPES.has(normalizedType)) {
    return buildRoute({
      rawInput: effectiveInput,
      runKey: issueKey,
      routeKind: 'reporter_scope_single_key',
      jiraIssueType: issueType,
      reason: `${issueType} inputs remain in reporter-local defect analysis scope`,
    });
  }

  return buildRoute({
    rawInput: effectiveInput,
    runKey: issueKey,
    routeKind: 'reporter_scope_single_key',
    jiraIssueType: issueType,
    reason: `${issueType} defaults to reporter-local defect analysis scope`,
  });
}

async function main() {
  const [rawInput, jiraIssueType, featureKey, releaseVersion, jqlQuery, qaOwner, qaOwnerField] =
    process.argv.slice(2);
  if (!rawInput) {
    console.error(
      'Usage: classify_input.mjs <raw-input> [issue-type] [feature-key] [release-version] [jql-query] [qa-owner] [qa-owner-field]',
    );
    process.exit(1);
  }
  const result = deriveRouteDecision({
    rawInput,
    jiraIssueType,
    featureKey: valueOrNull(featureKey),
    releaseVersion: valueOrNull(releaseVersion),
    jqlQuery: valueOrNull(jqlQuery),
    qaOwner: valueOrNull(qaOwner),
    qaOwnerField: valueOrNull(qaOwnerField),
  });
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
