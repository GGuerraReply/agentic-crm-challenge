/**
 * Database initialization and management module
 *
 * Handles sql.js initialization, database creation, persistence to localStorage,
 * and schema application.
 */

import initSqlJs, { Database } from 'sql.js';
import { runMigrations } from './migrations';
import { allMigrations } from './migrations/index';
import { SCHEMA_DDL, SCHEMA_VERSION } from './schema';

const DB_STORAGE_KEY = 'agentic_crm_database';
const DB_VERSION_KEY = 'agentic_crm_db_version';
// Browser-safe base64 helpers
function uint8ToBase64(u8: Uint8Array): string {
  let binary = '';
  const len = u8.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(u8[i]);
  }
  return btoa(binary);
}

function base64ToUint8(base64: string): Uint8Array {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

let sqlInstance: Awaited<ReturnType<typeof initSqlJs>> | null = null;
let dbInstance: Database | null = null;

/**
 * Initialize sql.js library
 * Loads the WASM file required for SQLite
 */
async function initSqlJsLib(): Promise<Awaited<ReturnType<typeof initSqlJs>>> {
  if (sqlInstance) {
    return sqlInstance;
  }

  try {
    sqlInstance = await initSqlJs({
      // Specify the location of sql-wasm.wasm file
      // This path should be adjusted based on your build configuration
      locateFile: (file) => `https://sql.js.org/dist/${file}`,
    });
    return sqlInstance;
  } catch (error) {
    console.error('Failed to initialize sql.js:', error);
    throw new Error(
      'Could not initialize SQLite. Please check your browser compatibility.',
    );
  }
}

/**
 * Apply the complete schema to a database
 */
function applySchema(db: Database): void {
  try {
    // Ensure foreign key constraints are enforced
    db.run('PRAGMA foreign_keys = ON');

    // Execute all DDL statements
    SCHEMA_DDL.forEach((ddl) => {
      db.run(ddl);
    });

    // Record schema version
    const now = Date.now();
    db.run(
      'INSERT OR REPLACE INTO schema_version (version, applied_at) VALUES (?, ?)',
      [SCHEMA_VERSION, now],
    );

    console.log(`✅ Schema v${SCHEMA_VERSION} applied successfully`);
  } catch (error) {
    console.error('Failed to apply schema:', error);
    throw error;
  }
}

/**
 * Get current schema version from database
 */
function getSchemaVersion(db: Database): number {
  try {
    const result = db.exec(
      'SELECT version FROM schema_version ORDER BY version DESC LIMIT 1',
    );
    if (result.length > 0 && result[0].values.length > 0) {
      return result[0].values[0][0] as number;
    }
    return 0;
  } catch {
    return 0;
  }
}

/**
 * Save database to localStorage
 */
export function saveDatabase(db: Database): void {
  try {
    const data = db.export();
    const base64 = uint8ToBase64(data);

    localStorage.setItem(DB_STORAGE_KEY, base64);
    localStorage.setItem(DB_VERSION_KEY, SCHEMA_VERSION.toString());

    console.log('💾 Database saved to localStorage');
  } catch (error) {
    console.error('Failed to save database:', error);

    // Check if storage quota exceeded
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.warn(
        '⚠️ localStorage quota exceeded. Consider implementing data pruning.',
      );
      throw new Error(
        'Storage quota exceeded. Please clear old data or export the database.',
      );
    }
    throw error;
  }
}

/**
 * Load database from localStorage
 */
function loadDatabase(
  SQL: Awaited<ReturnType<typeof initSqlJs>>,
): Database | null {
  try {
    const base64Data = localStorage.getItem(DB_STORAGE_KEY);

    if (!base64Data) {
      console.log('No existing database found in localStorage');
      return null;
    }

    const data = base64ToUint8(base64Data);

    const db = new SQL.Database(data);
    const version = getSchemaVersion(db);

    console.log(`📂 Database loaded from localStorage (schema v${version})`);

    // Check if schema needs upgrade
    if (version < SCHEMA_VERSION) {
      console.warn(
        `⚠️ Database schema outdated (v${version}). Current version: v${SCHEMA_VERSION}`,
      );
      console.warn(
        'For workshop: Consider resetting database or implementing migrations',
      );
    }

    return db;
  } catch (error) {
    console.error('Failed to load database from localStorage:', error);
    console.warn('Creating new database instead');
    return null;
  }
}

