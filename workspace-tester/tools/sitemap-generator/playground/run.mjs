import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { main } from '../generate-sitemap.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SAMPLE_REPO = path.join(HERE, 'sample-repo');
const OUTPUT_DIR = path.join(HERE, 'output');

const args = process.argv.slice(2).length
  ? process.argv.slice(2)
  : await defaultArgs();

await cleanOutputDir(OUTPUT_DIR);
await main(args);
console.log(`Check ${OUTPUT_DIR} for generated files.`);

async function defaultArgs() {
  const pageObjectsPath = path.join(SAMPLE_REPO, 'pageObjects');
  const entries = await fs.readdir(pageObjectsPath, { withFileTypes: true });
  const domains = entries
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b))
    .join(',');
  return ['--repo', SAMPLE_REPO, '--domains', domains, '--output-dir', OUTPUT_DIR];
}

async function cleanOutputDir(outputDir) {
  await fs.mkdir(outputDir, { recursive: true });
  const entries = await fs.readdir(outputDir);
  await Promise.all(
    entries
      .filter((entry) => entry !== '.gitkeep')
      .map((entry) => fs.rm(path.join(outputDir, entry), { recursive: true, force: true }))
  );
}
