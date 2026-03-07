import test from 'node:test';
import assert from 'node:assert/strict';
import {
  REQUIRED_TEMPLATE_CATEGORIES,
  findMissingTemplateCategories,
  headingNeedsRewrite,
  stripTemplateAnnotations,
  validateTestCaseMarkdown,
} from '../scripts/lib/testCaseRules.mjs';

test('finds missing required top-level template categories', () => {
  const markdown = '# T\n\n## EndToEnd - P1\n\n## Platform\n';
  const missing = findMissingTemplateCategories(markdown);
  assert.ok(missing.includes('i18n'));
  assert.ok(missing.includes('Security Test'));
  assert.ok(missing.length < REQUIRED_TEMPLATE_CATEGORIES.length);
});

test('strips instructional annotations from final markdown', () => {
  const cleaned = stripTemplateAnnotations('## EndToEnd - P2 ([MAIN CATEGORY WITH PRIORITY])\n- Open report [(STEP)]\n\t- Works [(EXPECTED RESULT)]');
  assert.equal(cleaned.includes('[(STEP)]'), false);
  assert.equal(cleaned.includes('EXPECTED RESULT'), false);
  assert.equal(cleaned.includes('MAIN CATEGORY'), false);
});

test('flags technical headings for rewrite', () => {
  assert.equal(headingNeedsRewrite('Cross-Repo Error Propagation - P2'), true);
  assert.equal(headingNeedsRewrite('Continue editing after a report error - P1'), false);
});

test('validation fails when categories are missing, annotations remain, or headings are technical', () => {
  const markdown = '# T\n\n## EndToEnd - P2 ([MAIN CATEGORY])\n\n### Cross-Repo Error Propagation - P2\n- Trigger error [(STEP)]\n';
  const result = validateTestCaseMarkdown(markdown);
  assert.equal(result.ok, false);
  assert.equal(result.hasAnnotations, true);
  assert.ok(result.missingCategories.includes('i18n'));
  assert.ok(result.headingsNeedingRewrite.includes('Cross-Repo Error Propagation - P2'));
});
