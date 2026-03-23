const REQUIRED_CONTEXT_HEADINGS = [
  '## Feature Summary',
  '## Feature Classification',
  '## Source Inventory',
  '## Primary User Journeys',
  '## Entry Points',
  '## Core Capability Families',
  '## Error / Recovery Behaviors',
  '## Known Risks / Regressions',
  '## Permissions / Auth / Data Constraints',
  '## Environment / Platform Constraints',
  '## Setup / Fixtures Needed',
  '## Unsupported / Deferred / Ambiguous',
  '## Mandatory Coverage Candidates',
  '## Traceability Map',
];

const BANNED_VAGUE_PHRASES = [
  'verify correct behavior',
  'verify expected behavior',
  'ensure it works',
  'test parity',
  'perform another valid action',
  'confirm functionality',
  'validate integration',
  'check the feature',
];

const GENERIC_EXPECTED_RESULT_PHRASES = [
  'remains usable',
  'works correctly',
  'correct behavior',
  'safe understandable way',
];

const IMPLEMENTATION_TOKENS = [
  'service',
  'bridge api',
  'bridge function',
  'internal api',
  'hook',
  'sdk',
  'renderproxy',
  'updatefuncreactcomponent',
];

const STOPWORDS = new Set([
  'the',
  'and',
  'for',
  'with',
  'after',
  'before',
  'still',
  'next',
  'action',
  'comment',
  'trigger',
  'unclear',
]);

const CONTRADICTORY_TOKEN_GROUPS = [
  ['enable', 'disable'],
  ['enabled', 'disabled'],
  ['read', 'unread'],
  ['open', 'close'],
  ['opened', 'closed'],
  ['valid', 'invalid'],
  ['grant', 'revoke'],
  ['allow', 'deny'],
  ['success', 'failure'],
  ['online', 'offline'],
];

const CANONICAL_TOP_LAYERS = [
  'EndToEnd',
  'Core Functional Flows',
  'Error Handling / Recovery',
  'Regression / Known Risks',
  'Compatibility',
  'Security',
  'i18n',
  'Accessibility',
  'Performance / Resilience',
  'Out of Scope / Assumptions',
];

const REQUIRED_CHECKPOINTS = [
  'Checkpoint 1',
  'Checkpoint 2',
  'Checkpoint 3',
  'Checkpoint 4',
  'Checkpoint 5',
  'Checkpoint 6',
  'Checkpoint 7',
  'Checkpoint 8',
  'Checkpoint 9',
  'Checkpoint 10',
  'Checkpoint 11',
  'Checkpoint 12',
  'Checkpoint 13',
  'Checkpoint 14',
  'Checkpoint 15',
];

function normalizeContent(content) {
  return String(content || '').replace(/\r\n/g, '\n');
}

function stripHtmlComments(content) {
  return normalizeContent(content).replace(/<!--[\s\S]*?-->/g, '');
}

function getSection(content, heading) {
  const text = normalizeContent(content);
  const start = text.indexOf(`${heading}\n`);
  if (start === -1) return '';
  const bodyStart = start + heading.length + 1;
  const rest = text.slice(bodyStart);
  const nextHeadingOffset = rest.search(/\n##\s+/);
  if (nextHeadingOffset === -1) return rest.trim();
  return rest.slice(0, nextHeadingOffset).trim();
}

function getTopLevelBulletSection(content, heading) {
  const text = normalizeContent(content);
  const lines = text.split('\n');
  const startIndex = lines.findIndex((line) => line.trim() === heading);
  if (startIndex === -1) return '';

  const sectionLines = [];
  for (let index = startIndex + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (/^- [^\s]/.test(line)) break;
    sectionLines.push(line);
  }
  return sectionLines.join('\n').trim();
}

function hasNonEmptyBullet(section) {
  return section
    .split('\n')
    .map((line) => line.trim())
    .some((line) => line.startsWith('- ') || line.startsWith('* '));
}

function listMissingHeadings(content, headings) {
  return headings.filter((heading) => !normalizeContent(content).includes(`${heading}\n`));
}

function findClassification(section) {
  const match = section.match(/\b(user_facing|non_user_facing)\b/);
  return match ? match[1] : null;
}

function hasClassificationEvidence(section) {
  return /(source artifact|user confirmation)/i.test(section);
}

function extractCandidateIds(section) {
  return section
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => line.slice(2).split('|')[0]?.trim())
    .filter(Boolean);
}

function extractScenarioRows(section) {
  return extractTableRows(section, 5);
}

function extractTableRows(section, minCells = 1) {
  return section
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => line.slice(2).split('|').map((cell) => cell.trim()))
    .filter((cells) => cells.length >= minCells);
}

function includesAny(text, phrases) {
  const lower = normalizeContent(text).toLowerCase();
  return phrases.filter((phrase) => lower.includes(phrase));
}

function parseDisposition(section, allowedValues) {
  const bulletValues = section
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => line.slice(2).trim().toLowerCase());
  const allowed = new Set(allowedValues.map((value) => value.toLowerCase()));
  return {
    values: bulletValues,
    invalid: bulletValues.filter((value) => !allowed.has(value)),
  };
}

function tokenizeReference(text) {
  return normalizeContent(text)
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length >= 4 && !STOPWORDS.has(token));
}

function actionLines(content) {
  return normalizeContent(content)
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /action:/i.test(line));
}

function bulletLines(content) {
  return normalizeContent(content)
    .split('\n')
    .filter((line) => /^\s*[-*] /.test(line));
}

function bulletIndent(line) {
  return (line.match(/^\s*/) || [''])[0].length;
}

