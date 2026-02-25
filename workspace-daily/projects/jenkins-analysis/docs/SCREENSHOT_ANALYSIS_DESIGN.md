# Screenshot Comparison Analysis — Design Document

> **Feature:** LLM-powered judgement for image comparison failures in Android CI reports  
> **Status:** In Implementation  
> **Author:** Atlas Daily / Antigravity  
> **Date:** 2026-02-25

---

## 1. Problem Statement

The Android CI suite uses `odiff` (pixel-level image diff) to detect UI regressions in Dossier/MicroChart screenshots. When a test fails due to a screenshot mismatch, the current report shows only the raw failure logs:

```
Step - 7 screenShotOnSpecificField Fail
parameters:locatorType=CSS;imageCompareDiff={fullCompare_0=1.1078814338235294, fastCompare_0=0.03967524692416191};
locator=.mstrMobileMicroChartTooltip;value=MicroChartTooltip
Execution time=0.648s odiff's diffPercentage=3.03941549446% result is MatchNotEqual
```

**Pain point:** A human engineer has to manually decide whether each failure is:
- A **minimal pixel drift** (anti-aliasing, font rendering noise) → safely ignorable
- A **real visual regression** (layout shift, missing element, wrong color) → must be investigated

With 10-30 screenshot failures per CI run, this assessment consumes significant QA triage time.

---

## 2. Goals

| Goal | Priority |
|------|----------|
| Automatically classify each screenshot failure as "ignorable drift" or "real issue" | 🔴 P0 |
| Show the classification verdict prominently in the markdown report | 🔴 P0 |
| Show the raw comparison metrics in an interpretable table | 🔴 P0 |
| Provide reasoning so engineers can audit the AI's decision | 🔴 P0 |
| Keep the feature fast — use heuristics first, LLM only for ambiguous cases | 🟡 P1 |
| Support graceful degradation when LLM API is unavailable | 🟡 P1 |
| Embed images in the report when accessible | 🟢 P2 |

---

## 3. Architecture Overview

```
extent_failures.json
       │
       ▼
generate_android_report.mjs
       │  (for each screenshot_failure entry)
       ▼
screenshot_analyzer.js
  ├── parseImageCompareMetrics()   ← extract numbers from raw text
  ├── heuristicPreFilter()         ← rule-based fast path (no API cost)
  │       │ ambiguous?
  │       ▼ yes
  └── callLlmApi()                 ← OpenAI-compatible API (claude-3-5-haiku)
       │
       ▼
ScreenshotAnalysis object
  { verdict, confidence, reasoning, metrics, source }
       │
       ▼
renderScreenshotAnalysisMarkdown()
       │
       ▼
<details> block in .md report
  ├── AI verdict badge
  ├── Comparison metrics table
  └── Image links (if available)
```

---

## 4. Data Model

### 4.1 Input — `extent_failures.json` entry (screenshot_failure)

```json
{
  "jobName": "Library_Dossier_MicroChart",
  "buildNum": 697,
  "testResult": {
    "testName": "HTML_TAG_01_On_Row",
    "status": "FAIL",
    "tcId": "TC73228",
    "failedStepName": "screenShotOnSpecificField",
    "failedStepDetails": "Step - 7 screenShotOnSpecificField Fail\nparameters:locatorType=CSS;imageCompareDiff={fullCompare_0=1.1078814338235294, fastCompare_0=0.03967524692416191};locator=.mstrMobileMicroChartTooltip;value=MicroChartTooltip\nExecution time=0.648s odiff's diffPercentage=3.03941549446% result is MatchNotEqual Show mismatch <<>>"
  },
  "failureType": "screenshot_failure"
}
```

### 4.2 Parsed Metrics (`parseImageCompareMetrics`)

| Field | Source regex | Description |
|-------|-------------|-------------|
| `fullCompare` | `fullCompare_\d+=(\d+\.\d+)` | Normalized L2 pixel distance (0=identical, higher=more different) |
| `fastCompare` | `fastCompare_\d+=(\d+\.\d+)` | Hash-based fast similarity score |
| `diffPercentage` | `diffPercentage=([\d.]+)%` | % of pixels that differ (odiff output) |
| `isCrash` | `IllegalArgumentException`, `width must be`, `java.lang` | Screenshot could not be taken at all |
| `hasDiffData` | any of above is non-null | Whether valid metrics exist |

### 4.3 Output — `ScreenshotAnalysis`

