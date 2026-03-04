import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { checkGhAuth, listGitHubDirectory } from '../src/github.mjs';
import { getGitHubApiPath } from '../src/resolvePomFiles.mjs';

/**
 * Create domains config from discovered pageObjects/specs-regression trees.
 * @param {string[]} domainDirs
 * @param {string[]} regressionDirs
 * @returns {{domains: Record<string, {pomPaths: string[], specPaths: string[], navigationHint: string}>}}
 */
export function buildDomainsConfig(domainDirs, regressionDirs) {
  const sortedDomains = [...domainDirs].sort((a, b) => a.localeCompare(b));
  const domains = {};

  for (const domain of sortedDomains) {
    domains[domain] = {
      pomPaths: [`pageObjects/${domain}`],
      specPaths: matchSpecPaths(domain, regressionDirs).map((p) => `specs/regression/${p}`),
      navigationHint: `Auto-generated from pageObjects/${domain}`,
    };
  }

  return { domains };
}

/**
 * Normalize names for fuzzy matching.
 * @param {string} text
 * @returns {string}
 */
export function normalize(text) {
  return text.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Match a pageObjects domain to regression folders.
 * @param {string} domain
 * @param {string[]} regressionDirs
 * @returns {string[]}
 */
export function matchSpecPaths(domain, regressionDirs) {
  const domainNorm = normalize(domain);
  const scored = [];

  for (const dir of regressionDirs) {
    const segs = dir.split('/');
    const segNorms = segs.map(normalize);
    const firstNorm = segNorms[0] ?? '';
    const fullNorm = normalize(dir);

    let score = 0;
    if (segs[0]?.toLowerCase() === domain.toLowerCase()) {
      score = 4;
    } else if (firstNorm === domainNorm) {
      score = 3;
    } else if (segNorms.includes(domainNorm)) {
      score = 2;
    } else if (domainNorm.length >= 4 && fullNorm.includes(domainNorm)) {
      score = 1;
    }

    if (score > 0) {
      scored.push({ dir, score });
    }
  }

  return [
    ...new Set(scored.sort((a, b) => b.score - a.score || a.dir.localeCompare(b.dir)).map((v) => v.dir)),
  ];
}

/**
 * Collect domain/spec directory names from a local repo.
 * @param {string} repoRoot
 * @returns {Promise<{domainDirs: string[], regressionDirs: string[]}>}
 */
export async function collectLocalTree(repoRoot) {
  const pageObjectsRoot = path.join(repoRoot, 'pageObjects');
  const regressionRoot = path.join(repoRoot, 'specs', 'regression');
  const domainDirs = await listDirectSubdirs(pageObjectsRoot);
  const regressionDirs = await listAllSubdirs(regressionRoot);
  return { domainDirs, regressionDirs };
}

/**
 * Collect domain/spec directory names from a GitHub repo via gh api.
 * @param {string} repoUrl
 * @param {{ listRemoteDirectory?: typeof listGitHubDirectory }} [deps]
 * @returns {Promise<{domainDirs: string[], regressionDirs: string[]}>}
 */
export async function collectRemoteTree(repoUrl, deps = {}) {
  const listRemote = deps.listRemoteDirectory ?? listGitHubDirectory;
  const baseApiPath = getGitHubApiPath(repoUrl);
  const domainDirs = await listRemoteDirectSubdirs(`${baseApiPath}/pageObjects`, listRemote);
  const regressionDirs = await listRemoteAllSubdirs(`${baseApiPath}/specs/regression`, listRemote);
  return { domainDirs, regressionDirs };
}

/**
 * CLI entrypoint.
 * @param {string[]} argv
 * @param {{
 *   checkAuth?: typeof checkGhAuth,
 *   listRemoteDirectory?: typeof listGitHubDirectory,
 *   writer?: (outputFile: string, content: string) => Promise<void>
 * }} [deps]
 */
export async function main(argv, deps = {}) {
  const { values } = parseArgs({
    args: argv,
    options: {
      repo: { type: 'string', default: '../../projects/wdio' },
      'repo-url': { type: 'string' },
      output: { type: 'string', default: './config/domains.json' },
    },
  });

  const outputFile = path.resolve(process.cwd(), values.output);
  const writer = deps.writer ?? writeOutput;

  let tree;
  if (values['repo-url']) {
    const checkAuth = deps.checkAuth ?? checkGhAuth;
    checkAuth();
    tree = await collectRemoteTree(values['repo-url'], {
      listRemoteDirectory: deps.listRemoteDirectory,
    });
  } else {
    const repoRoot = path.resolve(process.cwd(), values.repo);
    tree = await collectLocalTree(repoRoot);
  }

  const domainsConfig = buildDomainsConfig(tree.domainDirs, tree.regressionDirs);
  await writer(outputFile, `${JSON.stringify(domainsConfig, null, 2)}\n`);

  console.log(`Generated domains.json with ${tree.domainDirs.length} domains.`);
  console.log(`Output: ${outputFile}`);
}

async function writeOutput(outputFile, content) {
  await fs.mkdir(path.dirname(outputFile), { recursive: true });
  await fs.writeFile(outputFile, content, 'utf8');
}

async function listDirectSubdirs(rootDir) {
  const entries = await fs.readdir(rootDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
}

async function listAllSubdirs(rootDir) {
  const out = [];

  async function walk(current, relative) {
    let entries;
    try {
      entries = await fs.readdir(current, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (!entry.isDirectory() || entry.name.startsWith('.')) {
        continue;
      }
      const nextRel = relative ? `${relative}/${entry.name}` : entry.name;
      out.push(nextRel);
      await walk(path.join(current, entry.name), nextRel);
    }
  }

  await walk(rootDir, '');
  return out.sort((a, b) => a.localeCompare(b));
}

async function listRemoteDirectSubdirs(apiPath, listRemoteDirectory) {
  const items = await normalizeRemoteItems(apiPath, listRemoteDirectory);
  return items
    .filter((item) => item.type === 'dir')
    .map((item) => item.name)
    .sort((a, b) => a.localeCompare(b));
}

async function listRemoteAllSubdirs(apiPath, listRemoteDirectory) {
  const out = [];

  async function walk(currentApiPath, relative) {
    const items = await normalizeRemoteItems(currentApiPath, listRemoteDirectory);
    for (const item of items) {
      if (item.type !== 'dir') {
        continue;
      }
      const nextRel = relative ? `${relative}/${item.name}` : item.name;
      out.push(nextRel);
      await walk(item.url ?? `${currentApiPath}/${item.name}`, nextRel);
    }
  }

  await walk(apiPath, '');
  return out.sort((a, b) => a.localeCompare(b));
}

async function normalizeRemoteItems(apiPath, listRemoteDirectory) {
  try {
    const items = await listRemoteDirectory(apiPath);
    return Array.isArray(items) ? items : [items];
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Remote listing failed for ${apiPath}: ${message}`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
