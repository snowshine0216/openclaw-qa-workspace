# opeclaw-qa-workspace

## Setup Requirements

### .env setup
- copy .env.example and update the placeholder value
- in root folder, create .env file and update the placeholder value
```bash
mcp360_token=<mcp360_token>
```
### Jira setup
1. Skills needed: jira-cli
2. instal jira-cli for mac os; (for other os, [please refer to github] (https://github.com/ankitpokhrel/jira-cli/wiki/Installation))
``` bash
brew tap ankitpokhrel/jira-cli
brew install jira-cli
```
3. jira token installation
- [for self usage](https://github.com/ankitpokhrel/jira-cli)
- for project purpose. add below to .env file
```bash
JIRA_API_TOKEN=<jira-api-token>
JIRA_BASE_URL=<jira-base-url>
```
- [to refresh your token](https://id.atlassian.com/manage-profile/security/api-tokens)

4. run `jira init` to setup environment

### Confluence Setup
1. Skills needed: confluence-cli
2. instal confluence-cli for mac os; (for other os, [please refer to github] (https://github.com/pchuri/confluence-cli))
``` bash
npm install -g confluence-cli
```
3. run `confluence init` to setup environment


### mcporter setup
1. Skills needed: mcporter
2. instal mcporter for mac os; (for other os, [please refer to github] (https://github.com/mcporter-dev/mcporter))
``` bash
npm install -g mcporter
```
3. install playwright mcp server:  ```npx mcporter config add playwright-mcp --command "npx -y @playwright/mcp@latest" ```
4. list installed servers: ```mcporter list```

## Workspace Planner Skill Linking

Use the sync script at `src/sync-skills.sh` to link missing skills safely.

What it does (`link-missing-only`, no overwrite):
- Syncs missing entries from `.cursor/skills` into `workspace-planner/skills`.
- Syncs missing entries from `workspace-planner/skills` into `.agents/skills`.
- Preserves all existing files/symlinks in both destination folders.

Run from repository root:

```bash
./src/sync-skills.sh
```


## QA Test Key Points Interactive Page

This repository includes an interactive XMind-style editor for QA plans at:

`workspace-planner/projects/qa-test-keypoints-map`

Quick start:

```bash
cd workspace-planner/projects/qa-test-keypoints-map
npm install
npm run test:e2e:install
npm run dev
```

Main commands:

```bash
# Unit tests
npm run test:unit

# Playwright E2E tests
npm run test:e2e

# Typecheck + build
npm run typecheck
npm run build
```

Detailed usage guide:

- `workspace-planner/projects/qa-test-keypoints-map/README.md`

## Site Knowledge Generator

The Site Knowledge System generator for Tester Agent lives at:

`workspace-tester/tools/sitemap-generator`

Use it to generate `memory/site-knowledge/` Markdown files from WDIO page objects.

Quick run:

```bash
cd workspace-tester/tools/sitemap-generator
npm run generate:domains -- --repo ../../projects/wdio --output ./config/domains.json
npm run generate:sitemap -- --repo ../../projects/wdio --domains all --output-dir ../../memory/site-knowledge
```

Direct node commands:

```bash
cd workspace-tester/tools/sitemap-generator
node generate-sitemap.mjs --repo ../../projects/wdio --domains all --output-dir ../../memory/site-knowledge
```

Full usage and troubleshooting:

- `workspace-tester/tools/sitemap-generator/README.md`


### GH setup and generate site knowledge
- refer to workspace-tester/tools/sitemap-generator/README.md for more details
- to check if gh is setup correctly, run `gh auth status -h github.com`


## Enable QMD and Memory Search for OpenClaw

### QMD setup
| Requirement | Details |
|-------------|---------|
| **Runtime** | Node.js >= 22 (prefer Node over Bun on macOS — see [qmd#184](https://github.com/tobi/qmd/issues/184)) |
| **Storage** | Index only (~tens of MB); no model download for BM25 |
| **macOS** | `brew install sqlite` (for FTS5 extensions) |

**Environment variables (optional, Mac Intel):**

```bash
export NODE_LLAMA_CPP_CMAKE_OPTION_GGML_CUDA=OFF
```

**Install and configure:**

```bash
# Install qmd globally
npm install -g @tobilu/qmd

# Add site-knowledge as a collection (run from workspace-tester root)
qmd collection add memory/site-knowledge --name site-knowledge --mask "**/*.md"

# BM25 index is built automatically; no qmd embed needed
```

**Search command (BM25 only):**

```bash
 qmd search "filter" -c site-knowledge --json -n 10
```
response
```json
[
  {
    "docid": "#783738",
    "score": 0,
    "file": "qmd://site-knowledge/filter.md",
    "title": "Site Knowledge: Filter Domain",
    "snippet": "@@ -1,3 @@ (0 before, 151 after)\n# Site Knowledge: Filter Domain\n\n## Overview"
  },
  {
    "docid": "#cd7aaa",
    "score": 0,
    "file": "qmd://site-knowledge/common.md",
    "title": "Site Knowledge: Common Domain",
    "snippet": "@@ -5,4 @@ (4 before, 324 after)\n- **Domain key:** `common`\n- **Components covered:** Alert, AntdMessage, AuthoringFilters, Checkbox, CollaborationDB, Email, EmbedPromptEditor, FilterCapsule, FilterDropdown, FilterElement, FilterPanel, FilterSearch, FilterSlider, FilterSummary, FontPicker, for, HamburgerMenu, Legend, LibraryFilt..."
  }
]
```

### Memory search setup
### 3.2 OpenClaw memorySearch Setup

When the Tester Agent runs inside OpenClaw, add `memory/site-knowledge` to the watched paths.

**Minimal config:**

```json
{
  "agents": {
    "defaults": {
      "memorySearch": {
        "enabled": true,
        // "extraPaths": ["memory/site-knowledge"],
        "sync": { "watch": true }
      }
    }
  }
}
```

**With OpenRouter embeddings:**

```json
{
  "agents": {
    "defaults": {
      "memorySearch": {
        "enabled": true,
        // "extraPaths": ["memory/site-knowledge"],
        "provider": "openai",
        "model": "openai/text-embedding-3-small",
        "remote": {
          "baseUrl": "https://openrouter.ai/api/v1/",
          "apiKey": "${OPENROUTER_API_KEY}"
        },
        "sync": { "watch": true },
        "query": { "maxResults": 8, "hybrid": { "enabled": true } },
        "cache": { "enabled": true, "maxEntries": 50000 }
      }
    }
  }
}
```
### How to Trigger MemorySearch
the memory_search tool automatically searches across:
- MEMORY.md (long-term memory)
- memory/*.md files (including your memory/site-knowledge/ directory)

### Basic Usage
```bash
memory_search(query: "report editor")
```

### For Report Editor Topics
```bash
memory_search(query: "report editor WDIO page objects locators")
memory_search(query: "report editor UI components interactions")
memory_search(query: "report editor test automation patterns")
```

                                             