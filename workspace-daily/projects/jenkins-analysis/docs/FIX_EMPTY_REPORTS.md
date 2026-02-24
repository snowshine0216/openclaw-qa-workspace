# Analyzer Fix: Use specific triggered build numbers, not lastBuild

## Problem
The analyzer checks `lastBuild` for status, but when a new build is triggered while checking, `lastBuild` changes to a build that's still running (result: null).

Example:
- Parent build #1242 triggers `LibraryWeb_Report_MultiJob #662` (FAILURE)
- While analyzer runs, build #664 starts
- Analyzer checks `lastBuild` → gets #664 (result: null) → no status logged

## Solution
Parse console log to get the **specific build number** triggered by the parent:

```bash
# OLD (broken):
DOWNSTREAM_JOBS=$(curl ... | jq -r '.downstreamProjects[]?.name')
# Then later: curl .../job/$job_name/lastBuild/...  ❌ Wrong build!

# NEW (fixed):
# Extract "Starting building: JobName #123" from console
DOWNSTREAM_BUILDS=$(curl .../consoleText | grep 'Starting building:' | 
  sed 's/Starting building: \(.*\) #\([0-9]*\)/{"name":"\1","number":\2}/')
# Then: curl .../job/$job_name/$build_number/...  ✅ Correct build!
```

## Implementation

Update Step 4 in analyzer.sh to parse triggered builds with numbers.
Update Step 5 to use the specific build number when checking status.

---

_Fix documented 2026-02-24 09:56_
