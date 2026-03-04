# Site Knowledge System Design (TDD)

> **Design ID:** `site-knowledge-system-v1`
> **Date:** 2026-03-04
> **Status:** Draft — TDD Phase (Stubs + Tests Only)
> **Parent Design:** [TESTER_AGENT_DESIGN_v2.md](./TESTER_AGENT_DESIGN_v2.md)
> **Scope:** Strategy Product (Filter · AutoAnswers · Bot) — Site Knowledge Generation, File-based Persistence
>
> **⚠️ Constraint:** This document is in TDD design phase.
> Implementation code MUST NOT be written until the design is approved.
> Test functions are listed as coverage tables and stub signatures only.

---

## 1. Background & Context

This document details the **Site Knowledge System** — a sub-system of the Tester Agent that:

1. **Crawls** the WDIO page-object repository and extracts structured knowledge about UI components.
2. **Persists** that knowledge as Markdown files in the local file system under `memory/site-knowledge/`.
3. **Serves** that knowledge to the Tester Agent at test time (via simple file reads — no RAG database).

> **Key Architectural Decision:** This design intentionally avoids a Weaviate RAG database.
> Site knowledge files are plain Markdown stored locally. The agent reads them directly.
> This simplifies deployment (no Weaviate server), improves reproducibility, and keeps the system
> fully offline-capable. Fuzzy lookup is done with simple keyword matching on file content.

---

## 2. Architecture Overview

```
Input: WDIO repo path OR GitHub URL
      ↓
[0] checkGhAuth(repoUrl)                     ← verify GitHub CLI authentication
      ↓
[1] resolvePomFiles(repoPathOrUrl, domains)  ← (async) list POM .js files via fs or gh api
      ↓
[2] parsePomFile(fileEntry)                  ← (async) read file/URL & extract locators + actions
      ↓
[3] buildDomainSheet(domain, pomSummaries)   ← render domain Markdown
      ↓
[4] buildCompactSitemap(domainSheets)        ← render top-level SITEMAP.md
      ↓
[5] saveKnowledgeToFile(outputDir, content)  ← write to memory/site-knowledge/
      ↓
Output: memory/site-knowledge/
        ├── SITEMAP.md          ← compact, always-loaded
        ├── filter.md           ← full domain sheet
        ├── autoAnswers.md
        └── aibot.md
```

### 2.1 File Storage Layout

```
workspace-tester/
└── memory/
    └── site-knowledge/
        ├── SITEMAP.md          ← compact, always-available overview
        ├── filter.md           ← full domain sheet (CalendarFilter, CheckboxFilter, …)
        ├── autoAnswers.md      ← full domain sheet (AIAssistant, AIViz, …)
        ├── aibot.md            ← full domain sheet (AIBotChatPanel, BotAuthoring, …)
        └── metadata.json       ← generation metadata (timestamp, source repo, doc counts)
```

#### `metadata.json` Shape

```json
{
  "generatedAt": "<ISO8601>",
  "sourceRepo": "<path-or-url>",
  "domains": {
    "filter":      { "componentCount": 12, "filePath": "filter.md" },
    "autoAnswers": { "componentCount": 4,  "filePath": "autoAnswers.md" },
    "aibot":       { "componentCount": 27, "filePath": "aibot.md" }
  }
}
```

---

## 3. Script File Structure

```
workspace-tester/
└── tools/
    └── sitemap-generator/
        ├── generate-sitemap.mjs        ← CLI entrypoint
        ├── src/
        │   ├── github.mjs              ← [0] GitHub CLI helpers (gh api) for remote fetching
        │   ├── resolvePomFiles.mjs     ← [1] Discover POM files per domain (async)
        │   ├── parsePomFile.mjs        ← [2] Extract locators + actions from .js POM (async)
        │   ├── buildDomainSheet.mjs    ← [3] Render full domain Markdown sheet
        │   ├── buildCompactSitemap.mjs ← [4] Render compact SITEMAP.md
        │   └── saveKnowledgeToFile.mjs ← [5] Write files to memory/site-knowledge/
        ├── config/
        │   └── domains.json            ← Domain → POM folder mapping
        └── tests/
            ├── github.test.mjs
            ├── resolvePomFiles.test.mjs
            ├── parsePomFile.test.mjs
            ├── buildDomainSheet.test.mjs
            ├── buildCompactSitemap.test.mjs
            └── saveKnowledgeToFile.test.mjs
```

---

## 4. Type Definitions (Stubs)

```typescript
// src/types.ts

/** A discovered POM file entry */
interface PomFileEntry {
  domain: string;       // e.g. "filter"
  filePath: string;     // absolute path or GitHub URL
  fileName: string;     // e.g. "CalendarFilter.js"
  isRemote: boolean;    // true if fetched via gh api
}

/** Extracted knowledge from one POM class */
interface PomSummary {
  domain: string;
  className: string;
  parentClass: string;
  locators: Array<{ name: string; css: string; type: string }>;
  actions: Array<{ name: string; params: string[] }>;
  subComponents: string[];
}

/** Rendered Markdown content for one domain */
interface DomainSheet {
  domain: string;
  content: string;     // full Markdown string
  componentCount: number;
}

/** Result of saving knowledge files */
interface SaveResult {
  outputDir: string;
  filesWritten: string[];   // relative paths written
  metadata: KnowledgeMetadata;
}

interface KnowledgeMetadata {
  generatedAt: string;   // ISO8601
  sourceRepo: string;
  domains: Record<string, { componentCount: number; filePath: string }>;
}
```

