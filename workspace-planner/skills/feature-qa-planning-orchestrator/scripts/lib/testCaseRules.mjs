export const CANONICAL_TOP_LEVEL_CATEGORIES = [
  'EndToEnd',
  'Functional - Pause Mode',
  'Functional - Running Mode',
  'Functional - Modeling Service Non-Crash Path',
  'Functional - MDX / Engine Errors',
  'Functional - Prompt Flow',
  'xFunctional',
  'UI - Messaging',
  'Platform',
];

export const REQUIRED_COVERAGE_DOMAINS = [
  'primary functional behavior',
  'error handling / recovery',
  'state transition / continuity',
  'user-visible messaging or status',
  'cross-flow / multi-step interactions',
  'compatibility / scope guard',
  'nonfunctional considerations when relevant',
];

export const BLOCKING_COVERAGE_DOMAINS = REQUIRED_COVERAGE_DOMAINS.filter(
  (domain) => domain !== 'nonfunctional considerations when relevant',
);

export const OPTIONAL_TOP_LEVEL_CATEGORIES = [
  'Accessibility',
  'Security',
  'Upgrade / compatibility',
  'i18n',
  'Performance',
  'Embedding',
];

const LEGACY_CATEGORY_ALIASES = {
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
  'Functional - Pause Mode': [
    'Functional - Pause Mode',
    'Pause Mode',
    'Functional: Pause Mode',
    'Functional - Primary',
    'Functional - Core',
    'Functional - State A',
  ],
  'Functional - Running Mode': [
    'Functional - Running Mode',
    'Running Mode',
    'Functional: Running Mode',
    'Functional - Secondary',
    'Functional - State B',
  ],
  'Functional - Modeling Service Non-Crash Path': [
    'Functional - Modeling Service Non-Crash Path',
    'Modeling Service Non-Crash Path',
    'Functional: Modeling Service Non-Crash Path',
    'Functional - Success path',
    'Functional - Non-error path',
  ],
  'Functional - MDX / Engine Errors': [
    'Functional - MDX / Engine Errors',
    'MDX / Engine Errors',
    'Functional: MDX / Engine Errors',
  ],
  'Functional - Prompt Flow': [
    'Functional - Prompt Flow',
    'Prompt Flow',
    'Functional: Prompt Flow',
    'Functional - Forms',
    'Functional - Input flow',
  ],
  xFunctional: [
    'xFunctional',
    'xFunction',
    'Cross Functional',
    'Cross-Functional',
  ],
  'UI - Messaging': [
    'UI - Messaging',
    'UI Messaging',
    'Messaging',
  ],
  Platform: [
    'Platform',
    'Browser Coverage',
    'Platform Coverage',
  ],
};

