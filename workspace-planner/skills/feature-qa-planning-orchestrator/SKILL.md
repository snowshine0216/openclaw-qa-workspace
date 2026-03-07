---
name: feature-qa-planning-orchestrator
description: Canonical workspace-planner entrypoint for end-to-end QA plan generation. Orchestrates Phase 0 idempotency, sub-agent spawning for parallel context gathering, synthesis with dual-output (main plan + XMind test cases), review/refactor, publication, and live Confluence review.
---

# Feature QA Planning Orchestrator

This skill is the canonical replacement for the removed legacy `feature-qa-planning` workflow file.

## When to Use

Use this skill when the user provides a feature key and one or more artifacts such as:
- Jira issue key
- Confluence design URL
- GitHub PR URL(s)
- Figma URL
- Background research notes

## Required Inputs

- `feature_id`: issue key such as `BCIN-6709`
- `jira_key`: usually same as `feature_id`
- `confluence_url`: optional but strongly recommended
- `github_pr_urls`: optional array of PR URLs
- `figma_url`: optional
- `background_context_path`: optional path under `context/`

Working directory:
- `workspace-planner/projects/feature-plan/<feature-id>/`

## Core Rules

- Always start with Phase 0 by running `../scripts/check_resume.sh <feature-id>` from the feature directory.
- Respect `REPORT_STATE` exactly: `FINAL_EXISTS`, `DRAFT_EXISTS`, `CONTEXT_ONLY`, `FRESH`.
- Never silently choose a destructive path.
- Archive before overwrite.
- **NEW**: Spawn sub-agents for parallel context gathering using `spawn-agent-session` skill.
- **NEW**: Generate dual outputs: final QA plan + XMind-compatible final test cases.
- **NEW**: The QA plan MUST follow `templates/qa-plan-template.md` as the final structure.
- **NEW**: Evaluation is mandatory for both QA plan and test cases: draft → `qa-plan-review` → `qa-plan-refactor` → final.
- **NEW**: Implement conditional Confluence search based on Jira linked/child issues, and also require Confluence clarification when generated test areas are vague, technical, or non-actionable so they can be rewritten into user-observable actions.
- Reuse shared skills directly from `~/.openclaw/skills`: `jira-cli`, `confluence`, `feishu-notify`, `spawn-agent-session`.
- Treat `~/.openclaw/skills` as canonical for shared skills. Workspace-root copies are synced mirrors and must stay aligned with the shared source.
- Reuse planner-local skills directly: `qa-plan-atlassian`, `qa-plan-github`, `qa-plan-figma`, `qa-plan-synthesize`, `qa-plan-review`, `qa-plan-refactor`, `qa-plan-confluence-review`.
- Keep code/internal details out of manual QA rows; user-facing outcomes belong in the final QA plan and final test cases.
- NEVER publish to Confluence without explicit user approval and a confirmed target page.

## Workflow

### Phase 0 — Existing-State Check and Preparation

1. Confirm user intent and summarize the provided artifacts.
2. Run `../scripts/check_resume.sh <feature-id>`.
3. Parse `REPORT_STATE` and stop for user choice when prior artifacts exist:
   - `FINAL_EXISTS` → `Use Existing | Smart Refresh | Full Regenerate`
   - `DRAFT_EXISTS` → `Resume | Smart Refresh | Full Regenerate`
   - `CONTEXT_ONLY` → `Generate from Cache | Re-fetch + Regenerate`
   - `FRESH` → proceed
4. If `DEFECT_ANALYSIS_RESUME` is emitted, follow the resume guidance before moving on.
5. Initialize or update `task.json` and `run.json` additively.
6. **NEW**: Determine conditional search requirement:
   - Read Jira issue via `jira-cli`
   - Check `issuelinks[]` only
   - Set `search_required = (issuelinks.length > 0)`
   - Store in `task.json.search_required` for sub-agent context
