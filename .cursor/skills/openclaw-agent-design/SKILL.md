---
name: openclaw-agent-design
description: Designs OpenClaw agents with state-machine-driven workflows, resume capability, user confirmation gates, and Feishu notification. Must invoke agent-idempotency to review and refactor Phase 0. Uses clawddocs for agent concepts. Use when designing new OpenClaw agents, workflows, or when creating AGENTS.md, .agents/workflows, or agent skills.
---

# OpenClaw Agent Design

Design principles for building resilient, resumable OpenClaw agents with human-in-the-loop confirmation and Feishu notification.

## 0. Design Process: Invoke agent-idempotency

**MANDATORY:** When designing or drafting any workflow (especially Phase 0), invoke the **agent-idempotency** skill to review and refactor.

1. **Draft** the workflow (Phase 0 + later phases).
2. **Invoke agent-idempotency** — apply it to Phase 0: classify states, define options (Use Existing / Smart Refresh / Full Regenerate / Resume / Generate from Cache), ensure archive-before-overwrite, cache freshness display, run.json/task.json schema.
3. **Refactor** Phase 0 per agent-idempotency feedback before finalizing.
4. **Invoke openclaw-agent-design-review** (via `openclaw-agent-design-reviewer`) and resolve all P0/P1 findings before final output.

**Reference workflows** (canonical examples that embody agent-idempotency + state machine):

- `workspace-reporter/.agents/workflows/qa-summary.md` — Phase 0: Idempotency Check & Pre-Flight (Workspace State Classification, Archive Check, Missing Artifact Check)
- `workspace-planner/.agents/workflows/feature-qa-planning.md` — Phase 0: Preparation, check_resume.sh, REPORT_STATE, DEFECT_ANALYSIS_RESUME

Use these as templates when designing new workflows.

## 1. Understand Agent Concepts (clawddocs)

**MANDATORY:** Before designing any OpenClaw agent, use the **clawddocs** skill to understand:

- Agent architecture (workspace structure, SOUL.md, AGENTS.md, MEMORY.md)
- OpenClaw workspace conventions (workspace/, skills/, hooks/)
- Multi-agent coordination (sessions_spawn, sessions_send, sessions_list)
- Integration patterns (Feishu, providers, gateway configuration)

Consult clawddocs when: setting up agent structure, configuring integrations, or answering "how does OpenClaw handle X?"

## 2. Artifacts to Consider

When designing a new agent, decide what to create:

| Artifact | When to Create | Purpose |
|----------|----------------|---------|
| **Workflow** (`.agents/workflows/<name>.md`) | Multi-phase, resumable process | Step-by-step orchestration with state tracking |
| **AGENTS.md** | Every agent | Operating instructions, session checklist, core workflow reference |
| **Skills** (`skills/<skill-name>/SKILL.md`) | Domain-specific reusable logic | Encapsulate tool usage, templates, validation |
| **Scripts** (`scripts/*.sh`) | Resume/state checks, retries, archiving | Idempotency, checkpointing, resilience |

**Rule:** If the agent has >2 phases with external API calls or long-running work → create a workflow. Reference it from AGENTS.md.

## 3. State Machine for Resilience

**Use `task.json` (or `run.json` / `testcase_task.json`) to track status.** Make the workflow resumable and recoverable.

### 3.1 Core Fields

```json
{
  "overall_status": "in_progress | completed | failed",
  "current_phase": "<phase_name>",
  "updated_at": "<ISO8601>",
  "phases": {
    "<phase>": { "status": "pending | in_progress | completed | failed" }
  }
}
```

### 3.2 Sub-task State Machines

For optional/cross-agent subtasks, add explicit state fields from the start:

```json
{
  "defect_analysis": "not_applicable | pending | in_progress | completed | skipped"
}
```

State transitions: `not_applicable` → `pending` → `in_progress` → `completed` or `skipped`.

### 3.3 Check-Resume Script Pattern

Create `scripts/check_resume.sh <entity-id>` that implements the **agent-idempotency** tiered existence check:

1. **Emit `REPORT_STATE` first** (idempotency before any API):
   - **FINAL_EXISTS** → Output exists. STOP, show freshness. Options: (A) Use Existing (B) Smart Refresh (C) Full Regenerate.
   - **DRAFT_EXISTS** → Draft exists. STOP. Options: (A) Resume to Approval (B) Smart Refresh (C) Full Regenerate.
   - **CONTEXT_ONLY** → Context/cache exists, no output. Options: (A) Generate from Cache (B) Re-fetch + Regenerate.
   - **FRESH** → No artifacts. Proceed.
2. **Parse `task.json`** → `current_phase`, `overall_status`, sub-task states.
3. **Emit `DEFECT_ANALYSIS_RESUME`** (or equivalent) when sub-task was `in_progress`/`pending`:
   - `COMPLETED` → Proceed to next phase.
   - `AWAITING_APPROVAL` → Prompt: (A) Open for approval (B) Skip.
   - `NOT_FOUND` → Prompt: resume or skip.
4. **If RESUMABLE** → Output `resume_from: <phase>`.

### 3.4 Working Directory Convention

- Working dir: `projects/<project-type>/<entity-id>/` (e.g. `projects/feature-plan/<feature-id>/`).
- Scripts run from entity dir use `../scripts/` (e.g. `../scripts/check_resume.sh <feature-id>`).

## 4. Workflow: Never Assume

**In workflow instructions:**

- **Double confirm** requirements with the user before proceeding. Raise questions if unsure.
- **ONLY proceed with explicit user approval** for: external API calls, publishing, overwriting outputs.
- **Be critical** — surface ambiguities, missing data, risks. Never silently guess.

Example Phase 0 pattern:

```
1. Accept target ID and artifacts from user.
2. Based on provided artifacts, double confirm requirements and raise questions if doubts exist.
   ONLY proceed with user approval.
3. Ensure working directory is projects/<type>/<id>. Scripts use ../scripts/.
4. Run ../scripts/check_resume.sh <id>. Parse REPORT_STATE.
5. Handle FINAL_EXISTS / DRAFT_EXISTS / CONTEXT_ONLY → STOP, present options, wait for choice.
6. If FRESH or RESUMABLE → initialize task.json or resume from phase.
```

## 5. Phase-End Notifications

**At the end of each phase**, notify the user about progress:

- Phase completed
- Artifacts produced (paths)
- Next phase (or completion)
- Any blockers or placeholders

Inline example: *"📝 Written `<scenario>.md` (M of N)."*

## 6. Final Feishu Notification

**At workflow completion**, send notification via the `feishu` skill:

```
✅ [Workflow/Output] updated
  Feature:   <FEATURE_KEY>
  Page:      <Title>
  URL:       <URL>
  Updated:   <UTC TIME>
  Sections:  1–9 (⚠️ <List with placeholders> have placeholders)
Published by [Agent Name].
```

**If Feishu fails:** Log to `run.json` or `task.json` → `notification_pending` (full message text). On next run, retry before starting any phase.

## 7. Quick Checklist

Before finalizing an agent design:

- [ ] **agent-idempotency** skill invoked to review and refactor Phase 0
- [ ] clawddocs consulted for agent concepts
- [ ] `openclaw-agent-design-reviewer` executed and returned `pass` or `pass_with_advisories`
- [ ] reviewer report path captured in final handoff output
- [ ] Workflow, AGENTS.md, skills need identified
- [ ] task.json/run.json with state machine defined
- [ ] check_resume.sh (or equivalent) for idempotency and resume
- [ ] Phase 0 aligns with agent-idempotency: tiered existence check, archive-before-overwrite, freshness display
- [ ] User confirmation gates before external/publish steps
- [ ] Phase-end progress notifications
- [ ] Feishu notification + `notification_pending` fallback

## Additional Resources

- agent-idempotency skill: `.cursor/skills/agent-idempotency/SKILL.md`
- State machine examples, REPORT_STATE handling, Feishu template: [reference.md](reference.md)
