# Feature QA Planning Orchestrator Evolution Plan

**Date**: 2026-03-07  
**Owner**: Aegis (OpenClaw Config Agent)  
**Test Case**: BCIN-6709 — Improve Report Error Handling

---

## Executive Summary

Evolve the `feature-qa-planning-orchestrator` skill to:
1. **Orchestrate sub-agents** for parallel context gathering using `spawn-agent-session`
2. **Generate dual outputs**: Main QA plan + XMind-compatible test key points
3. **Implement conditional search logic** based on Jira linked/child issues
4. **Full end-to-end testing** with BCIN-6709 to validate and iterate

---

## Answers to Pre-Implementation Questions

| # | Question | Answer |
|---|----------|--------|
| Q1 | Spawning Strategy | One sub-agent per **functional area** (not per data source) |
| Q2 | XMind Format | Follow `test-case-template.md` exactly — importable to XMind |
| Q3 | Skill Location | Keep in `workspace-planner/skills/` (workspace-local). Sync shared skills from `~/.openclaw/skills` to `.agents/skills` |
| Q4 | Search Criteria | Search only if Jira feature has **linked/child issues**; otherwise skip |
| Q5 | Idempotency | Main orchestrator handles all idempotency **before spawning** |
| Q6 | Test Scope | **Full end-to-end** — iterate and enhance during testing |

---

## Implementation Phases

### Phase 0: Planning & Setup ✅
- [x] Read current skill implementation
- [x] Clarify requirements with Snow
- [x] Create implementation plan document
- [x] Document priority assignment rules (P1/P2/P3)
- [x] Sync shared skills to `.agents/skills/`
- [x] Review test-case-template.md for XMind format

### Phase 1: Skill Architecture Updates
- [x] 1.1: Update `feature-qa-planning-orchestrator/SKILL.md`
  - [x] Add sub-agent spawning workflow
  - [x] Add dual-output generation spec
  - [x] Add conditional search logic
- [x] 1.2: Update `qa-plan-atlassian/SKILL.md`
  - [x] Make sub-agent compatible
  - [x] Add linked/child issue detection
  - [x] Add conditional Confluence search trigger
- [x] 1.3: Update `qa-plan-github/SKILL.md`
  - [x] Make sub-agent compatible
  - [x] Ensure traceability output
- [x] 1.4: Update `qa-plan-synthesize/SKILL.md`
  - [x] Add dual-output generation (main + xmind)
  - [x] Add XMind format transformation logic
  - [x] Embed priority assignment rules
- [ ] 1.5: Review/update `spawn-agent-session` (if needed)

### Phase 2: Core Orchestrator Implementation
- [ ] 2.1: Implement Phase 1 — Sub-Agent Spawning
  - [ ] Detect required functional areas (Jira, GitHub, Figma)
  - [ ] Use `spawn-agent-session` to create spawn payloads
  - [ ] Spawn sub-agents in parallel via `sessions_spawn`
  - [ ] Wait for completion and validate outputs
- [ ] 2.2: Implement Conditional Search Logic
  - [ ] Read Jira issue via `jira-cli`
  - [ ] Check for `issuelinks` or `subtasks` fields
  - [ ] Trigger Confluence search only if linked/child issues exist
- [ ] 2.3: Update Phase 3 — Synthesis
  - [ ] Call `qa-plan-synthesize` with dual-output flag
  - [ ] Generate `qa_plan_final.md` (without test key points)
  - [ ] Generate `test_key_points_xmind.md` (XMind format)
- [ ] 2.4: Update task.json tracking
  - [ ] Add sub-agent spawn tracking
  - [ ] Add dual-output paths

### Phase 3: XMind Format Implementation
- [ ] 3.1: Analyze test-case-template.md structure
- [ ] 3.2: Implement XMind markdown generator
  - [ ] Convert Test Key Points table to hierarchical bullets
  - [ ] Preserve: Priority, Test Scope, Steps, Expected Results
  - [ ] Match indentation/formatting from template
  - [ ] **Implement priority assignment algorithm (P1/P2/P3)**
  - [ ] **Map scenarios to GitHub traceability for P1 detection**
  - [ ] **Place priority at category/sub-category/step level**
