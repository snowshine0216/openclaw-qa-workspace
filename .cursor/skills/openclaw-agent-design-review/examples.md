# OpenClaw Agent Design Review - Examples

## Example Markdown Report

```markdown
# Agent Design Review Report

- Design ID: AGENT-DESIGN-001
- Status: fail
- Reviewed At (UTC): 2026-03-03T16:00:00Z

## Severity Summary
- P0: 1
- P1: 2
- P2: 1

## Required Fixes
1. [P0] PATH-001 - Referenced workflow path is missing: `.agents/workflows/openclaw-review.md`
2. [P1] TEST-001 - New script `scripts/check_resume.sh` has no test/smoke evidence
3. [P1] DOC-001 - User-facing README impact not mentioned

## Advisories
1. [P2] QUALITY-001 - Add explicit JSON schema for review report contract.
```

## Example JSON Report

```json
{
  "design_id": "AGENT-DESIGN-001",
  "overall_status": "fail",
  "severity_counts": {
    "P0": 1,
    "P1": 2,
    "P2": 1
  },
  "findings": [
    {
      "id": "PATH-001",
      "severity": "P0",
      "summary": "Referenced workflow path does not exist",
      "evidence": ".agents/workflows/openclaw-review.md",
      "recommended_fix": "Create the workflow or update the path to an existing workflow."
    }
  ],
  "required_fixes": [
    "PATH-001",
    "TEST-001",
    "DOC-001"
  ],
  "advisories": [
    "QUALITY-001"
  ],
  "reviewed_paths": [
    ".codex/config.toml",
    ".codex/agents/openclaw-agent-designer.toml",
    ".cursor/skills/openclaw-agent-design/SKILL.md"
  ],
  "timestamp_utc": "2026-03-03T16:00:00Z"
}
```