```typescript
interface ScreenshotAnalysis {
  verdict:    'ignorable_drift' | 'real_issue' | 'crash' | 'unknown';
  confidence: 'high' | 'medium' | 'low';
  reasoning:  string;   // 1-2 sentence human-readable explanation
  metrics:    {
    fullCompare:     number | null;
    fastCompare:     number | null;
    diffPercentage:  number | null;
    hasDiffData:     boolean;
    isCrash:         boolean;
  };
  source: 'heuristic' | 'llm' | 'heuristic_fallback' | 'error';
}
```

---

## 5. Classification Logic

### 5.1 Three-stage pipeline

```
Stage 1: Crash detection
  isCrash == true → verdict: "crash" (no LLM needed)

Stage 2: Rule-based heuristic (no API cost)
  diffPercentage < 0.5% AND fullCompare < 0.1
    → verdict: "ignorable_drift", confidence: "high"

  diffPercentage > 5% OR fullCompare > 0.5
    → verdict: "real_issue", confidence: "high"

Stage 3: LLM judgement (ambiguous range: 0.5% – 5%)
  POST /v1/chat/completions (OpenAI-compatible)
  model: claude-3-5-haiku-20241022
  Context: metric values + expert QA system prompt
  → parse JSON response: { verdict, confidence, reasoning }
```

### 5.2 Threshold Rationale

| Threshold | Value | Rationale |
|-----------|-------|-----------|
| Ignore below | diffPct < 0.5% | Sub-pixel anti-aliasing; renders differently by OS/GPU version |
| Real above | diffPct > 5% | Layout shift, color change, missing element — clearly visible |
| LLM zone | 0.5% – 5% | Ambiguous — could be font rendering OR actual regression |
| fullCompare ignore | < 0.1 | Very close to identical at pixel level |
| fullCompare real | > 0.5 | Clearly visually different |

These thresholds are empirically tuned for **mobile Android MicroStrategy Library UI tests** on a specific device farm. They should be adjusted if the test environment changes significantly.

### 5.3 LLM Prompt Design

**System prompt** gives the LLM:
- Role: "senior QA engineer specializing in mobile Android visual regression testing"
- Metric definitions (what fullCompare / fastCompare / diffPercentage mean)
- Output format (strict JSON: `{"verdict":"...","confidence":"...","reasoning":"..."}`)

**User message** provides:
- Test name
- Metric values
- First 300 chars of raw failure snippet

**Model:** `claude-3-5-haiku-20241022` via `OPENAI_BASE_URL` (code-relay proxy)
- Chosen for low latency and low token cost — max_tokens=200
- One API call per ambiguous screenshot failure

### 5.4 Graceful Degradation

If the LLM call fails (network timeout, API error, JSON parse error):
- Fall back to a simple `diffPercentage < 2% → ignorable_drift` rule
- Mark `confidence: "low"`, `source: "heuristic_fallback"`
- Log the error but do NOT crash report generation

---

## 6. Report Output Enhancement

### 6.1 Where it appears

Inside each `<details>` block in **Section 4 (Detailed Failure Analysis)** of the markdown report, immediately after the raw failure log snippet.

### 6.2 Markdown structure

```markdown
<details>
<summary>HTML_TAG_01_On_Row — Failure Details</summary>

**TC ID:** TC73228
**Failed Step:** `screenShotOnSpecificField`
**Details:**
\```
Step - 7 screenShotOnSpecificField Fail
...
\```

#### 🤖 AI Image Comparison Analysis

| Field | Value |
|-------|-------|
| **Verdict** | 🔴 Real Production Issue |
| **Confidence** | 🟡 Medium |
| **Analysis Source** | 🧠 LLM (claude-3-5-haiku) |

**Reasoning:** diffPercentage of 3.04% combined with a fullCompare score of 1.10 indicates visible pixel changes beyond rendering noise. This warrants investigation as a potential layout regression.

##### 📊 Comparison Metrics

| Metric | Value | Interpretation |
|--------|-------|----------------|
| odiff diffPercentage | 3.0394% | 🟠 Moderate diff |
| fullCompare score | 1.107881 | 🔴 Significant |
| fastCompare score | 0.039675 | 🟢 Very similar |

</details>
```

### 6.3 Verdict display in Failure Summary Table

The **Section 2 Failure Summary Table** gains a new **"AI Verdict"** column for screenshot failures:

| Job | TC ID | Test Name | Failure Type | Failed Step | AI Verdict | Last Failed | Recurring |
|-----|-------|-----------|--------------|-------------|-----------|-------------|-----------|
| Library_… | TC73228 | HTML_TAG_01_On_Row | 📸 Screenshot | screenShotOnSpecificField | 🔴 Real Issue | 🆕 First | — |
| Library_… | TC73228 | Sparkline_01_… | 📸 Screenshot | screenShotOnSpecificField | ✅ Ignorable | 🆕 First | — |

