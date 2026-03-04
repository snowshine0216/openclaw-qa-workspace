import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { listGitHubDirectory } from './github.mjs';
import {
  assertValidDomainsConfig,
  getDomainConfigEntry,
  getDomainKeysInOrder,
} from './domainConfig.mjs';

/**
 * Resolve configured domains from user input.
 * @param {string[]} domains
 * @returns {string[]}
 */
export function resolveDomains(domains) {
  assertValidDomainsConfig();
  if (!Array.isArray(domains) || domains.length === 0) {
    return [];
  }
  return domains.includes('all')
    ? getDomainKeysInOrder()
    : domains.filter((domain) => getDomainConfigEntry(domain) !== undefined);
}

/**
 * Find all POM .js files for given domains (local path or GitHub repo URL).
 * @param {string} repoSource
 * @param {string[]} domains
 * @param {{
 *   listRemoteDirectory?: typeof listGitHubDirectory,
 *   log?: (message: string) => void
 * }} [deps]
 * @returns {Promise<Array<{domain: string, filePath: string, fileName: string, isRemote: boolean}>>}
 */
export async function resolvePomFiles(repoSource, domains, deps = {}) {
  const resolvedDomains = resolveDomains(domains);
  if (resolvedDomains.length === 0) {
    return [];
  }

  const isRemote = isGitHubRepoSource(repoSource);
  if (!isRemote && !existsSync(repoSource)) {
    throw new Error(`Repo not found: ${repoSource}`);
  }

  const apiBasePath = isRemote ? getGitHubApiPath(repoSource) : '';
  const listRemote = deps.listRemoteDirectory ?? listGitHubDirectory;
  const log = deps.log ?? (() => {});
  const out = [];

  for (const domain of resolvedDomains) {
    log(`[resolvePomFiles] ${domain}: scanning configured POM paths...`);
    const entries = isRemote
      ? await collectRemotePomEntries(apiBasePath, domain, listRemote, log)
      : await collectLocalPomEntries(repoSource, domain, log);
    log(`[resolvePomFiles] ${domain}: resolved ${entries.length} POM files`);
    out.push(...entries);
  }

  return out;
}

/** Convert GitHub URL to API base path. */
export function getGitHubApiPath(url) {
  const parsed = parseGitHubRepoSource(url);
  if (!parsed) {
    throw new Error(`Invalid GitHub repository source: ${url}`);
  }
  return `repos/${parsed.owner}/${parsed.repo}/contents/tests/wdio`;
}

function isGitHubRepoSource(repoSource) {
  return parseGitHubRepoSource(repoSource) !== null;
}

async function collectLocalPomEntries(repoPath, domain, log) {
  const pomPaths = getDomainConfigEntry(domain)?.pomPaths ?? [];
  const out = [];
  for (const relPath of pomPaths) {
    log(`[resolvePomFiles] ${domain}: path ${relPath}`);
    const entries = await readLocalPomPath(path.join(repoPath, relPath), domain);
    out.push(...entries);
  }
  return out;
}

async function readLocalPomPath(targetPath, domain) {
  try {
    const stats = await fs.stat(targetPath);
    if (stats.isFile()) {
      return targetPath.endsWith('.js') ? [toEntry(domain, targetPath, false)] : [];
    }
    if (!stats.isDirectory()) {
      return [];
    }
    const jsFiles = await collectLocalJsFiles(targetPath);
    return jsFiles.map((filePath) => toEntry(domain, filePath, false));
  } catch {
    return [];
  }
}

async function collectLocalJsFiles(dirPath) {
  const items = await fs.readdir(dirPath, { withFileTypes: true });
  const nested = await Promise.all(
    items.map(async (item) => {
      const fullPath = path.join(dirPath, item.name);
      if (item.isDirectory()) {
        return collectLocalJsFiles(fullPath);
      }
      return item.isFile() && item.name.endsWith('.js') ? [fullPath] : [];
    })
  );
  return nested.flat();
}

async function collectRemotePomEntries(apiBasePath, domain, listRemoteDirectory, log) {
  const pomPaths = getDomainConfigEntry(domain)?.pomPaths ?? [];
  const out = [];
  for (const relPath of pomPaths) {
    log(`[resolvePomFiles] ${domain}: path ${relPath}`);
    const entries = await collectRemotePomPath(joinApiPath(apiBasePath, relPath), domain, listRemoteDirectory);
    out.push(...entries);
  }
  return out;
}

async function collectRemotePomPath(apiPath, domain, listRemoteDirectory) {
  const items = await readRemoteItemsStrict(apiPath, listRemoteDirectory);
  const nested = await Promise.all(
    items.map(async (item) => {
      if (item.type === 'file') {
        return item.name.endsWith('.js') ? [toEntry(domain, item.url ?? apiPath, true, item.name)] : [];
      }
      if (item.type === 'dir') {
        return collectRemotePomPath(item.url ?? joinApiPath(apiPath, item.name), domain, listRemoteDirectory);
      }
      return [];
    })
  );
  return nested.flat();
}

function toEntry(domain, filePath, isRemote, fileName = path.basename(filePath)) {
  return { domain, filePath, fileName, isRemote };
}

function joinApiPath(basePath, relPath) {
  return `${basePath}/${relPath.replace(/^\/+/, '')}`;
}

async function readRemoteItemsStrict(apiPath, listRemoteDirectory) {
  try {
    const items = await listRemoteDirectory(apiPath);
    return Array.isArray(items) ? items : [items];
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Remote listing failed for ${apiPath}: ${message}`);
  }
}

function parseGitHubRepoSource(repoSource) {
  const patterns = [
    /^https:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?(?:\/)?$/i,
    /^git@github\.com:([^/]+)\/([^/]+?)(?:\.git)?$/i,
    /^ssh:\/\/git@github\.com\/([^/]+)\/([^/]+?)(?:\.git)?(?:\/)?$/i,
  ];

  for (const pattern of patterns) {
    const match = repoSource.match(pattern);
    if (match) {
      return { owner: match[1], repo: match[2] };
    }
  }
  return null;
}