const SECTION_TYPE_RULES = [
  {
    type: 'EndToEnd',
    aliases: LEGACY_CATEGORY_ALIASES.EndToEnd,
    coverageDomains: [
      'primary functional behavior',
      'state transition / continuity',
      'cross-flow / multi-step interactions',
    ],
  },
  {
    type: 'Functional',
    aliases: [
      ...LEGACY_CATEGORY_ALIASES['Functional - Pause Mode'],
      ...LEGACY_CATEGORY_ALIASES['Functional - Running Mode'],
      ...LEGACY_CATEGORY_ALIASES['Functional - Modeling Service Non-Crash Path'],
      ...LEGACY_CATEGORY_ALIASES['Functional - Prompt Flow'],
    ],
    pattern: /^functional\s*[-:]\s+.+/i,
    coverageDomains: [
      'primary functional behavior',
      'state transition / continuity',
    ],
  },
  {
    type: 'Error Handling / Recovery',
    aliases: [
      ...LEGACY_CATEGORY_ALIASES['Functional - MDX / Engine Errors'],
      'Error Handling',
      'Error handling',
      'Errors',
      'Recovery Behavior',
      'Recovery',
      'Recovery behavior',
    ],
    coverageDomains: [
      'error handling / recovery',
      'state transition / continuity',
    ],
  },
  {
    type: 'Cross-flow / Multi-step',
    aliases: [
      ...LEGACY_CATEGORY_ALIASES.xFunctional,
      'Cross-flow',
      'Cross Flow',
      'Multi-step',
      'Multi-step Interactions',
      'Workflow Continuity',
    ],
    coverageDomains: ['cross-flow / multi-step interactions'],
  },
  {
    type: 'UI / Messaging',
    aliases: [
      ...LEGACY_CATEGORY_ALIASES['UI - Messaging'],
      'Status',
      'User Messaging',
      'UI - Status',
    ],
    coverageDomains: ['user-visible messaging or status'],
  },
  {
    type: 'Compatibility / Scope Guard',
    aliases: [
      'Compatibility',
      'Compatibility / scope guard',
      'Scope guard',
      'Scope Guard',
      'Upgrade / compatibility',
      'upgrade / compatability',
      'upgrade / compatibility',
    ],
    coverageDomains: ['compatibility / scope guard'],
  },
  {
    type: 'Platform / Environment',
    aliases: [
      ...LEGACY_CATEGORY_ALIASES.Platform,
      'Environment',
      'Environment Coverage',
      'Browser / Platform',
    ],
    coverageDomains: [
      'compatibility / scope guard',
      'nonfunctional considerations when relevant',
    ],
  },
  {
    type: 'Privilege / Permission',
    aliases: [
      'Privilege / Permission',
      'Privilege',
      'Permission',
      'Permissions',
      'Role / Entitlement',
    ],
    coverageDomains: ['primary functional behavior'],
  },
  {
    type: 'Configuration / Validation',
    aliases: [
      'Configuration / Validation',
      'Configuration',
      'Validation',
      'Input Validation',
      'Forms / Validation',
    ],
    coverageDomains: [
      'primary functional behavior',
      'state transition / continuity',
    ],
  },
  {
    type: 'State Transition / Continuity',
    aliases: [
      'State Transition',
      'State Transition / Continuity',
      'Continuity',
      'Workflow Continuity',
      'Session Continuity',
    ],
    coverageDomains: ['state transition / continuity'],
  },
  {
    type: 'Accessibility',
    aliases: ['Accessibility'],
    coverageDomains: ['nonfunctional considerations when relevant'],
  },
  {
    type: 'Security',
    aliases: ['Security'],
    coverageDomains: ['nonfunctional considerations when relevant'],
  },
  {
    type: 'i18n',
    aliases: ['i18n'],
    coverageDomains: ['nonfunctional considerations when relevant'],
  },
  {
    type: 'Performance',
    aliases: ['Performance', 'performance'],
    coverageDomains: ['nonfunctional considerations when relevant'],
  },
  {
    type: 'Embedding / Integration',
    aliases: ['Embedding', 'Integration', 'Embedding / Integration'],
    coverageDomains: [
      'compatibility / scope guard',
      'nonfunctional considerations when relevant',
    ],
  },
];

const COVERAGE_DOMAIN_ALIASES = {
  'primary functional behavior': [
    'primary functional behavior',
    'primary behavior',
    'primary functional',
  ],
  'error handling / recovery': [
    'error handling / recovery',
    'error handling',
    'recovery',
    'error recovery',
  ],
  'state transition / continuity': [
    'state transition / continuity',
    'state transition',
    'continuity',
    'state continuity',
  ],
  'user-visible messaging or status': [
    'user-visible messaging or status',
    'messaging',
    'status',
    'user-visible messaging',
  ],
  'cross-flow / multi-step interactions': [
    'cross-flow / multi-step interactions',
    'cross-flow',
    'cross flow',
    'multi-step interactions',
    'multi-step',
  ],
  'compatibility / scope guard': [
    'compatibility / scope guard',
    'compatibility',
    'scope guard',
  ],
  'nonfunctional considerations when relevant': [
    'nonfunctional considerations when relevant',
    'nonfunctional',
    'accessibility',
    'i18n',
    'performance',
    'embedding',
    'integration',
    'security',
  ],
};

