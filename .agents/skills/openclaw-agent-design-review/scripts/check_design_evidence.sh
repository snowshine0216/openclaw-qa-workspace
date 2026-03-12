#!/usr/bin/env bash
set -euo pipefail

# Use ripgrep (rg) if available, else grep -E for pattern matching
pattern_match() {
  local pattern="$1"
  local file="$2"
  if command -v rg &>/dev/null; then
    rg -qi "$pattern" "$file"
  else
    grep -qiE "$pattern" "$file" 2>/dev/null || false
  fi
}

usage() {
  echo "Usage: $0 <design-markdown-file>" >&2
  exit 2
}

require_design_file() {
  if [ "$#" -ne 1 ]; then
    usage
  fi

  DESIGN_FILE="$1"
  if [ ! -f "$DESIGN_FILE" ]; then
    echo "ERROR: design file not found: $DESIGN_FILE" >&2
    exit 2
  fi
}

check_required_pattern() {
  local pattern="$1"
  local message="$2"
  if pattern_match "$pattern" "$DESIGN_FILE"; then
    echo "OK: $message"
  else
    echo "FAIL: $message"
    FAILURES=$((FAILURES + 1))
  fi
}

has_script_deliverables() {
  pattern_match '(\.agents/skills/[^[:space:]`|]+/scripts/|workspace-[^[:space:]`|]+/skills/[^[:space:]`|]+/scripts/)' "$DESIGN_FILE"
}

has_script_inventory_entries() {
  pattern_match '^### .*`.*scripts/.*`|^\| .*scripts/.*\|' "$DESIGN_FILE"
}

is_script_bearing_design() {
  has_script_deliverables || has_script_inventory_entries
}

has_skills_in_scope() {
  pattern_match '\.agents/skills/|workspace-[^/]+/skills/' "$DESIGN_FILE"
}

check_common_sections() {
  check_required_pattern '^## Overview' \
    'Overview section is present'
  check_required_pattern '^## Architecture' \
    'Architecture section is present'
  check_required_pattern '^### Workflow chart|^### Folder structure' \
    'Workflow chart or Folder structure subsection is present'
  check_required_pattern '^## Documentation Changes' \
    'Documentation Changes section is present'
  check_required_pattern '^### AGENTS\.md|AGENTS\.md' \
    'AGENTS.md subsection or impact is present'
  check_required_pattern '^## Implementation Checklist' \
    'Implementation Checklist section is present'
  check_required_pattern '^## References' \
    'References section is present'
  check_required_pattern '\.agents/skills/' \
    'shared skill pathing is explicit'
  check_required_pattern '<workspace>/skills/|workspace-[^/]+/skills/' \
    'workspace-local skill pathing is explicit'
  check_required_pattern 'Why this placement:|placement justification|justif(y|ication).*shared|justif(y|ication).*workspace-local' \
    'placement justification is explicit'
  check_required_pattern 'skill entrypoint|entrypoint skill|workflow entrypoint|Entrypoint skill path' \
    'workflow is modeled as a skill entrypoint'
  check_required_pattern 'REPORT_STATE|existing-status|existing state|Phase 0' \
    'Phase 0 existing-status handling is explicit'
  check_required_pattern 'task\.json|run\.json' \
    'state file semantics are explicit'
  check_required_pattern 'skill-creator' \
    'skill-creator requirement is present'
  check_required_pattern 'code-structure-quality' \
    'code-structure-quality requirement is present'
  check_required_pattern 'jira-cli|confluence|feishu-notify' \
    'existing shared skill reuse is present'
  check_required_pattern 'direct reuse is sufficient|contract gap|wrapper.*justif' \
    'direct reuse or wrapper justification is explicit'
  check_required_pattern 'Purpose:|When to trigger:|Input contract:|Output contract:|Workflow/phase responsibilities:|Error/ambiguity policy:|Quality rules:' \
    'SKILL.md content blueprint is explicit'
  check_required_pattern 'state machine / invariants|schemas or field-level contracts|path conventions|validation commands|failure examples and recovery rules' \
    'reference.md content blueprint is explicit'
  check_required_pattern 'README\.md|README' \
    'README impact is explicitly mentioned'
  check_required_pattern 'design_review_report\.md|design_review_report\.json|review report' \
    'review artifact paths or report outputs are explicit'

  if has_skills_in_scope; then
    check_required_pattern '^## Skills Content Specification' \
      'Skills Content Specification section is present (skills in scope)'
  fi
}

check_script_specific_sections() {
  check_required_pattern '^### Functions|^\| function \|' \
    'Functions subsection or function table is present'
  check_required_pattern '^## Tests' \
    'Tests section is present'
  check_required_pattern 'scripts/test/' \
    'scripts/test convention is explicit'
  check_required_pattern '\|[[:space:]]*function[[:space:]]*\|[[:space:]]*responsibility[[:space:]]*\|[[:space:]]*inputs[[:space:]]*\|[[:space:]]*outputs[[:space:]]*\|[[:space:]]*side effects[[:space:]]*\|[[:space:]]*failure mode[[:space:]]*\|' \
    'function specification table is present'
  check_required_pattern 'Smoke Command|node --test|bash .*test|validation evidence' \
    'validation evidence is present for script changes'
}

main() {
  FAILURES=0
  require_design_file "$@"
  check_common_sections

  if is_script_bearing_design; then
    check_script_specific_sections
  else
    echo 'INFO: no script deliverables detected; skipping script-specific gates'
  fi

  echo "Failures: $FAILURES"
  if [ "$FAILURES" -gt 0 ]; then
    exit 1
  fi
}

main "$@"
