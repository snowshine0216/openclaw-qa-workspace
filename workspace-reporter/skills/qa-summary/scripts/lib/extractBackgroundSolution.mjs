#!/usr/bin/env node
/**
 * Extract background/solution seed from planner design markdown.
 *
 * Priority source order (caller provides combined text):
 *   1. confluence_design_<KEY>.md  — richest: has Introduction + Design sections
 *   2. deep_research_synthesis_<KEY>.md — has rationale narrative
 *   3. qa_plan_final.md / seedMarkdown — fallback
 */

const INTRO_HEADING_PATTERN =
  /^#{1,4}\s+(?:\d+[\.\d]*\s+)?(?:Introduction|Background|Purpose|Requirements)\b/i;
const DESIGN_HEADING_PATTERN =
  /^#{1,4}\s+(?:\d+[\.\d]*\s+)?(?:Design|Solution|Changes|Implementation)\b/i;
const SCOPE_HEADING_PATTERN =
  /^#{1,4}\s+(?:[\d.]+\s+)?(?:Design Assumptions|Scope|Out of Scope|Assumptions)\b/i;
const SECTION_HEADING_PATTERN = /^#{1,4}\s+/;

function stripMarkdown(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^[-*]\s+/, '')
    .replace(/\s*<P\d>\s*$/i, '')
    .trim();
}

function extractSectionLines(lines, startIndex) {
  const content = [];
  for (let i = startIndex + 1; i < lines.length; i++) {
    const line = lines[i];
    if (SECTION_HEADING_PATTERN.test(line)) break;
    const trimmed = line.trim();
    if (trimmed) content.push(trimmed);
  }
  return content;
}

function extractFirstSentences(text, maxSentences = 2) {
  const sentences = text.split(/(?<=[.!?])\s+/);
  return sentences.slice(0, maxSentences).join(' ').trim();
}

function deduplicate(arr) {
  const seen = new Set();
  return arr.filter((item) => {
    const key = item.trim().toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Extract background/solution seed from planner markdown.
 * @param {string} markdown - Combined text from confluence_design + deep_research_synthesis
 * @returns {{ backgroundText: string, problemText: string, solutionText: string, outOfScopeText: string, raw: string }}
 */
export function extractBackgroundSolutionSeed(markdown) {
  const lines = String(markdown || '').split(/\r?\n/);

  let introLines = [];
  let designLines = [];
  let scopeLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (INTRO_HEADING_PATTERN.test(line) && introLines.length === 0) {
      introLines = extractSectionLines(lines, i);
      continue;
    }

    if (DESIGN_HEADING_PATTERN.test(line) && designLines.length === 0) {
      // Only capture first design section to avoid lengthy tables
      const raw = extractSectionLines(lines, i);
      // Take only prose lines (skip table rows and deep nested bullets)
      designLines = raw.filter(
        (l) => !/^\|/.test(l) && !/^#{1,4}/.test(l)
      );
      continue;
    }

    if (SCOPE_HEADING_PATTERN.test(line) && scopeLines.length === 0) {
      scopeLines = extractSectionLines(lines, i);
      continue;
    }
  }

  // Also check for QA-plan inline "Out of Scope / Assumptions" bullet list pattern
  // (used in qa_plan_final.md format)
  let qaPlanOutOfScope = [];
  if (scopeLines.length === 0) {
    for (let i = 0; i < lines.length; i++) {
      if (/^-\s+out of scope\s*\/?\s*assumptions/i.test(lines[i])) {
        for (let j = i + 1; j < lines.length; j++) {
          const sub = lines[j].match(/^\s{4,}\*\s+(.+)$/);
          if (sub) {
            qaPlanOutOfScope.push(sub[1].replace(/\s*<P\d>\s*$/i, '').trim());
          } else if (lines[j].trim() && /^-\s/.test(lines[j])) {
            break; // next top-level section
          }
        }
        break;
      }
    }
  }

  // Build background text from intro section (prose only, not bullet lists)
  const introProse = introLines
    .filter((l) => !/^[-*#|]/.test(l))
    .map(stripMarkdown)
    .filter(Boolean)
    .join(' ');
  const backgroundText = introProse ? extractFirstSentences(introProse, 2) : '';

  // Build problem text: first bullet under intro or first sentence
  const introBullets = introLines
    .filter((l) => /^[-*]\s/.test(l))
    .map(stripMarkdown)
    .filter(Boolean);
  const problemText = introBullets[0] || backgroundText;

  // Build solution text: prefer design-scope bullets (the "what changed" description),
  // then fall back to first prose from the Design section.
  const designBullets = scopeLines
    .filter((l) => /^[-*]\s/.test(l))
    .map(stripMarkdown)
    .filter(Boolean);
  // Design prose (prose lines from the ## 2. Design section)
  const designProse = designLines
    .filter((l) => !/^[-*#|]/.test(l))
    .map(stripMarkdown)
    .filter(Boolean)
    .join(' ');
  const solutionText = designBullets.length > 0
    ? designBullets.slice(0, 2).join('; ')
    : (designProse ? extractFirstSentences(designProse, 1) : '');

  // Collect out-of-scope items: only bullets that contain explicit exclusion language
  // (do not, not applicable, excluded, unchanged, no change, etc.)
  const EXCLUSION_PATTERN = /\b(do not|not change|no change|unchanged|excluded|not applicable|not in scope|out of scope)\b/i;
  const rawOutOfScope = scopeLines.length > 0
    ? scopeLines.filter((l) => /^[-*]\s/.test(l)).map(stripMarkdown).filter(Boolean).filter((l) => EXCLUSION_PATTERN.test(l))
    : qaPlanOutOfScope.map(stripMarkdown).filter(Boolean);
  const outOfScopeLines = deduplicate(rawOutOfScope);
  const outOfScopeText = outOfScopeLines.join('\n');

  // Build raw seed markdown for storage
  const rawParts = [];
  if (backgroundText) rawParts.push(`**Background:** ${backgroundText}`);
  if (problemText && problemText !== backgroundText) rawParts.push(`**Problem:** ${problemText}`);
  if (solutionText) rawParts.push(`**Solution:** ${solutionText}`);
  if (outOfScopeLines.length > 0) {
    rawParts.push(`**Out of Scope:**\n${outOfScopeLines.map((l) => `- ${l}`).join('\n')}`);
  }
  const raw = rawParts.join('\n\n');

  return {
    backgroundText,
    problemText,
    solutionText,
    outOfScopeText,
    raw,
  };
}