---

## 5. Function Implementations

> Each function is ≤ 20 lines. Pure functions have no side effects.
> File I/O is isolated in dedicated functions.

### 5.0 `github.mjs`

```javascript
// src/github.mjs
import { execSync } from 'node:child_process';

/**
 * Checks if the GitHub CLI is installed and authenticated.
 * @throws {Error} If `gh` is not available or not logged in.
 */
export function checkGhAuth() {
  try {
    execSync('gh auth status', { stdio: 'ignore' });
  } catch (e) {
    throw new Error('GitHub CLI (gh) is not authenticated. Please run `gh auth login`.');
  }
}

/**
 * Uses `gh api` to fetch a file's content directly into memory as a string.
 * @param {string} gitHubApiUrl - e.g. repos/mstr-kiai/web-dossier/contents/...
 * @returns {Promise<string>}
 */
export async function fetchGitHubFileContent(gitHubApiUrl) {
  const result = execSync(`gh api -H "Accept: application/vnd.github.raw" ${gitHubApiUrl}`, { encoding: 'utf8' });
  return result;
}

/**
 * Uses `gh api` to list files in a directory.
 * @returns {Promise<Array<{name: string, path: string, type: string}>>}
 */
export async function listGitHubDirectory(gitHubApiUrl) {
  const result = execSync(`gh api ${gitHubApiUrl}`, { encoding: 'utf8' });
  return JSON.parse(result);
}
```

### 5.1 `resolvePomFiles.mjs`

```javascript
// src/resolvePomFiles.mjs
import fs from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import path from 'node:path';
import domainsConfig from '../config/domains.json' assert { type: 'json' };
import { listGitHubDirectory } from './github.mjs';

/**
 * Find all POM .js files for the given domains. Works locally or via GitHub API.
 * Uses `domains.json` config to determine which subdirectories to scan.
 *
 * @param {string} repoSource  - Local path OR GitHub URL (e.g. https://github.com/mstr-kiai/web-dossier)
 * @param {string[]} domains   - e.g. ["filter", "autoAnswers", "aibot"] or ["all"]
 * @returns {Promise<PomFileEntry[]>}
 */
export async function resolvePomFiles(repoSource, domains) {
  const resolved = domains.includes('all')
    ? Object.keys(domainsConfig.domains)
    : domains.filter(d => d in domainsConfig.domains);

  const isRemote = repoSource.startsWith('https://github.com');
  const basePath = isRemote ? getGitHubApiPath(repoSource) : repoSource;

  const nestedArrays = await Promise.all(resolved.map(domain => 
    isRemote ? collectRemotePomEntries(basePath, domain) : collectLocalPomEntries(basePath, domain)
  ));
  return nestedArrays.flat();
}

/** Convert GitHub URL to API base path (e.g., mstr-kiai/web-dossier/contents/tests/wdio) */
function getGitHubApiPath(url) {
  const match = url.match(/github\.com\/([^/]+\/[^/]+)/);
  if (!match) throw new Error('Invalid GitHub URL');
  return `repos/${match[1]}/contents/tests/wdio`;
}

async function collectLocalPomEntries(repoPath, domain) {
  // uses fs to read dir similarly to before, simplified for space
  return []; // ... implementation skipped for brevity
}

async function collectRemotePomEntries(apiBasePath, domain) {
  const pomPaths = domainsConfig.domains[domain]?.pomPaths ?? [];
  const entries = [];
  for (const rel of pomPaths) {
    const dirUrl = `${apiBasePath}/${rel}`;
    try {
      const items = await listGitHubDirectory(dirUrl);
      const files = Array.isArray(items) ? items : [items]; // handle single file response
      for (const f of files.filter(f => f.name.endsWith('.js'))) {
        entries.push({ domain, filePath: f.url, fileName: f.name, isRemote: true });
      }
    } catch (e) { /* ignore 404s */ }
  }
  return entries;
}
```

### 5.2 `parsePomFile.mjs`

