export const REQUIRED_TEMPLATE_CATEGORIES = [
  'EndToEnd',
  'Report Creator Dialog',
  'Error handling / Special cases',
  'Security Test',
  'Pendo',
  'performance',
  'Platform',
  'upgrade  / compatability',
  'Accessibility',
  'Embedding',
  'i18n',
];

const TECHNICAL_PHRASES = [
  'cross-repo',
  'request queue',
  'propagation',
  'flag',
  'useeffect',
  'rerender',
  're-render',
  'serverproxy',
  'cmdmgr',
  'api called',
  'function',
  'thunk',
  'state management',
];

export function extractTopLevelCategories(markdown) {
  return String(markdown || '')
    .split('\n')
    .filter((line) => line.startsWith('## '))
    .map((line) => line.replace(/^##\s+/, '').replace(/\s+-\s+P\d+.*$/, '').trim());
}

export function findMissingTemplateCategories(markdown, requiredCategories = REQUIRED_TEMPLATE_CATEGORIES) {
  const present = new Set(extractTopLevelCategories(markdown));
  return requiredCategories.filter((category) => !present.has(category));
}

export function stripTemplateAnnotations(markdown) {
  return String(markdown || '')
    .replace(/\s*\[\(STEP\)\]/g, '')
    .replace(/\s*\[\(EXPECTED RESULT(?: IN LEAF NODE)?\)\]/g, '')
    .replace(/\s*\[\(STEPS\)\]/g, '')
    .replace(/\s*\(\[.*?\]\)/g, '')
    .replace(/\s*\(\[MAIN CATEOGY\]\)/g, '')
    .replace(/\s*\(\[MAIN CATEGORY WITH PRIORITY\]\)/g, '')
    .replace(/\s*\(\[SUB CATEGY\]\)/g, '')
    .replace(/\s*\(\[SUB-CATEGORY WITH PRIORITY\]\)/g, '')
    .replace(/\s*\(\[MARK Priority in sub category \/ steps if needed\]\)/g, '')
    .replace(/[ \t]+$/gm, '');
}

export function headingNeedsRewrite(heading) {
  const text = String(heading || '').trim().toLowerCase();
  return TECHNICAL_PHRASES.some((phrase) => text.includes(phrase));
}

export function validateTestCaseMarkdown(markdown) {
  const lines = String(markdown || '').split('\n');
  const headings = lines.filter((line) => line.startsWith('### ')).map((line) => line.slice(4));
  const missingCategories = findMissingTemplateCategories(markdown);
  const headingsNeedingRewrite = headings.filter(headingNeedsRewrite);
  const hasAnnotations = /\[\(STEP\)\]|\[\(EXPECTED RESULT|MAIN CATEGORY|SUB CATEGY|SUB-CATEGORY/.test(markdown);

  return {
    ok: missingCategories.length === 0 && headingsNeedingRewrite.length === 0 && !hasAnnotations,
    missingCategories,
    headingsNeedingRewrite,
    hasAnnotations,
  };
}
