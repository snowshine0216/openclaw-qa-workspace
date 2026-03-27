#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RISK_ORDER = new Map([
  ['CRITICAL', 4],
  ['HIGH', 3],
  ['MEDIUM', 2],
  ['LOW', 1],
]);

function safeReadJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return null;
  }
}

function sortFeatures(features) {
  return [...features].sort((left, right) => {
    const leftRisk = RISK_ORDER.get(left.risk_level) ?? 0;
    const rightRisk = RISK_ORDER.get(right.risk_level) ?? 0;
    return (
      rightRisk - leftRisk ||
      (right.open_high_defects ?? 0) - (left.open_high_defects ?? 0) ||
      (right.open_defects ?? 0) - (left.open_defects ?? 0)
    );
  });
}

function aggregateTotals(features) {
  return features.reduce(
    (totals, feature) => ({
      total_defects: totals.total_defects + (feature.total_defects ?? 0),
      open_defects: totals.open_defects + (feature.open_defects ?? 0),
      open_high_defects: totals.open_high_defects + (feature.open_high_defects ?? 0),
    }),
    { total_defects: 0, open_defects: 0, open_high_defects: 0 },
  );
}

function hotspotRows(features) {
  const hotspots = new Map();
  for (const feature of features) {
    for (const area of feature.top_risk_areas ?? []) {
      hotspots.set(area, (hotspots.get(area) ?? 0) + 1);
    }
  }
  const ranked = [...hotspots.entries()].sort((left, right) => right[1] - left[1]);
  if (ranked.length === 0) {
    return '| Area | Features |\n|------|----------|\n| General | 0 |';
  }
  const rows = ranked.map(([area, count]) => `| ${area} | ${count} |`).join('\n');
  return `| Area | Features |\n|------|----------|\n${rows}`;
}

function loadFeatureSummaryJson(feature) {
  const summaryPath =
    feature.feature_summary_path ??
    (feature.canonical_run_dir ? join(feature.canonical_run_dir, 'context', 'feature_summary.json') : null);
  return summaryPath ? safeReadJson(summaryPath) ?? {} : {};
}

function loadPrSummaryJson(feature) {
  if (!feature.canonical_run_dir) return {};
  return safeReadJson(join(feature.canonical_run_dir, 'context', 'pr_impact_summary.json')) ?? {};
}

function buildRiskAnalysisSection(features) {
  const rows = [];
  const hotspotMap = new Map();

  for (const feature of features) {
    const featureSummary = loadFeatureSummaryJson(feature);
    const areas = featureSummary.top_risk_areas ?? feature.top_risk_areas ?? [];
    const openHigh = feature.open_high_defects ?? 0;
    const open = feature.open_defects ?? 0;
    const risk = feature.risk_level ?? 'LOW';

    rows.push(
      `| ${feature.feature_key} | ${feature.feature_title} | ${risk} | ${open} open / ${openHigh} high | ${areas.length > 0 ? areas.join(', ') : '—'} |`,
    );
    for (const area of areas) {
      hotspotMap.set(area, (hotspotMap.get(area) ?? 0) + 1);
    }
  }

  const hotspotRanked = [...hotspotMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([area, count]) => `| ${area} | ${count} feature(s) |`)
    .join('\n');

  const tableHeader =
    '| Feature | Title | Risk | Defect State | Hotspot Areas |\n|---------|-------|------|--------------|---------------|';
  const featureTable = rows.length > 0 ? `${tableHeader}\n${rows.join('\n')}` : `${tableHeader}\n| — | — | — | — | — |`;

  const hotspotTable =
    hotspotRanked.length > 0
      ? `### Cross-Feature Hotspots\n\n| Functional Area | Affected Features |\n|----------------|-------------------|\n${hotspotRanked}`
      : '';

  return `${featureTable}\n\n${hotspotTable}`.trim();
}