7. Build required evidence lists before spawning:
   - required Jira issues = main issue + all related issues discovered via the Jira skill query path + testing-relevant issue references surfaced in Jira comments
   - required GitHub PRs = all user-provided PR URLs + all PR/compare references surfaced from Jira comments that materially affect testing
   - required Figma input = any Figma URL discovered from Jira or Confluence web links
   - if any required evidence list cannot be resolved or fetched later, stop and ask the user whether to continue

Required `task.json` fields:
```json
{
  "run_key": "BCIN-6709",
  "overall_status": "in_progress",
  "current_phase": "phase_0_preparation",
  "defect_analysis": "not_applicable",
  "latest_draft_version": null,
  "search_required": false,
  "spawned_agents": {},
  "subtask_timestamps": {},
  "phases": {}
}
```

Required `run.json` fields:
```json
{
  "data_fetched_at": null,
  "output_generated_at": null,
  "notification_pending": null,
  "updated_at": null
}
```

### Phase 1 — Sub-Agent Context Gathering (NEW)

**Overview**: Spawn functional-area sub-agents in parallel for context acquisition.

1. Set `task.json.current_phase` to `phase_1_context_acquisition`; set `task.json.phases.context_gathering.status` to `in_progress`; update `task.json.updated_at`.

2. **Determine required sub-agents**:
   ```javascript
   const agents_to_spawn = [];
   
   if (jira_key || confluence_url) {
     agents_to_spawn.push({
       functional_area: "requirements_analysis",
       task_description: `Analyze Jira ${jira_key} and Confluence design doc. ${search_required ? 'Search Confluence for related pages.' : 'Use only provided design doc URL.'}`,
       skill: "qa-plan-atlassian",
       context: { feature_id, jira_key, confluence_url, search_enabled: search_required }
     });
   }
   
   if (github_pr_urls && github_pr_urls.length > 0) {
     agents_to_spawn.push({
       functional_area: "code_analysis",
       task_description: `Analyze GitHub PRs for ${feature_id}: ${github_pr_urls.join(', ')}. Generate user-facing summary and traceability companion.`,
       skill: "qa-plan-github",
       context: { feature_id, github_pr_urls }
     });
   }
   
   const effective_figma_url = figma_url || discovered_figma_url;
   if (effective_figma_url) {
     agents_to_spawn.push({
       functional_area: "ui_ux_analysis",
       task_description: `Analyze Figma design for ${feature_id}: ${effective_figma_url}`,
       skill: "qa-plan-figma",
       context: { feature_id, figma_url: effective_figma_url }
     });
   }
   ```

3. **Spawn sub-agents using `spawn-agent-session`**:
   ```javascript
   for (const agent_spec of agents_to_spawn) {
     // Use spawn-agent-session to normalize spawn request
     const spawn_request = {
       agent_id: "workspace-planner", // or dedicated QA agent
       mode: "run",
       runtime: "subagent",
       task: `${agent_spec.task_description}\n\nMANDATORY SKILL LOADING:\n- Read and follow the skill that matches this fetch path before doing any work.\n- Atlassian/Jira fetches MUST load and use the shared jira-cli skill.\n- Confluence fetches/publishing MUST load and use the shared confluence skill.\n- GitHub fetches MUST load and use the relevant GitHub/GitHub-fetch workflow specified by the local skill.\n- Do NOT fall back to raw local CLI before attempting the skill-defined wrapper path and auth precheck.\n- If auth/precheck fails for the required skill path, STOP and report blocker details.`,
       label: `${feature_id}-${agent_spec.functional_area}`,
       attachments: [
         {
           name: "context.json",
           content: JSON.stringify(agent_spec.context),
           encoding: "utf8",
           mimeType: "application/json"
         }
       ]
     };
     
     // Call sessions_spawn
     const session_key = await sessions_spawn(spawn_request);
     
     // Track in task.json
     task.json.spawned_agents[agent_spec.functional_area] = {
       session_key,
       skill: agent_spec.skill,
       status: "spawned",
       spawned_at: new Date().toISOString()
     };
   }
   ```

