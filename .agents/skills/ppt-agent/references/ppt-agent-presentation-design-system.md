# PPT Agent Presentation Design System

> Design ID: `ppt-agent-presentation-design-system-2026-03-26`
> Date: 2026-03-26
> Status: Draft
> Purpose: Source-of-truth design direction for `ppt-agent` create and edit workflows so new and updated slides do not collapse into plain placeholder text.

## Product Context

- **What this is:** A design system for presentation generation and presentation editing inside `ppt-agent`.
- **Who it's for:** Users who want business-ready decks that are still visually intentional, not generic AI bullet slides.
- **Space/industry:** Internal productivity tooling, presentation automation, knowledge work.
- **Project type:** Deck editor and deck generator.

## Aesthetic Direction

- **Direction:** Analytical editorial
- **Decoration level:** Intentional
- **Mood:** Clear, sharp, evidence-led, and slightly premium. The deck should feel like a well-prepared operator presentation, not a raw exported outline.
- **Design thesis:** Each slide should read like a composed board page with a dominant visual idea, not a document paragraph pasted into PowerPoint.

## Safe Choices

- Preserve source-deck visual identity in edit mode unless the user asks for restyling.
- Use restrained business colors and simple geometry so enriched slides still fit enterprise decks.
- Prefer data panels, process flows, comparison columns, and screenshots over decorative art.

## Risks Worth Taking

- Use asymmetry when a slide needs a clear visual anchor.
- Let one strong visual or table dominate a slide instead of equal-weight text blocks.
- Use warm off-white and graphite surfaces instead of generic white backgrounds everywhere.

## Color

- **Approach:** Restrained with one sharp accent
- **Primary surface:** `#F7F1EA`
- **Secondary surface:** `#FFFDFC`
- **Primary text:** `#1E2430`
- **Muted text:** `#5A6472`
- **Primary accent:** `#FA6611`
- **Support accent:** `#2E6A8E`
- **Success:** `#2F7D57`
- **Warning:** `#B97912`
- **Error:** `#B2433F`

### Usage Rules

- Let the warm light surface dominate most content slides.
- Use `#FA6611` for emphasis, active steps, or key calls to attention, not for every object.
- Use `#2E6A8E` for evidence framing, comparison labels, or secondary structure.

## Typography

- **Display/Hero:** `Georgia`
- **Body/UI:** `Aptos`
- **Data/Tables:** `Aptos` with tabular numerals when available
- **Code/paths:** `Consolas`

### Typography Rules

- Titles should be short and bold.
- Body copy should be concise on-slide, but speaker notes can be detailed.
- Inline labels in tables, matrices, and process cards should be bold.
- Avoid dense paragraph blocks. Break long explanations into cards, rows, or labeled comparisons.

## Spacing

- **Base unit:** 8px equivalent
- **Density:** Comfortable
- **Margins:** minimum 0.5 inches
- **Gap rhythm:** 0.3 to 0.5 inches between major blocks

## Layout

- **Approach:** Hybrid
- **Core principle:** One dominant visual anchor per slide
- **Secondary principle:** Text supports the visual, not the reverse

### Preferred Slide Families

- `title_hero`
  - dark or high-contrast opening
  - one short subtitle
  - optional single supporting visual
- `evidence_panel`
  - headline left or top
  - metrics/table/chart on one side
  - concise interpretation on the other
- `comparison_matrix`
  - two strong columns
  - bold row labels
  - no more than 4 comparison rows
- `process_flow`
  - 3 to 5 steps
  - step cards or linked nodes
  - optional screenshot/diagram support
- `checklist_cards`
  - 2x2 or stacked cards
  - one headline plus one supporting sentence each
- `qa_two_column`
  - questions left
  - concise answers right
  - use dividers or chips, not raw paragraph text
- `table_summary`
  - compact table plus one takeaway box
- `closing_statement`
  - short close
  - single visual accent

## Hierarchy And Reading Order

Default scan order for non-exempt slides:

1. decisive title or takeaway
2. dominant visual anchor
3. one interpretation block or takeaway box
4. secondary labels, evidence, or support detail
5. provenance or footnote detail

Slide-family hierarchy rules:

- `title_hero`: title first, short subtitle second, optional supporting visual third
- `evidence_panel`: insight first, table/chart/screenshot second, explanation third
- `comparison_matrix`: column framing first, row labels second, conclusion third
- `process_flow`: current phase or destination first, process nodes second,
  operating detail third
- `qa_two_column`: question list first, concise answer board second, transition detail third
- `table_summary`: table first, highlighted row or column second, takeaway callout third

