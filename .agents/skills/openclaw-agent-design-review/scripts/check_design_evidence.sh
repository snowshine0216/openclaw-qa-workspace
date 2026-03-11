#!/usr/bin/env bash
set -euo pipefail

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
  if rg -qi "$pattern" "$DESIGN_FILE"; then
    echo "OK: $message"
  else
    echo "FAIL: $message"
    FAILURES=$((FAILURES + 1))
  fi
}

has_script_deliverables() {
  rg -qi '(\.agents/skills/[^[:space:]`|]+/scripts/|workspace-[^[:space:]`|]+/skills/[^[:space:]`|]+/scripts/)' "$DESIGN_FILE"
}

has_script_inventory_entries() {
  rg -qi '^### .*`.*scripts/.*`|^\| .*scripts/.*\|' "$DESIGN_FILE"
}

is_script_bearing_design() {
  has_script_deliverables || has_script_inventory_entries
}

check_common_sections() {
  check_required_pattern '^## [0-9]+\. Environment Setup' \
    'environment setup section is present'
  check_required_pattern '^## [0-9]+\. Design Deliverables' \
    'design deliverables section is present'
  check_required_pattern '^## [0-9]+\. AGENTS\.md (Sync|\(to change\))' \
    'AGENTS.md sync or AGENTS.md (to change) section is present'
  check_required_pattern '^## [0-9]+\. Skills Content Specification' \
    'skills content specification section is present'
  check_required_pattern '(^### [0-9]+\.x skill-SKILL\.md \(detailed\)|^### [0-9]+\.x .*SKILL\.md|reference\.md Content Specification|skill-reference\.md \(detailed\))' \
    'skill-SKILL.md or skill-reference.md detailed subsection is present'
  check_required_pattern '^## [0-9]+\. Workflow Design' \
    'workflow design section is present'
  check_required_pattern '^## [0-9]+\. (State Schemas|Data Models)' \
    'state schemas or data models section is present'
  check_required_pattern '^## [0-9]+\. Implementation Layers' \
    'implementation layers section is present'
  check_required_pattern '^## [0-9]+\. Files To Create / Update' \
    'files to create or update section is present'
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
  check_required_pattern 'AGENTS\.md' \
    'AGENTS.md impact is explicitly described'
  check_required_pattern 'README\.md|README' \
    'README impact is explicitly mentioned'
  check_required_pattern 'design_review_report\.md|design_review_report\.json|review report' \
    'review artifact paths or report outputs are explicit'
}

check_script_specific_sections() {
  check_required_pattern '^## [0-9]+\. (Script Inventory and Function Specifications|Functions in Scripts)' \
    'script inventory or functions in scripts section is present'
  check_required_pattern '^## [0-9]+\. Script Test Stub Matrix' \
    'script test stub matrix section is present'
  check_required_pattern '^## [0-9]+\. Backfill Coverage Table' \
    'backfill coverage table section is present'
  check_required_pattern 'Standards Exception Note' \
    'standards exception note is present'
  check_required_pattern 'scripts/test/' \
    'scripts/test convention is explicit'
  check_required_pattern '(Function inventory|^\| function \||^\|[[:space:]]*function[[:space:]]*\|)' \
    'function inventory or function specification table is present'
  check_required_pattern 'Smoke Command|node --test|bash .*test|validation evidence' \
    'validation evidence is present for script changes'
  if rg -qi 'behavioral contract|contract-heavy.*evals|evals.*when applicable' "$DESIGN_FILE"; then
    if rg -qi 'evals/|evals\.json' "$DESIGN_FILE"; then
      echo 'OK: evals folder or evals.json is declared (contract-heavy design)'
    else
      echo 'ADVISORY: contract-heavy design may need evals/evals.json (PKG-002)'
    fi
  fi
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