4. **Wait for sub-agent completion**:
   - Use `subagents(action=list)` to check status
   - Poll until all agents in `task.json.spawned_agents` have completed
   - Timeout: 10 minutes per agent (configurable)
   - On completion, update `task.json.spawned_agents[area].status = "completed"`

5. **Validate outputs**:
   - Check that expected context files exist:
     - `context/qa_plan_atlassian_<feature-id>.md`
     - `context/qa_plan_github_<feature-id>.md`
     - `context/qa_plan_github_traceability_<feature-id>.md`
     - `context/qa_plan_figma_<feature-id>.md` (if Figma sub-agent spawned)
   - If any file missing or empty, mark as failed in `task.json` and decide:
     - Fatal (e.g., no GitHub analysis when PRs exist) → stop
     - Non-fatal (e.g., no Figma analysis) → continue with warning

6. Update freshness timestamps in `run.json` and `task.json.subtask_timestamps`.

7. When Phase 1 completes successfully, set `task.json.phases.context_gathering.status` to `completed`, record completion timestamp, update `task.json.updated_at`, and advance `task.json.current_phase` to `phase_2_synthesis`.

**Note**: Phase 2 (Domain Analysis) is now merged into Phase 1 via sub-agents. Legacy Phase 2 removed.

### Phase 2 — Domain Sub Test-Case Generation (UPDATED)

**Overview**: Spawn domain-specific subagents to generate sub test cases from their own evidence before any main synthesis happens.

Required domain generation subagents:
- Jira / requirements sub test-case generator
- Confluence / design sub test-case generator
- GitHub / code-change sub test-case generator
- Figma / UI sub test-case generator when Figma evidence is available

Each domain subagent must:
- use the test-case template as its scaffold
- stay within its own source evidence scope
- generate a domain-level sub test-case artifact
- assign priorities using the mandatory priority rules
- avoid final synthesis across other domains

The main agent then synthesizes those sub test-case artifacts into the unified test-case draft.

### Phase 3 — Synthesis and Dual-Output Generation (UPDATED)

**Overview**: Synthesize all context plus domain sub test-case artifacts into TWO outputs: main QA plan + XMind test cases.

1. Set `task.json.current_phase` to `phase_2_synthesis`; set `task.json.phases.plan_generation.status` to `in_progress`; update `task.json.updated_at`.

2. Invoke `qa-plan-synthesize` with dual-output flag:
   ```javascript
   await qa_plan_synthesize({
     feature_id,
     context_files: [
       "context/qa_plan_atlassian_*.md",
       "context/qa_plan_github_*.md",
       "context/qa_plan_github_traceability_*.md",
       "context/qa_plan_figma_*.md",
       "context/qa_plan_defect_analysis_*.md"
     ],
     output_mode: "dual",
     outputs: {
       main_plan: "drafts/qa_plan_v<N+1>.md",
       xmind_tests: "test_key_points_xmind.md"
     },
     priority_rules: "docs/priority-assignment-rules.md"
   });
   ```

3. **Dual-Output Contract**:
   - **File 1**: `drafts/qa_plan_v<N+1>.md`
     - Draft that follows `templates/qa-plan-template.md`
     - Contains: Summary, Background, QA Goals, Risk & Mitigation, Reference Data, Sign-off Checklist, QA Summary
     - **Excludes**: Test Key Points (moved to File 2)
   - **File 2**: `drafts/test_key_points_xmind_v<N+1>.md`
     - Draft test cases ONLY in XMind-compatible hierarchical bullet format
     - Includes: Priority markers (P1/P2/P3) at category/sub-category/step level
     - Uses `templates/test-case-template.md` as a scaffold, but final draft content must strip template annotations and use user-observable wording

