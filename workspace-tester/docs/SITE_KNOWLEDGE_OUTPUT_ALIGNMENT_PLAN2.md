# Site Knowledge Output Alignment Plan 2

> **Plan ID:** `site-knowledge-output-alignment-plan2`
> **Date:** 2026-03-04
> **Status:** Proposed
> **Input Context:** [SITE_KNOWLEDGE_OUTPUT_ALIGNMENT_DESIGN.md](./SITE_KNOWLEDGE_OUTPUT_ALIGNMENT_DESIGN.md), [README.md](../tools/sitemap-generator/README.md)

---

## 1. Objective

Plan 2 addresses two concrete gaps:

1. Output is too verbose: remove component action output from domain markdown.
2. Command contract drift: make `workspace-tester/tools/sitemap-generator/README.md` the single source of truth and ensure documented commands work reliably.

---

## 2. Scope

### In Scope

1. Update output contract so domain knowledge focuses on components, workflows, and common elements.
2. Remove `Key Actions` / action-signature style output from generated markdown artifacts.
3. Normalize command documentation so README commands are canonical and executable.
4. Add verification coverage that protects command behavior and output shape.

### Out of Scope

1. Adding new semantic sections unrelated to verbosity reduction.
2. Reworking parser internals beyond what is needed to stop action output.
3. Changing business meaning of domain detection logic.

---

## 3. Change Set A: Remove Component Action Verbosity

### 3.1 Contract Changes

1. `SITEMAP.md` remains compact index only.
2. `<domain>.md` required sections become:
   - `## Overview`
   - `## Components`
   - `## Common Workflows (from spec.ts)`
   - `## Common Elements (from POM + spec.ts)`
3. `## Key Actions` is removed from canonical contract.
4. `DomainKnowledgeModel.actions` becomes non-contractual (internal-only) or is removed entirely if no longer needed.

### 3.2 Implementation Tasks

1. Update design docs to remove action output requirements and examples.
2. Update renderer (`buildDomainSheet`) to omit action blocks.
3. Remove/adjust any action formatting helpers no longer used.
4. Ensure generated `metadata.json` does not depend on action count fields.

### 3.3 Validation

1. Golden tests must fail if `## Key Actions` appears in domain files.
2. E2E generation test must confirm no action signatures (for example `applyFilter()`) are emitted in markdown.
3. Contract-sync test must assert section order without action section.

---

## 4. Change Set B: README as Single Source of Truth for Commands

### 4.1 Canonical Command Contract

README must define and own these supported command paths.

1. One-shot sitemap generation from GitHub source:

```bash
cd workspace-tester/tools/sitemap-generator
node generate-sitemap.mjs --repo-url git@github.com:mstr-kiai/web-dossier.git --domains all --output-dir ../../memory/site-knowledge
```

2. Domain config refresh from GitHub source:

```bash
cd workspace-tester/tools/sitemap-generator && npm run generate:domains -- --repo-url git@github.com:mstr-kiai/web-dossier.git --output ./config/domains.json
```

3. Sitemap generation from local repo using npm shortcut:

```bash
cd workspace-tester/tools/sitemap-generator && npm run generate:sitemap -- --repo ../../projects/wdio --domains all --output-dir ../../memory/site-knowledge
```

These three commands must remain valid after Plan 2 implementation.

### 4.2 Documentation Rules

1. Any command examples in design docs must reference README command block, not redefine divergent variants.
2. If command behavior changes, update README first, then update tests.
3. README must include prerequisites for `--repo-url` flows (`gh` installed + authenticated).

### 4.3 Implementation Tasks

1. Reconcile CLI flags and docs so README examples exactly match parser behavior.
2. Ensure `npm run generate:domains -- --repo-url ...` writes `./config/domains.json` consistently.
3. Ensure `npm run generate:sitemap -- --repo ... --domains all --output-dir ...` works with regenerated config.
4. Ensure direct `node generate-sitemap.mjs --repo-url ...` path remains supported.

### 4.4 Validation

1. Add command-contract test coverage for npm scripts and flag passthrough.
2. Add integration/smoke verification script for local path flow.
3. Add manual verification checklist for GitHub-source flow where network/auth is required.

---

## 5. Execution Plan

### Phase 1: Contract Trim

1. Update output-alignment design docs to remove action section from canonical examples.
2. Update expected fixtures/golden files accordingly.

### Phase 2: Generator Alignment

1. Refactor markdown render pipeline to stop emitting action blocks.
2. Remove stale references to action section labels.

### Phase 3: Command Reliability Alignment

1. Update README command sections and references.
2. Align tests and helper scripts with README command contract.
3. Verify all three canonical commands against expected behavior.

### Phase 4: Gate

1. Run generator tests.
2. Run output contract tests.
3. Complete command verification matrix and record results.

---

## 6. Acceptance Criteria

All criteria are required:

1. Generated `<domain>.md` files do not contain `## Key Actions`.
2. Generated `<domain>.md` files do not list action-signature bullets like `methodName()` as a dedicated section.
3. README includes one canonical command block containing exactly the three supported invocation paths above.
4. `npm run generate:domains -- --repo-url ... --output ./config/domains.json` works.
5. `npm run generate:sitemap -- --repo ../../projects/wdio --domains all --output-dir ../../memory/site-knowledge` works.
6. `node generate-sitemap.mjs --repo-url ... --domains all --output-dir ../../memory/site-knowledge` works.
7. Tests protect both output-shape and command-contract behavior from regression.

---

## 7. Risks and Controls

| Risk | Impact | Control |
|------|--------|---------|
| Action output removal breaks downstream assumptions | Medium | Add explicit contract tests and update dependent docs in same change set |
| README and implementation drift again | High | Add command-contract test and require README-first update rule |
| GitHub auth/network makes CI flaky for `--repo-url` | Medium | Keep deterministic local tests; use manual/guarded integration checks for remote path |

---

## 8. Deliverables

1. Updated alignment design document(s) reflecting reduced output verbosity.
2. Updated sitemap generator README with canonical commands.
3. Updated golden fixtures and tests.
4. Verification notes confirming the three command paths and no-action output contract.
