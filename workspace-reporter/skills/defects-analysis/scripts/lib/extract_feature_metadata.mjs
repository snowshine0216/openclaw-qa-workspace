#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

function safeReadJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return null;
  }
}

function readTask(runDir) {
  return safeReadJson(join(runDir, 'task.json')) ?? {};
}

function readRouteDecision(runDir) {
  return safeReadJson(join(runDir, 'context', 'route_decision.json')) ?? {};
}

function readJiraRaw(runDir) {
  return safeReadJson(join(runDir, 'context', 'jira_raw.json')) ?? { issues: [] };
}

function readExistingMetadata(runDir) {
  return safeReadJson(join(runDir, 'context', 'feature_metadata.json'));
}

function firstParentSummary(jiraRaw) {
  for (const issue of jiraRaw.issues ?? []) {
    const parentSummary = issue?.fields?.parent?.fields?.summary;
    if (parentSummary) {
      return parentSummary;
    }
  }
  return '';
}

function firstFeatureLikeSummary(jiraRaw, runKey) {
  for (const issue of jiraRaw.issues ?? []) {
    if (issue?.key === runKey && issue?.fields?.summary) {
      return issue.fields.summary;
    }
  }
  return '';
}

function inferFeatureTitle({ existing, jiraRaw, runKey }) {
  return (
    existing?.feature_title ||
    firstParentSummary(jiraRaw) ||
    firstFeatureLikeSummary(jiraRaw, runKey) ||
    runKey
  );
}

function inferReleaseVersion(task, routeDecision) {
  if (typeof task.release_version_context === 'string' && task.release_version_context.length > 0) {
    return task.release_version_context;
  }
  if (typeof routeDecision.release_version === 'string' && routeDecision.release_version.length > 0) {
    return routeDecision.release_version;
  }
  if (task.route_kind === 'reporter_scope_release') {
    return task.raw_input ?? routeDecision.raw_input ?? null;
  }
  return null;
}

function inferIssueType(existing, routeDecision, task) {
  return existing?.issue_type ?? routeDecision.jira_issue_type ?? task.issue_type ?? 'Feature';
}

export function extractFeatureMetadata(runDir, runKey) {
  const existing = readExistingMetadata(runDir);
  if (existing?.feature_key && existing?.feature_title) {
    return existing;
  }

  const task = readTask(runDir);
  const routeDecision = readRouteDecision(runDir);
  const jiraRaw = readJiraRaw(runDir);
  const metadata = {
    feature_key: existing?.feature_key ?? runKey,
    feature_title: inferFeatureTitle({ existing, jiraRaw, runKey }),
    issue_type: inferIssueType(existing, routeDecision, task),
    release_version: existing?.release_version ?? inferReleaseVersion(task, routeDecision),
  };

  writeFileSync(
    join(runDir, 'context', 'feature_metadata.json'),
    `${JSON.stringify(metadata, null, 2)}\n`,
    'utf8',
  );
  return metadata;
}

function main() {
  const [runDir, runKey] = process.argv.slice(2);
  if (!runDir || !runKey) {
    console.error('Usage: extract_feature_metadata.mjs <run-dir> <run-key>');
    process.exit(1);
  }
  const metadata = extractFeatureMetadata(runDir, runKey);
  process.stdout.write(`${JSON.stringify(metadata, null, 2)}\n`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
