---
name: qa-plan-synthesize
description: Synthesizes domain sub test-case artifacts (atlassian, github, figma) into a single XMind-compatible test case draft. Use when the orchestrator has completed Phase 4 and needs to merge sub_test_cases_*.md (or _v2.md) into one unified draft. Always produces drafts/test_key_points_xmind_v<N+1>.md only — no QA plan narrative.
---

# QA Plan Synthesize (Phase 5 — XMind Only)

Consolidate domain sub test-case artifacts into **one output**: an XMind-compatible test-case draft with P1/P2/P3 priority assignment.

**Single responsibility**: `xmind_only`. No QA plan narrative generation.

## When to Use

- Orchestrator calls this skill in **Phase 5** after Phase 4 refactor completes
- User asks to "synthesize test cases" or "merge sub test cases into XMind"

## Prerequisites

The orchestrator MUST call `validate_context.sh` before invoking synthesis:

```bash
# Resolve latest per-domain file (v2 if present, else base)
validate_context.sh <feature-id> --resolve-sub-testcases atlassian github figma
validate_context.sh <feature-id> "qa_plan_github_traceability_<id>"
```

The synthesizer receives **resolved paths** from the orchestrator. It does NOT re-infer paths — it uses exactly the paths passed in.

## Input Parameters

```javascript
{
  feature_id: "BCIN-6709",
  sub_testcase_files: [                    // Resolved paths from orchestrator (v2 or base per domain)
    "context/sub_test_cases_atlassian_BCIN-6709_v2.md",   // or base if Phase 4 was no-op
    "context/sub_test_cases_github_BCIN-6709.md",
    "context/sub_test_cases_figma_BCIN-6709.md"          // if Figma present
  ],
  context_files: [                          // Secondary — used for research step only
    "context/qa_plan_github_traceability_BCIN-6709.md",   // Required for P1 assignment
    "context/qa_plan_atlassian_BCIN-6709.md",
    "context/jira_issue_BCIN-6709.md",
    "context/jira_related_issues_BCIN-6709.md"
  ],
  output: "drafts/test_key_points_xmind_v<N+1>.md",
  priority_rules: "docs/priority-assignment-rules.md"
}
```

**v2-vs-base rule**: For each domain, use exactly the path provided. Never mix `_v2.md` for one domain and base for the same domain in the same run. The orchestrator has already resolved this via `--resolve-sub-testcases`.

## Core Synthesis Protocol (Mandatory — 3-Step)

### Synthesis Step A: Collect Everything (Merge First)

1. Read every `sub_testcase_files` input in the order provided (atlassian → github → figma).
2. Copy ALL items from ALL files into one combined raw list. Do NOT filter, skip, or evaluate any item at this stage.
3. Annotate each item with its source file (e.g. `[src: atlassian]`, `[src: github]`) so Step C can track origin.
4. Retain duplicates — they will be merged in Step C only after Step B resolves actionability.

### Synthesis Step B: Research Non-Actionable Items

An item is **non-actionable** if it contains:
- Abstract category descriptions without concrete user steps
- Code-internal terminology that cannot be directly observed in the UI
- Vague conditionals ("when an error occurs", "after recovery") with no specified trigger action

**Full resolution chain** (apply in order):

1. **Search context files first**: `context/qa_plan_atlassian_*.md`, `context/qa_plan_github_*.md`, `context/qa_plan_github_traceability_*.md`, `context/jira_issue_*.md`, `context/research_*.md`
2. **If unresolved**: Confluence search via `confluence` skill → save result via `save_context.sh` before use
3. **If still unresolved**: Tavily search via `tavily-search` skill → save result via `save_context.sh` before use
4. **If all fail**: Keep the item with `<!-- TODO: Cannot determine concrete user action — found in [source] -->` — **NEVER remove**

For each Confluence or Tavily search: call `projects/feature-plan/scripts/save_context.sh <feature-id> "research_bg_<domain>_<slug>_<id>" "$SEARCH_RESULT"` immediately after fetching. List any `research_bg_*.md` in `## 📎 Artifacts Used`.

For each resolved item: rewrite as concrete user action + observable result.

### Synthesis Step C: Deduplicate

