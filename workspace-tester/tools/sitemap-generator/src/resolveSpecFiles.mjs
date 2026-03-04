import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { listGitHubDirectory } from './github.mjs';
import { getDomainConfigEntry } from './domainConfig.mjs';
import { getGitHubApiPath, resolveDomains } from './resolvePomFiles.mjs';

const SPEC_FILE_RE = /\.(?:spec\.)?(?:ts|js)$/i;

/**
 * Resolve spec files for configured domains.
 * @param {string} repoSource
 * @param {string[]} domains
 * @param {{
 *   listRemoteDirectory?: typeof listGitHubDirectory,
 *   log?: (message: string) => void
 * }} [deps]
 * @returns {Promise<Array<{domain: string, filePath: string, fileName: string, isRemote: boolean}>>}
 */
export async function resolveSpecFiles(repoSource, domains, deps = {}) {
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
    log(`[resolveSpecFiles] ${domain}: scanning configured spec paths...`);
    const entries = isRemote
      ? await collectRemoteSpecEntries(apiBasePath, domain, listRemote, log)
      : await collectLocalSpecEntries(repoSource, domain, log);
    log(`[resolveSpecFiles] ${domain}: resolved ${entries.length} spec files`);
    out.push(...entries);
  }

  return out;
}

async function collectLocalSpecEntries(repoPath, domain, log) {
  const specPaths = getDomainConfigEntry(domain)?.specPaths ?? [];
  const out = [];
  for (const relPath of specPaths) {
    log(`[resolveSpecFiles] ${domain}: path ${relPath}`);
    const entries = await readLocalSpecPath(path.join(repoPath, relPath), domain);
    out.push(...entries);
  }
  return out;
}

async function readLocalSpecPath(targetPath, domain) {
  try {
    const stats = await fs.stat(targetPath);
    if (stats.isFile()) {
      return SPEC_FILE_RE.test(targetPath) ? [toEntry(domain, targetPath, false)] : [];
    }
    if (!stats.isDirectory()) {
      return [];
    }
    const files = await collectLocalSpecCandidates(targetPath);
    return files.map((filePath) => toEntry(domain, filePath, false));
  } catch {
    return [];
  }
}

async function collectLocalSpecCandidates(dirPath) {
  const items = await fs.readdir(dirPath, { withFileTypes: true });
  const nested = await Promise.all(
    items.map(async (item) => {
      const fullPath = path.join(dirPath, item.name);
      if (item.isDirectory()) {
        return collectLocalSpecCandidates(fullPath);
      }
      return item.isFile() && SPEC_FILE_RE.test(item.name) ? [fullPath] : [];
    })
  );
  return nested.flat();
}

async function collectRemoteSpecEntries(apiBasePath, domain, listRemoteDirectory, log) {
  const specPaths = getDomainConfigEntry(domain)?.specPaths ?? [];
  const out = [];
  for (const relPath of specPaths) {
    log(`[resolveSpecFiles] ${domain}: path ${relPath}`);
    const entries = await collectRemoteSpecPath(joinApiPath(apiBasePath, relPath), domain, listRemoteDirectory);
    out.push(...entries);
  }
  return out;
}

async function collectRemoteSpecPath(apiPath, domain, listRemoteDirectory) {
  const items = await readRemoteItemsStrict(apiPath, listRemoteDirectory);
  const nested = await Promise.all(
    items.map(async (item) => {
      if (item.type === 'file') {
        return SPEC_FILE_RE.test(item.name) ? [toEntry(domain, item.url ?? apiPath, true, item.name)] : [];
      }
      if (item.type === 'dir') {
        return collectRemoteSpecPath(item.url ?? joinApiPath(apiPath, item.name), domain, listRemoteDirectory);
      }
      return [];
    })
  );
  return nested.flat();
}

function toEntry(domain, filePath, isRemote, fileName = path.basename(filePath)) {
  return { domain, filePath, fileName, isRemote };
}

function isGitHubRepoSource(repoSource) {
  try {
    getGitHubApiPath(repoSource);
    return true;
  } catch {
    return false;
  }
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
