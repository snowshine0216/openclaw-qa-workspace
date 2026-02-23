# Agent Coordination Patterns

This document defines the standard workflows and coordination patterns for the Atlas QA multi-agent system. The Master Orchestrator references these standard operating procedures when delegating execution paths.

## 1. Sequential Workflow (Feature Testing)

The standard sequential workflow for feature QA is **Test Planning → Execution → Reporting**.

**Orchestration Steps:**
1. Master spawns `planner` providing the user's feature requirements or issue key.
2. *Wait for completion:* `planner` analyzes requirements and generates a formal test plan within `projects/test-plans/`.
3. Master spawns `tester` explicitly referencing the path of the newly created test plan.
4. *Wait for completion:* `tester` executes UI/functional automation scripts and generates an execution report in `projects/test-reports/` (with artifacts saved to `projects/screenshots/`).
5. Master spawns `reporter` providing the paths to the execution results and artifacts.
6. *Wait for completion:* `reporter` synthesizes any failures, files structured bug tickets in Jira, and links them to the parent issue.
7. Master collects the `reporter`'s summary and presents the final QA state to the user.

## 2. Parallel Workflow (Daily Checks)

For broad health checks (e.g., Jira triage, CI/CD monitoring), tasks are dispatched concurrently as they have no interdependent blockers.

**Orchestration Steps:**
1. Master spawns `daily` executing task: "Perform Jira Triage Checks"
2. Concurrently, Master spawns a second thread of `daily` executing task: "Perform CI Pipeline Checks"
3. Both processes fetch independent external state.
4. Master awaits completion signals from both instances.
5. Master fuses both data streams into a single morning summary for the user.

## 3. Configuration Management

Configuration and framework updates should follow an isolated upgrade path to avoid disruption.

**Orchestration Steps:**
1. Master spawns `config`. 
2. Supply specific context on what parameter or integration needs upgrading (e.g., adjusting Feishu webhook URLs, adding new Jira query scopes).
3. The `config` agent utilizes the native `clawddocs` skill to pull official infrastructure documentation.
4. The `config` agent evaluates and applies the update.
5. Master reviews the configuration delta before terminating the workflow.
