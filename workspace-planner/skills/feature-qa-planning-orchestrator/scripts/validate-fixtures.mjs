import { readFileSync } from 'node:fs';
import { validateTestCaseMarkdown } from './lib/testCaseRules.mjs';

const file = process.argv[2] || new URL('../templates/test-case-template.md', import.meta.url);
const markdown = readFileSync(file, 'utf8');
const result = validateTestCaseMarkdown(markdown);
console.log(JSON.stringify(result, null, 2));
if (!result.ok) {
  process.exitCode = 1;
}