function parseScenarioIdCell(cell) {
  return String(cell || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
}

function scenarioBlocks(content) {
  const lines = normalizeContent(content).split('\n');
  const blocks = [];
  let current = null;

  for (const line of lines) {
    if (/^\s*\* /.test(line)) {
      if (current) blocks.push(current);
      current = [line];
      continue;
    }
    if (current) {
      if (/^- [^\s]/.test(line)) {
        blocks.push(current);
        current = null;
      } else {
        current.push(line);
      }
    }
  }

  if (current) blocks.push(current);
  return blocks.map((block) => block.join('\n'));
}

function hasCamelCaseImplementationToken(line) {
  return /[a-z]+[A-Z][A-Za-z0-9]+/.test(line);
}

function topLevelBullets(content) {
  return bulletLines(content)
    .filter((line) => bulletIndent(line) === 0)
    .map((line) => line.replace(/^\s*[-*]\s+/, '').trim());
}

function nestedBlocks(content) {
  const lines = normalizeContent(content).split('\n');
  const blocks = [];
  let currentTop = null;

  for (const line of lines) {
    if (!/^\s*[-*] /.test(line)) continue;
    const indent = bulletIndent(line);
    if (indent === 0) {
      currentTop = { title: line.replace(/^\s*[-*]\s+/, '').trim(), lines: [] };
      blocks.push(currentTop);
      continue;
    }
    if (currentTop) currentTop.lines.push(line);
  }

  return blocks;
}

function extractRowsForSection(content, heading, minCells) {
  return extractTableRows(getSection(content, heading), minCells);
}

function stripPriorityTag(text) {
  return String(text || '').replace(/\s*<P\d+>\s*$/i, '').trim();
}

function parseDraftScenarioEntries(content) {
  const lines = normalizeContent(content).split('\n');
  const entries = [];
  const ancestorStack = [];
  let currentScenario = null;

  for (const line of lines) {
    if (!/^\s*[-*] /.test(line)) {
      if (currentScenario) currentScenario.lines.push(line);
      continue;
    }
    const indent = bulletIndent(line);
    const label = stripPriorityTag(line.replace(/^\s*[-*]\s+/, ''));
    if (currentScenario && indent <= currentScenario.indent) {
      entries.push(finalizeScenarioEntry(currentScenario));
      currentScenario = null;
    }

    if (currentScenario && indent > currentScenario.indent) {
      currentScenario.lines.push(line);
      continue;
    }

    while (ancestorStack.length > 0 && ancestorStack[ancestorStack.length - 1].indent >= indent) {
      ancestorStack.pop();
    }

    if (/<P\d+>/i.test(line)) {
      currentScenario = {
        indent,
        ancestors: ancestorStack.map((item) => item.title),
        title: label,
        lines: [line],
      };
      continue;
    }

    ancestorStack.push({ indent, title: label });
  }

  if (currentScenario) {
    entries.push(finalizeScenarioEntry(currentScenario));
  }

  return entries;
}

function finalizeScenarioEntry(entry) {
  const topLayer = entry.ancestors[0] || '';
  const subcategory = entry.ancestors.length > 1
    ? entry.ancestors[1]
    : entry.ancestors[0] || '';
  return {
    topLayer,
    subcategory,
    ancestors: entry.ancestors,
    title: entry.title,
    path: [...entry.ancestors, entry.title].filter(Boolean).join(' > '),
    block: entry.lines.join('\n'),
  };
}

function parseCoveragePreservationRows(content) {
  return extractRowsForSection(content, '## Coverage Preservation Audit', 6).map((cells) => ({
    renderedPlanPath: cells[0],
    priorRoundStatus: cells[1],
    currentRoundStatus: cells[2],
    evidenceSource: cells[3],
    disposition: String(cells[4] || '').toLowerCase(),
    reason: cells[5],
  }));
}

function hasScopeReductionJustification(text) {
  return /(evidence|jira|confluence|source|user|confirmed|confirmation|unsupported|explicit|dependency|excluded|exclusion|proven)/i
    .test(String(text || ''));
}

function parseRoundFromDraftPath(path) {
  const match = String(path || '').match(/_r(\d+)\.md$/);
  return match ? Number(match[1]) : 0;
}

function overlapRatio(leftTokens, rightTokens) {
  if (leftTokens.length === 0 || rightTokens.length === 0) return 0;
  const right = new Set(rightTokens);
  const overlap = leftTokens.filter((token) => right.has(token)).length;
  return overlap / Math.max(leftTokens.length, rightTokens.length);
}

function areEquivalentScenarioTitles(leftTitle, rightTitle) {
  if (leftTitle === rightTitle) return true;
  const leftTokens = tokenizeReference(leftTitle);
  const rightTokens = tokenizeReference(rightTitle);
  return overlapRatio(leftTokens, rightTokens) > 0.5
    && !hasContradictoryTokens(leftTokens, rightTokens);
}

function hasContradictoryTokens(leftTokens, rightTokens) {
  const left = new Set(leftTokens);
  const right = new Set(rightTokens);
  return CONTRADICTORY_TOKEN_GROUPS.some(([a, b]) => {
    return (left.has(a) && right.has(b))
      || (left.has(b) && right.has(a));
  });
}

function areEquivalentScenarioEntries(beforeEntry, afterEntry) {
  if (!afterEntry) return false;
  if (beforeEntry.topLayer !== afterEntry.topLayer) return false;
  if (!areEquivalentScenarioTitles(beforeEntry.title, afterEntry.title)) return false;

  const beforeBlockTokens = tokenizeReference(beforeEntry.block);
  const afterBlockTokens = tokenizeReference(afterEntry.block);
  return overlapRatio(beforeBlockTokens, afterBlockTokens) > 0.6
    && !hasContradictoryTokens(beforeBlockTokens, afterBlockTokens);
}

function areRelatedScenarioEntries(beforeEntry, afterEntry, { allowTopLayerChange = false } = {}) {
  if (!afterEntry) return false;
  if (!allowTopLayerChange && beforeEntry.topLayer !== afterEntry.topLayer) return false;

  const beforeTitleTokens = tokenizeReference(beforeEntry.title);
  const afterTitleTokens = tokenizeReference(afterEntry.title);
  const beforeBlockTokens = tokenizeReference(beforeEntry.block);
  const afterBlockTokens = tokenizeReference(afterEntry.block);
  const hasContradiction = hasContradictoryTokens(beforeTitleTokens, afterTitleTokens)
    || hasContradictoryTokens(beforeBlockTokens, afterBlockTokens);
  if (hasContradiction) return false;

  return overlapRatio(beforeTitleTokens, afterTitleTokens) > 0.2
    || overlapRatio(beforeBlockTokens, afterBlockTokens) > 0.2;
}

function classifyAuditCurrentStatus(status) {
  const normalized = String(status || '').trim().toLowerCase();
  if (/out[_ ]of[_ ]scope/.test(normalized)) return 'out_of_scope';
  if (/defer/.test(normalized)) return 'deferred';
  if (/remove|deleted|drop/.test(normalized)) return 'removed';
  if (/split/.test(normalized)) return 'split';
  if (/clarif|rename|retitle|rewrite/.test(normalized)) return 'clarified';
  if (/preserv|remain|keep/.test(normalized)) return 'preserved';
  return 'other';
}

export function validateContextIndex(content) {
  const failures = [];
  const missingHeadings = listMissingHeadings(content, REQUIRED_CONTEXT_HEADINGS);
  if (missingHeadings.length > 0) {
    failures.push(`Missing required headings: ${missingHeadings.join(', ')}`);
  }

  const classificationSection = getSection(content, '## Feature Classification');
  const classification = findClassification(classificationSection);
  if (!classification) {
    failures.push('## Feature Classification is missing a valid classification value.');
  }
  if (classification && !hasClassificationEvidence(classificationSection)) {
    failures.push('## Feature Classification must cite source evidence or explicit user confirmation.');
  }

  const traceabilitySection = getSection(content, '## Traceability Map');
  if (!hasNonEmptyBullet(traceabilitySection)) {
    failures.push('## Traceability Map must contain at least one extracted fact row.');
  }

  const candidatesSection = getSection(content, '## Mandatory Coverage Candidates');
  const candidateIds = extractCandidateIds(candidatesSection);
  if (classification === 'user_facing' && candidateIds.length === 0) {
    failures.push('Mandatory coverage candidates are required for user_facing features.');
  }

  return {
    ok: failures.length === 0,
    failures,
    classification,
    candidateIds,
  };
}

export function validateCoverageLedger(content, requiredCandidateIds = []) {
  const mappingSection = getSection(content, '## Scenario Mapping Table');
  const rows = extractScenarioRows(mappingSection);
  const foundIds = new Set(rows.flatMap((cells) => parseScenarioIdCell(cells[0])));
  const missingCandidates = requiredCandidateIds.filter((id) => !foundIds.has(id));
  const failures = [];
  const explicitNone = /\bnone\b/i.test(mappingSection);

  if (rows.length === 0 && requiredCandidateIds.length > 0) {
    failures.push('## Scenario Mapping Table must contain at least one scenario row.');
  }
  if (rows.length === 0 && requiredCandidateIds.length === 0 && !explicitNone) {
    failures.push('## Scenario Mapping Table must contain scenario rows or an explicit none marker when no candidate ids are required.');
  }
  if (missingCandidates.length > 0) {
    failures.push(`Missing scenario mappings for candidate ids: ${missingCandidates.join(', ')}`);
  }

  return { ok: failures.length === 0, failures, missingCandidates };
}

function parseScenarioUnits(content) {
  const section = getSection(content, '## Scenario Units');
  const rows = extractTableRows(section, 9);
  return rows.map((cells) => ({
    scenarioId: cells[0],
    familyId: cells[1],
    title: cells[2],
    trigger: cells[3],
    visibleOutcome: cells[4],
    recommendedSection: cells[5],
    priority: cells[6],
    sourceArtifacts: cells[7],
    mergePolicy: cells[8],
  }));
}

function findScenarioBlockByTitle(draftContent, title) {
  const normalizedTitle = String(title || '').trim().toLowerCase();
  return scenarioBlocks(draftContent).find((block) => {
    const firstLine = block.split('\n')[0]?.toLowerCase() || '';
    return firstLine.includes(normalizedTitle);
  }) || '';
}

function parseRewriteRequests(content) {
  const section = getSection(content, '## Rewrite Requests');
  const rows = extractTableRows(section, 5);
  return rows.map((cells) => ({
    requestId: cells[0],
    scenarioIds: parseScenarioIdCell(cells[1]),
    problemType: cells[2],
    requiredAction: cells[3],
    status: cells[4],
  }));
}

function parseReviewDeltaRows(content) {
  const section = getSection(content, '## Blocking Findings Resolution');
  const rows = extractTableRows(section, 5);
  return rows.map((cells) => ({
    requestId: cells[0],
    oldScenarioTitle: cells[1],
    newScenarioTitles: cells[2],
    changeSummary: cells[3],
    status: cells[4],
  }));
}

function isNoOpChangeSummary(text) {
  return /\b(no change|unchanged|same as before|no-op)\b/i.test(String(text || '').trim());
}

export function validateScenarioGranularity(
  scenarioUnitsContent,
  coverageLedgerContent,
  draftContent,
  reviewRewriteRequestsContent = '',
  reviewDeltaContent = ''
) {
  const failures = [];
  const scenarioUnits = parseScenarioUnits(scenarioUnitsContent);
  if (scenarioUnits.length === 0) {
    failures.push('## Scenario Units must contain at least one scenario row.');
  }
  const mappingSection = getSection(coverageLedgerContent, '## Scenario Mapping Table');
  const mappingRows = extractScenarioRows(mappingSection).map((cells) => ({
    scenarioIds: parseScenarioIdCell(cells[0]),
    draftSection: cells[1],
    draftScenarioTitle: cells[2],
    resolutionType: cells[3],
    status: cells[4],
  }));

  const mustStandAloneUnits = scenarioUnits.filter((unit) => unit.mergePolicy === 'must_stand_alone');
  const mappingByScenarioId = new Map();
  for (const row of mappingRows) {
    for (const scenarioId of row.scenarioIds) {
      if (!mappingByScenarioId.has(scenarioId)) mappingByScenarioId.set(scenarioId, []);
      mappingByScenarioId.get(scenarioId).push(row);
    }
  }

  for (const unit of mustStandAloneUnits) {
    const rows = mappingByScenarioId.get(unit.scenarioId) || [];
    if (rows.length === 0) {
      failures.push(`Missing standalone mapping for must_stand_alone scenario unit: ${unit.scenarioId}`);
      continue;
    }

    for (const row of rows) {
      if (!['standalone', 'explicit_exclusion'].includes(row.resolutionType)) {
        failures.push(
          `must_stand_alone scenario unit ${unit.scenarioId} must use standalone or explicit_exclusion resolution, got ${row.resolutionType || 'none'}`
        );
      }
      if (row.scenarioIds.length !== 1) {
        failures.push(
          `must_stand_alone scenario unit ${unit.scenarioId} is merged with other scenario ids in mapping row: ${row.scenarioIds.join(', ')}`
        );
      }
      if (row.resolutionType === 'explicit_exclusion') {
        continue;
      }

      const block = findScenarioBlockByTitle(draftContent, row.draftScenarioTitle);
      if (!block) {
        failures.push(`Draft scenario block not found for mapped title: ${row.draftScenarioTitle}`);
        continue;
      }
      const lowerBlock = block.toLowerCase();
      const genericPhrase = GENERIC_EXPECTED_RESULT_PHRASES.find((phrase) => lowerBlock.includes(phrase));
      if (genericPhrase) {
        failures.push(
          `Mapped draft scenario for ${unit.scenarioId} uses generic expected-result wording: ${genericPhrase}`
        );
      }
    }
  }

  const rewriteRequests = parseRewriteRequests(reviewRewriteRequestsContent);
  const reviewDeltaRows = parseReviewDeltaRows(reviewDeltaContent);
  const reviewDeltaByRequestId = new Map(reviewDeltaRows.map((row) => [row.requestId, row]));

  for (const request of rewriteRequests.filter((item) => String(item.status || '').trim().match(/^(required|resolved|open)$/i))) {
    const delta = reviewDeltaByRequestId.get(request.requestId);
    const mappedRows = mappingRows.filter((row) => row.scenarioIds.some((id) => request.scenarioIds.includes(id)));
    if (!delta) {
      failures.push(`Missing review-delta row for required rewrite request: ${request.requestId}`);
      continue;
    }
    if (delta.status !== 'resolved') {
      failures.push(`Required rewrite request ${request.requestId} is not resolved in review delta.`);
    }
    const titleChanged = String(delta.oldScenarioTitle || '').trim() !== String(delta.newScenarioTitles || '').trim();
    if (!titleChanged && isNoOpChangeSummary(delta.changeSummary)) {
      failures.push(`Required rewrite request ${request.requestId} is marked resolved but review delta records no material change.`);
    }

    if (request.problemType === 'split_required') {
      if (!titleChanged) {
        failures.push(`split_required request ${request.requestId} did not rename or split the affected scenario titles.`);
      }
      const mergedRows = mappedRows.filter((row) => row.scenarioIds.length > 1);
      if (mergedRows.length > 0) {
        failures.push(`split_required request ${request.requestId} still maps multiple scenario ids into one testcase.`);
      }
      continue;
    }

    if (request.problemType === 'expected_result_too_vague') {
      for (const row of mappedRows.filter((row) => row.resolutionType !== 'explicit_exclusion')) {
        const block = findScenarioBlockByTitle(draftContent, row.draftScenarioTitle);
        if (!block) {
          failures.push(`Required rewrite request ${request.requestId} references a draft scenario that was not found: ${row.draftScenarioTitle}`);
          continue;
        }
        const genericPhrase = GENERIC_EXPECTED_RESULT_PHRASES.find((phrase) => block.toLowerCase().includes(phrase));
        if (genericPhrase) {
          failures.push(`expected_result_too_vague request ${request.requestId} still contains generic wording: ${genericPhrase}`);
        }
      }
      continue;
    }

    if (request.problemType === 'missing_visible_outcome') {
      for (const row of mappedRows.filter((row) => row.resolutionType !== 'explicit_exclusion')) {
        const block = findScenarioBlockByTitle(draftContent, row.draftScenarioTitle);
        if (!block || !/(Expected:|expected:)/.test(block)) {
          failures.push(`missing_visible_outcome request ${request.requestId} still lacks an observable expected result.`);
        }
      }
      continue;
    }

    if (request.problemType === 'missing_source_traceability' && mappedRows.length === 0) {
      failures.push(`missing_source_traceability request ${request.requestId} has no scenario mappings in the coverage ledger.`);
    }
  }

  return { ok: failures.length === 0, failures };
}

export function validateE2EMinimum(content, { featureClassification = 'user_facing' } = {}) {
  const failures = [];
  const e2eSection = getTopLevelBulletSection(content, '- EndToEnd');
  const hasEndToEnd = normalizeContent(content).includes('\n- EndToEnd');
  const xmindHierarchy = validateXMindMarkHierarchy(content);
  const deepBullets = bulletLines(content).filter((line) => bulletIndent(line) >= 12);
  if (featureClassification === 'user_facing' && !hasEndToEnd) {
    if (!xmindHierarchy.ok || deepBullets.length === 0) {
      failures.push('User-facing plans must include an end-to-end journey or equivalent executable XMindMark hierarchy.');
    }
  }
  if (featureClassification === 'user_facing' && hasEndToEnd) {
    const missingExpectedScenarios = scenarioBlocks(e2eSection).filter((block) => {
      const bullets = bulletLines(block);
      return !bullets.some((line) => bulletIndent(line) >= 16);
    });
    if (missingExpectedScenarios.length > 0) {
      failures.push('Each EndToEnd journey must include an observable completion/result condition.');
    }
  }
  if (featureClassification === 'non_user_facing' && !hasEndToEnd) {
    const outOfScopeSection = getTopLevelBulletSection(content, '- Out of Scope / Assumptions');
    const hasReason = /non[- ]user[- ]facing|not user[- ]facing|background|system|admin/i.test(outOfScopeSection);
    if (!hasReason) {
      failures.push('Non-user-facing plans without EndToEnd must explicitly justify the omission in Out of Scope / Assumptions.');
    }
  }
  return { ok: failures.length === 0, failures };
}

export function validateExecutableSteps(content) {
  const failures = [];
  if (/setup:/i.test(content)) {
    failures.push('Setup sections are not allowed in script-driven XMindMark plans.');
  }
  if (/(Action:|Expected:)/i.test(content)) {
    failures.push('Legacy Action:/Expected: labels are not allowed in script-driven XMindMark plans.');
  }

  const banned = includesAny(content, BANNED_VAGUE_PHRASES);
  for (const phrase of banned) {
    failures.push(`Banned vague phrase found: ${phrase}`);
  }

  for (const line of bulletLines(content)) {
    if (bulletIndent(line) < 8) continue;
    const lower = line.toLowerCase();
    const matchedToken = IMPLEMENTATION_TOKENS.find((token) => lower.includes(token));
    if (matchedToken || hasCamelCaseImplementationToken(line)) {
      failures.push(`Implementation-heavy wording found in action step: ${line}`);
    }
  }

  const bullets = bulletLines(content);
  if (bullets.length === 0) {
    failures.push('Plan must contain bullet-based XMindMark steps.');
  }

  const actionSteps = bullets.filter((line) => bulletIndent(line) >= 12);
  const expectedOutcomes = bullets.filter((line) => bulletIndent(line) >= 16);
  if (actionSteps.length === 0) {
    failures.push('Plan must include nested atomic action steps.');
  }
  if (expectedOutcomes.length === 0) {
    failures.push('Plan must include observable expected outcomes as nested bullet leaves.');
  }

  const genericExpecteds = expectedOutcomes.filter((line) => {
    return GENERIC_EXPECTED_RESULT_PHRASES.some((phrase) => line.toLowerCase().includes(phrase));
  });
  if (genericExpecteds.length > 0) {
    failures.push(`Generic expected-result wording found: ${genericExpecteds[0].trim()}`);
  }

  return { ok: failures.length === 0, failures };
}

export function validateXMindMarkHierarchy(content) {
  const failures = [];
  const lines = normalizeContent(content)
    .split('\n')
    .map((line) => line.replace(/\s+$/g, ''))
    .filter((line) => line.trim() !== '' && !line.trim().startsWith('<!---'));

  const firstLine = lines[0] || '';
  if (!firstLine || /^\s*[-*]/.test(firstLine)) {
    failures.push('XMindMark plan must start with a central topic line.');
  }

  const bullets = bulletLines(content);
  const topLevelBullets = bullets.filter((line) => bulletIndent(line) === 0);
  const nestedBullets = bullets.filter((line) => bulletIndent(line) > 0);

  if (topLevelBullets.length < 2) {
    failures.push('XMindMark hierarchy must contain at least two top-level category nodes.');
  }
  if (nestedBullets.length === 0) {
    failures.push('XMindMark hierarchy must contain nested child nodes.');
  }

  return { ok: failures.length === 0, failures };
}

export function validateReviewDelta(content) {
  const failures = [];
  const blockingSection = getSection(content, '## Blocking Findings Resolution');
  const rows = extractTableRows(blockingSection, 5);
  const explicitNone = /\bnone\b/i.test(blockingSection);
  if (rows.length === 0 && !explicitNone) {
    failures.push('## Blocking Findings Resolution must contain at least one finding row or explicit none marker.');
  }

  const badStatuses = ['partially_resolved', 'not_resolved'];
  const allowedStatuses = new Set(['resolved', 'blocked']);
  for (const cells of rows) {
    const status = cells[cells.length - 1];
    if (badStatuses.includes(status)) {
      failures.push(`Blocking finding remains unresolved with status: ${status}`);
    }
    if (!allowedStatuses.has(status)) {
      failures.push(`Blocking finding has invalid status: ${status}`);
    }
  }

  const verdictSection = getSection(content, '## Verdict After Refactor');
  if (!hasNonEmptyBullet(verdictSection)) {
    failures.push('## Verdict After Refactor must contain an explicit terminal disposition.');
  } else {
    const { values, invalid } = parseDisposition(verdictSection, ['accept', 'return phase5a']);
    if (values.length === 0) {
      failures.push('## Verdict After Refactor must contain one disposition bullet.');
    }
    if (values.length > 1) {
      failures.push('## Verdict After Refactor must contain exactly one disposition bullet.');
    }
    if (invalid.length > 0) {
      failures.push(`## Verdict After Refactor has invalid disposition: ${invalid.join(', ')}`);
    }
  }

  return { ok: failures.length === 0, failures };
}

export function validateUnresolvedStepHandling(reviewContent, draftContent, researchArtifacts = []) {
  const failures = [];
  const reviewSection = getSection(reviewContent, '## Unresolved Executability Items');
  if (!hasNonEmptyBullet(reviewSection)) {
    return { ok: true, failures };
  }

  const lowerDraft = normalizeContent(draftContent).toLowerCase();
  if (!lowerDraft.includes('comment:')) {
    failures.push('Unresolved executability items require an explicit comment in the draft.');
  }
  if (!/next action/i.test(draftContent)) {
    failures.push('Unresolved executability items require a recorded next action.');
  }
  if (!/research_executability_/i.test(draftContent) && researchArtifacts.length === 0) {
    failures.push('Unresolved executability items require linked research artifacts when research was needed.');
  }

  const unresolvedItems = reviewSection
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => line.slice(2));

  for (const item of unresolvedItems) {
    const tokens = tokenizeReference(item).slice(0, 3);
    const matchedTokens = tokens.filter((token) => lowerDraft.includes(token));
    if (tokens.length > 0 && matchedTokens.length < Math.min(2, tokens.length)) {
      failures.push(`Draft does not preserve unresolved item context: ${item}`);
    }
  }

  return { ok: failures.length === 0, failures };
}

