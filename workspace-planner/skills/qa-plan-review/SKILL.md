---
name: qa-plan-review
description: Domain-scoped review and refactor for QA sub test cases. Phase 3: four handlers (jira, confluence, github, figma) review sub_test_cases_* against domain source. Phase 4: three handlers (atlassian, github, figma) apply review findings. Phase 6: consolidated XMind review — single agent reviews synthesized XMind draft with X1–X5 checks. Invoked by feature-qa-planning-orchestrator via sessions_spawn() with domain, mode, and feature_id in attachment.
---

# QA Plan Review — Domain Review, Refactor & Consolidated XMind Review

Single skill with **domain handlers** for Phase 3 (review), Phase 4 (refactor), and **Phase 6 (consolidated XMind review)**. Orchestrator invokes via `sessions_spawn()` with `context.json` attachment.

## Invocation Contract

**Input** (from orchestrator via attachment `context.json`):
```json
{
  "domain": "jira",
  "feature_id": "BCIN-6709"
}
```
For refactor mode:
```json
{
  "domain": "atlassian",
  "mode": "refactor",
  "feature_id": "BCIN-6709"
}
```
For Phase 6 consolidated XMind review:
```json
{
  "mode": "consolidated",
  "feature_id": "BCIN-6709"
}
```

| `mode` | Phase | Domains | Behavior |
|--------|-------|---------|----------|
| `review` (default) | 3 | jira, confluence, github, figma | Review sub test cases against domain source → `review_<domain>_<id>.md` |
| `refactor` | 4 | atlassian, github, figma | Apply review findings to sub test cases → `sub_test_cases_<domain>_<id>_v2.md` (only if changes) |
| `parity` | 2.5 | parity | Cross-cut sub test cases to enforce surface completeness → `review_parity_<id>.md` |
| `consolidated` | 6 | — (single agent) | Review synthesized XMind draft → `review_consolidated_<id>.md` |

**Script path**: `projects/feature-plan/scripts/` (relative to workspace root). Use `save_context.sh` and `validate_context.sh`.

---

## Common Rules (All Handlers)

- **Gate**: Call `validate_context.sh` before starting. If required context missing, re-fetch and save via `save_context.sh`.
- **Domain isolation**: Read ONLY your domain's files. Never cross-read (jira never reads GitHub; github never reads Jira).
- **Background search**: Allowed → save each result via `save_context.sh` before use.
- **Output**: Save via `save_context.sh`.

---

## Handler: jira (mode=review)

**Focus**: Do `sub_test_cases_atlassian` entries accurately reflect Jira ACs and issue requirements? User-observable and traceable?

**Reads**:
- `context/sub_test_cases_atlassian_<id>.md`
- `context/jira_issue_<main-key>.md`
- `context/jira_issue_<related-key>.md` (each related)
- `context/jira_related_issues_<id>.md`

**Checklist**:
- Every AC from Jira has at least one test case
- No verbatim AC copy — each rephrased as user action + observable result
- No scope creep (GitHub/UI-only items in Jira test cases)
- Flag missing ACs

**Output**: `context/review_jira_<id>.md` via `save_context.sh`

---

## Handler: confluence (mode=review)

**Focus**: Do `sub_test_cases_atlassian` cover Confluence design doc requirements? Business rules and NFRs represented?

**Reads**:
- `context/sub_test_cases_atlassian_<id>.md`
- `context/qa_plan_atlassian_<id>.md`

**Checklist**:
- Business rules from design doc have test coverage
- NFRs (performance, security, accessibility) flagged if untested
- Ambiguous design → `<!-- TODO: design doc unclear — [page/section] -->`
- No Jira-AC-only content mis-attributed as Confluence requirement

**Output**: `context/review_confluence_<id>.md` via `save_context.sh`

---

## Handler: github (mode=review)

**Focus**: Do `sub_test_cases_github` cover PR diffs? Traceability accurate? P1 only for diffed code?

**Reads**:
- `context/sub_test_cases_github_<id>.md`
- `context/qa_plan_github_traceability_<id>.md`
- `context/github_diff_<repo>.md` (for spot-check)

**Checklist**:
- Every diffed file/function in traceability has a test case
- P1 markers only for items tracing to code diff
- Code-internal, non-user-observable → `## AUTO: Automation-Only Tests`
- No Jira AC or Confluence items in github test cases
- Non-actionable code refs → resolution chain → `save_context.sh`

