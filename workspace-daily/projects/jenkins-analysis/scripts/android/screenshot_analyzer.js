'use strict';
/**
 * screenshot_analyzer.js
 *
 * LLM-powered screenshot comparison analyser for Android CI failures.
 *
 * Given a failedStepDetails string that contains odiff metrics like:
 *   "imageCompareDiff={fullCompare_0=1.107..., fastCompare_0=0.039...} odiff's diffPercentage=3.03%"
 *
 * This module:
 *   1. Parses the numeric comparison metrics out of the raw text
 *   2. Calls the OpenAI-compatible LLM API with expert QA context
 *   3. Returns a structured verdict: "ignorable_drift" | "real_issue" | "crash" | "unknown"
 *      plus a brief reasoning string and raw metrics
 *
 * The LLM is given ONLY the numbers + context — not the actual pixel image —
 * because images are behind Jenkins auth. Image URLs are optionally attached
 * for embedding in the markdown report.
 */

const https = require('https');
const http  = require('http');
const url   = require('url');

// ---------------------------------------------------------------------------
// Metric parsing
// ---------------------------------------------------------------------------

/**
 * Parse odiff / imageCompareDiff metrics out of a failedStepDetails string.
 *
 * Handles formats like:
 *   imageCompareDiff={fullCompare_0=1.1078814338235294, fastCompare_0=0.03967524692416191}
 *   odiff's diffPercentage=3.03941549446%
 *
 * @param {string} details
 * @returns {{ fullCompare: number|null, fastCompare: number|null, diffPercentage: number|null, hasDiffData: boolean, isCrash: boolean }}
 */
const parseImageCompareMetrics = (details) => {
  const text = String(details || '');

  // Detect crash / no image data
  const isCrash = text.includes('IllegalArgumentException') ||
                  text.includes('width must be') ||
                  text.includes('java.lang') ||
                  (text.includes('Crash') && !text.includes('imageCompareDiff'));

  // fullCompare_0
  const fcMatch = text.match(/fullCompare_\d+\s*=\s*([\d.]+)/);
  const fullCompare = fcMatch ? parseFloat(fcMatch[1]) : null;

  // fastCompare_0
  const fcFastMatch = text.match(/fastCompare_\d+\s*=\s*([\d.]+)/);
  const fastCompare = fcFastMatch ? parseFloat(fcFastMatch[1]) : null;

  // odiff diffPercentage
  const pctMatch = text.match(/diffPercentage\s*=\s*([\d.]+)\s*%/i);
  const diffPercentage = pctMatch ? parseFloat(pctMatch[1]) : null;

  const hasDiffData = fullCompare !== null || fastCompare !== null || diffPercentage !== null;

  return { fullCompare, fastCompare, diffPercentage, hasDiffData, isCrash };
};

// ---------------------------------------------------------------------------
// Heuristic pre-filter (fast, no LLM cost)
// ---------------------------------------------------------------------------

/**
 * Rule-based pre-classification before calling LLM.
 * Returns a pre-verdict string or null if LLM is needed.
 *
 * Thresholds (empirically tuned for mobile Android UI tests):
 *   - diffPercentage < 0.5%  AND fullCompare < 0.1  → definitively ignorable
 *   - diffPercentage > 5%    OR  fullCompare > 0.5   → definitively real issue
 *   - isCrash → crash (not a compare fail at all)
 *   - else → ambiguous, send to LLM
 *
 * @param {{ fullCompare, fastCompare, diffPercentage, hasDiffData, isCrash }} metrics
 * @returns {{ verdict: string, confidence: string, reasoning: string } | null}
 */
const heuristicPreFilter = (metrics) => {
  if (metrics.isCrash) {
    return {
      verdict: 'crash',
      confidence: 'high',
      reasoning: 'Test crashed before screenshot could be taken (e.g., Bitmap width=0). This is a test infrastructure issue, not a visual regression.',
    };
  }

  if (!metrics.hasDiffData) {
    return {
      verdict: 'unknown',
      confidence: 'low',
      reasoning: 'No image comparison metrics found in the failure details. Cannot determine severity.',
    };
  }

  const { diffPercentage, fullCompare } = metrics;

  if (diffPercentage !== null && diffPercentage < 0.5 &&
      (fullCompare === null || fullCompare < 0.1)) {
    return {
      verdict: 'ignorable_drift',
      confidence: 'high',
      reasoning: `diffPercentage=${diffPercentage.toFixed(2)}% is below the 0.5% threshold. This is sub-pixel anti-aliasing or rendering timing noise — safely ignorable.`,
    };
  }

  if ((diffPercentage !== null && diffPercentage > 5) ||
      (fullCompare !== null && fullCompare > 0.5)) {
    return {
      verdict: 'real_issue',
      confidence: 'high',
      reasoning: `diffPercentage=${diffPercentage !== null ? diffPercentage.toFixed(2) + '%' : 'N/A'}, fullCompare=${fullCompare !== null ? fullCompare.toFixed(4) : 'N/A'}. Exceeds the 5% / 0.5 threshold — likely a genuine visual regression.`,
    };
  }

  return null; // needs LLM
};

