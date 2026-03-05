const assert = require('assert');
const fs = require('fs');
const path = require('path');
const {
  readManifest,
  buildSpawnLine,
} = require('../spawn-agents');

console.log("Running spawn-agents.js tests...");

const fixtureDir = path.join(__dirname, 'fixtures');
if (!fs.existsSync(fixtureDir)) fs.mkdirSync(fixtureDir, { recursive: true });

const tmpManifest = path.join(fixtureDir, `manifest-sample-${Date.now()}.json`);
fs.writeFileSync(tmpManifest, JSON.stringify({
  timestamp: "123",
  total_issues: 2,
  rca_inputs: [
    { issue_key: "K-1" }, { issue_key: "K-2" }
  ]
}));

// Test: readManifest
const m = readManifest(tmpManifest);
assert.strictEqual(m.total_issues, 2);

// Test: buildSpawnLine
const line = buildSpawnLine({
  issue_key: "BCIN-001",
  input_file: "/tmp/f.json",
  output_file: "/tmp/o.md",
});
assert.ok(line.startsWith("AGENT_SPAWN_REQUEST:"));
assert.strictEqual(
  JSON.parse(line.replace("AGENT_SPAWN_REQUEST: ", "")).issue_key,
  "BCIN-001"
);

// Test: sessions_spawn must NOT appear
const srcPath = path.join(__dirname, '../spawn-agents.js');
const src = fs.readFileSync(srcPath, 'utf8');
assert.ok(
  !src.includes("sessions_spawn"),
  "SHELL-001 violation: sessions_spawn found in spawn-agents.js"
);

fs.unlinkSync(tmpManifest);
console.log("PASS");
