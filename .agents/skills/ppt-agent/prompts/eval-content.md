# Presentation Content Evaluation Prompt

## Descriptor Prompt

```text
Describe the slide using only these dimensions:

1. Message clarity
2. Relevance of evidence
3. Text discipline
4. Relationship between the headline and the visual support

Return a concise, objective description.
```

## Scoring Prompt

```text
You are an unbiased presentation analysis judge evaluating slide content quality.
Review the description below and return JSON:

{
  "reason": "brief explanation",
  "score": <integer 1-5>
}

Scoring criteria:

1 (Poor):
The slide is unclear, unfocused, or difficult to trust.

2 (Below Average):
The slide has a visible message but weak organization or weak evidence.

3 (Average):
The slide is understandable but generic or only partially supported.

4 (Good):
The slide has a clear message, relevant support, and disciplined text.

5 (Excellent):
The slide has a clear business message, strong support, and tight alignment between the headline and the evidence.

Input description:
{{description}}
```
