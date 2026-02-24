#!/usr/bin/env node
/**
 * Migration Script: Add V2 Columns to failed_steps
 * 
 * Changes:
 * - Add file_name column (test file path)
 * - Add retry_count column (number of retries)
 * - Add full_error_msg column (complete stack trace)
 * - Add indexes for performance
 */

const Database = require('./db-adapter');
const path = require('path');
const fs = require('fs');

const migrate = async () => {
  console.log('🔧 Starting Jenkins Analysis V2 Migration...\n');
  
  const rootDir = path.resolve(__dirname, '..');
  const dbPath = path.join(rootDir, 'data', 'jenkins_history.db');
  
  // Backup database first
  if (fs.existsSync(dbPath)) {
    const backupPath = dbPath.replace('.db', `.backup-${Date.now()}.db`);
    fs.copyFileSync(dbPath, backupPath);
    console.log(`✅ Backup created: ${path.basename(backupPath)}`);
  } else {
    console.log('ℹ️  No existing database found - will create new one');
  }
  
  const db = await Database.create(dbPath);
  
  try {
    // Check if columns already exist
    const tableInfo = db.prepare(`PRAGMA table_info(failed_steps)`).all();
    const existingColumns = tableInfo.map(col => col.name);
    
    console.log('\n📋 Current columns:', existingColumns.join(', '));
    
    // Add file_name column
    if (!existingColumns.includes('file_name')) {
      console.log('\n➕ Adding file_name column...');
      db.exec(`ALTER TABLE failed_steps ADD COLUMN file_name TEXT DEFAULT 'unknown.spec.js'`);
      console.log('✅ file_name column added');
    } else {
      console.log('\n✓  file_name column already exists');
    }
    
    // Add retry_count column
    if (!existingColumns.includes('retry_count')) {
      console.log('➕ Adding retry_count column...');
      db.exec(`ALTER TABLE failed_steps ADD COLUMN retry_count INTEGER DEFAULT 1`);
      console.log('✅ retry_count column added');
    } else {
      console.log('✓  retry_count column already exists');
    }
    
    // Add full_error_msg column
    if (!existingColumns.includes('full_error_msg')) {
      console.log('➕ Adding full_error_msg column...');
      db.exec(`ALTER TABLE failed_steps ADD COLUMN full_error_msg TEXT`);
      console.log('✅ full_error_msg column added');
    } else {
      console.log('✓  full_error_msg column already exists');
    }
    
    // Add indexes for performance
    console.log('\n🔍 Creating indexes...');
    
    try {
      db.exec(`CREATE INDEX IF NOT EXISTS idx_fingerprint_lookup ON failed_steps(error_fingerprint)`);
      console.log('✅ Index on error_fingerprint created');
    } catch (e) {
      console.log('✓  Index on error_fingerprint already exists');
    }
    
    try {
      db.exec(`CREATE INDEX IF NOT EXISTS idx_job_build_lookup ON job_runs(job_name, job_build)`);
      console.log('✅ Index on job_runs(job_name, job_build) created');
    } catch (e) {
      console.log('✓  Index on job_runs already exists');
    }
    
    // Verify changes
    const updatedTableInfo = db.prepare(`PRAGMA table_info(failed_steps)`).all();
    const newColumns = updatedTableInfo.filter(col => 
      ['file_name', 'retry_count', 'full_error_msg'].includes(col.name)
    );
    
    console.log('\n✅ Migration Complete!');
    console.log('\n📊 New Columns:');
    newColumns.forEach(col => {
      console.log(`   - ${col.name} (${col.type}${col.dflt_value ? `, default: ${col.dflt_value}` : ''})`);
    });
    
    // Show index info
    const indexes = db.prepare(`PRAGMA index_list(failed_steps)`).all();
    console.log('\n🔍 Indexes on failed_steps:');
    indexes.forEach(idx => {
      console.log(`   - ${idx.name}`);
    });
    
    db.close();
    console.log('\n✅ Database closed successfully\n');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error.stack);
    db.close();
    process.exit(1);
  }
};

if (require.main === module) {
  migrate().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { migrate };
