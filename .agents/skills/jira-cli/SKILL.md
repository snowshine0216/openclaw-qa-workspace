---
name: jira-cli
description: Interact with Jira from the command line to create, list, view, edit, transition, and search issues, and also to update Jira descriptions with ADF or add comments with user mentions through the shared playground scripts. Use when the user asks about Jira tasks, tickets, sprints, project work items, ADF description publishing, or mention-safe comments.
license: MIT
metadata:
  author: Colby Timm
  version: "1.6"
---

# Jira CLI

Use this skill for normal Jira CLI workflows and for Jira REST publish paths that need structured ADF payloads.

## When to Use

- Create, view, edit, transition, or search Jira issues
- Run JQL from Codex/OpenClaw with workspace-aware credentials
- Update an issue `description` with Atlassian Document Format
- Add a comment that contains explicit Jira user mentions
- Manually test Jira publish flows against a sandbox issue before wiring them into automation

## Layout

- `scripts/`: user-facing entrypoints, templates, docs, and `scripts/lib/` shared helpers
- `tests/`: focused unit and integration checks for the skill helpers and entrypoints

## Prerequisites

1. Install `jira-cli` and run `jira init`
2. Add `JIRA_API_TOKEN` and `JIRA_BASE_URL` to a `.env` file. **The wrapper scripts (`jira-run.sh`, `search-jira.sh`, etc.) auto-load `.env`** — no manual `source` or `export` needed. Resolution order (first found wins):
   - `JIRA_ENV_FILE` env var (explicit path)
   - **Skill folder** (same dir as SKILL.md) — recommended; `cp .env.example .env` there
   - Workspace root `.env` (OPENCLAW_WORKSPACE or dir with AGENTS.md)
   - Repo root `.env`
3. Make sure `jq`, `curl`, and `node` are available for publish/playground scripts
4. For live publish commands, use a sandbox issue and provide `JIRA_USER_EMAIL` if your local Jira config does not include `login`

## Environment Bootstrap (Required)  
- Before running any `jira` command from OpenClaw/Codex sessions, first load the skill-local environment if present: 
```bash
set -a 
source ~/.agents/skills/jira-cli/.env >/dev/null 2>&1 || true
set +a
jira me
```

## Script Entry Points

### Core wrappers

```bash
bash .agents/skills/jira-cli/scripts/jira-run.sh issue view ABC-1 --plain
bash .agents/skills/jira-cli/scripts/search-jira.sh --jql "status = 'In Progress'" --plain
bash .agents/skills/jira-cli/scripts/create_ciad_issue.sh
```

### ADF + mentions helpers

```bash
bash .agents/skills/jira-cli/scripts/build-adf.sh input.md output.json
bash .agents/skills/jira-cli/scripts/resolve-jira-user.sh lizhu@microstrategy.com
bash .agents/skills/jira-cli/scripts/build-comment-payload.sh \
  --text "Executive summary is ready." \
  --mentions-file .agents/skills/jira-cli/scripts/templates/mentions.sample.json \
  --output /tmp/comment.json

# Merge mode (DEFAULT): appends new content to existing description
bash .agents/skills/jira-cli/scripts/jira-publish-playground.sh \
  --issue ABC-1 \
  --description-file output.json \
  --update-description \
  --post

# Overwrite mode (EXPLICIT): replaces description entirely
bash .agents/skills/jira-cli/scripts/jira-publish-playground.sh \
  --issue ABC-1 \
  --description-file output.json \
  --update-description \
  --overwrite \
  --post
```

## Recommended Workflow

1. Use `jira-run.sh` or `search-jira.sh` for normal Jira CLI reads and edits.
2. Convert markdown to ADF with `scripts/build-adf.sh` when the description content is richer than plain text.
3. Resolve mention candidates with `scripts/resolve-jira-user.sh`; it prefers exact matches, supports safe direct accountId bypass, and returns explicit candidate lists when the result is ambiguous.
4. Build the final comment payload with `scripts/build-comment-payload.sh`.
5. Preview the final description/comment payloads with `scripts/jira-publish-playground.sh`.
6. **By default, `--update-description` merges new content with existing description** (safe, non-destructive).
7. Use `--overwrite` flag only when you need to replace the description entirely (destructive).
8. Add `--post` only when writing to a sandbox issue is intended.

## Manual Testing Playground

- Guide: `scripts/docs/README.md`
- Sample markdown: `scripts/templates/sample-rca.md`
- Sample mention metadata: `scripts/templates/mentions.sample.json`
- Canonical contracts: `reference.md`
- Concrete command examples: `examples.md`
- Validation checks: `tests/`

## Common Jira CLI Commands

Use `jira-run.sh` (not raw `jira`) so credentials are loaded from `.env`:

```bash
# <skill-path> = jira-cli skill folder (e.g. .agents/skills/jira-cli)
bash <skill-path>/scripts/jira-run.sh issue list --plain --columns key,summary,status --no-headers
bash <skill-path>/scripts/jira-run.sh issue view ISSUE-123 --plain
bash <skill-path>/scripts/jira-run.sh issue edit ISSUE-123 -s "Updated summary"
bash <skill-path>/scripts/jira-run.sh issue move ISSUE-123 "In Progress"
bash <skill-path>/scripts/jira-run.sh issue assign ISSUE-123 "$(bash <skill-path>/scripts/jira-run.sh me)"
bash <skill-path>/scripts/jira-run.sh issue comment add ISSUE-123 "Plain-text comment"
bash <skill-path>/scripts/jira-run.sh sprint list --current -a"$(bash <skill-path>/scripts/jira-run.sh me)"
```

## Notes

- Prefer explicit Jira `accountId` values for mentions; do not guess from free-form names.
- When user resolution is ambiguous, keep the candidate list explicit and let the caller choose instead of silently tagging the first result.
- For automation that updates description and adds a comment, treat the comment as a follow-up step after description publish succeeds.
- Keep the skill doc lean; use `reference.md`, `examples.md`, `scripts/docs/README.md`, and `tests/` for the detailed workflow and validation surface.
