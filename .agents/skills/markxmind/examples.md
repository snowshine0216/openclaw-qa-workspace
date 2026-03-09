# XMindMark Examples

## Generic Examples

### Simple Hierarchy

```
Project Alpha

- Requirements
    * Functional specs
    * Non-functional specs
- Design
    * Architecture
    * UI mockups
- Implementation
    * Backend
    * Frontend
- Testing
    * Unit tests
    * Integration tests
```

### Relationships Between Branches

```
Feature Release

- Backend API [1]
    * REST endpoints
    * Auth layer
- Frontend [^1](Consumes API)
    * Dashboard
    * Settings
- Documentation [^1](API docs)
```

### Boundaries Grouping Topics

```
Sprint Planning

- Must Have [B1]
    * User login [B1]
    * Core workflow [B1]
[B1]: P0
- Nice to Have [B2]
    * Analytics [B2]
    * Export [B2]
[B2]: P1
```

### Summaries with Sub-topics

```
Quarterly Goals

* Q1 Deliverables [S]
* Q2 Deliverables [S]
* Q3 Deliverables [S]
[S]: 2025 Roadmap
    - Review monthly
    - Adjust based on feedback
```

### Combined: Boundaries + Relationships + Summaries

```
Product Strategy

- Market Research [1]
    * Competitor analysis
    * User interviews
- Product Vision [^1](Informs) [B1]
    * North star [B1]
    * OKRs [B1]
[B1]: Strategic Pillars
- Execution [S1]
    * Roadmap [S1]
    * Metrics [S1]
[S1]: Delivery
    - Track weekly
```

## QA Planning Examples

### QA Plan Structure (Feature Coverage)

```
BCIN-6709 Feature QA Plan

- Functional - Core
    * Primary user flow
    * State transitions
    * Boundary conditions
- Functional - Error Handling
    * API failures
    * Validation errors
    * Recovery paths
- UI - Messaging
    * Success messages
    * Error messages
    * Loading states
- Platform
    * Browser compatibility
    * Responsive layout
- E2E
    * Happy path
    * Error recovery flow
```

### Test Case Outline

```
Test: Pause Mode Resume

- Preconditions
    * User logged in
    * Session in progress
- Steps
    * Pause the session
    * Wait 30 seconds
    * Click Resume
- Expected
    * Session resumes from same state
    * No data loss
- Edge Cases
    * Network disconnect during pause
    * Browser tab closed and reopened
```

### Coverage Domains Mind Map

```
Feature Coverage Domains

- Required [B1]
    * Primary functional behavior [B1]
    * Error handling / recovery [B1]
    * State transition / continuity [B1]
    * User-visible messaging [B1]
    * Cross-flow interactions [B1]
    * Compatibility / scope guard [B1]
[B1]: Must consider
- Optional [B2]
    * Input validation [B2]
    * Privilege / role [B2]
    * Configuration variations [B2]
    * Accessibility [B2]
[B2]: When relevant
```
