import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import domainsConfig from './config/domains.json' with { type: 'json' };
import { checkGhAuth } from './src/github.mjs';
import { resolvePomFiles, resolveDomains } from './src/resolvePomFiles.mjs';
import { parsePomFile } from './src/parsePomFile.mjs';
import { buildDomainSheet } from './src/buildDomainSheet.mjs';
import { buildCompactSitemap } from './src/buildCompactSitemap.mjs';
import { saveKnowledgeToFile } from './src/saveKnowledgeToFile.mjs';

/**
 * CLI entrypoint.
 * @param {string[]} argv
 * @returns {Promise<void>}
 */
export async function main(argv) {
  const { values } = parseArgs({
    args: argv,
    options: {
      repo: { type: 'string' },
      'repo-url': { type: 'string' },
      domains: { type: 'string' },
      'output-dir': { type: 'string', default: 'memory/site-knowledge' },
    },
    allowPositionals: false,
  });

  const domains = (values.domains ?? '').split(',').map((value) => value.trim()).filter(Boolean);
  if (domains.length === 0) {
    throw new Error('Must provide --domains <csv|all>');
  }

  let repoSource = values.repo;
  if (values['repo-url']) {
    checkGhAuth();
    repoSource = values['repo-url'];
    console.log(`Connecting to GitHub API for ${repoSource}...`);
  }
  if (!repoSource) {
    throw new Error('Must provide either --repo <path> or --repo-url <url>');
  }

  const entries = await resolvePomFiles(repoSource, domains);
  const grouped = groupEntriesByDomain(entries);
  const domainsToRender = domains.includes('all')
    ? Object.keys(domainsConfig.domains)
    : resolveDomains(domains);

  const domainSheets = await Promise.all(
    domainsToRender.map(async (domain) => {
      const files = grouped.get(domain) ?? [];
      const summaries = await Promise.all(files.map((entry) => parsePomFile(entry)));
      return buildDomainSheet(domain, summaries);
    })
  );

  const sitemap = buildCompactSitemap(domainSheets, repoSource);
  const metadata = {
    generatedAt: new Date().toISOString(),
    sourceRepo: repoSource,
    domains: Object.fromEntries(
      domainSheets.map((sheet) => [
        sheet.domain,
        { componentCount: sheet.componentCount, filePath: `${sheet.domain}.md` },
      ])
    ),
  };

  const result = await saveKnowledgeToFile(values['output-dir'], domainSheets, sitemap, metadata);
  console.log(`Written ${result.filesWritten.length} files to ${result.outputDir}`);
}

function groupEntriesByDomain(entries) {
  const grouped = new Map();
  for (const entry of entries) {
    const current = grouped.get(entry.domain) ?? [];
    current.push(entry);
    grouped.set(entry.domain, current);
  }
  return grouped;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
