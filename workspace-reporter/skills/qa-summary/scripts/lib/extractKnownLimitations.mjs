#!/usr/bin/env node
/**
 * Extract known limitations seed from QA plan markdown.
 * Scans for Known Limitations / Known Issues headings and collects bullet items.
 */

// Matches headings like "## Known Limitations", "### 1. Known Issues", "## Limitations"
// but NOT "## Known Limitations Overview" (trailing guard rejects word-continuation).
const HEADING_RE =
  /^#{1,4}\s+(?:\d+[\.\d]*\s+)?(?:Known Limitations?|Known Issues?|Limitations?)(?:\s*$|\s+[^a-zA-Z])/i;
const NEXT_HEADING_RE = /^#{1,4}\s/;
const BULLET_RE = /^\s*[-*]\s+(.+)$/;
/**
 * Extract known limitations from markdown text and optional pre-parsed lines.
 *
 * @param {string} markdown - Source markdown (QA plan or combined design text)
 * @param {string[]} outOfScopeLines - Additional lines to merge (from caller)
 * @returns {{ lines: string[], raw: string }}
 */
export function extractKnownLimitationsSeed(markdown = '', outOfScopeLines = []) {
  const lines = [];
  const mdLines = markdown.split('\n');

  let inside = false;
  for (const line of mdLines) {
    if (HEADING_RE.test(line)) {
      inside = true;
      continue;
    }
    if (inside && NEXT_HEADING_RE.test(line)) {
      inside = false;
      continue;
    }
    if (inside) {
      const m = BULLET_RE.exec(line);
      if (m) {
        const text = m[1].replace(/<P\d+>\s*/g, '').trim();
        if (text) lines.push(text);
      }
    }
  }

  // Merge outOfScopeLines; deduplicate case-insensitively (keep first occurrence)
  const seen = new Set(lines.map(l => l.toLowerCase()));
  for (const l of outOfScopeLines) {
    const cleaned = l.replace(/<P\d+>\s*/g, '').trim();
    if (cleaned && !seen.has(cleaned.toLowerCase())) {
      seen.add(cleaned.toLowerCase());
      lines.push(cleaned);
    }
  }

  const raw = lines.length > 0 ? lines.map(l => `- ${l}\n`).join('') : '';
  return { lines, raw };
}