**Output**: `context/review_github_<id>.md` via `save_context.sh`

---

## Handler: figma (mode=review)

**Focus**: Do `sub_test_cases_figma` reflect Figma UI/UX intent? Component names, states, layout testable?

**Reads**:
- `context/sub_test_cases_figma_<id>.md`
- `context/qa_plan_figma_<id>.md`
- `context/figma/figma_metadata_<id>_<date>.md`

**Skipped** if no Figma context (orchestrator does not spawn).

**Checklist**:
- Every annotated Figma component has a review-point
- Component names match Figma layer names
- Interaction states (hover, loading, error, empty) covered
- Non-actionable annotations → resolution chain → `save_context.sh`
- No Jira AC or GitHub content in Figma test cases

**Output**: `context/review_figma_<id>.md` via `save_context.sh`

---

## Handler: atlassian (mode=refactor)

**Focus**: Apply `review_jira` + `review_confluence` findings to `sub_test_cases_atlassian`.

**Reads**:
- `context/sub_test_cases_atlassian_<id>.md`
- `context/review_jira_<id>.md`
- `context/review_confluence_<id>.md`

**Checklist**:
- Add missing ACs from `review_jira`
- Rephrase verbatim AC copies as user action + observable result
- Add coverage for "Business rule untested" from `review_confluence`
- Apply "Ambiguous design" TODOs from `review_confluence`
- Remove scope-creep items flagged by jira review
- If fix needs clarification → background search → `save_context.sh` → keep `<!-- TODO -->` if unresolved

**Output**: `context/sub_test_cases_atlassian_<id>_v2.md` via `save_context.sh` (only if changes made). No-op → exit without writing.

---

## Handler: github (mode=refactor)

**Focus**: Apply `review_github` findings to `sub_test_cases_github`.

**Reads**:
- `context/sub_test_cases_github_<id>.md`
- `context/review_github_<id>.md`
- `context/qa_plan_github_traceability_<id>.md`

**Checklist**:
- Add missing test cases for diffed files/functions flagged by review
- Fix misapplied P1 markers (must trace to code diff)
- Move code-internal items to `## AUTO: Automation-Only Tests`
- Remove Jira/Confluence items mixed in
- Resolve non-actionable refs via resolution chain → `save_context.sh`

**Output**: `context/sub_test_cases_github_<id>_v2.md` via `save_context.sh` (only if changes made)

---

## Handler: figma (mode=refactor)

**Focus**: Apply `review_figma` findings to `sub_test_cases_figma`.

**Reads**:
- `context/sub_test_cases_figma_<id>.md`
- `context/review_figma_<id>.md`
- `context/figma/figma_metadata_<id>_<date>.md`

**Skipped** if no Figma context.

**Checklist**:
- Add test cases for components flagged missing
- Fix component names to match Figma layer names
- Add missing interaction state coverage
- Resolve non-actionable annotations → resolution chain → `save_context.sh`
- Remove Jira/GitHub content mixed in

**Output**: `context/sub_test_cases_figma_<id>_v2.md` via `save_context.sh` (only if changes made)

---

## Handler: parity (mode=parity)

**Focus**: Cross-cut all sub test cases to enforce surface/parity rules that no domain handler can catch in isolation (Phase 2.5 pre-flight).

**Reads**:
- `context/sub_test_cases_atlassian_<id>.md`
- `context/sub_test_cases_github_<id>.md`
- `context/sub_test_cases_figma_<id>.md` (if available)
- `context/jira_issue_<key>.md` → to determine feature scope (which surfaces apply)

**Parity Checks**:
- `PC-1`: For each non-embedding scenario, Workstation path present or noted N/A
- `PC-2`: For each non-embedding scenario, Library Web path present or noted N/A
- `PC-3`: If "mobile" in ACs/design → Library Mobile mentioned
- `PC-4`: Embedding section populated if feature touches embedding code
- `PC-5`: Performance section has ≥2 sub-cases

**Output**: `context/review_parity_<id>.md` via `save_context.sh`

---

## Non-Actionable Resolution Chain (All Handlers)

1. Search `context/` files first
2. Confluence search via `confluence` skill → `save_context.sh` before use
3. `tavily-search` skill → `save_context.sh`
4. If all fail: keep `<!-- TODO: Cannot determine concrete user action — found in [source] -->` — **NEVER remove**

