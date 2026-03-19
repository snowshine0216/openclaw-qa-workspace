# QA Agent Architecture Design

## 1. Overview
This document outlines the high-level architecture and design of the OpenClaw-based QA Agent ecosystem. The system leverages the **OpenClaw** framework along with **GitHub Copilot models** (primarily **Sonnet-4.5**) to automate the entire QA lifecycle—from monitoring and planning to execution, healing, and reporting. The architecture delegates specific, bounded responsibilities across a suite of specialized agents to ensure a decoupled, scalable, and idempotent workflow.

> **🔮 Future Phase — Agent Evaluation Cycle:** A closed-loop agent self-evaluation cycle is planned as a future phase. This cycle will periodically assess agent output quality, test coverage gaps, prompt effectiveness, and overall system accuracy. It is **not yet started** and will be incorporated once the core five-agent ecosystem is stable.

## 2. Technology Stack & Foundation
- **Core Framework:** OpenClaw Agent Framework
- **Primary AI Model:** Sonnet-4.5 (via GitHub Copilot models)
- **Browser Automation:** Playwright (`playwright-cli` exclusively for test execution, script generation, and debugging/healing)
- **Task Scheduling & Triggering:** `pm2` is used as the daemon manager for persistent jobs, and CI jobs trigger events via webhooks. Cron Jobs handle polling for Jira and defect statuses.
- **Issue Tracking & Wiki:** Atlassian Jira & Confluence (accessed via `jira-cli` and `confluence` skills)
- **Source Control:** GitHub (for committing test scripts, POM heals, and PR generation)
- **Messaging:** Feishu (for notifications and status updates)

---

## 3. The 5-Agent Ecosystem
The overall design divides the QA lifecycle into five distinct agents, each strictly adhering to a single core domain. **The Tester Agent currently acts as the Master in the orchestration flow.**

### 3.1. Orchestrator (The Central Controller)
- **Role:** Central router and state manager.
- **Responsibility:** Receives events and triggers from the Daily Agent (or manual invocations) and coordinates the execution loop. It decides which sub-agent to wake up next (e.g., routing planning tasks to Planner, execution to Tester).

### 3.2. Daily Agent (The Monitor)
- **Role:** Proactive monitoring and trigger generation.
- **Workspace:** `workspace-daily`
- **Responsibility:** Acts as the eyes and ears of the system, running as a daemon via `pm2`.
- **Core Tasks:**
  1. **Monitor CI Failures:** Listens for pipeline failures via **Webhooks** (triggered by CI jobs) and extracts failure context.
  2. **Monitor Jira Tickets:** Runs via **Cron Job** to poll Jira for tickets transitioning to "Ready for QA" (or similar states).
  3. **Monitor Feature Defects Status:** Runs via **Cron Job** to track the status of existing defects linked to features under test.

### 3.3. Planner Agent (The Test Generator)
- **Role:** Requirement analyzer and test case generator.
- **Workspace:** `workspace-planner`
- **Responsibility:** Understands Jira requirements, Figma designs, and existing documentation.
- **Core Tasks:** Systematically generates high-level qa plan and detailed, step-by-step test plans in **Markdown (`.md`) format** (stored in `projects/testcase-plan/<feature-id>/` or `specs/<feature>/`), optimized for Tester Agent consumption.

### 3.4. Tester Agent (The Executor, Healer, & Master)
- **Role:** Automation code translator, runner, self-healer, migration executor, and Master agent.
- **Workspace:** `workspace-tester`
- **Responsibility:** Acts as the master agent orchestrating the core testing loops. Leverages migration MCPs to handle WDIO to Playwright script transitions.
- **Core Tasks:**
  - Uses `playwright-cli` to generate and run `.spec.ts` scripts using semantic locators.
  - Automatically heals brittle scripts or broken Page Object Models (POMs) due to UI drift, verifying fixes and raising GitHub PRs.
  - Distinguishes between automation flakes and application bugs, handing off true defects to the Reporter.
  - Executes WDIO to Playwright migration tasks utilizing `migration` MCPs.

### 3.5. Reporter Agent (The Communicator)
- **Role:** Documentation and issue tracker liaison.
- **Workspace:** `workspace-reporter`
- **Responsibility:** Bridges test results with human-readable tracking tools.
- **Core Tasks:** Uses `bug-report-formatter` to package defect evidence (Playwright screenshots/traces) and files verified bugs into Jira. It also synthesizes defect analysis and updates the overarching QA Summaries on Confluence.

---

## 4. Main Workflows by Scenario
The system operates across several distinct scenarios, varying from automated daily checks to manual invocations:

### 4.1. Scenario 1: Daily - Automation Failure
*(Currently documented primarily in `TESTER_AUTOMATION_DESIGN.md`)*
1. **Trigger:** A CI job fails; webhook notifies the Daily Agent (running via `pm2`).
2. **Investigation:** Daily Agent passes context to the Orchestrator/Tester (Master).
3. **Execution/Healing:** Tester Agent investigates the Playwright failure. If it's a locator drift, it auto-heals and raises a PR. If it's an application bug, it extracts logs.
4. **Reporting:** Tester hands off to Reporter Agent to log the defect in Jira.

