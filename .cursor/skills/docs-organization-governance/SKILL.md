---
name: docs-organization-governance
description: Organizes technical documentation into a canonical structure with clear ownership, consolidation rules, and archive lifecycle. Use when creating, moving, merging, or cleaning up docs, release notes, architecture docs, deployment guides, and testing docs.
---

# Documentation Organization Governance

## Purpose

Keep documentation discoverable, non-duplicative, and maintainable as the codebase evolves.

## When To Use

Use this skill when:
- Adding or renaming documentation files
- Merging overlapping documents
- Restructuring docs folders
- Creating release notes or changelog updates
- Cleaning legacy docs after refactors

## Core Principles

1. Maintain a small canonical doc set with explicit ownership.
2. Keep one source of truth per topic (architecture, deployment, testing, operations).
3. Archive outdated docs instead of deleting historical context.
4. Separate durable policy docs from time-bounded status updates.
5. Prefer concise docs with links to deeper references.

## Workflow

1. Identify the topic and target audience.
2. Check if a canonical doc already owns this topic.
3. If overlap exists, consolidate into the canonical doc.
4. Move superseded docs to an archive location with a brief reason.
5. Update index/navigation references (README, docs index, changelog links).
6. Verify no two active docs claim ownership of the same topic.

## Document Taxonomy (Generic)

- `README`: onboarding, quickstart, map of docs, user-facing, high-level of how to use and run test
- `CHANGELOG`: user-visible changes by version/date
- `ARCHITECTURE`: system design, boundaries, data flow
- `DEPLOYMENT`: runtime setup, operations, rollout/recovery
- `TESTING`: test strategy, local/CI execution, fixture policy
- `FAQ`: recurring operational/product questions
- `archive/`: historical or superseded docs

## Quality Gates

- [ ] Topic ownership is explicit and unique
- [ ] No duplicate active docs for same subject
- [ ] Historical content archived, not silently removed
- [ ] Cross-links updated after moves/renames
- [ ] Changelog captures user-visible behavior changes

## Anti-Patterns

- Multiple "final summary" docs left active
- Embedding transient task logs in canonical docs
- Copy-pasting the same instructions into many files
- Archive folders without rationale or dates

## Additional Resources

- Implementation details: [reference.md](reference.md)
- Concrete examples: [examples.md](examples.md)
