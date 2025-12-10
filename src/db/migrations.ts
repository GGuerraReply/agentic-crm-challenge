/**
 * Database Migration System
 * 
 * Handles data migration from mock data to SQLite database.
 * Follows repository conventions: TypeScript strict, browser-only, clean architecture.
 */

import { Database } from 'sql.js';
import { saveDatabase } from './database';

export interface Migration {
  version: number;
  name: string;
  up: (db: Database) => Promise<void>;
  down?: (db: Database) => Promise<void>;
}

/**
 * Migration tracking table
 */
const MIGRATIONS_TABLE_DDL = `
CREATE TABLE IF NOT EXISTS migrations (
  version INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  applied_at INTEGER NOT NULL
);
`;

/**
 * Initialize migrations table
 */
export function initializeMigrationsTable(db: Database): void {
  db.run(MIGRATIONS_TABLE_DDL);
}

/**
 * Get applied migration versions
 */
export function getAppliedMigrations(db: Database): number[] {
  try {
    const result = db.exec('SELECT version FROM migrations ORDER BY version ASC');
    if (result.length > 0) {
      return result[0].values.map(row => row[0] as number);
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * Record migration as applied
 */
export function recordMigration(db: Database, version: number, name: string): void {
  const now = Date.now();
  db.run(
    'INSERT INTO migrations (version, name, applied_at) VALUES (?, ?, ?)',
    [version, name, now]
  );
}

/**
 * Check if migration has been applied
 */
export function isMigrationApplied(db: Database, version: number): boolean {
  const applied = getAppliedMigrations(db);
  return applied.includes(version);
}

/**
 * Run pending migrations
 */
export async function runMigrations(
  db: Database,
  migrations: Migration[]
): Promise<void> {
  console.log('🔄 Checking for pending migrations...');

  // Initialize migrations table
  initializeMigrationsTable(db);

  // Get applied migrations
  const applied = getAppliedMigrations(db);
  console.log(`Applied migrations: [${applied.join(', ') || 'none'}]`);

  // Find pending migrations
  const pending = migrations.filter(m => !applied.includes(m.version));

  if (pending.length === 0) {
    console.log('✅ All migrations are up to date');
    return;
  }

  console.log(`Found ${pending.length} pending migration(s)`);

  // Sort by version
  pending.sort((a, b) => a.version - b.version);

  // Run each migration
  for (const migration of pending) {
    console.log(`Running migration ${migration.version}: ${migration.name}`);

    try {
      await migration.up(db);
      recordMigration(db, migration.version, migration.name);
      saveDatabase(db);
      console.log(`✅ Migration ${migration.version} completed`);
    } catch (error) {
      console.error(`❌ Migration ${migration.version} failed:`, error);
      throw new Error(`Migration ${migration.version} (${migration.name}) failed: ${error}`);
    }
  }

  console.log('🎉 All migrations completed successfully');
}

/**
 * Rollback a specific migration
 */
export async function rollbackMigration(
  db: Database,
  migration: Migration
): Promise<void> {
  if (!migration.down) {
    throw new Error(`Migration ${migration.version} does not have a rollback function`);
  }

  console.log(`Rolling back migration ${migration.version}: ${migration.name}`);

  try {
    await migration.down(db);
    db.run('DELETE FROM migrations WHERE version = ?', [migration.version]);
    saveDatabase(db);
    console.log(`✅ Migration ${migration.version} rolled back`);
  } catch (error) {
    console.error(`❌ Rollback failed:`, error);
    throw error;
  }
}

/**
 * Get migration status
 */
export function getMigrationStatus(
  db: Database,
  migrations: Migration[]
): Array<{ version: number; name: string; applied: boolean; appliedAt?: Date }> {
  initializeMigrationsTable(db);

  const appliedMigrations = new Map<number, { name: string; appliedAt: number }>();

  try {
    const result = db.exec('SELECT version, name, applied_at FROM migrations');
    if (result.length > 0) {
      result[0].values.forEach(row => {
        appliedMigrations.set(
          row[0] as number,
          { name: row[1] as string, appliedAt: row[2] as number }
        );
      });
    }
  } catch (error) {
    console.warn('Could not read migrations table:', error);
  }

  return migrations.map(migration => {
    const applied = appliedMigrations.get(migration.version);
    return {
      version: migration.version,
      name: migration.name,
      applied: !!applied,
      appliedAt: applied ? new Date(applied.appliedAt) : undefined,
    };
  });
}
