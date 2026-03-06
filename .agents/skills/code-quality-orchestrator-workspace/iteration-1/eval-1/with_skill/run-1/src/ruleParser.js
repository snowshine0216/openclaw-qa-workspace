const RULE_PATTERN = /^([A-Za-z_][A-Za-z0-9_]*)\s*(>=|<=|==|>|<)\s*(-?\d+(?:\.\d+)?)\s*=>\s*([A-Za-z0-9_-]+)\s*$/;

function formatLineSuffix(lineNumber) {
  return typeof lineNumber === 'number' ? ` at line ${lineNumber}` : '';
}

function buildParseError(message, lineNumber) {
  return new Error(`${message}${formatLineSuffix(lineNumber)}`);
}

function assertRuleLineType(line, lineNumber) {
  if (typeof line !== 'string') {
    throw buildParseError('Rule line must be a string', lineNumber);
  }
}

function parseRuleMatch(trimmedLine, lineNumber) {
  const match = trimmedLine.match(RULE_PATTERN);
  if (!match) {
    throw buildParseError('Invalid rule format', lineNumber);
  }
  return match;
}

function parseThreshold(rawThreshold, lineNumber) {
  const threshold = Number(rawThreshold);
  if (!Number.isFinite(threshold)) {
    throw buildParseError('Invalid threshold', lineNumber);
  }
  return threshold;
}

function parseRuleLine(line, lineNumber) {
  assertRuleLineType(line, lineNumber);
  const [, metric, operator, rawThreshold, action] = parseRuleMatch(
    line.trim(),
    lineNumber
  );

  return {
    metric,
    operator,
    threshold: parseThreshold(rawThreshold, lineNumber),
    action,
    lineNumber,
  };
}

module.exports = {
  parseRuleLine,
};
