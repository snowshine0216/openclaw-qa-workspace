# Feature Planner Orchestrator - Implementation Summary

This document summarizes the changes made to instantiate the Feature Planner Agent design within the OpenClaw environment.

### 1. Core Orchestration Workflow Defined
A new central orchestration workflow has been implemented at `.agents/workflows/feature-qa-planning.md`.
This explicitly instructs the OpenClaw agent on how to manage the lifecycle of drafting a highly comprehensive QA plan for a feature out of its individual parts (Jira context, Confluence PRD, GitHub diffs, Figma UI design).
The workflow defines 4 distinct sequential steps:
1. **Initialization & Context Gathering**: Parallel CLI operations fetching data.
2. **Generation**: Synthesis of drafted plan via `qa-plan-architect-orchestrator`.
3. **Review/Refactor Loop**: An internal quality-gate led by `qa-plan-review` finding testing gaps.
4. **Publication**: Committing to `task.json` and publishing idempotently to Confluence.

### 2. Resilience Scripts Reviewed
The existing operational bash scripts in `workspace-planner/projects/feature-plan/scripts/` were reviewed against the design goals:
- **`retry.sh`**: Fully supports the retry policies requirement, seamlessly implementing an exponential backoff loop for network calls. No enhancement required.
- **`check_resume.sh`**: Accurately queries `task.json` using `jq` for ongoing checkpoints, enabling gracefully resuming broken executions instead of starting fresh. No enhancement required.

### 3. Prompt Persona Skills Reviewed
We evaluated `qa-plan-architect-orchestrator.md` and related generation/review skills inside `workspace-planner/skills/`:
- The skills correctly synthesize test cases mapped across multiple sources with adequate risk correlation.
- Currently, `qa-plan-architect-orchestrator` points to a default output path (`/Users/xuyin/Documents/FeatureTest/QAPlans/`). The new workflow supersedes this behavior safely by explicitly defining the target extraction/saving directory inside `projects/feature-plan/<feature-id>/...`. Therefore, the existing skills are highly sufficient without explicit modifications.

### 4. Heartbeat and Agent Role Integration
- **`AGENTS.md`**: Updated to specify the "Master Orchestrator" workflow. When provided an artifact, it uses `.agents/workflows/feature-qa-planning.md` to trigger the sequence rather than defaulting to generic ad-hoc methods.
- **`HEARTBEAT.md`**: Updated to include active monitoring instructions for `task.json`. The agent will now check `overall_status` and `current_phase` along with any task errors and directly relay this structured data to the master agent during heartbeat polls.