function buildCodeChangeSection(features) {
  const allRepos = new Set();
  const featureRows = [];
  const prDetails = [];

  for (const feature of features) {
    const prSummary = loadPrSummaryJson(feature);
    const repos = prSummary.repos_changed ?? feature.repos_changed ?? [];
    for (const repo of repos) allRepos.add(repo);

    const prCount = prSummary.pr_count ?? feature.pr_count ?? 0;
    featureRows.push(
      `| ${feature.feature_key} | ${feature.feature_title} | ${prCount} | ${repos.length > 0 ? repos.join(', ') : '—'} | ${feature.risk_level ?? '—'} |`,
    );

    const topPrs = (prSummary.top_risky_prs ?? []).filter((pr) => pr.title);
    if (topPrs.length > 0) {
      prDetails.push(`**${feature.feature_key}** — ${feature.feature_title}`);
      for (const pr of topPrs.slice(0, 3)) {
        const riskEmoji = pr.risk_level === 'HIGH' ? '🔴' : pr.risk_level === 'LOW' ? '🟢' : '🟡';
        prDetails.push(`- PR #${pr.number ?? '—'} — ${pr.title} (${riskEmoji} ${pr.risk_level ?? 'MEDIUM'})`);
      }
    }
  }

  const tableHeader =
    '| Feature | Title | PRs | Repos Changed | Risk |\n|---------|-------|-----|---------------|------|';
  const table = featureRows.length > 0 ? `${tableHeader}\n${featureRows.join('\n')}` : `${tableHeader}\n| — | — | 0 | — | — |`;
  const allReposList = allRepos.size > 0 ? `\n**All repositories changed:** ${[...allRepos].join(', ')}` : '';
  const prSection = prDetails.length > 0 ? `\n\n### Notable PRs by Feature\n\n${prDetails.join('\n')}` : '';

  return `${table}${allReposList}${prSection}`;
}

function buildResidualRiskSection(features) {
  const sections = [];
  for (const feature of features.filter((f) => (f.risk_level ?? 'LOW') !== 'LOW')) {
    const featureSummary = loadFeatureSummaryJson(feature);
    const areas = featureSummary.top_risk_areas ?? feature.top_risk_areas ?? [];
    const blockingCount = (feature.blocking_defect_details ?? []).length;
    const openHigh = feature.open_high_defects ?? 0;

    const bullets = [];
    if (blockingCount > 0) {
      bullets.push(
        `- **${blockingCount} blocking defect(s) unresolved:** ${feature.blocking_defect_details.map((d) => d.key).join(', ')}`,
      );
    }
    if (openHigh > 0) {
      bullets.push(`- ${openHigh} high-priority open defect(s) require targeted regression testing`);
    }
    if (areas.length > 0) {
      bullets.push(`- Risk concentrated in: ${areas.join(', ')}`);
    }

    if (bullets.length > 0) {
      sections.push(`**${feature.feature_key}** — ${feature.feature_title} (${feature.risk_level})\n${bullets.join('\n')}`);
    }
  }

  if (sections.length === 0) {
    return 'No HIGH/CRITICAL risk features. All features are LOW risk — standard release verification applies.';
  }

  return sections.join('\n\n');
}

function buildVerificationChecklist(features, runKey) {
  const lines = [];
  for (const feature of features) {
    const blockingDefects = feature.blocking_defect_details ?? [];
    if (blockingDefects.length > 0) {
      for (const defect of blockingDefects) {
        lines.push(
          `- [ ] **${defect.key}** (${feature.feature_key}) — ${defect.summary || defect.key} | ${defect.priority ?? 'High'} | Status: ${defect.status ?? 'Open'}`,
        );
      }
    }
  }

  if (lines.length > 0) {
    lines.push('');
    lines.push('**General:**');
  }
  lines.push(`- [ ] All feature packets verified under ${runKey}/features/`);
  lines.push('- [ ] Blocking defect status re-confirmed with assignees before release gate');
  lines.push('- [ ] Regression smoke test run on HIGH-risk features');
  lines.push('- [ ] Cross-feature functional hotspot areas tested (see Section 4)');

  return lines.join('\n');
}

