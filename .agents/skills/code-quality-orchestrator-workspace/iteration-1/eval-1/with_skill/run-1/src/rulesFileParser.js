const fs = require('node:fs/promises');
const { parseRulesText } = require('./rulesTextParser');

async function parseRulesFile(filePath) {
  const content = await fs.readFile(filePath, 'utf8');
  return parseRulesText(content, filePath);
}

module.exports = {
  parseRulesFile,
};