- [ ] 3.3: Add XMind import validation notes

### Phase 4: Sub-Agent Skills Enhancement
- [ ] 4.1: Update `qa-plan-atlassian`
  - [ ] Add task acceptance via spawn contract
  - [ ] Implement linked issue detection
  - [ ] Output to standard context path
- [ ] 4.2: Update `qa-plan-github`
  - [ ] Add task acceptance via spawn contract
  - [ ] Ensure traceability companion output
- [ ] 4.3: Test sub-agent spawn/completion locally

### Phase 5: Full End-to-End Test with BCIN-6709
- [x] 5.1: Setup test environment
  - [x] Create feature directory: `projects/feature-plan/BCIN-6709-test/`
  - [x] Prepare inputs (Jira key, design doc, PR URLs)
- [x] 5.2: Run Phase 0 — Idempotency Check
  - [x] Initialize task.json and run.json
- [x] 5.3: Run Phase 1 — Context Gathering
  - [x] Use existing context files from BCIN-6709
  - [x] Create GitHub traceability file
- [x] 5.4: Run Phase 2 — Synthesis
  - [x] Generate main QA plan (without test key points)
  - [x] Generate XMind file with priorities
  - [x] Validate XMind format matches template
- [x] 5.5: Validate Outputs
  - [x] Check dual outputs exist
  - [x] Verify priority distribution (P1: 36%, P2: 52%, P3: 12%)
  - [x] Confirm user-facing language only
  - [x] Validate XMind hierarchical format
- [x] 5.6: Document Results
  - [x] Create E2E_TEST_SUMMARY.md
  - [x] Update task.json with test results

### Phase 6: Recovery Plan for Test-Case Quality Gaps
- [ ] 6.1: Rebuild context acquisition quality gates
  - [ ] Require Jira issue content fetch success for the main feature and all related issues discovered via Jira skill query and comment references
  - [ ] Persist Jira issue content into standard context artifacts (not just summaries)
  - [ ] Extract Figma links from Jira/Confluence web links when present
  - [ ] Fail generation if required Jira content is missing
- [ ] 6.2: Rebuild GitHub acquisition quality gates
  - [ ] Require GitHub diff fetch success when PR URLs are provided or discovered from Jira/comments
  - [ ] Persist GitHub diff evidence and traceability artifacts into context/
  - [ ] Fail generation if required GitHub diff content is missing
- [ ] 6.3: Tighten test-case generation rules
  - [ ] Enforce strict category coverage from `templates/test-case-template.md`
  - [ ] Keep every template category even if not applicable
  - [ ] Add one-sentence explanation leaf for non-applicable categories
  - [ ] Rewrite vague or technical items into executable user actions with concrete triggers
  - [ ] Add explicit supported vs unsupported error boundaries when relevant
  - [ ] Add missing domains such as Workstation and i18n when required by feature context
- [ ] 6.4: Strengthen review/refactor quality gates
  - [ ] Reject outputs missing template categories
  - [ ] Reject outputs with vague trigger conditions
  - [ ] Reject outputs without sufficient Jira/Confluence/GitHub grounding
  - [ ] Reject outputs that are not executable by QA
- [ ] 6.5: Add automated coverage
  - [ ] Add unit tests for category completeness and annotation stripping rules
  - [ ] Add integration tests for context-fetch requirements and generation gates
  - [ ] Add regression fixtures for BCIN-6709-style scenarios
- [ ] 6.6: Re-run BCIN-6709 end-to-end after fixes
  - [ ] Re-fetch Jira/linked issues
  - [ ] Re-fetch GitHub diffs
  - [ ] Re-generate draft outputs
  - [ ] Run review/refactor again
  - [ ] Re-publish only with user approval

### Phase 7: Documentation & Examples
- [ ] 7.1: Add BCIN-6709 to examples/
- [ ] 7.2: Document XMind import process
- [ ] 7.3: Update skill README files
- [ ] 7.4: Document sub-agent spawn patterns

