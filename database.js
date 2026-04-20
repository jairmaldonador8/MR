const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const DB_PATH = process.env.DB_PATH || './data/montana.db';

let db = null;

function initDatabase() {
  return new Promise((resolve, reject) => {
    // Create data directory if it doesn't exist
    const dataDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) reject(err);
      else {
        console.log('Connected to SQLite database:', DB_PATH);
        // Initialize schema
        const schema = fs.readFileSync(path.join(__dirname, 'db/schema.sql'), 'utf-8');
        db.exec(schema, (err) => {
          if (err) reject(err);
          else {
            console.log('Database schema initialized');
            resolve(db);
          }
        });
      }
    });
  });
}

function getDatabase() {
  if (!db) throw new Error('Database not initialized. Call initDatabase first.');
  return db;
}

// Helper functions
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

module.exports = {
  initDatabase,
  getDatabase,
  run,
  get,
  all,
};
