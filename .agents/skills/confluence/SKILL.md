---
name: confluence
description: Search and manage Confluence pages with confluence-cli, including Markdown-safe publish/update workflows that convert `.md` files to Confluence storage format before upload.
homepage: https://github.com/pchuri/confluence-cli
metadata: {"clawdbot":{"emoji":"📄","primaryEnv":"CONFLUENCE_TOKEN","requires":{"bins":["confluence"],"env":["CONFLUENCE_TOKEN"]},"install":[{"id":"npm","kind":"node","package":"confluence-cli","bins":["confluence"],"label":"Install confluence-cli (npm)"}]}}
---

# Confluence

Search, read, create, and update Confluence pages with `confluence-cli`.

This skill now includes a shared Markdown publishing entrypoint that converts local `.md` files into Confluence storage markup first, so the page renders correctly instead of showing raw Markdown symbols.

## Required Setup

Install the CLI:

```bash
npm install -g confluence-cli
```

Create an Atlassian API token at `https://id.atlassian.com/manage-profile/security/api-tokens`, then initialize the CLI:

```bash
confluence init
```

When prompted, enter:
- Domain: `yourcompany.atlassian.net`
- Email: your Atlassian account email
- API token: the token you created

Verify the setup:

```bash
confluence spaces
```

## Core Read/Search Commands

Search pages:

```bash
confluence search "deployment guide"
```

Read a page:

```bash
confluence read <page-id>
```

Inspect a page:

```bash
confluence info <page-id>
```

Find a page by title:

```bash
confluence find "Page Title"
```

List spaces:

```bash
confluence spaces
```

List child pages:

```bash
confluence children <page-id>
```

Export a page with attachments:

```bash
confluence export <page-id> --output ./exported-page/
```

Page IDs appear in URLs like `https://yoursite.atlassian.net/wiki/spaces/SPACE/pages/123456/Title`.

## Markdown-Safe Publishing

### Important Rule

Do not upload raw `.md` files directly with `confluence update --file plan.md`.

Confluence expects storage-format HTML/XML. Direct Markdown uploads render raw syntax like `#`, `**`, and table pipes on the page.

### Canonical Entrypoint

Use the skill-local wrapper:

```bash
.agents/skills/confluence/scripts/run-confluence-publish.sh \
  --input ./report.md \
  --page-id 123456789
```

This wrapper:
- converts Markdown to Confluence storage format
- uploads with `--format storage`
- supports direct update by page ID
- scopes title lookup with `confluence find --space <key>`
- supports title+space upsert flows

### Update Existing Page by ID

```bash
.agents/skills/confluence/scripts/run-confluence-publish.sh \
  --input ./report.md \
  --page-id 123456789
```

### Find or Create by Title and Space

```bash
.agents/skills/confluence/scripts/run-confluence-publish.sh \
  --input ./report.md \
  --space TEAM \
  --title "Release Summary"
```

### Create Under a Parent Page

```bash
.agents/skills/confluence/scripts/run-confluence-publish.sh \
  --input ./report.md \
  --space TEAM \
  --title "Release Summary" \
  --parent-id 456789123
```

### Dry Run / Inspect Generated Storage HTML

```bash
.agents/skills/confluence/scripts/run-confluence-publish.sh \
  --input ./report.md \
  --page-id 123456789 \
  --output-html ./report.confluence.html \
  --dry-run
```

## Supported Markdown Subset

The bundled converter currently handles the practical subset used in this repo:
- headings
- paragraphs
- bold and italic text
- inline code and fenced code blocks
- links
- flat ordered and unordered lists
- blockquotes
- tables
- horizontal rules
- common status emoji such as `✅`, `❌`, and `⚠️`

Current non-goals for v1:
- nested lists
- task checkboxes
- image upload/attachment sync
- advanced Confluence macros beyond code blocks and emoticons

## Script Files

- `.agents/skills/confluence/scripts/run-confluence-publish.sh` — publish wrapper
- `.agents/skills/confluence/scripts/lib/markdown_to_confluence.js` — Markdown → storage converter
- `.agents/skills/confluence/scripts/lib/confluence_cli.sh` — CLI wrapper helpers
- `.agents/skills/confluence/scripts/test/` — targeted regression tests

## Direct CLI Examples

Create a page from inline body text:

```bash
confluence create "Page Title" SPACEKEY --body "Page content here"
```

Create a page from storage HTML:

```bash
confluence create "Page Title" SPACEKEY --file content.html --format storage
```

Create a child page from storage HTML:

```bash
confluence create-child "Page Title" <parent-id> --file content.html --format storage
```

Update a page from storage HTML:

```bash
confluence update <page-id> --file content.html --format storage
```

## Tips

- Domain in config should not include `https://`
- Use `--format storage` whenever you upload converted HTML content
- Keep the Markdown source as the authoring format and generated HTML as a publish artifact
- Use `--output-html` with `--dry-run` so the generated storage payload is preserved on disk
- If `find` returns multiple possible pages, prefer publishing by explicit page ID to avoid ambiguity
