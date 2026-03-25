#!/usr/bin/env node
/**
 * Invocable entrypoint for report-quality-reviewer skill.
 * Reads draft and run context, validates structural and content quality,
 * writes <run-key>_REVIEW_SUMMARY.md. Returns pass/fail via stdout and exit code.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REQUIRED_SECTIONS = [
  '## 1. Report Header',
  '## 2. Executive Summary',
  '## 3. Defect Breakdown by Status',
  '## 4. Risk Analysis by Functional Area',
  '## 5. Defect Analysis by Priority',
  '## 6. Code Change Analysis',
  '## 7. Residual Risk Assessment',
  '## 8. Recommended QA Focus Areas',
  '## 9. Test Environment Recommendations',
  '## 10. Verification Checklist for Release',
  '## 11. Conclusion',
  '## 12. Appendix: Defect Reference List',
];

const GENERIC_FILLER_PATTERNS = [
  /Review open defects and prioritize testing by priority and functional area\./i,
  /Verify test instances and feature flags per defect context\./i,
  /Validate pre-release checks against open defects\./i,
  /Risk mitigation and recommended action based on defect status\./i,
  /Defects are grouped by status and priority\./i,
  /See context\/prs\//i,
];

const HIGH_RISK_PRIORITIES = new Set([
  'HIGH',
  'HIGHEST',
  'CRITICAL',
  'BLOCKER',
  'P0',
  'P1',
]);

function safeReadJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return null;
  }
}

function routeKind(runDir, runKey) {
  const task = safeReadJson(join(runDir, 'task.json')) ?? {};
  const routeDecision = safeReadJson(join(runDir, 'context', 'route_decision.json')) ?? {};
  return task.route_kind ?? routeDecision.route_kind ?? (runKey.startsWith('release_') ? 'reporter_scope_release' : 'reporter_scope_single_key');
}

function normalizePriority(priority) {
  return String(priority ?? '').trim().toUpperCase();
}

function openHighDefects(runDir) {
  const defectIndex = safeReadJson(join(runDir, 'context', 'defect_index.json'));
  if (Array.isArray(defectIndex?.defects)) {
    return defectIndex.defects.filter(
      (defect) =>
        !['Done', 'Resolved', 'Closed'].includes(defect.status) &&
        HIGH_RISK_PRIORITIES.has(normalizePriority(defect.priority)),
    );
  }

  const jiraRaw = safeReadJson(join(runDir, 'context', 'jira_raw.json')) ?? { issues: [] };
  return (jiraRaw.issues ?? []).filter(
    (issue) =>
      !['Done', 'Resolved', 'Closed'].includes(issue.fields?.status?.name) &&
      HIGH_RISK_PRIORITIES.has(normalizePriority(issue.fields?.priority?.name)),
  );
}

function prSummary(runDir) {
  return safeReadJson(join(runDir, 'context', 'pr_impact_summary.json')) ?? { pr_count: 0 };
}

function featureTitle(runDir) {
  return safeReadJson(join(runDir, 'context', 'feature_metadata.json'))?.feature_title ?? '';
}

function releasePacketDirs(runDir) {
  const featuresDir = join(runDir, 'features');
  if (!existsSync(featuresDir)) {
    return [];
  }
  return readdirSync(featuresDir).map((name) => join(featuresDir, name));
}

function releaseFeatures(runDir) {
  const summary = safeReadJson(join(runDir, 'context', 'release_summary_inputs.json'));
  if (Array.isArray(summary?.features) && summary.features.length > 0) {
    return summary.features;
  }
  return releasePacketDirs(runDir).map((dir) => {
    const normalized = dir.replace(/\\/g, '/');
    const featureKey = normalized.split('/').at(-1);
    return {
      feature_key: featureKey,
      release_packet_dir: normalized,
    };
  });
}

function packetReferenceCandidates(feature) {
  const key = feature.feature_key;
  const refs = new Set([`/features/${key}`, `features/${key}`, `\\features\\${key}`]);
  if (typeof feature.release_packet_dir === 'string' && feature.release_packet_dir.length > 0) {
    const normalized = feature.release_packet_dir.replace(/\\/g, '/');
    refs.add(normalized);
    const featuresIndex = normalized.indexOf('features/');
    if (featuresIndex >= 0) {
      refs.add(normalized.slice(featuresIndex));
    }
    const slashFeaturesIndex = normalized.indexOf('/features/');
    if (slashFeaturesIndex >= 0) {
      refs.add(normalized.slice(slashFeaturesIndex));
    }
  }
  return [...refs];
}

function hasPerFeaturePacketReference(draft, feature) {
  return packetReferenceCandidates(feature).some((reference) => draft.includes(reference));
}

function hasFunctionalAreaData(draft) {
  const match = draft.match(
    /## 4\. Risk Analysis by Functional Area\s+([\s\S]*?)(?:\n---\n|\n## 5\. Defect Analysis by Priority)/,
  );
  if (!match) {
    return false;
  }

  const rows = match[1]
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('|'));

  if (rows.length < 2) {
    return false;
  }

  const dataRows = rows.slice(1).filter((line) => !/^\|?\s*[-:| ]+\|?$/.test(line));
  return dataRows.length > 0;
}

function collectFindings(runDir, runKey, draft) {
  const findings = [];
  const missing = REQUIRED_SECTIONS.filter((heading) => !draft.includes(heading));
  if (missing.length > 0) {
    findings.push(`Missing sections: ${missing.join(', ')}`);
  }

  for (const pattern of GENERIC_FILLER_PATTERNS) {
    if (pattern.test(draft)) {
      findings.push(`Generic filler remains in the draft: ${pattern}`);
    }
  }

  const kind = routeKind(runDir, runKey);
  if (kind === 'reporter_scope_release') {
    const packetDirs = releasePacketDirs(runDir);
    if (packetDirs.length === 0) {
      findings.push('Release run exists but no feature packets were produced.');
    }
    if (!draft.includes('/features/') && !draft.includes('\\features\\')) {
      findings.push('Release report does not link to feature packet directories.');
    }
    const features = releaseFeatures(runDir);
    const missingFeatureRefs = features
      .filter((feature) => feature.feature_key && !hasPerFeaturePacketReference(draft, feature))
      .map((feature) => feature.feature_key);
    if (missingFeatureRefs.length > 0) {
      findings.push(
        `Release report is missing per-feature packet references for: ${missingFeatureRefs.join(', ')}`,
      );
    }
    return findings;
  }

  const metadataTitle = featureTitle(runDir);
  if (!draft.match(/\*\*Feature Title:\*\*/i) && metadataTitle.length > 0) {
    findings.push('Feature title callout is missing.');
  }
  if (metadataTitle.length > 0 && !draft.includes(metadataTitle)) {
    findings.push('Feature title metadata is not reflected in the report.');
  }

  const highPriorityDefects = openHighDefects(runDir);
  if (
    highPriorityDefects.length > 0 &&
    !draft.match(/Blocking defects:/i) &&
    !highPriorityDefects.some((defect) => draft.includes(defect.key))
  ) {
    findings.push('Open high-priority defects are not explicitly called out.');
  }

  if (draft.includes('## 4. Risk Analysis by Functional Area') && !hasFunctionalAreaData(draft)) {
    findings.push('Functional-area section is empty despite defects existing.');
  }

  const summary = prSummary(runDir);
  if ((summary.pr_count ?? 0) > 0) {
    if (draft.match(/See context\/prs\//i)) {
      findings.push('Code Change Analysis points to context/prs/ without synthesis.');
    }
    const repos = summary.repos_changed ?? [];
    if (repos.length > 0 && !repos.some((repo) => draft.includes(repo))) {
      findings.push('Code Change Analysis is missing repo-aware PR synthesis.');
    }
  }

  return findings;
}

