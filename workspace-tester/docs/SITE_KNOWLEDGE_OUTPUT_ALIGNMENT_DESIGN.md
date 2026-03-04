# Site Knowledge Output Alignment — Implementation Design

> **Design ID:** `site-knowledge-output-alignment-impl-v2`
> **Date:** 2026-03-04
> **Status:** Design — Updated per review findings
> **Plan Source:** [SITE_KNOWLEDGE_OUTPUT_ALIGNMENT_PLAN2.md](./SITE_KNOWLEDGE_OUTPUT_ALIGNMENT_PLAN2.md)
> **Parent Design:** [SITE_KNOWLEDGE_SYSTEM_DESIGN.md](./SITE_KNOWLEDGE_SYSTEM_DESIGN.md)

---

## 0. Decision Summary

This version resolves all review findings and applies the latest constraints:

1. `SITEMAP.md` is an **index layer** (not a long narrative document).
2. `<domain>.md` is the rich knowledge layer and must include:
   components, common workflows, and common element usage.
3. The generator must support **all areas defined in `domains.json`**, not only `filter/autoAnswers/aibot`.
4. Domain knowledge must be built from both:
   POM parsing (`*.js`) and spec parsing (`*.spec.ts` / `*.ts` configured under `specPaths`).
5. Domain display alias is supported via config (example: `AutoAnswers (AI Assistant)`).

No implementation code is changed in this document.

---

## 1. Updated Problem Statement

Current state does not satisfy the target behavior:

1. Layer 1 is index-like, but lacks explicit alias support and stronger contract guarantees.
2. Layer 2 mostly reflects POM internals and does not include usage intelligence from spec files.
3. Contract tests are not strict enough to guarantee expected output equals actual output.
4. All-domain support is under-specified in the alignment implementation plan.

---

## 2. Architecture Update (POM + Spec Fusion)

### 2.1 Pipeline

```text
[unchanged] resolvePomFiles(repo, domains, domains.json)
[NEW]       resolveSpecFiles(repo, domains, domains.json)
      ↓
[unchanged] parsePomFile(fileEntry)   -> PomSummary
[NEW]       parseSpecFile(fileEntry)  -> SpecSummary
      ↓
[NEW]       buildDomainKnowledge(domain, pomSummaries, specSummaries) -> DomainKnowledgeModel
      ↓
[CHANGED]   buildDomainSheet(domainModel)      -> rich <domain>.md
[CHANGED]   buildCompactSitemap(domainModels)  -> index SITEMAP.md
      ↓
[unchanged] saveKnowledgeToFile(outputDir, ...)
```

### 2.2 Domain Coverage Rule

`--domains all` means all keys from `domains.json.domains` in deterministic order.

Deterministic order rule:

1. Domain order: preserve `domains.json` key order.
2. Component order: alphabetical by `className`.
3. Workflow order: descending frequency, then alphabetical by workflow name.
4. Common element order: descending frequency, then alphabetical by element label.

---

## 3. Data Contract Changes

### 3.1 `domains.json` Extension (All Domains)

Each domain entry supports:

```jsonc
{
  "domains": {
    "autoAnswers": {
      "displayName": "AutoAnswers (AI Assistant)",
      "pomPaths": ["pageObjects/autoAnswers", "pageObjects/common"],
      "specPaths": ["specs/regression/autoAnswers", "specs/e2e/ai"],
      "navigationHint": "Library Home -> Dossier with AI enabled -> AI Assistant panel",
      "keyEntryPoints": [
        "AI Assistant panel toggle (right sidebar)",
        "Interpretation blade",
        "Learning tab"
      ]
    }
  }
}
```

Notes:

1. `displayName` is required for user-facing headings when alias is needed.
2. If `displayName` is missing, fallback is `titleCase(domainKey)`.
3. `specPaths` can include multiple folders; generator scans all configured paths for the domain.

### 3.2 New Internal Types

```typescript
interface SpecSummary {
  domain: string;
  filePath: string;
  workflowNames: string[];            // inferred from describe/test titles and major step groups
  actionCalls: string[];              // high-level action/API calls used in specs
  locatorTokens: string[];            // selector strings or page-object locator references
  componentMentions: string[];        // class/object names used in specs
}

interface DomainKnowledgeModel {
  domain: string;
  displayName: string;
  navigationHint: string;
  keyEntryPoints: string[];
  componentNames: string[];
  componentCount: number;
  workflows: Array<{ name: string; frequency: number; sources: string[] }>;
  commonElements: Array<{ label: string; frequency: number; examples: string[] }>;
  detailFile: string;                 // e.g. filter.md
}
```

---

## 4. Output Contract (Canonical)

### 4.1 Layer 1: `SITEMAP.md` is an Index

