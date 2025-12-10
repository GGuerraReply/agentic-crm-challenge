/**
 * Base Repository
 * Generic CRUD operations that can be extended by specific entity repositories
 */

import { Database } from 'sql.js';
import { getDatabase, saveDatabase } from '../database';
import { buildInsertQuery, buildUpdateQuery, executeQuery, getById, getAll, executeDelete } from '../utils';

export interface IRepository<TApp> {
  create(entity: TApp): Promise<TApp>;
  getById(id: string): Promise<TApp | null>;
  getAll(): Promise<TApp[]>;
  update(id: string, entity: Partial<TApp>): Promise<TApp | null>;
  delete(id: string): Promise<boolean>;
}

export abstract class BaseRepository<TApp, TDb> implements IRepository<TApp> {
  protected db: Database;
  protected tableName: string;

  constructor(tableName: string, db?: Database) {
    this.db = db || getDatabase();
    this.tableName = tableName;
  }

  /**
   * Convert application entity to database entity
   * Must be implemented by subclass
   */
  protected abstract toDb(entity: TApp): TDb;

  /**
   * Convert database entity to application entity
   * Must be implemented by subclass
   */
  protected abstract fromDb(dbEntity: TDb): TApp;

  /**
   * Get updated_at timestamp (override if entity doesn't have this field)
   */
  protected getUpdatedAt(): number {
    return Date.now();
  }

  /**
   * Create a new entity
   */
  async create(entity: TApp): Promise<TApp> {
    const dbEntity = this.toDb(entity) as unknown as Record<string, unknown>;
    const { query, params } = buildInsertQuery(this.tableName, dbEntity);

    try {
      this.db.run(query, params);
      saveDatabase(this.db);

      // Retrieve the created entity
      const id = (dbEntity as { id: string }).id;
      const created = await this.getById(id);

      if (!created) {
        throw new Error(`Failed to retrieve created entity with id: ${id}`);
      }

      return created;
    } catch (error) {
      console.error(`Failed to create entity in ${this.tableName}:`, error);
      throw error;
    }
  }

  /**
   * Get entity by ID
   */
  async getById(id: string): Promise<TApp | null> {
    try {
      const dbEntity = getById<TDb>(this.tableName, id, this.db);

      if (!dbEntity) {
        return null;
      }

      return this.fromDb(dbEntity);
    } catch (error) {
      console.error(`Failed to get entity by id from ${this.tableName}:`, error);
      throw error;
    }
  }

  /**
   * Get all entities
   */
  async getAll(orderBy?: string): Promise<TApp[]> {
    try {
      const dbEntities = getAll<TDb>(this.tableName, orderBy, this.db);
      return dbEntities.map((dbEntity) => this.fromDb(dbEntity));
    } catch (error) {
      console.error(`Failed to get all entities from ${this.tableName}:`, error);
      throw error;
    }
  }

  /**
   * Update an entity
   */
  async update(id: string, entity: Partial<TApp>): Promise<TApp | null> {
    try {
      // Get existing entity
      const existing = await this.getById(id);
      if (!existing) {
        return null;
      }

      // Merge with existing and convert to DB format
      const merged = { ...existing, ...entity } as TApp;
      const dbEntity = this.toDb(merged) as unknown as Record<string, unknown>;

      // Update updated_at timestamp
      dbEntity.updated_at = this.getUpdatedAt();

      // Build and execute update query
      const { query, params } = buildUpdateQuery(this.tableName, id, dbEntity);
      this.db.run(query, params);
      saveDatabase(this.db);

      // Return updated entity
      return this.getById(id);
    } catch (error) {
      console.error(`Failed to update entity in ${this.tableName}:`, error);
      throw error;
    }
  }

  /**
   * Delete an entity
   */
  async delete(id: string): Promise<boolean> {
    try {
      const query = `DELETE FROM ${this.tableName} WHERE id = ?`;
      const affected = executeDelete(query, [id], this.db);
      
      if (affected > 0) {
        saveDatabase(this.db);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error(`Failed to delete entity from ${this.tableName}:`, error);
      throw error;
    }
  }

  /**
   * Find entities by a specific field
   */
  async findBy(field: string, value: unknown, orderBy?: string): Promise<TApp[]> {
    try {
      const order = orderBy ? ` ORDER BY ${orderBy}` : '';
      const query = `SELECT * FROM ${this.tableName} WHERE ${field} = ?${order}`;
      const dbEntities = executeQuery<TDb>(query, [value], this.db);
      return dbEntities.map((dbEntity) => this.fromDb(dbEntity));
    } catch (error) {
      console.error(`Failed to find entities by ${field} in ${this.tableName}:`, error);
      throw error;
    }
  }

  /**
   * Count entities matching a condition
   */
  async count(whereClause?: string, params: unknown[] = []): Promise<number> {
    try {
      const where = whereClause ? ` WHERE ${whereClause}` : '';
      const query = `SELECT COUNT(*) as count FROM ${this.tableName}${where}`;
      const results = executeQuery<{ count: number }>(query, params, this.db);
      return results.length > 0 ? results[0].count : 0;
    } catch (error) {
      console.error(`Failed to count entities in ${this.tableName}:`, error);
      throw error;
    }
  }

  /**
   * Check if entity exists
   */
  async exists(id: string): Promise<boolean> {
    try {
      const query = `SELECT 1 FROM ${this.tableName} WHERE id = ? LIMIT 1`;
      const results = executeQuery(query, [id], this.db);
      return results.length > 0;
    } catch (error) {
      console.error(`Failed to check existence in ${this.tableName}:`, error);
      throw error;
    }
  }
}
