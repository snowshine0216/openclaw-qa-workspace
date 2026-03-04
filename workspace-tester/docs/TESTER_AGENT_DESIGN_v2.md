# Tester Agent v2 — Site Knowledge & Issue-only FC Flow

> **Design ID:** `tester-agent-v2`
> **Date:** 2026-03-04
> **Status:** Draft v2
> **Scope:** Strategy Product (Filter · AutoAnswers · Bot) — Site Knowledge Integration, Issue-only FC Flow
> **Relates to:** [TESTER_AGENT_DESIGN_v1.md](./TESTER_AGENT_DESIGN_v1.md) (core pipeline: QA plan → spec → run → heal)
> **Site Knowledge Detail:** [SITE_KNOWLEDGE_SYSTEM_DESIGN.md](./SITE_KNOWLEDGE_SYSTEM_DESIGN.md) ← TDD design with stubs & tests

---

## 1. Background & Context

> **Note:** This document focuses on the *new capabilities* added on top of the existing Tester Agent pipeline
> documented in `TESTER_AGENT_DESIGN.md`. Read that document first for the Phase 0–4 pipeline context.

The **Tester Agent** currently relies on QA plan Markdown specs (produced by the Planner Agent) to
know *what* to test. This works well for planned features. However, two gaps remain:

1. **Jira-issue-only input**: When a tester hands the agent only a Jira issue (bug report / FC task)
   without a pre-built QA plan, the agent has no structured knowledge of the affected area.

2. **Site ignorance**: Even with a QA plan, the agent may have no intuition about the application's
   UI layout — which panels exist, what buttons are available, how features interrelate — forcing
   it to do expensive live DOM exploration from scratch every time.

This design solves both using a **Site Knowledge System** comprising:
- A **Site Map Generation Script** that crawls the WDIO page-object repository and produces
  structured Markdown knowledge documents.
- **File-based persistence** — knowledge files are stored under `memory/site-knowledge/` as plain
  Markdown files (no RAG database required). The agent reads them directly at test time.
- An **Issue-only FC Flow** that lets the agent assess FC risk from a Jira issue (+ optional fix PR)
  and decide whether to run directly or handoff to the Planner Agent first.

> 📄 **Full Site Knowledge implementation design (TDD stubs + tests):**
> → [SITE_KNOWLEDGE_SYSTEM_DESIGN.md](./SITE_KNOWLEDGE_SYSTEM_DESIGN.md)

### 1.1 Product Scope

This design covers the **Strategy Product** — specifically the three feature domains in scope:

| Domain | WDIO POM Area | Key Spec Folders |
|--------|--------------|-----------------|
| **Filter** | `pageObjects/filter/` (16 files), `pageObjects/common/FilterPanel.js`, etc. | `specs/regression/filter/`, `specs/regression/reportFilter/`, `specs/regression/filterSearch/` |
| **AutoAnswers** | `pageObjects/autoAnswers/` (4 files: `AIAssistant`, `AIViz`, `Interpretation`, `Learning`) | `specs/regression/AutoAnswers/` |
| **Bot** | `pageObjects/aibot/` (27 files: `AIBotChatPanel`, `BotAuthoring`, `BotRulesSettings`, `GeneralSettings`, `BotCustomInstructions`, etc.) | `specs/regression/aibotChatPanel/`, `specs/regression/aibotSnapshotsPanel/`, `specs/regression/bot2/`, `specs/regression/botConfiguration/`, etc. |

---

## 2. Site Map Generation Script (Overview)

> 📄 **Full TDD design with stub functions and test cases:**
> → [SITE_KNOWLEDGE_SYSTEM_DESIGN.md](./SITE_KNOWLEDGE_SYSTEM_DESIGN.md)
>
> This section provides a high-level summary only. Refer to the linked doc for implementation details.

### 2.1 Purpose

The script crawls the WDIO page-object repository and extracts structured, human+agent-readable
site knowledge from the page-object files. The output is a set of Markdown files written to
`memory/site-knowledge/` (no Weaviate server required).

The script is **intentionally decoupled from any specific repo location** — it accepts a local path or
GitHub URL as input and scans from there.