// ---------------------------------------------------------------------------
// LLM call
// ---------------------------------------------------------------------------

/**
 * Build a human-readable reasoning string from raw metrics.
 * Used as fallback when LLM response is absent or truncated.
 *
 * @param {string} verdict
 * @param {{ diffPercentage, fullCompare, fastCompare }} metrics
 * @returns {string}
 */
const buildReasoningFromMetrics = (verdict, metrics) => {
  const { diffPercentage, fullCompare, fastCompare } = metrics || {};
  const pctStr = diffPercentage != null ? `diffPercentage=${diffPercentage.toFixed(2)}%` : null;
  const fcStr  = fullCompare    != null ? `fullCompare=${fullCompare.toFixed(4)}` : null;
  const parts  = [pctStr, fcStr].filter(Boolean).join(', ');

  if (verdict === 'ignorable_drift') {
    return `Metrics (${parts}) are within the minor-difference range — likely sub-pixel rendering noise or anti-aliasing variation, not a visual regression.`;
  }
  if (verdict === 'real_issue') {
    return `Metrics (${parts}) exceed acceptable thresholds — likely a genuine visual change (layout shift, color, or missing element) that warrants investigation.`;
  }
  return `Metrics (${parts}). Classification determined by LLM.`;
};

/**
 * Build the LLM system prompt for screenshot comparison judgement.
 */
const buildLlmPrompt = (testName, metrics, rawDetails) => {
  const { fullCompare, fastCompare, diffPercentage } = metrics;
  const metricsStr = [
    diffPercentage !== null ? `odiff diffPercentage: ${diffPercentage.toFixed(4)}%` : null,
    fullCompare    !== null ? `fullCompare score:    ${fullCompare.toFixed(6)}` : null,
    fastCompare    !== null ? `fastCompare score:    ${fastCompare.toFixed(6)}` : null,
  ].filter(Boolean).join('\n');

  return {
    system: `You are a QA engineer analyzing mobile Android screenshot comparison failures.

Metrics:
- diffPercentage: % pixels different. <1% = noise, 1-3% = minor, >3% = significant.
- fullCompare: L2 pixel distance. <0.1 = very close, >0.5 = clearly different.
- fastCompare: hash similarity. <0.05 = very similar.

Classify as:
- "ignorable_drift": sub-pixel noise, anti-aliasing, font rendering. Not a real bug.
- "real_issue": layout change, missing element, color shift. Needs investigation.

Reply ONLY with this JSON (no extra text, no markdown):
{"verdict":"ignorable_drift","confidence":"high","reasoning":"15 words max explaining why"}`,
    user: `Test name: ${testName}

Comparison metrics:
${metricsStr}

Raw failure snippet:
${String(rawDetails || '').slice(0, 300)}

Classify this failure.`,
  };
};

/**
 * Call the OpenAI-compatible API.
 * Uses OPENAI_BASE_URL and OPENAI_API_KEY from environment.
 *
 * @param {object} prompt - { system, user }
 * @param {object} metrics - parsed comparison metrics (for fallback reasoning)
 * @returns {Promise<{ verdict, confidence, reasoning }>}
 */
