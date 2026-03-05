#!/usr/bin/env node

const fs = require('fs');

function readManifest(manifestPath) {
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Manifest not found at path: ${manifestPath}`);
  }
  return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
}

function buildSpawnLine(entry) {
  const payload = JSON.stringify(entry);
  return `AGENT_SPAWN_REQUEST: ${payload}`;
}

function printManifestSummary(manifest) {
  console.log(`MANIFEST_JSON: ${JSON.stringify(manifest)}`);
}

function emitSpawnLines(manifest) {
  if (!manifest.rca_inputs || !Array.isArray(manifest.rca_inputs)) return;
  
  manifest.rca_inputs.forEach(entry => {
    console.log(buildSpawnLine(entry));
  });
  
  console.log("✅ Manifest ready for agent processing");
  console.log("👉 Next: OpenClaw agent should process each AGENT_SPAWN_REQUEST line");
}

function main() {
  const args = process.argv.slice(2);
  const manifestPath = args[0];

  if (!manifestPath) {
    console.error("Usage: node spawn-agents.js <manifest_path>");
    process.exit(1);
  }

  try {
    const manifest = readManifest(manifestPath);
    printManifestSummary(manifest);
    emitSpawnLines(manifest);
  } catch (err) {
    console.error("Failed to spawn agents:", err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  readManifest,
  buildSpawnLine,
  printManifestSummary,
  emitSpawnLines
};