### 2.2 Script Signature


``` bash
# Usage: generate-domains-config.mjs
node generate-domains-config.mjs \
  --repo <local-path-or-github-url> \
  --output ./config/domains.json

# Example (local repo)
node generate-domains-config.mjs \
  --repo /path/to/wdio \
  --output ./config/domains.json

# Example (GitHub URL)
node generate-domains-config.mjs \
  --repo https://github.com/microstrategy/library-automation-wdio \
  --output ./config/domains.json

# Example (all domains)
node generate-domains-config.mjs \
  --repo https://github.com/microstrategy/library-automation-wdio \
  --output ./config/domains.json \
  --domains all

# Example (specific domains)
node generate-domains-config.mjs \
  --repo https://github.com/microstrategy/library-automation-wdio \
  --output ./config/domains.json \
  --domains filter,autoAnswers,aibot
```

```bash
# Usage: generate-sitemap.mjs
node generate-sitemap.mjs \
  --repo <local-path-or-github-url> \
  --domains filter,autoAnswers,aibot \
  --output-dir memory/site-knowledge

# Example (local repo)
node generate-sitemap.mjs \
  --repo /path/to/wdio \
  --domains filter,autoAnswers,aibot \
  --output-dir memory/site-knowledge

# Example (GitHub URL)
node generate-sitemap.mjs \
  --repo https://github.com/microstrategy/library-automation-wdio \
  --domains all \
  --output-dir memory/site-knowledge
```

### 2.3 Script Pipeline (Functional Decomposition)

```
Input: repo path / GitHub URL
      ↓
[1] resolvePomFiles(repoPath, domains)
    → returns: list of { domain, filePath, fileName }

      ↓
[2] parsePomFile(filePath)
    → returns: PomSummary {
        domain, className, parentClass,
        locators: [{ name, selector, type }],
        actions:  [{ name, description, params }],
        subComponents: [className]
      }

      ↓
[3] buildDomainSheet(domain, [PomSummary])
    → returns: Markdown string (domain knowledge sheet)

      ↓
[4] buildCompactSitemap([DomainSheet])
    → returns: compact SITEMAP.md (all domains, top-level)

      ↓
[5] saveKnowledgeToFile(outputDir, domainSheets, sitemapContent, metadata)
    → writes SITEMAP.md, <domain>.md files, and metadata.json to outputDir
    → returns: SaveResult { filesWritten: string[] }
```

**Design principle:** Each function is ≤ 20 lines, pure/functional, independently testable.

**Output location:** `memory/site-knowledge/` (subfolder structure — see §2.4 and [SITE_KNOWLEDGE_SYSTEM_DESIGN.md §2.1](./SITE_KNOWLEDGE_SYSTEM_DESIGN.md))

### 2.4 Output File Layout

```
memory/site-knowledge/
├── SITEMAP.md          ← compact, always-available overview
├── filter.md           ← full domain sheet (CalendarFilter, CheckboxFilter, …)
├── autoAnswers.md      ← full domain sheet (AIAssistant, AIViz, …)
├── aibot.md            ← full domain sheet (AIBotChatPanel, BotAuthoring, …)
└── metadata.json       ← generation metadata (timestamp, source repo, doc counts)
```

→ For full Markdown format examples and parsing strategy see [SITE_KNOWLEDGE_SYSTEM_DESIGN.md §4–§6](./SITE_KNOWLEDGE_SYSTEM_DESIGN.md).

### 2.5 Parsing Strategy: WDIO POM → Structured Knowledge

WDIO page object files follow a consistent pattern. The parser extracts:

#### What it extracts from each POM file:

```
class FilterPanel extends BaseContainer {
   // [1] Class name → domain + component name

   getFilterDropdown()  { return this.$('.mstrd-FilterDropdown'); }
   // [2] get* methods → locators: { name: 'FilterDropdown', css: '.mstrd-FilterDropdown' }

   async applyFilter(value) { ... }
   // [3] async methods → actions: { name: 'applyFilter', params: ['value'] }

   getTitle()  { return this.$('.mstrd-FilterPanel-title'); }
   // [4] UI element names → user-visible UI vocabulary
}
```