**Naming**: `research_review_bg_<domain>_<slug>_<id>.md` or `research_bg_refactor_<slug>_<id>.md`

---

## User Executability (UE) Checks (Review Mode)

When reviewing test cases, enforce:

| Check | Rule |
|-------|------|
| UE-1 | No internal code vocabulary in Test Key Points or Expected Results |
| UE-2 | Expected Results are browser-observable |
| UE-3 | P0/P1 rows include user action sequence |
| UE-4 | Multi-path scenarios split (not collapsed) |
| UE-5 | P0/P1 rows include `FAILS if:` |
| UE-6 | Unit/API-only in `## AUTO` section |
| UE-7 | Surface coverage — multi-surface features must have explicit WS/Lib/BI sub-cases or justified N/A |
| UE-8 | Embedding completeness — iFrame cross-origin + auth; Native SDK contract + teardown |
| UE-9 | Performance floor — at least "Baseline Load" and "Large Data" sub-cases present unless UI-only PR |
| UE-10 | Upgrade/compatibility — if feature has backend version dependency, there must be a rollback/downgrade test case |

If any UE fails, flag in review output. Status: `Requires Updates`.

---

## Review Output Format (mode=review)

```markdown
# Review: [domain] — [Feature ID]

## Status
Approved | Requires Updates | Rejected

## Findings
- [Finding 1 with location and recommendation]
- [Finding 2...]

## Missing Coverage
- [AC or requirement without test case]

## Action Items
- [ ] [Action 1]
- [ ] [Action 2]
```

---

---

## Handler: consolidated (mode=consolidated) — Phase 6 XMind Review

**Focus**: Review the **synthesized XMind draft** (from Phase 5) using cached context artifacts. Apply X1–X5 checks. No live re-fetch by default.

**Gate**: Call `validate_context.sh` before starting to confirm Phase 3 review artifacts exist:
```bash
validate_context.sh <feature-id> "review_jira_<id>" "review_confluence_<id>" "review_github_<id>"
# Add "review_figma_<id>" if Figma was in Phase 3
validate_context.sh <feature-id> "qa_plan_github_traceability_<id>"
```

**Reads** (cached artifacts only — no live re-fetch unless artifact missing AND user permits):
- `drafts/test_key_points_xmind_v<N>.md` — the synthesized XMind draft to review
- `context/review_jira_<id>.md`, `context/review_confluence_<id>.md`, `context/review_github_<id>.md`, `context/review_figma_<id>.md` (if Figma)
- `context/qa_plan_github_traceability_<id>.md`
- `workspace-planner/skills/feature-qa-planning-orchestrator/docs/priority-assignment-rules.md` — **MUST load** and apply to every category and scenario

**XMind Checks (X1–X5)** — apply to the synthesized draft:

| Check | Rule |
|-------|------|
| **X1** | Every `##` category has a P1/P2/P3 marker |
| **X2** | Every `###` sub-category either has a priority marker or inherits from parent |
| **X3** | Leaf nodes contain expected results (observable, no code vocabulary) |
| **X4** | `## AUTO: Automation-Only Tests` section present for code-internal tests |
| **X5** | `## 📎 Artifacts Used` section present with links to all context files |

**Review checklist**:
- Apply priority-assignment-rules.md to every top-level category and scenario
- Flag any X1–X5 violation with location and recommendation
- No dual-review (QA plan vs XMind) — XMind draft only
- If artifact missing: only do live re-fetch if user explicitly permits

**Output**: `context/review_consolidated_<id>.md` via `save_context.sh`

**Output format**:
```markdown
# Review: Consolidated XMind — [Feature ID]

## Status
Approved | Requires Updates | Rejected

## X1–X5 Findings
- [X1] Category X missing P1/P2/P3 marker
- [X2] Sub-category Y missing priority
- [X3] Leaf node at Z has code vocabulary
- [X4] AUTO section missing
- [X5] Artifacts Used section missing

## Action Items
- [ ] [Action 1]
- [ ] [Action 2]
```

---

## Prerequisites

- `jira-cli`, `confluence`, `github` skills (for re-fetch if context missing)
- `save_context.sh`, `validate_context.sh` in `projects/feature-plan/scripts/`