### Phase 8: Shared Skill Sync
- [ ] 8.1: Sync updated skills to `.agents/skills/`
  - [ ] `spawn-agent-session`
  - [ ] `jira-cli` (if updated)
  - [ ] `confluence` (if updated)
- [ ] 8.2: Verify sync with Snow's memory preference

---

## Detailed Workflow Design

### New Orchestrator Flow

```
┌─────────────────────────────────────────────────────────┐
│ Phase 0: Idempotency Check                              │
│ - check_resume.sh                                       │
│ - Handle FRESH/DRAFT_EXISTS/FINAL_EXISTS               │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ Phase 1: Conditional Search Decision                    │
│ - Read Jira issue (jira-cli)                           │
│ - Check for issuelinks / subtasks                      │
│ - Decision: search=true if linked issues exist         │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ Phase 2: Spawn Sub-Agents (Parallel)                    │
│                                                          │
│ ┌──────────────────┐  ┌──────────────────┐             │
│ │ Sub-Agent 1:     │  │ Sub-Agent 2:     │             │
│ │ Atlassian        │  │ GitHub           │             │
│ │ - Jira analysis  │  │ - PR analysis    │             │
│ │ - Confluence     │  │ - Code changes   │             │
│ │   (if search=true)│  │ - Traceability   │             │
│ └──────────────────┘  └──────────────────┘             │
│         ↓                      ↓                        │
│  context/qa_plan_    context/qa_plan_github_*.md       │
│  atlassian_*.md                                         │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ Phase 3: Synthesis (Main Agent)                         │
│ - qa-plan-synthesize                                    │
│ - Merge all context                                     │
│ - Generate TWO outputs:                                 │
│   1. qa_plan_final.md (all sections EXCEPT test points)│
│   2. test_key_points_xmind.md (XMind format)           │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ Phase 4: Review & Refactor                              │
│ - qa-plan-review                                        │
│ - qa-plan-refactor (if needed)                         │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ Phase 5: Publish & Notify                               │
│ - Publish to Confluence                                 │
│ - feishu-notify                                         │
└─────────────────────────────────────────────────────────┘
```

### Functional Areas for Sub-Agents

| Functional Area | Sub-Agent Task | Input | Output |
|-----------------|----------------|-------|--------|
| **Requirements & Design** | Analyze Jira + Confluence | Jira key, Design doc URL, search decision | `context/qa_plan_atlassian_<feature>.md` |
| **Code Changes** | Analyze GitHub PRs | PR URLs | `context/qa_plan_github_<feature>.md`, `context/qa_plan_github_traceability_<feature>.md` |
| **UI/UX** (Optional) | Analyze Figma | Figma URL | `context/qa_plan_figma_<feature>.md` |

---

## XMind Output Format Specification

Based on `test-case-template.md`, the XMind-compatible markdown must follow this structure:

```markdown
# BCIN-6709_Ability to create cube-based report in Library Web

## EndToEnd - P2 ([MAIN CATEGORY])

### Workstation & Library ([SUB CATEGORY])

- Open Report Creator [(STEPS])
  - Select Cube Tab
    - Browse Datasets
      - Select Cube
        - New Report
          - New report can be created successfully [(EXPECTED RESULT IN LEAF NODE)]

### Report Type

- OLAP cube
- MTDI cube

## Functional - P1

### Error Recovery Flow

- Trigger max rows error [(STEPS])
  - Click "OK" in error dialog
    - Dialog closes
      - Report returns to pause mode [(EXPECTED RESULT)]
      - Undo is disabled [(EXPECTED RESULT)]
      - User can continue editing [(EXPECTED RESULT)]
```

**Key Rules**:
- Top level: Main test category + Priority (e.g., `## EndToEnd - P2`)
- Second level: Sub-category or functional grouping (e.g., `### Workstation & Library`)
- Steps: Bullet hierarchy with increasing indentation
- Expected results: In **leaf nodes** with marker like `[(EXPECTED RESULT)]`
- **Priority markers: MANDATORY** — Must exist at category level, sub-category level, OR step level

