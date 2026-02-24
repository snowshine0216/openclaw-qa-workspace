const { truncate, sanitizeConsoleLog } = require('./sanitizer');
const { main: generateReport } = require('./generator');
const {
  parseMarkdownLink,
  parseInlineContent,
  createTable,
  processTokens,
  main: convertToDocx
} = require('./docx_converter');

module.exports = {
  truncate,
  sanitizeConsoleLog,
  generateReport,
  parseMarkdownLink,
  parseInlineContent,
  createTable,
  processTokens,
  convertToDocx
};
