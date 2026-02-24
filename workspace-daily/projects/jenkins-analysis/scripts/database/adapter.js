#!/usr/bin/env node
/**
 * Database adapter: Makes sql.js behave like better-sqlite3
 * This allows existing code to work with minimal changes
 */

const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

class Database {
  constructor(dbPath) {
    this.dbPath = dbPath;
    this.db = null;
    this.SQL = null;
    this._initPromise = this._init();
  }

  async _init() {
    this.SQL = await initSqlJs();
    
    // Load existing database or create new
    if (fs.existsSync(this.dbPath)) {
      const buffer = fs.readFileSync(this.dbPath);
      this.db = new this.SQL.Database(buffer);
    } else {
      this.db = new this.SQL.Database();
    }
  }

  async _ensureReady() {
    await this._initPromise;
  }

  // Synchronous-like exec (for schema)
  exec(sql) {
    if (!this.db) {
      throw new Error('Database not initialized. Call await db._ensureReady() first.');
    }
    this.db.exec(sql);
    this._save();
  }

  // Pragma (no-op for sql.js, just for compatibility)
  pragma(statement) {
    // sql.js doesn't support PRAGMA, just ignore
    return this;
  }

  // Prepare statement
  prepare(sql) {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    
    const stmt = this.db.prepare(sql);
    
    return {
      run: (...params) => {
        stmt.bind(params);
        stmt.step();
        const changes = this.db.getRowsModified();
        const lastInsertRowid = this.db.exec("SELECT last_insert_rowid()")[0]?.values[0]?.[0] || null;
        stmt.reset();
        this._save();
        return { changes, lastInsertRowid };
      },
      
      get: (...params) => {
        stmt.bind(params);
        const hasRow = stmt.step();
        if (!hasRow) {
          stmt.reset();
          return undefined;
        }
        const columns = stmt.getColumnNames();
        const values = stmt.get();
        stmt.reset();
        
        const row = {};
        columns.forEach((col, idx) => {
          row[col] = values[idx];
        });
        return row;
      },
      
      all: (...params) => {
        stmt.bind(params);
        const rows = [];
        const columns = stmt.getColumnNames();
        
        while (stmt.step()) {
          const values = stmt.get();
          const row = {};
          columns.forEach((col, idx) => {
            row[col] = values[idx];
          });
          rows.push(row);
        }
        stmt.reset();
        return rows;
      }
    };
  }

  // Save database to disk
  _save() {
    if (!this.db) return;
    const dir = path.dirname(this.dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const data = this.db.export();
    fs.writeFileSync(this.dbPath, Buffer.from(data));
  }

  // Close database
  close() {
    if (this.db) {
      this._save();
      this.db.close();
      this.db = null;
    }
  }
}

// Factory function for async initialization
Database.create = async (dbPath) => {
  const db = new Database(dbPath);
  await db._ensureReady();
  return db;
};

module.exports = Database;
