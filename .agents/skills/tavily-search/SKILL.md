---
name: tavily-search
description: AI-optimized web search and summarization via Tavily API. Use when asked to search, lookup, or find information online. Returns concise, relevant results with automatic summarization.
homepage: https://tavily.com
metadata: {"clawdbot":{"emoji":"🔍","requires":{"bins":["node"],"env":["TAVILY_API_KEY"]},"primaryEnv":"TAVILY_API_KEY","apiKey":"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"}}
---

# Tavily Search & Summarize

AI-optimized web search using Tavily API with automatic summarization.

## Quick Usage

```bash
# Search and summarize
node {baseDir}/scripts/search.mjs "your search query"

# Search with options
node {baseDir}/scripts/search.mjs "query" -n 10
node {baseDir}/scripts/search.mjs "query" --deep
node {baseDir}/scripts/search.mjs "query" --topic news
```

## API Key

The skill is configured with your Tavily API key. To update:
```bash
export TAVILY_API_KEY="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"
```

## Options

| Option | Description |
|--------|-------------|
| `-n <count>` | Number of results (default: 5, max: 20) |
| `--deep` | Advanced search (slower, more comprehensive) |
| `--topic general\|news` | Search topic (default: general) |
| `--days <n>` | For news, limit to last n days |

## Output Format

The script returns:
1. **AI-generated answer** - Concise summary of findings
2. **Sources** - Top ranked results with titles, URLs, and relevance scores

## Use When

- User asks to "search", "look up", "find information", or "lookup"
- Research questions requiring web information
- Fact-checking or verification tasks
- Any query needing current or web-based information
