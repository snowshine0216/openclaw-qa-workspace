#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <design-markdown-file>" >&2
  exit 2
fi

design_file="$1"

if [ ! -f "$design_file" ]; then
  echo "ERROR: design file not found: $design_file" >&2
  exit 2
fi

failures=0

check_required_pattern() {
  local pattern="$1"
  local message="$2"
  if rg -qi "$pattern" "$design_file"; then
    echo "OK: $message"
  else
    echo "FAIL: $message"
    failures=$((failures + 1))
  fi
}

design_has_scripts=false
if rg -qi 'scripts/|\.sh|\.js|shell' "$design_file"; then
  design_has_scripts=true
fi

check_required_pattern '^## [0-9]+\. Environment Setup' \
  "environment setup section is present"
check_required_pattern '^## [0-9]+\. Design Deliverables' \
  "design deliverables section is present"
check_required_pattern '^## [0-9]+\. AGENTS\.md Sync' \
  "AGENTS.md sync section is present"
check_required_pattern '^## [0-9]+\. (Skills Design|Skill-First Architecture)' \
  "skills design or architecture section is present"
check_required_pattern '^## [0-9]+\. (Workflow Design|OpenClaw Design Workflow Requirements)' \
  "workflow design section is present"
check_required_pattern '^## [0-9]+\. State Schemas' \
  "state schemas section is present"
check_required_pattern '^## [0-9]+\. (Implementation Layers|Scripts)' \
  "implementation layers or scripts section is present"
check_required_pattern '^## [0-9]+\. Files To Create / Update' \
  "files to create or update section is present"
check_required_pattern '\.agents/skills/' \
  "shared skill pathing is explicit"
check_required_pattern '<workspace>/skills/|workspace-[^/]+/skills/' \
  "workspace-local skill pathing is explicit"
check_required_pattern 'Why this placement:|placement justification|justif(y|ication).*shared|justif(y|ication).*workspace-local' \
  "placement justification is explicit"
check_required_pattern 'skill entrypoint|entrypoint skill|workflow entrypoint' \
  "workflow is modeled as a skill entrypoint"
check_required_pattern 'REPORT_STATE|existing-status|existing status|Phase 0' \
  "Phase 0 existing-status handling is explicit"
check_required_pattern 'task\.json|run\.json' \
  "state file semantics are explicit"
check_required_pattern 'skill-creator' \
  "skill-creator requirement is present"
check_required_pattern 'code-structure-quality' \
  "code-structure-quality requirement is present"
check_required_pattern 'jira-cli.*confluence.*feishu-notify|jira-cli|confluence|feishu-notify' \
  "existing shared skill reuse is present"
check_required_pattern 'contract gap|wrapper.*justif|direct reuse is sufficient|why direct reuse is sufficient' \
  "direct reuse or wrapper justification is explicit"
check_required_pattern 'AGENTS\.md' \
  "AGENTS.md impact is explicitly described"
check_required_pattern 'README\.md|README' \
  "README impact is explicitly mentioned"
check_required_pattern 'design_review_report\.md|design_review_report\.json|review report' \
  "review artifact paths or report outputs are explicit"

if [ "$design_has_scripts" = true ]; then
  check_required_pattern 'test|tests|spec|coverage|smoke|validation' \
    "validation evidence is present for script changes"
else
  echo "INFO: no explicit script references detected; skipping script validation gate"
fi

echo "Failures: $failures"
if [ "$failures" -gt 0 ]; then
  exit 1
fi
