#!/usr/bin/env node

/**
 * RCA Generator via OpenClaw Agent Spawning
 * 
 * This script must be called FROM an OpenClaw agent context
 * It reads the manifest and triggers RCA generation via sessions_spawn
 */

const fs = require('fs');
const path = require('path');

async function main() {
    const manifestPath = process.argv[2];
    
    if (!manifestPath) {
        console.error('❌ Usage: node generate-rcas-via-agent.js <manifest-file>');
        process.exit(1);
    }
    
    if (!fs.existsSync(manifestPath)) {
        console.error(`❌ Manifest file not found: ${manifestPath}`);
        process.exit(1);
    }
    
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    console.log('========================================');
    console.log('RCA Generator - Agent Spawner');
    console.log('========================================');
    console.log('');
    console.log(`Manifest: ${manifestPath}`);
    console.log(`Issues to process: ${manifest.total_issues}`);
    console.log('');
    
    // Output the manifest for the agent to pick up
    console.log('MANIFEST_JSON:', JSON.stringify(manifest));
    console.log('');
    console.log('✅ Manifest ready for agent processing');
    console.log('');
    console.log('👉 Next: OpenClaw agent should call sessions_spawn for each RCA input');
}

main().catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
});
