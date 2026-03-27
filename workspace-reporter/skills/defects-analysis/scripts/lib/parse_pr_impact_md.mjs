#!/usr/bin/env node

function cleanValue(value) {
  return String(value ?? '')
    .replace(/\r/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractTableValue(content, fieldName) {
  const pattern = new RegExp(
    `^\\|\\s*\\*{0,2}${fieldName}\\*{0,2}\\s*\\|\\s*(.*?)\\s*\\|$`,
    'im',
  );
  return cleanValue(content.match(pattern)?.[1] ?? '');
}

function extractLinkedJira(content) {
  const matches = content.matchAll(/\[([A-Z]+-\d+)\]\([^)]+\)/g);
  return [...new Set([...matches].map((match) => match[1]))];
}

function extractRiskNote(content) {
  const sectionPattern = /(?:^|\n)##\s*(Description|Summary|Risk)\s*\n([\s\S]*?)(?=\n##\s|\n#\s|$)/gi;
  for (const match of content.matchAll(sectionPattern)) {
    const paragraphs = match[2]
      .split(/\n\s*\n/)
      .map(cleanValue)
      .filter((paragraph) => paragraph.length > 20);
    if (paragraphs.length > 0) {
      return paragraphs[0];
    }
  }
  return '';
}

function normalizeRiskLevel(content) {
  if (/high.{0,20}risk|risk.{0,20}high|critical|p0/i.test(content)) {
    return 'HIGH';
  }
  if (/low.{0,20}risk|risk.{0,20}low/i.test(content)) {
    return 'LOW';
  }
  return 'MEDIUM';
}

function extractTitle(markdown) {
  // Format 1 (new): | **Title** | <title text> |
  const tableTitle = extractTableValue(markdown, 'Title');
  if (tableTitle) return tableTitle;
  // Format 2 (old): ## PR Title\n**<title>**  or  ## PR Title\n<title>
  const sectionMatch = markdown.match(/^##\s+PR Title\s*\n\*{0,2}([^\n*]+)\*{0,2}/im);
  if (sectionMatch) return cleanValue(sectionMatch[1]);
  return '';
}

function extractMergedAt(markdown) {
  // Format 1 (new): | Merged At | 2026-03-23T... |
  const tableVal = extractTableValue(markdown, 'Merged At');
  if (tableVal) return tableVal;
  // Format 2 (old): **Merged:** 2026-03-23  or  Merged At: 2026-03-23
  const inlineMatch = markdown.match(/\bmerged(?:\s+at)?[:\s]+([0-9]{4}-[0-9]{2}-[0-9]{2})/i);
  if (inlineMatch) return inlineMatch[1];
  return '';
}

export function parsePrImpactMd(content) {
  if (!content || !String(content).trim()) {
    return {};
  }

  const markdown = String(content);
  // Support both "PR Impact Analysis: #22621" and "PR Impact Analysis: PR #22621"
  const headingNumber = markdown.match(/^#\s*PR Impact Analysis:.*?#(\d+)\s*$/im)?.[1];
  const urlMatch = markdown.match(/github\.com\/([^/\s]+\/[^/\s]+)\/pull\/(\d+)/i);
  const title = extractTitle(markdown);
  const mergedAt = extractMergedAt(markdown);
  const riskNote = extractRiskNote(markdown);

  return {
    number: headingNumber ? Number(headingNumber) : urlMatch?.[2] ? Number(urlMatch[2]) : undefined,
    repository: urlMatch?.[1],
    title: title || undefined,
    linked_jira: extractLinkedJira(markdown),
    merged_at: mergedAt ? mergedAt.slice(0, 10) : undefined,
    risk_note: riskNote || undefined,
    risk_level: normalizeRiskLevel(markdown),
  };
}