4. Require translation of code facts into user-facing behavior before any manual QA row is written.

5. Rewrite any vague or technical heading into a concrete user action plus observable outcome; use Confluence clarification when needed.

6. Route automation-only checks into `### AUTO: Automation-Only Tests`.

7. Run the self-healing User Executability check before saving.

8. Update `task.json.latest_draft_version`.

8. When synthesis completes, set `task.json.phases.plan_generation.status` to `completed`, record both output paths, update `task.json.updated_at`, and advance `task.json.current_phase` to `phase_3_review_refactor`.

### Phase 4 — Domain Review Loop (UPDATED)

Spawn review subagents by domain/context before final refactor:
- Jira review subagent
- Confluence review subagent
- GitHub review subagent
- Figma review subagent when Figma evidence materially shaped output

Each review subagent must review the generated outputs against its own domain evidence and return source-grounded findings only.
The main agent then synthesizes those findings into one refactor action list.

### Phase 5 — Review and Refactor Loop (UPDATED)

1. Set `task.json.current_phase` to `phase_3_review_refactor`; set `task.json.phases.review_refactor.status` to `in_progress`; update `task.json.updated_at`.

2. Run `qa-plan-review` on **both drafts**:
   - `drafts/qa_plan_v<N>.md` (main plan draft)
   - `drafts/test_key_points_xmind_v<N>.md` (test-case draft)

3. **Additional XMind validation**:
   - Check: All test scenarios have priority markers (P1/P2/P3)
   - Check: P1 scenarios trace to GitHub code changes
   - Check: Hierarchical bullet structure matches template
   - Check: Expected results in leaf nodes

4. If status is `Requires Updates`, run `qa-plan-refactor` to produce final-quality outputs, then review again.

5. Maximum automatic refactor rounds: 2.

6. If status remains unresolved after 2 rounds, keep `task.json.phases.review_refactor.status` as `failed`, add blocking findings to `task.json.errors`, update `task.json.updated_at`, and return findings to the user.

7. Never publish on `Rejected`; if rejected, keep `task.json.overall_status` as `in_progress` or `failed`.

8. When review passes, set `task.json.phases.review_refactor.status` to `completed`, record final iteration count, update `task.json.updated_at`, and advance `task.json.current_phase` to `phase_4_publication_live_review`.

### Phase 4 — Publication and Live Review (UPDATED)

1. Set `task.json.current_phase` to `phase_4_publication_live_review`; set `task.json.phases.publication.status` to `in_progress`; update `task.json.updated_at`.

2. Ask the user whether they want publication. If yes, confirm the exact target Confluence page. If the user does not provide a target page, ask and pause.

3. Archive existing final outputs before overwrite:
   - `qa_plan_final.md` → `archive/qa_plan_final_<timestamp>.md`
   - `test_key_points_xmind_final.md` → `archive/test_key_points_xmind_final_<timestamp>.md`

4. Copy approved drafts to finals:
   - `drafts/qa_plan_v<N>.md` → `qa_plan_final.md`
   - `drafts/test_key_points_xmind_v<N>.md` → `test_key_points_xmind_final.md`

5. Publish `qa_plan_final.md` to Confluence ONLY after explicit user approval and confirmed target page.

4. Update `run.json.output_generated_at`.

5. Publish main QA plan to Confluence using `confluence` skill (Markdown mode).

6. Run `qa-plan-confluence-review` and save versioned review artifacts:
   - `qa_plan_confluence_review_v<N>.md`

7. Branch on live review verdict:
   - pass → continue to notification
   - fix required → loop back to Phase 2 or Phase 3

8. If publication cannot finish, persist retry data to `run.json.notification_pending`.

9. Use `feishu-notify` for final notification:
   ```
   Feature ${feature_id} QA Plan Complete ✅
   - Main Plan: qa_plan_final.md
   - Test Cases: test_key_points_xmind.md
   - Confluence: [link]
   ```

