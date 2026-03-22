import { readdir, readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

const STOP_WORDS = new Set([
  'the',
  'and',
  'with',
  'that',
  'this',
  'then',
  'from',
  'into',
  'only',
  'does',
  'doesnt',
  'remain',
  'remains',
  'become',
  'becomes',
  'stays',
  'stay',
  'aligned',
  'output',
  'explicitly',
  'covered',
  'case',
  'focus',
  'primary',
  'phase',
]);

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function tokenize(value) {
  return normalizeText(value)
    .split(/\s+/)
    .filter((token) => token.length >= 3 && !STOP_WORDS.has(token));
}

function uniqueTokens(value) {
  return [...new Set(tokenize(value))];
}

function matchedTokens(tokens, corpus) {
  return tokens.filter((token) => corpus.includes(token));
}

export async function buildLocalGradingCorpus(outputsDir) {
  const entries = await readdir(outputsDir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (!entry.isFile()) {
      continue;
    }
    const extension = extname(entry.name).toLowerCase();
    if (!['.md', '.txt', '.json'].includes(extension)) {
      continue;
    }

    const path = join(outputsDir, entry.name);
    const content = await readFile(path, 'utf8').catch(() => '');
    files.push({
      name: entry.name,
      path,
      content,
      normalized: normalizeText(content),
    });
  }

  return {
    files,
    combined: normalizeText(files.map((file) => `${file.name}\n${file.content}`).join('\n')),
  };
}

function gradeFocusExpectation(expectationText, corpus) {
  const match = expectationText.match(/Case focus is explicitly covered:\s*(.+)$/i);
  if (!match) {
    return null;
  }

  const focus = match[1].trim();
  const normalizedFocus = normalizeText(focus);
  if (normalizedFocus && corpus.combined.includes(normalizedFocus)) {
    return {
      passed: true,
      evidence: `Exact focus phrase found in outputs: ${focus}`,
    };
  }

  const tokens = uniqueTokens(focus);
  const matched = matchedTokens(tokens, corpus.combined);
  const threshold = tokens.length <= 2
    ? tokens.length
    : Math.max(2, Math.ceil(tokens.length * 0.5));

  return {
    passed: matched.length >= threshold,
    evidence: matched.length > 0
      ? `Matched focus tokens in outputs: ${matched.join(', ')}`
      : `No deterministic focus-token match found for: ${focus}`,
  };
}

function gradePhaseExpectation(expectationText, request, corpus) {
  const match = expectationText.match(/Output aligns with primary phase\s+(.+)$/i);
  if (!match) {
    return null;
  }

  const phase = String(match[1] || request.primary_phase || '').trim();
  const normalizedPhase = normalizeText(phase);
  const phasePresent = normalizedPhase && corpus.combined.includes(normalizedPhase);
  const phaseFileMatch = corpus.files.find((file) => normalizeText(file.name).includes(normalizedPhase));

  return {
    passed: Boolean(phasePresent || phaseFileMatch),
    evidence: phasePresent
      ? `Primary phase token found in output content: ${phase}`
      : phaseFileMatch
        ? `Primary phase token found in output filename: ${phaseFileMatch.name}`
        : `No deterministic primary-phase marker found for: ${phase}`,
  };
}

function gradeGenericExpectation(expectationText, corpus) {
  const tokens = uniqueTokens(expectationText);
  const matched = matchedTokens(tokens, corpus.combined);
  const threshold = Math.max(2, Math.ceil(tokens.length * 0.4));
  return {
    passed: matched.length >= threshold,
    evidence: matched.length > 0
      ? `Matched generic expectation tokens in outputs: ${matched.join(', ')}`
      : 'No deterministic generic-token match found for expectation.',
  };
}

export function gradeExpectation(expectationText, request, corpus) {
  return (
    gradeFocusExpectation(expectationText, corpus)
    || gradePhaseExpectation(expectationText, request, corpus)
    || gradeGenericExpectation(expectationText, corpus)
  );
}

export function buildLocalBenchmarkGrading(request, corpus) {
  const expectations = (request.expectations || []).map((text) => {
    const result = gradeExpectation(text, request, corpus);
    return {
      text,
      passed: result.passed,
      evidence: result.evidence,
    };
  });

  const passed = expectations.filter((entry) => entry.passed).length;
  const failed = expectations.length - passed;
  const total = expectations.length;
  const totalOutputChars = corpus.files.reduce((sum, file) => sum + file.content.length, 0);

  return {
    expectations,
    summary: {
      passed,
      failed,
      total,
      pass_rate: total === 0 ? 1 : Number((passed / total).toFixed(4)),
    },
    execution_metrics: {
      tool_calls: {
        Read: 0,
        Write: 0,
        Bash: 0,
      },
      total_tool_calls: 0,
      total_steps: 1,
      errors_encountered: 0,
      output_chars: totalOutputChars,
      transcript_chars: 0,
    },
    user_notes_summary: {
      uncertainties: [
        'Local heuristic grader used instead of Codex-backed grading due external grader instability.',
      ],
      needs_review: [],
      workarounds: [
        'Expectation scoring is based on deterministic token and phrase matching over output artifacts.',
      ],
    },
  };
}
