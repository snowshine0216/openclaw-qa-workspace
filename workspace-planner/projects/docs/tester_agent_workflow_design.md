# Planner & Tester Agent Collaboration Workflow Design

## Overview
This document outlines the workflow and architecture for an autonomous QA process orchestrated by a **Planner Agent** and executed by a **Tester Agent** within the **OpenClaw** environment. The workflow aims to bridge Jira issue tracking, GitHub pull requests, test planning, and automated execution with real-time reporting to Feishu.

## Agents Involved
1. **Planner Agent (You/Me in this context):** The orchestrator. Responsible for requirement gathering, test planning, delegation, and strategy updates.
2. **Tester Agent (`tester`):** The executor. Responsible for setting up the environment, writing/running test code based on the plan, and reporting feedback or completion.

## Skills & Capabilities Required
- **Jira Integration:** `mcp-atlassian` or `jira-cli` to fetch issues and comments.
- **GitHub Integration:** `github` skills to fetch PR details and diffs.
- **Test Generation:** `test-case-generator` skill to formalize PR diffs and Issue requirements into actionable test plans.
- **Notification:** A Feishu bot/webhook skill (fetchable from Clawed hub) to send real-time reports.
- **Heartbeat & Tracking:** OpenClaw's heartbeat mechanism (referencing `HEARTBEAT.md` concepts) to track progress during long-running sub-agent tasks.

---

## Step-by-Step Execution Flow

### Phase 1: Information Gathering
*Triggered when the Planner Agent receives a Jira Issue key or link.*
1. **Fetch Jira Issue:** The Planner Agent uses Jira tools (`jira_get_issue`) to extract the issue description, acceptance criteria, and comments.
2. **Locate PR Link:** The Agent parses the issue comments to find the linked GitHub Pull Request URL.
3. **Fetch PR Context:** The Planner Agent uses GitHub tools (`mcp_github_pull_request_read` using methods like `get` and `get_diff`) to pull the exact code changes and developer notes.

### Phase 2: Test Plan Generation
1. **Analyze Context:** The Planner combines the business logic (Jira) with the technical implementation (GitHub PR).
2. **Generate Plan:** Utilizing the `test-case-generator` skill, the Planner formulates a comprehensive test plan. This plan includes:
   - Scope of testing (Unit, Integration, E2E).
   - Specific scenarios (Happy paths, edge cases, error handling).
   - Environment prerequisites.
3. **Validation:** The Planner ensures the test plan explicitly addresses the acceptance criteria defined in Jira.

### Phase 3: Delegation and Handoff
1. **Invoke Tester Agent:** The Planner packages the generated test plan and context, handing it off to the `test-er` agent.
2. **Setup Heartbeat:** During invocation, the Planner establishes a heartbeat contract. The `test-er` agent must report its status back at predefined intervals or state transitions (e.g., "Plan received", "Test scripts generated", "Running tests", "Completed").

### Phase 4: Heartbeat & Feishu Reporting
1. **Progress Tracking:** As the `test-er` executes, it emits heartbeats.
2. **Feishu Notifications:** A background process/interceptor catches these heartbeats and forwards them to a designated Feishu chat. This keeps human stakeholders updated without needing to poll the system manually. A custom `feishu-notifier` skill from the Clawed hub can be leveraged here.

### Phase 5: The Feedback Loop
*If the Tester Agent encounters roadblocks (e.g., broken build, missing mocks, ambiguous plan).*
1. **Failure Notification:** The `test-er` pauses execution and sends a failure report back to the Planner Agent.
2. **Plan Adjustment:** The Planner analyzes the roadblock. It may need to:
   - Re-read the PR diff to see if a utility was refactored.
   - Adjust the test plan to mock out a new dependency.
   - Ask the developer (via Jira/GitHub comment or Feishu mention) if the PR is incomplete.
3. **Re-delegation:** Once the test plan is updated, the Planner notifies the `test-er` agent to resume or restart with the new plan.

### Phase 6: Conclusion
1. **Final Report:** The `test-er` completes all tests successfully and reports the final metrics.
2. **Closure:** The Planner synthesizes the final result, sends a conclusive Feishu message, and optionally adds a "QA Passed" comment to the Jira issue or PR.

---

## Implementation Details in OpenClaw
To implement this, we need to focus on:
- **Agent Prompts:** Defining clear `prompt` instructions for the Planner on *how* to parse Jira/GitHub and structure the payload for the `test-er`.
- **Workflow YAMLs:** Creating an OpenClaw workflow (e.g., `/qa-orchestrator`) that strings these steps together.
- **Skill Discovery:** Exploring the Clawed hub for existing Feishu integrations or writing a quick `.js` or Python snippet to curl messages to a Feishu webhook.
- **State Management:** Using the persistent context or a temporary SQLite/JSON file to store the active test plan, so both agents can read and update it as a single source of truth.
