# Fetch High-Priority Regression / New-Feature Issues

## Purpose

Use this guide to fetch Jira issues for QA reporting when you need:
- High-priority regression issues
- High-priority new-feature issues
- A quick per-project breakdown for the current week

This workspace already stores Jira connection settings in `workspace-planner/.env`.

---

## Prerequisites

Expected variables in `workspace-planner/.env`:
- `JIRA_SERVER`
- `JIRA_EMAIL`
- `JIRA_API_TOKEN`

Example values are already configured locally. Do not copy secrets into docs.

---

## Important Note

Use Jira Cloud REST API v3 search endpoints.

The old v2 search endpoint may return:
- `The requested API has been removed. Please migrate to the /rest/api/3/search/jql API.`

Also note that in this Jira setup, the correct closed-state filter is:
- `status = Done`

not:
- `status = Closed`

---

## Project Scope

Current project keys used for CTC regression/new-feature checks:
- `BCFR` = BI-Framework CTC
- `BCEN` = BI-Engine CTC
- `BCED` = BI-Modeling Editors CTC
- `BCDA` = BI-Dashboards CTC
- `BCVE` = BI-Visualizations CTC
- `BCIN` = BI-Integrations CTC

Base project clause:

```jql
project in (BCFR, BCEN, BCED, BCDA, BCVE, BCIN)
```

---

## Regression Query

### JQL

```jql
project in (BCFR, BCEN, BCED, BCDA, BCVE, BCIN)
AND status = Done
AND resolved >= startOfWeek()
AND "Regression" in ("Found by new feature testing", "Yes")
AND priority = High
```

### Curl Example

```bash
source /Users/vizcitest/Documents/Repository/openclaw-qa-workspace/workspace-planner/.env

curl -s -u "$JIRA_EMAIL:$JIRA_API_TOKEN" \
  -H "Content-Type: application/json" \
  "$JIRA_SERVER/rest/api/3/search/jql?jql=project%20in%20(BCFR%2C%20BCEN%2C%20BCED%2C%20BCDA%2C%20BCVE%2C%20BCIN)%20AND%20status%20%3D%20Done%20AND%20resolved%20%3E%3D%20startOfWeek()%20AND%20%22Regression%22%20in%20(%22Found%20by%20new%20feature%20testing%22%2C%20%22Yes%22)%20AND%20priority%20%3D%20High&maxResults=50&fields=key,summary,priority,project,resolutiondate"
```

### Pretty-Print Result

```bash
source /Users/vizcitest/Documents/Repository/openclaw-qa-workspace/workspace-planner/.env

curl -s -u "$JIRA_EMAIL:$JIRA_API_TOKEN" \
  -H "Content-Type: application/json" \
  "$JIRA_SERVER/rest/api/3/search/jql?jql=project%20in%20(BCFR%2C%20BCEN%2C%20BCED%2C%20BCDA%2C%20BCVE%2C%20BCIN)%20AND%20status%20%3D%20Done%20AND%20resolved%20%3E%3D%20startOfWeek()%20AND%20%22Regression%22%20in%20(%22Found%20by%20new%20feature%20testing%22%2C%20%22Yes%22)%20AND%20priority%20%3D%20High&maxResults=50&fields=key,summary,priority,project,resolutiondate" \
| python3 -c '
import json,sys
payload=json.load(sys.stdin)
issues=payload.get("issues", [])
print(f"Total: {len(issues)}")
print()
for item in issues:
    fields=item["fields"]
    print(f"{item['key']} | {fields.get('project',{}).get('key','')} | {fields.get('summary','')}")
'
```

---

## New-Feature Query

Use the same pattern, but replace the regression condition with the field/value your Jira workflow uses for new-feature classification.

### Template JQL

```jql
project in (BCFR, BCEN, BCED, BCDA, BCVE, BCIN)
AND status = Done
AND resolved >= startOfWeek()
AND priority = High
AND <NEW_FEATURE_FIELD> in (<NEW_FEATURE_VALUES>)
```

### Example Placeholder

```jql
project in (BCFR, BCEN, BCED, BCDA, BCVE, BCIN)
AND status = Done
AND resolved >= startOfWeek()
AND priority = High
AND "Found by new feature testing" = Yes
```

Use this only if the Jira field really exists with that exact name/value in your instance. If unsure, inspect a known issue first.

---

## Useful Variants

### Include both High and Highest

```jql
project in (BCFR, BCEN, BCED, BCDA, BCVE, BCIN)
AND status = Done
AND resolved >= startOfWeek()
AND "Regression" in ("Found by new feature testing", "Yes")
AND priority in (High, Highest)
```

### Remove priority filter

```jql
project in (BCFR, BCEN, BCED, BCDA, BCVE, BCIN)
AND status = Done
AND resolved >= startOfWeek()
AND "Regression" in ("Found by new feature testing", "Yes")
```

### Group manually by project after fetch

```bash
source /Users/vizcitest/Documents/Repository/openclaw-qa-workspace/workspace-planner/.env

curl -s -u "$JIRA_EMAIL:$JIRA_API_TOKEN" \
  -H "Content-Type: application/json" \
  "$JIRA_SERVER/rest/api/3/search/jql?jql=project%20in%20(BCFR%2C%20BCEN%2C%20BCED%2C%20BCDA%2C%20BCVE%2C%20BCIN)%20AND%20status%20%3D%20Done%20AND%20resolved%20%3E%3D%20startOfWeek()%20AND%20%22Regression%22%20in%20(%22Found%20by%20new%20feature%20testing%22%2C%20%22Yes%22)%20AND%20priority%20%3D%20High&maxResults=100&fields=key,project" \
| python3 -c '
import json,sys,collections
payload=json.load(sys.stdin)
counter=collections.Counter()
for item in payload.get("issues", []):
    project=item["fields"].get("project", {}).get("key", "UNKNOWN")
    counter[project]+=1
for key,count in sorted(counter.items()):
    print(f"{key}: {count}")
'
```

---

## Known Findings From This Workspace

From the recent check in this workspace:
- `status = Done` is required
- Jira REST API v3 search endpoint works
- `priority = High` returned matching issues successfully
- The previous zero-result check was caused by using the removed v2 API endpoint

---

## Recommendation

For repeatable reporting, standardize on:
1. Load env from `workspace-planner/.env`
2. Query via `/rest/api/3/search/jql`
3. Use `status = Done`
4. Add `priority = High` or `priority in (High, Highest)` depending on report scope
5. Pretty-print with a small `python3` formatter for human review
