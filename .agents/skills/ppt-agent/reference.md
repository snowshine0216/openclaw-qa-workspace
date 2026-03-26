# ppt-agent Reference

## Scope

This reference documents both supported workflows.

- Phase 1: create a new deck
- Phase 2: edit an existing deck through a style-preserving update path

## Setup

```bash
cd .agents/skills/ppt-agent
npm install
```

Optional text-to-image configuration:

```bash
cp .env.example .env
cp config.yaml.example config.yaml
```

Keep `.env` local only and commit only `.env.example`.

If `config.yaml` is missing, the skill should still run without external image generation.

## Configuration

### `.env`

```bash
T2I_API_KEY=
```

### `config.yaml`

Only `t2i_model` is supported:

```yaml
t2i_model:
  base_url: "https://example-provider.invalid/v1"
  model: "provider/image-model"
  api_key_env: "T2I_API_KEY"
  modalities: ["image"]
  image_config:
    aspect_ratio: "16:9"
    image_size: "1K"
```

Unsupported slots such as `vision_model`, `long_context_model`, `eval_model`, `research_agent`, and `design_agent` should fail validation.

All non-image reasoning stays host-neutral. Phase 1 artifacts record:

- `reasoning_host`
- `reasoning_mode`
- `execution_contract_version`

## Prompt-Only Grounding Policy

Prompt-only requests are allowed only when the workflow can ground them in verifiable research.

- if the topic is supportable, proceed and record provenance for researched claims
- if the topic is too vague, private, or unsupported, stop in the insufficient-brief state
- CLI auto-materialization requires `--source-provenance` for prompt-only runs so the workflow can record inspectable evidence instead of fabricating content
- manual-artifact imports may skip auto-materialized research, but prompt-only generated runs must not synthesize placeholder provenance

## Create-Mode Build Contract

Phase 1 create mode always generates a **new** deck through `pptx`.

References may influence:

- style
- structure
- both

References do **not** switch Phase 1 into template-editing-first behavior.

### Image Policy Decision Table

- `agenda`, `section_divider`, `appendix`: `image_strategy = forbid`
- `hero`, `explainer`, `process`, `comparison`, `evidence`, `qa`: `image_strategy = generate_new` unless a user-provided asset already satisfies the slide
- explicit `required_visual` contracts block the build when no acceptable visual path exists
- generated-image failures may degrade to partial success only when the slide remains understandable without the image

## Edit-Mode Update Contract

Phase 2 edit mode always starts from an existing `.pptx` and updates it through the shared `pptx` unpack/edit/pack flow.

Edit mode:

- preserves the original deck style by default
- may tighten clarity, spacing, contrast, and hierarchy when that does not create visual drift
- requires explicit user intent for full restyling
- preserves existing media by default on slides with source imagery
- allows `refine` only for controlled annotation/crop/derived variants
- allows `replace` only with preview artifacts and explicit approval
- fails when preserved media disappears or when layout/image drift exceeds the recorded contract

## Markitdown Runtime

Document-to-markdown extraction runs from the repository root and activates the repo-local virtualenv first:

```bash
cd /Users/xuyin/Documents/Repository/openclaw-qa-workspace
source .venv/bin/activate
python -m markitdown /absolute/path/to/input
```

This applies to:

- `scripts/summarize-doc.js`
- Phase 2 `artifacts/original-text.md`

## Run-State Contract

Each logical run should have a run root:

```text
.agents/skills/ppt-agent/runs/{run_id}/
├── manifest.json
├── input/
├── artifacts/
├── renders/
├── working/
└── logs/
```

### Phase 1 minimum artifacts

- `artifacts/manuscript.md`
- `artifacts/design_plan.md`
- `artifacts/slide-build-spec.json`
- `artifacts/reference-analysis.json`
- `artifacts/research-handoff.json`
- `artifacts/design-handoff.json`
- `artifacts/output.pptx`
- `artifacts/evals.json`

### Phase 2 minimum artifacts

