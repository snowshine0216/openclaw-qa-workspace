export const CANONICAL_TOP_LEVEL_CATEGORIES = [
  'EndToEnd',
  'Functional',
  'xFunction',
  'Error handling / Special cases',
  'Accessibility',
  'i18n',
  'performance',
  'upgrade / compatability',
  'Embedding',
  'AUTO: Automation-Only Tests',
  '📎 Artifacts Used',
];

export const FIXED_TOP_LEVEL_CATEGORIES = CANONICAL_TOP_LEVEL_CATEGORIES.slice(2);

export const RENAMEABLE_CATEGORY_ALIASES = {
  EndToEnd: [
    'EndToEnd',
    'End to End',
    'End-to-End',
    'E2E',
    'User Journey',
    'User Journeys',
    'Primary User Flow',
    'Primary User Flows',
  ],
  Functional: [
    'Functional',
    'Functionality',
    'Functional Coverage',
    'Core Functional Coverage',
    'Core Functional Scenarios',
    'Core Scenarios',
  ],
};

export const VAGUE_PHRASES = [
  'recover from a supported',
  'perform another valid editing action',
  'observe the recovered state',
  'verify correct recovery',
  'matches documented branch behavior',
  'when an error occurs',
  'after recovery',
  'verify recovery',
  'supported error',
  'valid editing action',
  'documented branch behavior',
];

const CODE_PATTERNS = [
  /\b[a-z_$][A-Za-z0-9_$]*\(\)/,
  /\b[a-z]+[A-Z][A-Za-z0-9]+\b/,
  /\b[A-Z][A-Za-z0-9]+(?:\.[A-Za-z0-9_]+)+\b/,
  /\breturns\s*\{[^}]+\}/i,
  /\bstid\s*=\s*-?\d+/i,
  /\bnoActionMode\b/i,
  /\bresolveExecution\b/i,
  /\bwindow\.mstrApp\b/i,
  /\bservice\.login\b/i,
  /\bcmdMgr\b/i,
  /\breCreateInstance\b/i,
  /\bisReCreateReportInstance\b/i,
];