#### Output per POM (PomSummary JSON, internal):

```json
{
  "domain": "filter",
  "className": "CalendarFilter",
  "parentClass": "BaseContainer",
  "locators": [
    { "name": "CalendarWidget", "css": ".mstrd-CalendarWidget", "type": "element" },
    { "name": "DateRangeInput",  "css": ".mstrd-DateRange-input", "type": "input" }
  ],
  "actions": [
    { "name": "selectDate", "params": ["year", "month", "day"] },
    { "name": "applyFilter", "params": [] },
    { "name": "clearFilter", "params": [] }
  ],
  "subComponents": ["CalendarHeader", "CalendarWidget"]
}
```

### 2.5 Domain Knowledge Sheet Format

Each domain produces one Markdown file. Example for `filter`:

```markdown
# Site Knowledge: Filter Domain

## Overview

- **Domain key:** `filter`
- **Components covered:** CalendarFilter, CheckboxFilter
- **Spec files scanned:** 23
- **POM files scanned:** 16

## Components

### CalendarFilter
- **CSS root:** `.mstrd-CalendarWidget`
- **User-visible elements:**
  - Date range input (`.mstrd-DateRange-input`)
  - Apply button (`.mstrd-Apply-btn`)
  - Clear button (`.mstrd-Clear-btn`)
- **Component actions:**
  - `applyFilter()`
  - `selectDate(year, month, day)`
- **Related components:** CalendarWidget

## Common Workflows (from spec.ts)

1. Apply attribute filter and validate grid refresh (used in 11 specs)
2. Clear all filters and verify default state (used in 7 specs)
3. Date range selection and apply (used in 6 specs)

## Common Elements (from POM + spec.ts)

1. Filter Panel toggle button -- frequency: 18
2. Apply button -- frequency: 15
3. Date range input -- frequency: 12

## Key Actions

- `applyFilter()` -- used in 14 specs
- `clearFilter()` -- used in 8 specs
- `selectDate(year, month, day)` -- used in 6 specs

## Source Coverage

- `pageObjects/filter/*.js`
- `pageObjects/common/FilterPanel.js`
- `specs/regression/filter/**/*.spec.ts`
- `specs/e2e/filter/**/*.ts`
```

### 2.6 Compact SITEMAP.md (Layer 1 — Always Available)

The compact sitemap is a single file summarizing all in-scope domains:

```markdown
# Site Knowledge -- Compact Sitemap

> Generated: <ISO8601>
> Source: <repo-url>

## Filter

- **Domain key:** `filter`
- **Navigation:** Library Home -> open a Dossier/Report -> Filter Panel
- **Components:** 16
- **Common workflows:** 7
- **Common elements:** 29
- **Detail file:** `filter.md`
- **Query hint:** `query sitemap:filter`

## AutoAnswers (AI Assistant)

- **Domain key:** `autoAnswers`
- **Navigation:** Library Home -> Dossier with AI enabled -> AI Assistant panel
- **Components:** 4
- **Common workflows:** 5
- **Common elements:** 12
- **Detail file:** `autoAnswers.md`
- **Query hint:** `query sitemap:autoAnswers`
```

---

## 3. Site Knowledge Storage (File-based)

> ❌ **Weaviate RAG database is NOT used in this design.**
> ✅ Knowledge is stored as plain Markdown files under `memory/site-knowledge/`.

### 3.1 Architecture Overview

```
┌────────────────────────────────────┐
│  generate-sitemap.mjs (script)     │  ← Run on demand / scheduled
│  Input: WDIO repo path             │
│  Output: Markdown files            │
└──────────────┬─────────────────────┘
               │ write files
               ▼
┌────────────────────────────────────┐
│   memory/site-knowledge/           │
│   ├── SITEMAP.md                   │
│   ├── filter.md                    │
│   ├── autoAnswers.md               │
│   ├── aibot.md                     │
│   └── metadata.json               │
└──────────────┬─────────────────────┘
               │ read at test time
               ▼
┌────────────────────────────────────┐
│   Tester Agent                     │
│   readSiteKnowledge(dir, domain)   │
│   → returns Markdown content       │
│   → agent uses to guide testing    │
└────────────────────────────────────┘
```