export function validatePhase4aSubcategoryDraft(content) {
  const options = arguments[1] || {};
  const failures = [];
  const topLayers = topLevelBullets(content);
  const leaked = topLayers.filter((label) => CANONICAL_TOP_LAYERS.includes(label));
  if (leaked.length > 0) {
    failures.push(`Phase 4a must stay below canonical top-layer grouping. Found: ${leaked.join(', ')}`);
  }
  if (stripHtmlComments(content).includes('->')) {
    failures.push('Phase 4a draft still contains compressed arrow-chain steps.');
  }

  const blocks = nestedBlocks(content);
  if (blocks.length === 0) {
    failures.push('Phase 4a draft must contain at least one subcategory block.');
  }
  for (const block of blocks) {
    const hasScenarioLayer = block.lines.some((line) => bulletIndent(line) === 4);
    if (!hasScenarioLayer) {
      failures.push(`Phase 4a block "${block.title}" is missing a scenario layer.`);
    }
  }

  if (options.requireSupportTrace && !/supporting_issue_summary_/i.test(normalizeContent(content))) {
    failures.push('Phase 4a draft is missing support trace evidence for supporting_issue_summary_<feature-id>.md.');
  }
  if (options.requireResearchTrace && !/deep_research_(synthesis|tavily|confluence)_/i.test(normalizeContent(content))) {
    failures.push('Phase 4a draft is missing research trace evidence for deep research artifacts.');
  }
  for (const topic of options.requiredTopics || []) {
    if (topic === 'report_editor_workstation_functionality' && !/workstation/i.test(normalizeContent(content))) {
      failures.push('Phase 4a draft is missing explicit coverage or exclusion for report_editor_workstation_functionality.');
    }
    if (topic === 'report_editor_library_vs_workstation_gap' && !/library\s+vs\s+workstation|library-vs-workstation/i.test(normalizeContent(content))) {
      failures.push('Phase 4a draft is missing explicit coverage or exclusion for report_editor_library_vs_workstation_gap.');
    }
  }

  return { ok: failures.length === 0, failures };
}