- `artifacts/original-text.md`
- `artifacts/original-slide-index.json`
- `artifacts/raw-slide-captions.json`
- `artifacts/slide_analysis.json`
- `artifacts/source-media-index.json`
- `artifacts/research_delta.md`
- `artifacts/update_plan.md`
- `artifacts/update_plan.json`
- `artifacts/slide-transcripts/slide-XX.md`
- `artifacts/transcript-index.json`
- `artifacts/pre_edit_checkpoint.md`
- `artifacts/manual_handoff.md`
- `artifacts/edit_handoff.json`
- `artifacts/output-updated.pptx`
- `artifacts/comparison_evals.json`
- `artifacts/run_summary.md`
- `artifacts/operator-summary.json`
- `logs/stage-status.json`
- `logs/events.jsonl`

Transcript grounding order:

1. user requirement / change request
2. source deck content, speaker notes, and source material when present
3. cached Tavily background search results

Missing source notes do not block transcript generation. The transcript must emit `none present in source deck` explicitly.

If those inputs are still insufficient, the run must stop in `needs_context`.

Minimum manifest fields:

- `run_id`
- `phase`
- `status`
- phase-specific compatibility fields
- `style_contract_version`
- artifact paths

Resume behavior:

- reuse only compatible runs
- resume from the earliest invalidated stage
- fail clearly on corrupted manifests

For Phase 2 specifically:

- changing the source deck invalidates from `analyze`
- changing change-source material invalidates from `research`
- changing style-preservation or restyle mode invalidates from `plan`
- `approval-request.json` without `approval-decision.json` resumes into `awaiting_image_approval`
- an approved decision resumes into `evaluate`
- a rejected decision resumes into `edit`

Output location guarantee:

- default run root: `.agents/skills/ppt-agent/runs`
- create-mode output deck: `artifacts/output.pptx`
- edit-mode output deck: `artifacts/output-updated.pptx`
- manifest artifact paths must remain inside the run root

## Script Reference

### `node scripts/create-run.js`

Initialize a Phase 1 create run:

```bash
node scripts/create-run.js \
  --root-dir .agents/skills/ppt-agent/runs \
  --prompt "Build a Q2 operating review for leadership" \
  --objective "Summarize Q2 performance and decisions" \
  --attachments /absolute/path/to/source.md \
  --manuscript /absolute/path/to/manuscript.md \
  --design-plan /absolute/path/to/design_plan.md

node scripts/create-run.js \
  --root-dir .agents/skills/ppt-agent/runs \
  --prompt "Build a market landscape deck on enterprise browser automation adoption in 2026" \
  --objective "Summarize the market, risks, and recommendation" \
  --source-provenance /absolute/path/to/source-provenance.json
```

If `--root-dir` is omitted, `create-run.js` defaults to `.agents/skills/ppt-agent/runs`.

Outputs JSON including:

- `runRoot`
- `resumed`
- `resumeStage`
- `manifestPath`
- `stageStatusPath`
- `manuscriptPath`
- `designPlanPath`
- `slideBuildSpecPath`
- `pptxHandoffPath`
- `referenceAnalysisPath`
- `researchHandoffPath`
- `designHandoffPath`
- `outputPath`
- `evaluation`

Generated-artifact mode:

- if the workflow is generating `manuscript.md` and `design_plan.md`, `create-run.js` also builds, renders, evaluates, and triggers the bounded refinement loop when thresholds fail
- reruns reuse compatible run roots and skip unchanged build/eval stages when artifacts are still valid

Manual-artifact mode:

- if both `--manuscript` and `--design-plan` are supplied, `create-run.js` emits the create-phase artifacts and handoff files without auto-building the deck
- manual-artifact mode records portable runtime metadata with `reasoning_mode: manual_artifact`

### `node scripts/build-pptx-from-handoff.js`

Build a starter PPTX from a handoff artifact:

```bash
node scripts/build-pptx-from-handoff.js \
  --handoff .agents/skills/ppt-agent/runs/<run-id>/artifacts/pptx-handoff.json
```

