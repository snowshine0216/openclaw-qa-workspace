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

function blockingFeatures(features) {
  return features.filter((feature) => (feature.blocking_defects ?? []).length > 0);
}

function featureRiskTable(features) {
  const rows = features
    .map(
      (feature) =>
        `| ${feature.feature_key} | ${feature.feature_title} | ${feature.risk_level} | ${feature.open_defects ?? 0} | ${feature.open_high_defects ?? 0} |`,
    )
    .join('\n');
  return `| Feature | Title | Risk | Open | Open High |\n|---------|-------|------|------|-----------|\n${rows}`;
}

function packetSection(features) {
  return features
    .map((feature) => `- ${feature.feature_key}: ${feature.release_packet_dir}`)
    .join('\n');
}

export function generateReleaseReport(runDir, runKey) {
  const inputs =
    safeReadJson(join(runDir, 'context', 'release_summary_inputs.json')) ?? { features: [], release_version: runKey.replace(/^release_/, '') };
  const features = sortFeatures(inputs.features ?? []);
  const totals = aggregateTotals(features);
  const blocking = blockingFeatures(features);

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

### Risk Rating: **${blocking.length > 0 ? 'HIGH' : totals.open_defects > 0 ? 'MEDIUM' : 'LOW'}**

---

## 3. Defect Breakdown by Status

${featureRiskTable(features)}

---

## 4. Risk Analysis by Functional Area

${hotspotRows(features)}

---

## 5. Defect Analysis by Priority

${blocking.length > 0 ? blocking.map((feature) => `- ${feature.feature_key}: ${(feature.blocking_defects ?? []).join(', ')}`).join('\n') : 'Blocking Features: none'}

---

## 6. Code Change Analysis

Feature packet directories:
${packetSection(features)}

---

## 7. Residual Risk Assessment

Highest-risk features: ${features.slice(0, 3).map((feature) => feature.feature_key).join(', ') || 'none'}.

---

## 8. Recommended QA Focus Areas

${features.flatMap((feature) => (feature.top_risk_areas ?? []).slice(0, 2).map((area) => `- ${feature.feature_key}: ${area}`)).join('\n') || '- No concentrated hotspots detected.'}

---

## 9. Test Environment Recommendations

- Validate the packet-linked features in release candidate environments.
- Use the feature packets for per-feature release sign-off.

---

## 10. Verification Checklist for Release

- Confirm each feature packet exists under ${runKey}/features/.
- Review blocking features before release approval.
- Reconcile aggregate totals with feature packet summaries.

---

## 11. Conclusion

Release Recommendation: ${blocking.length > 0 ? 'hold release until blocking feature risks are resolved' : totals.open_defects > 0 ? 'proceed only with targeted release verification' : 'ready for release verification'}.

---

## 12. Appendix: Defect Reference List

${packetSection(features)}
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