### 4.2. Scenario 2: Daily - Feature Defects Status Monitor
1. **Trigger:** `pm2` daemon cron job polls Jira for updates on existing logged defects.
2. **Analysis:** Daily Agent identifies status changes (e.g., "Fixed", "Won't Fix") and updates the Orchestrator.
3. **Synthesis:** Reporter Agent is invoked to update the defect analysis documents and Confluence QA Summaries for the corresponding features.

### 4.3. Scenario 3: Daily - Defects Assigned (Full Lifecycle)
1. **Trigger:** Jira ticket transitions to "Ready for QA" or a defect is assigned. Daily Agent catches this via cron job.
2. **Planning Phase:** Orchestrator invokes Planner Agent to review the defect/feature and draft/update the QA Plan.
3. **Execution Phase:** Orchestrator/Master invokes the Tester Agent to write/run or heal the related Playwright scripts.
4. **Reporting Phase:** Tester hands results to Reporter Agent, which updates Jira and Confluence based on the run outcome.

### 4.4. Scenario 4: Manual - Invoke Planner (QA Plan Phase)
1. **Trigger:** A user manually triggers the workflow targeting the Planning phase.
2. **Execution:** The Orchestrator bypasses Daily monitoring and directly invokes the Planner Agent.
3. **Action:** The Planner Agent generates the high-level QA plan and detailed Markdown test steps for a specified feature/Jira ticket.

### 4.5. Scenario 5: Manual - Invoke Reporter (QA Summary Phase)
1. **Trigger:** A user manually triggers the workflow targeting the Summary/Reporting phase.
2. **Execution:** The Orchestrator directly invokes the Reporter Agent.
3. **Action:** The Reporter Agent aggregates existing test results, defect details, and QA plans to synthesize and publish the final QA Summary to Confluence.

### 4.6. Scenario 6: Agent Evaluation Cycle *(🔮 Not Yet Started — Future Phase)*
> This scenario is **planned** but has not been started. It will be incorporated into the architecture after the core lifecycle (Scenarios 1–5) is stable.
1. **Trigger:** Scheduled cadence (e.g., weekly cron) or manual invocation after a sprint cycle completes.
2. **Collection:** Orchestrator gathers structured outputs from all agents — QA plans, test run results, defect reports, Confluence summaries, and script heal logs.
3. **Evaluation:** A dedicated evaluation pass (via AI model) scores each agent across configurable dimensions:
   - **Planner:** Requirement coverage, test case relevance, false-positive rate in plans.
   - **Tester:** Script stability, heal success rate, false-bug noise ratio.
   - **Reporter:** Report accuracy, Jira/Confluence update completeness, timeliness.
   - **Daily:** Trigger fatigue, missed event rate, cron reliability.
4. **Feedback Loop:** Evaluation findings are written back as structured improvement notes, surfaced as Feishu notifications or Confluence evaluation reports, and used to tune agent prompts/skills in the next cycle.

---

## 5. Implementation Progress & Roadmap

| Capability / Task | Owner Agent | Trigger Mechanism | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Monitor CI Failures** | Daily | Webhook (pm2/CI) | In Progress | Hooking into CI pipeline for Playwright/Automation failures |
| **Monitor Jira Tickets** | Daily | Cron Job (pm2) | In Progress | Polling Jira for features "Ready for QA" |
| **Monitor Feature Defects Status** | Daily | Cron Job (pm2) | In Progress | Tracking defect lifecycles for ongoing QA analysis |
| **Draft QA Plan** | Planner | Orchestrator | On-Going | Refining step-by-step markdown plan generation and idempotency |
| **Draft Defects Analysis** | Reporter / Planner | Orchestrator | On-Going | Parsing defect severity, risk, and feature impact |
| **Draft QA Summary** | Reporter | Orchestrator | On-Going | Currently running in block with WDIO script migration |
| **WDIO -> Playwright Integration** | Tester (Master) | Pipeline/MCP | Planned | Later phase: integrating migrated scripts into full autonomous loop |
| **Agent Evaluation Cycle** | Orchestrator / All | Scheduled Cron / Manual | Not Started | 🔮 Future phase: periodic self-evaluation of agent output quality, coverage gaps, and prompt effectiveness; feeds improvement loop |

---

## 6. Open Questions & Clarifications Needed

Before finalizing the integration, the following points need clarification:

1. **WDIO Migration Edge Cases:** For the current "draft QA summary" task that is running alongside the WDIO migration, does the Reporter agent need to analyze the legacy WDIO source code, or is it strictly operating off the newly generated Playwright results to build the summary?
2. **Orchestrator Setup vs Tester Master:** Since the Tester is running as "Master", does it completely replace the standalone Orchestrator workspace, or are they co-dependent for the Daily polling handoffs?