Layer 1 is intentionally compact and navigational.
It does not duplicate full workflow detail.

Required fields per domain block:

1. Display name (alias-aware)
2. Navigation hint
3. Component count
4. Workflow count (derived from spec files)
5. Common element count (derived from POM + spec fusion)
6. Detail file pointer
7. Query hint (`query sitemap:<domain>`)

### 4.2 Layer 2: `<domain>.md` Rich Knowledge Sheet

Required top-level sections:

1. `## Overview`
2. `## Components`
3. `## Common Workflows (from spec.ts)`
4. `## Common Elements (from POM + spec.ts)`

`## Components` remains component-centric.
`## Common Workflows` and `## Common Elements` are usage-centric and based on spec scan.

### 4.3 Formatting Canonicalization (Strict)

To avoid drift, canonical formatting is fixed:

1. `SITEMAP.md` header line: `# Site Knowledge -- Compact Sitemap`
2. Generated and Source are two separate blockquote lines.
3. Domain heading format: `## <displayName>`.
4. Section delimiters: one blank line between sections, no trailing spaces.
5. No extra sections unless documented in this file.

---

## 5. Example Output (Based on This Design)

### 5.1 Example `SITEMAP.md`

```markdown
# Site Knowledge -- Compact Sitemap

> Generated: 2026-03-04T10:00:00.000Z
> Source: `git@github.com:mstr-kiai/web-dossier.git`

## Filter

- **Domain key:** `filter`
- **Navigation:** Library Home -> open a Dossier/Report -> Filter Panel (sidebar or top bar)
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

### 5.2 Example `filter.md`

```markdown
# Site Knowledge: Filter Domain

## Overview

- **Domain key:** `filter`
- **Components covered:** CalendarFilter, CheckboxFilter, DynamicFilter, FilterSummaryBar, SearchBoxFilter, ...
- **Spec files scanned:** 23
- **POM files scanned:** 16

## Components

### CalendarFilter
- **CSS root:** `.mstrd-CalendarWidget`
- **User-visible elements:**
  - Date range input (`.mstrd-DateRange-input`)
  - Apply button (`.mstrd-Apply-btn`)
  - Clear button (`.mstrd-Clear-btn`)
- **Related components:** CalendarHeader, CalendarWidget

### CheckboxFilter
- **CSS root:** `.mstrd-CheckboxFilter`
- **User-visible elements:**
  - Search box (`.mstrd-FilterSearch`)
  - Select all checkbox (`.mstrd-SelectAll`)

## Common Workflows (from spec.ts)

1. Apply attribute filter and validate grid refresh (used in 11 specs)
2. Clear all filters and verify default state (used in 7 specs)
3. Date range selection and apply (used in 6 specs)

## Common Elements (from POM + spec.ts)

1. Filter Panel toggle button — frequency: 18
2. Apply button — frequency: 15
3. Date range input — frequency: 12
4. Filter capsule in summary bar — frequency: 10

## Source Coverage

