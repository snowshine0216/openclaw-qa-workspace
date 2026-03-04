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

## OpenClaw Agent Design Review Gate

OpenClaw design tasks now use a two-step specialist flow:

1. `openclaw-agent-designer` drafts the agent/workflow design.
2. `openclaw-agent-design-reviewer` runs a blocking quality review.

Reviewer checks include:
- path validity and OpenClaw pathing best practices
- test/smoke evidence for newly introduced scripts/workflows
- documentation coverage and explicit user-facing `README.md` mention

Review artifacts default to:
- `projects/agent-design-review/<design-id>/design_review_report.md`
- `projects/agent-design-review/<design-id>/design_review_report.json`

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

