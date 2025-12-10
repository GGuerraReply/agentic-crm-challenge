/**
 * Database debugging and utility functions
 * Tools for inspecting and troubleshooting the database
 */

import { Database } from 'sql.js';
import { getDatabase, getDatabaseStats, exportDatabase } from './database';

/**
 * Print all table schemas
 */
export function printTableSchemas(db?: Database): void {
  const database = db || getDatabase();

  console.log('📋 Database Table Schemas:\n');

  try {
    const result = database.exec(`
      SELECT name, sql 
      FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name
    `);

    if (result.length > 0) {
      result[0].values.forEach(([name, sql]) => {
        console.log(`\n--- ${name} ---`);
        console.log(sql);
      });
    }
  } catch (error) {
    console.error('Failed to print table schemas:', error);
  }
}

/**
 * Print all indexes
 */
export function printIndexes(db?: Database): void {
  const database = db || getDatabase();

  console.log('📑 Database Indexes:\n');

  try {
    const result = database.exec(`
      SELECT name, tbl_name, sql 
      FROM sqlite_master 
      WHERE type='index' AND name NOT LIKE 'sqlite_%'
      ORDER BY tbl_name, name
    `);

    if (result.length > 0) {
      result[0].values.forEach(([name, tbl_name, sql]) => {
        console.log(`${tbl_name}.${name}`);
        console.log(`  ${sql || 'PRIMARY KEY (auto)'}\n`);
      });
    }
  } catch (error) {
    console.error('Failed to print indexes:', error);
  }
}

/**
 * Print database statistics
 */
export function printDatabaseStats(db?: Database): void {
  const stats = getDatabaseStats(db);

  console.log('📊 Database Statistics:\n');
  console.log(`Schema Version: v${stats.schemaVersion}`);
  console.log(`Database Size: ${(stats.size / 1024).toFixed(2)} KB\n`);
  console.log('Table Record Counts:');

  stats.tables.forEach((table) => {
    console.log(`  ${table.name.padEnd(30)} ${table.count.toString().padStart(6)} rows`);
  });

  console.log(`\nTotal Tables: ${stats.tables.length}`);
}

/**
 * Validate foreign key integrity
 */
export function validateForeignKeys(db?: Database): void {
  const database = db || getDatabase();

  console.log('🔍 Validating Foreign Key Integrity:\n');

  try {
    const result = database.exec('PRAGMA foreign_key_check');

    if (result.length === 0 || result[0].values.length === 0) {
      console.log('✅ All foreign keys are valid!');
    } else {
      console.warn('⚠️  Foreign key violations found:');
      result[0].values.forEach((row) => {
        console.warn(`  Table: ${row[0]}, Row: ${row[1]}, Parent: ${row[2]}, FK: ${row[3]}`);
      });
    }
  } catch (error) {
    console.error('Failed to validate foreign keys:', error);
  }
}

/**
 * Analyze query performance
 */
export function explainQuery(query: string, params: unknown[] = [], db?: Database): void {
  const database = db || getDatabase();

  console.log(`🔬 Query Plan for: ${query}\n`);

  try {
    const stmt = database.prepare(`EXPLAIN QUERY PLAN ${query}`);
    if (params.length > 0) {
      stmt.bind(params);
    }

    console.log('Plan:');
    while (stmt.step()) {
      const row = stmt.getAsObject();
      console.log(row);
    }
    stmt.free();
  } catch (error) {
    console.error('Failed to explain query:', error);
  }
}

/**
 * Download database as file
 */
export function downloadDatabase(filename: string = 'agentic-crm-db.sqlite'): void {
  try {
    const data = exportDatabase();
    // Convert Uint8Array to regular array to satisfy Blob constructor
    const arrayData = Array.from(data);
    const blob = new Blob([new Uint8Array(arrayData)], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log(`✅ Database downloaded as ${filename}`);
  } catch (error) {
    console.error('Failed to download database:', error);
    throw error;
  }
}

/**
 * Get sample data from a table
 */
export function sampleTable(tableName: string, limit: number = 5, db?: Database): void {
  const database = db || getDatabase();

  console.log(`📄 Sample data from ${tableName} (limit ${limit}):\n`);

  try {
    const result = database.exec(`SELECT * FROM ${tableName} LIMIT ${limit}`);

    if (result.length > 0) {
      console.table(
        result[0].values.map((row) => {
          const obj: Record<string, unknown> = {};
          result[0].columns.forEach((col, idx) => {
            obj[col] = row[idx];
          });
          return obj;
        })
      );
    } else {
      console.log(`Table ${tableName} is empty`);
    }
  } catch (error) {
    console.error(`Failed to sample table ${tableName}:`, error);
  }
}

/**
 * Vacuum database to optimize size
 */
export function vacuumDatabase(db?: Database): void {
  const database = db || getDatabase();

  console.log('🧹 Vacuuming database...');

  try {
    database.run('VACUUM');
    console.log('✅ Database vacuumed successfully');
  } catch (error) {
    console.error('Failed to vacuum database:', error);
    throw error;
  }
}

/**
 * Create a debug report
 */
export function createDebugReport(db?: Database): string {
  const lines: string[] = [];

  lines.push('='.repeat(60));
  lines.push('Agentic CRM Database Debug Report');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push('='.repeat(60));
  lines.push('');

  const stats = getDatabaseStats(db);
  lines.push(`Schema Version: v${stats.schemaVersion}`);
  lines.push(`Database Size: ${(stats.size / 1024).toFixed(2)} KB`);
  lines.push('');

  lines.push('Table Record Counts:');
  stats.tables.forEach((table) => {
    lines.push(`  ${table.name.padEnd(30)} ${table.count.toString().padStart(6)} rows`);
  });
  lines.push('');

  lines.push('='.repeat(60));

  const report = lines.join('\n');
  console.log(report);
  return report;
}

// Export all debug functions
export const dbDebug = {
  printTableSchemas,
  printIndexes,
  printDatabaseStats,
  validateForeignKeys,
  explainQuery,
  downloadDatabase,
  sampleTable,
  vacuumDatabase,
  createDebugReport,
};
