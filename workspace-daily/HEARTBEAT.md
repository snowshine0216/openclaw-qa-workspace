# HEARTBEAT.md - QA Daily Check Agent

**Proactive daily monitoring checklist.**

Run this check once per day (typically 09:00 Asia/Shanghai).

## Check Sequence

### 1. Jira Check (5 min)
- Fetch issues: status "Ready for Testing", "Fixed", "Resolved"
- Check blockers: priority "Blocker", "Critical"
- Export to: `projects/jira-exports/YYYY-MM-DD.json`

### 2. CI/Jenkins Check (5 min)
*(Setup later - placeholder for now)*
- Fetch recent build results
- Identify failing jobs
- Check for flaky tests
- Export to: `projects/ci-reports/YYYY-MM-DD.json`

### 3. Generate Summary (2 min)
- Aggregate findings
- Highlight urgent items
- Save to: `projects/test-reports/daily/YYYY-MM-DD.md`

### 4. Report (1 min)
- Send summary to master agent or Snow
- Include issue keys and priorities

## Response Protocol

**If issues found:** Report them (don't say HEARTBEAT_OK)

**If no issues:** Reply `HEARTBEAT_OK`

## Timing

- **Daily:** 09:00 Asia/Shanghai (via cron, setup later)
- **Manual trigger:** When master agent requests daily check

---

_Keep it short. This runs daily._