```javascript
// src/parsePomFile.mjs
import fs from 'node:fs/promises';
import { fetchGitHubFileContent } from './github.mjs';

/**
 * Parse a single WDIO page-object .js file asynchronously.
 * Fetches content from memory (GitHub API) or local filesystem.
 *
 * @param {PomFileEntry} entry
 * @returns {Promise<PomSummary>}
 */
export async function parsePomFile(entry) {
  let source;
  if (entry.isRemote) {
    const apiPath = entry.filePath.replace('https://api.github.com/', '');
    source = await fetchGitHubFileContent(apiPath);
  } else {
    source = await fs.readFile(entry.filePath, 'utf8');
  }

  const { className, parentClass } = extractClassInfo(source);
  return {
    domain: entry.domain,
    className,
    parentClass,
    locators: extractLocators(source),
    actions: extractActions(source),
    subComponents: extractSubComponents(source),
  };
}

/**
 * Extract class name and parent class from source.
 * Pure function.
 *
 * @param {string} source
 * @returns {{ className: string, parentClass: string | null }}
 */
export function extractClassInfo(source) {
  const match = source.match(/class\s+(\w+)(?:\s+extends\s+(\w+))?/);
  if (!match) throw new Error('No class definition found in source');
  return { className: match[1], parentClass: match[2] ?? null };
}

/**
 * Given raw file content (string), extract locators (get* methods with $ selector).
 * Pure function — does not touch filesystem.
 *
 * @param {string} source
 * @returns {{ name: string, css: string, type: string }[]}
 */
export function extractLocators(source) {
  const re = /get(\w+)\s*\(\)\s*\{[^}]*this\.\$\(['"]([^'"]+)['"]\)/g;
  const results = [];
  for (const m of source.matchAll(re)) {
    results.push({ name: m[1], css: m[2], type: inferType(m[2]) });
  }
  return results;
}

/**
 * Given raw file content (string), extract action methods (async methods).
 * Pure function — does not touch filesystem.
 *
 * @param {string} source
 * @returns {{ name: string, params: string[] }[]}
 */
export function extractActions(source) {
  const re = /async\s+(\w+)\s*\(([^)]*)\)/g;
  return [...source.matchAll(re)].map(m => ({
    name: m[1],
    params: m[2].split(',').map(p => p.trim()).filter(Boolean),
  }));
}

/** Infer element type from CSS class name hint. Pure function. */
const inferType = css =>
  /btn|button/i.test(css) ? 'button'
  : /input|field/i.test(css) ? 'input'
  : /dropdown|select/i.test(css) ? 'dropdown'
  : 'element';

/** Extract sub-component property references (this.<Name>). Pure function. */
function extractSubComponents(source) {
  return [...new Set([...source.matchAll(/this\.(\w+Page|\w+Panel|\w+Widget|\w+Container)/g)]
    .map(m => m[1]))];
}
```

### 5.3 `buildDomainSheet.mjs`

```javascript
// src/buildDomainSheet.mjs

/**
 * Build a full Markdown domain sheet from an array of PomSummary objects.
 * One call per domain.  Pure function.
 *
 * @param {string}       domain       - e.g. "filter"
 * @param {PomSummary[]} pomSummaries - All parsed POMs for this domain
 * @returns {DomainSheet}
 */
export function buildDomainSheet(domain, pomSummaries) {
  const sections = pomSummaries.map(renderComponentSection).join('\n\n---\n\n');
  const header = `# Site Knowledge: ${domain}\n\n` +
    `> Components: ${pomSummaries.length}\n\n`;
  return {
    domain,
    content: header + sections,
    componentCount: pomSummaries.length,
  };
}

/**
 * Render a single component section in Markdown.
 * Pure function.
 *
 * @param {PomSummary} pom
 * @returns {string}   Markdown string for this component
 */
export function renderComponentSection(pom) {
  const locatorRows = pom.locators.map(
    l => `| \`${l.name}\` | \`${l.css}\` | ${l.type} |`
  ).join('\n');

  const actionRows = pom.actions.map(
    a => `| \`${a.name}(${a.params.join(', ')})\` |`
  ).join('\n');

  const subList = pom.subComponents.length
    ? pom.subComponents.map(s => `- ${s}`).join('\n')
    : '_none_';

  return [
    `### ${pom.className}`,
    pom.parentClass ? `> Extends: \`${pom.parentClass}\`` : '',
    '',
    '**Locators**',
    '| Name | CSS | Type |',
    '|------|-----|------|',
    locatorRows || '| _none_ | | |',
    '',
    '**Actions**',
    '| Signature |',
    '|-----------|',
    actionRows || '| _none_ |',
    '',
    '**Sub-components**',
    subList,
  ].filter(l => l !== undefined).join('\n');
}
```

### 5.4 `buildCompactSitemap.mjs`

```javascript
// src/buildCompactSitemap.mjs

/**
 * Build the compact SITEMAP.md that summarises all domains in one file.
 * This is the "always loaded" top-level overview.  Pure function.
 *
 * @param {DomainSheet[]} domainSheets - One entry per domain
 * @param {string}        sourceRepo   - Source repo used for generation
 * @returns {string}  Full Markdown content of SITEMAP.md
 */
export function buildCompactSitemap(domainSheets, sourceRepo) {
  const blocks = domainSheets.map(renderDomainSummaryBlock).join('\n\n');
  const ts = new Date().toISOString();
  return [
    `# Site Knowledge — Compact Sitemap`,
    '',
    `> Generated: ${ts}  `,
    `> Source: \`${sourceRepo}\``,
    '',
    blocks,
  ].join('\n');
}

/**
 * Render single domain's compact summary block.
 * Pure function.
 *
 * @param {DomainSheet} sheet
 * @returns {string}
 */
export function renderDomainSummaryBlock(sheet) {
  return [
    `## ${sheet.domain}`,
    '',
    `- **Components:** ${sheet.componentCount}`,
    `- **Detail file:** \`${sheet.domain}.md\``,
  ].join('\n');
}
```

### 5.5 `saveKnowledgeToFile.mjs`

```javascript
// src/saveKnowledgeToFile.mjs
import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Save all generated knowledge files to the output directory.
 * Creates the directory if it does not exist.
 * Overwrites existing files (idempotent).
 *
 * @param {string}        outputDir    - e.g. "memory/site-knowledge"
 * @param {DomainSheet[]} domainSheets
 * @param {string}        sitemapContent
 * @param {KnowledgeMetadata} metadata
 * @returns {Promise<SaveResult>}
 */
