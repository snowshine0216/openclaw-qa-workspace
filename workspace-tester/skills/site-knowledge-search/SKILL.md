---
name: site-knowledge-search
description: |
  Search pre-generated site knowledge (WDIO page objects, locators, UI components) at runtime and write resolved context to a run-scoped artifact for test execution.
  Use when the Tester Agent needs to gather UI navigation guidance, locator hints, and workflow hints before executing feature-test or defect-test workflows.
  MANDATORY: Run on every test execution. Inputs: key (issue key), keywords (string array), domains (string array). Output: projects/test-cases/<key>/site_context.md.
  See SITE_KNOWLEDGE_SYSTEM_AGENT_DESIGN_v2.md §1 for full contract.
---

# Site Knowledge Search Skill


## Contract

| Input | Type | Example |
|-------|------|---------|
| `key` | string | `BCIN-1234` |
| `keywords` | string[] | `["CalendarFilter", "filter", "date range"]` |
| `domains` | string[] | `["filter", "search"]` |

**Output:** `projects/test-cases/<key>/site_context.md` (paths relative to workspace-tester)

## Execution Flow

1. **Read SITEMAP** — `memory/site-knowledge/SITEMAP.md` to identify index coverage.
2. **Run memory_search** — When OpenClaw `memory_search` tool is available, query with keywords and domains.
3. **Run BM25 search** — Per keyword: `qmd search "<keyword>" -c site-knowledge --json -n 10`
4. **Merge and deduplicate** — Combine results from both backends.
5. **Write** — `<workspace-tester>/projects/test-cases/<key>/site_context.md`

## site_context.md Structure

Include these sections:

1. **Search Inputs** — keywords, domains, timestamp
2. **Resolved Components** — Components and actions from domain files
3. **Locator Hints** — CSS roots, user-visible elements, selectors
4. **Workflow Hints** — Common workflows and navigation steps
5. **Gaps and Fallback Notes** — Missing coverage, warnings, degraded-mode notes

## Error Handling

| Condition | Action |
|-----------|--------|
| `qmd` unavailable | Continue with `memory_search` only; record warning in site_context.md and append with the reason why qmd is unavailable |
| `memory_search` unavailable | Continue with `qmd` only; record warning in site_context.md and append with the reason why memory_search is unavailable |
| Both fail | Write explicit failure note to site_context.md; Stop and notify user about the failure. |

## Keyword and Domain Derivation

**Keyword sources:** issue summary, issue description, domain labels, component names from QA plan or testing plan.

**Domain sources:**
- defect-test: `tester_handoff.json.affected_domains`
- feature-test: QA plan domain labels and component names

**Canonical domains (examples):** `filter`, `search`, `dashboard-editor`, `report-editor`, `export`

## Rules

- Use BM25 only: `qmd search`. 
- Do NOT update MEMORY.md — site_context.md is run-specific; MEMORY.md would bloat.
- Update `task.json` with `site_context_path` (in full path)after writing.
