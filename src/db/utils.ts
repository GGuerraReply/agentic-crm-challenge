/**
 * Database query utilities
 * Helper functions for common database operations
 */

import { Database } from 'sql.js';
import { getDatabase } from './database';

/**
 * Execute a query that returns results
 */
export function executeQuery<T = unknown>(
  query: string,
  params: unknown[] = [],
  db?: Database
): T[] {
  const database = db || getDatabase();

  try {
    const stmt = database.prepare(query);
    stmt.bind(params);

    const results: T[] = [];
    while (stmt.step()) {
      const row = stmt.getAsObject() as T;
      results.push(row);
    }
    stmt.free();

    return results;
  } catch (error) {
    console.error('Query execution failed:', { query, params, error });
    throw error;
  }
}

/**
 * Execute an INSERT statement and return the last inserted row ID
 */
export function executeInsert(
  query: string,
  params: unknown[] = [],
  db?: Database
): number {
  const database = db || getDatabase();

  try {
    database.run(query, params);
    
    // Get last inserted row ID
    const result = database.exec('SELECT last_insert_rowid() as id');
    if (result.length > 0 && result[0].values.length > 0) {
      return result[0].values[0][0] as number;
    }
    
    return -1;
  } catch (error) {
    console.error('Insert execution failed:', { query, params, error });
    throw error;
  }
}

/**
 * Execute an UPDATE or DELETE statement and return affected rows count
 */
export function executeUpdate(
  query: string,
  params: unknown[] = [],
  db?: Database
): number {
  const database = db || getDatabase();

  try {
    database.run(query, params);
    
    // Get number of affected rows
    const result = database.exec('SELECT changes() as count');
    if (result.length > 0 && result[0].values.length > 0) {
      return result[0].values[0][0] as number;
    }
    
    return 0;
  } catch (error) {
    console.error('Update execution failed:', { query, params, error });
    throw error;
  }
}

/**
 * Execute a DELETE statement and return affected rows count
 */
export function executeDelete(
  query: string,
  params: unknown[] = [],
  db?: Database
): number {
  return executeUpdate(query, params, db);
}

/**
 * Get all records from a table
 */
export function getAll<T = unknown>(
  tableName: string,
  orderBy?: string,
  db?: Database
): T[] {
  const order = orderBy ? ` ORDER BY ${orderBy}` : '';
  const query = `SELECT * FROM ${tableName}${order}`;
  return executeQuery<T>(query, [], db);
}

/**
 * Get a single record by ID
 */
export function getById<T = unknown>(
  tableName: string,
  id: string,
  db?: Database
): T | null {
  const query = `SELECT * FROM ${tableName} WHERE id = ? LIMIT 1`;
  const results = executeQuery<T>(query, [id], db);
  return results.length > 0 ? results[0] : null;
}

/**
 * Check if a record exists
 */
export function exists(
  tableName: string,
  id: string,
  db?: Database
): boolean {
  const query = `SELECT 1 FROM ${tableName} WHERE id = ? LIMIT 1`;
  const results = executeQuery(query, [id], db);
  return results.length > 0;
}

/**
 * Count records in a table
 */
export function count(
  tableName: string,
  whereClause?: string,
  params: unknown[] = [],
  db?: Database
): number {
  const where = whereClause ? ` WHERE ${whereClause}` : '';
  const query = `SELECT COUNT(*) as count FROM ${tableName}${where}`;
  const results = executeQuery<{ count: number }>(query, params, db);
  return results.length > 0 ? results[0].count : 0;
}

/**
 * Build a parameterized INSERT query
 */
export function buildInsertQuery(
  tableName: string,
  data: Record<string, unknown>
): { query: string; params: unknown[] } {
  const columns = Object.keys(data);
  const placeholders = columns.map(() => '?').join(', ');
  const params = columns.map((col) => data[col]);

  const query = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;

  return { query, params };
}

/**
 * Build a parameterized UPDATE query
 */
export function buildUpdateQuery(
  tableName: string,
  id: string,
  data: Record<string, unknown>
): { query: string; params: unknown[] } {
  const columns = Object.keys(data);
  const setClause = columns.map((col) => `${col} = ?`).join(', ');
  const params = [...columns.map((col) => data[col]), id];

  const query = `UPDATE ${tableName} SET ${setClause} WHERE id = ?`;

  return { query, params };
}

/**
 * Execute multiple queries in a transaction
 */
export function executeTransaction(
  queries: Array<{ query: string; params?: unknown[] }>,
  db?: Database
): void {
  const database = db || getDatabase();

  try {
    database.run('BEGIN TRANSACTION');

    queries.forEach(({ query, params = [] }) => {
      database.run(query, params);
    });

    database.run('COMMIT');
  } catch (error) {
    database.run('ROLLBACK');
    console.error('Transaction failed, rolled back:', error);
    throw error;
  }
}

/**
 * Get records with pagination
 */
export function getPaginated<T = unknown>(
  tableName: string,
  page: number = 1,
  pageSize: number = 50,
  orderBy?: string,
  whereClause?: string,
  whereParams: unknown[] = [],
  db?: Database
): { data: T[]; total: number; page: number; pageSize: number; totalPages: number } {
  const offset = (page - 1) * pageSize;
  const where = whereClause ? ` WHERE ${whereClause}` : '';
  const order = orderBy ? ` ORDER BY ${orderBy}` : '';

  // Get total count
  const total = count(tableName, whereClause, whereParams, db);

  // Get paginated data
  const query = `SELECT * FROM ${tableName}${where}${order} LIMIT ? OFFSET ?`;
  const data = executeQuery<T>(query, [...whereParams, pageSize, offset], db);

  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}
