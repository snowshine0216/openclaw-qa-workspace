# Site Knowledge System — Agent-Side Design

> **Design ID:** `site-knowledge-agent-v1`
> **Date:** 2026-03-04
> **Status:** Draft — TDD Phase
> **Parent Design:** [SITE_KNOWLEDGE_SYSTEM_DESIGN.md](./SITE_KNOWLEDGE_SYSTEM_DESIGN.md)
> **Scope:** How the Tester Agent searches site knowledge and propagates context at test-run time.
>
> **⚠️ Constraint:** This document is in TDD design phase.
> Implementation code MUST NOT be written until the design is approved.

---

## 1. Overview

This document describes the **agent-side** of the Site Knowledge System — how the Tester Agent
**searches** the pre-generated `memory/site-knowledge/` files at runtime and propagates context to
sub-agents (Planner, Generator, Healer).

The generation side (how the files are produced) is covered in the parent design:
[SITE_KNOWLEDGE_SYSTEM_DESIGN.md](./SITE_KNOWLEDGE_SYSTEM_DESIGN.md).

### 1.1 Search Strategy: qmd BM25 + OpenClaw memorySearch

The agent uses **two search backends** (use one or both):

1. **qmd search** — BM25 keyword search only (`qmd search`). Fast, no embeddings required.
2. **OpenClaw memorySearch** — Semantic search (vector + keyword hybrid) when running inside OpenClaw.

**qmd uses only `qmd search`** — no `qmd vsearch`, no `qmd query`, no `qmd embed`. BM25 works without model downloads.

---

## 2. Pre-fetch Flow

```
Phase 0.5 [Site Knowledge Search]:
  1. Determine affected domain from QA plan / issue labels
  2. Search site knowledge:
       - qmd:  qmd search "keyword" -c site-knowledge --json -n 10
       - OpenClaw: memory_search tool (when available)
  3. Store resolved content into run context:
       memory/tester-flow/runs/<key>/site_context.md
  4. Sub-agents (planner / generator / healer) read site_context.md as context
  5. Update AGENTS.md / MEMORY.md with search activity (see Section 4)
```

---

## 3. Environment Setup and Configuration

### 3.1 qmd Setup (BM25 Only)

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
qmd search "CalendarFilter" -c site-knowledge --json -n 10
```

### 3.2 OpenClaw memorySearch Setup

When the Tester Agent runs inside OpenClaw, add `memory/site-knowledge` to the watched paths.

**Minimal config:**

```json
{
  "agents": {
    "defaults": {
      "memorySearch": {
        "enabled": true,
        "extraPaths": ["memory/site-knowledge"],
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
        "extraPaths": ["memory/site-knowledge"],
        "provider": "openai",
        "model": "openai/text-embedding-3-small",
        "remote": {
          "baseUrl": "https://openrouter.ai/api/v1/",
          "apiKey": "${OPENROUTER_API_KEY}"
        },
        "sync": { "watch": true },
        "query": { "maxResults": 8, "hybrid": { "enabled": true } },
        "cache": { "enabled": true }
      }
    }
  }
}
```

---

## 4. AGENTS.md and MEMORY.md Updates (Applied)

When the agent performs site knowledge search, it **must update** MEMORY.md with useful patterns found. AGENTS.md already contains the Site Knowledge Search section; MEMORY.md already defines the entry format.

### 4.1 AGENTS.md — Site Knowledge Search section (applied)

**Location:** [workspace-tester/AGENTS.md](../AGENTS.md), before "Tools" section.

**Content:**

```markdown
## Site Knowledge Search

Site knowledge (WDIO page objects, locators, UI components) lives in `memory/site-knowledge/`.

**Search methods:**
- **qmd (BM25):** `qmd search "keyword" -c site-knowledge --json -n 10`
- **OpenClaw:** Use `memory_search` tool when running in OpenClaw

**After search:** Update MEMORY.md with useful patterns (locators, component names) found.

See [SITE_KNOWLEDGE_SYSTEM_AGENT_DESIGN.md](docs/SITE_KNOWLEDGE_SYSTEM_AGENT_DESIGN.md).
```

### 4.2 MEMORY.md — Site Knowledge Search Activity section (applied)

**Location:** [workspace-tester/MEMORY.md](../MEMORY.md), before "Lessons Learned".

**Content:**

```markdown
## Site Knowledge Search Activity

When site knowledge search yields useful results, append entries:

- [YYYY-MM-DD] Site search: "<query>" → <file>: <key findings>
```

**Example:** `- [2026-03-04] Site search: "CalendarFilter" → filter.md: calendarFilterPanel, dateRangePicker`

### 4.3 Update rules

| When | Update |
|------|--------|
| Search returns useful locators/patterns | Append to MEMORY.md (one-line summary) |
| New domain or component discovered | Add to MEMORY.md for future reference |

---

## 5. Files to Create or Update

| File | Action | Purpose |
|------|--------|---------|
| `workspace-tester/AGENTS.md` | Done | Site Knowledge Search section added |
| `workspace-tester/MEMORY.md` | Done | Site Knowledge Search Activity section added |
| `workspace-tester/README_TESTER_FLOW.md` | Update | Add qmd setup (BM25 only) |
| `workspace-tester/.env.example` | Create or update | Document `NODE_LLAMA_CPP_CMAKE_OPTION_GGML_CUDA` |
| OpenClaw config | Update | Add memorySearch.extraPaths |

---

## 6. Implementation Roadmap

| Step | Task | Priority | Status |
|------|------|----------|--------|
| 1 | Add Site Knowledge Search section to AGENTS.md | **P1** | Done |
| 2 | Add MEMORY.md update rule (Site Knowledge Search Activity) | **P1** | Done |
| 3 | Wire Phase 0.5 to use qmd search / memory_search | **P2** | Pending |
| 4 | Add qmd index step to generation pipeline (post-save) | **P3** | Pending |

---

## 7. References

- [SITE_KNOWLEDGE_SYSTEM_DESIGN.md](./SITE_KNOWLEDGE_SYSTEM_DESIGN.md) — Generation pipeline
- [TESTER_AGENT_DESIGN_v2.md](./TESTER_AGENT_DESIGN_v2.md) — Parent Tester Agent design
- [qmd GitHub](https://github.com/tobi/qmd) — BM25 search CLI
- [OpenClaw memory docs](https://openclaw.im/docs/concepts/memory) — memorySearch config
- [OpenRouter Embeddings](https://openrouter.ai/docs/api/reference/embeddings) — OpenAI-compatible embeddings
