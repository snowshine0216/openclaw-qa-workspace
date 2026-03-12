#!/usr/bin/env bash
set -euo pipefail

# Validates design doc for exact-content contract: reject outline-style Skills Content,
# Functions, and Tests. Function-only updates exempt from Skills Content checks.

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

fail() {
  echo "FAIL: $1"
  FAILURES=$((FAILURES + 1))
}

# Scope: Skills Content Spec in scope when design has Skills Content Specification section
# with skill-SKILL.md blocks. Function-only = no Skills Content Spec, only Functions/Tests.
has_skills_content_spec() {
  pattern_match '^## Skills Content Specification' "$DESIGN_FILE" && \
  pattern_match 'skill-SKILL\.md|SKILL\.md.*detailed|### 3\.' "$DESIGN_FILE"
}

has_functions_section() {
  pattern_match '^## Functions|^### Functions|^## Functional Design|\| function \|' "$DESIGN_FILE"
}

has_tests_section() {
  pattern_match '^## Tests' "$DESIGN_FILE"
}

# Check 1: Reject outline-style Skills Content (only when Skills Content Spec in scope)
check_skills_content_exact() {
  if ! has_skills_content_spec; then
    return 0
  fi

  # Extract Skills Content Specification section (from header to next top-level ## section)
  # Match canonical template: ## Skills Content Specification (optional) or ## Skills Content Specification
  # Skill content can include ## Required References, ## Phase Contract etc.; stop at ## Data Models, ## Functions, etc.
  local skills_section
  skills_section=$(awk '/^## Skills Content Specification( \(optional\))?$/ {flag=1; next}
    /^## (Data Models|Functions|Functional Design|Tests|Documentation Changes|Implementation Checklist|References|Evals)([[:space:]]|$)/ && flag {exit}
    flag' "$DESIGN_FILE" 2>/dev/null || true)

  if [ -z "$skills_section" ]; then
    return 0
  fi

  # Outline-style: section has "Target path:" as primary structure
  if echo "$skills_section" | grep -qE '^Target path:'; then
    # Exact content has ## headers (Required References, Runtime Layout, Phase Contract, etc.)
    if ! echo "$skills_section" | grep -qE '^## (Required|Runtime|Phase|Orchestrator|QA Plan|When Sections)'; then
      fail "Skills Content Specification uses outline-style (Target path: only) without exact content; include full SKILL.md text with ## headers"
    fi
  fi

  # Require at least one ## header in skill spec block (exact content)
  if ! echo "$skills_section" | grep -qE '^## [A-Za-z]'; then
    fail "Skills Content Specification lacks section headers (##); include exact SKILL.md content"
  fi

  # Reject reference.md blocks that use "Must include" bullets instead of actual content
  if echo "$skills_section" | grep -qE 'reference\.md|### 4\.'; then
    if echo "$skills_section" | grep -qE '^Must include:|^- Must include'; then
      if ! echo "$skills_section" | grep -qE '^## |^### [A-Za-z]|^---'; then
        fail "reference.md spec uses 'Must include' bullets; write the actual content instead"
      fi
    fi
  fi
}

# Check 2: Reject outline-style Functions (lib scripts need Implementation detail)
check_functions_implementation_detail() {
  if ! has_functions_section; then
    return 0
  fi

  # If design has lib scripts but no Implementation detail
  if pattern_match 'scripts/lib/|scripts/lib/' "$DESIGN_FILE"; then
    if ! pattern_match 'Implementation detail|implementation detail|Detailed Implementation|algorithm|pseudocode|step-by-step' "$DESIGN_FILE"; then
      fail "Functions or Functional Design has lib scripts but lacks Implementation detail (algorithm, pseudocode, or step-by-step logic)"
    fi
  fi
}

# Check 3: Reject outline-style Tests (require test( or describe( blocks)
check_tests_detailed_stubs() {
  if ! has_tests_section; then
    return 0
  fi

  # If Tests section has "Stub scenarios:" with bullet list but no test( or describe(
  if pattern_match 'Stub scenarios:' "$DESIGN_FILE"; then
    if ! pattern_match "test\(|describe\(" "$DESIGN_FILE"; then
      fail "Tests section has Stub scenarios but no test( or describe( blocks; include detailed stubs"
    fi
  fi

  # When script-bearing design has Tests, require at least one test( or describe(
  if pattern_match 'scripts/test/' "$DESIGN_FILE"; then
    if ! pattern_match "test\(|describe\(" "$DESIGN_FILE"; then
      fail "Tests section references scripts/test/ but no test( or describe( blocks; include detailed stubs"
    fi
  fi
}

main() {
  FAILURES=0
  require_design_file "$@"

  # Skip all checks if design has neither Skills Content Spec nor Functions nor Tests
  if ! has_skills_content_spec && ! has_functions_section && ! has_tests_section; then
    echo "OK: no Skills Content Spec, Functions, or Tests sections; skip exact-content checks"
    exit 0
  fi

  # Function-only: no Skills Content Spec → skip Skills Content checks
  if has_skills_content_spec; then
    check_skills_content_exact
  else
    echo "OK: function-only design (no Skills Content Spec); skip Skills Content checks"
  fi

  check_functions_implementation_detail
  check_tests_detailed_stubs

  echo "Exact-content failures: $FAILURES"
  if [ "$FAILURES" -gt 0 ]; then
    exit 1
  fi
  echo "OK: exact-content contract satisfied"
}

main "$@"
