"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const { writePptxHandoff } = require("../scripts/lib/pptx-handoff");

function tmpRoot() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ppt-agent-handoff-"));
  fs.mkdirSync(path.join(dir, "artifacts"), { recursive: true });
  return dir;
}

test("writePptxHandoff writes a concrete pptx handoff artifact", () => {
  const runRoot = tmpRoot();
  const specPath = path.join(runRoot, "artifacts", "slide-build-spec.json");
  const spec = {
    phase: "create",
    build_path: "new_deck_generation",
    reference_strategy: "style",
    manuscript_path: "artifacts/manuscript.md",
    design_plan_path: "artifacts/design_plan.md",
    output_pptx_path: "artifacts/output.pptx"
  };
  fs.writeFileSync(specPath, JSON.stringify(spec, null, 2));

  const { handoffPath, handoff } = writePptxHandoff({
    runRoot,
    slideBuildSpec: spec,
    slideBuildSpecPath: specPath
  });

  assert.ok(fs.existsSync(handoffPath));
  assert.equal(handoff.handoff_type, "pptx_new_deck_generation");
  assert.equal(handoff.layout, "LAYOUT_16x9");
  assert.equal(handoff.reasoning_host, "portable_cli");
  assert.equal(handoff.reasoning_mode, "scripted_local");
  assert.equal(handoff.execution_contract_version, "v2");
  assert.match(handoff.pptx_skill.pptxgenjs_guide, /pptxgenjs\.md$/);
});
