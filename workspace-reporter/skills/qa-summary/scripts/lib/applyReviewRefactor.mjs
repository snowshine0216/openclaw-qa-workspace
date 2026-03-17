#!/usr/bin/env node
/**
 * Apply structural refactors required by the Phase 4 review loop.
 */

import { readFile, writeFile } from 'node:fs/promises';

const SECTION_SPECS = [
  {
    number: 1,
    title: 'Feature Overview',
    kind: 'table',
    placeholder: [
      '| Field | Value |',
      '| --- | --- |',
      '| Feature | [PENDING — section not generated] |',
      '| Release | [PENDING — section not generated] |',
      '| QA Owner | [PENDING — section not generated] |',
      '| SE Design | [PENDING — section not generated] |',
      '| UX Design | [PENDING — section not generated] |',
    ].join('\n'),
  },
  {
    number: 2,
    title: 'Code Changes Summary',
    kind: 'table',
    placeholder: [
      '| Repository | PR | Type | Defects Fixed | Risk Level | Notes |',
      '| --- | --- | --- | --- | --- | --- |',
      '| — | — | — | — | — | [PENDING — section not generated] |',
    ].join('\n'),
  },
  {
    number: 3,
    title: 'Overall QA Status',
    kind: 'bullet',
    placeholder: '- [PENDING — section not generated]',
  },
  {
    number: 4,
    title: 'Defect Status Summary',
    kind: 'table',
    placeholder: [
      '| Status | P0 / Critical | P1 / High | P2 / Medium | P3 / Low | Total |',
      '| --- | --- | --- | --- | --- | --- |',
      '| Open | 0 | 0 | 0 | 0 | 0 |',
      '| Resolved | 0 | 0 | 0 | 0 | 0 |',
      '| Total | 0 | 0 | 0 | 0 | 0 |',
    ].join('\n'),
  },
  {
    number: 5,
    title: 'Resolved Defects Detail',
    kind: 'table',
    placeholder: [
      '| Defect ID | Summary | Priority | Resolution | Notes |',
      '| --- | --- | --- | --- | --- |',
      '| — | [PENDING — section not generated] | — | — | — |',
    ].join('\n'),
  },
  {
    number: 6,
    title: 'Test Coverage',
    kind: 'bullet',
    placeholder: '- [PENDING — section not generated]',
  },
  {
    number: 7,
    title: 'Performance',
    kind: 'bullet',
    placeholder: '- [PENDING — section not generated]',
  },
  {
    number: 8,
    title: 'Security / Compliance',
    kind: 'bullet',
    placeholder: '- [PENDING — section not generated]',
  },
  {
    number: 9,
    title: 'Regression Testing',
    kind: 'bullet',
    placeholder: '- [PENDING — section not generated]',
  },
  {
    number: 10,
    title: 'Automation Coverage',
    kind: 'bullet',
    placeholder: '- [PENDING — section not generated]',
  },
];

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function hasMarkdownTable(content) {
  const lines = content
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  for (let index = 0; index < lines.length - 1; index += 1) {
    if (lines[index].includes('|') && /^\|?[\s:-]+(?:\|[\s:-]+)+\|?$/.test(lines[index + 1])) {
      return true;
    }
  }
  return false;
}

function parseSections(markdown) {
  const topHeadingMatch = markdown.match(/^##[^\n]*QA Summary[^\n]*$/m);
  const topHeading = topHeadingMatch?.[0]?.trim() || '## 📊 QA Summary';
  const sectionPattern = /^###\s+(\d+)\.\s+(.+)$/gm;
  const matches = [...markdown.matchAll(sectionPattern)];
  const sections = new Map();

  for (let index = 0; index < matches.length; index += 1) {
    const match = matches[index];
    const start = match.index ?? 0;
    const end = index + 1 < matches.length ? matches[index + 1].index : markdown.length;
    const content = markdown.slice(start + match[0].length, end).trim();
    sections.set(Number(match[1]), { title: match[2].trim(), content });
  }

  return { topHeading, sections };
}

function reviewMentionsMissingSection(reviewMarkdown, spec) {
  const titlePattern = escapeRegex(spec.title);
  return (
    new RegExp(`Section\\s+${spec.number}\\b[^\\n]*missing`, 'i').test(reviewMarkdown) ||
    new RegExp(`missing[^\\n]*Section\\s+${spec.number}\\b`, 'i').test(reviewMarkdown) ||
    new RegExp(`missing[^\\n]*${titlePattern}`, 'i').test(reviewMarkdown)
  );
}

function reviewMentionsMissingTable(reviewMarkdown, spec) {
  return new RegExp(`Section\\s+${spec.number}\\b[^\\n]*missing[^\\n]*required table`, 'i')
    .test(reviewMarkdown);
}

function normalizeSection(spec, existing, reviewMarkdown) {
  const heading = `### ${spec.number}. ${spec.title}`;
  const fallback = spec.placeholder;
  const isMissing = !existing || reviewMentionsMissingSection(reviewMarkdown, spec);
  const needsTable = spec.kind === 'table' && reviewMentionsMissingTable(reviewMarkdown, spec);
  const currentContent = existing?.content?.trim() || '';

  if (isMissing) {
    return `${heading}\n${fallback}`.trim();
  }

  if (spec.kind === 'table' && (needsTable || !hasMarkdownTable(currentContent))) {
    return `${heading}\n${fallback}`.trim();
  }

  if (spec.kind === 'bullet' && !currentContent) {
    return `${heading}\n${fallback}`.trim();
  }

  return `${heading}\n${currentContent}`.trim();
}

export async function applyReviewRefactor({ draftPath, reviewPath }) {
  const [draft, review] = await Promise.all([
    readFile(draftPath, 'utf8'),
    readFile(reviewPath, 'utf8'),
  ]);
  const { topHeading, sections } = parseSections(draft);
  const normalizedSections = SECTION_SPECS.map((spec) =>
    normalizeSection(spec, sections.get(spec.number), review)
  );
  const normalizedDraft = `${topHeading}\n\n${normalizedSections.join('\n\n')}\n`;
  await writeFile(draftPath, normalizedDraft, 'utf8');
}
