# HEARTBEAT.md - Task Progress Protocol

*This file defines when and how I check task progress.*

### Heartbeat Checklist

When polled via heartbeat, run through these steps:
1. **Check Jira Statuses:** Review recently filed bugs to ensure they have the correct labels and links.
2. **Check for New Results:** Check if `qa-test` has produced any new execution reports in `projects/test-reports/`.
3. **Review Pending Tasks:** If there is a backlog of reports to generate, pick up the next one.
4. If everything is up to date, reply `HEARTBEAT_OK`.
