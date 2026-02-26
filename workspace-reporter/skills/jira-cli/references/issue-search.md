# Jira CLI: Defect Analysis Context

Use this reference when running defect analysis (defect-analysis workflow Phase 1). These notes address credential loading, dynamic project discovery, and cross-project defect discovery.

---

## Credential Loading

**CRITICAL: Always load credentials from workspace .env file**

When running jira-cli commands for defect analysis, ALWAYS source credentials from the workspace .env:

```bash
cd /path/to/workspace-reporter
export JIRA_API_TOKEN="$(grep JIRA_API_TOKEN .env | cut -d= -f2-)"
export JIRA_SERVER="https://strategyagile.atlassian.net"
export JIRA_EMAIL="$(grep JIRA_EMAIL .env | cut -d= -f2-)"
jira issue view ISSUE-KEY
```

**Why:** System `~/.bash_profile` or global config may not have the current token. The workspace `.env` file contains the working credentials (`JIRA_SERVER`, `JIRA_EMAIL`, `JIRA_API_TOKEN`).

---

## Dynamic Project Discovery (Phase 0b)

**CRITICAL: Never hardcode the project list — fetch it dynamically to avoid missing projects.**

Run once per session (or when cache is stale > 24h) before any cross-project JQL:

```bash
CACHE_FILE="projects/defects-analysis/.cache/project_keys.txt"
CACHE_JSON="projects/defects-analysis/.cache/jira_projects.json"

if [ -f "$CACHE_FILE" ] && [ $(( $(date +%s) - $(date -r "$CACHE_FILE" +%s) )) -lt 86400 ]; then
  echo "✅ Using cached project list (< 24h old)"
else
  mkdir -p projects/defects-analysis/.cache
  scripts/retry.sh 3 2 jira project list --format json > "$CACHE_JSON"
  jq -r '.[].key' "$CACHE_JSON" > "$CACHE_FILE"
  echo "✅ Cached $(wc -l < "$CACHE_FILE") projects"
fi
```

Then load the keys for use in JQL:

```bash
PROJECT_KEYS=$(cat projects/defects-analysis/.cache/project_keys.txt | tr '\n' ',' | sed 's/,$//')
```

**Cache location:** `projects/defects-analysis/.cache/` — shared across all analyses, should be gitignored.

**Force refresh:** Delete `project_keys.txt` to trigger a re-fetch on next run.

---

## Cross-Project Linked Issues

**CRITICAL: `linkedIssues()` does not work across Jira projects**

Features often have defects filed in different projects (e.g., BCED=Backend, CIAD=i18n, CGWS=WebStation, CGAD=Admin). The standard JQL fails:

```bash
# ❌ FAILS: Returns "No result found" when defects are in other projects
jira issue list --jql 'issuetype = Defect AND (parent="BCED-4198" OR issue in linkedIssues("BCED-4198"))'
```

**Solution:** Search across all projects using the dynamically fetched project list:

```bash
# ✅ WORKS: Uses all projects from Phase 0b cache
PROJECT_KEYS=$(cat projects/defects-analysis/.cache/project_keys.txt | tr '\n' ',' | sed 's/,$//')

jira issue list \
  --jql "project in ($PROJECT_KEYS) AND issuetype = Defect AND (parent=\"BCED-4198\" OR text ~ \"BCED-4198\")" \
  --format json --paginate 50
```

**Why dynamic over hardcoded:** A hardcoded list (e.g., `BCED, CIAD, CGWS, CGAD`) silently misses defects when new projects are added to the org. Fetching the full list at runtime ensures complete coverage.

**Limitation:** `linkedIssues()` and `issueFunction` are unreliable in jira-cli across projects. Always use project-scoped + text search when analyzing cross-project features.