function buildEnvRecommendations(features) {
  const repos = new Set();
  for (const feature of features) {
    for (const repo of feature.repos_changed ?? []) repos.add(repo);
  }
  const lines = [
    '- Validate in a release candidate environment with all merged PRs included.',
    `- Repos with changes this release: ${repos.size > 0 ? [...repos].join(', ') : 'see feature packets'}`,
    '- Run regression tests on all HIGH-risk feature flows.',
    '- Test cross-platform consistency (Webstation vs Workstation) where applicable.',
    '- Use throttled network for timing-dependent scenarios.',
  ];
  return lines.join('\n');
}

function loadFeatureTitle(runDir, featureKey, inputTitle) {
  const summary = safeReadJson(join(runDir, 'context', 'feature_summaries', `${featureKey}.json`));
  return summary?.feature_title ?? inputTitle ?? featureKey;
}

function normalizeDefectRecord(item, defaultPriority = 'High') {
  if (!item) {
    return null;
  }
  if (typeof item === 'string') {
    return { key: item, summary: '', priority: defaultPriority, status: 'Open' };
  }
  return {
    key: item.key ?? item.defect_key ?? item.id ?? '—',
    summary: item.summary ?? '',
    priority: item.priority ?? defaultPriority,
    status: item.status ?? 'Open',
  };
}

function normalizeFeature(runDir, feature) {
  const title = loadFeatureTitle(runDir, feature.feature_key, feature.feature_title);
  const openDetails = (feature.open_defect_details ?? feature.defects ?? [])
    .map((item) => normalizeDefectRecord(item, item?.priority ?? 'Medium'))
    .filter(Boolean);
  const byKey = new Map(openDetails.map((item) => [item.key, item]));
  const blockingDetails = (feature.blocking_defects ?? [])
    .map((item) => {
      const record = normalizeDefectRecord(item);
      return byKey.get(record.key) ?? record;
    })
    .filter(Boolean);
  return {
    ...feature,
    feature_title: title,
    open_defect_details: openDetails,
    blocking_defect_details: blockingDetails,
  };
}

function blockingFeatures(features) {
  return features.filter((feature) => feature.blocking_defect_details.length > 0);
}

function featureRiskTable(features) {
  const rows = features
    .map(
      (feature) =>
        `| ${feature.feature_key} | ${feature.feature_title} | ${feature.risk_level} | ${feature.open_defects ?? 0} | ${feature.open_high_defects ?? 0} |`,
    )
    .join('\n');
  return `| Feature | Title | Risk | Open | Open High |\n|---------|-------|------|------|-----------|\n${rows || '| — | — | — | 0 | 0 |'}`;
}

function packetSection(features) {
  return features
    .map((feature) => `- ${feature.feature_key}: ${feature.release_packet_dir}`)
    .join('\n');
}

function buildDefectAnalysisSection(features) {
  const sections = [];
  for (const feature of features) {
    const allDefects = [...(feature.blocking_defect_details ?? []), ...(feature.open_defect_details ?? [])];
    const seen = new Set();
    const dedupedDefects = allDefects.filter((d) => {
      if (!d?.key || seen.has(d.key)) return false;
      seen.add(d.key);
      return true;
    });
    if (dedupedDefects.length === 0) continue;
    const rows = dedupedDefects
      .map((d) => `| ${d.key} | ${d.summary || '—'} | ${d.priority ?? '—'} | ${d.status ?? '—'} |`)
      .join('\n');
    sections.push(`**${feature.feature_key}** — ${feature.feature_title}
| Defect | Summary | Priority | Status |
|--------|---------|----------|--------|
${rows}`);
  }
  if (sections.length === 0) {
    return 'No open defects across all features.';
  }
  return sections.join('\n\n');
}

function buildBlockingSection(features) {
  if (features.length === 0) {
    return 'Blocking Features: none';
  }
  return features
    .map((feature) => {
      const rows = feature.blocking_defect_details
        .map(
          (defect) =>
            `| ${defect.key} | ${defect.summary || '—'} | ${defect.priority ?? 'High'} | ${defect.status ?? 'Open'} |`,
        )
        .join('\n');
      return `**${feature.feature_key}** — ${feature.feature_title}
| Defect | Summary | Priority | Status |
|--------|---------|----------|--------|
${rows}`;
    })
    .join('\n\n');
}