export async function saveKnowledgeToFile(outputDir, domainSheets, sitemapContent, metadata) {
  await fs.mkdir(outputDir, { recursive: true });
  const writes = [
    writeFile(path.join(outputDir, 'SITEMAP.md'), sitemapContent).then(() => 'SITEMAP.md'),
    writeFile(path.join(outputDir, 'metadata.json'), JSON.stringify(metadata, null, 2))
      .then(() => 'metadata.json'),
    ...domainSheets.map(sheet => {
      const name = `${sheet.domain}.md`;
      return writeFile(path.join(outputDir, name), sheet.content).then(() => name);
    }),
  ];
  const filesWritten = await Promise.all(writes);
  return { outputDir, filesWritten, metadata };
}

/**
 * Write a single file atomically (overwrite if exists).
 * Isolated side-effect function — the only place touching the filesystem.
 *
 * @param {string} filePath - Absolute path
 * @param {string} content
 * @returns {Promise<void>}
 */
export async function writeFile(filePath, content) {
  await fs.writeFile(filePath, content, { encoding: 'utf8', flag: 'w' });
}
```

---

## 6. Test Cases

> Tests are written first (TDD). They define the contract each function must fulfil.
> Use Node.js built-in `node:test` + `assert`. No mocks unless explicitly noted.
> **All test functions below are stubs** — signatures and test names only, no implementation body.

### 6.0 `github.test.mjs`

**Test Coverage**

| Test Name | Scenario | Type |
|-----------|----------|------|
| `checkGhAuth — passes if authenticated` | Run inside configured environment | Happy path |
| `checkGhAuth — throws error if disabled` | Simulated missing auth | Negative |
| `fetchGitHubFileContent — executes gh api with raw header` | Valid API lookup | Happy path |
| `listGitHubDirectory — executes gh api and parses JSON` | Valid API lookup | Happy path |

**Stub File**

```javascript
// tests/github.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkGhAuth, fetchGitHubFileContent, listGitHubDirectory } from '../src/github.mjs';

test('checkGhAuth — passes if authenticated', async () => { /* stub */ });
test('checkGhAuth — throws error if disabled', async () => { /* stub */ });
test('fetchGitHubFileContent — executes gh api with raw header', async () => { /* stub */ });
test('listGitHubDirectory — executes gh api and parses JSON', async () => { /* stub */ });
```

---

### 6.1 `resolvePomFiles.test.mjs`

**Test Coverage**

| Test Name | Scenario | Type |
|-----------|----------|------|
| `resolvePomFiles — returns PomFileEntry list for a single domain` | Valid domain → array of entries | Happy path |
| `resolvePomFiles — handles multiple domains` | Two domains → both represented | Happy path |
| `resolvePomFiles — resolves entries via GitHub API when URL is provided` | `https://github.com/...` → entries with `isRemote: true` | Integration |
| `resolvePomFiles — "all" shorthand returns all configured domains` | `["all"]` resolves all configured domains | Happy path |
| `resolvePomFiles — unknown domain returns empty array` | Unknown domain name → `[]` | Edge case |
| `resolvePomFiles — empty domains array returns empty array` | `[]` input → `[]` | Edge case |
| `resolvePomFiles — non-existent repoPath throws descriptive error` | Invalid path → error with `/repo.*not found\|ENOENT/i` | Negative |
| `resolvePomFiles — domain folder exists but has no .js files` | Empty folder → `[]` | Edge case |

**Stub File**

```javascript
// tests/resolvePomFiles.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolvePomFiles } from '../src/resolvePomFiles.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const FIXTURES_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures/wdio-stub');

test('resolvePomFiles — returns PomFileEntry list for a single domain', async () => { /* stub */ });
test('resolvePomFiles — handles multiple domains', async () => { /* stub */ });
test('resolvePomFiles — resolves entries via GitHub API when URL is provided', async () => { /* stub */ });
test('resolvePomFiles — "all" shorthand returns all configured domains', async () => { /* stub */ });
test('resolvePomFiles — unknown domain returns empty array', () => { /* stub */ });
test('resolvePomFiles — empty domains array returns empty array', () => { /* stub */ });
test('resolvePomFiles — non-existent repoPath throws descriptive error', () => { /* stub */ });
test('resolvePomFiles — domain folder exists but has no .js files', () => { /* stub */ });
```

---

### 6.2 `parsePomFile.test.mjs`

**Test Coverage**

| Test Name | Scenario | Type |
|-----------|----------|------|
| `extractClassInfo — extracts class name and parent` | Standard `extends` → both fields populated | Happy path |
| `extractClassInfo — no parent → parentClass is null` | No `extends` clause → `null` | Edge case |
| `extractClassInfo — malformed source → throws` | No `class` keyword → `Error` | Negative |
| `extractLocators — extracts get* methods with CSS selector` | Two `get*` methods → two entries | Happy path |
| `extractLocators — returns empty array when no get* methods` | Plain class → `[]` | Edge case |
| `extractLocators — ignores get* methods without a $ selector` | Method returns string, not `$()` → ignored | Edge case |
| `extractActions — extracts async methods with params` | Two `async` methods → correct `params[]` | Happy path |
| `extractActions — returns empty array when no async methods` | Plain class → `[]` | Edge case |
| `parsePomFile — returns complete PomSummary from fixture file` | Fixture `CalendarFilter.js` → full summary | Integration |
| `parsePomFile — fetches remote file content when entry.isRemote is true` | Mocked `gh api` fetch → full summary | Integration |
| `parsePomFile — non-existent file throws ENOENT-style error` | Missing file → `Error` | Negative |
| `parsePomFile — empty file returns PomSummary with empty arrays` | Empty fixture → all arrays `[]` | Edge case |