const ANNOTATION_PATTERN = /\[\(STEP\)\]|\[\(EXPECTED RESULT|MAIN CATEOGY|MAIN CATEGORY|SUB CATEGY|SUB-CATEGORY|MARK Priority/i;
const PRIORITY_SUFFIX_PATTERN = /\s+-\s+P\d+.*$/;
const NORMALIZE_SPACES_PATTERN = /\s+/g;
const NA_REASON_PATTERN = /N\/A\s+[—-]\s+.+/i;

function normalizeHeadingText(text) {
  return String(text || '')
    .replace(PRIORITY_SUFFIX_PATTERN, '')
    .trim()
    .replace(NORMALIZE_SPACES_PATTERN, ' ')
    .toLowerCase();
}

function classifyTopLevelHeading(heading) {
  const normalized = normalizeHeadingText(heading);

  for (const [bucket, aliases] of Object.entries(RENAMEABLE_CATEGORY_ALIASES)) {
    if (aliases.some((alias) => normalizeHeadingText(alias) === normalized)) {
      return bucket;
    }
  }

  return CANONICAL_TOP_LEVEL_CATEGORIES.find(
    (category) => normalizeHeadingText(category) === normalized,
  ) || null;
}

export function extractTopLevelCategories(markdown) {
  return String(markdown || '')
    .split('\n')
    .filter((line) => line.startsWith('## '))
    .map((line) => line.replace(/^##\s+/, '').trim());
}

export function stripTemplateAnnotations(markdown) {
  return String(markdown || '')
    .replace(/\s*\[\(STEP\)\]/g, '')
    .replace(/\s*\[\(EXPECTED RESULT(?: IN LEAF NODE)?\)\]/g, '')
    .replace(/\s*\[\(STEPS\)\]/g, '')
    .replace(/\s*\(\[.*?\]\)/g, '')
    .replace(/[ \t]+$/gm, '');
}

export function extractTopLevelSections(markdown) {
  const lines = String(markdown || '').split('\n');
  const sections = [];
  let current = null;

  lines.forEach((line, index) => {
    if (line.startsWith('## ')) {
      if (current) {
        sections.push(current);
      }
      current = {
        heading: line.slice(3).trim(),
        bucket: classifyTopLevelHeading(line.slice(3).trim()),
        startLine: index + 1,
        body: [],
      };
      return;
    }

    if (current) {
      current.body.push(line);
    }
  });

  if (current) {
    sections.push(current);
  }

  return sections;
}

export function findMissingTemplateCategories(markdown) {
  const presentBuckets = new Set(
    extractTopLevelSections(markdown)
      .map((section) => section.bucket)
      .filter(Boolean),
  );

  return CANONICAL_TOP_LEVEL_CATEGORIES.filter((category) => !presentBuckets.has(category));
}

export function validateTopLevelStructure(markdown) {
  const sections = extractTopLevelSections(markdown);
  const illegalHeadings = [];
  const duplicateBuckets = [];
  const emptyRequiredSections = [];
  const presentBuckets = [];
  const seenBuckets = new Set();

  for (const section of sections) {
    if (!section.bucket) {
      illegalHeadings.push(section.heading);
      continue;
    }

    presentBuckets.push(section.bucket);
    if (seenBuckets.has(section.bucket)) {
      duplicateBuckets.push(section.bucket);
    }
    seenBuckets.add(section.bucket);

    if (FIXED_TOP_LEVEL_CATEGORIES.includes(section.bucket)) {
      const nonEmptyBody = section.body.join('\n').trim();
      if (!nonEmptyBody) {
        emptyRequiredSections.push(section.bucket);
        continue;
      }

      const hasNaReason = NA_REASON_PATTERN.test(nonEmptyBody);
      const hasStructuredContent = /^(### |- )/m.test(nonEmptyBody);
      if (!hasStructuredContent && !hasNaReason) {
        emptyRequiredSections.push(section.bucket);
      }
    }
  }

  const missingCategories = findMissingTemplateCategories(markdown);
  const orderIssues = [];
  CANONICAL_TOP_LEVEL_CATEGORIES.forEach((category, index) => {
    if (presentBuckets[index] && presentBuckets[index] !== category) {
      orderIssues.push({
        expected: category,
        actual: presentBuckets[index],
        position: index + 1,
      });
    }
  });

  return {
    ok:
      illegalHeadings.length === 0 &&
      duplicateBuckets.length === 0 &&
      emptyRequiredSections.length === 0 &&
      missingCategories.length === 0 &&
      orderIssues.length === 0,
    sections,
    illegalHeadings,
    duplicateBuckets,
    emptyRequiredSections,
    missingCategories,
    orderIssues,
  };
}

function isManualBucket(bucket) {
  return bucket && bucket !== 'AUTO: Automation-Only Tests' && bucket !== '📎 Artifacts Used';
}

export function headingNeedsRewrite(heading) {
  const text = String(heading || '').trim();
  return CODE_PATTERNS.some((pattern) => pattern.test(text))
    || VAGUE_PHRASES.some((phrase) => text.toLowerCase().includes(phrase));
}

export function findExecutabilityIssues(markdown) {
  const sections = extractTopLevelSections(markdown);
  const issues = [];

  sections
    .filter((section) => isManualBucket(section.bucket))
    .forEach((section) => {
      section.body.forEach((line, offset) => {
        const text = line.trim();
        if (!text || (!text.startsWith('### ') && !text.startsWith('- '))) {
          return;
        }

        const normalized = text.toLowerCase();
        const lineNumber = section.startLine + offset + 1;

        for (const phrase of VAGUE_PHRASES) {
          if (normalized.includes(phrase)) {
            issues.push({
              code: phrase.includes('result') ? 'EXEC_VAGUE_EXPECTED_RESULT' : phrase.includes('action') ? 'EXEC_VAGUE_ACTION' : 'EXEC_VAGUE_TRIGGER',
              line: lineNumber,
              text,
            });
            return;
          }
        }

        if (CODE_PATTERNS.some((pattern) => pattern.test(text))) {
          issues.push({
            code: 'EXEC_CODE_VOCAB_IN_MANUAL',
            line: lineNumber,
            text,
          });
        }
      });
    });

  return issues;
}

export function validateTestCaseMarkdown(markdown) {
  const structure = validateTopLevelStructure(markdown);
  const executabilityIssues = findExecutabilityIssues(markdown);
  const hasAnnotations = ANNOTATION_PATTERN.test(String(markdown || ''));
  const headingsNeedingRewrite = extractTopLevelSections(markdown)
    .filter((section) => isManualBucket(section.bucket) && headingNeedsRewrite(section.heading))
    .map((section) => section.heading);

  return {
    ok: structure.ok && executabilityIssues.length === 0 && headingsNeedingRewrite.length === 0 && !hasAnnotations,
    missingCategories: structure.missingCategories,
    illegalHeadings: structure.illegalHeadings,
    duplicateBuckets: structure.duplicateBuckets,
    emptyRequiredSections: structure.emptyRequiredSections,
    orderIssues: structure.orderIssues,
    headingsNeedingRewrite,
    executabilityIssues,
    hasAnnotations,
  };
}
