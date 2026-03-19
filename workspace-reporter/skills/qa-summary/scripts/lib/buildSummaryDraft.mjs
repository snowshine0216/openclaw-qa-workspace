#!/usr/bin/env node
/**
 * Build QA Summary draft from planner context and defect summary.
 */

import { normalizeRiskLevel, strongerRisk } from './riskLevels.mjs';
import { extractBackgroundSolutionSeed } from './extractBackgroundSolution.mjs';

const OPEN_STATUSES = new Set(['Open', 'In Progress', 'To Do', 'In Review']);
const RESOLVED_STATUSES = new Set(['Resolved', 'Closed', 'Done']);
const GITHUB_PR_URL_PATTERN = /https:\/\/github\.com\/[^\s)]+\/pull\/\d+/g;
const TEST_COVERAGE_SECTIONS = [
  'endtoend',
  'core functional flows',
  'error handling recovery',
  'compatibility platform environment',
  'compatibility',
  'platform',
  'i18n',
  'accessibility',
];
const PERFORMANCE_SECTIONS = [
  'observability performance ux feedback',
  'performance resilience',
  'performance',
];
const SECURITY_SECTIONS = [
  'permissions security data safety',
  'security',
];
const REGRESSION_SECTIONS = [
  'regression known risks',
  'regression',
];

function normalizePriorityBucket(priority) {
  const normalized = String(priority || '').trim().toUpperCase();
  if (['P0', 'CRITICAL', 'HIGHEST', 'BLOCKER'].includes(normalized)) return 'p0';
  if (['P1', 'HIGH'].includes(normalized)) return 'p1';
  if (['P3', 'LOW', 'LOWEST', 'MINOR'].includes(normalized)) return 'p3';
  return 'p2';
}

function classifyStatusBucket(status) {
  const normalized = String(status || '').trim();
  if (OPEN_STATUSES.has(normalized)) return 'open';
  if (RESOLVED_STATUSES.has(normalized)) return 'resolved';
  return null;
}

function createPriorityCounts() {
  return { p0: 0, p1: 0, p2: 0, p3: 0, total: 0 };
}

function isOpenDefect(defect) {
  return classifyStatusBucket(defect?.status) === 'open';
}

function isResolvedDefect(defect) {
  return classifyStatusBucket(defect?.status) === 'resolved';
}

function escapeTableCell(value) {
  const text = String(value ?? '').trim();
  if (!text) return '—';
  return text.replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
}

function formatDefectLink(defect) {
  if (!defect?.key) return '—';
  return `[${defect.key}](${defect.url || '#'})`;
}

function buildOpenDefectNotes(defect) {
  if (defect?.notes) return defect.notes;
  if (defect?.linkedPrs?.length) return `Linked PRs: ${defect.linkedPrs.join(', ')}`;
  return '—';
}

