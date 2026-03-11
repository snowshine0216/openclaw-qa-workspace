# Evals

## Structure

- **`evals`** — Skill-creator compatible format for `generate_review.py`, `aggregate_benchmark`, and trigger optimization. Use for running test prompts through the skill and grading outputs.
- **`eval_groups`** — Contract/compliance checks for context extraction, coverage usage, executable steps, E2E, review delta, doc sync, and readability.
- Smoke and grading expectations assume phase-specific runtime contracts, split `phase5a`/`phase5b` review loops, and phase-scoped draft files.

## Fixture paths

Fixture paths in `eval_groups` are relative to the workspace root:

- `workspace-planner/skills/qa-plan-orchestrator/runs/BCED-2416/drafts/*.md` — BCED-2416 draft fixtures (must exist)
- `workspace/projects/embedding-dashboard-editor-workstation/compare-result.md` — coverage comparison fixture

For skill-creator `evals`, `files` can be empty when fixtures are project-specific; document required setup in `expected_output`.

---

## Running evals

### 1. Create workspace and spawn manifest

```bash
node evals/run_evals.mjs [--workspace PATH] [--iteration N] [--dry-run]
```

- Creates `qa-plan-orchestrator-workspace/iteration-1/` (or custom path)
- Writes `eval_metadata.json` for each eval
- Outputs a spawn manifest (JSON + human-readable instructions) to stdout and `spawn_manifest.json`

### 1a. Script-driven smoke checks

Run the phase-entry smoke suite before grading prompts:

```bash
bash scripts/test/run-all.sh
node --test scripts/test/*.test.mjs
```

### 2. Spawn runs

For each eval in the manifest, run **two** tasks (with-skill and without-skill):

- **With skill:** Load `qa-plan-orchestrator`, execute the prompt, save outputs to `.../with_skill/run-1/outputs/`
- **Without skill:** Same prompt, no skill, save outputs to `.../without_skill/run-1/outputs/`

Save phase-scoped drafts, review/checkpoint deltas, and any supplemental research artifacts alongside context outputs.

Use the agent or spawn mechanism available (Codex, subagents, etc.) and the instructions from the manifest.

### 3. Grade runs

After each run completes:

- Evaluate outputs against the expectations in `evals.json`
- Save `grading.json` to each run directory (`.../run-1/grading.json`)
- Use the grading schema: `expectations` array with `text`, `passed`, `evidence` fields

See `~/.agents/skills/skill-creator/agents/grader.md` for grading guidance.

### 4. Aggregate and view

```bash
./evals/post_run.sh <workspace>/iteration-<N> [--static /tmp/eval-review.html]
```

- Requires `SKILL_CREATOR` (default: `~/.agents/skills/skill-creator`)
- Produces `benchmark.json` and `benchmark.md`
- Launches the review viewer (or writes static HTML with `--static`)

For headless: use `--static /path/to/output.html` and open the file in a browser.