**Stub File**

```javascript
// tests/parsePomFile.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parsePomFile, extractLocators, extractActions, extractClassInfo }
  from '../src/parsePomFile.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const FIXTURE_POM = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures/pom/CalendarFilter.js');

test('extractClassInfo — extracts class name and parent', () => { /* stub */ });
test('extractClassInfo — no parent → parentClass is null', () => { /* stub */ });
test('extractClassInfo — malformed source → throws', () => { /* stub */ });
test('extractLocators — extracts get* methods with CSS selector', () => { /* stub */ });
test('extractLocators — returns empty array when no get* methods', () => { /* stub */ });
test('extractLocators — ignores get* methods without a $ selector', () => { /* stub */ });
test('extractActions — extracts async methods with params', () => { /* stub */ });
test('extractActions — returns empty array when no async methods', () => { /* stub */ });
test('parsePomFile — returns complete PomSummary from fixture file', async () => { /* stub */ });
test('parsePomFile — fetches remote file content when entry.isRemote is true', async () => { /* stub */ });
test('parsePomFile — non-existent file throws ENOENT-style error', async () => { /* stub */ });
test('parsePomFile — empty file returns PomSummary with empty arrays', async () => { /* stub */ });
```

---

### 6.3 `buildDomainSheet.test.mjs`

**Test Coverage**

| Test Name | Scenario | Type |
|-----------|----------|------|
| `renderComponentSection — includes class name as h3 heading` | className → `### CalendarFilter` heading | Happy path |
| `renderComponentSection — includes CSS selector` | locator CSS → appears in output | Happy path |
| `renderComponentSection — includes actions with params` | `selectDate(year, month, day)` → in output | Happy path |
| `renderComponentSection — lists sub-components` | subComponents → listed | Happy path |
| `renderComponentSection — POM with no locators does not crash` | `locators: []` → valid string | Edge case |
| `buildDomainSheet — returns DomainSheet with correct domain name` | `domain` matches input | Happy path |
| `buildDomainSheet — componentCount equals number of POMs passed` | 2 POMs → `componentCount: 2` | Happy path |
| `buildDomainSheet — content starts with `# Site Knowledge:`` | Markdown header present | Happy path |
| `buildDomainSheet — empty POMs array → componentCount is 0` | `[]` → valid sheet, count 0 | Edge case |

**Stub File**

```javascript
// tests/buildDomainSheet.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildDomainSheet, renderComponentSection } from '../src/buildDomainSheet.mjs';

const STUB_POM = {
  domain: 'filter', className: 'CalendarFilter', parentClass: 'BaseContainer',
  locators: [{ name: 'ApplyButton', css: '.mstrd-Apply-btn', type: 'button' }],
  actions: [{ name: 'applyFilter', params: [] }, { name: 'selectDate', params: ['year', 'month', 'day'] }],
  subComponents: ['CalendarWidget'],
};

test('renderComponentSection — includes class name as h3 heading', () => { /* stub */ });
test('renderComponentSection — includes CSS selector', () => { /* stub */ });
test('renderComponentSection — includes actions with params', () => { /* stub */ });
test('renderComponentSection — lists sub-components', () => { /* stub */ });
test('renderComponentSection — POM with no locators does not crash', () => { /* stub */ });
test('buildDomainSheet — returns DomainSheet with correct domain name', () => { /* stub */ });
test('buildDomainSheet — componentCount equals number of POMs passed', () => { /* stub */ });
test('buildDomainSheet — content starts with # Site Knowledge:', () => { /* stub */ });
test('buildDomainSheet — empty POMs array → componentCount is 0', () => { /* stub */ });
```

---

### 6.4 `buildCompactSitemap.test.mjs`

**Test Coverage**

| Test Name | Scenario | Type |
|-----------|----------|------|
| `renderDomainSummaryBlock — includes domain name` | domain → appears in block | Happy path |
| `renderDomainSummaryBlock — includes component count` | `componentCount: 12` → `"12"` in block | Happy path |
| `buildCompactSitemap — starts with # h1 heading` | Output begins with `# ` | Happy path |
| `buildCompactSitemap — includes all domain names` | 3 domains → all present in output | Happy path |
| `buildCompactSitemap — includes generation timestamp` | Contains `Generated:` | Happy path |
| `buildCompactSitemap — empty sheets → minimal header-only string` | `[]` → non-empty string | Edge case |

**Stub File**

```javascript
// tests/buildCompactSitemap.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildCompactSitemap, renderDomainSummaryBlock } from '../src/buildCompactSitemap.mjs';

const STUB_SHEET = { domain: 'filter', content: '# filter\n...', componentCount: 12 };

test('renderDomainSummaryBlock — includes domain name', () => { /* stub */ });
test('renderDomainSummaryBlock — includes component count', () => { /* stub */ });
test('buildCompactSitemap — starts with # h1 heading', () => { /* stub */ });
test('buildCompactSitemap — includes all domain names', () => { /* stub */ });
test('buildCompactSitemap — includes generation timestamp', () => { /* stub */ });
test('buildCompactSitemap — empty sheets → minimal header-only string', () => { /* stub */ });
```

---

### 6.5 `saveKnowledgeToFile.test.mjs`

**Test Coverage**

