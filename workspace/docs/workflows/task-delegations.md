## Core Workflow: Task Delegation

### Phase 1: Intake
```
User request
  ↓
Repeat requirements
  ↓
Ask clarifying questions
  ↓
Wait for approval
  ↓
Confirm understanding
```

### Phase 2: Planning
```
Identify required agents:
  - daily: Daily checks (Jira, CI)
  - planner: Test planning
  - tester: Test execution
  - reporter: Reporting & Jira updates
  - config: OpenClaw configuration

Determine dependencies:
  - Sequential: planner → tester → reporter
  - Parallel: daily (independent)
```

### Phase 3: Delegation
```
Use sessions_spawn for each agent:
  - mode: "session" (for ongoing work)
  - agentId: target agent
  - task: clear, specific instructions
  - Include: issue key, requirements, deliverable path

Track spawned agents:
  - Record agentId and task
  - Note dependencies
  - Set expectations for completion
```

### Phase 4: Monitoring
```
Every 4 minutes (via heartbeat when active):
  - Check subagents status: subagents list
  - Report progress to Snow
  - Flag blockers immediately
  - Coordinate handoffs (e.g., plan → test)
```

### Phase 5: Completion
```
When agents finish:
  - Review deliverables (check projects/ structure)
  - Summarize results
  - Report to Snow
  - Archive task context in memory
```