function normalizePlannerLabel(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function cleanPlannerBullet(value) {
  return String(value || '')
    .replace(/\s*<P\d>\s*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parsePlannerBullets(markdown) {
  const sections = new Map();
  let currentSection = null;
  for (const line of String(markdown || '').split(/\r?\n/)) {
    const topLevel = line.match(/^- (.+)$/);
    if (topLevel) {
      currentSection = cleanPlannerBullet(topLevel[1]);
      if (currentSection) sections.set(currentSection, []);
      continue;
    }

    if (!currentSection) continue;
    const nested = line.match(/^\s*\*\s+(.+)$/);
    if (nested) {
      sections.get(currentSection)?.push(cleanPlannerBullet(nested[1]));
    }
  }
  return sections;
}

function extractPlannerHeadingSection(markdown, aliases) {
  const normalizedAliases = new Set(aliases.map(normalizePlannerLabel));
  const lines = String(markdown || '').split(/\r?\n/);
  let currentHeading = null;
  const entries = [];
  for (const line of lines) {
    const heading = line.match(/^#{2,3}\s+(.+)$/);
    if (heading) {
      currentHeading = normalizedAliases.has(normalizePlannerLabel(heading[1]))
        ? heading[1]
        : null;
      continue;
    }
    if (!currentHeading) continue;
    const bullet = line.match(/^\s*[-*]\s+(.+)$/);
    if (bullet) entries.push(cleanPlannerBullet(bullet[1]));
  }
  return entries;
}

function findPlannerEntries(sections, aliases, markdown) {
  const matched = [];
  const normalizedAliases = new Set(aliases.map(normalizePlannerLabel));
  for (const [title, entries] of sections.entries()) {
    if (normalizedAliases.has(normalizePlannerLabel(title))) {
      matched.push({ title, entries });
    }
  }

  if (matched.length > 0) return matched;
  const fallbackEntries = extractPlannerHeadingSection(markdown, aliases);
  return fallbackEntries.length > 0 ? [{ title: aliases[0], entries: fallbackEntries }] : [];
}

function normalizePlannerEvidence(plannerContext) {
  const markdown = [
    plannerContext?.planMarkdown,
    plannerContext?.summaryMarkdown,
    plannerContext?.seedMarkdown,
    plannerContext?.backgroundSolutionSeed,
  ]
    .filter(Boolean)
    .join('\n');
  const sections = parsePlannerBullets(markdown);
  return {
    markdown,
    testCoverage: findPlannerEntries(sections, TEST_COVERAGE_SECTIONS, markdown),
    performance: findPlannerEntries(sections, PERFORMANCE_SECTIONS, markdown),
    security: findPlannerEntries(sections, SECURITY_SECTIONS, markdown),
    regression: findPlannerEntries(sections, REGRESSION_SECTIONS, markdown),
  };
}

function firstPlannerEntry(groups, preferredLabel) {
  const preferred = groups.find((group) => normalizePlannerLabel(group.title) === preferredLabel);
  return preferred?.entries?.[0] || groups.find((group) => group.entries.length > 0)?.entries?.[0];
}

function collectOpenDefectKeys(defectSummary) {
  return (defectSummary?.defects ?? []).filter(isOpenDefect).map((defect) => defect.key).filter(Boolean);
}

function highestOpenDefectRisk(defectSummary) {
  let strongest = null;
  for (const defect of defectSummary?.defects ?? []) {
    if (!isOpenDefect(defect)) continue;
    const bucket = normalizePriorityBucket(defect.priority);
    const risk = bucket === 'p0' || bucket === 'p1' ? 'HIGH' : 'MEDIUM';
    strongest = strongerRisk(strongest, risk);
  }
  return strongest;
}

function highestPrRisk(defectSummary) {
  return (defectSummary?.prs ?? [])
    .filter((pr) => pr.sourceKind === 'defect_fix')
    .reduce((strongest, pr) => strongerRisk(strongest, pr.riskLevel), null);
}

function extractPlannerRisk(plannerEvidence) {
  const text = [
    ...plannerEvidence.performance.flatMap((group) => group.entries),
    ...plannerEvidence.security.flatMap((group) => group.entries),
    ...plannerEvidence.regression.flatMap((group) => group.entries),
  ].join('\n');
  const directMatch = text.match(/\b(CRITICAL|HIGH|MEDIUM|LOW)\b/i);
  if (directMatch) return normalizeRiskLevel(directMatch[1], null);
  if (/\<P0\>|\<P1\>/i.test(plannerEvidence.markdown || '')) return 'MEDIUM';
  return null;
}

function deriveOverallRisk(defectSummary, plannerEvidence) {
  if ((defectSummary?.totalDefects ?? 0) === 0 && (defectSummary?.prs ?? []).length === 0) {
    return strongerRisk(defectSummary?.analysisRiskLevel, extractPlannerRisk(plannerEvidence)) || 'LOW';
  }

  return (
    strongerRisk(
      strongerRisk(defectSummary?.analysisRiskLevel, highestOpenDefectRisk(defectSummary)),
      strongerRisk(highestPrRisk(defectSummary), extractPlannerRisk(plannerEvidence))
    ) || 'LOW'
  );
}

function releaseRecommendation(riskLevel) {
  if (riskLevel === 'HIGH') return 'Hold release pending focused QA review.';
  if (riskLevel === 'MEDIUM') return 'Release only with targeted regression coverage and monitoring.';
  return 'Proceed with standard validation.';
}

function summarizeDefectBuckets(defects) {
  const summary = {
    open: createPriorityCounts(),
    resolved: createPriorityCounts(),
  };

  for (const defect of defects ?? []) {
    const statusBucket = classifyStatusBucket(defect.status);
    if (!statusBucket) continue;
    const priorityBucket = normalizePriorityBucket(defect.priority);
    summary[statusBucket][priorityBucket] += 1;
    summary[statusBucket].total += 1;
  }

  return summary;
}

function feedbackSummary(feedback) {
  return String(feedback || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .join(' ');
}

function parseGithubPr(url) {
  const match = String(url || '').match(/github\.com\/([^/]+\/[^/]+)\/pull\/(\d+)/);
  if (!match) return null;
  return {
    url,
    repository: match[1],
    number: Number.parseInt(match[2], 10),
  };
}

function extractApprovalFeedbackPrs(feedback) {
  const note = feedbackSummary(feedback);
  const urls = [...new Set(String(feedback || '').match(GITHUB_PR_URL_PATTERN) ?? [])];
  return urls
    .map((url) => {
      const parsed = parseGithubPr(url);
      if (!parsed) return null;
      return {
        ...parsed,
        sourceKind: 'feature_change',
        linkedDefectKeys: [],
        riskLevel: 'LOW',
        notes: note ? `Added from approval feedback: ${note}` : 'Added from approval feedback.',
      };
    })
    .filter(Boolean);
}

function mergeApprovalFeedbackPrs(prs, feedback) {
  const byUrl = new Map((prs ?? []).filter(Boolean).map((pr) => [pr.url, pr]));
  for (const pr of extractApprovalFeedbackPrs(feedback)) {
    if (!byUrl.has(pr.url)) byUrl.set(pr.url, pr);
  }
  return Array.from(byUrl.values());
}

function extractApprovalRiskOverride(feedback) {
  const directMatch = String(feedback || '').match(
    /\b(?:risk(?: level)?|overall risk)[^.\n]*\b(CRITICAL|HIGH|MEDIUM|LOW)\b/i
  );
  return normalizeRiskLevel(directMatch?.[1], null);
}

function approvalReleaseRecommendation(feedback) {
  const normalized = String(feedback || '').toLowerCase();
  if (normalized.includes('hold release') || normalized.includes('do not release')) {
    return 'Hold release pending approval revisions.';
  }
  if (normalized.includes('targeted regression') || normalized.includes('extra monitoring')) {
    return 'Release only with targeted regression coverage and monitoring.';
  }
  if (normalized.includes('standard validation')) {
    return 'Proceed with standard validation.';
  }
  return null;
}

function approvalFeedbackBullets(feedback) {
  const summary = feedbackSummary(feedback);
  return summary ? [`Approval feedback addressed: ${summary}`] : [];
}

function formatLinkedDefectKeys(linkedDefectKeys, defects) {
  const defectIndex = new Map((defects ?? []).map((defect) => [defect.key, defect.url]));
  const links = (linkedDefectKeys ?? [])
    .filter(Boolean)
    .map((key) => {
      const url = defectIndex.get(key);
      return url ? `[${key}](${url})` : key;
    });
  return links.join(', ') || '—';
}

/**
 * Extract "Out of Scope" mentions from planner markdown for a given topic.
 */
function extractOutOfScopeJustification(markdown, topicPattern) {
  const lines = String(markdown || '').split(/\r?\n/);
  let inOutOfScope = false;
  for (const line of lines) {
    if (/out of scope\s*[/\-–]?\s*assumptions/i.test(line)) {
      inOutOfScope = true;
      continue;
    }
    if (inOutOfScope) {
      const bullet = line.match(/^\s*\*\s+(.+)$/);
      if (bullet && topicPattern.test(bullet[1])) {
        return bullet[1].replace(/\s*<P\d>\s*$/i, '').trim();
      }
      // Also check inline bullet format
      const inlineBullet = line.match(/^[-*]\s+(.+)$/);
      if (inlineBullet && topicPattern.test(inlineBullet[1])) {
        return inlineBullet[1].replace(/\s*<P\d>\s*$/i, '').trim();
      }
      if (line.trim() && /^#{1,4}\s/.test(line)) inOutOfScope = false;
    }
  }
  return null;
}

export function buildBackgroundSolution(plannerContext) {
  // Prefer structured JSON data extracted during Phase 1 (avoids re-parsing and duplication).
  // Fall back to re-extracting from raw seed text or full plan markdown.
  const seed = plannerContext?.backgroundSolutionData
    || extractBackgroundSolutionSeed(
        [
          plannerContext?.backgroundSolutionSeed,
          plannerContext?.planMarkdown,
          plannerContext?.summaryMarkdown,
          plannerContext?.seedMarkdown,
        ].filter(Boolean).join('\n\n') || ''
      );

  const header = '### 2. Background & Solution\n';

  const hasContent = seed.backgroundText || seed.problemText || seed.solutionText || seed.outOfScopeText;
  if (!hasContent) {
    return `${header}\n- [PENDING — No background or solution context found in planner artifacts. Please provide manually.]\n`;
  }

  const bullets = [];

  if (seed.backgroundText) {
    bullets.push(`**Background:** ${seed.backgroundText}`);
  }
  if (seed.problemText && seed.problemText !== seed.backgroundText) {
    bullets.push(`**Problem:** ${seed.problemText}`);
  }
  if (seed.solutionText) {
    bullets.push(`**Solution:** ${seed.solutionText}`);
  }
  if (seed.outOfScopeText) {
    const outLines = seed.outOfScopeText.split('\n').filter(Boolean);
    for (const line of outLines) {
      bullets.push(`**Out of Scope:** ${line.replace(/^-\s*/, '')}`);
    }
  }

  if (bullets.length === 0) {
    return `${header}\n- [PENDING — No background or solution context found in planner artifacts. Please provide manually.]\n`;
  }

  return `${header}\n${bullets.map((b) => `- ${b}`).join('\n')}\n`;
}

function buildCodeChangesTable(prs, defects) {
  const header = '### 3. Code Changes Summary\n';
  const tableHeader = '| Repository | PR | Type | Defects Fixed | Risk Level | Notes |';
  const tableSep = '| --- | --- | --- | --- | --- | --- |';
  if (!prs || prs.length === 0) {
    return `${header}${tableHeader}\n${tableSep}\n| — | — | — | — | — | No GitHub PRs were identified. |\n`;
  }
  const rows = prs.map((pr) => {
    const type = pr.sourceKind === 'defect_fix' ? 'Defect Fix' : 'Feature PR';
    const defectsFixed = formatLinkedDefectKeys(pr.linkedDefectKeys, defects);
    const risk = pr.riskLevel ?? 'LOW';
    const notes = pr.notes ?? '';
    const prLink = pr.url ? `[#${pr.number}](${pr.url})` : `#${pr.number}`;
    return `| ${pr.repository ?? '—'} | ${prLink} | ${type} | ${defectsFixed} | ${risk} | ${notes} |`;
  });
  return `${header}${tableHeader}\n${tableSep}\n${rows.join('\n')}\n`;
}

function buildOverallStatus(defectSummary, plannerEvidence, approvalFeedback) {
  const s = defectSummary ?? {};
  const total = s.totalDefects ?? 0;
  const open = s.openDefects ?? 0;
  const resolved = s.resolvedDefects ?? 0;
  const header = '### 4. Overall QA Status\n';
  const risk = extractApprovalRiskOverride(approvalFeedback) || deriveOverallRisk(s, plannerEvidence);
  const recommendation = approvalReleaseRecommendation(approvalFeedback) || releaseRecommendation(risk);
  const bullets = approvalFeedbackBullets(approvalFeedback);
  if (total === 0) {
    const riskExplanation =
      risk !== 'LOW' && risk !== null
        ? `- Note: Risk elevated to ${risk} due to incomplete QA coverage (QA testing not yet commenced), not open defects.\n`
        : '';
    return `${header}- Overall risk: ${risk}\n- Total defects: 0\n- Open defects: 0\n- Resolved: 0\n- No feature defects were found in the chosen defect-analysis scope.\n${riskExplanation}- Release recommendation: ${recommendation}\n${bullets.map((bullet) => `- ${bullet}\n`).join('')}`;
  }
  return `${header}- Overall risk: ${risk}\n- Total defects: ${total}\n- Open defects: ${open}\n- Resolved: ${resolved}\n- Release recommendation: ${recommendation}\n${bullets.map((bullet) => `- ${bullet}\n`).join('')}`;
}

function buildDefectStatusTable(defectSummary) {
  const s = defectSummary ?? {};
  const buckets = summarizeDefectBuckets(s.defects);
  const open = buckets.open;
  const resolved = buckets.resolved;
  const total = {
    p0: open.p0 + resolved.p0,
    p1: open.p1 + resolved.p1,
    p2: open.p2 + resolved.p2,
    p3: open.p3 + resolved.p3,
    total: open.total + resolved.total,
  };
  const header = '### 5. Defect Status Summary\n';
  const tableHeader = '| Status | P0 / Critical | P1 / High | P2 / Medium | P3 / Low | Total |';
  const tableSep = '| --- | --- | --- | --- | --- | --- |';
  const rows = [
    `| Open | ${open.p0} | ${open.p1} | ${open.p2} | ${open.p3} | ${open.total} |`,
    `| Resolved | ${resolved.p0} | ${resolved.p1} | ${resolved.p2} | ${resolved.p3} | ${resolved.total} |`,
    `| Total | ${total.p0} | ${total.p1} | ${total.p2} | ${total.p3} | ${total.total} |`,
  ];
  const openDefects = (s.defects ?? []).filter(isOpenDefect);
  const openHeader = '\n#### Currently Open Defects\n';
  const openTableHeader = '| Defect ID | Summary | Status | Priority | Notes |';
  const openTableSep = '| --- | --- | --- | --- | --- |';
  const openRows =
    openDefects.length > 0
      ? openDefects.map(
          (defect) =>
            `| ${formatDefectLink(defect)} | ${escapeTableCell(defect.summary)} | ${escapeTableCell(defect.status)} | ${escapeTableCell(defect.priority)} | ${escapeTableCell(buildOpenDefectNotes(defect))} |`
        )
      : ['| — | No currently open defects. | — | — | — |'];
  return `${header}${tableHeader}\n${tableSep}\n${rows.join('\n')}${openHeader}${openTableHeader}\n${openTableSep}\n${openRows.join('\n')}\n`;
}

function buildResolvedDefects(defectSummary) {
  const s = defectSummary ?? {};
  const defects = s.defects ?? [];
  const resolvedDefects = defects.filter(isResolvedDefect);
  const resolved = resolvedDefects.filter((d) =>
    ['p0', 'p1'].includes(normalizePriorityBucket(d.priority))
  );
  const header = '### 6. Resolved Defects Detail\n';
  const tableHeader = '| Defect ID | Summary | Priority | Resolution | Notes |';
  const tableSep = '| --- | --- | --- | --- | --- |';
  const omittedCount = resolvedDefects.filter(
    (d) => !['p0', 'p1'].includes(normalizePriorityBucket(d.priority))
  ).length;
  const omittedTail =
    omittedCount > 0
      ? `\n${omittedCount} additional resolved defects (P2/P3) not shown.\n`
      : '\n';

  if (resolved.length === 0) {
    return `${header}${tableHeader}\n${tableSep}\n| — | No defect-fixing changes were identified. | — | — | — |${omittedTail}`;
  }
  const rows = resolved.map((d) =>
    `| ${formatDefectLink(d)} | ${escapeTableCell(d.summary)} | ${escapeTableCell(d.priority)} | ${escapeTableCell(d.resolution)} | — |`
  );
  return `${header}${tableHeader}\n${tableSep}\n${rows.join('\n')}${omittedTail}`;
}

function renderBulletSection(title, bullets, pendingText) {
  const safeBullets = bullets.filter(Boolean);
  if (safeBullets.length === 0) {
    return `### ${title}\n\n- ${pendingText}\n`;
  }
  return `### ${title}\n\n${safeBullets.map((bullet) => `- ${bullet}`).join('\n')}\n`;
}

function buildTestCoverage(plannerEvidence, defectSummary) {
  const endToEnd = firstPlannerEntry(plannerEvidence.testCoverage, 'endtoend');
  const coreFlows = firstPlannerEntry(plannerEvidence.testCoverage, 'core functional flows');
  const openKeys = collectOpenDefectKeys(defectSummary);
  return renderBulletSection(
    '7. Test Coverage',
    [
      endToEnd ? `EndToEnd coverage includes: ${endToEnd}.` : null,
      coreFlows ? `Core functional coverage includes: ${coreFlows}.` : null,
      openKeys.length > 0 ? `Defect-driven retest focus: ${openKeys.join(', ')}.` : null,
    ],
    '[PENDING — Test coverage data from planner and defect context.]'
  );
}

function buildPerformance(plannerEvidence) {
  const entries = plannerEvidence.performance.map((group) => group.entries[0]).filter(Boolean);

  if (entries.length > 0) {
    return renderBulletSection('8. Performance', entries, '');
  }

  // Check Out of Scope for performance/i18n/accessibility/resilience not applicable
  const outOfScopeJustification = extractOutOfScopeJustification(
    plannerEvidence.markdown,
    /performance|i18n|accessibility|resilience/i
  );

  if (outOfScopeJustification) {
    return `### 8. Performance\n\n- Not applicable: ${outOfScopeJustification}\n`;
  }

  return renderBulletSection(
    '8. Performance',
    [],
    '[PENDING — No performance scenarios found in QA plan. Add execution results or confirm not applicable.]'
  );
}

function buildSecurity(plannerEvidence, defectSummary) {
  const openKeys = collectOpenDefectKeys(defectSummary);
  const securityEntries = plannerEvidence.security.map((group) => group.entries[0]).filter(Boolean);

  if (securityEntries.length > 0) {
    const bullets = [
      '⚠️ Draft — Planned coverage, not yet executed:',
      ...securityEntries,
      openKeys.length > 0 ? `Open-defect validation includes permission and data-safety checks for ${openKeys.join(', ')}.` : null,
    ].filter(Boolean);
    return renderBulletSection('9. Security / Compliance', bullets, '');
  }

  // No security entries, no open defects, no security section in planner
  if (openKeys.length === 0 && plannerEvidence.security.length === 0) {
    return `### 9. Security / Compliance\n\n- Not applicable: Feature involves privilege/UI changes only; no authentication, data access, or compliance scope identified in QA plan.\n`;
  }

  return renderBulletSection(
    '9. Security / Compliance',
    [
      openKeys.length > 0 ? `Open-defect validation includes permission and data-safety checks for ${openKeys.join(', ')}.` : null,
    ],
    '[PENDING — No security or compliance data available.]'
  );
}

function buildRegression(plannerEvidence, defectSummary) {
  const openKeys = collectOpenDefectKeys(defectSummary);
  const regressionEntries = plannerEvidence.regression.map((group) => group.entries[0]).filter(Boolean);

  if (regressionEntries.length > 0) {
    const bullets = [
      '⚠️ Draft — Planned regression scenarios, not yet executed:',
      ...regressionEntries,
      openKeys.length > 0 ? `Open defects requiring regression validation: ${openKeys.join(', ')}.` : null,
    ].filter(Boolean);
    return renderBulletSection('10. Regression Testing', bullets, '');
  }

  return renderBulletSection(
    '10. Regression Testing',
    [
      openKeys.length > 0 ? `Open defects requiring regression validation: ${openKeys.join(', ')}.` : null,
    ],
    '[PENDING — Regression execution evidence was not provided.]'
  );
}

function buildAutomationCoverage(plannerEvidence, defectSummary) {
  const highRiskPrs = (defectSummary?.prs ?? [])
    .filter((pr) => pr.sourceKind === 'defect_fix')
    .filter((pr) => normalizeRiskLevel(pr.riskLevel, 'LOW') === 'HIGH');
  const openKeys = collectOpenDefectKeys(defectSummary);
  const endToEndEntry = firstPlannerEntry(plannerEvidence.testCoverage, 'endtoend');

  const bullets = [
    openKeys.length > 0 ? `Defect-driven automation priority: ${openKeys.join(', ')}.` : null,
    highRiskPrs.length > 0
      ? `High-risk fix coverage target: ${highRiskPrs.map((pr) => `#${pr.number}`).join(', ')}.`
      : null,
    endToEndEntry
      ? `Automation should prioritize the planner-owned EndToEnd path first.`
      : null,
  ].filter(Boolean);

  // Add planned automation targets if endtoend coverage entries exist
  const endToEndEntries = plannerEvidence.testCoverage
    .filter((g) => normalizePlannerLabel(g.title) === 'endtoend')
    .flatMap((g) => g.entries);

  if (endToEndEntries.length > 0) {
    const automationBullets = [
      ...bullets,
      '⚠️ Draft — Planned automation targets, not yet confirmed.',
      ...endToEndEntries.map((e) => `${e} — P1 — Automation candidate (E2E)`),
    ].filter(Boolean);
    return renderBulletSection('11. Automation Coverage', automationBullets, '');
  }

  return renderBulletSection(
    '11. Automation Coverage',
    bullets,
    '[PENDING — Automation coverage data is not available.]'
  );
}

export async function buildSummaryDraft({
  featureKey,
  plannerContext,
  featureOverviewTable,
  defectSummary,
  approvalFeedback = '',
}) {
  const prs = mergeApprovalFeedbackPrs(defectSummary?.prs, approvalFeedback);
  const plannerEvidence = normalizePlannerEvidence(plannerContext);
  const sections = [
    featureOverviewTable.trim(),
    buildBackgroundSolution(plannerContext),
    buildCodeChangesTable(prs, defectSummary?.defects),
    buildOverallStatus(defectSummary, plannerEvidence, approvalFeedback),
    buildDefectStatusTable(defectSummary),
    buildResolvedDefects(defectSummary),
    buildTestCoverage(plannerEvidence, defectSummary),
    buildPerformance(plannerEvidence),
    buildSecurity(plannerEvidence, defectSummary),
    buildRegression(plannerEvidence, defectSummary),
    buildAutomationCoverage(plannerEvidence, defectSummary),
  ];

  const markdown = ['## 📊 QA Summary', '', ...sections].join('\n');

  return {
    markdown,
    metadata: {
      featureKey,
      generatedAt: new Date().toISOString(),
      approvalFeedbackApplied: Boolean(feedbackSummary(approvalFeedback)),
      sectionsPresent: 11,
    },
  };
}
