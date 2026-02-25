'use strict';
/**
 * screenshot_analyzer.test.js
 *
 * Unit tests for scripts/android/screenshot_analyzer.js
 *
 * Tests cover:
 *   1. parseImageCompareMetrics — metric extraction from raw text
 *   2. heuristicPreFilter — rule-based verdict classification
 *   3. analyzeScreenshotFailure — end-to-end (heuristic path, no LLM)
 *   4. renderScreenshotAnalysisMarkdown — output format
 */

const {
  parseImageCompareMetrics,
  heuristicPreFilter,
  analyzeScreenshotFailure,
  renderScreenshotAnalysisMarkdown,
} = require('../../android/screenshot_analyzer');

// ---------------------------------------------------------------------------
// 1. parseImageCompareMetrics
// ---------------------------------------------------------------------------

describe('parseImageCompareMetrics', () => {
  test('extracts all three metrics from a full details string', () => {
    const details = `Step - 7 screenShotOnSpecificField Fail
parameters:locatorType=CSS;imageCompareDiff={fullCompare_0=1.1078814338235294, fastCompare_0=0.03967524692416191};
Execution time=0.648s odiff's diffPercentage=3.03941549446% result is MatchNotEqual Show mismatch <<>>`;

    const m = parseImageCompareMetrics(details);
    expect(m.fullCompare).toBeCloseTo(1.1078814, 5);
    expect(m.fastCompare).toBeCloseTo(0.03967524, 5);
    expect(m.diffPercentage).toBeCloseTo(3.03941, 4);
    expect(m.hasDiffData).toBe(true);
    expect(m.isCrash).toBe(false);
  });

  test('detects crash from IllegalArgumentException', () => {
    const details = `Step - 11 screenShotOnSpecificField Crash parameters:locatorType=CSS;imageCompareDiff={};
Execution time=0.0s java.lang.IllegalArgumentException: width must be > 0
at android.graphics.Bitmap.checkWidthHeight(Bitmap.java:447)`;

    const m = parseImageCompareMetrics(details);
    expect(m.isCrash).toBe(true);
    expect(m.hasDiffData).toBe(false);
  });

  test('handles low diffPercentage (noise level)', () => {
    const details = `imageCompareDiff={fullCompare_0=0.04, fastCompare_0=0.01} odiff's diffPercentage=0.3%`;
    const m = parseImageCompareMetrics(details);
    expect(m.diffPercentage).toBeCloseTo(0.3, 2);
    expect(m.fullCompare).toBeCloseTo(0.04, 3);
    expect(m.hasDiffData).toBe(true);
    expect(m.isCrash).toBe(false);
  });

  test('returns null fields for completely empty details', () => {
    const m = parseImageCompareMetrics('');
    expect(m.fullCompare).toBeNull();
    expect(m.fastCompare).toBeNull();
    expect(m.diffPercentage).toBeNull();
    expect(m.hasDiffData).toBe(false);
    expect(m.isCrash).toBe(false);
  });

  test('returns null fields for empty imageCompareDiff={}', () => {
    const m = parseImageCompareMetrics('imageCompareDiff={}');
    expect(m.hasDiffData).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 2. heuristicPreFilter
// ---------------------------------------------------------------------------

describe('heuristicPreFilter', () => {
  test('classifies crash immediately', () => {
    const metrics = parseImageCompareMetrics(
      'java.lang.IllegalArgumentException: width must be > 0'
    );
    const result = heuristicPreFilter(metrics);
    expect(result).not.toBeNull();
    expect(result.verdict).toBe('crash');
    expect(result.confidence).toBe('high');
  });

  test('classifies ignorable_drift for very low diff (< 0.5%)', () => {
    const metrics = {
      fullCompare: 0.05, fastCompare: 0.01,
      diffPercentage: 0.3, hasDiffData: true, isCrash: false,
    };
    const result = heuristicPreFilter(metrics);
    expect(result).not.toBeNull();
    expect(result.verdict).toBe('ignorable_drift');
    expect(result.confidence).toBe('high');
  });

  test('classifies real_issue for high diffPercentage (> 5%)', () => {
    const metrics = {
      fullCompare: 0.7, fastCompare: 0.2,
      diffPercentage: 7.5, hasDiffData: true, isCrash: false,
    };
    const result = heuristicPreFilter(metrics);
    expect(result).not.toBeNull();
    expect(result.verdict).toBe('real_issue');
    expect(result.confidence).toBe('high');
  });

  test('classifies real_issue when fullCompare alone is > 0.5', () => {
    const metrics = {
      fullCompare: 0.8, fastCompare: 0.05,
      diffPercentage: 2.0, hasDiffData: true, isCrash: false,
    };
    const result = heuristicPreFilter(metrics);
    expect(result).not.toBeNull();
    expect(result.verdict).toBe('real_issue');
  });

  test('returns null for ambiguous range (needs LLM)', () => {
    const metrics = {
      fullCompare: 0.08, fastCompare: 0.025,
      diffPercentage: 1.7, hasDiffData: true, isCrash: false,
    };
    const result = heuristicPreFilter(metrics);
    expect(result).toBeNull();  // → LLM path
  });

  test('unknown verdict when hasDiffData is false', () => {
    const metrics = {
      fullCompare: null, fastCompare: null,
      diffPercentage: null, hasDiffData: false, isCrash: false,
    };
    const result = heuristicPreFilter(metrics);
    expect(result).not.toBeNull();
    expect(result.verdict).toBe('unknown');
  });
});

// ---------------------------------------------------------------------------
// 3. analyzeScreenshotFailure (heuristic-only mode, no API call)
// ---------------------------------------------------------------------------

describe('analyzeScreenshotFailure', () => {
  const NO_LLM = { useLlm: false };

  test('returns ignorable_drift for sub-threshold diffPercentage', async () => {
    const details = `imageCompareDiff={fullCompare_0=0.04, fastCompare_0=0.01} odiff's diffPercentage=0.3%`;
    const result = await analyzeScreenshotFailure('MyTest', details, NO_LLM);
    expect(result.verdict).toBe('ignorable_drift');
    expect(result.confidence).toBe('high');
    expect(result.source).toBe('heuristic');
  });

  test('returns real_issue for clearly high diffPercentage', async () => {
    const details = `imageCompareDiff={fullCompare_0=0.8, fastCompare_0=0.3} odiff's diffPercentage=8.5%`;
    const result = await analyzeScreenshotFailure('MyTest', details, NO_LLM);
    expect(result.verdict).toBe('real_issue');
    expect(result.confidence).toBe('high');
    expect(result.source).toBe('heuristic');
  });

  test('returns crash for bitmap exception', async () => {
    const details = `java.lang.IllegalArgumentException: width must be > 0 at android.graphics.Bitmap`;
    const result = await analyzeScreenshotFailure('TrendBar_02_NegativeValue', details, NO_LLM);
    expect(result.verdict).toBe('crash');
    expect(result.source).toBe('heuristic');
    expect(result.reasoning).toMatch(/crash/i);
  });

  test('returns heuristic_fallback for ambiguous range when LLM disabled', async () => {
    const details = `imageCompareDiff={fullCompare_0=0.08, fastCompare_0=0.025} odiff's diffPercentage=1.7%`;
    const result = await analyzeScreenshotFailure('SparklineTest', details, NO_LLM);
    // ambiguous range → no LLM → fallback
    expect(result.source).toBe('heuristic_fallback');
    expect(result.confidence).toBe('low');
    expect(['ignorable_drift', 'real_issue', 'unknown']).toContain(result.verdict);
  });

  test('populates metrics object correctly', async () => {
    const details = `imageCompareDiff={fullCompare_0=0.08489716032298254, fastCompare_0=0.024676349014043808} odiff's diffPercentage=1.70415109306%`;
    const result = await analyzeScreenshotFailure('Sparkline_01_AttributeForm', details, NO_LLM);
    expect(result.metrics.diffPercentage).toBeCloseTo(1.704, 2);
    expect(result.metrics.fullCompare).toBeCloseTo(0.08489, 4);
    expect(result.metrics.fastCompare).toBeCloseTo(0.02467, 4);
  });
});

// ---------------------------------------------------------------------------
// 4. renderScreenshotAnalysisMarkdown
// ---------------------------------------------------------------------------

describe('renderScreenshotAnalysisMarkdown', () => {
  const mockAnalysis = {
    verdict:    'real_issue',
    confidence: 'medium',
    reasoning:  'Diff percentage of 3.04% exceeds the threshold for rendering noise.',
    metrics: {
      fullCompare: 1.1078,
      fastCompare: 0.0396,
      diffPercentage: 3.039,
      hasDiffData: true,
      isCrash: false,
    },
    source: 'llm',
  };

  test('contains the verdict label', () => {
    const md = renderScreenshotAnalysisMarkdown(mockAnalysis);
    expect(md).toContain('🔴 Real Production Issue');
  });

  test('contains the confidence label', () => {
    const md = renderScreenshotAnalysisMarkdown(mockAnalysis);
    expect(md).toContain('🟡 Medium');
  });

  test('contains the reasoning', () => {
    const md = renderScreenshotAnalysisMarkdown(mockAnalysis);
    expect(md).toContain('Diff percentage of 3.04%');
  });

  test('contains the metrics table', () => {
    const md = renderScreenshotAnalysisMarkdown(mockAnalysis);
    expect(md).toContain('odiff diffPercentage');
    expect(md).toContain('fullCompare score');
    expect(md).toContain('fastCompare score');
    expect(md).toContain('🟠 Moderate diff');  // 3.039% → moderate
  });

  test('shows LLM source correctly', () => {
    const md = renderScreenshotAnalysisMarkdown(mockAnalysis);
    expect(md).toContain('🧠 LLM');
  });

  test('shows heuristic source correctly', () => {
    const md = renderScreenshotAnalysisMarkdown({ ...mockAnalysis, source: 'heuristic' });
    expect(md).toContain('📏 Rule-based Heuristic');
  });

  test('renders ignorable_drift verdict', () => {
    const md = renderScreenshotAnalysisMarkdown({ ...mockAnalysis, verdict: 'ignorable_drift' });
    expect(md).toContain('✅ Ignorable Drift');
  });

  test('renders crash verdict with warning note', () => {
    const crashAnalysis = {
      ...mockAnalysis,
      verdict: 'crash',
      metrics: { ...mockAnalysis.metrics, isCrash: true, hasDiffData: false },
    };
    const md = renderScreenshotAnalysisMarkdown(crashAnalysis);
    expect(md).toContain('💥 Crash');
    expect(md).toContain('test infrastructure crash');
  });

  test('returns empty string for null analysis', () => {
    const md = renderScreenshotAnalysisMarkdown(null);
    expect(md).toBe('');
  });

  test('embeds image links when provided', () => {
    const imageUrls = [
      'http://ci-master/job/Foo/1/ExtentReport/baseline.png',
      'http://ci-master/job/Foo/1/ExtentReport/diff.png',
    ];
    const md = renderScreenshotAnalysisMarkdown(mockAnalysis, imageUrls);
    expect(md).toContain('🖼️ Screenshot Comparison Images');
    expect(md).toContain('[View](http://ci-master/job/Foo/1/ExtentReport/baseline.png)');
    expect(md).toContain('[View](http://ci-master/job/Foo/1/ExtentReport/diff.png)');
  });
});