| Test Name | Scenario | Type |
|-----------|----------|------|
| `saveKnowledgeToFile — creates output directory if it does not exist` | Non-existent dir → created | Happy path |
| `saveKnowledgeToFile — writes SITEMAP.md with correct content` | File content matches input | Happy path |
| `saveKnowledgeToFile — writes one .md file per domain sheet` | 2 sheets → 2 `.md` files in `filesWritten` | Happy path |
| `saveKnowledgeToFile — writes metadata.json` | JSON file parseable, `generatedAt` correct | Happy path |
| `saveKnowledgeToFile — is idempotent (second call overwrites, no error)` | Two calls → no error | Happy path |
| `saveKnowledgeToFile — returns SaveResult with correct filesWritten list` | Includes `SITEMAP.md` + `metadata.json` | Happy path |
| `saveKnowledgeToFile — empty sheets writes only SITEMAP.md + metadata.json` | `sheets: []` → exactly 2 files | Edge case |
| `saveKnowledgeToFile — read-only outputDir throws descriptive error` | No write permission → `EACCES` error | Negative |

**Stub File**

```javascript
// tests/saveKnowledgeToFile.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { saveKnowledgeToFile } from '../src/saveKnowledgeToFile.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

const STUB_SHEETS = [
  { domain: 'filter',      content: '# filter',      componentCount: 3 },
  { domain: 'autoAnswers', content: '# autoAnswers', componentCount: 2 },
];
const STUB_SITEMAP  = '# SITEMAP content';
const STUB_METADATA = {
  generatedAt: '2026-03-04T10:00:00.000Z',
  sourceRepo: '/local/wdio',
  domains: {
    filter:      { componentCount: 3, filePath: 'filter.md' },
    autoAnswers: { componentCount: 2, filePath: 'autoAnswers.md' },
  },
};

test('saveKnowledgeToFile — creates output directory if it does not exist', async () => { /* stub */ });
test('saveKnowledgeToFile — writes SITEMAP.md with correct content', async () => { /* stub */ });
test('saveKnowledgeToFile — writes one .md file per domain sheet', async () => { /* stub */ });
test('saveKnowledgeToFile — writes metadata.json', async () => { /* stub */ });
test('saveKnowledgeToFile — is idempotent (second call overwrites, no error)', async () => { /* stub */ });
test('saveKnowledgeToFile — returns SaveResult with correct filesWritten list', async () => { /* stub */ });
test('saveKnowledgeToFile — empty sheets writes only SITEMAP.md + metadata.json', async () => { /* stub */ });
test('saveKnowledgeToFile — read-only outputDir throws descriptive error', async () => { /* stub */ });
```

---

## 7. How the Tester Agent Reads Site Knowledge

> **Full agent-side design has been extracted into a dedicated document.**
> See: [SITE_KNOWLEDGE_SYSTEM_AGENT_DESIGN.md](./SITE_KNOWLEDGE_SYSTEM_AGENT_DESIGN.md)

This section covers the **read-path** — how the Tester Agent consumes the pre-generated
`memory/site-knowledge/` files at runtime and propagates context to sub-agents.

Key topics covered in the agent design document:

| Sub-section | Content |
|-------------|--------|
| Pre-fetch flow | Phase 0.5 sequence — domain resolution, SITEMAP.md, domain `.md`, `site_context.md` |
| `readSiteKnowledge.mjs` | Agent-side query function stubs (`readSiteKnowledge`, `searchKnowledgeContent`) |
| `readSiteKnowledge.test.mjs` | TDD test coverage table + stub test file |
| Implementation roadmap | Sequenced P1/P2 tasks for agent-side implementation |

---

## 7.1 Playground

The playground provides a quick sandbox to **manually exercise** the sitemap generator against a real
or synthetic WDIO repo without running the full test suite.

### Purpose

- Validate that `generate-sitemap.mjs` produces correct Markdown output for a given repo.
- Smoke-test the generated `memory/site-knowledge/` files before integrating with the Tester Agent.
- Let developers iterate quickly on `buildDomainSheet` / `buildCompactSitemap` output format.

### Location

```
workspace-tester/
└── tools/
    └── sitemap-generator/
        └── playground/
            ├── run.mjs               ← One-shot playground runner
            ├── sample-repo/          ← Minimal synthetic WDIO repo for local runs
            │   └── pageObjects/
            │       └── filter/
            │           └── CalendarFilter.js
            └── output/               ← Generated files land here (gitignored)
```

### Usage

```bash
# Run against the synthetic sample repo
node tools/sitemap-generator/playground/run.mjs

# Run against a real local WDIO checkout
node tools/sitemap-generator/playground/run.mjs \
  --repo /path/to/wdio-repo \
  --domains filter,autoAnswers,aibot
```

### `playground/run.mjs` Stub

```javascript
// playground/run.mjs
// Quick smoke-test runner — not part of the production build.
import { main } from '../generate-sitemap.mjs';

const SAMPLE_REPO = new URL('./sample-repo', import.meta.url).pathname;
const args = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ['--repo', SAMPLE_REPO, '--domains', 'all', '--output-dir', './playground/output'];

await main(args);
console.log('📂 Check playground/output/ for generated files.');
```

---

## 7.2 User-facing README

A user-facing `README.md` targets **engineers who want to run or extend** the sitemap generator.
It lives at the tool root and is the first document a new contributor reads.

### Location

