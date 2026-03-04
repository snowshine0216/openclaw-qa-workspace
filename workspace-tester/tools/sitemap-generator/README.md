# Site Knowledge Generator

> Crawls WDIO page objects and writes structured Markdown knowledge files into `memory/site-knowledge/` for Tester Agent runtime context.

## Overview

The Site Knowledge Generator scans page-object model (`.js`) files by domain, extracts class info, locators, and async actions, then writes:
- one compact cross-domain `SITEMAP.md`
- one domain detail sheet per domain (for example `filter.md`)
- a machine-readable `metadata.json`

The generator supports both local repositories (`--repo`) and GitHub repositories (`--repo-url` via `gh api`).

## Quick Start

```bash
git clone <your-repo-url>
cd workspace-tester/tools/sitemap-generator
node scripts/generate-domains-config.mjs --repo ../../projects/wdio --output ./config/domains.json
node generate-sitemap.mjs --repo ../../projects/wdio --domains all --output-dir ../../memory/site-knowledge
```

## Shortcuts

The tool includes npm shortcuts:

```bash
cd workspace-tester/tools/sitemap-generator

# Run tests
npm run test

# Generate domains config from local WDIO repo
npm run generate:domains -- --repo ../../projects/wdio --output ./config/domains.json

# Generate domains config from GitHub repo
npm run generate:domains -- --repo-url git@github.com:mstr-kiai/web-dossier.git --output ./config/domains.json

# Generate sitemap files
npm run generate:sitemap -- --repo ../../projects/wdio --domains all --output-dir ../../memory/site-knowledge

# Playground
npm run playground
npm run playground:domains
```

## Requirements

If you use `--repo-url`, GitHub CLI must be installed and authenticated:

```bash
brew install gh
gh auth login
```

## CLI Reference

| Flag | Type | Default | Description | Example |
|------|------|---------|-------------|---------|
| `--repo` | string | none | Local WDIO repository root path. Required if `--repo-url` is not provided. | `--repo ../../projects/wdio` |
| `--repo-url` | string | none | GitHub repository source. Supports `https://github.com/<owner>/<repo>`, `git@github.com:<owner>/<repo>.git`, and `ssh://git@github.com/<owner>/<repo>`. Uses `gh api` (no local checkout needed). | `--repo-url git@github.com:mstr-kiai/web-dossier.git` |
| `--domains` | CSV string or `all` | none | Domains to process. Must be provided. | `--domains filter,autoAnswers,aibot` |
| `--output-dir` | string | `memory/site-knowledge` | Output directory for generated files. | `--output-dir ../../memory/site-knowledge` |

## Generate `domains.json` Automatically

If you want full coverage (all first-level `pageObjects/*` folders), generate config from the WDIO repo tree:

```bash
cd workspace-tester/tools/sitemap-generator
node scripts/generate-domains-config.mjs --repo ../../projects/wdio --output ./config/domains.json
```

You can also generate from GitHub directly:

```bash
node scripts/generate-domains-config.mjs --repo-url git@github.com:mstr-kiai/web-dossier.git --output ./config/domains.json
```

What this script does:
- creates one domain per `pageObjects/<folder>`
- sets `pomPaths` to that folder
- auto-matches related `specs/regression/**` directories into `specPaths`

Flags:
- `--repo <path>`: local WDIO repository root (default: `../../projects/wdio`)
- `--repo-url <github-source>`: remote GitHub source (`https://`, `git@github.com:`, or `ssh://git@github.com/`)
- `--output <path>`: destination for generated config (default: `./config/domains.json`)

## Output Format

Output directory structure:

```text
memory/site-knowledge/
├── SITEMAP.md
├── filter.md
├── autoAnswers.md
├── aibot.md
└── metadata.json
```

File details:
- `SITEMAP.md`: compact overview with generated timestamp and component counts by domain.
- `<domain>.md`: full component sheet with locators, action signatures, and sub-component references.
- `metadata.json`: source repo path/url, generation timestamp, and per-domain component counts.

## Adding a New Domain

1. Option A (manual): edit [`config/domains.json`](./config/domains.json) and add a new domain key with `pomPaths`.
2. Option B (auto): rerun `node scripts/generate-domains-config.mjs --repo ../../projects/wdio --output ./config/domains.json`.
3. Verify output with playground:

```bash
node playground/run.mjs --domains <new-domain>
```

4. Run tests and confirm all green:

```bash
node --test tests/*.test.mjs
```

## Running Tests

```bash
cd workspace-tester/tools/sitemap-generator
npm run test
```

Expected result: all tests pass with no failures or skipped tests.

## Playground

Playground files are under [`playground/`](./playground/).

```bash
# Sample synthetic repo smoke test
npm run playground

# Generate domain config from sample synthetic repo
npm run playground:domains

# Real local repo smoke test
node playground/run.mjs --repo ../../projects/wdio --domains all
```

`npm run playground` auto-detects sample repo domains from `playground/sample-repo/pageObjects/`.

Generated playground output is written to `playground/output/`.

## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| `Repo not found: ...` | `--repo` path is wrong or inaccessible | Verify absolute/relative path and run from expected working directory |
| Empty domain files | No `.js` POM files matched `config/domains.json` `pomPaths` | Re-check `pomPaths` and repository structure |
| `EACCES` / `EPERM` | Output directory is not writable | Choose another `--output-dir` or update directory permissions |
| `GitHub CLI (gh) is not authenticated` | `--repo-url` used without `gh auth login` | Run `gh auth login`, then rerun command |


## references for cron job to use it
``` bash
cd workspace-tester/tools/sitemap-generator && npm run generate:domains -- --repo-url git@github.com:mstr-kiai/web-dossier.git --output ./config/domains.json
cd workspace-tester/tools/sitemap-generator && npm run generate:sitemap -- --repo ../../projects/wdio --domains all --output-dir ../../memory/site-knowledge
```
