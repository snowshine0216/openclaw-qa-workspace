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

```bash
# Usage
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
Covers: CalendarFilter, CheckboxFilter, RadiobuttonFilter, SearchBoxFilter,
        DynamicFilter, MQFilter, MQSliderFilter, FilterSummaryBar, ParameterFilter,
        VisualizationFilter, AttributeSlider, Timezone

## Components

### CalendarFilter
**CSS root:** `.mstrd-CalendarWidget`
**User-visible elements:**
- Date range input (`.mstrd-DateRange-input`) — user types or picks a date
- Apply button — confirms filter selection
- Clear button — resets selection
- Month/Year navigation arrows

**Key actions:**
- `selectDate(year, month, day)` — pick a specific date
- `applyFilter()` — confirm
- `clearFilter()` — reset

**Related components:** CalendarHeader, CalendarWidget, CalendarDynamicPanel

---

### CheckboxFilter
**CSS root:** `.mstrd-CheckboxFilter`
**User-visible elements:**
- List of attribute values as checkboxes
- Search box (`.mstrd-FilterSearch`) — filter the checkbox list
- Select All / Clear All buttons

**Key actions:**
- `selectElement(value)` — check one value
- `selectAll()` / `clearAll()` — bulk select/clear
- `searchElement(text)` — type in search box

... (other components follow the same pattern)
```

### 2.6 Compact SITEMAP.md (Layer 1 — Always Available)

The compact sitemap is a single file summarizing all in-scope domains:

```markdown
# MicroStrategy Library — Site Map (Strategy Product)
# Generated: <ISO8601>  Source: <repo-url>

## Product Areas (In Scope)

### Filter
Navigation: Library Home → open a Dossier/Report → Filter Panel (sidebar or top bar)
Key UI entry points:
- Filter Panel toggle button (top-right of viewer)
- Filter capsules in summary bar
- Individual filter widgets (calendar, checkbox, dropdown, slider, searchbox)

Components: CalendarFilter, CheckboxFilter, RadiobuttonFilter, SearchBoxFilter,
            DynamicFilter, MQFilter, MQSliderFilter, FilterSummaryBar, ParameterFilter

For detail: query sitemap:filter

---

### AutoAnswers (AI Assistant)
Navigation: Library Home → Dossier with AI enabled → AI Assistant panel
Key UI entry points:
- AI Assistant panel toggle (right sidebar icon)
- Interpretation blade (auto-generated insights)
- Learning tab (user feedback on answers)
- AI Visualization panel

Components: AIAssistant, AIViz, Interpretation, Learning

For detail: query sitemap:autoAnswers

---

### Bot (AI Bot)
Navigation: Library Home → Bot item on home page → Bot chat / edit mode
Key UI entry points:
- Bot home card (library list view)
- Chat panel (send messages, see answers, snapshots)
- Dataset panel (add/remove datasets)
- Bot authoring (create/edit bot: rules, custom instructions, general settings)
- Snapshots panel

Components: AIBotChatPanel, AIBotDatasetPanel, AIBotDatasetPanelContextMenu,
            BotAuthoring, BotCustomInstructions, BotRulesSettings, GeneralSettings,
            AIBotSnapshotsPanel, AIBotUsagePanel, HistoryPanel, CacheManager,
            BotAppearance, ChatAnswer, WarningDialog

For detail: query sitemap:aibot
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

### 3.2 Agent-side Read API

```typescript
// Pattern 1: Load full domain sheet before testing
const { content } = await readSiteKnowledge('memory/site-knowledge', 'filter');
// → reads memory/site-knowledge/filter.md

// Pattern 2: Keyword search within loaded content
const excerpts = searchKnowledgeContent(content, 'CalendarFilter', 3);
// → returns matching line blocks (pure function, no filesystem)

// Pattern 3: Top-level overview only (unknown domain, or cross-domain task)
const { content } = await readSiteKnowledge('memory/site-knowledge', 'unknown');
// → falls back to SITEMAP.md
```

→ Full stubs and tests for these functions: [SITE_KNOWLEDGE_SYSTEM_DESIGN.md §7](./SITE_KNOWLEDGE_SYSTEM_DESIGN.md)

---

## 4. How the Tester Agent Uses Site Knowledge During Testing

### 4.1 Augmented Testing Flow

```
User: "Test BCIN-7890" (or issue-only flow, see §5)
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
  → Playwright MCP does LIVE DOM inspection for actual locators
       ↓
Phase 3: Execution & Healing (playwright-test-healer)
  → Healer can re-query site_context.md to understand what a failing element IS
  → Provides semantic fallback if a locator breaks
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

## 5. Issue-only FC Flow

### 5.1 Overview

When the user provides only a **Jira issue key** (no pre-existing QA plan), the agent must:
1. Fetch the issue (description, type, labels, fix PR link if any)
2. Assess whether a full QA plan is needed or a direct smoke test is sufficient
3. Either auto-handoff to Planner or run targeted tests directly

```
User: "FC BCIN-7890" (issue key, no QA plan)
       ↓
[A] Fetch Jira issue metadata
    - description, labels, components, priority, fix PR(s)
       ↓
[B] Fetch fix PR diff (if linked)
    - changed files → map to feature domain (filter? bot? autoAnswers?)
    - changed files → estimate scope (1 component changed vs 5)
       ↓
[C] FC Risk Assessment
    - Rule-based scoring (see §5.2)
       ↓
[D] Route based on risk score
    Low risk  → Direct targeted test (skip planner, use site knowledge to guide)
    High risk → Auto-handoff to Planner to draft QA plan first
```