export function validatePhase4bCategoryLayering(content) {
  const options = arguments[1] || {};
  const failures = [];
  const text = normalizeContent(content);
  const hasExceptionComment = text.includes('top_layer_exception');
  const topLayers = topLevelBullets(content);
  const nonCanonical = topLayers.filter((label) => !CANONICAL_TOP_LAYERS.includes(label));
  if (nonCanonical.length > 0 && !hasExceptionComment) {
    failures.push(`Phase 4b uses non-canonical top-layer labels without exception comment: ${nonCanonical.join(', ')}`);
  }

  const blocks = nestedBlocks(content);
  for (const block of blocks) {
    const subcategoryLines = block.lines.filter((line) => bulletIndent(line) === 4);
    const scenarioLines = block.lines.filter((line) => bulletIndent(line) === 8);
    const hasSubcategoryLayer = subcategoryLines.some((line) => !/<P\d+>/i.test(line));
    const hasScenarioLayer = scenarioLines.some((line) => /<P\d+>/i.test(line));
    if (!hasSubcategoryLayer || !hasScenarioLayer) {
      failures.push(`Top layer "${block.title}" must contain both a subcategory layer and a scenario layer.`);
    }
  }

  if (options.requireTraceability && !/supporting_issue_summary_|deep_research_/i.test(text)) {
    failures.push('Phase 4b draft is missing support/deep-research traceability evidence.');
  }
  const requiredTopics = options.requiredTopics || [];
  if (requiredTopics.includes('report_editor_workstation_functionality')
    && requiredTopics.includes('report_editor_library_vs_workstation_gap')) {
    const scenarioText = scenarioBlocks(content).map((block) => block.toLowerCase());
    const workstationBlocks = scenarioText.filter((block) => block.includes('workstation'));
    const gapBlocks = scenarioText.filter((block) => block.includes('library vs workstation') || block.includes('library-vs-workstation'));
    const sharedBlocks = scenarioText.filter((block) => block.includes('workstation') && (block.includes('library vs workstation') || block.includes('library-vs-workstation')));
    if (workstationBlocks.length === 0 || gapBlocks.length === 0 || sharedBlocks.length === scenarioText.length) {
      failures.push('Phase 4b must preserve separate scenario coverage for Workstation functionality and the Library-vs-Workstation gap.');
    }
  }

  return { ok: failures.length === 0, failures };
}

