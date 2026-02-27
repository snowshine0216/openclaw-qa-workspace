---
name: performance-test-designer
description: Design performance test scenarios including load, stress, spike, and endurance tests. Generate test specs, metrics definitions, and monitoring checkpoints. Use when planning performance tests for features or MicroStrategy dashboards.
homepage: https://github.com/naodeng/awesome-qa-prompt
metadata: {"clawdbot":{"emoji":"⚡","requires":{"bins":["node"]}}}
---

# Performance Test Designer Skill

Design comprehensive performance tests for features, APIs, and MicroStrategy dashboards.

## Performance Test Types

| Type | Purpose | Scenarios |
|------|---------|-----------|
| **Load Test** | Normal expected load | 1x, 2x, 5x peak users |
| **Stress Test** | Beyond normal capacity | Find breaking point |
| **Spike Test** | Sudden traffic bursts | Instant 10x → 1x |
| **Endurance Test** | Long-term stability | 24hr sustained load |

## Design Process

### 1. Define Objectives

**Questions to answer:**
- What are the performance requirements? (RPS, latency, concurrency)
- What is the target environment? (Staging/Prod-like)
- What metrics matter most? (Response time, throughput, error rate)

### 2. Identify Critical Paths

**For MicroStrategy Dashboards:**
- Report load time (target: <3s)
- Filter application time (target: <1s)
- Concurrent user limit before degradation
- Large dataset query performance

**For APIs:**
- Endpoint response time (p95, p99)
- Database query performance
- Cache hit ratios
- Connection pool exhaustion

### 3. Generate Test Scenarios

```javascript
// Example: Dashboard Load Test Spec
{
  "testType": "load",
  "target": "MicroStrategy Dashboard",
  "users": [10, 25, 50, 100],
  "rampUp": "2min per level",
  "duration": "10min per level",
  "metrics": {
    "responseTime": { "p95": 3000, "p99": 5000 },
    "throughput": { "targetRPS": 50 },
    "errorRate": { "max": 0.01 }
  },
  "checkpoints": [
    "Dashboard loads within 3s at 50 users",
    "Filter application < 1s",
    "No memory leaks over 10min",
    "Error rate < 1%"
  ]
}
```

## Metrics Definitions

### Response Time Targets

| Scenario | Acceptable | Degraded | Unacceptable |
|----------|-----------|----------|--------------|
| Dashboard load | < 3s | 3-5s | > 5s |
| Filter/filter | < 1s | 1-2s | > 2s |
| Report export | < 10s | 10-30s | > 30s |
| API endpoint | < 200ms | 200-500ms | > 500ms |

### Throughput Targets

- **Peak users**: Expected max concurrent
- **RPS**: Requests per second at peak
- **Throughput**: Data transfer rate (MB/s)

### Error Rate Thresholds

- **Green**: < 0.1% errors
- **Yellow**: 0.1% - 1% errors
- **Red**: > 1% errors

## Test Execution Checklist

### Pre-Test
- [ ] Environment matches production
- [ ] Monitoring enabled (CPU, memory, network)
- [ ] Baseline metrics captured
- [ ] Test data prepared

### During Test
- [ ] Ramp up gradually
- [ ] Monitor resource usage
- [ ] Capture screenshots at checkpoints
- [ ] Log all errors

### Post-Test
- [ ] Document breaking point
- [ ] Compare with baseline
- [ ] Identify bottlenecks
- [ ] Provide recommendations

## MicroStrategy-Specific Tests

### Dashboard Performance
```json
{
  "scenario": "Dashboard Load",
  "steps": [
    { "action": "login", "users": 100, "rampUp": "2min" },
    { "action": "navigate_dashboard", "target": "Sales Dashboard" },
    { "action": "apply_filter", "filter": "Region=APAC" },
    { "action": "export_pdf" }
  ],
  "successCriteria": {
    "dashboardLoadTime": "< 5s",
    "filterTime": "< 2s",
    "concurrentUsers": 50
  }
}
```

### Report Execution
- Large dataset queries (> 1M rows)
- Complex visualizations
- Real-time data refresh
- Multi-tab exports

## Output Template

```markdown
# Performance Test Plan: [Feature Name]

## Test Objectives
- Verify [requirement] under [X] concurrent users
- Identify breaking point
- Document performance regression

## Test Scenarios

### Scenario 1: [Name]
- **Type**: Load/Stress/Spike/Endurance
- **Users**: [X] concurrent
- **Duration**: [Y] minutes
- **Ramp Up**: [Z] minutes

### Checkpoints
1. [Checkpoint 1]
2. [Checkpoint 2]

## Metrics
| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| p95 Latency | < 3s | | |
| Throughput | > 50 RPS | | |
| Error Rate | < 0.1% | | |

## Recommendations
- [Recommendation 1]
- [Recommendation 2]
```

## Integration Points

- **qa-daily-workflow**: Use in daily planning for perf tests
- **microstrategy-testing**: Execute tests with screenshots
- **jira-cli**: Log performance bugs
