# QA-Plan Orchestrator Subagent Quick Checklist

Use this checklist before returning any phase artifact.

This is intentionally short and operational. For detailed reasoning, read:
- `docs/VALIDATOR_SAFE_AUTHORING_AND_DEDUP_GUIDE.md`
- relevant phase contract / rubric in `references/`

---

## Universal checks

- Did I follow the exact required section names for this artifact?
- Did I use the expected row format instead of prose where the validator expects rows?
- Did I preserve evidence-backed coverage rather than shrink it?
- Did I avoid implementation-heavy wording when user-observable wording is possible?
- Did I avoid compressed arrow wording like `A -> B -> C`?
- Did I keep freeform commentary outside validator-critical rows?

---

## Draft structure checks

### For all plan drafts
- Are canonical top layers real top-level bullets, not just markdown headings?
- Does each used top layer have:
  - a subcategory layer
  - a scenario layer
- Do only executable scenario bullets carry `<P1>/<P2>` tags?
- Do grouping/subcategory bullets avoid priority tags?
- Are action steps atomic and nested?
- Are outcomes observable and user-visible?

### For Phase 4a specifically
- Did I avoid canonical top-layer grouping?
- Did I stay at subcategory → scenario → atomic steps only?

### For Phase 4b and later
- Did I use only canonical top-layer labels?
- Did I avoid duplicating the same label as both a grouping node and a scenario node unless truly required?

---

## Deduplication checks

Before keeping two similar scenarios, ask:
- Do they have different triggers?
- Do they have different risks?
- Do they have different visible outcomes?

### If NO to all three
They are probably duplicates and should be merged.

### If YES to any of the three
Keep them separate.

### Additional dedup rules
- Do not keep both a stub and the richer executable replacement as active content.
- Do not keep a summary scenario that merely repeats a subcategory title unless preservation logic truly requires it.
- If preserving an older reviewed title causes duplication, prefer renaming the grouping layer instead.

---

## Review-notes checks (Phase 5a)

- Does `## Context Artifact Coverage Audit` enumerate exact artifact headings instead of `all sections`?
- Does `## Coverage Preservation Audit` include rows for:
  - preserved scenarios
  - clarified scenarios
  - replaced stubs
  - richer executable replacements
- If a concern was fixed in the new draft, did I change its audit disposition to `pass`?
- Does each blocking finding have a rewrite request with closely matching action text?
- If verdict is `accept`, are there zero unresolved `rewrite_required` rows?

---

## Checkpoint checks (Phase 5b)

### Checkpoint audit
- Does `## Checkpoint Summary` use exact labels:
  - `Checkpoint 1`
  - ...
  - `Checkpoint 15`
- Does every checkpoint row include evidence and required action or `none`?

### Checkpoint delta
- Are resolution sections written as row-like bullets, not prose-only paragraphs?
- Does `## Final Disposition` end with exactly one bullet:
  - `accept`
  - `return phase5a`
  - `return phase5b`

---

## User-prompted coverage promotion check

If the user explicitly asked to promote a coverage area such as:
- Security
- Performance / Resilience
- i18n

then confirm:
- it is not left as a deferred-only stub
- it has executable scenarios or an explicitly user-approved reason not to

---

## Final self-check before return

Ask yourself:
- If I hand this file to the validator, will it fail on shape?
- If I hand this file to a QA tester, will they know exactly what to do?
- If I hand this file to a reviewer, will they see preserved coverage without obvious duplication?

If any answer is no, fix it before returning.