export function validateContextCoverageAudit(content, requiredEntries = [], options = {}) {
  const failures = [];
  const rows = extractRowsForSection(content, '## Context Artifact Coverage Audit', 6).map((cells) => ({
    artifactPath: cells[0],
    artifactSection: cells[1],
    disposition: cells[2],
    mappedPlanSection: cells[3],
    checkpoint: cells[4],
    notes: cells[5],
  }));
  const covered = new Set(rows.map((row) => `${row.artifactPath}::${row.artifactSection}`));
  for (const entry of requiredEntries) {
    if (!covered.has(entry)) {
      failures.push(`Missing context audit row for ${entry}`);
    }
  }
  for (const row of rows) {
    if (!row.disposition) {
      failures.push(`Context audit row is missing a disposition for ${row.artifactPath}`);
    }
    if (row.disposition === 'consumed' && !row.mappedPlanSection) {
      failures.push(`Consumed context audit row must include a mapped plan section for ${row.artifactPath}`);
    }
  }

  if (options.requireSupportingAuditSection) {
    const supportRows = extractRowsForSection(content, '## Supporting Artifact Coverage Audit', 6);
    if (supportRows.length === 0) {
      failures.push('Missing ## Supporting Artifact Coverage Audit section.');
    }
  }
  if (options.requireDeepResearchAuditSection) {
    const researchRows = extractRowsForSection(content, '## Deep Research Coverage Audit', 6);
    if (researchRows.length === 0) {
      failures.push('Missing ## Deep Research Coverage Audit section.');
    }
  }
  return { ok: failures.length === 0, failures };
}

