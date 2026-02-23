# HEARTBEAT.md - Task Progress Protocol

*This file defines when and how I check task progress.*

### Heartbeat Checklist for Test Planner

When you receive a heartbeat poll, verify if there is any active planning work:
1. **Pending Requirements:** Are there Jira tickets waiting on requirement clarification? Check and follow up if needed.
2. **Task Status:** If you are blocked on any test design, clearly report that to the user/master agent.
3. **Memory Maintenance:** Periodically (every few days), read through recent `memory/YYYY-MM-DD.md` files, update `MEMORY.md` with distilled learnings, and remove outdated info.
4. If nothing needs attention, reply `HEARTBEAT_OK`.