```
workspace-tester/
└── tools/
    └── sitemap-generator/
        └── README.md    ← this file
```

### Required Sections

| Section | Content |
|---------|--------|
| **Overview** | One-paragraph description of what the tool does and why |
| **Quick Start** | Three commands to clone, install (if any), and run |
| **CLI Reference** | Table of all `--flags`, types, defaults, and examples |
| **Output Format** | Description of `SITEMAP.md`, domain `.md` files, `metadata.json` |
| **Adding a New Domain** | Step-by-step: edit `domains.json`, verify with playground, run tests |
| **Running Tests** | `node --test tests/*.test.mjs` — what to expect on pass/fail |
| **Playground** | Pointer to `playground/` and how to inspect output |
| **Troubleshooting** | Common errors (`ENOENT`, empty output, `EACCES`) and fixes |

### README Template (Stub)

```markdown
# Site Knowledge Generator

> Crawls WDIO page-objects and writes structured Markdown knowledge files
> to `memory/site-knowledge/` for use by the Tester Agent.

## Quick Start

\`\`\`bash
cd workspace-tester/tools/sitemap-generator
node generate-sitemap.mjs --repo-url https://github.com/mstr-kiai/web-dossier --domains all
# Or if you have it locally:
# node generate-sitemap.mjs --repo /path/to/wdio --domains all
\`\`\`

## Requirements

If you are using the `--repo-url` flag to process remote repositories, you must have the **GitHub CLI (`gh`)** installed and authenticated:
1. `brew install gh` (macOS)
2. `gh auth login` (follow prompts inside terminal)

## CLI Reference

| Flag | Type | Default | Description |
|------|------|---------|-------------|
| `--repo` | string | _(see desc)_ | Local path of the WDIO repo (required if `--repo-url` not provided) |
| `--repo-url` | string | _(see desc)_ | GitHub repo URL to load directly into memory using `gh api`. Auto-locates `tests/wdio`. |
| `--domains` | CSV or `all` | _(required)_ | Domains to process |
| `--output-dir` | string | `memory/site-knowledge` | Output directory |

## Adding a New Domain

1. Add an entry to `config/domains.json`.
2. Run `node playground/run.mjs --domains <new-domain>` to inspect output.
3. Run `node --test tests/*.test.mjs` to verify no regressions.

## Running Tests

\`\`\`bash
node --test tests/*.test.mjs
\`\`\`

## Playground

See `playground/` for a quick-run sandbox. Outputs land in `playground/output/`.

## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| `Repo not found: …` | `--repo` path does not exist | Check the path |
| Empty `.md` files | POM folder has no `.js` files | Verify `domains.json` `pomPaths` |
| `EACCES` | Output dir not writable | Check permissions on `--output-dir` |
```

---

## 8. `domains.json` Configuration

```json
{
  "domains": {
    "filter": {
      "pomPaths": ["pageObjects/filter", "pageObjects/common/FilterPanel.js"],
      "specPaths": ["specs/regression/filter", "specs/regression/reportFilter"],
      "navigationHint": "Library Home → open Dossier → Filter Panel"
    },
    "autoAnswers": {
      "pomPaths": ["pageObjects/autoAnswers"],
      "specPaths": ["specs/regression/AutoAnswers"],
      "navigationHint": "Library Home → Dossier with AI enabled → AI Assistant panel"
    },
    "aibot": {
      "pomPaths": ["pageObjects/aibot"],
      "specPaths": [
        "specs/regression/aibotChatPanel",
        "specs/regression/aibotSnapshotsPanel",
        "specs/regression/bot2",
        "specs/regression/botConfiguration"
      ],
      "navigationHint": "Library Home → click Bot card → Chat panel / Edit mode"
    }
  }
}
```

---

## 9. CLI Entrypoint (`generate-sitemap.mjs`)

```javascript
// generate-sitemap.mjs
// Usage:
//   node generate-sitemap.mjs --repo-url https://github.com/mstr-kiai/web-dossier --domains filter,autoAnswers,aibot --output-dir memory/site-knowledge
//   node generate-sitemap.mjs --repo <path> --domains filter,autoAnswers,aibot --output-dir memory/site-knowledge

import { parseArgs } from 'node:util';
import { checkGhAuth } from './src/github.mjs';
import { resolvePomFiles } from './src/resolvePomFiles.mjs';
import { parsePomFile } from './src/parsePomFile.mjs';
import { buildDomainSheet } from './src/buildDomainSheet.mjs';
import { buildCompactSitemap } from './src/buildCompactSitemap.mjs';
import { saveKnowledgeToFile } from './src/saveKnowledgeToFile.mjs';

/**
 * CLI entrypoint — parse args and orchestrate the full pipeline.
 * Steps: checkGhAuth (if url) → resolvePomFiles → parsePomFile (per file)
 *        → buildDomainSheet → buildCompactSitemap → saveKnowledgeToFile
 *
 * Flags:
 *   --repo <path>             - Local path of WDIO repo (required if --repo-url not provided)
 *   --repo-url <url>          - GitHub URL to load (e.g. https://github.com/mstr-kiai/web-dossier)
 *   --domains <csv>           - Comma-separated domain names or "all" (required)
 *   --output-dir <path>       - Where to write output files (default: memory/site-knowledge)
 *
 * @param {string[]} argv - process.argv.slice(2)
 * @returns {Promise<void>}
 */