function collectAppendixRows(features) {
  const rows = [];
  for (const feature of features) {
    const seen = new Set();
    const defects = [...feature.blocking_defect_details, ...feature.open_defect_details];
    for (const defect of defects) {
      if (!defect?.key || seen.has(defect.key)) {
        continue;
      }
      seen.add(defect.key);
      rows.push(
        `| ${feature.feature_key} | ${defect.key} | ${defect.summary || '—'} | ${defect.priority ?? '—'} | ${defect.status ?? '—'} |`,
      );
    }
  }
  return rows;
}

export function generateReleaseReport(runDir, runKey) {
  const inputs =
    safeReadJson(join(runDir, 'context', 'release_summary_inputs.json')) ?? {
      features: [],
      release_version: runKey.replace(/^release_/, ''),
    };
  const features = sortFeatures((inputs.features ?? []).map((feature) => normalizeFeature(runDir, feature)));
  const totals = aggregateTotals(features);
  const blocking = blockingFeatures(features);
  const appendixRows = collectAppendixRows(features);
  const overallRisk = blocking.length > 0 ? 'HIGH' : totals.open_high_defects > 0 ? 'HIGH' : totals.open_defects > 0 ? 'MEDIUM' : 'LOW';

  const report = `## 1. Report Header

# Release Defect Analysis Report
## ${runKey}: Release Summary

**Release Version:** ${inputs.release_version ?? runKey.replace(/^release_/, '')}
**Features Covered:** ${features.length}

---

## 2. Executive Summary

| Metric | Count |
|--------|-------|
| Total Defects | ${totals.total_defects} |
| Open Defects | ${totals.open_defects} |
| Open High-Priority Defects | ${totals.open_high_defects} |
| Blocking Features | ${blocking.length} |

### Risk Rating: **${overallRisk}**

${blocking.length > 0 ? `**${blocking.length} feature(s) have unresolved blocking defects** — release should be held until resolved: ${blocking.map((f) => f.feature_key).join(', ')}.` : totals.open_defects > 0 ? `No blocking defects, but **${totals.open_defects} open defect(s)** remain across features. Proceed with targeted verification.` : 'All open defects resolved. Release is clear for standard sign-off.'}

---

## 3. Defect Breakdown by Status

${featureRiskTable(features)}

---

## 4. Risk Analysis by Functional Area

${buildRiskAnalysisSection(features)}

---

## 5. Defect Analysis by Priority

${buildDefectAnalysisSection(features)}

---

## 6. Code Change Analysis

${buildCodeChangeSection(features)}

### Feature Packet References

${packetSection(features)}

---

## 7. Residual Risk Assessment

${buildResidualRiskSection(features)}

---

## 8. Recommended QA Focus Areas

${features.flatMap((feature) => (feature.top_risk_areas ?? []).slice(0, 2).map((area) => `- **${feature.feature_key}**: ${area}`)).join('\n') || '- No concentrated hotspots detected.'}

---

## 9. Test Environment Recommendations

${buildEnvRecommendations(features)}

---

## 10. Verification Checklist for Release

${buildVerificationChecklist(features, runKey)}

---

## 11. Conclusion

Release Recommendation: ${blocking.length > 0 ? `⛔ **HOLD** — Resolve blocking defects in ${blocking.map((f) => f.feature_key).join(', ')} before release` : totals.open_defects > 0 ? '⚠️ **CONDITIONAL** — Proceed with targeted release verification for open defects' : '✅ **READY** — All defects resolved, proceed to release sign-off'}.

---

## 12. Appendix: Defect Reference List

| Feature | Defect | Summary | Priority | Status |
|---------|--------|---------|----------|--------|
${appendixRows.join('\n') || '| — | — | — | — | — |'}
`;

  const outPath = join(runDir, `${runKey}_REPORT_DRAFT.md`);
  writeFileSync(outPath, `${report}\n`, 'utf8');
  return outPath;
}

function main() {
  const [runDir, runKey] = process.argv.slice(2);
  if (!runDir || !runKey) {
    console.error('Usage: generate_release_report.mjs <run-dir> <run-key>');
    process.exit(1);
  }
  generateReleaseReport(runDir, runKey);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
