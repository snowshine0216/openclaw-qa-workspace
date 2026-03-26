#!/usr/bin/env node
/**
 * Generates a Final Plan Summary report for Feishu notification and audit.
 * Format mirrors RCA Generation Complete: title, date, summary metrics, table, actions, output path.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function normalizeContent(content) {
  return String(content || '').replace(/\r\n/g, '\n');
}

function bulletIndent(line) {
  return (line.match(/^\s*/) || [''])[0].length;
}

function parsePlanStats(content) {
  const text = normalizeContent(content);
  const lines = text.split('\n');
  let p1Count = 0;
  let p2Count = 0;
  const byTopLayer = {};
  let currentTopLayer = '';

  for (const line of lines) {
    if (!/^\s*[-*] /.test(line)) continue;
    const indent = bulletIndent(line);
    const label = line.replace(/^\s*[-*]\s+/, '').trim();

    if (indent === 0) {
      currentTopLayer = label.replace(/\s*<P\d+>\s*$/i, '').trim();
      if (!byTopLayer[currentTopLayer]) byTopLayer[currentTopLayer] = 0;
    }

    if (/<P1>/i.test(line)) {
      p1Count += 1;
      if (currentTopLayer) byTopLayer[currentTopLayer] = (byTopLayer[currentTopLayer] || 0) + 1;
    }
    if (/<P2>/i.test(line)) {
      p2Count += 1;
      if (currentTopLayer) byTopLayer[currentTopLayer] = (byTopLayer[currentTopLayer] || 0) + 1;
    }
  }

  const totalScenarios = p1Count + p2Count;
  const sectionDistribution = Object.entries(byTopLayer)
    .filter(([, count]) => count > 0)
    .map(([section, count]) => `${section}: ${count}`)
    .join(', ');

  return {
    totalScenarios,
    p1Count,
    p2Count,
    byTopLayer,
    sectionDistribution,
  };
}

function truncateSummary(text, maxLen = 60) {
  const s = String(text || '').trim();
  if (s.length <= maxLen) return s;
  return s.slice(0, maxLen - 3) + '...';
}

/**
 * Generate the Final Plan Summary markdown report.
 * @param {Object} options
 * @param {string} options.featureId - Feature ID
 * @param {string} options.planContent - Content of qa_plan_final.md
 * @param {string} options.finalPath - Absolute path to qa_plan_final.md
 * @param {string} options.summaryPath - Output path for the summary (context/final_plan_summary_<feature-id>.md)
 * @param {string} [options.generatedAt] - ISO timestamp (default: now)
 * @returns {Promise<string>} Path to the written summary file
 */
export async function generateFinalPlanSummary({
  featureId,
  planContent,
  finalPath,
  summaryPath,
  generatedAt = new Date().toISOString(),
}) {
  const stats = parsePlanStats(planContent);
  const dateStr = new Date(generatedAt).toUTCString().replace(' GMT', ' UTC');
  const centralTopic = planContent.split('\n')[0]?.trim() || featureId;
  const summaryShort = truncateSummary(centralTopic);

  const sectionRows = Object.entries(stats.byTopLayer)
    .filter(([, count]) => count > 0)
    .map(([section, count]) => `| ${section} | ${count} |`)
    .join('\n');

  const report = `# Final Plan Summary Complete

**Date:** ${dateStr}

## Summary

| Metric | Value |
|--------|-------|
| Plans Processed | 1 |
| Total Scenarios | ${stats.totalScenarios} |
| P1 | ${stats.p1Count} |
| P2 | ${stats.p2Count} |

## Plan Details

| Feature ID | Summary | Scenarios | P1/P2 | Status |
|------------|---------|-----------|-------|--------|
| ${featureId} | ${summaryShort} | ${stats.totalScenarios} | ${stats.p1Count}/${stats.p2Count} | **Generated** |

## Section Distribution

| Top Layer | Count |
|-----------|-------|
${sectionRows || '| (none) | 0 |'}

## Actions Completed

- **Generated 1 QA plan document**
- **Plan file saved to:** \`${finalPath}\`

---

*Generated: ${dateStr}*
*By: QA Plan Orchestrator*
`;

  await writeFile(summaryPath, report, 'utf8');
  return summaryPath;
}

/**
 * Generate summary from a run directory (reads qa_plan_final.md).
 * @param {string} featureId
 * @param {string} runDir - Absolute path to runs/<feature-id>
 * @returns {Promise<string>} Path to the written summary file
 */
export async function generateFinalPlanSummaryFromRunDir(featureId, runDir) {
  const finalPath = join(runDir, 'qa_plan_final.md');
  const summaryPath = join(runDir, 'context', `final_plan_summary_${featureId}.md`);
  const planContent = await readFile(finalPath, 'utf8');
  return generateFinalPlanSummary({
    featureId,
    planContent,
    finalPath,
    summaryPath,
  });
}
