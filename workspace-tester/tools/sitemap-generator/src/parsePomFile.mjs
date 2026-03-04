import fs from 'node:fs/promises';
import path from 'node:path';
import { fetchGitHubFileContent } from './github.mjs';

/**
 * Parse one WDIO page-object file.
 * @param {{domain: string, filePath: string, fileName: string, isRemote: boolean}} entry
 * @param {{fetchRemote?: (apiPath: string) => Promise<string>, readLocal?: (filePath: string) => Promise<string>}} [deps]
 * @returns {Promise<{domain: string, className: string, parentClass: string | null, locators: Array<{name:string,css:string,type:string}>, actions: Array<{name:string,params:string[]}>, subComponents: string[]}>}
 */
export async function parsePomFile(entry, deps = {}) {
  const fetchRemote = deps.fetchRemote ?? fetchGitHubFileContent;
  const readLocal = deps.readLocal ?? ((filePath) => fs.readFile(filePath, 'utf8'));
  const source = entry.isRemote
    ? await fetchRemote(entry.filePath.replace('https://api.github.com/', ''))
    : await readLocal(entry.filePath);

  const fallbackClass = path.parse(entry.fileName).name;
  const classInfo = source.trim()
    ? safeClassInfo(source, fallbackClass)
    : { className: fallbackClass, parentClass: null };

  return {
    domain: entry.domain,
    className: classInfo.className,
    parentClass: classInfo.parentClass,
    locators: extractLocators(source),
    actions: extractActions(source),
    subComponents: extractSubComponents(source),
  };
}

/**
 * Extract class name and parent class.
 * @param {string} source
 * @returns {{ className: string, parentClass: string | null }}
 */
export function extractClassInfo(source) {
  const match = source.match(/class\s+(\w+)(?:\s+extends\s+(\w+))?/);
  if (!match) {
    throw new Error('No class definition found in source');
  }
  return { className: match[1], parentClass: match[2] ?? null };
}

/**
 * Extract locator-like getters that call this.$('<css>').
 * @param {string} source
 * @returns {Array<{ name: string, css: string, type: string }>}
 */
export function extractLocators(source) {
  const locators = [];
  const seen = new Set();

  const methodGetterRe = /get([A-Z][A-Za-z0-9_]*)\s*\(\)\s*\{[^}]*this\.\$\(['"]([^'"]+)['"]\)/gs;
  const propertyGetterRe = /get\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(\)?\s*\{[^}]*this\.\$\(['"]([^'"]+)['"]\)/gs;
  const rootMethodRe = /\b(root|container|panel|widget)\s*\(\)\s*\{[^}]*this\.\$\(['"]([^'"]+)['"]\)/gis;

  appendMatches(locators, seen, source, methodGetterRe, (match) => ({
    name: match[1],
    css: match[2],
    type: inferType(match[2]),
  }));

  appendMatches(locators, seen, source, propertyGetterRe, (match) => ({
    name: normalizeName(match[1]),
    css: match[2],
    type: inferType(match[2]),
  }));

  appendMatches(locators, seen, source, rootMethodRe, (match) => ({
    name: normalizeName(match[1]),
    css: match[2],
    type: inferType(match[2]),
  }));

  return locators;
}

/**
 * Extract async methods and argument names.
 * @param {string} source
 * @returns {Array<{ name: string, params: string[] }>}
 */
export function extractActions(source) {
  const actionRe = /async\s+(\w+)\s*\(([^)]*)\)/g;
  return [...source.matchAll(actionRe)].map((match) => ({
    name: match[1],
    params: match[2].split(',').map((value) => value.trim()).filter(Boolean),
  }));
}

function appendMatches(out, seen, source, regex, toLocator) {
  for (const match of source.matchAll(regex)) {
    const locator = toLocator(match);
    const key = `${locator.name}|${locator.css}`;
    if (!seen.has(key)) {
      seen.add(key);
      out.push(locator);
    }
  }
}

function normalizeName(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function inferType(css) {
  if (/btn|button/i.test(css)) return 'button';
  if (/input|field/i.test(css)) return 'input';
  if (/dropdown|select/i.test(css)) return 'dropdown';
  return 'element';
}

function extractSubComponents(source) {
  const refs = [...source.matchAll(/this\.(\w+(?:Page|Panel|Widget|Container))/g)];
  return [...new Set(refs.map((match) => match[1]))];
}

function safeClassInfo(source, fallbackClass) {
  try {
    return extractClassInfo(source);
  } catch {
    return { className: fallbackClass, parentClass: null };
  }
}