const callLlmApi = (prompt, metrics) => {
  return new Promise((resolve, reject) => {
    const apiKey  = process.env.OPENAI_API_KEY;
    const baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';

    if (!apiKey) {
      return reject(new Error('OPENAI_API_KEY not set'));
    }

    const body = JSON.stringify({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 400,
      temperature: 0,
      messages: [
        { role: 'system', content: prompt.system },
        { role: 'user',   content: prompt.user   },
      ],
    });

    const parsed  = url.parse(`${baseUrl}/chat/completions`);
    const isHttps = parsed.protocol === 'https:';
    const options = {
      hostname: parsed.hostname,
      port:     parsed.port || (isHttps ? 443 : 80),
      path:     parsed.path,
      method:   'POST',
      headers:  {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const transport = isHttps ? https : http;
    const req = transport.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json    = JSON.parse(data);
          const content = (json.choices?.[0]?.message?.content || '').trim();
          // Primary: full JSON parse
          try {
            const parsed = JSON.parse(content);
            return resolve({
              verdict:    parsed.verdict    || 'unknown',
              confidence: parsed.confidence || 'low',
              reasoning:  parsed.reasoning  || 'No reasoning provided.',
            });
          } catch (_) { /* fall through to regex extraction */ }
          // Fallback: extract fields via regex (handles truncated responses)
          const vMatch = content.match(/"verdict"\s*:\s*"([^"]+)"/);
          const cMatch = content.match(/"confidence"\s*:\s*"([^"]+)"/);
          // Try to get full reasoning (with closing quote); also try partial (no closing quote)
          const rMatchFull    = content.match(/"reasoning"\s*:\s*"([^"]+)"/);
          const rMatchPartial = content.match(/"reasoning"\s*:\s*"([^"]{3,})/);
          if (vMatch) {
            const verdict = vMatch[1] || 'unknown';
            // Build reasoning: prefer full extracted string, fall back to metric-based
            let reasoning = rMatchFull?.[1] || rMatchPartial?.[1];
            if (!reasoning || reasoning.length < 10) {
              reasoning = buildReasoningFromMetrics(verdict, metrics);
            }
            return resolve({
              verdict,
              confidence: cMatch?.[1] || 'medium',
              reasoning,
            });
          }
          reject(new Error(`LLM response parse error — raw: ${data.slice(0, 200)}`));
        } catch (e) {
          reject(new Error(`LLM response parse error: ${e.message} — raw: ${data.slice(0, 200)}`));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('LLM API timeout')); });
    req.write(body);
    req.end();
  });
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Analyse a screenshot comparison failure.
 *
 * @param {string} testName
 * @param {string} failedStepDetails  — raw string from ExtentReport / extent_failures.json
 * @param {object} [options]
 * @param {boolean} [options.useLlm=true]  — set false to use heuristics only (faster, no API cost)
 * @returns {Promise<ScreenshotAnalysis>}
 *
 * @typedef {{ verdict: string, confidence: string, reasoning: string, metrics: object, source: string }} ScreenshotAnalysis
 */
const analyzeScreenshotFailure = async (testName, failedStepDetails, options = {}) => {
  const useLlm = options.useLlm !== false;
  const metrics = parseImageCompareMetrics(failedStepDetails);

  // 1. Fast heuristic path
  const pre = heuristicPreFilter(metrics);
  if (pre) {
    return { ...pre, metrics, source: 'heuristic' };
  }

  // 2. LLM path
  if (!useLlm) {
    return {
      verdict:    'unknown',
      confidence: 'low',
      reasoning:  `Metrics are in the ambiguous range (diffPct=${metrics.diffPercentage?.toFixed(2)}%, fullCompare=${metrics.fullCompare?.toFixed(4)}). LLM analysis disabled.`,
      metrics,
      source: 'heuristic_fallback',
    };
  }

  try {
    const prompt = buildLlmPrompt(testName, metrics, failedStepDetails);
    const llmResult = await callLlmApi(prompt, metrics);
    return { ...llmResult, metrics, source: 'llm' };
  } catch (err) {
    console.warn(`[ScreenshotAnalyzer] LLM call failed for "${testName}": ${err.message}`);
    // graceful degradation
    const { diffPercentage, fullCompare } = metrics;
    const verdict = (diffPercentage !== null && diffPercentage < 2) ? 'ignorable_drift' : 'real_issue';
    return {
      verdict,
      confidence: 'low',
      reasoning:  `LLM unavailable (${err.message}). Fallback: diffPercentage=${diffPercentage?.toFixed(2) ?? 'N/A'}%.`,
      metrics,
      source: 'heuristic_fallback',
    };
  }
};

/**
 * Batch-analyse an array of failure entries from extent_failures.json.
 * Only processes screenshot_failure entries; others are returned as-is with analysis=null.
 *
 * @param {object[]} failureEntries
 * @param {object}   [options]
 * @returns {Promise<object[]>}  same array with `.screenshotAnalysis` added where applicable
 */
