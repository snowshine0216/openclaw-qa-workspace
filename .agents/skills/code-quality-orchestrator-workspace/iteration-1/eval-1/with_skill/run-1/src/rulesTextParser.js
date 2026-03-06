const { parseRuleLine } = require('./ruleParser');

function assertTextInput(text) {
  if (typeof text !== 'string') {
    throw new Error('Rules text must be a string');
  }
}

function isIgnorableLine(line) {
  const trimmed = line.trim();
  return !trimmed || trimmed.startsWith('#');
}

function stripParserLineSuffix(message) {
  return message.replace(/\s+at line \d+$/, '');
}

function wrapSourceError(error, sourceName, lineNumber) {
  const baseMessage = stripParserLineSuffix(error.message);
  return new Error(`${sourceName}:line ${lineNumber}: ${baseMessage}`);
}

function parseRulesText(text, sourceName = 'rules-text') {
  assertTextInput(text);
  const lines = text.split(/\r?\n/);
  const parsed = [];

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    if (isIgnorableLine(line)) {
      return;
    }

    try {
      parsed.push(parseRuleLine(line, lineNumber));
    } catch (error) {
      throw wrapSourceError(error, sourceName, lineNumber);
    }
  });

  return parsed;
}

module.exports = {
  parseRulesText,
};
