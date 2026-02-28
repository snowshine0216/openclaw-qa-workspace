# Test Case Generation Design (Planner Agent)

## Overview

This document outlines the architecture, logic, and workflows for the Planner Agent's test case generation capabilities. As specified in the `TESTER_AUTOMATION_DESIGN.md`, the Planner Agent operates as the "Test Generator". Its responsibility is to systematically generate detailed, Playwright-compatible Test Cases in Markdown (`.md`) format for the Tester Agent to consume.

This design supports two primary operational scenarios based on the availability of a pre-existing QA Plan.

---

## Scenario 1: Generating Test Cases from an Existing QA Plan

**Trigger**: A validated QA Plan already exists for a target feature (e.g., located in `projects/testcase-plan/<feature-id>/`). 

### Workflow Steps:

1. **Pre-requisite Confirmation (Interactive Step)**:
   Before generating test case steps, the Planner Agent MUST pause and confirm necessary execution constraints with the user. The agent will prompt the user to provide or confirm:
   - **Test Objects:** The specific pages, components, or user flows to be tested.
   - **User Information:** The specific user accounts, credentials, and roles required to execute the test.
   - **Environment Data:** The target environment (e.g., staging URL, production URL) and any required configuration flags.
   - **Mock Data:** Any API mocks, database seeds, or stubbed services needed for the test to run idempotently.

2. **Context Discovery (Optional/As Needed)**:
   If the existing QA plan or the provided environment details lack sufficient UI context (e.g., exact locators or navigation paths), the agent may manually browse the target website using browser tools to verify assumptions and DOM structures.

3. **Markdown Generation**:
   Using the `test-case-generator` skill, the Planner reads the QA plan and synthesizes detailed, step-by-step test instructions. 
   - **Constraint:** The output must be strictly formatted in Markdown (`.md`).
   - **Output Location:** The generated files are saved into `projects/testcase-plan/<feature-id>/` (or `specs/<feature>/`), making them immediately readable by both humans and the Tester Agent.

---

## Scenario 2: End-to-End QA Plan & Test Case Generation

**Trigger**: The user provides a target website URL and a specific overarching "mission" (e.g., "Verify the complete user checkout flow"), but no QA Plan currently exists.

### Workflow Steps:

1. **QA Plan Creation (`qa-plan` workflow)**:
   The Planner Agent first invokes the standard `qa-plan` workflow.
   - **Clawddocs Integration:** During this phase, the agent **MUST leverage `clawddocs` skills** to fetch relevant contextual docs, API references, version tracking, and configuration snippets. This ensures the generated QA Plan aligns perfectly with the application's documented architecture and expected behaviors.
   - The agent analyzes the website (via browser tools) and the mission to draft a comprehensive QA plan.

2. **Plan Finalization**:
   The newly created QA Plan is saved to the workspace and implicitly presented for readiness.

3. **Transition to Test Case Generation**:
   Once the QA Plan is created and established, the Planner Agent seamlessly transitions into the workflow defined in **Scenario 1**. 
   - It will proceed to confirm test objects, users, environments, and mocks with the user.
   - Finally, it generates the detailed Markdown test cases for the Tester Agent.

---

## Required Skill Updates

To fully support these scenarios, the following updates are required for the Planner Agent's skill set:

1. **`test-case-generator` Skill Update:**
   - Must enforce Markdown (`.md`) output format.
   - Must include a mandatory step to prompt the user for Environment, Mock, and User context *before* outputting the `.md` file.

2. **`qa-plan` Workflow / Skill Integration:**
   - Explicitly integrate the `clawddocs` skill lookup step into the early phases of the QA planning process to enrich the context.