- After all items are collected and researched, identify semantic duplicates.
- **Surface Deduplication Rule**: Items from different surfaces (e.g., Workstation vs Library Web) are NEVER semantic duplicates even if the test action looks identical.
  - Only merge items if they share BOTH the same action AND the same surface.
  - When two surface-specific items have identical actions but different surfaces, keep both under a parent node with surface-labeled sub-items:
    - Workstation: `<action> → <result>`
    - Library Web: `<action> → <result>`
- Merge true duplicates into the most specific/concrete version.
- Keep source attribution (which domain each item came from).

---

## Workflow

### Step 1: Read Resolved Sub Test Case Files

Read each file in `sub_testcase_files` exactly as provided. Do NOT scan the context directory or infer paths. The orchestrator has already resolved v2 vs base per domain.

### Step 2: Apply Synthesis Protocol (A → B → C)

Execute the 3-step protocol above. For Step B, use the full resolution chain (context → Confluence → Tavily → TODO).

### Step 3: Assign Priorities

**Priority Assignment Algorithm** (load `docs/priority-assignment-rules.md`):

- **P1** = direct relationship to changed code (GitHub traceability)
- **P2** = affected area, cross-functional, Jira AC, compatibility
- **P3** = edge case, template-retained, nice to have

Load `context/qa_plan_github_traceability_<feature-id>.md` for P1 mapping. Organize by user-facing behavior, not by repo or source.

### Step 4: Translation + Actionability Pass

Translate code vocabulary to user-observable language:

| Code Pattern | User-Facing Translation |
|--------------|-------------------------|
| `cmdMgr.reset()` called | Undo button is disabled |
| `isReCreateReportInstance = true` | Recovery completes without stuck state |
| `mstrApp.appState = DEFAULT` | Grid shows pause-mode layout |

For any vague or technical item: "What exact user action triggers this, and what visible result should QA verify?"

### Step 5: Final Checklist Before Save

- [ ] Every required template category is present
- [ ] Non-applicable categories remain with a one-sentence explanation leaf
- [ ] No internal code vocabulary in headings, steps, or expected results
- [ ] P1/P2/P3 markers at category, sub-category, or step level
- [ ] `## AUTO: Automation-Only Tests` present for code-internal tests
- [ ] **`## 📎 Artifacts Used`** section present (see below)

### Step 6: Write Output

**Output**: `drafts/test_key_points_xmind_v<N+1>.md` only.

**Mandatory `## 📎 Artifacts Used` header** — include at the end of every output:

```markdown
## 📎 Artifacts Used
- context/sub_test_cases_atlassian_<id>_v2.md   ← or base if no v2
- context/sub_test_cases_github_<id>.md
- context/sub_test_cases_figma_<id>_v2.md       ← if Figma present
- context/qa_plan_github_traceability_<id>.md
- context/jira_issue_<key>.md
- context/jira_related_issues_<id>.md
- (any other context/*.md files used)
```

List the **exact resolved filenames** passed in — do not invent paths.

**XMind format**: Use `workspace-planner/skills/feature-qa-planning-orchestrator/templates/test-case-template.md` as scaffold. Strip instructional annotations from final output.

---

## Output File Handling

**Location**: `projects/feature-plan/<feature_id>/drafts/test_key_points_xmind_v<N+1>.md`

**Versioning**:
- Determine N from `task.json.latest_xmind_version` or scan `drafts/test_key_points_xmind_v*.md`
- Write to `test_key_points_xmind_v<N+1>.md`
- Update `task.json.latest_xmind_version = N+1`

---

## Error Handling

**If resolved paths are missing or invalid**:
- Cannot synthesize — return error: "Missing resolved sub_testcase_files from orchestrator. Run validate_context.sh --resolve-sub-testcases first."

**If GitHub traceability file missing**:
- P1 assignment falls back to conservative P2
- Emit warning: "P1 assignment degraded — no traceability file"

**If no sub test case files provided**:
- Cannot synthesize — return error

---

## Integration

**Input from**: `qa-plan-write` (Phase 2 sub test cases) + `qa-plan-review` (Phase 4 refactored _v2 when applicable)

**Output consumed by**: `qa-plan-review` (Phase 6), `qa-plan-refactor` (Phase 7)

---

**Last Updated**: 2026-03-08
**Status**: XMind-only (Phase 5); output_mode removed; Artifacts Used header mandatory; resolved paths from orchestrator
