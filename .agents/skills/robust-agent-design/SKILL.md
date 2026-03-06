---
name: robust-agent-design
description: Design principles and requirements for building robust, scalable, and resilient agents. Use when designing new agents, orchestrators, or workflows that involve multi-step processing, external API calls, or long-running tasks.
---

# Robust Agent Design Principles

## Purpose

Ensure that any newly designed agent or orchestrator in the workspace is built to scale gracefully, handle failures smoothly, track progress accurately, and mandate human approval for critical actions.

## When To Use

Use this skill when:
- Designing a new agent (e.g., Reporter Agent, Planner Agent)
- Drafting a `.md` design document for an agent's workflow
- Implementing long-running or rate-limited tasks
- Defining workflows that touch external systems (Jira, GitHub, Confluence, Feishu)

## Core Principles & Requirements

1. **Scalability & Parallel Execution**
   - For batch operations (e.g., >30 issues/PRs), break tasks down and delegate to **Sub-Agents** running in parallel.
   - Set concurrency limits to avoid API throttling.
   - Always use **pagination** for API data fetching.

2. **Progress Monitoring & Heartbeat Mechanism**
   - Maintain a local state file (e.g., `task.json`) to track active phases, subtask counts, and estimated time remaining.
   - If a phase takes longer than a defined threshold, emit a **Heartbeat notification** to the user (e.g., "Processed 12/35 items... ETA 2 mins").

3. **Intermediate Artifacts & Checkpointing**
   - Never keep all state strictly in memory. 
   - Write raw API payloads (e.g., raw Jira JSON) and parsed summaries (e.g., PR diff impact docs) to an `context/` artifacts directory (per feature OR per request).
   - Support resuming execution from these intermediate artifacts upon crashes, timeouts, or rate limiting. 

4. **Human-in-the-Loop (HIL) / Approval Gate**
   - Agents must draft their final output (e.g., `<FEATURE_KEY>_REPORT_DRAFT.md`) and **pause** execution.
   - Require explicit user approval before executing state-changing tasks like publishing to Confluence, sending a Feishu message, or merging a PR.

5. **Single Responsibility via Sub-tools**
   - The Orchestrator should delegate specialized tasks to localized CLI skills (e.g., `jira-cli`, `github`, `confluence`).
   - Avoid monolithic execution; use explicit workflows.

6. **Structured Folder architecture**
   - Outline the folder structure for the project in the design document.
   - Use consistent naming conventions for files and folders.

## Quality Gates

- [ ] Does the design specify how to handle fetching >30 items?
- [ ] Is there a `task.json` or equivalent progress tracking defined?
- [ ] Are raw outputs checkpointed to an `context/` folder?
- [ ] Is there a clear approval gate before external publication?
- [ ] Are sub-agents or CLI tools defined for distinct tasks?

## Additional Resources

- Implementation details: [reference.md](reference.md)
- Concrete examples: [examples.md](examples.md)
