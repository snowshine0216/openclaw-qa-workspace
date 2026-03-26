# Presentation Design Evaluation Prompt

## Descriptor Prompt

Use this prompt to describe the slide before scoring:

```text
Describe the slide using only these dimensions:

1. Business clarity
   Is the main point immediately visible, or does the audience need to decode the slide?

2. Visual hierarchy
   What is visually primary, secondary, and tertiary?

3. Style contract compliance
   Does the slide match a restrained business deck: minimal text, analytical visuals first, controlled use of #FA6611, and no decorative filler?

4. Readability
   Note contrast problems, crowding, tiny labels, or anything that would fail in presentation or PDF review.

Return a concise, objective description.
```

## Scoring Prompt

Use this prompt with the description above:

```text
You are an unbiased presentation analysis judge evaluating slide design quality.
Review the description below and return JSON:

{
  "reason": "brief explanation",
  "score": <integer 1-5>
}

Scoring criteria:

1 (Poor):
The slide is hard to read, visually confusing, or clearly violates the business style contract.

2 (Below Average):
The slide is understandable but crowded, generic, or weakly aligned with the business style contract.

3 (Average):
The slide is readable and structurally acceptable, but it feels generic or underdesigned.

4 (Good):
The slide has clear hierarchy, strong readability, and generally matches the business style contract with only minor flaws.

5 (Excellent):
The slide is immediately understandable, visually disciplined, strongly aligned with the business style contract, and uses visuals to strengthen the business message.

Input description:
{{description}}
```