/**
 * Initialize database
 *
 * - Tries to load existing database from localStorage
 * - If not found or corrupted, creates new database
 * - Applies schema if needed
 * - Runs migrations if configured
 * - Returns database instance
 */
export async function initializeDatabase(
  forceNew: boolean = false,
  runMigrationsOnInit: boolean = true,
): Promise<Database> {
  if (dbInstance && !forceNew) {
    return dbInstance;
  }

  console.log('🚀 Initializing database...');

  const SQL = await initSqlJsLib();
  let isNewDatabase = false;

  if (!forceNew) {
    // Try to load existing database
    const existingDb = loadDatabase(SQL);
    if (existingDb) {
      dbInstance = existingDb;

      // Run migrations on existing database if configured
      if (runMigrationsOnInit) {
        console.log('🔄 Running migrations on existing database...');
        await runMigrations(existingDb, allMigrations);
        saveDatabase(existingDb);
      }

      return existingDb;
    }
  }

  // Create new database
  console.log('📝 Creating new database...');
  const db = new SQL.Database();
  isNewDatabase = true;

  // Apply schema
  applySchema(db);

  // Run migrations for new database if configured
  if (runMigrationsOnInit && isNewDatabase) {
    console.log('🔄 Running migrations on new database...');
    await runMigrations(db, allMigrations);
  }

  // Save to localStorage
  saveDatabase(db);

  dbInstance = db;
  return db;
}

/**
 * Get current database instance
 * Throws error if database not initialized
 */
export function getDatabase(): Database {
  if (!dbInstance) {
    throw new Error(
      'Database not initialized. Call initializeDatabase() first.',
    );
  }
  return dbInstance;
}

/**
 * Close database and clean up
 */
export function closeDatabase(): void {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
    console.log('Database closed');
  }
}

/**
 * Reset database - deletes all data and recreates schema
 */
export async function resetDatabase(): Promise<Database> {
  console.warn('⚠️ Resetting database - all data will be lost');

  closeDatabase();
  localStorage.removeItem(DB_STORAGE_KEY);
  localStorage.removeItem(DB_VERSION_KEY);

  return initializeDatabase(true);
}

/**
 * Export database as binary data for download/backup
 */
export function exportDatabase(): Uint8Array {
  const db = getDatabase();
  return db.export();
}

/**
 * Import database from binary data
 */
export async function importDatabase(data: Uint8Array): Promise<Database> {
  console.log('📥 Importing database...');

  const SQL = await initSqlJsLib();
  const db = new SQL.Database(data);

  // Verify schema version
  const version = getSchemaVersion(db);
  console.log(`Imported database schema version: v${version}`);

  if (version > SCHEMA_VERSION) {
    throw new Error(
      `Imported database schema (v${version}) is newer than supported version (v${SCHEMA_VERSION})`,
    );
  }

  // Save imported database
  closeDatabase();
  dbInstance = db;
  saveDatabase(db);

  console.log('✅ Database imported successfully');
  return db;
}

/**
 * Get database statistics
 */
export function getDatabaseStats(db?: Database): {
  size: number;
  tables: { name: string; count: number }[];
  schemaVersion: number;
} {
  const database = db || getDatabase();

  // Get all table names
  const tablesResult = database.exec(`
    SELECT name FROM sqlite_master 
    WHERE type='table' AND name NOT LIKE 'sqlite_%'
    ORDER BY name
  `);

  const tables: { name: string; count: number }[] = [];

  if (tablesResult.length > 0) {
    const tableNames = tablesResult[0].values.map((row) => row[0] as string);

    tableNames.forEach((tableName) => {
      try {
        const countResult = database.exec(`SELECT COUNT(*) FROM ${tableName}`);
        const count = countResult[0].values[0][0] as number;
        tables.push({ name: tableName, count });
      } catch (error) {
        console.warn(`Could not count rows in table ${tableName}:`, error);
      }
    });
  }

  // Estimate database size
  const exported = database.export();
  const size = exported.byteLength;

  return {
    size,
    tables,
    schemaVersion: getSchemaVersion(database),
  };
}