Outputs JSON including:

- `outputPath`
- `slideCount`
- `renderSummary`

### `node scripts/evaluate-run.js`

Validate a Phase 1 run:

```bash
node scripts/evaluate-run.js \
  --run-root .agents/skills/ppt-agent/runs/<run-id>
```

Outputs JSON including:

- `outputPath`
- `summary.status`
- `summary.checks`
- `summary.missing`
- `summary.render_count`
- `render_checks`
- `recoverable_errors` when one render-aware dimension cannot complete reliably
- `summary.scores`
- `summary.refinementTargets`

### `node scripts/generate-image.js`

Use only when optional external image generation is desired:

```bash
node scripts/generate-image.js \
  --prompt "Restrained business process diagram with orange accent #FA6611" \
  --output images/process.png \
  --aspect "16:9" \
  --size "1K"
```

Outputs the saved file path on success.

### `node scripts/edit-run.js`

Initialize a Phase 2A edit run:

```bash
node scripts/edit-run.js \
  --root-dir .agents/skills/ppt-agent/runs \
  --deck /absolute/path/to/source.pptx \
  --change-request "Refresh Q1 metrics and add one slide on Q2 hiring plan" \
  --attachments /absolute/path/to/q1-metrics.md,/absolute/path/to/hiring-plan.md
```

If `--root-dir` is omitted, `edit-run.js` defaults to `.agents/skills/ppt-agent/runs`.

Outputs JSON including:

- `runRoot`
- `manifestPath`
- `stageStatusPath`
- `originalTextPath`
- `slideAnalysisPath`
- `researchDeltaPath`
- `updatePlanPath`
- `checkpointPath`
- `manualHandoffPath`

### `node scripts/apply-edit-run.js`

Prepare the structural edit scaffold:

```bash
node scripts/apply-edit-run.js \
  --run-root .agents/skills/ppt-agent/runs/<run-id>
```

### `node scripts/finalize-edit-run.js`

Finalize the updated deck and run comparison evaluation:

```bash
node scripts/finalize-edit-run.js \
  --run-root .agents/skills/ppt-agent/runs/<run-id>
```

### `node scripts/eval-presentation.js`

Compare original vs updated renders directly:

```bash
node scripts/eval-presentation.js \
  --before .agents/skills/ppt-agent/runs/<run-id>/renders/before \
  --after .agents/skills/ppt-agent/runs/<run-id>/renders/after \
  --plan .agents/skills/ppt-agent/runs/<run-id>/artifacts/update_plan.json \
  --handoff .agents/skills/ppt-agent/runs/<run-id>/artifacts/edit_handoff.json
```

## Test Commands

```bash
npm test
```

## Troubleshooting

**`t2i_model is not configured`**

This is expected when optional image generation is not set up. Create-mode may still proceed without external images.

**`Unsupported config slot`**

Remove unsupported config slots from `config.yaml`.

**`Missing API key for t2i_model`**

Set `T2I_API_KEY` in `.env`, or set `api_key` in `config.yaml`.

**`quality_threshold_failed`**

The create run produced the expected artifacts, but the rubric score fell below the Phase 1 acceptance threshold. Inspect `artifacts/evals.json` to see whether content, design, or coherence needs refinement.

When `create-run.js` is operating in generated-artifact mode, this state triggers the bounded refinement loop automatically and reruns only the smallest affected stage.

**`evaluation_unavailable`**

The deck built successfully, but no rendered slide images were available for evaluation. Re-run the build step in an environment where the `pptx` render helpers can convert the deck into slide images, then evaluate again.

**`markitdown` cannot extract `.pptx` content**

The repo-local virtualenv is missing `markitdown`'s optional PPTX reader. `ppt-agent` still attempts the `markitdown` path first; edit-mode falls back to structural extraction so planning can continue offline.

**`comparison_eval_failed`**

The edit run produced a review draft, but the requested changes were not fully applied or the after-state regressed. Inspect `artifacts/comparison_evals.json`.