const analyzeAllScreenshotFailures = async (failureEntries, options = {}) => {
  const enriched = [];
  for (const entry of failureEntries) {
    if (entry.failureType !== 'screenshot_failure') {
      enriched.push({ ...entry, screenshotAnalysis: null });
      continue;
    }

    const details = entry.testResult?.failedStepDetails || '';
    const testName = entry.testResult?.testName || entry.jobName || 'unknown';

    try {
      const analysis = await analyzeScreenshotFailure(testName, details, options);
      enriched.push({ ...entry, screenshotAnalysis: analysis });
    } catch (err) {
      enriched.push({
        ...entry,
        screenshotAnalysis: {
          verdict: 'unknown', confidence: 'low',
          reasoning: `Analysis error: ${err.message}`,
          metrics: parseImageCompareMetrics(details),
          source: 'error',
        },
      });
    }
  }
  return enriched;
};

// ---------------------------------------------------------------------------
// Markdown rendering helpers (used by generate_android_report.mjs)
// ---------------------------------------------------------------------------

const VERDICT_LABELS = {
  ignorable_drift: '✅ Ignorable Drift',
  real_issue:      '🔴 Real Production Issue',
  crash:           '💥 Crash / Infrastructure Error',
  unknown:         '❓ Unknown',
};

const CONFIDENCE_LABELS = {
  high:   '🟢 High',
  medium: '🟡 Medium',
  low:    '🔴 Low',
};

/**
 * Render the screenshot analysis block as Markdown (for use inside <details>).
 *
 * @param {ScreenshotAnalysis} analysis
 * @param {string[]}           [imageUrls]  optional list of image URLs to embed
 * @returns {string}
 */
const renderScreenshotAnalysisMarkdown = (analysis, imageUrls = []) => {
  if (!analysis) return '';

  const { verdict, confidence, reasoning, metrics, source } = analysis;

  let md = `\n#### 🤖 AI Image Comparison Analysis\n\n`;
  md += `| Field | Value |\n`;
  md += `|-------|-------|\n`;
  md += `| **Verdict** | ${VERDICT_LABELS[verdict] || verdict} |\n`;
  md += `| **Confidence** | ${CONFIDENCE_LABELS[confidence] || confidence} |\n`;
  md += `| **Analysis Source** | ${source === 'llm' ? '🧠 LLM (claude-3-5-haiku)' : '📏 Rule-based Heuristic'} |\n`;
  md += `\n**Reasoning:** ${reasoning}\n`;

  if (metrics && metrics.hasDiffData) {
    md += `\n##### 📊 Comparison Metrics\n\n`;
    md += `| Metric | Value | Interpretation |\n`;
    md += `|--------|-------|----------------|\n`;

    if (metrics.diffPercentage !== null) {
      const pct = metrics.diffPercentage;
      const interp = pct < 0.5 ? '🟢 Noise level' : pct < 2 ? '🟡 Minor diff' : pct < 5 ? '🟠 Moderate diff' : '🔴 Major diff';
      md += `| odiff diffPercentage | ${pct.toFixed(4)}% | ${interp} |\n`;
    }
    if (metrics.fullCompare !== null) {
      const fc = metrics.fullCompare;
      const interp = fc < 0.05 ? '🟢 Nearly identical' : fc < 0.15 ? '🟡 Minor' : fc < 0.5 ? '🟠 Noticeable' : '🔴 Significant';
      md += `| fullCompare score | ${fc.toFixed(6)} | ${interp} |\n`;
    }
    if (metrics.fastCompare !== null) {
      const fsc = metrics.fastCompare;
      const interp = fsc < 0.03 ? '🟢 Very similar' : fsc < 0.08 ? '🟡 Slight diff' : '🔴 Different';
      md += `| fastCompare score | ${fsc.toFixed(6)} | ${interp} |\n`;
    }
  }

  if (metrics && metrics.isCrash) {
    md += `\n> ⚠️ **Note:** This failure is a test infrastructure crash, not a visual comparison failure. The screenshot could not be captured.\n`;
  }

  if (imageUrls && imageUrls.length > 0) {
    md += `\n##### 🖼️ Screenshot Comparison Images\n\n`;
    imageUrls.forEach((imgUrl, i) => {
      md += `**Image ${i + 1}:** [View](${imgUrl})\n\n`;
    });
  }

  return md;
};

module.exports = {
  parseImageCompareMetrics,
  heuristicPreFilter,
  analyzeScreenshotFailure,
  analyzeAllScreenshotFailures,
  renderScreenshotAnalysisMarkdown,
};
