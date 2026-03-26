# Presentation Coherence Evaluation Prompt

## Extraction Prompt

```text
Extract the following from this presentation transcript and return JSON:
{
  "title": "presentation title",
  "slides": [
    { "number": 1, "heading": "slide heading", "key_points": ["point 1", "point 2"] }
  ],
  "background": {
    "speaker": "speaker name or null",
    "institution": "org or null",
    "date": "date or null"
  }
}

Presentation transcript:
{{presentation}}
```

## Scoring Prompt

```text
You are an unbiased presentation analysis judge evaluating deck coherence.
Review the extracted structure and return JSON:

{
  "reason": "brief explanation",
  "score": <integer 1-5>
}

Scoring criteria:

1 (Poor):
The deck feels chaotic or contradictory.

2 (Below Average):
The deck is partly structured but has weak transitions or unclear sequencing.

3 (Average):
The deck has a visible structure but the narrative spine is only moderately strong.

4 (Good):
The deck is clearly sequenced and supports a coherent decision-oriented narrative.

5 (Excellent):
The deck has a strong narrative spine, disciplined section flow, and a closing that resolves the opening promise.

Input:
{{presentation}}
```