export const VAGUE_PHRASES = [
  'when an error occurs',
  'recover from a supported report execution or manipulation error',
  'perform another valid editing action',
  'observe the recovered state',
  'verify correct recovery',
  'verify recovery',
  'matches documented branch behavior',
];

const LEADING_VAGUE_TRIGGER_PATTERNS = [
  /^(?:### |- )after recovery\b/i,
];

const CODE_PATTERNS = [
  /\b[a-z_$][A-Za-z0-9_$]*\(\)/,
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
const COVERAGE_DOMAINS_COMMENT_PATTERN = /<!--\s*Coverage domains:\s*([\s\S]*?)-->/gi;
const COVERAGE_CHECKPOINTS_COMMENT_PATTERN = /<!--\s*Coverage checkpoints considered:\s*([\s\S]*?)-->/gi;
const GENERIC_CUSTOM_HEADING_TOKENS = new Set(['misc', 'other', 'notes', 'general', 'various', 'stuff', 'overview']);

function normalizeHeadingText(text) {
  return String(text || '')
    .replace(PRIORITY_SUFFIX_PATTERN, '')
    .trim()
    .replace(NORMALIZE_SPACES_PATTERN, ' ')
    .toLowerCase();
}

function normalizeListValue(text) {
  return String(text || '')
    .trim()
    .replace(NORMALIZE_SPACES_PATTERN, ' ')
    .toLowerCase();
}

function classifyLegacyCategory(heading) {
  const normalized = normalizeHeadingText(heading);

  for (const [bucket, aliases] of Object.entries(LEGACY_CATEGORY_ALIASES)) {
    if (aliases.some((alias) => normalizeHeadingText(alias) === normalized)) {
      return bucket;
    }
  }

  const fromCanonical = CANONICAL_TOP_LEVEL_CATEGORIES.find(
    (category) => normalizeHeadingText(category) === normalized,
  );
  if (fromCanonical) return fromCanonical;

  return null;
}

function classifyTopLevelHeading(heading) {
  const normalized = normalizeHeadingText(heading);

  for (const rule of SECTION_TYPE_RULES) {
    if (rule.aliases?.some((alias) => normalizeHeadingText(alias) === normalized)) {
      return rule.type;
    }
  }

  for (const rule of SECTION_TYPE_RULES) {
    if (rule.pattern?.test(heading)) {
      return rule.type;
    }
  }

  return null;
}

function splitCommentList(rawValue) {
  return String(rawValue || '')
    .split(/[,\n;]+/u)
    .map((value) => value.trim())
    .filter(Boolean);
}

function matchCoverageDomain(value) {
  const normalized = normalizeListValue(value);

  for (const [domain, aliases] of Object.entries(COVERAGE_DOMAIN_ALIASES)) {
    if (aliases.some((alias) => normalizeListValue(alias) === normalized)) {
      return domain;
    }
  }

  return null;
}

function collectCommentValues(text, pattern) {
  const values = [];
  const source = String(text || '');
  let match;
  while ((match = pattern.exec(source)) !== null) {
    values.push(...splitCommentList(match[1]));
  }
  pattern.lastIndex = 0;
  return values;
}

function inferCoverageDomainsFromType(type) {
  const rule = SECTION_TYPE_RULES.find((candidate) => candidate.type === type);
  return rule ? [...rule.coverageDomains] : [];
}

function isSemanticCustomHeading(heading) {
  const text = normalizeHeadingText(heading);
  if (!text || /[<>]/.test(heading)) {
    return false;
  }

  const words = text.split(/[^a-z0-9]+/u).filter(Boolean);
  if (words.length < 2) {
    return false;
  }

  return words.every((word) => !GENERIC_CUSTOM_HEADING_TOKENS.has(word));
}

function sectionHasConcreteManualContent(section) {
  return section.body.some((line) => {
    const text = line.trim();
    return text.startsWith('- ') && !NA_REASON_PATTERN.test(text);
  });
}

function findMissingConcreteCoverageDomains(sections) {
  const primarySections = sections.filter((section) => section.coverageDomains.includes('primary functional behavior'));
  if (primarySections.some((section) => sectionHasConcreteManualContent(section))) {
    return [];
  }
  return ['primary functional behavior'];
}

function enrichSection(section) {
  const bodyText = section.body.join('\n');
  const explicitCoverageDomains = collectCommentValues(bodyText, COVERAGE_DOMAINS_COMMENT_PATTERN)
    .map((value) => matchCoverageDomain(value))
    .filter(Boolean);
  const inferredCoverageDomains = inferCoverageDomainsFromType(section.type);
  const coverageDomains = [...new Set([...explicitCoverageDomains, ...inferredCoverageDomains])];
  const customHeadingAllowed = coverageDomains.length > 0 && isSemanticCustomHeading(section.heading);

  return {
    ...section,
    bucket: section.type || (customHeadingAllowed ? 'Explicit Coverage' : null),
    explicitCoverageDomains,
    coverageDomains,
    customHeadingAllowed,
    consideredCheckpoints: collectCommentValues(bodyText, COVERAGE_CHECKPOINTS_COMMENT_PATTERN),
    legacyCategory: classifyLegacyCategory(section.heading),
  };
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
        type: classifyTopLevelHeading(line.slice(3).trim()),
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

  return sections.map(enrichSection);
}

const COVERAGE_DOMAIN_GROUPS = {
  'primary functional behavior': ['primary functional behavior'],
  'error handling / recovery': ['error handling / recovery'],
  'state transition / continuity': ['state transition / continuity'],
  'user-visible messaging or status': ['user-visible messaging or status'],
  'cross-flow / multi-step interactions': ['cross-flow / multi-step interactions'],
  'compatibility / scope guard': ['compatibility / scope guard'],
  'nonfunctional considerations when relevant': ['nonfunctional considerations when relevant'],
};

export function findMissingTemplateCategories(markdown) {
  const presentBuckets = new Set(
    extractTopLevelSections(markdown)
      .map((section) => section.legacyCategory)
      .filter(Boolean),
  );

  return CANONICAL_TOP_LEVEL_CATEGORIES.filter((category) => !presentBuckets.has(category));
}

export function findMissingCoverageDomains(markdown) {
  const presentBuckets = new Set(
    extractTopLevelSections(markdown)
      .flatMap((section) => section.coverageDomains)
      .filter(Boolean),
  );

  const missing = [];
  for (const [group, buckets] of Object.entries(COVERAGE_DOMAIN_GROUPS)) {
    const hasGroup = buckets.some((b) => presentBuckets.has(b));
    if (!hasGroup && BLOCKING_COVERAGE_DOMAINS.includes(group)) missing.push(group);
  }
  return missing;
}

export function validateTopLevelStructure(markdown, options = {}) {
  const legacyMode = options.legacy === true || options.flexible === false;
  const sections = extractTopLevelSections(markdown);
  const illegalHeadings = [];
  const duplicateBuckets = [];
  const emptyRequiredSections = [];
  const duplicateHeadings = [];
  const normalizedHeadings = new Map();
  const seenLegacyCategories = new Set();

  for (const section of sections) {
    if (!section.bucket) {
      illegalHeadings.push(section.heading);
      continue;
    }

    const normalizedHeading = normalizeHeadingText(section.heading);
    if (normalizedHeadings.has(normalizedHeading)) {
      duplicateHeadings.push(section.heading);
    } else {
      normalizedHeadings.set(normalizedHeading, section.heading);
    }

    if (legacyMode && section.legacyCategory) {
      if (seenLegacyCategories.has(section.legacyCategory)) {
        duplicateBuckets.push(section.legacyCategory);
      }
      seenLegacyCategories.add(section.legacyCategory);
    }

    const nonEmptyBody = section.body.join('\n').trim();
    if (!nonEmptyBody) {
      emptyRequiredSections.push(section.heading);
      continue;
    }

    const hasNaReason = NA_REASON_PATTERN.test(nonEmptyBody);
    const hasStructuredContent = /^(### |- )/m.test(nonEmptyBody);
    if (!hasStructuredContent && !hasNaReason) {
      emptyRequiredSections.push(section.heading);
    }
  }

  const missingCategories = legacyMode ? findMissingTemplateCategories(markdown) : [];
  const missingCoverageDomains = legacyMode ? [] : findMissingCoverageDomains(markdown);
  const missingConcreteCoverageDomains = legacyMode ? [] : findMissingConcreteCoverageDomains(sections);
  const orderIssues = [];
  if (legacyMode) {
    const requiredInDocument = sections
      .map((section) => section.legacyCategory)
      .filter((category) => CANONICAL_TOP_LEVEL_CATEGORIES.includes(category));
    CANONICAL_TOP_LEVEL_CATEGORIES.forEach((category, index) => {
      if (requiredInDocument[index] && requiredInDocument[index] !== category) {
        orderIssues.push({
          expected: category,
          actual: requiredInDocument[index],
          position: index + 1,
        });
      }
    });
  }

  const ok = legacyMode
    ? illegalHeadings.length === 0 &&
      emptyRequiredSections.length === 0 &&
      missingCategories.length === 0 &&
      orderIssues.length === 0
    : illegalHeadings.length === 0 &&
      duplicateHeadings.length === 0 &&
      emptyRequiredSections.length === 0 &&
      missingCoverageDomains.length === 0 &&
      missingConcreteCoverageDomains.length === 0;

  return {
    ok,
    sections,
    illegalHeadings,
    duplicateBuckets: legacyMode ? duplicateBuckets : duplicateHeadings,
    emptyRequiredSections,
    missingCategories,
    missingCoverageDomains,
    missingConcreteCoverageDomains,
    orderIssues,
  };
}

function isManualBucket(bucket) {
  return Boolean(bucket);
}

export function headingNeedsRewrite(heading) {
  const text = String(heading || '').trim();
  return CODE_PATTERNS.some((pattern) => pattern.test(text))
    || VAGUE_PHRASES.some((phrase) => text.toLowerCase().includes(phrase))
    || LEADING_VAGUE_TRIGGER_PATTERNS.some((pattern) => pattern.test(text));
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
            const issueCode = phrase.includes('result') || phrase.includes('recovered state') || phrase.includes('correct recovery') || phrase.includes('branch behavior')
              ? 'EXEC_VAGUE_EXPECTED_RESULT'
              : phrase.includes('action')
                ? 'EXEC_VAGUE_ACTION'
                : 'EXEC_VAGUE_TRIGGER';
            issues.push({
              code: issueCode,
              line: lineNumber,
              text,
            });
            return;
          }
        }

        if (LEADING_VAGUE_TRIGGER_PATTERNS.some((pattern) => pattern.test(text))) {
          issues.push({
            code: 'EXEC_VAGUE_TRIGGER',
            line: lineNumber,
            text,
          });
          return;
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
    missingCoverageDomains: structure.missingCoverageDomains,
    missingConcreteCoverageDomains: structure.missingConcreteCoverageDomains,
    illegalHeadings: structure.illegalHeadings,
    duplicateBuckets: structure.duplicateBuckets,
    emptyRequiredSections: structure.emptyRequiredSections,
    orderIssues: structure.orderIssues,
    headingsNeedingRewrite,
    executabilityIssues,
    hasAnnotations,
  };
}
