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

function normalizeContent(content) {
  return String(content || '').replace(/\r\n/g, '\n');
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