## Visual Anchor Rules

Every non-navigation slide needs one primary visual anchor from this list:

- existing source image or screenshot
- generated illustration or diagram
- structured table
- metric panel
- comparison columns
- process flow
- callout card grid

Slides that may be text-only by exception:

- agenda
- section divider
- thank you

If a non-exempt slide has only a title and bullets, it fails design review.

## Image Direction

### When to use generated images

- hero or overview slide needs a scene-setting visual
- explainer slide needs a custom conceptual diagram
- process slide needs a simple analytic illustration
- evidence slide needs a visual anchor and no better source asset exists

### When not to use generated images

- agenda, section divider, appendix index
- slides where a table, chart, or screenshot communicates better than illustration
- slides where the generated image would only decorate already-complete content

### Meta Prompt Rules

Every generated-image request should specify:

- business message
- subject
- layout composition
- focal object
- palette guidance
- realism or diagram style
- explicit exclusions

Bad prompt:

- "Generate an image for QA Plan Skill"

Good prompt:

- "Create a restrained 16:9 editorial diagram showing iterative QA-plan generation with one central XMind plan artifact, three supporting workflow stages, warm paper background, graphite typography, accent orange `#FA6611`, no people, no stock-photo look, no glossy 3D effects."

## Tables And Data Panels

- Prefer tables when the user is comparing named items, model choices, tradeoffs, or checklist steps.
- Prefer metric cards when the slide has 2 to 4 headline facts.
- Prefer comparison columns when there are two competing options or before/after states.
- Every table needs:
  - bold headers
  - aligned columns
  - one visual highlight row or column
  - an adjacent takeaway sentence

## Notes Strategy

- On-slide text is for scanability.
- Speaker notes are for actual delivery.
- Every explainer, process, evidence, or Q&A slide should have richer notes than on-slide text.
- Notes should include:
  - what to say first
  - one or two supporting details
  - how to transition to the next slide

## Accessibility And Legibility

- Prefer text and background combinations that maintain strong contrast in both
  projected rooms and exported PDFs.
- Do not rely on accent color alone to indicate priority, status, or comparison;
  pair color with labels, icons, or position.
- Keep body text concise enough to read quickly in screen-share mode.
- Preserve a logical reading order for title, visual, interpretation, and provenance.
- Generated images, diagrams, and charts should include alt text or equivalent
  descriptive metadata when the PowerPoint structure supports it.
- Avoid using animation as the only way a slide makes sense; the static frame must
  stand on its own.

## Output Contexts

Treat the deck as a multi-context artifact:

- projected presentation view
- laptop screen share
- exported PDF
- thumbnail sorter view
- presenter notes view

Design implication:

- the main takeaway must survive thumbnail scale
- tables should prefer fewer, clearer columns over dense spreadsheet-like grids
- speaker notes carry detail that would otherwise make the slide unreadable
- footer or provenance content must stay visually secondary but still legible

## Fallback And Degraded-State Rules

- If generated imagery is weak, switch to a structured fallback such as a table,
  chart, screenshot, or process diagram.
- If evidence is sparse, prefer one strong callout plus explicit notes instead of
  padding the slide with decorative filler.
- If the source deck has a strong established brand, preserve that identity before
  introducing new surface or typography changes.
- If a slide cannot support the intended family cleanly, use a simpler family with
  a clear anchor rather than a broken high-ambition composition.

## Anti-Slop Rules

- Do not add new slides that are plain title plus four raw bullets unless the slide is explicitly exempt.
- Do not repeat one placeholder layout across all added slides.
- Do not create decorative images with no informational role.
- Do not overuse orange accents.
- Do not center body text.
- Do not use weak visual filler when a table or diagram is the right answer.

## Component Guidance By Slide Intent

- **How-to slide:** process flow or checklist cards
- **Why-it-matters slide:** metric callouts plus concise support text
- **Model-choice slide:** comparison matrix or tradeoff table
- **Q&A slide:** two-column question/answer board
- **Benchmark slide:** evidence panel with chart/table and one summary callout

## Acceptance Standard

A slide is presentation-grade when:

1. A viewer can identify the main point in under 3 seconds.
2. The slide has a dominant visual anchor.
3. The text density fits the chosen layout.
4. The notes say more than the slide.
5. The slide looks intentionally composed, not mechanically expanded.

## Implementation Use

Use this file as the visual contract for:

- `slide-build-spec.json` defaults in create mode
- `composition_family` defaults in edit mode
- image meta prompt generation
- evaluation checks for plain-text regressions