10. After successful notification, set `task.json.current_phase` to `completed`, set `task.json.overall_status` to `completed`, and update completion timestamps.

## Handoff Artifacts (UPDATED)

Required planner outputs:
- `workspace-planner/projects/feature-plan/<feature-id>/task.json`
- `workspace-planner/projects/feature-plan/<feature-id>/run.json`
- `workspace-planner/projects/feature-plan/<feature-id>/drafts/qa_plan_v<N>.md`
- `workspace-planner/projects/feature-plan/<feature-id>/qa_plan_final.md` (main plan without test key points)
- `workspace-planner/projects/feature-plan/<feature-id>/test_key_points_xmind.md` (XMind-compatible)
- `workspace-planner/projects/feature-plan/<feature-id>/qa_plan_confluence_review_v<N>.md`
- `workspace-planner/projects/feature-plan/<feature-id>/context/` (sub-agent outputs)

## Validation

Before considering the run complete:
```bash
cd workspace-planner/projects/feature-plan/<feature-id>
../scripts/check_resume.sh <feature-id>
jq -r '.current_phase,.latest_draft_version,.search_required,.spawned_agents' task.json
jq -r '.data_fetched_at,.output_generated_at,.notification_pending' run.json
ls drafts/qa_plan_v*.md
ls test_key_points_xmind.md
ls context/qa_plan_*.md
```

## Priority Assignment Rules (NEW)

Priority assignment is handled automatically by `qa-plan-synthesize` using rules from `docs/priority-assignment-rules.md`:

- **P1**: Direct relationship to code change (traceable to PR diff)
- **P2**: No direct code change but affected area or XFUNC test needed
- **P3**: Nice-to-have, can skip if timeline limited

Every test scenario in XMind output MUST have a priority marker at category, sub-category, or step level.

## Related Skills

- **Shared Skills**:
  - `spawn-agent-session` (NEW — sub-agent spawning)
  - `jira-cli`
  - `confluence`
  - `feishu-notify`

- **Planner-Local Skills**:
  - `qa-plan-atlassian` (sub-agent compatible)
  - `qa-plan-github` (sub-agent compatible)
  - `qa-plan-figma` (sub-agent compatible)
  - `qa-plan-synthesize` (dual-output + priority assignment)
  - `qa-plan-review`
  - `qa-plan-refactor`
  - `qa-plan-confluence-review`

## Example Usage

```bash
# User provides inputs
feature_id: BCIN-6709
jira_key: BCIN-6709
confluence_url: https://microstrategy.atlassian.net/wiki/spaces/~yuanli/pages/5901516841/...
github_pr_urls:
  - https://github.com/mstr-modules/react-report-editor/compare/m2021...revertReport
  - https://github.com/mstr-kiai/biweb/compare/m2021...revertReport
  - https://github.com/mstr-kiai/mojojs/compare/m2021...revertReport

# Orchestrator workflow:
1. Phase 0: Check idempotency, detect no linked issues → search_required=false
2. Phase 1: Spawn 2 sub-agents (requirements + code analysis)
3. Phase 2: Synthesize → generate qa_plan_v1.md + test_key_points_xmind.md
4. Phase 3: Review both outputs, validate priorities
5. Phase 4: Publish to Confluence, notify via Feishu

# Outputs:
- qa_plan_final.md (without test key points)
- test_key_points_xmind.md (importable to XMind with P1/P2/P3)
```

## Notes

- Sub-agent spawning is **asynchronous** — orchestrator must wait for completion before synthesis.
- XMind format must exactly match `templates/test-case-template.md` for import compatibility.
- Priority assignment is **mandatory** — synthesis will fail if priorities cannot be determined.
- Conditional search logic reduces unnecessary Confluence API calls while ensuring thorough analysis for complex features.

---

**Last Updated**: 2026-03-07  
**Status**: Active — Enhanced with sub-agent orchestration and dual-output generation