export function validateCoveragePreservationAudit(reviewNotesContent, beforeDraftContent, afterDraftContent) {
  const failures = [];
  const beforeEntries = parseDraftScenarioEntries(beforeDraftContent);
  const afterEntries = parseDraftScenarioEntries(afterDraftContent);
  const auditRows = parseCoveragePreservationRows(reviewNotesContent);
  const rowsByPath = new Map(auditRows.map((row) => [row.renderedPlanPath, row]));
  const afterPaths = new Set(afterEntries.map((entry) => entry.path));
  const afterByTitle = new Map(afterEntries.map((entry) => [entry.title, entry]));
  const missingEntries = beforeEntries.filter((entry) => !afterPaths.has(entry.path));

  if (missingEntries.length > 0 && auditRows.length === 0) {
    failures.push('## Coverage Preservation Audit is required when a later round has fewer scenarios than the prior round.');
  }

  for (const row of auditRows) {
    if (!row.renderedPlanPath || !row.priorRoundStatus || !row.currentRoundStatus || !row.evidenceSource || !row.reason) {
      failures.push('Coverage Preservation Audit rows must include rendered path, prior status, current status, evidence source, disposition, and reason.');
    }
    if (!['pass', 'rewrite_required'].includes(row.disposition)) {
      failures.push(`Coverage Preservation Audit row has invalid disposition: ${row.disposition || 'none'}`);
    }
  }

  for (const beforeEntry of missingEntries) {

    const auditRow = rowsByPath.get(beforeEntry.path);
    if (!auditRow) {
      failures.push(`Missing coverage audit row for prior-round scenario: ${beforeEntry.path}`);
      continue;
    }

    const equivalentEntry = afterEntries.find((entry) => areEquivalentScenarioEntries(beforeEntry, entry));
    const movedEntry = afterByTitle.get(beforeEntry.title);
    const relatedEntries = afterEntries.filter((entry) => areRelatedScenarioEntries(beforeEntry, entry, { allowTopLayerChange: true }));
    const statusClass = classifyAuditCurrentStatus(auditRow.currentRoundStatus);
    const movedToOutOfScope = movedEntry?.topLayer === 'Out of Scope / Assumptions'
      || equivalentEntry?.topLayer === 'Out of Scope / Assumptions'
      || statusClass === 'out_of_scope';

    if ((statusClass === 'preserved' || statusClass === 'clarified') && !equivalentEntry) {
      failures.push(`Coverage Preservation Audit row claims ${statusClass} but the rewritten draft does not preserve the scenario: ${beforeEntry.path}`);
      continue;
    }

    if (statusClass === 'split' && relatedEntries.length < 2) {
      failures.push(`Coverage Preservation Audit row claims split but the rewritten draft does not split the scenario into multiple preserved children: ${beforeEntry.path}`);
      continue;
    }

    if ((statusClass === 'removed' || statusClass === 'deferred' || statusClass === 'out_of_scope')
      && equivalentEntry && auditRow.disposition === 'pass') {
      failures.push(`Coverage Preservation Audit row claims ${statusClass} but an equivalent scenario is still present in the rewritten draft: ${beforeEntry.path}`);
      continue;
    }

    if ((statusClass === 'removed' || statusClass === 'deferred' || movedToOutOfScope)
      && !hasScopeReductionJustification(`${auditRow.evidenceSource} ${auditRow.reason}`)) {
      failures.push(
        `Removed, deferred, or Out of Scope treatment requires source evidence or explicit user direction: ${beforeEntry.path}`
      );
    }
  }

  return { ok: failures.length === 0, failures };
}

