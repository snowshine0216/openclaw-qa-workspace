# OpenClaw QA Planner Agent Design

> **Enhancement Proposal**: See [`DESIGN_ENHANCEMENTS.md`](./DESIGN_ENHANCEMENTS.md) for detailed designs on parallel context gathering, `task.json` progress monitoring, intermediate documentation artifacts, and resilience strategies.

## 1. Overview
The QA Planner Agent serves as a master orchestrator within the OpenClaw environment, responsible for automatically extracting requirements, architectural changes, and UI/UX designs from disparate sources (Jira, Confluence, Figma, GitHub), and synthesizing them into a comprehensive, well-structured QA Plan.

**Core Objectives:**
- Automate requirement and technical change extraction.
- Cross-reference PR code diffs and Figma designs with Jira/Confluence requirements.
- Produce a detailed, structured QA testing plan.
- Establish an iterative feedback loop (self-review and refactoring).
- Sync the finalized QA Test Plan directly back to Atlassian Confluence.

## 2. Agent Persona & Role
- **Type**: Master Orchestrator (Planner Agent)
- **Primary Responsibility**: Synthesis, Planning, and Delegation.
- **Workflow**: Context Gathering -> Plan Generation -> Review -> Refinement -> Publish.

## 3. Workflow & Orchestration Design
Given the complexity of the task (extracting from multiple sources, parsing code diffs, analyzing images, and writing a definitive test plan), the **Planner Agent should act as an Orchestrator spanning multiple Specialized Skills and Sub-agents**.

A central Workflow will be defined (`qa-plan-architect-orchestrator.md` or similar) to guide the Planner Agent execution sequentially.

### 3.1 Step-by-Step Workflow Process