- `pageObjects/filter/*.js`
- `pageObjects/common/FilterPanel.js`
- `specs/regression/filter/**/*.spec.ts`
- `specs/e2e/filter/**/*.ts`
```

---

## 6. Design Fixes for Previous Findings

### 6.1 Fix: E2E Coverage Must Validate Both Layers

Updated E2E contract:

1. Compare generated `SITEMAP.md` to golden file.
2. Compare generated `<domain>.md` (at least `filter.md`) to golden file.
3. Normalize only timestamp line in `SITEMAP.md`; all other lines must match exactly.

### 6.2 Fix: Remove Regex Parsing from Rendered Markdown

`renderDomainSummaryBlock` must consume structured `DomainKnowledgeModel` fields.
It must not parse `sheet.content` to recover component names.

### 6.3 Fix: Deterministic Ordering Is Explicit

Ordering is mandated in section 2.2 and is part of contract tests.
No implicit array ordering is allowed.

### 6.4 Fix: CSS Root Extraction Rule Is Explicit

`CSS root` strategy for each component (deterministic fallback chain):

1. Prefer explicit root locator if parser identifies a root getter (`getRoot`, `root`, `container`).
2. Else use configured root override from optional `domains.json` component-level override (future-safe).
3. Else use first locator sorted by semantic priority (`container` > `panel` > `widget` > others).
4. Else `_unknown_`.

### 6.5 Fix: Canonical Formatting Locked

Formatting constraints in section 4.3 remove ambiguity for:

1. header style,
2. generated/source lines,
3. section naming,
4. allowed optional content.

### 6.6 Fix: Contract-Sync Test Strengthened

`contract-sync.test.mjs` must validate:

1. Required headings exist in expected order.
2. Required blocks exist for alias samples (for example `AutoAnswers (AI Assistant)`).
3. Example snippets in `TESTER_AGENT_DESIGN_v2.md` and this design stay synchronized with golden fixtures.

---

## 7. Test Strategy (Minimum Mock, Strict Contract)

### 7.1 Required Tests

1. `buildCompactSitemap.golden.test.mjs`
2. `buildDomainSheet.golden.test.mjs`
3. `e2e.generate-sitemap.test.mjs`
4. `contract-sync.test.mjs`
5. `parseSpecFile.test.mjs`
6. `buildDomainKnowledge.test.mjs`

### 7.2 Mocking Policy

1. No mocks for pure renderers/helpers.
2. No mocks for local fs integration tests.
3. Mock only remote `gh api` boundary where network isolation is required.
4. Use clock injection for deterministic `Generated:` line.

### 7.3 Exit Criteria

All must pass:

1. Layer 1 golden match.
2. Layer 2 golden match.
3. E2E match for `SITEMAP.md` and `filter.md`.
4. Alias block exists and is correct (`AutoAnswers (AI Assistant)`).
5. At least one all-domain test (`--domains all`) confirms every `domains.json` key appears in `SITEMAP.md`.
6. Spec-derived sections are non-empty for domains with configured `specPaths`.

---

## 8. Implementation Phase Plan

### Phase A — Config and Contracts

1. Extend `domains.json` schema (`displayName`, `navigationHint`, `keyEntryPoints`, `specPaths`) for all configured domains.
2. Add schema validation rules for missing mandatory fields.
3. Commit/update golden files for canonical outputs.

### Phase B — Parsing and Domain Model

1. Add `resolveSpecFiles`.
2. Add `parseSpecFile`.
3. Add `buildDomainKnowledge` to fuse POM and spec summaries.

### Phase C — Renderer Refactor

1. Refactor `buildCompactSitemap` to index format from `DomainKnowledgeModel`.
2. Refactor `buildDomainSheet` to include workflows/elements/source coverage without an actions section.
3. Keep `saveKnowledgeToFile` unchanged.

### Phase D — Validation

1. Implement/upgrade the required tests in section 7.1.
2. Run all tests in local fixture mode.
3. Remove transition wording in parent design docs only after all tests are green.

---

## 9. Clarification on Earlier Review Question #2

Earlier question: whether `> Extends: <parentClass>` should remain in domain output.

Clarified decision in this v2 design:

1. `Extends` is **not a required canonical section**.
2. It may be included as optional metadata only if explicitly added to canonical output contract later.
3. Current canonical example in this design excludes it to reduce drift risk.

---

## 10. Command Source of Truth

README command contract for sitemap generation is canonical:

1. All execution commands in design docs must match [`tools/sitemap-generator/README.md`](../tools/sitemap-generator/README.md).
2. If command behavior changes, update README first, then update design docs and tests.
3. The following commands are required to remain valid:
   - `cd workspace-tester/tools/sitemap-generator && npm run generate:domains -- --repo-url git@github.com:mstr-kiai/web-dossier.git --output ./config/domains.json`
   - `cd workspace-tester/tools/sitemap-generator && npm run generate:sitemap -- --repo ../../projects/wdio --domains all --output-dir ../../memory/site-knowledge`
   - `cd workspace-tester/tools/sitemap-generator && node generate-sitemap.mjs --repo-url git@github.com:mstr-kiai/web-dossier.git --domains all --output-dir ../../memory/site-knowledge`

---

## 11. Definition of Done

- [ ] `domains.json` supports all areas with `displayName`/`specPaths` and required metadata fields
- [ ] `SITEMAP.md` remains compact index format with alias + counts + query hints
- [ ] Each `<domain>.md` includes Components + Common Workflows + Common Elements + Source Coverage (no Key Actions section)
- [ ] All deterministic ordering rules enforced
- [ ] Golden + E2E + contract-sync tests pass
- [ ] `--domains all` output covers every domain in config

---

## 12. References

- [SITE_KNOWLEDGE_OUTPUT_ALIGNMENT_FIX_PLAN.md](./SITE_KNOWLEDGE_OUTPUT_ALIGNMENT_FIX_PLAN.md)
- [SITE_KNOWLEDGE_OUTPUT_ALIGNMENT_PLAN2.md](./SITE_KNOWLEDGE_OUTPUT_ALIGNMENT_PLAN2.md)
- [SITE_KNOWLEDGE_SYSTEM_DESIGN.md](./SITE_KNOWLEDGE_SYSTEM_DESIGN.md)
- [TESTER_AGENT_DESIGN_v2.md](./TESTER_AGENT_DESIGN_v2.md)
- [SITE_KNOWLEDGE_SYSTEM_AGENT_DESIGN.md](./SITE_KNOWLEDGE_SYSTEM_AGENT_DESIGN.md)
