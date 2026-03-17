#!/usr/bin/env node
/**
 * Merge planner Markdown and reporter summary for Confluence publish.
 */

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const QA_SUMMARY_HEADING_PATTERN = /^##(?:\s+\d+\.)?\s*(?:📊\s*)?QA Summary\s*$/m;

/**
 * Extract Confluence page ID from URL (e.g. .../pages/5949096102/Example -> 5949096102).
 */
export function extractPageIdFromUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const m = url.match(/\/pages\/(\d+)(?:\/|$)/);
  return m ? m[1] : null;
}

/**
 * Read current Confluence page content via confluence-cli. Returns markdown-like text or empty on failure.
 */
export async function readConfluencePageContent(pageId) {
  const bin = process.env.CONFLUENCE_BIN || 'confluence';
  const result = spawnSync(bin, ['read', String(pageId)], { encoding: 'utf8' });
  if (result.status !== 0 || !result.stdout) return '';
  return (result.stdout || '').trim();
}

function findQaSummaryHeadingStart(doc) {
  const headingMatch = doc.match(QA_SUMMARY_HEADING_PATTERN);
  if (headingMatch?.index != null) return headingMatch.index;
  return -1;
}

function hasQaSummarySection(doc) {
  return findQaSummaryHeadingStart(doc) >= 0;
}

function replaceQaSummarySection(doc, summaryContent, options = {}) {
  const startIdx = findQaSummaryHeadingStart(doc);
  const fallbackIdx =
    startIdx >= 0 || options.allowFeatureOverviewFallback !== true
      ? -1
      : doc.indexOf('### 1. Feature Overview');
  const replaceIdx = startIdx >= 0 ? startIdx : fallbackIdx;
  if (replaceIdx < 0) {
    return doc.trim() + '\n\n' + summaryContent.trim() + '\n';
  }
  const nextH2 = doc.indexOf('\n## ', replaceIdx + 1);
  const end = nextH2 >= 0 ? nextH2 : doc.length;
  const before = doc.slice(0, replaceIdx).trimEnd();
  const after = doc.slice(end).trimStart();
  const merged = [before, summaryContent.trim(), after].filter(Boolean).join('\n\n');
  return merged;
}

function appendQaSummarySection(doc, summaryContent) {
  const normalizedDoc = doc.trimEnd();
  if (!normalizedDoc) return summaryContent.trim() + '\n';
  return normalizedDoc + '\n\n' + summaryContent.trim() + '\n';
}

function mergePlannerWithSummary(planner, summary) {
  if (hasQaSummarySection(planner)) {
    return replaceQaSummarySection(planner, summary, { allowFeatureOverviewFallback: true });
  }
  return appendQaSummarySection(planner, summary);
}

function mergeExistingPageWithSummary(currentPage, summary) {
  if (hasQaSummarySection(currentPage)) {
    return replaceQaSummarySection(currentPage, summary);
  }
  return appendQaSummarySection(currentPage, summary);
}

function mergeFallbackContent(planner, summary) {
  const baseContent = planner || summary;
  return replaceQaSummarySection(baseContent, summary, {
    allowFeatureOverviewFallback: true,
  });
}

async function loadPlannerMarkdown(runDir) {
  try {
    const taskPath = join(runDir, 'task.json');
    const taskRaw = await readFile(taskPath, 'utf8');
    const task = JSON.parse(taskRaw);
    const planPath = task.planner_plan_resolved_path;
    if (planPath) {
      return await readFile(planPath, 'utf8');
    }
  } catch {
    /* ignore */
  }
  return '';
}

async function loadSummaryDraft(runDir, featureKey) {
  const draftPath = join(runDir, 'drafts', `${featureKey}_QA_SUMMARY_DRAFT.md`);
  try {
    return await readFile(draftPath, 'utf8');
  } catch {
    const finalPath = join(runDir, `${featureKey}_QA_SUMMARY_FINAL.md`);
    try {
      return await readFile(finalPath, 'utf8');
    } catch {
      return '';
    }
  }
}

export async function mergeConfluenceMarkdown({
  featureKey,
  runDir,
  publishMode,
  target,
  readPageContent = readConfluencePageContent,
}) {
  const planner = await loadPlannerMarkdown(runDir);
  const summary = await loadSummaryDraft(runDir, featureKey);

  if (publishMode === 'create_new') {
    return mergePlannerWithSummary(planner, summary);
  }

  if (publishMode === 'update_existing' && (target?.pageId || target?.pageUrl)) {
    const pageId = target.pageId || extractPageIdFromUrl(target.pageUrl);
    if (!pageId) {
      throw new Error('Unable to determine Confluence page ID for update_existing publish');
    }
    const currentPage = await readPageContent(pageId);
    if (!currentPage || !currentPage.trim()) {
      throw new Error(`Unable to read existing Confluence page content for page ${pageId}`);
    }
    return mergeExistingPageWithSummary(currentPage, summary);
  }

  return mergeFallbackContent(planner, summary);
}