**Phase 1: Information Gathering & Context Extraction**
*The Planner Agent utilizes specific CLI skills to fetch data from provided links. All Tier 1 tasks run in parallel. See [DESIGN_ENHANCEMENTS.md §2](./DESIGN_ENHANCEMENTS.md#2-parallel-context-gathering) for details.*

*Progress is tracked via `task.json`. See [DESIGN_ENHANCEMENTS.md §3](./DESIGN_ENHANCEMENTS.md#3-progress-monitoring--taskjson--heartbeat).*

1. **Jira Extraction**: Use `jira-cli` skill (`jira issue view <KEY> --raw`) to pull issue descriptions, acceptance criteria, and linked Confluence docs or GitHub PRs.
2. **Confluence Extraction**: Use the `confluence` skill (`confluence read <page-id>`) to fetch PRDs, Architecture docs, and technical design pages.
3. **Figma Parsing**: Use `agent-browser` CLI skill (or `browser-use` cloud API for complex prototypes) with `qa-plan-figma` skill to screenshot, navigate, and extract UI/UX requirements. See [DESIGN_ENHANCEMENTS.md §1.3](./DESIGN_ENHANCEMENTS.md#13-browser-subagent-for-figma--how-it-works) for browser options.
4. **GitHub Extraction**: Use `gh` CLI skill (`gh pr diff`, `gh pr view --json`) to fetch PR diffs, changed files, and code commit history, understanding the technical boundary of the changes.

**Phase 2: QA Plan Architecture (Generation)**
*Data synthesis and draft creation.*
1. The Planner Agent invokes the `qa-plan-architect-orchestrator` skill to cross-reference the gathered data.
2. If domain knowledge is lacking or ambiguous concepts exist, the agent leverages the `tavily-search` skill to supplement its understanding.
3. Draft a comprehensive QA Plan covering:
   - Feature Overview & Scope
   - Test Strategies (Functional, UI/UX, Backend, Performance)
   - Specific Test Scenarios derived from ACs and Code Changes
   - Risk Assessment and Edge Cases

**Phase 3: Review & Refactor Loop**
*A self-improving loop driven by separate specialized prompts.*
1. **Self-Review**: The Agent applies the `qa-plan-review` skill (acting as a critical QA Lead) to grade the draft against the original requirements and highlight missing test cases (e.g., performance edge cases, UI validations).
2. **Refactoring**: The Agent applies the `qa-plan-refactor` skill to amend the Test Plan based on the review feedback. This loop can run 1-2 times until the plan meets a high-quality threshold.

**Phase 4: Publication**
*Finalizing and uploading.*
1. The Agent generates the final markdown artifact.
2. It uses the `confluence` skill (`confluence create` or `confluence update`) to push the finalized QA Plan as a new Confluence page or update an existing one. Publication is idempotent — the agent checks for existing pages before creating.

## 4. Skill & Tool Utilization Plan

> ⚠️ **Important**: All tools below are **CLI-based skills only** — no MCP servers are used for data extraction or publication. See [DESIGN_ENHANCEMENTS.md §1](./DESIGN_ENHANCEMENTS.md#1-tool-landscape-clarification) for full details.

| Skill | CLI Tool | Purpose in the Workflow |
| ----- | -------- | ----------------------- |
| **`jira-cli`** | `jira` | Fetch Jira Epics, Stories, Bugs, Acceptance Criteria, and issue links. |
| **`github`** | `gh` | Pull PR diffs (`gh pr diff`), review changed code lines, assess backend/frontend impacts. |
| **`confluence`** | `confluence` (confluence-cli) | Read design documentation (`confluence read`); Write/Publish the final QA Plan (`confluence create/update`). |
| **`agent-browser`** | `agent-browser` | Headless browser CLI for Figma — navigate, screenshot, extract interactive elements. Supports parallel `--session`. |
| **`browser-use`** | Cloud API | Autonomous cloud browser for complex Figma prototype navigation (alternative to `agent-browser`). |
| **`qa-plan-figma`** | — | Skill template for generating UI/UX test scenarios from Figma designs. |
| **`clawddocs`** | `./scripts/*` | Help the agent understand its own internal documentation rules and structure constraints within OpenClaw. |
| **`tavily-search`** | varies | Search the web for external context, standard testing patterns, or performance testing methodologies. |
| **`qa-plan-architect-orchestrator`** | — | The central orchestration logic/skill instructing the agent on how to piece together gathered contexts. |
| **`qa-plan-review`** | — | QA Lead persona skill used to strictly evaluate the draft plan. |
| **`qa-plan-refactor`** | — | Skill to incorporate changes and fix gaps found during review. |
| **`performance-test-designer`** | — | To generate deep non-functional requirements when performance testing is required. |

## 5. Sub-agents vs. Workflow Decision
**Decision: Hybrid Approach (Workflow Engine + Parallel Sub-agents)**

- **Central Orchestration**: A strictly defined Markdown Workflow (e.g., `workflows/feature-qa-plan.md`) should drive the main Planner Agent. This ensures a predictable, auditable sequence of steps.
- **Sub-agents for Heavy Lifting**:
  - **Browser via `agent-browser`**: Extracting Figma content uses the `agent-browser` CLI in `--session` mode for isolated, parallel browser sessions. For complex prototypes, use `browser-use` cloud API's autonomous task subagent. See [DESIGN_ENHANCEMENTS.md §1.3](./DESIGN_ENHANCEMENTS.md#13-browser-subagent-for-figma--how-it-works).
  - **Review Subagent**: Running self-review as an internal check is good, but delegating the `qa-plan-review` to a fresh subagent context ensures the reviewer isn't biased by the generation phase.

## 6. Progress Tracking & Resilience

- **`task.json`**: A structured JSON file tracks all phases, subtasks, timestamps, and errors. It serves as the checkpoint for crash recovery and the data source for heartbeat reports. See [DESIGN_ENHANCEMENTS.md §3](./DESIGN_ENHANCEMENTS.md#3-progress-monitoring--taskjson--heartbeat).
- **Heartbeat Protocol**: Enhanced `HEARTBEAT.md` reads `task.json` and reports structured progress (phase, subtask count, ETA, stale task detection). See [DESIGN_ENHANCEMENTS.md §3.4](./DESIGN_ENHANCEMENTS.md#34-enhanced-heartbeatmd-protocol).
- **Intermediate Artifacts**: All phases produce intermediate documents (`context/`, `drafts/`, `reviews/`, `changelog.md`) that survive session crashes and provide audit trail. See [DESIGN_ENHANCEMENTS.md §4](./DESIGN_ENHANCEMENTS.md#4-intermediate-documentation-artifacts).
- **Resilience**: Checkpoint recovery, graceful degradation, context budget management, retry with backoff, review circuit breaker, and idempotent publication. See [DESIGN_ENHANCEMENTS.md §5](./DESIGN_ENHANCEMENTS.md#5-resilience--fault-tolerance).

## 7. Execution Steps in OpenClaw

To instantiate this in the OpenClaw workspace:
1. **Create the Entry-point Workflow (`workflows/feature-qa-planning.md`)** to define the exact input parameters and orchestrate the calls.
2. **Develop the Data Extraction Prompts**: Ensure the agent extracts relevant context from Confluence PRDs and GitHub PR diffs without blowing up context window (use selective PR diff fetching with risk classification).
3. **Formalize the Output Scheme**: Map the final markdown output scheme to Confluence's structure via `confluence create` / `confluence update` CLI commands.
4. **Implement `task.json` lifecycle**: Create at workflow start, update at each phase transition, read on heartbeat polls, check on session resumption.
5. **Create helper scripts**: `scripts/retry.sh` for backoff, `scripts/check_resume.sh` for recovery detection.