---

## 4. How the Tester Agent Uses Site Knowledge During Testing

### 4.1 Augmented Testing Flow

> **Scope:** Feature testing only (no performance, load, or stress testing).

```
User: "Test BCIN-7890" (or issue-only flow, see [§5](./SITE_KNOWLEDGE_SYSTEM_AGENT_DESIGN.md#5-issue-only-fc-flow--reporter-delegated-design))
       ↓
Phase 0: QA Plan Discovery (same as TESTER_AGENT_DESIGN.md §3.1)
       ↓
Phase 0.5 [NEW]: Site Knowledge Pre-fetch
  → Extract feature domain from QA plan metadata or issue labels
  → Read file: memory/site-knowledge/<domain>.md  (falls back to SITEMAP.md)
  → Optionally: searchKnowledgeContent(content, keyword) for targeted excerpts
  → Store resolved context in: memory/tester-flow/runs/<key>/site_context.md
       ↓
Phase 1: Spec Refactoring (playwright-test-planner)
  → Planner reads site_context.md for navigation guidance
  → Knows which UI areas to reference in step descriptions
       ↓
Phase 2: Test Generation (playwright-test-generator)
  → Generator reads site_context.md for:
    a. Component names (to comment in code: "// AIBotChatPanel area")
    b. CSS anchors (for fallback locators if semantic ones fail)
    c. Action vocabulary (to write correct step descriptions)
  → Playwright MCP (via mcporter) does LIVE DOM inspection for actual locators
    (e.g. mcporter call user-playwright-mcp.browser_snapshot, browser_navigate, browser_click)
       ↓
Phase 3: Execution & Healing (playwright-test-healer)
  → Healer uses Playwright MCP via mcporter skills for feature testing only
  → Healer can re-query site_context.md to understand what a failing element IS
  → Provides semantic fallback if a locator breaks
       ↓
Phase 4: Report & Confirmation
  → Generate execution report (summary, pass/fail per step, screenshots)
  → Confirm with user before closing Jira or filing defects
```

### 4.2 WDIO Page Objects → Playwright MCP: Compatibility Rationale

> **This is a common concern. Here is the explicit rationale:**

The WDIO page objects serve as **semantic knowledge**, not as **locator templates**.

| What WDIO gives us | How Playwright MCP uses it |
|--------------------|---------------------------|
| CSS class names (`.mstrd-FilterPanel`) | Used as *reference anchors* in `page.locator()` if semantic locators are unavailable |
| Action vocabulary (`applyFilter`, `clearFilter`) | Guides what test steps to write |
| Component hierarchy (`FilterPanel` contains `CalendarFilter`) | Tells agent what section of the UI to `browser_snapshot` first |
| UI element names (`DateRangeInput`, `ApplyButton`) | Agent uses `getByRole` / `getByLabel` / `getByText` to find these semantically |

**Key point:** The agent uses Playwright MCP's `browser_snapshot` (live DOM snapshot) to discover
the *actual current* locators for the *actual current* browser. The WDIO site map **reduces the
search space** by telling the agent what elements *should exist* on a given page.

Because MicroStrategy Library's CSS classes (`.mstrd-*`) are consistent across both WDIO and
Playwright, they serve as reliable fallback locators even when ARIA roles are missing.

**No compatibility problem.** WDIO site knowledge + Playwright MCP is a complementary pair:
- WDIO = *what* the UI contains and *what actions it supports*
- Playwright MCP = *actual live DOM* and *exact locators at test time*

---

## 5. Issue-only FC Flow — Reporter-Delegated Design

