import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { main } from '../scripts/generate-domains-config.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SAMPLE_REPO = path.join(HERE, 'sample-repo');
const OUTPUT_FILE = path.join(HERE, 'output', 'domains.sample.json');

const args = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ['--repo', SAMPLE_REPO, '--output', OUTPUT_FILE];

await main(args);
console.log(`Check ${OUTPUT_FILE} for generated domain config.`);