### 5.2 FC Risk Assessment Rules

The agent scores the FC risk and decides the flow automatically.

| Signal | Weight | How to get it |
|--------|--------|--------------|
| Priority: P1/P2 | +3 | Jira `priority` field |
| Fix touches > 3 files | +2 | PR diff file count |
| Fix touches > 1 domain (filter + bot) | +3 | PR diff → map to POM domains |
| Issue labels include "regression-risk" | +2 | Jira labels |
| Fix is a config/feature-flag change only | -2 | PR diff: only config files changed |
| Issue description is < 50 words (vague) | +1 | Description length |
| QA plan exists from planner workspace | -3 | Phase 0.2 check (already done) |

**Scoring:**
- **Score ≥ 4** → High risk → Auto-handoff to Planner (see §5.3)
- **Score < 4** → Low risk → Direct targeted test (see §5.4)

> **Note on confirmation:** The agent does NOT ask the user for confirmation before routing.
> It documents the risk score and rationale in `task.json` and proceeds automatically.
> The user is informed of the decision via progress notification.

### 5.3 High-risk Route — Handoff to Planner

```
Agent notifies: "⚠️ FC risk score: 5/10 (P1 bug, 4 files changed across filter+bot domains).
                Handing off to Planner Agent to draft a QA plan before testing."
       ↓
In OpenClaw:
  session spawn --agent planner \
    --skill feature-planner \
    --context "Draft QA plan for FC: BCIN-7890.
               Issue: <description>
               Fix PR: <PR URL>
               Focus domains: filter, aibot
               Use /test-case-generation workflow."
       ↓
Wait for planner to produce specs in:
  workspace-planner/projects/feature-plan/BCIN-7890/specs/
       ↓
Resume Tester pipeline from Phase 0.2 (cross-workspace spec discovery)
```

### 5.4 Low-risk Route — Direct Targeted Test

```
Agent notifies: "✅ FC risk score: 2/10 (config change only, single component).
                Running targeted smoke test directly."
       ↓
Phase 0.5: Site Knowledge Pre-fetch
  → Query: "CalendarFilter reset behaviour" (derived from issue description + fix PR)
  → Store as site_context.md
       ↓
Phase 1*: Generate minimal spec on-the-fly
  → Agent drafts a targeted .md spec from:
    a. Issue description (what behaviour changed)
    b. Fix PR diff (what code was touched)
    c. Site context (which UI elements to interact with)
  → Stored as: specs/fc/<BCIN-7890>/targeted_smoke.md
       ↓
Phase 2–4: Normal generation → run → heal pipeline
```

### 5.5 Jira Issue Fetch Contract

```typescript
interface IssueContext {
  key: string;            // e.g. "BCIN-7890"
  summary: string;
  description: string;
  priority: "P1" | "P2" | "P3" | "P4";
  labels: string[];
  components: string[];   // e.g. ["Filter", "Library"]
  fixPRs: string[];       // GitHub PR URLs if linked
  affectedVersions: string[];
}

interface PRContext {
  url: string;
  changedFiles: string[];     // relative file paths
  changedDomains: string[];   // inferred: ["filter", "aibot"]
  diffSummary: string;        // first 500 chars of unified diff
}
```

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

## 7. Task State Extensions

The `task.json` schema from `TESTER_AGENT_DESIGN.md` is extended with two new sections:

```json
{
  "run_key": "BCIN-7890:fc",
  "overall_status": "in_progress",
  "input_type": "issue",
  "issue_context": {
    "key": "BCIN-7890",
    "priority": "P2",
    "fix_prs": ["https://github.com/org/repo/pull/4521"],
    "affected_domains": ["filter"]
  },
  "fc_risk": {
    "score": 2,
    "rationale": "Single file changed (CalendarFilter.js). Config change only. P2.",
    "route": "direct_targeted_test"
  },
  "site_knowledge": {
    "queried_at": "<ISO8601>",
    "query": "CalendarFilter reset behaviour",
    "context_path": "memory/tester-flow/runs/BCIN-7890/site_context.md",
    "source_file": "memory/site-knowledge/filter.md",
    "keyword_matches": 3
  },
  "phases": { "...": "same as TESTER_AGENT_DESIGN.md" }
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
| C3 | Implement `assessFCRisk()` | Rule scoring table from §5.2 |
| C4 | Implement `routeByRisk()` | Calls planner spawn OR direct test |
| C5 | Add fc-specific spec generation (§5.4) | On-the-fly .md from issue + site context |

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
- [TESTER_AGENT_DESIGN_v1.md](./TESTER_AGENT_DESIGN_v1.md) — Core tester pipeline (Phase 0–4)
- [wdio/pageObjects/filter/](../projects/wdio/pageObjects/filter/) — Filter POM source
- [wdio/pageObjects/aibot/](../projects/wdio/pageObjects/aibot/) — Bot POM source (27 files)
- [wdio/pageObjects/autoAnswers/](../projects/wdio/pageObjects/autoAnswers/) — AutoAnswers POM source
- [wdio/specs/regression/featureMapping.json](../projects/wdio/specs/regression/featureMapping.json) — Feature → spec file registry
- [library-automation/tests/page-objects/](../projects/library-automation/tests/page-objects/) — Playwright POMs (in-progress migration)
- Node.js built-in test runner: https://nodejs.org/api/test.html
- Playwright MCP: `mcporter call playwright.browser_snapshot`