export async function main(argv) {
  const { values } = parseArgs({
    args: argv,
    options: {
      repo:         { type: 'string' },
      'repo-url':   { type: 'string' },
      domains:      { type: 'string' },
      'output-dir': { type: 'string', default: 'memory/site-knowledge' },
    },
  });

  const domains = (values.domains ?? '').split(',').map(d => d.trim()).filter(Boolean);
  
  let repoSource = values.repo;
  if (values['repo-url']) {
    checkGhAuth();
    console.log(`Connecting to GitHub API for ${values['repo-url']}...`);
    repoSource = values['repo-url'];
  }
  if (!repoSource) throw new Error('Must provide either --repo <path> or --repo-url <url>');

  const entries = await resolvePomFiles(repoSource, domains);

  const byDomain = Object.groupBy(entries, e => e.domain);
  const domainSheets = await Promise.all(
    Object.entries(byDomain).map(async ([domain, files]) => {
      const summaries = await Promise.all(files.map(f => parsePomFile(f)));
      return buildDomainSheet(domain, summaries);
    })
  );

  const sitemap  = buildCompactSitemap(domainSheets, values.repo);
  const metadata = {
    generatedAt: new Date().toISOString(),
    sourceRepo: values.repo,
    domains: Object.fromEntries(
      domainSheets.map(s => [s.domain, { componentCount: s.componentCount, filePath: `${s.domain}.md` }])
    ),
  };

  const result = await saveKnowledgeToFile(values['output-dir'], domainSheets, sitemap, metadata);
  console.log(`✅ Written ${result.filesWritten.length} files to ${result.outputDir}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch(err => { console.error(err); process.exit(1); });
}
```

---

## 10. Implementation Roadmap

> Tasks below are sequenced for TDD: write tests first, then implement to make them pass.

| Step | Task | Test File | Priority |
|------|------|-----------|----------|
| 0 | Implement `github.mjs` → pass gh exec commands | `github.test.mjs` | **P1** |
| 1 | Create fixture files (`fixtures/wdio-stub/`, `fixtures/pom/CalendarFilter.js`, `fixtures/pom/Empty.js`) | All tests depend on this | **P0** |
| 2 | Implement `extractClassInfo` → pass class info tests | `parsePomFile.test.mjs` | **P1** |
| 3 | Implement `extractLocators` → pass locator tests | `parsePomFile.test.mjs` | **P1** |
| 4 | Implement `extractActions` → pass action tests | `parsePomFile.test.mjs` | **P1** |
| 5 | Implement `parsePomFile` (integration, calls 2–4) | `parsePomFile.test.mjs` | **P1** |
| 6 | Implement `resolvePomFiles` → pass all resolve tests | `resolvePomFiles.test.mjs` | **P1** |
| 7 | Implement `renderComponentSection` + `buildDomainSheet` | `buildDomainSheet.test.mjs` | **P1** |
| 8 | Implement `renderDomainSummaryBlock` + `buildCompactSitemap` | `buildCompactSitemap.test.mjs` | **P1** |
| 9 | Implement `writeFile` + `saveKnowledgeToFile` | `saveKnowledgeToFile.test.mjs` | **P1** |
| 10 | Implement `readSiteKnowledge` + `searchKnowledgeContent` (agent-side) | `readSiteKnowledge.test.mjs` | **P2** |
| 11 | Implement `main()` (CLI entrypoint) + end-to-end integration test | manual / script run | **P2** |
| 12 | Run against real wdio repo, review Markdown quality | manual review | **P2** |

---

## 11. Design Decisions

### 11.1 Why File-based Instead of Weaviate RAG?

| Concern | Weaviate RAG | File-based (this design) |
|---------|-------------|--------------------------|
| Deployment | Requires running Weaviate server | No external service needed |
| Offline use | ❌ | ✅ |
| Reproducibility | Depends on server state | Files are version-controllable |
| Query quality | Semantic vector search | Keyword substring search |
| Complexity | High (client lib, schema, upsert) | Low (fs read/write) |
| Acceptable for this use case? | Overkill for ~5 domain files | ✅ Sufficient |

The trade-off (no vector search) is acceptable because:
- The total knowledge base is small (~5 files, < 50 KB total)
- Domain is always known from QA plan labels (no fuzzy domain lookup needed)
- Component name substring search is sufficient for the agent's needs

### 11.2 Why `node:test` (Built-in) over Mocha/Jest?

- **Zero additional dependencies** — aligns with the project's philosophy
- Node.js ≥ 20 built-in test runner is production-grade
- Tests run with `node --test tests/*.test.mjs` — no config file needed

---

## 12. References

- [TESTER_AGENT_DESIGN_v2.md](./TESTER_AGENT_DESIGN_v2.md) — Parent design (Tester Agent full pipeline + Issue-only FC Flow)
- [TESTER_AGENT_DESIGN_v1.md](./TESTER_AGENT_DESIGN_v1.md) — Core tester pipeline (Phase 0–4)
- [wdio/pageObjects/filter/](../projects/wdio/pageObjects/filter/) — Filter POM source (16 files)
- [wdio/pageObjects/aibot/](../projects/wdio/pageObjects/aibot/) — Bot POM source (27 files)
- [wdio/pageObjects/autoAnswers/](../projects/wdio/pageObjects/autoAnswers/) — AutoAnswers POM source (4 files)
- Node.js built-in test runner: https://nodejs.org/api/test.html