export function validateDraftCoveragePreservation(beforeDraftContent, afterDraftContent, options = {}) {
  const failures = [];
  const beforeEntries = parseDraftScenarioEntries(beforeDraftContent);
  const afterEntries = parseDraftScenarioEntries(afterDraftContent);
  const afterPaths = new Set(afterEntries.map((entry) => entry.path));
  const afterByTitle = new Map(afterEntries.map((entry) => [entry.title, entry]));
  const allowTopLayerChange = Boolean(options.allowTopLayerChange);

  for (const beforeEntry of beforeEntries) {
    if (afterPaths.has(beforeEntry.path)) continue;
    const clarifiedEntry = afterEntries.find((entry) => {
      if (allowTopLayerChange) {
        return areRelatedScenarioEntries(beforeEntry, entry, { allowTopLayerChange: true })
          && areEquivalentScenarioTitles(beforeEntry.title, entry.title);
      }
      return areEquivalentScenarioEntries(beforeEntry, entry);
    });
    if (clarifiedEntry) continue;
    const movedEntry = afterByTitle.get(beforeEntry.title);
    const relatedOutOfScopeEntry = afterEntries.find((entry) => {
      return entry.topLayer === 'Out of Scope / Assumptions'
        && areRelatedScenarioEntries(beforeEntry, entry, { allowTopLayerChange: true });
    });
    const movedBlock = relatedOutOfScopeEntry ? relatedOutOfScopeEntry.block : (movedEntry ? findScenarioBlockByTitle(afterDraftContent, movedEntry.title) : '');
    const justifiedOutOfScope = (movedEntry?.topLayer === 'Out of Scope / Assumptions'
      || relatedOutOfScopeEntry?.topLayer === 'Out of Scope / Assumptions')
      && hasScopeReductionJustification(movedBlock);
    if (!justifiedOutOfScope) {
      failures.push(`silent coverage regression detected for prior reviewed scenario: ${beforeEntry.path}`);
    }
  }

  return { ok: failures.length === 0, failures };
}

export function validateRoundProgression({ task = {}, phaseId, producedDraftPath, expectedDraftPath = '' }) {
  const failures = [];
  const priorRound = Number(task?.[`${phaseId}_round`] || 0);
  const producedRound = parseRoundFromDraftPath(producedDraftPath);
  const latestDraftRound = task?.latest_draft_phase === phaseId
    ? parseRoundFromDraftPath(task?.latest_draft_path)
    : 0;
  const rerunRequested = String(task?.return_to_phase || '').trim().toLowerCase() === phaseId;
  const expectedRound = parseRoundFromDraftPath(expectedDraftPath);

  if (producedRound === 0) {
    failures.push(`Unable to determine round number for ${phaseId} draft: ${producedDraftPath}`);
  }
  if (expectedRound > 0 && producedRound !== expectedRound) {
    failures.push(`${phaseId} produced r${producedRound} but the manifest requested r${expectedRound}`);
  }
  if (rerunRequested && priorRound > 0 && producedRound <= priorRound) {
    failures.push(`${phaseId} rerun reused r${producedRound} instead of advancing beyond r${priorRound}`);
  } else if (rerunRequested && producedRound < 2) {
    failures.push(`${phaseId} rerun reused r${producedRound} instead of advancing beyond r1`);
  } else if (!rerunRequested && priorRound > 0 && latestDraftRound > 0 && producedRound < latestDraftRound) {
    failures.push(`${phaseId} rerun reused r${producedRound} instead of advancing beyond r${priorRound}`);
  }
  if (latestDraftRound > 0 && producedRound < latestDraftRound) {
    failures.push(`${phaseId} draft points backward from r${latestDraftRound} to r${producedRound}`);
  }

  return { ok: failures.length === 0, failures };
}

export function validatePhase5aAcceptanceGate(reviewNotesContent, reviewDeltaContent, roundIntegrityFailures = [], options = {}) {
  const failures = [];
  const verdictSection = getSection(reviewDeltaContent, '## Verdict After Refactor');
  const { values } = parseDisposition(verdictSection, ['accept', 'return phase5a']);
  const verdict = values[0] || '';
  const unresolvedCoverageRows = parseCoveragePreservationRows(reviewNotesContent)
    .filter((row) => row.disposition === 'rewrite_required');

  if (verdict === 'accept' && unresolvedCoverageRows.length > 0) {
    failures.push(
      `Phase 5a cannot return accept while coverage-preservation items remain rewrite_required: ${unresolvedCoverageRows.map((row) => row.renderedPlanPath).join(', ')}`
    );
  }
  if (verdict === 'accept' && roundIntegrityFailures.length > 0) {
    failures.push(
      `Phase 5a cannot return accept while round-integrity findings remain unresolved: ${roundIntegrityFailures.join('; ')}`
    );
  }
  if (verdict === 'accept' && Array.isArray(options.unsatisfiedBlockingRequirements) && options.unsatisfiedBlockingRequirements.length > 0) {
    failures.push(
      `Phase 5a cannot return accept while blocking request requirements remain unsatisfied: ${options.unsatisfiedBlockingRequirements.join(', ')}`
    );
  }

  return { ok: failures.length === 0, failures };
}

export function validateSectionReviewChecklist(content) {
  const failures = [];
  const rows = extractRowsForSection(content, '## Section Review Checklist', 5).map((cells) => ({
    section: cells[0],
    checkpoint: cells[1],
    status: String(cells[2] || '').toLowerCase(),
    evidence: cells[3],
    requiredAction: cells[4],
  }));
  const sections = new Set(rows.map((row) => row.section));
  for (const section of CANONICAL_TOP_LAYERS) {
    if (!sections.has(section)) {
      failures.push(`Section Review Checklist is missing checkpoint coverage for ${section}`);
    }
  }
  for (const row of rows) {
    if (row.status === 'fail' && (!row.requiredAction || row.requiredAction === 'none')) {
      failures.push(`Failed section checkpoint for ${row.section} must include a required action.`);
    }
  }

  const blockingRows = extractRowsForSection(content, '## Blocking Findings', 5).map((cells) => ({
    findingId: cells[0],
    section: cells[1],
    issue: cells[2],
    whyBlocking: cells[3],
    requiredAction: cells[4],
  }));
  const rewriteRows = extractRowsForSection(content, '## Rewrite Requests', 5);
  for (const finding of blockingRows.filter((row) => row.findingId && row.findingId.toLowerCase() !== 'none')) {
    if (!rewriteRows.some((cells) => normalizeContent(cells.join(' ')).toLowerCase().includes(finding.requiredAction.toLowerCase()))) {
      failures.push(`Blocking finding ${finding.findingId} must have a matching rewrite request.`);
    }
  }
  return { ok: failures.length === 0, failures };
}

