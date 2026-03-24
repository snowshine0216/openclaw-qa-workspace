function normalizeExpectationText(value) {
  return String(value || '').trim();
}

function buildExpectationDescriptors(expectations = []) {
  return expectations.map((text, index) => ({
    id: `exp-${index + 1}`,
    text: normalizeExpectationText(text),
  }));
}

function buildMissingExpectation(expected) {
  return {
    id: expected.id,
    text: expected.text,
    passed: false,
    evidence: 'Grader response omitted this expectation.',
  };
}

function normalizeExpectationResult(expectation, fallback) {
  return {
    id: normalizeExpectationText(expectation?.id || fallback?.id),
    text: normalizeExpectationText(expectation?.text || fallback?.text),
    passed: Boolean(expectation?.passed),
    evidence: String(expectation?.evidence || '').trim() || 'No evidence provided.',
  };
}

function alignExpectationResults(expectations, gradedExpectations = []) {
  const expected = buildExpectationDescriptors(expectations);
  const remaining = gradedExpectations.map((entry) => ({ ...entry }));
  const aligned = [];

  for (const descriptor of expected) {
    const index = remaining.findIndex((entry) => normalizeExpectationText(entry?.id) === descriptor.id);
    if (index >= 0) {
      aligned.push(normalizeExpectationResult(remaining[index], descriptor));
      remaining.splice(index, 1);
      continue;
    }
    aligned.push(null);
  }

  for (let i = 0; i < expected.length; i += 1) {
    if (aligned[i]) continue;
    const descriptor = expected[i];
    const index = remaining.findIndex((entry) => normalizeExpectationText(entry?.text) === descriptor.text);
    if (index >= 0) {
      aligned[i] = normalizeExpectationResult(remaining[index], descriptor);
      remaining.splice(index, 1);
    }
  }

  let fallbackIndex = 0;
  for (let i = 0; i < expected.length; i += 1) {
    if (aligned[i]) continue;
    const descriptor = expected[i];
    if (fallbackIndex < remaining.length) {
      aligned[i] = normalizeExpectationResult(remaining[fallbackIndex], descriptor);
      fallbackIndex += 1;
      continue;
    }
    aligned[i] = buildMissingExpectation(descriptor);
  }

  return aligned;
}

export function parseGradingResponse(raw, expectations) {
  let parsed;
  try {
    const jsonMatch = raw.match(/```(?:json)?\n?([\s\S]+?)```/) || raw.match(/(\{[\s\S]+\})/);
    parsed = JSON.parse(jsonMatch ? jsonMatch[1] : raw);
  } catch {
    const graded = expectations.map((text) => ({
      text,
      passed: false,
      evidence: 'Grader response was not valid JSON.',
    }));
    return {
      expectations: graded,
      summary: { passed: 0, failed: graded.length, total: graded.length, pass_rate: 0 },
      grader_parse_error: true,
      grader_raw_response: raw.slice(0, 2000),
    };
  }

  const graded = alignExpectationResults(expectations, parsed.expectations || []);
  const passed = graded.filter((entry) => entry.passed).length;
  const total = graded.length;
  return {
    ...parsed,
    expectations: graded,
    summary: {
      passed,
      failed: total - passed,
      total,
      pass_rate: total === 0 ? 1 : Number((passed / total).toFixed(4)),
    },
  };
}