---

## 7. Implementation Files

### New Files

| File | Purpose |
|------|---------|
| `scripts/android/screenshot_analyzer.js` | Core analysis module: metric parsing, heuristics, LLM call, markdown renderer |
| `scripts/tests/unit/screenshot_analyzer.test.js` | Unit tests for the analyzer |

### Modified Files

| File | Changes |
|------|---------|
| `scripts/generate_android_report.mjs` | Import screenshot_analyzer; call `analyzeAllScreenshotFailures()` before rendering; pass `screenshotAnalysis` to `buildDetailedSection()`; add AI Verdict column to summary table |

---

## 8. Configuration & Environment

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `OPENAI_API_KEY` | ✅ Yes (for LLM) | — | API key for OpenAI-compatible endpoint |
| `OPENAI_BASE_URL` | ❌ No | `https://api.openai.com/v1` | Override for proxy/relay endpoints |
| `SCREENSHOT_ANALYSIS_USE_LLM` | ❌ No | `true` | Set to `false` to disable LLM and use heuristics only |

The `OPENAI_API_KEY` and `OPENAI_BASE_URL` are already set in the system environment (via `~/.zshrc` or shell env), confirmed to be available.

---

## 9. Error Cases & Edge Cases

| Case | Handling |
|------|---------|
| `imageCompareDiff={}` (empty) | Detected as crash/infrastructure error; verdict="crash" |
| `IllegalArgumentException: width must be > 0` | Detected as crash; verdict="crash", separate message |
| LLM API timeout (>15s) | Fallback heuristic; confidence=low; no report failure |
| `OPENAI_API_KEY` not set | Heuristic-only mode; log warning |
| diffPercentage in ambiguous range, LLM returns invalid JSON | Fallback heuristic; log parse error |
| Multiple `fullCompare_N` entries (multi-image compare) | Current: takes first match. Future: could aggregate |

---

## 10. Testing Plan

See `scripts/tests/unit/screenshot_analyzer.test.js`.

### Unit test cases

| Test | Input | Expected verdict |
|------|-------|-----------------|
| Clear noise | diffPct=0.3%, fullCompare=0.05 | `ignorable_drift`, high confidence |
| Clear regression | diffPct=7%, fullCompare=0.8 | `real_issue`, high confidence |
| Bitmap crash | `IllegalArgumentException` | `crash`, high confidence |
| Empty diff | `imageCompareDiff={}` | `unknown` or `crash` |
| Ambiguous (mock LLM) | diffPct=2.5%, fullCompare=0.15 | LLM path called |
| No API key | diffPct=2.5%, no env var | `heuristic_fallback`, low confidence |

### Integration test

Re-run the existing `Library_Dossier_MicroChart_697` report generation and verify:
1. All 4 screenshot failures have a `screenshotAnalysis` block in the output `.md`
2. `TrendBar_02_NegativeValue` (which has `imageCompareDiff={}`) is classified as `crash`
3. At least one LLM call is made for the ambiguous cases

---

## 11. Performance Considerations

- **Heuristic path:** < 1ms per failure (pure JS, no network)
- **LLM path (ambiguous zone):** ~2-5s per failure (single HTTPS request, max_tokens=200)
- **Parallel batch:** Currently sequential. For CI with 20+ screenshot failures all in ambiguous range, total time could be 40-100s. Future: use `Promise.all()` with concurrency limiting.

For now, the sequential approach is acceptable because:
1. Most failures will be caught by heuristics (high or low side)
2. The overall report generation is already I/O-bound (Jenkins HTTP fetches)

---

## 12. Future Enhancements (P2/P3)

| Enhancement | Description |
|-------------|-------------|
| **Actual image embedding** | Extract image URLs from ExtentReport HTML (they're embedded as base64 or saved as `.png` files in the report zip). Embed in the `<details>` block. |
| **Trend analysis** | If the same test had a `real_issue` verdict in 3+ consecutive builds, flag as "persistent regression". |
| **Threshold auto-tuning** | Track historical verdicts vs human overrides (via a `verdicts` SQLite table). Adjust thresholds quarterly. |
| **Vision LLM** | When images are accessible, pass actual base64 image bytes to a vision model (claude-3-5-sonnet or gpt-4o) for pixel-level analysis. |
| **Slack/Feishu summary** | Include verdict distribution (N ignorable, M real) in the top-level Feishu notification. |