export function validateCheckpointAudit(content) {
  const failures = [];
  const rows = extractRowsForSection(content, '## Checkpoint Summary', 5).map((cells) => ({
    checkpointGroup: cells[0],
    checkpoint: cells[1],
    status: String(cells[2] || '').toLowerCase(),
    evidence: cells[3],
    requiredAction: cells[4],
  }));
  const found = new Set(rows.map((row) => row.checkpoint));
  for (const checkpoint of REQUIRED_CHECKPOINTS) {
    if (!found.has(checkpoint)) {
      failures.push(`Checkpoint audit is missing ${checkpoint}`);
    }
  }
  if (!found.has('supporting_context_and_gap_readiness')) {
    failures.push('Checkpoint audit is missing supporting_context_and_gap_readiness');
  }
  for (const row of rows) {
    if (!row.evidence || row.evidence === 'none') {
      failures.push(`${row.checkpoint} must cite evidence.`);
    }
    if (row.status === 'fail' && (!row.requiredAction || row.requiredAction === 'none')) {
      failures.push(`${row.checkpoint} must include a required action when it fails.`);
    }
  }
  const releaseRecommendation = getSection(content, '## Release Recommendation');
  if (!hasNonEmptyBullet(releaseRecommendation)) {
    failures.push('Release Recommendation is required.');
  }
  return { ok: failures.length === 0, failures };
}

export function validateCheckpointDelta(content) {
  const failures = [];
  const blockingSection = getSection(content, '## Blocking Checkpoint Resolution');
  const explicitNone = /\bnone\b/i.test(blockingSection);
  const rawRows = extractTableRows(blockingSection, 4);
  const blockingRows = rawRows.map((cells) => {
    const status = String(cells[cells.length - 1] || '').toLowerCase();
    const changeSummary = cells.length >= 5 ? cells[3] : cells[2];
    return {
      checkpointId: cells[0],
      changeSummary: String(changeSummary || '').trim(),
      status,
    };
  });
  if (blockingRows.length === 0 && !explicitNone) {
    failures.push('Blocking Checkpoint Resolution must contain at least one row or explicit none marker.');
  }
  for (const row of blockingRows) {
    if (row.status === 'resolved' && (!row.changeSummary || /^(none|no change|unchanged)$/i.test(row.changeSummary))) {
      failures.push(`${row.checkpointId} is marked resolved without a recorded change.`);
    }
  }
  const finalDisposition = getSection(content, '## Final Disposition');
  if (!hasNonEmptyBullet(finalDisposition)) {
    failures.push('Final Disposition is required.');
  } else {
    const { values, invalid } = parseDisposition(finalDisposition, ['accept', 'return phase5a', 'return phase5b']);
    if (values.length === 0) {
      failures.push('Final Disposition must contain one disposition bullet.');
    }
    if (values.length > 1) {
      failures.push('Final Disposition must contain exactly one disposition bullet.');
    }
    if (invalid.length > 0) {
      failures.push(`Final Disposition has invalid disposition: ${invalid.join(', ')}`);
    }
  }
  return { ok: failures.length === 0, failures };
}

export function validateFinalLayering(content) {
  const failures = [];
  if (stripHtmlComments(content).includes('->')) {
    failures.push('Final draft must not contain compressed arrow-chain steps.');
  }

  const blocks = nestedBlocks(content);
  for (const block of blocks) {
    const isCanonical = CANONICAL_TOP_LAYERS.includes(block.title);
    const subcategoryLines = block.lines.filter((line) => bulletIndent(line) === 4);
    const scenarioLines = block.lines.filter((line) => bulletIndent(line) === 8);
    const hasSubcategoryLayer = subcategoryLines.some((line) => !/<P\d+>/i.test(line));
    const hasScenarioLayer = scenarioLines.some((line) => /<P\d+>/i.test(line));
    if (isCanonical && (!hasSubcategoryLayer || !hasScenarioLayer)) {
      failures.push(`Final draft top layer "${block.title}" must preserve the subcategory layer and scenario layer.`);
    }
    if (!isCanonical && !normalizeContent(content).includes('top_layer_exception')) {
      failures.push(`Final draft uses non-canonical top-layer label without exception comment: ${block.title}`);
    }
  }

  return { ok: failures.length === 0, failures };
}

export function validateQualityDelta(content) {
  const options = arguments[1] || {};
  const failures = [];
  const finalLayerAudit = getSection(content, '## Final Layer Audit');
  const fewShots = getSection(content, '## Few-Shot Rewrite Applications');
  const verdict = getSection(content, '## Verdict');
  if (!hasNonEmptyBullet(finalLayerAudit)) {
    failures.push('Final Layer Audit is required.');
  }
  if (!hasNonEmptyBullet(fewShots)) {
    failures.push('Few-Shot Rewrite Applications are required.');
  }
  if (!hasNonEmptyBullet(verdict)) {
    failures.push('Verdict is required.');
  }
  const topics = Array.isArray(options.deep_research_topics) ? options.deep_research_topics : [];
  const hasSupportingContext = Boolean(options.hasSupportingContext);
  const requireSupportDerived = hasSupportingContext;
  const requireWorkstation = topics.includes('report_editor_workstation_functionality');
  const requireLibraryVsWorkstation = topics.includes('report_editor_library_vs_workstation_gap');
  if (requireSupportDerived || requireWorkstation || requireLibraryVsWorkstation) {
    const text = normalizeContent(content).toLowerCase();
    if (requireSupportDerived && !text.includes('support-derived')) {
      failures.push('Quality delta must explicitly record preservation of support-derived scenarios.');
    }
    if (requireWorkstation && !text.includes('workstation')) {
      failures.push('Quality delta must explicitly record preservation of Workstation functionality scenarios.');
    }
    if (requireLibraryVsWorkstation && !text.includes('library-vs-workstation') && !text.includes('library vs workstation')) {
      failures.push('Quality delta must explicitly record preservation of Library-vs-Workstation gap scenarios.');
    }
  }
  return { ok: failures.length === 0, failures };
}
