# Evals — openclaw-agent-design

Skill-creator compatible evals for the openclaw-agent-design skill.

## Structure

- **`evals.json`** — Test prompts and expectations for design output quality
- **`run_evals.mjs`** — Creates workspace, eval_metadata.json, and spawn manifest
- **`post_run.sh`** — Aggregates benchmark and generates review viewer (requires skill-creator)

## Running evals

### 1. Create workspace and spawn manifest

```bash
node evals/run_evals.mjs [--workspace PATH] [--iteration N] [--dry-run]
```

### 2. Spawn runs

For each eval, spawn **two** tasks (with-skill and without-skill) per the manifest instructions.

### 3. Grade runs

Save `grading.json` to each run directory with `expectations` array (`text`, `passed`, `evidence`).

### 4. Aggregate and view

```bash
./evals/post_run.sh <workspace>/iteration-<N> [--static /tmp/eval-review.html]
```

Requires `SKILL_CREATOR` (default: `~/.agents/skills/skill-creator`).

## Triggering evals on skill invocation

See [EVALS_TRIGGER.md](EVALS_TRIGGER.md) for options to run evals when the skill is used.
