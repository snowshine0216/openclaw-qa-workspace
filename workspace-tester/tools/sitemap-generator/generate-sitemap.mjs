import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { checkGhAuth } from './src/github.mjs';
import { resolvePomFiles, resolveDomains } from './src/resolvePomFiles.mjs';
import { resolveSpecFiles } from './src/resolveSpecFiles.mjs';
import { parsePomFile } from './src/parsePomFile.mjs';
import { parseSpecFile } from './src/parseSpecFile.mjs';
import { buildDomainKnowledge } from './src/buildDomainKnowledge.mjs';
import { buildDomainSheet } from './src/buildDomainSheet.mjs';
import { buildCompactSitemap } from './src/buildCompactSitemap.mjs';
import { saveKnowledgeToFile } from './src/saveKnowledgeToFile.mjs';
import { assertValidDomainsConfig } from './src/domainConfig.mjs';

/**
 * CLI entrypoint.
 * @param {string[]} argv
 * @param {{
 *   now?: () => Date | string,
 *   parsePom?: typeof parsePomFile,
 *   parseSpec?: typeof parseSpecFile
 * }} [deps]
 * @returns {Promise<void>}
 */
export async function main(argv, deps = {}) {
  assertValidDomainsConfig();
  const log = deps.log ?? console.log;

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

  const domains = (values.domains ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  if (domains.length === 0) {
    throw new Error('Must provide --domains <csv|all>');
  }

  let repoSource = values.repo;
  if (values['repo-url']) {
    checkGhAuth();
    repoSource = values['repo-url'];
    log(`Connecting to GitHub API for ${repoSource}...`);
  }
  if (!repoSource) {
    throw new Error('Must provide either --repo <path> or --repo-url <url>');
  }

  const domainsToRender = resolveDomains(domains);
  log(`[generate-sitemap] domains to render: ${domainsToRender.length}`);
  const parsePom = deps.parsePom ?? parsePomFile;
  const parseSpec = deps.parseSpec ?? parseSpecFile;
  const resolverLog = (message) => log(`[progress] ${message}`);

  log('[generate-sitemap] resolving POM/spec file entries...');
  const [pomEntries, specEntries] = await Promise.all([
    resolvePomFiles(repoSource, domains, { log: resolverLog }),
    resolveSpecFiles(repoSource, domains, { log: resolverLog }),
  ]);
  log(`[generate-sitemap] resolved entries: ${pomEntries.length} POM, ${specEntries.length} spec`);

  const pomEntriesByDomain = groupEntriesByDomain(pomEntries);
  const specEntriesByDomain = groupEntriesByDomain(specEntries);

  const domainModels = [];
  for (let index = 0; index < domainsToRender.length; index += 1) {
    const domain = domainsToRender[index];
    const domainPrefix = `[domain ${index + 1}/${domainsToRender.length}] ${domain}`;
    const pomFiles = pomEntriesByDomain.get(domain) ?? [];
    const specFiles = specEntriesByDomain.get(domain) ?? [];
    log(`${domainPrefix}: ${pomFiles.length} POM files, ${specFiles.length} spec files`);

    const [pomSummaries, specSummaries] = await Promise.all([
      parseEntriesWithProgress({
        entries: pomFiles,
        parser: parsePom,
        label: 'POM parse',
        domainPrefix,
        log,
      }),
      parseEntriesWithProgress({
        entries: specFiles,
        parser: parseSpec,
        label: 'Spec parse',
        domainPrefix,
        log,
      }),
    ]);

    const model = buildDomainKnowledge(domain, pomSummaries, specSummaries);
    domainModels.push(model);
    log(`${domainPrefix}: model ready (components=${model.componentCount}, workflows=${model.workflows.length}, elements=${model.commonElements.length})`);
  }

  const generatedAt = resolveGeneratedAt(deps.now ?? (() => new Date()));
  log('[generate-sitemap] rendering markdown artifacts...');
  const domainSheets = domainModels.map((model) => buildDomainSheet(model));
  const sitemap = buildCompactSitemap(domainModels, repoSource, { generatedAt });

  const metadata = {
    generatedAt,
    sourceRepo: repoSource,
    domains: Object.fromEntries(
      domainModels.map((model) => [
        model.domain,
        {
          displayName: model.displayName,
          componentCount: model.componentCount,
          workflowCount: model.workflows.length,
          commonElementCount: model.commonElements.length,
          filePath: `${model.domain}.md`,
        },
      ])
    ),
  };

  log('[generate-sitemap] writing files...');
  const result = await saveKnowledgeToFile(values['output-dir'], domainSheets, sitemap, metadata);
  log(`Written ${result.filesWritten.length} files to ${result.outputDir}`);
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

function resolveGeneratedAt(now) {
  const value = now();
  if (value instanceof Date) {
    return value.toISOString();
  }
  return String(value);
}

async function parseEntriesWithProgress({ entries, parser, label, domainPrefix, log }) {
  const total = entries.length;
  if (total === 0) {
    log(`${domainPrefix} ${label}: 0/0`);
    return [];
  }

  let completed = 0;
  const logEvery = total > 200 ? 25 : 10;
  return Promise.all(
    entries.map(async (entry) => {
      const out = await parser(entry);
      completed += 1;
      if (completed === 1 || completed === total || completed % logEvery === 0) {
        log(`${domainPrefix} ${label}: ${completed}/${total}`);
      }
      return out;
    })
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
