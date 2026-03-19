#!/usr/bin/env node
/**
 * Extract normalized defect_summary.json from defects-analysis outputs.
 */

import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { normalizeRiskLevel, strongerRisk } from './riskLevels.mjs';

const GITHUB_PR_URL_PATTERN = /https:\/\/github\.com\/[^\s)]+\/pull\/\d+/g;
const OPEN_STATUSES = ['Open', 'In Progress', 'To Do', 'In Review'];
const RESOLVED_STATUSES = ['Resolved', 'Closed', 'Done'];

async function safeReadJson(path) {
  try {
    const raw = await readFile(path, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function textFromField(value) {
  if (typeof value === 'string') return value;
  if (!value) return '';
  try {
    return JSON.stringify(value);
  } catch {
    return '';
  }
}

function extractGithubPrUrls(text) {
  return [...new Set(textFromField(text).match(GITHUB_PR_URL_PATTERN) ?? [])];
}

function parseGithubPr(url) {
  const match = String(url).match(/github\.com\/([^/]+\/[^/]+)\/pull\/(\d+)/);
  if (!match) return null;
  return {
    url,
    repository: match[1],
    number: parseInt(match[2], 10),
  };
}

function createPrEntry({
  url,
  sourceKind,
  extractionSource,
  linkedDefectKeys = [],
  riskLevel,
  notes,
}) {
  const parsed = parseGithubPr(url);
  if (!parsed) return null;
  return {
    ...parsed,
    sourceKind,
    extractionSource,
    linkedDefectKeys,
    riskLevel,
    notes,
  };
}

function extractDefectsFromJira(jiraRaw) {
  if (!jiraRaw?.issues) return [];
  return jiraRaw.issues.map((issue) => ({
    key: issue.key,
    summary: issue.fields?.summary ?? '',
    priority: issue.fields?.priority?.name ?? 'P2',
    status: issue.fields?.status?.name ?? '',
    resolution: issue.fields?.resolution?.name ?? '',
    url: buildIssueBrowseUrl(issue, jiraRaw),
    linkedPrs: [],
  }));
}

function extractBrowseBase(urlString) {
  if (!urlString) return null;
  try {
    const parsed = new URL(urlString);
    const restIndex = parsed.pathname.indexOf('/rest/api/');
    if (restIndex >= 0) {
      return `${parsed.origin}${parsed.pathname.slice(0, restIndex)}`;
    }
    const browseIndex = parsed.pathname.indexOf('/browse/');
    if (browseIndex >= 0) {
      return `${parsed.origin}${parsed.pathname.slice(0, browseIndex)}`;
    }
    return parsed.origin;
  } catch {
    return null;
  }
}

function buildIssueBrowseUrl(issue, jiraRaw) {
  const baseUrl = [
    issue?.self,
    jiraRaw?.self,
    jiraRaw?.baseUrl,
    jiraRaw?.serverInfo?.baseUrl,
  ]
    .map(extractBrowseBase)
    .find(Boolean);

  return baseUrl ? `${baseUrl}/browse/${issue.key}` : '';
}

function extractPrsFromDefectSources(jiraRaw) {
  if (!jiraRaw?.issues) return [];
  return jiraRaw.issues.flatMap((issue) => {
    const fields = issue.fields ?? {};
    const texts = [
      textFromField(fields.description),
      ...(fields.comment?.comments ?? []).map((comment) => textFromField(comment.body)),
    ];

    return texts.flatMap((text) =>
      extractGithubPrUrls(text)
        .map((url) =>
          createPrEntry({
            url,
            sourceKind: 'defect_fix',
            extractionSource: 'defect_comments',
            linkedDefectKeys: [issue.key],
            riskLevel: 'MEDIUM',
            notes: '',
          })
        )
        .filter(Boolean)
    );
  });
}

async function readPrImpactFiles(prDir) {
  try {
    const entries = await readdir(prDir, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('_impact.md')) {
        const raw = await readFile(join(prDir, entry.name), 'utf8');
        files.push({ name: entry.name, content: raw });
      }
    }
    return files;
  } catch {
    return [];
  }
}

function extractRiskLevel(text) {
  const match = String(text || '').match(
    /^(?:Regression\s+)?Risk(?:\s+Level)?\s*:\s*(Critical|High|Medium|Low)\b/im
  );
  return normalizeRiskLevel(match?.[1], null);
}

function extractAnalysisRiskLevel(reportFinal) {
  const directMatch = String(reportFinal || '').match(
    /(?:Risk Rating|Overall Risk Level)\s*:\s*\**(HIGH|MEDIUM|LOW|CRITICAL)\**/i
  );
  if (directMatch) {
    return normalizeRiskLevel(directMatch[1], null);
  }
  const fallbackMatch = String(reportFinal || '').match(
    /\*\*Risk Level:\*\*\s*(HIGH|MEDIUM|LOW|CRITICAL)/i
  );
  return normalizeRiskLevel(fallbackMatch?.[1], null);
}

function extractPrsFromImpactFiles(prImpactFiles) {
  return prImpactFiles.flatMap((file) =>
    extractGithubPrUrls(file.content)
      .map((url) =>
        createPrEntry({
          url,
          sourceKind: 'defect_fix',
          extractionSource: 'qa_summary',
          linkedDefectKeys: [],
          riskLevel: extractRiskLevel(file.content) || 'MEDIUM',
          notes: `Recovered from ${file.name}.`,
        })
      )
      .filter(Boolean)
  );
}

function extractPrsFromReportFinal(reportFinal) {
  return extractGithubPrUrls(reportFinal)
    .map((url) =>
      createPrEntry({
        url,
        sourceKind: 'defect_fix',
        extractionSource: 'qa_summary',
        linkedDefectKeys: [],
        riskLevel: 'MEDIUM',
        notes: 'Recovered from the defect analysis final report.',
      })
    )
    .filter(Boolean);
}

function extractFeaturePrs({ plannerSeed }) {
  return extractGithubPrUrls(plannerSeed)
    .map((url) =>
      createPrEntry({
        url,
        sourceKind: 'feature_change',
        extractionSource: 'feature_comments',
        linkedDefectKeys: [],
        riskLevel: 'LOW',
        notes: 'Feature-level implementation PR.',
      })
    )
    .filter(Boolean);
}

function strongerSourceKind(current, next) {
  const strength = { feature_change: 1, defect_fix: 2 };
  return (strength[next] ?? 0) > (strength[current] ?? 0) ? next : current;
}

function mergeExtractionSource(current, next) {
  if (current === 'defect_comments') return current;
  return next || current;
}

function dedupePrs(prArrays) {
  const byUrl = new Map();
  for (const pr of prArrays.flat().filter(Boolean)) {
    const existing = byUrl.get(pr.url);
    if (!existing) {
      byUrl.set(pr.url, pr);
      continue;
    }

    byUrl.set(pr.url, {
      ...existing,
      sourceKind: strongerSourceKind(existing.sourceKind, pr.sourceKind),
      extractionSource: mergeExtractionSource(existing.extractionSource, pr.extractionSource),
      linkedDefectKeys: [
        ...new Set([...(existing.linkedDefectKeys ?? []), ...(pr.linkedDefectKeys ?? [])]),
      ],
      riskLevel: strongerRisk(existing.riskLevel, pr.riskLevel),
      notes: existing.notes || pr.notes,
    });
  }
  return Array.from(byUrl.values());
}

function countOpenDefects(defects) {
  return defects.filter((defect) => OPEN_STATUSES.includes(defect.status)).length;
}

function countResolvedDefects(defects) {
  return defects.filter((defect) => RESOLVED_STATUSES.includes(defect.status)).length;
}

function attachLinkedPrs(defects, prs) {
  return defects.map((defect) => ({
    ...defect,
    linkedPrs: prs
      .filter((pr) => (pr.linkedDefectKeys ?? []).includes(defect.key))
      .map((pr) => pr.url),
  }));
}

function validateDefectInputs({ defectsRunDir, jiraRaw, reportFinal }) {
  if (reportFinal.trim() && !jiraRaw) {
    throw new Error(
      `Missing ${join(defectsRunDir, 'context', 'jira_raw.json')} for defect summary generation.`
    );
  }
}

export async function buildDefectSummary({
  featureKey,
  defectsRunDir,
  plannerLookupPath,
  plannerSeedPath,
  reportPathOverride,
}) {
  const reportPath = reportPathOverride ?? join(defectsRunDir, `${featureKey}_REPORT_FINAL.md`);
  let reportFinal = '';
  try {
    reportFinal = await readFile(reportPath, 'utf8');
  } catch {
    /* no defect report */
  }

  const jiraRaw = await safeReadJson(join(defectsRunDir, 'context', 'jira_raw.json'));
  validateDefectInputs({ defectsRunDir, jiraRaw, reportFinal });
  const prLinks = (await safeReadJson(join(defectsRunDir, 'context', 'pr_links.json'))) ?? [];
  const prImpactFiles = await readPrImpactFiles(join(defectsRunDir, 'context', 'prs'));

  let plannerSeed = '';
  if (plannerSeedPath) {
    try {
      plannerSeed = await readFile(plannerSeedPath, 'utf8');
    } catch {
      /* ignore */
    }
  }

  const defects = extractDefectsFromJira(jiraRaw);
  const defectCommentPrs = extractPrsFromDefectSources(jiraRaw);
  const defectArtifactPrs = prLinks
    .map((url) =>
      createPrEntry({
        url,
        sourceKind: 'defect_fix',
        extractionSource: 'qa_summary',
        linkedDefectKeys: [],
        riskLevel: 'MEDIUM',
        notes: 'Recovered from defect PR analysis artifacts.',
      })
    )
    .filter(Boolean);
  const defectImpactPrs = extractPrsFromImpactFiles(prImpactFiles);
  const defectReportPrs = extractPrsFromReportFinal(reportFinal);
  const featurePrs = extractFeaturePrs({ plannerSeed });
  const prs = dedupePrs([
    defectCommentPrs,
    defectArtifactPrs,
    defectImpactPrs,
    defectReportPrs,
    featurePrs,
  ]);
  const defectsWithLinks = attachLinkedPrs(defects, prs);

  return {
    totalDefects: defectsWithLinks.length,
    openDefects: countOpenDefects(defectsWithLinks),
    resolvedDefects: countResolvedDefects(defectsWithLinks),
    noDefectsFound: defectsWithLinks.length === 0,
    analysisRiskLevel: extractAnalysisRiskLevel(reportFinal),
    defects: defectsWithLinks,
    prs,
  };
}
