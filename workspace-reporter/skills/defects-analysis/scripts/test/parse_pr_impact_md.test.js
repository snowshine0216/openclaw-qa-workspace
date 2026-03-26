import test from 'node:test';
import assert from 'node:assert/strict';

import { parsePrImpactMd } from '../lib/parse_pr_impact_md.mjs';

test('extracts PR number from heading', () => {
  const result = parsePrImpactMd('# PR Impact Analysis: #22621');
  assert.equal(result.number, 22621);
});

test('extracts repository from github pull request url', () => {
  const result = parsePrImpactMd(
    'Reference: https://github.com/mstr-kiai/web-dossier/pull/22621',
  );
  assert.equal(result.repository, 'mstr-kiai/web-dossier');
  assert.equal(result.number, 22621);
});

test('extracts title from metadata table row', () => {
  const result = parsePrImpactMd('| **Title** | BCIN-7751; some title |');
  assert.equal(result.title, 'BCIN-7751; some title');
});

test('extracts linked jira key array from markdown links', () => {
  const result = parsePrImpactMd(
    'Linked Jira: [BCIN-7751](https://example.atlassian.net/browse/BCIN-7751) and [BCIN-7788](https://example.atlassian.net/browse/BCIN-7788)',
  );
  assert.deepEqual(result.linked_jira, ['BCIN-7751', 'BCIN-7788']);
});

test('extracts merged_at from metadata table row', () => {
  const result = parsePrImpactMd('| **Merged At** | 2026-03-23T07:39:53Z |');
  assert.equal(result.merged_at, '2026-03-23');
});

test('returns risk_note as first substantial paragraph after description heading', () => {
  const result = parsePrImpactMd(`
# PR Impact Analysis: #22621

## Description

Short note.

This PR fixes export error handling in authoring mode. High risk due to broad catch block.

Later paragraph that should not be selected.
`);

  assert.equal(
    result.risk_note,
    'This PR fixes export error handling in authoring mode. High risk due to broad catch block.',
  );
});

test('returns empty object gracefully on empty input', () => {
  assert.deepEqual(parsePrImpactMd(''), {});
  assert.deepEqual(parsePrImpactMd(null), {});
});