**Priority Definitions** (Critical for synthesis):
- **P1**: Direct relationship to code change (found in PRs or design docs)
  - Evidence: Function modified, API endpoint changed, component refactored
  - Source: GitHub PR diff, design doc implementation section
  - Rule: If code changed, test is P1
- **P2**: No direct code change but may be affected OR needs cross-functional testing
  - Evidence: Related feature area, integration point, downstream impact
  - Source: Jira acceptance criteria, design doc scope section
  - Rule: If feature touches this area or XFUNC test needed, mark P2
- **P3**: Nice to have, can skip if timeline is limited
  - Evidence: Enhancement, edge case, future improvement
  - Source: Design doc future work, optional requirements
  - Rule: If not blocking and can defer, mark P3

---

## Dual Output Specification

### File 1: `qa_plan_final.md`

Contains:
- ✅ Summary
- ✅ Background
- ✅ QA Goals
- ❌ Test Key Points (excluded — moved to File 2)
- ✅ Risk & Mitigation
- ✅ Consolidated Reference Data
- ✅ Sign-off Checklist
- ✅ QA Summary

### File 2: `test_key_points_xmind.md`

Contains:
- ✅ Test Key Points ONLY
- ✅ Organized by main category (E2E, Functional, Performance, etc.)
- ✅ Hierarchical bullet structure
- ✅ XMind-importable format per template
- ✅ **Priority markers MANDATORY** at category/sub-category/step level
- ✅ Expected results in leaf nodes

**Priority Assignment Rules**:
1. **P1 assignment**: Map test scenario to GitHub traceability file
   - If scenario tests code in PR diff → P1
   - If design doc explicitly mentions implementation → P1
2. **P2 assignment**: No direct code change but:
   - Feature touches related area → P2
   - XFUNC test needed for integration → P2
   - Acceptance criteria requires testing → P2
3. **P3 assignment**: Nice-to-have scenarios
   - Edge cases not in ACs → P3
   - Future enhancements → P3
   - Can skip if timeline limited → P3

---

## Priority Assignment Logic (Critical)

### Overview

Every test scenario in the XMind output **MUST** have a priority marker (P1/P2/P3) at one of these levels:
- Category level (e.g., `## Functional - P1`)
- Sub-category level (e.g., `### Error Recovery - P1`)
- Step level (e.g., `- Trigger max rows error - P1`)

### Priority Definitions

| Priority | Meaning | Evidence Source | Assignment Rule |
|----------|---------|-----------------|-----------------|
| **P1** | Direct code change | GitHub PR diff, Design doc implementation section | If function/API/component modified in PR → P1 |
| **P2** | Affected area or XFUNC | Jira ACs, Design doc scope, Integration points | If no code change but feature touches area OR XFUNC test needed → P2 |
| **P3** | Nice to have | Design doc future work, Optional requirements | If edge case, enhancement, or can defer → P3 |

### Assignment Algorithm (for `qa-plan-synthesize`)

```
FOR each test scenario:
  1. Read GitHub traceability file
  2. Check if scenario maps to changed file/function/component
  
  IF match found in PR diff:
    → Assign P1
  ELSE IF scenario is XFUNC or tests integration:
    → Assign P2
  ELSE IF scenario is edge case or nice-to-have:
    → Assign P3
  ELSE:
    → Default to P2 (conservative)
  
  3. Determine placement level:
    - IF all scenarios in category have same priority:
      → Place at category level (e.g., ## Functional - P1)
    - ELSE IF sub-category scenarios have same priority:
      → Place at sub-category level (e.g., ### Error Recovery - P1)
    - ELSE:
      → Place at individual step level (e.g., - Test scenario - P1)
```

### Examples (BCIN-6709)

**Example 1: Direct Code Change → P1**
```markdown
## Functional - P1

### Error Recovery Flow - P1

- Trigger max rows error
  - Click "OK" in dialog
    - Report returns to pause mode [(EXPECTED RESULT)]
```
*Reason*: `recreate-error-catcher.tsx` modified in PR to handle max rows error → P1

