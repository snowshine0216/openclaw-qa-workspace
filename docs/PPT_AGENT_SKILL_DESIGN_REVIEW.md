# PPT Agent Skill Design Review

Date: 2026-03-25

## Scope

Reviewed:

- `docs/PPT_AGENT_SKILL_DESIGN.md`
- `.agents/skills/ppt-agent/SKILL.md`
- `.agents/skills/ppt-agent/reference.md`
- `.agents/skills/ppt-agent/config.yaml.example`

Cross-checked against:

- [icip-cas/PPTAgent](https://github.com/icip-cas/PPTAgent)
- [PPTAgent documentation](https://github.com/icip-cas/PPTAgent/blob/main/pptagent/DOC.md)
- [PPTAgent best practices](https://github.com/icip-cas/PPTAgent/blob/main/pptagent/BESTPRACTICE.md)

## Verdict

Status: `fail`

The current design should not be used as the implementation baseline. It is misaligned with the requested product direction in four critical ways:

1. it treats OpenRouter as the default architecture instead of using the agent's built-in model;
2. it does not follow the upstream PPTAgent / DeepPresenter workflow closely enough;
3. it does not lock the output style to a business deck with minimal text and accent color `#FA6611`;
4. it has no test plan even though the design already defines multiple scripts and workflow stages.

## Blocking Findings

### P0. Wrong model and configuration boundary

Evidence:

- The design doc makes all capabilities depend on OpenRouter: [docs/PPT_AGENT_SKILL_DESIGN.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/docs/PPT_AGENT_SKILL_DESIGN.md#L27), [docs/PPT_AGENT_SKILL_DESIGN.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/docs/PPT_AGENT_SKILL_DESIGN.md#L31), [docs/PPT_AGENT_SKILL_DESIGN.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/docs/PPT_AGENT_SKILL_DESIGN.md#L32), [docs/PPT_AGENT_SKILL_DESIGN.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/docs/PPT_AGENT_SKILL_DESIGN.md#L33), [docs/PPT_AGENT_SKILL_DESIGN.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/docs/PPT_AGENT_SKILL_DESIGN.md#L34), [docs/PPT_AGENT_SKILL_DESIGN.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/docs/PPT_AGENT_SKILL_DESIGN.md#L77), [docs/PPT_AGENT_SKILL_DESIGN.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/docs/PPT_AGENT_SKILL_DESIGN.md#L86), [docs/PPT_AGENT_SKILL_DESIGN.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/docs/PPT_AGENT_SKILL_DESIGN.md#L122).
- The draft skill repeats the same assumption in setup and dependencies: [SKILL.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.agents/skills/ppt-agent/SKILL.md#L28), [SKILL.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.agents/skills/ppt-agent/SKILL.md#L33), [SKILL.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.agents/skills/ppt-agent/SKILL.md#L185).
- The draft reference requires `OPENROUTER_API_KEY` for all slots and documents four externally configured model slots: [reference.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.agents/skills/ppt-agent/reference.md#L18), [reference.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.agents/skills/ppt-agent/reference.md#L47), [reference.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.agents/skills/ppt-agent/reference.md#L55), [reference.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.agents/skills/ppt-agent/reference.md#L174).
- The draft config example also hardcodes OpenRouter for every slot: [config.yaml.example](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.agents/skills/ppt-agent/config.yaml.example#L5), [config.yaml.example](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.agents/skills/ppt-agent/config.yaml.example#L16), [config.yaml.example](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.agents/skills/ppt-agent/config.yaml.example#L21), [config.yaml.example](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.agents/skills/ppt-agent/config.yaml.example#L26).

Why this blocks:

- Your requirement is explicit: only `t2i_model` should be configurable; other agent reasoning should use the built-in model, never OpenRouter.
- Upstream DeepPresenter treats `t2i_model` as an optional quality improvement, not the center of the whole architecture: [PPTAgent README.md](/Users/xuyin/Documents/Repository/PPTAgent/README.md#L85), [PPTAgent README.md](/Users/xuyin/Documents/Repository/PPTAgent/README.md#L91), [PPTAgent deeppresenter/config.yaml.example](/Users/xuyin/Documents/Repository/PPTAgent/deeppresenter/config.yaml.example#L27).

Required change:

- Rewrite the architecture so `research`, `design`, `captioning`, `summarization`, and `evaluation` are agent-native tasks by default.
- Keep `config.yaml.example` with only one optional slot: `t2i_model`.
- Remove `OPENROUTER_API_KEY`, `VISION_API_KEY`, `LONG_CONTEXT_API_KEY`, and `EVAL_API_KEY` from the default setup path.
- State plainly: external model configuration is allowed only for text-to-image generation, and even that is optional.

### P0. Workflow is not faithful enough to PPTAgent / DeepPresenter

Evidence:

- The current design doc reduces creation to `Research -> Manuscript -> Design -> Images -> PptxGenJS -> PPTX -> Eval`: [docs/PPT_AGENT_SKILL_DESIGN.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/docs/PPT_AGENT_SKILL_DESIGN.md#L15), [docs/PPT_AGENT_SKILL_DESIGN.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/docs/PPT_AGENT_SKILL_DESIGN.md#L19).
- The edit flow is also oversimplified and jumps straight to XML editing: [docs/PPT_AGENT_SKILL_DESIGN.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/docs/PPT_AGENT_SKILL_DESIGN.md#L21), [docs/PPT_AGENT_SKILL_DESIGN.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/docs/PPT_AGENT_SKILL_DESIGN.md#L22), [docs/PPT_AGENT_SKILL_DESIGN.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/docs/PPT_AGENT_SKILL_DESIGN.md#L180).
- Upstream PPTAgent is explicitly two-phase, reference-aware, and PPTEval-backed: [pptagent/README.md](/Users/xuyin/Documents/Repository/PPTAgent/pptagent/README.md#L68), [pptagent/README.md](/Users/xuyin/Documents/Repository/PPTAgent/pptagent/README.md#L78), [pptagent/README.md](/Users/xuyin/Documents/Repository/PPTAgent/pptagent/README.md#L86).
- DeepPresenter's design role is not "generate everything at once"; it writes `design_plan.md`, generates slides page by page, and self-checks each slide before continuing: [Design.yaml](/Users/xuyin/Documents/Repository/PPTAgent/deeppresenter/roles/Design.yaml#L35), [Design.yaml](/Users/xuyin/Documents/Repository/PPTAgent/deeppresenter/roles/Design.yaml#L43), [Design.yaml](/Users/xuyin/Documents/Repository/PPTAgent/deeppresenter/roles/Design.yaml#L47).
- DeepPresenter's research role is also more structured than the current design doc captures: [Research.yaml](/Users/xuyin/Documents/Repository/PPTAgent/deeppresenter/roles/Research.yaml#L47), [Research.yaml](/Users/xuyin/Documents/Repository/PPTAgent/deeppresenter/roles/Research.yaml#L61).

Why this blocks:

- "Inspired by PPTAgent" is not enough for this task. The workflow must follow PPTAgent's logic closely, then adapt only the execution substrate.
- If the OpenClaw version skips reference/template analysis and slide-by-slide quality control, it will miss the main product advantage of PPTAgent.

Required change:

- Lock the create workflow to:
  1. intake and classify request;
  2. gather source materials and reference deck/template;
  3. research and draft manuscript;
  4. create `design_plan.md`;
  5. generate slides one by one with per-slide QA;
  6. assemble/export deck;
  7. run PPTEval-style review and iterate.
- Lock the edit workflow to:
  1. convert slides to images;
  2. analyze current structure and style;
  3. research deltas;
  4. create an update plan that preserves the house style;
  5. edit slide-by-slide;
  6. evaluate against the original.
- Explicitly add "reference/template selection" rather than treating layout as unconstrained free generation.

### P1. Output style contract is underspecified and currently contradicts the task

Evidence:

- The design doc only says "topic-informed, not generic blue": [docs/PPT_AGENT_SKILL_DESIGN.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/docs/PPT_AGENT_SKILL_DESIGN.md#L161), [docs/PPT_AGENT_SKILL_DESIGN.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/docs/PPT_AGENT_SKILL_DESIGN.md#L162).
- The draft skill still includes "clean blue palette" as a prompt example: [SKILL.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.agents/skills/ppt-agent/SKILL.md#L126), [SKILL.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.agents/skills/ppt-agent/SKILL.md#L140).
- Upstream PPTAgent best practice emphasizes simple layouts, controlled text density, and functional slide structure: [BESTPRACTICE.md](/Users/xuyin/Documents/Repository/PPTAgent/pptagent/BESTPRACTICE.md#L40), [BESTPRACTICE.md](/Users/xuyin/Documents/Repository/PPTAgent/pptagent/BESTPRACTICE.md#L42), [BESTPRACTICE.md](/Users/xuyin/Documents/Repository/PPTAgent/pptagent/BESTPRACTICE.md#L45), [BESTPRACTICE.md](/Users/xuyin/Documents/Repository/PPTAgent/pptagent/BESTPRACTICE.md#L49).

Why this blocks:

- You gave a hard style requirement: business deck, minimal text, theme color `#FA6611`.
- Without an explicit style contract, the agent will continue to drift into generic SaaS, generic blue, or image-heavy but business-light outputs.

Required change:

- Add a locked "Business Style Contract" section to the design doc and the skill.
- Required defaults:
  - accent color: `#FA6611`;
  - overall tone: business / executive / boardroom-ready;
  - text density: minimal, short headlines, sparse body copy, data-first visuals;
  - visual language: diagrams, charts, icons, high-quality photos only when they support a business message;
  - anti-patterns: generic blue palette, decorative gradients, filler illustrations, long paragraphs, crowded bullet walls.
- Add explicit content rules:
  - each slide should communicate one point;
  - keep slide text short enough that the presenter can speak the detail instead of putting it on the page;
  - prefer 3-5 bullets max when bullets are unavoidable;
  - align with PPTAgent's simple-layout guidance and low text occupancy.

### P1. No test strategy

Evidence:

- The design doc defines five scripts and a multi-stage workflow but has no `Tests` section at all: [docs/PPT_AGENT_SKILL_DESIGN.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/docs/PPT_AGENT_SKILL_DESIGN.md#L206), [docs/PPT_AGENT_SKILL_DESIGN.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/docs/PPT_AGENT_SKILL_DESIGN.md#L291).
- The implementation checklist ends without any test artifacts: [docs/PPT_AGENT_SKILL_DESIGN.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/docs/PPT_AGENT_SKILL_DESIGN.md#L292).
- The in-progress skill folder contains scripts and prompts but no tests: [.agents/skills/ppt-agent](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.agents/skills/ppt-agent).
- Upstream PPTAgent and DeepPresenter both ship tests, including generation and rendering coverage: [pptagent/test/test_pptgen.py](/Users/xuyin/Documents/Repository/PPTAgent/pptagent/test/test_pptgen.py#L12), [deeppresenter/test/test_playwright.py](/Users/xuyin/Documents/Repository/PPTAgent/deeppresenter/test/test_playwright.py#L63).

Why this blocks:

- This design introduces config parsing, HTTP integration, document summarization, vision/captioning, evaluation, and deck editing. Without tests, the skill will be fragile and expensive to debug.

Required change:

- Add a `## Tests` section to the design doc before implementation starts.
- Use built-in `node:test` for the new Node scripts unless there is a strong reason to add a heavier framework.
- Minimum required tests:
  - `tests/load-config.test.js`
    - loads only `t2i_model`;
    - rejects missing required `t2i_model` fields cleanly;
    - does not require non-t2i external slots.
  - `tests/generate-image.test.js`
    - request body shape;
    - base64 decode;
    - retry behavior;
    - provider errors.
  - `tests/caption-image.test.js`
    - local image validation;
    - JSON schema of output;
    - failure on unreadable image path.
  - `tests/summarize-doc.test.js`
    - file reading;
    - empty document handling;
    - markdown output shape.
  - `tests/eval-presentation.test.js`
    - slide image discovery;
    - PPTEval-style aggregation;
    - output JSON schema.
  - `tests/ppt-agent-workflow-smoke.test.js`
    - create workflow smoke path;
    - edit workflow smoke path;
    - style contract propagation into generated design plan.

### P1. The design artifact already has implementation drift and stale references

Evidence:

- The design doc points to a wrong placeholder repo URL instead of the real upstream: [docs/PPT_AGENT_SKILL_DESIGN.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/docs/PPT_AGENT_SKILL_DESIGN.md#L9).
- The draft skill still advertises OpenRouter as the central integration and keeps the wrong palette examples: [SKILL.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.agents/skills/ppt-agent/SKILL.md#L3), [SKILL.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.agents/skills/ppt-agent/SKILL.md#L128).
- The draft reference hardcodes OpenRouter troubleshooting and setup as the default mental model: [reference.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.agents/skills/ppt-agent/reference.md#L236), [reference.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.agents/skills/ppt-agent/reference.md#L239).

Why this matters:

- If the design doc is rewritten but the draft skill files remain unchanged, implementation will still follow the wrong system.

Required change:

- Treat the review as applying to both the design doc and the existing draft skill files.
- Rewrite docs and examples in the same change set so there is one authoritative architecture.

## Required Design Decisions To Lock

### 1. Execution model

- `research`, `design`, `captioning`, `summarization`, and `evaluation` default to the built-in agent model.
- `t2i_model` is the only optional external model slot.
- OpenRouter must not be the default dependency for non-image steps.

### 2. Workflow model

- Follow PPTAgent / DeepPresenter semantics, adapted to OpenClaw execution.
- Preserve manuscript-first and design-plan-first behavior.
- Preserve per-slide generation and per-slide inspection rather than bulk one-shot deck generation.

### 3. Style model

- Primary theme color: `#FA6611`.
- Style: business, executive, concise, presentation-first.
- Text rule: `文字尽量少`.
- Output should prefer charts, comparison tables, diagrams, process flows, and restrained supporting imagery.

### 4. Quality model

- Every generated deck must pass a PPTEval-style rubric: content, design/style, coherence.
- The style rubric must explicitly check compliance with the business-style contract, not just generic "visual appeal".

## Required Rewrite Of `docs/PPT_AGENT_SKILL_DESIGN.md`

The document should be restructured into these sections:

1. `## Overview`
   - Replace the placeholder repo URL with `https://github.com/icip-cas/PPTAgent`.
   - State that OpenClaw reuses PPTAgent logic but replaces most external reasoning calls with the built-in agent model.

2. `## Architecture`
   - Show create and edit workflows that include template/reference analysis, `design_plan.md`, per-slide generation, and evaluation loop.

3. `## Configuration`
   - Document only optional `t2i_model`.
   - Remove non-t2i OpenRouter slot design.

4. `## Business Style Contract`
   - `#FA6611` accent.
   - minimal text.
   - business visuals.
   - no generic blue.

5. `## Workflow Specifications`
   - creation flow aligned to PPTAgent / DeepPresenter.
   - editing flow aligned to slide analysis plus style-preserving update.

6. `## Tests`
   - exact test files and what each test validates.

7. `## Evals`
   - PPTEval-style acceptance thresholds.

8. `## Documentation Changes`
   - list updates required for `SKILL.md`, `reference.md`, and examples.

## File-Level Change List

### `docs/PPT_AGENT_SKILL_DESIGN.md`

- Rewrite architecture, config, workflow, and add tests/evals.

### `.agents/skills/ppt-agent/SKILL.md`

- Remove OpenRouter-default messaging.
- Replace blue-palette examples with `#FA6611` business examples.
- Make built-in-model-first behavior explicit.

### `.agents/skills/ppt-agent/reference.md`

- Remove global `OPENROUTER_API_KEY` requirement.
- Remove non-t2i model slot documentation as the default path.
- Add style contract and test command documentation.

### `.agents/skills/ppt-agent/config.yaml.example`

- Keep only optional `t2i_model`.
- Do not include vision, long-context, or eval slots as required config.

### New test files

- `tests/load-config.test.js`
- `tests/generate-image.test.js`
- `tests/caption-image.test.js`
- `tests/summarize-doc.test.js`
- `tests/eval-presentation.test.js`
- `tests/ppt-agent-workflow-smoke.test.js`

## Recommended Acceptance Criteria

The design is ready only when all of the following are true:

- the architecture no longer depends on OpenRouter except optional `t2i_model`;
- the workflow clearly follows PPTAgent / DeepPresenter structure;
- the style contract explicitly locks to business output, minimal text, and `#FA6611`;
- tests are defined before implementation;
- all draft skill docs and examples are updated to match the rewritten design.

## Summary

This is not a polish pass. It is a design correction. The current draft is pointed at the wrong control plane, the wrong workflow granularity, and the wrong visual default. Rewrite the design before continuing implementation.
