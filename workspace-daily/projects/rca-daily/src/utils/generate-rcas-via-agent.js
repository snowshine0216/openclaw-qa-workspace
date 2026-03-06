#!/usr/bin/env node

/**
 * RCA Generator via OpenClaw Agent Spawning
 *
 * This script must be called FROM an OpenClaw agent context
 * It reads the manifest and triggers RCA generation via sessions_spawn
 */

const fs = require("fs");

const readManifestFile = (manifestPath) => {
  if (!manifestPath) {
    throw new Error("Usage: node generate-rcas-via-agent.js <manifest-file>");
  }

  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Manifest file not found: ${manifestPath}`);
  }

  return JSON.parse(fs.readFileSync(manifestPath, "utf8"));
};

const printManifestOutput = (manifestPath, manifest) => {
  console.log("========================================");
  console.log("RCA Generator - Agent Spawner");
  console.log("========================================");
  console.log("");
  console.log(`Manifest: ${manifestPath}`);
  console.log(`Issues to process: ${manifest.total_issues}`);
  console.log("");

  // Output the manifest for the agent to pick up
  console.log("MANIFEST_JSON:", JSON.stringify(manifest));
  console.log("");
  console.log("✅ Manifest ready for agent processing");
  console.log("");
  console.log(
    "👉 Next: OpenClaw agent should call sessions_spawn for each RCA input",
  );
};

const main = () => {
  try {
    const manifestPath = process.argv[2];
    const manifest = readManifestFile(manifestPath);
    printManifestOutput(manifestPath, manifest);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
};

main();