**Example 2: Integration Test → P2**
```markdown
## Integration - P2

### Cross-Repo Error Flow

- Error in biweb API - P2
  - Propagates to react-report-editor
    - Error dialog appears [(EXPECTED RESULT)]
```
*Reason*: No single component changed, but tests integration across repos → P2

**Example 3: Edge Case → P3**
```markdown
## Edge Cases - P3

### Concurrent Error Handling

- Trigger two errors simultaneously - P3
  - Second error queued
    - First dialog shown, then second [(EXPECTED RESULT)]
```
*Reason*: Not in ACs, edge case, can skip if timeline limited → P3

### Traceability Mapping (Implementation Detail)

When synthesizing, the skill must:
1. Load `context/qa_plan_github_traceability_<feature>.md`
2. Extract mapping: `Scenario ID → File/Function`
3. For each test scenario in synthesis:
   - Match scenario to traceability entry
   - If match → P1
   - Else apply P2/P3 rules
4. Annotate priority in XMind output at appropriate level

---

## Conditional Search Logic

### Decision Tree

```
Read Jira issue (BCIN-6709)
  ↓
Check: issuelinks[] array empty?
Check: subtasks[] array empty?
  ↓
IF both empty:
  → search_required = false
  → Skip Confluence search (use only provided design doc URL)
ELSE:
  → search_required = true
  → Trigger Confluence search for related pages
```

### Implementation

```javascript
// Pseudo-code
const issue = await jira.getIssue(feature_id);
const hasLinkedIssues = issue.fields.issuelinks?.length > 0;
const hasSubtasks = issue.fields.subtasks?.length > 0;
const search_required = hasLinkedIssues || hasSubtasks;

if (search_required) {
  spawn_sub_agent({
    task: "Analyze Jira + run Confluence search for related docs",
    context: { feature_id, design_doc_url, search_enabled: true }
  });
} else {
  spawn_sub_agent({
    task: "Analyze Jira + only provided design doc",
    context: { feature_id, design_doc_url, search_enabled: false }
  });
}
```

---

## Test Case: BCIN-6709

### Inputs

| Input | Value |
|-------|-------|
| **Jira Key** | BCIN-6709 |
| **Design Doc** | https://microstrategy.atlassian.net/wiki/spaces/~yuanli/pages/5901516841/BCIN-6709+Improve+the+behavior+for+end+user+to+allow+continued+operations+on+report+in+Library+after+error+happens |
| **PR URLs** | - https://github.com/mstr-modules/react-report-editor/compare/m2021...revertReport<br>- PRs in Jira comments<br>- mojojs, biweb, web-dossier repos |
| **Figma** | N/A (not mentioned) |

### Expected Outputs

1. **Context Files**:
   - `projects/feature-plan/BCIN-6709/context/qa_plan_atlassian_BCIN-6709.md`
   - `projects/feature-plan/BCIN-6709/context/qa_plan_github_BCIN-6709.md`
   - `projects/feature-plan/BCIN-6709/context/qa_plan_github_traceability_BCIN-6709.md`

2. **Final Outputs**:
   - `projects/feature-plan/BCIN-6709/qa_plan_final.md` (no test key points)
   - `projects/feature-plan/BCIN-6709/test_key_points_xmind.md` (XMind format)

3. **Tracking**:
   - `projects/feature-plan/BCIN-6709/task.json`
   - `projects/feature-plan/BCIN-6709/run.json`

### Success Criteria

- ✅ Dual outputs generated correctly
- ✅ XMind file importable to XMind application
- ✅ Test key points follow hierarchical bullet structure
- ✅ **Every test scenario has priority (P1/P2/P3) at some level**
- ✅ **P1 priorities correctly mapped to code changes from GitHub traceability**
- ✅ **P2 priorities assigned to XFUNC and affected areas**
- ✅ **P3 priorities assigned to edge cases and nice-to-haves**
- ✅ Main QA plan has all sections except test key points
- ✅ Conditional search logic works (check for linked issues)
- ✅ Sub-agents spawn and complete successfully
- ✅ Final QA plan meets quality requirements (user-facing, no code vocabulary in steps)

