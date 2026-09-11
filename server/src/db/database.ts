import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../../kabadiwala.db');
export const db = new Database(dbPath);

// Enable WAL mode for high concurrency and foreign keys
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Statement cache to retain all prepared statements in memory.
// Prevents Node 24 GC assertion failure when better-sqlite3 statements are swept.
const rawPrepare = db.prepare.bind(db);
const statementCache = new Map<string, any>();
db.prepare = function (sql: string) {
  let stmt = statementCache.get(sql);
  if (!stmt) {
    stmt = rawPrepare(sql);
    statementCache.set(sql, stmt);
  }
  return stmt;
} as any;

export function initDatabase() {
  let schemaPath = path.resolve(__dirname, 'schema.sql');
  if (!fs.existsSync(schemaPath)) {
    schemaPath = path.resolve(__dirname, '../../src/db/schema.sql');
  }
  const schema = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schema);
  console.log('SQLite database schema initialized at:', dbPath);
}
