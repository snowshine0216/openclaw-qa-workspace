import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { rewriteTestKeyPointsSection } from '../src/shared/markdown/sectionRewriter';
import { parseTestKeyPointsMarkdown } from '../src/shared/parser/testKeyPointsParser';

const FIXTURE_DIR = path.resolve(process.cwd(), 'tests/fixtures');

describe('testKeyPointsParser', () => {
  it('parses valid fixture and preserves non-target content on rewrite', async () => {
    const source = await readFile(path.resolve(FIXTURE_DIR, 'valid-dense-plan.md'), 'utf8');
    const parsed = parseTestKeyPointsMarkdown(source, 'BCIN-TEST');

    expect(parsed.document.sections).toHaveLength(2);
    expect(parsed.document.sections[0]?.cases).toHaveLength(2);
    expect(parsed.document.sections[1]?.cases).toHaveLength(1);

    const rewritten = rewriteTestKeyPointsSection(source, parsed.offsets, parsed.document);
    const before = source.slice(0, parsed.offsets.sectionStart);
    const after = source.slice(parsed.offsets.sectionEnd);

    expect(rewritten.startsWith(before)).toBe(true);
    expect(rewritten.endsWith(after)).toBe(true);

    const parsedAgain = parseTestKeyPointsMarkdown(rewritten, 'BCIN-TEST');
    expect(parsedAgain.document.sections).toHaveLength(2);
    expect(parsedAgain.document.sections[0]?.cases).toHaveLength(2);

    const rewrittenAgain = rewriteTestKeyPointsSection(rewritten, parsedAgain.offsets, parsedAgain.document);
    expect(rewrittenAgain).toEqual(rewritten);
  });

  it('rejects missing required columns', async () => {
    const source = await readFile(path.resolve(FIXTURE_DIR, 'missing-columns-plan.md'), 'utf8');
    expect(() => parseTestKeyPointsMarkdown(source, 'BCIN-MISSING')).toThrow(/missing required columns/i);
  });

  it('rejects malformed table rows', async () => {
    const source = await readFile(path.resolve(FIXTURE_DIR, 'malformed-table-plan.md'), 'utf8');
    expect(() => parseTestKeyPointsMarkdown(source, 'BCIN-MALFORMED')).toThrow(/has 5 cells, expected 6/i);
  });
});