---

## Iteration Strategy

### Round 1: Core Implementation
1. Update skill SKILL.md files
2. Implement orchestrator spawning logic
3. Implement XMind format generator
4. Run BCIN-6709 test
5. Capture issues

### Round 2: Quality Enhancement
1. Review output quality
2. Fix gaps in user-facing wording
3. Improve XMind format fidelity
4. Re-run test

### Round 3: Polish
1. Final review
2. Documentation updates
3. Example creation
4. Skill sync to .agents/

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Sub-agent spawn failures | Add retry logic + fallback to direct skill invocation |
| XMind import incompatibility | Validate format against test-case-template.md before saving |
| Confluence search timeout | Set reasonable timeout + allow partial results |
| Context file collision | Use unique feature_id in all file paths |
| Missing GitHub PRs | Handle gracefully; use available PRs only |

---

## Dependencies

### Skills
- ✅ `spawn-agent-session` (shared)
- ✅ `jira-cli` (shared)
- ✅ `confluence` (shared)
- ⚠️ `qa-plan-atlassian` (needs update)
- ⚠️ `qa-plan-github` (needs update)
- ⚠️ `qa-plan-synthesize` (needs update)
- ✅ `qa-plan-review` (existing)
- ✅ `qa-plan-refactor` (existing)

### External Tools
- Jira API (via jira-cli)
- Confluence API (via confluence skill)
- GitHub API (via gh CLI or GitHub skill)
- XMind (for validation — Snow's local machine)

### Credentials
- Jira token
- Confluence token
- GitHub token
- Feishu webhook (for notification)

---

## Timeline Estimate

| Phase | Estimated Time | Notes |
|-------|----------------|-------|
| Phase 1: Skill Architecture | 2 hours | Update SKILL.md files |
| Phase 2: Core Orchestrator | 3 hours | Spawning + conditional logic |
| Phase 3: XMind Format | 2 hours | Format transformation |
| Phase 4: Sub-Agent Skills | 2 hours | Update Atlassian + GitHub skills |
| Phase 5: E2E Test Round 1 | 1 hour | Run BCIN-6709 |
| Phase 6: Iteration Round 2 | 2 hours | Fix issues + re-run |
| Phase 7: Documentation | 1 hour | Examples + README |
| Phase 8: Sync & Finalize | 1 hour | Sync to .agents/ |
| **Total** | **~14 hours** | Includes testing + iteration |

---

## Success Metrics

- [ ] Dual outputs generated for BCIN-6709
- [ ] XMind file successfully imports to XMind
- [ ] Test key points match hierarchical template format
- [ ] **All test scenarios have priority markers (P1/P2/P3)**
- [ ] **P1 scenarios traced to actual code changes in PRs**
- [ ] **P2 scenarios correctly identify XFUNC or affected areas**
- [ ] **P3 scenarios are edge cases/nice-to-haves only**
- [ ] Main QA plan has no test key points section
- [ ] Sub-agents spawn and complete without errors
- [ ] Conditional search logic works correctly
- [ ] Output quality meets user-facing requirements
- [ ] No code vocabulary in manual test steps
- [ ] All skills documented and synced

---

## Next Steps

1. ✅ Get approval on this plan from Snow
2. ⬜ Start Phase 1: Update skill architecture
3. ⬜ Proceed with phased implementation
4. ⬜ Test iteratively with BCIN-6709
5. ⬜ Finalize and sync skills

---

**Plan Status**: 🔄 **REVISION IN PROGRESS**  
**Last Updated**: 2026-03-07 12:34 GMT+8

---

## Revision Focus

User requested design corrections before this is considered complete:
- QA plan final output must follow `templates/qa-plan-template.md`
- Review/refactor is mandatory for both QA plan and test cases
- Final test-case markdown must remove instructional template annotations
- Technical, vague, or non-actionable subcategories must be rewritten into user-observable actions
- Confluence clarification is required when wording is vague
- Confluence publishing is approval-gated and requires a confirmed target page

**Status**: updating skills and workflow to match these rules
