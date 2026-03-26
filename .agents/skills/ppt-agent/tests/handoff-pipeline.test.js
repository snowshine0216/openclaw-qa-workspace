"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const { runResearchPass } = require("../scripts/lib/research-pass");
const { runDesignPass } = require("../scripts/lib/design-pass");

function tmpRoot() {
  const runRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ppt-agent-handoff-"));
  fs.mkdirSync(path.join(runRoot, "artifacts"), { recursive: true });
  fs.mkdirSync(path.join(runRoot, "input"), { recursive: true });
  return runRoot;
}

test("research and design passes emit executable built-in-model handoff artifacts and derived outputs", () => {
  const runRoot = tmpRoot();
  const attachmentPath = path.join(runRoot, "market-notes.md");
  fs.writeFileSync(
    attachmentPath,
    [
      "# Browser Automation Market",
      "- Adoption in regulated enterprise support workflows is increasing.",
      "- Governance and auditability are recurring purchase criteria.",
      "- Teams need phased rollout plans rather than platform rewrites."
    ].join("\n")
  );

  const research = runResearchPass({
    runRoot,
    prompt: "Build a market landscape deck on enterprise browser automation adoption in 2026.",
    objective: "Summarize the market, risks, and recommendation.",
    audience: "Executive leadership",
    attachments: [{ path: attachmentPath }],
    sourceProvenance: [
      {
        title: "Enterprise Browser Automation Outlook 2026",
        locator: "https://example.com/outlook",
        summary: "Regulated support teams are adopting browser automation with governance controls."
      }
    ],
    referenceAnalysis: {
      strategy: "none",
      styleInfluence: {},
      structureInfluence: {},
      readableReferences: [],
      unreadableReferences: [],
      warnings: []
    }
  });

  const design = runDesignPass({
    runRoot,
    prompt: "Build a market landscape deck on enterprise browser automation adoption in 2026.",
    objective: "Summarize the market, risks, and recommendation.",
    audience: "Executive leadership",
    manuscriptPath: research.manuscriptPath,
    referenceAnalysis: research.referenceAnalysis
  });

  const researchHandoff = JSON.parse(fs.readFileSync(research.handoffPath, "utf8"));
  const designHandoff = JSON.parse(fs.readFileSync(design.handoffPath, "utf8"));
  const manuscript = fs.readFileSync(research.manuscriptPath, "utf8");
  const designPlan = fs.readFileSync(design.designPlanPath, "utf8");

  assert.equal(researchHandoff.reasoning_host, "portable_cli");
  assert.equal(researchHandoff.reasoning_mode, "scripted_local");
  assert.equal(researchHandoff.execution_contract_version, "v2");
  assert.match(researchHandoff.rolePath, /roles\/research\.md$/);
  assert.equal(researchHandoff.mode, "research");
  assert.match(manuscript, /Source provenance notes:/);

  assert.equal(designHandoff.reasoning_host, "portable_cli");
  assert.equal(designHandoff.reasoning_mode, "scripted_local");
  assert.equal(designHandoff.execution_contract_version, "v2");
  assert.match(designHandoff.rolePath, /roles\/design\.md$/);
  assert.equal(designHandoff.mode, "design");
  assert.match(designPlan, /## Page-by-Page Layout Plan/);
  assert.ok(fs.existsSync(design.slideBuildSpecPath));
});
