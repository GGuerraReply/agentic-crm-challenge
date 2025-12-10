/**
 * Contact Repository
 * Handles CRUD operations and queries for contacts
 */

import { Contact } from '@/crm/types/contact';
import { Database } from 'sql.js';
import { fromDbContact, toDbContact } from '../mappers';
import { DbContact } from '../types';
import { executeQuery } from '../utils';
import { BaseRepository } from './base-repository';

export class ContactRepository extends BaseRepository<Contact, DbContact> {
  constructor(db?: Database) {
    super('contacts', db);
  }

  protected toDb(entity: Contact): DbContact {
    return toDbContact(entity);
  }

  protected fromDb(dbEntity: DbContact): Contact {
    return fromDbContact(dbEntity);
  }

  /**
   * Find contact by email
   */
  async findByEmail(email: string): Promise<Contact | null> {
    const results = await this.findBy('email', email);
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Find contacts by company ID
   */
  async findByCompanyId(companyId: string): Promise<Contact[]> {
    return this.findBy('company_id', companyId, 'name ASC');
  }

  /**
   * Search contacts by name (case-insensitive)
   */
  async searchByName(searchTerm: string): Promise<Contact[]> {
    try {
      const query = `
        SELECT * FROM ${this.tableName}
        WHERE name LIKE ?
        ORDER BY name ASC
      `;
      const dbEntities = executeQuery<DbContact>(
        query,
        [`%${searchTerm}%`],
        this.db,
      );
      return dbEntities.map((dbEntity) => this.fromDb(dbEntity));
    } catch (error) {
      console.error('Failed to search contacts by name:', error);
      throw error;
    }
  }

  /**
   * Find contacts by country
   */
  async findByCountry(country: string): Promise<Contact[]> {
    return this.findBy('country', country, 'name ASC');
  }

  /**
   * Get recently created contacts
   */
  async getRecent(limit: number = 10): Promise<Contact[]> {
    try {
      const query = `
        SELECT * FROM ${this.tableName}
        ORDER BY created_at DESC
        LIMIT ?
      `;
      const dbEntities = executeQuery<DbContact>(query, [limit], this.db);
      return dbEntities.map((dbEntity) => this.fromDb(dbEntity));
    } catch (error) {
      console.error('Failed to get recent contacts:', error);
      throw error;
    }
  }

  /**
   * Get contacts created within a date range
   */
  async findByDateRange(startDate: Date, endDate: Date): Promise<Contact[]> {
    try {
      const query = `
        SELECT * FROM ${this.tableName}
        WHERE created_at >= ? AND created_at <= ?
        ORDER BY created_at DESC
      `;
      const dbEntities = executeQuery<DbContact>(
        query,
        [startDate.getTime(), endDate.getTime()],
        this.db,
      );
      return dbEntities.map((dbEntity) => this.fromDb(dbEntity));
    } catch (error) {
      console.error('Failed to find contacts by date range:', error);
      throw error;
    }
  }

  /**
   * Get contacts for "Leads" tab
   * Simplified: recently updated within today
   */
  async getLeads(): Promise<Contact[]> {
    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    return this.findByDateRange(todayStart, now);
  }

  /**
   * Get contacts for "Follow-ups" tab
   * Simplified: updated within last 7 days
   */
  async getFollowUps(): Promise<Contact[]> {
    const now = new Date();
    const weekStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 7,
    );
    return this.findByDateRange(weekStart, now);
  }

  /**
   * Get contacts for "Pipeline" tab
   * Simplified: updated earlier than 7 days ago
   */
  async getPipeline(): Promise<Contact[]> {
    try {
      const now = new Date();
      const weekStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 7,
      );
      const query = `
        SELECT * FROM ${this.tableName}
        WHERE updated_at < ?
        ORDER BY updated_at DESC
      `;
      const dbEntities = executeQuery<DbContact>(
        query,
        [weekStart.getTime()],
        this.db,
      );
      return dbEntities.map((dbEntity) => this.fromDb(dbEntity));
    } catch (error) {
      console.error('Failed to get pipeline contacts:', error);
      throw error;
    }
  }
}