export function reviewReport(runDir, runKey) {
  const draftPath = join(runDir, `${runKey}_REPORT_DRAFT.md`);
  const draft = readFileSync(draftPath, 'utf8');
  const issues = (safeReadJson(join(runDir, 'context', 'jira_raw.json'))?.issues ?? []);
  const findings = collectFindings(runDir, runKey, draft);
  const status = findings.length === 0 ? 'pass' : 'fail';
  const focus = issues.length ? `- Primary human review area: ${issues[0].key}` : '- No defects found.';
  const fixes =
    findings.length > 0
      ? findings.map((finding) => `- ${finding}`).join('\n')
      : '- No objective fixes required.';
  const summary = `## Review Result: ${status}

### Focus Areas (20/80)
${focus}

### Actionable Fixes
${fixes}

### Recommendations for the Reviewer
- Confirm the overall risk rating matches the remaining open defects.
`;
  writeFileSync(join(runDir, `${runKey}_REVIEW_SUMMARY.md`), `${summary}\n`, 'utf8');
  return status;
}

function main() {
  const [runDir, runKey] = process.argv.slice(2);
  if (!runDir || !runKey) {
    console.error('Usage: review.mjs <run-dir> <run-key>');
    process.exit(1);
  }
  const status = reviewReport(runDir, runKey);
  process.stdout.write(status);
  process.exit(status === 'pass' ? 0 : 1);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