> **Single source of truth:** [SITE_KNOWLEDGE_SYSTEM_AGENT_DESIGN.md §5](./SITE_KNOWLEDGE_SYSTEM_AGENT_DESIGN.md#5-issue-only-fc-flow--reporter-delegated-design)
>
> The full design (overview, responsibilities, session_spawn protocol, idempotency guard, tester handoff contract, site knowledge search) lives in the Site Knowledge Agent Design document. This section provides a pointer for readers of the Tester Agent design.

---

## 6. Site Map Generation Script: File Structure

The script lives in the tester workspace tooling area:

```
workspace-tester/
├── tools/
│   └── sitemap-generator/
│       ├── generate-sitemap.mjs        ← Main entrypoint
│       ├── src/
│       │   ├── resolvePomFiles.mjs     ← Find POM files by domain
│       │   ├── parsePomFile.mjs        ← Extract locators + actions from a .js POM
│       │   ├── buildDomainSheet.mjs    ← Render domain Markdown sheet
│       │   ├── buildCompactSitemap.mjs ← Render compact SITEMAP.md
│       │   └── uploadToWeaviate.mjs    ← Weaviate upsert client
│       ├── config/
│       │   ├── domains.json            ← Domain → POM folder mapping
│       │   └── weaviate.config.json    ← Server URL, class name, vectorizer
│       ├── output/                     ← Local output before upload (gitignored)
│       └── README.md                  ← Usage guide
```

### `domains.json` — Domain Registry

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

## 7. Task State Extensions (Single-Issue FC Mode)

The `task.json` schema for single-issue FC mode:

```json
{
  "run_key": "BCIN-7890",
  "mode": "single_issue_fc",
  "overall_status": "waiting_for_reporter | testing | test_complete | completed | fail_escalated",
  "reporter_spawned_at": "<ISO8601>",
  "issue_key": "BCIN-7890",
  "testing_plan_source": "workspace-reporter/projects/defects-analysis/BCIN-7890/BCIN-7890_TESTING_PLAN.md",
  "tester_handoff": {
    "risk_level": "MEDIUM",
    "fc_steps_count": 3,
    "exploratory_required": true,
    "affected_domains": ["filter"]
  },
  "site_knowledge": {
    "queried_at": "<ISO8601>",
    "query": "CalendarFilter reset behaviour filter",
    "context_path": "memory/tester-flow/runs/BCIN-7890/site_context.md",
    "keyword_matches": 4
  },
  "result": "PASS | FAIL | null",
  "evidence_path": "memory/tester-flow/runs/BCIN-7890/reports/",
  "test_completed_at": "<ISO8601>",
  "reporter_notified_at": "<ISO8601>"
}
```

---

## 8. Implementation Roadmap

### Phase A — Site Map Generator (Priority: High)

> 📄 See [SITE_KNOWLEDGE_SYSTEM_DESIGN.md §10](./SITE_KNOWLEDGE_SYSTEM_DESIGN.md) for full TDD implementation roadmap (12 steps).

| Step | Task | Notes |
|------|------|-------|
| A1 | Create test fixtures (`fixtures/wdio-stub/`, `fixtures/pom/`) | Required by all tests |
| A2 | Implement `parsePomFile.mjs` (extractClassInfo, extractLocators, extractActions) | TDD: write tests → implement |
| A3 | Implement `resolvePomFiles.mjs` | TDD: write tests → implement |
| A4 | Implement `buildDomainSheet.mjs` + `buildCompactSitemap.mjs` | TDD: write tests → implement |
| A5 | Implement `saveKnowledgeToFile.mjs` (replaces Weaviate upload) | Writes to `memory/site-knowledge/` |
| A6 | Create `domains.json` for filter, autoAnswers, aibot | Seed from POM audit |
| A7 | Run against local wdio repo, review Markdown quality | Manual review |

### Phase B — Tester Agent Integration (Priority: High)

| Step | Task | Notes |
|------|------|-------|
| B1 | Add Phase 0.5 (Site Knowledge Pre-fetch) to Tester workflow | Read from `memory/site-knowledge/` |
| B2 | Implement `readSiteKnowledge()` + `searchKnowledgeContent()` | See [SITE_KNOWLEDGE_SYSTEM_DESIGN.md §7](./SITE_KNOWLEDGE_SYSTEM_DESIGN.md) |
| B3 | Pass `site_context.md` into planner/generator skill context | Update skill invocation arguments |

### Phase C — Issue-only FC Flow (Priority: Medium)

| Step | Task | Notes |
|------|------|-------|
| C1 | Implement `fetchIssueContext()` | Jira REST API, returns `IssueContext` |
| C2 | Implement `fetchPRContext()` | GitHub API, returns `PRContext` |
| C3 | Implement `assessFCRisk()` | Rule scoring table (Reporter; see [SITE_KNOWLEDGE_SYSTEM_AGENT_DESIGN.md §5](./SITE_KNOWLEDGE_SYSTEM_AGENT_DESIGN.md#5-issue-only-fc-flow--reporter-delegated-design)) |
| C4 | Implement `routeByRisk()` | Calls planner spawn OR direct test |
| C5 | Add fc-specific spec generation | Reporter TESTING_PLAN.md (see [SITE_KNOWLEDGE_SYSTEM_AGENT_DESIGN.md §5](./SITE_KNOWLEDGE_SYSTEM_AGENT_DESIGN.md#5-issue-only-fc-flow--reporter-delegated-design)) |

### Phase D — RAG Inspection UI (Priority: Low / Deferred)

| Step | Task | Notes |
|------|------|-------|
| D1 | Design UI wireframe | Domain selector, search, doc view |
| D2 | Implement lightweight web UI | Simple HTML/JS or Next.js |
| D3 | Connect to Weaviate REST API | Read-only queries + re-generation trigger |

---

## 9. Design Decisions & Rationale

### 9.1 Why generate from WDIO, not from library-automation (Playwright)?

The **WDIO project has 454 page object files** covering the full product surface (43 domains). The
library-automation Playwright project has only **5 POM domains** (partially migrated). Using WDIO
gives far richer site knowledge while the Playwright migration is still in progress.

As the Playwright migration completes, the generator can be extended to also crawl
`library-automation/tests/page-objects/` for up-to-date Playwright-native knowledge.

### 9.2 Why not import raw POM files into Weaviate?

Raw `.js` files contain code implementation details that add noise. The generator extracts only:
- Public API (method names, action signatures)
- Locator vocabulary (CSS classes → element names)
- Component relationships

This keeps RAG documents concise and high signal-to-noise.

### 9.3 Why no user confirmation in the FC flow?

The user's intent (FC on BCIN-7890) is clear. Asking "should I call the planner?" on every
low-risk FC adds friction. The agent:
- Documents its reasoning in `task.json` (risk score + rationale)
- Notifies the user of the routing decision upfront
- Can be overridden if the user disagrees (idle state → user can redirect)

### 9.4 Why a script (not an agent task) for site map generation?

Site map generation is a **batch ETL operation**, not a reasoning task. A plain Node.js script:
- Is reproducible, testable, and CI-friendly
- Does not require LLM reasoning (parsing + formatting is deterministic)
- Can be scheduled (e.g. nightly) or triggered by repo events (POM file changed)

The agent only *consumes* the output; it never must generate it.

---

## 10. References

- [SITE_KNOWLEDGE_SYSTEM_DESIGN.md](./SITE_KNOWLEDGE_SYSTEM_DESIGN.md) — **TDD design for Site Knowledge System** (stubs + tests, file-based storage)
- [SITE_KNOWLEDGE_SYSTEM_AGENT_DESIGN.md](./SITE_KNOWLEDGE_SYSTEM_AGENT_DESIGN.md) — **Agent-side design** (pre-fetch flow, qmd/memorySearch, **Issue-only FC Flow §5** — single source of truth)
- [TESTER_AGENT_DESIGN_v1.md](./TESTER_AGENT_DESIGN_v1.md) — Core tester pipeline (Phase 0–4)
- [wdio/pageObjects/filter/](../projects/wdio/pageObjects/filter/) — Filter POM source
- [wdio/pageObjects/aibot/](../projects/wdio/pageObjects/aibot/) — Bot POM source (27 files)
- [wdio/pageObjects/autoAnswers/](../projects/wdio/pageObjects/autoAnswers/) — AutoAnswers POM source
- [wdio/specs/regression/featureMapping.json](../projects/wdio/specs/regression/featureMapping.json) — Feature → spec file registry
- [library-automation/tests/page-objects/](../projects/library-automation/tests/page-objects/) — Playwright POMs (in-progress migration)
- Node.js built-in test runner: https://nodejs.org/api/test.html
- Playwright MCP: `mcporter call playwright.browser_snapshot`
